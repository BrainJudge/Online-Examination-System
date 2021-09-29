const { Router } = require("express");
const passport = require("passport");

const router = Router();

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
    res.redirect(process.env.CLIENT_ORIGIN + "/auth/" + userId);
  }
);

module.exports = router;
