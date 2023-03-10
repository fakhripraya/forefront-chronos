require('dotenv').config();
const { InitModels } = require('./src/models')
const express = require("express");
const { defaultRoute } = require("./src/routes/default");
const { AppConfig } = require('./src/config');
var app = express();

// Init App configurations
app = AppConfig(app, express);

// Init Models
InitModels();

// Init Routes
defaultRoute(app);

const port = process.env.PORT || 6666;
app.listen(port, () => {
	console.log(`Server is up and running on ${port} ...`);
});

