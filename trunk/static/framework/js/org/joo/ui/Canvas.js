/**
 * Create a new Canvas
 * @class A counterpart of <code>HTML5 Canvas</code>
 * @augments DisplayObject
 */
JOO.define('org.joo.ui.Canvas', {
	
	extend: org.joo.ui.DisplayObject,
	
	setupBase: function(config)	{
		this.context = undefined;
		this._super(config);
	},
	
	getContext: function()	{
		if(this.context == undefined){
			this.context = new org.joo.ui.Canvas.CanvasContext(this, "2d");
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

/**
 * CanvasContext
 */
org.joo.ui.Canvas.CanvasContext = Class.extend({
    
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