const express = require("express");
const { notificationController } = require("../controllers/notification.controller");
const { userAuth } = require("../middlewares/jwt_auth");

const router = express.Router();

router.get("/", userAuth , notificationController.getAllByUserId)
router.get("/:id", notificationController.getOneById)
router.post("/investor", notificationController.pushNotifToInvestor)
router.post("/getTop", userAuth , notificationController.getTop5TodayByUserId)
router.post("/", notificationController.create)
router.put("/:id", notificationController.updateById)

module.exports = { notificationRoute : router };
