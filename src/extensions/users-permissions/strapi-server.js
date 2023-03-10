"use strict";

module.exports = (plugin) => {
  plugin.controllers.auth["refreshToken"] = async (ctx) => {
    try {
      const { token } = ctx.request.body;
      const payload = await strapi.plugins[
        "users-permissions"
      ].services.jwt.verify(token);

      const refreshToken = await strapi.plugins[
        "users-permissions"
      ].services.jwt.issue({
        id: payload.id,
      });

      return { jwt: refreshToken };
    } catch (error) {
      return ctx.badRequest(error.toString());
    }
  };

  plugin.controllers.auth["verifyToken"] = async (ctx) => {
    try {
      const { token } = ctx.request.body;
      const payload = await strapi.plugins[
        "users-permissions"
      ].services.jwt.verify(token);

      return strapi.config.function.resultCreate(200, payload);
    } catch (error) {
      return ctx.badRequest(error.toString());
    }
  };

  plugin.routes["content-api"].routes.push({
    method: "POST",
    path: "/auth/refreshToken",
    handler: "auth.refreshToken",
    config: {
      prefix: "",
    },
  });

  plugin.routes["content-api"].routes.push({
    method: "POST",
    path: "/auth/verifyToken",
    handler: "auth.verifyToken",
    config: {
      prefix: "",
    },
  });

  return plugin;
};
