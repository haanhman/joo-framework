/**
 * @class A counterpart of <code>HTML LABEL</code> element.
 * @augments UIComponent
 */
JOO.define('org.joo.ui.controls.JOOLabel', 
/** @lends JOOLabel# */		
{
	extend: org.joo.ui.UIComponent, 
	
	setupDomObject: function(config) {
		this._super(config);
		this.access().html(config.lbl);
	},
	
	toHtml: function()	{
		return "<label></label>";
	},
	
	/**
	 * Get the text of the label
	 * @returns {String} the label's text
	 */
	getText: function()	{
		return this.access().html();
	},
	
	/**
	 * Change the text of the label
	 * @param {String} txt the new text
	 */
	setText: function(txt)	{
		this.access().html(txt);
	}
});