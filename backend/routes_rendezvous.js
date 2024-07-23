// const express = require('express');
// const router = express.Router();
// const jwt = require('jsonwebtoken');
// const { affilieGestion } = require('./gestion/AffilieGestion');

// const verifyToken = (req, res, next) => {
//     const authHeader = req.headers['authorization'];
//     if (!authHeader) return res.status(403).json({ message: 'Aucun token fourni' });

//     const token = authHeader.split(' ')[1];
//     if (!token) return res.status(403).json({ message: 'Format de token invalide' });

//     jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//         if (err) return res.status(401).json({ message: 'Token non valide' });
//         req.numero_matricule = decoded.numero_matricule;
//         req.numero_identite = decoded.numero_identite;
//         next();
//     });
// };

// // Fonction pour générer le numéro de matricule
// const generateMatricule = (nom, prenom, date_naissance) => {
//     const firstLetterNom = nom.charAt(0).toUpperCase();
//     const firstLetterPrenom = prenom.charAt(0).toUpperCase();

//     const date = new Date(date_naissance);
//     const day = String(date.getDate()).padStart(2, '0');
//     const month = String(date.getMonth() + 1).padStart(2, '0');
//     const year = String(date.getFullYear()).slice(-2);

//     const datePart = day + month + year;

//     const generateRandomChars = () => {
//         const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
//         return Array(4).fill().map(() => chars[Math.floor(Math.random() * chars.length)]).join('');
//     };

//     return `${firstLetterNom}${firstLetterPrenom}${datePart}${generateRandomChars()}`;
// };

// // Route d'inscription d'un affilié
// router.post('/register', async (req, res) => {
//     try {
//         const {
//             nom, prenom, email, date_naissance, numero_telephone,
//             pays, ville, type_identite, numero_identite
//         } = req.body;

//         const numero_matricule = generateMatricule(nom, prenom, date_naissance);
//         const newAffilie = await affilieGestion.creerAffilie(
//             nom, prenom, email, date_naissance, numero_telephone,
//             pays, ville, type_identite, numero_identite, numero_matricule
//         );
//         const token_user = jwt.sign({ numero_matricule: numero_matricule, numero_identite: numero_identite }, process.env.JWT_SECRET, {
//             expiresIn: '1h'
//         });

//         res.status(201).json({ message: 'Affilié créé avec succès', affilie: newAffilie, token: token_user });
//     } catch (error) {
//         if (error.message.includes('existe déjà')) {
//             res.status(400).json({ message: error.message });
//         } else {
//             res.status(500).json({ message: 'Erreur lors de la création de l\'affilié', error: error.message });
//         }
//     }
// });

// router.post('/auth', async (req, res) => {
//     try {
//         const { numero_matricule, numero_telephone, numero_identite } = req.body;

//         const affilie = await affilieGestion.authentifierAffilie(numero_matricule, numero_telephone, numero_identite);

//         const token = jwt.sign({ numero_matricule: numero_matricule, numero_identite: numero_identite }, process.env.JWT_SECRET, {
//             expiresIn: '1h'
//         });

//         res.json({ token, affilie });
//     } catch (error) {
//         res.status(401).json({ message: 'Informations d\'identification non valides' });
//     }
// });

// router.get('/affilie', verifyToken, async (req, res) => {
//     try {
//         const affilie = await affilieGestion.obtenirAffilie(req.numero_matricule);
//         if (affilie) {
//             res.json(affilie);
//         } else {
//             res.status(404).json({ message: 'Affilié non trouvé' });
//         }
//     } catch (error) {
//         res.status(500).json({ message: 'Erreur lors de la recherche de l\'affilié', error: error.message });
//     }
// });

// module.exports = router;
