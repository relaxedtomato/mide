app.directive('codekeyboard', function(CodeSnippetFactory){
	return {
		restrict : 'A',
		link : function(scope, element, attribute){
			element.addClass("bar-stable");
			scope.btns = CodeSnippetFactory.getFooterMenu();
		}
	};
});