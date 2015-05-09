app.config(function($stateProvider){
	$stateProvider.state('welcome', {
		url : '/welcome',
		templateUrl : 'features/welcome/welcome.html',
		controller : 'WelcomeCtrl'
	});
});

app.controller('WelcomeCtrl', function($scope, $state){
	$scope.login = function(){
		$state.go('login');
	};
	$scope.signup = function(){
		$state.go('signup');
	};
});