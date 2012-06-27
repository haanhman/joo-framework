JOO = JOO || {};

JOO.provide = JOO.provide || function(packageName) {
	var path = className.split('.');
	var obj = window;
	for(var i=0; i<path.length; i++) {
		obj[path[i]] = obj[path[i]] || {};
		obj = obj[path[i]];
	}
};

JOO.parseNamespace = function(className, create) {
	var path = className.split('.');
	
	var data = {};
	data.namespaceStr = "";
	data.namespace = window;
	data.className = undefined;
	
	for(var i=0; i<path.length-1; i++) {
		if (create) data.namespace[path[i]] = data.namespace[path[i]] || {};
		data.namespace = data.namespace[path[i]];
		if (!data.namespace) return undefined;
		data.namespaceStr += path[i];
	}
	data.className = path[path.length-1];
	return data;
};

JOO.getDefinition = function(className) {
	var data = JOO.parseNamespace(className);
	return (data ? data.namespace[data.className] : undefined);
};

JOO.define = JOO.define || function(className, definition) {
	var cls = definition.extend || Class;
	cls = cls.extend(definition);
	
	var nsData = JOO.parseNamespace(className, true);
	cls.prototype.namespace = nsData.namespaceStr;
	cls.prototype.className = nsData.className;
	cls.prototype.toString = function() {
		return this.className;
	};
	nsData.namespace[nsData.className] = cls;
	return cls;
};

JOO.factory = JOO.factory || {};
JOO.factory.getInstance = function(classname) {
	if(classname.instance == undefined){
		classname.singleton = 0;
		classname.instance = new classname();
		classname.singleton = undefined;
	}
	return classname.instance;
};