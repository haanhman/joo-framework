/**
 * @class An interface for all portlets.
 * A portlet is a pluggable UI components that is managed
 * and rendered by JOO framework. A portlet is independent
 * from the rest of the application.
 * @interface
 */
JOO.define('org.joo.web.Portlet', {
	
	extend: org.joo.core.InterfaceImplementor,
	
	implement: function(obj)	{
		obj.prototype.toString = obj.prototype.toString || function() {
			return this.getName();
		};
		
		/**
		 * Get the name of the portlet. By default, it equals to the className of the
		 * portlet.
		 * @methodOf PortletInterface#
		 * @name getName
		 * @returns {String} The name of the portlet.
		 */
		obj.prototype.getName = obj.prototype.getName || function()	{
			return this.className;
		};
		
		/**
		 * Called automatically by JOO framework when the portlet is initialized.
		 * @methodOf PortletInterface#
		 * @name onBegin
		 */
		obj.prototype.onBegin = obj.prototype.onBegin || function(){};
		
		/**
		 * Called automatically by JOO framework when the portlet is loaded into DOM.
		 * @methodOf PortletInterface#
		 * @name run
		 */
		obj.prototype.run = obj.prototype.run || function(){};
		
		/**
		 * Called automatically by JOO framework when the portlet is reloaded.
		 * @methodOf PortletInterface#
		 * @name onReloadPage
		 */
		obj.prototype.onReloadPage = obj.prototype.onReloadPage || function()	{};
		
		/**
		 * Called automatically by JOO framework when the portlet is no longer needed.
		 * @methodOf PortletInterface#
		 * @name onEnd
		 */
		obj.prototype.onEnd = obj.prototype.onEnd || function(){};
		
		/**
		 * Get the placeholder (container) of the portlet.
		 * @methodOf PortletInterface#
		 * @name getPortletPlaceholder
		 * @returns {PortletPlaceholder} the placeholder of the portlet
		 */
		obj.prototype.getPortletPlaceholder = obj.prototype.getPortletPlaceholder || function()	{
			return this.placeholder;
		};
		
		/**
		 * Change the placeholder (container) of the portlet.
		 * This method is not intended to be used by developers.
		 * @methodOf PortletInterface#
		 * @name setPortletPlaceholder
		 * @param {PortletPlaceholder} plhd the new placeholder of the portlet
		 */
		obj.prototype.setPortletPlaceholder = obj.prototype.setPortletPlaceholder || function(plhd)	{
			this.placeholder = plhd;
		};
		
		/**
		 * Get the page instance
		 * @methodOf PortletInterface#
		 * @name getPage
		 * @returns {Page} the page instance
		 */
		obj.prototype.getPage = obj.prototype.getPage || function()	{
			return SingletonFactory.getInstance(Page);
		};
		
		/**
		 * Get the init parameters of the portlet. These parameters are
		 * usually configured in a <code>layout.txt</code>
		 * @methodOf PortletInterface#
		 * @name getInitParameters
		 * @param {Page} the page instance
		 */
		obj.prototype.getInitParameters = obj.prototype.getInitParameters || function()	{
			if (this.initParams == undefined)
				this.initParams = Array();
			return this.initParams;
		};
		
		/**
		 * Change the init parameters. This method is not intended to be used
		 * by developers.
		 * @methodOf PortletInterface#
		 * @name setInitParameters 
		 * @param {Object} params the init parameters
		 */
		obj.prototype.setInitParameters = obj.prototype.setInitParameters || function(params)	{
			this.initParams = params;
		};
		
		/**
		 * Get the current request
		 * @methodOf PortletInterface#
		 * @name getRequest
		 * @param {Request} the current request
		 */
		obj.prototype.getRequest = obj.prototype.getRequest || function()	{
			return this.getPage().getRequest();
		};
		
		obj.prototype.requestForMatchingEffectiveResource = obj.prototype.requestForMatchingEffectiveResource || function(resourceName, condition)	{
			var app = SingletonFactory.getInstance(Application);
			var rm = app.getResourceManager();
			return rm.requestForCustomResource("#effective-area #"+this.getName()+"-"+resourceName+" "+condition);
		};
		
		/**
		 * Get the portlet resource. This resource resides in the portlet template
		 * and is not visible to users.
		 * @methodOf PortletInterface#
		 * @name getPortletResource
		 * @param resourceName the name (or ID) of the resource
		 * @returns {Resource} the portlet (means template) resource with matching name
		 */
		obj.prototype.getPortletResource = obj.prototype.getPortletResource || function(resourceName)	{
			var app = SingletonFactory.getInstance(Application);
			var rm = app.getResourceManager();
			return rm.requestForCustomResource("#"+this.getName()+"-RootData #"+this.getName()+"-"+resourceName);
		};
		
		/**
		 * Get the portlet DOM resource. This resource resides in the portlet rendered
		 * content and is visible to users.
		 * @methodOf PortletInterface#
		 * @name getDomResource
		 * @param resourceName the name of the resource
		 * @returns {Resource} the DOM (means rendered) resource with matching name
		 */
		obj.prototype.getDomResource = obj.prototype.getDomResource || function(resourceName)	{
			var app = SingletonFactory.getInstance(Application);
			var rm = app.getResourceManager();
			return rm.requestForCustomResource("#effective-area #"+this.getName()+"-"+resourceName);
		};
		
		/**
		 * Get the <code>HTML ID</code> of a resource by its name.
		 * @methodOf PortletInterface#
		 * @name getResourceID
		 * @param resourceName the name of the resource
		 * @returns {String} the ID of the resource with matching name
		 */
		obj.prototype.getResourceID = obj.prototype.getResourceID || function(resourceName)	{
			return this.getName()+"-"+resourceName;
		};
		
		/**
		 * Get a localized text.
		 * @methodOf PortletInterface#
		 * @name getLocalizedText
		 * @param resourceName the name of the text
		 * @returns {String} the localized text
		 */
		obj.prototype.getLocalizedText = obj.prototype.getLocalizedText || function(resourceName)	{
			var app = SingletonFactory.getInstance(Application);
			var rm = app.getResourceManager();
			var res = rm.requestForResource(this.getName(), "Text"+resourceName);
			if (res == undefined)
				return undefined;
			return res.html();
		};
		
		/**
		 * Get a localized message. A message can be parameterized.
		 * @methodOf PortletInterface#
		 * @name getLocalizedMessage
		 * @param resourceName the name of the message
		 * @returns {String} the localized message
		 */
		obj.prototype.getLocalizedMessage = obj.prototype.getLocalizedMessage || function(resourceName)	{
			var app = SingletonFactory.getInstance(Application);
			var rm = app.getResourceManager();
			var res = rm.requestForResource(this.getName(), "Message"+resourceName);
			if (res == undefined)
				return undefined;
			var unresolved = res.html();
			
			var resolved = unresolved;
			//resolved string pattern
			for(var i=1;i<arguments.length;i++)	{
				resolved = resolved.replace("%"+i, arguments[i]);
			}
			return resolved;
		};
	}
});