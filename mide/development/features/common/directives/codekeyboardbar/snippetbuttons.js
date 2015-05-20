app.directive('snippetbuttons', function(CodeSnippetFactory){
	return {
		restrict : 'E',
		replace:true,
		templateUrl:"features/common/directives/codekeyboardbar/snippetbuttons.html",
		link : function(scope, element, attribute){
			console.log("snippetbuttons linked up");
			scope.btnClick = function(btn){
				scope.insertFunc("testing");
			};
		}
	};
});