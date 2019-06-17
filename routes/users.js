const express =require('express');
const router =express.Router();
const mongoose = require('mongoose');
//Home page
router.get('/',(req, res, next)=>{
res.render('users');
});
module.exports = router;