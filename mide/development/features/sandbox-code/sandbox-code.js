app.config(function($stateProvider){
	$stateProvider.state('sandbox.code', {
		url : '/sandbox/code',
		views: {
			'tab-code' : {
				templateUrl : 'features/sandbox-code/sandbox-code.html',
				controller : 'SandboxCodeCtrl'
			}
		}
	});
});


app.controller('SandboxCodeCtrl', function($scope, $state, SandboxFactory, ExercismFactory, KeyboardFactory){
	$scope.code = {
		text : ''
	};

	$scope.buttons = {
		compile : 'Compile',
		save : 'Save'
	};

	$scope.compile = function(code){
		SandboxFactory.setSubmission(code);
		$state.go('sandbox.compile');
	};

	$scope.save = function(code){

	};

	$scope.insertFunc = KeyboardFactory.makeInsertFunc($scope);

	// //Challenge Submit
	// $scope.text = "placeholder";

	// //initialize CodeMirror
	// var myCodeMirror = CodeMirror.fromTextArea(document.getElementById('code'), {
	// 	lineNumbers : true,
	// 	mode: 'javascript',
	// 	autofocus : true,
	// 	theme : 'twilight',
	// 	lineWrapping: true
	// });

	// myCodeMirror.replaceSelection($scope.text);

	// $scope.updateText = function(){
	// 	$scope.text = myCodeMirror.getValue();
	// 	//check if digest is in progress
	// 	if(!$scope.$$phase) {
	// 	  $scope.$apply();
	// 	}
	// };

	// $scope.insertFunc = function(param){
	// 	//given a param, will insert characters where cursor is
	// 	console.log("inserting: ", param);
	// 	myCodeMirror.replaceSelection(param);
	// 	// window.cordova.plugins.Keyboard.show();
	// 	myCodeMirror.focus();
	// };

 //    myCodeMirror.on("change", function (myCodeMirror, changeObj){
 //    	$scope.updateText();
 //    });

 //    window.addEventListener("native.keyboardshow", function (){
 //    	$scope.keyboardVis = true;
 //    	$scope.$apply();
 //    });
 //    window.addEventListener("native.keyboardhide", function (){
 //    	$scope.keyboardVis = false;
 //    	$scope.$apply();
 //    });

	// $scope.keys = [];

	// $scope.showPopup = function(item) {
	// 	console.log('keys',item);
	// 	$scope.data = {};
	// 	$scope.keys = item.data;

	//   // An elaborate, custom popup
	// var myPopup = $ionicPopup.show({
	// templateUrl: 'features/challenge-code/challenge-syntax.html',
	// title: item.display,
	// scope: $scope,
	// buttons: [
	// 	  { text: '<b>Done</b>' }
	// 	]
	// });
	// };



	// $scope.saveChallenge = function(){
	// 	console.log("save scope.text", $scope.text);
	// 	$localstorage.set("testing", $scope.text);
	// };

	// $scope.getSaved = function(){
	// 	console.log("save scope.text", $scope.text);
	// 	console.log("entered getsaved func");
	// 	$scope.text = $localstorage.get("testing");
	// };

});