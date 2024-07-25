import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AfficherRendezVousPage from "./AfficherRendezVousPage"
import AjouterRendezVousPage from "./AjouterRendezVousPage";
import { Routes, Route } from "react-router-dom";

const API_BASE_URL = "http://localhost:4000/cimr";

export default function RendezVous() {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const token = localStorage.getItem('tokenCIMR');
        if (!token) {
            navigate('/login');
            return;
        }
        try {
            setLoading(true);
            const userResponse = await
                axios.get(`${API_BASE_URL}/affilie`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                })

            if (userResponse.data.isValid) {
                setUserData(userResponse.data.affilie);
            } else {
                throw new Error('Invalid data received from server');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            setError('Une erreur est survenue lors du chargement des données.');
            navigate('/login');
            localStorage.removeItem('tokenCIMR');
        } finally {
            setLoading(false);
        }
    };

    const handleDeconnection = () => {
        navigate('/login');
        localStorage.removeItem('tokenCIMR');
    };

    const handleAjout = () => {
        navigate('/rendezvous/reservation');
    }

    if (loading) return <div>Chargement...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="container py-5">
            <div className="row">
                <div className="col-lg-4 mb-4">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <h4 className="card-title mb-4">Informations personnelles</h4>
                            {userData && (
                                <ul className="list-unstyled">
                                    <li className="mb-2"><strong>Nom:</strong> {userData.nom}</li>
                                    <li className="mb-2"><strong>Prénom:</strong> {userData.prenom}</li>
                                    <li className="mb-2"><strong>Téléphone:</strong> {userData.numero_telephone}</li>
                                    <li className="mb-2"><strong>Email:</strong> {userData.email}</li>
                                    <li className="mb-2"><strong>Numéro d'identité:</strong> {userData.numero_identite}</li>
                                    <li className="mb-2"><strong>Pays:</strong> {userData.pays}</li>
                                    <li className="mb-2"><strong>Ville:</strong> {userData.ville}</li>
                                </ul>
                            )}
                        </div>
                        <div className="card-footer bg-transparent border-0">
                            <button className="btn btn-primary w-100 mb-2" onClick={handleAjout}>
                                Prendre un nouveau rendez-vous
                            </button>
                            <button className="btn btn-outline-danger w-100" onClick={handleDeconnection}>
                                Déconnexion
                            </button>
                        </div>
                    </div>
                </div>

                <div className="col-lg-8">
                    <Routes>
                        <Route path="/" element={<AfficherRendezVousPage />} />
                        <Route path="/reservation" element={<AjouterRendezVousPage />} />
                    </Routes>
                </div>
            </div>

            <a className="btn btn-secondary position-fixed bottom-0 end-0 m-3" href="#top">
                <i className="fas fa-angle-up"></i>
            </a>
        </div>
    );
}