"use strict";

/**
 * station router
 */

module.exports = {
  routes: [
    {
      method: "GET",
      path: "/station/list",
      handler: "api::station.station.find",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "POST",
      path: "/station",
      handler: "api::station.station.create",
      config: {
        policies: ["valid-data"],
        middlewares: [],
      },
    },
    {
      method: "DELETE",
      path: "/station/:id",
      handler: "api::station.station.delete",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "GET",
      path: "/station/:id",
      handler: "api::station.station.findOne",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "PUT",
      path: "/station/:id",
      handler: "api::station.station.update",
      config: {
        policies: ["valid-data"],
        middlewares: [],
      },
    },
  ],
};
