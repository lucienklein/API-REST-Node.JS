const express = require('express');
const router = express.Router();
const checkAuth = require('./check-auth');
const query = require('./query');

//Les différentes routes et requetes possibles
router.get('/', query.get_all);

router.post('/signup', checkAuth, query.signup)

router.post('/login', query.login)

router.get('/:userId', query.get_user);

router.patch('/:userId', checkAuth, query.patch_user);

router.delete('/:userId', checkAuth, query.delete_user);

module.exports = router;
