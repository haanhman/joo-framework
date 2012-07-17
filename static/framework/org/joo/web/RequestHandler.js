JOO.define('org.joo.web.RequestHandler',
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
		this.systemProperties = JOO.factory.getInstance(org.joo.Application).getSystemProperties();
		this.errorHandler = new org.joo.web.DefaultErrorHandler();
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
		var defaultPage = JOO.factory.getInstance(org.joo.Application).getSystemProperties().get('page.default', 'Home');
		if(window.location.hash == "") {
			var request = new org.joo.web.Request(defaultPage, null, null, {'page': ''});
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
			
			return new org.joo.web.Request(pagename, null, params);
		}
	},
	
	/**
	 * Modify the URL (i.e the window location) based on the request.
	 * @param {Request} request the request to be routed
	 */
	routeRequest: function(request) {
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
		window.location.hash = str;
	}
});