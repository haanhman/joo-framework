xui.extend({
	/**
	 * Adds more DOM nodes to the existing element list.
	 */
	add: function(q) {
	  [].push.apply(this, slice(xui(q)));
	  return this.set(this.reduce());
	},

	/**
	 * Pops the last selector from XUI
	 */
	end: function () {	
		return this.set(this.cache || []);	 	
	},
  
	/**
	 * Sets the `display` CSS property to `block`.
	 */
	show: function() {
		return this.setStyle('display','block');
	},
 
  /**
	 * Sets the `display` CSS property to `none`.
	 */
	hide: function() {
		return this.setStyle('display','none');
	},
  
	appendTo: function(obj) {
		return obj[0].appendChild(this[0]);
	},
  
	width: function() {
		if (this[0] == window)
			return this[0].innerWidth;
		var w = this.css('width');
		if (w.indexOf('px') != -1)
			return w.substring(0, w.length-2);
		return w;
	},
	
	height: function() {
		if (this[0] == window)
			return this[0].innerHeight;
		var h = this.css('height');
		if (h.indexOf('px') != -1)
			return h.substring(0, h.length-2);
		return h;
	},
	
	bind: function(types, fn) {
		var t = types.split(' ');
		for(var i in t) {
			this.on(t[i], fn);
		}
	},
	
	prepend: function(html) {
		return this.html("top", html);
	}
});