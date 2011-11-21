//set up dependencies
var _ = require('underscore')._,
	Backbone = require('backbone'),
	express = require('express'),
	browserify = require('browserify');
	jade = require('jade');
	
//define exports
var models = exports;

//set up server model
models.webServer = Backbone.Model.extend({
	//default server settings
	defaults:{
		port:8000,
		assets_dir:__dirname + '/assets',
		template_dir:__dirname + '/templates',
		modules:{
			jQuery: 'jquery-browserify',
			backbone: 'backbone-browserify'
		}
	},
	initialize: function(attributes) {
		var that = this;
		
		//create express server with browserify
		var app = express.createServer();
		app.configure(function(){
			app.use(browserify({
				require : that.get('modules')
			}));
			app.use(express.bodyParser());
			app.use(express.static(that.get('assets_dir')));
		});
		
		app.get('/', function(req, res) {
			var result = {
				operand1:0,
				operand2:0,
				result:0				
			};
			jade.renderFile(that.get('template_dir') + '/index.jade', result ,function(err,html){
				res.send(html);
			});
		});
		
		//simple multiplication function
		app.post('/', function(req, res) {
			//here we accept a set of request values from the client
			//and return the result of the calculation as a JSON object
			
			var result = {
				operand1:req.body.operand1,
				operand2:req.body.operand2,
				result:req.body.operand1 * req.body.operand2
			};
			
			switch (req['headers']['content-type'].match(/(form|json)/)[0]) {
				case 'json':
					res.json(result);
					break;
				case 'form':
				default:
					jade.renderFile(that.get('template_dir') + '/index.jade', result ,function(err,html){
						res.send(html);
					});
					break;
			}
		});
	
		//get app to listen to requests
		app.listen(parseInt(this.get('port'), 10));
		
		console.log("Web server started at " + this.get('port'));
	}
});

