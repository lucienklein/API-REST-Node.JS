const http = require('http');
const app = require('./app');

//Création du serveur
const port = process.env.PORT || 8000;
const server = http.createServer(app);

server.listen(port);
