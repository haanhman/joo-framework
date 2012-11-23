$.fn.dragBounce = function(options) {
	options = options || {};
	options.speed = options.speed || 150;
	var maxX = options.maxX;
	var maxY = options.maxY;
	
	var obj = this;
    var offset = null;
    var original = null;
    var notMove = false;
    var doBouncing = false;
    var touchstart = function(e) {
    	e.stopPropagation();
    	if (doBouncing)
    		return;
    	notMove = false;
    	var orig = e.originalEvent;
        offset = original = {
            x: orig.changedTouches[0].pageX,  
            y: orig.changedTouches[0].pageY  
        };
    };
    var touchmove = function(e) {
    	if (notMove) return; 
        e.preventDefault();
        e.stopPropagation();
        var orig = e.originalEvent;
        var top = orig.changedTouches[0].pageY - original.y;
        var left = orig.changedTouches[0].pageX - original.x;
        if (options.horizontal)
        	obj.css('-webkit-transform', 'translate3d('+left+'px, '+options.initTop+'px, 0)');
        else
        	obj.css('-webkit-transform', 'translate3d('+left+'px, '+top+'px, 0)');
        offset = obj.dragOffset = {
        	x: left,
        	y: top
        };
        if ((maxX && Math.abs(left) > maxX) || (maxY && Math.abs(top) > maxY)) {
        	bouncing();
        }
    };
    var touchend = function(e) {
    	if (!notMove)
    		bouncing();
    }
    
    var bouncing = function() {
    	notMove = true;
		doBouncing = true;
		
		var dist1 = Math.sqrt(offset.x * offset.x + offset.y * offset.y);
		var dist2 = Math.sqrt(maxX * maxX + maxY * maxY);
		
		runBounce(options.speed, {x: offset.x * 1.5, y: offset.y * 1.5}, {x: maxX, y: maxY});
    }
    
    var runBounce = function(speed, offset, maxOffset) {
    	if (!offset.x && !offset.y) {
    		setTimeout(function() {
	    		obj.css('-webkit-transition', '');
	    		doBouncing = false;
	    	}, options.speed);
    		return;
    	}
    	offset.x = -offset.x * 0.7;
    	offset.y = -offset.y * 0.7;
  
  		if (Math.abs(offset.x/maxOffset.x) < 0.05) {
  			offset.x = 0;
  		}
  		if (Math.abs(offset.y/maxOffset.y) < 0.05) {
  			offset.y = 0;
  		}
		
		obj.css('-webkit-transition', speed+'ms linear');
    	obj.css('-webkit-transform', 'translate3d('+offset.x+'px, '+offset.y+'px, 0)');
    	
    	setTimeout(function() {
    		runBounce(speed, offset, maxOffset);
    	}, speed);
    }
    this.bind("touchstart", touchstart);
    this.bind("touchmove", touchmove);
    this.bind("touchend", touchend);
};