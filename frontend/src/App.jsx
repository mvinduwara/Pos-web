import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import PosTerminal from './pages/PosTerminal';
import Inventory from './pages/Inventory';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import usePosStore from './store/usePosStore';
import Transactions from './pages/Transactions';

const AdminRoute = ({ children }) => {
  const user = usePosStore((state) => state.user);
  if (!user) return <Navigate to="/login" />;
  if (user.role !== 'admin') return <Navigate to="/pos" />; 
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        
        <Route path="/dashboard" element={<AdminRoute><Dashboard /></AdminRoute>} />
        <Route path="/inventory" element={<AdminRoute><Inventory /></AdminRoute>} />
        <Route path="/users" element={<AdminRoute><Users /></AdminRoute>} />
        <Route path="/transactions" element={<AdminRoute><Transactions /></AdminRoute>} />
   
        <Route path="/pos" element={<PosTerminal />} />
      </Routes>
    </Router>
  );
}

export default App;