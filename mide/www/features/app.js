// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
var app = angular.module('mide', ['ionic', 'ui.ace'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    // $locationProvider.html5Mode(true);
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleLightContent();
    }
  });
})

//TODO:This is needed to set to access the proxy url that will then in the ionic.project file redirect it to the correct URL
.constant('ApiEndpoint', {
  url : '/api',
  session: '/session'
})

.config(function($stateProvider, $urlRouterProvider) {
  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  // if none of the above states are matched, use this as the fallback
  //$urlRouterProvider.otherwise('/tab/chats');
  //$urlRouterProvider.otherwise('/signup'); // TODO: Richard testing this route
  //$urlRouterProvider.otherwise('/tab/challenge'); //TODO: Tony testing this route
    $urlRouterProvider.otherwise('welcome');
})
//

////run blocks: http://stackoverflow.com/questions/20663076/angularjs-app-run-documentation
//Use run method to register work which should be performed when the injector is done loading all modules.
//http://devdactic.com/user-auth-angularjs-ionic/

.run(function ($rootScope, $state, AuthService, AUTH_EVENTS) {

    var destinationStateRequiresAuth = function (state) {
        //console.log('cl - destinationStateRequiresAuth','state.data',state.data,'state.data.auth',state.data.authenticate);
        return state.data && state.data.authenticate;
    };

    //TODO: Need to make authentication more robust below does not follow FSG (et. al.)
    //TODO: Currently it is not checking the backend route router.get('/token')
    $rootScope.$on('$stateChangeStart', function (event,toState, toParams) {

        //console.log('user Authenticated', AuthService.isAuthenticated());

        if (!destinationStateRequiresAuth(toState)) {
            // The destination state does not require authentication
            // Short circuit with return.
            return;
        }

        if (AuthService.isAuthenticated()) {
            // The user is authenticated.
            // Short circuit with return.
            return;
        }

        //TODO: Not sure how to proceed here
        $state.go('login'); //if above fails, goto login
    });
});
app.config(function($stateProvider){
	// Each tab has its own nav history stack:
	$stateProvider.state('tab.account', {
		url: '/account',
	    views: {
	    	'tab-account': {
	    		templateUrl: 'features/account/account.html',
				controller: 'AccountCtrl'
			}
	    }
	});
});

app.controller('AccountCtrl', function($scope) {
	$scope.settings = {
		enableFriends: true
	};
});
app.config(function($stateProvider){
	$stateProvider.state('tab.challenge', {
		url: '/challenge',
		views: {
			'tab-challenge' : {
				templateUrl: 'features/challenge/challenge.html',
				controller: 'ChallengeCtrl'
			}
		},
		resolve : {
			challenge : function(ChallengeFactory, $state){
				return ChallengeFactory.getChallenge().catch(function(err){
					$state.go('tab.account');
				});
			}
		}
	});
});

app.controller('ChallengeCtrl', function($scope, ChallengeFactory, challenge, $state){
	$scope.buttons = {
		submit : 'Submit',
		test : 'Test',
		dismiss : 'Dismiss'
	};

	$scope.challenge = challenge;
	$scope.challengeDesc = JSON.parse(challenge[0].body).description;
	$scope.challengeBody = JSON.parse(challenge[0].body).session.setup;


	$scope.submitChallenge = function(){
		$state.go('tab.challenge-submit');
		ChallengeFactory.submitChallenge().then(function(response){

			return response.data;
		}).catch(function(err){
			console.error(JSON.stringify(err));
		});
	};

	$scope.testChallenge = function(){
		ChallengeFactory.testChallenge().then(function(response){
			return response.data;
		}).catch(function(err){
			console.error(JSON.stringify(err));
		});
	};

});

app.factory('ChallengeFactory', function($http, ApiEndpoint){
	return {
		getChallenge : function(){
			return $http.get(ApiEndpoint.url + '/challenge').then(function(response){
				return response.data;
			});
		},
		submitChallenge : function(){
			return $http.post(ApiEndpoint.url + '/challenge/submit').then(function(response){
				return response.data;
			});
		},
		testChallenge : function(){
			return $http.post(ApiEndpoint.url + '/challenge/test/').then(function(response){
				return response.data;
			});
		}
	};
});

app.config(function($stateProvider, USER_ROLES){
	$stateProvider.state('tab.challenge-submit', {
		url : '/challenge/submit',
		views: {
			'tab-challenge' : {
				templateUrl : 'features/challenge-submit/challenge-submit.html',
				controller : 'ChallengeSubmitCtrl'
			}
		},
		data: {
			authenticate: [USER_ROLES.public]
		}
	});
});

app.controller('ChallengeSubmitCtrl', function($scope){

	$scope.aceLoaded = function(_editor){
		console.log(_editor);
	};

	$scope.aceChanged = function(e){
		console.log(e);
	};

	$scope.txt = '';

	$scope.aceConfig = {
		useWrapMode : true,
		showGutter : true,
		theme: 'monokai',
		mode: 'javascript',
		onLoad: $scope.aceLoaded,
		onChange : $scope.aceChanged
	};
	//text needs to be worked on

	console.log('this is loaded');
});

app.config(function($stateProvider){

  $stateProvider.state('tab.chats', {
      url: '/chats',
      views: {
        'tab-chats': {
          templateUrl: 'features/chats/tab-chats.html',
          controller: 'ChatsCtrl'
        }
      }
    })
    .state('tab.chat-detail', {
      url: '/chats/:chatId',
      views: {
        'tab-chats': {
          templateUrl: 'features/chats/chat-detail.html',
          controller: 'ChatDetailCtrl'
        }
      }
    });
});

app.controller('ChatsCtrl', function($scope, Chats) {
  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
});

app.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
});

app.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s not me',
    face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
  },{
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'https://pbs.twimg.com/profile_images/491995398135767040/ie2Z_V6e.jpeg'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'https://pbs.twimg.com/profile_images/578237281384841216/R3ae1n61.png'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
});

app.config(function($stateProvider){
	$stateProvider.state('login', {
		url : '/login',
		templateUrl : 'features/login/login.html',
		controller : 'LoginCtrl'
	});
});

app.controller('LoginCtrl', function($scope, $ionicPopup, $state, AuthService){
	//$scope.account = function(){
    //
	//};
	$scope.data = {};
	$scope.error = null;

	$scope.login = function(){
		AuthService
			.login($scope.data)
			.then(function(authenticated){ //TODO:authenticated is what is returned
				console.log('authenticated, tab.challenge-submit');
				$state.go('tab.challenge-submit');
				//TODO: We can set the user name here as well. Used in conjunction with a main ctrl
			})
			.catch(function(err){
				$scope.error = 'Login Invalid';
				console.error(JSON.stringify(err))
				var alertPopup = $ionicPopup.alert({
					title: 'Login failed!',
					template: 'Please check your credentials!'
				});
			});
		//LoginFactory
		//	.postLogin($scope.data)
		//	.then(function(response){
		//		AuthTokenFactory.setToken(response.data.token);
		//		//console.log('goto tab-challenge-submit',response.data.token, response.data.user);
		//		$state.go('tab.challenge-submit');
		//		return response; //TODO: remove if not required, you can just change states instead
		//	})
		//	.catch(function(err){
		//		$scope.error = 'Login Invalid';
		//		console.error(JSON.stringify(err));
		//	});
	};
});

//app.factory('LoginFactory',function($http,ApiEndpoint){
//	return{
//		postLogin: function(userdata){
//			console.log('postLogin',JSON.stringify(userdata));
//			return $http.post(ApiEndpoint.url+"/user/login", userdata);
//		}
//	};
//});

