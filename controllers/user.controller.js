const userService = require("../services/user.service");
const { USER_STATUS } = require("../models/enum/index");
const { INTERNAL_SERVER_ERROR } = require("http-status");
const { restError } = require("../errors/rest");
const jwt = require("jsonwebtoken");
const { JWT_SECRET_KEY } = require("../constants");
const { excludePassword } = require("../utils");

const creatUser = async (req, res) => {
  try {
    const { phoneNumber, password, type, email } = req.body;
    const status = USER_STATUS.ACTIVE;
    const user = await userService.createUserService(
      {
        phoneNumber,
        type,
        email,
        status,
      },
      password
    );
    res.json(user);
  } catch (err) {
    res.status(INTERNAL_SERVER_ERROR).json(restError.INTERNAL_SERVER_ERROR);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userService.loginService(email, password);
    const token = jwt.sign({ id: user.id }, JWT_SECRET_KEY);
    res.json({ token });
  } catch (err) {
    res
      .status(INTERNAL_SERVER_ERROR)
      .json(restError.INTERNAL_SERVER_ERROR.default);
  }
};

const getProfile = async (req, res) => {
  const user = req.user;

  res.json(excludePassword(user));
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.user;
    const user = await userService.deleteUserService(id);

    res.json(user);
  } catch (err) {
    res
      .status(INTERNAL_SERVER_ERROR)
      .json(restError.INTERNAL_SERVER_ERROR.default);
  }
};

const updateUser = async (req, res) => {
  try {
    const data = req.body;
    const user = await userService.updateUserService(data);
    res.json(user);
  } catch (err) {
    res
      .status(INTERNAL_SERVER_ERROR)
      .json(restError.INTERNAL_SERVER_ERROR.default);
  }
};

module.exports = { creatUser, login, getProfile, deleteUser, updateUser };
