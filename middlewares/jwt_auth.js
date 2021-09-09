const { BAD_REQUEST } = require("http-status");
const jwt = require("jsonwebtoken");
const db = require("../models/index");
const { JWT_SECRET_KEY } = require("../constants");
const { restError } = require("../errors/rest");