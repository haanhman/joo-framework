ThemeManager = Class.extend({
	
	init: function() {
		if (ThemeManager.instance == undefined) {
			throw "ThemeManager is singleton and cannot be initiated";
		}
		this.lookAndFeel = "joo";
		this.style = "";
		this.uiprefix = "joo";
	},
	
	setLookAndFeel: function(lookAndFeel) {
		this.lookAndFeel = lookAndFeel;
	},
	
	setStylesheet: function(style) {
		this.style = style;
	},
	
	setUIPrefix: function(prefix) {
		this.uiprefix = prefix;
	}
});

JOOFont = Class.extend({
	init:function()	{
		this.fontFamily = 'arial, sans-serif';
		this.fontSize = "12px";
		this.bold = false;
		this.italic = false;
		this.underline = false;
		this.color = "black";
	},
	
	setFont: function(fontFamily, fontSize, bold, italic, underline, color)	{
		this.fontFamily = fontFamily;
		this.fontSize = fontSize;
		this.bold = bold;
		this.italic = italic;
		this.underline = underline;
		this.color = color;
	},
	
	setFontFamily: function(fontFamily)	{
		this.fontFamily = fontFamily;
	},
	
	getFontFamily: function()	{
		return this.fontFamily;
	},
	
	setFontSize: function(fontSize)	{
		this.fontSize = fontSize;
	},
	
	getFontSize: function()	{
		return this.fontSize;
	},
	
	setBold: function(bold)	{
		this.bold = bold;
	},
	
	getBold: function()	{
		return this.bold;
	},
	
	setItalic: function(italic)	{
		this.italic = italic;
	},
	
	getItalic: function()	{
		return this.italic;
	},
	
	setColor: function(color)	{
		this.color = color;
	},
	
	getUnderline: function()	{
		return this.underline;
	},
	setUnderline: function(underline)	{
		this.underline = underline;
	},
	
	getColor: function()	{
		return this.color;
	}
});

EventDispatcher = Class.extend(
/**
 * @lends EventDispatcher#
 */	
{

	/**
	 * Create a new EventDispatcher.
	 * @class Base class for all event dispatchers (such as DisplayObject)
	 * @constructs
	 * @augments Class
	 */
	init: function() {
		this.listeners = {};
	},
	
	/**
	 * Add a new listener for a specific event.
	 * @param {String} event the event to be handled. 
	 * @param {Function} handler the event handler. If you want to remove it
	 * at a later time, it must not be an anonymous function
	 */
	addEventListener: function(event, handler) {
		if (this.listeners[event] == undefined) {
			this.listeners[event] = Array();
		}
		this.listeners[event].push(handler);
	},
	
	/**
	 * Dispatch a event.
	 * @param {String} event the event to be dispatched.
	 */
	dispatchEvent: function(event) {
		if (!this.disabled && this.listeners && this.listeners[event] != undefined) {
			var handlers = this.listeners[event];
			var args = Array();
			for(var i=1; i<arguments.length; i++) {
				args.push(arguments[i]);
			}
			for(var i=0;i<handlers.length;i++) {
				var result = handlers[i].apply(this, args);
				if (result === false)
					return;
			}
		}
	},
	
	/**
	 * Remove a handler for a specific event.
	 * @param {String} event the event of handler to be removed 
	 * @param {Function} handler the handler to be removed
	 */
	removeEventListener: function(event, handler) {
		if (this.listeners && this.listeners[event] != undefined) {
			var index = this.listeners[event].indexOf(handler);
			if (index != -1)
				this.listeners[event].splice(index, 1);
		}
	},
	
	disable: function(disabled) {
		this.disabled = disabled;
	},
	
	toString: function() {
		return "EventDispatcher";
	},
	
	setupBase: function(config) {
		
	}
});

