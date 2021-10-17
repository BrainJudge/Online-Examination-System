const { model, Schema } = require("mongoose");

const ObjectId = Schema.Types.ObjectId;
const userResultSchema = new Schema(
  {
    userId: ObjectId,
    tests: [
      {
        testId: ObjectId,
        startTime: {
          type: Date,
          default: Date.now,
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
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

module.exports = model("userResults", userResultSchema);
