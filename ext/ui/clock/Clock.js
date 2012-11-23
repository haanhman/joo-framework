Clock = Sketch.extend({
	
	setupDomObject: function(config) {
		this._super(config);
		this.timeInterval = this.config.interval || 1000;
		this.addEventListener('stageUpdated', function() {
			this.interval = undefined;
			this.ellapsed = 0;
			this.updateTime();
			if (!config.delay) {
				if (config['start-after']) {
					var _self = this;
					setTimeout(function() {
						_self.startTimer();
					}, config['start-after']);
				} else {
					this.startTimer();
				}
			}
		});
	},
	
	stopTimer: function() {
		this.dispatchEvent('timerstop');
		clearInterval(this.interval);
		this.ellapsed = 0;
		this.updateTime();
	},
	
	pauseTimer: function() {
		this.dispatchEvent('timerpause');
		clearInterval(this.interval);
	},
	
	startTimer: function() {
		if (this.interval) {
			this.stopTimer();
		}
		this.dispatchEvent('timerstart');
		var _self = this;
		this.interval = setInterval(function() {
			_self.tick();
		}, this.timeInterval);
	},
	
	tick: function() {
		this.ellapsed ++;
		this.updateTime();
		this.dispatchEvent('timertick');
	},
	
	updateTime: function() {
		var time = TimeUtils.formatTime(this.ellapsed);
		this.access().html(time);
	},
	
	dispose: function(skipRemove) {
		clearInterval(this.interval);
		this._super(skipRemove);
	}
});