DisplayObject = EventDispatcher.extend(
/**
 * @lends DisplayObject#
 */
{
	/**
	 * Create a new DisplayObject
	 * @constructs
	 * @class
	 * <p>Base class for all JOO UI components</p>
	 * <p>It supports the following configuration parameters:</p>
	 * <ul>
	 * 	<li><code>tooltip</code> The tooltip of the object</li>
	 * 	<li><code>absolute</code> Whether position remains intact or not</li>
	 * 	<li><code>x</code> X of component. The <code>absolute</code> parameter must be false</li>
	 * 	<li><code>y</code> Y of component. The <code>absolute</code> parameter must be false</li>
	 * 	<li><code>width</code> Width of component</li>
	 * 	<li><code>height</code> Height of component</li>
	 * 	<li><code>custom</code> Custom styles of component</li>
	 * </ul>
	 * @augments EventDispatcher
	 */
	init: function(config) {
		this._super();
		this.domEventBound = {};
		this.inheritedCSSClasses = true;
		this.classes = Array();
		if (config == undefined) config = {};
		this.config = config;
		this.setupBase(config);
		this.setupDisplay(config);
		this.setupDomObject(config);
		
//		var objMgr = SingletonFactory.getInstance(Application).getObjectManager();
//		objMgr.register(this);
	},
	
	/**
	 * Update the stage of current component.
	 * This method is not intended to be used by developers.
	 * It is called automatically from JOO when an object is added to a stage
	 * directly or indirectly.
	 * @private
	 * @param {Stage} stage new Stage of current component
	 */
	updateStage: function(stage) {
		if (stage != this.stage) {
			this.stage = stage;
			this.dispatchEvent("stageUpdated");
		}
	},

	/**
	 * Make this component sketched by another one
	 * @param {DisplayObject} parent the component that this component anchors to
	 */
	anchorTo: function(parent) {
		this.setLocation(0, 0);
		this.setStyle('width', parent.getWidth());
		this.setStyle('height', parent.getHeight());
	},

	addEventListener: function(event, handler) {
		if (this.domEventBound[event] != true) {
			this.access().bind(event, {_self: this, event: event}, this.bindEvent );
			this.domEventBound[event] = true;
		}
		this._super(event, handler);
	},
	
	dispatchEvent: function(event) {
		if (!this.disabled) {
			this._super.apply(this, arguments);
		}
	},
	
	bindEvent: function(e) {
		var event = e.data.event;
		var args = Array();
		args.push(event);
		for(var i=0; i<arguments.length; i++) {
			args.push(arguments[i]);
		}
		var _self = e.data._self;
		_self['dispatchEvent'].apply(_self, args);
	},
	
	_appendBaseClass: function(className) {
		this.classes.push('joo-'+className.toLowerCase());
	},

	/**
	 * Initialize variables
	 * @private
	 * @param {object} config configuration parameters
	 */
	setupBase: function(config) {
		this._appendBaseClass(this.className);
		for(var i=this.ancestors.length-1; i>=0; i--) {
			if (this.ancestors[i].prototype.className) {
				this._appendBaseClass(this.ancestors[i].prototype.className);
			}
		}
		this.id = this.id || config.id || generateId(this.className.toLowerCase());
		this._parent = undefined;
		this._super(config);
	},
	
	setupDisplay: function(config) {
		this.scaleX = this.scaleY = 1;
		this.rotation = 0;
		this.rotationCenter = {
			x: 0.5,
			y: 0.5
		};
		this.roundDeltaX = 0;
		this.roundDeltaY = 0;
		this.roundDeltaW = 0;
		this.roundDeltaH = 0;
	},

	/**
	 * Initialize UI
	 * @private
	 * @param {object} config configuration parameters
	 */
	setupDomObject: function(config) {
		this.domObject = JOOUtils.accessCustom(this.toHtml());
		this.setAttribute('id', this.id);
//		var c = this.inheritedCSSClasses? this.classes.length : 1;
//		for(var i=0; i<c; i++) {
//			this.access().addClass('joo-'+this.classes[i].toLowerCase());
//		}
		this.classes.push('joo-ui');
		this.setAttribute('class', this.classes.join(' '));
		this.classes = undefined;
//		this.access().addClass('joo-ui');	//for base styles, e.g: all DisplayObject has 'position: absolute'
		
		if (config.tooltip)
			this.setAttribute('title', config.tooltip);
//		if (!config.absolute) {
			if (config.x != undefined)
				this.setX(config.x);
			if (config.y != undefined)
				this.setY(config.y);
//			var x = config.x || 0;
//			var y = config.y || 0;
//			this.setLocation(x, y);
//		}
		if (config['background-color'] != undefined)
			this.setStyle('background-color', config['background-color']);
		
		if (config.extclasses) {
			var cls = config.extclasses.split(',');
			for(var i=0; i<cls.length; i++) {
				this.access().addClass(cls[i]);
			}
		}

		if (config.width != undefined)
			this.setWidth(config.width);
		if (config.height != undefined)
			this.setHeight(config.height);
		
		if (config.custom != undefined) {
			for (var i in config.custom) {
				this.setStyle(i, config.custom[i]);
			}
		}
	},
	
	/**
	 * Change width of component
	 * @param {String|Number} w new width of component
	 */
	setWidth: function(w) {
		if (!isNaN(w) && w != '') {
			w = parseFloat(w);
			w += this.roundDeltaW;
			this.roundDeltaW = w - Math.floor(w);
			w = Math.floor(w);
		}
		this.setStyle('width', w);
	},

	/**
	 * Change height of component
	 * @param {String|Number} h new height of component
	 */
	setHeight: function(h) {
		if (!isNaN(h) && h != '') {
			h = parseFloat(h);
			h += this.roundDeltaH;
			this.roundDeltaH = h - Math.floor(h);
			h = Math.floor(h);
		}
		this.setStyle('height', h);
	},

	/**
	 * Get current width of component (without border, outline & margin)
	 * @returns {String|Number} width of component
	 */
	getWidth: function() {
		return this.access().width();
	},

	/**
	 * Get current height of component (without border, outline & margin)
	 * @returns {String|Number} height of component
	 */
	getHeight: function() {
		return this.access().height();
	},

	/**
	 * Get the current location of component
	 * @returns {Object} location of component
	 */
	getLocation: function() {
		return {x: this.getX(), y: this.getY()};
	},

	/**
	 * Change the location of component
	 * @param {String|Number} x new x coordinate
	 * @param {String|Number} y new y coordinate
	 */
	setLocation: function(x, y) {
		this.setX(x);
		this.setY(y);
	},
	
	/**
	 * Get the current x position of component
	 * @returns {String|Number} current x position
	 */
	getX: function() {
		var left = this.getStyle("left");
		if (left.length > 2)
			left = parseFloat(left.substr(0, left.length-2));
		if (isNaN(left))
			return this.access().position().left;
		return left;
	},
	
	/**
	 * Change the x position of component 
	 * @param {Number} the current x position 
	 */
	setX: function(x) {
		x = parseFloat(x);
		if (isNaN(x)) return;
		x += this.roundDeltaX;
		this.roundDeltaX = x - Math.floor(x);
		this.setStyle('left', Math.floor(x)+'px');
	},
	
	/**
	 * Get the current y position of component
	 * @returns {String|Number} current y position
	 */
	getY: function() {
		var top = parseFloat(this.getStyle('top'));
		if (top.length > 2)
			top = parseFloat(top.substr(0, top.length-2));
		if (isNaN(top))
			return this.access().position().top;
		return top;
	},
	
	/**
	 * Change the y position of component 
	 * @param {Number} the current y position 
	 */
	setY: function(y) {
		y = parseFloat(y);
		if (isNaN(y)) return;
		y += this.roundDeltaY;
		this.roundDeltaY = y - Math.floor(y);
		this.setStyle('top', Math.floor(y)+'px');
	},
	
	/**
	 * Get current rotation angle
	 * @returns {Number} current rotation (in degree)
	 */
	getRotation: function() {
		return this.rotation;
	},

	/**
	 * Change the rotation angle
	 * @param {Number} r the new rotation angle in degree
	 */
	setRotation: function(r) {
		this.rotation = r;
		this.setCSS3Style('transform', 'rotate('+r+'deg)');
	},
	
	/**
	 * Change DOM attribute
	 * @param {String} attrName the attribute name
	 * @param {String} value the attribute value
	 */
	setAttribute: function(attrName, value) {
		this.access().attr(attrName, value);
	},

	/**
	 * Get value of a DOM attribute
	 * @param attrName the attribute name
	 * @returns {String} the attribute value
	 */
	getAttribute: function(attrName) {
		return this.access().attr(attrName);
	},

	/**
	 * Get all DOM attributes mapped by name
	 * @returns {Object} the attributes map
	 */
	getAttributes: function() {
		return JOOUtils.getAttributes(this.access()[0]);
	},

	/**
	 * Remove a DOM attribute
	 * @param {String} name the attribute name
	 */
	removeAttribute: function(name) {
		this.access().removeAttr(name);
	},
	
	/**
	 * Whether a DOM attribute exists
	 * @param {String} name the attribute name
	 * @returns {Boolean} <code>true</code> if the attribute exists, otherwise returns <code>false</code>
	 */
	hasAttribute: function(name) {
		return this.access().attr(name) != undefined;
	},

	/**
	 * Change a style
	 * @param {String} k the style name
	 * @param {String} v the style value
	 * @param {Boolean} silent whether event is omitted or dispatched
	 */
	setStyle: function(k, v, silent) {
		if (silent)
			this.access().silentCss(k, v);
		else
			this.access().css(k, v);
	},

	/**
	 * Get value of a style
	 * @param {String} k the style name
	 * @returns {String} the style value
	 */
	getStyle: function(k) {
		return this.access().css(k);
	},

	/**
	 * Get the computed value of a style
	 * @param {String} k the style name 
	 * @returns {String} the style computed value
	 */
	getComputedStyle: function(k) {
		var s = this.access().getStyleObject()[k];
		if (s == undefined)
			return this.getStyle(k);
		return s;
	},
	
	/**
	 * Change a CSS3 style.
	 * It works by adding CSS3-prefixes to the style name
	 * @param {String} k the style name
	 * @param {String} v the style value
	 */
	setCSS3Style: function(k, v) {
		this.setStyle(k, v);
		this.setStyle('-ms-'+k, v);
		this.setStyle('-webkit-'+k, v);
		this.setStyle('-moz-'+k, v);
		this.setStyle('-o-'+k, v);
	},
	
	getScale: function() {
		return { scaleX: this.scaleX, scaleY:this.scaleY };
	},
	
	setScaleX: function(x, time) {
		if (time == undefined) time = 0;
		this.scaleX = x;
		this.access().effect('scale', { percent: x*100, direction: 'horizontal' }, time);
	},
	
	setScaleY: function(y, time) {
		if (time == undefined) time = 0;
		this.scaleY = y;
		this.access().effect('scale', { percent: y*100, direction: 'vertical' }, time);
	},
	
	setScale: function(s, time) {
		if (time == undefined) time = 0;
		this.access().effect('scale', { percent: s*100, direction: 'both' }, time);
	},
	
	getId: function() {
		return this.id;
	},
	
	/**
	 * Get the corresponding Resource object.
	 * @returns {Resource} the Resource object
	 */
	access: function() {
		return this.domObject;
	},

	/**
	 * Specify HTML content of current component.
	 * Subclass can override this method to specify its own content
	 * @returns {String}
	 */
	toHtml: function() {
		return "";
	},
	
	applyFont: function(font){
		if(font.fontFamily){
			this.setStyle("font-family", font.fontFamily);
		}
		
		if (font.fontSize) {
			this.setStyle('font-size', font.fontSize);
		}
		
		if(font.bold) {
			this.setStyle("font-weight", "bold");
		}

		if(font.italic || font.underline) {
			var font_style = "";
			if(font.italic){
				font_style += "italic ";
			}
			if(font.underline){
				font_style += "underline";
			}
			this.setStyle("font-style", font_style);
		}
		if(font.color){
			this.setStyle("color",font.color);
		}
	},

	/**
	 * Dispose the current component.
	 * <p>It is not intended to be used by developers, as this method
	 * does not remove the current component from its parent's <code>children</code> array.
	 * Developers should use the <code>selfRemove</code> method instead.</p>
	 * @private
	 */
	dispose: function(skipRemove) {
		this.dispatchEvent('dispose');
		
		if (!skipRemove) {
			this.access().remove();
		}
//		var objMgr = SingletonFactory.getInstance(Application).getObjectManager();
//		objMgr.remove(this);
		this.listeners = undefined;
		this.config = undefined;
		this.dead = true;
		
		//if (this.domEventBound != undefined) {
			//for(var i in this.domEventBound) {
				//this.access().unbind(i, this.bindEvent);
			//}
			//this.access().unbind();
			this.domEventBound = undefined;
		//}
		this._parent = undefined;
		this.domObject = undefined;
		this.stage = undefined;
	},
	
	/**
	 * Dispose the current component and remove reference from its parent.
	 * This method can be called by developers.
	 * <p>Note that developers must also remove any extra references before
	 * disposing a component to prevent memory leaks</p>
	 */
	selfRemove: function() {
		if (this._parent != undefined)
			this._parent.removeChild(this);
		else
			this.dispose();
	},
	
	/**
	 * Enable/Disable current component. 
	 * Disabled component itself can still dispatch events but all of its
	 * event listeners are disabled
	 * @param {Boolean} disabled whether disable or enable the component
	 */
	disable: function(disabled) {
		//TODO check if the disabled flag is actually changed
		this._super(disabled);
		if (disabled) {
			this.access().addClass('disabled');
			this.setAttribute('disabled', 'disabled');
		} else {
			this.dispatchEvent('stageUpdated');
			this.access().removeClass('disabled');
			this.removeAttribute('disabled');
		}
	},
	
	toString: function() {
		return this.className;
	}
});

