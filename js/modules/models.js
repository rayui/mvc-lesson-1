var _ = require('underscore')._,
	utilities = require('./shared/utilities'),
	validate = require('./shared/validate');

//validate inputs and perform multiplication
exports.config = function(data) {
	return data;
};
	
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
	data.errors = validate.canMultiply(data.attributes);
	
	if (data.errors) {
		data.attributes.result = undefined;
	} else {
		data.errors = [];
		data.attributes.result = data.attributes.operand1 * data.attributes.operand2;
	}
	return data;
};
