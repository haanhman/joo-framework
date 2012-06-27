/**
 * @class Used for formalizing the observer design pattern,
 * especially in an event-based application
 * @interface
 */
ObserverInterface = InterfaceImplementor.extend({
	
	implement: function(obj)	{
		/**
		 * Called when the observer is notified of an event by the {@link Subject}.
		 * The default implementation forward the request
		 * @methodOf ObserverInterface#
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
		 * Register this observer with the {@link Subject}.
		 * @methodOf ObserverInterface#
		 * @name registerObserver
		 */
		obj.prototype.registerObserver = obj.prototype.registerObserver || function()	{
			var subject = SingletonFactory.getInstance(Subject);
			subject.attachObserver(this);
		};
		
		/**
		 * Unregister this observer with the {@link Subject}.
		 * @methodOf ObserverInterface#
		 * @name unregisterObserver
		 */
		obj.prototype.unregisterObserver = obj.prototype.unregisterObserver || function()	{
			var subject = SingletonFactory.getInstance(Subject);
			subject.detachObserver(this);
		};
	}
});

Subject = Class.extend(
/** @lends Subject# */	
{
	
	/**
	 * Initialize observers
	 * @class <code>Subject</code> is the central of Observer pattern. It maintains a list
	 * of observers, and notifies them automatically of new events. <code>Subject</code> is
	 * a <code>singleton</code> class.
	 * @augments Class
	 * @constructs
	 */
	init: function()	{
		this.observers = Array();
	},
	
	/**
	 * Attach an observer
	 * @param {ObserverInterface} observer the observer to be attached
	 */
	attachObserver: function(observer)	{
		this.observers.push(observer);
	},
	
	/**
	 * Detach an observer
	 * @param {ObserverInterface} observer the observer to be detached
	 */
	detachObserver: function(observer)	{
		if (observer == undefined)
			return;
		var index = this.observers.indexOf(observer);
		if (index > 0)	{
			this.observers.splice(index, 1);
		}
	},
	
	/**
	 * Notify an event to all observers
	 * @param {String} eventName the name of the event which should contains characters only
	 * @param {Object} eventData the data associated with the event
	 */
	notifyEvent: function(eventName, eventData)	{
		var count = 0;
		for(var i=0;i<this.observers.length;i++)	{
			try {
				var result = this.observers[i].notify(eventName, eventData);
				if (result == true)	{
					count++;
				}
			} catch (err)	{
				log(err);
			}
		}
	},
	
	toString: function() {
		return "Subject";
	}
});