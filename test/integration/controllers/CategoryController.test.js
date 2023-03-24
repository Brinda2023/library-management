var supertest = require("supertest");
var tokenAdmin;

describe("CategoryController", () => {
  //login
  it("admin login", (done) => {
    supertest(sails.hooks.http.app)
      .post("/admin/login")
      .send({
        email: "admin@zignuts.com",
        password: "VeryStrong@Pwd9812",
      })
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        tokenAdmin = res.body.data.token;

        done();
      });
  });

  var categoryID;
  //create
  it("create a category", (done) => {
    supertest(sails.hooks.http.app)
      .post("/category")
      .send({
        name: "Category2",
      })
      .set("Authorization", `Bearer ${tokenAdmin}`)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        console.log(res.body);
        categoryID = res.body.data.category.id;

        done();
      });
  });
  //get
  it("get all the categories", (done) => {
    supertest(sails.hooks.http.app)
      .get("/category")
      .set("Authorization", `Bearer ${tokenAdmin}`)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        console.log(res.body);

        done();
      });
  });
  //update
  it("update a category", (done) => {
    supertest(sails.hooks.http.app)
      .patch("/category/" + categoryID)
      .field("name", "Category22")
      .set("Authorization", `Bearer ${tokenAdmin}`)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        console.log(res.body);

        done();
      });
  });
  //delete
  it("delete a category", (done) => {
    supertest(sails.hooks.http.app)
      .delete("/category/" + categoryID)
      .set("Authorization", `Bearer ${tokenAdmin}`)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        console.log(res.body);

        done();
      });
  });
});
