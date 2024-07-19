import React, { useState } from 'react';

// Types d'identité (ajustez selon vos besoins)
const typesIdentite = [
    "Carte Nationale d'Identité",
    "Passeport",
    "Permis de conduire"
];

export default function Information2() {
    const [formData, setFormData] = useState({
        email: '',
        telephone: '',
        typeIdentite: '',
        numeroIdentite: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Logique pour traiter les données du formulaire
        console.log(formData);
        // Réinitialiser le formulaire ou naviguer vers la page suivante
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
                                        {error && <div className="alert alert-danger">{error}</div>}
                                        <div className="mb-3">
                                            <input
                                                className="form-control"
                                                type="email"
                                                name="email"
                                                placeholder="Email"
                                                value={formData.email}
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
                                            <select
                                                className="form-control"
                                                name="typeIdentite"
                                                value={formData.typeIdentite}
                                                onChange={handleChange}
                                                required
                                            >
                                                <option value="">Sélectionnez le type d'identité</option>
                                                {typesIdentite.map((type, index) => (
                                                    <option key={index} value={type}>
                                                        {type}
                                                    </option>
                                                ))}
                                            </select>
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