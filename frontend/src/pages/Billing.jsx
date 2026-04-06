import { Box, Typography, Button, Paper, Alert, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, Grid, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Divider, IconButton, List, ListItem, ListItemButton, ListItemText, Chip } from '@mui/material';
import { Add, Remove, Receipt, Print } from '@mui/icons-material';
import { useState, useEffect } from 'react';
import api from '../services/api';

const Billing = () => {
    const [customers, setCustomers] = useState([]);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Form State
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [cart, setCart] = useState({}); // { [item_id]: quantity }
    const [generatedInvoice, setGeneratedInvoice] = useState(null);
    const [error, setError] = useState('');

    // Modal State
    const [openCustomerModal, setOpenCustomerModal] = useState(false);
    const [openItemModal, setOpenItemModal] = useState(false);
    
    // Live quantity tracker strictly for Item Modal matching Figma
    const [tempCart, setTempCart] = useState({});

    useEffect(() => {
        const fetchMaster = async () => {
            try {
                const [cRes, iRes] = await Promise.all([api.get('/customers'), api.get('/items')]);
                setCustomers(cRes.data);
                setItems(iRes.data);
            } catch (err) {
                setError('Failed to fetch required database properties.');
            } finally {
                setLoading(false);
            }
        };
        fetchMaster();
    }, []);

    // Engine Logic Evaluators
    const activeCartArray = Object.keys(cart)
        .map(id => ({ item: items.find(i => i.id == id), qty: cart[id] }))
        .filter(c => c.qty > 0 && c.item);

    const subtotal = activeCartArray.reduce((acc, curr) => acc + (curr.item.price * curr.qty), 0);
    const taxRate = selectedCustomer?.is_registered ? 0 : 18;
    const taxAmount = (subtotal * taxRate) / 100;
    const grandTotal = subtotal + taxAmount;

    // Helpers
    const resetFlow = () => {
        setSelectedCustomer(null);
        setCart({});
        setTempCart({});
        setGeneratedInvoice(null);
        setError('');
    };

    const handleCreateInvoice = async () => {
        if (!selectedCustomer) return setError('You must select a Customer first!');
        if (activeCartArray.length === 0) return setError('You must add at least 1 item!');

        try {
            const payload = {
                customer_id: selectedCustomer.id,
                items: activeCartArray.map(c => ({ item_id: c.item.id, quantity: c.qty }))
            };
            const response = await api.post('/invoices', payload);
            setGeneratedInvoice(response.data);
        } catch (err) {
            setError('Failed to generate final invoice');
        }
    };

    // Item Modal Handling
    const handleOpenItemModal = () => {
        setTempCart({ ...cart });
        setOpenItemModal(true);
    };

    const adjustTempCart = (itemId, delta) => {
        setTempCart(prev => {
            const oldVal = prev[itemId] || 0;
            const newVal = Math.max(0, oldVal + delta);
            return { ...prev, [itemId]: newVal };
        });
    };

    const confirmItems = () => {
        setCart(tempCart);
        setOpenItemModal(false);
    };

    return (
        <Box>
            <Typography variant="h4" mb={4} fontWeight="bold">Active Cart Generation</Typography>
            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
            
            {loading ? <CircularProgress /> : (
                <>
                    {/* Render specific workflow views based on completion status */}
                    {!generatedInvoice ? (
                        <Grid container spacing={4}>
                            {/* LEFT PANE: Customer & Add Items Controls */}
                            <Grid item xs={12} md={7}>
                                <Paper sx={{ p: 4, mb: 4, borderRadius: 2 }} variant="outlined">
                                    <Typography variant="h6" fontWeight="bold" gutterBottom>Customer Details View</Typography>
                                    <Divider sx={{ mb: 3 }} />
                                    
                                    {!selectedCustomer ? (
                                        <Box display="flex" flexDirection="column" alignItems="center" p={4} bgcolor="grey.100" borderRadius={2} border="1px dashed grey">
                                            <Typography color="text.secondary" mb={2}>No target customer currently assigned.</Typography>
                                            <Button variant="contained" onClick={() => setOpenCustomerModal(true)}>ADD CUSTOMER</Button>
                                        </Box>
                                    ) : (
                                        <Box p={3} bgcolor="primary.50" borderRadius={2}>
                                            <Grid container spacing={2}>
                                                <Grid item xs={12}>
                                                    <Typography variant="h6" color="primary.main">{selectedCustomer.name}</Typography>
                                                </Grid>
                                                <Grid item xs={12} sm={6}>
                                                    <Typography variant="body2" color="text.secondary">PAN Number</Typography>
                                                    <Typography fontWeight="500">{selectedCustomer.pan || 'N/A'}</Typography>
                                                </Grid>
                                                <Grid item xs={12} sm={6}>
                                                    <Typography variant="body2" color="text.secondary">GST Number</Typography>
                                                    <Typography fontWeight="500">{selectedCustomer.gstin || 'N/A'}</Typography>
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Typography variant="body2" color="text.secondary">Address</Typography>
                                                    <Typography fontWeight="500">{selectedCustomer.address || 'N/A'}</Typography>
                                                </Grid>
                                            </Grid>
                                            <Box mt={3} display="flex" justifyContent="flex-end">
                                               <Button variant="outlined" size="small" onClick={() => setOpenCustomerModal(true)}>CHANGE CUSTOMER</Button>
                                            </Box>
                                        </Box>
                                    )}
                                </Paper>

                                <Paper sx={{ p: 4, borderRadius: 2 }} variant="outlined">
                                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                                        <Typography variant="h6" fontWeight="bold">Cart Iteration</Typography>
                                        <Button variant="contained" color="secondary" onClick={handleOpenItemModal} disabled={!selectedCustomer}>
                                            ADD ITEMS
                                        </Button>
                                    </Box>
                                    <Typography variant="body2" color="text.secondary">
                                        You must select a legitimate Customer profile before acquiring stock options.
                                    </Typography>
                                </Paper>
                            </Grid>

                            {/* RIGHT PANE: Live Summary Evaluator */}
                            <Grid item xs={12} md={5}>
                                <Paper sx={{ p: 4, borderRadius: 2, height: '100%', display: 'flex', flexDirection: 'column' }} variant="outlined">
                                    <Typography variant="h6" fontWeight="bold" gutterBottom>Billing Summary</Typography>
                                    <Divider sx={{ mb: 3 }} />
                                    
                                    <TableContainer sx={{ flexGrow: 1, minHeight: 200 }}>
                                        <Table size="small">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Item</TableCell>
                                                    <TableCell align="center">Qty</TableCell>
                                                    <TableCell align="right">Amount</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {activeCartArray.length === 0 ? (
                                                    <TableRow><TableCell colSpan={3} align="center" sx={{ color: 'text.secondary', py: 5 }}>Select items to generate a summary.</TableCell></TableRow>
                                                ) : (
                                                    activeCartArray.map(row => (
                                                        <TableRow key={row.item.id}>
                                                            <TableCell>{row.item.name}</TableCell>
                                                            <TableCell align="center">{row.qty}</TableCell>
                                                            <TableCell align="right">₹{row.item.price * row.qty}</TableCell>
                                                        </TableRow>
                                                    ))
                                                )}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>

                                    <Box mt={4} pt={3} borderTop="1px solid" borderColor="divider">
                                        <Box display="flex" justifyContent="space-between" mb={1}>
                                            <Typography color="text.secondary">Subtotal</Typography>
                                            <Typography>₹{subtotal.toFixed(2)}</Typography>
                                        </Box>
                                        <Box display="flex" justifyContent="space-between" mb={1}>
                                            <Typography color="text.secondary">GST Rate Logic</Typography>
                                            <Typography>{selectedCustomer ? `${taxRate}%` : '--'}</Typography>
                                        </Box>
                                        <Box display="flex" justifyContent="space-between" mb={2}>
                                            <Typography color="text.secondary">Est. GST Addition</Typography>
                                            <Typography>₹{taxAmount.toFixed(2)}</Typography>
                                        </Box>
                                        <Divider sx={{ my: 2 }} />
                                        <Box display="flex" justifyContent="space-between" mb={4}>
                                            <Typography variant="h6" fontWeight="bold">Total Grand Total</Typography>
                                            <Typography variant="h6" fontWeight="bold" color="primary">₹{grandTotal.toFixed(2)}</Typography>
                                        </Box>
                                        
                                        <Box display="flex" gap={2}>
                                            <Button fullWidth variant="outlined" color="error" onClick={resetFlow}>Cancel</Button>
                                            <Button fullWidth variant="contained" color="success" onClick={handleCreateInvoice} disabled={activeCartArray.length === 0 || !selectedCustomer}>CREATE</Button>
                                        </Box>
                                    </Box>
                                </Paper>
                            </Grid>
                        </Grid>
                    ) : (
                        // FINAL GENERATED BILL VIEW
                        <Paper sx={{ p: 6, borderRadius: 2, maxWidth: 800, margin: 'auto' }} variant="outlined">
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={6}>
                                <Typography variant="h4" fontWeight="800" color="primary">INVOICE</Typography>
                                <Chip label={`ID: ${generatedInvoice.invoice_number}`} color="success" variant="outlined" />
                            </Box>
                            
                            <Grid container spacing={4} mb={6}>
                                <Grid item xs={6}>
                                    <Typography variant="subtitle2" color="text.secondary">BILLED TO</Typography>
                                    <Typography variant="h6" fontWeight="bold">{selectedCustomer.name}</Typography>
                                    <Typography variant="body2">{selectedCustomer.address}</Typography>
                                    <Typography variant="body2">PAN: {selectedCustomer.pan}</Typography>
                                    <Typography variant="body2">GSTIN: {selectedCustomer.gstin || 'Unregistered'}</Typography>
                                </Grid>
                                <Grid item xs={6} textAlign="right">
                                    <Typography variant="subtitle2" color="text.secondary">ISSUING DATE</Typography>
                                    <Typography variant="body1" fontWeight="bold">{new Date().toLocaleDateString()}</Typography>
                                </Grid>
                            </Grid>

                            <TableContainer component={Box} sx={{ mb: 4, borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
                                <Table>
                                    <TableHead sx={{ bgcolor: 'action.hover' }}>
                                        <TableRow>
                                            <TableCell><b>ITEM DESCRIPTION</b></TableCell>
                                            <TableCell align="center"><b>QTY</b></TableCell>
                                            <TableCell align="right"><b>UNIT RATE</b></TableCell>
                                            <TableCell align="right"><b>EXT TOTAL</b></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {activeCartArray.map((row) => (
                                            <TableRow key={row.item.id}>
                                                <TableCell>{row.item.name}</TableCell>
                                                <TableCell align="center">{row.qty}</TableCell>
                                                <TableCell align="right">₹{row.item.price}</TableCell>
                                                <TableCell align="right">₹{row.item.price * row.qty}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            <Box display="flex" justifyContent="flex-end" mb={6}>
                                <Box minWidth={300}>
                                    <Box display="flex" justifyContent="space-between" mb={1}>
                                        <Typography color="text.secondary">Base Subtotal:</Typography>
                                        <Typography fontWeight="500">₹{subtotal.toFixed(2)}</Typography>
                                    </Box>
                                    <Box display="flex" justifyContent="space-between" mb={2}>
                                        <Typography color="text.secondary">Calculated GST ({taxRate}%):</Typography>
                                        <Typography fontWeight="500">₹{taxAmount.toFixed(2)}</Typography>
                                    </Box>
                                    <Divider sx={{ my: 1 }} />
                                    <Box display="flex" justifyContent="space-between" mt={2}>
                                        <Typography variant="h5" fontWeight="bold">Grand Total:</Typography>
                                        <Typography variant="h5" color="primary" fontWeight="bold">₹{grandTotal.toFixed(2)}</Typography>
                                    </Box>
                                </Box>
                            </Box>

                            <Box display="flex" justifyContent="center" gap={2}>
                                <Button variant="outlined" startIcon={<Print />}>PRINT INVOICE</Button>
                                <Button variant="contained" onClick={resetFlow} disableElevation>CREATE NEW BILL</Button>
                            </Box>
                        </Paper>
                    )}
                </>
            )}

            {/* MODALS */}
            
            {/* Customer Selection Modal */}
            <Dialog open={openCustomerModal} onClose={() => setOpenCustomerModal(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: 'bold' }}>Customer Designation Directory</DialogTitle>
                <DialogContent dividers sx={{ p: 0 }}>
                    <List sx={{ p: 0 }}>
                        {customers.map(c => {
                            const isInactive = c.is_active === false;
                            return (
                                <ListItemButton 
                                    key={c.id} 
                                    disabled={isInactive}
                                    onClick={() => { setSelectedCustomer(c); setOpenCustomerModal(false); }}
                                    sx={{ borderBottom: '1px solid', borderColor: 'divider', px: 3, py: 2 }}
                                >
                                    <ListItemText 
                                        primary={<Typography fontWeight="600" color={isInactive ? 'text.disabled' : 'text.primary'}>{c.name}</Typography>} 
                                        secondary={c.address || 'Unknown Region'} 
                                    />
                                    <Chip 
                                        label={isInactive ? 'INACTIVE' : 'ACTIVE'} 
                                        color={isInactive ? 'error' : 'success'} 
                                        size="small" 
                                        variant={isInactive ? 'outlined' : 'filled'} 
                                    />
                                </ListItemButton>
                            );
                        })}
                    </List>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setOpenCustomerModal(false)} color="inherit">Close</Button>
                </DialogActions>
            </Dialog>

            {/* Item Selection Modal */}
            <Dialog open={openItemModal} onClose={() => setOpenItemModal(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: 'bold' }}>Cart Tally Injector</DialogTitle>
                <DialogContent dividers sx={{ p: 0 }}>
                    <List sx={{ p: 0 }}>
                        {items.map(item => {
                            const isInactive = item.is_active === false;
                            const qty = tempCart[item.id] || 0;
                            
                            return (
                                <ListItem 
                                    key={item.id} 
                                    sx={{ borderBottom: '1px solid', borderColor: 'divider', px: 3, py: 2, opacity: isInactive ? 0.6 : 1 }}
                                >
                                    <ListItemText 
                                        primary={<Typography fontWeight="600">{item.name}</Typography>} 
                                        secondary={`Rate: ₹${item.price} ${isInactive ? ' (ITEM GLOBALLY SUSPENDED)' : ''}`} 
                                    />
                                    {!isInactive && (
                                        <Box display="flex" alignItems="center" gap={1}>
                                            <IconButton size="small" onClick={() => adjustTempCart(item.id, -1)} color="error"><Remove /></IconButton>
                                            <Typography fontWeight="bold" sx={{ minWidth: 30, textAlign: 'center' }}>{qty}</Typography>
                                            <IconButton size="small" onClick={() => adjustTempCart(item.id, 1)} color="primary"><Add /></IconButton>
                                        </Box>
                                    )}
                                </ListItem>
                            );
                        })}
                    </List>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setOpenItemModal(false)} color="inherit">Cancel Addition</Button>
                    <Button onClick={confirmItems} variant="contained" disableElevation>CONFIRM ASSETS</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Billing;
