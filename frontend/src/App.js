import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import ControlPanel from './components/ControlPanel';
import Profile from './components/Profile';
import Orders from './components/Orders';
import RecoverAccount from './components/RecoverAccount';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset-password" element={<RecoverAccount />} />
        <Route path="/control-panel" element={<ControlPanel />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/orders" element={<Orders />} />
      </Routes>
    </Router>
  );
}
export default App;
