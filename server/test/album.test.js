"use strict";

const app = require("../server"),
    path = require('path'),
    chai = require("chai"),
    request = require("supertest"),
    expect = require("chai").expect;

let albumId;

describe("Album API Integration Tests", function () {
    before(function (done) {

        const album1 = {
            title: "album1"
        };

        request(app)
            .post("/albums")
            .set("x-auth", "test")
            .send(album1)
            .end(function (err, res) {
                expect(res.statusCode).to.equal(201);
                albumId = res.body.id;

                request(app)
                    .post("/albums/" + albumId + "/photos")
                    .set("x-auth", "test")
                    .field("Content-Type", "multipart/form-data")
                    .attach("file", path.resolve(__dirname, "resources/lena.jpg"))
                    .end(function (err, res) {
                        expect(res.statusCode).to.equal(201);
                        expect(res.body.path).to.equal("static/albums/" + albumId + "/" + res.body.id + ".jpg");
                        done();
                    });
            });
    });

//   describe("Create post when NOT logged in", function() {
//     it("should get error", function(done) {
//       const post = {
//         title: "title",
//         text: "text"
//       };

//       request(app)
//         .post("/posts")
//         .send(post)
//         .end(function(err, res) {
//           expect(res.statusCode).to.equal(403);
//           done();
//         });
//     });
//   });

//   describe("Create post", function() {
//     it("should create a post", function(done) {
//       const post = {
//         title: "3_thirdPost",
//         text: "text"
//       };

//       request(app)
//         .post("/posts")
//         .set("x-auth", "test")
//         .send(post)
//         .end(function(err, res) {
//           expect(res.statusCode).to.equal(201);
//           let postResponse = res.body;

//           expect(postResponse.title).to.equal("3_thirdPost");
//           expect(postResponse.text).to.equal("text");
//           expect(postResponse.comments).to.be.an("array");
//           done();
//         });
//     });
//   });

//   // TODO comment is not returned
//   // describe("Create comment to post", function() {
//   //   it("should create a post", function(done) {
//   //     const comment2 = {
//   //       text: "comment2"
//   //     };

//   //     request(app)
//   //       .post("/posts/" + post1Id + "/comments")
//   //       .set("x-auth", "test")
//   //       .send(comment2)
//   //       .end(function(err, res) {
//   //         expect(res.statusCode).to.equal(201);
//   //         let postResponse = res.body;

//   //         expect(postResponse.text).to.equal("comment2");
//   //         done();
//   //       });
//   //   });
//   // });

    describe("GET albums when NOT logged in", function () {
        it("should not get any albums", function (done) {
            request(app)
                .get("/albums")
                .end(function (err, res) {
                    expect(res.statusCode).equal(403);
                    done();
                });
        });
    });

    describe("GET an album", function () {
        it("should album named album1 with photos", function (done) {
            request(app)
                .get("/albums/" + albumId)
                .set("x-auth", "test")
                .end(function (err, res) {
                    expect(res.statusCode).equal(200);
                    expect(res.body.title).to.equal("album1");
                    expect(res.body.photos.length).to.equal(1);
                    expect(res.body.photos[0].width).to.equal(750);
                    expect(res.body.photos[0].height).to.equal(514);
                    expect(res.body.photos[0].path).to.equal("static/albums/" + albumId + "/" + res.body.photos[0].id + ".jpg");
                    done();
                });
        });
    });

    describe("GET an album when NOT logged in", function () {
        it("should not get any album", function (done) {
            request(app)
                .get("/albums/" + albumId)
                .end(function (err, res) {
                    expect(res.statusCode).equal(403);
                    done();
                });
        });
    });

    describe("GET a photo served when NOT logged in", function () {
        it("should not get any photo", function (done) {
            request(app)
                .get("/static/albums/" + albumId + "/lena.jpg")
                .end(function (err, res) {
                    expect(res.statusCode).equal(404);
                    done();
                });
        });
    });

    describe("GET albums", function () {
        it("should get 1 album with photos", function (done) {
            request(app)
                .get("/albums")
                .set("x-auth", "test")
                .end(function (err, res) {
                    expect(res.statusCode).equal(200);
                    expect(res.body).to.be.an("array");
                    expect(res.body).to.have.lengthOf(1);

                    let foundAlbum = false;
                    let foundPhoto = undefined;
                    res.body.forEach(album => {
                        if (album.title === "album1") {
                            foundAlbum = true;

                            if (album.photos.length === 1)
                                foundPhoto = album.photos[0];
                        }
                    });

                    expect(foundAlbum, "album not found").to.be.true;
                    expect(foundPhoto, "photo not found").to.not.equal(undefined);
                    expect(foundPhoto.filename).to.equal(foundPhoto.id + ".jpg");
                    expect(foundPhoto.thumbnail).to.equal(foundPhoto.id + "_thumbnail.jpg");
                    expect(foundPhoto.path).to.equal("static/albums/" + albumId + "/" + foundPhoto.id + ".jpg");

                    request(app)
                        .get("/" + foundPhoto.path)
                        .set("x-auth", "test")
                        .end(function (err, res) {
                            expect(res.statusCode).equal(200);
                            expect(res.type).equal("image/jpeg");
                            done();
                        });
                });
        });
    });
});

