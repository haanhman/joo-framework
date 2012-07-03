JOOPropertyElement = JOOInput.extend({
	
	setupDomObject: function(config) {
		this._super(config);
		
		var label = new JOOLabel({lbl: config.lbl});
		var controlLabel = new Sketch();
		controlLabel.addChild(label);
		this.addChild(controlLabel);
		
		controlSketch = new Sketch();
		controlSketch.addChild(this.control);
		this.addChild(controlSketch);
		
		this.setLayout('flow');
		
		config.labelWidth = config.labelWidth || '40%';
		controlLabel.setWidth(config.labelWidth);
		config.controlWidth = config.controlWidth || '60%';
		controlSketch.setWidth(config.controlWidth);
		this.control.setWidth('100%');
		
		var _self = this;
		this.control.addEventListener('change', function(e) {
			if (e)
				e.stopPropagation();
			_self.dispatchEvent('change');
		});
	},
	
	setValue: function(value) {
		this.control.setValue(value);
	},
	
	getValue: function() {
		return this.control.getValue();
	}
});

JOOCheckboxProperty = JOOPropertyElement.extend({
	
	setupDomObject: function(config) {
		this.control = new JOOCheckbox();
		this._super(config);
		this.control.setWidth('');
	}
});

JOOColorProperty = JOOPropertyElement.extend({
	
	setupDomObject: function(config) {
		this.control = new JOOColorPicker();
		this._super(config);
		this.control.setWidth('');
	}
});

JOOFontChooserProperty = JOOPropertyElement.extend({
	
	setupDomObject: function(config) {
		this.control = new JOOFontSelector(config);
		this._super(config);
		this.control.setWidth('auto');
	}
});

JOOMediaProperty = JOOPropertyElement.extend({
	
	setupDomObject: function(config) {
		this.control = this.control || new JOOMediaValue(config);
		this._super(config);
	}
});

JOOMediaValue = JOOInput.extend({
	
	setupDomObject: function(config) {
		this._super(config);
		this.link = new JOOLink();
		this.mediaBrowser = new JOOMediaBrowser(config);
		this.addChild(this.link);
		this.addChild(this.mediaBrowser);
		this.mediaBrowser.access().hide();
		this.setValue(config.value);
		
		var _self = this;
		this.link.addEventListener('click', function() {
			_self.mediaBrowser.fetch();
			_self.mediaBrowser.access().show();
		});
		this.link.addEventListener('mouseover', function() {
			showtip(_self.getValue());
		});
		this.link.addEventListener('mouseout', function() {
			hidetip();
		});
		this.mediaBrowser.close = function() {
			this.access().hide();
		};
		this.mediaBrowser.addEventListener('change', function() {
			_self.onchange(this.getValue());
		});
	},
	
	onchange: function(value) {
		this.mediaBrowser.close();
		this.setValue(value);
	},

	setValue: function(value) {
		this._super(value);
		if (value == undefined)
			value = "Unspecified";
		this.link.access().html(value);
		this.dispatchEvent('change');
	},
	
	toHtml: function() {
		return "<div></div>";
	}
});

JOOSelectProperty = JOOPropertyElement.extend({
	
	setupDomObject: function(config) {
		this.control = new JOOInputSelect(config);
		this._super(config);
		this.control.setWidth('auto');
	}
});

JOOToggleBarProperty = JOOPropertyElement.extend({
	
	setupDomObject: function(config) {
		this.control = new JOOToggleBar(config);
		this._super(config);
		this.control.setWidth('auto');
	}
});

JOOToggleProperty = JOOPropertyElement.extend({
	
	setupDomObject: function(config) {
		this.control = config.control;
		this._super(config);
		var _self = this;
		this.control.addEventListener('toggle', function(){
			_self.setValue(this.state ? config.on : config.off);
		});
		this.control.setWidth('');
	},
	
	setValue: function(value) {
		this.value = (value == this.config.on) ? this.config.on : this.config.off;
		this.dispatchEvent('change');
	},
	
	getValue: function() {
		return this.value;
	}
});

JOOSliderProperty = JOOPropertyElement.extend({
	
	setupDomObject: function(config) {
		this.control = new JOOSlider({min: config.min, max: config.max, value: config.value});
		this._super(config);
		this.control.setLocation(-8, 7);
	}
});

JOOTextAreaProperty = JOOPropertyElement.extend({
	
	setupDomObject: function(config) {
		this.control = new JOOTextArea();
		this._super(config);
	}
});

