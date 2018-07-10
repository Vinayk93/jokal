/**
 * [exports description]
 * @param  {[type]}   dockerId    [description]
 * @param  {[type]}   dockervalue [description]
 * @param  {Function} callback    is in 3 format (found,err,data) and then data (status,headers,body)
 * @return {[type]}               [description]
 */
// commnad="sudo docker run -d -it --name jokal -v "+process.cwd()+"/lambda:/app:z node";
const childprocess = require('child_process');
console.log("done");
const _ = require('underscore');
var id='asdasdas';
var defaultprocess = childprocess.spawn('docker',[
    'rm',
    '-f',
    id
    ],{
        stdio:['pipe','pipe','pipe']
    });

defaultprocess.send = function(msg){
    app.process.stdin.write(JSON.stringify(msg)+'\n');
  }

defaultprocess.stdout.on('data',function writeOutDockerLog(data){
    console.log(data);
    let msgs = [];
    let s="";
    try {
        s += data.toString('utf8');
        console.log(s);
            var lines = s.split("\n");
            msgs.push(lines);
    } catch (e) {
        console.log(e);
        console.error('Docker STDOUT Error:', e, data.toString())
    } finally {
        console.log("done");
      msgs.forEach((m)=>{
        defaultprocess.emit('message', m);
      })
    //   StartDocker();
    }
});

// function StartDocker(){
var externalNodeProcess = childprocess.spawn('docker', [
    'run',
    '-d',
    '-it',
    '--name',
    'jokal',
    '-v',
    process.cwd()+'/lambda:/app:z',
    'node'
  ], {
    stdio: ['pipe', 'pipe', 'pipe']
  });

  externalNodeProcess.send = function(msg){
    app.process.stdin.write(JSON.stringify(msg)+'\n');
  }
  
  // provide on('message') events from stdout - this will also fire on console.log commands, so you need to wrap those if you want to do any other sort of messaging
  externalNodeProcess.stdout.on('data', function writeOutDockerLog(data) {
    //   console.log(data);
      console.log("DOCKER START");
    let msgs = [];
    let s="";
    try {
        // var textChunk = chunk.toString('utf8');
    //   data.toString('utf8').split('\n').map((m) => { if ( !_.isEmpty(m) ) msgs.push((m + '\n')); })
    
    s += data.toString('utf8');
    console.log(s);
        var lines = s.split("\n");
        msgs.push(lines);
    } catch (e) {
        console.log(e);
      console.error('Docker STDOUT Error:', e, data.toString())
    } finally {
        console.log("done");
      msgs.forEach((m)=>{
        externalNodeProcess.emit('message', m);
      })
    }
  });
// }
module.exports = function (dockerUrl,dockerMethod,dockerValue,callback) {
    /**
     * docker ps
     * get id and store in the variable 
     * then execute the 
     * node inside whenever it execute with some varubale pass into it.
     */

	/**
     * 
     * Find the dockerId and then execute it and get the response and gives error based on that
     * 
     */

};