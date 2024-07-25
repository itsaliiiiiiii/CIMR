import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = "http://localhost:4000/cimr";

export default function AfficherRendezVousPage() {
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState([]);
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
            const appointmentsResponse = await
                axios.get(`${API_BASE_URL}/rendez-vous`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                })

            if (appointmentsResponse.data.isValid) {
                setAppointments(appointmentsResponse.data.rendezVous || []);
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

    if (loading) return <div>Chargement...</div>;
    if (error) return <div>{error}</div>;

    return (
        <>
            <h2 className="mb-4">Mes Rendez-vous</h2>
            <div className="row g-4" id="rendezvous">
                {appointments.map((appointment) => (
                    <div key={appointment.numero_rdv} className="col-md-6">
                        <div className="card h-100 shadow-sm">
                            <div className="card-body">
                                <h5 className="card-title">Rendez-vous</h5>
                                <p className="card-text"><strong>Date:</strong> {appointment.date_rdv}</p>
                                <p className="card-text"><strong>Heure:</strong> {appointment.heure_rdv}</p>
                                <p className="card-text"><strong>Service:</strong> {appointment.type_service}</p>
                            </div>
                            <div className="card-footer bg-transparent border-0">
                                <div className="d-flex justify-content-between">
                                    <button className="btn btn-sm btn-outline-primary" onClick={() => console.log(`Modifier ${appointment.id}`)}>
                                        Modifier
                                    </button>
                                    <button className="btn btn-sm btn-outline-danger" onClick={() => console.log(`Annuler ${appointment.id}`)}>
                                        Supprimer
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>

    );
}