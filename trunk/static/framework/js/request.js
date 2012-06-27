ErrorHandler = Class.extend({
	handle: function(err, event) {
		
	}
});

DefaultErrorHandler = ErrorHandler.extend({
	handle: function(err, event) {
		if (typeof err == 'object') {
			if (err.Exception == 'RequestInterrupted') {
				return;
			}
			if (err.Exception != undefined)	{
				alert("["+err.Exception+"Exception] "+err.Message);
			} else {
				alert(err);
			}
			return;
		}
		alert("Error caught: "+err);
	}
});

Request = Class.extend(
/** @lends Request# */		
{
	/**
	 * Create a new request.
	 * @param {String} name the name of the page
	 * @param {Object} type reserved
	 * @param {Object} params the parameters associated with the request
	 * @param {hideParams} a list of parameters that will not be displayed in
	 * the URL bar when the request is executed
	 * @class Represents a request
	 * @augments Class
	 * @constructs
	 */
	init: function(name, type, params, hideParams) {
		if (name != undefined)
			name = name.trim();
		this.name = name;
		this.type = type;
		if (params == undefined) {
			params = Array();
		}
		if (hideParams == undefined) {
			hideParams = Array();
		}
		this.params = params;
		this.hiddenParams = hideParams;
		this.setParams(params);
		this.demanded = true;
	},
	
	/**
	 * Check if the request is demanded by the application itself.
	 * @returns {Boolean} the demanding flag
	 */
	isDemanded: function() {
		return this.demanded;
	},
	
	/**
	 * Change the demanding flag of the current request.
	 * Demanded request will be automatically routed.
	 * @param {Boolean} b the demanding flag
	 */
	demand: function(b) {
		this.demanded = b;
	},
	
	/**
	 * Set the value of a specific parameter
	 * @param {String} key the parameter name
	 * @param {String} value the new value
	 */
	setParam: function(key, value) {
		this.params[key] = value;
	},
	
	/**
	 * Change all parameters to a new map
	 * @param {Object} params the new parameters map
	 */
	setParams: function(params) {
		this.params = params;
	},

	/**
	 * Get the value of a paramter of current request
	 * @param {String} key the parameter
	 * @param {String} defaultValue the default value, if the parameter is not defined
	 * @returns {String} the value of the parameter
	 */
	getParam: function(key, defaultValue) {
		if (this.params[key] == undefined) {
			return defaultValue;
		}
		return this.params[key];
	},

	/**
	 * Get all parameters.
	 * @returns {Object} the parameters map
	 */
	getParams: function() {
		return this.params;
	},
	
	/**
	 * Change the hash value of current location.
	 * @param {String} strToAdd the location after the hash symbol (#)
	 */
	addHash: function(strToAdd) {
		window.location.hash = strToAdd;
	},
	
	/**
	 * Change the name of the page represented by this request.
	 * @param {String} name the name of the page
	 */
	setName: function(name) {
		this.name = name;
	},

	/**
	 * Get the name of the page represented by this request
	 * @returns {String}
	 */
	getName: function() {
		return this.name;
	},
	
	getType: function() {
		return this.type;
	},
	
	toString: function() {
		return "Request";
	}
});

Request.setProactive = function(b, url) {
	if (url == undefined)
		url = window.location.hash;
	//console.log('set proactive to '+b+' for url: '+url);
	//	//console.warn('called by '+Request.setProactive.caller);
	if (Request.proactive == undefined)
		Request.proactive = {};
	Request.proactive[url] = b;
};

Request.getProactive = function(url) {
	if (url == undefined)
		url = window.location.hash;
	if (Request.proactive == undefined)
		Request.proactive = {};
	return Request.proactive[url];
};

