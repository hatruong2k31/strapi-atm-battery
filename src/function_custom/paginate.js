const Knex = require("knex");

module.exports.attachPaginate = function attachPaginate() {
  function paginate({
    page,
    limit,
    offset,
    isPage = true,
    isGetTotal = false,
  }) {
    let paginate = {};
    let countQuery = null;

    const postProcessResponse =
      typeof this.client.config.postProcessResponse === "function"
        ? this.client.config.postProcessResponse
        : function (key) {
            return key;
          };

    if (isPage === true) {
      countQuery = new this.constructor(this.client)
        .count("* as total")
        .from(this.clone().offset(0).clearOrder().as("count__query__"))
        .first()
        .debug(this._debug);

      // This will paginate the data itself
      this.offset(offset).limit(limit);

      return this.client.transaction(async (trx) => {
        const result = await this.transacting(trx);
        let totalResult = 0;

        const countResult = await countQuery.transacting(trx);
        totalResult = +(countResult.TOTAL || countResult.total);

        if (isGetTotal) {
          paginate = {
            totalResult,
          };
        }

        // Add pagination data to paginator object
        paginate = postProcessResponse({
          ...paginate,
          currentPage: parseInt(page),
          totalPage: Math.ceil((totalResult > 0 ? totalResult : 0) / limit),
        });

        return { data: result, paginate };
      });
    } else {
      return this.client.transaction(async (trx) => {
        const result = await this.transacting(trx);
        // Add pagination data to paginator object
        paginate = postProcessResponse({
          currentPage: 0,
          totalPage: 0,
        });

        return { data: result, paginate };
      });
    }
  }

  Knex.QueryBuilder.extend("paginate", paginate);
};
