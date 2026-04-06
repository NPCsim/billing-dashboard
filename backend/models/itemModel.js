const db = require('../config/db');

const Item = {
    getAll: async () => {
        const result = await db.query("SELECT * FROM Items ORDER BY id DESC");
        return result.rows;
    },

    getById: async (id) => {
        const result = await db.query("SELECT * FROM Items WHERE id = $1", [id]);
        return result.rows[0];
    },

    create: async (itemData) => {
        const { name, description, price, sku, is_active, is_taxable } = itemData;
        const result = await db.query(
            `INSERT INTO Items (name, description, price, sku, is_active, is_taxable) 
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [name, description, price, sku, is_active ?? true, is_taxable ?? true]
        );
        return result.rows[0];
    }
};

module.exports = Item;
