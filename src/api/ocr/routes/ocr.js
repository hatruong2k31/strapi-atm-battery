module.exports = {
  routes: [
    {
      method: "GET",
      path: "/ocr/list",
      handler: "ocr.getList",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "GET",
      path: "/ocr/:id",
      handler: "ocr.getDetail",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "POST",
      path: "/ocr/card_id",
      handler: "ocr.checkCardId",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "POST",
      path: "/ocr",
      handler: "ocr.postDetail",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "DELETE",
      path: "/ocr/:id",
      handler: "ocr.delDetail",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
