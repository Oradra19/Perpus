import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './page/Home'; 
import DetailBarang from './page/DetailBarang'; 
import Display from './page/Display'; 
import Login from './page/Login'; 
import Admin from './page/Admin'; 
import ProtectedRoute from './componen/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Home />} />
          <Route path="/DetailBarang/:id" element={<DetailBarang />} />
          <Route path="/Display" element={<Display />} />
      </Routes>
    </Router>
  );
}

export default App;