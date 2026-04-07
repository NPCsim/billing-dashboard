const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./config/db'); // Using our secure existing DB wrapper

const customerRoutes = require('./routes/customerRoutes');
const itemRoutes = require('./routes/itemRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/customers', customerRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/invoices', invoiceRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date() });
});

const createTables = async () => {
    try {
        await db.query(`
            CREATE TABLE IF NOT EXISTS Customers (
                id SERIAL PRIMARY KEY,
                customer_code VARCHAR(50),
                name VARCHAR(255) NOT NULL,
                address TEXT,
                pan VARCHAR(50),
                email VARCHAR(255),
                phone VARCHAR(20),
                is_registered BOOLEAN DEFAULT false,
                gstin VARCHAR(50),
                is_active BOOLEAN DEFAULT true,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS Items (
                id SERIAL PRIMARY KEY,
                item_code VARCHAR(50),
                name VARCHAR(255) NOT NULL,
                description TEXT,
                price NUMERIC(10, 2) NOT NULL DEFAULT 0,
                is_taxable BOOLEAN DEFAULT true,
                is_active BOOLEAN DEFAULT true,
                sku VARCHAR(100),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS Invoices (
                id SERIAL PRIMARY KEY,
                invoice_number VARCHAR(10) NOT NULL UNIQUE,
                customer_id INT NOT NULL,
                subtotal NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
                tax_rate NUMERIC(5, 2) NOT NULL DEFAULT 0.00, 
                tax_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
                grand_total NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT fk_customer FOREIGN KEY(customer_id) REFERENCES Customers(id)
            );

            CREATE TABLE IF NOT EXISTS Invoice_Items (
                id SERIAL PRIMARY KEY,
                invoice_id INT NOT NULL,
                item_id INT NOT NULL,
                quantity INT NOT NULL CHECK (quantity > 0),
                unit_price NUMERIC(10, 2) NOT NULL,
                total_price NUMERIC(12, 2) NOT NULL,
                CONSTRAINT fk_invoice FOREIGN KEY(invoice_id) REFERENCES Invoices(id) ON DELETE CASCADE,
                CONSTRAINT fk_item FOREIGN KEY(item_id) REFERENCES Items(id)
            );

            DO $$ 
            BEGIN
                IF NOT EXISTS (SELECT 1 FROM Customers WHERE customer_code = 'C00001') THEN
                    INSERT INTO Customers (customer_code, name, address, pan, gstin, is_registered, is_active) VALUES 
                    ('C00001', 'Gupta Enterprize Pvt. Ltd.', 'Gurgaon, Haryana', 'BCNSG1234H', '06BCNSG1234H1Z5', true, true),
                    ('C00002', 'Mahesh Industries Pvt. Ltd.', 'Delhi, Delhi', 'AMNSM1234U', '07AMNSM1234U1Z5', true, true),
                    ('C00003', 'Omkar and Brothers Pvt. Ltd.', 'Uttrakhand, Uttar Pradesh', 'CNBSO1234S', '05CNBSO1234S1Z5', true, false),
                    ('C00004', 'Bhuwan Infotech.', 'Alwar, Rajasthan', 'CMNSB1234A', '08CMNSB1234A1Z5', true, true),
                    ('C00005', 'Swastik Software Pvt. Ltd.', 'Gurgaon, Haryana', 'AGBCS1234B', '06AGBCS1234B1Z5', true, true);
                END IF;

                IF NOT EXISTS (SELECT 1 FROM Items WHERE item_code = 'IT00001') THEN
                    INSERT INTO Items (item_code, name, price, is_taxable, is_active) VALUES 
                    ('IT00001', 'Laptop', 85000, true, true),
                    ('IT00002', 'LED Monitor', 13450, true, true),
                    ('IT00003', 'Pen Drive', 980, true, true),
                    ('IT00004', 'Mobile', 18900, true, true),
                    ('IT00005', 'Headphone', 2350, false, true),
                    ('IT00006', 'Bagpack', 1200, true, true),
                    ('IT00007', 'Powerbank', 1400, true, true);
                END IF;
            END $$;
        `);
        console.log("Tables verified and automated population successful");
    } catch (e) {
        console.error("Failed to verify/create tables natively:", e.message);
    }
};

const PORT = process.env.PORT || 5000;

createTables().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});
