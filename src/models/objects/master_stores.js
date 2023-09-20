const { DataTypes, UUIDV4 } = require("sequelize");
const { db } = require("../../config");

const MasterStore = db.define(
  "MasterStore",
  {
    id: {
      primaryKey: true,
      allowNull: false,
      unique: true,
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
    },
    storeCode: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    storeName: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    storeDescription: {
      allowNull: false,
      type: DataTypes.TEXT,
    },
    storePhone: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    storeWhatsapp: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    storeEmail: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    storeProvince: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    storeRegency: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    storeDistrict: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    storeVillage: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    storePostalCode: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    storeLevel: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    storeQualityRating: {
      allowNull: false,
      type: DataTypes.FLOAT,
      validate: {
        min: 0,
        max: 5,
      },
    },
    storeSpeedRating: {
      allowNull: false,
      type: DataTypes.FLOAT,
      validate: {
        min: 0,
        max: 5,
      },
    },
    storeServiceRating: {
      allowNull: false,
      type: DataTypes.FLOAT,
      validate: {
        min: 0,
        max: 5,
      },
    },
    status: {
      allowNull: false,
      unique: false,
      type: DataTypes.STRING,
    },
  },
  {
    indexes: [
      { unique: true, fields: ["storeCode"] },
      { unique: true, fields: ["storeName"] },
    ],
    paranoid: true,
    deletedAt: "destroyTime",
    tableName: "master_store",
  }
);

module.exports = { MasterStore };
