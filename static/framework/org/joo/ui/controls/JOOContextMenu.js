/**
 * @class A context (or popup) menu. It can be attached to any other components
 * @augments Sketch
 */
JOO.define('org.joo.ui.controls.JOOContextMenu', {
	
	extend: org.joo.ui.Sketch,
	
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