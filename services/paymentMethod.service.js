const db = require("../models");
const PaymentMethod = db.PaymentMethod;

const createPaymentMethodService = async (paymentMethod) => {
  return await paymentMethod.create(paymentMethod);
};

const updatePaymentMethodService = async (data) => {
  let paymentMethod = await paymentMethod.findByPk(data.id);
  if (paymentMethod === null) throw new Error();
  paymentMethod = { ...paymentMethod, ...data };
  return paymentMethod.save();
};

const getPaymentMethodService = async (id) => {
  return await PaymentMethod.findByPk(id);
};

const deletePaymentMethodService = async (id) => {
  const paymentMethod = await paymentMethod.findByPk(id);
  return await paymentMethod.destroy();
};

module.exports = {
  createPaymentMethodService,
  updatePaymentMethodService,
  getPaymentMethodService,
  deletePaymentMethodService,
};
