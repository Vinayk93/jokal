var express     = require('express');
var http        = require('http');
var path        = require('path');
var ejs         = require('ejs');

let app = [];
let no = 0;

module.exports = {
    /**
     * crawl through the template create node server with the 
     */
    "start" :function(json){
        var k = [];
        port = json.port || 3000;
        s =Object.keys(json.Lambda);
        for(var i=0;i<s.length;i++){
            k[i] = Server_implemetation(app,no,s,json);
            ++no;
        }
        Promise.all(k)
        .then(function(r){

        })
        .catch(function(e){
            console.log(e);
        })
    },
    "proxy": function(json,server,proxy){
        startportno = json.port || 3000;
        Implements_ProxyServer(server,startportno,json,proxy)
        .then(function(result){
            console.log(result);
        })
        .catch(function(e){
            console.log(e);
        })
    }
};

function Server_implemetation(app,no,s,json){
    basepath= json.basepath;
    json = json.Lambda;
    return new Promise((resolve,reject)=>{
        app[no] = express();
        // console.log(s,json);
        // console.log(json[s[no]]);
        url = json[s[no]].api.url;
        console.log(no,basepath+url);
        app[no].use(basepath+url,function(req,res){
            console.log(req.baseUrl);
            /** configuration pull and check */
            try{
                url = json[s[no]].api.url;
                method = json[s[no]].api.method;
                env = json[s[no]].Variable || {};
                codetemplate = json[s[no]].Code || "index.handler";
                code = codetemplate.split(".");
                timeout = json[s[no]].Timeout || 30;
                // console.log(url,method,env,codetemplate,timeout);
                // console.log(no,req.baseUrl,req.method);
            }catch(e){
                console.log(e);
            };
            req.setTimeout(5000);
                if(req.method == method || method == "ANY"){
                    let temp="";
                    temp = require(process.cwd()+'/lambda/'+code[0]);
                    var event = {
                        "httpMethod": req.method,
                        "query": req.query,
                        "params": req.params,
                        "body": req.body,
                        "headers": req.headers
                    };
                    temp[code[1]](event,"context",function(err,data){
                        if(err){
                            res.send({"err":"Internal server error"});
                        }else if(typeof data == "object"){
                            // res.status(data.statusCode);
                            res.set(data.headers);
                            res.status(data.statusCode).send(data.body);
                        }else{
                            res.send(data);
                        }
                    });
                }else{
                    res.send("Method no implemented");
                }
        });
        newport = port+no+1;
        http.createServer(app[no]).listen(newport);
        console.log("Server implemented on "+newport);
    });
}

function Implements_ProxyServer(app,startportno,json,proxy) {
    basepath = json.basepath;
    json = json.Lambda;
    let count = 0;
    return new Promise((resolve,reject)=>{
        // static content || swagger file
        app.set('view engine', 'ejs');
        app.engine('html', ejs.renderFile);
        app.set('views', path.join(process.cwd() + '/../public/swagger'));
        const swaggerDocument = require(process.cwd()+'/swagger.json');
        app.use('/', express.static(path.join(process.cwd(), '/../public')));
        app.get('/swagger',(req,res)=>{
            // console.log("hellow");
            console.log(swaggerDocument);
            res.render('index',{"spec":JSON.stringify(swaggerDocument)});
        });
        for(keys in json){
            ++count;
            let url = json[keys].api.url;
            let method = (json[keys].api.method).toLowerCase();
            if(method == "any"){
                method = "use";
            }
            let options={
                "router":{},
                changeOrigin: true,
                target: "http://www.example.org",
                proxyTimeout: 20000,
                timeout: 20000,
            };
            // console.log(url);
            port = startportno+count;
            options.router['localhost:'+startportno]= "http://localhost:"+port;
            console.log(options);
            app[method](basepath+url,proxy(options));
        }
        //proxy list
        proxy_server = app.listen(startportno);
        proxy_server.setTimeout(500000);
    });
}