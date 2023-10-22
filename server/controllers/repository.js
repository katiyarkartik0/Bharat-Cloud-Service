const {
  validateSharedAccessUsers,
  validateCustomTags,
  extractNonEmptyValidInputs,
} = require("../helpers/reposAndDocs");
const { Validator } = require("../helpers/validator");
const Repository = require("../models/repository");
const User = require("../models/user");

const getRepositories = async (req, res) => {
  if (req.verified == false) {
    return res.status(403).send(req.msg);
  }
  try {
    const { repositories } = await User.findOne({ _id: req.id }).populate(
      "repositories"
    );
    return res.status(200).json({ repositories });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: JSON.stringify(error) });
  }
};

const getRepository = async (req, res) => {
  if (req.verified == false) {
    return res.status(403).send(req.msg);
  }
  const { repositoryId } = req.params;
  if (!repositoryId) {
    return res.send(400).json({ msg: "Please send a valid repository id" });
  }
  try {
    const repository = await Repository.findOne({ _id: repositoryId });
    return res.status(200).json({ repository });
  } catch (error) {
    return res.status(500).json({ msg: JSON.stringify(error) });
  }
};

const createRepository = async (req, res) => {
  if (req.verified == false) {
    return res.status(403).send(req.msg);
  }
  const {
    name,
    description = `A ${name} repository.`,
    accessType = "public",
    sharedAccessUsers = [],
    customTags = [],
  } = req.body;

  const { inputValidation } = new Validator();
  const { isInputValid, msg: inputValidationErrorMsg } = inputValidation({
    name,
  });
  if (!isInputValid) {
    return res.status(400).json({ msg: inputValidationErrorMsg });
  }
  if (accessType === "shared" && sharedAccessUsers.length > 0) {
    const { isInputValid, msg: inputValidationErrorMsg } =
      validateSharedAccessUsers({ sharedAccessUsers });
    if (!isInputValid) {
      return res.status(400).json({ msg: inputValidationErrorMsg });
    }
  }
  if (customTags.length > 0) {
    const { isInputValid, msg: inputValidationErrorMsg } = validateCustomTags({
      customTags,
    });
    if (!isInputValid) {
      return res.status(400).json({ msg: inputValidationErrorMsg });
    }
  }

  try {
    const newRepository = new Repository({
      name,
      description,
      accessType,
      sharedAccessUsers,
      customTags,
    });
    const { _id: repositoryId } = await newRepository.save();
    const userId = req.id;
    await User.findOneAndUpdate(
      { _id: userId },
      { $push: { repositories: repositoryId } }
    );
    return res
      .status(200)
      .json({ msg: "Repository created and added Successfully!" });
  } catch (error) {
    return res.status(500).json({ msg: JSON.stringify(error) });
  }
};

const updateRepository = async (req, res) => {
  if (req.verified == false) {
    return res.status(403).send(req.msg);
  }

  const { isInputValid, nonEmptyValidInputs, inputValidationErrorMsg } =
    extractNonEmptyValidInputs(req.body);

  if (!isInputValid) {
    return res.status(400).json({ msg: inputValidationErrorMsg });
  }
  const { repositoryId } = req.body;

  try {
    await Repository.findOneAndUpdate(
      { _id: repositoryId },
      nonEmptyValidInputs
    );
    return res
      .status(200)
      .json({ msg: "Repository has been updated successfully" });
  } catch (error) {
    return res.status(500).json({ msg: JSON.stringify(error) });
  }
};

const deleteRepository = async (req, res) => {
  if (req.verified == false) {
    return res.status(403).send(req.msg);
  }
  const userId = req.id;
  const { repositoryId } = req.params;
  if (!repositoryId) {
    return res.send(400).json({ msg: "Please send a valid repository id" });
  }
  try {
    await Repository.deleteOne({ _id: repositoryId });
    await User.findOneAndUpdate(
      { _id: userId },
      { $pull: { repositories: repositoryId } }
    );
    return res
      .status(200)
      .json({ msg: "Repository has been deleted successfully" });
  } catch (error) {
    return res.status(500).json({ msg: JSON.stringify(error) });
  }
};

module.exports = {
  getRepository,
  createRepository,
  updateRepository,
  getRepositories,
  deleteRepository,
};