JOOTextProperty = JOOPropertyElement.extend({
	
	setupDomObject: function(config) {
		this.control = new JOOTextInput();
		this._super(config);
	}
});

JOOPropertiesDialog = JOODialog.extend({
	
	setupDomObject: function(config) {
		this._super(config);
		this.setTitle('Properties');
		this.getContentPane().setLayout('vertical');
		this.supportedProperties = config.supportedProperties || this.supportedProperties || [];
		this.propertyMappings = config.propertyMappings || this.propertyMappings || {
			'colorpicker': JOOColorProperty,
			'media': JOOMediaProperty,
			'slider': JOOSliderProperty,
			'select': JOOSelectProperty,
			'text': JOOTextProperty,
			'textarea': JOOTextAreaProperty
		};
		
		this.generatePropertyElements();
		this.reloadList();
	},
	
	removeTarget: function(target) {
		if (target != undefined) {
			target.removeEventListener(this.onTargetStyle);
		}
		if (this.target == target) {
			this.target = undefined;
			this.reloadList();
		}
	},
	
	setTarget: function(target) {
		if (this.target != undefined) {
			this.target.removeEventListener(this.onTargetStyle); 
		}
		if (this.target != target) {
			if(this.target){
				currentTargetId = this.target.getId();
			}
			this.target = target;
			this.reloadList();
		}
	},
	
	onTargetStyle: function(e) {
		//generateEvent('ObjectStyleChanged', e);
	},
	
	updateList: function(e) {
		var supported = undefined;
		if (this.target)
			supported = this.target.getSupportedProperties();
		for(var i in this.props) {
			if (e.indexOf(this.props[i].options.property.name) == -1 || !this.target || !supported || (supported.indexOf(i) == -1 && supported != "all")) {
				
			} else {
				var orig = this.props[i].element.onchange;
				this.props[i].element.onchange = function() {};
				this.props[i].element.setValue(this.target.getProperty(this.props[i].options.property));
				this.props[i].element.onchange = orig;
			}
		}
	},
	
	reloadList: function() {
		var supported = undefined;
		
		if (this.target) {
			this.target._parent.addEventListener('stylechange', this.onTargetStyle);
			this.target.addEventListener('stylechange', this.onTargetStyle);
			this.target._parent.addEventListener('dragstop', this.onTargetStyle);
			supported = this.target.getSupportedProperties();
		}
		for(var i in this.props) {
			if (!this.target || !supported || (supported.indexOf(i) == -1 && supported != "all")) {
				if (this.props[i].options.autohide) {
					this.props[i].element.access().hide();
					this.props[i].element.setAttribute('hide', '');
				}
				this.props[i].element.disable(true);
			} else {
				var _self = this;
				this.props[i].element.access().removeAttr('hide');
				this.props[i].element.access().show();
				
				this.props[i].element.disable(false);
				this.props[i].element.targetProperty = this.props[i].options.property;
				this.props[i].element.setValue(this.target.getProperty(this.props[i].options.property));
				this.props[i].element.onchange = function() {
					_self.target.setProperty(this.targetProperty, this.getValue());
					_self.dispatchEvent('change');
				};
			}
		}
		
		for(var i=0; i<this.accords.length; i++) {
			var len = this.accords[i].getContentPane().access().children(':not([hide])').length;
			if (len > 0)
				this.accords[i].access().show();
			else
				this.accords[i].access().hide();
		}
	},
	
	generatePropertyElements: function() {
		this.props = Array();
		this.accords = Array();
		
		var props = this.supportedProperties;
		this.tab = new JOOTabbedPane({width: '98%'});
		this.tab.access().addClass('properties-tab');
		for(var i=0; i<props.length; i++) {
			var sketch = new Sketch();
			var cats = props[i].categories;
			for(var j=0; j<cats.length; j++) {
				var accord = new JOOAccordion({lbl: cats[j].category});
				if (cats[j].options != undefined) {
					for(var k=0; k<cats[j].options.length; k++) {
						var opt = cats[j].options[k];
						opt.config.lbl = opt.name;
						var element = new this.propertyMappings[opt.type](opt.config);
						element.onchange = function() {};
						element.addEventListener('change', function() {
							this.onchange();
						});
						accord.getContentPane().addChild(element);
						this.props[opt.id] = {element: element, options: opt};
					}
				}
				this.accords.push(accord);
				sketch.addChild(accord);
			}
			this.tab.addTab(props[i].section, sketch);
			this.tab.setTab(0);
		}
		this.getContentPane().addChild(this.tab);
	}	
}).implement(DraggableInterface);