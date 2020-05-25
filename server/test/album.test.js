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

    describe("Create an album with a photo, then delete the photo", function () {
        it("should create an album, then delete it", async () => {
            return new Promise(async (resolve, reject) => {
                try {
                    const testAlbum = {
                        title: "album" + new Date()
                    };

                    let response = await request(app)
                        .post("/albums")
                        .set("x-auth", "test")
                        .send(testAlbum);

                    expect(response.statusCode).to.equal(201);
                    let testAlbumId = response.body.id;

                    response = await request(app)
                        .post("/albums/" + testAlbumId + "/photos")
                        .set("x-auth", "test")
                        .field("Content-Type", "multipart/form-data")
                        .attach("file", path.resolve(__dirname, "resources/lena.jpg"));

                    expect(response.statusCode).to.equal(201);
                    expect(response.body.path).to.equal("static/albums/" + testAlbumId + "/" + response.body.id + ".jpg");
                    let photoId = response.body.id;

                    // Get the photo
                    response = await request(app)
                        .get("/albums/" + testAlbumId)
                        .set("x-auth", "test")

                    expect(response.statusCode).to.equal(200);
                    let responseAlbum = response.body;
                    expect(responseAlbum.photos.length).to.equal(1);

                    // Try to update the album with no photo  - shouldn't delete any photos
                    responseAlbum.photos = [];
                    response = await request(app)
                        .patch("/albums/" + testAlbumId)
                        .set("x-auth", "test")
                        .send(responseAlbum)
                    expect(response.statusCode).to.equal(200);
                    expect(responseAlbum.photos.length).to.equal(0);

                    response = await request(app)
                        .get("/albums/" + testAlbumId)
                        .set("x-auth", "test")

                    expect(response.statusCode).to.equal(200);
                    responseAlbum = response.body;
                    expect(responseAlbum.photos.length).to.equal(1);

                    // Try to delete the album - shouldn't be possible as there are photos
                    response = await request(app)
                        .delete("/albums/" + testAlbumId)
                        .set("x-auth", "test")

                    expect(response.statusCode).to.equal(403);

                    // Delete the photo - should succeed
                    response = await request(app)
                        .delete("/albums/" + testAlbumId + "/photos/" + photoId)
                        .set("x-auth", "test");
                    expect(response.statusCode).to.equal(204);

                    response = await request(app)
                        .get("/albums/" + testAlbumId)
                        .set("x-auth", "test")

                    expect(response.statusCode).to.equal(200);
                    responseAlbum = response.body;
                    expect(responseAlbum.photos.length).to.equal(0);

                    // Delete the album - should succeed
                    response = await request(app)
                        .delete("/albums/" + testAlbumId)
                        .set("x-auth", "test")

                    expect(response.statusCode).to.equal(204);

                    resolve();
                } catch (e) {
                    reject(e);
                }
            });
        });
    });

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
