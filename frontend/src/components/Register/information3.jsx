import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';



const API_BASE_URL = 'http://localhost:4000/cimr';

export default function Information3() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        date_rdv: '',
        agence: '',
        heure_rdv: '',
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [affilieInfo, setAffilieInfo] = useState(null);
    const [agences, setAgences] = useState([]);

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

        const fetchAgences = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/agence`);
                if (response.data && Array.isArray(response.data)) {
                    setAgences(response.data);
                } else {
                    setErrors(prevErrors => ({
                        ...prevErrors,
                        agence: 'Aucune agence trouvée'
                    }));
                }
            } catch (error) {
                setErrors(prevErrors => ({
                    ...prevErrors,
                    agence: 'Erreur lors de la récupération des agences'
                }));
            }
        }

        fetchAgences();
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

            } else if (selectedDate.getDay() === 0 || selectedDate.getDay() === 6) {
                newErrors.date_rdv = 'Les rendez-vous ne sont pas disponibles le weekend';
            }
        }

        if (!formData.agence) {
            newErrors.agence = 'L\'agence est requise';
        }

        if (!formData.heure_rdv) {
            newErrors.heure_rdv = 'Heure est requise';
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
            const token = localStorage.getItem('tokenCIMR');
            if (!token) {
                throw new Error("Token d'authentification non trouvé");
            }

            const rendezVousData = {
                numero_matricule: affilieInfo.numero_matricule,
                numero_identite: affilieInfo.numero_identite,
                id_affilie: affilieInfo.id_affilie,
                agence: formData.agence,
                date_rdv: formData.date_rdv,
                heure_rdv: formData.heure_rdv,
                type_service: "POSER LES DOCUMENTS D'INSCRIPTION"
            };

            await axios.post(`${API_BASE_URL}/rendez-vous`, rendezVousData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            localStorage.setItem('rendezVousInfo', JSON.stringify(formData));
            navigate('/register/information/rendezvous');
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message == "full") {
                setErrors(prevErrors => ({
                    ...prevErrors,
                    submit: "Choisir une autre date ou heure de rendez-vous, l'heure est déjà prise."
                }));
            } else {
                console.error('Erreur lors de la création du rendez-vous:', error);
                setErrors(prevErrors => ({
                    ...prevErrors,
                    submit: error.response?.data?.message || 'Une erreur est survenue lors de la création du rendez-vous'
                }));
            }
        } finally {
            setIsLoading(false);
        }
    };

    const generateTimeOptions = () => {
        const times = [];
        for (let hour = 8; hour < 16; hour++) {
            for (let minute = 0; minute < 60; minute += 15) {
                const timeString = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
                times.push(<option key={timeString} value={timeString}>{timeString}</option>);
            }
        }
        return times;
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
                                            <label htmlFor="heure_rdv" className="form-label">Heure du rendez-vous</label>
                                            <select
                                                className={`form-select ${errors.heure_rdv ? 'is-invalid' : ''}`}
                                                id="heure"
                                                name="heure_rdv"
                                                value={formData.heure_rdv}
                                                onChange={handleChange}
                                            >
                                                <option value="">Sélectionnez une heure</option>
                                                {generateTimeOptions()}
                                            </select>
                                            {errors.heure_rdv && <div className="invalid-feedback">{errors.heure_rdv}</div>}
                                        </div>

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
                                                {agences.map((agenceObj, index) => (
                                                    <option key={index} value={agenceObj.agence}>
                                                        {agenceObj.agence}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.agence && <div className="invalid-feedback">{errors.agence}</div>}
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="agence" className="form-label">Choisir Service</label>
                                            <select
                                                className={`form-control ${errors.service ? 'is-invalid' : ''}`}
                                                id="service"
                                                name="service"
                                                value={formData.service}
                                                onChange={handleChange}
                                            >
                                                <option value="POSER LES DOCUMENTS D'INSCRIPTION">POSER LES DOCUMENTS D'INSCRIPTION</option>
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
