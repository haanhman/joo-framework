AnimationHelperFactory = {

	createHelper : function(name, config) {
		name = name.substring(0, 1).toUpperCase() + name.substring(1);
		var cls = window[name + "AnimationHelper"];
		if (!cls)
			throw new Error("Animation of type '" + name + "' is not defined");
		config = config || {};
		var helper = new cls(config);
		return helper;
	}
};

AnimationUtils = {
	animation: function (obj, time, att, originx, originy, scax, scay, rotate,transx, transy, transz) {
		obj.css('-webkit-transition', ''+time+'ms '+att+'');
		obj.css('-webkit-transform-origin',+originx+'%' +originy+'%');
		obj.css('-webkit-transform','translate3d('+transx+'px,' +transy+'px,' +transz+'px) scale('+scax+',' +scay+') rotate('+rotate+'deg) ');
	},
	
	setOpacity: function(obj, time, att, opac){
		obj.css('-webkit-transition', ''+time+'ms '+att+'');
		obj.css('opacity',+opac);
	},
	
	rotateOnly: function(obj, time, att, originx, originy, rotate){
		obj.css('-webkit-transition', ''+time+'ms '+att+'');
		obj.css('-webkit-transform-origin',+originx+'%' +originy+'%');
		obj.css('-webkit-transform','rotate('+rotate+'deg)');
	},
	
	scaleOnly: function(obj, time, att, originx, originy, scax, scay){
		obj.css('-webkit-transition', ''+time+'ms '+att+'');
		obj.css('-webkit-transform-origin',+originx+'%' +originy+'%');
		obj.css('-webkit-transform','scale('+scax+',' +scay+')');
	},
	
	moveOnly: function(obj, time, att, transx, transy){
		obj.css('-webkit-transition', ''+time+'ms '+att+'');
		obj.css('-webkit-transform-origin','50% 50%');
		obj.css('-webkit-transform','translate3d('+transx+'px,' +transy+'px, 0px)');
	}
}

AbstractAnimationHelper = Class.extend({

	init : function(config) {
		this.config = config || {};
	},

	animate : function(obj, config) {
		if (obj._interacting) return;
		obj._interacting = true;
		if (config) {
			for(var i in config)
				this.config[i] = config[i];
		}
		if (this.config.origin)
			obj.css('-webkit-transform-origin', this.config.origin.x + '% ' + this.config.origin.y + '%');
		if (this.config.soundname)
			this.config.soundname.play();
		
		this.doAnimate(obj, config);
	},
	
	animation: function (obj, time, att, originx, originy, scax, scay, rotate,transx, transy, transz) {
		AnimationUtils.animation(obj, time, att, originx, originy, scax, scay, rotate,transx, transy, transz);
	},
	
	setOpacity: function(obj, time, att, opac){
		AnimationUtils.setOpacity(obj, time, att, opac);
	},
		
	doAnimate: function(obj, config) {
	}
});	

DefaultAnimationHelper = AbstractAnimationHelper.extend({

	doAnimate : function(obj) {
		var _self = this;
		this.time = this.config.time || 2000;
		this.maxScale = this.config.maxScale || 1.3;
		this.minScale = this.config.maxScale || 0.8;
		obj.css('-webkit-transition', (this.time / 4) + 'ms linear');
		obj.css('-webkit-transform', 'scale3d(' + this.maxScale + ', ' + this.maxScale + ', 1)');
		setTimeout(function() {
			obj.css('-webkit-transform', 'scale3d(' + this.minScale + ', ' + this.minScale + ', 1)');
			setTimeout(function() {
				obj.css('-webkit-transform', 'scale3d(1, 1, 1)');
				setTimeout(function() {
					obj._interacting = false;
				}, _self.time / 4);
			}, _self.time / 2);
		}, this.time / 2);
	}
});

TransparentAnimationHelper = AbstractAnimationHelper.extend({

	doAnimate : function(obj) {
		this.time = this.config.time || 800;
		this.maxScale = this.config.maxScale || 1.5;
		obj.css('-webkit-transition', this.time + 'ms ease-out');
		obj.css('-webkit-transform', 'scale3d(' + this.maxScale + ', ' + this.maxScale + ', 1)');
		obj.css('opacity', '0');
		setTimeout(function() {
			obj.css('-webkit-transition', '1ms linear');
			obj.css('-webkit-transform', 'scale3d(1, 1, 1)');
			obj.css('opacity', '0.85');
			obj._interacting = false;
		}, this.time);
	}
});

