const express = require('express');
const router = express.Router();
const query = require('./query');
// const checkAuth = require('./check-auth');

//Les différentes routes et requetes possibles
router.get('/:id', query.get);

router.get('/getName/:id', query.getName)

router.get('/getFull/:userEmail', query.getFull);

router.post('/newUser/', query.newUser);


// router.get('/', query.get_all);

// router.get('/login/:mail/:mdp', query.login)

// router.patch('/:userId', checkAuth, query.patch_user);

// router.delete('/:userId', checkAuth, query.delete_user);

module.exports = router;
