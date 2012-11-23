MotionHelperFactory = {
	
	createHelper: function(name, config) {
		name = name.substring(0, 1).toUpperCase() + name.substring(1);
		var cls = window[name+"MotionHelper"];
		if (!cls)
			throw new Error("Motion of type '"+name+"' is not defined");
		config = config || {};
		var helper = new cls(config);
		return helper;
	}
};

BasicMotionHelper = Class.extend({

	init : function(config) {
		this.data = config.data;
	},

	runFn : function(x) {
		return this.data[time];
	}
});

SineMotionHelper = Class.extend({

	init : function(config) {
		this.amp = config.amp || 1;
		this.cycle = config.cycle || 1;
		this.phase = config.phase || 0;
		this.sign = config.sign || 0;
		this.decreaseAmp = config.decreaseAmp || false;
		this.decreaseTime = config.decreaseTime || 4;
		this.currentDecrease = 0;
	},

	runFn : function(x) {
		var amp = this.amp;
		var cycle = this.cycle;
		if (this.decreaseAmp) {
			var rounds = Math.floor(x / (this.cycle / 2));
			if (rounds <= this.decreaseTime) {
				amp *= (this.decreaseTime - rounds) / (this.decreaseTime);
				//cycle *= (this.decreaseTime - rounds/10) / (this.decreaseTime);
			}
		}
		var y = amp * Math.sin(x * 2 * Math.PI / cycle - Math.PI * this.phase / 180);
		if (this.sign != 0) {
			y = Math.abs(y) * this.sign;
		}
		
		var r = {
			x: x,
			y: y
		}
		return r;
	}
});

HarmonicMotionHelper = SineMotionHelper.extend({
	
	runFn : function(x) {
		return {
			x: x,
			y: this.amp * Math.cos(x * 2 * Math.PI / this.cycle - Math.PI * this.phase / 180)
		};
	}
});

BezierMotionHelper = Class.extend({
	
	init: function(config) {
		this.points = config.points;
		this.degree = config.degree || config.points.length - 1;
	},
	
	runFn: function(t) {
		var x = 0, y = 0;
		for(var i=0, n=this.degree; i<=n; i++) {
			var tmp = Math.pow(1 - t, n - i) * Math.pow(t, i);
			x += tmp * this.points[i].x;
			y += tmp * this.points[i].y;
		}
		return {
			x: x,
			y: y
		};
	}
});

// setTimeout(function() {
	
	// var img = new JOOImage();
	// img.domObject = $('#star');
	
	//sine / harmoniac
	// var fn = MotionHelperFactory.createHelper('sine', {
		// phase: 0,	//run at current position, go down
		// amp: 100,	//100px at peak
		// cycle: 300	//300px / 1 cycle
	// });
	// JOOUtils.generateEvent('MotionMove', {obj: img, sample: 150, interval: 10, from: 0, to: 500, fn: fn, type: 'translate'});
	
	//bezier
//	var fn = MotionHelperFactory.createHelper('bezier', {
//		points: [{
//			x: 0,
//			y: 0
//		},
//		{
//			x: 200,
//			y: -500
//		},
//		{
//			x: -200,
//			y: 500
//		},
//		{
//			x: 400,
//			y: 0
//		}]
//	});
//	JOOUtils.generateEvent('MotionMove', {obj: img, sample: 50, interval: 20, from: 0, to: 1, fn: fn, type: 'translate'});
// }, 500);