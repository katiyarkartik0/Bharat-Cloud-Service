const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const { Validator } = require("../helpers/validator");

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  const validator = new Validator();
  const { getUser, inputValidation } = validator;
  const { isInputValid, msg: inputValidationErrorMsg } = inputValidation({
    name,
    email,
    password,
  });
  if (!isInputValid) {
    return res.status(400).json({ msg: inputValidationErrorMsg });
  }
  const { msg, isNewUserEntry } = await getUser(email, {
    attempt: "signup",
  });
  if (!isNewUserEntry) {
    return res.status(400).json({ msg });
  }
  const newUser = new User({
    name,
    email,
    password: bcrypt.hashSync(password.toString(), 4),
  });

  try {
    await newUser.save();
    return res.status(200).json({ msg: "Account created Successfully!" });
  } catch (error) {
    return res.status(500).json({ msg: JSON.stringify(error) });
  }
};

const logInUser = async (req, res) => {
  const { email, password } = req.body;
  const { getUser, inputValidation } = new Validator();
  const { isInputValid, msg: inputValidationMessage } = inputValidation({
    email,
    password,
  });
  if (!isInputValid) {
    return res.status(400).json({ msg: inputValidationMessage });
  }
  const { userData, msg, isNewUserEntry } = await getUser(email, {
    attempt: "logIn",
  });
  if (isNewUserEntry) {
    return res.status(400).json({ msg });
  }
  const isPasswordValid = bcrypt.compareSync(
    password.toString(),
    userData.password.toString()
  );
  if (!isPasswordValid) {
    return res.status(400).json({ msg: "invalid password" });
  }
  const token = jwt.sign({ id: userData._id }, process.env.API_SECRET, {
    expiresIn: 86400,
  });
  userData.password = null;
  try {
    return res.status(200).json({
      userData,
      msg: "login successful",
      accessToken: token,
    });
  } catch (err) {
    return res.status(500).json({ msg: JSON.stringify(err) });
  }
};

module.exports = { registerUser, logInUser };
