import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const ReusableTable = ({ columns, data }) => {
    return (
        <TableContainer component={Paper} elevation={0} variant="outlined" sx={{ borderRadius: 2 }}>
            <Table sx={{ minWidth: 650 }}>
                <TableHead sx={{ backgroundColor: 'action.hover' }}>
                    <TableRow>
                        {columns.map((col, index) => (
                            <TableCell key={index} align={col.align || 'left'} sx={{ fontWeight: 600 }}>
                                {col.label}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((row, rowIndex) => (
                        <TableRow key={rowIndex} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            {columns.map((col, colIndex) => (
                                <TableCell key={colIndex} align={col.align || 'left'}>
                                    {col.render ? col.render(row) : row[col.field]}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default ReusableTable;
