import { Box, Typography, Button, Paper, TextField, MenuItem, Grid, Alert } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const AddCustomer = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        pan: '',
        gstin: '',
        is_active: true
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        if (!formData.name) return setError('Customer Name is required');

        try {
            await api.post('/customers', {
                ...formData,
                is_registered: !!formData.gstin // Implicit registration logic identical to dbInit
            });
            navigate('/master/customers');
        } catch (err) {
            setError('Failed to create customer');
        }
    };

    return (
        <Box>
            <Typography variant="h4" mb={4}>Add New Customer</Typography>
            <Paper variant="outlined" sx={{ p: 4 }}>
                {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
                
                <Grid container spacing={4}>
                    <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" gutterBottom>Customer Name</Typography>
                        <TextField fullWidth size="small" name="name" value={formData.name} onChange={handleChange} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" gutterBottom>Customer Address</Typography>
                        <TextField fullWidth size="small" name="address" value={formData.address} onChange={handleChange} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" gutterBottom>Customer PAN Card Number</Typography>
                        <TextField fullWidth size="small" name="pan" value={formData.pan} onChange={handleChange} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" gutterBottom>Customer GST Number</Typography>
                        <TextField fullWidth size="small" name="gstin" value={formData.gstin} onChange={handleChange} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" gutterBottom>Customer Status</Typography>
                        <TextField 
                            select 
                            fullWidth 
                            size="small" 
                            name="is_active" 
                            value={formData.is_active} 
                            onChange={handleChange}
                        >
                            <MenuItem value={true}>Active</MenuItem>
                            <MenuItem value={false}>In-Active</MenuItem>
                        </TextField>
                    </Grid>
                </Grid>

                <Box mt={6} display="flex" gap={2}>
                    <Button variant="outlined" color="error" onClick={() => navigate('/master/customers')}>
                        Cancel
                    </Button>
                    <Button variant="contained" color="primary" onClick={handleSubmit} disableElevation>
                        Create
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
};

export default AddCustomer;
