PluginManager = Class.extend(
/** @lends PluginManager# */	
{
	/**
	 * Initialize fields
	 * @class Manages all registered plugins
	 * @singleton
	 * @augments Class
	 * @implements ObserverInterface
	 * @constructs
	 */
	init: function()	{
		if(PluginManager.singleton == undefined){
			throw "Singleton class, can not be directly created !";
			return undefined;
		}
		var subject = SingletonFactory.getInstance(Subject);
		subject.attachObserver(this);
		this.plugins = {};
	},
	
	/**
	 * Add plugin to the manager
	 * @param {PluginInterface} plugin the plugin to be added
	 * @param {Boolean} delay whether the plugin should not be loaded after added
	 */
	addPlugin: function(plugin, delay, extensionPoints)	{
		if (delay != true) {
			plugin.onLoad();
		}
		// this.plugins.push(plugin);
		if (!extensionPoints || !extensionPoints.length) {
			extensionPoints = ['__inactive_plugins__'];
		}
		for(var i=0; i<extensionPoints.length; i++) {
			if (!this.plugins[extensionPoints[i]]) {
				this.plugins[extensionPoints[i]] = {};
			}
			this.plugins[extensionPoints[i]][plugin.getName()] = plugin;
		}
	},
	
	/**
	 * Remove plugin at the specified index
	 * @param {PluginInterface} plugin the plugin to be removed
	 */
	removePlugin: function(plugin)	{
		for(var i in this.plugins) {
			var plg = this.plugins[i][plugin.getName()];
			if (plg) {
				plg.onUnload();
				this.plugins[i][plugin.getName()] = undefined;
			}
		}
	},
	
	/**
	 * Get all plugins
	 * @returns {Array} the current maintained plugins
	 */
	getPlugins: function()	{
		var plugins = [];
		for(var i in this.plugins) {
			for(var j in this.plugins[i]) {
				var plg = this.plugins[i][j];
				if (plugins.indexOf(plg) == -1)
					plugins.push(plg);
			}
		}
		return plugins;
	},
	
	/**
	 * Remove every plugins managed by this manager
	 */
	removeAllPlugins: function()	{
		for(var i in this.plugins)	{
			for(var j in this.plugins[i]) {
				var plugin = this.plugins[i][j];
				plugin.onUnload();
			}
		}
		this.plugins = {};
	},
	
	/**
	 * Triggered by the Subject and in turn triggers all plugins that it manages
	 * @param {String} eventName the event name
	 * @param {Object} eventData the event data
	 */
	notify: function(eventName, eventData)	{
		var plugins = this.plugins[eventName];
		for(var i in plugins)	{
			var plugin = plugins[i];
			if (plugin.isLoaded())	{
				var methodName = "on"+eventName;
				if (typeof plugin[methodName] != 'undefined')	{
					var method = plugin[methodName];
					method.call(plugin, eventData);
				}
			}
		}
	},
	
	toString: function() {
		return "PluginManager";
	}
}).implement(ObserverInterface);

/**
 * @class The plugin interface. Every plugins must implement this interface.
 * A plugin is a class which provides extra functions via "Event Hook". It
 * registers a list of hooks which is called automatically in the corresponding
 * events.
 * @augments ObserverInterface
 * @interface
 */
PluginInterface = InterfaceImplementor.extend({
	implement: function(obj)	{

		obj.prototype.toString = function() {
			return this.className;
		};
		
		/**
		 * Get the init parameters supplied by configuration.
		 * This is usually configured in a <code>layout.txt</code>
		 * @methodOf PluginInterface#
		 * @name getInitParameters 
		 * @returns {Array} the init parameters supplied by configuration
		 */
		obj.prototype.getInitParameters = obj.prototype.getInitParameters || function()	{
			if (this.initParams == undefined)
				this.initParams = Array();
			return this.initParams;
		};
		
		/**
		 * Change the init parameters. This method is not intended to be used
		 * by developers.
		 * @methodOf PluginInterface#
		 * @name setInitParameters 
		 * @param {Object} params the init parameters
		 */
		obj.prototype.setInitParameters = obj.prototype.setInitParameters || function(params)	{
			this.initParams = params;
		};

		/**
		 * Test if the plugin is loaded.
		 * @methodOf PluginInterface#
		 * @name isLoaded 
		 * @param {Boolean} <code>true</code> if the plugin is successfully loaded
		 */
		obj.prototype.isLoaded = obj.prototype.isLoaded || function()	{
			if (this.loaded == undefined)
				this.loaded = false;
			return this.loaded;
		};
		
		/**
		 * Get the plugin name.
		 * @methodOf PluginInterface#
		 * @name getName
		 * @param {String} the name of the plugin
		 */
		obj.prototype.getName = obj.prototype.getName || function()	{
			return this.className;
		};
		
		/**
		 * Called automatically by {@link PluginManager} when the plugin is
		 * loaded . Change the status of the plugin and call the 
		 * <code>onBegin</code> method. Developers should override the 
		 * <code>onBegin</code> method instead.
		 * @methodOf PluginInterface#
		 * @name onLoad
		 */
		obj.prototype.onLoad = obj.prototype.onLoad || function()	{
			if (!this.loaded) {
				this.loaded = true;
				this.onBegin();
			}
		};
		
		/**
		 * Called inside <code>onLoad</code> method. Developers can override this
		 * method to do some stuffs when the plugin is loaded.
		 * @methodOf PluginInterface#
		 * @name onBegin
		 */
		obj.prototype.onBegin = obj.prototype.onBegin || function() {};
		
		/**
		 * Called inside <code>onUnload</code> method. Developers can override this
		 * method to release resources before the plugin is unloaded.
		 * @methodOf PluginInterface#
		 * @name onEnd
		 */
		obj.prototype.onEnd = obj.prototype.onEnd || function() {};
		
		/**
		 * Called automatically by {@link PluginManager} when the plugin is
		 * no longer need. Change the status of the plugin and call the 
		 * <code>onEnd</code> method. Developers should override the 
		 * <code>onEnd</code> method instead.
		 * @methodOf PluginInterface#
		 * @name onUnload
		 */
		obj.prototype.onUnload = obj.prototype.onUnload || function()	{
			if (this.loaded) {
				this.loaded = false;
				this.onEnd();
			}
		};
	}
});

/**
 * @class Interval timer interface. Used for circular behaviour.
 * @interface
 */
IntervalTimerInterface = InterfaceImplementor.extend({
	implement: function(obj)	{
		
		/**
		 * Start the timer.
		 * @methodOf IntervalTimerInterface#
		 * @param {Number} interval the interval
		 * @param {Function} callback the callback function
		 * @name startInterval
		 */
		obj.prototype.startInterval = obj.prototype.startInterval || function(interval, callback)	{
			//stop previous interval timer if any
			if (this.intervalSetup == true)	{
				this.stopInterval();
			}
			this.intervalSetup = true;
			var _this = this;
			this.currentIntervalID = setInterval(function() {callback.call(_this);}, interval);
		};
		
		/**
		 * Stop the timer.
		 * @methodOf IntervalTimerInterface#
		 * @name stopInterval
		 */
		obj.prototype.stopInterval = obj.prototype.stopInterval || function()	{
			if (this.currentIntervalID != undefined)
				clearInterval(this.currentIntervalID);
			else	{
				//console.warn('bug! currentIntervalID not defined');
			}
		};
	}
});