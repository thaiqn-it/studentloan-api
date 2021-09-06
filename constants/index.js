const dotenv = require("dotenv");
dotenv.config();
exports.APP_PORT = process.env.PORT || 3000;
exports.BCRYPT_SALT_ROUND = 10;
exports.JWT_SECRET_KEY = "lcrw99";
