import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jsPDF } from "jspdf";

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
            const appointmentsResponse = await axios.get(`${API_BASE_URL}/rendez-vous`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

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



    const handleModifierButton = (appointmentId) => () => {
        navigate(`/rendezvous/modification/${appointmentId}`);
    };

    const handleAnnuleButton = (appointmentId) => async () => {
        const token = localStorage.getItem('tokenCIMR');
        if (!token) {
            navigate('/login');
            return;
        }
        try {
            const response = await axios.put(`${API_BASE_URL}/rendez-vous/${appointmentId}/annuler`, {}, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.data.isValid) {
                setAppointments(appointments.map((appointment) => {
                    if (appointment.numero_rdv === appointmentId) {
                        return { ...appointment, etat_rdv: 'Annulé' };
                    }
                    return appointment;
                }));
            } else {
                throw new Error('Invalid data received from server');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            setError('Une erreur est survenue lors de l\'annulation du rendez-vous.');
        }
    }

    const getBadgeClass = (status) => {
        switch (status) {
            case 'Prévu':
                return (<span className={`badge bg-primary`}>
                    {"Rendez-vous à venir"}
                </span>)
            case 'Annulé':
                return (<span className={`badge bg-danger`}>
                    {"Annulé"}
                </span>)
            case 'Manqué':
                return (
                    <>
                        <span className={`badge bg-secondary`}>
                            {"Rendez-vous passé"}
                        </span>
                        <span className={`badge bg-warning mx-1`}>
                            {"Manqué"}
                        </span>

                    </>
                )

            case 'Terminé':
                return (
                    <>
                        <span className={`badge bg-secondary`}>
                            {"Rendez-vous passé"}
                        </span>
                        <span className={`badge bg-success mx-1`}>
                            {"Terminé"}
                        </span>
                    </>)
            default:
                return (<span className={`badge bg-secondary`}>
                    {"Erreur"}
                </span>);
        }
    };

    const downloadAppointmentInfo = (appointment) => {
        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.text("Informations de Rendez-vous", 10, 10);
        doc.setFontSize(12);
        doc.text(`Nom: ${appointment.nom}`, 10, 20);
        doc.text(`Prénom: ${appointment.prenom}`, 10, 30);
        doc.text(`Téléphone: ${appointment.numero_telephone}`, 10, 40);
        doc.text(`Type d'identité: ${appointment.type_identite}`, 10, 50);
        doc.text(`Numéro d'identité: ${appointment.numero_identite}`, 10, 60);
        doc.text(`Matricule: ${appointment.numero_matricule}`, 10, 70);
        doc.text(`Date du rendez-vous: ${appointment.date_rdv} - ${appointment.heure_rdv}`, 10, 80);
        doc.text(`Agence: ${appointment.agence}`, 10, 90);
        doc.text(`Type de service: ${appointment.type_service}`, 10, 100);

        doc.save(`informations_rendez_vous_${appointment.numero_rdv}.pdf`);
    };

    return (
        <>
            <h2 className="mb-4">Mes Rendez-vous</h2>
            <div className="row g-4" id="rendezvous">
                {appointments.length === 0 ? <p>Aucun rendez-vous</p> : null}

                {appointments.map((appointment) => {
                    const appointmentDate = new Date(appointment.date_rdv);

                    const formattedDate = appointmentDate.toLocaleDateString('fr-FR', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                    });
                    return (
                        <div key={appointment.numero_rdv} className="col-md-6">
                            <div className="card h-100 shadow-sm">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <h5 className="card-title mb-0">Rendez-vous</h5>
                                        { appointment.etat_rdv === 'Prévu' &&
                                        <button
                                            className="btn btn-outline-primary btn-sm rounded-circle button-download" 
                                            onClick={() => downloadAppointmentInfo(appointment)}
                                            title="Télécharger les informations"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"  className="bi bi-download" viewBox="0 0 16 16">
                                                <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z" />
                                                <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z" />
                                            </svg>
                                        </button>}
                                    </div>
                                    <p className="card-text"><strong>Date:</strong> {formattedDate}</p>
                                    <p className="card-text"><strong>Heure:</strong> {appointment.heure_rdv}</p>
                                    <p className="card-text"><strong>Agence:</strong> {appointment.agence}</p>
                                    <p className="card-text"><strong>Service:</strong> {appointment.type_service}</p>
                                    <p className="card-text">
                                        {getBadgeClass(appointment.etat_rdv)}
                                    </p>

                                </div>
                                {appointment.etat_rdv === 'Prévu' && (
                                    <div className="card-footer bg-transparent border-0">
                                        <div className="d-flex justify-content-between">
                                            <button className="btn btn-primary" onClick={handleModifierButton(appointment.numero_rdv)}>
                                                Modifier
                                            </button>
                                            <button className="btn btn-sm btn-outline-danger" onClick={handleAnnuleButton(appointment.numero_rdv)}>
                                                Annulé le rendez-vous
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </>
    );
}
