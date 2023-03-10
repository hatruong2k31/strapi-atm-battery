const bcrypt = require("bcryptjs");

/**
 *
 * @param {int} userId User Id
 * @returns User data with Org data
 */
// let getUserSchema = async (userId) => {
//   try {
//     let knex = strapi.db.connection;
//     let re = await knex("hust2.up_users").where("id", userId).select("*");
//     return re;
//   } catch (error) {
//     return error;
//   }
// };

let resultCreate = (status, details) => {
  return {
    status: status,
    details: details,
  };
};

let returnResult = (data) => {
  return { data: data };
};

let throwError = (status, message, details) => {
  return {
    data: null,
    error: {
      status: status,
      message: message,
      details: details,
    },
  };
};

/**
 *
 * @param {string} password raw password string without encrypted
 * @param {int} salt salt
 * @returns password string encrypted
 */
let hashPassword = (password) => {
  // var salt = bcrypt.genSaltSync(10)
  return bcrypt.hashSync(password, 10);
};

module.exports = {
  // getUserSchema,
  returnResult,
  throwError,
  resultCreate,
  hashPassword,
};
