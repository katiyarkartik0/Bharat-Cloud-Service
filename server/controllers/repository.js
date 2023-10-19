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
      { $push: { repository: repositoryId } }
    );
    return res
      .status(200)
      .json({ msg: "Repository created and added Successfully!" });
  } catch (error) {
    return res.status(500).json({ msg: JSON.stringify(error) });
  }
};

module.exports = { createRepository };
