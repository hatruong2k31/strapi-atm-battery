const { PolicyError } = require("@strapi/utils").errors;
const validateHandler = require("../../../validate_handler/validators");

module.exports = async (policyContext, config, { strapi }) => {
  let lang = policyContext.request.query.lang || process.env.DEFAULT_LANG;
  strapi.customLang.setLocale(lang);

  if (!policyContext.request.query.command_code) {
    policyContext.request.query.command_code = "Default_Edit_Station";
  }

  let checkValidate = await validateHandler.checkValidate(
    policyContext.request,
    lang,
    policyContext.state.user,
    {
      strapi,
    }
  );

  if (checkValidate) {
    throw new PolicyError(checkValidate);
  }

  return true;
};
