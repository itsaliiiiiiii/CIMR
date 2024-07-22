const RendezVous = require('../pojo/Rendezvous');
const { connection } = require('../base_de_donnes/db');

class RendezVousDao {
    async create(rendezVous) {
        const query = 'INSERT INTO rendez_vous (numero_matricule, agence, date_rdv, heure_rdv, type_service) VALUES (?, ?, ?, ?, ?)';
        const values = [rendezVous.numeroMatricule, rendezVous.agence, rendezVous.dateRdv, rendezVous.heureRdv, rendezVous.typeService];

        try {
            const [result] = await connection.query(query, values);
            console.log('Rendez-vous créé avec succès');
            return result.insertId;
        } catch (error) {
            console.error('Erreur lors de la création du rendez-vous:', error);
            throw error;
        }
    }

    async findByNumeroRdv(numeroRdv) {
        const query = 'SELECT * FROM rendez_vous WHERE numero_rdv = ?';
        try {
            const [rows] = await connection.query(query, [numeroRdv]);
            if (rows.length > 0) {
                const rdvData = rows[0];
                return new RendezVous(
                    rdvData.numero_rdv,
                    rdvData.numero_matricule,
                    rdvData.agence,
                    rdvData.date_rdv,
                    rdvData.heure_rdv,
                    rdvData.type_service
                );
            }
            return null;
        } catch (error) {
            console.error('Erreur lors de la recherche du rendez-vous:', error);
            throw error;
        }
    }

    async findAllByNumeroMatricule(numeroMatricule) {
        const query = 'SELECT * FROM rendez_vous WHERE numero_matricule = ? ORDER BY date_rdv DESC, heure_rdv DESC';
        try {
            const [rows] = await connection.query(query, [numeroMatricule]);
            return rows.map(rdvData => new RendezVous(
                rdvData.numero_rdv,
                rdvData.numero_matricule,
                rdvData.agence,
                rdvData.date_rdv,
                rdvData.heure_rdv,
                rdvData.type_service
            ));
        } catch (error) {
            console.error('Erreur lors de la recherche des rendez-vous:', error);
            throw error;
        }
    }

    async update(rendezVous) {
        const query = 'UPDATE rendez_vous SET agence = ?, date_rdv = ?, heure_rdv = ?, type_service = ? WHERE numero_rdv = ?';
        const values = [rendezVous.agence, rendezVous.dateRdv, rendezVous.heureRdv, rendezVous.typeService, rendezVous.numeroRdv];

        try {
            const [result] = await connection.query(query, values);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Erreur lors de la mise à jour du rendez-vous:', error);
            throw error;
        }
    }

    async delete(numeroRdv) {
        const query = 'DELETE FROM rendez_vous WHERE numero_rdv = ?';
        try {
            const [result] = await connection.query(query, [numeroRdv]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Erreur lors de la suppression du rendez-vous:', error);
            throw error;
        }
    }
}

module.exports = new RendezVousDao();
