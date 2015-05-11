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
  // $urlRouterProvider.otherwise('/signup'); // TODO: Richard testing this route
  $urlRouterProvider.otherwise('/challenge/view'); //TODO: Tony testing this route
});

app.controller('MenuCtrl', function($scope, $ionicSideMenuDelegate, $state){
  $scope.states = [
    {
      name : 'Account',
      ref : 'account'
    },
    {
      name : 'Challenge',
      ref : 'challenge.view'
    },
    {
      name : 'Chats',
      ref: 'chats'
    }
  ];

  $scope.clickItem = function(stateRef){
    $ionicSideMenuDelegate.toggleLeft();
    $state.go(stateRef.toString());
  };

  $scope.toggleMenu = function(){
    $ionicSideMenuDelegate.toggleLeft();
  };
});
app.config(function($stateProvider){
	// Each tab has its own nav history stack:
	$stateProvider.state('account', {
		url: '/account',
	    templateUrl: 'features/account/account.html',
		controller: 'AccountCtrl'
	});
});

app.controller('AccountCtrl', function($scope) {
	$scope.settings = {
		enableFriends: true
	};
});
app.config(function($stateProvider){
	$stateProvider.state('challenge', {
		templateUrl : 'features/challenge/challenge.html',
		abstract : true
	});
});

app.factory('ChallengeFactory', function($http, ApiEndpoint){

	var problem = '';
	var submission ='';

	return {
		getChallenge : function(id){
			return $http.get(ApiEndpoint.url + '/challenge/' + id).then(function(response){
				problem = response.data;
				submission = '' || problem.session.setup;
				return response.data;
			});
		},
		submitSubmission : function(id, projectId, solutionId, code){
			submission = code;
			var submit = {
				code : code,
				projectId : projectId,
				solutionId : solutionId
			};
			console.log(code);
			return $http.post(ApiEndpoint.url + '/challenge/submit/' + id, submit).then(function(response){
				return response.data;
			});
		},
		testSubmission : function(id, projectId, solutionId, code){
			submission = code;
			var submit = {
				code : code,
				projectId : projectId,
				solutionId : solutionId
			};
			console.log(code);
			return $http.post(ApiEndpoint.url + '/challenge/attempt/' + id, submit).then(function(response){
				return response.data;
			});
		},
		getSubmission : function(){
			return submission;
		},
		getProblem : function(){
			return problem;
		}
	};
});
app.config(function($stateProvider){
	$stateProvider.state('challenge.code', {
		url : '/challenge/code',
		views: {
			'tab-code' : {
				templateUrl : 'features/challenge-code/challenge-code.html',
				controller : 'ChallengeCodeCtrl'
			}
		}
	});
});

app.controller('ChallengeCodeCtrl', function($scope,$state, ChallengeFactory){

	//Challenge Submit
	//text needs to be worked on
	$scope.text = ChallengeFactory.getSubmission();

	$scope.projectId = ChallengeFactory.getProblem().session.projectId;
	$scope.solutionId = ChallengeFactory.getProblem().session.solutionId;

	$scope.aceLoaded = function(_editor){
		_editor.setReadOnly(false);
	};

	$scope.aceChanged = function(e){
		// console.log(e);
	};

	$scope.buttons = {
		submit : 'Submit',
		test : 'Test',
		dismiss : 'Dismiss'
	};

	$scope.submitSubmission = function(projectId, solutionId, code){
		var id = 'A9QKk6SmRpDcriU-HMQr';
		ChallengeFactory.submitSubmission(id, projectId, solutionId, code).then(function(response){
			return response.data;
		}).catch(function(err){
			console.error(JSON.stringify(err));
		});
	};

	$scope.testSubmission = function(projectId, solutionId, code){
		var id = 'A9QKk6SmRpDcriU-HMQr';
		ChallengeFactory.testSubmission(id, projectId, solutionId, code).then(function(response){
			return response.data;
		}).catch(function(err){
			console.error(JSON.stringify(err));
		});
	};

	$scope.dismissChallenge = function(){
		var id = 'A9QKk6SmRpDcriU-HMQr';
		ChallengeFactory.getChallenge(id).then(function(data){
			$state.go('challenge.view');
		});
	};

});
app.config(function($stateProvider){
	$stateProvider.state('challenge.compile', {
		url : '/challenge/compile',
		views : {
			'tab-compile' : {
				templateUrl : 'features/challenge-compile/challenge-compile.html',
				controller: 'ChallengeCompileCtrl'
			}
		}
	});
});

app.controller('ChallengeCompileCtrl', function($scope, ChallengeFactory){

	$scope.results = (new Function("'use strict';" + ChallengeFactory.getSubmission()))();
});
app.config(function($stateProvider){
	$stateProvider.state('challenge.view', {
		url: '/challenge/view',
		views: {
			'tab-view' : {
				templateUrl: 'features/challenge-view/challenge-view.html',
				controller: 'ChallengeViewCtrl'
			}
		},
		resolve : {
			challenge : function(ChallengeFactory, $state){
				var id = 'A9QKk6SmRpDcriU-HMQr';
				return ChallengeFactory.getChallenge(id)
									.catch(function(err){
										$state.go('account');
									});
			}
		}
	});
});

