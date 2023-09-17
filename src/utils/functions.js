const fs = require("fs");
const path = require("path");
const {
  SEQUELIZE_DATABASE_ERROR,
  SEQUELIZE_VALIDATION_ERROR,
  SEQUELIZE_UNIQUE_CONSTRAINT_ERROR,
} = require("../variables/dbError");
const {
  KEY_HAS_TO_BE_UNIQUE,
} = require("../variables/responseMessage");
const {
  DYNAMIC_ASSET_FOLDER_PATH,
} = require("../variables/general");
const rootPath = process.cwd();

async function SequelizeRollback(trx, error) {
  console.log(error);
  console.log(
    "There has been some error when commiting the transaction, rolling back..."
  );
  await trx.rollback();
}

function SequelizeErrorHandling(err, res) {
  var errMessages = [];
  // if the DB error is database error
  if (err.name === SEQUELIZE_DATABASE_ERROR)
    return res.status(500).send({
      code: err.parent.code,
      parentMessage: err.parent.sqlMessage,
      original: err.original.code,
      originalMessage: err.original.sqlMessage,
    });
  // if the DB error is the user input error
  if (err.name === SEQUELIZE_VALIDATION_ERROR) {
    err.errors.forEach((err) =>
      errMessages.push(err.message)
    );
    return res.status(400).send(errMessages);
  }
  // if the DB error is the unique constraint error
  if (err.name === SEQUELIZE_UNIQUE_CONSTRAINT_ERROR) {
    err.errors.forEach((err) =>
      errMessages.push(err.message)
    );
    return res.status(400).send({
      ...errMessages,
      possibility: KEY_HAS_TO_BE_UNIQUE,
    });
  } else return res.status(400).send(err.toString());
}

function createFileFromBase64(
  userName,
  fileType,
  fileNameWithExtension,
  fileImage
) {
  let { fileName, fileExtension } =
    splitFileNameAndExtension(fileNameWithExtension);
  const match = fileImage.match(
    /^data:([a-z]+\/[a-z0-9-+.]+);base64,/
  );
  if (match) fileExtension = match[1].split("/")[1];

  const namaFile = `${fileName}.${fileExtension}`;
  const folderPath = `${DYNAMIC_ASSET_FOLDER_PATH}/${userName}/${fileType}`;
  const folder = fs.existsSync(folderPath);
  if (!folder) {
    var err = createFolder(folderPath);
    if (err)
      return { result: null, error: err, status: 400 };
  }

  const imageData = Buffer.from(fileImage, "base64");
  try {
    fs.writeFileSync(
      `${folderPath}/${namaFile}`,
      imageData
    );
  } catch (err) {
    return { result: null, error: err, status: 400 };
  }

  return { result: folderPath, error: null, status: 201 };
}

function splitFileNameAndExtension(filePath) {
  const fileNameWithExtension = filePath.split("/").pop();
  const indexOfLastDot =
    fileNameWithExtension.lastIndexOf(".");
  const fileName = fileNameWithExtension.substring(
    0,
    indexOfLastDot
  );
  const fileExtension = fileNameWithExtension.substring(
    indexOfLastDot + 1
  );

  return { fileName, fileExtension };
}

function createFileSync(destination, buffer, mode) {
  console.log(destination);
  console.log(buffer);
  fs.writeFileSync(
    path.join(rootPath, destination),
    buffer,
    mode,
    (err) => {
      if (err) throw new Error(err);
    }
  );
}

function createFolderSync(folderPath = "/") {
  fs.mkdirSync(
    path.join(
      rootPath,
      DYNAMIC_ASSET_FOLDER_PATH + folderPath
    ),
    { recursive: true },
    (err) => {
      if (err) throw new Error(err);
    }
  );
}

function unlinkFilesSync(filesToDelete) {
  for (const file of filesToDelete) {
    // Check if the file exists before attempting to delete it
    fs.access(
      path.join(rootPath, file.destination),
      fs.constants.F_OK,
      (err) => {
        if (!err) {
          // File exists, so you can safely unlink it
          fs.unlink(file.destination, (err) => {
            if (err) {
              console.error(
                `Error deleting file '${file.destination}': ${err}`
              );
            }
          });
        }
      }
    );
  }
}

module.exports = {
  SequelizeRollback,
  SequelizeErrorHandling,
  createFileFromBase64,
  splitFileNameAndExtension,
  createFileSync,
  createFolderSync,
  unlinkFilesSync,
};
