/**
 * @class A simple audio player, extending the {@link JOOVideo}.
 * @augments JOOVideo
 */
JOO.define('org.joo.ui.media.JOOAudio', {
	
	extend: org.joo.ui.JOOVideo,
	
	toHtml: function() {
		return "<audio></audio>";
	}
});