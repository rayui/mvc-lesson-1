//require dependencies
$ = jQuery = require('jQuery');
Backbone = require('backbone');

//define the client side application
multiply = {
	//the data model
	model: Backbone.Model.extend({
		//- default values
		defaults:{
			operand1:0,
			operand2:0,
		},
		
		//- post url
		url:'/'
	}), 
	
	//the data view
	view: Backbone.View.extend({
		initialize:function() {
			var that = this;
			
			//- instantiate model inside view and bind model's change event to view's render
			this.model = new multiply.model();
			this.model.bind('change', this.render, this);
			
			//- bind function to refresh model from server when remaining inputs change
			$('input').change(function() {
				that.model.set({
					'operand1': parseInt($('input#operand1').val(), 10),
					'operand2': parseInt($('input#operand2').val(), 10)
				});
				that.model.save();
			});
		},
		render: function() {
			//- fill result box with fresh data from server
			$('div#result').text(
				this.model.get('operand1') +
				' * ' +
				this.model.get('operand2') +
				' = ' +
				this.model.get('result')
			);
		}
	})
};

$(document).ready(function() {
	// instantiate view on page load
	new multiply.view();
});
