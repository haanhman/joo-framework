ClassMapping = {};
for(var i in window) {
	if (typeof window[i] == 'function' && window[i].prototype && window[i].prototype.currentClass) {
		window[i].prototype.className = i;
		ClassMapping[i.toLowerCase()] = i;
	}
}