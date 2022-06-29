const User = require('../models/user');
const passport = require('passport');

module.exports.registerUserForm = (req, res) => {
    res.render('user/register');
}

module.exports.registerUser = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if(err) return next(err);
            req.flash('success', 'Welcome to Yelpcamp')
            res.redirect('/campgrounds');
        })

    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
}

module.exports.loginUserForm = (req, res) => {
    res.render('user/login');
}

module.exports.loginUser = (req, res) => {
    req.flash('success', 'Welcome back')
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logoutUser = (req, res) => {
    req.logout();
    req.flash('success', 'Logged you out, Bye :( ');
    res.redirect('/campgrounds');
}