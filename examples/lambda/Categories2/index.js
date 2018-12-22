console.log("okasdas");

exports.handler = function(event,context,callback){
    console.log(event);
    console.log("Executed");
    console.log("I wanna funk baby");
    callback(null,"fuck bitches 2");
}