/**
 * @class A customized button, which excludes all styles
 * of its superclass and ancestors.
 * @augments JOOButton
 */
JOO.define('org.joo.ui.controls.JOOCustomButton', {
	
	extend: org.joo.ui.controls.JOOButton,
	
	setupDomObject: function(config) {
		this.inheritedCSSClasses = false;
		this._super(config);
	}
});