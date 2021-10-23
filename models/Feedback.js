const { model, Schema } = require("mongoose");

const feedBackSchema = new Schema({
  name: String,
  email: String,
  rating: Number,
  feedback: String,
});

module.exports = model("feedback", feedBackSchema);