/**
 * This class is abstract and should be subclassed.
 * @class Base class for containers. A container is a component 
 * which contains other components.
 * <p>It supports additional configuration parameters:</p>
 * <ul>
 * 	<li><code>layout</code> The layout of current component. See <code>setLayout</code> method</li>
 * </ul>
 * @augments DisplayObject
 */
DisplayObjectContainer = DisplayObject.extend(
/**
 * @lends DisplayObjectContainer#
 */
{
	updateStage: function(stage) {
		this._super(stage);
		for(var i=0; i<this.children.length; i++) {
			this.children[i].updateStage(this.stage);
		}
	},
	
	setupBase: function(config)	{
		this.children = new Array();
		this._super(config);
	},
	
	setupDomObject: function(config) {
		this._super(config);
		if (config.layout == undefined)
			config.layout = 'block';
		this.setLayout(config.layout);
	},
	
	disable: function(disabled) {
		for(var i=0; i<this.children.length; i++) {
			this.children[i].disable(disabled);
		}
		this._super(disabled);
	},
	
	changeTransformOrigin: function(option) {
		if (this.transformOrigin == option) return;
		var pos = this.transformedOffset();
		var selfPos = this.virtualNontransformedOffset();
		var deltaX = pos.x - selfPos.x;
		var deltaY = pos.y - selfPos.y;
		
		switch (option) {
			case 'topLeft':{
				this.setStyle('-webkit-transform-origin', '0 0');
				this.setLocation(this.getX() + deltaX, this.getY() + deltaY);
				break;
			}
			case 'center': {
				this.setStyle('-webkit-transform-origin', "50% 50%");
				this.setLocation(this.getX() - deltaX, this.getY() - deltaY);
				break;
			}
			default: return;
		}
		this.transformOrigin = option;
	},
	
	getRotationCenterPoint: function() {
		var selfPos = this.offset();
		var width = parseFloat(this.getWidth());
		var height = parseFloat(this.getWidth());
		return getPositionFromRotatedCoordinate({
			x : width * this.rotationCenter.x,
			y : height * this.rotationCenter.y
		}, 0, selfPos);
	},
	
	/**
	 * Offset (top-left coordinate) relative to the document 'as if' the object is not transformed
	 * @private
	 */
	virtualNontransformedOffset: function() {
		var width = parseFloat(this.getWidth());
		var height = parseFloat(this.getHeight());
		return getPositionFromRotatedCoordinate({
			x : -width * this.rotationCenter.x,
			y : -height * this.rotationCenter.y
		}, 0, this.getRotationCenterPoint());
	},

	/**
	 * Offset (top-left coordinate) relative to the document assuming the object is transformed
	 * @private
	 */
	transformedOffset: function() {
		var width = parseFloat(this.getWidth());
		var height = parseFloat(this.getHeight());
		return getPositionFromRotatedCoordinate({
			x : -width * this.rotationCenter.x,
			y : -height * this.rotationCenter.y
		}, this.getRotation() * Math.PI / 180, this.getRotationCenterPoint());
	},
	
	/**
	 * Same as virtualNontransformedOffset
	 * @private
	 */
	offset: function() {
		var x = 0, y = 0;
		var obj = document.getElementById(this.getId());
		if(obj) {
			x = obj.offsetLeft;
			y = obj.offsetTop;
			var body = document.getElementsByTagName('body')[0];
			while(obj.offsetParent && obj != body) {
				x += obj.offsetParent.offsetLeft;
				y += obj.offsetParent.offsetTop;
				obj = obj.offsetParent;
			}
		}
		return {
			x: x,
			y: y
		};
	},

	/**
	 * Add a component before a Resource object.
	 * @param {DisplayObject} obj the component to be added 
	 * @param {Resource} positionObj the Resource object
	 */
	addChildBeforePosition: function(obj, positionObj)	{
		this._prepareAddChild(obj);
		obj.access().insertBefore(positionObj);
		obj.updateStage(this.stage);
	},
	
	/**
	 * Add a component at the end of current container.
	 * @param {DisplayObject} obj the component to be added 
	 */
	addChild: function(obj)	{
		this._prepareAddChild(obj);
		obj.access().appendTo(this.access());
		obj.updateStage(this.stage);
	},
	
	_prepareAddChild: function(obj) {
		this.children.push(obj);
		if (obj._parent != undefined)
			obj._parent.detachChild(obj);
		obj._parent = this;
	},
	
	/**
	 * Remove a child component.
	 * @param {DisplayObject} object the component to be removed
	 */
	removeChild: function(object)	{
		for(var i=0;i<this.children.length;i++)	{
			var obj = this.children[i];
			if (obj.getId() == object.getId())	{
				this.children.splice(i, 1);
				object.dispose();
			}
		}
	},
	
	/**
	 * Remove a child component at specific index. 
	 * @param {Number} index the index of the component to be removed
	 */
	removeChildAt: function(index) {
		var object = this.children[index];
		this.children.splice(index, 1);
		object.dispose();
	},
	
	removeAllChildren: function() {
		for(var i=this.children.length-1; i>=0; i--) {
			this.children[i].dispose();
		}
		this.children = Array();
	},

	/**
	 * Detach (but not dispose) a child component.
	 * The component will be detached from DOM, but retains
	 * its content, listeners, etc.
	 * @param {DisplayObject} object the object to be detached
	 */
	detachChild: function(object)	{
		for(var i=0;i<this.children.length;i++)	{
			var obj = this.children[i];
			if (obj.getId() == object.getId())	{
				this.children.splice(i, 1);
				obj.access().detach();
				obj._parent = undefined;
			}
		}
	},

	/**
	 * Get all children of the container.
	 * @returns {Array} an array of this container's children
	 */
	getChildren: function()	{
		return this.children;
	},
	
	/**
	 * Get a child component with specific id.
	 * @param {Number} id the id of the child component
	 * @returns {DisplayObject} the child component with specified id
	 */
	getChildById: function(id) {
		for(var i in this.children) {
			if (this.children[i].getId() == id)
				return this.children[i];
		}
		return undefined;
	},
	
	/**
	 * Change the layout of this container.
	 * <p>Supported layouts are:</p>
	 * <ul>
	 * 	<li><code>absolute</code>: All children have absolute position</li>
	 * 	<li><code>flow</code>: All children have relative position</li>
	 * 	<li><code>vertical</code>: All children have block display</li>
	 * </ul>
	 * @param {String} layout new layout
	 */
	setLayout: function(layout) {
		if (this.layout != undefined)
			this.access().removeClass('joo-layout-'+this.layout);
		this.access().addClass('joo-layout-'+layout);
		this.layout = layout;
	},
	
	dispose: function(skipRemove) {
		for(var i=0;i<this.children.length;i++) {
			this.children[i].dispose(true);
		}
		this.children = undefined;
		this._super(skipRemove);
	}
});

