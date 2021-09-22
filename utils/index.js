const bcrypt = require("bcrypt");
const { BCRYPT_SALT_ROUND } = require("../constants");

exports.hashPassword = (raw) => {
  return bcrypt.hashSync(raw, BCRYPT_SALT_ROUND);
};

exports.comparePassword = (raw, hashed) => {
  return bcrypt.compareSync(raw, hashed);
};

exports.excludePassword = (user) => {
  const { password, ...data } = user;
  return data;
};
