/**
 * Created by aishwarya on 11/12/15.
 */

var UserModel = require('./UserModel');
var multiparty = require('multiparty');
var fs = require('fs');

insertUser=function(request,callBack)
{
    var user = new UserModel();
    user.name = request.body.name;
    user.password = request.body.password;
    user.category=request.body.category;
    user.save(function(err){
        if(err)
        {
            var responseJson = JSON.stringify({
                "error_message":err.toString(),
                "error_code":100
            });
            callBack(responseJson);
        }
        else{
            var responseJson = JSON.stringify({
                "error_message":"Successfuly created User",
                "error_code":0
            });
            callBack(responseJson);
        }
    });

}

insertUserWithMultipart=function (request,callBack) {

    var form = new multiparty.Form();
    var user = new UserModel();
    var responseJson;
    form.on('file', function(name,file){
            user.photo = fs.readFileSync(file.path);

    });
    form.on('field', function(key,value){
        console.log("key "+key+" value "+value)
        user[key]=value
    });

    form.on("close", function() {

        user.save(function (err) {
            if(err)
            {
                 responseJson = JSON.stringify({
                    "error_message":err.toString(),
                    "error_code":400
                });
            }
            else{
                 responseJson = JSON.stringify({
                    "error_message":"Successfuly created User",
                    "error_code":0
                });

            }
            callBack(responseJson);
        });

    });

    form.parse(request);
    //form.parse(request, function(err, fields, files) {
    //    console.log(fields)
    //    console.log(files)
    //
    //    user.photo = fs.readFileSync(file.path);
    //});

}

getAllUsers=function (callBack)
{
    UserModel.find(function(err,users){


        if(err)
        {
            var responseJson = JSON.stringify({
                "error_message":err.toString(),
                "error_code":300
            });
            callBack(responseJson);
        }
        else{
            callBack(users)
        }


    });
}


loginUser=function (request,callBack)
{
    var responseJson;
    var user = new UserModel();
    user.name = request.body.name;
    user.password = request.body.password;
    user.category = request.body.category;

    UserModel.find({ "name": user.name } ,function(err,users){

        if(err)
        {
             responseJson = JSON.stringify({
                "error_message":err.toString(),
                "error_code":600
            });
            callBack(responseJson);
        }
        else if (users.count > 0){
            if(users[0].password==user.password)
            {
                if(users[0].category==user.category)
                {
                    responseJson= JSON.stringify({
                        "error_message":"Successfuly logged in User",
                        "error_code":0
                    });
                }
                else
                {
                    responseJson= JSON.stringify({
                        "error_message":"Cannot log in as "+user.category,
                        "error_code":700
                    });
                }
            }
            else
            {
                responseJson= JSON.stringify({
                    "error_message":"Incorrect login credentials",
                    "error_code":800
                });
            }

            callBack(responseJson);
        }
        else
        {
            responseJson = JSON.stringify({
                "error_message":"No users present",
                "error_code":900
            });
            callBack(responseJson);
        }
    });
}

module.exports.insertUser=insertUser
module.exports.insertUserWithMultipart=insertUserWithMultipart
module.exports.getAllUsers=getAllUsers
module.exports.loginUser=loginUser