DataSourceCapabilityPlugin = Class.extend({
	
	onBegin: function() {
		var plugin = this;
		var origin = this.origin = DisplayObject.prototype.setupDomObject;
		DisplayObject.prototype.setupDomObject = function(config) {
			origin.apply(this, arguments);
			
			var endpoint = config['datasource'];
			var serviceClass = config['datasource-class'];
			var dsObj = config['datasource-object'];
			var eventName = config['datasource-event'] || "stageUpdated";
			
			if (endpoint || serviceClass || dsObj) {
				if (config['datasource-params'] && typeof config['datasource-params'] == 'string')
					config['datasource-params'] = JSON.parse(config['datasource-params'].replace(/'/g, "\""));
					
				this.addEventListener('dispose', function() {
					this.__datasourceModel__ = undefined;
				});
					
				this.addEventListener('resetdatasource', function() {
					this.__datasourceModel__ = [];
					this.removeAllChildren();
				});
				
				this.addEventListener('filter', function(e) {
					var filter = e.text ? e.text.toLowerCase() : "";
					var fields = config['datasource-filter'];
					var model = this.__datasourceModel__;
					if (fields && model) {
						fields = fields.split(',');
						for(var i=0; i<model.length; i++) {
							var match = false;
							for(var j=0; j<fields.length; j++) {
								var f = model[i][fields[j]].toLowerCase();
								if (f && typeof f == 'string' && f.indexOf(filter) != -1) {
									model[i].__uiObject__ ? model[i].__uiObject__.access().show() : undefined;
									match = true;
									break;
								}
							}
							if (!match) {
								model[i].__uiObject__ ? model[i].__uiObject__.access().hide() : undefined;
							}
						}
					}
				});
				this.addEventListener(eventName, function() {
					var endpoint = config['datasource'];
					var serviceClass = config['datasource-class'];
					var dsObj = config['datasource-object'];
					var dataInput = config['datasource-input'] || "config";
					
					var srv = undefined;
					if (endpoint || serviceClass) {
						if (!serviceClass) {
							srv = new JOOService();
						} else {
							if (window[serviceClass])
								srv = new window[serviceClass];
							else
								throw new Error("Service "+serviceClass+" is not defined");
						}
						if (endpoint) {
							srv.endpoint = endpoint;
						}
					} else {
						if (window[dsObj]) {
							dsObj = new window[dsObj];
				} else {
							throw new Error("Datasource object "+dsObj+" is not defined");
						}
					}
					var _self = this;
					var fn = function(ret) {
						var item = config['datasource-item'] || "DataSourceDefaultItem";
						var itemEmpty = config['datasource-item-empty'];
						if (!ret.length) {
							if (itemEmpty) {
								if (typeof itemEmpty == 'object')
									_self.addChild(itemEmpty);
								else
									_self.addChild(new window[itemEmpty]);
							}
						} else {
							for(var i=0; i<ret.length; i++) {
								var data = ret[i];
								if (typeof data != 'object') {
									data = {data: data};
								}
								var item;
								if (dataInput == "model") {
									item = new window[item]({
										model: data
									});
								} else {
									item = new window[item](data);
								}
								data.__uiObject__ = item;
								_self.addChild(item);
							}
						}
					}
					var params = config['datasource-params'];
					if (srv) {
						if (_self.__datasourceService__ && params &&
								_self.__datasourceService__.params == JSON.stringify(params)) {
							_self.__datasourceService__.cancel();
						}
						srv.params = JSON.stringify(params);
						_self.__datasourceService__ = srv;
						srv.addEventListener('success', function(ret) {
							if (_self.__datasourceModel__) {
								_self.__datasourceModel__ = _self.__datasourceModel__.concat(ret);
							} else {
								_self.__datasourceModel__ = ret;
							}
							_self.dispatchEvent('datasourcesuccess', ret);
							fn.call(_self, ret);
							_self.dispatchEvent('datasourcerendered');
						});
						
						srv.addEventListener('failure', function(e) {
							_self.dispatchEvent('datasourcefailure', e);
						});
					}
					
					if (srv) {
						srv.run(params);
					} else {
						var data = dsObj.getData();
						if (this.__datasourceModel__) {
							this.__datasourceModel__ = this.__datasourceModel__.concat(data);
						} else {
							this.__datasourceModel__ = data;
						}
						this.dispatchEvent('datasourcesuccess', data);
						fn.call(_self, data);
						this.dispatchEvent('datasourcerendered');
					}
				});
			}
		}
	},
	
	onEnd: function() {
		DisplayObject.prototype.setupDomObject = this.origin;
	}
}).implement(PluginInterface);