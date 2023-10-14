const mongoose = require("mongoose");

const documentSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    version: { type: Number },
    description: { type: String },
    uploadedFile: {
      fileName: { type: String },
      contentType: { type: String },
    },
    accessType: {
      type: String,
      enum: ["public", "private", "shared"],
      required: true,
    },
    sharedAccessUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    customTags: [{ type: String }],
  },
  { timestaps: true }
);

const Document = mongoose.model("Document", documentSchema);

module.exports = Document;
