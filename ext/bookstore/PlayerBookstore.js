_JOOService = JOOService.extend({
     runJSONP: function(params){
        var _self = this;
        var url = this.endpoint + "?callback=?";
        if(params){
            for(var j in params){
               url += "&"+ j + "=" + params[j] + ""; 
            }
        }
   
        $.getJSON(url, function(ret) {
                  
        })
        .success(function(ret) {
            ret = _self.parse(ret);
            _self.dispatchEvent('success', ret);
            JOOUtils.generateEvent('ServiceSuccess', this.name, ret);
        })
        .error(function(msg) { msg = _self.parseError(msg);
            _self.dispatchEvent('failure', msg);
            JOOUtils.generateEvent('ServiceFailure', this.name, msg); 
        })
        .complete(function(ret) { _self.dispatchEvent('complete', ret); });
    }
});

BookStoreService = _JOOService.extend({
                                   
	init: function(config) {
		this._super();
		this.name = "BookStoreService";
		this.method = "post";
        this.network = config.network;
        if(this.network == "online") this.endpoint = AppConfigs.BOOKSTORE_ON + "/store.php";
        else this.endpoint = AppConfigs.BOOKSTORE_OFF +"/data.json";
	},
	
	parse: function(ret) {
        if(this.network == "online") return ret.result.data;
		return ret;
	}
});

