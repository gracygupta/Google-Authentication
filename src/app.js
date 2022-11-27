const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();
const port = process.env.PORT;

const app = express();

app.listen(port, function () {
  console.log(`Server is up at ${port}`);
});
