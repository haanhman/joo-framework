/**
 * @class The plugin interface. Every plugins must implement this interface.
 * A plugin is a class which provides extra functions via "Event Hook". It
 * registers a list of hooks which is called automatically in the corresponding
 * events.
 * @augments ObserverInterface
 * @interface
 */
JOO.define('org.joo.web.Plugin', {

	extend: org.joo.core.InterfaceImplementor,
	
	implement: function(obj)	{

		obj.prototype.toString = obj.prototype.toString || function() {
			return this.name;
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
			this.loaded = true;
			this.onBegin();
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
			this.loaded = false;
			this.onEnd();
		};
		
		//super interfaces
		new org.joo.event.Observer().implement(obj);
	}
});