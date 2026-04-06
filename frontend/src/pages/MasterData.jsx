import { Box, Typography, Paper, Tabs, Tab, CircularProgress, Alert } from '@mui/material';
import { useState, useEffect } from 'react';
import api from '../services/api';
import ReusableTable from '../components/ReusableTable';

const MasterData = () => {
    const [tabIndex, setTabIndex] = useState(0);
    const [customers, setCustomers] = useState([]);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const [custRes, itemRes] = await Promise.all([
                    api.get('/customers'),
                    api.get('/items')
                ]);
                setCustomers(custRes.data);
                setItems(itemRes.data);
            } catch (err) {
                console.error(err);
                setError('Failed to load master data. Please ensure the backend is running.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const customerColumns = [
        { label: 'Customer Code', field: 'customer_code' },
        { label: 'Name', field: 'name' },
        { label: 'Address', field: 'address' },
        { label: 'PAN', field: 'pan' },
        { label: 'GSTIN', field: 'gstin' }
    ];

    const itemColumns = [
        { label: 'Item Code', field: 'item_code' },
        { label: 'Name', field: 'name' },
        { label: 'Price (Rate)', field: 'price' },
        { label: 'Taxable', field: 'is_taxable' }
    ];

    return (
        <Box>
            <Typography variant="h4" mb={4}>Master Data</Typography>
            <Paper sx={{ width: '100%', mb: 2 }}>
                <Tabs value={tabIndex} onChange={(e, v) => setTabIndex(v)} centered>
                    <Tab label="Customers" />
                    <Tab label="Items Catalog" />
                </Tabs>
                
                <Box p={3}>
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                    {loading ? (
                        <Box display="flex" justifyContent="center" p={4}><CircularProgress /></Box>
                    ) : (
                        <>
                            {tabIndex === 0 && <ReusableTable columns={customerColumns} data={customers} />}
                            {tabIndex === 1 && <ReusableTable columns={itemColumns} data={items} />}
                        </>
                    )}
                </Box>
            </Paper>
        </Box>
    );
};

export default MasterData;
