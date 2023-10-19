const express = require("express");
const repositoryRoutes = express.Router();
const bodyParser = require("body-parser");
const { createRepository } = require("../controllers/repository");

repositoryRoutes.use(bodyParser.urlencoded({ extended: false }));
repositoryRoutes.use(bodyParser.json());

repositoryRoutes.post("/create",createRepository)

module.exports = { repositoryRoutes };