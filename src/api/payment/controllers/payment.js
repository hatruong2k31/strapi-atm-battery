"use strict";

/**
 * payment controller
 */
let getPaymentList = async (ctx) => {
  try {
    let pagination = ctx.request.query.pagination || {
      page: 1,
      pageSize: process.env.DATA_PER_PAGE || 20,
    };
    let filter = ctx.request.query.filters || [];
    let sort = ctx.request.query.sort || [];
    let field = ctx.request.query.fields || ["*"];

    let userList = await strapi
      .service("api::payment.payment")
      .getList(pagination, filter, sort, field, ctx);
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

let getPaymentDetail = async (ctx) => {
  try {
    let id = ctx.params.id;
    if (id == null) {
      throw strapi.customLang.__("invalid_field", "Payment Id");
    }

    let paymentData = await strapi
      .service("api::payment.payment")
      .getDetail(id, ctx);

    if (paymentData.status != 200) {
      return ctx.badRequest("Server Error", paymentData.details);
    } else {
      if (paymentData.details) {
        ctx.body = strapi.config.function.returnResult(paymentData.details);
      } else {
        ctx.body = strapi.config.function.throwError(
          400,
          "Payment does not exist!",
          "Server Error"
        );
      }
    }
  } catch (error) {
    return ctx.badRequest("Server Error", error);
  }
};

let postPaymentDetail = async (ctx) => {
  try {
    let data = ctx.request.body;

    if (data == null) {
      throw strapi.customLang.__("no_data");
    }

    if (data.user_id == "" || null) {
      throw strapi.customLang.__("invalid_field", "User");
    }
    if (data.unit_price == "" || null) {
      throw strapi.customLang.__("invalid_field", "Unit Price");
    }
    if (data.total_price == "" || null) {
      throw strapi.customLang.__("invalid_field", "Total Price");
    }

    let paymentData = await strapi
      .service("api::payment.payment")
      .postDetail(data, ctx);

    if (paymentData.status != 200) {
      return ctx.badRequest("Server Error", paymentData.details);
    } else {
      let _re = strapi.config.function.returnResult(paymentData.details);

      ctx.body = _re;
    }
  } catch (error) {
    return ctx.badRequest("Server Error", error);
  }
};

let putPaymentDetail = async (ctx) => {
  try {
    let id = ctx.params.id;
    let data = ctx.request.body;

    if (!id) {
      throw strapi.customLang.__("required_field", "Payment Id");
    }

    if (data == null) {
      throw strapi.customLang.__("no_data");
    }

    if (data.user_id == "" || null) {
      throw strapi.customLang.__("invalid_field", "User");
    }
    if (data.unit_price == "" || null) {
      throw strapi.customLang.__("invalid_field", "Unit Price");
    }
    if (data.total_price == "" || null) {
      throw strapi.customLang.__("invalid_field", "Total Price");
    }

    let paymentData = await strapi
      .service("api::payment.payment")
      .putDetail(id, data, ctx);

    if (paymentData.status != 200) {
      console.log("err");
      return ctx.badRequest("Server Error", paymentData.details);
    } else {
      let _re = strapi.config.function.returnResult(paymentData.details);

      ctx.body = _re;
    }
  } catch (error) {
    return ctx.badRequest("Server Error", error);
  }
};

let delPaymentDetail = async (ctx) => {
  try {
    let id = ctx.params.id;
    if (!id) {
      throw strapi.customLang.__("required_field", "Payment Id");
    }

    let paymentData = await strapi
      .service("api::payment.payment")
      .delDetail(id, ctx);

    if (paymentData.status != 200) {
      return ctx.badRequest("Server Error", paymentData.details);
    } else {
      let _re = strapi.config.function.returnResult(paymentData.details);
      ctx.body = _re;
    }
  } catch (error) {
    return ctx.badRequest("Server Error", error);
  }
};

module.exports = {
  getPaymentList,
  getPaymentDetail,
  postPaymentDetail,
  putPaymentDetail,
  delPaymentDetail,
};
