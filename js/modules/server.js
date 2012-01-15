//set up dependencies
var _ = require('underscore')._,
	fs = require('fs');
	express = require('express'),
	jade = require('jade'),
	utilities = require('./shared/utilities');
	
//define exports
var models = exports;

//set up server model
models.webServer = function(_options){
	//default settings
	var options = {
		port:8000,
		shared_dir:__dirname + '/shared',
		assets_dir:__dirname + '/../../public',
		template_dir:__dirname + '/../../templates'
	};
	
	//create default data object
	var defaultData = function(_data) {
		var data = {
			attributes:{
				operand1:undefined,
				operand2:undefined
			},
			errors:{}
		};
		_.extend(data.attributes, _data);
		return data;
	};
	
	//validate inputs and perform multiplication
	var multiply = function(data) {
		data.errors = utilities.validate(data.attributes);
		if (data.errors) {
			data.result = undefined;
		} else {
			data.errors = [];
			data.attributes.result = data.attributes.operand1 * data.attributes.operand2;
		}
		return data;
	};
	
	//serve static files
	var serveStatic = function(res, fn, contentType) {
		fs.readFile(fn, function(err,data){
			res.header('Content-Type', contentType);
			if(err) {
				res.send(404);
				return;
			}
			res.send(data);
		});
	};
	
	//renders a chunk of markup to the response object
	var renderHTML = function(res, data) {
		jade.renderFile(options['template_dir'] + '/index.jade', data, function(err,html){
			res.header('Content-Type', 'text/html');
			if (err) {
				res.send(500);
				return;
			}
			res.send(html);
		});
	};
	
	//renders a chunk of JSON to the response object
	var renderJSON = function(res, data) {
		res.json(data);
	};
	
	//extend default options
	_.extend(options, _options);
	
	//create express server with browserify
	var app = express.createServer();
	
	//configure express app
	app.configure(function(){
		app.use(express.bodyParser());
	});
	
	//simple get request. send undefined data
	app.get('/', function(req, res) {
		data = defaultData();
		renderHTML(res, data);			
	});
	
	//routing for css
	app.get(/^\/css\/(\w+\.css)?/, function(req, res) {
		serveStatic(res, options['assets_dir'] + '/css/' + req.params[0], 'text/css');
	});
	
	//routing for js
	app.get(/^\/js\/((shared|lib)\/)?([\w\-\.]+\.js)/, function(req, res) {
		var baseDir = options['assets_dir'] + '/js';
		switch (req.params[1]) {
			case 'shared':
				baseDir = options['shared_dir'];
				break;
			case 'lib':
				baseDir += '/lib';
				break;
			default:
				break;
		}
		serveStatic(res, baseDir + '/' + req.params[2], 'application/javascript');
	});
	
	//fallback routing
	app.get(/^.*?/, function(req, res) {
		res.send(404);
	});
	
	//simple multiplication function
	app.post('/', function(req, res) {
		var data = multiply(defaultData({
			operand1:req.body.operand1,
			operand2:req.body.operand2
		}));
		
		//choose our render method based on request content type
		switch (req['headers']['content-type'].match(/(form|json)/)[0]) {
			case 'json':
				renderJSON(res, data);
				break;
			case 'form':
			default:
				renderHTML(res, data);
				break;
		}
	});

	//get app to listen to requests
	app.listen(parseInt(options['port'], 10));

	//confirm app is running
	console.log("Web server started at " + options['port']);
};