//app.controller('LoginCtrl', function ($scope, AuthService, $state) {
//
//	$scope.login = {};
//	$scope.error = null;
//
//	$scope.sendLogin = function (loginInfo) {
//
//		$scope.error = null;
//
//		AuthService.login(loginInfo).then(function () {
//			$state.go('home');
//		}).catch(function () {
//			$scope.error = 'Invalid login credentials.';
//		});
//
//	};
//
//});


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
//token is sent on every http request
app.factory('AuthInterceptor',function AuthInterceptor(AUTH_EVENTS,$rootScope,$q,AuthTokenFactory){

    var statusDict = {
        401: AUTH_EVENTS.notAuthenticated,
        403: AUTH_EVENTS.notAuthorized
    };

    return {
        request: addToken,
        responseError: function (response) {
            $rootScope.$broadcast(statusDict[response.status], response);
            return $q.reject(response);
        }
    };

    function addToken(config){
        var token = AuthTokenFactory.getToken();
        if(token){
            config.headers = config.headers || {};
            config.headers.Authorization = 'Bearer ' + token;
        }
        return config;
    }
}); //skipped Auth Interceptors given TODO: You could apply the approach in
//http://devdactic.com/user-auth-angularjs-ionic/

app.config(function($httpProvider){
    $httpProvider.interceptors.push('AuthInterceptor');
});

app.constant('AUTH_EVENTS', {
        notAuthenticated: 'auth-not-authenticated',
        notAuthorized: 'auth-not-authorized'
});

app.constant('USER_ROLES', {
        //admin: 'admin_role',
        public: 'public_role'
});

app.factory('AuthTokenFactory',function($window){
    var store = $window.localStorage;
    var key = 'auth-token';

    return {
        getToken: getToken,
        setToken: setToken
    };

    function getToken(){
        return store.getItem(key);
    }

    function setToken(token){
        if(token){
            store.setItem(key,token);
        } else {
            store.removeItem(key);
        }
    }
});

app.service('AuthService',function($q,$http,USER_ROLES,AuthTokenFactory,ApiEndpoint,$rootScope){
    //var LOCAL_TOKEN_KEY = 'auth-token';
    var username = '';
    var isAuthenticated = false;
    var authToken;


    function loadUserCredentials() {
        //var token = window.localStorage.getItem(LOCAL_TOKEN_KEY);
        var token = AuthTokenFactory.getToken();
        if (token) {
            useCredentials(token);
        }
    }

    function storeUserCredentials(token) {
        AuthTokenFactory.setToken(token);
        useCredentials(token);
    }

    function useCredentials(token) {
        console.log('useCredentials token',token);
        username = token.user;
        isAuthenticated = true;
        authToken = token.token;

        // Set the token as header for your requests!
        //$http.defaults.headers.common['X-Auth-Token'] = token; //TODO
    }

    function destroyUserCredentials() {
        authToken = undefined;
        username = '';
        isAuthenticated = false;
        //$http.defaults.headers.common['X-Auth-Token'] = undefined;
        //window.localStorage.removeItem(LOCAL_TOKEN_KEY);
        AuthTokenFactory.setToken(); //empty clears the token
    }

    var logout = function(){
        destroyUserCredentials();
    };

    //var login = function()
    var login = function(userdata){
        console.log('postLogin',JSON.stringify(userdata));
        return $q(function(resolve,reject){
            $http.post(ApiEndpoint.url+"/user/login", userdata)
                .then(function(response){
                    AuthTokenFactory.setToken(response.data.token); //storeUserCredentials
                    isAuthenticated = true;
                    resolve(response); //TODO: sent to authenticated
                });
        });
    };

    loadUserCredentials();

    var isAuthorized = function(authenticated) {
        if (!angular.isArray(authenticated)) {
            authenticated = [authenticated];
        }
        return (isAuthenticated && authenticated.indexOf(USER_ROLES.public) !== -1);
    };

    return {
        login: login,
        logout: logout,
        isAuthenticated: function() {
            console.log('AuthService.isAuthenticated()');
            return isAuthenticated;
        },
        username: function(){return username;},
        //getLoggedInUser: getLoggedInUser,
        isAuthorized: isAuthorized
    }

});

