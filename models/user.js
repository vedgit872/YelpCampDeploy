const { required } = require('joi');
const mongoose = require('mongoose');
const passportlocalmongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
});

userSchema.plugin(passportlocalmongoose);//automatically adds many functions such as username and password in the userSchema

module.exports = mongoose.model('User', userSchema);