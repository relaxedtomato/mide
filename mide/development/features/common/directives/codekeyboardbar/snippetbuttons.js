app.directive('snippetbuttons', function(){
	return {
		restrict : 'E',
		replace:true,
		templateUrl:"features/common/directives/codekeyboardbar/snippetbuttons.html",
		link : function(scope, element, attribute){
			scope.showOptions = false;
			scope.btnClick = function(data){
				scope.showOptions = true;
				scope.items = data;
			};
			scope.itemClick = function(insertParam){
				scope.insertFunc(insertParam);
			};
			scope.resetMenu = function(){
				scope.showOptions = false;
			};
			scope.demo1 = function() {
				var text = "var HelloWorld = function() {};\nHelloWorld.prototype.hello = function(name){name=name||'world';\nreturn 'Hello, ' + name + '!';};";
				scope.insertFunc(text);
			};
			scope.demo2 = function() {
				var text = "function haha() {return \"hehe\"};\n\nhaha();";
				scope.insertFunc(text);
			};

		}
	};
});