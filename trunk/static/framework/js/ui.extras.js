JOOResizableComponent = UIComponent.extend({
	
	getAbsoluteAngleArray: function(editPos) {
		var _self = this;
		var angle = _self.getRotation();
		if(!editPos)
			editPos = {
				x : 0,
				y : 0
			};
		var posArr = [];
		posArr.push(getPositionFromRotatedCoordinate({
			x : 0 + editPos.x,
			y : 0 + editPos.y
		}, angle * Math.PI / 180));
		posArr.push(getPositionFromRotatedCoordinate({
			x : _self.getWidth() + editPos.x,
			y : 0 + editPos.y
		}, angle * Math.PI / 180));
		posArr.push(getPositionFromRotatedCoordinate({
			x : _self.getWidth() + editPos.x,
			y : _self.getHeight() + editPos.y
		}, angle * Math.PI / 180));
		posArr.push(getPositionFromRotatedCoordinate({
			x : 0 + editPos.x,
			y : _self.getHeight() + editPos.y
		}, angle * Math.PI / 180));
		return posArr;
	},
	
	getEditCoefPos : function(editPos) {
		var root = {
			x : Number.MAX_VALUE,
			y : Number.MAX_VALUE
		};
		var posArr = this.getAbsoluteAngleArray(editPos);
		for(var i = 0; i < posArr.length; i++) {
			if(posArr[i].x < root.x)
				root.x = posArr[i].x;
			if(posArr[i].y < root.y)
				root.y = posArr[i].y;
		}
		return root;
	},
	
	offsetBoundary : function() {
		var center = this.getRotationCenterPoint();
		var boundaryRootPosRelative = this.getEditCoefPos({
			x: -parseFloat(this.access().width())*this.rotationCenter.x,
			y: -parseFloat(this.access().height())*this.rotationCenter.y
		});
		return {
			x: center.x + boundaryRootPosRelative.x,
			y: center.y + boundaryRootPosRelative.y 
		};
	},
	
	fixingRotatedValue: function(){
		var pos1 = this.virtualNontransformedOffset();
		var pos2 = this.offsetBoundary();
		return {
			x: pos1.x - pos2.x,
			y: pos1.y - pos2.y
		};
	},
	
	beforeStartDragging: function(e) {
		var fixingValue = this.fixingRotatedValue();
		e.pageX -= fixingValue.x;
		e.pageY -= fixingValue.y;
	},
	
	setupDomObject: function(config) {
		this.wrappedObject = this.setupWrappedObject(config);
		
		this._super(config);
		this.beginEditable(undefined, undefined, undefined, true);
		
		this.addEventListener('dragstop', this.onDragStopHandler);
		this.addEventListener('click', this.onClick);
		this.addEventListener('drag', this.onDragHandler);
		this.addEventListener('mouseover', this.onMouseOverHandler);
		this.addEventListener('mouseout', this.onMouseOutHandler);
		
		this.hideResizeControl();
		
//		this.startDrag();
		this.addEventListener('stageUpdated', function() {
			this.updateArea({w: this.getWidth(), h: this.getHeight()}); 
		});
		
		this.addChild(this.wrappedObject);
	},
	
	setupWrappedObject: function() {
		
	},
	
	getWrappedObject: function() {
		return this.wrappedObject;
	},
	
	onClick: function(e) {
		this.select(e.ctrlKey);
		e.stopPropagation();
	},

	_select: function() {
		this.startDrag();
		this.showResizeControl();
		this.access().addClass('joo-selected');
	},
	
	_deselect: function() {
		this.stopDrag();
		this.hideResizeControl();
		this.access().removeClass('joo-selected');
	},
	
	onDragHandler: function(e) {},
	
	onDragStopHandler: function(e) {},
	
	onMouseOverHandler: function(e) {},
	
	onMouseOutHandler: function(e) {},
	
	onMouseUpHandler: function(e) {
		this.startDrag();
	},
	
	onMouseDownHandler: function(e) {
		this.stopDrag();
	},
	
	setRotation: function(a) {
		this._super(a);
		//this.wrappedObject.setRotation(a);
	},
	
	setWidth: function(w) {
		//this._super(w);
		var deltaW = this.wrappedObject.access().outerWidth() - this.wrappedObject.getWidth();
		this.wrappedObject.setWidth(w - deltaW);
	},
	
	setHeight: function(h) {
		//this._super(h);
		var deltaH = this.wrappedObject.access().outerHeight() - this.wrappedObject.getHeight();
		this.wrappedObject.setHeight(h - deltaH);
	}
}).implement(ResizableInterface, DraggableInterface, SelectableInterface);

JOOResizableWrapper = JOOResizableComponent.extend({
	
	setupWrappedObject: function(config) {
		return this.config.object;
	},
	
	getCanvas: function() {
		return this.canvas;
	}
});

