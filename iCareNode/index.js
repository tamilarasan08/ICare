var express = require("express");
var app = express();

var mongoose = require("mongoose");
mongoose.connect('mongodb://localhost:27017/icareDB');

var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json({ extended: true }))

//app.use(bodyParser.urlencoded({ extended: true }));
//app.use(bodyParser.json({ extended: true }))

var multer  = require('multer');
//var files = multer({ dest: 'files/' });

//app.use(bodyParser.json({ extended: true }));
//app.use(bodyParser.raw({extended:true}))

var port = 8084;

var DonateModel = require('./DonateModel');

var DonateOperation = require('./DonateOperation');

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

//router.post('/donatecreate', files.any(),function(request,response)
router.post('/donatecreate', function(request,response){


     DonateOperation.donateInsert(request,function(res){
        response.send(res);

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


});});

router.get('/donatecreate/itemName/:name', function(request,response){

    DonateOperation.donateSearchRecords(request,function(res){
        response.send(res);
    });


});


router.get('/donatecreate/itemName/:name/fieldID/:field', function(request,response){

    DonateOperation.donateSearch(request,function(res){
        //response.send(res);
       // response.contentType(res.contentType);
        response.send(res.data);
    });


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