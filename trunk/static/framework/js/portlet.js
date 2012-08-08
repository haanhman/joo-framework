/**
 * @class A component used as a view of 1 portlet.
 * Further version will allow user to interact with
 * the portlet.
 * @augments Graphic
 */
PortletCanvas = Graphic.extend({

	setupBase: function(config) {
		this._appendBaseClass('PortletCanvas');
		this._super(config);
	},
	
	setupDomObject: function(config)	{
		this._super(config);
		this.access().addClass('portlet');
		this.access().addClass('portlet-canvas');
	}
});

/**
 * @class An interface for all portlets.
 * A portlet is a pluggable UI components that is managed
 * and rendered by JOO framework. A portlet is independent
 * from the rest of the application.
 * @interface
 */
PortletInterface = InterfaceImplementor.extend({
	implement: function(obj)	{
		
		obj.prototype.toString = obj.prototype.toString || function() {
			return this.getName();
		};
		
		/**
		 * Get the name of the portlet. By default, it equals to the className of the
		 * portlet.
		 * @methodOf PortletInterface#
		 * @name getName
		 * @returns {String} The name of the portlet.
		 */
		obj.prototype.getName = obj.prototype.getName || function()	{
			return this.className;
		};
		
		/**
		 * Called automatically by JOO framework when the portlet is initialized.
		 * @methodOf PortletInterface#
		 * @name onBegin
		 */
		obj.prototype.onBegin = obj.prototype.onBegin || function(){};
		
		/**
		 * Called automatically by JOO framework when the portlet is loaded into DOM.
		 * @methodOf PortletInterface#
		 * @name run
		 */
		obj.prototype.run = obj.prototype.run || function(){};
		
		/**
		 * Called automatically by JOO framework when the portlet is reloaded.
		 * @methodOf PortletInterface#
		 * @name onReloadPage
		 */
		obj.prototype.onReloadPage = obj.prototype.onReloadPage || function()	{};
		
		/**
		 * Called automatically by JOO framework when the portlet is no longer needed.
		 * @methodOf PortletInterface#
		 * @name onEnd
		 */
		obj.prototype.onEnd = obj.prototype.onEnd || function(){};
		
		/**
		 * Get the placeholder (container) of the portlet.
		 * @methodOf PortletInterface#
		 * @name getPortletPlaceholder
		 * @returns {PortletPlaceholder} the placeholder of the portlet
		 */
		obj.prototype.getPortletPlaceholder = obj.prototype.getPortletPlaceholder || function()	{
			return this.placeholder;
		};
		
		/**
		 * Change the placeholder (container) of the portlet.
		 * This method is not intended to be used by developers.
		 * @methodOf PortletInterface#
		 * @name setPortletPlaceholder
		 * @param {PortletPlaceholder} plhd the new placeholder of the portlet
		 */
		obj.prototype.setPortletPlaceholder = obj.prototype.setPortletPlaceholder || function(plhd)	{
			this.placeholder = plhd;
		};
		
		/**
		 * Get the page instance
		 * @methodOf PortletInterface#
		 * @name getPage
		 * @returns {Page} the page instance
		 */
		obj.prototype.getPage = obj.prototype.getPage || function()	{
			return SingletonFactory.getInstance(Page);
		};
		
		/**
		 * Get the init parameters of the portlet. These parameters are
		 * usually configured in a <code>layout.txt</code>
		 * @methodOf PortletInterface#
		 * @name getInitParameters
		 * @param {Page} the page instance
		 */
		obj.prototype.getInitParameters = obj.prototype.getInitParameters || function()	{
			if (this.initParams == undefined)
				this.initParams = Array();
			return this.initParams;
		};
		
		/**
		 * Change the init parameters. This method is not intended to be used
		 * by developers.
		 * @methodOf PortletInterface#
		 * @name setInitParameters 
		 * @param {Object} params the init parameters
		 */
		obj.prototype.setInitParameters = obj.prototype.setInitParameters || function(params)	{
			this.initParams = params;
		};
		
		/**
		 * Get the current request
		 * @methodOf PortletInterface#
		 * @name getRequest
		 * @param {Request} the current request
		 */
		obj.prototype.getRequest = obj.prototype.getRequest || function()	{
			return this.getPage().getRequest();
		};
		
		obj.prototype.requestForMatchingEffectiveResource = obj.prototype.requestForMatchingEffectiveResource || function(resourceName, condition)	{
			var app = SingletonFactory.getInstance(Application);
			var rm = app.getResourceManager();
			return rm.requestForCustomResource("#effective-area #"+this.getName()+"-"+resourceName+" "+condition);
		};
		
		/**
		 * Get the portlet resource. This resource resides in the portlet template
		 * and is not visible to users.
		 * @methodOf PortletInterface#
		 * @name getPortletResource
		 * @param resourceName the name (or ID) of the resource
		 * @returns {Resource} the portlet (means template) resource with matching name
		 */
		obj.prototype.getPortletResource = obj.prototype.getPortletResource || function(resourceName)	{
			var app = SingletonFactory.getInstance(Application);
			var rm = app.getResourceManager();
			return rm.requestForCustomResource("#"+this.getName()+"-RootData #"+this.getName()+"-"+resourceName);
		};
		
		/**
		 * Get the portlet DOM resource. This resource resides in the portlet rendered
		 * content and is visible to users.
		 * @methodOf PortletInterface#
		 * @name getDomResource
		 * @param resourceName the name of the resource
		 * @returns {Resource} the DOM (means rendered) resource with matching name
		 */
		obj.prototype.getDomResource = obj.prototype.getDomResource || function(resourceName)	{
			var app = SingletonFactory.getInstance(Application);
			var rm = app.getResourceManager();
			return rm.requestForCustomResource("#effective-area #"+this.getName()+"-"+resourceName);
		};
		
		/**
		 * Get the <code>HTML ID</code> of a resource by its name.
		 * @methodOf PortletInterface#
		 * @name getResourceID
		 * @param resourceName the name of the resource
		 * @returns {String} the ID of the resource with matching name
		 */
		obj.prototype.getResourceID = obj.prototype.getResourceID || function(resourceName)	{
			return this.getName()+"-"+resourceName;
		};
		
		/**
		 * Get a localized text.
		 * @methodOf PortletInterface#
		 * @name getLocalizedText
		 * @param resourceName the name of the text
		 * @returns {String} the localized text
		 */
		obj.prototype.getLocalizedText = obj.prototype.getLocalizedText || function(resourceName)	{
			var app = SingletonFactory.getInstance(Application);
			var rm = app.getResourceManager();
			var res = rm.requestForResource(this.getName(), "Text"+resourceName);
			if (res == undefined)
				return undefined;
			return res.html();
		};
		
		/**
		 * Get a localized message. A message can be parameterized.
		 * @methodOf PortletInterface#
		 * @name getLocalizedMessage
		 * @param resourceName the name of the message
		 * @returns {String} the localized message
		 */
		obj.prototype.getLocalizedMessage = obj.prototype.getLocalizedMessage || function(resourceName)	{
			var app = SingletonFactory.getInstance(Application);
			var rm = app.getResourceManager();
			var res = rm.requestForResource(this.getName(), "Message"+resourceName);
			if (res == undefined)
				return undefined;
			var unresolved = res.html();
			
			var resolved = unresolved;
			//resolved string pattern
			for(var i=1;i<arguments.length;i++)	{
				resolved = resolved.replace("%"+i, arguments[i]);
			}
			return resolved;
		};
	}
});