BounceAnimationHelper = AbstractAnimationHelper.extend({

	doAnimate : function(obj) {
		var _self = this;
		_self.config.time = _self.config.time || 800;
		_self.config.originx = _self.config.originx || 50;
		_self.config.originy = _self.config.originy || 100;		
		_self.animation(obj, _self.config.time/2, 'ease-out', _self.config.originx, _self.config.originy, 1.1, 0.8, 0, 0, 0, 0);
		setTimeout(function(){
			_self.animation(obj, _self.config.time/4, 'ease-in', _self.config.orriginx, _self.config.originy, 0.9, 1.2, 0, 0, 0, 0);
			setTimeout(function(){
				_self.animation(obj, _self.config.time/4, 'ease-in', _self.config.originx, _self.config.originy, 1, 1, 0, 0, 0, 0);
				setTimeout(function(){
					obj._interacting = false;
				}, _self.config.time/4+10);
			}, _self.config.time/4+10);
		}, _self.config.time/2+10);
	}
});

RollAndFlyAnimationHelper = AbstractAnimationHelper.extend({

	doAnimate : function(obj) {
		var _self = this;
		obj._countRollFly = obj._countRollFly || 0;
		_self.config.time = _self.config.time || 1100;
		_self.config.height = _self.config.height || 300;
		if(obj._countRollFly == 0){
			obj._countRollFly = 1;
			_self.animation(obj, _self.config.time/1.375, 'ease-out',50, 100, 1, 1, 360, 0, -_self.config.height, 0);
			setTimeout(function(){
				_self.animation(obj, _self.config.time/3.667, 'ease-in',50, 100, 1, 1, 360, 0, 0, 0);
				setTimeout(function() {
					obj._interacting = false;
				}, _self.config.time/3.667);
			}, _self.config.time/1.375);
		}
		else if(obj._countRollFly == 1){
			obj._countRollFly = 0;
			_self.animation(obj, _self.config.time/1.375, 'ease-out',50, 100, 1, 1, 0, 0, -_self.config.height, 0);
			setTimeout(function(){
				_self.animation(obj, _self.config.time/3.667, 'ease-in',50, 100, 1, 1, 0, 0, 0, 0);
				setTimeout(function() {
					obj._interacting = false;
				}, _self.config.time/3.667);
			}, _self.config.time/1.375);
		}	
	}
});


FlyAndRollAnimationHelper = AbstractAnimationHelper.extend({

	doAnimate : function(obj) {
		var _self = this;
		obj._countFlyRoll = obj._countFlyRoll || 0;
		_self.config.time = _self.config.time || 1050;
		_self.config.height = _self.config.height || 300;
		if( obj._countFlyRoll == 0){			
			obj._countFlyRoll = 1;
			_self.animation(obj, _self.config.time/3.5, 'ease-in',50, 100, 1, 1, 0, 0, -_self.config.height, 0);
			setTimeout(function(){
				_self.animation(obj, _self.config.time/1.4, 'ease-in',50, 100, 1, 1, 360, 0, 0, 0);
				setTimeout(function() {
					obj._interacting = false;
				}, _self.config.time/1.4+10);
			}, _self.config.time/3.5+10);
		}
		else if(obj._countFlyRoll == 1){
			obj._countFlyRoll = 0;
			_self.animation(obj, _self.config.time/3.5, 'ease-in',50, 100, 1, 1, 360, 0, -_self.config.height, 0);
			setTimeout(function(){
				_self.animation(obj, _self.config.time/1.4, 'ease-in',50, 100, 1, 1, 0, 0, 0, 0);
				setTimeout(function() {
					obj._interacting = false;
				}, _self.config.time/1.4+10);
			}, _self.config.time/3.5+10);
		}			
	}
});

