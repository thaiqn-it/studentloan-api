const db = require("../models");
const { USER_STATUS } = require("../models/enum");

const { comparePassword } = require("../utils");
const User = db.User;

const createUserService = async ({ ...user }) => {
  return (await User.create(user)).get({plain:true})
};

const count = async (oAuthId) => {
  const result = await User.count({
    where : {
      oAuthId : oAuthId
    }
  })
  if (result === null) {
    throw new Error();
  }
  return result
}

const loginService = async (email, password) => {
  const user = await User.findOne({
    where: {
      email: email.trim(),
    },
    raw: true,
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

const getOne = async ({ ...data }) => {
  return await User.findOne({
    where : data,
    raw : true
  },)
}

module.exports = {
  createUserService,
  loginService,
  deleteUserService,
  updateUserService,
  count,
  getOne
};
