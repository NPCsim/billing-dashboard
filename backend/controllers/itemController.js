const Item = require('../models/itemModel');

const getItems = async (req, res) => {
    try {
        const items = await Item.getAll();
        res.json(items);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error fetching items' });
    }
};

const createItem = async (req, res) => {
    try {
        const newItem = await Item.create(req.body);
        res.status(201).json(newItem);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error creating item' });
    }
};

module.exports = {
    getItems,
    createItem
};
