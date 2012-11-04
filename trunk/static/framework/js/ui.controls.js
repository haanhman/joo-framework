/**
 * @class An editable textbox. This component allows user to change the text
 * by doubleclicking it, and when it losts user's focus, it also lost
 * the editing capabilities.
 * <p>It supports additional configuration parameters</p>
 * <ul>
 * 	<li><code>readonly</code> Whether the component is readonly</li>
 * 	<li><code>blurEvent</code> The event when the component losts editing capabilities</li>
 * </ul>
 * @augments UIComponent
 */
JOOText = UIComponent.extend(
/** @lends JOOText# */
{
	setupDomObject : function(config) {
		this._super(config);
		this.text = new Sketch();
		if (config.lbl)
			this.setLbl(config.lbl);

		if (!config.readonly) {
			this.addEventListener('dblclick', function() {
				this.enableEdit(true);
			});
			this.text.addEventListener('dblclick', function() {
				this._parent.enableEdit(true);
			});
			this.text.addEventListener('keyup', function() {
				var old = this._parent.config.lbl;
				this._parent.config.lbl = this.access().html();
				if (old != this._parent.config.lbl)
					this._parent.dispatchEvent('change');
			});
		}

		this.text.access().addClass("text");
		if (!config.readonly && config.blurEvent) {
			this.addEventListener(config.blurEvent, function() {
				this.enableEdit(false);
			});
		}
		this.addChild(this.text);

		this.text.addEventListener("stageUpdated", function() {
			var _div = document.getElementById(this.getId());
			_div.onfocus = function() {
				window.setTimeout(function() {
					var sel, range;
					if (window.getSelection && document.createRange) {
						range = document.createRange();
						range.selectNodeContents(_div);
						sel = window.getSelection();
						sel.removeAllRanges();
						sel.addRange(range);
					} else if (document.body.createTextRange) {
						range = document.body.createTextRange();
						range.moveToElementText(_div);
						range.select();
					}
				}, 1);
			};
		});
		//		this.attachContextMenu();
		//		var _self = this;
		//		this.getContextMenu().addItem(new JOOMenuItem({label: 'Edit text', command: function() {
		//			_self.enableEdit(true);
		//			_self.getContextMenu().hide();
		//		}}));
	},

	setLbl : function(lbl) {
		this.setValue(lbl);
	},

	getLbl : function() {
		return this.getValue();
	},

	setValue : function(lbl) {
		this.text.access().html(lbl);
	},

	/**
	 * Get the value of the text
	 * @returns {String} the text value
	 */
	getValue : function() {
		return this.text.access().html();
	},

	/**
	 * Enable/Disable editing
	 * @param {Boolean} b Whether the editing is enable
	 */
	enableEdit : function(b) {
		if (b)
			this.text.access().focus();
		this.text.access()[0].contentEditable = b;
	}
});

/**
 * @class A simple video player, counterpart of <code>HTML5 VIDEO</code>
 * <p>It supports additional configuration parameters</p>
 * <ul>
 * 	<li><code>src</code> The source of the video</li>
 * 	<li><code>controls</code> Whether the controls are visible</li>
 * </ul>
 * @augments UIComponent
 */
JOOVideo = UIComponent.extend(
/** @lends JOOVideo# */
{
	setupDomObject : function(config) {
		this._super(config);
		if (config.controls) {
			this.setControls(config.controls);
		}
		if (config.src) {
			this.setSrc(config.src);
		}
	},

	setControls : function(controls) {
		this.setAttribute('controls', controls);
	},

	getControls : function() {
		return this.getAttribute('controls');
	},

	setSrc : function(src) {
		this.setAttribute('src', src);
	},

	getSrc : function() {
		return this.getAttribute('src');
	},

	/**
	 * Play the video
	 */
	play : function() {
		if (!this._domObject) {
			this._domObject = document.getElementById(this.getId());
		}
		if (this._domObject) {
			this._domObject.play();
		}
	},

	stop : function() {
		if (!this._domObject) {
			this._domObject = document.getElementById(this.getId());
		}
		this._domObject.pause();
		this._domObject.currentTime = 0.0;
	},

	pause : function() {
		if (!this._domObject) {
			this._domObject = document.getElementById(this.getId());
		}
		this._domObject.pause();
		return this._domObject.currentTime;
	},

	toHtml : function() {
		return "<video></video>";
	},

	dispose : function(skipRemove) {
		try {
			this.stop();
			this._super(skipRemove);
		} catch (err) {
		}
	}
});

/**
 * @class A simple audio player, extending the {@link JOOVideo}.
 * @augments JOOVideo
 */
JOOAudio = JOOVideo.extend({

	toHtml : function() {
		return "<audio></audio>";
	}
});

/**
 * @class A counterpart of <code>HTML A</code> element.
 * <p>It supports additional configuration parameters</p>
 * <ul>
 * 	<li><code>href</code> The URL the link goes to</li>
 * 	<li><code>lbl</code> The label of the link</li>
 * </ul>
 * @augments UIComponent
 */
JOOLink = UIComponent.extend({

	setupDomObject : function(config) {
		this._super(config);
		if (config.href)
			this.setHref(config.href);
		if (config.lbl)
			this.setLbl(config.lbl);
	},
	
	setLbl: function(lbl) {
		this.access().html(lbl);
	},
	
	setHref: function(href) {
		this.setAttribute('href', href);
	},
	
	toHtml: function() {
		return "<a></a>";
	}
});

/**
 * @class A counterpart of <code>HTML IMG</code> element.
 * <p>It supports additional configuration parameters</p>
 * <ul>
 * 	<li><code>defaultSrc</code> The default source of the image,
 * 	if the provided source is broken</li>
 * 	<li><code>src</code> The source of the image</li>
 * </ul>
 * @augments UIComponent
 */
JOOImage = UIComponent.extend(
/** @lends JOOImage# */
{
	setupDomObject : function(config) {
		this._super(config);
		this.defaultSrc = config.defaultSrc;
		config.src = config.src || this.defaultSrc;
		this.setSrc(config.src);
		if (this.defaultSrc) {
			this.addEventListener('error', function() {
				this.setSrc(this.defaultSrc);
			});
		}
	},

	toHtml : function() {
		return "<img />";
	},

	/**
	 * Get the source of the image
	 * @returns {String} the image source
	 */
	getSrc : function() {
		return this.getAttribute('src');
	},

	/**
	 * Change the source of the image
	 * @param {String} src the new image source
	 */
	setSrc : function(src) {
		this.setAttribute('src', src);
	}
});

/**
 * @class A base class for all components which accept user input
 * by any means.
 * <p>It supports additional configuration parameters</p>
 * <ul>
 * 	<li><code>value</code> The value of the input</li>
 * 	<li><code>name</code> The name of the input</li>
 * </ul>
 * @augments UIComponent
 */
