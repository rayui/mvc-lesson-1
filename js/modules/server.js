//set up dependencies
var _ = require('underscore')._,
	Backbone = require('backbone'),
	express = require('express'),
	browserify = require('browserify');
	
//define exports
var models = exports;

//set up server model
models.webServer = Backbone.Model.extend({
	//default server settings
	defaults:{
		port:8000,
		public_dir:__dirname + '/public',
		modules:{
			jQuery: 'jquery-browserify',
			backbone: 'backbone-browserify'
		}
	},
	initialize: function(attributes) {
		console.log("Web server started");
	
		var that = this;
		
		//create express server with browserify
		var app = express.createServer();
		app.configure(function(){
			app.use(browserify({
				require : that.get('modules')
			}));
			app.use(express.bodyParser());
			app.use(express.static(that.get('public_dir')));

		});
		
		//simple multiplication function
		app.post('/multiply', function(req, res) {
			//here we accept a set of request values from the client
			//and return the result of the calculation as a JSON object
			res.send({
				operand1:req.body.operand1,
				operand2:req.body.operand2,
				result:req.body.operand1 * req.body.operand2
			});
		});
	
		//get app to listen to requests
		app.listen(this.get('port'));
	}
});

