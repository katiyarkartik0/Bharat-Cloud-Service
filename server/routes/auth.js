const express = require("express");
const authRoutes = express.Router();
const bodyParser = require("body-parser");
const { registerUser, logInUser } = require("../controllers/auth");

authRoutes.use(bodyParser.urlencoded({ extended: false }));
authRoutes.use(bodyParser.json());

authRoutes.post("/login",logInUser)
authRoutes.post("/signup",registerUser);

module.exports = { authRoutes };