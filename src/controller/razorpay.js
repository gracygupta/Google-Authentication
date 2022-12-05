const { send } = require("process");
const Razorpay = require("razorpay");
require("dotenv").config();
const Student = require("../model/student");

const instance = new Razorpay({
  key_id: process.env.razorpay_key_id,
  key_secret: process.env.razorpay_key_secret,
});

const payment = async (req, res) => {
  var option = {
    amount: 20 * 100,
    currency: "INR",
  };
  instance.orders.create(option, function (err, order) {
    if (err) {
      console.log(err);
    } else {
      res.render("checkout", {
        amount: order.amount,
        order_id: order.id,
        token: req.params.token,
      });
    }
  });
};

const payment_verify = async (req, res) => {
  body = req.body.razorpay_order_id + "|" + req.body.razorpay_payment_id;
  console.log(req.body);
  // res.redirect("/login");
  var crypto = require("crypto");
  var expectedSignature = crypto
    .createHmac("sha256", "Wok5mJv2F0pa5HKLeXZfUr9r")
    .update(body.toString())
    .digest("hex");
  // console.log(expectedSignature);
  if (expectedSignature == req.body.razorpay_signature) {
    console.log("Payment is successful");
  }

  await Student.updateOne(
    { _id: req.body.userId },
    {
      payment: {
        payment_id: req.body.razorpay_payment_id,
        order_id: req.body.razorpay_order_id,
        signature: req.body.razorpay_signature,
      },
    }
  );
};

module.exports = { payment, payment_verify };
