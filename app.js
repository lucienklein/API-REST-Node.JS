const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');

const productsRoutes = require('./products');
const ordersRoutes = require('./orders');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Autoriser les connections extérieurs
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Header', '*');
	if (req.method === 'OPTIONS') {
		res.header('Acces-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
		return res.status(200).json({});
	}
	next();
});

//Rediriger les urls
app.use('/products', productsRoutes);
app.use('/orders', ordersRoutes);

//Si node ne trouve pas la route
app.use((req, res, next) => {
	const error = new Error('Not found');
	error.status = 404;
	next(error);
});

//En cas d'erreur
app.use((error, req, res, next) => {
	res.status(error.status || 500);
	res.json({
		error: {
			message: error.message
		}
	});
});

module.exports = app;
