const bcrypt = require("bcrypt");
module.exports = {
  friendlyName: "Compare",

  description: "Compare password.",

  inputs: {
    plainTextPassword: {
      type: "string",
      required: true,
    },
    hashedPassword: {
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
      return exits.success(
        bcrypt.compareSync(inputs.plainTextPassword, inputs.hashedPassword)
      );
    } catch (error) {
      sails.log.error(error);
      return exits.success();
    }
  },
};