/**
 * @class A component with custom HTML.
 * <p>It supports additional configuration parameters:</p>
 * <ul>
 * 	<li><code>html</code> Custom HTML</li>
 * </ul>
 * @augments DisplayObjectContainer
 */
CustomDisplayObject = DisplayObjectContainer.extend({

	setupDomObject: function(config) {
		this.domObject = JOOUtils.accessCustom(config.html);
	}
});

/**
 * @class A component into which can be painted.
 * @augments DisplayObject
 */
Graphic = DisplayObject.extend(
/** @lends Graphic# */
{
	
	setupDomObject: function(config) {
		this._super(config);
		this.repaint(config.html);
	},
	
	/**
	 * Clear & repaint the component.
	 * @param {String} html content to be repainted
	 */
	repaint: function(html) {
		this.access().html(html);
	},
	
	/**
	 * Paint (append) specific content to the component.
	 * @param {String} html content to be painted
	 */
	paint: function(html) {
		this.access().append(html);
	},

	/**
	 * Clear the current content.
	 */
	clear: function() {
		this.access().html("");
	},
	
	toHtml: function() {
		return "<div></div>";
	}
});

/**
 * Create a new Sketch
 * @class A concrete subclass of DisplayObjectContainer.
 * It is a counterpart of <code>HTML DIV</code> element
 * @augments DisplayObjectContainer
 */
