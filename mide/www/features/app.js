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
  // $urlRouterProvider.otherwise('/challenge/view'); //TODO: Albert testing this route
  $urlRouterProvider.otherwise('/welcome'); // TODO: Richard testing this route
  //$urlRouterProvider.otherwise('/tab/challenge'); //TODO: Tony testing this route
  // $urlRouterProvider.otherwise('welcome');
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
  // $urlRouterProvider.otherwise('/signup'); // TODO: Richard testing this route
  //$urlRouterProvider.otherwise('/challenge/view'); //TODO: Tony testing this route
>>>>>>> development
});

app.config(function($stateProvider){
   $stateProvider.state('main', {
       templateUrl: 'features/common/main/main.html',
       controller: 'MenuCtrl'
   });
});

app.controller('MainCtrl', function($rootScope,$scope, $ionicSideMenuDelegate, $ionicPopup, $state, AuthService,AUTH_EVENTS){
    $scope.username = AuthService.username();
    //console.log(AuthService.isAuthenticated());
    //$scope.menu = false;

    $scope.$on(AUTH_EVENTS.notAuthorized, function(event) {
        var alertPopup = $ionicPopup.alert({
            title: 'Unauthorized!',
            template: 'You are not allowed to access this resource.'
        });
    });

    $scope.$on(AUTH_EVENTS.notAuthenticated, function(event) {
        AuthService.logout();
        $state.go('login');
        var alertPopup = $ionicPopup.alert({
            title: 'Session Lost!',
            template: 'Sorry, You have to login again.'
        });
    });

    $scope.setCurrentUsername = function(name) {
        $scope.username = name;
    };
    $scope.showMenu = function(){
        return true;
    }
});

