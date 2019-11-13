const express = require('express');
const router = express.Router();
const connection = require('../db/bdd');
const bcrypt = require('bcrypt');

// if (value == null) {
// 	if (validateMail(mail, res, () => {
// 		console.log('ok');
// 		return true;
// 	})) validateTelephone(telephone, res, cb);
// }

//Fonction de validation des query
function validateQuery(propName, value, res, cb) {

	if (propName == "telephone") validateTelephone(value, res, cb)

	else if (propName == "mail") validateMail(value, res, cb);

	else return cb();
}

function validateTelephone(value, res, cb) {
	var reTelephone = /^((\+)33|0)[1-9](\d{2}){4}$/;

	if (reTelephone.test(String(value).toLowerCase())) {
		return uniqueProp("telephone", value, res, cb);
	} else {
		res.status(500).json({ message: "Le téléphone est dans un mauvais format" });
		return false;
	}
}

function validateMail(value, res, cb) {
	var reMail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

	if (reMail.test(String(value).toLowerCase())) {
		return uniqueProp("mail", value, res, cb);
	} else {
		res.status(500).json({ message: "Le mail est dans un mauvais format" });
		return false;
	}
}

function uniqueProp(propName, value, res, cb) {
	connection.query('SELECT * FROM users WHERE ' + propName + " = '" + value + "'", (error, results, fields) => {
		if (error) {
			res.status(500).json({ message: error });
			return false;
		}
		if (!results.length) {
			return cb();
		}
		else {
			res.status(409).json({ message: "Le " + propName + " est déjà lié à un compte" });
			return false;
		}
	});
}

//Fonction renvoyant les différents code status;
function sendStatusCode(res, results, error) {
	if (error) return res.status(500).json({ message: error });

	if (results == '') {
		res.status(404).json({
			message: '404 - Not found'
		});

	} else if (results.affectedRows != null) {
		res.status(200).json({
			message: 'Opération réussie',
			affectedRows: results.affectedRows
		});
	} else {
		res.status(200).json({
			message: 'Opération réussie',
			user: results
		});
	}
}

//Les différentes routes et requetes possibles
router.get('/', (req, res, next) => {
	connection.query('SELECT * FROM users', (error, results, fields) => {
		if (error) return res.status(500).json({ message: 'Erreur' });

		var resultsArray = Object.values(results);
		res.status(200).json({
			message: 'Opération réussie',
			count: resultsArray.length,

			users: resultsArray.map((resultsArray) => {
				return {
					ID: resultsArray.id,
					Nom: resultsArray.nom,
					Prénom: resultsArray.prenom,
					mail: resultsArray.mail,
					Promotion: resultsArray.promotion,
					request: {
						type: 'GET',
						url: 'http://localhost:8000/users/' + resultsArray.id
					}
				};
			})
		});
	});
});

router.post('/signup', (req, res, next) => {
	const { id, nom, prenom, mail, telephone, campus, role, promotion, age } = req.body;
	if (mail && telephone) {
		validateQuery("mail", mail, res, () => {
			validateQuery("telephone", telephone, res, () => {
				bcrypt.hash(req.body.mdp, 10, (err, hash) => {
					if (err) return res.status(500).json({ error: err });
					else {
						connection.query({
							sql: 'INSERT INTO users (id, nom, prenom, mail, mdp, telephone, campus, role, promotion, age) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
							values: [id, nom, prenom, mail, hash, telephone, campus, role, promotion, age]
						},

							(error, results, fields) => {
								if (error) res.status(500).json({ message: error });
								else {
									res.status(201).json({
										message: 'Création réussie',
										createdUser: {
											Nom: req.body.nom,
											Prénom: req.body.prenom
										}
									});
								}
							}
						);
					}
				});
			})
		})
	}
	else return res.status(500).json({ Erreur: "Le champ mail n'est pas renseigné" })
})

// A tester
router.post('/login', (req, res, next) => {
	connection.query({ sql: "SELECT mdp FROM users WHERE mail = ?", values: [req.body.email] }, (error, results, fields) => {
		// res.status(200).json({ results: results });
		// console.log(results.mdp);
		bcrypt.compare(req.body.mdp, results[0].mdp, (err, resHash) => {
			if (err) return res.status(401).json({ message: 'Auth failed' });
			if (resHash) {
				return res.status(200).json({
					message: 'Auth successful'
				});
			}
			res.status(401).json({ message: 'Auth failed' });
		})
	})

})

router.get('/:userId', (req, res, next) => {
	connection.query({ sql: "SELECT * FROM users WHERE id = ?", values: [req.params.userId] }, (error, results, fields) => {
		sendStatusCode(res, results, error);
	});
});

router.patch('/:userId', (req, res, next) => {
	const { propName, value } = req.body;
	validateQuery(propName, value, res, () => {
		connection.query(
			"UPDATE users SET " + propName + "  = '" + value + "'  WHERE id = " + req.params.userId,
			// { sql: "UPDATE users SET ?  =  '?'  WHERE id = ? ", values: [propName, value, req.params.userId] },
			(error, results, fields) => {
				sendStatusCode(res, results, error);
			}
		);
	})
});

router.delete('/:userId', (req, res, next) => {
	connection.query('DELETE FROM users WHERE id = ' + req.params.userId, (error, results, fields) => {
		sendStatusCode(res, results, error);
	});
});

module.exports = router;
