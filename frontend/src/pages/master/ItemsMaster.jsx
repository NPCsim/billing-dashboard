import { Box, Typography, Button, Grid, Paper, Chip, CircularProgress, Alert } from '@mui/material';
import { Add } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../../services/api';

const ItemsMaster = () => {
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const res = await api.get('/items');
                setItems(res.data);
            } catch (err) {
                setError('Failed to fetch items');
            } finally {
                setLoading(false);
            }
        };
        fetchItems();
    }, []);

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                <Typography variant="h4">ITEMS</Typography>
                <Button 
                    variant="contained" 
                    startIcon={<Add />} 
                    sx={{ borderRadius: 8, bgcolor: 'primary.main', '&:hover': { bgcolor: 'primary.dark' } }}
                    onClick={() => navigate('/master/items/add')}
                    disableElevation
                >
                    ADD
                </Button>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

            {loading ? <CircularProgress /> : (
                <Grid container spacing={3}>
                    {items.map(item => (
                        <Grid item xs={12} sm={6} md={4} key={item.id}>
                            <Paper variant="outlined" sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
                                <Box mb={2} display="flex" justifyContent="space-between" alignItems="center">
                                    <Typography variant="h6" fontWeight="600">{item.name}</Typography>
                                    <Typography variant="body1" fontWeight="bold">₹{item.price}</Typography>
                                </Box>
                                <Box display="flex" justifyContent="flex-end">
                                    <Chip 
                                        label={item.is_active !== false ? 'Active' : 'In-Active'} 
                                        color={item.is_active !== false ? 'success' : 'error'} 
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

export default ItemsMaster;