JOOAvatarIcon = JOOImage.extend({
	
	setupBase: function(config) {
		if (config.realObject) {
			this.realObject = config.realObject;
		} else if (config.getRealObject) {
			this.getRealObject = config.getRealObject;
		}
		this._super(config);
	},
	
	setupDomObject: function(config) {
		config.width = config.width || 32;
		config.height = config.height || 32;
		
		this._super(config);
		this.draggable({helper: 'clone', revert: 'invalid'});
		this.startDrag();
		
		if (!config.passMouseDownEvent) {
			this.addEventListener('mousedown', function(e) {
				e.stopPropagation();
			});
		}
	},
	
	getRealObject: function() {
		var className = this.realObject.className;
		if (typeof className != 'string')
			return new className(this.realObject.config);
		return this.realObject;
	}
}).implement(DraggableInterface);

DroppablePanel = Panel.extend({
	
	setupDomObject: function(config) {
		this._super(config);
		this.droppable();
	}
}).implement(DroppableInterface);

DragDropController = Class.extend({
	
	init: function() {
		if (DragDropController.instance != undefined)
			throw "DragDropController is singleton and cannot be initiated";
		this.className = "DragDropController";
		this.dragDropMappings = Array();
	},
	
	registerDragDrop: function(dragElem, dropElems) {
		for(var i=0; i<dropElems.length; i++) {
			dropElems[i].possibleDroppers = dropElems[i].possibleDroppers || {};
			dropElems[i].possibleDroppers[dragElem.getId()] = dragElem;
			if (this.dragDropMappings.indexOf(dropElems[i]) == -1) 
				this.dragDropMappings.push(dropElems[i]);
		}
	},
	
	updateDragDrop: function() {
		for(var i=0; i<this.dragDropMappings.length; i++) {
			this.dragDropMappings[i].addEventListener('drop', function(e, ui) {
				var id = $(ui.draggable.context).attr('id');
				if (this.possibleDroppers[id] != undefined) {
					e.droppedObject = this.possibleDroppers[id];
					e.position = ui.position;
					this.dispatchEvent('objectDropped', e);
				}
			});
			this.dragDropMappings[i].addEventListener('objectDropped', function(e) {
				var realObject = e.droppedObject.getRealObject();
				realObject.setLocation(e.pageX - this.offset().x, e.pageY - this.offset().y);
				this.addChild(realObject);
			});
		}
	},
	
	clear: function() {
		for(var i=0; i<this.dragDropMappings.length; i++) {
			this.dragDropMappings[i].possibleDroppers = undefined;
		}
	}
});

