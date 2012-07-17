/**
 * @class A button which can toggle up and down.
 * <p>It supports additional configuration parameters</p>
 * <ul>
 * 	<li><code>state</code> The initial state of the button</p>
 * </ul>
 * @augments JOOCustomButton
 */
JOO.define('org.joo.ui.controls.JOOToggleButton', 
/** @lends 	JOOToggleButton# */
{
	extend: org.joo.ui.controls.JOOCustomButton,
	
	setupBase: function(config) {
		this.state = config.state;
		this._super(config);
	},
	
	setupDomObject: function(config) {
		this._super(config);
		if (this.state)
			this.access().addClass('joo-toggle-down');
	},

	/**
	 * Change the state of the button.
	 * @param {Boolean} state the state of the button 
	 */
	setState: function(state) {
		this.state = state;
		if(this.state) {
			this.access().addClass('joo-toggle-down');
			this.ontoggledown();
		} else {
			this.access().removeClass('joo-toggle-down');
			this.ontoggleup();
		}
	},
	
	/**
	 * Get the state of the button.
	 * @returns {Boolean} the state of the button
	 */
	getState: function() {
		return this.state;
	},
	
	onclick: function(e) {
		this.access().toggleClass("joo-toggle-down");
		if(this.state) {
			this.state = false;
			this.ontoggleup();
		} else {
			this.state = true;
			this.ontoggledown();
		}
		this.dispatchEvent('toggle');
	},
	
	ontoggledown: function() {
		this.dispatchEvent('toggleDown');
	},
	
	ontoggleup: function() {
		this.dispatchEvent('toggleUp');
	}
});