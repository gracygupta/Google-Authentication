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
    team_name: { type: String, default: null },
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
  payment: {
    payment_id: {
      type: String,
      default: null,
    },
    order_id: {
      type: String,
      default: null,
    },
    signature: {
      type: String,
      default: null,
    },
  },
});
const Student = mongoose.model("Student", studentSchema);
module.exports = Student;
