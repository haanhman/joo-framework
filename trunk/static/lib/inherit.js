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