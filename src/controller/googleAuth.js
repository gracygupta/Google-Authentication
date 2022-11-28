var GoogleStrategy = require("passport-google-oauth20").Strategy;
const Student = require("../model/student");
const passport = require("passport");
require("dotenv").config();

const clientID = process.env.clientID;
const clientSecret = process.env.clientSecret;
const url = process.env.URL;

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: clientID,
      clientSecret: clientSecret,
      callbackURL: url,
      passReqToCallback: true,
    },
    async (request, accessToken, refreshToken, profile, done) => {
      try {
        let existingUser = await Student.findOne({ "google.id": profile.id });
        // if user exists return the user
        if (existingUser) {
          return done(null, existingUser);
        }
        // if user does not exist create a new user
        console.log("Creating new user...");
        const newStudent = new Student({
          method: "google",
          google: {
            id: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
          },
        });
        await newStudent.save();
        return done(null, newStudent);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);
