/**
 * @class Abstract base class for other UI controls. All UIComponent subclasses
 * is equipped with a {@link JOOContextMenu}
 * @augments DisplayObjectContainer
 */
JOO.define('org.joo.ui.UIComponent', {
	
	extend: org.joo.ui.DisplayObjectContainer,
	
	setupDomObject: function(config) {
		this._super(config);
		this.setupContextMenu();
	},
	
	toHtml: function() {
		return "<div></div>";
	}
}).implement(org.joo.ui.interfaces.Contextable);