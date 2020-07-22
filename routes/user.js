const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

// User Model
const User = require('../models/User');

// Login Page
router.get('/login', (req, res) => res.render('login'));

// Register
router.get('/register', (req, res) => res.render('register'));


// RegisterHandle
router.post('/register', (req, res) => {
    const { name, email, password, password2 } = req.body;

    let errors = [];

    // Check required feilds
    if (!name || !email || !password || !password2) {
        errors.push({ msg: "Please fill in all feilds." });
    }

    // Check password match
    if (password != password2) {
        errors.push({ msg: 'Passwords not matched.' });
    }

    // Check pass length
    if (password.length < 6) {
        errors.push({ msg: 'Password Should be altest 6 characters.' });
    }

    if (errors.length > 0) {
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        });
    } else {
        // Validation Pass
        User.findOne({ email: email })
            .then(user => {
                if (user) {
                    // Users Exists
                    errors.push({ msg: 'Email is already Registered!!' });
                    res.render('register', {
                        errors,
                        name,
                        email,
                        password,
                        password2
                    });
                } else {
                    const newUser = new User({
                        name,
                        email,
                        password
                    });

                    // Hash passowrd
                    bcrypt.genSalt(10, (err, salt) =>
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) throw err;
                            // Update hash in password
                            newUser.password = hash;

                            // Save User
                            newUser.save()
                                .then(user => {
                                    req.flash('success_msg', 'You can login Now!!');

                                    res.redirect('/user/login');
                                })
                                .catch(err => console.log(err));
                        }));
                }
            });

    }

});


// Login Model
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashbaord',
        failureRedirect: '/user/login',
        failureFlash: true
    })(req, res, next);
});

// Logout Handle
router.get('/logout', (req, res) => {
    req.logOut();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/user/login');
});

module.exports = router;