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
JOO.define('org.joo.ui.DisplayObjectContainer',
/**
 * @lends DisplayObjectContainer#
 */
{
	extend: org.joo.ui.DisplayObject,
	
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
	
	dispose: function() {
		for(var i=0;i<this.children.length;i++) {
			this.children[i].dispose();
		}
		this._super();
	}
});