//     describe("GET posts with includeEmbeddedDocs = false", function() {
//       it("should get 3 posts without comments", function(done) {
//         request(app)
//           .get("/posts/?includeEmbeddedDocs=false")
//           .set("x-auth", "test")
//           .end(function(err, res) {
//             expect(res.statusCode).equal(200);
//             expect(res.body).to.be.an("array");
//             expect(res.body).to.have.lengthOf(3);

//             let foundPost = false;
//             let foundComment = false;
//             res.body.forEach(post => {
//               if (post.title === "2_firstPost")
//               {
//                 foundPost = true;

//                 if (post.comments)
//                 foundComment = post.comments[0].text === "comment1";
//               }
//             });

//             expect(foundPost, "post not found").to.be.true;
//             expect(foundComment, "comment should not be found").to.be.false;
//             done();
//           });
//       });
//     });

//     describe("GET posts with count argument", function() {
//       it("should get 2 posts", function(done) {
//         request(app)
//           .get("/posts?count=2")
//           .set("x-auth", "test")
//           .end(function(err, res) {
//             expect(res.statusCode).equal(200);
//             expect(res.body).to.be.an("array");
//             expect(res.body).to.have.lengthOf(2);
//             done();
//           });
//       });
//     });

//     describe("GET posts with sorting", function() {
//       it("should get ascending sorting", function(done) {
//         request(app)
//           .get("/posts?sort=title&sortOrder=aSc")
//           .set("x-auth", "test")
//           .end(function(err, res) {
//             expect(res.statusCode).equal(200);
//             expect(res.body).to.be.an("array");
//             expect(res.body).to.have.lengthOf(3);

//             expect(res.body[0].title).to.equal("1_secondPost");
//             expect(res.body[1].title).to.equal("2_firstPost");
//             expect(res.body[2].title).to.equal("3_thirdPost");
//             done();
//           });
//       });

//       it("should get descending sorting", function(done) {
//         request(app)
//           .get("/posts?sort=title&sortOrder=dESc")
//           .set("x-auth", "test")
//           .end(function(err, res) {
//             expect(res.statusCode).equal(200);
//             expect(res.body).to.be.an("array");
//             expect(res.body).to.have.lengthOf(3);

//             expect(res.body[0].title).to.equal("3_thirdPost");
//             expect(res.body[1].title).to.equal("2_firstPost");
//             expect(res.body[2].title).to.equal("1_secondPost");
//             done();
//           });
//       });
//     });
//   });
//});
