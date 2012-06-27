/**
 * Create a new XuiResourceLocator
 * @class A simple resource locator which using xui.js library
 * @name org.joo.core.XuiResourceLocator
 * @augments org.joo.core.ResourceLocator
 */
JOO.define('org.joo.core.resource.XuiResourceLocator',
/** @lends XuiResourceLocator# */		
{
	extend: org.joo.core.resource.ResourceLocator,
	
	locateResource: function(id)	{
		if (JOOUtils.isTag(id))
			return x$(id);
//		if (x$('#'+id).length > 0)	{
			return x$('#'+id);
//		}
//		return undefined;
	},

	/**
	 * Locate a resource using a custom selector
	 * @param {String} custom the custom selector
	 * @returns {Resource} the located resource
	 */
	locateCustomResource: function(custom)	{
//		if (x$(custom).length > 0)	{
			return x$(custom);
//		}
//		return undefined;
	}
});