Sketch = DisplayObjectContainer.extend(
/** @lends Sketch# */
{
	setupDomObject: function(config) {
		this._super(config);
	},
	
	toHtml: function()	{
		return "<div></div>";
	}
});

/**
 * Create a new Panel
 * @class A panel, which has a <code>inline-block</code> display
 * @augments Sketch
 */
Panel = Sketch.extend({
	
});

ContextableInterface = InterfaceImplementor.extend({
	
	implement: function(obj) {
		obj.prototype.setupContextMenu = obj.prototype.setupContextMenu || function() {
			if (!this.contextMenu) {
				this.contextMenu = new JOOContextMenu();
			}
		};
		
		obj.prototype.getContextMenu = obj.prototype.getContextMenu || function() {
			return this.contextMenu;
		};
		
		obj.prototype.contextMenuHandler = obj.prototype.contextMenuHandler || function(e) {
			e.preventDefault();
			this.getContextMenu().show(e.clientX+2, e.clientY+2);
			this.dispatchEvent("showContextMenu", e);
		};
		
		obj.prototype.attachContextMenu = obj.prototype.attachContextMenu || function(useCapturePhase) {
			this.addChild(this.contextMenu);
			this.contextMenu.hide();
			this.addEventListener('contextmenu', function(e) {
				this.contextMenuHandler(e);
				e.stopPropagation();
			}, useCapturePhase);
			this.getContextMenu().addEventListener('click', function(e) {
				e.stopPropagation();
			}, useCapturePhase);
		};
	}
});

/**
 * @class Abstract base class for other UI controls. All UIComponent subclasses
 * is equipped with a {@link JOOContextMenu}
 * @augments DisplayObjectContainer
 */
UIComponent = DisplayObjectContainer.extend({
	
	setupDomObject: function(config) {
		this._super(config);
		this.setupContextMenu();
	},
	
	toHtml: function() {
		return "<div></div>";
	}
}).implement(ContextableInterface);

UIRenderInterface = InterfaceImplementor.extend({
	
	implement: function(obj) {
		obj.prototype.render = obj.prototype.render || function() {
			tmpl('UI-'+obj.className, obj.config);
		};
	}
});

/**
 * @class The Stage is a special UI component, which hosts, manages selection 
 * and renders other UI components
 * <p>It supports additional configuration parameters:</p>
 * <ul>
 * 	<li><code>allowMultiSelect</code> whether multi-selection is allowed</li>
 * </ul>
 * @augments UIComponent
 */
Stage = UIComponent.extend(
/** @lends Stage# */
{
	setupBase: function(config)	{
		this.stage = this;
		this.id = config.id;
		this.allowMultiSelect = config.allowMultiSelect || true;
		this.selectedObjects = Array();
		this._super(config);
	},
	
	/**
	 * Get a list of current selected objects.
	 * @returns {Array} current selected objects
	 */
	getSelectedObjects: function() {
		return this.selectedObjects;
	},
	
	/**
	 * Delete all selected objects.
	 */
	deleteSelectedObjects: function() {
		for(var i=0;i<this.selectedObjects.length;i++) {
			this.selectedObjects[i].stageDeselect();
			this.selectedObjects[i].selfRemove();
		}
		this.selectedObjects = Array();
		this.dispatchEvent('selectedChange');
	},

	/**
	 * Deselect specific selected object.
	 * <p>Usually developers should use the {@link SelectableInterface} 
	 * rather than calling this method directly
	 * </p>
	 * @param {SelectableInterface} obj the object to be deselected.
	 * It <b>should</b> be a selected object.
	 */
	removeSelectedObject: function(obj) {
		if (typeof obj['stageDeselect'] == 'undefined')
			throw 'Object '+obj+' is not deselectable';
		var index = this.selectedObjects.indexOf(obj);
		if (index != -1) {
			obj.selected = false;
			obj.stageDeselect();
			this.selectedObjects.splice(index, 1);
			this.dispatchEvent('selectedChange');
/*			
			var subject = SingletonFactory.getInstance(Subject);
			subject.notifyEvent('ObjectDeselected', obj);*/
		}
	},
	
	/**
	 * Deselect all objects, which is previously selected under this Stage.
	 */
	deselectAllObjects: function() {
		for(var i=0;i<this.selectedObjects.length;i++) {
			this.selectedObjects[i].stageDeselect();
		}
		this.selectedObjects = Array();
		this.dispatchEvent('selectedChange');
		
/*		var subject = SingletonFactory.getInstance(Subject);
		subject.notifyEvent('AllObjectDeselected');*/
	},

	/**
	 * Add a component to the list of selected objects.
	 * It will call the <code>stageSelect</code> method
	 * of the component automatically.
	 * <p>
	 * If either <code>isMultiSelect</code> or <code>allowMultiSelect</code>
	 * is <code>false</code>, previously selected objects will be deselected.
	 * </p>
	 * @param {SelectableInterface} obj the object to selected
	 * @param {Boolean} isMultiSelect whether this selection is a multi-selection
	 */
	addSelectedObject: function(obj, isMultiSelect) {
		if (typeof obj['stageSelect'] == 'undefined')
			throw 'Object '+obj+' is not selectable';
		if (this.selectedObjects.indexOf(obj) != -1)
			return;
		
		if (isMultiSelect == undefined) isMultiSelect = false;
		if (!this.allowMultiSelect || !isMultiSelect) {
			this.deselectAllObjects();
		}
		obj.selected = true;
		obj.stageSelect();
		this.selectedObjects.push(obj);
		this.dispatchEvent('selectedChange');
		
		var subject = SingletonFactory.getInstance(Subject);
		subject.notifyEvent('ObjectSelected', obj);
	},
	
	setupDomObject: function(config) {
		this.domObject = JOOUtils.access(this.id);
		this.access().addClass('joo-'+this.className.toLowerCase());
		this.access().addClass('joo-uicomponent');

		if (config.layout == undefined)
			config.layout = 'block';
		this.setLayout(config.layout);
		this.setupContextMenu();
	}
});

