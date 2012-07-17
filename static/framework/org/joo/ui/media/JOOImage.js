/**
 * @class A counterpart of <code>HTML IMG</code> element.
 * <p>It supports additional configuration parameters</p>
 * <ul>
 * 	<li><code>defaultSrc</code> The default source of the image, 
 * 	if the provided source is broken</li>
 * 	<li><code>src</code> The source of the image</li>
 * </ul>
 * @augments UIComponent
 */
JOO.define('org.joo.ui.media.JOOImage', 
/** @lends JOOImage# */
{
	extend: org.joo.ui.UIComponent,
	
	setupDomObject: function(config) {
		this._super(config);
		this.defaultSrc = config.defaultSrc || "static/images/image-default.png";
		config.src = config.src || this.defaultSrc;
		this.setSrc(config.src);
		this.addEventListener('error', function() {
			this.setSrc(this.defaultSrc);
		});
	},
	
	toHtml: function()	{
		return "<img />";
	},

	/**
	 * Get the source of the image
	 * @returns {String} the image source
	 */
	getSrc: function()	{
		return this.getAttribute('src');
	},

	/**
	 * Change the source of the image
	 * @param {String} src the new image source
	 */
	setSrc: function(src) {
		this.setAttribute('src', src);
	}
});