app.controller('MenuCtrl', function($scope, $ionicSideMenuDelegate, $state){
    $scope.states = [
        {
          name : 'Account',
          ref : function(){return 'account';}
        },
        {
          name : 'Challenge',
          ref : function(){return 'challenge.view';}
        },
        {
          name : 'Chats',
          ref: function(){return 'chats';}
        }
    ];

    $scope.clickItem = function(stateRef){
        $ionicSideMenuDelegate.toggleLeft();
        $state.go(stateRef()); //RB: Updated to have stateRef as a function instead.
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

	var editor;

	$scope.projectId = ChallengeFactory.getProblem().session.projectId;
	$scope.solutionId = ChallengeFactory.getProblem().session.solutionId;

	$scope.aceLoaded = function(_editor){
		editor = _editor;
		editor.getSession().setUseWorker(false);

		editor.focus();

		editor.setReadOnly(false);
	};

	$scope.aceChanged = function(e){
		// console.log(e);
	};

	$scope.clickEditor = function() {
		editor.focus(); //bring editor to focus

		// cordova.plugins.Keyboard.show = function() {
		//     exec(null, null, "Keyboard", "show", []);
		// };

		console.log("is Keyboard vis?", cordova.plugins.Keyboard.isVisible);

		// cordova.plugins.Keyboard.show();
		// native.keyboardshow();
		// console.log("is Keyboard vis?", cordova.plugins.Keyboard);

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
	// Each tab has its own nav history stack:
	$stateProvider.state('error', {
		url: '/error',
	    templateUrl: 'features/error/error.html',
		controller: 'ErrorCtrl'
	});
});

app.controller('Error', function($scope) {
	
});
app.config(function($stateProvider){
	$stateProvider.state('login', {
		url : '/login',
		templateUrl : 'features/login/login.html',
		controller : 'LoginCtrl'
	});
});

app.controller('LoginCtrl', function($rootScope, $scope, $ionicPopup, $state, AuthService){
	//$scope.account = function(){
    //
	//};
	$scope.data = {};
	$scope.error = null;

	$scope.login = function(){
		AuthService
			.login($scope.data)
			.then(function(authenticated){ //TODO:authenticated is what is returned
				console.log('login, tab.challenge-submit');
				//$scope.menu = true;
				//$rootScope.$broadcast('showMenu');
				$scope.states.push({ //TODO: Need to add a parent controller to communicate
					name: 'Logout',
					ref: function(){
						AuthService.logout();
						$scope.states.pop(); //TODO: Find a better way to remove the Logout link, instead of pop
						$state.go('signup');
					}
				});
				$state.go('challenge.view');
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

//TODO: Cleanup commented code


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

    $scope.signup = function(){
        AuthService
            .signup($scope.data)
            .then(function(authenticated){
                console.log('signup, tab.challenge');
                //$rootScope.$broadcast('showMenu');
                $scope.states.push({ //TODO: Need to add a parent controller to communicate
                    name: 'Logout',
                    ref: function(){
                        AuthService.logout();
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
app.config(function($stateProvider){
	$stateProvider.state('welcome', {
		url : '/welcome',
		templateUrl : 'features/welcome/welcome.html',
		controller : 'WelcomeCtrl'
	});
});

app.controller('WelcomeCtrl', function($scope, $state, AuthService){
	//TODO: Splash page while you load resources (possible idea)
	$scope.login = function(){
		$state.go('login');
	};
	$scope.signup = function(){
		$state.go('signup');
	};

	//if (AuthService.isAuthenticated()) {
	//	$state.go('challenge.view');
	//} else {
	//	$state.go('signup');
	//}
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
        //console.log('addToken',token);
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
        console.log(token);
        if (token) {
            useCredentials(token);
        }
    }

    function storeUserCredentials(data) {
        AuthTokenFactory.setToken(data.token);
        useCredentials(data);
    }

    function useCredentials(data) {
        console.log('useCredentials token',data);
        username = data.username;
        isAuthenticated = true;
        authToken = data.token;
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
        console.log('login',JSON.stringify(userdata));
        return $q(function(resolve,reject){
            $http.post(ApiEndpoint.url+"/user/login", userdata)
                .then(function(response){
                    storeUserCredentials(response.data); //storeUserCredentials
                    //isAuthenticated = true;
                    resolve(response); //TODO: sent to authenticated
                });
        });
    };

    var signup = function(userdata){
        console.log('signup',JSON.stringify(userdata));
        return $q(function(resolve,reject){
            $http.post(ApiEndpoint.url+"/user/signup", userdata)
                .then(function(response){
                    storeUserCredentials(response.data); //storeUserCredentials
                    //isAuthenticated = true;
                    resolve(response); //TODO: sent to authenticated
                });
        });
    }

    loadUserCredentials();

    var isAuthorized = function(authenticated) {
        if (!angular.isArray(authenticated)) {
            authenticated = [authenticated];
        }
        return (isAuthenticated && authenticated.indexOf(USER_ROLES.public) !== -1);
    };

    return {
        login: login,
        signup: signup,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImFjY291bnQvYWNjb3VudC5qcyIsImNoYWxsZW5nZS9jaGFsbGVuZ2UuanMiLCJjaGFsbGVuZ2UtY29kZS9jaGFsbGVuZ2UtY29kZS5qcyIsImNoYWxsZW5nZS1jb21waWxlL2NoYWxsZW5nZS1jb21waWxlLmpzIiwiY2hhbGxlbmdlLXN1Ym1pdC9jaGFsbGVuZ2Utc3VibWl0LmpzIiwiY2hhbGxlbmdlLXZpZXcvY2hhbGxlbmdlLXZpZXcuanMiLCJjaGF0cy9jaGF0cy5qcyIsImVycm9yL2Vycm9yLmpzIiwibG9naW4vbG9naW4uanMiLCJzaWdudXAvc2lnbnVwLmpzIiwid2VsY29tZS93ZWxjb21lLmpzIiwiY29tbW9uL0F1dGhlbnRpY2F0aW9uL2F1dGhlbnRpY2F0aW9uLmpzIiwiY29tbW9uL2ZpbHRlcnMvbWFya2VkLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN0lBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3RDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBJb25pYyBTdGFydGVyIEFwcFxuXG4vLyBhbmd1bGFyLm1vZHVsZSBpcyBhIGdsb2JhbCBwbGFjZSBmb3IgY3JlYXRpbmcsIHJlZ2lzdGVyaW5nIGFuZCByZXRyaWV2aW5nIEFuZ3VsYXIgbW9kdWxlc1xuLy8gJ3N0YXJ0ZXInIGlzIHRoZSBuYW1lIG9mIHRoaXMgYW5ndWxhciBtb2R1bGUgZXhhbXBsZSAoYWxzbyBzZXQgaW4gYSA8Ym9keT4gYXR0cmlidXRlIGluIGluZGV4Lmh0bWwpXG4vLyB0aGUgMm5kIHBhcmFtZXRlciBpcyBhbiBhcnJheSBvZiAncmVxdWlyZXMnXG4vLyAnc3RhcnRlci5zZXJ2aWNlcycgaXMgZm91bmQgaW4gc2VydmljZXMuanNcbi8vICdzdGFydGVyLmNvbnRyb2xsZXJzJyBpcyBmb3VuZCBpbiBjb250cm9sbGVycy5qc1xudmFyIGFwcCA9IGFuZ3VsYXIubW9kdWxlKCdtaWRlJywgWydpb25pYycsICd1aS5hY2UnXSlcblxuLnJ1bihmdW5jdGlvbigkaW9uaWNQbGF0Zm9ybSkge1xuICAkaW9uaWNQbGF0Zm9ybS5yZWFkeShmdW5jdGlvbigpIHtcbiAgICAvLyBIaWRlIHRoZSBhY2Nlc3NvcnkgYmFyIGJ5IGRlZmF1bHQgKHJlbW92ZSB0aGlzIHRvIHNob3cgdGhlIGFjY2Vzc29yeSBiYXIgYWJvdmUgdGhlIGtleWJvYXJkXG4gICAgLy8gZm9yIGZvcm0gaW5wdXRzKVxuICAgIC8vICRsb2NhdGlvblByb3ZpZGVyLmh0bWw1TW9kZSh0cnVlKTtcbiAgICBpZiAod2luZG93LmNvcmRvdmEgJiYgd2luZG93LmNvcmRvdmEucGx1Z2lucyAmJiB3aW5kb3cuY29yZG92YS5wbHVnaW5zLktleWJvYXJkKSB7XG4gICAgICBjb3Jkb3ZhLnBsdWdpbnMuS2V5Ym9hcmQuaGlkZUtleWJvYXJkQWNjZXNzb3J5QmFyKHRydWUpO1xuICAgIH1cbiAgICBpZiAod2luZG93LlN0YXR1c0Jhcikge1xuICAgICAgLy8gb3JnLmFwYWNoZS5jb3Jkb3ZhLnN0YXR1c2JhciByZXF1aXJlZFxuICAgICAgU3RhdHVzQmFyLnN0eWxlTGlnaHRDb250ZW50KCk7XG4gICAgfVxuICB9KTtcbn0pXG5cbi8vVE9ETzpUaGlzIGlzIG5lZWRlZCB0byBzZXQgdG8gYWNjZXNzIHRoZSBwcm94eSB1cmwgdGhhdCB3aWxsIHRoZW4gaW4gdGhlIGlvbmljLnByb2plY3QgZmlsZSByZWRpcmVjdCBpdCB0byB0aGUgY29ycmVjdCBVUkxcbi5jb25zdGFudCgnQXBpRW5kcG9pbnQnLCB7XG4gIHVybCA6ICcvYXBpJyxcbiAgc2Vzc2lvbjogJy9zZXNzaW9uJ1xufSlcblxuLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyKSB7XG4gIC8vIElvbmljIHVzZXMgQW5ndWxhclVJIFJvdXRlciB3aGljaCB1c2VzIHRoZSBjb25jZXB0IG9mIHN0YXRlc1xuICAvLyBMZWFybiBtb3JlIGhlcmU6IGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyLXVpL3VpLXJvdXRlclxuICAvLyBTZXQgdXAgdGhlIHZhcmlvdXMgc3RhdGVzIHdoaWNoIHRoZSBhcHAgY2FuIGJlIGluLlxuICAvLyBFYWNoIHN0YXRlJ3MgY29udHJvbGxlciBjYW4gYmUgZm91bmQgaW4gY29udHJvbGxlcnMuanNcbiAgLy8gaWYgbm9uZSBvZiB0aGUgYWJvdmUgc3RhdGVzIGFyZSBtYXRjaGVkLCB1c2UgdGhpcyBhcyB0aGUgZmFsbGJhY2tcbiAgLy8kdXJsUm91dGVyUHJvdmlkZXIub3RoZXJ3aXNlKCcvdGFiL2NoYXRzJyk7XG4gIC8vICR1cmxSb3V0ZXJQcm92aWRlci5vdGhlcndpc2UoJy9jaGFsbGVuZ2UvdmlldycpOyAvL1RPRE86IEFsYmVydCB0ZXN0aW5nIHRoaXMgcm91dGVcbiAgJHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZSgnL3dlbGNvbWUnKTsgLy8gVE9ETzogUmljaGFyZCB0ZXN0aW5nIHRoaXMgcm91dGVcbiAgLy8kdXJsUm91dGVyUHJvdmlkZXIub3RoZXJ3aXNlKCcvdGFiL2NoYWxsZW5nZScpOyAvL1RPRE86IFRvbnkgdGVzdGluZyB0aGlzIHJvdXRlXG4gIC8vICR1cmxSb3V0ZXJQcm92aWRlci5vdGhlcndpc2UoJ3dlbGNvbWUnKTtcbn0pXG4vL1xuXG4vLy8vcnVuIGJsb2NrczogaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8yMDY2MzA3Ni9hbmd1bGFyanMtYXBwLXJ1bi1kb2N1bWVudGF0aW9uXG4vL1VzZSBydW4gbWV0aG9kIHRvIHJlZ2lzdGVyIHdvcmsgd2hpY2ggc2hvdWxkIGJlIHBlcmZvcm1lZCB3aGVuIHRoZSBpbmplY3RvciBpcyBkb25lIGxvYWRpbmcgYWxsIG1vZHVsZXMuXG4vL2h0dHA6Ly9kZXZkYWN0aWMuY29tL3VzZXItYXV0aC1hbmd1bGFyanMtaW9uaWMvXG5cbi5ydW4oZnVuY3Rpb24gKCRyb290U2NvcGUsICRzdGF0ZSwgQXV0aFNlcnZpY2UsIEFVVEhfRVZFTlRTKSB7XG5cbiAgICB2YXIgZGVzdGluYXRpb25TdGF0ZVJlcXVpcmVzQXV0aCA9IGZ1bmN0aW9uIChzdGF0ZSkge1xuICAgICAgICAvL2NvbnNvbGUubG9nKCdjbCAtIGRlc3RpbmF0aW9uU3RhdGVSZXF1aXJlc0F1dGgnLCdzdGF0ZS5kYXRhJyxzdGF0ZS5kYXRhLCdzdGF0ZS5kYXRhLmF1dGgnLHN0YXRlLmRhdGEuYXV0aGVudGljYXRlKTtcbiAgICAgICAgcmV0dXJuIHN0YXRlLmRhdGEgJiYgc3RhdGUuZGF0YS5hdXRoZW50aWNhdGU7XG4gICAgfTtcblxuICAgIC8vVE9ETzogTmVlZCB0byBtYWtlIGF1dGhlbnRpY2F0aW9uIG1vcmUgcm9idXN0IGJlbG93IGRvZXMgbm90IGZvbGxvdyBGU0cgKGV0LiBhbC4pXG4gICAgLy9UT0RPOiBDdXJyZW50bHkgaXQgaXMgbm90IGNoZWNraW5nIHRoZSBiYWNrZW5kIHJvdXRlIHJvdXRlci5nZXQoJy90b2tlbicpXG4gICAgJHJvb3RTY29wZS4kb24oJyRzdGF0ZUNoYW5nZVN0YXJ0JywgZnVuY3Rpb24gKGV2ZW50LHRvU3RhdGUsIHRvUGFyYW1zKSB7XG5cbiAgICAgICAgLy9jb25zb2xlLmxvZygndXNlciBBdXRoZW50aWNhdGVkJywgQXV0aFNlcnZpY2UuaXNBdXRoZW50aWNhdGVkKCkpO1xuXG4gICAgICAgIGlmICghZGVzdGluYXRpb25TdGF0ZVJlcXVpcmVzQXV0aCh0b1N0YXRlKSkge1xuICAgICAgICAgICAgLy8gVGhlIGRlc3RpbmF0aW9uIHN0YXRlIGRvZXMgbm90IHJlcXVpcmUgYXV0aGVudGljYXRpb25cbiAgICAgICAgICAgIC8vIFNob3J0IGNpcmN1aXQgd2l0aCByZXR1cm4uXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoQXV0aFNlcnZpY2UuaXNBdXRoZW50aWNhdGVkKCkpIHtcbiAgICAgICAgICAgIC8vIFRoZSB1c2VyIGlzIGF1dGhlbnRpY2F0ZWQuXG4gICAgICAgICAgICAvLyBTaG9ydCBjaXJjdWl0IHdpdGggcmV0dXJuLlxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy9UT0RPOiBOb3Qgc3VyZSBob3cgdG8gcHJvY2VlZCBoZXJlXG4gICAgICAgICRzdGF0ZS5nbygnbG9naW4nKTsgLy9pZiBhYm92ZSBmYWlscywgZ290byBsb2dpblxuICAgIH0pO1xuICAvLyAkdXJsUm91dGVyUHJvdmlkZXIub3RoZXJ3aXNlKCcvc2lnbnVwJyk7IC8vIFRPRE86IFJpY2hhcmQgdGVzdGluZyB0aGlzIHJvdXRlXG4gIC8vJHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZSgnL2NoYWxsZW5nZS92aWV3Jyk7IC8vVE9ETzogVG9ueSB0ZXN0aW5nIHRoaXMgcm91dGVcbj4+Pj4+Pj4gZGV2ZWxvcG1lbnRcbn0pO1xuXG5hcHAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKXtcbiAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdtYWluJywge1xuICAgICAgIHRlbXBsYXRlVXJsOiAnZmVhdHVyZXMvY29tbW9uL21haW4vbWFpbi5odG1sJyxcbiAgICAgICBjb250cm9sbGVyOiAnTWVudUN0cmwnXG4gICB9KTtcbn0pO1xuXG5hcHAuY29udHJvbGxlcignTWFpbkN0cmwnLCBmdW5jdGlvbigkcm9vdFNjb3BlLCRzY29wZSwgJGlvbmljU2lkZU1lbnVEZWxlZ2F0ZSwgJGlvbmljUG9wdXAsICRzdGF0ZSwgQXV0aFNlcnZpY2UsQVVUSF9FVkVOVFMpe1xuICAgICRzY29wZS51c2VybmFtZSA9IEF1dGhTZXJ2aWNlLnVzZXJuYW1lKCk7XG4gICAgLy9jb25zb2xlLmxvZyhBdXRoU2VydmljZS5pc0F1dGhlbnRpY2F0ZWQoKSk7XG4gICAgLy8kc2NvcGUubWVudSA9IGZhbHNlO1xuXG4gICAgJHNjb3BlLiRvbihBVVRIX0VWRU5UUy5ub3RBdXRob3JpemVkLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICB2YXIgYWxlcnRQb3B1cCA9ICRpb25pY1BvcHVwLmFsZXJ0KHtcbiAgICAgICAgICAgIHRpdGxlOiAnVW5hdXRob3JpemVkIScsXG4gICAgICAgICAgICB0ZW1wbGF0ZTogJ1lvdSBhcmUgbm90IGFsbG93ZWQgdG8gYWNjZXNzIHRoaXMgcmVzb3VyY2UuJ1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgICRzY29wZS4kb24oQVVUSF9FVkVOVFMubm90QXV0aGVudGljYXRlZCwgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgQXV0aFNlcnZpY2UubG9nb3V0KCk7XG4gICAgICAgICRzdGF0ZS5nbygnbG9naW4nKTtcbiAgICAgICAgdmFyIGFsZXJ0UG9wdXAgPSAkaW9uaWNQb3B1cC5hbGVydCh7XG4gICAgICAgICAgICB0aXRsZTogJ1Nlc3Npb24gTG9zdCEnLFxuICAgICAgICAgICAgdGVtcGxhdGU6ICdTb3JyeSwgWW91IGhhdmUgdG8gbG9naW4gYWdhaW4uJ1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgICRzY29wZS5zZXRDdXJyZW50VXNlcm5hbWUgPSBmdW5jdGlvbihuYW1lKSB7XG4gICAgICAgICRzY29wZS51c2VybmFtZSA9IG5hbWU7XG4gICAgfTtcbiAgICAkc2NvcGUuc2hvd01lbnUgPSBmdW5jdGlvbigpe1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG59KTtcblxuYXBwLmNvbnRyb2xsZXIoJ01lbnVDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCAkaW9uaWNTaWRlTWVudURlbGVnYXRlLCAkc3RhdGUpe1xuICAgICRzY29wZS5zdGF0ZXMgPSBbXG4gICAgICAgIHtcbiAgICAgICAgICBuYW1lIDogJ0FjY291bnQnLFxuICAgICAgICAgIHJlZiA6IGZ1bmN0aW9uKCl7cmV0dXJuICdhY2NvdW50Jzt9XG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBuYW1lIDogJ0NoYWxsZW5nZScsXG4gICAgICAgICAgcmVmIDogZnVuY3Rpb24oKXtyZXR1cm4gJ2NoYWxsZW5nZS52aWV3Jzt9XG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBuYW1lIDogJ0NoYXRzJyxcbiAgICAgICAgICByZWY6IGZ1bmN0aW9uKCl7cmV0dXJuICdjaGF0cyc7fVxuICAgICAgICB9XG4gICAgXTtcblxuICAgICRzY29wZS5jbGlja0l0ZW0gPSBmdW5jdGlvbihzdGF0ZVJlZil7XG4gICAgICAgICRpb25pY1NpZGVNZW51RGVsZWdhdGUudG9nZ2xlTGVmdCgpO1xuICAgICAgICAkc3RhdGUuZ28oc3RhdGVSZWYoKSk7IC8vUkI6IFVwZGF0ZWQgdG8gaGF2ZSBzdGF0ZVJlZiBhcyBhIGZ1bmN0aW9uIGluc3RlYWQuXG4gICAgfTtcblxuICAgICRzY29wZS50b2dnbGVNZW51ID0gZnVuY3Rpb24oKXtcbiAgICAgICAgJGlvbmljU2lkZU1lbnVEZWxlZ2F0ZS50b2dnbGVMZWZ0KCk7XG4gICAgfTtcbn0pOyIsImFwcC5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIpe1xuXHQvLyBFYWNoIHRhYiBoYXMgaXRzIG93biBuYXYgaGlzdG9yeSBzdGFjazpcblx0JHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2FjY291bnQnLCB7XG5cdFx0dXJsOiAnL2FjY291bnQnLFxuXHQgICAgdGVtcGxhdGVVcmw6ICdmZWF0dXJlcy9hY2NvdW50L2FjY291bnQuaHRtbCcsXG5cdFx0Y29udHJvbGxlcjogJ0FjY291bnRDdHJsJ1xuXHR9KTtcbn0pO1xuXG5hcHAuY29udHJvbGxlcignQWNjb3VudEN0cmwnLCBmdW5jdGlvbigkc2NvcGUpIHtcblx0JHNjb3BlLnNldHRpbmdzID0ge1xuXHRcdGVuYWJsZUZyaWVuZHM6IHRydWVcblx0fTtcbn0pOyIsImFwcC5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIpe1xuXHQkc3RhdGVQcm92aWRlci5zdGF0ZSgnY2hhbGxlbmdlJywge1xuXHRcdHRlbXBsYXRlVXJsIDogJ2ZlYXR1cmVzL2NoYWxsZW5nZS9jaGFsbGVuZ2UuaHRtbCcsXG5cdFx0YWJzdHJhY3QgOiB0cnVlXG5cdH0pO1xufSk7XG5cbmFwcC5mYWN0b3J5KCdDaGFsbGVuZ2VGYWN0b3J5JywgZnVuY3Rpb24oJGh0dHAsIEFwaUVuZHBvaW50KXtcblxuXHR2YXIgcHJvYmxlbSA9ICcnO1xuXHR2YXIgc3VibWlzc2lvbiA9Jyc7XG5cblx0cmV0dXJuIHtcblx0XHRnZXRDaGFsbGVuZ2UgOiBmdW5jdGlvbihpZCl7XG5cdFx0XHRyZXR1cm4gJGh0dHAuZ2V0KEFwaUVuZHBvaW50LnVybCArICcvY2hhbGxlbmdlLycgKyBpZCkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG5cdFx0XHRcdHByb2JsZW0gPSByZXNwb25zZS5kYXRhO1xuXHRcdFx0XHRzdWJtaXNzaW9uID0gJycgfHwgcHJvYmxlbS5zZXNzaW9uLnNldHVwO1xuXHRcdFx0XHRyZXR1cm4gcmVzcG9uc2UuZGF0YTtcblx0XHRcdH0pO1xuXHRcdH0sXG5cdFx0c3VibWl0U3VibWlzc2lvbiA6IGZ1bmN0aW9uKGlkLCBwcm9qZWN0SWQsIHNvbHV0aW9uSWQsIGNvZGUpe1xuXHRcdFx0c3VibWlzc2lvbiA9IGNvZGU7XG5cdFx0XHR2YXIgc3VibWl0ID0ge1xuXHRcdFx0XHRjb2RlIDogY29kZSxcblx0XHRcdFx0cHJvamVjdElkIDogcHJvamVjdElkLFxuXHRcdFx0XHRzb2x1dGlvbklkIDogc29sdXRpb25JZFxuXHRcdFx0fTtcblx0XHRcdGNvbnNvbGUubG9nKGNvZGUpO1xuXHRcdFx0cmV0dXJuICRodHRwLnBvc3QoQXBpRW5kcG9pbnQudXJsICsgJy9jaGFsbGVuZ2Uvc3VibWl0LycgKyBpZCwgc3VibWl0KS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcblx0XHRcdFx0cmV0dXJuIHJlc3BvbnNlLmRhdGE7XG5cdFx0XHR9KTtcblx0XHR9LFxuXHRcdHRlc3RTdWJtaXNzaW9uIDogZnVuY3Rpb24oaWQsIHByb2plY3RJZCwgc29sdXRpb25JZCwgY29kZSl7XG5cdFx0XHRzdWJtaXNzaW9uID0gY29kZTtcblx0XHRcdHZhciBzdWJtaXQgPSB7XG5cdFx0XHRcdGNvZGUgOiBjb2RlLFxuXHRcdFx0XHRwcm9qZWN0SWQgOiBwcm9qZWN0SWQsXG5cdFx0XHRcdHNvbHV0aW9uSWQgOiBzb2x1dGlvbklkXG5cdFx0XHR9O1xuXHRcdFx0Y29uc29sZS5sb2coY29kZSk7XG5cdFx0XHRyZXR1cm4gJGh0dHAucG9zdChBcGlFbmRwb2ludC51cmwgKyAnL2NoYWxsZW5nZS9hdHRlbXB0LycgKyBpZCwgc3VibWl0KS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcblx0XHRcdFx0cmV0dXJuIHJlc3BvbnNlLmRhdGE7XG5cdFx0XHR9KTtcblx0XHR9LFxuXHRcdGdldFN1Ym1pc3Npb24gOiBmdW5jdGlvbigpe1xuXHRcdFx0cmV0dXJuIHN1Ym1pc3Npb247XG5cdFx0fSxcblx0XHRnZXRQcm9ibGVtIDogZnVuY3Rpb24oKXtcblx0XHRcdHJldHVybiBwcm9ibGVtO1xuXHRcdH1cblx0fTtcbn0pOyIsImFwcC5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIpe1xuXHQkc3RhdGVQcm92aWRlci5zdGF0ZSgnY2hhbGxlbmdlLmNvZGUnLCB7XG5cdFx0dXJsIDogJy9jaGFsbGVuZ2UvY29kZScsXG5cdFx0dmlld3M6IHtcblx0XHRcdCd0YWItY29kZScgOiB7XG5cdFx0XHRcdHRlbXBsYXRlVXJsIDogJ2ZlYXR1cmVzL2NoYWxsZW5nZS1jb2RlL2NoYWxsZW5nZS1jb2RlLmh0bWwnLFxuXHRcdFx0XHRjb250cm9sbGVyIDogJ0NoYWxsZW5nZUNvZGVDdHJsJ1xuXHRcdFx0fVxuXHRcdH1cblx0fSk7XG59KTtcblxuYXBwLmNvbnRyb2xsZXIoJ0NoYWxsZW5nZUNvZGVDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCRzdGF0ZSwgQ2hhbGxlbmdlRmFjdG9yeSl7XG5cblx0XG5cblx0Ly9DaGFsbGVuZ2UgU3VibWl0XG5cdC8vdGV4dCBuZWVkcyB0byBiZSB3b3JrZWQgb25cblx0JHNjb3BlLnRleHQgPSBDaGFsbGVuZ2VGYWN0b3J5LmdldFN1Ym1pc3Npb24oKTtcblxuXHR2YXIgZWRpdG9yO1xuXG5cdCRzY29wZS5wcm9qZWN0SWQgPSBDaGFsbGVuZ2VGYWN0b3J5LmdldFByb2JsZW0oKS5zZXNzaW9uLnByb2plY3RJZDtcblx0JHNjb3BlLnNvbHV0aW9uSWQgPSBDaGFsbGVuZ2VGYWN0b3J5LmdldFByb2JsZW0oKS5zZXNzaW9uLnNvbHV0aW9uSWQ7XG5cblx0JHNjb3BlLmFjZUxvYWRlZCA9IGZ1bmN0aW9uKF9lZGl0b3Ipe1xuXHRcdGVkaXRvciA9IF9lZGl0b3I7XG5cdFx0ZWRpdG9yLmdldFNlc3Npb24oKS5zZXRVc2VXb3JrZXIoZmFsc2UpO1xuXG5cdFx0ZWRpdG9yLmZvY3VzKCk7XG5cblx0XHRlZGl0b3Iuc2V0UmVhZE9ubHkoZmFsc2UpO1xuXHR9O1xuXG5cdCRzY29wZS5hY2VDaGFuZ2VkID0gZnVuY3Rpb24oZSl7XG5cdFx0Ly8gY29uc29sZS5sb2coZSk7XG5cdH07XG5cblx0JHNjb3BlLmNsaWNrRWRpdG9yID0gZnVuY3Rpb24oKSB7XG5cdFx0ZWRpdG9yLmZvY3VzKCk7IC8vYnJpbmcgZWRpdG9yIHRvIGZvY3VzXG5cblx0XHQvLyBjb3Jkb3ZhLnBsdWdpbnMuS2V5Ym9hcmQuc2hvdyA9IGZ1bmN0aW9uKCkge1xuXHRcdC8vICAgICBleGVjKG51bGwsIG51bGwsIFwiS2V5Ym9hcmRcIiwgXCJzaG93XCIsIFtdKTtcblx0XHQvLyB9O1xuXG5cdFx0Y29uc29sZS5sb2coXCJpcyBLZXlib2FyZCB2aXM/XCIsIGNvcmRvdmEucGx1Z2lucy5LZXlib2FyZC5pc1Zpc2libGUpO1xuXG5cdFx0Ly8gY29yZG92YS5wbHVnaW5zLktleWJvYXJkLnNob3coKTtcblx0XHQvLyBuYXRpdmUua2V5Ym9hcmRzaG93KCk7XG5cdFx0Ly8gY29uc29sZS5sb2coXCJpcyBLZXlib2FyZCB2aXM/XCIsIGNvcmRvdmEucGx1Z2lucy5LZXlib2FyZCk7XG5cblx0fTtcblxuXHQkc2NvcGUuYnV0dG9ucyA9IHtcblx0XHRzdWJtaXQgOiAnU3VibWl0Jyxcblx0XHR0ZXN0IDogJ1Rlc3QnLFxuXHRcdGRpc21pc3MgOiAnRGlzbWlzcydcblx0fTtcblxuXHQkc2NvcGUuc3VibWl0U3VibWlzc2lvbiA9IGZ1bmN0aW9uKHByb2plY3RJZCwgc29sdXRpb25JZCwgY29kZSl7XG5cdFx0dmFyIGlkID0gJ0E5UUtrNlNtUnBEY3JpVS1ITVFyJztcblx0XHRDaGFsbGVuZ2VGYWN0b3J5LnN1Ym1pdFN1Ym1pc3Npb24oaWQsIHByb2plY3RJZCwgc29sdXRpb25JZCwgY29kZSkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG5cdFx0XHRyZXR1cm4gcmVzcG9uc2UuZGF0YTtcblx0XHR9KS5jYXRjaChmdW5jdGlvbihlcnIpe1xuXHRcdFx0Y29uc29sZS5lcnJvcihKU09OLnN0cmluZ2lmeShlcnIpKTtcblx0XHR9KTtcblx0fTtcblxuXHQkc2NvcGUudGVzdFN1Ym1pc3Npb24gPSBmdW5jdGlvbihwcm9qZWN0SWQsIHNvbHV0aW9uSWQsIGNvZGUpe1xuXHRcdHZhciBpZCA9ICdBOVFLazZTbVJwRGNyaVUtSE1Rcic7XG5cdFx0Q2hhbGxlbmdlRmFjdG9yeS50ZXN0U3VibWlzc2lvbihpZCwgcHJvamVjdElkLCBzb2x1dGlvbklkLCBjb2RlKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcblx0XHRcdHJldHVybiByZXNwb25zZS5kYXRhO1xuXHRcdH0pLmNhdGNoKGZ1bmN0aW9uKGVycil7XG5cdFx0XHRjb25zb2xlLmVycm9yKEpTT04uc3RyaW5naWZ5KGVycikpO1xuXHRcdH0pO1xuXHR9O1xuXG5cdCRzY29wZS5kaXNtaXNzQ2hhbGxlbmdlID0gZnVuY3Rpb24oKXtcblx0XHR2YXIgaWQgPSAnQTlRS2s2U21ScERjcmlVLUhNUXInO1xuXHRcdENoYWxsZW5nZUZhY3RvcnkuZ2V0Q2hhbGxlbmdlKGlkKS50aGVuKGZ1bmN0aW9uKGRhdGEpe1xuXHRcdFx0JHN0YXRlLmdvKCdjaGFsbGVuZ2UudmlldycpO1xuXHRcdH0pO1xuXHR9O1xuXG59KTsiLCJhcHAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKXtcblx0JHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2NoYWxsZW5nZS5jb21waWxlJywge1xuXHRcdHVybCA6ICcvY2hhbGxlbmdlL2NvbXBpbGUnLFxuXHRcdHZpZXdzIDoge1xuXHRcdFx0J3RhYi1jb21waWxlJyA6IHtcblx0XHRcdFx0dGVtcGxhdGVVcmwgOiAnZmVhdHVyZXMvY2hhbGxlbmdlLWNvbXBpbGUvY2hhbGxlbmdlLWNvbXBpbGUuaHRtbCcsXG5cdFx0XHRcdGNvbnRyb2xsZXI6ICdDaGFsbGVuZ2VDb21waWxlQ3RybCdcblx0XHRcdH1cblx0XHR9XG5cdH0pO1xufSk7XG5cbmFwcC5jb250cm9sbGVyKCdDaGFsbGVuZ2VDb21waWxlQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgQ2hhbGxlbmdlRmFjdG9yeSl7XG5cblx0JHNjb3BlLnJlc3VsdHMgPSAobmV3IEZ1bmN0aW9uKFwiJ3VzZSBzdHJpY3QnO1wiICsgQ2hhbGxlbmdlRmFjdG9yeS5nZXRTdWJtaXNzaW9uKCkpKSgpO1xufSk7IiwiYXBwLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlciwgVVNFUl9ST0xFUyl7XG5cdCRzdGF0ZVByb3ZpZGVyLnN0YXRlKCd0YWIuY2hhbGxlbmdlLXN1Ym1pdCcsIHtcblx0XHR1cmwgOiAnL2NoYWxsZW5nZS9zdWJtaXQnLFxuXHRcdHZpZXdzOiB7XG5cdFx0XHQndGFiLWNoYWxsZW5nZScgOiB7XG5cdFx0XHRcdHRlbXBsYXRlVXJsIDogJ2ZlYXR1cmVzL2NoYWxsZW5nZS1zdWJtaXQvY2hhbGxlbmdlLXN1Ym1pdC5odG1sJyxcblx0XHRcdFx0Y29udHJvbGxlciA6ICdDaGFsbGVuZ2VTdWJtaXRDdHJsJ1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0ZGF0YToge1xuXHRcdFx0YXV0aGVudGljYXRlOiBbVVNFUl9ST0xFUy5wdWJsaWNdXG5cdFx0fVxuXHR9KTtcbn0pO1xuXG5hcHAuY29udHJvbGxlcignQ2hhbGxlbmdlU3VibWl0Q3RybCcsIGZ1bmN0aW9uKCRzY29wZSl7XG5cblx0JHNjb3BlLmFjZUxvYWRlZCA9IGZ1bmN0aW9uKF9lZGl0b3Ipe1xuXHRcdGNvbnNvbGUubG9nKF9lZGl0b3IpO1xuXHR9O1xuXG5cdCRzY29wZS5hY2VDaGFuZ2VkID0gZnVuY3Rpb24oZSl7XG5cdFx0Y29uc29sZS5sb2coZSk7XG5cdH07XG5cblx0JHNjb3BlLnR4dCA9ICcnO1xuXG5cdCRzY29wZS5hY2VDb25maWcgPSB7XG5cdFx0dXNlV3JhcE1vZGUgOiB0cnVlLFxuXHRcdHNob3dHdXR0ZXIgOiB0cnVlLFxuXHRcdHRoZW1lOiAnbW9ub2thaScsXG5cdFx0bW9kZTogJ2phdmFzY3JpcHQnLFxuXHRcdG9uTG9hZDogJHNjb3BlLmFjZUxvYWRlZCxcblx0XHRvbkNoYW5nZSA6ICRzY29wZS5hY2VDaGFuZ2VkXG5cdH07XG5cdC8vdGV4dCBuZWVkcyB0byBiZSB3b3JrZWQgb25cblxuXHRjb25zb2xlLmxvZygndGhpcyBpcyBsb2FkZWQnKTtcbn0pOyIsImFwcC5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIpe1xuXHQkc3RhdGVQcm92aWRlci5zdGF0ZSgnY2hhbGxlbmdlLnZpZXcnLCB7XG5cdFx0dXJsOiAnL2NoYWxsZW5nZS92aWV3Jyxcblx0XHR2aWV3czoge1xuXHRcdFx0J3RhYi12aWV3JyA6IHtcblx0XHRcdFx0dGVtcGxhdGVVcmw6ICdmZWF0dXJlcy9jaGFsbGVuZ2Utdmlldy9jaGFsbGVuZ2Utdmlldy5odG1sJyxcblx0XHRcdFx0Y29udHJvbGxlcjogJ0NoYWxsZW5nZVZpZXdDdHJsJ1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0cmVzb2x2ZSA6IHtcblx0XHRcdGNoYWxsZW5nZSA6IGZ1bmN0aW9uKENoYWxsZW5nZUZhY3RvcnksICRzdGF0ZSl7XG5cdFx0XHRcdHZhciBpZCA9ICdBOVFLazZTbVJwRGNyaVUtSE1Rcic7XG5cdFx0XHRcdHJldHVybiBDaGFsbGVuZ2VGYWN0b3J5LmdldENoYWxsZW5nZShpZClcblx0XHRcdFx0XHRcdFx0XHRcdC5jYXRjaChmdW5jdGlvbihlcnIpe1xuXHRcdFx0XHRcdFx0XHRcdFx0XHQkc3RhdGUuZ28oJ2FjY291bnQnKTtcblx0XHRcdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH1cblx0fSk7XG59KTtcblxuYXBwLmNvbnRyb2xsZXIoJ0NoYWxsZW5nZVZpZXdDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBDaGFsbGVuZ2VGYWN0b3J5LCBjaGFsbGVuZ2UsICRzdGF0ZSwgJGlvbmljU2xpZGVCb3hEZWxlZ2F0ZSl7XG5cdC8vQ29udHJvbHMgU2xpZGVcblx0JHNjb3BlLnNsaWRlSGFzQ2hhbGxlbmdlZCA9IGZ1bmN0aW9uKGluZGV4KXtcblx0XHQkaW9uaWNTbGlkZUJveERlbGVnYXRlLnNsaWRlKGluZGV4KTtcblx0fTtcblxuXHQvL0NoYWxsZW5nZSBWaWV3XG5cdCRzY29wZS5jaGFsbGVuZ2UgPSBDaGFsbGVuZ2VGYWN0b3J5LmdldFByb2JsZW0oKTtcbn0pOyIsImFwcC5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIpe1xuXG4gICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdjaGF0cycsIHtcbiAgICAgIHVybDogJy9jaGF0cycsXG4gICAgICB0ZW1wbGF0ZVVybDogJ2ZlYXR1cmVzL2NoYXRzL3RhYi1jaGF0cy5odG1sJyxcbiAgICAgIGNvbnRyb2xsZXI6ICdDaGF0c0N0cmwnXG4gICAgfSlcbiAgICAuc3RhdGUoJ2NoYXQtZGV0YWlsJywge1xuICAgICAgdXJsOiAnL2NoYXRzLzpjaGF0SWQnLFxuICAgICAgdGVtcGxhdGVVcmw6ICdmZWF0dXJlcy9jaGF0cy9jaGF0LWRldGFpbC5odG1sJyxcbiAgICAgIGNvbnRyb2xsZXI6ICdDaGF0RGV0YWlsQ3RybCdcbiAgICB9KTtcbn0pO1xuXG5hcHAuY29udHJvbGxlcignQ2hhdHNDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBDaGF0cykge1xuICAkc2NvcGUuY2hhdHMgPSBDaGF0cy5hbGwoKTtcbiAgJHNjb3BlLnJlbW92ZSA9IGZ1bmN0aW9uKGNoYXQpIHtcbiAgICBDaGF0cy5yZW1vdmUoY2hhdCk7XG4gIH07XG59KTtcblxuYXBwLmNvbnRyb2xsZXIoJ0NoYXREZXRhaWxDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCAkc3RhdGVQYXJhbXMsIENoYXRzKSB7XG4gICRzY29wZS5jaGF0ID0gQ2hhdHMuZ2V0KCRzdGF0ZVBhcmFtcy5jaGF0SWQpO1xufSk7XG5cbmFwcC5mYWN0b3J5KCdDaGF0cycsIGZ1bmN0aW9uKCkge1xuICAvLyBNaWdodCB1c2UgYSByZXNvdXJjZSBoZXJlIHRoYXQgcmV0dXJucyBhIEpTT04gYXJyYXlcblxuICAvLyBTb21lIGZha2UgdGVzdGluZyBkYXRhXG4gIHZhciBjaGF0cyA9IFt7XG4gICAgaWQ6IDAsXG4gICAgbmFtZTogJ0JlbiBTcGFycm93JyxcbiAgICBsYXN0VGV4dDogJ1lvdSBvbiB5b3VyIHdheT8nLFxuICAgIGZhY2U6ICdodHRwczovL3Bicy50d2ltZy5jb20vcHJvZmlsZV9pbWFnZXMvNTE0NTQ5ODExNzY1MjExMTM2LzlTZ0F1SGVZLnBuZydcbiAgfSwge1xuICAgIGlkOiAxLFxuICAgIG5hbWU6ICdNYXggTHlueCcsXG4gICAgbGFzdFRleHQ6ICdIZXksIGl0XFwncyBub3QgbWUnLFxuICAgIGZhY2U6ICdodHRwczovL2F2YXRhcnMzLmdpdGh1YnVzZXJjb250ZW50LmNvbS91LzExMjE0P3Y9MyZzPTQ2MCdcbiAgfSx7XG4gICAgaWQ6IDIsXG4gICAgbmFtZTogJ0FkYW0gQnJhZGxleXNvbicsXG4gICAgbGFzdFRleHQ6ICdJIHNob3VsZCBidXkgYSBib2F0JyxcbiAgICBmYWNlOiAnaHR0cHM6Ly9wYnMudHdpbWcuY29tL3Byb2ZpbGVfaW1hZ2VzLzQ3OTA5MDc5NDA1ODM3OTI2NC84NFRLal9xYS5qcGVnJ1xuICB9LCB7XG4gICAgaWQ6IDMsXG4gICAgbmFtZTogJ1BlcnJ5IEdvdmVybm9yJyxcbiAgICBsYXN0VGV4dDogJ0xvb2sgYXQgbXkgbXVrbHVrcyEnLFxuICAgIGZhY2U6ICdodHRwczovL3Bicy50d2ltZy5jb20vcHJvZmlsZV9pbWFnZXMvNDkxOTk1Mzk4MTM1NzY3MDQwL2llMlpfVjZlLmpwZWcnXG4gIH0sIHtcbiAgICBpZDogNCxcbiAgICBuYW1lOiAnTWlrZSBIYXJyaW5ndG9uJyxcbiAgICBsYXN0VGV4dDogJ1RoaXMgaXMgd2lja2VkIGdvb2QgaWNlIGNyZWFtLicsXG4gICAgZmFjZTogJ2h0dHBzOi8vcGJzLnR3aW1nLmNvbS9wcm9maWxlX2ltYWdlcy81NzgyMzcyODEzODQ4NDEyMTYvUjNhZTFuNjEucG5nJ1xuICB9XTtcblxuICByZXR1cm4ge1xuICAgIGFsbDogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gY2hhdHM7XG4gICAgfSxcbiAgICByZW1vdmU6IGZ1bmN0aW9uKGNoYXQpIHtcbiAgICAgIGNoYXRzLnNwbGljZShjaGF0cy5pbmRleE9mKGNoYXQpLCAxKTtcbiAgICB9LFxuICAgIGdldDogZnVuY3Rpb24oY2hhdElkKSB7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoYXRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChjaGF0c1tpXS5pZCA9PT0gcGFyc2VJbnQoY2hhdElkKSkge1xuICAgICAgICAgIHJldHVybiBjaGF0c1tpXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICB9O1xufSk7XG4iLCJhcHAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKXtcblx0Ly8gRWFjaCB0YWIgaGFzIGl0cyBvd24gbmF2IGhpc3Rvcnkgc3RhY2s6XG5cdCRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdlcnJvcicsIHtcblx0XHR1cmw6ICcvZXJyb3InLFxuXHQgICAgdGVtcGxhdGVVcmw6ICdmZWF0dXJlcy9lcnJvci9lcnJvci5odG1sJyxcblx0XHRjb250cm9sbGVyOiAnRXJyb3JDdHJsJ1xuXHR9KTtcbn0pO1xuXG5hcHAuY29udHJvbGxlcignRXJyb3InLCBmdW5jdGlvbigkc2NvcGUpIHtcblx0XG59KTsiLCJhcHAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKXtcblx0JHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2xvZ2luJywge1xuXHRcdHVybCA6ICcvbG9naW4nLFxuXHRcdHRlbXBsYXRlVXJsIDogJ2ZlYXR1cmVzL2xvZ2luL2xvZ2luLmh0bWwnLFxuXHRcdGNvbnRyb2xsZXIgOiAnTG9naW5DdHJsJ1xuXHR9KTtcbn0pO1xuXG5hcHAuY29udHJvbGxlcignTG9naW5DdHJsJywgZnVuY3Rpb24oJHJvb3RTY29wZSwgJHNjb3BlLCAkaW9uaWNQb3B1cCwgJHN0YXRlLCBBdXRoU2VydmljZSl7XG5cdC8vJHNjb3BlLmFjY291bnQgPSBmdW5jdGlvbigpe1xuICAgIC8vXG5cdC8vfTtcblx0JHNjb3BlLmRhdGEgPSB7fTtcblx0JHNjb3BlLmVycm9yID0gbnVsbDtcblxuXHQkc2NvcGUubG9naW4gPSBmdW5jdGlvbigpe1xuXHRcdEF1dGhTZXJ2aWNlXG5cdFx0XHQubG9naW4oJHNjb3BlLmRhdGEpXG5cdFx0XHQudGhlbihmdW5jdGlvbihhdXRoZW50aWNhdGVkKXsgLy9UT0RPOmF1dGhlbnRpY2F0ZWQgaXMgd2hhdCBpcyByZXR1cm5lZFxuXHRcdFx0XHRjb25zb2xlLmxvZygnbG9naW4sIHRhYi5jaGFsbGVuZ2Utc3VibWl0Jyk7XG5cdFx0XHRcdC8vJHNjb3BlLm1lbnUgPSB0cnVlO1xuXHRcdFx0XHQvLyRyb290U2NvcGUuJGJyb2FkY2FzdCgnc2hvd01lbnUnKTtcblx0XHRcdFx0JHNjb3BlLnN0YXRlcy5wdXNoKHsgLy9UT0RPOiBOZWVkIHRvIGFkZCBhIHBhcmVudCBjb250cm9sbGVyIHRvIGNvbW11bmljYXRlXG5cdFx0XHRcdFx0bmFtZTogJ0xvZ291dCcsXG5cdFx0XHRcdFx0cmVmOiBmdW5jdGlvbigpe1xuXHRcdFx0XHRcdFx0QXV0aFNlcnZpY2UubG9nb3V0KCk7XG5cdFx0XHRcdFx0XHQkc2NvcGUuc3RhdGVzLnBvcCgpOyAvL1RPRE86IEZpbmQgYSBiZXR0ZXIgd2F5IHRvIHJlbW92ZSB0aGUgTG9nb3V0IGxpbmssIGluc3RlYWQgb2YgcG9wXG5cdFx0XHRcdFx0XHQkc3RhdGUuZ28oJ3NpZ251cCcpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHRcdCRzdGF0ZS5nbygnY2hhbGxlbmdlLnZpZXcnKTtcblx0XHRcdFx0Ly9UT0RPOiBXZSBjYW4gc2V0IHRoZSB1c2VyIG5hbWUgaGVyZSBhcyB3ZWxsLiBVc2VkIGluIGNvbmp1bmN0aW9uIHdpdGggYSBtYWluIGN0cmxcblx0XHRcdH0pXG5cdFx0XHQuY2F0Y2goZnVuY3Rpb24oZXJyKXtcblx0XHRcdFx0JHNjb3BlLmVycm9yID0gJ0xvZ2luIEludmFsaWQnO1xuXHRcdFx0XHRjb25zb2xlLmVycm9yKEpTT04uc3RyaW5naWZ5KGVycikpXG5cdFx0XHRcdHZhciBhbGVydFBvcHVwID0gJGlvbmljUG9wdXAuYWxlcnQoe1xuXHRcdFx0XHRcdHRpdGxlOiAnTG9naW4gZmFpbGVkIScsXG5cdFx0XHRcdFx0dGVtcGxhdGU6ICdQbGVhc2UgY2hlY2sgeW91ciBjcmVkZW50aWFscyEnXG5cdFx0XHRcdH0pO1xuXHRcdFx0fSk7XG5cdFx0Ly9Mb2dpbkZhY3Rvcnlcblx0XHQvL1x0LnBvc3RMb2dpbigkc2NvcGUuZGF0YSlcblx0XHQvL1x0LnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuXHRcdC8vXHRcdEF1dGhUb2tlbkZhY3Rvcnkuc2V0VG9rZW4ocmVzcG9uc2UuZGF0YS50b2tlbik7XG5cdFx0Ly9cdFx0Ly9jb25zb2xlLmxvZygnZ290byB0YWItY2hhbGxlbmdlLXN1Ym1pdCcscmVzcG9uc2UuZGF0YS50b2tlbiwgcmVzcG9uc2UuZGF0YS51c2VyKTtcblx0XHQvL1x0XHQkc3RhdGUuZ28oJ3RhYi5jaGFsbGVuZ2Utc3VibWl0Jyk7XG5cdFx0Ly9cdFx0cmV0dXJuIHJlc3BvbnNlOyAvL1RPRE86IHJlbW92ZSBpZiBub3QgcmVxdWlyZWQsIHlvdSBjYW4ganVzdCBjaGFuZ2Ugc3RhdGVzIGluc3RlYWRcblx0XHQvL1x0fSlcblx0XHQvL1x0LmNhdGNoKGZ1bmN0aW9uKGVycil7XG5cdFx0Ly9cdFx0JHNjb3BlLmVycm9yID0gJ0xvZ2luIEludmFsaWQnO1xuXHRcdC8vXHRcdGNvbnNvbGUuZXJyb3IoSlNPTi5zdHJpbmdpZnkoZXJyKSk7XG5cdFx0Ly9cdH0pO1xuXHR9O1xufSk7XG5cbi8vYXBwLmZhY3RvcnkoJ0xvZ2luRmFjdG9yeScsZnVuY3Rpb24oJGh0dHAsQXBpRW5kcG9pbnQpe1xuLy9cdHJldHVybntcbi8vXHRcdHBvc3RMb2dpbjogZnVuY3Rpb24odXNlcmRhdGEpe1xuLy9cdFx0XHRjb25zb2xlLmxvZygncG9zdExvZ2luJyxKU09OLnN0cmluZ2lmeSh1c2VyZGF0YSkpO1xuLy9cdFx0XHRyZXR1cm4gJGh0dHAucG9zdChBcGlFbmRwb2ludC51cmwrXCIvdXNlci9sb2dpblwiLCB1c2VyZGF0YSk7XG4vL1x0XHR9XG4vL1x0fTtcbi8vfSk7XG5cbi8vYXBwLmNvbnRyb2xsZXIoJ0xvZ2luQ3RybCcsIGZ1bmN0aW9uICgkc2NvcGUsIEF1dGhTZXJ2aWNlLCAkc3RhdGUpIHtcbi8vXG4vL1x0JHNjb3BlLmxvZ2luID0ge307XG4vL1x0JHNjb3BlLmVycm9yID0gbnVsbDtcbi8vXG4vL1x0JHNjb3BlLnNlbmRMb2dpbiA9IGZ1bmN0aW9uIChsb2dpbkluZm8pIHtcbi8vXG4vL1x0XHQkc2NvcGUuZXJyb3IgPSBudWxsO1xuLy9cbi8vXHRcdEF1dGhTZXJ2aWNlLmxvZ2luKGxvZ2luSW5mbykudGhlbihmdW5jdGlvbiAoKSB7XG4vL1x0XHRcdCRzdGF0ZS5nbygnaG9tZScpO1xuLy9cdFx0fSkuY2F0Y2goZnVuY3Rpb24gKCkge1xuLy9cdFx0XHQkc2NvcGUuZXJyb3IgPSAnSW52YWxpZCBsb2dpbiBjcmVkZW50aWFscy4nO1xuLy9cdFx0fSk7XG4vL1xuLy9cdH07XG4vL1xuLy99KTtcblxuLy9UT0RPOiBDbGVhbnVwIGNvbW1lbnRlZCBjb2RlXG5cbiIsImFwcC5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIpe1xuICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdzaWdudXAnLHtcbiAgICAgICAgdXJsOlwiL3NpZ251cFwiLFxuICAgICAgICB0ZW1wbGF0ZVVybDogXCJmZWF0dXJlcy9zaWdudXAvc2lnbnVwLmh0bWxcIixcbiAgICAgICAgY29udHJvbGxlcjogJ1NpZ25VcEN0cmwnXG4gICAgfSk7XG59KTtcblxuYXBwLmNvbnRyb2xsZXIoJ1NpZ25VcEN0cmwnLGZ1bmN0aW9uKCRyb290U2NvcGUsICRodHRwLCAkc2NvcGUsICRzdGF0ZSwgQXV0aFNlcnZpY2Upe1xuICAgICRzY29wZS5kYXRhID0ge307XG4gICAgJHNjb3BlLmVycm9yID0gbnVsbDtcblxuICAgICRzY29wZS5zaWdudXAgPSBmdW5jdGlvbigpe1xuICAgICAgICBBdXRoU2VydmljZVxuICAgICAgICAgICAgLnNpZ251cCgkc2NvcGUuZGF0YSlcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKGF1dGhlbnRpY2F0ZWQpe1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdzaWdudXAsIHRhYi5jaGFsbGVuZ2UnKTtcbiAgICAgICAgICAgICAgICAvLyRyb290U2NvcGUuJGJyb2FkY2FzdCgnc2hvd01lbnUnKTtcbiAgICAgICAgICAgICAgICAkc2NvcGUuc3RhdGVzLnB1c2goeyAvL1RPRE86IE5lZWQgdG8gYWRkIGEgcGFyZW50IGNvbnRyb2xsZXIgdG8gY29tbXVuaWNhdGVcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogJ0xvZ291dCcsXG4gICAgICAgICAgICAgICAgICAgIHJlZjogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIEF1dGhTZXJ2aWNlLmxvZ291dCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnN0YXRlcy5wb3AoKTsgLy9UT0RPOiBGaW5kIGEgYmV0dGVyIHdheSB0byByZW1vdmUgdGhlIExvZ291dCBsaW5rLCBpbnN0ZWFkIG9mIHBvcFxuICAgICAgICAgICAgICAgICAgICAgICAgJHN0YXRlLmdvKCdzaWdudXAnKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICRzdGF0ZS5nbygnY2hhbGxlbmdlLnZpZXcnKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuY2F0Y2goZnVuY3Rpb24oZXJyKXtcbiAgICAgICAgICAgICAgICAkc2NvcGUuZXJyb3IgPSAnU2lnbnVwIEludmFsaWQnO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoSlNPTi5zdHJpbmdpZnkoZXJyKSlcbiAgICAgICAgICAgICAgICB2YXIgYWxlcnRQb3B1cCA9ICRpb25pY1BvcHVwLmFsZXJ0KHtcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdTaWdudXAgZmFpbGVkIScsXG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlOiAnUGxlYXNlIGNoZWNrIHlvdXIgY3JlZGVudGlhbHMhJ1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIC8vU2lnblVwRmFjdG9yeSAvL1RPRE86IGNvbnZlcnQgdG8gdXNlIEF1dGggU2VydmljZSBpbnN0ZWFkXG4gICAgICAgIC8vICAgIC5wb3N0U2lnbnVwKCRzY29wZS5kYXRhKVxuICAgICAgICAvLyAgICAudGhlbihBdXRoU2VydmljZS5zaWduZWRVcClcbiAgICAgICAgLy8gICAgLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgICAvLyAgICAgICAgY29uc29sZS5sb2coJ2dvdG8gdGFiLWNoYWxsZW5nZS1zdWJtaXQnLEpTT04uc3RyaW5naWZ5KHJlc3BvbnNlKSk7XG4gICAgICAgIC8vICAgICAgICAvLyRodHRwLmdldChBcGlFbmRwb2ludC51cmwrXCIvXCIpO1xuICAgICAgICAvLyAgICAgICAgLy9JTkZPOiBTZXNzaW9uIGlzIHN0b3JlZCBhcyBhIGNvb2tpZSBvbiB0aGUgYnJvd3NlclxuICAgICAgICAvLyAgICB9KVxuICAgICAgICAvLyAgICAvL3N0b3JlIGRhdGEgaW4gc2Vzc2lvblxuICAgICAgICAvLyAgICAvLyRzdGF0ZS5nbygndGFiLmNoYWxsZW5nZS1zdWJtaXQnKTsgLy9UT0RPOiBBZGQgUm91dGUgYmFjaywgcmVtb3ZlZCBmb3IgdGVzdGluZ1xuICAgICAgICAvLyAgICAuY2F0Y2goZnVuY3Rpb24oZXJyKXtcbiAgICAgICAgLy8gICAgJHNjb3BlLmVycm9yID0gJ0xvZ2luIEludmFsaWQnO1xuICAgICAgICAvLyAgICBjb25zb2xlLmVycm9yKEpTT04uc3RyaW5naWZ5KGVycikpO1xuICAgICAgICAvL30pO1xuICAgIH07XG5cbn0pO1xuXG4vL2FwcC5mYWN0b3J5KCdTaWduVXBGYWN0b3J5JyxmdW5jdGlvbigkaHR0cCwgQXBpRW5kcG9pbnQpe1xuLy8gICAgcmV0dXJue1xuLy8gICAgICAgIHBvc3RTaWdudXA6IGZ1bmN0aW9uKHVzZXJkYXRhKXtcbi8vICAgICAgICAgICAgY29uc29sZS5sb2coJ3Bvc3RTaWdudXAnLEpTT04uc3RyaW5naWZ5KHVzZXJkYXRhKSk7XG4vLyAgICAgICAgICAgIHJldHVybiAkaHR0cC5wb3N0KEFwaUVuZHBvaW50LnVybCtcIi91c2VyL3NpZ251cFwiLCB1c2VyZGF0YSk7XG4vLyAgICAgICAgfVxuLy8gICAgfTtcbi8vfSk7XG5cbi8vVE9ETzogRm9ybSBWYWxpZGF0aW9uXG5cbi8vTkVYVDogU2VuZGluZyBkYXRhIHRvIHRoZSBiYWNrLWVuZCBhbmQgc2V0dGluZyB1cCByb3V0ZXNcbi8vTW9uZ29vc2VcblxuLy9UT0RPOiBDbGVhbnVwIGNvbW1lbnRlZCBjb2RlIiwiYXBwLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlcil7XG5cdCRzdGF0ZVByb3ZpZGVyLnN0YXRlKCd3ZWxjb21lJywge1xuXHRcdHVybCA6ICcvd2VsY29tZScsXG5cdFx0dGVtcGxhdGVVcmwgOiAnZmVhdHVyZXMvd2VsY29tZS93ZWxjb21lLmh0bWwnLFxuXHRcdGNvbnRyb2xsZXIgOiAnV2VsY29tZUN0cmwnXG5cdH0pO1xufSk7XG5cbmFwcC5jb250cm9sbGVyKCdXZWxjb21lQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgJHN0YXRlLCBBdXRoU2VydmljZSl7XG5cdC8vVE9ETzogU3BsYXNoIHBhZ2Ugd2hpbGUgeW91IGxvYWQgcmVzb3VyY2VzIChwb3NzaWJsZSBpZGVhKVxuXHQkc2NvcGUubG9naW4gPSBmdW5jdGlvbigpe1xuXHRcdCRzdGF0ZS5nbygnbG9naW4nKTtcblx0fTtcblx0JHNjb3BlLnNpZ251cCA9IGZ1bmN0aW9uKCl7XG5cdFx0JHN0YXRlLmdvKCdzaWdudXAnKTtcblx0fTtcblxuXHQvL2lmIChBdXRoU2VydmljZS5pc0F1dGhlbnRpY2F0ZWQoKSkge1xuXHQvL1x0JHN0YXRlLmdvKCdjaGFsbGVuZ2UudmlldycpO1xuXHQvL30gZWxzZSB7XG5cdC8vXHQkc3RhdGUuZ28oJ3NpZ251cCcpO1xuXHQvL31cblx0Ly99KTtcbn0pOyIsIi8vdG9rZW4gaXMgc2VudCBvbiBldmVyeSBodHRwIHJlcXVlc3RcbmFwcC5mYWN0b3J5KCdBdXRoSW50ZXJjZXB0b3InLGZ1bmN0aW9uIEF1dGhJbnRlcmNlcHRvcihBVVRIX0VWRU5UUywkcm9vdFNjb3BlLCRxLEF1dGhUb2tlbkZhY3Rvcnkpe1xuXG4gICAgdmFyIHN0YXR1c0RpY3QgPSB7XG4gICAgICAgIDQwMTogQVVUSF9FVkVOVFMubm90QXV0aGVudGljYXRlZCxcbiAgICAgICAgNDAzOiBBVVRIX0VWRU5UUy5ub3RBdXRob3JpemVkXG4gICAgfTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIHJlcXVlc3Q6IGFkZFRva2VuLFxuICAgICAgICByZXNwb25zZUVycm9yOiBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdChzdGF0dXNEaWN0W3Jlc3BvbnNlLnN0YXR1c10sIHJlc3BvbnNlKTtcbiAgICAgICAgICAgIHJldHVybiAkcS5yZWplY3QocmVzcG9uc2UpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIGFkZFRva2VuKGNvbmZpZyl7XG4gICAgICAgIHZhciB0b2tlbiA9IEF1dGhUb2tlbkZhY3RvcnkuZ2V0VG9rZW4oKTtcbiAgICAgICAgLy9jb25zb2xlLmxvZygnYWRkVG9rZW4nLHRva2VuKTtcbiAgICAgICAgaWYodG9rZW4pe1xuICAgICAgICAgICAgY29uZmlnLmhlYWRlcnMgPSBjb25maWcuaGVhZGVycyB8fCB7fTtcbiAgICAgICAgICAgIGNvbmZpZy5oZWFkZXJzLkF1dGhvcml6YXRpb24gPSAnQmVhcmVyICcgKyB0b2tlbjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY29uZmlnO1xuICAgIH1cbn0pOyAvL3NraXBwZWQgQXV0aCBJbnRlcmNlcHRvcnMgZ2l2ZW4gVE9ETzogWW91IGNvdWxkIGFwcGx5IHRoZSBhcHByb2FjaCBpblxuLy9odHRwOi8vZGV2ZGFjdGljLmNvbS91c2VyLWF1dGgtYW5ndWxhcmpzLWlvbmljL1xuXG5hcHAuY29uZmlnKGZ1bmN0aW9uKCRodHRwUHJvdmlkZXIpe1xuICAgICRodHRwUHJvdmlkZXIuaW50ZXJjZXB0b3JzLnB1c2goJ0F1dGhJbnRlcmNlcHRvcicpO1xufSk7XG5cbmFwcC5jb25zdGFudCgnQVVUSF9FVkVOVFMnLCB7XG4gICAgICAgIG5vdEF1dGhlbnRpY2F0ZWQ6ICdhdXRoLW5vdC1hdXRoZW50aWNhdGVkJyxcbiAgICAgICAgbm90QXV0aG9yaXplZDogJ2F1dGgtbm90LWF1dGhvcml6ZWQnXG59KTtcblxuYXBwLmNvbnN0YW50KCdVU0VSX1JPTEVTJywge1xuICAgICAgICAvL2FkbWluOiAnYWRtaW5fcm9sZScsXG4gICAgICAgIHB1YmxpYzogJ3B1YmxpY19yb2xlJ1xufSk7XG5cbmFwcC5mYWN0b3J5KCdBdXRoVG9rZW5GYWN0b3J5JyxmdW5jdGlvbigkd2luZG93KXtcbiAgICB2YXIgc3RvcmUgPSAkd2luZG93LmxvY2FsU3RvcmFnZTtcbiAgICB2YXIga2V5ID0gJ2F1dGgtdG9rZW4nO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgZ2V0VG9rZW46IGdldFRva2VuLFxuICAgICAgICBzZXRUb2tlbjogc2V0VG9rZW5cbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gZ2V0VG9rZW4oKXtcbiAgICAgICAgcmV0dXJuIHN0b3JlLmdldEl0ZW0oa2V5KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzZXRUb2tlbih0b2tlbil7XG4gICAgICAgIGlmKHRva2VuKXtcbiAgICAgICAgICAgIHN0b3JlLnNldEl0ZW0oa2V5LHRva2VuKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHN0b3JlLnJlbW92ZUl0ZW0oa2V5KTtcbiAgICAgICAgfVxuICAgIH1cbn0pO1xuXG5hcHAuc2VydmljZSgnQXV0aFNlcnZpY2UnLGZ1bmN0aW9uKCRxLCRodHRwLFVTRVJfUk9MRVMsQXV0aFRva2VuRmFjdG9yeSxBcGlFbmRwb2ludCwkcm9vdFNjb3BlKXtcbiAgICAvL3ZhciBMT0NBTF9UT0tFTl9LRVkgPSAnYXV0aC10b2tlbic7XG4gICAgdmFyIHVzZXJuYW1lID0gJyc7XG4gICAgdmFyIGlzQXV0aGVudGljYXRlZCA9IGZhbHNlO1xuICAgIHZhciBhdXRoVG9rZW47XG5cbiAgICBmdW5jdGlvbiBsb2FkVXNlckNyZWRlbnRpYWxzKCkge1xuICAgICAgICAvL3ZhciB0b2tlbiA9IHdpbmRvdy5sb2NhbFN0b3JhZ2UuZ2V0SXRlbShMT0NBTF9UT0tFTl9LRVkpO1xuICAgICAgICB2YXIgdG9rZW4gPSBBdXRoVG9rZW5GYWN0b3J5LmdldFRva2VuKCk7XG4gICAgICAgIGNvbnNvbGUubG9nKHRva2VuKTtcbiAgICAgICAgaWYgKHRva2VuKSB7XG4gICAgICAgICAgICB1c2VDcmVkZW50aWFscyh0b2tlbik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzdG9yZVVzZXJDcmVkZW50aWFscyhkYXRhKSB7XG4gICAgICAgIEF1dGhUb2tlbkZhY3Rvcnkuc2V0VG9rZW4oZGF0YS50b2tlbik7XG4gICAgICAgIHVzZUNyZWRlbnRpYWxzKGRhdGEpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHVzZUNyZWRlbnRpYWxzKGRhdGEpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ3VzZUNyZWRlbnRpYWxzIHRva2VuJyxkYXRhKTtcbiAgICAgICAgdXNlcm5hbWUgPSBkYXRhLnVzZXJuYW1lO1xuICAgICAgICBpc0F1dGhlbnRpY2F0ZWQgPSB0cnVlO1xuICAgICAgICBhdXRoVG9rZW4gPSBkYXRhLnRva2VuO1xuICAgICAgICAvLyBTZXQgdGhlIHRva2VuIGFzIGhlYWRlciBmb3IgeW91ciByZXF1ZXN0cyFcbiAgICAgICAgLy8kaHR0cC5kZWZhdWx0cy5oZWFkZXJzLmNvbW1vblsnWC1BdXRoLVRva2VuJ10gPSB0b2tlbjsgLy9UT0RPXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZGVzdHJveVVzZXJDcmVkZW50aWFscygpIHtcbiAgICAgICAgYXV0aFRva2VuID0gdW5kZWZpbmVkO1xuICAgICAgICB1c2VybmFtZSA9ICcnO1xuICAgICAgICBpc0F1dGhlbnRpY2F0ZWQgPSBmYWxzZTtcbiAgICAgICAgLy8kaHR0cC5kZWZhdWx0cy5oZWFkZXJzLmNvbW1vblsnWC1BdXRoLVRva2VuJ10gPSB1bmRlZmluZWQ7XG4gICAgICAgIC8vd2luZG93LmxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKExPQ0FMX1RPS0VOX0tFWSk7XG4gICAgICAgIEF1dGhUb2tlbkZhY3Rvcnkuc2V0VG9rZW4oKTsgLy9lbXB0eSBjbGVhcnMgdGhlIHRva2VuXG4gICAgfVxuXG4gICAgdmFyIGxvZ291dCA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIGRlc3Ryb3lVc2VyQ3JlZGVudGlhbHMoKTtcblxuICAgIH07XG5cbiAgICAvL3ZhciBsb2dpbiA9IGZ1bmN0aW9uKClcbiAgICB2YXIgbG9naW4gPSBmdW5jdGlvbih1c2VyZGF0YSl7XG4gICAgICAgIGNvbnNvbGUubG9nKCdsb2dpbicsSlNPTi5zdHJpbmdpZnkodXNlcmRhdGEpKTtcbiAgICAgICAgcmV0dXJuICRxKGZ1bmN0aW9uKHJlc29sdmUscmVqZWN0KXtcbiAgICAgICAgICAgICRodHRwLnBvc3QoQXBpRW5kcG9pbnQudXJsK1wiL3VzZXIvbG9naW5cIiwgdXNlcmRhdGEpXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgICAgICAgICAgICAgICBzdG9yZVVzZXJDcmVkZW50aWFscyhyZXNwb25zZS5kYXRhKTsgLy9zdG9yZVVzZXJDcmVkZW50aWFsc1xuICAgICAgICAgICAgICAgICAgICAvL2lzQXV0aGVudGljYXRlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUocmVzcG9uc2UpOyAvL1RPRE86IHNlbnQgdG8gYXV0aGVudGljYXRlZFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgdmFyIHNpZ251cCA9IGZ1bmN0aW9uKHVzZXJkYXRhKXtcbiAgICAgICAgY29uc29sZS5sb2coJ3NpZ251cCcsSlNPTi5zdHJpbmdpZnkodXNlcmRhdGEpKTtcbiAgICAgICAgcmV0dXJuICRxKGZ1bmN0aW9uKHJlc29sdmUscmVqZWN0KXtcbiAgICAgICAgICAgICRodHRwLnBvc3QoQXBpRW5kcG9pbnQudXJsK1wiL3VzZXIvc2lnbnVwXCIsIHVzZXJkYXRhKVxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAgICAgICAgICAgICAgICAgc3RvcmVVc2VyQ3JlZGVudGlhbHMocmVzcG9uc2UuZGF0YSk7IC8vc3RvcmVVc2VyQ3JlZGVudGlhbHNcbiAgICAgICAgICAgICAgICAgICAgLy9pc0F1dGhlbnRpY2F0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHJlc3BvbnNlKTsgLy9UT0RPOiBzZW50IHRvIGF1dGhlbnRpY2F0ZWRcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgbG9hZFVzZXJDcmVkZW50aWFscygpO1xuXG4gICAgdmFyIGlzQXV0aG9yaXplZCA9IGZ1bmN0aW9uKGF1dGhlbnRpY2F0ZWQpIHtcbiAgICAgICAgaWYgKCFhbmd1bGFyLmlzQXJyYXkoYXV0aGVudGljYXRlZCkpIHtcbiAgICAgICAgICAgIGF1dGhlbnRpY2F0ZWQgPSBbYXV0aGVudGljYXRlZF07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIChpc0F1dGhlbnRpY2F0ZWQgJiYgYXV0aGVudGljYXRlZC5pbmRleE9mKFVTRVJfUk9MRVMucHVibGljKSAhPT0gLTEpO1xuICAgIH07XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBsb2dpbjogbG9naW4sXG4gICAgICAgIHNpZ251cDogc2lnbnVwLFxuICAgICAgICBsb2dvdXQ6IGxvZ291dCxcbiAgICAgICAgaXNBdXRoZW50aWNhdGVkOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdBdXRoU2VydmljZS5pc0F1dGhlbnRpY2F0ZWQoKScpO1xuICAgICAgICAgICAgcmV0dXJuIGlzQXV0aGVudGljYXRlZDtcbiAgICAgICAgfSxcbiAgICAgICAgdXNlcm5hbWU6IGZ1bmN0aW9uKCl7cmV0dXJuIHVzZXJuYW1lO30sXG4gICAgICAgIC8vZ2V0TG9nZ2VkSW5Vc2VyOiBnZXRMb2dnZWRJblVzZXIsXG4gICAgICAgIGlzQXV0aG9yaXplZDogaXNBdXRob3JpemVkXG4gICAgfVxuXG59KTtcblxuLy9UT0RPOiBEaWQgbm90IGNvbXBsZXRlIG1haW4gY3RybCAnQXBwQ3RybCBmb3IgaGFuZGxpbmcgZXZlbnRzJ1xuLy8gYXMgcGVyIGh0dHA6Ly9kZXZkYWN0aWMuY29tL3VzZXItYXV0aC1hbmd1bGFyanMtaW9uaWMvIiwiYXBwLmZpbHRlcignbWFya2VkJywgZnVuY3Rpb24oJHNjZSl7XG5cdC8vIG1hcmtlZC5zZXRPcHRpb25zKHtcblx0Ly8gXHRyZW5kZXJlcjogbmV3IG1hcmtlZC5SZW5kZXJlcigpLFxuXHQvLyBcdGdmbTogdHJ1ZSxcblx0Ly8gXHR0YWJsZXM6IHRydWUsXG5cdC8vIFx0YnJlYWtzOiB0cnVlLFxuXHQvLyBcdHBlZGFudGljOiBmYWxzZSxcblx0Ly8gXHRzYW5pdGl6ZTogdHJ1ZSxcblx0Ly8gXHRzbWFydExpc3RzOiB0cnVlLFxuXHQvLyBcdHNtYXJ0eXBhbnRzOiBmYWxzZVxuXHQvLyB9KTtcblx0cmV0dXJuIGZ1bmN0aW9uKHRleHQpe1xuXHRcdHJldHVybiAkc2NlLnRydXN0QXNIdG1sKG1hcmtlZCh0ZXh0KSk7XG5cdH07XG59KTsiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=