const RendezVous = require('../pojo/RendezVous');
const { connection } = require('../base_de_donnes/db');

class RendezVousDao {
    async create(rendezVous) {
        const query = 'INSERT INTO rendez_vous ( id_affilie,agence, date_rdv, heure_rdv, type_service) VALUES ( ?, ?, ?, ?,?)';
        try {

            const [result] = await connection.query(query, [
                rendezVous.id_affilie,
                rendezVous.agence,
                rendezVous.date_rdv,
                rendezVous.heure_rdv,
                rendezVous.type_service
            ]);

            console.log('Query result:', result);

            if (result.affectedRows === 1) {
                return result.insertId;
            } else {
                throw new Error('Insertion failed');
            }
        } catch (error) {
            console.error('Error in rendezVousDao.create:', error);
            console.error('Error stack:', error.stack);
            throw error;
        }
    }

    async findById(id) {
        const query = 'SELECT * FROM rendez_vous WHERE numero_rdv = ?';
        try {
            const [rows] = await connection.query(query, [id]);
            return rows.length > 0 ? this._createRendezVousFromRow(rows[0]) : null;
        } catch (error) {
            console.error('Erreur lors de la recherche du rendez-vous:', error);
            throw new Error('Erreur lors de la recherche du rendez-vous');
        }
    }

    async findAllById(id_affilie) {
        const query = 'SELECT * FROM rendez_vous WHERE id_affilie = ? ORDER BY date_rdv DESC, heure_rdv DESC';
        try {
            const [rows] = await connection.query(query, [id_affilie]);
            console.log(rows);
            return rows.map(row => this._createRendezVousFromRow(row));
        } catch (error) {
            console.error('Erreur lors de la recherche des rendez-vous:', error);
            throw new Error('Erreur lors de la recherche des rendez-vous');
        }
    }

    async update(rendezVous) {
        const query = 'UPDATE rendez_vous SET agence = ?, date_rdv = ?, heure_rdv = ?, type_service = ? WHERE numero_rdv = ?';
        const values = [rendezVous.agence, rendezVous.date_rdv, rendezVous.heure_rdv, rendezVous.type_service, rendezVous.id];

        try {
            const [result] = await connection.query(query, values);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Erreur lors de la mise à jour du rendez-vous:', error);
            throw new Error('Erreur lors de la mise à jour du rendez-vous');
        }
    }

    async delete(id) {
        const query = 'DELETE FROM rendez_vous WHERE numero_rdv = ?';
        try {
            const [result] = await connection.query(query, [id]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Erreur lors de la suppression du rendez-vous:', error);
            throw new Error('Erreur lors de la suppression du rendez-vous');
        }
    }

    _createRendezVousFromRow(row) {
        return new RendezVous(
            row.numero_rdv,
            row.numero_matricule,
            row.agence,
            row.date_rdv,
            row.heure_rdv,
            row.type_service
        );
    }
}

module.exports = new RendezVousDao();