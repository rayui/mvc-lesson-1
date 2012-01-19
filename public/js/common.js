//on jquery init
$(function($){
	//simplest possible model
	var Model = Backbone.Model.extend({
		url:'/',
		validate:validate.canMultiply
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
		
		//- renders and error notification
		renderError: function(name, error) {
			$('input[name="' + name + '"]').addClass('error');
			$('div#result').append('<span>' + name + ': ' + error + '</span>');
		},
		
		//- clears existing error notifications
		clearErrors: function() {
			$('input').removeClass('error');
			$('div#result').empty();
		},
		
		//- when inputs change, save the model to the server
		//- if it fails validation, the error function will kick in
		//- when a success response is received, this will trigger the model's change event and causing it to render
		submit:function() {	
			var renderError = this.renderError;
			var clearErrors = this.clearErrors;

			this.model.save({
				'operand1': $('input[name="operand1"]').val(),
				'operand2': $('input[name="operand2"]').val()
			},{
				error: function(model, errors) {
					clearErrors();
					for (error in errors) {
						renderError(errors[error].name, errors[error].error);
					}
				}
			});
			
			return false;
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
