app.directive('codekeyboard', function($compile){
	return {
		restrict : 'A',
		scope: {
			ngModel : '=' //links any ngmodel on the element
		},
		link : function(scope, element, attribute){
			// attribute.$set("class", "bar-stable");
			attribute.$set("keyboard-attach");
		}
	};
});