PlayerBookstore = Sketch.extend({
	setupDomObject : function(config) {
		this._super(config);
		this.theFirst = true;
		this.isWaiting = false;
		this.listBookDeny = {};
		this.setupView();
		this.setupEvent();
		this.defaultVal();
	},
	defaultVal : function() {
		//window.localStorage.clear();
		this.keyStorage = "Terra-Book-Store-Ver";
		this.localpath = window.localStorage.getItem(this.keyStorage + 'path');
		this.dataOffline = window.localStorage.getItem(this.keyStorage);
		this.get__DataStore();
		// get data on joolist
		if(this.dataOffline == null) {
			this.setupDataDefault();
			return;
		}
		this.setupDataStore('!needRefresh');
		// get old data
	},
	setupView : function() {
		this.contentStore = new Sketch({
			extclasses : 'content-store'
		});
		this.closeStore = new JOOImage({
			src : 'bookstore/back.png',
			extclasses : 'close-store'
		});
		this.addChild(this.contentStore);
		var _self = this;
		this.closeStore.addEventListener('touchstart', function() {
			_self.hide();
			this.access().hide();
		});
		this.addChild(this.closeStore);
	},
	setupEvent : function() {
		var _self = this;
		this.addEventListener('classifybook_done', function() {
			_self.buildReadingBook(_self.readingBook);
			_self.buildBookAllStore(_self.otherBook);
		});
	},
	setupTrigger : function() {
		var _self = this;
		this.event = 'touchmove';
		this.mouseMoveFn = function(e) {
			e.stopPropagation();
			e.preventDefault();
			if(_self.storeIscroll && _self.isWaiting == false) {
				if(_self.storeIscroll.pointY < 100) {
					_self.isWaiting = true;
					var refr = function() {
						var stateConnect = navigator.network.connection.type;
						if(stateConnect == Connection.UNKNOWN || stateConnect == Connection.NONE) {
							console.log('do not connect...');
							return;
						} else {
							document.removeEventListener("touchend", refr);
							_self.onRefresh();
							_self.offTrackingMove();
						}
					}
					document.addEventListener("touchend", refr);
				} else
					document.removeEventListener("touchend", refr);
			}
		}
		this.trackingMove();
	},
	trackingMove : function() {
		this.isWaiting = false;
		document.addEventListener(this.event, this.mouseMoveFn);
	},
	offTrackingMove : function() {
		document.removeEventListener(this.event, this.mouseMoveFn);
	},
	downloadfile : function(fileName, remotepath, dispatchEvent) {
		/*var _self = this;
		 if(this.as == undefined)
		 this.as =  setInterval(function(){
		 _self.numLoad ++;
		 _self.processDownload();
		 },1000);
		 return; */
		remotepath = remotepath || 'http://joolist.com/demo/bookstore/';
		var _self = this;
		window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function onFileSystemSuccess(fileSystem) {
			fileSystem.root.getFile("store.html", {
				create : true,
				exclusive : false
			}, function gotFileEntry(fileEntry) {
				_self.localpath = fileEntry.fullPath.replace("store.html", AppConfigs.BOOKSTORE_OFF);
				window.localStorage.setItem(_self.keyStorage + 'path', _self.localpath);
				fileEntry.remove();
				var fileTransfer = new FileTransfer();
				fileTransfer.download((remotepath + fileName), (_self.localpath + fileName), function(theFile) {
					_self.numLoad++;
					_self.processDownload();
					if(dispatchEvent)
						_self.dispatchEvent("download-complete");
				}, function(error) {

				});
			}, fail);
		}, fail);
		function fail() {
		};
	},
	processDownload : function() {

		var ref = Math.round((this.numLoad * this.stepProcess));
		if(ref > 100) {
			this.process_label.setText('100%');
			return;
		}
		if(this.process_label) {
			this.process_label.setText('');
			this.process_label.setText('' + ref + '%');
		}
	},
	get__DataStore : function() {
		var _self = this;
		var dispatchEvent = undefined;
		this.numLoad = 0;
		try {
			var stateConnect = navigator.network.connection.type;
			if(stateConnect == Connection.UNKNOWN || stateConnect == Connection.NONE) {
				return;
			} else {
				var bookstoreService = new BookStoreService({
					"network" : "online"
				});
				bookstoreService.addEventListener("success", function(ret) {
					var strify = JSON.stringify(ret);
					if(strify != _self.dataOffline) {
						//update localstogare
						window.localStorage.setItem(_self.keyStorage, strify);
						_self.dataOffline = strify;
						// download
						_self.stepProcess = (100 / ret.length);
						for(var i = 0, len = ret.length; i < len; i += 1) {
							var exts = (ret[i].bookexts == undefined) ? '.png' : ret[i].bookexts;
							if(i == len - 1)
								dispatchEvent = true;
							_self.downloadfile((ret[i].bookid + exts), undefined, dispatchEvent);
						}
						return;
					}
					this.trackingMove();
				});
				bookstoreService.runJSONP();
			}
		} catch(e) {
			console.log(e);
		}
		/*
		 var bookstoreService = new BookStoreService({"network": "online"});
		 bookstoreService.addEventListener("success", function(ret){
		 var strify =  JSON.stringify(ret);
		 if(strify != _self.dataOffline){
		 //update localstogare
		 window.localStorage.setItem(_self.keyStorage, strify);
		 _self.dataOffline = strify;
		 }
		 });
		 bookstoreService.runJSONP(); */

		this.addEventListener("download-complete", function() {
			_self.trackingMove();
			_self.setupDataStore('needRefresh');
		});
	},
	/**
	 * Event will call when load data on book server complete.
	 * @param {ret} value of data
	 */
	setupDataStore : function(refresh) {

		if(refresh == 'needRefresh')
			this.contentStore.removeAllChildren();
		var ret = JSON.parse(this.dataOffline);
		this.classifyBook(ret);
		this.hideProcess();
	},
	setupDataDefault : function() {
		var _self = this;
		this.localpath = AppConfigs.BOOKSTORE_OFF;
		var bookstoreService = new BookStoreService({
			"network" : "offline"
		});
		bookstoreService.addEventListener("success", function(ret) {
			_self.classifyBook(ret);
		});
		bookstoreService.run();
		bookstoreService = undefined;
	},
	/**
	 * Function will call when render book and shelf.
	 * @param {book} is object sketch has background-image is book.
	 */
	classifyBook : function(data) {
		this.otherBook = data;
		for(var j = 0, len = this.otherBook.length; j < len; j += 1) {
			if(this.otherBook[j] == undefined)
				return;
			if(this.otherBook[j].bookid == AppConfigs.APPID) {
				//alert(this.otherBook[j].bookid);
				this.readingBook = this.otherBook[j];
				this.otherBook.splice(j, 1);
				break;
			}
		}
		// reject
		if(this.listBookDeny == undefined)
			return;
		for(var k = 0, len = this.otherBook.length; k < len; k += 1) {
			if(this.otherBook[k] == undefined)
				return;
			if(this.listBookDeny[this.otherBook[k].bookid] == true) {
				this.otherBook.splice(k, 1);
			}
		}
		this.dispatchEvent('classifybook_done');
		return true;
	},
	buildReadingBook : function(data) {
		var shelf = new Sketch({
			extclasses : 'shelf-top'
		});
		var book = new JOOImage({
			extclasses : 'book book-top'
		});
		var bookcover = new Sketch({
			extclasses : 'book-cover-top'
		});
		if(data) {
			var exts = (data.bookexts == undefined) ? '.png' : data.bookexts;
			this.setPropToBook({
				'self' : book,
				'img' : data.bookid + exts
			}, {
				'self' : bookcover,
				'mark' : 'reading'
			});
			this.addEventClickBook({
				'book' : book,
				'bookcover' : bookcover,
				'bookstatus' : 'reading'
			});
		}
		shelf.addChild(book);
		shelf.addChild(bookcover);
		var fairyStore = new Sketch({
			extclasses : 'fairy-store fairy-effect'
		});
		this.contentStore.addChild(fairyStore);
		this.contentStore.addChild(shelf);
	},
	/**
	 * add shelf and book on stage.
	 * @param
	 */
	buildBookAllStore : function(data) {
		var bps = 3;
		var __numberShelf = Math.ceil(data.length / bps);
		var numBook = -1;
		for(var i = 1; i <= __numberShelf; i++) {
			var shelf = new Sketch({
				extclasses : 'shelf-all'
			});
			marginleft = 92;
			for(var k = 1; k <= bps; k++) {
				numBook++;
				if(data[numBook]) {
					var book = new JOOImage({
						extclasses : 'book book-normal'
					});
					book.access().css({
						'margin-left' : marginleft + 'px'
					});
					var bookcover = new Sketch({
						extclasses : 'book-cover-normal'
					});
					bookcover.access().css({
						'margin-left' : marginleft + 'px'
					});
					var exts = (data[numBook].bookexts == undefined) ? '.png' : data[numBook].bookexts;
					var status = (data[numBook].bookstatus == 'comingsoon') ? 'comingsoon' : 'getit';
					this.setPropToBook({
						'self' : book,
						'img' : data[numBook].bookid + exts
					}, {
						'self' : bookcover,
						'mark' : status
					});
					this.addEventClickBook({
						'book' : book,
						'bookcover' : bookcover,
						'bookscheme' : data[numBook].appscheme,
						'bookstatus' : data[numBook].bookstatus
					});
					shelf.addChild(book);
					shelf.addChild(bookcover);
					marginleft = marginleft + 300;
				}
			}
			this.contentStore.addChild(shelf);
		}
		var notify = new JOOImage({
			src : "bookstore/drop-update.png",
			extclasses : 'notify-drag'
		});
		this.contentStore.addChild(notify);
		this.contentStore.setHeight((__numberShelf * 450));
		if(this.storeIscroll == undefined) {
			var _self = this;
			setTimeout(function() {
				_self.storeIscroll = new iScroll(_self.getId(), {
					hScrollbar : false,
					vScrollbar : false
				});
				_self.setupTrigger();
				document.addEventListener('touchmove', function(e) {
					e.preventDefault();
				}, false);
			}, 300);
		} else
			this.storeIscroll.refresh();
	},
	/**
	 * Function will call when render book and shelf.
	 * @param {book} is object sketch has background-image is book.
	 */
	setPropToBook : function(book, bookcover) {
		// set background and bookmark
		book.self.access().attr("alt", "đang tải...");
		book.self.access().attr("src", this.localpath + book.img);
		bookcover.self.access().addClass("book-" + bookcover.mark);
	},
	/**
	 * Function will call when book is rendered.
	 * @param {book} is element book, {bookStatus, bookname, pubdate,des ...} get on server book
	 */
	addEventClickBook : function(params) {
		var _self = this;
		var bkDom = params.book.access();
		var bkcDom = params.bookcover.access();
		params.bookcover.addEventListener('touchstart', function() {
			bkDom.removeClass("book-none-effect").addClass("book-effect");
			bkcDom.removeClass("book-none-effect").addClass("book-effect");
			//return;
			setTimeout(function() {
				switch(params.bookstatus) {
					case 'reading':
						_self.hide();
						break;
					case 'comingsoon':

						break;
					default:
						JOOUtils.generateEvent('OpenApp', {
							'schemeLink' : params.bookscheme,
							'storeLink' : params.bookstatus,
							'require' : 'restart'
						});
						break;
						JOOUtils.generateEvent('BookClick');
				}
				bkDom.removeClass("book-effect").addClass("book-none-effect");
				bkcDom.removeClass("book-effect").addClass("book-none-effect");
			}, 1200);
		});
	},
	onRefresh : function() {
		this.showProcess();
		window.localStorage.clear();
		this.localpath = window.localStorage.getItem(this.keyStorage + 'path');
		this.dataOffline = window.localStorage.getItem(this.keyStorage);
		this.storeIscroll.scrollTo(630, 0, 100);
		var _self = this;
		setTimeout(function() {
			_self.get__DataStore();
			// get data on joolist
		}, 500);
	},
	showProcess : function() {
		if(this.process_sketch == undefined) {
			this.process_sketch = new Sketch({
				extclasses : 'process-sketch center'
			});
			var process_image = new JOOImage({
				src : "bookstore/processing-img.png",
				extclasses : 'process-image'
			});
			this.process_label = new JOOLabel({
				lbl : '0%',
				extclasses : 'process-label'
			});
			this.process_sketch.addChild(process_image);
			this.process_sketch.addChild(this.process_label);
			this.addChild(this.process_sketch);
		}
	},
	hideProcess : function() {
		if(this.process_sketch)
			this.process_sketch.selfRemove();
		this.process_sketch = undefined;
	},
	/**
	 * Function will call when click into current book or click on button "close".
	 * @param:
	 */
	hide : function() {
		var _self = this;
		JOOUtils.generateEvent('LoadCurrentPage', {});
		setTimeout(function() {
			if(_self.theFirst) {
				_self.access().removeClass('show-book-animation').addClass('hide-first-book-animation');
				_self.theFirst = false;
			} else {
				_self.access().removeClass('show-book-animation').addClass('hide-book-animation');
			}
			setTimeout(function() {
				_self.access().css({
					"z-index" : "-1"
				});
				_self.access().hide();
			}, 1800);
		}, 700);
	},
	/**
	 * Function will call when click into bookstore on setting.
	 * @param:
	 */
	show : function() {
		this.access().show();
		this.access().removeClass('hide-first-book-animation').removeClass('hide-book-animation').addClass('show-book-animation');
		var _self = this;
		setTimeout(function() {
			_self.access().css({
				"z-index" : "24"
			});
		}, 200);
	}
});
