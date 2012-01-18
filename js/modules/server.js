//set up dependencies
var _ = require('underscore')._,
	fs = require('fs'),
	express = require('express'),
	jade = require('jade'),
	utilities = require('./shared/utilities'),
	models = require('./models');	
	
//set up server model
exports.webServer = function(_options){
	//default settings
	var options = {
		port:8000,
		template_dir:__dirname + '/../../templates'
	};
	
	//server error pages
	function serveError(number, template, callback) {
		jade.renderFile(template, number, function(err,html){
			if (err) {
				if (number !== 500) {
					serveError(500, '', function(html, http_code) {
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
	function serveStatic(path, callback) {
		fs.readFile(path, function(err,data){
			if(err) {
				serveError(404, function(html, http_code) {
					callback.apply(this, [html, http_code]);
				});
			} else {
				callback.apply(this, [data, 200]);
			}
		});
	};
	
	//renders a chunk of markup to the response object
	function serveHTML(data, template, callback) {
		jade.renderFile(template, data, function(err,html) {
			if (err) {
				serveError(500, function(html, http_code) {
					callback.apply(this, [html, http_code]);
				});
			} else {
				callback.apply(this, [html, 200]);
			}
		});
	};
	
	//this is the callback that sends the response
	function sendResponse(data, http_code, headers, res) {
		for (header in headers) {
			res.header(header, headers[header]);
		}
		res.end(data, http_code);
	}
	
	function getRoute(_route) {
		var router = function(req, res, next, route) {
			switch (route.type) {
				case '302':
					var template = options['template_dir'] + '/' + '302.jade';
					serveError(302, template, utilities.callback(sendResponse, {args:[{'Content-Type':'text/html'},res]}));
					break;
				case '404':
					var template = options['template_dir'] + '/' + '404.jade';
					serveError(404, template, utilities.callback(sendResponse, {args:[{'Content-Type':'text/html'},res]}));
					break;
				case 'static':
					var headers = route.headers(req.headers, req.params);
					var path = __dirname + route.path(req.params);
					serveStatic(path, utilities.callback(sendResponse, {args:[headers,res]}));
					break;
				case 'html':
				default:
					var headers = route.headers(req.headers, req.params);
					var data = utilities.callFunctionByName(route.model, models, req.params);
					var template = options['template_dir'] + '/index.jade';
					serveHTML(data, template, utilities.callback(sendResponse, {args:[headers,res]}));
			}	
		};
		
		app.get(new RegExp(_route.regex), utilities.callback(router, {args:[_route], scope:this}));
	};
	
	function postRoute(_route) {
		var router = function(req, res, next, route) {
			var headers = route.headers(req.headers);
			var data = utilities.callFunctionByName(route.model, models, req.body);
			
			//choose our render method based on request content type
			switch (headers['Content-Type']) {
				case 'application/json':
					res.json(data, 200);
					break;
				case 'text/html':
				default:
					var template = options['template_dir'] + '/index.jade';
					serveHTML(data, template, utilities.callback(sendResponse, {args:[headers,res]}));
					break;
			}
		};
			
		app.post(new RegExp(_route.regex), utilities.callback(router, {args:[_route], scope:this}));
	};
		
	//create express server with browserify
	var app = express.createServer();
	
	//extend default options
	_.extend(options, _options);
	
	//configure express app
	app.configure(function(){
		app.use(express.bodyParser());
	});
		
	//set up routing loop
	for (var i in options.routing) {
		options.routing[i].method === 'get' ? new getRoute(options.routing[i]) : new postRoute(options.routing[i]);
	}
	
	//get app to listen to requests
	app.listen(process.env.PORT || parseInt(options['port'], 10));

	//confirm app is running
	console.log("Web server started at " + options['port']);
};
