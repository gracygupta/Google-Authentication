const jwt = require("jsonwebtoken");
const SECRET_KEY = "secretKey";

const auth = (req, res, next) => {
  try {
    let token = req.params.token;
    if (token) {
      let user = jwt.verify(token, SECRET_KEY);
      if (user) {
        req.body.userId = user.id;

        console.log("User Authorized");
        next();
      }
    } else {
      console.log("Token expire or Unauthorized User");
      res.redirect("/");
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

module.exports = auth;
