/**
 * @class A counterpart of <code>HTML BUTTON</code> element.
 * <p>It supports additional configuration parameters:</p>
 * <ul>
 * 	<li><code>lbl</code> The label of the button.</li>
 * </ul>
 * @augments UIComponent
 */
JOO.define('org.joo.ui.controls.JOOButton', 
/** @lends JOOButton# */		
{
	extend: org.joo.ui.UIComponent,
	
	setupDomObject: function(config) {
		this._super(config);
		if (config.lbl != undefined) {
			this.access().html(config.lbl);
		}
		this.addEventListener('click', function(e) {
			this.onclick(e);
		});
	},
	
	toHtml: function()	{
		return "<a></a>";
	},
	
	/**
	 * Command attached to the button.
	 * @param e the event object
	 */
	onclick: function(e) {}
});