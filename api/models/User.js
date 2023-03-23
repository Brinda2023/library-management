/**
 * User.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    firstName: {
      type: "string",
      required: true,
      unique: true,
    },
    lastName: {
      type: "string",
      required: true,
      unique: true,
    },
    username: {
      type: "string",
      required: true,
      unique: true,
    },
    email: {
      type: "string",
      required: true,
      unique: true,
      isEmail: true,
    },
    password: {
      type: "string",
      required: true,
    },
    token: {
      type: "string",
    },
    isActive: {
      type: "boolean",
      defaultsTo: true,
    },
    history:{
      collection: "history",
      via: "issuedTo",
    },
  },
  validateBeforeRegister: (data) => {
    const { Validator, ValidationRules } = sails.config.constants;
    const rules = ValidationRules.user;
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
