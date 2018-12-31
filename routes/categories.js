//IMPORTS
const asyncMiddleware = require('../middleware/async');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const mongoose = require('mongoose');
const Joi = require('joi');
const { Category, validate } = require('../models/category');
const express = require('express');
const router = express.Router();

//GET CATEGORIES
router.get('/', asyncMiddleware(async (req, res) => {
    const categories = await Category.find().sort('name');
    res.send(categories);
}));

//GET A CATEGORY
router.get('/:id', asyncMiddleware(async (req, res) => {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).send('Requested category not found');
    res.send(category);
}));

//ADD A CATEGORY
router.post('/', auth, asyncMiddleware(async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let category = new Category({ name: req.body.name });
    category = await category.save();

    res.send(category);
}));


//UPDATE A CATEGORY
router.put('/:id', auth, asyncMiddleware(async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const category = await Category.findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true });
    if (!category) return res.status(404).send('Requested category not found');

    res.send(category);
}));


//DELETE A CATEGORY
router.delete('/:id', [auth, admin], asyncMiddleware(async (req, res) => {
    const category = await Category.findByIdAndRemove(req.params.id);
    if (!category) return res.status(404).send('Requested category not found');
    res.send(category);
}));

module.exports = router;