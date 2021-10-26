const { model, Schema } = require("mongoose");

const testSchema = new Schema({
  creatorId: String,
  testName: String,
  testType: String,
  startTime: Date,
  endTime: Date,
  testDuration: Number,
  totalQuestions: Number,
  resultPublish: {
    type: Boolean,
    default: false,
  },
  questions: [
    {
      pattern: String,
      passage: String,
      question: String,
      images: Array,
      options: [
        {
          option: String,
          optionId: String,
        },
      ],
      marks: Number,
      topic: String,
      correctAnswer: String,
      solution: String,
    },
  ],
});

module.exports = model("tests", testSchema);
