const Feedback = require("../models/Feedback");

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
