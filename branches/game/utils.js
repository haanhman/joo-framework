ScreenUtils = {
	getScreenWidth: function() {
		if (this.screenWidth) return this.screenWidth;
		return (this.screenWidth = $(window).width());
	},
	
	getScreenHeight: function() {
		if (this.screenHeight) return this.screenHeight;
		return (this.screenHeight = $(window).height());
	}
}
