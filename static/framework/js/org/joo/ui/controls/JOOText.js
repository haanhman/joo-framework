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
JOO.define('org.joo.ui.controls.JOOText', 
/** @lends JOOText# */
{	
	extend: org.joo.ui.UIComponent,
	
	setupDomObject: function(config) {
		this._super(config);
		this.text = new Sketch();
		if (config.lbl)
			this.text.access().html(config.lbl);

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
		
		this.text.addEventListener("stageUpdated", function(){
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

	/**
	 * Get the value of the text
	 * @returns {String} the text value
	 */
	getValue: function() {
		return this.config.lbl;
	},

	/**
	 * Enable/Disable editing
	 * @param {Boolean} b Whether the editing is enable
	 */
	enableEdit: function(b) {
		if (b)
			this.text.access().focus();
		this.text.access()[0].contentEditable = b;
	}
});