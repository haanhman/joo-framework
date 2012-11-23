DefaultGameStage = Stage.extend({
	
	setupDomObject: function(config) {
		this._super(config);
		
		this.ns = 'joo.game.config';
		var dataStore = SingletonFactory.getInstance(DataStore);
		if (!dataStore.getStore(this.ns)) {
			dataStore.registerStore(this.ns, 'Dom', {
				id: 'UIGameConfig'
			});
		}
		var gameUI = this.getConfig('game.ui');
		this.game = new JOOStateGame(gameUI);
		this.addChild(this.game);
	},
	
	getConfig: function(cfg) {
		var dataStore = SingletonFactory.getInstance(DataStore);
		return dataStore.fetch(this.ns, cfg) || {};
	}
});