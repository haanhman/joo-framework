JOO.define('org.joo.cache.Memcached',
/** @lends org.joo.cache.Memcached# */		
{
	/**
	 * Initialize fields.
	 * @class A wrapper of the system properties.
	 * Used for accessing the memcached namespace
	 * @augments Class
	 * @constructs
	 */
	init: function()	{
		this.properties = SingletonFactory.getInstance(Application).getSystemProperties();
	},
	
	/**
	 * Get the actual entry name for the the specified key
	 * @private
	 * @param {String} key the key
	 * @returns {String} the entry name
	 */
	getEntryName: function(key)	{
		return 'memcached.'+key;
	},
	
	/**
	 * Store a value in the specified key.
	 * @param {String} key the key
	 * @param {Object} value the key's value
	 */
	store: function(key, value)	{
		var entry = this.getEntryName(key);
		this.properties.set(entry, value);
	},
	
	/**
	 * Retrieve the value of the specified key.
	 * @param {String} the key
	 * @returns {Object} the value of the key
	 */
	retrieve: function(key)	{
		var entry = this.getEntryName(key);
		return this.properties.get(entry);
	},
	
	/**
	 * Clear the content of the specified key.
	 * @param {key} the key
	 */
	clear: function(key)	{
		var entry = this.getEntryName(key);
		this.properties.set(entry, undefined);
	}
});