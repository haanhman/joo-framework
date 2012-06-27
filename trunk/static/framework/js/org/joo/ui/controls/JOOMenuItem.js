/**
 * @class A menu item, which is attached with a command and 
 * can be added to a {@link JOOMenu} or {@link JOOContextMenu}
 * <p>It supports additional configuration parameters:</p>
 * <ul>
 * 	<li><code>command</code> A function which is called automatically when
 * 		the menu item is clicked
 * 	</li>
 * </ul>
 * @augments Sketch 
 */
JOO.define('org.joo.ui.controls.JOOMenuItem', 
/** @lends JOOMenuItem# */		
{
	extend: org.joo.ui.Sketch,
	
	setupDomObject: function(config) {
		this._super(config);
		if (config.label == undefined) {
			config.label = this.id;
		}
		this._outputText(config.label);
		if (config.command != undefined)
			this.onclick = config.command;
		this.addEventListener('click', this.onclick);
	},
	
	_outputText: function(label) {
		this.access().html(label);
	},

	/**
	 * The default command, if no command is attached to this menu
	 * @param e
	 */
	onclick: function(e) {}
});