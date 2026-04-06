const db = require('../config/db');

const Customer = {
    getAll: async () => {
        const result = await db.query("SELECT * FROM Customers ORDER BY id DESC");
        return result.rows;
    },

    getById: async (id) => {
        const result = await db.query("SELECT * FROM Customers WHERE id = $1", [id]);
        return result.rows[0];
    },

    create: async (customerData) => {
        const { name, address, pan, email, phone, is_registered, gstin, is_active } = customerData;
        const result = await db.query(
            `INSERT INTO Customers (name, address, pan, email, phone, is_registered, gstin, is_active) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
            [name, address, pan, email, phone, is_registered || false, gstin, is_active ?? true]
        );
        return result.rows[0];
    }
};

module.exports = Customer;
