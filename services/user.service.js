const db = require("../models");
const { hashPassword, comparePassword } = require("../utils");
const User = db.User;

const createUserService = async (userInfo, password) => {
  const hashedPassword = hashPassword(password);

  const user = { ...userInfo, password: hashedPassword };
  return await User.create(user);
};

const loginService = async (phoneNumber, password) => {
  const user = await User.findOne({
    where: {
      phoneNumber: "0123456789",
    },
  });

  if (user === null) {
    throw new Error();
  }
  if (comparePassword(password, user.password)) {
    return user;
  } else {
    throw new Error();
  }
};

module.exports = { createUserService, loginService };
