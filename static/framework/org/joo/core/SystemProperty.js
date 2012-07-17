JOO.define('org.joo.core.SystemProperty',
/** @lends SystemProperty# */
{
	/**
	 * Initialize properties.
	 * @class A class to store system-wide properties
	 * @name org.joo.core.SystemProperty
	 * @augments Class
	 * @constructs
	 */
	init: function()	{
		this.properties = Array();
	},
	
	/**
	 * Retrieve the value of a property.
	 * @param {String} property the name of the property to retrieve
	 * @param {Object} defaultValue the default value, used if the property is not found
	 * @returns {mixed} the property value, or the default value or undefined 
	 */
	get: function(property, defaultValue)	{
		var cookieValue = undefined;
		if (typeof $ != 'undefined' && typeof $.fn.cookie != 'undefined')
			cookieValue = $.cookie(property);
		if(cookieValue != undefined){
			return cookieValue;
		}else if(this.properties[property] != undefined){
			return this.properties[property];
		}else {
			return defaultValue;
		}
	},
	
	/**
	 * Store the value of a property.
	 * @param {String} property the name of the property to store
	 * @param {Object} value the new value
	 * @param {Boolean} persistent should the property be stored in cookie for future use
	 */
	set: function(property, value, persistent)	{
		if(!persistent){
			this.properties[property] = value;
		}else{
			$.cookie(property,value,{ expires: 1 });
		}
		var subject = SingletonFactory.getInstance(Subject);
		subject.notifyEvent("SystemPropertyChanged", property);
	}
});
