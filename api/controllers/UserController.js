/**
 * AuthController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  /**
   * @name register
   * @description This method is used to register a new user with required details
   * @param {Request} req The incoming HTTP request
   * @param {Response} res The outgoing HTTP response
   */
  register: async (req, res) => {
    try {
      // Get the data fields from body
      const { firstName, lastName, email, password, username } = req.body;

      // Validate the data
      const validate = User.validateBeforeRegister({
        firstName,
        lastName,
        email,
        password,
        username,
      });
      // sails.log.info(validate);
      if (validate.hasError) {
        return res.badRequest("", validate.errors);
      }

      // Check if the user with given email already exists
      const existingUserEmail = await User.findOne({ email, isActive: true });
      if (existingUserEmail) {
        return res.badRequest("user.auth.email.exists");
      }

      // Check if the user with given username already exists
      const existingUsername = await User.findOne({
        username,
        isActive: true,
      });
      if (existingUsername) {
        return res.badRequest("user.auth.username.exists");
      }

      // Encrypting the plain text password
      const hashedPassword = await sails.helpers.password.encrypt(password);
      // Register a new user
      await User.create({
        id: sails.config.constants.uuid(),
        firstName,
        lastName,
        username,
        email,
        password: hashedPassword,
      });
      // Check if email verification is required then send the verification code/link to email
      // Return Response
      return res.ok("User registered successfully!");
    } catch (error) {
      sails.log.error(error);
      return res.serverError("user registration failed due to some error");
    }
  },

  /**
   * @method login
   * @description This method is used to login the users
   * @param {Request} req HTTP Request
   * @param {Response} res HTTP Response
   */
  login: async (req, res) => {
    try {
      // get the data fields from body
      const { email, password } = req.body;

      // validate the data
      if (!email || !password) {
        return res.badRequest("user.auth.creds.required");
      }

      // check if the user with given email exists in the system, should be active and not deleted
      const user = await User.findOne({
        email,
        isActive: true,
      });

      if (!user) {
        return res.badRequest("user.auth.creds.invalid");
      }

      // check the passwords are matching or not
      const isPasswordMatch = await sails.helpers.password.compare(
        password,
        user.password
      );
      if (!isPasswordMatch) {
        sails.log.info("Invalid password");
        return res.badRequest("user.auth.creds.invalid");
      }

      // if all the details are valid, generate jwt token with the required details, set the token in the database
      const token = await sails.helpers.jwt.generate({
        id: user.id,
      });
      await User.updateOne({
        id: user.id,
      }).set({
        token: token,
      });

      // return the response with user details
      delete user.password;
      return res.ok({
        ...user,
        token: token,
      });
    } catch (error) {
      sails.log.error(error);
      return res.serverError();
    }
  },

  /**
   * @method logout
   * @description This method is used to logout the users, clear the authentication tokens
   * @param {Request} req HTTP Request
   * @param {Response} res HTTP Response
   */
  logout: async (req, res) => {
    try {
      // check if the request has the required user id to log out
      if (!req.me.id) {
        return res.badRequest("user.auth.logout.nouser");
      }

      await User.updateOne({ id: req.me.id }).set({
        token: "",
      });

      return res.ok("User logout successfully!");
    } catch (error) {
      sails.log.error(error);
      return res.serverError();
    }
  },
};