JOOInput = UIComponent.extend(
/** @lends JOOInput# */
{
	setupDomObject : function(config) {
		this._super(config);
		this.access().val(config.value);
		if (config.name)
			this.setName(config.name);
		if (config.placeholder)
			this.setPlaceholder(config.placeholder);
		if (config.required != undefined)
			this.setRequired(config.required);
		if (config.type)
			this.setType(config.type);
	},

	setType : function(type) {
		this.setAttribute('type', type);
	},

	getType : function() {
		return this.getAttribute('type');
	},

	setRequired : function(required) {
		if (required)
			this.setAttribute('required', 'required');
		else
			this.access().removeAttr('required');
	},

	setPlaceholder : function(placeholder) {
		this.setAttribute('placeholder', placeholder);
	},

	getPlaceholder : function() {
		return this.getAttribute('placeholder');
	},

	/**
	 * Change the value of the input
	 * @param {Object} value new value
	 */
	setValue : function(value) {
		var oldValue = this.access().val();
		if (oldValue != value) {
			this.access().val(value).change();
		}
	},

	/**
	 * Get the value of the input
	 * @returns {Object} the input value
	 */
	getValue : function() {
		return this.access().val();
	},

	setName : function(name) {
		this.setAttribute('name', name);
	},

	/**
	 * Get the name of the input
	 * @returns {String} the input name
	 */
	getName : function() {
		return this.getAttribute('name');
	},

	/**
	 * Focus the input
	 */
	focus : function() {
		this.access().focus();
	}
});

/**
 * @class An input which provides an area
 * for user to enter text. It is the counterpart
 * of <code>HTML TEXTAREA</code> element.
 */
JOOTextArea = JOOInput.extend(
/** @lends JOOTextArea# */
{

	toHtml : function() {
		return "<textarea></textarea>";
	},

	/**
	 * Alias of <code>getValue</code>
	 * @returns {String} the value of the textarea
	 */
	getText : function() {
		return this.getValue();
	}
});

/**
 * @class A counterpart of <code>HTML LABEL</code> element.
 * @augments UIComponent
 */
JOOLabel = UIComponent.extend(
/** @lends JOOLabel# */
{
	setupDomObject : function(config) {
		this._super(config);
		this.setLbl(config.lbl);
		if (config['for']) {
			this.setFor(config['for']);
		}
	},

	setFor : function(obj) {
		if ( obj instanceof JOOCheckbox) {
			this.addEventListener('click', function() {
				obj.setState(!obj.state);
			});
		} else {
			this.setAttribute('for', obj.getId());
		}
	},

	setLbl : function(lbl) {
		this.access().html(lbl);
	},

	getLbl : function() {
		return this.access().html();
	},

	toHtml : function() {
		return "<label></label>";
	},

	/**
	 * Get the text of the label
	 * @returns {String} the label's text
	 */
	getText : function() {
		return this.getLbl();
	},

	/**
	 * Change the text of the label
	 * @param {String} txt the new text
	 */
	setText : function(txt) {
		this.setLbl(txt);
	}
});

/**
 * @class A counterpart of <code>HTML INPUT TEXT</code>
 * @augments JOOInput
 */
JOOTextInput = JOOInput.extend({

	toHtml : function() {
		return "<input type='text' />";
	}
});

/**
 * @class A counterpart of <code>HTML INPUT PASSWORD</code>
 * @augments JOOInput
 */
JOOPasswordInput = JOOInput.extend({

	toHtml : function() {
		return "<input type='password' />";
	}
});

/**
 * @class An input associated with a label.
 * <p>It supports additional configuration parameters</p>
 * <ul>
 * 	<li><code>labelObject</code> the label object, if not specified a new label will be created using the same configuration parameters as this object</li>
 * 	<li><code>inputObject</code> the input object, if not specified a new text input will be created using the same configuration parameters as this object</li>
 * </ul>
 * @augments JOOInput
 */
JOOInputBox = JOOInput.extend(
/** @lends JOOInput# */
{
	setupDomObject : function(config) {
		this._super(config);
		this.label = config.labelObject || new JOOLabel(config);
		this.input = config.inputObject || new JOOTextInput(config);
		this.addChild(this.label);
		this.addChild(this.input);
	},

	/**
	 * Get the value of the input
	 * @returns {Object} the input value
	 */
	getValue : function() {
		return this.input.getValue();
	},

	/**
	 * Change the value of the input
	 * @param value {Object} the new input value
	 */
	setValue : function(value) {
		this.input.setValue(value);
	},

	/**
	 * Get the text of the label
	 * @returns {String} the label's text
	 */
	getLabel : function() {
		return this.label.getValue();
	},

	/**
	 * Get the name of the input
	 * @returns the input's name
	 */
	getName : function() {
		return this.input.getName();
	},

	focus : function() {
		this.input.focus();
	}
});

JOOSelectOption = Graphic.extend({

	setupDomObject : function(config) {
		this._super(config);
		this.repaint(config.label);
		this.setValue(config.value);
	},

	getValue : function() {
		return this.getAttribute("value");
	},

	setValue : function(value) {
		var old = this.getAttribute("value");
		if (old != value) {
			this.setAttribute("value", value);
			this.dispatchEvent('change');
		}
	},

	toHtml : function() {
		return "<option></option>";
	}
});

/**
 * @class A counterpart of <code>HTML SELECT</code> element.
 * <p>It supports additional configuration parameters:</p>
 * <ul>
 * 	<li><code>options</code> Initial options of this select box. It must be an <code>Array</code>
 * 		which each element is an object with <code>label</code> and <code>value</code> properties.
 * 	</li>
 * 	<li><code>selectedIndex</code> The initially selected index, defaults is 0</li>
 * 	<li><code>selectedValue</code> The initially selected value. Should not present if <code>selectedIndex</code> is already specified.</li>
 * </ul>
 * @augments JOOInput
 */
JOOInputSelect = JOOInput.extend({

	setupDomObject : function(config) {
		this._super(config);

		this.options = Array();
		var options = config.options || {};
		for (var i = 0; i < options.length; i++) {
			this.addOption(options[i]);
		}
		this.selectedIndex = config.selectedIndex || 0;
		if (config.selectedIndex == undefined && config.selectedValue != undefined) {
			this.selectedIndex = 0;
			for (var i = 0; i < this.options.length; i++) {
				if (this.options[i].value == config.selectedValue) {
					this.selectedIndex = i;
					break;
				}
			}
		}

		this.addEventListener("change", function(e) {
			if (e != undefined)
				this.selectedIndex = e.currentTarget.options.selectedIndex;
		});
		this.access().val(config.selectedValue);
	},

	/**
	 * Add an option to the select box.
	 * @param {Object} param new option, with <code>label</code> and <code>value</code> properties.
	 */
	addOption : function(param) {
		this.options.push(param);
		if (param.order != undefined) {
			for (var i = this.options.length - 2; i >= param.order; i--) {
				this.options[i] = this.options[i + 1];
			}
		}
		this.addChild(new JOOSelectOption(param));
	},

	/**
	 * Change the value of the select box
	 * @param {String} val new value of the select box.
	 */
	setValue : function(val) {
		this.access().val(val);
		this.selectedIndex = this.access().find("option:selected").index() - 1;
		this.dispatchEvent("change");
	},

	/**
	 * Change the value of the select box to an option by its index.
	 * @param {Number} idx the index of the option.
	 */
	setValueByIndex : function(idx) {
		this.selectedIndex = idx;
		this.access().find("option").eq(idx).attr("selected", "selected");
		this.dispatchEvent("change");
	},

	/**
	 * Get the value of the select box.
	 * @returns {String} the select box's value.
	 */
	getValue : function() {
		return this.access().val();
	},

	/**
	 * Refresh the select box.
	 */
	refresh : function() {
		this.access().html(this.toHtml());
		this.selectedIndex = this.access().find("option:selected").index() - 1;
	},

	toHtml : function() {
		return "<select></select>";
	}
});

/**
 * @class A counterpart of <code>HTML BUTTON</code> element.
 * <p>It supports additional configuration parameters:</p>
 * <ul>
 * 	<li><code>lbl</code> The label of the button.</li>
 * </ul>
 * @augments UIComponent
 */
