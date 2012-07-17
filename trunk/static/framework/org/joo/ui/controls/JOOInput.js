/**
 * @class A base class for all components which accept user input
 * by any means.
 * <p>It supports additional configuration parameters</p>
 * <ul>
 * 	<li><code>value</code> The value of the input</li>
 * 	<li><code>name</code> The name of the input</li>
 * </ul>
 * @augments UIComponent
 */
JOO.define('org.joo.ui.controls.JOOInput', 
/** @lends JOOInput# */		
{
	extend: org.joo.ui.UIComponent,
	
	setupDomObject: function(config) {
		this._super(config);
		this.access().val(config.value);
		this.setAttribute('name', config.name);
	},

	/**
	 * Change the value of the input
	 * @param {Object} value new value
	 */
	setValue: function(value) {
		this.access().val(value);
	},
	
	/**
	 * Get the value of the input
	 * @returns {Object} the input value
	 */
	getValue: function()	{
		return this.access().val();
	},
	
	/**
	 * Get the name of the input
	 * @returns {String} the input name
	 */
	getName: function() {
		return this.getAttribute('name');
	},
	
	/**
	 * Focus the input
	 */
	focus: function()	{
		this.access().focus();
	}
});