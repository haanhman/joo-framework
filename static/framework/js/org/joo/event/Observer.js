/**
 * @class Used for formalizing the observer design pattern,
 * especially in an event-based application
 * @name org.joo.event.Observer
 * @interface
 */
JOO.define('org.joo.event.Observer', {
	
	extend: org.joo.core.InterfaceImplementor,
	
	implement: function(obj)	{
		/**
		 * Called when the observer is notified of an event by the {@link Subject}.
		 * The default implementation forward the request
		 * @methodOf org.joo.event.Observer#
		 * @name notify 
		 * @param {String} eventName the event name
		 * @param {Object} eventData the event data
		 * @returns {Boolean} whether the event is interested by this observer or not.
		 */
		obj.prototype.notify = obj.prototype.notify || function(eventName, eventData)	{
			var methodName = "on"+eventName;
			if (typeof this[methodName] != 'undefined')	{
				var method = this[methodName];
				method.call(this, eventData);
				return true;
			}
			return false;
		};
		
		/**
		 * Register this observer with the {@link org.joo.event.Subject}.
		 * @methodOf org.joo.event.Observer#
		 * @name registerObserver
		 */
		obj.prototype.registerObserver = obj.prototype.registerObserver || function()	{
			var subject = JOO.factory.getInstance(org.joo.event.Subject);
			subject.attachObserver(this);
		};
		
		/**
		 * Unregister this observer with the {@link org.joo.event.Subject}.
		 * @methodOf org.joo.event.Observer#
		 * @name unregisterObserver
		 */
		obj.prototype.unregisterObserver = obj.prototype.unregisterObserver || function()	{
			var subject = JOO.factory.getInstance(org.joo.event.Subject);
			subject.detachObserver(this);
		};
	}
});