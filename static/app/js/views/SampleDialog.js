SampleDialog = JOODialog.extend({
	
	setupDomObject: function(config) {
		this._super(config);
		this.renderUIComposition();
	}
}).implement(CompositionRenderInterface);