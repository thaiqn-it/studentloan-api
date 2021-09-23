const ImageService = require("../services/image.service");
const { INTERNAL_SERVER_ERROR } = require("http-status");
const { restError } = require("../errors/rest");

const ImageController = {};

ImageController.getById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const Images = await ImageService.getById(id);
    return res.json(Images);
  } catch (error) {
    return res
      .status(INTERNAL_SERVER_ERROR)
      .send(restError.INTERNAL_SERVER_ERROR.default);
  }
};

ImageController.createImage = async (req, res, next) => {
  const { imageUrl } = req.body;
  try {
    const image = await ImageService.createOne({ imageUrl });
    return res.json(image);
  } catch (error) {
    console.log(error);
    return res
      .status(INTERNAL_SERVER_ERROR)
      .send(restError.INTERNAL_SERVER_ERROR.default);
  }
};

ImageController.updateImage = async (req, res, next) => {
  const { id } = req.params;
  const { imageUrl } = req.body;
  try {
    const image = await ImageService.updateOne(id, imageUrl);
    return res.json(image);
  } catch (error) {
    return res
      .status(INTERNAL_SERVER_ERROR)
      .send(restError.INTERNAL_SERVER_ERROR.default);
  }
};

ImageController.deleteImage = async (req, res, next) => {
  const { id } = req.params;
  try {
    const image = await ImageService.deleteOne(id);
    return res.json(image);
  } catch (error) {
    return res
      .status(INTERNAL_SERVER_ERROR)
      .send(restError.INTERNAL_SERVER_ERROR.default);
  }
};

module.exports = ImageController;
