const { createFileFromBase64 } = require("../utils/functions");
const { checkCredentialToken } = require("../utils/middleware");
const multer = require('multer');
const upload = multer();

const defaultRoute = (app) => {
    app.post(`/v${process.env.APP_MAJOR_VERSION}/upload`, upload.array('files'), async (req, res) => {
        console.log(req.files);
        // check query param availability
        if (!req.body) return res.sendStatus(400);

        // Get the request body
        const request = req.body;

        // Create file
        const { result, error, status } = createFileFromBase64(request.username, request.fileType, request.fileNameWithExtension, request.fileImage);
        if (error) res.send(error).status(status);
        else res.send(result).status(status);
    });
}

module.exports = {
    defaultRoute
}