/**
 * @class An interface for all components which need rendering.
 * The <code>RenderInterface</code> is commonly used in 
 * user-defined <code>Portlet</code>. Note that a component can
 * have multiple extra views besides the main view. In this case,
 * developers should use <code>renderView</code> method.
 * @interface
 */
JOO.define('org.joo.web.Renderable', {

	extend: org.joo.core.InterfaceImplementor,
	
	onModelChange: function() {
		
	},
	
	implement: function(obj)	{
		/**
		 * Render the component using microtemplating mechanism.
		 * The component must supply the following:
		 * <p>
		 * 	<ul>
		 *  	<li>A <code>viewId</code> or implement <code>getName</code> method</li>
		 *  	<li>An optional <code>model</code> which is a Javascript object</li>
		 *  	<li>A template, which must exists in DOM before this method is called.
		 *  		The template should be a <code>script</code> element, with 
		 *  		<i><code>text/html</code></i> <code>type</code> attributes.
		 *  		The <code>id</code> of the template is the <code>viewId</code>
		 *  		followed by "View".
		 *  		<br />For example, suppose the <code>viewId</code> of the component
		 *  		is MyComponent, then the <code>id</code> should be MyComponentView.
		 *  	</li>
		 *  </ul>
		 * </p>
		 * @name render
		 * @methodOf RenderInterface#
		 * @returns {String} the rendered content of the component
		 */
		obj.prototype.render = obj.prototype.render || function(){
			this.viewId = this.viewId || this.getName()+"View";
			this.model = this.model || JOOModel.from({});
//			if(this.viewId == undefined || this.model == undefined){
//				throw "No viewId or model for rendering";
//			}
			return tmpl(this.viewId, this.model);
		};

		/**
		 * Render a specific view the component using microtemplating mechanism.
		 * The component must supply the following:
		 * <p>
		 * 	<ul>
		 *  	<li>A <code>viewId</code> or implement <code>getName</code> method</li>
		 *  	<li>A view template, which must exists in DOM before this method is called.
		 *  		The template should be a <code>script</code> element, with 
		 *  		<i><code>text/html</code></i> <code>type</code> attributes.
		 *  		The <code>id</code> of the template is the <code>viewId</code>
		 *  		followed by "-" and the <code>view</code> parameters.
		 *  		<br />For example, suppose the <code>viewId</code> of the component
		 *  		is MyComponent, then calling <code>this.renderView("FirstView", {})</code>
		 *  		inside the component will render the template with <code>id</code> 
		 *  		MyComponent-FirstView.
		 *  	</li>
		 *  </ul>
		 * </p>
		 * @methodOf RenderInterface#
		 * @name renderView
		 * @returns {String} the rendered view of the component
		 */
		obj.prototype.renderView = obj.prototype.renderView || function(view, model)	{
			return tmpl((this.viewId || this.getName())+"-"+view, model);
		};
		
		/**
		 * Display and bind the model to the view.
		 * @methodOf RenderInterface#
		 * @name displayAndBind
		 */
		obj.prototype.displayAndBind = obj.prototype.displayAndBind || function()	{
			var _self = this;
			if (this.model) {
				this.model.addEventListener('change', function() {
					_self.getPortletPlaceholder().paintCanvas(_self.render());
				});
			}
			this.getPortletPlaceholder().paintCanvas(this.render());
		};
	}
});