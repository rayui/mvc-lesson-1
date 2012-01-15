//shared utility functions 

(function(exports){
	Object.size = function(obj) {
	    var size = 0, key;
	    for (key in obj) {
		if (obj.hasOwnProperty(key)) size++;
	    }
	    return size;
	};
		
	exports.validate = function(attrs) {
		//- errors array to return
		var errors = {};
	
		//- check if input is an integer and push to error array if not
		var checkInteger = function(id, value) {
			if(!((parseFloat(value) === parseInt(value, 10)) && !isNaN(value))){
				errors[id] = 'must be an integer';
			}
		};
		
		//- check all field types
		for (id in attrs) {
			checkInteger(id, attrs[id]);
		}
		
		//- if elements with errors, return them
		if (Object.size(errors)) {
			return errors;
		}
		
		//- otherwise return null
		return null;
	}

})(typeof exports === 'undefined'? this['utilities']={}: exports);
