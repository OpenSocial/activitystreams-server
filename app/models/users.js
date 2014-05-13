/**
 * @description Users of the application
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

module.exports = function() {
    var Users = new Schema({
        firstName: {
            type: String,
            default: "",
            required: true
        },
        lastName: {
            type: String,
            default: "",
            required: true
        },
        avatar: {
            type: Schema.ObjectId,
            ref: "Media"
        },
        email: {
            type: String,
            default: "",
            required: true,
            match: /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/   // TODO: maybe we need a more complex pattern
        },
        birthdate: {
            type: Date,
            default: Date.now
        },
        password: {
            type: String,
            default: "123",  // TODO: change or remove defaulting
            required: true
            // TODO: security and validation rules for the password
        },
        role: {
            type: Schema.ObjectId,
            ref: "Roles"
        },
        createdDateTime: {
            type: Date,
            default: Date.now,
            required: true
        },
        lastUpdatedDateTime: {
            type: Date,
            default: Date.now,
            required: true
        }
    });
    mongoose.model("Users", Users);
};