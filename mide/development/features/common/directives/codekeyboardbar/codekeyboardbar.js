app.directive('codekeyboard', function(CodeSnippetFactory, $compile){
	return {
		restrict : 'A',
		link : function(scope, element, attribute){
			var visible = false;

			element.addClass("bar-stable");
			element.addClass('ng-hide');

			function toggleClass(){
				if(visible){
					element.removeClass('ng-hide');
					element.addClass('ng-show');
				} else {
					element.removeClass('ng-show');
					element.addClass('ng-hide');
				}
			}
			scope.btns = CodeSnippetFactory.getFooterMenu();

			scope.$on('footerUpdated', function(event, data){
				scope.btns = data;
			});

			window.addEventListener("native.keyboardshow", function (){
		    	visible = true;
		    	toggleClass();

		    });
		    window.addEventListener("native.keyboardhide", function (){
		    	visible = false;
		    	toggleClass();
		    });
		}
	};
});