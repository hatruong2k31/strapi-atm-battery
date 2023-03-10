module.exports = {
  routes: [
    {
      method: "GET",
      path: "/user/list",
      handler: "users.getUserList",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "GET",
      path: "/user/:id",
      handler: "users.getUserById",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "POST",
      path: "/user/check-email",
      handler: "users.checkEmail",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "POST",
      path: "/users/card-id",
      handler: "users.getUserByCardId",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "POST",
      path: "/user",
      handler: "users.postUserDetail",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "PUT",
      path: "/user/:id",
      handler: "users.putUserDetail",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "DELETE",
      path: "/user/:id",
      handler: "users.deleteUser",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
