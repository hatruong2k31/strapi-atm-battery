"use strict";

/**
 * station router
 */

module.exports = {
  routes: [
    {
      method: "GET",
      path: "/station/list",
      handler: "station.getStationList",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "POST",
      path: "/station",
      handler: "station.postStationDetail",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "DELETE",
      path: "/station/:id",
      handler: "station.deleteStation",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "GET",
      path: "/station/:id",
      handler: "station.getStationDetail",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "PUT",
      path: "/station/:id",
      handler: "station.putStationDetail",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
