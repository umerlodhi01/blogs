const mongoose = require('mongoose');
const jwt = require('jsonwebtoken')
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt")
const config = require('../config/dev')

const userSchema = new Schema({
    name: {
        type: String,
        required: 'Name is Required',
    },
    address: {
        type: String,
        required: 'Address is Required',
    },
    email: {
        type: String,
        required: 'Email is Required',
        lowercase: true,
        unique: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/]
    },
    image: {
        type: String,
    },
    phone: {
        type: String,
        required: 'Phone is Required',
    },
    status: {
        type: Boolean,
    },
    password: {
        type: String,
        required: true,
        minlength: [6, 'Too short, min is 6 characters']
    },
});

userSchema.pre("save", function(next){
    const user = this;

    bcrypt.genSalt(10, function(err, salt) {
       if(err){ return next(err);}

       bcrypt.hash(user.password, salt, function(err, hash){
           if(err){ return next(err);}

           user.password = hash;
           next();
       });
    });
 });

 userSchema.methods.comparePassword = function(candidatePassword, callback){
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch){
       if(err) {return callback(err);}

       callback(null, isMatch);
    });
 }


 userSchema.methods.generateJWT = function () {
    return jwt.sign({
       email: this.email,
       id: this._id,

    }, config.JWT_SECRET, {expiresIn: '24h'})
 }

 userSchema.methods.toAuthJSON = function(){
    return {
       _id: this._id,
       name: this.name,
       address: this.address,
       email: this.email,
       phone: this.phone,
       image: this.image,
       token: this.generateJWT()

    }
 }

module.exports = mongoose.model('User', userSchema );
