import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import './style/global.scss';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

import LoginForm from './components/LoginForm';
import AuthRoute from './components/AuthRoute';
import Rendezvous from './components/RendezVous/Rendezvous';
import Register from './components/Register/Register';
import NavBar from './components/NavBar';
import AutoLoginRoute from './components/autoLoginRoute';

function Main() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/*" element={
          <Navigate to="/login" />
        } />
        <Route path="/login" element={
          <AutoLoginRoute>
            <LoginForm />
          </AutoLoginRoute>
        } />
        <Route path="/register/*" element={
            <Register />
        } />
        <Route
          path="/rendezvous/*" element={
            <AuthRoute>
              <Rendezvous />
            </AuthRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default Main;
