//shared utility functions 

(function(exports){
	Object.size = function(obj) {
	    var size = 0, key;
	    for (key in obj) {
		if (obj.hasOwnProperty(key)) size++;
	    }
	    return size;
	};
	
	RegExp.escape = function(text) {
	    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
	};
		
	/* A utility function for callback() */
	function toArray(arrayLike){
	    var arr = [];
	    for(var i = 0; i < arrayLike.length; i++){
		arr.push(arrayLike[i]);
	    }
	    return arr;
	}
	
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
	
	//nicked from:
	//http://stackoverflow.com/questions/359788/how-to-execute-a-javascript-function-when-i-have-its-name-as-a-string
	//modified to return an object class as opposed to a new instance
	
	exports.callFunctionByName = function(functionName, context /*, args */) {
		var args = Array.prototype.slice.call(arguments).splice(2);
		var namespaces = functionName.split(".");
		var func = namespaces.pop();
		for(var i = 0; i < namespaces.length; i++) {
			context = context[namespaces[i]];
		}
		return context[func].apply(this, args);
	}
	

})(typeof exports === 'undefined'? this['utilities']={}: exports);