BallFlyRollAnimationHelper = AbstractAnimationHelper.extend({

	doAnimate : function(obj) {
		var _self = this;
		obj._countBallFly = obj._countBallFly || 0;
		_self.config.time = _self.config.time || 1300;
		_self.config.height = _self.config.height || 300;	
		if( obj._countBallFly == 0){
			obj._countBallFly = 1;
			_self.animation(obj, _self.config.time/1.444, 'ease-out',50, 50, 1, 1, 720, 0, -_self.config.height, 0);
			setTimeout(function(){
				_self.animation(obj, _self.config.time/3.25, 'ease-in',50, 50, 1, 1, 720, 0, 0, 0);
				setTimeout(function() {
					obj._interacting = false;
				}, _self.config.time/3.25+10);
			}, _self.config.time/1.444+10);
		}
		else if(obj._countBallFly == 1){
			obj._countBallFly = 0;
			_self.animation(obj, _self.config.time/1.444, 'ease-out',50, 50, 1, 1, 0, 0, -_self.config.height, 0);
			setTimeout(function(){
				_self.animation(obj, _self.config.time/3.25, 'ease-in',50, 50, 1, 1, 0, 0, 0, 0);
				setTimeout(function() {
					obj._interacting = false;
				}, _self.config.time/3.25+10);
			}, _self.config.time/1.444+10);
		}			 
	}
});

FlyAndShakeAnimationHelper = AbstractAnimationHelper.extend({

	doAnimate : function(obj) {
		var _self = this;
		_self.config.time = _self.config.time || 2100;
		_self.config.height = _self.config.height || 300;			
		_self.animation(obj, _self.config.time/5.25, 'ease-out', 50, 50, 1, 1, 0, 0, -_self.config.height, 0);
		setTimeout(function(){
			_self.animation(obj, _self.config.time/7, 'linear', 50, 50, 1, 1, -20, 0, -_self.config.height, 0);
			setTimeout(function(){
				_self.animation(obj, _self.config.time/7, 'linear', 50, 50, 1, 1, 15, 0, -_self.config.height, 0);
				setTimeout(function(){
					_self.animation(obj, _self.config.time/7, 'linear', 50, 50, 1, 1, -10, 0, -_self.config.height, 0);
					setTimeout(function(){
						_self.animation(obj, _self.config.time/7, 'linear', 50, 50, 1, 1, 5, 0, -_self.config.height, 0);
						setTimeout(function(){
							_self.animation(obj, _self.config.time/7, 'linear', 50, 50, 1, 1, 0, 0, -_self.config.height, 0);
							setTimeout(function(){
								_self.animation(obj, _self.config.time/10.5, 'ease-in', 50, 50, 1, 1, 0, 0, 0, 0);
								setTimeout(function() {
									obj._interacting = false;
								}, _self.config.time/10.5+10);
							}, _self.config.time/7+10);
						}, _self.config.time/7+10);
					}, _self.config.time/7+10);
				}, _self.config.time/7+10);
			}, _self.config.time/7+10);
		}, _self.config.time/5.25+10);
	}
});

RollOnlyAnimationHelper = AbstractAnimationHelper.extend({

	doAnimate : function(obj) {
		var _self = this;
		obj._countRoll = obj._countRoll || 0;
		_self.config.time = _self.config.time || 1300;
		_self.config.originx = _self.config.originx || 50;	
		_self.config.originy = _self.config.originy || 0;		
		if( obj._countRoll == 0){
			obj._countRoll = 1;
			_self.animation(obj, _self.config.time, 'ease-out', _self.config.originx, _self.config.originy, 1, 1, 360, 0, 0, 0);			
			setTimeout(function() {
				obj._interacting = false;
			}, _self.config.time+10);
		}
		else if(obj._countRoll == 1){
			obj._countRoll = 0;
			_self.animation(obj, _self.config.time, 'ease-out',_self.config.originx, _self.config.originy, 1, 1, 0, 0, 0, 0);
			setTimeout(function() {
				obj._interacting = false;
			}, _self.config.time+10);			
		}			
	}
});

