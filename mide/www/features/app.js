// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
var app = angular.module('mide', ['ionic'])

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

    $scope.$on(AUTH_EVENTS.notAuthorized, function(event) {
        var alertPopup = $ionicPopup.alert({
            title: 'Unauthorized!',
            template: 'You are not allowed to access this resource.'
        });
    });

    $scope.$on(AUTH_EVENTS.notAuthenticated, function(event) {
        AuthService.logout();
        //$state.go('login');
        var alertPopup = $ionicPopup.alert({
            title: 'Please Review',
            template: ''
        });
    });
});

app.controller('MenuCtrl', function($scope, $ionicSideMenuDelegate, $state, AuthService, $rootScope){

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
        },
        {
          name : 'Exercism',
          ref: function(){return 'exercism.view';}
        }
    ];

    $scope.toggleMenuShow = function(){
        return AuthService.isAuthenticated();
    };

    $rootScope.$on('Auth',function(){
       $scope.toggleMenuShow();
    });

    //console.log(AuthService.isAuthenticated());
    //if(AuthService.isAuthenticated()){
    $scope.clickItem = function(stateRef){
        $ionicSideMenuDelegate.toggleLeft();
        $state.go(stateRef()); //RB: Updated to have stateRef as a function instead.
    };

    $scope.toggleMenu = function(){
        $ionicSideMenuDelegate.toggleLeft();
    };
    //}
});
app.config(function($stateProvider, USER_ROLES){
	// Each tab has its own nav history stack:
	$stateProvider.state('account', {
		url: '/account',
	    templateUrl: 'features/account/account.html',
		controller: 'AccountCtrl'
		// ,
		// data: {
		// 	authenticate: [USER_ROLES.public]
		// }
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

app.factory('ChallengeFactory', function($http, ApiEndpoint, $rootScope, $state){

	var problem = '';
	var submission = '';

	var runHidden = function(code) {
	    var indexedDB = null;
	    var location = null;
	    var navigator = null;
	    var onerror = null;
	    var onmessage = null;
	    var performance = null;
	    var self = null;
	    var webkitIndexedDB = null;
	    var postMessage = null;
	    var close = null;
	    var openDatabase = null;
	    var openDatabaseSync = null;
	    var webkitRequestFileSystem = null;
	    var webkitRequestFileSystemSync = null;
	    var webkitResolveLocalFileSystemSyncURL = null;
	    var webkitResolveLocalFileSystemURL = null;
	    var addEventListener = null;
	    var dispatchEvent = null;
	    var removeEventListener = null;
	    var dump = null;
	    var onoffline = null;
	    var ononline = null;
	    var importScripts = null;
	    var console = null;
	    var application = null;

	    return eval(code);
	};

	// converts the output into a string
	var stringify = function(output) {
	    var result;

	    if (typeof output == 'undefined') {
	        result = 'undefined';
	    } else if (output === null) {
	        result = 'null';
	    } else {
	        result = JSON.stringify(output) || output.toString();
	    }

	    return result;
	};

	var run = function(code) {
	    var result = {
	        input: code,
	        output: null,
	        error: null
	    };

	    try {
	        result.output = stringify(runHidden(code));
	    } catch(e) {
	        result.error = e.message;
	    }
	    return result;
    };


	return {
		getChallenge : function(id){
			return $http.get(ApiEndpoint.url + '/challenge/' + id).then(function(response){
				problem = response.data;
				submission = problem.session.setup || '';
				$rootScope.$broadcast('problemUpdated');
				return response.data;
			});
		},
		setSubmission : function(code){
			submission = code;
			$rootScope.$broadcast('submissionUpdated');
		},
		compileSubmission: function(code){
			return run(code);
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
		// ,
		// onEnter : function(ChallengeFactory, $state){
		// 	if(ChallengeFactory.getProblem().length === 0){
		// 		$state.go('challenge.view');
		// 	}
		// }
	});
});

app.controller('ChallengeCodeCtrl', function($scope,$state, $rootScope, ChallengeFactory, ChallengeFooterFactory){

	$scope.footerHotkeys = ChallengeFooterFactory.getHotkeys();

	console.log("footerHotkeys, ", $scope.footerHotkeys);

	//Challenge Submit
	$scope.text = ChallengeFactory.getSubmission() || 'text';

	//initialize CodeMirror
	var myCodeMirror = CodeMirror.fromTextArea(document.getElementById('code'), {
		lineNumbers : true,
		mode: 'javascript',
		autofocus : true,
		theme : 'twilight',
		lineWrapping: true
	});

	myCodeMirror.replaceSelection($scope.text);

	$scope.updateText = function(){
		$scope.text = myCodeMirror.getValue();
		//check if digest is in progress
		if(!$scope.$$phase) {
		  $scope.$apply();
		}
	};

	$scope.insertFunc = function(param){
		//given a param, will insert characters where cursor is
		console.log("inserting: ", param);
		myCodeMirror.replaceSelection(param);
	};

    myCodeMirror.on("change", function (myCodeMirror, changeObj){
    	$scope.updateText();
    });


	$scope.buttons = {
		compile : 'Compile',
		dismiss : 'Dismiss'
	};

	// $rootScope.$on('problemUpdated', function(e){
	// 	$scope.projectId = ChallengeFactory.getProblem().session.projectId;
	// 	$scope.solutionId = ChallengeFactory.getProblem().session.solutionId;
	// 	$scope.text = ChallengeFactory.getProblem().session.setup;
	// });

	$scope.compileChallenge = function(text){
		ChallengeFactory.setSubmission(text);
		$state.go('challenge.compile');
	};

	// $scope.dismissChallenge = function(){
	// 	var id = 'A9QKk6SmRpDcriU-HMQr';
	// 	ChallengeFactory.getChallenge(id).then(function(data){
	// 		$state.go('challenge.view');
	// 	});
	// };

});
app.factory('ChallengeFooterFactory', function(){

	var footerHotkeys = [
		{
			display: "[ ]",
			insertParam: "[]"
		},
		{
			display: "{ }",
			insertParam: "{}"
		},
		{
			display: "( )",
			insertParam: "()"
		},
		{
			display: "//",
			insertParam: "//"
		},
		{
			display: "=",
			insertParam: "="
		},
		{
			display: "<",
			insertParam: "<"
		},
		{
			display: ">",
			insertParam: ">"
		},
		{
			display: "/*  */",
			insertParam: "/* */"
		},

	];

	return {
		getHotkeys : function(){
			return footerHotkeys;
		}
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
		// ,
		// onEnter : function(ChallengeFactory, $state){
		// 	if(ChallengeFactory.getSubmission().length === 0){
		// 		$state.go('challenge.view');
		// 	}
		// }
	});
});

app.controller('ChallengeCompileCtrl', function($scope, ChallengeFactory){
	$scope.question = ChallengeFactory.getSubmission();
	console.log($scope.question);
	var results = ChallengeFactory.compileSubmission($scope.question);
	$scope.results = results;
	$scope.output = ChallengeFactory.compileSubmission($scope.question).output;
	$scope.error = ChallengeFactory.compileSubmission($scope.question).error;

	//initialize CodeMirror
	var cmCompile = CodeMirror.fromTextArea(document.getElementById('compile'), {
		readOnly : 'nocursor',
		mode: 'javascript',
		autofocus : true,
		theme : 'twilight',
		lineWrapping: true
	});

	cmCompile.replaceSelection($scope.question);


	var cmResults = CodeMirror.fromTextArea(document.getElementById('results'), {
		readOnly : 'nocursor',
		mode: 'javascript',
		autofocus : true,
		theme : 'twilight',
		lineWrapping: true
	});

	cmResults.replaceSelection($scope.output);

	$scope.$on('submissionUpdated', function(e){
		$scope.question = ChallengeFactory.getSubmission();
		results = ChallengeFactory.compileSubmission($scope.question);
		$scope.results = results;
		$scope.output = ChallengeFactory.compileSubmission($scope.question).output;
		$scope.error = ChallengeFactory.compileSubmission($scope.question).error;
		cmResults.setValue($scope.output);

	});
});
app.config(function($stateProvider){
	$stateProvider.state('challenge.view', {
		url: '/challenge/view',
		views: {
			'tab-view' : {
				templateUrl: 'features/challenge-view/challenge-view.html',
				controller: 'ChallengeViewCtrl'
			}
		}
	});
});

app.controller('ChallengeViewCtrl', function($scope, ChallengeFactory, $state, $ionicSlideBoxDelegate){

	//Controls Slide
	$scope.slideHasChallenged = function(index){
		$ionicSlideBoxDelegate.slide(index);
	};

	//Challenge View
	$scope.challenge = ChallengeFactory.getProblem() || "Test";

	// $scope.$on('problemUpdated', function(e){
	// 	$scope.challenge = ChallengeFactory.getProblem();
	// });


});
app.config(function($stateProvider, USER_ROLES){

  $stateProvider.state('chats', {
      url: '/chats',
      templateUrl: 'features/chats/tab-chats.html',
      controller: 'ChatsCtrl',
      data: {
        authenticate: [USER_ROLES.public]
      }
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
	$stateProvider.state('exercism', {
		templateUrl : 'features/exercism/exercism.html',
		abstract : true,
		resolve : {
			markdown : function(AvailableExercises, ExercismFactory, $state){
				var exercise;
				if(ExercismFactory.getTestScript().length === 0) {
					exercise = AvailableExercises.getRandomExercise();
					ExercismFactory.setName(exercise.name);
					return ExercismFactory.getExternalScript(exercise.link).then(function(data){
						return ExercismFactory.getExternalMd(exercise.mdLink);
					});
				}
				else return Exercism.getMarkdown();
			}
		}
	});
});

app.factory('ExercismFactory', function($http){
	var name = '';
	var test = '';
	var code = '';
	var markdown = '';

	return {
		getExternalScript : function(link){
			return $http.get(link).then(function(response){
				test = response.data;
				return response.data;
			});
		},
		getExternalMd : function(link){
			return $http.get(link).then(function(response){
				markdown = response.data;
				return response.data;
			});
		},
		setName : function(setName){
			name = setName;
		},
		setTestScript : function(test){
			test = test;
		},
		setCodeScript : function (code){
			code = code;
		},
		getTestScript : function(){
			return test;
		},
		getCodeScript : function(){
			return code;
		},
		getMarkdown : function(){
			return markdown;
		},
		getName : function(){
			return name;
		}
	};
});

app.factory('AvailableExercises', function(){

	var library = [
		'accumulate',
		'allergies',
		'anagram',
		'atbash-cipher',
		'beer-song',
		'binary',
		'binary-search-tree',
		'bob',
		'bracket-push',
		'circulate-buffer',
		'clock',
		'crypto-square',
		'custom-set',
		'difference-of-squares',
		'etl',
		'food-chain'
	];

	var generateLink = function(name){
		return 'exercism/javascript/' + name + '/' + name + '_test.spec.js';
	};

	var generateMdLink = function(name){
		return 'exercism/javascript/' + name + '/' + name + '.md';
	};

	var generateRandom = function(){
		var random = Math.floor(Math.random() * library.length);
		return library[random];
	};

	return {
		getSpecificExercise : function(name){
			return {
				link : generateLink(name),
				mdLink : generateMdLink(name)
			};
		},
		getRandomExercise : function(){
			var name = generateRandom();
			return {
				name : name,
				link : generateLink(name),
				mdLink : generateMdLink(name)
			};
		}
	};
});
app.config(function($stateProvider){
	$stateProvider.state('exercism.code', {
		url : '/exercism/code',
		views : {
			'tab-code' : {
				templateUrl : 'features/exercism-code/exercism-code.html',
				controller: 'ExercismCodeCtrl'
			}
		}
	});
});

app.controller('ExercismCodeCtrl', function($scope, ExercismFactory){
	$scope.name = ExercismFactory.getName();
	$scope.code = ExercismFactory.getCodeScript();

	$scope.$watch('code', function(newValue, oldValue){
		ExercismFactory.setCodeScript(newValue);
	});
});
app.config(function($stateProvider){
	$stateProvider.state('exercism.compile', {
		url : '/exercism/compile',
		views : {
			'tab-compile' : {
				templateUrl : 'features/exercism-compile/exercism-compile.html',
				controller: 'ExercismCompileCtrl'
			}
		}
	});
});

app.controller('ExercismCompileCtrl', function($scope, ExercismFactory){
	$scope.name = ExercismFactory.getName();
	$scope.test = ExercismFactory.getTestScript();
	$scope.code = ExercismFactory.getCodeScript();
});
app.config(function($stateProvider){
	$stateProvider.state('exercism.test', {
		url : '/exercism/test',
		views : {
			'tab-test' : {
				templateUrl : 'features/exercism-test/exercism-test.html',
				controller : 'ExercismTestCtrl'
			}
		}
	});
});

app.controller('ExercismTestCtrl', function($scope, ExercismFactory){
	$scope.name = ExercismFactory.getName();
	$scope.test = ExercismFactory.getTestScript();

	$scope.$watch('test', function(newValue, oldValue){
		ExercismFactory.setTestScript(newValue);
	});
});
app.config(function($stateProvider){
	$stateProvider.state('exercism.view', {
		url: '/exercism/view',
		views: {
			'tab-view' : {
				templateUrl: 'features/exercism-view/exercism-view.html',
				controller: 'ExercismViewCtrl'
			}
		}
	});
});

app.controller('ExercismViewCtrl', function($scope, ExercismFactory){
	$scope.markdown = ExercismFactory.getMarkdown();
	$scope.name = ExercismFactory.getName();
});
app.config(function($stateProvider){
	$stateProvider.state('login', {
		url : '/login',
		templateUrl : 'features/login/login.html',
		controller : 'LoginCtrl'
	});
});

app.controller('LoginCtrl', function($rootScope, $scope, $ionicPopup, $state, AuthService){
	$scope.data = {};
	$scope.error = null;

    $scope.signup = function(){
        $state.go('signup');
    };

	$scope.login = function(){
		AuthService
			.login($scope.data)
			.then(function(authenticated){ //TODO:authenticated is what is returned
				//console.log('login, tab.challenge-submit');
				//$scope.menu = true;
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
	};
});


//TODO: Cleanup commented code


app.config(function($stateProvider){
    $stateProvider.state('signup',{
        url:"/signup",
        templateUrl: "features/signup/signup.html",
        controller: 'SignUpCtrl'
    });
});

app.controller('SignUpCtrl',function($rootScope, $http, $scope, $state, AuthService, $ionicPopup){
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
    };

});

//TODO: Form Validation
//TODO: Cleanup commented code
app.config(function($stateProvider){
	$stateProvider.state('welcome', {
		url : '/welcome',
		templateUrl : 'features/welcome/welcome.html',
		controller : 'WelcomeCtrl'
	});
});

app.controller('WelcomeCtrl', function($scope, $state, AuthService, $rootScope){
	//TODO: Splash page while you load resources (possible idea)
	//console.log('WelcomeCtrl');
	$scope.login = function(){
		$state.go('login');
	};
	$scope.signup = function(){
		$state.go('signup');
	};

	if (AuthService.isAuthenticated()) {
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
	} else {
		//TODO: $state.go('signup'); Remove Below line
		$state.go('challenge.view');
	}
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
});
//skipped Auth Interceptors given TODO: You could apply the approach in
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
    var username = '';
    var isAuthenticated = false;
    var authToken;

    function loadUserCredentials() {
        //var token = window.localStorage.getItem(LOCAL_TOKEN_KEY);
        var token = AuthTokenFactory.getToken();
        //console.log(token);
        if (token) {
            useCredentials(token);
        }
    }

    function storeUserCredentials(data) {
        AuthTokenFactory.setToken(data.token);
        useCredentials(data);
    }

    function useCredentials(data) {
        //console.log('useCredentials token',data);
        username = data.username;
        isAuthenticated = true;
        authToken = data.token;
    }

    function destroyUserCredentials() {
        authToken = undefined;
        username = '';
        isAuthenticated = false;
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
            //console.log('AuthService.isAuthenticated()');
            return isAuthenticated;
        },
        username: function(){return username;},
        //getLoggedInUser: getLoggedInUser,
        isAuthorized: isAuthorized
    }

});

//TODO: Did not complete main ctrl 'AppCtrl for handling events'
// as per http://devdactic.com/user-auth-angularjs-ionic/
app.filter('nameformat', function(){
	return function(text){
		return 'Exercism - ' + text.split('-').map(function(el){
			return el.charAt(0).toUpperCase() + el.slice(1);
		}).join(' ');
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
		if(text){
			return $sce.trustAsHtml(marked(text));
		}
		else {
			return undefined;
		}
	};
});
app.directive('cmedit', function(){
	return {
		restrict : 'A',
		scope: {
			ngModel : '='
		},
		link : function(scope, element, attribute){
			var updateText = function(){
				scope.ngModel = myCodeMirror.getValue();
				console.log(myCodeMirror.getValue());
				scope.$apply();
			};
			//initialize CodeMirror
			var myCodeMirror = CodeMirror.fromTextArea(document.getElementById(attribute.id), {
				lineNumbers : true,
				mode: 'javascript',
				autofocus : true,
				theme : 'twilight',
				lineWrapping: true
			});
			myCodeMirror.setValue(scope.ngModel);

			myCodeMirror.on("change", function (myCodeMirror, changeObj){
		    	updateText();
		    });
		}
	};
});
app.directive('cmread', function(){
	return {
		restrict : 'A',
		scope: {
			ngModel : '='
		},
		link : function(scope, element, attribute){
			//initialize CodeMirror
			var myCodeMirror = CodeMirror.fromTextArea(document.getElementById('compile'), {
				readOnly : 'nocursor',
				mode: 'javascript',
				autofocus : true,
				theme : 'twilight',
				lineWrapping: true
			});

			myCodeMirror.setValue(scope.ngModel);
		}
	};
});
app.directive('jhr', function(JasmineReporter){
	return {
		restrict : 'E',
		scope : {
			test : '='
		},
		templateUrl : 'features/common/directives/jasmine-html-reporter/jasmine-html-reporter.html',
		link : function (scope, element, attribute){
			JasmineReporter.createJasmineReporter(element[0]);
			console.log(element);
		}
	};
});

app.factory('JasmineReporter', function(){
	function initializeJasmine(){
		/*
		Copyright (c) 2008-2015 Pivotal Labs

		Permission is hereby granted, free of charge, to any person obtaining
		a copy of this software and associated documentation files (the
		"Software"), to deal in the Software without restriction, including
		without limitation the rights to use, copy, modify, merge, publish,
		distribute, sublicense, and/or sell copies of the Software, and to
		permit persons to whom the Software is furnished to do so, subject to
		the following conditions:

		The above copyright notice and this permission notice shall be
		included in all copies or substantial portions of the Software.

		THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
		EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
		MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
		NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
		LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
		OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
		WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
		*/
		/**
		 Starting with version 2.0, this file "boots" Jasmine, performing all of the necessary initialization before executing the loaded environment and all of a project's specs. This file should be loaded after `jasmine.js` and `jasmine_html.js`, but before any project source files or spec files are loaded. Thus this file can also be used to customize Jasmine for a project.

		 If a project is using Jasmine via the standalone distribution, this file can be customized directly. If a project is using Jasmine via the [Ruby gem][jasmine-gem], this file can be copied into the support directory via `jasmine copy_boot_js`. Other environments (e.g., Python) will have different mechanisms.

		 The location of `boot.js` can be specified and/or overridden in `jasmine.yml`.

		 [jasmine-gem]: http://github.com/pivotal/jasmine-gem
		 */

		(function() {
		  /**
		   * ## Require &amp; Instantiate
		   *
		   * Require Jasmine's core files. Specifically, this requires and attaches all of Jasmine's code to the `jasmine` reference.
		   */
		  window.jasmine = jasmineRequire.core(jasmineRequire);

		  /**
		   * Since this is being run in a browser and the results should populate to an HTML page, require the HTML-specific Jasmine code, injecting the same reference.
		   */
		  jasmineRequire.html(jasmine);

		  /**
		   * Create the Jasmine environment. This is used to run all specs in a project.
		   */
		  var env = jasmine.getEnv();

		  /**
		   * ## The Global Interface
		   *
		   * Build up the functions that will be exposed as the Jasmine public interface. A project can customize, rename or alias any of these functions as desired, provided the implementation remains unchanged.
		   */
		  var jasmineInterface = jasmineRequire.interface(jasmine, env);

		  /**
		   * Add all of the Jasmine global/public interface to the global scope, so a project can use the public interface directly. For example, calling `describe` in specs instead of `jasmine.getEnv().describe`.
		   */
		  extend(window, jasmineInterface);

		  /**
		   * ## Runner Parameters
		   *
		   * More browser specific code - wrap the query string in an object and to allow for getting/setting parameters from the runner user interface.
		   */

		  var queryString = new jasmine.QueryString({
		    getWindowLocation: function() { return window.location; }
		  });

		  var catchingExceptions = queryString.getParam("catch");
		  env.catchExceptions(typeof catchingExceptions === "undefined" ? true : catchingExceptions);

		  var throwingExpectationFailures = queryString.getParam("throwFailures");
		  env.throwOnExpectationFailure(throwingExpectationFailures);

		  /**
		   * The `jsApiReporter` also receives spec results, and is used by any environment that needs to extract the results  from JavaScript.
		   */
		  env.addReporter(jasmineInterface.jsApiReporter);

		  /**
		   * Filter which specs will be run by matching the start of the full name against the `spec` query param.
		   */
		  var specFilter = new jasmine.HtmlSpecFilter({
		    filterString: function() { return queryString.getParam("spec"); }
		  });

		  env.specFilter = function(spec) {
		    return specFilter.matches(spec.getFullName());
		  };

		  /**
		   * Setting up timing functions to be able to be overridden. Certain browsers (Safari, IE 8, phantomjs) require this hack.
		   */
		  window.setTimeout = window.setTimeout;
		  window.setInterval = window.setInterval;
		  window.clearTimeout = window.clearTimeout;
		  window.clearInterval = window.clearInterval;

		  /**
		   * ## Execution
		   *
		   * Replace the browser window's `onload`, ensure it's called, and then run all of the loaded specs. This includes initializing the `HtmlReporter` instance and then executing the loaded Jasmine environment. All of this will happen after all of the specs are loaded.
		   */
		  var currentWindowOnload = window.onload;

		  (function() {
		    if (currentWindowOnload) {
		      currentWindowOnload();
		    }
		    env.execute();
		  })();

		  /**
		   * Helper function for readability above.
		   */
		  function extend(destination, source) {
		    for (var property in source) destination[property] = source[property];
		    return destination;
		  }

		})();
	}

	function generateJasmineReporter(container){
		(function(container) {
			var jasmine = window.jasmine;
			var env = jasmine.getEnv();

			var queryString = new jasmine.QueryString({
				getWindowLocation: function() { return window.location; }
			});

			var catchingExceptions = queryString.getParam("catch");
			env.catchExceptions(typeof catchingExceptions === "undefined" ? true : catchingExceptions);

			var throwingExpectationFailures = queryString.getParam("throwFailures");
			env.throwOnExpectationFailure(throwingExpectationFailures);

			/**
				* ## Reporters
				* The `HtmlReporter` builds all of the HTML UI for the runner page. This reporter paints the dots, stars, and x's for specs, as well as all spec names and all failures (if any).
			*/
			var htmlReporter = new jasmine.HtmlReporter({
				env: env,
				onRaiseExceptionsClick: function() { queryString.navigateWithNewParam("catch", !env.catchingExceptions()); },
				onThrowExpectationsClick: function() { queryString.navigateWithNewParam("throwFailures", !env.throwingExpectationFailures()); },
				addToExistingQueryString: function(key, value) { return queryString.fullStringWithNewParam(key, value); },
				getContainer: function() { return container; },
				createElement: function() { return document.createElement.apply(document, arguments); },
				createTextNode: function() { return document.createTextNode.apply(document, arguments); },
				timer: new jasmine.Timer()
			});
			/**
			* Filter which specs will be run by matching the start of the full name against the `spec` query param.
			*/
			var specFilter = new jasmine.HtmlSpecFilter({
				filterString: function() { return queryString.getParam("spec"); }
			});

			env.specFilter = function(spec) {
				return specFilter.matches(spec.getFullName());
			};
			env.addReporter(htmlReporter);
			htmlReporter.initialize();
			env.execute();
		})(container);
	}

	function createJasmineReporter(container){
	/*
		Copyright (c) 2008-2015 Pivotal Labs

		Permission is hereby granted, free of charge, to any person obtaining
		a copy of this software and associated documentation files (the
		"Software"), to deal in the Software without restriction, including
		without limitation the rights to use, copy, modify, merge, publish,
		distribute, sublicense, and/or sell copies of the Software, and to
		permit persons to whom the Software is furnished to do so, subject to
		the following conditions:

		The above copyright notice and this permission notice shall be
		included in all copies or substantial portions of the Software.

		THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
		EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
		MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
		NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
		LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
		OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
		WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
		*/
		/**
		 Starting with version 2.0, this file "boots" Jasmine, performing all of the necessary initialization before executing the loaded environment and all of a project's specs. This file should be loaded after `jasmine.js` and `jasmine_html.js`, but before any project source files or spec files are loaded. Thus this file can also be used to customize Jasmine for a project.

		 If a project is using Jasmine via the standalone distribution, this file can be customized directly. If a project is using Jasmine via the [Ruby gem][jasmine-gem], this file can be copied into the support directory via `jasmine copy_boot_js`. Other environments (e.g., Python) will have different mechanisms.

		 The location of `boot.js` can be specified and/or overridden in `jasmine.yml`.

		 [jasmine-gem]: http://github.com/pivotal/jasmine-gem
		 */

		(function(container) {
		  /**
		   * ## Require &amp; Instantiate
		   *
		   * Require Jasmine's core files. Specifically, this requires and attaches all of Jasmine's code to the `jasmine` reference.
		   */
		  window.jasmine = jasmineRequire.core(jasmineRequire);

		  /**
		   * Since this is being run in a browser and the results should populate to an HTML page, require the HTML-specific Jasmine code, injecting the same reference.
		   */
		  jasmineRequire.html(jasmine);

		  /**
		   * Create the Jasmine environment. This is used to run all specs in a project.
		   */
		  var env = jasmine.getEnv();

		  /**
		   * ## The Global Interface
		   *
		   * Build up the functions that will be exposed as the Jasmine public interface. A project can customize, rename or alias any of these functions as desired, provided the implementation remains unchanged.
		   */
		  var jasmineInterface = jasmineRequire.interface(jasmine, env);

		  /**
		   * Add all of the Jasmine global/public interface to the global scope, so a project can use the public interface directly. For example, calling `describe` in specs instead of `jasmine.getEnv().describe`.
		   */
		  extend(window, jasmineInterface);

		  /**
		   * ## Runner Parameters
		   *
		   * More browser specific code - wrap the query string in an object and to allow for getting/setting parameters from the runner user interface.
		   */

		  var queryString = new jasmine.QueryString({
		    getWindowLocation: function() { return window.location; }
		  });

		  var catchingExceptions = queryString.getParam("catch");
		  env.catchExceptions(typeof catchingExceptions === "undefined" ? true : catchingExceptions);

		  var throwingExpectationFailures = queryString.getParam("throwFailures");
		  env.throwOnExpectationFailure(throwingExpectationFailures);

		  /**
		   * ## Reporters
		   * The `HtmlReporter` builds all of the HTML UI for the runner page. This reporter paints the dots, stars, and x's for specs, as well as all spec names and all failures (if any).
		   */
		  var htmlReporter = new jasmine.HtmlReporter({
		    env: env,
		    onRaiseExceptionsClick: function() { queryString.navigateWithNewParam("catch", !env.catchingExceptions()); },
		    onThrowExpectationsClick: function() { queryString.navigateWithNewParam("throwFailures", !env.throwingExpectationFailures()); },
		    addToExistingQueryString: function(key, value) { return queryString.fullStringWithNewParam(key, value); },
		    getContainer: function() { return container; },
		    createElement: function() { return document.createElement.apply(document, arguments); },
		    createTextNode: function() { return document.createTextNode.apply(document, arguments); },
		    timer: new jasmine.Timer()
		  });

		  /**
		   * The `jsApiReporter` also receives spec results, and is used by any environment that needs to extract the results  from JavaScript.
		   */
		  env.addReporter(jasmineInterface.jsApiReporter);
		  env.addReporter(htmlReporter);

		  /**
		   * Filter which specs will be run by matching the start of the full name against the `spec` query param.
		   */
		  var specFilter = new jasmine.HtmlSpecFilter({
		    filterString: function() { return queryString.getParam("spec"); }
		  });

		  env.specFilter = function(spec) {
		    return specFilter.matches(spec.getFullName());
		  };

		  /**
		   * Setting up timing functions to be able to be overridden. Certain browsers (Safari, IE 8, phantomjs) require this hack.
		   */
		  window.setTimeout = window.setTimeout;
		  window.setInterval = window.setInterval;
		  window.clearTimeout = window.clearTimeout;
		  window.clearInterval = window.clearInterval;

		  /**
		   * ## Execution
		   *
		   * Replace the browser window's `onload`, ensure it's called, and then run all of the loaded specs. This includes initializing the `HtmlReporter` instance and then executing the loaded Jasmine environment. All of this will happen after all of the specs are loaded.
		   */
		  var currentWindowOnload = window.onload;

		  (function() {
		    if (currentWindowOnload) {
		      currentWindowOnload();
		    }
		    htmlReporter.initialize();
		    env.execute();
		  })();

		  /**
		   * Helper function for readability above.
		   */
		  function extend(destination, source) {
		    for (var property in source) destination[property] = source[property];
		    return destination;
		  }

		})(container);

	}

	return {
		createJasmineReporter : createJasmineReporter,
		initializeJasmine : initializeJasmine,
		generateJasmineReporter : generateJasmineReporter
	};
});
app.directive('jsload', function(){
	function updateScript(element, text){
		element.empty();
		var script = document.createElement('script');
		script.type = 'text/javascript';
		script.innerHTML = text;
		console.log(script);
		element.append(script);
	}
	return {
		restrict : 'E',
		scope : {
			text : '='
		},
		templateUrl: 'features/common/directives/js-load/js-load.html',
		link : function(scope, element, attributes){
			scope.$watch('text', function(text){
				updateScript(element, text);
			});
			console.log(scope.text);
		}
	};
});


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImFjY291bnQvYWNjb3VudC5qcyIsImNoYWxsZW5nZS9jaGFsbGVuZ2UuanMiLCJjaGFsbGVuZ2UtY29kZS9jaGFsbGVuZ2UtY29kZS5qcyIsImNoYWxsZW5nZS1jb2RlL2NoYWxsZW5nZS1mb290ZXIuanMiLCJjaGFsbGVuZ2UtY29tcGlsZS9jaGFsbGVuZ2UtY29tcGlsZS5qcyIsImNoYWxsZW5nZS12aWV3L2NoYWxsZW5nZS12aWV3LmpzIiwiY2hhdHMvY2hhdHMuanMiLCJlcnJvci9lcnJvci5qcyIsImV4ZXJjaXNtL2V4ZXJjaXNtLmpzIiwiZXhlcmNpc20tY29kZS9leGVyY2lzbS1jb2RlLmpzIiwiZXhlcmNpc20tY29tcGlsZS9leGVyY2lzbS1jb21waWxlLmpzIiwiZXhlcmNpc20tdGVzdC9leGVyY2lzbS10ZXN0LmpzIiwiZXhlcmNpc20tdmlldy9leGVyY2lzbS12aWV3LmpzIiwibG9naW4vbG9naW4uanMiLCJzaWdudXAvc2lnbnVwLmpzIiwid2VsY29tZS93ZWxjb21lLmpzIiwiY29tbW9uL0F1dGhlbnRpY2F0aW9uL2F1dGhlbnRpY2F0aW9uLmpzIiwiY29tbW9uL2ZpbHRlcnMvZXhlcmNpc20tZm9ybWF0LW5hbWUuanMiLCJjb21tb24vZmlsdGVycy9tYXJrZWQuanMiLCJjb21tb24vZGlyZWN0aXZlcy9jb2RlbWlycm9yLWVkaXQvY29kZW1pcnJvci1lZGl0LmpzIiwiY29tbW9uL2RpcmVjdGl2ZXMvY29kZW1pcnJvci1yZWFkL2NvZGVtaXJyb3ItcmVhZC5qcyIsImNvbW1vbi9kaXJlY3RpdmVzL2phc21pbmUtaHRtbC1yZXBvcnRlci9qYXNtaW5lLWh0bWwtcmVwb3J0ZXIuanMiLCJjb21tb24vZGlyZWN0aXZlcy9qcy1sb2FkL2pzLWxvYWQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0SkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDekRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDOUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6SkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gSW9uaWMgU3RhcnRlciBBcHBcblxuLy8gYW5ndWxhci5tb2R1bGUgaXMgYSBnbG9iYWwgcGxhY2UgZm9yIGNyZWF0aW5nLCByZWdpc3RlcmluZyBhbmQgcmV0cmlldmluZyBBbmd1bGFyIG1vZHVsZXNcbi8vICdzdGFydGVyJyBpcyB0aGUgbmFtZSBvZiB0aGlzIGFuZ3VsYXIgbW9kdWxlIGV4YW1wbGUgKGFsc28gc2V0IGluIGEgPGJvZHk+IGF0dHJpYnV0ZSBpbiBpbmRleC5odG1sKVxuLy8gdGhlIDJuZCBwYXJhbWV0ZXIgaXMgYW4gYXJyYXkgb2YgJ3JlcXVpcmVzJ1xuLy8gJ3N0YXJ0ZXIuc2VydmljZXMnIGlzIGZvdW5kIGluIHNlcnZpY2VzLmpzXG4vLyAnc3RhcnRlci5jb250cm9sbGVycycgaXMgZm91bmQgaW4gY29udHJvbGxlcnMuanNcbnZhciBhcHAgPSBhbmd1bGFyLm1vZHVsZSgnbWlkZScsIFsnaW9uaWMnXSlcblxuLnJ1bihmdW5jdGlvbigkaW9uaWNQbGF0Zm9ybSkge1xuICAkaW9uaWNQbGF0Zm9ybS5yZWFkeShmdW5jdGlvbigpIHtcbiAgICAvLyBIaWRlIHRoZSBhY2Nlc3NvcnkgYmFyIGJ5IGRlZmF1bHQgKHJlbW92ZSB0aGlzIHRvIHNob3cgdGhlIGFjY2Vzc29yeSBiYXIgYWJvdmUgdGhlIGtleWJvYXJkXG4gICAgLy8gZm9yIGZvcm0gaW5wdXRzKVxuICAgIC8vICRsb2NhdGlvblByb3ZpZGVyLmh0bWw1TW9kZSh0cnVlKTtcbiAgICBpZiAod2luZG93LmNvcmRvdmEgJiYgd2luZG93LmNvcmRvdmEucGx1Z2lucyAmJiB3aW5kb3cuY29yZG92YS5wbHVnaW5zLktleWJvYXJkKSB7XG4gICAgICBjb3Jkb3ZhLnBsdWdpbnMuS2V5Ym9hcmQuaGlkZUtleWJvYXJkQWNjZXNzb3J5QmFyKHRydWUpO1xuICAgIH1cbiAgICBpZiAod2luZG93LlN0YXR1c0Jhcikge1xuICAgICAgLy8gb3JnLmFwYWNoZS5jb3Jkb3ZhLnN0YXR1c2JhciByZXF1aXJlZFxuICAgICAgU3RhdHVzQmFyLnN0eWxlTGlnaHRDb250ZW50KCk7XG4gICAgfVxuICB9KTtcbn0pXG5cbi8vVE9ETzpUaGlzIGlzIG5lZWRlZCB0byBzZXQgdG8gYWNjZXNzIHRoZSBwcm94eSB1cmwgdGhhdCB3aWxsIHRoZW4gaW4gdGhlIGlvbmljLnByb2plY3QgZmlsZSByZWRpcmVjdCBpdCB0byB0aGUgY29ycmVjdCBVUkxcbi5jb25zdGFudCgnQXBpRW5kcG9pbnQnLCB7XG4gIHVybCA6ICcvYXBpJyxcbiAgc2Vzc2lvbjogJy9zZXNzaW9uJ1xufSlcblxuLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyKSB7XG4gIC8vIElvbmljIHVzZXMgQW5ndWxhclVJIFJvdXRlciB3aGljaCB1c2VzIHRoZSBjb25jZXB0IG9mIHN0YXRlc1xuICAvLyBMZWFybiBtb3JlIGhlcmU6IGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyLXVpL3VpLXJvdXRlclxuICAvLyBTZXQgdXAgdGhlIHZhcmlvdXMgc3RhdGVzIHdoaWNoIHRoZSBhcHAgY2FuIGJlIGluLlxuICAvLyBFYWNoIHN0YXRlJ3MgY29udHJvbGxlciBjYW4gYmUgZm91bmQgaW4gY29udHJvbGxlcnMuanNcbiAgLy8gaWYgbm9uZSBvZiB0aGUgYWJvdmUgc3RhdGVzIGFyZSBtYXRjaGVkLCB1c2UgdGhpcyBhcyB0aGUgZmFsbGJhY2tcbiAgLy8gJHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZSgnL2NoYWxsZW5nZS92aWV3Jyk7IC8vVE9ETzogQWxiZXJ0IHRlc3RpbmcgdGhpcyByb3V0ZVxuXG4gICR1cmxSb3V0ZXJQcm92aWRlci5vdGhlcndpc2UoJy93ZWxjb21lJyk7IC8vIFRPRE86IFJpY2hhcmQgdGVzdGluZyB0aGlzIHJvdXRlXG4gIC8vJHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZSgnL3RhYi9jaGFsbGVuZ2UnKTsgLy9UT0RPOiBUb255IHRlc3RpbmcgdGhpcyByb3V0ZVxuICAvLyAkdXJsUm91dGVyUHJvdmlkZXIub3RoZXJ3aXNlKCd3ZWxjb21lJyk7XG5cbn0pXG4vL1xuXG4vLy8vcnVuIGJsb2NrczogaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8yMDY2MzA3Ni9hbmd1bGFyanMtYXBwLXJ1bi1kb2N1bWVudGF0aW9uXG4vL1VzZSBydW4gbWV0aG9kIHRvIHJlZ2lzdGVyIHdvcmsgd2hpY2ggc2hvdWxkIGJlIHBlcmZvcm1lZCB3aGVuIHRoZSBpbmplY3RvciBpcyBkb25lIGxvYWRpbmcgYWxsIG1vZHVsZXMuXG4vL2h0dHA6Ly9kZXZkYWN0aWMuY29tL3VzZXItYXV0aC1hbmd1bGFyanMtaW9uaWMvXG5cbi5ydW4oZnVuY3Rpb24gKCRyb290U2NvcGUsICRzdGF0ZSwgQXV0aFNlcnZpY2UsIEFVVEhfRVZFTlRTKSB7XG5cbiAgICB2YXIgZGVzdGluYXRpb25TdGF0ZVJlcXVpcmVzQXV0aCA9IGZ1bmN0aW9uIChzdGF0ZSkge1xuICAgICAgICAvL2NvbnNvbGUubG9nKCdjbCAtIGRlc3RpbmF0aW9uU3RhdGVSZXF1aXJlc0F1dGgnLCdzdGF0ZS5kYXRhJyxzdGF0ZS5kYXRhLCdzdGF0ZS5kYXRhLmF1dGgnLHN0YXRlLmRhdGEuYXV0aGVudGljYXRlKTtcbiAgICAgICAgcmV0dXJuIHN0YXRlLmRhdGEgJiYgc3RhdGUuZGF0YS5hdXRoZW50aWNhdGU7XG4gICAgfTtcbiAgIFxuICAgIC8vVE9ETzogTmVlZCB0byBtYWtlIGF1dGhlbnRpY2F0aW9uIG1vcmUgcm9idXN0IGJlbG93IGRvZXMgbm90IGZvbGxvdyBGU0cgKGV0LiBhbC4pXG4gICAgLy9UT0RPOiBDdXJyZW50bHkgaXQgaXMgbm90IGNoZWNraW5nIHRoZSBiYWNrZW5kIHJvdXRlIHJvdXRlci5nZXQoJy90b2tlbicpXG4gICAgJHJvb3RTY29wZS4kb24oJyRzdGF0ZUNoYW5nZVN0YXJ0JywgZnVuY3Rpb24gKGV2ZW50LHRvU3RhdGUsIHRvUGFyYW1zKSB7XG5cbiAgICAgICAgLy9jb25zb2xlLmxvZygndXNlciBBdXRoZW50aWNhdGVkJywgQXV0aFNlcnZpY2UuaXNBdXRoZW50aWNhdGVkKCkpO1xuXG4gICAgICAgIGlmICghZGVzdGluYXRpb25TdGF0ZVJlcXVpcmVzQXV0aCh0b1N0YXRlKSkge1xuICAgICAgICAgICAgLy8gVGhlIGRlc3RpbmF0aW9uIHN0YXRlIGRvZXMgbm90IHJlcXVpcmUgYXV0aGVudGljYXRpb25cbiAgICAgICAgICAgIC8vIFNob3J0IGNpcmN1aXQgd2l0aCByZXR1cm4uXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoQXV0aFNlcnZpY2UuaXNBdXRoZW50aWNhdGVkKCkpIHtcbiAgICAgICAgICAgIC8vIFRoZSB1c2VyIGlzIGF1dGhlbnRpY2F0ZWQuXG4gICAgICAgICAgICAvLyBTaG9ydCBjaXJjdWl0IHdpdGggcmV0dXJuLlxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy9UT0RPOiBOb3Qgc3VyZSBob3cgdG8gcHJvY2VlZCBoZXJlXG4gICAgICAgICRzdGF0ZS5nbygnbG9naW4nKTsgLy9pZiBhYm92ZSBmYWlscywgZ290byBsb2dpblxuICAgIH0pO1xuICAvLyAkdXJsUm91dGVyUHJvdmlkZXIub3RoZXJ3aXNlKCcvc2lnbnVwJyk7IC8vIFRPRE86IFJpY2hhcmQgdGVzdGluZyB0aGlzIHJvdXRlXG4gIC8vJHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZSgnL2NoYWxsZW5nZS92aWV3Jyk7IC8vVE9ETzogVG9ueSB0ZXN0aW5nIHRoaXMgcm91dGVcblxufSk7XG5cbmFwcC5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIpe1xuICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ21haW4nLCB7XG4gICAgICAgdGVtcGxhdGVVcmw6ICdmZWF0dXJlcy9jb21tb24vbWFpbi9tYWluLmh0bWwnLFxuICAgICAgIGNvbnRyb2xsZXI6ICdNZW51Q3RybCdcbiAgIH0pO1xufSk7XG5cbmFwcC5jb250cm9sbGVyKCdNYWluQ3RybCcsIGZ1bmN0aW9uKCRyb290U2NvcGUsJHNjb3BlLCAkaW9uaWNTaWRlTWVudURlbGVnYXRlLCAkaW9uaWNQb3B1cCwgJHN0YXRlLCBBdXRoU2VydmljZSxBVVRIX0VWRU5UUyl7XG4gICAgJHNjb3BlLnVzZXJuYW1lID0gQXV0aFNlcnZpY2UudXNlcm5hbWUoKTtcbiAgICAvL2NvbnNvbGUubG9nKEF1dGhTZXJ2aWNlLmlzQXV0aGVudGljYXRlZCgpKTtcblxuICAgICRzY29wZS4kb24oQVVUSF9FVkVOVFMubm90QXV0aG9yaXplZCwgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgdmFyIGFsZXJ0UG9wdXAgPSAkaW9uaWNQb3B1cC5hbGVydCh7XG4gICAgICAgICAgICB0aXRsZTogJ1VuYXV0aG9yaXplZCEnLFxuICAgICAgICAgICAgdGVtcGxhdGU6ICdZb3UgYXJlIG5vdCBhbGxvd2VkIHRvIGFjY2VzcyB0aGlzIHJlc291cmNlLidcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICAkc2NvcGUuJG9uKEFVVEhfRVZFTlRTLm5vdEF1dGhlbnRpY2F0ZWQsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgIEF1dGhTZXJ2aWNlLmxvZ291dCgpO1xuICAgICAgICAvLyRzdGF0ZS5nbygnbG9naW4nKTtcbiAgICAgICAgdmFyIGFsZXJ0UG9wdXAgPSAkaW9uaWNQb3B1cC5hbGVydCh7XG4gICAgICAgICAgICB0aXRsZTogJ1BsZWFzZSBSZXZpZXcnLFxuICAgICAgICAgICAgdGVtcGxhdGU6ICcnXG4gICAgICAgIH0pO1xuICAgIH0pO1xufSk7XG5cbmFwcC5jb250cm9sbGVyKCdNZW51Q3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgJGlvbmljU2lkZU1lbnVEZWxlZ2F0ZSwgJHN0YXRlLCBBdXRoU2VydmljZSwgJHJvb3RTY29wZSl7XG5cbiAgICAkc2NvcGUuc3RhdGVzID0gW1xuICAgICAgICB7XG4gICAgICAgICAgbmFtZSA6ICdBY2NvdW50JyxcbiAgICAgICAgICByZWYgOiBmdW5jdGlvbigpe3JldHVybiAnYWNjb3VudCc7fVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgbmFtZSA6ICdDaGFsbGVuZ2UnLFxuICAgICAgICAgIHJlZiA6IGZ1bmN0aW9uKCl7cmV0dXJuICdjaGFsbGVuZ2Uudmlldyc7fVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgbmFtZSA6ICdDaGF0cycsXG4gICAgICAgICAgcmVmOiBmdW5jdGlvbigpe3JldHVybiAnY2hhdHMnO31cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIG5hbWUgOiAnRXhlcmNpc20nLFxuICAgICAgICAgIHJlZjogZnVuY3Rpb24oKXtyZXR1cm4gJ2V4ZXJjaXNtLnZpZXcnO31cbiAgICAgICAgfVxuICAgIF07XG5cbiAgICAkc2NvcGUudG9nZ2xlTWVudVNob3cgPSBmdW5jdGlvbigpe1xuICAgICAgICByZXR1cm4gQXV0aFNlcnZpY2UuaXNBdXRoZW50aWNhdGVkKCk7XG4gICAgfTtcblxuICAgICRyb290U2NvcGUuJG9uKCdBdXRoJyxmdW5jdGlvbigpe1xuICAgICAgICRzY29wZS50b2dnbGVNZW51U2hvdygpO1xuICAgIH0pO1xuXG4gICAgLy9jb25zb2xlLmxvZyhBdXRoU2VydmljZS5pc0F1dGhlbnRpY2F0ZWQoKSk7XG4gICAgLy9pZihBdXRoU2VydmljZS5pc0F1dGhlbnRpY2F0ZWQoKSl7XG4gICAgJHNjb3BlLmNsaWNrSXRlbSA9IGZ1bmN0aW9uKHN0YXRlUmVmKXtcbiAgICAgICAgJGlvbmljU2lkZU1lbnVEZWxlZ2F0ZS50b2dnbGVMZWZ0KCk7XG4gICAgICAgICRzdGF0ZS5nbyhzdGF0ZVJlZigpKTsgLy9SQjogVXBkYXRlZCB0byBoYXZlIHN0YXRlUmVmIGFzIGEgZnVuY3Rpb24gaW5zdGVhZC5cbiAgICB9O1xuXG4gICAgJHNjb3BlLnRvZ2dsZU1lbnUgPSBmdW5jdGlvbigpe1xuICAgICAgICAkaW9uaWNTaWRlTWVudURlbGVnYXRlLnRvZ2dsZUxlZnQoKTtcbiAgICB9O1xuICAgIC8vfVxufSk7IiwiYXBwLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlciwgVVNFUl9ST0xFUyl7XG5cdC8vIEVhY2ggdGFiIGhhcyBpdHMgb3duIG5hdiBoaXN0b3J5IHN0YWNrOlxuXHQkc3RhdGVQcm92aWRlci5zdGF0ZSgnYWNjb3VudCcsIHtcblx0XHR1cmw6ICcvYWNjb3VudCcsXG5cdCAgICB0ZW1wbGF0ZVVybDogJ2ZlYXR1cmVzL2FjY291bnQvYWNjb3VudC5odG1sJyxcblx0XHRjb250cm9sbGVyOiAnQWNjb3VudEN0cmwnXG5cdFx0Ly8gLFxuXHRcdC8vIGRhdGE6IHtcblx0XHQvLyBcdGF1dGhlbnRpY2F0ZTogW1VTRVJfUk9MRVMucHVibGljXVxuXHRcdC8vIH1cblx0fSk7XG59KTtcblxuYXBwLmNvbnRyb2xsZXIoJ0FjY291bnRDdHJsJywgZnVuY3Rpb24oJHNjb3BlKSB7XG5cdCRzY29wZS5zZXR0aW5ncyA9IHtcblx0XHRlbmFibGVGcmllbmRzOiB0cnVlXG5cdH07XG59KTsiLCJhcHAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKXtcblx0JHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2NoYWxsZW5nZScsIHtcblx0XHR0ZW1wbGF0ZVVybCA6ICdmZWF0dXJlcy9jaGFsbGVuZ2UvY2hhbGxlbmdlLmh0bWwnLFxuXHRcdGFic3RyYWN0IDogdHJ1ZVxuXHR9KTtcbn0pO1xuXG5hcHAuZmFjdG9yeSgnQ2hhbGxlbmdlRmFjdG9yeScsIGZ1bmN0aW9uKCRodHRwLCBBcGlFbmRwb2ludCwgJHJvb3RTY29wZSwgJHN0YXRlKXtcblxuXHR2YXIgcHJvYmxlbSA9ICcnO1xuXHR2YXIgc3VibWlzc2lvbiA9ICcnO1xuXG5cdHZhciBydW5IaWRkZW4gPSBmdW5jdGlvbihjb2RlKSB7XG5cdCAgICB2YXIgaW5kZXhlZERCID0gbnVsbDtcblx0ICAgIHZhciBsb2NhdGlvbiA9IG51bGw7XG5cdCAgICB2YXIgbmF2aWdhdG9yID0gbnVsbDtcblx0ICAgIHZhciBvbmVycm9yID0gbnVsbDtcblx0ICAgIHZhciBvbm1lc3NhZ2UgPSBudWxsO1xuXHQgICAgdmFyIHBlcmZvcm1hbmNlID0gbnVsbDtcblx0ICAgIHZhciBzZWxmID0gbnVsbDtcblx0ICAgIHZhciB3ZWJraXRJbmRleGVkREIgPSBudWxsO1xuXHQgICAgdmFyIHBvc3RNZXNzYWdlID0gbnVsbDtcblx0ICAgIHZhciBjbG9zZSA9IG51bGw7XG5cdCAgICB2YXIgb3BlbkRhdGFiYXNlID0gbnVsbDtcblx0ICAgIHZhciBvcGVuRGF0YWJhc2VTeW5jID0gbnVsbDtcblx0ICAgIHZhciB3ZWJraXRSZXF1ZXN0RmlsZVN5c3RlbSA9IG51bGw7XG5cdCAgICB2YXIgd2Via2l0UmVxdWVzdEZpbGVTeXN0ZW1TeW5jID0gbnVsbDtcblx0ICAgIHZhciB3ZWJraXRSZXNvbHZlTG9jYWxGaWxlU3lzdGVtU3luY1VSTCA9IG51bGw7XG5cdCAgICB2YXIgd2Via2l0UmVzb2x2ZUxvY2FsRmlsZVN5c3RlbVVSTCA9IG51bGw7XG5cdCAgICB2YXIgYWRkRXZlbnRMaXN0ZW5lciA9IG51bGw7XG5cdCAgICB2YXIgZGlzcGF0Y2hFdmVudCA9IG51bGw7XG5cdCAgICB2YXIgcmVtb3ZlRXZlbnRMaXN0ZW5lciA9IG51bGw7XG5cdCAgICB2YXIgZHVtcCA9IG51bGw7XG5cdCAgICB2YXIgb25vZmZsaW5lID0gbnVsbDtcblx0ICAgIHZhciBvbm9ubGluZSA9IG51bGw7XG5cdCAgICB2YXIgaW1wb3J0U2NyaXB0cyA9IG51bGw7XG5cdCAgICB2YXIgY29uc29sZSA9IG51bGw7XG5cdCAgICB2YXIgYXBwbGljYXRpb24gPSBudWxsO1xuXG5cdCAgICByZXR1cm4gZXZhbChjb2RlKTtcblx0fTtcblxuXHQvLyBjb252ZXJ0cyB0aGUgb3V0cHV0IGludG8gYSBzdHJpbmdcblx0dmFyIHN0cmluZ2lmeSA9IGZ1bmN0aW9uKG91dHB1dCkge1xuXHQgICAgdmFyIHJlc3VsdDtcblxuXHQgICAgaWYgKHR5cGVvZiBvdXRwdXQgPT0gJ3VuZGVmaW5lZCcpIHtcblx0ICAgICAgICByZXN1bHQgPSAndW5kZWZpbmVkJztcblx0ICAgIH0gZWxzZSBpZiAob3V0cHV0ID09PSBudWxsKSB7XG5cdCAgICAgICAgcmVzdWx0ID0gJ251bGwnO1xuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgICByZXN1bHQgPSBKU09OLnN0cmluZ2lmeShvdXRwdXQpIHx8IG91dHB1dC50b1N0cmluZygpO1xuXHQgICAgfVxuXG5cdCAgICByZXR1cm4gcmVzdWx0O1xuXHR9O1xuXG5cdHZhciBydW4gPSBmdW5jdGlvbihjb2RlKSB7XG5cdCAgICB2YXIgcmVzdWx0ID0ge1xuXHQgICAgICAgIGlucHV0OiBjb2RlLFxuXHQgICAgICAgIG91dHB1dDogbnVsbCxcblx0ICAgICAgICBlcnJvcjogbnVsbFxuXHQgICAgfTtcblxuXHQgICAgdHJ5IHtcblx0ICAgICAgICByZXN1bHQub3V0cHV0ID0gc3RyaW5naWZ5KHJ1bkhpZGRlbihjb2RlKSk7XG5cdCAgICB9IGNhdGNoKGUpIHtcblx0ICAgICAgICByZXN1bHQuZXJyb3IgPSBlLm1lc3NhZ2U7XG5cdCAgICB9XG5cdCAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG5cblxuXHRyZXR1cm4ge1xuXHRcdGdldENoYWxsZW5nZSA6IGZ1bmN0aW9uKGlkKXtcblx0XHRcdHJldHVybiAkaHR0cC5nZXQoQXBpRW5kcG9pbnQudXJsICsgJy9jaGFsbGVuZ2UvJyArIGlkKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcblx0XHRcdFx0cHJvYmxlbSA9IHJlc3BvbnNlLmRhdGE7XG5cdFx0XHRcdHN1Ym1pc3Npb24gPSBwcm9ibGVtLnNlc3Npb24uc2V0dXAgfHwgJyc7XG5cdFx0XHRcdCRyb290U2NvcGUuJGJyb2FkY2FzdCgncHJvYmxlbVVwZGF0ZWQnKTtcblx0XHRcdFx0cmV0dXJuIHJlc3BvbnNlLmRhdGE7XG5cdFx0XHR9KTtcblx0XHR9LFxuXHRcdHNldFN1Ym1pc3Npb24gOiBmdW5jdGlvbihjb2RlKXtcblx0XHRcdHN1Ym1pc3Npb24gPSBjb2RlO1xuXHRcdFx0JHJvb3RTY29wZS4kYnJvYWRjYXN0KCdzdWJtaXNzaW9uVXBkYXRlZCcpO1xuXHRcdH0sXG5cdFx0Y29tcGlsZVN1Ym1pc3Npb246IGZ1bmN0aW9uKGNvZGUpe1xuXHRcdFx0cmV0dXJuIHJ1bihjb2RlKTtcblx0XHR9LFxuXHRcdGdldFN1Ym1pc3Npb24gOiBmdW5jdGlvbigpe1xuXHRcdFx0cmV0dXJuIHN1Ym1pc3Npb247XG5cdFx0fSxcblx0XHRnZXRQcm9ibGVtIDogZnVuY3Rpb24oKXtcblx0XHRcdHJldHVybiBwcm9ibGVtO1xuXHRcdH1cblx0fTtcbn0pOyIsImFwcC5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIpe1xuXHQkc3RhdGVQcm92aWRlci5zdGF0ZSgnY2hhbGxlbmdlLmNvZGUnLCB7XG5cdFx0dXJsIDogJy9jaGFsbGVuZ2UvY29kZScsXG5cdFx0dmlld3M6IHtcblx0XHRcdCd0YWItY29kZScgOiB7XG5cdFx0XHRcdHRlbXBsYXRlVXJsIDogJ2ZlYXR1cmVzL2NoYWxsZW5nZS1jb2RlL2NoYWxsZW5nZS1jb2RlLmh0bWwnLFxuXHRcdFx0XHRjb250cm9sbGVyIDogJ0NoYWxsZW5nZUNvZGVDdHJsJ1xuXHRcdFx0fVxuXHRcdH1cblx0XHQvLyAsXG5cdFx0Ly8gb25FbnRlciA6IGZ1bmN0aW9uKENoYWxsZW5nZUZhY3RvcnksICRzdGF0ZSl7XG5cdFx0Ly8gXHRpZihDaGFsbGVuZ2VGYWN0b3J5LmdldFByb2JsZW0oKS5sZW5ndGggPT09IDApe1xuXHRcdC8vIFx0XHQkc3RhdGUuZ28oJ2NoYWxsZW5nZS52aWV3Jyk7XG5cdFx0Ly8gXHR9XG5cdFx0Ly8gfVxuXHR9KTtcbn0pO1xuXG5hcHAuY29udHJvbGxlcignQ2hhbGxlbmdlQ29kZUN0cmwnLCBmdW5jdGlvbigkc2NvcGUsJHN0YXRlLCAkcm9vdFNjb3BlLCBDaGFsbGVuZ2VGYWN0b3J5LCBDaGFsbGVuZ2VGb290ZXJGYWN0b3J5KXtcblxuXHQkc2NvcGUuZm9vdGVySG90a2V5cyA9IENoYWxsZW5nZUZvb3RlckZhY3RvcnkuZ2V0SG90a2V5cygpO1xuXG5cdGNvbnNvbGUubG9nKFwiZm9vdGVySG90a2V5cywgXCIsICRzY29wZS5mb290ZXJIb3RrZXlzKTtcblxuXHQvL0NoYWxsZW5nZSBTdWJtaXRcblx0JHNjb3BlLnRleHQgPSBDaGFsbGVuZ2VGYWN0b3J5LmdldFN1Ym1pc3Npb24oKSB8fCAndGV4dCc7XG5cblx0Ly9pbml0aWFsaXplIENvZGVNaXJyb3Jcblx0dmFyIG15Q29kZU1pcnJvciA9IENvZGVNaXJyb3IuZnJvbVRleHRBcmVhKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb2RlJyksIHtcblx0XHRsaW5lTnVtYmVycyA6IHRydWUsXG5cdFx0bW9kZTogJ2phdmFzY3JpcHQnLFxuXHRcdGF1dG9mb2N1cyA6IHRydWUsXG5cdFx0dGhlbWUgOiAndHdpbGlnaHQnLFxuXHRcdGxpbmVXcmFwcGluZzogdHJ1ZVxuXHR9KTtcblxuXHRteUNvZGVNaXJyb3IucmVwbGFjZVNlbGVjdGlvbigkc2NvcGUudGV4dCk7XG5cblx0JHNjb3BlLnVwZGF0ZVRleHQgPSBmdW5jdGlvbigpe1xuXHRcdCRzY29wZS50ZXh0ID0gbXlDb2RlTWlycm9yLmdldFZhbHVlKCk7XG5cdFx0Ly9jaGVjayBpZiBkaWdlc3QgaXMgaW4gcHJvZ3Jlc3Ncblx0XHRpZighJHNjb3BlLiQkcGhhc2UpIHtcblx0XHQgICRzY29wZS4kYXBwbHkoKTtcblx0XHR9XG5cdH07XG5cblx0JHNjb3BlLmluc2VydEZ1bmMgPSBmdW5jdGlvbihwYXJhbSl7XG5cdFx0Ly9naXZlbiBhIHBhcmFtLCB3aWxsIGluc2VydCBjaGFyYWN0ZXJzIHdoZXJlIGN1cnNvciBpc1xuXHRcdGNvbnNvbGUubG9nKFwiaW5zZXJ0aW5nOiBcIiwgcGFyYW0pO1xuXHRcdG15Q29kZU1pcnJvci5yZXBsYWNlU2VsZWN0aW9uKHBhcmFtKTtcblx0fTtcblxuICAgIG15Q29kZU1pcnJvci5vbihcImNoYW5nZVwiLCBmdW5jdGlvbiAobXlDb2RlTWlycm9yLCBjaGFuZ2VPYmope1xuICAgIFx0JHNjb3BlLnVwZGF0ZVRleHQoKTtcbiAgICB9KTtcblxuXG5cdCRzY29wZS5idXR0b25zID0ge1xuXHRcdGNvbXBpbGUgOiAnQ29tcGlsZScsXG5cdFx0ZGlzbWlzcyA6ICdEaXNtaXNzJ1xuXHR9O1xuXG5cdC8vICRyb290U2NvcGUuJG9uKCdwcm9ibGVtVXBkYXRlZCcsIGZ1bmN0aW9uKGUpe1xuXHQvLyBcdCRzY29wZS5wcm9qZWN0SWQgPSBDaGFsbGVuZ2VGYWN0b3J5LmdldFByb2JsZW0oKS5zZXNzaW9uLnByb2plY3RJZDtcblx0Ly8gXHQkc2NvcGUuc29sdXRpb25JZCA9IENoYWxsZW5nZUZhY3RvcnkuZ2V0UHJvYmxlbSgpLnNlc3Npb24uc29sdXRpb25JZDtcblx0Ly8gXHQkc2NvcGUudGV4dCA9IENoYWxsZW5nZUZhY3RvcnkuZ2V0UHJvYmxlbSgpLnNlc3Npb24uc2V0dXA7XG5cdC8vIH0pO1xuXG5cdCRzY29wZS5jb21waWxlQ2hhbGxlbmdlID0gZnVuY3Rpb24odGV4dCl7XG5cdFx0Q2hhbGxlbmdlRmFjdG9yeS5zZXRTdWJtaXNzaW9uKHRleHQpO1xuXHRcdCRzdGF0ZS5nbygnY2hhbGxlbmdlLmNvbXBpbGUnKTtcblx0fTtcblxuXHQvLyAkc2NvcGUuZGlzbWlzc0NoYWxsZW5nZSA9IGZ1bmN0aW9uKCl7XG5cdC8vIFx0dmFyIGlkID0gJ0E5UUtrNlNtUnBEY3JpVS1ITVFyJztcblx0Ly8gXHRDaGFsbGVuZ2VGYWN0b3J5LmdldENoYWxsZW5nZShpZCkudGhlbihmdW5jdGlvbihkYXRhKXtcblx0Ly8gXHRcdCRzdGF0ZS5nbygnY2hhbGxlbmdlLnZpZXcnKTtcblx0Ly8gXHR9KTtcblx0Ly8gfTtcblxufSk7IiwiYXBwLmZhY3RvcnkoJ0NoYWxsZW5nZUZvb3RlckZhY3RvcnknLCBmdW5jdGlvbigpe1xuXG5cdHZhciBmb290ZXJIb3RrZXlzID0gW1xuXHRcdHtcblx0XHRcdGRpc3BsYXk6IFwiWyBdXCIsXG5cdFx0XHRpbnNlcnRQYXJhbTogXCJbXVwiXG5cdFx0fSxcblx0XHR7XG5cdFx0XHRkaXNwbGF5OiBcInsgfVwiLFxuXHRcdFx0aW5zZXJ0UGFyYW06IFwie31cIlxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0ZGlzcGxheTogXCIoIClcIixcblx0XHRcdGluc2VydFBhcmFtOiBcIigpXCJcblx0XHR9LFxuXHRcdHtcblx0XHRcdGRpc3BsYXk6IFwiLy9cIixcblx0XHRcdGluc2VydFBhcmFtOiBcIi8vXCJcblx0XHR9LFxuXHRcdHtcblx0XHRcdGRpc3BsYXk6IFwiPVwiLFxuXHRcdFx0aW5zZXJ0UGFyYW06IFwiPVwiXG5cdFx0fSxcblx0XHR7XG5cdFx0XHRkaXNwbGF5OiBcIjxcIixcblx0XHRcdGluc2VydFBhcmFtOiBcIjxcIlxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0ZGlzcGxheTogXCI+XCIsXG5cdFx0XHRpbnNlcnRQYXJhbTogXCI+XCJcblx0XHR9LFxuXHRcdHtcblx0XHRcdGRpc3BsYXk6IFwiLyogICovXCIsXG5cdFx0XHRpbnNlcnRQYXJhbTogXCIvKiAqL1wiXG5cdFx0fSxcblxuXHRdO1xuXG5cdHJldHVybiB7XG5cdFx0Z2V0SG90a2V5cyA6IGZ1bmN0aW9uKCl7XG5cdFx0XHRyZXR1cm4gZm9vdGVySG90a2V5cztcblx0XHR9XG5cdH07XG59KTsiLCJhcHAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKXtcblx0JHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2NoYWxsZW5nZS5jb21waWxlJywge1xuXHRcdHVybCA6ICcvY2hhbGxlbmdlL2NvbXBpbGUnLFxuXHRcdHZpZXdzIDoge1xuXHRcdFx0J3RhYi1jb21waWxlJyA6IHtcblx0XHRcdFx0dGVtcGxhdGVVcmwgOiAnZmVhdHVyZXMvY2hhbGxlbmdlLWNvbXBpbGUvY2hhbGxlbmdlLWNvbXBpbGUuaHRtbCcsXG5cdFx0XHRcdGNvbnRyb2xsZXI6ICdDaGFsbGVuZ2VDb21waWxlQ3RybCdcblx0XHRcdH1cblx0XHR9XG5cdFx0Ly8gLFxuXHRcdC8vIG9uRW50ZXIgOiBmdW5jdGlvbihDaGFsbGVuZ2VGYWN0b3J5LCAkc3RhdGUpe1xuXHRcdC8vIFx0aWYoQ2hhbGxlbmdlRmFjdG9yeS5nZXRTdWJtaXNzaW9uKCkubGVuZ3RoID09PSAwKXtcblx0XHQvLyBcdFx0JHN0YXRlLmdvKCdjaGFsbGVuZ2UudmlldycpO1xuXHRcdC8vIFx0fVxuXHRcdC8vIH1cblx0fSk7XG59KTtcblxuYXBwLmNvbnRyb2xsZXIoJ0NoYWxsZW5nZUNvbXBpbGVDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBDaGFsbGVuZ2VGYWN0b3J5KXtcblx0JHNjb3BlLnF1ZXN0aW9uID0gQ2hhbGxlbmdlRmFjdG9yeS5nZXRTdWJtaXNzaW9uKCk7XG5cdGNvbnNvbGUubG9nKCRzY29wZS5xdWVzdGlvbik7XG5cdHZhciByZXN1bHRzID0gQ2hhbGxlbmdlRmFjdG9yeS5jb21waWxlU3VibWlzc2lvbigkc2NvcGUucXVlc3Rpb24pO1xuXHQkc2NvcGUucmVzdWx0cyA9IHJlc3VsdHM7XG5cdCRzY29wZS5vdXRwdXQgPSBDaGFsbGVuZ2VGYWN0b3J5LmNvbXBpbGVTdWJtaXNzaW9uKCRzY29wZS5xdWVzdGlvbikub3V0cHV0O1xuXHQkc2NvcGUuZXJyb3IgPSBDaGFsbGVuZ2VGYWN0b3J5LmNvbXBpbGVTdWJtaXNzaW9uKCRzY29wZS5xdWVzdGlvbikuZXJyb3I7XG5cblx0Ly9pbml0aWFsaXplIENvZGVNaXJyb3Jcblx0dmFyIGNtQ29tcGlsZSA9IENvZGVNaXJyb3IuZnJvbVRleHRBcmVhKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb21waWxlJyksIHtcblx0XHRyZWFkT25seSA6ICdub2N1cnNvcicsXG5cdFx0bW9kZTogJ2phdmFzY3JpcHQnLFxuXHRcdGF1dG9mb2N1cyA6IHRydWUsXG5cdFx0dGhlbWUgOiAndHdpbGlnaHQnLFxuXHRcdGxpbmVXcmFwcGluZzogdHJ1ZVxuXHR9KTtcblxuXHRjbUNvbXBpbGUucmVwbGFjZVNlbGVjdGlvbigkc2NvcGUucXVlc3Rpb24pO1xuXG5cblx0dmFyIGNtUmVzdWx0cyA9IENvZGVNaXJyb3IuZnJvbVRleHRBcmVhKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZXN1bHRzJyksIHtcblx0XHRyZWFkT25seSA6ICdub2N1cnNvcicsXG5cdFx0bW9kZTogJ2phdmFzY3JpcHQnLFxuXHRcdGF1dG9mb2N1cyA6IHRydWUsXG5cdFx0dGhlbWUgOiAndHdpbGlnaHQnLFxuXHRcdGxpbmVXcmFwcGluZzogdHJ1ZVxuXHR9KTtcblxuXHRjbVJlc3VsdHMucmVwbGFjZVNlbGVjdGlvbigkc2NvcGUub3V0cHV0KTtcblxuXHQkc2NvcGUuJG9uKCdzdWJtaXNzaW9uVXBkYXRlZCcsIGZ1bmN0aW9uKGUpe1xuXHRcdCRzY29wZS5xdWVzdGlvbiA9IENoYWxsZW5nZUZhY3RvcnkuZ2V0U3VibWlzc2lvbigpO1xuXHRcdHJlc3VsdHMgPSBDaGFsbGVuZ2VGYWN0b3J5LmNvbXBpbGVTdWJtaXNzaW9uKCRzY29wZS5xdWVzdGlvbik7XG5cdFx0JHNjb3BlLnJlc3VsdHMgPSByZXN1bHRzO1xuXHRcdCRzY29wZS5vdXRwdXQgPSBDaGFsbGVuZ2VGYWN0b3J5LmNvbXBpbGVTdWJtaXNzaW9uKCRzY29wZS5xdWVzdGlvbikub3V0cHV0O1xuXHRcdCRzY29wZS5lcnJvciA9IENoYWxsZW5nZUZhY3RvcnkuY29tcGlsZVN1Ym1pc3Npb24oJHNjb3BlLnF1ZXN0aW9uKS5lcnJvcjtcblx0XHRjbVJlc3VsdHMuc2V0VmFsdWUoJHNjb3BlLm91dHB1dCk7XG5cblx0fSk7XG59KTsiLCJhcHAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKXtcblx0JHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2NoYWxsZW5nZS52aWV3Jywge1xuXHRcdHVybDogJy9jaGFsbGVuZ2UvdmlldycsXG5cdFx0dmlld3M6IHtcblx0XHRcdCd0YWItdmlldycgOiB7XG5cdFx0XHRcdHRlbXBsYXRlVXJsOiAnZmVhdHVyZXMvY2hhbGxlbmdlLXZpZXcvY2hhbGxlbmdlLXZpZXcuaHRtbCcsXG5cdFx0XHRcdGNvbnRyb2xsZXI6ICdDaGFsbGVuZ2VWaWV3Q3RybCdcblx0XHRcdH1cblx0XHR9XG5cdH0pO1xufSk7XG5cbmFwcC5jb250cm9sbGVyKCdDaGFsbGVuZ2VWaWV3Q3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgQ2hhbGxlbmdlRmFjdG9yeSwgJHN0YXRlLCAkaW9uaWNTbGlkZUJveERlbGVnYXRlKXtcblxuXHQvL0NvbnRyb2xzIFNsaWRlXG5cdCRzY29wZS5zbGlkZUhhc0NoYWxsZW5nZWQgPSBmdW5jdGlvbihpbmRleCl7XG5cdFx0JGlvbmljU2xpZGVCb3hEZWxlZ2F0ZS5zbGlkZShpbmRleCk7XG5cdH07XG5cblx0Ly9DaGFsbGVuZ2UgVmlld1xuXHQkc2NvcGUuY2hhbGxlbmdlID0gQ2hhbGxlbmdlRmFjdG9yeS5nZXRQcm9ibGVtKCkgfHwgXCJUZXN0XCI7XG5cblx0Ly8gJHNjb3BlLiRvbigncHJvYmxlbVVwZGF0ZWQnLCBmdW5jdGlvbihlKXtcblx0Ly8gXHQkc2NvcGUuY2hhbGxlbmdlID0gQ2hhbGxlbmdlRmFjdG9yeS5nZXRQcm9ibGVtKCk7XG5cdC8vIH0pO1xuXG5cbn0pOyIsImFwcC5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIsIFVTRVJfUk9MRVMpe1xuXG4gICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdjaGF0cycsIHtcbiAgICAgIHVybDogJy9jaGF0cycsXG4gICAgICB0ZW1wbGF0ZVVybDogJ2ZlYXR1cmVzL2NoYXRzL3RhYi1jaGF0cy5odG1sJyxcbiAgICAgIGNvbnRyb2xsZXI6ICdDaGF0c0N0cmwnLFxuICAgICAgZGF0YToge1xuICAgICAgICBhdXRoZW50aWNhdGU6IFtVU0VSX1JPTEVTLnB1YmxpY11cbiAgICAgIH1cbiAgICB9KVxuICAgIC5zdGF0ZSgnY2hhdC1kZXRhaWwnLCB7XG4gICAgICB1cmw6ICcvY2hhdHMvOmNoYXRJZCcsXG4gICAgICB0ZW1wbGF0ZVVybDogJ2ZlYXR1cmVzL2NoYXRzL2NoYXQtZGV0YWlsLmh0bWwnLFxuICAgICAgY29udHJvbGxlcjogJ0NoYXREZXRhaWxDdHJsJ1xuICAgIH0pO1xufSk7XG5cbmFwcC5jb250cm9sbGVyKCdDaGF0c0N0cmwnLCBmdW5jdGlvbigkc2NvcGUsIENoYXRzKSB7XG4gICRzY29wZS5jaGF0cyA9IENoYXRzLmFsbCgpO1xuICAkc2NvcGUucmVtb3ZlID0gZnVuY3Rpb24oY2hhdCkge1xuICAgIENoYXRzLnJlbW92ZShjaGF0KTtcbiAgfTtcbn0pO1xuXG5hcHAuY29udHJvbGxlcignQ2hhdERldGFpbEN0cmwnLCBmdW5jdGlvbigkc2NvcGUsICRzdGF0ZVBhcmFtcywgQ2hhdHMpIHtcbiAgJHNjb3BlLmNoYXQgPSBDaGF0cy5nZXQoJHN0YXRlUGFyYW1zLmNoYXRJZCk7XG59KTtcblxuYXBwLmZhY3RvcnkoJ0NoYXRzJywgZnVuY3Rpb24oKSB7XG4gIC8vIE1pZ2h0IHVzZSBhIHJlc291cmNlIGhlcmUgdGhhdCByZXR1cm5zIGEgSlNPTiBhcnJheVxuXG4gIC8vIFNvbWUgZmFrZSB0ZXN0aW5nIGRhdGFcbiAgdmFyIGNoYXRzID0gW3tcbiAgICBpZDogMCxcbiAgICBuYW1lOiAnQmVuIFNwYXJyb3cnLFxuICAgIGxhc3RUZXh0OiAnWW91IG9uIHlvdXIgd2F5PycsXG4gICAgZmFjZTogJ2h0dHBzOi8vcGJzLnR3aW1nLmNvbS9wcm9maWxlX2ltYWdlcy81MTQ1NDk4MTE3NjUyMTExMzYvOVNnQXVIZVkucG5nJ1xuICB9LCB7XG4gICAgaWQ6IDEsXG4gICAgbmFtZTogJ01heCBMeW54JyxcbiAgICBsYXN0VGV4dDogJ0hleSwgaXRcXCdzIG5vdCBtZScsXG4gICAgZmFjZTogJ2h0dHBzOi8vYXZhdGFyczMuZ2l0aHVidXNlcmNvbnRlbnQuY29tL3UvMTEyMTQ/dj0zJnM9NDYwJ1xuICB9LHtcbiAgICBpZDogMixcbiAgICBuYW1lOiAnQWRhbSBCcmFkbGV5c29uJyxcbiAgICBsYXN0VGV4dDogJ0kgc2hvdWxkIGJ1eSBhIGJvYXQnLFxuICAgIGZhY2U6ICdodHRwczovL3Bicy50d2ltZy5jb20vcHJvZmlsZV9pbWFnZXMvNDc5MDkwNzk0MDU4Mzc5MjY0Lzg0VEtqX3FhLmpwZWcnXG4gIH0sIHtcbiAgICBpZDogMyxcbiAgICBuYW1lOiAnUGVycnkgR292ZXJub3InLFxuICAgIGxhc3RUZXh0OiAnTG9vayBhdCBteSBtdWtsdWtzIScsXG4gICAgZmFjZTogJ2h0dHBzOi8vcGJzLnR3aW1nLmNvbS9wcm9maWxlX2ltYWdlcy80OTE5OTUzOTgxMzU3NjcwNDAvaWUyWl9WNmUuanBlZydcbiAgfSwge1xuICAgIGlkOiA0LFxuICAgIG5hbWU6ICdNaWtlIEhhcnJpbmd0b24nLFxuICAgIGxhc3RUZXh0OiAnVGhpcyBpcyB3aWNrZWQgZ29vZCBpY2UgY3JlYW0uJyxcbiAgICBmYWNlOiAnaHR0cHM6Ly9wYnMudHdpbWcuY29tL3Byb2ZpbGVfaW1hZ2VzLzU3ODIzNzI4MTM4NDg0MTIxNi9SM2FlMW42MS5wbmcnXG4gIH1dO1xuXG4gIHJldHVybiB7XG4gICAgYWxsOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBjaGF0cztcbiAgICB9LFxuICAgIHJlbW92ZTogZnVuY3Rpb24oY2hhdCkge1xuICAgICAgY2hhdHMuc3BsaWNlKGNoYXRzLmluZGV4T2YoY2hhdCksIDEpO1xuICAgIH0sXG4gICAgZ2V0OiBmdW5jdGlvbihjaGF0SWQpIHtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2hhdHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKGNoYXRzW2ldLmlkID09PSBwYXJzZUludChjaGF0SWQpKSB7XG4gICAgICAgICAgcmV0dXJuIGNoYXRzW2ldO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gIH07XG59KTtcbiIsImFwcC5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIpe1xuXHQvLyBFYWNoIHRhYiBoYXMgaXRzIG93biBuYXYgaGlzdG9yeSBzdGFjazpcblx0JHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2Vycm9yJywge1xuXHRcdHVybDogJy9lcnJvcicsXG5cdCAgICB0ZW1wbGF0ZVVybDogJ2ZlYXR1cmVzL2Vycm9yL2Vycm9yLmh0bWwnLFxuXHRcdGNvbnRyb2xsZXI6ICdFcnJvckN0cmwnXG5cdH0pO1xufSk7XG5cbmFwcC5jb250cm9sbGVyKCdFcnJvcicsIGZ1bmN0aW9uKCRzY29wZSkge1xuXHRcbn0pOyIsImFwcC5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIpe1xuXHQkc3RhdGVQcm92aWRlci5zdGF0ZSgnZXhlcmNpc20nLCB7XG5cdFx0dGVtcGxhdGVVcmwgOiAnZmVhdHVyZXMvZXhlcmNpc20vZXhlcmNpc20uaHRtbCcsXG5cdFx0YWJzdHJhY3QgOiB0cnVlLFxuXHRcdHJlc29sdmUgOiB7XG5cdFx0XHRtYXJrZG93biA6IGZ1bmN0aW9uKEF2YWlsYWJsZUV4ZXJjaXNlcywgRXhlcmNpc21GYWN0b3J5LCAkc3RhdGUpe1xuXHRcdFx0XHR2YXIgZXhlcmNpc2U7XG5cdFx0XHRcdGlmKEV4ZXJjaXNtRmFjdG9yeS5nZXRUZXN0U2NyaXB0KCkubGVuZ3RoID09PSAwKSB7XG5cdFx0XHRcdFx0ZXhlcmNpc2UgPSBBdmFpbGFibGVFeGVyY2lzZXMuZ2V0UmFuZG9tRXhlcmNpc2UoKTtcblx0XHRcdFx0XHRFeGVyY2lzbUZhY3Rvcnkuc2V0TmFtZShleGVyY2lzZS5uYW1lKTtcblx0XHRcdFx0XHRyZXR1cm4gRXhlcmNpc21GYWN0b3J5LmdldEV4dGVybmFsU2NyaXB0KGV4ZXJjaXNlLmxpbmspLnRoZW4oZnVuY3Rpb24oZGF0YSl7XG5cdFx0XHRcdFx0XHRyZXR1cm4gRXhlcmNpc21GYWN0b3J5LmdldEV4dGVybmFsTWQoZXhlcmNpc2UubWRMaW5rKTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIHJldHVybiBFeGVyY2lzbS5nZXRNYXJrZG93bigpO1xuXHRcdFx0fVxuXHRcdH1cblx0fSk7XG59KTtcblxuYXBwLmZhY3RvcnkoJ0V4ZXJjaXNtRmFjdG9yeScsIGZ1bmN0aW9uKCRodHRwKXtcblx0dmFyIG5hbWUgPSAnJztcblx0dmFyIHRlc3QgPSAnJztcblx0dmFyIGNvZGUgPSAnJztcblx0dmFyIG1hcmtkb3duID0gJyc7XG5cblx0cmV0dXJuIHtcblx0XHRnZXRFeHRlcm5hbFNjcmlwdCA6IGZ1bmN0aW9uKGxpbmspe1xuXHRcdFx0cmV0dXJuICRodHRwLmdldChsaW5rKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcblx0XHRcdFx0dGVzdCA9IHJlc3BvbnNlLmRhdGE7XG5cdFx0XHRcdHJldHVybiByZXNwb25zZS5kYXRhO1xuXHRcdFx0fSk7XG5cdFx0fSxcblx0XHRnZXRFeHRlcm5hbE1kIDogZnVuY3Rpb24obGluayl7XG5cdFx0XHRyZXR1cm4gJGh0dHAuZ2V0KGxpbmspLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuXHRcdFx0XHRtYXJrZG93biA9IHJlc3BvbnNlLmRhdGE7XG5cdFx0XHRcdHJldHVybiByZXNwb25zZS5kYXRhO1xuXHRcdFx0fSk7XG5cdFx0fSxcblx0XHRzZXROYW1lIDogZnVuY3Rpb24oc2V0TmFtZSl7XG5cdFx0XHRuYW1lID0gc2V0TmFtZTtcblx0XHR9LFxuXHRcdHNldFRlc3RTY3JpcHQgOiBmdW5jdGlvbih0ZXN0KXtcblx0XHRcdHRlc3QgPSB0ZXN0O1xuXHRcdH0sXG5cdFx0c2V0Q29kZVNjcmlwdCA6IGZ1bmN0aW9uIChjb2RlKXtcblx0XHRcdGNvZGUgPSBjb2RlO1xuXHRcdH0sXG5cdFx0Z2V0VGVzdFNjcmlwdCA6IGZ1bmN0aW9uKCl7XG5cdFx0XHRyZXR1cm4gdGVzdDtcblx0XHR9LFxuXHRcdGdldENvZGVTY3JpcHQgOiBmdW5jdGlvbigpe1xuXHRcdFx0cmV0dXJuIGNvZGU7XG5cdFx0fSxcblx0XHRnZXRNYXJrZG93biA6IGZ1bmN0aW9uKCl7XG5cdFx0XHRyZXR1cm4gbWFya2Rvd247XG5cdFx0fSxcblx0XHRnZXROYW1lIDogZnVuY3Rpb24oKXtcblx0XHRcdHJldHVybiBuYW1lO1xuXHRcdH1cblx0fTtcbn0pO1xuXG5hcHAuZmFjdG9yeSgnQXZhaWxhYmxlRXhlcmNpc2VzJywgZnVuY3Rpb24oKXtcblxuXHR2YXIgbGlicmFyeSA9IFtcblx0XHQnYWNjdW11bGF0ZScsXG5cdFx0J2FsbGVyZ2llcycsXG5cdFx0J2FuYWdyYW0nLFxuXHRcdCdhdGJhc2gtY2lwaGVyJyxcblx0XHQnYmVlci1zb25nJyxcblx0XHQnYmluYXJ5Jyxcblx0XHQnYmluYXJ5LXNlYXJjaC10cmVlJyxcblx0XHQnYm9iJyxcblx0XHQnYnJhY2tldC1wdXNoJyxcblx0XHQnY2lyY3VsYXRlLWJ1ZmZlcicsXG5cdFx0J2Nsb2NrJyxcblx0XHQnY3J5cHRvLXNxdWFyZScsXG5cdFx0J2N1c3RvbS1zZXQnLFxuXHRcdCdkaWZmZXJlbmNlLW9mLXNxdWFyZXMnLFxuXHRcdCdldGwnLFxuXHRcdCdmb29kLWNoYWluJ1xuXHRdO1xuXG5cdHZhciBnZW5lcmF0ZUxpbmsgPSBmdW5jdGlvbihuYW1lKXtcblx0XHRyZXR1cm4gJ2V4ZXJjaXNtL2phdmFzY3JpcHQvJyArIG5hbWUgKyAnLycgKyBuYW1lICsgJ190ZXN0LnNwZWMuanMnO1xuXHR9O1xuXG5cdHZhciBnZW5lcmF0ZU1kTGluayA9IGZ1bmN0aW9uKG5hbWUpe1xuXHRcdHJldHVybiAnZXhlcmNpc20vamF2YXNjcmlwdC8nICsgbmFtZSArICcvJyArIG5hbWUgKyAnLm1kJztcblx0fTtcblxuXHR2YXIgZ2VuZXJhdGVSYW5kb20gPSBmdW5jdGlvbigpe1xuXHRcdHZhciByYW5kb20gPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBsaWJyYXJ5Lmxlbmd0aCk7XG5cdFx0cmV0dXJuIGxpYnJhcnlbcmFuZG9tXTtcblx0fTtcblxuXHRyZXR1cm4ge1xuXHRcdGdldFNwZWNpZmljRXhlcmNpc2UgOiBmdW5jdGlvbihuYW1lKXtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdGxpbmsgOiBnZW5lcmF0ZUxpbmsobmFtZSksXG5cdFx0XHRcdG1kTGluayA6IGdlbmVyYXRlTWRMaW5rKG5hbWUpXG5cdFx0XHR9O1xuXHRcdH0sXG5cdFx0Z2V0UmFuZG9tRXhlcmNpc2UgOiBmdW5jdGlvbigpe1xuXHRcdFx0dmFyIG5hbWUgPSBnZW5lcmF0ZVJhbmRvbSgpO1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0bmFtZSA6IG5hbWUsXG5cdFx0XHRcdGxpbmsgOiBnZW5lcmF0ZUxpbmsobmFtZSksXG5cdFx0XHRcdG1kTGluayA6IGdlbmVyYXRlTWRMaW5rKG5hbWUpXG5cdFx0XHR9O1xuXHRcdH1cblx0fTtcbn0pOyIsImFwcC5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIpe1xuXHQkc3RhdGVQcm92aWRlci5zdGF0ZSgnZXhlcmNpc20uY29kZScsIHtcblx0XHR1cmwgOiAnL2V4ZXJjaXNtL2NvZGUnLFxuXHRcdHZpZXdzIDoge1xuXHRcdFx0J3RhYi1jb2RlJyA6IHtcblx0XHRcdFx0dGVtcGxhdGVVcmwgOiAnZmVhdHVyZXMvZXhlcmNpc20tY29kZS9leGVyY2lzbS1jb2RlLmh0bWwnLFxuXHRcdFx0XHRjb250cm9sbGVyOiAnRXhlcmNpc21Db2RlQ3RybCdcblx0XHRcdH1cblx0XHR9XG5cdH0pO1xufSk7XG5cbmFwcC5jb250cm9sbGVyKCdFeGVyY2lzbUNvZGVDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBFeGVyY2lzbUZhY3Rvcnkpe1xuXHQkc2NvcGUubmFtZSA9IEV4ZXJjaXNtRmFjdG9yeS5nZXROYW1lKCk7XG5cdCRzY29wZS5jb2RlID0gRXhlcmNpc21GYWN0b3J5LmdldENvZGVTY3JpcHQoKTtcblxuXHQkc2NvcGUuJHdhdGNoKCdjb2RlJywgZnVuY3Rpb24obmV3VmFsdWUsIG9sZFZhbHVlKXtcblx0XHRFeGVyY2lzbUZhY3Rvcnkuc2V0Q29kZVNjcmlwdChuZXdWYWx1ZSk7XG5cdH0pO1xufSk7IiwiYXBwLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlcil7XG5cdCRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdleGVyY2lzbS5jb21waWxlJywge1xuXHRcdHVybCA6ICcvZXhlcmNpc20vY29tcGlsZScsXG5cdFx0dmlld3MgOiB7XG5cdFx0XHQndGFiLWNvbXBpbGUnIDoge1xuXHRcdFx0XHR0ZW1wbGF0ZVVybCA6ICdmZWF0dXJlcy9leGVyY2lzbS1jb21waWxlL2V4ZXJjaXNtLWNvbXBpbGUuaHRtbCcsXG5cdFx0XHRcdGNvbnRyb2xsZXI6ICdFeGVyY2lzbUNvbXBpbGVDdHJsJ1xuXHRcdFx0fVxuXHRcdH1cblx0fSk7XG59KTtcblxuYXBwLmNvbnRyb2xsZXIoJ0V4ZXJjaXNtQ29tcGlsZUN0cmwnLCBmdW5jdGlvbigkc2NvcGUsIEV4ZXJjaXNtRmFjdG9yeSl7XG5cdCRzY29wZS5uYW1lID0gRXhlcmNpc21GYWN0b3J5LmdldE5hbWUoKTtcblx0JHNjb3BlLnRlc3QgPSBFeGVyY2lzbUZhY3RvcnkuZ2V0VGVzdFNjcmlwdCgpO1xuXHQkc2NvcGUuY29kZSA9IEV4ZXJjaXNtRmFjdG9yeS5nZXRDb2RlU2NyaXB0KCk7XG59KTsiLCJhcHAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKXtcblx0JHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2V4ZXJjaXNtLnRlc3QnLCB7XG5cdFx0dXJsIDogJy9leGVyY2lzbS90ZXN0Jyxcblx0XHR2aWV3cyA6IHtcblx0XHRcdCd0YWItdGVzdCcgOiB7XG5cdFx0XHRcdHRlbXBsYXRlVXJsIDogJ2ZlYXR1cmVzL2V4ZXJjaXNtLXRlc3QvZXhlcmNpc20tdGVzdC5odG1sJyxcblx0XHRcdFx0Y29udHJvbGxlciA6ICdFeGVyY2lzbVRlc3RDdHJsJ1xuXHRcdFx0fVxuXHRcdH1cblx0fSk7XG59KTtcblxuYXBwLmNvbnRyb2xsZXIoJ0V4ZXJjaXNtVGVzdEN0cmwnLCBmdW5jdGlvbigkc2NvcGUsIEV4ZXJjaXNtRmFjdG9yeSl7XG5cdCRzY29wZS5uYW1lID0gRXhlcmNpc21GYWN0b3J5LmdldE5hbWUoKTtcblx0JHNjb3BlLnRlc3QgPSBFeGVyY2lzbUZhY3RvcnkuZ2V0VGVzdFNjcmlwdCgpO1xuXG5cdCRzY29wZS4kd2F0Y2goJ3Rlc3QnLCBmdW5jdGlvbihuZXdWYWx1ZSwgb2xkVmFsdWUpe1xuXHRcdEV4ZXJjaXNtRmFjdG9yeS5zZXRUZXN0U2NyaXB0KG5ld1ZhbHVlKTtcblx0fSk7XG59KTsiLCJhcHAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKXtcblx0JHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2V4ZXJjaXNtLnZpZXcnLCB7XG5cdFx0dXJsOiAnL2V4ZXJjaXNtL3ZpZXcnLFxuXHRcdHZpZXdzOiB7XG5cdFx0XHQndGFiLXZpZXcnIDoge1xuXHRcdFx0XHR0ZW1wbGF0ZVVybDogJ2ZlYXR1cmVzL2V4ZXJjaXNtLXZpZXcvZXhlcmNpc20tdmlldy5odG1sJyxcblx0XHRcdFx0Y29udHJvbGxlcjogJ0V4ZXJjaXNtVmlld0N0cmwnXG5cdFx0XHR9XG5cdFx0fVxuXHR9KTtcbn0pO1xuXG5hcHAuY29udHJvbGxlcignRXhlcmNpc21WaWV3Q3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgRXhlcmNpc21GYWN0b3J5KXtcblx0JHNjb3BlLm1hcmtkb3duID0gRXhlcmNpc21GYWN0b3J5LmdldE1hcmtkb3duKCk7XG5cdCRzY29wZS5uYW1lID0gRXhlcmNpc21GYWN0b3J5LmdldE5hbWUoKTtcbn0pOyIsImFwcC5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIpe1xuXHQkc3RhdGVQcm92aWRlci5zdGF0ZSgnbG9naW4nLCB7XG5cdFx0dXJsIDogJy9sb2dpbicsXG5cdFx0dGVtcGxhdGVVcmwgOiAnZmVhdHVyZXMvbG9naW4vbG9naW4uaHRtbCcsXG5cdFx0Y29udHJvbGxlciA6ICdMb2dpbkN0cmwnXG5cdH0pO1xufSk7XG5cbmFwcC5jb250cm9sbGVyKCdMb2dpbkN0cmwnLCBmdW5jdGlvbigkcm9vdFNjb3BlLCAkc2NvcGUsICRpb25pY1BvcHVwLCAkc3RhdGUsIEF1dGhTZXJ2aWNlKXtcblx0JHNjb3BlLmRhdGEgPSB7fTtcblx0JHNjb3BlLmVycm9yID0gbnVsbDtcblxuICAgICRzY29wZS5zaWdudXAgPSBmdW5jdGlvbigpe1xuICAgICAgICAkc3RhdGUuZ28oJ3NpZ251cCcpO1xuICAgIH07XG5cblx0JHNjb3BlLmxvZ2luID0gZnVuY3Rpb24oKXtcblx0XHRBdXRoU2VydmljZVxuXHRcdFx0LmxvZ2luKCRzY29wZS5kYXRhKVxuXHRcdFx0LnRoZW4oZnVuY3Rpb24oYXV0aGVudGljYXRlZCl7IC8vVE9ETzphdXRoZW50aWNhdGVkIGlzIHdoYXQgaXMgcmV0dXJuZWRcblx0XHRcdFx0Ly9jb25zb2xlLmxvZygnbG9naW4sIHRhYi5jaGFsbGVuZ2Utc3VibWl0Jyk7XG5cdFx0XHRcdC8vJHNjb3BlLm1lbnUgPSB0cnVlO1xuXHRcdFx0XHQkcm9vdFNjb3BlLiRicm9hZGNhc3QoJ0F1dGgnKTtcblx0XHRcdFx0JHNjb3BlLnN0YXRlcy5wdXNoKHsgLy9UT0RPOiBOZWVkIHRvIGFkZCBhIHBhcmVudCBjb250cm9sbGVyIHRvIGNvbW11bmljYXRlXG5cdFx0XHRcdFx0bmFtZTogJ0xvZ291dCcsXG5cdFx0XHRcdFx0cmVmOiBmdW5jdGlvbigpe1xuXHRcdFx0XHRcdFx0QXV0aFNlcnZpY2UubG9nb3V0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZGF0YSA9IHt9O1xuXHRcdFx0XHRcdFx0JHNjb3BlLnN0YXRlcy5wb3AoKTsgLy9UT0RPOiBGaW5kIGEgYmV0dGVyIHdheSB0byByZW1vdmUgdGhlIExvZ291dCBsaW5rLCBpbnN0ZWFkIG9mIHBvcFxuXHRcdFx0XHRcdFx0JHN0YXRlLmdvKCdzaWdudXAnKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHQkc3RhdGUuZ28oJ2NoYWxsZW5nZS52aWV3Jyk7XG5cdFx0XHRcdC8vVE9ETzogV2UgY2FuIHNldCB0aGUgdXNlciBuYW1lIGhlcmUgYXMgd2VsbC4gVXNlZCBpbiBjb25qdW5jdGlvbiB3aXRoIGEgbWFpbiBjdHJsXG5cdFx0XHR9KVxuXHRcdFx0LmNhdGNoKGZ1bmN0aW9uKGVycil7XG5cdFx0XHRcdCRzY29wZS5lcnJvciA9ICdMb2dpbiBJbnZhbGlkJztcblx0XHRcdFx0Y29uc29sZS5lcnJvcihKU09OLnN0cmluZ2lmeShlcnIpKVxuXHRcdFx0XHR2YXIgYWxlcnRQb3B1cCA9ICRpb25pY1BvcHVwLmFsZXJ0KHtcblx0XHRcdFx0XHR0aXRsZTogJ0xvZ2luIGZhaWxlZCEnLFxuXHRcdFx0XHRcdHRlbXBsYXRlOiAnUGxlYXNlIGNoZWNrIHlvdXIgY3JlZGVudGlhbHMhJ1xuXHRcdFx0XHR9KTtcblx0XHRcdH0pO1xuXHR9O1xufSk7XG5cblxuLy9UT0RPOiBDbGVhbnVwIGNvbW1lbnRlZCBjb2RlXG5cbiIsImFwcC5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIpe1xuICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdzaWdudXAnLHtcbiAgICAgICAgdXJsOlwiL3NpZ251cFwiLFxuICAgICAgICB0ZW1wbGF0ZVVybDogXCJmZWF0dXJlcy9zaWdudXAvc2lnbnVwLmh0bWxcIixcbiAgICAgICAgY29udHJvbGxlcjogJ1NpZ25VcEN0cmwnXG4gICAgfSk7XG59KTtcblxuYXBwLmNvbnRyb2xsZXIoJ1NpZ25VcEN0cmwnLGZ1bmN0aW9uKCRyb290U2NvcGUsICRodHRwLCAkc2NvcGUsICRzdGF0ZSwgQXV0aFNlcnZpY2UsICRpb25pY1BvcHVwKXtcbiAgICAkc2NvcGUuZGF0YSA9IHt9O1xuICAgICRzY29wZS5lcnJvciA9IG51bGw7XG5cbiAgICAkc2NvcGUubG9naW4gPSBmdW5jdGlvbigpe1xuICAgICAgICAkc3RhdGUuZ28oJ2xvZ2luJyk7XG4gICAgfTtcblxuICAgICRzY29wZS5zaWdudXAgPSBmdW5jdGlvbigpe1xuICAgICAgICBBdXRoU2VydmljZVxuICAgICAgICAgICAgLnNpZ251cCgkc2NvcGUuZGF0YSlcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKGF1dGhlbnRpY2F0ZWQpe1xuICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ3NpZ251cCwgdGFiLmNoYWxsZW5nZScpO1xuICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdCgnQXV0aCcpO1xuICAgICAgICAgICAgICAgICRzY29wZS5zdGF0ZXMucHVzaCh7IC8vVE9ETzogTmVlZCB0byBhZGQgYSBwYXJlbnQgY29udHJvbGxlciB0byBjb21tdW5pY2F0ZVxuICAgICAgICAgICAgICAgICAgICBuYW1lOiAnTG9nb3V0JyxcbiAgICAgICAgICAgICAgICAgICAgcmVmOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICAgICAgQXV0aFNlcnZpY2UubG9nb3V0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZGF0YSA9IHt9O1xuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnN0YXRlcy5wb3AoKTsgLy9UT0RPOiBGaW5kIGEgYmV0dGVyIHdheSB0byByZW1vdmUgdGhlIExvZ291dCBsaW5rLCBpbnN0ZWFkIG9mIHBvcFxuICAgICAgICAgICAgICAgICAgICAgICAgJHN0YXRlLmdvKCdzaWdudXAnKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICRzdGF0ZS5nbygnY2hhbGxlbmdlLnZpZXcnKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuY2F0Y2goZnVuY3Rpb24oZXJyKXtcbiAgICAgICAgICAgICAgICAkc2NvcGUuZXJyb3IgPSAnU2lnbnVwIEludmFsaWQnO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoSlNPTi5zdHJpbmdpZnkoZXJyKSlcbiAgICAgICAgICAgICAgICB2YXIgYWxlcnRQb3B1cCA9ICRpb25pY1BvcHVwLmFsZXJ0KHtcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdTaWdudXAgZmFpbGVkIScsXG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlOiAnUGxlYXNlIGNoZWNrIHlvdXIgY3JlZGVudGlhbHMhJ1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgfTtcblxufSk7XG5cbi8vVE9ETzogRm9ybSBWYWxpZGF0aW9uXG4vL1RPRE86IENsZWFudXAgY29tbWVudGVkIGNvZGUiLCJhcHAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKXtcblx0JHN0YXRlUHJvdmlkZXIuc3RhdGUoJ3dlbGNvbWUnLCB7XG5cdFx0dXJsIDogJy93ZWxjb21lJyxcblx0XHR0ZW1wbGF0ZVVybCA6ICdmZWF0dXJlcy93ZWxjb21lL3dlbGNvbWUuaHRtbCcsXG5cdFx0Y29udHJvbGxlciA6ICdXZWxjb21lQ3RybCdcblx0fSk7XG59KTtcblxuYXBwLmNvbnRyb2xsZXIoJ1dlbGNvbWVDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCAkc3RhdGUsIEF1dGhTZXJ2aWNlLCAkcm9vdFNjb3BlKXtcblx0Ly9UT0RPOiBTcGxhc2ggcGFnZSB3aGlsZSB5b3UgbG9hZCByZXNvdXJjZXMgKHBvc3NpYmxlIGlkZWEpXG5cdC8vY29uc29sZS5sb2coJ1dlbGNvbWVDdHJsJyk7XG5cdCRzY29wZS5sb2dpbiA9IGZ1bmN0aW9uKCl7XG5cdFx0JHN0YXRlLmdvKCdsb2dpbicpO1xuXHR9O1xuXHQkc2NvcGUuc2lnbnVwID0gZnVuY3Rpb24oKXtcblx0XHQkc3RhdGUuZ28oJ3NpZ251cCcpO1xuXHR9O1xuXG5cdGlmIChBdXRoU2VydmljZS5pc0F1dGhlbnRpY2F0ZWQoKSkge1xuXHRcdCRyb290U2NvcGUuJGJyb2FkY2FzdCgnQXV0aCcpO1xuXHRcdCRzY29wZS5zdGF0ZXMucHVzaCh7IC8vVE9ETzogTmVlZCB0byBhZGQgYSBwYXJlbnQgY29udHJvbGxlciB0byBjb21tdW5pY2F0ZVxuXHRcdFx0bmFtZTogJ0xvZ291dCcsXG5cdFx0XHRyZWY6IGZ1bmN0aW9uKCl7XG5cdFx0XHRcdEF1dGhTZXJ2aWNlLmxvZ291dCgpO1xuXHRcdFx0XHQkc2NvcGUuZGF0YSA9IHt9O1xuXHRcdFx0XHQkc2NvcGUuc3RhdGVzLnBvcCgpOyAvL1RPRE86IEZpbmQgYSBiZXR0ZXIgd2F5IHRvIHJlbW92ZSB0aGUgTG9nb3V0IGxpbmssIGluc3RlYWQgb2YgcG9wXG5cdFx0XHRcdCRzdGF0ZS5nbygnc2lnbnVwJyk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0JHN0YXRlLmdvKCdjaGFsbGVuZ2UudmlldycpO1xuXHR9IGVsc2Uge1xuXHRcdC8vVE9ETzogJHN0YXRlLmdvKCdzaWdudXAnKTsgUmVtb3ZlIEJlbG93IGxpbmVcblx0XHQkc3RhdGUuZ28oJ2NoYWxsZW5nZS52aWV3Jyk7XG5cdH1cbn0pOyIsIi8vdG9rZW4gaXMgc2VudCBvbiBldmVyeSBodHRwIHJlcXVlc3RcbmFwcC5mYWN0b3J5KCdBdXRoSW50ZXJjZXB0b3InLGZ1bmN0aW9uIEF1dGhJbnRlcmNlcHRvcihBVVRIX0VWRU5UUywkcm9vdFNjb3BlLCRxLEF1dGhUb2tlbkZhY3Rvcnkpe1xuXG4gICAgdmFyIHN0YXR1c0RpY3QgPSB7XG4gICAgICAgIDQwMTogQVVUSF9FVkVOVFMubm90QXV0aGVudGljYXRlZCxcbiAgICAgICAgNDAzOiBBVVRIX0VWRU5UUy5ub3RBdXRob3JpemVkXG4gICAgfTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIHJlcXVlc3Q6IGFkZFRva2VuLFxuICAgICAgICByZXNwb25zZUVycm9yOiBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdChzdGF0dXNEaWN0W3Jlc3BvbnNlLnN0YXR1c10sIHJlc3BvbnNlKTtcbiAgICAgICAgICAgIHJldHVybiAkcS5yZWplY3QocmVzcG9uc2UpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIGFkZFRva2VuKGNvbmZpZyl7XG4gICAgICAgIHZhciB0b2tlbiA9IEF1dGhUb2tlbkZhY3RvcnkuZ2V0VG9rZW4oKTtcbiAgICAgICAgLy9jb25zb2xlLmxvZygnYWRkVG9rZW4nLHRva2VuKTtcbiAgICAgICAgaWYodG9rZW4pe1xuICAgICAgICAgICAgY29uZmlnLmhlYWRlcnMgPSBjb25maWcuaGVhZGVycyB8fCB7fTtcbiAgICAgICAgICAgIGNvbmZpZy5oZWFkZXJzLkF1dGhvcml6YXRpb24gPSAnQmVhcmVyICcgKyB0b2tlbjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY29uZmlnO1xuICAgIH1cbn0pO1xuLy9za2lwcGVkIEF1dGggSW50ZXJjZXB0b3JzIGdpdmVuIFRPRE86IFlvdSBjb3VsZCBhcHBseSB0aGUgYXBwcm9hY2ggaW5cbi8vaHR0cDovL2RldmRhY3RpYy5jb20vdXNlci1hdXRoLWFuZ3VsYXJqcy1pb25pYy9cblxuYXBwLmNvbmZpZyhmdW5jdGlvbigkaHR0cFByb3ZpZGVyKXtcbiAgICAkaHR0cFByb3ZpZGVyLmludGVyY2VwdG9ycy5wdXNoKCdBdXRoSW50ZXJjZXB0b3InKTtcbn0pO1xuXG5hcHAuY29uc3RhbnQoJ0FVVEhfRVZFTlRTJywge1xuICAgICAgICBub3RBdXRoZW50aWNhdGVkOiAnYXV0aC1ub3QtYXV0aGVudGljYXRlZCcsXG4gICAgICAgIG5vdEF1dGhvcml6ZWQ6ICdhdXRoLW5vdC1hdXRob3JpemVkJ1xufSk7XG5cbmFwcC5jb25zdGFudCgnVVNFUl9ST0xFUycsIHtcbiAgICAgICAgLy9hZG1pbjogJ2FkbWluX3JvbGUnLFxuICAgICAgICBwdWJsaWM6ICdwdWJsaWNfcm9sZSdcbn0pO1xuXG5hcHAuZmFjdG9yeSgnQXV0aFRva2VuRmFjdG9yeScsZnVuY3Rpb24oJHdpbmRvdyl7XG4gICAgdmFyIHN0b3JlID0gJHdpbmRvdy5sb2NhbFN0b3JhZ2U7XG4gICAgdmFyIGtleSA9ICdhdXRoLXRva2VuJztcblxuICAgIHJldHVybiB7XG4gICAgICAgIGdldFRva2VuOiBnZXRUb2tlbixcbiAgICAgICAgc2V0VG9rZW46IHNldFRva2VuXG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIGdldFRva2VuKCl7XG4gICAgICAgIHJldHVybiBzdG9yZS5nZXRJdGVtKGtleSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2V0VG9rZW4odG9rZW4pe1xuICAgICAgICBpZih0b2tlbil7XG4gICAgICAgICAgICBzdG9yZS5zZXRJdGVtKGtleSx0b2tlbik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzdG9yZS5yZW1vdmVJdGVtKGtleSk7XG4gICAgICAgIH1cbiAgICB9XG59KTtcblxuYXBwLnNlcnZpY2UoJ0F1dGhTZXJ2aWNlJyxmdW5jdGlvbigkcSwkaHR0cCxVU0VSX1JPTEVTLEF1dGhUb2tlbkZhY3RvcnksQXBpRW5kcG9pbnQsJHJvb3RTY29wZSl7XG4gICAgdmFyIHVzZXJuYW1lID0gJyc7XG4gICAgdmFyIGlzQXV0aGVudGljYXRlZCA9IGZhbHNlO1xuICAgIHZhciBhdXRoVG9rZW47XG5cbiAgICBmdW5jdGlvbiBsb2FkVXNlckNyZWRlbnRpYWxzKCkge1xuICAgICAgICAvL3ZhciB0b2tlbiA9IHdpbmRvdy5sb2NhbFN0b3JhZ2UuZ2V0SXRlbShMT0NBTF9UT0tFTl9LRVkpO1xuICAgICAgICB2YXIgdG9rZW4gPSBBdXRoVG9rZW5GYWN0b3J5LmdldFRva2VuKCk7XG4gICAgICAgIC8vY29uc29sZS5sb2codG9rZW4pO1xuICAgICAgICBpZiAodG9rZW4pIHtcbiAgICAgICAgICAgIHVzZUNyZWRlbnRpYWxzKHRva2VuKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHN0b3JlVXNlckNyZWRlbnRpYWxzKGRhdGEpIHtcbiAgICAgICAgQXV0aFRva2VuRmFjdG9yeS5zZXRUb2tlbihkYXRhLnRva2VuKTtcbiAgICAgICAgdXNlQ3JlZGVudGlhbHMoZGF0YSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdXNlQ3JlZGVudGlhbHMoZGF0YSkge1xuICAgICAgICAvL2NvbnNvbGUubG9nKCd1c2VDcmVkZW50aWFscyB0b2tlbicsZGF0YSk7XG4gICAgICAgIHVzZXJuYW1lID0gZGF0YS51c2VybmFtZTtcbiAgICAgICAgaXNBdXRoZW50aWNhdGVkID0gdHJ1ZTtcbiAgICAgICAgYXV0aFRva2VuID0gZGF0YS50b2tlbjtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBkZXN0cm95VXNlckNyZWRlbnRpYWxzKCkge1xuICAgICAgICBhdXRoVG9rZW4gPSB1bmRlZmluZWQ7XG4gICAgICAgIHVzZXJuYW1lID0gJyc7XG4gICAgICAgIGlzQXV0aGVudGljYXRlZCA9IGZhbHNlO1xuICAgICAgICBBdXRoVG9rZW5GYWN0b3J5LnNldFRva2VuKCk7IC8vZW1wdHkgY2xlYXJzIHRoZSB0b2tlblxuICAgIH1cblxuICAgIHZhciBsb2dvdXQgPSBmdW5jdGlvbigpe1xuICAgICAgICBkZXN0cm95VXNlckNyZWRlbnRpYWxzKCk7XG5cbiAgICB9O1xuXG4gICAgLy92YXIgbG9naW4gPSBmdW5jdGlvbigpXG4gICAgdmFyIGxvZ2luID0gZnVuY3Rpb24odXNlcmRhdGEpe1xuICAgICAgICBjb25zb2xlLmxvZygnbG9naW4nLEpTT04uc3RyaW5naWZ5KHVzZXJkYXRhKSk7XG4gICAgICAgIHJldHVybiAkcShmdW5jdGlvbihyZXNvbHZlLHJlamVjdCl7XG4gICAgICAgICAgICAkaHR0cC5wb3N0KEFwaUVuZHBvaW50LnVybCtcIi91c2VyL2xvZ2luXCIsIHVzZXJkYXRhKVxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAgICAgICAgICAgICAgICAgc3RvcmVVc2VyQ3JlZGVudGlhbHMocmVzcG9uc2UuZGF0YSk7IC8vc3RvcmVVc2VyQ3JlZGVudGlhbHNcbiAgICAgICAgICAgICAgICAgICAgLy9pc0F1dGhlbnRpY2F0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHJlc3BvbnNlKTsgLy9UT0RPOiBzZW50IHRvIGF1dGhlbnRpY2F0ZWRcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIHZhciBzaWdudXAgPSBmdW5jdGlvbih1c2VyZGF0YSl7XG4gICAgICAgIGNvbnNvbGUubG9nKCdzaWdudXAnLEpTT04uc3RyaW5naWZ5KHVzZXJkYXRhKSk7XG4gICAgICAgIHJldHVybiAkcShmdW5jdGlvbihyZXNvbHZlLHJlamVjdCl7XG4gICAgICAgICAgICAkaHR0cC5wb3N0KEFwaUVuZHBvaW50LnVybCtcIi91c2VyL3NpZ251cFwiLCB1c2VyZGF0YSlcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgICAgICAgICAgICAgICAgIHN0b3JlVXNlckNyZWRlbnRpYWxzKHJlc3BvbnNlLmRhdGEpOyAvL3N0b3JlVXNlckNyZWRlbnRpYWxzXG4gICAgICAgICAgICAgICAgICAgIC8vaXNBdXRoZW50aWNhdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShyZXNwb25zZSk7IC8vVE9ETzogc2VudCB0byBhdXRoZW50aWNhdGVkXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGxvYWRVc2VyQ3JlZGVudGlhbHMoKTtcblxuICAgIHZhciBpc0F1dGhvcml6ZWQgPSBmdW5jdGlvbihhdXRoZW50aWNhdGVkKSB7XG4gICAgICAgIGlmICghYW5ndWxhci5pc0FycmF5KGF1dGhlbnRpY2F0ZWQpKSB7XG4gICAgICAgICAgICBhdXRoZW50aWNhdGVkID0gW2F1dGhlbnRpY2F0ZWRdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAoaXNBdXRoZW50aWNhdGVkICYmIGF1dGhlbnRpY2F0ZWQuaW5kZXhPZihVU0VSX1JPTEVTLnB1YmxpYykgIT09IC0xKTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgbG9naW46IGxvZ2luLFxuICAgICAgICBzaWdudXA6IHNpZ251cCxcbiAgICAgICAgbG9nb3V0OiBsb2dvdXQsXG4gICAgICAgIGlzQXV0aGVudGljYXRlZDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdBdXRoU2VydmljZS5pc0F1dGhlbnRpY2F0ZWQoKScpO1xuICAgICAgICAgICAgcmV0dXJuIGlzQXV0aGVudGljYXRlZDtcbiAgICAgICAgfSxcbiAgICAgICAgdXNlcm5hbWU6IGZ1bmN0aW9uKCl7cmV0dXJuIHVzZXJuYW1lO30sXG4gICAgICAgIC8vZ2V0TG9nZ2VkSW5Vc2VyOiBnZXRMb2dnZWRJblVzZXIsXG4gICAgICAgIGlzQXV0aG9yaXplZDogaXNBdXRob3JpemVkXG4gICAgfVxuXG59KTtcblxuLy9UT0RPOiBEaWQgbm90IGNvbXBsZXRlIG1haW4gY3RybCAnQXBwQ3RybCBmb3IgaGFuZGxpbmcgZXZlbnRzJ1xuLy8gYXMgcGVyIGh0dHA6Ly9kZXZkYWN0aWMuY29tL3VzZXItYXV0aC1hbmd1bGFyanMtaW9uaWMvIiwiYXBwLmZpbHRlcignbmFtZWZvcm1hdCcsIGZ1bmN0aW9uKCl7XG5cdHJldHVybiBmdW5jdGlvbih0ZXh0KXtcblx0XHRyZXR1cm4gJ0V4ZXJjaXNtIC0gJyArIHRleHQuc3BsaXQoJy0nKS5tYXAoZnVuY3Rpb24oZWwpe1xuXHRcdFx0cmV0dXJuIGVsLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgZWwuc2xpY2UoMSk7XG5cdFx0fSkuam9pbignICcpO1xuXHR9O1xufSk7IiwiYXBwLmZpbHRlcignbWFya2VkJywgZnVuY3Rpb24oJHNjZSl7XG5cdC8vIG1hcmtlZC5zZXRPcHRpb25zKHtcblx0Ly8gXHRyZW5kZXJlcjogbmV3IG1hcmtlZC5SZW5kZXJlcigpLFxuXHQvLyBcdGdmbTogdHJ1ZSxcblx0Ly8gXHR0YWJsZXM6IHRydWUsXG5cdC8vIFx0YnJlYWtzOiB0cnVlLFxuXHQvLyBcdHBlZGFudGljOiBmYWxzZSxcblx0Ly8gXHRzYW5pdGl6ZTogdHJ1ZSxcblx0Ly8gXHRzbWFydExpc3RzOiB0cnVlLFxuXHQvLyBcdHNtYXJ0eXBhbnRzOiBmYWxzZVxuXHQvLyB9KTtcblx0cmV0dXJuIGZ1bmN0aW9uKHRleHQpe1xuXHRcdGlmKHRleHQpe1xuXHRcdFx0cmV0dXJuICRzY2UudHJ1c3RBc0h0bWwobWFya2VkKHRleHQpKTtcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHRyZXR1cm4gdW5kZWZpbmVkO1xuXHRcdH1cblx0fTtcbn0pOyIsImFwcC5kaXJlY3RpdmUoJ2NtZWRpdCcsIGZ1bmN0aW9uKCl7XG5cdHJldHVybiB7XG5cdFx0cmVzdHJpY3QgOiAnQScsXG5cdFx0c2NvcGU6IHtcblx0XHRcdG5nTW9kZWwgOiAnPSdcblx0XHR9LFxuXHRcdGxpbmsgOiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cmlidXRlKXtcblx0XHRcdHZhciB1cGRhdGVUZXh0ID0gZnVuY3Rpb24oKXtcblx0XHRcdFx0c2NvcGUubmdNb2RlbCA9IG15Q29kZU1pcnJvci5nZXRWYWx1ZSgpO1xuXHRcdFx0XHRjb25zb2xlLmxvZyhteUNvZGVNaXJyb3IuZ2V0VmFsdWUoKSk7XG5cdFx0XHRcdHNjb3BlLiRhcHBseSgpO1xuXHRcdFx0fTtcblx0XHRcdC8vaW5pdGlhbGl6ZSBDb2RlTWlycm9yXG5cdFx0XHR2YXIgbXlDb2RlTWlycm9yID0gQ29kZU1pcnJvci5mcm9tVGV4dEFyZWEoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoYXR0cmlidXRlLmlkKSwge1xuXHRcdFx0XHRsaW5lTnVtYmVycyA6IHRydWUsXG5cdFx0XHRcdG1vZGU6ICdqYXZhc2NyaXB0Jyxcblx0XHRcdFx0YXV0b2ZvY3VzIDogdHJ1ZSxcblx0XHRcdFx0dGhlbWUgOiAndHdpbGlnaHQnLFxuXHRcdFx0XHRsaW5lV3JhcHBpbmc6IHRydWVcblx0XHRcdH0pO1xuXHRcdFx0bXlDb2RlTWlycm9yLnNldFZhbHVlKHNjb3BlLm5nTW9kZWwpO1xuXG5cdFx0XHRteUNvZGVNaXJyb3Iub24oXCJjaGFuZ2VcIiwgZnVuY3Rpb24gKG15Q29kZU1pcnJvciwgY2hhbmdlT2JqKXtcblx0XHQgICAgXHR1cGRhdGVUZXh0KCk7XG5cdFx0ICAgIH0pO1xuXHRcdH1cblx0fTtcbn0pOyIsImFwcC5kaXJlY3RpdmUoJ2NtcmVhZCcsIGZ1bmN0aW9uKCl7XG5cdHJldHVybiB7XG5cdFx0cmVzdHJpY3QgOiAnQScsXG5cdFx0c2NvcGU6IHtcblx0XHRcdG5nTW9kZWwgOiAnPSdcblx0XHR9LFxuXHRcdGxpbmsgOiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cmlidXRlKXtcblx0XHRcdC8vaW5pdGlhbGl6ZSBDb2RlTWlycm9yXG5cdFx0XHR2YXIgbXlDb2RlTWlycm9yID0gQ29kZU1pcnJvci5mcm9tVGV4dEFyZWEoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbXBpbGUnKSwge1xuXHRcdFx0XHRyZWFkT25seSA6ICdub2N1cnNvcicsXG5cdFx0XHRcdG1vZGU6ICdqYXZhc2NyaXB0Jyxcblx0XHRcdFx0YXV0b2ZvY3VzIDogdHJ1ZSxcblx0XHRcdFx0dGhlbWUgOiAndHdpbGlnaHQnLFxuXHRcdFx0XHRsaW5lV3JhcHBpbmc6IHRydWVcblx0XHRcdH0pO1xuXG5cdFx0XHRteUNvZGVNaXJyb3Iuc2V0VmFsdWUoc2NvcGUubmdNb2RlbCk7XG5cdFx0fVxuXHR9O1xufSk7IiwiYXBwLmRpcmVjdGl2ZSgnamhyJywgZnVuY3Rpb24oSmFzbWluZVJlcG9ydGVyKXtcblx0cmV0dXJuIHtcblx0XHRyZXN0cmljdCA6ICdFJyxcblx0XHRzY29wZSA6IHtcblx0XHRcdHRlc3QgOiAnPSdcblx0XHR9LFxuXHRcdHRlbXBsYXRlVXJsIDogJ2ZlYXR1cmVzL2NvbW1vbi9kaXJlY3RpdmVzL2phc21pbmUtaHRtbC1yZXBvcnRlci9qYXNtaW5lLWh0bWwtcmVwb3J0ZXIuaHRtbCcsXG5cdFx0bGluayA6IGZ1bmN0aW9uIChzY29wZSwgZWxlbWVudCwgYXR0cmlidXRlKXtcblx0XHRcdEphc21pbmVSZXBvcnRlci5jcmVhdGVKYXNtaW5lUmVwb3J0ZXIoZWxlbWVudFswXSk7XG5cdFx0XHRjb25zb2xlLmxvZyhlbGVtZW50KTtcblx0XHR9XG5cdH07XG59KTtcblxuYXBwLmZhY3RvcnkoJ0phc21pbmVSZXBvcnRlcicsIGZ1bmN0aW9uKCl7XG5cdGZ1bmN0aW9uIGluaXRpYWxpemVKYXNtaW5lKCl7XG5cdFx0Lypcblx0XHRDb3B5cmlnaHQgKGMpIDIwMDgtMjAxNSBQaXZvdGFsIExhYnNcblxuXHRcdFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZ1xuXHRcdGEgY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuXHRcdFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuXHRcdHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcblx0XHRkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG9cblx0XHRwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG9cblx0XHR0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG5cblx0XHRUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZVxuXHRcdGluY2x1ZGVkIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuXG5cdFx0VEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCxcblx0XHRFWFBSRVNTIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcblx0XHRNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORFxuXHRcdE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkVcblx0XHRMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OXG5cdFx0T0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OXG5cdFx0V0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cdFx0Ki9cblx0XHQvKipcblx0XHQgU3RhcnRpbmcgd2l0aCB2ZXJzaW9uIDIuMCwgdGhpcyBmaWxlIFwiYm9vdHNcIiBKYXNtaW5lLCBwZXJmb3JtaW5nIGFsbCBvZiB0aGUgbmVjZXNzYXJ5IGluaXRpYWxpemF0aW9uIGJlZm9yZSBleGVjdXRpbmcgdGhlIGxvYWRlZCBlbnZpcm9ubWVudCBhbmQgYWxsIG9mIGEgcHJvamVjdCdzIHNwZWNzLiBUaGlzIGZpbGUgc2hvdWxkIGJlIGxvYWRlZCBhZnRlciBgamFzbWluZS5qc2AgYW5kIGBqYXNtaW5lX2h0bWwuanNgLCBidXQgYmVmb3JlIGFueSBwcm9qZWN0IHNvdXJjZSBmaWxlcyBvciBzcGVjIGZpbGVzIGFyZSBsb2FkZWQuIFRodXMgdGhpcyBmaWxlIGNhbiBhbHNvIGJlIHVzZWQgdG8gY3VzdG9taXplIEphc21pbmUgZm9yIGEgcHJvamVjdC5cblxuXHRcdCBJZiBhIHByb2plY3QgaXMgdXNpbmcgSmFzbWluZSB2aWEgdGhlIHN0YW5kYWxvbmUgZGlzdHJpYnV0aW9uLCB0aGlzIGZpbGUgY2FuIGJlIGN1c3RvbWl6ZWQgZGlyZWN0bHkuIElmIGEgcHJvamVjdCBpcyB1c2luZyBKYXNtaW5lIHZpYSB0aGUgW1J1YnkgZ2VtXVtqYXNtaW5lLWdlbV0sIHRoaXMgZmlsZSBjYW4gYmUgY29waWVkIGludG8gdGhlIHN1cHBvcnQgZGlyZWN0b3J5IHZpYSBgamFzbWluZSBjb3B5X2Jvb3RfanNgLiBPdGhlciBlbnZpcm9ubWVudHMgKGUuZy4sIFB5dGhvbikgd2lsbCBoYXZlIGRpZmZlcmVudCBtZWNoYW5pc21zLlxuXG5cdFx0IFRoZSBsb2NhdGlvbiBvZiBgYm9vdC5qc2AgY2FuIGJlIHNwZWNpZmllZCBhbmQvb3Igb3ZlcnJpZGRlbiBpbiBgamFzbWluZS55bWxgLlxuXG5cdFx0IFtqYXNtaW5lLWdlbV06IGh0dHA6Ly9naXRodWIuY29tL3Bpdm90YWwvamFzbWluZS1nZW1cblx0XHQgKi9cblxuXHRcdChmdW5jdGlvbigpIHtcblx0XHQgIC8qKlxuXHRcdCAgICogIyMgUmVxdWlyZSAmYW1wOyBJbnN0YW50aWF0ZVxuXHRcdCAgICpcblx0XHQgICAqIFJlcXVpcmUgSmFzbWluZSdzIGNvcmUgZmlsZXMuIFNwZWNpZmljYWxseSwgdGhpcyByZXF1aXJlcyBhbmQgYXR0YWNoZXMgYWxsIG9mIEphc21pbmUncyBjb2RlIHRvIHRoZSBgamFzbWluZWAgcmVmZXJlbmNlLlxuXHRcdCAgICovXG5cdFx0ICB3aW5kb3cuamFzbWluZSA9IGphc21pbmVSZXF1aXJlLmNvcmUoamFzbWluZVJlcXVpcmUpO1xuXG5cdFx0ICAvKipcblx0XHQgICAqIFNpbmNlIHRoaXMgaXMgYmVpbmcgcnVuIGluIGEgYnJvd3NlciBhbmQgdGhlIHJlc3VsdHMgc2hvdWxkIHBvcHVsYXRlIHRvIGFuIEhUTUwgcGFnZSwgcmVxdWlyZSB0aGUgSFRNTC1zcGVjaWZpYyBKYXNtaW5lIGNvZGUsIGluamVjdGluZyB0aGUgc2FtZSByZWZlcmVuY2UuXG5cdFx0ICAgKi9cblx0XHQgIGphc21pbmVSZXF1aXJlLmh0bWwoamFzbWluZSk7XG5cblx0XHQgIC8qKlxuXHRcdCAgICogQ3JlYXRlIHRoZSBKYXNtaW5lIGVudmlyb25tZW50LiBUaGlzIGlzIHVzZWQgdG8gcnVuIGFsbCBzcGVjcyBpbiBhIHByb2plY3QuXG5cdFx0ICAgKi9cblx0XHQgIHZhciBlbnYgPSBqYXNtaW5lLmdldEVudigpO1xuXG5cdFx0ICAvKipcblx0XHQgICAqICMjIFRoZSBHbG9iYWwgSW50ZXJmYWNlXG5cdFx0ICAgKlxuXHRcdCAgICogQnVpbGQgdXAgdGhlIGZ1bmN0aW9ucyB0aGF0IHdpbGwgYmUgZXhwb3NlZCBhcyB0aGUgSmFzbWluZSBwdWJsaWMgaW50ZXJmYWNlLiBBIHByb2plY3QgY2FuIGN1c3RvbWl6ZSwgcmVuYW1lIG9yIGFsaWFzIGFueSBvZiB0aGVzZSBmdW5jdGlvbnMgYXMgZGVzaXJlZCwgcHJvdmlkZWQgdGhlIGltcGxlbWVudGF0aW9uIHJlbWFpbnMgdW5jaGFuZ2VkLlxuXHRcdCAgICovXG5cdFx0ICB2YXIgamFzbWluZUludGVyZmFjZSA9IGphc21pbmVSZXF1aXJlLmludGVyZmFjZShqYXNtaW5lLCBlbnYpO1xuXG5cdFx0ICAvKipcblx0XHQgICAqIEFkZCBhbGwgb2YgdGhlIEphc21pbmUgZ2xvYmFsL3B1YmxpYyBpbnRlcmZhY2UgdG8gdGhlIGdsb2JhbCBzY29wZSwgc28gYSBwcm9qZWN0IGNhbiB1c2UgdGhlIHB1YmxpYyBpbnRlcmZhY2UgZGlyZWN0bHkuIEZvciBleGFtcGxlLCBjYWxsaW5nIGBkZXNjcmliZWAgaW4gc3BlY3MgaW5zdGVhZCBvZiBgamFzbWluZS5nZXRFbnYoKS5kZXNjcmliZWAuXG5cdFx0ICAgKi9cblx0XHQgIGV4dGVuZCh3aW5kb3csIGphc21pbmVJbnRlcmZhY2UpO1xuXG5cdFx0ICAvKipcblx0XHQgICAqICMjIFJ1bm5lciBQYXJhbWV0ZXJzXG5cdFx0ICAgKlxuXHRcdCAgICogTW9yZSBicm93c2VyIHNwZWNpZmljIGNvZGUgLSB3cmFwIHRoZSBxdWVyeSBzdHJpbmcgaW4gYW4gb2JqZWN0IGFuZCB0byBhbGxvdyBmb3IgZ2V0dGluZy9zZXR0aW5nIHBhcmFtZXRlcnMgZnJvbSB0aGUgcnVubmVyIHVzZXIgaW50ZXJmYWNlLlxuXHRcdCAgICovXG5cblx0XHQgIHZhciBxdWVyeVN0cmluZyA9IG5ldyBqYXNtaW5lLlF1ZXJ5U3RyaW5nKHtcblx0XHQgICAgZ2V0V2luZG93TG9jYXRpb246IGZ1bmN0aW9uKCkgeyByZXR1cm4gd2luZG93LmxvY2F0aW9uOyB9XG5cdFx0ICB9KTtcblxuXHRcdCAgdmFyIGNhdGNoaW5nRXhjZXB0aW9ucyA9IHF1ZXJ5U3RyaW5nLmdldFBhcmFtKFwiY2F0Y2hcIik7XG5cdFx0ICBlbnYuY2F0Y2hFeGNlcHRpb25zKHR5cGVvZiBjYXRjaGluZ0V4Y2VwdGlvbnMgPT09IFwidW5kZWZpbmVkXCIgPyB0cnVlIDogY2F0Y2hpbmdFeGNlcHRpb25zKTtcblxuXHRcdCAgdmFyIHRocm93aW5nRXhwZWN0YXRpb25GYWlsdXJlcyA9IHF1ZXJ5U3RyaW5nLmdldFBhcmFtKFwidGhyb3dGYWlsdXJlc1wiKTtcblx0XHQgIGVudi50aHJvd09uRXhwZWN0YXRpb25GYWlsdXJlKHRocm93aW5nRXhwZWN0YXRpb25GYWlsdXJlcyk7XG5cblx0XHQgIC8qKlxuXHRcdCAgICogVGhlIGBqc0FwaVJlcG9ydGVyYCBhbHNvIHJlY2VpdmVzIHNwZWMgcmVzdWx0cywgYW5kIGlzIHVzZWQgYnkgYW55IGVudmlyb25tZW50IHRoYXQgbmVlZHMgdG8gZXh0cmFjdCB0aGUgcmVzdWx0cyAgZnJvbSBKYXZhU2NyaXB0LlxuXHRcdCAgICovXG5cdFx0ICBlbnYuYWRkUmVwb3J0ZXIoamFzbWluZUludGVyZmFjZS5qc0FwaVJlcG9ydGVyKTtcblxuXHRcdCAgLyoqXG5cdFx0ICAgKiBGaWx0ZXIgd2hpY2ggc3BlY3Mgd2lsbCBiZSBydW4gYnkgbWF0Y2hpbmcgdGhlIHN0YXJ0IG9mIHRoZSBmdWxsIG5hbWUgYWdhaW5zdCB0aGUgYHNwZWNgIHF1ZXJ5IHBhcmFtLlxuXHRcdCAgICovXG5cdFx0ICB2YXIgc3BlY0ZpbHRlciA9IG5ldyBqYXNtaW5lLkh0bWxTcGVjRmlsdGVyKHtcblx0XHQgICAgZmlsdGVyU3RyaW5nOiBmdW5jdGlvbigpIHsgcmV0dXJuIHF1ZXJ5U3RyaW5nLmdldFBhcmFtKFwic3BlY1wiKTsgfVxuXHRcdCAgfSk7XG5cblx0XHQgIGVudi5zcGVjRmlsdGVyID0gZnVuY3Rpb24oc3BlYykge1xuXHRcdCAgICByZXR1cm4gc3BlY0ZpbHRlci5tYXRjaGVzKHNwZWMuZ2V0RnVsbE5hbWUoKSk7XG5cdFx0ICB9O1xuXG5cdFx0ICAvKipcblx0XHQgICAqIFNldHRpbmcgdXAgdGltaW5nIGZ1bmN0aW9ucyB0byBiZSBhYmxlIHRvIGJlIG92ZXJyaWRkZW4uIENlcnRhaW4gYnJvd3NlcnMgKFNhZmFyaSwgSUUgOCwgcGhhbnRvbWpzKSByZXF1aXJlIHRoaXMgaGFjay5cblx0XHQgICAqL1xuXHRcdCAgd2luZG93LnNldFRpbWVvdXQgPSB3aW5kb3cuc2V0VGltZW91dDtcblx0XHQgIHdpbmRvdy5zZXRJbnRlcnZhbCA9IHdpbmRvdy5zZXRJbnRlcnZhbDtcblx0XHQgIHdpbmRvdy5jbGVhclRpbWVvdXQgPSB3aW5kb3cuY2xlYXJUaW1lb3V0O1xuXHRcdCAgd2luZG93LmNsZWFySW50ZXJ2YWwgPSB3aW5kb3cuY2xlYXJJbnRlcnZhbDtcblxuXHRcdCAgLyoqXG5cdFx0ICAgKiAjIyBFeGVjdXRpb25cblx0XHQgICAqXG5cdFx0ICAgKiBSZXBsYWNlIHRoZSBicm93c2VyIHdpbmRvdydzIGBvbmxvYWRgLCBlbnN1cmUgaXQncyBjYWxsZWQsIGFuZCB0aGVuIHJ1biBhbGwgb2YgdGhlIGxvYWRlZCBzcGVjcy4gVGhpcyBpbmNsdWRlcyBpbml0aWFsaXppbmcgdGhlIGBIdG1sUmVwb3J0ZXJgIGluc3RhbmNlIGFuZCB0aGVuIGV4ZWN1dGluZyB0aGUgbG9hZGVkIEphc21pbmUgZW52aXJvbm1lbnQuIEFsbCBvZiB0aGlzIHdpbGwgaGFwcGVuIGFmdGVyIGFsbCBvZiB0aGUgc3BlY3MgYXJlIGxvYWRlZC5cblx0XHQgICAqL1xuXHRcdCAgdmFyIGN1cnJlbnRXaW5kb3dPbmxvYWQgPSB3aW5kb3cub25sb2FkO1xuXG5cdFx0ICAoZnVuY3Rpb24oKSB7XG5cdFx0ICAgIGlmIChjdXJyZW50V2luZG93T25sb2FkKSB7XG5cdFx0ICAgICAgY3VycmVudFdpbmRvd09ubG9hZCgpO1xuXHRcdCAgICB9XG5cdFx0ICAgIGVudi5leGVjdXRlKCk7XG5cdFx0ICB9KSgpO1xuXG5cdFx0ICAvKipcblx0XHQgICAqIEhlbHBlciBmdW5jdGlvbiBmb3IgcmVhZGFiaWxpdHkgYWJvdmUuXG5cdFx0ICAgKi9cblx0XHQgIGZ1bmN0aW9uIGV4dGVuZChkZXN0aW5hdGlvbiwgc291cmNlKSB7XG5cdFx0ICAgIGZvciAodmFyIHByb3BlcnR5IGluIHNvdXJjZSkgZGVzdGluYXRpb25bcHJvcGVydHldID0gc291cmNlW3Byb3BlcnR5XTtcblx0XHQgICAgcmV0dXJuIGRlc3RpbmF0aW9uO1xuXHRcdCAgfVxuXG5cdFx0fSkoKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGdlbmVyYXRlSmFzbWluZVJlcG9ydGVyKGNvbnRhaW5lcil7XG5cdFx0KGZ1bmN0aW9uKGNvbnRhaW5lcikge1xuXHRcdFx0dmFyIGphc21pbmUgPSB3aW5kb3cuamFzbWluZTtcblx0XHRcdHZhciBlbnYgPSBqYXNtaW5lLmdldEVudigpO1xuXG5cdFx0XHR2YXIgcXVlcnlTdHJpbmcgPSBuZXcgamFzbWluZS5RdWVyeVN0cmluZyh7XG5cdFx0XHRcdGdldFdpbmRvd0xvY2F0aW9uOiBmdW5jdGlvbigpIHsgcmV0dXJuIHdpbmRvdy5sb2NhdGlvbjsgfVxuXHRcdFx0fSk7XG5cblx0XHRcdHZhciBjYXRjaGluZ0V4Y2VwdGlvbnMgPSBxdWVyeVN0cmluZy5nZXRQYXJhbShcImNhdGNoXCIpO1xuXHRcdFx0ZW52LmNhdGNoRXhjZXB0aW9ucyh0eXBlb2YgY2F0Y2hpbmdFeGNlcHRpb25zID09PSBcInVuZGVmaW5lZFwiID8gdHJ1ZSA6IGNhdGNoaW5nRXhjZXB0aW9ucyk7XG5cblx0XHRcdHZhciB0aHJvd2luZ0V4cGVjdGF0aW9uRmFpbHVyZXMgPSBxdWVyeVN0cmluZy5nZXRQYXJhbShcInRocm93RmFpbHVyZXNcIik7XG5cdFx0XHRlbnYudGhyb3dPbkV4cGVjdGF0aW9uRmFpbHVyZSh0aHJvd2luZ0V4cGVjdGF0aW9uRmFpbHVyZXMpO1xuXG5cdFx0XHQvKipcblx0XHRcdFx0KiAjIyBSZXBvcnRlcnNcblx0XHRcdFx0KiBUaGUgYEh0bWxSZXBvcnRlcmAgYnVpbGRzIGFsbCBvZiB0aGUgSFRNTCBVSSBmb3IgdGhlIHJ1bm5lciBwYWdlLiBUaGlzIHJlcG9ydGVyIHBhaW50cyB0aGUgZG90cywgc3RhcnMsIGFuZCB4J3MgZm9yIHNwZWNzLCBhcyB3ZWxsIGFzIGFsbCBzcGVjIG5hbWVzIGFuZCBhbGwgZmFpbHVyZXMgKGlmIGFueSkuXG5cdFx0XHQqL1xuXHRcdFx0dmFyIGh0bWxSZXBvcnRlciA9IG5ldyBqYXNtaW5lLkh0bWxSZXBvcnRlcih7XG5cdFx0XHRcdGVudjogZW52LFxuXHRcdFx0XHRvblJhaXNlRXhjZXB0aW9uc0NsaWNrOiBmdW5jdGlvbigpIHsgcXVlcnlTdHJpbmcubmF2aWdhdGVXaXRoTmV3UGFyYW0oXCJjYXRjaFwiLCAhZW52LmNhdGNoaW5nRXhjZXB0aW9ucygpKTsgfSxcblx0XHRcdFx0b25UaHJvd0V4cGVjdGF0aW9uc0NsaWNrOiBmdW5jdGlvbigpIHsgcXVlcnlTdHJpbmcubmF2aWdhdGVXaXRoTmV3UGFyYW0oXCJ0aHJvd0ZhaWx1cmVzXCIsICFlbnYudGhyb3dpbmdFeHBlY3RhdGlvbkZhaWx1cmVzKCkpOyB9LFxuXHRcdFx0XHRhZGRUb0V4aXN0aW5nUXVlcnlTdHJpbmc6IGZ1bmN0aW9uKGtleSwgdmFsdWUpIHsgcmV0dXJuIHF1ZXJ5U3RyaW5nLmZ1bGxTdHJpbmdXaXRoTmV3UGFyYW0oa2V5LCB2YWx1ZSk7IH0sXG5cdFx0XHRcdGdldENvbnRhaW5lcjogZnVuY3Rpb24oKSB7IHJldHVybiBjb250YWluZXI7IH0sXG5cdFx0XHRcdGNyZWF0ZUVsZW1lbnQ6IGZ1bmN0aW9uKCkgeyByZXR1cm4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudC5hcHBseShkb2N1bWVudCwgYXJndW1lbnRzKTsgfSxcblx0XHRcdFx0Y3JlYXRlVGV4dE5vZGU6IGZ1bmN0aW9uKCkgeyByZXR1cm4gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUuYXBwbHkoZG9jdW1lbnQsIGFyZ3VtZW50cyk7IH0sXG5cdFx0XHRcdHRpbWVyOiBuZXcgamFzbWluZS5UaW1lcigpXG5cdFx0XHR9KTtcblx0XHRcdC8qKlxuXHRcdFx0KiBGaWx0ZXIgd2hpY2ggc3BlY3Mgd2lsbCBiZSBydW4gYnkgbWF0Y2hpbmcgdGhlIHN0YXJ0IG9mIHRoZSBmdWxsIG5hbWUgYWdhaW5zdCB0aGUgYHNwZWNgIHF1ZXJ5IHBhcmFtLlxuXHRcdFx0Ki9cblx0XHRcdHZhciBzcGVjRmlsdGVyID0gbmV3IGphc21pbmUuSHRtbFNwZWNGaWx0ZXIoe1xuXHRcdFx0XHRmaWx0ZXJTdHJpbmc6IGZ1bmN0aW9uKCkgeyByZXR1cm4gcXVlcnlTdHJpbmcuZ2V0UGFyYW0oXCJzcGVjXCIpOyB9XG5cdFx0XHR9KTtcblxuXHRcdFx0ZW52LnNwZWNGaWx0ZXIgPSBmdW5jdGlvbihzcGVjKSB7XG5cdFx0XHRcdHJldHVybiBzcGVjRmlsdGVyLm1hdGNoZXMoc3BlYy5nZXRGdWxsTmFtZSgpKTtcblx0XHRcdH07XG5cdFx0XHRlbnYuYWRkUmVwb3J0ZXIoaHRtbFJlcG9ydGVyKTtcblx0XHRcdGh0bWxSZXBvcnRlci5pbml0aWFsaXplKCk7XG5cdFx0XHRlbnYuZXhlY3V0ZSgpO1xuXHRcdH0pKGNvbnRhaW5lcik7XG5cdH1cblxuXHRmdW5jdGlvbiBjcmVhdGVKYXNtaW5lUmVwb3J0ZXIoY29udGFpbmVyKXtcblx0Lypcblx0XHRDb3B5cmlnaHQgKGMpIDIwMDgtMjAxNSBQaXZvdGFsIExhYnNcblxuXHRcdFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZ1xuXHRcdGEgY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuXHRcdFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuXHRcdHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcblx0XHRkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG9cblx0XHRwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG9cblx0XHR0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG5cblx0XHRUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZVxuXHRcdGluY2x1ZGVkIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuXG5cdFx0VEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCxcblx0XHRFWFBSRVNTIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcblx0XHRNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORFxuXHRcdE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkVcblx0XHRMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OXG5cdFx0T0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OXG5cdFx0V0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cdFx0Ki9cblx0XHQvKipcblx0XHQgU3RhcnRpbmcgd2l0aCB2ZXJzaW9uIDIuMCwgdGhpcyBmaWxlIFwiYm9vdHNcIiBKYXNtaW5lLCBwZXJmb3JtaW5nIGFsbCBvZiB0aGUgbmVjZXNzYXJ5IGluaXRpYWxpemF0aW9uIGJlZm9yZSBleGVjdXRpbmcgdGhlIGxvYWRlZCBlbnZpcm9ubWVudCBhbmQgYWxsIG9mIGEgcHJvamVjdCdzIHNwZWNzLiBUaGlzIGZpbGUgc2hvdWxkIGJlIGxvYWRlZCBhZnRlciBgamFzbWluZS5qc2AgYW5kIGBqYXNtaW5lX2h0bWwuanNgLCBidXQgYmVmb3JlIGFueSBwcm9qZWN0IHNvdXJjZSBmaWxlcyBvciBzcGVjIGZpbGVzIGFyZSBsb2FkZWQuIFRodXMgdGhpcyBmaWxlIGNhbiBhbHNvIGJlIHVzZWQgdG8gY3VzdG9taXplIEphc21pbmUgZm9yIGEgcHJvamVjdC5cblxuXHRcdCBJZiBhIHByb2plY3QgaXMgdXNpbmcgSmFzbWluZSB2aWEgdGhlIHN0YW5kYWxvbmUgZGlzdHJpYnV0aW9uLCB0aGlzIGZpbGUgY2FuIGJlIGN1c3RvbWl6ZWQgZGlyZWN0bHkuIElmIGEgcHJvamVjdCBpcyB1c2luZyBKYXNtaW5lIHZpYSB0aGUgW1J1YnkgZ2VtXVtqYXNtaW5lLWdlbV0sIHRoaXMgZmlsZSBjYW4gYmUgY29waWVkIGludG8gdGhlIHN1cHBvcnQgZGlyZWN0b3J5IHZpYSBgamFzbWluZSBjb3B5X2Jvb3RfanNgLiBPdGhlciBlbnZpcm9ubWVudHMgKGUuZy4sIFB5dGhvbikgd2lsbCBoYXZlIGRpZmZlcmVudCBtZWNoYW5pc21zLlxuXG5cdFx0IFRoZSBsb2NhdGlvbiBvZiBgYm9vdC5qc2AgY2FuIGJlIHNwZWNpZmllZCBhbmQvb3Igb3ZlcnJpZGRlbiBpbiBgamFzbWluZS55bWxgLlxuXG5cdFx0IFtqYXNtaW5lLWdlbV06IGh0dHA6Ly9naXRodWIuY29tL3Bpdm90YWwvamFzbWluZS1nZW1cblx0XHQgKi9cblxuXHRcdChmdW5jdGlvbihjb250YWluZXIpIHtcblx0XHQgIC8qKlxuXHRcdCAgICogIyMgUmVxdWlyZSAmYW1wOyBJbnN0YW50aWF0ZVxuXHRcdCAgICpcblx0XHQgICAqIFJlcXVpcmUgSmFzbWluZSdzIGNvcmUgZmlsZXMuIFNwZWNpZmljYWxseSwgdGhpcyByZXF1aXJlcyBhbmQgYXR0YWNoZXMgYWxsIG9mIEphc21pbmUncyBjb2RlIHRvIHRoZSBgamFzbWluZWAgcmVmZXJlbmNlLlxuXHRcdCAgICovXG5cdFx0ICB3aW5kb3cuamFzbWluZSA9IGphc21pbmVSZXF1aXJlLmNvcmUoamFzbWluZVJlcXVpcmUpO1xuXG5cdFx0ICAvKipcblx0XHQgICAqIFNpbmNlIHRoaXMgaXMgYmVpbmcgcnVuIGluIGEgYnJvd3NlciBhbmQgdGhlIHJlc3VsdHMgc2hvdWxkIHBvcHVsYXRlIHRvIGFuIEhUTUwgcGFnZSwgcmVxdWlyZSB0aGUgSFRNTC1zcGVjaWZpYyBKYXNtaW5lIGNvZGUsIGluamVjdGluZyB0aGUgc2FtZSByZWZlcmVuY2UuXG5cdFx0ICAgKi9cblx0XHQgIGphc21pbmVSZXF1aXJlLmh0bWwoamFzbWluZSk7XG5cblx0XHQgIC8qKlxuXHRcdCAgICogQ3JlYXRlIHRoZSBKYXNtaW5lIGVudmlyb25tZW50LiBUaGlzIGlzIHVzZWQgdG8gcnVuIGFsbCBzcGVjcyBpbiBhIHByb2plY3QuXG5cdFx0ICAgKi9cblx0XHQgIHZhciBlbnYgPSBqYXNtaW5lLmdldEVudigpO1xuXG5cdFx0ICAvKipcblx0XHQgICAqICMjIFRoZSBHbG9iYWwgSW50ZXJmYWNlXG5cdFx0ICAgKlxuXHRcdCAgICogQnVpbGQgdXAgdGhlIGZ1bmN0aW9ucyB0aGF0IHdpbGwgYmUgZXhwb3NlZCBhcyB0aGUgSmFzbWluZSBwdWJsaWMgaW50ZXJmYWNlLiBBIHByb2plY3QgY2FuIGN1c3RvbWl6ZSwgcmVuYW1lIG9yIGFsaWFzIGFueSBvZiB0aGVzZSBmdW5jdGlvbnMgYXMgZGVzaXJlZCwgcHJvdmlkZWQgdGhlIGltcGxlbWVudGF0aW9uIHJlbWFpbnMgdW5jaGFuZ2VkLlxuXHRcdCAgICovXG5cdFx0ICB2YXIgamFzbWluZUludGVyZmFjZSA9IGphc21pbmVSZXF1aXJlLmludGVyZmFjZShqYXNtaW5lLCBlbnYpO1xuXG5cdFx0ICAvKipcblx0XHQgICAqIEFkZCBhbGwgb2YgdGhlIEphc21pbmUgZ2xvYmFsL3B1YmxpYyBpbnRlcmZhY2UgdG8gdGhlIGdsb2JhbCBzY29wZSwgc28gYSBwcm9qZWN0IGNhbiB1c2UgdGhlIHB1YmxpYyBpbnRlcmZhY2UgZGlyZWN0bHkuIEZvciBleGFtcGxlLCBjYWxsaW5nIGBkZXNjcmliZWAgaW4gc3BlY3MgaW5zdGVhZCBvZiBgamFzbWluZS5nZXRFbnYoKS5kZXNjcmliZWAuXG5cdFx0ICAgKi9cblx0XHQgIGV4dGVuZCh3aW5kb3csIGphc21pbmVJbnRlcmZhY2UpO1xuXG5cdFx0ICAvKipcblx0XHQgICAqICMjIFJ1bm5lciBQYXJhbWV0ZXJzXG5cdFx0ICAgKlxuXHRcdCAgICogTW9yZSBicm93c2VyIHNwZWNpZmljIGNvZGUgLSB3cmFwIHRoZSBxdWVyeSBzdHJpbmcgaW4gYW4gb2JqZWN0IGFuZCB0byBhbGxvdyBmb3IgZ2V0dGluZy9zZXR0aW5nIHBhcmFtZXRlcnMgZnJvbSB0aGUgcnVubmVyIHVzZXIgaW50ZXJmYWNlLlxuXHRcdCAgICovXG5cblx0XHQgIHZhciBxdWVyeVN0cmluZyA9IG5ldyBqYXNtaW5lLlF1ZXJ5U3RyaW5nKHtcblx0XHQgICAgZ2V0V2luZG93TG9jYXRpb246IGZ1bmN0aW9uKCkgeyByZXR1cm4gd2luZG93LmxvY2F0aW9uOyB9XG5cdFx0ICB9KTtcblxuXHRcdCAgdmFyIGNhdGNoaW5nRXhjZXB0aW9ucyA9IHF1ZXJ5U3RyaW5nLmdldFBhcmFtKFwiY2F0Y2hcIik7XG5cdFx0ICBlbnYuY2F0Y2hFeGNlcHRpb25zKHR5cGVvZiBjYXRjaGluZ0V4Y2VwdGlvbnMgPT09IFwidW5kZWZpbmVkXCIgPyB0cnVlIDogY2F0Y2hpbmdFeGNlcHRpb25zKTtcblxuXHRcdCAgdmFyIHRocm93aW5nRXhwZWN0YXRpb25GYWlsdXJlcyA9IHF1ZXJ5U3RyaW5nLmdldFBhcmFtKFwidGhyb3dGYWlsdXJlc1wiKTtcblx0XHQgIGVudi50aHJvd09uRXhwZWN0YXRpb25GYWlsdXJlKHRocm93aW5nRXhwZWN0YXRpb25GYWlsdXJlcyk7XG5cblx0XHQgIC8qKlxuXHRcdCAgICogIyMgUmVwb3J0ZXJzXG5cdFx0ICAgKiBUaGUgYEh0bWxSZXBvcnRlcmAgYnVpbGRzIGFsbCBvZiB0aGUgSFRNTCBVSSBmb3IgdGhlIHJ1bm5lciBwYWdlLiBUaGlzIHJlcG9ydGVyIHBhaW50cyB0aGUgZG90cywgc3RhcnMsIGFuZCB4J3MgZm9yIHNwZWNzLCBhcyB3ZWxsIGFzIGFsbCBzcGVjIG5hbWVzIGFuZCBhbGwgZmFpbHVyZXMgKGlmIGFueSkuXG5cdFx0ICAgKi9cblx0XHQgIHZhciBodG1sUmVwb3J0ZXIgPSBuZXcgamFzbWluZS5IdG1sUmVwb3J0ZXIoe1xuXHRcdCAgICBlbnY6IGVudixcblx0XHQgICAgb25SYWlzZUV4Y2VwdGlvbnNDbGljazogZnVuY3Rpb24oKSB7IHF1ZXJ5U3RyaW5nLm5hdmlnYXRlV2l0aE5ld1BhcmFtKFwiY2F0Y2hcIiwgIWVudi5jYXRjaGluZ0V4Y2VwdGlvbnMoKSk7IH0sXG5cdFx0ICAgIG9uVGhyb3dFeHBlY3RhdGlvbnNDbGljazogZnVuY3Rpb24oKSB7IHF1ZXJ5U3RyaW5nLm5hdmlnYXRlV2l0aE5ld1BhcmFtKFwidGhyb3dGYWlsdXJlc1wiLCAhZW52LnRocm93aW5nRXhwZWN0YXRpb25GYWlsdXJlcygpKTsgfSxcblx0XHQgICAgYWRkVG9FeGlzdGluZ1F1ZXJ5U3RyaW5nOiBmdW5jdGlvbihrZXksIHZhbHVlKSB7IHJldHVybiBxdWVyeVN0cmluZy5mdWxsU3RyaW5nV2l0aE5ld1BhcmFtKGtleSwgdmFsdWUpOyB9LFxuXHRcdCAgICBnZXRDb250YWluZXI6IGZ1bmN0aW9uKCkgeyByZXR1cm4gY29udGFpbmVyOyB9LFxuXHRcdCAgICBjcmVhdGVFbGVtZW50OiBmdW5jdGlvbigpIHsgcmV0dXJuIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQuYXBwbHkoZG9jdW1lbnQsIGFyZ3VtZW50cyk7IH0sXG5cdFx0ICAgIGNyZWF0ZVRleHROb2RlOiBmdW5jdGlvbigpIHsgcmV0dXJuIGRvY3VtZW50LmNyZWF0ZVRleHROb2RlLmFwcGx5KGRvY3VtZW50LCBhcmd1bWVudHMpOyB9LFxuXHRcdCAgICB0aW1lcjogbmV3IGphc21pbmUuVGltZXIoKVxuXHRcdCAgfSk7XG5cblx0XHQgIC8qKlxuXHRcdCAgICogVGhlIGBqc0FwaVJlcG9ydGVyYCBhbHNvIHJlY2VpdmVzIHNwZWMgcmVzdWx0cywgYW5kIGlzIHVzZWQgYnkgYW55IGVudmlyb25tZW50IHRoYXQgbmVlZHMgdG8gZXh0cmFjdCB0aGUgcmVzdWx0cyAgZnJvbSBKYXZhU2NyaXB0LlxuXHRcdCAgICovXG5cdFx0ICBlbnYuYWRkUmVwb3J0ZXIoamFzbWluZUludGVyZmFjZS5qc0FwaVJlcG9ydGVyKTtcblx0XHQgIGVudi5hZGRSZXBvcnRlcihodG1sUmVwb3J0ZXIpO1xuXG5cdFx0ICAvKipcblx0XHQgICAqIEZpbHRlciB3aGljaCBzcGVjcyB3aWxsIGJlIHJ1biBieSBtYXRjaGluZyB0aGUgc3RhcnQgb2YgdGhlIGZ1bGwgbmFtZSBhZ2FpbnN0IHRoZSBgc3BlY2AgcXVlcnkgcGFyYW0uXG5cdFx0ICAgKi9cblx0XHQgIHZhciBzcGVjRmlsdGVyID0gbmV3IGphc21pbmUuSHRtbFNwZWNGaWx0ZXIoe1xuXHRcdCAgICBmaWx0ZXJTdHJpbmc6IGZ1bmN0aW9uKCkgeyByZXR1cm4gcXVlcnlTdHJpbmcuZ2V0UGFyYW0oXCJzcGVjXCIpOyB9XG5cdFx0ICB9KTtcblxuXHRcdCAgZW52LnNwZWNGaWx0ZXIgPSBmdW5jdGlvbihzcGVjKSB7XG5cdFx0ICAgIHJldHVybiBzcGVjRmlsdGVyLm1hdGNoZXMoc3BlYy5nZXRGdWxsTmFtZSgpKTtcblx0XHQgIH07XG5cblx0XHQgIC8qKlxuXHRcdCAgICogU2V0dGluZyB1cCB0aW1pbmcgZnVuY3Rpb25zIHRvIGJlIGFibGUgdG8gYmUgb3ZlcnJpZGRlbi4gQ2VydGFpbiBicm93c2VycyAoU2FmYXJpLCBJRSA4LCBwaGFudG9tanMpIHJlcXVpcmUgdGhpcyBoYWNrLlxuXHRcdCAgICovXG5cdFx0ICB3aW5kb3cuc2V0VGltZW91dCA9IHdpbmRvdy5zZXRUaW1lb3V0O1xuXHRcdCAgd2luZG93LnNldEludGVydmFsID0gd2luZG93LnNldEludGVydmFsO1xuXHRcdCAgd2luZG93LmNsZWFyVGltZW91dCA9IHdpbmRvdy5jbGVhclRpbWVvdXQ7XG5cdFx0ICB3aW5kb3cuY2xlYXJJbnRlcnZhbCA9IHdpbmRvdy5jbGVhckludGVydmFsO1xuXG5cdFx0ICAvKipcblx0XHQgICAqICMjIEV4ZWN1dGlvblxuXHRcdCAgICpcblx0XHQgICAqIFJlcGxhY2UgdGhlIGJyb3dzZXIgd2luZG93J3MgYG9ubG9hZGAsIGVuc3VyZSBpdCdzIGNhbGxlZCwgYW5kIHRoZW4gcnVuIGFsbCBvZiB0aGUgbG9hZGVkIHNwZWNzLiBUaGlzIGluY2x1ZGVzIGluaXRpYWxpemluZyB0aGUgYEh0bWxSZXBvcnRlcmAgaW5zdGFuY2UgYW5kIHRoZW4gZXhlY3V0aW5nIHRoZSBsb2FkZWQgSmFzbWluZSBlbnZpcm9ubWVudC4gQWxsIG9mIHRoaXMgd2lsbCBoYXBwZW4gYWZ0ZXIgYWxsIG9mIHRoZSBzcGVjcyBhcmUgbG9hZGVkLlxuXHRcdCAgICovXG5cdFx0ICB2YXIgY3VycmVudFdpbmRvd09ubG9hZCA9IHdpbmRvdy5vbmxvYWQ7XG5cblx0XHQgIChmdW5jdGlvbigpIHtcblx0XHQgICAgaWYgKGN1cnJlbnRXaW5kb3dPbmxvYWQpIHtcblx0XHQgICAgICBjdXJyZW50V2luZG93T25sb2FkKCk7XG5cdFx0ICAgIH1cblx0XHQgICAgaHRtbFJlcG9ydGVyLmluaXRpYWxpemUoKTtcblx0XHQgICAgZW52LmV4ZWN1dGUoKTtcblx0XHQgIH0pKCk7XG5cblx0XHQgIC8qKlxuXHRcdCAgICogSGVscGVyIGZ1bmN0aW9uIGZvciByZWFkYWJpbGl0eSBhYm92ZS5cblx0XHQgICAqL1xuXHRcdCAgZnVuY3Rpb24gZXh0ZW5kKGRlc3RpbmF0aW9uLCBzb3VyY2UpIHtcblx0XHQgICAgZm9yICh2YXIgcHJvcGVydHkgaW4gc291cmNlKSBkZXN0aW5hdGlvbltwcm9wZXJ0eV0gPSBzb3VyY2VbcHJvcGVydHldO1xuXHRcdCAgICByZXR1cm4gZGVzdGluYXRpb247XG5cdFx0ICB9XG5cblx0XHR9KShjb250YWluZXIpO1xuXG5cdH1cblxuXHRyZXR1cm4ge1xuXHRcdGNyZWF0ZUphc21pbmVSZXBvcnRlciA6IGNyZWF0ZUphc21pbmVSZXBvcnRlcixcblx0XHRpbml0aWFsaXplSmFzbWluZSA6IGluaXRpYWxpemVKYXNtaW5lLFxuXHRcdGdlbmVyYXRlSmFzbWluZVJlcG9ydGVyIDogZ2VuZXJhdGVKYXNtaW5lUmVwb3J0ZXJcblx0fTtcbn0pOyIsImFwcC5kaXJlY3RpdmUoJ2pzbG9hZCcsIGZ1bmN0aW9uKCl7XG5cdGZ1bmN0aW9uIHVwZGF0ZVNjcmlwdChlbGVtZW50LCB0ZXh0KXtcblx0XHRlbGVtZW50LmVtcHR5KCk7XG5cdFx0dmFyIHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xuXHRcdHNjcmlwdC50eXBlID0gJ3RleHQvamF2YXNjcmlwdCc7XG5cdFx0c2NyaXB0LmlubmVySFRNTCA9IHRleHQ7XG5cdFx0Y29uc29sZS5sb2coc2NyaXB0KTtcblx0XHRlbGVtZW50LmFwcGVuZChzY3JpcHQpO1xuXHR9XG5cdHJldHVybiB7XG5cdFx0cmVzdHJpY3QgOiAnRScsXG5cdFx0c2NvcGUgOiB7XG5cdFx0XHR0ZXh0IDogJz0nXG5cdFx0fSxcblx0XHR0ZW1wbGF0ZVVybDogJ2ZlYXR1cmVzL2NvbW1vbi9kaXJlY3RpdmVzL2pzLWxvYWQvanMtbG9hZC5odG1sJyxcblx0XHRsaW5rIDogZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHJpYnV0ZXMpe1xuXHRcdFx0c2NvcGUuJHdhdGNoKCd0ZXh0JywgZnVuY3Rpb24odGV4dCl7XG5cdFx0XHRcdHVwZGF0ZVNjcmlwdChlbGVtZW50LCB0ZXh0KTtcblx0XHRcdH0pO1xuXHRcdFx0Y29uc29sZS5sb2coc2NvcGUudGV4dCk7XG5cdFx0fVxuXHR9O1xufSk7XG5cbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==