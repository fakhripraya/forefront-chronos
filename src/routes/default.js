const { db } = require("../config");
const {
  MasterFile,
} = require("../models/objects/master_file");
const {
  SequelizeErrorHandling,
  SequelizeRollback,
  createFolderSync,
  createFileSync,
  unlinkFilesSync,
} = require("../utils/functions");
const { checkAuth } = require("../utils/middleware");
const {
  UNIDENTIFIED_ERROR,
  ERROR_WHILE_UPLOADING_FILES,
} = require("../variables/responseMessage");
const multer = require("multer");
const {
  DYNAMIC_ASSET_FOLDER_PATH,
} = require("../variables/general");
const { uuid } = require("uuidv4");
const upload = multer({
  limits: { fieldSize: 25 * 1024 * 1024 },
});

const defaultRoute = (app) => {
  // TODO: FIX VERSIONING ON ROUTE, VERSIONING IS NOT ABOUT THE APP VERSION BUT THE ROUTE VERSION
  app.post(
    `/v${process.env.APP_MAJOR_VERSION}/files/upload`,
    checkAuth,
    upload.none(),
    async (req, res) => {
      // validation
      if (!req.body)
        return res.status(400).send(UNIDENTIFIED_ERROR);

      // initialize variable
      const files = JSON.parse(req.body.files);
      const fileDatas = files.map((file) => {
        const newId = uuid();
        return {
          id: newId,
          filename: file.filename,
          encoding: file.encoding,
          mimetype: file.mimetype,
          fileType: file.fileType,
          folderDestination: `/${file.fileType}/${newId}`,
          destination: `${DYNAMIC_ASSET_FOLDER_PATH}/${file.fileType}/${newId}/${file.filename}`,
          displayItemId: file.displayItemId,
          storeId: file.storeId,
          status: file.status,
        };
      });

      // do the transaction
      const trx = await db.transaction();
      try {
        // bulk create the files that in an array format
        await MasterFile.bulkCreate(fileDatas, {
          transaction: trx,
          lock: true,
        });

        // Write File Logic
        // nest the try catch to prevent inaccurate error handling
        // we nest it so it can still use sequelize rollback function
        // if the error is in file writting
        // use index to fetch different properties between "fileDatas" and "files"
        try {
          for (let i = 0; i < fileDatas.length; i++) {
            createFolderSync(
              `/${fileDatas[i].folderDestination}`
            );
            createFileSync(
              fileDatas[i].destination,
              Buffer.from(files[i].buffer.data)
            );
          }
        } catch (e) {
          unlinkFilesSync(fileDatas);
          SequelizeRollback(trx, e);

          return res
            .status(500)
            .send(`${ERROR_WHILE_UPLOADING_FILES}: ${e}`);
        }

        // Send an appropriate response to the client
        trx.commit();
        return res
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
