'use strict';

/**
 * `view-permisson` middleware
 */

module.exports = (config, { strapi }) => {
  // Add your own logic here.
  return async (ctx, next) => {
    strapi.log.info('In view-permisson middleware.');

    await next();
  };
};
