AnimationCapabilityPlugin = Class.extend({
	
	onBegin: function() {
		var origin = this.origin = DisplayObject.prototype.setupDomObject;
		DisplayObject.prototype.setupDomObject = function(config) {
			origin.apply(this, arguments);
			if (config['animation-name'] || config['animation-sound']) {
				if (config['animation-options']) {
					if (typeof config['animation-options'] == 'string') {
						config['animation-options'] = JSON.parse(config['animation-options'].replace(/'/g, "\""));
					}
				}
				this.addEventListener('stageUpdated', function() {
					this.addEventListener('touchstart', function() {
						this.runDefaultAnimation();
					})
				});
			}
		}
		
		DisplayObject.prototype.runDefaultAnimation = function() {
			var config = this.config;
			if (config['animation-name']) {
				this.animationHelper = this.animationHelper || AnimationHelperFactory.createHelper(config['animation-name']);
				if (config['animation-sound']) {
					config['animation-options'] = config['animation-options'] || {};
					config['animation-options'].soundname = new Audio();
					config['animation-options'].soundname.src = config['animation-sound'];
				}
				this.animationHelper.animate(this.access(), config['animation-options']);
			} else {
				var audio = new Audio();
				audio.src = config["animation-sound"];
				audio.play();
			}
		}
	},
	
	onEnd: function() {
		DisplayObject.prototype.setupDomObject = this.origin;
	}
}).implement(PluginInterface);
