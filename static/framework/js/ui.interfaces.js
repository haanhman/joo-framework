/**
 * @class An interface which allows UI Component to be selectable.
 * @interface
 */
SelectableInterface = InterfaceImplementor.extend({
	
	implement: function(obj) {
		
		/**
		 * A protected method, define the behavior of the selection.
		 * By default, it does nothing. Subclass can override it to
		 * change the behavior.
		 */
		obj.prototype._select = obj.prototype._select || function() {};
		
		/**
		 * A protected method, define the behavior of the de-selection.
		 * By default, it does nothing. Subclass can override it to
		 * change the behavior.
		 */
		obj.prototype._deselect = obj.prototype._deselect || function() {};
		
		/**
		 * Select the component. Add the component to the stage's list of selection.
		 * @methodOf SelectableInterface#
		 * @name select
		 * @param {Boolean} isMultiSelect whether this is a multi-selection
		 */
		obj.prototype.select = obj.prototype.select || function(isMultiSelect) {
			this.dispatchEvent('beforeSelected');
			if (this.blockSelect != true) {
				this.stage.addSelectedObject(this, isMultiSelect);
				this.dispatchEvent('afterSelected');
			}
		},
		
		/**
		 * Deselect the component. Remove the component from the stage's list of selection.
		 * @methodOf SelectableInterface#
		 * @name deselect
		 * @param {Boolean} isMultiSelect whether this is a multi-selection
		 */
		obj.prototype.deselect = obj.prototype.deselect || function() {
			this.stage.removeSelectedObject(this);
		},
		
		/**
		 * This method is called internally by the Stage, before the 
		 * component is actually selected.
		 * @methodOf SelectableInterface#
		 * @name stageSelect
		 */
		obj.prototype.stageSelect = obj.prototype.stageSelect || function() {
			this.access().addClass('selected');
			this._select();
			this.dispatchEvent('selected');
		},
		
		/**
		 * This method is called internally by the Stage, before the 
		 * component is actually deselected.
		 * @methodOf SelectableInterface#
		 * @name stageDeselect
		 */
		obj.prototype.stageDeselect = obj.prototype.stageDeselect || function() {
			this.access().removeClass('selected');
			this._deselect();
			this.dispatchEvent('deselected');
		};
	}
});

/**
 * @class An interface which allows UI Component to be draggable.
 * @interface
 */
DraggableInterface = InterfaceImplementor.extend({
	
	implement: function(obj){
		
		obj.prototype.onDrag = obj.prototype.onDrag || function(e) {
			
		};
		
		obj.prototype.onDragStart = obj.prototype.onDragStart || function(e) {
			
		};
		
		/**
		 * Make the component draggable. It position will be changed to absolute.
		 * @methodOf DraggableInterface#
		 * @name draggable
		 * @param {Object} param the parameters passed to the draggable engine
		 */
		obj.prototype.draggable = obj.prototype.draggable || function(param) {
			this.access().draggable(param);
			this.setStyle('position', 'absolute');
		};
		
		/**
		 * A method called before the component is dragged. Override this method
		 * to change the behavior.
		 * @methodOf DraggableInterface#
		 * @name beforeStartDragging
		 * @param e the event
		 */
		obj.prototype.beforeStartDragging = obj.prototype.beforeStartDragging || function(e) {};

		/**
		 * Enable dragging.
		 * @methodOf DraggableInterface#
		 * @name startDrag
		 * @param {Object} param the parameters passed to the draggable engine
		 */
		obj.prototype.startDrag = obj.prototype.startDrag || function(param) {
			var _self = this;
			this.setStyle('position', 'absolute');
			this.access().draggable({
				drag: function(e) {
					_self.isDragging = true;
					_self.onDrag(e);
				},
				start: function(e) {
					_self.onDragStart(e);
				},
				beforeStart: function(e) {
					_self.beforeStartDragging(e);
				}
			});
			this.access().draggable(param || "enable");
		};
		
		/**
		 * Disable dragging.
		 * @methodOf DraggableInterface#
		 * @name stopDrag
		 */
		obj.prototype.stopDrag = obj.prototype.stopDrag || function(){
			this.access().draggable("disable");
		};
	},
});

DraggableWrapper = {
	
	wrap: function(obj) {
		obj.currentClass.implement(DraggableInterface);
	}
};

/**
 * @class An interface which allows UI Component to be droppable
 * by another draggable component.
 * @interface
 */
