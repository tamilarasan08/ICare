var express = require("express");
var app = express();

var mongoose = require("mongoose");
mongoose.connect('mongodb://localhost:27017/icareDB');

var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


var port = 8083;

var DonateModel = require('./DonateModel');

var router = express.Router();

router.get('/', function(request,response){
    DonateModel.find(function(err,donations){
        if(err)
        {
            response.send(err);
        }
        else
        {
            response.send(donations);
        }

    });
   // console.log("EMPTY GET");
    //response.json('Test');
});

router.post('/', function(request,response){
    console.log(request.body);
    response.json('Test');
});

router.post('/donatecreate', function(request,response){

    var donate = new DonateModel();
    donate.itemName = request.body.itemName;
    donate.numberOfItems = request.body.numberOfItems;
    donate.itemCategory = request.body.itemCategory;
    donate.itemsFor = request.body.itemsFor;
    donate.location = request.body.location;

    donate.save(function(err){
    if(err)
    {
        response.send(err);
    }
    else{
        response.send(donate);
    }
    });
    console.log(request.body);
    console.log(request.headers);
    //response.json(donate);
});

app.use('/', router);
app.listen(port);
console.log("server running");