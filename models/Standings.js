const { model, Schema } = require("mongoose");
const ObjectId = Schema.Types.ObjectId;

const standingSchema = new Schema({
  testId: ObjectId,
  users: [
    {
      name: String,
      email: String,
      score: Number,
    },
  ],
});

module.exports = model("standings", standingSchema);
