import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Captcha from "../Captcha";

const typesIdentite = [
    "Carte Nationale d'Identité",
    "Passeport",
    "Permis de conduire"
];

const API_BASE_URL = 'http://localhost:4000/cimr';

export default function Information2() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        numero_telephone: '',
        type_identite: '',
        numero_identite: ''
    });

    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [captchaValid, setCaptchaValid] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
        // Clear error when user starts typing
        setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.email.trim()) {
            newErrors.email = 'L\'email est requis';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Format d\'email invalide';
        }

        if (!formData.numero_telephone.trim()) {
            newErrors.numero_telephone = 'Le numéro de téléphone est requis';
        } else if (!/^\+\d{10,}$/.test(formData.numero_telephone)) {
            newErrors.numero_telephone = 'Le numéro de téléphone doit commencer par + et contenir au moins 10 chiffres';
        }


        if (!formData.type_identite) {
            newErrors.type_identite = 'Le type d\'identité est requis';
        }

        if (!formData.numero_identite.trim()) {
            newErrors.numero_identite = 'Le numéro d\'identité est requis';
        } else {
            const regex = /^([a-z]{2}\d{6}|\d{8})$/;
            if (!regex.test(formData.numero_identite)) {
                newErrors.numero_identite = 'Le numéro d\'identité doit être composé de 2 lettres suivies de 6 chiffres ou de 8 chiffres';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm() || !captchaValid) {
            return;
        }
        setIsLoading(true);

        try {
            const affilieData1 = JSON.parse(localStorage.getItem('affilieData1') || '{}');
            const affilieData = {
                ...affilieData1,
                ...formData
            };

            const response = await axios.post(`${API_BASE_URL}/register`, affilieData);

            if (response.data.token && response.data.affilie) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('affilieInfo', JSON.stringify(response.data.affilie));
                localStorage.removeItem('affilieData1');
                navigate('/register/information/personnel');
            } else {
                throw new Error("Réponse invalide du serveur");
            }
        } catch (error) {
            console.error('Erreur lors de la création de l\'affilié:', error);
            setErrors(prevErrors => ({
                ...prevErrors,
                submit: error.response?.data?.message || 'Une erreur est survenue lors de la création de l\'affilié'
            }));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div id="page_information2">
            <section className="position-relative py-4 py-xl-5">
                <div className="container">
                    <div className="row mb-5">
                        <div className="col-md-8 col-xl-6 text-center mx-auto">
                            <p className="w-lg-50">Veuillez saisir les informations complémentaires ci-dessous</p>
                        </div>
                    </div>
                    <div className="row d-flex justify-content-center">
                        <div className="col-md-6 col-xl-4">
                            <div className="card mb-5">
                                <div className="card-body d-flex flex-column align-items-center">
                                    <form className="text-center w-100" onSubmit={handleSubmit}>
                                        {errors.submit && <div className="alert alert-danger">{errors.submit}</div>}
                                        <div className="mb-3">
                                            <input
                                                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                                type="email"
                                                name="email"
                                                placeholder="Email"
                                                value={formData.email}
                                                onChange={handleChange}
                                            />
                                            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                                        </div>
                                        <div className="mb-3">
                                            <input
                                                className={`form-control ${errors.numero_telephone ? 'is-invalid' : ''}`}
                                                type="tel"
                                                name="numero_telephone"
                                                placeholder="Téléphone (ex: +33123456789)"
                                                value={formData.numero_telephone}
                                                onChange={handleChange}
                                            />
                                            {errors.numero_telephone && <div className="invalid-feedback">{errors.numero_telephone}</div>}
                                        </div>
                                        <div className="mb-3">
                                            <select
                                                className={`form-control ${errors.type_identite ? 'is-invalid' : ''}`}
                                                name="type_identite"
                                                value={formData.type_identite}
                                                onChange={handleChange}
                                            >
                                                <option value="">Sélectionnez le type d'identité</option>
                                                {typesIdentite.map((type, index) => (
                                                    <option key={index} value={type}>
                                                        {type}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.type_identite && <div className="invalid-feedback">{errors.type_identite}</div>}
                                        </div>
                                        <div className="mb-3">
                                            <input
                                                className={`form-control ${errors.numero_identite ? 'is-invalid' : ''}`}
                                                type="text"
                                                name="numero_identite"
                                                placeholder="Numéro d'identité"
                                                value={formData.numero_identite}
                                                onChange={handleChange}
                                            />
                                            {errors.numero_identite && <div className="invalid-feedback">{errors.numero_identite}</div>}
                                        </div>
                                        <div className="mb-3">
                                            <Captcha onValidate={setCaptchaValid} />
                                        </div>
                                        <div className="mb-3">
                                            <button
                                                className="btn btn-primary d-block w-100"
                                                type="submit"
                                                disabled={isLoading || !captchaValid}
                                            >
                                                {isLoading ? 'Chargement...' : 'Soumettre'}
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