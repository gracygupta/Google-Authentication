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
    image: {
      type: String,
    },
  },
  details: {
    leader: {
      name: {
        type: String,
      },
      email: {
        type: String,
      },
    },
    teammate: {
      name: {
        type: String,
        default: null,
      },
      email: {
        type: String,
        default: null,
      },
    },
  },
});
const Student = mongoose.model("Student", studentSchema);
module.exports = Student;
