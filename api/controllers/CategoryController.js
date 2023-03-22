/**
 * CategoryController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  /**
   * @method create
   * @description This method creates a new category
   * @param {Request} req HTTP Request
   * @param {Response} res HTTP Response
   */
  create: async (req, res) => {
    try {
      // get the category name from body
      const { name } = req.body;
      // validate data
      if (!name) {
        return res.badRequest("category.required.input");
      }

      // creating the category in the database
      const category = await Category.create({
        id: sails.config.constants.uuid(),
        name,
      }).fetch();
      console.log(category);

      return res.ok(category);
    } catch (error) {
      sails.log.error(error);
      return res.serverError(error);
    }
  },
  /**
   * @method update
   * @description This method updates the category
   * @param {Request} req HTTP Request
   * @param {Response} res HTTP Response
   */
  update: async (req, res) => {
    try {
      // get the category name from body
      const { name } = req.body;
      // get the category ID from the params
      const { id } = req.params;
      // validate data
      if (!name) {
        return res.badRequest("category.required.input");
      }
      if (!id) {
        return res.badRequest("category.required.id");
      }

      // updating the category in the database
      let updatedCategory = await Category.updateOne({
        id,
      }).set({
        name,
      });

      // if there is no updatedCategory, means the given category ID was invalid and no record with that ID is found in the database
      if (!updatedCategory) {
        return res.notFound();
      }

      return res.ok({updatedCategory});
    } catch (error) {
      sails.log.error(error);
      return res.serverError(error);
    }
  },
  /**
   * @method delete
   * @description This method deletes the category
   * @param {Request} req HTTP Request
   * @param {Response} res HTTP Response
   */
  delete: async (req, res) => {
    try {
      // get the category ID from the params
      const { id } = req.params;
      // validate data
      if (!id) {
        return res.badRequest("category.required.id");
      }

      // check if category exists in the database with given ID
      let category = await Category.findOne({ id });
      if (id !== category.id) {
        return res.notFound();
      }

      // deleting the category in the database.
      await Category.destroy({ id });

      return res.ok("Category deleted successfully!");
    } catch (error) {
      sails.log.error(error);
      return res.serverError(error);
    }
  },
  /**
   * @method get
   * @description This method get all the categories
   * @param {Request} req HTTP Request
   * @param {Response} res HTTP Response
   */
  get: async (req, res) => {
    try {
      // get list of query params
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const skipIndex = (page - 1) * limit;

      // get the search data from qyery
      const { name } = req.query;
      let categories;
      if (name) {
        categories = await Category.find({
          limit: limit,
          skip: skipIndex,
          name,
        }).populate("books");
      } else {
        categories = await Category.find({
          limit: limit,
          skip: skipIndex,
        }).populate("books");
      }

      return res.ok({ categories });
    } catch (error) {
      sails.log.error(error);
      return res.serverError(error);
    }
  },
};
