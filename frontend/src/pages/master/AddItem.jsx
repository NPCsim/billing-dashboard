import { Box, Typography, Button, Paper, TextField, MenuItem, Grid, Alert } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const AddItem = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        is_active: true
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        if (!formData.name) return setError('Item Name is required');
        if (!formData.price || formData.price <= 0) return setError('A valid selling price is required');

        try {
            await api.post('/items', formData);
            navigate('/master/items');
        } catch (err) {
            setError('Failed to create item');
        }
    };

    return (
        <Box>
            <Typography variant="h4" mb={4}>Add New Item</Typography>
            <Paper variant="outlined" sx={{ p: 4 }}>
                {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
                
                <Grid container spacing={4}>
                    <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" gutterBottom>Item Name</Typography>
                        <TextField fullWidth size="small" name="name" value={formData.name} onChange={handleChange} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" gutterBottom>Selling Price</Typography>
                        <TextField fullWidth size="small" type="number" name="price" value={formData.price} onChange={handleChange} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" gutterBottom>Status</Typography>
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
                    <Button variant="outlined" color="error" onClick={() => navigate('/master/items')}>
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

export default AddItem;
