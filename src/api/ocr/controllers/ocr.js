"use strict";

let getList = async (ctx) => {
  try {
    let pagination = ctx.request.query.pagination || {
      page: 1,
      pageSize: process.env.DATA_PER_PAGE || 20,
    };
    let filter = ctx.request.query.filters || [];
    let sort = ctx.request.query.sort || [];
    let field = ctx.request.query.fields || ["*"];

    let ocrList = await strapi
      .service("api::ocr.ocr")
      .getList(pagination, filter, sort, field, ctx);
    if (ocrList.status != 200) {
      return ctx.badRequest("Server Error", ocrList.details);
    } else {
      // let _re = strapi.config.function.returnResult(ocrList.details);

      ctx.body = ocrList.details;
    }
  } catch (error) {
    return ctx.badRequest("Server Error", error);
  }
};

let getDetail = async (ctx) => {
  try {
    let id = ctx.params.id;
    if (id == null) {
      throw strapi.customLang.__("invalid_field", "Contact Id");
    }

    let ocrData = await strapi.service("api::ocr.ocr").getDetail(id, ctx);

    if (ocrData.status != 200) {
      return ctx.badRequest("Server Error", ocrData.details);
    } else {
      if (ocrData.details) {
        ctx.body = strapi.config.function.returnResult(ocrData.details);
      } else {
        ctx.body = strapi.config.function.throwError(
          400,
          "Contact does not exist!",
          "Server Error"
        );
      }
    }
  } catch (error) {
    return ctx.badRequest("Server Error", error);
  }
};

let postDetail = async (ctx) => {
  try {
    let data = ctx.request.body;
    console.log(data);

    if (data == null) {
      throw strapi.customLang.__("no_data");
    }

    let g_contact_data = await strapi
      .service("api::ocr.ocr")
      .postDetail(data, ctx);

    if (g_contact_data.status != 200) {
      return ctx.badRequest("Server Error", g_contact_data.details);
    } else {
      let _re = strapi.config.function.returnResult(g_contact_data.details);

      ctx.body = _re;
    }
  } catch (error) {
    return ctx.badRequest("Server Error", error);
  }
};

let delDetail = async (ctx) => {
  try {
    let id = ctx.params.id;
    if (!id) {
      throw strapi.customLang.__("required_field", "Contact Id");
    }

    let ocrData = await strapi.service("api::ocr.ocr").delDetail(id, ctx);

    if (ocrData.status != 200) {
      return ctx.badRequest("Server Error", ocrData.details);
    } else {
      let _re = strapi.config.function.returnResult(ocrData.details);

      ctx.body = { id: id };
    }
  } catch (error) {
    return ctx.badRequest("Server Error", error);
  }
};

let checkCardId = async (ctx) => {
  try {
    let identity_card = ctx.request.body.identity_card;
    if (identity_card === "" || null) {
      throw strapi.customLang.__("invalid_field", "Identity Card");
    }
    let contactData = await strapi
      .service("api::ocr.ocr")
      .getDetailByCardId(identity_card, ctx);
    if (contactData.status !== 200) {
      let _re = strapi.config.function.returnResult({
        status: 200,
        identity_card: identity_card,
        message: "Chưa tồn tại!",
      });

      ctx.body = _re;
    } else {
      let _re = strapi.config.function.returnResult({
        status: 400,
        fk_ffp_number: contactData.details.fk_ffp_number,
        identity_card: identity_card,
        message: "Đã tồn tại!",
      });

      ctx.body = _re;
    }
  } catch (error) {
    return ctx.badRequest("Server Error", error);
  }
};

module.exports = { getList, getDetail, postDetail, delDetail, checkCardId };
