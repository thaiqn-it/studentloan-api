const express = require("express");

const { userRoute } = require("./user.route");
const router = express.Router();

router.use("/user", userRoute);

router.get("/", async (req, res) => {
  res.json("this is student loan api");
});

module.exports = { apiRouter: router };
