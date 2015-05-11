app.config(function($stateProvider){
	$stateProvider.state('welcome', {
		url : '/welcome',
		templateUrl : 'features/welcome/welcome.html',
		controller : 'WelcomeCtrl'
	});
});

app.controller('WelcomeCtrl', function($scope, $state, AuthTokenFactory){
	//TODO: Splash page while you load resources (possible idea)
	$scope.login = function(){
		$state.go('login');
	};
	$scope.signup = function(){
		$state.go('signup');
	};

	var token = AuthTokenFactory.getToken()
	if (token) {
		console.log(token)
		$state.go('tab.challenge-submit');
	} else {
		$state.go('login');
	}
	//});
});