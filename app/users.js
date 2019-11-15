const express = require('express');
const router = express.Router();
const query = require('../query/query');

//Les différentes routes et requetes possibles

router.get('/getName/:id', query.getName)

router.get('/getFull/:userEmail', query.getFull);

router.post('/newUser/', query.newUser);

module.exports = router;
