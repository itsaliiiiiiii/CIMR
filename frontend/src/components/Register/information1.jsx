import React, { useState } from 'react';

const pays = [
    "France", "Belgique", "Suisse", "Canada", "États-Unis", "Allemagne", "Espagne", "Italie",
    "Royaume-Uni", "Pays-Bas", "Portugal", "Maroc", "Algérie", "Tunisie", "Sénégal",
    "Côte d'Ivoire", "Cameroun", "Madagascar", "Mali", "Burkina Faso"
];

export default function Information1() {
    const [formData, setFormData] = useState({
        nom: '',
        prenom: '',
        pays: '',
        ville: '',
        dateNaissance: ''
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
        console.log(formData);
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
                                        {error && <div className="alert alert-danger">{error}</div>}
                                        
                                        <div className="mb-3">
                                            <input
                                                className="form-control"
                                                type="text"
                                                name="nom"
                                                placeholder="Nom"
                                                value={formData.nom}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <input
                                                className="form-control"
                                                type="text"
                                                name="prenom"
                                                placeholder="Prénom"
                                                value={formData.prenom}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <select
                                                className="form-control"
                                                name="pays"
                                                value={formData.pays}
                                                onChange={handleChange}
                                                required
                                            >
                                                <option value="">Sélectionnez un pays</option>
                                                {pays.map((pays, index) => (
                                                    <option key={index} value={pays}>
                                                        {pays}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="mb-3">
                                            <input
                                                className="form-control"
                                                type="text"
                                                name="ville"
                                                placeholder="Ville"
                                                value={formData.ville}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <input
                                                className="form-control"
                                                type="date"
                                                name="dateNaissance"
                                                placeholder="Date de naissance"
                                                value={formData.dateNaissance}
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