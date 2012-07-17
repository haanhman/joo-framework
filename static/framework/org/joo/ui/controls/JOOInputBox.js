/**
 * @class An input associated with a label.
 * <p>It supports additional configuration parameters</p>
 * <ul>
 * 	<li><code>labelObject</code> the label object, if not specified a new label will be created using the same configuration parameters as this object</li>
 * 	<li><code>inputObject</code> the input object, if not specified a new text input will be created using the same configuration parameters as this object</li>
 * </ul>
 * @augments JOOInput
 */
JOO.define('org.joo.ui.controls.JOOInputBox',
/** @lends JOOInput# */		
{
	extend: org.joo.ui.JOOInput,
	
	setupDomObject: function(config) {
		this._super(config);
		this.label = config.labelObject || new JOOLabel(config);
		this.input = config.inputObject || new JOOTextInput(config);
		this.addChild(this.label);
		this.addChild(this.input);
	},
	
	/**
	 * Get the value of the input
	 * @returns {Object} the input value
	 */
	getValue: function()	{
		return this.input.getValue();
	},
	
	/**
	 * Change the value of the input
	 * @param value {Object} the new input value
	 */
	setValue: function(value) {
		this.input.setValue(value);
	},
	
	/**
	 * Get the text of the label 
	 * @returns {String} the label's text
	 */
	getLabel: function() {
		return this.label.getValue();
	},
	
	/**
	 * Get the name of the input
	 * @returns the input's name
	 */
	getName: function() {
		return this.input.getName();
	},
	
	focus: function()	{
		this.input.focus();
	}
});