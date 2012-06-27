JOO.define('org.joo.core.ObjectManager',
/** @lends ObjectManager# */
{
	/**
	 * Initialize fields
	 * @class Manage a set of objects. 
	 * @name org.joo.core.ObjectManager
	 * @augments Class
	 * @constructs
	 */
	init: function()	{
		this.objects = new Array();
		this.context = null;
		this.mainObjects = new Array();
	},

	/**
	 * Register an object to be managed by this
	 * @param {Object} obj the object to register
	 */
	register: function(obj)	{
		this.objects.push(obj);
	},
	
	/**
	 * Register a context
	 * @param {Object} obj the context to register
	 */
	registerContext: function(obj)	{
		this.context = obj;
	},
	
	/**
	 * Register main object.
	 * Main object is the one visualizing the idea, a main object usually is a collection of main image
	 * and other thing support for the display
	 * @param {Object} obj the main object
	 */
	registerMainObjects: function(obj)	{
		this.mainObjects.push(obj);
	},
	
	/**
	 * Retrieve main objects.
	 * @returns {mixed} the main objects
	 */
	getMainObjects: function(){
		return this.mainObjects;
	},

	/**
	 * Remove object from the list.
	 * @param {Object} obj the object to be removed
	 */
	remove: function(obj)	{
		/*
		* remove from display
		*/
		var i = this.findIndex(obj.id);
		if (i != -1)	{
			this.objects.splice(i, 1);
		}
		/*
		* remove from mainObjects array
		*/
		for(var j=0;j<this.mainObjects.length;j++)	{
			if(obj.id == this.mainObjects[j].id)		{
				this.mainObjects.splice(j,1);
			}
		}
	},
	
	/**
	 * Find an object using its ID.
	 * @param {mixed} objId the id of the object to be found
	 * @returns {mixed} the object or undefined
	 */
	find: function(objId)	{
		var i = this.findIndex(objId);
		if (i == -1)
			return undefined;
		return this.objects[i];
	},
	
	/**
	 * Find the index of the object having specific ID
	 * @param {Object} objId the id of the object to be found
	 * @returns {mixed} the index of the object or -1
	 */
	findIndex: function(objId)	{
		for(var i=0;i<this.objects.length;i++)	{
			if (objId == this.objects[i].id)	{
				return i;
			}
		}
		return -1;
	}
});