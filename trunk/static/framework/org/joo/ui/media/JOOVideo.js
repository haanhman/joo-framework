/**
 * @class A simple video player, counterpart of <code>HTML5 VIDEO</code>
 * <p>It supports additional configuration parameters</p>
 * <ul>
 * 	<li><code>src</code> The source of the video</li>
 * 	<li><code>controls</code> Whether the controls are visible</li>
 * </ul> 
 * @augments UIComponent 
 */
JOO.define('org.joo.ui.media.JOOVideo',
/** @lends JOOVideo# */		
{
	extend: org.joo.ui.UIComponent,
	
	setupDomObject: function(config) {
		this._super(config);
		if (config.controls) {
			this.setAttribute('controls', '');
		}
		if (config.src) {
			this.setAttribute('src', config.src);
		}
	},

	/**
	 * Play the video
	 */
	play: function() {
		this.access()[0].play();
	},
	
	toHtml: function() {
		return "<video></video>";
	},
	
	dispose: function(){
		this.access()[0].pause();
		this._super();
	}
});