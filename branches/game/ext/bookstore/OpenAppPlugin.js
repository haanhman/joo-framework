OpenAppPlugin = Class.extend({
    
    onOpenApp: function(params){
        var require = params.require || '';
        document.location = params.schemeLink + '://' + require;
        var time = (new Date()).getTime();
        setTimeout(function(){
            var now = (new Date()).getTime();
            if((now-time)<400) {
                document.location = params.storeLink;
             }
        }, 300);
    },
    
    onCloseApp: function(){

    }
}).implement(PluginInterface);