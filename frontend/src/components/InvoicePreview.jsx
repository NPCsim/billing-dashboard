import { Box, Typography, Paper, Divider, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

const InvoicePreview = ({ invoice }) => {
    if (!invoice) return null;

    return (
        <Paper sx={{ p: 5, mt: 3, borderRadius: 2 }} variant="outlined">
            <Box display="flex" justifyContent="space-between" mb={4}>
                <Typography variant="h4" fontWeight="bold" color="primary">INVOICE</Typography>
                <Typography variant="h6" color="text.secondary">#{invoice.invoice_number}</Typography>
            </Box>
            
            <Grid container spacing={4} mb={4}>
                <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>Billed To:</Typography>
                    <Typography variant="body1" fontWeight="bold">{invoice.customer_name}</Typography>
                    {invoice.email && <Typography variant="body2" color="text.secondary">{invoice.email}</Typography>}
                    {invoice.phone && <Typography variant="body2" color="text.secondary">{invoice.phone}</Typography>}
                    <Typography variant="body2" color="text.secondary">GSTIN: {invoice.is_registered ? 'Registered' : 'Not Registered'}</Typography>
                </Grid>
            </Grid>

            {/* Line items section */}
            <TableContainer component={Box} sx={{ mb: 4, borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
                <Table size="small">
                    <TableHead sx={{ bgcolor: 'action.hover' }}>
                        <TableRow>
                            <TableCell><b>Item Description</b></TableCell>
                            <TableCell align="right"><b>Qty</b></TableCell>
                            <TableCell align="right"><b>Unit Price</b></TableCell>
                            <TableCell align="right"><b>Total</b></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {invoice.items && invoice.items.map((row) => (
                            <TableRow key={row.id}>
                                <TableCell>{row.item_name}</TableCell>
                                <TableCell align="right">{row.quantity}</TableCell>
                                <TableCell align="right">₹{row.unit_price}</TableCell>
                                <TableCell align="right">₹{row.total_price}</TableCell>
                            </TableRow>
                        ))}
                        {(!invoice.items || invoice.items.length === 0) && (
                            <TableRow>
                                <TableCell colSpan={4} align="center">No items found.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <Divider sx={{ mb: 3 }} />

            <Box display="flex" justifyContent="flex-end">
                <Box minWidth={250}>
                    <Box display="flex" justifyContent="space-between" mb={1}>
                        <Typography color="text.secondary">Subtotal:</Typography>
                        <Typography fontWeight="500">₹{invoice.subtotal}</Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between" mb={2}>
                        <Typography color="text.secondary">GST ({invoice.tax_rate}%):</Typography>
                        <Typography fontWeight="500">₹{invoice.tax_amount}</Typography>
                    </Box>
                    <Divider sx={{ my: 1 }} />
                    <Box display="flex" justifyContent="space-between" mt={2}>
                        <Typography variant="h6" fontWeight="bold">Total:</Typography>
                        <Typography variant="h6" color="primary" fontWeight="bold">₹{invoice.grand_total}</Typography>
                    </Box>
                </Box>
            </Box>
        </Paper>
    );
};

export default InvoicePreview;
