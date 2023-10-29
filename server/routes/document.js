const express = require("express");
const documentRoutes = express.Router();
const bodyParser = require("body-parser");
const { createDocument, getDocuments, getDocument, updateDocument, deleteDocument, viewDocument, downloadDocument } = require("../controllers/document");

documentRoutes.use(bodyParser.urlencoded({ extended: false }));
documentRoutes.use(bodyParser.json());

documentRoutes.post("/create",createDocument)
documentRoutes.get("/getAll",getDocuments)
documentRoutes.get("/get",getDocument)
documentRoutes.put("/update",updateDocument)
documentRoutes.delete("/delete",deleteDocument)
documentRoutes.get("/view",viewDocument)
documentRoutes.get("/download",downloadDocument)

module.exports = { documentRoutes };