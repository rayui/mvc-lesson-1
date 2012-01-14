//- require dependencies
$ = jQuery = require('jQuery');
Backbone = require('backbone');

//on jquery init
$(function($){
	//simplest possible model
	var Model = Backbone.Model.extend({
		url:'/',
		validate:function(attrs) {
			//- errors array to return
			var errors = [];
			
			//- check if input is an integer and push to error array if not
			var checkInteger = function(id, value) {
				if(!((parseFloat(value) === parseInt(value, 10)) && !isNaN(value))){
					errors.push({
						id:id,
						error:'must be an integer'
					});
				}
 			};
			
 			//- check all field types
			for (id in attrs) {
				checkInteger(id, attrs[id]);
			}
			
			//- if elements with errors, return them
			if (errors.length) {
				return errors;
			}
			
			//- otherwise return null
			return null;
		}
	});

	//basic view for multiplier calculator
	var View = Backbone.View.extend({
		//- element to bind view to
		el:$('#page'),
		
		//- default events
		events:{
			'change input[type="text"]':	'submit',
			'submit #multiply':		'submit'
		},
		
		//- when inputs change, save the model to the server
		//- if it fails validation, the error function will kick in
		//- when a success response is received, this will trigger the model's change event and causing it to render
		submit:function() {	
			var renderError = this.renderError;

			this.clearErrors();
			this.model.save({
				'operand1': parseInt($('input#operand1').val(), 10),
				'operand2': parseInt($('input#operand2').val(), 10)
			},{
				error: function(model, errors) {
					for (attr in errors) {
						renderError(errors[attr]['id'], errors[attr]['error']);
					}
				}
			});
			
			return false;
		},
		
		//- renders and error notification
		renderError: function(id, error) {
			$('input#' + id).addClass('error');
			$('div#result').append('<span>' + id + ': ' + error + '</span>');
		},
		
		//- clears existing error notifications
		clearErrors: function() {
			$('input').removeClass('error');
			$('div#result').empty();
		},
		
		//- render result on server response
		render: function() {		
			$('div#result').text(
				this.model.get('operand1') +
				' * ' +
				this.model.get('operand2') +
				' = ' +
				this.model.get('result')
			);
		},
		
		//- init
		initialize:function() {		
			//-- instantiate Model inside View and bind new model's change event to this View's render method
			//-- note that this is backbone's bind, different from jQuery
			this.model = new Model();
			this.model.bind('change', this.render, this);
		}
	});
	
	//instantiate view	
	new View();
});
