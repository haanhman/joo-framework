JOO.define('org.joo.ui.Font', {
	
	init: function()	{
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