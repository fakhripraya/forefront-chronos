const jwt = require('jsonwebtoken');
const { PLEASE_VERIFY_OTP } = require('../variables/responseMessage');

function handleCSRFToken(req, res, next) {
    res.locals.csrfToken = req.csrfToken();
    next();
}

// Check the credential token middleware
function checkCredentialToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token === null) return res.sendStatus(401);
    jwt.verify(token, process.env.APP_ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.send(err).status(403);
        if (!user.OTPVerified) return res.send(PLEASE_VERIFY_OTP).status(403);
        req.user = user;
        next();
    })
}

module.exports = {
    handleCSRFToken,
    checkCredentialToken
}