DroppableInterface = InterfaceImplementor.extend({
	
	implement: function(obj) {

		/**
		 * Make the component droppable.
		 * @methodOf DroppableInterface#
		 * @name droppable
		 * @param {Object} param the parameters passed to the droppable engine
		 */
		obj.prototype.droppable = obj.prototype.droppable || function(param) {
			this.access().droppable(param);
			this.setLayout('absolute');
		};
	}
});

DroppableWrapper = {
	wrap: function(obj) {
		obj.currentClass.implement(DroppableInterface);
	}	
};

RotateIcon = Sketch.extend({
	
	setupBase: function(config) {
		this.container = config.container;
		this._super(config);
	},
	
	setupDomObject: function(config) {
		this._super(config);
		this.baseRotate = new Sketch();
		this.baseRotate.access().addClass("joo-base-rotate");
		this.alignRotate = new Sketch();
		this.alignRotate.access().addClass("joo-align-rotate");
		
		this.initialControlX = 50;
		this.initialControlY = 5.5;
		this.controlRotate = new Sketch();
		this.controlRotate.access().addClass("joo-control-rotate");
		this.controlRotate.setLocation(this.initialControlX, this.initialControlY);
//		DraggableWrapper.wrap(this.controlRotate);
//		this.controlRotate.draggable();
		
		var baseX = this.baseRotate.getX();
		var baseY = this.baseRotate.getY();
		var controlX = this.controlRotate.getX();
		var controlY = this.controlRotate.getY();
		if (controlX == 0) controlX = this.initialControlX;
		if (controlY == 0) controlY = this.initialControlY;
		var distance = MathUtil.getDistance({x: baseX+9, y: baseY+9}, {x: controlX+4.5, y: controlY+4.5});
		this.alignRotate.setWidth(distance);
		
		this.addChild(this.baseRotate);
		this.addChild(this.alignRotate);
		this.addChild(this.controlRotate);
		this.dragging = false;
	},
	
	registerEvent: function() {
		if (!this.dragging) {
			this.addEventListener('mousedown', function(e) {
				e.stopPropagation();
				this.container.changeTransformOrigin('center');
				$(window).bind("mousemove", {_self: this}, this.mouseMoveHandler);
				this.addEventListener("mousemove", this.mouseMoveHandler);
				this.dragging = true;
			});
		}
	},
	
	unregisterEvent: function() {
		if (this.dragging) {
			$(window).unbind("mousemove", this.mouseMoveHandler);
			this.removeEventListener("mousemove", this.mouseMoveHandler);
			this.dragging = false;
		}
	},
	
	updateArea: function(e) {
		this.newW = e.w || this.newW;
		this.newH = e.h || this.newH;
		
		var ctrlBtnOffset = -9;
		this.setLocation(this.newW/2 + ctrlBtnOffset, this.newH/2 + ctrlBtnOffset);
	},
	
	mouseMoveHandler: function(e) {
		var _self = this;
		if (e.data != undefined) {
			_self = e.data._self || this;
		}
		var baseX = _self.baseRotate.transformedOffset().x;
		var baseY = _self.baseRotate.transformedOffset().y;
		var controlX = e.pageX;
		var controlY = e.pageY;
		var angle = MathUtil.getAngle({x: baseX+9, y: baseY+9}, {x: controlX, y: controlY}, true);
		_self.dispatchEvent('areaChanged', {a: angle, base: {x: baseX+9, y: baseY+9}});
		//_self.controlRotate.setX(MathUtil.getDistance({x: baseX+9, y: baseY+9}, {x: controlX, y: controlY}));
	}
});

