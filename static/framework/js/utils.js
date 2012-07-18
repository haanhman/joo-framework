/**
 * 
 */

utils_items = {};

/**
 * Generate an unique ID
 * @param {String} type the type used for generation
 * @returns an unique ID
 */
function generateId(type)	{
	if (!isPropertySet(utils_items, type))	{
		setProperty(utils_items, type, 0);
	}
	setProperty(utils_items, type, getProperty(utils_items, type)+1);
	return type+"-"+getProperty(utils_items, type);
}

function setProperty(obj, prop, val)	{
	obj.prop = val;
}

function getProperty(obj, prop)	{
	return obj.prop;
}

function isPropertySet(obj, prop)	{
	if (typeof obj.prop != 'undefined')	{
		return true;
	}
	return false;
}

Array.max = function( array ){
    return Math.max.apply( Math, array );
};
Array.min = function( array ){
    return Math.min.apply( Math, array );
};

Array.nextBigger = function( array,val ){
	var result = Number.MAX_VALUE;
	for(var i=0; i < array.length; i++){
		if(array[i] > val && array[i] < result){
			result = array[i];
		}
	}
	return result;
};

Array.nextLess = function( array,val ){
	var result = Number.MIN_VALUE;
	for(var i=0; i < array.length; i++){
		if(array[i] < val && array[i] > result){
			result = array[i];
		}
	}
	return result;
};

if(!Array.prototype.indexOf){
	Array.prototype.indexOf = function(val){
		for(var i=0;i<this.length;i++){
			if(val == this[i]){
				return i;
			}
		}
		return -1;
	};
}

function trimOff(txt, maxLen)	{
	txt = txt.trim();
	if (txt.length > maxLen)	{
		txt = txt.substr(0, maxLen);
		var lastIndexOf = txt.lastIndexOf(' ');
		if (lastIndexOf != -1)
			txt = txt.substr(0, lastIndexOf)+'...';
	}
	return txt;
}

function log(msg, omitStackTrace)	{
	if (window["console"] != undefined)	{
		console.error(msg);
		if (!omitStackTrace) {
			printStackTrace(msg);
		}
	}
}

