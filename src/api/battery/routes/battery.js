"use strict";

/**
 * battery router
 */

module.exports = {
  routes: [
    {
      method: "GET",
      path: "/battery/list",
      handler: "battery.getBatteryList",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "POST",
      path: "/battery",
      handler: "battery.postBatteryDetail",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "DELETE",
      path: "/battery/:id",
      handler: "battery.deleteBattery",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "GET",
      path: "/battery/:id",
      handler: "battery.getBatteryDetail",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "PUT",
      path: "/battery/:id",
      handler: "battery.putBatteryDetail",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