/**
 * Create a new Canvas
 * @class A counterpart of <code>HTML5 Canvas</code>
 * @augments DisplayObject
 */
Canvas = DisplayObject.extend({
	
	setupBase: function(config)	{
		this.context = undefined;
		this._super(config);
	},
	
	getContext: function()	{
		if(this.context == undefined){
			this.context = new CanvasContext(this, "2d");
		}
		return this.context;
	},
	
	setWidth: function(width) {
		this.setAttribute('width', width);
	},
	
	setHeight: function(height) {
		this.setAttribute('height', height);
	},
	
	getWidth: function() {
		return this.getAttribute('width');
	},
	
	getHeight: function() {
		return this.getAttribute('height');
	},
	
	toHtml: function(){
		return "<canvas>Sorry, your browser does not support canvas</canvas>";
	}
});

/*
 * CanvasContext
 */
CanvasContext = Class.extend({
    
	init: function(canvas, dimension){
        if (canvas.access().length == 0) {
            throw Error("From CanvasContext constructor: cannot init canvas context");
        }
        this.canvas = canvas;
        if (dimension == undefined) {
            dimension = "2d";
        }
        this.dimension = dimension;
        this.context = document.getElementById(canvas.getId()).getContext(dimension);
    },
    
    setTextAlign: function(align) {
    	this.context.textAlign = align;
    },
    
    /*
     * get&set fillStyle
     */
    setFillStyle: function(color){
        this.context.fillStyle = color;
    },
    
    getFillStyle: function(){
        return this.context.fillStyle;
    },
    
    /*
     * get&set strokeStyle
     */
    setStrokeStyle: function(color){
        this.context.strokeStyle = color;
    },
    
    getStrokeStyle: function(){
        return this.context.strokeStyle;
    },
    
    /*
     * get&set globalAlpha
     */
    setGlobalAlpha: function(alpha){
        this.context.globalAlpha = alpha;
    },
    
    getGlobalAlpha: function(){
        return this.context.globalAlpha;
    },
    /*
     * get&set lineWidth
     */
    setLineWidth: function(w){
        this.context.lineWidth = w;
    },
    
    getLineWidth: function(){
        return this.context.lineWidth;
    },
    
    /*
     * get&set lineCap
     */
    setLineCap: function(cap){
        this.context.lineCap = cap;
    },
    
    getLineCap: function(){
        return this.context.lineCap;
    },
    
    /*
     * get&set lineJoin
     */
    setLineJoin: function(j){
        this.context.lineJoin = j;
    },
    
    getLineJoin: function(){
        return this.context.lineJoin;
    },
    
    /*
     * get&set shadowOffsetX
     */
    setShadowOffsetX: function(x){
        this.context.shadowOffsetX = x;
    },
    
    getShadowOffsetX: function(){
        return this.context.shadowOffsetX;
    },
    
    /*
     * get&set shadowOffsetY
     */
    setShadowOffsetY: function(y){
        this.context.shadowOffsetY = y;
    },
    
    getShadowOffsetY: function(){
        return this.context.shadowOffsetY;
    },
    
    /*
     * get&set shadowBlur
     */
    setShadowBlur: function(blur){
        this.context.shadowBlur = blur;
    },
    
    getShadowBlur: function(){
        return this.context.shadowBlur;
    },
    
    /*
     * get&set shadowColor
     */
    setShadowColor: function(color){
        this.context.shadowColor = color;
    },
    
    getShadowColor: function(){
        return this.context.shadowColor;
    },
    
    /*
     * get&set globalCompositeOperation
     */
    setGlobalCompositeOperation: function(v){
        this.context.globalCompositeOperation = v;
    },
    
    getGlobalCompositeOperation: function(){
        return this.context.globalCompositeOperation;
    },
    
    clearRect: function(x,y,width,height){
    	this.context.clearRect(x,y,width,height);
    },
    
    fillRect: function(x, y, w, h){
        this.context.fillRect(x, y, w, h);
    },
    
    strokeRect: function(x, y, w, h){
        this.context.strokeRect(x, y, w, h);
    },
    
    beginPath: function(){
        this.context.beginPath();
    },
    
    closePath: function(){
        this.context.closePath();
    },
    
    stroke: function(){
        this.context.stroke();
    },
    
    fill: function(){
        this.context.fill();
    },
    
    getImageData: function(x,y,width,height){
    	return this.context.getImageData(x,y,width,height);
    },
    
    moveTo: function(x, y){
        this.context.moveTo(x, y);
    },
    
    lineTo: function(x, y){
        this.context.lineTo(x, y);
    },
    
    arc: function(x, y, radius, startAngle, endAngle, anticlockwise){
        this.context.arc(x, y, radius, startAngle, endAngle, anticlockwise);
    },
    
    quadraticCurveTo: function(cp1x, cp1y, x, y){
        this.context.quadraticCurveTo(cp1x, cp1y, x, y);
    },
    
    bezierCurveTo: function(cp1x, cp1y, cp2x, cp2y, x, y){
        this.context.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
    },
    
    drawRoundedRect: function(x, y, width, height, radius){
        var ctx = this.context;
        ctx.beginPath();
        ctx.moveTo(x, y + radius);
        ctx.lineTo(x, y + height - radius);
        ctx.quadraticCurveTo(x, y + height, x + radius, y + height);
        ctx.lineTo(x + width - radius, y + height);
        ctx.quadraticCurveTo(x + width, y + height, x + width, y + height - radius);
        ctx.lineTo(x + width, y + radius);
        ctx.quadraticCurveTo(x + width, y, x + width - radius, y);
        ctx.lineTo(x + radius, y);
        ctx.quadraticCurveTo(x, y, x, y + radius);
        ctx.stroke();
        ctx.closePath();
    },
	
	drawCircle: function(x, y, radius){
		var ctx = this.context;
		ctx.beginPath();
		ctx.arc(x,y,radius,0,Math.PI*2,true);
		if(ctx.fillStyle != undefined){
			ctx.fill();
		}
		if(ctx.strokeStyle != undefined){
			ctx.stroke();
		}
		ctx.closePath();
	},
	
	drawImage: function(){
		var ctx = this.context;
		ctx.drawImage.apply(ctx, arguments);
	},
    
    createLinearGradient: function(x1, y1, x2, y2){
        return this.context.createLinearGradient(x1, y1, x2, y2);
    },
    
    createRadialGradient: function(x1, y1, r1, x2, y2, r2){
        return this.context.createRadialGradient(x1, y1, r1, x2, y2, r2);
    },
    
    createPattern: function(image, type){
        return this.context.createPattern(image, type);
    },
    
    save: function(){
        this.context.save();
    },
    
    restore: function(){
        this.context.restore();
    },
    
    rotate: function(angle){
        this.context.rotate(angle);
    },
    
    scale: function(x, y){
        this.context.scale(x, y);
    },
    
    transform: function(m11, m12, m21, m22, dx, dy){
        this.context.transform(m11, m12, m21, m22, dx, dy);
    },
    
    setTransform: function(m11, m12, m21, m22, dx, dy){
        this.context.setTransform(m11, m12, m21, m22, dx, dy);
    },
    
    clip: function(){
        this.context.clip();
    },
    
    setFont: function(font){
    	var fstr = "";
    	if(font.getBold()){
    		fstr += "bold ";
    	}
    	if(font.getItalic()){
    		fstr += "italic ";
    	}
		this.context.fillStyle = font.getColor();
    	fstr += font.getFontSize()+" ";
    	fstr += font.getFontFamily();
    	this.context.font = fstr;
    },
    
    getFont: function(){
    	var font = new Font();
    	fstr = this.context.font;
    	if(fstr.indexOf("bold") != -1 || fstr.indexOf("Bold") != -1){
    		font.setBold(true);
    	}
    	if(fstr.indexOf("italic") != -1 || fstr.indexOf("Italic") != -1){
    		font.setItalic(true);
    	}
    	var fontSize = fstr.match(/\b\d+(px|pt|em)/g);
    	if(fontSize!=null && fontSize.length > 0){
    		font.setFontSize(fontSize[0]);
    	}
    	var fontFamily = fstr.match(/\b\w+,\s?[a-zA-Z-]+\b/g);
    	if(fontFamily!=null && fontFamily.length >0){
    		font.setFontFamily(fontFamily[0]);
    	}
    	return font;
    },
    
    getTextWidth: function(text){
    	return this.context.measureText(text).width;
    },
    
    getTextHeight: function(text){
    	//return this.context.measureText(text).width;
    	throw "not yet implemented";
    },
    
    fillText: function(text,x,y,maxWidth){
    	if(maxWidth != undefined){
	    	this.context.fillText(text,x,y,maxWidth);
		}else{
			this.context.fillText(text,x,y);
		}
    },
    
    strokeText: function(text,x,y,maxWidth){
		if(maxWidth != undefined){
			this.context.strokeText(text,x,y,maxWidth);
		}else{
			this.context.strokeText(text,x,y);
		}	
    }
});

