import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const agences = [
    "Agence Belvédère Casablanca",
    "Agence Centrale Casablanca",
    "Agence Marrakech",
    "Agence Rabat",
    "Agence Meknes",
    "Agence Fes",
    "Agence Tanger",
    "Agence Agadir",
    "Agence Oujda",
];

const API_BASE_URL = 'http://localhost:4000/cimr';

export default function Information3() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        date_rdv: '',
        agence: ''
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [affilieInfo, setAffilieInfo] = useState(null);

    useEffect(() => {
        const storedAffilieInfo = localStorage.getItem('affilieInfo');
        if (storedAffilieInfo) {
            setAffilieInfo(JSON.parse(storedAffilieInfo));
        } else {
            setErrors(prevErrors => ({
                ...prevErrors,
                affilieInfo: "Information d'affilié non trouvée. Veuillez vous inscrire d'abord."
            }));
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));

        // Clear error when user starts typing
        setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
    };

    const handleButtonPasManitenant = () => {
        navigate("/login");
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.date_rdv) {
            newErrors.date_rdv = 'La date de rendez-vous est requise';
        } else {
            const selectedDate = new Date(formData.date_rdv);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (selectedDate < today) {
                newErrors.date_rdv = 'La date de rendez-vous doit être dans le futur';
            }
        }

        if (!formData.agence) {
            newErrors.agence = 'L\'agence est requise';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrors({});

        if (!affilieInfo) {
            setErrors(prevErrors => ({
                ...prevErrors,
                affilieInfo: "Information d'affilié non trouvée. Veuillez vous inscrire d'abord."
            }));
            setIsLoading(false);
            return;
        }

        if (!validateForm()) {
            setIsLoading(false);
            return;
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error("Token d'authentification non trouvé");
            }

            const rendezVousData = {
                numero_matricule: affilieInfo.numero_matricule,
                numero_identite: affilieInfo.numero_identite,
                agence: formData.agence,
                date_rdv: formData.date_rdv,
                heure_rdv: null,
                type_service: "poser les documents d'inscription"
            };

            const response = await axios.post(`${API_BASE_URL}/rendez-vous`, rendezVousData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            console.log('Réponse du serveur:', response.data);

            localStorage.setItem('rendezVousInfo', JSON.stringify(formData));
            navigate('/register/information/rendezvous');
        } catch (error) {
            console.error('Erreur lors de la création du rendez-vous:', error);
            setErrors(prevErrors => ({
                ...prevErrors,
                submit: error.response?.data?.message || 'Une erreur est survenue lors de la création du rendez-vous'
            }));
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
                                        <div className="mb-3">
                                            <label htmlFor="date_rdv" className="form-label">Date du rendez-vous</label>
                                            <input
                                                className={`form-control ${errors.date_rdv ? 'is-invalid' : ''}`}
                                                type="date"
                                                id="date_rdv"
                                                name="date_rdv"
                                                value={formData.date_rdv}
                                                onChange={handleChange}
                                            />
                                            {errors.date_rdv && <div className="invalid-feedback">{errors.date_rdv}</div>}
                                        </div>
                                        {formData.date_rdv && (
                                            <div className="mb-3">
                                                <p>Jour : {getDayOfWeek(formData.date_rdv)}</p>
                                            </div>
                                        )}
                                        <div className="mb-3">
                                            <label htmlFor="agence" className="form-label">Choisir une agence</label>
                                            <select
                                                className={`form-control ${errors.agence ? 'is-invalid' : ''}`}
                                                id="agence"
                                                name="agence"
                                                value={formData.agence}
                                                onChange={handleChange}
                                            >
                                                <option value="">Sélectionnez une agence</option>
                                                {agences.map((agence, index) => (
                                                    <option key={index} value={agence}>
                                                        {agence}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.agence && <div className="invalid-feedback">{errors.agence}</div>}
                                        </div>
                                        <div className="mb-3">
                                            <button className="btn btn-primary d-block w-100" type="submit" disabled={isLoading}>
                                                {isLoading ? 'Chargement...' : 'Confirmer le rendez-vous'}
                                            </button>
                                        </div>
                                        {errors.affilieInfo && <div className="alert alert-danger">{errors.affilieInfo}</div>}
                                        {errors.submit && <div className="alert alert-danger">{errors.submit}</div>}
                                        <div className="mb-3">
                                            <a style={{ cursor: "pointer" }} onClick={handleButtonPasManitenant}>Pas Maintenant</a>
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