RealJumpAnimationHelper = AbstractAnimationHelper.extend({

	doAnimate : function(obj) {
		var _self = this;
		_self.config.time = _self.config.time || 1000;
		_self.config.originx = _self.config.originx || 50;	
		_self.config.originy = _self.config.originy || 100;	
		_self.config.height = _self.config.height || 300;	
		_self.animation(obj, _self.config.time/5, 'ease-in', _self.config.originx, _self.config.originy, 1, 0.8, 0, 0, 0, 0);
		setTimeout(function(){
			_self.animation(obj, _self.config.time/1.82, 'ease-out', _self.config.originx, _self.config.originy, 1, 1.2, 0, 0, -_self.config.height, 0);
			setTimeout(function(){
				_self.animation(obj, _self.config.time/4, 'ease-in', _self.config.originx, _self.config.originy, 1, 0.8, 0, 0, 0, 0);
				setTimeout(function(){
					_self.animation(obj, _self.config.time/5, 'ease-in', _self.config.originx, _self.config.originy, 1, 1, 0, 0, 0, 0);
					setTimeout(function() {
						obj._interacting = false;
					}, _self.config.time/5+10);
				}, _self.config.time/4+10);
			},_self.config.time/1.82+10);
		}, _self.config.time/5+10);
	}
});

SimpleJumpAnimationHelper = AbstractAnimationHelper.extend({

	doAnimate : function(obj) {
		var _self = this;
		_self.config.time = _self.config.time || 800;
		_self.config.height = _self.config.height || 300;	
		_self.animation(obj, _self.config.time/1.82, 'ease-out', 50, 50, 1, 1, 0, 0, -_self.config.height, 0);
		setTimeout(function(){
			_self.animation(obj, _self.config.time/5, 'ease-in', 50, 50, 1, 1, 0, 0, 0, 0);	
			setTimeout(function() {
				obj._interacting = false;
			}, _self.config.time/4+10);		
		},_self.config.time/1.82+10);
	}
});

TreeShakeAnimationHelper = AbstractAnimationHelper.extend({

	doAnimate : function(obj) {
		var _self = this;
		_self.config.time = _self.config.time || 2050;
		_self.config.originx = _self.config.originx || 50;	
		_self.config.originy = _self.config.originy || 100;	
		_self.animation(obj, _self.config.time/4.1, 'linear', _self.config.originx, _self.config.originy, 1, 1, -20, 0, 0, 0);
		setTimeout(function(){
			_self.animation(obj, _self.config.time/4.1, 'linear', _self.config.originx, _self.config.originy, 1, 1, 20, 0, 0, 0);
			setTimeout(function(){
				_self.animation(obj, _self.config.time/5.125, 'linear', _self.config.originx, _self.config.originy, 1, 1, -20, 0, 0, 0);
				setTimeout(function(){
					_self.animation(obj, _self.config.time/6.833, 'linear', _self.config.originx, _self.config.originy, 1, 1, 10, 0, 0, 0);
					setTimeout(function(){
						_self.animation(obj, _self.config.time/10.25, 'linear', _self.config.originx, _self.config.originy, 1, 1, -10, 0, 0, 0);
						setTimeout(function(){
							_self.animation(obj, _self.config.time/13.667, 'linear', _self.config.originx, _self.config.originy, 1, 1, 0, 0, 0, 0);
							setTimeout(function() {
								obj._interacting = false;
							}, _self.config.time/13.667+10);		
						}, _self.config.time/10.25);
					}, _self.config.time/6.833);
				}, _self.config.time/5.125);
			}, _self.config.time/4.1);
		}, _self.config.time/4.1);
	}
});

MagicFlyAnimationHelper = AbstractAnimationHelper.extend({

	doAnimate : function(obj) {
		var _self = this;
		_self.config.time = _self.config.time || 7300;
		_self.config.originx = _self.config.originx || 50;	
		_self.config.originy = _self.config.originy || 100;
		_self.config.height = _self.config.height || 400;	
		_self.animation(obj, _self.config.time/3.65, 'ease-out', _self.config.originx, _self.config.originy, 1, 1, 0, 0, -_self.config.height, 0);
		setTimeout(function(){
			_self.animation(obj, _self.config.time/9.125, 'linear', _self.config.originx, _self.config.originy, 1, 1, 20, 20, -_self.config.height+_self.config.height/10, 0);
			setTimeout(function(){
				_self.animation(obj, _self.config.time/6.083, 'linear', _self.config.originx, _self.config.originy, 1, 1, -20, -20, -_self.config.height+_self.config.height/3.3, 0);
				setTimeout(function(){
					_self.animation(obj, _self.config.time/4.867, 'linear', _self.config.originx, _self.config.originy, 1, 1, 20, 20, -_self.config.height+_self.config.height/1.6, 0);
					setTimeout(function(){
						_self.animation(obj, _self.config.time/4.055, 'linear', _self.config.originx, _self.config.originy, 1, 1, 1, 0, -_self.config.height+_self.config.height/1, 0);						
						setTimeout(function() {
							obj._interacting = false;
						}, _self.config.time/4.055+5);		
					}, _self.config.time/4.867);
				}, _self.config.time/6.083);
			}, _self.config.time/9.125);
		}, _self.config.time/3.65);
	}
});