JOOButton = UIComponent.extend(
/** @lends JOOButton# */
{

	setupDomObject : function(config) {
		this._super(config);
		if (config.lbl != undefined) {
			this.setLbl(config.lbl);
		}
		this.addEventListener('click', function(e) {
			this.onclick(e);
		});
		//		this.addEventListener('mousedown', function(e) {
		//			this.access().addClass('focus');
		//		});
	},

	setLbl : function(lbl) {
		this.access().html(lbl);
	},

	getLbl : function() {
		return this.access().html();
	},

	toHtml : function() {
		return "<a></a>";
	},

	/**
	 * Command attached to the button.
	 * @param e the event object
	 */
	onclick : function(e) {
	}
});

/**
 * @class A customized button, which excludes all styles
 * of its superclass and ancestors.
 * @augments JOOButton
 */
JOOCustomButton = JOOButton.extend({

	setupDomObject : function(config) {
		this.inheritedCSSClasses = false;
		this._super(config);
	}
});

/**
 * @class A button which can toggle up and down.
 * <p>It supports additional configuration parameters</p>
 * <ul>
 * 	<li><code>state</code> The initial state of the button</p>
 * </ul>
 * @augments JOOCustomButton
 */
JOOToggleButton = JOOCustomButton.extend(
/** @lends 	JOOToggleButton# */
{
	setupBase : function(config) {
		this.state = config.state;
		this._super(config);
	},

	setupDomObject : function(config) {
		this._super(config);
		if (this.state)
			this.access().addClass('joo-toggle-down');
	},

	/**
	 * Change the state of the button.
	 * @param {Boolean} state the state of the button
	 */
	setState : function(state) {
		this.state = state;
		if (this.state) {
			this.access().addClass('joo-toggle-down');
			this.ontoggledown();
		} else {
			this.access().removeClass('joo-toggle-down');
			this.ontoggleup();
		}
	},

	/**
	 * Get the state of the button.
	 * @returns {Boolean} the state of the button
	 */
	getState : function() {
		return this.state;
	},

	onclick : function(e) {
		this.access().toggleClass("joo-toggle-down");
		if (this.state) {
			this.state = false;
			this.ontoggleup();
		} else {
			this.state = true;
			this.ontoggledown();
		}
		this.dispatchEvent('toggle');
	},

	ontoggledown : function() {
		this.dispatchEvent('toggleDown');
	},

	ontoggleup : function() {
		this.dispatchEvent('toggleUp');
	}
});

/**
 * @class An equivalent but different from <code>HTML INPUT CHECKBOX</code> element.
 * @augments JOOToggleButton
 */
JOOCheckbox = JOOToggleButton.extend(
/** @lends JOOCheckbox# */
{
	ontoggledown : function() {
		this.value = true;
		this.access().addClass('checked');
		this.dispatchEvent('change');
	},

	ontoggleup : function() {
		this.value = false;
		this.access().removeClass('checked');
		this.dispatchEvent('change');
	},

	/**
	 * Get the value of the checkbox.
	 * @returns {Boolean} the value. <code>true</code> if the checkbox is checked,
	 * <code>false</code> otherwise.
	 */
	getValue : function() {
		return this.value;
	},

	/**
	 * Change the value of the checkbox.
	 * @param {Boolean} value the value of the checkbox
	 */
	setValue : function(value) {
		if (value)
			this.ontoggledown();
		else
			this.ontoggleup();
	},

	toHtml : function() {
		return "<span></span> ";
	}
});

JOOCloseButton = JOOCustomButton.extend({

	setupDomObject : function(config) {
		this._super(config);
		this.access().addClass("joo-custom-button");
	},

	toHtml : function() {
		return "<span></span>";
	}
});

/**
 * @class A sprite is a keyframe-based animation object which has a timeline. This is
 * base class of all animation classes.
 * <p>It supports additional configuration parameters:</p>
 * <ul>
 * 	<li><code>src</code> the background image source, should be a sprite image</li>
 * 	<li><code>framerate</code> the framerate of the sprite</li>
 * 	<li><code>loop</code> whether the animation should loop</li>
 * 	<li><code>horizontalFramesNo</code> the number of frames in horizontal dimension</li>
 * 	<li><code>verticalFramesNo</code> the number of frames in vertical dimension</li>
 * 	<li><code>spriteWidth</code> the width of the viewport of sprite</li>
 * 	<li><code>spriteHeight</code> the height of the viewport of sprite</li>
 * 	<li><code>speed</code> the relative speed of sprite, e.g 1.5, 2, etc</li>
 * </ul>
 * @augments UIComponent
 */
JOOSprite = UIComponent.extend(
/** @lends JOOSprite# */
{
	setupDomObject : function(config) {
		this._super(config);
		this.framerate = config.framerate || 30;
		this.loop = config.loop || false;
		this.currentFrame = 0;
		this.horizontalFramesNo = config.horizontalFramesNo;
		this.verticalFramesNo = config.verticalFramesNo;
		this.spriteWidth = config.spriteWidth;
		this.spriteHeight = config.spriteHeight;
		this.speed = config.speed || 1;
		this.stopped = false;

		if (config.src)
			this.setSrc(config.src);
		this.setWidth(this.spriteWidth);
		this.setHeight(this.spriteHeight);
	},

	setSrc : function(src) {
		this.src = src;
		this.access().css('background-image', 'url(' + this.src + ')');
	},

	getSrc : function() {
		return this.src;
	},

	/**
	 * Play the sprite from <code>start</code> frame to <code>end</code> frame.
	 * @param {Number} start the start frame
	 * @param {Number} end the end frame
	 */
	play : function(start, end) {
		this.stopped = false;
		this.dispatchEvent("frameStart");
		this.startFrame = start || 0;
		this.endFrame = end;
		if (end == undefined) {
			this.endFrame = this.verticalFramesNo * this.horizontalFramesNo - 1;
		}
		this.currentFrame = this.startFrame;

		this.playFrame();
		this._playWithFramerate(this.framerate);
	},

	_playWithFramerate : function(framerate) {
		framerate *= this.speed;
		if (!this.stopped) {
			var _self = this;
			this.interval = setInterval(function() {
				_self.playFrame();
			}, parseFloat(1000 / framerate));
		}
	},

	/**
	 * Change the relative speed of the sprite.
	 * @param speed the relative speed of the sprite
	 */
	setSpeed : function(speed) {
		var tempFramerate = this.framerate * speed;
		clearInterval(this.interval);
		this._playWithFramerate(tempFramerate);
	},

	/**
	 * Pause the sprite.
	 */
	pause : function() {
		this.dispatchEvent("framePause");
		clearInterval(this.interval);
	},

	/**
	 * Resume the sprite.
	 */
	resume : function() {
		this.dispatchEvent("frameResume");
		this._playWithFramerate(this.interval);
	},

	/**
	 * Stop the sprite.
	 */
	stop : function() {
		this.dispatchEvent("frameStop");
		this.stopped = true;
	},

	playFrame : function() {
		var ended = false;
		if (this.currentFrame > this.endFrame) {
			if (this.loop) {
				this.currentFrame = this.startFrame;
			} else {
				ended = true;
			}
		}
		if (ended || this.stopped) {
			clearInterval(this.interval);
			this.stopped = true;
			this.dispatchEvent("frameEnded");
			return;
		}
		this.dispatchEvent("frameEnter");
		this.onFrame(this.currentFrame);
		this.dispatchEvent("frameExit");
		this.currentFrame++;
	},

	/**
	 * This method defines how animation works. Subclass can override it to
	 * change the behaviour. This implementation just change the
	 * <code>background-position</code> of the sprite.
	 * @param frame
	 */
	onFrame : function(frame) {
		var x = frame % this.horizontalFramesNo;
		var y = 0;
		if (this.currentFrame != 0)
			y = Math.floor(frame / this.horizontalFramesNo);
		var xPos = -y * this.spriteWidth + "px";
		var yPos = -x * this.spriteHeight + "px";
		this.access().css('background-position', xPos + ' ' + yPos);
	},

	toHtml : function() {
		return "<div></div>";
	},

	dispose : function(skipRemove) {
		this.stop();
		this._super(skipRemove);
	}
});

