JOO.define('org.joo.core.resource.ResourceManager',
/** @lends org.joo.core.ResourceManager# */	
{
	/**
	 * Initialize resource locators.
	 * @class Manage resource using the underlying resource locator
	 * @name org.joo.core.ResourceManager
	 * @augments Class
	 * @constructs
	 */
	init: function()	{
		this.resourceLocator = new org.joo.core.resource.JQueryResourceLocator();
		this.caches = {};
	},
	
	/**
	 * Change the current resource locator.
	 * @param {org.joo.core.ResourceLocator} locator the resource locator to be used
	 */
	setResourceLocator: function(locator)	{
		this.resourceLocator = locator;
	},
	
	/**
	 * Get the current resource locator.
	 * @returns {org.joo.core.ResourceLocator} the current resource locator
	 */
	getResourceLocator: function(locator)	{
		return this.resourceLocator;
	},
	
	/**
	 * Ask the underlying resource locator for a specific resource
	 * @param {String} type used as a namespace to distinct different resources with the same name
	 * @param {String} name the name of the resource
	 * @param {org.joo.core.ResourceLocator} resourceLocator Optional. The resource locator to be used in the current request
	 * @param {Boolean} cache Optional. Should the resource be cached for further use
	 * @returns {Resource} the located resource
	 */
	requestForResource: function(type, name, resourceLocator, cache)	{
		if (type != undefined)
			name = type+"-"+name;
		
		if (cache && this.caches[name]) {
//			console.log('cache hit: '+name);
			return this.caches[name];
		}
		
		var rl = resourceLocator || this.resourceLocator;
		var res = rl.locateResource(name);
		if (cache)
			this.caches[name] = res;
		return res;
	},
	
	/**
	 * Ask the underlying resource locator for a custom resource
	 * @param {String} customSelector the selector used to retrieve the resource, depending on underlying the resource locator
	 * @param {org.joo.core.ResourceLocator} resourceLocator Optional. The resource locator to be used in the current request
	 * @returns {Resource} the located resource
	 */
	requestForCustomResource: function(customSelector, resourceLocator)	{
		if (resourceLocator != undefined)	{
			return resourceLocator.locateResource(customSelector);
		}
		return this.resourceLocator.locateCustomResource(customSelector);
	}
});