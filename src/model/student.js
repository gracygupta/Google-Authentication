const mongoose = require("mongoose");

//defining structure
const studentSchema = new mongoose.Schema({
  google: {
    id: {
      type: String,
    },
    name: {
      type: String,
    },
    email: {
      type: String,
    },
  },
});
const Student = mongoose.model("Student", studentSchema);
module.exports = Student;
