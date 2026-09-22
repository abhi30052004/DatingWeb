import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Discover from './pages/Discover';
import Layout from './components/Layout';

function App() {
  return (
    <>
      <Toaster position="top-center" toastOptions={{
        style: {
          background: '#1e293b',
          color: '#fff',
          border: '1px solid rgba(255,255,255,0.1)',
        }
      }} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected Routes (wrapped in Layout) */}
        <Route element={<Layout />}>
          <Route path="/discover" element={<Discover />} />
          <Route path="/matches" element={<div className="p-8">Matches Page (Coming Soon)</div>} />
          <Route path="/messages" element={<div className="p-8">Messages Page (Coming Soon)</div>} />
          <Route path="/profile" element={<div className="p-8">Profile Page (Coming Soon)</div>} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
