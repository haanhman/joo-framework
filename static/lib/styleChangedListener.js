(function() {
    $.fn.silentCss = $.fn.css;
    $.fn.css = function() {
        var result = $.fn.silentCss.apply(this, arguments);
        if (arguments.length >= 2) {
        	$(this).trigger('stylechange', arguments[0], arguments[1]);
        }
        return result;
    };
})();