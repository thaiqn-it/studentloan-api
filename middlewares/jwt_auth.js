const { BAD_REQUEST } = require("http-status");
const jwt = require("jsonwebtoken");
const db = require("../models/index");
const { JWT_SECRET_KEY } = require("../constants");
const { restError } = require("../errors/rest");

const User = db.User;

const userAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const data = jwt.verify(token, JWT_SECRET_KEY);
    const user = await User.findOne({ where: { id: data.id } });
    if (user === null) throw new Error();
    req.user = user;
    next();
  } catch (err) {
    res
      .status(BAD_REQUEST)
      .json(restError.BAD_REQUEST.extra({ error: "Authentication Error" }));
  }
};

module.exports = { userAuth };
