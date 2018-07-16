console.log("okasdas");
var aws = require('aws-sdk');

exports.handler = function(event,context,callback){
    console.log("Executed");
    console.log("I wanna funk baby");
    callback("fuck bitches");
}