JOOKeyBindings = Class.extend({
	
	start: function() {
		this.keyMappings = [];
		this.currentKeys = [];
		$(document).bind('keydown', {_self: this}, this._keydown);
		$(document).bind('keyup', {_self: this}, this._keyup);
	},
	
	bindKeyCommand: function(key, command) {
		this.keyMappings.push({
			command: command,
			parsedKey: this._parseKey(key),
			key: key
		});
	},
	
	_parseKey: function(key) {
		var keys = key.split('+');
		var isCtrl = false, isShift = false, isAlt = false;
		var normalKeys = [];
		for(var i=0, l=keys.length; i<l; i++) {
			if (keys[i].toLowerCase() == 'ctrl') {
				isCtrl = true;
			} else if (keys[i].toLowerCase() == 'shift') {
				isShift = true;
			} else if (keys[i].toLowerCase() == 'alt') {
				isAlt = true;
			} else {
				normalKeys.push(this._toKeyCode(keys[i]));
			}
		}
		return {
			isCtrl: isCtrl,
			isShift: isShift,
			isAlt: isAlt,
			normalKeys: normalKeys
		};
	},
	
	_keydown: function(e) {
		var _self = e.data ? e.data._self || this : this;
		if (_self.currentKeys.indexOf(e.keyCode) == -1) {
			_self.currentKeys.push(e.keyCode);
		}
		for(var i=0, l=_self.keyMappings.length; i<l; i++) {
			if (_self._checkKey(_self.keyMappings[i].parsedKey, e)) {
				_self.keyMappings[i].command.execute(e);
				_self.currentKeys = [];
				return;
			}
		}
	},
	
	_keyup: function(e) {
		var _self = e.data ? e.data._self || this : this;
		var index = _self.currentKeys.indexOf(e.keyCode);
		if (index != -1) {
			_self.currentKeys.splice(index, 1);
		}
	},
	
	_toKeyCode: function(key) {
		var r = key.match(/{(.*)}/);
		if (r && r.length >= 2)
			return parseInt(r[1]);
		return key.toUpperCase().charCodeAt(0);
	},
	
	_imply: function(a, b) {
		return a ? b : true;
	},
	
	_checkKey: function(key, e) {
		var pass = this._imply(key.isCtrl, e.ctrlKey) && this._imply(key.isShift, e.shiftKey) && this._imply(key.isAlt, e.altKey);
		if (!pass)
			return false;
		for(var i=0, l=key.normalKeys.length; i<l; i++) {
			if (this.currentKeys.indexOf(key.normalKeys[i]) == -1) {
				return false;
			}
		}
		return true;
	},
	
	stop: function() {
		$(document).removeEventListener('keyup', this._keyup);
		$(document).removeEventListener('keydown', this._keydown);
	}
});