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


var port = 8083;

var DonateModel = require('./DonateModel');
var DonateOperation = require('./DonateOperation');

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

//router.post('/donatecreate', files.any(),function(request,response)
router.post('/donatecreate', function(request,response){

     DonateOperation.donateInsert(request,function(res){
        response.send(res);
    });


});

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

app.use('/', router);
app.listen(port);
console.log("server running");