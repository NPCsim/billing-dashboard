import { Box, Typography, Paper, Alert, TextField, InputAdornment, Button, CircularProgress } from '@mui/material';
import { Search, Visibility } from '@mui/icons-material';
import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import ReusableTable from '../components/ReusableTable';

const Dashboard = () => {
    const navigate = useNavigate();
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchInvoices = async () => {
            try {
                const res = await api.get('/invoices');
                setInvoices(res.data);
            } catch (err) {
                console.error(err);
                setError('Failed to query invoice database.');
            } finally {
                setLoading(false);
            }
        };
        fetchInvoices();
    }, []);

    const filteredInvoices = useMemo(() => {
        if (!searchTerm) return invoices;
        return invoices.filter(inv => 
            inv.invoice_number.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [invoices, searchTerm]);

    const invoiceColumns = [
        { label: 'Invoice ID', field: 'invoice_number' },
        { label: 'Customer Name', field: 'customer_name' },
        { label: 'Item Name(s)', field: 'item_names' },
        { label: 'Amount', field: 'grand_total', render: (row) => `₹${row.grand_total}` },
        { 
            label: 'Action', 
            align: 'center',
            render: (row) => (
                <Button 
                    variant="outlined" 
                    size="small" 
                    startIcon={<Visibility />} 
                    onClick={() => navigate(`/invoice/${row.id}`)}
                >
                    View
                </Button>
            )
        }
    ];

    return (
        <Box>
            <Typography variant="h4" mb={4} fontWeight="bold">Dashboard Home</Typography>
            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
            
            <Paper sx={{ p: 4, mb: 4, borderRadius: 2 }} variant="outlined">
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={4}>
                    <Typography variant="h6" fontWeight="bold">Invoice Index</Typography>
                    <TextField 
                        placeholder="Search by Invoice ID..." 
                        variant="outlined"
                        size="small"
                        sx={{ minWidth: 300 }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Search />
                              </InputAdornment>
                            ),
                        }}
                    />
                </Box>

                {loading ? (
                    <Box display="flex" justifyContent="center" p={4}><CircularProgress /></Box>
                ) : filteredInvoices.length === 0 ? (
                    <Box display="flex" justifyContent="center" p={8} bgcolor="grey.50" borderRadius={2} border="1px dashed grey">
                        <Typography color="text.secondary" variant="body1">
                            {searchTerm ? "No results found." : "No invoices found. Generate an invoice first in the Billing section."}
                        </Typography>
                    </Box>
                ) : (
                    <ReusableTable columns={invoiceColumns} data={filteredInvoices} />
                )}
            </Paper>
        </Box>
    );
};

export default Dashboard;
