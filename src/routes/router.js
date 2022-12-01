const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
require("../controller/passportAuth");
const auth = require("../middleware/auth");
const razorpay = require("../controller/razorpay");

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
    session: false,
    failureRedirect: "/login",
  }),
  (req, res) => {
    jwt.sign(
      { user: req.user },
      "secretKey",
      { expiresIn: "1h" },
      (err, token) => {
        if (err) {
          return res.json({
            token: null,
          });
        }
        res.redirect(`/details/${token}`);
        // res.json({
        //   token: token,
        // });
      }
    );
  }
);
// details route after successful sign in
router.get(
  "/details/:token",
  auth,
  // passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.render("fill_details", { token: req.params.token });
  }
);

router.post("/details/:token", auth, (req, res) => {
  console.log(req.body);
  res.redirect(`/payment/${req.params.token}`);
});

router.get("/payment/:token", auth, razorpay);

module.exports = router;
