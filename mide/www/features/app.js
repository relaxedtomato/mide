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
        console.log("does reg window work?");
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
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

app.controller('ChallengeCodeCtrl', function($scope, $state, $rootScope, ChallengeFactory, ChallengeFooterFactory){

	setTimeout(function (){
		$scope.keyboardVis = window.cordova.plugins.Keyboard.isVisible;
			console.log("cordova isvis", window.cordova.plugins.Keyboard.isVisible);
			console.log("$scope keyboardVis", $scope.keyboardVis);


		if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
			console.log("got in here");
		  window.cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
		  window.cordova.plugins.Keyboard.disableScroll(true);
		}
	}, 500);

	$scope.footerHotkeys = ChallengeFooterFactory.getHotkeys();

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
		// window.cordova.plugins.Keyboard.show();
		myCodeMirror.focus();
	};

    myCodeMirror.on("change", function (myCodeMirror, changeObj){
    	$scope.updateText();
    });
    // myCodeMirror.on("cursorActivity", function (myCodeMirror, changeObj){
    // 	window.cordova.plugins.Keyboard.show();
    // 	$scope.keyboardVis = true;
    // 	$scope.$apply();
    // });
    window.addEventListener("native.keyboardshow", function (){
    	$scope.keyboardVis = true;
    	$scope.$apply();
    });
    window.addEventListener("native.keyboardhide", function (){
    	$scope.keyboardVis = false;
    	$scope.$apply();
    });

    // myCodeMirror.off("focus", function (myCodeMirror, changeObj){
    // 	$scope.keyboardVis = $window.cordova.plugins.Keyboard.isVisible;
    // });
	

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

				if(ExercismFactory.getTestScript().length === 0) {
					var exercise = AvailableExercises.getRandomExercise();
					ExercismFactory.setName(exercise.name);
					return ExercismFactory.getExternalScript(exercise.link).then(function(data){
						return ExercismFactory.getExternalMd(exercise.mdLink);
					});
				}
				return;
			}
		}
	});
});

