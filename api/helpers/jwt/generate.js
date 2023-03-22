const { JWT, JWT_OPTS } = sails.config.constants;

module.exports = {
  friendlyName: "Generate",

  description: "Generate jwt.",

  inputs: {
    payload: {
      type: "json",
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
      const token = JWT.sign(inputs.payload, process.env.JWT_SECRET, JWT_OPTS);
      return exits.success(token);
    } catch (error) {
      sails.log.error(error);
      return exits.success();
    }
  },
};
