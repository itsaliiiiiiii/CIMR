import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Information1 from './information1';
import Information2 from './information2';
import Information3 from './information3';
import Information from './informationpersonnel';
import InformationRendezVous from './informationrendezvous';
import AuthRoute from "../AuthRoute"

export default function Register() {
    return (
        <Routes>
            <Route path="/*" element={<Navigate to="/register/information1" />
            } />
            <Route path="/information1" element={<Information1 />} />
            <Route path="/information2" element={<Information2 />} />
            <Route path="/information/personnel" element={<Information />} />
            <Route path="/rendezvous" element={
                <AuthRoute>
                    <Information3 />
                </AuthRoute>
            } />
            <Route path="/information/rendezvous" element={<InformationRendezVous />} />
        </Routes>
    );
}