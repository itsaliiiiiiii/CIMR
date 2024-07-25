import React, { useEffect, useState } from 'react';
import { jsPDF } from "jspdf";
import { useNavigate } from 'react-router-dom';

export default function Information() {
    const [allData, setAllData] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem('affilieInfo') || '{}');
        const combinedData = { ...data };
        setAllData(combinedData);
    }, []);

    const downloadPersonalInfo = () => {
        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.text("Informations Personnelles", 10, 10);
        doc.setFontSize(12);
        doc.text("Note:Le numéro Matricule est confidentiel et obligatoire pour se connecter au site web. Veuillez le mémoriser et ne pas le partager avec quiconque.", 10, 20, { maxWidth: 180 });
        doc.text(`Matricule: ${allData.numero_matricule}`, 10, 40);
        doc.text(`Nom: ${allData.nom}`, 10, 50);
        doc.text(`Prénom: ${allData.prenom}`, 10, 60);
        doc.text(`Pays: ${allData.pays}`, 10, 70);
        doc.text(`Ville: ${allData.ville}`, 10, 80);
        doc.text(`Date de naissance: ${allData.dateNaissance}`, 10, 90);
        doc.text(`Email: ${allData.email}`, 10, 100);
        doc.text(`Téléphone: ${allData.numero_telephone}`, 10, 110);
        doc.text(`Type d'identité: ${allData.type_identite}`, 10, 120);
        doc.text(`Numéro d'identité: ${allData.numero_identite}`, 10, 130);
        doc.save("informations_personnelles.pdf");
    };

    const handleSubmit = () => {
        navigate("/register/rendezvous");
    }

    return (
        <div id="page_information_summary">
            <section className="position-relative py-4 py-xl-5">
                <div className="container">
                    <div className="row mb-5">
                        <div className="col-md-8 col-xl-6 text-center mx-auto">
                            <h2>Récapitulatif des Informations</h2>
                            
                            <p className="w-lg-50">Veuillez télécharger les documents ci-dessous</p>
                        </div>
                    </div>
                    <div className="row d-flex justify-content-center">
                        <div className="col-md-8 col-xl-6">
                            <div className="card mb-5">
                                <div className="card-body">
                                    <h3 className="card-title">Informations Personnelles</h3>
                                    <ul className="list-group list-group-flush">
                                        <li className="list-group-item">Matricule: {allData.numero_matricule}</li>
                                        <li className="list-group-item">Nom: {allData.nom}</li>
                                        <li className="list-group-item">Prénom: {allData.prenom}</li>
                                        <li className="list-group-item">Pays: {allData.pays}</li>
                                        <li className="list-group-item">Ville: {allData.ville}</li>
                                        <li className="list-group-item">Date de naissance: {allData.dateNaissance}</li>
                                        <li className="list-group-item">Email: {allData.email}</li>
                                        <li className="list-group-item">Téléphone: {allData.numero_telephone}</li>
                                        <li className="list-group-item">Type d'identité: {allData.type_identite}</li>
                                        <li className="list-group-item">Numéro d'identité: {allData.numero_identite}</li>
                                    </ul>
                                    <p className="w-lg-50 my-5 mx-2">Le numéro Matricule est confidentiel et obligatoire pour se connecter au site web. Veuillez le mémoriser et ne pas le partager avec quiconque.</p>
                                    <div className="mt-3">
                                        <button className="btn btn-primary" onClick={downloadPersonalInfo}>
                                            Télécharger les informations personnelles
                                        </button>
                                    </div>
                                    <div className="mt-3">
                                        <button className="btn btn-primary" type="submit" onClick={handleSubmit}>
                                            Suivant
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
