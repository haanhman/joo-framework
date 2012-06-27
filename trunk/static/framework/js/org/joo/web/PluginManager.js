JOO.define('org.joo.web.PluginManager',
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
		var subject = JOO.factory.getInstance(org.joo.event.Subject);
		subject.attachObserver(this);
		this.plugins = Array();
	},
	
	/**
	 * Add plugin to the manager
	 * @param {PluginInterface} plugin the plugin to be added
	 * @param {Boolean} delay whether the plugin should not be loaded after added
	 */
	addPlugin: function(plugin, delay)	{
		if (delay != true)
			plugin.onLoad();
		this.plugins.push(plugin);
	},
	
	/**
	 * Remove plugin at the specified index
	 * @param {Number} index the index of the plugin to be removed
	 */
	removePlugin: function(index)	{
		var plugin = this.plugins[index];
		if (plugin != undefined)	{
			plugin.onUnload();
			this.plugins.splice(index, 1);
		}
	},
	
	/**
	 * Get all plugins
	 * @returns {Array} the current maintained plugins
	 */
	getPlugins: function()	{
		return this.plugins;
	},
	
	/**
	 * Remove every plugins managed by this manager
	 */
	removeAllPlugins: function()	{
		for(var i=0;i<this.plugins.length;i++)	{
			var plugin = this.plugins[i];
			if (plugin.isLoaded())	{
				plugin.onUnload();
			}
		}
		this.plugins = Array();
	},
	
	/**
	 * Triggered by the Subject and in turn triggers all plugins that it manages
	 * @param {String} eventName the event name
	 * @param {Object} eventData the event data
	 */
	notify: function(eventName, eventData)	{
		for(var i=0;i<this.plugins.length;i++)	{
			var plugin = this.plugins[i];
			if (plugin.isLoaded())	{
				var methodName = "on"+eventName;
				if (typeof plugin[methodName] != 'undefined')	{
					var method = plugin[methodName];
					method.call(plugin, eventData);
				}
			}
		}
	}
}).implement(org.joo.event.Observer);