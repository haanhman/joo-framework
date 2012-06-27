SystemProperty = Class.extend(
/** @lends SystemProperty# */
{
	
	/**
	 * Initialize properties.
	 * @class A class to store system-wide properties
	 * @augments Class
	 * @constructs
	 */
	init: function()	{
		this.properties = Array();
	},
	
	/**
	 * Retrieve the value of a property.
	 * @param {String} property the name of the property to retrieve
	 * @param {Object} defaultValue the default value, used if the property is not found
	 * @returns {mixed} the property value, or the default value or undefined 
	 */
	get: function(property, defaultValue)	{
		var cookieValue = undefined;
		if (typeof $ != 'undefined' && typeof $.fn.cookie != 'undefined')
			cookieValue = $.cookie(property);
		if(cookieValue != undefined){
			return cookieValue;
		}else if(this.properties[property] != undefined){
			return this.properties[property];
		}else {
			return defaultValue;
		}
	},
	
	/**
	 * Store the value of a property.
	 * @param {String} property the name of the property to store
	 * @param {Object} value the new value
	 * @param {Boolean} persistent should the property be stored in cookie for future use
	 */
	set: function(property, value, persistent)	{
		if(!persistent){
			this.properties[property] = value;
		}else{
			$.cookie(property,value,{ expires: 1 });
		}
		var subject = SingletonFactory.getInstance(Subject);
		subject.notifyEvent("SystemPropertyChanged", property);
	},
	
	toString: function() {
		return "SystemProperty";
	}
});

ResourceManager = Class.extend(
/** @lends ResourceManager# */		
{
	/**
	 * Initialize resource locators.
	 * @class Manage resource using the underlying resource locator
	 * @augments Class
	 * @constructs
	 */
	init: function()	{
		this.resourceLocator = new JQueryResourceLocator();
		this.caches = {};
	},
	
	/**
	 * Change the current resource locator.
	 * @param {ResourceLocator} locator the resource locator to be used
	 */
	setResourceLocator: function(locator)	{
		this.resourceLocator = locator;
	},
	
	/**
	 * Get the current resource locator.
	 * @returns {ResourceLocator} the current resource locator
	 */
	getResourceLocator: function(locator)	{
		return this.resourceLocator;
	},
	
	/**
	 * Ask the underlying resource locator for a specific resource
	 * @param {String} type used as a namespace to distinct different resources with the same name
	 * @param {String} name the name of the resource
	 * @param {ResourceLocator} resourceLocator Optional. The resource locator to be used in the current request
	 * @param {Boolean} cache Optional. Should the resource be cached for further use
	 * @returns {Resource} the located resource
	 */
	requestForResource: function(type, name, resourceLocator, cache)	{
		if (type != undefined)
			name = type+"-"+name;
		
		if (cache && this.caches[name]) {
//			console.log('cache hit: '+name);
			return this.caches[name];
		}
		
		var rl = resourceLocator || this.resourceLocator;
		var res = rl.locateResource(name);
		if (cache)
			this.caches[name] = res;
		return res;
	},
	
	/**
	 * Ask the underlying resource locator for a custom resource
	 * @param {String} customSelector the selector used to retrieve the resource, depending on underlying the resource locator
	 * @param {Resource} resourceLocator Optional. The resource locator to be used in the current request
	 * @returns {Resource} the located resource
	 */
	requestForCustomResource: function(customSelector, resourceLocator)	{
		if (resourceLocator != undefined)	{
			return resourceLocator.locateResource(customSelector);
		}
		return this.resourceLocator.locateCustomResource(customSelector);
	},
	
	toString: function() {
		return "ResourceManager";
	}
});

/**
 * @class Locate resource
 * @augments Class
 */
ResourceLocator = Class.extend(
/** @lends ResourceLocator# */
{
	
	/**
	 * Locate a resource based on its ID.
	 * By default, this function do nothing
	 * @param {String} resourceID the resource ID
	 */
	locateResource: function(resourceID)	{
		
	}
});

/**
 * Create a new XuiResourceLocator
 * @class A simple resource locator which using xui.js library
 * @augments ResourceLocator
 */
XuiResourceLocator = ResourceLocator.extend(
/** @lends XuiResourceLocator# */		
{
	locateResource: function(id)	{
		if (JOOUtils.isTag(id))
			return x$(id);
//		if (x$('#'+id).length > 0)	{
			return x$('#'+id);
//		}
//		return undefined;
	},

	/**
	 * Locate a resource using a custom selector
	 * @param {String} custom the custom selector
	 * @returns {Resource} the located resource
	 */
	locateCustomResource: function(custom)	{
//		if (x$(custom).length > 0)	{
			return x$(custom);
//		}
//		return undefined;
	}
});

/**
 * Create a new JQueryResourceLocator
 * @class JQuery Resource Locator.
 * @augments ResourceLocator
 */
