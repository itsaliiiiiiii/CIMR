import React, { useState } from 'react';

// Liste des agences (à remplacer par vos vraies agences)
const agences = [
    "Agence Paris Centre",
    "Agence Lyon",
    "Agence Marseille",
    "Agence Bordeaux",
    "Agence Lille",
    "Agence Strasbourg"
];

export default function Information3() {
    const [formData, setFormData] = useState({
        dateRendezVous: '',
        agence: ''
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
        // Ici, vous pourriez envoyer les données à votre backend ou passer à l'étape suivante
    };

    // Fonction pour obtenir le jour de la semaine
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
                                        {error && <div className="alert alert-danger">{error}</div>}
                                        <div className="mb-3">
                                            <label htmlFor="dateRendezVous" className="form-label">Date du rendez-vous</label>
                                            <input
                                                className="form-control"
                                                type="date"
                                                id="dateRendezVous"
                                                name="dateRendezVous"
                                                value={formData.dateRendezVous}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        {formData.dateRendezVous && (
                                            <div className="mb-3">
                                                <p>Jour : {getDayOfWeek(formData.dateRendezVous)}</p>
                                            </div>
                                        )}
                                        <div className="mb-3">
                                            <label htmlFor="agence" className="form-label">Choisir une agence</label>
                                            <select
                                                className="form-control"
                                                id="agence"
                                                name="agence"
                                                value={formData.agence}
                                                onChange={handleChange}
                                                required
                                            >
                                                <option value="">Sélectionnez une agence</option>
                                                {agences.map((agence, index) => (
                                                    <option key={index} value={agence}>
                                                        {agence}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="mb-3">
                                            <button className="btn btn-primary d-block w-100" type="submit">
                                                Confirmer le rendez-vous
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