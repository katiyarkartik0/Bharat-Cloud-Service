const express = require("express");
const repositoryRoutes = express.Router();
const bodyParser = require("body-parser");
const {
  createRepository,
  updateRepository,
  getRepositories,
  deleteRepository,
  getRepository,
} = require("../controllers/repository");

repositoryRoutes.use(bodyParser.urlencoded({ extended: false }));
repositoryRoutes.use(bodyParser.json());

repositoryRoutes.get("/getAll", getRepositories);
repositoryRoutes.get("/get", getRepository);
repositoryRoutes.post("/create", createRepository);
repositoryRoutes.put("/update", updateRepository);
repositoryRoutes.delete("/delete/:repositoryId", deleteRepository);

module.exports = { repositoryRoutes };
