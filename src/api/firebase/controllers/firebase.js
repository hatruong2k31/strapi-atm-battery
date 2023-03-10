"use strict";

let auth = async (ctx) => {
  try {
    const idToken = ctx.request.body.id_token;
    const decodedToken = await strapi.firebase.auth().verifyIdToken(idToken);
    if (decodedToken.email) {
      let jwt;

      let user = await strapi
        .query("plugin::users-permissions.user")
        .findOne({ where: { email: decodedToken.email } });
      // let knex = strapi.db.connection;
      // let user = await knex
      //   .withSchema(process.env.DATABASE_SCHEMA)
      //   .from("up_users")
      //   .where({ email: decodedToken.email });

      if (user) {
        //user = sanitizeOutput(user);

        jwt = strapi.plugins["users-permissions"].services.jwt.issue({
          id: user.id,
        });

        ctx.body = {
          jwt,
          user,
        };
      } else {
        return ctx.badRequest("Invalid User!", [
          { messages: [{ id: "Invalid User!" }] },
        ]);
      }
    } else {
      return ctx.badRequest("Invalid User!", [
        { messages: [{ id: "Invalid User!" }] },
      ]);
    }
  } catch (error) {
    return ctx.badRequest(null, error);
  }
};

module.exports = { auth };
