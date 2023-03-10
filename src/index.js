"use strict";

const admin = require("firebase-admin");
const serviceAccount = require(process.env.GOOGLE_APPLICATION_CREDENTIALS);
const path = require("path");
const { I18n } = require("i18n");
const i18n = new I18n({
  locales: ["en", "vi"],
  directory: path.join(path.join(__dirname, ".."), "/config/locales"),
});
const { attachPaginate } = require("./function_custom/paginate");

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap(/*{ strapi }*/) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    strapi.firebase = admin;
    strapi.customLang = i18n;
    strapi.excludedColumns = [
      "id",
      "created_at",
      "updated_at",
      "published_at",
      "created_by_id",
      "updated_by_id",
    ];

    attachPaginate();
  },
};
