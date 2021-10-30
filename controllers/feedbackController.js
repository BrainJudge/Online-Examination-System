const Feedback = require("../models/Feedback");
const Contact = require("../models/Contact");

module.exports.getFeedBack = async (req, res) => {
  try {
    const { name, email, rating, feedback } = req.body;
    if (!name || !email || !rating || !feedback)
      return res.status(404).json({ message: "Inputs Missing" });
    const newFeedback = await new Feedback({
      name,
      email,
      rating,
      feedback,
    });
    await newFeedback.save();
    return res.status(201).json({ message: "Feedback Received!!" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Unable to send feedback", err });
  }
};

module.exports.contact = async (req, res) => {
  try {
    const { email, message } = req.body;
    if (!email) return res.status(404).json({ message: "Email Required" });
    if (!message) return res.status(404).json({ message: "Type any message" });

    const emailValidationRegex =
      /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
    if (!email.match(emailValidationRegex))
      return res.status(400).json({ message: "Invalid Email" });

    const newContact = await new Contact({ email, message });
    await newContact.save();
    return res.status(201).json({ message: "Sent!!" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Unable to send message", err });
  }
};
