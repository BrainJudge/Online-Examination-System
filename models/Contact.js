const { model, Schema } = require("mongoose");

const contactSchema = new Schema({
  email: String,
  message: String,
});

module.exports = model("contact", contactSchema);
