/**
 * @class A counterpart of <code>HTML Form</code>
 * <p>It supports additional configuration parameters:</p>
 * <ul>
 * 	<li><code>method</code> The method used when submitting the form</li>
 * 	<li><code>encType</code> The encoded type, the default type is <code>application/x-www-form-urlencoded</code></li>
 * </ul>
 * @augments Sketch
 */
JOO.define('org.joo.ui.controls.JOOForm',
/** @lends JOOForm# */
{
	extend: org.joo.ui.DisplayObjectContainer,
	
	setupDomObject: function(config) {
		this._super(config);
		config.method = config.method || "post";
		config.encType = config.encType || "application/x-www-form-urlencoded";
		this.setAttribute("method", config.method);
		this.setAttribute("enctype", config.encType);
	},

	/**
	 * Submit the form
	 */
	submit: function() {
		this.access().submit();
	},
	
	toHtml: function() {
		return "<form></form>";
	}
});