//set up dependencies
var _ = require('underscore')._,
	express = require('express'),
	browserify = require('browserify');
	jade = require('jade');
	
//define exports
var models = exports;

//set up server model
models.webServer = function(_options){
	//default settings
	var options = {
		port:8000,
		assets_dir:__dirname + '/../../assets',
		template_dir:__dirname + '/../../templates',
		modules:{
			jQuery: 'jquery-browserify',
			backbone: 'backbone-browserify'
		},
		multiply:{
			operand1:0,
			operand2:0,
			result:0
		}
	};
	
	//renders a chunk of markup to the response object
	var renderHTML = function(res) {
		jade.renderFile(options['template_dir'] + '/index.jade', options['multiply'] ,function(err,html){
			res.send(html);
		});
	};
	
	//renders a chunk of JSON to the response object
	var renderJSON = function(res) {
		res.json(options['multiply']);
	};
	
	//extend default options
	_.extend(options, _options);
	
	//create express server with browserify
	var app = express.createServer();
	app.configure(function(){
		app.use(browserify({
			require : options['modules']
		}));
		app.use(express.bodyParser());
		app.use(express.static(options['assets_dir']));
	});
	
	//simple get request
	app.get('/', function(req, res) {
		renderHTML(res);			
	});
	
	//simple multiplication function
	app.post('/', function(req, res) {
		//here we accept a set of request values from the client
		//and populate our model with the new values
		options['multiply'] = {
			operand1:req.body.operand1,
			operand2:req.body.operand2,
			result:req.body.operand1 * req.body.operand2
		};
		
		//choose our render method based on request content type
		switch (req['headers']['content-type'].match(/(form|json)/)[0]) {
			case 'json':
				renderJSON(res);
				break;
			case 'form':
			default:
				renderHTML(res);
				break;
		}
	});

	//get app to listen to requests
	app.listen(parseInt(options['port'], 10));

	//confirm app is running
	console.log("Web server started at " + options['port']);
};

