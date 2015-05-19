app.directive('snippetbuttons', function(CodeSnippetFactory){
	return {
		restrict : 'E',
		replace:true,
		templateUrl:"features/common/directives/codekeyboardbar/snippetbuttons.html",
		link : function(scope, element, attribute){
			console.log("snip button element", element);
			scope.insertFunc = function(param){
				//given a param, will insert characters where cursor is
				console.log("inserting: ", param);
				// console.log("scope.codeMirror: ", cm);
				scope.codeMirror.replaceSelection("testing");
				// window.cordova.plugins.Keyboard.show();
				// scope.myCodeMirror.focus();
			};
		}
	};
});