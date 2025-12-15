-- Create agence table first as it's referenced by rendez_vous
CREATE TABLE IF NOT EXISTS agence (
    agence VARCHAR(50) PRIMARY KEY,
    ville VARCHAR(100) NOT NULL,
    adresse VARCHAR(255) NOT NULL,
    telephone VARCHAR(20) NOT NULL
);

-- Create service table as it's referenced by rendez_vous
CREATE TABLE IF NOT EXISTS service (
    service VARCHAR(100) PRIMARY KEY,
    description TEXT
);

-- Create affilie table before rendez_vous as it's referenced
CREATE TABLE IF NOT EXISTS affilie (
    id_affilie INT AUTO_INCREMENT PRIMARY KEY,
    numero_matricule VARCHAR(100) NOT NULL,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    date_naissance DATE NOT NULL,
    numero_telephone VARCHAR(20) NOT NULL UNIQUE,
    pays VARCHAR(100) NOT NULL,
    ville VARCHAR(100) NOT NULL,
    status_documents VARCHAR(50) DEFAULT 'En attente',
    type_identite VARCHAR(50) NOT NULL,
    numero_identite VARCHAR(50) NOT NULL UNIQUE
);

-- Create rendez_vous table last as it depends on other tables
CREATE TABLE IF NOT EXISTS rendez_vous (
    numero_rdv INT AUTO_INCREMENT PRIMARY KEY,
    id_affilie INT,
    agence VARCHAR(50) NOT NULL,
    heure_rdv TIME NOT NULL,
    date_rdv DATE NOT NULL,
    type_service VARCHAR(100) NOT NULL,
    etat_rdv VARCHAR(100) DEFAULT 'Prévu',
    FOREIGN KEY (id_affilie) REFERENCES affilie(id_affilie) ON DELETE CASCADE,
    FOREIGN KEY (agence) REFERENCES agence(agence) ON DELETE CASCADE,
    FOREIGN KEY (type_service) REFERENCES service(service) ON DELETE CASCADE,
    UNIQUE (id_affilie, date_rdv)
);