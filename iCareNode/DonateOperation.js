/**
 * Created by muthamil on 12/11/15.
 */

var DonateModel = require('./DonateModel');

var multiparty = require('multiparty');
var fs = require('fs');

var donateInsert = function(request, callBack){

    var requestType = request.get('Content-Type');

    if(requestType == 'application/json')
    {
        var donate = new DonateModel();
        donate.itemName = request.body.itemName;
        donate.numberOfItems = request.body.numberOfItems;
        donate.itemCategory = request.body.itemCategory;
        donate.itemsFor = request.body.itemsFor;
        donate.location = request.body.location;

        donate.save(function(err){
            if(err)
            {
                callBack(err);
            }
            else{
                callBack(donate);
            }
        });
    }
    else if(requestType.indexOf('multipart/form-data')>-1)
    {
        var donate = new DonateModel();
        var form = new multiparty.Form();
        form.parse(request);
        form.on('field', function(name , value)
        {
                donate[name] = value;
        });
        form.on('file',function(name,value){
            var tmpPath = value.path;
            var target_path = './uploads/' + value.originalFilename;
            donate.itemImage.data = fs.readFileSync(tmpPath);
            donate.itemImage.contentType = 'image/png';
            donate.user.userID = request.get(user);
            donate.save(function(err){
                if (err)
                {
                    console.log('error');
                }
                else
                {
                    console.log('success');
                }

            });
            //fs.renameSync(tmpPath, target_path, function(err) {
            //    if(err)
            //    {
            //        console.error(err.stack);
            //    }
            //    else
            //    {
            //        //saving image to db
            //        donate.itemImage.data = fs.readFileSync(target_path);
            //        donate.save(function(err) {
            //            if (err) {
            //                callBack(err);
            //            }
            //        });
            //    }
            //});
        });

        form.on('close',function(){
           // callBack('okay');
            donate.save(function(err){
                if(err)
                {
                    callBack(err);
                }
                else{
                    callBack(donate);
                }
            });
        });

    }

}

var donateSearchRecords = function(request , callBack){
    DonateModel.find({itemName:request.params.name}, function(err, donations) {
        if (err)
            response.send(err);

        callBack(donations);
    });
}

var donateSearch = function(request , callBack){
    DonateModel.find({itemName:request.params.name}, function(err, donations) {
        if (err)
            response.send(err);

        var fieldName = request.params.field;
        var don = donations[0];
        //callBack(donations[0]);
        //console.log("donations----",donations[0]);
        //console.log("donations----",donations[0].itemName);
        //console.log("donations----",donations[0].itemImage);
        //console.log("donations----",donations[0].fieldName);
        //console.log("donations----",donations);
        //callBack(donations[0]);
        callBack(don[fieldName]);
    });
}

module.exports.donateInsert = donateInsert;
module.exports.donateSearchRecords = donateSearchRecords;
module.exports.donateSearch = donateSearch;