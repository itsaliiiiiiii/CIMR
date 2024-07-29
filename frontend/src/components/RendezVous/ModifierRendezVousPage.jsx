import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { jsPDF } from "jspdf";
import { parseISO, format, isWeekend, startOfToday, isBefore } from 'date-fns';

import Notification from "../Nofitication";

const API_BASE_URL = "http://localhost:4000/cimr";

export default function ModifierRendezVousPage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [formData, setFormData] = useState({
        date_rdv: '',
        heure_rdv: '',
        type_service: '',
        agence: '',
        etat_rdv: '',
        nom: '',
        prenom: '',
        telephone: '',
        date_naissance: '',
        pays: '',
        ville: '',
        numero_identite: '',
        type_identite: ''
    });
    const [initialFormData, setInitialFormData] = useState({});
    const [isFormModified, setIsFormModified] = useState(false);

    const [agences, setAgences] = useState([]);
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [appointmentModified, setAppointmentModified] = useState(false);

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
                    const rendezVous = response.data.rendezVous;
                    const parsedDate = parseISO(rendezVous.date_rdv);
                    const formattedData = {
                        ...rendezVous,
                        date_rdv: format(parsedDate, 'yyyy-MM-dd'),
                        heure_rdv: rendezVous.heure_rdv.slice(0, 5),
                    };
                    setFormData(formattedData);
                    setInitialFormData(formattedData);

                    // Fetch affilie data
                    const affilieResponse = await axios.get(`${API_BASE_URL}/affilie`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });

                    if (affilieResponse.data.isValid && affilieResponse.data.affilie) {
                        const updatedData = {
                            ...formattedData,
                            nom: affilieResponse.data.affilie.nom,
                            prenom: affilieResponse.data.affilie.prenom,
                            telephone: affilieResponse.data.affilie.telephone,
                            date_naissance: affilieResponse.data.affilie.date_naissance,
                            pays: affilieResponse.data.affilie.pays,
                            ville: affilieResponse.data.affilie.ville,
                            numero_identite: affilieResponse.data.affilie.numero_identite,
                            type_identite: affilieResponse.data.affilie.type_identite
                        };
                        setFormData(updatedData);
                        setInitialFormData(updatedData);
                    }
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

        const updatedFormData = { ...formData, [name]: value };
        setIsFormModified(JSON.stringify(updatedFormData) !== JSON.stringify(initialFormData));
    };

    const validateForm = () => {
        const newErrors = {};
        const today = startOfToday();

        if (!formData.date_rdv) {
            newErrors.date_rdv = 'La date est requise';
        } else {
            const selectedDate = parseISO(formData.date_rdv);
            if (isBefore(selectedDate, today)) {
                newErrors.date_rdv = 'La date doit être dans le futur';
            } else if (isWeekend(selectedDate)) {
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
        if (!validateForm() || !isFormModified) {
            return;
        }
        setLoading(true);

        try {
            const token = localStorage.getItem('tokenCIMR');
            if (!token) {
                throw new Error('No authentication token found');
            }

            const submissionData = {
                ...formData,
                date_rdv: format(parseISO(formData.date_rdv), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx")
            };

            const response = await axios.put(`${API_BASE_URL}/rendez-vous/${id}/modifier`, submissionData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data.isValid) {
                setAppointmentModified(true);
            } else {
                throw new Error('Failed to update appointment');
            }
        } catch (error) {
            console.error('Error updating appointment:', error);
            if (error.response && error.response.data && error.response.data.message == "full") {
                setErrors(prevErrors => ({
                    ...prevErrors,
                    submit: "Choisir une autre date ou heure de rendez-vous, l'heure est déjà prise."
                }));
            } else if (error.response && error.response.data && error.response.data.message == "inscription") {
                setErrors(prevErrors => ({
                    ...prevErrors,
                    submit: "il est obligatoire de choisir 'POSER LES DOCUMENTS D'INSCRIPTION', vous devez d'abord déposer les documents d'inscription."
                }));
            } else {
                setErrors(prevErrors => ({
                    ...prevErrors,
                    submit: 'Une erreur est survenue lors de la modification du rendez-vous. Veuillez réessayer.'
                }));
            }
        } finally {
            setLoading(false);
        }
    };

    const downloadAppointmentInfo = () => {
        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.text("Informations de Rendez-vous", 10, 10);
        doc.setFontSize(12);
        doc.text(`Nom: ${formData.nom}`, 10, 30);
        doc.text(`Prenom: ${formData.prenom}`, 10, 40);
        doc.text(`Telephone: ${formData.telephone}`, 10, 50);
        doc.text(`Pays: ${formData.pays}`, 10, 60);
        doc.text(`Ville: ${formData.ville}`, 10, 70);
        doc.text(`Numero d'identite: ${formData.numero_identite}`, 10, 80);
        doc.text(`Type d'identite: ${formData.type_identite}`, 10, 90);
        doc.text(`Date de rendez-vous: ${formData.date_rdv}`, 10, 100);
        doc.text(`Heure de rendez-vous: ${formData.heure_rdv}`, 10, 110);
        doc.text(`Service: ${formData.type_service}`, 10, 120);
        doc.text(`Agence: ${formData.agence}`, 10, 130);
        doc.save("informations_rendez_vous_modifie.pdf");
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
        <>
            {appointmentModified && <Notification message="Rendez-vous modifié avec succès" />}
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
                                            min={format(new Date(), 'yyyy-MM-dd')}
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
                                        <button
                                            type="submit"
                                            className="btn btn-primary"
                                            disabled={loading || appointmentModified || !isFormModified}
                                        >
                                            {loading ? 'Modification en cours...' : 'Modifier le rendez-vous'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-8 my-2">
                        <div className="card shadow">
                            <div className="card-body">
                                <div className="d-grid gap-2">
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={downloadAppointmentInfo}
                                        disabled={!appointmentModified}
                                    >
                                        Telecharger rendez-vous modifié
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary"
                                        onClick={() => navigate('/rendezvous')}
                                    >
                                        Annuler
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}