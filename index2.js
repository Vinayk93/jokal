/**
 * Start the docker image with nodemon installed
 * Now 
 * implement multiple servers docker-call with id and port no.
 * now proxy server with it.
 * "npm proxy-server"
 */

 /**
  * implementation 1
  * create as many server as the json provided
  * Now every folder containes its image and the server isolation via using docker 
  * 
  * implemenation 2
  * create docker inside server with the subnet on it. or VPC via selection
  * 
  */
var jokal = require('./docker');

/**location,environment-variable,callback for starting the process */
var fs = require('fs');
fs.readFile(process.cwd()+'/Cloud.json',function(err,data){
    if(err){
        console.log(err);
    }
    if(data){
        try{
            Cloud = JSON.parse(data.toString());
            jokal.start(Cloud);
        }catch(e){
            console.log(e);
        }
    }
});
