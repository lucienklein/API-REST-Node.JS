const connection = require('../db/bdd');

//Fonction de validation des query
var checkQuery = (propName, value, res, cb) => {

    if (propName == "telephone") validateTelephone(value, res, cb)

    else if (propName == "email") validateEmail(value, res, cb);

    // else if (propName == "password") validatePassword(value, res, cb);

    else return cb();
}

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
    var regexMail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (regexMail.test(String(value).toLowerCase())) {
        return uniqueProp("mail", value, res, cb);
    } else {
        res.status(500).json({ message: "L' email est dans un mauvais format" });
        return false;
    }
}

function validatePassword(value, res, cb) {
    var regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})$/;
    if (regexPassword.test(String(value))) {
        return cb();
    } else {
        res.status(500).json({ message: "Le mots de passe n'est pas assez robuste" });
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

module.exports = checkQuery;