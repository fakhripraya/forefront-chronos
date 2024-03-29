require("dotenv").config();
const express = require("express");
const { AppConfig } = require("./src/config");
const { defaultRoute } = require("./src/routes/default");
var app = express();
const {
  createFolderSync,
} = require("./src/utils/functions");

// Init App configurations
app = AppConfig(app, express);

// Init Folders
createFolderSync();

// Init Routes
defaultRoute(app);

const port = process.env.PORT || 8005;
app.listen(port, () => {
  console.log(`Server is up and running on ${port} ...`);
});
