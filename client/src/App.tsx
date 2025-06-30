import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/App.css';

// Import pages (to be created)
import HomePage from './pages/HomePage';
import MapPage from './pages/MapPage';
import RoutesPage from './pages/RoutesPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/routes" element={<RoutesPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App; 