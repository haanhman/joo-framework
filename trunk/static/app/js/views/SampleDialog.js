SampleDialog = JOODialog.extend({
	
	setupDomObject: function(config) {
		this._super(config);
		this.renderUIComposition();
	},
	
	divClick: function() {
		alert('click me');
	}
}).implement(CompositionRenderInterface);