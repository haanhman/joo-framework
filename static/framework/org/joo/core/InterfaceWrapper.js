JOO.provide('org.joo.core');

/**
 * @class Used to wrap class using interface
 * @name org.joo.core.InterfaceWrapper
 * Wrapper allows developers to implement an interface for a class at runtime.
 */
org.joo.reflect.InterfaceWrapper = 
/** @lends org.joo.core.InterfaceWrapper */
{
	/**
	 * Wrap a class with specific interface.
	 * @param {Class} obj the class to be wrapped
	 * @param {org.joo.core.InterfaceImplementor} i the interface to be implemented
	 */
	wrap: function(obj, i) {
		obj.currentClass.implement(i);
	}
};