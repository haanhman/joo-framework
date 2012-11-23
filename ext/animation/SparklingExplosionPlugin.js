SparklingExplosionPlugin = Class.extend({
	
	onBegin: function() {
		var initParams = this.getInitParameters();
		this.minInterval = initParams.minInterval || 0;
		this.previous = -1;
		this.entropy = initParams.entropy || 25;
		this.number = initParams.number || 2;
		this.zIndex = initParams.zIndex || 1000;
		this.effects = initParams.effects ||
		    {'-webkit-transform': 'scale3d(0, 0, 0) rotate(360deg)',
		    'opacity': '0'};
		this.parentEffects = initParams.parentEffects ||
		    {'-webkit-transform': 'rotate(360deg)', 'width': '48', height: '48'};
		this.origin = initParams.origin || 75;
		this.image = initParams.image || 'images/star.png';
		this.childrenWidth = initParams.childrenWidth || 24;
		var _self = this;
		var w = $(window).width();
		var h = $(window).height();

		if (!initParams.disableAutoSpawn) {
			this.interval = setInterval(function() {
				_self.createStar(Math.random() * w, Math.random() * h, 1000);
			}, 1000);
		}
		
		this.startEvent = initParams.startEvent || 'touchstart';
		this.event = initParams.event || 'touchmove';
		this.endEvent = initParams.endEvent || 'touchend';
		this.current = 0;
		this.count = 0;
		var _self = this;
		
		if (!initParams.disableMouseTracking) {
			this.mouseStartFn = function(e) {
				e.stopPropagation();
				e.preventDefault();
				_self.mouseStart(e);
			}
			this.mouseMoveFn = function(e) {
				e.stopPropagation();
				e.preventDefault();
				_self.mouseChange(e);
			}
			this.mouseEndFn = function(e) {
				e.stopPropagation();
				e.preventDefault();
				_self.mouseEnd(e);
			}
			this.prevX = 0;
			this.prevY = 0;
			this.mode = initParams.mode || "explosion";
			document.addEventListener(this.startEvent, this.mouseStartFn);
			document.addEventListener(this.event, this.mouseMoveFn);
			document.addEventListener(this.endEvent, this.mouseEndFn);
		}
	},
	
	onChangeSparklingEffect: function(e) {
		if (e.minInterval)
			this.minInterval = e.minInterval;
		if (e.entropy)
			this.entropy = e.entropy;
		if (e.number)
			this.number = e.number;
		if (e.effects)
			this.effects = e.effects;
	},
	
	mouseStart: function(e) {
		this.x = e.touches[0].pageX;
		this.y = e.touches[0].pageY;
		var _self = this;
		this.mouseInterval = setInterval(function() {
			_self.mouseMove();
		}, this.minInterval);
	},
	
	mouseEnd: function() {
		clearInterval(this.mouseInterval);
	},
	
	mouseChange: function(e) {
		this.x = e.touches[0].pageX;
		this.y = e.touches[0].pageY;
	},
	
	onRunExplosionEffect: function(e) {
		var x = e.x;
		var y = e.y;
		var _self = this;
		clearInterval(this.effectInterval);
		this.effectInterval = setInterval(function() {
			_self._runEffect(x, y);
		}, e.interval);
	},
	
	_runEffect: function(x, y) {
		for(var i=0; i<this.number; i++) {
			this.createStar(x, y, x+Math.random()*2*this.entropy-this.entropy, y+Math.random()*2*this.entropy-this.entropy, 500+Math.random()*100-50);
		}
	},
	
	onStopExplosionEffect: function() {
		clearInterval(this.effectInterval);
	},
	
	mouseMove: function() {
		var _self = this;//e.data._self;
//		for(var j=0, l=e.touches.length; j<l; j++) {
			var x = this.x;
			var y = this.y;
			
			switch(this.mode) {
			case "explosion":
				for(var i=0; i<_self.number; i++) {
					_self._runEffect(x, y);
				}
				break;
			case "comet":
				if (this.prevX == -1) this.prevX = x;
				if (this.prevY == -1) this.prevY = y;
				for(var i=0; i<_self.number; i++) {
					var posX, posY;
					if (this.prevX > x) {
						posX = x + Math.random()*this.entropy;
					} else {
						posX = x - Math.random()*this.entropy;
					}
					if (this.prevY > y) {
						posY = y + Math.random()*this.entropy;
					} else {
						posY = y - Math.random()*this.entropy;
					}
					_self.createStar(x, y, posX, posY, 500+Math.random()*100-50);
				}
				break;
			}
			
			this.prevX = x;
			this.prevY = y;
//		}
	},
	
	createStar: function(origX, origY, x, y, time) {
		var _self = this;
		
		var sparkling = $('<div style="display: inline-block"><img src="'+this.image+'" /></div>');
		$(sparkling).css('position', 'absolute');
		$(sparkling).css('left', x);
		$(sparkling).css('top', y);
		$(sparkling).css('width', this.childrenWidth);
		$(sparkling).css('height', this.childrenWidth);
		$(sparkling).css('z-index', this.zIndex);
		var origin = Math.random()*75 + 25;
//		$(sparkling).css('-webkit-transform-origin', origin + '% ' + origin + '%');
		$(sparkling).css('-webkit-transition', 'all '+1000+'ms linear');
		
		$(sparkling).find('img').css('opacity', Math.random() *0.5+0.5);
		$(sparkling).find('img').css('width', this.childrenWidth);
		$(sparkling).find('img').css('-webkit-transition', 'all '+time+'ms linear');
		$('body').append(sparkling);
		
		$(sparkling).css('top');
		
		for(var i in this.effects) {
			$(sparkling).find('img').css(i, this.effects[i]);
		}
		
		var x1 = (x - origX) * 10 + origX;
		var k = (x - x1)/(origX - x1);
		var y1 = (k*origY - y) / (k - 1); 
		$(sparkling).css('left', x1);
		$(sparkling).css('top', y1);
//		for(var i in this.parentEffects) {
//			$(sparkling).css(i, this.parentEffects[i]);
//		}
		setTimeout(function() {
			$(sparkling).remove();
		}, time);
	},
	
	onRunEffectFunction: function(e) {
		var fn = e.fn;
		var time = e.time;
		var interval = e.interval;
		
		this.runEffect(fn, 0, time, interval);
	},
	
	runEffect: function(fn, current, time, interval) {
		if (current >= time)
			return;
		current ++;
		var pos = fn(current);
		this.mouseMove({
			touches: [
			    {pageX: pos.x, pageY: pos.y}
			]
		});
		this.createStar(pos.x, pos.y, 2000+Math.random()*100-50);
		var _self = this;
		setTimeout(function() {
			_self.runEffect(fn, current, time, interval);
		}, interval);
	},
	
	onEnd: function() {
		$(document).unbind(this.event, this.mouseMoveFn);
		clearInterval(this.interval);
	}
}).implement(PluginInterface);