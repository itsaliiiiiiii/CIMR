import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Information1 from './information1';
import Information2 from './information2';
import Information3 from './information3';
import Information from './information';

export default function Register() {
    return (
        <Routes>
            <Route path="/information1" element={<Information1 />} />
            <Route path="/information2" element={<Information2 />} />
            <Route path="/information3" element={<Information3 />} />
            <Route path="/information" element={<Information />} />
        </Routes>
    );
}