/**
 * @class A counterpart of <code>HTML INPUT FILE</code> element.
 * @augments JOOInput
 */
JOOFileInput = JOOInput.extend({

	setupDomObject : function(config) {
		this._super(config);
		if (config.multiple)
			this.setAttribute('multiple', config.multiple);
	},

	toHtml : function() {
		return "<input type='file' />";
	}
});

/**
 * @class A basic AJAX-style uploader.
 * <p>It supports additional configuration parameters:</p>
 * <ul>
 * 	<li><code>name</code> the name of the uploader</li>
 * 	<li><code>endpoint</code> the URL to which the uploader is connected</li>
 * </ul>
 * @augments UIComponent
 */
JOOBasicUploader = UIComponent.extend({

	setupDomObject : function(config) {
		this.endpoint = config.endpoint || "";
		this._super(config);
		this.fileInput = new JOOFileInput({
			name : config.name,
			multiple : config.multiple
		});

		var iframeId = this.getId() + "-iframe";
		var form = new CustomDisplayObject({
			html : "<form enctype='multipart/form-data' target='" + iframeId + "' action='" + this.endpoint + "' method='post'></form>"
		});
		form.addChild(this.fileInput);
		var _self = this;
		this.fileInput.addEventListener('change', function(e) {
			_self.dispatchEvent('inputchange', e);
			if (config.autosubmit)
				form.access().submit();
		});
		form.addEventListener('submit', function(e) {
			var frame = _self.access().find('iframe');
			$(frame).one('load', function() {
				var response = frame.contents().find('body').html();
				_self.dispatchEvent('submitSuccess', {
					endpoint : _self.endpoint,
					data : response
				});
			});
		});
		this.addChild(form);
	},

	toHtml : function() {
		var iframeId = this.getId() + "-iframe";
		return "<div><iframe class='joo-uploader-iframe' name='" + iframeId + "' id='" + iframeId + "'></iframe></div>";
	}
});

/**
 * @class A customized uploader, which features an overlay control.
 * <p>It supports additional configuration parameters:</p>
 * <ul>
 * 	<li><code>control</code> the control of the uploader</li>
 * </ul>
 * @augments JOOBasicUploader
 */
JOOAdvancedUploader = JOOBasicUploader.extend({

	setupDomObject : function(config) {
		this._super(config);
		this.fileInput.access().addClass('joo-advanceduploader-input');
		if (config.control) {
			this.addChild(config.control);
		}
	},

	toHtml : function() {
		var iframeId = this.getId() + "-iframe";
		return "<div><iframe class='joo-uploader-iframe' name='" + iframeId + "' id='" + iframeId + "'></iframe></div>";
	}
});

/**
 * @class A <code>bold</code> toggle button, used in editors.
 * @augments JOOToggleButton
 */
JOOToggleBoldButton = JOOToggleButton.extend({

	toHtml : function() {
		return "<div></div>";
	}
});

/**
 * @class A <code>italic</code> toggle button, used in editors.
 * @augments JOOToggleButton
 */
JOOToggleItalicButton = JOOToggleButton.extend({

	toHtml : function() {
		return "<div></div>";
	}
});

/**
 * @class A <code>underline</code> toggle button, used in editors.
 * @augments JOOToggleButton
 */
JOOToggleUnderlineButton = JOOToggleButton.extend({

	toHtml : function() {
		return "<div></div>";
	}
});

/**
 * @class A <code>horizontal flip</code> toggle button, used in editors.
 * @augments JOOToggleButton
 */
JOOToggleFlipHorizontalButton = JOOToggleButton.extend({

	toHtml : function() {
		return "<div></div>";
	}
});

/**
 * @class A <code>vertical flip</code> toggle button, used in editors.
 * @augments JOOToggleButton
 */
JOOToggleFlipVerticalButton = JOOToggleButton.extend({

	toHtml : function() {
		return "<div></div>";
	}
});

/**
 * @class A <code>left align</code> toggle button, used in editors.
 * @augments JOOToggleButton
 */
JOOToggleAlignLeftButton = JOOToggleButton.extend({

	toHtml : function() {
		return "<div></div>";
	}
});

/**
 * @class A <code>centered align</code> toggle button, used in editors.
 * @augments JOOToggleButton
 */
JOOToggleAlignCenterButton = JOOToggleButton.extend({

	toHtml : function() {
		return "<div></div>";
	}
});

/**
 * @class A <code>right align</code> toggle button, used in editors.
 * @augments JOOToggleButton
 */
JOOToggleAlignRightButton = JOOToggleButton.extend({

	toHtml : function() {
		return "<div></div>";
	}
});

/**
 * @class A panel which holds multiple tabs.
 * @augments Panel
 */
JOOTabbedPane = Panel.extend(
/** @lends JOOTabbedPane# */
{

	setupBase : function(config) {
		this.tabs = Array();
		this._super(config);
	},

	setupDomObject : function(config) {
		this.header = new CustomDisplayObject({
			html : "<div class='joo-tab-header'></div>"
		});
		this.content = new CustomDisplayObject({
			html : "<div class='joo-tab-content'></div>"
		});
		this._super(config);
		this.addChild(this.header);
		this.addChild(this.content);
	},

	/**
	 * Add a tab to this panel.
	 * @param {String} title the title of the tab
	 * @param {DisplayObject} comp the tab component
	 * @param {String} icon an icon associated with the tab
	 * @param {String} tooltip a tooltip associated with the tab
	 */
	addTab : function(title, comp, icon, tooltip) {
		comp.access().addClass('joo-tab-item');
		if (!tooltip)
			tooltip = "";
		var header = new CustomDisplayObject({
			html : "<span title='" + tooltip + "'></span>"
		});
		if (icon != undefined)
			header.addChild(new JOOImage({
				src : icon,
				passClickEvent : true
			}));
		header.addChild(new JOOLabel({
			lbl : title,
			passClickEvent : true
		}));
		header.access().addClass('joo-tab-control');

		var _self = this;
		header.setAttribute('tabIndex', this.header.children.length);
		header.addEventListener('click', function(e) {
			_self.setTab(this.getAttribute('tabIndex'));
		});

		this.header.addChild(header);
		this.content.addChild(comp);
		this.tabs.push(comp);
		if (this.header.children.length == 1) {
			this.setTab(0);
		}
	},

	/**
	 * Change the active tab.
	 * @param {Number} index the index of the tab to be active
	 */
	setTab : function(index) {
		for (var i = 0; i < this.header.children.length; i++) {
			this.header.children[i].access().removeClass('active');
		}
		this.header.children[index].access().addClass('active');
		for (var i = 0; i < this.tabs.length; i++) {
			this.tabs[i].access().hide();
		}
		this.tabs[index].setStyle('display', 'block');
	},

	toHtml : function() {
		return "<div></div>";
	}
});

