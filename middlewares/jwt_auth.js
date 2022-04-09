const { BAD_REQUEST } = require("http-status");
const jwt = require("jsonwebtoken");
const db = require("../models/index");
const { JWT_SECRET_KEY } = require("../constants");
const { restError } = require("../errors/rest");
const { USER_TYPE } = require("../models/enum/")
const userService = require('../services/user.service');
const op = db.Sequelize.Op;

const User = db.User;
const Student = db.Student;
const Investor = db.Investor;

const userAuth = async (req, res, next) => {
  try {
    // if (!req.headers.authorization) throw new Error();
    const token = req.headers.authorization.split(" ")[1];
    const data = jwt.verify(token, JWT_SECRET_KEY);
    const user = await User.findOne({
      where: {
        id: data.userId,
      },
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

const adminAuth = async (req, res, next) => {
  try {
    // if (!req.headers.authorization) throw new Error();
    const token = req.headers.authorization.split(" ")[1];
    const data = jwt.verify(token, JWT_SECRET_KEY);
    const user = await User.findOne({
      where: {
        id: data.userId,
        type: USER_TYPE.ADMIN,
      },
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

const studentAuth = async (req, res, next) => {
  try {
    if (!req.headers.authorization) throw new Error();
    const token = req.headers.authorization.split(" ")[1];

    const data = jwt.verify(token, JWT_SECRET_KEY);

    const user = await User.findOne({
      where: {
        id: data.userId,
        type: USER_TYPE.STUDENT,
      },
      include : {
        model : db.Student,
        where : {
          parentId : {
            [op.is] : null
          }
        }      
      },
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

const investorAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const data = jwt.verify(token, JWT_SECRET_KEY);

    const user = await User.findOne({
      where: {
        id: data.userId,
        type: USER_TYPE.INVESTOR,
      },
      include : {
        model : db.Investor,
        where : {
          parentId : {
            [op.is] : null
          }
        }    
      },
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

module.exports = { userAuth, investorAuth, studentAuth,adminAuth };
