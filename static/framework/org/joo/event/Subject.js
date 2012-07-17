JOO.define('org.joo.event.Subject',
/** @lends org.joo.event.Subject# */
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
	}
});