/**
 * @class An accordion, which has a header to toggle its content.
 * @augments UIComponent
 */
JOOAccordion = UIComponent.extend(
/** @lends JOOAccordion# */
{
	setupDomObject : function(config) {
		this._super(config);
		this.header = new Sketch();
		this.header.access().addClass('joo-accordion-header');
		this.header.access().html(config.lbl);
		var _self = this;
		this.header.addEventListener('click', function() {
			_self.contentPane.access().slideToggle(config.toggleSpeed || 500);
			_self.header.access().toggleClass('collapsed');
		});
		this.contentPane = new Sketch();
		this.contentPane.access().addClass('joo-accordion-content');
		this.addChild(this.header);
		this.addChild(this.contentPane);
	},

	/**
	 * Get the content panel of the accordion.
	 * @returns {Sketch} the content panel
	 */
	getContentPane : function() {
		return this.contentPane;
	},

	/**
	 * Change the label of the accordion.
	 * @param {String} label the label of the accordion
	 */
	setAccordionLabel : function(label) {
		this.header.access().html(label);
	}
});

/**
 * @class A ruler which supports drag.
 * <p>It supports additional configuration parameters:</p>
 * <ul>
 * 	<li><code>width</code> the width of the ruler</li>
 * 	<li><code>height</code> the height of the ruler</li>
 * 	<li><code>initmin</code> the minimum value of the ruler</li>
 * 	<li><code>initmax</code> the maximum value of the ruler</li>
 * 	<li><code>interval</code> the interval number of the ruler</li>
 * 	<li><code>groupmode</code> could be "half" or "quarter"</li>
 * 	<li><code>value</code> the intial value of the ruler</li>
 * </ul>
 * @augments JOOInput
 */
JOORuler = JOOInput.extend(
/** @lends JOORuler# */
{
	setupDomObject : function(config) {
		this._super(config);
		this.width = parseFloat(config.width);
		this.height = parseFloat(config.height);
		this.initMin = parseFloat(config.initmin || 0);
		this.min = parseFloat(config.min || 0);
		this.initMax = parseFloat(config.initmax || this.width / 10);
		this.max = parseFloat(config.max || this.initMax);
		this.interval = parseFloat(config.interval || 1);
		this.groupMode = config.groupmode;
		this.value = parseFloat(config.value || this.initmin);
		this.autoExpand = this.autoExpand || true;
		this.baseValue = 0;

		this.canvas = new Canvas({
			width : this.width,
			height : this.height
		});
		this.addChild(this.canvas);
		this.addEventListener('stageUpdated', function() {
			this.initRuler();
			this.initRoller();
		});
	},

	initRoller : function() {
		this.backRoller = new JOOImage({
			absolute : true,
			height : 16,
			custom : {
				position : 'absolute',
				left : '-10px'
			},
			src : 'static/images/backward.png'
		});
		this.forwardRoller = new JOOImage({
			absolute : true,
			height : 16,
			custom : {
				position : 'absolute',
				right : '-10px'
			},
			src : 'static/images/forward.png'
		});

		var _self = this;
		this.backRoller.addEventListener('mousedown', function() {
			_self.startExpand();
		});
		this.backRoller.addEventListener('mouseup', function() {
			_self.stopExpand();
		});
		this.backRoller.addEventListener('mouseout', function() {
			_self.stopExpand();
		});

		this.forwardRoller.addEventListener('mousedown', function() {
			_self.startExpand(true);
		});
		this.forwardRoller.addEventListener('mouseup', function() {
			_self.stopExpand();
		});
		this.forwardRoller.addEventListener('mouseout', function() {
			_self.stopExpand();
		});

		this.addChild(this.backRoller);
		this.addChild(this.forwardRoller);
	},

	initRuler : function() {
		var context = this.canvas.getContext();
		context.beginPath();
		context.clearRect(0, 0, parseInt(this.canvas.getWidth()), parseInt(this.canvas.getHeight()));
		var len = this.initMax - this.initMin;

		if (this.groupMode == "quarter")
			this.group = this.interval * 4;
		else if (this.groupMode == "half")
			this.group = this.interval * 2;
		else
			this.group = this.interval * 1;

		var font = new JOOFont();
		context.setFont(font);
		this.deltaY = 9;
		this.deltaX = 5;
		context.moveTo(this.deltaX, this.deltaY);
		context.lineTo(this.getWidth() - this.deltaX, this.deltaY);

		var valueX = this.convertValueToX(this.deltaX);
		this.drawPointer(valueX, 0, this.deltaX, this.deltaY);

		var base = this.baseValue % this.group;
		var min = this.initMin - base;
		var max = this.initMax - base;
		for (var i = -base; i <= len; i += this.interval) {
			var x = i * (this.getWidth() - 2 * this.deltaX) / len + this.deltaX;
			context.moveTo(x, this.getHeight() / 10 + this.deltaY);
			var h = this.height / 2;

			if (i == -base || i == max - min || (i + base) % this.group == 0) {
				if (i == max - min)
					context.setTextAlign('right');
				else if (i == 0)
					context.setTextAlign('left');
				else
					context.setTextAlign('center');
				context.fillText(i + base + min, x, this.height / 2 + 15 + this.deltaY);
			}
			if ((i + base) % this.group == 0) {

			} else if (((i + base) / this.interval) % (this.group / this.interval) == 2) {
				h = h * 0.75;
			} else {
				h = h * 0.5;
			}
			context.lineTo(x, h + this.deltaY);
		}
		context.stroke();
	},

	/**
	 * Mark the ruler at a specific value.
	 * @param {Number} value the value to be marked
	 */
	mark : function(value) {
		var _self = this;
		var x = this.convertValueToX(this.deltaX, value);
		var sk = new Sketch({
			width : 10,
			height : 10,
			'background-color' : 'red',
			custom : {
				display : 'inline-block',
				position : 'absolute',
				cursor : 'pointer'
			}
		});
		sk.setLocation(x - 5, 5);
		this.addChild(sk);
		sk.addEventListener('click', function() {
			_self.setValue(value);
		});
	},

	convertValueToX : function(deltaX, value) {
		value = value || this.value;
		return (value - this.initMin) / (this.initMax - this.initMin) * (this.getWidth() - 2 * deltaX);
	},

	convertXToValue : function(x, deltaX) {
		var percent = x / (this.getWidth() - 2 * deltaX);
		if (percent < 0)
			percent = 0;
		else if (percent > 1)
			percent = 1;
		return Math.round(this.initMin + percent * (this.initMax - this.initMin));
	},

	expandLeft : function() {
		if (this.initMin > this.min) {
			this.baseValue--;
			this.initMin--;
			this.initMax--;
			this.initRuler();
			this.dispatchEvent('expanded');
		}
	},

	expandRight : function() {
		if (this.initMax < this.max) {
			this.baseValue++;
			this.initMin++;
			this.initMax++;
			this.initRuler();
			this.dispatchEvent('expanded');
		}
	},

	expand : function(inc, isRight) {
		if (isRight) {
			this.expandRight();
		} else {
			this.expandLeft();
		}
	},

	startExpand : function(isRight) {
		var _self = this;
		this.expandInterval = setInterval(function() {
			_self.expand(undefined, isRight);
			_self.setValue(_self.getValue());
		}, 25);
	},

	stopExpand : function(isRight) {
		clearInterval(this.expandInterval);
	},

	startTracking : function() {
		var _self = this;
		this.trackingInterval = setInterval(function() {
			var inc = _self.pointer.getX() - (_self.getWidth() - 2 * _self.deltaX);
			var v = _self.convertXToValue(_self.pointer.getX(), _self.deltaX);
			if (v >= _self.initMax - 1) {
				if (_self.autoExpand) {
					_self.expand(Math.round(inc / 2), true);
				}
			} else if (v <= _self.initMin) {
				if (_self.autoExpand) {
					_self.expand(Math.round(inc / 2));
				}
			}
		}, 25);
	},

	stopTracking : function() {
		clearInterval(this.trackingInterval);
		this.trackingInterval = undefined;
	},

	drawPointer : function(x, y, deltaX, deltaY) {
		if (this.pointer)
			return;
		var _self = this;

		var img = new UIComponent({
			width : deltaX * 2,
			height : deltaY * 2
		});
		img.access().addClass('joo-ruler-pointer');
		img.setLocation(x, y);
		img.addEventListener('dragstart', function() {
			_self.startTracking();
		});
		img.addEventListener('drag', function(e) {
			_self.dispatchEvent('pointerdrag', {
				"position" : this.getX()
			});
		});
		img.addEventListener('dragstop', function(e) {
			hidetip();
			_self.stopTracking();
			_self.setValue(_self.convertXToValue(this.getX(), deltaX));
		});

		Wrapper.wrap(img, DraggableInterface);
		img.draggable({
			axis : 'x',
			containment : 'parent'
		});
		img.startDrag();

		this.pointer = img;

		this.addChild(img);
	},

	getValue : function() {
		return this.value;
	},

	/**
	 * Change the value of the ruler. It also updates the ruler pointer's position.
	 * @param {Number} value the new value of the ruler
	 */
	setValue : function(value) {
		var oldValue = this.value;
		if (value < this.min)
			value = this.min;
		else if (value > this.max)
			value = this.max;
		this.value = value;
		if (this.pointer) {
			if (value < this.initMin || value > this.initMax) {
				this.pointer.access().hide();
			} else {
				this.pointer.access().show();
				this.pointer.setX(this.convertValueToX(5));
			}
		}
		if (this.value != oldValue) {
			this.dispatchEvent('change');
		}
	}
});

