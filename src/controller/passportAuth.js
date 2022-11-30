var GoogleStrategy = require("passport-google-oauth20").Strategy;
const Student = require("../model/student");
require("dotenv").config();

const jwtStrategy = require("passport-jwt").Strategy;
const { ExtractJwt } = require("passport-jwt");

const clientID = process.env.clientID;
const clientSecret = process.env.clientSecret;
const url = process.env.URL;

module.exports = (passport) => {
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
          const newUser = new Student({
            method: "google",
            google: {
              id: profile.id,
              name: profile.displayName,
              email: profile.emails[0].value,
              image: profile._json.picture,
            },
            details: {
              leader: {
                name: profile.displayName,
                email: profile.emails[0].value,
              },
            },
          });
          await newUser.save();
          return done(null, newUser);
        } catch (error) {
          return done(error, false);
        }
      }
    )
  );
  passport.use(
    new jwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromHeader("authorization"),
        secretOrKey: "secretKey",
      },
      async (jwtPayload, done) => {
        try {
          // Extract user
          const user = jwtPayload.user;
          console.log(user);
          done(null, user);
        } catch (error) {
          done(error, false);
        }
      }
    )
  );
};
