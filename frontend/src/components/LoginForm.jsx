import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:4000/cimr';

export default function Login() {
    const [formData, setFormData] = useState({
        numeroMatricule: '',
        telephone: '',
        numeroIdentite: ''
    });
    const [error, setError] = useState('');
    const [debugInfo, setDebugInfo] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setDebugInfo('');

        try {
            const response = await fetch(`${API_BASE_URL}/auth`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.message  || 'Une erreur est survenue lors de la connexion');
                }
                localStorage.setItem('token', data.token);
                navigate('/rendezvous');
            } else {
                const text = await response.text();
                setDebugInfo(`Réponse non-JSON reçue: ${text.substring(0, 100)}...`);
                throw new Error('Réponse inattendue du serveur');
            }
        } catch (e) {
            setError(e.message);
            console.error('Erreur de connexion:', e);
        }
    };

    return (
        <div id="loginForm">
            <section className="position-relative py-4 py-xl-5">
                <div className="container">
                    <div className="row mb-5">
                        <div className="col-md-8 col-xl-6 text-center mx-auto">
                            <h2>Prendre un rendez-vous</h2>
                            <p className="w-lg-50">Veuillez saisir les informations ci-dessous</p>
                        </div>
                    </div>
                    <div className="row d-flex justify-content-center">
                        <div className="col-md-6 col-xl-4">
                            <div className="card mb-5">
                                <div className="card-body d-flex flex-column align-items-center form">
                                    <form className="text-center" onSubmit={handleSubmit}>
                                        {error && <div className="alert alert-danger">{error}</div>}
                                        {debugInfo && <div className="alert alert-info">{debugInfo}</div>}
                                        <div className="mb-3">
                                            <input
                                                className="form-control"
                                                type="text"
                                                name="numeroMatricule"
                                                placeholder="Matricule"
                                                value={formData.numeroMatricule}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <input
                                                className="form-control"
                                                type="tel"
                                                name="telephone"
                                                placeholder="Téléphone"
                                                value={formData.telephone}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <input
                                                className="form-control"
                                                type="text"
                                                name="numeroIdentite"
                                                placeholder="Numéro d'identité"
                                                value={formData.numeroIdentite}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <button className="btn btn-primary d-block w-100" type="submit">
                                                Se connecter
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}