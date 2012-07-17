/**
 * @class A component into which can be painted.
 * @augments DisplayObject
 */
JOO.define('org.joo.ui.Graphic',
/** @lends Graphic# */
{
	extend: org.joo.ui.DisplayObject,
	
	/**
	 * Clear & repaint the component.
	 * @param {String} html content to be repainted
	 */
	repaint: function(html) {
		this.access().html(html);
	},
	
	/**
	 * Paint (append) specific content to the component.
	 * @param {String} html content to be painted
	 */
	paint: function(html) {
		this.access().append(html);
	},

	/**
	 * Clear the current content.
	 */
	clear: function() {
		this.access().html("");
	},
	
	toHtml: function() {
		return "<div></div>";
	}
});