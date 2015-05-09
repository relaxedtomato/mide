app.config(function($stateProvider){
<<<<<<< HEAD
  $stateProvider.state('login',{
      url:"/login",
      templateUrl: "features/login/login.html"
  });
=======
	$stateProvider.state('login', {
		url : '/login',
		templateUrl : 'features/login/login.html',
		controller : 'LoginCtrl'
	});
});

app.controller('LoginCtrl', function($scope){
	$scope.account = function(){

	};
>>>>>>> 5734002e9ed6efa06c541324738f41aa214fe0d1
});