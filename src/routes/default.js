const { db } = require("../config");
const {
  MasterFile,
} = require("../models/objects/master_file");
const {
  SequelizeErrorHandling,
  SequelizeRollback,
} = require("../utils/functions");
const {
  uploadMiddleware,
  checkAuth,
} = require("../utils/middleware");
const fs = require("fs");

const defaultRoute = (app) => {
  app.post(
    `/v${process.env.APP_MAJOR_VERSION}/files/upload`,
    checkAuth,
    uploadMiddleware,
    async (req, res) => {
      // do the transaction
      const trx = await db.transaction();
      try {
        // bulk create the files that has been concat
        await MasterFile.bulkCreate(
          uploadedStoreProfilePicture,
          { transaction: trx }
        );

        // Handle the uploaded files
        const files = req.files;

        // Process and store the files as required
        // For example, save the files to a specific directory using fs module
        files.forEach((file) => {
          const filePath = `uploads/${file.filename}`;
          fs.rename(file.path, filePath, (err) => {
            if (err) {
              // Handle error appropriately and send an error response
              throw new Error("Failed to store the file");
            }
          });
        });

        // Send an appropriate response to the client
        trx.commit();
        res
          .status(200)
          .json({ message: "File upload successful" });
      } catch (e) {
        SequelizeRollback(trx, e);
        SequelizeErrorHandling(e, res);
      }
    }
  );
};

module.exports = {
  defaultRoute,
};
