// GENERALS ERRORS
const UNIDENTIFIED_ERROR =
  "Ada yang salah ni kawan, coba kontak customer service ya biar kamu dibantuin !";
const STORE_ALREADY_EXIST =
  "Toko sudah ada, coba pakai nama lain untuk toko baru anda !";

// INTERNAL ERRORS
const CANT_VALIDATE_RECOVERY_TOKEN =
  "Recovery token tidak dapat tervalidasi, token mungkin sudah pernah digunakan. \n\n Silahkan request email recovery password lagi ya.";
const INTERNAL_ERROR_CANT_COMMUNICATE =
  "INTERNAL ERROR: Can't communicate with the other services.";
const KEY_HAS_TO_BE_UNIQUE = "KEY_HAS_TO_BE_UNIQUE";
const ERROR_WHILE_UPLOADING_FILES =
  "Error saat memproses file upload, coba lagi atau contact cs";

// CREDENTIALS ERRORS
const PLEASE_VERIFY_OTP = "PLEASE_VERIFY_OTP";
const USER_UNAUTHORIZED = "User unauthorized";
const SESSION_TOKEN_NOT_FOUND =
  "Session token tidak dapat ditemukan !";

module.exports = {
  STORE_ALREADY_EXIST,
  CANT_VALIDATE_RECOVERY_TOKEN,
  INTERNAL_ERROR_CANT_COMMUNICATE,
  KEY_HAS_TO_BE_UNIQUE,
  ERROR_WHILE_UPLOADING_FILES,
  UNIDENTIFIED_ERROR,
  USER_UNAUTHORIZED,
  PLEASE_VERIFY_OTP,
  SESSION_TOKEN_NOT_FOUND,
};
