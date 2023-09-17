const jwt = require("jsonwebtoken");
const {
  SESSION_TOKEN_NOT_FOUND,
  USER_UNAUTHORIZED,
  PLEASE_VERIFY_OTP,
} = require("../variables/responseMessage");
const fs = require("fs");
const { upload } = require("../config/multer");

async function checkAuth(req, res, next) {
  // Check the user session
  if (!req.headers[X_SID])
    return res.status(401).send(SESSION_TOKEN_NOT_FOUND);

  await sequelizeSessionStore.get(
    req.headers[X_SID],
    (err, res) => {
      if (err)
        return res
          .status(401)
          .send(SESSION_TOKEN_NOT_FOUND);

      // Check the JWT in the header
      const authHeader = req.headers["authorization"];
      const token = authHeader && authHeader.split(" ")[1];
      if (token === null)
        return res.status(401).send(USER_UNAUTHORIZED);

      // Verify JWT access token
      jwt.verify(
        token,
        process.env.APP_ACCESS_TOKEN_SECRET,
        (err, user) => {
          if (err) return res.status(500).send(err);
          if (!user.OTPVerified)
            return res.status(403).send(PLEASE_VERIFY_OTP);
          req.user = user;
          next();
        }
      );
    }
  );
}

// Custom file upload middleware
const uploadMiddleware = (req, res, next) => {
  // Use multer upload instance
  upload.array("files")(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    // Retrieve uploaded files
    const files = req.files;
    const errors = [];

    // Validate file types and sizes
    files.forEach((file) => {
      const allowedTypes = ["image/jpeg", "image/png"];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!allowedTypes.includes(file.mimetype)) {
        errors.push(
          `Invalid file type: ${file.originalname}`
        );
      }

      if (file.size > maxSize) {
        errors.push(`File too large: ${file.originalname}`);
      }
    });

    // Handle validation errors
    if (errors.length > 0) {
      // Remove uploaded files
      files.forEach((file) => {
        fs.unlinkSync(file.path);
      });

      return res.status(400).json({ errors });
    }

    // Attach files to the request object
    req.files = files;

    // Proceed to the next middleware or route handler
    next();
  });
};

module.exports = {
  checkAuth,
  uploadMiddleware,
};
