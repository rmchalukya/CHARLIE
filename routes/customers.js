//IMPORTS
const auth = require('../middleware/auth');
const mongoose = require('mongoose');
const Joi = require('joi');
const express = require('express');
const router = express.Router();
const { Customer, validate } = require('../models/customer');

//GET CUSTOMERS
router.get('/', async (req, res) => {
    const customer = await Customer.find().sort('name');
    res.send(customer);
});

//GET A CUSTOMER
router.get('/:id', async (req, res) => {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).send('Requested customer not found');
    res.send(customer);
});

//ADD A CUSTOMER
router.post('/', auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let customer = new Customer({
        name: req.body.name,
        email: req.body.email,
        isPrime: req.body.isPrime
    });
    customer = await customer.save();

    res.send(customer);
});

//UPDATE A CUSTOMER
router.put('/:id', auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const customer = await Customer.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        email: req.body.email,
        isPrime: req.body.isPrime
    }, { new: true });
    if (!customer) return res.status(404).send('Requested customer not found');

    res.send(customer);
});

//DELETE A CUSTOMER
router.delete('/:id', auth, async (req, res) => {
    const customer = await Customer.findByIdAndRemove(req.params.id);
    if (!customer) return res.status(404).send('Requested customer not found');
    res.send(customer);
});

module.exports = router;