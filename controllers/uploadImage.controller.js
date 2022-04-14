const cloudinary = require("cloudinary");

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

const option = {
  folder: "file",
  use_filename: true,
  unique_filename: false,
};
const uploadImage = async (req, res) => {
  try {
    let uploadFiles = req.files;
    //Check if files exist
    if (!uploadFiles)
      return res.status(400).json({ message: "No picture attached!" });
    //map through images and create a promise array using cloudinary upload function
    let multiplePicturePromise = uploadFiles.map((file) =>
      cloudinary.v2.uploader.upload(file.path, option)
    );
    // await all the cloudinary upload functions in promise.all, exactly where the magic happens
    let fileResponses = await Promise.all(multiplePicturePromise);
    let shortResponses = [];
    let shortResponseOne = {};
    if (fileResponses.length > 1) {
      fileResponses.map((file) => {
        shortResponses.push({ url: file.url });
      });
      res.status(200).json(shortResponses);
    } else {
      fileResponses.map((file) => {
        shortResponseOne = { ...shortResponseOne, url: file.url };
      });
      res.status(200).json(shortResponseOne);
    }
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

exports.uploadController = {
  uploadImage,
};