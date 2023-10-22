const Document = require("../models/document");
const User = require("../models/user");
const { Validator } = require("./validator");

const getAllRepositoriesAndDocumentIds = async ({ userIds, userId }) => {
  const allRepositories = [];
  const allDocumentIds = [];
  userIds.forEach(async (currentUserId) => {
    const { repositories } = await User.findOne({
      _id: currentUserId,
    }).populate("repositories");

    if (currentUserId === userId) {
      allRepositories = [...allRepositories, ...repositories];
      repositories.forEach(({ documentIds }) => {
        allDocumentIds = [...allDocumentIds, ...documentIds];
      });
    } else if (currentUserId !== userId) {
      const validRepositories = repositories.filter(
        ({ accessType, sharedAccessUsers, documentIds }) =>
          accessType !== "private" &&
          (accessType === "public" || sharedAccessUsers.includes(userId)) &&
          (allDocumentIds = [...allDocumentIds, ...documentIds])
      );
      allRepositories = [...allRepositories, ...validRepositories];
    }
  });
  return { allRepositories, allDocumentIds };
};

const getAllDocuments = async ({ documentIds, userId }) => {
  const allDocuments = [];

  documentIds.forEach(async (documentId) => {
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
  });

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

const validateSharedAccessUsers = ({ sharedAccessUsers }) => {
  if (accessType === "shared" && sharedAccessUsers.length > 0) {
    const { inputValidation } = new Validator();
    for (let i = 0; i < sharedAccessUsers.length; i++) {
      const { isInputValid, msg: inputValidationErrorMsg } = inputValidation({
        email: sharedAccessUsers[i],
      });
      if (!isInputValid) {
        return { isInputValid, msg: inputValidationErrorMsg };
      }
    }
  }
  return {
    isInputValid: true,
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
        return { isInputValid, msg: inputValidationErrorMsg };
      }
    }
  }
  return {
    isInputValid: true,
  };
};

module.exports = {
  getAllDocuments,
  getFilteredDocuments,
  getFilteredRepositories,
  getAllRepositoriesAndDocumentIds,
  validateSharedAccessUsers,
  validateCustomTags,
};
