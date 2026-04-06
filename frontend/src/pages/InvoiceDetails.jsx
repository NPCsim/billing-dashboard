import { Box, Typography, Paper, Divider, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, CircularProgress, Alert } from '@mui/material';
import { Print, ArrowBack } from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const InvoiceDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [invoice, setInvoice] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchInvoice = async () => {
            try {
                const res = await api.get(`/invoices/${id}`);
                setInvoice(res.data);
            } catch (err) {
                setError('Failed to fetch detailed invoice parameters.');
            } finally {
                setLoading(false);
            }
        };
        fetchInvoice();
    }, [id]);

    if (loading) return <Box display="flex" justifyContent="center" mt={10}><CircularProgress /></Box>;
    if (error) return <Alert severity="error" sx={{ m: 4 }}>{error}</Alert>;
    if (!invoice) return <Alert severity="error" sx={{ m: 4 }}>Invoice missing from Database context.</Alert>;

    return (
        <Box>
            <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)} sx={{ mb: 2 }}>Back to Dashboard</Button>
            
            <Paper sx={{ p: 6, borderRadius: 2, maxWidth: 900, margin: 'auto' }} variant="outlined">
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={6}>
                    <Typography variant="h3" fontWeight="800" color="primary.main" letterSpacing={1}>INVOICE</Typography>
                    <Box textAlign="right">
                        <Typography variant="subtitle2" color="text.secondary">INVOICE ID</Typography>
                        <Typography variant="h6" fontWeight="bold" color="success.main">{invoice.invoice_number}</Typography>
                    </Box>
                </Box>
                
                <Grid container spacing={4} mb={6}>
                    <Grid item xs={12} sm={6}>
                        <Paper elevation={0} sx={{ p: 3, bgcolor: 'grey.50', borderRadius: 2, border: '1px solid', borderColor: 'divider', height: '100%' }}>
                            <Typography variant="subtitle2" color="primary.main" gutterBottom fontWeight="bold">CUSTOMER DETAILS</Typography>
                            <Typography variant="h6" fontWeight="bold">{invoice.customer_name}</Typography>
                            <Typography variant="body2" mt={1} color="text.secondary">{invoice.address || 'Address N/A'}</Typography>
                            <Box mt={2}>
                                <Typography variant="body2"><b>PAN:</b> {invoice.pan}</Typography>
                                <Typography variant="body2"><b>GSTIN:</b> {invoice.gstin || 'Unregistered Entity'}</Typography>
                            </Box>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Paper elevation={0} sx={{ p: 3, bgcolor: 'grey.50', borderRadius: 2, border: '1px solid', borderColor: 'divider', height: '100%' }}>
                            <Typography variant="subtitle2" color="primary.main" gutterBottom fontWeight="bold">ISSUING DETAILS</Typography>
                            <Typography variant="body2"><b>Date:</b> {new Date(invoice.created_at).toLocaleDateString()}</Typography>
                            <Typography variant="body2"><b>Time:</b> {new Date(invoice.created_at).toLocaleTimeString()}</Typography>
                            <Typography variant="body2" mt={2}><b>Issuer:</b> LogiEdge Platform Automations</Typography>
                        </Paper>
                    </Grid>
                </Grid>

                <TableContainer component={Box} sx={{ mb: 4, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                    <Table>
                        <TableHead sx={{ bgcolor: 'action.hover' }}>
                            <TableRow>
                                <TableCell><b>ITEM DESCRIPTION</b></TableCell>
                                <TableCell align="center"><b>QUANTITY</b></TableCell>
                                <TableCell align="right"><b>UNIT RATE</b></TableCell>
                                <TableCell align="right"><b>AMOUNT</b></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {invoice.items && invoice.items.map((row) => (
                                <TableRow key={row.id}>
                                    <TableCell>{row.item_name}</TableCell>
                                    <TableCell align="center">{row.quantity}</TableCell>
                                    <TableCell align="right">₹{row.unit_price}</TableCell>
                                    <TableCell align="right">₹{row.total_price}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Box display="flex" justifyContent="flex-end" mb={6}>
                    <Box minWidth={350} p={3} bgcolor="grey.50" borderRadius={2} border="1px solid" borderColor="divider">
                        <Box display="flex" justifyContent="space-between" mb={2}>
                            <Typography color="text.secondary">Base Subtotal Amount:</Typography>
                            <Typography fontWeight="500">₹{invoice.subtotal}</Typography>
                        </Box>
                        <Box display="flex" justifyContent="space-between" mb={3}>
                            <Typography color="text.secondary">Tax Logic Application ({invoice.tax_rate}%):</Typography>
                            <Typography fontWeight="500">₹{invoice.tax_amount}</Typography>
                        </Box>
                        <Divider sx={{ my: 2 }} />
                        <Box display="flex" justifyContent="space-between">
                            <Typography variant="h5" fontWeight="bold">Final Total:</Typography>
                            <Typography variant="h5" color="primary.main" fontWeight="bold">₹{invoice.grand_total}</Typography>
                        </Box>
                    </Box>
                </Box>

                <Box display="flex" justifyContent="center">
                    <Button variant="outlined" size="large" startIcon={<Print />}>PRINT INVOICE</Button>
                </Box>
            </Paper>
        </Box>
    );
};

export default InvoiceDetails;
