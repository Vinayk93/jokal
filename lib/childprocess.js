/**
 * [exports description]
 * @param  {[type]}   dockerId    [description]
 * @param  {[type]}   dockervalue [description]
 * @param  {Function} callback    is in 3 format (found,err,data) and then data (status,headers,body)
 * @return {[type]}               [description]
 */
var childprocess =require('child_process');
function runcommnad(options){
    var externalNodeProcess = childprocess.spawn('docker', options, {
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
}
// runcommnad(['run',
// '-d',
// '-it',
// '--name',
// 'jokal11',
// '-v',
// process.cwd()+'/lambda:/app:z',
// 'node']);
runcommnad(['rm','-f','b18acb3f4321']);
