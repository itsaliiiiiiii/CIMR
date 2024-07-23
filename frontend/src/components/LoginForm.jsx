import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Captcha from './Captcha';

const API_BASE_URL = 'http://localhost:4000/cimr';

export default function Login() {
    const [formData, setFormData] = useState({
        numero_matricule: '',
        numero_telephone: '',
        numero_identite: ''
    });
    const [captchaValid, setCaptchaValid] = useState(false);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        // Clear error when user starts typing
        setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
    };

    const handleRegister = () => {
        navigate('/register/information1');
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.numero_matricule.trim()) {
            newErrors.numero_matricule = 'Le numéro de matricule est requis';
        }

        if (!formData.numero_telephone.trim()) {
            newErrors.numero_telephone = 'Le numéro de téléphone est requis';
        } else if (!/^\+\d+$/.test(formData.numero_telephone)) {
            newErrors.numero_telephone = 'Le numéro de téléphone doit commencer par + et ne contenir que des chiffres';
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
        setErrors({});

        if (!validateForm() || !captchaValid) {
            return;
        }

        setIsLoading(true);

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
                    throw new Error(data.message || 'Une erreur est survenue lors de la connexion');
                }
                localStorage.setItem('token', data.token);
                navigate('/rendezvous');
            } else {
                const text = await response.text();
                throw new Error('Réponse inattendue du serveur');
            }
        } catch (e) {
            setErrors(prevErrors => ({ ...prevErrors, submit: e.message }));
            console.error('Erreur de connexion:', e);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div id="loginForm">
            <section className="position-relative py-0 py-xl-0">
                <div className="container">
                    <div className="row mb-5">
                        <div className="col-md-8 col-xl-6 text-center mx-auto">
                            <p className="w-lg-50">Veuillez saisir les informations ci-dessous</p>
                        </div>
                    </div>
                    <div className="row d-flex justify-content-center">
                        <div className="col-md-6 col-xl-4">
                            <div className="card mb-5">
                                <div className="card-body d-flex flex-column align-items-center form">
                                    <form className="text-center" onSubmit={handleSubmit}>
                                        <div className="mb-3">
                                            <input
                                                className={`form-control ${errors.numero_matricule ? 'is-invalid' : ''}`}
                                                type="text"
                                                name="numero_matricule"
                                                placeholder="Matricule"
                                                value={formData.numero_matricule}
                                                onChange={handleChange}
                                            />
                                            {errors.numero_matricule && <div className="invalid-feedback">{errors.numero_matricule}</div>}
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
                                        <Captcha onValidate={setCaptchaValid} />
                                        <div className="mb-3">
                                            <button
                                                className="btn btn-primary d-block w-100"
                                                type="submit"
                                                disabled={isLoading || !captchaValid}
                                            >
                                                {isLoading ? 'Chargement...' : 'Se connecter'}
                                            </button>
                                        </div>
                                    </form>
                                    <a onClick={handleRegister} style={{ cursor: "pointer" }}>Créer un Compte ?</a>
                                </div>
                            </div>
                            {errors.submit && <div className="alert alert-danger">{errors.submit}</div>}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}