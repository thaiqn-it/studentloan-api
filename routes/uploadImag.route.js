const express = require("express");
const router = express.Router();
const { uploadController } = require("../controllers/uploadImage.controller");
const { uploadImage } = require("../middlewares/uploadImage");

router.post("/upload", uploadImage, uploadController.uploadImage);

module.exports = { uploadImageRouter: router };
