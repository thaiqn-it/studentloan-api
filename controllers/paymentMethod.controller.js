const { INTERNAL_SERVER_ERROR } = require("http-status");
const paymentMethodService = require("../services/paymentMethod.service");
const { restError } = require("../errors/rest");

const createPaymentMethod = async (req, res) => {
  try {
    const { name } = req.body;

    const paymentMethod = await paymentMethodService.createPaymentMethodService(
      { name }
    );
    res.json(paymentMethod);
  } catch (err) {
    res
      .status(INTERNAL_SERVER_ERROR)
      .json(restError.INTERNAL_SERVER_ERROR.default);
  }
};

const updatePaymentMethod = async (req, res) => {
  try {
    const id = req.params;
    const { name } = req.body;
    const data = {
      id,
      name,
    };
    const paymentMethod = await paymentMethodService.updatePaymentMethodService(
      data
    );
    res.json(paymentMethod);
  } catch (err) {
    res
      .status(INTERNAL_SERVER_ERROR)
      .json(restError.INTERNAL_SERVER_ERROR.default);
  }
};

const getPaymentMethod = async (req, res) => {
  try {
    const id = req.params;
    const paymentMethod = await paymentMethodService.getPaymentMethodService(
      id
    );
    res.json(paymentMethod);
  } catch (err) {
    res
      .status(INTERNAL_SERVER_ERROR)
      .json(restError.INTERNAL_SERVER_ERROR.default);
  }
};

const deletePaymentMethod = async (req, res) => {
  try {
    const id = req.params;
    const paymentMethod = await paymentMethodService.deletePaymentMethodService(
      id
    );
    res.json(paymentMethod);
  } catch (err) {
    res
      .status(INTERNAL_SERVER_ERROR)
      .json(restError.INTERNAL_SERVER_ERROR.default);
  }
};

exports.paymentMethodController = {
  getPaymentMethod,
  createPaymentMethod,
  updatePaymentMethod,
  deletePaymentMethod,
};
