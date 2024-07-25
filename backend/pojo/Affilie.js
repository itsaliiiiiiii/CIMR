class Affilie {
    constructor(nom, prenom, email, dateNaissance, numero_telephone,
        pays, ville, type_identite, numero_identite, hashedMatricule,id_affilie) {
        this.nom = nom;
        this.prenom = prenom;
        this.email = email;
        this.dateNaissance = dateNaissance;
        this.numero_telephone = numero_telephone;
        this.pays = pays;
        this.ville = ville;
        this.type_identite = type_identite;
        this.numero_identite = numero_identite;
        this.numero_matricule = hashedMatricule;
        this.id_affilie = id_affilie;
    }
    
    
}

module.exports = Affilie;
