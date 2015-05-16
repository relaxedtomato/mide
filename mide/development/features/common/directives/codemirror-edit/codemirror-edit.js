app.directive('cmedit', function(){
	return {
		restrict : 'A',
		scope: {
			ngModel : '='
		},
		link : function(scope, element, attribute){
			var updateText = function(){
				scope.ngModel = myCodeMirror.getValue();
				console.log(myCodeMirror.getValue());
				scope.$apply();
			};
			//initialize CodeMirror
			var myCodeMirror = CodeMirror.fromTextArea(document.getElementById(attribute.id), {
				lineNumbers : true,
				mode: 'javascript',
				autofocus : true,
				theme : 'twilight',
				lineWrapping: true
			});
			myCodeMirror.setValue(scope.ngModel);

			myCodeMirror.on("change", function (myCodeMirror, changeObj){
		    	updateText();
		    });
		}
	};
});