import { Box, TextField, Button, Grid } from '@mui/material';

const ReusableForm = ({ fields, onSubmit, submitText = 'Submit' }) => {
    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);
        onSubmit(data);
    };

    return (
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <Grid container spacing={2}>
                {fields.map((field, idx) => (
                    <Grid item xs={12} sm={field.halfWidth ? 6 : 12} key={idx}>
                        <TextField
                            fullWidth
                            id={field.name}
                            name={field.name}
                            label={field.label}
                            type={field.type || 'text'}
                            required={field.required}
                            defaultValue={field.defaultValue || ''}
                            SelectProps={field.select ? { native: true } : undefined}
                            select={field.select}
                        >
                            {field.select && field.options && field.options.map(opt => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </TextField>
                    </Grid>
                ))}
            </Grid>
            <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, padding: '10px 0', fontWeight: 600 }}
            >
                {submitText}
            </Button>
        </Box>
    );
};

export default ReusableForm;
