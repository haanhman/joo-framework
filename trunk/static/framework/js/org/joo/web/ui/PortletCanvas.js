/**
 * @class A component used as a view of 1 portlet.
 * Further version will allow user to interact with
 * the portlet.
 * @augments Graphic
 */
JOO.define('org.joo.web.ui.PortletCanvas', {
	
	extend: org.joo.ui.Graphic,

	setupDomObject: function(config)	{
		this._super(config);
		this.access().addClass('portlet');
		this.access().addClass('portlet-canvas');
	}
});