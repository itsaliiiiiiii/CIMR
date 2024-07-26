import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = "http://localhost:4000/cimr";

export default function ModifierRendezVousPage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [formData, setFormData] = useState({
        date_rdv: '',
        heure_rdv: '',
        type_service: '',
        agence: '',
        etat_rdv: ''
    });

    const [agences, setAgences] = useState([]);
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchAppointmentData = async () => {
            try {
                const token = localStorage.getItem('tokenCIMR');
                if (!token) {
                    throw new Error('No authentication token found');
                }

                const response = await axios.get(`${API_BASE_URL}/rendez-vous/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.data) {
                    const rendezVous  = response.data.rendezVous;
                    console.log(rendezVous);
                    setFormData({
                        ...rendezVous,
                        date_rdv: rendezVous.date_rdv.split('T')[0], 
                        heure_rdv: rendezVous.heure_rdv.slice(0, 5), 

                    });
                    console.log(formData);
                } else {
                    throw new Error('Failed to fetch appointment data');
                }
            } catch (error) {
                console.error('Error fetching appointment data:', error);
                setErrors(prevErrors => ({
                    ...prevErrors,
                    fetch: 'Une erreur est survenue lors de la récupération des données du rendez-vous.'
                }));
            }
        };

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
        };

        const fetchServices = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/service`);
                if (response.data && Array.isArray(response.data)) {
                    setServices(response.data);
                } else {
                    setErrors(prevErrors => ({
                        ...prevErrors,
                        service: 'Aucun service trouvé'
                    }));
                }
            } catch (error) {
                setErrors(prevErrors => ({
                    ...prevErrors,
                    service: 'Erreur lors de la récupération des services'
                }));
            }
        };

        fetchAppointmentData();
        fetchAgences();
        fetchServices();
    }, [id]);

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
            } else if (selectedDate.getDay() === 0 || selectedDate.getDay() === 6) {
                newErrors.date_rdv = 'Les rendez-vous ne sont pas disponibles le weekend';
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

            const response = await axios.put(`${API_BASE_URL}/rendez-vous/${id}/modifier`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data.isValid) {
                navigate('/rendezvous', { state: { notification: 'Rendez-vous modifié avec succès' } });
            } else {
                throw new Error('Failed to update appointment');
            }
        } catch (error) {
            console.error('Error updating appointment:', error);
            setErrors(prevErrors => ({
                ...prevErrors,
                submit: 'Une erreur est survenue lors de la modification du rendez-vous. Veuillez réessayer.'
            }));
        } finally {
            setLoading(false);
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

    return (
        <div className="container py-5">
            <h2 className="mb-4">Modifier le rendez-vous</h2>
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card shadow">
                        <div className="card-body">
                            {errors.fetch && <div className="alert alert-danger">{errors.fetch}</div>}
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
                                        min={new Date().toISOString().split('T')[0]}
                                        onKeyDown={(e) => e.preventDefault()}
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
                                        className={`form-control ${errors.type_service ? 'is-invalid' : ''}`}
                                        id="service"
                                        name="type_service"
                                        value={formData.type_service}
                                        onChange={handleChange}
                                    >
                                        <option value="">Sélectionnez Service</option>
                                        {services.map((serviceObj, index) => (
                                            <option key={index} value={serviceObj.service}>
                                                {serviceObj.service}
                                            </option>
                                        ))}
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
                                        {loading ? 'Modification en cours...' : 'Modifier le rendez-vous'}
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