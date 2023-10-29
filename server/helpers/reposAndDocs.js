const Document = require("../models/document");
const User = require("../models/user");
const { Validator } = require("./validator");

const getAllRepositoriesAndDocumentIds = async ({ userIds, userId }) => {
  let allRepositories = [];
  let allDocumentIds = [];

  for (const currentUserId of userIds) {
    const { repositories } = await User.findOne({
      _id: currentUserId,
    }).populate("repositories");

    if (currentUserId === userId) {
      allRepositories = [...allRepositories, ...repositories];

      repositories.forEach(({ documents }) => {
        allDocumentIds = [...allDocumentIds, ...documents];
      });
    } else if (currentUserId !== userId) {
      const validRepositories = repositories.filter(
        ({ accessType, sharedAccessUsers, documents }) =>
          accessType !== "private" &&
          (accessType === "public" || sharedAccessUsers.includes(userId)) &&
          (allDocumentIds = [...allDocumentIds, ...documents])
      );
      allRepositories = [...allRepositories, ...validRepositories];
    }
  }
  return { allRepositories, allDocumentIds };
};

const getAllDocuments = async ({ documents, userId }) => {
  const allDocuments = [];

  for(const documentId of documents){
    const document = await Document.findOne({
      _id: documentId,
    });
    const { accessType, sharedAccessUsers } = document;
    if (
      accessType !== "private" &&
      (accessType === "public" || sharedAccessUsers.includes(userId))
    ) {
      allDocuments = [...allDocuments, document];
    }
  }

  // documents.forEach(async (documentId) => {
  //   const document = await Document.findOne({
  //     _id: documentId,
  //   });
  //   const { accessType, sharedAccessUsers } = document;
  //   if (
  //     accessType !== "private" &&
  //     (accessType === "public" || sharedAccessUsers.includes(userId))
  //   ) {
  //     allDocuments = [...allDocuments, document];
  //   }
  // });

  return allDocuments;
};

const getFilteredRepositories = ({ allRepositories, keywords }) =>
  allRepositories.filter((repository) => {
    const { name, description, customTags } = repository;
    return keywords.some(
      (keyword) =>
        name.includes(keyword) ||
        description.includes(keyword) ||
        customTags.some((tag) => tag.includes(keyword))
    );
  });

const getFilteredDocuments = ({ allDocuments, keywords }) =>
  allDocuments.filter((document) => {
    const { name, description, customTags } = document;
    return keywords.some(
      (keyword) =>
        name.includes(keyword) ||
        description.includes(keyword) ||
        customTags.some((tag) => tag.includes(keyword))
    );
  });

const validateSharedAccessUsers = ({ sharedAccessUsers, accessType }) => {
  if (accessType === "shared" && sharedAccessUsers.length > 0) {
    const { inputValidation } = new Validator();
    for (let i = 0; i < sharedAccessUsers.length; i++) {
      const { isInputValid, msg: inputValidationErrorMsg } = inputValidation({
        email: sharedAccessUsers[i],
      });
      if (!isInputValid) {
        return {
          isSharedAccessValid: isInputValid,
          msg: inputValidationErrorMsg,
        };
      }
    }
  }
  return {
    isSharedAccessValid: true,
  };
};

const validateCustomTags = ({ customTags }) => {
  if (customTags.length > 0) {
    const { inputValidation } = new Validator();

    for (let i = 0; i < customTags.length; i++) {
      const { isInputValid, msg: inputValidationErrorMsg } = inputValidation({
        tag: customTags[i],
      });
      if (!isInputValid) {
        return {
          isCustomTagsValid: isInputValid,
          msg: inputValidationErrorMsg,
        };
      }
    }
  }
  return {
    isCustomTagsValid: true,
  };
};

const extractNonEmptyValidInputs = ({
  repositoryId,
  documentId,
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
  if (documentId) {
    nonEmptyValidInputs = { ...nonEmptyValidInputs, documentId };
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

module.exports = {
  getAllDocuments,
  getFilteredDocuments,
  getFilteredRepositories,
  getAllRepositoriesAndDocumentIds,
  validateSharedAccessUsers,
  validateCustomTags,
  extractNonEmptyValidInputs,
};
