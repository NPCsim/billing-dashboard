const { pool } = require('../config/db');

const initDB = async () => {
    try {
        await pool.query(`
            DROP TABLE IF EXISTS Invoice_Items, Invoices, Items, Customers CASCADE;

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
            
            -- Insert Master Excel Data
            INSERT INTO Customers (customer_code, name, address, pan, gstin, is_registered, is_active) VALUES 
            ('C00001', 'Gupta Enterprize Pvt. Ltd.', 'Gurgaon, Haryana', 'BCNSG1234H', '06BCNSG1234H1Z5', true, true),
            ('C00002', 'Mahesh Industries Pvt. Ltd.', 'Delhi, Delhi', 'AMNSM1234U', '07AMNSM1234U1Z5', true, true),
            ('C00003', 'Omkar and Brothers Pvt. Ltd.', 'Uttrakhand, Uttar Pradesh', 'CNBSO1234S', '05CNBSO1234S1Z5', true, false),
            ('C00004', 'Bhuwan Infotech.', 'Alwar, Rajasthan', 'CMNSB1234A', '08CMNSB1234A1Z5', true, true),
            ('C00005', 'Swastik Software Pvt. Ltd.', 'Gurgaon, Haryana', 'AGBCS1234B', '06AGBCS1234B1Z5', true, true);

            INSERT INTO Items (item_code, name, price, is_taxable) VALUES 
            ('IT00001', 'Laptop', 85000, true),
            ('IT00002', 'LED Monitor', 13450, true),
            ('IT00003', 'Pen Drive', 980, true),
            ('IT00004', 'Mobile', 18900, true),
            ('IT00005', 'Headphone', 2350, false),
            ('IT00006', 'Bagpack', 1200, true),
            ('IT00007', 'Powerbank', 1400, true);
        `);
        console.log("Database tables initialized successfully!");
        process.exit(0);
    } catch (e) {
        console.error("Failed to initialize database tables:", e.message);
        process.exit(1);
    }
}

initDB();
