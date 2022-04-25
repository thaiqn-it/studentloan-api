const express = require("express");
const {
  achievementController,
} = require("../controllers/achievement.controller");
const { studentAuth } = require("../middlewares/jwt_auth");

const router = express.Router();

router.get("/student", studentAuth, achievementController.getByStudentId);
router.put("/", studentAuth, achievementController.updateById);
router.post("/", studentAuth, achievementController.createByStudentId);

module.exports = { achievementRouter: router };
