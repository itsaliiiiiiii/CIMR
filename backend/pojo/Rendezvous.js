class RendezVous {
    constructor(id, numero_matricule, agence, date_rdv, heure_rdv, type_service,id_affilie) {
        this.id = id;
        this.agence = agence;
        this.id_affilie = id_affilie;
        this.date_rdv = date_rdv;
        this.heure_rdv = heure_rdv;
        this.type_service = type_service;
    }
}

module.exports = RendezVous;