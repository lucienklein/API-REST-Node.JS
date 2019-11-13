const checkQuery = require('./checkQuery');
const connection = require('../db/bdd');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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

//Query
exports.get_all = (req, res, next) => {
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
}

exports.signup = (req, res, next) => {
    const { id, nom, prenom, mail, telephone, campus, role, promotion, age } = req.body;
    if (mail && telephone) {
        checkQuery("mail", mail, res, () => {
            checkQuery("telephone", telephone, res, () => {
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
}

exports.login = (req, res, next) => {
    connection.query({ sql: "SELECT * FROM users WHERE mail = ?", values: [req.body.email] }, (error, results, fields) => {
        // res.status(200).json({ results: results });
        // console.log(results.mdp);
        bcrypt.compare(req.body.mdp, results[0].mdp, (err, resHash) => {
            if (err) return res.status(401).json({ message: 'Auth failed' });
            if (resHash) {
                const token = jwt.sign({
                    mail: results[0].mail,
                    userId: results[0].id
                },
                    process.env.JWT_KEY, {
                    expiresIn: "1h"
                });
                return res.status(200).json({
                    message: 'Auth successful',
                    token: token
                });
            }
            res.status(401).json({ message: 'Auth failed' });
        })
    })

}

exports.get_user = (req, res, next) => {
    connection.query({ sql: "SELECT * FROM users WHERE id = ?", values: [req.params.userId] }, (error, results, fields) => {
        sendStatusCode(res, results, error);
    });
}

exports.patch_user = (req, res, next) => {
    const { propName, value } = req.body;
    checkQuery(propName, value, res, () => {
        connection.query(
            "UPDATE users SET " + propName + "  = '" + value + "'  WHERE id = " + req.params.userId,
            // { sql: "UPDATE users SET ?  =  '?'  WHERE id = ? ", values: [propName, value, req.params.userId] },
            (error, results, fields) => {
                sendStatusCode(res, results, error);
            }
        );
    })
}

exports.delete_user = (req, res, next) => {
    connection.query('DELETE FROM users WHERE id = ' + req.params.userId, (error, results, fields) => {
        sendStatusCode(res, results, error);
    });
}