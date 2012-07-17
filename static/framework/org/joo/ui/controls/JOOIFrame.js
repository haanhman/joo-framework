/**
 * @class A counterpart of <code>HTML IFRAME</code> element
 * <p>It supports additional configuration parameters:</p>
 * <ul>
 * 	<li><code>src</code> The source of the iframe</li>
 * </ul>
 * @augments Sketch
 */
JOO.define('org.joo.ui.controls.JOOIFrame',
/** @lends JOOIFrame# */		
{
	extend: org.joo.ui.DisplayObjectContainer, 
	
	setupBase: function(config) {
		this._super(config);
	},
	
	setupDomObject: function(config) {
		this._super(config);
		if (config.src)
			this.setAttribute('src', config.src);
		this.setAttribute('name', this.getId());
	},
	
	/**
	 * Change source of the iframe
	 * @param {String} src new source (URL) of the iframe
	 */
	setSrc: function(src) {
		this.setAttribute('src', src);
	},

	/**
	 * Get the source of the iframe
	 * @returns {String} the source of the iframe
	 */
	getSrc: function() {
		return this.getAttribute('src');
	},
	
	toHtml: function() {
		return "<iframe></iframe>";
	}
});