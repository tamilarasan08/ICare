/**
 * Created by muthamil on 12/10/15.
 */
var mongoose = require("mongoose");

var  Schema = mongoose.Schema;

var userSchema = new Schema({
    userID : String,
    userName : String
});

var donateSchema = new Schema({
    itemName:String,
    numberOfItems:Number,
    itemCategory:String,
    itemsFor:String,
    location:String,
    itemImage:{ data: Buffer, contentType: String },
    user : userSchema
});

module.exports = mongoose.model('DonateModel',donateSchema);