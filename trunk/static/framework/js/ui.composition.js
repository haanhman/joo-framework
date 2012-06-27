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
		obj.prototype.renderUIComposition = obj.prototype.renderUIComposition || function(model) {
			model =  model || this.config.model || {};
			var composition = $(tmpl(this.className+"View", model))[0];
			_self.processElement(this, this, composition, model);
		};
	},
	
	processElement: function(root, obj, composition, model) {
		var $composition = $(composition);
		var tagName = composition.tagName.toLowerCase();
		var children = $composition.children();
		var currentObject = obj;
		var config = JOOUtils.getAttributes(composition);
		
		var handlers = {};
		var bindings = undefined; 
		
		for(var i in config) {
			if (i.indexOf('handler:') != -1) {
				var event = i.substr(8);
				var fn = config[i];
				handlers[event] = new Function(fn);
				delete config[i];
			} else if (config[i].indexOf('#{') == 0) {
				var expression = config[i].substr(2, config[i].length-3);
				config[i] = ExpressionUtils.express(model, expression);
				bindings = expression;
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
		default:
			if (config.custom) {
				config.custom = eval('('+config.custom+')');
			}
			var className = ClassMapping[tagName.split(':')[1]];
			currentObject = new window[className](config);
		}
		
		for(var i in handlers) {
			(function(i) {
				currentObject.addEventListener(i, function() {
					handlers[i].apply(root, arguments);
				})
			})(i);
		}
		
		if (bindings) {
			currentObject.dataBindings = bindings;
			currentObject.addEventListener('change', function() {
				root.dispatchEvent('bindingchanged', currentObject);
			});
		}
		
		var varName = $composition.attr('varName');
		if (varName) {
			root[varName] = currentObject;
		}
		
		for(var i=0; i<children.length; i++) {
			var child = this.processElement(root, currentObject, children[i], model);
			currentObject.addChild(child);
		}
		return currentObject;
	}
});