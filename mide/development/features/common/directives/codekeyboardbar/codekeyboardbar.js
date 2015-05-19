app.directive('codekeyboard', function(CodeSnippetFactory){
	return {
		restrict : 'A',
		link : function(scope, element, attribute){
			// console.log("element", element)
			element.addClass("bar-stable");
			element.addClass("keyboard-attach");
			scope.keys = CodeSnippetFactory.getFooterMenu();
		}
	};
});