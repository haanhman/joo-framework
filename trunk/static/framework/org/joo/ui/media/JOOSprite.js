/**
 * @class A sprite is a keyframe-based animation object which has a timeline. This is
 * base class of all animation classes.
 * <p>It supports additional configuration parameters:</p>
 * <ul>
 * 	<li><code>src</code> the background image source, should be a sprite image</li>
 * 	<li><code>framerate</code> the framerate of the sprite</li>
 * 	<li><code>loop</code> whether the animation should loop</li>
 * 	<li><code>horizontalFramesNo</code> the number of frames in horizontal dimension</li>
 * 	<li><code>verticalFramesNo</code> the number of frames in vertical dimension</li>
 * 	<li><code>spriteWidth</code> the width of the viewport of sprite</li>
 * 	<li><code>spriteHeight</code> the height of the viewport of sprite</li>
 * 	<li><code>speed</code> the relative speed of sprite, e.g 1.5, 2, etc</li>
 * </ul>
 * @augments UIComponent
 */
JOO.define('org.joo.ui.media.JOOSprite', 
/** @lends JOOSprite# */
{
	extend: org.joo.ui.UIComponent,
	
	setupDomObject: function(config) {
		this._super(config);
		this.src = config.src;
		this.framerate = config.framerate || 30;
		this.loop = config.loop || false;
		this.currentFrame = 0;
		this.horizontalFramesNo = config.horizontalFramesNo;
		this.verticalFramesNo = config.verticalFramesNo;
		this.spriteWidth = config.spriteWidth;
		this.spriteHeight = config.spriteHeight;
		this.speed = config.speed || 1;
		this.stopped = false;
	},

	/**
	 * Play the sprite from <code>start</code> frame to <code>end</code> frame.
	 * @param {Number} start the start frame
	 * @param {Number} end the end frame
	 */
	play: function(start, end) {
		this.stopped = false;
		this.dispatchEvent("frameStart");
		this.startFrame = start || 0;
		this.endFrame = end;
		if(end == undefined){
			this.endFrame = this.verticalFramesNo * this.horizontalFramesNo; 
		} 
		this.currentFrame = this.startFrame;
		
		this.setWidth(this.spriteWidth);
		this.setHeight(this.spriteHeight);
		if (this.src)
			this.access().css('background-image', 'url('+this.src+')');

		this.playFrame();
		this._playWithFramerate(this.framerate);
	},
	
	_playWithFramerate: function(framerate) {
		framerate *= this.speed;
		if (!this.stopped) {
			var _self = this;
			this.interval = setInterval(function() {
				_self.playFrame();
			}, parseFloat(1000/framerate));
		}
	},

	/**
	 * Change the relative speed of the sprite.
	 * @param speed the relative speed of the sprite
	 */
	setSpeed: function(speed) {
		var tempFramerate = this.framerate * speed;
		clearInterval(this.interval);
		this._playWithFramerate(tempFramerate);
	},
	
	/**
	 * Pause the sprite.
	 */
	pause: function() {
		this.dispatchEvent("framePause");
		clearInterval(this.interval);
	},
	
	/**
	 * Resume the sprite.
	 */
	resume: function() {
		this.dispatchEvent("frameResume");
		this._playWithFramerate(this.interval);
	},
	
	/**
	 * Stop the sprite.
	 */
	stop: function() {
		this.dispatchEvent("frameStop");
		this.stopped = true;
	},
	
	playFrame: function() {
		var ended = false;
		if (this.currentFrame > this.endFrame) {
			if (this.loop) {
				this.currentFrame = this.startFrame;
			} else {
				ended = true;
			}
		}
		if (ended || this.stopped) {
			clearInterval(this.interval);
			this.stopped = true;
			this.dispatchEvent("frameEnded");
			return;
		}
		this.dispatchEvent("frameEnter");
		this.onFrame(this.currentFrame);
		this.dispatchEvent("frameExit");
		this.currentFrame++;
	},
	
	/**
	 * This method defines how animation works. Subclass can override it to
	 * change the behaviour. This implementation just change the 
	 * <code>background-position</code> of the sprite.
	 * @param frame
	 */
	onFrame: function(frame) {
		var x = frame % this.horizontalFramesNo;
		var y = 0;
		if (this.currentFrame != 0)
			Math.ceil(frame / this.horizontalFramesNo);
		var xPos = -x*this.spriteWidth+"px";
		var yPos = -y*this.spriteHeight+"px";
		this.access().css('background-position', xPos+' '+yPos);
	},
	
	toHtml: function() {
		return "<div></div>";
	},
	
	dispose: function() {
		this.stop();
		this._super();
	}
});