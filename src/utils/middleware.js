const jwt = require('jsonwebtoken');
const {
    SESSION_TOKEN_NOT_FOUND,
    USER_UNAUTHORIZED,
    PLEASE_VERIFY_OTP
} = require('../variables/responseMessage');

function handleCSRFToken(req, res, next) {
    console.log("masuk sini pakcik")
    res.locals.csrfToken = req.csrfToken();
    next();
}

async function checkAuth(req, res, next) {
    // Check the user session
    if (!req.session) return res.sendStatus(401);
    if (!req.session.refreshTokens) return res.status(401).send(SESSION_TOKEN_NOT_FOUND);

    // Check the JWT in the header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token === null) return res.status(401).send(USER_UNAUTHORIZED);

    // Verify JWT access token
    jwt.verify(token, process.env.APP_ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(500).send(err);
        if (!user.OTPVerified) return res.status(403).send(PLEASE_VERIFY_OTP);
        req.user = user;
        next();
    })
}

module.exports = {
    handleCSRFToken,
    checkAuth
}