GameContextInterface = InterfaceImplementor.extend({
	
	implement: function(obj) {
		obj.prototype.setGame = obj.prototype.setGame || function(game) {
			this.gameContext = game;
		};
		
		obj.prototype.getGame = obj.prototype.getGame || function() {
			return this.gameContext;
		};
	}
});