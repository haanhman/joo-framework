TouchCompatibilityPlugin = Class.extend({
	
	onBegin: function() {
		var mobile = false;
		if ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i)) || (navigator.userAgent.match(/iPad/i))) {
			mobile = true;
		}
		var origin = DisplayObject.prototype.addEventListener;
		DisplayObject.prototype.addEventListener = function() {
			if (!mobile) {
				//convert touch events to mouse events in PC
				if (arguments[0] == 'touchstart') {
					arguments[0] = 'mousedown';
					this.touchstart = true;
				} else if (arguments[0] == 'touchend') {
					arguments[0] = 'mouseup';
					this.touchstart = false;
				} else if (arguments[0] == 'touchmove') {
					arguments[0] = 'mousemove';
				}
			}
			origin.apply(this, arguments);
		}
		
		var dispatchOrigin = DisplayObject.prototype.dispatchEvent;
		DisplayObject.prototype.dispatchEvent = function(name, e) {
			if (!mobile) {
				//convert touch events to mouse events in PC
				if (arguments[0] == 'mousedown' || arguments[0] == 'mousemove') {
					e.originalEvent = e.originalEvent || {};
					e.originalEvent.changedTouches = e.originalEvent.changedTouches || [];
					e.originalEvent.changedTouches[0] = {
						pageX: e.pageX,
						pageY: e.pageY
					};
					e.originalEvent.touches = e.originalEvent.touches || [];
					e.originalEvent.touches[0] = {
						pageX: e.pageX,
						pageY: e.pageY
					};
				}
			}
			dispatchOrigin.apply(this, arguments);
		};
	}
}).implement(PluginInterface);