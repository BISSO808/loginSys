const express= require('express');
const path= require('path');
//using the body parser basically lets you access the req.body commands
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const expressValidator= require('express-validator');
const session = require('express-session');
const exphbs = require('express-handlebars');
const passport = require('passport');
const port = 3000;
//route the files
const index = require('./routes/index');
const users = require('./routes/users');

//initialize the app
const app = express();

//handllebars and viewengine
app.engine('handlebars',exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');


//bodyparser and middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//express validator
app.use(expressValidator());

//express session
app.use(session ({
secret :'secret',
saveUninitialized: true,
resave: true
}));
// passwort js  middleware
app.use(passport.initialize());
app.use(passport.session());
 //express messages
app.use(flash());
app.use(function (req, res, next) {
  //apprently you have to use this commands in case of express not sure why
  res.locals.success_msg= req.flash('success_msg');
  res.locals.error_msg= req.flash('error_msg');
  res.locals.error= req.flash('error');
  res.locals.user= req.user || null;
  next();
});

//routing the stuff
app.use('/',index);
app.use('/users',users);

//This is  for port
app.listen(port,()=>{
    console.log('server started on port '+port);
});
