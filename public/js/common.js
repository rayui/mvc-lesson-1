//on jquery init
$(function($){
	//simplest possible model
	var Model = Backbone.Model.extend({
		url:'/',
		validate:utilities.validate
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
			var clearErrors = this.clearErrors;

			this.model.save({
				'operand1': parseInt($('input#operand1').val(), 10),
				'operand2': parseInt($('input#operand2').val(), 10)
			},{
				error: function(model, errors) {
					clearErrors();
					for (attr in errors) {
						renderError(attr, errors[attr]);
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
			this.clearErrors();
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
