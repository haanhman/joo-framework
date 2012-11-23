MotionMovePlugin = Class.extend({
	
	onMotionMove: function(e) {
		var obj = e.obj;
		var fn = e.fn;
		var sample = e.sample;
		var from = e.from;
		var to = e.to;
		var type = e.type;
		var interval = e.interval;
		var sample = (to - from) / sample;
		this.runWithFunction(obj, fn, from, to, sample, interval, type);
	},
	
	runWithFunction: function(obj, fn, current, time, sample, interval, type) {
		if ((current - time) * sample > 0) {
			obj.dispatchEvent('motionended');
			return;
		}
		current += sample;
		var pos;
		if (typeof fn == "function")
			pos = fn(current);
		else if (fn instanceof Array)
			pos = fn[current];
		else
			pos = fn.runFn(current);
		if (type == "translate") {
			obj.setStyle('-webkit-transform', 'translate3d('+pos.x+'px, '+pos.y+'px, 0)');
		} else {
			obj.setStyle('top', pos.y);
			obj.setStyle('left', pos.x);
		}
		var _self = this;
		setTimeout(function() {
			_self.runWithFunction(obj, fn, current, time, sample, interval, type);
		}, interval);
	}
}).implement(PluginInterface);