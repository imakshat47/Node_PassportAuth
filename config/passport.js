const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrpyt = require('bcryptjs');


// User model

const User = require('../models/User');

module.exports = function(passport) {
    passport.use(
        new LocalStrategy({
            usernameField: 'email'
        }, (email, password, done) => {
            // Match user email
            User.findOne({ email: email })
                .then(user => {
                    if (!user) {
                        return done(null, false, { message: 'Email is not registered!!' });
                    }

                    // Match Password
                    bcrpyt.compare(password, user.password, (err, isMatch) => {
                        if (err) throw err;

                        if (isMatch) {
                            return done(null, user);
                        } else {
                            return done(null, false, { message: 'Incorrect Email/Password' });
                        }
                    })
                })
                .catch(err => console.log(err))
        })
    );


    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, (err, user) => {
            done(err, user);
        });
    });

}