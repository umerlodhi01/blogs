const express = require('express');
const router = express.Router();
const User = require('../models/users')
const formidableMiddleware = require('express-formidable');



const UsersCtrl = require('../controllers/users');
const AuthCtrl = require('../controllers/auth');
router.post('/register', formidableMiddleware(), UsersCtrl.register);
router.get('/checkEmail/:email', UsersCtrl.checkEmail);
router.post('/login', UsersCtrl.login);
router.get('/getVerifiedUsers', UsersCtrl.getVerifiedUsers);
router.get('/getUnVerifiedUsers', UsersCtrl.getUnVerifiedUsers);
router.put('/markUnVerified/:id', UsersCtrl.markUnVerified);
router.put('/markVerified/:id', UsersCtrl.markVerified);
router.get('/userById/:id', UsersCtrl.userById);
router.get('/getAllUsersForMessages/:id', UsersCtrl.getAllUsersForMessages);
router.get('/me', AuthCtrl.onlyAuthUser, UsersCtrl.getCurrentUser)
router.post('/sendMessage/:id', UsersCtrl.registerMessage);
router.get('/getUserMessages/:id', UsersCtrl.getUserMessages);


module.exports = router;
