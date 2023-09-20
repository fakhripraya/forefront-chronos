const {
  ALPHABETH_CHAR_AND_NUMBER,
} = require("../variables/general");

function generateProductCode(storeId, namaBarang) {
  const IdProductCode = Math.floor(
    Math.random() * 9999999999
  );
  const product = `${storeId}//${namaBarang}//${IdProductCode}`;
  return product;
}

function generateCode(length, user, prefix) {
  // program to generate random strings
  // declare all characters
  const characters = ALPHABETH_CHAR_AND_NUMBER;

  try {
    // generate 8 random crypted number
    let result = "";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * charactersLength)
      );
    }

    let finalCode =
      prefix +
      result.charAt(0).toUpperCase() +
      "/" +
      result.charAt(result.length - 1).toUpperCase() +
      "-" +
      user.fullName.charAt(0).toUpperCase() +
      "/" +
      Math.floor(Math.random() * charactersLength) +
      Math.floor(Math.random() * charactersLength) +
      Math.floor(Math.random() * charactersLength) +
      "/" +
      result;

    return finalCode;
  } catch (err) {
    throw new Error(err);
  }
}

module.exports = {
  generateProductCode,
  generateCode,
};
