//shared utility functions 

(function(exports){
	Object.size = function(obj) {
	    var size = 0, key;
	    for (key in obj) {
		if (obj.hasOwnProperty(key)) size++;
	    }
	    return size;
	};
	
	/* A utility function for callback() */
	function toArray(arrayLike){
	    var arr = [];
	    for(var i = 0; i < arrayLike.length; i++){
		arr.push(arrayLike[i]);
	    }
	    return arr;
	}
		
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
	};
	
	/**
	 * @param {Function} func the callback function
	 * @param {Object} opts an object literal with the following
	 * properties (all optional):
	 * scope: the object to bind the function to (what the "this" keyword will refer to)
	 * args: an array of arguments to pass to the function when it is called, these will be
	 * appended after any arguments passed by the caller
	 * suppressArgs: boolean, whether to supress the arguments passed
	 * by the caller.  This default is false.
	 */
	
	 exports.callback = function(func,opts){ 	 
	    var cb = function(){
		var args = opts.args ? opts.args : [];
		var scope = opts.scope ? opts.scope : this;
		var fargs = opts.supressArgs === true ?
		    [] : toArray(arguments);
		func.apply(scope,fargs.concat(args));
	    }
	    return cb;
	}

})(typeof exports === 'undefined'? this['utilities']={}: exports);
