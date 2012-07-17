/**
 * @class A set of menu, which is usually placed at the top of the application
 * @augments UIComponent
 */
JOO.define('org.joo.ui.controls.JOOMenuBar', 
/** @lends JOOMenuBar# */		
{
	extend: org.joo.ui.UIComponent,
	
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