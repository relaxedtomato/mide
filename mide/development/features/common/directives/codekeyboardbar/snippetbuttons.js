app.directive('snippetbuttons', function(CodeSnippetFactory, CodeMirrorFactory, $ionicPopup){
	return {
		restrict : 'E',
		replace:true,
		templateUrl:"features/common/directives/codekeyboardbar/snippetbuttons.html",
		link : function(scope, element, attribute){
			console.log("snip button element", element);
			
			scope.replText = 'adsfadsf';

			scope.$watch('replText', function(text){
				// updateScript(element, text);
				console.log("hey there,", scope.replText);
			});
			// scope.insertFunc = function(param){
			// 	//given a param, will insert characters where cursor is
			// 	console.log("inserting: ", param);

			// 	scope.code.text = "insertfunc ya'll";
			// 	console.log("scope.codeMirror: ", scope);

			// 	console.log("CMFact", CodeMirrorFactory.cm);
			// 	// scope.codeMirror.replaceSelection("testing");

			// 	// window.cordova.plugins.Keyboard.show();
			// 	// scope.myCodeMirror.focus();
			// };
			var i = 0;
			scope.btnClick = function(btn){
				console.log("data", btn.data);
			};
		}
	};
});