ResizeIcon = Sketch.extend({
	
	setupBase: function(config) {
		this.pos = config.pos;
		this.container = config.container;
		this._super(config);
	},
	
	setupDomObject: function(config) {
		this._super(config);
		this.access().addClass("unselectable");
		this.access().addClass("joo-move-icon");
		this.setStyle("cursor", this.pos+"-resize");
		this.dragging = false;
	},
	
	registerEvent: function() {
		this.addEventListener('mousedown', function(e) {
			e.stopPropagation();
			this.container.changeTransformOrigin('topLeft');
			$(window).bind("mousemove", {_self: this}, this.mouseMoveHandler);
			this.addEventListener("mousemove", this.mouseMoveHandler);
			this.dragging = true;
		});	
	},
	
	unregisterEvent: function() {
		if (this.dragging) {
			$(window).unbind("mousemove", this.mouseMoveHandler);
			this.removeEventListener("mousemove", this.mouseMoveHandler);
			this.dragging = false;
		}
	},
	
	updateArea: function(e) {
		this.newW = e.w || this.newW;
		this.newH = e.h || this.newH;
		
		var ctrlBtnOffset = -4;
		switch(this.pos) {
		case 'n':
			this.setLocation(this.newW/2 + ctrlBtnOffset, ctrlBtnOffset);
			break;
		case 'ne':
			this.setLocation(this.newW + ctrlBtnOffset, ctrlBtnOffset);
			break;
		case 'e':
			this.setLocation(this.newW + ctrlBtnOffset, this.newH/2 + ctrlBtnOffset);
			break;
		case 'se':
			this.setLocation(this.newW + ctrlBtnOffset, this.newH + ctrlBtnOffset);
			break;
		case 's':
			this.setLocation(this.newW/2 + ctrlBtnOffset, this.newH + ctrlBtnOffset);
			break;
		case 'sw':
			this.setLocation(ctrlBtnOffset, this.newH + ctrlBtnOffset);
			break;
		case 'w':
			this.setLocation(ctrlBtnOffset, this.newH/2 + ctrlBtnOffset);
			break;
		case 'nw':
			this.setLocation(ctrlBtnOffset, ctrlBtnOffset);
			break;
		default:
		}
	},
	
	mouseMoveHandler: function(e) {
		var _self = this;
		if (e.data != undefined) {
			_self = e.data._self || this;
		}
		var method = 'mouseMoveHandler' + _self.pos.toUpperCase();
		if (typeof _self[method] != 'undefined') {
			_self[method].call(_self, e);
			_self.dragging = true;
		}
	},
	
	mouseMoveHandlerN: function(e) {
		var pos = this.getContainerDeltaPosition(e);
		var angle = this.container.getRotation() * Math.PI / 180;
		var incx = pos.y * Math.sin(angle);
		var incy = pos.y * Math.cos(angle);
		this.newH = this.container.getHeight() - pos.y;
		this.dispatchEvent('areaChanged', {x: this.container.getX() - incx, y: this.container.getY() + incy, h: this.newH});
	},
	
	mouseMoveHandlerNW: function(e) {
		var pos = this.getContainerDeltaPosition(e);
		var baseOff = this.container._parent.offset();
		this.newW = this.container.getWidth() - pos.x;
		this.newH = this.container.getHeight() - pos.y;
		this.dispatchEvent('areaChanged', {x: e.pageX - baseOff.x, y: e.pageY - baseOff.y, h: this.newH, w: this.newW});
	},
	
	mouseMoveHandlerW: function(e) {
		var pos = this.getContainerDeltaPosition(e);
		var angle = this.container.getRotation() * Math.PI / 180;
		var incx = pos.x * Math.cos(angle);
		var incy = pos.x * Math.sin(angle);
		this.dispatchEvent('areaChanged', {x: this.container.getX() + incx, y: this.container.getY() + incy, w: this.container.getWidth() - pos.x});
	},
	
	mouseMoveHandlerSW: function(e){
		var pos = this.getContainerDeltaPosition(e);
		var angle = this.container.getRotation() * Math.PI / 180;
		this.newW = -pos.x+this.container.getWidth();
		this.newH = pos.y;
		var incx = pos.x * Math.cos(angle);
		var incy = pos.x * Math.sin(angle);
		this.dispatchEvent('areaChanged', {x: this.container.getX()+incx, y: this.container.getY()+incy, w: this.newW, h: this.newH});
	},

	mouseMoveHandlerS: function(e) {
		var pos = this.getContainerDeltaPosition(e);
		this.newH = pos.y;
		this.dispatchEvent('areaChanged', {h: this.newH});
	},
	
	mouseMoveHandlerSE: function(e) {
		var pos = this.getContainerDeltaPosition(e);
		this.newW = pos.x;
		this.newH = pos.y;
		this.dispatchEvent('areaChanged', {w: this.newW, h: this.newH});
	},
	
	mouseMoveHandlerE: function(e){
		var pos = this.getContainerDeltaPosition(e);
		this.newW = pos.x;
		this.dispatchEvent('areaChanged', {w: this.newW});
	},
	
	mouseMoveHandlerNE: function(e){
		var pos = this.getContainerDeltaPosition(e);
		var angle = this.container.getRotation() * Math.PI / 180;
		this.newW = pos.x;
		this.newH = -pos.y+this.container.getHeight();
		var incx = pos.y * Math.sin(angle);
		var incy = pos.y * Math.cos(angle);
		
		this.dispatchEvent('areaChanged', {h: this.newH, w: this.newW, x: this.container.getX() - incx, y: this.container.getY() + incy});
	},
	
	getContainerDeltaPosition: function(e) {
		var selfPos = this.container.offset();
		return getPositionInRotatedcoordinate({
			x : e.pageX - selfPos.x,
			y : e.pageY - selfPos.y
		}, Math.PI * this.container.getRotation() / 180);
	},
	
	getContainerOffsetPosition: function(newW, newH) {
		var newCenterPoint = getPositionFromRotatedCoordinate({
			x : (newW - this.container.getWidth()) / 2,
			y : (newH - this.container.getHeight()) / 2
		}, Math.PI * this.container.getRotation() / 180, this.container.getRotationCenterPoint());
		var res = getPositionFromRotatedCoordinate({
			x : - newW / 2,
			y : - newH / 2
		}, Math.PI * this.container.getRotation() / 180, newCenterPoint);
		return res;
	}
});