/**
 * @class An interface for all components which need rendering.
 * The <code>RenderInterface</code> is commonly used in 
 * user-defined <code>Portlet</code>. Note that a component can
 * have multiple extra views besides the main view. In this case,
 * developers should use <code>renderView</code> method.
 * @interface
 */
RenderInterface = InterfaceImplementor.extend({
	
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
			return JOOUtils.tmpl(this.viewId, this.model);
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
			return JOOUtils.tmpl((this.viewId || this.getName())+"-"+view, model);
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

PortletPlaceholder = Class.extend(
/** @lends PortletPlaceholder# */		
{

	/**
	 * @class A placeholder to store a single portlet.
	 * It acts as a bridge between Portlet and {@link PortletCanvas}
	 * @augments Class
	 * @param canvas the portlet canvas
	 * @constructs
	 */
	init: function(canvas)	{
		this.canvas = canvas;
	},
	
	/**
	 * Add an object to the canvas
	 * @param {Object} object the object to be added
	 */
	addToCanvas: function(object)	{
		this.canvas.addChild(object);
	},
	
	/**
	 * Clear everything and repaint the canvas
	 * @param {String} html the HTML data to be painted
	 */
	paintCanvas: function(html)	{
		this.canvas.repaint(html);
		var subject = SingletonFactory.getInstance(Subject);
		subject.notifyEvent('HtmlUpdated');
	},
	
	/**
	 * Append to the canvas
	 * @param {String} html the HTML data to be appended
	 */
	drawToCanvas: function(html)	{
		this.canvas.paint(html);
		var subject = SingletonFactory.getInstance(Subject);
		subject.notifyEvent('HtmlUpdated');
	},
	
	/**
	 * Access the underlying canvas
	 * @returns {PortletCanvas} the portlet canvas
	 */
	getCanvas: function()	{
		return this.canvas;
	},
	
	toString: function() {
		return "PortletPlaceholder";
	}
});

PortletContainer = Class.extend(
/** @lends PortletContainer# */
{
	/**
	 * @class A container which maintains and controls multiple portlets
	 * @singleton
	 * @augments Class
	 * @constructs
	 */
	init: function()	{
		if(PortletContainer.singleton == undefined){
			throw "Singleton class";
			return undefined;
		}
		this.portlets = Array();
	},
	
	/**
	 * Add a portlet to this container and initialize it
	 * @param {PortletInterface} portlet the portlet to be added
	 * @param {Object} item portlet metadata
	 */
	addPortlet: function(portlet, item)	{
		var portletMeta = {};
		for(var i in item)	{
			portletMeta[i] = item[i];
		}
		portletMeta.portlet = portlet;
		if (portletMeta.order == undefined)
			portletMeta.order = '';
		portletMeta.loaded = false;
		this.portlets.push(portletMeta);
		try 
		{
			portlet.onBegin();
		} 
		catch (err)	{
			log(err);
		}
	},
	
	/**
	 * Move the portlet to another position
	 * @param {Object} portletMeta the metadata associated with the portlet to be moved
	 * @param {String} newPosition the new position, which is the <code>id</code>
	 * of a DOM element
	 */
	movePortlet: function(portletMeta, newPosition)	{
		var portletPosition = new Stage({id: newPosition});
		var portletCanvas = new Stage({id: portletMeta.portlet.getPortletPlaceholder().getCanvas().id});
		this.attachPortletHtml(portletPosition, portletCanvas, portletMeta);
	},
	
	/**
	 * Load all active portlets, execute them synchronously.
	 */
	loadPortlets: function()	{
		for(var i=0;i<this.portlets.length;i++)	{
			var portletMeta = this.portlets[i];
			if (portletMeta.active == true && !portletMeta.loaded)	{
				this.activatePortlet(portletMeta);
				portletMeta.loaded = true;
			}
		}
	},
	
	/**
	 * Get all portlets
	 * @returns {Array} All loaded portlets
	 */
	getPortlets: function()	{
		return this.portlets;
	},
	
	/**
	 * Get portlet metadata using the portlet's name
	 * @param {String} name the portlet's name
	 */
	getPortletMetaByName: function(name)	{
		return this.portlets.map(function(portlet) {
			if (portlet.portlet.getName() == name)
				return portlet;
		});
	},
	
	/**
	 * Get portlet metadata using the portlet's name
	 * @param {String} name the portlet's name
	 */
	getPortletMetaById: function(id)	{
		for(var i=0; i<portlets.length; i++) {
			if (portlet.id == id)
				return portlet;
		}
	},
	
	/**
	 * Remove portlet at the specified position
	 * @param {String} position the position of the portlet to be removed
	 */
	removePortlet: function(position)	{
		var portletMeta = this.portlets[position];
		if (portletMeta != undefined)	{
			this.portlets.splice(position,1);
			portletMeta.portlet.onEnd();
			if (portletMeta.portlet.getPortletPlaceholder())	{
				//console.log("dispose canvas of portlet: "+portletMeta.portlet.getName());
				portletMeta.portlet.getPortletPlaceholder().getCanvas().dispose();
			}
		}
	},
	
	attachPortletHtml: function(portletPosition, portletCanvas, portletMeta)	{
		var jPortletCanvas = portletPosition.access();
		var canvases = jPortletCanvas.find('.portlet.portlet-canvas');

		var found = false;
		for(var i=0;i<canvases.length;i++)	{
			var canvasI = canvases[i];
			if ($(canvasI).attr('order') > portletMeta.order)	{
				portletPosition.addChildBeforePosition(portletCanvas, canvasI);
				found = true;
				break;
			}
		}
		
		if (found == false)	{
			portletPosition.addChild(portletCanvas);
		}
		portletCanvas.setAttribute('order', portletMeta.order);
	},
	
	/**
	 * Activate a portlet.
	 * @param {Object} portletMeta the metadata of the portlet to be activated
	 */
	activatePortlet: function(portletMeta)	{
		var portlet = portletMeta.portlet;
		if (portletMeta.loaded)	{
			return;
		}
		var portletPosition = new Stage({id: portletMeta.position});
		var portletCanvas = new PortletCanvas(portlet.getName());
		this.attachPortletHtml(portletPosition, portletCanvas, portletMeta);
		portletCanvas.setAttribute('portlet', portlet.getName());
		var portletPlaceholder = new PortletPlaceholder(portletCanvas);
		portlet.setPortletPlaceholder(portletPlaceholder);
		portletMeta.loaded = true;
		try 
		{
			portlet.run();
		} 
		catch (err)	{
			log(err);
		}
	},
	
	/**
	 * Deactivate a portlet.
	 * @param {Object} portletMeta the metadata of the portlet to be deactivated
	 */
	deactivatePortlet: function(portletMeta)	{
		var portlet = portletMeta.portlet;
		if (!portletMeta.loaded)	{
			return;
		}
		portletMeta.loaded = false;
		if (portlet.getPortletPlaceholder())	{
			portlet.getPortletPlaceholder().paintCanvas('');
		}
	},
	
	toString: function() {
		return "PortletContainer";
	}
});

/**
 * @class A simple portlet used for rendering
 * @augments Class
 * @implements PortletInterface
 * @implements RenderInterface
 */
RenderPortlet = Class.extend(
/** @lends RenderPortlet# */	
{
	/**
	 * Render and display the portlet.
	 */
	run: function() {
		this.getPortletPlaceholder().paintCanvas(this.render());
	}
}).implement(PortletInterface, RenderInterface);