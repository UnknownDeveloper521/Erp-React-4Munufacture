import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { PrivateRoute } from './shared/components/common';
import { Login, Signup } from './pages/auth';
import { MainLayout } from './shared/components/layout';
import { ViewProfile, AccountSettings, ChangePassword } from './pages/profile';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Main application modules with nested routes */}
            <Route 
              path="/dashboard" 
              element={
                <PrivateRoute>
                  <MainLayout />
                </PrivateRoute>
              } 
            />
            
            {/* HR Module Routes */}
            <Route 
              path="/hr" 
              element={
                <PrivateRoute>
                  <MainLayout />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/hr/all-employees" 
              element={
                <PrivateRoute>
                  <MainLayout />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/hr/attendance" 
              element={
                <PrivateRoute>
                  <MainLayout />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/hr/leave-requests" 
              element={
                <PrivateRoute>
                  <MainLayout />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/hr/payroll" 
              element={
                <PrivateRoute>
                  <MainLayout />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/hr/performance" 
              element={
                <PrivateRoute>
                  <MainLayout />
                </PrivateRoute>
              } 
            />
            
            {/* Users Module Routes */}
            <Route 
              path="/users" 
              element={
                <PrivateRoute>
                  <MainLayout />
                </PrivateRoute>
              } 
            />
            
            {/* Inventory Module Routes */}
            <Route 
              path="/inventory" 
              element={
                <PrivateRoute>
                  <MainLayout />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/inventory/stock" 
              element={
                <PrivateRoute>
                  <MainLayout />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/inventory/transfers" 
              element={
                <PrivateRoute>
                  <MainLayout />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/inventory/adjustments" 
              element={
                <PrivateRoute>
                  <MainLayout />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/inventory/reports" 
              element={
                <PrivateRoute>
                  <MainLayout />
                </PrivateRoute>
              } 
            />
            
            {/* Future Module Routes (Coming Soon) */}
            <Route 
              path="/finance" 
              element={
                <PrivateRoute>
                  <MainLayout />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/crm" 
              element={
                <PrivateRoute>
                  <MainLayout />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/sales" 
              element={
                <PrivateRoute>
                  <MainLayout />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/supply" 
              element={
                <PrivateRoute>
                  <MainLayout />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/reports" 
              element={
                <PrivateRoute>
                  <MainLayout />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/documents" 
              element={
                <PrivateRoute>
                  <MainLayout />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/projects" 
              element={
                <PrivateRoute>
                  <MainLayout />
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
            <Route path="/" element={<Navigate to="/dashboard" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
