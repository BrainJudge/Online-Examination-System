const Tests = require("../models/Tests");

module.exports.getAllTests = async (req, res) => {
  try {
    const getTests = await Tests.find({});
    const reqData = [];
    getTests.map((test) => {
      let testObj = JSON.parse(JSON.stringify(test));
      testObj.questions?.map((quest) => {
        delete quest["correctAnswer"];
        delete quest["solution"];
      });
      reqData.push(testObj);
    });
    return res.status(200).json({ allTests: reqData });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Unable to fetch all tests", err });
  }
};

module.exports.getTestById = async (req, res) => {
  try {
    const { testId } = req.params;
    if (!testId || testId == "null")
      return res.status(404).json({ message: "Test id not found" });
    const getTest = await Tests.findById(testId);
    if (!getTest) return res.status(404).json({ message: "Test not found" });
    const reqData = JSON.parse(JSON.stringify(getTest));
    reqData.questions?.map((quest) => {
      delete quest["correctAnswer"];
      delete quest["solution"];
    });
    return res.status(200).json({ test: reqData });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Unable to fetch req test", err });
  }
};
