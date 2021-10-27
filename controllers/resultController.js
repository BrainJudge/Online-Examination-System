const Results = require("../models/UserResults");
const Tests = require("../models/Tests");
const Standings = require("../models/Standings");

module.exports.addTestStatus = async (req, res) => {
  try {
    const { userId, name, email, testId } = req.body;
    if (!userId || !testId || !name || !email)
      return res.status(404).json({ message: "Ids not found" });

    const getUserResult = await Results.findOne({ userId });
    if (!!getUserResult) {
      const getTest = getUserResult.tests?.find(
        (test) => test.testId == testId
      );
      if (!!getTest)
        return res.status(403).json({ message: "Already Attempted" });
    }

    const getReqTest = await Tests.findById(testId);
    if (!getReqTest)
      return res.status(404).json({ message: "No test created with that id" });

    const newTestResult = {};
    newTestResult["testId"] = testId;

    const questions = [];
    getReqTest.questions?.map((quest) => {
      let data = {
        questionId: quest._id,
        correctAns: quest.correctAnswer,
        marks: quest.marks,
      };
      questions.push(data);
    });

    newTestResult["questions"] = questions;

    if (!!getUserResult) {
      getUserResult.tests.push(newTestResult);
      getUserResult.save();
      return res.status(201).json({ message: "Test Status Initialized" });
    }

    //creating new result
    const newUser = await new Results({
      userId: userId,
      name,
      email,
      tests: [{ ...newTestResult }],
    });
    await newUser.save();
    return res.status(201).json({ message: "New UserResult Initialized" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Unable to initialize test", err });
  }
};

module.exports.getStatus = async (req, res) => {
  try {
    const { userId, testId } = req.body;
    if (!userId || !testId)
      return res.status(404).json({ message: "Ids not found" });
    const getUserResult = await Results.findOne({ userId });
    if (!getUserResult)
      return res.status(404).message({ message: "User not found" });
    const getTest = getUserResult.tests?.find((test) => test.testId == testId);
    if (!getTest) return res.status(404).json({ message: "Test not found" });

    const reqData = JSON.parse(JSON.stringify(getTest));
    reqData.questions?.map((quest) => {
      delete quest["correctAns"];
      delete quest["marks"];
    });
    return res.status(201).json({ testStatus: reqData });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Unable to get status", err });
  }
};

module.exports.submitAnswer = async (req, res) => {
  try {
    const { userId, testId, questionId, attemptedAnsId } = req.body;

    if (!userId || !testId || !questionId || !attemptedAnsId)
      return res.status(404).json({ message: "Inputs missing" });

    //finding reqUser result
    const getUserResult = await Results.findOne({ userId });
    if (!getUserResult)
      return res.status(404).message({ message: "User not found" });

    //finding required test
    const getTest = getUserResult.tests?.find((test) => test.testId == testId);
    if (!getTest) return res.status(404).json({ message: "Test not found" });

    //finding required question
    const getQuest = getTest.questions?.find(
      (quest) => quest.questionId == questionId
    );
    if (!getQuest)
      return res.status(404).json({ message: "Question not found" });

    const prevScore = getQuest["score"];
    const newScore =
      attemptedAnsId === getQuest["correctAns"] ? getQuest["marks"] : 0;
    getQuest["score"] = newScore;
    getTest["totalScore"] = getTest["totalScore"] - prevScore + newScore;

    getQuest["attemptedAns"] = attemptedAnsId;
    getQuest["attempted"] = true;

    getUserResult.save();
    const reqData = JSON.parse(JSON.stringify(getTest));
    delete reqData["totalScore"];
    reqData.questions?.map((quest) => {
      delete quest["correctAns"];
      delete quest["marks"];
      delete quest["score"];
    });
    return res
      .status(201)
      .json({ message: "Answer Submitted", testStatus: reqData });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Unable to submit answer" });
  }
};

module.exports.getStandings = async (req, res) => {
  try {
    const { testId } = req.params.id;
    const getResults = await Standings.findOne({ testId }).sort({
      "users.score": -1,
    });
    if (!getResults || !getResults.users || getResults.users.length === 0)
      return res.status(404).json({ message: "Standings not available" });

    const standings = JSON.parse(JSON.stringify(getResults.users));
    standings[0].rank = 1;

    for (let i = 1; i < standings.length; i++) {
      if (standings[i]["score"] === standings[i - 1]["score"])
        standings[i]["rank"] = standings[i - 1]["rank"];
      else standings[i]["rank"] = i + 1;
    }

    return res.status(200).json({ standings });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports.getMyResult = async (req, res) => {
  try {
    const { userId, testId } = req.body;
    if (!userId || !testId)
      return res.status(404).json({ messgae: "Id missing" });
    const getUser = await Results.findOne({ userId });
    if (!getUser) return res.status(404).json({ message: "User not found" });
    const getTest = getUser.tests?.find((test) => test.testId == testId);
    if (!getTest) return res.status(404).json({ message: "Test not found" });

    var attempted = 0;
    var corrected = 0;
    var totalQuest = getTest.questions?.length || 0;
    var totalScore = 0;
    var totalMarks = 0;

    getTest.questions?.forEach((quest) => {
      totalMarks += quest["marks"];
      if (quest["attempted"]) {
        attempted++;
        if (quest["correctAns"] === quest["attemptedAns"]) {
          corrected++;
          totalScore += quest["marks"];
        }
      }
    });
    var accuracy = 0;
    if (attempted !== 0) {
      accuracy = ((corrected / attempted) * 100).toFixed(2);
    }
    var percentage = 0;
    if (totalMarks !== 0) {
      percentage = ((totalScore / totalMarks) * 100).toFixed(2);
    }

    var rank = 0;
    var averageScore = 0;
    var percentile = 0;

    const standings = await Standings.findOne({ testId }).sort({
      "users.score": -1,
    });

    if (!!standings) {
      let totalScoreSum = 0;
      let studentMarksGreater = 0;
      let studentMarksLess = 0;
      let totalUsers = standings.users?.length || 0;
      standings.users?.forEach((user) => {
        let score = user.score;
        if (!!score) {
          totalScoreSum += score;
          if (score > totalScore) studentMarksGreater++;
          if (score <= totalScore) studentMarksLess++;
        }
      });
      if (totalUsers !== 0) {
        percentile = ((studentMarksLess / totalUsers) * 100).toFixed(2);
        rank = studentMarksGreater + 1;
        averageScore = (totalScoreSum / totalUsers).toFixed(2);
      }
    }

    const getTestAnswers = await Tests.findById(testId);
    if (!getTestAnswers)
      return res.status(404).json({ message: "Unable to find test" });

    var questAns = JSON.parse(JSON.stringify(getTestAnswers.questions));
    getTest.questions?.forEach((quest) => {
      const questId = quest.questionId;
      const attemptedAns = quest.attemptedAns;
      questAns?.forEach((allQuest) => {
        if (allQuest._id == questId) {
          allQuest["attemptedAns"] = attemptedAns;
        }
      });
    });

    const rankTally = JSON.parse(JSON.stringify(standings.users));
    rankTally[0].rank = 1;

    for (let i = 1; i < rankTally.length; i++) {
      if (rankTally[i]["score"] === rankTally[i - 1]["score"])
        rankTally[i]["rank"] = rankTally[i - 1]["rank"];
      else rankTally[i]["rank"] = i + 1;
    }

    const userResultData = {
      totalQuest,
      totalMarks,
      attempted,
      corrected,
      totalScore,
      accuracy: parseFloat(accuracy),
      percentage: parseFloat(percentage),
      rank,
      averageScore: parseFloat(averageScore),
      percentile: parseFloat(percentile),
      questAns,
      rankTally,
      testName: getTestAnswers.testName,
      testType: getTestAnswers.testType,
      testDuration: getTestAnswers.testDuration,
    };
    return res.status(201).json({ userResult: userResultData });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Unable to fetch Result" });
  }
};
