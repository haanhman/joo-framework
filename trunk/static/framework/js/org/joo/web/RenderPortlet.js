/**
 * @class A simple portlet used for rendering
 * @augments Class
 * @implements PortletInterface
 * @implements RenderInterface
 */
JOO.define('org.joo.web.RenderPortlet',
/** @lends RenderPortlet# */	
{
	/**
	 * Render and display the portlet.
	 */
	run: function() {
		this.getPortletPlaceholder().paintCanvas(this.render());
	}
}).implement(org.joo.web.Portlet, org.joo.web.Renderable);