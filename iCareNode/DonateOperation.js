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
        var userDetail = request.body.user;

        for (key in userDetail){
            console.log(key);
            console.log(userDetail[key]);
            donate.user = userDetail;//{userID:"test",userName:"t"};
           // donate.user[key] = userDetail[key];

        }


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

            if(name == 'user'){

                //Object Type
                //donate.user = {userID : value};

                var userDict = JSON.parse(value);
                for (key in userDict)
                {
                    var v = userDict[key];
                    console.log(v);
                }

                // Array types
                //donate.user.push({ userID: value });
            }
            else
            {
                donate[name] = value;
            }
        });
        form.on('file',function(name,value){
            var tmpPath = value.path;
            //var target_path = './uploads/' + value.originalFilename;
            //donate.itemImage.data = fs.readFileSync(tmpPath);
            //donate.itemImage.contentType = 'image/png';

        });

        form.on('close',function(){
            // callBack('okay');
            //donate.user.push({ userID: mynameis });
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