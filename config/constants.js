/**
 * Project-wide Constants
 *
 * This is a custom configuration file that we use at Zignuts, for managing all the project-wide constants,
 * settings, using singleton objects or any other things that you would like to define once and use
 * several times in the project.
 * The sails framework by-default provides this feature in the custom.js file but we prefer to use
 * constants.js for more meaningful naming and to make it separate from custom.js.
 *
 * You define all the project-wide constants and export them at the end of the file in the module.exports
 */

// Initializing the dotenv. This will add all the values specified in the .env file into the ENVIRONMENT VARIABLES
require("dotenv").config();

/**
 * Define all the required libraries that needs to be used in the project. This ensures that only one object is
 * initialised in the project and exported so that its reference is used throughout the project.
 * Make sure that only those packages whose reference is needed ONLY ONCE are initialised below.
 * In case separate objects/references are needed, then those libraries can be required in their respective files.
 */
const JWT = require("jsonwebtoken");
const uuid = require("uuid-random");

/**
 * Setting the token expiry to 30 days and issuer to zignuts.com.
 * Change the settings as per the project needs.
 */
const JWT_OPTS = {
  expiresIn: "30d",
  issuer: "https://www.zignuts.com",
};
/**
 * Data Validations: Following block of code is for having data validations and rules for each model/entity.
 * We are using validatorjs and its respective rules for data validation ideally as the first steps in the controller code.
 * This ensures that only the valid data is processed in the subsequent logic and there are less chances of processing invalid data
 * at the database layer.
 * Ensure to define all the validation rules for ALL models/entities.
 */
const Validator = require("validatorjs");
Validator.register(
  "strong-password",
  (value) => {
    // requirement parameter defaults to null
    return value.match(
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/
    );
  },
  "The password must be minimum of 8 in length and must have 1 capital letters, 1 small letters, 1 number and 1 special character. "
);
const ValidationRules = {
  user: {
    firstName: "string|required|max:128",
    lastName: "string|required|max:128",
    username: "string|required|max:64",
    email: "email|required|max:128",
    // password: [
    // 	'required',
    // 	'regex:/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/',
    // ],
    password: "required|strong-password",
    authToken: "string|max:255",
  },
  admin: {
    firstName: "string|required|max:128",
    lastName: "string|required|max:128",
    email: "email|required|max:128",
    password: [
      "required",
      "regex:/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/",
    ],
    authToken: "string|max:255",
  },
  book: {
    name: "string|required|max:1028",
    price: "string|required|max:128",
    publishYear: "string|required|max:128",
    thumb: "string|max:1028",
  },
};

/**
 * All the constants exported, to be used in other files, controllers, helpers, policies etc, as
 * sails.config.constants.<name>, for example sails.config.constants.JWT.
 */
module.exports.constants = {
  JWT,
  JWT_OPTS,
  uuid,
  Validator,
  ValidationRules,
};
