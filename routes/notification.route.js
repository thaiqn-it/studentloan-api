const express = require("express");
const { notificationController } = require("../controllers/notification.controller");
const { userAuth } = require("../middlewares/jwt_auth");

const router = express.Router();

router.get("/", userAuth , notificationController.getAllByUserId)
router.post("/", notificationController.create)
router.put("/:id", notificationController.updateById)
router.get("/:id", notificationController.getOneById)

module.exports = { notificationRoute : router };
