const { Router } = require("express");
const passport = require("passport");
const userController = require("../controllers/userController");

const router = Router();

/*Base Api --> /auth */

//GOOGLE Routes
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/",
    session: false,
  }),
  function (req, res) {
    let userId = req.user._id;
    return res.redirect(process.env.CLIENT_ORIGIN + "/auth/google/" + userId);
  }
);

//get user by id
router.post("/getUserById", userController.getUserById);

module.exports = router;
