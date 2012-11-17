ServiceCapabilityPlugin = Class.extend({
	
	onBegin: function() {
		var plugin = this;
		var origin = this.origin = DisplayObject.prototype.setupDomObject;
		DisplayObject.prototype.setupDomObject = function(config) {
			origin.apply(this, arguments);
			
			var endpoint = config['service-endpoint'];
			var serviceClass = config['service-class']
			if (endpoint || serviceClass) {
				var srv = undefined;
				if (!serviceClass) {
					srv = new JOOService();
				} else {
					srv = new window[serviceClass];
				}
				if (endpoint) {
					srv.endpoint = endpoint;
				}
				var _self = this;
				srv.addEventListener('success', function(ret) {
					_self.dispatchEvent('servicesuccess', ret);
				});
				srv.addEventListener('failure', function(msg) {
					_self.dispatchEvent('servicefailure', msg);
				});
				this.addEventListener('serviceparamregister', function(e) {
					this.paramsObj = this.paramsObj || {};
					this.paramsObj[e.param] = e.obj;
				});
				this.addEventListener('servicestart', function() {
					var params = {};
					for(var i in this.paramsObj) {
						params[i] = this.paramsObj[i].getValue();
					}
					srv.run(params);
				});
			} else if (config['service-submit']) {
				this.addEventListener('touchend', function() {
					this.dispatchEvent('servicestart');
				});
			}
			
			this.addEventListener('stageUpdated', function() {
				if (config['service-param'] || config.name) {
					this.dispatchEvent('serviceparamregister', {
						obj: this,
						param: config['service-param'] || config.name
					});
				}
			});
		}
	},
	
	onEnd: function() {
		DisplayObject.prototype.setupDomObject = this.origin;
	}
}).implement(PluginInterface);
