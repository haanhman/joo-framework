/**
 * @class A counterpart of <code>HTML INPUT TEXT</code>
 * @augments JOOInput
 */
JOO.define('org.joo.ui.controls.JOOTextInput', {
	
	extend: org.joo.ui.JOOInput,
	
	toHtml: function()	{
		return "<input type='text' />";
	}
});