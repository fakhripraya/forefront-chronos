require("dotenv").config();
const express = require("express");
const { AppConfig } = require("./src/config");
const { defaultRoute } = require("./src/routes/default");
const {
  createFolderSync,
} = require("./src/utils/functions");
const expressApp = express();

// Init App configurations
const { server, app } = AppConfig(expressApp, express);

// Init Folders
createFolderSync();

// Init Routes
defaultRoute(app);

const port = process.env.PORT || 8005;
server.listen(port, () => {
  console.log(`Server is up and running on ${port} ...`);
});
