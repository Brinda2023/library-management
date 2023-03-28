/**
 * BookController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  /**
   * @method create
   * @description This method creates a new book
   * @param {Request} req HTTP Request
   * @param {Response} res HTTP Response
   */
  create: async (req, res) => {
    try {
      // get the book data from body
      const { name, author, price, category, publishYear } = req.body;

      // Check if the book with given name already exists
      const existingBookName = await Book.findOne({ name });
      if (existingBookName) {
        return res.badRequest("book.name.exists");
      }
      // validate data
      const validate = Book.validateBeforeCreate({
        name,
        price,
        publishYear,
      });
      // sails.log.info(validate);
      if (validate.hasError) {
        return res.badRequest("", validate.errors);
      }
      if (!author || !category) {
        return res.badRequest("book.required.input");
      }

      // check if author exists in the database with given ID
      let existedAuthor = await Author.findOne({ name: author });
      if (author !== existedAuthor.name) {
        return res.notFound();
      }
      // check if category exists in the database with given ID
      let existedCategory = await Category.findOne({ name: category });
      if (category !== existedCategory.name) {
        return res.notFound();
      }

      // upload image TODO
      // let thumbFd;

      req.file("thumb").upload(
        {
          maxBytes: 10000000,
        },
        async (err, uploadedFiles) => {
          if (err) {
            return res.status(500)({
              message: sails.__(`pic.serverError`, { lang }),
              error: err,
            });
          } else {
            if (uploadedFiles.length > 0) {
              //     console.log(uploadedFiles);
              thumbFd = await uploadedFiles[0].fd;
              // creating the book in the database
              const book = await Book.create({
                id: sails.config.constants.uuid(),
                name,
                author: existedAuthor.id,
                price,
                category: existedCategory.id,
                publishYear,
                thumb: thumbFd,
              }).fetch();
              return res.ok(book);
            }
          }
        }
      );
    } catch (error) {
      sails.log.error(error);
      return res.serverError(error);
    }
  },
  /**
   * @method update
   * @description This method updates the book
   * @param {Request} req HTTP Request
   * @param {Response} res HTTP Response
   */
  update: async (req, res) => {
    try {
      // get the book data from body
      const { name, price, publishYear, thumb } = req.body;

      // get the book ID from the params
      const { id } = req.params;

      // validate data
      if (!id) {
        return res.badRequest("book.required.id");
      }

      // Create updatebody object
      let updateBody = {};

      if (name) {
        updateBody.name = name;
      }
      if (price) {
        updateBody.price = price;
      }
      if (publishYear) {
        updateBody.publishYear = publishYear;
      }
      if (thumb) {
        updateBody.thumb = thumb;
      }

      // updating the book in the database
      let updatedBook = await Book.updateOne({
        id,
      }).set(updateBody);

      // if there is no updatedBook, means the given book ID was invalid and no record with that ID is found in the database
      if (!updatedBook) {
        return res.notFound();
      }

      return res.ok({ updatedBook });
    } catch (error) {
      sails.log.error(error);
      return res.serverError(error);
    }
  },
  /**
   * @method delete
   * @description This method deletes the book
   * @param {Request} req HTTP Request
   * @param {Response} res HTTP Response
   */
  delete: async (req, res) => {
    try {
      // get the book ID from the params
      const { id } = req.params;
      // validate data
      if (!id) {
        return res.badRequest("book.required.id");
      }

      // check if book exists in the database with given ID
      let book = await Book.findOne({ id });
      if (id !== book.id) {
        return res.notFound();
      }

      // deleting the book in the database.
      await Book.destroy({ id });

      return res.ok("Book successfully deleted!");
    } catch (error) {
      sails.log.error(error);
      return res.serverError(error);
    }
  },
  /**
   * @method get
   * @description This method get all the books
   * @param {Request} req HTTP Request
   * @param {Response} res HTTP Response
   */
  get: async (req, res) => {
    try {
      // get list of query params
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const skipIndex = (page - 1) * limit;

      // get the filter data from query
      const { book, author, category } = req.query;

      // Define array of id
      let authorId = [];
      let categoryId = [];

      // Collect the ids of authors which contains query name
      if (author) {
        const authors = await Author.find({
          where: { name: { contains: author } },
        });
        authorId = authors.map((author) => {
          return author.id;
        });
      }

      // Collect the ids of categories which contains query name
      if (category) {
        const categories = await Category.find({
          where: { name: { contains: category } },
        });
        categoryId = categories.map((category) => {
          return category.id;
        });
      }

      // Make a search query
      let searchQuery = {
        or: [
          author ? { author: { in: authorId } } : {},
          category ? { category: { in: categoryId } } : {},
        ],
      };

      // Query to search a book by name
      if (book) {
        searchQuery.or.push({ name: { contains: book } });
      }

      // For user get only available books
      const existedUser = await User.findOne({ id: req.decodedToken.id });
      if (existedUser) {
        searchQuery.isAvailable = true;
      }

      const books = await Book.find({
        where: searchQuery,
        limit: limit,
        skip: skipIndex,
      }).populateAll();

      return res.ok(books);
    } catch (error) {
      sails.log.error(error);
      return res.serverError(error);
    }
  },
};
