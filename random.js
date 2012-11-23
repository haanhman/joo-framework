RandomUtils = {
	shuffle: function(arr) {
		for(var i=0, l=arr.length; i<l; i++) {
			var rand = Math.round(Math.random() * (l - 1));
			//swap
			var tmp = arr[i];
			arr[i] = arr[rand];
			arr[rand] = tmp;
		}
	}
}
