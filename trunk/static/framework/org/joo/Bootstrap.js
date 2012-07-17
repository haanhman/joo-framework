/**
 * Create a new Bootstrap
 * @class The pluggable bootstrap class.
 * @name org.joo.Bootstrap
 * Application flow is defined here. Developers can extends this class
 * to create custom bootstraps.
 * @augments Class
 * @implements org.joo.event.Observer
 */
JOO.define('org.joo.Bootstrap',
/** @lends org.joo.Bootstrap# */		
{
	/**
	 * Called when the application start running.
	 * Subclass can override this method to change the application flow
	 */
	run: function()	{
		this.registerObserver();
		this.setupRequestHandler();
		this.executeRequest();
	},

	/**
	 * Route the request
	 * @param {Request} eventData the request to be routed
	 * @observer
	 */
	onRequestRoute: function(eventData)	{
		this.requestHandler.routeRequest(eventData);
	},
	
	/**
	 * Assemble the request based on current URL
	 * @observer
	 */
	onNeedAssembleRequest: function()	{
		this.executeRequest();
	},

	/**
	 * Initialize the request handler
	 */
	setupRequestHandler: function()	{
		this.requestHandler = new RequestHandler();
	},
	
	/**
	 * Execute current request
	 */
	executeRequest: function()	{
		var subject = SingletonFactory.getInstance(Subject);
		subject.notifyEvent('RequestBeforeExecuted');
		this.requestHandler.prepareForRequest();
		var request = this.requestHandler.assembleRequest();
		if (request != undefined)	{
			this.requestHandler.handleRequest(request);
		}
	}
}).implement(org.joo.event.Observer);