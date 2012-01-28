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
			'click input[type="submit"]':	'submit',
			'change input[type="text"]':	'update'
		},
		
		//- renders and error notification
		renderErrors: function(model, errors) {
			this.clearErrors();
			for (error in errors) {
				$('input[name="' + errors[error].name + '"]').addClass('error');
				$('div#result').append('<span>' + errors[error].name + ': ' + errors[error].error + '</span>');
			}
		},
		
		//- clears existing error notifications
		clearErrors: function() {
			$('input').removeClass('error');
			$('div#result').empty();
		},
		
		//- when inputs change, validate the model
		//- if success, enable submit button
		//- if failure, disable submit
		update: function() {
			var success = this.model.set({
				operand1:$('input[name="operand1"]').val(),
				operand2:$('input[name="operand2"]').val()
			});
			//-- enable/disable submit button according to validation result
			$('input[type="submit"]').attr('disabled', !success);
		},
		
		//- save model to server
		submit:function() {	
			this.model.save();
			
			//-- prevent default click
			return false;
		},
				
		//- render result on server response
		render: function() {
			this.clearErrors();
			//-- only update view if we have a different result from previous valid model
			if (this.model.hasChanged('result')) {
				$('div#result').text(
					this.model.get('operand1') +
					' * ' +
					this.model.get('operand2') +
					' = ' +
					this.model.get('result')
				);
			}
		},
		
		//- init
		initialize:function() {		
			//-- instantiate Model inside View and bind new model's change event to this View's render method
			//-- note that this is backbone's bind, different from jQuery
			this.model = new Model();
			this.model.bind('error', this.renderErrors, this);
			this.model.bind('change', this.render, this);
			
			//-- initially disable form submit
			$('input[type="submit"]').attr('disabled', true);
		}
	});
	
	//instantiate view	
	new View();
});
