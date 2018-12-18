console.log("okasdas");

exports.handler = function(event,context,callback){
    console.log("Executed");
    console.log("I wanna funk baby");
    callback(null,{
        "statusCode":300,
        "headers":{
            "x-amz":"age=121"
        },
        "body":"fuck bitches"
    });
}
