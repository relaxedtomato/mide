app.config(function($stateProvider){
	$stateProvider.state('signup', {
		url : '/signup',
		templateUrl : 'features/signup/signup.html',
		controller : 'SignupCtrl'
	});
});

app.controller('SignupCtrl', function($scope){
	
});

