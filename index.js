const express = require('express')
const app = express()
const mongoose = require('mongoose')
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const engine = require('ejs-mate');
const path = require('path')
const User = require('./models/user');

//requiring passport 
const passport = require('passport');
const LocalStrategy = require('passport-local');


//Routes 
const UserRoute = require('./Routes/userRoute');
const CampgroundRoute = require('./Routes/campgroundRoute');
const ReviewRoute = require('./Routes/reviewRoute');

//Error handling
const ExpressError = require('./utils/ExpressError');

//connecting mongodb database to server 
mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser : true, 
    useUnifiedTopology : true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error!!!"));
db.once("open", () => {
    console.log("Database Conncted");
})

app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({extended : "true"}))
app.use(methodOverride('_method'))

//using session 
const sessionConfig = {
    secret : 'ThisIsSecret',
    resave : false,
    saveUninitialized : true,
    cookie : {
        httpOnly : true,
        expries : Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge : 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));
//running flash 
app.use(flash())

app.use(passport.initialize());
app.use(passport.session());
passport.use( new LocalStrategy(User.authenticate()))

passport.serializeUser( User.serializeUser());
passport.deserializeUser( User.deserializeUser());

app.use( (req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.user = req.user;
    next();
})

//campgrounds route & review route 
app.use('/', UserRoute);
app.use('/campgrounds', CampgroundRoute);
app.use('/campgrounds/:id/review', ReviewRoute);

//routes other than our application routes 
app.all('*', (req, res) => {
    throw new ExpressError(404,'Page Not Found!!!!!!');
})

//error handling middleware 
app.use( (err, req, res, next) => {
    const { status = 500, message = 'Something Went Wrong!!!!!!'} = err;
    res.render('campgrounds/error', {message});
})

app.listen(3000, () => {
    console.log("listening to port 2500");
})+