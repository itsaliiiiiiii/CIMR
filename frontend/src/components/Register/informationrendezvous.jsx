import React, { useEffect, useState } from 'react';
import { jsPDF } from "jspdf";

export default function InformationRendezVous() {
    const [allData, setAllData] = useState({});

    useEffect(() => {
        const data1 = JSON.parse(localStorage.getItem('affilieData1') || '{}');
        const data2 = JSON.parse(localStorage.getItem('affilieData2') || '{}');
        const data3 = JSON.parse(localStorage.getItem('affilieData3') || '{}');

        const combinedData = { ...data1, ...data2, ...data3 };
        setAllData(combinedData);
    }, []);

    const downloadAppointmentInfo = () => {
        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.text("Informations de Rendez-vous", 10, 10);
        doc.setFontSize(12);
        doc.text(`Nom: ${allData.nom}`, 10, 30);
        doc.text(`Prénom: ${allData.prenom}`, 10, 40);
        doc.text(`Téléphone: ${allData.numero_telephone}`, 10, 90);
        doc.text(`Type d'identité: ${allData.type_identite}`, 10, 100);
        doc.text(`Numéro d'identité: ${allData.numero_identite}`, 10, 110);
        doc.text(`Matricule: ${allData.numero_matricule}`, 10, 20);
        doc.text(`Date du rendez-vous: ${allData.date_rdv}`, 10, 30);
        doc.text(`Agence: ${allData.agence}`, 10, 40);
        doc.text(`Type de service: poser les document d'inscription`, 10, 50);
        doc.save("informations_rendez_vous.pdf");
    };

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
                                        <li className="list-group-item">Agence: {allData.agence}</li>
                                        <li className="list-group-item">Type de service: poser les document d'inscription</li>
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

