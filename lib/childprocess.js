/**
 * [exports description]
 * @param  {[type]}   dockerId    [description]
 * @param  {[type]}   dockervalue [description]
 * @param  {Function} callback    is in 3 format (found,err,data) and then data (status,headers,body)
 * @return {[type]}               [description]
 */
var childprocess = require('child_process');

function runcommnad(options,Log,callback){
    out = [];
    var s="";
    var externalNodeProcess = childprocess.spawn('docker', options, {
        stdio: ['pipe', 'pipe', 'pipe']
    });
    externalNodeProcess.send = function(msg){
        app.process.stdin.write(JSON.stringify(msg)+'\n');
        
    }
    // provide on('message') events from stdout - this will also fire on console.log commands, so you need to wrap those if you want to do any other sort of messaging
    externalNodeProcess.stdout.on('data', function writeOutDockerLog(data) {
        try {
                s = data.toString('utf8');
                // console.log(s);
                    var lines = s.split("\n");
                    
                    out.push(lines);
                    // console.log(msgs);
            } catch (e) {
                // console.log(e);
                // console.error('Docker STDOUT Error:', e, data.toString())
                callback(e,data.toString());
            }
        //   console.log(data);
        // console.log("DOCKER START");
        // let msgs = [];
        // let s="";
        // try {
        //     s += data.toString('utf8');
        //     console.log(s);
        //         var lines = s.split("\n");
        //         msgs.push(lines);
        //         console.log(msgs);
        // } catch (e) {
        //     console.log(e);
        //     console.error('Docker STDOUT Error:', e, data.toString())
        //     callback(e,data.toString());
        // } finally {
        //     console.log("done");
        //     if(Log=="silent"){
        //         msgs.forEach((m)=>{
        //             externalNodeProcess.emit('message', m);
        //         });
        //         callback(null,msgs);
        //     }else{
        //         callback(null,msgs);
        //     }
        // }
    });
    externalNodeProcess.stdout.on('end',function(args){
        // console.log("edn here");
        // console.log(out);
        callback(null,out);
    })
}
// runcommnad(['run',
// '-d',
// '-it',
// '--name',
// 'jokal11',
// '-v',
// process.cwd()+'/lambda:/app:z',
// 'node']);
// docker ps --format "{{println .Names}}{{.ID}}"
function historyFind(){
    return new Promise((resolve,reject)=>{
        // docker ps -f name=foo
        runcommnad(['ps','-a','-f','name=jokal','--format','{{println .Names}}{{.ID}}'],"na",function(err,data){
            console.log(err,data);
            // console.log("this is the id",data);
            if(data[0] == undefined){
                /**
                 * create a new one
                 */

                reject("Not running");
            }else{
                /**
                 * for loop find the name jokal
                 */
                
                resolve(data[0][1]);
                /**
                 * remove the previous one and make a new one
                 */
            }
        })
    })
}

function DockerRunning(){
    return new Promise((resolve,reject)=>{
        // docker ps -f name=foo
        runcommnad(['ps','--format','{{println .Names}}{{.ID}}'],"na",function(err,data){
            console.log(err,data);
            // console.log("this is the id",data);
            if(data[0] == undefined){
                /**
                 * create a new one
                 */

                reject("Not running");
            }else{
                /**
                 * for loop find the name jokal
                 */
                // console.log("docker running");
                resolve("docker running");
                /**
                 * remove the previous one and make a new one
                 */
            }
        })
    })
}

function Createdocker(){
    return new Promise((resolve,reject)=>{
    runcommnad(['run',
            '-d',
            '-it',
            '--name',
            'jokal',
            '-v',
            process.cwd()+'/lambda:/app/lambda:z',
            'node'],'silent',function(err,data){
                console.log("Starting docker");
                console.log(data);
                if(data[0] == undefined){
                    /**
                     * remove the previous docker name
                     */
                    reject("Not able to create the Doker");
                }else{
                    resolve(data);
                }
                /**
                 * Some main file need to transfer as node_modules 
                 * Dynamodb
                 * S3
                 */
            });

    });
}

function RemoveALLdocker(){
    return new Promise((resolve,reject)=>{
        // docker rm $(docker ps -a -q)
        runcommnad(['rm','$(docker','ps','-a','-q)'],'silent',function(err,data){
            console.log(data);
            if(err){
                reject(err);
            }else{
                resolve(data)
            }
        })
    })
}
// runcommnad(['rm','-f','9600f9ed70c9'],"silent",function(err,data){
//     console.log(err,data);
// });

function Start(){
    DockerRunning()
    .then(function(r){
        console.log("Docker Running");
    })
    .catch(function(e){
        /** if not running then create the */
        Createdocker()
        .then(function(r1){
            return r1
        }).catch(function(e1){
            /** if creation gives error then remove all old instance and then redo */
            console.log(e1);
            return historyFind()
                .then(function(id){
                    return killdockerOld(id)
                })
                .then(function(e2){
                    /** next try */
                    return Createdocker()
                        .then(function(e){
                            return e;
                        }).catch(function(e){
                            console.log("try multiple times nothing work");
                        })
                }).catch(function(e){
                    console.log("Something bad happen");
                    console.log(e);
                })
        })
    })
    .then(function(result){
        return result;
    }).catch(function(e){
        console.log(e);
    })
}
function killdockerOld(id){
    return new Promise((resolve,reject)=>{
        runcommnad(['rm',id],'silent',function(err,data){
            console.log(data);
            if(err){
                reject(err);
            }else{
                resolve(data)
            }
        })
    })
}

module.exports= function(){
    return Start();
}

function runexecute(path,context_varibale,callback){
    /**
     * how to pass context_variable in the event
     * path to execute it
     * callback from the execution
     */
    
}