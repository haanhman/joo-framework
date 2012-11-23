StateCapabilityPlugin = Class.extend({
	
	onBegin: function() {
		var plugin = this;
		var origin = this.origin = DisplayObject.prototype.setupDomObject;
		DisplayObject.prototype.setupDomObject = function(config) {
			origin.apply(this, arguments);
			if (config['state-control']) {
				if (config['state-data']) {
					if (typeof config['state-data'] == 'string') {
						config['state-data'] = JSON.parse(config['state-data'].replace(/'/g, "\""));
					}
				}
				this.addEventListener('stageUpdated', function() {
					this.addEventListener('touchend', function(e) {
						if (config['state-delay']) {
							var _self = this;
							setTimeout(function() {
								plugin.handleState(_self, config);
							}, config['state-delay']);
						} else {
							plugin.handleState(this, config);
						}
					})				});
			}
		}
	},
	
	handleState: function(_self, config) {
		if (config['state-control'] == 'state:back') {
			_self.dispatchEvent('stateBack');
		} else if (config['state-control'] == 'state:forward') {
			_self.dispatchEvent('stateForward');
		} else {
			_self.dispatchEvent('stateChanged', {
				name: config['state-control'],
				eventData: config['state-data']
			});
		}
	},
	
	onEnd: function() {
		DisplayObject.prototype.setupDomObject = this.origin;
	}
}).implement(PluginInterface);
