/**
 * Created by aishwarya on 11/12/15.
 */



var mongoose = require("mongoose");

var  Schema = mongoose.Schema;

var userSchema = new Schema({
    name:String,
    password:String,
    category:String,
    photo:Buffer,
});

module.exports = mongoose.model('UserModel',userSchema);