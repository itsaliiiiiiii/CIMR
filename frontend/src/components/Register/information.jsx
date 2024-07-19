import React from 'react';

// Fonction pour formater la date
const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
};

export default function Information({ allData }) {
    const {
        numeroMatricule, nom, prenom, pays, ville, dateNaissance,
        email, telephone, typeIdentite, numeroIdentite,
        dateRendezVous, agence
    } = ["sdsdf", "sdfsd", "sdfsd", "sdfsd", "sdfsd", "sdfsd", "sdfsd", "sdfsd", "sdfsd", "sdfsd", "sdfsd"
        ];

    // Fonction pour générer le PDF des informations personnelles
    const downloadPersonalInfo = () => {
        // Ici, vous implémenterez la logique pour générer et télécharger le PDF
        console.log("Téléchargement des informations personnelles");
    };

    // Fonction pour générer le PDF des informations de rendez-vous
    const downloadAppointmentInfo = () => {
        // Ici, vous implémenterez la logique pour générer et télécharger le PDF
        console.log("Téléchargement des informations de rendez-vous");
    };

    return (
        <div id="page_information_summary">
            <section className="position-relative py-4 py-xl-5">
                <div className="container">
                    <div className="row mb-5">
                        <div className="col-md-8 col-xl-6 text-center mx-auto">
                            <h2>Récapitulatif des Informations</h2>
                            <p className="w-lg-50">Veuillez telecharger les documents ci-dessous</p>
                        </div>
                    </div>
                    <div className="row d-flex justify-content-center">
                        <div className="col-md-8 col-xl-6">
                            <div className="card mb-5">
                                <div className="card-body">
                                    <h3 className="card-title">Informations Personnelles</h3>
                                    <ul className="list-group list-group-flush">
                                        <li className="list-group-item">Matricule: {numeroMatricule}</li>
                                        <li className="list-group-item">Nom: {nom}</li>
                                        <li className="list-group-item">Prénom: {prenom}</li>
                                        <li className="list-group-item">Pays: {pays}</li>
                                        <li className="list-group-item">Ville: {ville}</li>
                                        <li className="list-group-item">Date de naissance: {formatDate(dateNaissance)}</li>
                                        <li className="list-group-item">Email: {email}</li>
                                        <li className="list-group-item">Téléphone: {telephone}</li>
                                        <li className="list-group-item">Type d'identité: {typeIdentite}</li>
                                        <li className="list-group-item">Numéro d'identité: {numeroIdentite}</li>
                                    </ul>
                                    <div className="mt-3">
                                        <button className="btn btn-primary" onClick={downloadPersonalInfo}>
                                            Télécharger les informations personnelles
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="card mb-5">
                                <div className="card-body">
                                    <h3 className="card-title">Informations de Rendez-vous</h3>
                                    <ul className="list-group list-group-flush">
                                        <li className="list-group-item">Date du rendez-vous: {formatDate(dateRendezVous)}</li>
                                        <li className="list-group-item">Agence: {agence}</li>
                                    </ul>
                                    <div className="mt-3">
                                        <button className="btn btn-primary" onClick={downloadAppointmentInfo}>
                                            Télécharger les informations de rendez-vous
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}