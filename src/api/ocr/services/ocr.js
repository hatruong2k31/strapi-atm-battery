"use strict";

let getList = async (pagination, filter, sort, field, ctx) => {
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
      .withSchema("b2c")
      .from("g_contact")
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

let getDetail = async (id, ctx) => {
  try {
    let result = await strapi.db.connection
      .withSchema("b2c")
      .select("*")
      .from("g_contact")
      .where("id", id);
    return strapi.config.function.resultCreate(200, result[0]);
  } catch (error) {
    return strapi.config.function.resultCreate(404, error.message || error);
  }
};

let postDetail = async (data, ctx) => {
  try {
    let knex = strapi.db.connection;

    let ContactCardId = await knex
      .withSchema("b2c")
      .select("*")
      .from("g_contact")
      .where("identity_card", data.identity_card)
      .where("is_delete", 0);

    if (ContactCardId.length > 0) {
      throw strapi.customLang.__("already_existed", "Contact");
    }

    data.dob = new Date(data.dob);
    let create_contact = await knex("b2c.g_contact").insert(data);

    if (create_contact) {
      return strapi.config.function.resultCreate(200, create_contact);
    } else {
      throw strapi.customLang.__("create_failed", "Contact");
    }
  } catch (error) {
    return strapi.config.function.resultCreate(404, error.message || error);
  }
};

let delDetail = async (id, ctx) => {
  try {
    let knex = strapi.db.connection;

    let g_contact_data = await knex
      .withSchema("b2c")
      .from("g_contact")
      .where({ id: id, is_delete: 1 });

    if (g_contact_data.length > 0) {
      throw strapi.customLang.__("already_deleted", "Contact");
    }

    let result = await knex("b2c.g_contact").where("id", id).update(
      {
        is_delete: 1,
      },
      ["id"]
    );

    return strapi.config.function.resultCreate(200, result);
  } catch (error) {
    return strapi.config.function.resultCreate(404, error.message || error);
  }
};

let getDetailByCardId = async (identity_card, ctx) => {
  try {
    let result = await strapi.db.connection
      .withSchema("b2c")
      .select("*")
      .from("g_contact")
      .where("identity_card", identity_card)
      .where("is_delete", 0);

    if (!result.length) {
      return strapi.config.function.resultCreate(400, result);
    }
    return strapi.config.function.resultCreate(200, result[0]);
  } catch (error) {
    return strapi.config.function.resultCreate(404, error.message || error);
  }
};

module.exports = {
  getList,
  getDetail,
  postDetail,
  delDetail,
  getDetailByCardId,
};
