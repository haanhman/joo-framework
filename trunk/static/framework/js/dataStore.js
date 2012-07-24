DataStore = Class.extend({
	
	init: function() {
		this.stores = {};
	},
	
	registerStore: function(namespace, storeType, options) {
		options.type = storeType;
		options.data = options.data || undefined;
		options.lastAccess = options.lastAccess || undefined;
		this.initStoreType(storeType, options);
		this.stores[namespace] = options;
	},
	
	deregisterStore: function(namespace) {
		var store = this.getStore(namespace);
		if (store) {
			store.dispose();
			this.stores[namespace] = undefined;
		}
	},
	
	initStoreType: function(type, options) {
		var dataStoreType = 'DataStore'+type;
		if (typeof window[dataStoreType] == 'undefined')
			throw new Error('Data Store is undefined: ' + dataStoreType);
		var dataStore = new window[dataStoreType](options);
		options.dataStore = dataStore;
	},
	
	getStore: function(namespace) {
		return this.stores[namespace];
	},
	
	fetch: function(namespace, key) {
		var store = this.stores[namespace];
		return store.dataStore.fetch(key);
	},
	
	store: function(namespace, key, value) {
		var store = this.stores[namespace];
		return store.dataStore.store(key, value);
	}
});

DataStoreDom = Class.extend({
	
	init: function(options) {
		this.options = options;
		this.data = eval('('+JOOUtils.access(this.options.id).html()+')');
	},

	fetch: function(key) {
		return ExpressionUtils.express(this.data, key);
	},
	
	store: function(key, value) {
		ExpressionUtils.expressSetter(this.data, key, value);
	},
	
	dispose: function() {
		this.data = undefined;
	}
});