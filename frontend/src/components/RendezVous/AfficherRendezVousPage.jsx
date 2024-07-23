import React from "react";
import { useNavigate } from "react-router-dom";
export default function AfficherRendezVousPage() {
    const navigate = useNavigate();
    const handleDeconection = () => {
        navigate('/login');
        localStorage.removeItem('tokenCIMR');
    }
    return (
        <div className="container py-4">
            <h1 className="text-center mb-5">Mes Rendez-vous</h1>

            <div className="row gy-4">
                {[1, 2, 3].map((appointmentId) => (
                    <div key={appointmentId} className="col-md-4">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Rendez-vous #{appointmentId}</h5>
                                <p className="card-text">Date: 01/08/2023</p>
                                <p className="card-text">Heure: 14:00</p>
                                <p className="card-text">Service: Consultation</p>
                                <div className="d-flex justify-content-between">
                                    <button className="btn btn-primary" onClick={() => console.log(`Modifier ${appointmentId}`)}>
                                        Modifier
                                    </button>
                                    <button className="btn btn-danger" onClick={() => console.log(`Annuler ${appointmentId}`)}>
                                        Annuler
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="text-center mt-5">
                <button className="btn btn-success btn-lg" onClick={() => console.log('Nouveau rendez-vous')}>
                    Prendre un nouveau rendez-vous
                </button>
            </div>
            <div className="text-center mt-5">
                <button className="btn btn-success btn-lg" onClick={handleDeconection}>
                    Deconnection
                </button>
            </div>

            <a className="btn btn-secondary position-fixed bottom-0 end-0 m-3" href="#top">
                <i className="fas fa-angle-up"></i>
            </a>
        </div>
    );
}