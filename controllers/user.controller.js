const userService = require("../services/user.service");
const { USER_STATUS } = require("../models/enum/index");
const { INTERNAL_SERVER_ERROR } = require("http-status");
const { restError } = require("../errors/rest");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../constants");

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
    const { phoneNumber, password } = req.body;
    const user = await userService.loginService(phoneNumber, password);
    const token = jwt.sign({ id: user.id }, JWT_SECRET);
    res.json({ token });
  } catch (err) {
    res
      .status(INTERNAL_SERVER_ERROR)
      .json(restError.INTERNAL_SERVER_ERROR.default);
  }
};

const getProfile = async (req, res) => {
  const user = req.user;

  res.json(user);
};

module.exports = { creatUser, login, getProfile };
