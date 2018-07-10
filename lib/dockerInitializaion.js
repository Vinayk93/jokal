childprocess = require('child_process')
var externalNodeProcess = childprocess.spawn('docker', [
    'run',
    '-a', 'stdin', '-a', 'stdout', '-a','stderr',
    '-i',
    'node'
  ], {
    stdio: ['pipe', 'pipe', 'pipe']
  });
//   console.log(externalNodeProcess);      
  // to make it compatible with `fork` syntax
  
  // provide send to stdin
  externalNodeProcess.send = function(msg){
    app.process.stdin.write(JSON.stringify(msg)+'\n');
  }
  
  // provide on('message') events from stdout - this will also fire on console.log commands, so you need to wrap those if you want to do any other sort of messaging
  externalNodeProcess.stdout.on('data', function writeOutDockerLog(data) {
      console.log(data);
      console.log("find these");
    let msgs = [];
    try {
      data.toString().split('\n').map((m) => { if ( !_.isEmpty(m) ) msgs.push(JSON.parse(m + '\n')); })
    } catch (e) {
        console.log(e);
      console.error('Docker STDOUT Error:', e, data.toString())
    } finally {
        console.log("don");
      msgs.forEach((m)=>{
        externalNodeProcess.emit('message', m);
      })
    }
  });