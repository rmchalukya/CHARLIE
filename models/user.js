//IMPORTS
const config = require('config');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Joi = require('joi');

//CREATE USER SCHEMA
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    email: {
        type: String,
        unique: true,
        required: true,
        minlength: 8,
        maxlength: 255
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 1024
    },
    isAdmin: Boolean
});

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this.id, isAdmin: this.isAdmin }, config.get('jwtPrivateKey'));
    return token;
};

//CREATE USER MODEL
const User = mongoose.model('User', userSchema);

//VALIDATE USER
function validateUsers(user) {
    const schema = {
        name: Joi.string().min(3).max(50).required(),
        email: Joi.string().min(8).max(50).required().email(),
        password: Joi.string().min(8).max(50).required()
    };
    return Joi.validate(user, schema);
}

exports.User = User;
exports.validate = validateUsers;