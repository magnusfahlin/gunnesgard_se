const mongoose = require("mongoose");
const Schema = require("mongoose").Schema;
const {createSchemaOptions} = require("./schemaUtil");

const PhotoSchema = new Schema(
    {
        title: {
            type: String,
            required: false,
            minlength: 1,
            trim: true,
        },
        text: {
            type: String,
            required: false,
            minlength: 1,
            trim: true,
        },
        filename: {
            type: String,
            required: true,
            minlength: 1,
            trim: true,
        },
        thumbnail: {
            type: String,
            required: true,
            minlength: 1,
            trim: true,
        },
        width: {
            type: Number,
            required: true,
            trim: true,
        },
        height: {
            type: Number,
            required: true,
            trim: true,
        },
        thumbnailWidth: {
            type: Number,
            required: true,
            trim: true,
        },
        thumbnailHeight: {
            type: Number,
            required: true,
            trim: true,
        },
    },
    createSchemaOptions()
);

PhotoSchema.virtual('path').get(function () {
    const parent = this.parent();
    return "static/albums/" + parent._id + "/" + this.filename
});

PhotoSchema.virtual('thumbnailPath').get(function () {
    const parent = this.parent();
    return "static/albums/" + parent._id + "/" + this.thumbnail
});

PhotoSchema.set("toJSON", {
    virtuals: true,
    transform: function (doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    },
});

PhotoSchema.set("toObject", {
    transform: function (doc, ret, options) {
        ret._id = ret.id;
        delete ret.id;
    },
});

const AlbumSchema = new Schema(
    {
        title: {
            type: String,
            required: false,
            minlength: 1,
            trim: true,
        },
        photos: {
            type: [PhotoSchema],
        }
    },
    createSchemaOptions()
);

const Album = mongoose.model("album", AlbumSchema);
const Photo = mongoose.model("photo", PhotoSchema);

module.exports = {Album, Photo};
