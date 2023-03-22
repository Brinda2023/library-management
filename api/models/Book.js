/**
 * Book.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    name: {
      type: "string",
      required: true,
      unique: true,
    },
    author: {
      model: "author",
    },
    price: {
      type: "string",
      required: true,
    },
    category: {
      model: "category",
    },
    publishYear: {
      type: "string",
      required: true,
    },
    thumb: {
      type: "string",
    },
    isAvailable: {
      type: "boolean",
      defaultsTo: true,
    },
  },
  validateBeforeCreate: (data) => {
    const { Validator, ValidationRules } = sails.config.constants;
    const rules = ValidationRules.book;
    let validation = new Validator(data, rules);

    if (validation.fails()) {
      return {
        hasError: true,
        errors: validation.errors.all(),
      };
    } else if (validation.passes()) {
      return {
        hasError: false,
      };
    }
  },
};
