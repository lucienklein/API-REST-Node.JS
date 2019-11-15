const checkQuery = require('./checkQuery');
const connection = require('../db/bdd');

//Fonction renvoyant les différents code status;
function sendStatusCode(res, results, error) {
    if (error) return res.status(500).json({ message: error });

    if (results == '') {
        res.status(404).json({
            message: '404 - Not found'
        });
    } else {
        res.status(200).json(
            results
        );
    }
}

//Les différentes query pour les différents request

exports.get = (req, res, next) => {
    connection.query({ sql: "SELECT * FROM users WHERE id = ? ", values: [req.params.id] }, (error, results, fields) => {
        sendStatusCode(res, results, error);
    });
}

exports.getName = (req, res, next) => {
    connection.query({ sql: "SELECT name, firstName FROM users WHERE id = ? ", values: [req.params.id] }, (error, results, fields) => {
        sendStatusCode(res, results, error);
    });
}

exports.getFull = (req, res, next) => {
    connection.query({ sql: "SELECT * FROM users WHERE email = ? ", values: [req.params.userEmail] }, (error, results, fields) => {
        sendStatusCode(res, results, error);
    });
}

exports.newUser = (req, res, next) => {
    const { name, firstName, email, password, telephone, campus, roles, promotion, age } = req.body;

    if (email && telephone) {

        //Verification des différents champs ayant des exigences pour le format

        checkQuery("email", email, res, () => {
            checkQuery("telephone", telephone, res, () => {

                connection.query({
                    sql: 'INSERT INTO users ( name, firstName, email, password, telephone, campus, roles, promotion, age) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                    values: [name, firstName, email, password, telephone, campus, JSON.stringify(roles), promotion, age]
                },
                    (error, results, fields) => {
                        if (error) {
                            res.status(500).json({ message: error });
                        }

                        else {
                            res.status(201).json({
                                createdUser: {
                                    name: name,
                                    firstName: firstName
                                }
                            });
                        }
                    }
                );
            })
        })
    }
    else return res.status(500).json({ Erreur: "Le champ email et/ou telephone et/ou password n'est pas renseigné" })
}