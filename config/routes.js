/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {
  "POST /admin/login": "AdminController.login",
  "GET /admin/logout": "AdminController.logout",

  "POST /category": "CategoryController.create",
  "GET /category": "CategoryController.get",
  "PATCH /category/:id": "CategoryController.update",
  "DELETE /category/:id": "CategoryController.delete",

  "POST /author": "AuthorController.create",
  "GET /author": "AuthorController.get",
  "PATCH /author/:id": "AuthorController.update",
  "DELETE /author/:id": "AuthorController.delete",

  "POST /book": "BookController.create",
  "GET /book": "BookController.get",
  "PATCH /book/:id": "BookController.update",
  "DELETE /book/:id": "BookController.delete",
  "GET /book/user": "BookController.getU",

  "POST /history": "HistoryController.create",
  "PATCH /history/:id": "HistoryController.update",
  "GET /history/:id": "HistoryController.get",

  "POST /user/register": "UserController.register",
  "POST /user/login": "UserController.login",
  "GET /user/logout": "UserController.logout",
};