JQueryResourceLocator = ResourceLocator.extend(
/** @lends JQueryResourceLocator# */
{
	locateResource: function(id)	{
		if (JOOUtils.isTag(id))
			return $(id);
//		if ($('#'+id).length > 0)	{
			return $('#'+id);
//		}
//		return undefined;
	},
	
	/**
	 * Locate resource based on the custom selector
	 * @param {String} custom the custom selector
	 * @returns {Resource} the located resource
	 */
	locateCustomResource: function(custom)	{
//		if ($(custom).length > 0)	{
			return $(custom);
//		}
//		return undefined;
	}
});

//JQuery Horizontal alignment plugin
//(function ($) { $.fn.vAlign = function() { return this.each(function(i){ var h = $(this).height(); var oh = $(this).outerHeight(); var mt = (h + (oh - h)) / 2; $(this).css("margin-top", "-" + mt + "px"); $(this).css("top", "50%"); $(this).css("position", "absolute"); }); }; })(jQuery); (function ($) { $.fn.hAlign = function() { return this.each(function(i){ var w = $(this).width(); var ow = $(this).outerWidth(); var ml = (w + (ow - w)) / 2; $(this).css("margin-left", "-" + ml + "px"); $(this).css("left", "50%"); $(this).css("position", "absolute"); }); }; })(jQuery);

ObjectManager = Class.extend(
/** @lends ObjectManager# */
{
	/**
	 * Initialize fields
	 * @class Manage a set of objects. 
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

Application = Class.extend(
/** @lends Application# */
{
	/**
	 * Initialize fields
	 * @class This class is the entrypoint of JOO applications. 
	 * @singleton
	 * @augments Class
	 * @constructs
	 * @see SingletonFactory#getInstance
	 */
	init: function()	{
		if(Application.singleton == undefined){
			throw "Singleton class, can not be directly created !";
			return undefined;
		}
		this.systemProperties = new SystemProperty();
		this.resourceManager = new ResourceManager();
	},
	
	/**
	 * Access the application's resource manager
	 * @returns {ResourceManager} the application's resource manager
	 */
	getResourceManager: function()	{
		return this.resourceManager;
	},
	
	/**
	 * Change the application's resource manager
	 * @param {ResourceManager} rm the resource manager to be used
	 */
	setResourceManager: function(rm)	{
		this.resourceManager = rm;
	},
	
	/**
	 * Get the system properties array
	 * @returns {SystemProperty} the system properties
	 */
	getSystemProperties: function()	{
		return this.systemProperties;
	},
	
	/**
	 * Change the bootstrap of the application
	 * @returns {Bootstrap} bootstrap the bootstrap of the application
	 */
	setBootstrap: function(bootstrap)	{
		this.bootstrap = bootstrap;
	},
	
	/**
	 * Start the application. This should be called only once
	 */
	begin: function()	{
		this.bootstrap.run();
	},

	/**
	 * Get the application's object manager
	 * @returns {ObjectManager} the application's object manager
	 */
	getObjectManager: function()	{
		if (this.objMgr == undefined)
			this.objMgr = new ObjectManager();
		return this.objMgr;
	}
});

/**
 * @class Access object in a singleton way
 */
SingletonFactory = function(){};

/**
 * Get singleton instance of a class.
 * @methodOf SingletonFactory
 * @param {String} classname the className
 * @returns the instance
 */
SingletonFactory.getInstance = function(classname){
	if(classname.instance == undefined){
		classname.singleton = 0;
		classname.instance = new classname();
		classname.singleton = undefined;
	}
	return classname.instance;
};

/**
 * @class Base class of all "interfaces"
 */
InterfaceImplementor = Class.extend(
/** @lends InterfaceImplementor# */	
{
	init: function(){
		
	},

	/**
	 * Implement a class. Subclass should modify the <code>prototype</code>
	 * of the class to add new features. See source code of subclass for 
	 * more details
	 * @param {Class} obj the class to be implemented
	 */
	implement: function(obj)	{
		
	}
});

/**
 * @class Used to wrap class using interface
 * Wrapper allows developers to implement an interface for a class at runtime.
 */
Wrapper = 
/** @lends Wrapper */
{
	/**
	 * Wrap a class with specific interface.
	 * @param {Class} obj the class to be wrapped
	 * @param {InterfaceImplementor} i the interface to be implemented
	 */
	wrap: function(obj, i) {
		obj.currentClass.implement(i);
	}
};

/**
 * @class This interface make instances of a class cloneable
 * @interface
 */
CloneableInterface = InterfaceImplementor.extend({
	
	implement: function(obj) {
		/**
		 * Clone the current object.
		 * @methodOf CloneableInterface#
		 * @name clone
		 * @returns {Object} the clone object 
		 */
		obj.prototype.clone = obj.prototype.clone || function() {
			var json = JSON.stringify(this);
			return JSON.parse(json);
		};
	}
});