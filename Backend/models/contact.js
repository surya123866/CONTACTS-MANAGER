const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      match: /^[A-Za-z]+$/,
      default: "",
    },
    lastName: {
      type: String,
      required: true,
      match: /^[A-Za-z]+$/,
      default: "",
    },
    email: { type: String, required: true, unique: true, match: /.+\@.+\..+/ },
    phone: { type: String, required: true, unique: true, match: /^[0-9]+$/ },
    address: { type: String },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);


module.exports = mongoose.model("Contact", contactSchema);
