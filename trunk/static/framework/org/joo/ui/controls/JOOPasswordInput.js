/**
 * @class A counterpart of <code>HTML INPUT PASSWORD</code>
 * @augments JOOInput
 */
JOO.define('org.joo.ui.controls.JOOPasswordInput', {
	
	extend: org.joo.ui.JOOInput,
	
	toHtml: function()	{
		return "<input type='password' />";
	}
});