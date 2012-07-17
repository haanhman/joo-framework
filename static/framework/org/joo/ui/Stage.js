/**
 * @class The Stage is a special UI component, which hosts, manages selection 
 * and renders other UI components
 * <p>It supports additional configuration parameters:</p>
 * <ul>
 * 	<li><code>allowMultiSelect</code> whether multi-selection is allowed</li>
 * </ul>
 * @augments UIComponent
 */
JOO.define('org.joo.ui.Stage', 
/** @lends Stage# */
{
	extend: org.joo.ui.UIComponent,
	
	setupBase: function(config)	{
		this.stage = this;
		this.id = config.id;
		this.allowMultiSelect = config.allowMultiSelect || true;
		this.selectedObjects = Array();
		this._super(config);
	},
	
	/**
	 * Get a list of current selected objects.
	 * @returns {Array} current selected objects
	 */
	getSelectedObjects: function() {
		return this.selectedObjects;
	},
	
	/**
	 * Delete all selected objects.
	 */
	deleteSelectedObjects: function() {
		for(var i=0;i<this.selectedObjects.length;i++) {
			this.selectedObjects[i].stageDeselect();
			this.selectedObjects[i].selfRemove();
		}
		this.selectedObjects = Array();
		this.dispatchEvent('selectedChange');
	},

	/**
	 * Deselect specific selected object.
	 * <p>Usually developers should use the {@link SelectableInterface} 
	 * rather than calling this method directly
	 * </p>
	 * @param {SelectableInterface} obj the object to be deselected.
	 * It <b>should</b> be a selected object.
	 */
	removeSelectedObject: function(obj) {
		if (typeof obj['stageDeselect'] == 'undefined')
			throw 'Object '+obj+' is not deselectable';
		var index = this.selectedObjects.indexOf(obj);
		if (index != -1) {
			obj.selected = false;
			obj.stageDeselect();
			this.selectedObjects.splice(index, 1);
			this.dispatchEvent('selectedChange');
/*			
			var subject = SingletonFactory.getInstance(Subject);
			subject.notifyEvent('ObjectDeselected', obj);*/
		}
	},
	
	/**
	 * Deselect all objects, which is previously selected under this Stage.
	 */
	deselectAllObjects: function() {
		for(var i=0;i<this.selectedObjects.length;i++) {
			this.selectedObjects[i].stageDeselect();
		}
		this.selectedObjects = Array();
		this.dispatchEvent('selectedChange');
		
/*		var subject = SingletonFactory.getInstance(Subject);
		subject.notifyEvent('AllObjectDeselected');*/
	},

	/**
	 * Add a component to the list of selected objects.
	 * It will call the <code>stageSelect</code> method
	 * of the component automatically.
	 * <p>
	 * If either <code>isMultiSelect</code> or <code>allowMultiSelect</code>
	 * is <code>false</code>, previously selected objects will be deselected.
	 * </p>
	 * @param {SelectableInterface} obj the object to selected
	 * @param {Boolean} isMultiSelect whether this selection is a multi-selection
	 */
	addSelectedObject: function(obj, isMultiSelect) {
		if (typeof obj['stageSelect'] == 'undefined')
			throw 'Object '+obj+' is not selectable';
		if (this.selectedObjects.indexOf(obj) != -1)
			return;
		
		if (isMultiSelect == undefined) isMultiSelect = false;
		if (!this.allowMultiSelect || !isMultiSelect) {
			this.deselectAllObjects();
		}
		obj.selected = true;
		obj.stageSelect();
		this.selectedObjects.push(obj);
		this.dispatchEvent('selectedChange');
		
		var subject = SingletonFactory.getInstance(Subject);
		subject.notifyEvent('ObjectSelected', obj);
	},
	
	setupDomObject: function(config) {
		this.domObject = JOOUtils.access(this.id);
		this.access().addClass('joo-'+this.className.toLowerCase());
		this.access().addClass('joo-uicomponent');

		if (config.layout == undefined)
			config.layout = 'block';
		this.setLayout(config.layout);
		this.setupContextMenu();
	}
});