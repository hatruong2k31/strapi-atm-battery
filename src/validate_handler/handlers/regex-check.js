let RegexCheckHandler = (validate, body, lang, { strapi }) => {
  let regex = new RegExp(validate.regexCharacter);

  for (let k = 0; k < validate.columnName.length; k++) {
    let col = validate.columnName[k];
    let tmp = body[col];

    if (!regex.test(tmp)) {
      if (validate.message) {
        if (validate.message[lang]) {
          return validate.message[lang];
        } else {
          return strapi.customLang.__("regex_validator", col);
        }
      } else {
        return strapi.customLang.__("regex_validator", col);
      }
    }
  }
};

module.exports = RegexCheckHandler;
