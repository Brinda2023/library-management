var supertest = require("supertest");
var tokenAdmin;
var tokenUser;

describe("BookController", () => {
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
  // register
  it("register a user", (done) => {
    supertest(sails.hooks.http.app)
      .post("/user/register")
      .send({
        firstName: "user1fn",
        lastName: "user1ln",
        email: "user1@gmail.com",
        password: "user1#PW",
        username: "user1un",
      })
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        done();
      });
  });
  // login
  it("login a user", (done) => {
    supertest(sails.hooks.http.app)
      .post("/user/login")
      .send({
        email: "user1@gmail.com",
        password: "user1#PW",
      })
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        tokenUser = res.body.data.token;

        done();
      });
  });
  //create
  it("create an author", (done) => {
    supertest(sails.hooks.http.app)
      .post("/author")
      .send({
        name: "Author1",
      })
      .set("Authorization", `Bearer ${tokenAdmin}`)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        done();
      });
  });
  //create
  it("create a category", (done) => {
    supertest(sails.hooks.http.app)
      .post("/category")
      .send({
        name: "Category1",
      })
      .set("Authorization", `Bearer ${tokenAdmin}`)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        done();
      });
  });
  let bookID;
  //create
  it("create a book", (done) => {
    supertest(sails.hooks.http.app)
      .post("/book")
      .field("name", "book4")
      .field("author", "Author1")
      .field("price", "111")
      .field("category", "Category1")
      .field("publishYear", "2001")
      .attach(
        "thumb",
        "/Users/ztlab140/Documents/sails/library-management/.tmp/uploads/f83f4c2a-aaf0-4c73-837f-8c78bc12b8dc.png"
      )
      .set("Authorization", `Bearer ${tokenAdmin}`)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        console.log(res.body);
        bookID = res.body.data.id;

        done();
      });
  });
  //get
  it("get all the books", (done) => {
    supertest(sails.hooks.http.app)
      .get("/book")
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
  //getU
  it("get all the books", (done) => {
    supertest(sails.hooks.http.app)
      .get("/book/user")
      .set("Authorization", `Bearer ${tokenUser}`)
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
  it("update a book", (done) => {
    supertest(sails.hooks.http.app)
      .patch("/book/" + bookID)
      .field("name", "book44")
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
  it("delete a book", (done) => {
    supertest(sails.hooks.http.app)
      .delete("/book/" + bookID)
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
