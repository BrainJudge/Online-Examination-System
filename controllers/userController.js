const User = require("../models/User");

module.exports.getUserById = async (req, res) => {
  const { userId } = req.body;
  try {
    if (!userId)
      return res
        .status(404)
        .json({ message: "Invalid UserId, Please Try Again" });
    const getUser = await User.findById(userId);
    if (!getUser) return res.status(404).json({ message: "User not found" });
    return res.status(201).json({ user: getUser });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
