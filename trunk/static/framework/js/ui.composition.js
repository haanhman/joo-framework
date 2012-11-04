/**
 * @class An interface enabling UI Components to be rendered
 * using composition
 * @interface
 */
CompositionRenderInterface = InterfaceImplementor.extend({
	
	implement: function(obj) {
		var _self = this;
		
		/**
		 * Render the UI Component.
		 * @methodOf CompositionRenderInterface#
		 * @name renderUIComposition
		 */
		obj.prototype.renderUIComposition = obj.prototype.renderUIComposition || function() {
			var model = this.config.model || {};
			var composition = $(JOOUtils.tmpl(this.className+"View", model));
			_self.processElement(this, this, composition[0], model);
		};
		
		obj.prototype.bindModelView = obj.prototype.bindModelView || function(ui, model, path, boundProperty) {
			var method = ExpressionUtils.getMutatorMethod(ui, boundProperty);
			if (!method) {
				throw new Error("No setter defined for property "+boundProperty+" of class "+ui.className);
			}
			method.call(ui, ExpressionUtils.express(model, path), {path: path, bindingPath: path});
			
			var mfn = function(e) {
				if (this._currentTarget == ui && ui.dead)
					return;
				if (path.indexOf(e.path) != -1 || e.path.indexOf(path) != -1) {
					var _currentTarget = ui._currentTarget;
					ui._currentTarget = this;
					if (e.type == 'setter') {
						var method = ExpressionUtils.getMutatorMethod(ui, boundProperty);
						if (!method) {
							throw new Error("No setter defined for property "+boundProperty+" of class "+ui.className);
						}
						method.call(ui, ExpressionUtils.express(model, path), {path: e.path, bindingPath: path});
					} else {
						var fn = 'partialModelChange' + boundProperty[0].toUpperCase()+boundProperty.substr(1);
						if (typeof ui[fn] == 'function') {
							ui[fn].call(ui, model, e);
						}
						if (typeof ui['partialModelChange'] == 'function') {
							ui.partialModelChange(model, e, boundProperty);
						}
					}
					ui._currentTarget = _currentTarget;
				}
			};
			ui.addEventListener('dispose', function() {
				model.removeEventListener('change', mfn);
			});
			
			//constraint model to view
			model.addEventListener('change', mfn);
			
			//constraint view to model
			ui.addEventListener('change', function(e) {
				if (this._currentTarget == model)
					return;
				var _currentTarget = model._currentTarget;
				model._currentTarget = this;
				var method = ExpressionUtils.getAccessorMethod(ui, boundProperty);
				if (!method) {
					throw new Error("No getter defined for property "+boundProperty+" of class "+ui.className);
				}
				var val = method.call(ui);
				ExpressionUtils.expressSetter(model, path, val);
				model._currentTarget = _currentTarget;
			});
		};
	},
	
	processElement: function(root, obj, composition, model) {
		var $composition = $(composition);
		var currentObject = undefined;
		var children = Array();
		var config = {};
		var tagName = undefined;
		if (composition.nodeType == 3) {	//text node
			currentObject = new DisplayObject({domObject: $composition});
			tagName = "text";
		} else {
			tagName = composition.tagName.toLowerCase();
			children = $composition.contents();
			currentObject = obj;
			config = JOOUtils.getAttributes(composition);
		}
		
		var handlers = {};
		var bindings = [];
		
		var isAddTab = false;
		var isAddItem = false;
		var tabTitle = undefined;
		
		var ns = 'joo.ui.composition';
		if (config['config-id']) {
			var dataStore = SingletonFactory.getInstance(DataStore);
			if (!dataStore.getStore(ns)) {
				dataStore.registerStore(ns, 'Dom', {
					id: 'UICompositionConfig'
				});
			}
			var cfg = dataStore.fetch(ns, config['config-id']) || {};
			for(var i in config) {
				cfg[i] = config[i];
			}
			config = cfg;
		}
		
		for(var i in config) {
			if (i.indexOf('handler:') != -1) {
				var event = i.substr(8);
				var fn = config[i];
				handlers[event] = new Function(fn);
				delete config[i];
			} else if (typeof config[i] == 'string' && config[i].indexOf('#{') == 0) {
				var expression = config[i].substr(2, config[i].length-3);
				config[i] = ExpressionUtils.express(model, expression);
				bindings.push({
					expression: expression,
					boundProperty: i
				});
			} else if (typeof config[i] == 'string' && config[i].indexOf('${') == 0) {
				var expression = config[i].substr(2, config[i].length-3);
				config[i] = ExpressionUtils.express(root, expression);
//				bindings = expression;
			} else if (i == 'command' && typeof config[i] == 'string') {
				var fn = new Function(config[i]);
				config[i] = function() {
					fn.apply(root, arguments);
				};
			}
		}
		
		switch(tagName) {
		case "joo:composition":
			for(var i in config) {
				var mutator = ExpressionUtils.getMutatorMethod(currentObject, i);
				mutator.call(currentObject, config[i]);
			}
			break;
		case "joo:var":
			var varName = $composition.attr('name');
			currentObject = obj[varName];
			for(var i in config) {
				var mutator = ExpressionUtils.getMutatorMethod(currentObject, i);
				if (mutator)
					mutator.call(currentObject, config[i]);
			}
			break;
		case "joo:addtab":
			isAddTab = true;
			tabTitle = config.title;
			break;
		case "joo:additem":
			isAddItem = true;
			break;
		default:
			if (tagName.indexOf("joo:") == 0) {
				if (config.custom && typeof config.custom != 'object') {
					config.custom = eval('('+config.custom+')');
				}
				var className = ClassMapping[tagName.split(':')[1]];
				if (className) {
					currentObject = new window[className](config);
				} else {
					throw "Undefined UI Tag: "+tagName;
				}
			} else {
				if (tagName != "text") {
					currentObject = new CustomDisplayObject({html: $composition});
				}
			}
		}
		
		for(var i in handlers) {
			(function(i) {
				if (i.indexOf('touch') != -1) {	//in some platforms such as iOS, binding touch events won't take effect
													//if elements not existed in DOM
					currentObject.addEventListener('stageUpdated', function() {
						currentObject.addEventListener(i, function(event) {
							try {
								handlers[i].apply(root, arguments);
							} catch (err) {
								log(err);
							}
						});
					});
				} else {
					currentObject.addEventListener(i, function(event) {
						try {
							handlers[i].apply(root, arguments);
						} catch (err) {
							log(err);
						}
					});
				}
			})(i);
		}
		
		for (var i=0, l=bindings.length; i<l; i++) {
			/*
			currentObject.dataBindings = bindings;
			currentObject.addEventListener('change', function() {
				root.dispatchEvent('bindingchanged', currentObject);
			});
			*/
			root.bindModelView(currentObject, model, bindings[i].expression, bindings[i].boundProperty);
		}
		
		var varName = $composition.attr('varName');
		if (varName) {
			root[varName] = currentObject;
		}
		
		for(var i=0; i<children.length; i++) {
			var child = this.processElement(root, currentObject, children[i], model);
			if (isAddTab) {
				currentObject.addTab(tabTitle, child);
			} else if (isAddItem) {
				currentObject.addItem(child);
			}
			else {
				if (currentObject != child)
					currentObject.addChild(child);
			}
		}
		return currentObject;
	}
});