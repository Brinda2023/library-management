const { JWT, JWT_OPTS } = sails.config.constants;

module.exports = {
  friendlyName: "Verify",

  description: "Verify jwt.",

  inputs: {
    token: {
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
      // verify the token
      const decodedToken = JWT.verify(
        inputs.token,
        process.env.JWT_SECRET,
        JWT_OPTS
      );
      // check the issuer
      return exits.success(decodedToken);
    } catch (err) {
      sails.log.error(err);
      return exits.success();
    }
  },
};
