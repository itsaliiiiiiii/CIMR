class RendezVous {
    constructor(id, id_affilie, agence, date_rdv, heure_rdv, type_service,etat_rdv) {
        this.id = id;
        this.agence = agence;
        this.id_affilie = id_affilie;
        this.date_rdv = date_rdv;
        this.heure_rdv = heure_rdv;
        this.type_service = type_service;
        this.etat_rdv = etat_rdv;
    }
}

module.exports = RendezVous;