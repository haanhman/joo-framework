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
JOO.define('org.joo.ui.controls.JOOInputSelect', {
	
	extend: org.joo.ui.JOOInput,
	
	setupDomObject: function(config) {
		this._super(config);
		
		this.options = Array();
		var options = config.options || {};
		for(var i=0; i<options.length; i++) {
			this.addOption(options[i]);
		}
		this.selectedIndex = config.selectedIndex || 0;
		if(config.selectedIndex == undefined && config.selectedValue != undefined){
			this.selectedIndex = 0;
			for(var i=0;i<this.options.length;i++){
				if(this.options[i].value == config.selectedValue){
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
	addOption: function(param){
		this.options.push(param);
		if (param.order != undefined){
			for(var i=this.options.length-2;i>=param.order;i--){
				this.options[i] = this.options[i+1];
			}
		}
		this.access().append("<option value='"+param.value+"'>"+param.label+"</option>");
	},
	
	/**
	 * Change the value of the select box
	 * @param {String} val new value of the select box.
	 */
	setValue: function(val) {
		this.access().val(val);
		this.selectedIndex = this.access().find("option:selected").index()-1;
		this.dispatchEvent("change");
	},

	/**
	 * Change the value of the select box to an option by its index.
	 * @param {Number} idx the index of the option.
	 */
	setValueByIndex: function(idx) {
		this.selectedIndex = idx;
		this.access().find("option").eq(idx).attr("selected", "selected");
		this.dispatchEvent("change");
	},

	/**
	 * Get the value of the select box.
	 * @returns {String} the select box's value.
	 */
	getValue: function() {
		return this.access().val();
	},
	
	/**
	 * Refresh the select box.
	 */
	refresh: function(){
		this.access().html(this.toHtml());
		this.selectedIndex = this.access().find("option:selected").index()-1;
	},
	
	toHtml: function(){
		return "<select></select>";
	}
});