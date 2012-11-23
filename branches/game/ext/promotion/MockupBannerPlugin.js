MockupBannerPlugin = Class.extend({
	
	onBegin: function() {
		$('<div style="width: 480px; height: 60px; position: absolute; margin: 0 280px; bottom: 0; background: grey"></div>').appendTo('#Application-Main');
	}
}).implement(PluginInterface);