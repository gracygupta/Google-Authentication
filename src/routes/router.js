const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
require("../controller/passportAuth");
const auth = require("../middleware/auth");
const razorpay = require("../controller/razorpay");
const Student = require("../model/student");

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
      { id: req.user._id },
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
  async (req, res) => {
    console.log(req.body.userId);
    let existingUser = await Student.findOne({ _id: req.body.userId });
    console.log("stud", existingUser, existingUser.details.leader);
    res.render("details", {
      token: req.params.token,
      lname: existingUser.details.leader.name,
      lemail: existingUser.details.leader.email,
    });
  }
);

router.post("/details/:token", auth, async (req, res) => {
  let existingUser = await Student.findOne({ _id: req.body.userId });
  await Student.updateOne(
    { _id: req.body.userId },
    {
      details: {
        team_name: req.body.team_name,
        teammate: { name: req.body.tname, email: req.body.temail },
        leader: {
          name: existingUser.details.leader.name,
          email: existingUser.details.leader.email,
        },
      },
    }
  );
  res.redirect(`/payment/${req.params.token}`);
});

router.get("/payment/:token", auth, razorpay.payment);

router.post("/checkout/pay_verify/:token", auth, razorpay.payment_verify);

router.get("/review/:token", auth, async (req, res) => {
  const student = await Student.findOne({ _id: req.body.userId });
  res.render("review", {
    token: req.params.token,
    lprofile: student.google.image,
    team_name: student.details.team_name,
    leader_name: student.details.leader.name,
    leader_email: student.details.leader.email,
    teammate_name: student.details.teammate.name,
    teammate_email: student.details.teammate.email,
  });
});

router.get("/review/submit/:token", auth, function (req, res) {
  res.render("submit");
});

module.exports = router;