app.factory('ExercismFactory', function($http, $rootScope){
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
			$rootScope.$broadcast('testChange', {test : test});
		},
		setCodeScript : function (code){
			code = code;
			$rootScope.$broadcast('codeChange', {code : code});
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
		'circular-buffer',
		'clock',
		'crypto-square',
		'custom-set',
		'difference-of-squares',
		'etl',
		'food-chain',
		'gigasecond',
		'grade-school',
		'grains',
		'hamming',
		'hello-world',
		'hexadecimal'
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

app.controller('ExercismCodeCtrl', function($scope, ExercismFactory, $state){
	$scope.name = ExercismFactory.getName();
	$scope.code = ExercismFactory.getCodeScript();

	//passing this update function so that on text change in the directive the factory will be alerted
	$scope.compile = function(code){
		ExercismFactory.setCodeScript(code);
		$state.go('exercism.compile');
	};
});
app.config(function($stateProvider){
	$stateProvider.state('exercism.compile', {
		url : '/exercism/compile',
		views : {
			'tab-compile' : {
				templateUrl : 'features/exercism-compile/exercism-compile.html',
				controller: 'ExercismCompileCtrl'
			}
		},
		onEnter : function(){
			if(window.jasmine) window.jasmine.getEnv().execute();
		}
	});
});

app.controller('ExercismCompileCtrl', function($scope, ExercismFactory){
	$scope.name = ExercismFactory.getName();
	$scope.test = ExercismFactory.getTestScript();
	$scope.code = ExercismFactory.getCodeScript();

	$scope.$on('testChange', function(event, data){
		$scope.test = data.test;
	});

	$scope.$on('codeChange', function(event, data){
		$scope.code = data.code;
	});
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

	//passing this update function so that on text change in the directive the factory will be alerted
	$scope.updatefunc = function(newValue){
		ExercismFactory.setTestScript(newValue);
	};
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
app.filter('append', function(){
	return function(input, append){
		return append + input;
	};
});
app.filter('bool', function(){
	return function(input, condition, ifTrue, ifFalse){
		if(eval(input + condition)){
			return ifTrue;
		} else {
			return ifFalse;
		}
	};
});
app.filter('nameformat', function(){
	return function(text){
		return 'Exercism - ' + text.split('-').map(function(el){
			return el.charAt(0).toUpperCase() + el.slice(1);
		}).join(' ');
	};
});
app.filter('length', function(){
	return function(arrInput){
		var checkArr = arrInput || [];
		return checkArr.length;
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
			ngModel : '=',
			updatefunc: '='
		},
		link : function(scope, element, attribute){
			var updateText = function(){
				var newValue = myCodeMirror.getValue();
				scope.ngModel = newValue;
				if(scope.updatefunc) scope.updatefunc(newValue);
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
app.directive('jasmine', function(JasmineReporter){
	return {
		restrict : 'E',
		transclude: true,
		scope : {
			test: '=',
			code: '='
		},
		templateUrl : 'features/common/directives/jasmine/jasmine.html',
		link : function (scope, element, attribute){
			scope.$watch('test', function(){
				window.jasmine = null;
				JasmineReporter.initializeJasmine();
				JasmineReporter.addReporter(scope);
			});

			scope.$watch('code', function(){
				window.jasmine = null;
				JasmineReporter.initializeJasmine();
				JasmineReporter.addReporter(scope);
			});

			function flattenRemoveDupes(arr, keyCheck){
				var tracker = [];
				return window._.flatten(arr).filter(function(el){
					if(tracker.indexOf(el[keyCheck]) == -1){
						tracker.push(el[keyCheck]);
						return true;
					}
					return false;
				});
			}

			scope.summaryShowing = true;

			scope.showSummary = function(){
				if(!scope.summaryShowing) scope.summaryShowing = !scope.summaryShowing;
			};
			scope.showFailures = function(){
				if(scope.summaryShowing) scope.summaryShowing = !scope.summaryShowing;
			};


			scope.$watch('suites', function(){
				if(scope.suites){
					var suitesSpecs = scope.suites.map(function(el){
						return el.specs;
					});
					scope.specsOverview = flattenRemoveDupes(suitesSpecs, "id");
					console.log(scope.specsOverview);
				}
			});

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

	function addReporter(scope){
		var suites = [];
		var currentSuite = {};

		function Suite(obj){
			this.id = obj.id;
			this.description = obj.description;
			this.fullName = obj.fullName;
			this.failedExpectations = obj.failedExpectations;
			this.status = obj.finished;
			this.specs = [];
		}

		var myReporter = {

			jasmineStarted: function(options){
				console.log(options);
				suites = [];
				scope.totalSpecs = options.totalSpecsDefined;
			},
			suiteStarted: function(suite){
				console.log('this is the suite started');
				console.log(suite);
				scope.suiteStarted = suite;
				currentSuite = new Suite(suite);
			},
			specStarted: function(spec){
				console.log('this is the spec started');
				console.log(spec);
				scope.specStarted = spec;
			},
			specDone: function(spec){
				console.log('this is the spec done');
				console.log(spec);
				scope.specDone = spec;
				currentSuite.specs.push(spec);
			},
			suiteDone: function(suite){
				console.log('this is the suite done');
				console.log(suite);
				scope.suiteDone = suite;
				suites.push(currentSuite);
			},
			jasmineDone: function(){
				console.log('Finished suite');
				scope.suites = suites;
			}
		};

		window.jasmine.getEnv().addReporter(myReporter);
	}

	return {
		initializeJasmine : initializeJasmine,
		addReporter: addReporter
	};
});
app.directive('jsload', function(){
	function updateScript(element, text){
		element.empty();
		var script = document.createElement('script');
		script.type = 'text/javascript';
		script.innerHTML = text;
		element.append(script);
	}
	return {
		restrict : 'E',
		scope : {
			text : '='
		},
		link : function(scope, element, attributes){
			scope.$watch('text', function(text){
				updateScript(element, text);
			});
		}
	};
});


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImFjY291bnQvYWNjb3VudC5qcyIsImNoYWxsZW5nZS9jaGFsbGVuZ2UuanMiLCJjaGFsbGVuZ2UtY29kZS9jaGFsbGVuZ2UtY29kZS5qcyIsImNoYWxsZW5nZS1jb2RlL2NoYWxsZW5nZS1mb290ZXIuanMiLCJjaGFsbGVuZ2UtY29tcGlsZS9jaGFsbGVuZ2UtY29tcGlsZS5qcyIsImNoYWxsZW5nZS12aWV3L2NoYWxsZW5nZS12aWV3LmpzIiwiY2hhdHMvY2hhdHMuanMiLCJlcnJvci9lcnJvci5qcyIsImV4ZXJjaXNtL2V4ZXJjaXNtLmpzIiwiZXhlcmNpc20tY29kZS9leGVyY2lzbS1jb2RlLmpzIiwiZXhlcmNpc20tY29tcGlsZS9leGVyY2lzbS1jb21waWxlLmpzIiwiZXhlcmNpc20tdGVzdC9leGVyY2lzbS10ZXN0LmpzIiwiZXhlcmNpc20tdmlldy9leGVyY2lzbS12aWV3LmpzIiwibG9naW4vbG9naW4uanMiLCJzaWdudXAvc2lnbnVwLmpzIiwid2VsY29tZS93ZWxjb21lLmpzIiwiY29tbW9uL0F1dGhlbnRpY2F0aW9uL2F1dGhlbnRpY2F0aW9uLmpzIiwiY29tbW9uL2ZpbHRlcnMvYXBwZW5kLmpzIiwiY29tbW9uL2ZpbHRlcnMvYm9vbC5qcyIsImNvbW1vbi9maWx0ZXJzL2V4ZXJjaXNtLWZvcm1hdC1uYW1lLmpzIiwiY29tbW9uL2ZpbHRlcnMvbGVuZ3RoLmpzIiwiY29tbW9uL2ZpbHRlcnMvbWFya2VkLmpzIiwiY29tbW9uL2RpcmVjdGl2ZXMvY29kZW1pcnJvci1lZGl0L2NvZGVtaXJyb3ItZWRpdC5qcyIsImNvbW1vbi9kaXJlY3RpdmVzL2NvZGVtaXJyb3ItcmVhZC9jb2RlbWlycm9yLXJlYWQuanMiLCJjb21tb24vZGlyZWN0aXZlcy9qYXNtaW5lL2phc21pbmUuanMiLCJjb21tb24vZGlyZWN0aXZlcy9qcy1sb2FkL2pzLWxvYWQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeEpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM5R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDOUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6SkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gSW9uaWMgU3RhcnRlciBBcHBcblxuLy8gYW5ndWxhci5tb2R1bGUgaXMgYSBnbG9iYWwgcGxhY2UgZm9yIGNyZWF0aW5nLCByZWdpc3RlcmluZyBhbmQgcmV0cmlldmluZyBBbmd1bGFyIG1vZHVsZXNcbi8vICdzdGFydGVyJyBpcyB0aGUgbmFtZSBvZiB0aGlzIGFuZ3VsYXIgbW9kdWxlIGV4YW1wbGUgKGFsc28gc2V0IGluIGEgPGJvZHk+IGF0dHJpYnV0ZSBpbiBpbmRleC5odG1sKVxuLy8gdGhlIDJuZCBwYXJhbWV0ZXIgaXMgYW4gYXJyYXkgb2YgJ3JlcXVpcmVzJ1xuLy8gJ3N0YXJ0ZXIuc2VydmljZXMnIGlzIGZvdW5kIGluIHNlcnZpY2VzLmpzXG4vLyAnc3RhcnRlci5jb250cm9sbGVycycgaXMgZm91bmQgaW4gY29udHJvbGxlcnMuanNcbnZhciBhcHAgPSBhbmd1bGFyLm1vZHVsZSgnbWlkZScsIFsnaW9uaWMnXSlcblxuLnJ1bihmdW5jdGlvbigkaW9uaWNQbGF0Zm9ybSkge1xuICAkaW9uaWNQbGF0Zm9ybS5yZWFkeShmdW5jdGlvbigpIHtcbiAgICAvLyBIaWRlIHRoZSBhY2Nlc3NvcnkgYmFyIGJ5IGRlZmF1bHQgKHJlbW92ZSB0aGlzIHRvIHNob3cgdGhlIGFjY2Vzc29yeSBiYXIgYWJvdmUgdGhlIGtleWJvYXJkXG4gICAgLy8gZm9yIGZvcm0gaW5wdXRzKVxuICAgIC8vICRsb2NhdGlvblByb3ZpZGVyLmh0bWw1TW9kZSh0cnVlKTtcbiAgICBpZiAod2luZG93LmNvcmRvdmEgJiYgd2luZG93LmNvcmRvdmEucGx1Z2lucyAmJiB3aW5kb3cuY29yZG92YS5wbHVnaW5zLktleWJvYXJkKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiZG9lcyByZWcgd2luZG93IHdvcms/XCIpO1xuICAgICAgY29yZG92YS5wbHVnaW5zLktleWJvYXJkLmhpZGVLZXlib2FyZEFjY2Vzc29yeUJhcih0cnVlKTtcbiAgICAgIGNvcmRvdmEucGx1Z2lucy5LZXlib2FyZC5kaXNhYmxlU2Nyb2xsKHRydWUpO1xuICAgIH1cbiAgICBpZiAod2luZG93LlN0YXR1c0Jhcikge1xuICAgICAgLy8gb3JnLmFwYWNoZS5jb3Jkb3ZhLnN0YXR1c2JhciByZXF1aXJlZFxuICAgICAgU3RhdHVzQmFyLnN0eWxlTGlnaHRDb250ZW50KCk7XG4gICAgfVxuICB9KTtcbn0pXG5cbi8vVE9ETzpUaGlzIGlzIG5lZWRlZCB0byBzZXQgdG8gYWNjZXNzIHRoZSBwcm94eSB1cmwgdGhhdCB3aWxsIHRoZW4gaW4gdGhlIGlvbmljLnByb2plY3QgZmlsZSByZWRpcmVjdCBpdCB0byB0aGUgY29ycmVjdCBVUkxcbi5jb25zdGFudCgnQXBpRW5kcG9pbnQnLCB7XG4gIHVybCA6ICcvYXBpJyxcbiAgc2Vzc2lvbjogJy9zZXNzaW9uJ1xufSlcblxuLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyKSB7XG4gIC8vIElvbmljIHVzZXMgQW5ndWxhclVJIFJvdXRlciB3aGljaCB1c2VzIHRoZSBjb25jZXB0IG9mIHN0YXRlc1xuICAvLyBMZWFybiBtb3JlIGhlcmU6IGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyLXVpL3VpLXJvdXRlclxuICAvLyBTZXQgdXAgdGhlIHZhcmlvdXMgc3RhdGVzIHdoaWNoIHRoZSBhcHAgY2FuIGJlIGluLlxuICAvLyBFYWNoIHN0YXRlJ3MgY29udHJvbGxlciBjYW4gYmUgZm91bmQgaW4gY29udHJvbGxlcnMuanNcbiAgLy8gaWYgbm9uZSBvZiB0aGUgYWJvdmUgc3RhdGVzIGFyZSBtYXRjaGVkLCB1c2UgdGhpcyBhcyB0aGUgZmFsbGJhY2tcbiAgLy8gJHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZSgnL2NoYWxsZW5nZS92aWV3Jyk7IC8vVE9ETzogQWxiZXJ0IHRlc3RpbmcgdGhpcyByb3V0ZVxuXG4gICR1cmxSb3V0ZXJQcm92aWRlci5vdGhlcndpc2UoJy93ZWxjb21lJyk7IC8vIFRPRE86IFJpY2hhcmQgdGVzdGluZyB0aGlzIHJvdXRlXG4gIC8vJHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZSgnL3RhYi9jaGFsbGVuZ2UnKTsgLy9UT0RPOiBUb255IHRlc3RpbmcgdGhpcyByb3V0ZVxuICAvLyAkdXJsUm91dGVyUHJvdmlkZXIub3RoZXJ3aXNlKCd3ZWxjb21lJyk7XG5cbn0pXG4vL1xuXG4vLy8vcnVuIGJsb2NrczogaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8yMDY2MzA3Ni9hbmd1bGFyanMtYXBwLXJ1bi1kb2N1bWVudGF0aW9uXG4vL1VzZSBydW4gbWV0aG9kIHRvIHJlZ2lzdGVyIHdvcmsgd2hpY2ggc2hvdWxkIGJlIHBlcmZvcm1lZCB3aGVuIHRoZSBpbmplY3RvciBpcyBkb25lIGxvYWRpbmcgYWxsIG1vZHVsZXMuXG4vL2h0dHA6Ly9kZXZkYWN0aWMuY29tL3VzZXItYXV0aC1hbmd1bGFyanMtaW9uaWMvXG5cbi5ydW4oZnVuY3Rpb24gKCRyb290U2NvcGUsICRzdGF0ZSwgQXV0aFNlcnZpY2UsIEFVVEhfRVZFTlRTKSB7XG5cbiAgICB2YXIgZGVzdGluYXRpb25TdGF0ZVJlcXVpcmVzQXV0aCA9IGZ1bmN0aW9uIChzdGF0ZSkge1xuICAgICAgICAvL2NvbnNvbGUubG9nKCdjbCAtIGRlc3RpbmF0aW9uU3RhdGVSZXF1aXJlc0F1dGgnLCdzdGF0ZS5kYXRhJyxzdGF0ZS5kYXRhLCdzdGF0ZS5kYXRhLmF1dGgnLHN0YXRlLmRhdGEuYXV0aGVudGljYXRlKTtcbiAgICAgICAgcmV0dXJuIHN0YXRlLmRhdGEgJiYgc3RhdGUuZGF0YS5hdXRoZW50aWNhdGU7XG4gICAgfTtcbiAgIFxuICAgIC8vVE9ETzogTmVlZCB0byBtYWtlIGF1dGhlbnRpY2F0aW9uIG1vcmUgcm9idXN0IGJlbG93IGRvZXMgbm90IGZvbGxvdyBGU0cgKGV0LiBhbC4pXG4gICAgLy9UT0RPOiBDdXJyZW50bHkgaXQgaXMgbm90IGNoZWNraW5nIHRoZSBiYWNrZW5kIHJvdXRlIHJvdXRlci5nZXQoJy90b2tlbicpXG4gICAgJHJvb3RTY29wZS4kb24oJyRzdGF0ZUNoYW5nZVN0YXJ0JywgZnVuY3Rpb24gKGV2ZW50LHRvU3RhdGUsIHRvUGFyYW1zKSB7XG5cbiAgICAgICAgLy9jb25zb2xlLmxvZygndXNlciBBdXRoZW50aWNhdGVkJywgQXV0aFNlcnZpY2UuaXNBdXRoZW50aWNhdGVkKCkpO1xuXG4gICAgICAgIGlmICghZGVzdGluYXRpb25TdGF0ZVJlcXVpcmVzQXV0aCh0b1N0YXRlKSkge1xuICAgICAgICAgICAgLy8gVGhlIGRlc3RpbmF0aW9uIHN0YXRlIGRvZXMgbm90IHJlcXVpcmUgYXV0aGVudGljYXRpb25cbiAgICAgICAgICAgIC8vIFNob3J0IGNpcmN1aXQgd2l0aCByZXR1cm4uXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoQXV0aFNlcnZpY2UuaXNBdXRoZW50aWNhdGVkKCkpIHtcbiAgICAgICAgICAgIC8vIFRoZSB1c2VyIGlzIGF1dGhlbnRpY2F0ZWQuXG4gICAgICAgICAgICAvLyBTaG9ydCBjaXJjdWl0IHdpdGggcmV0dXJuLlxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy9UT0RPOiBOb3Qgc3VyZSBob3cgdG8gcHJvY2VlZCBoZXJlXG4gICAgICAgICRzdGF0ZS5nbygnbG9naW4nKTsgLy9pZiBhYm92ZSBmYWlscywgZ290byBsb2dpblxuICAgIH0pO1xuICAvLyAkdXJsUm91dGVyUHJvdmlkZXIub3RoZXJ3aXNlKCcvc2lnbnVwJyk7IC8vIFRPRE86IFJpY2hhcmQgdGVzdGluZyB0aGlzIHJvdXRlXG4gIC8vJHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZSgnL2NoYWxsZW5nZS92aWV3Jyk7IC8vVE9ETzogVG9ueSB0ZXN0aW5nIHRoaXMgcm91dGVcblxufSk7XG5cbmFwcC5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIpe1xuICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ21haW4nLCB7XG4gICAgICAgdGVtcGxhdGVVcmw6ICdmZWF0dXJlcy9jb21tb24vbWFpbi9tYWluLmh0bWwnLFxuICAgICAgIGNvbnRyb2xsZXI6ICdNZW51Q3RybCdcbiAgIH0pO1xufSk7XG5cbmFwcC5jb250cm9sbGVyKCdNYWluQ3RybCcsIGZ1bmN0aW9uKCRyb290U2NvcGUsJHNjb3BlLCAkaW9uaWNTaWRlTWVudURlbGVnYXRlLCAkaW9uaWNQb3B1cCwgJHN0YXRlLCBBdXRoU2VydmljZSxBVVRIX0VWRU5UUyl7XG4gICAgJHNjb3BlLnVzZXJuYW1lID0gQXV0aFNlcnZpY2UudXNlcm5hbWUoKTtcbiAgICAvL2NvbnNvbGUubG9nKEF1dGhTZXJ2aWNlLmlzQXV0aGVudGljYXRlZCgpKTtcblxuICAgICRzY29wZS4kb24oQVVUSF9FVkVOVFMubm90QXV0aG9yaXplZCwgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgdmFyIGFsZXJ0UG9wdXAgPSAkaW9uaWNQb3B1cC5hbGVydCh7XG4gICAgICAgICAgICB0aXRsZTogJ1VuYXV0aG9yaXplZCEnLFxuICAgICAgICAgICAgdGVtcGxhdGU6ICdZb3UgYXJlIG5vdCBhbGxvd2VkIHRvIGFjY2VzcyB0aGlzIHJlc291cmNlLidcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICAkc2NvcGUuJG9uKEFVVEhfRVZFTlRTLm5vdEF1dGhlbnRpY2F0ZWQsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgIEF1dGhTZXJ2aWNlLmxvZ291dCgpO1xuICAgICAgICAvLyRzdGF0ZS5nbygnbG9naW4nKTtcbiAgICAgICAgdmFyIGFsZXJ0UG9wdXAgPSAkaW9uaWNQb3B1cC5hbGVydCh7XG4gICAgICAgICAgICB0aXRsZTogJ1BsZWFzZSBSZXZpZXcnLFxuICAgICAgICAgICAgdGVtcGxhdGU6ICcnXG4gICAgICAgIH0pO1xuICAgIH0pO1xufSk7XG5cbmFwcC5jb250cm9sbGVyKCdNZW51Q3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgJGlvbmljU2lkZU1lbnVEZWxlZ2F0ZSwgJHN0YXRlLCBBdXRoU2VydmljZSwgJHJvb3RTY29wZSl7XG5cbiAgICAkc2NvcGUuc3RhdGVzID0gW1xuICAgICAgICB7XG4gICAgICAgICAgbmFtZSA6ICdBY2NvdW50JyxcbiAgICAgICAgICByZWYgOiBmdW5jdGlvbigpe3JldHVybiAnYWNjb3VudCc7fVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgbmFtZSA6ICdDaGFsbGVuZ2UnLFxuICAgICAgICAgIHJlZiA6IGZ1bmN0aW9uKCl7cmV0dXJuICdjaGFsbGVuZ2Uudmlldyc7fVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgbmFtZSA6ICdDaGF0cycsXG4gICAgICAgICAgcmVmOiBmdW5jdGlvbigpe3JldHVybiAnY2hhdHMnO31cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIG5hbWUgOiAnRXhlcmNpc20nLFxuICAgICAgICAgIHJlZjogZnVuY3Rpb24oKXtyZXR1cm4gJ2V4ZXJjaXNtLnZpZXcnO31cbiAgICAgICAgfVxuICAgIF07XG5cbiAgICAkc2NvcGUudG9nZ2xlTWVudVNob3cgPSBmdW5jdGlvbigpe1xuICAgICAgICByZXR1cm4gQXV0aFNlcnZpY2UuaXNBdXRoZW50aWNhdGVkKCk7XG4gICAgfTtcblxuICAgICRyb290U2NvcGUuJG9uKCdBdXRoJyxmdW5jdGlvbigpe1xuICAgICAgICRzY29wZS50b2dnbGVNZW51U2hvdygpO1xuICAgIH0pO1xuXG4gICAgLy9jb25zb2xlLmxvZyhBdXRoU2VydmljZS5pc0F1dGhlbnRpY2F0ZWQoKSk7XG4gICAgLy9pZihBdXRoU2VydmljZS5pc0F1dGhlbnRpY2F0ZWQoKSl7XG4gICAgJHNjb3BlLmNsaWNrSXRlbSA9IGZ1bmN0aW9uKHN0YXRlUmVmKXtcbiAgICAgICAgJGlvbmljU2lkZU1lbnVEZWxlZ2F0ZS50b2dnbGVMZWZ0KCk7XG4gICAgICAgICRzdGF0ZS5nbyhzdGF0ZVJlZigpKTsgLy9SQjogVXBkYXRlZCB0byBoYXZlIHN0YXRlUmVmIGFzIGEgZnVuY3Rpb24gaW5zdGVhZC5cbiAgICB9O1xuXG4gICAgJHNjb3BlLnRvZ2dsZU1lbnUgPSBmdW5jdGlvbigpe1xuICAgICAgICAkaW9uaWNTaWRlTWVudURlbGVnYXRlLnRvZ2dsZUxlZnQoKTtcbiAgICB9O1xuICAgIC8vfVxufSk7IiwiYXBwLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlciwgVVNFUl9ST0xFUyl7XG5cdC8vIEVhY2ggdGFiIGhhcyBpdHMgb3duIG5hdiBoaXN0b3J5IHN0YWNrOlxuXHQkc3RhdGVQcm92aWRlci5zdGF0ZSgnYWNjb3VudCcsIHtcblx0XHR1cmw6ICcvYWNjb3VudCcsXG5cdCAgICB0ZW1wbGF0ZVVybDogJ2ZlYXR1cmVzL2FjY291bnQvYWNjb3VudC5odG1sJyxcblx0XHRjb250cm9sbGVyOiAnQWNjb3VudEN0cmwnXG5cdFx0Ly8gLFxuXHRcdC8vIGRhdGE6IHtcblx0XHQvLyBcdGF1dGhlbnRpY2F0ZTogW1VTRVJfUk9MRVMucHVibGljXVxuXHRcdC8vIH1cblx0fSk7XG59KTtcblxuYXBwLmNvbnRyb2xsZXIoJ0FjY291bnRDdHJsJywgZnVuY3Rpb24oJHNjb3BlKSB7XG5cdCRzY29wZS5zZXR0aW5ncyA9IHtcblx0XHRlbmFibGVGcmllbmRzOiB0cnVlXG5cdH07XG59KTsiLCJhcHAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKXtcblx0JHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2NoYWxsZW5nZScsIHtcblx0XHR0ZW1wbGF0ZVVybCA6ICdmZWF0dXJlcy9jaGFsbGVuZ2UvY2hhbGxlbmdlLmh0bWwnLFxuXHRcdGFic3RyYWN0IDogdHJ1ZVxuXHR9KTtcbn0pO1xuXG5hcHAuZmFjdG9yeSgnQ2hhbGxlbmdlRmFjdG9yeScsIGZ1bmN0aW9uKCRodHRwLCBBcGlFbmRwb2ludCwgJHJvb3RTY29wZSwgJHN0YXRlKXtcblxuXHR2YXIgcHJvYmxlbSA9ICcnO1xuXHR2YXIgc3VibWlzc2lvbiA9ICcnO1xuXG5cdHZhciBydW5IaWRkZW4gPSBmdW5jdGlvbihjb2RlKSB7XG5cdCAgICB2YXIgaW5kZXhlZERCID0gbnVsbDtcblx0ICAgIHZhciBsb2NhdGlvbiA9IG51bGw7XG5cdCAgICB2YXIgbmF2aWdhdG9yID0gbnVsbDtcblx0ICAgIHZhciBvbmVycm9yID0gbnVsbDtcblx0ICAgIHZhciBvbm1lc3NhZ2UgPSBudWxsO1xuXHQgICAgdmFyIHBlcmZvcm1hbmNlID0gbnVsbDtcblx0ICAgIHZhciBzZWxmID0gbnVsbDtcblx0ICAgIHZhciB3ZWJraXRJbmRleGVkREIgPSBudWxsO1xuXHQgICAgdmFyIHBvc3RNZXNzYWdlID0gbnVsbDtcblx0ICAgIHZhciBjbG9zZSA9IG51bGw7XG5cdCAgICB2YXIgb3BlbkRhdGFiYXNlID0gbnVsbDtcblx0ICAgIHZhciBvcGVuRGF0YWJhc2VTeW5jID0gbnVsbDtcblx0ICAgIHZhciB3ZWJraXRSZXF1ZXN0RmlsZVN5c3RlbSA9IG51bGw7XG5cdCAgICB2YXIgd2Via2l0UmVxdWVzdEZpbGVTeXN0ZW1TeW5jID0gbnVsbDtcblx0ICAgIHZhciB3ZWJraXRSZXNvbHZlTG9jYWxGaWxlU3lzdGVtU3luY1VSTCA9IG51bGw7XG5cdCAgICB2YXIgd2Via2l0UmVzb2x2ZUxvY2FsRmlsZVN5c3RlbVVSTCA9IG51bGw7XG5cdCAgICB2YXIgYWRkRXZlbnRMaXN0ZW5lciA9IG51bGw7XG5cdCAgICB2YXIgZGlzcGF0Y2hFdmVudCA9IG51bGw7XG5cdCAgICB2YXIgcmVtb3ZlRXZlbnRMaXN0ZW5lciA9IG51bGw7XG5cdCAgICB2YXIgZHVtcCA9IG51bGw7XG5cdCAgICB2YXIgb25vZmZsaW5lID0gbnVsbDtcblx0ICAgIHZhciBvbm9ubGluZSA9IG51bGw7XG5cdCAgICB2YXIgaW1wb3J0U2NyaXB0cyA9IG51bGw7XG5cdCAgICB2YXIgY29uc29sZSA9IG51bGw7XG5cdCAgICB2YXIgYXBwbGljYXRpb24gPSBudWxsO1xuXG5cdCAgICByZXR1cm4gZXZhbChjb2RlKTtcblx0fTtcblxuXHQvLyBjb252ZXJ0cyB0aGUgb3V0cHV0IGludG8gYSBzdHJpbmdcblx0dmFyIHN0cmluZ2lmeSA9IGZ1bmN0aW9uKG91dHB1dCkge1xuXHQgICAgdmFyIHJlc3VsdDtcblxuXHQgICAgaWYgKHR5cGVvZiBvdXRwdXQgPT0gJ3VuZGVmaW5lZCcpIHtcblx0ICAgICAgICByZXN1bHQgPSAndW5kZWZpbmVkJztcblx0ICAgIH0gZWxzZSBpZiAob3V0cHV0ID09PSBudWxsKSB7XG5cdCAgICAgICAgcmVzdWx0ID0gJ251bGwnO1xuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgICByZXN1bHQgPSBKU09OLnN0cmluZ2lmeShvdXRwdXQpIHx8IG91dHB1dC50b1N0cmluZygpO1xuXHQgICAgfVxuXG5cdCAgICByZXR1cm4gcmVzdWx0O1xuXHR9O1xuXG5cdHZhciBydW4gPSBmdW5jdGlvbihjb2RlKSB7XG5cdCAgICB2YXIgcmVzdWx0ID0ge1xuXHQgICAgICAgIGlucHV0OiBjb2RlLFxuXHQgICAgICAgIG91dHB1dDogbnVsbCxcblx0ICAgICAgICBlcnJvcjogbnVsbFxuXHQgICAgfTtcblxuXHQgICAgdHJ5IHtcblx0ICAgICAgICByZXN1bHQub3V0cHV0ID0gc3RyaW5naWZ5KHJ1bkhpZGRlbihjb2RlKSk7XG5cdCAgICB9IGNhdGNoKGUpIHtcblx0ICAgICAgICByZXN1bHQuZXJyb3IgPSBlLm1lc3NhZ2U7XG5cdCAgICB9XG5cdCAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG5cblxuXHRyZXR1cm4ge1xuXHRcdGdldENoYWxsZW5nZSA6IGZ1bmN0aW9uKGlkKXtcblx0XHRcdHJldHVybiAkaHR0cC5nZXQoQXBpRW5kcG9pbnQudXJsICsgJy9jaGFsbGVuZ2UvJyArIGlkKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcblx0XHRcdFx0cHJvYmxlbSA9IHJlc3BvbnNlLmRhdGE7XG5cdFx0XHRcdHN1Ym1pc3Npb24gPSBwcm9ibGVtLnNlc3Npb24uc2V0dXAgfHwgJyc7XG5cdFx0XHRcdCRyb290U2NvcGUuJGJyb2FkY2FzdCgncHJvYmxlbVVwZGF0ZWQnKTtcblx0XHRcdFx0cmV0dXJuIHJlc3BvbnNlLmRhdGE7XG5cdFx0XHR9KTtcblx0XHR9LFxuXHRcdHNldFN1Ym1pc3Npb24gOiBmdW5jdGlvbihjb2RlKXtcblx0XHRcdHN1Ym1pc3Npb24gPSBjb2RlO1xuXHRcdFx0JHJvb3RTY29wZS4kYnJvYWRjYXN0KCdzdWJtaXNzaW9uVXBkYXRlZCcpO1xuXHRcdH0sXG5cdFx0Y29tcGlsZVN1Ym1pc3Npb246IGZ1bmN0aW9uKGNvZGUpe1xuXHRcdFx0cmV0dXJuIHJ1bihjb2RlKTtcblx0XHR9LFxuXHRcdGdldFN1Ym1pc3Npb24gOiBmdW5jdGlvbigpe1xuXHRcdFx0cmV0dXJuIHN1Ym1pc3Npb247XG5cdFx0fSxcblx0XHRnZXRQcm9ibGVtIDogZnVuY3Rpb24oKXtcblx0XHRcdHJldHVybiBwcm9ibGVtO1xuXHRcdH1cblx0fTtcbn0pOyIsImFwcC5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIpe1xuXHQkc3RhdGVQcm92aWRlci5zdGF0ZSgnY2hhbGxlbmdlLmNvZGUnLCB7XG5cdFx0dXJsIDogJy9jaGFsbGVuZ2UvY29kZScsXG5cdFx0dmlld3M6IHtcblx0XHRcdCd0YWItY29kZScgOiB7XG5cdFx0XHRcdHRlbXBsYXRlVXJsIDogJ2ZlYXR1cmVzL2NoYWxsZW5nZS1jb2RlL2NoYWxsZW5nZS1jb2RlLmh0bWwnLFxuXHRcdFx0XHRjb250cm9sbGVyIDogJ0NoYWxsZW5nZUNvZGVDdHJsJ1xuXHRcdFx0fVxuXHRcdH1cblx0XHQvLyAsXG5cdFx0Ly8gb25FbnRlciA6IGZ1bmN0aW9uKENoYWxsZW5nZUZhY3RvcnksICRzdGF0ZSl7XG5cdFx0Ly8gXHRpZihDaGFsbGVuZ2VGYWN0b3J5LmdldFByb2JsZW0oKS5sZW5ndGggPT09IDApe1xuXHRcdC8vIFx0XHQkc3RhdGUuZ28oJ2NoYWxsZW5nZS52aWV3Jyk7XG5cdFx0Ly8gXHR9XG5cdFx0Ly8gfVxuXHR9KTtcbn0pO1xuXG5hcHAuY29udHJvbGxlcignQ2hhbGxlbmdlQ29kZUN0cmwnLCBmdW5jdGlvbigkc2NvcGUsICRzdGF0ZSwgJHJvb3RTY29wZSwgQ2hhbGxlbmdlRmFjdG9yeSwgQ2hhbGxlbmdlRm9vdGVyRmFjdG9yeSl7XG5cblx0c2V0VGltZW91dChmdW5jdGlvbiAoKXtcblx0XHQkc2NvcGUua2V5Ym9hcmRWaXMgPSB3aW5kb3cuY29yZG92YS5wbHVnaW5zLktleWJvYXJkLmlzVmlzaWJsZTtcblx0XHRcdGNvbnNvbGUubG9nKFwiY29yZG92YSBpc3Zpc1wiLCB3aW5kb3cuY29yZG92YS5wbHVnaW5zLktleWJvYXJkLmlzVmlzaWJsZSk7XG5cdFx0XHRjb25zb2xlLmxvZyhcIiRzY29wZSBrZXlib2FyZFZpc1wiLCAkc2NvcGUua2V5Ym9hcmRWaXMpO1xuXG5cblx0XHRpZiAod2luZG93LmNvcmRvdmEgJiYgd2luZG93LmNvcmRvdmEucGx1Z2lucyAmJiB3aW5kb3cuY29yZG92YS5wbHVnaW5zLktleWJvYXJkKSB7XG5cdFx0XHRjb25zb2xlLmxvZyhcImdvdCBpbiBoZXJlXCIpO1xuXHRcdCAgd2luZG93LmNvcmRvdmEucGx1Z2lucy5LZXlib2FyZC5oaWRlS2V5Ym9hcmRBY2Nlc3NvcnlCYXIodHJ1ZSk7XG5cdFx0ICB3aW5kb3cuY29yZG92YS5wbHVnaW5zLktleWJvYXJkLmRpc2FibGVTY3JvbGwodHJ1ZSk7XG5cdFx0fVxuXHR9LCA1MDApO1xuXG5cdCRzY29wZS5mb290ZXJIb3RrZXlzID0gQ2hhbGxlbmdlRm9vdGVyRmFjdG9yeS5nZXRIb3RrZXlzKCk7XG5cblx0Ly9DaGFsbGVuZ2UgU3VibWl0XG5cdCRzY29wZS50ZXh0ID0gQ2hhbGxlbmdlRmFjdG9yeS5nZXRTdWJtaXNzaW9uKCkgfHwgJ3RleHQnO1xuXG5cdC8vaW5pdGlhbGl6ZSBDb2RlTWlycm9yXG5cdHZhciBteUNvZGVNaXJyb3IgPSBDb2RlTWlycm9yLmZyb21UZXh0QXJlYShkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29kZScpLCB7XG5cdFx0bGluZU51bWJlcnMgOiB0cnVlLFxuXHRcdG1vZGU6ICdqYXZhc2NyaXB0Jyxcblx0XHRhdXRvZm9jdXMgOiB0cnVlLFxuXHRcdHRoZW1lIDogJ3R3aWxpZ2h0Jyxcblx0XHRsaW5lV3JhcHBpbmc6IHRydWVcblx0fSk7XG5cblx0bXlDb2RlTWlycm9yLnJlcGxhY2VTZWxlY3Rpb24oJHNjb3BlLnRleHQpO1xuXG5cdCRzY29wZS51cGRhdGVUZXh0ID0gZnVuY3Rpb24oKXtcblx0XHQkc2NvcGUudGV4dCA9IG15Q29kZU1pcnJvci5nZXRWYWx1ZSgpO1xuXHRcdC8vY2hlY2sgaWYgZGlnZXN0IGlzIGluIHByb2dyZXNzXG5cdFx0aWYoISRzY29wZS4kJHBoYXNlKSB7XG5cdFx0ICAkc2NvcGUuJGFwcGx5KCk7XG5cdFx0fVxuXHR9O1xuXG5cdCRzY29wZS5pbnNlcnRGdW5jID0gZnVuY3Rpb24ocGFyYW0pe1xuXHRcdC8vZ2l2ZW4gYSBwYXJhbSwgd2lsbCBpbnNlcnQgY2hhcmFjdGVycyB3aGVyZSBjdXJzb3IgaXNcblx0XHRjb25zb2xlLmxvZyhcImluc2VydGluZzogXCIsIHBhcmFtKTtcblx0XHRteUNvZGVNaXJyb3IucmVwbGFjZVNlbGVjdGlvbihwYXJhbSk7XG5cdFx0Ly8gd2luZG93LmNvcmRvdmEucGx1Z2lucy5LZXlib2FyZC5zaG93KCk7XG5cdFx0bXlDb2RlTWlycm9yLmZvY3VzKCk7XG5cdH07XG5cbiAgICBteUNvZGVNaXJyb3Iub24oXCJjaGFuZ2VcIiwgZnVuY3Rpb24gKG15Q29kZU1pcnJvciwgY2hhbmdlT2JqKXtcbiAgICBcdCRzY29wZS51cGRhdGVUZXh0KCk7XG4gICAgfSk7XG4gICAgLy8gbXlDb2RlTWlycm9yLm9uKFwiY3Vyc29yQWN0aXZpdHlcIiwgZnVuY3Rpb24gKG15Q29kZU1pcnJvciwgY2hhbmdlT2JqKXtcbiAgICAvLyBcdHdpbmRvdy5jb3Jkb3ZhLnBsdWdpbnMuS2V5Ym9hcmQuc2hvdygpO1xuICAgIC8vIFx0JHNjb3BlLmtleWJvYXJkVmlzID0gdHJ1ZTtcbiAgICAvLyBcdCRzY29wZS4kYXBwbHkoKTtcbiAgICAvLyB9KTtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIm5hdGl2ZS5rZXlib2FyZHNob3dcIiwgZnVuY3Rpb24gKCl7XG4gICAgXHQkc2NvcGUua2V5Ym9hcmRWaXMgPSB0cnVlO1xuICAgIFx0JHNjb3BlLiRhcHBseSgpO1xuICAgIH0pO1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibmF0aXZlLmtleWJvYXJkaGlkZVwiLCBmdW5jdGlvbiAoKXtcbiAgICBcdCRzY29wZS5rZXlib2FyZFZpcyA9IGZhbHNlO1xuICAgIFx0JHNjb3BlLiRhcHBseSgpO1xuICAgIH0pO1xuXG4gICAgLy8gbXlDb2RlTWlycm9yLm9mZihcImZvY3VzXCIsIGZ1bmN0aW9uIChteUNvZGVNaXJyb3IsIGNoYW5nZU9iail7XG4gICAgLy8gXHQkc2NvcGUua2V5Ym9hcmRWaXMgPSAkd2luZG93LmNvcmRvdmEucGx1Z2lucy5LZXlib2FyZC5pc1Zpc2libGU7XG4gICAgLy8gfSk7XG5cdFxuXG5cdCRzY29wZS5idXR0b25zID0ge1xuXHRcdGNvbXBpbGUgOiAnQ29tcGlsZScsXG5cdFx0ZGlzbWlzcyA6ICdEaXNtaXNzJ1xuXHR9O1xuXG5cdC8vICRyb290U2NvcGUuJG9uKCdwcm9ibGVtVXBkYXRlZCcsIGZ1bmN0aW9uKGUpe1xuXHQvLyBcdCRzY29wZS5wcm9qZWN0SWQgPSBDaGFsbGVuZ2VGYWN0b3J5LmdldFByb2JsZW0oKS5zZXNzaW9uLnByb2plY3RJZDtcblx0Ly8gXHQkc2NvcGUuc29sdXRpb25JZCA9IENoYWxsZW5nZUZhY3RvcnkuZ2V0UHJvYmxlbSgpLnNlc3Npb24uc29sdXRpb25JZDtcblx0Ly8gXHQkc2NvcGUudGV4dCA9IENoYWxsZW5nZUZhY3RvcnkuZ2V0UHJvYmxlbSgpLnNlc3Npb24uc2V0dXA7XG5cdC8vIH0pO1xuXG5cdCRzY29wZS5jb21waWxlQ2hhbGxlbmdlID0gZnVuY3Rpb24odGV4dCl7XG5cdFx0Q2hhbGxlbmdlRmFjdG9yeS5zZXRTdWJtaXNzaW9uKHRleHQpO1xuXHRcdCRzdGF0ZS5nbygnY2hhbGxlbmdlLmNvbXBpbGUnKTtcblx0fTtcblxuXHQvLyAkc2NvcGUuZGlzbWlzc0NoYWxsZW5nZSA9IGZ1bmN0aW9uKCl7XG5cdC8vIFx0dmFyIGlkID0gJ0E5UUtrNlNtUnBEY3JpVS1ITVFyJztcblx0Ly8gXHRDaGFsbGVuZ2VGYWN0b3J5LmdldENoYWxsZW5nZShpZCkudGhlbihmdW5jdGlvbihkYXRhKXtcblx0Ly8gXHRcdCRzdGF0ZS5nbygnY2hhbGxlbmdlLnZpZXcnKTtcblx0Ly8gXHR9KTtcblx0Ly8gfTtcblxufSk7IiwiYXBwLmZhY3RvcnkoJ0NoYWxsZW5nZUZvb3RlckZhY3RvcnknLCBmdW5jdGlvbigpe1xuXG5cdHZhciBmb290ZXJIb3RrZXlzID0gW1xuXHRcdHtcblx0XHRcdGRpc3BsYXk6IFwiWyBdXCIsXG5cdFx0XHRpbnNlcnRQYXJhbTogXCJbXVwiXG5cdFx0fSxcblx0XHR7XG5cdFx0XHRkaXNwbGF5OiBcInsgfVwiLFxuXHRcdFx0aW5zZXJ0UGFyYW06IFwie31cIlxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0ZGlzcGxheTogXCIoIClcIixcblx0XHRcdGluc2VydFBhcmFtOiBcIigpXCJcblx0XHR9LFxuXHRcdHtcblx0XHRcdGRpc3BsYXk6IFwiLy9cIixcblx0XHRcdGluc2VydFBhcmFtOiBcIi8vXCJcblx0XHR9LFxuXHRcdHtcblx0XHRcdGRpc3BsYXk6IFwiPVwiLFxuXHRcdFx0aW5zZXJ0UGFyYW06IFwiPVwiXG5cdFx0fSxcblx0XHR7XG5cdFx0XHRkaXNwbGF5OiBcIjxcIixcblx0XHRcdGluc2VydFBhcmFtOiBcIjxcIlxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0ZGlzcGxheTogXCI+XCIsXG5cdFx0XHRpbnNlcnRQYXJhbTogXCI+XCJcblx0XHR9LFxuXHRcdHtcblx0XHRcdGRpc3BsYXk6IFwiLyogICovXCIsXG5cdFx0XHRpbnNlcnRQYXJhbTogXCIvKiAqL1wiXG5cdFx0fSxcblxuXHRdO1xuXG5cdHJldHVybiB7XG5cdFx0Z2V0SG90a2V5cyA6IGZ1bmN0aW9uKCl7XG5cdFx0XHRyZXR1cm4gZm9vdGVySG90a2V5cztcblx0XHR9XG5cdH07XG59KTsiLCJhcHAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKXtcblx0JHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2NoYWxsZW5nZS5jb21waWxlJywge1xuXHRcdHVybCA6ICcvY2hhbGxlbmdlL2NvbXBpbGUnLFxuXHRcdHZpZXdzIDoge1xuXHRcdFx0J3RhYi1jb21waWxlJyA6IHtcblx0XHRcdFx0dGVtcGxhdGVVcmwgOiAnZmVhdHVyZXMvY2hhbGxlbmdlLWNvbXBpbGUvY2hhbGxlbmdlLWNvbXBpbGUuaHRtbCcsXG5cdFx0XHRcdGNvbnRyb2xsZXI6ICdDaGFsbGVuZ2VDb21waWxlQ3RybCdcblx0XHRcdH1cblx0XHR9XG5cdFx0Ly8gLFxuXHRcdC8vIG9uRW50ZXIgOiBmdW5jdGlvbihDaGFsbGVuZ2VGYWN0b3J5LCAkc3RhdGUpe1xuXHRcdC8vIFx0aWYoQ2hhbGxlbmdlRmFjdG9yeS5nZXRTdWJtaXNzaW9uKCkubGVuZ3RoID09PSAwKXtcblx0XHQvLyBcdFx0JHN0YXRlLmdvKCdjaGFsbGVuZ2UudmlldycpO1xuXHRcdC8vIFx0fVxuXHRcdC8vIH1cblx0fSk7XG59KTtcblxuYXBwLmNvbnRyb2xsZXIoJ0NoYWxsZW5nZUNvbXBpbGVDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBDaGFsbGVuZ2VGYWN0b3J5KXtcblx0JHNjb3BlLnF1ZXN0aW9uID0gQ2hhbGxlbmdlRmFjdG9yeS5nZXRTdWJtaXNzaW9uKCk7XG5cdGNvbnNvbGUubG9nKCRzY29wZS5xdWVzdGlvbik7XG5cdHZhciByZXN1bHRzID0gQ2hhbGxlbmdlRmFjdG9yeS5jb21waWxlU3VibWlzc2lvbigkc2NvcGUucXVlc3Rpb24pO1xuXHQkc2NvcGUucmVzdWx0cyA9IHJlc3VsdHM7XG5cdCRzY29wZS5vdXRwdXQgPSBDaGFsbGVuZ2VGYWN0b3J5LmNvbXBpbGVTdWJtaXNzaW9uKCRzY29wZS5xdWVzdGlvbikub3V0cHV0O1xuXHQkc2NvcGUuZXJyb3IgPSBDaGFsbGVuZ2VGYWN0b3J5LmNvbXBpbGVTdWJtaXNzaW9uKCRzY29wZS5xdWVzdGlvbikuZXJyb3I7XG5cblx0Ly9pbml0aWFsaXplIENvZGVNaXJyb3Jcblx0dmFyIGNtQ29tcGlsZSA9IENvZGVNaXJyb3IuZnJvbVRleHRBcmVhKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb21waWxlJyksIHtcblx0XHRyZWFkT25seSA6ICdub2N1cnNvcicsXG5cdFx0bW9kZTogJ2phdmFzY3JpcHQnLFxuXHRcdGF1dG9mb2N1cyA6IHRydWUsXG5cdFx0dGhlbWUgOiAndHdpbGlnaHQnLFxuXHRcdGxpbmVXcmFwcGluZzogdHJ1ZVxuXHR9KTtcblxuXHRjbUNvbXBpbGUucmVwbGFjZVNlbGVjdGlvbigkc2NvcGUucXVlc3Rpb24pO1xuXG5cblx0dmFyIGNtUmVzdWx0cyA9IENvZGVNaXJyb3IuZnJvbVRleHRBcmVhKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZXN1bHRzJyksIHtcblx0XHRyZWFkT25seSA6ICdub2N1cnNvcicsXG5cdFx0bW9kZTogJ2phdmFzY3JpcHQnLFxuXHRcdGF1dG9mb2N1cyA6IHRydWUsXG5cdFx0dGhlbWUgOiAndHdpbGlnaHQnLFxuXHRcdGxpbmVXcmFwcGluZzogdHJ1ZVxuXHR9KTtcblxuXHRjbVJlc3VsdHMucmVwbGFjZVNlbGVjdGlvbigkc2NvcGUub3V0cHV0KTtcblxuXHQkc2NvcGUuJG9uKCdzdWJtaXNzaW9uVXBkYXRlZCcsIGZ1bmN0aW9uKGUpe1xuXHRcdCRzY29wZS5xdWVzdGlvbiA9IENoYWxsZW5nZUZhY3RvcnkuZ2V0U3VibWlzc2lvbigpO1xuXHRcdHJlc3VsdHMgPSBDaGFsbGVuZ2VGYWN0b3J5LmNvbXBpbGVTdWJtaXNzaW9uKCRzY29wZS5xdWVzdGlvbik7XG5cdFx0JHNjb3BlLnJlc3VsdHMgPSByZXN1bHRzO1xuXHRcdCRzY29wZS5vdXRwdXQgPSBDaGFsbGVuZ2VGYWN0b3J5LmNvbXBpbGVTdWJtaXNzaW9uKCRzY29wZS5xdWVzdGlvbikub3V0cHV0O1xuXHRcdCRzY29wZS5lcnJvciA9IENoYWxsZW5nZUZhY3RvcnkuY29tcGlsZVN1Ym1pc3Npb24oJHNjb3BlLnF1ZXN0aW9uKS5lcnJvcjtcblx0XHRjbVJlc3VsdHMuc2V0VmFsdWUoJHNjb3BlLm91dHB1dCk7XG5cblx0fSk7XG59KTsiLCJhcHAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKXtcblx0JHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2NoYWxsZW5nZS52aWV3Jywge1xuXHRcdHVybDogJy9jaGFsbGVuZ2UvdmlldycsXG5cdFx0dmlld3M6IHtcblx0XHRcdCd0YWItdmlldycgOiB7XG5cdFx0XHRcdHRlbXBsYXRlVXJsOiAnZmVhdHVyZXMvY2hhbGxlbmdlLXZpZXcvY2hhbGxlbmdlLXZpZXcuaHRtbCcsXG5cdFx0XHRcdGNvbnRyb2xsZXI6ICdDaGFsbGVuZ2VWaWV3Q3RybCdcblx0XHRcdH1cblx0XHR9XG5cdH0pO1xufSk7XG5cbmFwcC5jb250cm9sbGVyKCdDaGFsbGVuZ2VWaWV3Q3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgQ2hhbGxlbmdlRmFjdG9yeSwgJHN0YXRlLCAkaW9uaWNTbGlkZUJveERlbGVnYXRlKXtcblxuXHQvL0NvbnRyb2xzIFNsaWRlXG5cdCRzY29wZS5zbGlkZUhhc0NoYWxsZW5nZWQgPSBmdW5jdGlvbihpbmRleCl7XG5cdFx0JGlvbmljU2xpZGVCb3hEZWxlZ2F0ZS5zbGlkZShpbmRleCk7XG5cdH07XG5cblx0Ly9DaGFsbGVuZ2UgVmlld1xuXHQkc2NvcGUuY2hhbGxlbmdlID0gQ2hhbGxlbmdlRmFjdG9yeS5nZXRQcm9ibGVtKCkgfHwgXCJUZXN0XCI7XG5cblx0Ly8gJHNjb3BlLiRvbigncHJvYmxlbVVwZGF0ZWQnLCBmdW5jdGlvbihlKXtcblx0Ly8gXHQkc2NvcGUuY2hhbGxlbmdlID0gQ2hhbGxlbmdlRmFjdG9yeS5nZXRQcm9ibGVtKCk7XG5cdC8vIH0pO1xuXG5cbn0pOyIsImFwcC5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIsIFVTRVJfUk9MRVMpe1xuXG4gICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdjaGF0cycsIHtcbiAgICAgIHVybDogJy9jaGF0cycsXG4gICAgICB0ZW1wbGF0ZVVybDogJ2ZlYXR1cmVzL2NoYXRzL3RhYi1jaGF0cy5odG1sJyxcbiAgICAgIGNvbnRyb2xsZXI6ICdDaGF0c0N0cmwnLFxuICAgICAgZGF0YToge1xuICAgICAgICBhdXRoZW50aWNhdGU6IFtVU0VSX1JPTEVTLnB1YmxpY11cbiAgICAgIH1cbiAgICB9KVxuICAgIC5zdGF0ZSgnY2hhdC1kZXRhaWwnLCB7XG4gICAgICB1cmw6ICcvY2hhdHMvOmNoYXRJZCcsXG4gICAgICB0ZW1wbGF0ZVVybDogJ2ZlYXR1cmVzL2NoYXRzL2NoYXQtZGV0YWlsLmh0bWwnLFxuICAgICAgY29udHJvbGxlcjogJ0NoYXREZXRhaWxDdHJsJ1xuICAgIH0pO1xufSk7XG5cbmFwcC5jb250cm9sbGVyKCdDaGF0c0N0cmwnLCBmdW5jdGlvbigkc2NvcGUsIENoYXRzKSB7XG4gICRzY29wZS5jaGF0cyA9IENoYXRzLmFsbCgpO1xuICAkc2NvcGUucmVtb3ZlID0gZnVuY3Rpb24oY2hhdCkge1xuICAgIENoYXRzLnJlbW92ZShjaGF0KTtcbiAgfTtcbn0pO1xuXG5hcHAuY29udHJvbGxlcignQ2hhdERldGFpbEN0cmwnLCBmdW5jdGlvbigkc2NvcGUsICRzdGF0ZVBhcmFtcywgQ2hhdHMpIHtcbiAgJHNjb3BlLmNoYXQgPSBDaGF0cy5nZXQoJHN0YXRlUGFyYW1zLmNoYXRJZCk7XG59KTtcblxuYXBwLmZhY3RvcnkoJ0NoYXRzJywgZnVuY3Rpb24oKSB7XG4gIC8vIE1pZ2h0IHVzZSBhIHJlc291cmNlIGhlcmUgdGhhdCByZXR1cm5zIGEgSlNPTiBhcnJheVxuXG4gIC8vIFNvbWUgZmFrZSB0ZXN0aW5nIGRhdGFcbiAgdmFyIGNoYXRzID0gW3tcbiAgICBpZDogMCxcbiAgICBuYW1lOiAnQmVuIFNwYXJyb3cnLFxuICAgIGxhc3RUZXh0OiAnWW91IG9uIHlvdXIgd2F5PycsXG4gICAgZmFjZTogJ2h0dHBzOi8vcGJzLnR3aW1nLmNvbS9wcm9maWxlX2ltYWdlcy81MTQ1NDk4MTE3NjUyMTExMzYvOVNnQXVIZVkucG5nJ1xuICB9LCB7XG4gICAgaWQ6IDEsXG4gICAgbmFtZTogJ01heCBMeW54JyxcbiAgICBsYXN0VGV4dDogJ0hleSwgaXRcXCdzIG5vdCBtZScsXG4gICAgZmFjZTogJ2h0dHBzOi8vYXZhdGFyczMuZ2l0aHVidXNlcmNvbnRlbnQuY29tL3UvMTEyMTQ/dj0zJnM9NDYwJ1xuICB9LHtcbiAgICBpZDogMixcbiAgICBuYW1lOiAnQWRhbSBCcmFkbGV5c29uJyxcbiAgICBsYXN0VGV4dDogJ0kgc2hvdWxkIGJ1eSBhIGJvYXQnLFxuICAgIGZhY2U6ICdodHRwczovL3Bicy50d2ltZy5jb20vcHJvZmlsZV9pbWFnZXMvNDc5MDkwNzk0MDU4Mzc5MjY0Lzg0VEtqX3FhLmpwZWcnXG4gIH0sIHtcbiAgICBpZDogMyxcbiAgICBuYW1lOiAnUGVycnkgR292ZXJub3InLFxuICAgIGxhc3RUZXh0OiAnTG9vayBhdCBteSBtdWtsdWtzIScsXG4gICAgZmFjZTogJ2h0dHBzOi8vcGJzLnR3aW1nLmNvbS9wcm9maWxlX2ltYWdlcy80OTE5OTUzOTgxMzU3NjcwNDAvaWUyWl9WNmUuanBlZydcbiAgfSwge1xuICAgIGlkOiA0LFxuICAgIG5hbWU6ICdNaWtlIEhhcnJpbmd0b24nLFxuICAgIGxhc3RUZXh0OiAnVGhpcyBpcyB3aWNrZWQgZ29vZCBpY2UgY3JlYW0uJyxcbiAgICBmYWNlOiAnaHR0cHM6Ly9wYnMudHdpbWcuY29tL3Byb2ZpbGVfaW1hZ2VzLzU3ODIzNzI4MTM4NDg0MTIxNi9SM2FlMW42MS5wbmcnXG4gIH1dO1xuXG4gIHJldHVybiB7XG4gICAgYWxsOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBjaGF0cztcbiAgICB9LFxuICAgIHJlbW92ZTogZnVuY3Rpb24oY2hhdCkge1xuICAgICAgY2hhdHMuc3BsaWNlKGNoYXRzLmluZGV4T2YoY2hhdCksIDEpO1xuICAgIH0sXG4gICAgZ2V0OiBmdW5jdGlvbihjaGF0SWQpIHtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2hhdHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKGNoYXRzW2ldLmlkID09PSBwYXJzZUludChjaGF0SWQpKSB7XG4gICAgICAgICAgcmV0dXJuIGNoYXRzW2ldO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gIH07XG59KTtcbiIsImFwcC5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIpe1xuXHQvLyBFYWNoIHRhYiBoYXMgaXRzIG93biBuYXYgaGlzdG9yeSBzdGFjazpcblx0JHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2Vycm9yJywge1xuXHRcdHVybDogJy9lcnJvcicsXG5cdCAgICB0ZW1wbGF0ZVVybDogJ2ZlYXR1cmVzL2Vycm9yL2Vycm9yLmh0bWwnLFxuXHRcdGNvbnRyb2xsZXI6ICdFcnJvckN0cmwnXG5cdH0pO1xufSk7XG5cbmFwcC5jb250cm9sbGVyKCdFcnJvcicsIGZ1bmN0aW9uKCRzY29wZSkge1xuXHRcbn0pOyIsImFwcC5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIpe1xuXHQkc3RhdGVQcm92aWRlci5zdGF0ZSgnZXhlcmNpc20nLCB7XG5cdFx0dGVtcGxhdGVVcmwgOiAnZmVhdHVyZXMvZXhlcmNpc20vZXhlcmNpc20uaHRtbCcsXG5cdFx0YWJzdHJhY3QgOiB0cnVlLFxuXHRcdHJlc29sdmUgOiB7XG5cdFx0XHRtYXJrZG93biA6IGZ1bmN0aW9uKEF2YWlsYWJsZUV4ZXJjaXNlcywgRXhlcmNpc21GYWN0b3J5LCAkc3RhdGUpe1xuXG5cdFx0XHRcdGlmKEV4ZXJjaXNtRmFjdG9yeS5nZXRUZXN0U2NyaXB0KCkubGVuZ3RoID09PSAwKSB7XG5cdFx0XHRcdFx0dmFyIGV4ZXJjaXNlID0gQXZhaWxhYmxlRXhlcmNpc2VzLmdldFJhbmRvbUV4ZXJjaXNlKCk7XG5cdFx0XHRcdFx0RXhlcmNpc21GYWN0b3J5LnNldE5hbWUoZXhlcmNpc2UubmFtZSk7XG5cdFx0XHRcdFx0cmV0dXJuIEV4ZXJjaXNtRmFjdG9yeS5nZXRFeHRlcm5hbFNjcmlwdChleGVyY2lzZS5saW5rKS50aGVuKGZ1bmN0aW9uKGRhdGEpe1xuXHRcdFx0XHRcdFx0cmV0dXJuIEV4ZXJjaXNtRmFjdG9yeS5nZXRFeHRlcm5hbE1kKGV4ZXJjaXNlLm1kTGluayk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdH1cblx0fSk7XG59KTtcblxuYXBwLmZhY3RvcnkoJ0V4ZXJjaXNtRmFjdG9yeScsIGZ1bmN0aW9uKCRodHRwLCAkcm9vdFNjb3BlKXtcblx0dmFyIG5hbWUgPSAnJztcblx0dmFyIHRlc3QgPSAnJztcblx0dmFyIGNvZGUgPSAnJztcblx0dmFyIG1hcmtkb3duID0gJyc7XG5cblx0cmV0dXJuIHtcblx0XHRnZXRFeHRlcm5hbFNjcmlwdCA6IGZ1bmN0aW9uKGxpbmspe1xuXHRcdFx0cmV0dXJuICRodHRwLmdldChsaW5rKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcblx0XHRcdFx0dGVzdCA9IHJlc3BvbnNlLmRhdGE7XG5cdFx0XHRcdHJldHVybiByZXNwb25zZS5kYXRhO1xuXHRcdFx0fSk7XG5cdFx0fSxcblx0XHRnZXRFeHRlcm5hbE1kIDogZnVuY3Rpb24obGluayl7XG5cdFx0XHRyZXR1cm4gJGh0dHAuZ2V0KGxpbmspLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuXHRcdFx0XHRtYXJrZG93biA9IHJlc3BvbnNlLmRhdGE7XG5cdFx0XHRcdHJldHVybiByZXNwb25zZS5kYXRhO1xuXHRcdFx0fSk7XG5cdFx0fSxcblx0XHRzZXROYW1lIDogZnVuY3Rpb24oc2V0TmFtZSl7XG5cdFx0XHRuYW1lID0gc2V0TmFtZTtcblx0XHR9LFxuXHRcdHNldFRlc3RTY3JpcHQgOiBmdW5jdGlvbih0ZXN0KXtcblx0XHRcdHRlc3QgPSB0ZXN0O1xuXHRcdFx0JHJvb3RTY29wZS4kYnJvYWRjYXN0KCd0ZXN0Q2hhbmdlJywge3Rlc3QgOiB0ZXN0fSk7XG5cdFx0fSxcblx0XHRzZXRDb2RlU2NyaXB0IDogZnVuY3Rpb24gKGNvZGUpe1xuXHRcdFx0Y29kZSA9IGNvZGU7XG5cdFx0XHQkcm9vdFNjb3BlLiRicm9hZGNhc3QoJ2NvZGVDaGFuZ2UnLCB7Y29kZSA6IGNvZGV9KTtcblx0XHR9LFxuXHRcdGdldFRlc3RTY3JpcHQgOiBmdW5jdGlvbigpe1xuXHRcdFx0cmV0dXJuIHRlc3Q7XG5cdFx0fSxcblx0XHRnZXRDb2RlU2NyaXB0IDogZnVuY3Rpb24oKXtcblx0XHRcdHJldHVybiBjb2RlO1xuXHRcdH0sXG5cdFx0Z2V0TWFya2Rvd24gOiBmdW5jdGlvbigpe1xuXHRcdFx0cmV0dXJuIG1hcmtkb3duO1xuXHRcdH0sXG5cdFx0Z2V0TmFtZSA6IGZ1bmN0aW9uKCl7XG5cdFx0XHRyZXR1cm4gbmFtZTtcblx0XHR9XG5cdH07XG59KTtcblxuYXBwLmZhY3RvcnkoJ0F2YWlsYWJsZUV4ZXJjaXNlcycsIGZ1bmN0aW9uKCl7XG5cblx0dmFyIGxpYnJhcnkgPSBbXG5cdFx0J2FjY3VtdWxhdGUnLFxuXHRcdCdhbGxlcmdpZXMnLFxuXHRcdCdhbmFncmFtJyxcblx0XHQnYXRiYXNoLWNpcGhlcicsXG5cdFx0J2JlZXItc29uZycsXG5cdFx0J2JpbmFyeScsXG5cdFx0J2JpbmFyeS1zZWFyY2gtdHJlZScsXG5cdFx0J2JvYicsXG5cdFx0J2JyYWNrZXQtcHVzaCcsXG5cdFx0J2NpcmN1bGFyLWJ1ZmZlcicsXG5cdFx0J2Nsb2NrJyxcblx0XHQnY3J5cHRvLXNxdWFyZScsXG5cdFx0J2N1c3RvbS1zZXQnLFxuXHRcdCdkaWZmZXJlbmNlLW9mLXNxdWFyZXMnLFxuXHRcdCdldGwnLFxuXHRcdCdmb29kLWNoYWluJyxcblx0XHQnZ2lnYXNlY29uZCcsXG5cdFx0J2dyYWRlLXNjaG9vbCcsXG5cdFx0J2dyYWlucycsXG5cdFx0J2hhbW1pbmcnLFxuXHRcdCdoZWxsby13b3JsZCcsXG5cdFx0J2hleGFkZWNpbWFsJ1xuXHRdO1xuXG5cdHZhciBnZW5lcmF0ZUxpbmsgPSBmdW5jdGlvbihuYW1lKXtcblx0XHRyZXR1cm4gJ2V4ZXJjaXNtL2phdmFzY3JpcHQvJyArIG5hbWUgKyAnLycgKyBuYW1lICsgJ190ZXN0LnNwZWMuanMnO1xuXHR9O1xuXG5cdHZhciBnZW5lcmF0ZU1kTGluayA9IGZ1bmN0aW9uKG5hbWUpe1xuXHRcdHJldHVybiAnZXhlcmNpc20vamF2YXNjcmlwdC8nICsgbmFtZSArICcvJyArIG5hbWUgKyAnLm1kJztcblx0fTtcblxuXHR2YXIgZ2VuZXJhdGVSYW5kb20gPSBmdW5jdGlvbigpe1xuXHRcdHZhciByYW5kb20gPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBsaWJyYXJ5Lmxlbmd0aCk7XG5cdFx0cmV0dXJuIGxpYnJhcnlbcmFuZG9tXTtcblx0fTtcblxuXHRyZXR1cm4ge1xuXHRcdGdldFNwZWNpZmljRXhlcmNpc2UgOiBmdW5jdGlvbihuYW1lKXtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdGxpbmsgOiBnZW5lcmF0ZUxpbmsobmFtZSksXG5cdFx0XHRcdG1kTGluayA6IGdlbmVyYXRlTWRMaW5rKG5hbWUpXG5cdFx0XHR9O1xuXHRcdH0sXG5cdFx0Z2V0UmFuZG9tRXhlcmNpc2UgOiBmdW5jdGlvbigpe1xuXHRcdFx0dmFyIG5hbWUgPSBnZW5lcmF0ZVJhbmRvbSgpO1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0bmFtZSA6IG5hbWUsXG5cdFx0XHRcdGxpbmsgOiBnZW5lcmF0ZUxpbmsobmFtZSksXG5cdFx0XHRcdG1kTGluayA6IGdlbmVyYXRlTWRMaW5rKG5hbWUpXG5cdFx0XHR9O1xuXHRcdH1cblx0fTtcbn0pOyIsImFwcC5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIpe1xuXHQkc3RhdGVQcm92aWRlci5zdGF0ZSgnZXhlcmNpc20uY29kZScsIHtcblx0XHR1cmwgOiAnL2V4ZXJjaXNtL2NvZGUnLFxuXHRcdHZpZXdzIDoge1xuXHRcdFx0J3RhYi1jb2RlJyA6IHtcblx0XHRcdFx0dGVtcGxhdGVVcmwgOiAnZmVhdHVyZXMvZXhlcmNpc20tY29kZS9leGVyY2lzbS1jb2RlLmh0bWwnLFxuXHRcdFx0XHRjb250cm9sbGVyOiAnRXhlcmNpc21Db2RlQ3RybCdcblx0XHRcdH1cblx0XHR9XG5cdH0pO1xufSk7XG5cbmFwcC5jb250cm9sbGVyKCdFeGVyY2lzbUNvZGVDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBFeGVyY2lzbUZhY3RvcnksICRzdGF0ZSl7XG5cdCRzY29wZS5uYW1lID0gRXhlcmNpc21GYWN0b3J5LmdldE5hbWUoKTtcblx0JHNjb3BlLmNvZGUgPSBFeGVyY2lzbUZhY3RvcnkuZ2V0Q29kZVNjcmlwdCgpO1xuXG5cdC8vcGFzc2luZyB0aGlzIHVwZGF0ZSBmdW5jdGlvbiBzbyB0aGF0IG9uIHRleHQgY2hhbmdlIGluIHRoZSBkaXJlY3RpdmUgdGhlIGZhY3Rvcnkgd2lsbCBiZSBhbGVydGVkXG5cdCRzY29wZS5jb21waWxlID0gZnVuY3Rpb24oY29kZSl7XG5cdFx0RXhlcmNpc21GYWN0b3J5LnNldENvZGVTY3JpcHQoY29kZSk7XG5cdFx0JHN0YXRlLmdvKCdleGVyY2lzbS5jb21waWxlJyk7XG5cdH07XG59KTsiLCJhcHAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKXtcblx0JHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2V4ZXJjaXNtLmNvbXBpbGUnLCB7XG5cdFx0dXJsIDogJy9leGVyY2lzbS9jb21waWxlJyxcblx0XHR2aWV3cyA6IHtcblx0XHRcdCd0YWItY29tcGlsZScgOiB7XG5cdFx0XHRcdHRlbXBsYXRlVXJsIDogJ2ZlYXR1cmVzL2V4ZXJjaXNtLWNvbXBpbGUvZXhlcmNpc20tY29tcGlsZS5odG1sJyxcblx0XHRcdFx0Y29udHJvbGxlcjogJ0V4ZXJjaXNtQ29tcGlsZUN0cmwnXG5cdFx0XHR9XG5cdFx0fSxcblx0XHRvbkVudGVyIDogZnVuY3Rpb24oKXtcblx0XHRcdGlmKHdpbmRvdy5qYXNtaW5lKSB3aW5kb3cuamFzbWluZS5nZXRFbnYoKS5leGVjdXRlKCk7XG5cdFx0fVxuXHR9KTtcbn0pO1xuXG5hcHAuY29udHJvbGxlcignRXhlcmNpc21Db21waWxlQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgRXhlcmNpc21GYWN0b3J5KXtcblx0JHNjb3BlLm5hbWUgPSBFeGVyY2lzbUZhY3RvcnkuZ2V0TmFtZSgpO1xuXHQkc2NvcGUudGVzdCA9IEV4ZXJjaXNtRmFjdG9yeS5nZXRUZXN0U2NyaXB0KCk7XG5cdCRzY29wZS5jb2RlID0gRXhlcmNpc21GYWN0b3J5LmdldENvZGVTY3JpcHQoKTtcblxuXHQkc2NvcGUuJG9uKCd0ZXN0Q2hhbmdlJywgZnVuY3Rpb24oZXZlbnQsIGRhdGEpe1xuXHRcdCRzY29wZS50ZXN0ID0gZGF0YS50ZXN0O1xuXHR9KTtcblxuXHQkc2NvcGUuJG9uKCdjb2RlQ2hhbmdlJywgZnVuY3Rpb24oZXZlbnQsIGRhdGEpe1xuXHRcdCRzY29wZS5jb2RlID0gZGF0YS5jb2RlO1xuXHR9KTtcbn0pOyIsImFwcC5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIpe1xuXHQkc3RhdGVQcm92aWRlci5zdGF0ZSgnZXhlcmNpc20udGVzdCcsIHtcblx0XHR1cmwgOiAnL2V4ZXJjaXNtL3Rlc3QnLFxuXHRcdHZpZXdzIDoge1xuXHRcdFx0J3RhYi10ZXN0JyA6IHtcblx0XHRcdFx0dGVtcGxhdGVVcmwgOiAnZmVhdHVyZXMvZXhlcmNpc20tdGVzdC9leGVyY2lzbS10ZXN0Lmh0bWwnLFxuXHRcdFx0XHRjb250cm9sbGVyIDogJ0V4ZXJjaXNtVGVzdEN0cmwnXG5cdFx0XHR9XG5cdFx0fVxuXHR9KTtcbn0pO1xuXG5hcHAuY29udHJvbGxlcignRXhlcmNpc21UZXN0Q3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgRXhlcmNpc21GYWN0b3J5KXtcblx0JHNjb3BlLm5hbWUgPSBFeGVyY2lzbUZhY3RvcnkuZ2V0TmFtZSgpO1xuXHQkc2NvcGUudGVzdCA9IEV4ZXJjaXNtRmFjdG9yeS5nZXRUZXN0U2NyaXB0KCk7XG5cblx0Ly9wYXNzaW5nIHRoaXMgdXBkYXRlIGZ1bmN0aW9uIHNvIHRoYXQgb24gdGV4dCBjaGFuZ2UgaW4gdGhlIGRpcmVjdGl2ZSB0aGUgZmFjdG9yeSB3aWxsIGJlIGFsZXJ0ZWRcblx0JHNjb3BlLnVwZGF0ZWZ1bmMgPSBmdW5jdGlvbihuZXdWYWx1ZSl7XG5cdFx0RXhlcmNpc21GYWN0b3J5LnNldFRlc3RTY3JpcHQobmV3VmFsdWUpO1xuXHR9O1xufSk7IiwiYXBwLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlcil7XG5cdCRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdleGVyY2lzbS52aWV3Jywge1xuXHRcdHVybDogJy9leGVyY2lzbS92aWV3Jyxcblx0XHR2aWV3czoge1xuXHRcdFx0J3RhYi12aWV3JyA6IHtcblx0XHRcdFx0dGVtcGxhdGVVcmw6ICdmZWF0dXJlcy9leGVyY2lzbS12aWV3L2V4ZXJjaXNtLXZpZXcuaHRtbCcsXG5cdFx0XHRcdGNvbnRyb2xsZXI6ICdFeGVyY2lzbVZpZXdDdHJsJ1xuXHRcdFx0fVxuXHRcdH1cblx0fSk7XG59KTtcblxuYXBwLmNvbnRyb2xsZXIoJ0V4ZXJjaXNtVmlld0N0cmwnLCBmdW5jdGlvbigkc2NvcGUsIEV4ZXJjaXNtRmFjdG9yeSl7XG5cdCRzY29wZS5tYXJrZG93biA9IEV4ZXJjaXNtRmFjdG9yeS5nZXRNYXJrZG93bigpO1xuXHQkc2NvcGUubmFtZSA9IEV4ZXJjaXNtRmFjdG9yeS5nZXROYW1lKCk7XG59KTsiLCJhcHAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKXtcblx0JHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2xvZ2luJywge1xuXHRcdHVybCA6ICcvbG9naW4nLFxuXHRcdHRlbXBsYXRlVXJsIDogJ2ZlYXR1cmVzL2xvZ2luL2xvZ2luLmh0bWwnLFxuXHRcdGNvbnRyb2xsZXIgOiAnTG9naW5DdHJsJ1xuXHR9KTtcbn0pO1xuXG5hcHAuY29udHJvbGxlcignTG9naW5DdHJsJywgZnVuY3Rpb24oJHJvb3RTY29wZSwgJHNjb3BlLCAkaW9uaWNQb3B1cCwgJHN0YXRlLCBBdXRoU2VydmljZSl7XG5cdCRzY29wZS5kYXRhID0ge307XG5cdCRzY29wZS5lcnJvciA9IG51bGw7XG5cbiAgICAkc2NvcGUuc2lnbnVwID0gZnVuY3Rpb24oKXtcbiAgICAgICAgJHN0YXRlLmdvKCdzaWdudXAnKTtcbiAgICB9O1xuXG5cdCRzY29wZS5sb2dpbiA9IGZ1bmN0aW9uKCl7XG5cdFx0QXV0aFNlcnZpY2Vcblx0XHRcdC5sb2dpbigkc2NvcGUuZGF0YSlcblx0XHRcdC50aGVuKGZ1bmN0aW9uKGF1dGhlbnRpY2F0ZWQpeyAvL1RPRE86YXV0aGVudGljYXRlZCBpcyB3aGF0IGlzIHJldHVybmVkXG5cdFx0XHRcdC8vY29uc29sZS5sb2coJ2xvZ2luLCB0YWIuY2hhbGxlbmdlLXN1Ym1pdCcpO1xuXHRcdFx0XHQvLyRzY29wZS5tZW51ID0gdHJ1ZTtcblx0XHRcdFx0JHJvb3RTY29wZS4kYnJvYWRjYXN0KCdBdXRoJyk7XG5cdFx0XHRcdCRzY29wZS5zdGF0ZXMucHVzaCh7IC8vVE9ETzogTmVlZCB0byBhZGQgYSBwYXJlbnQgY29udHJvbGxlciB0byBjb21tdW5pY2F0ZVxuXHRcdFx0XHRcdG5hbWU6ICdMb2dvdXQnLFxuXHRcdFx0XHRcdHJlZjogZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRcdEF1dGhTZXJ2aWNlLmxvZ291dCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmRhdGEgPSB7fTtcblx0XHRcdFx0XHRcdCRzY29wZS5zdGF0ZXMucG9wKCk7IC8vVE9ETzogRmluZCBhIGJldHRlciB3YXkgdG8gcmVtb3ZlIHRoZSBMb2dvdXQgbGluaywgaW5zdGVhZCBvZiBwb3Bcblx0XHRcdFx0XHRcdCRzdGF0ZS5nbygnc2lnbnVwJyk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdFx0JHN0YXRlLmdvKCdjaGFsbGVuZ2UudmlldycpO1xuXHRcdFx0XHQvL1RPRE86IFdlIGNhbiBzZXQgdGhlIHVzZXIgbmFtZSBoZXJlIGFzIHdlbGwuIFVzZWQgaW4gY29uanVuY3Rpb24gd2l0aCBhIG1haW4gY3RybFxuXHRcdFx0fSlcblx0XHRcdC5jYXRjaChmdW5jdGlvbihlcnIpe1xuXHRcdFx0XHQkc2NvcGUuZXJyb3IgPSAnTG9naW4gSW52YWxpZCc7XG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoSlNPTi5zdHJpbmdpZnkoZXJyKSlcblx0XHRcdFx0dmFyIGFsZXJ0UG9wdXAgPSAkaW9uaWNQb3B1cC5hbGVydCh7XG5cdFx0XHRcdFx0dGl0bGU6ICdMb2dpbiBmYWlsZWQhJyxcblx0XHRcdFx0XHR0ZW1wbGF0ZTogJ1BsZWFzZSBjaGVjayB5b3VyIGNyZWRlbnRpYWxzISdcblx0XHRcdFx0fSk7XG5cdFx0XHR9KTtcblx0fTtcbn0pO1xuXG5cbi8vVE9ETzogQ2xlYW51cCBjb21tZW50ZWQgY29kZVxuXG4iLCJhcHAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKXtcbiAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgnc2lnbnVwJyx7XG4gICAgICAgIHVybDpcIi9zaWdudXBcIixcbiAgICAgICAgdGVtcGxhdGVVcmw6IFwiZmVhdHVyZXMvc2lnbnVwL3NpZ251cC5odG1sXCIsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdTaWduVXBDdHJsJ1xuICAgIH0pO1xufSk7XG5cbmFwcC5jb250cm9sbGVyKCdTaWduVXBDdHJsJyxmdW5jdGlvbigkcm9vdFNjb3BlLCAkaHR0cCwgJHNjb3BlLCAkc3RhdGUsIEF1dGhTZXJ2aWNlLCAkaW9uaWNQb3B1cCl7XG4gICAgJHNjb3BlLmRhdGEgPSB7fTtcbiAgICAkc2NvcGUuZXJyb3IgPSBudWxsO1xuXG4gICAgJHNjb3BlLmxvZ2luID0gZnVuY3Rpb24oKXtcbiAgICAgICAgJHN0YXRlLmdvKCdsb2dpbicpO1xuICAgIH07XG5cbiAgICAkc2NvcGUuc2lnbnVwID0gZnVuY3Rpb24oKXtcbiAgICAgICAgQXV0aFNlcnZpY2VcbiAgICAgICAgICAgIC5zaWdudXAoJHNjb3BlLmRhdGEpXG4gICAgICAgICAgICAudGhlbihmdW5jdGlvbihhdXRoZW50aWNhdGVkKXtcbiAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdzaWdudXAsIHRhYi5jaGFsbGVuZ2UnKTtcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoJ0F1dGgnKTtcbiAgICAgICAgICAgICAgICAkc2NvcGUuc3RhdGVzLnB1c2goeyAvL1RPRE86IE5lZWQgdG8gYWRkIGEgcGFyZW50IGNvbnRyb2xsZXIgdG8gY29tbXVuaWNhdGVcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogJ0xvZ291dCcsXG4gICAgICAgICAgICAgICAgICAgIHJlZjogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIEF1dGhTZXJ2aWNlLmxvZ291dCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmRhdGEgPSB7fTtcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5zdGF0ZXMucG9wKCk7IC8vVE9ETzogRmluZCBhIGJldHRlciB3YXkgdG8gcmVtb3ZlIHRoZSBMb2dvdXQgbGluaywgaW5zdGVhZCBvZiBwb3BcbiAgICAgICAgICAgICAgICAgICAgICAgICRzdGF0ZS5nbygnc2lnbnVwJyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ2NoYWxsZW5nZS52aWV3Jyk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmNhdGNoKGZ1bmN0aW9uKGVycil7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmVycm9yID0gJ1NpZ251cCBJbnZhbGlkJztcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKEpTT04uc3RyaW5naWZ5KGVycikpXG4gICAgICAgICAgICAgICAgdmFyIGFsZXJ0UG9wdXAgPSAkaW9uaWNQb3B1cC5hbGVydCh7XG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnU2lnbnVwIGZhaWxlZCEnLFxuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogJ1BsZWFzZSBjaGVjayB5b3VyIGNyZWRlbnRpYWxzISdcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgIH07XG5cbn0pO1xuXG4vL1RPRE86IEZvcm0gVmFsaWRhdGlvblxuLy9UT0RPOiBDbGVhbnVwIGNvbW1lbnRlZCBjb2RlIiwiYXBwLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlcil7XG5cdCRzdGF0ZVByb3ZpZGVyLnN0YXRlKCd3ZWxjb21lJywge1xuXHRcdHVybCA6ICcvd2VsY29tZScsXG5cdFx0dGVtcGxhdGVVcmwgOiAnZmVhdHVyZXMvd2VsY29tZS93ZWxjb21lLmh0bWwnLFxuXHRcdGNvbnRyb2xsZXIgOiAnV2VsY29tZUN0cmwnXG5cdH0pO1xufSk7XG5cbmFwcC5jb250cm9sbGVyKCdXZWxjb21lQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgJHN0YXRlLCBBdXRoU2VydmljZSwgJHJvb3RTY29wZSl7XG5cdC8vVE9ETzogU3BsYXNoIHBhZ2Ugd2hpbGUgeW91IGxvYWQgcmVzb3VyY2VzIChwb3NzaWJsZSBpZGVhKVxuXHQvL2NvbnNvbGUubG9nKCdXZWxjb21lQ3RybCcpO1xuXHQkc2NvcGUubG9naW4gPSBmdW5jdGlvbigpe1xuXHRcdCRzdGF0ZS5nbygnbG9naW4nKTtcblx0fTtcblx0JHNjb3BlLnNpZ251cCA9IGZ1bmN0aW9uKCl7XG5cdFx0JHN0YXRlLmdvKCdzaWdudXAnKTtcblx0fTtcblxuXHRpZiAoQXV0aFNlcnZpY2UuaXNBdXRoZW50aWNhdGVkKCkpIHtcblx0XHQkcm9vdFNjb3BlLiRicm9hZGNhc3QoJ0F1dGgnKTtcblx0XHQkc2NvcGUuc3RhdGVzLnB1c2goeyAvL1RPRE86IE5lZWQgdG8gYWRkIGEgcGFyZW50IGNvbnRyb2xsZXIgdG8gY29tbXVuaWNhdGVcblx0XHRcdG5hbWU6ICdMb2dvdXQnLFxuXHRcdFx0cmVmOiBmdW5jdGlvbigpe1xuXHRcdFx0XHRBdXRoU2VydmljZS5sb2dvdXQoKTtcblx0XHRcdFx0JHNjb3BlLmRhdGEgPSB7fTtcblx0XHRcdFx0JHNjb3BlLnN0YXRlcy5wb3AoKTsgLy9UT0RPOiBGaW5kIGEgYmV0dGVyIHdheSB0byByZW1vdmUgdGhlIExvZ291dCBsaW5rLCBpbnN0ZWFkIG9mIHBvcFxuXHRcdFx0XHQkc3RhdGUuZ28oJ3NpZ251cCcpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdCRzdGF0ZS5nbygnY2hhbGxlbmdlLnZpZXcnKTtcblx0fSBlbHNlIHtcblx0XHQvL1RPRE86ICRzdGF0ZS5nbygnc2lnbnVwJyk7IFJlbW92ZSBCZWxvdyBsaW5lXG5cdFx0JHN0YXRlLmdvKCdjaGFsbGVuZ2UudmlldycpO1xuXHR9XG59KTsiLCIvL3Rva2VuIGlzIHNlbnQgb24gZXZlcnkgaHR0cCByZXF1ZXN0XG5hcHAuZmFjdG9yeSgnQXV0aEludGVyY2VwdG9yJyxmdW5jdGlvbiBBdXRoSW50ZXJjZXB0b3IoQVVUSF9FVkVOVFMsJHJvb3RTY29wZSwkcSxBdXRoVG9rZW5GYWN0b3J5KXtcblxuICAgIHZhciBzdGF0dXNEaWN0ID0ge1xuICAgICAgICA0MDE6IEFVVEhfRVZFTlRTLm5vdEF1dGhlbnRpY2F0ZWQsXG4gICAgICAgIDQwMzogQVVUSF9FVkVOVFMubm90QXV0aG9yaXplZFxuICAgIH07XG5cbiAgICByZXR1cm4ge1xuICAgICAgICByZXF1ZXN0OiBhZGRUb2tlbixcbiAgICAgICAgcmVzcG9uc2VFcnJvcjogZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3Qoc3RhdHVzRGljdFtyZXNwb25zZS5zdGF0dXNdLCByZXNwb25zZSk7XG4gICAgICAgICAgICByZXR1cm4gJHEucmVqZWN0KHJlc3BvbnNlKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBmdW5jdGlvbiBhZGRUb2tlbihjb25maWcpe1xuICAgICAgICB2YXIgdG9rZW4gPSBBdXRoVG9rZW5GYWN0b3J5LmdldFRva2VuKCk7XG4gICAgICAgIC8vY29uc29sZS5sb2coJ2FkZFRva2VuJyx0b2tlbik7XG4gICAgICAgIGlmKHRva2VuKXtcbiAgICAgICAgICAgIGNvbmZpZy5oZWFkZXJzID0gY29uZmlnLmhlYWRlcnMgfHwge307XG4gICAgICAgICAgICBjb25maWcuaGVhZGVycy5BdXRob3JpemF0aW9uID0gJ0JlYXJlciAnICsgdG9rZW47XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNvbmZpZztcbiAgICB9XG59KTtcbi8vc2tpcHBlZCBBdXRoIEludGVyY2VwdG9ycyBnaXZlbiBUT0RPOiBZb3UgY291bGQgYXBwbHkgdGhlIGFwcHJvYWNoIGluXG4vL2h0dHA6Ly9kZXZkYWN0aWMuY29tL3VzZXItYXV0aC1hbmd1bGFyanMtaW9uaWMvXG5cbmFwcC5jb25maWcoZnVuY3Rpb24oJGh0dHBQcm92aWRlcil7XG4gICAgJGh0dHBQcm92aWRlci5pbnRlcmNlcHRvcnMucHVzaCgnQXV0aEludGVyY2VwdG9yJyk7XG59KTtcblxuYXBwLmNvbnN0YW50KCdBVVRIX0VWRU5UUycsIHtcbiAgICAgICAgbm90QXV0aGVudGljYXRlZDogJ2F1dGgtbm90LWF1dGhlbnRpY2F0ZWQnLFxuICAgICAgICBub3RBdXRob3JpemVkOiAnYXV0aC1ub3QtYXV0aG9yaXplZCdcbn0pO1xuXG5hcHAuY29uc3RhbnQoJ1VTRVJfUk9MRVMnLCB7XG4gICAgICAgIC8vYWRtaW46ICdhZG1pbl9yb2xlJyxcbiAgICAgICAgcHVibGljOiAncHVibGljX3JvbGUnXG59KTtcblxuYXBwLmZhY3RvcnkoJ0F1dGhUb2tlbkZhY3RvcnknLGZ1bmN0aW9uKCR3aW5kb3cpe1xuICAgIHZhciBzdG9yZSA9ICR3aW5kb3cubG9jYWxTdG9yYWdlO1xuICAgIHZhciBrZXkgPSAnYXV0aC10b2tlbic7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBnZXRUb2tlbjogZ2V0VG9rZW4sXG4gICAgICAgIHNldFRva2VuOiBzZXRUb2tlblxuICAgIH07XG5cbiAgICBmdW5jdGlvbiBnZXRUb2tlbigpe1xuICAgICAgICByZXR1cm4gc3RvcmUuZ2V0SXRlbShrZXkpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNldFRva2VuKHRva2VuKXtcbiAgICAgICAgaWYodG9rZW4pe1xuICAgICAgICAgICAgc3RvcmUuc2V0SXRlbShrZXksdG9rZW4pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc3RvcmUucmVtb3ZlSXRlbShrZXkpO1xuICAgICAgICB9XG4gICAgfVxufSk7XG5cbmFwcC5zZXJ2aWNlKCdBdXRoU2VydmljZScsZnVuY3Rpb24oJHEsJGh0dHAsVVNFUl9ST0xFUyxBdXRoVG9rZW5GYWN0b3J5LEFwaUVuZHBvaW50LCRyb290U2NvcGUpe1xuICAgIHZhciB1c2VybmFtZSA9ICcnO1xuICAgIHZhciBpc0F1dGhlbnRpY2F0ZWQgPSBmYWxzZTtcbiAgICB2YXIgYXV0aFRva2VuO1xuXG4gICAgZnVuY3Rpb24gbG9hZFVzZXJDcmVkZW50aWFscygpIHtcbiAgICAgICAgLy92YXIgdG9rZW4gPSB3aW5kb3cubG9jYWxTdG9yYWdlLmdldEl0ZW0oTE9DQUxfVE9LRU5fS0VZKTtcbiAgICAgICAgdmFyIHRva2VuID0gQXV0aFRva2VuRmFjdG9yeS5nZXRUb2tlbigpO1xuICAgICAgICAvL2NvbnNvbGUubG9nKHRva2VuKTtcbiAgICAgICAgaWYgKHRva2VuKSB7XG4gICAgICAgICAgICB1c2VDcmVkZW50aWFscyh0b2tlbik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzdG9yZVVzZXJDcmVkZW50aWFscyhkYXRhKSB7XG4gICAgICAgIEF1dGhUb2tlbkZhY3Rvcnkuc2V0VG9rZW4oZGF0YS50b2tlbik7XG4gICAgICAgIHVzZUNyZWRlbnRpYWxzKGRhdGEpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHVzZUNyZWRlbnRpYWxzKGRhdGEpIHtcbiAgICAgICAgLy9jb25zb2xlLmxvZygndXNlQ3JlZGVudGlhbHMgdG9rZW4nLGRhdGEpO1xuICAgICAgICB1c2VybmFtZSA9IGRhdGEudXNlcm5hbWU7XG4gICAgICAgIGlzQXV0aGVudGljYXRlZCA9IHRydWU7XG4gICAgICAgIGF1dGhUb2tlbiA9IGRhdGEudG9rZW47XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZGVzdHJveVVzZXJDcmVkZW50aWFscygpIHtcbiAgICAgICAgYXV0aFRva2VuID0gdW5kZWZpbmVkO1xuICAgICAgICB1c2VybmFtZSA9ICcnO1xuICAgICAgICBpc0F1dGhlbnRpY2F0ZWQgPSBmYWxzZTtcbiAgICAgICAgQXV0aFRva2VuRmFjdG9yeS5zZXRUb2tlbigpOyAvL2VtcHR5IGNsZWFycyB0aGUgdG9rZW5cbiAgICB9XG5cbiAgICB2YXIgbG9nb3V0ID0gZnVuY3Rpb24oKXtcbiAgICAgICAgZGVzdHJveVVzZXJDcmVkZW50aWFscygpO1xuXG4gICAgfTtcblxuICAgIC8vdmFyIGxvZ2luID0gZnVuY3Rpb24oKVxuICAgIHZhciBsb2dpbiA9IGZ1bmN0aW9uKHVzZXJkYXRhKXtcbiAgICAgICAgY29uc29sZS5sb2coJ2xvZ2luJyxKU09OLnN0cmluZ2lmeSh1c2VyZGF0YSkpO1xuICAgICAgICByZXR1cm4gJHEoZnVuY3Rpb24ocmVzb2x2ZSxyZWplY3Qpe1xuICAgICAgICAgICAgJGh0dHAucG9zdChBcGlFbmRwb2ludC51cmwrXCIvdXNlci9sb2dpblwiLCB1c2VyZGF0YSlcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgICAgICAgICAgICAgICAgIHN0b3JlVXNlckNyZWRlbnRpYWxzKHJlc3BvbnNlLmRhdGEpOyAvL3N0b3JlVXNlckNyZWRlbnRpYWxzXG4gICAgICAgICAgICAgICAgICAgIC8vaXNBdXRoZW50aWNhdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShyZXNwb25zZSk7IC8vVE9ETzogc2VudCB0byBhdXRoZW50aWNhdGVkXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICB2YXIgc2lnbnVwID0gZnVuY3Rpb24odXNlcmRhdGEpe1xuICAgICAgICBjb25zb2xlLmxvZygnc2lnbnVwJyxKU09OLnN0cmluZ2lmeSh1c2VyZGF0YSkpO1xuICAgICAgICByZXR1cm4gJHEoZnVuY3Rpb24ocmVzb2x2ZSxyZWplY3Qpe1xuICAgICAgICAgICAgJGh0dHAucG9zdChBcGlFbmRwb2ludC51cmwrXCIvdXNlci9zaWdudXBcIiwgdXNlcmRhdGEpXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgICAgICAgICAgICAgICBzdG9yZVVzZXJDcmVkZW50aWFscyhyZXNwb25zZS5kYXRhKTsgLy9zdG9yZVVzZXJDcmVkZW50aWFsc1xuICAgICAgICAgICAgICAgICAgICAvL2lzQXV0aGVudGljYXRlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUocmVzcG9uc2UpOyAvL1RPRE86IHNlbnQgdG8gYXV0aGVudGljYXRlZFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBsb2FkVXNlckNyZWRlbnRpYWxzKCk7XG5cbiAgICB2YXIgaXNBdXRob3JpemVkID0gZnVuY3Rpb24oYXV0aGVudGljYXRlZCkge1xuICAgICAgICBpZiAoIWFuZ3VsYXIuaXNBcnJheShhdXRoZW50aWNhdGVkKSkge1xuICAgICAgICAgICAgYXV0aGVudGljYXRlZCA9IFthdXRoZW50aWNhdGVkXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gKGlzQXV0aGVudGljYXRlZCAmJiBhdXRoZW50aWNhdGVkLmluZGV4T2YoVVNFUl9ST0xFUy5wdWJsaWMpICE9PSAtMSk7XG4gICAgfTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIGxvZ2luOiBsb2dpbixcbiAgICAgICAgc2lnbnVwOiBzaWdudXAsXG4gICAgICAgIGxvZ291dDogbG9nb3V0LFxuICAgICAgICBpc0F1dGhlbnRpY2F0ZWQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgLy9jb25zb2xlLmxvZygnQXV0aFNlcnZpY2UuaXNBdXRoZW50aWNhdGVkKCknKTtcbiAgICAgICAgICAgIHJldHVybiBpc0F1dGhlbnRpY2F0ZWQ7XG4gICAgICAgIH0sXG4gICAgICAgIHVzZXJuYW1lOiBmdW5jdGlvbigpe3JldHVybiB1c2VybmFtZTt9LFxuICAgICAgICAvL2dldExvZ2dlZEluVXNlcjogZ2V0TG9nZ2VkSW5Vc2VyLFxuICAgICAgICBpc0F1dGhvcml6ZWQ6IGlzQXV0aG9yaXplZFxuICAgIH1cblxufSk7XG5cbi8vVE9ETzogRGlkIG5vdCBjb21wbGV0ZSBtYWluIGN0cmwgJ0FwcEN0cmwgZm9yIGhhbmRsaW5nIGV2ZW50cydcbi8vIGFzIHBlciBodHRwOi8vZGV2ZGFjdGljLmNvbS91c2VyLWF1dGgtYW5ndWxhcmpzLWlvbmljLyIsImFwcC5maWx0ZXIoJ2FwcGVuZCcsIGZ1bmN0aW9uKCl7XG5cdHJldHVybiBmdW5jdGlvbihpbnB1dCwgYXBwZW5kKXtcblx0XHRyZXR1cm4gYXBwZW5kICsgaW5wdXQ7XG5cdH07XG59KTsiLCJhcHAuZmlsdGVyKCdib29sJywgZnVuY3Rpb24oKXtcblx0cmV0dXJuIGZ1bmN0aW9uKGlucHV0LCBjb25kaXRpb24sIGlmVHJ1ZSwgaWZGYWxzZSl7XG5cdFx0aWYoZXZhbChpbnB1dCArIGNvbmRpdGlvbikpe1xuXHRcdFx0cmV0dXJuIGlmVHJ1ZTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmV0dXJuIGlmRmFsc2U7XG5cdFx0fVxuXHR9O1xufSk7IiwiYXBwLmZpbHRlcignbmFtZWZvcm1hdCcsIGZ1bmN0aW9uKCl7XG5cdHJldHVybiBmdW5jdGlvbih0ZXh0KXtcblx0XHRyZXR1cm4gJ0V4ZXJjaXNtIC0gJyArIHRleHQuc3BsaXQoJy0nKS5tYXAoZnVuY3Rpb24oZWwpe1xuXHRcdFx0cmV0dXJuIGVsLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgZWwuc2xpY2UoMSk7XG5cdFx0fSkuam9pbignICcpO1xuXHR9O1xufSk7IiwiYXBwLmZpbHRlcignbGVuZ3RoJywgZnVuY3Rpb24oKXtcblx0cmV0dXJuIGZ1bmN0aW9uKGFycklucHV0KXtcblx0XHR2YXIgY2hlY2tBcnIgPSBhcnJJbnB1dCB8fCBbXTtcblx0XHRyZXR1cm4gY2hlY2tBcnIubGVuZ3RoO1xuXHR9O1xufSk7IiwiYXBwLmZpbHRlcignbWFya2VkJywgZnVuY3Rpb24oJHNjZSl7XG5cdC8vIG1hcmtlZC5zZXRPcHRpb25zKHtcblx0Ly8gXHRyZW5kZXJlcjogbmV3IG1hcmtlZC5SZW5kZXJlcigpLFxuXHQvLyBcdGdmbTogdHJ1ZSxcblx0Ly8gXHR0YWJsZXM6IHRydWUsXG5cdC8vIFx0YnJlYWtzOiB0cnVlLFxuXHQvLyBcdHBlZGFudGljOiBmYWxzZSxcblx0Ly8gXHRzYW5pdGl6ZTogdHJ1ZSxcblx0Ly8gXHRzbWFydExpc3RzOiB0cnVlLFxuXHQvLyBcdHNtYXJ0eXBhbnRzOiBmYWxzZVxuXHQvLyB9KTtcblx0cmV0dXJuIGZ1bmN0aW9uKHRleHQpe1xuXHRcdGlmKHRleHQpe1xuXHRcdFx0cmV0dXJuICRzY2UudHJ1c3RBc0h0bWwobWFya2VkKHRleHQpKTtcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHRyZXR1cm4gdW5kZWZpbmVkO1xuXHRcdH1cblx0fTtcbn0pOyIsImFwcC5kaXJlY3RpdmUoJ2NtZWRpdCcsIGZ1bmN0aW9uKCl7XG5cdHJldHVybiB7XG5cdFx0cmVzdHJpY3QgOiAnQScsXG5cdFx0c2NvcGU6IHtcblx0XHRcdG5nTW9kZWwgOiAnPScsXG5cdFx0XHR1cGRhdGVmdW5jOiAnPSdcblx0XHR9LFxuXHRcdGxpbmsgOiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cmlidXRlKXtcblx0XHRcdHZhciB1cGRhdGVUZXh0ID0gZnVuY3Rpb24oKXtcblx0XHRcdFx0dmFyIG5ld1ZhbHVlID0gbXlDb2RlTWlycm9yLmdldFZhbHVlKCk7XG5cdFx0XHRcdHNjb3BlLm5nTW9kZWwgPSBuZXdWYWx1ZTtcblx0XHRcdFx0aWYoc2NvcGUudXBkYXRlZnVuYykgc2NvcGUudXBkYXRlZnVuYyhuZXdWYWx1ZSk7XG5cdFx0XHRcdHNjb3BlLiRhcHBseSgpO1xuXHRcdFx0fTtcblx0XHRcdC8vaW5pdGlhbGl6ZSBDb2RlTWlycm9yXG5cdFx0XHR2YXIgbXlDb2RlTWlycm9yID0gQ29kZU1pcnJvci5mcm9tVGV4dEFyZWEoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoYXR0cmlidXRlLmlkKSwge1xuXHRcdFx0XHRsaW5lTnVtYmVycyA6IHRydWUsXG5cdFx0XHRcdG1vZGU6ICdqYXZhc2NyaXB0Jyxcblx0XHRcdFx0YXV0b2ZvY3VzIDogdHJ1ZSxcblx0XHRcdFx0dGhlbWUgOiAndHdpbGlnaHQnLFxuXHRcdFx0XHRsaW5lV3JhcHBpbmc6IHRydWVcblx0XHRcdH0pO1xuXHRcdFx0bXlDb2RlTWlycm9yLnNldFZhbHVlKHNjb3BlLm5nTW9kZWwpO1xuXG5cdFx0XHRteUNvZGVNaXJyb3Iub24oXCJjaGFuZ2VcIiwgZnVuY3Rpb24gKG15Q29kZU1pcnJvciwgY2hhbmdlT2JqKXtcblx0XHQgICAgXHR1cGRhdGVUZXh0KCk7XG5cdFx0ICAgIH0pO1xuXHRcdH1cblx0fTtcbn0pOyIsImFwcC5kaXJlY3RpdmUoJ2NtcmVhZCcsIGZ1bmN0aW9uKCl7XG5cdHJldHVybiB7XG5cdFx0cmVzdHJpY3QgOiAnQScsXG5cdFx0c2NvcGU6IHtcblx0XHRcdG5nTW9kZWwgOiAnPSdcblx0XHR9LFxuXHRcdGxpbmsgOiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cmlidXRlKXtcblx0XHRcdC8vaW5pdGlhbGl6ZSBDb2RlTWlycm9yXG5cdFx0XHR2YXIgbXlDb2RlTWlycm9yID0gQ29kZU1pcnJvci5mcm9tVGV4dEFyZWEoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbXBpbGUnKSwge1xuXHRcdFx0XHRyZWFkT25seSA6ICdub2N1cnNvcicsXG5cdFx0XHRcdG1vZGU6ICdqYXZhc2NyaXB0Jyxcblx0XHRcdFx0YXV0b2ZvY3VzIDogdHJ1ZSxcblx0XHRcdFx0dGhlbWUgOiAndHdpbGlnaHQnLFxuXHRcdFx0XHRsaW5lV3JhcHBpbmc6IHRydWVcblx0XHRcdH0pO1xuXG5cdFx0XHRteUNvZGVNaXJyb3Iuc2V0VmFsdWUoc2NvcGUubmdNb2RlbCk7XG5cdFx0fVxuXHR9O1xufSk7IiwiYXBwLmRpcmVjdGl2ZSgnamFzbWluZScsIGZ1bmN0aW9uKEphc21pbmVSZXBvcnRlcil7XG5cdHJldHVybiB7XG5cdFx0cmVzdHJpY3QgOiAnRScsXG5cdFx0dHJhbnNjbHVkZTogdHJ1ZSxcblx0XHRzY29wZSA6IHtcblx0XHRcdHRlc3Q6ICc9Jyxcblx0XHRcdGNvZGU6ICc9J1xuXHRcdH0sXG5cdFx0dGVtcGxhdGVVcmwgOiAnZmVhdHVyZXMvY29tbW9uL2RpcmVjdGl2ZXMvamFzbWluZS9qYXNtaW5lLmh0bWwnLFxuXHRcdGxpbmsgOiBmdW5jdGlvbiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJpYnV0ZSl7XG5cdFx0XHRzY29wZS4kd2F0Y2goJ3Rlc3QnLCBmdW5jdGlvbigpe1xuXHRcdFx0XHR3aW5kb3cuamFzbWluZSA9IG51bGw7XG5cdFx0XHRcdEphc21pbmVSZXBvcnRlci5pbml0aWFsaXplSmFzbWluZSgpO1xuXHRcdFx0XHRKYXNtaW5lUmVwb3J0ZXIuYWRkUmVwb3J0ZXIoc2NvcGUpO1xuXHRcdFx0fSk7XG5cblx0XHRcdHNjb3BlLiR3YXRjaCgnY29kZScsIGZ1bmN0aW9uKCl7XG5cdFx0XHRcdHdpbmRvdy5qYXNtaW5lID0gbnVsbDtcblx0XHRcdFx0SmFzbWluZVJlcG9ydGVyLmluaXRpYWxpemVKYXNtaW5lKCk7XG5cdFx0XHRcdEphc21pbmVSZXBvcnRlci5hZGRSZXBvcnRlcihzY29wZSk7XG5cdFx0XHR9KTtcblxuXHRcdFx0ZnVuY3Rpb24gZmxhdHRlblJlbW92ZUR1cGVzKGFyciwga2V5Q2hlY2spe1xuXHRcdFx0XHR2YXIgdHJhY2tlciA9IFtdO1xuXHRcdFx0XHRyZXR1cm4gd2luZG93Ll8uZmxhdHRlbihhcnIpLmZpbHRlcihmdW5jdGlvbihlbCl7XG5cdFx0XHRcdFx0aWYodHJhY2tlci5pbmRleE9mKGVsW2tleUNoZWNrXSkgPT0gLTEpe1xuXHRcdFx0XHRcdFx0dHJhY2tlci5wdXNoKGVsW2tleUNoZWNrXSk7XG5cdFx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblxuXHRcdFx0c2NvcGUuc3VtbWFyeVNob3dpbmcgPSB0cnVlO1xuXG5cdFx0XHRzY29wZS5zaG93U3VtbWFyeSA9IGZ1bmN0aW9uKCl7XG5cdFx0XHRcdGlmKCFzY29wZS5zdW1tYXJ5U2hvd2luZykgc2NvcGUuc3VtbWFyeVNob3dpbmcgPSAhc2NvcGUuc3VtbWFyeVNob3dpbmc7XG5cdFx0XHR9O1xuXHRcdFx0c2NvcGUuc2hvd0ZhaWx1cmVzID0gZnVuY3Rpb24oKXtcblx0XHRcdFx0aWYoc2NvcGUuc3VtbWFyeVNob3dpbmcpIHNjb3BlLnN1bW1hcnlTaG93aW5nID0gIXNjb3BlLnN1bW1hcnlTaG93aW5nO1xuXHRcdFx0fTtcblxuXG5cdFx0XHRzY29wZS4kd2F0Y2goJ3N1aXRlcycsIGZ1bmN0aW9uKCl7XG5cdFx0XHRcdGlmKHNjb3BlLnN1aXRlcyl7XG5cdFx0XHRcdFx0dmFyIHN1aXRlc1NwZWNzID0gc2NvcGUuc3VpdGVzLm1hcChmdW5jdGlvbihlbCl7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZWwuc3BlY3M7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0c2NvcGUuc3BlY3NPdmVydmlldyA9IGZsYXR0ZW5SZW1vdmVEdXBlcyhzdWl0ZXNTcGVjcywgXCJpZFwiKTtcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhzY29wZS5zcGVjc092ZXJ2aWV3KTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cblx0XHR9XG5cdH07XG59KTtcblxuYXBwLmZhY3RvcnkoJ0phc21pbmVSZXBvcnRlcicsIGZ1bmN0aW9uKCl7XG5cdGZ1bmN0aW9uIGluaXRpYWxpemVKYXNtaW5lKCl7XG5cdFx0Lypcblx0XHRDb3B5cmlnaHQgKGMpIDIwMDgtMjAxNSBQaXZvdGFsIExhYnNcblxuXHRcdFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZ1xuXHRcdGEgY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuXHRcdFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuXHRcdHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcblx0XHRkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG9cblx0XHRwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG9cblx0XHR0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG5cblx0XHRUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZVxuXHRcdGluY2x1ZGVkIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuXG5cdFx0VEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCxcblx0XHRFWFBSRVNTIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcblx0XHRNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORFxuXHRcdE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkVcblx0XHRMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OXG5cdFx0T0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OXG5cdFx0V0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cdFx0Ki9cblx0XHQvKipcblx0XHQgU3RhcnRpbmcgd2l0aCB2ZXJzaW9uIDIuMCwgdGhpcyBmaWxlIFwiYm9vdHNcIiBKYXNtaW5lLCBwZXJmb3JtaW5nIGFsbCBvZiB0aGUgbmVjZXNzYXJ5IGluaXRpYWxpemF0aW9uIGJlZm9yZSBleGVjdXRpbmcgdGhlIGxvYWRlZCBlbnZpcm9ubWVudCBhbmQgYWxsIG9mIGEgcHJvamVjdCdzIHNwZWNzLiBUaGlzIGZpbGUgc2hvdWxkIGJlIGxvYWRlZCBhZnRlciBgamFzbWluZS5qc2AgYW5kIGBqYXNtaW5lX2h0bWwuanNgLCBidXQgYmVmb3JlIGFueSBwcm9qZWN0IHNvdXJjZSBmaWxlcyBvciBzcGVjIGZpbGVzIGFyZSBsb2FkZWQuIFRodXMgdGhpcyBmaWxlIGNhbiBhbHNvIGJlIHVzZWQgdG8gY3VzdG9taXplIEphc21pbmUgZm9yIGEgcHJvamVjdC5cblxuXHRcdCBJZiBhIHByb2plY3QgaXMgdXNpbmcgSmFzbWluZSB2aWEgdGhlIHN0YW5kYWxvbmUgZGlzdHJpYnV0aW9uLCB0aGlzIGZpbGUgY2FuIGJlIGN1c3RvbWl6ZWQgZGlyZWN0bHkuIElmIGEgcHJvamVjdCBpcyB1c2luZyBKYXNtaW5lIHZpYSB0aGUgW1J1YnkgZ2VtXVtqYXNtaW5lLWdlbV0sIHRoaXMgZmlsZSBjYW4gYmUgY29waWVkIGludG8gdGhlIHN1cHBvcnQgZGlyZWN0b3J5IHZpYSBgamFzbWluZSBjb3B5X2Jvb3RfanNgLiBPdGhlciBlbnZpcm9ubWVudHMgKGUuZy4sIFB5dGhvbikgd2lsbCBoYXZlIGRpZmZlcmVudCBtZWNoYW5pc21zLlxuXG5cdFx0IFRoZSBsb2NhdGlvbiBvZiBgYm9vdC5qc2AgY2FuIGJlIHNwZWNpZmllZCBhbmQvb3Igb3ZlcnJpZGRlbiBpbiBgamFzbWluZS55bWxgLlxuXG5cdFx0IFtqYXNtaW5lLWdlbV06IGh0dHA6Ly9naXRodWIuY29tL3Bpdm90YWwvamFzbWluZS1nZW1cblx0XHQgKi9cblxuXHRcdChmdW5jdGlvbigpIHtcblx0XHQgIC8qKlxuXHRcdCAgICogIyMgUmVxdWlyZSAmYW1wOyBJbnN0YW50aWF0ZVxuXHRcdCAgICpcblx0XHQgICAqIFJlcXVpcmUgSmFzbWluZSdzIGNvcmUgZmlsZXMuIFNwZWNpZmljYWxseSwgdGhpcyByZXF1aXJlcyBhbmQgYXR0YWNoZXMgYWxsIG9mIEphc21pbmUncyBjb2RlIHRvIHRoZSBgamFzbWluZWAgcmVmZXJlbmNlLlxuXHRcdCAgICovXG5cdFx0ICB3aW5kb3cuamFzbWluZSA9IGphc21pbmVSZXF1aXJlLmNvcmUoamFzbWluZVJlcXVpcmUpO1xuXG5cdFx0ICAvKipcblx0XHQgICAqIFNpbmNlIHRoaXMgaXMgYmVpbmcgcnVuIGluIGEgYnJvd3NlciBhbmQgdGhlIHJlc3VsdHMgc2hvdWxkIHBvcHVsYXRlIHRvIGFuIEhUTUwgcGFnZSwgcmVxdWlyZSB0aGUgSFRNTC1zcGVjaWZpYyBKYXNtaW5lIGNvZGUsIGluamVjdGluZyB0aGUgc2FtZSByZWZlcmVuY2UuXG5cdFx0ICAgKi9cblx0XHQgIGphc21pbmVSZXF1aXJlLmh0bWwoamFzbWluZSk7XG5cblx0XHQgIC8qKlxuXHRcdCAgICogQ3JlYXRlIHRoZSBKYXNtaW5lIGVudmlyb25tZW50LiBUaGlzIGlzIHVzZWQgdG8gcnVuIGFsbCBzcGVjcyBpbiBhIHByb2plY3QuXG5cdFx0ICAgKi9cblx0XHQgIHZhciBlbnYgPSBqYXNtaW5lLmdldEVudigpO1xuXG5cdFx0ICAvKipcblx0XHQgICAqICMjIFRoZSBHbG9iYWwgSW50ZXJmYWNlXG5cdFx0ICAgKlxuXHRcdCAgICogQnVpbGQgdXAgdGhlIGZ1bmN0aW9ucyB0aGF0IHdpbGwgYmUgZXhwb3NlZCBhcyB0aGUgSmFzbWluZSBwdWJsaWMgaW50ZXJmYWNlLiBBIHByb2plY3QgY2FuIGN1c3RvbWl6ZSwgcmVuYW1lIG9yIGFsaWFzIGFueSBvZiB0aGVzZSBmdW5jdGlvbnMgYXMgZGVzaXJlZCwgcHJvdmlkZWQgdGhlIGltcGxlbWVudGF0aW9uIHJlbWFpbnMgdW5jaGFuZ2VkLlxuXHRcdCAgICovXG5cdFx0ICB2YXIgamFzbWluZUludGVyZmFjZSA9IGphc21pbmVSZXF1aXJlLmludGVyZmFjZShqYXNtaW5lLCBlbnYpO1xuXG5cdFx0ICAvKipcblx0XHQgICAqIEFkZCBhbGwgb2YgdGhlIEphc21pbmUgZ2xvYmFsL3B1YmxpYyBpbnRlcmZhY2UgdG8gdGhlIGdsb2JhbCBzY29wZSwgc28gYSBwcm9qZWN0IGNhbiB1c2UgdGhlIHB1YmxpYyBpbnRlcmZhY2UgZGlyZWN0bHkuIEZvciBleGFtcGxlLCBjYWxsaW5nIGBkZXNjcmliZWAgaW4gc3BlY3MgaW5zdGVhZCBvZiBgamFzbWluZS5nZXRFbnYoKS5kZXNjcmliZWAuXG5cdFx0ICAgKi9cblx0XHQgIGV4dGVuZCh3aW5kb3csIGphc21pbmVJbnRlcmZhY2UpO1xuXG5cdFx0ICAvKipcblx0XHQgICAqICMjIFJ1bm5lciBQYXJhbWV0ZXJzXG5cdFx0ICAgKlxuXHRcdCAgICogTW9yZSBicm93c2VyIHNwZWNpZmljIGNvZGUgLSB3cmFwIHRoZSBxdWVyeSBzdHJpbmcgaW4gYW4gb2JqZWN0IGFuZCB0byBhbGxvdyBmb3IgZ2V0dGluZy9zZXR0aW5nIHBhcmFtZXRlcnMgZnJvbSB0aGUgcnVubmVyIHVzZXIgaW50ZXJmYWNlLlxuXHRcdCAgICovXG5cblx0XHQgIHZhciBxdWVyeVN0cmluZyA9IG5ldyBqYXNtaW5lLlF1ZXJ5U3RyaW5nKHtcblx0XHQgICAgZ2V0V2luZG93TG9jYXRpb246IGZ1bmN0aW9uKCkgeyByZXR1cm4gd2luZG93LmxvY2F0aW9uOyB9XG5cdFx0ICB9KTtcblxuXHRcdCAgdmFyIGNhdGNoaW5nRXhjZXB0aW9ucyA9IHF1ZXJ5U3RyaW5nLmdldFBhcmFtKFwiY2F0Y2hcIik7XG5cdFx0ICBlbnYuY2F0Y2hFeGNlcHRpb25zKHR5cGVvZiBjYXRjaGluZ0V4Y2VwdGlvbnMgPT09IFwidW5kZWZpbmVkXCIgPyB0cnVlIDogY2F0Y2hpbmdFeGNlcHRpb25zKTtcblxuXHRcdCAgdmFyIHRocm93aW5nRXhwZWN0YXRpb25GYWlsdXJlcyA9IHF1ZXJ5U3RyaW5nLmdldFBhcmFtKFwidGhyb3dGYWlsdXJlc1wiKTtcblx0XHQgIGVudi50aHJvd09uRXhwZWN0YXRpb25GYWlsdXJlKHRocm93aW5nRXhwZWN0YXRpb25GYWlsdXJlcyk7XG5cblx0XHQgIC8qKlxuXHRcdCAgICogVGhlIGBqc0FwaVJlcG9ydGVyYCBhbHNvIHJlY2VpdmVzIHNwZWMgcmVzdWx0cywgYW5kIGlzIHVzZWQgYnkgYW55IGVudmlyb25tZW50IHRoYXQgbmVlZHMgdG8gZXh0cmFjdCB0aGUgcmVzdWx0cyAgZnJvbSBKYXZhU2NyaXB0LlxuXHRcdCAgICovXG5cdFx0ICBlbnYuYWRkUmVwb3J0ZXIoamFzbWluZUludGVyZmFjZS5qc0FwaVJlcG9ydGVyKTtcblxuXHRcdCAgLyoqXG5cdFx0ICAgKiBGaWx0ZXIgd2hpY2ggc3BlY3Mgd2lsbCBiZSBydW4gYnkgbWF0Y2hpbmcgdGhlIHN0YXJ0IG9mIHRoZSBmdWxsIG5hbWUgYWdhaW5zdCB0aGUgYHNwZWNgIHF1ZXJ5IHBhcmFtLlxuXHRcdCAgICovXG5cdFx0ICB2YXIgc3BlY0ZpbHRlciA9IG5ldyBqYXNtaW5lLkh0bWxTcGVjRmlsdGVyKHtcblx0XHQgICAgZmlsdGVyU3RyaW5nOiBmdW5jdGlvbigpIHsgcmV0dXJuIHF1ZXJ5U3RyaW5nLmdldFBhcmFtKFwic3BlY1wiKTsgfVxuXHRcdCAgfSk7XG5cblx0XHQgIGVudi5zcGVjRmlsdGVyID0gZnVuY3Rpb24oc3BlYykge1xuXHRcdCAgICByZXR1cm4gc3BlY0ZpbHRlci5tYXRjaGVzKHNwZWMuZ2V0RnVsbE5hbWUoKSk7XG5cdFx0ICB9O1xuXG5cdFx0ICAvKipcblx0XHQgICAqIFNldHRpbmcgdXAgdGltaW5nIGZ1bmN0aW9ucyB0byBiZSBhYmxlIHRvIGJlIG92ZXJyaWRkZW4uIENlcnRhaW4gYnJvd3NlcnMgKFNhZmFyaSwgSUUgOCwgcGhhbnRvbWpzKSByZXF1aXJlIHRoaXMgaGFjay5cblx0XHQgICAqL1xuXHRcdCAgd2luZG93LnNldFRpbWVvdXQgPSB3aW5kb3cuc2V0VGltZW91dDtcblx0XHQgIHdpbmRvdy5zZXRJbnRlcnZhbCA9IHdpbmRvdy5zZXRJbnRlcnZhbDtcblx0XHQgIHdpbmRvdy5jbGVhclRpbWVvdXQgPSB3aW5kb3cuY2xlYXJUaW1lb3V0O1xuXHRcdCAgd2luZG93LmNsZWFySW50ZXJ2YWwgPSB3aW5kb3cuY2xlYXJJbnRlcnZhbDtcblxuXHRcdCAgLyoqXG5cdFx0ICAgKiAjIyBFeGVjdXRpb25cblx0XHQgICAqXG5cdFx0ICAgKiBSZXBsYWNlIHRoZSBicm93c2VyIHdpbmRvdydzIGBvbmxvYWRgLCBlbnN1cmUgaXQncyBjYWxsZWQsIGFuZCB0aGVuIHJ1biBhbGwgb2YgdGhlIGxvYWRlZCBzcGVjcy4gVGhpcyBpbmNsdWRlcyBpbml0aWFsaXppbmcgdGhlIGBIdG1sUmVwb3J0ZXJgIGluc3RhbmNlIGFuZCB0aGVuIGV4ZWN1dGluZyB0aGUgbG9hZGVkIEphc21pbmUgZW52aXJvbm1lbnQuIEFsbCBvZiB0aGlzIHdpbGwgaGFwcGVuIGFmdGVyIGFsbCBvZiB0aGUgc3BlY3MgYXJlIGxvYWRlZC5cblx0XHQgICAqL1xuXHRcdCAgdmFyIGN1cnJlbnRXaW5kb3dPbmxvYWQgPSB3aW5kb3cub25sb2FkO1xuXG5cdFx0ICAoZnVuY3Rpb24oKSB7XG5cdFx0ICAgIGlmIChjdXJyZW50V2luZG93T25sb2FkKSB7XG5cdFx0ICAgICAgY3VycmVudFdpbmRvd09ubG9hZCgpO1xuXHRcdCAgICB9XG5cdFx0ICAgIGVudi5leGVjdXRlKCk7XG5cdFx0ICB9KSgpO1xuXG5cdFx0ICAvKipcblx0XHQgICAqIEhlbHBlciBmdW5jdGlvbiBmb3IgcmVhZGFiaWxpdHkgYWJvdmUuXG5cdFx0ICAgKi9cblx0XHQgIGZ1bmN0aW9uIGV4dGVuZChkZXN0aW5hdGlvbiwgc291cmNlKSB7XG5cdFx0ICAgIGZvciAodmFyIHByb3BlcnR5IGluIHNvdXJjZSkgZGVzdGluYXRpb25bcHJvcGVydHldID0gc291cmNlW3Byb3BlcnR5XTtcblx0XHQgICAgcmV0dXJuIGRlc3RpbmF0aW9uO1xuXHRcdCAgfVxuXG5cdFx0fSkoKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGFkZFJlcG9ydGVyKHNjb3BlKXtcblx0XHR2YXIgc3VpdGVzID0gW107XG5cdFx0dmFyIGN1cnJlbnRTdWl0ZSA9IHt9O1xuXG5cdFx0ZnVuY3Rpb24gU3VpdGUob2JqKXtcblx0XHRcdHRoaXMuaWQgPSBvYmouaWQ7XG5cdFx0XHR0aGlzLmRlc2NyaXB0aW9uID0gb2JqLmRlc2NyaXB0aW9uO1xuXHRcdFx0dGhpcy5mdWxsTmFtZSA9IG9iai5mdWxsTmFtZTtcblx0XHRcdHRoaXMuZmFpbGVkRXhwZWN0YXRpb25zID0gb2JqLmZhaWxlZEV4cGVjdGF0aW9ucztcblx0XHRcdHRoaXMuc3RhdHVzID0gb2JqLmZpbmlzaGVkO1xuXHRcdFx0dGhpcy5zcGVjcyA9IFtdO1xuXHRcdH1cblxuXHRcdHZhciBteVJlcG9ydGVyID0ge1xuXG5cdFx0XHRqYXNtaW5lU3RhcnRlZDogZnVuY3Rpb24ob3B0aW9ucyl7XG5cdFx0XHRcdGNvbnNvbGUubG9nKG9wdGlvbnMpO1xuXHRcdFx0XHRzdWl0ZXMgPSBbXTtcblx0XHRcdFx0c2NvcGUudG90YWxTcGVjcyA9IG9wdGlvbnMudG90YWxTcGVjc0RlZmluZWQ7XG5cdFx0XHR9LFxuXHRcdFx0c3VpdGVTdGFydGVkOiBmdW5jdGlvbihzdWl0ZSl7XG5cdFx0XHRcdGNvbnNvbGUubG9nKCd0aGlzIGlzIHRoZSBzdWl0ZSBzdGFydGVkJyk7XG5cdFx0XHRcdGNvbnNvbGUubG9nKHN1aXRlKTtcblx0XHRcdFx0c2NvcGUuc3VpdGVTdGFydGVkID0gc3VpdGU7XG5cdFx0XHRcdGN1cnJlbnRTdWl0ZSA9IG5ldyBTdWl0ZShzdWl0ZSk7XG5cdFx0XHR9LFxuXHRcdFx0c3BlY1N0YXJ0ZWQ6IGZ1bmN0aW9uKHNwZWMpe1xuXHRcdFx0XHRjb25zb2xlLmxvZygndGhpcyBpcyB0aGUgc3BlYyBzdGFydGVkJyk7XG5cdFx0XHRcdGNvbnNvbGUubG9nKHNwZWMpO1xuXHRcdFx0XHRzY29wZS5zcGVjU3RhcnRlZCA9IHNwZWM7XG5cdFx0XHR9LFxuXHRcdFx0c3BlY0RvbmU6IGZ1bmN0aW9uKHNwZWMpe1xuXHRcdFx0XHRjb25zb2xlLmxvZygndGhpcyBpcyB0aGUgc3BlYyBkb25lJyk7XG5cdFx0XHRcdGNvbnNvbGUubG9nKHNwZWMpO1xuXHRcdFx0XHRzY29wZS5zcGVjRG9uZSA9IHNwZWM7XG5cdFx0XHRcdGN1cnJlbnRTdWl0ZS5zcGVjcy5wdXNoKHNwZWMpO1xuXHRcdFx0fSxcblx0XHRcdHN1aXRlRG9uZTogZnVuY3Rpb24oc3VpdGUpe1xuXHRcdFx0XHRjb25zb2xlLmxvZygndGhpcyBpcyB0aGUgc3VpdGUgZG9uZScpO1xuXHRcdFx0XHRjb25zb2xlLmxvZyhzdWl0ZSk7XG5cdFx0XHRcdHNjb3BlLnN1aXRlRG9uZSA9IHN1aXRlO1xuXHRcdFx0XHRzdWl0ZXMucHVzaChjdXJyZW50U3VpdGUpO1xuXHRcdFx0fSxcblx0XHRcdGphc21pbmVEb25lOiBmdW5jdGlvbigpe1xuXHRcdFx0XHRjb25zb2xlLmxvZygnRmluaXNoZWQgc3VpdGUnKTtcblx0XHRcdFx0c2NvcGUuc3VpdGVzID0gc3VpdGVzO1xuXHRcdFx0fVxuXHRcdH07XG5cblx0XHR3aW5kb3cuamFzbWluZS5nZXRFbnYoKS5hZGRSZXBvcnRlcihteVJlcG9ydGVyKTtcblx0fVxuXG5cdHJldHVybiB7XG5cdFx0aW5pdGlhbGl6ZUphc21pbmUgOiBpbml0aWFsaXplSmFzbWluZSxcblx0XHRhZGRSZXBvcnRlcjogYWRkUmVwb3J0ZXJcblx0fTtcbn0pOyIsImFwcC5kaXJlY3RpdmUoJ2pzbG9hZCcsIGZ1bmN0aW9uKCl7XG5cdGZ1bmN0aW9uIHVwZGF0ZVNjcmlwdChlbGVtZW50LCB0ZXh0KXtcblx0XHRlbGVtZW50LmVtcHR5KCk7XG5cdFx0dmFyIHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xuXHRcdHNjcmlwdC50eXBlID0gJ3RleHQvamF2YXNjcmlwdCc7XG5cdFx0c2NyaXB0LmlubmVySFRNTCA9IHRleHQ7XG5cdFx0ZWxlbWVudC5hcHBlbmQoc2NyaXB0KTtcblx0fVxuXHRyZXR1cm4ge1xuXHRcdHJlc3RyaWN0IDogJ0UnLFxuXHRcdHNjb3BlIDoge1xuXHRcdFx0dGV4dCA6ICc9J1xuXHRcdH0sXG5cdFx0bGluayA6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRyaWJ1dGVzKXtcblx0XHRcdHNjb3BlLiR3YXRjaCgndGV4dCcsIGZ1bmN0aW9uKHRleHQpe1xuXHRcdFx0XHR1cGRhdGVTY3JpcHQoZWxlbWVudCwgdGV4dCk7XG5cdFx0XHR9KTtcblx0XHR9XG5cdH07XG59KTtcblxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9