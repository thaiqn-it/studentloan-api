const express = require("express");
const router = express.Router();
const { tutorController } = require("../controllers/tutor.controller");

router.get("/studentId/:id", tutorController.getListTutorByStudentId);
router.post("/", tutorController.createTutor);
router.put("/:id", tutorController.update);
router.get("/:id", tutorController.getById);
router.delete("/:id", tutorController.deleteById);

module.exports = { tutorRouter: router };
