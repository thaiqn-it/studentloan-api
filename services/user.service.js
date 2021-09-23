const db = require("../models");
const { USER_STATUS } = require("../models/enum");

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

const deleteUserService = async (id) => {
  const user = await User.findByPk(id);
  if (user === null) throw new Error();
  user.status = USER_STATUS.INACTIVE;
  return await user.save();
};

const updateUserService = async (data) => {
  let user = await User.findByPk(data.id);
  if (user === null) throw new Error();
  user = { ...user, ...data };
  return await user.save();
};

module.exports = {
  createUserService,
  loginService,
  deleteUserService,
  updateUserService,
};
