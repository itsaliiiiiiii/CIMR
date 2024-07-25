import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = "http://localhost:4000/cimr";

export default function AjouterRendezVousPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        date_rdv: '',
        heure_rdv: '',
        type_service: '',
        agence: '',
    });
    const [agences, setAgences] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
        setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
    };

    const validateForm = () => {
        const newErrors = {};
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (!formData.date_rdv) {
            newErrors.date_rdv = 'La date est requise';
        } else {
            const selectedDate = new Date(formData.date_rdv);
            if (selectedDate < today) {
                newErrors.date_rdv = 'La date doit être dans le futur';
            }
        }

        if (!formData.heure_rdv) {
            newErrors.heure_rdv = 'L\'heure est requise';
        }

        if (!formData.type_service) {
            newErrors.type_service = 'Le type de service est requis';
        }

        if (!formData.agence) {
            newErrors.agence = 'L\'agence est requise';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }
        setLoading(true);

        try {
            const token = localStorage.getItem('tokenCIMR');
            if (!token) {
                throw new Error('No authentication token found');
            }

            const response = await axios.post(`${API_BASE_URL}/rendez-vous`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data.isValid) {
                navigate('/rendezvous');
            } else {
                throw new Error('Failed to add appointment');
            }
        } catch (error) {
            console.error('Error adding appointment:', error);
            setErrors(prevErrors => ({
                ...prevErrors,
                submit: 'Une erreur est survenue lors de l\'ajout du rendez-vous. Veuillez réessayer.'
            }));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
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

    const generateTimeOptions = () => {
        const times = [];
        for (let hour = 0; hour < 24; hour++) {
            for (let minute = 0; minute < 60; minute += 15) {
                const timeString = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
                times.push(<option key={timeString} value={timeString}>{timeString}</option>);
            }
        }
        return times;
    };

    return (
        <div className="container py-5">
            <h2 className="mb-4">Ajouter un nouveau rendez-vous</h2>
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card shadow">
                        <div className="card-body">
                            {errors.submit && <div className="alert alert-danger">{errors.submit}</div>}
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="date_rdv" className="form-label">Date</label>
                                    <input
                                        type="date"
                                        className={`form-control ${errors.date_rdv ? 'is-invalid' : ''}`}
                                        id="date_rdv"
                                        name="date_rdv"
                                        value={formData.date_rdv}
                                        onChange={handleChange}
                                    />
                                    {errors.date_rdv && <div className="invalid-feedback">{errors.date_rdv}</div>}
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="heure" className="form-label">Heure</label>
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
                                    <label htmlFor="service" className="form-label">Service</label>
                                    <select
                                        className={`form-select ${errors.type_service ? 'is-invalid' : ''}`}
                                        id="service"
                                        name="type_service"
                                        value={formData.type_service}
                                        onChange={handleChange}
                                    >
                                        <option value="">Sélectionnez un service</option>
                                        <option value="Consultation">Consultation</option>
                                        <option value="Examen">Examen</option>
                                        <option value="Suivi">Suivi</option>
                                    </select>
                                    {errors.type_service && <div className="invalid-feedback">{errors.type_service}</div>}
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

                                <div className="d-grid gap-2">
                                    <button type="submit" className="btn btn-primary" disabled={loading}>
                                        {loading ? 'Ajout en cours...' : 'Ajouter le rendez-vous'}
                                    </button>
                                    <button type="button" className="btn btn-outline-secondary" onClick={() => navigate('/rendezvous')}>
                                        Annuler
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
