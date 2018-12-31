//IMPORTS
const mongoose = require('mongoose');
const Joi = require('joi');

//CREATE CATEGORY MODEL
const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    }
});

const Category = mongoose.model('Category', categorySchema);

//VALIDATE 
function validateCategories(category) {
    const schema = {
        name: Joi.string().min(3).max(50).required()
    };
    return Joi.validate(category, schema);
}

exports.Category = Category;
exports.validate = validateCategories;
exports.categorySchema = categorySchema;