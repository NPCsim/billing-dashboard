const db = require('../config/db');

const Invoice = {
    createTx: async (invoiceData, itemsData) => {
        const client = await db.getClient();
        try {
            await client.query('BEGIN');

            const { invoice_number, customer_id, subtotal, tax_rate, tax_amount, grand_total } = invoiceData;

            // Insert into Invoices
            const invoiceResult = await client.query(
                `INSERT INTO Invoices (invoice_number, customer_id, subtotal, tax_rate, tax_amount, grand_total)
                 VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
                [invoice_number, customer_id, subtotal, tax_rate, tax_amount, grand_total]
            );

            const newInvoice = invoiceResult.rows[0];

            // Insert into Invoice_Items
            const insertedItems = [];
            for (let item of itemsData) {
                const { item_id, quantity, unit_price, total_price } = item;
                const itemResult = await client.query(
                    `INSERT INTO Invoice_Items (invoice_id, item_id, quantity, unit_price, total_price)
                     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
                    [newInvoice.id, item_id, quantity, unit_price, total_price]
                );
                insertedItems.push(itemResult.rows[0]);
            }

            await client.query('COMMIT');
            
            return {
                ...newInvoice,
                items: insertedItems
            };
        } catch (e) {
            await client.query('ROLLBACK');
            throw e;
        } finally {
            client.release();
        }
    },

    getAll: async () => {
        const result = await db.query(`
            SELECT i.*, c.name as customer_name,
                   STRING_AGG(CASE WHEN it.name IS NOT NULL THEN it.name ELSE '' END, ', ') as item_names
            FROM Invoices i
            JOIN Customers c ON i.customer_id = c.id
            LEFT JOIN Invoice_Items ii ON i.id = ii.invoice_id
            LEFT JOIN Items it ON ii.item_id = it.id
            GROUP BY i.id, c.name
            ORDER BY i.id DESC
        `);
        return result.rows;
    },

    getById: async (id) => {
        const invoiceResult = await db.query(`
            SELECT i.*, c.name as customer_name, c.email, c.phone, c.is_registered 
            FROM Invoices i
            JOIN Customers c ON i.customer_id = c.id
            WHERE i.id = $1
        `, [id]);

        if (invoiceResult.rows.length === 0) return null;

        const invoice = invoiceResult.rows[0];

        const itemsResult = await db.query(`
            SELECT ii.*, it.name as item_name, it.description 
            FROM Invoice_Items ii
            JOIN Items it ON ii.item_id = it.id
            WHERE ii.invoice_id = $1
        `, [id]);

        return {
            ...invoice,
            items: itemsResult.rows
        };
    }
};

module.exports = Invoice;
