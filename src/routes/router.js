const express = require("express");
const router = express.Router();
const passport = require("passport");
require("../controller/googleAuth").googleAuth;

//home route
router.get("/", function (req, res) {
  res.redirect("/login");
});

//login page
router.get("/login", function (req, res) {
  res.render("login");
});

// Redirect the user to the Google signin page
router.get(
  "/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);
// Retrieve user data using the access token received
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    failureMessage: true,
  }),
  (req, res) => {
    res.redirect("/profile");
  }
);
// profile route after successful sign in
router.get("/profile", (req, res) => {
  console.log(req);
  res.send("Welcome");
});

module.exports = router;