RequestHandler = Class.extend(
/** @lends RequestHandler# */		
{
	/**
	 * Initialize fields
	 * @class Default request handler
	 * @augments Class
	 * @constructs
	 */
	init: function() {
		this.currentPage = undefined;
		this.requestInterrupted = false;
		this.autoRouteDefault = true;
		this.systemProperties = SingletonFactory.getInstance(Application).getSystemProperties();
		this.errorHandler = new DefaultErrorHandler();
	},
	
	/**
	 * Change the error handler
	 * @param {ErrorHandler} errorHandler the new error handler
	 */
	setErrorHandler: function(errorHandler) {
		this.errorHandler = errorHandler;
	},
	
	/**
	 * Route (if needed) and handle a request
	 * @param {Request} request the request to be handled
	 */
	handleRequest: function(request) {
		//console.log('current page is '+this.currentPage);
		if (this.currentPage != undefined) {
			//console.log("Request Interrupted");
			this.requestInterrupted = true;
		} else {
			this.requestInterrupted = false;
		}
		this.routeRequest(request);
		this._handleRequest(request);
	},
	
	_handleRequest: function(request) {
		var name = request.getName();
		JOOUtils.generateEvent('RequestBeforeHandled', {to: name});
		var page = SingletonFactory.getInstance(Page);
		this.currentPage = page;
		page.setRequest(request);
		//console.log('current page begin: '+request.getName());
		try 
		{
			page.onBegin(name);
		} 
		catch (err) {
			log(err);
			/*
			* display a message similar to 'this applet failed to load. click here to reload it'
			*/
			this.errorHandler.handle(err, 'onBegin');
		}
		
		//console.log('current page running: '+request.getName());

		try 
		{
			page.run();
		} 
		catch (err) {
			log(err);
			/*
 			* display a message box notify the error
 			*/
			this.errorHandler.handle(err, 'run');
		}
		
		try 
		{
			page.onEnd();
		} 
		catch (err) {
			log(err);
			this.errorHandler.handle(err, 'onEnd');
		}

		//console.log('current page finished: '+request.getName());
		this.currentPage = undefined;

		JOOUtils.generateEvent('HtmlRendered');
		//		//console.log(currentPage);
		if (this.requestInterrupted == true) {
			throw {"Exception":"RequestInterrupted"};
		}
	},
	
	/**
	 * Define setter and getter for the window location hash.
	 */
	prepareForRequest: function() {
		if(!("hash" in window.location)) {
			window.location.__defineGetter__("hash", function() {
				if(location.href.indexOf("#") == -1)
					return "";
				return location.href.substring(location.href.indexOf("#"));
			});
			window.location.__defineSetter__("hash", function(v) {
				if(location.href.indexOf("#") == -1)
					location.href += v;
				location.href = location.substring(0,location.href.indexOf("#")) + v;
			});
		}
	},
	
	/**
	 * Create a request based on the current URL
	 */
	assembleRequest: function() {
		var defaultPage = SingletonFactory.getInstance(Application).getSystemProperties().get('page.default', 'Home');
		if(window.location.hash == "") {
			var request = new Request(defaultPage, null, null, {'page': ''});
			return request;
		} else {
			//console.log("hey!");
			var hash = window.location.hash;
			hash = hash.substring(1,hash.length);
			if (hash.charAt(0) == '!')	{
				hash = hash.substring(1, hash.length);
			}
			var tmp = hash.split("/");
			var params = new Array();
			var pagename = "";
			var i = 0;

			while(i<tmp.length) {
				if(tmp[i] != "") {
					params[tmp[i]] = tmp[i+1];
					if(tmp[i] == "page") {
						pagename = params[tmp[i]];
					}
					i = i + 2;
				} else {
					i = i + 1;
				}
			}
			
			var request = new Request(pagename, null, params);
			request.demand(false);
			return request;
		}
	},
	
	/**
	 * Modify the URL (i.e the window location) based on the request.
	 * @param {Request} request the request to be routed
	 */
	routeRequest: function(request) {
		//if this request neither proactive nor demanded, then there's no point routing it
		if (Request.getProactive() == false && request.isDemanded() == false)
			return;
		var str = "!";
		if ( ( request.getName() == undefined || request.getName() == "" ) && this.autoRouteDefault ) {
			var pagename = this.systemProperties.get('page.default');
			//console.warn('page is undefined! Using default homepage ['+pagename+']');
			if (pagename == undefined) {
				//console.error('Default page is undefined! I give up for now!');
				throw {"Exception": "NotFound", "Message": "Both default page and parameter page is undefined"};
				return undefined;
			}
			request.setName(pagename);
			request.hiddenParams.page = '';
		}
		request.getParams()['page'] = request.getName();
		for(var key in request.getParams()) {
			if (request.hiddenParams.hasOwnProperty(key)) {
				continue;
			}
			if (typeof request.getParams()[key] == 'function' || typeof request.getParams()[key] == 'object')	{
				continue;
			}
			value = request.params[key];
			if (value != undefined)
				str += key+"/"+value+"/";
			else
				str += key+"/";
		}
		str = str.substring(0,str.length-1);
		if(!("hash" in window.location)) {
			window.location.__defineGetter__("hash", function() {
				if(location.href.indexOf("#") == -1)
					return "";
				return location.href.substring(location.href.indexOf("#"));
			});
			window.location.__defineSetter__("hash", function(v) {
				if(location.href.indexOf("#") == -1)
					location.href += v;
				location.href = location.substring(0,location.href.indexOf("#")) + v;
			});
		}
		//mark the current request as Proactive, so it won't trigger another history event
		Request.setProactive(true, '#!'+str);
		window.location.hash = str;
	},
	
	toString: function() {
		return "RequestHandler";
	}
});
