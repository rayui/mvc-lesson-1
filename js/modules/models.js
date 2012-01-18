var _ = require('underscore')._,
	utilities = require('./shared/utilities');

//create default data object
exports.defaultData = function(_data) {
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
exports.multiplyData = function(data) {
	
	data = exports.defaultData(data);
	data.errors = utilities.validate(data.attributes);
	
	if (data.errors) {
		data.result = undefined;
	} else {
		data.errors = [];
		data.attributes.result = data.attributes.operand1 * data.attributes.operand2;
	}
	return data;
};
