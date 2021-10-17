const Results = require("../models/UserResults");
const Tests = require("../models/Tests");

module.exports.addTestStatus = async (req, res) => {
  try {
    const { userId, testId } = req.body;
    if (!userId || !testId)
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

    getQuest["attemptedAns"] = attemptedAnsId;
    getQuest["attempted"] = true;
    getUserResult.save();

    console.log(getQuest);

    const reqData = JSON.parse(JSON.stringify(getTest));
    reqData.questions?.map((quest) => {
      delete quest["correctAns"];
      delete quest["marks"];
    });
    return res
      .status(201)
      .json({ message: "Answer Submitted", testStatus: reqData });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Unable to submit answer" });
  }
};