/**
 * @class A counterpart of <code>HTML HR</code> element
 * @augments DisplayObject 
 */
Separator = DisplayObject.extend({
	
	toHtml: function() {
		return "<hr />";
	}
});this.items = new Array();

/**
 * @class A menu item, which is attached with a command and 
 * can be added to a {@link JOOMenu} or {@link JOOContextMenu}
 * <p>It supports additional configuration parameters:</p>
 * <ul>
 * 	<li><code>command</code> A function which is called automatically when
 * 		the menu item is clicked
 * 	</li>
 * </ul>
 * @augments Sketch 
 */
JOOMenuItem = Sketch.extend(
/** @lends JOOMenuItem# */		
{
	
	setupDomObject: function(config) {
		this._super(config);
		if (config.label == undefined) {
			config.label = this.id;
		}
		this._outputText(config.label);
		if (config.command != undefined)
			this.onclick = config.command;
		this.addEventListener('click', this.onclick);
	},
	
	_outputText: function(label) {
		this.access().html(label);
	},

	/**
	 * The default command, if no command is attached to this menu
	 * @param e
	 */
	onclick: function(e) {}
});

/**
 * @class A group of menu items or menus. Like its superclass {@link JOOMenuItem},
 * a menu can be attached with a command
 * <p>It supports additional configuration parameters:</p>
 * <ul>
 * 	<li><code>icon</code> The icon of the menu</li>
 * </ul>
 * @augments JOOMenuItem
 */
