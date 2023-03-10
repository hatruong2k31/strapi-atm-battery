'use strict';

/**
 * `valid-data` policy
 */

module.exports = (policyContext, config, { strapi }) => {
    // Add your own logic here.
    strapi.log.info('In valid-data policy.');

    const canDoSomething = true;

    if (canDoSomething) {
      return true;
    }

    return false;
};