app.controller('ChallengeViewCtrl', function($scope, ChallengeFactory, challenge, $state, $ionicSlideBoxDelegate){
	//Controls Slide
	$scope.slideHasChallenged = function(index){
		$ionicSlideBoxDelegate.slide(index);
	};

	//Challenge View
	$scope.challenge = ChallengeFactory.getProblem();
});
app.config(function($stateProvider){

  $stateProvider.state('chats', {
      url: '/chats',
      templateUrl: 'features/chats/tab-chats.html',
      controller: 'ChatsCtrl'
    })
    .state('chat-detail', {
      url: '/chats/:chatId',
      templateUrl: 'features/chats/chat-detail.html',
      controller: 'ChatDetailCtrl'
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
app.filter('marked', function($sce){
	// marked.setOptions({
	// 	renderer: new marked.Renderer(),
	// 	gfm: true,
	// 	tables: true,
	// 	breaks: true,
	// 	pedantic: false,
	// 	sanitize: true,
	// 	smartLists: true,
	// 	smartypants: false
	// });
	return function(text){
		return $sce.trustAsHtml(marked(text));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImFjY291bnQvYWNjb3VudC5qcyIsImNoYWxsZW5nZS9jaGFsbGVuZ2UuanMiLCJjaGFsbGVuZ2UtY29kZS9jaGFsbGVuZ2UtY29kZS5qcyIsImNoYWxsZW5nZS1jb21waWxlL2NoYWxsZW5nZS1jb21waWxlLmpzIiwiY2hhbGxlbmdlLXZpZXcvY2hhbGxlbmdlLXZpZXcuanMiLCJjaGF0cy9jaGF0cy5qcyIsImxvZ2luL2xvZ2luLmpzIiwic2lnbnVwL3NpZ251cC5qcyIsIndlbGNvbWUvd2VsY29tZS5qcyIsImNvbW1vbi9maWx0ZXJzL21hcmtlZC5qcyIsImNvbW1vbi9BdXRoZW50aWNhdGlvbi9hdXRoZW50aWNhdGlvbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMvQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gSW9uaWMgU3RhcnRlciBBcHBcblxuLy8gYW5ndWxhci5tb2R1bGUgaXMgYSBnbG9iYWwgcGxhY2UgZm9yIGNyZWF0aW5nLCByZWdpc3RlcmluZyBhbmQgcmV0cmlldmluZyBBbmd1bGFyIG1vZHVsZXNcbi8vICdzdGFydGVyJyBpcyB0aGUgbmFtZSBvZiB0aGlzIGFuZ3VsYXIgbW9kdWxlIGV4YW1wbGUgKGFsc28gc2V0IGluIGEgPGJvZHk+IGF0dHJpYnV0ZSBpbiBpbmRleC5odG1sKVxuLy8gdGhlIDJuZCBwYXJhbWV0ZXIgaXMgYW4gYXJyYXkgb2YgJ3JlcXVpcmVzJ1xuLy8gJ3N0YXJ0ZXIuc2VydmljZXMnIGlzIGZvdW5kIGluIHNlcnZpY2VzLmpzXG4vLyAnc3RhcnRlci5jb250cm9sbGVycycgaXMgZm91bmQgaW4gY29udHJvbGxlcnMuanNcbnZhciBhcHAgPSBhbmd1bGFyLm1vZHVsZSgnbWlkZScsIFsnaW9uaWMnLCAndWkuYWNlJ10pXG5cbi5ydW4oZnVuY3Rpb24oJGlvbmljUGxhdGZvcm0pIHtcbiAgJGlvbmljUGxhdGZvcm0ucmVhZHkoZnVuY3Rpb24oKSB7XG4gICAgLy8gSGlkZSB0aGUgYWNjZXNzb3J5IGJhciBieSBkZWZhdWx0IChyZW1vdmUgdGhpcyB0byBzaG93IHRoZSBhY2Nlc3NvcnkgYmFyIGFib3ZlIHRoZSBrZXlib2FyZFxuICAgIC8vIGZvciBmb3JtIGlucHV0cylcbiAgICBpZiAod2luZG93LmNvcmRvdmEgJiYgd2luZG93LmNvcmRvdmEucGx1Z2lucyAmJiB3aW5kb3cuY29yZG92YS5wbHVnaW5zLktleWJvYXJkKSB7XG4gICAgICBjb3Jkb3ZhLnBsdWdpbnMuS2V5Ym9hcmQuaGlkZUtleWJvYXJkQWNjZXNzb3J5QmFyKHRydWUpO1xuICAgIH1cbiAgICBpZiAod2luZG93LlN0YXR1c0Jhcikge1xuICAgICAgLy8gb3JnLmFwYWNoZS5jb3Jkb3ZhLnN0YXR1c2JhciByZXF1aXJlZFxuICAgICAgU3RhdHVzQmFyLnN0eWxlTGlnaHRDb250ZW50KCk7XG4gICAgfVxuICB9KTtcbn0pXG5cbi8vVE9ETzpUaGlzIGlzIG5lZWRlZCB0byBzZXQgdG8gYWNjZXNzIHRoZSBwcm94eSB1cmwgdGhhdCB3aWxsIHRoZW4gaW4gdGhlIGlvbmljLnByb2plY3QgZmlsZSByZWRpcmVjdCBpdCB0byB0aGUgY29ycmVjdCBVUkxcbi5jb25zdGFudCgnQXBpRW5kcG9pbnQnLCB7XG4gIHVybCA6ICcvYXBpJ1xufSlcblxuLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyKSB7XG5cbiAgLy8gSW9uaWMgdXNlcyBBbmd1bGFyVUkgUm91dGVyIHdoaWNoIHVzZXMgdGhlIGNvbmNlcHQgb2Ygc3RhdGVzXG4gIC8vIExlYXJuIG1vcmUgaGVyZTogaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXItdWkvdWktcm91dGVyXG4gIC8vIFNldCB1cCB0aGUgdmFyaW91cyBzdGF0ZXMgd2hpY2ggdGhlIGFwcCBjYW4gYmUgaW4uXG4gIC8vIEVhY2ggc3RhdGUncyBjb250cm9sbGVyIGNhbiBiZSBmb3VuZCBpbiBjb250cm9sbGVycy5qc1xuXG4gIC8vIGlmIG5vbmUgb2YgdGhlIGFib3ZlIHN0YXRlcyBhcmUgbWF0Y2hlZCwgdXNlIHRoaXMgYXMgdGhlIGZhbGxiYWNrXG4gIC8vJHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZSgnL3RhYi9jaGF0cycpO1xuICAvLyAkdXJsUm91dGVyUHJvdmlkZXIub3RoZXJ3aXNlKCcvc2lnbnVwJyk7IC8vIFRPRE86IFJpY2hhcmQgdGVzdGluZyB0aGlzIHJvdXRlXG4gICR1cmxSb3V0ZXJQcm92aWRlci5vdGhlcndpc2UoJy9jaGFsbGVuZ2UvdmlldycpOyAvL1RPRE86IFRvbnkgdGVzdGluZyB0aGlzIHJvdXRlXG59KTtcblxuYXBwLmNvbnRyb2xsZXIoJ01lbnVDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCAkaW9uaWNTaWRlTWVudURlbGVnYXRlLCAkc3RhdGUpe1xuICAkc2NvcGUuc3RhdGVzID0gW1xuICAgIHtcbiAgICAgIG5hbWUgOiAnQWNjb3VudCcsXG4gICAgICByZWYgOiAnYWNjb3VudCdcbiAgICB9LFxuICAgIHtcbiAgICAgIG5hbWUgOiAnQ2hhbGxlbmdlJyxcbiAgICAgIHJlZiA6ICdjaGFsbGVuZ2UudmlldydcbiAgICB9LFxuICAgIHtcbiAgICAgIG5hbWUgOiAnQ2hhdHMnLFxuICAgICAgcmVmOiAnY2hhdHMnXG4gICAgfVxuICBdO1xuXG4gICRzY29wZS5jbGlja0l0ZW0gPSBmdW5jdGlvbihzdGF0ZVJlZil7XG4gICAgJGlvbmljU2lkZU1lbnVEZWxlZ2F0ZS50b2dnbGVMZWZ0KCk7XG4gICAgJHN0YXRlLmdvKHN0YXRlUmVmLnRvU3RyaW5nKCkpO1xuICB9O1xuXG4gICRzY29wZS50b2dnbGVNZW51ID0gZnVuY3Rpb24oKXtcbiAgICAkaW9uaWNTaWRlTWVudURlbGVnYXRlLnRvZ2dsZUxlZnQoKTtcbiAgfTtcbn0pOyIsImFwcC5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIpe1xuXHQvLyBFYWNoIHRhYiBoYXMgaXRzIG93biBuYXYgaGlzdG9yeSBzdGFjazpcblx0JHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2FjY291bnQnLCB7XG5cdFx0dXJsOiAnL2FjY291bnQnLFxuXHQgICAgdGVtcGxhdGVVcmw6ICdmZWF0dXJlcy9hY2NvdW50L2FjY291bnQuaHRtbCcsXG5cdFx0Y29udHJvbGxlcjogJ0FjY291bnRDdHJsJ1xuXHR9KTtcbn0pO1xuXG5hcHAuY29udHJvbGxlcignQWNjb3VudEN0cmwnLCBmdW5jdGlvbigkc2NvcGUpIHtcblx0JHNjb3BlLnNldHRpbmdzID0ge1xuXHRcdGVuYWJsZUZyaWVuZHM6IHRydWVcblx0fTtcbn0pOyIsImFwcC5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIpe1xuXHQkc3RhdGVQcm92aWRlci5zdGF0ZSgnY2hhbGxlbmdlJywge1xuXHRcdHRlbXBsYXRlVXJsIDogJ2ZlYXR1cmVzL2NoYWxsZW5nZS9jaGFsbGVuZ2UuaHRtbCcsXG5cdFx0YWJzdHJhY3QgOiB0cnVlXG5cdH0pO1xufSk7XG5cbmFwcC5mYWN0b3J5KCdDaGFsbGVuZ2VGYWN0b3J5JywgZnVuY3Rpb24oJGh0dHAsIEFwaUVuZHBvaW50KXtcblxuXHR2YXIgcHJvYmxlbSA9ICcnO1xuXHR2YXIgc3VibWlzc2lvbiA9Jyc7XG5cblx0cmV0dXJuIHtcblx0XHRnZXRDaGFsbGVuZ2UgOiBmdW5jdGlvbihpZCl7XG5cdFx0XHRyZXR1cm4gJGh0dHAuZ2V0KEFwaUVuZHBvaW50LnVybCArICcvY2hhbGxlbmdlLycgKyBpZCkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG5cdFx0XHRcdHByb2JsZW0gPSByZXNwb25zZS5kYXRhO1xuXHRcdFx0XHRzdWJtaXNzaW9uID0gJycgfHwgcHJvYmxlbS5zZXNzaW9uLnNldHVwO1xuXHRcdFx0XHRyZXR1cm4gcmVzcG9uc2UuZGF0YTtcblx0XHRcdH0pO1xuXHRcdH0sXG5cdFx0c3VibWl0U3VibWlzc2lvbiA6IGZ1bmN0aW9uKGlkLCBwcm9qZWN0SWQsIHNvbHV0aW9uSWQsIGNvZGUpe1xuXHRcdFx0c3VibWlzc2lvbiA9IGNvZGU7XG5cdFx0XHR2YXIgc3VibWl0ID0ge1xuXHRcdFx0XHRjb2RlIDogY29kZSxcblx0XHRcdFx0cHJvamVjdElkIDogcHJvamVjdElkLFxuXHRcdFx0XHRzb2x1dGlvbklkIDogc29sdXRpb25JZFxuXHRcdFx0fTtcblx0XHRcdGNvbnNvbGUubG9nKGNvZGUpO1xuXHRcdFx0cmV0dXJuICRodHRwLnBvc3QoQXBpRW5kcG9pbnQudXJsICsgJy9jaGFsbGVuZ2Uvc3VibWl0LycgKyBpZCwgc3VibWl0KS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcblx0XHRcdFx0cmV0dXJuIHJlc3BvbnNlLmRhdGE7XG5cdFx0XHR9KTtcblx0XHR9LFxuXHRcdHRlc3RTdWJtaXNzaW9uIDogZnVuY3Rpb24oaWQsIHByb2plY3RJZCwgc29sdXRpb25JZCwgY29kZSl7XG5cdFx0XHRzdWJtaXNzaW9uID0gY29kZTtcblx0XHRcdHZhciBzdWJtaXQgPSB7XG5cdFx0XHRcdGNvZGUgOiBjb2RlLFxuXHRcdFx0XHRwcm9qZWN0SWQgOiBwcm9qZWN0SWQsXG5cdFx0XHRcdHNvbHV0aW9uSWQgOiBzb2x1dGlvbklkXG5cdFx0XHR9O1xuXHRcdFx0Y29uc29sZS5sb2coY29kZSk7XG5cdFx0XHRyZXR1cm4gJGh0dHAucG9zdChBcGlFbmRwb2ludC51cmwgKyAnL2NoYWxsZW5nZS9hdHRlbXB0LycgKyBpZCwgc3VibWl0KS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcblx0XHRcdFx0cmV0dXJuIHJlc3BvbnNlLmRhdGE7XG5cdFx0XHR9KTtcblx0XHR9LFxuXHRcdGdldFN1Ym1pc3Npb24gOiBmdW5jdGlvbigpe1xuXHRcdFx0cmV0dXJuIHN1Ym1pc3Npb247XG5cdFx0fSxcblx0XHRnZXRQcm9ibGVtIDogZnVuY3Rpb24oKXtcblx0XHRcdHJldHVybiBwcm9ibGVtO1xuXHRcdH1cblx0fTtcbn0pOyIsImFwcC5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIpe1xuXHQkc3RhdGVQcm92aWRlci5zdGF0ZSgnY2hhbGxlbmdlLmNvZGUnLCB7XG5cdFx0dXJsIDogJy9jaGFsbGVuZ2UvY29kZScsXG5cdFx0dmlld3M6IHtcblx0XHRcdCd0YWItY29kZScgOiB7XG5cdFx0XHRcdHRlbXBsYXRlVXJsIDogJ2ZlYXR1cmVzL2NoYWxsZW5nZS1jb2RlL2NoYWxsZW5nZS1jb2RlLmh0bWwnLFxuXHRcdFx0XHRjb250cm9sbGVyIDogJ0NoYWxsZW5nZUNvZGVDdHJsJ1xuXHRcdFx0fVxuXHRcdH1cblx0fSk7XG59KTtcblxuYXBwLmNvbnRyb2xsZXIoJ0NoYWxsZW5nZUNvZGVDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCRzdGF0ZSwgQ2hhbGxlbmdlRmFjdG9yeSl7XG5cblx0Ly9DaGFsbGVuZ2UgU3VibWl0XG5cdC8vdGV4dCBuZWVkcyB0byBiZSB3b3JrZWQgb25cblx0JHNjb3BlLnRleHQgPSBDaGFsbGVuZ2VGYWN0b3J5LmdldFN1Ym1pc3Npb24oKTtcblxuXHQkc2NvcGUucHJvamVjdElkID0gQ2hhbGxlbmdlRmFjdG9yeS5nZXRQcm9ibGVtKCkuc2Vzc2lvbi5wcm9qZWN0SWQ7XG5cdCRzY29wZS5zb2x1dGlvbklkID0gQ2hhbGxlbmdlRmFjdG9yeS5nZXRQcm9ibGVtKCkuc2Vzc2lvbi5zb2x1dGlvbklkO1xuXG5cdCRzY29wZS5hY2VMb2FkZWQgPSBmdW5jdGlvbihfZWRpdG9yKXtcblx0XHRfZWRpdG9yLnNldFJlYWRPbmx5KGZhbHNlKTtcblx0fTtcblxuXHQkc2NvcGUuYWNlQ2hhbmdlZCA9IGZ1bmN0aW9uKGUpe1xuXHRcdC8vIGNvbnNvbGUubG9nKGUpO1xuXHR9O1xuXG5cdCRzY29wZS5idXR0b25zID0ge1xuXHRcdHN1Ym1pdCA6ICdTdWJtaXQnLFxuXHRcdHRlc3QgOiAnVGVzdCcsXG5cdFx0ZGlzbWlzcyA6ICdEaXNtaXNzJ1xuXHR9O1xuXG5cdCRzY29wZS5zdWJtaXRTdWJtaXNzaW9uID0gZnVuY3Rpb24ocHJvamVjdElkLCBzb2x1dGlvbklkLCBjb2RlKXtcblx0XHR2YXIgaWQgPSAnQTlRS2s2U21ScERjcmlVLUhNUXInO1xuXHRcdENoYWxsZW5nZUZhY3Rvcnkuc3VibWl0U3VibWlzc2lvbihpZCwgcHJvamVjdElkLCBzb2x1dGlvbklkLCBjb2RlKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcblx0XHRcdHJldHVybiByZXNwb25zZS5kYXRhO1xuXHRcdH0pLmNhdGNoKGZ1bmN0aW9uKGVycil7XG5cdFx0XHRjb25zb2xlLmVycm9yKEpTT04uc3RyaW5naWZ5KGVycikpO1xuXHRcdH0pO1xuXHR9O1xuXG5cdCRzY29wZS50ZXN0U3VibWlzc2lvbiA9IGZ1bmN0aW9uKHByb2plY3RJZCwgc29sdXRpb25JZCwgY29kZSl7XG5cdFx0dmFyIGlkID0gJ0E5UUtrNlNtUnBEY3JpVS1ITVFyJztcblx0XHRDaGFsbGVuZ2VGYWN0b3J5LnRlc3RTdWJtaXNzaW9uKGlkLCBwcm9qZWN0SWQsIHNvbHV0aW9uSWQsIGNvZGUpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuXHRcdFx0cmV0dXJuIHJlc3BvbnNlLmRhdGE7XG5cdFx0fSkuY2F0Y2goZnVuY3Rpb24oZXJyKXtcblx0XHRcdGNvbnNvbGUuZXJyb3IoSlNPTi5zdHJpbmdpZnkoZXJyKSk7XG5cdFx0fSk7XG5cdH07XG5cblx0JHNjb3BlLmRpc21pc3NDaGFsbGVuZ2UgPSBmdW5jdGlvbigpe1xuXHRcdHZhciBpZCA9ICdBOVFLazZTbVJwRGNyaVUtSE1Rcic7XG5cdFx0Q2hhbGxlbmdlRmFjdG9yeS5nZXRDaGFsbGVuZ2UoaWQpLnRoZW4oZnVuY3Rpb24oZGF0YSl7XG5cdFx0XHQkc3RhdGUuZ28oJ2NoYWxsZW5nZS52aWV3Jyk7XG5cdFx0fSk7XG5cdH07XG5cbn0pOyIsImFwcC5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIpe1xuXHQkc3RhdGVQcm92aWRlci5zdGF0ZSgnY2hhbGxlbmdlLmNvbXBpbGUnLCB7XG5cdFx0dXJsIDogJy9jaGFsbGVuZ2UvY29tcGlsZScsXG5cdFx0dmlld3MgOiB7XG5cdFx0XHQndGFiLWNvbXBpbGUnIDoge1xuXHRcdFx0XHR0ZW1wbGF0ZVVybCA6ICdmZWF0dXJlcy9jaGFsbGVuZ2UtY29tcGlsZS9jaGFsbGVuZ2UtY29tcGlsZS5odG1sJyxcblx0XHRcdFx0Y29udHJvbGxlcjogJ0NoYWxsZW5nZUNvbXBpbGVDdHJsJ1xuXHRcdFx0fVxuXHRcdH1cblx0fSk7XG59KTtcblxuYXBwLmNvbnRyb2xsZXIoJ0NoYWxsZW5nZUNvbXBpbGVDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBDaGFsbGVuZ2VGYWN0b3J5KXtcblxuXHQkc2NvcGUucmVzdWx0cyA9IChuZXcgRnVuY3Rpb24oXCIndXNlIHN0cmljdCc7XCIgKyBDaGFsbGVuZ2VGYWN0b3J5LmdldFN1Ym1pc3Npb24oKSkpKCk7XG59KTsiLCJhcHAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKXtcblx0JHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2NoYWxsZW5nZS52aWV3Jywge1xuXHRcdHVybDogJy9jaGFsbGVuZ2UvdmlldycsXG5cdFx0dmlld3M6IHtcblx0XHRcdCd0YWItdmlldycgOiB7XG5cdFx0XHRcdHRlbXBsYXRlVXJsOiAnZmVhdHVyZXMvY2hhbGxlbmdlLXZpZXcvY2hhbGxlbmdlLXZpZXcuaHRtbCcsXG5cdFx0XHRcdGNvbnRyb2xsZXI6ICdDaGFsbGVuZ2VWaWV3Q3RybCdcblx0XHRcdH1cblx0XHR9LFxuXHRcdHJlc29sdmUgOiB7XG5cdFx0XHRjaGFsbGVuZ2UgOiBmdW5jdGlvbihDaGFsbGVuZ2VGYWN0b3J5LCAkc3RhdGUpe1xuXHRcdFx0XHR2YXIgaWQgPSAnQTlRS2s2U21ScERjcmlVLUhNUXInO1xuXHRcdFx0XHRyZXR1cm4gQ2hhbGxlbmdlRmFjdG9yeS5nZXRDaGFsbGVuZ2UoaWQpXG5cdFx0XHRcdFx0XHRcdFx0XHQuY2F0Y2goZnVuY3Rpb24oZXJyKXtcblx0XHRcdFx0XHRcdFx0XHRcdFx0JHN0YXRlLmdvKCdhY2NvdW50Jyk7XG5cdFx0XHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9XG5cdH0pO1xufSk7XG5cbmFwcC5jb250cm9sbGVyKCdDaGFsbGVuZ2VWaWV3Q3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgQ2hhbGxlbmdlRmFjdG9yeSwgY2hhbGxlbmdlLCAkc3RhdGUsICRpb25pY1NsaWRlQm94RGVsZWdhdGUpe1xuXHQvL0NvbnRyb2xzIFNsaWRlXG5cdCRzY29wZS5zbGlkZUhhc0NoYWxsZW5nZWQgPSBmdW5jdGlvbihpbmRleCl7XG5cdFx0JGlvbmljU2xpZGVCb3hEZWxlZ2F0ZS5zbGlkZShpbmRleCk7XG5cdH07XG5cblx0Ly9DaGFsbGVuZ2UgVmlld1xuXHQkc2NvcGUuY2hhbGxlbmdlID0gQ2hhbGxlbmdlRmFjdG9yeS5nZXRQcm9ibGVtKCk7XG59KTsiLCJhcHAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKXtcblxuICAkc3RhdGVQcm92aWRlci5zdGF0ZSgnY2hhdHMnLCB7XG4gICAgICB1cmw6ICcvY2hhdHMnLFxuICAgICAgdGVtcGxhdGVVcmw6ICdmZWF0dXJlcy9jaGF0cy90YWItY2hhdHMuaHRtbCcsXG4gICAgICBjb250cm9sbGVyOiAnQ2hhdHNDdHJsJ1xuICAgIH0pXG4gICAgLnN0YXRlKCdjaGF0LWRldGFpbCcsIHtcbiAgICAgIHVybDogJy9jaGF0cy86Y2hhdElkJyxcbiAgICAgIHRlbXBsYXRlVXJsOiAnZmVhdHVyZXMvY2hhdHMvY2hhdC1kZXRhaWwuaHRtbCcsXG4gICAgICBjb250cm9sbGVyOiAnQ2hhdERldGFpbEN0cmwnXG4gICAgfSk7XG59KTtcblxuYXBwLmNvbnRyb2xsZXIoJ0NoYXRzQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgQ2hhdHMpIHtcbiAgJHNjb3BlLmNoYXRzID0gQ2hhdHMuYWxsKCk7XG4gICRzY29wZS5yZW1vdmUgPSBmdW5jdGlvbihjaGF0KSB7XG4gICAgQ2hhdHMucmVtb3ZlKGNoYXQpO1xuICB9O1xufSk7XG5cbmFwcC5jb250cm9sbGVyKCdDaGF0RGV0YWlsQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgJHN0YXRlUGFyYW1zLCBDaGF0cykge1xuICAkc2NvcGUuY2hhdCA9IENoYXRzLmdldCgkc3RhdGVQYXJhbXMuY2hhdElkKTtcbn0pO1xuXG5hcHAuZmFjdG9yeSgnQ2hhdHMnLCBmdW5jdGlvbigpIHtcbiAgLy8gTWlnaHQgdXNlIGEgcmVzb3VyY2UgaGVyZSB0aGF0IHJldHVybnMgYSBKU09OIGFycmF5XG5cbiAgLy8gU29tZSBmYWtlIHRlc3RpbmcgZGF0YVxuICB2YXIgY2hhdHMgPSBbe1xuICAgIGlkOiAwLFxuICAgIG5hbWU6ICdCZW4gU3BhcnJvdycsXG4gICAgbGFzdFRleHQ6ICdZb3Ugb24geW91ciB3YXk/JyxcbiAgICBmYWNlOiAnaHR0cHM6Ly9wYnMudHdpbWcuY29tL3Byb2ZpbGVfaW1hZ2VzLzUxNDU0OTgxMTc2NTIxMTEzNi85U2dBdUhlWS5wbmcnXG4gIH0sIHtcbiAgICBpZDogMSxcbiAgICBuYW1lOiAnTWF4IEx5bngnLFxuICAgIGxhc3RUZXh0OiAnSGV5LCBpdFxcJ3Mgbm90IG1lJyxcbiAgICBmYWNlOiAnaHR0cHM6Ly9hdmF0YXJzMy5naXRodWJ1c2VyY29udGVudC5jb20vdS8xMTIxND92PTMmcz00NjAnXG4gIH0se1xuICAgIGlkOiAyLFxuICAgIG5hbWU6ICdBZGFtIEJyYWRsZXlzb24nLFxuICAgIGxhc3RUZXh0OiAnSSBzaG91bGQgYnV5IGEgYm9hdCcsXG4gICAgZmFjZTogJ2h0dHBzOi8vcGJzLnR3aW1nLmNvbS9wcm9maWxlX2ltYWdlcy80NzkwOTA3OTQwNTgzNzkyNjQvODRUS2pfcWEuanBlZydcbiAgfSwge1xuICAgIGlkOiAzLFxuICAgIG5hbWU6ICdQZXJyeSBHb3Zlcm5vcicsXG4gICAgbGFzdFRleHQ6ICdMb29rIGF0IG15IG11a2x1a3MhJyxcbiAgICBmYWNlOiAnaHR0cHM6Ly9wYnMudHdpbWcuY29tL3Byb2ZpbGVfaW1hZ2VzLzQ5MTk5NTM5ODEzNTc2NzA0MC9pZTJaX1Y2ZS5qcGVnJ1xuICB9LCB7XG4gICAgaWQ6IDQsXG4gICAgbmFtZTogJ01pa2UgSGFycmluZ3RvbicsXG4gICAgbGFzdFRleHQ6ICdUaGlzIGlzIHdpY2tlZCBnb29kIGljZSBjcmVhbS4nLFxuICAgIGZhY2U6ICdodHRwczovL3Bicy50d2ltZy5jb20vcHJvZmlsZV9pbWFnZXMvNTc4MjM3MjgxMzg0ODQxMjE2L1IzYWUxbjYxLnBuZydcbiAgfV07XG5cbiAgcmV0dXJuIHtcbiAgICBhbGw6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGNoYXRzO1xuICAgIH0sXG4gICAgcmVtb3ZlOiBmdW5jdGlvbihjaGF0KSB7XG4gICAgICBjaGF0cy5zcGxpY2UoY2hhdHMuaW5kZXhPZihjaGF0KSwgMSk7XG4gICAgfSxcbiAgICBnZXQ6IGZ1bmN0aW9uKGNoYXRJZCkge1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaGF0cy5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoY2hhdHNbaV0uaWQgPT09IHBhcnNlSW50KGNoYXRJZCkpIHtcbiAgICAgICAgICByZXR1cm4gY2hhdHNbaV07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgfTtcbn0pO1xuIiwiYXBwLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlcil7XG5cdCRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdsb2dpbicsIHtcblx0XHR1cmwgOiAnL2xvZ2luJyxcblx0XHR0ZW1wbGF0ZVVybCA6ICdmZWF0dXJlcy9sb2dpbi9sb2dpbi5odG1sJyxcblx0XHRjb250cm9sbGVyIDogJ0xvZ2luQ3RybCdcblx0fSk7XG59KTtcblxuYXBwLmNvbnRyb2xsZXIoJ0xvZ2luQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSl7XG5cdCRzY29wZS5hY2NvdW50ID0gZnVuY3Rpb24oKXtcblxuXHR9O1xufSk7XG5cbi8vYXBwLmNvbnRyb2xsZXIoJ0xvZ2luQ3RybCcsIGZ1bmN0aW9uICgkc2NvcGUsIEF1dGhTZXJ2aWNlLCAkc3RhdGUpIHtcbi8vXG4vL1x0JHNjb3BlLmxvZ2luID0ge307XG4vL1x0JHNjb3BlLmVycm9yID0gbnVsbDtcbi8vXG4vL1x0JHNjb3BlLnNlbmRMb2dpbiA9IGZ1bmN0aW9uIChsb2dpbkluZm8pIHtcbi8vXG4vL1x0XHQkc2NvcGUuZXJyb3IgPSBudWxsO1xuLy9cbi8vXHRcdEF1dGhTZXJ2aWNlLmxvZ2luKGxvZ2luSW5mbykudGhlbihmdW5jdGlvbiAoKSB7XG4vL1x0XHRcdCRzdGF0ZS5nbygnaG9tZScpO1xuLy9cdFx0fSkuY2F0Y2goZnVuY3Rpb24gKCkge1xuLy9cdFx0XHQkc2NvcGUuZXJyb3IgPSAnSW52YWxpZCBsb2dpbiBjcmVkZW50aWFscy4nO1xuLy9cdFx0fSk7XG4vL1xuLy9cdH07XG4vL1xuLy99KTsiLCJhcHAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKXtcbiAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgnc2lnbnVwJyx7XG4gICAgICAgIHVybDpcIi9zaWdudXBcIixcbiAgICAgICAgdGVtcGxhdGVVcmw6IFwiZmVhdHVyZXMvc2lnbnVwL3NpZ251cC5odG1sXCIsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdTaWduVXBDdHJsJ1xuICAgIH0pO1xufSk7XG5cbmFwcC5jb250cm9sbGVyKCdTaWduVXBDdHJsJyxmdW5jdGlvbigkaHR0cCwgJHNjb3BlLCAkc3RhdGUsIFNpZ25VcEZhY3RvcnksIEF1dGhTZXJ2aWNlKXtcbiAgICAkc2NvcGUuZGF0YSA9IHt9O1xuICAgICRzY29wZS5lcnJvciA9IG51bGw7XG5cbiAgICAkc2NvcGUuc2lnbnVwID0gZnVuY3Rpb24oKXtcbiAgICAgICAgU2lnblVwRmFjdG9yeVxuICAgICAgICAgICAgLnBvc3RTaWdudXAoJHNjb3BlLmRhdGEpXG4gICAgICAgICAgICAudGhlbihBdXRoU2VydmljZS5zaWduZWRVcClcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnZ290byB0YWItY2hhbGxlbmdlLXN1Ym1pdCcsSlNPTi5zdHJpbmdpZnkocmVzcG9uc2UpKTtcbiAgICAgICAgICAgICAgICAvLyRodHRwLmdldChBcGlFbmRwb2ludC51cmwrXCIvXCIpO1xuICAgICAgICAgICAgICAgIC8vSU5GTzogU2Vzc2lvbiBpcyBzdG9yZWQgYXMgYSBjb29raWUgb24gdGhlIGJyb3dzZXJcbiAgICAgICAgICAgICAgICAvL1RPRE86IEFkZCByb3V0ZSBkaXNwbGF5IHNlc3Npb24gZGF0YVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC8vc3RvcmUgZGF0YSBpbiBzZXNzaW9uXG4gICAgICAgICAgICAvLyRzdGF0ZS5nbygndGFiLmNoYWxsZW5nZS1zdWJtaXQnKTsgLy9UT0RPOiBBZGQgUm91dGUgYmFjaywgcmVtb3ZlZCBmb3IgdGVzdGluZ1xuICAgICAgICAgICAgLmNhdGNoKGZ1bmN0aW9uKGVycil7XG4gICAgICAgICAgICAkc2NvcGUuZXJyb3IgPSAnTG9naW4gSW52YWxpZCc7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKEpTT04uc3RyaW5naWZ5KGVycikpO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG59KTtcblxuLy9UT0RPOiBORVhUIEhvdyB0byBjaGVjayBmb3Igc2Vzc2lvbiBkYXRhIHN0b3JlZCwgb3IgaWYgaXQgaXMgYmVpbmcgc2VudCBiYWNrLCBzb21laG93P1xuXG5hcHAuZmFjdG9yeSgnU2lnblVwRmFjdG9yeScsZnVuY3Rpb24oJGh0dHAsIEFwaUVuZHBvaW50KXtcbiAgICByZXR1cm57XG4gICAgICAgIHBvc3RTaWdudXA6IGZ1bmN0aW9uKHVzZXJkYXRhKXtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdwb3N0U2lnbnVwJyxKU09OLnN0cmluZ2lmeSh1c2VyZGF0YSkpO1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoQXBpRW5kcG9pbnQudXJsK1wiL3VzZXIvc2lnbnVwXCIsIHVzZXJkYXRhKTtcbiAgICAgICAgfVxuICAgIH07XG59KTtcblxuLy9UT0RPOiBGb3JtIFZhbGlkYXRpb25cblxuLy9ORVhUOiBTZW5kaW5nIGRhdGEgdG8gdGhlIGJhY2stZW5kIGFuZCBzZXR0aW5nIHVwIHJvdXRlc1xuLy9Nb25nb29zZVxuIiwiYXBwLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlcil7XG5cdCRzdGF0ZVByb3ZpZGVyLnN0YXRlKCd3ZWxjb21lJywge1xuXHRcdHVybCA6ICcvd2VsY29tZScsXG5cdFx0dGVtcGxhdGVVcmwgOiAnZmVhdHVyZXMvd2VsY29tZS93ZWxjb21lLmh0bWwnLFxuXHRcdGNvbnRyb2xsZXIgOiAnV2VsY29tZUN0cmwnXG5cdH0pO1xufSk7XG5cbmFwcC5jb250cm9sbGVyKCdXZWxjb21lQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgJHN0YXRlKXtcblx0JHNjb3BlLmxvZ2luID0gZnVuY3Rpb24oKXtcblx0XHQkc3RhdGUuZ28oJ2xvZ2luJyk7XG5cdH07XG5cdCRzY29wZS5zaWdudXAgPSBmdW5jdGlvbigpe1xuXHRcdCRzdGF0ZS5nbygnc2lnbnVwJyk7XG5cdH07XG59KTsiLCJhcHAuZmlsdGVyKCdtYXJrZWQnLCBmdW5jdGlvbigkc2NlKXtcblx0Ly8gbWFya2VkLnNldE9wdGlvbnMoe1xuXHQvLyBcdHJlbmRlcmVyOiBuZXcgbWFya2VkLlJlbmRlcmVyKCksXG5cdC8vIFx0Z2ZtOiB0cnVlLFxuXHQvLyBcdHRhYmxlczogdHJ1ZSxcblx0Ly8gXHRicmVha3M6IHRydWUsXG5cdC8vIFx0cGVkYW50aWM6IGZhbHNlLFxuXHQvLyBcdHNhbml0aXplOiB0cnVlLFxuXHQvLyBcdHNtYXJ0TGlzdHM6IHRydWUsXG5cdC8vIFx0c21hcnR5cGFudHM6IGZhbHNlXG5cdC8vIH0pO1xuXHRyZXR1cm4gZnVuY3Rpb24odGV4dCl7XG5cdFx0cmV0dXJuICRzY2UudHJ1c3RBc0h0bWwobWFya2VkKHRleHQpKTtcblx0fTtcbn0pOyIsIihmdW5jdGlvbiAoKSB7XG5cbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICAvLyBIb3BlIHlvdSBkaWRuJ3QgZm9yZ2V0IEFuZ3VsYXIhIER1aC1kb3kuXG4gICAgaWYgKCF3aW5kb3cuYW5ndWxhcikgdGhyb3cgbmV3IEVycm9yKCdJIGNhblxcJ3QgZmluZCBBbmd1bGFyIScpO1xuXG4gICAgLy92YXIgYXBwID0gYW5ndWxhci5tb2R1bGUoJ2ZzYVByZUJ1aWx0JywgW10pO1xuXG4gICAgLy9hcHAuZmFjdG9yeSgnU29ja2V0JywgZnVuY3Rpb24gKCRsb2NhdGlvbikge1xuICAgIC8vXG4gICAgLy8gICAgaWYgKCF3aW5kb3cuaW8pIHRocm93IG5ldyBFcnJvcignc29ja2V0LmlvIG5vdCBmb3VuZCEnKTtcbiAgICAvL1xuICAgIC8vICAgIHZhciBzb2NrZXQ7XG4gICAgLy9cbiAgICAvLyAgICBpZiAoJGxvY2F0aW9uLiQkcG9ydCkge1xuICAgIC8vICAgICAgICBzb2NrZXQgPSBpbygnaHR0cDovL2xvY2FsaG9zdDoxMzM3Jyk7XG4gICAgLy8gICAgfSBlbHNlIHtcbiAgICAvLyAgICAgICAgc29ja2V0ID0gaW8oJy8nKTtcbiAgICAvLyAgICB9XG4gICAgLy9cbiAgICAvLyAgICByZXR1cm4gc29ja2V0O1xuICAgIC8vXG4gICAgLy99KTtcblxuICAgIC8vIEFVVEhfRVZFTlRTIGlzIHVzZWQgdGhyb3VnaG91dCBvdXIgYXBwIHRvXG4gICAgLy8gYnJvYWRjYXN0IGFuZCBsaXN0ZW4gZnJvbSBhbmQgdG8gdGhlICRyb290U2NvcGVcbiAgICAvLyBmb3IgaW1wb3J0YW50IGV2ZW50cyBhYm91dCBhdXRoZW50aWNhdGlvbiBmbG93LlxuICAgIGFwcC5jb25zdGFudCgnQVVUSF9FVkVOVFMnLCB7XG4gICAgICAgIGxvZ2luU3VjY2VzczogJ2F1dGgtbG9naW4tc3VjY2VzcycsXG4gICAgICAgIGxvZ2luRmFpbGVkOiAnYXV0aC1sb2dpbi1mYWlsZWQnLFxuICAgICAgICBsb2dvdXRTdWNjZXNzOiAnYXV0aC1sb2dvdXQtc3VjY2VzcycsXG4gICAgICAgIHNlc3Npb25UaW1lb3V0OiAnYXV0aC1zZXNzaW9uLXRpbWVvdXQnLFxuICAgICAgICBub3RBdXRoZW50aWNhdGVkOiAnYXV0aC1ub3QtYXV0aGVudGljYXRlZCcsXG4gICAgICAgIG5vdEF1dGhvcml6ZWQ6ICdhdXRoLW5vdC1hdXRob3JpemVkJ1xuICAgIH0pO1xuXG4gICAgYXBwLmZhY3RvcnkoJ0F1dGhJbnRlcmNlcHRvcicsIGZ1bmN0aW9uICgkcm9vdFNjb3BlLCAkcSwgQVVUSF9FVkVOVFMpIHtcbiAgICAgICAgdmFyIHN0YXR1c0RpY3QgPSB7XG4gICAgICAgICAgICA0MDE6IEFVVEhfRVZFTlRTLm5vdEF1dGhlbnRpY2F0ZWQsXG4gICAgICAgICAgICA0MDM6IEFVVEhfRVZFTlRTLm5vdEF1dGhvcml6ZWQsXG4gICAgICAgICAgICA0MTk6IEFVVEhfRVZFTlRTLnNlc3Npb25UaW1lb3V0LFxuICAgICAgICAgICAgNDQwOiBBVVRIX0VWRU5UUy5zZXNzaW9uVGltZW91dFxuICAgICAgICB9O1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcmVzcG9uc2VFcnJvcjogZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KHN0YXR1c0RpY3RbcmVzcG9uc2Uuc3RhdHVzXSwgcmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgIHJldHVybiAkcS5yZWplY3QocmVzcG9uc2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH0pO1xuXG4gICAgYXBwLmNvbmZpZyhmdW5jdGlvbiAoJGh0dHBQcm92aWRlcikge1xuICAgICAgICAkaHR0cFByb3ZpZGVyLmludGVyY2VwdG9ycy5wdXNoKFtcbiAgICAgICAgICAgICckaW5qZWN0b3InLFxuICAgICAgICAgICAgZnVuY3Rpb24gKCRpbmplY3Rvcikge1xuICAgICAgICAgICAgICAgIHJldHVybiAkaW5qZWN0b3IuZ2V0KCdBdXRoSW50ZXJjZXB0b3InKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgXSk7XG4gICAgfSk7XG5cbiAgICBhcHAuc2VydmljZSgnQXV0aFNlcnZpY2UnLCBmdW5jdGlvbiAoJGh0dHAsIFNlc3Npb24sICRyb290U2NvcGUsIEFVVEhfRVZFTlRTLCAkcSkge1xuXG4gICAgICAgIC8vIFVzZXMgdGhlIHNlc3Npb24gZmFjdG9yeSB0byBzZWUgaWYgYW5cbiAgICAgICAgLy8gYXV0aGVudGljYXRlZCB1c2VyIGlzIGN1cnJlbnRseSByZWdpc3RlcmVkLlxuICAgICAgICB0aGlzLmlzQXV0aGVudGljYXRlZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiAhIVNlc3Npb24udXNlcjtcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLmlzQWRtaW4gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiBTZXNzaW9uLnVzZXIuYWNjb3VudFR5cGUgPT09IFwiYWRtaW5cIiAmJiB0aGlzLmlzQXV0aGVudGljYXRlZCgpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuZ2V0TG9nZ2VkSW5Vc2VyID0gZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICAgICAvLyBJZiBhbiBhdXRoZW50aWNhdGVkIHNlc3Npb24gZXhpc3RzLCB3ZVxuICAgICAgICAgICAgLy8gcmV0dXJuIHRoZSB1c2VyIGF0dGFjaGVkIHRvIHRoYXQgc2Vzc2lvblxuICAgICAgICAgICAgLy8gd2l0aCBhIHByb21pc2UuIFRoaXMgZW5zdXJlcyB0aGF0IHdlIGNhblxuICAgICAgICAgICAgLy8gYWx3YXlzIGludGVyZmFjZSB3aXRoIHRoaXMgbWV0aG9kIGFzeW5jaHJvbm91c2x5LlxuICAgICAgICAgICAgaWYgKHRoaXMuaXNBdXRoZW50aWNhdGVkKCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gJHEud2hlbihTZXNzaW9uLnVzZXIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBNYWtlIHJlcXVlc3QgR0VUIC9zZXNzaW9uLlxuICAgICAgICAgICAgLy8gSWYgaXQgcmV0dXJucyBhIHVzZXIsIGNhbGwgb25TdWNjZXNzZnVsTG9naW4gd2l0aCB0aGUgcmVzcG9uc2UuXG4gICAgICAgICAgICAvLyBJZiBpdCByZXR1cm5zIGEgNDAxIHJlc3BvbnNlLCB3ZSBjYXRjaCBpdCBhbmQgaW5zdGVhZCByZXNvbHZlIHRvIG51bGwuXG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCcvc2Vzc2lvbicpLnRoZW4ob25TdWNjZXNzZnVsTG9naW4pLmNhdGNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5sb2dpbiA9IGZ1bmN0aW9uIChjcmVkZW50aWFscykge1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoJy9sb2dpbicsIGNyZWRlbnRpYWxzKVxuICAgICAgICAgICAgICAgIC50aGVuKG9uU3VjY2Vzc2Z1bExvZ2luKVxuICAgICAgICAgICAgICAgIC5jYXRjaChmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICRxLnJlamVjdCh7IG1lc3NhZ2U6ICdJbnZhbGlkIGxvZ2luIGNyZWRlbnRpYWxzLicgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5sb2dvdXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCcvbG9nb3V0JykudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgU2Vzc2lvbi5kZXN0cm95KCk7XG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KEFVVEhfRVZFTlRTLmxvZ291dFN1Y2Nlc3MpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5zaWduZWRVcCA9IGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdzaWduZWRVcCwgU2Vzc2lvbiBjYWxsJywgSlNPTi5zdHJpbmdpZnkocmVzcG9uc2UpKTtcbiAgICAgICAgICAgIHJldHVybiBvblN1Y2Nlc3NmdWxMb2dpbihyZXNwb25zZSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgZnVuY3Rpb24gb25TdWNjZXNzZnVsTG9naW4ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIHZhciBkYXRhID0gcmVzcG9uc2UuZGF0YTtcbiAgICAgICAgICAgIC8vXCJkYXRhXCI6e1widXNlclwiOntcInVzZXJOYW1lXCI6XCIxXCIsXCJlbWFpbFwiOlwiMVwiLFwiaWRcIjpcIjU1NGU3YzQ5NjY5ODM5NDBkMzUxMjZkNFwifX0sXG4gICAgICAgICAgICBTZXNzaW9uLmNyZWF0ZShkYXRhLmlkLCBkYXRhLnVzZXIpO1xuICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KEFVVEhfRVZFTlRTLmxvZ2luU3VjY2Vzcyk7XG4gICAgICAgICAgICByZXR1cm4gZGF0YS51c2VyO1xuICAgICAgICB9XG5cbiAgICB9KTtcblxuICAgIGFwcC5zZXJ2aWNlKCdTZXNzaW9uJywgZnVuY3Rpb24gKCRyb290U2NvcGUsIEFVVEhfRVZFTlRTKSB7XG5cbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgICAgICRyb290U2NvcGUuJG9uKEFVVEhfRVZFTlRTLm5vdEF1dGhlbnRpY2F0ZWQsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHNlbGYuZGVzdHJveSgpO1xuICAgICAgICB9KTtcblxuICAgICAgICAkcm9vdFNjb3BlLiRvbihBVVRIX0VWRU5UUy5zZXNzaW9uVGltZW91dCwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgc2VsZi5kZXN0cm95KCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuaWQgPSBudWxsO1xuICAgICAgICB0aGlzLnVzZXIgPSBudWxsO1xuXG4gICAgICAgIHRoaXMuY3JlYXRlID0gZnVuY3Rpb24gKHNlc3Npb25JZCwgdXNlcikge1xuICAgICAgICAgICAgdGhpcy5pZCA9IHNlc3Npb25JZDtcbiAgICAgICAgICAgIHRoaXMudXNlciA9IHVzZXI7XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5kZXN0cm95ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhpcy5pZCA9IG51bGw7XG4gICAgICAgICAgICB0aGlzLnVzZXIgPSBudWxsO1xuICAgICAgICB9O1xuXG4gICAgfSk7XG5cbn0pKCk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9