const {
  SEQUELIZE_DATABASE_ERROR,
  SEQUELIZE_VALIDATION_ERROR,
  SEQUELIZE_UNIQUE_CONSTRAINT_ERROR,
} = require("../variables/dbError");

async function SequelizeRollback(trx, error) {
  console.log(error);
  console.log(
    "There has been some error when commiting the transaction, rolling back..."
  );
  await trx.rollback();
}

function SequelizeErrorHandling(err, res) {
  var errMessages = [];
  // if the DB error is database error
  if (err.name === SEQUELIZE_DATABASE_ERROR)
    return res.status(500).send({
      code: err.parent.code,
      parentMessage: err.parent.sqlMessage,
      original: err.original.code,
      originalMessage: err.original.sqlMessage,
    });
  // if the DB error is the user input error
  if (err.name === SEQUELIZE_VALIDATION_ERROR) {
    err.errors.forEach((err) =>
      errMessages.push(err.message)
    );
    return res.status(400).send(errMessages);
  }
  // if the DB error is the unique constraint error
  if (err.name === SEQUELIZE_UNIQUE_CONSTRAINT_ERROR) {
    err.errors.forEach((err) =>
      errMessages.push(err.message)
    );
    return res.status(400).send({
      ...errMessages,
      possibility: KEY_HAS_TO_BE_UNIQUE,
    });
  } else return res.status(400).send(err.toString());
}

module.exports = {
  SequelizeRollback,
  SequelizeErrorHandling,
};
