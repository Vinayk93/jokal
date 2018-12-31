const childprocess  = require('child_process');
const chalk         = require('chalk');
const ncp           = require('ncp');

module.exports=function(program){
    console.log(program);
    if(program.stop){
        /**
         * stop the current server
         */
      }
      if(program.port){
        /**
         * if anyone there alert it
         */
      }
      if(program.skip){
        /** 
         * skip the ports for databases
         */
      }
      if(program.template){
        /**
         * create a list of folders to start the coding
         * copy the data from the examples and put in that folder
         */
        console.log("Copy from "+__dirname+"/examples",process.cwd());
        ncp(__dirname+"/examples",process.cwd(),function(err){
            console.log(err);
        });
      }
        if(program.start){
            /**
             * start the server
             * 1. try to start the server with the given modules
             * 2. when watcher done something then node server need to automatically restart
             * 3. create a process to start the server on that port
             */
            // console.log = function(){};
            process.env['DEBUG']=true;
            childprocess.fork(__dirname+'/index2.js',[],{"env":process.env})
            .on('message',function(data){
                var d = new Date();
                console.log(d+" "+data);
            })
            .on('close',function(close){
                chalk.blue(close);
            })
            .on('disconnect',function(error){
                chalk.red(error);
            });
        }
}