LeafFallingAnimationHelper = AbstractAnimationHelper.extend({

	doAnimate : function(obj) {
		var _self = this;
		obj._leafOffset = obj.offset();
		_self.config.time = _self.config.time || 10810;
		_self.config.height = _self.config.height || 800;	
		_self.config.direct = _self.config.direct || 'left';	
		if(_self.config.direct == 'left'){			
			_self.animation(obj,  _self.config.time/9.01, 'ease-in-out',-40, -150, 1, 1, 30, 0, _self.config.height-_self.config.height/1.1, 0);
			setTimeout(function(){
				_self.animation(obj,  _self.config.time/5.405, 'ease-in-out', -40, -150, 1, 1, -50, 0, _self.config.height-_self.config.height/1.5, 0);
				setTimeout(function(){
					_self.animation(obj,  _self.config.time/4.324, 'ease-in-out', -40, -150, 1, 1, 70, 0, _self.config.height-_self.config.height/2.2, 0);
					setTimeout(function(){
						_self.animation(obj,  _self.config.time/3.857, 'ease-in-out', 140, -150, 1, 1, -80, 0, _self.config.height- _self.config.height/8, 0);
						setTimeout(function(){
							_self.animation(obj,  _self.config.time/5.405, 'ease-in-out', 140, -150, 1, 1, 0, 0, _self.config.height, 0);
							_self.setOpacity(obj,  _self.config.time/5.405, 'linear', 0);
							setTimeout(function(){
								_self.animation(obj, 10, 'ease-out',50, 50, 1, 1, 0, 0, 0, 0);
								setTimeout(function(){
									_self.setOpacity(obj, 300, 'linear', 1);
									setTimeout(function() {
										obj._interacting = false;
									}, 305);		
								},10); 
							},  _self.config.time/5.405+10);
						},  _self.config.time/3.857+10);
					},  _self.config.time/4.324+10);
				},  _self.config.time/5.405+10);
			},  _self.config.time/9.01+10);
		}
		else if(_self.config.direct == 'right'){
			_self.animation(obj,  _self.config.time/9.01, 'ease-in-out', obj._leafOffset.x + 50, obj._leafOffset.y-300, 1, 1, -30, 0, _self.config.height-_self.config.height/1.1, 0);
			setTimeout(function(){
				_self.animation(obj,  _self.config.time/5.405, 'ease-in-out', obj._leafOffset.x + 50, obj._leafOffset.y-300, 1, 1, 45, 0, _self.config.height-_self.config.height/1.2, 0);
				setTimeout(function(){
					_self.animation(obj,  _self.config.time/4.324, 'ease-in-out', obj._leafOffset.x + 50, obj._leafOffset.y-300, 1, 1, -60, 0, _self.config.height-_self.config.height/2, 0);
					setTimeout(function(){
						_self.animation(obj, _self.config.time/3.857, 'ease-in-out', obj._leafOffset.x + 50, obj._leafOffset.y-300, 1, 1, 60, 0, _self.config.height- _self.config.height/8, 0);
						setTimeout(function(){
							_self.animation(obj,  _self.config.time/5.405, 'ease-in-out', obj._leafOffset.x + 50, obj._leafOffset.y-300, 1, 1, 0, 0, _self.config.height, 0);
							_self.setOpacity(obj,  _self.config.time/5.405, 'linear', 0);
							setTimeout(function(){
								_self.animation(obj, 10, 'ease-out',50, 50, 1, 1, 0, 0, 0, 0);
								setTimeout(function(){
									_self.setOpacity(obj, 300, 'linear', 1);
									setTimeout(function() {
										obj._interacting = false;
									}, 305);		
								},10); 
							},  _self.config.time/5.405+10);
						},  _self.config.time/3.857+10);
					},  _self.config.time/4.324+10);
				},  _self.config.time/5.405+10);
			},  _self.config.time/9.01+10);
		}
	}
});

