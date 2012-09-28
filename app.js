var connect = require('connect');
var express = require('express');
var util = require('util');
var http = require('http');
var querystring = require('querystring');
var siteConf = require('./lib/getConfig');
var cloudspokes = require("./lib/cloudspokes.js");
var _ = require('underscore');

//Authentication setup using passport module
var passport = require('passport');
var GitHubStrategy = require('passport-github').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var ForceDotComStrategy = require('passport-forcedotcom').Strategy;

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

//GITHUB
passport.use(new GitHubStrategy(siteConf.authKeys.github,
  function(accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
      return done(null, profile);
    });
  }
));

// FACEBOOK
passport.use(new FacebookStrategy(siteConf.authKeys.facebook,
  function(accessToken, refreshToken, profile, done) {
      return done(null, profile);
  }
));

// TWITTER
passport.use(new TwitterStrategy(siteConf.authKeys.twitter,
  function(token, tokenSecret, profile, done) {
      return done(null, profile);
  }
));

// GOOGLE
passport.use(new GoogleStrategy(siteConf.authKeys.google,
  function(accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
      return done(null, profile);
    });
  }
));

// FORCE.COM
passport.use(new ForceDotComStrategy(siteConf.authKeys.force,
  function(token, tokenSecret, profile, done) {
    return done(null, profile);
  }
));

var app = module.exports = express();
var cs = cloudspokes.init();

app.configure(function() {
    app.set('view engine', 'jade');
    app.set('views', __dirname + '/views');
    app.set('view options', {
        layout: false
    });
    app.use(express.static(__dirname + '/public'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser());
    app.use(express.session({ secret: 'cl0udsp0kem0bile' }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(app.router);
    });


app.listen(siteConf.port, null);
app.configure('development',
    function() {
        app.use(express.errorHandler({
            dumpExceptions: true,
            showStack: true
        }));
    }
);

app.configure('production',
    function() {
        app.use(express.errorHandler());
    }
);

app.get('/',
    function(req,res) {
        if (req.isAuthenticated()) {
            res.redirect('/account');
        } else {
            res.render('home', {services: siteConf.services } );
        }
    }
)

app.get('/welcome/:username', function(req,res) {
  req.logout();
  res.render('welcome', { username: req.params.username });
});

NotFound.prototype.__proto__ = Error.prototype;

app.get('/account', ensureAuthenticated, function(req, res){
  res.render('account', { user: req.user });
});

app.post('/create', function(req, res, callback){
  // console.log('called create....' + util.inspect(req.body));
  cs.createAccount(req.body, function(err, results){
    console.log(results['response']);
    res.write(JSON.stringify(results['response']));
    res.end();    
  });
});

// app.post('/account', function(req, res){
//   cs.createAccount(req.body, function(err, results){
//     if (results['response']['success'] == 'true') {
//       console.log(results['response'])
//     } else {
//       res.render('account', { error: results['response']['message'], 
//         user: { displayName: req.body['name'], username: req.body['username'], 
//         provider: req.body['provider'], emails:[{value: req.body['email']}] } } );
//     }
//   });
// });

app.get('/account-test', function(req, res){
    res.render('account', { user: { displayName: 'Jeff Douglas', username: 'jeffsignup1', provider: 'github', emails:[{value:'jeffsignup1@jeffdouglas.com'}] } } );
});

app.get('/auth/github',
  passport.authenticate('github'),
  function(req, res){
    //will not be called
  });

// /auth/github/callback called back by github oauth
app.get('/auth/github/callback', 
  passport.authenticate('github', { /*failureRedirect: '/' */}),
  function(req, res) {
    res.redirect('/account');
  });


app.get('/auth/facebook',
  passport.authenticate('facebook'),
  function(req, res){
    // will not be called.
  });

// /auth/facebook/callback called back by facebook oauth
app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/account');
  });


app.get('/auth/twitter',
  passport.authenticate('twitter'),
  function(req, res){
    // will not be called.
});


app.get('/auth/twitter/callback', 
  passport.authenticate('twitter', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/account');
  });


app.get('/auth/google',
  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/userinfo.profile',
                                            'https://www.googleapis.com/auth/userinfo.email'] }),
  function(req, res){
    // will not be called.
  });

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/account');
  });

app.get('/auth/force', passport.authenticate('forcedotcom'),
    function(req, res){
        //will not be called
    });
app.get('/auth/force/callback', 
  passport.authenticate('forcedotcom', { failureRedirect: '/' }),
  function(req, res){
    res.render("account",req);
  });

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/')
}
app.get('/*',
    function(req,res) {
        throw new NotFound('Page not found');
    }
);

function NotFound(msg) {
    this.name = 'NotFound';
    Error.call(this, msg);
    //Error.captureStackTrace(this, arguments.callee);
}

app.get('/404',
    function(req, res) {
        throw new NotFound;
    }
);

app.get('/500',
    function(req, res) {
        throw new Error('500 Error');
    }
);
