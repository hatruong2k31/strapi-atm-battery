let RequiredValidatorHandler = (validate, body, lang, { strapi }) => {
  for (let k = 0; k < validate.columnName.length; k++) {
    let col = validate.columnName[k];
    let tmp = body[col];

    if (!tmp) {
      if (validate.message) {
        if (validate.message[lang]) {
          return validate.message[lang];
        } else {
          return strapi.customLang.__("required_field", col);
        }
      } else {
        return strapi.customLang.__("required_field", col);
      }
    }

    k++;
  }
};

module.exports = RequiredValidatorHandler;
