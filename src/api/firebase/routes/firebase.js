module.exports = {
  routes: [
    {
      method: "POST",
      path: "/auth/firebase",
      handler: "firebase.auth",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
