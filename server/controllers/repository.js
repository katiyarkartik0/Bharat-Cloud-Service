const { Validator } = require("../helpers/validator");
const Repository = require("../models/repository");
const User = require("../models/user");

const validateSharedAccessUsers = ({ sharedAccessUsers }) => {
  const { inputValidation } = new Validator();
  for (let i = 0; i < sharedAccessUsers.length; i++) {
    const { isInputValid, msg: inputValidationErrorMsg } = inputValidation({
      email: sharedAccessUsers[i],
    });
    if (!isInputValid) {
      return { isInputValid, msg: inputValidationErrorMsg };
    }
  }
  return {
    isInputValid: true,
  };
};

const validateCustomTags = ({ customTags }) => {
  const { inputValidation } = new Validator();

  for (let i = 0; i < customTags.length; i++) {
    const { isInputValid, msg: inputValidationErrorMsg } = inputValidation({
      tag: customTags[i],
    });
    if (!isInputValid) {
      return { isInputValid, msg: inputValidationErrorMsg };
    }
  }
  return {
    isInputValid: true,
  };
};

const extractNonEmptyValidInputs = ({
  repositoryId,
  name,
  description,
  accessType,
  sharedAccessUsers,
  customTags,
}) => {
  let nonEmptyValidInputs = {};
  if (repositoryId) {
    nonEmptyValidInputs = { ...nonEmptyValidInputs, repositoryId };
  }
  if (name) {
    nonEmptyValidInputs = { ...nonEmptyValidInputs, name };
  }
  if (description) {
    nonEmptyValidInputs = { ...nonEmptyValidInputs, description };
  }
  if (accessType) {
    nonEmptyValidInputs = { ...nonEmptyValidInputs, accessType };
  }
  if (sharedAccessUsers) {
    const { isInputValid, msg: inputValidationErrorMsg } =
      validateSharedAccessUsers({ sharedAccessUsers });
    if (!isInputValid) {
      return { isInputValid, inputValidationErrorMsg };
    }
    nonEmptyValidInputs = { ...nonEmptyValidInputs, sharedAccessUsers };
  }
  if (customTags) {
    const { isInputValid, msg: inputValidationErrorMsg } = validateCustomTags({
      customTags,
    });
    if (!isInputValid) {
      return { isInputValid, inputValidationErrorMsg };
    }
    nonEmptyValidInputs = { ...nonEmptyValidInputs, customTags };
  }

  return { isInputValid: true, nonEmptyValidInputs };
};

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
    console.log(error)
    return res.status(500).json({ msg: JSON.stringify(error) });
  }
};

const createRepository = async (req, res) => {
  if (req.verified == false) {
    return res.status(403).send(req.msg);
  }
  const {
    name,
    description,
    accessType = "public",
    sharedAccessUsers = [],
    customTags = [],
  } = req.body;

  const { inputValidation } = new Validator();
  const { isInputValid, msg: inputValidationErrorMsg } = inputValidation({
    name,
    description: description ? description : `A ${name} repository.`,
    accessType,
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

module.exports = { createRepository, updateRepository, getRepositories };
