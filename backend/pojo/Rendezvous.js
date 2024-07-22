class RendezVous {
    constructor(id, numero_matricule, agence, date_rdv, heure_rdv, type_service) {
        this.id = id;
        this.numero_matricule = numero_matricule;
        this.agence = agence;
        this.date_rdv = date_rdv;
        this.heure_rdv = heure_rdv;
        this.type_service = type_service;
    }
}

module.exports = RendezVous;