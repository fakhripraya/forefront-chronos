const { db } = require("../config/sequelize");
const { MasterFile } = require("./objects/master_file");
const { MasterStore } = require("./objects/master_stores");
const {
  MasterStoreDisplayItem,
} = require("./objects/master_stores_display_item");

const InitModels = async () => {
  // START ASSOCIATING
  // MasterFile - MasterStoreDisplayItem ASSOCIATION
  MasterFile.belongsTo(MasterStoreDisplayItem, {
    foreignKey: {
      name: "displayItemId",
      allowNull: true,
    },
    targetKey: "id",
    constraints: false,
  });
  MasterStoreDisplayItem.hasMany(MasterFile, {
    foreignKey: {
      name: "displayItemId",
      allowNull: true,
    },
    sourceKey: "id",
    constraints: false,
  });

  // MasterFile - MasterStoreDisplayItem ASSOCIATION
  MasterFile.belongsTo(MasterStore, {
    foreignKey: {
      name: "storeId",
      allowNull: true,
    },
    targetKey: "id",
    constraints: false,
  });
  MasterStore.hasMany(MasterFile, {
    foreignKey: {
      name: "storeId",
      allowNull: true,
    },
    sourceKey: "id",
    constraints: false,
  });
  // END OF ASSOCIATING

  await db
    .sync({ alter: true, force: false })
    .then(() => {
      console.log(
        "All models has been synchronized successfully."
      );
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      console.log("Model initialization completed");
    });
};

module.exports = {
  InitModels,
};
