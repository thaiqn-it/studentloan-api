const { BAD_REQUEST } = require("http-status");
const jwt = require("jsonwebtoken");
const db = require("../models/index");
const { JWT_SECRET_KEY } = require("../constants");
const { restError } = require("../errors/rest");
const { USER_TYPE } = require("../models/enum/")
const userService = require('../services/user.service')

const User = db.User;
const Student = db.Student;
const Investor = db.Investor;

const userAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const data = jwt.verify(token, JWT_SECRET_KEY);
    const user = await userService.getOne({id:data.userId})
    if (user === null) throw new Error();
    req.user = user;
    next();
  } catch (err) {
    res
      .status(BAD_REQUEST)
      .json(restError.BAD_REQUEST.extra({ error: "Authentication Error" }));
  }
};

const studentAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    const data = jwt.verify(token, JWT_SECRET_KEY);

    const user = await User.findOne({
      where: { 
        id: data.userId,
        type : USER_TYPE.STUDENT
      },
      include : Student,
      raw : true,
      nest : true,
    });
    if (user === null) throw new Error();
    req.user = user
    next();
  } catch (err) {
    console.log(err)
    res
      .status(BAD_REQUEST)
      .json(restError.BAD_REQUEST.extra({ error: "Authentication Error" }));
  }
};

const investorAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const data = jwt.verify(token, JWT_SECRET_KEY);
    
    const user = await User.findOne({
      where: { 
        id: data.userId,
        type : USER_TYPE.INVESTOR
      },
      include : Investor,
      raw : true,
      nest : true,
    });
    if (user === null) throw new Error();
    req.user = user;
    next();
  } catch (err) {
    res
      .status(BAD_REQUEST)
      .json(restError.BAD_REQUEST.extra({ error: "Authentication Error" }));
  }
};

module.exports = { userAuth, investorAuth, studentAuth };
