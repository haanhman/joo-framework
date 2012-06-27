/**
 * @class A group of menu items or menus. Like its superclass {@link JOOMenuItem},
 * a menu can be attached with a command
 * <p>It supports additional configuration parameters:</p>
 * <ul>
 * 	<li><code>icon</code> The icon of the menu</li>
 * </ul>
 * @augments JOOMenuItem
 */
JOO.define('org.joo.ui.controls.JOOMenu', 
/** @lends JOOMenu# */
{
	extend: org.joo.ui.JOOMenuItem,
	
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