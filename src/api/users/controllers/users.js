"use strict";

/**
 * A set of functions called "actions" for `users`
 */
let getUserList = async (ctx) => {
  try {
    let pagination = ctx.request.query.pagination || {
      page: 1,
      pageSize: process.env.DATA_PER_PAGE || 20,
    };
    let filter = ctx.request.query.filters || [];
    let sort = ctx.request.query.sort || [];
    let field = ctx.request.query.fields || ["*"];

    let userList = await strapi
      .service("api::users.users")
      .getUserList(pagination, filter, sort, field, ctx);
    if (userList.status != 200) {
      return ctx.badRequest("Server Error", userList.details);
    } else {
      // let _re = strapi.config.function.returnResult(userList.details);

      ctx.body = userList.details;
    }
  } catch (error) {
    return ctx.badRequest("Server Error", error);
  }
};

let getUserByCardId = async (ctx) => {
  try {
    let card_id = ctx.request.body.card_id;

    if (card_id == null) {
      return strapi.config.function.resultCreate(404, error.message || error);
    }

    let userData = await strapi
      .service("api::users.users")
      .getUserByCardId(card_id, ctx);

    if (userData.status != 200) {
      return ctx.badRequest("Server Error", userData.details);
    } else {
      // let _re = strapi.config.function.returnResult(userData.details);
      if (userData.details) {
        ctx.body = { status: 200, data: userData.details };
      } else {
        ctx.body = {
          status: 400,
          data: null,
          message: "Does not exist!",
        };
      }
    }
  } catch (error) {
    return ctx.badRequest("Server Error", error);
  }
};

let checkEmail = async (ctx) => {
  try {
    let email = ctx.request.body.email;
    if (email == null) {
      throw strapi.customLang.__("invalid_field", "Email");
    }
    let userData = await strapi
      .service("api::users.users")
      .getUserByEmail(email, ctx);
    if (userData.status != 200) {
      return ctx.badRequest("Server Error", userData.details);
    } else {
      let _re = strapi.config.function.returnResult({
        ok: true,
      });

      ctx.body = _re;
    }
  } catch (error) {
    return ctx.badRequest("Server Error", error);
  }
};

let getUserById = async (ctx) => {
  try {
    let id = ctx.params.id;
    if (id == null) {
      throw strapi.customLang.__("invalid_field", "User Id");
    }

    let userData = await strapi
      .service("api::users.users")
      .getUserById(id, ctx);

    if (userData.status != 200) {
      return ctx.badRequest("Server Error", userData.details);
    } else {
      if (userData.details) {
        ctx.body = strapi.config.function.returnResult(userData.details);
      } else {
        ctx.body = strapi.config.function.throwError(
          400,
          "User does not exist!",
          "Server Error"
        );
      }
    }
  } catch (error) {
    return ctx.badRequest("Server Error", error);
  }
};

let postUserDetail = async (ctx) => {
  try {
    let data = ctx.request.body;

    if (data == null) {
      throw strapi.customLang.__("no_data");
    }

    if (data.email == "" || null) {
      throw strapi.customLang.__("invalid_field", "Email");
    }
    if (data.phone == "" || null) {
      throw strapi.customLang.__("invalid_field", "Phone");
    }
    if (data.card_id == "" || null) {
      throw strapi.customLang.__("invalid_field", "Card Id");
    }

    let userData = await strapi
      .service("api::users.users")
      .postUserDetail(data, ctx);

    if (userData.status != 200) {
      return ctx.badRequest("Server Error", userData.details);
    } else {
      let _re = strapi.config.function.returnResult(userData.details);

      ctx.body = _re;
    }
  } catch (error) {
    return ctx.badRequest("Server Error", error);
  }
};

let putUserDetail = async (ctx) => {
  try {
    let id = ctx.params.id;
    let data = ctx.request.body;

    if (!id) {
      throw strapi.customLang.__("required_field", "User Id");
    }

    if (data == null) {
      throw strapi.customLang.__("no_data");
    }

    if (data.email == "" || null) {
      throw strapi.customLang.__("invalid_field", "Email");
    }
    if (data.phone == "" || null) {
      throw strapi.customLang.__("invalid_field", "Phone");
    }
    if (data.card_id == "" || null) {
      throw strapi.customLang.__("invalid_field", "Card Id");
    }

    let userData = await strapi
      .service("api::users.users")
      .putUserDetail(id, data, ctx);

    if (userData.status != 200) {
      return ctx.badRequest("Server Error", userData.details);
    } else {
      let _re = strapi.config.function.returnResult(userData.details);

      ctx.body = _re;
    }
  } catch (error) {
    return ctx.badRequest("Server Error", error);
  }
};

let deleteUser = async (ctx) => {
  try {
    let id = ctx.params.id;
    if (!id) {
      throw strapi.customLang.__("required_field", "User Id");
    }

    let userData = await strapi.service("api::users.users").deleteUser(id, ctx);

    if (userData.status != 200) {
      return ctx.badRequest("Server Error", userData.details);
    } else {
      let _re = strapi.config.function.returnResult(userData.details);
      ctx.body = _re;
    }
  } catch (error) {
    return ctx.badRequest("Server Error", error);
  }
};

module.exports = {
  getUserByCardId,
  getUserList,
  getUserById,
  postUserDetail,
  putUserDetail,
  deleteUser,
  checkEmail,
};
