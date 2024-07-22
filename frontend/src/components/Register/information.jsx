// import React, { useEffect, useState } from 'react';
// import { jsPDF } from "jspdf";

// const formatDate = (dateString) => {
//     const options = { year: 'numeric', month: 'long', day: 'numeric' };
//     return new Date(dateString).toLocaleDateString('fr-FR', options);
// };

// export default function Information() {
//     const [allData, setAllData] = useState({});

//     useEffect(() => {
//         const data1 = JSON.parse(localStorage.getItem('affilieData1') || '{}');
//         const data2 = JSON.parse(localStorage.getItem('affilieData2') || '{}');
//         const data3 = JSON.parse(localStorage.getItem('affilieData3') || '{}');

//         const combinedData = { ...data1, ...data2, ...data3 };
//         setAllData(combinedData);
//     }, []);

//     const downloadPersonalInfo = () => {
//         const doc = new jsPDF();
//         doc.setFontSize(16);
//         doc.text("Informations Personnelles", 10, 10);
//         doc.setFontSize(12);
//         doc.text(`Matricule: ${allData.numeroMatricule}`, 10, 20);
//         doc.text(`Nom: ${allData.nom}`, 10, 30);
//         doc.text(`Prénom: ${allData.prenom}`, 10, 40);
//         doc.text(`Pays: ${allData.pays}`, 10, 50);
//         doc.text(`Ville: ${allData.ville}`, 10, 60);
//         doc.text(`Date de naissance: ${formatDate(allData.dateNaissance)}`, 10, 70);
//         doc.text(`Email: ${allData.email}`, 10, 80);
//         doc.text(`Téléphone: ${allData.telephone}`, 10, 90);
//         doc.text(`Type d'identité: ${allData.typeIdentite}`, 10, 100);
//         doc.text(`Numéro d'identité: ${allData.numeroIdentite}`, 10, 110);
//         doc.save("informations_personnelles.pdf");
//     };

//     const downloadAppointmentInfo = () => {
//         const doc = new jsPDF();
//         doc.setFontSize(16);
//         doc.text("Informations de Rendez-vous", 10, 10);
//         doc.setFontSize(12);
//         doc.text(`Nom: ${allData.nom}`, 10, 30);
//         doc.text(`Prénom: ${allData.prenom}`, 10, 40);
//         doc.text(`Téléphone: ${allData.telephone}`, 10, 90);
//         doc.text(`Type d'identité: ${allData.typeIdentite}`, 10, 100);
//         doc.text(`Numéro d'identité: ${allData.numeroIdentite}`, 10, 110);
//         doc.text(`Matricule: ${allData.numeroMatricule}`, 10, 20);
//         doc.text(`Date du rendez-vous: ${formatDate(allData.dateRendezVous)}`, 10, 30);
//         doc.text(`Agence: ${allData.agence}`, 10, 40);
//         doc.text(`Type de service: poser les document d'inscription`, 10, 50);
//         doc.save("informations_rendez_vous.pdf");
//     };

//     return (
//         <div id="page_information_summary">
//             <section className="position-relative py-4 py-xl-5">
//                 <div className="container">
//                     <div className="row mb-5">
//                         <div className="col-md-8 col-xl-6 text-center mx-auto">
//                             <h2>Récapitulatif des Informations</h2>
//                             <p className="w-lg-50">Veuillez télécharger les documents ci-dessous</p>
//                         </div>
//                     </div>
//                     <div className="row d-flex justify-content-center">
//                         <div className="col-md-8 col-xl-6">
//                             <div className="card mb-5">
//                                 <div className="card-body">
//                                     <h3 className="card-title">Informations Personnelles</h3>
//                                     <ul className="list-group list-group-flush">
//                                         <li className="list-group-item">Matricule: {allData.numeroMatricule}</li>
//                                         <li className="list-group-item">Nom: {allData.nom}</li>
//                                         <li className="list-group-item">Prénom: {allData.prenom}</li>
//                                         <li className="list-group-item">Pays: {allData.pays}</li>
//                                         <li className="list-group-item">Ville: {allData.ville}</li>
//                                         <li className="list-group-item">Date de naissance: {formatDate(allData.dateNaissance)}</li>
//                                         <li className="list-group-item">Email: {allData.email}</li>
//                                         <li className="list-group-item">Téléphone: {allData.telephone}</li>
//                                         <li className="list-group-item">Type d'identité: {allData.typeIdentite}</li>
//                                         <li className="list-group-item">Numéro d'identité: {allData.numeroIdentite}</li>
//                                     </ul>
//                                     <div className="mt-3">
//                                         <button className="btn btn-primary" onClick={downloadPersonalInfo}>
//                                             Télécharger les informations personnelles
//                                         </button>
//                                     </div>
//                                 </div>
//                             </div>
//                             <div className="card mb-5">
//                                 <div className="card-body">
//                                     <h3 className="card-title">Informations de Rendez-vous</h3>
//                                     <ul className="list-group list-group-flush">
//                                         <li className="list-group-item">Matricule: {allData.numeroMatricule}</li>
//                                         <li className="list-group-item">Date du rendez-vous: {formatDate(allData.dateRendezVous)}</li>
//                                         <li className="list-group-item">Agence: {allData.agence}</li>
//                                         <li className="list-group-item">Type de service: poser les document d'inscription</li>
//                                     </ul>
//                                     <div className="mt-3">
//                                         <button className="btn btn-primary" onClick={downloadAppointmentInfo}>
//                                             Télécharger les informations de rendez-vous
//                                         </button>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </section>
//         </div>
//     );
// }

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