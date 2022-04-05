const multer = require("multer");

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype == "image/png" || file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    //reject file
    cb({ message: "Unsupported file format" }, false);
  }
};
const upload = multer({
  storage: storage,
  Limits: { filesize: 1024 * 1024 * 5 },
  fileFilter: fileFilter,
});
module.exports = upload;