function printStackTrace(e) {
	var callstack = [];
	var isCallstackPopulated = false;

	console.log('Stack trace: ');
	if (e.stack) { //Firefox
		var lines = e.stack.split('\n');
	    for (var i=0, len=lines.length; i<len; i++) {
//	    	if (lines[i].match(/^\s*[A-Za-z0-9\-_\$]+\(/)) {
//	    		callstack.push(lines[i]);
//	    	} else {
//	    		var index = lines[i].indexOf(')');
//	    		if (index != -1)
//	    			lines[i] = lines[i].substr(index);
	    		callstack.push(lines[i]);
//	    	}
	    }
	    //Remove call to printStackTrace()
	    callstack.shift();
	    isCallstackPopulated = true;
	} else if (window.opera && e.message) { //Opera
		var lines = e.message.split('\n');
		for (var i=0, len=lines.length; i<len; i++) {
			if (lines[i].match(/^\s*[A-Za-z0-9\-_\$]+\(/)) {
				var entry = lines[i];
				//Append next line also since it has the file info
				if (lines[i+1]) {
		            entry += ' at ' + lines[i+1];
		            i++;
				}
				callstack.push(entry);
	        }
		}
	    //Remove call to printStackTrace()
	    callstack.shift();
	}
	if (!isCallstackPopulated) { //IE and Safari
		var currentFunction = arguments.callee.caller;
		while (currentFunction) {
			isCallstackPopulated = true;
			var fn = currentFunction.toString();
		    var fname = fn.substring(fn.indexOf('function') + 8, fn.indexOf('')) || 'anonymous';
		    callstack.push(fname);
		    currentFunction = currentFunction.caller;
		}
	}
	for(var i=0; i<callstack.length; i++) {
		console.log(callstack[i]);
	}
}

MathUtil = {
	
	getDistance: function(s, d) {
		return Math.sqrt(Math.pow(d.y - s.y, 2) + Math.pow(d.x - s.x, 2));
	},
	
	getAngle: function(s, d, deg) {
		var dx = d.x-s.x;
		var dy = d.y-s.y;
		var atan = Math.atan2(dy, Math.abs(dx));
		if (dx < 0) {
			atan = Math.PI - atan;
		}
		if (deg == undefined)
			return atan;
		return atan*180/Math.PI;
	}
};

function getPositionInRotatedcoordinate(old, angle) { //angle in radian
	var a = Math.sqrt(Math.pow(old.x, 2) + Math.pow(old.y, 2));
	var originAngle = Math.atan2(old.y, old.x);
	return {
		x: a*Math.cos(angle-originAngle),
		y: -a*Math.sin(angle-originAngle)
	};
}

function getPositionFromRotatedCoordinate(pos, angle, coef) { // angle in radian
	if (!coef || !(coef.x && coef.y)) coef = {
		x: 0,
		y: 0
	};
	var a = Math.sqrt(Math.pow(pos.x, 2) + Math.pow(pos.y, 2));
	var originAngle = Math.atan2(pos.y, pos.x);
	return {
		x: a*Math.cos(angle+originAngle) + coef.x,
		y: a*Math.sin(angle+originAngle) + coef.y
	};
}

ExpressionUtils = {
		
	express: function(obj, expression) {
		var s = expression ? "obj."+expression : "obj";
		try {
			return eval(s);
		} catch (err) {
			log("Expression failed: "+err);
		}
	},
	
	expressSetter: function(obj, expression, value) {
		if (typeof value == 'string') {
			value = value.replace(/'/g, "\\'");
		}
		var s = "obj."+expression+" = '"+value+"'";
		try {
			eval(s);
		} catch (err) {
			log("Expression failed: "+err);
		}
	},
		
	getMutatorMethod: function(obj, prop) {
		var methodName = "set"+prop.substr(0, 1).toUpperCase()+prop.substr(1);
		return obj[methodName];
	},
	
	getAccessorMethod: function(obj, prop) {
		var methodName = "get"+prop.substr(0, 1).toUpperCase()+prop.substr(1);
		return obj[methodName];
	}
};

JOOUtils = {
		
	isTag: function(q) {
		var testTag = /<([\w:]+)/;
		return testTag.test(q);
	},
	
	getApplication: function() {
		return SingletonFactory.getInstance(Application);
	},
	
	getSystemProperty: function(x) {
		return SingletonFactory.getInstance(Application).getSystemProperties().get(x);
	},
	
	getResourceManager: function() {
		return SingletonFactory.getInstance(Application).getResourceManager();
	},
	
	access: function(name, type, resourceLocator, cached) {
		return SingletonFactory.getInstance(Application).getResourceManager().requestForResource(type, name, resourceLocator, cached);
	},
	
	accessCustom: function(custom, resourceLocator) {
		return SingletonFactory.getInstance(Application).getResourceManager().requestForCustomResource(custom,resourceLocator);
	},
	
	generateEvent: function(eventName, eventData) {
	    var subject = SingletonFactory.getInstance(Subject);
	    subject.notifyEvent(eventName, eventData);
	},
	
	getAttributes: function(element) {
		var attrs = {};
		var attributes = element.attributes;
		for(var i=0; i<attributes.length; i++) {
			attrs[attributes[i].nodeName] = attributes[i].nodeValue;
		}
		return attrs;
	},
	
	requestFullScreen: function() {
		if (document.documentElement.requestFullScreen) {  
			document.documentElement.requestFullScreen();  
	    } else if (document.documentElement.mozRequestFullScreen) {  
	    	document.documentElement.mozRequestFullScreen();  
	    } else if (document.documentElement.webkitRequestFullScreen) {  
	    	document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);  
	    }
	},
	
	cancelFullScreen: function() {
		if (document.cancelFullScreen) {  
			document.cancelFullScreen();  
		} else if (document.mozCancelFullScreen) {  
			document.mozCancelFullScreen();  
		} else if (document.webkitCancelFullScreen) {  
			document.webkitCancelFullScreen();  
		}  
	}
};