// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
var app = angular.module('mide', ['ionic', 'ionic.utils'])

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


app.controller('ChallengeCodeCtrl', function($scope, $state, $rootScope, ChallengeFactory, ChallengeFooterFactory, $ionicPopup, $localstorage){

	setTimeout(function (){
		// $scope.keyboardVis = window.cordova.plugins.Keyboard.isVisible;
		// 	console.log("cordova isvis", window.cordova.plugins.Keyboard.isVisible);
		// 	console.log("$scope keyboardVis", $scope.keyboardVis);


		// if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
		//   window.cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
		//   window.cordova.plugins.Keyboard.disableScroll(true);
		// }
	}, 50);

	$scope.footerMenu = ChallengeFooterFactory.getFooterMenu();


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

    window.addEventListener("native.keyboardshow", function (){
    	$scope.keyboardVis = true;
    	$scope.$apply();
    });
    window.addEventListener("native.keyboardhide", function (){
    	$scope.keyboardVis = false;
    	$scope.$apply();
    });

	$scope.buttons = {
		compile : 'Compile',
		dismiss : 'Dismiss'
	};

	$scope.keys = [];

	$scope.showPopup = function(item) {
		console.log('keys',item);
		$scope.data = {};
		$scope.keys = item.data;

	  // An elaborate, custom popup
	var myPopup = $ionicPopup.show({
	templateUrl: 'features/challenge-code/challenge-syntax.html',
	title: item.display,
	scope: $scope,
	buttons: [
		  { text: '<b>Done</b>' }
		]
	});
	};

	$scope.saveChallenge = function(){
		$localstorage.set("codeContents", $scope.text);
	};

	$scope.getSaved = function(){
		console.log("entered getsaved func");
		$scope.text = $localstorage.get("codeContents");
		if(!$scope.$$phase) {
		  $scope.$apply();
		}
	};

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

	var CodeSnippets = [
		{
			display: "function",
			insertParam: "function(){ }"
		},
		{
			display: "for loop",
			insertParam: "for(var i= ;i< ;i++){ }"
		},
		{
			display: "log",
			insertParam: "console.log();"
		},
	];

	var footerMenu = [
		{
			display: "Code Snippets",
			data: CodeSnippets
		},
		{
			display: "Syntax",
			data: footerHotkeys
		},
		{
			display: "Create",
			data: footerHotkeys
		}
	];

	// var getHotkeys = function(){
	// 	return footerHotkeys;
	// };

	return 	{
				getFooterMenu : function(){
					return footerMenu;
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
angular.module('ionic.utils', [])

.factory('$localstorage', ['$window', function($window) {
  return {
    set: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key) {
      return JSON.parse($window.localStorage[key] || '{}');
    }
  };
}]);
app.directive('codekeyboard', function($compile){
	return {
		restrict : 'A',
		scope: {
			ngModel : '=' //links any ngmodel on the element
		},
		link : function(scope, element, attribute){
			element.$set("class", "bar-stable");
			
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

			scope.$watch('suites', function(){
				console.log('there is a change in the suites');
				if(scope.suites){
					var suitesSpecs = scope.suites.map(function(el){
						return el.specs;
					});
					scope.specsOverview = flattenRemoveDupes(suitesSpecs, "id");
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
				// document.getElementById(scope.name).innerHTML = text;
			});
		}
	};
});


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImFjY291bnQvYWNjb3VudC5qcyIsImNoYWxsZW5nZS9jaGFsbGVuZ2UuanMiLCJjaGFsbGVuZ2UtY29kZS9jaGFsbGVuZ2UtY29kZS5qcyIsImNoYWxsZW5nZS1jb2RlL2NoYWxsZW5nZS1mb290ZXIuanMiLCJjaGFsbGVuZ2UtY29tcGlsZS9jaGFsbGVuZ2UtY29tcGlsZS5qcyIsImNoYWxsZW5nZS12aWV3L2NoYWxsZW5nZS12aWV3LmpzIiwiY2hhdHMvY2hhdHMuanMiLCJleGVyY2lzbS9leGVyY2lzbS5qcyIsImV4ZXJjaXNtLWNvZGUvZXhlcmNpc20tY29kZS5qcyIsImV4ZXJjaXNtLWNvbXBpbGUvZXhlcmNpc20tY29tcGlsZS5qcyIsImV4ZXJjaXNtLXRlc3QvZXhlcmNpc20tdGVzdC5qcyIsImV4ZXJjaXNtLXZpZXcvZXhlcmNpc20tdmlldy5qcyIsImxvZ2luL2xvZ2luLmpzIiwic2lnbnVwL3NpZ251cC5qcyIsIndlbGNvbWUvd2VsY29tZS5qcyIsImNvbW1vbi9BdXRoZW50aWNhdGlvbi9hdXRoZW50aWNhdGlvbi5qcyIsImNvbW1vbi9maWx0ZXJzL2FwcGVuZC5qcyIsImNvbW1vbi9maWx0ZXJzL2V4ZXJjaXNtLWZvcm1hdC1uYW1lLmpzIiwiY29tbW9uL2ZpbHRlcnMvbWFya2VkLmpzIiwiY29tbW9uL21vZHVsZXMvaW9uaWMudXRpbHMuanMiLCJjb21tb24vZGlyZWN0aXZlcy9jb2Rla2V5Ym9hcmRiYXIvY29kZWtleWJvYXJkYmFyLmpzIiwiY29tbW9uL2RpcmVjdGl2ZXMvY29kZW1pcnJvci1lZGl0L2NvZGVtaXJyb3ItZWRpdC5qcyIsImNvbW1vbi9kaXJlY3RpdmVzL2NvZGVtaXJyb3ItcmVhZC9jb2RlbWlycm9yLXJlYWQuanMiLCJjb21tb24vZGlyZWN0aXZlcy9qYXNtaW5lL2phc21pbmUuanMiLCJjb21tb24vZGlyZWN0aXZlcy9qcy1sb2FkL2pzLWxvYWQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeEpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDOUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6SkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBJb25pYyBTdGFydGVyIEFwcFxuXG4vLyBhbmd1bGFyLm1vZHVsZSBpcyBhIGdsb2JhbCBwbGFjZSBmb3IgY3JlYXRpbmcsIHJlZ2lzdGVyaW5nIGFuZCByZXRyaWV2aW5nIEFuZ3VsYXIgbW9kdWxlc1xuLy8gJ3N0YXJ0ZXInIGlzIHRoZSBuYW1lIG9mIHRoaXMgYW5ndWxhciBtb2R1bGUgZXhhbXBsZSAoYWxzbyBzZXQgaW4gYSA8Ym9keT4gYXR0cmlidXRlIGluIGluZGV4Lmh0bWwpXG4vLyB0aGUgMm5kIHBhcmFtZXRlciBpcyBhbiBhcnJheSBvZiAncmVxdWlyZXMnXG4vLyAnc3RhcnRlci5zZXJ2aWNlcycgaXMgZm91bmQgaW4gc2VydmljZXMuanNcbi8vICdzdGFydGVyLmNvbnRyb2xsZXJzJyBpcyBmb3VuZCBpbiBjb250cm9sbGVycy5qc1xudmFyIGFwcCA9IGFuZ3VsYXIubW9kdWxlKCdtaWRlJywgWydpb25pYycsICdpb25pYy51dGlscyddKVxuXG4ucnVuKGZ1bmN0aW9uKCRpb25pY1BsYXRmb3JtKSB7XG4gICRpb25pY1BsYXRmb3JtLnJlYWR5KGZ1bmN0aW9uKCkge1xuICAgIC8vIEhpZGUgdGhlIGFjY2Vzc29yeSBiYXIgYnkgZGVmYXVsdCAocmVtb3ZlIHRoaXMgdG8gc2hvdyB0aGUgYWNjZXNzb3J5IGJhciBhYm92ZSB0aGUga2V5Ym9hcmRcbiAgICAvLyBmb3IgZm9ybSBpbnB1dHMpXG4gICAgLy8gJGxvY2F0aW9uUHJvdmlkZXIuaHRtbDVNb2RlKHRydWUpO1xuICAgIGlmICh3aW5kb3cuY29yZG92YSAmJiB3aW5kb3cuY29yZG92YS5wbHVnaW5zICYmIHdpbmRvdy5jb3Jkb3ZhLnBsdWdpbnMuS2V5Ym9hcmQpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJkb2VzIHJlZyB3aW5kb3cgd29yaz9cIik7XG4gICAgICBjb3Jkb3ZhLnBsdWdpbnMuS2V5Ym9hcmQuaGlkZUtleWJvYXJkQWNjZXNzb3J5QmFyKHRydWUpO1xuICAgICAgY29yZG92YS5wbHVnaW5zLktleWJvYXJkLmRpc2FibGVTY3JvbGwodHJ1ZSk7XG4gICAgfVxuICAgIGlmICh3aW5kb3cuU3RhdHVzQmFyKSB7XG4gICAgICAvLyBvcmcuYXBhY2hlLmNvcmRvdmEuc3RhdHVzYmFyIHJlcXVpcmVkXG4gICAgICBTdGF0dXNCYXIuc3R5bGVMaWdodENvbnRlbnQoKTtcbiAgICB9XG4gIH0pO1xufSlcblxuLy9UT0RPOlRoaXMgaXMgbmVlZGVkIHRvIHNldCB0byBhY2Nlc3MgdGhlIHByb3h5IHVybCB0aGF0IHdpbGwgdGhlbiBpbiB0aGUgaW9uaWMucHJvamVjdCBmaWxlIHJlZGlyZWN0IGl0IHRvIHRoZSBjb3JyZWN0IFVSTFxuLmNvbnN0YW50KCdBcGlFbmRwb2ludCcsIHtcbiAgdXJsIDogJy9hcGknLFxuICBzZXNzaW9uOiAnL3Nlc3Npb24nXG59KVxuXG4uY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyLCAkdXJsUm91dGVyUHJvdmlkZXIpIHtcbiAgLy8gSW9uaWMgdXNlcyBBbmd1bGFyVUkgUm91dGVyIHdoaWNoIHVzZXMgdGhlIGNvbmNlcHQgb2Ygc3RhdGVzXG4gIC8vIExlYXJuIG1vcmUgaGVyZTogaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXItdWkvdWktcm91dGVyXG4gIC8vIFNldCB1cCB0aGUgdmFyaW91cyBzdGF0ZXMgd2hpY2ggdGhlIGFwcCBjYW4gYmUgaW4uXG4gIC8vIEVhY2ggc3RhdGUncyBjb250cm9sbGVyIGNhbiBiZSBmb3VuZCBpbiBjb250cm9sbGVycy5qc1xuICAvLyBpZiBub25lIG9mIHRoZSBhYm92ZSBzdGF0ZXMgYXJlIG1hdGNoZWQsIHVzZSB0aGlzIGFzIHRoZSBmYWxsYmFja1xuICAvLyAkdXJsUm91dGVyUHJvdmlkZXIub3RoZXJ3aXNlKCcvY2hhbGxlbmdlL3ZpZXcnKTsgLy9UT0RPOiBBbGJlcnQgdGVzdGluZyB0aGlzIHJvdXRlXG5cbiAgJHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZSgnL3dlbGNvbWUnKTsgLy8gVE9ETzogUmljaGFyZCB0ZXN0aW5nIHRoaXMgcm91dGVcbiAgLy8kdXJsUm91dGVyUHJvdmlkZXIub3RoZXJ3aXNlKCcvdGFiL2NoYWxsZW5nZScpOyAvL1RPRE86IFRvbnkgdGVzdGluZyB0aGlzIHJvdXRlXG4gIC8vICR1cmxSb3V0ZXJQcm92aWRlci5vdGhlcndpc2UoJ3dlbGNvbWUnKTtcblxufSlcbi8vXG5cbi8vLy9ydW4gYmxvY2tzOiBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzIwNjYzMDc2L2FuZ3VsYXJqcy1hcHAtcnVuLWRvY3VtZW50YXRpb25cbi8vVXNlIHJ1biBtZXRob2QgdG8gcmVnaXN0ZXIgd29yayB3aGljaCBzaG91bGQgYmUgcGVyZm9ybWVkIHdoZW4gdGhlIGluamVjdG9yIGlzIGRvbmUgbG9hZGluZyBhbGwgbW9kdWxlcy5cbi8vaHR0cDovL2RldmRhY3RpYy5jb20vdXNlci1hdXRoLWFuZ3VsYXJqcy1pb25pYy9cblxuLnJ1bihmdW5jdGlvbiAoJHJvb3RTY29wZSwgJHN0YXRlLCBBdXRoU2VydmljZSwgQVVUSF9FVkVOVFMpIHtcblxuICAgIHZhciBkZXN0aW5hdGlvblN0YXRlUmVxdWlyZXNBdXRoID0gZnVuY3Rpb24gKHN0YXRlKSB7XG4gICAgICAgIC8vY29uc29sZS5sb2coJ2NsIC0gZGVzdGluYXRpb25TdGF0ZVJlcXVpcmVzQXV0aCcsJ3N0YXRlLmRhdGEnLHN0YXRlLmRhdGEsJ3N0YXRlLmRhdGEuYXV0aCcsc3RhdGUuZGF0YS5hdXRoZW50aWNhdGUpO1xuICAgICAgICByZXR1cm4gc3RhdGUuZGF0YSAmJiBzdGF0ZS5kYXRhLmF1dGhlbnRpY2F0ZTtcbiAgICB9O1xuICAgXG4gICAgLy9UT0RPOiBOZWVkIHRvIG1ha2UgYXV0aGVudGljYXRpb24gbW9yZSByb2J1c3QgYmVsb3cgZG9lcyBub3QgZm9sbG93IEZTRyAoZXQuIGFsLilcbiAgICAvL1RPRE86IEN1cnJlbnRseSBpdCBpcyBub3QgY2hlY2tpbmcgdGhlIGJhY2tlbmQgcm91dGUgcm91dGVyLmdldCgnL3Rva2VuJylcbiAgICAkcm9vdFNjb3BlLiRvbignJHN0YXRlQ2hhbmdlU3RhcnQnLCBmdW5jdGlvbiAoZXZlbnQsdG9TdGF0ZSwgdG9QYXJhbXMpIHtcblxuICAgICAgICAvL2NvbnNvbGUubG9nKCd1c2VyIEF1dGhlbnRpY2F0ZWQnLCBBdXRoU2VydmljZS5pc0F1dGhlbnRpY2F0ZWQoKSk7XG5cbiAgICAgICAgaWYgKCFkZXN0aW5hdGlvblN0YXRlUmVxdWlyZXNBdXRoKHRvU3RhdGUpKSB7XG4gICAgICAgICAgICAvLyBUaGUgZGVzdGluYXRpb24gc3RhdGUgZG9lcyBub3QgcmVxdWlyZSBhdXRoZW50aWNhdGlvblxuICAgICAgICAgICAgLy8gU2hvcnQgY2lyY3VpdCB3aXRoIHJldHVybi5cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChBdXRoU2VydmljZS5pc0F1dGhlbnRpY2F0ZWQoKSkge1xuICAgICAgICAgICAgLy8gVGhlIHVzZXIgaXMgYXV0aGVudGljYXRlZC5cbiAgICAgICAgICAgIC8vIFNob3J0IGNpcmN1aXQgd2l0aCByZXR1cm4uXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvL1RPRE86IE5vdCBzdXJlIGhvdyB0byBwcm9jZWVkIGhlcmVcbiAgICAgICAgJHN0YXRlLmdvKCdsb2dpbicpOyAvL2lmIGFib3ZlIGZhaWxzLCBnb3RvIGxvZ2luXG4gICAgfSk7XG4gIC8vICR1cmxSb3V0ZXJQcm92aWRlci5vdGhlcndpc2UoJy9zaWdudXAnKTsgLy8gVE9ETzogUmljaGFyZCB0ZXN0aW5nIHRoaXMgcm91dGVcbiAgLy8kdXJsUm91dGVyUHJvdmlkZXIub3RoZXJ3aXNlKCcvY2hhbGxlbmdlL3ZpZXcnKTsgLy9UT0RPOiBUb255IHRlc3RpbmcgdGhpcyByb3V0ZVxuXG59KTtcblxuYXBwLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlcil7XG4gICAkc3RhdGVQcm92aWRlci5zdGF0ZSgnbWFpbicsIHtcbiAgICAgICB0ZW1wbGF0ZVVybDogJ2ZlYXR1cmVzL2NvbW1vbi9tYWluL21haW4uaHRtbCcsXG4gICAgICAgY29udHJvbGxlcjogJ01lbnVDdHJsJ1xuICAgfSk7XG59KTtcblxuYXBwLmNvbnRyb2xsZXIoJ01haW5DdHJsJywgZnVuY3Rpb24oJHJvb3RTY29wZSwkc2NvcGUsICRpb25pY1NpZGVNZW51RGVsZWdhdGUsICRpb25pY1BvcHVwLCAkc3RhdGUsIEF1dGhTZXJ2aWNlLEFVVEhfRVZFTlRTKXtcbiAgICAkc2NvcGUudXNlcm5hbWUgPSBBdXRoU2VydmljZS51c2VybmFtZSgpO1xuICAgIC8vY29uc29sZS5sb2coQXV0aFNlcnZpY2UuaXNBdXRoZW50aWNhdGVkKCkpO1xuXG4gICAgJHNjb3BlLiRvbihBVVRIX0VWRU5UUy5ub3RBdXRob3JpemVkLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICB2YXIgYWxlcnRQb3B1cCA9ICRpb25pY1BvcHVwLmFsZXJ0KHtcbiAgICAgICAgICAgIHRpdGxlOiAnVW5hdXRob3JpemVkIScsXG4gICAgICAgICAgICB0ZW1wbGF0ZTogJ1lvdSBhcmUgbm90IGFsbG93ZWQgdG8gYWNjZXNzIHRoaXMgcmVzb3VyY2UuJ1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgICRzY29wZS4kb24oQVVUSF9FVkVOVFMubm90QXV0aGVudGljYXRlZCwgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgQXV0aFNlcnZpY2UubG9nb3V0KCk7XG4gICAgICAgIC8vJHN0YXRlLmdvKCdsb2dpbicpO1xuICAgICAgICB2YXIgYWxlcnRQb3B1cCA9ICRpb25pY1BvcHVwLmFsZXJ0KHtcbiAgICAgICAgICAgIHRpdGxlOiAnUGxlYXNlIFJldmlldycsXG4gICAgICAgICAgICB0ZW1wbGF0ZTogJydcbiAgICAgICAgfSk7XG4gICAgfSk7XG59KTtcblxuYXBwLmNvbnRyb2xsZXIoJ01lbnVDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCAkaW9uaWNTaWRlTWVudURlbGVnYXRlLCAkc3RhdGUsIEF1dGhTZXJ2aWNlLCAkcm9vdFNjb3BlKXtcblxuICAgICRzY29wZS5zdGF0ZXMgPSBbXG4gICAgICAgIHtcbiAgICAgICAgICBuYW1lIDogJ0FjY291bnQnLFxuICAgICAgICAgIHJlZiA6IGZ1bmN0aW9uKCl7cmV0dXJuICdhY2NvdW50Jzt9XG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBuYW1lIDogJ0NoYWxsZW5nZScsXG4gICAgICAgICAgcmVmIDogZnVuY3Rpb24oKXtyZXR1cm4gJ2NoYWxsZW5nZS52aWV3Jzt9XG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBuYW1lIDogJ0NoYXRzJyxcbiAgICAgICAgICByZWY6IGZ1bmN0aW9uKCl7cmV0dXJuICdjaGF0cyc7fVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgbmFtZSA6ICdFeGVyY2lzbScsXG4gICAgICAgICAgcmVmOiBmdW5jdGlvbigpe3JldHVybiAnZXhlcmNpc20udmlldyc7fVxuICAgICAgICB9XG4gICAgXTtcblxuICAgICRzY29wZS50b2dnbGVNZW51U2hvdyA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIHJldHVybiBBdXRoU2VydmljZS5pc0F1dGhlbnRpY2F0ZWQoKTtcbiAgICB9O1xuXG4gICAgJHJvb3RTY29wZS4kb24oJ0F1dGgnLGZ1bmN0aW9uKCl7XG4gICAgICAgJHNjb3BlLnRvZ2dsZU1lbnVTaG93KCk7XG4gICAgfSk7XG5cbiAgICAvL2NvbnNvbGUubG9nKEF1dGhTZXJ2aWNlLmlzQXV0aGVudGljYXRlZCgpKTtcbiAgICAvL2lmKEF1dGhTZXJ2aWNlLmlzQXV0aGVudGljYXRlZCgpKXtcbiAgICAkc2NvcGUuY2xpY2tJdGVtID0gZnVuY3Rpb24oc3RhdGVSZWYpe1xuICAgICAgICAkaW9uaWNTaWRlTWVudURlbGVnYXRlLnRvZ2dsZUxlZnQoKTtcbiAgICAgICAgJHN0YXRlLmdvKHN0YXRlUmVmKCkpOyAvL1JCOiBVcGRhdGVkIHRvIGhhdmUgc3RhdGVSZWYgYXMgYSBmdW5jdGlvbiBpbnN0ZWFkLlxuICAgIH07XG5cbiAgICAkc2NvcGUudG9nZ2xlTWVudSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICRpb25pY1NpZGVNZW51RGVsZWdhdGUudG9nZ2xlTGVmdCgpO1xuICAgIH07XG4gICAgLy99XG59KTsiLCJhcHAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyLCBVU0VSX1JPTEVTKXtcblx0Ly8gRWFjaCB0YWIgaGFzIGl0cyBvd24gbmF2IGhpc3Rvcnkgc3RhY2s6XG5cdCRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdhY2NvdW50Jywge1xuXHRcdHVybDogJy9hY2NvdW50Jyxcblx0ICAgIHRlbXBsYXRlVXJsOiAnZmVhdHVyZXMvYWNjb3VudC9hY2NvdW50Lmh0bWwnLFxuXHRcdGNvbnRyb2xsZXI6ICdBY2NvdW50Q3RybCdcblx0XHQvLyAsXG5cdFx0Ly8gZGF0YToge1xuXHRcdC8vIFx0YXV0aGVudGljYXRlOiBbVVNFUl9ST0xFUy5wdWJsaWNdXG5cdFx0Ly8gfVxuXHR9KTtcbn0pO1xuXG5hcHAuY29udHJvbGxlcignQWNjb3VudEN0cmwnLCBmdW5jdGlvbigkc2NvcGUpIHtcblx0JHNjb3BlLnNldHRpbmdzID0ge1xuXHRcdGVuYWJsZUZyaWVuZHM6IHRydWVcblx0fTtcbn0pOyIsImFwcC5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIpe1xuXHQkc3RhdGVQcm92aWRlci5zdGF0ZSgnY2hhbGxlbmdlJywge1xuXHRcdHRlbXBsYXRlVXJsIDogJ2ZlYXR1cmVzL2NoYWxsZW5nZS9jaGFsbGVuZ2UuaHRtbCcsXG5cdFx0YWJzdHJhY3QgOiB0cnVlXG5cdH0pO1xufSk7XG5cbmFwcC5mYWN0b3J5KCdDaGFsbGVuZ2VGYWN0b3J5JywgZnVuY3Rpb24oJGh0dHAsIEFwaUVuZHBvaW50LCAkcm9vdFNjb3BlLCAkc3RhdGUpe1xuXG5cdHZhciBwcm9ibGVtID0gJyc7XG5cdHZhciBzdWJtaXNzaW9uID0gJyc7XG5cblx0dmFyIHJ1bkhpZGRlbiA9IGZ1bmN0aW9uKGNvZGUpIHtcblx0ICAgIHZhciBpbmRleGVkREIgPSBudWxsO1xuXHQgICAgdmFyIGxvY2F0aW9uID0gbnVsbDtcblx0ICAgIHZhciBuYXZpZ2F0b3IgPSBudWxsO1xuXHQgICAgdmFyIG9uZXJyb3IgPSBudWxsO1xuXHQgICAgdmFyIG9ubWVzc2FnZSA9IG51bGw7XG5cdCAgICB2YXIgcGVyZm9ybWFuY2UgPSBudWxsO1xuXHQgICAgdmFyIHNlbGYgPSBudWxsO1xuXHQgICAgdmFyIHdlYmtpdEluZGV4ZWREQiA9IG51bGw7XG5cdCAgICB2YXIgcG9zdE1lc3NhZ2UgPSBudWxsO1xuXHQgICAgdmFyIGNsb3NlID0gbnVsbDtcblx0ICAgIHZhciBvcGVuRGF0YWJhc2UgPSBudWxsO1xuXHQgICAgdmFyIG9wZW5EYXRhYmFzZVN5bmMgPSBudWxsO1xuXHQgICAgdmFyIHdlYmtpdFJlcXVlc3RGaWxlU3lzdGVtID0gbnVsbDtcblx0ICAgIHZhciB3ZWJraXRSZXF1ZXN0RmlsZVN5c3RlbVN5bmMgPSBudWxsO1xuXHQgICAgdmFyIHdlYmtpdFJlc29sdmVMb2NhbEZpbGVTeXN0ZW1TeW5jVVJMID0gbnVsbDtcblx0ICAgIHZhciB3ZWJraXRSZXNvbHZlTG9jYWxGaWxlU3lzdGVtVVJMID0gbnVsbDtcblx0ICAgIHZhciBhZGRFdmVudExpc3RlbmVyID0gbnVsbDtcblx0ICAgIHZhciBkaXNwYXRjaEV2ZW50ID0gbnVsbDtcblx0ICAgIHZhciByZW1vdmVFdmVudExpc3RlbmVyID0gbnVsbDtcblx0ICAgIHZhciBkdW1wID0gbnVsbDtcblx0ICAgIHZhciBvbm9mZmxpbmUgPSBudWxsO1xuXHQgICAgdmFyIG9ub25saW5lID0gbnVsbDtcblx0ICAgIHZhciBpbXBvcnRTY3JpcHRzID0gbnVsbDtcblx0ICAgIHZhciBjb25zb2xlID0gbnVsbDtcblx0ICAgIHZhciBhcHBsaWNhdGlvbiA9IG51bGw7XG5cblx0ICAgIHJldHVybiBldmFsKGNvZGUpO1xuXHR9O1xuXG5cdC8vIGNvbnZlcnRzIHRoZSBvdXRwdXQgaW50byBhIHN0cmluZ1xuXHR2YXIgc3RyaW5naWZ5ID0gZnVuY3Rpb24ob3V0cHV0KSB7XG5cdCAgICB2YXIgcmVzdWx0O1xuXG5cdCAgICBpZiAodHlwZW9mIG91dHB1dCA9PSAndW5kZWZpbmVkJykge1xuXHQgICAgICAgIHJlc3VsdCA9ICd1bmRlZmluZWQnO1xuXHQgICAgfSBlbHNlIGlmIChvdXRwdXQgPT09IG51bGwpIHtcblx0ICAgICAgICByZXN1bHQgPSAnbnVsbCc7XG5cdCAgICB9IGVsc2Uge1xuXHQgICAgICAgIHJlc3VsdCA9IEpTT04uc3RyaW5naWZ5KG91dHB1dCkgfHwgb3V0cHV0LnRvU3RyaW5nKCk7XG5cdCAgICB9XG5cblx0ICAgIHJldHVybiByZXN1bHQ7XG5cdH07XG5cblx0dmFyIHJ1biA9IGZ1bmN0aW9uKGNvZGUpIHtcblx0ICAgIHZhciByZXN1bHQgPSB7XG5cdCAgICAgICAgaW5wdXQ6IGNvZGUsXG5cdCAgICAgICAgb3V0cHV0OiBudWxsLFxuXHQgICAgICAgIGVycm9yOiBudWxsXG5cdCAgICB9O1xuXG5cdCAgICB0cnkge1xuXHQgICAgICAgIHJlc3VsdC5vdXRwdXQgPSBzdHJpbmdpZnkocnVuSGlkZGVuKGNvZGUpKTtcblx0ICAgIH0gY2F0Y2goZSkge1xuXHQgICAgICAgIHJlc3VsdC5lcnJvciA9IGUubWVzc2FnZTtcblx0ICAgIH1cblx0ICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcblxuXG5cdHJldHVybiB7XG5cdFx0Z2V0Q2hhbGxlbmdlIDogZnVuY3Rpb24oaWQpe1xuXHRcdFx0cmV0dXJuICRodHRwLmdldChBcGlFbmRwb2ludC51cmwgKyAnL2NoYWxsZW5nZS8nICsgaWQpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuXHRcdFx0XHRwcm9ibGVtID0gcmVzcG9uc2UuZGF0YTtcblx0XHRcdFx0c3VibWlzc2lvbiA9IHByb2JsZW0uc2Vzc2lvbi5zZXR1cCB8fCAnJztcblx0XHRcdFx0JHJvb3RTY29wZS4kYnJvYWRjYXN0KCdwcm9ibGVtVXBkYXRlZCcpO1xuXHRcdFx0XHRyZXR1cm4gcmVzcG9uc2UuZGF0YTtcblx0XHRcdH0pO1xuXHRcdH0sXG5cdFx0c2V0U3VibWlzc2lvbiA6IGZ1bmN0aW9uKGNvZGUpe1xuXHRcdFx0c3VibWlzc2lvbiA9IGNvZGU7XG5cdFx0XHQkcm9vdFNjb3BlLiRicm9hZGNhc3QoJ3N1Ym1pc3Npb25VcGRhdGVkJyk7XG5cdFx0fSxcblx0XHRjb21waWxlU3VibWlzc2lvbjogZnVuY3Rpb24oY29kZSl7XG5cdFx0XHRyZXR1cm4gcnVuKGNvZGUpO1xuXHRcdH0sXG5cdFx0Z2V0U3VibWlzc2lvbiA6IGZ1bmN0aW9uKCl7XG5cdFx0XHRyZXR1cm4gc3VibWlzc2lvbjtcblx0XHR9LFxuXHRcdGdldFByb2JsZW0gOiBmdW5jdGlvbigpe1xuXHRcdFx0cmV0dXJuIHByb2JsZW07XG5cdFx0fVxuXHR9O1xufSk7IiwiYXBwLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlcil7XG5cdCRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdjaGFsbGVuZ2UuY29kZScsIHtcblx0XHR1cmwgOiAnL2NoYWxsZW5nZS9jb2RlJyxcblx0XHR2aWV3czoge1xuXHRcdFx0J3RhYi1jb2RlJyA6IHtcblx0XHRcdFx0dGVtcGxhdGVVcmwgOiAnZmVhdHVyZXMvY2hhbGxlbmdlLWNvZGUvY2hhbGxlbmdlLWNvZGUuaHRtbCcsXG5cdFx0XHRcdGNvbnRyb2xsZXIgOiAnQ2hhbGxlbmdlQ29kZUN0cmwnXG5cdFx0XHR9XG5cdFx0fVxuXHRcdC8vICxcblx0XHQvLyBvbkVudGVyIDogZnVuY3Rpb24oQ2hhbGxlbmdlRmFjdG9yeSwgJHN0YXRlKXtcblx0XHQvLyBcdGlmKENoYWxsZW5nZUZhY3RvcnkuZ2V0UHJvYmxlbSgpLmxlbmd0aCA9PT0gMCl7XG5cdFx0Ly8gXHRcdCRzdGF0ZS5nbygnY2hhbGxlbmdlLnZpZXcnKTtcblx0XHQvLyBcdH1cblx0XHQvLyB9XG5cdH0pO1xufSk7XG5cblxuYXBwLmNvbnRyb2xsZXIoJ0NoYWxsZW5nZUNvZGVDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCAkc3RhdGUsICRyb290U2NvcGUsIENoYWxsZW5nZUZhY3RvcnksIENoYWxsZW5nZUZvb3RlckZhY3RvcnksICRpb25pY1BvcHVwLCAkbG9jYWxzdG9yYWdlKXtcblxuXHRzZXRUaW1lb3V0KGZ1bmN0aW9uICgpe1xuXHRcdC8vICRzY29wZS5rZXlib2FyZFZpcyA9IHdpbmRvdy5jb3Jkb3ZhLnBsdWdpbnMuS2V5Ym9hcmQuaXNWaXNpYmxlO1xuXHRcdC8vIFx0Y29uc29sZS5sb2coXCJjb3Jkb3ZhIGlzdmlzXCIsIHdpbmRvdy5jb3Jkb3ZhLnBsdWdpbnMuS2V5Ym9hcmQuaXNWaXNpYmxlKTtcblx0XHQvLyBcdGNvbnNvbGUubG9nKFwiJHNjb3BlIGtleWJvYXJkVmlzXCIsICRzY29wZS5rZXlib2FyZFZpcyk7XG5cblxuXHRcdC8vIGlmICh3aW5kb3cuY29yZG92YSAmJiB3aW5kb3cuY29yZG92YS5wbHVnaW5zICYmIHdpbmRvdy5jb3Jkb3ZhLnBsdWdpbnMuS2V5Ym9hcmQpIHtcblx0XHQvLyAgIHdpbmRvdy5jb3Jkb3ZhLnBsdWdpbnMuS2V5Ym9hcmQuaGlkZUtleWJvYXJkQWNjZXNzb3J5QmFyKHRydWUpO1xuXHRcdC8vICAgd2luZG93LmNvcmRvdmEucGx1Z2lucy5LZXlib2FyZC5kaXNhYmxlU2Nyb2xsKHRydWUpO1xuXHRcdC8vIH1cblx0fSwgNTApO1xuXG5cdCRzY29wZS5mb290ZXJNZW51ID0gQ2hhbGxlbmdlRm9vdGVyRmFjdG9yeS5nZXRGb290ZXJNZW51KCk7XG5cblxuXHQvL0NoYWxsZW5nZSBTdWJtaXRcblx0JHNjb3BlLnRleHQgPSBDaGFsbGVuZ2VGYWN0b3J5LmdldFN1Ym1pc3Npb24oKSB8fCAndGV4dCc7XG5cblx0Ly9pbml0aWFsaXplIENvZGVNaXJyb3Jcblx0dmFyIG15Q29kZU1pcnJvciA9IENvZGVNaXJyb3IuZnJvbVRleHRBcmVhKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb2RlJyksIHtcblx0XHRsaW5lTnVtYmVycyA6IHRydWUsXG5cdFx0bW9kZTogJ2phdmFzY3JpcHQnLFxuXHRcdGF1dG9mb2N1cyA6IHRydWUsXG5cdFx0dGhlbWUgOiAndHdpbGlnaHQnLFxuXHRcdGxpbmVXcmFwcGluZzogdHJ1ZVxuXHR9KTtcblxuXHRteUNvZGVNaXJyb3IucmVwbGFjZVNlbGVjdGlvbigkc2NvcGUudGV4dCk7XG5cblx0JHNjb3BlLnVwZGF0ZVRleHQgPSBmdW5jdGlvbigpe1xuXHRcdCRzY29wZS50ZXh0ID0gbXlDb2RlTWlycm9yLmdldFZhbHVlKCk7XG5cdFx0Ly9jaGVjayBpZiBkaWdlc3QgaXMgaW4gcHJvZ3Jlc3Ncblx0XHRpZighJHNjb3BlLiQkcGhhc2UpIHtcblx0XHQgICRzY29wZS4kYXBwbHkoKTtcblx0XHR9XG5cdH07XG5cblx0JHNjb3BlLmluc2VydEZ1bmMgPSBmdW5jdGlvbihwYXJhbSl7XG5cdFx0Ly9naXZlbiBhIHBhcmFtLCB3aWxsIGluc2VydCBjaGFyYWN0ZXJzIHdoZXJlIGN1cnNvciBpc1xuXHRcdGNvbnNvbGUubG9nKFwiaW5zZXJ0aW5nOiBcIiwgcGFyYW0pO1xuXHRcdG15Q29kZU1pcnJvci5yZXBsYWNlU2VsZWN0aW9uKHBhcmFtKTtcblx0XHQvLyB3aW5kb3cuY29yZG92YS5wbHVnaW5zLktleWJvYXJkLnNob3coKTtcblx0XHRteUNvZGVNaXJyb3IuZm9jdXMoKTtcblx0fTtcblxuICAgIG15Q29kZU1pcnJvci5vbihcImNoYW5nZVwiLCBmdW5jdGlvbiAobXlDb2RlTWlycm9yLCBjaGFuZ2VPYmope1xuICAgIFx0JHNjb3BlLnVwZGF0ZVRleHQoKTtcbiAgICB9KTtcblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibmF0aXZlLmtleWJvYXJkc2hvd1wiLCBmdW5jdGlvbiAoKXtcbiAgICBcdCRzY29wZS5rZXlib2FyZFZpcyA9IHRydWU7XG4gICAgXHQkc2NvcGUuJGFwcGx5KCk7XG4gICAgfSk7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJuYXRpdmUua2V5Ym9hcmRoaWRlXCIsIGZ1bmN0aW9uICgpe1xuICAgIFx0JHNjb3BlLmtleWJvYXJkVmlzID0gZmFsc2U7XG4gICAgXHQkc2NvcGUuJGFwcGx5KCk7XG4gICAgfSk7XG5cblx0JHNjb3BlLmJ1dHRvbnMgPSB7XG5cdFx0Y29tcGlsZSA6ICdDb21waWxlJyxcblx0XHRkaXNtaXNzIDogJ0Rpc21pc3MnXG5cdH07XG5cblx0JHNjb3BlLmtleXMgPSBbXTtcblxuXHQkc2NvcGUuc2hvd1BvcHVwID0gZnVuY3Rpb24oaXRlbSkge1xuXHRcdGNvbnNvbGUubG9nKCdrZXlzJyxpdGVtKTtcblx0XHQkc2NvcGUuZGF0YSA9IHt9O1xuXHRcdCRzY29wZS5rZXlzID0gaXRlbS5kYXRhO1xuXG5cdCAgLy8gQW4gZWxhYm9yYXRlLCBjdXN0b20gcG9wdXBcblx0dmFyIG15UG9wdXAgPSAkaW9uaWNQb3B1cC5zaG93KHtcblx0dGVtcGxhdGVVcmw6ICdmZWF0dXJlcy9jaGFsbGVuZ2UtY29kZS9jaGFsbGVuZ2Utc3ludGF4Lmh0bWwnLFxuXHR0aXRsZTogaXRlbS5kaXNwbGF5LFxuXHRzY29wZTogJHNjb3BlLFxuXHRidXR0b25zOiBbXG5cdFx0ICB7IHRleHQ6ICc8Yj5Eb25lPC9iPicgfVxuXHRcdF1cblx0fSk7XG5cdH07XG5cblx0JHNjb3BlLnNhdmVDaGFsbGVuZ2UgPSBmdW5jdGlvbigpe1xuXHRcdCRsb2NhbHN0b3JhZ2Uuc2V0KFwiY29kZUNvbnRlbnRzXCIsICRzY29wZS50ZXh0KTtcblx0fTtcblxuXHQkc2NvcGUuZ2V0U2F2ZWQgPSBmdW5jdGlvbigpe1xuXHRcdGNvbnNvbGUubG9nKFwiZW50ZXJlZCBnZXRzYXZlZCBmdW5jXCIpO1xuXHRcdCRzY29wZS50ZXh0ID0gJGxvY2Fsc3RvcmFnZS5nZXQoXCJjb2RlQ29udGVudHNcIik7XG5cdFx0aWYoISRzY29wZS4kJHBoYXNlKSB7XG5cdFx0ICAkc2NvcGUuJGFwcGx5KCk7XG5cdFx0fVxuXHR9O1xuXG59KTsiLCJhcHAuZmFjdG9yeSgnQ2hhbGxlbmdlRm9vdGVyRmFjdG9yeScsIGZ1bmN0aW9uKCl7XG5cdFxuXHR2YXIgZm9vdGVySG90a2V5cyA9IFtcblx0XHR7XG5cdFx0XHRkaXNwbGF5OiBcIlsgXVwiLFxuXHRcdFx0aW5zZXJ0UGFyYW06IFwiW11cIlxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0ZGlzcGxheTogXCJ7IH1cIixcblx0XHRcdGluc2VydFBhcmFtOiBcInt9XCJcblx0XHR9LFxuXHRcdHtcblx0XHRcdGRpc3BsYXk6IFwiKCApXCIsXG5cdFx0XHRpbnNlcnRQYXJhbTogXCIoKVwiXG5cdFx0fSxcblx0XHR7XG5cdFx0XHRkaXNwbGF5OiBcIi8vXCIsXG5cdFx0XHRpbnNlcnRQYXJhbTogXCIvL1wiXG5cdFx0fSxcblx0XHR7XG5cdFx0XHRkaXNwbGF5OiBcIj1cIixcblx0XHRcdGluc2VydFBhcmFtOiBcIj1cIlxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0ZGlzcGxheTogXCI8XCIsXG5cdFx0XHRpbnNlcnRQYXJhbTogXCI8XCJcblx0XHR9LFxuXHRcdHtcblx0XHRcdGRpc3BsYXk6IFwiPlwiLFxuXHRcdFx0aW5zZXJ0UGFyYW06IFwiPlwiXG5cdFx0fSxcblx0XHR7XG5cdFx0XHRkaXNwbGF5OiBcIi8qICAqL1wiLFxuXHRcdFx0aW5zZXJ0UGFyYW06IFwiLyogKi9cIlxuXHRcdH0sXG5cblx0XTtcblxuXHR2YXIgQ29kZVNuaXBwZXRzID0gW1xuXHRcdHtcblx0XHRcdGRpc3BsYXk6IFwiZnVuY3Rpb25cIixcblx0XHRcdGluc2VydFBhcmFtOiBcImZ1bmN0aW9uKCl7IH1cIlxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0ZGlzcGxheTogXCJmb3IgbG9vcFwiLFxuXHRcdFx0aW5zZXJ0UGFyYW06IFwiZm9yKHZhciBpPSA7aTwgO2krKyl7IH1cIlxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0ZGlzcGxheTogXCJsb2dcIixcblx0XHRcdGluc2VydFBhcmFtOiBcImNvbnNvbGUubG9nKCk7XCJcblx0XHR9LFxuXHRdO1xuXG5cdHZhciBmb290ZXJNZW51ID0gW1xuXHRcdHtcblx0XHRcdGRpc3BsYXk6IFwiQ29kZSBTbmlwcGV0c1wiLFxuXHRcdFx0ZGF0YTogQ29kZVNuaXBwZXRzXG5cdFx0fSxcblx0XHR7XG5cdFx0XHRkaXNwbGF5OiBcIlN5bnRheFwiLFxuXHRcdFx0ZGF0YTogZm9vdGVySG90a2V5c1xuXHRcdH0sXG5cdFx0e1xuXHRcdFx0ZGlzcGxheTogXCJDcmVhdGVcIixcblx0XHRcdGRhdGE6IGZvb3RlckhvdGtleXNcblx0XHR9XG5cdF07XG5cblx0Ly8gdmFyIGdldEhvdGtleXMgPSBmdW5jdGlvbigpe1xuXHQvLyBcdHJldHVybiBmb290ZXJIb3RrZXlzO1xuXHQvLyB9O1xuXG5cdHJldHVybiBcdHtcblx0XHRcdFx0Z2V0Rm9vdGVyTWVudSA6IGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0cmV0dXJuIGZvb3Rlck1lbnU7XG5cdFx0XHRcdH1cblx0XHRcdH07XG59KTsiLCJhcHAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKXtcblx0JHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2NoYWxsZW5nZS5jb21waWxlJywge1xuXHRcdHVybCA6ICcvY2hhbGxlbmdlL2NvbXBpbGUnLFxuXHRcdHZpZXdzIDoge1xuXHRcdFx0J3RhYi1jb21waWxlJyA6IHtcblx0XHRcdFx0dGVtcGxhdGVVcmwgOiAnZmVhdHVyZXMvY2hhbGxlbmdlLWNvbXBpbGUvY2hhbGxlbmdlLWNvbXBpbGUuaHRtbCcsXG5cdFx0XHRcdGNvbnRyb2xsZXI6ICdDaGFsbGVuZ2VDb21waWxlQ3RybCdcblx0XHRcdH1cblx0XHR9XG5cdFx0Ly8gLFxuXHRcdC8vIG9uRW50ZXIgOiBmdW5jdGlvbihDaGFsbGVuZ2VGYWN0b3J5LCAkc3RhdGUpe1xuXHRcdC8vIFx0aWYoQ2hhbGxlbmdlRmFjdG9yeS5nZXRTdWJtaXNzaW9uKCkubGVuZ3RoID09PSAwKXtcblx0XHQvLyBcdFx0JHN0YXRlLmdvKCdjaGFsbGVuZ2UudmlldycpO1xuXHRcdC8vIFx0fVxuXHRcdC8vIH1cblx0fSk7XG59KTtcblxuYXBwLmNvbnRyb2xsZXIoJ0NoYWxsZW5nZUNvbXBpbGVDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBDaGFsbGVuZ2VGYWN0b3J5KXtcblx0JHNjb3BlLnF1ZXN0aW9uID0gQ2hhbGxlbmdlRmFjdG9yeS5nZXRTdWJtaXNzaW9uKCk7XG5cdGNvbnNvbGUubG9nKCRzY29wZS5xdWVzdGlvbik7XG5cdHZhciByZXN1bHRzID0gQ2hhbGxlbmdlRmFjdG9yeS5jb21waWxlU3VibWlzc2lvbigkc2NvcGUucXVlc3Rpb24pO1xuXHQkc2NvcGUucmVzdWx0cyA9IHJlc3VsdHM7XG5cdCRzY29wZS5vdXRwdXQgPSBDaGFsbGVuZ2VGYWN0b3J5LmNvbXBpbGVTdWJtaXNzaW9uKCRzY29wZS5xdWVzdGlvbikub3V0cHV0O1xuXHQkc2NvcGUuZXJyb3IgPSBDaGFsbGVuZ2VGYWN0b3J5LmNvbXBpbGVTdWJtaXNzaW9uKCRzY29wZS5xdWVzdGlvbikuZXJyb3I7XG5cblx0Ly9pbml0aWFsaXplIENvZGVNaXJyb3Jcblx0dmFyIGNtQ29tcGlsZSA9IENvZGVNaXJyb3IuZnJvbVRleHRBcmVhKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb21waWxlJyksIHtcblx0XHRyZWFkT25seSA6ICdub2N1cnNvcicsXG5cdFx0bW9kZTogJ2phdmFzY3JpcHQnLFxuXHRcdGF1dG9mb2N1cyA6IHRydWUsXG5cdFx0dGhlbWUgOiAndHdpbGlnaHQnLFxuXHRcdGxpbmVXcmFwcGluZzogdHJ1ZVxuXHR9KTtcblxuXHRjbUNvbXBpbGUucmVwbGFjZVNlbGVjdGlvbigkc2NvcGUucXVlc3Rpb24pO1xuXG5cblx0dmFyIGNtUmVzdWx0cyA9IENvZGVNaXJyb3IuZnJvbVRleHRBcmVhKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZXN1bHRzJyksIHtcblx0XHRyZWFkT25seSA6ICdub2N1cnNvcicsXG5cdFx0bW9kZTogJ2phdmFzY3JpcHQnLFxuXHRcdGF1dG9mb2N1cyA6IHRydWUsXG5cdFx0dGhlbWUgOiAndHdpbGlnaHQnLFxuXHRcdGxpbmVXcmFwcGluZzogdHJ1ZVxuXHR9KTtcblxuXHRjbVJlc3VsdHMucmVwbGFjZVNlbGVjdGlvbigkc2NvcGUub3V0cHV0KTtcblxuXHQkc2NvcGUuJG9uKCdzdWJtaXNzaW9uVXBkYXRlZCcsIGZ1bmN0aW9uKGUpe1xuXHRcdCRzY29wZS5xdWVzdGlvbiA9IENoYWxsZW5nZUZhY3RvcnkuZ2V0U3VibWlzc2lvbigpO1xuXHRcdHJlc3VsdHMgPSBDaGFsbGVuZ2VGYWN0b3J5LmNvbXBpbGVTdWJtaXNzaW9uKCRzY29wZS5xdWVzdGlvbik7XG5cdFx0JHNjb3BlLnJlc3VsdHMgPSByZXN1bHRzO1xuXHRcdCRzY29wZS5vdXRwdXQgPSBDaGFsbGVuZ2VGYWN0b3J5LmNvbXBpbGVTdWJtaXNzaW9uKCRzY29wZS5xdWVzdGlvbikub3V0cHV0O1xuXHRcdCRzY29wZS5lcnJvciA9IENoYWxsZW5nZUZhY3RvcnkuY29tcGlsZVN1Ym1pc3Npb24oJHNjb3BlLnF1ZXN0aW9uKS5lcnJvcjtcblx0XHRjbVJlc3VsdHMuc2V0VmFsdWUoJHNjb3BlLm91dHB1dCk7XG5cblx0fSk7XG59KTsiLCJhcHAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKXtcblx0JHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2NoYWxsZW5nZS52aWV3Jywge1xuXHRcdHVybDogJy9jaGFsbGVuZ2UvdmlldycsXG5cdFx0dmlld3M6IHtcblx0XHRcdCd0YWItdmlldycgOiB7XG5cdFx0XHRcdHRlbXBsYXRlVXJsOiAnZmVhdHVyZXMvY2hhbGxlbmdlLXZpZXcvY2hhbGxlbmdlLXZpZXcuaHRtbCcsXG5cdFx0XHRcdGNvbnRyb2xsZXI6ICdDaGFsbGVuZ2VWaWV3Q3RybCdcblx0XHRcdH1cblx0XHR9XG5cdH0pO1xufSk7XG5cbmFwcC5jb250cm9sbGVyKCdDaGFsbGVuZ2VWaWV3Q3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgQ2hhbGxlbmdlRmFjdG9yeSwgJHN0YXRlLCAkaW9uaWNTbGlkZUJveERlbGVnYXRlKXtcblxuXHQvL0NvbnRyb2xzIFNsaWRlXG5cdCRzY29wZS5zbGlkZUhhc0NoYWxsZW5nZWQgPSBmdW5jdGlvbihpbmRleCl7XG5cdFx0JGlvbmljU2xpZGVCb3hEZWxlZ2F0ZS5zbGlkZShpbmRleCk7XG5cdH07XG5cblx0Ly9DaGFsbGVuZ2UgVmlld1xuXHQkc2NvcGUuY2hhbGxlbmdlID0gQ2hhbGxlbmdlRmFjdG9yeS5nZXRQcm9ibGVtKCkgfHwgXCJUZXN0XCI7XG5cblx0Ly8gJHNjb3BlLiRvbigncHJvYmxlbVVwZGF0ZWQnLCBmdW5jdGlvbihlKXtcblx0Ly8gXHQkc2NvcGUuY2hhbGxlbmdlID0gQ2hhbGxlbmdlRmFjdG9yeS5nZXRQcm9ibGVtKCk7XG5cdC8vIH0pO1xuXG5cblx0XG59KTsiLCJhcHAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyLCBVU0VSX1JPTEVTKXtcblxuICAkc3RhdGVQcm92aWRlci5zdGF0ZSgnY2hhdHMnLCB7XG4gICAgICB1cmw6ICcvY2hhdHMnLFxuICAgICAgdGVtcGxhdGVVcmw6ICdmZWF0dXJlcy9jaGF0cy90YWItY2hhdHMuaHRtbCcsXG4gICAgICBjb250cm9sbGVyOiAnQ2hhdHNDdHJsJyxcbiAgICAgIGRhdGE6IHtcbiAgICAgICAgYXV0aGVudGljYXRlOiBbVVNFUl9ST0xFUy5wdWJsaWNdXG4gICAgICB9XG4gICAgfSlcbiAgICAuc3RhdGUoJ2NoYXQtZGV0YWlsJywge1xuICAgICAgdXJsOiAnL2NoYXRzLzpjaGF0SWQnLFxuICAgICAgdGVtcGxhdGVVcmw6ICdmZWF0dXJlcy9jaGF0cy9jaGF0LWRldGFpbC5odG1sJyxcbiAgICAgIGNvbnRyb2xsZXI6ICdDaGF0RGV0YWlsQ3RybCdcbiAgICB9KTtcbn0pO1xuXG5hcHAuY29udHJvbGxlcignQ2hhdHNDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBDaGF0cykge1xuICAkc2NvcGUuY2hhdHMgPSBDaGF0cy5hbGwoKTtcbiAgJHNjb3BlLnJlbW92ZSA9IGZ1bmN0aW9uKGNoYXQpIHtcbiAgICBDaGF0cy5yZW1vdmUoY2hhdCk7XG4gIH07XG59KTtcblxuYXBwLmNvbnRyb2xsZXIoJ0NoYXREZXRhaWxDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCAkc3RhdGVQYXJhbXMsIENoYXRzKSB7XG4gICRzY29wZS5jaGF0ID0gQ2hhdHMuZ2V0KCRzdGF0ZVBhcmFtcy5jaGF0SWQpO1xufSk7XG5cbmFwcC5mYWN0b3J5KCdDaGF0cycsIGZ1bmN0aW9uKCkge1xuICAvLyBNaWdodCB1c2UgYSByZXNvdXJjZSBoZXJlIHRoYXQgcmV0dXJucyBhIEpTT04gYXJyYXlcblxuICAvLyBTb21lIGZha2UgdGVzdGluZyBkYXRhXG4gIHZhciBjaGF0cyA9IFt7XG4gICAgaWQ6IDAsXG4gICAgbmFtZTogJ0JlbiBTcGFycm93JyxcbiAgICBsYXN0VGV4dDogJ1lvdSBvbiB5b3VyIHdheT8nLFxuICAgIGZhY2U6ICdodHRwczovL3Bicy50d2ltZy5jb20vcHJvZmlsZV9pbWFnZXMvNTE0NTQ5ODExNzY1MjExMTM2LzlTZ0F1SGVZLnBuZydcbiAgfSwge1xuICAgIGlkOiAxLFxuICAgIG5hbWU6ICdNYXggTHlueCcsXG4gICAgbGFzdFRleHQ6ICdIZXksIGl0XFwncyBub3QgbWUnLFxuICAgIGZhY2U6ICdodHRwczovL2F2YXRhcnMzLmdpdGh1YnVzZXJjb250ZW50LmNvbS91LzExMjE0P3Y9MyZzPTQ2MCdcbiAgfSx7XG4gICAgaWQ6IDIsXG4gICAgbmFtZTogJ0FkYW0gQnJhZGxleXNvbicsXG4gICAgbGFzdFRleHQ6ICdJIHNob3VsZCBidXkgYSBib2F0JyxcbiAgICBmYWNlOiAnaHR0cHM6Ly9wYnMudHdpbWcuY29tL3Byb2ZpbGVfaW1hZ2VzLzQ3OTA5MDc5NDA1ODM3OTI2NC84NFRLal9xYS5qcGVnJ1xuICB9LCB7XG4gICAgaWQ6IDMsXG4gICAgbmFtZTogJ1BlcnJ5IEdvdmVybm9yJyxcbiAgICBsYXN0VGV4dDogJ0xvb2sgYXQgbXkgbXVrbHVrcyEnLFxuICAgIGZhY2U6ICdodHRwczovL3Bicy50d2ltZy5jb20vcHJvZmlsZV9pbWFnZXMvNDkxOTk1Mzk4MTM1NzY3MDQwL2llMlpfVjZlLmpwZWcnXG4gIH0sIHtcbiAgICBpZDogNCxcbiAgICBuYW1lOiAnTWlrZSBIYXJyaW5ndG9uJyxcbiAgICBsYXN0VGV4dDogJ1RoaXMgaXMgd2lja2VkIGdvb2QgaWNlIGNyZWFtLicsXG4gICAgZmFjZTogJ2h0dHBzOi8vcGJzLnR3aW1nLmNvbS9wcm9maWxlX2ltYWdlcy81NzgyMzcyODEzODQ4NDEyMTYvUjNhZTFuNjEucG5nJ1xuICB9XTtcblxuICByZXR1cm4ge1xuICAgIGFsbDogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gY2hhdHM7XG4gICAgfSxcbiAgICByZW1vdmU6IGZ1bmN0aW9uKGNoYXQpIHtcbiAgICAgIGNoYXRzLnNwbGljZShjaGF0cy5pbmRleE9mKGNoYXQpLCAxKTtcbiAgICB9LFxuICAgIGdldDogZnVuY3Rpb24oY2hhdElkKSB7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoYXRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChjaGF0c1tpXS5pZCA9PT0gcGFyc2VJbnQoY2hhdElkKSkge1xuICAgICAgICAgIHJldHVybiBjaGF0c1tpXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICB9O1xufSk7XG4iLCJhcHAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKXtcblx0JHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2V4ZXJjaXNtJywge1xuXHRcdHRlbXBsYXRlVXJsIDogJ2ZlYXR1cmVzL2V4ZXJjaXNtL2V4ZXJjaXNtLmh0bWwnLFxuXHRcdGFic3RyYWN0IDogdHJ1ZSxcblx0XHRyZXNvbHZlIDoge1xuXHRcdFx0bWFya2Rvd24gOiBmdW5jdGlvbihBdmFpbGFibGVFeGVyY2lzZXMsIEV4ZXJjaXNtRmFjdG9yeSwgJHN0YXRlKXtcblxuXHRcdFx0XHRpZihFeGVyY2lzbUZhY3RvcnkuZ2V0VGVzdFNjcmlwdCgpLmxlbmd0aCA9PT0gMCkge1xuXHRcdFx0XHRcdHZhciBleGVyY2lzZSA9IEF2YWlsYWJsZUV4ZXJjaXNlcy5nZXRSYW5kb21FeGVyY2lzZSgpO1xuXHRcdFx0XHRcdEV4ZXJjaXNtRmFjdG9yeS5zZXROYW1lKGV4ZXJjaXNlLm5hbWUpO1xuXHRcdFx0XHRcdHJldHVybiBFeGVyY2lzbUZhY3RvcnkuZ2V0RXh0ZXJuYWxTY3JpcHQoZXhlcmNpc2UubGluaykudGhlbihmdW5jdGlvbihkYXRhKXtcblx0XHRcdFx0XHRcdHJldHVybiBFeGVyY2lzbUZhY3RvcnkuZ2V0RXh0ZXJuYWxNZChleGVyY2lzZS5tZExpbmspO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHR9XG5cdH0pO1xufSk7XG5cbmFwcC5mYWN0b3J5KCdFeGVyY2lzbUZhY3RvcnknLCBmdW5jdGlvbigkaHR0cCwgJHJvb3RTY29wZSl7XG5cdHZhciBuYW1lID0gJyc7XG5cdHZhciB0ZXN0ID0gJyc7XG5cdHZhciBjb2RlID0gJyc7XG5cdHZhciBtYXJrZG93biA9ICcnO1xuXG5cdHJldHVybiB7XG5cdFx0Z2V0RXh0ZXJuYWxTY3JpcHQgOiBmdW5jdGlvbihsaW5rKXtcblx0XHRcdHJldHVybiAkaHR0cC5nZXQobGluaykudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG5cdFx0XHRcdHRlc3QgPSByZXNwb25zZS5kYXRhO1xuXHRcdFx0XHRyZXR1cm4gcmVzcG9uc2UuZGF0YTtcblx0XHRcdH0pO1xuXHRcdH0sXG5cdFx0Z2V0RXh0ZXJuYWxNZCA6IGZ1bmN0aW9uKGxpbmspe1xuXHRcdFx0cmV0dXJuICRodHRwLmdldChsaW5rKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcblx0XHRcdFx0bWFya2Rvd24gPSByZXNwb25zZS5kYXRhO1xuXHRcdFx0XHRyZXR1cm4gcmVzcG9uc2UuZGF0YTtcblx0XHRcdH0pO1xuXHRcdH0sXG5cdFx0c2V0TmFtZSA6IGZ1bmN0aW9uKHNldE5hbWUpe1xuXHRcdFx0bmFtZSA9IHNldE5hbWU7XG5cdFx0fSxcblx0XHRzZXRUZXN0U2NyaXB0IDogZnVuY3Rpb24odGVzdCl7XG5cdFx0XHR0ZXN0ID0gdGVzdDtcblx0XHRcdCRyb290U2NvcGUuJGJyb2FkY2FzdCgndGVzdENoYW5nZScsIHt0ZXN0IDogdGVzdH0pO1xuXHRcdH0sXG5cdFx0c2V0Q29kZVNjcmlwdCA6IGZ1bmN0aW9uIChjb2RlKXtcblx0XHRcdGNvZGUgPSBjb2RlO1xuXHRcdFx0JHJvb3RTY29wZS4kYnJvYWRjYXN0KCdjb2RlQ2hhbmdlJywge2NvZGUgOiBjb2RlfSk7XG5cdFx0fSxcblx0XHRnZXRUZXN0U2NyaXB0IDogZnVuY3Rpb24oKXtcblx0XHRcdHJldHVybiB0ZXN0O1xuXHRcdH0sXG5cdFx0Z2V0Q29kZVNjcmlwdCA6IGZ1bmN0aW9uKCl7XG5cdFx0XHRyZXR1cm4gY29kZTtcblx0XHR9LFxuXHRcdGdldE1hcmtkb3duIDogZnVuY3Rpb24oKXtcblx0XHRcdHJldHVybiBtYXJrZG93bjtcblx0XHR9LFxuXHRcdGdldE5hbWUgOiBmdW5jdGlvbigpe1xuXHRcdFx0cmV0dXJuIG5hbWU7XG5cdFx0fVxuXHR9O1xufSk7XG5cbmFwcC5mYWN0b3J5KCdBdmFpbGFibGVFeGVyY2lzZXMnLCBmdW5jdGlvbigpe1xuXG5cdHZhciBsaWJyYXJ5ID0gW1xuXHRcdCdhY2N1bXVsYXRlJyxcblx0XHQnYWxsZXJnaWVzJyxcblx0XHQnYW5hZ3JhbScsXG5cdFx0J2F0YmFzaC1jaXBoZXInLFxuXHRcdCdiZWVyLXNvbmcnLFxuXHRcdCdiaW5hcnknLFxuXHRcdCdiaW5hcnktc2VhcmNoLXRyZWUnLFxuXHRcdCdib2InLFxuXHRcdCdicmFja2V0LXB1c2gnLFxuXHRcdCdjaXJjdWxhci1idWZmZXInLFxuXHRcdCdjbG9jaycsXG5cdFx0J2NyeXB0by1zcXVhcmUnLFxuXHRcdCdjdXN0b20tc2V0Jyxcblx0XHQnZGlmZmVyZW5jZS1vZi1zcXVhcmVzJyxcblx0XHQnZXRsJyxcblx0XHQnZm9vZC1jaGFpbicsXG5cdFx0J2dpZ2FzZWNvbmQnLFxuXHRcdCdncmFkZS1zY2hvb2wnLFxuXHRcdCdncmFpbnMnLFxuXHRcdCdoYW1taW5nJyxcblx0XHQnaGVsbG8td29ybGQnLFxuXHRcdCdoZXhhZGVjaW1hbCdcblx0XTtcblxuXHR2YXIgZ2VuZXJhdGVMaW5rID0gZnVuY3Rpb24obmFtZSl7XG5cdFx0cmV0dXJuICdleGVyY2lzbS9qYXZhc2NyaXB0LycgKyBuYW1lICsgJy8nICsgbmFtZSArICdfdGVzdC5zcGVjLmpzJztcblx0fTtcblxuXHR2YXIgZ2VuZXJhdGVNZExpbmsgPSBmdW5jdGlvbihuYW1lKXtcblx0XHRyZXR1cm4gJ2V4ZXJjaXNtL2phdmFzY3JpcHQvJyArIG5hbWUgKyAnLycgKyBuYW1lICsgJy5tZCc7XG5cdH07XG5cblx0dmFyIGdlbmVyYXRlUmFuZG9tID0gZnVuY3Rpb24oKXtcblx0XHR2YXIgcmFuZG9tID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogbGlicmFyeS5sZW5ndGgpO1xuXHRcdHJldHVybiBsaWJyYXJ5W3JhbmRvbV07XG5cdH07XG5cblx0cmV0dXJuIHtcblx0XHRnZXRTcGVjaWZpY0V4ZXJjaXNlIDogZnVuY3Rpb24obmFtZSl7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRsaW5rIDogZ2VuZXJhdGVMaW5rKG5hbWUpLFxuXHRcdFx0XHRtZExpbmsgOiBnZW5lcmF0ZU1kTGluayhuYW1lKVxuXHRcdFx0fTtcblx0XHR9LFxuXHRcdGdldFJhbmRvbUV4ZXJjaXNlIDogZnVuY3Rpb24oKXtcblx0XHRcdHZhciBuYW1lID0gZ2VuZXJhdGVSYW5kb20oKTtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdG5hbWUgOiBuYW1lLFxuXHRcdFx0XHRsaW5rIDogZ2VuZXJhdGVMaW5rKG5hbWUpLFxuXHRcdFx0XHRtZExpbmsgOiBnZW5lcmF0ZU1kTGluayhuYW1lKVxuXHRcdFx0fTtcblx0XHR9XG5cdH07XG59KTsiLCJhcHAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKXtcblx0JHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2V4ZXJjaXNtLmNvZGUnLCB7XG5cdFx0dXJsIDogJy9leGVyY2lzbS9jb2RlJyxcblx0XHR2aWV3cyA6IHtcblx0XHRcdCd0YWItY29kZScgOiB7XG5cdFx0XHRcdHRlbXBsYXRlVXJsIDogJ2ZlYXR1cmVzL2V4ZXJjaXNtLWNvZGUvZXhlcmNpc20tY29kZS5odG1sJyxcblx0XHRcdFx0Y29udHJvbGxlcjogJ0V4ZXJjaXNtQ29kZUN0cmwnXG5cdFx0XHR9XG5cdFx0fVxuXHR9KTtcbn0pO1xuXG5hcHAuY29udHJvbGxlcignRXhlcmNpc21Db2RlQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgRXhlcmNpc21GYWN0b3J5LCAkc3RhdGUpe1xuXHQkc2NvcGUubmFtZSA9IEV4ZXJjaXNtRmFjdG9yeS5nZXROYW1lKCk7XG5cdCRzY29wZS5jb2RlID0gRXhlcmNpc21GYWN0b3J5LmdldENvZGVTY3JpcHQoKTtcblxuXHQvL3Bhc3NpbmcgdGhpcyB1cGRhdGUgZnVuY3Rpb24gc28gdGhhdCBvbiB0ZXh0IGNoYW5nZSBpbiB0aGUgZGlyZWN0aXZlIHRoZSBmYWN0b3J5IHdpbGwgYmUgYWxlcnRlZFxuXHQkc2NvcGUuY29tcGlsZSA9IGZ1bmN0aW9uKGNvZGUpe1xuXHRcdEV4ZXJjaXNtRmFjdG9yeS5zZXRDb2RlU2NyaXB0KGNvZGUpO1xuXHRcdCRzdGF0ZS5nbygnZXhlcmNpc20uY29tcGlsZScpO1xuXHR9O1xufSk7IiwiYXBwLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlcil7XG5cdCRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdleGVyY2lzbS5jb21waWxlJywge1xuXHRcdHVybCA6ICcvZXhlcmNpc20vY29tcGlsZScsXG5cdFx0dmlld3MgOiB7XG5cdFx0XHQndGFiLWNvbXBpbGUnIDoge1xuXHRcdFx0XHR0ZW1wbGF0ZVVybCA6ICdmZWF0dXJlcy9leGVyY2lzbS1jb21waWxlL2V4ZXJjaXNtLWNvbXBpbGUuaHRtbCcsXG5cdFx0XHRcdGNvbnRyb2xsZXI6ICdFeGVyY2lzbUNvbXBpbGVDdHJsJ1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0b25FbnRlciA6IGZ1bmN0aW9uKCl7XG5cdFx0XHRpZih3aW5kb3cuamFzbWluZSkgd2luZG93Lmphc21pbmUuZ2V0RW52KCkuZXhlY3V0ZSgpO1xuXHRcdH1cblx0fSk7XG59KTtcblxuYXBwLmNvbnRyb2xsZXIoJ0V4ZXJjaXNtQ29tcGlsZUN0cmwnLCBmdW5jdGlvbigkc2NvcGUsIEV4ZXJjaXNtRmFjdG9yeSl7XG5cdCRzY29wZS5uYW1lID0gRXhlcmNpc21GYWN0b3J5LmdldE5hbWUoKTtcblx0JHNjb3BlLnRlc3QgPSBFeGVyY2lzbUZhY3RvcnkuZ2V0VGVzdFNjcmlwdCgpO1xuXHQkc2NvcGUuY29kZSA9IEV4ZXJjaXNtRmFjdG9yeS5nZXRDb2RlU2NyaXB0KCk7XG5cblx0JHNjb3BlLiRvbigndGVzdENoYW5nZScsIGZ1bmN0aW9uKGV2ZW50LCBkYXRhKXtcblx0XHQkc2NvcGUudGVzdCA9IGRhdGEudGVzdDtcblx0fSk7XG5cblx0JHNjb3BlLiRvbignY29kZUNoYW5nZScsIGZ1bmN0aW9uKGV2ZW50LCBkYXRhKXtcblx0XHQkc2NvcGUuY29kZSA9IGRhdGEuY29kZTtcblx0fSk7XG59KTsiLCJhcHAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKXtcblx0JHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2V4ZXJjaXNtLnRlc3QnLCB7XG5cdFx0dXJsIDogJy9leGVyY2lzbS90ZXN0Jyxcblx0XHR2aWV3cyA6IHtcblx0XHRcdCd0YWItdGVzdCcgOiB7XG5cdFx0XHRcdHRlbXBsYXRlVXJsIDogJ2ZlYXR1cmVzL2V4ZXJjaXNtLXRlc3QvZXhlcmNpc20tdGVzdC5odG1sJyxcblx0XHRcdFx0Y29udHJvbGxlciA6ICdFeGVyY2lzbVRlc3RDdHJsJ1xuXHRcdFx0fVxuXHRcdH1cblx0fSk7XG59KTtcblxuYXBwLmNvbnRyb2xsZXIoJ0V4ZXJjaXNtVGVzdEN0cmwnLCBmdW5jdGlvbigkc2NvcGUsIEV4ZXJjaXNtRmFjdG9yeSl7XG5cdCRzY29wZS5uYW1lID0gRXhlcmNpc21GYWN0b3J5LmdldE5hbWUoKTtcblx0JHNjb3BlLnRlc3QgPSBFeGVyY2lzbUZhY3RvcnkuZ2V0VGVzdFNjcmlwdCgpO1xuXG5cdC8vcGFzc2luZyB0aGlzIHVwZGF0ZSBmdW5jdGlvbiBzbyB0aGF0IG9uIHRleHQgY2hhbmdlIGluIHRoZSBkaXJlY3RpdmUgdGhlIGZhY3Rvcnkgd2lsbCBiZSBhbGVydGVkXG5cdCRzY29wZS51cGRhdGVmdW5jID0gZnVuY3Rpb24obmV3VmFsdWUpe1xuXHRcdEV4ZXJjaXNtRmFjdG9yeS5zZXRUZXN0U2NyaXB0KG5ld1ZhbHVlKTtcblx0fTtcbn0pOyIsImFwcC5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIpe1xuXHQkc3RhdGVQcm92aWRlci5zdGF0ZSgnZXhlcmNpc20udmlldycsIHtcblx0XHR1cmw6ICcvZXhlcmNpc20vdmlldycsXG5cdFx0dmlld3M6IHtcblx0XHRcdCd0YWItdmlldycgOiB7XG5cdFx0XHRcdHRlbXBsYXRlVXJsOiAnZmVhdHVyZXMvZXhlcmNpc20tdmlldy9leGVyY2lzbS12aWV3Lmh0bWwnLFxuXHRcdFx0XHRjb250cm9sbGVyOiAnRXhlcmNpc21WaWV3Q3RybCdcblx0XHRcdH1cblx0XHR9XG5cdH0pO1xufSk7XG5cbmFwcC5jb250cm9sbGVyKCdFeGVyY2lzbVZpZXdDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBFeGVyY2lzbUZhY3Rvcnkpe1xuXHQkc2NvcGUubWFya2Rvd24gPSBFeGVyY2lzbUZhY3RvcnkuZ2V0TWFya2Rvd24oKTtcblx0JHNjb3BlLm5hbWUgPSBFeGVyY2lzbUZhY3RvcnkuZ2V0TmFtZSgpO1xufSk7IiwiYXBwLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlcil7XG5cdCRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdsb2dpbicsIHtcblx0XHR1cmwgOiAnL2xvZ2luJyxcblx0XHR0ZW1wbGF0ZVVybCA6ICdmZWF0dXJlcy9sb2dpbi9sb2dpbi5odG1sJyxcblx0XHRjb250cm9sbGVyIDogJ0xvZ2luQ3RybCdcblx0fSk7XG59KTtcblxuYXBwLmNvbnRyb2xsZXIoJ0xvZ2luQ3RybCcsIGZ1bmN0aW9uKCRyb290U2NvcGUsICRzY29wZSwgJGlvbmljUG9wdXAsICRzdGF0ZSwgQXV0aFNlcnZpY2Upe1xuXHQkc2NvcGUuZGF0YSA9IHt9O1xuXHQkc2NvcGUuZXJyb3IgPSBudWxsO1xuXG4gICAgJHNjb3BlLnNpZ251cCA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICRzdGF0ZS5nbygnc2lnbnVwJyk7XG4gICAgfTtcblxuXHQkc2NvcGUubG9naW4gPSBmdW5jdGlvbigpe1xuXHRcdEF1dGhTZXJ2aWNlXG5cdFx0XHQubG9naW4oJHNjb3BlLmRhdGEpXG5cdFx0XHQudGhlbihmdW5jdGlvbihhdXRoZW50aWNhdGVkKXsgLy9UT0RPOmF1dGhlbnRpY2F0ZWQgaXMgd2hhdCBpcyByZXR1cm5lZFxuXHRcdFx0XHQvL2NvbnNvbGUubG9nKCdsb2dpbiwgdGFiLmNoYWxsZW5nZS1zdWJtaXQnKTtcblx0XHRcdFx0Ly8kc2NvcGUubWVudSA9IHRydWU7XG5cdFx0XHRcdCRyb290U2NvcGUuJGJyb2FkY2FzdCgnQXV0aCcpO1xuXHRcdFx0XHQkc2NvcGUuc3RhdGVzLnB1c2goeyAvL1RPRE86IE5lZWQgdG8gYWRkIGEgcGFyZW50IGNvbnRyb2xsZXIgdG8gY29tbXVuaWNhdGVcblx0XHRcdFx0XHRuYW1lOiAnTG9nb3V0Jyxcblx0XHRcdFx0XHRyZWY6IGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0XHRBdXRoU2VydmljZS5sb2dvdXQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5kYXRhID0ge307XG5cdFx0XHRcdFx0XHQkc2NvcGUuc3RhdGVzLnBvcCgpOyAvL1RPRE86IEZpbmQgYSBiZXR0ZXIgd2F5IHRvIHJlbW92ZSB0aGUgTG9nb3V0IGxpbmssIGluc3RlYWQgb2YgcG9wXG5cdFx0XHRcdFx0XHQkc3RhdGUuZ28oJ3NpZ251cCcpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHRcdCRzdGF0ZS5nbygnY2hhbGxlbmdlLnZpZXcnKTtcblx0XHRcdFx0Ly9UT0RPOiBXZSBjYW4gc2V0IHRoZSB1c2VyIG5hbWUgaGVyZSBhcyB3ZWxsLiBVc2VkIGluIGNvbmp1bmN0aW9uIHdpdGggYSBtYWluIGN0cmxcblx0XHRcdH0pXG5cdFx0XHQuY2F0Y2goZnVuY3Rpb24oZXJyKXtcblx0XHRcdFx0JHNjb3BlLmVycm9yID0gJ0xvZ2luIEludmFsaWQnO1xuXHRcdFx0XHRjb25zb2xlLmVycm9yKEpTT04uc3RyaW5naWZ5KGVycikpXG5cdFx0XHRcdHZhciBhbGVydFBvcHVwID0gJGlvbmljUG9wdXAuYWxlcnQoe1xuXHRcdFx0XHRcdHRpdGxlOiAnTG9naW4gZmFpbGVkIScsXG5cdFx0XHRcdFx0dGVtcGxhdGU6ICdQbGVhc2UgY2hlY2sgeW91ciBjcmVkZW50aWFscyEnXG5cdFx0XHRcdH0pO1xuXHRcdFx0fSk7XG5cdH07XG59KTtcblxuXG4vL1RPRE86IENsZWFudXAgY29tbWVudGVkIGNvZGVcblxuIiwiYXBwLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlcil7XG4gICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ3NpZ251cCcse1xuICAgICAgICB1cmw6XCIvc2lnbnVwXCIsXG4gICAgICAgIHRlbXBsYXRlVXJsOiBcImZlYXR1cmVzL3NpZ251cC9zaWdudXAuaHRtbFwiLFxuICAgICAgICBjb250cm9sbGVyOiAnU2lnblVwQ3RybCdcbiAgICB9KTtcbn0pO1xuXG5hcHAuY29udHJvbGxlcignU2lnblVwQ3RybCcsZnVuY3Rpb24oJHJvb3RTY29wZSwgJGh0dHAsICRzY29wZSwgJHN0YXRlLCBBdXRoU2VydmljZSwgJGlvbmljUG9wdXApe1xuICAgICRzY29wZS5kYXRhID0ge307XG4gICAgJHNjb3BlLmVycm9yID0gbnVsbDtcblxuICAgICRzY29wZS5sb2dpbiA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICRzdGF0ZS5nbygnbG9naW4nKTtcbiAgICB9O1xuXG4gICAgJHNjb3BlLnNpZ251cCA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIEF1dGhTZXJ2aWNlXG4gICAgICAgICAgICAuc2lnbnVwKCRzY29wZS5kYXRhKVxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oYXV0aGVudGljYXRlZCl7XG4gICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZygnc2lnbnVwLCB0YWIuY2hhbGxlbmdlJyk7XG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KCdBdXRoJyk7XG4gICAgICAgICAgICAgICAgJHNjb3BlLnN0YXRlcy5wdXNoKHsgLy9UT0RPOiBOZWVkIHRvIGFkZCBhIHBhcmVudCBjb250cm9sbGVyIHRvIGNvbW11bmljYXRlXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6ICdMb2dvdXQnLFxuICAgICAgICAgICAgICAgICAgICByZWY6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgICAgICBBdXRoU2VydmljZS5sb2dvdXQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5kYXRhID0ge307XG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuc3RhdGVzLnBvcCgpOyAvL1RPRE86IEZpbmQgYSBiZXR0ZXIgd2F5IHRvIHJlbW92ZSB0aGUgTG9nb3V0IGxpbmssIGluc3RlYWQgb2YgcG9wXG4gICAgICAgICAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ3NpZ251cCcpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgJHN0YXRlLmdvKCdjaGFsbGVuZ2UudmlldycpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5jYXRjaChmdW5jdGlvbihlcnIpe1xuICAgICAgICAgICAgICAgICRzY29wZS5lcnJvciA9ICdTaWdudXAgSW52YWxpZCc7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihKU09OLnN0cmluZ2lmeShlcnIpKVxuICAgICAgICAgICAgICAgIHZhciBhbGVydFBvcHVwID0gJGlvbmljUG9wdXAuYWxlcnQoe1xuICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ1NpZ251cCBmYWlsZWQhJyxcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGU6ICdQbGVhc2UgY2hlY2sgeW91ciBjcmVkZW50aWFscyEnXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICB9O1xuXG59KTtcblxuLy9UT0RPOiBGb3JtIFZhbGlkYXRpb25cbi8vVE9ETzogQ2xlYW51cCBjb21tZW50ZWQgY29kZSIsImFwcC5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIpe1xuXHQkc3RhdGVQcm92aWRlci5zdGF0ZSgnd2VsY29tZScsIHtcblx0XHR1cmwgOiAnL3dlbGNvbWUnLFxuXHRcdHRlbXBsYXRlVXJsIDogJ2ZlYXR1cmVzL3dlbGNvbWUvd2VsY29tZS5odG1sJyxcblx0XHRjb250cm9sbGVyIDogJ1dlbGNvbWVDdHJsJ1xuXHR9KTtcbn0pO1xuXG5hcHAuY29udHJvbGxlcignV2VsY29tZUN0cmwnLCBmdW5jdGlvbigkc2NvcGUsICRzdGF0ZSwgQXV0aFNlcnZpY2UsICRyb290U2NvcGUpe1xuXHQvL1RPRE86IFNwbGFzaCBwYWdlIHdoaWxlIHlvdSBsb2FkIHJlc291cmNlcyAocG9zc2libGUgaWRlYSlcblx0Ly9jb25zb2xlLmxvZygnV2VsY29tZUN0cmwnKTtcblx0JHNjb3BlLmxvZ2luID0gZnVuY3Rpb24oKXtcblx0XHQkc3RhdGUuZ28oJ2xvZ2luJyk7XG5cdH07XG5cdCRzY29wZS5zaWdudXAgPSBmdW5jdGlvbigpe1xuXHRcdCRzdGF0ZS5nbygnc2lnbnVwJyk7XG5cdH07XG5cblx0aWYgKEF1dGhTZXJ2aWNlLmlzQXV0aGVudGljYXRlZCgpKSB7XG5cdFx0JHJvb3RTY29wZS4kYnJvYWRjYXN0KCdBdXRoJyk7XG5cdFx0JHNjb3BlLnN0YXRlcy5wdXNoKHsgLy9UT0RPOiBOZWVkIHRvIGFkZCBhIHBhcmVudCBjb250cm9sbGVyIHRvIGNvbW11bmljYXRlXG5cdFx0XHRuYW1lOiAnTG9nb3V0Jyxcblx0XHRcdHJlZjogZnVuY3Rpb24oKXtcblx0XHRcdFx0QXV0aFNlcnZpY2UubG9nb3V0KCk7XG5cdFx0XHRcdCRzY29wZS5kYXRhID0ge307XG5cdFx0XHRcdCRzY29wZS5zdGF0ZXMucG9wKCk7IC8vVE9ETzogRmluZCBhIGJldHRlciB3YXkgdG8gcmVtb3ZlIHRoZSBMb2dvdXQgbGluaywgaW5zdGVhZCBvZiBwb3Bcblx0XHRcdFx0JHN0YXRlLmdvKCdzaWdudXAnKTtcblx0XHRcdH1cblx0XHR9KTtcblx0XHQkc3RhdGUuZ28oJ2NoYWxsZW5nZS52aWV3Jyk7XG5cdH0gZWxzZSB7XG5cdFx0Ly9UT0RPOiAkc3RhdGUuZ28oJ3NpZ251cCcpOyBSZW1vdmUgQmVsb3cgbGluZVxuXHRcdCRzdGF0ZS5nbygnY2hhbGxlbmdlLnZpZXcnKTtcblx0fVxufSk7IiwiLy90b2tlbiBpcyBzZW50IG9uIGV2ZXJ5IGh0dHAgcmVxdWVzdFxuYXBwLmZhY3RvcnkoJ0F1dGhJbnRlcmNlcHRvcicsZnVuY3Rpb24gQXV0aEludGVyY2VwdG9yKEFVVEhfRVZFTlRTLCRyb290U2NvcGUsJHEsQXV0aFRva2VuRmFjdG9yeSl7XG5cbiAgICB2YXIgc3RhdHVzRGljdCA9IHtcbiAgICAgICAgNDAxOiBBVVRIX0VWRU5UUy5ub3RBdXRoZW50aWNhdGVkLFxuICAgICAgICA0MDM6IEFVVEhfRVZFTlRTLm5vdEF1dGhvcml6ZWRcbiAgICB9O1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgcmVxdWVzdDogYWRkVG9rZW4sXG4gICAgICAgIHJlc3BvbnNlRXJyb3I6IGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KHN0YXR1c0RpY3RbcmVzcG9uc2Uuc3RhdHVzXSwgcmVzcG9uc2UpO1xuICAgICAgICAgICAgcmV0dXJuICRxLnJlamVjdChyZXNwb25zZSk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gYWRkVG9rZW4oY29uZmlnKXtcbiAgICAgICAgdmFyIHRva2VuID0gQXV0aFRva2VuRmFjdG9yeS5nZXRUb2tlbigpO1xuICAgICAgICAvL2NvbnNvbGUubG9nKCdhZGRUb2tlbicsdG9rZW4pO1xuICAgICAgICBpZih0b2tlbil7XG4gICAgICAgICAgICBjb25maWcuaGVhZGVycyA9IGNvbmZpZy5oZWFkZXJzIHx8IHt9O1xuICAgICAgICAgICAgY29uZmlnLmhlYWRlcnMuQXV0aG9yaXphdGlvbiA9ICdCZWFyZXIgJyArIHRva2VuO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjb25maWc7XG4gICAgfVxufSk7XG4vL3NraXBwZWQgQXV0aCBJbnRlcmNlcHRvcnMgZ2l2ZW4gVE9ETzogWW91IGNvdWxkIGFwcGx5IHRoZSBhcHByb2FjaCBpblxuLy9odHRwOi8vZGV2ZGFjdGljLmNvbS91c2VyLWF1dGgtYW5ndWxhcmpzLWlvbmljL1xuXG5hcHAuY29uZmlnKGZ1bmN0aW9uKCRodHRwUHJvdmlkZXIpe1xuICAgICRodHRwUHJvdmlkZXIuaW50ZXJjZXB0b3JzLnB1c2goJ0F1dGhJbnRlcmNlcHRvcicpO1xufSk7XG5cbmFwcC5jb25zdGFudCgnQVVUSF9FVkVOVFMnLCB7XG4gICAgICAgIG5vdEF1dGhlbnRpY2F0ZWQ6ICdhdXRoLW5vdC1hdXRoZW50aWNhdGVkJyxcbiAgICAgICAgbm90QXV0aG9yaXplZDogJ2F1dGgtbm90LWF1dGhvcml6ZWQnXG59KTtcblxuYXBwLmNvbnN0YW50KCdVU0VSX1JPTEVTJywge1xuICAgICAgICAvL2FkbWluOiAnYWRtaW5fcm9sZScsXG4gICAgICAgIHB1YmxpYzogJ3B1YmxpY19yb2xlJ1xufSk7XG5cbmFwcC5mYWN0b3J5KCdBdXRoVG9rZW5GYWN0b3J5JyxmdW5jdGlvbigkd2luZG93KXtcbiAgICB2YXIgc3RvcmUgPSAkd2luZG93LmxvY2FsU3RvcmFnZTtcbiAgICB2YXIga2V5ID0gJ2F1dGgtdG9rZW4nO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgZ2V0VG9rZW46IGdldFRva2VuLFxuICAgICAgICBzZXRUb2tlbjogc2V0VG9rZW5cbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gZ2V0VG9rZW4oKXtcbiAgICAgICAgcmV0dXJuIHN0b3JlLmdldEl0ZW0oa2V5KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzZXRUb2tlbih0b2tlbil7XG4gICAgICAgIGlmKHRva2VuKXtcbiAgICAgICAgICAgIHN0b3JlLnNldEl0ZW0oa2V5LHRva2VuKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHN0b3JlLnJlbW92ZUl0ZW0oa2V5KTtcbiAgICAgICAgfVxuICAgIH1cbn0pO1xuXG5hcHAuc2VydmljZSgnQXV0aFNlcnZpY2UnLGZ1bmN0aW9uKCRxLCRodHRwLFVTRVJfUk9MRVMsQXV0aFRva2VuRmFjdG9yeSxBcGlFbmRwb2ludCwkcm9vdFNjb3BlKXtcbiAgICB2YXIgdXNlcm5hbWUgPSAnJztcbiAgICB2YXIgaXNBdXRoZW50aWNhdGVkID0gZmFsc2U7XG4gICAgdmFyIGF1dGhUb2tlbjtcblxuICAgIGZ1bmN0aW9uIGxvYWRVc2VyQ3JlZGVudGlhbHMoKSB7XG4gICAgICAgIC8vdmFyIHRva2VuID0gd2luZG93LmxvY2FsU3RvcmFnZS5nZXRJdGVtKExPQ0FMX1RPS0VOX0tFWSk7XG4gICAgICAgIHZhciB0b2tlbiA9IEF1dGhUb2tlbkZhY3RvcnkuZ2V0VG9rZW4oKTtcbiAgICAgICAgLy9jb25zb2xlLmxvZyh0b2tlbik7XG4gICAgICAgIGlmICh0b2tlbikge1xuICAgICAgICAgICAgdXNlQ3JlZGVudGlhbHModG9rZW4pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc3RvcmVVc2VyQ3JlZGVudGlhbHMoZGF0YSkge1xuICAgICAgICBBdXRoVG9rZW5GYWN0b3J5LnNldFRva2VuKGRhdGEudG9rZW4pO1xuICAgICAgICB1c2VDcmVkZW50aWFscyhkYXRhKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB1c2VDcmVkZW50aWFscyhkYXRhKSB7XG4gICAgICAgIC8vY29uc29sZS5sb2coJ3VzZUNyZWRlbnRpYWxzIHRva2VuJyxkYXRhKTtcbiAgICAgICAgdXNlcm5hbWUgPSBkYXRhLnVzZXJuYW1lO1xuICAgICAgICBpc0F1dGhlbnRpY2F0ZWQgPSB0cnVlO1xuICAgICAgICBhdXRoVG9rZW4gPSBkYXRhLnRva2VuO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGRlc3Ryb3lVc2VyQ3JlZGVudGlhbHMoKSB7XG4gICAgICAgIGF1dGhUb2tlbiA9IHVuZGVmaW5lZDtcbiAgICAgICAgdXNlcm5hbWUgPSAnJztcbiAgICAgICAgaXNBdXRoZW50aWNhdGVkID0gZmFsc2U7XG4gICAgICAgIEF1dGhUb2tlbkZhY3Rvcnkuc2V0VG9rZW4oKTsgLy9lbXB0eSBjbGVhcnMgdGhlIHRva2VuXG4gICAgfVxuXG4gICAgdmFyIGxvZ291dCA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIGRlc3Ryb3lVc2VyQ3JlZGVudGlhbHMoKTtcblxuICAgIH07XG5cbiAgICAvL3ZhciBsb2dpbiA9IGZ1bmN0aW9uKClcbiAgICB2YXIgbG9naW4gPSBmdW5jdGlvbih1c2VyZGF0YSl7XG4gICAgICAgIGNvbnNvbGUubG9nKCdsb2dpbicsSlNPTi5zdHJpbmdpZnkodXNlcmRhdGEpKTtcbiAgICAgICAgcmV0dXJuICRxKGZ1bmN0aW9uKHJlc29sdmUscmVqZWN0KXtcbiAgICAgICAgICAgICRodHRwLnBvc3QoQXBpRW5kcG9pbnQudXJsK1wiL3VzZXIvbG9naW5cIiwgdXNlcmRhdGEpXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgICAgICAgICAgICAgICBzdG9yZVVzZXJDcmVkZW50aWFscyhyZXNwb25zZS5kYXRhKTsgLy9zdG9yZVVzZXJDcmVkZW50aWFsc1xuICAgICAgICAgICAgICAgICAgICAvL2lzQXV0aGVudGljYXRlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUocmVzcG9uc2UpOyAvL1RPRE86IHNlbnQgdG8gYXV0aGVudGljYXRlZFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgdmFyIHNpZ251cCA9IGZ1bmN0aW9uKHVzZXJkYXRhKXtcbiAgICAgICAgY29uc29sZS5sb2coJ3NpZ251cCcsSlNPTi5zdHJpbmdpZnkodXNlcmRhdGEpKTtcbiAgICAgICAgcmV0dXJuICRxKGZ1bmN0aW9uKHJlc29sdmUscmVqZWN0KXtcbiAgICAgICAgICAgICRodHRwLnBvc3QoQXBpRW5kcG9pbnQudXJsK1wiL3VzZXIvc2lnbnVwXCIsIHVzZXJkYXRhKVxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAgICAgICAgICAgICAgICAgc3RvcmVVc2VyQ3JlZGVudGlhbHMocmVzcG9uc2UuZGF0YSk7IC8vc3RvcmVVc2VyQ3JlZGVudGlhbHNcbiAgICAgICAgICAgICAgICAgICAgLy9pc0F1dGhlbnRpY2F0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHJlc3BvbnNlKTsgLy9UT0RPOiBzZW50IHRvIGF1dGhlbnRpY2F0ZWRcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgbG9hZFVzZXJDcmVkZW50aWFscygpO1xuXG4gICAgdmFyIGlzQXV0aG9yaXplZCA9IGZ1bmN0aW9uKGF1dGhlbnRpY2F0ZWQpIHtcbiAgICAgICAgaWYgKCFhbmd1bGFyLmlzQXJyYXkoYXV0aGVudGljYXRlZCkpIHtcbiAgICAgICAgICAgIGF1dGhlbnRpY2F0ZWQgPSBbYXV0aGVudGljYXRlZF07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIChpc0F1dGhlbnRpY2F0ZWQgJiYgYXV0aGVudGljYXRlZC5pbmRleE9mKFVTRVJfUk9MRVMucHVibGljKSAhPT0gLTEpO1xuICAgIH07XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBsb2dpbjogbG9naW4sXG4gICAgICAgIHNpZ251cDogc2lnbnVwLFxuICAgICAgICBsb2dvdXQ6IGxvZ291dCxcbiAgICAgICAgaXNBdXRoZW50aWNhdGVkOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ0F1dGhTZXJ2aWNlLmlzQXV0aGVudGljYXRlZCgpJyk7XG4gICAgICAgICAgICByZXR1cm4gaXNBdXRoZW50aWNhdGVkO1xuICAgICAgICB9LFxuICAgICAgICB1c2VybmFtZTogZnVuY3Rpb24oKXtyZXR1cm4gdXNlcm5hbWU7fSxcbiAgICAgICAgLy9nZXRMb2dnZWRJblVzZXI6IGdldExvZ2dlZEluVXNlcixcbiAgICAgICAgaXNBdXRob3JpemVkOiBpc0F1dGhvcml6ZWRcbiAgICB9XG5cbn0pO1xuXG4vL1RPRE86IERpZCBub3QgY29tcGxldGUgbWFpbiBjdHJsICdBcHBDdHJsIGZvciBoYW5kbGluZyBldmVudHMnXG4vLyBhcyBwZXIgaHR0cDovL2RldmRhY3RpYy5jb20vdXNlci1hdXRoLWFuZ3VsYXJqcy1pb25pYy8iLCJhcHAuZmlsdGVyKCdhcHBlbmQnLCBmdW5jdGlvbigpe1xuXHRyZXR1cm4gZnVuY3Rpb24oaW5wdXQsIGFwcGVuZCl7XG5cdFx0cmV0dXJuIGFwcGVuZCArIGlucHV0O1xuXHR9O1xufSk7IiwiYXBwLmZpbHRlcignbmFtZWZvcm1hdCcsIGZ1bmN0aW9uKCl7XG5cdHJldHVybiBmdW5jdGlvbih0ZXh0KXtcblx0XHRyZXR1cm4gJ0V4ZXJjaXNtIC0gJyArIHRleHQuc3BsaXQoJy0nKS5tYXAoZnVuY3Rpb24oZWwpe1xuXHRcdFx0cmV0dXJuIGVsLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgZWwuc2xpY2UoMSk7XG5cdFx0fSkuam9pbignICcpO1xuXHR9O1xufSk7IiwiYXBwLmZpbHRlcignbWFya2VkJywgZnVuY3Rpb24oJHNjZSl7XG5cdC8vIG1hcmtlZC5zZXRPcHRpb25zKHtcblx0Ly8gXHRyZW5kZXJlcjogbmV3IG1hcmtlZC5SZW5kZXJlcigpLFxuXHQvLyBcdGdmbTogdHJ1ZSxcblx0Ly8gXHR0YWJsZXM6IHRydWUsXG5cdC8vIFx0YnJlYWtzOiB0cnVlLFxuXHQvLyBcdHBlZGFudGljOiBmYWxzZSxcblx0Ly8gXHRzYW5pdGl6ZTogdHJ1ZSxcblx0Ly8gXHRzbWFydExpc3RzOiB0cnVlLFxuXHQvLyBcdHNtYXJ0eXBhbnRzOiBmYWxzZVxuXHQvLyB9KTtcblx0cmV0dXJuIGZ1bmN0aW9uKHRleHQpe1xuXHRcdGlmKHRleHQpe1xuXHRcdFx0cmV0dXJuICRzY2UudHJ1c3RBc0h0bWwobWFya2VkKHRleHQpKTtcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHRyZXR1cm4gdW5kZWZpbmVkO1xuXHRcdH1cblx0fTtcbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdpb25pYy51dGlscycsIFtdKVxuXG4uZmFjdG9yeSgnJGxvY2Fsc3RvcmFnZScsIFsnJHdpbmRvdycsIGZ1bmN0aW9uKCR3aW5kb3cpIHtcbiAgcmV0dXJuIHtcbiAgICBzZXQ6IGZ1bmN0aW9uKGtleSwgdmFsdWUpIHtcbiAgICAgICR3aW5kb3cubG9jYWxTdG9yYWdlW2tleV0gPSB2YWx1ZTtcbiAgICB9LFxuICAgIGdldDogZnVuY3Rpb24oa2V5LCBkZWZhdWx0VmFsdWUpIHtcbiAgICAgIHJldHVybiAkd2luZG93LmxvY2FsU3RvcmFnZVtrZXldIHx8IGRlZmF1bHRWYWx1ZTtcbiAgICB9LFxuICAgIHNldE9iamVjdDogZnVuY3Rpb24oa2V5LCB2YWx1ZSkge1xuICAgICAgJHdpbmRvdy5sb2NhbFN0b3JhZ2Vba2V5XSA9IEpTT04uc3RyaW5naWZ5KHZhbHVlKTtcbiAgICB9LFxuICAgIGdldE9iamVjdDogZnVuY3Rpb24oa2V5KSB7XG4gICAgICByZXR1cm4gSlNPTi5wYXJzZSgkd2luZG93LmxvY2FsU3RvcmFnZVtrZXldIHx8ICd7fScpO1xuICAgIH1cbiAgfTtcbn1dKTsiLCJhcHAuZGlyZWN0aXZlKCdjb2Rla2V5Ym9hcmQnLCBmdW5jdGlvbigkY29tcGlsZSl7XG5cdHJldHVybiB7XG5cdFx0cmVzdHJpY3QgOiAnQScsXG5cdFx0c2NvcGU6IHtcblx0XHRcdG5nTW9kZWwgOiAnPScgLy9saW5rcyBhbnkgbmdtb2RlbCBvbiB0aGUgZWxlbWVudFxuXHRcdH0sXG5cdFx0bGluayA6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRyaWJ1dGUpe1xuXHRcdFx0ZWxlbWVudC4kc2V0KFwiY2xhc3NcIiwgXCJiYXItc3RhYmxlXCIpO1xuXHRcdFx0XG5cdFx0fVxuXHR9O1xufSk7IiwiYXBwLmRpcmVjdGl2ZSgnY21lZGl0JywgZnVuY3Rpb24oKXtcblx0cmV0dXJuIHtcblx0XHRyZXN0cmljdCA6ICdBJyxcblx0XHRzY29wZToge1xuXHRcdFx0bmdNb2RlbCA6ICc9Jyxcblx0XHRcdHVwZGF0ZWZ1bmM6ICc9J1xuXHRcdH0sXG5cdFx0bGluayA6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRyaWJ1dGUpe1xuXHRcdFx0dmFyIHVwZGF0ZVRleHQgPSBmdW5jdGlvbigpe1xuXHRcdFx0XHR2YXIgbmV3VmFsdWUgPSBteUNvZGVNaXJyb3IuZ2V0VmFsdWUoKTtcblx0XHRcdFx0c2NvcGUubmdNb2RlbCA9IG5ld1ZhbHVlO1xuXHRcdFx0XHRpZihzY29wZS51cGRhdGVmdW5jKSBzY29wZS51cGRhdGVmdW5jKG5ld1ZhbHVlKTtcblx0XHRcdFx0c2NvcGUuJGFwcGx5KCk7XG5cdFx0XHR9O1xuXHRcdFx0Ly9pbml0aWFsaXplIENvZGVNaXJyb3Jcblx0XHRcdHZhciBteUNvZGVNaXJyb3IgPSBDb2RlTWlycm9yLmZyb21UZXh0QXJlYShkb2N1bWVudC5nZXRFbGVtZW50QnlJZChhdHRyaWJ1dGUuaWQpLCB7XG5cdFx0XHRcdGxpbmVOdW1iZXJzIDogdHJ1ZSxcblx0XHRcdFx0bW9kZTogJ2phdmFzY3JpcHQnLFxuXHRcdFx0XHRhdXRvZm9jdXMgOiB0cnVlLFxuXHRcdFx0XHR0aGVtZSA6ICd0d2lsaWdodCcsXG5cdFx0XHRcdGxpbmVXcmFwcGluZzogdHJ1ZVxuXHRcdFx0fSk7XG5cdFx0XHRteUNvZGVNaXJyb3Iuc2V0VmFsdWUoc2NvcGUubmdNb2RlbCk7XG5cblx0XHRcdG15Q29kZU1pcnJvci5vbihcImNoYW5nZVwiLCBmdW5jdGlvbiAobXlDb2RlTWlycm9yLCBjaGFuZ2VPYmope1xuXHRcdCAgICBcdHVwZGF0ZVRleHQoKTtcblx0XHQgICAgfSk7XG5cdFx0fVxuXHR9O1xufSk7IiwiYXBwLmRpcmVjdGl2ZSgnY21yZWFkJywgZnVuY3Rpb24oKXtcblx0cmV0dXJuIHtcblx0XHRyZXN0cmljdCA6ICdBJyxcblx0XHRzY29wZToge1xuXHRcdFx0bmdNb2RlbCA6ICc9J1xuXHRcdH0sXG5cdFx0bGluayA6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRyaWJ1dGUpe1xuXHRcdFx0Ly9pbml0aWFsaXplIENvZGVNaXJyb3Jcblx0XHRcdHZhciBteUNvZGVNaXJyb3IgPSBDb2RlTWlycm9yLmZyb21UZXh0QXJlYShkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29tcGlsZScpLCB7XG5cdFx0XHRcdHJlYWRPbmx5IDogJ25vY3Vyc29yJyxcblx0XHRcdFx0bW9kZTogJ2phdmFzY3JpcHQnLFxuXHRcdFx0XHRhdXRvZm9jdXMgOiB0cnVlLFxuXHRcdFx0XHR0aGVtZSA6ICd0d2lsaWdodCcsXG5cdFx0XHRcdGxpbmVXcmFwcGluZzogdHJ1ZVxuXHRcdFx0fSk7XG5cblx0XHRcdG15Q29kZU1pcnJvci5zZXRWYWx1ZShzY29wZS5uZ01vZGVsKTtcblx0XHR9XG5cdH07XG59KTsiLCJhcHAuZGlyZWN0aXZlKCdqYXNtaW5lJywgZnVuY3Rpb24oSmFzbWluZVJlcG9ydGVyKXtcblx0cmV0dXJuIHtcblx0XHRyZXN0cmljdCA6ICdFJyxcblx0XHR0cmFuc2NsdWRlOiB0cnVlLFxuXHRcdHNjb3BlIDoge1xuXHRcdFx0dGVzdDogJz0nLFxuXHRcdFx0Y29kZTogJz0nXG5cdFx0fSxcblx0XHR0ZW1wbGF0ZVVybCA6ICdmZWF0dXJlcy9jb21tb24vZGlyZWN0aXZlcy9qYXNtaW5lL2phc21pbmUuaHRtbCcsXG5cdFx0bGluayA6IGZ1bmN0aW9uIChzY29wZSwgZWxlbWVudCwgYXR0cmlidXRlKXtcblx0XHRcdHNjb3BlLiR3YXRjaCgndGVzdCcsIGZ1bmN0aW9uKCl7XG5cdFx0XHRcdHdpbmRvdy5qYXNtaW5lID0gbnVsbDtcblx0XHRcdFx0SmFzbWluZVJlcG9ydGVyLmluaXRpYWxpemVKYXNtaW5lKCk7XG5cdFx0XHRcdEphc21pbmVSZXBvcnRlci5hZGRSZXBvcnRlcihzY29wZSk7XG5cdFx0XHR9KTtcblxuXHRcdFx0c2NvcGUuJHdhdGNoKCdjb2RlJywgZnVuY3Rpb24oKXtcblx0XHRcdFx0d2luZG93Lmphc21pbmUgPSBudWxsO1xuXHRcdFx0XHRKYXNtaW5lUmVwb3J0ZXIuaW5pdGlhbGl6ZUphc21pbmUoKTtcblx0XHRcdFx0SmFzbWluZVJlcG9ydGVyLmFkZFJlcG9ydGVyKHNjb3BlKTtcblx0XHRcdH0pO1xuXG5cdFx0XHRmdW5jdGlvbiBmbGF0dGVuUmVtb3ZlRHVwZXMoYXJyLCBrZXlDaGVjayl7XG5cdFx0XHRcdHZhciB0cmFja2VyID0gW107XG5cdFx0XHRcdHJldHVybiB3aW5kb3cuXy5mbGF0dGVuKGFycikuZmlsdGVyKGZ1bmN0aW9uKGVsKXtcblx0XHRcdFx0XHRpZih0cmFja2VyLmluZGV4T2YoZWxba2V5Q2hlY2tdKSA9PSAtMSl7XG5cdFx0XHRcdFx0XHR0cmFja2VyLnB1c2goZWxba2V5Q2hlY2tdKTtcblx0XHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXG5cdFx0XHRzY29wZS4kd2F0Y2goJ3N1aXRlcycsIGZ1bmN0aW9uKCl7XG5cdFx0XHRcdGNvbnNvbGUubG9nKCd0aGVyZSBpcyBhIGNoYW5nZSBpbiB0aGUgc3VpdGVzJyk7XG5cdFx0XHRcdGlmKHNjb3BlLnN1aXRlcyl7XG5cdFx0XHRcdFx0dmFyIHN1aXRlc1NwZWNzID0gc2NvcGUuc3VpdGVzLm1hcChmdW5jdGlvbihlbCl7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZWwuc3BlY3M7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0c2NvcGUuc3BlY3NPdmVydmlldyA9IGZsYXR0ZW5SZW1vdmVEdXBlcyhzdWl0ZXNTcGVjcywgXCJpZFwiKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cblx0XHR9XG5cdH07XG59KTtcblxuYXBwLmZhY3RvcnkoJ0phc21pbmVSZXBvcnRlcicsIGZ1bmN0aW9uKCl7XG5cdGZ1bmN0aW9uIGluaXRpYWxpemVKYXNtaW5lKCl7XG5cdFx0Lypcblx0XHRDb3B5cmlnaHQgKGMpIDIwMDgtMjAxNSBQaXZvdGFsIExhYnNcblxuXHRcdFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZ1xuXHRcdGEgY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuXHRcdFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuXHRcdHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcblx0XHRkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG9cblx0XHRwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG9cblx0XHR0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG5cblx0XHRUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZVxuXHRcdGluY2x1ZGVkIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuXG5cdFx0VEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCxcblx0XHRFWFBSRVNTIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcblx0XHRNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORFxuXHRcdE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkVcblx0XHRMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OXG5cdFx0T0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OXG5cdFx0V0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cdFx0Ki9cblx0XHQvKipcblx0XHQgU3RhcnRpbmcgd2l0aCB2ZXJzaW9uIDIuMCwgdGhpcyBmaWxlIFwiYm9vdHNcIiBKYXNtaW5lLCBwZXJmb3JtaW5nIGFsbCBvZiB0aGUgbmVjZXNzYXJ5IGluaXRpYWxpemF0aW9uIGJlZm9yZSBleGVjdXRpbmcgdGhlIGxvYWRlZCBlbnZpcm9ubWVudCBhbmQgYWxsIG9mIGEgcHJvamVjdCdzIHNwZWNzLiBUaGlzIGZpbGUgc2hvdWxkIGJlIGxvYWRlZCBhZnRlciBgamFzbWluZS5qc2AgYW5kIGBqYXNtaW5lX2h0bWwuanNgLCBidXQgYmVmb3JlIGFueSBwcm9qZWN0IHNvdXJjZSBmaWxlcyBvciBzcGVjIGZpbGVzIGFyZSBsb2FkZWQuIFRodXMgdGhpcyBmaWxlIGNhbiBhbHNvIGJlIHVzZWQgdG8gY3VzdG9taXplIEphc21pbmUgZm9yIGEgcHJvamVjdC5cblxuXHRcdCBJZiBhIHByb2plY3QgaXMgdXNpbmcgSmFzbWluZSB2aWEgdGhlIHN0YW5kYWxvbmUgZGlzdHJpYnV0aW9uLCB0aGlzIGZpbGUgY2FuIGJlIGN1c3RvbWl6ZWQgZGlyZWN0bHkuIElmIGEgcHJvamVjdCBpcyB1c2luZyBKYXNtaW5lIHZpYSB0aGUgW1J1YnkgZ2VtXVtqYXNtaW5lLWdlbV0sIHRoaXMgZmlsZSBjYW4gYmUgY29waWVkIGludG8gdGhlIHN1cHBvcnQgZGlyZWN0b3J5IHZpYSBgamFzbWluZSBjb3B5X2Jvb3RfanNgLiBPdGhlciBlbnZpcm9ubWVudHMgKGUuZy4sIFB5dGhvbikgd2lsbCBoYXZlIGRpZmZlcmVudCBtZWNoYW5pc21zLlxuXG5cdFx0IFRoZSBsb2NhdGlvbiBvZiBgYm9vdC5qc2AgY2FuIGJlIHNwZWNpZmllZCBhbmQvb3Igb3ZlcnJpZGRlbiBpbiBgamFzbWluZS55bWxgLlxuXG5cdFx0IFtqYXNtaW5lLWdlbV06IGh0dHA6Ly9naXRodWIuY29tL3Bpdm90YWwvamFzbWluZS1nZW1cblx0XHQgKi9cblxuXHRcdChmdW5jdGlvbigpIHtcblx0XHQgIC8qKlxuXHRcdCAgICogIyMgUmVxdWlyZSAmYW1wOyBJbnN0YW50aWF0ZVxuXHRcdCAgICpcblx0XHQgICAqIFJlcXVpcmUgSmFzbWluZSdzIGNvcmUgZmlsZXMuIFNwZWNpZmljYWxseSwgdGhpcyByZXF1aXJlcyBhbmQgYXR0YWNoZXMgYWxsIG9mIEphc21pbmUncyBjb2RlIHRvIHRoZSBgamFzbWluZWAgcmVmZXJlbmNlLlxuXHRcdCAgICovXG5cdFx0ICB3aW5kb3cuamFzbWluZSA9IGphc21pbmVSZXF1aXJlLmNvcmUoamFzbWluZVJlcXVpcmUpO1xuXG5cdFx0ICAvKipcblx0XHQgICAqIFNpbmNlIHRoaXMgaXMgYmVpbmcgcnVuIGluIGEgYnJvd3NlciBhbmQgdGhlIHJlc3VsdHMgc2hvdWxkIHBvcHVsYXRlIHRvIGFuIEhUTUwgcGFnZSwgcmVxdWlyZSB0aGUgSFRNTC1zcGVjaWZpYyBKYXNtaW5lIGNvZGUsIGluamVjdGluZyB0aGUgc2FtZSByZWZlcmVuY2UuXG5cdFx0ICAgKi9cblx0XHQgIGphc21pbmVSZXF1aXJlLmh0bWwoamFzbWluZSk7XG5cblx0XHQgIC8qKlxuXHRcdCAgICogQ3JlYXRlIHRoZSBKYXNtaW5lIGVudmlyb25tZW50LiBUaGlzIGlzIHVzZWQgdG8gcnVuIGFsbCBzcGVjcyBpbiBhIHByb2plY3QuXG5cdFx0ICAgKi9cblx0XHQgIHZhciBlbnYgPSBqYXNtaW5lLmdldEVudigpO1xuXG5cdFx0ICAvKipcblx0XHQgICAqICMjIFRoZSBHbG9iYWwgSW50ZXJmYWNlXG5cdFx0ICAgKlxuXHRcdCAgICogQnVpbGQgdXAgdGhlIGZ1bmN0aW9ucyB0aGF0IHdpbGwgYmUgZXhwb3NlZCBhcyB0aGUgSmFzbWluZSBwdWJsaWMgaW50ZXJmYWNlLiBBIHByb2plY3QgY2FuIGN1c3RvbWl6ZSwgcmVuYW1lIG9yIGFsaWFzIGFueSBvZiB0aGVzZSBmdW5jdGlvbnMgYXMgZGVzaXJlZCwgcHJvdmlkZWQgdGhlIGltcGxlbWVudGF0aW9uIHJlbWFpbnMgdW5jaGFuZ2VkLlxuXHRcdCAgICovXG5cdFx0ICB2YXIgamFzbWluZUludGVyZmFjZSA9IGphc21pbmVSZXF1aXJlLmludGVyZmFjZShqYXNtaW5lLCBlbnYpO1xuXG5cdFx0ICAvKipcblx0XHQgICAqIEFkZCBhbGwgb2YgdGhlIEphc21pbmUgZ2xvYmFsL3B1YmxpYyBpbnRlcmZhY2UgdG8gdGhlIGdsb2JhbCBzY29wZSwgc28gYSBwcm9qZWN0IGNhbiB1c2UgdGhlIHB1YmxpYyBpbnRlcmZhY2UgZGlyZWN0bHkuIEZvciBleGFtcGxlLCBjYWxsaW5nIGBkZXNjcmliZWAgaW4gc3BlY3MgaW5zdGVhZCBvZiBgamFzbWluZS5nZXRFbnYoKS5kZXNjcmliZWAuXG5cdFx0ICAgKi9cblx0XHQgIGV4dGVuZCh3aW5kb3csIGphc21pbmVJbnRlcmZhY2UpO1xuXG5cdFx0ICAvKipcblx0XHQgICAqICMjIFJ1bm5lciBQYXJhbWV0ZXJzXG5cdFx0ICAgKlxuXHRcdCAgICogTW9yZSBicm93c2VyIHNwZWNpZmljIGNvZGUgLSB3cmFwIHRoZSBxdWVyeSBzdHJpbmcgaW4gYW4gb2JqZWN0IGFuZCB0byBhbGxvdyBmb3IgZ2V0dGluZy9zZXR0aW5nIHBhcmFtZXRlcnMgZnJvbSB0aGUgcnVubmVyIHVzZXIgaW50ZXJmYWNlLlxuXHRcdCAgICovXG5cblx0XHQgIHZhciBxdWVyeVN0cmluZyA9IG5ldyBqYXNtaW5lLlF1ZXJ5U3RyaW5nKHtcblx0XHQgICAgZ2V0V2luZG93TG9jYXRpb246IGZ1bmN0aW9uKCkgeyByZXR1cm4gd2luZG93LmxvY2F0aW9uOyB9XG5cdFx0ICB9KTtcblxuXHRcdCAgdmFyIGNhdGNoaW5nRXhjZXB0aW9ucyA9IHF1ZXJ5U3RyaW5nLmdldFBhcmFtKFwiY2F0Y2hcIik7XG5cdFx0ICBlbnYuY2F0Y2hFeGNlcHRpb25zKHR5cGVvZiBjYXRjaGluZ0V4Y2VwdGlvbnMgPT09IFwidW5kZWZpbmVkXCIgPyB0cnVlIDogY2F0Y2hpbmdFeGNlcHRpb25zKTtcblxuXHRcdCAgdmFyIHRocm93aW5nRXhwZWN0YXRpb25GYWlsdXJlcyA9IHF1ZXJ5U3RyaW5nLmdldFBhcmFtKFwidGhyb3dGYWlsdXJlc1wiKTtcblx0XHQgIGVudi50aHJvd09uRXhwZWN0YXRpb25GYWlsdXJlKHRocm93aW5nRXhwZWN0YXRpb25GYWlsdXJlcyk7XG5cblx0XHQgIC8qKlxuXHRcdCAgICogVGhlIGBqc0FwaVJlcG9ydGVyYCBhbHNvIHJlY2VpdmVzIHNwZWMgcmVzdWx0cywgYW5kIGlzIHVzZWQgYnkgYW55IGVudmlyb25tZW50IHRoYXQgbmVlZHMgdG8gZXh0cmFjdCB0aGUgcmVzdWx0cyAgZnJvbSBKYXZhU2NyaXB0LlxuXHRcdCAgICovXG5cdFx0ICBlbnYuYWRkUmVwb3J0ZXIoamFzbWluZUludGVyZmFjZS5qc0FwaVJlcG9ydGVyKTtcblxuXHRcdCAgLyoqXG5cdFx0ICAgKiBGaWx0ZXIgd2hpY2ggc3BlY3Mgd2lsbCBiZSBydW4gYnkgbWF0Y2hpbmcgdGhlIHN0YXJ0IG9mIHRoZSBmdWxsIG5hbWUgYWdhaW5zdCB0aGUgYHNwZWNgIHF1ZXJ5IHBhcmFtLlxuXHRcdCAgICovXG5cdFx0ICB2YXIgc3BlY0ZpbHRlciA9IG5ldyBqYXNtaW5lLkh0bWxTcGVjRmlsdGVyKHtcblx0XHQgICAgZmlsdGVyU3RyaW5nOiBmdW5jdGlvbigpIHsgcmV0dXJuIHF1ZXJ5U3RyaW5nLmdldFBhcmFtKFwic3BlY1wiKTsgfVxuXHRcdCAgfSk7XG5cblx0XHQgIGVudi5zcGVjRmlsdGVyID0gZnVuY3Rpb24oc3BlYykge1xuXHRcdCAgICByZXR1cm4gc3BlY0ZpbHRlci5tYXRjaGVzKHNwZWMuZ2V0RnVsbE5hbWUoKSk7XG5cdFx0ICB9O1xuXG5cdFx0ICAvKipcblx0XHQgICAqIFNldHRpbmcgdXAgdGltaW5nIGZ1bmN0aW9ucyB0byBiZSBhYmxlIHRvIGJlIG92ZXJyaWRkZW4uIENlcnRhaW4gYnJvd3NlcnMgKFNhZmFyaSwgSUUgOCwgcGhhbnRvbWpzKSByZXF1aXJlIHRoaXMgaGFjay5cblx0XHQgICAqL1xuXHRcdCAgd2luZG93LnNldFRpbWVvdXQgPSB3aW5kb3cuc2V0VGltZW91dDtcblx0XHQgIHdpbmRvdy5zZXRJbnRlcnZhbCA9IHdpbmRvdy5zZXRJbnRlcnZhbDtcblx0XHQgIHdpbmRvdy5jbGVhclRpbWVvdXQgPSB3aW5kb3cuY2xlYXJUaW1lb3V0O1xuXHRcdCAgd2luZG93LmNsZWFySW50ZXJ2YWwgPSB3aW5kb3cuY2xlYXJJbnRlcnZhbDtcblxuXHRcdCAgLyoqXG5cdFx0ICAgKiAjIyBFeGVjdXRpb25cblx0XHQgICAqXG5cdFx0ICAgKiBSZXBsYWNlIHRoZSBicm93c2VyIHdpbmRvdydzIGBvbmxvYWRgLCBlbnN1cmUgaXQncyBjYWxsZWQsIGFuZCB0aGVuIHJ1biBhbGwgb2YgdGhlIGxvYWRlZCBzcGVjcy4gVGhpcyBpbmNsdWRlcyBpbml0aWFsaXppbmcgdGhlIGBIdG1sUmVwb3J0ZXJgIGluc3RhbmNlIGFuZCB0aGVuIGV4ZWN1dGluZyB0aGUgbG9hZGVkIEphc21pbmUgZW52aXJvbm1lbnQuIEFsbCBvZiB0aGlzIHdpbGwgaGFwcGVuIGFmdGVyIGFsbCBvZiB0aGUgc3BlY3MgYXJlIGxvYWRlZC5cblx0XHQgICAqL1xuXHRcdCAgdmFyIGN1cnJlbnRXaW5kb3dPbmxvYWQgPSB3aW5kb3cub25sb2FkO1xuXG5cdFx0ICAoZnVuY3Rpb24oKSB7XG5cdFx0ICAgIGlmIChjdXJyZW50V2luZG93T25sb2FkKSB7XG5cdFx0ICAgICAgY3VycmVudFdpbmRvd09ubG9hZCgpO1xuXHRcdCAgICB9XG5cdFx0ICAgIGVudi5leGVjdXRlKCk7XG5cdFx0ICB9KSgpO1xuXG5cdFx0ICAvKipcblx0XHQgICAqIEhlbHBlciBmdW5jdGlvbiBmb3IgcmVhZGFiaWxpdHkgYWJvdmUuXG5cdFx0ICAgKi9cblx0XHQgIGZ1bmN0aW9uIGV4dGVuZChkZXN0aW5hdGlvbiwgc291cmNlKSB7XG5cdFx0ICAgIGZvciAodmFyIHByb3BlcnR5IGluIHNvdXJjZSkgZGVzdGluYXRpb25bcHJvcGVydHldID0gc291cmNlW3Byb3BlcnR5XTtcblx0XHQgICAgcmV0dXJuIGRlc3RpbmF0aW9uO1xuXHRcdCAgfVxuXG5cdFx0fSkoKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGFkZFJlcG9ydGVyKHNjb3BlKXtcblx0XHR2YXIgc3VpdGVzID0gW107XG5cdFx0dmFyIGN1cnJlbnRTdWl0ZSA9IHt9O1xuXG5cdFx0ZnVuY3Rpb24gU3VpdGUob2JqKXtcblx0XHRcdHRoaXMuaWQgPSBvYmouaWQ7XG5cdFx0XHR0aGlzLmRlc2NyaXB0aW9uID0gb2JqLmRlc2NyaXB0aW9uO1xuXHRcdFx0dGhpcy5mdWxsTmFtZSA9IG9iai5mdWxsTmFtZTtcblx0XHRcdHRoaXMuZmFpbGVkRXhwZWN0YXRpb25zID0gb2JqLmZhaWxlZEV4cGVjdGF0aW9ucztcblx0XHRcdHRoaXMuc3RhdHVzID0gb2JqLmZpbmlzaGVkO1xuXHRcdFx0dGhpcy5zcGVjcyA9IFtdO1xuXHRcdH1cblxuXHRcdHZhciBteVJlcG9ydGVyID0ge1xuXG5cdFx0XHRqYXNtaW5lU3RhcnRlZDogZnVuY3Rpb24ob3B0aW9ucyl7XG5cdFx0XHRcdGNvbnNvbGUubG9nKG9wdGlvbnMpO1xuXHRcdFx0XHRzdWl0ZXMgPSBbXTtcblx0XHRcdFx0c2NvcGUudG90YWxTcGVjcyA9IG9wdGlvbnMudG90YWxTcGVjc0RlZmluZWQ7XG5cdFx0XHR9LFxuXHRcdFx0c3VpdGVTdGFydGVkOiBmdW5jdGlvbihzdWl0ZSl7XG5cdFx0XHRcdGNvbnNvbGUubG9nKCd0aGlzIGlzIHRoZSBzdWl0ZSBzdGFydGVkJyk7XG5cdFx0XHRcdGNvbnNvbGUubG9nKHN1aXRlKTtcblx0XHRcdFx0c2NvcGUuc3VpdGVTdGFydGVkID0gc3VpdGU7XG5cdFx0XHRcdGN1cnJlbnRTdWl0ZSA9IG5ldyBTdWl0ZShzdWl0ZSk7XG5cdFx0XHR9LFxuXHRcdFx0c3BlY1N0YXJ0ZWQ6IGZ1bmN0aW9uKHNwZWMpe1xuXHRcdFx0XHRjb25zb2xlLmxvZygndGhpcyBpcyB0aGUgc3BlYyBzdGFydGVkJyk7XG5cdFx0XHRcdGNvbnNvbGUubG9nKHNwZWMpO1xuXHRcdFx0XHRzY29wZS5zcGVjU3RhcnRlZCA9IHNwZWM7XG5cdFx0XHR9LFxuXHRcdFx0c3BlY0RvbmU6IGZ1bmN0aW9uKHNwZWMpe1xuXHRcdFx0XHRjb25zb2xlLmxvZygndGhpcyBpcyB0aGUgc3BlYyBkb25lJyk7XG5cdFx0XHRcdGNvbnNvbGUubG9nKHNwZWMpO1xuXHRcdFx0XHRzY29wZS5zcGVjRG9uZSA9IHNwZWM7XG5cdFx0XHRcdGN1cnJlbnRTdWl0ZS5zcGVjcy5wdXNoKHNwZWMpO1xuXHRcdFx0fSxcblx0XHRcdHN1aXRlRG9uZTogZnVuY3Rpb24oc3VpdGUpe1xuXHRcdFx0XHRjb25zb2xlLmxvZygndGhpcyBpcyB0aGUgc3VpdGUgZG9uZScpO1xuXHRcdFx0XHRjb25zb2xlLmxvZyhzdWl0ZSk7XG5cdFx0XHRcdHNjb3BlLnN1aXRlRG9uZSA9IHN1aXRlO1xuXHRcdFx0XHRzdWl0ZXMucHVzaChjdXJyZW50U3VpdGUpO1xuXHRcdFx0fSxcblx0XHRcdGphc21pbmVEb25lOiBmdW5jdGlvbigpe1xuXHRcdFx0XHRjb25zb2xlLmxvZygnRmluaXNoZWQgc3VpdGUnKTtcblx0XHRcdFx0c2NvcGUuc3VpdGVzID0gc3VpdGVzO1xuXHRcdFx0fVxuXHRcdH07XG5cblx0XHR3aW5kb3cuamFzbWluZS5nZXRFbnYoKS5hZGRSZXBvcnRlcihteVJlcG9ydGVyKTtcblx0fVxuXG5cdHJldHVybiB7XG5cdFx0aW5pdGlhbGl6ZUphc21pbmUgOiBpbml0aWFsaXplSmFzbWluZSxcblx0XHRhZGRSZXBvcnRlcjogYWRkUmVwb3J0ZXJcblx0fTtcbn0pOyIsImFwcC5kaXJlY3RpdmUoJ2pzbG9hZCcsIGZ1bmN0aW9uKCl7XG5cdGZ1bmN0aW9uIHVwZGF0ZVNjcmlwdChlbGVtZW50LCB0ZXh0KXtcblx0XHRlbGVtZW50LmVtcHR5KCk7XG5cdFx0dmFyIHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xuXHRcdHNjcmlwdC50eXBlID0gJ3RleHQvamF2YXNjcmlwdCc7XG5cdFx0c2NyaXB0LmlubmVySFRNTCA9IHRleHQ7XG5cdFx0Y29uc29sZS5sb2coc2NyaXB0KTtcblx0XHRlbGVtZW50LmFwcGVuZChzY3JpcHQpO1xuXHR9XG5cdHJldHVybiB7XG5cdFx0cmVzdHJpY3QgOiAnRScsXG5cdFx0c2NvcGUgOiB7XG5cdFx0XHR0ZXh0IDogJz0nXG5cdFx0fSxcblx0XHR0ZW1wbGF0ZVVybDogJ2ZlYXR1cmVzL2NvbW1vbi9kaXJlY3RpdmVzL2pzLWxvYWQvanMtbG9hZC5odG1sJyxcblx0XHRsaW5rIDogZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHJpYnV0ZXMpe1xuXHRcdFx0c2NvcGUuJHdhdGNoKCd0ZXh0JywgZnVuY3Rpb24odGV4dCl7XG5cdFx0XHRcdHVwZGF0ZVNjcmlwdChlbGVtZW50LCB0ZXh0KTtcblx0XHRcdFx0Ly8gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoc2NvcGUubmFtZSkuaW5uZXJIVE1MID0gdGV4dDtcblx0XHRcdH0pO1xuXHRcdH1cblx0fTtcbn0pO1xuXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=