app.filter('truncate', function(){
	return function(input, length){
		if(input.length > length) return input.substr(0, length) + '...';
		else return input;
	};
});