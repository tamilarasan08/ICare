var express = require("express");
var app = express();

var mongoose = require("mongoose");
mongoose.connect('mongodb://localhost:27017/icareDB');

var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
//app.use(bodyParser.json({ extended: true }));
//app.use(bodyParser.raw({extended:true}))

var port = 8084;

var DonateModel = require('./DonateModel');
var userProcess=require('./UserProcess')



var router = express.Router();

router.get('/donator', function(request,response){
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
    console.log(request.body.location)
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



router.post('/createUser', function(request,response){
    console.log(request.body.name)
    if(request.get('Content-Type').indexOf('json') !== -1) {
        console.log(request.body.name)
        userProcess.insertUser(request,function(data){
            response.send(data)
        });
    }
    else if(request.get('Content-Type').indexOf('multipart') !== -1)
    {
        userProcess.insertUserWithMultipart(request,function(data){
            response.send(data)
        });
    }
});


router.get('/getAllUsers', function(request,response){
    console.log("getAllUsers")
    userProcess.getAllUsers(function(data){
        response.send(data)
    });
});

//router.post('/loginUser',function(request,response){
//    console.log("getAllUsers")
//    userProcess.loginUser(function(data){
//        response.send(data)
//    });
//});

app.use('/', router);
app.listen(port);
console.log("server running");