const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    attending: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ngo",
      },
    ],
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      required: true,
    },
    password: {
      type: String,
      unique: true,
      lowercase: true,
      required: true,
    },
    goalAmount: {
      type: Number,
    },
    following: {
      type: [String],
    },
    donations: {
      type: [String],
    },
    host: {
      type: [String],
    },
    ngos: {
      type: [String],
    },
    calendar: {
      type: [String],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
