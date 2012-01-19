//validation functions
//requires utilities

(function(exports){
		
	//- check if input is an integer and push to error array if not
	function exists(value) {
		return (typeof value !== 'undefined' ? false : 'is mandatory');
	};
	
	//- check if input is an integer and push to error array if not
	function isInt(value) {
		if(!((parseFloat(value) === parseInt(value, 10)) && !isNaN(value))){
			return('must be an integer');
		}
		return false;
	};

	//- check if input is an integer and push to error array if not
	function isEmptyString(value) {
		if(value.toString() === ''){
			return('is mandatory');
		}
		return false;
	};
	
	exports.canMultiply = function(attrs) {
		//- errors array to return
		var errors = [];
		
		//- check all field types
		for (var id in attrs) {
			var attr = attrs[id];
			
			var emptyStringError = isEmptyString(attr);
			var integerError = isInt(attr);
			
			if (emptyStringError) {
				errors.push({name:id,error:emptyStringError});
			} else if (integerError) {
				errors.push({name:id,error:integerError});
			}
		}
		
		//- if elements with errors, return them
		if (errors.length) {
			return errors;
		}
		
		//- otherwise return null
		return null;
	};

})(typeof exports === 'undefined'? this['validate']={}: exports);
