/**
 * @class A counterpart of <code>HTML A</code> element.
 * <p>It supports additional configuration parameters</p>
 * <ul>
 * 	<li><code>href</code> The URL the link goes to</li>
 * 	<li><code>lbl</code> The label of the link</li>
 * </ul>
 * @augments UIComponent
 */
JOO.define('org.joo.ui.controls.JOOLink', {

	extend: org.joo.ui.UIComponent,
	
	setupDomObject: function(config) {
		this._super(config);
		if (config.href)
			this.setAttribute('href', config.href);
		if (config.lbl)
			this.access().html(config.lbl);
	},
	
	toHtml: function() {
		return "<a></a>";
	}
});