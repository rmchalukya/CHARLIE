//IMPORTS
const mongoose = require('mongoose');
const Joi = require('joi');
const express = require('express');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const router = express.Router();
const { User } = require('../models/user');

//AUTH A USER
router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send('Invalid Email or Password');

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) res.status(400).send('Invalid Email or Password');

    const token = user.generateAuthToken();
    res.send(token);
});

//VALIDATE USER
function validate(req) {
    const schema = {
        email: Joi.string().min(8).max(50).required().email(),
        password: Joi.string().min(8).max(50).required()
    };
    return Joi.validate(req, schema);
}

module.exports = router;