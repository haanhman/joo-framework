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
			var composition = $(tmpl(this.className+"View", model));
			_self.processElement(this, this, composition[0], model);
		};
		
		obj.prototype.bindModelView = obj.prototype.bindModelView || function(ui, model, path, boundProperty) {
			var method = ExpressionUtils.getMutatorMethod(ui, boundProperty);
			method.call(ui, ExpressionUtils.express(model, path), {path: path, bindingPath: path});
			
			//constraint model to view
			model.addEventListener('change', function(e) {
				if (this._currentTarget == ui)
					return;
				if (path.indexOf(e.path) != -1 || e.path.indexOf(path) != -1) {
					var _currentTarget = ui._currentTarget;
					ui._currentTarget = this;
					if (e.type == 'setter') {
						var method = ExpressionUtils.getMutatorMethod(ui, boundProperty);
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
			});
			
			//constraint view to model
			ui.addEventListener('change', function(e) {
				if (this._currentTarget == model)
					return;
				var _currentTarget = model._currentTarget;
				model._currentTarget = this;
				var method = ExpressionUtils.getAccessorMethod(ui, boundProperty);
				var val = method.call(ui);
				ExpressionUtils.expressSetter(model, path, val);
				model._currentTarget = _currentTarget;
			});
		};
	},
	
	processElement: function(root, obj, composition, model) {
		var $composition = $(composition);
		var tagName = composition.tagName.toLowerCase();
		var children = $composition.children();
		var currentObject = obj;
		var config = JOOUtils.getAttributes(composition);
		
		var handlers = {};
		var bindings = [];
		
		var isAddTab = false;
		var isAddItem = false;
		var tabTitle = undefined;
		
		for(var i in config) {
			if (i.indexOf('handler:') != -1) {
				var event = i.substr(8);
				var fn = config[i];
				handlers[event] = new Function(fn);
				delete config[i];
			} else if (config[i].indexOf('#{') == 0) {
				var expression = config[i].substr(2, config[i].length-3);
				config[i] = ExpressionUtils.express(model, expression);
				bindings.push({
					expression: expression,
					boundProperty: i
				});
			} else if (config[i].indexOf('${') == 0) {
				var expression = config[i].substr(2, config[i].length-3);
				config[i] = ExpressionUtils.express(root, expression);
//				bindings = expression;
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
			break;
		case "joo:addtab":
			isAddTab = true;
			tabTitle = config.title;
			break;
		case "joo:additem":
			isAddItem = true;
			break;
		default:
			if (config.custom) {
				config.custom = eval('('+config.custom+')');
			}
			var className = ClassMapping[tagName.split(':')[1]];
			if (className) {
				currentObject = new window[className](config);
			} else {
				throw "Undefined UI Tag: "+tagName;
			}
		}
		
		for(var i in handlers) {
			(function(i) {
				currentObject.addEventListener(i, function(event) {
					try {
						handlers[i].apply(root, arguments);
					} catch (err) {
						log(err);
					}
				});
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