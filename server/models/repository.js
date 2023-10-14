const mongoose = require("mongoose");

const repositorySchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    documents: [{ type: mongoose.Schema.Types.ObjectId, ref: "Document" }],
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

const Repository = mongoose.model("Repository", repositorySchema);

module.exports = Repository;
