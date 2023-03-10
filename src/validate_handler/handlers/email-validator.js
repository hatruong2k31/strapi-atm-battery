let EmailValidatorHandler = (validate, body, lang, { strapi }) => {
  let emailRegex = new RegExp(
    "^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+.[A-Za-z]{2,4}$"
  );

  for (let k = 0; k < validate.columnName.length; k++) {
    let col = validate.columnName[k];
    let tmp = body[col];

    if (!emailRegex.test(tmp)) {
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

module.exports = EmailValidatorHandler;
