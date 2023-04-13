"use strict";

/**
 * station service
 */

let getStationList = async (pagination, filter, sort, field, ctx) => {
  try {
    let knex = strapi.db.connection;
    let limit = pagination.pageSize || process.env.DATA_PER_PAGE;
    let page = pagination.page;
    let isPage = pagination.isPage || true;
    let isGetTotal = pagination.isGetTotal || false;
    let offset = limit * page - limit;

    let result = await knex
      .select()
      .column(field)
      .withSchema(process.env.DATABASE_SCHEMA)
      .from("stations")
      .where((builder) => {
        Object.keys(filter).forEach((key) => {
          if (typeof filter[key] === "object") {
            Object.keys(filter[key]).forEach((k) => {
              switch (k) {
                case "$eq":
                  builder.andWhere(key, filter[key][k]);
                  break;
                case "$ne":
                  builder.andWhereNot(key, filter[key][k]);
                  break;
                case "$lt":
                  builder.andWhere(key, "<", filter[key][k]);
                  break;
                case "$lte":
                  builder.andWhere(key, "<=", filter[key][k]);
                  break;
                case "$gt":
                  builder.andWhere(key, ">", filter[key][k]);
                  break;
                case "$gte":
                  builder.andWhere(key, ">=", filter[key][k]);
                  break;
                case "$contains":
                  builder.andWhere(key, "ilike", `%${filter[key][k]}%`);
                  break;
                case "$notContains":
                  builder.andWhere(key, "not ilike", `%${filter[key][k]}%`);
                  break;
                default:
                  break;
              }
            });
          } else {
            builder.andWhereILike(key, `%${filter[key]}%`);
          }
        });
      })
      .orderBy(sort)
      .paginate({
        page: page,
        limit: limit,
        offset: offset,
        isPage: isPage,
        isGetTotal: isGetTotal,
      });

    return strapi.config.function.resultCreate(200, result);
  } catch (error) {
    return strapi.config.function.resultCreate(404, error.message || error);
  }
};

let getStationDetail = async (id, ctx) => {
  console.log(id);
  try {
    let result = await strapi.db.connection
      .withSchema(process.env.DATABASE_SCHEMA)
      .select("*")
      .from("stations")
      .where("id", id);
    return strapi.config.function.resultCreate(200, result[0]);
  } catch (error) {
    return strapi.config.function.resultCreate(404, error.message || error);
  }
};

let postStationDetail = async (data, ctx) => {
  try {
    let stationName = await strapi
      .query("api::station.station")
      .findOne({ where: { name: data.name } });
    if (stationName) {
      throw strapi.customLang.__("already_existed", "Name");
    }
    data.created_by_id = ctx.state?.user?.id;
    data.created_at = new Date().toISOString().toLocaleString("en-US", {
      timeZone: "Asia/Ho_Chi_Minh",
    });

    data.updated_by_id = data.created_by_id;
    data.updated_at = data.created_at;

    let station = await strapi
      .query("api::station.station")
      .create({ data: data });

    if (station) {
      return strapi.config.function.resultCreate(200, station);
    } else {
      throw strapi.customLang.__("create_failed", "Station");
    }
  } catch (error) {
    return strapi.config.function.resultCreate(404, error.message || error);
  }
};

let putStationDetail = async (id, data, ctx) => {
  try {
    let knex = strapi.db.connection;

    let checkname = await knex
      .withSchema(process.env.DATABASE_SCHEMA)
      .from("stations")
      .where({ name: data.name })
      .andWhereNot({ name: null })
      .andWhereNot({ id: id })
      .andWhereNot({ is_delete: 1 });
    if (checkname.length > 0) {
      throw strapi.customLang.__("duplicate_field", "Name");
    }

    data.updated_by_id = ctx.state.user.id;
    data.updated_at = new Date().toISOString().toLocaleString("en-US", {
      timeZone: "Asia/Ho_Chi_Minh",
    });
    let result = await strapi.query("api::station.station").update({
      data: data,
      where: { id: id },
    });
    return strapi.config.function.resultCreate(200, result);
  } catch (error) {
    return strapi.config.function.resultCreate(404, error.message || error);
  }
};

let deleteStation = async (id, ctx) => {
  try {
    let knex = strapi.db.connection;

    let checkStation = await knex
      .withSchema(process.env.DATABASE_SCHEMA)
      .from("stations")
      .where({ id: id, is_delete: 1 });

    if (checkStation.length > 0) {
      throw strapi.customLang.__("already_deleted", "Station");
    }

    let result = await knex("stations")
      .withSchema(process.env.DATABASE_SCHEMA)
      .where("id", id)
      .update(
        {
          is_delete: 1,
          updated_by_id: ctx.state.user.id,
          updated_at: new Date(),
        },
        ["id"]
      );

    return strapi.config.function.resultCreate(200, result);
  } catch (error) {
    return strapi.config.function.resultCreate(404, error.message || error);
  }
};

module.exports = {
  getStationList,
  getStationDetail,
  postStationDetail,
  putStationDetail,
  deleteStation,
};
