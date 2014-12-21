var express = require('express'),
    session = require('express-session'),
    path = require('path'),
    app = express(),
    passport = require('./auth-middleware'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    port = 8080;



// set views
// engine html
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: 'keyboard cat'
}));

app.use(passport.initialize());
app.use(passport.session());

app.get('/', ensureAuthenticated, function(req, res) {
    res.render('index.html', {
        user: req.user
    });
});

app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

app.get('/login', function(req, res) {
    res.render('login.html', {
        user: req.user
    });
});

app.post('/login', function(req, res, next) {
        console.log(req.body);
        next();
    },
    passport.authenticate('local', {failureRedirect: '/login'}),
    function(req, res) {
        res.redirect('/');
    }
);

app.get('/auth/github', passport.authenticate('github'));
app.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  }
);

app.listen(port);

console.log('Server is up on port %s.', port);

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/login');
}