JOOMediaBrowser = JOODialog.extend({
	
	setupDomObject: function(config) {
		this._super(config);
		this.title = config.title || "Media Browser";
		this.browseService = config.browseService;
		this.uploadService = config.uploadService;
		this.searchServices = config.searchServices;
		this.autofetch = config.autofetch;
		this._generateUI();
	},
	
	_generateUI: function() {
		this.setTitle(this.title);
		if (this.browseService || this.searchServices) {
			var tab = new JOOTabbedPane({width: 300, height: 200});
			if (this.browseService) {
				this.browseSketch = new Sketch();
				this.browseSketch.access().addClass('joo-upload-browse');
				tab.addTab('Uploaded', this.browseSketch);
			}
			if (this.searchServices) {
				var sk = new Sketch({height: 160});
				this.searchInput = new JOOTextInput({width: '100%', height: 20});
				this.searchSketch = new Sketch({height: 140});
				this.searchSketch.setStyle('overflow', 'auto');
				sk.addChild(this.searchInput);
				sk.addChild(this.searchSketch);
				tab.addTab('Search', sk);
			}
			this.getContentPane().addChild(tab);
		}
		this.buttonsContainer = new Sketch();
		this.buttonsContainer.setLayout('flow');
		this.buttonsContainer.setStyle('text-align', 'center');
		if (this.uploadService) {
			this.uploader = new JOOAdvancedUploader({
				name: 'file',
				endpoint: this.uploadService.getEndPoint(),
				control: new JOOButton({lbl: 'Upload'})
			});
			this.buttonsContainer.addChild(this.uploader);
		}
		var _self = this;
		this.urlBtn = new JOOButton({lbl: 'Enter URL'});
		this.urlBtn.addEventListener('click', function() {
			_self.showUrlInput();
		});
		
		this.urlContainer = new Sketch();
		this.urlContainer.setLayout('flow');
		this.urlInput = new JOOTextInput({width: 200, height: 25, value: 'http://'});
		this.urlInput.addEventListener('keyup', function(e) {
			_self.urlKeyup(e);
		});
		this.uploader.addEventListener('change', function(e) {
			e.stopPropagation();
		});
		this.urlInput.addEventListener('change', function(e) {
			e.stopPropagation();
		});
		var urlClose = new JOOButton({lbl: 'Cancel'});
		urlClose.addEventListener('click', function() {
			_self.urlClose();
		});
		this.urlContainer.access().hide();
		this.urlContainer.access().addClass('joo-media-url-container');

		this.urlContainer.addChild(this.urlInput);
		this.urlContainer.addChild(urlClose);
		this.buttonsContainer.addChild(this.urlBtn);
		this.getContentPane().addChild(this.buttonsContainer);
		this.getContentPane().addChild(this.urlContainer);
		
		if (this.browseService) {
			this.browseService.addEventListener('success', function(ret) {
				_self.addBrowseImages(ret);
			});
		}
		
		if (this.uploadService) {
			this.uploader.addEventListener('submitSuccess', function(ret) {
				ret = $.parseJSON(ret.data);
				ret = _self.uploadService.parse(ret.result.data);
				_self.value = ret.url;
				_self.dispatchEvent('change');
				_self.browseService.run();
			});
		}
		
		if (this.searchServices) {
			var _self = this;
			for(var i in this.searchServices) {
				this.searchServices[i].addEventListener('success', function(ret) {
					_self.addSearchImages(this.name, ret);
				});
				this[this.searchServices[i].name] = new JOOAccordion({lbl: this.searchServices[i].name});
				this.searchSketch.addChild(this[this.searchServices[i].name]);
			}
			this.searchInput.addEventListener('keydown', function(e) {
				if (e.keyCode == 13) {
					e.stopPropagation();
					e.preventDefault();
					for(var i in _self.searchServices) {
						_self.searchServices[i].run({query: this.getValue()});
					}
				}
			});
		}
		
		if (this.autofetch) {
			this.addEventListener('stageUpdated', function() {
				this.fetch();
			});
		}
	},
	
	fetch: function() {
		this.browseService.run();
	},
	
	getValue: function() {
		return this.value;
	},
	
	setValue: function(value) {
		this.value = value;
	},
	
	addSearchImages: function(name, ret) {
		while(this[name].getContentPane().children.length > 0) {
			this[name].getContentPane().removeChildAt(0);
		}
		if (ret.length > 0) {
			for(var i in ret) {
				var imgPanel = this._getImageWrapper(ret[i], 'joo-search-imgwrapper');
				this[name].getContentPane().addChild(imgPanel);
			}
		}
	},
	
	addBrowseImages: function(ret) {
		while(this.browseSketch.children.length > 0) {
			this.browseSketch.removeChildAt(0);
		}
		if (ret.length > 0) {
			for(var i in ret) {
				var imgPanel = this._getImageWrapper(ret[i].url, 'joo-browse-imgwrapper');
				this.browseSketch.addChild(imgPanel);
			}
		}
	},
	
	_getImageWrapper: function(retImg, cls) {
		var _self = this;
		var imgPanel = new Panel();
		imgPanel.access().addClass(cls);
		var img = new JOOImage({src: retImg});
		imgPanel.addChild(img);
		imgPanel.setAttribute('src', img.getAttribute('src'));
		imgPanel.addEventListener('click', function() {
			_self.value = this.getAttribute('src');
			_self.dispatchEvent('change');
		});
		return imgPanel;
	},
	
	showUrlInput: function() {
		this.buttonsContainer.access().hide();
		this.urlContainer.access().show();
		this.urlInput.focus();
	},
	
	urlKeyup: function(e) {
		if (e.keyCode == 13) {
			this.value = this.urlInput.getValue();
			this.dispatchEvent('change');
		}
	},
	
	urlClose: function() {
		this.buttonsContainer.access().show();
		this.urlContainer.access().hide();
	}
});

JOOHtmlObject = DisplayObjectContainer.extend({
	
	setupDomObject: function(config) {
		this._super(config);
		if (config.classid)
			this.setAttribute("classid", config.classid);
	},
	
	getObject: function() {
		return window[this.id];
	},
	
	toHtml: function() {
		return "<object></object>";
	}
});

JOOFontSelector = JOOInput.extend({
	
	setupDomObject: function(config) {
		this._super(config);
		this.select = new JOOInputSelect({width: '100%'});
		this.addChild(this.select);
		
		var fonts = [
		       '', 'cursive', 'monospace', 'serif', 'sans-serif', 'fantasy', 'default', 'Arial', 'Arial Black', 
		       'Arial Narrow', 'Arial Rounded MT Bold', 'Bookman Old Style', 'Bradley Hand ITC', 'Century', 
		       'Century Gothic', 'Comic Sans MS', 'Courier', 'Courier New', 'Georgia', 'Gentium', 'Impact', 
		       'King', 'Lucida Console', 'Lalit', 'Modena', 'Monotype Corsiva', 'Papyrus',
		       'Tahoma', 'TeX', 'Times', 'Times New Roman', 'Trebuchet MS', 'Verdana', 'Verona'
		];
		
		for(var i=0; i<fonts.length; i++) {
			this.select.addOption({label: fonts[i], value: fonts[i]});
		}
	},
	
	getValue: function() {
		return this.select.getValue();
	},
	
	setValue: function(value) {
		this.select.setValue(value);
	},
	
	toHtml: function() {
		return "<div></div>";
	}
});