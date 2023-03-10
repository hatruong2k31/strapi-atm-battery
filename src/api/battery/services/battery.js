"use strict";

/**
 * battery service
 */

const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService("api::battery.battery", ({ strapi }) => ({
  // get List
  async find(params) {
    const { results, pagination } = await super.find(params);
    return { results, pagination };
  },

  //get Details
  async findOne(entityId, params = {}) {
    var data = strapi.entityService.findOne(
      "api::battery.battery",
      entityId,
      this.getFetchParams(params)
    );

    return data;
  },
}));
