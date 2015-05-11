app.config(function($stateProvider){
    $stateProvider.state('signup',{
        url:"/signup",
        templateUrl: "features/signup/signup.html",
        controller: 'SignUpCtrl'
    });
});

app.controller('SignUpCtrl',function($http, $scope, $state, SignUpFactory, AuthService){
    $scope.data = {};
    $scope.error = null;

    $scope.signup = function(){
        SignUpFactory //TODO: convert to use Auth Service instead
            .postSignup($scope.data)
            .then(AuthService.signedUp)
            .then(function(response){
                console.log('goto tab-challenge-submit',JSON.stringify(response));
                //$http.get(ApiEndpoint.url+"/");
                //INFO: Session is stored as a cookie on the browser
            })
            //store data in session
            //$state.go('tab.challenge-submit'); //TODO: Add Route back, removed for testing
            .catch(function(err){
            $scope.error = 'Login Invalid';
            console.error(JSON.stringify(err));
        });
    };

});

app.factory('SignUpFactory',function($http, ApiEndpoint){
    return{
        postSignup: function(userdata){
            console.log('postSignup',JSON.stringify(userdata));
            return $http.post(ApiEndpoint.url+"/user/signup", userdata);
        }
    };
});

//TODO: Form Validation

//NEXT: Sending data to the back-end and setting up routes
//Mongoose
