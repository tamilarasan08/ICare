/**
 * Created by muthamil on 12/10/15.
 */
var mongoose = require("mongoose");

var  Schema = mongoose.Schema;

var donateSchema = new Schema({
    itemName:String,
    numberOfItems:Number,
    itemCategory:String,
    itemsFor:String,
    location:String
});

module.exports = mongoose.model('DonateModel',donateSchema);