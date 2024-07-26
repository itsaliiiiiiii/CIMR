import React, { useEffect, useState } from 'react';
import { jsPDF } from "jspdf";
import { useNavigate } from 'react-router-dom';

export default function InformationRendezVous() {
    const [allData, setAllData] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const data1 = JSON.parse(localStorage.getItem('affilieInfo') || '{}');
        const data2 = JSON.parse(localStorage.getItem('rendezVousInfo') || '{}');

        const combinedData = { ...data1, ...data2 };
        setAllData(combinedData);
    }, []);

    const downloadAppointmentInfo = () => {
        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.text("Informations de Rendez-vous", 10, 10);
        doc.setFontSize(12);
        doc.text(`Nom: ${allData.nom}`, 10, 20);
        doc.text(`Prénom: ${allData.prenom}`, 10, 30);
        doc.text(`Téléphone: ${allData.numero_telephone}`, 10, 40);
        doc.text(`Type d'identité: ${allData.type_identite}`, 10, 50);
        doc.text(`Numéro d'identité: ${allData.numero_identite}`, 10, 60);
        doc.text(`Matricule: ${allData.numero_matricule}`, 10, 70);
        doc.text(`Date du rendez-vous: ${allData.date_rdv +" - "+ allData.heure_rdv}`, 10, 80);
        doc.text(`Agence: ${allData.agence}`, 10, 90);
        doc.setFontSize(16);
        doc.text("Documents obligatoires:", 10, 110);
        doc.setFontSize(16);
        doc.text("1. Carte d'identité nationale (CIN)", 10, 120);
        doc.text("2. Photo d'identité", 10, 130);
        doc.text("3. Justificatif de domicile", 10, 140);
        doc.text("4. Extrait d'acte de naissance", 10, 150);
        doc.text("5. Certificat de travail", 10, 160);
        doc.text("6. Relevé bancaire", 10, 170);
        doc.text(`Type de service: poser les document d'inscription`, 10, 100);
        doc.save("informations_rendez_vous.pdf");
    };

    const handlesubmit = (e) => {
        e.preventDefault();
        navigate("/login");
    }
    return (
        <div id="page_information_summary">
            <section className="position-relative py-4 py-xl-5">
                <div className="container">
                    <div className="row mb-5">
                        <div className="col-md-8 col-xl-6 text-center mx-auto">
                            <h2>Récapitulatif des Informations</h2>
                            <p className="w-lg-50">Veuillez télécharger document ci-dessous</p>
                        </div>
                    </div>
                    <div className="row d-flex justify-content-center">
                        <div className="col-md-8 col-xl-6">

                            <div className="card mb-5">
                                <div className="card-body">
                                    <h3 className="card-title">Informations de Rendez-vous</h3>
                                    <ul className="list-group list-group-flush">
                                        <li className="list-group-item">Nom: {allData.nom}</li>
                                        <li className="list-group-item">Prénom: {allData.prenom}</li>
                                        <li className="list-group-item">Email: {allData.email}</li>
                                        <li className="list-group-item">Téléphone: {allData.numero_telephone}</li>
                                        <li className="list-group-item">Numéro d'identité: {allData.numero_identite}</li>
                                        <li className="list-group-item">Matricule: {allData.numero_matricule}</li>
                                        <li className="list-group-item">Date du rendez-vous: {allData.date_rdv}</li>
                                        <li className="list-group-item">Heure du rendez-vous: {allData.heure_rdv}</li>
                                        <li className="list-group-item">Agence: {allData.agence}</li>
                                        <li className="list-group-item">Type de service: poser les document d'inscription</li>
                                    </ul>
                                    <div className="mx-3 my-5">
                                        <h5>Documents obligatoires:</h5>
                                        <ul>
                                            <li>Carte d'identité nationale (CIN)</li>
                                            <li>Photo d'identité</li>
                                            <li>Justificatif de domicile</li>
                                            <li>Extrait d'acte de naissance</li>
                                            <li>Certificat de travail</li>
                                            <li>Relevé bancaire</li>
                                        </ul>
                                    </div>
                                    <div className="mt-3">
                                        <button className="btn btn-primary" onClick={downloadAppointmentInfo}>
                                            Télécharger les informations de rendez-vous
                                        </button>
                                    </div>
                                    <div className="mt-3 ">
                                        <button className="btn btn-primary" type="submit" onClick={handlesubmit} >
                                            suivant
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

