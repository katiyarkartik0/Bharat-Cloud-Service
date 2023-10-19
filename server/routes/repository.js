const express = require("express");
const repositoryRoutes = express.Router();
const bodyParser = require("body-parser");
const { createRepository, updateRepository, getRepositories } = require("../controllers/repository");

repositoryRoutes.use(bodyParser.urlencoded({ extended: false }));
repositoryRoutes.use(bodyParser.json());

repositoryRoutes.get("/get",getRepositories)
repositoryRoutes.post("/create",createRepository)
repositoryRoutes.put("/update",updateRepository)


module.exports = { repositoryRoutes };