//TODO: Did not complete main ctrl 'AppCtrl for handling events'
// as per http://devdactic.com/user-auth-angularjs-ionic/
app.config(function($stateProvider){

  	// setup an abstract state for the tabs directive
    $stateProvider.state('tab', {
	    url: "/tab",
	    abstract: true,
	    templateUrl: "features/common/tabs/tabs.html"
	});
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImFjY291bnQvYWNjb3VudC5qcyIsImNoYWxsZW5nZS9jaGFsbGVuZ2UuanMiLCJjaGFsbGVuZ2UtY29tcGlsZS9jaGFsbGVuZ2UtY29tcGlsZS5qcyIsImNoYWxsZW5nZS1zdWJtaXQvY2hhbGxlbmdlLXN1Ym1pdC5qcyIsImNoYWxsZW5nZS12aWV3L2NoYWxsZW5nZS12aWV3LmpzIiwiY2hhdHMvY2hhdHMuanMiLCJsb2dpbi9sb2dpbi5qcyIsInNpZ251cC9zaWdudXAuanMiLCJ3ZWxjb21lL3dlbGNvbWUuanMiLCJjb21tb24vQXV0aGVudGljYXRpb24vYXV0aGVudGljYXRpb24uanMiLCJjb21tb24vdGFicy90YWJzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JFQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3RDQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMvSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIElvbmljIFN0YXJ0ZXIgQXBwXG5cbi8vIGFuZ3VsYXIubW9kdWxlIGlzIGEgZ2xvYmFsIHBsYWNlIGZvciBjcmVhdGluZywgcmVnaXN0ZXJpbmcgYW5kIHJldHJpZXZpbmcgQW5ndWxhciBtb2R1bGVzXG4vLyAnc3RhcnRlcicgaXMgdGhlIG5hbWUgb2YgdGhpcyBhbmd1bGFyIG1vZHVsZSBleGFtcGxlIChhbHNvIHNldCBpbiBhIDxib2R5PiBhdHRyaWJ1dGUgaW4gaW5kZXguaHRtbClcbi8vIHRoZSAybmQgcGFyYW1ldGVyIGlzIGFuIGFycmF5IG9mICdyZXF1aXJlcydcbi8vICdzdGFydGVyLnNlcnZpY2VzJyBpcyBmb3VuZCBpbiBzZXJ2aWNlcy5qc1xuLy8gJ3N0YXJ0ZXIuY29udHJvbGxlcnMnIGlzIGZvdW5kIGluIGNvbnRyb2xsZXJzLmpzXG52YXIgYXBwID0gYW5ndWxhci5tb2R1bGUoJ21pZGUnLCBbJ2lvbmljJywgJ3VpLmFjZSddKVxuXG4ucnVuKGZ1bmN0aW9uKCRpb25pY1BsYXRmb3JtKSB7XG4gICRpb25pY1BsYXRmb3JtLnJlYWR5KGZ1bmN0aW9uKCkge1xuICAgIC8vIEhpZGUgdGhlIGFjY2Vzc29yeSBiYXIgYnkgZGVmYXVsdCAocmVtb3ZlIHRoaXMgdG8gc2hvdyB0aGUgYWNjZXNzb3J5IGJhciBhYm92ZSB0aGUga2V5Ym9hcmRcbiAgICAvLyBmb3IgZm9ybSBpbnB1dHMpXG4gICAgLy8gJGxvY2F0aW9uUHJvdmlkZXIuaHRtbDVNb2RlKHRydWUpO1xuICAgIGlmICh3aW5kb3cuY29yZG92YSAmJiB3aW5kb3cuY29yZG92YS5wbHVnaW5zICYmIHdpbmRvdy5jb3Jkb3ZhLnBsdWdpbnMuS2V5Ym9hcmQpIHtcbiAgICAgIGNvcmRvdmEucGx1Z2lucy5LZXlib2FyZC5oaWRlS2V5Ym9hcmRBY2Nlc3NvcnlCYXIodHJ1ZSk7XG4gICAgfVxuICAgIGlmICh3aW5kb3cuU3RhdHVzQmFyKSB7XG4gICAgICAvLyBvcmcuYXBhY2hlLmNvcmRvdmEuc3RhdHVzYmFyIHJlcXVpcmVkXG4gICAgICBTdGF0dXNCYXIuc3R5bGVMaWdodENvbnRlbnQoKTtcbiAgICB9XG4gIH0pO1xufSlcblxuLy9UT0RPOlRoaXMgaXMgbmVlZGVkIHRvIHNldCB0byBhY2Nlc3MgdGhlIHByb3h5IHVybCB0aGF0IHdpbGwgdGhlbiBpbiB0aGUgaW9uaWMucHJvamVjdCBmaWxlIHJlZGlyZWN0IGl0IHRvIHRoZSBjb3JyZWN0IFVSTFxuLmNvbnN0YW50KCdBcGlFbmRwb2ludCcsIHtcbiAgdXJsIDogJy9hcGknLFxuICBzZXNzaW9uOiAnL3Nlc3Npb24nXG59KVxuXG4uY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyLCAkdXJsUm91dGVyUHJvdmlkZXIpIHtcbiAgLy8gSW9uaWMgdXNlcyBBbmd1bGFyVUkgUm91dGVyIHdoaWNoIHVzZXMgdGhlIGNvbmNlcHQgb2Ygc3RhdGVzXG4gIC8vIExlYXJuIG1vcmUgaGVyZTogaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXItdWkvdWktcm91dGVyXG4gIC8vIFNldCB1cCB0aGUgdmFyaW91cyBzdGF0ZXMgd2hpY2ggdGhlIGFwcCBjYW4gYmUgaW4uXG4gIC8vIEVhY2ggc3RhdGUncyBjb250cm9sbGVyIGNhbiBiZSBmb3VuZCBpbiBjb250cm9sbGVycy5qc1xuICAvLyBpZiBub25lIG9mIHRoZSBhYm92ZSBzdGF0ZXMgYXJlIG1hdGNoZWQsIHVzZSB0aGlzIGFzIHRoZSBmYWxsYmFja1xuICAvLyR1cmxSb3V0ZXJQcm92aWRlci5vdGhlcndpc2UoJy90YWIvY2hhdHMnKTtcbiAgLy8kdXJsUm91dGVyUHJvdmlkZXIub3RoZXJ3aXNlKCcvc2lnbnVwJyk7IC8vIFRPRE86IFJpY2hhcmQgdGVzdGluZyB0aGlzIHJvdXRlXG4gIC8vJHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZSgnL3RhYi9jaGFsbGVuZ2UnKTsgLy9UT0RPOiBUb255IHRlc3RpbmcgdGhpcyByb3V0ZVxuICAgICR1cmxSb3V0ZXJQcm92aWRlci5vdGhlcndpc2UoJ3dlbGNvbWUnKTtcbn0pXG4vL1xuXG4vLy8vcnVuIGJsb2NrczogaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8yMDY2MzA3Ni9hbmd1bGFyanMtYXBwLXJ1bi1kb2N1bWVudGF0aW9uXG4vL1VzZSBydW4gbWV0aG9kIHRvIHJlZ2lzdGVyIHdvcmsgd2hpY2ggc2hvdWxkIGJlIHBlcmZvcm1lZCB3aGVuIHRoZSBpbmplY3RvciBpcyBkb25lIGxvYWRpbmcgYWxsIG1vZHVsZXMuXG4vL2h0dHA6Ly9kZXZkYWN0aWMuY29tL3VzZXItYXV0aC1hbmd1bGFyanMtaW9uaWMvXG5cbi5ydW4oZnVuY3Rpb24gKCRyb290U2NvcGUsICRzdGF0ZSwgQXV0aFNlcnZpY2UsIEFVVEhfRVZFTlRTKSB7XG5cbiAgICB2YXIgZGVzdGluYXRpb25TdGF0ZVJlcXVpcmVzQXV0aCA9IGZ1bmN0aW9uIChzdGF0ZSkge1xuICAgICAgICAvL2NvbnNvbGUubG9nKCdjbCAtIGRlc3RpbmF0aW9uU3RhdGVSZXF1aXJlc0F1dGgnLCdzdGF0ZS5kYXRhJyxzdGF0ZS5kYXRhLCdzdGF0ZS5kYXRhLmF1dGgnLHN0YXRlLmRhdGEuYXV0aGVudGljYXRlKTtcbiAgICAgICAgcmV0dXJuIHN0YXRlLmRhdGEgJiYgc3RhdGUuZGF0YS5hdXRoZW50aWNhdGU7XG4gICAgfTtcblxuICAgIC8vVE9ETzogTmVlZCB0byBtYWtlIGF1dGhlbnRpY2F0aW9uIG1vcmUgcm9idXN0IGJlbG93IGRvZXMgbm90IGZvbGxvdyBGU0cgKGV0LiBhbC4pXG4gICAgLy9UT0RPOiBDdXJyZW50bHkgaXQgaXMgbm90IGNoZWNraW5nIHRoZSBiYWNrZW5kIHJvdXRlIHJvdXRlci5nZXQoJy90b2tlbicpXG4gICAgJHJvb3RTY29wZS4kb24oJyRzdGF0ZUNoYW5nZVN0YXJ0JywgZnVuY3Rpb24gKGV2ZW50LHRvU3RhdGUsIHRvUGFyYW1zKSB7XG5cbiAgICAgICAgLy9jb25zb2xlLmxvZygndXNlciBBdXRoZW50aWNhdGVkJywgQXV0aFNlcnZpY2UuaXNBdXRoZW50aWNhdGVkKCkpO1xuXG4gICAgICAgIGlmICghZGVzdGluYXRpb25TdGF0ZVJlcXVpcmVzQXV0aCh0b1N0YXRlKSkge1xuICAgICAgICAgICAgLy8gVGhlIGRlc3RpbmF0aW9uIHN0YXRlIGRvZXMgbm90IHJlcXVpcmUgYXV0aGVudGljYXRpb25cbiAgICAgICAgICAgIC8vIFNob3J0IGNpcmN1aXQgd2l0aCByZXR1cm4uXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoQXV0aFNlcnZpY2UuaXNBdXRoZW50aWNhdGVkKCkpIHtcbiAgICAgICAgICAgIC8vIFRoZSB1c2VyIGlzIGF1dGhlbnRpY2F0ZWQuXG4gICAgICAgICAgICAvLyBTaG9ydCBjaXJjdWl0IHdpdGggcmV0dXJuLlxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy9UT0RPOiBOb3Qgc3VyZSBob3cgdG8gcHJvY2VlZCBoZXJlXG4gICAgICAgICRzdGF0ZS5nbygnbG9naW4nKTsgLy9pZiBhYm92ZSBmYWlscywgZ290byBsb2dpblxuICAgIH0pO1xufSk7IiwiYXBwLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlcil7XG5cdC8vIEVhY2ggdGFiIGhhcyBpdHMgb3duIG5hdiBoaXN0b3J5IHN0YWNrOlxuXHQkc3RhdGVQcm92aWRlci5zdGF0ZSgndGFiLmFjY291bnQnLCB7XG5cdFx0dXJsOiAnL2FjY291bnQnLFxuXHQgICAgdmlld3M6IHtcblx0ICAgIFx0J3RhYi1hY2NvdW50Jzoge1xuXHQgICAgXHRcdHRlbXBsYXRlVXJsOiAnZmVhdHVyZXMvYWNjb3VudC9hY2NvdW50Lmh0bWwnLFxuXHRcdFx0XHRjb250cm9sbGVyOiAnQWNjb3VudEN0cmwnXG5cdFx0XHR9XG5cdCAgICB9XG5cdH0pO1xufSk7XG5cbmFwcC5jb250cm9sbGVyKCdBY2NvdW50Q3RybCcsIGZ1bmN0aW9uKCRzY29wZSkge1xuXHQkc2NvcGUuc2V0dGluZ3MgPSB7XG5cdFx0ZW5hYmxlRnJpZW5kczogdHJ1ZVxuXHR9O1xufSk7IiwiYXBwLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlcil7XG5cdCRzdGF0ZVByb3ZpZGVyLnN0YXRlKCd0YWIuY2hhbGxlbmdlJywge1xuXHRcdHVybDogJy9jaGFsbGVuZ2UnLFxuXHRcdHZpZXdzOiB7XG5cdFx0XHQndGFiLWNoYWxsZW5nZScgOiB7XG5cdFx0XHRcdHRlbXBsYXRlVXJsOiAnZmVhdHVyZXMvY2hhbGxlbmdlL2NoYWxsZW5nZS5odG1sJyxcblx0XHRcdFx0Y29udHJvbGxlcjogJ0NoYWxsZW5nZUN0cmwnXG5cdFx0XHR9XG5cdFx0fSxcblx0XHRyZXNvbHZlIDoge1xuXHRcdFx0Y2hhbGxlbmdlIDogZnVuY3Rpb24oQ2hhbGxlbmdlRmFjdG9yeSwgJHN0YXRlKXtcblx0XHRcdFx0cmV0dXJuIENoYWxsZW5nZUZhY3RvcnkuZ2V0Q2hhbGxlbmdlKCkuY2F0Y2goZnVuY3Rpb24oZXJyKXtcblx0XHRcdFx0XHQkc3RhdGUuZ28oJ3RhYi5hY2NvdW50Jyk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH1cblx0fSk7XG59KTtcblxuYXBwLmNvbnRyb2xsZXIoJ0NoYWxsZW5nZUN0cmwnLCBmdW5jdGlvbigkc2NvcGUsIENoYWxsZW5nZUZhY3RvcnksIGNoYWxsZW5nZSwgJHN0YXRlKXtcblx0JHNjb3BlLmJ1dHRvbnMgPSB7XG5cdFx0c3VibWl0IDogJ1N1Ym1pdCcsXG5cdFx0dGVzdCA6ICdUZXN0Jyxcblx0XHRkaXNtaXNzIDogJ0Rpc21pc3MnXG5cdH07XG5cblx0JHNjb3BlLmNoYWxsZW5nZSA9IGNoYWxsZW5nZTtcblx0JHNjb3BlLmNoYWxsZW5nZURlc2MgPSBKU09OLnBhcnNlKGNoYWxsZW5nZVswXS5ib2R5KS5kZXNjcmlwdGlvbjtcblx0JHNjb3BlLmNoYWxsZW5nZUJvZHkgPSBKU09OLnBhcnNlKGNoYWxsZW5nZVswXS5ib2R5KS5zZXNzaW9uLnNldHVwO1xuXG5cblx0JHNjb3BlLnN1Ym1pdENoYWxsZW5nZSA9IGZ1bmN0aW9uKCl7XG5cdFx0JHN0YXRlLmdvKCd0YWIuY2hhbGxlbmdlLXN1Ym1pdCcpO1xuXHRcdENoYWxsZW5nZUZhY3Rvcnkuc3VibWl0Q2hhbGxlbmdlKCkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG5cblx0XHRcdHJldHVybiByZXNwb25zZS5kYXRhO1xuXHRcdH0pLmNhdGNoKGZ1bmN0aW9uKGVycil7XG5cdFx0XHRjb25zb2xlLmVycm9yKEpTT04uc3RyaW5naWZ5KGVycikpO1xuXHRcdH0pO1xuXHR9O1xuXG5cdCRzY29wZS50ZXN0Q2hhbGxlbmdlID0gZnVuY3Rpb24oKXtcblx0XHRDaGFsbGVuZ2VGYWN0b3J5LnRlc3RDaGFsbGVuZ2UoKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcblx0XHRcdHJldHVybiByZXNwb25zZS5kYXRhO1xuXHRcdH0pLmNhdGNoKGZ1bmN0aW9uKGVycil7XG5cdFx0XHRjb25zb2xlLmVycm9yKEpTT04uc3RyaW5naWZ5KGVycikpO1xuXHRcdH0pO1xuXHR9O1xuXG59KTtcblxuYXBwLmZhY3RvcnkoJ0NoYWxsZW5nZUZhY3RvcnknLCBmdW5jdGlvbigkaHR0cCwgQXBpRW5kcG9pbnQpe1xuXHRyZXR1cm4ge1xuXHRcdGdldENoYWxsZW5nZSA6IGZ1bmN0aW9uKCl7XG5cdFx0XHRyZXR1cm4gJGh0dHAuZ2V0KEFwaUVuZHBvaW50LnVybCArICcvY2hhbGxlbmdlJykudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG5cdFx0XHRcdHJldHVybiByZXNwb25zZS5kYXRhO1xuXHRcdFx0fSk7XG5cdFx0fSxcblx0XHRzdWJtaXRDaGFsbGVuZ2UgOiBmdW5jdGlvbigpe1xuXHRcdFx0cmV0dXJuICRodHRwLnBvc3QoQXBpRW5kcG9pbnQudXJsICsgJy9jaGFsbGVuZ2Uvc3VibWl0JykudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG5cdFx0XHRcdHJldHVybiByZXNwb25zZS5kYXRhO1xuXHRcdFx0fSk7XG5cdFx0fSxcblx0XHR0ZXN0Q2hhbGxlbmdlIDogZnVuY3Rpb24oKXtcblx0XHRcdHJldHVybiAkaHR0cC5wb3N0KEFwaUVuZHBvaW50LnVybCArICcvY2hhbGxlbmdlL3Rlc3QvJykudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG5cdFx0XHRcdHJldHVybiByZXNwb25zZS5kYXRhO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHR9O1xufSk7IiwiIiwiYXBwLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlciwgVVNFUl9ST0xFUyl7XG5cdCRzdGF0ZVByb3ZpZGVyLnN0YXRlKCd0YWIuY2hhbGxlbmdlLXN1Ym1pdCcsIHtcblx0XHR1cmwgOiAnL2NoYWxsZW5nZS9zdWJtaXQnLFxuXHRcdHZpZXdzOiB7XG5cdFx0XHQndGFiLWNoYWxsZW5nZScgOiB7XG5cdFx0XHRcdHRlbXBsYXRlVXJsIDogJ2ZlYXR1cmVzL2NoYWxsZW5nZS1zdWJtaXQvY2hhbGxlbmdlLXN1Ym1pdC5odG1sJyxcblx0XHRcdFx0Y29udHJvbGxlciA6ICdDaGFsbGVuZ2VTdWJtaXRDdHJsJ1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0ZGF0YToge1xuXHRcdFx0YXV0aGVudGljYXRlOiBbVVNFUl9ST0xFUy5wdWJsaWNdXG5cdFx0fVxuXHR9KTtcbn0pO1xuXG5hcHAuY29udHJvbGxlcignQ2hhbGxlbmdlU3VibWl0Q3RybCcsIGZ1bmN0aW9uKCRzY29wZSl7XG5cblx0JHNjb3BlLmFjZUxvYWRlZCA9IGZ1bmN0aW9uKF9lZGl0b3Ipe1xuXHRcdGNvbnNvbGUubG9nKF9lZGl0b3IpO1xuXHR9O1xuXG5cdCRzY29wZS5hY2VDaGFuZ2VkID0gZnVuY3Rpb24oZSl7XG5cdFx0Y29uc29sZS5sb2coZSk7XG5cdH07XG5cblx0JHNjb3BlLnR4dCA9ICcnO1xuXG5cdCRzY29wZS5hY2VDb25maWcgPSB7XG5cdFx0dXNlV3JhcE1vZGUgOiB0cnVlLFxuXHRcdHNob3dHdXR0ZXIgOiB0cnVlLFxuXHRcdHRoZW1lOiAnbW9ub2thaScsXG5cdFx0bW9kZTogJ2phdmFzY3JpcHQnLFxuXHRcdG9uTG9hZDogJHNjb3BlLmFjZUxvYWRlZCxcblx0XHRvbkNoYW5nZSA6ICRzY29wZS5hY2VDaGFuZ2VkXG5cdH07XG5cdC8vdGV4dCBuZWVkcyB0byBiZSB3b3JrZWQgb25cblxuXHRjb25zb2xlLmxvZygndGhpcyBpcyBsb2FkZWQnKTtcbn0pOyIsIiIsImFwcC5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIpe1xuXG4gICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCd0YWIuY2hhdHMnLCB7XG4gICAgICB1cmw6ICcvY2hhdHMnLFxuICAgICAgdmlld3M6IHtcbiAgICAgICAgJ3RhYi1jaGF0cyc6IHtcbiAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2ZlYXR1cmVzL2NoYXRzL3RhYi1jaGF0cy5odG1sJyxcbiAgICAgICAgICBjb250cm9sbGVyOiAnQ2hhdHNDdHJsJ1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSlcbiAgICAuc3RhdGUoJ3RhYi5jaGF0LWRldGFpbCcsIHtcbiAgICAgIHVybDogJy9jaGF0cy86Y2hhdElkJyxcbiAgICAgIHZpZXdzOiB7XG4gICAgICAgICd0YWItY2hhdHMnOiB7XG4gICAgICAgICAgdGVtcGxhdGVVcmw6ICdmZWF0dXJlcy9jaGF0cy9jaGF0LWRldGFpbC5odG1sJyxcbiAgICAgICAgICBjb250cm9sbGVyOiAnQ2hhdERldGFpbEN0cmwnXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbn0pO1xuXG5hcHAuY29udHJvbGxlcignQ2hhdHNDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBDaGF0cykge1xuICAkc2NvcGUuY2hhdHMgPSBDaGF0cy5hbGwoKTtcbiAgJHNjb3BlLnJlbW92ZSA9IGZ1bmN0aW9uKGNoYXQpIHtcbiAgICBDaGF0cy5yZW1vdmUoY2hhdCk7XG4gIH07XG59KTtcblxuYXBwLmNvbnRyb2xsZXIoJ0NoYXREZXRhaWxDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCAkc3RhdGVQYXJhbXMsIENoYXRzKSB7XG4gICRzY29wZS5jaGF0ID0gQ2hhdHMuZ2V0KCRzdGF0ZVBhcmFtcy5jaGF0SWQpO1xufSk7XG5cbmFwcC5mYWN0b3J5KCdDaGF0cycsIGZ1bmN0aW9uKCkge1xuICAvLyBNaWdodCB1c2UgYSByZXNvdXJjZSBoZXJlIHRoYXQgcmV0dXJucyBhIEpTT04gYXJyYXlcblxuICAvLyBTb21lIGZha2UgdGVzdGluZyBkYXRhXG4gIHZhciBjaGF0cyA9IFt7XG4gICAgaWQ6IDAsXG4gICAgbmFtZTogJ0JlbiBTcGFycm93JyxcbiAgICBsYXN0VGV4dDogJ1lvdSBvbiB5b3VyIHdheT8nLFxuICAgIGZhY2U6ICdodHRwczovL3Bicy50d2ltZy5jb20vcHJvZmlsZV9pbWFnZXMvNTE0NTQ5ODExNzY1MjExMTM2LzlTZ0F1SGVZLnBuZydcbiAgfSwge1xuICAgIGlkOiAxLFxuICAgIG5hbWU6ICdNYXggTHlueCcsXG4gICAgbGFzdFRleHQ6ICdIZXksIGl0XFwncyBub3QgbWUnLFxuICAgIGZhY2U6ICdodHRwczovL2F2YXRhcnMzLmdpdGh1YnVzZXJjb250ZW50LmNvbS91LzExMjE0P3Y9MyZzPTQ2MCdcbiAgfSx7XG4gICAgaWQ6IDIsXG4gICAgbmFtZTogJ0FkYW0gQnJhZGxleXNvbicsXG4gICAgbGFzdFRleHQ6ICdJIHNob3VsZCBidXkgYSBib2F0JyxcbiAgICBmYWNlOiAnaHR0cHM6Ly9wYnMudHdpbWcuY29tL3Byb2ZpbGVfaW1hZ2VzLzQ3OTA5MDc5NDA1ODM3OTI2NC84NFRLal9xYS5qcGVnJ1xuICB9LCB7XG4gICAgaWQ6IDMsXG4gICAgbmFtZTogJ1BlcnJ5IEdvdmVybm9yJyxcbiAgICBsYXN0VGV4dDogJ0xvb2sgYXQgbXkgbXVrbHVrcyEnLFxuICAgIGZhY2U6ICdodHRwczovL3Bicy50d2ltZy5jb20vcHJvZmlsZV9pbWFnZXMvNDkxOTk1Mzk4MTM1NzY3MDQwL2llMlpfVjZlLmpwZWcnXG4gIH0sIHtcbiAgICBpZDogNCxcbiAgICBuYW1lOiAnTWlrZSBIYXJyaW5ndG9uJyxcbiAgICBsYXN0VGV4dDogJ1RoaXMgaXMgd2lja2VkIGdvb2QgaWNlIGNyZWFtLicsXG4gICAgZmFjZTogJ2h0dHBzOi8vcGJzLnR3aW1nLmNvbS9wcm9maWxlX2ltYWdlcy81NzgyMzcyODEzODQ4NDEyMTYvUjNhZTFuNjEucG5nJ1xuICB9XTtcblxuICByZXR1cm4ge1xuICAgIGFsbDogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gY2hhdHM7XG4gICAgfSxcbiAgICByZW1vdmU6IGZ1bmN0aW9uKGNoYXQpIHtcbiAgICAgIGNoYXRzLnNwbGljZShjaGF0cy5pbmRleE9mKGNoYXQpLCAxKTtcbiAgICB9LFxuICAgIGdldDogZnVuY3Rpb24oY2hhdElkKSB7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoYXRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChjaGF0c1tpXS5pZCA9PT0gcGFyc2VJbnQoY2hhdElkKSkge1xuICAgICAgICAgIHJldHVybiBjaGF0c1tpXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICB9O1xufSk7XG4iLCJhcHAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKXtcblx0JHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2xvZ2luJywge1xuXHRcdHVybCA6ICcvbG9naW4nLFxuXHRcdHRlbXBsYXRlVXJsIDogJ2ZlYXR1cmVzL2xvZ2luL2xvZ2luLmh0bWwnLFxuXHRcdGNvbnRyb2xsZXIgOiAnTG9naW5DdHJsJ1xuXHR9KTtcbn0pO1xuXG5hcHAuY29udHJvbGxlcignTG9naW5DdHJsJywgZnVuY3Rpb24oJHNjb3BlLCAkaW9uaWNQb3B1cCwgJHN0YXRlLCBBdXRoU2VydmljZSl7XG5cdC8vJHNjb3BlLmFjY291bnQgPSBmdW5jdGlvbigpe1xuICAgIC8vXG5cdC8vfTtcblx0JHNjb3BlLmRhdGEgPSB7fTtcblx0JHNjb3BlLmVycm9yID0gbnVsbDtcblxuXHQkc2NvcGUubG9naW4gPSBmdW5jdGlvbigpe1xuXHRcdEF1dGhTZXJ2aWNlXG5cdFx0XHQubG9naW4oJHNjb3BlLmRhdGEpXG5cdFx0XHQudGhlbihmdW5jdGlvbihhdXRoZW50aWNhdGVkKXsgLy9UT0RPOmF1dGhlbnRpY2F0ZWQgaXMgd2hhdCBpcyByZXR1cm5lZFxuXHRcdFx0XHRjb25zb2xlLmxvZygnYXV0aGVudGljYXRlZCwgdGFiLmNoYWxsZW5nZS1zdWJtaXQnKTtcblx0XHRcdFx0JHN0YXRlLmdvKCd0YWIuY2hhbGxlbmdlLXN1Ym1pdCcpO1xuXHRcdFx0XHQvL1RPRE86IFdlIGNhbiBzZXQgdGhlIHVzZXIgbmFtZSBoZXJlIGFzIHdlbGwuIFVzZWQgaW4gY29uanVuY3Rpb24gd2l0aCBhIG1haW4gY3RybFxuXHRcdFx0fSlcblx0XHRcdC5jYXRjaChmdW5jdGlvbihlcnIpe1xuXHRcdFx0XHQkc2NvcGUuZXJyb3IgPSAnTG9naW4gSW52YWxpZCc7XG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoSlNPTi5zdHJpbmdpZnkoZXJyKSlcblx0XHRcdFx0dmFyIGFsZXJ0UG9wdXAgPSAkaW9uaWNQb3B1cC5hbGVydCh7XG5cdFx0XHRcdFx0dGl0bGU6ICdMb2dpbiBmYWlsZWQhJyxcblx0XHRcdFx0XHR0ZW1wbGF0ZTogJ1BsZWFzZSBjaGVjayB5b3VyIGNyZWRlbnRpYWxzISdcblx0XHRcdFx0fSk7XG5cdFx0XHR9KTtcblx0XHQvL0xvZ2luRmFjdG9yeVxuXHRcdC8vXHQucG9zdExvZ2luKCRzY29wZS5kYXRhKVxuXHRcdC8vXHQudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG5cdFx0Ly9cdFx0QXV0aFRva2VuRmFjdG9yeS5zZXRUb2tlbihyZXNwb25zZS5kYXRhLnRva2VuKTtcblx0XHQvL1x0XHQvL2NvbnNvbGUubG9nKCdnb3RvIHRhYi1jaGFsbGVuZ2Utc3VibWl0JyxyZXNwb25zZS5kYXRhLnRva2VuLCByZXNwb25zZS5kYXRhLnVzZXIpO1xuXHRcdC8vXHRcdCRzdGF0ZS5nbygndGFiLmNoYWxsZW5nZS1zdWJtaXQnKTtcblx0XHQvL1x0XHRyZXR1cm4gcmVzcG9uc2U7IC8vVE9ETzogcmVtb3ZlIGlmIG5vdCByZXF1aXJlZCwgeW91IGNhbiBqdXN0IGNoYW5nZSBzdGF0ZXMgaW5zdGVhZFxuXHRcdC8vXHR9KVxuXHRcdC8vXHQuY2F0Y2goZnVuY3Rpb24oZXJyKXtcblx0XHQvL1x0XHQkc2NvcGUuZXJyb3IgPSAnTG9naW4gSW52YWxpZCc7XG5cdFx0Ly9cdFx0Y29uc29sZS5lcnJvcihKU09OLnN0cmluZ2lmeShlcnIpKTtcblx0XHQvL1x0fSk7XG5cdH07XG59KTtcblxuLy9hcHAuZmFjdG9yeSgnTG9naW5GYWN0b3J5JyxmdW5jdGlvbigkaHR0cCxBcGlFbmRwb2ludCl7XG4vL1x0cmV0dXJue1xuLy9cdFx0cG9zdExvZ2luOiBmdW5jdGlvbih1c2VyZGF0YSl7XG4vL1x0XHRcdGNvbnNvbGUubG9nKCdwb3N0TG9naW4nLEpTT04uc3RyaW5naWZ5KHVzZXJkYXRhKSk7XG4vL1x0XHRcdHJldHVybiAkaHR0cC5wb3N0KEFwaUVuZHBvaW50LnVybCtcIi91c2VyL2xvZ2luXCIsIHVzZXJkYXRhKTtcbi8vXHRcdH1cbi8vXHR9O1xuLy99KTtcblxuLy9hcHAuY29udHJvbGxlcignTG9naW5DdHJsJywgZnVuY3Rpb24gKCRzY29wZSwgQXV0aFNlcnZpY2UsICRzdGF0ZSkge1xuLy9cbi8vXHQkc2NvcGUubG9naW4gPSB7fTtcbi8vXHQkc2NvcGUuZXJyb3IgPSBudWxsO1xuLy9cbi8vXHQkc2NvcGUuc2VuZExvZ2luID0gZnVuY3Rpb24gKGxvZ2luSW5mbykge1xuLy9cbi8vXHRcdCRzY29wZS5lcnJvciA9IG51bGw7XG4vL1xuLy9cdFx0QXV0aFNlcnZpY2UubG9naW4obG9naW5JbmZvKS50aGVuKGZ1bmN0aW9uICgpIHtcbi8vXHRcdFx0JHN0YXRlLmdvKCdob21lJyk7XG4vL1x0XHR9KS5jYXRjaChmdW5jdGlvbiAoKSB7XG4vL1x0XHRcdCRzY29wZS5lcnJvciA9ICdJbnZhbGlkIGxvZ2luIGNyZWRlbnRpYWxzLic7XG4vL1x0XHR9KTtcbi8vXG4vL1x0fTtcbi8vXG4vL30pO1xuXG4iLCJhcHAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKXtcbiAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgnc2lnbnVwJyx7XG4gICAgICAgIHVybDpcIi9zaWdudXBcIixcbiAgICAgICAgdGVtcGxhdGVVcmw6IFwiZmVhdHVyZXMvc2lnbnVwL3NpZ251cC5odG1sXCIsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdTaWduVXBDdHJsJ1xuICAgIH0pO1xufSk7XG5cbmFwcC5jb250cm9sbGVyKCdTaWduVXBDdHJsJyxmdW5jdGlvbigkaHR0cCwgJHNjb3BlLCAkc3RhdGUsIFNpZ25VcEZhY3RvcnksIEF1dGhTZXJ2aWNlKXtcbiAgICAkc2NvcGUuZGF0YSA9IHt9O1xuICAgICRzY29wZS5lcnJvciA9IG51bGw7XG5cbiAgICAkc2NvcGUuc2lnbnVwID0gZnVuY3Rpb24oKXtcbiAgICAgICAgU2lnblVwRmFjdG9yeSAvL1RPRE86IGNvbnZlcnQgdG8gdXNlIEF1dGggU2VydmljZSBpbnN0ZWFkXG4gICAgICAgICAgICAucG9zdFNpZ251cCgkc2NvcGUuZGF0YSlcbiAgICAgICAgICAgIC50aGVuKEF1dGhTZXJ2aWNlLnNpZ25lZFVwKVxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdnb3RvIHRhYi1jaGFsbGVuZ2Utc3VibWl0JyxKU09OLnN0cmluZ2lmeShyZXNwb25zZSkpO1xuICAgICAgICAgICAgICAgIC8vJGh0dHAuZ2V0KEFwaUVuZHBvaW50LnVybCtcIi9cIik7XG4gICAgICAgICAgICAgICAgLy9JTkZPOiBTZXNzaW9uIGlzIHN0b3JlZCBhcyBhIGNvb2tpZSBvbiB0aGUgYnJvd3NlclxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC8vc3RvcmUgZGF0YSBpbiBzZXNzaW9uXG4gICAgICAgICAgICAvLyRzdGF0ZS5nbygndGFiLmNoYWxsZW5nZS1zdWJtaXQnKTsgLy9UT0RPOiBBZGQgUm91dGUgYmFjaywgcmVtb3ZlZCBmb3IgdGVzdGluZ1xuICAgICAgICAgICAgLmNhdGNoKGZ1bmN0aW9uKGVycil7XG4gICAgICAgICAgICAkc2NvcGUuZXJyb3IgPSAnTG9naW4gSW52YWxpZCc7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKEpTT04uc3RyaW5naWZ5KGVycikpO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG59KTtcblxuYXBwLmZhY3RvcnkoJ1NpZ25VcEZhY3RvcnknLGZ1bmN0aW9uKCRodHRwLCBBcGlFbmRwb2ludCl7XG4gICAgcmV0dXJue1xuICAgICAgICBwb3N0U2lnbnVwOiBmdW5jdGlvbih1c2VyZGF0YSl7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygncG9zdFNpZ251cCcsSlNPTi5zdHJpbmdpZnkodXNlcmRhdGEpKTtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5wb3N0KEFwaUVuZHBvaW50LnVybCtcIi91c2VyL3NpZ251cFwiLCB1c2VyZGF0YSk7XG4gICAgICAgIH1cbiAgICB9O1xufSk7XG5cbi8vVE9ETzogRm9ybSBWYWxpZGF0aW9uXG5cbi8vTkVYVDogU2VuZGluZyBkYXRhIHRvIHRoZSBiYWNrLWVuZCBhbmQgc2V0dGluZyB1cCByb3V0ZXNcbi8vTW9uZ29vc2VcbiIsImFwcC5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIpe1xuXHQkc3RhdGVQcm92aWRlci5zdGF0ZSgnd2VsY29tZScsIHtcblx0XHR1cmwgOiAnL3dlbGNvbWUnLFxuXHRcdHRlbXBsYXRlVXJsIDogJ2ZlYXR1cmVzL3dlbGNvbWUvd2VsY29tZS5odG1sJyxcblx0XHRjb250cm9sbGVyIDogJ1dlbGNvbWVDdHJsJ1xuXHR9KTtcbn0pO1xuXG5hcHAuY29udHJvbGxlcignV2VsY29tZUN0cmwnLCBmdW5jdGlvbigkc2NvcGUsICRzdGF0ZSwgQXV0aFRva2VuRmFjdG9yeSl7XG5cdC8vVE9ETzogU3BsYXNoIHBhZ2Ugd2hpbGUgeW91IGxvYWQgcmVzb3VyY2VzIChwb3NzaWJsZSBpZGVhKVxuXHQkc2NvcGUubG9naW4gPSBmdW5jdGlvbigpe1xuXHRcdCRzdGF0ZS5nbygnbG9naW4nKTtcblx0fTtcblx0JHNjb3BlLnNpZ251cCA9IGZ1bmN0aW9uKCl7XG5cdFx0JHN0YXRlLmdvKCdzaWdudXAnKTtcblx0fTtcblxuXHR2YXIgdG9rZW4gPSBBdXRoVG9rZW5GYWN0b3J5LmdldFRva2VuKClcblx0aWYgKHRva2VuKSB7XG5cdFx0Y29uc29sZS5sb2codG9rZW4pXG5cdFx0JHN0YXRlLmdvKCd0YWIuY2hhbGxlbmdlLXN1Ym1pdCcpO1xuXHR9IGVsc2Uge1xuXHRcdCRzdGF0ZS5nbygnbG9naW4nKTtcblx0fVxuXHQvL30pO1xufSk7IiwiLy90b2tlbiBpcyBzZW50IG9uIGV2ZXJ5IGh0dHAgcmVxdWVzdFxuYXBwLmZhY3RvcnkoJ0F1dGhJbnRlcmNlcHRvcicsZnVuY3Rpb24gQXV0aEludGVyY2VwdG9yKEFVVEhfRVZFTlRTLCRyb290U2NvcGUsJHEsQXV0aFRva2VuRmFjdG9yeSl7XG5cbiAgICB2YXIgc3RhdHVzRGljdCA9IHtcbiAgICAgICAgNDAxOiBBVVRIX0VWRU5UUy5ub3RBdXRoZW50aWNhdGVkLFxuICAgICAgICA0MDM6IEFVVEhfRVZFTlRTLm5vdEF1dGhvcml6ZWRcbiAgICB9O1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgcmVxdWVzdDogYWRkVG9rZW4sXG4gICAgICAgIHJlc3BvbnNlRXJyb3I6IGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KHN0YXR1c0RpY3RbcmVzcG9uc2Uuc3RhdHVzXSwgcmVzcG9uc2UpO1xuICAgICAgICAgICAgcmV0dXJuICRxLnJlamVjdChyZXNwb25zZSk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gYWRkVG9rZW4oY29uZmlnKXtcbiAgICAgICAgdmFyIHRva2VuID0gQXV0aFRva2VuRmFjdG9yeS5nZXRUb2tlbigpO1xuICAgICAgICBpZih0b2tlbil7XG4gICAgICAgICAgICBjb25maWcuaGVhZGVycyA9IGNvbmZpZy5oZWFkZXJzIHx8IHt9O1xuICAgICAgICAgICAgY29uZmlnLmhlYWRlcnMuQXV0aG9yaXphdGlvbiA9ICdCZWFyZXIgJyArIHRva2VuO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjb25maWc7XG4gICAgfVxufSk7IC8vc2tpcHBlZCBBdXRoIEludGVyY2VwdG9ycyBnaXZlbiBUT0RPOiBZb3UgY291bGQgYXBwbHkgdGhlIGFwcHJvYWNoIGluXG4vL2h0dHA6Ly9kZXZkYWN0aWMuY29tL3VzZXItYXV0aC1hbmd1bGFyanMtaW9uaWMvXG5cbmFwcC5jb25maWcoZnVuY3Rpb24oJGh0dHBQcm92aWRlcil7XG4gICAgJGh0dHBQcm92aWRlci5pbnRlcmNlcHRvcnMucHVzaCgnQXV0aEludGVyY2VwdG9yJyk7XG59KTtcblxuYXBwLmNvbnN0YW50KCdBVVRIX0VWRU5UUycsIHtcbiAgICAgICAgbm90QXV0aGVudGljYXRlZDogJ2F1dGgtbm90LWF1dGhlbnRpY2F0ZWQnLFxuICAgICAgICBub3RBdXRob3JpemVkOiAnYXV0aC1ub3QtYXV0aG9yaXplZCdcbn0pO1xuXG5hcHAuY29uc3RhbnQoJ1VTRVJfUk9MRVMnLCB7XG4gICAgICAgIC8vYWRtaW46ICdhZG1pbl9yb2xlJyxcbiAgICAgICAgcHVibGljOiAncHVibGljX3JvbGUnXG59KTtcblxuYXBwLmZhY3RvcnkoJ0F1dGhUb2tlbkZhY3RvcnknLGZ1bmN0aW9uKCR3aW5kb3cpe1xuICAgIHZhciBzdG9yZSA9ICR3aW5kb3cubG9jYWxTdG9yYWdlO1xuICAgIHZhciBrZXkgPSAnYXV0aC10b2tlbic7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBnZXRUb2tlbjogZ2V0VG9rZW4sXG4gICAgICAgIHNldFRva2VuOiBzZXRUb2tlblxuICAgIH07XG5cbiAgICBmdW5jdGlvbiBnZXRUb2tlbigpe1xuICAgICAgICByZXR1cm4gc3RvcmUuZ2V0SXRlbShrZXkpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNldFRva2VuKHRva2VuKXtcbiAgICAgICAgaWYodG9rZW4pe1xuICAgICAgICAgICAgc3RvcmUuc2V0SXRlbShrZXksdG9rZW4pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc3RvcmUucmVtb3ZlSXRlbShrZXkpO1xuICAgICAgICB9XG4gICAgfVxufSk7XG5cbmFwcC5zZXJ2aWNlKCdBdXRoU2VydmljZScsZnVuY3Rpb24oJHEsJGh0dHAsVVNFUl9ST0xFUyxBdXRoVG9rZW5GYWN0b3J5LEFwaUVuZHBvaW50LCRyb290U2NvcGUpe1xuICAgIC8vdmFyIExPQ0FMX1RPS0VOX0tFWSA9ICdhdXRoLXRva2VuJztcbiAgICB2YXIgdXNlcm5hbWUgPSAnJztcbiAgICB2YXIgaXNBdXRoZW50aWNhdGVkID0gZmFsc2U7XG4gICAgdmFyIGF1dGhUb2tlbjtcblxuXG4gICAgZnVuY3Rpb24gbG9hZFVzZXJDcmVkZW50aWFscygpIHtcbiAgICAgICAgLy92YXIgdG9rZW4gPSB3aW5kb3cubG9jYWxTdG9yYWdlLmdldEl0ZW0oTE9DQUxfVE9LRU5fS0VZKTtcbiAgICAgICAgdmFyIHRva2VuID0gQXV0aFRva2VuRmFjdG9yeS5nZXRUb2tlbigpO1xuICAgICAgICBpZiAodG9rZW4pIHtcbiAgICAgICAgICAgIHVzZUNyZWRlbnRpYWxzKHRva2VuKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHN0b3JlVXNlckNyZWRlbnRpYWxzKHRva2VuKSB7XG4gICAgICAgIEF1dGhUb2tlbkZhY3Rvcnkuc2V0VG9rZW4odG9rZW4pO1xuICAgICAgICB1c2VDcmVkZW50aWFscyh0b2tlbik7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdXNlQ3JlZGVudGlhbHModG9rZW4pIHtcbiAgICAgICAgY29uc29sZS5sb2coJ3VzZUNyZWRlbnRpYWxzIHRva2VuJyx0b2tlbik7XG4gICAgICAgIHVzZXJuYW1lID0gdG9rZW4udXNlcjtcbiAgICAgICAgaXNBdXRoZW50aWNhdGVkID0gdHJ1ZTtcbiAgICAgICAgYXV0aFRva2VuID0gdG9rZW4udG9rZW47XG5cbiAgICAgICAgLy8gU2V0IHRoZSB0b2tlbiBhcyBoZWFkZXIgZm9yIHlvdXIgcmVxdWVzdHMhXG4gICAgICAgIC8vJGh0dHAuZGVmYXVsdHMuaGVhZGVycy5jb21tb25bJ1gtQXV0aC1Ub2tlbiddID0gdG9rZW47IC8vVE9ET1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGRlc3Ryb3lVc2VyQ3JlZGVudGlhbHMoKSB7XG4gICAgICAgIGF1dGhUb2tlbiA9IHVuZGVmaW5lZDtcbiAgICAgICAgdXNlcm5hbWUgPSAnJztcbiAgICAgICAgaXNBdXRoZW50aWNhdGVkID0gZmFsc2U7XG4gICAgICAgIC8vJGh0dHAuZGVmYXVsdHMuaGVhZGVycy5jb21tb25bJ1gtQXV0aC1Ub2tlbiddID0gdW5kZWZpbmVkO1xuICAgICAgICAvL3dpbmRvdy5sb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShMT0NBTF9UT0tFTl9LRVkpO1xuICAgICAgICBBdXRoVG9rZW5GYWN0b3J5LnNldFRva2VuKCk7IC8vZW1wdHkgY2xlYXJzIHRoZSB0b2tlblxuICAgIH1cblxuICAgIHZhciBsb2dvdXQgPSBmdW5jdGlvbigpe1xuICAgICAgICBkZXN0cm95VXNlckNyZWRlbnRpYWxzKCk7XG4gICAgfTtcblxuICAgIC8vdmFyIGxvZ2luID0gZnVuY3Rpb24oKVxuICAgIHZhciBsb2dpbiA9IGZ1bmN0aW9uKHVzZXJkYXRhKXtcbiAgICAgICAgY29uc29sZS5sb2coJ3Bvc3RMb2dpbicsSlNPTi5zdHJpbmdpZnkodXNlcmRhdGEpKTtcbiAgICAgICAgcmV0dXJuICRxKGZ1bmN0aW9uKHJlc29sdmUscmVqZWN0KXtcbiAgICAgICAgICAgICRodHRwLnBvc3QoQXBpRW5kcG9pbnQudXJsK1wiL3VzZXIvbG9naW5cIiwgdXNlcmRhdGEpXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgICAgICAgICAgICAgICBBdXRoVG9rZW5GYWN0b3J5LnNldFRva2VuKHJlc3BvbnNlLmRhdGEudG9rZW4pOyAvL3N0b3JlVXNlckNyZWRlbnRpYWxzXG4gICAgICAgICAgICAgICAgICAgIGlzQXV0aGVudGljYXRlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUocmVzcG9uc2UpOyAvL1RPRE86IHNlbnQgdG8gYXV0aGVudGljYXRlZFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgbG9hZFVzZXJDcmVkZW50aWFscygpO1xuXG4gICAgdmFyIGlzQXV0aG9yaXplZCA9IGZ1bmN0aW9uKGF1dGhlbnRpY2F0ZWQpIHtcbiAgICAgICAgaWYgKCFhbmd1bGFyLmlzQXJyYXkoYXV0aGVudGljYXRlZCkpIHtcbiAgICAgICAgICAgIGF1dGhlbnRpY2F0ZWQgPSBbYXV0aGVudGljYXRlZF07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIChpc0F1dGhlbnRpY2F0ZWQgJiYgYXV0aGVudGljYXRlZC5pbmRleE9mKFVTRVJfUk9MRVMucHVibGljKSAhPT0gLTEpO1xuICAgIH07XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBsb2dpbjogbG9naW4sXG4gICAgICAgIGxvZ291dDogbG9nb3V0LFxuICAgICAgICBpc0F1dGhlbnRpY2F0ZWQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ0F1dGhTZXJ2aWNlLmlzQXV0aGVudGljYXRlZCgpJyk7XG4gICAgICAgICAgICByZXR1cm4gaXNBdXRoZW50aWNhdGVkO1xuICAgICAgICB9LFxuICAgICAgICB1c2VybmFtZTogZnVuY3Rpb24oKXtyZXR1cm4gdXNlcm5hbWU7fSxcbiAgICAgICAgLy9nZXRMb2dnZWRJblVzZXI6IGdldExvZ2dlZEluVXNlcixcbiAgICAgICAgaXNBdXRob3JpemVkOiBpc0F1dGhvcml6ZWRcbiAgICB9XG5cbn0pO1xuXG4vL1RPRE86IERpZCBub3QgY29tcGxldGUgbWFpbiBjdHJsICdBcHBDdHJsIGZvciBoYW5kbGluZyBldmVudHMnXG4vLyBhcyBwZXIgaHR0cDovL2RldmRhY3RpYy5jb20vdXNlci1hdXRoLWFuZ3VsYXJqcy1pb25pYy8iLCJhcHAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKXtcblxuICBcdC8vIHNldHVwIGFuIGFic3RyYWN0IHN0YXRlIGZvciB0aGUgdGFicyBkaXJlY3RpdmVcbiAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgndGFiJywge1xuXHQgICAgdXJsOiBcIi90YWJcIixcblx0ICAgIGFic3RyYWN0OiB0cnVlLFxuXHQgICAgdGVtcGxhdGVVcmw6IFwiZmVhdHVyZXMvY29tbW9uL3RhYnMvdGFicy5odG1sXCJcblx0fSk7XG59KTsiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=