JOOToggleBar = Sketch.extend({

	setupBase : function(config) {
		this.items = {};
		this.multi = config.multi;
		this.value = undefined;
		this.defaultValue = config.defaultValue;
		this._super(config);
	},

	setupDomObject : function(config) {
		this._super(config);
		if (config.items) {
			for (var i in config.items) {
				this.addItem(config.items[i], i);
			}
		}
	},

	addItem : function(item, value) {
		this.addChild(item);
		this.items[value] = item;
		item.itemId = value;
		var _self = this;
		item.addEventListener('toggle', function() {
			if (this.state)
				_self.onStateDown(item);
			else
				_self.onStateUp(item);
		});
	},

	getValue : function() {
		return this.value;
	},

	setValue : function(value) {
		this.value = value;
		this.dispatchEvent('change');
	},

	onStateDown : function(item) {
		if (this.getValue() != item.itemId) {
			if (this.getValue() && this.items[this.getValue()])
				this.items[this.getValue()].setState(false);
			this.setValue(item.itemId);
		}
	},

	onStateUp : function(item) {
		this.setValue(this.defaultValue);
	}
});

/**
 * @class A component holding another components in a list view.
 * <p>It supports additional configuration parameters</p>
 * <ul>
 * 	<li><code>readonly</code> Whether each item in the list is readonly</li>
 * </ul>
 * @augments UIComponent
 */
JOOList = UIComponent.extend(
/** @lends	JOOList# */
{
	setupBase : function(config) {
		this.items = Array();
		this.readonly = config.readonly;
		this.selectedItem = undefined;
		this._super(config);
	},

	/**
	 * Add an item to the list.
	 * @param {Object} obj the item to be added, must be an object with
	 * <code>label</code> and <code>value</code> properties
	 * @returns {JOOText} the newly added item
	 */
	addItem : function(obj) {
		var item = new Sketch();
		var text = new JOOText({
			lbl : obj.label,
			readonly : this.readonly,
			blurEvent : 'itemDeselected'
		});
		item.text = text;
		item.addChild(text);
		this.items.push(item);
		this.addChild(item);
		item.addEventListener('click', function() {
			this._parent.selectItem(this);
		});
		text.addEventListener('change', function() {
			this._parent.dispatchEvent('itemChanged');
		});
		item.value = obj.value;
		return item;
	},

	/**
	 * Get the current selected item.
	 * @returns {JOOText} the current selected item
	 */
	getSelectedItem : function() {
		return this.selectedItem;
	},

	/**
	 * Get the index of current selected item.
	 * @returns {Number} the index
	 */
	getSelectedIndex : function() {
		return this.indexOf(this.selectedItem);
	},

	/**
	 * Programmatically select an item.
	 * @param {JOOText} item the item to be selected
	 */
	selectItem : function(item) {
		if (item == this.selectedItem)
			return;
		if (this.selectedItem) {
			this.selectedItem.access().removeClass('selected');
			this.selectedItem.text.dispatchEvent('itemDeselected');
		}
		this.selectedItem = item;
		if (item) {
			this.selectedItem.access().addClass('selected');
		}
		this.dispatchEvent('change');
	},

	setupDomObject : function(config) {
		this._super(config);
		this.setLayout('vertical');
	},
});

/**
 * @class A desktop-style dialog. It has a title bar and a content pane.
 * <p>It supports additional configuration parameters</p>
 * <ul>
 * 	<li><code>title</code> The title of the dialog</li>
 * </ul>
 * @augments UIComponent
 * @implements DraggableInterface
 */
JOODialog = UIComponent.extend(
/** @lends JOODialog# */
{
	setupDomObject : function(config) {
		this._super(config);

		this.titleBar = new Sketch();
		this.contentPane = new Sketch();
		this.titleBar.access().addClass('joo-dialog-title');
		this.contentPane.access().addClass('joo-dialog-content');

		this.addChild(this.titleBar);
		this.addChild(this.contentPane);

		var _self = this;
		this.closeBtn = new JOOCloseButton({
			absolute : true
		});
		this.closeBtn.onclick = function() {
			_self.dispatchEvent('closing');
			if (config.closemethod == 'do_nothing')
				return;
			if (!config.closemethod)
				config.closemethod = "close";
			_self[config.closemethod].apply(_self);
		};
		var label = new JOOLabel();
		this.titleBar.addChild(label);
		this.titleBar.addChild(this.closeBtn);

		if (config.title != undefined)
			this.setTitle(config.title);

		if (!config.stick) {
			this.draggable({
				handle : this.titleBar.access()
			});
			this.startDrag();
		}
		this.addEventListener('stageUpdated', function() {
			this.afterAdded();
		});
	},

	/**
	 * Make the dialog centered by the screen.
	 */
	center : function() {
		var w = ($(window).width() - this.access().outerWidth()) / 2;
		var h = ($(window).height() - this.access().outerHeight()) / 2;
		this.setLocation(w < 0 ? 0 : w, h < 0 ? 0 : h);
	},

	afterAdded : function() {
		var modal = this.config.modal || false;
		if (modal) {
			this.modalSketch = new Sketch();
			this.modalSketch.access().addClass('joo-modal-dialog');
			this.stage.addChild(this.modalSketch, this.access());
			this.modalSketch.setStyle('z-index', parseInt(this.getStyle('z-index') - 1));
			this.modalSketch.access().show();
		}
	},

	/**
	 * Change the title of the dialog.
	 * @param title the new title
	 */
	setTitle : function(title) {
		this.config.title = title;
		this.titleBar.getChildren()[0].setText(title);
	},

	/**
	 * Get the current title of the dialog.
	 * @returns {String} the current title
	 */
	getTitle : function() {
		return this.titleBar.getChildren()[0].getText();
	},

	/**
	 * Get the content pane of the dialog.
	 * @returns {Sketch} the content pane
	 */
	getContentPane : function() {
		return this.contentPane;
	},

	/**
	 * Close the dialog.
	 */
	close : function() {
		if (this.modalSketch != undefined)
			this.modalSketch.selfRemove();
		this.selfRemove();
	},

	/**
	 * Show the dialog.
	 */
	show : function() {
		this.access().show();
	},

	/**
	 * Hide the dialog.
	 */
	hide : function() {
		this.access().hide();
	},

	toHtml : function() {
		return "<div></div>";
	}
}).implement(DraggableInterface);

