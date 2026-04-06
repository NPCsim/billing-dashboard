const db = require('../config/db');

const generateInvoiceId = async () => {
    try {
        // Find the latest invoice number from the database
        const result = await db.query(
            "SELECT invoice_number FROM Invoices ORDER BY id DESC LIMIT 1"
        );

        let nextSequence = 1;

        if (result.rows.length > 0) {
            const lastInvoiceNumber = result.rows[0].invoice_number;
            // invoice_number format is INVCXXXXXX
            // Extract the last 6 characters and convert to integer
            const lastSequenceStr = lastInvoiceNumber.substring(4);
            const lastSequence = parseInt(lastSequenceStr, 10);
            
            if (!isNaN(lastSequence)) {
                nextSequence = lastSequence + 1;
            }
        }

        // Format the next sequence with leading zeros (6 digits)
        const sequenceStr = nextSequence.toString().padStart(6, '0');
        const generatedId = `INVC${sequenceStr}`;
        
        return generatedId;
    } catch (error) {
        console.error("Error generating invoice ID:", error);
        throw new Error("Failed to generate Invoice ID");
    }
};

module.exports = { generateInvoiceId };
