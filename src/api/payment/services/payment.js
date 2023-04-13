"use strict";

/**
 * payment service
 */

let getList = async (pagination, filter, sort, field, ctx) => {
  try {
    let knex = strapi.db.connection;
    let limit = pagination.pageSize || process.env.DATA_PER_PAGE;
    let page = pagination.page;
    let isPage = pagination.isPage || true;
    let isGetTotal = pagination.isGetTotal || false;
    let offset = limit * page - limit;

    let result =
      ctx.state.user.id == 1
        ? await knex
            .select()
            .column(field)
            .withSchema(process.env.DATABASE_SCHEMA)
            .from("payment_list")
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
                        builder.andWhere(
                          key,
                          "not ilike",
                          `%${filter[key][k]}%`
                        );
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
            })
        : await knex
            .select()
            .column(field)
            .withSchema(process.env.DATABASE_SCHEMA)
            .from("payment_list")
            .where("user_id", ctx.state.user.id)
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
                        builder.andWhere(
                          key,
                          "not ilike",
                          `%${filter[key][k]}%`
                        );
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
      .withSchema(process.env.DATABASE_SCHEMA)
      .select("*")
      .from("payment_list")
      .where("id", id);
    return strapi.config.function.resultCreate(200, result[0]);
  } catch (error) {
    return strapi.config.function.resultCreate(404, error.message || error);
  }
};

let postDetail = async (data, ctx) => {
  try {
    data.created_by_id = ctx.state?.user?.id || data?.created_by_id || null;
    data.created_at = new Date().toISOString().toLocaleString("en-US", {
      timeZone: "Asia/Ho_Chi_Minh",
    });

    data.updated_by_id = data.created_by_id;
    data.updated_at = data.created_at;

    let payment = await strapi
      .query("api::payment.payment")
      .create({ data: data });

    if (payment) {
      return strapi.config.function.resultCreate(200, payment);
    } else {
      throw strapi.customLang.__("payment_create_failed");
    }
  } catch (error) {
    return strapi.config.function.resultCreate(404, error.message || error);
  }
};

let putDetail = async (id, data, ctx) => {
  try {
    data.updated_by_id = ctx.state.user.id;
    data.updated_at = new Date().toISOString().toLocaleString("en-US", {
      timeZone: "Asia/Ho_Chi_Minh",
    });
    let result = await strapi.query("api::payment.payment").update({
      data: data,
      where: { id: id },
    });
    return strapi.config.function.resultCreate(200, result);
  } catch (error) {
    return strapi.config.function.resultCreate(404, error.message || error);
  }
};

let delDetail = async (id, ctx) => {
  try {
    let knex = strapi.db.connection;

    let checkPayment = await knex
      .withSchema(process.env.DATABASE_SCHEMA)
      .from("payments")
      .where({ id: id, is_delete: 1 });

    if (checkPayment.length > 0) {
      throw strapi.customLang.__("already_deleted", "Payment");
    }

    let result = await knex("payments")
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

module.exports = { getList, getDetail, postDetail, putDetail, delDetail };
