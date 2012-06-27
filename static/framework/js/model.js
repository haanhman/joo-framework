JOOService = EventDispatcher.extend({
	
	init: function(endpoint, method) {
		this._super();
		this.name = "DefaultService";
		this.endpoint = endpoint || "";
		this.method = method || "get";
	},
	
	run: function(params) {
		var _self = this;
		this.onAjax(this.endpoint, params, this.method, {
			onSuccess: function(ret) {
				ret = _self.parse(ret);
				_self.dispatchEvent('success', ret);
				JOOUtils.generateEvent('ServiceSuccess', this.name, ret);
			},
			onFailure: function(msg) {
				msg = _self.parseError(msg);
				_self.dispatchEvent('failure', msg);
				JOOUtils.generateEvent('ServiceFailure', this.name, msg);
			}
		});
	},
	
	parse: function(ret) {
		return ret;
	},
	
	parseError: function(msg) {
		return msg;
	},
	
	getEndPoint: function() {
		return this.endpoint;
	}
}).implement(AjaxInterface);

/**
 * @class A model which supports property change event.
 * @augments EventDispatcher
 */
JOOModel = EventDispatcher.extend({
	
	bindings: function(obj, path) {
		path = path || "";
		obj = obj || this;
		for(var i in obj) {
			this._bindings(obj, i, path);
		}
	},
	
	_bindings: function(obj, i, path) {
		if (i == 'className' || i == 'ancestors' || i == 'listeners' || i =='_bindingName_') 
			return;
		if (path == "") {
			path = i;
		} else {
			path += "['"+i+"']";
		}
		if (typeof obj[i] != 'function') {
			if (obj[i] instanceof Object || obj[i] instanceof Array ) {
				if (obj[i] instanceof Array) {
					this.bindForArray(obj[i], path);
				}
				this.bindings(obj[i], path); //recursively bind
			}
			this.bindForValue(obj, i, path);
		}
	},
	
	bindForArray: function(obj, path) {
		var _self = this;
	    var length = obj.length;
	    obj.__defineGetter__("length", function() {
			return length;
		});
	    this.hookUp(obj, 'push', path, function(item) {
	    	_self._bindings(obj, obj.length-1, path);
	    });
	    this.hookUp(obj, 'pop', path);
	    this.hookUp(obj, 'splice', path, function() {
	    	for(var i=2; i<arguments.length; i++) {
	    		_self._bindings(obj, obj.length-arguments.length-i, path);
	    	}
	    });
	},
	
	hookUp: function(obj, fn, path, callback) {
		var _self = this;
		var orig = obj[fn];
	    obj[fn] = function() {
	    	orig.apply(obj, arguments);
	    	callback.apply(undefined, arguments);
	    	_self.dispatchEvent('change', {type: 'function', functionName: fn, arguments: arguments, path: path});
	    };
	},
	
	bindForValue: function(obj, i, path) {
		var _self = this;
		var prop = "_"+i;
		obj[prop] = obj[i];
		obj[i] = undefined;
		delete obj[i];
		
		if (!obj.__lookupGetter__(i)) {
			obj.__defineGetter__(i, function() {
		        return obj[prop];prop
		    });
		}
		if (!obj.__lookupSetter__(i)) {
			obj.__defineSetter__(i, function(val) {
				var oldValue = obj[prop];
				if (oldValue != val) {
					obj[prop] = val;
					_self.dispatchEvent('change', {type: 'setter', value: val, prop: i, path: path});
				}
		    });
		}
	}
});

/**
 * Create or extend model from ordinary object
 * @param {Object} obj the object 
 * @param {JOOModel} model existing model 
 * @returns the result model
 */
JOOModel.from = function(obj, model) {
	model = model || new JOOModel();
	for(var i in obj) {
		model[i] = obj[i];
	}
	model.bindings();
	return model;
};