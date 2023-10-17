const { db } = require("../config");
const {
  MasterCategory,
} = require("./objects/master_category");
const { MasterFile } = require("./objects/master_file");
const { MasterStore } = require("./objects/master_stores");
const {
  MasterStoreCatalogue,
} = require("./objects/master_stores_catalogue");
const {
  MasterStoreDisplayItem,
} = require("./objects/master_stores_display_item");
const { MasterUser } = require("./user/master_user");

const InitModels = async () => {
  // START ASSOCIATING
  // TODO: make this migration system aN NPM package later
  // MasterStore - MasterUser ASSOCIATION
  MasterUser.hasMany(MasterStore, {
    foreignKey: {
      name: "userId",
      allowNull: false,
    },
    sourceKey: "id",
    constraints: false,
  });
  MasterStore.belongsTo(MasterUser, {
    foreignKey: {
      name: "userId",
      allowNull: false,
    },
    targetKey: "id",
    constraints: false,
  });

  // MasterStore - MasterStoreCatalogue ASSOCIATION
  MasterStoreCatalogue.belongsTo(MasterStore, {
    foreignKey: {
      name: "storeId",
      allowNull: false,
    },
    targetKey: "id",
    constraints: false,
  });
  MasterStore.hasMany(MasterStoreCatalogue, {
    foreignKey: {
      name: "storeId",
      allowNull: false,
    },
    sourceKey: "id",
    constraints: false,
  });

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

  // MasterStoreDisplayItem - MasterStoreCatalogue ASSOCIATION
  MasterStoreDisplayItem.belongsTo(MasterStoreCatalogue, {
    foreignKey: {
      name: "catalogueId",
      allowNull: false,
    },
    targetKey: "id",
    constraints: false,
  });
  MasterStoreCatalogue.hasMany(MasterStoreDisplayItem, {
    foreignKey: {
      name: "catalogueId",
      allowNull: false,
    },
    sourceKey: "id",
    constraints: false,
  });

  // MasterStoreDisplayItem - MasterCategory ASSOCIATION
  MasterStoreDisplayItem.belongsTo(MasterCategory, {
    foreignKey: {
      name: "categoryId",
      allowNull: false,
    },
    targetKey: "id",
    constraints: false,
  });
  MasterCategory.hasMany(MasterStoreDisplayItem, {
    foreignKey: {
      name: "categoryId",
      allowNull: false,
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
    .sync({
      alter: true,
      force: false,
    })
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
