/**
 * AuthorController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  /**
   * @method create
   * @description This method creates a new author
   * @param {Request} req HTTP Request
   * @param {Response} res HTTP Response
   */
  create: async (req, res) => {
    try {
      // get the author name from body
      const { name } = req.body;
      // validate data
      if (!name) {
        return res.badRequest("author.required.input");
      }

      // creating the author in the database
      const author = await Author.create({
        id: sails.config.constants.uuid(),
        name,
      }).fetch();

      return res.ok({ author });
    } catch (error) {
      sails.log.error(error);
      return res.serverError(error);
    }
  },
  /**
   * @method update
   * @description This method updates the author
   * @param {Request} req HTTP Request
   * @param {Response} res HTTP Response
   */
  update: async (req, res) => {
    try {
      // get the author name from body
      const { name } = req.body;
      // get the author ID from the params
      const { id } = req.params;
      // validate data
      if (!name) {
        return res.badRequest("author.required.input");
      }
      if (!id) {
        return res.badRequest("author.required.id");
      }

      // updating the author in the database
      let updatedAuthor = await Author.updateOne({
        id,
      }).set({
        name,
      });

      // if there is no updatedAuthor, means the given author ID was invalid and no record with that ID is found in the database
      if (!updatedAuthor) {
        return res.notFound();
      }

      return res.ok({ updatedAuthor });
    } catch (error) {
      sails.log.error(error);
      return res.serverError(error);
    }
  },
  /**
   * @method delete
   * @description This method deletes the author
   * @param {Request} req HTTP Request
   * @param {Response} res HTTP Response
   */
  delete: async (req, res) => {
    try {
      // get the author ID from the params
      const { id } = req.params;
      // validate data
      if (!id) {
        return res.badRequest("author.required.id");
      }

      // check if author exists in the database with given ID
      let author = await Author.findOne({ id });
      if (id !== author.id) {
        return res.notFound();
      }

      // deleting the author in the database.
      await Author.destroy({ id });

      return res.ok("Author deleted successfully!");
    } catch (error) {
      sails.log.error(error);
      return res.serverError(error);
    }
  },
  /**
   * @method get
   * @description This method get all the authors
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
      let authors;
      if (name) {
        authors = await Author.find({
          where: { name: { contains: name } },
          limit: limit,
          skip: skipIndex,
        }).populate("books");
      } else {
        authors = await Author.find({
          limit: limit,
          skip: skipIndex,
        }).populate("books");
      }
      return res.ok(authors);
    } catch (error) {
      sails.log.error(error);
      return res.serverError(error);
    }
  },
};
