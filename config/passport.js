const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

//passport template code
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
      proxy: true,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const domain = profile._json.hd;
        if (domain != "nitjsr.ac.in")
          return done("Invalid Domain, Please Login Using Institute Id");

        //Signing In
        const existingUser = await User.findOne({
          "google.id": profile.id,
        });
        if (existingUser) return done(null, existingUser);

        //Sign-up google
        const newUser = new User({
          method: "google",
          google: {
            id: profile.id,
            name: profile.displayName,
            email: email,
            token: accessToken,
          },
        });
        await newUser.save();
        done(null, newUser);
      } catch (err) {
        console.log(err.message);
        done(err, false, err.message);
      }
    }
  )
);
