const express = require("express");
const repositoryRoutes = express.Router();
const bodyParser = require("body-parser");
const { createRepository, updateRepository, getRepositories, deleteRepository } = require("../controllers/repository");

repositoryRoutes.use(bodyParser.urlencoded({ extended: false }));
repositoryRoutes.use(bodyParser.json());

repositoryRoutes.get("/get",getRepositories)
repositoryRoutes.post("/create",createRepository)
repositoryRoutes.put("/update",updateRepository)
repositoryRoutes.delete("/delete/:repositoryId",deleteRepository)


module.exports = { repositoryRoutes };