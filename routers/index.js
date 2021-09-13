const express = require("express");

const { schoolRouter } = require("./school.route");
const router = express.Router();

router.use("/school", schoolRouter);

router.get("/", async (req, res) => {
  res.json("this is student loan api");
});

module.exports = { apiRouter: router };
