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
      console.log(order);
      res.send(order.id);
    }
  });
};

module.exports = payment;
