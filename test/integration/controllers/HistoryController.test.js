var supertest = require("supertest");
var tokenAdmin;

describe("HistoryController", () => {
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
        firstName: "user2fn",
        lastName: "user2ln",
        email: "user2@gmail.com",
        password: "user2#PW",
        username: "user2un",
      })
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        done();
      });
  });
  //create
  it("create an author", (done) => {
    supertest(sails.hooks.http.app)
      .post("/author")
      .send({
        name: "Author2",
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
        name: "Category3",
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
      .field("name", "book5")
      .field("author", "Author2")
      .field("price", "111")
      .field("category", "Category3")
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

        bookID = res.body.data.id;

        done();
      });
  });
  //create
  it("Issue a book", (done) => {
    supertest(sails.hooks.http.app)
      .post("/history")
      .send({
        book: "book5",
        issuedTo: "user2un",
      })
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
  it("return a book", (done) => {
    supertest(sails.hooks.http.app)
      .patch("/history/" + bookID)
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
  //get
  it("get history of issued book", (done) => {
    supertest(sails.hooks.http.app)
      .get("/history/" + bookID)
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
