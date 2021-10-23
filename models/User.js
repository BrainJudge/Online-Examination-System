const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  method: {
    type: String,
    enum: ["google"],
    required: true,
  },
  google: {
    id: String,
    name: String,
    email: String,
    token: String,
  },
});

module.exports = model("users", userSchema);
