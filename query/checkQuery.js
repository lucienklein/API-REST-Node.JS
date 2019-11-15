const connection = require('../db/database');

//Fonction de validation des query
var checkQuery = (propName, value, res, cb) => {

    if (propName == "telephone") validateTelephone(value, res, cb)

    else if (propName == "email") validateEmail(value, res, cb);

    else return cb();
}

//Fonctions permettant de vérifier les champs avec des regex
function validateTelephone(value, res, cb) {
    var regexTelephone = /^((\+)33|0)[1-9](\d{2}){4}$/;

    if (regexTelephone.test(String(value))) {
        return uniqueProp("telephone", value, res, cb);
    } else {
        res.status(500).json({ message: "Le téléphone est dans un mauvais format" });
        return false;
    }
}

function validateEmail(value, res, cb) {
    var regexMail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@viacesi.fr$/;

    if (regexMail.test(String(value).toLowerCase())) {
        return uniqueProp("email", value, res, cb);
    } else {
        res.status(500).json({ message: "L' email est dans un mauvais format" });
        return false;
    }
}

//Fonction permettant de vérifier si la valeurs est unique dans la bdd
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

module.exports = checkQuery;