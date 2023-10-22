const { putObjectUrl } = require("../helpers/AWS");
const {
  validateSharedAccessUsers,
  validateCustomTags,
  extractNonEmptyValidInputs,
} = require("../helpers/reposAndDocs");
const { Validator } = require("../helpers/validator");
const Document = require("../models/document");
const Repository = require("../models/repository");

const getDocuments = async (req, res) => {
  if (req.verified == false) {
    return res.status(403).send(req.msg);
  }
  const repositoryId = req.query.repositoryId;
  if (!repositoryId) {
    return res.status(400).send({ msg: "please provide a valid repositoryId" });
  }
  try {
    const { documents } = await Repository.findOne({
      _id: repositoryId,
    }).populate("documents");
    return res.status(200).json({ documents });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: JSON.stringify(error) });
  }
};
const getDocument = async (req, res) => {
  if (req.verified == false) {
    return res.status(403).send(req.msg);
  }
  const { documentId } = req.params;
  if (!documentId) {
    return res.send(400).json({ msg: "Please send a valid documentId id" });
  }
  try {
    const document = await Document.findOne({ _id: documentId });
    return res.status(200).json({ document });
  } catch (error) {
    return res.status(500).json({ msg: JSON.stringify(error) });
  }
};
const createDocument = async (req, res) => {
  if (req.verified == false) {
    return res.status(403).send(req.msg);
  }

  const {
    uploadedFile: { fileName, contentType },
    name,
    description = `a ${name} document`,
    accessType = "public",
    sharedAccessUsers = [],
    customTags = [],
    repositoryId,
  } = req.body;

  const { inputValidation } = new Validator();
  const { isInputValid, msg: inputValidationError } = inputValidation({
    name,
    repositoryId,
  });
  if (!isInputValid) {
    return res.status(400).json({ msg: inputValidationError });
  }

  const { isSharedAccessValid, msg: isSharedAccessValidError } =
    validateSharedAccessUsers({ sharedAccessUsers });
  if (!isSharedAccessValid) {
    return res.status(400).json({ msg: isSharedAccessValidError });
  }

  const { isCustomTagsValid, msg: isCustomTagsValidError } = validateCustomTags(
    { customTags }
  );
  if (!isCustomTagsValid) {
    return res.status(400).json({ msg: isCustomTagsValidError });
  }

  try {
    const documents = await Document.find({ name });
    const latestVersion = documents.reduce((maxVersion, document) => {
      const currentVersion = parseFloat(document.version);
      return currentVersion > maxVersion ? currentVersion : max;
    }, 0);

    const newDocument = new Document({
      name,
      version: latestVersion + 1,
      description,
      uploadedFile,
      accessType,
      sharedAccessUsers,
      customTags,
    });
    const { _id: documentId } = await newDocument.save();
    await Repository.findOneAndUpdate(
      { _id: repositoryId },
      { $push: { documents: documentId } }
    );
    const preSignedPUTUrl = await putObjectUrl({ fileName, contentType });
    return res.status(200).json({
      preSignedPUTUrl,
      msg: "Document created and added Successfully!",
    });
  } catch (error) {
    return res.status(500).json({
      msg: JSON.stringify(error),
    });
  }
};
const updateDocument = async (req, res) => {
  if (req.verified == false) {
    return res.status(403).send(req.msg);
  }

  const { isInputValid, nonEmptyValidInputs, inputValidationErrorMsg } =
    extractNonEmptyValidInputs(req.body);

  if (!isInputValid) {
    return res.status(400).json({ msg: inputValidationErrorMsg });
  }
  const { documentId } = req.body;

  try {
    await Document.findOneAndUpdate({ _id: documentId }, nonEmptyValidInputs);
    return res
      .status(200)
      .json({ msg: "Document has been updated successfully" });
  } catch (error) {
    return res.status(500).json({ msg: JSON.stringify(error) });
  }
};
const deleteDocument = async (req, res) => {
  if (req.verified == false) {
    return res.status(403).send(req.msg);
  }
  const userId = req.id;
  const { documentId } = req.params;
  if (!documentId) {
    return res.send(400).json({ msg: "Please send a valid documentId id" });
  }
  try {
    await Document.deleteOne({ _id: documentId });
    await Repository.findOneAndUpdate(
      { _id: userId },
      { $pull: { documents: documentId } }
    );
    return res
      .status(200)
      .json({ msg: "Document has been deleted successfully" });
  } catch (error) {
    return res.status(500).json({ msg: JSON.stringify(error) });
  }
};

module.exports = {
  createDocument,
  getDocument,
  getDocuments,
  updateDocument,
  deleteDocument,
};