JOOMenu = JOOMenuItem.extend(
/** @lends JOOMenu# */
{
	
	setupBase: function(config) {
		this.items = new Array();
		this._super(config);
	},
	
	setupDomObject: function(config) {
		this._super(config);
		this.menuHolder = new Sketch();
		this.addChild(this.menuHolder);
		this.menuHolder.access().hide();
		this.menuHolder.access().addClass('joo-menu-holder');
		this.isShown = false;
		this.access().removeClass('joo-joomenuitem');
	},

	_outputText: function(label) {
		if (this.config.icon != undefined)
			this.access().html('<a class="joo-menu-label"><img title="'+label+'" src="'+this.config.icon+'" /><span>'+label+'</span></a>');
		else
			this.access().html('<a class="joo-menu-label">'+label+'</a>');
	},
	
	/**
	 * Add a menu item or another menu to this menu
	 * @param {JOOMenuItem|JOOMenu} item the item to be added
	 */
	addItem: function(item) {
		this.items.push(item);
		this.menuHolder.addChild(item);
	},

	/**
	 * Get all menu items and submenus
	 * @returns {Array} an array of menu items & submenus
	 */
	getItems: function() {
		return this.items;
	},
	
	onclick: function() {
		this.toggleMenuItems();
	},

	/**
	 * Toggle (show/hide) menu items
	 */
	toggleMenuItems: function() {
		if (this.isShown)
			this.hideMenuItems();
		else
			this.showMenuItems();
	},

	/**
	 * Show all menu items
	 */
	showMenuItems: function() {
		if (this.items.length > 0) {
			this.menuHolder.access().show();
			this.access().addClass('active');
			this.isShown = true;
			this.dispatchEvent('menuShown');
		}
	},

	/**
	 * Hide all menu items
	 */
	hideMenuItems: function() {
		this.menuHolder.access().hide();
		this.access().removeClass('active');
		this.isShown = false;
		this.dispatchEvent('menuHidden');
	}
});

/**
 * @class A set of menu, which is usually placed at the top of the application
 * @augments UIComponent
 */
JOOMenuBar = UIComponent.extend(
/** @lends JOOMenuBar# */		
{
	setupBase: function(config) {
		this.items = new Array();
		this.activeMenus = 0;
		this._super(config);
	},
	
	setupDomObject: function(config) {
		this._super(config);
		var _self = this;
		$(window).bind('click', function() {
			_self.hideAllMenus();
		});
	},

	/**
	 * Hide all menus and their menu items
	 */
	hideAllMenus: function() {
		for(var i=0; i<this.items.length; i++) {
			this.items[i].hideMenuItems();
		}
	},

	/**
	 * Add a new menu to the bar
	 * @param {JOOMenu} item the menu to be added
	 */
	addItem: function(item) {
		this.items.push(item);
		this.addChild(item);
		var _self = this;
		item.addEventListener('menuShown', function() {
			_self.activeMenus ++;
			_self.active = true;
		});
		item.addEventListener('menuHidden', function() {
			if (_self.activeMenus > 0)
				_self.activeMenus --;
			if (_self.activeMenus <= 0)
				_self.active = false;
		});
		item.addEventListener('mouseover', function() {
			if (_self.active) {
				_self.hideAllMenus();
				this.showMenuItems();
			}
		});
	},
	
	/**
	 * Get all menus of the bar
	 * @returns {Array} an array of menus this bar contains
	 */
	getItems: function() {
		return this.items;
	}
});

/**
 * @class A context (or popup) menu. It can be attached to any other components
 * @augments Sketch
 */
JOOContextMenu = Sketch.extend({
	
	setupBase: function(config)	{
		this.items = new Array();
		this._super(config);
	},

	/**
	 * Add a menu item
	 * @param {JOOMenuItem} item a menu item to be added
	 */
	addItem: function(item) {
		this.items.push(item);
		var _self = this;
		item.addEventListener('click', function() {
			_self.hide();
		});
		this.addChild(item);
	},

	/**
	 * Get all menu items
	 * @returns {Array} an array of menu items of this context menu
	 */
	getItems: function() {
		return this.items;
	},

	/**
	 * Show the context menu at specific position
	 * @param {String|Number} x x position
	 * @param {String|Number} y y position
	 */
	show: function(x, y) {
		var subject = SingletonFactory.getInstance(Subject);
		subject.notifyEvent('ContextMenuShown', this);
		this.setLocation(x, y);
		this.access().show();
	},
	
	/**
	 * Hide the context menu
	 */
	hide: function() {
		this.access().hide();
	}
});

/**
 * @class A counterpart of <code>HTML IFRAME</code> element
 * <p>It supports additional configuration parameters:</p>
 * <ul>
 * 	<li><code>src</code> The source of the iframe</li>
 * </ul>
 * @augments Sketch
 */
JOOIFrame = Sketch.extend(
/** @lends JOOIFrame# */		
{
	setupBase: function(config) {
		this._super(config);
	},
	
	setupDomObject: function(config) {
		this._super(config);
		if (config.src)
			this.setAttribute('src', config.src);
		this.setAttribute('name', this.getId());
	},
	
	/**
	 * Change source of the iframe
	 * @param {String} src new source (URL) of the iframe
	 */
	setSrc: function(src) {
		this.setAttribute('src', src);
	},

	/**
	 * Get the source of the iframe
	 * @returns {String} the source of the iframe
	 */
	getSrc: function() {
		return this.getAttribute('src');
	},
	
	toHtml: function() {
		return "<iframe></iframe>";
	}
});

/**
 * @class A counterpart of <code>HTML Form</code>
 * <p>It supports additional configuration parameters:</p>
 * <ul>
 * 	<li><code>method</code> The method used when submitting the form</li>
 * 	<li><code>encType</code> The encoded type, the default type is <code>application/x-www-form-urlencoded</code></li>
 * </ul>
 * @augments Sketch
 */
JOOForm = Sketch.extend(
/** @lends JOOForm# */
{
	
	setupDomObject: function(config) {
		this._super(config);
		config.method = config.method || "post";
		config.encType = config.encType || "application/x-www-form-urlencoded";
		this.setAttribute("method", config.method);
		this.setAttribute("enctype", config.encType);
	},

	/**
	 * Submit the form
	 */
	submit: function() {
		this.access().submit();
	},
	
	toHtml: function() {
		return "<form></form>";
	}
});

ContainerWrapper = Class.extend({
	
	wrap: function(container, obj) {
		container.addChild(obj);
		return container;
	}
});
