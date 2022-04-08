const db = require("../models");
const { USER_STATUS, WALLET_STATUS } = require("../models/enum");

const { comparePassword } = require("../utils");
const User = db.User;
const UserStatus = db.UserStatus;
const Wallet = db.Wallet;

const createUserService = async (user) => {
  return (
    await User.create(
      {
        ...user,

        Wallet: {
          money: 0,

          status: WALLET_STATUS.ACTIVE,
        },
      },
      {
        include: Wallet,
      }
    )
  ).get({ plain: true });
};

const count = async (oAuthId) => {
  const result = await User.count({
    where: {
      oAuthId: oAuthId,
    },
  });
  if (result === null) {
    throw new Error();
  }
  return result;
};

const countBaseTypeAndStatus = async (data) => {
  const result = await User.count({
    where: {
      type: data.type,
      status: data.status,
    },
  });
  if (result === null) {
    throw new Error();
  }
  return result;
};

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

const getUserByEmailService = async (email) => {
  const user = await User.findOne({ where: { email: email.trim() } });
  return user;
};

const deleteUserService = async (id) => {
  const user = await User.findByPk(id);
  if (user === null) throw new Error();
  user.status = USER_STATUS.INACTIVE;
  return await user.save();
};

// const updateUserService = async (data) => {
//   let user = await User.findByPk(data.id);
//   if (user === null) throw new Error();
//   return await User.update(data, {
//     where: {
//       id: data.id,
//     },
//   });
// const updateUserService = async (data) => {

//   let user = await User.findByPk(data.id);
//   if (user === null) throw new Error();
//   user = { ...user, ...data };
//   return await user.save();
// };

const updateUserService = async (id,data) => {
  let user = await User.findByPk(id);
  if (user === null) throw new Error();
  return await User.update(data,
    {
      where: {
        id
      }
    }
  )
};

const getOne = async ({ ...data }) => {
  return await User.findOne({
    where: data,
    raw: true,
  });
};

const getAll = async () => {
  return await User.findAll({
    where: {
      type: ["STUDENT", "INVESTOR"],
    },
    order: [["createdAt", "ASC"]],
  });
};

module.exports = {
  createUserService,
  loginService,
  deleteUserService,
  updateUserService,
  count,
  getOne,
  getAll,
  getUserByEmailService,
  countBaseTypeAndStatus,
};
