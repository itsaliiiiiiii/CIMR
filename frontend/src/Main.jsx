import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import './style/global.scss';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

import LoginForm from './components/LoginForm';
import AuthRoute from './components/AuthRoute';
import AfficherRendezVousPage from './components/RendezVous/AfficherRendezVousPage';
import CreationRendezVousPage from './components/RendezVous/AjouterRendezVousPage';
import ModificationRendezVousPage from './components/RendezVous/ModifierRendezVousPage';
import Register from './components/Register/Register';
import NavBar from './components/NavBar';

function Main() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register/*" element={<Register />} />
        <Route
          path="/rendezvous" element={
            <AuthRoute>
              <AfficherRendezVousPage />
            </AuthRoute>
          }
        />
        <Route
          path="/reservation" element={
            <AuthRoute>
              <CreationRendezVousPage />
            </AuthRoute>
          }
        />
        <Route
          path="/modification" element={
            <AuthRoute>
              <ModificationRendezVousPage />
            </AuthRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default Main;
