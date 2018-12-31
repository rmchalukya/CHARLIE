//IMPORTS
const mongoose = require('mongoose');
const Joi = require('joi');

//CREATE CUSTOMER MODEL
const Customer = mongoose.model('Customer', new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    isPrime: {
        type: Boolean,
        default: false
    },
    email: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 50
    }
}));

//VALIDATE CUSTOMER
function validateCustomers(customer) {
    const schema = {
        name: Joi.string().min(3).max(50).required(),
        isPrime: Joi.boolean(),
        email: Joi.string().min(8).max(50).required()
    };
    return Joi.validate(customer, schema);
}

exports.Customer = Customer;
exports.validate = validateCustomers;