/*JOOMovieClip = JOOSprite.extend({
	
	setupBase: function(config) {
		this._appendBaseClass('JOOMovieClip');
		this.skippedAnimation = ['position'];
		this._super(config);
	},
	
	setupDomObject: function(config) {
		this._super(config);
		this.generateData(config.data);
	},
	
	generateData: function(data) {
		this.data = data;
		this.objects = {};
		var objects = data.objects;
		for(var i in objects) {
			var obj = undefined;
			if (objects[i].obj != undefined)
				obj = objects[i].obj;
			else if (typeof objects[i].className == 'string')
				obj = new window[objects[i].className](objects[i].config);
			else
				obj = new objects[i].className(objects[i].config);
			for(var j in objects[i].attributes) {
				obj.setAttribute(j, objects[i].attributes[j]);
			}
			this.objects[objects[i].id] = obj;
			this.addChild(obj);
		}
		this.animation = data.animations;
		this.horizontalFramesNo = data.frames;
		this.verticalFramesNo = 1;
	},
	
	onReplay: function() {
		for(var i in this.objects) {
			this.removeChild(this.objects[i]);
		}
		this.generateData(this.data);
	},
	
	replay: function() {
		this.onReplay();
		this.played = false;
		this.play();
	},
	
	play: function() {
		this.oldFrame = 0;
		this.currentFrameIndex = 0;
		
		//let browser have sometime to initiate animation
		if (this.played) {
			this._super();
			return;
		}
		var _self = this;
		setTimeout(function() {
			_self.played = true;
			_self.play();
		}, 10);
	},
	
	onFrame: function(frame) {
		if (this.currentFrameIndex != 0 && frame == this.startFrame) {
			this.oldFrame = 0;
			this.currentFrameIndex = 0;
			this.onReplay();
		}
		if (this.currentFrameIndex < this.animation.length && frame == this.oldFrame) {
			console.log('hehe');
			//calculate the time needed to complete the current animation set
			var framesDiff = this.animation[this.currentFrameIndex].keyFrame - this.oldFrame;
			this.oldFrame = this.animation[this.currentFrameIndex].keyFrame;
			if (this.oldFrame == 0)
				this.oldFrame = 1;
			var timeDiff = parseFloat(framesDiff / this.framerate);
			for(var i in this.objects) {
				this.objects[i].access().stop(true, true);
				this.objects[i].animations = Array();
				this.objects[i].effects = Array();
			}
			//parse the current animation
			//TODO: Implement a way to allow moving this code segment to the constructor
			var animations = this.animation[this.currentFrameIndex].animations;
			for(var i=0; i<animations.length; i++) {
				if (animations[i].actions) {
					var actions = animations[i].actions.split(';');
					for(var j=0; j<actions.length; j++) {
						var actionArr = actions[j].split(':');
						if (actionArr.length == 2) {
							var key = actionArr[0].trim();
							var value = actionArr[1].trim();
							if (key.length > 0 && this.skippedAnimation.indexOf(key) == -1)
								this.objects[animations[i].object].animations[key] = value;
						}
					}
				}
				
				if (animations[i].effects) {
					var effects = animations[i].effects;
					for(var j=0; j<effects.length; j++) {
						var key = effects[j].name;
						var value = effects[j].option;
						if (key && key.length > 0) {
							this.objects[animations[i].object].effects[key] = value;
						}
					}
				}
				
				//calling scripts if any
				if (animations[i].script) {
					animations[i].script.call(this, frame);
				}
			}
			//run the animation
			for(var i in this.objects) {
				var animations = this.objects[i].animations;
				var keys = Array();
				for(var key in animations) {
					keys.push(key);
				}
				if (keys.length > 0) {
					if (timeDiff > 0) {
						
						this.objects[i].setCSS3Style('transition-duration', timeDiff+'s');
						this.objects[i].setCSS3Style('transition-property', keys.join(','));
					}
					for(var key in animations) {
						this.objects[i].setStyle(key, animations[key]);
					}
				} else {
					this.objects[i].setCSS3Style('transition-duration', '');
				}

				var effects = this.objects[i].effects;
				for(var j in effects) {
					if (typeof this.objects[i]['runEffect'] == 'undefined') {
						Wrapper.wrap(this.objects[i], EffectableInterface);
					}
					for(var name in effects) {
						this.objects[i].runEffect(name, effects[name], timeDiff * 1000);
					}
					break;
				}
			}
			this.currentFrameIndex++;
		}
	}
});*/

