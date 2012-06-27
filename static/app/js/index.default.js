function main(templateFile) {
	var hashIndex = window.location.href.indexOf('#');
	if (hashIndex == -1) {
		ApplicationRoot = window.location.href;
	} else {
		ApplicationRoot = window.location.href.substr(0, hashIndex);
	}
	var htmlIndex = ApplicationRoot.indexOf('.html');
	if (htmlIndex != -1) {
		ApplicationRoot = ApplicationRoot.substr(0, htmlIndex);
		var slashIndex = ApplicationRoot.lastIndexOf("/");
		if (slashIndex != -1)
			ApplicationRoot = ApplicationRoot.substr(0, slashIndex);
	}
	
	var bootstrap = new Bootstrap();
	var app = SingletonFactory.getInstance(Application);
	app.getSystemProperties().set("host.root", ApplicationRoot);
	app.getSystemProperties().set("page.default", "Home");
	app.setBootstrap(bootstrap);
	Request.setProactive(true);
	
	$(window).bind("hashchange", function(){
	    if (Request.getProactive != true) {
	        var subject = SingletonFactory.getInstance(Subject);
	        subject.notifyEvent('NeedAssembleRequest');
	    }
	    Request.setProactive(false);
	});
	
	$(document).ready(function()	{
		$.get(ApplicationRoot+templateFile, {}, function(ret)	{
			var useragent = navigator.userAgent;
			if (useragent.indexOf('MSIE') != -1)	{
				$('#Application-Main').html(ret);
			} else {
				document.getElementById('Application-Main').innerHTML = ret;
			}
			app.begin();
		});
	});
}

if (typeof window['updateTracker'] != 'undefined')
	updateTracker(1);