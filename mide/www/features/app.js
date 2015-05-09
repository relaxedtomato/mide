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
  url : '/api'
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js

  // if none of the above states are matched, use this as the fallback
  //$urlRouterProvider.otherwise('/tab/chats');
  $urlRouterProvider.otherwise('/signup'); // TODO: Richard testing this route
  //$urlRouterProvider.otherwise('/tab/challenge'); //TODO: Tony testing this route
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

app.config(function($stateProvider){
	$stateProvider.state('tab.challenge-submit', {
		url : '/challenge/submit',
		views: {
			'tab-challenge' : {
				templateUrl : 'features/challenge-submit/challenge-submit.html',
				controller : 'ChallengeSubmitCtrl'
			}
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

app.controller('LoginCtrl', function($scope){
	$scope.account = function(){

	};
});

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
        SignUpFactory
            .postSignup($scope.data)
            .then(AuthService.signedUp)
            .then(function(response){
                console.log('goto tab-challenge-submit',JSON.stringify(response));
                //$http.get(ApiEndpoint.url+"/");
                //INFO: Session is stored as a cookie on the browser
                //TODO: Add route display session data
            })
            //store data in session
            //$state.go('tab.challenge-submit'); //TODO: Add Route back, removed for testing
            .catch(function(err){
            $scope.error = 'Login Invalid';
            console.error(JSON.stringify(err));
        });
    };

});

//TODO: NEXT How to check for session data stored, or if it is being sent back, somehow?

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

app.controller('WelcomeCtrl', function($scope, $state){
	$scope.login = function(){
		$state.go('login');
	};
	$scope.signup = function(){
		$state.go('signup');
	};
});
(function () {

    'use strict';

    // Hope you didn't forget Angular! Duh-doy.
    if (!window.angular) throw new Error('I can\'t find Angular!');

    //var app = angular.module('fsaPreBuilt', []);

    //app.factory('Socket', function ($location) {
    //
    //    if (!window.io) throw new Error('socket.io not found!');
    //
    //    var socket;
    //
    //    if ($location.$$port) {
    //        socket = io('http://localhost:1337');
    //    } else {
    //        socket = io('/');
    //    }
    //
    //    return socket;
    //
    //});

    // AUTH_EVENTS is used throughout our app to
    // broadcast and listen from and to the $rootScope
    // for important events about authentication flow.
    app.constant('AUTH_EVENTS', {
        loginSuccess: 'auth-login-success',
        loginFailed: 'auth-login-failed',
        logoutSuccess: 'auth-logout-success',
        sessionTimeout: 'auth-session-timeout',
        notAuthenticated: 'auth-not-authenticated',
        notAuthorized: 'auth-not-authorized'
    });

    app.factory('AuthInterceptor', function ($rootScope, $q, AUTH_EVENTS) {
        var statusDict = {
            401: AUTH_EVENTS.notAuthenticated,
            403: AUTH_EVENTS.notAuthorized,
            419: AUTH_EVENTS.sessionTimeout,
            440: AUTH_EVENTS.sessionTimeout
        };
        return {
            responseError: function (response) {
                $rootScope.$broadcast(statusDict[response.status], response);
                return $q.reject(response);
            }
        };
    });

    app.config(function ($httpProvider) {
        $httpProvider.interceptors.push([
            '$injector',
            function ($injector) {
                return $injector.get('AuthInterceptor');
            }
        ]);
    });

    app.service('AuthService', function ($http, Session, $rootScope, AUTH_EVENTS, $q) {

        // Uses the session factory to see if an
        // authenticated user is currently registered.
        this.isAuthenticated = function () {
            return !!Session.user;
        };

        this.isAdmin = function() {
            return Session.user.accountType === "admin" && this.isAuthenticated();
        };

        this.getLoggedInUser = function () {

            // If an authenticated session exists, we
            // return the user attached to that session
            // with a promise. This ensures that we can
            // always interface with this method asynchronously.
            if (this.isAuthenticated()) {
                return $q.when(Session.user);
            }

            // Make request GET /session.
            // If it returns a user, call onSuccessfulLogin with the response.
            // If it returns a 401 response, we catch it and instead resolve to null.
            return $http.get('/session').then(onSuccessfulLogin).catch(function () {
                return null;
            });

        };

        this.login = function (credentials) {
            return $http.post('/login', credentials)
                .then(onSuccessfulLogin)
                .catch(function (response) {
                    return $q.reject({ message: 'Invalid login credentials.' });
                });
        };

        this.logout = function () {
            return $http.get('/logout').then(function () {
                Session.destroy();
                $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
            });
        };

        this.signedUp = function(response){
            console.log('signedUp, Session call', JSON.stringify(response));
            return onSuccessfulLogin(response);
        };

        function onSuccessfulLogin(response) {
            var data = response.data;
            //"data":{"user":{"userName":"1","email":"1","id":"554e7c4966983940d35126d4"}},
            Session.create(data.id, data.user);
            $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
            return data.user;
        }

    });

    app.service('Session', function ($rootScope, AUTH_EVENTS) {

        var self = this;

        $rootScope.$on(AUTH_EVENTS.notAuthenticated, function () {
            self.destroy();
        });

        $rootScope.$on(AUTH_EVENTS.sessionTimeout, function () {
            self.destroy();
        });

        this.id = null;
        this.user = null;

        this.create = function (sessionId, user) {
            this.id = sessionId;
            this.user = user;
        };

        this.destroy = function () {
            this.id = null;
            this.user = null;
        };

    });

})();
app.config(function($stateProvider){

  	// setup an abstract state for the tabs directive
    $stateProvider.state('tab', {
	    url: "/tab",
	    abstract: true,
	    templateUrl: "features/common/tabs/tabs.html"
	});
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImFjY291bnQvYWNjb3VudC5qcyIsImNoYWxsZW5nZS9jaGFsbGVuZ2UuanMiLCJjaGFsbGVuZ2UtY29tcGlsZS9jaGFsbGVuZ2UtY29tcGlsZS5qcyIsImNoYWxsZW5nZS1zdWJtaXQvY2hhbGxlbmdlLXN1Ym1pdC5qcyIsImNoYWxsZW5nZS12aWV3L2NoYWxsZW5nZS12aWV3LmpzIiwiY2hhdHMvY2hhdHMuanMiLCJsb2dpbi9sb2dpbi5qcyIsInNpZ251cC9zaWdudXAuanMiLCJ3ZWxjb21lL3dlbGNvbWUuanMiLCJjb21tb24vQXV0aGVudGljYXRpb24vYXV0aGVudGljYXRpb24uanMiLCJjb21tb24vdGFicy90YWJzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xFQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25DQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDL0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDckpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBJb25pYyBTdGFydGVyIEFwcFxuXG4vLyBhbmd1bGFyLm1vZHVsZSBpcyBhIGdsb2JhbCBwbGFjZSBmb3IgY3JlYXRpbmcsIHJlZ2lzdGVyaW5nIGFuZCByZXRyaWV2aW5nIEFuZ3VsYXIgbW9kdWxlc1xuLy8gJ3N0YXJ0ZXInIGlzIHRoZSBuYW1lIG9mIHRoaXMgYW5ndWxhciBtb2R1bGUgZXhhbXBsZSAoYWxzbyBzZXQgaW4gYSA8Ym9keT4gYXR0cmlidXRlIGluIGluZGV4Lmh0bWwpXG4vLyB0aGUgMm5kIHBhcmFtZXRlciBpcyBhbiBhcnJheSBvZiAncmVxdWlyZXMnXG4vLyAnc3RhcnRlci5zZXJ2aWNlcycgaXMgZm91bmQgaW4gc2VydmljZXMuanNcbi8vICdzdGFydGVyLmNvbnRyb2xsZXJzJyBpcyBmb3VuZCBpbiBjb250cm9sbGVycy5qc1xudmFyIGFwcCA9IGFuZ3VsYXIubW9kdWxlKCdtaWRlJywgWydpb25pYycsICd1aS5hY2UnXSlcblxuLnJ1bihmdW5jdGlvbigkaW9uaWNQbGF0Zm9ybSkge1xuICAkaW9uaWNQbGF0Zm9ybS5yZWFkeShmdW5jdGlvbigpIHtcbiAgICAvLyBIaWRlIHRoZSBhY2Nlc3NvcnkgYmFyIGJ5IGRlZmF1bHQgKHJlbW92ZSB0aGlzIHRvIHNob3cgdGhlIGFjY2Vzc29yeSBiYXIgYWJvdmUgdGhlIGtleWJvYXJkXG4gICAgLy8gZm9yIGZvcm0gaW5wdXRzKVxuICAgIGlmICh3aW5kb3cuY29yZG92YSAmJiB3aW5kb3cuY29yZG92YS5wbHVnaW5zICYmIHdpbmRvdy5jb3Jkb3ZhLnBsdWdpbnMuS2V5Ym9hcmQpIHtcbiAgICAgIGNvcmRvdmEucGx1Z2lucy5LZXlib2FyZC5oaWRlS2V5Ym9hcmRBY2Nlc3NvcnlCYXIodHJ1ZSk7XG4gICAgfVxuICAgIGlmICh3aW5kb3cuU3RhdHVzQmFyKSB7XG4gICAgICAvLyBvcmcuYXBhY2hlLmNvcmRvdmEuc3RhdHVzYmFyIHJlcXVpcmVkXG4gICAgICBTdGF0dXNCYXIuc3R5bGVMaWdodENvbnRlbnQoKTtcbiAgICB9XG4gIH0pO1xufSlcblxuLy9UT0RPOlRoaXMgaXMgbmVlZGVkIHRvIHNldCB0byBhY2Nlc3MgdGhlIHByb3h5IHVybCB0aGF0IHdpbGwgdGhlbiBpbiB0aGUgaW9uaWMucHJvamVjdCBmaWxlIHJlZGlyZWN0IGl0IHRvIHRoZSBjb3JyZWN0IFVSTFxuLmNvbnN0YW50KCdBcGlFbmRwb2ludCcsIHtcbiAgdXJsIDogJy9hcGknXG59KVxuXG4uY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyLCAkdXJsUm91dGVyUHJvdmlkZXIpIHtcblxuICAvLyBJb25pYyB1c2VzIEFuZ3VsYXJVSSBSb3V0ZXIgd2hpY2ggdXNlcyB0aGUgY29uY2VwdCBvZiBzdGF0ZXNcbiAgLy8gTGVhcm4gbW9yZSBoZXJlOiBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci11aS91aS1yb3V0ZXJcbiAgLy8gU2V0IHVwIHRoZSB2YXJpb3VzIHN0YXRlcyB3aGljaCB0aGUgYXBwIGNhbiBiZSBpbi5cbiAgLy8gRWFjaCBzdGF0ZSdzIGNvbnRyb2xsZXIgY2FuIGJlIGZvdW5kIGluIGNvbnRyb2xsZXJzLmpzXG5cbiAgLy8gaWYgbm9uZSBvZiB0aGUgYWJvdmUgc3RhdGVzIGFyZSBtYXRjaGVkLCB1c2UgdGhpcyBhcyB0aGUgZmFsbGJhY2tcbiAgLy8kdXJsUm91dGVyUHJvdmlkZXIub3RoZXJ3aXNlKCcvdGFiL2NoYXRzJyk7XG4gICR1cmxSb3V0ZXJQcm92aWRlci5vdGhlcndpc2UoJy9zaWdudXAnKTsgLy8gVE9ETzogUmljaGFyZCB0ZXN0aW5nIHRoaXMgcm91dGVcbiAgLy8kdXJsUm91dGVyUHJvdmlkZXIub3RoZXJ3aXNlKCcvdGFiL2NoYWxsZW5nZScpOyAvL1RPRE86IFRvbnkgdGVzdGluZyB0aGlzIHJvdXRlXG59KTsiLCJhcHAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKXtcblx0Ly8gRWFjaCB0YWIgaGFzIGl0cyBvd24gbmF2IGhpc3Rvcnkgc3RhY2s6XG5cdCRzdGF0ZVByb3ZpZGVyLnN0YXRlKCd0YWIuYWNjb3VudCcsIHtcblx0XHR1cmw6ICcvYWNjb3VudCcsXG5cdCAgICB2aWV3czoge1xuXHQgICAgXHQndGFiLWFjY291bnQnOiB7XG5cdCAgICBcdFx0dGVtcGxhdGVVcmw6ICdmZWF0dXJlcy9hY2NvdW50L2FjY291bnQuaHRtbCcsXG5cdFx0XHRcdGNvbnRyb2xsZXI6ICdBY2NvdW50Q3RybCdcblx0XHRcdH1cblx0ICAgIH1cblx0fSk7XG59KTtcblxuYXBwLmNvbnRyb2xsZXIoJ0FjY291bnRDdHJsJywgZnVuY3Rpb24oJHNjb3BlKSB7XG5cdCRzY29wZS5zZXR0aW5ncyA9IHtcblx0XHRlbmFibGVGcmllbmRzOiB0cnVlXG5cdH07XG59KTsiLCJhcHAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKXtcblx0JHN0YXRlUHJvdmlkZXIuc3RhdGUoJ3RhYi5jaGFsbGVuZ2UnLCB7XG5cdFx0dXJsOiAnL2NoYWxsZW5nZScsXG5cdFx0dmlld3M6IHtcblx0XHRcdCd0YWItY2hhbGxlbmdlJyA6IHtcblx0XHRcdFx0dGVtcGxhdGVVcmw6ICdmZWF0dXJlcy9jaGFsbGVuZ2UvY2hhbGxlbmdlLmh0bWwnLFxuXHRcdFx0XHRjb250cm9sbGVyOiAnQ2hhbGxlbmdlQ3RybCdcblx0XHRcdH1cblx0XHR9LFxuXHRcdHJlc29sdmUgOiB7XG5cdFx0XHRjaGFsbGVuZ2UgOiBmdW5jdGlvbihDaGFsbGVuZ2VGYWN0b3J5LCAkc3RhdGUpe1xuXHRcdFx0XHRyZXR1cm4gQ2hhbGxlbmdlRmFjdG9yeS5nZXRDaGFsbGVuZ2UoKS5jYXRjaChmdW5jdGlvbihlcnIpe1xuXHRcdFx0XHRcdCRzdGF0ZS5nbygndGFiLmFjY291bnQnKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9KTtcbn0pO1xuXG5hcHAuY29udHJvbGxlcignQ2hhbGxlbmdlQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgQ2hhbGxlbmdlRmFjdG9yeSwgY2hhbGxlbmdlLCAkc3RhdGUpe1xuXHQkc2NvcGUuYnV0dG9ucyA9IHtcblx0XHRzdWJtaXQgOiAnU3VibWl0Jyxcblx0XHR0ZXN0IDogJ1Rlc3QnLFxuXHRcdGRpc21pc3MgOiAnRGlzbWlzcydcblx0fTtcblxuXHQkc2NvcGUuY2hhbGxlbmdlID0gY2hhbGxlbmdlO1xuXG5cdCRzY29wZS5zdWJtaXRDaGFsbGVuZ2UgPSBmdW5jdGlvbigpe1xuXHRcdCRzdGF0ZS5nbygndGFiLmNoYWxsZW5nZS1zdWJtaXQnKTtcblx0XHRDaGFsbGVuZ2VGYWN0b3J5LnN1Ym1pdENoYWxsZW5nZSgpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuXG5cdFx0XHRyZXR1cm4gcmVzcG9uc2UuZGF0YTtcblx0XHR9KS5jYXRjaChmdW5jdGlvbihlcnIpe1xuXHRcdFx0Y29uc29sZS5lcnJvcihKU09OLnN0cmluZ2lmeShlcnIpKTtcblx0XHR9KTtcblx0fTtcblxuXHQkc2NvcGUudGVzdENoYWxsZW5nZSA9IGZ1bmN0aW9uKCl7XG5cdFx0Q2hhbGxlbmdlRmFjdG9yeS50ZXN0Q2hhbGxlbmdlKCkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG5cdFx0XHRyZXR1cm4gcmVzcG9uc2UuZGF0YTtcblx0XHR9KS5jYXRjaChmdW5jdGlvbihlcnIpe1xuXHRcdFx0Y29uc29sZS5lcnJvcihKU09OLnN0cmluZ2lmeShlcnIpKTtcblx0XHR9KTtcblx0fTtcblxufSk7XG5cbmFwcC5mYWN0b3J5KCdDaGFsbGVuZ2VGYWN0b3J5JywgZnVuY3Rpb24oJGh0dHAsIEFwaUVuZHBvaW50KXtcblx0cmV0dXJuIHtcblx0XHRnZXRDaGFsbGVuZ2UgOiBmdW5jdGlvbigpe1xuXHRcdFx0cmV0dXJuICRodHRwLmdldChBcGlFbmRwb2ludC51cmwgKyAnL2NoYWxsZW5nZScpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuXHRcdFx0XHRyZXR1cm4gcmVzcG9uc2UuZGF0YTtcblx0XHRcdH0pO1xuXHRcdH0sXG5cdFx0c3VibWl0Q2hhbGxlbmdlIDogZnVuY3Rpb24oKXtcblx0XHRcdHJldHVybiAkaHR0cC5wb3N0KEFwaUVuZHBvaW50LnVybCArICcvY2hhbGxlbmdlL3N1Ym1pdCcpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuXHRcdFx0XHRyZXR1cm4gcmVzcG9uc2UuZGF0YTtcblx0XHRcdH0pO1xuXHRcdH0sXG5cdFx0dGVzdENoYWxsZW5nZSA6IGZ1bmN0aW9uKCl7XG5cdFx0XHRyZXR1cm4gJGh0dHAucG9zdChBcGlFbmRwb2ludC51cmwgKyAnL2NoYWxsZW5nZS90ZXN0LycpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuXHRcdFx0XHRyZXR1cm4gcmVzcG9uc2UuZGF0YTtcblx0XHRcdH0pO1xuXHRcdH1cblx0fTtcbn0pOyIsIiIsImFwcC5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIpe1xuXHQkc3RhdGVQcm92aWRlci5zdGF0ZSgndGFiLmNoYWxsZW5nZS1zdWJtaXQnLCB7XG5cdFx0dXJsIDogJy9jaGFsbGVuZ2Uvc3VibWl0Jyxcblx0XHR2aWV3czoge1xuXHRcdFx0J3RhYi1jaGFsbGVuZ2UnIDoge1xuXHRcdFx0XHR0ZW1wbGF0ZVVybCA6ICdmZWF0dXJlcy9jaGFsbGVuZ2Utc3VibWl0L2NoYWxsZW5nZS1zdWJtaXQuaHRtbCcsXG5cdFx0XHRcdGNvbnRyb2xsZXIgOiAnQ2hhbGxlbmdlU3VibWl0Q3RybCdcblx0XHRcdH1cblx0XHR9XG5cdH0pO1xufSk7XG5cbmFwcC5jb250cm9sbGVyKCdDaGFsbGVuZ2VTdWJtaXRDdHJsJywgZnVuY3Rpb24oJHNjb3BlKXtcblxuXHQkc2NvcGUuYWNlTG9hZGVkID0gZnVuY3Rpb24oX2VkaXRvcil7XG5cdFx0Y29uc29sZS5sb2coX2VkaXRvcik7XG5cdH07XG5cblx0JHNjb3BlLmFjZUNoYW5nZWQgPSBmdW5jdGlvbihlKXtcblx0XHRjb25zb2xlLmxvZyhlKTtcblx0fTtcblxuXHQkc2NvcGUudHh0ID0gJyc7XG5cblx0JHNjb3BlLmFjZUNvbmZpZyA9IHtcblx0XHR1c2VXcmFwTW9kZSA6IHRydWUsXG5cdFx0c2hvd0d1dHRlciA6IHRydWUsXG5cdFx0dGhlbWU6ICdtb25va2FpJyxcblx0XHRtb2RlOiAnamF2YXNjcmlwdCcsXG5cdFx0b25Mb2FkOiAkc2NvcGUuYWNlTG9hZGVkLFxuXHRcdG9uQ2hhbmdlIDogJHNjb3BlLmFjZUNoYW5nZWRcblx0fTtcblx0Ly90ZXh0IG5lZWRzIHRvIGJlIHdvcmtlZCBvblxuXG5cdGNvbnNvbGUubG9nKCd0aGlzIGlzIGxvYWRlZCcpO1xufSk7IiwiIiwiYXBwLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlcil7XG5cbiAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ3RhYi5jaGF0cycsIHtcbiAgICAgIHVybDogJy9jaGF0cycsXG4gICAgICB2aWV3czoge1xuICAgICAgICAndGFiLWNoYXRzJzoge1xuICAgICAgICAgIHRlbXBsYXRlVXJsOiAnZmVhdHVyZXMvY2hhdHMvdGFiLWNoYXRzLmh0bWwnLFxuICAgICAgICAgIGNvbnRyb2xsZXI6ICdDaGF0c0N0cmwnXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KVxuICAgIC5zdGF0ZSgndGFiLmNoYXQtZGV0YWlsJywge1xuICAgICAgdXJsOiAnL2NoYXRzLzpjaGF0SWQnLFxuICAgICAgdmlld3M6IHtcbiAgICAgICAgJ3RhYi1jaGF0cyc6IHtcbiAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2ZlYXR1cmVzL2NoYXRzL2NoYXQtZGV0YWlsLmh0bWwnLFxuICAgICAgICAgIGNvbnRyb2xsZXI6ICdDaGF0RGV0YWlsQ3RybCdcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xufSk7XG5cbmFwcC5jb250cm9sbGVyKCdDaGF0c0N0cmwnLCBmdW5jdGlvbigkc2NvcGUsIENoYXRzKSB7XG4gICRzY29wZS5jaGF0cyA9IENoYXRzLmFsbCgpO1xuICAkc2NvcGUucmVtb3ZlID0gZnVuY3Rpb24oY2hhdCkge1xuICAgIENoYXRzLnJlbW92ZShjaGF0KTtcbiAgfTtcbn0pO1xuXG5hcHAuY29udHJvbGxlcignQ2hhdERldGFpbEN0cmwnLCBmdW5jdGlvbigkc2NvcGUsICRzdGF0ZVBhcmFtcywgQ2hhdHMpIHtcbiAgJHNjb3BlLmNoYXQgPSBDaGF0cy5nZXQoJHN0YXRlUGFyYW1zLmNoYXRJZCk7XG59KTtcblxuYXBwLmZhY3RvcnkoJ0NoYXRzJywgZnVuY3Rpb24oKSB7XG4gIC8vIE1pZ2h0IHVzZSBhIHJlc291cmNlIGhlcmUgdGhhdCByZXR1cm5zIGEgSlNPTiBhcnJheVxuXG4gIC8vIFNvbWUgZmFrZSB0ZXN0aW5nIGRhdGFcbiAgdmFyIGNoYXRzID0gW3tcbiAgICBpZDogMCxcbiAgICBuYW1lOiAnQmVuIFNwYXJyb3cnLFxuICAgIGxhc3RUZXh0OiAnWW91IG9uIHlvdXIgd2F5PycsXG4gICAgZmFjZTogJ2h0dHBzOi8vcGJzLnR3aW1nLmNvbS9wcm9maWxlX2ltYWdlcy81MTQ1NDk4MTE3NjUyMTExMzYvOVNnQXVIZVkucG5nJ1xuICB9LCB7XG4gICAgaWQ6IDEsXG4gICAgbmFtZTogJ01heCBMeW54JyxcbiAgICBsYXN0VGV4dDogJ0hleSwgaXRcXCdzIG5vdCBtZScsXG4gICAgZmFjZTogJ2h0dHBzOi8vYXZhdGFyczMuZ2l0aHVidXNlcmNvbnRlbnQuY29tL3UvMTEyMTQ/dj0zJnM9NDYwJ1xuICB9LHtcbiAgICBpZDogMixcbiAgICBuYW1lOiAnQWRhbSBCcmFkbGV5c29uJyxcbiAgICBsYXN0VGV4dDogJ0kgc2hvdWxkIGJ1eSBhIGJvYXQnLFxuICAgIGZhY2U6ICdodHRwczovL3Bicy50d2ltZy5jb20vcHJvZmlsZV9pbWFnZXMvNDc5MDkwNzk0MDU4Mzc5MjY0Lzg0VEtqX3FhLmpwZWcnXG4gIH0sIHtcbiAgICBpZDogMyxcbiAgICBuYW1lOiAnUGVycnkgR292ZXJub3InLFxuICAgIGxhc3RUZXh0OiAnTG9vayBhdCBteSBtdWtsdWtzIScsXG4gICAgZmFjZTogJ2h0dHBzOi8vcGJzLnR3aW1nLmNvbS9wcm9maWxlX2ltYWdlcy80OTE5OTUzOTgxMzU3NjcwNDAvaWUyWl9WNmUuanBlZydcbiAgfSwge1xuICAgIGlkOiA0LFxuICAgIG5hbWU6ICdNaWtlIEhhcnJpbmd0b24nLFxuICAgIGxhc3RUZXh0OiAnVGhpcyBpcyB3aWNrZWQgZ29vZCBpY2UgY3JlYW0uJyxcbiAgICBmYWNlOiAnaHR0cHM6Ly9wYnMudHdpbWcuY29tL3Byb2ZpbGVfaW1hZ2VzLzU3ODIzNzI4MTM4NDg0MTIxNi9SM2FlMW42MS5wbmcnXG4gIH1dO1xuXG4gIHJldHVybiB7XG4gICAgYWxsOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBjaGF0cztcbiAgICB9LFxuICAgIHJlbW92ZTogZnVuY3Rpb24oY2hhdCkge1xuICAgICAgY2hhdHMuc3BsaWNlKGNoYXRzLmluZGV4T2YoY2hhdCksIDEpO1xuICAgIH0sXG4gICAgZ2V0OiBmdW5jdGlvbihjaGF0SWQpIHtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2hhdHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKGNoYXRzW2ldLmlkID09PSBwYXJzZUludChjaGF0SWQpKSB7XG4gICAgICAgICAgcmV0dXJuIGNoYXRzW2ldO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gIH07XG59KTtcbiIsImFwcC5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIpe1xuXHQkc3RhdGVQcm92aWRlci5zdGF0ZSgnbG9naW4nLCB7XG5cdFx0dXJsIDogJy9sb2dpbicsXG5cdFx0dGVtcGxhdGVVcmwgOiAnZmVhdHVyZXMvbG9naW4vbG9naW4uaHRtbCcsXG5cdFx0Y29udHJvbGxlciA6ICdMb2dpbkN0cmwnXG5cdH0pO1xufSk7XG5cbmFwcC5jb250cm9sbGVyKCdMb2dpbkN0cmwnLCBmdW5jdGlvbigkc2NvcGUpe1xuXHQkc2NvcGUuYWNjb3VudCA9IGZ1bmN0aW9uKCl7XG5cblx0fTtcbn0pO1xuXG4vL2FwcC5jb250cm9sbGVyKCdMb2dpbkN0cmwnLCBmdW5jdGlvbiAoJHNjb3BlLCBBdXRoU2VydmljZSwgJHN0YXRlKSB7XG4vL1xuLy9cdCRzY29wZS5sb2dpbiA9IHt9O1xuLy9cdCRzY29wZS5lcnJvciA9IG51bGw7XG4vL1xuLy9cdCRzY29wZS5zZW5kTG9naW4gPSBmdW5jdGlvbiAobG9naW5JbmZvKSB7XG4vL1xuLy9cdFx0JHNjb3BlLmVycm9yID0gbnVsbDtcbi8vXG4vL1x0XHRBdXRoU2VydmljZS5sb2dpbihsb2dpbkluZm8pLnRoZW4oZnVuY3Rpb24gKCkge1xuLy9cdFx0XHQkc3RhdGUuZ28oJ2hvbWUnKTtcbi8vXHRcdH0pLmNhdGNoKGZ1bmN0aW9uICgpIHtcbi8vXHRcdFx0JHNjb3BlLmVycm9yID0gJ0ludmFsaWQgbG9naW4gY3JlZGVudGlhbHMuJztcbi8vXHRcdH0pO1xuLy9cbi8vXHR9O1xuLy9cbi8vfSk7IiwiYXBwLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlcil7XG4gICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ3NpZ251cCcse1xuICAgICAgICB1cmw6XCIvc2lnbnVwXCIsXG4gICAgICAgIHRlbXBsYXRlVXJsOiBcImZlYXR1cmVzL3NpZ251cC9zaWdudXAuaHRtbFwiLFxuICAgICAgICBjb250cm9sbGVyOiAnU2lnblVwQ3RybCdcbiAgICB9KTtcbn0pO1xuXG5hcHAuY29udHJvbGxlcignU2lnblVwQ3RybCcsZnVuY3Rpb24oJGh0dHAsICRzY29wZSwgJHN0YXRlLCBTaWduVXBGYWN0b3J5LCBBdXRoU2VydmljZSl7XG4gICAgJHNjb3BlLmRhdGEgPSB7fTtcbiAgICAkc2NvcGUuZXJyb3IgPSBudWxsO1xuXG4gICAgJHNjb3BlLnNpZ251cCA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIFNpZ25VcEZhY3RvcnlcbiAgICAgICAgICAgIC5wb3N0U2lnbnVwKCRzY29wZS5kYXRhKVxuICAgICAgICAgICAgLnRoZW4oQXV0aFNlcnZpY2Uuc2lnbmVkVXApXG4gICAgICAgICAgICAudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2dvdG8gdGFiLWNoYWxsZW5nZS1zdWJtaXQnLEpTT04uc3RyaW5naWZ5KHJlc3BvbnNlKSk7XG4gICAgICAgICAgICAgICAgLy8kaHR0cC5nZXQoQXBpRW5kcG9pbnQudXJsK1wiL1wiKTtcbiAgICAgICAgICAgICAgICAvL0lORk86IFNlc3Npb24gaXMgc3RvcmVkIGFzIGEgY29va2llIG9uIHRoZSBicm93c2VyXG4gICAgICAgICAgICAgICAgLy9UT0RPOiBBZGQgcm91dGUgZGlzcGxheSBzZXNzaW9uIGRhdGFcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAvL3N0b3JlIGRhdGEgaW4gc2Vzc2lvblxuICAgICAgICAgICAgLy8kc3RhdGUuZ28oJ3RhYi5jaGFsbGVuZ2Utc3VibWl0Jyk7IC8vVE9ETzogQWRkIFJvdXRlIGJhY2ssIHJlbW92ZWQgZm9yIHRlc3RpbmdcbiAgICAgICAgICAgIC5jYXRjaChmdW5jdGlvbihlcnIpe1xuICAgICAgICAgICAgJHNjb3BlLmVycm9yID0gJ0xvZ2luIEludmFsaWQnO1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihKU09OLnN0cmluZ2lmeShlcnIpKTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxufSk7XG5cbi8vVE9ETzogTkVYVCBIb3cgdG8gY2hlY2sgZm9yIHNlc3Npb24gZGF0YSBzdG9yZWQsIG9yIGlmIGl0IGlzIGJlaW5nIHNlbnQgYmFjaywgc29tZWhvdz9cblxuYXBwLmZhY3RvcnkoJ1NpZ25VcEZhY3RvcnknLGZ1bmN0aW9uKCRodHRwLCBBcGlFbmRwb2ludCl7XG4gICAgcmV0dXJue1xuICAgICAgICBwb3N0U2lnbnVwOiBmdW5jdGlvbih1c2VyZGF0YSl7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygncG9zdFNpZ251cCcsSlNPTi5zdHJpbmdpZnkodXNlcmRhdGEpKTtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5wb3N0KEFwaUVuZHBvaW50LnVybCtcIi91c2VyL3NpZ251cFwiLCB1c2VyZGF0YSk7XG4gICAgICAgIH1cbiAgICB9O1xufSk7XG5cbi8vVE9ETzogRm9ybSBWYWxpZGF0aW9uXG5cbi8vTkVYVDogU2VuZGluZyBkYXRhIHRvIHRoZSBiYWNrLWVuZCBhbmQgc2V0dGluZyB1cCByb3V0ZXNcbi8vTW9uZ29vc2VcbiIsImFwcC5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIpe1xuXHQkc3RhdGVQcm92aWRlci5zdGF0ZSgnd2VsY29tZScsIHtcblx0XHR1cmwgOiAnL3dlbGNvbWUnLFxuXHRcdHRlbXBsYXRlVXJsIDogJ2ZlYXR1cmVzL3dlbGNvbWUvd2VsY29tZS5odG1sJyxcblx0XHRjb250cm9sbGVyIDogJ1dlbGNvbWVDdHJsJ1xuXHR9KTtcbn0pO1xuXG5hcHAuY29udHJvbGxlcignV2VsY29tZUN0cmwnLCBmdW5jdGlvbigkc2NvcGUsICRzdGF0ZSl7XG5cdCRzY29wZS5sb2dpbiA9IGZ1bmN0aW9uKCl7XG5cdFx0JHN0YXRlLmdvKCdsb2dpbicpO1xuXHR9O1xuXHQkc2NvcGUuc2lnbnVwID0gZnVuY3Rpb24oKXtcblx0XHQkc3RhdGUuZ28oJ3NpZ251cCcpO1xuXHR9O1xufSk7IiwiKGZ1bmN0aW9uICgpIHtcblxuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIC8vIEhvcGUgeW91IGRpZG4ndCBmb3JnZXQgQW5ndWxhciEgRHVoLWRveS5cbiAgICBpZiAoIXdpbmRvdy5hbmd1bGFyKSB0aHJvdyBuZXcgRXJyb3IoJ0kgY2FuXFwndCBmaW5kIEFuZ3VsYXIhJyk7XG5cbiAgICAvL3ZhciBhcHAgPSBhbmd1bGFyLm1vZHVsZSgnZnNhUHJlQnVpbHQnLCBbXSk7XG5cbiAgICAvL2FwcC5mYWN0b3J5KCdTb2NrZXQnLCBmdW5jdGlvbiAoJGxvY2F0aW9uKSB7XG4gICAgLy9cbiAgICAvLyAgICBpZiAoIXdpbmRvdy5pbykgdGhyb3cgbmV3IEVycm9yKCdzb2NrZXQuaW8gbm90IGZvdW5kIScpO1xuICAgIC8vXG4gICAgLy8gICAgdmFyIHNvY2tldDtcbiAgICAvL1xuICAgIC8vICAgIGlmICgkbG9jYXRpb24uJCRwb3J0KSB7XG4gICAgLy8gICAgICAgIHNvY2tldCA9IGlvKCdodHRwOi8vbG9jYWxob3N0OjEzMzcnKTtcbiAgICAvLyAgICB9IGVsc2Uge1xuICAgIC8vICAgICAgICBzb2NrZXQgPSBpbygnLycpO1xuICAgIC8vICAgIH1cbiAgICAvL1xuICAgIC8vICAgIHJldHVybiBzb2NrZXQ7XG4gICAgLy9cbiAgICAvL30pO1xuXG4gICAgLy8gQVVUSF9FVkVOVFMgaXMgdXNlZCB0aHJvdWdob3V0IG91ciBhcHAgdG9cbiAgICAvLyBicm9hZGNhc3QgYW5kIGxpc3RlbiBmcm9tIGFuZCB0byB0aGUgJHJvb3RTY29wZVxuICAgIC8vIGZvciBpbXBvcnRhbnQgZXZlbnRzIGFib3V0IGF1dGhlbnRpY2F0aW9uIGZsb3cuXG4gICAgYXBwLmNvbnN0YW50KCdBVVRIX0VWRU5UUycsIHtcbiAgICAgICAgbG9naW5TdWNjZXNzOiAnYXV0aC1sb2dpbi1zdWNjZXNzJyxcbiAgICAgICAgbG9naW5GYWlsZWQ6ICdhdXRoLWxvZ2luLWZhaWxlZCcsXG4gICAgICAgIGxvZ291dFN1Y2Nlc3M6ICdhdXRoLWxvZ291dC1zdWNjZXNzJyxcbiAgICAgICAgc2Vzc2lvblRpbWVvdXQ6ICdhdXRoLXNlc3Npb24tdGltZW91dCcsXG4gICAgICAgIG5vdEF1dGhlbnRpY2F0ZWQ6ICdhdXRoLW5vdC1hdXRoZW50aWNhdGVkJyxcbiAgICAgICAgbm90QXV0aG9yaXplZDogJ2F1dGgtbm90LWF1dGhvcml6ZWQnXG4gICAgfSk7XG5cbiAgICBhcHAuZmFjdG9yeSgnQXV0aEludGVyY2VwdG9yJywgZnVuY3Rpb24gKCRyb290U2NvcGUsICRxLCBBVVRIX0VWRU5UUykge1xuICAgICAgICB2YXIgc3RhdHVzRGljdCA9IHtcbiAgICAgICAgICAgIDQwMTogQVVUSF9FVkVOVFMubm90QXV0aGVudGljYXRlZCxcbiAgICAgICAgICAgIDQwMzogQVVUSF9FVkVOVFMubm90QXV0aG9yaXplZCxcbiAgICAgICAgICAgIDQxOTogQVVUSF9FVkVOVFMuc2Vzc2lvblRpbWVvdXQsXG4gICAgICAgICAgICA0NDA6IEFVVEhfRVZFTlRTLnNlc3Npb25UaW1lb3V0XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICByZXNwb25zZUVycm9yOiBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3Qoc3RhdHVzRGljdFtyZXNwb25zZS5zdGF0dXNdLCByZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuICRxLnJlamVjdChyZXNwb25zZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfSk7XG5cbiAgICBhcHAuY29uZmlnKGZ1bmN0aW9uICgkaHR0cFByb3ZpZGVyKSB7XG4gICAgICAgICRodHRwUHJvdmlkZXIuaW50ZXJjZXB0b3JzLnB1c2goW1xuICAgICAgICAgICAgJyRpbmplY3RvcicsXG4gICAgICAgICAgICBmdW5jdGlvbiAoJGluamVjdG9yKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICRpbmplY3Rvci5nZXQoJ0F1dGhJbnRlcmNlcHRvcicpO1xuICAgICAgICAgICAgfVxuICAgICAgICBdKTtcbiAgICB9KTtcblxuICAgIGFwcC5zZXJ2aWNlKCdBdXRoU2VydmljZScsIGZ1bmN0aW9uICgkaHR0cCwgU2Vzc2lvbiwgJHJvb3RTY29wZSwgQVVUSF9FVkVOVFMsICRxKSB7XG5cbiAgICAgICAgLy8gVXNlcyB0aGUgc2Vzc2lvbiBmYWN0b3J5IHRvIHNlZSBpZiBhblxuICAgICAgICAvLyBhdXRoZW50aWNhdGVkIHVzZXIgaXMgY3VycmVudGx5IHJlZ2lzdGVyZWQuXG4gICAgICAgIHRoaXMuaXNBdXRoZW50aWNhdGVkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuICEhU2Vzc2lvbi51c2VyO1xuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuaXNBZG1pbiA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIFNlc3Npb24udXNlci5hY2NvdW50VHlwZSA9PT0gXCJhZG1pblwiICYmIHRoaXMuaXNBdXRoZW50aWNhdGVkKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5nZXRMb2dnZWRJblVzZXIgPSBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgIC8vIElmIGFuIGF1dGhlbnRpY2F0ZWQgc2Vzc2lvbiBleGlzdHMsIHdlXG4gICAgICAgICAgICAvLyByZXR1cm4gdGhlIHVzZXIgYXR0YWNoZWQgdG8gdGhhdCBzZXNzaW9uXG4gICAgICAgICAgICAvLyB3aXRoIGEgcHJvbWlzZS4gVGhpcyBlbnN1cmVzIHRoYXQgd2UgY2FuXG4gICAgICAgICAgICAvLyBhbHdheXMgaW50ZXJmYWNlIHdpdGggdGhpcyBtZXRob2QgYXN5bmNocm9ub3VzbHkuXG4gICAgICAgICAgICBpZiAodGhpcy5pc0F1dGhlbnRpY2F0ZWQoKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiAkcS53aGVuKFNlc3Npb24udXNlcik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIE1ha2UgcmVxdWVzdCBHRVQgL3Nlc3Npb24uXG4gICAgICAgICAgICAvLyBJZiBpdCByZXR1cm5zIGEgdXNlciwgY2FsbCBvblN1Y2Nlc3NmdWxMb2dpbiB3aXRoIHRoZSByZXNwb25zZS5cbiAgICAgICAgICAgIC8vIElmIGl0IHJldHVybnMgYSA0MDEgcmVzcG9uc2UsIHdlIGNhdGNoIGl0IGFuZCBpbnN0ZWFkIHJlc29sdmUgdG8gbnVsbC5cbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoJy9zZXNzaW9uJykudGhlbihvblN1Y2Nlc3NmdWxMb2dpbikuY2F0Y2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLmxvZ2luID0gZnVuY3Rpb24gKGNyZWRlbnRpYWxzKSB7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAucG9zdCgnL2xvZ2luJywgY3JlZGVudGlhbHMpXG4gICAgICAgICAgICAgICAgLnRoZW4ob25TdWNjZXNzZnVsTG9naW4pXG4gICAgICAgICAgICAgICAgLmNhdGNoKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJHEucmVqZWN0KHsgbWVzc2FnZTogJ0ludmFsaWQgbG9naW4gY3JlZGVudGlhbHMuJyB9KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLmxvZ291dCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoJy9sb2dvdXQnKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBTZXNzaW9uLmRlc3Ryb3koKTtcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoQVVUSF9FVkVOVFMubG9nb3V0U3VjY2Vzcyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLnNpZ25lZFVwID0gZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ3NpZ25lZFVwLCBTZXNzaW9uIGNhbGwnLCBKU09OLnN0cmluZ2lmeShyZXNwb25zZSkpO1xuICAgICAgICAgICAgcmV0dXJuIG9uU3VjY2Vzc2Z1bExvZ2luKHJlc3BvbnNlKTtcbiAgICAgICAgfTtcblxuICAgICAgICBmdW5jdGlvbiBvblN1Y2Nlc3NmdWxMb2dpbihyZXNwb25zZSkge1xuICAgICAgICAgICAgdmFyIGRhdGEgPSByZXNwb25zZS5kYXRhO1xuICAgICAgICAgICAgLy9cImRhdGFcIjp7XCJ1c2VyXCI6e1widXNlck5hbWVcIjpcIjFcIixcImVtYWlsXCI6XCIxXCIsXCJpZFwiOlwiNTU0ZTdjNDk2Njk4Mzk0MGQzNTEyNmQ0XCJ9fSxcbiAgICAgICAgICAgIFNlc3Npb24uY3JlYXRlKGRhdGEuaWQsIGRhdGEudXNlcik7XG4gICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoQVVUSF9FVkVOVFMubG9naW5TdWNjZXNzKTtcbiAgICAgICAgICAgIHJldHVybiBkYXRhLnVzZXI7XG4gICAgICAgIH1cblxuICAgIH0pO1xuXG4gICAgYXBwLnNlcnZpY2UoJ1Nlc3Npb24nLCBmdW5jdGlvbiAoJHJvb3RTY29wZSwgQVVUSF9FVkVOVFMpIHtcblxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgJHJvb3RTY29wZS4kb24oQVVUSF9FVkVOVFMubm90QXV0aGVudGljYXRlZCwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgc2VsZi5kZXN0cm95KCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgICRyb290U2NvcGUuJG9uKEFVVEhfRVZFTlRTLnNlc3Npb25UaW1lb3V0LCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBzZWxmLmRlc3Ryb3koKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5pZCA9IG51bGw7XG4gICAgICAgIHRoaXMudXNlciA9IG51bGw7XG5cbiAgICAgICAgdGhpcy5jcmVhdGUgPSBmdW5jdGlvbiAoc2Vzc2lvbklkLCB1c2VyKSB7XG4gICAgICAgICAgICB0aGlzLmlkID0gc2Vzc2lvbklkO1xuICAgICAgICAgICAgdGhpcy51c2VyID0gdXNlcjtcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLmRlc3Ryb3kgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzLmlkID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMudXNlciA9IG51bGw7XG4gICAgICAgIH07XG5cbiAgICB9KTtcblxufSkoKTsiLCJhcHAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKXtcblxuICBcdC8vIHNldHVwIGFuIGFic3RyYWN0IHN0YXRlIGZvciB0aGUgdGFicyBkaXJlY3RpdmVcbiAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgndGFiJywge1xuXHQgICAgdXJsOiBcIi90YWJcIixcblx0ICAgIGFic3RyYWN0OiB0cnVlLFxuXHQgICAgdGVtcGxhdGVVcmw6IFwiZmVhdHVyZXMvY29tbW9uL3RhYnMvdGFicy5odG1sXCJcblx0fSk7XG59KTsiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=