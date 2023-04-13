"use strict";

/**
 * battery controller
 * @param {object} ctx
 * @param {*} next
 */

let getBatteryList = async (ctx) => {
  try {
    let pagination = ctx.request.query.pagination || {
      page: 1,
      pageSize: process.env.DATA_PER_PAGE || 20,
    };
    let filter = ctx.request.query.filters || [];
    let sort = ctx.request.query.sort || [];
    let field = ctx.request.query.fields || ["*"];

    let batteryList = await strapi
      .service("api::battery.battery")
      .getBatteryList(pagination, filter, sort, field, ctx);
    if (batteryList.status != 200) {
      return ctx.badRequest("Server Error", batteryList.details);
    } else {
      // let _re = strapi.config.function.returnResult(batteryList.details);

      ctx.body = batteryList.details;
    }
  } catch (error) {
    return ctx.badRequest("Server Error", error);
  }
};

let getBatteryDetail = async (ctx) => {
  try {
    let id = ctx.params.id;
    if (id == null) {
      throw strapi.customLang.__("invalid_field", "Battery Id");
    }

    let batteryData = await strapi
      .service("api::battery.battery")
      .getBatteryDetail(id, ctx);

    if (batteryData.status != 200) {
      return ctx.badRequest("Server Error", batteryData.details);
    } else {
      if (batteryData.details) {
        ctx.body = strapi.config.function.returnResult(batteryData.details);
      } else {
        ctx.body = strapi.config.function.throwError(
          400,
          "Battery does not exist!",
          "Server Error"
        );
      }
    }
  } catch (error) {
    return ctx.badRequest("Server Error", error);
  }
};

let postBatteryDetail = async (ctx) => {
  try {
    let data = ctx.request.body;

    if (data == null) {
      throw strapi.customLang.__("no_data");
    }

    if (!data.name) {
      throw strapi.customLang.__("invalid_field", "Name");
    }

    let batteryData = await strapi
      .service("api::battery.battery")
      .postBatteryDetail(data, ctx);

    if (batteryData.status != 200) {
      return ctx.badRequest("Server Error", batteryData.details);
    } else {
      let _re = strapi.config.function.returnResult(batteryData.details);

      ctx.body = _re;
    }
  } catch (error) {
    return ctx.badRequest("Server Error", error);
  }
};

let putBatteryDetail = async (ctx) => {
  try {
    let id = ctx.params.id;
    let data = ctx.request.body;

    if (!id) {
      throw strapi.customLang.__("required_field", "Battery Id");
    }

    if (data == null) {
      throw strapi.customLang.__("no_data");
    }

    if (!data.name) {
      throw strapi.customLang.__("invalid_field", "Name");
    }

    let batteryData = await strapi
      .service("api::battery.battery")
      .putBatteryDetail(id, data, ctx);

    if (batteryData.status != 200) {
      return ctx.badRequest("Server Error", batteryData.details);
    } else {
      let _re = strapi.config.function.returnResult(batteryData.details);

      ctx.body = _re;
    }
  } catch (error) {
    return ctx.badRequest("Server Error", error);
  }
};

let deleteBattery = async (ctx) => {
  try {
    let id = ctx.params.id;
    if (!id) {
      throw strapi.customLang.__("required_field", "Battery Id");
    }

    let batteryData = await strapi
      .service("api::battery.battery")
      .deleteBattery(id, ctx);

    if (batteryData.status != 200) {
      return ctx.badRequest("Server Error", batteryData.details);
    } else {
      let _re = strapi.config.function.returnResult(batteryData.details);

      ctx.body = { id: id };
    }
  } catch (error) {
    return ctx.badRequest("Server Error", error);
  }
};

module.exports = {
  getBatteryList,
  getBatteryDetail,
  postBatteryDetail,
  putBatteryDetail,
  deleteBattery,
};