PendulumAnimationHelper = AbstractAnimationHelper.extend({

	doAnimate : function(obj) {
		var _self = this;
		_self.config.time = _self.config.time || 3600;
		_self.config.originx = _self.config.originx || 50;	
		_self.config.originy = _self.config.originy || 0;	
		_self.animation(obj, _self.config.time/6, 'ease-out', _self.config.originx, _self.config.originy, 1, 1, -25, 0, 0, 0);
		setTimeout(function(){
			_self.animation(obj, _self.config.time/6, 'ease-out', _self.config.originx, _self.config.originy, 1, 1, 20, 0, 0, 0);
			setTimeout(function(){
				_self.animation(obj, _self.config.time/6, 'ease-out', _self.config.originx, _self.config.originy, 1, 1, -15, 0, 0, 0);
				setTimeout(function(){
					_self.animation(obj, _self.config.time/6, 'ease-out', _self.config.originx, _self.config.originy, 1, 1, 10, 0, 0, 0);
					setTimeout(function(){
						_self.animation(obj, _self.config.time/6, 'ease-out', _self.config.originx, _self.config.originy, 1, 1, -5, 0, 0, 0);
						setTimeout(function(){
							_self.animation(obj, _self.config.time/6, 'ease-out', _self.config.originx, _self.config.originy, 1, 1, 0, 0, 0, 0);
							setTimeout(function(){
								obj._interacting = false;
							}, _self.config.time/6);
						}, _self.config.time/6+10);
					}, _self.config.time/6+10);
				}, _self.config.time/6+10);
			}, _self.config.time/6+10);
		}, _self.config.time/6+10);
	}
});

AppearOneTimeAnimationHelper = AbstractAnimationHelper.extend({

	doAnimate : function(obj) {
		var _self = this;
		obj._flagAppear = obj._flagAppear || true;
		_self.config.time = _self.config.time || 1000;
		if(obj._flagAppear == true){
			obj._flagAppear = false;
			_self.animation(obj, 1, 'ease-out', 50, 50, 0, 0, 0, 0, 0, 0);		
			setTimeout(function(){
				_self.setOpacity(obj, _self.config.time/1.25, 'ease-out', 1);
				_self.animation(obj, _self.config.time/1.25, 'ease-out', 50, 50, 1.2, 1.2, 0, 0, 0, 0);	
				setTimeout(function(){
					_self.animation(obj, _self.config.time/5, 'ease-in', 50, 50, 1, 1, 0, 0, 0, 0);	
					setTimeout(function() {
						obj._interacting = false;
					}, _self.config.time/5+10);	
				}, _self.config.time/1.25+10);
			}, 2);
		}
		else
			return;		
	}
	
});

FlyThenDisappearAnimationHelper = AbstractAnimationHelper.extend({

	doAnimate : function(obj) {
		var _self = this;
		_self.config.time = _self.config.time || 800;
		_self.config.transx = _self.config.transx || 200;
		_self.config.transy = _self.config.transy || 400;
		_self.animation(obj, _self.config.time, 'ease-in', 50, 50, 0, 0, 0, _self.config.transx, _self.config.transy, 0);
		setTimeout(function() {
				obj._interacting = false;
		}, 10);	

	}
});

FlyThenAppearAgainAnimationHelper = AbstractAnimationHelper.extend({

	doAnimate : function(obj) {
		var _self = this;
		_self.config.time = _self.config.time || 800;
		_self.config.transx = _self.config.transx || 200;
		_self.config.transy = _self.config.transy || 400;
		_self.animation(obj, _self.config.time, 'ease-in', 50, 50, 0, 0, 0, _self.config.transx, _self.config.transy, 0);	
		setTimeout(function(){
			_self.animation(obj, 1, 'ease-in', 50, 50, 0, 0, 0, 0, 0, 0);	
			setTimeout(function(){
				_self.animation(obj, 150, 'ease-in', 50, 50, 1, 1, 0, 0, 0, 0);	
			}, 2);
		}, _self.config.time*1.5);
	}
});

