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
                console.log(e);
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
            // console.log(err,data);
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
            // console.log(err,data);
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
                console.log("this is docker id",data[0][1]);
                resolve(data[0][1]);
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
                // console.log(data);
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
            // console.log(err,data);
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
    return new Promise((resolve,reject)=>{
        
    DockerRunning()
    .then(function(r){
        console.log("Docker Running");
        resolve(r);
    })
    .catch(function(e){
        /** if not running then create the */
        return new Promise((fullfill,end)=>{
            
            Createdocker()
            .then(function(r1){
                console.log("Creating Docker");
                return new Promise((r,x)=>{
                    dockerDefaultInsertFiles(__dirname+'/../docker-helpers/')
                    .then(function(id){
                        r(id);
                    })
                    .catch(function(e){
                        x(e);
                        // throw new Error(" Not able to process tasks");
                    })
                })
            })
            .then(function(result){
                fullfill(result);
            })
            .catch(function(e1){
                /** if creation gives error then remove all old instance and then redo */
                console.log(e1);
                return new Promise((resolve2,reject2)=>{
                    historyFind()
                    .then(function(id){
                        return new Promise((res1,rej1)=>{
                            killdockerOld(id)
                            .then(function(r){
                                res1(r)
                            })
                            .catch(function(e){
                                rej1(e);
                            })
                        })
                    })
                    .then(function(e2){
                        /** next try */
                        return new Promise((fullfill,rejected)=>{
                            Createdocker()
                            .then(function(e){
                                // return new Promise((fullfill,rejected)=>{
                                    console.log("this"+e);
                                    dockerDefaultInsertFiles(__dirname+'/../docker-helpers/')
                                    .then(function(id){
                                        fullfill(id);
                                    })
                                    .catch(function(e){
                                        rejected(e);
                                        // throw new Error("Not able to process twice");
                                    })
                                // })
                            }).catch(function(e){
                                rejected(e);
                                console.log("try multiple times nothing work");
                            })
                        })
                    })
                    .then(function(res){
                        console.log("all result one place"+res)
                        resolve2(res);
                    })
                    .catch(function(e){
                        console.log("Something bad happen");
                        console.log(e);
                        reject2(e);
                    })
                })
            })
            .then(function(er){
                resolve(er);
            }).catch(function(e){
                console.log(e);
                reject(e);
            })
        })
    })
    .then(function(result){
        console.log("end result");
        resolve(result);
    }).catch(function(e){
        reject(e);
    })
});
}

function killdockerOld(id){
    return new Promise((resolve,reject)=>{
        runcommnad(['rm',id],'silent',function(err,data){
            // console.log(data);
            if(err){
                reject(err);
            }else{
                resolve(data)
            }
        })
    })
}

function dockerDefaultInsertFiles(docker_helpers){
    // console.log(docker_helpers);
    return new Promise((resolve,reject)=>{
        console.log("data transfer");
        // docker cp /home/code5/try/jokal/docker-helpers/ 4616bb16e9ad:/jokal/
        DockerRunning()
        .then(function(id){
            return new Promise((res,rej)=>{
                
                console.log("parsed to Log"+id);
                runcommnad(['exec','-i',id,'mkdir','log'],'log',function(err,data){
                    console.log("Creating Log folder inside docker");
                    // console.log(err,data);
                    if(err !== null){
                        rej(err);
                    }else{
                        res(id);
                    }
                });
            });
        })
        .then(function(id){
            return new Promise((res,rej)=>{
                
            console.log("parsed ID to jokal "+id);
                runcommnad(['cp',__dirname+'/../docker-helpers/',id,':/app/'],'log',function(err,data){
                    console.log("Creating Jokal folder inside docker");
                    console.log(err,data);
                    if(err !== null){
                        rej(err);
                    }else{
                        res(id);
                    }
                });
            })
        })
        .then(function(id){
            return new Promise((res,rej)=>{
                // console.log(id);
                // console.log('cp',docker_helpers,id+':/jokal/');
                runcommnad(['cp',docker_helpers,id+':/jokal/'],'log',function(err,data){
                    // console.log(err,data);
                    if(err){
                        rej(err);
                    }else{
                        res(id);
                    }
                });

            })
        })
        .then(function(res){
            resolve(res);
        })
       .catch(function(e){
           console.log(e);
            reject(e);
        });
    })
}

function execute(options,log,callback){
    // childprocess.spawn('docker', ['exec','-i','-t',options[3],'node','jokal/firstexecutor.js',options[6],options[7],{},{}], {
    //     stdio: [0, process.stdout, process.stderr]
    // });
    var out=[];
    var s ="";
    var modular = childprocess.spawn('docker', ['exec','-i',options[3],'node','jokal/firstexecutor.js',options[6],options[7],{},{}]);
    modular.stdout.on('data',(data)=>{
        try {
            console.log(data);
            s = data.toString('utf8');
            var lines = s.split("\n");
            out.push(lines);
        } catch (e) {
            callback(e,data.toString());
        }
    });
    modular.stderr.on('data',(data)=>{
        console.log(data);
        try {
            console.log(data);
            s = data.toString('utf8');
            var lines = s.split("\n");
            out.push(lines);
        } catch (e) {
            callback(e,data.toString());
        }
    })
    modular.on('close',(code)=>{
        callback(null,out);
    });
}
function runexecute(containerid,Module,execution,event,context,callback1){
    /**
     * how to pass context_variable in the event
     * Module to execute it
     * callback from the execution
     */
    console.log(arguments);
    execute(['exec','-i','-t',containerid,'node','jokal/firstexecutor.js',Module,execution,event,context],'log',function(err,data){
        console.log(err,data);
        if(err){
            console.log(err);
            // callback1(err);
        }else{
            console.log(data);
            callback1(null,data);
        }
    });
}

module.exports = {
    "Start":function(cb){
            console.log("start the jokal");
                Start()
                .then(function(r){
                    console.log(r);
                    cb(null,r);
                }).catch(function(e){
                    console.log(e);
                    cb(e);
                })
            },
    "Execute":function(containerid,Module,execute,event,context,callback){
        console.log("executing");
        console.log(arguments);
         runexecute(containerid,Module,execute,event,context,function(err,res){
            callback(err,res);
         });
    }
}
