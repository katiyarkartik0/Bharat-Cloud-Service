const express = require("express");
const searchRoutes = express.Router();
const bodyParser = require("body-parser");
const { search } = require("../controllers/search");

searchRoutes.use(bodyParser.urlencoded({ extended: false }));
searchRoutes.use(bodyParser.json());

searchRoutes.get("/",search)

module.exports = { searchRoutes };