OnOffAnimationHelper = AbstractAnimationHelper.extend({

	doAnimate : function(obj) {
		var _self = this;
		obj._countOnOff = obj._countOnOff || 0;
		if(obj._countOnOff == 0){
			obj._countOnOff = 1;
			_self.setOpacity(obj, 10, 'linear', 1);
		}
		else if (obj._countOnOff = 1){
			obj._countOnOff = 0;
			_self.setOpacity(obj, 10, 'linear', 0);
		}	
	}
});

BallEffectAnimationHelper = AbstractAnimationHelper.extend({

	init : function(config) {
		this._super(config);
	},

	doAnimate : function(obj) {
		this.animateBall(obj, this.config.height || 300, this.config.time || 500, 0);
	},

	animateBall : function(obj, height, time, count) {
		if (count == 6)
			return;
		var scale = 1 - (5 - count) * 0.05;
		obj.css('-webkit-transition', '-webkit-transform ' + time + 'ms ease-out');
		obj.css('-webkit-transform', 'translate3d(0, -' + height + 'px, 0) scale3d(' + scale + ', 1, 1)');

		var _self = this;
		setTimeout(function() {
			obj.css('-webkit-transition', '-webkit-transform ' + time + 'ms ease-in');
			obj.css('-webkit-transform', 'translate3d(0, 0, 0) scale3d(1, ' + scale + ', 1)');

			height = height / 2;
			if (height >= 8) {
				setTimeout(function() {
					_self.animateBall(obj, height, time / 1.2, count + 1);
				}, time);
			} else {
				obj._interacting = false;
			}
		}, time);
	}
});

ScaleUpDownAnimationHelper = AbstractAnimationHelper.extend({
	
	doAnimate: function(obj) {
		var time = this.config.time || 1000;
		obj.css('-webkit-transition', '-webkit-transform '+(time/2)+'ms ease-in');
		obj.css('-webkit-transform', 'scale3d(1.2, 1.2, 1)');
		setTimeout(function() {
			obj.css('-webkit-transform', 'scale3d(1, 1, 1)');
			setTimeout(function() {
				obj._interacting = false;
			}, time/2+10);
		}, time/2+10);
	}
});

HarmoniacScaleAnimationHelper = AbstractAnimationHelper.extend({
	
	doAnimate: function(obj) {
		var time = this.config.time || 1500;
		obj.css('-webkit-transition', '-webkit-transform '+time/3+'ms ease-in');
		obj.css('-webkit-transform', 'scale3d(1, 1.4, 1)');
		setTimeout(function() {
			obj.css('-webkit-transition', '-webkit-transform '+time/3.75+'ms ease-in');
			obj.css('-webkit-transform', 'scale3d(1, 0.7, 1)');
			setTimeout(function() {
				obj.css('-webkit-transition', '-webkit-transform '+time/5+'ms ease-in');
				obj.css('-webkit-transform', 'scale3d(1, 1.2, 1)');
				setTimeout(function() {
					obj.css('-webkit-transition', '-webkit-transform '+time/7+'ms ease-in');
					obj.css('-webkit-transform', 'scale3d(1, 0.9, 1)');
					setTimeout(function() {
						obj.css('-webkit-transition', '-webkit-transform '+time/14+'ms ease-in');
						obj.css('-webkit-transform', 'scale3d(1, 1, 1)');
						setTimeout(function() {
							obj._interacting = false;
						}, time/14+10);
					}, time/7+10);
				}, time/5+10);
			}, time/3.75+10);
		}, time/3+10);
	}
});

