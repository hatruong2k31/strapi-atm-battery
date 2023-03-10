const jsonata = require("jsonata");

let ConstraintValidatorHandler = (validate, body, lang, { strapi }) => {
  for (let k = 0; k < validate.columnName.length; k++) {
    let col = validate.columnName[k];

    let expression = jsonata(validate.command);
    let result = expression.evaluate(body);

    if (!result) {
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

module.exports = ConstraintValidatorHandler;
