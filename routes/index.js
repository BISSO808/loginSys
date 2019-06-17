const express =require('express');
const router =express.Router();
const { check, validationResult } = require('express-validator/check');
User = require('../model/users');
const passport= require('passport');
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs');
//Home page
router.get('/',ensureAuthenticated,(req, res, next)=>{
res.render('index');
});
//login
router.get('/login',(req, res, next)=>{
  res.render('login', { 
  });
});
//signup
router.get('/register',(req, res, next)=>{
    res.render('register', { 
    //   success:req.session.success,
    //   errors: req.session.errors
     
  });
    // req.session.errors =null;
});

// validation without using session(only if then statement )
// the req is what you recieve and res is what you respond with
router.post('/submit',(req, res, next)=>{
  req.check('email','invalid email id').isEmail();
  req.check('password', 'password is invalid').isLength({min:1})
  req.check('password', 'password is doesnot match').equals(req.body.confirmpassword);
  req.check('name','name field is empty').isLength({min:1});
  req.check('lastname','last name field is empty').isLength({min:1});
  req.check('username','username is empty').isLength({min:1});
  var errors= req.validationErrors();
  if (errors){
  res.render('register',{
    errors:errors
  });
  }
  else{
let newUser = new User({
  name: req.body.name,
  lastname:req.body.lastname,
  email: req.body.email,
  password: req.body.password,
username : req.body.username
});
// not duplicate usernames
let username=req.body.username;
User.getUser({username},(err,user)=>{
  if(err) throw err;
  if(user){
    req.flash('error_msg', 'username is already taken')
    res.redirect('/register');
  }else{
    User.registerUser( newUser ,(err,user) => {
      if(err)throw err;
      req.flash('success_msg', 'you are registered as a user')
      res.redirect('/login');
     });
     }
     });
  }
  });
// router.post('/signin',(req, res, next)=>{
// user.getUser({username: req.body.username},(err,user)=>{
// if (err) return err;
// else{

// }
// })
// });
passport.use(new LocalStrategy(
  (username,password, done) =>{
        User.getUser({ username: username }, (err, user) =>{
          if (err) { return done(err); }
          if (!user) {
          return done(null, false, { message: 'Incorrect username.' });
        }
        bcrypt.compare(password, user.password,(err, isMatch)=>{
          if(err) return err;
          if(isMatch){
            return done(null, user);
          }else{
              return done(null, false, { message: 'wrong password' });
          }
              });
          });
        })
);
        
// passport.serializeUser((user, cb) =>{
//   cb(null, user.id);
// });

// passport.deserializeUser((id, cb) =>{
//   db.users.findById(id,(err, user) =>{
//     if (err) { return cb(err); }
//     cb(null, user);
//   });
// });
passport.serializeUser((user, done) =>{
  done(null, user.id);
});

passport.deserializeUser((id, done)=> {
  User.findById(id,(err, user)=> {
    done(err, user);
  });
});
router.post('/login', (req, res, next)=>{
  passport.authenticate('local', {
   failureRedirect: '/login'
  , failureFlash:true,
 successRedirect:'/'
})(req, res, next)
});
// router.post('/submit',(req, res, next)=>{ 
// Register.create({
// name: req.body.name,
// lastname : req.body.lastname,
// email : req.body.email,
// password : req.body.password,
// username  : req.body.username, 
// confirmpassword : req.body.confirmpassword
//   }).then(user => res.json(user));
// });

// router.post('/register',[
// check('email').not().isEmail().withMessage('The Last name is required'),
// check('password').not().isEmpty().withMessage('The Last name is required'),
// check('name').not().isEmpty().withMessage('The Last name is required'),
// check('lastname').not().isEmpty().withMessage('The Last name is required'),
// check('email').not().isEmpty().withMessage('The Last name is required'),
// check('username').not().isEmpty().withMessage('The Last name is required'),
// check('confirmpassword').not().isEmpty().withMessage('The Last name is required')
// ],(req, res)=>{
// const errors = validationResult(req)
// if(!errors.isEmpty()){
//   return res.status(422).json({ errors: errors.array() });
// }
// else{
// console.log('Success');
// }
// });
router.get('/logout', function(req, res){
  req.logout();
  req.flash('success_msg','you are logged out');
  res.redirect('/login');
});
function ensureAuthenticated(req, res ,next){
if(req.isAuthenticated()){
 
  return next();
}
else{
  req.flash('error_msg','you need to log in');
  res.render('login')
}
}
module.exports = router;