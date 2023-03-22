/**
 * AuthController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
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
      const admin = await Admin.findOne({
        email,
        isActive: true,
      });

      if (!admin) {
        return res.badRequest("user.auth.creds.invalid");
      }

      // check the passwords are matching or not
      const isPasswordMatch = await sails.helpers.password.compare(
        password,
        admin.password
      );
      if (!isPasswordMatch) {
        sails.log.info("Invalid password");
        return res.badRequest("user.auth.creds.invalid");
      }

      // if all the details are valid, generate jwt token with the required details, set the token in the database
      const token = await sails.helpers.jwt.generate({
        id: admin.id,
      });
      await Admin.updateOne({
        id: admin.id,
      }).set({
        token: token,
      });

      // return the response with user details
      delete admin.password;
      return res.ok({
        ...admin,
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

      await Admin.updateOne({ id: req.me.id }).set({
        token: "",
      });

      return res.ok("Admin logout successfully!");
    } catch (error) {
      sails.log.error(error);
      return res.serverError();
    }
  },
};