AboutApplicationDialog = JOODialog.extend({

	setupBase : function(config) {
		this.config.modal = config.modal = false;
		this._super(config);
	},

	setupDomObject : function(config) {
		this._super(config);

		var appinfo = SingletonFactory.getInstance(ApplicationInfo);
		this.setTitle("About " + appinfo.name);
		this.setWidth(500);

		var sketch1 = new Sketch();
		var img = new JOOImage({
			src : appinfo.logo,
			width : 100,
			height : 100
		});
		var panel1 = new Panel();
		panel1.addChild(img);

		var panel2 = new Panel();
		var header = new JOOLabel({
			lbl : appinfo.name
		});
		var version = new JOOLabel({
			lbl : "Version " + appinfo.version
		});
		var description = new JOOLabel({
			lbl : appinfo.description
		});
		var font = new JOOFont();

		font.setFontSize('15px');
		font.setBold(true);
		header.applyFont(font);

		font.setFontSize('13px');
		font.setBold(false);
		font.setItalic(true);
		version.applyFont(font);
		font.setItalic(false);
		description.applyFont(font);

		panel2.addChild(header);
		panel2.addChild(version);
		panel2.addChild(description);
		panel2.setLayout('vertical');
		panel2.setWidth(370);
		panel2.setX(20);

		var copyright = new JOOLabel({
			lbl : "Copyright © " + appinfo.copyright + " <a href='" + appinfo.authorsUrl + "' target='_blank'>" + appinfo.authors + "</a>. All Rights Reserved"
		});
		var panel3 = new Panel();
		panel3.setWidth(600);
		panel3.setHeight(50);
		panel3.setY(20);
		panel3.addChild(copyright);

		sketch1.addChild(panel1);
		sketch1.addChild(panel2);
		sketch1.addChild(panel3);

		this.getContentPane().addChild(sketch1);
	},

	close : function() {
		if (this.modalSketch != undefined)
			this.modalSketch.access().hide();
		this.access().hide();
	}
});

/**
 * @class A slider icon, used in JOOSlider.
 * @augments Sketch
 * @implements DraggableInterface
 */
SliderIcon = Sketch.extend({

	setupBase : function(config) {
		this._super(config);
	},

	setupDomObject : function(config) {
		this._super(config);
		this.setWidth(18);
		this.setHeight(18);

		this.draggable({
			containment : 'parent'
		});

		this.addEventListener("mousedown", function(e) {
			this.enable = true;
			$(window).bind("mousemove", {
				_self : this
			}, this.mouseMoveHandler);
			this.addEventListener("mousemove", this.mouseMoveHandler);
		});
		this.addEventListener("mouseup", function(e) {
			this.mouseUpHandler(e);
		});

		$(window).bind("mouseup", {
			_self : this
		}, this.mouseUpHandler);
	},

	dispose : function(skipRemove) {
		$(window).unbind("mouseup", this.mouseUpHandler);
		$(window).unbind("mousedown", this.mouseDownHandler);
		this._super(skipRemove);
	},

	mouseUpHandler : function(e) {
		var _self = e.data ? e.data._self || this : this;
		_self.enable = false;
		$(window).unbind("mousemove", _self.mouseMoveHandler);
		_self.removeEventListener("mousemove", _self.mouseMoveHandler);
	},

	mouseMoveHandler : function(e) {
		var _self = e.data ? e.data._self || this : this;
		if (_self.enable) {
			_self.dispatchEvent('slideChanged', {
				value : _self.getX(),
				ispos : "pos"
			});
		}
	}
}).implement(DraggableInterface);

/**
 * @class A slider, which has a draggable icon and a slide pane.
 * @augments JOOInput
 */
JOOSlider = JOOInput.extend(
/** @lends JOOSlider# */
{
	setupBase : function(config) {
		this._super(config);
	},

	setupDomObject : function(config) {
		config.width = config.width || 200;
		config.height = 5;
		this._super(config);

		this.sliderIcon = new SliderIcon();
		this.value = config.value || 0;
		this.min = config.min || 0;
		this.max = config.max || 100;

		this.addChild(this.sliderIcon);

		this.addEventListener('stageUpdated', function() {
			this.slideTo(this.value);
		});

		var _self = this;
		this.sliderIcon.addEventListener("slideChanged", function(e) {
			_self.slideTo(e.value, e.ispos);
		});

		this.sliderIcon.addEventListener("mouseover", function(e) {
			showtip(new Number(_self.getValue()).toFixed(2));
		});

		this.sliderIcon.addEventListener("drag", function(e) {
			showtip(new Number(_self.getValue()).toFixed(2));
		});

		this.sliderIcon.addEventListener("dragstop", function(e) {
			hidetip();
		});

		this.sliderIcon.addEventListener("mouseout", function(e) {
			hidetip();
		});
	},

	/**
	 * SLide the icon to a specific value.
	 * @param {String|Number} value the value of the slider.
	 * @param {Boolean} ispos whether the <code>value</code> is position or absolute value.
	 */
	slideTo : function(value, ispos) {
		var posX = undefined;
		if (ispos) {
			// position, not value anymore
			posX = value;
			value = ((parseFloat(posX)) / (this.getWidth() - 18)) * (this.max - this.min) + this.min;
			if (value < this.min) {
				value = this.min;
				posX = 9;
			}
		} else {
			var oldPos = this.sliderIcon.getX();

			if (value < this.min) {
				value = this.min;
			}
			if (value > this.max) {
				value = this.max;
			}
			posX = (value - this.min) / (this.max - this.min) * (this.getWidth() - 18);

			if (oldPos == posX)
				return;
		}

		this.sliderIcon.setX(posX);

		var rate = (value - this.min) / (this.max - this.min);
		var lWidth = rate * (this.getWidth() - 18);
		var rWidth = (1 - rate) * (this.getWidth() - 18);
		this.access().find('.active').css("width", lWidth + "px");
		this.access().find('.inactive').css("width", rWidth + "px");
		this.access().find("input").val(value);

		this.dispatchEvent('change');
	},

	/**
	 * Change the value of the slider.
	 * @param {Number} value the new value
	 */
	setValue : function(value) {
		this.slideTo(value);
	},

	/**
	 * Get the value of the slider.
	 * @returns {Number} the value of the slider
	 */
	getValue : function() {
		return this.access().find("input").val();
	},

	toHtml : function() {
		return "<div><input type='hidden'><div class='joo-slider-bg active'></div><div class='joo-slider-bg inactive'></div></div>";
	}
});

