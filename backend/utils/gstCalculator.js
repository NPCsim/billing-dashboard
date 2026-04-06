const calculateGST = (subtotal, isRegistered) => {
    // Business Logic: 18% if NOT registered, 0% if registered
    const taxRate = isRegistered ? 0 : 18;
    const taxAmount = (subtotal * taxRate) / 100;
    return {
        taxRate,
        taxAmount: Number(taxAmount.toFixed(2))
    };
};

const calculateTotal = (subtotal, taxAmount) => {
    return Number((subtotal + taxAmount).toFixed(2));
};

module.exports = {
    calculateGST,
    calculateTotal
};
