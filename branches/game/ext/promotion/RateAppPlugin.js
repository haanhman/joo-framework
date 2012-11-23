RateAppPlugin = Class.extend({
	
	onBegin: function() {
		var _self = this;
		document.addEventListener('deviceready', function() {
			var params = _self.getInitParameters();
			var firstRun = localStorage.getItem('first_run');
			var now = new Date().getTime();
			
			if (firstRun) {
				firstRun = parseInt(firstRun);
				if ((now - firstRun) > parseFloat(params.days) * 86400000) {
					this.isRated = localStorage.getItem('is_rated');
					if (params.interval) {
						_self.rateInterval = setInterval(function() {
							_self._interval();
						}, params.interval);
					} else {
						setTimeout(function() {
							_self._interval();
						}, 5000);
					}
				}
			} else {
				localStorage.setItem('first_run', now);
			}
		});
	},
	
	_interval: function() {
		var _self = this;
		var params = this.getInitParameters();
		if (!this.isRated) {
			navigator.notification.confirm(
				params.msg,
				function(btn) {
					if (btn == 2) {
						_self.isRated = true;
						localStorage.setItem('is_rated', 1);
						window.location.href = params.url;
					}
				},
				params.title,
				params.skip + "," + params.rate
			);
		} else {
			clearInterval(this.rateInterval);
		}
	}
}).implement(PluginInterface);