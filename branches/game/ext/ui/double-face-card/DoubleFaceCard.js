DoubleFaceCard = Sketch.extend({
	
	setupDomObject: function(config) {
		this._super(config);
		this.image = config.src;
		this.imageBack = config['src-back'];
		this.audio = config.audio;
		this.audioBack = config.audioBack;
		this.flipWhenMove = config.flipWhenMove;
		this.mode = false;
		this.doNotFlip = false;
		
		this.addEventListener('stageUpdated', function() {
			if (config.draggable)
				this.access().draggable();
			if (config.snap) {
				this.addEventListener('touchmove.check', function(e) {
					e.stopPropagation();
					var offset = this.access().dragOffset;
					var result = config.snapFn.call(config.snapSubject, config.snapParams, offset);
					if (result) {
						this.setStyle('-webkit-transform', 'translate3d('+result.x+'px, '+result.y+'px, 0)');
						if (config.noDragWhenSnap)
							this.access().stopDraggable();
						if (config.snapOnce)
							this.removeEventListener('touchmove.check');
						this.dispatchEvent('snapped');
					}
				})
			}
			if (!this.config['no-auto-flip']) {
				this.addEventListener('touchend', function() {
					if (!this.doNotFlip)
						this.flip();
				});
			}
			if (!this.flipWhenMove) {
				this.addEventListener('touchmove', function() {
					this.doNotFlip = true;
				});
				this.addEventListener('touchcancel touchend', function() {
					this.doNotFlip = false;
				});
			}
		});
		
		this.item = new Sketch({
			extclasses: "face-card-item"
		});
		var img = new JOOImage({
			src: this.image
		});
		this.imgBack = new Sketch({
			extclasses: "face-card-image-outer"
		});
		var imgBack = undefined;
		if (!config['text-back']) {
			imgBack = new JOOImage({
				src: this.imageBack,
				extclasses: "face-card-image-back"
			});
		} else {
			imgBack = new Sketch({
				extclasses: "face-card-image-back"
			});
			var lbl = new Sketch();
			lbl.access().html(config['text-back']);
			imgBack.addChild(lbl);
			if (config['text-back-class'])
				imgBack.access().addClass(config['text-back-class']);
		}
		this.imgBack.addChild(imgBack);
		this.item.addChild(img);
		this.item.addChild(this.imgBack);
		this.addChild(this.item);
	},
	
	setDoNotFlip: function(doNotFlip) {
		this.doNotFlip = doNotFlip;
	},
	
	getMode: function() {
		return this.mode;
	},
	
	flip: function() {
		var img1 = this.image;
		var img = this.imageBack;
		var audio1 = this.audio;
		var audio = this.audioBack;
		
		if (this._interacting) return;
		this._interacting = true;
		this.mode = !this.mode;
		var bg = "text-back";
		
		var audioSrc = audio1;
		var image = img;
		var deg = 180;
		var show = true;
		if (!this.mode) {
			bg = "text";
			image = img1;
			audioSrc = audio;
			deg = 0;
			show = false;
		}
		
		if (audioSrc) {
			var audioPlayer = new Audio();
			audioPlayer.src = audioSrc;
			audioPlayer.play();
		}

		var _self = this;
		var item = this.item;
		item.setStyle('-webkit-transform', 'rotateY('+deg+'deg) translate3d(0, 0, 0)');

		if (show) {
			var imgBack = this.imgBack;
			imgBack.getStyle('top');
			imgBack.setStyle('-webkit-transform', 'rotateY('+deg+'deg) translateZ(6px)');
		}
		
		var timeout2 = setTimeout(function() {
			_self.dispatchEvent('flipped');
			_self._interacting = false;
		}, 500);
	}
});
