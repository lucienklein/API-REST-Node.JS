const http = require('http');
const app = require('./app/app');

//Création du serveur
const port = 8080;
const server = http.createServer(app);

server.listen(port);
