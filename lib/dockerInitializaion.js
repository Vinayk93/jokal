
var childprocess = require('child_process');

// function runcommnad(options,Log,callback){
//     out = [];
//     var s="";
//     var externalNodeProcess = childprocess.spawn('docker', options, {
//         stdio: ['pipe', 'pipe', 'pipe']
//     });
//     externalNodeProcess.stdout.setEncoding('utf8');
//     externalNodeProcess.send = function(msg){
//         app.process.stdin.write(JSON.stringify(msg)+'\n');
//     }
//     // provide on('message') events from stdout - this will also fire on console.log commands, so you need to wrap those if you want to do any other sort of messaging
//     externalNodeProcess.stdout.on('data', function(data) {
//       console.log("never touch");
//       console.log(data);
//         try {
//                 s = data.toString('utf8');
//                 // console.log(s);
//                 var lines = s.split("\n");
                
//                 out.push(lines);
//                 // console.log(msgs);
//             } catch (e) {
//                 // console.log(e);
//                 // console.error('Docker STDOUT Error:', e, data.toString())
//                 callback(e,data.toString());
//             }
//         //   console.log(data);
//         // console.log("DOCKER START");
//         // let msgs = [];
//         // let s="";
//         // try {
//         //     s += data.toString('utf8');
//         //     console.log(s);
//         //         var lines = s.split("\n");
//         //         msgs.push(lines);
//         //         console.log(msgs);
//         // } catch (e) {
//         //     console.log(e);
//         //     console.error('Docker STDOUT Error:', e, data.toString())
//         //     callback(e,data.toString());
//         // } finally {
//         //     console.log("done");
//         //     if(Log=="silent"){
//         //         msgs.forEach((m)=>{
//         //             externalNodeProcess.emit('message', m);
//         //         });
//         //         callback(null,msgs);
//         //     }else{
//         //         callback(null,msgs);
//         //     }
//         // }
//     });
//     externalNodeProcess.on('close',function(args){
//         console.log("edn here");
//         console.log(out);
//         callback(null,out);
//     })
// }

// function runexecute(containerid,Module,execution,event,context,callback1){
//   /**
//    * how to pass context_variable in the event
//    * Module to execute it
//    * callback from the execution
//    */
//   console.log(arguments);
//   runcommnad(['exec','-i','-t',containerid,'node','jokal/firstexecutor.js',Module,execution,event,context],'log',function(err,data){
//       console.log(err,data);
//       if(err){
//           console.log(err);
//           // callback1(err);
//       }else{
//           console.log(data);
//           // callback1(null,data);
//       }
//   });
// }

// // { '0': 'ea94145b6362',
// //   '1': '/app/./Categories/index.handler',
// //   '2': 'Categories',
// //   '3': {},
// //   '4': {},

// runexecute('6407f3776f16','lambda/Categories','index.handler','{}','{}',function(data){
//   console.log(data);
// });
function s(callback){
  
some=childprocess.spawn('docker', ['exec','-i','-t','6407f3776f16','node','jokal/firstexecutor.js','lambda/Categories','index.handler',{},{}], {
          stdio: [0, process.stdout, process.stderr]
      });
  some.stdout.on('data',(data)=>{
    console.log(data);
  });
some.on('close',function(data){
  callback(data);
})
    }
    s(function(a){
      console.log("start");
      console.log(a);
    })