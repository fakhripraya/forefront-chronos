const express = require("express");
const { db } = require("../config");
const fs = require("fs");
const path = require("path");
const mime = require("mime-types");
const { MasterFile } =
  require("forefront-polus/src/models/index")();
const {
  SequelizeErrorHandling,
  SequelizeRollback,
} = require("forefront-polus/src/utils/functions");
const {
  createFolderSync,
  createFileSync,
  unlinkFilesSync,
} = require("../utils/functions");
const { checkAuth } = require("../utils/middleware");
const {
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
  app.get("/v1/file", (req, res) => {
    // get the query param
    const fileType = req.query.fileType;
    const fileId = req.query.fileId;
    const fileName = req.query.fileName;
    const mimeType = req.query.mimeType;

    // define the path
    const filePath = path.join(
      __dirname,
      `../../public/uploads/${fileType}/${fileId}/${fileName}`
    );

    // Read the file as a Buffer
    fs.statSync(filePath, (err, stat) => {
      if (err) {
        console.error("Error reading file:", err);
        return res
          .status(500)
          .send("Internal Server Error");
      }

      // Get the MIME type based on the file extension
      const fileMimeType =
        mimeType || mime.lookup(filePath);

      const multipartResponse = {
        name: fileName,
        type: fileMimeType,
        size: stat.size,
        url: `${req.protocol}://${req.get(
          "host"
        )}/public/uploads/${fileType}/${fileId}/${fileName}`,
      };

      // Return the multipart response
      return res.status(200).send(multipartResponse);
    });
  });

  app.get("/v1/files", async (req, res) => {
    // get the query param
    const fileInfos =
      req.query.fileInfos &&
      JSON.parse(req.query.fileInfos);

    var promises = fileInfos.map(
      (val) =>
        new Promise((resolve, reject) => {
          try {
            // define the path
            const filePath = path.join(
              __dirname,
              `../../public/uploads/${val.fileType}/${val.fileId}/${val.fileName}`
            );

            const fileMimeType =
              val.mimeType || mime.lookup(filePath);

            resolve({
              name: val.fileName,
              type: fileMimeType,
              size: fs.statSync(filePath).size,
              url: `${req.protocol}://${req.get(
                "host"
              )}/public/uploads/${val.fileType}/${
                val.fileId
              }/${val.fileName}`,
            });
          } catch (error) {
            reject(error);
          }
        })
    );

    await Promise.all(promises)
      .then((results) => res.status(200).send(results))
      .catch((error) =>
        res.status(400).send({ error: error.message })
      );
  });

  // TODO: FIX VERSIONING ON ROUTE, VERSIONING IS NOT ABOUT THE APP VERSION BUT THE ROUTE VERSION
  app.post(
    `/v${process.env.APP_MAJOR_VERSION}/files/upload`,
    checkAuth,
    upload.none(),
    async (req, res) => {
      const files = JSON.parse(req.body.files);
      // Proceed mapping the new file objects into the desired format
      let fileDatas;
      let fileDataDestinations;
      for (let index = 0; index < files.length; index++) {
        const newId = uuid();
        const destination = `${DYNAMIC_ASSET_FOLDER_PATH}/${files[index].fileType}/${newId}/file_${newId}`;
        fileDatas.push({
          id: newId,
          filename: `file_${newId}`,
          encoding: files[index].encoding,
          mimetype: files[index].mimetype,
          fileType: files[index].fileType,
          folderDestination: `/${files[index].fileType}/${newId}`,
          destination: destination,
          displayItemId: files[index].displayItemId,
          storeId: files[index].storeId,
          status: files[index].status,
        });
        fileDataDestinations.push(destination);
      }

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
          unlinkFilesSync(fileDataDestinations);
          throw new Error(
            `${ERROR_WHILE_UPLOADING_FILES}: ${e}`
          );
        }

        // Send an appropriate response to the client
        await trx.commit();
        return res
          .status(200)
          .json({ message: "File upload successful" });
      } catch (e) {
        await SequelizeRollback(trx, e);
        SequelizeErrorHandling(e, res);
      }
    }
  );

  app.patch(
    `/v1/files/update`,
    checkAuth,
    upload.none(),
    async (req, res) => {
      const files =
        req.body.files && JSON.parse(req.body.files);
      const oldFiles =
        req.body.oldFiles && JSON.parse(req.body.oldFiles);
      const fileType = req.query.fileType;

      if (!fileType)
        return res.status(400).send("Error: No fileType");

      // Proceed mapping the new file objects into the desired format
      // This will overwritte all the file info from the database
      // Aswell as the file binary from the filesystem
      let fileDatas;
      let fileDataDestinations;
      for (let index = 0; index < files.length; index++) {
        const newId = uuid();
        const destination = `${DYNAMIC_ASSET_FOLDER_PATH}/${files[index].fileType}/${newId}/file_${newId}`;
        fileDatas.push({
          id: newId,
          filename: `file_${newId}`,
          encoding: files[index].encoding,
          mimetype: files[index].mimetype,
          fileType: files[index].fileType,
          folderDestination: `/${files[index].fileType}/${newId}`,
          destination: destination,
          displayItemId: files[index].displayItemId,
          storeId: files[index].storeId,
          status: files[index].status,
        });
        fileDataDestinations.push(destination);
      }

      // do the transaction
      const trx = await db.transaction();
      try {
        // delete all the file info on the database
        await MasterFile.destroy({
          where: {
            fileType: fileType,
            id: oldFiles.ids,
          },
        });
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
          unlinkFilesSync(fileDataDestinations);
          throw new Error(
            `${ERROR_WHILE_UPLOADING_FILES}: ${e}`
          );
        }

        // commit the db transaction
        await trx.commit();
        // destroy the old files
        // this should be executed only after all the database execution done successfully
        unlinkFilesSync(oldFiles.destinations);
        // Send an appropriate response to the client
        return res
          .status(200)
          .json({ message: "Successfully updated files" });
      } catch (e) {
        await SequelizeRollback(trx, e);
        SequelizeErrorHandling(e, res);
      }
    }
  );

  app.delete(
    `/v1/files/purge`,
    checkAuth,
    upload.none(),
    async (req, res) => {
      const oldFiles = JSON.parse(req.body.oldFiles);
      const fileType = req.query.fileType;
      if (!fileType)
        return res.status(400).send("Error: No fileType");

      // do the transaction
      const trx = await db.transaction();
      try {
        // delete all the file info on the database
        await MasterFile.destroy({
          where: {
            fileType: fileType,
            id: oldFiles.ids,
          },
        });

        // commit the db transaction
        await trx.commit();
        // destroy the old files
        // this should be executed only after all the database execution done successfully
        unlinkFilesSync(oldFiles.destinations);
        // Send an appropriate response to the client
        return res
          .status(200)
          .json({ message: "Successfully deleted files" });
      } catch (e) {
        await SequelizeRollback(trx, e);
        SequelizeErrorHandling(e, res);
      }
    }
  );
};

module.exports = {
  defaultRoute,
};
