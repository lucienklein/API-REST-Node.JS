const express = require('express');
const router = express.Router();
const connection = require('./bdd');

router.get('/', (req, res, next) => {
	connection.query('SELECT * FROM products', (error, results, fields) => {
		if (error) {
			res.status(500).json({
				message: 'Erreur'
			});
			throw error;
		}
		res.status(200).json({
			message: 'Opération réussie',
			products: results
		});
	});
});

router.post('/', (req, res, next) => {
	const product = {
		name: req.body.name,
		price: req.body.price
	};
	connection.query(
		"INSERT INTO products VALUES ('" + req.body.name + "', '" + req.body.price + "')",
		(error, results, fields) => {
			if (error) throw error;
			res.status(201).json({
				message: 'Opération réussie',
				createdProduct: product
			});
		}
	);
});

//Ajouter en cas de non correspondance avec un id
router.get('/:productId', (req, res, next) => {
	connection.query('SELECT * FROM products WHERE id = ' + req.params.productId, (error, results, fields) => {
		if (error) {
			res.status(500).json({
				message: 'Erreur'
			});
			throw error;
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
		"UPDATE products SET name = '" +
			req.body.name +
			"', price = '" +
			req.body.price +
			"' WHERE id = " +
			req.params.productId,
		(error, results, fields) => {
			if (error) {
				res.status(500).json({
					message: 'Erreur'
				});
				throw error;
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
			res.status(500).json({
				message: 'Erreur'
			});
			throw error;
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
