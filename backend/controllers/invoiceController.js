const Invoice = require('../models/invoiceModel');
const Customer = require('../models/customerModel');
const Item = require('../models/itemModel');
const { calculateGST, calculateTotal } = require('../utils/gstCalculator');
const { generateInvoiceId } = require('../utils/invoiceIdGenerator');

const getInvoices = async (req, res) => {
    try {
        const invoices = await Invoice.getAll();
        res.json(invoices);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error fetching invoices' });
    }
};

const getInvoiceById = async (req, res) => {
    try {
        const { invoiceId } = req.params;
        const invoice = await Invoice.getById(invoiceId);
        
        if (!invoice) {
            return res.status(404).json({ error: 'Invoice not found' });
        }
        
        res.json(invoice);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error fetching invoice' });
    }
};

const createInvoice = async (req, res) => {
    try {
        const { customer_id, items } = req.body;

        if (!customer_id || !items || items.length === 0) {
            return res.status(400).json({ error: 'Invalid input data' });
        }

        const customer = await Customer.getById(customer_id);
        if (!customer) {
            return res.status(404).json({ error: 'Customer not found' });
        }

        let subtotal = 0;
        const itemsData = [];

        for (let reqItem of items) {
            const itemDef = await Item.getById(reqItem.item_id);
            if (!itemDef) {
                return res.status(404).json({ error: `Item ${reqItem.item_id} not found` });
            }
            
            const quantity = reqItem.quantity;
            const unit_price = Number(itemDef.price);
            const total_price = quantity * unit_price;
            
            subtotal += total_price;
            
            itemsData.push({
                item_id: itemDef.id,
                quantity,
                unit_price,
                total_price
            });
        }

        const { taxRate, taxAmount } = calculateGST(subtotal, customer.is_registered);
        const grandTotal = calculateTotal(subtotal, taxAmount);

        const invoice_number = await generateInvoiceId();

        const invoiceData = {
            invoice_number,
            customer_id,
            subtotal: Number(subtotal.toFixed(2)),
            tax_rate: taxRate,
            tax_amount: taxAmount,
            grand_total: grandTotal
        };

        const newInvoice = await Invoice.createTx(invoiceData, itemsData);

        res.status(201).json(newInvoice);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error creating invoice' });
    }
};

module.exports = {
    getInvoices,
    getInvoiceById,
    createInvoice
};