JOOAnimationData = Class.extend({
	
	init: function(config) {
		this.object = config.object;
		this.start = config.start;
		this.end = config.end;
		this.duration = config.duration;
		this.delay = config.delay;
	}
});

/**
 * @class A movie clip is a sprite with custom animation, it also supports script.
 * <p>It supports additional configuration parameters</p>
 * <ul>
 * 	<li><code>data</code> The animation data</li>
 * </ul>
 * @augments JOOSprite
 */
JOOMovieClip = JOOSprite.extend({
	
	setupBase: function(config) {
		this.skippedAnimation = ['position'];
		this.scripts = {};
		this.intervals = Array();
		this._super(config);
	},
	
	setupDomObject: function(config) {
		this._super(config);
		this.generateData(config.data);
	},
	
	generateData: function(data) {
		this.animationsMeta = Array();
		this.data = data;
		this.objectDefs = {};
		this.objects = {};
		var objects = data.objects;
		for(var i in objects) {
			this.objectDefs[objects[i].name] = objects[i];
		}
		this.buildStage();
		this.buildAnimations();
		this.buildScript();
	},
	
	buildScript: function(){
		if(this.data.scripts){
			for(var i in this.data.scripts){
				this.scripts[i] = new Function(this.data.scripts[i]);
			}
		}
	},
	
	buildStage: function() {
		var stageDef = this.data.stage;
		this.animStage = new window[stageDef.className](stageDef.config);
		var children = stageDef.children;
		for(var i in children) {
			var obj = this.buildChildren(children[i]);
			this.animStage.addChild(obj);
		}
		this.addChild(this.animStage);
	},
	
	buildChildren: function(child) {
		var objDef = this.objectDefs[child.ref];
		if (objDef == undefined) throw child.ref+" is not undefined";
		var obj = undefined;
		obj = new window[objDef.className](objDef.config);
		// build attribute
		for(var i in objDef.attributes){
			obj.setAttribute(i,objDef.attributes[i]);
		}
		obj.setStyle("display","none");
		if(!obj.getStyle("position")){ obj.setStyle("position","absolute"); }
		if (objDef.type == "composition") {
			//obj.setLayout('absolute');
			for (var i in objDef.children) {
				var _child = this.buildChildren(objDef.children[i]);
				obj.addChild(_child);
			}
		}
		if (child.id) {
			this.objects[child.id] = obj;
		}
		if( obj.play ){
			obj.play();
		}
		this[objDef.varName] = obj;
		return obj;
	},
	
	buildAnimations: function() {
		//this.animations = this.data.animations;
		this.actions = {};
		for(var i in this.data.actions) {
			this.actions[this.data.actions[i].name] = this.data.actions[i];
		}
		this.animations = {};
		for(var i in this.data.animations) {
			var delay = this.data.animations[i].delay;
			this.animations[delay] = this.animations[delay] || new Array();
			this.animations[delay].push(this.data.animations[i]);
		}
		this.horizontalFramesNo = this.data.frames;
		this.verticalFramesNo = 1;
	},
	
	_stripOldAnimationsMeta: function() {
		var frame = this.currentFrame;
		for(var i=this.animationsMeta.length-1; i>=0; i--) {
			if (frame - this.animationsMeta[i].delay >= this.animationsMeta[i].duration) {
				this.animationsMeta.splice(i, 1);
			}
		}
	},
	
//	pause: function() {
//		this._stripOldAnimationsMeta();
//		for (var i in this.animationsMeta) {
//			var meta = this.animationsMeta[i];
//			meta.object.setCSS3Style('transition-duration', '');
//			var styles = meta.object.getAttribute('style').split(';');
//			for(var j in styles) {
//				var kv = styles[j].split(':');
//				if (kv && kv.length == 2) {
//					console.log();
//					if (kv[0].indexOf('transition') == -1) {
//						meta.object.setStyle(kv[0], meta.object.getStyle(kv[0]));
//					}
//				}
//			}
//		}
//		this._super();
//	},
	
	play: function() {
//		if (this.played) {
//			this._super();
//			return;
//		}
//		var _self = this;
//		setTimeout(function() {
//			_self.played = true;
//			_self.play();
//		}, 10);
		this.played = true;
		this._super();
	},
	
	onFrame: function(frame) {
		var animations = this.animations[frame];
		if (animations) {
			for(var i in animations) {
				if (animations[i].script_ref)
					this.callScript(animations[i]);
				else
					this.playAnimation(animations[i], 0);
			}
		}
		//for(var i in this.animations) {
			//var animation = this.animations[i];
			//this.playAnimation(animation, 0);
		//}
	},
	
	callScript: function(animation) {
		//var fn = window[animation.script_ref];
		var fn = this.scripts[animation.script_ref];
		if(!fn){
			fn = window[animation.script_ref];
		}
		if (fn) {
			var args = animation.script_args;
			if (args == undefined || args == "")
				args = "[]";
			try {
				fn.apply(this, JSON.parse(args));
			} catch (e) {
				log(e);
			}
		}
	},
	
	playAnimation: function(animation, time) {
		if (time >= animation.loop && animation.loop != -1) return;
		var objRef = animation.object_ref.split('#');
		var obj = this.objects[objRef[0]];
		for(var i=1; i<objRef.length; i++) {
			obj = obj.children[objRef[i]];
		}
		var actions = this.actions[animation.action_ref];
		var _self = this;
		obj.setCSS3Style('transition-timing-function', 'linear');
		this.animationsMeta.push(new JOOAnimationData({
			object: obj,
			delay: animation.delay,
			start: actions.start, 
			end: actions.end, 
			duration: actions.duration
		}));
		_self.doPlayAnimation([obj, actions, time, animation]);
		
		//setTimeout(function(args) {
			//_self.doPlayAnimation(args);
			// var i = setInterval(function(args) {
			// 	_self.doPlayAnimation(args);
			// }, args[1].interval, args);
			// _self.intervals.push(i);
		//}, animation.delay, [obj, actions, time, animation]);
	},
	
	doPlayAnimation: function(args) {
		var _obj = args[0];
		var _actions = args[1];
		_obj.setCSS3Style('transition-property', '');
		_obj.setCSS3Style('transition-duration', '');
		var keys = this.setStyles(_obj, _actions.start);
		_obj.getStyle('-webkit-transform');
		
		var duration = _actions.duration / this.framerate * 1000;
		_obj.setCSS3Style('transition-duration', duration+'ms');
		_obj.setCSS3Style('transition-property', keys.join(','));
		//console.log(_obj.className,JSON.stringify(_obj.getStyle('-webkit-transition-duration')));
		
		this.setStyles(_obj, _actions.end);
	},
	
	setStyles: function(obj, actions) {
		var styles = actions.split(';');
		var keys = Array();
		for(var i in styles) {
			var kv = styles[i].split(':');
			if (kv.length < 2) continue;
			var k = kv[0].trim();
			var v = kv[1].trim();
			keys.push(k);
			obj.setStyle(k, v);
		}
		return keys;
	},
	
	dispose: function() {
		for(var i in this.intervals){
			clearInterval(this.intervals[i]);
		}
		this._super();
	}
});

JOOSpriteAnimation = UIComponent.extend({
	
	setupBase: function(config) {
		this._super(config);
		this.sprite = new JOOSprite(config);
	},
	
	setupDomObject: function(config) {
		this._super(config);
		this.addChild(this.sprite);
		var _self = this;
		setTimeout(function(){
			_self.sprite.play(config.startFrame,config.endFrame);
		},300);
	},
	
	toHtml: function() {
		return "<div></div>";
	}
});