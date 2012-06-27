JOO.define('org.joo.web.Page',
/** @lends org.joo.web.Page# */
{
	/**
	 * Initialize fields
	 * @class org.joo.web.Page is a class for attaching portlets to appropriate position.
	 * Page manages the display, the {@link org.joo.web.PluginManager} & the {@link org.joo.web.PortletContainer}.
	 * @name org.joo.web.Page
	 * @augments Class
	 * @constructs
	 */
	init: function(){
		if(org.joo.web.Page.singleton == undefined){
			throw "Page is Singleton !";
			return undefined;
		}
		this.portletContainer = JOO.factory.getInstance(org.joo.web.PortletContainer);
		this.pluginManager = JOO.factory.getInstance(org.joo.web.PluginManager);
		this.pagename = "";
		this.title = "";
		this.cache = {};
	},
	
	/**
	 * Adds & loads portlets to the page.
	 * It will also handle portlets lifecycle. Portlets which are no longer needed
	 * will be unloaded. Portlets which exists between multiple pages will be
	 * reloaded.
	 */
	attachPortlets: function(){
		/*
		 * check for consistency with layout in here
		 * + portlet existence
		 * + portlet position
		 * + portlet active (?)
		 */
		for( var item in this.layout ){
			item = this.layout[item];
			if(item.active == undefined){
				item.active = true;
			}
			if (item.params == undefined)	{
				item.params = Array();
			}
			var existed = false;
			for( var i=0; i<this.portletContainer.portlets.length; i++ )	{
				item.id = item.id || item.portlet;
				var portletMeta = this.portletContainer.portlets[i];
				if( item.id === portletMeta.id ){
					existed = true;
					portletMeta.portlet.setInitParameters(item.params);
					if( item.position === portletMeta.position ){
						if( item.active !== portletMeta.active ){
							portletMeta.active = item.active;
							// FIXME: portletMeta.portlet.active ~> something like this must be implemented
						}
					}else{
						portletMeta.position = item.position;
						this.portletContainer.movePortlet(portletMeta,item.position);
					}
					if ( item.active == true)	{
						//portlet need reload?
						try {
							portletMeta.portlet.onReloadPage();
						} catch (err)	{
							log(err);
						}
					}
					break;
				}
			}
			if(!existed){
				if (window[item.portlet] == undefined)	{
					log('portlet '+item.portlet+' is undefined');
				} else {
					var portlet = new window[item.portlet]();
					portlet.setInitParameters(item.params);
					this.portletContainer.addPortlet(portlet,item);
				}
			}
		}
		var portletsToRemoved = Array();
		for( var i=0; i<this.portletContainer.portlets.length; i++ )	{
			var portletMeta = this.portletContainer.portlets[i];
			var keep = false;
			for(var item in this.layout){
				item = this.layout[item];
				if( item.id === portletMeta.id ){
					if (item.active == false)	{
						this.portletContainer.deactivatePortlet(portletMeta);
					}
					keep = true;
					break;
				}
			}
			if(!keep){
				portletsToRemoved.push(portletMeta);
			}
		}
		for(var i=0;i<portletsToRemoved.length;i++)	{
			var plt = portletsToRemoved[i];
			var indexOf = this.portletContainer.portlets.indexOf(plt);
			this.portletContainer.removePortlet(indexOf);
		}
	},
	
	/**
	 * Parse the layout for a specific page.
	 * @param {String} pagename the name of the page
	 * @returns {Object} the layout of the page
	 */
	generateData: function(pagename) {
		if (this.cache[pagename]) return this.cache[pagename];
		var data = {};
		var tmp = {};

		if (pagename == undefined)	{
			throw {"Exception": "NotFound", "Message": "Page name is undefined"};
			return undefined;
		}
		var app = JOO.factory.getInstance(org.joo.Application);
		var jsonObj = app.getResourceManager().requestForResource("portlets", pagename, undefined, true);
		if (jsonObj == undefined)	{
			//console.error(pagename+' not exist!');
			throw {"Exception": "NotFound", "Message": 'Page name "'+pagename+'" not found!'};
			return undefined;
		}
		this.title = jsonObj.attr('title');
		
		var jsonText = jsonObj.html();
		tmp = eval("("+jsonText+")");
		data.parent = tmp.parent;
		data.plugins = tmp.plugins;
		data.layout = tmp.portlets;
		var i,j;
		var toAddPlugins = new Array();
		var toAddPortlets = new Array();
		while(data.parent != undefined) {
			jsonObj = app.getResourceManager().requestForResource("portlets",data.parent, undefined, true);
			if (jsonObj == undefined)	{
				//console.error(data.parent+' not exist!');
				throw {"Exception": "NotFound", "Message": '(Parent)Page name "'+data.parent+'" not found!'};
				return undefined;
			}
			jsonText = jsonObj.html();
			toAddPlugins = new Array();
			toAddPortlets = new Array();
			tmp = eval("("+jsonText+")");
			for( i=0; i<tmp.plugins.length; i++ )	{
				var existed = false;
				for( j=0; j<data.plugins.length; j++ )	{
					if(tmp.plugins[i].plugin == data.plugins[j].plugin){
						existed = true;
						break;
					}
				}
				if(!existed){
					toAddPlugins.push(tmp.plugins[i]);
				}
			}
			for( i=0; i<tmp.portlets.length; i++ )	{
				var existed = false;
				for( j=0; j<data.layout.length; j++ )	{
					if(tmp.portlets[i].portlet == data.layout[j].portlet){
						existed = true;
						break;
					}
				}
				if(!existed){
					toAddPortlets.push(tmp.portlets[i]);
				}
			}
			for( i=0;i<toAddPlugins.length;i++ ){
				data.plugins.push(toAddPlugins[i]);
			}
			for( i=0;i<toAddPortlets.length;i++ ){
				data.layout.push(toAddPortlets[i]);
			}
			data.parent = tmp.parent;
		}
		/*
		if(tmp.position != undefined){
			data.template = app.getResourceManager().requestForResource("page",pagename).html();
			data.position = tmp.position;
		}
		*/
		this.cache[pagename] = data;
		return data;
	},
	
	/**
	 * Get the current request.
	 * @returns {Request} the current request
	 */
	getRequest: function(){
		return this.request;
	},
	
	/**
	 * Change the current request.
	 * This method <b>should not</b> be called by developers
	 * @param {Request} request the new request
	 */
	setRequest: function(request){
		this.request = request;
	},
	
	/**
	 * Attach plugins to the page. 
	 * Plugins are treated the same way as portlets.
	 */
	attachPlugins: function(){
		var oldPlugins = this.pluginManager.getPlugins();
		for(var i in oldPlugins)	{
			var oldPlg = oldPlugins[i];
			oldPlg.keep = false;
		}
		
		for (var j in this.plugins)	{
			var newPlg = this.plugins[j];
			//check if the plugin exists
			var existed = false;
			for(var i=0; i<oldPlugins.length; i++)	{
				existed = false;
				var oldPlg = oldPlugins[i];
				if (oldPlg.getName() == newPlg.plugin)	{
					oldPlg.setInitParameters(newPlg.params);
					oldPlg.keep = true;
					existed = true;
					break;
				}
			}
			if (!existed)	{
				if(window[newPlg.plugin] == undefined){
					
				} else {
					var plugin = new window[newPlg.plugin];
					plugin.setInitParameters(newPlg.params);
					plugin.keep = true;
					this.pluginManager.addPlugin(plugin, eval(newPlg.delay));
				}
			}
		}
		
		//find plugins that need to be removed
		var pluginsToRemoved = Array();
		for(var i in oldPlugins){
			var oldPlg = oldPlugins[i];
			if (oldPlg.keep != true)	{
				//console.log('plugin removed: '+oldPlg.getName());
				pluginsToRemoved.push(oldPlg);
			}
		}
		
		//removed unused plugins
		for(var i=0;i<pluginsToRemoved.length;i++)	{
			var plg = pluginsToRemoved[i];
			var indexOf = this.pluginManager.getPlugins().indexOf(plg);
			this.pluginManager.removePlugin(indexOf);
		}
		
		JOOUtils.generateEvent('ReloadPlugin');
//		//console.log('newplugin', this.pluginManager.getPlugins());
	},
/*
	attachTemplate: function(){
		if(this.position != undefined){
				//console.log("attachTemplate");
				this.temp = new Array();
				for(var i in $("#"+this.position).children()){
					if(!isNaN(i)){
						var obj = $($("#"+this.position).children()[i]);
						obj.detach();
						this.temp.push(obj);
					}
				}
				//console.log("position:"+this.position);
				$("#"+this.position).html(this.template);
		}
	},
	
	wrapUpDisplay: function(){
		if(this.position != undefined){
			var tmp = new Array();
			for(var i in $("#"+this.position).children()){
				if(!isNaN(i)){
					var obj = $($("#"+this.position).children()[i]);
					obj.detach();
					tmp.push(obj);
				}
			}
			
			$("#"+this.position).html(tmp);
		}
	},
*/
	
	/**
	 * Called when the page begins its routine.
	 * Parse the layout and attach plugins.
	 * @param {String} pagename the page name
	 */
	onBegin: function(pagename)	{
		var data = this.generateData(pagename);
		if (data == undefined)
			return;
		this.pagename = pagename;
		this.layout = data.layout;
		this.plugins = data.plugins;
		this.attachPlugins();
		JOOUtils.generateEvent("PageBegan");
	},
	
	/**
	 * Execute the page, attach portlets.
	 */
	run: function()	{
		/*
		this.attachTemplate();
		*/
		this.attachPortlets();
		JOOUtils.generateEvent("AllPorletAdded");
		this.portletContainer.loadPortlets();
		JOOUtils.generateEvent("AllPorletLoaded");
		/*
		this.wrapUpDisplay();
		*/
	},
	
	onEnd: function()	{
		
	},
	
	dispose: function()	{
		
	}
});