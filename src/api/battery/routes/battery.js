"use strict";

/**
 * battery router
 */

module.exports = {
  routes: [
    {
      method: "GET",
      path: "/battery/list",
      handler: "api::battery.battery.find",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "POST",
      path: "/battery",
      handler: "api::battery.battery.create",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "DELETE",
      path: "/battery/:id",
      handler: "api::battery.battery.delete",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "GET",
      path: "/battery/:id",
      handler: "api::battery.battery.findOne",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "PUT",
      path: "/battery/:id",
      handler: "api::battery.battery.update",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "GET",
      path: "/battery/:id",
      handler: "api::battery.battery.findOne",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
