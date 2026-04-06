import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Billing from './pages/Billing.jsx';
import MasterHome from './pages/master/MasterHome.jsx';
import CustomerMaster from './pages/master/CustomerMaster.jsx';
import AddCustomer from './pages/master/AddCustomer.jsx';
import ItemsMaster from './pages/master/ItemsMaster.jsx';
import AddItem from './pages/master/AddItem.jsx';
import InvoiceDetails from './pages/InvoiceDetails.jsx';
import { Box } from '@mui/material';

function App() {
  return (
    <Router>
      <Box sx={{ display: 'flex', minHeight: '100vh', width: '100vw' }}>
        <Sidebar />
        <Box component="main" sx={{ flexGrow: 1, p: 4, backgroundColor: 'background.default', overflow: 'auto' }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/billing" element={<Billing />} />
            <Route path="/invoice/:id" element={<InvoiceDetails />} />
            <Route path="/master" element={<MasterHome />} />
            <Route path="/master/customers" element={<CustomerMaster />} />
            <Route path="/master/customers/add" element={<AddCustomer />} />
            <Route path="/master/items" element={<ItemsMaster />} />
            <Route path="/master/items/add" element={<AddItem />} />
          </Routes>
        </Box>
      </Box>
    </Router>
  );
}

export default App;
