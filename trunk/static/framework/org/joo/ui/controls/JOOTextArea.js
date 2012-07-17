/**
 * @class An input which provides an area
 * for user to enter text. It is the counterpart
 * of <code>HTML TEXTAREA</code> element.
 */
JOO.define('org.joo.ui.controls.JOOTextArea', 
/** @lends JOOTextArea# */		
{
	extend: org.joo.ui.JOOInput,
	
	toHtml: function()	{
		return "<textarea></textarea>";
	},

	/**
	 * Alias of <code>getValue</code>
	 * @returns {String} the value of the textarea
	 */
	getText: function()	{
		return this.access().val();
	}
});