ResizeIconSet = Class.extend({
	
	init: function(container, pos, config) {
		this.resizebtns = Array();
		this.container = config.container = container;
		for(var i=0; i<pos.length; i++) {
			config.pos = pos[i];
			this.resizebtns.push(new ResizeIcon(config));
		}
	},
	
	addChild: function(icon) {
		icon.container = this.container;
		this.resizebtns.push(icon);
	},
	
	getButtons: function() {
		return this.resizebtns;
	},
	
	updateArea: function(e) {
		for(var i=0; i<this.resizebtns.length;i++) {
			this.resizebtns[i].updateArea(e);
		}
	},
	
	registerEvent: function() {
		for(var i=0; i<this.resizebtns.length;i++) {
			this.resizebtns[i].registerEvent();
		}
	},
	
	unregisterEvent: function() {
		for(var i=0; i<this.resizebtns.length;i++) {
			this.resizebtns[i].unregisterEvent();
		}
	},
	
	show: function() {
		for(var i=0; i<this.resizebtns.length; i++) {
			this.resizebtns[i].access().show();
		}
	},
	
	hide: function() {
		for(var i=0; i<this.resizebtns.length; i++) {
			this.resizebtns[i].access().hide();
		}
	}
});

ResizableInterface = InterfaceImplementor.extend({
	
	implement: function(obj) {

		obj.prototype.updateArea = obj.prototype.updateArea || function(e) {
			this.canvasW = this.canvasW || e.w;
			this.canvasH = this.canvasH || e.h;
			
			this.doUpdateArea(e);
			e.w = this.access().outerWidth();
			e.h = this.access().outerHeight();
			this.resizeset.updateArea(e);
		};
		
		obj.prototype.doUpdateArea = obj.prototype.doUpdateArea || function(e) {
			if (e.a != undefined) {
				this.setRotation(e.a);
			} else {
				var deltaW = this.access().outerWidth() - this.getWidth();
				var deltaH = this.access().outerHeight() - this.getHeight();
				if (e.x) {
					this.setX(e.x);
				}
				if (e.y)
					this.setY(e.y);
				if (e.h)
					this.setHeight(e.h - deltaH);
				if (e.w)
					this.setWidth(e.w - deltaW);
			}
		};
		
		obj.prototype.showResizeControl = obj.prototype.showResizeControl || function(){
			this.resizeset.show();
		},
		
		obj.prototype.hideResizeControl = obj.prototype.hideResizeControl || function(){
			this.resizeset.hide();
		},
		
		obj.prototype.onDeleteHandler = obj.prototype.onDeleteHandler || function(e) {
			this.dispose();
		};
		
		obj.prototype.onMouseUpHandler = obj.prototype.onMouseUpHandler || function(e) {};
		
		obj.prototype.onMouseDownHandler = obj.prototype.onMouseDownHandler || function(e) {};
		
		obj.prototype.beginEditable = obj.prototype.beginEditable || function(defaultW, defaultH, resizeIcon, includeRotate) {
			this.rotationCenter = {
				x: 0.5,
				y: 0.5
			};
			if (resizeIcon == undefined)
				resizeIcon = ['n', 'nw', 'w', 'sw', 's', 'e', 'se', 'ne'];
			this.defaultW = defaultW || 150;
			this.defaultH = defaultH || 150;
			
			this.resizeset = new ResizeIconSet(this, resizeIcon, {minW: 0, minH: 0, maxW: Number.MAX_VALUE, maxH: Number.MAX_VALUE});
			if (includeRotate)
				this.resizeset.addChild(new RotateIcon());
			this.setStyle('position', 'absolute');
			
			this.access().addClass('joo-init-transform');
			this.access().addClass("joo-editable-component");
			
			var _self = this;
			
			$(document).bind("mouseup",function(){
				_self.dispatchEvent('resizeStop');
				_self.changeTransformOrigin('center');
				_self.onMouseUpHandler();
				_self.resizeset.unregisterEvent();
			});

			for(var i=0; i<this.resizeset.getButtons().length;i++) {
				this.resizeset.getButtons()[i].addEventListener('mousedown', function(e) {
					_self.stopDrag();
					_self.onMouseDownHandler(e);
					_self.dispatchEvent('resizestart');
				});
				
				this.resizeset.getButtons()[i].addEventListener('mouseup', function(e) {
					_self.dispatchEvent('resizestop');
				});
				
				this.resizeset.getButtons()[i].addEventListener('stylechange', function(e) {
					e.stopPropagation();
				});
				
				this.resizeset.getButtons()[i].addEventListener('areaChanged', function(e) {
					if (e.w != undefined) {
						if (e.w > _self.maxW)
							e.w = _self.maxW;
						else if (e.w < _self.minW)
							e.w = _self.minW;
					}
					
					if (e.h!= undefined) {
						if (e.h > _self.maxH)
							e.h = _self.maxH;
						else if (e.h < _self.minH)
							e.h = _self.minH;
					}
					
					if (e.x != undefined) {
						var minX = _self.access().offset().x + _self.getWidth() - _self.maxW;
						var maxX = _self.access().offset().x + _self.getWidth() - _self.minW;
						if (e.x < minX)
							e.x = minX;
						else if (e.x > maxX)
							e.x = maxX;
					}
					
					if (e.y != undefined) {
						var minY = _self.offset().y + _self.getHeight() - _self.maxH;
						var maxY = _self.offset().y + _self.getHeight() - _self.minH;
						if (e.y < minY)
							e.y = minY;
						else if (e.y > maxY)
							e.y = maxY;
					}
					_self.updateArea(e);
				});
			}
			this.resizeset.registerEvent();
			this.dispatchEvent('resizeStart');

			for(var i=0; i<this.resizeset.getButtons().length; i++) {
				this.addChild(this.resizeset.getButtons()[i]);
			}
			this.updateArea({w: this.defaultW, h: this.defaultH});
		};
	}
});

