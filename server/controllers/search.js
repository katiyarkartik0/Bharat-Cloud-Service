const {
  getAllRepositoriesAndDocumentIds,
  getAllDocuments,
  getFilteredRepositories,
  getFilteredDocuments,
} = require("../helpers/reposAndDocs");
const Document = require("../models/document");
const User = require("../models/user");

const search = async (req, res) => {
  if (req.verified == false) {
    return res.status(403).send(req.msg);
  }
  const userId = req.id;
  const { userIds=[], keywords=[] } = req.body;

  try {
    if (userIds.length > 0 && keywords.length > 0) {
      //if request contains userIds and keywords, then
      //we are fetching all the repositories from userIds with *authorized-access to userId, then
      //we are fetching all the documents from documentIds with *authorized-access to userId,then
      //we are filtering repositories on the basis of keywords inside keywords array, and
      //we are filtering documnets on the basis of keywords inside keywords array

      //*authorized-access means either userId is included in sharedAccessUserIds or access-type is public

      const { allRepositories, allDocumentIds } =
        await getAllRepositoriesAndDocumentIds({
          userIds,
          userId,
        });

      const allDocuments = await getAllDocuments({
        documents: allDocumentIds,
        userId,
      });

      const filteredRepositories = getFilteredRepositories({
        allRepositories,
        keywords,
      });
      
      const filteredDocuments = getFilteredDocuments({
        allDocuments,
        keywords,
      });

      return res.status(200).json({
        repositories: filteredRepositories,
        documents: filteredDocuments,
      });
    } else if (userIds.length > 0) {
      //if request contains userIds and keywords, then
      //we are fetching all the repositories from userIds with *authorized-access, then

      //*authorized-access means either userId is included in sharedAccessUserIds or access-type is public
      const { allRepositories } = await getAllRepositoriesAndDocumentIds({
        userIds,
        userId,
      });
      return res.status(200).json({ repositories: allRepositories });
    } else if (keywords.length > 0) {
      //if request contains only keywords, then
      //we are fetching all the repositories from current user, then
      //we are fetching all the documents from documentIds from all repositories,then
      //we are filtering repositories on the basis of keywords inside keywords array, and
      //we are filtering documnets on the basis of keywords inside keywords array
      // console.log(userIds.length,keywords.length)

      const { allRepositories, allDocumentIds } =
        await getAllRepositoriesAndDocumentIds({
          userIds: [userId],
          userId,
        });

      const allDocuments = await getAllDocuments({
        documents: allDocumentIds,
        userId,
      });

      const filteredRepositories = getFilteredRepositories({
        allRepositories,
        keywords,
      });

      const filteredDocuments = getFilteredDocuments({
        allDocuments,
        keywords,
      });


      return res.status(200).json({
        repositories: filteredRepositories,
        documents: filteredDocuments,
      });
    }
    return res
      .status(400)
      .json({ msg: "please provide a valid userIds or keywords" });
  } catch (error) {
    return res.status(500).json({
      msg: JSON.stringify(error),
    });
  }
};

module.exports = { search };