/**
 * @class A simple color picker. Wrapper of jQuery ColorPicker.
 * @augments JOOInput
 */
JOOColorPicker = JOOInput.extend(
/** @lends JOOColorPicker# */
{
	setupBase : function(config) {
		this._super(config);
	},

	setupDomObject : function(config) {
		config.width = 18;
		config.height = 18;

		this._super(config);

		if (!config.background) {
			config.background = "#FFF";
		}

		this.shown = false;
		var _cpicker = this;
		var c = config.background.substring(1, config.background.length);
		this.access().ColorPicker({
			flat : true,
			onChange : function() {
				var hex = arguments[1];
				_cpicker.colorPickerIcon.setStyle("background-color", hex);
				_cpicker.dispatchEvent('change');
			},
			color : c
		});
		this.colorPickerIcon = new Sketch(config);
		var colorPanel = this.access().find(".colorpicker");
		this.colorPanelId = colorPanel.attr("id");
		colorPanel.css("left", "22px");
		colorPanel.css("top", "-2px");

		var _self = this;
		this.colorPickerIcon.addEventListener("mouseover", function() {
			showtip(_self.getValue());
		});

		this.colorPickerIcon.addEventListener("mouseout", function() {
			hidetip();
		});

		this.colorPickerIcon.addEventListener("click", function(e) {
			if (_cpicker.shown) {
				$("#" + _cpicker.colorPanelId).hide();
				_cpicker.shown = false;
			} else {
				$("#" + _cpicker.colorPanelId).show();
				_cpicker.shown = true;
			}
		});
		this.addChild(this.colorPickerIcon);
		this.colorPickerIcon.access().addClass('joo-colorpicker-icon');
		this.colorPickerIcon.setStyle("background", config.background);
	},

	/**
	 * Change the value of the picker.
	 * @param {String} value the new value
	 */
	setValue : function(value) {
		this.colorPickerIcon.setStyle("background-color", value);
	},

	/**
	 * Get the value of the picker.
	 * @returns {String} the picker's value
	 */
	getValue : function() {
		return this.colorPickerIcon.getStyle("background-color");
	},

	toHtml : function() {
		return "<div></div>";
	}
});
ListItem = UIComponent.extend({

	setupDomObject : function(config) {
		this._super(config);
		this.label = new JOOLabel({
			lbl : config.lbl
		});
		if (config.showLabel) {
			this.addChild(this.label);
		}
	},

	toHtml : function() {
		return "<li></li>";
	}
});
UnorderedList = UIComponent.extend({

	setupBase : function(config) {
		this._super(config);
		this.data = [];
		this.labelField = 'label';
		if (config.labelField && config.labelField != "") {
			this.labelField = config.labelField;
		}
	},
	emptyList : function() {
		while (this.children.length > 0) {
			this.removeChild(this.children[0]);
		}
		this.data = [];
	},
	clearView : function() {
		while (this.children.length > 0) {
			this.detachChild(this.children[0]);
		}
	},
	toHtml : function() {
		return '<ul></ul>';
	},
	addItem : function(ele) {
		if (this.data.indexOf(ele) == -1) {
			this.data.push(ele);
			var item = ele;
			if (!( ele instanceof ListItem)) {
				item = new ListItem({
					lbl : ( typeof ele == 'string') ? ele : ele[this.labelField]
				});
			}
			this.addChild(item);
			var _self = this;
			item.addEventListener('click', function() {
				_self.selectedItem = item;
				_self.dispatchEvent('select', ele);
			});
		}

	},
	removeItem : function(item) {
		var index = this.data.indexOf(item);
		if (index != -1) {
			if (item == this.selectedItem)
				this.selectedItem = null;
			this.removeChild(item);
			this.data.splice(index, 1);
		}
	},
	refresh : function() {
		this.clearView();
		for (var i = 0; i < this.data.length; i++) {
			this.addChild(this.data[i]);
		}
	},
	setChildIndex : function(child, index) {
		var currIndex = this.data.indexOf(child);
		if (currIndex != -1) {
			this.data.splice(currIndex, 1);
			this.data.splice(index, 0, child);
			this.refresh();
		}
	},

	getChildIndexByDomObject : function(domObject) {
		for (var i = 0, l = this.data.length; i < l; i++) {
			var child = this.data[i].access()[0];
			if (child == domObject) {
				return i;
			}
		}
		return undefined;
	},

	refreshByDisplay : function() {
		var arr = [];
		var data = this.data;
		var findListItem = function(id) {
			for (var i = 0, l = data.length; i < l; i++) {
				if (data[i].id == id) {
					return data[i];
				}
			}
			return undefined;
		}
		var lis = this.access().children('li');
		for (var i = 0, l = lis.length; i < l; i++) {
			var item = findListItem($(lis[i]).attr('id'));
			if (!item)
				continue;
			arr.push(item);
		};

		this.data = arr;
		this.refresh();
	}
});
OrderedList = UnorderedList.extend({
	toHtml : function() {
		return '<ol></ol>';
	}
});
JOORadioButtonGroup = UnorderedList.extend({
	setupDomObject : function(config) {
		this._super(config);
		this.name = config.name;
		this._value = null;
	},
	addItem : function(item) {
		var _item = item;
		if (!( item instanceof JOORadioButtonItem)) {
			_item = new JOORadioButtonItem({
				name : this.name,
				checked : false,
				lbl : item
			});
		}
		this._super(_item);
		var _self = this;
		_item.input.addEventListener('change', function(e) {
			_self.dispatchEvent('change', {
				item : _item,
				value : item.input ? (item.input.getValue ? item.input.getValue() : undefined) : undefined
			});
			e.stopPropagation();
		});
		return _item;
	},
	getItemByValue : function(value) {
		for (var i = 0, l = this.data.length; i < l; i++) {
			if (this.data[i].getValue() == value)
				return this.data[i];
		}
	},
	setChecked : function(item) {
		if (this.data.indexOf(item) == -1) {
			return;
		}
		item.input.setChecked(true);
		this.dispatchEvent('changeValue', {
			item : item,
			value : item.input ? (item.input.getValue ? item.input.getValue() : undefined) : undefined
		});
	},
	getChecked : function() {
		for (var i = 0; i < this.data.length; i++) {
			if (this.data[i].input.getChecked())
				return this.data[i];
		}
		return undefined;
	}
});
JOORadioButtonItem = ListItem.extend({
	setupDomObject : function(config) {
		config.showLabel = false;
		this._super(config);
		this.lbl = new JOOLabel({
			lbl : config.lbl
		});
		this.input = new JOORadioButton({
			name : config.name,
			value : config.value,
			checked : config.checked
		});

		this.addChild(this.input);
		this.addChild(this.lbl);
	},

	setValue : function(value) {
		this.input.config.value = value;
		return this;
	},

	getValue : function() {
		return this.input.config.value;
	}
});
JOORadioButton = JOOInput.extend({
	toHtml : function() {
		return '<input />';
	},
	setupDomObject : function(config) {
		this._super(config);
		this.setAttribute('type', 'radio');
		this.setChecked(config.checked);
	},
	setChecked : function(value) {
		this.access().prop('checked', value);
	},
	getChecked : function() {
		return this.access().prop('checked');
	}
}); 