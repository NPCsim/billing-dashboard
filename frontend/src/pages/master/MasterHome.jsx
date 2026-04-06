import { Box, Typography, Grid, Paper, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Person, Inventory } from '@mui/icons-material';

const MasterHome = () => {
    const navigate = useNavigate();

    return (
        <Box>
            <Typography variant="h4" mb={4}>Master</Typography>
            <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                    <Paper 
                        sx={{ 
                            p: 4, 
                            display: 'flex', 
                            flexDirection: 'column', 
                            alignItems: 'center', 
                            cursor: 'pointer',
                            transition: '0.3s',
                            '&:hover': { transform: 'translateY(-5px)', boxShadow: 6 }
                        }}
                        onClick={() => navigate('/master/customers')}
                    >
                        <Person sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                        <Typography variant="h5" fontWeight="bold">Customer</Typography>
                        <Typography color="text.secondary">Read or Create customer data</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper 
                        sx={{ 
                            p: 4, 
                            display: 'flex', 
                            flexDirection: 'column', 
                            alignItems: 'center',
                            cursor: 'pointer',
                            transition: '0.3s',
                            '&:hover': { transform: 'translateY(-5px)', boxShadow: 6 }
                        }}
                        onClick={() => navigate('/master/items')}
                    >
                        <Inventory sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                        <Typography variant="h5" fontWeight="bold">Items</Typography>
                        <Typography color="text.secondary">Read or Create items data</Typography>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default MasterHome;
