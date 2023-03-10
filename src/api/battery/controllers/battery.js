"use strict";

/**
 * battery controller
 * @param {object} ctx
 * @param {*} next
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::battery.battery", ({ strapi }) => ({
  // get List
  async find(ctx) {
    const { query } = ctx;
    const entity = await strapi.service("api::battery.battery").find(query);
    const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
    var _data = sanitizedEntity.results.map((value) => {
      //some logic
      return value;
    });

    return { data: _data, pagination: sanitizedEntity.pagination };
  },

  //get Details
  async findOne(ctx) {
    const { id } = ctx.params;
    const { query } = ctx;

    const entity = await strapi
      .service("api::battery.battery")
      .findOne(id, query);
    const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
    console.log(sanitizedEntity);
    var _re = this.transformResponse(sanitizedEntity);
    return { data: sanitizedEntity, meta: _re?.meta };
  },
}));
