const cloudinary = require("cloudinary");
const fs = require("fs");
const {
  CLOUD_NAME,
  CLOUD_API_KEY,
  CLOUD_API_SECRET,
} = require("../constants/index");

cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: CLOUD_API_KEY,
  api_secret: CLOUD_API_SECRET,
});

const uploadImage = async (req, res) => {
  try {
    const file = req.files.file;

    cloudinary.v2.uploader.upload(
      file.tempFilePath,
      {
        folder: "image",
        // width: 1920,
        // height: 1080,
        crop: "fill",
      },
      async (err, result) => {
        if (err) throw err;

        removeTmp(file.tempFilePath);

        res.json({ url: result.secure_url });
      }
    );
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

const removeTmp = (path) => {
  fs.unlink(path, (err) => {
    if (err) throw err;
  });
};

exports.uploadController = {
  uploadImage,
};
