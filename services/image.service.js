const { Image } = require("../models");
const { Op } = require("sequelize");

const ImageService = {};

ImageService.getById = async (id) => {
  return await Image.findByPk(id);
};

ImageService.createOne = async (imageUrl) => {
  return await Image.create(imageUrl);
};

ImageService.updateOne = async (id, imageUrl) => {
  const image = await Image.update(
    { imageUrl },
    { where: { id }, returning: true, plain: true }
  );
  return image[1];
};

ImageService.deleteOne = async (id) => {
  const image = await Image.update(
    { status: "inactive" },
    { where: { id }, returning: true, plain: true }
  );
  return image[1];
};

module.exports = ImageService;
