/**
 * @class An equivalent but different from <code>HTML INPUT CHECKBOX</code> element.
 * @augments JOOToggleButton
 */
JOO.define('org.joo.ui.controls.JOOCheckbox',
/** @lends JOOCheckbox# */
{
	extend: org.joo.ui.controls.JOOToggleButton,
	
	ontoggledown: function() {
		this.value = true;
		this.access().addClass('checked');
		this.dispatchEvent('change');
	},
	
	ontoggleup: function() {
		this.value = false;
		this.access().removeClass('checked');
		this.dispatchEvent('change');
	},

	/**
	 * Get the value of the checkbox.
	 * @returns {Boolean} the value. <code>true</code> if the checkbox is checked,
	 * <code>false</code> otherwise.
	 */
	getValue: function() {
		return this.value;
	},
	
	/**
	 * Change the value of the checkbox.
	 * @param {Boolean} value the value of the checkbox
	 */
	setValue: function(value) {
		if (value)
			this.ontoggledown();
		else
			this.ontoggleup();
	},
	
	toHtml: function() {
		return "<span></span> ";
	}
});