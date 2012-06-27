JOO.define('org.joo.Application',
/** @lends org.joo.Application# */
{
	/**
	 * Initialize fields
	 * @class This class is the entrypoint of JOO applications. 
	 * @name org.joo.Application
	 * @singleton
	 * @augments Class
	 * @constructs
	 * @see SingletonFactory#getInstance
	 */
	init: function()	{
		if(Application.singleton == undefined){
			throw "Singleton class, can not be directly created !";
			return undefined;
		}
		this.systemProperties = new SystemProperty();
		this.resourceManager = new ResourceManager();
	},
	
	/**
	 * Access the application's resource manager
	 * @returns {ResourceManager} the application's resource manager
	 */
	getResourceManager: function()	{
		return this.resourceManager;
	},
	
	/**
	 * Change the application's resource manager
	 * @param {ResourceManager} rm the resource manager to be used
	 */
	setResourceManager: function(rm)	{
		this.resourceManager = rm;
	},
	
	/**
	 * Get the system properties array
	 * @returns {SystemProperty} the system properties
	 */
	getSystemProperties: function()	{
		return this.systemProperties;
	},
	
	/**
	 * Change the bootstrap of the application
	 * @returns {Bootstrap} bootstrap the bootstrap of the application
	 */
	setBootstrap: function(bootstrap)	{
		this.bootstrap = bootstrap;
	},
	
	/**
	 * Start the application. This should be called only once
	 */
	begin: function()	{
		this.bootstrap.run();
	},

	/**
	 * Get the application's object manager
	 * @returns {ObjectManager} the application's object manager
	 */
	getObjectManager: function()	{
		if (this.objMgr == undefined)
			this.objMgr = new ObjectManager();
		return this.objMgr;
	}
});