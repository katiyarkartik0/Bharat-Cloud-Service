const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    repository: [{ type: mongoose.Schema.Types.ObjectId, ref: "Repository" }],
  },
  { timestaps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User; 