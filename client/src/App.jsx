import { BrowserRouter, Routes, Route } from 'react-router-dom';
import WorkerDashboard from './component/Dashboard.jsx'; // Renamed for clarity
import AdminDashboard from './component/AdminDashboard.jsx';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Route for the Worker Dashboard */}
        <Route path="/" element={<WorkerDashboard />} />

        {/* Route for the new Admin Dashboard */}
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;