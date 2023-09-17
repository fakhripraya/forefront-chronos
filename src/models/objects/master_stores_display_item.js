const { DataTypes, UUIDV4 } = require("sequelize");
const { db } = require("../../config");

const MasterStoreDisplayItem = db.define(
  "MasterStoreDisplayItem",
  {
    id: {
      primaryKey: true,
      allowNull: false,
      unique: true,
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
    },
    productCode: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    productName: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    productDescription: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    productHashtag: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    productCondition: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    productWeight: {
      allowNull: false,
      type: DataTypes.FLOAT,
    },
    productBidPrice: {
      allowNull: false,
      type: DataTypes.DECIMAL,
    },
    productBINPrice: {
      allowNull: false,
      type: DataTypes.DECIMAL,
    },
    productBidMultiplication: {
      allowNull: false,
      type: DataTypes.DECIMAL,
    },
    productBidMultiplicationPeriod: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    productBidPeriod: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    productStocks: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    productRating: {
      allowNull: false,
      type: DataTypes.FLOAT,
      validate: {
        min: 0,
        max: 5,
      },
    },
    availableCourierList: {
      allowNull: false,
      type: DataTypes.JSON,
    },
    status: {
      allowNull: false,
      type: DataTypes.STRING,
    },
  },
  {
    indexes: [{ unique: true, fields: ["productCode"] }],
    paranoid: true,
    deletedAt: "destroyTime",
    tableName: "master_store_display_item",
  }
);

module.exports = { MasterStoreDisplayItem };
