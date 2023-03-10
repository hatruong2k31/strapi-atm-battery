"use strict";

/**
 * users service
 */

let getUserList = async (pagination, filter, sort, field, ctx) => {
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
      .from("users_list")
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

let getUserByCardId = async (card_id, ctx) => {
  try {
    let result = await strapi.db.connection
      .withSchema(process.env.DATABASE_SCHEMA)
      .select(
        "id",
        "username",
        "email",
        "phone",
        "identity_card",
        "card_id",
        "balance"
      )
      .from("users_list")
      .where("card_id", card_id);
    return strapi.config.function.resultCreate(200, result[0]);
  } catch (error) {
    return strapi.config.function.resultCreate(404, error.message || error);
  }
};

let getUserById = async (id, ctx) => {
  try {
    let result = await strapi.db.connection
      .withSchema(process.env.DATABASE_SCHEMA)
      .select("*")
      .from("users_list")
      .where("id", id);
    return strapi.config.function.resultCreate(200, result[0]);
  } catch (error) {
    return strapi.config.function.resultCreate(404, error.message || error);
  }
};

let postUserDetail = async (data, ctx) => {
  try {
    let userEmail = await strapi
      .query("plugin::users-permissions.user")
      .findOne({ where: { email: data.email } });

    let userPhone = await strapi
      .query("plugin::users-permissions.user")
      .findOne({ where: { phone: data.phone } });

    let userCardId = await strapi
      .query("plugin::users-permissions.user")
      .findOne({ where: { card_id: data.card_id } });

    if (userEmail || userPhone || userCardId) {
      if (userEmail) {
        throw strapi.customLang.__("email_already_existed");
      }
      if (userPhone) {
        throw strapi.customLang.__("phone_already_existed");
      }
      if (userCardId) {
        throw strapi.customLang.__("card_id_already_existed");
      }
    } else {
      data.password = strapi.config.function.hashPassword(data.password);
      data.confirmed = 1;
      data.provider = "local";
      data.created_by_id = ctx.state.user.id;
      data.created_at = new Date().toISOString().toLocaleString("en-US", {
        timeZone: "Asia/Ho_Chi_Minh",
      });

      data.updated_by_id = ctx.state.user.id;
      data.updated_at = data.created_at;
      let user = await strapi
        .query("plugin::users-permissions.user")
        .create({ data: data });

      if (user) {
        return strapi.config.function.resultCreate(200, user);
      } else {
        throw strapi.customLang.__("user_create_failed");
      }
    }
  } catch (error) {
    return strapi.config.function.resultCreate(404, error.message || error);
  }
};

let putUserDetail = async (id, data, ctx) => {
  try {
    let knex = strapi.db.connection;

    let checkemail = await knex
      .withSchema(process.env.DATABASE_SCHEMA)
      .from("up_users")
      .where({ email: data.email })
      .andWhereNot({ email: null })
      .andWhereNot({ id: id })
      .andWhereNot({ is_delete: 1 });
    if (checkemail.length > 0 && checkemail[0].provider == "local") {
      throw strapi.customLang.__("duplicate_field", "Email");
    }

    let checkphone = await knex
      .withSchema(process.env.DATABASE_SCHEMA)
      .from("up_users")
      .where({ phone: data.phone })
      .andWhereNot({ phone: null })
      .andWhereNot({ id: id })
      .andWhereNot({ is_delete: 1 });

    if (checkphone.length > 0) {
      throw strapi.customLang.__("duplicate_field", "Phone");
    }

    let checkcardid = await knex
      .withSchema(process.env.DATABASE_SCHEMA)
      .from("up_users")
      .where({ card_id: data.card_id })
      .andWhereNot({ card_id: null })
      .andWhereNot({ id: id })
      .andWhereNot({ is_delete: 1 });

    if (checkcardid.length > 0) {
      throw strapi.customLang.__("duplicate_field", "Card Id");
    }

    data.updated_by_id = ctx.state?.user?.id || data?.updated_by_id || null;
    data.updated_at = new Date().toISOString().toLocaleString("en-US", {
      timeZone: "Asia/Ho_Chi_Minh",
    });

    let result = await strapi.query("plugin::users-permissions.user").update({
      data: data,
      where: { id: id },
    });

    return strapi.config.function.resultCreate(200, result);
  } catch (error) {
    return strapi.config.function.resultCreate(404, error.message || error);
  }
};

let deleteUser = async (id, ctx) => {
  try {
    let knex = strapi.db.connection;

    let checkUser = await knex
      .withSchema(process.env.DATABASE_SCHEMA)
      .from("up_users")
      .where({ id: id, is_delete: 1 });

    if (checkUser.length > 0) {
      throw strapi.customLang.__("already_deleted", "User");
    }

    let result = await knex("up_users")
      .withSchema(process.env.DATABASE_SCHEMA)
      .where("id", id)
      .update(
        {
          is_delete: 1,
          updated_by_id: ctx.state.user.id,
        },
        ["id"]
      );

    return strapi.config.function.resultCreate(200, result);
  } catch (error) {
    return strapi.config.function.resultCreate(404, error.message || error);
  }
};

let getUserByEmail = async (email, ctx) => {
  try {
    let result = await strapi.db.connection
      .withSchema(process.env.DATABASE_SCHEMA)
      .select("*")
      .from("users_list")
      .where("email", email);
    return strapi.config.function.resultCreate(200, result[0]);
  } catch (error) {
    return strapi.config.function.resultCreate(404, error.message || error);
  }
};

module.exports = {
  getUserByCardId,
  getUserList,
  getUserById,
  postUserDetail,
  putUserDetail,
  deleteUser,
  getUserByEmail,
};
