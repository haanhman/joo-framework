JOO.define('org.joo.web.Request',
/** @lends Request# */
{
	/**
	 * Create a new request.
	 * @param {String} name the name of the page
	 * @param {Object} type reserved
	 * @param {Object} params the parameters associated with the request
	 * @param {hideParams} a list of parameters that will not be displayed in
	 * the URL bar when the request is executed
	 * @class Represents a request
	 * @augments Class
	 * @constructs
	 */
	init: function(name, type, params, hideParams) {
		if (name != undefined)
			name = name.trim();
		this.name = name;
		this.type = type;
		if (params == undefined) {
			params = Array();
		}
		if (hideParams == undefined) {
			hideParams = Array();
		}
		this.params = params;
		this.hiddenParams = hideParams;
		this.setParams(params);
	},
	
	/**
	 * Set the value of a specific parameter
	 * @param {String} key the parameter name
	 * @param {String} value the new value
	 */
	setParam: function(key, value) {
		this.params[key] = value;
	},
	
	/**
	 * Change all parameters to a new map
	 * @param {Object} params the new parameters map
	 */
	setParams: function(params) {
		this.params = params;
	},

	/**
	 * Get the value of a paramter of current request
	 * @param {String} key the parameter
	 * @param {String} defaultValue the default value, if the parameter is not defined
	 * @returns {String} the value of the parameter
	 */
	getParam: function(key, defaultValue) {
		if (this.params[key] == undefined) {
			return defaultValue;
		}
		return this.params[key];
	},

	/**
	 * Get all parameters.
	 * @returns {Object} the parameters map
	 */
	getParams: function() {
		return this.params;
	},
	
	/**
	 * Change the hash value of current location.
	 * @param {String} strToAdd the location after the hash symbol (#)
	 */
	addHash: function(strToAdd) {
		window.location.hash = strToAdd;
	},
	
	/**
	 * Change the name of the page represented by this request.
	 * @param {String} name the name of the page
	 */
	setName: function(name) {
		this.name = name;
	},

	/**
	 * Get the name of the page represented by this request
	 * @returns {String}
	 */
	getName: function() {
		return this.name;
	},
	
	getType: function() {
		return this.type;
	}
});