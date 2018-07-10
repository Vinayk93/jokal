var Execution={
    "Module":process.argv[2],
    "Folder":process.argv[3].split('.')[0],
    "Extension":process.argv[3].split('.')[1],
    "event":process.argv[3],
    "context":process.argv[4]
};
console.log(Execution);
var lambda = require('../examples/lambda/'+Execution.Module+"/"+Execution.Folder);
lambda[Execution.Extension];
