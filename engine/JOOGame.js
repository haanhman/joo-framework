JOOGame = Sketch.extend({
	
	setupDomObject: function(config) {
		this._super(config);
		this.initialize();
	},
	
	initialize: function() {
		this.fps = this.config.fps;
		this.noFps = this.config.noFps;
		this.running = false;
		this.starting = false;
		this.keys = {};
		
		var _self = this;
		
		//TODO: Unbind events in dispose()
		$(document).bind('keydown', function(e) {
			_self.keys[e.keyCode] = true;
		});
		$(document).bind('keyup', function(e) {
			delete _self.keys[e.keyCode];
		});
	},
	
	getKey: function(key) {
		return this.keys[key];
	},
	
	clearKey: function(key) {
		delete this.keys[key];
	},
	
	run: function() {
		if (this.starting)
			return;
		this.starting = true;
		this.play();
	},
	
	setFps: function(fps) {
		this.fps = fps;
		this.pause();
	},
	
	play: function() {
		if (this.running)
			return;
		this.running = true;
		
		var _self = this;
		this.onFrame();
	},
	
	pause: function() {
		this.running = false;
		clearTimeout(this.timeout);
	},
	
	resume: function() {
		this.play();
	},
	
	onFrame: function() {
		if (!this.running || this.noFps)
			return;
		this.doFrame();
		this.paintFrame();
		
		if (this.running) {
			var _self = this;
			this.timeout = setTimeout(function() {
				_self.onFrame();
			}, 1000/this.fps);
		}
	},
	
	doFrame: function() {},
	
	paintFrame: function() {},
	
	dispose: function(skipRemove) {
		this.pause();
		this._super(skipRemove);
	}
});