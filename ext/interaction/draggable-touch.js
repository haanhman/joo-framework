$.fn.draggable = function(options) {
	options = options || {};
	
	var obj = this;
    var offset = null;
    var orig; var pos; 
    this.draggableTouchStart = function(e) {
    	orig = e.originalEvent;  
        pos = obj.position();  
        offset = {  
            x: orig.changedTouches[0].pageX - pos.left,  
            y: orig.changedTouches[0].pageY - pos.top  
        };
    };
    this.draggableTouchMove = function(e) { 
        e.preventDefault();
        orig = e.originalEvent;
        var top = orig.changedTouches[0].pageY - offset.y;
        var left = orig.changedTouches[0].pageX - offset.x;
        if (options.horizontal)
        	obj.css('-webkit-transform', 'translate3d('+left+'px, '+options.initTop+'px, 0)');
        else
        	obj.css('-webkit-transform', 'translate3d('+left+'px, '+top+'px, 0)');
        obj.dragOffset = {
        	x: left,
        	y: top
        };
    };
    this.bind("touchstart", this.draggableTouchStart);  
    this.bind("touchmove", this.draggableTouchMove);
};

$.fn.stopDraggable = function(options) {
    this.unbind("touchstart", this.draggableTouchStart);  
    this.unbind("touchmove", this.draggableTouchMove);
};