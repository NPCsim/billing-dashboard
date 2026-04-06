const Customer = require('../models/customerModel');

const getCustomers = async (req, res) => {
    try {
        const customers = await Customer.getAll();
        res.json(customers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error fetching customers' });
    }
};

const createCustomer = async (req, res) => {
    try {
        const newCustomer = await Customer.create(req.body);
        res.status(201).json(newCustomer);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error creating customer' });
    }
};

module.exports = {
    getCustomers,
    createCustomer
};
