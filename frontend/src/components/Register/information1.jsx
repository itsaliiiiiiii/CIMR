import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Information1() {
    const navigate = useNavigate();
    const [countriesList, setCountriesList] = useState([]);
    const [cities, setCities] = useState([]);
    const [formData, setFormData] = useState({
        nom: '',
        prenom: '',
        pays: '',
        ville: '',
        date_naissance: ''
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        fetchCountries();
    }, []);

    const fetchCountries = async () => {
        try {
            const response = await fetch('http://localhost:4000/cimr/countries');
            if (response.ok) {
                const data = await response.json();
                setCountriesList(data);
            } else {
                console.error('Failed to fetch countries');
            }
        } catch (error) {
            console.error('Error fetching countries:', error);
        }
    };

    const fetchCities = async (countryId) => {
        try {
            const response = await fetch(`http://localhost:4000/cimr/cities/${countryId}`);
            if (response.ok) {
                const data = await response.json();
                setCities(data);
            } else {
                console.error('Failed to fetch cities');
            }
        } catch (error) {
            console.error('Error fetching cities:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));

        if (name === 'pays') {
            const selectedCountry = countriesList.find(country => country.country_name === value);
            if (selectedCountry) {
                fetchCities(selectedCountry.country_id);
            }
        }

        setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.nom.trim()) {
            newErrors.nom = 'Le nom est requis';
        } else if (!/^[a-zA-Z\s]*$/.test(formData.nom)) {
            newErrors.nom = 'Le nom ne doit contenir que des lettres';
        }

        if (!formData.prenom.trim()) {
            newErrors.prenom = 'Le prénom est requis';
        } else if (!/^[a-zA-Z\s]*$/.test(formData.prenom)) {
            newErrors.prenom = 'Le prénom ne doit contenir que des lettres';
        }

        if (!formData.pays) {
            newErrors.pays = 'Le pays est requis';
        }

        if (!formData.ville) {
            newErrors.ville = 'La ville est requise';
        }

        if (!formData.date_naissance) {
            newErrors.date_naissance = 'La date de naissance est requise';
        } else {
            const birthDate = new Date(formData.date_naissance);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            if (age < 18) {
                newErrors.date_naissance = 'Vous devez avoir au moins 18 ans';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            localStorage.setItem('affilieData1', JSON.stringify(formData));
            navigate('/register/information2');
        }
    };

    return (
        <div id="page_information">
            <section className="position-relative py-4 py-xl-5">
                <div className="container">
                    <div className="row mb-5">
                        <div className="col-md-8 col-xl-6 text-center mx-auto">
                            <p className="w-lg-50">Veuillez saisir les informations ci-dessous</p>
                        </div>
                    </div>
                    <div className="row d-flex justify-content-center">
                        <div className="col-md-6 col-xl-4">
                            <div className="card mb-5">
                                <div className="card-body d-flex flex-column align-items-center">
                                    <form className="text-center w-100" onSubmit={handleSubmit}>
                                        <div className="mb-3">
                                            <input
                                                className={`form-control ${errors.nom ? 'is-invalid' : ''}`}
                                                type="text"
                                                name="nom"
                                                placeholder="Nom"
                                                value={formData.nom}
                                                onChange={handleChange}
                                            />
                                            {errors.nom && <div className="invalid-feedback">{errors.nom}</div>}
                                        </div>
                                        <div className="mb-3">
                                            <input
                                                className={`form-control ${errors.prenom ? 'is-invalid' : ''}`}
                                                type="text"
                                                name="prenom"
                                                placeholder="Prénom"
                                                value={formData.prenom}
                                                onChange={handleChange}
                                            />
                                            {errors.prenom && <div className="invalid-feedback">{errors.prenom}</div>}
                                        </div>
                                        <div className="mb-3">
                                            <select
                                                className={`form-control ${errors.pays ? 'is-invalid' : ''}`}
                                                name="pays"
                                                value={formData.pays}
                                                onChange={handleChange}
                                            >
                                                <option value="">Sélectionnez un pays</option>
                                                {countriesList.map((country) => (
                                                    <option key={country.country_id} value={country.country_name}>
                                                        {country.country_name}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.pays && <div className="invalid-feedback">{errors.pays}</div>}
                                        </div>
                                        <div className="mb-3">
                                            <select
                                                className={`form-control ${errors.ville ? 'is-invalid' : ''}`}
                                                name="ville"
                                                value={formData.ville}
                                                onChange={handleChange}
                                            >
                                                <option value="">Sélectionnez une ville</option>
                                                {cities.map((city) => (
                                                    <option key={city.city_id} value={city.city_name}>
                                                        {city.city_name}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.ville && <div className="invalid-feedback">{errors.ville}</div>}
                                        </div>
                                        <div className="mb-3">
                                            <input
                                                className={`form-control ${errors.date_naissance ? 'is-invalid' : ''}`}
                                                type="date"
                                                name="date_naissance"
                                                placeholder="Date de naissance"
                                                value={formData.date_naissance}
                                                onChange={handleChange}
                                            />
                                            {errors.date_naissance && <div className="invalid-feedback">{errors.date_naissance}</div>}
                                        </div>
                                        <div className="mb-3">
                                            <button className="btn btn-primary d-block w-100" type="submit">
                                                Suivant
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