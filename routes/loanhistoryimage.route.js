const express = require("express");
const { loanHistoryImageController } = require("../controllers/loanHistoryImage.controller");

const router = express.Router();

router.post("/",loanHistoryImageController.create);

router.put("/:id" , loanHistoryImageController.updateById)

module.exports = { loanHistoryImageRouter : router };