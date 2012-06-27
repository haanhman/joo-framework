/**
 * @class This interface make instances of a class cloneable
 * @name org.joo.core.Cloneable
 * @interface
 */
JOO.define('org.joo.core.Cloneable', {
	
	extend: org.joo.core.InterfaceImplementor,
	
	implement: function(obj) {
		/**
		 * Clone the current object.
		 * @methodOf org.joo.core.Cloneable#
		 * @name clone
		 * @returns {Object} the clone object 
		 */
		obj.prototype.clone = obj.prototype.clone || function() {
			var json = JSON.stringify(this);
			return JSON.parse(json);
		};
	}
});