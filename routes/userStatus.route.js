const express = require("express");
const { userStatusController } = require("../controllers/userStatus.controller");
const router = express.Router();

router.post("/", userStatusController.create);
router.get("/:id", userStatusController.getOne);
router.put("/:id", userStatusController.update);

module.exports = { userStatusRouter : router };
 