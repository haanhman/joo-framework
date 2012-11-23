GameStateInterface = InterfaceImplementor.extend({
	
	implement: function(obj) {
		obj.prototype.doFrame = obj.prototype.doFrame || function() {
			
		};
		
		obj.prototype.paintFrame = obj.prototype.paintFrame || function() {
			
		};
		
		obj.prototype.onWakeup = obj.prototype.onWakeup || function() {
			
		};
		
		obj.prototype.onBegin = obj.prototype.onBegin || function() {
			
		};
		
		obj.prototype.stopAllActions = obj.prototype.stopAllActions || function() {
			if (this.intervals) {
				for(var i=0; i<this.intervals.length; i++) {
					clearInterval(this.intervals[i]);
				}
			}
			if (this.timeouts) {
				for(var i=0; i<this.timeouts.length; i++) {
					clearTimeout(this.timeouts[i]);
				}
			}
			this.timeouts = [];
			this.intervals = [];
		};
		
		obj.prototype.onPause = obj.prototype.onPause || function() {
			
		};
		
		obj.prototype.setInterval = obj.prototype.setInterval || function(fn, time, auto) {
			var _self = this;
			var interval = setInterval(function() {
				fn.apply(_self);
			}, time);
			this.intervals = this.intervals || [];
			this.intervals.push(interval);
			
			if (auto) {
				fn.apply(_self);
			}
		};
		
		obj.prototype.setTimeout = obj.prototype.setTimeout || function(fn, time) {
			var _self = this;
			var timeout = setTimeout(function() {
				fn.apply(_self);
				clearTimeout(timeout);
			}, time);
			this.timeouts = this.timeouts || [];
			this.timeouts.push(timeout);
		};
		
		obj.prototype.toState = obj.prototype.toState || function(state, data) {
			this.dispatchEvent('stateChanged', {
				name: state,
				eventData: data
			});
		};
	}
});