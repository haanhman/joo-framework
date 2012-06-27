JOO.define('org.joo.web.DefaultErrorHandler', {
	
	extend: org.joo.web.ErrorHandler,
	
	handle: function(err, event) {
		if (typeof err == 'object') {
			if (err.Exception == 'RequestInterrupted') {
				return;
			}
			if (err.Exception != undefined)	{
				alert("["+err.Exception+"Exception] "+err.Message);
			} else {
				alert(err);
			}
			return;
		}
		alert("Error caught: "+err);
	}
});