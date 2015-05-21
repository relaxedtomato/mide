app.config(function($stateProvider){
	$stateProvider.state('snippets', {
		url : '/snippets',
		// templateUrl : '/snippets/snippets.html',
		controller : 'SnippetsCtrl'
	});
});

app.controller('SnippetsCtrl', function($scope){
	
});