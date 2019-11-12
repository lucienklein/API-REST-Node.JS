const express = require('express');
const router = express.Router();
const connection = require('../db/bdd');

//Les différentes routes et requetes possibles
router.get('/', (req, res, next) => {
	connection.query('SELECT * FROM products', (error, results, fields) => {
		if (error) {
			return res.status(500).json({
				message: 'Erreur'
			});
		}
		var resultsArray = Object.values(results);
		res.status(200).json({
			message: 'Opération réussie',
			count: resultsArray.length,

			products: resultsArray.map((resultsArray) => {
				return {
					name: resultsArray.name,
					price: resultsArray.price,
					id: resultsArray.id,
					request: {
						type: 'GET',
						url: 'http://localhost:8000/products/' + resultsArray.id
					}
				};
			})
		});
	});
});

router.post('/', (req, res, next) => {
	connection.query(
		"INSERT INTO products (name, price) VALUES ('" + req.body.name + "', '" + req.body.price + "')",
		(error, results, fields) => {
			if (error) {
				return res.status(500).json({
					message: 'Erreur'
				});
			}

			res.status(201).json({
				message: 'Opération réussie',
				createdProduct: {
					name: req.body.name,
					price: req.body.price
				}
			});
		}
	);
});

router.get('/:productId', (req, res, next) => {
	connection.query('SELECT * FROM products WHERE id = ' + req.params.productId, (error, results, fields) => {
		if (error) {
			return res.status(500).json({
				message: 'Erreur'
			});
		}

		if (results == '') {
			res.status(404).json({
				message: '404 - Not found'
			});
		} else {
			res.status(200).json({
				message: 'Opération réussie',
				products: results
			});
		}
	});
});

router.patch('/:productId', (req, res, next) => {
	connection.query(
		'UPDATE products SET ' + req.body.propName + " = '" + req.body.value + "' WHERE id = " + req.params.productId,
		(error, results, fields) => {
			if (error) {
				return res.status(500).json({
					message: 'Erreur'
				});
			}

			if (results == '') {
				res.status(404).json({
					message: '404 - Not found'
				});
			} else {
				res.status(200).json({
					message: 'Opération réussie',
					affectedRows: results.affectedRows
				});
			}
		}
	);
});

router.delete('/:productId', (req, res, next) => {
	connection.query('DELETE FROM products WHERE id = ' + req.params.productId, (error, results, fields) => {
		if (error) {
			return res.status(500).json({
				message: 'Erreur'
			});
		}

		if (results == '') {
			res.status(404).json({
				message: '404 - Not found'
			});
		} else {
			res.status(200).json({
				message: 'Opération réussie',
				affectedRows: results.affectedRows
			});
		}
	});
});

module.exports = router;