HarmoniacScaleAnimationHelper = AbstractAnimationHelper.extend({
	
	doAnimate: function(obj) {
		var time = this.config.time || 1500;
		obj.css('-webkit-transition', '-webkit-transform '+time/3+'ms ease-in');
		obj.css('-webkit-transform', 'scale3d(1, 1.4, 1)');
		setTimeout(function() {
			obj.css('-webkit-transition', '-webkit-transform '+time/3.75+'ms ease-in');
			obj.css('-webkit-transform', 'scale3d(1, 0.7, 1)');
			setTimeout(function() {
				obj.css('-webkit-transition', '-webkit-transform '+time/5+'ms ease-in');
				obj.css('-webkit-transform', 'scale3d(1, 1.2, 1)');
				setTimeout(function() {
					obj.css('-webkit-transition', '-webkit-transform '+time/7+'ms ease-in');
					obj.css('-webkit-transform', 'scale3d(1, 0.9, 1)');
					setTimeout(function() {
						obj.css('-webkit-transition', '-webkit-transform '+time/14+'ms ease-in');
						obj.css('-webkit-transform', 'scale3d(1, 1, 1)');
						setTimeout(function() {
							obj._interacting = false;
						}, time/14+10);
					}, time/7+10);
				}, time/5+10);
			}, time/3.75+10);
		}, time/3+10);
	}
});

TextScaleAnimationHelper = AbstractAnimationHelper.extend({
	
	doAnimate: function(obj) {
		var time = this.config.time || 1200;
		obj.css('-webkit-transition',time/3+'ms linear');
		obj.css('-webkit-transform','scale3d(0.7, 0.7, 1)');
		setTimeout(function() {
	 		obj.css('-webkit-transition', time/3+'ms linear');
			obj.css('-webkit-transform', 'scale3d(1.2, 1.2, 1)');
			setTimeout(function(){
				obj.css('-webkit-transition', time/3+'ms linear');
				obj.css('-webkit-transform', 'scale3d(1, 1, 1)');
				setTimeout(function() {
					obj._interacting = false;
				}, time/3);
			}, time/3);
		}, time/3);
	}
});

TextScaleRevertAnimationHelper = AbstractAnimationHelper.extend({
	
	doAnimate: function(obj) {
		var time = this.config.time || 1500;
		obj.css('-webkit-transition', time/3+'ms linear');
		obj.css('-webkit-transform','scale3d(2.5, 2.5, 1)');
		setTimeout(function(){
			obj.css('-webkit-transform','scale3d(0.7, 0.7, 1)');
				setTimeout(function(){
					obj.css('-webkit-transform','scale3d(1, 1, 1)');
					setTimeout(function(){
						obj._interacting = false;
					}, time/3);
				}, time/3);
		}, time/3);
	}
});

FakeTransitionAnimationHelper = AbstractAnimationHelper.extend({
	
	doAnimate: function(obj) {
		var time = this.config.time || 1000;
		var posX = this.config.posX || 0;
		var posY = this.config.posY || 0;
		
		obj.css('-webkit-transition', (time/2)+'ms ease-in');
		obj.css('-webkit-transform', 'translate3d('+posX+'px, '+posY+'px, 0)');
		setTimeout(function() {
			obj.css('-webkit-transition', '0ms ease-in');
			obj.css('-webkit-transform', 'translate3d('+(-posX)+'px, '+(-posY)+'px, 0)');
			setTimeout(function() {
				obj.css('-webkit-transition', (time/2)+'ms ease-in');
				obj.css('-webkit-transform', 'translate3d(0, 0, 0)');
				setTimeout(function() {
					obj._interacting = false;
				}, time/2+100);
			}, 50);
		}, time/2+100);
	}
});

PureOpacityAnimationHelper = AbstractAnimationHelper.extend({
	
	doAnimate: function(obj) {
		var time = this.config.time || 500;
		
		obj.css('opacity', 0);
		setTimeout(function() {
			obj.css('opacity', 1);
			obj._interacting = false;
		}, parseInt(time)+10);
	}
});

ScaleDisappearAnimationHelper = AbstractAnimationHelper.extend({
	
	doAnimate: function(obj) {
		var time = this.config.time || 400;
		
		obj.css('-webkit-transition', time/8+'ms ease-in');
		obj.css('-webkit-transform', 'scale3d(1.1, 1.1, 1)');
		setTimeout(function() {
			obj.css('-webkit-transition', (time*7/8)+'ms ease-in');
			obj.css('-webkit-transform', 'scale3d(0, 0, 1)');
			setTimeout(function() {
				obj._interacting = false;
			}, time*7/8);
		}, time/8);
	}
});