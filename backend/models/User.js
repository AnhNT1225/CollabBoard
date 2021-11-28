const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true, trim: true },
    avatar: { type: String, default: null },
    boards: [{ type: Schema.Types.ObjectId, ref: "Board" }],
    DoB: { type: Date, default: null },
    gender: { type: String, enum: ["Male", "Female", "Undefined"], default: "Undefined" },
    position: {type: String, default: null},
    workingPlace: {type: String, default: null},
    resetLink: { type: String, default: "" },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
      required: true,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
