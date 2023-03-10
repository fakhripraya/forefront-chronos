const { EMAIL_REGEX } = require("../variables/regex");

function validateEmail(email) {
    const resultEmail = `${email}`.match(EMAIL_REGEX);
    return resultEmail;
}

module.exports = {
    validateEmail
}
