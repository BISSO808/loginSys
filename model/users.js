const mongoose = require('mongoose');
//connect to database
mongoose.connect('mongodb://localhost/passportapp',{useNewUrlParser: true});
//bcrypt is used to hash the password
const bcrypt= require('bcryptjs');
//This is creating Schema it is done in case of mongoose.
//user Schema
const userSchema = mongoose.Schema({
name: String,
lastname: String,
username: String,
email: String,
password: String
});
 //This is done because it let us to access this thing from every where( the export)
const User= mongoose.model('User', userSchema);
module.exports = User;

// Create user
module.exports.registerUser= function(newUser , callback){
    bcrypt.genSalt(10, (err, salt)=>{
bcrypt.hash(newUser.password, salt,(err,hash)=>{
if(err){
    console.log(err);
}else{
    newUser.password= hash;
    newUser.save(callback);
}
})
    });
}

module.exports.getUser=function(username,callback){
    User.findOne(username,callback);
}
