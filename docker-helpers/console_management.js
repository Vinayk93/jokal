var fs = require('fs');
const { Console } = require('console');
module.exports = function(logfile){
    const output = fs.createWriteStream(logfile+'/stdout.log');
    // const errorOutput = fs.createWriteStream('./stderr.log');
    // custom simple logger
    // { stdout: process.stdout, stderr: process.stderr }
    const console = new Console(output);
    // use it like console
    const count = 5;
    console.log('count: %d', count);
    global.console.log = console.log;
}
