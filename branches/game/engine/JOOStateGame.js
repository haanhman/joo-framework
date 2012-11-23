JOOStateGame = JOOGame.extend({
	
	setupDomObject: function(config) {
		this._super(config);
		this.addEventListener('stageUpdated', function(e) {
			this.initGame(config);
		});
	},
	
	initGame: function(config) {
		this.states = {};
		for(var i=0, l=config.states.length; i<l; i++) {
			this.states[config.states[i].id] = config.states[i];
			if (typeof this.states[config.states[i].id].object['setGame'] != 'undefined') {
				this.states[config.states[i].id].object.setGame(this);
			}
		}
		this.stateFlow = config.stateFlow;
		this.stateHistory = [];
		this.currentStateIndex = -1;
		
		this.setState(config.initialState);
		
		var _self = this;
		for(var i in this.states) {
			(function(i) {
				var state = _self.states[i];
				state.object.addEventListener('stateChanged', function(e) {
					if (state != _self.currentState)
						return;
					var name = e.name;
					var eventData = e.eventData;
					var flow = _self.stateFlow[i] || {};
					var nextState = flow[name];
					if (nextState) {
						_self.setState(nextState, false, eventData);
					} else {
						nextState = _self.stateFlow['*'] ? _self.stateFlow['*'][name] : undefined;
						_self.setState(nextState, false, eventData);
					}
				});
				
				state.object.addEventListener('stateBack', function(e) {
					if (state != _self.currentState)
						return;
					if (_self.currentStateIndex > 0) {
						_self.currentStateIndex--;
						var nextState = _self.stateHistory[_self.currentStateIndex].id;
						var eventData = _self.stateHistory[_self.currentStateIndex].eventData;
						_self.setState(nextState, true, eventData);
					}
				});
				
				state.object.addEventListener('stateForward', function(e) {
					if (state != _self.currentState)
						return;
					if (_self.currentStateIndex < _self.stateHistory.length - 1) {
						_self.currentStateIndex++;
						var nextState = _self.stateHistory[_self.currentStateIndex].id;
						var eventData = _self.stateHistory[_self.currentStateIndex].eventData;
						_self.setState(nextState, true, eventData);
					}
				});
			})(i);
		}
	},
	
	setState: function(nextState, noHistory, eventData) {
		if (nextState == 'do_nothing') return;
		nextState = this.states[nextState];
		if (this.currentState) {
			this.detachChild(this.currentState.object);
			this.currentState.object.stopAllActions();
			this.currentState.object.onPause();
		}
		
		this.currentState = nextState;
		if (!nextState) return;
		this.addChild(this.currentState.object);
		if (this.currentState.loaded) {
			this.currentState.object.onWakeup(eventData);
		} else {
			this.currentState.object.onBegin(eventData);
			this.currentState.loaded = true;
		}
		
		if (!noHistory) {
			this.stateHistory.splice(this.currentStateIndex+1, this.stateHistory.length-(this.currentStateIndex+1));
			this.stateHistory.push({
				id: nextState.id,
				eventData: eventData
			});
			this.currentStateIndex = this.stateHistory.length - 1;
			if (this.config.maxHistories > 0 && this.stateHistory.length > this.config.maxHistories) {
				this.stateHistory.splice(0, this.stateHistory.length - this.config.maxHistories);
			}
		}
	},
	
	doFrame: function() {
		if (this.currentState) {
			this.currentState.object.doFrame();
		}
	},
	
	paintFrame: function() {
		if (this.currentState) {
			this.currentState.object.paintFrame();
		}
	},
	
	dispose: function(skipRemove) {
		for(var i=0; i<this.states.length; i++) {
			this.states[i].object.dispose();
		}
		this._super(skipRemove);
	}
});