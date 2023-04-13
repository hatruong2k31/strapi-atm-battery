"use strict";

/**
 * station controller
 * @param {object} ctx
 * @param {*} next
 */

let getStationList = async (ctx) => {
  try {
    let pagination = ctx.request.query.pagination || {
      page: 1,
      pageSize: process.env.DATA_PER_PAGE || 20,
    };
    let filter = ctx.request.query.filters || [];
    let sort = ctx.request.query.sort || [];
    let field = ctx.request.query.fields || ["*"];

    let stationList = await strapi
      .service("api::station.station")
      .getStationList(pagination, filter, sort, field, ctx);
    if (stationList.status != 200) {
      return ctx.badRequest("Server Error", stationList.details);
    } else {
      // let _re = strapi.config.function.returnResult(stationList.details);

      ctx.body = stationList.details;
    }
  } catch (error) {
    return ctx.badRequest("Server Error", error);
  }
};

let getStationDetail = async (ctx) => {
  try {
    let id = ctx.params.id;
    if (id == null) {
      throw strapi.customLang.__("invalid_field", "Station Id");
    }

    let stationData = await strapi
      .service("api::station.station")
      .getStationDetail(id, ctx);

    if (stationData.status != 200) {
      return ctx.badRequest("Server Error", stationData.details);
    } else {
      if (stationData.details) {
        ctx.body = strapi.config.function.returnResult(stationData.details);
      } else {
        ctx.body = strapi.config.function.throwError(
          400,
          "Station does not exist!",
          "Server Error"
        );
      }
    }
  } catch (error) {
    return ctx.badRequest("Server Error", error);
  }
};

let postStationDetail = async (ctx) => {
  try {
    let data = ctx.request.body;

    if (data == null) {
      throw strapi.customLang.__("no_data");
    }

    if (!data.name) {
      throw strapi.customLang.__("invalid_field", "Name");
    }
    if (!data.trays) {
      throw strapi.customLang.__("invalid_field", "Trays");
    }

    let stationData = await strapi
      .service("api::station.station")
      .postStationDetail(data, ctx);

    if (stationData.status != 200) {
      return ctx.badRequest("Server Error", stationData.details);
    } else {
      let _re = strapi.config.function.returnResult(stationData.details);

      ctx.body = _re;
    }
  } catch (error) {
    return ctx.badRequest("Server Error", error);
  }
};

let putStationDetail = async (ctx) => {
  try {
    let id = ctx.params.id;
    let data = ctx.request.body;

    if (!id) {
      throw strapi.customLang.__("required_field", "Station Id");
    }

    if (data == null) {
      throw strapi.customLang.__("no_data");
    }

    if (!data.name) {
      throw strapi.customLang.__("invalid_field", "Name");
    }
    if (!data.trays) {
      throw strapi.customLang.__("invalid_field", "Trays");
    }

    let stationData = await strapi
      .service("api::station.station")
      .putStationDetail(id, data, ctx);

    if (stationData.status != 200) {
      return ctx.badRequest("Server Error", stationData.details);
    } else {
      let _re = strapi.config.function.returnResult(stationData.details);

      ctx.body = _re;
    }
  } catch (error) {
    return ctx.badRequest("Server Error", error);
  }
};

let deleteStation = async (ctx) => {
  try {
    let id = ctx.params.id;
    if (!id) {
      throw strapi.customLang.__("required_field", "Station Id");
    }

    let stationData = await strapi
      .service("api::station.station")
      .deleteStation(id, ctx);

    if (stationData.status != 200) {
      return ctx.badRequest("Server Error", stationData.details);
    } else {
      let _re = strapi.config.function.returnResult(stationData.details);

      ctx.body = { id: id };
    }
  } catch (error) {
    return ctx.badRequest("Server Error", error);
  }
};

module.exports = {
  getStationList,
  getStationDetail,
  postStationDetail,
  putStationDetail,
  deleteStation,
};
