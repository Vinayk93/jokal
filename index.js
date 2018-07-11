const swagger = require('./swaggershow');

var express = require('express');
var mainapp = express();

// import important code
const Schemavalidation = require('./helper/validation');
const Find_Cloud_Executed_DockerContainer = require("./lib/docker");
const Lambda_relative = require('./helper/lambda_relative');
/**
 * Integrate dynamodb and s3 on the system
 * if not found
 */
const CLOUD = require(process.cwd()+'/Cloud.json');
const cloud ={
	"API":{
		"type":"object",
		"properties":{
			"SwaggerFile":{
				"type":"string"
			},
			"defaultTimeout":{
				"type":"number"
			}
		}
	},
	"Lambda":{
		"type":"object",
		"additionalproperties":"false",
		"required":["Code","api"],
		"properties":{
				"Timeout":{
					"type":"number"
				},
				"Code":{
					"type":"string"
				},
				"bin":{
					"type":"string"
				},
				"api":{
					"type":"object",
					"additionalproperties":"false",
					"required":["method","url"],
					"properties":{
						"method":{
							"type":"string",
							"enum":[
								"ANY",
								"GET",
								"POST",
								"DELETE",
								"PATCH",
								"OPTIONS"
							]
						},
						"url":{
							"type":"string"
						}
					}
				},
				"Variable":{
					"type":"object"
				},
				"ParseData":{
					"type":"object",
					"properties":{
						"query":{
							"type":"string"
						},
						"params":{
							"type":"string"
						},
						"body":{
							"type":"string"
						},
						"url":{
							"type":"string"
						},
						"headers":{
							"type":"string"
						}
					}
				}
			}
		}
};

Schemavalidation(cloud,CLOUD,function(err){
	if(err){
		throw new new Error(err);
	}
});

/**
 * 1. this will act as a Lambda to execute function
 * 2. and check for url
 */
mainapp.use('/*',(req,res,next)=>{
	/**
	 * Find the method and url present in the Cloud.json 
	*/
	let allow=0
	let CONF={};
	// console.log(CLOUD);
	// console.log(req.baseUrl);
	// console.log(req.method);
	Object.keys(CLOUD.Lambda).forEach((Element)=>{
		CONF = CLOUD.Lambda[Element];
		if( (CONF.api.method == "ANY" || CONF.api.method == req.method ) && CONF.api.url == req.baseUrl){
			req.Module =Element;
			req.CONF = CONF;
			allow=1;
			console.log("$LATEST");
			next();
		}
	});
	if(allow != 1){
		setTimeout(()=>{
			res.status(404).send("Not Found");
		},0,res);
	}
});
/**
 * [description]
 * 1. find the url it need to hit
 * 2. take Timeout,Code,bin,Variable and ParseData to the docker and create a api for the execution
 * 3. Now every hit find the url of the execution
 */
mainapp.use('/*',(req,res,next)=>{
	console.log(req.CONF);
	path="/app/"+req.CONF.Code;
	Module = req.CONF.Module;
	event = Lambda_relative.get_event();
	context = Lambda_relative.get_context();

	// execution=
	// ,event,context,callback

	Find_Cloud_Executed_DockerContainer.Execute(global.container,path,Module,event,context,function(err,data){
			console.log(err);	
		if(err){
				res.status(500).send("Internal Server Error");
			}else{
				res.type('json');
				res.set(data.headers);

				if(data.status){
					res.status(data.status).send(data.body);
				}else{
					res.send(data);
				}
			}
	});
	/*1 min threshold Sec Timeout */
	setTimeout(function () {
		res.send("Request Timeout");
	}, 50000, res);
});

console.log(Find_Cloud_Executed_DockerContainer);
Find_Cloud_Executed_DockerContainer.Start(function(err,container){
	console.log('this is the container');
	global.container = container;
	if(err){
		throw new Error(err);
	}
	mainapp.listen(4000,()=>console.log('APIS are live on http://localhost:4000/'));
});






