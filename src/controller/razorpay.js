const Razorpay = require("razorpay");
require("dotenv").config();

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
      console.log(instance.orders.all());
      res.render("checkout", { amount: order.amount, order_id: order.id });
    }
  });
};

// const payment_verify = async (req, res) => {
//   body = req.body.razorpay_order_id + "|" + req.body.razorpay_payment_id;
//   var crypto = require("crypto");
//   var expectedSignature = crypto.createHmac();
// };

module.exports = payment;
