const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user');
const passport = require('passport');
const user = require('../controllers/users');

router.route('/register')
    .get(user.registerUserForm)
    .post( user.registerUser);

router.route('/login')
.get(user.loginUserForm)
.post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), user.loginUser);

router.get('/logout', user.logoutUser);
module.exports = router;