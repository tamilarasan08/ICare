/**
 * Created by aishwarya on 11/12/15.
 */

var UserModel = require('./UserModel');
var multiparty = require('multiparty');
var fs = require('fs');
var form = new multiparty.Form();

insertUser=function(request,callback)
{
    var user = new UserModel();
    user.name = request.body.name;
    user.password = request.body.password;

    user.save(function(err){
        if(err)
        {
            callback(err)
        }
        else{
            callback('Successfuly created User '+user.name);
        }
    });

}

insertUserWithMultipart=function (request,callBack) {

    var user = new UserModel();

    form.on('file', function(name,file){
            user.photo = fs.readFileSync(file.path);

    });
    form.on('field', function(key,value){
        console.log("key "+key+" value "+value)
        user[key]=value
    });

    form.on("close", function() {

        user.save(function (err) {
            if (err) {
                console.log("Error while saving user %s",err.toString())
                callBack('Error while creating user ' + err.toString())
            }
            else {
                console.log("Successfuly saved user")
                callBack('Successfully create user '+user.name)
            }
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
            console.log("Error while retrieving users"+err)
        }
        else
        {
            console.log("Users %s",users.toString())
            callBack(users)
        }

    });
}
module.exports.insertUser=insertUser
module.exports.insertUserWithMultipart=insertUserWithMultipart
module.exports.getAllUsers=getAllUsers