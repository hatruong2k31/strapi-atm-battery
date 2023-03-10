const jsonata = require("jsonata");

const {
  RequiredValidatorHandler,
  EmailValidatorHandler,
  ConstraintValidatorHandler,
  RegexCheckHandler,
} = require("./handlers/index");

const ValidatorType = {
  RequiredValidator: "RequiredValidator",
  ConstraintValidator: "ConstraintValidator",
  EmailValidator: "EmailValidator",
};

let checkValidate = async (req, lang, ctx, { strapi }) => {
  let command_code = req.query.command_code;
  let body = req.body;
  let user = await strapi.config.function.getUserSchema(ctx.id);

  if (!command_code) {
    return strapi.customLang.__("invalid_field", "Command");
  }

  let knex = strapi.db.connection;

  let command = await knex
    .withSchema(user[0].schema)
    .from("command")
    .select("id")
    .where({ is_delete: false, code: command_code });

  let layout = await knex
    .withSchema(user[0].schema)
    .from("layout")
    .select("*")
    .where({ command_id: command[0].id, is_delete: false });

  if (layout.length == 0) {
    return strapi.customLang.__("data_not_existed", "Layout");
  }

  //lấy thông tin layout theo phần quyền, mặc định nếu ko có phân quyền layout thì sẽ lấy layout có is_default = true
  let active_layout_id = layout[0].id;

  let layout_data = await knex
    .withSchema(user[0].schema)
    .from("layout_data")
    .select("*")
    .where({ layout_id: active_layout_id });

  let validators = JSON.parse(
    JSON.parse(JSON.stringify(layout_data[0].validate_content || []))
  );

  for (let i = 0; i < validators.length; i++) {
    let validate = validators[i];
    let _expr = true;
    let result;

    // Kiểm tra expr
    if (validate.expr) {
      let expression = jsonata(validate.expr);
      _expr = expression.evaluate(body);
    }

    if (_expr) {
      // kiểm tra RequiredValidator
      if (validate.type == ValidatorType.RequiredValidator) {
        result = RequiredValidatorHandler(validate, body, lang, {
          strapi,
        });
      }

      // kiểm tra ConstraintValidator
      if (validate.type == ValidatorType.ConstraintValidator) {
        result = ConstraintValidatorHandler(validate, body, lang, {
          strapi,
        });
      }

      // kiểm tra EmailValidator
      if (validate.type == ValidatorType.EmailValidator) {
        result = EmailValidatorHandler(validate, body, lang, {
          strapi,
        });
      }

      // kiểm tra regexCharacter
      if (validate.regexCharacter && !result) {
        result = RegexCheckHandler(validate, body, lang, { strapi });
      }

      if (result) return result;
    }
  }
};

module.exports = {
  checkValidate,
};
