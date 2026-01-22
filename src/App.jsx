import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AdminPortal from './pages/AdminPortal';
import Dashboard from './pages/Dashboard';
import TestInterface from './pages/TestInterface';
import Results from './pages/Results';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/admin" element={<AdminPortal />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/test" element={<TestInterface />} />
          <Route path="/results/:testId" element={<Results />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
