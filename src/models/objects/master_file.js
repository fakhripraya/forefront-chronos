const { DataTypes, UUIDV4 } = require("sequelize");
const { db } = require("../../config");

const MasterFile = db.define(
  "MasterFile",
  {
    id: {
      primaryKey: true,
      allowNull: false,
      unique: true,
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
    },
    filename: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    encoding: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    mimetype: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    fileType: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    destination: {
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
    paranoid: true,
    deletedAt: "destroyTime",
    tableName: "master_file",
  }
);

module.exports = { MasterFile };
