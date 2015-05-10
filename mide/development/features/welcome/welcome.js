app.config(function($stateProvider){
	$stateProvider.state('welcome', {
		url : '/welcome',
		templateUrl : 'features/welcome/welcome.html',
		controller : 'WelcomeCtrl'
	});
});

app.controller('WelcomeCtrl', function($scope, $state, AuthService){
	//$scope.login = function(){
	//	$state.go('login');
	//};
	//$scope.signup = function(){
	//	$state.go('signup');
	//};
	AuthService.getLoggedInUser().then(function (user) {
		// If a user is retrieved, then renavigate to the destination
		// (the second time, AuthService.isAuthenticated() will work)
		// otherwise, if no user is logged in, go to "login" state.
        console.log(user);
		if (user) {
			$state.go('/tab/challenge');
		} else {
			$state.go('signup');
		}
	});
});