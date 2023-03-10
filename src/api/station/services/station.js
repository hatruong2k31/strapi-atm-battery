"use strict";

/**
 * station service
 */

const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService("api::station.station", ({ strapi }) => ({
  // get List
  async find(params) {
    const { results, pagination } = await super.find(params);
    console.log(results, pagination);
    return { results, pagination };
  },

  //get Details
  async findOne(entityId, params = {}) {
    var data = strapi.entityService.findOne(
      "api::station.station",
      entityId,
      this.getFetchParams(params)
    );

    return data;
  },
}));
