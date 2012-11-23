FaceCardPlugin = Class.extend({
	
	onBegin: function() {
		var _self = this;
		this.activeFaceCard = undefined;
		var origin = this.origin = DoubleFaceCard.prototype.setupDomObject;
		DoubleFaceCard.prototype.setupDomObject = function(e) {
			origin.apply(this, arguments);
			this.addEventListener('touchstart', function() {
				if (_self.activeFaceCard != this) {
					if (_self.activeFaceCard && !_self.activeFaceCard.dead) {
						_self.activeFaceCard.access().removeClass('active');
					}
					_self.activeFaceCard = this;
					_self.activeFaceCard.access().addClass('active');
				}
			});
		}
	},
	
	onEnd: function() {
		DoubleFaceCard.prototype.setupDomObject = this.origin;
	}
}).implement(PluginInterface);