"use strict";

/**
 * payment router
 */

module.exports = {
  routes: [
    {
      method: "GET",
      path: "/payment/list",
      handler: "payment.getPaymentList",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "GET",
      path: "/payment/:id",
      handler: "payment.getPaymentDetail",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "POST",
      path: "/payment",
      handler: "payment.postPaymentDetail",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "PUT",
      path: "/payment/:id",
      handler: "payment.putPaymentDetail",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "DELETE",
      path: "/payment/:id",
      handler: "payment.delPaymentDetail",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
