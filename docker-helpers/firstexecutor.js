/**
 * exec -i -t 6407f3776f16 node jokal/firstexecutor.js lambda/Categories index.handler {} {}
 *  */
var bash={};
Object.assign(bash,global.console);
// console.log(process);
var Execution={
    "Module":process.argv[2],
    "Folder":process.argv[3].split('.')[0],
    "Extension":process.argv[3].split('.')[1],
    "event":process.argv[3],
    "context":process.argv[4]
};
require('./console_management')(__dirname+"/../log/");
/**
 * change console.log functionalities to something else
 * and then move all console.log to the container timer output which will be used for the log
 * and it is used for the output purpose only
 */

if(process.env.test=="true"){
    var lambda = require('../examples/lambda/'+Execution.Module+"/"+Execution.Folder);
        lambda[Execution.Extension](Execution.event,Execution.context,function(data){
            // console.log(data);
            bash.log(data);
        });
}else{
    var lambda = require('../app/lambda/'+Execution.Module+"/"+Execution.Folder);
    
    lambda[Execution.Extension](Execution.event,Execution.context,function(data){
        // console.log(data);
        bash.log(data);
    });
}
