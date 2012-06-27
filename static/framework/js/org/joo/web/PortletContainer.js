JOO.define('org.joo.web.PortletContainer',
/** @lends PortletContainer# */
{
	/**
	 * @class A container which maintains and controls multiple portlets
	 * @singleton
	 * @augments Class
	 * @constructs
	 */
	init: function()	{
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
	}
});