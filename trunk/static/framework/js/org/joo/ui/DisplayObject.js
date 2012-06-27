JOO.define('org.joo.ui.DisplayObject',
/**
 * @lends DisplayObject#
 */
{
	extend: org.joo.event.EventDispatcher,
	
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
		
		var objMgr = JOO.factory.getInstance(org.joo.Application).getObjectManager();
		objMgr.register(this);
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
		this.classes.push(className);
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
		var c = this.inheritedCSSClasses? this.classes.length : 1;
		for(var i=0; i<c; i++) {
			this.access().addClass('joo-'+this.classes[i].toLowerCase());
		}
		this.classes = undefined;
		this.access().addClass('joo-ui');	//for base styles, e.g: all DisplayObject has 'position: absolute'
		
		if (config.tooltip)
			this.setAttribute('title', config.tooltip);
		if (!config.absolute) {
			var x = config.x || 0;
			var y = config.y || 0;
			this.setLocation(x, y);
		}
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
	dispose: function() {
		this.dispatchEvent('dispose');
		
		this.access().remove();
		var objMgr = SingletonFactory.getInstance(Application).getObjectManager();
		objMgr.remove(this);
		this.listeners = undefined;
		this.config = undefined;
		this.dead = true;
		
		if (this.domEventBound != undefined) {
			for(var i in this.domEventBound) {
				this.access().unbind(i, this.bindEvent);
			}
			this.domEventBound = undefined;
		}
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
		
		this.disabled = disabled;
		if (disabled) {
			this.access().addClass('disabled');
			this.setAttribute('disabled', 'disabled');
		} else {
			this.dispatchEvent('stageUpdated');
			this.access().removeClass('disabled');
			this.removeAttribute('disabled');
		}
	}
});