/**
 * History.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    book: {
      model: "book",
    },
    issuedTo: {
      model: "user",
    },
    issuedAt: {
      type: "string",
    },
    returnedAt: {
      type: "string",
    },
  },
};
