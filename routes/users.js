const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const { storeReturnTo } = require('../middleware');
const users = require('../controllers/users');

//we can use router.route to grop togrther similar routes
router.get('/register', users.renderRegister);

router.post('/register', catchAsync(users.register));

router.get('/login', (req, res) => {
    res.render('users/login');
});

router.post('/login',
    // use the storeReturnTo middleware to save the returnTo value from session to res.locals
    storeReturnTo,
    // passport.authenticate logs the user in and clears req.session
    passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }),
    // Now we can use res.locals.returnTo to redirect the user after login
    users.login);

router.get('/logout', users.logout);
module.exports = router;