EffectableInterface = InterfaceImplementor.extend({
	
	implement: function(obj) {
		obj.prototype.runEffect = obj.prototype.runEffect || function(effect, options, speed) {
			this.access().effect(effect, options, speed);
		};
	}
});

ParentStylePropertiesMutator = Class.extend({
	
	setProperty: function(obj, name, value) {
		obj._parent.setStyle(name, value);
	}
});

StylePropertiesMutator = Class.extend({
	
	setProperty: function(obj, name, value) {
		obj.setStyle(name, value);
	}
});

StyleCSS3PropertiesMutator = Class.extend({
	
	setProperty: function(obj, name, value) {
		obj.setCSS3Style(name, value);
	}
});

AttrPropertiesMutator = Class.extend({
	
	setProperty: function(obj, name, value) {
		obj.setAttribute(name, value);
	}
});

EffectPropertiesMutator = Class.extend({
	
	setProperty: function(obj, name, value) {
		Wrapper.wrap(obj, EffectableInterface);
		obj._effect = value;
		obj.runEffect(value, {time: 1}, 500);
		setTimeout(function() {
			obj.access().show();
		}, 750);
	}
});

ToggleAttrPropertiesMutator = Class.extend({
	
	setProperty: function(obj, name, value) {
		if (value)
			obj.setAttribute(name, '');
		else
			obj.removeAttribute(name);
	}
});

ParentStylePropertiesAccessor = Class.extend({
	
	getProperty: function(obj, name) {
		return obj._parent.getComputedStyle(name);
	}
});

StylePropertiesAccessor = Class.extend({
	
	getProperty: function(obj, name) {
		return obj.getComputedStyle(name);
	}
});

StyleCSS3PropertiesAccessor = Class.extend({
	
	getProperty: function(obj, name) {
		return obj.getComputedStyle(name);
	}
});

AttrPropertiesAccessor = Class.extend({
	
	getProperty: function(obj, name) {
		return obj.getAttribute(name);
	}
});

