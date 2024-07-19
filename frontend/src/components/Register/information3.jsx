import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 

const agences = [
    "Agence Paris Centre",
    "Agence Lyon",
    "Agence Marseille",
    "Agence Bordeaux",
    "Agence Lille",
    "Agence Strasbourg"
];

const API_BASE_URL = 'http://localhost:5000/cimr';

export default function Information3() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        dateRendezVous: '',
        agence: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const affilieData1 = JSON.parse(localStorage.getItem('affilieData1') || '{}');
            const affilieData2 = JSON.parse(localStorage.getItem('affilieData2') || '{}');

            // Générer le matricule
            const matriculeResponse = await axios.get(`${API_BASE_URL}/generateMatricule`);
            const matricule = matriculeResponse.data.matricule;

            if (!matricule) {
                throw new Error("Impossible de générer un numéro de matricule");
            }

            const affilieData = {
                ...affilieData1,
                ...affilieData2,
                numeroMatricule: matricule,
                statutDocuments: 'en_attente'
            };

            // Créer l'affilié
            await axios.post(`${API_BASE_URL}/affilie`, affilieData);

            const rendezVousData = {
                numeroMatricule: matricule,
                ...formData,
                typeService: "poser les documents d'inscription"
            };

            // Créer le rendez-vous
            await axios.post(`${API_BASE_URL}/rendez-vous`, rendezVousData);

            localStorage.setItem('affilieData3', JSON.stringify({ ...formData, numeroMatricule: matricule }));
            navigate('/information');
        } catch (error) {
            console.error('Erreur lors de la création de l\'affilié ou du rendez-vous:', error);
            setError(error.response?.data?.message || 'Une erreur est survenue lors de la création de l\'affilié ou du rendez-vous');
        } finally {
            setIsLoading(false);
        }
    };

    const getDayOfWeek = (dateString) => {
        const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
        const date = new Date(dateString);
        return days[date.getDay()];
    };

    return (
        <div id="page_information3">
            <section className="position-relative py-4 py-xl-5">
                <div className="container">
                    <div className="row mb-5">
                        <div className="col-md-8 col-xl-6 text-center mx-auto">
                            <h2>Prendre un rendez-vous</h2>
                            <p className="w-lg-50">Choisissez la date et l'agence pour déposer vos documents</p>
                        </div>
                    </div>
                    <div className="row d-flex justify-content-center">
                        <div className="col-md-6 col-xl-4">
                            <div className="card mb-5">
                                <div className="card-body d-flex flex-column align-items-center">
                                    <form className="text-center w-100" onSubmit={handleSubmit}>
                                        {error && <div className="alert alert-danger">{error}</div>}
                                        <div className="mb-3">
                                            <label htmlFor="dateRendezVous" className="form-label">Date du rendez-vous</label>
                                            <input
                                                className="form-control"
                                                type="date"
                                                id="dateRendezVous"
                                                name="dateRendezVous"
                                                value={formData.dateRendezVous}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        {formData.dateRendezVous && (
                                            <div className="mb-3">
                                                <p>Jour : {getDayOfWeek(formData.dateRendezVous)}</p>
                                            </div>
                                        )}
                                        <div className="mb-3">
                                            <label htmlFor="agence" className="form-label">Choisir une agence</label>
                                            <select
                                                className="form-control"
                                                id="agence"
                                                name="agence"
                                                value={formData.agence}
                                                onChange={handleChange}
                                                required
                                            >
                                                <option value="">Sélectionnez une agence</option>
                                                {agences.map((agence, index) => (
                                                    <option key={index} value={agence}>
                                                        {agence}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="mb-3">
                                            <button className="btn btn-primary d-block w-100" type="submit" disabled={isLoading}>
                                                {isLoading ? 'Chargement...' : 'Confirmer le rendez-vous'}
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