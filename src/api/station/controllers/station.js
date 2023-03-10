"use strict";

/**
 * station controller
 * @param {object} ctx
 * @param {*} next
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::station.station", ({ strapi }) => ({
  // get List
  async find(ctx) {
    const { query } = ctx;
    const entity = await strapi.service("api::station.station").find(query);
    const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
    var _data = sanitizedEntity.results.map((value) => {
      return value;
    });

    return { data: _data, pagination: sanitizedEntity.pagination };
  },

  //get Details
  async findOne(ctx) {
    const { id } = ctx.params;
    const { query } = ctx;

    const entity = await strapi
      .service("api::station.station")
      .findOne(id, query);
    const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
    var _re = this.transformResponse(sanitizedEntity);
    return { data: sanitizedEntity, meta: _re?.meta };
  },
}));
