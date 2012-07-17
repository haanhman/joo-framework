JOO.define('org.joo.web.ui.PortletPlaceholder',
/** @lends PortletPlaceholder# */		
{
	/**
	 * @class A placeholder to store a single portlet.
	 * It acts as a bridge between Portlet and {@link PortletCanvas}
	 * @augments Class
	 * @param canvas the portlet canvas
	 * @constructs
	 */
	init: function(canvas)	{
		this.canvas = canvas;
	},
	
	/**
	 * Add an object to the canvas
	 * @param {Object} object the object to be added
	 */
	addToCanvas: function(object)	{
		this.canvas.addChild(object);
	},
	
	/**
	 * Clear everything and repaint the canvas
	 * @param {String} html the HTML data to be painted
	 */
	paintCanvas: function(html)	{
		this.canvas.repaint(html);
		var subject = SingletonFactory.getInstance(Subject);
		subject.notifyEvent('HtmlUpdated');
	},
	
	/**
	 * Append to the canvas
	 * @param {String} html the HTML data to be appended
	 */
	drawToCanvas: function(html)	{
		this.canvas.paint(html);
		var subject = SingletonFactory.getInstance(Subject);
		subject.notifyEvent('HtmlUpdated');
	},
	
	/**
	 * Access the underlying canvas
	 * @returns {PortletCanvas} the portlet canvas
	 */
	getCanvas: function()	{
		return this.canvas;
	}
});