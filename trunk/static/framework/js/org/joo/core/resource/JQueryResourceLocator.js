/**
 * Create a new JQueryResourceLocator
 * @class JQuery Resource Locator.
 * @name org.joo.core.JQueryResourceLocator
 * @augments org.joo.core.ResourceLocator
 */
JOO.define('org.joo.core.resource.JQueryResourceLocator',
/** @lends JQueryResourceLocator# */
{
	extend: org.joo.core.resource.ResourceLocator,
	
	locateResource: function(id)	{
		if (JOOUtils.isTag(id))
			return $(id);
//		if ($('#'+id).length > 0)	{
			return $('#'+id);
//		}
//		return undefined;
	},
	
	/**
	 * Locate resource based on the custom selector
	 * @param {String} custom the custom selector
	 * @returns {Resource} the located resource
	 */
	locateCustomResource: function(custom)	{
//		if ($(custom).length > 0)	{
			return $(custom);
//		}
//		return undefined;
	}
});