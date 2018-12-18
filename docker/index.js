var express     = require('express');
var http        = require('http');

let app = [];
let no = 0;

module.exports = {
    /**
     * crawl through the template create node server with the 
     */
    "start" :function(json){
        port = json.port || 3000;
        s =Object.keys(json.Lambda);
        for(var i=0;i<=s.length;i++){
            k = Server_implemetation(app,no,s,json.Lambda);
            ++no;
        }
    }
};

function Server_implemetation(app,no,s,json){
    return new Promise((resolve,reject)=>{
        app[no] = express();
        console.log(s,json);
        app[no].use("/*",function(req,res){
            /** configuration pull and check */
            try{
                url = json[s[no]].api.url;
                method = json[s[no]].api.method;
                env = json[s[no]].Variable || {};
                codetemplate = json[s[no]].Code || "index.handler";
                code = codetemplate.split(".");
                timeout = json[s[no]].Timeout || 30;
                console.log(url,method,env,codetemplate,timeout);
                console.log(no,req.baseUrl,req.method);
            }catch(e){
                console.log(e);
            };
            if(req.baseUrl == url){
                if(req.method == method || method == "ANY"){
                    let temp="";
                    temp = require(process.cwd()+'/lambda/'+code[0]);
                    temp[code[1]]("event","context",function(err,data){
                        if(err){
                            res.send(err);
                        }
                        if(typeof data == "string"){
                            // res.status(data.statusCode);
                            res.writeHead(data.statusCode,data.headers);
                            res.send(data.body);
                        }
                        res.send();
                    });
                }else{
                    res.send("Method no implemented");
                }
            }else{
                res.send("404 Not Found");
            }
        });
        http.createServer(app[no]).listen(port+no);
        console.log("Server implemented on "+port+no);
    });
}

// "start": function(FolderLocation,environment,port,no){
//     /** implment a new docker with the existing image & call it using the folder and sample code + environment */
//     return new Promise((resolve,reject)=>{
//         /**
//          * Start a server
//          */
//         app[no] = express();
//         /**
//          * routes for the particular folder
//          */
//         app[no].use(function(req,res){

//            /**execute the function fuck u */
//         })
//          http.createServer(app[no]).listen(port);
//     });
// }