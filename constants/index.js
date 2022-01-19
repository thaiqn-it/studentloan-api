const dotenv = require("dotenv");
dotenv.config();
exports.APP_PORT = process.env.PORT || 3000;
exports.DB_USERNAME = process.env.DB_USERNAME || "sa";
exports.DB_PASSWORD = process.env.DB_PASSWORD || "123";
exports.DB_NAME = process.env.DB_NAME || "StudentLoan";
exports.DB_HOST = process.env.DB_HOST || "localhost";
exports.DB_DIALECT = process.env.DB_DIALECT || "mssql";
exports.BCRYPT_SALT_ROUND = 12;
exports.JWT_SECRET_KEY = "123456789";
exports.VERIFY_TOKEN = "123456789";
exports.STRIPE_SECRET_KEY =
  process.env.STRIPE_SECRET_KEY ||
  "sk_test_51KGkbCCFy5YSbtlBvOa6caLy7DvUq5V6eLxQgfd1UVYp64nMEG0L45KMfU8tiE4O0pzXfjzKfqmRAdUBopDd2WlH00lHreNdnR";
