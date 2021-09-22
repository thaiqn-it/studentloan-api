const bcrypt = require("bcrypt");
const { isMobilePhone } = require("validator");
const { BCRYPT_SALT_ROUND } = require("../constants");

exports.hashPassword = (raw) => {
	return bcrypt.hashSync(raw, BCRYPT_SALT_ROUND);
};

exports.comparePassword = (raw, hashed) => {
	return bcrypt.compareSync(raw, hashed);
};

exports.validateVNPhoneNumber = (value) => {
	if (!isMobilePhone(value, "vi-VN")) {
		return Promise.reject(
			"Phone Number should be from VN. Prefix +84, 84, 0 is OK"
		);
	}
	return Promise.resolve();
};

exports.mapErrorArrayExpressValidator = (errorArr) => {
	let errorParams = {};
	for (let x of errorArr) {
		errorParams[x.param] = x.msg;
	}
	return errorParams;
};

exports.excludePassword = (user) => {
  const { password, ...data } = user;
  return data;
};
