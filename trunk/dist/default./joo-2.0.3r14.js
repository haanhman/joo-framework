/*!
 * jQuery JavaScript Library v1.7.1
 * http://jquery.com/
 *
 * Copyright 2011, John Resig
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 * Copyright 2011, The Dojo Foundation
 * Released under the MIT, BSD, and GPL Licenses.
 *
 * Date: Mon Nov 21 21:11:03 2011 -0500
 */
(function( window, undefined ) {

// Use the correct document accordingly with window argument (sandbox)
var document = window.document,
	navigator = window.navigator,
	location = window.location;
var jQuery = (function() {

// Define a local copy of jQuery
var jQuery = function( selector, context ) {
		// The jQuery object is actually just the init constructor 'enhanced'
		return new jQuery.fn.init( selector, context, rootjQuery );
	},

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$,

	// A central reference to the root jQuery(document)
	rootjQuery,

	// A simple way to check for HTML strings or ID strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	quickExpr = /^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/,

	// Check if a string has a non-whitespace character in it
	rnotwhite = /\S/,

	// Used for trimming whitespace
	trimLeft = /^\s+/,
	trimRight = /\s+$/,

	// Match a standalone tag
	rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>)?$/,

	// JSON RegExp
	rvalidchars = /^[\],:{}\s]*$/,
	rvalidescape = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,
	rvalidtokens = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
	rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,

	// Useragent RegExp
	rwebkit = /(webkit)[ \/]([\w.]+)/,
	ropera = /(opera)(?:.*version)?[ \/]([\w.]+)/,
	rmsie = /(msie) ([\w.]+)/,
	rmozilla = /(mozilla)(?:.*? rv:([\w.]+))?/,

	// Matches dashed string for camelizing
	rdashAlpha = /-([a-z]|[0-9])/ig,
	rmsPrefix = /^-ms-/,

	// Used by jQuery.camelCase as callback to replace()
	fcamelCase = function( all, letter ) {
		return ( letter + "" ).toUpperCase();
	},

	// Keep a UserAgent string for use with jQuery.browser
	userAgent = navigator.userAgent,

	// For matching the engine and version of the browser
	browserMatch,

	// The deferred used on DOM ready
	readyList,

	// The ready event handler
	DOMContentLoaded,

	// Save a reference to some core methods
	toString = Object.prototype.toString,
	hasOwn = Object.prototype.hasOwnProperty,
	push = Array.prototype.push,
	slice = Array.prototype.slice,
	trim = String.prototype.trim,
	indexOf = Array.prototype.indexOf,

	// [[Class]] -> type pairs
	class2type = {};

jQuery.fn = jQuery.prototype = {
	constructor: jQuery,
	init: function( selector, context, rootjQuery ) {
		var match, elem, ret, doc;

		// Handle $(""), $(null), or $(undefined)
		if ( !selector ) {
			return this;
		}

		// Handle $(DOMElement)
		if ( selector.nodeType ) {
			this.context = this[0] = selector;
			this.length = 1;
			return this;
		}

		// The body element only exists once, optimize finding it
		if ( selector === "body" && !context && document.body ) {
			this.context = document;
			this[0] = document.body;
			this.selector = selector;
			this.length = 1;
			return this;
		}

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			// Are we dealing with HTML string or an ID?
			if ( selector.charAt(0) === "<" && selector.charAt( selector.length - 1 ) === ">" && selector.length >= 3 ) {
				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = quickExpr.exec( selector );
			}

			// Verify a match, and that no context was specified for #id
			if ( match && (match[1] || !context) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[1] ) {
					context = context instanceof jQuery ? context[0] : context;
					doc = ( context ? context.ownerDocument || context : document );

					// If a single string is passed in and it's a single tag
					// just do a createElement and skip the rest
					ret = rsingleTag.exec( selector );

					if ( ret ) {
						if ( jQuery.isPlainObject( context ) ) {
							selector = [ document.createElement( ret[1] ) ];
							jQuery.fn.attr.call( selector, context, true );

						} else {
							selector = [ doc.createElement( ret[1] ) ];
						}

					} else {
						ret = jQuery.buildFragment( [ match[1] ], [ doc ] );
						selector = ( ret.cacheable ? jQuery.clone(ret.fragment) : ret.fragment ).childNodes;
					}

					return jQuery.merge( this, selector );

				// HANDLE: $("#id")
				} else {
					elem = document.getElementById( match[2] );

					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE and Opera return items
						// by name instead of ID
						if ( elem.id !== match[2] ) {
							return rootjQuery.find( selector );
						}

						// Otherwise, we inject the element directly into the jQuery object
						this.length = 1;
						this[0] = elem;
					}

					this.context = document;
					this.selector = selector;
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || rootjQuery ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return rootjQuery.ready( selector );
		}

		if ( selector.selector !== undefined ) {
			this.selector = selector.selector;
			this.context = selector.context;
		}

		return jQuery.makeArray( selector, this );
	},

	// Start with an empty selector
	selector: "",

	// The current version of jQuery being used
	jquery: "1.7.1",

	// The default length of a jQuery object is 0
	length: 0,

	// The number of elements contained in the matched element set
	size: function() {
		return this.length;
	},

	toArray: function() {
		return slice.call( this, 0 );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {
		return num == null ?

			// Return a 'clean' array
			this.toArray() :

			// Return just the object
			( num < 0 ? this[ this.length + num ] : this[ num ] );
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems, name, selector ) {
		// Build a new jQuery matched element set
		var ret = this.constructor();

		if ( jQuery.isArray( elems ) ) {
			push.apply( ret, elems );

		} else {
			jQuery.merge( ret, elems );
		}

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;

		ret.context = this.context;

		if ( name === "find" ) {
			ret.selector = this.selector + ( this.selector ? " " : "" ) + selector;
		} else if ( name ) {
			ret.selector = this.selector + "." + name + "(" + selector + ")";
		}

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	// (You can seed the arguments with an array of args, but this is
	// only used internally.)
	each: function( callback, args ) {
		return jQuery.each( this, callback, args );
	},

	ready: function( fn ) {
		// Attach the listeners
		jQuery.bindReady();

		// Add the callback
		readyList.add( fn );

		return this;
	},

	eq: function( i ) {
		i = +i;
		return i === -1 ?
			this.slice( i ) :
			this.slice( i, i + 1 );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	slice: function() {
		return this.pushStack( slice.apply( this, arguments ),
			"slice", slice.call(arguments).join(",") );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map(this, function( elem, i ) {
			return callback.call( elem, i, elem );
		}));
	},

	end: function() {
		return this.prevObject || this.constructor(null);
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: push,
	sort: [].sort,
	splice: [].splice
};

// Give the init function the jQuery prototype for later instantiation
jQuery.fn.init.prototype = jQuery.fn;

jQuery.extend = jQuery.fn.extend = function() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
		target = {};
	}

	// extend jQuery itself if only one argument is passed
	if ( length === i ) {
		target = this;
		--i;
	}

	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && jQuery.isArray(src) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend({
	noConflict: function( deep ) {
		if ( window.$ === jQuery ) {
			window.$ = _$;
		}

		if ( deep && window.jQuery === jQuery ) {
			window.jQuery = _jQuery;
		}

		return jQuery;
	},

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Hold (or release) the ready event
	holdReady: function( hold ) {
		if ( hold ) {
			jQuery.readyWait++;
		} else {
			jQuery.ready( true );
		}
	},

	// Handle when the DOM is ready
	ready: function( wait ) {
		// Either a released hold or an DOMready/load event and not yet ready
		if ( (wait === true && !--jQuery.readyWait) || (wait !== true && !jQuery.isReady) ) {
			// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
			if ( !document.body ) {
				return setTimeout( jQuery.ready, 1 );
			}

			// Remember that the DOM is ready
			jQuery.isReady = true;

			// If a normal DOM Ready event fired, decrement, and wait if need be
			if ( wait !== true && --jQuery.readyWait > 0 ) {
				return;
			}

			// If there are functions bound, to execute
			readyList.fireWith( document, [ jQuery ] );

			// Trigger any bound ready events
			if ( jQuery.fn.trigger ) {
				jQuery( document ).trigger( "ready" ).off( "ready" );
			}
		}
	},

	bindReady: function() {
		if ( readyList ) {
			return;
		}

		readyList = jQuery.Callbacks( "once memory" );

		// Catch cases where $(document).ready() is called after the
		// browser event has already occurred.
		if ( document.readyState === "complete" ) {
			// Handle it asynchronously to allow scripts the opportunity to delay ready
			return setTimeout( jQuery.ready, 1 );
		}

		// Mozilla, Opera and webkit nightlies currently support this event
		if ( document.addEventListener ) {
			// Use the handy event callback
			document.addEventListener( "DOMContentLoaded", DOMContentLoaded, false );

			// A fallback to window.onload, that will always work
			window.addEventListener( "load", jQuery.ready, false );

		// If IE event model is used
		} else if ( document.attachEvent ) {
			// ensure firing before onload,
			// maybe late but safe also for iframes
			document.attachEvent( "onreadystatechange", DOMContentLoaded );

			// A fallback to window.onload, that will always work
			window.attachEvent( "onload", jQuery.ready );

			// If IE and not a frame
			// continually check to see if the document is ready
			var toplevel = false;

			try {
				toplevel = window.frameElement == null;
			} catch(e) {}

			if ( document.documentElement.doScroll && toplevel ) {
				doScrollCheck();
			}
		}
	},

	// See test/unit/core.js for details concerning isFunction.
	// Since version 1.3, DOM methods and functions like alert
	// aren't supported. They return false on IE (#2968).
	isFunction: function( obj ) {
		return jQuery.type(obj) === "function";
	},

	isArray: Array.isArray || function( obj ) {
		return jQuery.type(obj) === "array";
	},

	// A crude way of determining if an object is a window
	isWindow: function( obj ) {
		return obj && typeof obj === "object" && "setInterval" in obj;
	},

	isNumeric: function( obj ) {
		return !isNaN( parseFloat(obj) ) && isFinite( obj );
	},

	type: function( obj ) {
		return obj == null ?
			String( obj ) :
			class2type[ toString.call(obj) ] || "object";
	},

	isPlainObject: function( obj ) {
		// Must be an Object.
		// Because of IE, we also have to check the presence of the constructor property.
		// Make sure that DOM nodes and window objects don't pass through, as well
		if ( !obj || jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
			return false;
		}

		try {
			// Not own constructor property must be Object
			if ( obj.constructor &&
				!hasOwn.call(obj, "constructor") &&
				!hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
				return false;
			}
		} catch ( e ) {
			// IE8,9 Will throw exceptions on certain host objects #9897
			return false;
		}

		// Own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own.

		var key;
		for ( key in obj ) {}

		return key === undefined || hasOwn.call( obj, key );
	},

	isEmptyObject: function( obj ) {
		for ( var name in obj ) {
			return false;
		}
		return true;
	},

	error: function( msg ) {
		throw new Error( msg );
	},

	parseJSON: function( data ) {
		if ( typeof data !== "string" || !data ) {
			return null;
		}

		// Make sure leading/trailing whitespace is removed (IE can't handle it)
		data = jQuery.trim( data );

		// Attempt to parse using the native JSON parser first
		if ( window.JSON && window.JSON.parse ) {
			return window.JSON.parse( data );
		}

		// Make sure the incoming data is actual JSON
		// Logic borrowed from http://json.org/json2.js
		if ( rvalidchars.test( data.replace( rvalidescape, "@" )
			.replace( rvalidtokens, "]" )
			.replace( rvalidbraces, "")) ) {

			return ( new Function( "return " + data ) )();

		}
		jQuery.error( "Invalid JSON: " + data );
	},

	// Cross-browser xml parsing
	parseXML: function( data ) {
		var xml, tmp;
		try {
			if ( window.DOMParser ) { // Standard
				tmp = new DOMParser();
				xml = tmp.parseFromString( data , "text/xml" );
			} else { // IE
				xml = new ActiveXObject( "Microsoft.XMLDOM" );
				xml.async = "false";
				xml.loadXML( data );
			}
		} catch( e ) {
			xml = undefined;
		}
		if ( !xml || !xml.documentElement || xml.getElementsByTagName( "parsererror" ).length ) {
			jQuery.error( "Invalid XML: " + data );
		}
		return xml;
	},

	noop: function() {},

	// Evaluates a script in a global context
	// Workarounds based on findings by Jim Driscoll
	// http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
	globalEval: function( data ) {
		if ( data && rnotwhite.test( data ) ) {
			// We use execScript on Internet Explorer
			// We use an anonymous function so that context is window
			// rather than jQuery in Firefox
			( window.execScript || function( data ) {
				window[ "eval" ].call( window, data );
			} )( data );
		}
	},

	// Convert dashed to camelCase; used by the css and data modules
	// Microsoft forgot to hump their vendor prefix (#9572)
	camelCase: function( string ) {
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	},

	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toUpperCase() === name.toUpperCase();
	},

	// args is for internal usage only
	each: function( object, callback, args ) {
		var name, i = 0,
			length = object.length,
			isObj = length === undefined || jQuery.isFunction( object );

		if ( args ) {
			if ( isObj ) {
				for ( name in object ) {
					if ( callback.apply( object[ name ], args ) === false ) {
						break;
					}
				}
			} else {
				for ( ; i < length; ) {
					if ( callback.apply( object[ i++ ], args ) === false ) {
						break;
					}
				}
			}

		// A special, fast, case for the most common use of each
		} else {
			if ( isObj ) {
				for ( name in object ) {
					if ( callback.call( object[ name ], name, object[ name ] ) === false ) {
						break;
					}
				}
			} else {
				for ( ; i < length; ) {
					if ( callback.call( object[ i ], i, object[ i++ ] ) === false ) {
						break;
					}
				}
			}
		}

		return object;
	},

	// Use native String.trim function wherever possible
	trim: trim ?
		function( text ) {
			return text == null ?
				"" :
				trim.call( text );
		} :

		// Otherwise use our own trimming functionality
		function( text ) {
			return text == null ?
				"" :
				text.toString().replace( trimLeft, "" ).replace( trimRight, "" );
		},

	// results is for internal usage only
	makeArray: function( array, results ) {
		var ret = results || [];

		if ( array != null ) {
			// The window, strings (and functions) also have 'length'
			// Tweaked logic slightly to handle Blackberry 4.7 RegExp issues #6930
			var type = jQuery.type( array );

			if ( array.length == null || type === "string" || type === "function" || type === "regexp" || jQuery.isWindow( array ) ) {
				push.call( ret, array );
			} else {
				jQuery.merge( ret, array );
			}
		}

		return ret;
	},

	inArray: function( elem, array, i ) {
		var len;

		if ( array ) {
			if ( indexOf ) {
				return indexOf.call( array, elem, i );
			}

			len = array.length;
			i = i ? i < 0 ? Math.max( 0, len + i ) : i : 0;

			for ( ; i < len; i++ ) {
				// Skip accessing in sparse arrays
				if ( i in array && array[ i ] === elem ) {
					return i;
				}
			}
		}

		return -1;
	},

	merge: function( first, second ) {
		var i = first.length,
			j = 0;

		if ( typeof second.length === "number" ) {
			for ( var l = second.length; j < l; j++ ) {
				first[ i++ ] = second[ j ];
			}

		} else {
			while ( second[j] !== undefined ) {
				first[ i++ ] = second[ j++ ];
			}
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, inv ) {
		var ret = [], retVal;
		inv = !!inv;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( var i = 0, length = elems.length; i < length; i++ ) {
			retVal = !!callback( elems[ i ], i );
			if ( inv !== retVal ) {
				ret.push( elems[ i ] );
			}
		}

		return ret;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var value, key, ret = [],
			i = 0,
			length = elems.length,
			// jquery objects are treated as arrays
			isArray = elems instanceof jQuery || length !== undefined && typeof length === "number" && ( ( length > 0 && elems[ 0 ] && elems[ length -1 ] ) || length === 0 || jQuery.isArray( elems ) ) ;

		// Go through the array, translating each of the items to their
		if ( isArray ) {
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}

		// Go through every key on the object,
		} else {
			for ( key in elems ) {
				value = callback( elems[ key ], key, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}
		}

		// Flatten any nested arrays
		return ret.concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// Bind a function to a context, optionally partially applying any
	// arguments.
	proxy: function( fn, context ) {
		if ( typeof context === "string" ) {
			var tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if ( !jQuery.isFunction( fn ) ) {
			return undefined;
		}

		// Simulated bind
		var args = slice.call( arguments, 2 ),
			proxy = function() {
				return fn.apply( context, args.concat( slice.call( arguments ) ) );
			};

		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || proxy.guid || jQuery.guid++;

		return proxy;
	},

	// Mutifunctional method to get and set values to a collection
	// The value/s can optionally be executed if it's a function
	access: function( elems, key, value, exec, fn, pass ) {
		var length = elems.length;

		// Setting many attributes
		if ( typeof key === "object" ) {
			for ( var k in key ) {
				jQuery.access( elems, k, key[k], exec, fn, value );
			}
			return elems;
		}

		// Setting one attribute
		if ( value !== undefined ) {
			// Optionally, function values get executed if exec is true
			exec = !pass && exec && jQuery.isFunction(value);

			for ( var i = 0; i < length; i++ ) {
				fn( elems[i], key, exec ? value.call( elems[i], i, fn( elems[i], key ) ) : value, pass );
			}

			return elems;
		}

		// Getting an attribute
		return length ? fn( elems[0], key ) : undefined;
	},

	now: function() {
		return ( new Date() ).getTime();
	},

	// Use of jQuery.browser is frowned upon.
	// More details: http://docs.jquery.com/Utilities/jQuery.browser
	uaMatch: function( ua ) {
		ua = ua.toLowerCase();

		var match = rwebkit.exec( ua ) ||
			ropera.exec( ua ) ||
			rmsie.exec( ua ) ||
			ua.indexOf("compatible") < 0 && rmozilla.exec( ua ) ||
			[];

		return { browser: match[1] || "", version: match[2] || "0" };
	},

	sub: function() {
		function jQuerySub( selector, context ) {
			return new jQuerySub.fn.init( selector, context );
		}
		jQuery.extend( true, jQuerySub, this );
		jQuerySub.superclass = this;
		jQuerySub.fn = jQuerySub.prototype = this();
		jQuerySub.fn.constructor = jQuerySub;
		jQuerySub.sub = this.sub;
		jQuerySub.fn.init = function init( selector, context ) {
			if ( context && context instanceof jQuery && !(context instanceof jQuerySub) ) {
				context = jQuerySub( context );
			}

			return jQuery.fn.init.call( this, selector, context, rootjQuerySub );
		};
		jQuerySub.fn.init.prototype = jQuerySub.fn;
		var rootjQuerySub = jQuerySub(document);
		return jQuerySub;
	},

	browser: {}
});

// Populate the class2type map
jQuery.each("Boolean Number String Function Array Date RegExp Object".split(" "), function(i, name) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
});

browserMatch = jQuery.uaMatch( userAgent );
if ( browserMatch.browser ) {
	jQuery.browser[ browserMatch.browser ] = true;
	jQuery.browser.version = browserMatch.version;
}

// Deprecated, use jQuery.browser.webkit instead
if ( jQuery.browser.webkit ) {
	jQuery.browser.safari = true;
}

// IE doesn't match non-breaking spaces with \s
if ( rnotwhite.test( "\xA0" ) ) {
	trimLeft = /^[\s\xA0]+/;
	trimRight = /[\s\xA0]+$/;
}

// All jQuery objects should point back to these
rootjQuery = jQuery(document);

// Cleanup functions for the document ready method
if ( document.addEventListener ) {
	DOMContentLoaded = function() {
		document.removeEventListener( "DOMContentLoaded", DOMContentLoaded, false );
		jQuery.ready();
	};

} else if ( document.attachEvent ) {
	DOMContentLoaded = function() {
		// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
		if ( document.readyState === "complete" ) {
			document.detachEvent( "onreadystatechange", DOMContentLoaded );
			jQuery.ready();
		}
	};
}

// The DOM ready check for Internet Explorer
function doScrollCheck() {
	if ( jQuery.isReady ) {
		return;
	}

	try {
		// If IE is used, use the trick by Diego Perini
		// http://javascript.nwbox.com/IEContentLoaded/
		document.documentElement.doScroll("left");
	} catch(e) {
		setTimeout( doScrollCheck, 1 );
		return;
	}

	// and execute any waiting functions
	jQuery.ready();
}

return jQuery;

})();


// String to Object flags format cache
var flagsCache = {};

// Convert String-formatted flags into Object-formatted ones and store in cache
function createFlags( flags ) {
	var object = flagsCache[ flags ] = {},
		i, length;
	flags = flags.split( /\s+/ );
	for ( i = 0, length = flags.length; i < length; i++ ) {
		object[ flags[i] ] = true;
	}
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	flags:	an optional list of space-separated flags that will change how
 *			the callback list behaves
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible flags:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( flags ) {

	// Convert flags from String-formatted to Object-formatted
	// (we check in cache first)
	flags = flags ? ( flagsCache[ flags ] || createFlags( flags ) ) : {};

	var // Actual callback list
		list = [],
		// Stack of fire calls for repeatable lists
		stack = [],
		// Last fire value (for non-forgettable lists)
		memory,
		// Flag to know if list is currently firing
		firing,
		// First callback to fire (used internally by add and fireWith)
		firingStart,
		// End of the loop when firing
		firingLength,
		// Index of currently firing callback (modified by remove if needed)
		firingIndex,
		// Add one or several callbacks to the list
		add = function( args ) {
			var i,
				length,
				elem,
				type,
				actual;
			for ( i = 0, length = args.length; i < length; i++ ) {
				elem = args[ i ];
				type = jQuery.type( elem );
				if ( type === "array" ) {
					// Inspect recursively
					add( elem );
				} else if ( type === "function" ) {
					// Add if not in unique mode and callback is not in
					if ( !flags.unique || !self.has( elem ) ) {
						list.push( elem );
					}
				}
			}
		},
		// Fire callbacks
		fire = function( context, args ) {
			args = args || [];
			memory = !flags.memory || [ context, args ];
			firing = true;
			firingIndex = firingStart || 0;
			firingStart = 0;
			firingLength = list.length;
			for ( ; list && firingIndex < firingLength; firingIndex++ ) {
				if ( list[ firingIndex ].apply( context, args ) === false && flags.stopOnFalse ) {
					memory = true; // Mark as halted
					break;
				}
			}
			firing = false;
			if ( list ) {
				if ( !flags.once ) {
					if ( stack && stack.length ) {
						memory = stack.shift();
						self.fireWith( memory[ 0 ], memory[ 1 ] );
					}
				} else if ( memory === true ) {
					self.disable();
				} else {
					list = [];
				}
			}
		},
		// Actual Callbacks object
		self = {
			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {
					var length = list.length;
					add( arguments );
					// Do we need to add the callbacks to the
					// current firing batch?
					if ( firing ) {
						firingLength = list.length;
					// With memory, if we're not firing then
					// we should call right away, unless previous
					// firing was halted (stopOnFalse)
					} else if ( memory && memory !== true ) {
						firingStart = length;
						fire( memory[ 0 ], memory[ 1 ] );
					}
				}
				return this;
			},
			// Remove a callback from the list
			remove: function() {
				if ( list ) {
					var args = arguments,
						argIndex = 0,
						argLength = args.length;
					for ( ; argIndex < argLength ; argIndex++ ) {
						for ( var i = 0; i < list.length; i++ ) {
							if ( args[ argIndex ] === list[ i ] ) {
								// Handle firingIndex and firingLength
								if ( firing ) {
									if ( i <= firingLength ) {
										firingLength--;
										if ( i <= firingIndex ) {
											firingIndex--;
										}
									}
								}
								// Remove the element
								list.splice( i--, 1 );
								// If we have some unicity property then
								// we only need to do this once
								if ( flags.unique ) {
									break;
								}
							}
						}
					}
				}
				return this;
			},
			// Control if a given callback is in the list
			has: function( fn ) {
				if ( list ) {
					var i = 0,
						length = list.length;
					for ( ; i < length; i++ ) {
						if ( fn === list[ i ] ) {
							return true;
						}
					}
				}
				return false;
			},
			// Remove all callbacks from the list
			empty: function() {
				list = [];
				return this;
			},
			// Have the list do nothing anymore
			disable: function() {
				list = stack = memory = undefined;
				return this;
			},
			// Is it disabled?
			disabled: function() {
				return !list;
			},
			// Lock the list in its current state
			lock: function() {
				stack = undefined;
				if ( !memory || memory === true ) {
					self.disable();
				}
				return this;
			},
			// Is it locked?
			locked: function() {
				return !stack;
			},
			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				if ( stack ) {
					if ( firing ) {
						if ( !flags.once ) {
							stack.push( [ context, args ] );
						}
					} else if ( !( flags.once && memory ) ) {
						fire( context, args );
					}
				}
				return this;
			},
			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},
			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!memory;
			}
		};

	return self;
};




var // Static reference to slice
	sliceDeferred = [].slice;

jQuery.extend({

	Deferred: function( func ) {
		var doneList = jQuery.Callbacks( "once memory" ),
			failList = jQuery.Callbacks( "once memory" ),
			progressList = jQuery.Callbacks( "memory" ),
			state = "pending",
			lists = {
				resolve: doneList,
				reject: failList,
				notify: progressList
			},
			promise = {
				done: doneList.add,
				fail: failList.add,
				progress: progressList.add,

				state: function() {
					return state;
				},

				// Deprecated
				isResolved: doneList.fired,
				isRejected: failList.fired,

				then: function( doneCallbacks, failCallbacks, progressCallbacks ) {
					deferred.done( doneCallbacks ).fail( failCallbacks ).progress( progressCallbacks );
					return this;
				},
				always: function() {
					deferred.done.apply( deferred, arguments ).fail.apply( deferred, arguments );
					return this;
				},
				pipe: function( fnDone, fnFail, fnProgress ) {
					return jQuery.Deferred(function( newDefer ) {
						jQuery.each( {
							done: [ fnDone, "resolve" ],
							fail: [ fnFail, "reject" ],
							progress: [ fnProgress, "notify" ]
						}, function( handler, data ) {
							var fn = data[ 0 ],
								action = data[ 1 ],
								returned;
							if ( jQuery.isFunction( fn ) ) {
								deferred[ handler ](function() {
									returned = fn.apply( this, arguments );
									if ( returned && jQuery.isFunction( returned.promise ) ) {
										returned.promise().then( newDefer.resolve, newDefer.reject, newDefer.notify );
									} else {
										newDefer[ action + "With" ]( this === deferred ? newDefer : this, [ returned ] );
									}
								});
							} else {
								deferred[ handler ]( newDefer[ action ] );
							}
						});
					}).promise();
				},
				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					if ( obj == null ) {
						obj = promise;
					} else {
						for ( var key in promise ) {
							obj[ key ] = promise[ key ];
						}
					}
					return obj;
				}
			},
			deferred = promise.promise({}),
			key;

		for ( key in lists ) {
			deferred[ key ] = lists[ key ].fire;
			deferred[ key + "With" ] = lists[ key ].fireWith;
		}

		// Handle state
		deferred.done( function() {
			state = "resolved";
		}, failList.disable, progressList.lock ).fail( function() {
			state = "rejected";
		}, doneList.disable, progressList.lock );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( firstParam ) {
		var args = sliceDeferred.call( arguments, 0 ),
			i = 0,
			length = args.length,
			pValues = new Array( length ),
			count = length,
			pCount = length,
			deferred = length <= 1 && firstParam && jQuery.isFunction( firstParam.promise ) ?
				firstParam :
				jQuery.Deferred(),
			promise = deferred.promise();
		function resolveFunc( i ) {
			return function( value ) {
				args[ i ] = arguments.length > 1 ? sliceDeferred.call( arguments, 0 ) : value;
				if ( !( --count ) ) {
					deferred.resolveWith( deferred, args );
				}
			};
		}
		function progressFunc( i ) {
			return function( value ) {
				pValues[ i ] = arguments.length > 1 ? sliceDeferred.call( arguments, 0 ) : value;
				deferred.notifyWith( promise, pValues );
			};
		}
		if ( length > 1 ) {
			for ( ; i < length; i++ ) {
				if ( args[ i ] && args[ i ].promise && jQuery.isFunction( args[ i ].promise ) ) {
					args[ i ].promise().then( resolveFunc(i), deferred.reject, progressFunc(i) );
				} else {
					--count;
				}
			}
			if ( !count ) {
				deferred.resolveWith( deferred, args );
			}
		} else if ( deferred !== firstParam ) {
			deferred.resolveWith( deferred, length ? [ firstParam ] : [] );
		}
		return promise;
	}
});




jQuery.support = (function() {

	var support,
		all,
		a,
		select,
		opt,
		input,
		marginDiv,
		fragment,
		tds,
		events,
		eventName,
		i,
		isSupported,
		div = document.createElement( "div" ),
		documentElement = document.documentElement;

	// Preliminary tests
	div.setAttribute("className", "t");
	div.innerHTML = "   <link/><table></table><a href='/a' style='top:1px;float:left;opacity:.55;'>a</a><input type='checkbox'/>";

	all = div.getElementsByTagName( "*" );
	a = div.getElementsByTagName( "a" )[ 0 ];

	// Can't get basic test support
	if ( !all || !all.length || !a ) {
		return {};
	}

	// First batch of supports tests
	select = document.createElement( "select" );
	opt = select.appendChild( document.createElement("option") );
	input = div.getElementsByTagName( "input" )[ 0 ];

	support = {
		// IE strips leading whitespace when .innerHTML is used
		leadingWhitespace: ( div.firstChild.nodeType === 3 ),

		// Make sure that tbody elements aren't automatically inserted
		// IE will insert them into empty tables
		tbody: !div.getElementsByTagName("tbody").length,

		// Make sure that link elements get serialized correctly by innerHTML
		// This requires a wrapper element in IE
		htmlSerialize: !!div.getElementsByTagName("link").length,

		// Get the style information from getAttribute
		// (IE uses .cssText instead)
		style: /top/.test( a.getAttribute("style") ),

		// Make sure that URLs aren't manipulated
		// (IE normalizes it by default)
		hrefNormalized: ( a.getAttribute("href") === "/a" ),

		// Make sure that element opacity exists
		// (IE uses filter instead)
		// Use a regex to work around a WebKit issue. See #5145
		opacity: /^0.55/.test( a.style.opacity ),

		// Verify style float existence
		// (IE uses styleFloat instead of cssFloat)
		cssFloat: !!a.style.cssFloat,

		// Make sure that if no value is specified for a checkbox
		// that it defaults to "on".
		// (WebKit defaults to "" instead)
		checkOn: ( input.value === "on" ),

		// Make sure that a selected-by-default option has a working selected property.
		// (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
		optSelected: opt.selected,

		// Test setAttribute on camelCase class. If it works, we need attrFixes when doing get/setAttribute (ie6/7)
		getSetAttribute: div.className !== "t",

		// Tests for enctype support on a form(#6743)
		enctype: !!document.createElement("form").enctype,

		// Makes sure cloning an html5 element does not cause problems
		// Where outerHTML is undefined, this still works
		html5Clone: document.createElement("nav").cloneNode( true ).outerHTML !== "<:nav></:nav>",

		// Will be defined later
		submitBubbles: true,
		changeBubbles: true,
		focusinBubbles: false,
		deleteExpando: true,
		noCloneEvent: true,
		inlineBlockNeedsLayout: false,
		shrinkWrapBlocks: false,
		reliableMarginRight: true
	};

	// Make sure checked status is properly cloned
	input.checked = true;
	support.noCloneChecked = input.cloneNode( true ).checked;

	// Make sure that the options inside disabled selects aren't marked as disabled
	// (WebKit marks them as disabled)
	select.disabled = true;
	support.optDisabled = !opt.disabled;

	// Test to see if it's possible to delete an expando from an element
	// Fails in Internet Explorer
	try {
		delete div.test;
	} catch( e ) {
		support.deleteExpando = false;
	}

	if ( !div.addEventListener && div.attachEvent && div.fireEvent ) {
		div.attachEvent( "onclick", function() {
			// Cloning a node shouldn't copy over any
			// bound event handlers (IE does this)
			support.noCloneEvent = false;
		});
		div.cloneNode( true ).fireEvent( "onclick" );
	}

	// Check if a radio maintains its value
	// after being appended to the DOM
	input = document.createElement("input");
	input.value = "t";
	input.setAttribute("type", "radio");
	support.radioValue = input.value === "t";

	input.setAttribute("checked", "checked");
	div.appendChild( input );
	fragment = document.createDocumentFragment();
	fragment.appendChild( div.lastChild );

	// WebKit doesn't clone checked state correctly in fragments
	support.checkClone = fragment.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Check if a disconnected checkbox will retain its checked
	// value of true after appended to the DOM (IE6/7)
	support.appendChecked = input.checked;

	fragment.removeChild( input );
	fragment.appendChild( div );

	div.innerHTML = "";

	// Check if div with explicit width and no margin-right incorrectly
	// gets computed margin-right based on width of container. For more
	// info see bug #3333
	// Fails in WebKit before Feb 2011 nightlies
	// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
	if ( window.getComputedStyle ) {
		marginDiv = document.createElement( "div" );
		marginDiv.style.width = "0";
		marginDiv.style.marginRight = "0";
		div.style.width = "2px";
		div.appendChild( marginDiv );
		support.reliableMarginRight =
			( parseInt( ( window.getComputedStyle( marginDiv, null ) || { marginRight: 0 } ).marginRight, 10 ) || 0 ) === 0;
	}

	// Technique from Juriy Zaytsev
	// http://perfectionkills.com/detecting-event-support-without-browser-sniffing/
	// We only care about the case where non-standard event systems
	// are used, namely in IE. Short-circuiting here helps us to
	// avoid an eval call (in setAttribute) which can cause CSP
	// to go haywire. See: https://developer.mozilla.org/en/Security/CSP
	if ( div.attachEvent ) {
		for( i in {
			submit: 1,
			change: 1,
			focusin: 1
		}) {
			eventName = "on" + i;
			isSupported = ( eventName in div );
			if ( !isSupported ) {
				div.setAttribute( eventName, "return;" );
				isSupported = ( typeof div[ eventName ] === "function" );
			}
			support[ i + "Bubbles" ] = isSupported;
		}
	}

	fragment.removeChild( div );

	// Null elements to avoid leaks in IE
	fragment = select = opt = marginDiv = div = input = null;

	// Run tests that need a body at doc ready
	jQuery(function() {
		var container, outer, inner, table, td, offsetSupport,
			conMarginTop, ptlm, vb, style, html,
			body = document.getElementsByTagName("body")[0];

		if ( !body ) {
			// Return for frameset docs that don't have a body
			return;
		}

		conMarginTop = 1;
		ptlm = "position:absolute;top:0;left:0;width:1px;height:1px;margin:0;";
		vb = "visibility:hidden;border:0;";
		style = "style='" + ptlm + "border:5px solid #000;padding:0;'";
		html = "<div " + style + "><div></div></div>" +
			"<table " + style + " cellpadding='0' cellspacing='0'>" +
			"<tr><td></td></tr></table>";

		container = document.createElement("div");
		container.style.cssText = vb + "width:0;height:0;position:static;top:0;margin-top:" + conMarginTop + "px";
		body.insertBefore( container, body.firstChild );

		// Construct the test element
		div = document.createElement("div");
		container.appendChild( div );

		// Check if table cells still have offsetWidth/Height when they are set
		// to display:none and there are still other visible table cells in a
		// table row; if so, offsetWidth/Height are not reliable for use when
		// determining if an element has been hidden directly using
		// display:none (it is still safe to use offsets if a parent element is
		// hidden; don safety goggles and see bug #4512 for more information).
		// (only IE 8 fails this test)
		div.innerHTML = "<table><tr><td style='padding:0;border:0;display:none'></td><td>t</td></tr></table>";
		tds = div.getElementsByTagName( "td" );
		isSupported = ( tds[ 0 ].offsetHeight === 0 );

		tds[ 0 ].style.display = "";
		tds[ 1 ].style.display = "none";

		// Check if empty table cells still have offsetWidth/Height
		// (IE <= 8 fail this test)
		support.reliableHiddenOffsets = isSupported && ( tds[ 0 ].offsetHeight === 0 );

		// Figure out if the W3C box model works as expected
		div.innerHTML = "";
		div.style.width = div.style.paddingLeft = "1px";
		jQuery.boxModel = support.boxModel = div.offsetWidth === 2;

		if ( typeof div.style.zoom !== "undefined" ) {
			// Check if natively block-level elements act like inline-block
			// elements when setting their display to 'inline' and giving
			// them layout
			// (IE < 8 does this)
			div.style.display = "inline";
			div.style.zoom = 1;
			support.inlineBlockNeedsLayout = ( div.offsetWidth === 2 );

			// Check if elements with layout shrink-wrap their children
			// (IE 6 does this)
			div.style.display = "";
			div.innerHTML = "<div style='width:4px;'></div>";
			support.shrinkWrapBlocks = ( div.offsetWidth !== 2 );
		}

		div.style.cssText = ptlm + vb;
		div.innerHTML = html;

		outer = div.firstChild;
		inner = outer.firstChild;
		td = outer.nextSibling.firstChild.firstChild;

		offsetSupport = {
			doesNotAddBorder: ( inner.offsetTop !== 5 ),
			doesAddBorderForTableAndCells: ( td.offsetTop === 5 )
		};

		inner.style.position = "fixed";
		inner.style.top = "20px";

		// safari subtracts parent border width here which is 5px
		offsetSupport.fixedPosition = ( inner.offsetTop === 20 || inner.offsetTop === 15 );
		inner.style.position = inner.style.top = "";

		outer.style.overflow = "hidden";
		outer.style.position = "relative";

		offsetSupport.subtractsBorderForOverflowNotVisible = ( inner.offsetTop === -5 );
		offsetSupport.doesNotIncludeMarginInBodyOffset = ( body.offsetTop !== conMarginTop );

		body.removeChild( container );
		div  = container = null;

		jQuery.extend( support, offsetSupport );
	});

	return support;
})();




var rbrace = /^(?:\{.*\}|\[.*\])$/,
	rmultiDash = /([A-Z])/g;

jQuery.extend({
	cache: {},

	// Please use with caution
	uuid: 0,

	// Unique for each copy of jQuery on the page
	// Non-digits removed to match rinlinejQuery
	expando: "jQuery" + ( jQuery.fn.jquery + Math.random() ).replace( /\D/g, "" ),

	// The following elements throw uncatchable exceptions if you
	// attempt to add expando properties to them.
	noData: {
		"embed": true,
		// Ban all objects except for Flash (which handle expandos)
		"object": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",
		"applet": true
	},

	hasData: function( elem ) {
		elem = elem.nodeType ? jQuery.cache[ elem[jQuery.expando] ] : elem[ jQuery.expando ];
		return !!elem && !isEmptyDataObject( elem );
	},

	data: function( elem, name, data, pvt /* Internal Use Only */ ) {
		if ( !jQuery.acceptData( elem ) ) {
			return;
		}

		var privateCache, thisCache, ret,
			internalKey = jQuery.expando,
			getByName = typeof name === "string",

			// We have to handle DOM nodes and JS objects differently because IE6-7
			// can't GC object references properly across the DOM-JS boundary
			isNode = elem.nodeType,

			// Only DOM nodes need the global jQuery cache; JS object data is
			// attached directly to the object so GC can occur automatically
			cache = isNode ? jQuery.cache : elem,

			// Only defining an ID for JS objects if its cache already exists allows
			// the code to shortcut on the same path as a DOM node with no cache
			id = isNode ? elem[ internalKey ] : elem[ internalKey ] && internalKey,
			isEvents = name === "events";

		// Avoid doing any more work than we need to when trying to get data on an
		// object that has no data at all
		if ( (!id || !cache[id] || (!isEvents && !pvt && !cache[id].data)) && getByName && data === undefined ) {
			return;
		}

		if ( !id ) {
			// Only DOM nodes need a new unique ID for each element since their data
			// ends up in the global cache
			if ( isNode ) {
				elem[ internalKey ] = id = ++jQuery.uuid;
			} else {
				id = internalKey;
			}
		}

		if ( !cache[ id ] ) {
			cache[ id ] = {};

			// Avoids exposing jQuery metadata on plain JS objects when the object
			// is serialized using JSON.stringify
			if ( !isNode ) {
				cache[ id ].toJSON = jQuery.noop;
			}
		}

		// An object can be passed to jQuery.data instead of a key/value pair; this gets
		// shallow copied over onto the existing cache
		if ( typeof name === "object" || typeof name === "function" ) {
			if ( pvt ) {
				cache[ id ] = jQuery.extend( cache[ id ], name );
			} else {
				cache[ id ].data = jQuery.extend( cache[ id ].data, name );
			}
		}

		privateCache = thisCache = cache[ id ];

		// jQuery data() is stored in a separate object inside the object's internal data
		// cache in order to avoid key collisions between internal data and user-defined
		// data.
		if ( !pvt ) {
			if ( !thisCache.data ) {
				thisCache.data = {};
			}

			thisCache = thisCache.data;
		}

		if ( data !== undefined ) {
			thisCache[ jQuery.camelCase( name ) ] = data;
		}

		// Users should not attempt to inspect the internal events object using jQuery.data,
		// it is undocumented and subject to change. But does anyone listen? No.
		if ( isEvents && !thisCache[ name ] ) {
			return privateCache.events;
		}

		// Check for both converted-to-camel and non-converted data property names
		// If a data property was specified
		if ( getByName ) {

			// First Try to find as-is property data
			ret = thisCache[ name ];

			// Test for null|undefined property data
			if ( ret == null ) {

				// Try to find the camelCased property
				ret = thisCache[ jQuery.camelCase( name ) ];
			}
		} else {
			ret = thisCache;
		}

		return ret;
	},

	removeData: function( elem, name, pvt /* Internal Use Only */ ) {
		if ( !jQuery.acceptData( elem ) ) {
			return;
		}

		var thisCache, i, l,

			// Reference to internal data cache key
			internalKey = jQuery.expando,

			isNode = elem.nodeType,

			// See jQuery.data for more information
			cache = isNode ? jQuery.cache : elem,

			// See jQuery.data for more information
			id = isNode ? elem[ internalKey ] : internalKey;

		// If there is already no cache entry for this object, there is no
		// purpose in continuing
		if ( !cache[ id ] ) {
			return;
		}

		if ( name ) {

			thisCache = pvt ? cache[ id ] : cache[ id ].data;

			if ( thisCache ) {

				// Support array or space separated string names for data keys
				if ( !jQuery.isArray( name ) ) {

					// try the string as a key before any manipulation
					if ( name in thisCache ) {
						name = [ name ];
					} else {

						// split the camel cased version by spaces unless a key with the spaces exists
						name = jQuery.camelCase( name );
						if ( name in thisCache ) {
							name = [ name ];
						} else {
							name = name.split( " " );
						}
					}
				}

				for ( i = 0, l = name.length; i < l; i++ ) {
					delete thisCache[ name[i] ];
				}

				// If there is no data left in the cache, we want to continue
				// and let the cache object itself get destroyed
				if ( !( pvt ? isEmptyDataObject : jQuery.isEmptyObject )( thisCache ) ) {
					return;
				}
			}
		}

		// See jQuery.data for more information
		if ( !pvt ) {
			delete cache[ id ].data;

			// Don't destroy the parent cache unless the internal data object
			// had been the only thing left in it
			if ( !isEmptyDataObject(cache[ id ]) ) {
				return;
			}
		}

		// Browsers that fail expando deletion also refuse to delete expandos on
		// the window, but it will allow it on all other JS objects; other browsers
		// don't care
		// Ensure that `cache` is not a window object #10080
		if ( jQuery.support.deleteExpando || !cache.setInterval ) {
			delete cache[ id ];
		} else {
			cache[ id ] = null;
		}

		// We destroyed the cache and need to eliminate the expando on the node to avoid
		// false lookups in the cache for entries that no longer exist
		if ( isNode ) {
			// IE does not allow us to delete expando properties from nodes,
			// nor does it have a removeAttribute function on Document nodes;
			// we must handle all of these cases
			if ( jQuery.support.deleteExpando ) {
				delete elem[ internalKey ];
			} else if ( elem.removeAttribute ) {
				elem.removeAttribute( internalKey );
			} else {
				elem[ internalKey ] = null;
			}
		}
	},

	// For internal use only.
	_data: function( elem, name, data ) {
		return jQuery.data( elem, name, data, true );
	},

	// A method for determining if a DOM node can handle the data expando
	acceptData: function( elem ) {
		if ( elem.nodeName ) {
			var match = jQuery.noData[ elem.nodeName.toLowerCase() ];

			if ( match ) {
				return !(match === true || elem.getAttribute("classid") !== match);
			}
		}

		return true;
	}
});

jQuery.fn.extend({
	data: function( key, value ) {
		var parts, attr, name,
			data = null;

		if ( typeof key === "undefined" ) {
			if ( this.length ) {
				data = jQuery.data( this[0] );

				if ( this[0].nodeType === 1 && !jQuery._data( this[0], "parsedAttrs" ) ) {
					attr = this[0].attributes;
					for ( var i = 0, l = attr.length; i < l; i++ ) {
						name = attr[i].name;

						if ( name.indexOf( "data-" ) === 0 ) {
							name = jQuery.camelCase( name.substring(5) );

							dataAttr( this[0], name, data[ name ] );
						}
					}
					jQuery._data( this[0], "parsedAttrs", true );
				}
			}

			return data;

		} else if ( typeof key === "object" ) {
			return this.each(function() {
				jQuery.data( this, key );
			});
		}

		parts = key.split(".");
		parts[1] = parts[1] ? "." + parts[1] : "";

		if ( value === undefined ) {
			data = this.triggerHandler("getData" + parts[1] + "!", [parts[0]]);

			// Try to fetch any internally stored data first
			if ( data === undefined && this.length ) {
				data = jQuery.data( this[0], key );
				data = dataAttr( this[0], key, data );
			}

			return data === undefined && parts[1] ?
				this.data( parts[0] ) :
				data;

		} else {
			return this.each(function() {
				var self = jQuery( this ),
					args = [ parts[0], value ];

				self.triggerHandler( "setData" + parts[1] + "!", args );
				jQuery.data( this, key, value );
				self.triggerHandler( "changeData" + parts[1] + "!", args );
			});
		}
	},

	removeData: function( key ) {
		return this.each(function() {
			jQuery.removeData( this, key );
		});
	}
});

function dataAttr( elem, key, data ) {
	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {

		var name = "data-" + key.replace( rmultiDash, "-$1" ).toLowerCase();

		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = data === "true" ? true :
				data === "false" ? false :
				data === "null" ? null :
				jQuery.isNumeric( data ) ? parseFloat( data ) :
					rbrace.test( data ) ? jQuery.parseJSON( data ) :
					data;
			} catch( e ) {}

			// Make sure we set the data so it isn't changed later
			jQuery.data( elem, key, data );

		} else {
			data = undefined;
		}
	}

	return data;
}

// checks a cache object for emptiness
function isEmptyDataObject( obj ) {
	for ( var name in obj ) {

		// if the public data object is empty, the private is still empty
		if ( name === "data" && jQuery.isEmptyObject( obj[name] ) ) {
			continue;
		}
		if ( name !== "toJSON" ) {
			return false;
		}
	}

	return true;
}




function handleQueueMarkDefer( elem, type, src ) {
	var deferDataKey = type + "defer",
		queueDataKey = type + "queue",
		markDataKey = type + "mark",
		defer = jQuery._data( elem, deferDataKey );
	if ( defer &&
		( src === "queue" || !jQuery._data(elem, queueDataKey) ) &&
		( src === "mark" || !jQuery._data(elem, markDataKey) ) ) {
		// Give room for hard-coded callbacks to fire first
		// and eventually mark/queue something else on the element
		setTimeout( function() {
			if ( !jQuery._data( elem, queueDataKey ) &&
				!jQuery._data( elem, markDataKey ) ) {
				jQuery.removeData( elem, deferDataKey, true );
				defer.fire();
			}
		}, 0 );
	}
}

jQuery.extend({

	_mark: function( elem, type ) {
		if ( elem ) {
			type = ( type || "fx" ) + "mark";
			jQuery._data( elem, type, (jQuery._data( elem, type ) || 0) + 1 );
		}
	},

	_unmark: function( force, elem, type ) {
		if ( force !== true ) {
			type = elem;
			elem = force;
			force = false;
		}
		if ( elem ) {
			type = type || "fx";
			var key = type + "mark",
				count = force ? 0 : ( (jQuery._data( elem, key ) || 1) - 1 );
			if ( count ) {
				jQuery._data( elem, key, count );
			} else {
				jQuery.removeData( elem, key, true );
				handleQueueMarkDefer( elem, type, "mark" );
			}
		}
	},

	queue: function( elem, type, data ) {
		var q;
		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			q = jQuery._data( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !q || jQuery.isArray(data) ) {
					q = jQuery._data( elem, type, jQuery.makeArray(data) );
				} else {
					q.push( data );
				}
			}
			return q || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			fn = queue.shift(),
			hooks = {};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
		}

		if ( fn ) {
			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			jQuery._data( elem, type + ".run", hooks );
			fn.call( elem, function() {
				jQuery.dequeue( elem, type );
			}, hooks );
		}

		if ( !queue.length ) {
			jQuery.removeData( elem, type + "queue " + type + ".run", true );
			handleQueueMarkDefer( elem, type, "queue" );
		}
	}
});

jQuery.fn.extend({
	queue: function( type, data ) {
		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
		}

		if ( data === undefined ) {
			return jQuery.queue( this[0], type );
		}
		return this.each(function() {
			var queue = jQuery.queue( this, type, data );

			if ( type === "fx" && queue[0] !== "inprogress" ) {
				jQuery.dequeue( this, type );
			}
		});
	},
	dequeue: function( type ) {
		return this.each(function() {
			jQuery.dequeue( this, type );
		});
	},
	// Based off of the plugin by Clint Helfers, with permission.
	// http://blindsignals.com/index.php/2009/07/jquery-delay/
	delay: function( time, type ) {
		time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
		type = type || "fx";

		return this.queue( type, function( next, hooks ) {
			var timeout = setTimeout( next, time );
			hooks.stop = function() {
				clearTimeout( timeout );
			};
		});
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},
	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, object ) {
		if ( typeof type !== "string" ) {
			object = type;
			type = undefined;
		}
		type = type || "fx";
		var defer = jQuery.Deferred(),
			elements = this,
			i = elements.length,
			count = 1,
			deferDataKey = type + "defer",
			queueDataKey = type + "queue",
			markDataKey = type + "mark",
			tmp;
		function resolve() {
			if ( !( --count ) ) {
				defer.resolveWith( elements, [ elements ] );
			}
		}
		while( i-- ) {
			if (( tmp = jQuery.data( elements[ i ], deferDataKey, undefined, true ) ||
					( jQuery.data( elements[ i ], queueDataKey, undefined, true ) ||
						jQuery.data( elements[ i ], markDataKey, undefined, true ) ) &&
					jQuery.data( elements[ i ], deferDataKey, jQuery.Callbacks( "once memory" ), true ) )) {
				count++;
				tmp.add( resolve );
			}
		}
		resolve();
		return defer.promise();
	}
});




var rclass = /[\n\t\r]/g,
	rspace = /\s+/,
	rreturn = /\r/g,
	rtype = /^(?:button|input)$/i,
	rfocusable = /^(?:button|input|object|select|textarea)$/i,
	rclickable = /^a(?:rea)?$/i,
	rboolean = /^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i,
	getSetAttribute = jQuery.support.getSetAttribute,
	nodeHook, boolHook, fixSpecified;

jQuery.fn.extend({
	attr: function( name, value ) {
		return jQuery.access( this, name, value, true, jQuery.attr );
	},

	removeAttr: function( name ) {
		return this.each(function() {
			jQuery.removeAttr( this, name );
		});
	},

	prop: function( name, value ) {
		return jQuery.access( this, name, value, true, jQuery.prop );
	},

	removeProp: function( name ) {
		name = jQuery.propFix[ name ] || name;
		return this.each(function() {
			// try/catch handles cases where IE balks (such as removing a property on window)
			try {
				this[ name ] = undefined;
				delete this[ name ];
			} catch( e ) {}
		});
	},

	addClass: function( value ) {
		var classNames, i, l, elem,
			setClass, c, cl;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).addClass( value.call(this, j, this.className) );
			});
		}

		if ( value && typeof value === "string" ) {
			classNames = value.split( rspace );

			for ( i = 0, l = this.length; i < l; i++ ) {
				elem = this[ i ];

				if ( elem.nodeType === 1 ) {
					if ( !elem.className && classNames.length === 1 ) {
						elem.className = value;

					} else {
						setClass = " " + elem.className + " ";

						for ( c = 0, cl = classNames.length; c < cl; c++ ) {
							if ( !~setClass.indexOf( " " + classNames[ c ] + " " ) ) {
								setClass += classNames[ c ] + " ";
							}
						}
						elem.className = jQuery.trim( setClass );
					}
				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var classNames, i, l, elem, className, c, cl;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).removeClass( value.call(this, j, this.className) );
			});
		}

		if ( (value && typeof value === "string") || value === undefined ) {
			classNames = ( value || "" ).split( rspace );

			for ( i = 0, l = this.length; i < l; i++ ) {
				elem = this[ i ];

				if ( elem.nodeType === 1 && elem.className ) {
					if ( value ) {
						className = (" " + elem.className + " ").replace( rclass, " " );
						for ( c = 0, cl = classNames.length; c < cl; c++ ) {
							className = className.replace(" " + classNames[ c ] + " ", " ");
						}
						elem.className = jQuery.trim( className );

					} else {
						elem.className = "";
					}
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value,
			isBool = typeof stateVal === "boolean";

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( i ) {
				jQuery( this ).toggleClass( value.call(this, i, this.className, stateVal), stateVal );
			});
		}

		return this.each(function() {
			if ( type === "string" ) {
				// toggle individual class names
				var className,
					i = 0,
					self = jQuery( this ),
					state = stateVal,
					classNames = value.split( rspace );

				while ( (className = classNames[ i++ ]) ) {
					// check each className given, space seperated list
					state = isBool ? state : !self.hasClass( className );
					self[ state ? "addClass" : "removeClass" ]( className );
				}

			} else if ( type === "undefined" || type === "boolean" ) {
				if ( this.className ) {
					// store className if set
					jQuery._data( this, "__className__", this.className );
				}

				// toggle whole className
				this.className = this.className || value === false ? "" : jQuery._data( this, "__className__" ) || "";
			}
		});
	},

	hasClass: function( selector ) {
		var className = " " + selector + " ",
			i = 0,
			l = this.length;
		for ( ; i < l; i++ ) {
			if ( this[i].nodeType === 1 && (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) > -1 ) {
				return true;
			}
		}

		return false;
	},

	val: function( value ) {
		var hooks, ret, isFunction,
			elem = this[0];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.nodeName.toLowerCase() ] || jQuery.valHooks[ elem.type ];

				if ( hooks && "get" in hooks && (ret = hooks.get( elem, "value" )) !== undefined ) {
					return ret;
				}

				ret = elem.value;

				return typeof ret === "string" ?
					// handle most common string cases
					ret.replace(rreturn, "") :
					// handle cases where value is null/undef or number
					ret == null ? "" : ret;
			}

			return;
		}

		isFunction = jQuery.isFunction( value );

		return this.each(function( i ) {
			var self = jQuery(this), val;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call( this, i, self.val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";
			} else if ( typeof val === "number" ) {
				val += "";
			} else if ( jQuery.isArray( val ) ) {
				val = jQuery.map(val, function ( value ) {
					return value == null ? "" : value + "";
				});
			}

			hooks = jQuery.valHooks[ this.nodeName.toLowerCase() ] || jQuery.valHooks[ this.type ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !("set" in hooks) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		});
	}
});

jQuery.extend({
	valHooks: {
		option: {
			get: function( elem ) {
				// attributes.value is undefined in Blackberry 4.7 but
				// uses .value. See #6932
				var val = elem.attributes.value;
				return !val || val.specified ? elem.value : elem.text;
			}
		},
		select: {
			get: function( elem ) {
				var value, i, max, option,
					index = elem.selectedIndex,
					values = [],
					options = elem.options,
					one = elem.type === "select-one";

				// Nothing was selected
				if ( index < 0 ) {
					return null;
				}

				// Loop through all the selected options
				i = one ? index : 0;
				max = one ? index + 1 : options.length;
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// Don't return options that are disabled or in a disabled optgroup
					if ( option.selected && (jQuery.support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null) &&
							(!option.parentNode.disabled || !jQuery.nodeName( option.parentNode, "optgroup" )) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				// Fixes Bug #2551 -- select.val() broken in IE after form.reset()
				if ( one && !values.length && options.length ) {
					return jQuery( options[ index ] ).val();
				}

				return values;
			},

			set: function( elem, value ) {
				var values = jQuery.makeArray( value );

				jQuery(elem).find("option").each(function() {
					this.selected = jQuery.inArray( jQuery(this).val(), values ) >= 0;
				});

				if ( !values.length ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	},

	attrFn: {
		val: true,
		css: true,
		html: true,
		text: true,
		data: true,
		width: true,
		height: true,
		offset: true
	},

	attr: function( elem, name, value, pass ) {
		var ret, hooks, notxml,
			nType = elem.nodeType;

		// don't get/set attributes on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		if ( pass && name in jQuery.attrFn ) {
			return jQuery( elem )[ name ]( value );
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === "undefined" ) {
			return jQuery.prop( elem, name, value );
		}

		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		// All attributes are lowercase
		// Grab necessary hook if one is defined
		if ( notxml ) {
			name = name.toLowerCase();
			hooks = jQuery.attrHooks[ name ] || ( rboolean.test( name ) ? boolHook : nodeHook );
		}

		if ( value !== undefined ) {

			if ( value === null ) {
				jQuery.removeAttr( elem, name );
				return;

			} else if ( hooks && "set" in hooks && notxml && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				elem.setAttribute( name, "" + value );
				return value;
			}

		} else if ( hooks && "get" in hooks && notxml && (ret = hooks.get( elem, name )) !== null ) {
			return ret;

		} else {

			ret = elem.getAttribute( name );

			// Non-existent attributes return null, we normalize to undefined
			return ret === null ?
				undefined :
				ret;
		}
	},

	removeAttr: function( elem, value ) {
		var propName, attrNames, name, l,
			i = 0;

		if ( value && elem.nodeType === 1 ) {
			attrNames = value.toLowerCase().split( rspace );
			l = attrNames.length;

			for ( ; i < l; i++ ) {
				name = attrNames[ i ];

				if ( name ) {
					propName = jQuery.propFix[ name ] || name;

					// See #9699 for explanation of this approach (setting first, then removal)
					jQuery.attr( elem, name, "" );
					elem.removeAttribute( getSetAttribute ? name : propName );

					// Set corresponding property to false for boolean attributes
					if ( rboolean.test( name ) && propName in elem ) {
						elem[ propName ] = false;
					}
				}
			}
		}
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				// We can't allow the type property to be changed (since it causes problems in IE)
				if ( rtype.test( elem.nodeName ) && elem.parentNode ) {
					jQuery.error( "type property can't be changed" );
				} else if ( !jQuery.support.radioValue && value === "radio" && jQuery.nodeName(elem, "input") ) {
					// Setting the type on a radio button after the value resets the value in IE6-9
					// Reset value to it's default in case type is set after value
					// This is for element creation
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		},
		// Use the value property for back compat
		// Use the nodeHook for button elements in IE6/7 (#1954)
		value: {
			get: function( elem, name ) {
				if ( nodeHook && jQuery.nodeName( elem, "button" ) ) {
					return nodeHook.get( elem, name );
				}
				return name in elem ?
					elem.value :
					null;
			},
			set: function( elem, value, name ) {
				if ( nodeHook && jQuery.nodeName( elem, "button" ) ) {
					return nodeHook.set( elem, value, name );
				}
				// Does not return so that setAttribute is also used
				elem.value = value;
			}
		}
	},

	propFix: {
		tabindex: "tabIndex",
		readonly: "readOnly",
		"for": "htmlFor",
		"class": "className",
		maxlength: "maxLength",
		cellspacing: "cellSpacing",
		cellpadding: "cellPadding",
		rowspan: "rowSpan",
		colspan: "colSpan",
		usemap: "useMap",
		frameborder: "frameBorder",
		contenteditable: "contentEditable"
	},

	prop: function( elem, name, value ) {
		var ret, hooks, notxml,
			nType = elem.nodeType;

		// don't get/set properties on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		if ( notxml ) {
			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			if ( hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				return ( elem[ name ] = value );
			}

		} else {
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
				return ret;

			} else {
				return elem[ name ];
			}
		}
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {
				// elem.tabIndex doesn't always return the correct value when it hasn't been explicitly set
				// http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				var attributeNode = elem.getAttributeNode("tabindex");

				return attributeNode && attributeNode.specified ?
					parseInt( attributeNode.value, 10 ) :
					rfocusable.test( elem.nodeName ) || rclickable.test( elem.nodeName ) && elem.href ?
						0 :
						undefined;
			}
		}
	}
});

// Add the tabIndex propHook to attrHooks for back-compat (different case is intentional)
jQuery.attrHooks.tabindex = jQuery.propHooks.tabIndex;

// Hook for boolean attributes
boolHook = {
	get: function( elem, name ) {
		// Align boolean attributes with corresponding properties
		// Fall back to attribute presence where some booleans are not supported
		var attrNode,
			property = jQuery.prop( elem, name );
		return property === true || typeof property !== "boolean" && ( attrNode = elem.getAttributeNode(name) ) && attrNode.nodeValue !== false ?
			name.toLowerCase() :
			undefined;
	},
	set: function( elem, value, name ) {
		var propName;
		if ( value === false ) {
			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else {
			// value is true since we know at this point it's type boolean and not false
			// Set boolean attributes to the same name and set the DOM property
			propName = jQuery.propFix[ name ] || name;
			if ( propName in elem ) {
				// Only set the IDL specifically if it already exists on the element
				elem[ propName ] = true;
			}

			elem.setAttribute( name, name.toLowerCase() );
		}
		return name;
	}
};

// IE6/7 do not support getting/setting some attributes with get/setAttribute
if ( !getSetAttribute ) {

	fixSpecified = {
		name: true,
		id: true
	};

	// Use this for any attribute in IE6/7
	// This fixes almost every IE6/7 issue
	nodeHook = jQuery.valHooks.button = {
		get: function( elem, name ) {
			var ret;
			ret = elem.getAttributeNode( name );
			return ret && ( fixSpecified[ name ] ? ret.nodeValue !== "" : ret.specified ) ?
				ret.nodeValue :
				undefined;
		},
		set: function( elem, value, name ) {
			// Set the existing or create a new attribute node
			var ret = elem.getAttributeNode( name );
			if ( !ret ) {
				ret = document.createAttribute( name );
				elem.setAttributeNode( ret );
			}
			return ( ret.nodeValue = value + "" );
		}
	};

	// Apply the nodeHook to tabindex
	jQuery.attrHooks.tabindex.set = nodeHook.set;

	// Set width and height to auto instead of 0 on empty string( Bug #8150 )
	// This is for removals
	jQuery.each([ "width", "height" ], function( i, name ) {
		jQuery.attrHooks[ name ] = jQuery.extend( jQuery.attrHooks[ name ], {
			set: function( elem, value ) {
				if ( value === "" ) {
					elem.setAttribute( name, "auto" );
					return value;
				}
			}
		});
	});

	// Set contenteditable to false on removals(#10429)
	// Setting to empty string throws an error as an invalid value
	jQuery.attrHooks.contenteditable = {
		get: nodeHook.get,
		set: function( elem, value, name ) {
			if ( value === "" ) {
				value = "false";
			}
			nodeHook.set( elem, value, name );
		}
	};
}


// Some attributes require a special call on IE
if ( !jQuery.support.hrefNormalized ) {
	jQuery.each([ "href", "src", "width", "height" ], function( i, name ) {
		jQuery.attrHooks[ name ] = jQuery.extend( jQuery.attrHooks[ name ], {
			get: function( elem ) {
				var ret = elem.getAttribute( name, 2 );
				return ret === null ? undefined : ret;
			}
		});
	});
}

if ( !jQuery.support.style ) {
	jQuery.attrHooks.style = {
		get: function( elem ) {
			// Return undefined in the case of empty string
			// Normalize to lowercase since IE uppercases css property names
			return elem.style.cssText.toLowerCase() || undefined;
		},
		set: function( elem, value ) {
			return ( elem.style.cssText = "" + value );
		}
	};
}

// Safari mis-reports the default selected property of an option
// Accessing the parent's selectedIndex property fixes it
if ( !jQuery.support.optSelected ) {
	jQuery.propHooks.selected = jQuery.extend( jQuery.propHooks.selected, {
		get: function( elem ) {
			var parent = elem.parentNode;

			if ( parent ) {
				parent.selectedIndex;

				// Make sure that it also works with optgroups, see #5701
				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
			return null;
		}
	});
}

// IE6/7 call enctype encoding
if ( !jQuery.support.enctype ) {
	jQuery.propFix.enctype = "encoding";
}

// Radios and checkboxes getter/setter
if ( !jQuery.support.checkOn ) {
	jQuery.each([ "radio", "checkbox" ], function() {
		jQuery.valHooks[ this ] = {
			get: function( elem ) {
				// Handle the case where in Webkit "" is returned instead of "on" if a value isn't specified
				return elem.getAttribute("value") === null ? "on" : elem.value;
			}
		};
	});
}
jQuery.each([ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = jQuery.extend( jQuery.valHooks[ this ], {
		set: function( elem, value ) {
			if ( jQuery.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery(elem).val(), value ) >= 0 );
			}
		}
	});
});




var rformElems = /^(?:textarea|input|select)$/i,
	rtypenamespace = /^([^\.]*)?(?:\.(.+))?$/,
	rhoverHack = /\bhover(\.\S+)?\b/,
	rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|contextmenu)|click/,
	rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
	rquickIs = /^(\w*)(?:#([\w\-]+))?(?:\.([\w\-]+))?$/,
	quickParse = function( selector ) {
		var quick = rquickIs.exec( selector );
		if ( quick ) {
			//   0  1    2   3
			// [ _, tag, id, class ]
			quick[1] = ( quick[1] || "" ).toLowerCase();
			quick[3] = quick[3] && new RegExp( "(?:^|\\s)" + quick[3] + "(?:\\s|$)" );
		}
		return quick;
	},
	quickIs = function( elem, m ) {
		var attrs = elem.attributes || {};
		return (
			(!m[1] || elem.nodeName.toLowerCase() === m[1]) &&
			(!m[2] || (attrs.id || {}).value === m[2]) &&
			(!m[3] || m[3].test( (attrs[ "class" ] || {}).value ))
		);
	},
	hoverHack = function( events ) {
		return jQuery.event.special.hover ? events : events.replace( rhoverHack, "mouseenter$1 mouseleave$1" );
	};

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	add: function( elem, types, handler, data, selector ) {

		var elemData, eventHandle, events,
			t, tns, type, namespaces, handleObj,
			handleObjIn, quick, handlers, special;

		// Don't attach events to noData or text/comment nodes (allow plain objects tho)
		if ( elem.nodeType === 3 || elem.nodeType === 8 || !types || !handler || !(elemData = jQuery._data( elem )) ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		events = elemData.events;
		if ( !events ) {
			elemData.events = events = {};
		}
		eventHandle = elemData.handle;
		if ( !eventHandle ) {
			elemData.handle = eventHandle = function( e ) {
				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== "undefined" && (!e || jQuery.event.triggered !== e.type) ?
					jQuery.event.dispatch.apply( eventHandle.elem, arguments ) :
					undefined;
			};
			// Add elem as a property of the handle fn to prevent a memory leak with IE non-native events
			eventHandle.elem = elem;
		}

		// Handle multiple events separated by a space
		// jQuery(...).bind("mouseover mouseout", fn);
		types = jQuery.trim( hoverHack(types) ).split( " " );
		for ( t = 0; t < types.length; t++ ) {

			tns = rtypenamespace.exec( types[t] ) || [];
			type = tns[1];
			namespaces = ( tns[2] || "" ).split( "." ).sort();

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend({
				type: type,
				origType: tns[1],
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				quick: quickParse( selector ),
				namespace: namespaces.join(".")
			}, handleObjIn );

			// Init the event handler queue if we're the first
			handlers = events[ type ];
			if ( !handlers ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener/attachEvent if the special events handler returns false
				if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
					// Bind the global event handler to the element
					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle, false );

					} else if ( elem.attachEvent ) {
						elem.attachEvent( "on" + type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

		// Nullify elem to prevent memory leaks in IE
		elem = null;
	},

	global: {},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {

		var elemData = jQuery.hasData( elem ) && jQuery._data( elem ),
			t, tns, type, origType, namespaces, origCount,
			j, events, special, handle, eventType, handleObj;

		if ( !elemData || !(events = elemData.events) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = jQuery.trim( hoverHack( types || "" ) ).split(" ");
		for ( t = 0; t < types.length; t++ ) {
			tns = rtypenamespace.exec( types[t] ) || [];
			type = origType = tns[1];
			namespaces = tns[2];

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector? special.delegateType : special.bindType ) || type;
			eventType = events[ type ] || [];
			origCount = eventType.length;
			namespaces = namespaces ? new RegExp("(^|\\.)" + namespaces.split(".").sort().join("\\.(?:.*\\.)?") + "(\\.|$)") : null;

			// Remove matching events
			for ( j = 0; j < eventType.length; j++ ) {
				handleObj = eventType[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					 ( !handler || handler.guid === handleObj.guid ) &&
					 ( !namespaces || namespaces.test( handleObj.namespace ) ) &&
					 ( !selector || selector === handleObj.selector || selector === "**" && handleObj.selector ) ) {
					eventType.splice( j--, 1 );

					if ( handleObj.selector ) {
						eventType.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( eventType.length === 0 && origCount !== eventType.length ) {
				if ( !special.teardown || special.teardown.call( elem, namespaces ) === false ) {
					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			handle = elemData.handle;
			if ( handle ) {
				handle.elem = null;
			}

			// removeData also checks for emptiness and clears the expando if empty
			// so use it instead of delete
			jQuery.removeData( elem, [ "events", "handle" ], true );
		}
	},

	// Events that are safe to short-circuit if no handlers are attached.
	// Native DOM events should not be added, they may have inline handlers.
	customEvent: {
		"getData": true,
		"setData": true,
		"changeData": true
	},

	trigger: function( event, data, elem, onlyHandlers ) {
		// Don't do events on text and comment nodes
		if ( elem && (elem.nodeType === 3 || elem.nodeType === 8) ) {
			return;
		}

		// Event object or event type
		var type = event.type || event,
			namespaces = [],
			cache, exclusive, i, cur, old, ontype, special, handle, eventPath, bubbleType;

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf( "!" ) >= 0 ) {
			// Exclusive events trigger only for the exact event (no namespaces)
			type = type.slice(0, -1);
			exclusive = true;
		}

		if ( type.indexOf( "." ) >= 0 ) {
			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split(".");
			type = namespaces.shift();
			namespaces.sort();
		}

		if ( (!elem || jQuery.event.customEvent[ type ]) && !jQuery.event.global[ type ] ) {
			// No jQuery handlers for this event type, and it can't have inline handlers
			return;
		}

		// Caller can pass in an Event, Object, or just an event type string
		event = typeof event === "object" ?
			// jQuery.Event object
			event[ jQuery.expando ] ? event :
			// Object literal
			new jQuery.Event( type, event ) :
			// Just the event type (string)
			new jQuery.Event( type );

		event.type = type;
		event.isTrigger = true;
		event.exclusive = exclusive;
		event.namespace = namespaces.join( "." );
		event.namespace_re = event.namespace? new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.)?") + "(\\.|$)") : null;
		ontype = type.indexOf( ":" ) < 0 ? "on" + type : "";

		// Handle a global trigger
		if ( !elem ) {

			// TODO: Stop taunting the data cache; remove global events and always attach to document
			cache = jQuery.cache;
			for ( i in cache ) {
				if ( cache[ i ].events && cache[ i ].events[ type ] ) {
					jQuery.event.trigger( event, data, cache[ i ].handle.elem, true );
				}
			}
			return;
		}

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data != null ? jQuery.makeArray( data ) : [];
		data.unshift( event );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		eventPath = [[ elem, special.bindType || type ]];
		if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			cur = rfocusMorph.test( bubbleType + type ) ? elem : elem.parentNode;
			old = null;
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push([ cur, bubbleType ]);
				old = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( old && old === elem.ownerDocument ) {
				eventPath.push([ old.defaultView || old.parentWindow || window, bubbleType ]);
			}
		}

		// Fire handlers on the event path
		for ( i = 0; i < eventPath.length && !event.isPropagationStopped(); i++ ) {

			cur = eventPath[i][0];
			event.type = eventPath[i][1];

			handle = ( jQuery._data( cur, "events" ) || {} )[ event.type ] && jQuery._data( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}
			// Note that this is a bare JS function and not a jQuery handler
			handle = ontype && cur[ ontype ];
			if ( handle && jQuery.acceptData( cur ) && handle.apply( cur, data ) === false ) {
				event.preventDefault();
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( (!special._default || special._default.apply( elem.ownerDocument, data ) === false) &&
				!(type === "click" && jQuery.nodeName( elem, "a" )) && jQuery.acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name name as the event.
				// Can't use an .isFunction() check here because IE6/7 fails that test.
				// Don't do default actions on window, that's where global variables be (#6170)
				// IE<9 dies on focus/blur to hidden element (#1486)
				if ( ontype && elem[ type ] && ((type !== "focus" && type !== "blur") || event.target.offsetWidth !== 0) && !jQuery.isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					old = elem[ ontype ];

					if ( old ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;
					elem[ type ]();
					jQuery.event.triggered = undefined;

					if ( old ) {
						elem[ ontype ] = old;
					}
				}
			}
		}

		return event.result;
	},

	dispatch: function( event ) {

		// Make a writable jQuery.Event from the native event object
		event = jQuery.event.fix( event || window.event );

		var handlers = ( (jQuery._data( this, "events" ) || {} )[ event.type ] || []),
			delegateCount = handlers.delegateCount,
			args = [].slice.call( arguments, 0 ),
			run_all = !event.exclusive && !event.namespace,
			handlerQueue = [],
			i, j, cur, jqcur, ret, selMatch, matched, matches, handleObj, sel, related;

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[0] = event;
		event.delegateTarget = this;

		// Determine handlers that should run if there are delegated events
		// Avoid disabled elements in IE (#6911) and non-left-click bubbling in Firefox (#3861)
		if ( delegateCount && !event.target.disabled && !(event.button && event.type === "click") ) {

			// Pregenerate a single jQuery object for reuse with .is()
			jqcur = jQuery(this);
			jqcur.context = this.ownerDocument || this;

			for ( cur = event.target; cur != this; cur = cur.parentNode || this ) {
				selMatch = {};
				matches = [];
				jqcur[0] = cur;
				for ( i = 0; i < delegateCount; i++ ) {
					handleObj = handlers[ i ];
					sel = handleObj.selector;

					if ( selMatch[ sel ] === undefined ) {
						selMatch[ sel ] = (
							handleObj.quick ? quickIs( cur, handleObj.quick ) : jqcur.is( sel )
						);
					}
					if ( selMatch[ sel ] ) {
						matches.push( handleObj );
					}
				}
				if ( matches.length ) {
					handlerQueue.push({ elem: cur, matches: matches });
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		if ( handlers.length > delegateCount ) {
			handlerQueue.push({ elem: this, matches: handlers.slice( delegateCount ) });
		}

		// Run delegates first; they may want to stop propagation beneath us
		for ( i = 0; i < handlerQueue.length && !event.isPropagationStopped(); i++ ) {
			matched = handlerQueue[ i ];
			event.currentTarget = matched.elem;

			for ( j = 0; j < matched.matches.length && !event.isImmediatePropagationStopped(); j++ ) {
				handleObj = matched.matches[ j ];

				// Triggered event must either 1) be non-exclusive and have no namespace, or
				// 2) have namespace(s) a subset or equal to those in the bound event (both can have no namespace).
				if ( run_all || (!event.namespace && !handleObj.namespace) || event.namespace_re && event.namespace_re.test( handleObj.namespace ) ) {

					event.data = handleObj.data;
					event.handleObj = handleObj;

					ret = ( (jQuery.event.special[ handleObj.origType ] || {}).handle || handleObj.handler )
							.apply( matched.elem, args );

					if ( ret !== undefined ) {
						event.result = ret;
						if ( ret === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		return event.result;
	},

	// Includes some event props shared by KeyEvent and MouseEvent
	// *** attrChange attrName relatedNode srcElement  are not normalized, non-W3C, deprecated, will be removed in 1.8 ***
	props: "attrChange attrName relatedNode srcElement altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),

	fixHooks: {},

	keyHooks: {
		props: "char charCode key keyCode".split(" "),
		filter: function( event, original ) {

			// Add which for key events
			if ( event.which == null ) {
				event.which = original.charCode != null ? original.charCode : original.keyCode;
			}

			return event;
		}
	},

	mouseHooks: {
		props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
		filter: function( event, original ) {
			var eventDoc, doc, body,
				button = original.button,
				fromElement = original.fromElement;

			// Calculate pageX/Y if missing and clientX/Y available
			if ( event.pageX == null && original.clientX != null ) {
				eventDoc = event.target.ownerDocument || document;
				doc = eventDoc.documentElement;
				body = eventDoc.body;

				event.pageX = original.clientX + ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) - ( doc && doc.clientLeft || body && body.clientLeft || 0 );
				event.pageY = original.clientY + ( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) - ( doc && doc.clientTop  || body && body.clientTop  || 0 );
			}

			// Add relatedTarget, if necessary
			if ( !event.relatedTarget && fromElement ) {
				event.relatedTarget = fromElement === event.target ? original.toElement : fromElement;
			}

			// Add which for click: 1 === left; 2 === middle; 3 === right
			// Note: button is not normalized, so don't use it
			if ( !event.which && button !== undefined ) {
				event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
			}

			return event;
		}
	},

	fix: function( event ) {
		if ( event[ jQuery.expando ] ) {
			return event;
		}

		// Create a writable copy of the event object and normalize some properties
		var i, prop,
			originalEvent = event,
			fixHook = jQuery.event.fixHooks[ event.type ] || {},
			copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;

		event = jQuery.Event( originalEvent );

		for ( i = copy.length; i; ) {
			prop = copy[ --i ];
			event[ prop ] = originalEvent[ prop ];
		}

		// Fix target property, if necessary (#1925, IE 6/7/8 & Safari2)
		if ( !event.target ) {
			event.target = originalEvent.srcElement || document;
		}

		// Target should not be a text node (#504, Safari)
		if ( event.target.nodeType === 3 ) {
			event.target = event.target.parentNode;
		}

		// For mouse/key events; add metaKey if it's not there (#3368, IE6/7/8)
		if ( event.metaKey === undefined ) {
			event.metaKey = event.ctrlKey;
		}

		return fixHook.filter? fixHook.filter( event, originalEvent ) : event;
	},

	special: {
		ready: {
			// Make sure the ready event is setup
			setup: jQuery.bindReady
		},

		load: {
			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},

		focus: {
			delegateType: "focusin"
		},
		blur: {
			delegateType: "focusout"
		},

		beforeunload: {
			setup: function( data, namespaces, eventHandle ) {
				// We only want to do this special case on windows
				if ( jQuery.isWindow( this ) ) {
					this.onbeforeunload = eventHandle;
				}
			},

			teardown: function( namespaces, eventHandle ) {
				if ( this.onbeforeunload === eventHandle ) {
					this.onbeforeunload = null;
				}
			}
		}
	},

	simulate: function( type, elem, event, bubble ) {
		// Piggyback on a donor event to simulate a different one.
		// Fake originalEvent to avoid donor's stopPropagation, but if the
		// simulated event prevents default then we do the same on the donor.
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{ type: type,
				isSimulated: true,
				originalEvent: {}
			}
		);
		if ( bubble ) {
			jQuery.event.trigger( e, null, elem );
		} else {
			jQuery.event.dispatch.call( elem, e );
		}
		if ( e.isDefaultPrevented() ) {
			event.preventDefault();
		}
	}
};

// Some plugins are using, but it's undocumented/deprecated and will be removed.
// The 1.7 special event interface should provide all the hooks needed now.
jQuery.event.handle = jQuery.event.dispatch;

jQuery.removeEvent = document.removeEventListener ?
	function( elem, type, handle ) {
		if ( elem.removeEventListener ) {
			elem.removeEventListener( type, handle, false );
		}
	} :
	function( elem, type, handle ) {
		if ( elem.detachEvent ) {
			elem.detachEvent( "on" + type, handle );
		}
	};

jQuery.Event = function( src, props ) {
	// Allow instantiation without the 'new' keyword
	if ( !(this instanceof jQuery.Event) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = ( src.defaultPrevented || src.returnValue === false ||
			src.getPreventDefault && src.getPreventDefault() ) ? returnTrue : returnFalse;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || jQuery.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

function returnFalse() {
	return false;
}
function returnTrue() {
	return true;
}

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	preventDefault: function() {
		this.isDefaultPrevented = returnTrue;

		var e = this.originalEvent;
		if ( !e ) {
			return;
		}

		// if preventDefault exists run it on the original event
		if ( e.preventDefault ) {
			e.preventDefault();

		// otherwise set the returnValue property of the original event to false (IE)
		} else {
			e.returnValue = false;
		}
	},
	stopPropagation: function() {
		this.isPropagationStopped = returnTrue;

		var e = this.originalEvent;
		if ( !e ) {
			return;
		}
		// if stopPropagation exists run it on the original event
		if ( e.stopPropagation ) {
			e.stopPropagation();
		}
		// otherwise set the cancelBubble property of the original event to true (IE)
		e.cancelBubble = true;
	},
	stopImmediatePropagation: function() {
		this.isImmediatePropagationStopped = returnTrue;
		this.stopPropagation();
	},
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse
};

// Create mouseenter/leave events using mouseover/out and event-time checks
jQuery.each({
	mouseenter: "mouseover",
	mouseleave: "mouseout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj,
				selector = handleObj.selector,
				ret;

			// For mousenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || (related !== target && !jQuery.contains( target, related )) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
});

// IE submit delegation
if ( !jQuery.support.submitBubbles ) {

	jQuery.event.special.submit = {
		setup: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Lazy-add a submit handler when a descendant form may potentially be submitted
			jQuery.event.add( this, "click._submit keypress._submit", function( e ) {
				// Node name check avoids a VML-related crash in IE (#9807)
				var elem = e.target,
					form = jQuery.nodeName( elem, "input" ) || jQuery.nodeName( elem, "button" ) ? elem.form : undefined;
				if ( form && !form._submit_attached ) {
					jQuery.event.add( form, "submit._submit", function( event ) {
						// If form was submitted by the user, bubble the event up the tree
						if ( this.parentNode && !event.isTrigger ) {
							jQuery.event.simulate( "submit", this.parentNode, event, true );
						}
					});
					form._submit_attached = true;
				}
			});
			// return undefined since we don't need an event listener
		},

		teardown: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Remove delegated handlers; cleanData eventually reaps submit handlers attached above
			jQuery.event.remove( this, "._submit" );
		}
	};
}

// IE change delegation and checkbox/radio fix
if ( !jQuery.support.changeBubbles ) {

	jQuery.event.special.change = {

		setup: function() {

			if ( rformElems.test( this.nodeName ) ) {
				// IE doesn't fire change on a check/radio until blur; trigger it on click
				// after a propertychange. Eat the blur-change in special.change.handle.
				// This still fires onchange a second time for check/radio after blur.
				if ( this.type === "checkbox" || this.type === "radio" ) {
					jQuery.event.add( this, "propertychange._change", function( event ) {
						if ( event.originalEvent.propertyName === "checked" ) {
							this._just_changed = true;
						}
					});
					jQuery.event.add( this, "click._change", function( event ) {
						if ( this._just_changed && !event.isTrigger ) {
							this._just_changed = false;
							jQuery.event.simulate( "change", this, event, true );
						}
					});
				}
				return false;
			}
			// Delegated event; lazy-add a change handler on descendant inputs
			jQuery.event.add( this, "beforeactivate._change", function( e ) {
				var elem = e.target;

				if ( rformElems.test( elem.nodeName ) && !elem._change_attached ) {
					jQuery.event.add( elem, "change._change", function( event ) {
						if ( this.parentNode && !event.isSimulated && !event.isTrigger ) {
							jQuery.event.simulate( "change", this.parentNode, event, true );
						}
					});
					elem._change_attached = true;
				}
			});
		},

		handle: function( event ) {
			var elem = event.target;

			// Swallow native change events from checkbox/radio, we already triggered them above
			if ( this !== elem || event.isSimulated || event.isTrigger || (elem.type !== "radio" && elem.type !== "checkbox") ) {
				return event.handleObj.handler.apply( this, arguments );
			}
		},

		teardown: function() {
			jQuery.event.remove( this, "._change" );

			return rformElems.test( this.nodeName );
		}
	};
}

// Create "bubbling" focus and blur events
if ( !jQuery.support.focusinBubbles ) {
	jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler while someone wants focusin/focusout
		var attaches = 0,
			handler = function( event ) {
				jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ), true );
			};

		jQuery.event.special[ fix ] = {
			setup: function() {
				if ( attaches++ === 0 ) {
					document.addEventListener( orig, handler, true );
				}
			},
			teardown: function() {
				if ( --attaches === 0 ) {
					document.removeEventListener( orig, handler, true );
				}
			}
		};
	});
}

jQuery.fn.extend({

	on: function( types, selector, data, fn, /*INTERNAL*/ one ) {
		var origFn, type;

		// Types can be a map of types/handlers
		if ( typeof types === "object" ) {
			// ( types-Object, selector, data )
			if ( typeof selector !== "string" ) {
				// ( types-Object, data )
				data = selector;
				selector = undefined;
			}
			for ( type in types ) {
				this.on( type, selector, data, types[ type ], one );
			}
			return this;
		}

		if ( data == null && fn == null ) {
			// ( types, fn )
			fn = selector;
			data = selector = undefined;
		} else if ( fn == null ) {
			if ( typeof selector === "string" ) {
				// ( types, selector, fn )
				fn = data;
				data = undefined;
			} else {
				// ( types, data, fn )
				fn = data;
				data = selector;
				selector = undefined;
			}
		}
		if ( fn === false ) {
			fn = returnFalse;
		} else if ( !fn ) {
			return this;
		}

		if ( one === 1 ) {
			origFn = fn;
			fn = function( event ) {
				// Can use an empty set, since event contains the info
				jQuery().off( event );
				return origFn.apply( this, arguments );
			};
			// Use same guid so caller can remove using origFn
			fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
		}
		return this.each( function() {
			jQuery.event.add( this, types, fn, data, selector );
		});
	},
	one: function( types, selector, data, fn ) {
		return this.on.call( this, types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		if ( types && types.preventDefault && types.handleObj ) {
			// ( event )  dispatched jQuery.Event
			var handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace? handleObj.type + "." + handleObj.namespace : handleObj.type,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {
			// ( types-object [, selector] )
			for ( var type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {
			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each(function() {
			jQuery.event.remove( this, types, fn, selector );
		});
	},

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	live: function( types, data, fn ) {
		jQuery( this.context ).on( types, this.selector, data, fn );
		return this;
	},
	die: function( types, fn ) {
		jQuery( this.context ).off( types, this.selector || "**", fn );
		return this;
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {
		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length == 1? this.off( selector, "**" ) : this.off( types, selector, fn );
	},

	trigger: function( type, data ) {
		return this.each(function() {
			jQuery.event.trigger( type, data, this );
		});
	},
	triggerHandler: function( type, data ) {
		if ( this[0] ) {
			return jQuery.event.trigger( type, data, this[0], true );
		}
	},

	toggle: function( fn ) {
		// Save reference to arguments for access in closure
		var args = arguments,
			guid = fn.guid || jQuery.guid++,
			i = 0,
			toggler = function( event ) {
				// Figure out which function to execute
				var lastToggle = ( jQuery._data( this, "lastToggle" + fn.guid ) || 0 ) % i;
				jQuery._data( this, "lastToggle" + fn.guid, lastToggle + 1 );

				// Make sure that clicks stop
				event.preventDefault();

				// and execute the function
				return args[ lastToggle ].apply( this, arguments ) || false;
			};

		// link all the functions, so any of them can unbind this click handler
		toggler.guid = guid;
		while ( i < args.length ) {
			args[ i++ ].guid = guid;
		}

		return this.click( toggler );
	},

	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	}
});

jQuery.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup error contextmenu").split(" "), function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		if ( fn == null ) {
			fn = data;
			data = null;
		}

		return arguments.length > 0 ?
			this.on( name, null, data, fn ) :
			this.trigger( name );
	};

	if ( jQuery.attrFn ) {
		jQuery.attrFn[ name ] = true;
	}

	if ( rkeyEvent.test( name ) ) {
		jQuery.event.fixHooks[ name ] = jQuery.event.keyHooks;
	}

	if ( rmouseEvent.test( name ) ) {
		jQuery.event.fixHooks[ name ] = jQuery.event.mouseHooks;
	}
});



/*!
 * Sizzle CSS Selector Engine
 *  Copyright 2011, The Dojo Foundation
 *  Released under the MIT, BSD, and GPL Licenses.
 *  More information: http://sizzlejs.com/
 */
(function(){

var chunker = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g,
	expando = "sizcache" + (Math.random() + '').replace('.', ''),
	done = 0,
	toString = Object.prototype.toString,
	hasDuplicate = false,
	baseHasDuplicate = true,
	rBackslash = /\\/g,
	rReturn = /\r\n/g,
	rNonWord = /\W/;

// Here we check if the JavaScript engine is using some sort of
// optimization where it does not always call our comparision
// function. If that is the case, discard the hasDuplicate value.
//   Thus far that includes Google Chrome.
[0, 0].sort(function() {
	baseHasDuplicate = false;
	return 0;
});

var Sizzle = function( selector, context, results, seed ) {
	results = results || [];
	context = context || document;

	var origContext = context;

	if ( context.nodeType !== 1 && context.nodeType !== 9 ) {
		return [];
	}
	
	if ( !selector || typeof selector !== "string" ) {
		return results;
	}

	var m, set, checkSet, extra, ret, cur, pop, i,
		prune = true,
		contextXML = Sizzle.isXML( context ),
		parts = [],
		soFar = selector;
	
	// Reset the position of the chunker regexp (start from head)
	do {
		chunker.exec( "" );
		m = chunker.exec( soFar );

		if ( m ) {
			soFar = m[3];
		
			parts.push( m[1] );
		
			if ( m[2] ) {
				extra = m[3];
				break;
			}
		}
	} while ( m );

	if ( parts.length > 1 && origPOS.exec( selector ) ) {

		if ( parts.length === 2 && Expr.relative[ parts[0] ] ) {
			set = posProcess( parts[0] + parts[1], context, seed );

		} else {
			set = Expr.relative[ parts[0] ] ?
				[ context ] :
				Sizzle( parts.shift(), context );

			while ( parts.length ) {
				selector = parts.shift();

				if ( Expr.relative[ selector ] ) {
					selector += parts.shift();
				}
				
				set = posProcess( selector, set, seed );
			}
		}

	} else {
		// Take a shortcut and set the context if the root selector is an ID
		// (but not if it'll be faster if the inner selector is an ID)
		if ( !seed && parts.length > 1 && context.nodeType === 9 && !contextXML &&
				Expr.match.ID.test(parts[0]) && !Expr.match.ID.test(parts[parts.length - 1]) ) {

			ret = Sizzle.find( parts.shift(), context, contextXML );
			context = ret.expr ?
				Sizzle.filter( ret.expr, ret.set )[0] :
				ret.set[0];
		}

		if ( context ) {
			ret = seed ?
				{ expr: parts.pop(), set: makeArray(seed) } :
				Sizzle.find( parts.pop(), parts.length === 1 && (parts[0] === "~" || parts[0] === "+") && context.parentNode ? context.parentNode : context, contextXML );

			set = ret.expr ?
				Sizzle.filter( ret.expr, ret.set ) :
				ret.set;

			if ( parts.length > 0 ) {
				checkSet = makeArray( set );

			} else {
				prune = false;
			}

			while ( parts.length ) {
				cur = parts.pop();
				pop = cur;

				if ( !Expr.relative[ cur ] ) {
					cur = "";
				} else {
					pop = parts.pop();
				}

				if ( pop == null ) {
					pop = context;
				}

				Expr.relative[ cur ]( checkSet, pop, contextXML );
			}

		} else {
			checkSet = parts = [];
		}
	}

	if ( !checkSet ) {
		checkSet = set;
	}

	if ( !checkSet ) {
		Sizzle.error( cur || selector );
	}

	if ( toString.call(checkSet) === "[object Array]" ) {
		if ( !prune ) {
			results.push.apply( results, checkSet );

		} else if ( context && context.nodeType === 1 ) {
			for ( i = 0; checkSet[i] != null; i++ ) {
				if ( checkSet[i] && (checkSet[i] === true || checkSet[i].nodeType === 1 && Sizzle.contains(context, checkSet[i])) ) {
					results.push( set[i] );
				}
			}

		} else {
			for ( i = 0; checkSet[i] != null; i++ ) {
				if ( checkSet[i] && checkSet[i].nodeType === 1 ) {
					results.push( set[i] );
				}
			}
		}

	} else {
		makeArray( checkSet, results );
	}

	if ( extra ) {
		Sizzle( extra, origContext, results, seed );
		Sizzle.uniqueSort( results );
	}

	return results;
};

Sizzle.uniqueSort = function( results ) {
	if ( sortOrder ) {
		hasDuplicate = baseHasDuplicate;
		results.sort( sortOrder );

		if ( hasDuplicate ) {
			for ( var i = 1; i < results.length; i++ ) {
				if ( results[i] === results[ i - 1 ] ) {
					results.splice( i--, 1 );
				}
			}
		}
	}

	return results;
};

Sizzle.matches = function( expr, set ) {
	return Sizzle( expr, null, null, set );
};

Sizzle.matchesSelector = function( node, expr ) {
	return Sizzle( expr, null, null, [node] ).length > 0;
};

Sizzle.find = function( expr, context, isXML ) {
	var set, i, len, match, type, left;

	if ( !expr ) {
		return [];
	}

	for ( i = 0, len = Expr.order.length; i < len; i++ ) {
		type = Expr.order[i];
		
		if ( (match = Expr.leftMatch[ type ].exec( expr )) ) {
			left = match[1];
			match.splice( 1, 1 );

			if ( left.substr( left.length - 1 ) !== "\\" ) {
				match[1] = (match[1] || "").replace( rBackslash, "" );
				set = Expr.find[ type ]( match, context, isXML );

				if ( set != null ) {
					expr = expr.replace( Expr.match[ type ], "" );
					break;
				}
			}
		}
	}

	if ( !set ) {
		set = typeof context.getElementsByTagName !== "undefined" ?
			context.getElementsByTagName( "*" ) :
			[];
	}

	return { set: set, expr: expr };
};

Sizzle.filter = function( expr, set, inplace, not ) {
	var match, anyFound,
		type, found, item, filter, left,
		i, pass,
		old = expr,
		result = [],
		curLoop = set,
		isXMLFilter = set && set[0] && Sizzle.isXML( set[0] );

	while ( expr && set.length ) {
		for ( type in Expr.filter ) {
			if ( (match = Expr.leftMatch[ type ].exec( expr )) != null && match[2] ) {
				filter = Expr.filter[ type ];
				left = match[1];

				anyFound = false;

				match.splice(1,1);

				if ( left.substr( left.length - 1 ) === "\\" ) {
					continue;
				}

				if ( curLoop === result ) {
					result = [];
				}

				if ( Expr.preFilter[ type ] ) {
					match = Expr.preFilter[ type ]( match, curLoop, inplace, result, not, isXMLFilter );

					if ( !match ) {
						anyFound = found = true;

					} else if ( match === true ) {
						continue;
					}
				}

				if ( match ) {
					for ( i = 0; (item = curLoop[i]) != null; i++ ) {
						if ( item ) {
							found = filter( item, match, i, curLoop );
							pass = not ^ found;

							if ( inplace && found != null ) {
								if ( pass ) {
									anyFound = true;

								} else {
									curLoop[i] = false;
								}

							} else if ( pass ) {
								result.push( item );
								anyFound = true;
							}
						}
					}
				}

				if ( found !== undefined ) {
					if ( !inplace ) {
						curLoop = result;
					}

					expr = expr.replace( Expr.match[ type ], "" );

					if ( !anyFound ) {
						return [];
					}

					break;
				}
			}
		}

		// Improper expression
		if ( expr === old ) {
			if ( anyFound == null ) {
				Sizzle.error( expr );

			} else {
				break;
			}
		}

		old = expr;
	}

	return curLoop;
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Utility function for retreiving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
var getText = Sizzle.getText = function( elem ) {
    var i, node,
		nodeType = elem.nodeType,
		ret = "";

	if ( nodeType ) {
		if ( nodeType === 1 || nodeType === 9 ) {
			// Use textContent || innerText for elements
			if ( typeof elem.textContent === 'string' ) {
				return elem.textContent;
			} else if ( typeof elem.innerText === 'string' ) {
				// Replace IE's carriage returns
				return elem.innerText.replace( rReturn, '' );
			} else {
				// Traverse it's children
				for ( elem = elem.firstChild; elem; elem = elem.nextSibling) {
					ret += getText( elem );
				}
			}
		} else if ( nodeType === 3 || nodeType === 4 ) {
			return elem.nodeValue;
		}
	} else {

		// If no nodeType, this is expected to be an array
		for ( i = 0; (node = elem[i]); i++ ) {
			// Do not traverse comment nodes
			if ( node.nodeType !== 8 ) {
				ret += getText( node );
			}
		}
	}
	return ret;
};

var Expr = Sizzle.selectors = {
	order: [ "ID", "NAME", "TAG" ],

	match: {
		ID: /#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
		CLASS: /\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
		NAME: /\[name=['"]*((?:[\w\u00c0-\uFFFF\-]|\\.)+)['"]*\]/,
		ATTR: /\[\s*((?:[\w\u00c0-\uFFFF\-]|\\.)+)\s*(?:(\S?=)\s*(?:(['"])(.*?)\3|(#?(?:[\w\u00c0-\uFFFF\-]|\\.)*)|)|)\s*\]/,
		TAG: /^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/,
		CHILD: /:(only|nth|last|first)-child(?:\(\s*(even|odd|(?:[+\-]?\d+|(?:[+\-]?\d*)?n\s*(?:[+\-]\s*\d+)?))\s*\))?/,
		POS: /:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^\-]|$)/,
		PSEUDO: /:((?:[\w\u00c0-\uFFFF\-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/
	},

	leftMatch: {},

	attrMap: {
		"class": "className",
		"for": "htmlFor"
	},

	attrHandle: {
		href: function( elem ) {
			return elem.getAttribute( "href" );
		},
		type: function( elem ) {
			return elem.getAttribute( "type" );
		}
	},

	relative: {
		"+": function(checkSet, part){
			var isPartStr = typeof part === "string",
				isTag = isPartStr && !rNonWord.test( part ),
				isPartStrNotTag = isPartStr && !isTag;

			if ( isTag ) {
				part = part.toLowerCase();
			}

			for ( var i = 0, l = checkSet.length, elem; i < l; i++ ) {
				if ( (elem = checkSet[i]) ) {
					while ( (elem = elem.previousSibling) && elem.nodeType !== 1 ) {}

					checkSet[i] = isPartStrNotTag || elem && elem.nodeName.toLowerCase() === part ?
						elem || false :
						elem === part;
				}
			}

			if ( isPartStrNotTag ) {
				Sizzle.filter( part, checkSet, true );
			}
		},

		">": function( checkSet, part ) {
			var elem,
				isPartStr = typeof part === "string",
				i = 0,
				l = checkSet.length;

			if ( isPartStr && !rNonWord.test( part ) ) {
				part = part.toLowerCase();

				for ( ; i < l; i++ ) {
					elem = checkSet[i];

					if ( elem ) {
						var parent = elem.parentNode;
						checkSet[i] = parent.nodeName.toLowerCase() === part ? parent : false;
					}
				}

			} else {
				for ( ; i < l; i++ ) {
					elem = checkSet[i];

					if ( elem ) {
						checkSet[i] = isPartStr ?
							elem.parentNode :
							elem.parentNode === part;
					}
				}

				if ( isPartStr ) {
					Sizzle.filter( part, checkSet, true );
				}
			}
		},

		"": function(checkSet, part, isXML){
			var nodeCheck,
				doneName = done++,
				checkFn = dirCheck;

			if ( typeof part === "string" && !rNonWord.test( part ) ) {
				part = part.toLowerCase();
				nodeCheck = part;
				checkFn = dirNodeCheck;
			}

			checkFn( "parentNode", part, doneName, checkSet, nodeCheck, isXML );
		},

		"~": function( checkSet, part, isXML ) {
			var nodeCheck,
				doneName = done++,
				checkFn = dirCheck;

			if ( typeof part === "string" && !rNonWord.test( part ) ) {
				part = part.toLowerCase();
				nodeCheck = part;
				checkFn = dirNodeCheck;
			}

			checkFn( "previousSibling", part, doneName, checkSet, nodeCheck, isXML );
		}
	},

	find: {
		ID: function( match, context, isXML ) {
			if ( typeof context.getElementById !== "undefined" && !isXML ) {
				var m = context.getElementById(match[1]);
				// Check parentNode to catch when Blackberry 4.6 returns
				// nodes that are no longer in the document #6963
				return m && m.parentNode ? [m] : [];
			}
		},

		NAME: function( match, context ) {
			if ( typeof context.getElementsByName !== "undefined" ) {
				var ret = [],
					results = context.getElementsByName( match[1] );

				for ( var i = 0, l = results.length; i < l; i++ ) {
					if ( results[i].getAttribute("name") === match[1] ) {
						ret.push( results[i] );
					}
				}

				return ret.length === 0 ? null : ret;
			}
		},

		TAG: function( match, context ) {
			if ( typeof context.getElementsByTagName !== "undefined" ) {
				return context.getElementsByTagName( match[1] );
			}
		}
	},
	preFilter: {
		CLASS: function( match, curLoop, inplace, result, not, isXML ) {
			match = " " + match[1].replace( rBackslash, "" ) + " ";

			if ( isXML ) {
				return match;
			}

			for ( var i = 0, elem; (elem = curLoop[i]) != null; i++ ) {
				if ( elem ) {
					if ( not ^ (elem.className && (" " + elem.className + " ").replace(/[\t\n\r]/g, " ").indexOf(match) >= 0) ) {
						if ( !inplace ) {
							result.push( elem );
						}

					} else if ( inplace ) {
						curLoop[i] = false;
					}
				}
			}

			return false;
		},

		ID: function( match ) {
			return match[1].replace( rBackslash, "" );
		},

		TAG: function( match, curLoop ) {
			return match[1].replace( rBackslash, "" ).toLowerCase();
		},

		CHILD: function( match ) {
			if ( match[1] === "nth" ) {
				if ( !match[2] ) {
					Sizzle.error( match[0] );
				}

				match[2] = match[2].replace(/^\+|\s*/g, '');

				// parse equations like 'even', 'odd', '5', '2n', '3n+2', '4n-1', '-n+6'
				var test = /(-?)(\d*)(?:n([+\-]?\d*))?/.exec(
					match[2] === "even" && "2n" || match[2] === "odd" && "2n+1" ||
					!/\D/.test( match[2] ) && "0n+" + match[2] || match[2]);

				// calculate the numbers (first)n+(last) including if they are negative
				match[2] = (test[1] + (test[2] || 1)) - 0;
				match[3] = test[3] - 0;
			}
			else if ( match[2] ) {
				Sizzle.error( match[0] );
			}

			// TODO: Move to normal caching system
			match[0] = done++;

			return match;
		},

		ATTR: function( match, curLoop, inplace, result, not, isXML ) {
			var name = match[1] = match[1].replace( rBackslash, "" );
			
			if ( !isXML && Expr.attrMap[name] ) {
				match[1] = Expr.attrMap[name];
			}

			// Handle if an un-quoted value was used
			match[4] = ( match[4] || match[5] || "" ).replace( rBackslash, "" );

			if ( match[2] === "~=" ) {
				match[4] = " " + match[4] + " ";
			}

			return match;
		},

		PSEUDO: function( match, curLoop, inplace, result, not ) {
			if ( match[1] === "not" ) {
				// If we're dealing with a complex expression, or a simple one
				if ( ( chunker.exec(match[3]) || "" ).length > 1 || /^\w/.test(match[3]) ) {
					match[3] = Sizzle(match[3], null, null, curLoop);

				} else {
					var ret = Sizzle.filter(match[3], curLoop, inplace, true ^ not);

					if ( !inplace ) {
						result.push.apply( result, ret );
					}

					return false;
				}

			} else if ( Expr.match.POS.test( match[0] ) || Expr.match.CHILD.test( match[0] ) ) {
				return true;
			}
			
			return match;
		},

		POS: function( match ) {
			match.unshift( true );

			return match;
		}
	},
	
	filters: {
		enabled: function( elem ) {
			return elem.disabled === false && elem.type !== "hidden";
		},

		disabled: function( elem ) {
			return elem.disabled === true;
		},

		checked: function( elem ) {
			return elem.checked === true;
		},
		
		selected: function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}
			
			return elem.selected === true;
		},

		parent: function( elem ) {
			return !!elem.firstChild;
		},

		empty: function( elem ) {
			return !elem.firstChild;
		},

		has: function( elem, i, match ) {
			return !!Sizzle( match[3], elem ).length;
		},

		header: function( elem ) {
			return (/h\d/i).test( elem.nodeName );
		},

		text: function( elem ) {
			var attr = elem.getAttribute( "type" ), type = elem.type;
			// IE6 and 7 will map elem.type to 'text' for new HTML5 types (search, etc) 
			// use getAttribute instead to test this case
			return elem.nodeName.toLowerCase() === "input" && "text" === type && ( attr === type || attr === null );
		},

		radio: function( elem ) {
			return elem.nodeName.toLowerCase() === "input" && "radio" === elem.type;
		},

		checkbox: function( elem ) {
			return elem.nodeName.toLowerCase() === "input" && "checkbox" === elem.type;
		},

		file: function( elem ) {
			return elem.nodeName.toLowerCase() === "input" && "file" === elem.type;
		},

		password: function( elem ) {
			return elem.nodeName.toLowerCase() === "input" && "password" === elem.type;
		},

		submit: function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return (name === "input" || name === "button") && "submit" === elem.type;
		},

		image: function( elem ) {
			return elem.nodeName.toLowerCase() === "input" && "image" === elem.type;
		},

		reset: function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return (name === "input" || name === "button") && "reset" === elem.type;
		},

		button: function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && "button" === elem.type || name === "button";
		},

		input: function( elem ) {
			return (/input|select|textarea|button/i).test( elem.nodeName );
		},

		focus: function( elem ) {
			return elem === elem.ownerDocument.activeElement;
		}
	},
	setFilters: {
		first: function( elem, i ) {
			return i === 0;
		},

		last: function( elem, i, match, array ) {
			return i === array.length - 1;
		},

		even: function( elem, i ) {
			return i % 2 === 0;
		},

		odd: function( elem, i ) {
			return i % 2 === 1;
		},

		lt: function( elem, i, match ) {
			return i < match[3] - 0;
		},

		gt: function( elem, i, match ) {
			return i > match[3] - 0;
		},

		nth: function( elem, i, match ) {
			return match[3] - 0 === i;
		},

		eq: function( elem, i, match ) {
			return match[3] - 0 === i;
		}
	},
	filter: {
		PSEUDO: function( elem, match, i, array ) {
			var name = match[1],
				filter = Expr.filters[ name ];

			if ( filter ) {
				return filter( elem, i, match, array );

			} else if ( name === "contains" ) {
				return (elem.textContent || elem.innerText || getText([ elem ]) || "").indexOf(match[3]) >= 0;

			} else if ( name === "not" ) {
				var not = match[3];

				for ( var j = 0, l = not.length; j < l; j++ ) {
					if ( not[j] === elem ) {
						return false;
					}
				}

				return true;

			} else {
				Sizzle.error( name );
			}
		},

		CHILD: function( elem, match ) {
			var first, last,
				doneName, parent, cache,
				count, diff,
				type = match[1],
				node = elem;

			switch ( type ) {
				case "only":
				case "first":
					while ( (node = node.previousSibling) )	 {
						if ( node.nodeType === 1 ) { 
							return false; 
						}
					}

					if ( type === "first" ) { 
						return true; 
					}

					node = elem;

				case "last":
					while ( (node = node.nextSibling) )	 {
						if ( node.nodeType === 1 ) { 
							return false; 
						}
					}

					return true;

				case "nth":
					first = match[2];
					last = match[3];

					if ( first === 1 && last === 0 ) {
						return true;
					}
					
					doneName = match[0];
					parent = elem.parentNode;
	
					if ( parent && (parent[ expando ] !== doneName || !elem.nodeIndex) ) {
						count = 0;
						
						for ( node = parent.firstChild; node; node = node.nextSibling ) {
							if ( node.nodeType === 1 ) {
								node.nodeIndex = ++count;
							}
						} 

						parent[ expando ] = doneName;
					}
					
					diff = elem.nodeIndex - last;

					if ( first === 0 ) {
						return diff === 0;

					} else {
						return ( diff % first === 0 && diff / first >= 0 );
					}
			}
		},

		ID: function( elem, match ) {
			return elem.nodeType === 1 && elem.getAttribute("id") === match;
		},

		TAG: function( elem, match ) {
			return (match === "*" && elem.nodeType === 1) || !!elem.nodeName && elem.nodeName.toLowerCase() === match;
		},
		
		CLASS: function( elem, match ) {
			return (" " + (elem.className || elem.getAttribute("class")) + " ")
				.indexOf( match ) > -1;
		},

		ATTR: function( elem, match ) {
			var name = match[1],
				result = Sizzle.attr ?
					Sizzle.attr( elem, name ) :
					Expr.attrHandle[ name ] ?
					Expr.attrHandle[ name ]( elem ) :
					elem[ name ] != null ?
						elem[ name ] :
						elem.getAttribute( name ),
				value = result + "",
				type = match[2],
				check = match[4];

			return result == null ?
				type === "!=" :
				!type && Sizzle.attr ?
				result != null :
				type === "=" ?
				value === check :
				type === "*=" ?
				value.indexOf(check) >= 0 :
				type === "~=" ?
				(" " + value + " ").indexOf(check) >= 0 :
				!check ?
				value && result !== false :
				type === "!=" ?
				value !== check :
				type === "^=" ?
				value.indexOf(check) === 0 :
				type === "$=" ?
				value.substr(value.length - check.length) === check :
				type === "|=" ?
				value === check || value.substr(0, check.length + 1) === check + "-" :
				false;
		},

		POS: function( elem, match, i, array ) {
			var name = match[2],
				filter = Expr.setFilters[ name ];

			if ( filter ) {
				return filter( elem, i, match, array );
			}
		}
	}
};

var origPOS = Expr.match.POS,
	fescape = function(all, num){
		return "\\" + (num - 0 + 1);
	};

for ( var type in Expr.match ) {
	Expr.match[ type ] = new RegExp( Expr.match[ type ].source + (/(?![^\[]*\])(?![^\(]*\))/.source) );
	Expr.leftMatch[ type ] = new RegExp( /(^(?:.|\r|\n)*?)/.source + Expr.match[ type ].source.replace(/\\(\d+)/g, fescape) );
}

var makeArray = function( array, results ) {
	array = Array.prototype.slice.call( array, 0 );

	if ( results ) {
		results.push.apply( results, array );
		return results;
	}
	
	return array;
};

// Perform a simple check to determine if the browser is capable of
// converting a NodeList to an array using builtin methods.
// Also verifies that the returned array holds DOM nodes
// (which is not the case in the Blackberry browser)
try {
	Array.prototype.slice.call( document.documentElement.childNodes, 0 )[0].nodeType;

// Provide a fallback method if it does not work
} catch( e ) {
	makeArray = function( array, results ) {
		var i = 0,
			ret = results || [];

		if ( toString.call(array) === "[object Array]" ) {
			Array.prototype.push.apply( ret, array );

		} else {
			if ( typeof array.length === "number" ) {
				for ( var l = array.length; i < l; i++ ) {
					ret.push( array[i] );
				}

			} else {
				for ( ; array[i]; i++ ) {
					ret.push( array[i] );
				}
			}
		}

		return ret;
	};
}

var sortOrder, siblingCheck;

if ( document.documentElement.compareDocumentPosition ) {
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		if ( !a.compareDocumentPosition || !b.compareDocumentPosition ) {
			return a.compareDocumentPosition ? -1 : 1;
		}

		return a.compareDocumentPosition(b) & 4 ? -1 : 1;
	};

} else {
	sortOrder = function( a, b ) {
		// The nodes are identical, we can exit early
		if ( a === b ) {
			hasDuplicate = true;
			return 0;

		// Fallback to using sourceIndex (in IE) if it's available on both nodes
		} else if ( a.sourceIndex && b.sourceIndex ) {
			return a.sourceIndex - b.sourceIndex;
		}

		var al, bl,
			ap = [],
			bp = [],
			aup = a.parentNode,
			bup = b.parentNode,
			cur = aup;

		// If the nodes are siblings (or identical) we can do a quick check
		if ( aup === bup ) {
			return siblingCheck( a, b );

		// If no parents were found then the nodes are disconnected
		} else if ( !aup ) {
			return -1;

		} else if ( !bup ) {
			return 1;
		}

		// Otherwise they're somewhere else in the tree so we need
		// to build up a full list of the parentNodes for comparison
		while ( cur ) {
			ap.unshift( cur );
			cur = cur.parentNode;
		}

		cur = bup;

		while ( cur ) {
			bp.unshift( cur );
			cur = cur.parentNode;
		}

		al = ap.length;
		bl = bp.length;

		// Start walking down the tree looking for a discrepancy
		for ( var i = 0; i < al && i < bl; i++ ) {
			if ( ap[i] !== bp[i] ) {
				return siblingCheck( ap[i], bp[i] );
			}
		}

		// We ended someplace up the tree so do a sibling check
		return i === al ?
			siblingCheck( a, bp[i], -1 ) :
			siblingCheck( ap[i], b, 1 );
	};

	siblingCheck = function( a, b, ret ) {
		if ( a === b ) {
			return ret;
		}

		var cur = a.nextSibling;

		while ( cur ) {
			if ( cur === b ) {
				return -1;
			}

			cur = cur.nextSibling;
		}

		return 1;
	};
}

// Check to see if the browser returns elements by name when
// querying by getElementById (and provide a workaround)
(function(){
	// We're going to inject a fake input element with a specified name
	var form = document.createElement("div"),
		id = "script" + (new Date()).getTime(),
		root = document.documentElement;

	form.innerHTML = "<a name='" + id + "'/>";

	// Inject it into the root element, check its status, and remove it quickly
	root.insertBefore( form, root.firstChild );

	// The workaround has to do additional checks after a getElementById
	// Which slows things down for other browsers (hence the branching)
	if ( document.getElementById( id ) ) {
		Expr.find.ID = function( match, context, isXML ) {
			if ( typeof context.getElementById !== "undefined" && !isXML ) {
				var m = context.getElementById(match[1]);

				return m ?
					m.id === match[1] || typeof m.getAttributeNode !== "undefined" && m.getAttributeNode("id").nodeValue === match[1] ?
						[m] :
						undefined :
					[];
			}
		};

		Expr.filter.ID = function( elem, match ) {
			var node = typeof elem.getAttributeNode !== "undefined" && elem.getAttributeNode("id");

			return elem.nodeType === 1 && node && node.nodeValue === match;
		};
	}

	root.removeChild( form );

	// release memory in IE
	root = form = null;
})();

(function(){
	// Check to see if the browser returns only elements
	// when doing getElementsByTagName("*")

	// Create a fake element
	var div = document.createElement("div");
	div.appendChild( document.createComment("") );

	// Make sure no comments are found
	if ( div.getElementsByTagName("*").length > 0 ) {
		Expr.find.TAG = function( match, context ) {
			var results = context.getElementsByTagName( match[1] );

			// Filter out possible comments
			if ( match[1] === "*" ) {
				var tmp = [];

				for ( var i = 0; results[i]; i++ ) {
					if ( results[i].nodeType === 1 ) {
						tmp.push( results[i] );
					}
				}

				results = tmp;
			}

			return results;
		};
	}

	// Check to see if an attribute returns normalized href attributes
	div.innerHTML = "<a href='#'></a>";

	if ( div.firstChild && typeof div.firstChild.getAttribute !== "undefined" &&
			div.firstChild.getAttribute("href") !== "#" ) {

		Expr.attrHandle.href = function( elem ) {
			return elem.getAttribute( "href", 2 );
		};
	}

	// release memory in IE
	div = null;
})();

if ( document.querySelectorAll ) {
	(function(){
		var oldSizzle = Sizzle,
			div = document.createElement("div"),
			id = "__sizzle__";

		div.innerHTML = "<p class='TEST'></p>";

		// Safari can't handle uppercase or unicode characters when
		// in quirks mode.
		if ( div.querySelectorAll && div.querySelectorAll(".TEST").length === 0 ) {
			return;
		}
	
		Sizzle = function( query, context, extra, seed ) {
			context = context || document;

			// Only use querySelectorAll on non-XML documents
			// (ID selectors don't work in non-HTML documents)
			if ( !seed && !Sizzle.isXML(context) ) {
				// See if we find a selector to speed up
				var match = /^(\w+$)|^\.([\w\-]+$)|^#([\w\-]+$)/.exec( query );
				
				if ( match && (context.nodeType === 1 || context.nodeType === 9) ) {
					// Speed-up: Sizzle("TAG")
					if ( match[1] ) {
						return makeArray( context.getElementsByTagName( query ), extra );
					
					// Speed-up: Sizzle(".CLASS")
					} else if ( match[2] && Expr.find.CLASS && context.getElementsByClassName ) {
						return makeArray( context.getElementsByClassName( match[2] ), extra );
					}
				}
				
				if ( context.nodeType === 9 ) {
					// Speed-up: Sizzle("body")
					// The body element only exists once, optimize finding it
					if ( query === "body" && context.body ) {
						return makeArray( [ context.body ], extra );
						
					// Speed-up: Sizzle("#ID")
					} else if ( match && match[3] ) {
						var elem = context.getElementById( match[3] );

						// Check parentNode to catch when Blackberry 4.6 returns
						// nodes that are no longer in the document #6963
						if ( elem && elem.parentNode ) {
							// Handle the case where IE and Opera return items
							// by name instead of ID
							if ( elem.id === match[3] ) {
								return makeArray( [ elem ], extra );
							}
							
						} else {
							return makeArray( [], extra );
						}
					}
					
					try {
						return makeArray( context.querySelectorAll(query), extra );
					} catch(qsaError) {}

				// qSA works strangely on Element-rooted queries
				// We can work around this by specifying an extra ID on the root
				// and working up from there (Thanks to Andrew Dupont for the technique)
				// IE 8 doesn't work on object elements
				} else if ( context.nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
					var oldContext = context,
						old = context.getAttribute( "id" ),
						nid = old || id,
						hasParent = context.parentNode,
						relativeHierarchySelector = /^\s*[+~]/.test( query );

					if ( !old ) {
						context.setAttribute( "id", nid );
					} else {
						nid = nid.replace( /'/g, "\\$&" );
					}
					if ( relativeHierarchySelector && hasParent ) {
						context = context.parentNode;
					}

					try {
						if ( !relativeHierarchySelector || hasParent ) {
							return makeArray( context.querySelectorAll( "[id='" + nid + "'] " + query ), extra );
						}

					} catch(pseudoError) {
					} finally {
						if ( !old ) {
							oldContext.removeAttribute( "id" );
						}
					}
				}
			}
		
			return oldSizzle(query, context, extra, seed);
		};

		for ( var prop in oldSizzle ) {
			Sizzle[ prop ] = oldSizzle[ prop ];
		}

		// release memory in IE
		div = null;
	})();
}

(function(){
	var html = document.documentElement,
		matches = html.matchesSelector || html.mozMatchesSelector || html.webkitMatchesSelector || html.msMatchesSelector;

	if ( matches ) {
		// Check to see if it's possible to do matchesSelector
		// on a disconnected node (IE 9 fails this)
		var disconnectedMatch = !matches.call( document.createElement( "div" ), "div" ),
			pseudoWorks = false;

		try {
			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( document.documentElement, "[test!='']:sizzle" );
	
		} catch( pseudoError ) {
			pseudoWorks = true;
		}

		Sizzle.matchesSelector = function( node, expr ) {
			// Make sure that attribute selectors are quoted
			expr = expr.replace(/\=\s*([^'"\]]*)\s*\]/g, "='$1']");

			if ( !Sizzle.isXML( node ) ) {
				try { 
					if ( pseudoWorks || !Expr.match.PSEUDO.test( expr ) && !/!=/.test( expr ) ) {
						var ret = matches.call( node, expr );

						// IE 9's matchesSelector returns false on disconnected nodes
						if ( ret || !disconnectedMatch ||
								// As well, disconnected nodes are said to be in a document
								// fragment in IE 9, so check for that
								node.document && node.document.nodeType !== 11 ) {
							return ret;
						}
					}
				} catch(e) {}
			}

			return Sizzle(expr, null, null, [node]).length > 0;
		};
	}
})();

(function(){
	var div = document.createElement("div");

	div.innerHTML = "<div class='test e'></div><div class='test'></div>";

	// Opera can't find a second classname (in 9.6)
	// Also, make sure that getElementsByClassName actually exists
	if ( !div.getElementsByClassName || div.getElementsByClassName("e").length === 0 ) {
		return;
	}

	// Safari caches class attributes, doesn't catch changes (in 3.2)
	div.lastChild.className = "e";

	if ( div.getElementsByClassName("e").length === 1 ) {
		return;
	}
	
	Expr.order.splice(1, 0, "CLASS");
	Expr.find.CLASS = function( match, context, isXML ) {
		if ( typeof context.getElementsByClassName !== "undefined" && !isXML ) {
			return context.getElementsByClassName(match[1]);
		}
	};

	// release memory in IE
	div = null;
})();

function dirNodeCheck( dir, cur, doneName, checkSet, nodeCheck, isXML ) {
	for ( var i = 0, l = checkSet.length; i < l; i++ ) {
		var elem = checkSet[i];

		if ( elem ) {
			var match = false;

			elem = elem[dir];

			while ( elem ) {
				if ( elem[ expando ] === doneName ) {
					match = checkSet[elem.sizset];
					break;
				}

				if ( elem.nodeType === 1 && !isXML ){
					elem[ expando ] = doneName;
					elem.sizset = i;
				}

				if ( elem.nodeName.toLowerCase() === cur ) {
					match = elem;
					break;
				}

				elem = elem[dir];
			}

			checkSet[i] = match;
		}
	}
}

function dirCheck( dir, cur, doneName, checkSet, nodeCheck, isXML ) {
	for ( var i = 0, l = checkSet.length; i < l; i++ ) {
		var elem = checkSet[i];

		if ( elem ) {
			var match = false;
			
			elem = elem[dir];

			while ( elem ) {
				if ( elem[ expando ] === doneName ) {
					match = checkSet[elem.sizset];
					break;
				}

				if ( elem.nodeType === 1 ) {
					if ( !isXML ) {
						elem[ expando ] = doneName;
						elem.sizset = i;
					}

					if ( typeof cur !== "string" ) {
						if ( elem === cur ) {
							match = true;
							break;
						}

					} else if ( Sizzle.filter( cur, [elem] ).length > 0 ) {
						match = elem;
						break;
					}
				}

				elem = elem[dir];
			}

			checkSet[i] = match;
		}
	}
}

if ( document.documentElement.contains ) {
	Sizzle.contains = function( a, b ) {
		return a !== b && (a.contains ? a.contains(b) : true);
	};

} else if ( document.documentElement.compareDocumentPosition ) {
	Sizzle.contains = function( a, b ) {
		return !!(a.compareDocumentPosition(b) & 16);
	};

} else {
	Sizzle.contains = function() {
		return false;
	};
}

Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833) 
	var documentElement = (elem ? elem.ownerDocument || elem : 0).documentElement;

	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

var posProcess = function( selector, context, seed ) {
	var match,
		tmpSet = [],
		later = "",
		root = context.nodeType ? [context] : context;

	// Position selectors must be done after the filter
	// And so must :not(positional) so we move all PSEUDOs to the end
	while ( (match = Expr.match.PSEUDO.exec( selector )) ) {
		later += match[0];
		selector = selector.replace( Expr.match.PSEUDO, "" );
	}

	selector = Expr.relative[selector] ? selector + "*" : selector;

	for ( var i = 0, l = root.length; i < l; i++ ) {
		Sizzle( selector, root[i], tmpSet, seed );
	}

	return Sizzle.filter( later, tmpSet );
};

// EXPOSE
// Override sizzle attribute retrieval
Sizzle.attr = jQuery.attr;
Sizzle.selectors.attrMap = {};
jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[":"] = jQuery.expr.filters;
jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;


})();


var runtil = /Until$/,
	rparentsprev = /^(?:parents|prevUntil|prevAll)/,
	// Note: This RegExp should be improved, or likely pulled from Sizzle
	rmultiselector = /,/,
	isSimple = /^.[^:#\[\.,]*$/,
	slice = Array.prototype.slice,
	POS = jQuery.expr.match.POS,
	// methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend({
	find: function( selector ) {
		var self = this,
			i, l;

		if ( typeof selector !== "string" ) {
			return jQuery( selector ).filter(function() {
				for ( i = 0, l = self.length; i < l; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			});
		}

		var ret = this.pushStack( "", "find", selector ),
			length, n, r;

		for ( i = 0, l = this.length; i < l; i++ ) {
			length = ret.length;
			jQuery.find( selector, this[i], ret );

			if ( i > 0 ) {
				// Make sure that the results are unique
				for ( n = length; n < ret.length; n++ ) {
					for ( r = 0; r < length; r++ ) {
						if ( ret[r] === ret[n] ) {
							ret.splice(n--, 1);
							break;
						}
					}
				}
			}
		}

		return ret;
	},

	has: function( target ) {
		var targets = jQuery( target );
		return this.filter(function() {
			for ( var i = 0, l = targets.length; i < l; i++ ) {
				if ( jQuery.contains( this, targets[i] ) ) {
					return true;
				}
			}
		});
	},

	not: function( selector ) {
		return this.pushStack( winnow(this, selector, false), "not", selector);
	},

	filter: function( selector ) {
		return this.pushStack( winnow(this, selector, true), "filter", selector );
	},

	is: function( selector ) {
		return !!selector && ( 
			typeof selector === "string" ?
				// If this is a positional selector, check membership in the returned set
				// so $("p:first").is("p:last") won't return true for a doc with two "p".
				POS.test( selector ) ? 
					jQuery( selector, this.context ).index( this[0] ) >= 0 :
					jQuery.filter( selector, this ).length > 0 :
				this.filter( selector ).length > 0 );
	},

	closest: function( selectors, context ) {
		var ret = [], i, l, cur = this[0];
		
		// Array (deprecated as of jQuery 1.7)
		if ( jQuery.isArray( selectors ) ) {
			var level = 1;

			while ( cur && cur.ownerDocument && cur !== context ) {
				for ( i = 0; i < selectors.length; i++ ) {

					if ( jQuery( cur ).is( selectors[ i ] ) ) {
						ret.push({ selector: selectors[ i ], elem: cur, level: level });
					}
				}

				cur = cur.parentNode;
				level++;
			}

			return ret;
		}

		// String
		var pos = POS.test( selectors ) || typeof selectors !== "string" ?
				jQuery( selectors, context || this.context ) :
				0;

		for ( i = 0, l = this.length; i < l; i++ ) {
			cur = this[i];

			while ( cur ) {
				if ( pos ? pos.index(cur) > -1 : jQuery.find.matchesSelector(cur, selectors) ) {
					ret.push( cur );
					break;

				} else {
					cur = cur.parentNode;
					if ( !cur || !cur.ownerDocument || cur === context || cur.nodeType === 11 ) {
						break;
					}
				}
			}
		}

		ret = ret.length > 1 ? jQuery.unique( ret ) : ret;

		return this.pushStack( ret, "closest", selectors );
	},

	// Determine the position of an element within
	// the matched set of elements
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[0] && this[0].parentNode ) ? this.prevAll().length : -1;
		}

		// index in selector
		if ( typeof elem === "string" ) {
			return jQuery.inArray( this[0], jQuery( elem ) );
		}

		// Locate the position of the desired element
		return jQuery.inArray(
			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[0] : elem, this );
	},

	add: function( selector, context ) {
		var set = typeof selector === "string" ?
				jQuery( selector, context ) :
				jQuery.makeArray( selector && selector.nodeType ? [ selector ] : selector ),
			all = jQuery.merge( this.get(), set );

		return this.pushStack( isDisconnected( set[0] ) || isDisconnected( all[0] ) ?
			all :
			jQuery.unique( all ) );
	},

	andSelf: function() {
		return this.add( this.prevObject );
	}
});

// A painfully simple check to see if an element is disconnected
// from a document (should be improved, where feasible).
function isDisconnected( node ) {
	return !node || !node.parentNode || node.parentNode.nodeType === 11;
}

jQuery.each({
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return jQuery.dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return jQuery.nth( elem, 2, "nextSibling" );
	},
	prev: function( elem ) {
		return jQuery.nth( elem, 2, "previousSibling" );
	},
	nextAll: function( elem ) {
		return jQuery.dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return jQuery.dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return jQuery.sibling( elem.parentNode.firstChild, elem );
	},
	children: function( elem ) {
		return jQuery.sibling( elem.firstChild );
	},
	contents: function( elem ) {
		return jQuery.nodeName( elem, "iframe" ) ?
			elem.contentDocument || elem.contentWindow.document :
			jQuery.makeArray( elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var ret = jQuery.map( this, fn, until );

		if ( !runtil.test( name ) ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			ret = jQuery.filter( selector, ret );
		}

		ret = this.length > 1 && !guaranteedUnique[ name ] ? jQuery.unique( ret ) : ret;

		if ( (this.length > 1 || rmultiselector.test( selector )) && rparentsprev.test( name ) ) {
			ret = ret.reverse();
		}

		return this.pushStack( ret, name, slice.call( arguments ).join(",") );
	};
});

jQuery.extend({
	filter: function( expr, elems, not ) {
		if ( not ) {
			expr = ":not(" + expr + ")";
		}

		return elems.length === 1 ?
			jQuery.find.matchesSelector(elems[0], expr) ? [ elems[0] ] : [] :
			jQuery.find.matches(expr, elems);
	},

	dir: function( elem, dir, until ) {
		var matched = [],
			cur = elem[ dir ];

		while ( cur && cur.nodeType !== 9 && (until === undefined || cur.nodeType !== 1 || !jQuery( cur ).is( until )) ) {
			if ( cur.nodeType === 1 ) {
				matched.push( cur );
			}
			cur = cur[dir];
		}
		return matched;
	},

	nth: function( cur, result, dir, elem ) {
		result = result || 1;
		var num = 0;

		for ( ; cur; cur = cur[dir] ) {
			if ( cur.nodeType === 1 && ++num === result ) {
				break;
			}
		}

		return cur;
	},

	sibling: function( n, elem ) {
		var r = [];

		for ( ; n; n = n.nextSibling ) {
			if ( n.nodeType === 1 && n !== elem ) {
				r.push( n );
			}
		}

		return r;
	}
});

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, keep ) {

	// Can't pass null or undefined to indexOf in Firefox 4
	// Set to 0 to skip string check
	qualifier = qualifier || 0;

	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep(elements, function( elem, i ) {
			var retVal = !!qualifier.call( elem, i, elem );
			return retVal === keep;
		});

	} else if ( qualifier.nodeType ) {
		return jQuery.grep(elements, function( elem, i ) {
			return ( elem === qualifier ) === keep;
		});

	} else if ( typeof qualifier === "string" ) {
		var filtered = jQuery.grep(elements, function( elem ) {
			return elem.nodeType === 1;
		});

		if ( isSimple.test( qualifier ) ) {
			return jQuery.filter(qualifier, filtered, !keep);
		} else {
			qualifier = jQuery.filter( qualifier, filtered );
		}
	}

	return jQuery.grep(elements, function( elem, i ) {
		return ( jQuery.inArray( elem, qualifier ) >= 0 ) === keep;
	});
}




function createSafeFragment( document ) {
	var list = nodeNames.split( "|" ),
	safeFrag = document.createDocumentFragment();

	if ( safeFrag.createElement ) {
		while ( list.length ) {
			safeFrag.createElement(
				list.pop()
			);
		}
	}
	return safeFrag;
}

var nodeNames = "abbr|article|aside|audio|canvas|datalist|details|figcaption|figure|footer|" +
		"header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
	rinlinejQuery = / jQuery\d+="(?:\d+|null)"/g,
	rleadingWhitespace = /^\s+/,
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,
	rtagName = /<([\w:]+)/,
	rtbody = /<tbody/i,
	rhtml = /<|&#?\w+;/,
	rnoInnerhtml = /<(?:script|style)/i,
	rnocache = /<(?:script|object|embed|option|style)/i,
	rnoshimcache = new RegExp("<(?:" + nodeNames + ")", "i"),
	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rscriptType = /\/(java|ecma)script/i,
	rcleanScript = /^\s*<!(?:\[CDATA\[|\-\-)/,
	wrapMap = {
		option: [ 1, "<select multiple='multiple'>", "</select>" ],
		legend: [ 1, "<fieldset>", "</fieldset>" ],
		thead: [ 1, "<table>", "</table>" ],
		tr: [ 2, "<table><tbody>", "</tbody></table>" ],
		td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],
		col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
		area: [ 1, "<map>", "</map>" ],
		_default: [ 0, "", "" ]
	},
	safeFragment = createSafeFragment( document );

wrapMap.optgroup = wrapMap.option;
wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

// IE can't serialize <link> and <script> tags normally
if ( !jQuery.support.htmlSerialize ) {
	wrapMap._default = [ 1, "div<div>", "</div>" ];
}

jQuery.fn.extend({
	text: function( text ) {
		if ( jQuery.isFunction(text) ) {
			return this.each(function(i) {
				var self = jQuery( this );

				self.text( text.call(this, i, self.text()) );
			});
		}

		if ( typeof text !== "object" && text !== undefined ) {
			return this.empty().append( (this[0] && this[0].ownerDocument || document).createTextNode( text ) );
		}

		return jQuery.text( this );
	},

	wrapAll: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapAll( html.call(this, i) );
			});
		}

		if ( this[0] ) {
			// The elements to wrap the target around
			var wrap = jQuery( html, this[0].ownerDocument ).eq(0).clone(true);

			if ( this[0].parentNode ) {
				wrap.insertBefore( this[0] );
			}

			wrap.map(function() {
				var elem = this;

				while ( elem.firstChild && elem.firstChild.nodeType === 1 ) {
					elem = elem.firstChild;
				}

				return elem;
			}).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapInner( html.call(this, i) );
			});
		}

		return this.each(function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		});
	},

	wrap: function( html ) {
		var isFunction = jQuery.isFunction( html );

		return this.each(function(i) {
			jQuery( this ).wrapAll( isFunction ? html.call(this, i) : html );
		});
	},

	unwrap: function() {
		return this.parent().each(function() {
			if ( !jQuery.nodeName( this, "body" ) ) {
				jQuery( this ).replaceWith( this.childNodes );
			}
		}).end();
	},

	append: function() {
		return this.domManip(arguments, true, function( elem ) {
			if ( this.nodeType === 1 ) {
				this.appendChild( elem );
			}
		});
	},

	prepend: function() {
		return this.domManip(arguments, true, function( elem ) {
			if ( this.nodeType === 1 ) {
				this.insertBefore( elem, this.firstChild );
			}
		});
	},

	before: function() {
		if ( this[0] && this[0].parentNode ) {
			return this.domManip(arguments, false, function( elem ) {
				this.parentNode.insertBefore( elem, this );
			});
		} else if ( arguments.length ) {
			var set = jQuery.clean( arguments );
			set.push.apply( set, this.toArray() );
			return this.pushStack( set, "before", arguments );
		}
	},

	after: function() {
		if ( this[0] && this[0].parentNode ) {
			return this.domManip(arguments, false, function( elem ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			});
		} else if ( arguments.length ) {
			var set = this.pushStack( this, "after", arguments );
			set.push.apply( set, jQuery.clean(arguments) );
			return set;
		}
	},

	// keepData is for internal use only--do not document
	remove: function( selector, keepData ) {
		for ( var i = 0, elem; (elem = this[i]) != null; i++ ) {
			if ( !selector || jQuery.filter( selector, [ elem ] ).length ) {
				if ( !keepData && elem.nodeType === 1 ) {
					jQuery.cleanData( elem.getElementsByTagName("*") );
					jQuery.cleanData( [ elem ] );
				}

				if ( elem.parentNode ) {
					elem.parentNode.removeChild( elem );
				}
			}
		}

		return this;
	},

	empty: function() {
		for ( var i = 0, elem; (elem = this[i]) != null; i++ ) {
			// Remove element nodes and prevent memory leaks
			if ( elem.nodeType === 1 ) {
				jQuery.cleanData( elem.getElementsByTagName("*") );
			}

			// Remove any remaining nodes
			while ( elem.firstChild ) {
				elem.removeChild( elem.firstChild );
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function () {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		});
	},

	html: function( value ) {
		if ( value === undefined ) {
			return this[0] && this[0].nodeType === 1 ?
				this[0].innerHTML.replace(rinlinejQuery, "") :
				null;

		// See if we can take a shortcut and just use innerHTML
		} else if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
			(jQuery.support.leadingWhitespace || !rleadingWhitespace.test( value )) &&
			!wrapMap[ (rtagName.exec( value ) || ["", ""])[1].toLowerCase() ] ) {

			value = value.replace(rxhtmlTag, "<$1></$2>");

			try {
				for ( var i = 0, l = this.length; i < l; i++ ) {
					// Remove element nodes and prevent memory leaks
					if ( this[i].nodeType === 1 ) {
						jQuery.cleanData( this[i].getElementsByTagName("*") );
						this[i].innerHTML = value;
					}
				}

			// If using innerHTML throws an exception, use the fallback method
			} catch(e) {
				this.empty().append( value );
			}

		} else if ( jQuery.isFunction( value ) ) {
			this.each(function(i){
				var self = jQuery( this );

				self.html( value.call(this, i, self.html()) );
			});

		} else {
			this.empty().append( value );
		}

		return this;
	},

	replaceWith: function( value ) {
		if ( this[0] && this[0].parentNode ) {
			// Make sure that the elements are removed from the DOM before they are inserted
			// this can help fix replacing a parent with child elements
			if ( jQuery.isFunction( value ) ) {
				return this.each(function(i) {
					var self = jQuery(this), old = self.html();
					self.replaceWith( value.call( this, i, old ) );
				});
			}

			if ( typeof value !== "string" ) {
				value = jQuery( value ).detach();
			}

			return this.each(function() {
				var next = this.nextSibling,
					parent = this.parentNode;

				jQuery( this ).remove();

				if ( next ) {
					jQuery(next).before( value );
				} else {
					jQuery(parent).append( value );
				}
			});
		} else {
			return this.length ?
				this.pushStack( jQuery(jQuery.isFunction(value) ? value() : value), "replaceWith", value ) :
				this;
		}
	},

	detach: function( selector ) {
		return this.remove( selector, true );
	},

	domManip: function( args, table, callback ) {
		var results, first, fragment, parent,
			value = args[0],
			scripts = [];

		// We can't cloneNode fragments that contain checked, in WebKit
		if ( !jQuery.support.checkClone && arguments.length === 3 && typeof value === "string" && rchecked.test( value ) ) {
			return this.each(function() {
				jQuery(this).domManip( args, table, callback, true );
			});
		}

		if ( jQuery.isFunction(value) ) {
			return this.each(function(i) {
				var self = jQuery(this);
				args[0] = value.call(this, i, table ? self.html() : undefined);
				self.domManip( args, table, callback );
			});
		}

		if ( this[0] ) {
			parent = value && value.parentNode;

			// If we're in a fragment, just use that instead of building a new one
			if ( jQuery.support.parentNode && parent && parent.nodeType === 11 && parent.childNodes.length === this.length ) {
				results = { fragment: parent };

			} else {
				results = jQuery.buildFragment( args, this, scripts );
			}

			fragment = results.fragment;

			if ( fragment.childNodes.length === 1 ) {
				first = fragment = fragment.firstChild;
			} else {
				first = fragment.firstChild;
			}

			if ( first ) {
				table = table && jQuery.nodeName( first, "tr" );

				for ( var i = 0, l = this.length, lastIndex = l - 1; i < l; i++ ) {
					callback.call(
						table ?
							root(this[i], first) :
							this[i],
						// Make sure that we do not leak memory by inadvertently discarding
						// the original fragment (which might have attached data) instead of
						// using it; in addition, use the original fragment object for the last
						// item instead of first because it can end up being emptied incorrectly
						// in certain situations (Bug #8070).
						// Fragments from the fragment cache must always be cloned and never used
						// in place.
						results.cacheable || ( l > 1 && i < lastIndex ) ?
							jQuery.clone( fragment, true, true ) :
							fragment
					);
				}
			}

			if ( scripts.length ) {
				jQuery.each( scripts, evalScript );
			}
		}

		return this;
	}
});

function root( elem, cur ) {
	return jQuery.nodeName(elem, "table") ?
		(elem.getElementsByTagName("tbody")[0] ||
		elem.appendChild(elem.ownerDocument.createElement("tbody"))) :
		elem;
}

function cloneCopyEvent( src, dest ) {

	if ( dest.nodeType !== 1 || !jQuery.hasData( src ) ) {
		return;
	}

	var type, i, l,
		oldData = jQuery._data( src ),
		curData = jQuery._data( dest, oldData ),
		events = oldData.events;

	if ( events ) {
		delete curData.handle;
		curData.events = {};

		for ( type in events ) {
			for ( i = 0, l = events[ type ].length; i < l; i++ ) {
				jQuery.event.add( dest, type + ( events[ type ][ i ].namespace ? "." : "" ) + events[ type ][ i ].namespace, events[ type ][ i ], events[ type ][ i ].data );
			}
		}
	}

	// make the cloned public data object a copy from the original
	if ( curData.data ) {
		curData.data = jQuery.extend( {}, curData.data );
	}
}

function cloneFixAttributes( src, dest ) {
	var nodeName;

	// We do not need to do anything for non-Elements
	if ( dest.nodeType !== 1 ) {
		return;
	}

	// clearAttributes removes the attributes, which we don't want,
	// but also removes the attachEvent events, which we *do* want
	if ( dest.clearAttributes ) {
		dest.clearAttributes();
	}

	// mergeAttributes, in contrast, only merges back on the
	// original attributes, not the events
	if ( dest.mergeAttributes ) {
		dest.mergeAttributes( src );
	}

	nodeName = dest.nodeName.toLowerCase();

	// IE6-8 fail to clone children inside object elements that use
	// the proprietary classid attribute value (rather than the type
	// attribute) to identify the type of content to display
	if ( nodeName === "object" ) {
		dest.outerHTML = src.outerHTML;

	} else if ( nodeName === "input" && (src.type === "checkbox" || src.type === "radio") ) {
		// IE6-8 fails to persist the checked state of a cloned checkbox
		// or radio button. Worse, IE6-7 fail to give the cloned element
		// a checked appearance if the defaultChecked value isn't also set
		if ( src.checked ) {
			dest.defaultChecked = dest.checked = src.checked;
		}

		// IE6-7 get confused and end up setting the value of a cloned
		// checkbox/radio button to an empty string instead of "on"
		if ( dest.value !== src.value ) {
			dest.value = src.value;
		}

	// IE6-8 fails to return the selected option to the default selected
	// state when cloning options
	} else if ( nodeName === "option" ) {
		dest.selected = src.defaultSelected;

	// IE6-8 fails to set the defaultValue to the correct value when
	// cloning other types of input fields
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}

	// Event data gets referenced instead of copied if the expando
	// gets copied too
	dest.removeAttribute( jQuery.expando );
}

jQuery.buildFragment = function( args, nodes, scripts ) {
	var fragment, cacheable, cacheresults, doc,
	first = args[ 0 ];

	// nodes may contain either an explicit document object,
	// a jQuery collection or context object.
	// If nodes[0] contains a valid object to assign to doc
	if ( nodes && nodes[0] ) {
		doc = nodes[0].ownerDocument || nodes[0];
	}

	// Ensure that an attr object doesn't incorrectly stand in as a document object
	// Chrome and Firefox seem to allow this to occur and will throw exception
	// Fixes #8950
	if ( !doc.createDocumentFragment ) {
		doc = document;
	}

	// Only cache "small" (1/2 KB) HTML strings that are associated with the main document
	// Cloning options loses the selected state, so don't cache them
	// IE 6 doesn't like it when you put <object> or <embed> elements in a fragment
	// Also, WebKit does not clone 'checked' attributes on cloneNode, so don't cache
	// Lastly, IE6,7,8 will not correctly reuse cached fragments that were created from unknown elems #10501
	if ( args.length === 1 && typeof first === "string" && first.length < 512 && doc === document &&
		first.charAt(0) === "<" && !rnocache.test( first ) &&
		(jQuery.support.checkClone || !rchecked.test( first )) &&
		(jQuery.support.html5Clone || !rnoshimcache.test( first )) ) {

		cacheable = true;

		cacheresults = jQuery.fragments[ first ];
		if ( cacheresults && cacheresults !== 1 ) {
			fragment = cacheresults;
		}
	}

	if ( !fragment ) {
		fragment = doc.createDocumentFragment();
		jQuery.clean( args, doc, fragment, scripts );
	}

	if ( cacheable ) {
		jQuery.fragments[ first ] = cacheresults ? fragment : 1;
	}

	return { fragment: fragment, cacheable: cacheable };
};

jQuery.fragments = {};

jQuery.each({
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var ret = [],
			insert = jQuery( selector ),
			parent = this.length === 1 && this[0].parentNode;

		if ( parent && parent.nodeType === 11 && parent.childNodes.length === 1 && insert.length === 1 ) {
			insert[ original ]( this[0] );
			return this;

		} else {
			for ( var i = 0, l = insert.length; i < l; i++ ) {
				var elems = ( i > 0 ? this.clone(true) : this ).get();
				jQuery( insert[i] )[ original ]( elems );
				ret = ret.concat( elems );
			}

			return this.pushStack( ret, name, insert.selector );
		}
	};
});

function getAll( elem ) {
	if ( typeof elem.getElementsByTagName !== "undefined" ) {
		return elem.getElementsByTagName( "*" );

	} else if ( typeof elem.querySelectorAll !== "undefined" ) {
		return elem.querySelectorAll( "*" );

	} else {
		return [];
	}
}

// Used in clean, fixes the defaultChecked property
function fixDefaultChecked( elem ) {
	if ( elem.type === "checkbox" || elem.type === "radio" ) {
		elem.defaultChecked = elem.checked;
	}
}
// Finds all inputs and passes them to fixDefaultChecked
function findInputs( elem ) {
	var nodeName = ( elem.nodeName || "" ).toLowerCase();
	if ( nodeName === "input" ) {
		fixDefaultChecked( elem );
	// Skip scripts, get other children
	} else if ( nodeName !== "script" && typeof elem.getElementsByTagName !== "undefined" ) {
		jQuery.grep( elem.getElementsByTagName("input"), fixDefaultChecked );
	}
}

// Derived From: http://www.iecss.com/shimprove/javascript/shimprove.1-0-1.js
function shimCloneNode( elem ) {
	var div = document.createElement( "div" );
	safeFragment.appendChild( div );

	div.innerHTML = elem.outerHTML;
	return div.firstChild;
}

jQuery.extend({
	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var srcElements,
			destElements,
			i,
			// IE<=8 does not properly clone detached, unknown element nodes
			clone = jQuery.support.html5Clone || !rnoshimcache.test( "<" + elem.nodeName ) ?
				elem.cloneNode( true ) :
				shimCloneNode( elem );

		if ( (!jQuery.support.noCloneEvent || !jQuery.support.noCloneChecked) &&
				(elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem) ) {
			// IE copies events bound via attachEvent when using cloneNode.
			// Calling detachEvent on the clone will also remove the events
			// from the original. In order to get around this, we use some
			// proprietary methods to clear the events. Thanks to MooTools
			// guys for this hotness.

			cloneFixAttributes( elem, clone );

			// Using Sizzle here is crazy slow, so we use getElementsByTagName instead
			srcElements = getAll( elem );
			destElements = getAll( clone );

			// Weird iteration because IE will replace the length property
			// with an element if you are cloning the body and one of the
			// elements on the page has a name or id of "length"
			for ( i = 0; srcElements[i]; ++i ) {
				// Ensure that the destination node is not null; Fixes #9587
				if ( destElements[i] ) {
					cloneFixAttributes( srcElements[i], destElements[i] );
				}
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			cloneCopyEvent( elem, clone );

			if ( deepDataAndEvents ) {
				srcElements = getAll( elem );
				destElements = getAll( clone );

				for ( i = 0; srcElements[i]; ++i ) {
					cloneCopyEvent( srcElements[i], destElements[i] );
				}
			}
		}

		srcElements = destElements = null;

		// Return the cloned set
		return clone;
	},

	clean: function( elems, context, fragment, scripts ) {
		var checkScriptType;

		context = context || document;

		// !context.createElement fails in IE with an error but returns typeof 'object'
		if ( typeof context.createElement === "undefined" ) {
			context = context.ownerDocument || context[0] && context[0].ownerDocument || document;
		}

		var ret = [], j;

		for ( var i = 0, elem; (elem = elems[i]) != null; i++ ) {
			if ( typeof elem === "number" ) {
				elem += "";
			}

			if ( !elem ) {
				continue;
			}

			// Convert html string into DOM nodes
			if ( typeof elem === "string" ) {
				if ( !rhtml.test( elem ) ) {
					elem = context.createTextNode( elem );
				} else {
					// Fix "XHTML"-style tags in all browsers
					elem = elem.replace(rxhtmlTag, "<$1></$2>");

					// Trim whitespace, otherwise indexOf won't work as expected
					var tag = ( rtagName.exec( elem ) || ["", ""] )[1].toLowerCase(),
						wrap = wrapMap[ tag ] || wrapMap._default,
						depth = wrap[0],
						div = context.createElement("div");

					// Append wrapper element to unknown element safe doc fragment
					if ( context === document ) {
						// Use the fragment we've already created for this document
						safeFragment.appendChild( div );
					} else {
						// Use a fragment created with the owner document
						createSafeFragment( context ).appendChild( div );
					}

					// Go to html and back, then peel off extra wrappers
					div.innerHTML = wrap[1] + elem + wrap[2];

					// Move to the right depth
					while ( depth-- ) {
						div = div.lastChild;
					}

					// Remove IE's autoinserted <tbody> from table fragments
					if ( !jQuery.support.tbody ) {

						// String was a <table>, *may* have spurious <tbody>
						var hasBody = rtbody.test(elem),
							tbody = tag === "table" && !hasBody ?
								div.firstChild && div.firstChild.childNodes :

								// String was a bare <thead> or <tfoot>
								wrap[1] === "<table>" && !hasBody ?
									div.childNodes :
									[];

						for ( j = tbody.length - 1; j >= 0 ; --j ) {
							if ( jQuery.nodeName( tbody[ j ], "tbody" ) && !tbody[ j ].childNodes.length ) {
								tbody[ j ].parentNode.removeChild( tbody[ j ] );
							}
						}
					}

					// IE completely kills leading whitespace when innerHTML is used
					if ( !jQuery.support.leadingWhitespace && rleadingWhitespace.test( elem ) ) {
						div.insertBefore( context.createTextNode( rleadingWhitespace.exec(elem)[0] ), div.firstChild );
					}

					elem = div.childNodes;
				}
			}

			// Resets defaultChecked for any radios and checkboxes
			// about to be appended to the DOM in IE 6/7 (#8060)
			var len;
			if ( !jQuery.support.appendChecked ) {
				if ( elem[0] && typeof (len = elem.length) === "number" ) {
					for ( j = 0; j < len; j++ ) {
						findInputs( elem[j] );
					}
				} else {
					findInputs( elem );
				}
			}

			if ( elem.nodeType ) {
				ret.push( elem );
			} else {
				ret = jQuery.merge( ret, elem );
			}
		}

		if ( fragment ) {
			checkScriptType = function( elem ) {
				return !elem.type || rscriptType.test( elem.type );
			};
			for ( i = 0; ret[i]; i++ ) {
				if ( scripts && jQuery.nodeName( ret[i], "script" ) && (!ret[i].type || ret[i].type.toLowerCase() === "text/javascript") ) {
					scripts.push( ret[i].parentNode ? ret[i].parentNode.removeChild( ret[i] ) : ret[i] );

				} else {
					if ( ret[i].nodeType === 1 ) {
						var jsTags = jQuery.grep( ret[i].getElementsByTagName( "script" ), checkScriptType );

						ret.splice.apply( ret, [i + 1, 0].concat( jsTags ) );
					}
					fragment.appendChild( ret[i] );
				}
			}
		}

		return ret;
	},

	cleanData: function( elems ) {
		var data, id,
			cache = jQuery.cache,
			special = jQuery.event.special,
			deleteExpando = jQuery.support.deleteExpando;

		for ( var i = 0, elem; (elem = elems[i]) != null; i++ ) {
			if ( elem.nodeName && jQuery.noData[elem.nodeName.toLowerCase()] ) {
				continue;
			}

			id = elem[ jQuery.expando ];

			if ( id ) {
				data = cache[ id ];

				if ( data && data.events ) {
					for ( var type in data.events ) {
						if ( special[ type ] ) {
							jQuery.event.remove( elem, type );

						// This is a shortcut to avoid jQuery.event.remove's overhead
						} else {
							jQuery.removeEvent( elem, type, data.handle );
						}
					}

					// Null the DOM reference to avoid IE6/7/8 leak (#7054)
					if ( data.handle ) {
						data.handle.elem = null;
					}
				}

				if ( deleteExpando ) {
					delete elem[ jQuery.expando ];

				} else if ( elem.removeAttribute ) {
					elem.removeAttribute( jQuery.expando );
				}

				delete cache[ id ];
			}
		}
	}
});

function evalScript( i, elem ) {
	if ( elem.src ) {
		jQuery.ajax({
			url: elem.src,
			async: false,
			dataType: "script"
		});
	} else {
		jQuery.globalEval( ( elem.text || elem.textContent || elem.innerHTML || "" ).replace( rcleanScript, "/*$0*/" ) );
	}

	if ( elem.parentNode ) {
		elem.parentNode.removeChild( elem );
	}
}




var ralpha = /alpha\([^)]*\)/i,
	ropacity = /opacity=([^)]*)/,
	// fixed for IE9, see #8346
	rupper = /([A-Z]|^ms)/g,
	rnumpx = /^-?\d+(?:px)?$/i,
	rnum = /^-?\d/,
	rrelNum = /^([\-+])=([\-+.\de]+)/,

	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssWidth = [ "Left", "Right" ],
	cssHeight = [ "Top", "Bottom" ],
	curCSS,

	getComputedStyle,
	currentStyle;

jQuery.fn.css = function( name, value ) {
	// Setting 'undefined' is a no-op
	if ( arguments.length === 2 && value === undefined ) {
		return this;
	}

	return jQuery.access( this, name, value, true, function( elem, name, value ) {
		return value !== undefined ?
			jQuery.style( elem, name, value ) :
			jQuery.css( elem, name );
	});
};

jQuery.extend({
	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {
					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity", "opacity" );
					return ret === "" ? "1" : ret;

				} else {
					return elem.style.opacity;
				}
			}
		}
	},

	// Exclude the following css properties to add px
	cssNumber: {
		"fillOpacity": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {
		// normalize float css property
		"float": jQuery.support.cssFloat ? "cssFloat" : "styleFloat"
	},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {
		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, origName = jQuery.camelCase( name ),
			style = elem.style, hooks = jQuery.cssHooks[ origName ];

		name = jQuery.cssProps[ origName ] || origName;

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// convert relative number strings (+= or -=) to relative numbers. #7345
			if ( type === "string" && (ret = rrelNum.exec( value )) ) {
				value = ( +( ret[1] + 1) * +ret[2] ) + parseFloat( jQuery.css( elem, name ) );
				// Fixes bug #9237
				type = "number";
			}

			// Make sure that NaN and null values aren't set. See: #7116
			if ( value == null || type === "number" && isNaN( value ) ) {
				return;
			}

			// If a number was passed in, add 'px' to the (except for certain CSS properties)
			if ( type === "number" && !jQuery.cssNumber[ origName ] ) {
				value += "px";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !("set" in hooks) || (value = hooks.set( elem, value )) !== undefined ) {
				// Wrapped to prevent IE from throwing errors when 'invalid' values are provided
				// Fixes bug #5509
				try {
					style[ name ] = value;
				} catch(e) {}
			}

		} else {
			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, false, extra )) !== undefined ) {
				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra ) {
		var ret, hooks;

		// Make sure that we're working with the right name
		name = jQuery.camelCase( name );
		hooks = jQuery.cssHooks[ name ];
		name = jQuery.cssProps[ name ] || name;

		// cssFloat needs a special treatment
		if ( name === "cssFloat" ) {
			name = "float";
		}

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks && (ret = hooks.get( elem, true, extra )) !== undefined ) {
			return ret;

		// Otherwise, if a way to get the computed value exists, use that
		} else if ( curCSS ) {
			return curCSS( elem, name );
		}
	},

	// A method for quickly swapping in/out CSS properties to get correct calculations
	swap: function( elem, options, callback ) {
		var old = {};

		// Remember the old values, and insert the new ones
		for ( var name in options ) {
			old[ name ] = elem.style[ name ];
			elem.style[ name ] = options[ name ];
		}

		callback.call( elem );

		// Revert the old values
		for ( name in options ) {
			elem.style[ name ] = old[ name ];
		}
	}
});

// DEPRECATED, Use jQuery.css() instead
jQuery.curCSS = jQuery.css;

jQuery.each(["height", "width"], function( i, name ) {
	jQuery.cssHooks[ name ] = {
		get: function( elem, computed, extra ) {
			var val;

			if ( computed ) {
				if ( elem.offsetWidth !== 0 ) {
					return getWH( elem, name, extra );
				} else {
					jQuery.swap( elem, cssShow, function() {
						val = getWH( elem, name, extra );
					});
				}

				return val;
			}
		},

		set: function( elem, value ) {
			if ( rnumpx.test( value ) ) {
				// ignore negative width and height values #1599
				value = parseFloat( value );

				if ( value >= 0 ) {
					return value + "px";
				}

			} else {
				return value;
			}
		}
	};
});

if ( !jQuery.support.opacity ) {
	jQuery.cssHooks.opacity = {
		get: function( elem, computed ) {
			// IE uses filters for opacity
			return ropacity.test( (computed && elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || "" ) ?
				( parseFloat( RegExp.$1 ) / 100 ) + "" :
				computed ? "1" : "";
		},

		set: function( elem, value ) {
			var style = elem.style,
				currentStyle = elem.currentStyle,
				opacity = jQuery.isNumeric( value ) ? "alpha(opacity=" + value * 100 + ")" : "",
				filter = currentStyle && currentStyle.filter || style.filter || "";

			// IE has trouble with opacity if it does not have layout
			// Force it by setting the zoom level
			style.zoom = 1;

			// if setting opacity to 1, and no other filters exist - attempt to remove filter attribute #6652
			if ( value >= 1 && jQuery.trim( filter.replace( ralpha, "" ) ) === "" ) {

				// Setting style.filter to null, "" & " " still leave "filter:" in the cssText
				// if "filter:" is present at all, clearType is disabled, we want to avoid this
				// style.removeAttribute is IE Only, but so apparently is this code path...
				style.removeAttribute( "filter" );

				// if there there is no filter style applied in a css rule, we are done
				if ( currentStyle && !currentStyle.filter ) {
					return;
				}
			}

			// otherwise, set new filter values
			style.filter = ralpha.test( filter ) ?
				filter.replace( ralpha, opacity ) :
				filter + " " + opacity;
		}
	};
}

jQuery(function() {
	// This hook cannot be added until DOM ready because the support test
	// for it is not run until after DOM ready
	if ( !jQuery.support.reliableMarginRight ) {
		jQuery.cssHooks.marginRight = {
			get: function( elem, computed ) {
				// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
				// Work around by temporarily setting element display to inline-block
				var ret;
				jQuery.swap( elem, { "display": "inline-block" }, function() {
					if ( computed ) {
						ret = curCSS( elem, "margin-right", "marginRight" );
					} else {
						ret = elem.style.marginRight;
					}
				});
				return ret;
			}
		};
	}
});

if ( document.defaultView && document.defaultView.getComputedStyle ) {
	getComputedStyle = function( elem, name ) {
		var ret, defaultView, computedStyle;

		name = name.replace( rupper, "-$1" ).toLowerCase();

		if ( (defaultView = elem.ownerDocument.defaultView) &&
				(computedStyle = defaultView.getComputedStyle( elem, null )) ) {
			ret = computedStyle.getPropertyValue( name );
			if ( ret === "" && !jQuery.contains( elem.ownerDocument.documentElement, elem ) ) {
				ret = jQuery.style( elem, name );
			}
		}

		return ret;
	};
}

if ( document.documentElement.currentStyle ) {
	currentStyle = function( elem, name ) {
		var left, rsLeft, uncomputed,
			ret = elem.currentStyle && elem.currentStyle[ name ],
			style = elem.style;

		// Avoid setting ret to empty string here
		// so we don't default to auto
		if ( ret === null && style && (uncomputed = style[ name ]) ) {
			ret = uncomputed;
		}

		// From the awesome hack by Dean Edwards
		// http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

		// If we're not dealing with a regular pixel number
		// but a number that has a weird ending, we need to convert it to pixels
		if ( !rnumpx.test( ret ) && rnum.test( ret ) ) {

			// Remember the original values
			left = style.left;
			rsLeft = elem.runtimeStyle && elem.runtimeStyle.left;

			// Put in the new values to get a computed value out
			if ( rsLeft ) {
				elem.runtimeStyle.left = elem.currentStyle.left;
			}
			style.left = name === "fontSize" ? "1em" : ( ret || 0 );
			ret = style.pixelLeft + "px";

			// Revert the changed values
			style.left = left;
			if ( rsLeft ) {
				elem.runtimeStyle.left = rsLeft;
			}
		}

		return ret === "" ? "auto" : ret;
	};
}

curCSS = getComputedStyle || currentStyle;

function getWH( elem, name, extra ) {

	// Start with offset property
	var val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
		which = name === "width" ? cssWidth : cssHeight,
		i = 0,
		len = which.length;

	if ( val > 0 ) {
		if ( extra !== "border" ) {
			for ( ; i < len; i++ ) {
				if ( !extra ) {
					val -= parseFloat( jQuery.css( elem, "padding" + which[ i ] ) ) || 0;
				}
				if ( extra === "margin" ) {
					val += parseFloat( jQuery.css( elem, extra + which[ i ] ) ) || 0;
				} else {
					val -= parseFloat( jQuery.css( elem, "border" + which[ i ] + "Width" ) ) || 0;
				}
			}
		}

		return val + "px";
	}

	// Fall back to computed then uncomputed css if necessary
	val = curCSS( elem, name, name );
	if ( val < 0 || val == null ) {
		val = elem.style[ name ] || 0;
	}
	// Normalize "", auto, and prepare for extra
	val = parseFloat( val ) || 0;

	// Add padding, border, margin
	if ( extra ) {
		for ( ; i < len; i++ ) {
			val += parseFloat( jQuery.css( elem, "padding" + which[ i ] ) ) || 0;
			if ( extra !== "padding" ) {
				val += parseFloat( jQuery.css( elem, "border" + which[ i ] + "Width" ) ) || 0;
			}
			if ( extra === "margin" ) {
				val += parseFloat( jQuery.css( elem, extra + which[ i ] ) ) || 0;
			}
		}
	}

	return val + "px";
}

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.hidden = function( elem ) {
		var width = elem.offsetWidth,
			height = elem.offsetHeight;

		return ( width === 0 && height === 0 ) || (!jQuery.support.reliableHiddenOffsets && ((elem.style && elem.style.display) || jQuery.css( elem, "display" )) === "none");
	};

	jQuery.expr.filters.visible = function( elem ) {
		return !jQuery.expr.filters.hidden( elem );
	};
}




var r20 = /%20/g,
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rhash = /#.*$/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg, // IE leaves an \r character at EOL
	rinput = /^(?:color|date|datetime|datetime-local|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i,
	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app\-storage|.+\-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,
	rquery = /\?/,
	rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
	rselectTextarea = /^(?:select|textarea)/i,
	rspacesAjax = /\s+/,
	rts = /([?&])_=[^&]*/,
	rurl = /^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+))?)?/,

	// Keep a copy of the old load method
	_load = jQuery.fn.load,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Document location
	ajaxLocation,

	// Document location segments
	ajaxLocParts,

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = ["*/"] + ["*"];

// #8138, IE may throw an exception when accessing
// a field from window.location if document.domain has been set
try {
	ajaxLocation = location.href;
} catch( e ) {
	// Use the href attribute of an A element
	// since IE will modify it given document.location
	ajaxLocation = document.createElement( "a" );
	ajaxLocation.href = "";
	ajaxLocation = ajaxLocation.href;
}

// Segment location into parts
ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() ) || [];

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		if ( jQuery.isFunction( func ) ) {
			var dataTypes = dataTypeExpression.toLowerCase().split( rspacesAjax ),
				i = 0,
				length = dataTypes.length,
				dataType,
				list,
				placeBefore;

			// For each dataType in the dataTypeExpression
			for ( ; i < length; i++ ) {
				dataType = dataTypes[ i ];
				// We control if we're asked to add before
				// any existing element
				placeBefore = /^\+/.test( dataType );
				if ( placeBefore ) {
					dataType = dataType.substr( 1 ) || "*";
				}
				list = structure[ dataType ] = structure[ dataType ] || [];
				// then we add to the structure accordingly
				list[ placeBefore ? "unshift" : "push" ]( func );
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR,
		dataType /* internal */, inspected /* internal */ ) {

	dataType = dataType || options.dataTypes[ 0 ];
	inspected = inspected || {};

	inspected[ dataType ] = true;

	var list = structure[ dataType ],
		i = 0,
		length = list ? list.length : 0,
		executeOnly = ( structure === prefilters ),
		selection;

	for ( ; i < length && ( executeOnly || !selection ); i++ ) {
		selection = list[ i ]( options, originalOptions, jqXHR );
		// If we got redirected to another dataType
		// we try there if executing only and not done already
		if ( typeof selection === "string" ) {
			if ( !executeOnly || inspected[ selection ] ) {
				selection = undefined;
			} else {
				options.dataTypes.unshift( selection );
				selection = inspectPrefiltersOrTransports(
						structure, options, originalOptions, jqXHR, selection, inspected );
			}
		}
	}
	// If we're only executing or nothing was selected
	// we try the catchall dataType if not done already
	if ( ( executeOnly || !selection ) && !inspected[ "*" ] ) {
		selection = inspectPrefiltersOrTransports(
				structure, options, originalOptions, jqXHR, "*", inspected );
	}
	// unnecessary when only executing (prefilters)
	// but it'll be ignored by the caller in that case
	return selection;
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
	var key, deep,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};
	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || ( deep = {} ) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}
}

jQuery.fn.extend({
	load: function( url, params, callback ) {
		if ( typeof url !== "string" && _load ) {
			return _load.apply( this, arguments );

		// Don't do a request if no elements are being requested
		} else if ( !this.length ) {
			return this;
		}

		var off = url.indexOf( " " );
		if ( off >= 0 ) {
			var selector = url.slice( off, url.length );
			url = url.slice( 0, off );
		}

		// Default to a GET request
		var type = "GET";

		// If the second parameter was provided
		if ( params ) {
			// If it's a function
			if ( jQuery.isFunction( params ) ) {
				// We assume that it's the callback
				callback = params;
				params = undefined;

			// Otherwise, build a param string
			} else if ( typeof params === "object" ) {
				params = jQuery.param( params, jQuery.ajaxSettings.traditional );
				type = "POST";
			}
		}

		var self = this;

		// Request the remote document
		jQuery.ajax({
			url: url,
			type: type,
			dataType: "html",
			data: params,
			// Complete callback (responseText is used internally)
			complete: function( jqXHR, status, responseText ) {
				// Store the response as specified by the jqXHR object
				responseText = jqXHR.responseText;
				// If successful, inject the HTML into all the matched elements
				if ( jqXHR.isResolved() ) {
					// #4825: Get the actual response in case
					// a dataFilter is present in ajaxSettings
					jqXHR.done(function( r ) {
						responseText = r;
					});
					// See if a selector was specified
					self.html( selector ?
						// Create a dummy div to hold the results
						jQuery("<div>")
							// inject the contents of the document in, removing the scripts
							// to avoid any 'Permission Denied' errors in IE
							.append(responseText.replace(rscript, ""))

							// Locate the specified elements
							.find(selector) :

						// If not, just inject the full result
						responseText );
				}

				if ( callback ) {
					self.each( callback, [ responseText, status, jqXHR ] );
				}
			}
		});

		return this;
	},

	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},

	serializeArray: function() {
		return this.map(function(){
			return this.elements ? jQuery.makeArray( this.elements ) : this;
		})
		.filter(function(){
			return this.name && !this.disabled &&
				( this.checked || rselectTextarea.test( this.nodeName ) ||
					rinput.test( this.type ) );
		})
		.map(function( i, elem ){
			var val = jQuery( this ).val();

			return val == null ?
				null :
				jQuery.isArray( val ) ?
					jQuery.map( val, function( val, i ){
						return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
					}) :
					{ name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		}).get();
	}
});

// Attach a bunch of functions for handling common AJAX events
jQuery.each( "ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split( " " ), function( i, o ){
	jQuery.fn[ o ] = function( f ){
		return this.on( o, f );
	};
});

jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {
		// shift arguments if data argument was omitted
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		return jQuery.ajax({
			type: method,
			url: url,
			data: data,
			success: callback,
			dataType: type
		});
	};
});

jQuery.extend({

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		if ( settings ) {
			// Building a settings object
			ajaxExtend( target, jQuery.ajaxSettings );
		} else {
			// Extending ajaxSettings
			settings = target;
			target = jQuery.ajaxSettings;
		}
		ajaxExtend( target, settings );
		return target;
	},

	ajaxSettings: {
		url: ajaxLocation,
		isLocal: rlocalProtocol.test( ajaxLocParts[ 1 ] ),
		global: true,
		type: "GET",
		contentType: "application/x-www-form-urlencoded",
		processData: true,
		async: true,
		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		traditional: false,
		headers: {},
		*/

		accepts: {
			xml: "application/xml, text/xml",
			html: "text/html",
			text: "text/plain",
			json: "application/json, text/javascript",
			"*": allTypes
		},

		contents: {
			xml: /xml/,
			html: /html/,
			json: /json/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText"
		},

		// List of data converters
		// 1) key format is "source_type destination_type" (a single space in-between)
		// 2) the catchall symbol "*" can be used for source_type
		converters: {

			// Convert anything to text
			"* text": window.String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": jQuery.parseJSON,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			context: true,
			url: true
		}
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var // Create the final options object
			s = jQuery.ajaxSetup( {}, options ),
			// Callbacks context
			callbackContext = s.context || s,
			// Context for global events
			// It's the callbackContext if one was provided in the options
			// and if it's a DOM node or a jQuery collection
			globalEventContext = callbackContext !== s &&
				( callbackContext.nodeType || callbackContext instanceof jQuery ) ?
						jQuery( callbackContext ) : jQuery.event,
			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks( "once memory" ),
			// Status-dependent callbacks
			statusCode = s.statusCode || {},
			// ifModified key
			ifModifiedKey,
			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},
			// Response headers
			responseHeadersString,
			responseHeaders,
			// transport
			transport,
			// timeout handle
			timeoutTimer,
			// Cross-domain detection vars
			parts,
			// The jqXHR state
			state = 0,
			// To know if global events are to be dispatched
			fireGlobals,
			// Loop variable
			i,
			// Fake xhr
			jqXHR = {

				readyState: 0,

				// Caches the header
				setRequestHeader: function( name, value ) {
					if ( !state ) {
						var lname = name.toLowerCase();
						name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Raw string
				getAllResponseHeaders: function() {
					return state === 2 ? responseHeadersString : null;
				},

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( state === 2 ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while( ( match = rheaders.exec( responseHeadersString ) ) ) {
								responseHeaders[ match[1].toLowerCase() ] = match[ 2 ];
							}
						}
						match = responseHeaders[ key.toLowerCase() ];
					}
					return match === undefined ? null : match;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( !state ) {
						s.mimeType = type;
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					statusText = statusText || "abort";
					if ( transport ) {
						transport.abort( statusText );
					}
					done( 0, statusText );
					return this;
				}
			};

		// Callback for when everything is done
		// It is defined here because jslint complains if it is declared
		// at the end of the function (which would be more logical and readable)
		function done( status, nativeStatusText, responses, headers ) {

			// Called once
			if ( state === 2 ) {
				return;
			}

			// State is "done" now
			state = 2;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			var isSuccess,
				success,
				error,
				statusText = nativeStatusText,
				response = responses ? ajaxHandleResponses( s, jqXHR, responses ) : undefined,
				lastModified,
				etag;

			// If successful, handle type chaining
			if ( status >= 200 && status < 300 || status === 304 ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {

					if ( ( lastModified = jqXHR.getResponseHeader( "Last-Modified" ) ) ) {
						jQuery.lastModified[ ifModifiedKey ] = lastModified;
					}
					if ( ( etag = jqXHR.getResponseHeader( "Etag" ) ) ) {
						jQuery.etag[ ifModifiedKey ] = etag;
					}
				}

				// If not modified
				if ( status === 304 ) {

					statusText = "notmodified";
					isSuccess = true;

				// If we have data
				} else {

					try {
						success = ajaxConvert( s, response );
						statusText = "success";
						isSuccess = true;
					} catch(e) {
						// We have a parsererror
						statusText = "parsererror";
						error = e;
					}
				}
			} else {
				// We extract error from statusText
				// then normalize statusText and status for non-aborts
				error = statusText;
				if ( !statusText || status ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = "" + ( nativeStatusText || statusText );

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajax" + ( isSuccess ? "Success" : "Error" ),
						[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );
				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger( "ajaxStop" );
				}
			}
		}

		// Attach deferreds
		deferred.promise( jqXHR );
		jqXHR.success = jqXHR.done;
		jqXHR.error = jqXHR.fail;
		jqXHR.complete = completeDeferred.add;

		// Status-dependent callbacks
		jqXHR.statusCode = function( map ) {
			if ( map ) {
				var tmp;
				if ( state < 2 ) {
					for ( tmp in map ) {
						statusCode[ tmp ] = [ statusCode[tmp], map[tmp] ];
					}
				} else {
					tmp = map[ jqXHR.status ];
					jqXHR.then( tmp, tmp );
				}
			}
			return this;
		};

		// Remove hash character (#7531: and string promotion)
		// Add protocol if not provided (#5866: IE7 issue with protocol-less urls)
		// We also use the url parameter if available
		s.url = ( ( url || s.url ) + "" ).replace( rhash, "" ).replace( rprotocol, ajaxLocParts[ 1 ] + "//" );

		// Extract dataTypes list
		s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().split( rspacesAjax );

		// Determine if a cross-domain request is in order
		if ( s.crossDomain == null ) {
			parts = rurl.exec( s.url.toLowerCase() );
			s.crossDomain = !!( parts &&
				( parts[ 1 ] != ajaxLocParts[ 1 ] || parts[ 2 ] != ajaxLocParts[ 2 ] ||
					( parts[ 3 ] || ( parts[ 1 ] === "http:" ? 80 : 443 ) ) !=
						( ajaxLocParts[ 3 ] || ( ajaxLocParts[ 1 ] === "http:" ? 80 : 443 ) ) )
			);
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefiler, stop there
		if ( state === 2 ) {
			return false;
		}

		// We can fire global events as of now if asked to
		fireGlobals = s.global;

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger( "ajaxStart" );
		}

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// If data is available, append data to url
			if ( s.data ) {
				s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.data;
				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Get ifModifiedKey before adding the anti-cache parameter
			ifModifiedKey = s.url;

			// Add anti-cache in url if needed
			if ( s.cache === false ) {

				var ts = jQuery.now(),
					// try replacing _= if it is there
					ret = s.url.replace( rts, "$1_=" + ts );

				// if nothing was replaced, add timestamp to the end
				s.url = ret + ( ( ret === s.url ) ? ( rquery.test( s.url ) ? "&" : "?" ) + "_=" + ts : "" );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			ifModifiedKey = ifModifiedKey || s.url;
			if ( jQuery.lastModified[ ifModifiedKey ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ ifModifiedKey ] );
			}
			if ( jQuery.etag[ ifModifiedKey ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ ifModifiedKey ] );
			}
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[0] ] ?
				s.accepts[ s.dataTypes[0] ] + ( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend && ( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {
				// Abort if not done already
				jqXHR.abort();
				return false;

		}

		// Install callbacks on deferreds
		for ( i in { success: 1, error: 1, complete: 1 } ) {
			jqXHR[ i ]( s[ i ] );
		}

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;
			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}
			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = setTimeout( function(){
					jqXHR.abort( "timeout" );
				}, s.timeout );
			}

			try {
				state = 1;
				transport.send( requestHeaders, done );
			} catch (e) {
				// Propagate exception as error if not done
				if ( state < 2 ) {
					done( -1, e );
				// Simply rethrow otherwise
				} else {
					throw e;
				}
			}
		}

		return jqXHR;
	},

	// Serialize an array of form elements or a set of
	// key/values into a query string
	param: function( a, traditional ) {
		var s = [],
			add = function( key, value ) {
				// If value is a function, invoke it and return its value
				value = jQuery.isFunction( value ) ? value() : value;
				s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
			};

		// Set traditional to true for jQuery <= 1.3.2 behavior.
		if ( traditional === undefined ) {
			traditional = jQuery.ajaxSettings.traditional;
		}

		// If an array was passed in, assume that it is an array of form elements.
		if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {
			// Serialize the form elements
			jQuery.each( a, function() {
				add( this.name, this.value );
			});

		} else {
			// If traditional, encode the "old" way (the way 1.3.2 or older
			// did it), otherwise encode params recursively.
			for ( var prefix in a ) {
				buildParams( prefix, a[ prefix ], traditional, add );
			}
		}

		// Return the resulting serialization
		return s.join( "&" ).replace( r20, "+" );
	}
});

function buildParams( prefix, obj, traditional, add ) {
	if ( jQuery.isArray( obj ) ) {
		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {
				// Treat each array item as a scalar.
				add( prefix, v );

			} else {
				// If array item is non-scalar (array or object), encode its
				// numeric index to resolve deserialization ambiguity issues.
				// Note that rack (as of 1.0.0) can't currently deserialize
				// nested arrays properly, and attempting to do so may cause
				// a server error. Possible fixes are to modify rack's
				// deserialization algorithm or to provide an option or flag
				// to force array serialization to be shallow.
				buildParams( prefix + "[" + ( typeof v === "object" || jQuery.isArray(v) ? i : "" ) + "]", v, traditional, add );
			}
		});

	} else if ( !traditional && obj != null && typeof obj === "object" ) {
		// Serialize object item.
		for ( var name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {
		// Serialize scalar item.
		add( prefix, obj );
	}
}

// This is still on the jQuery object... for now
// Want to move this to jQuery.ajax some day
jQuery.extend({

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {}

});

/* Handles responses to an ajax request:
 * - sets all responseXXX fields accordingly
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {

	var contents = s.contents,
		dataTypes = s.dataTypes,
		responseFields = s.responseFields,
		ct,
		type,
		finalDataType,
		firstDataType;

	// Fill responseXXX fields
	for ( type in responseFields ) {
		if ( type in responses ) {
			jqXHR[ responseFields[type] ] = responses[ type ];
		}
	}

	// Remove auto dataType and get content-type in the process
	while( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader( "content-type" );
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {
		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[0] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}
		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

// Chain conversions given the request and the original response
function ajaxConvert( s, response ) {

	// Apply the dataFilter if provided
	if ( s.dataFilter ) {
		response = s.dataFilter( response, s.dataType );
	}

	var dataTypes = s.dataTypes,
		converters = {},
		i,
		key,
		length = dataTypes.length,
		tmp,
		// Current and previous dataTypes
		current = dataTypes[ 0 ],
		prev,
		// Conversion expression
		conversion,
		// Conversion function
		conv,
		// Conversion functions (transitive conversion)
		conv1,
		conv2;

	// For each dataType in the chain
	for ( i = 1; i < length; i++ ) {

		// Create converters map
		// with lowercased keys
		if ( i === 1 ) {
			for ( key in s.converters ) {
				if ( typeof key === "string" ) {
					converters[ key.toLowerCase() ] = s.converters[ key ];
				}
			}
		}

		// Get the dataTypes
		prev = current;
		current = dataTypes[ i ];

		// If current is auto dataType, update it to prev
		if ( current === "*" ) {
			current = prev;
		// If no auto and dataTypes are actually different
		} else if ( prev !== "*" && prev !== current ) {

			// Get the converter
			conversion = prev + " " + current;
			conv = converters[ conversion ] || converters[ "* " + current ];

			// If there is no direct converter, search transitively
			if ( !conv ) {
				conv2 = undefined;
				for ( conv1 in converters ) {
					tmp = conv1.split( " " );
					if ( tmp[ 0 ] === prev || tmp[ 0 ] === "*" ) {
						conv2 = converters[ tmp[1] + " " + current ];
						if ( conv2 ) {
							conv1 = converters[ conv1 ];
							if ( conv1 === true ) {
								conv = conv2;
							} else if ( conv2 === true ) {
								conv = conv1;
							}
							break;
						}
					}
				}
			}
			// If we found no converter, dispatch an error
			if ( !( conv || conv2 ) ) {
				jQuery.error( "No conversion from " + conversion.replace(" "," to ") );
			}
			// If found converter is not an equivalence
			if ( conv !== true ) {
				// Convert with 1 or 2 converters accordingly
				response = conv ? conv( response ) : conv2( conv1(response) );
			}
		}
	}
	return response;
}




var jsc = jQuery.now(),
	jsre = /(\=)\?(&|$)|\?\?/i;

// Default jsonp settings
jQuery.ajaxSetup({
	jsonp: "callback",
	jsonpCallback: function() {
		return jQuery.expando + "_" + ( jsc++ );
	}
});

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var inspectData = s.contentType === "application/x-www-form-urlencoded" &&
		( typeof s.data === "string" );

	if ( s.dataTypes[ 0 ] === "jsonp" ||
		s.jsonp !== false && ( jsre.test( s.url ) ||
				inspectData && jsre.test( s.data ) ) ) {

		var responseContainer,
			jsonpCallback = s.jsonpCallback =
				jQuery.isFunction( s.jsonpCallback ) ? s.jsonpCallback() : s.jsonpCallback,
			previous = window[ jsonpCallback ],
			url = s.url,
			data = s.data,
			replace = "$1" + jsonpCallback + "$2";

		if ( s.jsonp !== false ) {
			url = url.replace( jsre, replace );
			if ( s.url === url ) {
				if ( inspectData ) {
					data = data.replace( jsre, replace );
				}
				if ( s.data === data ) {
					// Add callback manually
					url += (/\?/.test( url ) ? "&" : "?") + s.jsonp + "=" + jsonpCallback;
				}
			}
		}

		s.url = url;
		s.data = data;

		// Install callback
		window[ jsonpCallback ] = function( response ) {
			responseContainer = [ response ];
		};

		// Clean-up function
		jqXHR.always(function() {
			// Set callback back to previous value
			window[ jsonpCallback ] = previous;
			// Call if it was a function and we have a response
			if ( responseContainer && jQuery.isFunction( previous ) ) {
				window[ jsonpCallback ]( responseContainer[ 0 ] );
			}
		});

		// Use data converter to retrieve json after script execution
		s.converters["script json"] = function() {
			if ( !responseContainer ) {
				jQuery.error( jsonpCallback + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// force json dataType
		s.dataTypes[ 0 ] = "json";

		// Delegate to script
		return "script";
	}
});




// Install script dataType
jQuery.ajaxSetup({
	accepts: {
		script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /javascript|ecmascript/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
});

// Handle cache's special case and global
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
		s.global = false;
	}
});

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function(s) {

	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {

		var script,
			head = document.head || document.getElementsByTagName( "head" )[0] || document.documentElement;

		return {

			send: function( _, callback ) {

				script = document.createElement( "script" );

				script.async = "async";

				if ( s.scriptCharset ) {
					script.charset = s.scriptCharset;
				}

				script.src = s.url;

				// Attach handlers for all browsers
				script.onload = script.onreadystatechange = function( _, isAbort ) {

					if ( isAbort || !script.readyState || /loaded|complete/.test( script.readyState ) ) {

						// Handle memory leak in IE
						script.onload = script.onreadystatechange = null;

						// Remove the script
						if ( head && script.parentNode ) {
							head.removeChild( script );
						}

						// Dereference the script
						script = undefined;

						// Callback if not abort
						if ( !isAbort ) {
							callback( 200, "success" );
						}
					}
				};
				// Use insertBefore instead of appendChild  to circumvent an IE6 bug.
				// This arises when a base node is used (#2709 and #4378).
				head.insertBefore( script, head.firstChild );
			},

			abort: function() {
				if ( script ) {
					script.onload( 0, 1 );
				}
			}
		};
	}
});




var // #5280: Internet Explorer will keep connections alive if we don't abort on unload
	xhrOnUnloadAbort = window.ActiveXObject ? function() {
		// Abort all pending requests
		for ( var key in xhrCallbacks ) {
			xhrCallbacks[ key ]( 0, 1 );
		}
	} : false,
	xhrId = 0,
	xhrCallbacks;

// Functions to create xhrs
function createStandardXHR() {
	try {
		return new window.XMLHttpRequest();
	} catch( e ) {}
}

function createActiveXHR() {
	try {
		return new window.ActiveXObject( "Microsoft.XMLHTTP" );
	} catch( e ) {}
}

// Create the request object
// (This is still attached to ajaxSettings for backward compatibility)
jQuery.ajaxSettings.xhr = window.ActiveXObject ?
	/* Microsoft failed to properly
	 * implement the XMLHttpRequest in IE7 (can't request local files),
	 * so we use the ActiveXObject when it is available
	 * Additionally XMLHttpRequest can be disabled in IE7/IE8 so
	 * we need a fallback.
	 */
	function() {
		return !this.isLocal && createStandardXHR() || createActiveXHR();
	} :
	// For all other browsers, use the standard XMLHttpRequest object
	createStandardXHR;

// Determine support properties
(function( xhr ) {
	jQuery.extend( jQuery.support, {
		ajax: !!xhr,
		cors: !!xhr && ( "withCredentials" in xhr )
	});
})( jQuery.ajaxSettings.xhr() );

// Create transport if the browser can provide an xhr
if ( jQuery.support.ajax ) {

	jQuery.ajaxTransport(function( s ) {
		// Cross domain only allowed if supported through XMLHttpRequest
		if ( !s.crossDomain || jQuery.support.cors ) {

			var callback;

			return {
				send: function( headers, complete ) {

					// Get a new xhr
					var xhr = s.xhr(),
						handle,
						i;

					// Open the socket
					// Passing null username, generates a login popup on Opera (#2865)
					if ( s.username ) {
						xhr.open( s.type, s.url, s.async, s.username, s.password );
					} else {
						xhr.open( s.type, s.url, s.async );
					}

					// Apply custom fields if provided
					if ( s.xhrFields ) {
						for ( i in s.xhrFields ) {
							xhr[ i ] = s.xhrFields[ i ];
						}
					}

					// Override mime type if needed
					if ( s.mimeType && xhr.overrideMimeType ) {
						xhr.overrideMimeType( s.mimeType );
					}

					// X-Requested-With header
					// For cross-domain requests, seeing as conditions for a preflight are
					// akin to a jigsaw puzzle, we simply never set it to be sure.
					// (it can always be set on a per-request basis or even using ajaxSetup)
					// For same-domain requests, won't change header if already provided.
					if ( !s.crossDomain && !headers["X-Requested-With"] ) {
						headers[ "X-Requested-With" ] = "XMLHttpRequest";
					}

					// Need an extra try/catch for cross domain requests in Firefox 3
					try {
						for ( i in headers ) {
							xhr.setRequestHeader( i, headers[ i ] );
						}
					} catch( _ ) {}

					// Do send the request
					// This may raise an exception which is actually
					// handled in jQuery.ajax (so no try/catch here)
					xhr.send( ( s.hasContent && s.data ) || null );

					// Listener
					callback = function( _, isAbort ) {

						var status,
							statusText,
							responseHeaders,
							responses,
							xml;

						// Firefox throws exceptions when accessing properties
						// of an xhr when a network error occured
						// http://helpful.knobs-dials.com/index.php/Component_returned_failure_code:_0x80040111_(NS_ERROR_NOT_AVAILABLE)
						try {

							// Was never called and is aborted or complete
							if ( callback && ( isAbort || xhr.readyState === 4 ) ) {

								// Only called once
								callback = undefined;

								// Do not keep as active anymore
								if ( handle ) {
									xhr.onreadystatechange = jQuery.noop;
									if ( xhrOnUnloadAbort ) {
										delete xhrCallbacks[ handle ];
									}
								}

								// If it's an abort
								if ( isAbort ) {
									// Abort it manually if needed
									if ( xhr.readyState !== 4 ) {
										xhr.abort();
									}
								} else {
									status = xhr.status;
									responseHeaders = xhr.getAllResponseHeaders();
									responses = {};
									xml = xhr.responseXML;

									// Construct response list
									if ( xml && xml.documentElement /* #4958 */ ) {
										responses.xml = xml;
									}
									responses.text = xhr.responseText;

									// Firefox throws an exception when accessing
									// statusText for faulty cross-domain requests
									try {
										statusText = xhr.statusText;
									} catch( e ) {
										// We normalize with Webkit giving an empty statusText
										statusText = "";
									}

									// Filter status for non standard behaviors

									// If the request is local and we have data: assume a success
									// (success with no data won't get notified, that's the best we
									// can do given current implementations)
									if ( !status && s.isLocal && !s.crossDomain ) {
										status = responses.text ? 200 : 404;
									// IE - #1450: sometimes returns 1223 when it should be 204
									} else if ( status === 1223 ) {
										status = 204;
									}
								}
							}
						} catch( firefoxAccessException ) {
							if ( !isAbort ) {
								complete( -1, firefoxAccessException );
							}
						}

						// Call complete if needed
						if ( responses ) {
							complete( status, statusText, responses, responseHeaders );
						}
					};

					// if we're in sync mode or it's in cache
					// and has been retrieved directly (IE6 & IE7)
					// we need to manually fire the callback
					if ( !s.async || xhr.readyState === 4 ) {
						callback();
					} else {
						handle = ++xhrId;
						if ( xhrOnUnloadAbort ) {
							// Create the active xhrs callbacks list if needed
							// and attach the unload handler
							if ( !xhrCallbacks ) {
								xhrCallbacks = {};
								jQuery( window ).unload( xhrOnUnloadAbort );
							}
							// Add to list of active xhrs callbacks
							xhrCallbacks[ handle ] = callback;
						}
						xhr.onreadystatechange = callback;
					}
				},

				abort: function() {
					if ( callback ) {
						callback(0,1);
					}
				}
			};
		}
	});
}




var elemdisplay = {},
	iframe, iframeDoc,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rfxnum = /^([+\-]=)?([\d+.\-]+)([a-z%]*)$/i,
	timerId,
	fxAttrs = [
		// height animations
		[ "height", "marginTop", "marginBottom", "paddingTop", "paddingBottom" ],
		// width animations
		[ "width", "marginLeft", "marginRight", "paddingLeft", "paddingRight" ],
		// opacity animations
		[ "opacity" ]
	],
	fxNow;

jQuery.fn.extend({
	show: function( speed, easing, callback ) {
		var elem, display;

		if ( speed || speed === 0 ) {
			return this.animate( genFx("show", 3), speed, easing, callback );

		} else {
			for ( var i = 0, j = this.length; i < j; i++ ) {
				elem = this[ i ];

				if ( elem.style ) {
					display = elem.style.display;

					// Reset the inline display of this element to learn if it is
					// being hidden by cascaded rules or not
					if ( !jQuery._data(elem, "olddisplay") && display === "none" ) {
						display = elem.style.display = "";
					}

					// Set elements which have been overridden with display: none
					// in a stylesheet to whatever the default browser style is
					// for such an element
					if ( display === "" && jQuery.css(elem, "display") === "none" ) {
						jQuery._data( elem, "olddisplay", defaultDisplay(elem.nodeName) );
					}
				}
			}

			// Set the display of most of the elements in a second loop
			// to avoid the constant reflow
			for ( i = 0; i < j; i++ ) {
				elem = this[ i ];

				if ( elem.style ) {
					display = elem.style.display;

					if ( display === "" || display === "none" ) {
						elem.style.display = jQuery._data( elem, "olddisplay" ) || "";
					}
				}
			}

			return this;
		}
	},

	hide: function( speed, easing, callback ) {
		if ( speed || speed === 0 ) {
			return this.animate( genFx("hide", 3), speed, easing, callback);

		} else {
			var elem, display,
				i = 0,
				j = this.length;

			for ( ; i < j; i++ ) {
				elem = this[i];
				if ( elem.style ) {
					display = jQuery.css( elem, "display" );

					if ( display !== "none" && !jQuery._data( elem, "olddisplay" ) ) {
						jQuery._data( elem, "olddisplay", display );
					}
				}
			}

			// Set the display of the elements in a second loop
			// to avoid the constant reflow
			for ( i = 0; i < j; i++ ) {
				if ( this[i].style ) {
					this[i].style.display = "none";
				}
			}

			return this;
		}
	},

	// Save the old toggle function
	_toggle: jQuery.fn.toggle,

	toggle: function( fn, fn2, callback ) {
		var bool = typeof fn === "boolean";

		if ( jQuery.isFunction(fn) && jQuery.isFunction(fn2) ) {
			this._toggle.apply( this, arguments );

		} else if ( fn == null || bool ) {
			this.each(function() {
				var state = bool ? fn : jQuery(this).is(":hidden");
				jQuery(this)[ state ? "show" : "hide" ]();
			});

		} else {
			this.animate(genFx("toggle", 3), fn, fn2, callback);
		}

		return this;
	},

	fadeTo: function( speed, to, easing, callback ) {
		return this.filter(":hidden").css("opacity", 0).show().end()
					.animate({opacity: to}, speed, easing, callback);
	},

	animate: function( prop, speed, easing, callback ) {
		var optall = jQuery.speed( speed, easing, callback );

		if ( jQuery.isEmptyObject( prop ) ) {
			return this.each( optall.complete, [ false ] );
		}

		// Do not change referenced properties as per-property easing will be lost
		prop = jQuery.extend( {}, prop );

		function doAnimation() {
			// XXX 'this' does not always have a nodeName when running the
			// test suite

			if ( optall.queue === false ) {
				jQuery._mark( this );
			}

			var opt = jQuery.extend( {}, optall ),
				isElement = this.nodeType === 1,
				hidden = isElement && jQuery(this).is(":hidden"),
				name, val, p, e,
				parts, start, end, unit,
				method;

			// will store per property easing and be used to determine when an animation is complete
			opt.animatedProperties = {};

			for ( p in prop ) {

				// property name normalization
				name = jQuery.camelCase( p );
				if ( p !== name ) {
					prop[ name ] = prop[ p ];
					delete prop[ p ];
				}

				val = prop[ name ];

				// easing resolution: per property > opt.specialEasing > opt.easing > 'swing' (default)
				if ( jQuery.isArray( val ) ) {
					opt.animatedProperties[ name ] = val[ 1 ];
					val = prop[ name ] = val[ 0 ];
				} else {
					opt.animatedProperties[ name ] = opt.specialEasing && opt.specialEasing[ name ] || opt.easing || 'swing';
				}

				if ( val === "hide" && hidden || val === "show" && !hidden ) {
					return opt.complete.call( this );
				}

				if ( isElement && ( name === "height" || name === "width" ) ) {
					// Make sure that nothing sneaks out
					// Record all 3 overflow attributes because IE does not
					// change the overflow attribute when overflowX and
					// overflowY are set to the same value
					opt.overflow = [ this.style.overflow, this.style.overflowX, this.style.overflowY ];

					// Set display property to inline-block for height/width
					// animations on inline elements that are having width/height animated
					if ( jQuery.css( this, "display" ) === "inline" &&
							jQuery.css( this, "float" ) === "none" ) {

						// inline-level elements accept inline-block;
						// block-level elements need to be inline with layout
						if ( !jQuery.support.inlineBlockNeedsLayout || defaultDisplay( this.nodeName ) === "inline" ) {
							this.style.display = "inline-block";

						} else {
							this.style.zoom = 1;
						}
					}
				}
			}

			if ( opt.overflow != null ) {
				this.style.overflow = "hidden";
			}

			for ( p in prop ) {
				e = new jQuery.fx( this, opt, p );
				val = prop[ p ];

				if ( rfxtypes.test( val ) ) {

					// Tracks whether to show or hide based on private
					// data attached to the element
					method = jQuery._data( this, "toggle" + p ) || ( val === "toggle" ? hidden ? "show" : "hide" : 0 );
					if ( method ) {
						jQuery._data( this, "toggle" + p, method === "show" ? "hide" : "show" );
						e[ method ]();
					} else {
						e[ val ]();
					}

				} else {
					parts = rfxnum.exec( val );
					start = e.cur();

					if ( parts ) {
						end = parseFloat( parts[2] );
						unit = parts[3] || ( jQuery.cssNumber[ p ] ? "" : "px" );

						// We need to compute starting value
						if ( unit !== "px" ) {
							jQuery.style( this, p, (end || 1) + unit);
							start = ( (end || 1) / e.cur() ) * start;
							jQuery.style( this, p, start + unit);
						}

						// If a +=/-= token was provided, we're doing a relative animation
						if ( parts[1] ) {
							end = ( (parts[ 1 ] === "-=" ? -1 : 1) * end ) + start;
						}

						e.custom( start, end, unit );

					} else {
						e.custom( start, val, "" );
					}
				}
			}

			// For JS strict compliance
			return true;
		}

		return optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},

	stop: function( type, clearQueue, gotoEnd ) {
		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue && type !== false ) {
			this.queue( type || "fx", [] );
		}

		return this.each(function() {
			var index,
				hadTimers = false,
				timers = jQuery.timers,
				data = jQuery._data( this );

			// clear marker counters if we know they won't be
			if ( !gotoEnd ) {
				jQuery._unmark( true, this );
			}

			function stopQueue( elem, data, index ) {
				var hooks = data[ index ];
				jQuery.removeData( elem, index, true );
				hooks.stop( gotoEnd );
			}

			if ( type == null ) {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && index.indexOf(".run") === index.length - 4 ) {
						stopQueue( this, data, index );
					}
				}
			} else if ( data[ index = type + ".run" ] && data[ index ].stop ){
				stopQueue( this, data, index );
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && (type == null || timers[ index ].queue === type) ) {
					if ( gotoEnd ) {

						// force the next step to be the last
						timers[ index ]( true );
					} else {
						timers[ index ].saveState();
					}
					hadTimers = true;
					timers.splice( index, 1 );
				}
			}

			// start the next in the queue if the last step wasn't forced
			// timers currently will call their complete callbacks, which will dequeue
			// but only if they were gotoEnd
			if ( !( gotoEnd && hadTimers ) ) {
				jQuery.dequeue( this, type );
			}
		});
	}

});

// Animations created synchronously will run synchronously
function createFxNow() {
	setTimeout( clearFxNow, 0 );
	return ( fxNow = jQuery.now() );
}

function clearFxNow() {
	fxNow = undefined;
}

// Generate parameters to create a standard animation
function genFx( type, num ) {
	var obj = {};

	jQuery.each( fxAttrs.concat.apply([], fxAttrs.slice( 0, num )), function() {
		obj[ this ] = type;
	});

	return obj;
}

// Generate shortcuts for custom animations
jQuery.each({
	slideDown: genFx( "show", 1 ),
	slideUp: genFx( "hide", 1 ),
	slideToggle: genFx( "toggle", 1 ),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
});

jQuery.extend({
	speed: function( speed, easing, fn ) {
		var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
			complete: fn || !fn && easing ||
				jQuery.isFunction( speed ) && speed,
			duration: speed,
			easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
		};

		opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
			opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;

		// normalize opt.queue - true/undefined/null -> "fx"
		if ( opt.queue == null || opt.queue === true ) {
			opt.queue = "fx";
		}

		// Queueing
		opt.old = opt.complete;

		opt.complete = function( noUnmark ) {
			if ( jQuery.isFunction( opt.old ) ) {
				opt.old.call( this );
			}

			if ( opt.queue ) {
				jQuery.dequeue( this, opt.queue );
			} else if ( noUnmark !== false ) {
				jQuery._unmark( this );
			}
		};

		return opt;
	},

	easing: {
		linear: function( p, n, firstNum, diff ) {
			return firstNum + diff * p;
		},
		swing: function( p, n, firstNum, diff ) {
			return ( ( -Math.cos( p*Math.PI ) / 2 ) + 0.5 ) * diff + firstNum;
		}
	},

	timers: [],

	fx: function( elem, options, prop ) {
		this.options = options;
		this.elem = elem;
		this.prop = prop;

		options.orig = options.orig || {};
	}

});

jQuery.fx.prototype = {
	// Simple function for setting a style value
	update: function() {
		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		( jQuery.fx.step[ this.prop ] || jQuery.fx.step._default )( this );
	},

	// Get the current size
	cur: function() {
		if ( this.elem[ this.prop ] != null && (!this.elem.style || this.elem.style[ this.prop ] == null) ) {
			return this.elem[ this.prop ];
		}

		var parsed,
			r = jQuery.css( this.elem, this.prop );
		// Empty strings, null, undefined and "auto" are converted to 0,
		// complex values such as "rotate(1rad)" are returned as is,
		// simple values such as "10px" are parsed to Float.
		return isNaN( parsed = parseFloat( r ) ) ? !r || r === "auto" ? 0 : r : parsed;
	},

	// Start an animation from one number to another
	custom: function( from, to, unit ) {
		var self = this,
			fx = jQuery.fx;

		this.startTime = fxNow || createFxNow();
		this.end = to;
		this.now = this.start = from;
		this.pos = this.state = 0;
		this.unit = unit || this.unit || ( jQuery.cssNumber[ this.prop ] ? "" : "px" );

		function t( gotoEnd ) {
			return self.step( gotoEnd );
		}

		t.queue = this.options.queue;
		t.elem = this.elem;
		t.saveState = function() {
			if ( self.options.hide && jQuery._data( self.elem, "fxshow" + self.prop ) === undefined ) {
				jQuery._data( self.elem, "fxshow" + self.prop, self.start );
			}
		};

		if ( t() && jQuery.timers.push(t) && !timerId ) {
			timerId = setInterval( fx.tick, fx.interval );
		}
	},

	// Simple 'show' function
	show: function() {
		var dataShow = jQuery._data( this.elem, "fxshow" + this.prop );

		// Remember where we started, so that we can go back to it later
		this.options.orig[ this.prop ] = dataShow || jQuery.style( this.elem, this.prop );
		this.options.show = true;

		// Begin the animation
		// Make sure that we start at a small width/height to avoid any flash of content
		if ( dataShow !== undefined ) {
			// This show is picking up where a previous hide or show left off
			this.custom( this.cur(), dataShow );
		} else {
			this.custom( this.prop === "width" || this.prop === "height" ? 1 : 0, this.cur() );
		}

		// Start by showing the element
		jQuery( this.elem ).show();
	},

	// Simple 'hide' function
	hide: function() {
		// Remember where we started, so that we can go back to it later
		this.options.orig[ this.prop ] = jQuery._data( this.elem, "fxshow" + this.prop ) || jQuery.style( this.elem, this.prop );
		this.options.hide = true;

		// Begin the animation
		this.custom( this.cur(), 0 );
	},

	// Each step of an animation
	step: function( gotoEnd ) {
		var p, n, complete,
			t = fxNow || createFxNow(),
			done = true,
			elem = this.elem,
			options = this.options;

		if ( gotoEnd || t >= options.duration + this.startTime ) {
			this.now = this.end;
			this.pos = this.state = 1;
			this.update();

			options.animatedProperties[ this.prop ] = true;

			for ( p in options.animatedProperties ) {
				if ( options.animatedProperties[ p ] !== true ) {
					done = false;
				}
			}

			if ( done ) {
				// Reset the overflow
				if ( options.overflow != null && !jQuery.support.shrinkWrapBlocks ) {

					jQuery.each( [ "", "X", "Y" ], function( index, value ) {
						elem.style[ "overflow" + value ] = options.overflow[ index ];
					});
				}

				// Hide the element if the "hide" operation was done
				if ( options.hide ) {
					jQuery( elem ).hide();
				}

				// Reset the properties, if the item has been hidden or shown
				if ( options.hide || options.show ) {
					for ( p in options.animatedProperties ) {
						jQuery.style( elem, p, options.orig[ p ] );
						jQuery.removeData( elem, "fxshow" + p, true );
						// Toggle data is no longer needed
						jQuery.removeData( elem, "toggle" + p, true );
					}
				}

				// Execute the complete function
				// in the event that the complete function throws an exception
				// we must ensure it won't be called twice. #5684

				complete = options.complete;
				if ( complete ) {

					options.complete = false;
					complete.call( elem );
				}
			}

			return false;

		} else {
			// classical easing cannot be used with an Infinity duration
			if ( options.duration == Infinity ) {
				this.now = t;
			} else {
				n = t - this.startTime;
				this.state = n / options.duration;

				// Perform the easing function, defaults to swing
				this.pos = jQuery.easing[ options.animatedProperties[this.prop] ]( this.state, n, 0, 1, options.duration );
				this.now = this.start + ( (this.end - this.start) * this.pos );
			}
			// Perform the next step of the animation
			this.update();
		}

		return true;
	}
};

jQuery.extend( jQuery.fx, {
	tick: function() {
		var timer,
			timers = jQuery.timers,
			i = 0;

		for ( ; i < timers.length; i++ ) {
			timer = timers[ i ];
			// Checks the timer has not already been removed
			if ( !timer() && timers[ i ] === timer ) {
				timers.splice( i--, 1 );
			}
		}

		if ( !timers.length ) {
			jQuery.fx.stop();
		}
	},

	interval: 13,

	stop: function() {
		clearInterval( timerId );
		timerId = null;
	},

	speeds: {
		slow: 600,
		fast: 200,
		// Default speed
		_default: 400
	},

	step: {
		opacity: function( fx ) {
			jQuery.style( fx.elem, "opacity", fx.now );
		},

		_default: function( fx ) {
			if ( fx.elem.style && fx.elem.style[ fx.prop ] != null ) {
				fx.elem.style[ fx.prop ] = fx.now + fx.unit;
			} else {
				fx.elem[ fx.prop ] = fx.now;
			}
		}
	}
});

// Adds width/height step functions
// Do not set anything below 0
jQuery.each([ "width", "height" ], function( i, prop ) {
	jQuery.fx.step[ prop ] = function( fx ) {
		jQuery.style( fx.elem, prop, Math.max(0, fx.now) + fx.unit );
	};
});

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.animated = function( elem ) {
		return jQuery.grep(jQuery.timers, function( fn ) {
			return elem === fn.elem;
		}).length;
	};
}

// Try to restore the default display value of an element
function defaultDisplay( nodeName ) {

	if ( !elemdisplay[ nodeName ] ) {

		var body = document.body,
			elem = jQuery( "<" + nodeName + ">" ).appendTo( body ),
			display = elem.css( "display" );
		elem.remove();

		// If the simple way fails,
		// get element's real default display by attaching it to a temp iframe
		if ( display === "none" || display === "" ) {
			// No iframe to use yet, so create it
			if ( !iframe ) {
				iframe = document.createElement( "iframe" );
				iframe.frameBorder = iframe.width = iframe.height = 0;
			}

			body.appendChild( iframe );

			// Create a cacheable copy of the iframe document on first call.
			// IE and Opera will allow us to reuse the iframeDoc without re-writing the fake HTML
			// document to it; WebKit & Firefox won't allow reusing the iframe document.
			if ( !iframeDoc || !iframe.createElement ) {
				iframeDoc = ( iframe.contentWindow || iframe.contentDocument ).document;
				iframeDoc.write( ( document.compatMode === "CSS1Compat" ? "<!doctype html>" : "" ) + "<html><body>" );
				iframeDoc.close();
			}

			elem = iframeDoc.createElement( nodeName );

			iframeDoc.body.appendChild( elem );

			display = jQuery.css( elem, "display" );
			body.removeChild( iframe );
		}

		// Store the correct default display
		elemdisplay[ nodeName ] = display;
	}

	return elemdisplay[ nodeName ];
}




var rtable = /^t(?:able|d|h)$/i,
	rroot = /^(?:body|html)$/i;

if ( "getBoundingClientRect" in document.documentElement ) {
	jQuery.fn.offset = function( options ) {
		var elem = this[0], box;

		if ( options ) {
			return this.each(function( i ) {
				jQuery.offset.setOffset( this, options, i );
			});
		}

		if ( !elem || !elem.ownerDocument ) {
			return null;
		}

		if ( elem === elem.ownerDocument.body ) {
			return jQuery.offset.bodyOffset( elem );
		}

		try {
			box = elem.getBoundingClientRect();
		} catch(e) {}

		var doc = elem.ownerDocument,
			docElem = doc.documentElement;

		// Make sure we're not dealing with a disconnected DOM node
		if ( !box || !jQuery.contains( docElem, elem ) ) {
			return box ? { top: box.top, left: box.left } : { top: 0, left: 0 };
		}

		var body = doc.body,
			win = getWindow(doc),
			clientTop  = docElem.clientTop  || body.clientTop  || 0,
			clientLeft = docElem.clientLeft || body.clientLeft || 0,
			scrollTop  = win.pageYOffset || jQuery.support.boxModel && docElem.scrollTop  || body.scrollTop,
			scrollLeft = win.pageXOffset || jQuery.support.boxModel && docElem.scrollLeft || body.scrollLeft,
			top  = box.top  + scrollTop  - clientTop,
			left = box.left + scrollLeft - clientLeft;

		return { top: top, left: left };
	};

} else {
	jQuery.fn.offset = function( options ) {
		var elem = this[0];

		if ( options ) {
			return this.each(function( i ) {
				jQuery.offset.setOffset( this, options, i );
			});
		}

		if ( !elem || !elem.ownerDocument ) {
			return null;
		}

		if ( elem === elem.ownerDocument.body ) {
			return jQuery.offset.bodyOffset( elem );
		}

		var computedStyle,
			offsetParent = elem.offsetParent,
			prevOffsetParent = elem,
			doc = elem.ownerDocument,
			docElem = doc.documentElement,
			body = doc.body,
			defaultView = doc.defaultView,
			prevComputedStyle = defaultView ? defaultView.getComputedStyle( elem, null ) : elem.currentStyle,
			top = elem.offsetTop,
			left = elem.offsetLeft;

		while ( (elem = elem.parentNode) && elem !== body && elem !== docElem ) {
			if ( jQuery.support.fixedPosition && prevComputedStyle.position === "fixed" ) {
				break;
			}

			computedStyle = defaultView ? defaultView.getComputedStyle(elem, null) : elem.currentStyle;
			top  -= elem.scrollTop;
			left -= elem.scrollLeft;

			if ( elem === offsetParent ) {
				top  += elem.offsetTop;
				left += elem.offsetLeft;

				if ( jQuery.support.doesNotAddBorder && !(jQuery.support.doesAddBorderForTableAndCells && rtable.test(elem.nodeName)) ) {
					top  += parseFloat( computedStyle.borderTopWidth  ) || 0;
					left += parseFloat( computedStyle.borderLeftWidth ) || 0;
				}

				prevOffsetParent = offsetParent;
				offsetParent = elem.offsetParent;
			}

			if ( jQuery.support.subtractsBorderForOverflowNotVisible && computedStyle.overflow !== "visible" ) {
				top  += parseFloat( computedStyle.borderTopWidth  ) || 0;
				left += parseFloat( computedStyle.borderLeftWidth ) || 0;
			}

			prevComputedStyle = computedStyle;
		}

		if ( prevComputedStyle.position === "relative" || prevComputedStyle.position === "static" ) {
			top  += body.offsetTop;
			left += body.offsetLeft;
		}

		if ( jQuery.support.fixedPosition && prevComputedStyle.position === "fixed" ) {
			top  += Math.max( docElem.scrollTop, body.scrollTop );
			left += Math.max( docElem.scrollLeft, body.scrollLeft );
		}

		return { top: top, left: left };
	};
}

jQuery.offset = {

	bodyOffset: function( body ) {
		var top = body.offsetTop,
			left = body.offsetLeft;

		if ( jQuery.support.doesNotIncludeMarginInBodyOffset ) {
			top  += parseFloat( jQuery.css(body, "marginTop") ) || 0;
			left += parseFloat( jQuery.css(body, "marginLeft") ) || 0;
		}

		return { top: top, left: left };
	},

	setOffset: function( elem, options, i ) {
		var position = jQuery.css( elem, "position" );

		// set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		var curElem = jQuery( elem ),
			curOffset = curElem.offset(),
			curCSSTop = jQuery.css( elem, "top" ),
			curCSSLeft = jQuery.css( elem, "left" ),
			calculatePosition = ( position === "absolute" || position === "fixed" ) && jQuery.inArray("auto", [curCSSTop, curCSSLeft]) > -1,
			props = {}, curPosition = {}, curTop, curLeft;

		// need to be able to calculate position if either top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;
		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( jQuery.isFunction( options ) ) {
			options = options.call( elem, i, curOffset );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );
		} else {
			curElem.css( props );
		}
	}
};


jQuery.fn.extend({

	position: function() {
		if ( !this[0] ) {
			return null;
		}

		var elem = this[0],

		// Get *real* offsetParent
		offsetParent = this.offsetParent(),

		// Get correct offsets
		offset       = this.offset(),
		parentOffset = rroot.test(offsetParent[0].nodeName) ? { top: 0, left: 0 } : offsetParent.offset();

		// Subtract element margins
		// note: when an element has margin: auto the offsetLeft and marginLeft
		// are the same in Safari causing offset.left to incorrectly be 0
		offset.top  -= parseFloat( jQuery.css(elem, "marginTop") ) || 0;
		offset.left -= parseFloat( jQuery.css(elem, "marginLeft") ) || 0;

		// Add offsetParent borders
		parentOffset.top  += parseFloat( jQuery.css(offsetParent[0], "borderTopWidth") ) || 0;
		parentOffset.left += parseFloat( jQuery.css(offsetParent[0], "borderLeftWidth") ) || 0;

		// Subtract the two offsets
		return {
			top:  offset.top  - parentOffset.top,
			left: offset.left - parentOffset.left
		};
	},

	offsetParent: function() {
		return this.map(function() {
			var offsetParent = this.offsetParent || document.body;
			while ( offsetParent && (!rroot.test(offsetParent.nodeName) && jQuery.css(offsetParent, "position") === "static") ) {
				offsetParent = offsetParent.offsetParent;
			}
			return offsetParent;
		});
	}
});


// Create scrollLeft and scrollTop methods
jQuery.each( ["Left", "Top"], function( i, name ) {
	var method = "scroll" + name;

	jQuery.fn[ method ] = function( val ) {
		var elem, win;

		if ( val === undefined ) {
			elem = this[ 0 ];

			if ( !elem ) {
				return null;
			}

			win = getWindow( elem );

			// Return the scroll offset
			return win ? ("pageXOffset" in win) ? win[ i ? "pageYOffset" : "pageXOffset" ] :
				jQuery.support.boxModel && win.document.documentElement[ method ] ||
					win.document.body[ method ] :
				elem[ method ];
		}

		// Set the scroll offset
		return this.each(function() {
			win = getWindow( this );

			if ( win ) {
				win.scrollTo(
					!i ? val : jQuery( win ).scrollLeft(),
					 i ? val : jQuery( win ).scrollTop()
				);

			} else {
				this[ method ] = val;
			}
		});
	};
});

function getWindow( elem ) {
	return jQuery.isWindow( elem ) ?
		elem :
		elem.nodeType === 9 ?
			elem.defaultView || elem.parentWindow :
			false;
}




// Create width, height, innerHeight, innerWidth, outerHeight and outerWidth methods
jQuery.each([ "Height", "Width" ], function( i, name ) {

	var type = name.toLowerCase();

	// innerHeight and innerWidth
	jQuery.fn[ "inner" + name ] = function() {
		var elem = this[0];
		return elem ?
			elem.style ?
			parseFloat( jQuery.css( elem, type, "padding" ) ) :
			this[ type ]() :
			null;
	};

	// outerHeight and outerWidth
	jQuery.fn[ "outer" + name ] = function( margin ) {
		var elem = this[0];
		return elem ?
			elem.style ?
			parseFloat( jQuery.css( elem, type, margin ? "margin" : "border" ) ) :
			this[ type ]() :
			null;
	};

	jQuery.fn[ type ] = function( size ) {
		// Get window width or height
		var elem = this[0];
		if ( !elem ) {
			return size == null ? null : this;
		}

		if ( jQuery.isFunction( size ) ) {
			return this.each(function( i ) {
				var self = jQuery( this );
				self[ type ]( size.call( this, i, self[ type ]() ) );
			});
		}

		if ( jQuery.isWindow( elem ) ) {
			// Everyone else use document.documentElement or document.body depending on Quirks vs Standards mode
			// 3rd condition allows Nokia support, as it supports the docElem prop but not CSS1Compat
			var docElemProp = elem.document.documentElement[ "client" + name ],
				body = elem.document.body;
			return elem.document.compatMode === "CSS1Compat" && docElemProp ||
				body && body[ "client" + name ] || docElemProp;

		// Get document width or height
		} else if ( elem.nodeType === 9 ) {
			// Either scroll[Width/Height] or offset[Width/Height], whichever is greater
			return Math.max(
				elem.documentElement["client" + name],
				elem.body["scroll" + name], elem.documentElement["scroll" + name],
				elem.body["offset" + name], elem.documentElement["offset" + name]
			);

		// Get or set width or height on the element
		} else if ( size === undefined ) {
			var orig = jQuery.css( elem, type ),
				ret = parseFloat( orig );

			return jQuery.isNumeric( ret ) ? ret : orig;

		// Set the width or height on the element (default to pixels if value is unitless)
		} else {
			return this.css( type, typeof size === "string" ? size : size + "px" );
		}
	};

});




// Expose jQuery to the global object
window.jQuery = window.$ = jQuery;

// Expose jQuery as an AMD module, but only for AMD loaders that
// understand the issues with loading multiple versions of jQuery
// in a page that all might call define(). The loader will indicate
// they have special allowances for multiple jQuery versions by
// specifying define.amd.jQuery = true. Register as a named module,
// since jQuery can be concatenated with other files that may use define,
// but not use a proper concatenation script that understands anonymous
// AMD modules. A named AMD is safest and most robust way to register.
// Lowercase jquery is used because AMD module names are derived from
// file names, and jQuery is normally delivered in a lowercase file name.
// Do this after creating the global so that if an AMD module wants to call
// noConflict to hide this version of jQuery, it will work.
if ( typeof define === "function" && define.amd && define.amd.jQuery ) {
	define( "jquery", [], function () { return jQuery; } );
}



})( window );
/*!
 * jQuery UI @VERSION
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI
 */
(function( $, undefined ) {

// prevent duplicate loading
// this is only a problem because we proxy existing functions
// and we don't want to double proxy them
$.ui = $.ui || {};
if ( $.ui.version ) {
	return;
}

$.extend( $.ui, {
	version: "@VERSION",

	keyCode: {
		ALT: 18,
		BACKSPACE: 8,
		CAPS_LOCK: 20,
		COMMA: 188,
		COMMAND: 91,
		COMMAND_LEFT: 91, // COMMAND
		COMMAND_RIGHT: 93,
		CONTROL: 17,
		DELETE: 46,
		DOWN: 40,
		END: 35,
		ENTER: 13,
		ESCAPE: 27,
		HOME: 36,
		INSERT: 45,
		LEFT: 37,
		MENU: 93, // COMMAND_RIGHT
		NUMPAD_ADD: 107,
		NUMPAD_DECIMAL: 110,
		NUMPAD_DIVIDE: 111,
		NUMPAD_ENTER: 108,
		NUMPAD_MULTIPLY: 106,
		NUMPAD_SUBTRACT: 109,
		PAGE_DOWN: 34,
		PAGE_UP: 33,
		PERIOD: 190,
		RIGHT: 39,
		SHIFT: 16,
		SPACE: 32,
		TAB: 9,
		UP: 38,
		WINDOWS: 91 // COMMAND
	}
});

// plugins
$.fn.extend({
	propAttr: $.fn.prop || $.fn.attr,

	_focus: $.fn.focus,
	focus: function( delay, fn ) {
		return typeof delay === "number" ?
			this.each(function() {
				var elem = this;
				setTimeout(function() {
					$( elem ).focus();
					if ( fn ) {
						fn.call( elem );
					}
				}, delay );
			}) :
			this._focus.apply( this, arguments );
	},

	scrollParent: function() {
		var scrollParent;
		if (($.browser.msie && (/(static|relative)/).test(this.css('position'))) || (/absolute/).test(this.css('position'))) {
			scrollParent = this.parents().filter(function() {
				return (/(relative|absolute|fixed)/).test($.curCSS(this,'position',1)) && (/(auto|scroll)/).test($.curCSS(this,'overflow',1)+$.curCSS(this,'overflow-y',1)+$.curCSS(this,'overflow-x',1));
			}).eq(0);
		} else {
			scrollParent = this.parents().filter(function() {
				return (/(auto|scroll)/).test($.curCSS(this,'overflow',1)+$.curCSS(this,'overflow-y',1)+$.curCSS(this,'overflow-x',1));
			}).eq(0);
		}

		return (/fixed/).test(this.css('position')) || !scrollParent.length ? $(document) : scrollParent;
	},

	zIndex: function( zIndex ) {
		if ( zIndex !== undefined ) {
			return this.css( "zIndex", zIndex );
		}

		if ( this.length ) {
			var elem = $( this[ 0 ] ), position, value;
			while ( elem.length && elem[ 0 ] !== document ) {
				// Ignore z-index if position is set to a value where z-index is ignored by the browser
				// This makes behavior of this function consistent across browsers
				// WebKit always returns auto if the element is positioned
				position = elem.css( "position" );
				if ( position === "absolute" || position === "relative" || position === "fixed" ) {
					// IE returns 0 when zIndex is not specified
					// other browsers return a string
					// we ignore the case of nested elements with an explicit value of 0
					// <div style="z-index: -10;"><div style="z-index: 0;"></div></div>
					value = parseInt( elem.css( "zIndex" ), 10 );
					if ( !isNaN( value ) && value !== 0 ) {
						return value;
					}
				}
				elem = elem.parent();
			}
		}

		return 0;
	},

	disableSelection: function() {
		return this.bind( ( $.support.selectstart ? "selectstart" : "mousedown" ) +
			".ui-disableSelection", function( event ) {
				event.preventDefault();
			});
	},

	enableSelection: function() {
		return this.unbind( ".ui-disableSelection" );
	}
});

$.each( [ "Width", "Height" ], function( i, name ) {
	var side = name === "Width" ? [ "Left", "Right" ] : [ "Top", "Bottom" ],
		type = name.toLowerCase(),
		orig = {
			innerWidth: $.fn.innerWidth,
			innerHeight: $.fn.innerHeight,
			outerWidth: $.fn.outerWidth,
			outerHeight: $.fn.outerHeight
		};

	function reduce( elem, size, border, margin ) {
		$.each( side, function() {
			size -= parseFloat( $.curCSS( elem, "padding" + this, true) ) || 0;
			if ( border ) {
				size -= parseFloat( $.curCSS( elem, "border" + this + "Width", true) ) || 0;
			}
			if ( margin ) {
				size -= parseFloat( $.curCSS( elem, "margin" + this, true) ) || 0;
			}
		});
		return size;
	}

	$.fn[ "inner" + name ] = function( size ) {
		if ( size === undefined ) {
			return orig[ "inner" + name ].call( this );
		}

		return this.each(function() {
			$( this ).css( type, reduce( this, size ) + "px" );
		});
	};

	$.fn[ "outer" + name] = function( size, margin ) {
		if ( typeof size !== "number" ) {
			return orig[ "outer" + name ].call( this, size );
		}

		return this.each(function() {
			$( this).css( type, reduce( this, size, true, margin ) + "px" );
		});
	};
});

// selectors
function focusable( element, isTabIndexNotNaN ) {
	var nodeName = element.nodeName.toLowerCase();
	if ( "area" === nodeName ) {
		var map = element.parentNode,
			mapName = map.name,
			img;
		if ( !element.href || !mapName || map.nodeName.toLowerCase() !== "map" ) {
			return false;
		}
		img = $( "img[usemap=#" + mapName + "]" )[0];
		return !!img && visible( img );
	}
	return ( /input|select|textarea|button|object/.test( nodeName )
		? !element.disabled
		: "a" == nodeName
			? element.href || isTabIndexNotNaN
			: isTabIndexNotNaN)
		// the element and all of its ancestors must be visible
		&& visible( element );
}

function visible( element ) {
	return !$( element ).parents().andSelf().filter(function() {
		return $.curCSS( this, "visibility" ) === "hidden" ||
			$.expr.filters.hidden( this );
	}).length;
}

$.extend( $.expr[ ":" ], {
	data: function( elem, i, match ) {
		return !!$.data( elem, match[ 3 ] );
	},

	focusable: function( element ) {
		return focusable( element, !isNaN( $.attr( element, "tabindex" ) ) );
	},

	tabbable: function( element ) {
		var tabIndex = $.attr( element, "tabindex" ),
			isTabIndexNaN = isNaN( tabIndex );
		return ( isTabIndexNaN || tabIndex >= 0 ) && focusable( element, !isTabIndexNaN );
	}
});

// support
$(function() {
	var body = document.body,
		div = body.appendChild( div = document.createElement( "div" ) );

	$.extend( div.style, {
		minHeight: "100px",
		height: "auto",
		padding: 0,
		borderWidth: 0
	});

	$.support.minHeight = div.offsetHeight === 100;
	$.support.selectstart = "onselectstart" in div;

	// set display to none to avoid a layout bug in IE
	// http://dev.jquery.com/ticket/4014
	body.removeChild( div ).style.display = "none";
});





// deprecated
$.extend( $.ui, {
	// $.ui.plugin is deprecated.  Use the proxy pattern instead.
	plugin: {
		add: function( module, option, set ) {
			var proto = $.ui[ module ].prototype;
			for ( var i in set ) {
				proto.plugins[ i ] = proto.plugins[ i ] || [];
				proto.plugins[ i ].push( [ option, set[ i ] ] );
			}
		},
		call: function( instance, name, args ) {
			var set = instance.plugins[ name ];
			if ( !set || !instance.element[ 0 ].parentNode ) {
				return;
			}
	
			for ( var i = 0; i < set.length; i++ ) {
				if ( instance.options[ set[ i ][ 0 ] ] ) {
					set[ i ][ 1 ].apply( instance.element, args );
				}
			}
		}
	},
	
	// will be deprecated when we switch to jQuery 1.4 - use jQuery.contains()
	contains: function( a, b ) {
		return document.compareDocumentPosition ?
			a.compareDocumentPosition( b ) & 16 :
			a !== b && a.contains( b );
	},
	
	// only used by resizable
	hasScroll: function( el, a ) {
	
		//If overflow is hidden, the element might have extra content, but the user wants to hide it
		if ( $( el ).css( "overflow" ) === "hidden") {
			return false;
		}
	
		var scroll = ( a && a === "left" ) ? "scrollLeft" : "scrollTop",
			has = false;
	
		if ( el[ scroll ] > 0 ) {
			return true;
		}
	
		// TODO: determine which cases actually cause this to happen
		// if the element doesn't have the scroll set, see if it's possible to
		// set the scroll
		el[ scroll ] = 1;
		has = ( el[ scroll ] > 0 );
		el[ scroll ] = 0;
		return has;
	},
	
	// these are odd functions, fix the API or move into individual plugins
	isOverAxis: function( x, reference, size ) {
		//Determines when x coordinate is over "b" element axis
		return ( x > reference ) && ( x < ( reference + size ) );
	},
	isOver: function( y, x, top, left, height, width ) {
		//Determines when x, y coordinates is over "b" element
		return $.ui.isOverAxis( y, top, height ) && $.ui.isOverAxis( x, left, width );
	}
});

})( jQuery );
/*!
 * jQuery UI Widget @VERSION
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Widget
 */
(function( $, undefined ) {

// jQuery 1.4+
if ( $.cleanData ) {
	var _cleanData = $.cleanData;
	$.cleanData = function( elems ) {
		for ( var i = 0, elem; (elem = elems[i]) != null; i++ ) {
			try {
				$( elem ).triggerHandler( "remove" );
			// http://bugs.jquery.com/ticket/8235
			} catch( e ) {}
		}
		_cleanData( elems );
	};
} else {
	var _remove = $.fn.remove;
	$.fn.remove = function( selector, keepData ) {
		return this.each(function() {
			if ( !keepData ) {
				if ( !selector || $.filter( selector, [ this ] ).length ) {
					$( "*", this ).add( [ this ] ).each(function() {
						try {
							$( this ).triggerHandler( "remove" );
						// http://bugs.jquery.com/ticket/8235
						} catch( e ) {}
					});
				}
			}
			return _remove.call( $(this), selector, keepData );
		});
	};
}

$.widget = function( name, base, prototype ) {
	var namespace = name.split( "." )[ 0 ],
		fullName;
	name = name.split( "." )[ 1 ];
	fullName = namespace + "-" + name;

	if ( !prototype ) {
		prototype = base;
		base = $.Widget;
	}

	// create selector for plugin
	$.expr[ ":" ][ fullName ] = function( elem ) {
		return !!$.data( elem, name );
	};

	$[ namespace ] = $[ namespace ] || {};
	$[ namespace ][ name ] = function( options, element ) {
		// allow instantiation without initializing for simple inheritance
		if ( arguments.length ) {
			this._createWidget( options, element );
		}
	};

	var basePrototype = new base();
	// we need to make the options hash a property directly on the new instance
	// otherwise we'll modify the options hash on the prototype that we're
	// inheriting from
//	$.each( basePrototype, function( key, val ) {
//		if ( $.isPlainObject(val) ) {
//			basePrototype[ key ] = $.extend( {}, val );
//		}
//	});
	basePrototype.options = $.extend( true, {}, basePrototype.options );
	$[ namespace ][ name ].prototype = $.extend( true, basePrototype, {
		namespace: namespace,
		widgetName: name,
		widgetEventPrefix: $[ namespace ][ name ].prototype.widgetEventPrefix || name,
		widgetBaseClass: fullName
	}, prototype );

	$.widget.bridge( name, $[ namespace ][ name ] );
};

$.widget.bridge = function( name, object ) {
	$.fn[ name ] = function( options ) {
		var isMethodCall = typeof options === "string",
			args = Array.prototype.slice.call( arguments, 1 ),
			returnValue = this;

		// allow multiple hashes to be passed on init
		options = !isMethodCall && args.length ?
			$.extend.apply( null, [ true, options ].concat(args) ) :
			options;

		// prevent calls to internal methods
		if ( isMethodCall && options.charAt( 0 ) === "_" ) {
			return returnValue;
		}

		if ( isMethodCall ) {
			this.each(function() {
				var instance = $.data( this, name ),
					methodValue = instance && $.isFunction( instance[options] ) ?
						instance[ options ].apply( instance, args ) :
						instance;
				// TODO: add this back in 1.9 and use $.error() (see #5972)
//				if ( !instance ) {
//					throw "cannot call methods on " + name + " prior to initialization; " +
//						"attempted to call method '" + options + "'";
//				}
//				if ( !$.isFunction( instance[options] ) ) {
//					throw "no such method '" + options + "' for " + name + " widget instance";
//				}
//				var methodValue = instance[ options ].apply( instance, args );
				if ( methodValue !== instance && methodValue !== undefined ) {
					returnValue = methodValue;
					return false;
				}
			});
		} else {
			this.each(function() {
				var instance = $.data( this, name );
				if ( instance ) {
					instance.option( options || {} )._init();
				} else {
					$.data( this, name, new object( options, this ) );
				}
			});
		}

		return returnValue;
	};
};

$.Widget = function( options, element ) {
	// allow instantiation without initializing for simple inheritance
	if ( arguments.length ) {
		this._createWidget( options, element );
	}
};

$.Widget.prototype = {
	widgetName: "widget",
	widgetEventPrefix: "",
	options: {
		disabled: false
	},
	_createWidget: function( options, element ) {
		// $.widget.bridge stores the plugin instance, but we do it anyway
		// so that it's stored even before the _create function runs
		$.data( element, this.widgetName, this );
		this.element = $( element );
		this.options = $.extend( true, {},
			this.options,
			this._getCreateOptions(),
			options );

		var self = this;
		this.element.bind( "remove." + this.widgetName, function() {
			self.destroy();
		});

		this._create();
		this._trigger( "create" );
		this._init();
	},
	_getCreateOptions: function() {
		return $.metadata && $.metadata.get( this.element[0] )[ this.widgetName ];
	},
	_create: function() {},
	_init: function() {},

	destroy: function() {
		this.element
			.unbind( "." + this.widgetName )
			.removeData( this.widgetName );
		this.widget()
			.unbind( "." + this.widgetName )
			.removeAttr( "aria-disabled" )
			.removeClass(
				this.widgetBaseClass + "-disabled " +
				"ui-state-disabled" );
	},

	widget: function() {
		return this.element;
	},

	option: function( key, value ) {
		var options = key;

		if ( arguments.length === 0 ) {
			// don't return a reference to the internal hash
			return $.extend( {}, this.options );
		}

		if  (typeof key === "string" ) {
			if ( value === undefined ) {
				return this.options[ key ];
			}
			options = {};
			options[ key ] = value;
		}

		this._setOptions( options );

		return this;
	},
	_setOptions: function( options ) {
		var self = this;
		$.each( options, function( key, value ) {
			self._setOption( key, value );
		});

		return this;
	},
	_setOption: function( key, value ) {
		this.options[ key ] = value;

		if ( key === "disabled" ) {
			this.widget()
				[ value ? "addClass" : "removeClass"](
					this.widgetBaseClass + "-disabled" + " " +
					"ui-state-disabled" )
				.attr( "aria-disabled", value );
		}

		return this;
	},

	enable: function() {
		return this._setOption( "disabled", false );
	},
	disable: function() {
		return this._setOption( "disabled", true );
	},

	_trigger: function( type, event, data ) {
		var prop, orig,
			callback = this.options[ type ];

		data = data || {};
		event = $.Event( event );
		event.type = ( type === this.widgetEventPrefix ?
			type :
			this.widgetEventPrefix + type ).toLowerCase();
		// the original event may come from any element
		// so we need to reset the target on the new event
		event.target = this.element[ 0 ];

		// copy original event properties over to the new event
		orig = event.originalEvent;
		if ( orig ) {
			for ( prop in orig ) {
				if ( !( prop in event ) ) {
					event[ prop ] = orig[ prop ];
				}
			}
		}

		this.element.trigger( event, data );

		return !( $.isFunction(callback) &&
			callback.call( this.element[0], event, data ) === false ||
			event.isDefaultPrevented() );
	}
};

})( jQuery );
/*!
 * jQuery UI Mouse @VERSION
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Mouse
 *
 * Depends:
 *	jquery.ui.widget.js
 */
(function( $, undefined ) {

var mouseHandled = false;
$( document ).mouseup( function( e ) {
	mouseHandled = false;
});

$.widget("ui.mouse", {
	options: {
		cancel: ':input,option',
		distance: 1,
		delay: 0
	},
	_mouseInit: function() {
		var self = this;

		this.element
			.bind('mousedown.'+this.widgetName, function(event) {
				return self._mouseDown(event);
			})
			.bind('click.'+this.widgetName, function(event) {
				if (true === $.data(event.target, self.widgetName + '.preventClickEvent')) {
				    $.removeData(event.target, self.widgetName + '.preventClickEvent');
					event.stopImmediatePropagation();
					return false;
				}
			});

		this.started = false;
	},

	// TODO: make sure destroying one instance of mouse doesn't mess with
	// other instances of mouse
	_mouseDestroy: function() {
		this.element.unbind('.'+this.widgetName);
	},

	_mouseDown: function(event) {
		// don't let more than one widget handle mouseStart
		if( mouseHandled ) { return };

		// we may have missed mouseup (out of window)
		(this._mouseStarted && this._mouseUp(event));

		this._mouseDownEvent = event;

		var self = this,
			btnIsLeft = (event.which == 1),
			// event.target.nodeName works around a bug in IE 8 with
			// disabled inputs (#7620)
			elIsCancel = (typeof this.options.cancel == "string" && event.target.nodeName ? $(event.target).closest(this.options.cancel).length : false);
		if (!btnIsLeft || elIsCancel || !this._mouseCapture(event)) {
			return true;
		}

		this.mouseDelayMet = !this.options.delay;
		if (!this.mouseDelayMet) {
			this._mouseDelayTimer = setTimeout(function() {
				self.mouseDelayMet = true;
			}, this.options.delay);
		}

		if (this._mouseDistanceMet(event) && this._mouseDelayMet(event)) {
			this._mouseStarted = (this._mouseStart(event) !== false);
			if (!this._mouseStarted) {
				event.preventDefault();
				return true;
			}
		}

		// Click event may never have fired (Gecko & Opera)
		if (true === $.data(event.target, this.widgetName + '.preventClickEvent')) {
			$.removeData(event.target, this.widgetName + '.preventClickEvent');
		}

		// these delegates are required to keep context
		this._mouseMoveDelegate = function(event) {
			return self._mouseMove(event);
		};
		this._mouseUpDelegate = function(event) {
			return self._mouseUp(event);
		};
		$(document)
			.bind('mousemove.'+this.widgetName, this._mouseMoveDelegate)
			.bind('mouseup.'+this.widgetName, this._mouseUpDelegate);

		event.preventDefault();
		
		mouseHandled = true;
		return true;
	},

	_mouseMove: function(event) {
		// IE mouseup check - mouseup happened when mouse was out of window
		if ($.browser.msie && !(document.documentMode >= 9) && !event.button) {
			return this._mouseUp(event);
		}

		if (this._mouseStarted) {
			this._mouseDrag(event);
			return event.preventDefault();
		}

		if (this._mouseDistanceMet(event) && this._mouseDelayMet(event)) {
			this._mouseStarted =
				(this._mouseStart(this._mouseDownEvent, event) !== false);
			(this._mouseStarted ? this._mouseDrag(event) : this._mouseUp(event));
		}

		return !this._mouseStarted;
	},

	_mouseUp: function(event) {
		$(document)
			.unbind('mousemove.'+this.widgetName, this._mouseMoveDelegate)
			.unbind('mouseup.'+this.widgetName, this._mouseUpDelegate);

		if (this._mouseStarted) {
			this._mouseStarted = false;

			if (event.target == this._mouseDownEvent.target) {
			    $.data(event.target, this.widgetName + '.preventClickEvent', true);
			}

			this._mouseStop(event);
		}

		return false;
	},

	_mouseDistanceMet: function(event) {
		return (Math.max(
				Math.abs(this._mouseDownEvent.pageX - event.pageX),
				Math.abs(this._mouseDownEvent.pageY - event.pageY)
			) >= this.options.distance
		);
	},

	_mouseDelayMet: function(event) {
		return this.mouseDelayMet;
	},

	// These are placeholder methods, to be overriden by extending plugin
	_mouseStart: function(event) {},
	_mouseDrag: function(event) {},
	_mouseStop: function(event) {},
	_mouseCapture: function(event) { return true; }
});

})(jQuery);
/*
 * jQuery UI Draggable @VERSION
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Draggables
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.mouse.js
 *	jquery.ui.widget.js
 */
(function( $, undefined ) {

$.widget("ui.draggable", $.ui.mouse, {
	widgetEventPrefix: "drag",
	options: {
		addClasses: true,
		appendTo: "parent",
		axis: false,
		connectToSortable: false,
		containment: false,
		cursor: "auto",
		cursorAt: false,
		grid: false,
		handle: false,
		helper: "original",
		iframeFix: false,
		opacity: false,
		refreshPositions: false,
		revert: false,
		revertDuration: 500,
		scope: "default",
		scroll: true,
		scrollSensitivity: 20,
		scrollSpeed: 20,
		snap: false,
		snapMode: "both",
		snapTolerance: 20,
		stack: false,
		zIndex: false,
		beforeStart: function(event) {}
	},
	_create: function() {

		if (this.options.helper == 'original' && !(/^(?:r|a|f)/).test(this.element.css("position")))
			this.element[0].style.position = 'relative';

		(this.options.addClasses && this.element.addClass("ui-draggable"));
		(this.options.disabled && this.element.addClass("ui-draggable-disabled"));

		this._mouseInit();

	},

	destroy: function() {
		if(!this.element.data('draggable')) return;
		this.element
			.removeData("draggable")
			.unbind(".draggable")
			.removeClass("ui-draggable"
				+ " ui-draggable-dragging"
				+ " ui-draggable-disabled");
		this._mouseDestroy();

		return this;
	},

	_mouseCapture: function(event) {

		var o = this.options;

		// among others, prevent a drag on a resizable-handle
		if (this.helper || o.disabled || $(event.target).is('.ui-resizable-handle'))
			return false;

		//Quit if we're not on a valid handle
		this.handle = this._getHandle(event);
		if (!this.handle)
			return false;
		
		if ( o.iframeFix ) {
			$(o.iframeFix === true ? "iframe" : o.iframeFix).each(function() {
				$('<div class="ui-draggable-iframeFix" style="background: #fff;"></div>')
				.css({
					width: this.offsetWidth+"px", height: this.offsetHeight+"px",
					position: "absolute", opacity: "0.001", zIndex: 1000
				})
				.css($(this).offset())
				.appendTo("body");
			});
		}

		return true;

	},

	_mouseStart: function(event) {

		var o = this.options;
		this.options.beforeStart(event);

		//Create and append the visible helper
		this.helper = this._createHelper(event);

		//Cache the helper size
		this._cacheHelperProportions();

		//If ddmanager is used for droppables, set the global draggable
		if($.ui.ddmanager)
			$.ui.ddmanager.current = this;

		/*
		 * - Position generation -
		 * This block generates everything position related - it's the core of draggables.
		 */

		//Cache the margins of the original element
		this._cacheMargins();

		//Store the helper's css position
		this.cssPosition = this.helper.css("position");
		this.scrollParent = this.helper.scrollParent();

		//The element's absolute position on the page minus margins
		this.offset = this.positionAbs = this.element.offset();
		this.offset = {
			top: this.offset.top - this.margins.top,
			left: this.offset.left - this.margins.left
		};

		$.extend(this.offset, {
			click: { //Where the click happened, relative to the element
				left: event.pageX - this.offset.left,
				top: event.pageY - this.offset.top
			},
			parent: this._getParentOffset(),
			relative: this._getRelativeOffset() //This is a relative to absolute position minus the actual position calculation - only used for relative positioned helper
		});

		//Generate the original position
		this.originalPosition = this.position = this._generatePosition(event);
		this.originalPageX = event.pageX;
		this.originalPageY = event.pageY;

		//Adjust the mouse offset relative to the helper if 'cursorAt' is supplied
		(o.cursorAt && this._adjustOffsetFromHelper(o.cursorAt));

		//Set a containment if given in the options
		if(o.containment)
			this._setContainment();

		//Trigger event + callbacks
		if(this._trigger("start", event) === false) {
			this._clear();
			return false;
		}

		//Recache the helper size
		this._cacheHelperProportions();

		//Prepare the droppable offsets
		if ($.ui.ddmanager && !o.dropBehaviour)
			$.ui.ddmanager.prepareOffsets(this, event);

		this.helper.addClass("ui-draggable-dragging");
		this._mouseDrag(event, true); //Execute the drag once - this causes the helper not to be visible before getting its correct position
		
		//If the ddmanager is used for droppables, inform the manager that dragging has started (see #5003)
		if ( $.ui.ddmanager ) $.ui.ddmanager.dragStart(this, event);
		
		return true;
	},

	_mouseDrag: function(event, noPropagation) {

		//Compute the helpers position
		this.position = this._generatePosition(event);
		this.positionAbs = this._convertPositionTo("absolute");

		//Call plugins and callbacks and use the resulting position if something is returned
		if (!noPropagation) {
			var ui = this._uiHash();
			if(this._trigger('drag', event, ui) === false) {
				this._mouseUp({});
				return false;
			}
			this.position = ui.position;
		}

		if(!this.options.axis || this.options.axis != "y") this.helper[0].style.left = this.position.left+'px';
		if(!this.options.axis || this.options.axis != "x") this.helper[0].style.top = this.position.top+'px';
		if($.ui.ddmanager) $.ui.ddmanager.drag(this, event);

		return false;
	},

	_mouseStop: function(event) {

		//If we are using droppables, inform the manager about the drop
		var dropped = false;
		if ($.ui.ddmanager && !this.options.dropBehaviour)
			dropped = $.ui.ddmanager.drop(this, event);

		//if a drop comes from outside (a sortable)
		if(this.dropped) {
			dropped = this.dropped;
			this.dropped = false;
		}
		
		//if the original element is removed, don't bother to continue if helper is set to "original"
		if((!this.element[0] || !this.element[0].parentNode) && this.options.helper == "original")
			return false;

		if((this.options.revert == "invalid" && !dropped) || (this.options.revert == "valid" && dropped) || this.options.revert === true || ($.isFunction(this.options.revert) && this.options.revert.call(this.element, dropped))) {
			var self = this;
			$(this.helper).animate(this.originalPosition, parseInt(this.options.revertDuration, 10), function() {
				if(self._trigger("stop", event) !== false) {
					self._clear();
				}
			});
		} else {
			if(this._trigger("stop", event) !== false) {
				this._clear();
			}
		}

		return false;
	},
	
	_mouseUp: function(event) {
		if (this.options.iframeFix === true) {
			$("div.ui-draggable-iframeFix").each(function() { 
				this.parentNode.removeChild(this); 
			}); //Remove frame helpers
		}
		
		//If the ddmanager is used for droppables, inform the manager that dragging has stopped (see #5003)
		if( $.ui.ddmanager ) $.ui.ddmanager.dragStop(this, event);
		
		return $.ui.mouse.prototype._mouseUp.call(this, event);
	},
	
	cancel: function() {
		
		if(this.helper.is(".ui-draggable-dragging")) {
			this._mouseUp({});
		} else {
			this._clear();
		}
		
		return this;
		
	},

	_getHandle: function(event) {

		var handle = !this.options.handle || !$(this.options.handle, this.element).length ? true : false;
		$(this.options.handle, this.element)
			.find("*")
			.andSelf()
			.each(function() {
				if(this == event.target) handle = true;
			});

		return handle;

	},

	_createHelper: function(event) {

		var o = this.options;
		var helper = $.isFunction(o.helper) ? $(o.helper.apply(this.element[0], [event])) : (o.helper == 'clone' ? this.element.clone().removeAttr('id') : this.element);

		if(!helper.parents('body').length)
			helper.appendTo((o.appendTo == 'parent' ? this.element[0].parentNode : o.appendTo));

		if(helper[0] != this.element[0] && !(/(fixed|absolute)/).test(helper.css("position")))
			helper.css("position", "absolute");

		return helper;

	},

	_adjustOffsetFromHelper: function(obj) {
		if (typeof obj == 'string') {
			obj = obj.split(' ');
		}
		if ($.isArray(obj)) {
			obj = {left: +obj[0], top: +obj[1] || 0};
		}
		if ('left' in obj) {
			this.offset.click.left = obj.left + this.margins.left;
		}
		if ('right' in obj) {
			this.offset.click.left = this.helperProportions.width - obj.right + this.margins.left;
		}
		if ('top' in obj) {
			this.offset.click.top = obj.top + this.margins.top;
		}
		if ('bottom' in obj) {
			this.offset.click.top = this.helperProportions.height - obj.bottom + this.margins.top;
		}
	},

	_getParentOffset: function() {

		//Get the offsetParent and cache its position
		this.offsetParent = this.helper.offsetParent();
		var po = this.offsetParent.offset();

		// This is a special case where we need to modify a offset calculated on start, since the following happened:
		// 1. The position of the helper is absolute, so it's position is calculated based on the next positioned parent
		// 2. The actual offset parent is a child of the scroll parent, and the scroll parent isn't the document, which means that
		//    the scroll is included in the initial calculation of the offset of the parent, and never recalculated upon drag
		if(this.cssPosition == 'absolute' && this.scrollParent[0] != document && $.ui.contains(this.scrollParent[0], this.offsetParent[0])) {
			po.left += this.scrollParent.scrollLeft();
			po.top += this.scrollParent.scrollTop();
		}

		if((this.offsetParent[0] == document.body) //This needs to be actually done for all browsers, since pageX/pageY includes this information
		|| (this.offsetParent[0].tagName && this.offsetParent[0].tagName.toLowerCase() == 'html' && $.browser.msie)) //Ugly IE fix
			po = { top: 0, left: 0 };

		return {
			top: po.top + (parseInt(this.offsetParent.css("borderTopWidth"),10) || 0),
			left: po.left + (parseInt(this.offsetParent.css("borderLeftWidth"),10) || 0)
		};

	},

	_getRelativeOffset: function() {

		if(this.cssPosition == "relative") {
			var p = this.element.position();
			return {
				top: p.top - (parseInt(this.helper.css("top"),10) || 0) + this.scrollParent.scrollTop(),
				left: p.left - (parseInt(this.helper.css("left"),10) || 0) + this.scrollParent.scrollLeft()
			};
		} else {
			return { top: 0, left: 0 };
		}

	},

	_cacheMargins: function() {
		this.margins = {
			left: (parseInt(this.element.css("marginLeft"),10) || 0),
			top: (parseInt(this.element.css("marginTop"),10) || 0),
			right: (parseInt(this.element.css("marginRight"),10) || 0),
			bottom: (parseInt(this.element.css("marginBottom"),10) || 0)
		};
	},

	_cacheHelperProportions: function() {
		this.helperProportions = {
			width: this.helper.outerWidth(),
			height: this.helper.outerHeight()
		};
	},

	_setContainment: function() {

		var o = this.options;
		if(o.containment == 'parent') o.containment = this.helper[0].parentNode;
		if(o.containment == 'document' || o.containment == 'window') this.containment = [
			o.containment == 'document' ? 0 : $(window).scrollLeft() - this.offset.relative.left - this.offset.parent.left,
			o.containment == 'document' ? 0 : $(window).scrollTop() - this.offset.relative.top - this.offset.parent.top,
			(o.containment == 'document' ? 0 : $(window).scrollLeft()) + $(o.containment == 'document' ? document : window).width() - this.helperProportions.width - this.margins.left,
			(o.containment == 'document' ? 0 : $(window).scrollTop()) + ($(o.containment == 'document' ? document : window).height() || document.body.parentNode.scrollHeight) - this.helperProportions.height - this.margins.top
		];

		if(!(/^(document|window|parent)$/).test(o.containment) && o.containment.constructor != Array) {
		        var c = $(o.containment);
			var ce = c[0]; if(!ce) return;
			var co = c.offset();
			var over = ($(ce).css("overflow") != 'hidden');

			this.containment = [
				(parseInt($(ce).css("borderLeftWidth"),10) || 0) + (parseInt($(ce).css("paddingLeft"),10) || 0),
				(parseInt($(ce).css("borderTopWidth"),10) || 0) + (parseInt($(ce).css("paddingTop"),10) || 0),
				(over ? Math.max(ce.scrollWidth,ce.offsetWidth) : ce.offsetWidth) - (parseInt($(ce).css("borderLeftWidth"),10) || 0) - (parseInt($(ce).css("paddingRight"),10) || 0) - this.helperProportions.width - this.margins.left - this.margins.right,
				(over ? Math.max(ce.scrollHeight,ce.offsetHeight) : ce.offsetHeight) - (parseInt($(ce).css("borderTopWidth"),10) || 0) - (parseInt($(ce).css("paddingBottom"),10) || 0) - this.helperProportions.height - this.margins.top  - this.margins.bottom
			];
			this.relative_container = c;

		} else if(o.containment.constructor == Array) {
			this.containment = o.containment;
		}

	},

	_convertPositionTo: function(d, pos) {

		if(!pos) pos = this.position;
		var mod = d == "absolute" ? 1 : -1;
		var o = this.options, scroll = this.cssPosition == 'absolute' && !(this.scrollParent[0] != document && $.ui.contains(this.scrollParent[0], this.offsetParent[0])) ? this.offsetParent : this.scrollParent, scrollIsRootNode = (/(html|body)/i).test(scroll[0].tagName);

		return {
			top: (
				pos.top																	// The absolute mouse position
				+ this.offset.relative.top * mod										// Only for relative positioned nodes: Relative offset from element to offset parent
				+ this.offset.parent.top * mod											// The offsetParent's offset without borders (offset + border)
				- ($.browser.safari && $.browser.version < 526 && this.cssPosition == 'fixed' ? 0 : ( this.cssPosition == 'fixed' ? -this.scrollParent.scrollTop() : ( scrollIsRootNode ? 0 : scroll.scrollTop() ) ) * mod)
			),
			left: (
				pos.left																// The absolute mouse position
				+ this.offset.relative.left * mod										// Only for relative positioned nodes: Relative offset from element to offset parent
				+ this.offset.parent.left * mod											// The offsetParent's offset without borders (offset + border)
				- ($.browser.safari && $.browser.version < 526 && this.cssPosition == 'fixed' ? 0 : ( this.cssPosition == 'fixed' ? -this.scrollParent.scrollLeft() : scrollIsRootNode ? 0 : scroll.scrollLeft() ) * mod)
			)
		};

	},

	_generatePosition: function(event) {

		var o = this.options, scroll = this.cssPosition == 'absolute' && !(this.scrollParent[0] != document && $.ui.contains(this.scrollParent[0], this.offsetParent[0])) ? this.offsetParent : this.scrollParent, scrollIsRootNode = (/(html|body)/i).test(scroll[0].tagName);
		var pageX = event.pageX;
		var pageY = event.pageY;

		/*
		 * - Position constraining -
		 * Constrain the position to a mix of grid, containment.
		 */

		if(this.originalPosition) { //If we are not dragging yet, we won't check for options
		         var containment;
		         if(this.containment) {
				 if (this.relative_container){
				     var co = this.relative_container.offset();
				     containment = [ this.containment[0] + co.left,
						     this.containment[1] + co.top,
						     this.containment[2] + co.left,
						     this.containment[3] + co.top ];
				 }
				 else {
				     containment = this.containment;
				 }

				if(event.pageX - this.offset.click.left < containment[0]) pageX = containment[0] + this.offset.click.left;
				if(event.pageY - this.offset.click.top < containment[1]) pageY = containment[1] + this.offset.click.top;
				if(event.pageX - this.offset.click.left > containment[2]) pageX = containment[2] + this.offset.click.left;
				if(event.pageY - this.offset.click.top > containment[3]) pageY = containment[3] + this.offset.click.top;
			}

			if(o.grid) {
				//Check for grid elements set to 0 to prevent divide by 0 error causing invalid argument errors in IE (see ticket #6950)
				var top = o.grid[1] ? this.originalPageY + Math.round((pageY - this.originalPageY) / o.grid[1]) * o.grid[1] : this.originalPageY;
				pageY = containment ? (!(top - this.offset.click.top < containment[1] || top - this.offset.click.top > containment[3]) ? top : (!(top - this.offset.click.top < containment[1]) ? top - o.grid[1] : top + o.grid[1])) : top;

				var left = o.grid[0] ? this.originalPageX + Math.round((pageX - this.originalPageX) / o.grid[0]) * o.grid[0] : this.originalPageX;
				pageX = containment ? (!(left - this.offset.click.left < containment[0] || left - this.offset.click.left > containment[2]) ? left : (!(left - this.offset.click.left < containment[0]) ? left - o.grid[0] : left + o.grid[0])) : left;
			}

		}

		return {
			top: (
				pageY																// The absolute mouse position
				- this.offset.click.top													// Click offset (relative to the element)
				- this.offset.relative.top												// Only for relative positioned nodes: Relative offset from element to offset parent
				- this.offset.parent.top												// The offsetParent's offset without borders (offset + border)
				+ ($.browser.safari && $.browser.version < 526 && this.cssPosition == 'fixed' ? 0 : ( this.cssPosition == 'fixed' ? -this.scrollParent.scrollTop() : ( scrollIsRootNode ? 0 : scroll.scrollTop() ) ))
			),
			left: (
				pageX																// The absolute mouse position
				- this.offset.click.left												// Click offset (relative to the element)
				- this.offset.relative.left												// Only for relative positioned nodes: Relative offset from element to offset parent
				- this.offset.parent.left												// The offsetParent's offset without borders (offset + border)
				+ ($.browser.safari && $.browser.version < 526 && this.cssPosition == 'fixed' ? 0 : ( this.cssPosition == 'fixed' ? -this.scrollParent.scrollLeft() : scrollIsRootNode ? 0 : scroll.scrollLeft() ))
			)
		};

	},

	_clear: function() {
		this.helper.removeClass("ui-draggable-dragging");
		if(this.helper[0] != this.element[0] && !this.cancelHelperRemoval) this.helper.remove();
		//if($.ui.ddmanager) $.ui.ddmanager.current = null;
		this.helper = null;
		this.cancelHelperRemoval = false;
	},

	// From now on bulk stuff - mainly helpers

	_trigger: function(type, event, ui) {
		ui = ui || this._uiHash();
		$.ui.plugin.call(this, type, [event, ui]);
		if(type == "drag") this.positionAbs = this._convertPositionTo("absolute"); //The absolute position has to be recalculated after plugins
		return $.Widget.prototype._trigger.call(this, type, event, ui);
	},

	plugins: {},

	_uiHash: function(event) {
		return {
			helper: this.helper,
			position: this.position,
			originalPosition: this.originalPosition,
			offset: this.positionAbs
		};
	}

});

$.extend($.ui.draggable, {
	version: "@VERSION"
});

$.ui.plugin.add("draggable", "connectToSortable", {
	start: function(event, ui) {

		var inst = $(this).data("draggable"), o = inst.options,
			uiSortable = $.extend({}, ui, { item: inst.element });
		inst.sortables = [];
		$(o.connectToSortable).each(function() {
			var sortable = $.data(this, 'sortable');
			if (sortable && !sortable.options.disabled) {
				inst.sortables.push({
					instance: sortable,
					shouldRevert: sortable.options.revert
				});
				sortable.refreshPositions();	// Call the sortable's refreshPositions at drag start to refresh the containerCache since the sortable container cache is used in drag and needs to be up to date (this will ensure it's initialised as well as being kept in step with any changes that might have happened on the page).
				sortable._trigger("activate", event, uiSortable);
			}
		});

	},
	stop: function(event, ui) {

		//If we are still over the sortable, we fake the stop event of the sortable, but also remove helper
		var inst = $(this).data("draggable"),
			uiSortable = $.extend({}, ui, { item: inst.element });

		$.each(inst.sortables, function() {
			if(this.instance.isOver) {

				this.instance.isOver = 0;

				inst.cancelHelperRemoval = true; //Don't remove the helper in the draggable instance
				this.instance.cancelHelperRemoval = false; //Remove it in the sortable instance (so sortable plugins like revert still work)

				//The sortable revert is supported, and we have to set a temporary dropped variable on the draggable to support revert: 'valid/invalid'
				if(this.shouldRevert) this.instance.options.revert = true;

				//Trigger the stop of the sortable
				this.instance._mouseStop(event);

				this.instance.options.helper = this.instance.options._helper;

				//If the helper has been the original item, restore properties in the sortable
				if(inst.options.helper == 'original')
					this.instance.currentItem.css({ top: 'auto', left: 'auto' });

			} else {
				this.instance.cancelHelperRemoval = false; //Remove the helper in the sortable instance
				this.instance._trigger("deactivate", event, uiSortable);
			}

		});

	},
	drag: function(event, ui) {

		var inst = $(this).data("draggable"), self = this;

		var checkPos = function(o) {
			var dyClick = this.offset.click.top, dxClick = this.offset.click.left;
			var helperTop = this.positionAbs.top, helperLeft = this.positionAbs.left;
			var itemHeight = o.height, itemWidth = o.width;
			var itemTop = o.top, itemLeft = o.left;

			return $.ui.isOver(helperTop + dyClick, helperLeft + dxClick, itemTop, itemLeft, itemHeight, itemWidth);
		};

		$.each(inst.sortables, function(i) {
			
			//Copy over some variables to allow calling the sortable's native _intersectsWith
			this.instance.positionAbs = inst.positionAbs;
			this.instance.helperProportions = inst.helperProportions;
			this.instance.offset.click = inst.offset.click;
			
			if(this.instance._intersectsWith(this.instance.containerCache)) {

				//If it intersects, we use a little isOver variable and set it once, so our move-in stuff gets fired only once
				if(!this.instance.isOver) {

					this.instance.isOver = 1;
					//Now we fake the start of dragging for the sortable instance,
					//by cloning the list group item, appending it to the sortable and using it as inst.currentItem
					//We can then fire the start event of the sortable with our passed browser event, and our own helper (so it doesn't create a new one)
					this.instance.currentItem = $(self).clone().removeAttr('id').appendTo(this.instance.element).data("sortable-item", true);
					this.instance.options._helper = this.instance.options.helper; //Store helper option to later restore it
					this.instance.options.helper = function() { return ui.helper[0]; };

					event.target = this.instance.currentItem[0];
					this.instance._mouseCapture(event, true);
					this.instance._mouseStart(event, true, true);

					//Because the browser event is way off the new appended portlet, we modify a couple of variables to reflect the changes
					this.instance.offset.click.top = inst.offset.click.top;
					this.instance.offset.click.left = inst.offset.click.left;
					this.instance.offset.parent.left -= inst.offset.parent.left - this.instance.offset.parent.left;
					this.instance.offset.parent.top -= inst.offset.parent.top - this.instance.offset.parent.top;

					inst._trigger("toSortable", event);
					inst.dropped = this.instance.element; //draggable revert needs that
					//hack so receive/update callbacks work (mostly)
					inst.currentItem = inst.element;
					this.instance.fromOutside = inst;

				}

				//Provided we did all the previous steps, we can fire the drag event of the sortable on every draggable drag, when it intersects with the sortable
				if(this.instance.currentItem) this.instance._mouseDrag(event);

			} else {

				//If it doesn't intersect with the sortable, and it intersected before,
				//we fake the drag stop of the sortable, but make sure it doesn't remove the helper by using cancelHelperRemoval
				if(this.instance.isOver) {

					this.instance.isOver = 0;
					this.instance.cancelHelperRemoval = true;
					
					//Prevent reverting on this forced stop
					this.instance.options.revert = false;
					
					// The out event needs to be triggered independently
					this.instance._trigger('out', event, this.instance._uiHash(this.instance));
					
					this.instance._mouseStop(event, true);
					this.instance.options.helper = this.instance.options._helper;

					//Now we remove our currentItem, the list group clone again, and the placeholder, and animate the helper back to it's original size
					this.instance.currentItem.remove();
					if(this.instance.placeholder) this.instance.placeholder.remove();

					inst._trigger("fromSortable", event);
					inst.dropped = false; //draggable revert needs that
				}

			};

		});

	}
});

$.ui.plugin.add("draggable", "cursor", {
	start: function(event, ui) {
		var t = $('body'), o = $(this).data('draggable').options;
		if (t.css("cursor")) o._cursor = t.css("cursor");
		t.css("cursor", o.cursor);
	},
	stop: function(event, ui) {
		var o = $(this).data('draggable').options;
		if (o._cursor) $('body').css("cursor", o._cursor);
	}
});

$.ui.plugin.add("draggable", "opacity", {
	start: function(event, ui) {
		var t = $(ui.helper), o = $(this).data('draggable').options;
		if(t.css("opacity")) o._opacity = t.css("opacity");
		t.css('opacity', o.opacity);
	},
	stop: function(event, ui) {
		var o = $(this).data('draggable').options;
		if(o._opacity) $(ui.helper).css('opacity', o._opacity);
	}
});

$.ui.plugin.add("draggable", "scroll", {
	start: function(event, ui) {
		var i = $(this).data("draggable");
		if(i.scrollParent[0] != document && i.scrollParent[0].tagName != 'HTML') i.overflowOffset = i.scrollParent.offset();
	},
	drag: function(event, ui) {

		var i = $(this).data("draggable"), o = i.options, scrolled = false;

		if(i.scrollParent[0] != document && i.scrollParent[0].tagName != 'HTML') {

			if(!o.axis || o.axis != 'x') {
				if((i.overflowOffset.top + i.scrollParent[0].offsetHeight) - event.pageY < o.scrollSensitivity)
					i.scrollParent[0].scrollTop = scrolled = i.scrollParent[0].scrollTop + o.scrollSpeed;
				else if(event.pageY - i.overflowOffset.top < o.scrollSensitivity)
					i.scrollParent[0].scrollTop = scrolled = i.scrollParent[0].scrollTop - o.scrollSpeed;
			}

			if(!o.axis || o.axis != 'y') {
				if((i.overflowOffset.left + i.scrollParent[0].offsetWidth) - event.pageX < o.scrollSensitivity)
					i.scrollParent[0].scrollLeft = scrolled = i.scrollParent[0].scrollLeft + o.scrollSpeed;
				else if(event.pageX - i.overflowOffset.left < o.scrollSensitivity)
					i.scrollParent[0].scrollLeft = scrolled = i.scrollParent[0].scrollLeft - o.scrollSpeed;
			}

		} else {

			if(!o.axis || o.axis != 'x') {
				if(event.pageY - $(document).scrollTop() < o.scrollSensitivity)
					scrolled = $(document).scrollTop($(document).scrollTop() - o.scrollSpeed);
				else if($(window).height() - (event.pageY - $(document).scrollTop()) < o.scrollSensitivity)
					scrolled = $(document).scrollTop($(document).scrollTop() + o.scrollSpeed);
			}

			if(!o.axis || o.axis != 'y') {
				if(event.pageX - $(document).scrollLeft() < o.scrollSensitivity)
					scrolled = $(document).scrollLeft($(document).scrollLeft() - o.scrollSpeed);
				else if($(window).width() - (event.pageX - $(document).scrollLeft()) < o.scrollSensitivity)
					scrolled = $(document).scrollLeft($(document).scrollLeft() + o.scrollSpeed);
			}

		}

		if(scrolled !== false && $.ui.ddmanager && !o.dropBehaviour)
			$.ui.ddmanager.prepareOffsets(i, event);

	}
});

$.ui.plugin.add("draggable", "snap", {
	start: function(event, ui) {

		var i = $(this).data("draggable"), o = i.options;
		i.snapElements = [];

		$(o.snap.constructor != String ? ( o.snap.items || ':data(draggable)' ) : o.snap).each(function() {
			var $t = $(this); var $o = $t.offset();
			if(this != i.element[0]) i.snapElements.push({
				item: this,
				width: $t.outerWidth(), height: $t.outerHeight(),
				top: $o.top, left: $o.left
			});
		});

	},
	drag: function(event, ui) {

		var inst = $(this).data("draggable"), o = inst.options;
		var d = o.snapTolerance;

		var x1 = ui.offset.left, x2 = x1 + inst.helperProportions.width,
			y1 = ui.offset.top, y2 = y1 + inst.helperProportions.height;

		for (var i = inst.snapElements.length - 1; i >= 0; i--){

			var l = inst.snapElements[i].left, r = l + inst.snapElements[i].width,
				t = inst.snapElements[i].top, b = t + inst.snapElements[i].height;

			//Yes, I know, this is insane ;)
			if(!((l-d < x1 && x1 < r+d && t-d < y1 && y1 < b+d) || (l-d < x1 && x1 < r+d && t-d < y2 && y2 < b+d) || (l-d < x2 && x2 < r+d && t-d < y1 && y1 < b+d) || (l-d < x2 && x2 < r+d && t-d < y2 && y2 < b+d))) {
				if(inst.snapElements[i].snapping) (inst.options.snap.release && inst.options.snap.release.call(inst.element, event, $.extend(inst._uiHash(), { snapItem: inst.snapElements[i].item })));
				inst.snapElements[i].snapping = false;
				continue;
			}

			if(o.snapMode != 'inner') {
				var ts = Math.abs(t - y2) <= d;
				var bs = Math.abs(b - y1) <= d;
				var ls = Math.abs(l - x2) <= d;
				var rs = Math.abs(r - x1) <= d;
				if(ts) ui.position.top = inst._convertPositionTo("relative", { top: t - inst.helperProportions.height, left: 0 }).top - inst.margins.top;
				if(bs) ui.position.top = inst._convertPositionTo("relative", { top: b, left: 0 }).top - inst.margins.top;
				if(ls) ui.position.left = inst._convertPositionTo("relative", { top: 0, left: l - inst.helperProportions.width }).left - inst.margins.left;
				if(rs) ui.position.left = inst._convertPositionTo("relative", { top: 0, left: r }).left - inst.margins.left;
			}

			var first = (ts || bs || ls || rs);

			if(o.snapMode != 'outer') {
				var ts = Math.abs(t - y1) <= d;
				var bs = Math.abs(b - y2) <= d;
				var ls = Math.abs(l - x1) <= d;
				var rs = Math.abs(r - x2) <= d;
				if(ts) ui.position.top = inst._convertPositionTo("relative", { top: t, left: 0 }).top - inst.margins.top;
				if(bs) ui.position.top = inst._convertPositionTo("relative", { top: b - inst.helperProportions.height, left: 0 }).top - inst.margins.top;
				if(ls) ui.position.left = inst._convertPositionTo("relative", { top: 0, left: l }).left - inst.margins.left;
				if(rs) ui.position.left = inst._convertPositionTo("relative", { top: 0, left: r - inst.helperProportions.width }).left - inst.margins.left;
			}

			if(!inst.snapElements[i].snapping && (ts || bs || ls || rs || first))
				(inst.options.snap.snap && inst.options.snap.snap.call(inst.element, event, $.extend(inst._uiHash(), { snapItem: inst.snapElements[i].item })));
			inst.snapElements[i].snapping = (ts || bs || ls || rs || first);

		};

	}
});

$.ui.plugin.add("draggable", "stack", {
	start: function(event, ui) {

		var o = $(this).data("draggable").options;

		var group = $.makeArray($(o.stack)).sort(function(a,b) {
			return (parseInt($(a).css("zIndex"),10) || 0) - (parseInt($(b).css("zIndex"),10) || 0);
		});
		if (!group.length) { return; }
		
		var min = parseInt(group[0].style.zIndex) || 0;
		$(group).each(function(i) {
			this.style.zIndex = min + i;
		});

		this[0].style.zIndex = min + group.length;

	}
});

$.ui.plugin.add("draggable", "zIndex", {
	start: function(event, ui) {
		var t = $(ui.helper), o = $(this).data("draggable").options;
		if(t.css("zIndex")) o._zIndex = t.css("zIndex");
		t.css('zIndex', o.zIndex);
	},
	stop: function(event, ui) {
		var o = $(this).data("draggable").options;
		if(o._zIndex) $(ui.helper).css('zIndex', o._zIndex);
	}
});

})(jQuery);
/*
 * jQuery UI Droppable @VERSION
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Droppables
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.widget.js
 *	jquery.ui.mouse.js
 *	jquery.ui.draggable.js
 */
(function( $, undefined ) {

$.widget("ui.droppable", {
	widgetEventPrefix: "drop",
	options: {
		accept: '*',
		activeClass: false,
		addClasses: true,
		greedy: false,
		hoverClass: false,
		scope: 'default',
		tolerance: 'intersect'
	},
	_create: function() {

		var o = this.options, accept = o.accept;
		this.isover = 0; this.isout = 1;

		this.accept = $.isFunction(accept) ? accept : function(d) {
			return d.is(accept);
		};

		//Store the droppable's proportions
		this.proportions = { width: this.element[0].offsetWidth, height: this.element[0].offsetHeight };

		// Add the reference and positions to the manager
		$.ui.ddmanager.droppables[o.scope] = $.ui.ddmanager.droppables[o.scope] || [];
		$.ui.ddmanager.droppables[o.scope].push(this);

		(o.addClasses && this.element.addClass("ui-droppable"));

	},

	destroy: function() {
		var drop = $.ui.ddmanager.droppables[this.options.scope];
		for ( var i = 0; i < drop.length; i++ )
			if ( drop[i] == this )
				drop.splice(i, 1);

		this.element
			.removeClass("ui-droppable ui-droppable-disabled")
			.removeData("droppable")
			.unbind(".droppable");

		return this;
	},

	_setOption: function(key, value) {

		if(key == 'accept') {
			this.accept = $.isFunction(value) ? value : function(d) {
				return d.is(value);
			};
		}
		$.Widget.prototype._setOption.apply(this, arguments);
	},

	_activate: function(event) {
		var draggable = $.ui.ddmanager.current;
		if(this.options.activeClass) this.element.addClass(this.options.activeClass);
		(draggable && this._trigger('activate', event, this.ui(draggable)));
	},

	_deactivate: function(event) {
		var draggable = $.ui.ddmanager.current;
		if(this.options.activeClass) this.element.removeClass(this.options.activeClass);
		(draggable && this._trigger('deactivate', event, this.ui(draggable)));
	},

	_over: function(event) {

		var draggable = $.ui.ddmanager.current;
		if (!draggable || (draggable.currentItem || draggable.element)[0] == this.element[0]) return; // Bail if draggable and droppable are same element

		if (this.accept.call(this.element[0],(draggable.currentItem || draggable.element))) {
			if(this.options.hoverClass) this.element.addClass(this.options.hoverClass);
			this._trigger('over', event, this.ui(draggable));
		}

	},

	_out: function(event) {

		var draggable = $.ui.ddmanager.current;
		if (!draggable || (draggable.currentItem || draggable.element)[0] == this.element[0]) return; // Bail if draggable and droppable are same element

		if (this.accept.call(this.element[0],(draggable.currentItem || draggable.element))) {
			if(this.options.hoverClass) this.element.removeClass(this.options.hoverClass);
			this._trigger('out', event, this.ui(draggable));
		}

	},

	_drop: function(event,custom) {

		var draggable = custom || $.ui.ddmanager.current;
		if (!draggable || (draggable.currentItem || draggable.element)[0] == this.element[0]) return false; // Bail if draggable and droppable are same element

		var childrenIntersection = false;
		this.element.find(":data(droppable)").not(".ui-draggable-dragging").each(function() {
			var inst = $.data(this, 'droppable');
			if(
				inst.options.greedy
				&& !inst.options.disabled
				&& inst.options.scope == draggable.options.scope
				&& inst.accept.call(inst.element[0], (draggable.currentItem || draggable.element))
				&& $.ui.intersect(draggable, $.extend(inst, { offset: inst.element.offset() }), inst.options.tolerance)
			) { childrenIntersection = true; return false; }
		});
		if(childrenIntersection) return false;

		if(this.accept.call(this.element[0],(draggable.currentItem || draggable.element))) {
			if(this.options.activeClass) this.element.removeClass(this.options.activeClass);
			if(this.options.hoverClass) this.element.removeClass(this.options.hoverClass);
			this._trigger('drop', event, this.ui(draggable));
			return this.element;
		}

		return false;

	},

	ui: function(c) {
		return {
			draggable: (c.currentItem || c.element),
			helper: c.helper,
			position: c.position,
			offset: c.positionAbs
		};
	}

});

$.extend($.ui.droppable, {
	version: "@VERSION"
});

$.ui.intersect = function(draggable, droppable, toleranceMode) {

	if (!droppable.offset) return false;

	var x1 = (draggable.positionAbs || draggable.position.absolute).left, x2 = x1 + draggable.helperProportions.width,
		y1 = (draggable.positionAbs || draggable.position.absolute).top, y2 = y1 + draggable.helperProportions.height;
	var l = droppable.offset.left, r = l + droppable.proportions.width,
		t = droppable.offset.top, b = t + droppable.proportions.height;

	switch (toleranceMode) {
		case 'fit':
			return (l <= x1 && x2 <= r
				&& t <= y1 && y2 <= b);
			break;
		case 'intersect':
			return (l < x1 + (draggable.helperProportions.width / 2) // Right Half
				&& x2 - (draggable.helperProportions.width / 2) < r // Left Half
				&& t < y1 + (draggable.helperProportions.height / 2) // Bottom Half
				&& y2 - (draggable.helperProportions.height / 2) < b ); // Top Half
			break;
		case 'pointer':
			var draggableLeft = ((draggable.positionAbs || draggable.position.absolute).left + (draggable.clickOffset || draggable.offset.click).left),
				draggableTop = ((draggable.positionAbs || draggable.position.absolute).top + (draggable.clickOffset || draggable.offset.click).top),
				isOver = $.ui.isOver(draggableTop, draggableLeft, t, l, droppable.proportions.height, droppable.proportions.width);
			return isOver;
			break;
		case 'touch':
			return (
					(y1 >= t && y1 <= b) ||	// Top edge touching
					(y2 >= t && y2 <= b) ||	// Bottom edge touching
					(y1 < t && y2 > b)		// Surrounded vertically
				) && (
					(x1 >= l && x1 <= r) ||	// Left edge touching
					(x2 >= l && x2 <= r) ||	// Right edge touching
					(x1 < l && x2 > r)		// Surrounded horizontally
				);
			break;
		default:
			return false;
			break;
		}

};

/*
	This manager tracks offsets of draggables and droppables
*/
$.ui.ddmanager = {
	current: null,
	droppables: { 'default': [] },
	prepareOffsets: function(t, event) {

		var m = $.ui.ddmanager.droppables[t.options.scope] || [];
		var type = event ? event.type : null; // workaround for #2317
		var list = (t.currentItem || t.element).find(":data(droppable)").andSelf();

		droppablesLoop: for (var i = 0; i < m.length; i++) {

			if(m[i].options.disabled || (t && !m[i].accept.call(m[i].element[0],(t.currentItem || t.element)))) continue;	//No disabled and non-accepted
			for (var j=0; j < list.length; j++) { if(list[j] == m[i].element[0]) { m[i].proportions.height = 0; continue droppablesLoop; } }; //Filter out elements in the current dragged item
			m[i].visible = m[i].element.css("display") != "none"; if(!m[i].visible) continue; 									//If the element is not visible, continue

			if(type == "mousedown") m[i]._activate.call(m[i], event); //Activate the droppable if used directly from draggables

			m[i].offset = m[i].element.offset();
			m[i].proportions = { width: m[i].element[0].offsetWidth, height: m[i].element[0].offsetHeight };

		}

	},
	drop: function(draggable, event) {

		var dropped = false;
		$.each($.ui.ddmanager.droppables[draggable.options.scope] || [], function() {

			if(!this.options) return;
			if (!this.options.disabled && this.visible && $.ui.intersect(draggable, this, this.options.tolerance))
				dropped = this._drop.call(this, event) || dropped;

			if (!this.options.disabled && this.visible && this.accept.call(this.element[0],(draggable.currentItem || draggable.element))) {
				this.isout = 1; this.isover = 0;
				this._deactivate.call(this, event);
			}

		});
		return dropped;

	},
	dragStart: function( draggable, event ) {
		//Listen for scrolling so that if the dragging causes scrolling the position of the droppables can be recalculated (see #5003)
		draggable.element.parents( ":not(body,html)" ).bind( "scroll.droppable", function() {
			if( !draggable.options.refreshPositions ) $.ui.ddmanager.prepareOffsets( draggable, event );
		});
	},
	drag: function(draggable, event) {

		//If you have a highly dynamic page, you might try this option. It renders positions every time you move the mouse.
		if(draggable.options.refreshPositions) $.ui.ddmanager.prepareOffsets(draggable, event);

		//Run through all droppables and check their positions based on specific tolerance options
		$.each($.ui.ddmanager.droppables[draggable.options.scope] || [], function() {

			if(this.options.disabled || this.greedyChild || !this.visible) return;
			var intersects = $.ui.intersect(draggable, this, this.options.tolerance);

			var c = !intersects && this.isover == 1 ? 'isout' : (intersects && this.isover == 0 ? 'isover' : null);
			if(!c) return;

			var parentInstance;
			if (this.options.greedy) {
				var parent = this.element.parents(':data(droppable):eq(0)');
				if (parent.length) {
					parentInstance = $.data(parent[0], 'droppable');
					parentInstance.greedyChild = (c == 'isover' ? 1 : 0);
				}
			}

			// we just moved into a greedy child
			if (parentInstance && c == 'isover') {
				parentInstance['isover'] = 0;
				parentInstance['isout'] = 1;
				parentInstance._out.call(parentInstance, event);
			}

			this[c] = 1; this[c == 'isout' ? 'isover' : 'isout'] = 0;
			this[c == "isover" ? "_over" : "_out"].call(this, event);

			// we just moved out of a greedy child
			if (parentInstance && c == 'isout') {
				parentInstance['isout'] = 0;
				parentInstance['isover'] = 1;
				parentInstance._over.call(parentInstance, event);
			}
		});

	},
	dragStop: function( draggable, event ) {
		draggable.element.parents( ":not(body,html)" ).unbind( "scroll.droppable" );
		//Call prepareOffsets one final time since IE does not fire return scroll events when overflow was caused by drag (see #5003)
		if( !draggable.options.refreshPositions ) $.ui.ddmanager.prepareOffsets( draggable, event );
	}
};

})(jQuery);
/*
 * jQuery UI Effects @VERSION
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Effects/
 */
;jQuery.effects || (function($, undefined) {

$.effects = {};



/******************************************************************************/
/****************************** COLOR ANIMATIONS ******************************/
/******************************************************************************/

// override the animation for color styles
$.each(['backgroundColor', 'borderBottomColor', 'borderLeftColor',
	'borderRightColor', 'borderTopColor', 'borderColor', 'color', 'outlineColor'],
function(i, attr) {
	$.fx.step[attr] = function(fx) {
		if (!fx.colorInit) {
			fx.start = getColor(fx.elem, attr);
			fx.end = getRGB(fx.end);
			fx.colorInit = true;
		}

		fx.elem.style[attr] = 'rgb(' +
			Math.max(Math.min(parseInt((fx.pos * (fx.end[0] - fx.start[0])) + fx.start[0], 10), 255), 0) + ',' +
			Math.max(Math.min(parseInt((fx.pos * (fx.end[1] - fx.start[1])) + fx.start[1], 10), 255), 0) + ',' +
			Math.max(Math.min(parseInt((fx.pos * (fx.end[2] - fx.start[2])) + fx.start[2], 10), 255), 0) + ')';
	};
});

// Color Conversion functions from highlightFade
// By Blair Mitchelmore
// http://jquery.offput.ca/highlightFade/

// Parse strings looking for color tuples [255,255,255]
function getRGB(color) {
		var result;

		// Check if we're already dealing with an array of colors
		if ( color && color.constructor == Array && color.length == 3 )
				return color;

		// Look for rgb(num,num,num)
		if (result = /rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/.exec(color))
				return [parseInt(result[1],10), parseInt(result[2],10), parseInt(result[3],10)];

		// Look for rgb(num%,num%,num%)
		if (result = /rgb\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*\)/.exec(color))
				return [parseFloat(result[1])*2.55, parseFloat(result[2])*2.55, parseFloat(result[3])*2.55];

		// Look for #a0b1c2
		if (result = /#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/.exec(color))
				return [parseInt(result[1],16), parseInt(result[2],16), parseInt(result[3],16)];

		// Look for #fff
		if (result = /#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/.exec(color))
				return [parseInt(result[1]+result[1],16), parseInt(result[2]+result[2],16), parseInt(result[3]+result[3],16)];

		// Look for rgba(0, 0, 0, 0) == transparent in Safari 3
		if (result = /rgba\(0, 0, 0, 0\)/.exec(color))
				return colors['transparent'];

		// Otherwise, we're most likely dealing with a named color
		return colors[$.trim(color).toLowerCase()];
}

function getColor(elem, attr) {
		var color;

		do {
				color = $.curCSS(elem, attr);

				// Keep going until we find an element that has color, or we hit the body
				if ( color != '' && color != 'transparent' || $.nodeName(elem, "body") )
						break;

				attr = "backgroundColor";
		} while ( elem = elem.parentNode );

		return getRGB(color);
};

// Some named colors to work with
// From Interface by Stefan Petre
// http://interface.eyecon.ro/

var colors = {
	aqua:[0,255,255],
	azure:[240,255,255],
	beige:[245,245,220],
	black:[0,0,0],
	blue:[0,0,255],
	brown:[165,42,42],
	cyan:[0,255,255],
	darkblue:[0,0,139],
	darkcyan:[0,139,139],
	darkgrey:[169,169,169],
	darkgreen:[0,100,0],
	darkkhaki:[189,183,107],
	darkmagenta:[139,0,139],
	darkolivegreen:[85,107,47],
	darkorange:[255,140,0],
	darkorchid:[153,50,204],
	darkred:[139,0,0],
	darksalmon:[233,150,122],
	darkviolet:[148,0,211],
	fuchsia:[255,0,255],
	gold:[255,215,0],
	green:[0,128,0],
	indigo:[75,0,130],
	khaki:[240,230,140],
	lightblue:[173,216,230],
	lightcyan:[224,255,255],
	lightgreen:[144,238,144],
	lightgrey:[211,211,211],
	lightpink:[255,182,193],
	lightyellow:[255,255,224],
	lime:[0,255,0],
	magenta:[255,0,255],
	maroon:[128,0,0],
	navy:[0,0,128],
	olive:[128,128,0],
	orange:[255,165,0],
	pink:[255,192,203],
	purple:[128,0,128],
	violet:[128,0,128],
	red:[255,0,0],
	silver:[192,192,192],
	white:[255,255,255],
	yellow:[255,255,0],
	transparent: [255,255,255]
};



/******************************************************************************/
/****************************** CLASS ANIMATIONS ******************************/
/******************************************************************************/

var classAnimationActions = ['add', 'remove', 'toggle'],
	shorthandStyles = {
		border: 1,
		borderBottom: 1,
		borderColor: 1,
		borderLeft: 1,
		borderRight: 1,
		borderTop: 1,
		borderWidth: 1,
		margin: 1,
		padding: 1
	};

function getElementStyles() {
	var style = document.defaultView
			? document.defaultView.getComputedStyle(this, null)
			: this.currentStyle,
		newStyle = {},
		key,
		camelCase;

	// webkit enumerates style porperties
	if (style && style.length && style[0] && style[style[0]]) {
		var len = style.length;
		while (len--) {
			key = style[len];
			if (typeof style[key] == 'string') {
				camelCase = key.replace(/\-(\w)/g, function(all, letter){
					return letter.toUpperCase();
				});
				newStyle[camelCase] = style[key];
			}
		}
	} else {
		for (key in style) {
			if (typeof style[key] === 'string') {
				newStyle[key] = style[key];
			}
		}
	}
	
	return newStyle;
}

function filterStyles(styles) {
	var name, value;
	for (name in styles) {
		value = styles[name];
		if (
			// ignore null and undefined values
			value == null ||
			// ignore functions (when does this occur?)
			$.isFunction(value) ||
			// shorthand styles that need to be expanded
			name in shorthandStyles ||
			// ignore scrollbars (break in IE)
			(/scrollbar/).test(name) ||

			// only colors or values that can be converted to numbers
			(!(/color/i).test(name) && isNaN(parseFloat(value)))
		) {
			delete styles[name];
		}
	}
	
	return styles;
}

function styleDifference(oldStyle, newStyle) {
	var diff = { _: 0 }, // http://dev.jquery.com/ticket/5459
		name;

	for (name in newStyle) {
		if (oldStyle[name] != newStyle[name]) {
			diff[name] = newStyle[name];
		}
	}

	return diff;
}

$.effects.animateClass = function(value, duration, easing, callback) {
	if ($.isFunction(easing)) {
		callback = easing;
		easing = null;
	}

	return this.queue(function() {
		var that = $(this),
			originalStyleAttr = that.attr('style') || ' ',
			originalStyle = filterStyles(getElementStyles.call(this)),
			newStyle,
			className = that.attr('class');

		$.each(classAnimationActions, function(i, action) {
			if (value[action]) {
				that[action + 'Class'](value[action]);
			}
		});
		newStyle = filterStyles(getElementStyles.call(this));
		that.attr('class', className);

		that.animate(styleDifference(originalStyle, newStyle), {
			queue: false,
			duration: duration,
			easing: easing,
			complete: function() {
				$.each(classAnimationActions, function(i, action) {
					if (value[action]) { that[action + 'Class'](value[action]); }
				});
				// work around bug in IE by clearing the cssText before setting it
				if (typeof that.attr('style') == 'object') {
					that.attr('style').cssText = '';
					that.attr('style').cssText = originalStyleAttr;
				} else {
					that.attr('style', originalStyleAttr);
				}
				if (callback) { callback.apply(this, arguments); }
				$.dequeue( this );
			}
		});
	});
};

$.fn.extend({
	_addClass: $.fn.addClass,
	addClass: function(classNames, speed, easing, callback) {
		return speed ? $.effects.animateClass.apply(this, [{ add: classNames },speed,easing,callback]) : this._addClass(classNames);
	},

	_removeClass: $.fn.removeClass,
	removeClass: function(classNames,speed,easing,callback) {
		return speed ? $.effects.animateClass.apply(this, [{ remove: classNames },speed,easing,callback]) : this._removeClass(classNames);
	},

	_toggleClass: $.fn.toggleClass,
	toggleClass: function(classNames, force, speed, easing, callback) {
		if ( typeof force == "boolean" || force === undefined ) {
			if ( !speed ) {
				// without speed parameter;
				return this._toggleClass(classNames, force);
			} else {
				return $.effects.animateClass.apply(this, [(force?{add:classNames}:{remove:classNames}),speed,easing,callback]);
			}
		} else {
			// without switch parameter;
			return $.effects.animateClass.apply(this, [{ toggle: classNames },force,speed,easing]);
		}
	},

	switchClass: function(remove,add,speed,easing,callback) {
		return $.effects.animateClass.apply(this, [{ add: add, remove: remove },speed,easing,callback]);
	}
});



/******************************************************************************/
/*********************************** EFFECTS **********************************/
/******************************************************************************/

$.extend($.effects, {
	version: "@VERSION",

	// Saves a set of properties in a data storage
	save: function(element, set) {
		for(var i=0; i < set.length; i++) {
			if(set[i] !== null) element.data("ec.storage."+set[i], element[0].style[set[i]]);
		}
	},

	// Restores a set of previously saved properties from a data storage
	restore: function(element, set) {
		for(var i=0; i < set.length; i++) {
			if(set[i] !== null) element.css(set[i], element.data("ec.storage."+set[i]));
		}
	},

	setMode: function(el, mode) {
		if (mode == 'toggle') mode = el.is(':hidden') ? 'show' : 'hide'; // Set for toggle
		return mode;
	},

	getBaseline: function(origin, original) { // Translates a [top,left] array into a baseline value
		// this should be a little more flexible in the future to handle a string & hash
		var y, x;
		switch (origin[0]) {
			case 'top': y = 0; break;
			case 'middle': y = 0.5; break;
			case 'bottom': y = 1; break;
			default: y = origin[0] / original.height;
		};
		switch (origin[1]) {
			case 'left': x = 0; break;
			case 'center': x = 0.5; break;
			case 'right': x = 1; break;
			default: x = origin[1] / original.width;
		};
		return {x: x, y: y};
	},

	// Wraps the element around a wrapper that copies position properties
	createWrapper: function(element) {

		// if the element is already wrapped, return it
		if (element.parent().is('.ui-effects-wrapper')) {
			return element.parent();
		}

		// wrap the element
		var props = {
				width: element.outerWidth(true),
				height: element.outerHeight(true),
				'float': element.css('float')
			},
			wrapper = $('<div></div>')
				.addClass('ui-effects-wrapper')
				.css({
					fontSize: '100%',
					background: 'transparent',
					border: 'none',
					margin: 0,
					padding: 0
				}),
			active = document.activeElement;

		element.wrap(wrapper);

		// Fixes #7595 - Elements lose focus when wrapped.
		if ( element[ 0 ] === active || $.contains( element[ 0 ], active ) ) {
			$( active ).focus();
		}
		
		wrapper = element.parent(); //Hotfix for jQuery 1.4 since some change in wrap() seems to actually loose the reference to the wrapped element

		// transfer positioning properties to the wrapper
		if (element.css('position') == 'static') {
			wrapper.css({ position: 'relative' });
			element.css({ position: 'relative' });
		} else {
			$.extend(props, {
				position: element.css('position'),
				zIndex: element.css('z-index')
			});
			$.each(['top', 'left', 'bottom', 'right'], function(i, pos) {
				props[pos] = element.css(pos);
				if (isNaN(parseInt(props[pos], 10))) {
					props[pos] = 'auto';
				}
			});
			element.css({position: 'relative', top: 0, left: 0, right: 'auto', bottom: 'auto' });
		}

		return wrapper.css(props).show();
	},

	removeWrapper: function(element) {
		var parent,
			active = document.activeElement;
		
		if (element.parent().is('.ui-effects-wrapper')) {
			parent = element.parent().replaceWith(element);
			// Fixes #7595 - Elements lose focus when wrapped.
			if ( element[ 0 ] === active || $.contains( element[ 0 ], active ) ) {
				$( active ).focus();
			}
			return parent;
		}
			
		return element;
	},

	setTransition: function(element, list, factor, value) {
		value = value || {};
		$.each(list, function(i, x){
			unit = element.cssUnit(x);
			if (unit[0] > 0) value[x] = unit[0] * factor + unit[1];
		});
		return value;
	}
});


function _normalizeArguments(effect, options, speed, callback) {
	// shift params for method overloading
	if (typeof effect == 'object') {
		callback = options;
		speed = null;
		options = effect;
		effect = options.effect;
	}
	if ($.isFunction(options)) {
		callback = options;
		speed = null;
		options = {};
	}
        if (typeof options == 'number' || $.fx.speeds[options]) {
		callback = speed;
		speed = options;
		options = {};
	}
	if ($.isFunction(speed)) {
		callback = speed;
		speed = null;
	}

	options = options || {};

	speed = speed || options.duration;
	speed = $.fx.off ? 0 : typeof speed == 'number'
		? speed : speed in $.fx.speeds ? $.fx.speeds[speed] : $.fx.speeds._default;

	callback = callback || options.complete;

	return [effect, options, speed, callback];
}

function standardSpeed( speed ) {
	// valid standard speeds
	if ( !speed || typeof speed === "number" || $.fx.speeds[ speed ] ) {
		return true;
	}
	
	// invalid strings - treat as "normal" speed
	if ( typeof speed === "string" && !$.effects[ speed ] ) {
		return true;
	}
	
	return false;
}

$.fn.extend({
	effect: function(effect, options, speed, callback) {
		var args = _normalizeArguments.apply(this, arguments),
			// TODO: make effects take actual parameters instead of a hash
			args2 = {
				options: args[1],
				duration: args[2],
				callback: args[3]
			},
			mode = args2.options.mode,
			effectMethod = $.effects[effect];
		
		if ( $.fx.off || !effectMethod ) {
			// delegate to the original method (e.g., .show()) if possible
			if ( mode ) {
				return this[ mode ]( args2.duration, args2.callback );
			} else {
				return this.each(function() {
					if ( args2.callback ) {
						args2.callback.call( this );
					}
				});
			}
		}
		
		return effectMethod.call(this, args2);
	},

	_show: $.fn.show,
	show: function(speed) {
		if ( standardSpeed( speed ) ) {
			return this._show.apply(this, arguments);
		} else {
			var args = _normalizeArguments.apply(this, arguments);
			args[1].mode = 'show';
			return this.effect.apply(this, args);
		}
	},

	_hide: $.fn.hide,
	hide: function(speed) {
		if ( standardSpeed( speed ) ) {
			return this._hide.apply(this, arguments);
		} else {
			var args = _normalizeArguments.apply(this, arguments);
			args[1].mode = 'hide';
			return this.effect.apply(this, args);
		}
	},

	// jQuery core overloads toggle and creates _toggle
	__toggle: $.fn.toggle,
	toggle: function(speed) {
		if ( standardSpeed( speed ) || typeof speed === "boolean" || $.isFunction( speed ) ) {
			return this.__toggle.apply(this, arguments);
		} else {
			var args = _normalizeArguments.apply(this, arguments);
			args[1].mode = 'toggle';
			return this.effect.apply(this, args);
		}
	},

	// helper functions
	cssUnit: function(key) {
		var style = this.css(key), val = [];
		$.each( ['em','px','%','pt'], function(i, unit){
			if(style.indexOf(unit) > 0)
				val = [parseFloat(style), unit];
		});
		return val;
	}
});



/******************************************************************************/
/*********************************** EASING ***********************************/
/******************************************************************************/

/*
 * jQuery Easing v1.3 - http://gsgd.co.uk/sandbox/jquery/easing/
 *
 * Uses the built in easing capabilities added In jQuery 1.1
 * to offer multiple easing options
 *
 * TERMS OF USE - jQuery Easing
 *
 * Open source under the BSD License.
 *
 * Copyright 2008 George McGinley Smith
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification,
 * are permitted provided that the following conditions are met:
 *
 * Redistributions of source code must retain the above copyright notice, this list of
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list
 * of conditions and the following disclaimer in the documentation and/or other materials
 * provided with the distribution.
 *
 * Neither the name of the author nor the names of contributors may be used to endorse
 * or promote products derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 * COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 * EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 * GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 * NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED
 * OF THE POSSIBILITY OF SUCH DAMAGE.
 *
*/

// t: current time, b: begInnIng value, c: change In value, d: duration
$.easing.jswing = $.easing.swing;

$.extend($.easing,
{
	def: 'easeOutQuad',
	swing: function (x, t, b, c, d) {
		//alert($.easing.default);
		return $.easing[$.easing.def](x, t, b, c, d);
	},
	easeInQuad: function (x, t, b, c, d) {
		return c*(t/=d)*t + b;
	},
	easeOutQuad: function (x, t, b, c, d) {
		return -c *(t/=d)*(t-2) + b;
	},
	easeInOutQuad: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t + b;
		return -c/2 * ((--t)*(t-2) - 1) + b;
	},
	easeInCubic: function (x, t, b, c, d) {
		return c*(t/=d)*t*t + b;
	},
	easeOutCubic: function (x, t, b, c, d) {
		return c*((t=t/d-1)*t*t + 1) + b;
	},
	easeInOutCubic: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t + b;
		return c/2*((t-=2)*t*t + 2) + b;
	},
	easeInQuart: function (x, t, b, c, d) {
		return c*(t/=d)*t*t*t + b;
	},
	easeOutQuart: function (x, t, b, c, d) {
		return -c * ((t=t/d-1)*t*t*t - 1) + b;
	},
	easeInOutQuart: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
		return -c/2 * ((t-=2)*t*t*t - 2) + b;
	},
	easeInQuint: function (x, t, b, c, d) {
		return c*(t/=d)*t*t*t*t + b;
	},
	easeOutQuint: function (x, t, b, c, d) {
		return c*((t=t/d-1)*t*t*t*t + 1) + b;
	},
	easeInOutQuint: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
		return c/2*((t-=2)*t*t*t*t + 2) + b;
	},
	easeInSine: function (x, t, b, c, d) {
		return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
	},
	easeOutSine: function (x, t, b, c, d) {
		return c * Math.sin(t/d * (Math.PI/2)) + b;
	},
	easeInOutSine: function (x, t, b, c, d) {
		return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
	},
	easeInExpo: function (x, t, b, c, d) {
		return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
	},
	easeOutExpo: function (x, t, b, c, d) {
		return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
	},
	easeInOutExpo: function (x, t, b, c, d) {
		if (t==0) return b;
		if (t==d) return b+c;
		if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
		return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
	},
	easeInCirc: function (x, t, b, c, d) {
		return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
	},
	easeOutCirc: function (x, t, b, c, d) {
		return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
	},
	easeInOutCirc: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
		return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
	},
	easeInElastic: function (x, t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
	},
	easeOutElastic: function (x, t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
	},
	easeInOutElastic: function (x, t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
		return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
	},
	easeInBack: function (x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		return c*(t/=d)*t*((s+1)*t - s) + b;
	},
	easeOutBack: function (x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
	},
	easeInOutBack: function (x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
		return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
	},
	easeInBounce: function (x, t, b, c, d) {
		return c - $.easing.easeOutBounce (x, d-t, 0, c, d) + b;
	},
	easeOutBounce: function (x, t, b, c, d) {
		if ((t/=d) < (1/2.75)) {
			return c*(7.5625*t*t) + b;
		} else if (t < (2/2.75)) {
			return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
		} else if (t < (2.5/2.75)) {
			return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
		} else {
			return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
		}
	},
	easeInOutBounce: function (x, t, b, c, d) {
		if (t < d/2) return $.easing.easeInBounce (x, t*2, 0, c, d) * .5 + b;
		return $.easing.easeOutBounce (x, t*2-d, 0, c, d) * .5 + c*.5 + b;
	}
});

/*
 *
 * TERMS OF USE - EASING EQUATIONS
 *
 * Open source under the BSD License.
 *
 * Copyright 2001 Robert Penner
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification,
 * are permitted provided that the following conditions are met:
 *
 * Redistributions of source code must retain the above copyright notice, this list of
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list
 * of conditions and the following disclaimer in the documentation and/or other materials
 * provided with the distribution.
 *
 * Neither the name of the author nor the names of contributors may be used to endorse
 * or promote products derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 * COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 * EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 * GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 * NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED
 * OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 */

})(jQuery);
/*
 * jQuery UI Effects Bounce @VERSION
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Effects/Bounce
 *
 * Depends:
 *	jquery.effects.core.js
 */
(function( $, undefined ) {

$.effects.bounce = function(o) {

	return this.queue(function() {

		// Create element
		var el = $(this), props = ['position','top','bottom','left','right'];

		// Set options
		var mode = $.effects.setMode(el, o.options.mode || 'effect'); // Set Mode
		var direction = o.options.direction || 'up'; // Default direction
		var distance = o.options.distance || 20; // Default distance
		var times = o.options.times || 5; // Default # of times
		var speed = o.duration || 250; // Default speed per bounce
		if (/show|hide/.test(mode)) props.push('opacity'); // Avoid touching opacity to prevent clearType and PNG issues in IE

		// Adjust
		$.effects.save(el, props); el.show(); // Save & Show
		$.effects.createWrapper(el); // Create Wrapper
		var ref = (direction == 'up' || direction == 'down') ? 'top' : 'left';
		var motion = (direction == 'up' || direction == 'left') ? 'pos' : 'neg';
		distance = o.options.distance || (ref == 'top' ? el.outerHeight({margin:true}) / 3 : el.outerWidth({margin:true}) / 3);
		if (mode == 'show') el.css('opacity', 0).css(ref, motion == 'pos' ? -distance : distance); // Shift
		if (mode == 'hide') distance = distance / (times * 2);
		if (mode != 'hide') times--;

		// Animate
		if (mode == 'show') { // Show Bounce
			var animation = {opacity: 1};
			animation[ref] = (motion == 'pos' ? '+=' : '-=') + distance;
			el.animate(animation, speed / 2, o.options.easing);
			distance = distance / 2;
			times--;
		};
		for (var i = 0; i < times; i++) { // Bounces
			var animation1 = {}, animation2 = {};
			animation1[ref] = (motion == 'pos' ? '-=' : '+=') + distance;
			animation2[ref] = (motion == 'pos' ? '+=' : '-=') + distance;
			el.animate(animation1, speed / 2, o.options.easing).animate(animation2, speed / 2, o.options.easing);
			distance = (mode == 'hide') ? distance * 2 : distance / 2;
		};
		if (mode == 'hide') { // Last Bounce
			var animation = {opacity: 0};
			animation[ref] = (motion == 'pos' ? '-=' : '+=')  + distance;
			el.animate(animation, speed / 2, o.options.easing, function(){
				el.hide(); // Hide
				$.effects.restore(el, props); $.effects.removeWrapper(el); // Restore
				if(o.callback) o.callback.apply(this, arguments); // Callback
			});
		} else {
			var animation1 = {}, animation2 = {};
			animation1[ref] = (motion == 'pos' ? '-=' : '+=') + distance;
			animation2[ref] = (motion == 'pos' ? '+=' : '-=') + distance;
			el.animate(animation1, speed / 2, o.options.easing).animate(animation2, speed / 2, o.options.easing, function(){
				$.effects.restore(el, props); $.effects.removeWrapper(el); // Restore
				if(o.callback) o.callback.apply(this, arguments); // Callback
			});
		};
		el.queue('fx', function() { el.dequeue(); });
		el.dequeue();
	});

};

})(jQuery);
/*
 * jQuery UI Effects Explode @VERSION
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Effects/Explode
 *
 * Depends:
 *	jquery.effects.core.js
 */
(function( $, undefined ) {

$.effects.explode = function(o) {

	return this.queue(function() {

	var rows = o.options.pieces ? Math.round(Math.sqrt(o.options.pieces)) : 3;
	var cells = o.options.pieces ? Math.round(Math.sqrt(o.options.pieces)) : 3;

	o.options.mode = o.options.mode == 'toggle' ? ($(this).is(':visible') ? 'hide' : 'show') : o.options.mode;
	var el = $(this).show().css('visibility', 'hidden');
	var offset = el.offset();

	//Substract the margins - not fixing the problem yet.
	offset.top -= parseInt(el.css("marginTop"),10) || 0;
	offset.left -= parseInt(el.css("marginLeft"),10) || 0;

	var width = el.outerWidth(true);
	var height = el.outerHeight(true);

	for(var i=0;i<rows;i++) { // =
		for(var j=0;j<cells;j++) { // ||
			el
				.clone()
				.appendTo('body')
				.wrap('<div></div>')
				.css({
					position: 'absolute',
					visibility: 'visible',
					left: -j*(width/cells),
					top: -i*(height/rows)
				})
				.parent()
				.addClass('ui-effects-explode')
				.css({
					position: 'absolute',
					overflow: 'hidden',
					width: width/cells,
					height: height/rows,
					left: offset.left + j*(width/cells) + (o.options.mode == 'show' ? (j-Math.floor(cells/2))*(width/cells) : 0),
					top: offset.top + i*(height/rows) + (o.options.mode == 'show' ? (i-Math.floor(rows/2))*(height/rows) : 0),
					opacity: o.options.mode == 'show' ? 0 : 1
				}).animate({
					left: offset.left + j*(width/cells) + (o.options.mode == 'show' ? 0 : (j-Math.floor(cells/2))*(width/cells)),
					top: offset.top + i*(height/rows) + (o.options.mode == 'show' ? 0 : (i-Math.floor(rows/2))*(height/rows)),
					opacity: o.options.mode == 'show' ? 1 : 0
				}, o.duration || 500);
		}
	}

	// Set a timeout, to call the callback approx. when the other animations have finished
	setTimeout(function() {

		o.options.mode == 'show' ? el.css({ visibility: 'visible' }) : el.css({ visibility: 'visible' }).hide();
				if(o.callback) o.callback.apply(el[0]); // Callback
				el.dequeue();

				$('div.ui-effects-explode').remove();

	}, o.duration || 500);


	});

};

})(jQuery);
/*
 * jQuery UI Effects Transfer @VERSION
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Effects/Transfer
 *
 * Depends:
 *	jquery.effects.core.js
 */
(function( $, undefined ) {

$.effects.transfer = function(o) {
	return this.queue(function() {
		var elem = $(this),
			target = $(o.options.to),
			endPosition = target.offset(),
			animation = {
				top: endPosition.top,
				left: endPosition.left,
				height: target.innerHeight(),
				width: target.innerWidth()
			},
			startPosition = elem.offset(),
			transfer = $('<div class="ui-effects-transfer"></div>')
				.appendTo(document.body)
				.addClass(o.options.className)
				.css({
					top: startPosition.top,
					left: startPosition.left,
					height: elem.innerHeight(),
					width: elem.innerWidth(),
					position: 'absolute'
				})
				.animate(animation, o.duration, o.options.easing, function() {
					transfer.remove();
					(o.callback && o.callback.apply(elem[0], arguments));
					elem.dequeue();
				});
	});
};

})(jQuery);
/*
 * jQuery JSON Plugin
 * version: 2.1 (2009-08-14)
 *
 * This document is licensed as free software under the terms of the
 * MIT License: http://www.opensource.org/licenses/mit-license.php
 *
 * Brantley Harris wrote this plugin. It is based somewhat on the JSON.org 
 * website's http://www.json.org/json2.js, which proclaims:
 * "NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.", a sentiment that
 * I uphold.
 *
 * It is also influenced heavily by MochiKit's serializeJSON, which is 
 * copyrighted 2005 by Bob Ippolito.
 */
 
(function($) {
    /** jQuery.toJSON( json-serializble )
        Converts the given argument into a JSON respresentation.

        If an object has a "toJSON" function, that will be used to get the representation.
        Non-integer/string keys are skipped in the object, as are keys that point to a function.

        json-serializble:
            The *thing* to be converted.
     **/
    $.toJSON = function(o)
    {
        if (typeof(JSON) == 'object' && JSON.stringify)
            return JSON.stringify(o);
        
        var type = typeof(o);
    
        if (o === null)
            return "null";
    
        if (type == "undefined")
            return undefined;
        
        if (type == "number" || type == "boolean")
            return o + "";
    
        if (type == "string")
            return $.quoteString(o);
    
        if (type == 'object')
        {
            if (typeof o.toJSON == "function") 
                return $.toJSON( o.toJSON() );
            
            if (o.constructor === Date)
            {
                var month = o.getUTCMonth() + 1;
                if (month < 10) month = '0' + month;

                var day = o.getUTCDate();
                if (day < 10) day = '0' + day;

                var year = o.getUTCFullYear();
                
                var hours = o.getUTCHours();
                if (hours < 10) hours = '0' + hours;
                
                var minutes = o.getUTCMinutes();
                if (minutes < 10) minutes = '0' + minutes;
                
                var seconds = o.getUTCSeconds();
                if (seconds < 10) seconds = '0' + seconds;
                
                var milli = o.getUTCMilliseconds();
                if (milli < 100) milli = '0' + milli;
                if (milli < 10) milli = '0' + milli;

                return '"' + year + '-' + month + '-' + day + 'T' +
                             hours + ':' + minutes + ':' + seconds + 
                             '.' + milli + 'Z"'; 
            }

            if (o.constructor === Array) 
            {
                var ret = [];
                for (var i = 0; i < o.length; i++)
                    ret.push( $.toJSON(o[i]) || "null" );

                return "[" + ret.join(",") + "]";
            }
        
            var pairs = [];
            for (var k in o) {
                var name;
                var type = typeof k;

                if (type == "number")
                    name = '"' + k + '"';
                else if (type == "string")
                    name = $.quoteString(k);
                else
                    continue;  //skip non-string or number keys
            
                if (typeof o[k] == "function") 
                    continue;  //skip pairs where the value is a function.
            
                var val = $.toJSON(o[k]);
            
                pairs.push(name + ":" + val);
            }

            return "{" + pairs.join(", ") + "}";
        }
    };

    /** jQuery.evalJSON(src)
        Evaluates a given piece of json source.
     **/
    $.evalJSON = function(src)
    {
        if (typeof(JSON) == 'object' && JSON.parse)
            return JSON.parse(src);
        return eval("(" + src + ")");
    };
    
    /** jQuery.secureEvalJSON(src)
        Evals JSON in a way that is *more* secure.
    **/
    $.secureEvalJSON = function(src)
    {
        if (typeof(JSON) == 'object' && JSON.parse)
            return JSON.parse(src);
        
        var filtered = src;
        filtered = filtered.replace(/\\["\\\/bfnrtu]/g, '@');
        filtered = filtered.replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']');
        filtered = filtered.replace(/(?:^|:|,)(?:\s*\[)+/g, '');
        
        if (/^[\],:{}\s]*$/.test(filtered))
            return eval("(" + src + ")");
        else
            throw new SyntaxError("Error parsing JSON, source is not valid.");
    };

    /** jQuery.quoteString(string)
        Returns a string-repr of a string, escaping quotes intelligently.  
        Mostly a support function for toJSON.
    
        Examples:
            >>> jQuery.quoteString("apple")
            "apple"
        
            >>> jQuery.quoteString('"Where are we going?", she asked.')
            "\"Where are we going?\", she asked."
     **/
    $.quoteString = function(string)
    {
        if (string.match(_escapeable))
        {
            return '"' + string.replace(_escapeable, function (a) 
            {
                var c = _meta[a];
                if (typeof c === 'string') return c;
                c = a.charCodeAt();
                return '\\u00' + Math.floor(c / 16).toString(16) + (c % 16).toString(16);
            }) + '"';
        }
        return '"' + string + '"';
    };
    
    var _escapeable = /["\\\x00-\x1f\x7f-\x9f]/g;
    
    var _meta = {
        '\b': '\\b',
        '\t': '\\t',
        '\n': '\\n',
        '\f': '\\f',
        '\r': '\\r',
        '"' : '\\"',
        '\\': '\\\\'
    };
})(jQuery);
/*jslint browser: true */ /*global jQuery: true */

/**
 * jQuery Cookie plugin
 *
 * Copyright (c) 2010 Klaus Hartl (stilbuero.de)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 */

// TODO JsDoc

/**
 * Create a cookie with the given key and value and other optional parameters.
 *
 * @example $.cookie('the_cookie', 'the_value');
 * @desc Set the value of a cookie.
 * @example $.cookie('the_cookie', 'the_value', { expires: 7, path: '/', domain: 'jquery.com', secure: true });
 * @desc Create a cookie with all available options.
 * @example $.cookie('the_cookie', 'the_value');
 * @desc Create a session cookie.
 * @example $.cookie('the_cookie', null);
 * @desc Delete a cookie by passing null as value. Keep in mind that you have to use the same path and domain
 *       used when the cookie was set.
 *
 * @param String key The key of the cookie.
 * @param String value The value of the cookie.
 * @param Object options An object literal containing key/value pairs to provide optional cookie attributes.
 * @option Number|Date expires Either an integer specifying the expiration date from now on in days or a Date object.
 *                             If a negative value is specified (e.g. a date in the past), the cookie will be deleted.
 *                             If set to null or omitted, the cookie will be a session cookie and will not be retained
 *                             when the the browser exits.
 * @option String path The value of the path atribute of the cookie (default: path of page that created the cookie).
 * @option String domain The value of the domain attribute of the cookie (default: domain of page that created the cookie).
 * @option Boolean secure If true, the secure attribute of the cookie will be set and the cookie transmission will
 *                        require a secure protocol (like HTTPS).
 * @type undefined
 *
 * @name $.cookie
 * @cat Plugins/Cookie
 * @author Klaus Hartl/klaus.hartl@stilbuero.de
 */

/**
 * Get the value of a cookie with the given key.
 *
 * @example $.cookie('the_cookie');
 * @desc Get the value of a cookie.
 *
 * @param String key The key of the cookie.
 * @return The value of the cookie.
 * @type String
 *
 * @name $.cookie
 * @cat Plugins/Cookie
 * @author Klaus Hartl/klaus.hartl@stilbuero.de
 */
jQuery.cookie = function (key, value, options) {
    
    // key and at least value given, set cookie...
    if (arguments.length > 1 && String(value) !== "[object Object]") {
        options = jQuery.extend({}, options);

        if (value === null || value === undefined) {
            options.expires = -1;
        }

        if (typeof options.expires === 'number') {
            var days = options.expires, t = options.expires = new Date();
            t.setDate(t.getDate() + days);
        }
        
        value = String(value);
        
        return (document.cookie = [
            encodeURIComponent(key), '=',
            options.raw ? value : encodeURIComponent(value),
            options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
            options.path ? '; path=' + options.path : '',
            options.domain ? '; domain=' + options.domain : '',
            options.secure ? '; secure' : ''
        ].join(''));
    }

    // key and possibly options given, get cookie...
    options = value || {};
    var result, decode = options.raw ? function (s) { return s; } : decodeURIComponent;
    return (result = new RegExp('(?:^|; )' + encodeURIComponent(key) + '=([^;]*)').exec(document.cookie)) ? decode(result[1]) : null;
};
/*
 * getStyleObject Plugin for jQuery JavaScript Library
 * From: http://upshots.org/?p=112
 *
 * Copyright: Unknown, see source link
 * Plugin version by Dakota Schneider (http://hackthetruth.org)
 */

(function($){
    $.fn.getStyleObject = function(){
        var dom = this.get(0);
        var style;
        var returns = {};
        if(window.getComputedStyle){
            var camelize = function(a,b){
                return b.toUpperCase();
            };
            style = window.getComputedStyle(dom, null);
            for(var i=0;i<style.length;i++){
                var prop = style[i];
                var camel = prop.replace(/\-([a-z])/g, camelize);
                var val = style.getPropertyValue(prop);
                returns[camel] = val;
            }
            return returns;
        }
        if(dom.currentStyle){
            style = dom.currentStyle;
            for(var prop in style){
                returns[prop] = style[prop];
            }
            return returns;
        }
        return this.css();
    };
})(jQuery);
(function() {
    $.fn.silentCss = $.fn.css;
    $.fn.css = function() {
        var result = $.fn.silentCss.apply(this, arguments);
        if (arguments.length >= 2) {
        	$(this).trigger('stylechange', arguments[0], arguments[1]);
        }
        return result;
    };
})();
function is_array(input){
    return typeof(input)=='object'&&(input instanceof Array);
}

(function(){
  var initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;

  /**
   * This class is abstracted and should not be used by developers
   * @class Base class for all JOO objects.
   */
  this.Class = function(){};
 
  /**
   * Extends the current class with new methods & fields
   * @param {Object} prop additional methods & fields to be included in new class
   * @static
   * @returns {Class} new class
   */
  Class.extend = function(prop) {
	if (typeof updateTracker != 'undefined')
		updateTracker(1);
    var _super = this.prototype;
   
    // Instantiate a base class (but only create the instance,
    // don't run the init constructor)
    initializing = true;
    var prototype = new this();
    initializing = false;
    prototype.currentClass = this;
    prototype.ancestors = Array();
    if (this.prototype.ancestors) {
    	for(var i in this.prototype.ancestors) {
    		prototype.ancestors.push(this.prototype.ancestors[i]);
    	}
    }
    prototype.ancestors.push(this);
    // Copy the properties over onto the new prototype
    for (var name in prop) {
      // Check if we're overwriting an existing function
      prototype[name] = typeof prop[name] == "function" &&
        typeof _super[name] == "function" && fnTest.test(prop[name]) ?
        (function(name, fn){
          return function() {
            var tmp = this._super;
           
            // Add a new ._super() method that is the same method
            // but on the super-class
            this._super = _super[name];
           
            // The method only need to be bound temporarily, so we
            // remove it when we're done executing
            var ret = fn.apply(this, arguments);       
            this._super = tmp;
           
            return ret;
          };
        })(name, prop[name]) :
        prop[name];
    }
  
    /**
     * Implements the current class with a set of interfaces
     * @param {InterfaceImplementor...} interfaces a set of interfaces to be implemented
     * @static
     * @returns {Class} current class
     */
    Class.implement = function() {
    	for(var i=0;i<arguments.length;i++) {
			var impl = new arguments[i]();
			impl.implement(Class);
    	}
    	return Class;
    };
   
    function Class() {
      // All construction is actually done in the init method
      if ( !initializing && this.init ) {
        this.init.apply(this, arguments);
        if (typeof updateTracker != 'undefined')
    		updateTracker(this.tracker || 5, true);
      }
    }
   
    // Populate our constructed prototype object
    Class.prototype = prototype;
   
    // Enforce the constructor to be what we expect
    Class.constructor = Class;

    // And make this class extendable
    Class.extend = arguments.callee;
   
    return Class;
  };
})();
//micro template based on John Resg code
function tmpl(tmpl_id,data){
	try {
		if ( typeof tmpl.cache == 'undefined' ) {
			tmpl.cache = new Array();
	    }
		if( tmpl.cache[tmpl_id]!=null ){
			var fn = tmpl.cache[tmpl_id];
			return fn(data);		
		}
		str = document.getElementById(tmpl_id).innerHTML;
		str = str.replace(/\\/g, "@SPC@");
		str = str.replace(/'/g, "&apos;");
		fnStr = "var p=[],print=function(){p.push.apply(p,arguments);};" +
	    
	    // Introduce the data as local variables using with(){}
	    "with(obj){p.push('" +
	    
	    // Convert the template into pure JavaScript
	    str
	      .replace(/[\r\t\n]/g, " ")
	      .split("<%").join("\t")
	      .replace(/((^|%>)[^\t]*)'/g, "$1\r")
	      .replace(/\t=(.*?)%>/g, "',$1,'")
	      .split("\t").join("');")
	      .split("%>").join("p.push('")
	      .split("\r").join("\\'")
	  + "');}return p.join('');";
		fnStr = fnStr.replace(/@SPC@/g, "\\");
		var fn = new Function("obj", fnStr);
		tmpl.cache[tmpl_id] = fn;
		return fn(data);
	} catch (e) {
		log(e+":"+tmpl_id, 'rendering');
		return "";
	}
}
/**
 * KineticJS JavaScript Library v3.7.3
 * http://www.kineticjs.com/
 * Copyright 2012, Eric Rowell
 * Licensed under the MIT or GPL Version 2 licenses.
 * Date: Feb 12 2012
 *
 * Copyright (C) 2011 - 2012 by Eric Rowell
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
///////////////////////////////////////////////////////////////////////
//  Global Object
///////////////////////////////////////////////////////////////////////
var Kinetic = {};
Kinetic.GlobalObject = {
    stages: [],
    idCounter: 0,
    extend: function(obj1, obj2){
        for (var key in obj2.prototype) {
            obj1.prototype[key] = obj2.prototype[key];
        }
    }
};

///////////////////////////////////////////////////////////////////////
//  Node
///////////////////////////////////////////////////////////////////////
/**
 * Node constructor.  Node is a base class for the
 * Layer, Group, and Shape classes
 * @param {Object} name
 */
Kinetic.Node = function(name){
    this.visible = true;
    this.isListening = true;
    this.name = name;
    this.x = 0;
    this.y = 0;
    this.scale = {
        x: 1,
        y: 1
    };
    this.rotation = 0;
    this.eventListeners = {};
    this.drag = {
        x: false,
        y: false
    };
    this.alpha = 1;
};

Kinetic.Node.prototype = {
    /**
     * bind event to node
     * @param {String} typesStr
     * @param {function} handler
     */
    on: function(typesStr, handler){
        var types = typesStr.split(" ");
        /*
         * loop through types and attach event listeners to
         * each one.  eg. "click mouseover.namespace mouseout"
         * will create three event bindings
         */
        for (var n = 0; n < types.length; n++) {
            var type = types[n];
            var event = (type.indexOf('touch') == -1) ? 'on' + type : type;
            var parts = event.split(".");
            var baseEvent = parts[0];
            var name = parts.length > 1 ? parts[1] : "";
            
            if (!this.eventListeners[baseEvent]) {
                this.eventListeners[baseEvent] = [];
            }
            
            this.eventListeners[baseEvent].push({
                name: name,
                handler: handler
            });
        }
    },
    /**
     * unbind event to node
     * @param {String} typesStr
     */
    off: function(typesStr){
        var types = typesStr.split(" ");
        
        for (var n = 0; n < types.length; n++) {
            var type = types[n];
            var event = (type.indexOf('touch') == -1) ? 'on' + type : type;
            var parts = event.split(".");
            var baseEvent = parts[0];
            
            if (this.eventListeners[baseEvent] && parts.length > 1) {
                var name = parts[1];
                
                for (var i = 0; i < this.eventListeners[baseEvent].length; i++) {
                    if (this.eventListeners[baseEvent][i].name == name) {
                        this.eventListeners[baseEvent].splice(i, 1);
                        if (this.eventListeners[baseEvent].length === 0) {
                            this.eventListeners[baseEvent] = undefined;
                        }
                        break;
                    }
                }
            }
            else {
                this.eventListeners[baseEvent] = undefined;
            }
        }
    },
    /**
     * show node
     */
    show: function(){
        this.visible = true;
    },
    /**
     * hide node
     */
    hide: function(){
        this.visible = false;
    },
    /**
     * get zIndex
     */
    getZIndex: function(){
        return this.index;
    },
    /**
     * set node scale
     * @param {number} scaleX
     * @param {number} scaleY
     */
    setScale: function(scaleX, scaleY){
        if (scaleY) {
            this.scale.x = scaleX;
            this.scale.y = scaleY;
        }
        else {
            this.scale.x = scaleX;
            this.scale.y = scaleX;
        }
    },
    /**
     * set node position
     * @param {number} x
     * @param {number} y
     */
    setPosition: function(x, y){
        this.x = x;
        this.y = y;
    },
    /**
     * get node position relative to container
     */
    getPosition: function(){
        return {
            x: this.x,
            y: this.y
        };
    },
    /**
     * get absolute position relative to stage
     */
    getAbsolutePosition: function(){
        var x = this.x;
        var y = this.y;
        var parent = this.getParent();
        while (parent.className !== "Stage") {
            x += parent.x;
            y += parent.y;
            parent = parent.parent;
        }
        return {
            x: x,
            y: y
        };
    },
    /**
     * move node
     * @param {number} x
     * @param {number} y
     */
    move: function(x, y){
        this.x += x;
        this.y += y;
    },
    /**
     * set node rotation
     * @param {number} theta
     */
    setRotation: function(theta){
        this.rotation = theta;
    },
    /**
     * rotate node
     * @param {number} theta
     */
    rotate: function(theta){
        this.rotation += theta;
    },
    /**
     * listen or don't listen to events
     * @param {boolean} isListening
     */
    listen: function(isListening){
        this.isListening = isListening;
    },
    /**
     * move node to top
     */
    moveToTop: function(){
        var index = this.index;
        this.parent.children.splice(index, 1);
        this.parent.children.push(this);
        this.parent._setChildrenIndices();
    },
    /**
     * move node up
     */
    moveUp: function(){
        var index = this.index;
        this.parent.children.splice(index, 1);
        this.parent.children.splice(index + 1, 0, this);
        this.parent._setChildrenIndices();
    },
    /**
     * move node down
     */
    moveDown: function(){
        var index = this.index;
        if (index > 0) {
            this.parent.children.splice(index, 1);
            this.parent.children.splice(index - 1, 0, this);
            this.parent._setChildrenIndices();
        }
    },
    /**
     * move node to bottom
     */
    moveToBottom: function(){
        var index = this.index;
        this.parent.children.splice(index, 1);
        this.parent.children.unshift(this);
        this.parent._setChildrenIndices();
    },
    /**
     * set zIndex
     * @param {int} index
     */
    setZIndex: function(zIndex){
        var index = this.index;
        this.parent.children.splice(index, 1);
        this.parent.children.splice(zIndex, 0, this);
        this.parent._setChildrenIndices();
    },
    /**
     * set alpha
     * @param {Object} alpha
     */
    setAlpha: function(alpha){
        this.alpha = alpha;
    },
    /**
     * get alpha
     */
    getAlpha: function(){
        return this.alpha;
    },
    /**
     * initialize drag and drop
     */
    _initDrag: function(){
        var that = this;
        var types = ["mousedown", "touchstart"];
        
        for (var n = 0; n < types.length; n++) {
            var pubType = types[n];
            (function(){
                var type = pubType;
                that.on(type + ".initdrag", function(evt){
                    var stage = that.getStage();
                    var pos = stage.getUserPosition();
                    
                    if (pos) {
                        stage.nodeDragging = that;
                        stage.nodeDragging.offset = {};
                        stage.nodeDragging.offset.x = pos.x - that.x;
                        stage.nodeDragging.offset.y = pos.y - that.y;
                        
                        // execute dragstart events if defined
                        that._handleEvents("ondragstart", evt);
                    }
                });
            })();
        }
    },
    /**
     * remove drag and drop event listener
     */
    _dragCleanup: function(){
        if (!this.drag.x && !this.drag.y) {
            this.off("mousedown.initdrag");
            this.off("touchstart.initdrag");
        }
    },
    /**
     * enable/disable drag and drop for box x and y direction
     * @param {boolean} setDraggable
     */
    draggable: function(setDraggable){
        if (setDraggable) {
            var needInit = !this.drag.x && !this.drag.y;
            this.drag = {
                x: true,
                y: true
            };
            if (needInit) {
                this._initDrag();
            }
        }
        else {
            this.drag = {
                x: false,
                y: false
            };
            this._dragCleanup();
        }
    },
    /**
     * enable/disable drag and drop for x only
     * @param {boolean} setDraggable
     */
    draggableX: function(setDraggable){
        if (setDraggable) {
            var needInit = !this.drag.x && !this.drag.y;
            this.drag.x = true;
            if (needInit) {
                this._initDrag();
            }
        }
        else {
            this.drag.x = false;
            this._dragCleanup();
        }
    },
    /**
     * enable/disable drag and drop for y only
     * @param {boolean} setDraggable
     */
    draggableY: function(setDraggable){
        if (setDraggable) {
            var needInit = !this.drag.x && !this.drag.y;
            this.drag.y = true;
            if (needInit) {
                this._initDrag();
            }
        }
        else {
            this.drag.y = false;
            this._dragCleanup();
        }
    },
    /**
     * handle node events
     * @param {string} eventType
     * @param {Event} evt
     */
    _handleEvents: function(eventType, evt){
        // generic events handler
        function handle(obj){
            var el = obj.eventListeners;
            if (el[eventType]) {
                var events = el[eventType];
                for (var i = 0; i < events.length; i++) {
                    events[i].handler.apply(obj, [evt]);
                }
            }
            
            if (obj.parent.className !== "Stage") {
                handle(obj.parent);
            }
        }
        /*
         * simulate bubbling by handling node events
         * first, followed by group events, followed
         * by layer events
         */
        handle(this);
    },
    /**
     * move node to another container
     * @param {Layer} newLayer
     */
    moveTo: function(newContainer){
        var parent = this.parent;
        // remove from parent's children
        parent.children.splice(this.index, 1);
        parent._setChildrenIndices();
        
        // add to new parent
        newContainer.children.push(this);
        this.index = newContainer.children.length - 1;
        this.parent = newContainer;
        newContainer._setChildrenIndices();
        
        // update children hashes
        if (this.name) {
            parent.childrenNames[this.name] = undefined;
            newContainer.childrenNames[this.name] = this;
        }
    },
    /**
     * get parent
     */
    getParent: function(){
        return this.parent;
    },
    /**
     * get node's layer
     */
    getLayer: function(){
        if (this.className == 'Layer') {
            return this;
        }
        else {
            return this.getParent().getLayer();
        }
    },
    /**
     * get stage
     */
    getStage: function(){
        return this.getParent().getStage();
    },
    /**
     * get name
     */
    getName: function(){
        return this.name;
    }
};

///////////////////////////////////////////////////////////////////////
//  Container
///////////////////////////////////////////////////////////////////////

/**
 * Container constructor.  Container is the base class for
 * Stage, Layer, and Group
 */
Kinetic.Container = function(){
    this.children = [];
    this.childrenNames = {};
};

// methods
Kinetic.Container.prototype = {
    /**
     * set children indices
     */
    _setChildrenIndices: function(){
        for (var n = 0; n < this.children.length; n++) {
            this.children[n].index = n;
        }
    },
    /**
     * recursively traverse the container tree
     * and draw the children
     * @param {Object} obj
     */
    _drawChildren: function(){
        var children = this.children;
        for (var n = 0; n < children.length; n++) {
            var child = children[n];
            if (child.className == "Shape") {
                child._draw(child.getLayer());
            }
            else {
                child._draw();
            }
        }
    },
    /**
     * get children
     */
    getChildren: function(){
        return this.children;
    },
    /**
     * get node by name
     * @param {string} name
     */
    getChild: function(name){
        return this.childrenNames[name];
    },
    /**
     * add node to container
     * @param {Node} child
     */
    _add: function(child){
        if (child.name) {
            this.childrenNames[child.name] = child;
        }
        child.id = Kinetic.GlobalObject.idCounter++;
        child.index = this.children.length;
        child.parent = this;
        
        this.children.push(child);
    },
    /**
     * remove child from container
     * @param {Node} child
     */
    _remove: function(child){
        if (child.name !== undefined) {
            this.childrenNames[child.name] = undefined;
        }
        this.children.splice(child.index, 1);
        this._setChildrenIndices();
        child = undefined;
    }
};

///////////////////////////////////////////////////////////////////////
//  Stage
///////////////////////////////////////////////////////////////////////
/**
 * Stage constructor.  Stage extends Container
 * @param {String} containerId
 * @param {int} width
 * @param {int} height
 */
Kinetic.Stage = function(cont, width, height){
    this.className = "Stage";
    this.container = typeof cont == "string" ? document.getElementById(cont) : cont;
    this.width = width;
    this.height = height;
    this.scale = {
        x: 1,
        y: 1
    };
    this.dblClickWindow = 400;
    this.targetShape = {};
    this.clickStart = false;
    
    // desktop flags
    this.mousePos;
    this.mouseDown = false;
    this.mouseUp = false;
    
    // mobile flags
    this.touchPos;
    this.touchStart = false;
    this.touchEnd = false;
    
    /*
     * Layer roles
     *
     * buffer - canvas compositing
     * backstage - path detection
     */
    this.bufferLayer = new Kinetic.Layer();
    this.backstageLayer = new Kinetic.Layer();
    
    // set parents
    this.bufferLayer.parent = this;
    this.backstageLayer.parent = this;
    
    // customize back stage context
    var backstageLayer = this.backstageLayer;
    this._stripLayer(backstageLayer);
    
    this.bufferLayer.getCanvas().style.display = 'none';
    this.backstageLayer.getCanvas().style.display = 'none';
    
    // add buffer layer
    this.bufferLayer.canvas.width = this.width;
    this.bufferLayer.canvas.height = this.height;
    this.container.appendChild(this.bufferLayer.canvas);
    
    // add backstage layer
    this.backstageLayer.canvas.width = this.width;
    this.backstageLayer.canvas.height = this.height;
    this.container.appendChild(this.backstageLayer.canvas);
    
    this._listen();
    this._prepareDrag();
    
    // add stage to global object
    var stages = Kinetic.GlobalObject.stages;
    stages.push(this);
    
    // set stage id
    this.id = Kinetic.GlobalObject.idCounter++;
    
    // call super constructor
    Kinetic.Container.apply(this, []);
};

/*
 * Stage methods
 */
Kinetic.Stage.prototype = {
    /**
     * draw children
     */
    draw: function(){
        this._drawChildren();
    },
    /**
     * disable layer rendering
     * @param {Layer} layer
     */
    _stripLayer: function(layer){
        layer.context.stroke = function(){
        };
        layer.context.fill = function(){
        };
        layer.context.fillRect = function(x, y, width, height){
            layer.context.rect(x, y, width, height);
        };
        layer.context.strokeRect = function(x, y, width, height){
            layer.context.rect(x, y, width, height);
        };
        layer.context.drawImage = function(){
        };
        layer.context.fillText = function(){
        };
        layer.context.strokeText = function(){
        };
    },
    /**
     * prepare drag and drop
     */
    _prepareDrag: function(){
        var that = this;
        this.on("mouseout", function(evt){
            // run dragend events if any
            if (that.nodeDragging) {
                that.nodeDragging._handleEvents("ondragend", evt);
            }
            that.nodeDragging = undefined;
        }, false);
        
        /*
         * prepare drag and drop
         */
        var types = [{
            end: "mouseup",
            move: "mousemove"
        }, {
            end: "touchend",
            move: "touchmove"
        }];
        
        for (var n = 0; n < types.length; n++) {
            var pubType = types[n];
            (function(){
                var type = pubType;
                that.on(type.move, function(evt){
                    if (that.nodeDragging) {
                        var pos = type.move == "mousemove" ? that.getMousePosition() : that.getTouchPosition();
                        if (that.nodeDragging.drag.x) {
                            that.nodeDragging.x = pos.x - that.nodeDragging.offset.x;
                        }
                        if (that.nodeDragging.drag.y) {
                            that.nodeDragging.y = pos.y - that.nodeDragging.offset.y;
                        }
                        that.nodeDragging.getLayer().draw();
                        
                        // execute user defined ondragend if defined
                        that.nodeDragging._handleEvents("ondragmove", evt);
                    }
                }, false);
                that.on(type.end, function(evt){
                    // execute user defined ondragend if defined
                    if (that.nodeDragging) {
                        that.nodeDragging._handleEvents("ondragend", evt);
                    }
                    that.nodeDragging = undefined;
                });
            })();
        }
        
        this.on("touchend", function(evt){
            // execute user defined ondragend if defined
            if (that.nodeDragging) {
                that.nodeDragging._handleEvents("ondragend", evt);
            }
            that.nodeDragging = undefined;
        });
    },
    /**
     * set stage size
     * @param {int} width
     * @param {int} height
     */
    setSize: function(width, height){
        var layers = this.children;
        for (var n = 0; n < layers.length; n++) {
            var layer = layers[n];
            layer.getCanvas().width = width;
            layer.getCanvas().height = height;
            layer.draw();
        }
        
        // set stage dimensions
        this.width = width;
        this.height = height;
        
        // set buffer layer and backstage layer sizes
        this.bufferLayer.getCanvas().width = width;
        this.bufferLayer.getCanvas().height = height;
        this.backstageLayer.getCanvas().width = width;
        this.backstageLayer.getCanvas().height = height;
    },
    /**
     * set stage scale
     * @param {int} scaleX
     * @param {int} scaleY
     */
    setScale: function(scaleX, scaleY){
        var oldScaleX = this.scale.x;
        var oldScaleY = this.scale.y;
        
        if (scaleY) {
            this.scale.x = scaleX;
            this.scale.y = scaleY;
        }
        else {
            this.scale.x = scaleX;
            this.scale.y = scaleX;
        }
        
        /*
         * scale all shape positions
         */
        var layers = this.children;
        for (var n = 0; n < layers.length; n++) {
            var children = layers[n].children;
            while (children) {
                for (var i = 0; i < children.length; i++) {
                    var child = children[i];
                    child.x *= this.scale.x / oldScaleX;
                    child.y *= this.scale.y / oldScaleY;
                }
                
                children = child.children;
            }
        }
    },
    /**
     * clear all layers
     */
    clear: function(){
        var layers = this.children;
        for (var n = 0; n < layers.length; n++) {
            layers[n].clear();
        }
    },
    /**
     * creates a composite data URL and passes it to a callback
     * @param {function} callback
     */
    toDataURL: function(callback){
        var bufferLayer = this.bufferLayer;
        var bufferContext = bufferLayer.getContext();
        var layers = this.children;
        
        function addLayer(n){
            var dataURL = layers[n].getCanvas().toDataURL();
            var imageObj = new Image();
            imageObj.onload = function(){
                bufferContext.drawImage(this, 0, 0);
                n++;
                if (n < layers.length) {
                    addLayer(n);
                }
                else {
                    callback(bufferLayer.getCanvas().toDataURL());
                }
            };
            imageObj.src = dataURL;
        }
        
        
        bufferLayer.clear();
        addLayer(0);
    },
    /**
     * remove layer from stage
     * @param {Layer} layer
     */
    remove: function(layer){
        this._remove(layer);
        // remove layer canvas from dom
        this.container.removeChild(layer.canvas);
    },
    /**
     * bind event listener to stage (which is essentially
     * the container DOM)
     * @param {string} type
     * @param {function} handler
     */
    on: function(type, handler){
        this.container.addEventListener(type, handler);
    },
    /** 
     * add layer to stage
     * @param {Layer} layer
     */
    add: function(layer){
        if (layer.name) {
            this.childrenNames[layer.name] = layer;
        }
        layer.canvas.width = this.width;
        layer.canvas.height = this.height;
        this._add(layer);
        
        // draw layer and append canvas to container
        layer.draw();
        this.container.appendChild(layer.canvas);
    },
    /**
     * handle incoming event
     * @param {Event} evt
     */
    _handleEvent: function(evt){
        if (!evt) {
            evt = window.event;
        }
        
        this._setMousePosition(evt);
        this._setTouchPosition(evt);
        
        var backstageLayer = this.backstageLayer;
        var backstageLayerContext = backstageLayer.getContext();
        var that = this;
        
        backstageLayer.clear();
        
        /*
         * loop through layers.  If at any point an event
         * is triggered, n is set to -1 which will break out of the
         * three nested loops
         */
        var nodesCounted = 0;
        
        function detectEvent(shape){
            shape._draw(backstageLayer);
            var pos = that.getUserPosition();
            var el = shape.eventListeners;
            
            if (shape.visible && pos !== undefined && backstageLayerContext.isPointInPath(pos.x, pos.y)) {
                // handle onmousedown
                if (that.mouseDown) {
                    that.mouseDown = false;
                    that.clickStart = true;
                    shape._handleEvents("onmousedown", evt);
                    return true;
                }
                // handle onmouseup & onclick
                else if (that.mouseUp) {
                    that.mouseUp = false;
                    shape._handleEvents("onmouseup", evt);
                    
                    // detect if click or double click occurred
                    if (that.clickStart) {
                        shape._handleEvents("onclick", evt);
                        
                        if (shape.inDoubleClickWindow) {
                            shape._handleEvents("ondblclick", evt);
                        }
                        shape.inDoubleClickWindow = true;
                        setTimeout(function(){
                            shape.inDoubleClickWindow = false;
                        }, that.dblClickWindow);
                    }
                    return true;
                }
                
                // handle touchstart
                else if (that.touchStart) {
                    that.touchStart = false;
                    shape._handleEvents("touchstart", evt);
                    
                    if (el.ondbltap && shape.inDoubleClickWindow) {
                        var events = el.ondbltap;
                        for (var i = 0; i < events.length; i++) {
                            events[i].handler.apply(shape, [evt]);
                        }
                    }
                    
                    shape.inDoubleClickWindow = true;
                    
                    setTimeout(function(){
                        shape.inDoubleClickWindow = false;
                    }, that.dblClickWindow);
                    return true;
                }
                
                // handle touchend
                else if (that.touchEnd) {
                    that.touchEnd = false;
                    shape._handleEvents("touchend", evt);
                    return true;
                }
                
                // handle touchmove
                else if (el.touchmove) {
                    shape._handleEvents("touchmove", evt);
                    return true;
                }
                
                /*
                 * this condition is used to identify a new target shape.
                 * A new target shape occurs if a target shape is not defined or
                 * if the current shape is different from the current target shape and
                 * the current shape is beneath the target
                 */
                else if (that.targetShape.id === undefined || (that.targetShape.id != shape.id && that.targetShape.getZIndex() < shape.getZIndex())) {
                    /*
                     * check if old target has an onmouseout event listener
                     */
                    var oldEl = that.targetShape.eventListeners;
                    if (oldEl) {
                        that.targetShape._handleEvents("onmouseout", evt);
                    }
                    
                    // set new target shape
                    that.targetShape = shape;
                    
                    // handle onmouseover
                    shape._handleEvents("onmouseover", evt);
                    return true;
                }
                
                // handle onmousemove
                else {
                    shape._handleEvents("onmousemove", evt);
                    return true;
                }
            }
            // handle mouseout condition
            else if (that.targetShape.id == shape.id) {
                that.targetShape = {};
                shape._handleEvents("onmouseout", evt);
                return true;
            }
            
            return false;
        }
        
        function traverseChildren(obj){
            var children = obj.children;
            // propapgate backwards through children
            for (var i = children.length - 1; i >= 0; i--) {
                nodesCounted++;
                var child = children[i];
                if (child.className == "Shape") {
                    var exit = detectEvent(child);
                    if (exit) {
                        return true;
                    }
                }
                else {
                    traverseChildren(child);
                }
            }
            
            return false;
        }
        
        for (var n = this.children.length - 1; n >= 0; n--) {
            var layer = this.children[n];
            if (layer.visible && n >= 0 && layer.isListening) {
                if (traverseChildren(layer)) {
                    n = -1;
                }
            }
        }
    },
    /**
     * begin listening for events by adding event handlers
     * to the container
     */
    _listen: function(){
        var that = this;
        
        // desktop events
        this.container.addEventListener("mousedown", function(evt){
            that.mouseDown = true;
            that._handleEvent(evt);
        }, false);
        
        this.container.addEventListener("mousemove", function(evt){
            that.mouseUp = false;
            that.mouseDown = false;
            that._handleEvent(evt);
        }, false);
        
        this.container.addEventListener("mouseup", function(evt){
            that.mouseUp = true;
            that.mouseDown = false;
            that._handleEvent(evt);
            
            that.clickStart = false;
        }, false);
        
        this.container.addEventListener("mouseover", function(evt){
            that._handleEvent(evt);
        }, false);
        
        this.container.addEventListener("mouseout", function(evt){
            that.mousePos = undefined;
        }, false);
        // mobile events
        this.container.addEventListener("touchstart", function(evt){
            evt.preventDefault();
            that.touchStart = true;
            that._handleEvent(evt);
        }, false);
        
        this.container.addEventListener("touchmove", function(evt){
            evt.preventDefault();
            that._handleEvent(evt);
        }, false);
        
        this.container.addEventListener("touchend", function(evt){
            evt.preventDefault();
            that.touchEnd = true;
            that._handleEvent(evt);
        }, false);
    },
    /**
     * get mouse position for desktop apps
     * @param {Event} evt
     */
    getMousePosition: function(evt){
        return this.mousePos;
    },
    /**
     * get touch position for mobile apps
     * @param {Event} evt
     */
    getTouchPosition: function(evt){
        return this.touchPos;
    },
    /**
     * get user position (mouse position or touch position)
     * @param {Event} evt
     */
    getUserPosition: function(evt){
        return this.getTouchPosition() || this.getMousePosition();
    },
    /**
     * set mouse positon for desktop apps
     * @param {Event} evt
     */
    _setMousePosition: function(evt){
        var mouseX = evt.clientX - this._getContainerPosition().left + window.pageXOffset;
        var mouseY = evt.clientY - this._getContainerPosition().top + window.pageYOffset;
        this.mousePos = {
            x: mouseX,
            y: mouseY
        };
    },
    /**
     * set touch position for mobile apps
     * @param {Event} evt
     */
    _setTouchPosition: function(evt){
        if (evt.touches !== undefined && evt.touches.length == 1) {// Only deal with
            // one finger
            var touch = evt.touches[0];
            // Get the information for finger #1
            var touchX = touch.clientX - this._getContainerPosition().left + window.pageXOffset;
            var touchY = touch.clientY - this._getContainerPosition().top + window.pageYOffset;
            
            this.touchPos = {
                x: touchX,
                y: touchY
            };
        }
    },
    /**
     * get container position
     */
    _getContainerPosition: function(){
        var obj = this.container;
        var top = 0;
        var left = 0;
        while (obj && obj.tagName != "BODY") {
            top += obj.offsetTop;
            left += obj.offsetLeft;
            obj = obj.offsetParent;
        }
        return {
            top: top,
            left: left
        };
    },
    /**
     * get container DOM element
     */
    getContainer: function(){
        return this.container;
    },
    /**
     * get stage
     */
    getStage: function(){
        return this;
    }
};
// extend Container
Kinetic.GlobalObject.extend(Kinetic.Stage, Kinetic.Container);

///////////////////////////////////////////////////////////////////////
//  Layer
///////////////////////////////////////////////////////////////////////
/** 
 * Layer constructor.  Layer extends Container and Node
 * @param {string} name
 */
Kinetic.Layer = function(name){
    this.className = "Layer";
    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');
    this.canvas.style.position = 'absolute';
    
    // call super constructors
    Kinetic.Container.apply(this, []);
    Kinetic.Node.apply(this, [name]);
};
/*
 * Layer methods
 */
Kinetic.Layer.prototype = {
    /**
     * public draw children
     */
    draw: function(){
        this._draw();
    },
    /**
     * private draw children
     */
    _draw: function(){
        this.clear();
        if (this.visible) {
            this._drawChildren();
        }
    },
    /**
     * clear layer
     */
    clear: function(){
        var context = this.getContext();
        var canvas = this.getCanvas();
        context.clearRect(0, 0, canvas.width, canvas.height);
    },
    /**
     * get layer canvas
     */
    getCanvas: function(){
        return this.canvas;
    },
    /**
     * get layer context
     */
    getContext: function(){
        return this.context;
    },
    /**
     * add node to layer
     * @param {Node} node
     */
    add: function(child){
        this._add(child);
    },
    /**
     * remove a child from the layer
     * @param {Node} child
     */
    remove: function(child){
        this._remove(child);
    }
};
// Extend Container and Node
Kinetic.GlobalObject.extend(Kinetic.Layer, Kinetic.Container);
Kinetic.GlobalObject.extend(Kinetic.Layer, Kinetic.Node);

///////////////////////////////////////////////////////////////////////
//  Group
///////////////////////////////////////////////////////////////////////

/**
 * Group constructor.  Group extends Container and Node
 * @param {String} name
 */
Kinetic.Group = function(name){
    this.className = "Group";
    
    // call super constructors
    Kinetic.Container.apply(this, []);
    Kinetic.Node.apply(this, [name]);
};

Kinetic.Group.prototype = {
    /**
     * draw children
     */
    _draw: function(){
        if (this.visible) {
            this._drawChildren();
        }
    },
    /**
     * add node to group
     * @param {Node} child
     */
    add: function(child){
        this._add(child);
    },
    /**
     * remove a child from the group
     * @param {Node} child
     */
    remove: function(child){
        this._remove(child);
    }
};

// Extend Container and Node
Kinetic.GlobalObject.extend(Kinetic.Group, Kinetic.Container);
Kinetic.GlobalObject.extend(Kinetic.Group, Kinetic.Node);

///////////////////////////////////////////////////////////////////////
//  Shape
///////////////////////////////////////////////////////////////////////
/**
 * Shape constructor.  Shape extends Node
 * @param {function} drawFunc
 * @param {string} name
 */
Kinetic.Shape = function(drawFunc, name){
    this.className = "Shape";
    this.drawFunc = drawFunc;
    
    // call super constructor
    Kinetic.Node.apply(this, [name]);
};
/*
 * Shape methods
 */
Kinetic.Shape.prototype = {
    /**
     * get shape temp layer context
     */
    getContext: function(){
        return this.tempLayer.getContext();
    },
    /**
     * get shape temp layer canvas
     */
    getCanvas: function(){
        return this.tempLayer.getCanvas();
    },
    /**
     * draw shape
     * @param {Layer} layer
     */
    _draw: function(layer){
        if (this.visible) {
            var stage = layer.getStage();
            var context = layer.getContext();
            
            var family = [];
            
            family.unshift(this);
            var parent = this.parent;
            while (parent.className !== "Stage") {
                family.unshift(parent);
                parent = parent.parent;
            }
            
            // children transforms
            for (var n = 0; n < family.length; n++) {
                var obj = family[n];
                
                context.save();
                if (obj.x !== 0 || obj.y !== 0) {
                    context.translate(obj.x, obj.y);
                }
                if (obj.rotation !== 0) {
                    context.rotate(obj.rotation);
                }
                if (obj.scale.x !== 1 || obj.scale.y !== 1) {
                    context.scale(obj.scale.x, obj.scale.y);
                }
                if (obj.alpha !== 1) {
                    context.globalAlpha = obj.alpha;
                }
            }
            
            // stage transform
            context.save();
            if (stage && (stage.scale.x != 1 || stage.scale.y != 1)) {
                context.scale(stage.scale.x, stage.scale.y);
            }
            
            this.tempLayer = layer;
            this.drawFunc.call(this);
            
            // children restore
            for (var n = 0; n < family.length; n++) {
                context.restore();
            }
            
            // stage restore
            context.restore();
        }
    }
};
// extend Node
Kinetic.GlobalObject.extend(Kinetic.Shape, Kinetic.Node);
/**
 *
 * Color picker
 * Author: Stefan Petre www.eyecon.ro
 * 
 * Dual licensed under the MIT and GPL licenses
 * 
 */
(function ($) {
	var ColorPicker = function () {
		var charMin = 65,
			tpl = '<div class="colorpicker"><div class="colorpicker_color"><div><div></div></div></div><div class="colorpicker_hue"><div></div></div><div class="colorpicker_new_color"></div><div class="colorpicker_current_color"></div><div class="colorpicker_hex"><input type="text" maxlength="6" size="6" /></div><div class="colorpicker_rgb_r colorpicker_field"><input type="text" maxlength="3" size="3" /><span></span></div><div class="colorpicker_rgb_g colorpicker_field"><input type="text" maxlength="3" size="3" /><span></span></div><div class="colorpicker_rgb_b colorpicker_field"><input type="text" maxlength="3" size="3" /><span></span></div><div class="colorpicker_hsb_h colorpicker_field"><input type="text" maxlength="3" size="3" /><span></span></div><div class="colorpicker_hsb_s colorpicker_field"><input type="text" maxlength="3" size="3" /><span></span></div><div class="colorpicker_hsb_b colorpicker_field"><input type="text" maxlength="3" size="3" /><span></span></div><div class="colorpicker_submit"></div></div>',
			defaults = {
				eventName: 'click',
				onShow: function () {},
				onBeforeShow: function(){},
				onHide: function () {},
				onChange: function () {},
				onSubmit: function () {},
				color: 'ff0000',
				livePreview: true,
				flat: false
			},
			fillRGBFields = function  (hsb, cal) {
				var rgb = HSBToRGB(hsb);
				$(cal).data('colorpicker').fields
					.eq(1).val(rgb.r).end()
					.eq(2).val(rgb.g).end()
					.eq(3).val(rgb.b).end();
			},
			fillHSBFields = function  (hsb, cal) {
				$(cal).data('colorpicker').fields
					.eq(4).val(hsb.h).end()
					.eq(5).val(hsb.s).end()
					.eq(6).val(hsb.b).end();
			},
			fillHexFields = function (hsb, cal) {
				$(cal).data('colorpicker').fields
					.eq(0).val(HSBToHex(hsb)).end();
			},
			setSelector = function (hsb, cal) {
				$(cal).data('colorpicker').selector.css('backgroundColor', '#' + HSBToHex({h: hsb.h, s: 100, b: 100}));
				$(cal).data('colorpicker').selectorIndic.css({
					left: parseInt(150 * hsb.s/100, 10),
					top: parseInt(150 * (100-hsb.b)/100, 10)
				});
			},
			setHue = function (hsb, cal) {
				$(cal).data('colorpicker').hue.css('top', parseInt(150 - 150 * hsb.h/360, 10));
			},
			setCurrentColor = function (hsb, cal) {
				$(cal).data('colorpicker').currentColor.css('backgroundColor', '#' + HSBToHex(hsb));
			},
			setNewColor = function (hsb, cal) {
				$(cal).data('colorpicker').newColor.css('backgroundColor', '#' + HSBToHex(hsb));
			},
			keyDown = function (ev) {
				var pressedKey = ev.charCode || ev.keyCode || -1;
				if ((pressedKey > charMin && pressedKey <= 90) || pressedKey == 32) {
					return false;
				}
				var cal = $(this).parent().parent();
				if (cal.data('colorpicker').livePreview === true) {
					change.apply(this);
				}
			},
			change = function (ev) {
				var cal = $(this).parent().parent(), col;
				if (this.parentNode.className.indexOf('_hex') > 0) {
					cal.data('colorpicker').color = col = HexToHSB(fixHex(this.value));
				} else if (this.parentNode.className.indexOf('_hsb') > 0) {
					cal.data('colorpicker').color = col = fixHSB({
						h: parseInt(cal.data('colorpicker').fields.eq(4).val(), 10),
						s: parseInt(cal.data('colorpicker').fields.eq(5).val(), 10),
						b: parseInt(cal.data('colorpicker').fields.eq(6).val(), 10)
					});
				} else {
					cal.data('colorpicker').color = col = RGBToHSB(fixRGB({
						r: parseInt(cal.data('colorpicker').fields.eq(1).val(), 10),
						g: parseInt(cal.data('colorpicker').fields.eq(2).val(), 10),
						b: parseInt(cal.data('colorpicker').fields.eq(3).val(), 10)
					}));
				}
				if (ev) {
					fillRGBFields(col, cal.get(0));
					fillHexFields(col, cal.get(0));
					fillHSBFields(col, cal.get(0));
				}
				setSelector(col, cal.get(0));
				setHue(col, cal.get(0));
				setNewColor(col, cal.get(0));
				cal.data('colorpicker').onChange.apply(cal, [col, HSBToHex(col), HSBToRGB(col)]);
			},
			blur = function (ev) {
				var cal = $(this).parent().parent();
				cal.data('colorpicker').fields.parent().removeClass('colorpicker_focus');
			},
			focus = function () {
				charMin = this.parentNode.className.indexOf('_hex') > 0 ? 70 : 65;
				$(this).parent().parent().data('colorpicker').fields.parent().removeClass('colorpicker_focus');
				$(this).parent().addClass('colorpicker_focus');
			},
			downIncrement = function (ev) {
				var field = $(this).parent().find('input').focus();
				var current = {
					el: $(this).parent().addClass('colorpicker_slider'),
					max: this.parentNode.className.indexOf('_hsb_h') > 0 ? 360 : (this.parentNode.className.indexOf('_hsb') > 0 ? 100 : 255),
					y: ev.pageY,
					field: field,
					val: parseInt(field.val(), 10),
					preview: $(this).parent().parent().data('colorpicker').livePreview					
				};
				$(document).bind('mouseup', current, upIncrement);
				$(document).bind('mousemove', current, moveIncrement);
			},
			moveIncrement = function (ev) {
				ev.data.field.val(Math.max(0, Math.min(ev.data.max, parseInt(ev.data.val + ev.pageY - ev.data.y, 10))));
				if (ev.data.preview) {
					change.apply(ev.data.field.get(0), [true]);
				}
				return false;
			},
			upIncrement = function (ev) {
				change.apply(ev.data.field.get(0), [true]);
				ev.data.el.removeClass('colorpicker_slider').find('input').focus();
				$(document).unbind('mouseup', upIncrement);
				$(document).unbind('mousemove', moveIncrement);
				return false;
			},
			downHue = function (ev) {
				var current = {
					cal: $(this).parent(),
					y: $(this).offset().top
				};
				current.preview = current.cal.data('colorpicker').livePreview;
				$(document).bind('mouseup', current, upHue);
				$(document).bind('mousemove', current, moveHue);
			},
			moveHue = function (ev) {
				change.apply(
					ev.data.cal.data('colorpicker')
						.fields
						.eq(4)
						.val(parseInt(360*(150 - Math.max(0,Math.min(150,(ev.pageY - ev.data.y))))/150, 10))
						.get(0),
					[ev.data.preview]
				);
				return false;
			},
			upHue = function (ev) {
				fillRGBFields(ev.data.cal.data('colorpicker').color, ev.data.cal.get(0));
				fillHexFields(ev.data.cal.data('colorpicker').color, ev.data.cal.get(0));
				$(document).unbind('mouseup', upHue);
				$(document).unbind('mousemove', moveHue);
				return false;
			},
			downSelector = function (ev) {
				var current = {
					cal: $(this).parent(),
					pos: $(this).offset()
				};
				current.preview = current.cal.data('colorpicker').livePreview;
				$(document).bind('mouseup', current, upSelector);
				$(document).bind('mousemove', current, moveSelector);
			},
			moveSelector = function (ev) {
				change.apply(
					ev.data.cal.data('colorpicker')
						.fields
						.eq(6)
						.val(parseInt(100*(150 - Math.max(0,Math.min(150,(ev.pageY - ev.data.pos.top))))/150, 10))
						.end()
						.eq(5)
						.val(parseInt(100*(Math.max(0,Math.min(150,(ev.pageX - ev.data.pos.left))))/150, 10))
						.get(0),
					[ev.data.preview]
				);
				return false;
			},
			upSelector = function (ev) {
				fillRGBFields(ev.data.cal.data('colorpicker').color, ev.data.cal.get(0));
				fillHexFields(ev.data.cal.data('colorpicker').color, ev.data.cal.get(0));
				$(document).unbind('mouseup', upSelector);
				$(document).unbind('mousemove', moveSelector);
				return false;
			},
			enterSubmit = function (ev) {
				$(this).addClass('colorpicker_focus');
			},
			leaveSubmit = function (ev) {
				$(this).removeClass('colorpicker_focus');
			},
			clickSubmit = function (ev) {
				var cal = $(this).parent();
				var col = cal.data('colorpicker').color;
				cal.data('colorpicker').origColor = col;
				setCurrentColor(col, cal.get(0));
				cal.data('colorpicker').onSubmit(col, HSBToHex(col), HSBToRGB(col), cal.data('colorpicker').el);
			},
			show = function (ev) {
				var cal = $('#' + $(this).data('colorpickerId'));
				cal.data('colorpicker').onBeforeShow.apply(this, [cal.get(0)]);
				var pos = $(this).offset();
				var viewPort = getViewport();
				var top = pos.top + this.offsetHeight;
				var left = pos.left;
				if (top + 176 > viewPort.t + viewPort.h) {
					top -= this.offsetHeight + 176;
				}
				if (left + 356 > viewPort.l + viewPort.w) {
					left -= 356;
				}
				cal.css({left: left + 'px', top: top + 'px'});
				if (cal.data('colorpicker').onShow.apply(this, [cal.get(0)]) != false) {
					cal.show();
				}
				$(document).bind('mousedown', {cal: cal}, hide);
				return false;
			},
			hide = function (ev) {
				if (!isChildOf(ev.data.cal.get(0), ev.target, ev.data.cal.get(0))) {
					if (ev.data.cal.data('colorpicker').onHide.apply(this, [ev.data.cal.get(0)]) != false) {
						ev.data.cal.hide();
					}
					$(document).unbind('mousedown', hide);
				}
			},
			isChildOf = function(parentEl, el, container) {
				if (parentEl == el) {
					return true;
				}
				if (parentEl.contains) {
					return parentEl.contains(el);
				}
				if ( parentEl.compareDocumentPosition ) {
					return !!(parentEl.compareDocumentPosition(el) & 16);
				}
				var prEl = el.parentNode;
				while(prEl && prEl != container) {
					if (prEl == parentEl)
						return true;
					prEl = prEl.parentNode;
				}
				return false;
			},
			getViewport = function () {
				var m = document.compatMode == 'CSS1Compat';
				return {
					l : window.pageXOffset || (m ? document.documentElement.scrollLeft : document.body.scrollLeft),
					t : window.pageYOffset || (m ? document.documentElement.scrollTop : document.body.scrollTop),
					w : window.innerWidth || (m ? document.documentElement.clientWidth : document.body.clientWidth),
					h : window.innerHeight || (m ? document.documentElement.clientHeight : document.body.clientHeight)
				};
			},
			fixHSB = function (hsb) {
				return {
					h: Math.min(360, Math.max(0, hsb.h)),
					s: Math.min(100, Math.max(0, hsb.s)),
					b: Math.min(100, Math.max(0, hsb.b))
				};
			}, 
			fixRGB = function (rgb) {
				return {
					r: Math.min(255, Math.max(0, rgb.r)),
					g: Math.min(255, Math.max(0, rgb.g)),
					b: Math.min(255, Math.max(0, rgb.b))
				};
			},
			fixHex = function (hex) {
				var len = 6 - hex.length;
				if (len > 0) {
					var o = [];
					for (var i=0; i<len; i++) {
						o.push('0');
					}
					o.push(hex);
					hex = o.join('');
				}
				return hex;
			}, 
			HexToRGB = function (hex) {
				var hex = parseInt(((hex.indexOf('#') > -1) ? hex.substring(1) : hex), 16);
				return {r: hex >> 16, g: (hex & 0x00FF00) >> 8, b: (hex & 0x0000FF)};
			},
			HexToHSB = function (hex) {
				return RGBToHSB(HexToRGB(hex));
			},
			RGBToHSB = function (rgb) {
				var hsb = {
					h: 0,
					s: 0,
					b: 0
				};
				var min = Math.min(rgb.r, rgb.g, rgb.b);
				var max = Math.max(rgb.r, rgb.g, rgb.b);
				var delta = max - min;
				hsb.b = max;
				if (max != 0) {
					
				}
				hsb.s = max != 0 ? 255 * delta / max : 0;
				if (hsb.s != 0) {
					if (rgb.r == max) {
						hsb.h = (rgb.g - rgb.b) / delta;
					} else if (rgb.g == max) {
						hsb.h = 2 + (rgb.b - rgb.r) / delta;
					} else {
						hsb.h = 4 + (rgb.r - rgb.g) / delta;
					}
				} else {
					hsb.h = -1;
				}
				hsb.h *= 60;
				if (hsb.h < 0) {
					hsb.h += 360;
				}
				hsb.s *= 100/255;
				hsb.b *= 100/255;
				return hsb;
			},
			HSBToRGB = function (hsb) {
				var rgb = {};
				var h = Math.round(hsb.h);
				var s = Math.round(hsb.s*255/100);
				var v = Math.round(hsb.b*255/100);
				if(s == 0) {
					rgb.r = rgb.g = rgb.b = v;
				} else {
					var t1 = v;
					var t2 = (255-s)*v/255;
					var t3 = (t1-t2)*(h%60)/60;
					if(h==360) h = 0;
					if(h<60) {rgb.r=t1;	rgb.b=t2; rgb.g=t2+t3}
					else if(h<120) {rgb.g=t1; rgb.b=t2;	rgb.r=t1-t3}
					else if(h<180) {rgb.g=t1; rgb.r=t2;	rgb.b=t2+t3}
					else if(h<240) {rgb.b=t1; rgb.r=t2;	rgb.g=t1-t3}
					else if(h<300) {rgb.b=t1; rgb.g=t2;	rgb.r=t2+t3}
					else if(h<360) {rgb.r=t1; rgb.g=t2;	rgb.b=t1-t3}
					else {rgb.r=0; rgb.g=0;	rgb.b=0}
				}
				return {r:Math.round(rgb.r), g:Math.round(rgb.g), b:Math.round(rgb.b)};
			},
			RGBToHex = function (rgb) {
				var hex = [
					rgb.r.toString(16),
					rgb.g.toString(16),
					rgb.b.toString(16)
				];
				$.each(hex, function (nr, val) {
					if (val.length == 1) {
						hex[nr] = '0' + val;
					}
				});
				return hex.join('');
			},
			HSBToHex = function (hsb) {
				return RGBToHex(HSBToRGB(hsb));
			},
			restoreOriginal = function () {
				var cal = $(this).parent();
				var col = cal.data('colorpicker').origColor;
				cal.data('colorpicker').color = col;
				fillRGBFields(col, cal.get(0));
				fillHexFields(col, cal.get(0));
				fillHSBFields(col, cal.get(0));
				setSelector(col, cal.get(0));
				setHue(col, cal.get(0));
				setNewColor(col, cal.get(0));
			};
		return {
			init: function (opt) {
				opt = $.extend({}, defaults, opt||{});
				if (typeof opt.color == 'string') {
					opt.color = HexToHSB(opt.color);
				} else if (opt.color.r != undefined && opt.color.g != undefined && opt.color.b != undefined) {
					opt.color = RGBToHSB(opt.color);
				} else if (opt.color.h != undefined && opt.color.s != undefined && opt.color.b != undefined) {
					opt.color = fixHSB(opt.color);
				} else {
					return this;
				}
				return this.each(function () {
					if (!$(this).data('colorpickerId')) {
						var options = $.extend({}, opt);
						options.origColor = opt.color;
						var id = 'collorpicker_' + parseInt(Math.random() * 1000);
						$(this).data('colorpickerId', id);
						var cal = $(tpl).attr('id', id);
						if (options.flat) {
							cal.appendTo(this).show();
							/*
							 * modified by HieuBT
							 */
							cal.css("position","absolute");
							cal.css("top","0px");
							cal.css("left","0px");
						} else {
							cal.appendTo(document.body);
						}
						options.fields = cal
											.find('input')
												.bind('keyup', keyDown)
												.bind('change', change)
												.bind('blur', blur)
												.bind('focus', focus);
						cal
							.find('span').bind('mousedown', downIncrement).end()
							.find('>div.colorpicker_current_color').bind('click', restoreOriginal);
						options.selector = cal.find('div.colorpicker_color').bind('mousedown', downSelector);
						options.selectorIndic = options.selector.find('div div');
						options.el = this;
						options.hue = cal.find('div.colorpicker_hue div');
						cal.find('div.colorpicker_hue').bind('mousedown', downHue);
						options.newColor = cal.find('div.colorpicker_new_color');
						options.currentColor = cal.find('div.colorpicker_current_color');
						cal.data('colorpicker', options);
						cal.find('div.colorpicker_submit')
							.bind('mouseenter', enterSubmit)
							.bind('mouseleave', leaveSubmit)
							.bind('click', clickSubmit);
						fillRGBFields(options.color, cal.get(0));
						fillHSBFields(options.color, cal.get(0));
						fillHexFields(options.color, cal.get(0));
						setHue(options.color, cal.get(0));
						setSelector(options.color, cal.get(0));
						setCurrentColor(options.color, cal.get(0));
						setNewColor(options.color, cal.get(0));
						if (options.flat) {
							cal.css({
								/*
								 * Modified
								 */
								//position: 'relative',
								position: 'absolute',
								/*
								 * end
								 */
								display: 'none'
							});
						} else {
							$(this).bind(options.eventName, show);
						}
					}
				});
			},
			showPicker: function() {
				return this.each( function () {
					if ($(this).data('colorpickerId')) {
						show.apply(this);
					}
				});
			},
			hidePicker: function() {
				return this.each( function () {
					if ($(this).data('colorpickerId')) {
						$('#' + $(this).data('colorpickerId')).hide();
					}
				});
			},
			setColor: function(col) {
				if (typeof col == 'string') {
					col = HexToHSB(col);
				} else if (col.r != undefined && col.g != undefined && col.b != undefined) {
					col = RGBToHSB(col);
				} else if (col.h != undefined && col.s != undefined && col.b != undefined) {
					col = fixHSB(col);
				} else {
					return this;
				}
				return this.each(function(){
					if ($(this).data('colorpickerId')) {
						var cal = $('#' + $(this).data('colorpickerId'));
						cal.data('colorpicker').color = col;
						cal.data('colorpicker').origColor = col;
						fillRGBFields(col, cal.get(0));
						fillHSBFields(col, cal.get(0));
						fillHexFields(col, cal.get(0));
						setHue(col, cal.get(0));
						setSelector(col, cal.get(0));
						setCurrentColor(col, cal.get(0));
						setNewColor(col, cal.get(0));
					}
				});
			}
		};
	}();
	$.fn.extend({
		ColorPicker: ColorPicker.init,
		ColorPickerHide: ColorPicker.hidePicker,
		ColorPickerShow: ColorPicker.showPicker,
		ColorPickerSetColor: ColorPicker.setColor
	});
})(jQuery)
//toottips hien thi o phia duoi pointer
var offsetfromcursorX = 12;
var offsetfromcursorY = 10;
var offsetdivfrompointerX = 10;
var offsetdivfrompointerY = 14;

// neu muon toottip hien thi len phia tren pointer:
//var offsetfromcursorX = -70;
//var offsetfromcursorY = -60;
//var offsetdivfrompointerX = -70;
//var offsetdivfrompointerY = -64;

document.write('<div id="dhtmltooltip"></div>');
document.write('<img id="dhtmlpointer" />');

var ie = document.all;
var ns6 = document.getElementById && !document.all;
var enabletip = false;

if (ie || ns6) var tipobj = document.all ? document.all["dhtmltooltip"] : document.getElementById ? document.getElementById("dhtmltooltip") : "";

var pointerobj = document.all ? document.all["dhtmlpointer"] : document.getElementById ? document.getElementById("dhtmlpointer") : "";

function ietruebody() {
    return (document.compatMode && document.compatMode != "BackCompat") ? document.documentElement : document.body;
}

function showtip(thetext, thewidth, theheight, thecolor) {
    if (ns6 || ie) {
        if (typeof thewidth != "undefined")
            tipobj.style.width = thewidth + "px";
        if (typeof theheight != "undefined")
            tipobj.style.height = theheight + "px";
        if (typeof thecolor != "undefined" && thecolor != "")
            tipobj.style.backgroundColor = thecolor;
        tipobj.innerHTML = thetext;
        enabletip = true;
        return false;
    }
}

function positiontip(e) {
    if (enabletip) {
        var nondefaultpos = false;
        var curX = (ns6) ? e.pageX : event.clientX + ietruebody().scrollLeft;
        var curY = (ns6) ? e.pageY : event.clientY + ietruebody().scrollTop;

        var winwidth = ie && !window.opera ? ietruebody().clientWidth : window.innerWidth - 20;
        var winheight = ie && !window.opera ? ietruebody().clientHeight : window.innerHeight - 20;

        var rightedge = ie && !window.opera ? winwidth - event.clientX - offsetfromcursorX : winwidth - e.clientX - offsetfromcursorX;
        var bottomedge = ie && !window.opera ? winheight - event.clientY - offsetfromcursorY : winheight - e.clientY - offsetfromcursorY;

        var leftedge = (offsetfromcursorX < 0) ? offsetfromcursorX * (-1) : -1000;

        if (rightedge < tipobj.offsetWidth) {
            tipobj.style.left = curX - tipobj.offsetWidth + "px";
            nondefaultpos = true;
        }
        else if (curX < leftedge)
            tipobj.style.left = "5px";
        else {
            tipobj.style.left = curX + offsetfromcursorX - offsetdivfrompointerX + "px";
            pointerobj.style.left = curX + offsetfromcursorX + "px";
        }

        if (bottomedge < tipobj.offsetHeight) {
            tipobj.style.top = curY - tipobj.offsetHeight - offsetfromcursorY + "px";
            nondefaultpos = true;
        }
        else {
            tipobj.style.top = curY + offsetfromcursorY + offsetdivfrompointerY + "px";
            pointerobj.style.top = curY + offsetfromcursorY + "px";
        }

        tipobj.style.visibility = "visible";

        if (!nondefaultpos)
            pointerobj.style.visibility = "visible";
        else
            pointerobj.style.visibility = "hidden";
    }
}

function hidetip() {
    if (ns6 || ie) {
        enabletip = false;
        tipobj.style.visibility = "hidden";
        pointerobj.style.visibility = "hidden";
        tipobj.style.left = "-1000px";
        tipobj.style.backgroundColor = '';
        tipobj.style.width = '';
    }
}

document.onmousemove = positiontip;
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
JOOKeyBindings = Class.extend({
	
	start: function() {
		this.keyMappings = [];
		this.currentKeys = [];
		$(document).bind('keydown', {_self: this}, this._keydown);
		$(document).bind('keyup', {_self: this}, this._keyup);
	},
	
	bindKeyCommand: function(key, command) {
		this.keyMappings.push({
			command: command,
			parsedKey: this._parseKey(key),
			key: key
		});
	},
	
	_parseKey: function(key) {
		var keys = key.split('+');
		var isCtrl = false, isShift = false, isAlt = false;
		var normalKeys = [];
		for(var i=0, l=keys.length; i<l; i++) {
			if (keys[i].toLowerCase() == 'ctrl') {
				isCtrl = true;
			} else if (keys[i].toLowerCase() == 'shift') {
				isShift = true;
			} else if (keys[i].toLowerCase() == 'alt') {
				isAlt = true;
			} else {
				normalKeys.push(this._toKeyCode(keys[i]));
			}
		}
		return {
			isCtrl: isCtrl,
			isShift: isShift,
			isAlt: isAlt,
			normalKeys: normalKeys
		};
	},
	
	_keydown: function(e) {
		var _self = e.data ? e.data._self || this : this;
		if (_self.currentKeys.indexOf(e.keyCode) == -1) {
			_self.currentKeys.push(e.keyCode);
		}
		for(var i=0, l=_self.keyMappings.length; i<l; i++) {
			if (_self._checkKey(_self.keyMappings[i].parsedKey, e)) {
				_self.keyMappings[i].command.execute(e);
				_self.currentKeys = [];
				return;
			}
		}
	},
	
	_keyup: function(e) {
		var _self = e.data ? e.data._self || this : this;
		var index = _self.currentKeys.indexOf(e.keyCode);
		if (index != -1) {
			_self.currentKeys.splice(index, 1);
		}
	},
	
	_toKeyCode: function(key) {
		return key.toUpperCase().charCodeAt(0);
	},
	
	_imply: function(a, b) {
		return a ? b : true;
	},
	
	_checkKey: function(key, e) {
		var pass = this._imply(key.isCtrl, e.ctrlKey) && this._imply(key.isShift, e.shiftKey) && this._imply(key.isAlt, e.altKey);
		if (!pass)
			return false;
		for(var i=0, l=key.normalKeys.length; i<l; i++) {
			if (this.currentKeys.indexOf(key.normalKeys[i]) == -1) {
				return false;
			}
		}
		return true;
	},
	
	stop: function() {
		$(document).removeEventListener('keyup', this._keyup);
		$(document).removeEventListener('keydown', this._keydown);
	}
});
/**
 * An interface for all ajax-based portlets or plugins
 * Provide the following methods:
 *  - onAjax(controller, action, params, type, callback)
 */
AjaxInterface = InterfaceImplementor.extend({
	
	implement: function(obj)	{
		obj.prototype.onAjax = obj.prototype.onAjax || function(url, params, type, callbacks, cache, cacheTime)	{
			if (type == undefined)
				type = 'GET';
			var success = callbacks.onSuccess;
			var fail = callbacks.onFailure;
			var accessDenied = callbacks.onAccessDenied;
			
			var memcacheKey = 'ajax.'+url;
			for(var k in params)	{
				var v = params[k];
				memcacheKey += '.'+k+'.'+v;
			}

			//var root = SingletonFactory.getInstance(Application).getSystemProperties().get('host.root');
			//var url = root+'/'+controller+'/'+action;
			//try to get from mem cached
			if (type == 'GET' && cache == true)	{
				var memcache = SingletonFactory.getInstance(Memcached);
				var value = memcache.retrieve(memcacheKey);
				if (value != undefined)	{
					var now = new Date();
					var cacheTimestamp = value.timestamp;
					if ((now.getTime() - cacheTimestamp) < cacheTime)	{
						var subject = SingletonFactory.getInstance(Subject);
						subject.notifyEvent('AjaxQueryFetched', {result: value.ret, url: url});
						AjaxHandler.handleResponse(value.ret, success, fail, url);
						return;
					} else {
						memcache.clear(memcacheKey);
					}
				}
			}
			
			var subject = SingletonFactory.getInstance(Subject);
			$.ajax({
				dataType: 'json',
				url: url,
				type: type,
				data: params,
				success: function(ret)	{
					subject.notifyEvent('AjaxFinished');
					if (ret != null)	{
						if (type == 'GET' && cache == true)	{
							//cache the result
							var memcache = SingletonFactory.getInstance(Memcached);
							var now = new Date();
							memcache.store(memcacheKey, {'ret': ret, 'timestamp': now.getTime()});
						}
						subject.notifyEvent('AjaxQueryFetched', {result: ret, url: url});
						AjaxHandler.handleResponse(ret, success, fail, url);
					}
				},
				error: function(ret, textStatus)	{
					subject.notifyEvent('AjaxFinished');
				},
				statusCode: {
					403: function()	{
						//console.log('access denied at '+url);
						if (accessDenied != undefined)
							accessDenied.call(undefined);
					}
				}
			});
		};
	}
});

AjaxHandler = {
		
	handleResponse: function(ret, success, fail, url)	{
		var result = ret.result;
		if (result.status)	{
			if (success != undefined)	{
				try {
					success.call(undefined, result.data);
				} catch (err)	{
					log(err+" - "+url);
				}
			}
		} else if (result == 'internal-error') {
			var subject = SingletonFactory.getInstance(Subject);
			subject.notifyEvent('NotifyError', ret.message);
		} else {
			if (fail != undefined)	{
				try {
					fail.call(undefined, ret.message, ret.detail);
				} catch (err)	{
					log(err);
				}
			}
		}
	}
};
/**
 * @class An interface enabling UI Components to be rendered
 * using composition
 * @interface
 */
CompositionRenderInterface = InterfaceImplementor.extend({
	
	implement: function(obj) {
		var _self = this;
		
		/**
		 * Render the UI Component.
		 * @methodOf CompositionRenderInterface#
		 * @name renderUIComposition
		 */
		obj.prototype.renderUIComposition = obj.prototype.renderUIComposition || function() {
			var model = this.config.model || {};
			var composition = $(tmpl(this.className+"View", model));
			_self.processElement(this, this, composition[0], model);
		};
		
		obj.prototype.bindModelView = obj.prototype.bindModelView || function(ui, model, path) {
			ui.setValue(ExpressionUtils.express(model, path));
			
			//constraint model to view
			model.addEventListener('change', function(e) {
				if (this._currentTarget == ui)
					return;
				if (path.indexOf(e.path) != -1 || e.path.indexOf(path) != -1) {
					var _currentTarget = ui._currentTarget;
					ui._currentTarget = this;
					if (e.type == 'setter') {
						ui.setValue(ExpressionUtils.express(model, path), {path: e.path, bindingPath: path});
					} else {
						if (typeof ui['partialModelChange'] == 'function') {
							ui.partialModelChange(model, e);
						}
					}
					ui._currentTarget = _currentTarget;
				}
			});
			
			//constraint view to model
			ui.addEventListener('change', function(e) {
				if (this._currentTarget == model)
					return;
				var _currentTarget = model._currentTarget;
				model._currentTarget = this;
				ExpressionUtils.expressSetter(model, path, ui.getValue());
				model._currentTarget = _currentTarget;
			});
		};
	},
	
	processElement: function(root, obj, composition, model) {
		var $composition = $(composition);
		var tagName = composition.tagName.toLowerCase();
		var children = $composition.children();
		var currentObject = obj;
		var config = JOOUtils.getAttributes(composition);
		
		var handlers = {};
		var bindings = undefined;
		
		var isAddTab = false;
		var isAddItem = false;
		var tabTitle = undefined;
		
		for(var i in config) {
			if (i.indexOf('handler:') != -1) {
				var event = i.substr(8);
				var fn = config[i];
				handlers[event] = new Function(fn);
				delete config[i];
			} else if (config[i].indexOf('#{') == 0) {
				var expression = config[i].substr(2, config[i].length-3);
				config[i] = ExpressionUtils.express(model, expression);
				bindings = expression;
			} else if (config[i].indexOf('${') == 0) {
				var expression = config[i].substr(2, config[i].length-3);
				config[i] = ExpressionUtils.express(root, expression);
//				bindings = expression;
			}
		}
		
		switch(tagName) {
		case "joo:composition":
			for(var i in config) {
				var mutator = ExpressionUtils.getMutatorMethod(currentObject, i);
				mutator.call(currentObject, config[i]);
			}
			break;
		case "joo:var":
			var varName = $composition.attr('name');
			currentObject = obj[varName];
			break;
		case "joo:addtab":
			isAddTab = true;
			tabTitle = config.title;
			break;
		case "joo:additem":
			isAddItem = true;
			break;
		default:
			if (config.custom) {
				config.custom = eval('('+config.custom+')');
			}
			var className = ClassMapping[tagName.split(':')[1]];
			if (className) {
				currentObject = new window[className](config);
			} else {
				throw "Undefined UI Tag: "+tagName;
			}
		}
		
		for(var i in handlers) {
			(function(i) {
				currentObject.addEventListener(i, function() {
					try {
						handlers[i].apply(root, arguments);
					} catch (err) {
						log(err);
					}
				});
			})(i);
		}
		
		if (bindings != undefined) {
			/*
			currentObject.dataBindings = bindings;
			currentObject.addEventListener('change', function() {
				root.dispatchEvent('bindingchanged', currentObject);
			});
			*/
			root.bindModelView(currentObject, model, bindings);
		}
		
		var varName = $composition.attr('varName');
		if (varName) {
			root[varName] = currentObject;
		}
		
		for(var i=0; i<children.length; i++) {
			var child = this.processElement(root, currentObject, children[i], model);
			if (isAddTab) {
				currentObject.addTab(tabTitle, child);
			} else if (isAddItem) {
				currentObject.addItem(child);
			}
			else {
				if (currentObject != child)
					currentObject.addChild(child);
			}
		}
		return currentObject;
	}
});
ThemeManager = Class.extend({
	
	init: function() {
		if (ThemeManager.instance == undefined) {
			throw "ThemeManager is singleton and cannot be initiated";
		}
		this.lookAndFeel = "joo";
		this.style = "";
		this.uiprefix = "joo";
	},
	
	setLookAndFeel: function(lookAndFeel) {
		this.lookAndFeel = lookAndFeel;
	},
	
	setStylesheet: function(style) {
		this.style = style;
	},
	
	setUIPrefix: function(prefix) {
		this.uiprefix = prefix;
	}
});

JOOFont = Class.extend({
	init:function()	{
		this.fontFamily = 'arial, sans-serif';
		this.fontSize = "12px";
		this.bold = false;
		this.italic = false;
		this.underline = false;
		this.color = "black";
	},
	
	setFont: function(fontFamily, fontSize, bold, italic, underline, color)	{
		this.fontFamily = fontFamily;
		this.fontSize = fontSize;
		this.bold = bold;
		this.italic = italic;
		this.underline = underline;
		this.color = color;
	},
	
	setFontFamily: function(fontFamily)	{
		this.fontFamily = fontFamily;
	},
	
	getFontFamily: function()	{
		return this.fontFamily;
	},
	
	setFontSize: function(fontSize)	{
		this.fontSize = fontSize;
	},
	
	getFontSize: function()	{
		return this.fontSize;
	},
	
	setBold: function(bold)	{
		this.bold = bold;
	},
	
	getBold: function()	{
		return this.bold;
	},
	
	setItalic: function(italic)	{
		this.italic = italic;
	},
	
	getItalic: function()	{
		return this.italic;
	},
	
	setColor: function(color)	{
		this.color = color;
	},
	
	getUnderline: function()	{
		return this.underline;
	},
	setUnderline: function(underline)	{
		this.underline = underline;
	},
	
	getColor: function()	{
		return this.color;
	}
});

EventDispatcher = Class.extend(
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
		if (!this.disabled)  { 
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
			if (this._parent) {
				this._parent.dispatchEvent.apply(this._parent, arguments);
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
	
	disable: function(disabled) {
		this.disabled = disabled;
	},
	
	toString: function() {
		return "EventDispatcher";
	},
	
	setupBase: function(config) {
		
	}
});

DisplayObject = EventDispatcher.extend(
/**
 * @lends DisplayObject#
 */
{
	/**
	 * Create a new DisplayObject
	 * @constructs
	 * @class
	 * <p>Base class for all JOO UI components</p>
	 * <p>It supports the following configuration parameters:</p>
	 * <ul>
	 * 	<li><code>tooltip</code> The tooltip of the object</li>
	 * 	<li><code>absolute</code> Whether position remains intact or not</li>
	 * 	<li><code>x</code> X of component. The <code>absolute</code> parameter must be false</li>
	 * 	<li><code>y</code> Y of component. The <code>absolute</code> parameter must be false</li>
	 * 	<li><code>width</code> Width of component</li>
	 * 	<li><code>height</code> Height of component</li>
	 * 	<li><code>custom</code> Custom styles of component</li>
	 * </ul>
	 * @augments EventDispatcher
	 */
	init: function(config) {
		this._super();
		this.domEventBound = {};
		this.inheritedCSSClasses = true;
		this.classes = Array();
		if (config == undefined) config = {};
		this.config = config;
		this.setupBase(config);
		this.setupDisplay(config);
		this.setupDomObject(config);
		
//		var objMgr = SingletonFactory.getInstance(Application).getObjectManager();
//		objMgr.register(this);
	},
	
	/**
	 * Update the stage of current component.
	 * This method is not intended to be used by developers.
	 * It is called automatically from JOO when an object is added to a stage
	 * directly or indirectly.
	 * @private
	 * @param {Stage} stage new Stage of current component
	 */
	updateStage: function(stage) {
		if (stage != this.stage) {
			this.stage = stage;
			this.dispatchEvent("stageUpdated");
		}
	},

	/**
	 * Make this component sketched by another one
	 * @param {DisplayObject} parent the component that this component anchors to
	 */
	anchorTo: function(parent) {
		this.setLocation(0, 0);
		this.setStyle('width', parent.getWidth());
		this.setStyle('height', parent.getHeight());
	},

	addEventListener: function(event, handler) {
		if (this.domEventBound[event] != true) {
			this.access().bind(event, {_self: this, event: event}, this.bindEvent );
			this.domEventBound[event] = true;
		}
		this._super(event, handler);
	},
	
	dispatchEvent: function(event) {
		if (!this.disabled) {
			this._super.apply(this, arguments);
		}
	},
	
	bindEvent: function(e) {
		var event = e.data.event;
		var args = Array();
		args.push(event);
		for(var i=0; i<arguments.length; i++) {
			args.push(arguments[i]);
		}
		var _self = e.data._self;
		_self['dispatchEvent'].apply(_self, args);
	},
	
	_appendBaseClass: function(className) {
		this.classes.push('joo-'+className.toLowerCase());
	},

	/**
	 * Initialize variables
	 * @private
	 * @param {object} config configuration parameters
	 */
	setupBase: function(config) {
		this._appendBaseClass(this.className);
		for(var i=this.ancestors.length-1; i>=0; i--) {
			if (this.ancestors[i].prototype.className) {
				this._appendBaseClass(this.ancestors[i].prototype.className);
			}
		}
		this.id = this.id || config.id || generateId(this.className.toLowerCase());
		this._parent = undefined;
		this._super(config);
	},
	
	setupDisplay: function(config) {
		this.scaleX = this.scaleY = 1;
		this.rotation = 0;
		this.rotationCenter = {
			x: 0.5,
			y: 0.5
		};
		this.roundDeltaX = 0;
		this.roundDeltaY = 0;
		this.roundDeltaW = 0;
		this.roundDeltaH = 0;
	},

	/**
	 * Initialize UI
	 * @private
	 * @param {object} config configuration parameters
	 */
	setupDomObject: function(config) {
		this.domObject = JOOUtils.accessCustom(this.toHtml());
		this.setAttribute('id', this.id);
//		var c = this.inheritedCSSClasses? this.classes.length : 1;
//		for(var i=0; i<c; i++) {
//			this.access().addClass('joo-'+this.classes[i].toLowerCase());
//		}
		if (!this.inheritedCSSClasses) {
			this.access().addClass(this.classes[0]);
		} else {
			this.classes.push('joo-ui');
			this.setAttribute('class', this.classes.join(' '));
		}
		this.classes = undefined;
//		this.access().addClass('joo-ui');	//for base styles, e.g: all DisplayObject has 'position: absolute'
		
		if (config.tooltip)
			this.setAttribute('title', config.tooltip);
//		if (!config.absolute) {
			if (config.x != undefined)
				this.setX(config.x);
			if (config.y != undefined)
				this.setY(config.y);
//			var x = config.x || 0;
//			var y = config.y || 0;
//			this.setLocation(x, y);
//		}
		if (config['background-color'] != undefined)
			this.setStyle('background-color', config['background-color']);
		
		if (config.extclasses) {
			var cls = config.extclasses.split(',');
			for(var i=0; i<cls.length; i++) {
				this.access().addClass(cls[i]);
			}
		}

		if (config.width != undefined)
			this.setWidth(config.width);
		if (config.height != undefined)
			this.setHeight(config.height);
		
		if (config.custom != undefined) {
			for (var i in config.custom) {
				this.setStyle(i, config.custom[i]);
			}
		}
	},
	
	/**
	 * Change width of component
	 * @param {String|Number} w new width of component
	 */
	setWidth: function(w) {
		if (!isNaN(w) && w != '') {
			w = parseFloat(w);
			w += this.roundDeltaW;
			this.roundDeltaW = w - Math.floor(w);
			w = Math.floor(w);
		}
		this.setStyle('width', w);
	},

	/**
	 * Change height of component
	 * @param {String|Number} h new height of component
	 */
	setHeight: function(h) {
		if (!isNaN(h) && h != '') {
			h = parseFloat(h);
			h += this.roundDeltaH;
			this.roundDeltaH = h - Math.floor(h);
			h = Math.floor(h);
		}
		this.setStyle('height', h);
	},

	/**
	 * Get current width of component (without border, outline & margin)
	 * @returns {String|Number} width of component
	 */
	getWidth: function() {
		return this.access().width();
	},

	/**
	 * Get current height of component (without border, outline & margin)
	 * @returns {String|Number} height of component
	 */
	getHeight: function() {
		return this.access().height();
	},

	/**
	 * Get the current location of component
	 * @returns {Object} location of component
	 */
	getLocation: function() {
		return {x: this.getX(), y: this.getY()};
	},

	/**
	 * Change the location of component
	 * @param {String|Number} x new x coordinate
	 * @param {String|Number} y new y coordinate
	 */
	setLocation: function(x, y) {
		this.setX(x);
		this.setY(y);
	},
	
	/**
	 * Get the current x position of component
	 * @returns {String|Number} current x position
	 */
	getX: function() {
		var left = this.getStyle("left");
		if (left.length > 2)
			left = parseFloat(left.substr(0, left.length-2));
		if (isNaN(left))
			return this.access().position().left;
		return left;
	},
	
	/**
	 * Change the x position of component 
	 * @param {Number} the current x position 
	 */
	setX: function(x) {
		x = parseFloat(x);
		if (isNaN(x)) return;
		x += this.roundDeltaX;
		this.roundDeltaX = x - Math.floor(x);
		this.setStyle('left', Math.floor(x)+'px');
	},
	
	/**
	 * Get the current y position of component
	 * @returns {String|Number} current y position
	 */
	getY: function() {
		var top = parseFloat(this.getStyle('top'));
		if (top.length > 2)
			top = parseFloat(top.substr(0, top.length-2));
		if (isNaN(top))
			return this.access().position().top;
		return top;
	},
	
	/**
	 * Change the y position of component 
	 * @param {Number} the current y position 
	 */
	setY: function(y) {
		y = parseFloat(y);
		if (isNaN(y)) return;
		y += this.roundDeltaY;
		this.roundDeltaY = y - Math.floor(y);
		this.setStyle('top', Math.floor(y)+'px');
	},
	
	/**
	 * Get current rotation angle
	 * @returns {Number} current rotation (in degree)
	 */
	getRotation: function() {
		return this.rotation;
	},

	/**
	 * Change the rotation angle
	 * @param {Number} r the new rotation angle in degree
	 */
	setRotation: function(r) {
		this.rotation = r;
		this.setCSS3Style('transform', 'rotate('+r+'deg)');
	},
	
	/**
	 * Change DOM attribute
	 * @param {String} attrName the attribute name
	 * @param {String} value the attribute value
	 */
	setAttribute: function(attrName, value) {
		this.access().attr(attrName, value);
	},

	/**
	 * Get value of a DOM attribute
	 * @param attrName the attribute name
	 * @returns {String} the attribute value
	 */
	getAttribute: function(attrName) {
		return this.access().attr(attrName);
	},

	/**
	 * Get all DOM attributes mapped by name
	 * @returns {Object} the attributes map
	 */
	getAttributes: function() {
		return JOOUtils.getAttributes(this.access()[0]);
	},

	/**
	 * Remove a DOM attribute
	 * @param {String} name the attribute name
	 */
	removeAttribute: function(name) {
		this.access().removeAttr(name);
	},
	
	/**
	 * Whether a DOM attribute exists
	 * @param {String} name the attribute name
	 * @returns {Boolean} <code>true</code> if the attribute exists, otherwise returns <code>false</code>
	 */
	hasAttribute: function(name) {
		return this.access().attr(name) != undefined;
	},

	/**
	 * Change a style
	 * @param {String} k the style name
	 * @param {String} v the style value
	 * @param {Boolean} silent whether event is omitted or dispatched
	 */
	setStyle: function(k, v, silent) {
		if (silent)
			this.access().silentCss(k, v);
		else
			this.access().css(k, v);
	},

	/**
	 * Get value of a style
	 * @param {String} k the style name
	 * @returns {String} the style value
	 */
	getStyle: function(k) {
		return this.access().css(k);
	},

	/**
	 * Get the computed value of a style
	 * @param {String} k the style name 
	 * @returns {String} the style computed value
	 */
	getComputedStyle: function(k) {
		var s = this.access().getStyleObject()[k];
		if (s == undefined)
			return this.getStyle(k);
		return s;
	},
	
	/**
	 * Change a CSS3 style.
	 * It works by adding CSS3-prefixes to the style name
	 * @param {String} k the style name
	 * @param {String} v the style value
	 */
	setCSS3Style: function(k, v) {
		this.setStyle(k, v);
		this.setStyle('-ms-'+k, v);
		this.setStyle('-webkit-'+k, v);
		this.setStyle('-moz-'+k, v);
		this.setStyle('-o-'+k, v);
	},
	
	getScale: function() {
		return { scaleX: this.scaleX, scaleY:this.scaleY };
	},
	
	setScaleX: function(x, time) {
		if (time == undefined) time = 0;
		this.scaleX = x;
		this.access().effect('scale', { percent: x*100, direction: 'horizontal' }, time);
	},
	
	setScaleY: function(y, time) {
		if (time == undefined) time = 0;
		this.scaleY = y;
		this.access().effect('scale', { percent: y*100, direction: 'vertical' }, time);
	},
	
	setScale: function(s, time) {
		if (time == undefined) time = 0;
		this.access().effect('scale', { percent: s*100, direction: 'both' }, time);
	},
	
	getId: function() {
		return this.id;
	},
	
	/**
	 * Get the corresponding Resource object.
	 * @returns {Resource} the Resource object
	 */
	access: function() {
		return this.domObject;
	},

	/**
	 * Specify HTML content of current component.
	 * Subclass can override this method to specify its own content
	 * @returns {String}
	 */
	toHtml: function() {
		return "";
	},
	
	applyFont: function(font){
		if(font.fontFamily){
			this.setStyle("font-family", font.fontFamily);
		}
		
		if (font.fontSize) {
			this.setStyle('font-size', font.fontSize);
		}
		
		if(font.bold) {
			this.setStyle("font-weight", "bold");
		}

		if(font.italic || font.underline) {
			var font_style = "";
			if(font.italic){
				font_style += "italic ";
			}
			if(font.underline){
				font_style += "underline";
			}
			this.setStyle("font-style", font_style);
		}
		if(font.color){
			this.setStyle("color",font.color);
		}
	},

	/**
	 * Dispose the current component.
	 * <p>It is not intended to be used by developers, as this method
	 * does not remove the current component from its parent's <code>children</code> array.
	 * Developers should use the <code>selfRemove</code> method instead.</p>
	 * @private
	 */
	dispose: function(skipRemove) {
		this.dispatchEvent('dispose');
		
		if (!skipRemove) {
			this.access().remove();
		}
//		var objMgr = SingletonFactory.getInstance(Application).getObjectManager();
//		objMgr.remove(this);
		this.listeners = undefined;
		this.config = undefined;
		this.dead = true;
		
		//if (this.domEventBound != undefined) {
			//for(var i in this.domEventBound) {
				//this.access().unbind(i, this.bindEvent);
			//}
			//this.access().unbind();
			this.domEventBound = undefined;
		//}
		this._parent = undefined;
		this.domObject = undefined;
		this.stage = undefined;
	},
	
	/**
	 * Dispose the current component and remove reference from its parent.
	 * This method can be called by developers.
	 * <p>Note that developers must also remove any extra references before
	 * disposing a component to prevent memory leaks</p>
	 */
	selfRemove: function() {
		if (this._parent != undefined)
			this._parent.removeChild(this);
		else
			this.dispose();
	},
	
	/**
	 * Enable/Disable current component. 
	 * Disabled component itself can still dispatch events but all of its
	 * event listeners are disabled
	 * @param {Boolean} disabled whether disable or enable the component
	 */
	disable: function(disabled) {
		//TODO check if the disabled flag is actually changed
		this._super(disabled);
		if (disabled) {
			this.access().addClass('disabled');
			this.setAttribute('disabled', 'disabled');
		} else {
			this.dispatchEvent('stageUpdated');
			this.access().removeClass('disabled');
			this.removeAttribute('disabled');
		}
	},
	
	toString: function() {
		return this.className;
	}
});

/**
 * This class is abstract and should be subclassed.
 * @class Base class for containers. A container is a component 
 * which contains other components.
 * <p>It supports additional configuration parameters:</p>
 * <ul>
 * 	<li><code>layout</code> The layout of current component. See <code>setLayout</code> method</li>
 * </ul>
 * @augments DisplayObject
 */
DisplayObjectContainer = DisplayObject.extend(
/**
 * @lends DisplayObjectContainer#
 */
{
	updateStage: function(stage) {
		this._super(stage);
		for(var i=0; i<this.children.length; i++) {
			this.children[i].updateStage(this.stage);
		}
	},
	
	setupBase: function(config)	{
		this.children = new Array();
		this._super(config);
	},
	
	setupDomObject: function(config) {
		this._super(config);
		if (config.layout == undefined)
			config.layout = 'block';
		this.setLayout(config.layout);
	},
	
	disable: function(disabled) {
		for(var i=0; i<this.children.length; i++) {
			this.children[i].disable(disabled);
		}
		this._super(disabled);
	},
	
	changeTransformOrigin: function(option) {
		if (this.transformOrigin == option) return;
		var pos = this.transformedOffset();
		var selfPos = this.virtualNontransformedOffset();
		var deltaX = pos.x - selfPos.x;
		var deltaY = pos.y - selfPos.y;
		
		switch (option) {
			case 'topLeft':{
				this.setStyle('-webkit-transform-origin', '0 0');
				this.setLocation(this.getX() + deltaX, this.getY() + deltaY);
				break;
			}
			case 'center': {
				this.setStyle('-webkit-transform-origin', "50% 50%");
				this.setLocation(this.getX() - deltaX, this.getY() - deltaY);
				break;
			}
			default: return;
		}
		this.transformOrigin = option;
	},
	
	getRotationCenterPoint: function() {
		var selfPos = this.offset();
		var width = parseFloat(this.getWidth());
		var height = parseFloat(this.getWidth());
		return getPositionFromRotatedCoordinate({
			x : width * this.rotationCenter.x,
			y : height * this.rotationCenter.y
		}, 0, selfPos);
	},
	
	/**
	 * Offset (top-left coordinate) relative to the document 'as if' the object is not transformed
	 * @private
	 */
	virtualNontransformedOffset: function() {
		var width = parseFloat(this.getWidth());
		var height = parseFloat(this.getHeight());
		return getPositionFromRotatedCoordinate({
			x : -width * this.rotationCenter.x,
			y : -height * this.rotationCenter.y
		}, 0, this.getRotationCenterPoint());
	},

	/**
	 * Offset (top-left coordinate) relative to the document assuming the object is transformed
	 * @private
	 */
	transformedOffset: function() {
		var width = parseFloat(this.getWidth());
		var height = parseFloat(this.getHeight());
		return getPositionFromRotatedCoordinate({
			x : -width * this.rotationCenter.x,
			y : -height * this.rotationCenter.y
		}, this.getRotation() * Math.PI / 180, this.getRotationCenterPoint());
	},
	
	/**
	 * Same as virtualNontransformedOffset
	 * @private
	 */
	offset: function() {
		var x = 0, y = 0;
		var obj = document.getElementById(this.getId());
		if(obj) {
			x = obj.offsetLeft;
			y = obj.offsetTop;
			var body = document.getElementsByTagName('body')[0];
			while(obj.offsetParent && obj != body) {
				x += obj.offsetParent.offsetLeft;
				y += obj.offsetParent.offsetTop;
				obj = obj.offsetParent;
			}
		}
		return {
			x: x,
			y: y
		};
	},

	/**
	 * Add a component before a Resource object.
	 * @param {DisplayObject} obj the component to be added 
	 * @param {Resource} positionObj the Resource object
	 */
	addChildBeforePosition: function(obj, positionObj)	{
		this._prepareAddChild(obj);
		obj.access().insertBefore(positionObj);
		obj.updateStage(this.stage);
	},
	
	/**
	 * Add a component at the end of current container.
	 * @param {DisplayObject} obj the component to be added 
	 */
	addChild: function(obj)	{
		this._prepareAddChild(obj);
		obj.access().appendTo(this.access());
		obj.updateStage(this.stage);
	},
	
	_prepareAddChild: function(obj) {
		this.children.push(obj);
		if (obj._parent != undefined)
			obj._parent.detachChild(obj);
		obj._parent = this;
	},
	
	/**
	 * Remove a child component.
	 * @param {DisplayObject} object the component to be removed
	 */
	removeChild: function(object)	{
		for(var i=0;i<this.children.length;i++)	{
			var obj = this.children[i];
			if (obj.getId() == object.getId())	{
				this.children.splice(i, 1);
				object.dispose();
			}
		}
	},
	
	/**
	 * Remove a child component at specific index. 
	 * @param {Number} index the index of the component to be removed
	 */
	removeChildAt: function(index) {
		var object = this.children[index];
		this.children.splice(index, 1);
		object.dispose();
	},
	
	removeAllChildren: function() {
		for(var i=this.children.length-1; i>=0; i--) {
			this.children[i].dispose();
		}
		this.children = Array();
	},

	/**
	 * Detach (but not dispose) a child component.
	 * The component will be detached from DOM, but retains
	 * its content, listeners, etc.
	 * @param {DisplayObject} object the object to be detached
	 */
	detachChild: function(object)	{
		for(var i=0;i<this.children.length;i++)	{
			var obj = this.children[i];
			if (obj.getId() == object.getId())	{
				this.children.splice(i, 1);
				obj.access().detach();
				obj._parent = undefined;
			}
		}
	},

	/**
	 * Get all children of the container.
	 * @returns {Array} an array of this container's children
	 */
	getChildren: function()	{
		return this.children;
	},
	
	/**
	 * Get a child component with specific id.
	 * @param {Number} id the id of the child component
	 * @returns {DisplayObject} the child component with specified id
	 */
	getChildById: function(id) {
		for(var i in this.children) {
			if (this.children[i].getId() == id)
				return this.children[i];
		}
		return undefined;
	},
	
	/**
	 * Change the layout of this container.
	 * <p>Supported layouts are:</p>
	 * <ul>
	 * 	<li><code>absolute</code>: All children have absolute position</li>
	 * 	<li><code>flow</code>: All children have relative position</li>
	 * 	<li><code>vertical</code>: All children have block display</li>
	 * </ul>
	 * @param {String} layout new layout
	 */
	setLayout: function(layout) {
		if (this.layout != undefined)
			this.access().removeClass('joo-layout-'+this.layout);
		this.access().addClass('joo-layout-'+layout);
		this.layout = layout;
	},
	
	dispose: function(skipRemove) {
		for(var i=0;i<this.children.length;i++) {
			this.children[i].dispose(true);
		}
		this.children = undefined;
		this._super(skipRemove);
	}
});

/**
 * @class A component with custom HTML.
 * <p>It supports additional configuration parameters:</p>
 * <ul>
 * 	<li><code>html</code> Custom HTML</li>
 * </ul>
 * @augments DisplayObjectContainer
 */
CustomDisplayObject = DisplayObjectContainer.extend({

	setupDomObject: function(config) {
		this.domObject = JOOUtils.accessCustom(config.html);
	}
});

/**
 * @class A component into which can be painted.
 * @augments DisplayObject
 */
Graphic = DisplayObject.extend(
/** @lends Graphic# */
{
	
	setupDomObject: function(config) {
		this._super(config);
		this.repaint(config.html);
	},
	
	/**
	 * Clear & repaint the component.
	 * @param {String} html content to be repainted
	 */
	repaint: function(html) {
		this.access().html(html);
	},
	
	/**
	 * Paint (append) specific content to the component.
	 * @param {String} html content to be painted
	 */
	paint: function(html) {
		this.access().append(html);
	},

	/**
	 * Clear the current content.
	 */
	clear: function() {
		this.access().html("");
	},
	
	toHtml: function() {
		return "<div></div>";
	}
});

/**
 * Create a new Sketch
 * @class A concrete subclass of DisplayObjectContainer.
 * It is a counterpart of <code>HTML DIV</code> element
 * @augments DisplayObjectContainer
 */
Sketch = DisplayObjectContainer.extend(
/** @lends Sketch# */
{
	setupDomObject: function(config) {
		this._super(config);
	},
	
	toHtml: function()	{
		return "<div></div>";
	}
});

/**
 * Create a new Panel
 * @class A panel, which has a <code>inline-block</code> display
 * @augments Sketch
 */
Panel = Sketch.extend({
	
});

ContextableInterface = InterfaceImplementor.extend({
	
	implement: function(obj) {
		obj.prototype.setupContextMenu = obj.prototype.setupContextMenu || function() {
			if (!this.contextMenu) {
				this.contextMenu = new JOOContextMenu();
			}
		};
		
		obj.prototype.getContextMenu = obj.prototype.getContextMenu || function() {
			return this.contextMenu;
		};
		
		obj.prototype.contextMenuHandler = obj.prototype.contextMenuHandler || function(e) {
			e.preventDefault();
			this.getContextMenu().show(e.clientX+2, e.clientY+2);
			this.dispatchEvent("showContextMenu", e);
		};
		
		obj.prototype.attachContextMenu = obj.prototype.attachContextMenu || function(useCapturePhase) {
			this.addChild(this.contextMenu);
			this.contextMenu.hide();
			this.addEventListener('contextmenu', function(e) {
				this.contextMenuHandler(e);
				e.stopPropagation();
			}, useCapturePhase);
			this.getContextMenu().addEventListener('click', function(e) {
				e.stopPropagation();
			}, useCapturePhase);
		};
	}
});

/**
 * @class Abstract base class for other UI controls. All UIComponent subclasses
 * is equipped with a {@link JOOContextMenu}
 * @augments DisplayObjectContainer
 */
UIComponent = DisplayObjectContainer.extend({
	
	setupDomObject: function(config) {
		this._super(config);
		this.setupContextMenu();
	},
	
	toHtml: function() {
		return "<div></div>";
	}
}).implement(ContextableInterface);

UIRenderInterface = InterfaceImplementor.extend({
	
	implement: function(obj) {
		obj.prototype.render = obj.prototype.render || function() {
			tmpl('UI-'+obj.className, obj.config);
		};
	}
});

/**
 * @class The Stage is a special UI component, which hosts, manages selection 
 * and renders other UI components
 * <p>It supports additional configuration parameters:</p>
 * <ul>
 * 	<li><code>allowMultiSelect</code> whether multi-selection is allowed</li>
 * </ul>
 * @augments UIComponent
 */
Stage = UIComponent.extend(
/** @lends Stage# */
{
	setupBase: function(config)	{
		this.stage = this;
		this.id = config.id;
		this.allowMultiSelect = config.allowMultiSelect || true;
		this.selectedObjects = Array();
		this._super(config);
	},
	
	/**
	 * Get a list of current selected objects.
	 * @returns {Array} current selected objects
	 */
	getSelectedObjects: function() {
		return this.selectedObjects;
	},
	
	/**
	 * Delete all selected objects.
	 */
	deleteSelectedObjects: function() {
		for(var i=0;i<this.selectedObjects.length;i++) {
			this.selectedObjects[i].stageDeselect();
			this.selectedObjects[i].selfRemove();
		}
		this.selectedObjects = Array();
		this.dispatchEvent('selectedChange');
	},

	/**
	 * Deselect specific selected object.
	 * <p>Usually developers should use the {@link SelectableInterface} 
	 * rather than calling this method directly
	 * </p>
	 * @param {SelectableInterface} obj the object to be deselected.
	 * It <b>should</b> be a selected object.
	 */
	removeSelectedObject: function(obj) {
		if (typeof obj['stageDeselect'] == 'undefined')
			throw 'Object '+obj+' is not deselectable';
		var index = this.selectedObjects.indexOf(obj);
		if (index != -1) {
			obj.selected = false;
			obj.stageDeselect();
			this.selectedObjects.splice(index, 1);
			this.dispatchEvent('selectedChange');
/*			
			var subject = SingletonFactory.getInstance(Subject);
			subject.notifyEvent('ObjectDeselected', obj);*/
		}
	},
	
	/**
	 * Deselect all objects, which is previously selected under this Stage.
	 */
	deselectAllObjects: function() {
		for(var i=0;i<this.selectedObjects.length;i++) {
			this.selectedObjects[i].stageDeselect();
		}
		this.selectedObjects = Array();
		this.dispatchEvent('selectedChange');
		
/*		var subject = SingletonFactory.getInstance(Subject);
		subject.notifyEvent('AllObjectDeselected');*/
	},

	/**
	 * Add a component to the list of selected objects.
	 * It will call the <code>stageSelect</code> method
	 * of the component automatically.
	 * <p>
	 * If either <code>isMultiSelect</code> or <code>allowMultiSelect</code>
	 * is <code>false</code>, previously selected objects will be deselected.
	 * </p>
	 * @param {SelectableInterface} obj the object to selected
	 * @param {Boolean} isMultiSelect whether this selection is a multi-selection
	 */
	addSelectedObject: function(obj, isMultiSelect) {
		if (typeof obj['stageSelect'] == 'undefined')
			throw 'Object '+obj+' is not selectable';
		if (this.selectedObjects.indexOf(obj) != -1)
			return;
		
		if (isMultiSelect == undefined) isMultiSelect = false;
		if (!this.allowMultiSelect || !isMultiSelect) {
			this.deselectAllObjects();
		}
		obj.selected = true;
		obj.stageSelect();
		this.selectedObjects.push(obj);
		this.dispatchEvent('selectedChange');
		
		var subject = SingletonFactory.getInstance(Subject);
		subject.notifyEvent('ObjectSelected', obj);
	},
	
	setupDomObject: function(config) {
		this.domObject = JOOUtils.access(this.id);
		this.access().addClass('joo-'+this.className.toLowerCase());
		this.access().addClass('joo-uicomponent');

		if (config.layout == undefined)
			config.layout = 'block';
		this.setLayout(config.layout);
		this.setupContextMenu();
	}
});

/**
 * Create a new Canvas
 * @class A counterpart of <code>HTML5 Canvas</code>
 * @augments DisplayObject
 */
Canvas = DisplayObject.extend({
	
	setupBase: function(config)	{
		this.context = undefined;
		this._super(config);
	},
	
	getContext: function()	{
		if(this.context == undefined){
			this.context = new CanvasContext(this, "2d");
		}
		return this.context;
	},
	
	setWidth: function(width) {
		this.setAttribute('width', width);
	},
	
	setHeight: function(height) {
		this.setAttribute('height', height);
	},
	
	getWidth: function() {
		return this.getAttribute('width');
	},
	
	getHeight: function() {
		return this.getAttribute('height');
	},
	
	toHtml: function(){
		return "<canvas>Sorry, your browser does not support canvas</canvas>";
	}
});

/*
 * CanvasContext
 */
CanvasContext = Class.extend({
    
	init: function(canvas, dimension){
        if (canvas.access().length == 0) {
            throw Error("From CanvasContext constructor: cannot init canvas context");
        }
        this.canvas = canvas;
        if (dimension == undefined) {
            dimension = "2d";
        }
        this.dimension = dimension;
        this.context = document.getElementById(canvas.getId()).getContext(dimension);
    },
    
    setTextAlign: function(align) {
    	this.context.textAlign = align;
    },
    
    /*
     * get&set fillStyle
     */
    setFillStyle: function(color){
        this.context.fillStyle = color;
    },
    
    getFillStyle: function(){
        return this.context.fillStyle;
    },
    
    /*
     * get&set strokeStyle
     */
    setStrokeStyle: function(color){
        this.context.strokeStyle = color;
    },
    
    getStrokeStyle: function(){
        return this.context.strokeStyle;
    },
    
    /*
     * get&set globalAlpha
     */
    setGlobalAlpha: function(alpha){
        this.context.globalAlpha = alpha;
    },
    
    getGlobalAlpha: function(){
        return this.context.globalAlpha;
    },
    /*
     * get&set lineWidth
     */
    setLineWidth: function(w){
        this.context.lineWidth = w;
    },
    
    getLineWidth: function(){
        return this.context.lineWidth;
    },
    
    /*
     * get&set lineCap
     */
    setLineCap: function(cap){
        this.context.lineCap = cap;
    },
    
    getLineCap: function(){
        return this.context.lineCap;
    },
    
    /*
     * get&set lineJoin
     */
    setLineJoin: function(j){
        this.context.lineJoin = j;
    },
    
    getLineJoin: function(){
        return this.context.lineJoin;
    },
    
    /*
     * get&set shadowOffsetX
     */
    setShadowOffsetX: function(x){
        this.context.shadowOffsetX = x;
    },
    
    getShadowOffsetX: function(){
        return this.context.shadowOffsetX;
    },
    
    /*
     * get&set shadowOffsetY
     */
    setShadowOffsetY: function(y){
        this.context.shadowOffsetY = y;
    },
    
    getShadowOffsetY: function(){
        return this.context.shadowOffsetY;
    },
    
    /*
     * get&set shadowBlur
     */
    setShadowBlur: function(blur){
        this.context.shadowBlur = blur;
    },
    
    getShadowBlur: function(){
        return this.context.shadowBlur;
    },
    
    /*
     * get&set shadowColor
     */
    setShadowColor: function(color){
        this.context.shadowColor = color;
    },
    
    getShadowColor: function(){
        return this.context.shadowColor;
    },
    
    /*
     * get&set globalCompositeOperation
     */
    setGlobalCompositeOperation: function(v){
        this.context.globalCompositeOperation = v;
    },
    
    getGlobalCompositeOperation: function(){
        return this.context.globalCompositeOperation;
    },
    
    clearRect: function(x,y,width,height){
    	this.context.clearRect(x,y,width,height);
    },
    
    fillRect: function(x, y, w, h){
        this.context.fillRect(x, y, w, h);
    },
    
    strokeRect: function(x, y, w, h){
        this.context.strokeRect(x, y, w, h);
    },
    
    beginPath: function(){
        this.context.beginPath();
    },
    
    closePath: function(){
        this.context.closePath();
    },
    
    stroke: function(){
        this.context.stroke();
    },
    
    fill: function(){
        this.context.fill();
    },
    
    getImageData: function(x,y,width,height){
    	return this.context.getImageData(x,y,width,height);
    },
    
    moveTo: function(x, y){
        this.context.moveTo(x, y);
    },
    
    lineTo: function(x, y){
        this.context.lineTo(x, y);
    },
    
    arc: function(x, y, radius, startAngle, endAngle, anticlockwise){
        this.context.arc(x, y, radius, startAngle, endAngle, anticlockwise);
    },
    
    quadraticCurveTo: function(cp1x, cp1y, x, y){
        this.context.quadraticCurveTo(cp1x, cp1y, x, y);
    },
    
    bezierCurveTo: function(cp1x, cp1y, cp2x, cp2y, x, y){
        this.context.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
    },
    
    drawRoundedRect: function(x, y, width, height, radius){
        var ctx = this.context;
        ctx.beginPath();
        ctx.moveTo(x, y + radius);
        ctx.lineTo(x, y + height - radius);
        ctx.quadraticCurveTo(x, y + height, x + radius, y + height);
        ctx.lineTo(x + width - radius, y + height);
        ctx.quadraticCurveTo(x + width, y + height, x + width, y + height - radius);
        ctx.lineTo(x + width, y + radius);
        ctx.quadraticCurveTo(x + width, y, x + width - radius, y);
        ctx.lineTo(x + radius, y);
        ctx.quadraticCurveTo(x, y, x, y + radius);
        ctx.stroke();
        ctx.closePath();
    },
	
	drawCircle: function(x, y, radius){
		var ctx = this.context;
		ctx.beginPath();
		ctx.arc(x,y,radius,0,Math.PI*2,true);
		if(ctx.fillStyle != undefined){
			ctx.fill();
		}
		if(ctx.strokeStyle != undefined){
			ctx.stroke();
		}
		ctx.closePath();
	},
	
	drawImage: function(){
		var ctx = this.context;
		ctx.drawImage.apply(ctx, arguments);
	},
    
    createLinearGradient: function(x1, y1, x2, y2){
        return this.context.createLinearGradient(x1, y1, x2, y2);
    },
    
    createRadialGradient: function(x1, y1, r1, x2, y2, r2){
        return this.context.createRadialGradient(x1, y1, r1, x2, y2, r2);
    },
    
    createPattern: function(image, type){
        return this.context.createPattern(image, type);
    },
    
    save: function(){
        this.context.save();
    },
    
    restore: function(){
        this.context.restore();
    },
    
    rotate: function(angle){
        this.context.rotate(angle);
    },
    
    scale: function(x, y){
        this.context.scale(x, y);
    },
    
    transform: function(m11, m12, m21, m22, dx, dy){
        this.context.transform(m11, m12, m21, m22, dx, dy);
    },
    
    setTransform: function(m11, m12, m21, m22, dx, dy){
        this.context.setTransform(m11, m12, m21, m22, dx, dy);
    },
    
    clip: function(){
        this.context.clip();
    },
    
    setFont: function(font){
    	var fstr = "";
    	if(font.getBold()){
    		fstr += "bold ";
    	}
    	if(font.getItalic()){
    		fstr += "italic ";
    	}
		this.context.fillStyle = font.getColor();
    	fstr += font.getFontSize()+" ";
    	fstr += font.getFontFamily();
    	this.context.font = fstr;
    },
    
    getFont: function(){
    	var font = new Font();
    	fstr = this.context.font;
    	if(fstr.indexOf("bold") != -1 || fstr.indexOf("Bold") != -1){
    		font.setBold(true);
    	}
    	if(fstr.indexOf("italic") != -1 || fstr.indexOf("Italic") != -1){
    		font.setItalic(true);
    	}
    	var fontSize = fstr.match(/\b\d+(px|pt|em)/g);
    	if(fontSize!=null && fontSize.length > 0){
    		font.setFontSize(fontSize[0]);
    	}
    	var fontFamily = fstr.match(/\b\w+,\s?[a-zA-Z-]+\b/g);
    	if(fontFamily!=null && fontFamily.length >0){
    		font.setFontFamily(fontFamily[0]);
    	}
    	return font;
    },
    
    getTextWidth: function(text){
    	return this.context.measureText(text).width;
    },
    
    getTextHeight: function(text){
    	//return this.context.measureText(text).width;
    	throw "not yet implemented";
    },
    
    fillText: function(text,x,y,maxWidth){
    	if(maxWidth != undefined){
	    	this.context.fillText(text,x,y,maxWidth);
		}else{
			this.context.fillText(text,x,y);
		}
    },
    
    strokeText: function(text,x,y,maxWidth){
		if(maxWidth != undefined){
			this.context.strokeText(text,x,y,maxWidth);
		}else{
			this.context.strokeText(text,x,y);
		}	
    }
});

/**
 * @class A counterpart of <code>HTML HR</code> element
 * @augments DisplayObject 
 */
Separator = DisplayObject.extend({
	
	toHtml: function() {
		return "<hr />";
	}
});this.items = new Array();

/**
 * @class A menu item, which is attached with a command and 
 * can be added to a {@link JOOMenu} or {@link JOOContextMenu}
 * <p>It supports additional configuration parameters:</p>
 * <ul>
 * 	<li><code>command</code> A function which is called automatically when
 * 		the menu item is clicked
 * 	</li>
 * </ul>
 * @augments Sketch 
 */
JOOMenuItem = Sketch.extend(
/** @lends JOOMenuItem# */		
{
	
	setupDomObject: function(config) {
		this._super(config);
		if (config.lbl == undefined) {
			config.lbl = this.id;
		}
		this._outputText(config.lbl);
		if (config.command != undefined)
			this.onclick = config.command;
		this.addEventListener('click', this.onclick);
	},
	
	_outputText: function(label) {
		this.access().html(label);
	},

	/**
	 * The default command, if no command is attached to this menu
	 * @param e
	 */
	onclick: function(e) {}
});

/**
 * @class A group of menu items or menus. Like its superclass {@link JOOMenuItem},
 * a menu can be attached with a command
 * <p>It supports additional configuration parameters:</p>
 * <ul>
 * 	<li><code>icon</code> The icon of the menu</li>
 * </ul>
 * @augments JOOMenuItem
 */
JOOMenu = JOOMenuItem.extend(
/** @lends JOOMenu# */
{
	
	setupBase: function(config) {
		this.items = new Array();
		this._super(config);
	},
	
	setupDomObject: function(config) {
		this._super(config);
		this.menuHolder = new Sketch();
		this.addChild(this.menuHolder);
		this.menuHolder.access().hide();
		this.menuHolder.access().addClass('joo-menu-holder');
		this.isShown = false;
		this.access().removeClass('joo-joomenuitem');
	},

	_outputText: function(label) {
		if (this.config.icon != undefined)
			this.access().html('<a class="joo-menu-label"><img title="'+label+'" src="'+this.config.icon+'" /><span>'+label+'</span></a>');
		else
			this.access().html('<a class="joo-menu-label">'+label+'</a>');
	},
	
	/**
	 * Add a menu item or another menu to this menu
	 * @param {JOOMenuItem|JOOMenu} item the item to be added
	 */
	addItem: function(item) {
		this.items.push(item);
		this.menuHolder.addChild(item);
	},

	/**
	 * Get all menu items and submenus
	 * @returns {Array} an array of menu items & submenus
	 */
	getItems: function() {
		return this.items;
	},
	
	onclick: function() {
		e.stopPropagation();
		this.toggleMenuItems();
	},

	/**
	 * Toggle (show/hide) menu items
	 */
	toggleMenuItems: function() {
		if (this.isShown)
			this.hideMenuItems();
		else
			this.showMenuItems();
	},

	/**
	 * Show all menu items
	 */
	showMenuItems: function() {
		if (this.items.length > 0) {
			this.menuHolder.access().show();
			this.access().addClass('active');
			this.isShown = true;
			this.dispatchEvent('menuShown');
		}
	},

	/**
	 * Hide all menu items
	 */
	hideMenuItems: function() {
		this.menuHolder.access().hide();
		this.access().removeClass('active');
		this.isShown = false;
		this.dispatchEvent('menuHidden');
	}
});

/**
 * @class A set of menu, which is usually placed at the top of the application
 * @augments UIComponent
 */
JOOMenuBar = UIComponent.extend(
/** @lends JOOMenuBar# */		
{
	setupBase: function(config) {
		this.items = new Array();
		this.activeMenus = 0;
		this._super(config);
	},
	
	setupDomObject: function(config) {
		this._super(config);
		$(window).bind('click', {_self: this}, this._hideAllMenus);
	},
	
	dispose: function(skipRemove) {
		$(window).unbind('click', this._hideAllMenus);
		this._super(skipRemove);
	},
	
	_hideAllMenus: function(e) {
		var _self = e.data ? e.data._self || this : this;
		_self.hideAllMenus();
	},

	/**
	 * Hide all menus and their menu items
	 */
	hideAllMenus: function() {
		for(var i=0; i<this.items.length; i++) {
			this.items[i].hideMenuItems();
		}
	},

	/**
	 * Add a new menu to the bar
	 * @param {JOOMenu} item the menu to be added
	 */
	addItem: function(item) {
		this.items.push(item);
		this.addChild(item);
		var _self = this;
		item.addEventListener('menuShown', function() {
			_self.activeMenus ++;
			_self.active = true;
		});
		item.addEventListener('menuHidden', function() {
			if (_self.activeMenus > 0)
				_self.activeMenus --;
			if (_self.activeMenus <= 0)
				_self.active = false;
		});
		item.addEventListener('mouseover', function() {
			if (_self.active) {
				_self.hideAllMenus();
				this.showMenuItems();
			}
		});
	},
	
	/**
	 * Get all menus of the bar
	 * @returns {Array} an array of menus this bar contains
	 */
	getItems: function() {
		return this.items;
	}
});

/**
 * @class A context (or popup) menu. It can be attached to any other components
 * @augments Sketch
 */
JOOContextMenu = Sketch.extend({
	
	setupBase: function(config)	{
		this.items = new Array();
		this._super(config);
	},

	/**
	 * Add a menu item
	 * @param {JOOMenuItem} item a menu item to be added
	 */
	addItem: function(item) {
		this.items.push(item);
		var _self = this;
		item.addEventListener('click', function() {
			_self.hide();
		});
		this.addChild(item);
	},

	/**
	 * Get all menu items
	 * @returns {Array} an array of menu items of this context menu
	 */
	getItems: function() {
		return this.items;
	},

	/**
	 * Show the context menu at specific position
	 * @param {String|Number} x x position
	 * @param {String|Number} y y position
	 */
	show: function(x, y) {
		var subject = SingletonFactory.getInstance(Subject);
		subject.notifyEvent('ContextMenuShown', this);
		this.setLocation(x, y);
		this.access().show();
	},
	
	/**
	 * Hide the context menu
	 */
	hide: function() {
		var subject = SingletonFactory.getInstance(Subject);
		subject.notifyEvent('ContextMenuHidden', this);
		this.access().hide();
	}
});

/**
 * @class A counterpart of <code>HTML IFRAME</code> element
 * <p>It supports additional configuration parameters:</p>
 * <ul>
 * 	<li><code>src</code> The source of the iframe</li>
 * </ul>
 * @augments Sketch
 */
JOOIFrame = Sketch.extend(
/** @lends JOOIFrame# */		
{
	setupBase: function(config) {
		this._super(config);
	},
	
	setupDomObject: function(config) {
		this._super(config);
		if (config.src)
			this.setAttribute('src', config.src);
		this.setAttribute('name', this.getId());
	},
	
	/**
	 * Change source of the iframe
	 * @param {String} src new source (URL) of the iframe
	 */
	setSrc: function(src) {
		this.setAttribute('src', src);
	},

	/**
	 * Get the source of the iframe
	 * @returns {String} the source of the iframe
	 */
	getSrc: function() {
		return this.getAttribute('src');
	},
	
	toHtml: function() {
		return "<iframe></iframe>";
	}
});

/**
 * @class A counterpart of <code>HTML Form</code>
 * <p>It supports additional configuration parameters:</p>
 * <ul>
 * 	<li><code>method</code> The method used when submitting the form</li>
 * 	<li><code>encType</code> The encoded type, the default type is <code>application/x-www-form-urlencoded</code></li>
 * </ul>
 * @augments Sketch
 */
JOOForm = Sketch.extend(
/** @lends JOOForm# */
{
	
	setupDomObject: function(config) {
		this._super(config);
		config.method = config.method || "post";
		config.encType = config.encType || "application/x-www-form-urlencoded";
		this.setAttribute("method", config.method);
		this.setAttribute("enctype", config.encType);
	},

	/**
	 * Submit the form
	 */
	submit: function() {
		this.access().submit();
	},
	
	toHtml: function() {
		return "<form></form>";
	}
});

ContainerWrapper = Class.extend({
	
	wrap: function(container, obj) {
		container.addChild(obj);
		return container;
	}
});
/**
 * @class An interface which allows UI Component to be selectable.
 * @interface
 */
SelectableInterface = InterfaceImplementor.extend({
	
	implement: function(obj) {
		
		/**
		 * A protected method, define the behavior of the selection.
		 * By default, it does nothing. Subclass can override it to
		 * change the behavior.
		 */
		obj.prototype._select = obj.prototype._select || function() {};
		
		/**
		 * A protected method, define the behavior of the de-selection.
		 * By default, it does nothing. Subclass can override it to
		 * change the behavior.
		 */
		obj.prototype._deselect = obj.prototype._deselect || function() {};
		
		/**
		 * Select the component. Add the component to the stage's list of selection.
		 * @methodOf SelectableInterface#
		 * @name select
		 * @param {Boolean} isMultiSelect whether this is a multi-selection
		 */
		obj.prototype.select = obj.prototype.select || function(isMultiSelect) {
			this.dispatchEvent('beforeSelected');
			if (this.blockSelect != true) {
				this.stage.addSelectedObject(this, isMultiSelect);
				this.dispatchEvent('afterSelected');
			}
		},
		
		/**
		 * Deselect the component. Remove the component from the stage's list of selection.
		 * @methodOf SelectableInterface#
		 * @name deselect
		 * @param {Boolean} isMultiSelect whether this is a multi-selection
		 */
		obj.prototype.deselect = obj.prototype.deselect || function() {
			this.stage.removeSelectedObject(this);
		},
		
		/**
		 * This method is called internally by the Stage, before the 
		 * component is actually selected.
		 * @methodOf SelectableInterface#
		 * @name stageSelect
		 */
		obj.prototype.stageSelect = obj.prototype.stageSelect || function() {
			this.access().addClass('selected');
			this._select();
			this.dispatchEvent('selected');
		},
		
		/**
		 * This method is called internally by the Stage, before the 
		 * component is actually deselected.
		 * @methodOf SelectableInterface#
		 * @name stageDeselect
		 */
		obj.prototype.stageDeselect = obj.prototype.stageDeselect || function() {
			this.access().removeClass('selected');
			this._deselect();
			this.dispatchEvent('deselected');
		};
	}
});

/**
 * @class An interface which allows UI Component to be draggable.
 * @interface
 */
DraggableInterface = InterfaceImplementor.extend({
	
	implement: function(obj){
		
		obj.prototype.onDrag = obj.prototype.onDrag || function(e) {
			
		};
		
		obj.prototype.onDragStart = obj.prototype.onDragStart || function(e) {
			
		};
		
		/**
		 * Make the component draggable. It position will be changed to absolute.
		 * @methodOf DraggableInterface#
		 * @name draggable
		 * @param {Object} param the parameters passed to the draggable engine
		 */
		obj.prototype.draggable = obj.prototype.draggable || function(param) {
			this.access().draggable(param);
			this.setStyle('position', 'absolute');
		};
		
		/**
		 * A method called before the component is dragged. Override this method
		 * to change the behavior.
		 * @methodOf DraggableInterface#
		 * @name beforeStartDragging
		 * @param e the event
		 */
		obj.prototype.beforeStartDragging = obj.prototype.beforeStartDragging || function(e) {};

		/**
		 * Enable dragging.
		 * @methodOf DraggableInterface#
		 * @name startDrag
		 * @param {Object} param the parameters passed to the draggable engine
		 */
		obj.prototype.startDrag = obj.prototype.startDrag || function(param) {
			var _self = this;
			this.setStyle('position', 'absolute');
			this.access().draggable({
				drag: function(e) {
					_self.isDragging = true;
					_self.onDrag(e);
				},
				start: function(e) {
					_self.onDragStart(e);
				},
				beforeStart: function(e) {
					_self.beforeStartDragging(e);
				}
			});
			this.access().draggable(param || "enable");
		};
		
		/**
		 * Disable dragging.
		 * @methodOf DraggableInterface#
		 * @name stopDrag
		 */
		obj.prototype.stopDrag = obj.prototype.stopDrag || function(){
			this.access().draggable("disable");
		};
	},
});

DraggableWrapper = {
	
	wrap: function(obj) {
		obj.currentClass.implement(DraggableInterface);
	}
};

/**
 * @class An interface which allows UI Component to be droppable
 * by another draggable component.
 * @interface
 */
DroppableInterface = InterfaceImplementor.extend({
	
	implement: function(obj) {

		/**
		 * Make the component droppable.
		 * @methodOf DroppableInterface#
		 * @name droppable
		 * @param {Object} param the parameters passed to the droppable engine
		 */
		obj.prototype.droppable = obj.prototype.droppable || function(param) {
			this.access().droppable(param);
			this.setLayout('absolute');
		};
	}
});

DroppableWrapper = {
	wrap: function(obj) {
		obj.currentClass.implement(DroppableInterface);
	}	
};

RotateIcon = Sketch.extend({
	
	setupBase: function(config) {
		this.container = config.container;
		this._super(config);
	},
	
	setupDomObject: function(config) {
		this._super(config);
		this.baseRotate = new Sketch();
		this.baseRotate.access().addClass("joo-base-rotate");
		this.alignRotate = new Sketch();
		this.alignRotate.access().addClass("joo-align-rotate");
		
		this.initialControlX = 50;
		this.initialControlY = 5.5;
		this.controlRotate = new Sketch();
		this.controlRotate.access().addClass("joo-control-rotate");
		this.controlRotate.setLocation(this.initialControlX, this.initialControlY);
//		DraggableWrapper.wrap(this.controlRotate);
//		this.controlRotate.draggable();
		
		var baseX = this.baseRotate.getX();
		var baseY = this.baseRotate.getY();
		var controlX = this.controlRotate.getX();
		var controlY = this.controlRotate.getY();
		if (controlX == 0) controlX = this.initialControlX;
		if (controlY == 0) controlY = this.initialControlY;
		var distance = MathUtil.getDistance({x: baseX+9, y: baseY+9}, {x: controlX+4.5, y: controlY+4.5});
		this.alignRotate.setWidth(distance);
		
		this.addChild(this.baseRotate);
		this.addChild(this.alignRotate);
		this.addChild(this.controlRotate);
		this.dragging = false;
	},
	
	registerEvent: function() {
		if (!this.dragging) {
			this.addEventListener('mousedown', function(e) {
				e.stopPropagation();
				this.container.changeTransformOrigin('center');
				$(window).bind("mousemove", {_self: this}, this.mouseMoveHandler);
				this.addEventListener("mousemove", this.mouseMoveHandler);
				this.dragging = true;
			});
		}
	},
	
	unregisterEvent: function() {
		if (this.dragging) {
			$(window).unbind("mousemove", this.mouseMoveHandler);
			this.removeEventListener("mousemove", this.mouseMoveHandler);
			this.dragging = false;
		}
	},
	
	updateArea: function(e) {
		this.newW = e.w || this.newW;
		this.newH = e.h || this.newH;
		
		var ctrlBtnOffset = -9;
		this.setLocation(this.newW/2 + ctrlBtnOffset, this.newH/2 + ctrlBtnOffset);
	},
	
	mouseMoveHandler: function(e) {
		var _self = this;
		if (e.data != undefined) {
			_self = e.data._self || this;
		}
		var baseX = _self.baseRotate.transformedOffset().x;
		var baseY = _self.baseRotate.transformedOffset().y;
		var controlX = e.pageX;
		var controlY = e.pageY;
		var angle = MathUtil.getAngle({x: baseX+9, y: baseY+9}, {x: controlX, y: controlY}, true);
		_self.dispatchEvent('areaChanged', {a: angle, base: {x: baseX+9, y: baseY+9}});
		//_self.controlRotate.setX(MathUtil.getDistance({x: baseX+9, y: baseY+9}, {x: controlX, y: controlY}));
	}
});

ResizeIcon = Sketch.extend({
	
	setupBase: function(config) {
		this.pos = config.pos;
		this.container = config.container;
		this._super(config);
	},
	
	setupDomObject: function(config) {
		this._super(config);
		this.access().addClass("unselectable");
		this.access().addClass("joo-move-icon");
		this.setStyle("cursor", this.pos+"-resize");
		this.dragging = false;
	},
	
	registerEvent: function() {
		this.addEventListener('mousedown', function(e) {
			e.stopPropagation();
			this.container.changeTransformOrigin('topLeft');
			$(window).bind("mousemove", {_self: this}, this.mouseMoveHandler);
			this.addEventListener("mousemove", this.mouseMoveHandler);
			this.dragging = true;
		});	
	},
	
	unregisterEvent: function() {
		if (this.dragging) {
			$(window).unbind("mousemove", this.mouseMoveHandler);
			this.removeEventListener("mousemove", this.mouseMoveHandler);
			this.dragging = false;
		}
	},
	
	updateArea: function(e) {
		this.newW = e.w || this.newW;
		this.newH = e.h || this.newH;
		
		var ctrlBtnOffset = -4;
		switch(this.pos) {
		case 'n':
			this.setLocation(this.newW/2 + ctrlBtnOffset, ctrlBtnOffset);
			break;
		case 'ne':
			this.setLocation(this.newW + ctrlBtnOffset, ctrlBtnOffset);
			break;
		case 'e':
			this.setLocation(this.newW + ctrlBtnOffset, this.newH/2 + ctrlBtnOffset);
			break;
		case 'se':
			this.setLocation(this.newW + ctrlBtnOffset, this.newH + ctrlBtnOffset);
			break;
		case 's':
			this.setLocation(this.newW/2 + ctrlBtnOffset, this.newH + ctrlBtnOffset);
			break;
		case 'sw':
			this.setLocation(ctrlBtnOffset, this.newH + ctrlBtnOffset);
			break;
		case 'w':
			this.setLocation(ctrlBtnOffset, this.newH/2 + ctrlBtnOffset);
			break;
		case 'nw':
			this.setLocation(ctrlBtnOffset, ctrlBtnOffset);
			break;
		default:
		}
	},
	
	mouseMoveHandler: function(e) {
		var _self = this;
		if (e.data != undefined) {
			_self = e.data._self || this;
		}
		var method = 'mouseMoveHandler' + _self.pos.toUpperCase();
		if (typeof _self[method] != 'undefined') {
			_self[method].call(_self, e);
			_self.dragging = true;
		}
	},
	
	mouseMoveHandlerN: function(e) {
		var pos = this.getContainerDeltaPosition(e);
		var angle = this.container.getRotation() * Math.PI / 180;
		var incx = pos.y * Math.sin(angle);
		var incy = pos.y * Math.cos(angle);
		this.newH = this.container.getHeight() - pos.y;
		this.dispatchEvent('areaChanged', {x: this.container.getX() - incx, y: this.container.getY() + incy, h: this.newH});
	},
	
	mouseMoveHandlerNW: function(e) {
		var pos = this.getContainerDeltaPosition(e);
		var baseOff = this.container._parent.offset();
		this.newW = this.container.getWidth() - pos.x;
		this.newH = this.container.getHeight() - pos.y;
		this.dispatchEvent('areaChanged', {x: e.pageX - baseOff.x, y: e.pageY - baseOff.y, h: this.newH, w: this.newW});
	},
	
	mouseMoveHandlerW: function(e) {
		var pos = this.getContainerDeltaPosition(e);
		var angle = this.container.getRotation() * Math.PI / 180;
		var incx = pos.x * Math.cos(angle);
		var incy = pos.x * Math.sin(angle);
		this.dispatchEvent('areaChanged', {x: this.container.getX() + incx, y: this.container.getY() + incy, w: this.container.getWidth() - pos.x});
	},
	
	mouseMoveHandlerSW: function(e){
		var pos = this.getContainerDeltaPosition(e);
		var angle = this.container.getRotation() * Math.PI / 180;
		this.newW = -pos.x+this.container.getWidth();
		this.newH = pos.y;
		var incx = pos.x * Math.cos(angle);
		var incy = pos.x * Math.sin(angle);
		this.dispatchEvent('areaChanged', {x: this.container.getX()+incx, y: this.container.getY()+incy, w: this.newW, h: this.newH});
	},

	mouseMoveHandlerS: function(e) {
		var pos = this.getContainerDeltaPosition(e);
		this.newH = pos.y;
		this.dispatchEvent('areaChanged', {h: this.newH});
	},
	
	mouseMoveHandlerSE: function(e) {
		var pos = this.getContainerDeltaPosition(e);
		this.newW = pos.x;
		this.newH = pos.y;
		this.dispatchEvent('areaChanged', {w: this.newW, h: this.newH});
	},
	
	mouseMoveHandlerE: function(e){
		var pos = this.getContainerDeltaPosition(e);
		this.newW = pos.x;
		this.dispatchEvent('areaChanged', {w: this.newW});
	},
	
	mouseMoveHandlerNE: function(e){
		var pos = this.getContainerDeltaPosition(e);
		var angle = this.container.getRotation() * Math.PI / 180;
		this.newW = pos.x;
		this.newH = -pos.y+this.container.getHeight();
		var incx = pos.y * Math.sin(angle);
		var incy = pos.y * Math.cos(angle);
		
		this.dispatchEvent('areaChanged', {h: this.newH, w: this.newW, x: this.container.getX() - incx, y: this.container.getY() + incy});
	},
	
	getContainerDeltaPosition: function(e) {
		var selfPos = this.container.offset();
		return getPositionInRotatedcoordinate({
			x : e.pageX - selfPos.x,
			y : e.pageY - selfPos.y
		}, Math.PI * this.container.getRotation() / 180);
	},
	
	getContainerOffsetPosition: function(newW, newH) {
		var newCenterPoint = getPositionFromRotatedCoordinate({
			x : (newW - this.container.getWidth()) / 2,
			y : (newH - this.container.getHeight()) / 2
		}, Math.PI * this.container.getRotation() / 180, this.container.getRotationCenterPoint());
		var res = getPositionFromRotatedCoordinate({
			x : - newW / 2,
			y : - newH / 2
		}, Math.PI * this.container.getRotation() / 180, newCenterPoint);
		return res;
	}
});

ResizeIconSet = Class.extend({
	
	init: function(container, pos, config) {
		this.resizebtns = Array();
		this.container = config.container = container;
		for(var i=0; i<pos.length; i++) {
			config.pos = pos[i];
			this.resizebtns.push(new ResizeIcon(config));
		}
	},
	
	addChild: function(icon) {
		icon.container = this.container;
		this.resizebtns.push(icon);
	},
	
	getButtons: function() {
		return this.resizebtns;
	},
	
	updateArea: function(e) {
		for(var i=0; i<this.resizebtns.length;i++) {
			this.resizebtns[i].updateArea(e);
		}
	},
	
	registerEvent: function() {
		for(var i=0; i<this.resizebtns.length;i++) {
			this.resizebtns[i].registerEvent();
		}
	},
	
	unregisterEvent: function() {
		for(var i=0; i<this.resizebtns.length;i++) {
			this.resizebtns[i].unregisterEvent();
		}
	},
	
	show: function() {
		for(var i=0; i<this.resizebtns.length; i++) {
			this.resizebtns[i].access().show();
		}
	},
	
	hide: function() {
		for(var i=0; i<this.resizebtns.length; i++) {
			this.resizebtns[i].access().hide();
		}
	}
});

ResizableInterface = InterfaceImplementor.extend({
	
	implement: function(obj) {

		obj.prototype.updateArea = obj.prototype.updateArea || function(e) {
			this.canvasW = this.canvasW || e.w;
			this.canvasH = this.canvasH || e.h;
			
			this.doUpdateArea(e);
			e.w = this.access().outerWidth();
			e.h = this.access().outerHeight();
			this.resizeset.updateArea(e);
		};
		
		obj.prototype.doUpdateArea = obj.prototype.doUpdateArea || function(e) {
			if (e.a != undefined) {
				this.setRotation(e.a);
			} else {
				var deltaW = this.access().outerWidth() - this.getWidth();
				var deltaH = this.access().outerHeight() - this.getHeight();
				if (e.x) {
					this.setX(e.x);
				}
				if (e.y)
					this.setY(e.y);
				if (e.h)
					this.setHeight(e.h - deltaH);
				if (e.w)
					this.setWidth(e.w - deltaW);
			}
		};
		
		obj.prototype.showResizeControl = obj.prototype.showResizeControl || function(){
			this.resizeset.show();
		},
		
		obj.prototype.hideResizeControl = obj.prototype.hideResizeControl || function(){
			this.resizeset.hide();
		},
		
		obj.prototype.onDeleteHandler = obj.prototype.onDeleteHandler || function(e) {
			this.dispose();
		};
		
		obj.prototype.onMouseUpHandler = obj.prototype.onMouseUpHandler || function(e) {};
		
		obj.prototype.onMouseDownHandler = obj.prototype.onMouseDownHandler || function(e) {};
		
		obj.prototype.beginEditable = obj.prototype.beginEditable || function(defaultW, defaultH, resizeIcon, includeRotate) {
			this.rotationCenter = {
				x: 0.5,
				y: 0.5
			};
			if (resizeIcon == undefined)
				resizeIcon = ['n', 'nw', 'w', 'sw', 's', 'e', 'se', 'ne'];
			this.defaultW = defaultW || 150;
			this.defaultH = defaultH || 150;
			
			this.resizeset = new ResizeIconSet(this, resizeIcon, {minW: 0, minH: 0, maxW: Number.MAX_VALUE, maxH: Number.MAX_VALUE});
			if (includeRotate)
				this.resizeset.addChild(new RotateIcon());
			this.setStyle('position', 'absolute');
			
			this.access().addClass('joo-init-transform');
			this.access().addClass("joo-editable-component");
			
			var _self = this;
			
			$(document).bind("mouseup",function(){
				_self.dispatchEvent('resizeStop');
				_self.changeTransformOrigin('center');
				_self.onMouseUpHandler();
				_self.resizeset.unregisterEvent();
			});

			for(var i=0; i<this.resizeset.getButtons().length;i++) {
				this.resizeset.getButtons()[i].addEventListener('mousedown', function(e) {
					_self.stopDrag();
					_self.onMouseDownHandler(e);
					_self.dispatchEvent('resizestart');
				});
				
				this.resizeset.getButtons()[i].addEventListener('mouseup', function(e) {
					_self.dispatchEvent('resizestop');
				});
				
				this.resizeset.getButtons()[i].addEventListener('stylechange', function(e) {
					e.stopPropagation();
				});
				
				this.resizeset.getButtons()[i].addEventListener('areaChanged', function(e) {
					if (e.w != undefined) {
						if (e.w > _self.maxW)
							e.w = _self.maxW;
						else if (e.w < _self.minW)
							e.w = _self.minW;
					}
					
					if (e.h!= undefined) {
						if (e.h > _self.maxH)
							e.h = _self.maxH;
						else if (e.h < _self.minH)
							e.h = _self.minH;
					}
					
					if (e.x != undefined) {
						var minX = _self.access().offset().x + _self.getWidth() - _self.maxW;
						var maxX = _self.access().offset().x + _self.getWidth() - _self.minW;
						if (e.x < minX)
							e.x = minX;
						else if (e.x > maxX)
							e.x = maxX;
					}
					
					if (e.y != undefined) {
						var minY = _self.offset().y + _self.getHeight() - _self.maxH;
						var maxY = _self.offset().y + _self.getHeight() - _self.minH;
						if (e.y < minY)
							e.y = minY;
						else if (e.y > maxY)
							e.y = maxY;
					}
					_self.updateArea(e);
				});
			}
			this.resizeset.registerEvent();
			this.dispatchEvent('resizeStart');

			for(var i=0; i<this.resizeset.getButtons().length; i++) {
				this.addChild(this.resizeset.getButtons()[i]);
			}
			this.updateArea({w: this.defaultW, h: this.defaultH});
		};
	}
});

EffectableInterface = InterfaceImplementor.extend({
	
	implement: function(obj) {
		obj.prototype.runEffect = obj.prototype.runEffect || function(effect, options, speed) {
			this.access().effect(effect, options, speed);
		};
	}
});

ParentStylePropertiesMutator = Class.extend({
	
	setProperty: function(obj, name, value) {
		obj._parent.setStyle(name, value);
	}
});

StylePropertiesMutator = Class.extend({
	
	setProperty: function(obj, name, value) {
		obj.setStyle(name, value);
	}
});

StyleCSS3PropertiesMutator = Class.extend({
	
	setProperty: function(obj, name, value) {
		obj.setCSS3Style(name, value);
	}
});

AttrPropertiesMutator = Class.extend({
	
	setProperty: function(obj, name, value) {
		obj.setAttribute(name, value);
	}
});

EffectPropertiesMutator = Class.extend({
	
	setProperty: function(obj, name, value) {
		Wrapper.wrap(obj, EffectableInterface);
		obj._effect = value;
		obj.runEffect(value, {time: 1}, 500);
		setTimeout(function() {
			obj.access().show();
		}, 750);
	}
});

ToggleAttrPropertiesMutator = Class.extend({
	
	setProperty: function(obj, name, value) {
		if (value)
			obj.setAttribute(name, '');
		else
			obj.removeAttribute(name);
	}
});

ParentStylePropertiesAccessor = Class.extend({
	
	getProperty: function(obj, name) {
		return obj._parent.getComputedStyle(name);
	}
});

StylePropertiesAccessor = Class.extend({
	
	getProperty: function(obj, name) {
		return obj.getComputedStyle(name);
	}
});

StyleCSS3PropertiesAccessor = Class.extend({
	
	getProperty: function(obj, name) {
		return obj.getComputedStyle(name);
	}
});

AttrPropertiesAccessor = Class.extend({
	
	getProperty: function(obj, name) {
		return obj.getAttribute(name);
	}
});

EffectPropertiesAccessor = Class.extend({
	
	getProperty: function(obj, name) {
		return obj._effect;
	}
});

ToggleAttrPropertiesAccessor = Class.extend({
	
	getProperty: function(obj, name) {
		return obj.hasAttribute(name);
	}
});

Preset = Class.extend({

	init: function() {
		this.name = "Preset";
		this.changed = {};
		this.oldValue = {};
	},
	
	apply: function(obj) {
		for(var i in this.changed) {
			this.oldValue[i] = obj.getStyle(i);
			obj.setStyle(i, this.changed[i]);
			this.changed[i] = obj.getStyle(i);
		}
	},
	
	revert: function(obj) {
		for(var i in this.changed) {
			var style = obj.getStyle(i);
			if (style == this.changed[i]) {
				obj.setStyle(i, this.oldValue[i]);
			}
		}
	},
	
	getName: function() {
		return this.name;
	},
	
	toString: function() {
		return this.name;
	}
});

LinkButtonPreset = Preset.extend({
	
	init: function() {
		this._super();
		this.name = "LinkButton";
		this.changed = {
			'border': 'none',
			'background-color': 'transparent',
			'color': '#069',
			'text-decoration': 'underline',
			'background-image': 'none'
		};
	}
});

MacButtonPreset = Preset.extend({
	
	init: function() {
		this._super();
		this.name = "MacButton";
		this.changed = {
			'border-radius': '5px',
			'color': 'black',
			'border-width': '1px',
			'border-color': '#ccc',
			'border-style': 'solid',
			'background-color': '#ccc',
			'background-image': 'none'
		};
	}
});

TextHeaderPreset = Preset.extend({
	
	init: function() {
		this._super();
		this.name = "TextHeader";
		this.changed = {
			'font-size': '20px',
			'font-weight': 'bold'
		};
	}
});

TextSectionPreset = Preset.extend({
	
	init: function() {
		this._super();
		this.name = "TextSection";
		this.changed = {
			'font-size': '16px',
			'font-weight': 'bold',
			'color': '#069'
		};
	}
});

PresetPropertiesMutator = Class.extend({
	
	setProperty: function(obj, k, v) {
		Wrapper.wrap(obj, PresetInterface);
		if (v == undefined || v == 'none') {
			obj.revertPreset();
		} else {
			var preset = new window[v + "Preset"]();
			obj.applyPreset(preset);
		}
	}
});

PresetPropertiesAccessor = Class.extend({
	
	getProperty: function(obj, k) {
		if (obj._preset != undefined)
			return obj._preset.name;
	}
});

PresetInterface = InterfaceImplementor.extend({
	
	implement: function(obj) {
		obj.prototype.applyPreset = obj.prototype.applyPreset || function(preset) {
			this.revertPreset();
			this._preset = preset;
			this._preset.apply(this);
		};
		
		obj.prototype.revertPreset = obj.prototype.revertPreset || function() {
			if (this._preset != undefined) {
				this._preset.revert(this);
				this._preset = undefined;
			}
		};
	}
});

PropertiesEncapsulationInterface = InterfaceImplementor.extend({
	
	implement: function(obj) {
		
		obj.prototype.getSupportedProperties = obj.prototype.getSupportedProperties || function() {
			return this.supportedProperties;
		};
		
		obj.prototype.setProperty = obj.prototype.setProperty || function(property, value) {
			var className = property.type.substr(0, 1).toUpperCase() + property.type.substr(1) + 'PropertiesMutator';
			if (window[className] != undefined)
				new window[className]().setProperty(this, property.name, value);
		};
		
		obj.prototype.getProperty = obj.prototype.getProperty || function(property) {
			var className = property.type.substr(0, 1).toUpperCase() + property.type.substr(1) + 'PropertiesAccessor';
			if (window[className] != undefined)
				return new window[className]().getProperty(this, property.name);
		};
	}
});

MaskableInterface = InterfaceImplementor.extend({
	
	implement: function(obj) {
		
		obj.prototype.addMask = obj.prototype.addMask || function(background, alpha) {
			background = background || "black";
			alpha = alpha || "0.2";
			var sketch = new Sketch({width: '100%', height: '100%', 'background-color': background});
			sketch.setStyle('opacity', alpha);
			sketch.setStyle('position', 'absolute');
			sketch.setStyle('z-index', '50');
			sketch.setLocation(0, 0);
			this.addChild(sketch);
		};
	}
});
/**
 * @class An editable textbox. This component allows user to change the text
 * by doubleclicking it, and when it losts user's focus, it also lost
 * the editing capabilities.
 * <p>It supports additional configuration parameters</p>
 * <ul>
 * 	<li><code>readonly</code> Whether the component is readonly</li>
 * 	<li><code>blurEvent</code> The event when the component losts editing capabilities</li>
 * </ul>
 * @augments UIComponent
 */
JOOText = UIComponent.extend(
/** @lends JOOText# */
{	
	setupDomObject: function(config) {
		this._super(config);
		this.text = new Sketch();
		if (config.lbl)
			this.setValue(config.lbl);

		if (!config.readonly) {
			this.addEventListener('dblclick', function() {
				this.enableEdit(true);
			});
			this.text.addEventListener('dblclick', function() {
				this._parent.enableEdit(true);
			});
			this.text.addEventListener('keyup', function() {
				var old = this._parent.config.lbl;
				this._parent.config.lbl = this.access().html();
				if (old != this._parent.config.lbl)
					this._parent.dispatchEvent('change');
			});
		}
		
		this.text.access().addClass("text");
		if (!config.readonly && config.blurEvent) {
			this.addEventListener(config.blurEvent, function() {
				this.enableEdit(false);
			});
		}
		this.addChild(this.text);
		
		this.text.addEventListener("stageUpdated", function(){
			var _div = document.getElementById(this.getId());
			_div.onfocus = function() {
			    window.setTimeout(function() {
			        var sel, range;
			        if (window.getSelection && document.createRange) {
			            range = document.createRange();
			            range.selectNodeContents(_div);
			            sel = window.getSelection();
			            sel.removeAllRanges();
			            sel.addRange(range);
			        } else if (document.body.createTextRange) {
			            range = document.body.createTextRange();
			            range.moveToElementText(_div);
			            range.select();
			        }
			    }, 1);
			};
		});
//		this.attachContextMenu();
//		var _self = this;
//		this.getContextMenu().addItem(new JOOMenuItem({label: 'Edit text', command: function() {
//			_self.enableEdit(true);
//			_self.getContextMenu().hide();
//		}}));
	},
	
	setValue: function(lbl) {
		this.text.access().html(lbl);
	},

	/**
	 * Get the value of the text
	 * @returns {String} the text value
	 */
	getValue: function() {
		return this.text.access().html();
	},

	/**
	 * Enable/Disable editing
	 * @param {Boolean} b Whether the editing is enable
	 */
	enableEdit: function(b) {
		if (b)
			this.text.access().focus();
		this.text.access()[0].contentEditable = b;
	}
});

/**
 * @class A simple video player, counterpart of <code>HTML5 VIDEO</code>
 * <p>It supports additional configuration parameters</p>
 * <ul>
 * 	<li><code>src</code> The source of the video</li>
 * 	<li><code>controls</code> Whether the controls are visible</li>
 * </ul> 
 * @augments UIComponent 
 */
JOOVideo = UIComponent.extend(
/** @lends JOOVideo# */		
{
	setupDomObject: function(config) {
		this._super(config);
		if (config.controls) {
			this.setAttribute('controls', '');
		}
		if (config.src) {
			this.setAttribute('src', config.src);
		}
	},

	/**
	 * Play the video
	 */
	play: function() {
		if(!this._domObject){
			this._domObject = document.getElementById(this.getId());
		}
		if(this._domObject){
			this._domObject.play();
		}
	},
	
	stop: function(){
		if(!this._domObject){
			this._domObject = document.getElementById(this.getId());
		}
		this._domObject.pause();
		this._domObject.currentTime = 0.0;
	},
	
	pause: function(){
		if(!this._domObject){
			this._domObject = document.getElementById(this.getId());
		}
		this._domObject.pause();
		return this._domObject.currentTime;
	},
	
	toHtml: function() {
		return "<video></video>";
	},
	
	dispose: function(skipRemove){
		this.stop();
		this._super(skipRemove);
	}
});

/**
 * @class A simple audio player, extending the {@link JOOVideo}.
 * @augments JOOVideo
 */
JOOAudio = JOOVideo.extend({
	
	toHtml: function() {
		return "<audio></audio>";
	}
});

/**
 * @class A counterpart of <code>HTML A</code> element.
 * <p>It supports additional configuration parameters</p>
 * <ul>
 * 	<li><code>href</code> The URL the link goes to</li>
 * 	<li><code>lbl</code> The label of the link</li>
 * </ul>
 * @augments UIComponent
 */
JOOLink = UIComponent.extend({
	
	setupDomObject: function(config) {
		this._super(config);
		if (config.href)
			this.setAttribute('href', config.href);
		if (config.lbl)
			this.access().html(config.lbl);
	},
	
	toHtml: function() {
		return "<a></a>";
	}
});

/**
 * @class A counterpart of <code>HTML IMG</code> element.
 * <p>It supports additional configuration parameters</p>
 * <ul>
 * 	<li><code>defaultSrc</code> The default source of the image, 
 * 	if the provided source is broken</li>
 * 	<li><code>src</code> The source of the image</li>
 * </ul>
 * @augments UIComponent
 */
JOOImage = UIComponent.extend(
/** @lends JOOImage# */
{
	setupDomObject: function(config) {
		this._super(config);
		this.defaultSrc = config.defaultSrc || "static/images/image-default.png";
		config.src = config.src || this.defaultSrc;
		this.setSrc(config.src);
		this.addEventListener('error', function() {
			this.setSrc(this.defaultSrc);
		});
	},
	
	toHtml: function()	{
		return "<img />";
	},

	/**
	 * Get the source of the image
	 * @returns {String} the image source
	 */
	getSrc: function()	{
		return this.getAttribute('src');
	},

	/**
	 * Change the source of the image
	 * @param {String} src the new image source
	 */
	setSrc: function(src) {
		this.setAttribute('src', src);
	}
});

/**
 * @class A base class for all components which accept user input
 * by any means.
 * <p>It supports additional configuration parameters</p>
 * <ul>
 * 	<li><code>value</code> The value of the input</li>
 * 	<li><code>name</code> The name of the input</li>
 * </ul>
 * @augments UIComponent
 */
JOOInput = UIComponent.extend(
/** @lends JOOInput# */		
{
	setupDomObject: function(config) {
		this._super(config);
		this.access().val(config.value);
		this.setAttribute('name', config.name);
		if (config.placeholder)
		this.setAttribute('placeholder', config.placeholder);
	},

	/**
	 * Change the value of the input
	 * @param {Object} value new value
	 */
	setValue: function(value) {
		var oldValue = this.access().val();
		if (oldValue != value) {
			this.access().val(value).change();
		}
	},
	
	/**
	 * Get the value of the input
	 * @returns {Object} the input value
	 */
	getValue: function()	{
		return this.access().val();
	},
	
	/**
	 * Get the name of the input
	 * @returns {String} the input name
	 */
	getName: function() {
		return this.getAttribute('name');
	},
	
	/**
	 * Focus the input
	 */
	focus: function()	{
		this.access().focus();
	}
});

/**
 * @class An input which provides an area
 * for user to enter text. It is the counterpart
 * of <code>HTML TEXTAREA</code> element.
 */
JOOTextArea = JOOInput.extend	(
/** @lends JOOTextArea# */		
{
	
	toHtml: function()	{
		return "<textarea></textarea>";
	},

	/**
	 * Alias of <code>getValue</code>
	 * @returns {String} the value of the textarea
	 */
	getText: function()	{
		return this.access().val();
	}
});

/**
 * @class A counterpart of <code>HTML LABEL</code> element.
 * @augments UIComponent
 */
JOOLabel = UIComponent.extend	(
/** @lends JOOLabel# */		
{
	setupDomObject: function(config) {
		this._super(config);
		this.access().html(config.lbl);
	},
	
	toHtml: function()	{
		return "<label></label>";
	},
	
	/**
	 * Get the text of the label
	 * @returns {String} the label's text
	 */
	getText: function()	{
		return this.access().html();
	},
	
	/**
	 * Change the text of the label
	 * @param {String} txt the new text
	 */
	setText: function(txt)	{
		this.access().html(txt);
	}
});

/**
 * @class A counterpart of <code>HTML INPUT TEXT</code>
 * @augments JOOInput
 */
JOOTextInput = JOOInput.extend({
	
	toHtml: function()	{
		return "<input type='text' />";
	}
});

/**
 * @class A counterpart of <code>HTML INPUT PASSWORD</code>
 * @augments JOOInput
 */
JOOPasswordInput = JOOInput.extend({
	
	toHtml: function()	{
		return "<input type='password' />";
	}
});

/**
 * @class An input associated with a label.
 * <p>It supports additional configuration parameters</p>
 * <ul>
 * 	<li><code>labelObject</code> the label object, if not specified a new label will be created using the same configuration parameters as this object</li>
 * 	<li><code>inputObject</code> the input object, if not specified a new text input will be created using the same configuration parameters as this object</li>
 * </ul>
 * @augments JOOInput
 */
JOOInputBox = JOOInput.extend(
/** @lends JOOInput# */		
{
	setupDomObject: function(config) {
		this._super(config);
		this.label = config.labelObject || new JOOLabel(config);
		this.input = config.inputObject || new JOOTextInput(config);
		this.addChild(this.label);
		this.addChild(this.input);
	},
	
	/**
	 * Get the value of the input
	 * @returns {Object} the input value
	 */
	getValue: function()	{
		return this.input.getValue();
	},
	
	/**
	 * Change the value of the input
	 * @param value {Object} the new input value
	 */
	setValue: function(value) {
		this.input.setValue(value);
	},
	
	/**
	 * Get the text of the label 
	 * @returns {String} the label's text
	 */
	getLabel: function() {
		return this.label.getValue();
	},
	
	/**
	 * Get the name of the input
	 * @returns the input's name
	 */
	getName: function() {
		return this.input.getName();
	},
	
	focus: function()	{
		this.input.focus();
	}
});

JOOSelectOption = Graphic.extend({
	
	setupDomObject: function(config) {
		this._super(config);
		this.repaint(config.label);
		this.setAttribute("value", config.value);
	},
	
	toHtml: function() {
		return "<option></option>";
	}
});

/**
 * @class A counterpart of <code>HTML SELECT</code> element.
 * <p>It supports additional configuration parameters:</p>
 * <ul>
 * 	<li><code>options</code> Initial options of this select box. It must be an <code>Array</code>
 * 		which each element is an object with <code>label</code> and <code>value</code> properties.
 * 	</li>
 * 	<li><code>selectedIndex</code> The initially selected index, defaults is 0</li>
 * 	<li><code>selectedValue</code> The initially selected value. Should not present if <code>selectedIndex</code> is already specified.</li>
 * </ul>
 * @augments JOOInput
 */
JOOInputSelect = JOOInput.extend({
	
	setupDomObject: function(config) {
		this._super(config);
		
		this.options = Array();
		var options = config.options || {};
		for(var i=0; i<options.length; i++) {
			this.addOption(options[i]);
		}
		this.selectedIndex = config.selectedIndex || 0;
		if(config.selectedIndex == undefined && config.selectedValue != undefined){
			this.selectedIndex = 0;
			for(var i=0;i<this.options.length;i++){
				if(this.options[i].value == config.selectedValue){
					this.selectedIndex = i;
					break;
				}
			}
		}
		
		this.addEventListener("change", function(e) {
			if (e != undefined)
				this.selectedIndex = e.currentTarget.options.selectedIndex; 
		});
		this.access().val(config.selectedValue);
	},
	
	/**
	 * Add an option to the select box.
	 * @param {Object} param new option, with <code>label</code> and <code>value</code> properties.
	 */
	addOption: function(param){
		this.options.push(param);
		if (param.order != undefined){
			for(var i=this.options.length-2;i>=param.order;i--){
				this.options[i] = this.options[i+1];
			}
		}
		this.addChild(new JOOSelectOption(param));
	},
	
	/**
	 * Change the value of the select box
	 * @param {String} val new value of the select box.
	 */
	setValue: function(val) {
		this.access().val(val);
		this.selectedIndex = this.access().find("option:selected").index()-1;
		this.dispatchEvent("change");
	},

	/**
	 * Change the value of the select box to an option by its index.
	 * @param {Number} idx the index of the option.
	 */
	setValueByIndex: function(idx) {
		this.selectedIndex = idx;
		this.access().find("option").eq(idx).attr("selected", "selected");
		this.dispatchEvent("change");
	},

	/**
	 * Get the value of the select box.
	 * @returns {String} the select box's value.
	 */
	getValue: function() {
		return this.access().val();
	},
	
	/**
	 * Refresh the select box.
	 */
	refresh: function(){
		this.access().html(this.toHtml());
		this.selectedIndex = this.access().find("option:selected").index()-1;
	},
	
	toHtml: function(){
		return "<select></select>";
	}
});

/**
 * @class A counterpart of <code>HTML BUTTON</code> element.
 * <p>It supports additional configuration parameters:</p>
 * <ul>
 * 	<li><code>lbl</code> The label of the button.</li>
 * </ul>
 * @augments UIComponent
 */
JOOButton = UIComponent.extend(
/** @lends JOOButton# */		
{
	
	setupDomObject: function(config) {
		this._super(config);
		if (config.lbl != undefined) {
			this.access().html(config.lbl);
		}
		this.addEventListener('click', function(e) {
			this.onclick(e);
		});
//		this.addEventListener('mousedown', function(e) {
//			this.access().addClass('focus');
//		});
	},
	
	toHtml: function()	{
		return "<a></a>";
	},
	
	/**
	 * Command attached to the button.
	 * @param e the event object
	 */
	onclick: function(e) {}
});

/**
 * @class A customized button, which excludes all styles
 * of its superclass and ancestors.
 * @augments JOOButton
 */
JOOCustomButton = JOOButton.extend({
	
	setupDomObject: function(config) {
		this.inheritedCSSClasses = false;
		this._super(config);
	}
});

/**
 * @class A button which can toggle up and down.
 * <p>It supports additional configuration parameters</p>
 * <ul>
 * 	<li><code>state</code> The initial state of the button</p>
 * </ul>
 * @augments JOOCustomButton
 */
JOOToggleButton = JOOCustomButton.extend(
/** @lends 	JOOToggleButton# */
{
	setupBase: function(config) {
		this.state = config.state;
		this._super(config);
	},
	
	setupDomObject: function(config) {
		this._super(config);
		if (this.state)
			this.access().addClass('joo-toggle-down');
	},

	/**
	 * Change the state of the button.
	 * @param {Boolean} state the state of the button 
	 */
	setState: function(state) {
		this.state = state;
		if(this.state) {
			this.access().addClass('joo-toggle-down');
			this.ontoggledown();
		} else {
			this.access().removeClass('joo-toggle-down');
			this.ontoggleup();
		}
	},
	
	/**
	 * Get the state of the button.
	 * @returns {Boolean} the state of the button
	 */
	getState: function() {
		return this.state;
	},
	
	onclick: function(e) {
		this.access().toggleClass("joo-toggle-down");
		if(this.state) {
			this.state = false;
			this.ontoggleup();
		} else {
			this.state = true;
			this.ontoggledown();
		}
		this.dispatchEvent('toggle');
	},
	
	ontoggledown: function() {
		this.dispatchEvent('toggleDown');
	},
	
	ontoggleup: function() {
		this.dispatchEvent('toggleUp');
	}
});

/**
 * @class An equivalent but different from <code>HTML INPUT CHECKBOX</code> element.
 * @augments JOOToggleButton
 */
JOOCheckbox = JOOToggleButton.extend(
/** @lends JOOCheckbox# */
{
	ontoggledown: function() {
		this.value = true;
		this.access().addClass('checked');
		this.dispatchEvent('change');
	},
	
	ontoggleup: function() {
		this.value = false;
		this.access().removeClass('checked');
		this.dispatchEvent('change');
	},

	/**
	 * Get the value of the checkbox.
	 * @returns {Boolean} the value. <code>true</code> if the checkbox is checked,
	 * <code>false</code> otherwise.
	 */
	getValue: function() {
		return this.value;
	},
	
	/**
	 * Change the value of the checkbox.
	 * @param {Boolean} value the value of the checkbox
	 */
	setValue: function(value) {
		if (value)
			this.ontoggledown();
		else
			this.ontoggleup();
	},
	
	toHtml: function() {
		return "<span></span> ";
	}
});

JOOCloseButton = JOOCustomButton.extend({
	
	setupDomObject: function(config) {
		this._super(config);
		this.access().addClass("joo-custom-button");
	},
	
	toHtml: function() {
		return "<span></span>";
	}
});

/**
 * @class A sprite is a keyframe-based animation object which has a timeline. This is
 * base class of all animation classes.
 * <p>It supports additional configuration parameters:</p>
 * <ul>
 * 	<li><code>src</code> the background image source, should be a sprite image</li>
 * 	<li><code>framerate</code> the framerate of the sprite</li>
 * 	<li><code>loop</code> whether the animation should loop</li>
 * 	<li><code>horizontalFramesNo</code> the number of frames in horizontal dimension</li>
 * 	<li><code>verticalFramesNo</code> the number of frames in vertical dimension</li>
 * 	<li><code>spriteWidth</code> the width of the viewport of sprite</li>
 * 	<li><code>spriteHeight</code> the height of the viewport of sprite</li>
 * 	<li><code>speed</code> the relative speed of sprite, e.g 1.5, 2, etc</li>
 * </ul>
 * @augments UIComponent
 */
JOOSprite = UIComponent.extend(
/** @lends JOOSprite# */
{
	setupDomObject: function(config) {
		this._super(config);
		this.src = config.src;
		this.framerate = config.framerate || 30;
		this.loop = config.loop || false;
		this.currentFrame = 0;
		this.horizontalFramesNo = config.horizontalFramesNo;
		this.verticalFramesNo = config.verticalFramesNo;
		this.spriteWidth = config.spriteWidth;
		this.spriteHeight = config.spriteHeight;
		this.speed = config.speed || 1;
		this.stopped = false;
	},

	/**
	 * Play the sprite from <code>start</code> frame to <code>end</code> frame.
	 * @param {Number} start the start frame
	 * @param {Number} end the end frame
	 */
	play: function(start, end) {
		this.stopped = false;
		this.dispatchEvent("frameStart");
		this.startFrame = start || 0;
		this.endFrame = end;
		if(end == undefined){
			this.endFrame = this.verticalFramesNo * this.horizontalFramesNo; 
		} 
		this.currentFrame = this.startFrame;
		
		this.setWidth(this.spriteWidth);
		this.setHeight(this.spriteHeight);
		if (this.src)
			this.access().css('background-image', 'url('+this.src+')');

		this.playFrame();
		this._playWithFramerate(this.framerate);
	},
	
	_playWithFramerate: function(framerate) {
		framerate *= this.speed;
		if (!this.stopped) {
			var _self = this;
			this.interval = setInterval(function() {
				_self.playFrame();
			}, parseFloat(1000/framerate));
		}
	},

	/**
	 * Change the relative speed of the sprite.
	 * @param speed the relative speed of the sprite
	 */
	setSpeed: function(speed) {
		var tempFramerate = this.framerate * speed;
		clearInterval(this.interval);
		this._playWithFramerate(tempFramerate);
	},
	
	/**
	 * Pause the sprite.
	 */
	pause: function() {
		this.dispatchEvent("framePause");
		clearInterval(this.interval);
	},
	
	/**
	 * Resume the sprite.
	 */
	resume: function() {
		this.dispatchEvent("frameResume");
		this._playWithFramerate(this.interval);
	},
	
	/**
	 * Stop the sprite.
	 */
	stop: function() {
		this.dispatchEvent("frameStop");
		this.stopped = true;
	},
	
	playFrame: function() {
		var ended = false;
		if (this.currentFrame > this.endFrame) {
			if (this.loop) {
				this.currentFrame = this.startFrame;
			} else {
				ended = true;
			}
		}
		if (ended || this.stopped) {
			clearInterval(this.interval);
			this.stopped = true;
			this.dispatchEvent("frameEnded");
			return;
		}
		this.dispatchEvent("frameEnter");
		this.onFrame(this.currentFrame);
		this.dispatchEvent("frameExit");
		this.currentFrame++;
	},
	
	/**
	 * This method defines how animation works. Subclass can override it to
	 * change the behaviour. This implementation just change the 
	 * <code>background-position</code> of the sprite.
	 * @param frame
	 */
	onFrame: function(frame) {
		var x = frame % this.horizontalFramesNo;
		var y = 0;
		if (this.currentFrame != 0)
			Math.ceil(frame / this.horizontalFramesNo);
		var xPos = -x*this.spriteWidth+"px";
		var yPos = -y*this.spriteHeight+"px";
		this.access().css('background-position', xPos+' '+yPos);
	},
	
	toHtml: function() {
		return "<div></div>";
	},
	
	dispose: function(skipRemove) {
		this.stop();
		this._super(skipRemove);
	}
});

/**
 * @class A counterpart of <code>HTML INPUT FILE</code> element.
 * @augments JOOInput
 */
JOOFileInput = JOOInput.extend({
	
	setupDomObject: function(config) {
		this._super(config);
	},
	
	toHtml: function() {
		return "<input type='file' />";
	}
});

/**
 * @class A basic AJAX-style uploader.
 * <p>It supports additional configuration parameters:</p>
 * <ul>
 * 	<li><code>name</code> the name of the uploader</li>
 * 	<li><code>endpoint</code> the URL to which the uploader is connected</li>
 * </ul>
 * @augments UIComponent
 */
JOOBasicUploader = UIComponent.extend({
	
	setupDomObject: function(config) {
		this.endpoint = config.endpoint || "";
		this._super(config);
		this.fileInput = new JOOFileInput({name: config.name});
		
		var iframeId = this.getId()+"-iframe";
		var form = new CustomDisplayObject({html: "<form enctype='multipart/form-data' target='"+iframeId+"' action='"+this.endpoint+"' method='post'></form>"});
		form.addChild(this.fileInput);
		this.fileInput.addEventListener('change', function() {
			form.access().submit();
		});
		var _self = this;
		form.addEventListener('submit', function(e) {
			var frame = _self.access().find('iframe');
			$(frame).one('load', function() {
				var response = frame.contents().find('body').html();
				_self.dispatchEvent('submitSuccess', {endpoint: _self.endpoint, data: response});
			});
		});
		this.addChild(form);
	},
	
	toHtml: function() {
		var iframeId = this.getId()+"-iframe";
		return "<div><iframe class='joo-uploader-iframe' name='"+iframeId+"' id='"+iframeId+"'></iframe></div>";
	}
});

/**
 * @class A customized uploader, which features an overlay control.
 * <p>It supports additional configuration parameters:</p>
 * <ul>
 * 	<li><code>control</code> the control of the uploader</li>
 * </ul>
 * @augments JOOBasicUploader
 */
JOOAdvancedUploader = JOOBasicUploader.extend({
	
	setupDomObject: function(config) {
		this._super(config);
		this.fileInput.access().addClass('joo-advanceduploader-input');
		if (config.control) {
			this.addChild(config.control);
		}
	},
	
	toHtml: function() {
		var iframeId = this.getId()+"-iframe";
		return "<div><iframe class='joo-uploader-iframe' name='"+iframeId+"' id='"+iframeId+"'></iframe></div>";
	}
});

/**
 * @class A <code>bold</code> toggle button, used in editors.
 * @augments JOOToggleButton
 */
JOOToggleBoldButton = JOOToggleButton.extend({
	
	toHtml: function(){
		return "<div></div>";
	}
});

/**
 * @class A <code>italic</code> toggle button, used in editors.
 * @augments JOOToggleButton
 */
JOOToggleItalicButton = JOOToggleButton.extend({
	
	toHtml: function(){
		return "<div></div>";
	}
});

/**
 * @class A <code>underline</code> toggle button, used in editors.
 * @augments JOOToggleButton
 */
JOOToggleUnderlineButton = JOOToggleButton.extend({
	
	toHtml: function(){
		return "<div></div>";
	}
});

/**
 * @class A <code>horizontal flip</code> toggle button, used in editors.
 * @augments JOOToggleButton
 */
JOOToggleFlipHorizontalButton = JOOToggleButton.extend({
	
	toHtml: function(){
		return "<div></div>";
	}
});

/**
 * @class A <code>vertical flip</code> toggle button, used in editors.
 * @augments JOOToggleButton
 */
JOOToggleFlipVerticalButton = JOOToggleButton.extend({
	
	toHtml: function() {
		return "<div></div>";
	}
});

/**
 * @class A <code>left align</code> toggle button, used in editors.
 * @augments JOOToggleButton
 */
JOOToggleAlignLeftButton = JOOToggleButton.extend({
	
	toHtml: function(){
		return "<div></div>";
	}
});

/**
 * @class A <code>centered align</code> toggle button, used in editors.
 * @augments JOOToggleButton
 */
JOOToggleAlignCenterButton = JOOToggleButton.extend({
	
	toHtml: function(){
		return "<div></div>";
	}
});

/**
 * @class A <code>right align</code> toggle button, used in editors.
 * @augments JOOToggleButton
 */
JOOToggleAlignRightButton = JOOToggleButton.extend({
	
	toHtml: function(){
		return "<div></div>";
	}
});

/**
 * @class A panel which holds multiple tabs.
 * @augments Panel
 */
JOOTabbedPane = Panel.extend(
/** @lends JOOTabbedPane# */
{
	
	setupBase: function(config) {
		this.tabs = Array();
		this._super(config);
	},
	
	setupDomObject: function(config) {
		this.header = new CustomDisplayObject({html: "<div class='joo-tab-header'></div>"});
		this.content = new CustomDisplayObject({html: "<div class='joo-tab-content'></div>"});
		this._super(config);
		this.addChild(this.header);
		this.addChild(this.content);
	},

	/**
	 * Add a tab to this panel.
	 * @param {String} title the title of the tab
	 * @param {DisplayObject} comp the tab component
	 * @param {String} icon an icon associated with the tab
	 * @param {String} tooltip a tooltip associated with the tab
	 */
	addTab: function(title, comp, icon, tooltip) {
		comp.access().addClass('joo-tab-item');
		if (!tooltip)
			tooltip = "";
		var header = new CustomDisplayObject({html: "<span title='"+tooltip+"'></span>"});
		if (icon != undefined)
			header.addChild(new JOOImage({src: icon, passClickEvent: true}));
		header.addChild(new JOOLabel({lbl: title, passClickEvent: true}));
		header.access().addClass('joo-tab-control');
		
		var _self = this;
		header.setAttribute('tabIndex', this.header.children.length);
		header.addEventListener('click', function(e) {
			_self.setTab(this.getAttribute('tabIndex'));
		});
		
		this.header.addChild(header);
		this.content.addChild(comp);
		this.tabs.push(comp);
		if (this.header.children.length == 1) {
			this.setTab(0);
		}
	},
	
	/**
	 * Change the active tab.
	 * @param {Number} index the index of the tab to be active
	 */
	setTab: function(index) {
		for(var i=0; i<this.header.children.length; i++) {
			this.header.children[i].access().removeClass('active');
		}
		this.header.children[index].access().addClass('active');
		for(var i=0; i<this.tabs.length; i++) {
			this.tabs[i].access().hide();
		}
		this.tabs[index].setStyle('display', 'block');
	},
	
	toHtml: function() {
		return "<div></div>";
	}
});

/**
 * @class An accordion, which has a header to toggle its content.
 * @augments UIComponent
 */
JOOAccordion = UIComponent.extend(
/** @lends JOOAccordion# */
{
	setupDomObject: function(config) {
		this._super(config);
		this.header = new Sketch();
		this.header.access().addClass('joo-accordion-header');
		this.header.access().html(config.lbl);
		var _self = this;
		this.header.addEventListener('click', function() {
			_self.contentPane.access().slideToggle(config.toggleSpeed || 500);
			_self.header.access().toggleClass('collapsed');
		});
		this.contentPane = new Sketch();
		this.contentPane.access().addClass('joo-accordion-content');
		this.addChild(this.header);
		this.addChild(this.contentPane);
	},
	
	/**
	 * Get the content panel of the accordion.
	 * @returns {Sketch} the content panel
	 */
	getContentPane: function() {
		return this.contentPane;
	},
	
	/**
	 * Change the label of the accordion.
	 * @param {String} label the label of the accordion
	 */
	setAccordionLabel: function(label) {
		this.header.access().html(label);
	}
});

/**
 * @class A ruler which supports drag.
 * <p>It supports additional configuration parameters:</p>
 * <ul>
 * 	<li><code>width</code> the width of the ruler</li>
 * 	<li><code>height</code> the height of the ruler</li>
 * 	<li><code>initmin</code> the minimum value of the ruler</li>
 * 	<li><code>initmax</code> the maximum value of the ruler</li>
 * 	<li><code>interval</code> the interval number of the ruler</li>
 * 	<li><code>groupmode</code> could be "half" or "quarter"</li>
 * 	<li><code>value</code> the intial value of the ruler</li>
 * </ul>
 * @augments JOOInput
 */
JOORuler = JOOInput.extend(
/** @lends JOORuler# */
{
	setupDomObject: function(config) {
		this._super(config);
		this.width = parseFloat(config.width);
		this.height = parseFloat(config.height);
		this.initMin = parseFloat(config.initmin || 0);
		this.min = parseFloat(config.min || 0);
		this.initMax = parseFloat(config.initmax || this.width / 10);
		this.max = parseFloat(config.max || this.initMax);
		this.interval = parseFloat(config.interval || 1);
		this.groupMode = config.groupmode;
		this.value = parseFloat(config.value || this.initmin);
		this.autoExpand = this.autoExpand || true;
		this.baseValue = 0;
		
		this.canvas = new Canvas({width: this.width, height: this.height});
		this.addChild(this.canvas);
		this.addEventListener('stageUpdated', function() {
			this.initRuler();
			this.initRoller();
		});
	},
	
	initRoller: function() {
		this.backRoller = new JOOImage({absolute: true, height: 16, 
			custom: {
				position: 'absolute',
				left: '-10px'
			},
			src: 'static/images/backward.png'
		});
		this.forwardRoller = new JOOImage({absolute: true, height: 16, 
			custom: {
				position: 'absolute',
				right: '-10px'
			},
			src: 'static/images/forward.png'
		});
		
		var _self = this;
		this.backRoller.addEventListener('mousedown', function() {
			_self.startExpand();
		});
		this.backRoller.addEventListener('mouseup', function() {
			_self.stopExpand();
		});
		this.backRoller.addEventListener('mouseout', function() {
			_self.stopExpand();
		});
		
		this.forwardRoller.addEventListener('mousedown', function() {
			_self.startExpand(true);
		});
		this.forwardRoller.addEventListener('mouseup', function() {
			_self.stopExpand();
		});
		this.forwardRoller.addEventListener('mouseout', function() {
			_self.stopExpand();
		});
		
		this.addChild(this.backRoller);
		this.addChild(this.forwardRoller);
	},
	
	initRuler: function() {
		var context = this.canvas.getContext();
		context.beginPath();
		context.clearRect(0, 0, parseInt(this.canvas.getWidth()), parseInt(this.canvas.getHeight()));
		var len = this.initMax - this.initMin;
		
		if (this.groupMode == "quarter") 
			this.group = this.interval * 4;
		else if (this.groupMode == "half")
			this.group = this.interval * 2;
		else
			this.group = this.interval * 1;
		
		var font = new JOOFont();
		context.setFont(font);
		this.deltaY = 9;
		this.deltaX = 5;
		context.moveTo(this.deltaX, this.deltaY);
		context.lineTo(this.getWidth() - this.deltaX, this.deltaY);

		var valueX = this.convertValueToX(this.deltaX);
		this.drawPointer(valueX, 0, this.deltaX, this.deltaY);
		
		var base = this.baseValue % this.group;
		var min = this.initMin - base;
		var max = this.initMax - base;
		for(var i=-base; i<=len; i += this.interval) {
			var x = i * (this.getWidth() - 2 * this.deltaX) / len + this.deltaX;
			context.moveTo(x, this.getHeight()/10 + this.deltaY);
			var h = this.height / 2;
			
			if (i == -base || i == max - min || (i + base) % this.group == 0) {
				if (i == max - min)
					context.setTextAlign('right');
				else if (i == 0)
					context.setTextAlign('left');
				else
					context.setTextAlign('center');
				context.fillText(i + base + min, x, this.height / 2 + 15 + this.deltaY);
			}
			if ((i + base) % this.group == 0) {
				
			} else if (((i + base) / this.interval) % (this.group / this.interval) == 2) {
				h = h * 0.75;
			} else {
				h = h * 0.5;
			}
			context.lineTo(x, h  + this.deltaY);
		}
		context.stroke();
	},
	
	/**
	 * Mark the ruler at a specific value.
	 * @param {Number} value the value to be marked
	 */
	mark: function(value) {
		var _self = this;
		var x = this.convertValueToX(this.deltaX, value);
		var sk = new Sketch({width: 10, height: 10, 'background-color': 'red', custom: {
			display: 'inline-block',
			position: 'absolute',
			cursor: 'pointer'
		}});
		sk.setLocation(x-5, 5);
		this.addChild(sk);
		sk.addEventListener('click', function() {
			_self.setValue(value);
		});
	},
	
	convertValueToX: function(deltaX, value) {
		value = value || this.value;
		return (value - this.initMin) / (this.initMax - this.initMin) * (this.getWidth() - 2 * deltaX);
	},
	
	convertXToValue: function(x, deltaX) {
		var percent = x / (this.getWidth() - 2 * deltaX);
    	if (percent < 0) percent = 0;
    	else if (percent > 1) percent = 1;
    	return Math.round(this.initMin + percent * (this.initMax - this.initMin));
	},
	
	expandLeft: function() {
		if (this.initMin > this.min) {
			this.baseValue--;
			this.initMin--;
			this.initMax--;
			this.initRuler();
			this.dispatchEvent('expanded');
		}
	},
	
	expandRight: function() {
		if (this.initMax < this.max) {
			this.baseValue++;
			this.initMin++;
			this.initMax++;
			this.initRuler();
			this.dispatchEvent('expanded');
		}
	},
	
	expand: function(inc, isRight) {
		if (isRight) {
			this.expandRight();
		} else {
			this.expandLeft();
		}
	},
	
	startExpand: function(isRight) {
		var _self = this;
		this.expandInterval = setInterval(function() {
			_self.expand(undefined, isRight);
			_self.setValue(_self.getValue());
		}, 25);
	},
	
	stopExpand: function(isRight) {
		clearInterval(this.expandInterval);
	},
	
	startTracking: function() {
		var _self = this;
		this.trackingInterval = setInterval(function() {
			var inc = _self.pointer.getX() - (_self.getWidth() - 2 * _self.deltaX);
			var v = _self.convertXToValue(_self.pointer.getX(), _self.deltaX);
	    	if (v >= _self.initMax-1) {
	    		if (_self.autoExpand) {
	    			_self.expand(Math.round(inc / 2), true);
	    		}
	    	} else if (v <= _self.initMin) {
	    		if (_self.autoExpand) {
	    			_self.expand(Math.round(inc / 2));
	    		}
	    	}
		}, 25);
	},
	
	stopTracking: function() {
		clearInterval(this.trackingInterval);
		this.trackingInterval = undefined;
	},
	
	drawPointer: function(x, y, deltaX, deltaY) {
		if (this.pointer) return;
        var _self = this;

        var img = new UIComponent({width: deltaX*2, height: deltaY*2});
        img.access().addClass('joo-ruler-pointer');
        img.setLocation(x, y);
        img.addEventListener('dragstart', function() {
        	_self.startTracking();
        });
        img.addEventListener('drag', function(e) {
        	_self.dispatchEvent('pointerdrag',{"position":this.getX()});
        });
        img.addEventListener('dragstop', function(e) {
        	hidetip();
        	_self.stopTracking();
        	_self.setValue(_self.convertXToValue(this.getX(), deltaX));
        });
        
        Wrapper.wrap(img, DraggableInterface);
        img.draggable({axis: 'x', containment: 'parent'});
        img.startDrag();
 
        this.pointer = img;
        
        this.addChild(img);
	},
	
	getValue: function() {
		return this.value;
	},
	
	/**
	 * Change the value of the ruler. It also updates the ruler pointer's position.
	 * @param {Number} value the new value of the ruler
	 */
	setValue: function(value) {
		var oldValue = this.value;
		if (value < this.min)
			value = this.min;
		else if (value > this.max)
			value = this.max;
		this.value = value;
		if (this.pointer) {
			if (value < this.initMin || value > this.initMax) {
				this.pointer.access().hide();
			} else {
				this.pointer.access().show();
				this.pointer.setX(this.convertValueToX(5));
			}
		}
		if (this.value != oldValue) {
			this.dispatchEvent('change');
		}
	}
});

JOOToggleBar = Sketch.extend({
	
	setupBase: function(config) {
		this.items = {};
		this.multi = config.multi;
		this.value = undefined;
		this.defaultValue = config.defaultValue;
		this._super(config);
	},
	
	setupDomObject: function(config) {
		this._super(config);
		if (config.items) {
			for (var i in config.items) {
				this.addItem(config.items[i], i);
			}
		}
	},
	
	addItem: function(item, value) {
		this.addChild(item);
		this.items[value] = item;
		item.itemId = value;
		var _self = this;
		item.addEventListener('toggle', function() {
			if (this.state)
				_self.onStateDown(item);
			else
				_self.onStateUp(item);
		});
	},
	
	getValue: function() {
		return this.value;
	},
	
	setValue: function(value) {
		this.value = value;
		this.dispatchEvent('change');
	},
	
	onStateDown: function(item) {
		if (this.getValue() != item.itemId) {
			if (this.getValue() && this.items[this.getValue()])
				this.items[this.getValue()].setState(false);
			this.setValue(item.itemId);
		}
	},
	
	onStateUp: function(item) {
		this.setValue(this.defaultValue);
	}
});

/**
 * @class A component holding another components in a list view.
 * <p>It supports additional configuration parameters</p>
 * <ul>
 * 	<li><code>readonly</code> Whether each item in the list is readonly</li>
 * </ul>
 * @augments UIComponent 
 */
JOOList = UIComponent.extend(
/** @lends	JOOList# */
{
	setupBase: function(config) {
		this.items = Array();
		this.readonly = config.readonly;
		this.selectedItem = undefined;
		this._super(config);
	},
	
	/**
	 * Add an item to the list.
	 * @param {Object} obj the item to be added, must be an object with 
	 * <code>label</code> and <code>value</code> properties
	 * @returns {JOOText} the newly added item
	 */
	addItem: function(obj) {
		var item = new Sketch();
		var text = new JOOText({lbl: obj.label, readonly: this.readonly, blurEvent: 'itemDeselected'});
		item.text = text;
		item.addChild(text);
		this.items.push(item);
		this.addChild(item);
		item.addEventListener('click', function() {
			this._parent.selectItem(this);
		});
		text.addEventListener('change', function() {
			this._parent.dispatchEvent('itemChanged');
		});
		item.value = obj.value;
		return item;
	},
	
	/**
	 * Get the current selected item.
	 * @returns {JOOText} the current selected item
	 */
	getSelectedItem: function() {
		return this.selectedItem;
	},
	
	/**
	 * Get the index of current selected item.
	 * @returns {Number} the index
	 */
	getSelectedIndex: function() {
		return this.indexOf(this.selectedItem);
	},
	
	/**
	 * Programmatically select an item.
	 * @param {JOOText} item the item to be selected
	 */
	selectItem: function(item) {
		if (item == this.selectedItem) return;
		if (this.selectedItem) {
			this.selectedItem.access().removeClass('selected');
			this.selectedItem.text.dispatchEvent('itemDeselected');
		}
		this.selectedItem = item;
		if(item){
			this.selectedItem.access().addClass('selected');
		}
		this.dispatchEvent('change');
	},
	
	setupDomObject: function(config) {
		this._super(config);
		this.setLayout('vertical');
	},
});

/**
 * @class A desktop-style dialog. It has a title bar and a content pane.
 * <p>It supports additional configuration parameters</p>
 * <ul>
 * 	<li><code>title</code> The title of the dialog</li>
 * </ul>
 * @augments UIComponent
 * @implements DraggableInterface
 */
JOODialog = UIComponent.extend(
/** @lends JOODialog# */
{
	setupDomObject: function(config) {
		this._super(config);

		this.titleBar = new Sketch();
		this.contentPane = new Sketch();
		this.titleBar.access().addClass('joo-dialog-title');
		this.contentPane.access().addClass('joo-dialog-content');

		this.addChild(this.titleBar);
		this.addChild(this.contentPane);
		
		var _self = this;
		var closeBtn = new JOOCloseButton({absolute: true});
		closeBtn.onclick = function() {
			_self.close();
		};
		var label = new JOOLabel();
		this.titleBar.addChild(label);
		this.titleBar.addChild(closeBtn);
		
		if (config.title != undefined)
			this.setTitle(config.title);
		
		this.draggable({handle: this.titleBar.access()});
		this.startDrag();
		this.addEventListener('stageUpdated', function() {
			this.afterAdded();
		});
	},
	
	/**
	 * Make the dialog centered by the screen.
	 */
	center: function() {
		var w = ($(window).width() - this.access().outerWidth())/2;
		var h = ($(window).height()-this.access().outerHeight())/2;
		this.setLocation(w < 0 ? 0 : w, h < 0 ? 0 : h);
	},
	
	afterAdded: function() {
		var modal = this.config.modal || false;
		if (modal) {
			this.modalSketch = new Sketch();
			this.modalSketch.access().addClass('joo-modal-dialog');
			this.stage.addChild(this.modalSketch, this.access());
			this.modalSketch.setStyle('z-index', parseInt(this.getStyle('z-index')-1));
			this.modalSketch.access().show();
		}
	},
	
	/**
	 * Change the title of the dialog.
	 * @param title the new title
	 */
	setTitle: function(title) {
		this.config.title = title;
		this.titleBar.getChildren()[0].setText(title);
	},
	
	/**
	 * Get the current title of the dialog.
	 * @returns {String} the current title
	 */
	getTitle: function() {
		return this.titleBar.getChildren()[0].getText();
	},
	
	/**
	 * Get the content pane of the dialog.
	 * @returns {Sketch} the content pane
	 */
	getContentPane: function() {
		return this.contentPane;
	},
	
	/**
	 * Close the dialog.
	 */
	close: function() {
		this.dispatchEvent('closing');
		if (this.modalSketch != undefined)
			this.modalSketch.selfRemove();
		this.selfRemove();
	},
	
	/**
	 * Show the dialog.
	 */
	show: function() {
		this.access().show();
	},
	
	/**
	 * Hide the dialog.
	 */
	hide: function() {
		this.access().hide();
	},
	
	toHtml: function() {
		return "<div></div>";
	}
}).implement(DraggableInterface);

AboutApplicationDialog = JOODialog.extend({
	
	setupBase: function(config) {
		this.config.modal = config.modal = false;
		this._super(config);
	},
	
	setupDomObject: function(config) {
		this._super(config);
		
		var appinfo = SingletonFactory.getInstance(ApplicationInfo);
		this.setTitle("About " + appinfo.name);
		this.setWidth(500);
		
		var sketch1 = new Sketch();
		var img = new JOOImage({src: appinfo.logo, width: 100, height: 100});
		var panel1 = new Panel();
		panel1.addChild(img);
		
		var panel2 = new Panel();
		var header = new JOOLabel({lbl: appinfo.name});
		var version = new JOOLabel({lbl: "Version " + appinfo.version});
		var description = new JOOLabel({lbl: appinfo.description});
		var font = new JOOFont();
		
		font.setFontSize('15px');
		font.setBold(true);
		header.applyFont(font);
		
		font.setFontSize('13px');
		font.setBold(false);
		font.setItalic(true);
		version.applyFont(font);
		font.setItalic(false);
		description.applyFont(font);
		
		panel2.addChild(header);
		panel2.addChild(version);
		panel2.addChild(description);
		panel2.setLayout('vertical');
		panel2.setWidth(370);
		panel2.setX(20);
		
		var copyright = new JOOLabel({lbl: "Copyright © "+appinfo.copyright+" <a href='"+appinfo.authorsUrl+"' target='_blank'>"+appinfo.authors+"</a>. All Rights Reserved"});
		var panel3 = new Panel();
		panel3.setWidth(600);
		panel3.setHeight(50);
		panel3.setY(20);
		panel3.addChild(copyright);
		
		sketch1.addChild(panel1);
		sketch1.addChild(panel2);
		sketch1.addChild(panel3);
		
		this.getContentPane().addChild(sketch1);
	},
	
	close: function() {
		if (this.modalSketch != undefined)
			this.modalSketch.access().hide();
		this.access().hide();
	}
});

/**
 * @class A slider icon, used in JOOSlider.
 * @augments Sketch
 * @implements DraggableInterface
 */
SliderIcon = Sketch.extend({
	
	setupBase: function(config) {
		this._super(config);
	},
	
	setupDomObject: function(config) {
		this._super(config);
		this.setWidth(18);
		this.setHeight(18);
		
		var _self = this;
		this.draggable({containment:'parent'});
		
		this.addEventListener("mousedown", function(e) {
			this.enable = true;
			$(window).bind("mousemove", {_self: this}, this.mouseMoveHandler);
			this.addEventListener("mousemove", this.mouseMoveHandler);
		});
		this.addEventListener("mouseup", function(e) {
			this.mouseUpHandler(e);
		});
		
		$(window).bind("mouseup", {_self: this}, this.mouseUpHandler);
	},
	
	dispose: function(skipRemove) {
		$(window).unbind("mouseup", this.mouseUpHandler);
		$(window).unbind("mousedown", this.mouseDownHandler);
		this._super(skipRemove);
	},
	
	mouseUpHandler: function(e) {
		var _self = e.data ? e.data._self || this : this;
		_self.enable = false;
		$(window).unbind("mousemove", _self.mouseMoveHandler);
		_self.removeEventListener("mousemove", _self.mouseMoveHandler);
	},
	
	mouseMoveHandler: function(e) {
		var _self = e.data ? e.data._self || this : this;
		if (_self.enable) {
			_self.dispatchEvent('slideChanged', {value: _self.getX(), ispos: "pos"});
		}
	}
}).implement(DraggableInterface);

/**
 * @class A slider, which has a draggable icon and a slide pane.
 * @augments JOOInput
 */
JOOSlider = JOOInput.extend(
/** @lends JOOSlider# */
{
	setupBase: function(config)	{
		this._super(config);
	},
	
	setupDomObject: function(config) {
		config.width = config.width || 200;
		config.height = 5;
		this._super(config);

		this.sliderIcon = new SliderIcon();
		this.value = config.value || 0;
		this.min = config.min || 0;
		this.max = config.max || 100;

		this.addChild(this.sliderIcon);
		
		this.addEventListener('stageUpdated', function() {
			this.slideTo(this.value);
		});
		
		var _self = this;
		this.sliderIcon.addEventListener("slideChanged", function(e) {
			_self.slideTo(e.value, e.ispos);
		});
		
		this.sliderIcon.addEventListener("mouseover", function(e) {
			showtip(new Number(_self.getValue()).toFixed(2));
		});
		
		this.sliderIcon.addEventListener("drag", function(e) {
			showtip(new Number(_self.getValue()).toFixed(2));
		});
		
		this.sliderIcon.addEventListener("dragstop", function(e) {
			hidetip();
		});
		
		this.sliderIcon.addEventListener("mouseout", function(e) {
			hidetip();
		});
	},
	
	/**
	 * SLide the icon to a specific value.
	 * @param {String|Number} value the value of the slider.
	 * @param {Boolean} ispos whether the <code>value</code> is position or absolute value.
	 */
	slideTo: function(value, ispos) {
		var posX = undefined;
		if(ispos){
			// position, not value anymore
			posX = value;
			value = ((parseFloat(posX)) / (this.getWidth() - 18)) * (this.max - this.min) + this.min;
			if(value < this.min){
				value = this.min;
				posX = 9;
			}
		} else {
			var oldPos = this.sliderIcon.getX();
			
			if (value < this.min) {
				value = this.min;
			}
			if (value > this.max) {
				value = this.max;
			}
			posX = (value - this.min) / (this.max - this.min) * (this.getWidth() - 18);
			
			if (oldPos == posX) 
				return;
		}
		
		this.sliderIcon.setX(posX);
		
		var rate = (value - this.min) / (this.max - this.min);
		var lWidth = rate * (this.getWidth() - 18);
		var rWidth = (1 - rate) * (this.getWidth() - 18);
		this.access().find('.active').css("width", lWidth + "px");
		this.access().find('.inactive').css("width", rWidth + "px");
		this.access().find("input").val(value);
		
		this.dispatchEvent('change');
	},

	/**
	 * Change the value of the slider.
	 * @param {Number} value the new value
	 */
	setValue: function(value) {
		this.slideTo(value);
	},
	
	/**
	 * Get the value of the slider.
	 * @returns {Number} the value of the slider
	 */
	getValue: function()	{
		return this.access().find("input").val();
	},
	
	toHtml: function()	{
		return "<div><input type='hidden'><div class='joo-slider-bg active'></div><div class='joo-slider-bg inactive'></div></div>";
	}
});

/**
 * @class A simple color picker. Wrapper of jQuery ColorPicker.
 * @augments JOOInput
 */
JOOColorPicker = JOOInput.extend(
/** @lends JOOColorPicker# */
{
	setupBase: function(config) {
		this._super(config);
	},
	
	setupDomObject: function(config) {
		config.width = 18;
		config.height = 18;
		
		this._super(config);
		
		if(!config.background ) {
			config.background = "#FFF";
		}
		
		this.shown = false;
		var _cpicker = this;
		var c = config.background.substring(1,config.background.length);
		this.access().ColorPicker({
			flat: true,
			onChange: function(){
				var hex = arguments[1];
				_cpicker.colorPickerIcon.setStyle("background-color", hex);
				_cpicker.dispatchEvent('change');
			},
			color:c
		});
		this.colorPickerIcon = new Sketch(config);
		var colorPanel = this.access().find(".colorpicker");
		this.colorPanelId = colorPanel.attr("id");
		colorPanel.css("left", "22px");
		colorPanel.css("top", "-2px");
		
		var _self = this;
		this.colorPickerIcon.addEventListener("mouseover", function() {
			showtip(_self.getValue());
		});
		
		this.colorPickerIcon.addEventListener("mouseout", function() {
			hidetip();
		});
		
		this.colorPickerIcon.addEventListener("click", function(e) {
			if(_cpicker.shown) {
				$("#"+_cpicker.colorPanelId).hide();
				_cpicker.shown = false;
			} else {
				$("#"+_cpicker.colorPanelId).show();
				_cpicker.shown = true;
			}
		});
		this.addChild(this.colorPickerIcon);
		this.colorPickerIcon.access().addClass('joo-colorpicker-icon');
		this.colorPickerIcon.setStyle("background", config.background);
	},
	
	/**
	 * Change the value of the picker.
	 * @param {String} value the new value
	 */
	setValue: function(value){
		this.colorPickerIcon.setStyle("background-color", value);
	},
	
	/**
	 * Get the value of the picker.
	 * @returns {String} the picker's value
	 */
	getValue: function(){
		return this.colorPickerIcon.getStyle("background-color");
	},
	
	toHtml: function(){
		return "<div></div>";
	}
});
JOOPropertyElement = JOOInput.extend({
	
	setupDomObject: function(config) {
		this._super(config);
		
		var label = new JOOLabel({lbl: config.lbl});
		var controlLabel = new Sketch();
		controlLabel.addChild(label);
		this.addChild(controlLabel);
		
		controlSketch = new Sketch();
		controlSketch.addChild(this.control);
		this.addChild(controlSketch);
		
		this.setLayout('flow');
		
		config.labelWidth = config.labelWidth || '40%';
		controlLabel.setWidth(config.labelWidth);
		config.controlWidth = config.controlWidth || '60%';
		controlSketch.setWidth(config.controlWidth);
		this.control.setWidth('100%');
		
		var _self = this;
		this.control.addEventListener('change', function(e) {
			if (e)
				e.stopPropagation();
			_self.dispatchEvent('change');
		});
	},
	
	setValue: function(value) {
		this.control.setValue(value);
	},
	
	getValue: function() {
		return this.control.getValue();
	}
});

JOOCheckboxProperty = JOOPropertyElement.extend({
	
	setupDomObject: function(config) {
		this.control = new JOOCheckbox();
		this._super(config);
		this.control.setWidth('');
	}
});

JOOColorProperty = JOOPropertyElement.extend({
	
	setupDomObject: function(config) {
		this.control = new JOOColorPicker();
		this._super(config);
		this.control.setWidth('');
	}
});

JOOFontChooserProperty = JOOPropertyElement.extend({
	
	setupDomObject: function(config) {
		this.control = new JOOFontSelector(config);
		this._super(config);
		this.control.setWidth('auto');
	}
});

JOOMediaProperty = JOOPropertyElement.extend({
	
	setupDomObject: function(config) {
		this.control = this.control || new JOOMediaValue(config);
		this._super(config);
	}
});

JOOMediaValue = JOOInput.extend({
	
	setupDomObject: function(config) {
		this._super(config);
		this.link = new JOOLink();
		this.mediaBrowser = new JOOMediaBrowser(config);
		this.addChild(this.link);
		this.addChild(this.mediaBrowser);
		this.mediaBrowser.access().hide();
		this.setValue(config.value);
		
		var _self = this;
		this.link.addEventListener('click', function() {
			_self.mediaBrowser.fetch();
			_self.mediaBrowser.access().show();
		});
		this.link.addEventListener('mouseover', function() {
			showtip(_self.getValue());
		});
		this.link.addEventListener('mouseout', function() {
			hidetip();
		});
		this.mediaBrowser.close = function() {
			this.access().hide();
		};
		this.mediaBrowser.addEventListener('change', function() {
			_self.onchange(this.getValue());
		});
	},
	
	onchange: function(value) {
		this.mediaBrowser.close();
		this.setValue(value);
	},

	setValue: function(value) {
		this._super(value);
		if (value == undefined)
			value = "Unspecified";
		this.link.access().html(value);
		this.dispatchEvent('change');
	},
	
	toHtml: function() {
		return "<div></div>";
	}
});

JOOSelectProperty = JOOPropertyElement.extend({
	
	setupDomObject: function(config) {
		this.control = new JOOInputSelect(config);
		this._super(config);
		this.control.setWidth('auto');
	}
});

JOOToggleBarProperty = JOOPropertyElement.extend({
	
	setupDomObject: function(config) {
		this.control = new JOOToggleBar(config);
		this._super(config);
		this.control.setWidth('auto');
	}
});

JOOToggleProperty = JOOPropertyElement.extend({
	
	setupDomObject: function(config) {
		this.control = config.control;
		this._super(config);
		var _self = this;
		this.control.addEventListener('toggle', function(){
			_self.setValue(this.state ? config.on : config.off);
		});
		this.control.setWidth('');
	},
	
	setValue: function(value) {
		this.value = (value == this.config.on) ? this.config.on : this.config.off;
		this.dispatchEvent('change');
	},
	
	getValue: function() {
		return this.value;
	}
});

JOOSliderProperty = JOOPropertyElement.extend({
	
	setupDomObject: function(config) {
		this.control = new JOOSlider({min: config.min, max: config.max, value: config.value});
		this._super(config);
		this.control.setLocation(-8, 7);
	}
});

JOOTextAreaProperty = JOOPropertyElement.extend({
	
	setupDomObject: function(config) {
		this.control = new JOOTextArea();
		this._super(config);
	}
});

JOOTextProperty = JOOPropertyElement.extend({
	
	setupDomObject: function(config) {
		this.control = new JOOTextInput();
		this._super(config);
	}
});

JOOPropertiesDialog = JOODialog.extend({
	
	setupDomObject: function(config) {
		this._super(config);
		this.setTitle('Properties');
		this.getContentPane().setLayout('vertical');
		this.supportedProperties = config.supportedProperties || this.supportedProperties || [];
		this.propertyMappings = config.propertyMappings || this.propertyMappings || {
			'colorpicker': JOOColorProperty,
			'media': JOOMediaProperty,
			'slider': JOOSliderProperty,
			'select': JOOSelectProperty,
			'text': JOOTextProperty,
			'textarea': JOOTextAreaProperty
		};
		
		this.generatePropertyElements();
		this.reloadList();
	},
	
	removeTarget: function(target) {
		if (target != undefined) {
			target.removeEventListener(this.onTargetStyle);
		}
		if (this.target == target) {
			this.target = undefined;
			this.reloadList();
		}
	},
	
	setTarget: function(target) {
		if (this.target != undefined) {
			this.target.removeEventListener(this.onTargetStyle); 
		}
		if (this.target != target) {
			if(this.target){
				currentTargetId = this.target.getId();
			}
			this.target = target;
			this.reloadList();
		}
	},
	
	onTargetStyle: function(e) {
		//generateEvent('ObjectStyleChanged', e);
	},
	
	updateList: function(e) {
		var supported = undefined;
		if (this.target)
			supported = this.target.getSupportedProperties();
		for(var i in this.props) {
			if (e.indexOf(this.props[i].options.property.name) == -1 || !this.target || !supported || (supported.indexOf(i) == -1 && supported != "all")) {
				
			} else {
				var orig = this.props[i].element.onchange;
				this.props[i].element.onchange = function() {};
				this.props[i].element.setValue(this.target.getProperty(this.props[i].options.property));
				this.props[i].element.onchange = orig;
			}
		}
	},
	
	reloadList: function() {
		var supported = undefined;
		
		if (this.target) {
			this.target._parent.addEventListener('stylechange', this.onTargetStyle);
			this.target.addEventListener('stylechange', this.onTargetStyle);
			this.target._parent.addEventListener('dragstop', this.onTargetStyle);
			supported = this.target.getSupportedProperties();
		}
		for(var i in this.props) {
			if (!this.target || !supported || (supported.indexOf(i) == -1 && supported != "all")) {
				if (this.props[i].options.autohide) {
					this.props[i].element.access().hide();
					this.props[i].element.setAttribute('hide', '');
				}
				this.props[i].element.disable(true);
			} else {
				var _self = this;
				this.props[i].element.access().removeAttr('hide');
				this.props[i].element.access().show();
				
				this.props[i].element.disable(false);
				this.props[i].element.targetProperty = this.props[i].options.property;
				this.props[i].element.setValue(this.target.getProperty(this.props[i].options.property));
				this.props[i].element.onchange = function() {
					_self.target.setProperty(this.targetProperty, this.getValue());
					_self.dispatchEvent('change');
				};
			}
		}
		
		for(var i=0; i<this.accords.length; i++) {
			var len = this.accords[i].getContentPane().access().children(':not([hide])').length;
			if (len > 0)
				this.accords[i].access().show();
			else
				this.accords[i].access().hide();
		}
	},
	
	generatePropertyElements: function() {
		this.props = Array();
		this.accords = Array();
		
		var props = this.supportedProperties;
		this.tab = new JOOTabbedPane({width: '98%'});
		this.tab.access().addClass('properties-tab');
		for(var i=0; i<props.length; i++) {
			var sketch = new Sketch();
			var cats = props[i].categories;
			for(var j=0; j<cats.length; j++) {
				var accord = new JOOAccordion({lbl: cats[j].category});
				if (cats[j].options != undefined) {
					for(var k=0; k<cats[j].options.length; k++) {
						var opt = cats[j].options[k];
						opt.config.lbl = opt.name;
						var element = new this.propertyMappings[opt.type](opt.config);
						element.onchange = function() {};
						element.addEventListener('change', function() {
							this.onchange();
						});
						accord.getContentPane().addChild(element);
						this.props[opt.id] = {element: element, options: opt};
					}
				}
				this.accords.push(accord);
				sketch.addChild(accord);
			}
			this.tab.addTab(props[i].section, sketch);
			this.tab.setTab(0);
		}
		this.getContentPane().addChild(this.tab);
	}	
}).implement(DraggableInterface);
JOOResizableComponent = UIComponent.extend({
	
	getAbsoluteAngleArray: function(editPos) {
		var _self = this;
		var angle = _self.getRotation();
		if(!editPos)
			editPos = {
				x : 0,
				y : 0
			};
		var posArr = [];
		posArr.push(getPositionFromRotatedCoordinate({
			x : 0 + editPos.x,
			y : 0 + editPos.y
		}, angle * Math.PI / 180));
		posArr.push(getPositionFromRotatedCoordinate({
			x : _self.getWidth() + editPos.x,
			y : 0 + editPos.y
		}, angle * Math.PI / 180));
		posArr.push(getPositionFromRotatedCoordinate({
			x : _self.getWidth() + editPos.x,
			y : _self.getHeight() + editPos.y
		}, angle * Math.PI / 180));
		posArr.push(getPositionFromRotatedCoordinate({
			x : 0 + editPos.x,
			y : _self.getHeight() + editPos.y
		}, angle * Math.PI / 180));
		return posArr;
	},
	
	getEditCoefPos : function(editPos) {
		var root = {
			x : Number.MAX_VALUE,
			y : Number.MAX_VALUE
		};
		var posArr = this.getAbsoluteAngleArray(editPos);
		for(var i = 0; i < posArr.length; i++) {
			if(posArr[i].x < root.x)
				root.x = posArr[i].x;
			if(posArr[i].y < root.y)
				root.y = posArr[i].y;
		}
		return root;
	},
	
	offsetBoundary : function() {
		var center = this.getRotationCenterPoint();
		var boundaryRootPosRelative = this.getEditCoefPos({
			x: -parseFloat(this.access().width())*this.rotationCenter.x,
			y: -parseFloat(this.access().height())*this.rotationCenter.y
		});
		return {
			x: center.x + boundaryRootPosRelative.x,
			y: center.y + boundaryRootPosRelative.y 
		};
	},
	
	fixingRotatedValue: function(){
		var pos1 = this.virtualNontransformedOffset();
		var pos2 = this.offsetBoundary();
		return {
			x: pos1.x - pos2.x,
			y: pos1.y - pos2.y
		};
	},
	
	beforeStartDragging: function(e) {
		var fixingValue = this.fixingRotatedValue();
		e.pageX -= fixingValue.x;
		e.pageY -= fixingValue.y;
	},
	
	setupDomObject: function(config) {
		this.wrappedObject = this.setupWrappedObject(config);
		
		this._super(config);
		this.beginEditable(undefined, undefined, undefined, true);
		
		this.addEventListener('dragstop', this.onDragStopHandler);
		this.addEventListener('click', this.onClick);
		this.addEventListener('drag', this.onDragHandler);
		this.addEventListener('mouseover', this.onMouseOverHandler);
		this.addEventListener('mouseout', this.onMouseOutHandler);
		
		this.hideResizeControl();
		
//		this.startDrag();
		this.addEventListener('stageUpdated', function() {
			this.updateArea({w: this.getWidth(), h: this.getHeight()}); 
		});
		
		this.addChild(this.wrappedObject);
	},
	
	setupWrappedObject: function() {
		
	},
	
	getWrappedObject: function() {
		return this.wrappedObject;
	},
	
	onClick: function(e) {
		this.select(e.ctrlKey);
		e.stopPropagation();
	},

	_select: function() {
		this.startDrag();
		this.showResizeControl();
		this.access().addClass('joo-selected');
	},
	
	_deselect: function() {
		this.stopDrag();
		this.hideResizeControl();
		this.access().removeClass('joo-selected');
	},
	
	onDragHandler: function(e) {},
	
	onDragStopHandler: function(e) {},
	
	onMouseOverHandler: function(e) {},
	
	onMouseOutHandler: function(e) {},
	
	onMouseUpHandler: function(e) {
		this.startDrag();
	},
	
	onMouseDownHandler: function(e) {
		this.stopDrag();
	},
	
	setRotation: function(a) {
		this._super(a);
		//this.wrappedObject.setRotation(a);
	},
	
	setWidth: function(w) {
		//this._super(w);
		var deltaW = this.wrappedObject.access().outerWidth() - this.wrappedObject.getWidth();
		this.wrappedObject.setWidth(w - deltaW);
	},
	
	setHeight: function(h) {
		//this._super(h);
		var deltaH = this.wrappedObject.access().outerHeight() - this.wrappedObject.getHeight();
		this.wrappedObject.setHeight(h - deltaH);
	}
}).implement(ResizableInterface, DraggableInterface, SelectableInterface);

JOOResizableWrapper = JOOResizableComponent.extend({
	
	setupWrappedObject: function(config) {
		return this.config.object;
	},
	
	getCanvas: function() {
		return this.canvas;
	}
});

JOOAvatarIcon = JOOImage.extend({
	
	setupBase: function(config) {
		if (config.realObject) {
			this.realObject = config.realObject;
		} else if (config.getRealObject) {
			this.getRealObject = config.getRealObject;
		}
		this._super(config);
	},
	
	setupDomObject: function(config) {
		config.width = config.width || 32;
		config.height = config.height || 32;
		
		this._super(config);
		this.draggable({helper: 'clone', revert: 'invalid'});
		this.startDrag();
		
		if (!config.passMouseDownEvent) {
			this.addEventListener('mousedown', function(e) {
				e.stopPropagation();
			});
		}
	},
	
	getRealObject: function() {
		var className = this.realObject.className;
		if (typeof className != 'string')
			return new className(this.realObject.config);
		return this.realObject;
	}
}).implement(DraggableInterface);

DroppablePanel = Panel.extend({
	
	setupDomObject: function(config) {
		this._super(config);
		this.droppable();
	}
}).implement(DroppableInterface);

DragDropController = Class.extend({
	
	init: function() {
		if (DragDropController.instance != undefined)
			throw "DragDropController is singleton and cannot be initiated";
		this.className = "DragDropController";
		this.dragDropMappings = Array();
	},
	
	registerDragDrop: function(dragElem, dropElems) {
		for(var i=0; i<dropElems.length; i++) {
			dropElems[i].possibleDroppers = dropElems[i].possibleDroppers || {};
			dropElems[i].possibleDroppers[dragElem.getId()] = dragElem;
			if (this.dragDropMappings.indexOf(dropElems[i]) == -1) 
				this.dragDropMappings.push(dropElems[i]);
		}
	},
	
	updateDragDrop: function() {
		for(var i=0; i<this.dragDropMappings.length; i++) {
			this.dragDropMappings[i].addEventListener('drop', function(e, ui) {
				var id = $(ui.draggable.context).attr('id');
				if (this.possibleDroppers[id] != undefined) {
					e.droppedObject = this.possibleDroppers[id];
					e.position = ui.position;
					this.dispatchEvent('objectDropped', e);
				}
			});
			this.dragDropMappings[i].addEventListener('objectDropped', function(e) {
				var realObject = e.droppedObject.getRealObject();
				realObject.setLocation(e.pageX - this.offset().x, e.pageY - this.offset().y);
				this.addChild(realObject);
			});
		}
	},
	
	clear: function() {
		for(var i=0; i<this.dragDropMappings.length; i++) {
			this.dragDropMappings[i].possibleDroppers = undefined;
		}
	}
});

JOOMediaBrowser = JOODialog.extend({
	
	setupDomObject: function(config) {
		this._super(config);
		this.title = config.title || "Media Browser";
		this.browseService = config.browseService;
		this.uploadService = config.uploadService;
		this.searchServices = config.searchServices;
		this.autofetch = config.autofetch;
		this._generateUI();
	},
	
	_generateUI: function() {
		this.setTitle(this.title);
		if (this.browseService || this.searchServices) {
			var tab = new JOOTabbedPane({width: 300, height: 200});
			if (this.browseService) {
				this.browseSketch = new Sketch();
				this.browseSketch.access().addClass('joo-upload-browse');
				tab.addTab('Uploaded', this.browseSketch);
			}
			if (this.searchServices) {
				var sk = new Sketch({height: 160});
				this.searchInput = new JOOTextInput({width: '100%', height: 20});
				this.searchSketch = new Sketch({height: 140});
				this.searchSketch.setStyle('overflow', 'auto');
				sk.addChild(this.searchInput);
				sk.addChild(this.searchSketch);
				tab.addTab('Search', sk);
			}
			this.getContentPane().addChild(tab);
		}
		this.buttonsContainer = new Sketch();
		this.buttonsContainer.setLayout('flow');
		this.buttonsContainer.setStyle('text-align', 'center');
		if (this.uploadService) {
			this.uploader = new JOOAdvancedUploader({
				name: 'file',
				endpoint: this.uploadService.getEndPoint(),
				control: new JOOButton({lbl: 'Upload'})
			});
			this.buttonsContainer.addChild(this.uploader);
		}
		var _self = this;
		this.urlBtn = new JOOButton({lbl: 'Enter URL'});
		this.urlBtn.addEventListener('click', function() {
			_self.showUrlInput();
		});
		
		this.urlContainer = new Sketch();
		this.urlContainer.setLayout('flow');
		this.urlInput = new JOOTextInput({width: 200, height: 25, value: 'http://'});
		this.urlInput.addEventListener('keyup', function(e) {
			_self.urlKeyup(e);
		});
		this.uploader.addEventListener('change', function(e) {
			e.stopPropagation();
		});
		this.urlInput.addEventListener('change', function(e) {
			e.stopPropagation();
		});
		var urlClose = new JOOButton({lbl: 'Cancel'});
		urlClose.addEventListener('click', function() {
			_self.urlClose();
		});
		this.urlContainer.access().hide();
		this.urlContainer.access().addClass('joo-media-url-container');

		this.urlContainer.addChild(this.urlInput);
		this.urlContainer.addChild(urlClose);
		this.buttonsContainer.addChild(this.urlBtn);
		this.getContentPane().addChild(this.buttonsContainer);
		this.getContentPane().addChild(this.urlContainer);
		
		if (this.browseService) {
			this.browseService.addEventListener('success', function(ret) {
				_self.addBrowseImages(ret);
			});
		}
		
		if (this.uploadService) {
			this.uploader.addEventListener('submitSuccess', function(ret) {
				ret = $.parseJSON(ret.data);
				ret = _self.uploadService.parse(ret.result.data);
				_self.value = ret.url;
				_self.dispatchEvent('change');
				_self.browseService.run();
			});
		}
		
		if (this.searchServices) {
			var _self = this;
			for(var i in this.searchServices) {
				this.searchServices[i].addEventListener('success', function(ret) {
					_self.addSearchImages(this.name, ret);
				});
				this[this.searchServices[i].name] = new JOOAccordion({lbl: this.searchServices[i].name});
				this.searchSketch.addChild(this[this.searchServices[i].name]);
			}
			this.searchInput.addEventListener('keydown', function(e) {
				if (e.keyCode == 13) {
					e.stopPropagation();
					e.preventDefault();
					for(var i in _self.searchServices) {
						_self.searchServices[i].run({query: this.getValue()});
					}
				}
			});
		}
		
		if (this.autofetch) {
			this.addEventListener('stageUpdated', function() {
				this.fetch();
			});
		}
	},
	
	fetch: function() {
		this.browseService.run();
	},
	
	getValue: function() {
		return this.value;
	},
	
	setValue: function(value) {
		this.value = value;
	},
	
	addSearchImages: function(name, ret) {
		while(this[name].getContentPane().children.length > 0) {
			this[name].getContentPane().removeChildAt(0);
		}
		if (ret.length > 0) {
			for(var i in ret) {
				var imgPanel = this._getImageWrapper(ret[i], 'joo-search-imgwrapper');
				this[name].getContentPane().addChild(imgPanel);
			}
		}
	},
	
	addBrowseImages: function(ret) {
		while(this.browseSketch.children.length > 0) {
			this.browseSketch.removeChildAt(0);
		}
		if (ret.length > 0) {
			for(var i in ret) {
				var imgPanel = this._getImageWrapper(ret[i].url, 'joo-browse-imgwrapper');
				this.browseSketch.addChild(imgPanel);
			}
		}
	},
	
	_getImageWrapper: function(retImg, cls) {
		var _self = this;
		var imgPanel = new Panel();
		imgPanel.access().addClass(cls);
		var img = new JOOImage({src: retImg});
		imgPanel.addChild(img);
		imgPanel.setAttribute('src', img.getAttribute('src'));
		imgPanel.addEventListener('click', function() {
			_self.value = this.getAttribute('src');
			_self.dispatchEvent('change');
		});
		return imgPanel;
	},
	
	showUrlInput: function() {
		this.buttonsContainer.access().hide();
		this.urlContainer.access().show();
		this.urlInput.focus();
	},
	
	urlKeyup: function(e) {
		if (e.keyCode == 13) {
			this.value = this.urlInput.getValue();
			this.dispatchEvent('change');
		}
	},
	
	urlClose: function() {
		this.buttonsContainer.access().show();
		this.urlContainer.access().hide();
	}
});

JOOHtmlObject = DisplayObjectContainer.extend({
	
	setupDomObject: function(config) {
		this._super(config);
		if (config.classid)
			this.setAttribute("classid", config.classid);
	},
	
	getObject: function() {
		return window[this.id];
	},
	
	toHtml: function() {
		return "<object></object>";
	}
});

JOOFontSelector = JOOInput.extend({
	
	setupDomObject: function(config) {
		this._super(config);
		this.select = new JOOInputSelect({width: '100%'});
		this.addChild(this.select);
		
		var fonts = [
		       '', 'cursive', 'monospace', 'serif', 'sans-serif', 'fantasy', 'default', 'Arial', 'Arial Black', 
		       'Arial Narrow', 'Arial Rounded MT Bold', 'Bookman Old Style', 'Bradley Hand ITC', 'Century', 
		       'Century Gothic', 'Comic Sans MS', 'Courier', 'Courier New', 'Georgia', 'Gentium', 'Impact', 
		       'King', 'Lucida Console', 'Lalit', 'Modena', 'Monotype Corsiva', 'Papyrus',
		       'Tahoma', 'TeX', 'Times', 'Times New Roman', 'Trebuchet MS', 'Verdana', 'Verona'
		];
		
		for(var i=0; i<fonts.length; i++) {
			this.select.addOption({label: fonts[i], value: fonts[i]});
		}
	},
	
	getValue: function() {
		return this.select.getValue();
	},
	
	setValue: function(value) {
		this.select.setValue(value);
	},
	
	toHtml: function() {
		return "<div></div>";
	}
});
/*JOOMovieClip = JOOSprite.extend({
	
	setupBase: function(config) {
		this._appendBaseClass('JOOMovieClip');
		this.skippedAnimation = ['position'];
		this._super(config);
	},
	
	setupDomObject: function(config) {
		this._super(config);
		this.generateData(config.data);
	},
	
	generateData: function(data) {
		this.data = data;
		this.objects = {};
		var objects = data.objects;
		for(var i in objects) {
			var obj = undefined;
			if (objects[i].obj != undefined)
				obj = objects[i].obj;
			else if (typeof objects[i].className == 'string')
				obj = new window[objects[i].className](objects[i].config);
			else
				obj = new objects[i].className(objects[i].config);
			for(var j in objects[i].attributes) {
				obj.setAttribute(j, objects[i].attributes[j]);
			}
			this.objects[objects[i].id] = obj;
			this.addChild(obj);
		}
		this.animation = data.animations;
		this.horizontalFramesNo = data.frames;
		this.verticalFramesNo = 1;
	},
	
	onReplay: function() {
		for(var i in this.objects) {
			this.removeChild(this.objects[i]);
		}
		this.generateData(this.data);
	},
	
	replay: function() {
		this.onReplay();
		this.played = false;
		this.play();
	},
	
	play: function() {
		this.oldFrame = 0;
		this.currentFrameIndex = 0;
		
		//let browser have sometime to initiate animation
		if (this.played) {
			this._super();
			return;
		}
		var _self = this;
		setTimeout(function() {
			_self.played = true;
			_self.play();
		}, 10);
	},
	
	onFrame: function(frame) {
		if (this.currentFrameIndex != 0 && frame == this.startFrame) {
			this.oldFrame = 0;
			this.currentFrameIndex = 0;
			this.onReplay();
		}
		if (this.currentFrameIndex < this.animation.length && frame == this.oldFrame) {
			console.log('hehe');
			//calculate the time needed to complete the current animation set
			var framesDiff = this.animation[this.currentFrameIndex].keyFrame - this.oldFrame;
			this.oldFrame = this.animation[this.currentFrameIndex].keyFrame;
			if (this.oldFrame == 0)
				this.oldFrame = 1;
			var timeDiff = parseFloat(framesDiff / this.framerate);
			for(var i in this.objects) {
				this.objects[i].access().stop(true, true);
				this.objects[i].animations = Array();
				this.objects[i].effects = Array();
			}
			//parse the current animation
			//TODO: Implement a way to allow moving this code segment to the constructor
			var animations = this.animation[this.currentFrameIndex].animations;
			for(var i=0; i<animations.length; i++) {
				if (animations[i].actions) {
					var actions = animations[i].actions.split(';');
					for(var j=0; j<actions.length; j++) {
						var actionArr = actions[j].split(':');
						if (actionArr.length == 2) {
							var key = actionArr[0].trim();
							var value = actionArr[1].trim();
							if (key.length > 0 && this.skippedAnimation.indexOf(key) == -1)
								this.objects[animations[i].object].animations[key] = value;
						}
					}
				}
				
				if (animations[i].effects) {
					var effects = animations[i].effects;
					for(var j=0; j<effects.length; j++) {
						var key = effects[j].name;
						var value = effects[j].option;
						if (key && key.length > 0) {
							this.objects[animations[i].object].effects[key] = value;
						}
					}
				}
				
				//calling scripts if any
				if (animations[i].script) {
					animations[i].script.call(this, frame);
				}
			}
			//run the animation
			for(var i in this.objects) {
				var animations = this.objects[i].animations;
				var keys = Array();
				for(var key in animations) {
					keys.push(key);
				}
				if (keys.length > 0) {
					if (timeDiff > 0) {
						
						this.objects[i].setCSS3Style('transition-duration', timeDiff+'s');
						this.objects[i].setCSS3Style('transition-property', keys.join(','));
					}
					for(var key in animations) {
						this.objects[i].setStyle(key, animations[key]);
					}
				} else {
					this.objects[i].setCSS3Style('transition-duration', '');
				}

				var effects = this.objects[i].effects;
				for(var j in effects) {
					if (typeof this.objects[i]['runEffect'] == 'undefined') {
						Wrapper.wrap(this.objects[i], EffectableInterface);
					}
					for(var name in effects) {
						this.objects[i].runEffect(name, effects[name], timeDiff * 1000);
					}
					break;
				}
			}
			this.currentFrameIndex++;
		}
	}
});*/

JOOAnimationData = Class.extend({
	
	init: function(config) {
		this.object = config.object;
		this.start = config.start;
		this.end = config.end;
		this.duration = config.duration;
		this.delay = config.delay;
	}
});

/**
 * @class A movie clip is a sprite with custom animation, it also supports script.
 * <p>It supports additional configuration parameters</p>
 * <ul>
 * 	<li><code>data</code> The animation data</li>
 * </ul>
 * @augments JOOSprite
 */
JOOMovieClip = JOOSprite.extend({
	
	setupBase: function(config) {
		this.skippedAnimation = ['position'];
		this.scripts = {};
		this.intervals = Array();
		this._super(config);
	},
	
	setupDomObject: function(config) {
		this._super(config);
		this.generateData(config.data);
	},
	
	generateData: function(data) {
		this.animationsMeta = Array();
		this.data = data;
		this.objectDefs = {};
		this.objects = {};
		var objects = data.objects;
		for(var i in objects) {
			this.objectDefs[objects[i].name] = objects[i];
		}
		this.buildStage();
		this.buildAnimations();
		this.buildScript();
	},
	
	buildScript: function(){
		if(this.data.scripts){
			this.scripts = this.data.scripts;
		}
	},
	
	buildStage: function() {
		var stageDef = this.data.stage;
		this.animStage = new window[stageDef.className](stageDef.config);
		var children = stageDef.children;
		for(var i in children) {
			var obj = this.buildChildren(children[i]);
			this.animStage.addChild(obj);
		}
		this.addChild(this.animStage);
	},
	
	buildChildren: function(child) {
		var objDef = this.objectDefs[child.ref];
		if (objDef == undefined) throw child.ref+" is not undefined";
		var obj = undefined;
		obj = new window[objDef.className](objDef.config);
		// build attribute
		for(var i in objDef.attributes){
			obj.setAttribute(i,objDef.attributes[i]);
		}
		obj.setStyle("display","none");
		if(!obj.getStyle("position")){ obj.setStyle("position","absolute"); }
		if (objDef.type == "composition") {
			//obj.setLayout('absolute');
			for (var i in objDef.children) {
				var _child = this.buildChildren(objDef.children[i]);
				obj.addChild(_child);
			}
		}
		if (child.id) {
			this.objects[child.id] = obj;
		}
		if( obj.play ){
			obj.play();
		}
		this[objDef.varName] = obj;
		return obj;
	},
	
	buildAnimations: function() {
		//this.animations = this.data.animations;
		this.actions = {};
		for(var i in this.data.actions) {
			this.actions[this.data.actions[i].name] = this.data.actions[i];
		}
		this.animations = {};
		for(var i in this.data.animations) {
			var delay = this.data.animations[i].delay;
			this.animations[delay] = this.animations[delay] || new Array();
			this.animations[delay].push(this.data.animations[i]);
		}
		this.horizontalFramesNo = this.data.frames;
		this.verticalFramesNo = 1;
	},
	
	_stripOldAnimationsMeta: function() {
		var frame = this.currentFrame;
		for(var i=this.animationsMeta.length-1; i>=0; i--) {
			if (frame - this.animationsMeta[i].delay >= this.animationsMeta[i].duration) {
				this.animationsMeta.splice(i, 1);
			}
		}
	},
	
//	pause: function() {
//		this._stripOldAnimationsMeta();
//		for (var i in this.animationsMeta) {
//			var meta = this.animationsMeta[i];
//			meta.object.setCSS3Style('transition-duration', '');
//			var styles = meta.object.getAttribute('style').split(';');
//			for(var j in styles) {
//				var kv = styles[j].split(':');
//				if (kv && kv.length == 2) {
//					console.log();
//					if (kv[0].indexOf('transition') == -1) {
//						meta.object.setStyle(kv[0], meta.object.getStyle(kv[0]));
//					}
//				}
//			}
//		}
//		this._super();
//	},
	
	play: function() {
		if (this.played) {
			this._super();
			return;
		}
		var _self = this;
		setTimeout(function() {
			_self.played = true;
			_self.play();
		}, 10);
	},
	
	onFrame: function(frame) {
		var animations = this.animations[frame];
		if (animations) {
			for(var i in animations) {
				if (animations[i].script_ref)
					this.callScript(animations[i]);
				else
					this.playAnimation(animations[i], 0);
			}
		}
		//for(var i in this.animations) {
			//var animation = this.animations[i];
			//this.playAnimation(animation, 0);
		//}
	},
	
	callScript: function(animation) {
		//var fn = window[animation.script_ref];
		var fn = this.scripts[animation.script_ref];
		if(!fn){
			fn = window[animation.script_ref];
		}
		if (fn) {
			var args = animation.script_args;
			if (args == undefined || args == "")
				args = "[]";
			try {
				fn.apply(this, JSON.parse(args));
			} catch (e) {
				log(e);
			}
		}
	},
	
	playAnimation: function(animation, time) {
		if (time >= animation.loop && animation.loop != -1) return;
		var objRef = animation.object_ref.split('#');
		var obj = this.objects[objRef[0]];
		for(var i=1; i<objRef.length; i++) {
			obj = obj.children[objRef[i]];
		}
		var actions = this.actions[animation.action_ref];
		var _self = this;
		obj.setCSS3Style('transition-timing-function', 'linear');
		this.animationsMeta.push(new JOOAnimationData({
			object: obj,
			delay: animation.delay,
			start: actions.start, 
			end: actions.end, 
			duration: actions.duration
		}));
		_self.doPlayAnimation([obj, actions, time, animation]);
		
		//setTimeout(function(args) {
			//_self.doPlayAnimation(args);
			// var i = setInterval(function(args) {
			// 	_self.doPlayAnimation(args);
			// }, args[1].interval, args);
			// _self.intervals.push(i);
		//}, animation.delay, [obj, actions, time, animation]);
	},
	
	doPlayAnimation: function(args) {
		var _obj = args[0];
		var _actions = args[1];
		_obj.setCSS3Style('transition-property', '');
		_obj.setCSS3Style('transition-duration', '');
		var keys = this.setStyles(_obj, _actions.start);
		_obj.getStyle('-webkit-transform');
		
		var duration = _actions.duration / this.framerate * 1000;
		_obj.setCSS3Style('transition-duration', duration+'ms');
		_obj.setCSS3Style('transition-property', keys.join(','));
		//console.log(_obj.className,JSON.stringify(_obj.getStyle('-webkit-transition-duration')));
		
		this.setStyles(_obj, _actions.end);
	},
	
	setStyles: function(obj, actions) {
		var styles = actions.split(';');
		var keys = Array();
		for(var i in styles) {
			var kv = styles[i].split(':');
			if (kv.length < 2) continue;
			var k = kv[0].trim();
			var v = kv[1].trim();
			keys.push(k);
			obj.setStyle(k, v);
		}
		return keys;
	},
	
	dispose: function() {
		for(var i in this.intervals){
			clearInterval(this.intervals[i]);
		}
		this._super();
	}
});

JOOSpriteAnimation = UIComponent.extend({
	
	setupBase: function(config) {
		this._super(config);
		this.sprite = new JOOSprite(config);
	},
	
	setupDomObject: function(config) {
		this._super(config);
		this.addChild(this.sprite);
		var _self = this;
		setTimeout(function(){
			_self.sprite.play(config.startFrame,config.endFrame);
		},300);
	},
	
	toHtml: function() {
		return "<div></div>";
	}
});
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
JOOService = EventDispatcher.extend({
	
	init: function(endpoint, method) {
		this._super();
		this.name = "DefaultService";
		this.endpoint = endpoint || "";
		this.method = method || "get";
	},
	
	run: function(params) {
		var _self = this;
		this.onAjax(this.endpoint, params, this.method, {
			onSuccess: function(ret) {
				ret = _self.parse(ret);
				_self.dispatchEvent('success', ret);
				JOOUtils.generateEvent('ServiceSuccess', this.name, ret);
			},
			onFailure: function(msg) {
				msg = _self.parseError(msg);
				_self.dispatchEvent('failure', msg);
				JOOUtils.generateEvent('ServiceFailure', this.name, msg);
			}
		});
	},
	
	parse: function(ret) {
		return ret;
	},
	
	parseError: function(msg) {
		return msg;
	},
	
	getEndPoint: function() {
		return this.endpoint;
	}
}).implement(AjaxInterface);

/**
 * @class A model which supports property change event.
 * @augments EventDispatcher
 */
JOOModel = EventDispatcher.extend({
	
	bindings: function(obj, path) {
		path = path || "";
		obj = obj || this;
		for(var i in obj) {
			this._bindings(obj, i, path);
		}
	},
	
	notifyChange: function(path, params) {
		this.dispatchEvent('change', {type: 'manual', path: path, params: params});
	},
	
	setPropertyAndBind: function(obj, i, value) {
		obj[i] = value;
		this._bindings(obj, i, obj.__path__);
	},
	
	_bindings: function(obj, i, path) {
		if (i == 'className' || i == 'ancestors' || i == 'listeners' || i =='_bindingName_') 
			return;
		if (path == "") {
			path = i;
		} else {
			path += "['"+i+"']";
		}
		if (typeof obj[i] != 'function') {
			if (obj[i] instanceof Object || obj[i] instanceof Array ) {
				if (obj[i] instanceof Array) {
					this.bindForArray(obj[i], path);
				}
				this.bindings(obj[i], path); //recursively bind
			}
			this.bindForValue(obj, i, path);
		}
	},
	
	bindForArray: function(obj, path) {
		var _self = this;
	    var length = obj.length;
	    obj.__defineGetter__("length", function() {
			return length;
		});
	    this.hookUp(obj, 'push', path, function(item) {
	    	_self._bindings(obj, obj.length-1, path);
	    });
	    this.hookUp(obj, 'pop', path);
	    this.hookUp(obj, 'splice', path, function() {
	    	for(var i=2; i<arguments.length; i++) {
	    		_self._bindings(obj, obj.length-arguments.length-i, path);
	    	}
	    });
	},
	
	hookUp: function(obj, fn, path, callback) {
		var _self = this;
		var orig = obj[fn];
	    obj[fn] = function() {
	    	orig.apply(obj, arguments);
	    	callback.apply(undefined, arguments);
	    	_self.dispatchEvent('change', {type: 'function', functionName: fn, arguments: arguments, path: path});
	    };
	},
	
	bindForValue: function(obj, i, path) {
		var _self = this;
		var prop = "_"+i;
		obj[prop] = obj[i];
		obj[i] = undefined;
		delete obj[i];
		
		obj.__path__ = path;
		
		if (!obj.__lookupGetter__(i)) {
			obj.__defineGetter__(i, function() {
		        return obj[prop];
		    });
		}
		if (!obj.__lookupSetter__(i)) {
			obj.__defineSetter__(i, function(val) {
				var oldValue = obj[prop];
				if (oldValue != val) {
					obj[prop] = val;
					_self.dispatchEvent('change', {type: 'setter', value: val, prop: i, path: path});
				}
		    });
		}
	}
});

/**
 * Create or extend model from ordinary object
 * @param {Object} obj the object 
 * @param {JOOModel} model existing model 
 * @returns the result model
 */
JOOModel.from = function(obj, model) {
	model = model || new JOOModel();
	for(var i in obj) {
		model[i] = obj[i];
	}
	model.bindings();
	return model;
};
PluginManager = Class.extend(
/** @lends PluginManager# */	
{
	/**
	 * Initialize fields
	 * @class Manages all registered plugins
	 * @singleton
	 * @augments Class
	 * @implements ObserverInterface
	 * @constructs
	 */
	init: function()	{
		if(PluginManager.singleton == undefined){
			throw "Singleton class, can not be directly created !";
			return undefined;
		}
		var subject = SingletonFactory.getInstance(Subject);
		subject.attachObserver(this);
		this.plugins = Array();
	},
	
	/**
	 * Add plugin to the manager
	 * @param {PluginInterface} plugin the plugin to be added
	 * @param {Boolean} delay whether the plugin should not be loaded after added
	 */
	addPlugin: function(plugin, delay)	{
		if (delay != true)
			plugin.onLoad();
		this.plugins.push(plugin);
	},
	
	/**
	 * Remove plugin at the specified index
	 * @param {Number} index the index of the plugin to be removed
	 */
	removePlugin: function(index)	{
		var plugin = this.plugins[index];
		if (plugin != undefined)	{
			plugin.onUnload();
			this.plugins.splice(index, 1);
		}
	},
	
	/**
	 * Get all plugins
	 * @returns {Array} the current maintained plugins
	 */
	getPlugins: function()	{
		return this.plugins;
	},
	
	/**
	 * Remove every plugins managed by this manager
	 */
	removeAllPlugins: function()	{
		for(var i=0;i<this.plugins.length;i++)	{
			var plugin = this.plugins[i];
			if (plugin.isLoaded())	{
				plugin.onUnload();
			}
		}
		this.plugins = Array();
	},
	
	/**
	 * Triggered by the Subject and in turn triggers all plugins that it manages
	 * @param {String} eventName the event name
	 * @param {Object} eventData the event data
	 */
	notify: function(eventName, eventData)	{
		for(var i=0;i<this.plugins.length;i++)	{
			var plugin = this.plugins[i];
			if (plugin.isLoaded())	{
				var methodName = "on"+eventName;
				if (typeof plugin[methodName] != 'undefined')	{
					var method = plugin[methodName];
					method.call(plugin, eventData);
				}
			}
		}
	},
	
	toString: function() {
		return "PluginManager";
	}
}).implement(ObserverInterface);

/**
 * @class The plugin interface. Every plugins must implement this interface.
 * A plugin is a class which provides extra functions via "Event Hook". It
 * registers a list of hooks which is called automatically in the corresponding
 * events.
 * @augments ObserverInterface
 * @interface
 */
PluginInterface = InterfaceImplementor.extend({
	implement: function(obj)	{

		obj.prototype.toString = obj.prototype.toString || function() {
			return this.name;
		};
		
		/**
		 * Get the init parameters supplied by configuration.
		 * This is usually configured in a <code>layout.txt</code>
		 * @methodOf PluginInterface#
		 * @name getInitParameters 
		 * @returns {Array} the init parameters supplied by configuration
		 */
		obj.prototype.getInitParameters = obj.prototype.getInitParameters || function()	{
			if (this.initParams == undefined)
				this.initParams = Array();
			return this.initParams;
		};
		
		/**
		 * Change the init parameters. This method is not intended to be used
		 * by developers.
		 * @methodOf PluginInterface#
		 * @name setInitParameters 
		 * @param {Object} params the init parameters
		 */
		obj.prototype.setInitParameters = obj.prototype.setInitParameters || function(params)	{
			this.initParams = params;
		};

		/**
		 * Test if the plugin is loaded.
		 * @methodOf PluginInterface#
		 * @name isLoaded 
		 * @param {Boolean} <code>true</code> if the plugin is successfully loaded
		 */
		obj.prototype.isLoaded = obj.prototype.isLoaded || function()	{
			if (this.loaded == undefined)
				this.loaded = false;
			return this.loaded;
		};
		
		/**
		 * Get the plugin name.
		 * @methodOf PluginInterface#
		 * @name getName
		 * @param {String} the name of the plugin
		 */
		obj.prototype.getName = obj.prototype.getName || function()	{
			return this.className;
		};
		
		/**
		 * Called automatically by {@link PluginManager} when the plugin is
		 * loaded . Change the status of the plugin and call the 
		 * <code>onBegin</code> method. Developers should override the 
		 * <code>onBegin</code> method instead.
		 * @methodOf PluginInterface#
		 * @name onLoad
		 */
		obj.prototype.onLoad = obj.prototype.onLoad || function()	{
			this.loaded = true;
			this.onBegin();
		};
		
		/**
		 * Called inside <code>onLoad</code> method. Developers can override this
		 * method to do some stuffs when the plugin is loaded.
		 * @methodOf PluginInterface#
		 * @name onBegin
		 */
		obj.prototype.onBegin = obj.prototype.onBegin || function() {};
		
		/**
		 * Called inside <code>onUnload</code> method. Developers can override this
		 * method to release resources before the plugin is unloaded.
		 * @methodOf PluginInterface#
		 * @name onEnd
		 */
		obj.prototype.onEnd = obj.prototype.onEnd || function() {};
		
		/**
		 * Called automatically by {@link PluginManager} when the plugin is
		 * no longer need. Change the status of the plugin and call the 
		 * <code>onEnd</code> method. Developers should override the 
		 * <code>onEnd</code> method instead.
		 * @methodOf PluginInterface#
		 * @name onUnload
		 */
		obj.prototype.onUnload = obj.prototype.onUnload || function()	{
			this.loaded = false;
			this.onEnd();
		};
		
		//super interfaces
		new ObserverInterface().implement(obj);
	}
});

/**
 * @class Interval timer interface. Used for circular behaviour.
 * @interface
 */
IntervalTimerInterface = InterfaceImplementor.extend({
	implement: function(obj)	{
		
		/**
		 * Start the timer.
		 * @methodOf IntervalTimerInterface#
		 * @param {Number} interval the interval
		 * @param {Function} callback the callback function
		 * @name startInterval
		 */
		obj.prototype.startInterval = obj.prototype.startInterval || function(interval, callback)	{
			//stop previous interval timer if any
			if (this.intervalSetup == true)	{
				this.stopInterval();
			}
			this.intervalSetup = true;
			var _this = this;
			this.currentIntervalID = setInterval(function() {callback.call(_this);}, interval);
		};
		
		/**
		 * Stop the timer.
		 * @methodOf IntervalTimerInterface#
		 * @name stopInterval
		 */
		obj.prototype.stopInterval = obj.prototype.stopInterval || function()	{
			if (this.currentIntervalID != undefined)
				clearInterval(this.currentIntervalID);
			else	{
				//console.warn('bug! currentIntervalID not defined');
			}
		};
	}
});
Page = Class.extend(
/** @lends Page# */
{
	
	/**
	 * Initialize fields
	 * @class Page is a class for attaching portlets to appropriate position.
	 * Page manages the display, the {@link PluginManager} & the {@link PortletContainer}.
	 * @augments Class
	 * @constructs
	 */
	init: function(){
		if(Page.singleton == undefined){
			throw "Page is Singleton !";
			return undefined;
		}
		this.portletContainer = SingletonFactory.getInstance(PortletContainer);
		this.pluginManager = SingletonFactory.getInstance(PluginManager);
		this.pagename = "";
		this.title = "";
		this.cache = {};
	},
	
	/**
	 * Adds & loads portlets to the page.
	 * It will also handle portlets lifecycle. Portlets which are no longer needed
	 * will be unloaded. Portlets which exists between multiple pages will be
	 * reloaded.
	 */
	attachPortlets: function(){
		/*
		 * check for consistency with layout in here
		 * + portlet existence
		 * + portlet position
		 * + portlet active (?)
		 */
		for( var item in this.layout ){
			item = this.layout[item];
			if(item.active == undefined){
				item.active = true;
			}
			if (item.params == undefined)	{
				item.params = Array();
			}
			var existed = false;
			for( var i=0; i<this.portletContainer.portlets.length; i++ )	{
				item.id = item.id || item.portlet;
				var portletMeta = this.portletContainer.portlets[i];
				if( item.id === portletMeta.id ){
					existed = true;
					portletMeta.portlet.setInitParameters(item.params);
					if( item.position === portletMeta.position ){
						if( item.active !== portletMeta.active ){
							portletMeta.active = item.active;
							// FIXME: portletMeta.portlet.active ~> something like this must be implemented
						}
					}else{
						portletMeta.position = item.position;
						this.portletContainer.movePortlet(portletMeta,item.position);
					}
					if ( item.active == true)	{
						//portlet need reload?
						try {
							portletMeta.portlet.onReloadPage();
						} catch (err)	{
							log(err);
						}
					}
					break;
				}
			}
			if(!existed){
				if (window[item.portlet] == undefined)	{
					log('portlet '+item.portlet+' is undefined');
				} else {
					var portlet = new window[item.portlet]();
					portlet.setInitParameters(item.params);
					this.portletContainer.addPortlet(portlet,item);
				}
			}
		}
		var portletsToRemoved = Array();
		for( var i=0; i<this.portletContainer.portlets.length; i++ )	{
			var portletMeta = this.portletContainer.portlets[i];
			var keep = false;
			for(var item in this.layout){
				item = this.layout[item];
				if( item.id === portletMeta.id ){
					if (item.active == false)	{
						this.portletContainer.deactivatePortlet(portletMeta);
					}
					keep = true;
					break;
				}
			}
			if(!keep){
				portletsToRemoved.push(portletMeta);
			}
		}
		for(var i=0;i<portletsToRemoved.length;i++)	{
			var plt = portletsToRemoved[i];
			var indexOf = this.portletContainer.portlets.indexOf(plt);
			this.portletContainer.removePortlet(indexOf);
		}
	},
	
	/**
	 * Parse the layout for a specific page.
	 * @param {String} pagename the name of the page
	 * @returns {Object} the layout of the page
	 */
	generateData: function(pagename) {
		if (this.cache[pagename]) return this.cache[pagename];
		var data = {};
		var tmp = {};

		if (pagename == undefined)	{
			throw {"Exception": "NotFound", "Message": "Page name is undefined"};
			return undefined;
		}
		var app = SingletonFactory.getInstance(Application);
		var jsonObj = app.getResourceManager().requestForResource("portlets", pagename, undefined, true);
		if (jsonObj == undefined)	{
			//console.error(pagename+' not exist!');
			throw {"Exception": "NotFound", "Message": 'Page name "'+pagename+'" not found!'};
			return undefined;
		}
		this.title = jsonObj.attr('title');
		
		var jsonText = jsonObj.html();
		tmp = eval("("+jsonText+")");
		data.parent = tmp.parent;
		data.plugins = tmp.plugins;
		data.layout = tmp.portlets;
		var i,j;
		var toAddPlugins = new Array();
		var toAddPortlets = new Array();
		while(data.parent != undefined) {
			jsonObj = app.getResourceManager().requestForResource("portlets",data.parent, undefined, true);
			if (jsonObj == undefined)	{
				//console.error(data.parent+' not exist!');
				throw {"Exception": "NotFound", "Message": '(Parent)Page name "'+data.parent+'" not found!'};
				return undefined;
			}
			jsonText = jsonObj.html();
			toAddPlugins = new Array();
			toAddPortlets = new Array();
			tmp = eval("("+jsonText+")");
			for( i=0; i<tmp.plugins.length; i++ )	{
				var existed = false;
				for( j=0; j<data.plugins.length; j++ )	{
					if(tmp.plugins[i].plugin == data.plugins[j].plugin){
						existed = true;
						break;
					}
				}
				if(!existed){
					toAddPlugins.push(tmp.plugins[i]);
				}
			}
			for( i=0; i<tmp.portlets.length; i++ )	{
				var existed = false;
				for( j=0; j<data.layout.length; j++ )	{
					if(tmp.portlets[i].portlet == data.layout[j].portlet){
						existed = true;
						break;
					}
				}
				if(!existed){
					toAddPortlets.push(tmp.portlets[i]);
				}
			}
			for( i=0;i<toAddPlugins.length;i++ ){
				data.plugins.push(toAddPlugins[i]);
			}
			for( i=0;i<toAddPortlets.length;i++ ){
				data.layout.push(toAddPortlets[i]);
			}
			data.parent = tmp.parent;
		}
		/*
		if(tmp.position != undefined){
			data.template = app.getResourceManager().requestForResource("page",pagename).html();
			data.position = tmp.position;
		}
		*/
		this.cache[pagename] = data;
		return data;
	},
	
	/**
	 * Get the current request.
	 * @returns {Request} the current request
	 */
	getRequest: function(){
		return this.request;
	},
	
	/**
	 * Change the current request.
	 * This method <b>should not</b> be called by developers
	 * @param {Request} request the new request
	 */
	setRequest: function(request){
		this.request = request;
	},
	
	/**
	 * Attach plugins to the page. 
	 * Plugins are treated the same way as portlets.
	 */
	attachPlugins: function(){
		var oldPlugins = this.pluginManager.getPlugins();
		for(var i in oldPlugins)	{
			var oldPlg = oldPlugins[i];
			oldPlg.keep = false;
		}
		
		for (var j in this.plugins)	{
			var newPlg = this.plugins[j];
			//check if the plugin exists
			var existed = false;
			for(var i=0; i<oldPlugins.length; i++)	{
				existed = false;
				var oldPlg = oldPlugins[i];
				if (oldPlg.getName() == newPlg.plugin)	{
					oldPlg.setInitParameters(newPlg.params);
					oldPlg.keep = true;
					existed = true;
					break;
				}
			}
			if (!existed)	{
				if(window[newPlg.plugin] == undefined){
					
				} else {
					var plugin = new window[newPlg.plugin];
					plugin.setInitParameters(newPlg.params);
					plugin.keep = true;
					this.pluginManager.addPlugin(plugin, eval(newPlg.delay));
				}
			}
		}
		
		//find plugins that need to be removed
		var pluginsToRemoved = Array();
		for(var i in oldPlugins){
			var oldPlg = oldPlugins[i];
			if (oldPlg.keep != true)	{
				//console.log('plugin removed: '+oldPlg.getName());
				pluginsToRemoved.push(oldPlg);
			}
		}
		
		//removed unused plugins
		for(var i=0;i<pluginsToRemoved.length;i++)	{
			var plg = pluginsToRemoved[i];
			var indexOf = this.pluginManager.getPlugins().indexOf(plg);
			this.pluginManager.removePlugin(indexOf);
		}
		
		JOOUtils.generateEvent('ReloadPlugin');
//		//console.log('newplugin', this.pluginManager.getPlugins());
	},
/*
	attachTemplate: function(){
		if(this.position != undefined){
				//console.log("attachTemplate");
				this.temp = new Array();
				for(var i in $("#"+this.position).children()){
					if(!isNaN(i)){
						var obj = $($("#"+this.position).children()[i]);
						obj.detach();
						this.temp.push(obj);
					}
				}
				//console.log("position:"+this.position);
				$("#"+this.position).html(this.template);
		}
	},
	
	wrapUpDisplay: function(){
		if(this.position != undefined){
			var tmp = new Array();
			for(var i in $("#"+this.position).children()){
				if(!isNaN(i)){
					var obj = $($("#"+this.position).children()[i]);
					obj.detach();
					tmp.push(obj);
				}
			}
			
			$("#"+this.position).html(tmp);
		}
	},
*/
	
	/**
	 * Called when the page begins its routine.
	 * Parse the layout and attach plugins.
	 * @param {String} pagename the page name
	 */
	onBegin: function(pagename)	{
		var data = this.generateData(pagename);
		if (data == undefined)
			return;
		this.pagename = pagename;
		this.layout = data.layout;
		this.plugins = data.plugins;
		this.attachPlugins();
		JOOUtils.generateEvent("PageBegan");
	},
	
	/**
	 * Execute the page, attach portlets.
	 */
	run: function()	{
		/*
		this.attachTemplate();
		*/
		this.attachPortlets();
		JOOUtils.generateEvent("AllPorletAdded");
		this.portletContainer.loadPortlets();
		JOOUtils.generateEvent("AllPorletLoaded");
		/*
		this.wrapUpDisplay();
		*/
	},
	
	onEnd: function()	{
		
	},
	
	dispose: function()	{
		
	},
	
	toString: function() {
		return "Page";
	}
});
/**
 * @class A component used as a view of 1 portlet.
 * Further version will allow user to interact with
 * the portlet.
 * @augments Graphic
 */
PortletCanvas = Graphic.extend({

	setupBase: function(config) {
		this._appendBaseClass('PortletCanvas');
		this._super(config);
	},
	
	setupDomObject: function(config)	{
		this._super(config);
		this.access().addClass('portlet');
		this.access().addClass('portlet-canvas');
	}
});

/**
 * @class An interface for all portlets.
 * A portlet is a pluggable UI components that is managed
 * and rendered by JOO framework. A portlet is independent
 * from the rest of the application.
 * @interface
 */
PortletInterface = InterfaceImplementor.extend({
	implement: function(obj)	{
		
		obj.prototype.toString = obj.prototype.toString || function() {
			return this.getName();
		};
		
		/**
		 * Get the name of the portlet. By default, it equals to the className of the
		 * portlet.
		 * @methodOf PortletInterface#
		 * @name getName
		 * @returns {String} The name of the portlet.
		 */
		obj.prototype.getName = obj.prototype.getName || function()	{
			return this.className;
		};
		
		/**
		 * Called automatically by JOO framework when the portlet is initialized.
		 * @methodOf PortletInterface#
		 * @name onBegin
		 */
		obj.prototype.onBegin = obj.prototype.onBegin || function(){};
		
		/**
		 * Called automatically by JOO framework when the portlet is loaded into DOM.
		 * @methodOf PortletInterface#
		 * @name run
		 */
		obj.prototype.run = obj.prototype.run || function(){};
		
		/**
		 * Called automatically by JOO framework when the portlet is reloaded.
		 * @methodOf PortletInterface#
		 * @name onReloadPage
		 */
		obj.prototype.onReloadPage = obj.prototype.onReloadPage || function()	{};
		
		/**
		 * Called automatically by JOO framework when the portlet is no longer needed.
		 * @methodOf PortletInterface#
		 * @name onEnd
		 */
		obj.prototype.onEnd = obj.prototype.onEnd || function(){};
		
		/**
		 * Get the placeholder (container) of the portlet.
		 * @methodOf PortletInterface#
		 * @name getPortletPlaceholder
		 * @returns {PortletPlaceholder} the placeholder of the portlet
		 */
		obj.prototype.getPortletPlaceholder = obj.prototype.getPortletPlaceholder || function()	{
			return this.placeholder;
		};
		
		/**
		 * Change the placeholder (container) of the portlet.
		 * This method is not intended to be used by developers.
		 * @methodOf PortletInterface#
		 * @name setPortletPlaceholder
		 * @param {PortletPlaceholder} plhd the new placeholder of the portlet
		 */
		obj.prototype.setPortletPlaceholder = obj.prototype.setPortletPlaceholder || function(plhd)	{
			this.placeholder = plhd;
		};
		
		/**
		 * Get the page instance
		 * @methodOf PortletInterface#
		 * @name getPage
		 * @returns {Page} the page instance
		 */
		obj.prototype.getPage = obj.prototype.getPage || function()	{
			return SingletonFactory.getInstance(Page);
		};
		
		/**
		 * Get the init parameters of the portlet. These parameters are
		 * usually configured in a <code>layout.txt</code>
		 * @methodOf PortletInterface#
		 * @name getInitParameters
		 * @param {Page} the page instance
		 */
		obj.prototype.getInitParameters = obj.prototype.getInitParameters || function()	{
			if (this.initParams == undefined)
				this.initParams = Array();
			return this.initParams;
		};
		
		/**
		 * Change the init parameters. This method is not intended to be used
		 * by developers.
		 * @methodOf PortletInterface#
		 * @name setInitParameters 
		 * @param {Object} params the init parameters
		 */
		obj.prototype.setInitParameters = obj.prototype.setInitParameters || function(params)	{
			this.initParams = params;
		};
		
		/**
		 * Get the current request
		 * @methodOf PortletInterface#
		 * @name getRequest
		 * @param {Request} the current request
		 */
		obj.prototype.getRequest = obj.prototype.getRequest || function()	{
			return this.getPage().getRequest();
		};
		
		obj.prototype.requestForMatchingEffectiveResource = obj.prototype.requestForMatchingEffectiveResource || function(resourceName, condition)	{
			var app = SingletonFactory.getInstance(Application);
			var rm = app.getResourceManager();
			return rm.requestForCustomResource("#effective-area #"+this.getName()+"-"+resourceName+" "+condition);
		};
		
		/**
		 * Get the portlet resource. This resource resides in the portlet template
		 * and is not visible to users.
		 * @methodOf PortletInterface#
		 * @name getPortletResource
		 * @param resourceName the name (or ID) of the resource
		 * @returns {Resource} the portlet (means template) resource with matching name
		 */
		obj.prototype.getPortletResource = obj.prototype.getPortletResource || function(resourceName)	{
			var app = SingletonFactory.getInstance(Application);
			var rm = app.getResourceManager();
			return rm.requestForCustomResource("#"+this.getName()+"-RootData #"+this.getName()+"-"+resourceName);
		};
		
		/**
		 * Get the portlet DOM resource. This resource resides in the portlet rendered
		 * content and is visible to users.
		 * @methodOf PortletInterface#
		 * @name getDomResource
		 * @param resourceName the name of the resource
		 * @returns {Resource} the DOM (means rendered) resource with matching name
		 */
		obj.prototype.getDomResource = obj.prototype.getDomResource || function(resourceName)	{
			var app = SingletonFactory.getInstance(Application);
			var rm = app.getResourceManager();
			return rm.requestForCustomResource("#effective-area #"+this.getName()+"-"+resourceName);
		};
		
		/**
		 * Get the <code>HTML ID</code> of a resource by its name.
		 * @methodOf PortletInterface#
		 * @name getResourceID
		 * @param resourceName the name of the resource
		 * @returns {String} the ID of the resource with matching name
		 */
		obj.prototype.getResourceID = obj.prototype.getResourceID || function(resourceName)	{
			return this.getName()+"-"+resourceName;
		};
		
		/**
		 * Get a localized text.
		 * @methodOf PortletInterface#
		 * @name getLocalizedText
		 * @param resourceName the name of the text
		 * @returns {String} the localized text
		 */
		obj.prototype.getLocalizedText = obj.prototype.getLocalizedText || function(resourceName)	{
			var app = SingletonFactory.getInstance(Application);
			var rm = app.getResourceManager();
			var res = rm.requestForResource(this.getName(), "Text"+resourceName);
			if (res == undefined)
				return undefined;
			return res.html();
		};
		
		/**
		 * Get a localized message. A message can be parameterized.
		 * @methodOf PortletInterface#
		 * @name getLocalizedMessage
		 * @param resourceName the name of the message
		 * @returns {String} the localized message
		 */
		obj.prototype.getLocalizedMessage = obj.prototype.getLocalizedMessage || function(resourceName)	{
			var app = SingletonFactory.getInstance(Application);
			var rm = app.getResourceManager();
			var res = rm.requestForResource(this.getName(), "Message"+resourceName);
			if (res == undefined)
				return undefined;
			var unresolved = res.html();
			
			var resolved = unresolved;
			//resolved string pattern
			for(var i=1;i<arguments.length;i++)	{
				resolved = resolved.replace("%"+i, arguments[i]);
			}
			return resolved;
		};
	}
});

/**
 * @class An interface for all components which need rendering.
 * The <code>RenderInterface</code> is commonly used in 
 * user-defined <code>Portlet</code>. Note that a component can
 * have multiple extra views besides the main view. In this case,
 * developers should use <code>renderView</code> method.
 * @interface
 */
RenderInterface = InterfaceImplementor.extend({
	
	onModelChange: function() {
		
	},
	
	implement: function(obj)	{
		/**
		 * Render the component using microtemplating mechanism.
		 * The component must supply the following:
		 * <p>
		 * 	<ul>
		 *  	<li>A <code>viewId</code> or implement <code>getName</code> method</li>
		 *  	<li>An optional <code>model</code> which is a Javascript object</li>
		 *  	<li>A template, which must exists in DOM before this method is called.
		 *  		The template should be a <code>script</code> element, with 
		 *  		<i><code>text/html</code></i> <code>type</code> attributes.
		 *  		The <code>id</code> of the template is the <code>viewId</code>
		 *  		followed by "View".
		 *  		<br />For example, suppose the <code>viewId</code> of the component
		 *  		is MyComponent, then the <code>id</code> should be MyComponentView.
		 *  	</li>
		 *  </ul>
		 * </p>
		 * @name render
		 * @methodOf RenderInterface#
		 * @returns {String} the rendered content of the component
		 */
		obj.prototype.render = obj.prototype.render || function(){
			this.viewId = this.viewId || this.getName()+"View";
			this.model = this.model || JOOModel.from({});
//			if(this.viewId == undefined || this.model == undefined){
//				throw "No viewId or model for rendering";
//			}
			return tmpl(this.viewId, this.model);
		};

		/**
		 * Render a specific view the component using microtemplating mechanism.
		 * The component must supply the following:
		 * <p>
		 * 	<ul>
		 *  	<li>A <code>viewId</code> or implement <code>getName</code> method</li>
		 *  	<li>A view template, which must exists in DOM before this method is called.
		 *  		The template should be a <code>script</code> element, with 
		 *  		<i><code>text/html</code></i> <code>type</code> attributes.
		 *  		The <code>id</code> of the template is the <code>viewId</code>
		 *  		followed by "-" and the <code>view</code> parameters.
		 *  		<br />For example, suppose the <code>viewId</code> of the component
		 *  		is MyComponent, then calling <code>this.renderView("FirstView", {})</code>
		 *  		inside the component will render the template with <code>id</code> 
		 *  		MyComponent-FirstView.
		 *  	</li>
		 *  </ul>
		 * </p>
		 * @methodOf RenderInterface#
		 * @name renderView
		 * @returns {String} the rendered view of the component
		 */
		obj.prototype.renderView = obj.prototype.renderView || function(view, model)	{
			return tmpl((this.viewId || this.getName())+"-"+view, model);
		};
		
		/**
		 * Display and bind the model to the view.
		 * @methodOf RenderInterface#
		 * @name displayAndBind
		 */
		obj.prototype.displayAndBind = obj.prototype.displayAndBind || function()	{
			var _self = this;
			if (this.model) {
				this.model.addEventListener('change', function() {
					_self.getPortletPlaceholder().paintCanvas(_self.render());
				});
			}
			this.getPortletPlaceholder().paintCanvas(this.render());
		};
	}
});

PortletPlaceholder = Class.extend(
/** @lends PortletPlaceholder# */		
{

	/**
	 * @class A placeholder to store a single portlet.
	 * It acts as a bridge between Portlet and {@link PortletCanvas}
	 * @augments Class
	 * @param canvas the portlet canvas
	 * @constructs
	 */
	init: function(canvas)	{
		this.canvas = canvas;
	},
	
	/**
	 * Add an object to the canvas
	 * @param {Object} object the object to be added
	 */
	addToCanvas: function(object)	{
		this.canvas.addChild(object);
	},
	
	/**
	 * Clear everything and repaint the canvas
	 * @param {String} html the HTML data to be painted
	 */
	paintCanvas: function(html)	{
		this.canvas.repaint(html);
		var subject = SingletonFactory.getInstance(Subject);
		subject.notifyEvent('HtmlUpdated');
	},
	
	/**
	 * Append to the canvas
	 * @param {String} html the HTML data to be appended
	 */
	drawToCanvas: function(html)	{
		this.canvas.paint(html);
		var subject = SingletonFactory.getInstance(Subject);
		subject.notifyEvent('HtmlUpdated');
	},
	
	/**
	 * Access the underlying canvas
	 * @returns {PortletCanvas} the portlet canvas
	 */
	getCanvas: function()	{
		return this.canvas;
	},
	
	toString: function() {
		return "PortletPlaceholder";
	}
});

PortletContainer = Class.extend(
/** @lends PortletContainer# */
{
	/**
	 * @class A container which maintains and controls multiple portlets
	 * @singleton
	 * @augments Class
	 * @constructs
	 */
	init: function()	{
		if(PortletContainer.singleton == undefined){
			throw "Singleton class";
			return undefined;
		}
		this.portlets = Array();
	},
	
	/**
	 * Add a portlet to this container and initialize it
	 * @param {PortletInterface} portlet the portlet to be added
	 * @param {Object} item portlet metadata
	 */
	addPortlet: function(portlet, item)	{
		var portletMeta = {};
		for(var i in item)	{
			portletMeta[i] = item[i];
		}
		portletMeta.portlet = portlet;
		if (portletMeta.order == undefined)
			portletMeta.order = '';
		portletMeta.loaded = false;
		this.portlets.push(portletMeta);
		try 
		{
			portlet.onBegin();
		} 
		catch (err)	{
			log(err);
		}
	},
	
	/**
	 * Move the portlet to another position
	 * @param {Object} portletMeta the metadata associated with the portlet to be moved
	 * @param {String} newPosition the new position, which is the <code>id</code>
	 * of a DOM element
	 */
	movePortlet: function(portletMeta, newPosition)	{
		var portletPosition = new Stage({id: newPosition});
		var portletCanvas = new Stage({id: portletMeta.portlet.getPortletPlaceholder().getCanvas().id});
		this.attachPortletHtml(portletPosition, portletCanvas, portletMeta);
	},
	
	/**
	 * Load all active portlets, execute them synchronously.
	 */
	loadPortlets: function()	{
		for(var i=0;i<this.portlets.length;i++)	{
			var portletMeta = this.portlets[i];
			if (portletMeta.active == true && !portletMeta.loaded)	{
				this.activatePortlet(portletMeta);
				portletMeta.loaded = true;
			}
		}
	},
	
	/**
	 * Get all portlets
	 * @returns {Array} All loaded portlets
	 */
	getPortlets: function()	{
		return this.portlets;
	},
	
	/**
	 * Get portlet metadata using the portlet's name
	 * @param {String} name the portlet's name
	 */
	getPortletMetaByName: function(name)	{
		return this.portlets.map(function(portlet) {
			if (portlet.portlet.getName() == name)
				return portlet;
		});
	},
	
	/**
	 * Get portlet metadata using the portlet's name
	 * @param {String} name the portlet's name
	 */
	getPortletMetaById: function(id)	{
		for(var i=0; i<portlets.length; i++) {
			if (portlet.id == id)
				return portlet;
		}
	},
	
	/**
	 * Remove portlet at the specified position
	 * @param {String} position the position of the portlet to be removed
	 */
	removePortlet: function(position)	{
		var portletMeta = this.portlets[position];
		if (portletMeta != undefined)	{
			this.portlets.splice(position,1);
			portletMeta.portlet.onEnd();
			if (portletMeta.portlet.getPortletPlaceholder())	{
				//console.log("dispose canvas of portlet: "+portletMeta.portlet.getName());
				portletMeta.portlet.getPortletPlaceholder().getCanvas().dispose();
			}
		}
	},
	
	attachPortletHtml: function(portletPosition, portletCanvas, portletMeta)	{
		var jPortletCanvas = portletPosition.access();
		var canvases = jPortletCanvas.find('.portlet.portlet-canvas');

		var found = false;
		for(var i=0;i<canvases.length;i++)	{
			var canvasI = canvases[i];
			if ($(canvasI).attr('order') > portletMeta.order)	{
				portletPosition.addChildBeforePosition(portletCanvas, canvasI);
				found = true;
				break;
			}
		}
		
		if (found == false)	{
			portletPosition.addChild(portletCanvas);
		}
		portletCanvas.setAttribute('order', portletMeta.order);
	},
	
	/**
	 * Activate a portlet.
	 * @param {Object} portletMeta the metadata of the portlet to be activated
	 */
	activatePortlet: function(portletMeta)	{
		var portlet = portletMeta.portlet;
		if (portletMeta.loaded)	{
			return;
		}
		var portletPosition = new Stage({id: portletMeta.position});
		var portletCanvas = new PortletCanvas(portlet.getName());
		this.attachPortletHtml(portletPosition, portletCanvas, portletMeta);
		portletCanvas.setAttribute('portlet', portlet.getName());
		var portletPlaceholder = new PortletPlaceholder(portletCanvas);
		portlet.setPortletPlaceholder(portletPlaceholder);
		portletMeta.loaded = true;
		try 
		{
			portlet.run();
		} 
		catch (err)	{
			log(err);
		}
	},
	
	/**
	 * Deactivate a portlet.
	 * @param {Object} portletMeta the metadata of the portlet to be deactivated
	 */
	deactivatePortlet: function(portletMeta)	{
		var portlet = portletMeta.portlet;
		if (!portletMeta.loaded)	{
			return;
		}
		portletMeta.loaded = false;
		if (portlet.getPortletPlaceholder())	{
			portlet.getPortletPlaceholder().paintCanvas('');
		}
	},
	
	toString: function() {
		return "PortletContainer";
	}
});

/**
 * @class A simple portlet used for rendering
 * @augments Class
 * @implements PortletInterface
 * @implements RenderInterface
 */
RenderPortlet = Class.extend(
/** @lends RenderPortlet# */	
{
	/**
	 * Render and display the portlet.
	 */
	run: function() {
		this.getPortletPlaceholder().paintCanvas(this.render());
	}
}).implement(PortletInterface, RenderInterface);
ErrorHandler = Class.extend({
	handle: function(err, event) {
		
	}
});

DefaultErrorHandler = ErrorHandler.extend({
	handle: function(err, event) {
		if (typeof err == 'object') {
			if (err.Exception == 'RequestInterrupted') {
				return;
			}
			if (err.Exception != undefined)	{
				alert("["+err.Exception+"Exception] "+err.Message);
			} else {
				alert(err);
			}
			return;
		}
		alert("Error caught: "+err);
	}
});

Request = Class.extend(
/** @lends Request# */		
{
	/**
	 * Create a new request.
	 * @param {String} name the name of the page
	 * @param {Object} type reserved
	 * @param {Object} params the parameters associated with the request
	 * @param {hideParams} a list of parameters that will not be displayed in
	 * the URL bar when the request is executed
	 * @class Represents a request
	 * @augments Class
	 * @constructs
	 */
	init: function(name, type, params, hideParams) {
		if (name != undefined)
			name = name.trim();
		this.name = name;
		this.type = type;
		if (params == undefined) {
			params = Array();
		}
		if (hideParams == undefined) {
			hideParams = Array();
		}
		this.params = params;
		this.hiddenParams = hideParams;
		this.setParams(params);
		this.demanded = true;
	},
	
	/**
	 * Check if the request is demanded by the application itself.
	 * @returns {Boolean} the demanding flag
	 */
	isDemanded: function() {
		return this.demanded;
	},
	
	/**
	 * Change the demanding flag of the current request.
	 * Demanded request will be automatically routed.
	 * @param {Boolean} b the demanding flag
	 */
	demand: function(b) {
		this.demanded = b;
	},
	
	/**
	 * Set the value of a specific parameter
	 * @param {String} key the parameter name
	 * @param {String} value the new value
	 */
	setParam: function(key, value) {
		this.params[key] = value;
	},
	
	/**
	 * Change all parameters to a new map
	 * @param {Object} params the new parameters map
	 */
	setParams: function(params) {
		this.params = params;
	},

	/**
	 * Get the value of a paramter of current request
	 * @param {String} key the parameter
	 * @param {String} defaultValue the default value, if the parameter is not defined
	 * @returns {String} the value of the parameter
	 */
	getParam: function(key, defaultValue) {
		if (this.params[key] == undefined) {
			return defaultValue;
		}
		return this.params[key];
	},

	/**
	 * Get all parameters.
	 * @returns {Object} the parameters map
	 */
	getParams: function() {
		return this.params;
	},
	
	/**
	 * Change the hash value of current location.
	 * @param {String} strToAdd the location after the hash symbol (#)
	 */
	addHash: function(strToAdd) {
		window.location.hash = strToAdd;
	},
	
	/**
	 * Change the name of the page represented by this request.
	 * @param {String} name the name of the page
	 */
	setName: function(name) {
		this.name = name;
	},

	/**
	 * Get the name of the page represented by this request
	 * @returns {String}
	 */
	getName: function() {
		return this.name;
	},
	
	getType: function() {
		return this.type;
	},
	
	toString: function() {
		return "Request";
	}
});

Request.setProactive = function(b, url) {
	if (url == undefined)
		url = window.location.hash;
	//console.log('set proactive to '+b+' for url: '+url);
	//	//console.warn('called by '+Request.setProactive.caller);
	if (Request.proactive == undefined)
		Request.proactive = {};
	Request.proactive[url] = b;
};

Request.getProactive = function(url) {
	if (url == undefined)
		url = window.location.hash;
	if (Request.proactive == undefined)
		Request.proactive = {};
	return Request.proactive[url];
};

RequestHandler = Class.extend(
/** @lends RequestHandler# */		
{
	/**
	 * Initialize fields
	 * @class Default request handler
	 * @augments Class
	 * @constructs
	 */
	init: function() {
		this.currentPage = undefined;
		this.requestInterrupted = false;
		this.autoRouteDefault = true;
		this.systemProperties = SingletonFactory.getInstance(Application).getSystemProperties();
		this.errorHandler = new DefaultErrorHandler();
	},
	
	/**
	 * Change the error handler
	 * @param {ErrorHandler} errorHandler the new error handler
	 */
	setErrorHandler: function(errorHandler) {
		this.errorHandler = errorHandler;
	},
	
	/**
	 * Route (if needed) and handle a request
	 * @param {Request} request the request to be handled
	 */
	handleRequest: function(request) {
		//console.log('current page is '+this.currentPage);
		if (this.currentPage != undefined) {
			//console.log("Request Interrupted");
			this.requestInterrupted = true;
		} else {
			this.requestInterrupted = false;
		}
		this.routeRequest(request);
		this._handleRequest(request);
	},
	
	_handleRequest: function(request) {
		var name = request.getName();
		JOOUtils.generateEvent('RequestBeforeHandled', {to: name});
		var page = SingletonFactory.getInstance(Page);
		this.currentPage = page;
		page.setRequest(request);
		//console.log('current page begin: '+request.getName());
		try 
		{
			page.onBegin(name);
		} 
		catch (err) {
			log(err);
			/*
			* display a message similar to 'this applet failed to load. click here to reload it'
			*/
			this.errorHandler.handle(err, 'onBegin');
		}
		
		//console.log('current page running: '+request.getName());

		try 
		{
			page.run();
		} 
		catch (err) {
			log(err);
			/*
 			* display a message box notify the error
 			*/
			this.errorHandler.handle(err, 'run');
		}
		
		try 
		{
			page.onEnd();
		} 
		catch (err) {
			log(err);
			this.errorHandler.handle(err, 'onEnd');
		}

		//console.log('current page finished: '+request.getName());
		this.currentPage = undefined;

		JOOUtils.generateEvent('HtmlRendered');
		//		//console.log(currentPage);
		if (this.requestInterrupted == true) {
			throw {"Exception":"RequestInterrupted"};
		}
	},
	
	/**
	 * Define setter and getter for the window location hash.
	 */
	prepareForRequest: function() {
		if(!("hash" in window.location)) {
			window.location.__defineGetter__("hash", function() {
				if(location.href.indexOf("#") == -1)
					return "";
				return location.href.substring(location.href.indexOf("#"));
			});
			window.location.__defineSetter__("hash", function(v) {
				if(location.href.indexOf("#") == -1)
					location.href += v;
				location.href = location.substring(0,location.href.indexOf("#")) + v;
			});
		}
	},
	
	/**
	 * Create a request based on the current URL
	 */
	assembleRequest: function() {
		var defaultPage = SingletonFactory.getInstance(Application).getSystemProperties().get('page.default', 'Home');
		if(window.location.hash == "") {
			var request = new Request(defaultPage, null, null, {'page': ''});
			return request;
		} else {
			//console.log("hey!");
			var hash = window.location.hash;
			hash = hash.substring(1,hash.length);
			if (hash.charAt(0) == '!')	{
				hash = hash.substring(1, hash.length);
			}
			var tmp = hash.split("/");
			var params = new Array();
			var pagename = "";
			var i = 0;

			while(i<tmp.length) {
				if(tmp[i] != "") {
					params[tmp[i]] = tmp[i+1];
					if(tmp[i] == "page") {
						pagename = params[tmp[i]];
					}
					i = i + 2;
				} else {
					i = i + 1;
				}
			}
			
			var request = new Request(pagename, null, params);
			request.demand(false);
			return request;
		}
	},
	
	/**
	 * Modify the URL (i.e the window location) based on the request.
	 * @param {Request} request the request to be routed
	 */
	routeRequest: function(request) {
		//if this request neither proactive nor demanded, then there's no point routing it
		if (Request.getProactive() == false && request.isDemanded() == false)
			return;
		var str = "!";
		if ( ( request.getName() == undefined || request.getName() == "" ) && this.autoRouteDefault ) {
			var pagename = this.systemProperties.get('page.default');
			//console.warn('page is undefined! Using default homepage ['+pagename+']');
			if (pagename == undefined) {
				//console.error('Default page is undefined! I give up for now!');
				throw {"Exception": "NotFound", "Message": "Both default page and parameter page is undefined"};
				return undefined;
			}
			request.setName(pagename);
			request.hiddenParams.page = '';
		}
		request.getParams()['page'] = request.getName();
		for(var key in request.getParams()) {
			if (request.hiddenParams.hasOwnProperty(key)) {
				continue;
			}
			if (typeof request.getParams()[key] == 'function' || typeof request.getParams()[key] == 'object')	{
				continue;
			}
			value = request.params[key];
			if (value != undefined)
				str += key+"/"+value+"/";
			else
				str += key+"/";
		}
		str = str.substring(0,str.length-1);
		if(!("hash" in window.location)) {
			window.location.__defineGetter__("hash", function() {
				if(location.href.indexOf("#") == -1)
					return "";
				return location.href.substring(location.href.indexOf("#"));
			});
			window.location.__defineSetter__("hash", function(v) {
				if(location.href.indexOf("#") == -1)
					location.href += v;
				location.href = location.substring(0,location.href.indexOf("#")) + v;
			});
		}
		//mark the current request as Proactive, so it won't trigger another history event
		Request.setProactive(true, '#!'+str);
		window.location.hash = str;
	},
	
	toString: function() {
		return "RequestHandler";
	}
});
/**
 * Create a new Bootstrap
 * @class The pluggable bootstrap class.
 * Application flow is defined here. Developers can extends this class
 * to create custom bootstraps.
 * @augments Class
 * @implements ObserverInterface
 */
Bootstrap = Class.extend(
/** @lends Bootstrap# */		
{
	/**
	 * Called when the application start running.
	 * Subclass can override this method to change the application flow
	 */
	run: function()	{
		this.registerObserver();
		this.setupRequestHandler();
		this.executeRequest();
	},

	/**
	 * Route the request
	 * @param {Request} eventData the request to be routed
	 * @observer
	 */
	onRequestRoute: function(eventData)	{
		this.requestHandler.routeRequest(eventData);
	},
	
	/**
	 * Assemble the request based on current URL
	 * @observer
	 */
	onNeedAssembleRequest: function()	{
		this.executeRequest();
	},

	/**
	 * Initialize the request handler
	 */
	setupRequestHandler: function()	{
		this.requestHandler = new RequestHandler();
	},
	
	/**
	 * Execute current request
	 */
	executeRequest: function()	{
		var subject = SingletonFactory.getInstance(Subject);
		subject.notifyEvent('RequestBeforeExecuted');
		this.requestHandler.prepareForRequest();
		var request = this.requestHandler.assembleRequest();
		if (request != undefined)	{
			this.requestHandler.handleRequest(request);
		}
	},
	
	toString: function() {
		return "Bootstrap";
	}
}).implement(ObserverInterface);
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
			value = value.replace(/'/g, "\\'")
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
	}
};
Memcached = Class.extend(
/** @lends Memcached# */		
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
	},
	
	toString: function() {
		return "Memcached";
	}
});
