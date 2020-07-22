const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');

// Welcome page
router.get('/', (req, res) => res.render('welcome'));
// Dashbaord
router.get('/dashbaord', ensureAuthenticated, (req, res) =>
    res.render('dashboard', {
        name: req.user.name
    })
);

module.exports = router;