/**
 * @class A counterpart of <code>HTML HR</code> element
 * @augments DisplayObject 
 */
JOO.define('org.joo.ui.Separator', {
	
	extend: org.joo.ui.DisplayObject,
	
	toHtml: function() {
		return "<hr />";
	}
});