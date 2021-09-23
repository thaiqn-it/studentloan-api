module.exports = (sequelize, DataTypes) => {
  const PaymentMethod = sequelize.define("PaymentMethod", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  return PaymentMethod;
};
