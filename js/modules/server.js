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
		public_dir:__dirname + '/../../public',
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
	var multiplyData = function(data) {
		data.errors = utilities.validate(data.attributes);
		if (data.errors) {
			data.result = undefined;
		} else {
			data.errors = [];
			data.attributes.result = data.attributes.operand1 * data.attributes.operand2;
		}
		return data;
	};
	
	var serveError = function(number, callback) {
		jade.renderFile(options['template_dir'] + '/' + number + '.jade', {}, function(err,html){
			if (err) {
				if (number !== 500) {
					serveError(500, function(html, http_code) {
						callback.apply(this, [html, http_code]);
					});
				} else {
					callback.apply(this, ['<h1>FATAL SERVER ERROR</h1>', 500]);
				}
			} else {
				callback.apply(this, [html, number]);
			}
		});	
	};
	
	//serve static files
	var serveStatic = function(fn, callback) {
		fs.readFile(fn, function(err,data){
			if(err) {
				serveError(404, function(data, http_code) {
					callback.apply(this, [data, http_code]);
				});
				return;
			}
			callback.apply(this, [data, 200]);
		});
	};
	
	//renders a chunk of markup to the response object
	var serveHTML = function(data, callback) {
		jade.renderFile(options['template_dir'] + '/index.jade', data, function(err,html) {
			if (err) {
				serveError(500, function(html, http_code) {
					callback.apply(this, [html, http_code]);
				});
				return;
			}
			callback.apply(this, [html, 200]);
		});
	};
	
	//renders a chunk of JSON to the response object
	var serveJSON = function(data, callback) {
		callback.apply(this, [data, 200]);
	};
	
	//create express server with browserify
	var app = express.createServer();
	
	//extend default options
	_.extend(options, _options);
	
	//configure express app
	app.configure(function(){
		app.use(express.bodyParser());
	});
	
	//routing for directories with no trailing slash
	app.get(/^(\/[\w\-\.]+)$/, function(req, res) {
		res.header('Location', req.params[0] + '/');
		res.send(302);
	});
	
	//routing for css
	app.get(/^\/css\/(\w+\.css)?/, function(req, res) {
		serveStatic(options['public_dir'] + '/css/' + req.params[0], function(data, http_code) {
			res.header('Content-Type', 'text/css');
			res.send(data, http_code);
		});
	});
	
	//routing for js
	app.get(/^\/js\/((shared|lib)\/)?([\w\-\.]+\.js)/, function(req, res) {
		var baseDir = options['public_dir'] + '/js';
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
		serveStatic(baseDir + '/' + req.params[2], function(data, http_code) {
			res.header('Content-Type', 'application/javascript');
			res.send(data, http_code);
		});
	});
	
	//routing for docs
	app.get(/^\/docs\/([\w\-\.]+\.(css|html))?$/, function(req, res) {
		var fn = req.params[0] ? req.params[0] : 'index.html';
		var contentType = 'text/' + (req.params[1] ? req.params[1] : 'html');
		
		serveStatic(options['public_dir'] + '/docs/' + fn, function(data, http_code) {
			res.header('Content-Type', contentType);
			res.send(data, http_code);
		});
	});
	
	//simple get request. send undefined data
	app.get('/', function(req, res) {
		data = defaultData();
		
		serveHTML(data, function(html, http_code) {
			res.header('Content-Type', 'text/html');
			res.send(html, http_code);	
		});			
	});
	
	//fallback routing
	app.get(/^.*?/, function(req, res) {
		serveError(404, function(data, http_code) {
			res.header('Content-Type', 'text/html');
			res.send(data, http_code);
		});
	});

	//simple post multiplication function
	app.post('/', function(req, res) {
		var data = multiplyData(defaultData({
			operand1:req.body.operand1,
			operand2:req.body.operand2
		}));
		
		//choose our render method based on request content type
		switch (req['headers']['content-type'].match(/(form|json)/)[0]) {
			case 'json':
				serveJSON(data, function(data, http_code) {
					res.header('Content-Type', 'application/javascript');
					res.send(data, http_code);
				});
				break;
			case 'form':
			default:
				serveHTML(data, function(html, http_code) {
					res.header('Content-Type', 'text/html');
					res.send(html, http_code);
				});
				break;
		}
	});

	//get app to listen to requests
	app.listen(parseInt(options['port'], 10));

	//confirm app is running
	console.log("Web server started at " + options['port']);
};
