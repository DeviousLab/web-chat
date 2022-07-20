import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import Home from './components/Home';
import Login from './components/Login';
import PrivateRoute from './components/PrivateRoute';
import Spinner from './components/Spinner';
import { CometProvider } from './context/CometContext';

function App() {
  return (
    <CometProvider>
      <Router>
        <Routes>
          <Route path="/" element={<PrivateRoute />} >
            <Route path="/" element={<Home />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
      <Spinner />
      <ToastContainer />
    </CometProvider>
  );
}

export default App;
