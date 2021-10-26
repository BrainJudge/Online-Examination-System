const { model, Schema } = require("mongoose");

const ObjectId = Schema.Types.ObjectId;
const userResultSchema = new Schema(
  {
    userId: ObjectId,
    name: String,
    email: String,
    tests: [
      {
        testId: ObjectId,
        startTime: {
          type: Date,
          default: Date.now,
        },
        totalScore: {
          type: Number,
          default: 0,
        },
        questions: [
          {
            questionId: ObjectId,
            attempted: {
              type: Boolean,
              default: false,
            },
            attemptedAns: String,
            correctAns: String,
            marks: Number,
            score: {
              type: Number,
              default: 0,
            },
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

module.exports = model("userResults", userResultSchema);
