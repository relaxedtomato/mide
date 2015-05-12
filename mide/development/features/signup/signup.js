app.config(function($stateProvider){
    $stateProvider.state('signup',{
        url:"/signup",
        templateUrl: "features/signup/signup.html",
        controller: 'SignUpCtrl'
    });
});

app.controller('SignUpCtrl',function($rootScope, $http, $scope, $state, AuthService){
    $scope.data = {};
    $scope.error = null;
    $scope.login = function(){
        $state.go('login');
    };
    $scope.signup = function(){
        AuthService
            .signup($scope.data)
            .then(function(authenticated){
                //console.log('signup, tab.challenge');
                $rootScope.$broadcast('Auth');
                $scope.states.push({ //TODO: Need to add a parent controller to communicate
                    name: 'Logout',
                    ref: function(){
                        AuthService.logout();
                        $scope.data = {};
                        $scope.states.pop(); //TODO: Find a better way to remove the Logout link, instead of pop
                        $state.go('signup');
                    }
                });
                $state.go('challenge.view');
            })
            .catch(function(err){
                $scope.error = 'Signup Invalid';
                console.error(JSON.stringify(err))
                var alertPopup = $ionicPopup.alert({
                    title: 'Signup failed!',
                    template: 'Please check your credentials!'
                });
            });
        //SignUpFactory //TODO: convert to use Auth Service instead
        //    .postSignup($scope.data)
        //    .then(AuthService.signedUp)
        //    .then(function(response){
        //        console.log('goto tab-challenge-submit',JSON.stringify(response));
        //        //$http.get(ApiEndpoint.url+"/");
        //        //INFO: Session is stored as a cookie on the browser
        //    })
        //    //store data in session
        //    //$state.go('tab.challenge-submit'); //TODO: Add Route back, removed for testing
        //    .catch(function(err){
        //    $scope.error = 'Login Invalid';
        //    console.error(JSON.stringify(err));
        //});
    };

});

//app.factory('SignUpFactory',function($http, ApiEndpoint){
//    return{
//        postSignup: function(userdata){
//            console.log('postSignup',JSON.stringify(userdata));
//            return $http.post(ApiEndpoint.url+"/user/signup", userdata);
//        }
//    };
//});

//TODO: Form Validation

//NEXT: Sending data to the back-end and setting up routes
//Mongoose

//TODO: Cleanup commented code