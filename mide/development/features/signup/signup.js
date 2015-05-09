app.config(function($stateProvider){
    $stateProvider.state('signup',{
        url:"/signup",
        templateUrl: "features/signup/signup.html",
        controller: 'SignUpCtrl'
    });
});

app.controller('SignUpCtrl',function($scope, SignUpFactory){
    $scope.data = {};

    $scope.signup = function(){
        SignUpFactory.postSignup($scope.data).then(function(response){
            console.log(JSON.stringify(response));
        }).catch(function(err){
            console.error(JSON.stringify(err));
        });
    };

});

app.factory('SignUpFactory',function($http, ApiEndpoint){
    return{
        postSignup: function(userdata){
            console.log(JSON.stringify(userdata));
            return $http.post(ApiEndpoint.url+"/user/signup", userdata)
            //TODO: Send correct url, send status 200 for now
        }
    }
});

//TODO: Form Validation

//NEXT: Sending data to the back-end and setting up routes
//Mongoose
