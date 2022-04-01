const fs = require("fs");

const uploadImage = async (req, res, next) => {
  // console.log(req.files);
  try {
    if (!req.files || Object.keys(req.files).length === 0)
      return res.status(400).json({ msg: "No files were uploaded." });

    const file = req.files.file;

    if (file.size > 5 * 1024 * 1024 || file.size === 0) {
      removeTmp(file.tempFilePath);
      return res.status(400).json({ msg: "Size too large or no file" });
    } // 1mb

    if (file.mimetype !== "image/jpeg" && file.mimetype !== "image/png" && file.mimetype !== "application/pdf") {
      removeTmp(file.tempFilePath);
      return res.status(400).json({ msg: "File format is incorrect." });
    }

    next();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: err.message });
  }
};

const removeTmp = (path) => {
  fs.unlink(path, (err) => {
    if (err) throw err;
  });
};

module.exports = { uploadImage };
