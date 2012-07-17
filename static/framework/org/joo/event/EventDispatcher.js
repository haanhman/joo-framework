JOO.define('org.joo.event.EventDispatcher',
/**
 * @lends EventDispatcher#
 */	
{
	/**
	 * Create a new EventDispatcher.
	 * @class Base class for all event dispatchers (such as DisplayObject)
	 * @constructs
	 * @augments Class
	 */
	init: function() {
		this.listeners = {};
	},
	
	/**
	 * Add a new listener for a specific event.
	 * @param {String} event the event to be handled. 
	 * @param {Function} handler the event handler. If you want to remove it
	 * at a later time, it must not be an anonymous function
	 */
	addEventListener: function(event, handler) {
		if (this.listeners[event] == undefined) {
			this.listeners[event] = Array();
		}
		this.listeners[event].push(handler);
	},
	
	/**
	 * Dispatch a event.
	 * @param {String} event the event to be dispatched.
	 */
	dispatchEvent: function(event) {
		if (this.listeners && this.listeners[event] != undefined) {
			var handlers = this.listeners[event];
			var args = Array();
			for(var i=1; i<arguments.length; i++) {
				args.push(arguments[i]);
			}
			for(var i=0;i<handlers.length;i++) {
				var result = handlers[i].apply(this, args);
				if (result === false)
					return;
			}
		}
	},
	
	/**
	 * Remove a handler for a specific event.
	 * @param {String} event the event of handler to be removed 
	 * @param {Function} handler the handler to be removed
	 */
	removeEventListener: function(event, handler) {
		if (this.listeners && this.listeners[event] != undefined) {
			var index = this.listeners[event].indexOf(handler);
			if (index != -1)
				this.listeners[event].splice(index, 1);
		}
	},
	
	setupBase: function(config) {
		
	}
});