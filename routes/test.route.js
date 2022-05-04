const express = require("express");

const router = express.Router();
const { test } = require("../test/script.test");

router.post("/", test.test);

module.exports = { testRoute : router };
