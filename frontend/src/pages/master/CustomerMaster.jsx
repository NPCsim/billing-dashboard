import { Box, Typography, Button, Grid, Paper, Chip, CircularProgress, Alert } from '@mui/material';
import { Add } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../../services/api';

const CustomerMaster = () => {
    const navigate = useNavigate();
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const res = await api.get('/customers');
                setCustomers(res.data);
            } catch (err) {
                setError('Failed to fetch customers');
            } finally {
                setLoading(false);
            }
        };
        fetchCustomers();
    }, []);

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                <Typography variant="h4">CUSTOMERS</Typography>
                <Button 
                    variant="contained" 
                    startIcon={<Add />} 
                    sx={{ borderRadius: 8, bgcolor: 'primary.main', '&:hover': { bgcolor: 'primary.dark' } }}
                    onClick={() => navigate('/master/customers/add')}
                    disableElevation
                >
                    ADD
                </Button>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

            {loading ? <CircularProgress /> : (
                <Grid container spacing={3}>
                    {customers.map(c => (
                        <Grid item xs={12} sm={6} md={4} key={c.id}>
                            <Paper variant="outlined" sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
                                <Box mb={2}>
                                    <Typography variant="h6" fontWeight="600">{c.name}</Typography>
                                    <Typography variant="body2" color="text.secondary" mt={1}>
                                       {c.address ? c.address : 'No Address Provided'}
                                    </Typography>
                                </Box>
                                <Box display="flex" justifyContent="flex-end">
                                    <Chip 
                                        label={c.is_active !== false ? 'Active' : 'In-Active'} 
                                        color={c.is_active !== false ? 'success' : 'error'} 
                                        variant="filled" 
                                        size="small" 
                                        sx={{ fontWeight: 'bold' }}
                                    />
                                </Box>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );
};

export default CustomerMaster;
