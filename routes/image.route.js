const express = require("express");
const ImageController = require("../controllers/image.controller");

const router = express.Router();

router.get("/:id", ImageController.getById);

router.post("/", ImageController.createImage);

router.put("/:id", ImageController.updateImage);

router.delete("/:id", ImageController.deleteImage);

module.exports = { imageRoute: router };
