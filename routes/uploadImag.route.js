const express = require("express");
const router = express.Router();
const { uploadController } = require("../controllers/uploadImage.controller");
const upload = require("../middlewares/uploadImage");

var uploadMulti = upload.array("file", 10);

router.post(
  "/upload",
  (req, res, next) => {
    uploadMulti(req, res, (err) => {
      if (err) return res.status(500).send({ mes: err.message });
      next();
    });
  },
  uploadController.uploadImage
);

module.exports = { uploadImageRouter: router };
