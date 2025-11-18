import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import MainLayout from './components/MainLayout';
import ViewProfile from './pages/ViewProfile';
import AccountSettings from './pages/AccountSettings';
import ChangePassword from './pages/ChangePassword';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Main application modules */}
            <Route 
              path="/dashboard" 
              element={
                <PrivateRoute>
                  <MainLayout initialModule="dashboard" />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/hr" 
              element={
                <PrivateRoute>
                  <MainLayout initialModule="hr" />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/users" 
              element={
                <PrivateRoute>
                  <MainLayout initialModule="users" />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/inventory" 
              element={
                <PrivateRoute>
                  <MainLayout initialModule="inventory" />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <PrivateRoute>
                  <ViewProfile />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/account-settings" 
              element={
                <PrivateRoute>
                  <AccountSettings />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/change-password" 
              element={
                <PrivateRoute>
                  <ChangePassword />
                </PrivateRoute>
              } 
            />
            <Route path="/" element={<Navigate to="/login" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
