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

	//passing this update function so that on text change in the directive the factory will be alerted
	$scope.updatefunc = function(newValue){
		ExercismFactory.setCodeScript(newValue);
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
			ngModel : '=',
			updatefunc: '='
		},
		link : function(scope, element, attribute){
			var updateText = function(){
				var newValue = myCodeMirror.getValue();
				scope.ngModel = newValue;
				scope.updatefunc(newValue);
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
		transclude: true,
		templateUrl : 'features/common/directives/jasmine-html-reporter/jasmine-html-reporter.html',
		link : function (scope, element, attribute){
			JasmineReporter.createJasmineReporter(element[0]);
			console.log()//children[0].env.execute();
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
		    (function(){
		    	if (currentWindowOnload) {
			      currentWindowOnload();
			    }
			    htmlReporter.initialize();

			    env.execute();
			})();
		    console.log(env.topSuite().children);
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
		}
	};
});


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImFjY291bnQvYWNjb3VudC5qcyIsImNoYWxsZW5nZS9jaGFsbGVuZ2UuanMiLCJjaGFsbGVuZ2UtY29kZS9jaGFsbGVuZ2UtY29kZS5qcyIsImNoYWxsZW5nZS1jb2RlL2NoYWxsZW5nZS1mb290ZXIuanMiLCJjaGFsbGVuZ2UtY29tcGlsZS9jaGFsbGVuZ2UtY29tcGlsZS5qcyIsImNoYWxsZW5nZS12aWV3L2NoYWxsZW5nZS12aWV3LmpzIiwiY2hhdHMvY2hhdHMuanMiLCJlcnJvci9lcnJvci5qcyIsImV4ZXJjaXNtL2V4ZXJjaXNtLmpzIiwiZXhlcmNpc20tY29kZS9leGVyY2lzbS1jb2RlLmpzIiwiZXhlcmNpc20tY29tcGlsZS9leGVyY2lzbS1jb21waWxlLmpzIiwiZXhlcmNpc20tdmlldy9leGVyY2lzbS12aWV3LmpzIiwiZXhlcmNpc20tdGVzdC9leGVyY2lzbS10ZXN0LmpzIiwibG9naW4vbG9naW4uanMiLCJzaWdudXAvc2lnbnVwLmpzIiwid2VsY29tZS93ZWxjb21lLmpzIiwiY29tbW9uL0F1dGhlbnRpY2F0aW9uL2F1dGhlbnRpY2F0aW9uLmpzIiwiY29tbW9uL2ZpbHRlcnMvZXhlcmNpc20tZm9ybWF0LW5hbWUuanMiLCJjb21tb24vZmlsdGVycy9tYXJrZWQuanMiLCJjb21tb24vZGlyZWN0aXZlcy9jb2RlbWlycm9yLWVkaXQvY29kZW1pcnJvci1lZGl0LmpzIiwiY29tbW9uL2RpcmVjdGl2ZXMvY29kZW1pcnJvci1yZWFkL2NvZGVtaXJyb3ItcmVhZC5qcyIsImNvbW1vbi9kaXJlY3RpdmVzL2phc21pbmUtaHRtbC1yZXBvcnRlci9qYXNtaW5lLWh0bWwtcmVwb3J0ZXIuanMiLCJjb21tb24vZGlyZWN0aXZlcy9qcy1sb2FkL2pzLWxvYWQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeEpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM5R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzlDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDekpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIElvbmljIFN0YXJ0ZXIgQXBwXG5cbi8vIGFuZ3VsYXIubW9kdWxlIGlzIGEgZ2xvYmFsIHBsYWNlIGZvciBjcmVhdGluZywgcmVnaXN0ZXJpbmcgYW5kIHJldHJpZXZpbmcgQW5ndWxhciBtb2R1bGVzXG4vLyAnc3RhcnRlcicgaXMgdGhlIG5hbWUgb2YgdGhpcyBhbmd1bGFyIG1vZHVsZSBleGFtcGxlIChhbHNvIHNldCBpbiBhIDxib2R5PiBhdHRyaWJ1dGUgaW4gaW5kZXguaHRtbClcbi8vIHRoZSAybmQgcGFyYW1ldGVyIGlzIGFuIGFycmF5IG9mICdyZXF1aXJlcydcbi8vICdzdGFydGVyLnNlcnZpY2VzJyBpcyBmb3VuZCBpbiBzZXJ2aWNlcy5qc1xuLy8gJ3N0YXJ0ZXIuY29udHJvbGxlcnMnIGlzIGZvdW5kIGluIGNvbnRyb2xsZXJzLmpzXG52YXIgYXBwID0gYW5ndWxhci5tb2R1bGUoJ21pZGUnLCBbJ2lvbmljJ10pXG5cbi5ydW4oZnVuY3Rpb24oJGlvbmljUGxhdGZvcm0pIHtcbiAgJGlvbmljUGxhdGZvcm0ucmVhZHkoZnVuY3Rpb24oKSB7XG4gICAgLy8gSGlkZSB0aGUgYWNjZXNzb3J5IGJhciBieSBkZWZhdWx0IChyZW1vdmUgdGhpcyB0byBzaG93IHRoZSBhY2Nlc3NvcnkgYmFyIGFib3ZlIHRoZSBrZXlib2FyZFxuICAgIC8vIGZvciBmb3JtIGlucHV0cylcbiAgICAvLyAkbG9jYXRpb25Qcm92aWRlci5odG1sNU1vZGUodHJ1ZSk7XG4gICAgaWYgKHdpbmRvdy5jb3Jkb3ZhICYmIHdpbmRvdy5jb3Jkb3ZhLnBsdWdpbnMgJiYgd2luZG93LmNvcmRvdmEucGx1Z2lucy5LZXlib2FyZCkge1xuICAgICAgICBjb25zb2xlLmxvZyhcImRvZXMgcmVnIHdpbmRvdyB3b3JrP1wiKTtcbiAgICAgIGNvcmRvdmEucGx1Z2lucy5LZXlib2FyZC5oaWRlS2V5Ym9hcmRBY2Nlc3NvcnlCYXIodHJ1ZSk7XG4gICAgICBjb3Jkb3ZhLnBsdWdpbnMuS2V5Ym9hcmQuZGlzYWJsZVNjcm9sbCh0cnVlKTtcbiAgICB9XG4gICAgaWYgKHdpbmRvdy5TdGF0dXNCYXIpIHtcbiAgICAgIC8vIG9yZy5hcGFjaGUuY29yZG92YS5zdGF0dXNiYXIgcmVxdWlyZWRcbiAgICAgIFN0YXR1c0Jhci5zdHlsZUxpZ2h0Q29udGVudCgpO1xuICAgIH1cbiAgfSk7XG59KVxuXG4vL1RPRE86VGhpcyBpcyBuZWVkZWQgdG8gc2V0IHRvIGFjY2VzcyB0aGUgcHJveHkgdXJsIHRoYXQgd2lsbCB0aGVuIGluIHRoZSBpb25pYy5wcm9qZWN0IGZpbGUgcmVkaXJlY3QgaXQgdG8gdGhlIGNvcnJlY3QgVVJMXG4uY29uc3RhbnQoJ0FwaUVuZHBvaW50Jywge1xuICB1cmwgOiAnL2FwaScsXG4gIHNlc3Npb246ICcvc2Vzc2lvbidcbn0pXG5cbi5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlcikge1xuICAvLyBJb25pYyB1c2VzIEFuZ3VsYXJVSSBSb3V0ZXIgd2hpY2ggdXNlcyB0aGUgY29uY2VwdCBvZiBzdGF0ZXNcbiAgLy8gTGVhcm4gbW9yZSBoZXJlOiBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci11aS91aS1yb3V0ZXJcbiAgLy8gU2V0IHVwIHRoZSB2YXJpb3VzIHN0YXRlcyB3aGljaCB0aGUgYXBwIGNhbiBiZSBpbi5cbiAgLy8gRWFjaCBzdGF0ZSdzIGNvbnRyb2xsZXIgY2FuIGJlIGZvdW5kIGluIGNvbnRyb2xsZXJzLmpzXG4gIC8vIGlmIG5vbmUgb2YgdGhlIGFib3ZlIHN0YXRlcyBhcmUgbWF0Y2hlZCwgdXNlIHRoaXMgYXMgdGhlIGZhbGxiYWNrXG4gIC8vICR1cmxSb3V0ZXJQcm92aWRlci5vdGhlcndpc2UoJy9jaGFsbGVuZ2UvdmlldycpOyAvL1RPRE86IEFsYmVydCB0ZXN0aW5nIHRoaXMgcm91dGVcblxuICAkdXJsUm91dGVyUHJvdmlkZXIub3RoZXJ3aXNlKCcvd2VsY29tZScpOyAvLyBUT0RPOiBSaWNoYXJkIHRlc3RpbmcgdGhpcyByb3V0ZVxuICAvLyR1cmxSb3V0ZXJQcm92aWRlci5vdGhlcndpc2UoJy90YWIvY2hhbGxlbmdlJyk7IC8vVE9ETzogVG9ueSB0ZXN0aW5nIHRoaXMgcm91dGVcbiAgLy8gJHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZSgnd2VsY29tZScpO1xuXG59KVxuLy9cblxuLy8vL3J1biBibG9ja3M6IGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMjA2NjMwNzYvYW5ndWxhcmpzLWFwcC1ydW4tZG9jdW1lbnRhdGlvblxuLy9Vc2UgcnVuIG1ldGhvZCB0byByZWdpc3RlciB3b3JrIHdoaWNoIHNob3VsZCBiZSBwZXJmb3JtZWQgd2hlbiB0aGUgaW5qZWN0b3IgaXMgZG9uZSBsb2FkaW5nIGFsbCBtb2R1bGVzLlxuLy9odHRwOi8vZGV2ZGFjdGljLmNvbS91c2VyLWF1dGgtYW5ndWxhcmpzLWlvbmljL1xuXG4ucnVuKGZ1bmN0aW9uICgkcm9vdFNjb3BlLCAkc3RhdGUsIEF1dGhTZXJ2aWNlLCBBVVRIX0VWRU5UUykge1xuXG4gICAgdmFyIGRlc3RpbmF0aW9uU3RhdGVSZXF1aXJlc0F1dGggPSBmdW5jdGlvbiAoc3RhdGUpIHtcbiAgICAgICAgLy9jb25zb2xlLmxvZygnY2wgLSBkZXN0aW5hdGlvblN0YXRlUmVxdWlyZXNBdXRoJywnc3RhdGUuZGF0YScsc3RhdGUuZGF0YSwnc3RhdGUuZGF0YS5hdXRoJyxzdGF0ZS5kYXRhLmF1dGhlbnRpY2F0ZSk7XG4gICAgICAgIHJldHVybiBzdGF0ZS5kYXRhICYmIHN0YXRlLmRhdGEuYXV0aGVudGljYXRlO1xuICAgIH07XG4gICBcbiAgICAvL1RPRE86IE5lZWQgdG8gbWFrZSBhdXRoZW50aWNhdGlvbiBtb3JlIHJvYnVzdCBiZWxvdyBkb2VzIG5vdCBmb2xsb3cgRlNHIChldC4gYWwuKVxuICAgIC8vVE9ETzogQ3VycmVudGx5IGl0IGlzIG5vdCBjaGVja2luZyB0aGUgYmFja2VuZCByb3V0ZSByb3V0ZXIuZ2V0KCcvdG9rZW4nKVxuICAgICRyb290U2NvcGUuJG9uKCckc3RhdGVDaGFuZ2VTdGFydCcsIGZ1bmN0aW9uIChldmVudCx0b1N0YXRlLCB0b1BhcmFtcykge1xuXG4gICAgICAgIC8vY29uc29sZS5sb2coJ3VzZXIgQXV0aGVudGljYXRlZCcsIEF1dGhTZXJ2aWNlLmlzQXV0aGVudGljYXRlZCgpKTtcblxuICAgICAgICBpZiAoIWRlc3RpbmF0aW9uU3RhdGVSZXF1aXJlc0F1dGgodG9TdGF0ZSkpIHtcbiAgICAgICAgICAgIC8vIFRoZSBkZXN0aW5hdGlvbiBzdGF0ZSBkb2VzIG5vdCByZXF1aXJlIGF1dGhlbnRpY2F0aW9uXG4gICAgICAgICAgICAvLyBTaG9ydCBjaXJjdWl0IHdpdGggcmV0dXJuLlxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKEF1dGhTZXJ2aWNlLmlzQXV0aGVudGljYXRlZCgpKSB7XG4gICAgICAgICAgICAvLyBUaGUgdXNlciBpcyBhdXRoZW50aWNhdGVkLlxuICAgICAgICAgICAgLy8gU2hvcnQgY2lyY3VpdCB3aXRoIHJldHVybi5cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vVE9ETzogTm90IHN1cmUgaG93IHRvIHByb2NlZWQgaGVyZVxuICAgICAgICAkc3RhdGUuZ28oJ2xvZ2luJyk7IC8vaWYgYWJvdmUgZmFpbHMsIGdvdG8gbG9naW5cbiAgICB9KTtcbiAgLy8gJHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZSgnL3NpZ251cCcpOyAvLyBUT0RPOiBSaWNoYXJkIHRlc3RpbmcgdGhpcyByb3V0ZVxuICAvLyR1cmxSb3V0ZXJQcm92aWRlci5vdGhlcndpc2UoJy9jaGFsbGVuZ2UvdmlldycpOyAvL1RPRE86IFRvbnkgdGVzdGluZyB0aGlzIHJvdXRlXG5cbn0pO1xuXG5hcHAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKXtcbiAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdtYWluJywge1xuICAgICAgIHRlbXBsYXRlVXJsOiAnZmVhdHVyZXMvY29tbW9uL21haW4vbWFpbi5odG1sJyxcbiAgICAgICBjb250cm9sbGVyOiAnTWVudUN0cmwnXG4gICB9KTtcbn0pO1xuXG5hcHAuY29udHJvbGxlcignTWFpbkN0cmwnLCBmdW5jdGlvbigkcm9vdFNjb3BlLCRzY29wZSwgJGlvbmljU2lkZU1lbnVEZWxlZ2F0ZSwgJGlvbmljUG9wdXAsICRzdGF0ZSwgQXV0aFNlcnZpY2UsQVVUSF9FVkVOVFMpe1xuICAgICRzY29wZS51c2VybmFtZSA9IEF1dGhTZXJ2aWNlLnVzZXJuYW1lKCk7XG4gICAgLy9jb25zb2xlLmxvZyhBdXRoU2VydmljZS5pc0F1dGhlbnRpY2F0ZWQoKSk7XG5cbiAgICAkc2NvcGUuJG9uKEFVVEhfRVZFTlRTLm5vdEF1dGhvcml6ZWQsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgIHZhciBhbGVydFBvcHVwID0gJGlvbmljUG9wdXAuYWxlcnQoe1xuICAgICAgICAgICAgdGl0bGU6ICdVbmF1dGhvcml6ZWQhJyxcbiAgICAgICAgICAgIHRlbXBsYXRlOiAnWW91IGFyZSBub3QgYWxsb3dlZCB0byBhY2Nlc3MgdGhpcyByZXNvdXJjZS4nXG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgJHNjb3BlLiRvbihBVVRIX0VWRU5UUy5ub3RBdXRoZW50aWNhdGVkLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICBBdXRoU2VydmljZS5sb2dvdXQoKTtcbiAgICAgICAgLy8kc3RhdGUuZ28oJ2xvZ2luJyk7XG4gICAgICAgIHZhciBhbGVydFBvcHVwID0gJGlvbmljUG9wdXAuYWxlcnQoe1xuICAgICAgICAgICAgdGl0bGU6ICdQbGVhc2UgUmV2aWV3JyxcbiAgICAgICAgICAgIHRlbXBsYXRlOiAnJ1xuICAgICAgICB9KTtcbiAgICB9KTtcbn0pO1xuXG5hcHAuY29udHJvbGxlcignTWVudUN0cmwnLCBmdW5jdGlvbigkc2NvcGUsICRpb25pY1NpZGVNZW51RGVsZWdhdGUsICRzdGF0ZSwgQXV0aFNlcnZpY2UsICRyb290U2NvcGUpe1xuXG4gICAgJHNjb3BlLnN0YXRlcyA9IFtcbiAgICAgICAge1xuICAgICAgICAgIG5hbWUgOiAnQWNjb3VudCcsXG4gICAgICAgICAgcmVmIDogZnVuY3Rpb24oKXtyZXR1cm4gJ2FjY291bnQnO31cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIG5hbWUgOiAnQ2hhbGxlbmdlJyxcbiAgICAgICAgICByZWYgOiBmdW5jdGlvbigpe3JldHVybiAnY2hhbGxlbmdlLnZpZXcnO31cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIG5hbWUgOiAnQ2hhdHMnLFxuICAgICAgICAgIHJlZjogZnVuY3Rpb24oKXtyZXR1cm4gJ2NoYXRzJzt9XG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBuYW1lIDogJ0V4ZXJjaXNtJyxcbiAgICAgICAgICByZWY6IGZ1bmN0aW9uKCl7cmV0dXJuICdleGVyY2lzbS52aWV3Jzt9XG4gICAgICAgIH1cbiAgICBdO1xuXG4gICAgJHNjb3BlLnRvZ2dsZU1lbnVTaG93ID0gZnVuY3Rpb24oKXtcbiAgICAgICAgcmV0dXJuIEF1dGhTZXJ2aWNlLmlzQXV0aGVudGljYXRlZCgpO1xuICAgIH07XG5cbiAgICAkcm9vdFNjb3BlLiRvbignQXV0aCcsZnVuY3Rpb24oKXtcbiAgICAgICAkc2NvcGUudG9nZ2xlTWVudVNob3coKTtcbiAgICB9KTtcblxuICAgIC8vY29uc29sZS5sb2coQXV0aFNlcnZpY2UuaXNBdXRoZW50aWNhdGVkKCkpO1xuICAgIC8vaWYoQXV0aFNlcnZpY2UuaXNBdXRoZW50aWNhdGVkKCkpe1xuICAgICRzY29wZS5jbGlja0l0ZW0gPSBmdW5jdGlvbihzdGF0ZVJlZil7XG4gICAgICAgICRpb25pY1NpZGVNZW51RGVsZWdhdGUudG9nZ2xlTGVmdCgpO1xuICAgICAgICAkc3RhdGUuZ28oc3RhdGVSZWYoKSk7IC8vUkI6IFVwZGF0ZWQgdG8gaGF2ZSBzdGF0ZVJlZiBhcyBhIGZ1bmN0aW9uIGluc3RlYWQuXG4gICAgfTtcblxuICAgICRzY29wZS50b2dnbGVNZW51ID0gZnVuY3Rpb24oKXtcbiAgICAgICAgJGlvbmljU2lkZU1lbnVEZWxlZ2F0ZS50b2dnbGVMZWZ0KCk7XG4gICAgfTtcbiAgICAvL31cbn0pOyIsImFwcC5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIsIFVTRVJfUk9MRVMpe1xuXHQvLyBFYWNoIHRhYiBoYXMgaXRzIG93biBuYXYgaGlzdG9yeSBzdGFjazpcblx0JHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2FjY291bnQnLCB7XG5cdFx0dXJsOiAnL2FjY291bnQnLFxuXHQgICAgdGVtcGxhdGVVcmw6ICdmZWF0dXJlcy9hY2NvdW50L2FjY291bnQuaHRtbCcsXG5cdFx0Y29udHJvbGxlcjogJ0FjY291bnRDdHJsJ1xuXHRcdC8vICxcblx0XHQvLyBkYXRhOiB7XG5cdFx0Ly8gXHRhdXRoZW50aWNhdGU6IFtVU0VSX1JPTEVTLnB1YmxpY11cblx0XHQvLyB9XG5cdH0pO1xufSk7XG5cbmFwcC5jb250cm9sbGVyKCdBY2NvdW50Q3RybCcsIGZ1bmN0aW9uKCRzY29wZSkge1xuXHQkc2NvcGUuc2V0dGluZ3MgPSB7XG5cdFx0ZW5hYmxlRnJpZW5kczogdHJ1ZVxuXHR9O1xufSk7IiwiYXBwLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlcil7XG5cdCRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdjaGFsbGVuZ2UnLCB7XG5cdFx0dGVtcGxhdGVVcmwgOiAnZmVhdHVyZXMvY2hhbGxlbmdlL2NoYWxsZW5nZS5odG1sJyxcblx0XHRhYnN0cmFjdCA6IHRydWVcblx0fSk7XG59KTtcblxuYXBwLmZhY3RvcnkoJ0NoYWxsZW5nZUZhY3RvcnknLCBmdW5jdGlvbigkaHR0cCwgQXBpRW5kcG9pbnQsICRyb290U2NvcGUsICRzdGF0ZSl7XG5cblx0dmFyIHByb2JsZW0gPSAnJztcblx0dmFyIHN1Ym1pc3Npb24gPSAnJztcblxuXHR2YXIgcnVuSGlkZGVuID0gZnVuY3Rpb24oY29kZSkge1xuXHQgICAgdmFyIGluZGV4ZWREQiA9IG51bGw7XG5cdCAgICB2YXIgbG9jYXRpb24gPSBudWxsO1xuXHQgICAgdmFyIG5hdmlnYXRvciA9IG51bGw7XG5cdCAgICB2YXIgb25lcnJvciA9IG51bGw7XG5cdCAgICB2YXIgb25tZXNzYWdlID0gbnVsbDtcblx0ICAgIHZhciBwZXJmb3JtYW5jZSA9IG51bGw7XG5cdCAgICB2YXIgc2VsZiA9IG51bGw7XG5cdCAgICB2YXIgd2Via2l0SW5kZXhlZERCID0gbnVsbDtcblx0ICAgIHZhciBwb3N0TWVzc2FnZSA9IG51bGw7XG5cdCAgICB2YXIgY2xvc2UgPSBudWxsO1xuXHQgICAgdmFyIG9wZW5EYXRhYmFzZSA9IG51bGw7XG5cdCAgICB2YXIgb3BlbkRhdGFiYXNlU3luYyA9IG51bGw7XG5cdCAgICB2YXIgd2Via2l0UmVxdWVzdEZpbGVTeXN0ZW0gPSBudWxsO1xuXHQgICAgdmFyIHdlYmtpdFJlcXVlc3RGaWxlU3lzdGVtU3luYyA9IG51bGw7XG5cdCAgICB2YXIgd2Via2l0UmVzb2x2ZUxvY2FsRmlsZVN5c3RlbVN5bmNVUkwgPSBudWxsO1xuXHQgICAgdmFyIHdlYmtpdFJlc29sdmVMb2NhbEZpbGVTeXN0ZW1VUkwgPSBudWxsO1xuXHQgICAgdmFyIGFkZEV2ZW50TGlzdGVuZXIgPSBudWxsO1xuXHQgICAgdmFyIGRpc3BhdGNoRXZlbnQgPSBudWxsO1xuXHQgICAgdmFyIHJlbW92ZUV2ZW50TGlzdGVuZXIgPSBudWxsO1xuXHQgICAgdmFyIGR1bXAgPSBudWxsO1xuXHQgICAgdmFyIG9ub2ZmbGluZSA9IG51bGw7XG5cdCAgICB2YXIgb25vbmxpbmUgPSBudWxsO1xuXHQgICAgdmFyIGltcG9ydFNjcmlwdHMgPSBudWxsO1xuXHQgICAgdmFyIGNvbnNvbGUgPSBudWxsO1xuXHQgICAgdmFyIGFwcGxpY2F0aW9uID0gbnVsbDtcblxuXHQgICAgcmV0dXJuIGV2YWwoY29kZSk7XG5cdH07XG5cblx0Ly8gY29udmVydHMgdGhlIG91dHB1dCBpbnRvIGEgc3RyaW5nXG5cdHZhciBzdHJpbmdpZnkgPSBmdW5jdGlvbihvdXRwdXQpIHtcblx0ICAgIHZhciByZXN1bHQ7XG5cblx0ICAgIGlmICh0eXBlb2Ygb3V0cHV0ID09ICd1bmRlZmluZWQnKSB7XG5cdCAgICAgICAgcmVzdWx0ID0gJ3VuZGVmaW5lZCc7XG5cdCAgICB9IGVsc2UgaWYgKG91dHB1dCA9PT0gbnVsbCkge1xuXHQgICAgICAgIHJlc3VsdCA9ICdudWxsJztcblx0ICAgIH0gZWxzZSB7XG5cdCAgICAgICAgcmVzdWx0ID0gSlNPTi5zdHJpbmdpZnkob3V0cHV0KSB8fCBvdXRwdXQudG9TdHJpbmcoKTtcblx0ICAgIH1cblxuXHQgICAgcmV0dXJuIHJlc3VsdDtcblx0fTtcblxuXHR2YXIgcnVuID0gZnVuY3Rpb24oY29kZSkge1xuXHQgICAgdmFyIHJlc3VsdCA9IHtcblx0ICAgICAgICBpbnB1dDogY29kZSxcblx0ICAgICAgICBvdXRwdXQ6IG51bGwsXG5cdCAgICAgICAgZXJyb3I6IG51bGxcblx0ICAgIH07XG5cblx0ICAgIHRyeSB7XG5cdCAgICAgICAgcmVzdWx0Lm91dHB1dCA9IHN0cmluZ2lmeShydW5IaWRkZW4oY29kZSkpO1xuXHQgICAgfSBjYXRjaChlKSB7XG5cdCAgICAgICAgcmVzdWx0LmVycm9yID0gZS5tZXNzYWdlO1xuXHQgICAgfVxuXHQgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9O1xuXG5cblx0cmV0dXJuIHtcblx0XHRnZXRDaGFsbGVuZ2UgOiBmdW5jdGlvbihpZCl7XG5cdFx0XHRyZXR1cm4gJGh0dHAuZ2V0KEFwaUVuZHBvaW50LnVybCArICcvY2hhbGxlbmdlLycgKyBpZCkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG5cdFx0XHRcdHByb2JsZW0gPSByZXNwb25zZS5kYXRhO1xuXHRcdFx0XHRzdWJtaXNzaW9uID0gcHJvYmxlbS5zZXNzaW9uLnNldHVwIHx8ICcnO1xuXHRcdFx0XHQkcm9vdFNjb3BlLiRicm9hZGNhc3QoJ3Byb2JsZW1VcGRhdGVkJyk7XG5cdFx0XHRcdHJldHVybiByZXNwb25zZS5kYXRhO1xuXHRcdFx0fSk7XG5cdFx0fSxcblx0XHRzZXRTdWJtaXNzaW9uIDogZnVuY3Rpb24oY29kZSl7XG5cdFx0XHRzdWJtaXNzaW9uID0gY29kZTtcblx0XHRcdCRyb290U2NvcGUuJGJyb2FkY2FzdCgnc3VibWlzc2lvblVwZGF0ZWQnKTtcblx0XHR9LFxuXHRcdGNvbXBpbGVTdWJtaXNzaW9uOiBmdW5jdGlvbihjb2RlKXtcblx0XHRcdHJldHVybiBydW4oY29kZSk7XG5cdFx0fSxcblx0XHRnZXRTdWJtaXNzaW9uIDogZnVuY3Rpb24oKXtcblx0XHRcdHJldHVybiBzdWJtaXNzaW9uO1xuXHRcdH0sXG5cdFx0Z2V0UHJvYmxlbSA6IGZ1bmN0aW9uKCl7XG5cdFx0XHRyZXR1cm4gcHJvYmxlbTtcblx0XHR9XG5cdH07XG59KTsiLCJhcHAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKXtcblx0JHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2NoYWxsZW5nZS5jb2RlJywge1xuXHRcdHVybCA6ICcvY2hhbGxlbmdlL2NvZGUnLFxuXHRcdHZpZXdzOiB7XG5cdFx0XHQndGFiLWNvZGUnIDoge1xuXHRcdFx0XHR0ZW1wbGF0ZVVybCA6ICdmZWF0dXJlcy9jaGFsbGVuZ2UtY29kZS9jaGFsbGVuZ2UtY29kZS5odG1sJyxcblx0XHRcdFx0Y29udHJvbGxlciA6ICdDaGFsbGVuZ2VDb2RlQ3RybCdcblx0XHRcdH1cblx0XHR9XG5cdFx0Ly8gLFxuXHRcdC8vIG9uRW50ZXIgOiBmdW5jdGlvbihDaGFsbGVuZ2VGYWN0b3J5LCAkc3RhdGUpe1xuXHRcdC8vIFx0aWYoQ2hhbGxlbmdlRmFjdG9yeS5nZXRQcm9ibGVtKCkubGVuZ3RoID09PSAwKXtcblx0XHQvLyBcdFx0JHN0YXRlLmdvKCdjaGFsbGVuZ2UudmlldycpO1xuXHRcdC8vIFx0fVxuXHRcdC8vIH1cblx0fSk7XG59KTtcblxuYXBwLmNvbnRyb2xsZXIoJ0NoYWxsZW5nZUNvZGVDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCAkc3RhdGUsICRyb290U2NvcGUsIENoYWxsZW5nZUZhY3RvcnksIENoYWxsZW5nZUZvb3RlckZhY3Rvcnkpe1xuXG5cdHNldFRpbWVvdXQoZnVuY3Rpb24gKCl7XG5cdFx0JHNjb3BlLmtleWJvYXJkVmlzID0gd2luZG93LmNvcmRvdmEucGx1Z2lucy5LZXlib2FyZC5pc1Zpc2libGU7XG5cdFx0XHRjb25zb2xlLmxvZyhcImNvcmRvdmEgaXN2aXNcIiwgd2luZG93LmNvcmRvdmEucGx1Z2lucy5LZXlib2FyZC5pc1Zpc2libGUpO1xuXHRcdFx0Y29uc29sZS5sb2coXCIkc2NvcGUga2V5Ym9hcmRWaXNcIiwgJHNjb3BlLmtleWJvYXJkVmlzKTtcblxuXG5cdFx0aWYgKHdpbmRvdy5jb3Jkb3ZhICYmIHdpbmRvdy5jb3Jkb3ZhLnBsdWdpbnMgJiYgd2luZG93LmNvcmRvdmEucGx1Z2lucy5LZXlib2FyZCkge1xuXHRcdFx0Y29uc29sZS5sb2coXCJnb3QgaW4gaGVyZVwiKTtcblx0XHQgIHdpbmRvdy5jb3Jkb3ZhLnBsdWdpbnMuS2V5Ym9hcmQuaGlkZUtleWJvYXJkQWNjZXNzb3J5QmFyKHRydWUpO1xuXHRcdCAgd2luZG93LmNvcmRvdmEucGx1Z2lucy5LZXlib2FyZC5kaXNhYmxlU2Nyb2xsKHRydWUpO1xuXHRcdH1cblx0fSwgNTAwKTtcblxuXHQkc2NvcGUuZm9vdGVySG90a2V5cyA9IENoYWxsZW5nZUZvb3RlckZhY3RvcnkuZ2V0SG90a2V5cygpO1xuXG5cdC8vQ2hhbGxlbmdlIFN1Ym1pdFxuXHQkc2NvcGUudGV4dCA9IENoYWxsZW5nZUZhY3RvcnkuZ2V0U3VibWlzc2lvbigpIHx8ICd0ZXh0JztcblxuXHQvL2luaXRpYWxpemUgQ29kZU1pcnJvclxuXHR2YXIgbXlDb2RlTWlycm9yID0gQ29kZU1pcnJvci5mcm9tVGV4dEFyZWEoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvZGUnKSwge1xuXHRcdGxpbmVOdW1iZXJzIDogdHJ1ZSxcblx0XHRtb2RlOiAnamF2YXNjcmlwdCcsXG5cdFx0YXV0b2ZvY3VzIDogdHJ1ZSxcblx0XHR0aGVtZSA6ICd0d2lsaWdodCcsXG5cdFx0bGluZVdyYXBwaW5nOiB0cnVlXG5cdH0pO1xuXG5cdG15Q29kZU1pcnJvci5yZXBsYWNlU2VsZWN0aW9uKCRzY29wZS50ZXh0KTtcblxuXHQkc2NvcGUudXBkYXRlVGV4dCA9IGZ1bmN0aW9uKCl7XG5cdFx0JHNjb3BlLnRleHQgPSBteUNvZGVNaXJyb3IuZ2V0VmFsdWUoKTtcblx0XHQvL2NoZWNrIGlmIGRpZ2VzdCBpcyBpbiBwcm9ncmVzc1xuXHRcdGlmKCEkc2NvcGUuJCRwaGFzZSkge1xuXHRcdCAgJHNjb3BlLiRhcHBseSgpO1xuXHRcdH1cblx0fTtcblxuXHQkc2NvcGUuaW5zZXJ0RnVuYyA9IGZ1bmN0aW9uKHBhcmFtKXtcblx0XHQvL2dpdmVuIGEgcGFyYW0sIHdpbGwgaW5zZXJ0IGNoYXJhY3RlcnMgd2hlcmUgY3Vyc29yIGlzXG5cdFx0Y29uc29sZS5sb2coXCJpbnNlcnRpbmc6IFwiLCBwYXJhbSk7XG5cdFx0bXlDb2RlTWlycm9yLnJlcGxhY2VTZWxlY3Rpb24ocGFyYW0pO1xuXHRcdC8vIHdpbmRvdy5jb3Jkb3ZhLnBsdWdpbnMuS2V5Ym9hcmQuc2hvdygpO1xuXHRcdG15Q29kZU1pcnJvci5mb2N1cygpO1xuXHR9O1xuXG4gICAgbXlDb2RlTWlycm9yLm9uKFwiY2hhbmdlXCIsIGZ1bmN0aW9uIChteUNvZGVNaXJyb3IsIGNoYW5nZU9iail7XG4gICAgXHQkc2NvcGUudXBkYXRlVGV4dCgpO1xuICAgIH0pO1xuICAgIC8vIG15Q29kZU1pcnJvci5vbihcImN1cnNvckFjdGl2aXR5XCIsIGZ1bmN0aW9uIChteUNvZGVNaXJyb3IsIGNoYW5nZU9iail7XG4gICAgLy8gXHR3aW5kb3cuY29yZG92YS5wbHVnaW5zLktleWJvYXJkLnNob3coKTtcbiAgICAvLyBcdCRzY29wZS5rZXlib2FyZFZpcyA9IHRydWU7XG4gICAgLy8gXHQkc2NvcGUuJGFwcGx5KCk7XG4gICAgLy8gfSk7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJuYXRpdmUua2V5Ym9hcmRzaG93XCIsIGZ1bmN0aW9uICgpe1xuICAgIFx0JHNjb3BlLmtleWJvYXJkVmlzID0gdHJ1ZTtcbiAgICBcdCRzY29wZS4kYXBwbHkoKTtcbiAgICB9KTtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIm5hdGl2ZS5rZXlib2FyZGhpZGVcIiwgZnVuY3Rpb24gKCl7XG4gICAgXHQkc2NvcGUua2V5Ym9hcmRWaXMgPSBmYWxzZTtcbiAgICBcdCRzY29wZS4kYXBwbHkoKTtcbiAgICB9KTtcblxuICAgIC8vIG15Q29kZU1pcnJvci5vZmYoXCJmb2N1c1wiLCBmdW5jdGlvbiAobXlDb2RlTWlycm9yLCBjaGFuZ2VPYmope1xuICAgIC8vIFx0JHNjb3BlLmtleWJvYXJkVmlzID0gJHdpbmRvdy5jb3Jkb3ZhLnBsdWdpbnMuS2V5Ym9hcmQuaXNWaXNpYmxlO1xuICAgIC8vIH0pO1xuXHRcblxuXHQkc2NvcGUuYnV0dG9ucyA9IHtcblx0XHRjb21waWxlIDogJ0NvbXBpbGUnLFxuXHRcdGRpc21pc3MgOiAnRGlzbWlzcydcblx0fTtcblxuXHQvLyAkcm9vdFNjb3BlLiRvbigncHJvYmxlbVVwZGF0ZWQnLCBmdW5jdGlvbihlKXtcblx0Ly8gXHQkc2NvcGUucHJvamVjdElkID0gQ2hhbGxlbmdlRmFjdG9yeS5nZXRQcm9ibGVtKCkuc2Vzc2lvbi5wcm9qZWN0SWQ7XG5cdC8vIFx0JHNjb3BlLnNvbHV0aW9uSWQgPSBDaGFsbGVuZ2VGYWN0b3J5LmdldFByb2JsZW0oKS5zZXNzaW9uLnNvbHV0aW9uSWQ7XG5cdC8vIFx0JHNjb3BlLnRleHQgPSBDaGFsbGVuZ2VGYWN0b3J5LmdldFByb2JsZW0oKS5zZXNzaW9uLnNldHVwO1xuXHQvLyB9KTtcblxuXHQkc2NvcGUuY29tcGlsZUNoYWxsZW5nZSA9IGZ1bmN0aW9uKHRleHQpe1xuXHRcdENoYWxsZW5nZUZhY3Rvcnkuc2V0U3VibWlzc2lvbih0ZXh0KTtcblx0XHQkc3RhdGUuZ28oJ2NoYWxsZW5nZS5jb21waWxlJyk7XG5cdH07XG5cblx0Ly8gJHNjb3BlLmRpc21pc3NDaGFsbGVuZ2UgPSBmdW5jdGlvbigpe1xuXHQvLyBcdHZhciBpZCA9ICdBOVFLazZTbVJwRGNyaVUtSE1Rcic7XG5cdC8vIFx0Q2hhbGxlbmdlRmFjdG9yeS5nZXRDaGFsbGVuZ2UoaWQpLnRoZW4oZnVuY3Rpb24oZGF0YSl7XG5cdC8vIFx0XHQkc3RhdGUuZ28oJ2NoYWxsZW5nZS52aWV3Jyk7XG5cdC8vIFx0fSk7XG5cdC8vIH07XG5cbn0pOyIsImFwcC5mYWN0b3J5KCdDaGFsbGVuZ2VGb290ZXJGYWN0b3J5JywgZnVuY3Rpb24oKXtcblxuXHR2YXIgZm9vdGVySG90a2V5cyA9IFtcblx0XHR7XG5cdFx0XHRkaXNwbGF5OiBcIlsgXVwiLFxuXHRcdFx0aW5zZXJ0UGFyYW06IFwiW11cIlxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0ZGlzcGxheTogXCJ7IH1cIixcblx0XHRcdGluc2VydFBhcmFtOiBcInt9XCJcblx0XHR9LFxuXHRcdHtcblx0XHRcdGRpc3BsYXk6IFwiKCApXCIsXG5cdFx0XHRpbnNlcnRQYXJhbTogXCIoKVwiXG5cdFx0fSxcblx0XHR7XG5cdFx0XHRkaXNwbGF5OiBcIi8vXCIsXG5cdFx0XHRpbnNlcnRQYXJhbTogXCIvL1wiXG5cdFx0fSxcblx0XHR7XG5cdFx0XHRkaXNwbGF5OiBcIj1cIixcblx0XHRcdGluc2VydFBhcmFtOiBcIj1cIlxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0ZGlzcGxheTogXCI8XCIsXG5cdFx0XHRpbnNlcnRQYXJhbTogXCI8XCJcblx0XHR9LFxuXHRcdHtcblx0XHRcdGRpc3BsYXk6IFwiPlwiLFxuXHRcdFx0aW5zZXJ0UGFyYW06IFwiPlwiXG5cdFx0fSxcblx0XHR7XG5cdFx0XHRkaXNwbGF5OiBcIi8qICAqL1wiLFxuXHRcdFx0aW5zZXJ0UGFyYW06IFwiLyogKi9cIlxuXHRcdH0sXG5cblx0XTtcblxuXHRyZXR1cm4ge1xuXHRcdGdldEhvdGtleXMgOiBmdW5jdGlvbigpe1xuXHRcdFx0cmV0dXJuIGZvb3RlckhvdGtleXM7XG5cdFx0fVxuXHR9O1xufSk7IiwiYXBwLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlcil7XG5cdCRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdjaGFsbGVuZ2UuY29tcGlsZScsIHtcblx0XHR1cmwgOiAnL2NoYWxsZW5nZS9jb21waWxlJyxcblx0XHR2aWV3cyA6IHtcblx0XHRcdCd0YWItY29tcGlsZScgOiB7XG5cdFx0XHRcdHRlbXBsYXRlVXJsIDogJ2ZlYXR1cmVzL2NoYWxsZW5nZS1jb21waWxlL2NoYWxsZW5nZS1jb21waWxlLmh0bWwnLFxuXHRcdFx0XHRjb250cm9sbGVyOiAnQ2hhbGxlbmdlQ29tcGlsZUN0cmwnXG5cdFx0XHR9XG5cdFx0fVxuXHRcdC8vICxcblx0XHQvLyBvbkVudGVyIDogZnVuY3Rpb24oQ2hhbGxlbmdlRmFjdG9yeSwgJHN0YXRlKXtcblx0XHQvLyBcdGlmKENoYWxsZW5nZUZhY3RvcnkuZ2V0U3VibWlzc2lvbigpLmxlbmd0aCA9PT0gMCl7XG5cdFx0Ly8gXHRcdCRzdGF0ZS5nbygnY2hhbGxlbmdlLnZpZXcnKTtcblx0XHQvLyBcdH1cblx0XHQvLyB9XG5cdH0pO1xufSk7XG5cbmFwcC5jb250cm9sbGVyKCdDaGFsbGVuZ2VDb21waWxlQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgQ2hhbGxlbmdlRmFjdG9yeSl7XG5cdCRzY29wZS5xdWVzdGlvbiA9IENoYWxsZW5nZUZhY3RvcnkuZ2V0U3VibWlzc2lvbigpO1xuXHRjb25zb2xlLmxvZygkc2NvcGUucXVlc3Rpb24pO1xuXHR2YXIgcmVzdWx0cyA9IENoYWxsZW5nZUZhY3RvcnkuY29tcGlsZVN1Ym1pc3Npb24oJHNjb3BlLnF1ZXN0aW9uKTtcblx0JHNjb3BlLnJlc3VsdHMgPSByZXN1bHRzO1xuXHQkc2NvcGUub3V0cHV0ID0gQ2hhbGxlbmdlRmFjdG9yeS5jb21waWxlU3VibWlzc2lvbigkc2NvcGUucXVlc3Rpb24pLm91dHB1dDtcblx0JHNjb3BlLmVycm9yID0gQ2hhbGxlbmdlRmFjdG9yeS5jb21waWxlU3VibWlzc2lvbigkc2NvcGUucXVlc3Rpb24pLmVycm9yO1xuXG5cdC8vaW5pdGlhbGl6ZSBDb2RlTWlycm9yXG5cdHZhciBjbUNvbXBpbGUgPSBDb2RlTWlycm9yLmZyb21UZXh0QXJlYShkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29tcGlsZScpLCB7XG5cdFx0cmVhZE9ubHkgOiAnbm9jdXJzb3InLFxuXHRcdG1vZGU6ICdqYXZhc2NyaXB0Jyxcblx0XHRhdXRvZm9jdXMgOiB0cnVlLFxuXHRcdHRoZW1lIDogJ3R3aWxpZ2h0Jyxcblx0XHRsaW5lV3JhcHBpbmc6IHRydWVcblx0fSk7XG5cblx0Y21Db21waWxlLnJlcGxhY2VTZWxlY3Rpb24oJHNjb3BlLnF1ZXN0aW9uKTtcblxuXG5cdHZhciBjbVJlc3VsdHMgPSBDb2RlTWlycm9yLmZyb21UZXh0QXJlYShkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmVzdWx0cycpLCB7XG5cdFx0cmVhZE9ubHkgOiAnbm9jdXJzb3InLFxuXHRcdG1vZGU6ICdqYXZhc2NyaXB0Jyxcblx0XHRhdXRvZm9jdXMgOiB0cnVlLFxuXHRcdHRoZW1lIDogJ3R3aWxpZ2h0Jyxcblx0XHRsaW5lV3JhcHBpbmc6IHRydWVcblx0fSk7XG5cblx0Y21SZXN1bHRzLnJlcGxhY2VTZWxlY3Rpb24oJHNjb3BlLm91dHB1dCk7XG5cblx0JHNjb3BlLiRvbignc3VibWlzc2lvblVwZGF0ZWQnLCBmdW5jdGlvbihlKXtcblx0XHQkc2NvcGUucXVlc3Rpb24gPSBDaGFsbGVuZ2VGYWN0b3J5LmdldFN1Ym1pc3Npb24oKTtcblx0XHRyZXN1bHRzID0gQ2hhbGxlbmdlRmFjdG9yeS5jb21waWxlU3VibWlzc2lvbigkc2NvcGUucXVlc3Rpb24pO1xuXHRcdCRzY29wZS5yZXN1bHRzID0gcmVzdWx0cztcblx0XHQkc2NvcGUub3V0cHV0ID0gQ2hhbGxlbmdlRmFjdG9yeS5jb21waWxlU3VibWlzc2lvbigkc2NvcGUucXVlc3Rpb24pLm91dHB1dDtcblx0XHQkc2NvcGUuZXJyb3IgPSBDaGFsbGVuZ2VGYWN0b3J5LmNvbXBpbGVTdWJtaXNzaW9uKCRzY29wZS5xdWVzdGlvbikuZXJyb3I7XG5cdFx0Y21SZXN1bHRzLnNldFZhbHVlKCRzY29wZS5vdXRwdXQpO1xuXG5cdH0pO1xufSk7IiwiYXBwLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlcil7XG5cdCRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdjaGFsbGVuZ2UudmlldycsIHtcblx0XHR1cmw6ICcvY2hhbGxlbmdlL3ZpZXcnLFxuXHRcdHZpZXdzOiB7XG5cdFx0XHQndGFiLXZpZXcnIDoge1xuXHRcdFx0XHR0ZW1wbGF0ZVVybDogJ2ZlYXR1cmVzL2NoYWxsZW5nZS12aWV3L2NoYWxsZW5nZS12aWV3Lmh0bWwnLFxuXHRcdFx0XHRjb250cm9sbGVyOiAnQ2hhbGxlbmdlVmlld0N0cmwnXG5cdFx0XHR9XG5cdFx0fVxuXHR9KTtcbn0pO1xuXG5hcHAuY29udHJvbGxlcignQ2hhbGxlbmdlVmlld0N0cmwnLCBmdW5jdGlvbigkc2NvcGUsIENoYWxsZW5nZUZhY3RvcnksICRzdGF0ZSwgJGlvbmljU2xpZGVCb3hEZWxlZ2F0ZSl7XG5cblx0Ly9Db250cm9scyBTbGlkZVxuXHQkc2NvcGUuc2xpZGVIYXNDaGFsbGVuZ2VkID0gZnVuY3Rpb24oaW5kZXgpe1xuXHRcdCRpb25pY1NsaWRlQm94RGVsZWdhdGUuc2xpZGUoaW5kZXgpO1xuXHR9O1xuXG5cdC8vQ2hhbGxlbmdlIFZpZXdcblx0JHNjb3BlLmNoYWxsZW5nZSA9IENoYWxsZW5nZUZhY3RvcnkuZ2V0UHJvYmxlbSgpIHx8IFwiVGVzdFwiO1xuXG5cdC8vICRzY29wZS4kb24oJ3Byb2JsZW1VcGRhdGVkJywgZnVuY3Rpb24oZSl7XG5cdC8vIFx0JHNjb3BlLmNoYWxsZW5nZSA9IENoYWxsZW5nZUZhY3RvcnkuZ2V0UHJvYmxlbSgpO1xuXHQvLyB9KTtcblxuXG59KTsiLCJhcHAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyLCBVU0VSX1JPTEVTKXtcblxuICAkc3RhdGVQcm92aWRlci5zdGF0ZSgnY2hhdHMnLCB7XG4gICAgICB1cmw6ICcvY2hhdHMnLFxuICAgICAgdGVtcGxhdGVVcmw6ICdmZWF0dXJlcy9jaGF0cy90YWItY2hhdHMuaHRtbCcsXG4gICAgICBjb250cm9sbGVyOiAnQ2hhdHNDdHJsJyxcbiAgICAgIGRhdGE6IHtcbiAgICAgICAgYXV0aGVudGljYXRlOiBbVVNFUl9ST0xFUy5wdWJsaWNdXG4gICAgICB9XG4gICAgfSlcbiAgICAuc3RhdGUoJ2NoYXQtZGV0YWlsJywge1xuICAgICAgdXJsOiAnL2NoYXRzLzpjaGF0SWQnLFxuICAgICAgdGVtcGxhdGVVcmw6ICdmZWF0dXJlcy9jaGF0cy9jaGF0LWRldGFpbC5odG1sJyxcbiAgICAgIGNvbnRyb2xsZXI6ICdDaGF0RGV0YWlsQ3RybCdcbiAgICB9KTtcbn0pO1xuXG5hcHAuY29udHJvbGxlcignQ2hhdHNDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBDaGF0cykge1xuICAkc2NvcGUuY2hhdHMgPSBDaGF0cy5hbGwoKTtcbiAgJHNjb3BlLnJlbW92ZSA9IGZ1bmN0aW9uKGNoYXQpIHtcbiAgICBDaGF0cy5yZW1vdmUoY2hhdCk7XG4gIH07XG59KTtcblxuYXBwLmNvbnRyb2xsZXIoJ0NoYXREZXRhaWxDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCAkc3RhdGVQYXJhbXMsIENoYXRzKSB7XG4gICRzY29wZS5jaGF0ID0gQ2hhdHMuZ2V0KCRzdGF0ZVBhcmFtcy5jaGF0SWQpO1xufSk7XG5cbmFwcC5mYWN0b3J5KCdDaGF0cycsIGZ1bmN0aW9uKCkge1xuICAvLyBNaWdodCB1c2UgYSByZXNvdXJjZSBoZXJlIHRoYXQgcmV0dXJucyBhIEpTT04gYXJyYXlcblxuICAvLyBTb21lIGZha2UgdGVzdGluZyBkYXRhXG4gIHZhciBjaGF0cyA9IFt7XG4gICAgaWQ6IDAsXG4gICAgbmFtZTogJ0JlbiBTcGFycm93JyxcbiAgICBsYXN0VGV4dDogJ1lvdSBvbiB5b3VyIHdheT8nLFxuICAgIGZhY2U6ICdodHRwczovL3Bicy50d2ltZy5jb20vcHJvZmlsZV9pbWFnZXMvNTE0NTQ5ODExNzY1MjExMTM2LzlTZ0F1SGVZLnBuZydcbiAgfSwge1xuICAgIGlkOiAxLFxuICAgIG5hbWU6ICdNYXggTHlueCcsXG4gICAgbGFzdFRleHQ6ICdIZXksIGl0XFwncyBub3QgbWUnLFxuICAgIGZhY2U6ICdodHRwczovL2F2YXRhcnMzLmdpdGh1YnVzZXJjb250ZW50LmNvbS91LzExMjE0P3Y9MyZzPTQ2MCdcbiAgfSx7XG4gICAgaWQ6IDIsXG4gICAgbmFtZTogJ0FkYW0gQnJhZGxleXNvbicsXG4gICAgbGFzdFRleHQ6ICdJIHNob3VsZCBidXkgYSBib2F0JyxcbiAgICBmYWNlOiAnaHR0cHM6Ly9wYnMudHdpbWcuY29tL3Byb2ZpbGVfaW1hZ2VzLzQ3OTA5MDc5NDA1ODM3OTI2NC84NFRLal9xYS5qcGVnJ1xuICB9LCB7XG4gICAgaWQ6IDMsXG4gICAgbmFtZTogJ1BlcnJ5IEdvdmVybm9yJyxcbiAgICBsYXN0VGV4dDogJ0xvb2sgYXQgbXkgbXVrbHVrcyEnLFxuICAgIGZhY2U6ICdodHRwczovL3Bicy50d2ltZy5jb20vcHJvZmlsZV9pbWFnZXMvNDkxOTk1Mzk4MTM1NzY3MDQwL2llMlpfVjZlLmpwZWcnXG4gIH0sIHtcbiAgICBpZDogNCxcbiAgICBuYW1lOiAnTWlrZSBIYXJyaW5ndG9uJyxcbiAgICBsYXN0VGV4dDogJ1RoaXMgaXMgd2lja2VkIGdvb2QgaWNlIGNyZWFtLicsXG4gICAgZmFjZTogJ2h0dHBzOi8vcGJzLnR3aW1nLmNvbS9wcm9maWxlX2ltYWdlcy81NzgyMzcyODEzODQ4NDEyMTYvUjNhZTFuNjEucG5nJ1xuICB9XTtcblxuICByZXR1cm4ge1xuICAgIGFsbDogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gY2hhdHM7XG4gICAgfSxcbiAgICByZW1vdmU6IGZ1bmN0aW9uKGNoYXQpIHtcbiAgICAgIGNoYXRzLnNwbGljZShjaGF0cy5pbmRleE9mKGNoYXQpLCAxKTtcbiAgICB9LFxuICAgIGdldDogZnVuY3Rpb24oY2hhdElkKSB7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoYXRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChjaGF0c1tpXS5pZCA9PT0gcGFyc2VJbnQoY2hhdElkKSkge1xuICAgICAgICAgIHJldHVybiBjaGF0c1tpXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICB9O1xufSk7XG4iLCJhcHAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKXtcblx0Ly8gRWFjaCB0YWIgaGFzIGl0cyBvd24gbmF2IGhpc3Rvcnkgc3RhY2s6XG5cdCRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdlcnJvcicsIHtcblx0XHR1cmw6ICcvZXJyb3InLFxuXHQgICAgdGVtcGxhdGVVcmw6ICdmZWF0dXJlcy9lcnJvci9lcnJvci5odG1sJyxcblx0XHRjb250cm9sbGVyOiAnRXJyb3JDdHJsJ1xuXHR9KTtcbn0pO1xuXG5hcHAuY29udHJvbGxlcignRXJyb3InLCBmdW5jdGlvbigkc2NvcGUpIHtcblx0XG59KTsiLCJhcHAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKXtcblx0JHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2V4ZXJjaXNtJywge1xuXHRcdHRlbXBsYXRlVXJsIDogJ2ZlYXR1cmVzL2V4ZXJjaXNtL2V4ZXJjaXNtLmh0bWwnLFxuXHRcdGFic3RyYWN0IDogdHJ1ZSxcblx0XHRyZXNvbHZlIDoge1xuXHRcdFx0bWFya2Rvd24gOiBmdW5jdGlvbihBdmFpbGFibGVFeGVyY2lzZXMsIEV4ZXJjaXNtRmFjdG9yeSwgJHN0YXRlKXtcblxuXHRcdFx0XHRpZihFeGVyY2lzbUZhY3RvcnkuZ2V0VGVzdFNjcmlwdCgpLmxlbmd0aCA9PT0gMCkge1xuXHRcdFx0XHRcdHZhciBleGVyY2lzZSA9IEF2YWlsYWJsZUV4ZXJjaXNlcy5nZXRSYW5kb21FeGVyY2lzZSgpO1xuXHRcdFx0XHRcdEV4ZXJjaXNtRmFjdG9yeS5zZXROYW1lKGV4ZXJjaXNlLm5hbWUpO1xuXHRcdFx0XHRcdHJldHVybiBFeGVyY2lzbUZhY3RvcnkuZ2V0RXh0ZXJuYWxTY3JpcHQoZXhlcmNpc2UubGluaykudGhlbihmdW5jdGlvbihkYXRhKXtcblx0XHRcdFx0XHRcdHJldHVybiBFeGVyY2lzbUZhY3RvcnkuZ2V0RXh0ZXJuYWxNZChleGVyY2lzZS5tZExpbmspO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHR9XG5cdH0pO1xufSk7XG5cbmFwcC5mYWN0b3J5KCdFeGVyY2lzbUZhY3RvcnknLCBmdW5jdGlvbigkaHR0cCwgJHJvb3RTY29wZSl7XG5cdHZhciBuYW1lID0gJyc7XG5cdHZhciB0ZXN0ID0gJyc7XG5cdHZhciBjb2RlID0gJyc7XG5cdHZhciBtYXJrZG93biA9ICcnO1xuXG5cdHJldHVybiB7XG5cdFx0Z2V0RXh0ZXJuYWxTY3JpcHQgOiBmdW5jdGlvbihsaW5rKXtcblx0XHRcdHJldHVybiAkaHR0cC5nZXQobGluaykudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG5cdFx0XHRcdHRlc3QgPSByZXNwb25zZS5kYXRhO1xuXHRcdFx0XHRyZXR1cm4gcmVzcG9uc2UuZGF0YTtcblx0XHRcdH0pO1xuXHRcdH0sXG5cdFx0Z2V0RXh0ZXJuYWxNZCA6IGZ1bmN0aW9uKGxpbmspe1xuXHRcdFx0cmV0dXJuICRodHRwLmdldChsaW5rKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcblx0XHRcdFx0bWFya2Rvd24gPSByZXNwb25zZS5kYXRhO1xuXHRcdFx0XHRyZXR1cm4gcmVzcG9uc2UuZGF0YTtcblx0XHRcdH0pO1xuXHRcdH0sXG5cdFx0c2V0TmFtZSA6IGZ1bmN0aW9uKHNldE5hbWUpe1xuXHRcdFx0bmFtZSA9IHNldE5hbWU7XG5cdFx0fSxcblx0XHRzZXRUZXN0U2NyaXB0IDogZnVuY3Rpb24odGVzdCl7XG5cdFx0XHR0ZXN0ID0gdGVzdDtcblx0XHRcdCRyb290U2NvcGUuJGJyb2FkY2FzdCgndGVzdENoYW5nZScsIHt0ZXN0IDogdGVzdH0pO1xuXHRcdH0sXG5cdFx0c2V0Q29kZVNjcmlwdCA6IGZ1bmN0aW9uIChjb2RlKXtcblx0XHRcdGNvZGUgPSBjb2RlO1xuXHRcdFx0JHJvb3RTY29wZS4kYnJvYWRjYXN0KCdjb2RlQ2hhbmdlJywge2NvZGUgOiBjb2RlfSk7XG5cdFx0fSxcblx0XHRnZXRUZXN0U2NyaXB0IDogZnVuY3Rpb24oKXtcblx0XHRcdHJldHVybiB0ZXN0O1xuXHRcdH0sXG5cdFx0Z2V0Q29kZVNjcmlwdCA6IGZ1bmN0aW9uKCl7XG5cdFx0XHRyZXR1cm4gY29kZTtcblx0XHR9LFxuXHRcdGdldE1hcmtkb3duIDogZnVuY3Rpb24oKXtcblx0XHRcdHJldHVybiBtYXJrZG93bjtcblx0XHR9LFxuXHRcdGdldE5hbWUgOiBmdW5jdGlvbigpe1xuXHRcdFx0cmV0dXJuIG5hbWU7XG5cdFx0fVxuXHR9O1xufSk7XG5cbmFwcC5mYWN0b3J5KCdBdmFpbGFibGVFeGVyY2lzZXMnLCBmdW5jdGlvbigpe1xuXG5cdHZhciBsaWJyYXJ5ID0gW1xuXHRcdCdhY2N1bXVsYXRlJyxcblx0XHQnYWxsZXJnaWVzJyxcblx0XHQnYW5hZ3JhbScsXG5cdFx0J2F0YmFzaC1jaXBoZXInLFxuXHRcdCdiZWVyLXNvbmcnLFxuXHRcdCdiaW5hcnknLFxuXHRcdCdiaW5hcnktc2VhcmNoLXRyZWUnLFxuXHRcdCdib2InLFxuXHRcdCdicmFja2V0LXB1c2gnLFxuXHRcdCdjaXJjdWxhdGUtYnVmZmVyJyxcblx0XHQnY2xvY2snLFxuXHRcdCdjcnlwdG8tc3F1YXJlJyxcblx0XHQnY3VzdG9tLXNldCcsXG5cdFx0J2RpZmZlcmVuY2Utb2Ytc3F1YXJlcycsXG5cdFx0J2V0bCcsXG5cdFx0J2Zvb2QtY2hhaW4nXG5cdF07XG5cblx0dmFyIGdlbmVyYXRlTGluayA9IGZ1bmN0aW9uKG5hbWUpe1xuXHRcdHJldHVybiAnZXhlcmNpc20vamF2YXNjcmlwdC8nICsgbmFtZSArICcvJyArIG5hbWUgKyAnX3Rlc3Quc3BlYy5qcyc7XG5cdH07XG5cblx0dmFyIGdlbmVyYXRlTWRMaW5rID0gZnVuY3Rpb24obmFtZSl7XG5cdFx0cmV0dXJuICdleGVyY2lzbS9qYXZhc2NyaXB0LycgKyBuYW1lICsgJy8nICsgbmFtZSArICcubWQnO1xuXHR9O1xuXG5cdHZhciBnZW5lcmF0ZVJhbmRvbSA9IGZ1bmN0aW9uKCl7XG5cdFx0dmFyIHJhbmRvbSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGxpYnJhcnkubGVuZ3RoKTtcblx0XHRyZXR1cm4gbGlicmFyeVtyYW5kb21dO1xuXHR9O1xuXG5cdHJldHVybiB7XG5cdFx0Z2V0U3BlY2lmaWNFeGVyY2lzZSA6IGZ1bmN0aW9uKG5hbWUpe1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0bGluayA6IGdlbmVyYXRlTGluayhuYW1lKSxcblx0XHRcdFx0bWRMaW5rIDogZ2VuZXJhdGVNZExpbmsobmFtZSlcblx0XHRcdH07XG5cdFx0fSxcblx0XHRnZXRSYW5kb21FeGVyY2lzZSA6IGZ1bmN0aW9uKCl7XG5cdFx0XHR2YXIgbmFtZSA9IGdlbmVyYXRlUmFuZG9tKCk7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRuYW1lIDogbmFtZSxcblx0XHRcdFx0bGluayA6IGdlbmVyYXRlTGluayhuYW1lKSxcblx0XHRcdFx0bWRMaW5rIDogZ2VuZXJhdGVNZExpbmsobmFtZSlcblx0XHRcdH07XG5cdFx0fVxuXHR9O1xufSk7IiwiYXBwLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlcil7XG5cdCRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdleGVyY2lzbS5jb2RlJywge1xuXHRcdHVybCA6ICcvZXhlcmNpc20vY29kZScsXG5cdFx0dmlld3MgOiB7XG5cdFx0XHQndGFiLWNvZGUnIDoge1xuXHRcdFx0XHR0ZW1wbGF0ZVVybCA6ICdmZWF0dXJlcy9leGVyY2lzbS1jb2RlL2V4ZXJjaXNtLWNvZGUuaHRtbCcsXG5cdFx0XHRcdGNvbnRyb2xsZXI6ICdFeGVyY2lzbUNvZGVDdHJsJ1xuXHRcdFx0fVxuXHRcdH1cblx0fSk7XG59KTtcblxuYXBwLmNvbnRyb2xsZXIoJ0V4ZXJjaXNtQ29kZUN0cmwnLCBmdW5jdGlvbigkc2NvcGUsIEV4ZXJjaXNtRmFjdG9yeSl7XG5cdCRzY29wZS5uYW1lID0gRXhlcmNpc21GYWN0b3J5LmdldE5hbWUoKTtcblx0JHNjb3BlLmNvZGUgPSBFeGVyY2lzbUZhY3RvcnkuZ2V0Q29kZVNjcmlwdCgpO1xuXG5cdC8vcGFzc2luZyB0aGlzIHVwZGF0ZSBmdW5jdGlvbiBzbyB0aGF0IG9uIHRleHQgY2hhbmdlIGluIHRoZSBkaXJlY3RpdmUgdGhlIGZhY3Rvcnkgd2lsbCBiZSBhbGVydGVkXG5cdCRzY29wZS51cGRhdGVmdW5jID0gZnVuY3Rpb24obmV3VmFsdWUpe1xuXHRcdEV4ZXJjaXNtRmFjdG9yeS5zZXRDb2RlU2NyaXB0KG5ld1ZhbHVlKTtcblx0fTtcbn0pOyIsImFwcC5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIpe1xuXHQkc3RhdGVQcm92aWRlci5zdGF0ZSgnZXhlcmNpc20uY29tcGlsZScsIHtcblx0XHR1cmwgOiAnL2V4ZXJjaXNtL2NvbXBpbGUnLFxuXHRcdHZpZXdzIDoge1xuXHRcdFx0J3RhYi1jb21waWxlJyA6IHtcblx0XHRcdFx0dGVtcGxhdGVVcmwgOiAnZmVhdHVyZXMvZXhlcmNpc20tY29tcGlsZS9leGVyY2lzbS1jb21waWxlLmh0bWwnLFxuXHRcdFx0XHRjb250cm9sbGVyOiAnRXhlcmNpc21Db21waWxlQ3RybCdcblx0XHRcdH1cblx0XHR9XG5cdH0pO1xufSk7XG5cbmFwcC5jb250cm9sbGVyKCdFeGVyY2lzbUNvbXBpbGVDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBFeGVyY2lzbUZhY3Rvcnkpe1xuXHQkc2NvcGUubmFtZSA9IEV4ZXJjaXNtRmFjdG9yeS5nZXROYW1lKCk7XG5cdCRzY29wZS50ZXN0ID0gRXhlcmNpc21GYWN0b3J5LmdldFRlc3RTY3JpcHQoKTtcblx0JHNjb3BlLmNvZGUgPSBFeGVyY2lzbUZhY3RvcnkuZ2V0Q29kZVNjcmlwdCgpO1xuXG5cdCRzY29wZS4kb24oJ3Rlc3RDaGFuZ2UnLCBmdW5jdGlvbihldmVudCwgZGF0YSl7XG5cdFx0JHNjb3BlLnRlc3QgPSBkYXRhLnRlc3Q7XG5cdH0pO1xuXG5cdCRzY29wZS4kb24oJ2NvZGVDaGFuZ2UnLCBmdW5jdGlvbihldmVudCwgZGF0YSl7XG5cdFx0JHNjb3BlLmNvZGUgPSBkYXRhLmNvZGU7XG5cdH0pO1xufSk7IiwiYXBwLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlcil7XG5cdCRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdleGVyY2lzbS52aWV3Jywge1xuXHRcdHVybDogJy9leGVyY2lzbS92aWV3Jyxcblx0XHR2aWV3czoge1xuXHRcdFx0J3RhYi12aWV3JyA6IHtcblx0XHRcdFx0dGVtcGxhdGVVcmw6ICdmZWF0dXJlcy9leGVyY2lzbS12aWV3L2V4ZXJjaXNtLXZpZXcuaHRtbCcsXG5cdFx0XHRcdGNvbnRyb2xsZXI6ICdFeGVyY2lzbVZpZXdDdHJsJ1xuXHRcdFx0fVxuXHRcdH1cblx0fSk7XG59KTtcblxuYXBwLmNvbnRyb2xsZXIoJ0V4ZXJjaXNtVmlld0N0cmwnLCBmdW5jdGlvbigkc2NvcGUsIEV4ZXJjaXNtRmFjdG9yeSl7XG5cdCRzY29wZS5tYXJrZG93biA9IEV4ZXJjaXNtRmFjdG9yeS5nZXRNYXJrZG93bigpO1xuXHQkc2NvcGUubmFtZSA9IEV4ZXJjaXNtRmFjdG9yeS5nZXROYW1lKCk7XG59KTsiLCJhcHAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKXtcblx0JHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2V4ZXJjaXNtLnRlc3QnLCB7XG5cdFx0dXJsIDogJy9leGVyY2lzbS90ZXN0Jyxcblx0XHR2aWV3cyA6IHtcblx0XHRcdCd0YWItdGVzdCcgOiB7XG5cdFx0XHRcdHRlbXBsYXRlVXJsIDogJ2ZlYXR1cmVzL2V4ZXJjaXNtLXRlc3QvZXhlcmNpc20tdGVzdC5odG1sJyxcblx0XHRcdFx0Y29udHJvbGxlciA6ICdFeGVyY2lzbVRlc3RDdHJsJ1xuXHRcdFx0fVxuXHRcdH1cblx0fSk7XG59KTtcblxuYXBwLmNvbnRyb2xsZXIoJ0V4ZXJjaXNtVGVzdEN0cmwnLCBmdW5jdGlvbigkc2NvcGUsIEV4ZXJjaXNtRmFjdG9yeSl7XG5cdCRzY29wZS5uYW1lID0gRXhlcmNpc21GYWN0b3J5LmdldE5hbWUoKTtcblx0JHNjb3BlLnRlc3QgPSBFeGVyY2lzbUZhY3RvcnkuZ2V0VGVzdFNjcmlwdCgpO1xuXG5cdC8vcGFzc2luZyB0aGlzIHVwZGF0ZSBmdW5jdGlvbiBzbyB0aGF0IG9uIHRleHQgY2hhbmdlIGluIHRoZSBkaXJlY3RpdmUgdGhlIGZhY3Rvcnkgd2lsbCBiZSBhbGVydGVkXG5cdCRzY29wZS51cGRhdGVmdW5jID0gZnVuY3Rpb24obmV3VmFsdWUpe1xuXHRcdEV4ZXJjaXNtRmFjdG9yeS5zZXRUZXN0U2NyaXB0KG5ld1ZhbHVlKTtcblx0fTtcbn0pOyIsImFwcC5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIpe1xuXHQkc3RhdGVQcm92aWRlci5zdGF0ZSgnbG9naW4nLCB7XG5cdFx0dXJsIDogJy9sb2dpbicsXG5cdFx0dGVtcGxhdGVVcmwgOiAnZmVhdHVyZXMvbG9naW4vbG9naW4uaHRtbCcsXG5cdFx0Y29udHJvbGxlciA6ICdMb2dpbkN0cmwnXG5cdH0pO1xufSk7XG5cbmFwcC5jb250cm9sbGVyKCdMb2dpbkN0cmwnLCBmdW5jdGlvbigkcm9vdFNjb3BlLCAkc2NvcGUsICRpb25pY1BvcHVwLCAkc3RhdGUsIEF1dGhTZXJ2aWNlKXtcblx0JHNjb3BlLmRhdGEgPSB7fTtcblx0JHNjb3BlLmVycm9yID0gbnVsbDtcblxuICAgICRzY29wZS5zaWdudXAgPSBmdW5jdGlvbigpe1xuICAgICAgICAkc3RhdGUuZ28oJ3NpZ251cCcpO1xuICAgIH07XG5cblx0JHNjb3BlLmxvZ2luID0gZnVuY3Rpb24oKXtcblx0XHRBdXRoU2VydmljZVxuXHRcdFx0LmxvZ2luKCRzY29wZS5kYXRhKVxuXHRcdFx0LnRoZW4oZnVuY3Rpb24oYXV0aGVudGljYXRlZCl7IC8vVE9ETzphdXRoZW50aWNhdGVkIGlzIHdoYXQgaXMgcmV0dXJuZWRcblx0XHRcdFx0Ly9jb25zb2xlLmxvZygnbG9naW4sIHRhYi5jaGFsbGVuZ2Utc3VibWl0Jyk7XG5cdFx0XHRcdC8vJHNjb3BlLm1lbnUgPSB0cnVlO1xuXHRcdFx0XHQkcm9vdFNjb3BlLiRicm9hZGNhc3QoJ0F1dGgnKTtcblx0XHRcdFx0JHNjb3BlLnN0YXRlcy5wdXNoKHsgLy9UT0RPOiBOZWVkIHRvIGFkZCBhIHBhcmVudCBjb250cm9sbGVyIHRvIGNvbW11bmljYXRlXG5cdFx0XHRcdFx0bmFtZTogJ0xvZ291dCcsXG5cdFx0XHRcdFx0cmVmOiBmdW5jdGlvbigpe1xuXHRcdFx0XHRcdFx0QXV0aFNlcnZpY2UubG9nb3V0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZGF0YSA9IHt9O1xuXHRcdFx0XHRcdFx0JHNjb3BlLnN0YXRlcy5wb3AoKTsgLy9UT0RPOiBGaW5kIGEgYmV0dGVyIHdheSB0byByZW1vdmUgdGhlIExvZ291dCBsaW5rLCBpbnN0ZWFkIG9mIHBvcFxuXHRcdFx0XHRcdFx0JHN0YXRlLmdvKCdzaWdudXAnKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHQkc3RhdGUuZ28oJ2NoYWxsZW5nZS52aWV3Jyk7XG5cdFx0XHRcdC8vVE9ETzogV2UgY2FuIHNldCB0aGUgdXNlciBuYW1lIGhlcmUgYXMgd2VsbC4gVXNlZCBpbiBjb25qdW5jdGlvbiB3aXRoIGEgbWFpbiBjdHJsXG5cdFx0XHR9KVxuXHRcdFx0LmNhdGNoKGZ1bmN0aW9uKGVycil7XG5cdFx0XHRcdCRzY29wZS5lcnJvciA9ICdMb2dpbiBJbnZhbGlkJztcblx0XHRcdFx0Y29uc29sZS5lcnJvcihKU09OLnN0cmluZ2lmeShlcnIpKVxuXHRcdFx0XHR2YXIgYWxlcnRQb3B1cCA9ICRpb25pY1BvcHVwLmFsZXJ0KHtcblx0XHRcdFx0XHR0aXRsZTogJ0xvZ2luIGZhaWxlZCEnLFxuXHRcdFx0XHRcdHRlbXBsYXRlOiAnUGxlYXNlIGNoZWNrIHlvdXIgY3JlZGVudGlhbHMhJ1xuXHRcdFx0XHR9KTtcblx0XHRcdH0pO1xuXHR9O1xufSk7XG5cblxuLy9UT0RPOiBDbGVhbnVwIGNvbW1lbnRlZCBjb2RlXG5cbiIsImFwcC5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIpe1xuICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdzaWdudXAnLHtcbiAgICAgICAgdXJsOlwiL3NpZ251cFwiLFxuICAgICAgICB0ZW1wbGF0ZVVybDogXCJmZWF0dXJlcy9zaWdudXAvc2lnbnVwLmh0bWxcIixcbiAgICAgICAgY29udHJvbGxlcjogJ1NpZ25VcEN0cmwnXG4gICAgfSk7XG59KTtcblxuYXBwLmNvbnRyb2xsZXIoJ1NpZ25VcEN0cmwnLGZ1bmN0aW9uKCRyb290U2NvcGUsICRodHRwLCAkc2NvcGUsICRzdGF0ZSwgQXV0aFNlcnZpY2UsICRpb25pY1BvcHVwKXtcbiAgICAkc2NvcGUuZGF0YSA9IHt9O1xuICAgICRzY29wZS5lcnJvciA9IG51bGw7XG5cbiAgICAkc2NvcGUubG9naW4gPSBmdW5jdGlvbigpe1xuICAgICAgICAkc3RhdGUuZ28oJ2xvZ2luJyk7XG4gICAgfTtcblxuICAgICRzY29wZS5zaWdudXAgPSBmdW5jdGlvbigpe1xuICAgICAgICBBdXRoU2VydmljZVxuICAgICAgICAgICAgLnNpZ251cCgkc2NvcGUuZGF0YSlcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKGF1dGhlbnRpY2F0ZWQpe1xuICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ3NpZ251cCwgdGFiLmNoYWxsZW5nZScpO1xuICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdCgnQXV0aCcpO1xuICAgICAgICAgICAgICAgICRzY29wZS5zdGF0ZXMucHVzaCh7IC8vVE9ETzogTmVlZCB0byBhZGQgYSBwYXJlbnQgY29udHJvbGxlciB0byBjb21tdW5pY2F0ZVxuICAgICAgICAgICAgICAgICAgICBuYW1lOiAnTG9nb3V0JyxcbiAgICAgICAgICAgICAgICAgICAgcmVmOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICAgICAgQXV0aFNlcnZpY2UubG9nb3V0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZGF0YSA9IHt9O1xuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnN0YXRlcy5wb3AoKTsgLy9UT0RPOiBGaW5kIGEgYmV0dGVyIHdheSB0byByZW1vdmUgdGhlIExvZ291dCBsaW5rLCBpbnN0ZWFkIG9mIHBvcFxuICAgICAgICAgICAgICAgICAgICAgICAgJHN0YXRlLmdvKCdzaWdudXAnKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICRzdGF0ZS5nbygnY2hhbGxlbmdlLnZpZXcnKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuY2F0Y2goZnVuY3Rpb24oZXJyKXtcbiAgICAgICAgICAgICAgICAkc2NvcGUuZXJyb3IgPSAnU2lnbnVwIEludmFsaWQnO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoSlNPTi5zdHJpbmdpZnkoZXJyKSlcbiAgICAgICAgICAgICAgICB2YXIgYWxlcnRQb3B1cCA9ICRpb25pY1BvcHVwLmFsZXJ0KHtcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdTaWdudXAgZmFpbGVkIScsXG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlOiAnUGxlYXNlIGNoZWNrIHlvdXIgY3JlZGVudGlhbHMhJ1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgfTtcblxufSk7XG5cbi8vVE9ETzogRm9ybSBWYWxpZGF0aW9uXG4vL1RPRE86IENsZWFudXAgY29tbWVudGVkIGNvZGUiLCJhcHAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKXtcblx0JHN0YXRlUHJvdmlkZXIuc3RhdGUoJ3dlbGNvbWUnLCB7XG5cdFx0dXJsIDogJy93ZWxjb21lJyxcblx0XHR0ZW1wbGF0ZVVybCA6ICdmZWF0dXJlcy93ZWxjb21lL3dlbGNvbWUuaHRtbCcsXG5cdFx0Y29udHJvbGxlciA6ICdXZWxjb21lQ3RybCdcblx0fSk7XG59KTtcblxuYXBwLmNvbnRyb2xsZXIoJ1dlbGNvbWVDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCAkc3RhdGUsIEF1dGhTZXJ2aWNlLCAkcm9vdFNjb3BlKXtcblx0Ly9UT0RPOiBTcGxhc2ggcGFnZSB3aGlsZSB5b3UgbG9hZCByZXNvdXJjZXMgKHBvc3NpYmxlIGlkZWEpXG5cdC8vY29uc29sZS5sb2coJ1dlbGNvbWVDdHJsJyk7XG5cdCRzY29wZS5sb2dpbiA9IGZ1bmN0aW9uKCl7XG5cdFx0JHN0YXRlLmdvKCdsb2dpbicpO1xuXHR9O1xuXHQkc2NvcGUuc2lnbnVwID0gZnVuY3Rpb24oKXtcblx0XHQkc3RhdGUuZ28oJ3NpZ251cCcpO1xuXHR9O1xuXG5cdGlmIChBdXRoU2VydmljZS5pc0F1dGhlbnRpY2F0ZWQoKSkge1xuXHRcdCRyb290U2NvcGUuJGJyb2FkY2FzdCgnQXV0aCcpO1xuXHRcdCRzY29wZS5zdGF0ZXMucHVzaCh7IC8vVE9ETzogTmVlZCB0byBhZGQgYSBwYXJlbnQgY29udHJvbGxlciB0byBjb21tdW5pY2F0ZVxuXHRcdFx0bmFtZTogJ0xvZ291dCcsXG5cdFx0XHRyZWY6IGZ1bmN0aW9uKCl7XG5cdFx0XHRcdEF1dGhTZXJ2aWNlLmxvZ291dCgpO1xuXHRcdFx0XHQkc2NvcGUuZGF0YSA9IHt9O1xuXHRcdFx0XHQkc2NvcGUuc3RhdGVzLnBvcCgpOyAvL1RPRE86IEZpbmQgYSBiZXR0ZXIgd2F5IHRvIHJlbW92ZSB0aGUgTG9nb3V0IGxpbmssIGluc3RlYWQgb2YgcG9wXG5cdFx0XHRcdCRzdGF0ZS5nbygnc2lnbnVwJyk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0JHN0YXRlLmdvKCdjaGFsbGVuZ2UudmlldycpO1xuXHR9IGVsc2Uge1xuXHRcdC8vVE9ETzogJHN0YXRlLmdvKCdzaWdudXAnKTsgUmVtb3ZlIEJlbG93IGxpbmVcblx0XHQkc3RhdGUuZ28oJ2NoYWxsZW5nZS52aWV3Jyk7XG5cdH1cbn0pOyIsIi8vdG9rZW4gaXMgc2VudCBvbiBldmVyeSBodHRwIHJlcXVlc3RcbmFwcC5mYWN0b3J5KCdBdXRoSW50ZXJjZXB0b3InLGZ1bmN0aW9uIEF1dGhJbnRlcmNlcHRvcihBVVRIX0VWRU5UUywkcm9vdFNjb3BlLCRxLEF1dGhUb2tlbkZhY3Rvcnkpe1xuXG4gICAgdmFyIHN0YXR1c0RpY3QgPSB7XG4gICAgICAgIDQwMTogQVVUSF9FVkVOVFMubm90QXV0aGVudGljYXRlZCxcbiAgICAgICAgNDAzOiBBVVRIX0VWRU5UUy5ub3RBdXRob3JpemVkXG4gICAgfTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIHJlcXVlc3Q6IGFkZFRva2VuLFxuICAgICAgICByZXNwb25zZUVycm9yOiBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdChzdGF0dXNEaWN0W3Jlc3BvbnNlLnN0YXR1c10sIHJlc3BvbnNlKTtcbiAgICAgICAgICAgIHJldHVybiAkcS5yZWplY3QocmVzcG9uc2UpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIGFkZFRva2VuKGNvbmZpZyl7XG4gICAgICAgIHZhciB0b2tlbiA9IEF1dGhUb2tlbkZhY3RvcnkuZ2V0VG9rZW4oKTtcbiAgICAgICAgLy9jb25zb2xlLmxvZygnYWRkVG9rZW4nLHRva2VuKTtcbiAgICAgICAgaWYodG9rZW4pe1xuICAgICAgICAgICAgY29uZmlnLmhlYWRlcnMgPSBjb25maWcuaGVhZGVycyB8fCB7fTtcbiAgICAgICAgICAgIGNvbmZpZy5oZWFkZXJzLkF1dGhvcml6YXRpb24gPSAnQmVhcmVyICcgKyB0b2tlbjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY29uZmlnO1xuICAgIH1cbn0pO1xuLy9za2lwcGVkIEF1dGggSW50ZXJjZXB0b3JzIGdpdmVuIFRPRE86IFlvdSBjb3VsZCBhcHBseSB0aGUgYXBwcm9hY2ggaW5cbi8vaHR0cDovL2RldmRhY3RpYy5jb20vdXNlci1hdXRoLWFuZ3VsYXJqcy1pb25pYy9cblxuYXBwLmNvbmZpZyhmdW5jdGlvbigkaHR0cFByb3ZpZGVyKXtcbiAgICAkaHR0cFByb3ZpZGVyLmludGVyY2VwdG9ycy5wdXNoKCdBdXRoSW50ZXJjZXB0b3InKTtcbn0pO1xuXG5hcHAuY29uc3RhbnQoJ0FVVEhfRVZFTlRTJywge1xuICAgICAgICBub3RBdXRoZW50aWNhdGVkOiAnYXV0aC1ub3QtYXV0aGVudGljYXRlZCcsXG4gICAgICAgIG5vdEF1dGhvcml6ZWQ6ICdhdXRoLW5vdC1hdXRob3JpemVkJ1xufSk7XG5cbmFwcC5jb25zdGFudCgnVVNFUl9ST0xFUycsIHtcbiAgICAgICAgLy9hZG1pbjogJ2FkbWluX3JvbGUnLFxuICAgICAgICBwdWJsaWM6ICdwdWJsaWNfcm9sZSdcbn0pO1xuXG5hcHAuZmFjdG9yeSgnQXV0aFRva2VuRmFjdG9yeScsZnVuY3Rpb24oJHdpbmRvdyl7XG4gICAgdmFyIHN0b3JlID0gJHdpbmRvdy5sb2NhbFN0b3JhZ2U7XG4gICAgdmFyIGtleSA9ICdhdXRoLXRva2VuJztcblxuICAgIHJldHVybiB7XG4gICAgICAgIGdldFRva2VuOiBnZXRUb2tlbixcbiAgICAgICAgc2V0VG9rZW46IHNldFRva2VuXG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIGdldFRva2VuKCl7XG4gICAgICAgIHJldHVybiBzdG9yZS5nZXRJdGVtKGtleSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2V0VG9rZW4odG9rZW4pe1xuICAgICAgICBpZih0b2tlbil7XG4gICAgICAgICAgICBzdG9yZS5zZXRJdGVtKGtleSx0b2tlbik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzdG9yZS5yZW1vdmVJdGVtKGtleSk7XG4gICAgICAgIH1cbiAgICB9XG59KTtcblxuYXBwLnNlcnZpY2UoJ0F1dGhTZXJ2aWNlJyxmdW5jdGlvbigkcSwkaHR0cCxVU0VSX1JPTEVTLEF1dGhUb2tlbkZhY3RvcnksQXBpRW5kcG9pbnQsJHJvb3RTY29wZSl7XG4gICAgdmFyIHVzZXJuYW1lID0gJyc7XG4gICAgdmFyIGlzQXV0aGVudGljYXRlZCA9IGZhbHNlO1xuICAgIHZhciBhdXRoVG9rZW47XG5cbiAgICBmdW5jdGlvbiBsb2FkVXNlckNyZWRlbnRpYWxzKCkge1xuICAgICAgICAvL3ZhciB0b2tlbiA9IHdpbmRvdy5sb2NhbFN0b3JhZ2UuZ2V0SXRlbShMT0NBTF9UT0tFTl9LRVkpO1xuICAgICAgICB2YXIgdG9rZW4gPSBBdXRoVG9rZW5GYWN0b3J5LmdldFRva2VuKCk7XG4gICAgICAgIC8vY29uc29sZS5sb2codG9rZW4pO1xuICAgICAgICBpZiAodG9rZW4pIHtcbiAgICAgICAgICAgIHVzZUNyZWRlbnRpYWxzKHRva2VuKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHN0b3JlVXNlckNyZWRlbnRpYWxzKGRhdGEpIHtcbiAgICAgICAgQXV0aFRva2VuRmFjdG9yeS5zZXRUb2tlbihkYXRhLnRva2VuKTtcbiAgICAgICAgdXNlQ3JlZGVudGlhbHMoZGF0YSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdXNlQ3JlZGVudGlhbHMoZGF0YSkge1xuICAgICAgICAvL2NvbnNvbGUubG9nKCd1c2VDcmVkZW50aWFscyB0b2tlbicsZGF0YSk7XG4gICAgICAgIHVzZXJuYW1lID0gZGF0YS51c2VybmFtZTtcbiAgICAgICAgaXNBdXRoZW50aWNhdGVkID0gdHJ1ZTtcbiAgICAgICAgYXV0aFRva2VuID0gZGF0YS50b2tlbjtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBkZXN0cm95VXNlckNyZWRlbnRpYWxzKCkge1xuICAgICAgICBhdXRoVG9rZW4gPSB1bmRlZmluZWQ7XG4gICAgICAgIHVzZXJuYW1lID0gJyc7XG4gICAgICAgIGlzQXV0aGVudGljYXRlZCA9IGZhbHNlO1xuICAgICAgICBBdXRoVG9rZW5GYWN0b3J5LnNldFRva2VuKCk7IC8vZW1wdHkgY2xlYXJzIHRoZSB0b2tlblxuICAgIH1cblxuICAgIHZhciBsb2dvdXQgPSBmdW5jdGlvbigpe1xuICAgICAgICBkZXN0cm95VXNlckNyZWRlbnRpYWxzKCk7XG5cbiAgICB9O1xuXG4gICAgLy92YXIgbG9naW4gPSBmdW5jdGlvbigpXG4gICAgdmFyIGxvZ2luID0gZnVuY3Rpb24odXNlcmRhdGEpe1xuICAgICAgICBjb25zb2xlLmxvZygnbG9naW4nLEpTT04uc3RyaW5naWZ5KHVzZXJkYXRhKSk7XG4gICAgICAgIHJldHVybiAkcShmdW5jdGlvbihyZXNvbHZlLHJlamVjdCl7XG4gICAgICAgICAgICAkaHR0cC5wb3N0KEFwaUVuZHBvaW50LnVybCtcIi91c2VyL2xvZ2luXCIsIHVzZXJkYXRhKVxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAgICAgICAgICAgICAgICAgc3RvcmVVc2VyQ3JlZGVudGlhbHMocmVzcG9uc2UuZGF0YSk7IC8vc3RvcmVVc2VyQ3JlZGVudGlhbHNcbiAgICAgICAgICAgICAgICAgICAgLy9pc0F1dGhlbnRpY2F0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHJlc3BvbnNlKTsgLy9UT0RPOiBzZW50IHRvIGF1dGhlbnRpY2F0ZWRcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIHZhciBzaWdudXAgPSBmdW5jdGlvbih1c2VyZGF0YSl7XG4gICAgICAgIGNvbnNvbGUubG9nKCdzaWdudXAnLEpTT04uc3RyaW5naWZ5KHVzZXJkYXRhKSk7XG4gICAgICAgIHJldHVybiAkcShmdW5jdGlvbihyZXNvbHZlLHJlamVjdCl7XG4gICAgICAgICAgICAkaHR0cC5wb3N0KEFwaUVuZHBvaW50LnVybCtcIi91c2VyL3NpZ251cFwiLCB1c2VyZGF0YSlcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgICAgICAgICAgICAgICAgIHN0b3JlVXNlckNyZWRlbnRpYWxzKHJlc3BvbnNlLmRhdGEpOyAvL3N0b3JlVXNlckNyZWRlbnRpYWxzXG4gICAgICAgICAgICAgICAgICAgIC8vaXNBdXRoZW50aWNhdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShyZXNwb25zZSk7IC8vVE9ETzogc2VudCB0byBhdXRoZW50aWNhdGVkXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGxvYWRVc2VyQ3JlZGVudGlhbHMoKTtcblxuICAgIHZhciBpc0F1dGhvcml6ZWQgPSBmdW5jdGlvbihhdXRoZW50aWNhdGVkKSB7XG4gICAgICAgIGlmICghYW5ndWxhci5pc0FycmF5KGF1dGhlbnRpY2F0ZWQpKSB7XG4gICAgICAgICAgICBhdXRoZW50aWNhdGVkID0gW2F1dGhlbnRpY2F0ZWRdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAoaXNBdXRoZW50aWNhdGVkICYmIGF1dGhlbnRpY2F0ZWQuaW5kZXhPZihVU0VSX1JPTEVTLnB1YmxpYykgIT09IC0xKTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgbG9naW46IGxvZ2luLFxuICAgICAgICBzaWdudXA6IHNpZ251cCxcbiAgICAgICAgbG9nb3V0OiBsb2dvdXQsXG4gICAgICAgIGlzQXV0aGVudGljYXRlZDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdBdXRoU2VydmljZS5pc0F1dGhlbnRpY2F0ZWQoKScpO1xuICAgICAgICAgICAgcmV0dXJuIGlzQXV0aGVudGljYXRlZDtcbiAgICAgICAgfSxcbiAgICAgICAgdXNlcm5hbWU6IGZ1bmN0aW9uKCl7cmV0dXJuIHVzZXJuYW1lO30sXG4gICAgICAgIC8vZ2V0TG9nZ2VkSW5Vc2VyOiBnZXRMb2dnZWRJblVzZXIsXG4gICAgICAgIGlzQXV0aG9yaXplZDogaXNBdXRob3JpemVkXG4gICAgfVxuXG59KTtcblxuLy9UT0RPOiBEaWQgbm90IGNvbXBsZXRlIG1haW4gY3RybCAnQXBwQ3RybCBmb3IgaGFuZGxpbmcgZXZlbnRzJ1xuLy8gYXMgcGVyIGh0dHA6Ly9kZXZkYWN0aWMuY29tL3VzZXItYXV0aC1hbmd1bGFyanMtaW9uaWMvIiwiYXBwLmZpbHRlcignbmFtZWZvcm1hdCcsIGZ1bmN0aW9uKCl7XG5cdHJldHVybiBmdW5jdGlvbih0ZXh0KXtcblx0XHRyZXR1cm4gJ0V4ZXJjaXNtIC0gJyArIHRleHQuc3BsaXQoJy0nKS5tYXAoZnVuY3Rpb24oZWwpe1xuXHRcdFx0cmV0dXJuIGVsLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgZWwuc2xpY2UoMSk7XG5cdFx0fSkuam9pbignICcpO1xuXHR9O1xufSk7IiwiYXBwLmZpbHRlcignbWFya2VkJywgZnVuY3Rpb24oJHNjZSl7XG5cdC8vIG1hcmtlZC5zZXRPcHRpb25zKHtcblx0Ly8gXHRyZW5kZXJlcjogbmV3IG1hcmtlZC5SZW5kZXJlcigpLFxuXHQvLyBcdGdmbTogdHJ1ZSxcblx0Ly8gXHR0YWJsZXM6IHRydWUsXG5cdC8vIFx0YnJlYWtzOiB0cnVlLFxuXHQvLyBcdHBlZGFudGljOiBmYWxzZSxcblx0Ly8gXHRzYW5pdGl6ZTogdHJ1ZSxcblx0Ly8gXHRzbWFydExpc3RzOiB0cnVlLFxuXHQvLyBcdHNtYXJ0eXBhbnRzOiBmYWxzZVxuXHQvLyB9KTtcblx0cmV0dXJuIGZ1bmN0aW9uKHRleHQpe1xuXHRcdGlmKHRleHQpe1xuXHRcdFx0cmV0dXJuICRzY2UudHJ1c3RBc0h0bWwobWFya2VkKHRleHQpKTtcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHRyZXR1cm4gdW5kZWZpbmVkO1xuXHRcdH1cblx0fTtcbn0pOyIsImFwcC5kaXJlY3RpdmUoJ2NtZWRpdCcsIGZ1bmN0aW9uKCl7XG5cdHJldHVybiB7XG5cdFx0cmVzdHJpY3QgOiAnQScsXG5cdFx0c2NvcGU6IHtcblx0XHRcdG5nTW9kZWwgOiAnPScsXG5cdFx0XHR1cGRhdGVmdW5jOiAnPSdcblx0XHR9LFxuXHRcdGxpbmsgOiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cmlidXRlKXtcblx0XHRcdHZhciB1cGRhdGVUZXh0ID0gZnVuY3Rpb24oKXtcblx0XHRcdFx0dmFyIG5ld1ZhbHVlID0gbXlDb2RlTWlycm9yLmdldFZhbHVlKCk7XG5cdFx0XHRcdHNjb3BlLm5nTW9kZWwgPSBuZXdWYWx1ZTtcblx0XHRcdFx0c2NvcGUudXBkYXRlZnVuYyhuZXdWYWx1ZSk7XG5cdFx0XHRcdHNjb3BlLiRhcHBseSgpO1xuXHRcdFx0fTtcblx0XHRcdC8vaW5pdGlhbGl6ZSBDb2RlTWlycm9yXG5cdFx0XHR2YXIgbXlDb2RlTWlycm9yID0gQ29kZU1pcnJvci5mcm9tVGV4dEFyZWEoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoYXR0cmlidXRlLmlkKSwge1xuXHRcdFx0XHRsaW5lTnVtYmVycyA6IHRydWUsXG5cdFx0XHRcdG1vZGU6ICdqYXZhc2NyaXB0Jyxcblx0XHRcdFx0YXV0b2ZvY3VzIDogdHJ1ZSxcblx0XHRcdFx0dGhlbWUgOiAndHdpbGlnaHQnLFxuXHRcdFx0XHRsaW5lV3JhcHBpbmc6IHRydWVcblx0XHRcdH0pO1xuXHRcdFx0bXlDb2RlTWlycm9yLnNldFZhbHVlKHNjb3BlLm5nTW9kZWwpO1xuXG5cdFx0XHRteUNvZGVNaXJyb3Iub24oXCJjaGFuZ2VcIiwgZnVuY3Rpb24gKG15Q29kZU1pcnJvciwgY2hhbmdlT2JqKXtcblx0XHQgICAgXHR1cGRhdGVUZXh0KCk7XG5cdFx0ICAgIH0pO1xuXHRcdH1cblx0fTtcbn0pOyIsImFwcC5kaXJlY3RpdmUoJ2NtcmVhZCcsIGZ1bmN0aW9uKCl7XG5cdHJldHVybiB7XG5cdFx0cmVzdHJpY3QgOiAnQScsXG5cdFx0c2NvcGU6IHtcblx0XHRcdG5nTW9kZWwgOiAnPSdcblx0XHR9LFxuXHRcdGxpbmsgOiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cmlidXRlKXtcblx0XHRcdC8vaW5pdGlhbGl6ZSBDb2RlTWlycm9yXG5cdFx0XHR2YXIgbXlDb2RlTWlycm9yID0gQ29kZU1pcnJvci5mcm9tVGV4dEFyZWEoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbXBpbGUnKSwge1xuXHRcdFx0XHRyZWFkT25seSA6ICdub2N1cnNvcicsXG5cdFx0XHRcdG1vZGU6ICdqYXZhc2NyaXB0Jyxcblx0XHRcdFx0YXV0b2ZvY3VzIDogdHJ1ZSxcblx0XHRcdFx0dGhlbWUgOiAndHdpbGlnaHQnLFxuXHRcdFx0XHRsaW5lV3JhcHBpbmc6IHRydWVcblx0XHRcdH0pO1xuXG5cdFx0XHRteUNvZGVNaXJyb3Iuc2V0VmFsdWUoc2NvcGUubmdNb2RlbCk7XG5cdFx0fVxuXHR9O1xufSk7IiwiYXBwLmRpcmVjdGl2ZSgnamhyJywgZnVuY3Rpb24oSmFzbWluZVJlcG9ydGVyKXtcblx0cmV0dXJuIHtcblx0XHRyZXN0cmljdCA6ICdFJyxcblx0XHR0cmFuc2NsdWRlOiB0cnVlLFxuXHRcdHRlbXBsYXRlVXJsIDogJ2ZlYXR1cmVzL2NvbW1vbi9kaXJlY3RpdmVzL2phc21pbmUtaHRtbC1yZXBvcnRlci9qYXNtaW5lLWh0bWwtcmVwb3J0ZXIuaHRtbCcsXG5cdFx0bGluayA6IGZ1bmN0aW9uIChzY29wZSwgZWxlbWVudCwgYXR0cmlidXRlKXtcblx0XHRcdEphc21pbmVSZXBvcnRlci5jcmVhdGVKYXNtaW5lUmVwb3J0ZXIoZWxlbWVudFswXSk7XG5cdFx0XHRjb25zb2xlLmxvZygpLy9jaGlsZHJlblswXS5lbnYuZXhlY3V0ZSgpO1xuXHRcdH1cblx0fTtcbn0pO1xuXG5hcHAuZmFjdG9yeSgnSmFzbWluZVJlcG9ydGVyJywgZnVuY3Rpb24oKXtcblx0ZnVuY3Rpb24gaW5pdGlhbGl6ZUphc21pbmUoKXtcblx0XHQvKlxuXHRcdENvcHlyaWdodCAoYykgMjAwOC0yMDE1IFBpdm90YWwgTGFic1xuXG5cdFx0UGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nXG5cdFx0YSBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG5cdFx0XCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG5cdFx0d2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuXHRcdGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0b1xuXHRcdHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0b1xuXHRcdHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcblxuXHRcdFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlXG5cdFx0aW5jbHVkZWQgaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG5cblx0XHRUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELFxuXHRcdEVYUFJFU1MgT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuXHRcdE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EXG5cdFx0Tk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRVxuXHRcdExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT05cblx0XHRPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT05cblx0XHRXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblx0XHQqL1xuXHRcdC8qKlxuXHRcdCBTdGFydGluZyB3aXRoIHZlcnNpb24gMi4wLCB0aGlzIGZpbGUgXCJib290c1wiIEphc21pbmUsIHBlcmZvcm1pbmcgYWxsIG9mIHRoZSBuZWNlc3NhcnkgaW5pdGlhbGl6YXRpb24gYmVmb3JlIGV4ZWN1dGluZyB0aGUgbG9hZGVkIGVudmlyb25tZW50IGFuZCBhbGwgb2YgYSBwcm9qZWN0J3Mgc3BlY3MuIFRoaXMgZmlsZSBzaG91bGQgYmUgbG9hZGVkIGFmdGVyIGBqYXNtaW5lLmpzYCBhbmQgYGphc21pbmVfaHRtbC5qc2AsIGJ1dCBiZWZvcmUgYW55IHByb2plY3Qgc291cmNlIGZpbGVzIG9yIHNwZWMgZmlsZXMgYXJlIGxvYWRlZC4gVGh1cyB0aGlzIGZpbGUgY2FuIGFsc28gYmUgdXNlZCB0byBjdXN0b21pemUgSmFzbWluZSBmb3IgYSBwcm9qZWN0LlxuXG5cdFx0IElmIGEgcHJvamVjdCBpcyB1c2luZyBKYXNtaW5lIHZpYSB0aGUgc3RhbmRhbG9uZSBkaXN0cmlidXRpb24sIHRoaXMgZmlsZSBjYW4gYmUgY3VzdG9taXplZCBkaXJlY3RseS4gSWYgYSBwcm9qZWN0IGlzIHVzaW5nIEphc21pbmUgdmlhIHRoZSBbUnVieSBnZW1dW2phc21pbmUtZ2VtXSwgdGhpcyBmaWxlIGNhbiBiZSBjb3BpZWQgaW50byB0aGUgc3VwcG9ydCBkaXJlY3RvcnkgdmlhIGBqYXNtaW5lIGNvcHlfYm9vdF9qc2AuIE90aGVyIGVudmlyb25tZW50cyAoZS5nLiwgUHl0aG9uKSB3aWxsIGhhdmUgZGlmZmVyZW50IG1lY2hhbmlzbXMuXG5cblx0XHQgVGhlIGxvY2F0aW9uIG9mIGBib290LmpzYCBjYW4gYmUgc3BlY2lmaWVkIGFuZC9vciBvdmVycmlkZGVuIGluIGBqYXNtaW5lLnltbGAuXG5cblx0XHQgW2phc21pbmUtZ2VtXTogaHR0cDovL2dpdGh1Yi5jb20vcGl2b3RhbC9qYXNtaW5lLWdlbVxuXHRcdCAqL1xuXG5cdFx0KGZ1bmN0aW9uKCkge1xuXHRcdCAgLyoqXG5cdFx0ICAgKiAjIyBSZXF1aXJlICZhbXA7IEluc3RhbnRpYXRlXG5cdFx0ICAgKlxuXHRcdCAgICogUmVxdWlyZSBKYXNtaW5lJ3MgY29yZSBmaWxlcy4gU3BlY2lmaWNhbGx5LCB0aGlzIHJlcXVpcmVzIGFuZCBhdHRhY2hlcyBhbGwgb2YgSmFzbWluZSdzIGNvZGUgdG8gdGhlIGBqYXNtaW5lYCByZWZlcmVuY2UuXG5cdFx0ICAgKi9cblx0XHQgIHdpbmRvdy5qYXNtaW5lID0gamFzbWluZVJlcXVpcmUuY29yZShqYXNtaW5lUmVxdWlyZSk7XG5cblx0XHQgIC8qKlxuXHRcdCAgICogU2luY2UgdGhpcyBpcyBiZWluZyBydW4gaW4gYSBicm93c2VyIGFuZCB0aGUgcmVzdWx0cyBzaG91bGQgcG9wdWxhdGUgdG8gYW4gSFRNTCBwYWdlLCByZXF1aXJlIHRoZSBIVE1MLXNwZWNpZmljIEphc21pbmUgY29kZSwgaW5qZWN0aW5nIHRoZSBzYW1lIHJlZmVyZW5jZS5cblx0XHQgICAqL1xuXHRcdCAgamFzbWluZVJlcXVpcmUuaHRtbChqYXNtaW5lKTtcblxuXHRcdCAgLyoqXG5cdFx0ICAgKiBDcmVhdGUgdGhlIEphc21pbmUgZW52aXJvbm1lbnQuIFRoaXMgaXMgdXNlZCB0byBydW4gYWxsIHNwZWNzIGluIGEgcHJvamVjdC5cblx0XHQgICAqL1xuXHRcdCAgdmFyIGVudiA9IGphc21pbmUuZ2V0RW52KCk7XG5cblx0XHQgIC8qKlxuXHRcdCAgICogIyMgVGhlIEdsb2JhbCBJbnRlcmZhY2Vcblx0XHQgICAqXG5cdFx0ICAgKiBCdWlsZCB1cCB0aGUgZnVuY3Rpb25zIHRoYXQgd2lsbCBiZSBleHBvc2VkIGFzIHRoZSBKYXNtaW5lIHB1YmxpYyBpbnRlcmZhY2UuIEEgcHJvamVjdCBjYW4gY3VzdG9taXplLCByZW5hbWUgb3IgYWxpYXMgYW55IG9mIHRoZXNlIGZ1bmN0aW9ucyBhcyBkZXNpcmVkLCBwcm92aWRlZCB0aGUgaW1wbGVtZW50YXRpb24gcmVtYWlucyB1bmNoYW5nZWQuXG5cdFx0ICAgKi9cblx0XHQgIHZhciBqYXNtaW5lSW50ZXJmYWNlID0gamFzbWluZVJlcXVpcmUuaW50ZXJmYWNlKGphc21pbmUsIGVudik7XG5cblx0XHQgIC8qKlxuXHRcdCAgICogQWRkIGFsbCBvZiB0aGUgSmFzbWluZSBnbG9iYWwvcHVibGljIGludGVyZmFjZSB0byB0aGUgZ2xvYmFsIHNjb3BlLCBzbyBhIHByb2plY3QgY2FuIHVzZSB0aGUgcHVibGljIGludGVyZmFjZSBkaXJlY3RseS4gRm9yIGV4YW1wbGUsIGNhbGxpbmcgYGRlc2NyaWJlYCBpbiBzcGVjcyBpbnN0ZWFkIG9mIGBqYXNtaW5lLmdldEVudigpLmRlc2NyaWJlYC5cblx0XHQgICAqL1xuXHRcdCAgZXh0ZW5kKHdpbmRvdywgamFzbWluZUludGVyZmFjZSk7XG5cblx0XHQgIC8qKlxuXHRcdCAgICogIyMgUnVubmVyIFBhcmFtZXRlcnNcblx0XHQgICAqXG5cdFx0ICAgKiBNb3JlIGJyb3dzZXIgc3BlY2lmaWMgY29kZSAtIHdyYXAgdGhlIHF1ZXJ5IHN0cmluZyBpbiBhbiBvYmplY3QgYW5kIHRvIGFsbG93IGZvciBnZXR0aW5nL3NldHRpbmcgcGFyYW1ldGVycyBmcm9tIHRoZSBydW5uZXIgdXNlciBpbnRlcmZhY2UuXG5cdFx0ICAgKi9cblxuXHRcdCAgdmFyIHF1ZXJ5U3RyaW5nID0gbmV3IGphc21pbmUuUXVlcnlTdHJpbmcoe1xuXHRcdCAgICBnZXRXaW5kb3dMb2NhdGlvbjogZnVuY3Rpb24oKSB7IHJldHVybiB3aW5kb3cubG9jYXRpb247IH1cblx0XHQgIH0pO1xuXG5cdFx0ICB2YXIgY2F0Y2hpbmdFeGNlcHRpb25zID0gcXVlcnlTdHJpbmcuZ2V0UGFyYW0oXCJjYXRjaFwiKTtcblx0XHQgIGVudi5jYXRjaEV4Y2VwdGlvbnModHlwZW9mIGNhdGNoaW5nRXhjZXB0aW9ucyA9PT0gXCJ1bmRlZmluZWRcIiA/IHRydWUgOiBjYXRjaGluZ0V4Y2VwdGlvbnMpO1xuXG5cdFx0ICB2YXIgdGhyb3dpbmdFeHBlY3RhdGlvbkZhaWx1cmVzID0gcXVlcnlTdHJpbmcuZ2V0UGFyYW0oXCJ0aHJvd0ZhaWx1cmVzXCIpO1xuXHRcdCAgZW52LnRocm93T25FeHBlY3RhdGlvbkZhaWx1cmUodGhyb3dpbmdFeHBlY3RhdGlvbkZhaWx1cmVzKTtcblxuXHRcdCAgLyoqXG5cdFx0ICAgKiBUaGUgYGpzQXBpUmVwb3J0ZXJgIGFsc28gcmVjZWl2ZXMgc3BlYyByZXN1bHRzLCBhbmQgaXMgdXNlZCBieSBhbnkgZW52aXJvbm1lbnQgdGhhdCBuZWVkcyB0byBleHRyYWN0IHRoZSByZXN1bHRzICBmcm9tIEphdmFTY3JpcHQuXG5cdFx0ICAgKi9cblx0XHQgIGVudi5hZGRSZXBvcnRlcihqYXNtaW5lSW50ZXJmYWNlLmpzQXBpUmVwb3J0ZXIpO1xuXG5cdFx0ICAvKipcblx0XHQgICAqIEZpbHRlciB3aGljaCBzcGVjcyB3aWxsIGJlIHJ1biBieSBtYXRjaGluZyB0aGUgc3RhcnQgb2YgdGhlIGZ1bGwgbmFtZSBhZ2FpbnN0IHRoZSBgc3BlY2AgcXVlcnkgcGFyYW0uXG5cdFx0ICAgKi9cblx0XHQgIHZhciBzcGVjRmlsdGVyID0gbmV3IGphc21pbmUuSHRtbFNwZWNGaWx0ZXIoe1xuXHRcdCAgICBmaWx0ZXJTdHJpbmc6IGZ1bmN0aW9uKCkgeyByZXR1cm4gcXVlcnlTdHJpbmcuZ2V0UGFyYW0oXCJzcGVjXCIpOyB9XG5cdFx0ICB9KTtcblxuXHRcdCAgZW52LnNwZWNGaWx0ZXIgPSBmdW5jdGlvbihzcGVjKSB7XG5cdFx0ICAgIHJldHVybiBzcGVjRmlsdGVyLm1hdGNoZXMoc3BlYy5nZXRGdWxsTmFtZSgpKTtcblx0XHQgIH07XG5cblx0XHQgIC8qKlxuXHRcdCAgICogU2V0dGluZyB1cCB0aW1pbmcgZnVuY3Rpb25zIHRvIGJlIGFibGUgdG8gYmUgb3ZlcnJpZGRlbi4gQ2VydGFpbiBicm93c2VycyAoU2FmYXJpLCBJRSA4LCBwaGFudG9tanMpIHJlcXVpcmUgdGhpcyBoYWNrLlxuXHRcdCAgICovXG5cdFx0ICB3aW5kb3cuc2V0VGltZW91dCA9IHdpbmRvdy5zZXRUaW1lb3V0O1xuXHRcdCAgd2luZG93LnNldEludGVydmFsID0gd2luZG93LnNldEludGVydmFsO1xuXHRcdCAgd2luZG93LmNsZWFyVGltZW91dCA9IHdpbmRvdy5jbGVhclRpbWVvdXQ7XG5cdFx0ICB3aW5kb3cuY2xlYXJJbnRlcnZhbCA9IHdpbmRvdy5jbGVhckludGVydmFsO1xuXG5cdFx0ICAvKipcblx0XHQgICAqICMjIEV4ZWN1dGlvblxuXHRcdCAgICpcblx0XHQgICAqIFJlcGxhY2UgdGhlIGJyb3dzZXIgd2luZG93J3MgYG9ubG9hZGAsIGVuc3VyZSBpdCdzIGNhbGxlZCwgYW5kIHRoZW4gcnVuIGFsbCBvZiB0aGUgbG9hZGVkIHNwZWNzLiBUaGlzIGluY2x1ZGVzIGluaXRpYWxpemluZyB0aGUgYEh0bWxSZXBvcnRlcmAgaW5zdGFuY2UgYW5kIHRoZW4gZXhlY3V0aW5nIHRoZSBsb2FkZWQgSmFzbWluZSBlbnZpcm9ubWVudC4gQWxsIG9mIHRoaXMgd2lsbCBoYXBwZW4gYWZ0ZXIgYWxsIG9mIHRoZSBzcGVjcyBhcmUgbG9hZGVkLlxuXHRcdCAgICovXG5cdFx0ICB2YXIgY3VycmVudFdpbmRvd09ubG9hZCA9IHdpbmRvdy5vbmxvYWQ7XG5cblx0XHQgIChmdW5jdGlvbigpIHtcblx0XHQgICAgaWYgKGN1cnJlbnRXaW5kb3dPbmxvYWQpIHtcblx0XHQgICAgICBjdXJyZW50V2luZG93T25sb2FkKCk7XG5cdFx0ICAgIH1cblx0XHQgICAgZW52LmV4ZWN1dGUoKTtcblx0XHQgIH0pKCk7XG5cblx0XHQgIC8qKlxuXHRcdCAgICogSGVscGVyIGZ1bmN0aW9uIGZvciByZWFkYWJpbGl0eSBhYm92ZS5cblx0XHQgICAqL1xuXHRcdCAgZnVuY3Rpb24gZXh0ZW5kKGRlc3RpbmF0aW9uLCBzb3VyY2UpIHtcblx0XHQgICAgZm9yICh2YXIgcHJvcGVydHkgaW4gc291cmNlKSBkZXN0aW5hdGlvbltwcm9wZXJ0eV0gPSBzb3VyY2VbcHJvcGVydHldO1xuXHRcdCAgICByZXR1cm4gZGVzdGluYXRpb247XG5cdFx0ICB9XG5cblx0XHR9KSgpO1xuXHR9XG5cblx0ZnVuY3Rpb24gZ2VuZXJhdGVKYXNtaW5lUmVwb3J0ZXIoY29udGFpbmVyKXtcblx0XHQoZnVuY3Rpb24oY29udGFpbmVyKSB7XG5cdFx0XHR2YXIgamFzbWluZSA9IHdpbmRvdy5qYXNtaW5lO1xuXHRcdFx0dmFyIGVudiA9IGphc21pbmUuZ2V0RW52KCk7XG5cblx0XHRcdHZhciBxdWVyeVN0cmluZyA9IG5ldyBqYXNtaW5lLlF1ZXJ5U3RyaW5nKHtcblx0XHRcdFx0Z2V0V2luZG93TG9jYXRpb246IGZ1bmN0aW9uKCkgeyByZXR1cm4gd2luZG93LmxvY2F0aW9uOyB9XG5cdFx0XHR9KTtcblxuXHRcdFx0dmFyIGNhdGNoaW5nRXhjZXB0aW9ucyA9IHF1ZXJ5U3RyaW5nLmdldFBhcmFtKFwiY2F0Y2hcIik7XG5cdFx0XHRlbnYuY2F0Y2hFeGNlcHRpb25zKHR5cGVvZiBjYXRjaGluZ0V4Y2VwdGlvbnMgPT09IFwidW5kZWZpbmVkXCIgPyB0cnVlIDogY2F0Y2hpbmdFeGNlcHRpb25zKTtcblxuXHRcdFx0dmFyIHRocm93aW5nRXhwZWN0YXRpb25GYWlsdXJlcyA9IHF1ZXJ5U3RyaW5nLmdldFBhcmFtKFwidGhyb3dGYWlsdXJlc1wiKTtcblx0XHRcdGVudi50aHJvd09uRXhwZWN0YXRpb25GYWlsdXJlKHRocm93aW5nRXhwZWN0YXRpb25GYWlsdXJlcyk7XG5cblx0XHRcdC8qKlxuXHRcdFx0XHQqICMjIFJlcG9ydGVyc1xuXHRcdFx0XHQqIFRoZSBgSHRtbFJlcG9ydGVyYCBidWlsZHMgYWxsIG9mIHRoZSBIVE1MIFVJIGZvciB0aGUgcnVubmVyIHBhZ2UuIFRoaXMgcmVwb3J0ZXIgcGFpbnRzIHRoZSBkb3RzLCBzdGFycywgYW5kIHgncyBmb3Igc3BlY3MsIGFzIHdlbGwgYXMgYWxsIHNwZWMgbmFtZXMgYW5kIGFsbCBmYWlsdXJlcyAoaWYgYW55KS5cblx0XHRcdCovXG5cdFx0XHR2YXIgaHRtbFJlcG9ydGVyID0gbmV3IGphc21pbmUuSHRtbFJlcG9ydGVyKHtcblx0XHRcdFx0ZW52OiBlbnYsXG5cdFx0XHRcdG9uUmFpc2VFeGNlcHRpb25zQ2xpY2s6IGZ1bmN0aW9uKCkgeyBxdWVyeVN0cmluZy5uYXZpZ2F0ZVdpdGhOZXdQYXJhbShcImNhdGNoXCIsICFlbnYuY2F0Y2hpbmdFeGNlcHRpb25zKCkpOyB9LFxuXHRcdFx0XHRvblRocm93RXhwZWN0YXRpb25zQ2xpY2s6IGZ1bmN0aW9uKCkgeyBxdWVyeVN0cmluZy5uYXZpZ2F0ZVdpdGhOZXdQYXJhbShcInRocm93RmFpbHVyZXNcIiwgIWVudi50aHJvd2luZ0V4cGVjdGF0aW9uRmFpbHVyZXMoKSk7IH0sXG5cdFx0XHRcdGFkZFRvRXhpc3RpbmdRdWVyeVN0cmluZzogZnVuY3Rpb24oa2V5LCB2YWx1ZSkgeyByZXR1cm4gcXVlcnlTdHJpbmcuZnVsbFN0cmluZ1dpdGhOZXdQYXJhbShrZXksIHZhbHVlKTsgfSxcblx0XHRcdFx0Z2V0Q29udGFpbmVyOiBmdW5jdGlvbigpIHsgcmV0dXJuIGNvbnRhaW5lcjsgfSxcblx0XHRcdFx0Y3JlYXRlRWxlbWVudDogZnVuY3Rpb24oKSB7IHJldHVybiBkb2N1bWVudC5jcmVhdGVFbGVtZW50LmFwcGx5KGRvY3VtZW50LCBhcmd1bWVudHMpOyB9LFxuXHRcdFx0XHRjcmVhdGVUZXh0Tm9kZTogZnVuY3Rpb24oKSB7IHJldHVybiBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZS5hcHBseShkb2N1bWVudCwgYXJndW1lbnRzKTsgfSxcblx0XHRcdFx0dGltZXI6IG5ldyBqYXNtaW5lLlRpbWVyKClcblx0XHRcdH0pO1xuXHRcdFx0LyoqXG5cdFx0XHQqIEZpbHRlciB3aGljaCBzcGVjcyB3aWxsIGJlIHJ1biBieSBtYXRjaGluZyB0aGUgc3RhcnQgb2YgdGhlIGZ1bGwgbmFtZSBhZ2FpbnN0IHRoZSBgc3BlY2AgcXVlcnkgcGFyYW0uXG5cdFx0XHQqL1xuXHRcdFx0dmFyIHNwZWNGaWx0ZXIgPSBuZXcgamFzbWluZS5IdG1sU3BlY0ZpbHRlcih7XG5cdFx0XHRcdGZpbHRlclN0cmluZzogZnVuY3Rpb24oKSB7IHJldHVybiBxdWVyeVN0cmluZy5nZXRQYXJhbShcInNwZWNcIik7IH1cblx0XHRcdH0pO1xuXG5cdFx0XHRlbnYuc3BlY0ZpbHRlciA9IGZ1bmN0aW9uKHNwZWMpIHtcblx0XHRcdFx0cmV0dXJuIHNwZWNGaWx0ZXIubWF0Y2hlcyhzcGVjLmdldEZ1bGxOYW1lKCkpO1xuXHRcdFx0fTtcblx0XHRcdGVudi5hZGRSZXBvcnRlcihodG1sUmVwb3J0ZXIpO1xuXHRcdFx0aHRtbFJlcG9ydGVyLmluaXRpYWxpemUoKTtcblx0XHRcdGVudi5leGVjdXRlKCk7XG5cdFx0fSkoY29udGFpbmVyKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGNyZWF0ZUphc21pbmVSZXBvcnRlcihjb250YWluZXIpe1xuXHQvKlxuXHRcdENvcHlyaWdodCAoYykgMjAwOC0yMDE1IFBpdm90YWwgTGFic1xuXG5cdFx0UGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nXG5cdFx0YSBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG5cdFx0XCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG5cdFx0d2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuXHRcdGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0b1xuXHRcdHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0b1xuXHRcdHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcblxuXHRcdFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlXG5cdFx0aW5jbHVkZWQgaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG5cblx0XHRUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELFxuXHRcdEVYUFJFU1MgT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuXHRcdE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EXG5cdFx0Tk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRVxuXHRcdExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT05cblx0XHRPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT05cblx0XHRXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblx0XHQqL1xuXHRcdC8qKlxuXHRcdCBTdGFydGluZyB3aXRoIHZlcnNpb24gMi4wLCB0aGlzIGZpbGUgXCJib290c1wiIEphc21pbmUsIHBlcmZvcm1pbmcgYWxsIG9mIHRoZSBuZWNlc3NhcnkgaW5pdGlhbGl6YXRpb24gYmVmb3JlIGV4ZWN1dGluZyB0aGUgbG9hZGVkIGVudmlyb25tZW50IGFuZCBhbGwgb2YgYSBwcm9qZWN0J3Mgc3BlY3MuIFRoaXMgZmlsZSBzaG91bGQgYmUgbG9hZGVkIGFmdGVyIGBqYXNtaW5lLmpzYCBhbmQgYGphc21pbmVfaHRtbC5qc2AsIGJ1dCBiZWZvcmUgYW55IHByb2plY3Qgc291cmNlIGZpbGVzIG9yIHNwZWMgZmlsZXMgYXJlIGxvYWRlZC4gVGh1cyB0aGlzIGZpbGUgY2FuIGFsc28gYmUgdXNlZCB0byBjdXN0b21pemUgSmFzbWluZSBmb3IgYSBwcm9qZWN0LlxuXG5cdFx0IElmIGEgcHJvamVjdCBpcyB1c2luZyBKYXNtaW5lIHZpYSB0aGUgc3RhbmRhbG9uZSBkaXN0cmlidXRpb24sIHRoaXMgZmlsZSBjYW4gYmUgY3VzdG9taXplZCBkaXJlY3RseS4gSWYgYSBwcm9qZWN0IGlzIHVzaW5nIEphc21pbmUgdmlhIHRoZSBbUnVieSBnZW1dW2phc21pbmUtZ2VtXSwgdGhpcyBmaWxlIGNhbiBiZSBjb3BpZWQgaW50byB0aGUgc3VwcG9ydCBkaXJlY3RvcnkgdmlhIGBqYXNtaW5lIGNvcHlfYm9vdF9qc2AuIE90aGVyIGVudmlyb25tZW50cyAoZS5nLiwgUHl0aG9uKSB3aWxsIGhhdmUgZGlmZmVyZW50IG1lY2hhbmlzbXMuXG5cblx0XHQgVGhlIGxvY2F0aW9uIG9mIGBib290LmpzYCBjYW4gYmUgc3BlY2lmaWVkIGFuZC9vciBvdmVycmlkZGVuIGluIGBqYXNtaW5lLnltbGAuXG5cblx0XHQgW2phc21pbmUtZ2VtXTogaHR0cDovL2dpdGh1Yi5jb20vcGl2b3RhbC9qYXNtaW5lLWdlbVxuXHRcdCAqL1xuXG5cdFx0KGZ1bmN0aW9uKGNvbnRhaW5lcikge1xuXHRcdCAgLyoqXG5cdFx0ICAgKiAjIyBSZXF1aXJlICZhbXA7IEluc3RhbnRpYXRlXG5cdFx0ICAgKlxuXHRcdCAgICogUmVxdWlyZSBKYXNtaW5lJ3MgY29yZSBmaWxlcy4gU3BlY2lmaWNhbGx5LCB0aGlzIHJlcXVpcmVzIGFuZCBhdHRhY2hlcyBhbGwgb2YgSmFzbWluZSdzIGNvZGUgdG8gdGhlIGBqYXNtaW5lYCByZWZlcmVuY2UuXG5cdFx0ICAgKi9cblx0XHQgIHdpbmRvdy5qYXNtaW5lID0gamFzbWluZVJlcXVpcmUuY29yZShqYXNtaW5lUmVxdWlyZSk7XG5cblx0XHQgIC8qKlxuXHRcdCAgICogU2luY2UgdGhpcyBpcyBiZWluZyBydW4gaW4gYSBicm93c2VyIGFuZCB0aGUgcmVzdWx0cyBzaG91bGQgcG9wdWxhdGUgdG8gYW4gSFRNTCBwYWdlLCByZXF1aXJlIHRoZSBIVE1MLXNwZWNpZmljIEphc21pbmUgY29kZSwgaW5qZWN0aW5nIHRoZSBzYW1lIHJlZmVyZW5jZS5cblx0XHQgICAqL1xuXHRcdCAgamFzbWluZVJlcXVpcmUuaHRtbChqYXNtaW5lKTtcblxuXHRcdCAgLyoqXG5cdFx0ICAgKiBDcmVhdGUgdGhlIEphc21pbmUgZW52aXJvbm1lbnQuIFRoaXMgaXMgdXNlZCB0byBydW4gYWxsIHNwZWNzIGluIGEgcHJvamVjdC5cblx0XHQgICAqL1xuXHRcdCAgdmFyIGVudiA9IGphc21pbmUuZ2V0RW52KCk7XG5cblx0XHQgIC8qKlxuXHRcdCAgICogIyMgVGhlIEdsb2JhbCBJbnRlcmZhY2Vcblx0XHQgICAqXG5cdFx0ICAgKiBCdWlsZCB1cCB0aGUgZnVuY3Rpb25zIHRoYXQgd2lsbCBiZSBleHBvc2VkIGFzIHRoZSBKYXNtaW5lIHB1YmxpYyBpbnRlcmZhY2UuIEEgcHJvamVjdCBjYW4gY3VzdG9taXplLCByZW5hbWUgb3IgYWxpYXMgYW55IG9mIHRoZXNlIGZ1bmN0aW9ucyBhcyBkZXNpcmVkLCBwcm92aWRlZCB0aGUgaW1wbGVtZW50YXRpb24gcmVtYWlucyB1bmNoYW5nZWQuXG5cdFx0ICAgKi9cblx0XHQgIHZhciBqYXNtaW5lSW50ZXJmYWNlID0gamFzbWluZVJlcXVpcmUuaW50ZXJmYWNlKGphc21pbmUsIGVudik7XG5cblx0XHQgIC8qKlxuXHRcdCAgICogQWRkIGFsbCBvZiB0aGUgSmFzbWluZSBnbG9iYWwvcHVibGljIGludGVyZmFjZSB0byB0aGUgZ2xvYmFsIHNjb3BlLCBzbyBhIHByb2plY3QgY2FuIHVzZSB0aGUgcHVibGljIGludGVyZmFjZSBkaXJlY3RseS4gRm9yIGV4YW1wbGUsIGNhbGxpbmcgYGRlc2NyaWJlYCBpbiBzcGVjcyBpbnN0ZWFkIG9mIGBqYXNtaW5lLmdldEVudigpLmRlc2NyaWJlYC5cblx0XHQgICAqL1xuXHRcdCAgZXh0ZW5kKHdpbmRvdywgamFzbWluZUludGVyZmFjZSk7XG5cblx0XHQgIC8qKlxuXHRcdCAgICogIyMgUnVubmVyIFBhcmFtZXRlcnNcblx0XHQgICAqXG5cdFx0ICAgKiBNb3JlIGJyb3dzZXIgc3BlY2lmaWMgY29kZSAtIHdyYXAgdGhlIHF1ZXJ5IHN0cmluZyBpbiBhbiBvYmplY3QgYW5kIHRvIGFsbG93IGZvciBnZXR0aW5nL3NldHRpbmcgcGFyYW1ldGVycyBmcm9tIHRoZSBydW5uZXIgdXNlciBpbnRlcmZhY2UuXG5cdFx0ICAgKi9cblxuXHRcdCAgdmFyIHF1ZXJ5U3RyaW5nID0gbmV3IGphc21pbmUuUXVlcnlTdHJpbmcoe1xuXHRcdCAgICBnZXRXaW5kb3dMb2NhdGlvbjogZnVuY3Rpb24oKSB7IHJldHVybiB3aW5kb3cubG9jYXRpb247IH1cblx0XHQgIH0pO1xuXG5cdFx0ICB2YXIgY2F0Y2hpbmdFeGNlcHRpb25zID0gcXVlcnlTdHJpbmcuZ2V0UGFyYW0oXCJjYXRjaFwiKTtcblx0XHQgIGVudi5jYXRjaEV4Y2VwdGlvbnModHlwZW9mIGNhdGNoaW5nRXhjZXB0aW9ucyA9PT0gXCJ1bmRlZmluZWRcIiA/IHRydWUgOiBjYXRjaGluZ0V4Y2VwdGlvbnMpO1xuXG5cdFx0ICB2YXIgdGhyb3dpbmdFeHBlY3RhdGlvbkZhaWx1cmVzID0gcXVlcnlTdHJpbmcuZ2V0UGFyYW0oXCJ0aHJvd0ZhaWx1cmVzXCIpO1xuXHRcdCAgZW52LnRocm93T25FeHBlY3RhdGlvbkZhaWx1cmUodGhyb3dpbmdFeHBlY3RhdGlvbkZhaWx1cmVzKTtcblxuXHRcdCAgLyoqXG5cdFx0ICAgKiAjIyBSZXBvcnRlcnNcblx0XHQgICAqIFRoZSBgSHRtbFJlcG9ydGVyYCBidWlsZHMgYWxsIG9mIHRoZSBIVE1MIFVJIGZvciB0aGUgcnVubmVyIHBhZ2UuIFRoaXMgcmVwb3J0ZXIgcGFpbnRzIHRoZSBkb3RzLCBzdGFycywgYW5kIHgncyBmb3Igc3BlY3MsIGFzIHdlbGwgYXMgYWxsIHNwZWMgbmFtZXMgYW5kIGFsbCBmYWlsdXJlcyAoaWYgYW55KS5cblx0XHQgICAqL1xuXHRcdCAgdmFyIGh0bWxSZXBvcnRlciA9IG5ldyBqYXNtaW5lLkh0bWxSZXBvcnRlcih7XG5cdFx0ICAgIGVudjogZW52LFxuXHRcdCAgICBvblJhaXNlRXhjZXB0aW9uc0NsaWNrOiBmdW5jdGlvbigpIHsgcXVlcnlTdHJpbmcubmF2aWdhdGVXaXRoTmV3UGFyYW0oXCJjYXRjaFwiLCAhZW52LmNhdGNoaW5nRXhjZXB0aW9ucygpKTsgfSxcblx0XHQgICAgb25UaHJvd0V4cGVjdGF0aW9uc0NsaWNrOiBmdW5jdGlvbigpIHsgcXVlcnlTdHJpbmcubmF2aWdhdGVXaXRoTmV3UGFyYW0oXCJ0aHJvd0ZhaWx1cmVzXCIsICFlbnYudGhyb3dpbmdFeHBlY3RhdGlvbkZhaWx1cmVzKCkpOyB9LFxuXHRcdCAgICBhZGRUb0V4aXN0aW5nUXVlcnlTdHJpbmc6IGZ1bmN0aW9uKGtleSwgdmFsdWUpIHsgcmV0dXJuIHF1ZXJ5U3RyaW5nLmZ1bGxTdHJpbmdXaXRoTmV3UGFyYW0oa2V5LCB2YWx1ZSk7IH0sXG5cdFx0ICAgIGdldENvbnRhaW5lcjogZnVuY3Rpb24oKSB7IHJldHVybiBjb250YWluZXI7IH0sXG5cdFx0ICAgIGNyZWF0ZUVsZW1lbnQ6IGZ1bmN0aW9uKCkgeyByZXR1cm4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudC5hcHBseShkb2N1bWVudCwgYXJndW1lbnRzKTsgfSxcblx0XHQgICAgY3JlYXRlVGV4dE5vZGU6IGZ1bmN0aW9uKCkgeyByZXR1cm4gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUuYXBwbHkoZG9jdW1lbnQsIGFyZ3VtZW50cyk7IH0sXG5cdFx0ICAgIHRpbWVyOiBuZXcgamFzbWluZS5UaW1lcigpXG5cdFx0ICB9KTtcblxuXHRcdCAgLyoqXG5cdFx0ICAgKiBUaGUgYGpzQXBpUmVwb3J0ZXJgIGFsc28gcmVjZWl2ZXMgc3BlYyByZXN1bHRzLCBhbmQgaXMgdXNlZCBieSBhbnkgZW52aXJvbm1lbnQgdGhhdCBuZWVkcyB0byBleHRyYWN0IHRoZSByZXN1bHRzICBmcm9tIEphdmFTY3JpcHQuXG5cdFx0ICAgKi9cblx0XHQgIGVudi5hZGRSZXBvcnRlcihqYXNtaW5lSW50ZXJmYWNlLmpzQXBpUmVwb3J0ZXIpO1xuXHRcdCAgZW52LmFkZFJlcG9ydGVyKGh0bWxSZXBvcnRlcik7XG5cblx0XHQgIC8qKlxuXHRcdCAgICogRmlsdGVyIHdoaWNoIHNwZWNzIHdpbGwgYmUgcnVuIGJ5IG1hdGNoaW5nIHRoZSBzdGFydCBvZiB0aGUgZnVsbCBuYW1lIGFnYWluc3QgdGhlIGBzcGVjYCBxdWVyeSBwYXJhbS5cblx0XHQgICAqL1xuXHRcdCAgdmFyIHNwZWNGaWx0ZXIgPSBuZXcgamFzbWluZS5IdG1sU3BlY0ZpbHRlcih7XG5cdFx0ICAgIGZpbHRlclN0cmluZzogZnVuY3Rpb24oKSB7IHJldHVybiBxdWVyeVN0cmluZy5nZXRQYXJhbShcInNwZWNcIik7IH1cblx0XHQgIH0pO1xuXG5cdFx0ICBlbnYuc3BlY0ZpbHRlciA9IGZ1bmN0aW9uKHNwZWMpIHtcblx0XHQgICAgcmV0dXJuIHNwZWNGaWx0ZXIubWF0Y2hlcyhzcGVjLmdldEZ1bGxOYW1lKCkpO1xuXHRcdCAgfTtcblxuXHRcdCAgLyoqXG5cdFx0ICAgKiBTZXR0aW5nIHVwIHRpbWluZyBmdW5jdGlvbnMgdG8gYmUgYWJsZSB0byBiZSBvdmVycmlkZGVuLiBDZXJ0YWluIGJyb3dzZXJzIChTYWZhcmksIElFIDgsIHBoYW50b21qcykgcmVxdWlyZSB0aGlzIGhhY2suXG5cdFx0ICAgKi9cblx0XHQgIHdpbmRvdy5zZXRUaW1lb3V0ID0gd2luZG93LnNldFRpbWVvdXQ7XG5cdFx0ICB3aW5kb3cuc2V0SW50ZXJ2YWwgPSB3aW5kb3cuc2V0SW50ZXJ2YWw7XG5cdFx0ICB3aW5kb3cuY2xlYXJUaW1lb3V0ID0gd2luZG93LmNsZWFyVGltZW91dDtcblx0XHQgIHdpbmRvdy5jbGVhckludGVydmFsID0gd2luZG93LmNsZWFySW50ZXJ2YWw7XG5cblx0XHQgIC8qKlxuXHRcdCAgICogIyMgRXhlY3V0aW9uXG5cdFx0ICAgKlxuXHRcdCAgICogUmVwbGFjZSB0aGUgYnJvd3NlciB3aW5kb3cncyBgb25sb2FkYCwgZW5zdXJlIGl0J3MgY2FsbGVkLCBhbmQgdGhlbiBydW4gYWxsIG9mIHRoZSBsb2FkZWQgc3BlY3MuIFRoaXMgaW5jbHVkZXMgaW5pdGlhbGl6aW5nIHRoZSBgSHRtbFJlcG9ydGVyYCBpbnN0YW5jZSBhbmQgdGhlbiBleGVjdXRpbmcgdGhlIGxvYWRlZCBKYXNtaW5lIGVudmlyb25tZW50LiBBbGwgb2YgdGhpcyB3aWxsIGhhcHBlbiBhZnRlciBhbGwgb2YgdGhlIHNwZWNzIGFyZSBsb2FkZWQuXG5cdFx0ICAgKi9cblx0XHQgIHZhciBjdXJyZW50V2luZG93T25sb2FkID0gd2luZG93Lm9ubG9hZDtcblxuXHRcdCAgKGZ1bmN0aW9uKCkge1xuXHRcdCAgICAoZnVuY3Rpb24oKXtcblx0XHQgICAgXHRpZiAoY3VycmVudFdpbmRvd09ubG9hZCkge1xuXHRcdFx0ICAgICAgY3VycmVudFdpbmRvd09ubG9hZCgpO1xuXHRcdFx0ICAgIH1cblx0XHRcdCAgICBodG1sUmVwb3J0ZXIuaW5pdGlhbGl6ZSgpO1xuXG5cdFx0XHQgICAgZW52LmV4ZWN1dGUoKTtcblx0XHRcdH0pKCk7XG5cdFx0ICAgIGNvbnNvbGUubG9nKGVudi50b3BTdWl0ZSgpLmNoaWxkcmVuKTtcblx0XHQgIH0pKCk7XG5cblx0XHQgIC8qKlxuXHRcdCAgICogSGVscGVyIGZ1bmN0aW9uIGZvciByZWFkYWJpbGl0eSBhYm92ZS5cblx0XHQgICAqL1xuXHRcdCAgZnVuY3Rpb24gZXh0ZW5kKGRlc3RpbmF0aW9uLCBzb3VyY2UpIHtcblx0XHQgICAgZm9yICh2YXIgcHJvcGVydHkgaW4gc291cmNlKSBkZXN0aW5hdGlvbltwcm9wZXJ0eV0gPSBzb3VyY2VbcHJvcGVydHldO1xuXHRcdCAgICByZXR1cm4gZGVzdGluYXRpb247XG5cdFx0ICB9XG5cblx0XHR9KShjb250YWluZXIpO1xuXG5cdH1cblxuXHRyZXR1cm4ge1xuXHRcdGNyZWF0ZUphc21pbmVSZXBvcnRlciA6IGNyZWF0ZUphc21pbmVSZXBvcnRlcixcblx0XHRpbml0aWFsaXplSmFzbWluZSA6IGluaXRpYWxpemVKYXNtaW5lLFxuXHRcdGdlbmVyYXRlSmFzbWluZVJlcG9ydGVyIDogZ2VuZXJhdGVKYXNtaW5lUmVwb3J0ZXJcblx0fTtcbn0pOyIsImFwcC5kaXJlY3RpdmUoJ2pzbG9hZCcsIGZ1bmN0aW9uKCl7XG5cdGZ1bmN0aW9uIHVwZGF0ZVNjcmlwdChlbGVtZW50LCB0ZXh0KXtcblx0XHRlbGVtZW50LmVtcHR5KCk7XG5cdFx0dmFyIHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xuXHRcdHNjcmlwdC50eXBlID0gJ3RleHQvamF2YXNjcmlwdCc7XG5cdFx0c2NyaXB0LmlubmVySFRNTCA9IHRleHQ7XG5cdFx0Y29uc29sZS5sb2coc2NyaXB0KTtcblx0XHRlbGVtZW50LmFwcGVuZChzY3JpcHQpO1xuXHR9XG5cdHJldHVybiB7XG5cdFx0cmVzdHJpY3QgOiAnRScsXG5cdFx0c2NvcGUgOiB7XG5cdFx0XHR0ZXh0IDogJz0nXG5cdFx0fSxcblx0XHR0ZW1wbGF0ZVVybDogJ2ZlYXR1cmVzL2NvbW1vbi9kaXJlY3RpdmVzL2pzLWxvYWQvanMtbG9hZC5odG1sJyxcblx0XHRsaW5rIDogZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHJpYnV0ZXMpe1xuXHRcdFx0c2NvcGUuJHdhdGNoKCd0ZXh0JywgZnVuY3Rpb24odGV4dCl7XG5cdFx0XHRcdHVwZGF0ZVNjcmlwdChlbGVtZW50LCB0ZXh0KTtcblx0XHRcdH0pO1xuXHRcdH1cblx0fTtcbn0pO1xuXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=