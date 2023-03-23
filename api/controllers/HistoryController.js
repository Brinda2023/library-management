/**
 * HistoryController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const nodemailer = require("nodemailer");

var transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "8c383be5343b1f",
    pass: "e909f182022f7a",
  },
});

module.exports = {
  /**
   * @method create
   * @description This method creates a new history to issue book to user
   * @param {Request} req HTTP Request
   * @param {Response} res HTTP Response
   */
  create: async (req, res) => {
    try {
      // get the book data from body
      const { book, issuedTo } = req.body;

      // validate data
      if (!book || !issuedTo) {
        return res.badRequest("history.required.input");
      }
      // check if book exists in the database with given ID
      let existedBook = await Book.findOne({ name: book });
      console.log(existedBook);
      if (book !== existedBook.name) {
        return res.notFound();
      }
      // check if book is available
      if (!existedBook.isAvailable) {
        return res.badRequest("book.unavailable");
      }
      // check if user exists in the database with given ID
      let existedUser = await User.findOne({ username: issuedTo });
      if (issuedTo !== existedUser.username) {
        return res.notFound();
      }
      console.log(existedUser);

      const currentDate = new Date().toLocaleDateString();

      // creating the history in the database
      const history = await History.create({
        id: sails.config.constants.uuid(),
        book: existedBook.id,
        issuedTo: existedUser.id,
        issuedAt: currentDate,
      }).fetch();
      console.log(history);

      //Updating book status to unavailable
      await Book.updateOne({
        id: existedBook.id,
      }).set({ isAvailable: false });

      //Send confirmation mail to user for issuing a book
      let mailDetails = {
        from: "sender@gmail.com",
        to: "receiver@gmail.com",
        subject: "Book Issued Confirmation Mail",
        text:
          "Dear " +
          existedUser.firstName +
          " We've issued you a book " +
          existedBook.name,
      };
      transport.sendMail(mailDetails, (err, data) => {
        if (err) {
          console.log("Error Occurs");
        } else {
          console.log("Email sent successfully");
        }
      });

      return res.ok({ history });
    } catch (error) {
      sails.log.error(error);
      return res.serverError(error);
    }
  },
  /**
   * @method update
   * @description This method updates the history to return book from user
   * @param {Request} req HTTP Request
   * @param {Response} res HTTP Response
   */
  update: async (req, res) => {
    try {
      // get the book ID from the params
      const { id } = req.params;

      // validate data
      if (!id) {
        return res.badRequest("book.required.id");
      }

      const currentDate = new Date().toLocaleDateString();

      // updating the history in the database
      let updatedHistory = await History.updateOne({ book: id }).set({
        returnedAt: currentDate,
      });

      // if there is no updatedHistory, means the given book ID was invalid and no history record with that book ID is found in the database
      if (!updatedHistory) {
        return res.notFound();
      }

      const existedBook = await Book.findOne({ id: updatedHistory.book });
      const existedUser = await User.findOne({ id: updatedHistory.issuedTo });

      //Updating book status to available
      await Book.updateOne({
        id: existedBook.id,
      }).set({ isAvailable: true });

      //Send confirmation mail to user for returning a book
      let mailDetails = {
        from: "sender@gmail.com",
        to: "receiver@gmail.com",
        subject: "Book Returned Confirmation Mail",
        text:
          "Dear " +
          existedUser.firstName +
          " You've returned a book " +
          existedBook.name,
      };
      transport.sendMail(mailDetails, (err, data) => {
        if (err) {
          console.log("Error Occurs");
        } else {
          console.log("Email sent successfully");
        }
      });

      return res.ok({ updatedHistory });
    } catch (error) {
      sails.log.error(error);
      return res.serverError(error);
    }
  },
  /**
   * @method get
   * @description This method get all the history record of given book ID
   * @param {Request} req HTTP Request
   * @param {Response} res HTTP Response
   */
  get: async (req, res) => {
    try {
      // get list of query params
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const skipIndex = (page - 1) * limit;

      // get the book ID from the params
      const { id } = req.params;

      // validate data
      if (!id) {
        return res.badRequest("book.required.id");
      }

      // check if book exists in the database with given ID
      let existedBook = await Book.findOne({ id });
      console.log(existedBook.id);
      if (id !== existedBook.id) {
        return res.notFound();
      }

      const history = await History.find({
        where: { book: existedBook.id },
        limit: limit,
        skip: skipIndex,
      }).populateAll();

      return res.ok({ history });
    } catch (error) {
      sails.log.error(error);
      return res.serverError(error);
    }
  },
};
