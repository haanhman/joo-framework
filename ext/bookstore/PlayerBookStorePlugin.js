PlayerBookStorePlugin = Class.extend({
	
	onBegin: function() {
		this.stage = new Stage({id: 'main'});
	},
	
	onLoadCurrentPage: function() {
		if (this.store) {
			var _self = this;
			setTimeout(function() {
				_self.stage.removeChild(_self.store);
				_self.store = undefined;
			}, 3000);
		}
	},
	
	onOpenStore: function() {
		if (!this.store) {
			this.store = new PlayerBookstore();
			this.stage.addChild(this.store);
		}
		this.stage.access().show();
		this.store.show();
	},
	
	onEnd: function() {
		this.store.selfRemove();
	}
}).implement(PluginInterface);