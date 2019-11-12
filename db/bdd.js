const mysql = require('mysql');

//Identifiant et connection de la base de données
const connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'api_db'
});

module.exports = connection;
