const EMAIL_REGEX =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{1,}))$/g;
const PHONE_REGEX =
  /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,8}$/g;
const KODE_POS_REGEX = /^.{5,}$/g;
const NO_EMPTY_STRING = /^.{1,}$/g;
const NO_EMPTY_3_CHAR_REGEX = /^.{3,}$/g;
const NO_EMPTY_6_CHAR_REGEX = /^.{6,}$/g;
const NO_EMPTY_8_CHAR_REGEX = /^.{8,}$/g;
const NO_EMPTY_10_CHAR_REGEX = /^.{10,}$/g;

module.exports = {
  NO_EMPTY_STRING,
  KODE_POS_REGEX,
  NO_EMPTY_3_CHAR_REGEX,
  NO_EMPTY_6_CHAR_REGEX,
  NO_EMPTY_8_CHAR_REGEX,
  NO_EMPTY_10_CHAR_REGEX,
  EMAIL_REGEX,
  PHONE_REGEX,
};
