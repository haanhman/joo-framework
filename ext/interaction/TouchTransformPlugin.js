UserAgentUtils = {
	isMobile : function() {
		var userAgent = navigator.userAgent;
		var mobileUserAgents = [/iPod/i, /iPhone/i, /Android/i, /BlackBerry/i, /Blazer/i, /SymbianOS/i, /iPad/i];
		var mobileMatchAgents = ['Windows Phone OS', 'Windows CE', 'Opera Mobi'];

		for (var i = 0; i < mobileUserAgents.length; i++) {
			if (userAgent.match(mobileUserAgents[i])) {
				return true;
			}
		}

		for (var i = 0; i < mobileMatchAgents.length; i++) {
			if (userAgent.indexOf(mobileMatchAgents[i]) != -1) {
				return true;
			}
		}

		return false;
	}
}

TouchTransformPlugin = Class.extend({

	onBegin : function() {
		var mobile = UserAgentUtils.isMobile();
		var origin = DisplayObject.prototype.addEventListener;
		var dispatchOrigin = DisplayObject.prototype.dispatchEvent;
		
		if (mobile) {
			DisplayObject.prototype.addEventListener = function() {
				//convert touch events to mouse events in PC
				if (arguments[0] == 'mousedown') {
					arguments[0] = 'touchstart';
				} else if (arguments[0] == 'mouseup') {
					arguments[0] = 'touchend';
					this.touchstarted = false;
				} else if (arguments[0] == 'mousemove') {
					arguments[0] = 'touchmove';
				} else if (arguments[0] == 'click') {
					arguments[0] = 'touchend';
				}
				origin.apply(this, arguments);
			}
			DisplayObject.prototype.dispatchEvent = function(name, e) {
				//convert touch events to mouse events in PC
				if (arguments[0] == 'mousedown' || arguments[0] == 'mousemove') {
					e.originalEvent = e.originalEvent || {};
					e.originalEvent.changedTouches = e.originalEvent.changedTouches || [];
					e.originalEvent.changedTouches[0] = {
						pageX : e.pageX,
						pageY : e.pageY
					};
					e.originalEvent.touches = e.originalEvent.touches || [];
					e.originalEvent.touches[0] = {
						pageX : e.pageX,
						pageY : e.pageY
					};
				}
				dispatchOrigin.apply(this, arguments);
			};
		}
	}
}).implement(PluginInterface); 