const { DataTypes, UUIDV4 } = require("sequelize");
const { db } = require("../../config");

const MasterCategory = db.define(
  "MasterCategory",
  {
    id: {
      primaryKey: true,
      allowNull: false,
      unique: true,
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
    },
    categoryName: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    status: {
      allowNull: false,
      unique: false,
      type: DataTypes.STRING,
    },
  },
  {
    indexes: [{ unique: true, fields: ["categoryName"] }],
    paranoid: true,
    deletedAt: "destroyTime",
    tableName: "master_category",
  }
);

module.exports = { MasterCategory };
