/**
 * Create a new Sketch
 * @class A concrete subclass of DisplayObjectContainer.
 * It is a counterpart of <code>HTML DIV</code> element
 * @augments DisplayObjectContainer
 */
JOO.define('org.joo.ui.Sketch', 
/** @lends Sketch# */
{
	extend: org.joo.ui.DisplayObjectContainer,
	
	setupDomObject: function(config) {
		this._super(config);
	},
	
	toHtml: function()	{
		return "<div></div>";
	}
});