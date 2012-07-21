/**
 * An interface for all ajax-based portlets or plugins
 * Provide the following methods:
 *  - onAjax(controller, action, params, type, callback)
 */
AjaxInterface = InterfaceImplementor.extend({
	
	implement: function(obj)	{
		obj.prototype.onAjax = obj.prototype.onAjax || function(url, params, type, callbacks, options)	{
			options = options || {};
			if (type == undefined)
				type = 'GET';
			var success = callbacks.onSuccess;
			var fail = callbacks.onFailure;
			var error = callbacks.onError;
			var accessDenied = callbacks.onAccessDenied;
			
			var memcacheKey = 'ajax.'+url;
			for(var k in params)	{
				var v = params[k];
				memcacheKey += '.'+k+'.'+v;
			}

			//var root = SingletonFactory.getInstance(Application).getSystemProperties().get('host.root');
			//var url = root+'/'+controller+'/'+action;
			//try to get from mem cached
			if (type == 'GET' && options.cache == true)	 {
				var memcache = SingletonFactory.getInstance(Memcached);
				var value = memcache.retrieve(memcacheKey);
				if (value != undefined)	{
					var now = new Date();
					var cacheTimestamp = value.timestamp;
					if ((now.getTime() - cacheTimestamp) < options.cacheTime)	{
						var subject = SingletonFactory.getInstance(Subject);
						subject.notifyEvent('AjaxQueryFetched', {result: value.ret, url: url});
						AjaxHandler.handleResponse(value.ret, success, fail, url);
						return;
					} else {
						memcache.clear(memcacheKey);
					}
				}
			}
			
			var args = arguments;
			var _self = this;
			
			var subject = SingletonFactory.getInstance(Subject);
			subject.notifyEvent('AjaxBegan', {
				key: memcacheKey,
				args: args,
				target: _self
			});
			var _options = {
				dataType: 'json',
				url: url,
				type: type,
				data: params,
				success: function(ret)	{
					subject.notifyEvent('AjaxFinished', {
						key: memcacheKey,
						args: args,
						target: _self,
						error: false
					});
					if (ret != null)	{
						if (type == 'GET' && cache == true)	{
							//cache the result
							var memcache = SingletonFactory.getInstance(Memcached);
							var now = new Date();
							memcache.store(memcacheKey, {'ret': ret, 'timestamp': now.getTime()});
						}
						subject.notifyEvent('AjaxQueryFetched', {result: ret, url: url});
						AjaxHandler.handleResponse(ret, success, fail, url);
					}
				},
				error: function(ret, statusText, errorCode)	{
					if (error)
						error(ret, statusText, errorCode);
					subject.notifyEvent('AjaxError', {ret: ret, 
						statusText: statusText, 
						errorCode: errorCode,
						key: memcacheKey,
						target: _self,
						args: args
					});
					subject.notifyEvent('AjaxFinished', {
						key: memcacheKey,
						args: args,
						target: _self,
						error: true
					});
				},
				statusCode: {
					403: function()	{
						//console.log('access denied at '+url);
						if (accessDenied != undefined)
							accessDenied.call(undefined);
					}
				}
			};
			for(var i in options) {
				_options[i] = options[i];
			}
			$.ajax(_options);
		};
	}
});

AjaxHandler = {
		
	handleResponse: function(ret, success, fail, url)	{
		var result = ret.result;
		if (result.status)	{
			if (success != undefined)	{
				try {
					success.call(undefined, result.data);
				} catch (err)	{
					log(err+" - "+url);
				}
			}
		} else if (result == 'internal-error') {
			var subject = SingletonFactory.getInstance(Subject);
			subject.notifyEvent('NotifyError', ret.message);
		} else {
			if (fail != undefined)	{
				try {
					fail.call(undefined, ret.message, ret.detail);
				} catch (err)	{
					log(err);
				}
			}
		}
	}
};