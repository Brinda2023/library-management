const bcrypt = require("bcrypt");
module.exports = {
  friendlyName: "Encrypt",

  description: "Encrypt password.",

  inputs: {
    password: {
      type: "string",
      required: true,
    },
  },

  exits: {
    success: {
      description: "All done.",
    },
  },

  fn: async function (inputs, exits) {
    try {
      const salt = 10;
      const hashedPassword = bcrypt.hashSync(inputs.password, salt);
      return exits.success(hashedPassword);
    } catch (error) {
      sails.log.error(error);
      return exits.success();
    }
  },
};