EffectPropertiesAccessor = Class.extend({
	
	getProperty: function(obj, name) {
		return obj._effect;
	}
});

ToggleAttrPropertiesAccessor = Class.extend({
	
	getProperty: function(obj, name) {
		return obj.hasAttribute(name);
	}
});

Preset = Class.extend({

	init: function() {
		this.name = "Preset";
		this.changed = {};
		this.oldValue = {};
	},
	
	apply: function(obj) {
		for(var i in this.changed) {
			this.oldValue[i] = obj.getStyle(i);
			obj.setStyle(i, this.changed[i]);
			this.changed[i] = obj.getStyle(i);
		}
	},
	
	revert: function(obj) {
		for(var i in this.changed) {
			var style = obj.getStyle(i);
			if (style == this.changed[i]) {
				obj.setStyle(i, this.oldValue[i]);
			}
		}
	},
	
	getName: function() {
		return this.name;
	},
	
	toString: function() {
		return this.name;
	}
});

LinkButtonPreset = Preset.extend({
	
	init: function() {
		this._super();
		this.name = "LinkButton";
		this.changed = {
			'border': 'none',
			'background-color': 'transparent',
			'color': '#069',
			'text-decoration': 'underline',
			'background-image': 'none'
		};
	}
});

MacButtonPreset = Preset.extend({
	
	init: function() {
		this._super();
		this.name = "MacButton";
		this.changed = {
			'border-radius': '5px',
			'color': 'black',
			'border-width': '1px',
			'border-color': '#ccc',
			'border-style': 'solid',
			'background-color': '#ccc',
			'background-image': 'none'
		};
	}
});

TextHeaderPreset = Preset.extend({
	
	init: function() {
		this._super();
		this.name = "TextHeader";
		this.changed = {
			'font-size': '20px',
			'font-weight': 'bold'
		};
	}
});

TextSectionPreset = Preset.extend({
	
	init: function() {
		this._super();
		this.name = "TextSection";
		this.changed = {
			'font-size': '16px',
			'font-weight': 'bold',
			'color': '#069'
		};
	}
});

PresetPropertiesMutator = Class.extend({
	
	setProperty: function(obj, k, v) {
		Wrapper.wrap(obj, PresetInterface);
		if (v == undefined || v == 'none') {
			obj.revertPreset();
		} else {
			var preset = new window[v + "Preset"]();
			obj.applyPreset(preset);
		}
	}
});

PresetPropertiesAccessor = Class.extend({
	
	getProperty: function(obj, k) {
		if (obj._preset != undefined)
			return obj._preset.name;
	}
});

PresetInterface = InterfaceImplementor.extend({
	
	implement: function(obj) {
		obj.prototype.applyPreset = obj.prototype.applyPreset || function(preset) {
			this.revertPreset();
			this._preset = preset;
			this._preset.apply(this);
		};
		
		obj.prototype.revertPreset = obj.prototype.revertPreset || function() {
			if (this._preset != undefined) {
				this._preset.revert(this);
				this._preset = undefined;
			}
		};
	}
});

PropertiesEncapsulationInterface = InterfaceImplementor.extend({
	
	implement: function(obj) {
		
		obj.prototype.getSupportedProperties = obj.prototype.getSupportedProperties || function() {
			return this.supportedProperties;
		};
		
		obj.prototype.setProperty = obj.prototype.setProperty || function(property, value) {
			var className = property.type.substr(0, 1).toUpperCase() + property.type.substr(1) + 'PropertiesMutator';
			if (window[className] != undefined)
				new window[className]().setProperty(this, property.name, value);
		};
		
		obj.prototype.getProperty = obj.prototype.getProperty || function(property) {
			var className = property.type.substr(0, 1).toUpperCase() + property.type.substr(1) + 'PropertiesAccessor';
			if (window[className] != undefined)
				return new window[className]().getProperty(this, property.name);
		};
	}
});

MaskableInterface = InterfaceImplementor.extend({
	
	implement: function(obj) {
		
		obj.prototype.addMask = obj.prototype.addMask || function(background, alpha) {
			background = background || "black";
			alpha = alpha || "0.2";
			var sketch = new Sketch({width: '100%', height: '100%', 'background-color': background});
			sketch.setStyle('opacity', alpha);
			sketch.setStyle('position', 'absolute');
			sketch.setStyle('z-index', '50');
			sketch.setLocation(0, 0);
			this.addChild(sketch);
		};
	}
});
