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
  url : 'https://protected-reaches-5946.herokuapp.com/api'
})

.config(function($stateProvider, $urlRouterProvider) {
  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  // if none of the above states are matched, use this as the fallback
  // $urlRouterProvider.otherwise('/challenge/view'); //TODO: Albert testing this route

  $urlRouterProvider.otherwise('/welcome'); // TODO: Richard testing this route
  //$urlRouterProvider.otherwise('challenge.view'); //TODO: Tony testing this route
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
        //console.log('AuthService',AuthService.isAuthenticated())
        //console.log('toggleMenuShow',AuthService.isAuthenticated());
        //TODO: return AuthService.isAuthenticated();
        return true;
    };

    $rootScope.$on('Auth',function(){
       //console.log('auth');
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
	});
});


app.controller('ChallengeCodeCtrl', function($scope, $state, $rootScope, ChallengeFactory, ChallengeFooterFactory, $ionicPopup, $localstorage){


	$scope.footerMenu = ChallengeFooterFactory.getFooterMenu();


	//Challenge Submit
	$scope.text = "placeholder";

	//initialize CodeMirror
	// var myCodeMirror = CodeMirror.fromTextArea(document.getElementById('code'), {
	// 	lineNumbers : true,
	// 	mode: 'javascript',
	// 	autofocus : true,
	// 	theme : 'twilight',
	// 	lineWrapping: true
	// });

	// myCodeMirror.replaceSelection($scope.text);

	// $scope.updateText = function(){
	// 	$scope.text = myCodeMirror.getValue();
	// 	//check if digest is in progress
	// 	if(!$scope.$$phase) {
	// 	  $scope.$apply();
	// 	}
	// };

	// $scope.insertFunc = function(param){
	// 	//given a param, will insert characters where cursor is
	// 	console.log("inserting: ", param);
	// 	myCodeMirror.replaceSelection(param);
	// 	// window.cordova.plugins.Keyboard.show();
	// 	myCodeMirror.focus();
	// };

 //    myCodeMirror.on("change", function (myCodeMirror, changeObj){
 //    	$scope.updateText();
 //    });

 //    window.addEventListener("native.keyboardshow", function (){
 //    	$scope.keyboardVis = true;
 //    	$scope.$apply();
 //    });
 //    window.addEventListener("native.keyboardhide", function (){
 //    	$scope.keyboardVis = false;
 //    	$scope.$apply();
 //    });

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
		console.log("save scope.text", $scope.text);
		$localstorage.set("testing", $scope.text);
	};

	$scope.getSaved = function(){
		console.log("save scope.text", $scope.text);
		console.log("entered getsaved func");
		$scope.text = $localstorage.get("testing");
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

	$scope.toggleMenuShow();

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
                        $rootScope.$broadcast('Auth');
                    }
                });
                $state.go('exercism.view');
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
						$rootScope.$broadcast('Auth');
					}
				});
				$state.go('exercism.view');
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
		$state.go('exercism.view');
	} else {
		//TODO: $state.go('signup'); Remove Below line
		$state.go('exercism.view');
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


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImFjY291bnQvYWNjb3VudC5qcyIsImNoYWxsZW5nZS9jaGFsbGVuZ2UuanMiLCJjaGFsbGVuZ2UtY29kZS9jaGFsbGVuZ2UtY29kZS5qcyIsImNoYWxsZW5nZS1jb2RlL2NoYWxsZW5nZS1mb290ZXIuanMiLCJjaGFsbGVuZ2UtY29tcGlsZS9jaGFsbGVuZ2UtY29tcGlsZS5qcyIsImNoYWxsZW5nZS12aWV3L2NoYWxsZW5nZS12aWV3LmpzIiwiY2hhdHMvY2hhdHMuanMiLCJleGVyY2lzbS9leGVyY2lzbS5qcyIsImV4ZXJjaXNtLWNvZGUvZXhlcmNpc20tY29kZS5qcyIsImV4ZXJjaXNtLWNvbXBpbGUvZXhlcmNpc20tY29tcGlsZS5qcyIsImV4ZXJjaXNtLXRlc3QvZXhlcmNpc20tdGVzdC5qcyIsImV4ZXJjaXNtLXZpZXcvZXhlcmNpc20tdmlldy5qcyIsInNpZ251cC9zaWdudXAuanMiLCJsb2dpbi9sb2dpbi5qcyIsIndlbGNvbWUvd2VsY29tZS5qcyIsImNvbW1vbi9BdXRoZW50aWNhdGlvbi9hdXRoZW50aWNhdGlvbi5qcyIsImNvbW1vbi9tb2R1bGVzL2lvbmljLnV0aWxzLmpzIiwiY29tbW9uL2ZpbHRlcnMvYXBwZW5kLmpzIiwiY29tbW9uL2ZpbHRlcnMvZXhlcmNpc20tZm9ybWF0LW5hbWUuanMiLCJjb21tb24vZmlsdGVycy9tYXJrZWQuanMiLCJjb21tb24vZGlyZWN0aXZlcy9jb2RlbWlycm9yLWVkaXQvY29kZW1pcnJvci1lZGl0LmpzIiwiY29tbW9uL2RpcmVjdGl2ZXMvY29kZWtleWJvYXJkYmFyL2NvZGVrZXlib2FyZGJhci5qcyIsImNvbW1vbi9kaXJlY3RpdmVzL2NvZGVtaXJyb3ItcmVhZC9jb2RlbWlycm9yLXJlYWQuanMiLCJjb21tb24vZGlyZWN0aXZlcy9qYXNtaW5lL2phc21pbmUuanMiLCJjb21tb24vZGlyZWN0aXZlcy9qcy1sb2FkL2pzLWxvYWQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDekhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQy9DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeE9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIElvbmljIFN0YXJ0ZXIgQXBwXG5cbi8vIGFuZ3VsYXIubW9kdWxlIGlzIGEgZ2xvYmFsIHBsYWNlIGZvciBjcmVhdGluZywgcmVnaXN0ZXJpbmcgYW5kIHJldHJpZXZpbmcgQW5ndWxhciBtb2R1bGVzXG4vLyAnc3RhcnRlcicgaXMgdGhlIG5hbWUgb2YgdGhpcyBhbmd1bGFyIG1vZHVsZSBleGFtcGxlIChhbHNvIHNldCBpbiBhIDxib2R5PiBhdHRyaWJ1dGUgaW4gaW5kZXguaHRtbClcbi8vIHRoZSAybmQgcGFyYW1ldGVyIGlzIGFuIGFycmF5IG9mICdyZXF1aXJlcydcbi8vICdzdGFydGVyLnNlcnZpY2VzJyBpcyBmb3VuZCBpbiBzZXJ2aWNlcy5qc1xuLy8gJ3N0YXJ0ZXIuY29udHJvbGxlcnMnIGlzIGZvdW5kIGluIGNvbnRyb2xsZXJzLmpzXG52YXIgYXBwID0gYW5ndWxhci5tb2R1bGUoJ21pZGUnLCBbJ2lvbmljJywgJ2lvbmljLnV0aWxzJ10pXG5cbi5ydW4oZnVuY3Rpb24oJGlvbmljUGxhdGZvcm0pIHtcbiAgJGlvbmljUGxhdGZvcm0ucmVhZHkoZnVuY3Rpb24oKSB7XG4gICAgLy8gSGlkZSB0aGUgYWNjZXNzb3J5IGJhciBieSBkZWZhdWx0IChyZW1vdmUgdGhpcyB0byBzaG93IHRoZSBhY2Nlc3NvcnkgYmFyIGFib3ZlIHRoZSBrZXlib2FyZFxuICAgIC8vIGZvciBmb3JtIGlucHV0cylcbiAgICAvLyAkbG9jYXRpb25Qcm92aWRlci5odG1sNU1vZGUodHJ1ZSk7XG4gICAgaWYgKHdpbmRvdy5jb3Jkb3ZhICYmIHdpbmRvdy5jb3Jkb3ZhLnBsdWdpbnMgJiYgd2luZG93LmNvcmRvdmEucGx1Z2lucy5LZXlib2FyZCkge1xuICAgICAgICBjb25zb2xlLmxvZyhcImRvZXMgcmVnIHdpbmRvdyB3b3JrP1wiKTtcbiAgICAgIGNvcmRvdmEucGx1Z2lucy5LZXlib2FyZC5oaWRlS2V5Ym9hcmRBY2Nlc3NvcnlCYXIodHJ1ZSk7XG4gICAgICBjb3Jkb3ZhLnBsdWdpbnMuS2V5Ym9hcmQuZGlzYWJsZVNjcm9sbCh0cnVlKTtcbiAgICB9XG4gICAgaWYgKHdpbmRvdy5TdGF0dXNCYXIpIHtcbiAgICAgIC8vIG9yZy5hcGFjaGUuY29yZG92YS5zdGF0dXNiYXIgcmVxdWlyZWRcbiAgICAgIFN0YXR1c0Jhci5zdHlsZUxpZ2h0Q29udGVudCgpO1xuICAgIH1cbiAgfSk7XG59KVxuXG4vL1RPRE86VGhpcyBpcyBuZWVkZWQgdG8gc2V0IHRvIGFjY2VzcyB0aGUgcHJveHkgdXJsIHRoYXQgd2lsbCB0aGVuIGluIHRoZSBpb25pYy5wcm9qZWN0IGZpbGUgcmVkaXJlY3QgaXQgdG8gdGhlIGNvcnJlY3QgVVJMXG4uY29uc3RhbnQoJ0FwaUVuZHBvaW50Jywge1xuICB1cmwgOiAnaHR0cHM6Ly9wcm90ZWN0ZWQtcmVhY2hlcy01OTQ2Lmhlcm9rdWFwcC5jb20vYXBpJ1xufSlcblxuLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyKSB7XG4gIC8vIElvbmljIHVzZXMgQW5ndWxhclVJIFJvdXRlciB3aGljaCB1c2VzIHRoZSBjb25jZXB0IG9mIHN0YXRlc1xuICAvLyBMZWFybiBtb3JlIGhlcmU6IGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyLXVpL3VpLXJvdXRlclxuICAvLyBTZXQgdXAgdGhlIHZhcmlvdXMgc3RhdGVzIHdoaWNoIHRoZSBhcHAgY2FuIGJlIGluLlxuICAvLyBFYWNoIHN0YXRlJ3MgY29udHJvbGxlciBjYW4gYmUgZm91bmQgaW4gY29udHJvbGxlcnMuanNcbiAgLy8gaWYgbm9uZSBvZiB0aGUgYWJvdmUgc3RhdGVzIGFyZSBtYXRjaGVkLCB1c2UgdGhpcyBhcyB0aGUgZmFsbGJhY2tcbiAgLy8gJHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZSgnL2NoYWxsZW5nZS92aWV3Jyk7IC8vVE9ETzogQWxiZXJ0IHRlc3RpbmcgdGhpcyByb3V0ZVxuXG4gICR1cmxSb3V0ZXJQcm92aWRlci5vdGhlcndpc2UoJy93ZWxjb21lJyk7IC8vIFRPRE86IFJpY2hhcmQgdGVzdGluZyB0aGlzIHJvdXRlXG4gIC8vJHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZSgnY2hhbGxlbmdlLnZpZXcnKTsgLy9UT0RPOiBUb255IHRlc3RpbmcgdGhpcyByb3V0ZVxuICAvLyAkdXJsUm91dGVyUHJvdmlkZXIub3RoZXJ3aXNlKCd3ZWxjb21lJyk7XG5cbn0pXG4vL1xuXG4vLy8vcnVuIGJsb2NrczogaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8yMDY2MzA3Ni9hbmd1bGFyanMtYXBwLXJ1bi1kb2N1bWVudGF0aW9uXG4vL1VzZSBydW4gbWV0aG9kIHRvIHJlZ2lzdGVyIHdvcmsgd2hpY2ggc2hvdWxkIGJlIHBlcmZvcm1lZCB3aGVuIHRoZSBpbmplY3RvciBpcyBkb25lIGxvYWRpbmcgYWxsIG1vZHVsZXMuXG4vL2h0dHA6Ly9kZXZkYWN0aWMuY29tL3VzZXItYXV0aC1hbmd1bGFyanMtaW9uaWMvXG5cbi5ydW4oZnVuY3Rpb24gKCRyb290U2NvcGUsICRzdGF0ZSwgQXV0aFNlcnZpY2UsIEFVVEhfRVZFTlRTKSB7XG5cbiAgICB2YXIgZGVzdGluYXRpb25TdGF0ZVJlcXVpcmVzQXV0aCA9IGZ1bmN0aW9uIChzdGF0ZSkge1xuICAgICAgICAvL2NvbnNvbGUubG9nKCdjbCAtIGRlc3RpbmF0aW9uU3RhdGVSZXF1aXJlc0F1dGgnLCdzdGF0ZS5kYXRhJyxzdGF0ZS5kYXRhLCdzdGF0ZS5kYXRhLmF1dGgnLHN0YXRlLmRhdGEuYXV0aGVudGljYXRlKTtcbiAgICAgICAgcmV0dXJuIHN0YXRlLmRhdGEgJiYgc3RhdGUuZGF0YS5hdXRoZW50aWNhdGU7XG4gICAgfTtcbiAgIFxuICAgIC8vVE9ETzogTmVlZCB0byBtYWtlIGF1dGhlbnRpY2F0aW9uIG1vcmUgcm9idXN0IGJlbG93IGRvZXMgbm90IGZvbGxvdyBGU0cgKGV0LiBhbC4pXG4gICAgLy9UT0RPOiBDdXJyZW50bHkgaXQgaXMgbm90IGNoZWNraW5nIHRoZSBiYWNrZW5kIHJvdXRlIHJvdXRlci5nZXQoJy90b2tlbicpXG4gICAgJHJvb3RTY29wZS4kb24oJyRzdGF0ZUNoYW5nZVN0YXJ0JywgZnVuY3Rpb24gKGV2ZW50LHRvU3RhdGUsIHRvUGFyYW1zKSB7XG5cbiAgICAgICAgLy9jb25zb2xlLmxvZygndXNlciBBdXRoZW50aWNhdGVkJywgQXV0aFNlcnZpY2UuaXNBdXRoZW50aWNhdGVkKCkpO1xuXG4gICAgICAgIGlmICghZGVzdGluYXRpb25TdGF0ZVJlcXVpcmVzQXV0aCh0b1N0YXRlKSkge1xuICAgICAgICAgICAgLy8gVGhlIGRlc3RpbmF0aW9uIHN0YXRlIGRvZXMgbm90IHJlcXVpcmUgYXV0aGVudGljYXRpb25cbiAgICAgICAgICAgIC8vIFNob3J0IGNpcmN1aXQgd2l0aCByZXR1cm4uXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoQXV0aFNlcnZpY2UuaXNBdXRoZW50aWNhdGVkKCkpIHtcbiAgICAgICAgICAgIC8vIFRoZSB1c2VyIGlzIGF1dGhlbnRpY2F0ZWQuXG4gICAgICAgICAgICAvLyBTaG9ydCBjaXJjdWl0IHdpdGggcmV0dXJuLlxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy9UT0RPOiBOb3Qgc3VyZSBob3cgdG8gcHJvY2VlZCBoZXJlXG4gICAgICAgICRzdGF0ZS5nbygnbG9naW4nKTsgLy9pZiBhYm92ZSBmYWlscywgZ290byBsb2dpblxuICAgIH0pO1xuICAvLyAkdXJsUm91dGVyUHJvdmlkZXIub3RoZXJ3aXNlKCcvc2lnbnVwJyk7IC8vIFRPRE86IFJpY2hhcmQgdGVzdGluZyB0aGlzIHJvdXRlXG4gIC8vJHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZSgnL2NoYWxsZW5nZS92aWV3Jyk7IC8vVE9ETzogVG9ueSB0ZXN0aW5nIHRoaXMgcm91dGVcblxufSk7XG5cbmFwcC5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIpe1xuICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ21haW4nLCB7XG4gICAgICAgdGVtcGxhdGVVcmw6ICdmZWF0dXJlcy9jb21tb24vbWFpbi9tYWluLmh0bWwnLFxuICAgICAgIGNvbnRyb2xsZXI6ICdNZW51Q3RybCdcbiAgIH0pO1xufSk7XG5cbmFwcC5jb250cm9sbGVyKCdNYWluQ3RybCcsIGZ1bmN0aW9uKCRyb290U2NvcGUsJHNjb3BlLCAkaW9uaWNTaWRlTWVudURlbGVnYXRlLCAkaW9uaWNQb3B1cCwgJHN0YXRlLCBBdXRoU2VydmljZSxBVVRIX0VWRU5UUyl7XG4gICAgJHNjb3BlLnVzZXJuYW1lID0gQXV0aFNlcnZpY2UudXNlcm5hbWUoKTtcbiAgICAvL2NvbnNvbGUubG9nKEF1dGhTZXJ2aWNlLmlzQXV0aGVudGljYXRlZCgpKTtcblxuICAgICRzY29wZS4kb24oQVVUSF9FVkVOVFMubm90QXV0aG9yaXplZCwgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgdmFyIGFsZXJ0UG9wdXAgPSAkaW9uaWNQb3B1cC5hbGVydCh7XG4gICAgICAgICAgICB0aXRsZTogJ1VuYXV0aG9yaXplZCEnLFxuICAgICAgICAgICAgdGVtcGxhdGU6ICdZb3UgYXJlIG5vdCBhbGxvd2VkIHRvIGFjY2VzcyB0aGlzIHJlc291cmNlLidcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICAkc2NvcGUuJG9uKEFVVEhfRVZFTlRTLm5vdEF1dGhlbnRpY2F0ZWQsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgIEF1dGhTZXJ2aWNlLmxvZ291dCgpO1xuICAgICAgICAvLyRzdGF0ZS5nbygnbG9naW4nKTtcbiAgICAgICAgdmFyIGFsZXJ0UG9wdXAgPSAkaW9uaWNQb3B1cC5hbGVydCh7XG4gICAgICAgICAgICB0aXRsZTogJ1BsZWFzZSBSZXZpZXcnLFxuICAgICAgICAgICAgdGVtcGxhdGU6ICcnXG4gICAgICAgIH0pO1xuICAgIH0pO1xufSk7XG5cbmFwcC5jb250cm9sbGVyKCdNZW51Q3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgJGlvbmljU2lkZU1lbnVEZWxlZ2F0ZSwgJHN0YXRlLCBBdXRoU2VydmljZSwgJHJvb3RTY29wZSl7XG5cbiAgICAkc2NvcGUuc3RhdGVzID0gW1xuICAgICAgICB7XG4gICAgICAgICAgbmFtZSA6ICdBY2NvdW50JyxcbiAgICAgICAgICByZWYgOiBmdW5jdGlvbigpe3JldHVybiAnYWNjb3VudCc7fVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgbmFtZSA6ICdDaGFsbGVuZ2UnLFxuICAgICAgICAgIHJlZiA6IGZ1bmN0aW9uKCl7cmV0dXJuICdjaGFsbGVuZ2Uudmlldyc7fVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgbmFtZSA6ICdDaGF0cycsXG4gICAgICAgICAgcmVmOiBmdW5jdGlvbigpe3JldHVybiAnY2hhdHMnO31cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIG5hbWUgOiAnRXhlcmNpc20nLFxuICAgICAgICAgIHJlZjogZnVuY3Rpb24oKXtyZXR1cm4gJ2V4ZXJjaXNtLnZpZXcnO31cbiAgICAgICAgfVxuICAgIF07XG5cbiAgICAkc2NvcGUudG9nZ2xlTWVudVNob3cgPSBmdW5jdGlvbigpe1xuICAgICAgICAvL2NvbnNvbGUubG9nKCdBdXRoU2VydmljZScsQXV0aFNlcnZpY2UuaXNBdXRoZW50aWNhdGVkKCkpXG4gICAgICAgIC8vY29uc29sZS5sb2coJ3RvZ2dsZU1lbnVTaG93JyxBdXRoU2VydmljZS5pc0F1dGhlbnRpY2F0ZWQoKSk7XG4gICAgICAgIC8vVE9ETzogcmV0dXJuIEF1dGhTZXJ2aWNlLmlzQXV0aGVudGljYXRlZCgpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9O1xuXG4gICAgJHJvb3RTY29wZS4kb24oJ0F1dGgnLGZ1bmN0aW9uKCl7XG4gICAgICAgLy9jb25zb2xlLmxvZygnYXV0aCcpO1xuICAgICAgICRzY29wZS50b2dnbGVNZW51U2hvdygpO1xuICAgIH0pO1xuXG4gICAgLy9jb25zb2xlLmxvZyhBdXRoU2VydmljZS5pc0F1dGhlbnRpY2F0ZWQoKSk7XG4gICAgLy9pZihBdXRoU2VydmljZS5pc0F1dGhlbnRpY2F0ZWQoKSl7XG4gICAgJHNjb3BlLmNsaWNrSXRlbSA9IGZ1bmN0aW9uKHN0YXRlUmVmKXtcbiAgICAgICAgJGlvbmljU2lkZU1lbnVEZWxlZ2F0ZS50b2dnbGVMZWZ0KCk7XG4gICAgICAgICRzdGF0ZS5nbyhzdGF0ZVJlZigpKTsgLy9SQjogVXBkYXRlZCB0byBoYXZlIHN0YXRlUmVmIGFzIGEgZnVuY3Rpb24gaW5zdGVhZC5cbiAgICB9O1xuXG4gICAgJHNjb3BlLnRvZ2dsZU1lbnUgPSBmdW5jdGlvbigpe1xuICAgICAgICAkaW9uaWNTaWRlTWVudURlbGVnYXRlLnRvZ2dsZUxlZnQoKTtcbiAgICB9O1xuICAgIC8vfVxufSk7IiwiYXBwLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlciwgVVNFUl9ST0xFUyl7XG5cdC8vIEVhY2ggdGFiIGhhcyBpdHMgb3duIG5hdiBoaXN0b3J5IHN0YWNrOlxuXHQkc3RhdGVQcm92aWRlci5zdGF0ZSgnYWNjb3VudCcsIHtcblx0XHR1cmw6ICcvYWNjb3VudCcsXG5cdCAgICB0ZW1wbGF0ZVVybDogJ2ZlYXR1cmVzL2FjY291bnQvYWNjb3VudC5odG1sJyxcblx0XHRjb250cm9sbGVyOiAnQWNjb3VudEN0cmwnXG5cdFx0Ly8gLFxuXHRcdC8vIGRhdGE6IHtcblx0XHQvLyBcdGF1dGhlbnRpY2F0ZTogW1VTRVJfUk9MRVMucHVibGljXVxuXHRcdC8vIH1cblx0fSk7XG59KTtcblxuYXBwLmNvbnRyb2xsZXIoJ0FjY291bnRDdHJsJywgZnVuY3Rpb24oJHNjb3BlKSB7XG5cdCRzY29wZS5zZXR0aW5ncyA9IHtcblx0XHRlbmFibGVGcmllbmRzOiB0cnVlXG5cdH07XG59KTsiLCJhcHAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKXtcblx0JHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2NoYWxsZW5nZScsIHtcblx0XHR0ZW1wbGF0ZVVybCA6ICdmZWF0dXJlcy9jaGFsbGVuZ2UvY2hhbGxlbmdlLmh0bWwnLFxuXHRcdGFic3RyYWN0IDogdHJ1ZVxuXHR9KTtcbn0pO1xuXG5hcHAuZmFjdG9yeSgnQ2hhbGxlbmdlRmFjdG9yeScsIGZ1bmN0aW9uKCRodHRwLCBBcGlFbmRwb2ludCwgJHJvb3RTY29wZSwgJHN0YXRlKXtcblxuXHR2YXIgcHJvYmxlbSA9ICcnO1xuXHR2YXIgc3VibWlzc2lvbiA9ICcnO1xuXG5cdHZhciBydW5IaWRkZW4gPSBmdW5jdGlvbihjb2RlKSB7XG5cdCAgICB2YXIgaW5kZXhlZERCID0gbnVsbDtcblx0ICAgIHZhciBsb2NhdGlvbiA9IG51bGw7XG5cdCAgICB2YXIgbmF2aWdhdG9yID0gbnVsbDtcblx0ICAgIHZhciBvbmVycm9yID0gbnVsbDtcblx0ICAgIHZhciBvbm1lc3NhZ2UgPSBudWxsO1xuXHQgICAgdmFyIHBlcmZvcm1hbmNlID0gbnVsbDtcblx0ICAgIHZhciBzZWxmID0gbnVsbDtcblx0ICAgIHZhciB3ZWJraXRJbmRleGVkREIgPSBudWxsO1xuXHQgICAgdmFyIHBvc3RNZXNzYWdlID0gbnVsbDtcblx0ICAgIHZhciBjbG9zZSA9IG51bGw7XG5cdCAgICB2YXIgb3BlbkRhdGFiYXNlID0gbnVsbDtcblx0ICAgIHZhciBvcGVuRGF0YWJhc2VTeW5jID0gbnVsbDtcblx0ICAgIHZhciB3ZWJraXRSZXF1ZXN0RmlsZVN5c3RlbSA9IG51bGw7XG5cdCAgICB2YXIgd2Via2l0UmVxdWVzdEZpbGVTeXN0ZW1TeW5jID0gbnVsbDtcblx0ICAgIHZhciB3ZWJraXRSZXNvbHZlTG9jYWxGaWxlU3lzdGVtU3luY1VSTCA9IG51bGw7XG5cdCAgICB2YXIgd2Via2l0UmVzb2x2ZUxvY2FsRmlsZVN5c3RlbVVSTCA9IG51bGw7XG5cdCAgICB2YXIgYWRkRXZlbnRMaXN0ZW5lciA9IG51bGw7XG5cdCAgICB2YXIgZGlzcGF0Y2hFdmVudCA9IG51bGw7XG5cdCAgICB2YXIgcmVtb3ZlRXZlbnRMaXN0ZW5lciA9IG51bGw7XG5cdCAgICB2YXIgZHVtcCA9IG51bGw7XG5cdCAgICB2YXIgb25vZmZsaW5lID0gbnVsbDtcblx0ICAgIHZhciBvbm9ubGluZSA9IG51bGw7XG5cdCAgICB2YXIgaW1wb3J0U2NyaXB0cyA9IG51bGw7XG5cdCAgICB2YXIgY29uc29sZSA9IG51bGw7XG5cdCAgICB2YXIgYXBwbGljYXRpb24gPSBudWxsO1xuXG5cdCAgICByZXR1cm4gZXZhbChjb2RlKTtcblx0fTtcblxuXHQvLyBjb252ZXJ0cyB0aGUgb3V0cHV0IGludG8gYSBzdHJpbmdcblx0dmFyIHN0cmluZ2lmeSA9IGZ1bmN0aW9uKG91dHB1dCkge1xuXHQgICAgdmFyIHJlc3VsdDtcblxuXHQgICAgaWYgKHR5cGVvZiBvdXRwdXQgPT0gJ3VuZGVmaW5lZCcpIHtcblx0ICAgICAgICByZXN1bHQgPSAndW5kZWZpbmVkJztcblx0ICAgIH0gZWxzZSBpZiAob3V0cHV0ID09PSBudWxsKSB7XG5cdCAgICAgICAgcmVzdWx0ID0gJ251bGwnO1xuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgICByZXN1bHQgPSBKU09OLnN0cmluZ2lmeShvdXRwdXQpIHx8IG91dHB1dC50b1N0cmluZygpO1xuXHQgICAgfVxuXG5cdCAgICByZXR1cm4gcmVzdWx0O1xuXHR9O1xuXG5cdHZhciBydW4gPSBmdW5jdGlvbihjb2RlKSB7XG5cdCAgICB2YXIgcmVzdWx0ID0ge1xuXHQgICAgICAgIGlucHV0OiBjb2RlLFxuXHQgICAgICAgIG91dHB1dDogbnVsbCxcblx0ICAgICAgICBlcnJvcjogbnVsbFxuXHQgICAgfTtcblxuXHQgICAgdHJ5IHtcblx0ICAgICAgICByZXN1bHQub3V0cHV0ID0gc3RyaW5naWZ5KHJ1bkhpZGRlbihjb2RlKSk7XG5cdCAgICB9IGNhdGNoKGUpIHtcblx0ICAgICAgICByZXN1bHQuZXJyb3IgPSBlLm1lc3NhZ2U7XG5cdCAgICB9XG5cdCAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG5cblxuXHRyZXR1cm4ge1xuXHRcdGdldENoYWxsZW5nZSA6IGZ1bmN0aW9uKGlkKXtcblx0XHRcdHJldHVybiAkaHR0cC5nZXQoQXBpRW5kcG9pbnQudXJsICsgJy9jaGFsbGVuZ2UvJyArIGlkKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcblx0XHRcdFx0cHJvYmxlbSA9IHJlc3BvbnNlLmRhdGE7XG5cdFx0XHRcdHN1Ym1pc3Npb24gPSBwcm9ibGVtLnNlc3Npb24uc2V0dXAgfHwgJyc7XG5cdFx0XHRcdCRyb290U2NvcGUuJGJyb2FkY2FzdCgncHJvYmxlbVVwZGF0ZWQnKTtcblx0XHRcdFx0cmV0dXJuIHJlc3BvbnNlLmRhdGE7XG5cdFx0XHR9KTtcblx0XHR9LFxuXHRcdHNldFN1Ym1pc3Npb24gOiBmdW5jdGlvbihjb2RlKXtcblx0XHRcdHN1Ym1pc3Npb24gPSBjb2RlO1xuXHRcdFx0JHJvb3RTY29wZS4kYnJvYWRjYXN0KCdzdWJtaXNzaW9uVXBkYXRlZCcpO1xuXHRcdH0sXG5cdFx0Y29tcGlsZVN1Ym1pc3Npb246IGZ1bmN0aW9uKGNvZGUpe1xuXHRcdFx0cmV0dXJuIHJ1bihjb2RlKTtcblx0XHR9LFxuXHRcdGdldFN1Ym1pc3Npb24gOiBmdW5jdGlvbigpe1xuXHRcdFx0cmV0dXJuIHN1Ym1pc3Npb247XG5cdFx0fSxcblx0XHRnZXRQcm9ibGVtIDogZnVuY3Rpb24oKXtcblx0XHRcdHJldHVybiBwcm9ibGVtO1xuXHRcdH1cblx0fTtcbn0pOyIsImFwcC5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIpe1xuXHQkc3RhdGVQcm92aWRlci5zdGF0ZSgnY2hhbGxlbmdlLmNvZGUnLCB7XG5cdFx0dXJsIDogJy9jaGFsbGVuZ2UvY29kZScsXG5cdFx0dmlld3M6IHtcblx0XHRcdCd0YWItY29kZScgOiB7XG5cdFx0XHRcdHRlbXBsYXRlVXJsIDogJ2ZlYXR1cmVzL2NoYWxsZW5nZS1jb2RlL2NoYWxsZW5nZS1jb2RlLmh0bWwnLFxuXHRcdFx0XHRjb250cm9sbGVyIDogJ0NoYWxsZW5nZUNvZGVDdHJsJ1xuXHRcdFx0fVxuXHRcdH1cblx0fSk7XG59KTtcblxuXG5hcHAuY29udHJvbGxlcignQ2hhbGxlbmdlQ29kZUN0cmwnLCBmdW5jdGlvbigkc2NvcGUsICRzdGF0ZSwgJHJvb3RTY29wZSwgQ2hhbGxlbmdlRmFjdG9yeSwgQ2hhbGxlbmdlRm9vdGVyRmFjdG9yeSwgJGlvbmljUG9wdXAsICRsb2NhbHN0b3JhZ2Upe1xuXG5cblx0JHNjb3BlLmZvb3Rlck1lbnUgPSBDaGFsbGVuZ2VGb290ZXJGYWN0b3J5LmdldEZvb3Rlck1lbnUoKTtcblxuXG5cdC8vQ2hhbGxlbmdlIFN1Ym1pdFxuXHQkc2NvcGUudGV4dCA9IFwicGxhY2Vob2xkZXJcIjtcblxuXHQvL2luaXRpYWxpemUgQ29kZU1pcnJvclxuXHQvLyB2YXIgbXlDb2RlTWlycm9yID0gQ29kZU1pcnJvci5mcm9tVGV4dEFyZWEoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvZGUnKSwge1xuXHQvLyBcdGxpbmVOdW1iZXJzIDogdHJ1ZSxcblx0Ly8gXHRtb2RlOiAnamF2YXNjcmlwdCcsXG5cdC8vIFx0YXV0b2ZvY3VzIDogdHJ1ZSxcblx0Ly8gXHR0aGVtZSA6ICd0d2lsaWdodCcsXG5cdC8vIFx0bGluZVdyYXBwaW5nOiB0cnVlXG5cdC8vIH0pO1xuXG5cdC8vIG15Q29kZU1pcnJvci5yZXBsYWNlU2VsZWN0aW9uKCRzY29wZS50ZXh0KTtcblxuXHQvLyAkc2NvcGUudXBkYXRlVGV4dCA9IGZ1bmN0aW9uKCl7XG5cdC8vIFx0JHNjb3BlLnRleHQgPSBteUNvZGVNaXJyb3IuZ2V0VmFsdWUoKTtcblx0Ly8gXHQvL2NoZWNrIGlmIGRpZ2VzdCBpcyBpbiBwcm9ncmVzc1xuXHQvLyBcdGlmKCEkc2NvcGUuJCRwaGFzZSkge1xuXHQvLyBcdCAgJHNjb3BlLiRhcHBseSgpO1xuXHQvLyBcdH1cblx0Ly8gfTtcblxuXHQvLyAkc2NvcGUuaW5zZXJ0RnVuYyA9IGZ1bmN0aW9uKHBhcmFtKXtcblx0Ly8gXHQvL2dpdmVuIGEgcGFyYW0sIHdpbGwgaW5zZXJ0IGNoYXJhY3RlcnMgd2hlcmUgY3Vyc29yIGlzXG5cdC8vIFx0Y29uc29sZS5sb2coXCJpbnNlcnRpbmc6IFwiLCBwYXJhbSk7XG5cdC8vIFx0bXlDb2RlTWlycm9yLnJlcGxhY2VTZWxlY3Rpb24ocGFyYW0pO1xuXHQvLyBcdC8vIHdpbmRvdy5jb3Jkb3ZhLnBsdWdpbnMuS2V5Ym9hcmQuc2hvdygpO1xuXHQvLyBcdG15Q29kZU1pcnJvci5mb2N1cygpO1xuXHQvLyB9O1xuXG4gLy8gICAgbXlDb2RlTWlycm9yLm9uKFwiY2hhbmdlXCIsIGZ1bmN0aW9uIChteUNvZGVNaXJyb3IsIGNoYW5nZU9iail7XG4gLy8gICAgXHQkc2NvcGUudXBkYXRlVGV4dCgpO1xuIC8vICAgIH0pO1xuXG4gLy8gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJuYXRpdmUua2V5Ym9hcmRzaG93XCIsIGZ1bmN0aW9uICgpe1xuIC8vICAgIFx0JHNjb3BlLmtleWJvYXJkVmlzID0gdHJ1ZTtcbiAvLyAgICBcdCRzY29wZS4kYXBwbHkoKTtcbiAvLyAgICB9KTtcbiAvLyAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIm5hdGl2ZS5rZXlib2FyZGhpZGVcIiwgZnVuY3Rpb24gKCl7XG4gLy8gICAgXHQkc2NvcGUua2V5Ym9hcmRWaXMgPSBmYWxzZTtcbiAvLyAgICBcdCRzY29wZS4kYXBwbHkoKTtcbiAvLyAgICB9KTtcblxuXHQkc2NvcGUuYnV0dG9ucyA9IHtcblx0XHRjb21waWxlIDogJ0NvbXBpbGUnLFxuXHRcdGRpc21pc3MgOiAnRGlzbWlzcydcblx0fTtcblxuXHQkc2NvcGUua2V5cyA9IFtdO1xuXG5cdCRzY29wZS5zaG93UG9wdXAgPSBmdW5jdGlvbihpdGVtKSB7XG5cdFx0Y29uc29sZS5sb2coJ2tleXMnLGl0ZW0pO1xuXHRcdCRzY29wZS5kYXRhID0ge307XG5cdFx0JHNjb3BlLmtleXMgPSBpdGVtLmRhdGE7XG5cblx0ICAvLyBBbiBlbGFib3JhdGUsIGN1c3RvbSBwb3B1cFxuXHR2YXIgbXlQb3B1cCA9ICRpb25pY1BvcHVwLnNob3coe1xuXHR0ZW1wbGF0ZVVybDogJ2ZlYXR1cmVzL2NoYWxsZW5nZS1jb2RlL2NoYWxsZW5nZS1zeW50YXguaHRtbCcsXG5cdHRpdGxlOiBpdGVtLmRpc3BsYXksXG5cdHNjb3BlOiAkc2NvcGUsXG5cdGJ1dHRvbnM6IFtcblx0XHQgIHsgdGV4dDogJzxiPkRvbmU8L2I+JyB9XG5cdFx0XVxuXHR9KTtcblx0fTtcblxuXHQkc2NvcGUuc2F2ZUNoYWxsZW5nZSA9IGZ1bmN0aW9uKCl7XG5cdFx0Y29uc29sZS5sb2coXCJzYXZlIHNjb3BlLnRleHRcIiwgJHNjb3BlLnRleHQpO1xuXHRcdCRsb2NhbHN0b3JhZ2Uuc2V0KFwidGVzdGluZ1wiLCAkc2NvcGUudGV4dCk7XG5cdH07XG5cblx0JHNjb3BlLmdldFNhdmVkID0gZnVuY3Rpb24oKXtcblx0XHRjb25zb2xlLmxvZyhcInNhdmUgc2NvcGUudGV4dFwiLCAkc2NvcGUudGV4dCk7XG5cdFx0Y29uc29sZS5sb2coXCJlbnRlcmVkIGdldHNhdmVkIGZ1bmNcIik7XG5cdFx0JHNjb3BlLnRleHQgPSAkbG9jYWxzdG9yYWdlLmdldChcInRlc3RpbmdcIik7XG5cdH07XG5cbn0pOyIsImFwcC5mYWN0b3J5KCdDaGFsbGVuZ2VGb290ZXJGYWN0b3J5JywgZnVuY3Rpb24oKXtcblx0XG5cdHZhciBmb290ZXJIb3RrZXlzID0gW1xuXHRcdHtcblx0XHRcdGRpc3BsYXk6IFwiWyBdXCIsXG5cdFx0XHRpbnNlcnRQYXJhbTogXCJbXVwiXG5cdFx0fSxcblx0XHR7XG5cdFx0XHRkaXNwbGF5OiBcInsgfVwiLFxuXHRcdFx0aW5zZXJ0UGFyYW06IFwie31cIlxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0ZGlzcGxheTogXCIoIClcIixcblx0XHRcdGluc2VydFBhcmFtOiBcIigpXCJcblx0XHR9LFxuXHRcdHtcblx0XHRcdGRpc3BsYXk6IFwiLy9cIixcblx0XHRcdGluc2VydFBhcmFtOiBcIi8vXCJcblx0XHR9LFxuXHRcdHtcblx0XHRcdGRpc3BsYXk6IFwiPVwiLFxuXHRcdFx0aW5zZXJ0UGFyYW06IFwiPVwiXG5cdFx0fSxcblx0XHR7XG5cdFx0XHRkaXNwbGF5OiBcIjxcIixcblx0XHRcdGluc2VydFBhcmFtOiBcIjxcIlxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0ZGlzcGxheTogXCI+XCIsXG5cdFx0XHRpbnNlcnRQYXJhbTogXCI+XCJcblx0XHR9LFxuXHRcdHtcblx0XHRcdGRpc3BsYXk6IFwiLyogICovXCIsXG5cdFx0XHRpbnNlcnRQYXJhbTogXCIvKiAqL1wiXG5cdFx0fSxcblxuXHRdO1xuXG5cdHZhciBDb2RlU25pcHBldHMgPSBbXG5cdFx0e1xuXHRcdFx0ZGlzcGxheTogXCJmdW5jdGlvblwiLFxuXHRcdFx0aW5zZXJ0UGFyYW06IFwiZnVuY3Rpb24oKXsgfVwiXG5cdFx0fSxcblx0XHR7XG5cdFx0XHRkaXNwbGF5OiBcImZvciBsb29wXCIsXG5cdFx0XHRpbnNlcnRQYXJhbTogXCJmb3IodmFyIGk9IDtpPCA7aSsrKXsgfVwiXG5cdFx0fSxcblx0XHR7XG5cdFx0XHRkaXNwbGF5OiBcImxvZ1wiLFxuXHRcdFx0aW5zZXJ0UGFyYW06IFwiY29uc29sZS5sb2coKTtcIlxuXHRcdH0sXG5cdF07XG5cblx0dmFyIGZvb3Rlck1lbnUgPSBbXG5cdFx0e1xuXHRcdFx0ZGlzcGxheTogXCJDb2RlIFNuaXBwZXRzXCIsXG5cdFx0XHRkYXRhOiBDb2RlU25pcHBldHNcblx0XHR9LFxuXHRcdHtcblx0XHRcdGRpc3BsYXk6IFwiU3ludGF4XCIsXG5cdFx0XHRkYXRhOiBmb290ZXJIb3RrZXlzXG5cdFx0fSxcblx0XHR7XG5cdFx0XHRkaXNwbGF5OiBcIkNyZWF0ZVwiLFxuXHRcdFx0ZGF0YTogZm9vdGVySG90a2V5c1xuXHRcdH1cblx0XTtcblxuXHQvLyB2YXIgZ2V0SG90a2V5cyA9IGZ1bmN0aW9uKCl7XG5cdC8vIFx0cmV0dXJuIGZvb3RlckhvdGtleXM7XG5cdC8vIH07XG5cblx0cmV0dXJuIFx0e1xuXHRcdFx0XHRnZXRGb290ZXJNZW51IDogZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRyZXR1cm4gZm9vdGVyTWVudTtcblx0XHRcdFx0fVxuXHRcdFx0fTtcbn0pOyIsImFwcC5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIpe1xuXHQkc3RhdGVQcm92aWRlci5zdGF0ZSgnY2hhbGxlbmdlLmNvbXBpbGUnLCB7XG5cdFx0dXJsIDogJy9jaGFsbGVuZ2UvY29tcGlsZScsXG5cdFx0dmlld3MgOiB7XG5cdFx0XHQndGFiLWNvbXBpbGUnIDoge1xuXHRcdFx0XHR0ZW1wbGF0ZVVybCA6ICdmZWF0dXJlcy9jaGFsbGVuZ2UtY29tcGlsZS9jaGFsbGVuZ2UtY29tcGlsZS5odG1sJyxcblx0XHRcdFx0Y29udHJvbGxlcjogJ0NoYWxsZW5nZUNvbXBpbGVDdHJsJ1xuXHRcdFx0fVxuXHRcdH1cblx0XHQvLyAsXG5cdFx0Ly8gb25FbnRlciA6IGZ1bmN0aW9uKENoYWxsZW5nZUZhY3RvcnksICRzdGF0ZSl7XG5cdFx0Ly8gXHRpZihDaGFsbGVuZ2VGYWN0b3J5LmdldFN1Ym1pc3Npb24oKS5sZW5ndGggPT09IDApe1xuXHRcdC8vIFx0XHQkc3RhdGUuZ28oJ2NoYWxsZW5nZS52aWV3Jyk7XG5cdFx0Ly8gXHR9XG5cdFx0Ly8gfVxuXHR9KTtcbn0pO1xuXG5hcHAuY29udHJvbGxlcignQ2hhbGxlbmdlQ29tcGlsZUN0cmwnLCBmdW5jdGlvbigkc2NvcGUsIENoYWxsZW5nZUZhY3Rvcnkpe1xuXHQkc2NvcGUucXVlc3Rpb24gPSBDaGFsbGVuZ2VGYWN0b3J5LmdldFN1Ym1pc3Npb24oKTtcblx0Y29uc29sZS5sb2coJHNjb3BlLnF1ZXN0aW9uKTtcblx0dmFyIHJlc3VsdHMgPSBDaGFsbGVuZ2VGYWN0b3J5LmNvbXBpbGVTdWJtaXNzaW9uKCRzY29wZS5xdWVzdGlvbik7XG5cdCRzY29wZS5yZXN1bHRzID0gcmVzdWx0cztcblx0JHNjb3BlLm91dHB1dCA9IENoYWxsZW5nZUZhY3RvcnkuY29tcGlsZVN1Ym1pc3Npb24oJHNjb3BlLnF1ZXN0aW9uKS5vdXRwdXQ7XG5cdCRzY29wZS5lcnJvciA9IENoYWxsZW5nZUZhY3RvcnkuY29tcGlsZVN1Ym1pc3Npb24oJHNjb3BlLnF1ZXN0aW9uKS5lcnJvcjtcblxuXHQvL2luaXRpYWxpemUgQ29kZU1pcnJvclxuXHR2YXIgY21Db21waWxlID0gQ29kZU1pcnJvci5mcm9tVGV4dEFyZWEoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbXBpbGUnKSwge1xuXHRcdHJlYWRPbmx5IDogJ25vY3Vyc29yJyxcblx0XHRtb2RlOiAnamF2YXNjcmlwdCcsXG5cdFx0YXV0b2ZvY3VzIDogdHJ1ZSxcblx0XHR0aGVtZSA6ICd0d2lsaWdodCcsXG5cdFx0bGluZVdyYXBwaW5nOiB0cnVlXG5cdH0pO1xuXG5cdGNtQ29tcGlsZS5yZXBsYWNlU2VsZWN0aW9uKCRzY29wZS5xdWVzdGlvbik7XG5cblxuXHR2YXIgY21SZXN1bHRzID0gQ29kZU1pcnJvci5mcm9tVGV4dEFyZWEoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jlc3VsdHMnKSwge1xuXHRcdHJlYWRPbmx5IDogJ25vY3Vyc29yJyxcblx0XHRtb2RlOiAnamF2YXNjcmlwdCcsXG5cdFx0YXV0b2ZvY3VzIDogdHJ1ZSxcblx0XHR0aGVtZSA6ICd0d2lsaWdodCcsXG5cdFx0bGluZVdyYXBwaW5nOiB0cnVlXG5cdH0pO1xuXG5cdGNtUmVzdWx0cy5yZXBsYWNlU2VsZWN0aW9uKCRzY29wZS5vdXRwdXQpO1xuXG5cdCRzY29wZS4kb24oJ3N1Ym1pc3Npb25VcGRhdGVkJywgZnVuY3Rpb24oZSl7XG5cdFx0JHNjb3BlLnF1ZXN0aW9uID0gQ2hhbGxlbmdlRmFjdG9yeS5nZXRTdWJtaXNzaW9uKCk7XG5cdFx0cmVzdWx0cyA9IENoYWxsZW5nZUZhY3RvcnkuY29tcGlsZVN1Ym1pc3Npb24oJHNjb3BlLnF1ZXN0aW9uKTtcblx0XHQkc2NvcGUucmVzdWx0cyA9IHJlc3VsdHM7XG5cdFx0JHNjb3BlLm91dHB1dCA9IENoYWxsZW5nZUZhY3RvcnkuY29tcGlsZVN1Ym1pc3Npb24oJHNjb3BlLnF1ZXN0aW9uKS5vdXRwdXQ7XG5cdFx0JHNjb3BlLmVycm9yID0gQ2hhbGxlbmdlRmFjdG9yeS5jb21waWxlU3VibWlzc2lvbigkc2NvcGUucXVlc3Rpb24pLmVycm9yO1xuXHRcdGNtUmVzdWx0cy5zZXRWYWx1ZSgkc2NvcGUub3V0cHV0KTtcblxuXHR9KTtcbn0pOyIsImFwcC5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIpe1xuXHQkc3RhdGVQcm92aWRlci5zdGF0ZSgnY2hhbGxlbmdlLnZpZXcnLCB7XG5cdFx0dXJsOiAnL2NoYWxsZW5nZS92aWV3Jyxcblx0XHR2aWV3czoge1xuXHRcdFx0J3RhYi12aWV3JyA6IHtcblx0XHRcdFx0dGVtcGxhdGVVcmw6ICdmZWF0dXJlcy9jaGFsbGVuZ2Utdmlldy9jaGFsbGVuZ2Utdmlldy5odG1sJyxcblx0XHRcdFx0Y29udHJvbGxlcjogJ0NoYWxsZW5nZVZpZXdDdHJsJ1xuXHRcdFx0fVxuXHRcdH1cblx0fSk7XG59KTtcblxuYXBwLmNvbnRyb2xsZXIoJ0NoYWxsZW5nZVZpZXdDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBDaGFsbGVuZ2VGYWN0b3J5LCAkc3RhdGUsICRpb25pY1NsaWRlQm94RGVsZWdhdGUpe1xuXG5cdC8vQ29udHJvbHMgU2xpZGVcblx0JHNjb3BlLnNsaWRlSGFzQ2hhbGxlbmdlZCA9IGZ1bmN0aW9uKGluZGV4KXtcblx0XHQkaW9uaWNTbGlkZUJveERlbGVnYXRlLnNsaWRlKGluZGV4KTtcblx0fTtcblxuXHQvL0NoYWxsZW5nZSBWaWV3XG5cdCRzY29wZS5jaGFsbGVuZ2UgPSBDaGFsbGVuZ2VGYWN0b3J5LmdldFByb2JsZW0oKSB8fCBcIlRlc3RcIjtcblxuXHQkc2NvcGUudG9nZ2xlTWVudVNob3coKTtcblxuXHQvLyAkc2NvcGUuJG9uKCdwcm9ibGVtVXBkYXRlZCcsIGZ1bmN0aW9uKGUpe1xuXHQvLyBcdCRzY29wZS5jaGFsbGVuZ2UgPSBDaGFsbGVuZ2VGYWN0b3J5LmdldFByb2JsZW0oKTtcblx0Ly8gfSk7XG5cblxuXHRcbn0pOyIsImFwcC5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIsIFVTRVJfUk9MRVMpe1xuXG4gICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdjaGF0cycsIHtcbiAgICAgIHVybDogJy9jaGF0cycsXG4gICAgICB0ZW1wbGF0ZVVybDogJ2ZlYXR1cmVzL2NoYXRzL3RhYi1jaGF0cy5odG1sJyxcbiAgICAgIGNvbnRyb2xsZXI6ICdDaGF0c0N0cmwnLFxuICAgICAgZGF0YToge1xuICAgICAgICBhdXRoZW50aWNhdGU6IFtVU0VSX1JPTEVTLnB1YmxpY11cbiAgICAgIH1cbiAgICB9KVxuICAgIC5zdGF0ZSgnY2hhdC1kZXRhaWwnLCB7XG4gICAgICB1cmw6ICcvY2hhdHMvOmNoYXRJZCcsXG4gICAgICB0ZW1wbGF0ZVVybDogJ2ZlYXR1cmVzL2NoYXRzL2NoYXQtZGV0YWlsLmh0bWwnLFxuICAgICAgY29udHJvbGxlcjogJ0NoYXREZXRhaWxDdHJsJ1xuICAgIH0pO1xufSk7XG5cbmFwcC5jb250cm9sbGVyKCdDaGF0c0N0cmwnLCBmdW5jdGlvbigkc2NvcGUsIENoYXRzKSB7XG4gICRzY29wZS5jaGF0cyA9IENoYXRzLmFsbCgpO1xuICAkc2NvcGUucmVtb3ZlID0gZnVuY3Rpb24oY2hhdCkge1xuICAgIENoYXRzLnJlbW92ZShjaGF0KTtcbiAgfTtcbn0pO1xuXG5hcHAuY29udHJvbGxlcignQ2hhdERldGFpbEN0cmwnLCBmdW5jdGlvbigkc2NvcGUsICRzdGF0ZVBhcmFtcywgQ2hhdHMpIHtcbiAgJHNjb3BlLmNoYXQgPSBDaGF0cy5nZXQoJHN0YXRlUGFyYW1zLmNoYXRJZCk7XG59KTtcblxuYXBwLmZhY3RvcnkoJ0NoYXRzJywgZnVuY3Rpb24oKSB7XG4gIC8vIE1pZ2h0IHVzZSBhIHJlc291cmNlIGhlcmUgdGhhdCByZXR1cm5zIGEgSlNPTiBhcnJheVxuXG4gIC8vIFNvbWUgZmFrZSB0ZXN0aW5nIGRhdGFcbiAgdmFyIGNoYXRzID0gW3tcbiAgICBpZDogMCxcbiAgICBuYW1lOiAnQmVuIFNwYXJyb3cnLFxuICAgIGxhc3RUZXh0OiAnWW91IG9uIHlvdXIgd2F5PycsXG4gICAgZmFjZTogJ2h0dHBzOi8vcGJzLnR3aW1nLmNvbS9wcm9maWxlX2ltYWdlcy81MTQ1NDk4MTE3NjUyMTExMzYvOVNnQXVIZVkucG5nJ1xuICB9LCB7XG4gICAgaWQ6IDEsXG4gICAgbmFtZTogJ01heCBMeW54JyxcbiAgICBsYXN0VGV4dDogJ0hleSwgaXRcXCdzIG5vdCBtZScsXG4gICAgZmFjZTogJ2h0dHBzOi8vYXZhdGFyczMuZ2l0aHVidXNlcmNvbnRlbnQuY29tL3UvMTEyMTQ/dj0zJnM9NDYwJ1xuICB9LHtcbiAgICBpZDogMixcbiAgICBuYW1lOiAnQWRhbSBCcmFkbGV5c29uJyxcbiAgICBsYXN0VGV4dDogJ0kgc2hvdWxkIGJ1eSBhIGJvYXQnLFxuICAgIGZhY2U6ICdodHRwczovL3Bicy50d2ltZy5jb20vcHJvZmlsZV9pbWFnZXMvNDc5MDkwNzk0MDU4Mzc5MjY0Lzg0VEtqX3FhLmpwZWcnXG4gIH0sIHtcbiAgICBpZDogMyxcbiAgICBuYW1lOiAnUGVycnkgR292ZXJub3InLFxuICAgIGxhc3RUZXh0OiAnTG9vayBhdCBteSBtdWtsdWtzIScsXG4gICAgZmFjZTogJ2h0dHBzOi8vcGJzLnR3aW1nLmNvbS9wcm9maWxlX2ltYWdlcy80OTE5OTUzOTgxMzU3NjcwNDAvaWUyWl9WNmUuanBlZydcbiAgfSwge1xuICAgIGlkOiA0LFxuICAgIG5hbWU6ICdNaWtlIEhhcnJpbmd0b24nLFxuICAgIGxhc3RUZXh0OiAnVGhpcyBpcyB3aWNrZWQgZ29vZCBpY2UgY3JlYW0uJyxcbiAgICBmYWNlOiAnaHR0cHM6Ly9wYnMudHdpbWcuY29tL3Byb2ZpbGVfaW1hZ2VzLzU3ODIzNzI4MTM4NDg0MTIxNi9SM2FlMW42MS5wbmcnXG4gIH1dO1xuXG4gIHJldHVybiB7XG4gICAgYWxsOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBjaGF0cztcbiAgICB9LFxuICAgIHJlbW92ZTogZnVuY3Rpb24oY2hhdCkge1xuICAgICAgY2hhdHMuc3BsaWNlKGNoYXRzLmluZGV4T2YoY2hhdCksIDEpO1xuICAgIH0sXG4gICAgZ2V0OiBmdW5jdGlvbihjaGF0SWQpIHtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2hhdHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKGNoYXRzW2ldLmlkID09PSBwYXJzZUludChjaGF0SWQpKSB7XG4gICAgICAgICAgcmV0dXJuIGNoYXRzW2ldO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gIH07XG59KTtcbiIsImFwcC5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIpe1xuXHQkc3RhdGVQcm92aWRlci5zdGF0ZSgnZXhlcmNpc20nLCB7XG5cdFx0dGVtcGxhdGVVcmwgOiAnZmVhdHVyZXMvZXhlcmNpc20vZXhlcmNpc20uaHRtbCcsXG5cdFx0YWJzdHJhY3QgOiB0cnVlLFxuXHRcdHJlc29sdmUgOiB7XG5cdFx0XHRtYXJrZG93biA6IGZ1bmN0aW9uKEF2YWlsYWJsZUV4ZXJjaXNlcywgRXhlcmNpc21GYWN0b3J5LCAkc3RhdGUpe1xuXG5cdFx0XHRcdGlmKEV4ZXJjaXNtRmFjdG9yeS5nZXRUZXN0U2NyaXB0KCkubGVuZ3RoID09PSAwKSB7XG5cdFx0XHRcdFx0dmFyIGV4ZXJjaXNlID0gQXZhaWxhYmxlRXhlcmNpc2VzLmdldFJhbmRvbUV4ZXJjaXNlKCk7XG5cdFx0XHRcdFx0RXhlcmNpc21GYWN0b3J5LnNldE5hbWUoZXhlcmNpc2UubmFtZSk7XG5cdFx0XHRcdFx0cmV0dXJuIEV4ZXJjaXNtRmFjdG9yeS5nZXRFeHRlcm5hbFNjcmlwdChleGVyY2lzZS5saW5rKS50aGVuKGZ1bmN0aW9uKGRhdGEpe1xuXHRcdFx0XHRcdFx0cmV0dXJuIEV4ZXJjaXNtRmFjdG9yeS5nZXRFeHRlcm5hbE1kKGV4ZXJjaXNlLm1kTGluayk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdH1cblx0fSk7XG59KTtcblxuYXBwLmZhY3RvcnkoJ0V4ZXJjaXNtRmFjdG9yeScsIGZ1bmN0aW9uKCRodHRwLCAkcm9vdFNjb3BlKXtcblx0dmFyIG5hbWUgPSAnJztcblx0dmFyIHRlc3QgPSAnJztcblx0dmFyIGNvZGUgPSAnJztcblx0dmFyIG1hcmtkb3duID0gJyc7XG5cblx0cmV0dXJuIHtcblx0XHRnZXRFeHRlcm5hbFNjcmlwdCA6IGZ1bmN0aW9uKGxpbmspe1xuXHRcdFx0cmV0dXJuICRodHRwLmdldChsaW5rKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcblx0XHRcdFx0dGVzdCA9IHJlc3BvbnNlLmRhdGE7XG5cdFx0XHRcdHJldHVybiByZXNwb25zZS5kYXRhO1xuXHRcdFx0fSk7XG5cdFx0fSxcblx0XHRnZXRFeHRlcm5hbE1kIDogZnVuY3Rpb24obGluayl7XG5cdFx0XHRyZXR1cm4gJGh0dHAuZ2V0KGxpbmspLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuXHRcdFx0XHRtYXJrZG93biA9IHJlc3BvbnNlLmRhdGE7XG5cdFx0XHRcdHJldHVybiByZXNwb25zZS5kYXRhO1xuXHRcdFx0fSk7XG5cdFx0fSxcblx0XHRzZXROYW1lIDogZnVuY3Rpb24oc2V0TmFtZSl7XG5cdFx0XHRuYW1lID0gc2V0TmFtZTtcblx0XHR9LFxuXHRcdHNldFRlc3RTY3JpcHQgOiBmdW5jdGlvbih0ZXN0KXtcblx0XHRcdHRlc3QgPSB0ZXN0O1xuXHRcdFx0JHJvb3RTY29wZS4kYnJvYWRjYXN0KCd0ZXN0Q2hhbmdlJywge3Rlc3QgOiB0ZXN0fSk7XG5cdFx0fSxcblx0XHRzZXRDb2RlU2NyaXB0IDogZnVuY3Rpb24gKGNvZGUpe1xuXHRcdFx0Y29kZSA9IGNvZGU7XG5cdFx0XHQkcm9vdFNjb3BlLiRicm9hZGNhc3QoJ2NvZGVDaGFuZ2UnLCB7Y29kZSA6IGNvZGV9KTtcblx0XHR9LFxuXHRcdGdldFRlc3RTY3JpcHQgOiBmdW5jdGlvbigpe1xuXHRcdFx0cmV0dXJuIHRlc3Q7XG5cdFx0fSxcblx0XHRnZXRDb2RlU2NyaXB0IDogZnVuY3Rpb24oKXtcblx0XHRcdHJldHVybiBjb2RlO1xuXHRcdH0sXG5cdFx0Z2V0TWFya2Rvd24gOiBmdW5jdGlvbigpe1xuXHRcdFx0cmV0dXJuIG1hcmtkb3duO1xuXHRcdH0sXG5cdFx0Z2V0TmFtZSA6IGZ1bmN0aW9uKCl7XG5cdFx0XHRyZXR1cm4gbmFtZTtcblx0XHR9XG5cdH07XG59KTtcblxuYXBwLmZhY3RvcnkoJ0F2YWlsYWJsZUV4ZXJjaXNlcycsIGZ1bmN0aW9uKCl7XG5cblx0dmFyIGxpYnJhcnkgPSBbXG5cdFx0J2FjY3VtdWxhdGUnLFxuXHRcdCdhbGxlcmdpZXMnLFxuXHRcdCdhbmFncmFtJyxcblx0XHQnYXRiYXNoLWNpcGhlcicsXG5cdFx0J2JlZXItc29uZycsXG5cdFx0J2JpbmFyeScsXG5cdFx0J2JpbmFyeS1zZWFyY2gtdHJlZScsXG5cdFx0J2JvYicsXG5cdFx0J2JyYWNrZXQtcHVzaCcsXG5cdFx0J2NpcmN1bGFyLWJ1ZmZlcicsXG5cdFx0J2Nsb2NrJyxcblx0XHQnY3J5cHRvLXNxdWFyZScsXG5cdFx0J2N1c3RvbS1zZXQnLFxuXHRcdCdkaWZmZXJlbmNlLW9mLXNxdWFyZXMnLFxuXHRcdCdldGwnLFxuXHRcdCdmb29kLWNoYWluJyxcblx0XHQnZ2lnYXNlY29uZCcsXG5cdFx0J2dyYWRlLXNjaG9vbCcsXG5cdFx0J2dyYWlucycsXG5cdFx0J2hhbW1pbmcnLFxuXHRcdCdoZWxsby13b3JsZCcsXG5cdFx0J2hleGFkZWNpbWFsJ1xuXHRdO1xuXG5cdHZhciBnZW5lcmF0ZUxpbmsgPSBmdW5jdGlvbihuYW1lKXtcblx0XHRyZXR1cm4gJ2V4ZXJjaXNtL2phdmFzY3JpcHQvJyArIG5hbWUgKyAnLycgKyBuYW1lICsgJ190ZXN0LnNwZWMuanMnO1xuXHR9O1xuXG5cdHZhciBnZW5lcmF0ZU1kTGluayA9IGZ1bmN0aW9uKG5hbWUpe1xuXHRcdHJldHVybiAnZXhlcmNpc20vamF2YXNjcmlwdC8nICsgbmFtZSArICcvJyArIG5hbWUgKyAnLm1kJztcblx0fTtcblxuXHR2YXIgZ2VuZXJhdGVSYW5kb20gPSBmdW5jdGlvbigpe1xuXHRcdHZhciByYW5kb20gPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBsaWJyYXJ5Lmxlbmd0aCk7XG5cdFx0cmV0dXJuIGxpYnJhcnlbcmFuZG9tXTtcblx0fTtcblxuXHRyZXR1cm4ge1xuXHRcdGdldFNwZWNpZmljRXhlcmNpc2UgOiBmdW5jdGlvbihuYW1lKXtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdGxpbmsgOiBnZW5lcmF0ZUxpbmsobmFtZSksXG5cdFx0XHRcdG1kTGluayA6IGdlbmVyYXRlTWRMaW5rKG5hbWUpXG5cdFx0XHR9O1xuXHRcdH0sXG5cdFx0Z2V0UmFuZG9tRXhlcmNpc2UgOiBmdW5jdGlvbigpe1xuXHRcdFx0dmFyIG5hbWUgPSBnZW5lcmF0ZVJhbmRvbSgpO1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0bmFtZSA6IG5hbWUsXG5cdFx0XHRcdGxpbmsgOiBnZW5lcmF0ZUxpbmsobmFtZSksXG5cdFx0XHRcdG1kTGluayA6IGdlbmVyYXRlTWRMaW5rKG5hbWUpXG5cdFx0XHR9O1xuXHRcdH1cblx0fTtcbn0pOyIsImFwcC5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIpe1xuXHQkc3RhdGVQcm92aWRlci5zdGF0ZSgnZXhlcmNpc20uY29kZScsIHtcblx0XHR1cmwgOiAnL2V4ZXJjaXNtL2NvZGUnLFxuXHRcdHZpZXdzIDoge1xuXHRcdFx0J3RhYi1jb2RlJyA6IHtcblx0XHRcdFx0dGVtcGxhdGVVcmwgOiAnZmVhdHVyZXMvZXhlcmNpc20tY29kZS9leGVyY2lzbS1jb2RlLmh0bWwnLFxuXHRcdFx0XHRjb250cm9sbGVyOiAnRXhlcmNpc21Db2RlQ3RybCdcblx0XHRcdH1cblx0XHR9XG5cdH0pO1xufSk7XG5cbmFwcC5jb250cm9sbGVyKCdFeGVyY2lzbUNvZGVDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBFeGVyY2lzbUZhY3RvcnksICRzdGF0ZSl7XG5cdCRzY29wZS5uYW1lID0gRXhlcmNpc21GYWN0b3J5LmdldE5hbWUoKTtcblx0JHNjb3BlLmNvZGUgPSBFeGVyY2lzbUZhY3RvcnkuZ2V0Q29kZVNjcmlwdCgpO1xuXG5cdC8vcGFzc2luZyB0aGlzIHVwZGF0ZSBmdW5jdGlvbiBzbyB0aGF0IG9uIHRleHQgY2hhbmdlIGluIHRoZSBkaXJlY3RpdmUgdGhlIGZhY3Rvcnkgd2lsbCBiZSBhbGVydGVkXG5cdCRzY29wZS5jb21waWxlID0gZnVuY3Rpb24oY29kZSl7XG5cdFx0RXhlcmNpc21GYWN0b3J5LnNldENvZGVTY3JpcHQoY29kZSk7XG5cdFx0JHN0YXRlLmdvKCdleGVyY2lzbS5jb21waWxlJyk7XG5cdH07XG59KTsiLCJhcHAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKXtcblx0JHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2V4ZXJjaXNtLmNvbXBpbGUnLCB7XG5cdFx0dXJsIDogJy9leGVyY2lzbS9jb21waWxlJyxcblx0XHR2aWV3cyA6IHtcblx0XHRcdCd0YWItY29tcGlsZScgOiB7XG5cdFx0XHRcdHRlbXBsYXRlVXJsIDogJ2ZlYXR1cmVzL2V4ZXJjaXNtLWNvbXBpbGUvZXhlcmNpc20tY29tcGlsZS5odG1sJyxcblx0XHRcdFx0Y29udHJvbGxlcjogJ0V4ZXJjaXNtQ29tcGlsZUN0cmwnXG5cdFx0XHR9XG5cdFx0fSxcblx0XHRvbkVudGVyIDogZnVuY3Rpb24oKXtcblx0XHRcdGlmKHdpbmRvdy5qYXNtaW5lKSB3aW5kb3cuamFzbWluZS5nZXRFbnYoKS5leGVjdXRlKCk7XG5cdFx0fVxuXHR9KTtcbn0pO1xuXG5hcHAuY29udHJvbGxlcignRXhlcmNpc21Db21waWxlQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgRXhlcmNpc21GYWN0b3J5KXtcblx0JHNjb3BlLm5hbWUgPSBFeGVyY2lzbUZhY3RvcnkuZ2V0TmFtZSgpO1xuXHQkc2NvcGUudGVzdCA9IEV4ZXJjaXNtRmFjdG9yeS5nZXRUZXN0U2NyaXB0KCk7XG5cdCRzY29wZS5jb2RlID0gRXhlcmNpc21GYWN0b3J5LmdldENvZGVTY3JpcHQoKTtcblxuXHQkc2NvcGUuJG9uKCd0ZXN0Q2hhbmdlJywgZnVuY3Rpb24oZXZlbnQsIGRhdGEpe1xuXHRcdCRzY29wZS50ZXN0ID0gZGF0YS50ZXN0O1xuXHR9KTtcblxuXHQkc2NvcGUuJG9uKCdjb2RlQ2hhbmdlJywgZnVuY3Rpb24oZXZlbnQsIGRhdGEpe1xuXHRcdCRzY29wZS5jb2RlID0gZGF0YS5jb2RlO1xuXHR9KTtcbn0pOyIsImFwcC5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIpe1xuXHQkc3RhdGVQcm92aWRlci5zdGF0ZSgnZXhlcmNpc20udGVzdCcsIHtcblx0XHR1cmwgOiAnL2V4ZXJjaXNtL3Rlc3QnLFxuXHRcdHZpZXdzIDoge1xuXHRcdFx0J3RhYi10ZXN0JyA6IHtcblx0XHRcdFx0dGVtcGxhdGVVcmwgOiAnZmVhdHVyZXMvZXhlcmNpc20tdGVzdC9leGVyY2lzbS10ZXN0Lmh0bWwnLFxuXHRcdFx0XHRjb250cm9sbGVyIDogJ0V4ZXJjaXNtVGVzdEN0cmwnXG5cdFx0XHR9XG5cdFx0fVxuXHR9KTtcbn0pO1xuXG5hcHAuY29udHJvbGxlcignRXhlcmNpc21UZXN0Q3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgRXhlcmNpc21GYWN0b3J5KXtcblx0JHNjb3BlLm5hbWUgPSBFeGVyY2lzbUZhY3RvcnkuZ2V0TmFtZSgpO1xuXHQkc2NvcGUudGVzdCA9IEV4ZXJjaXNtRmFjdG9yeS5nZXRUZXN0U2NyaXB0KCk7XG5cblx0Ly9wYXNzaW5nIHRoaXMgdXBkYXRlIGZ1bmN0aW9uIHNvIHRoYXQgb24gdGV4dCBjaGFuZ2UgaW4gdGhlIGRpcmVjdGl2ZSB0aGUgZmFjdG9yeSB3aWxsIGJlIGFsZXJ0ZWRcblx0JHNjb3BlLnVwZGF0ZWZ1bmMgPSBmdW5jdGlvbihuZXdWYWx1ZSl7XG5cdFx0RXhlcmNpc21GYWN0b3J5LnNldFRlc3RTY3JpcHQobmV3VmFsdWUpO1xuXHR9O1xufSk7IiwiYXBwLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlcil7XG5cdCRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdleGVyY2lzbS52aWV3Jywge1xuXHRcdHVybDogJy9leGVyY2lzbS92aWV3Jyxcblx0XHR2aWV3czoge1xuXHRcdFx0J3RhYi12aWV3JyA6IHtcblx0XHRcdFx0dGVtcGxhdGVVcmw6ICdmZWF0dXJlcy9leGVyY2lzbS12aWV3L2V4ZXJjaXNtLXZpZXcuaHRtbCcsXG5cdFx0XHRcdGNvbnRyb2xsZXI6ICdFeGVyY2lzbVZpZXdDdHJsJ1xuXHRcdFx0fVxuXHRcdH1cblx0fSk7XG59KTtcblxuYXBwLmNvbnRyb2xsZXIoJ0V4ZXJjaXNtVmlld0N0cmwnLCBmdW5jdGlvbigkc2NvcGUsIEV4ZXJjaXNtRmFjdG9yeSl7XG5cdCRzY29wZS5tYXJrZG93biA9IEV4ZXJjaXNtRmFjdG9yeS5nZXRNYXJrZG93bigpO1xuXHQkc2NvcGUubmFtZSA9IEV4ZXJjaXNtRmFjdG9yeS5nZXROYW1lKCk7XG59KTsiLCJhcHAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKXtcbiAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgnc2lnbnVwJyx7XG4gICAgICAgIHVybDpcIi9zaWdudXBcIixcbiAgICAgICAgdGVtcGxhdGVVcmw6IFwiZmVhdHVyZXMvc2lnbnVwL3NpZ251cC5odG1sXCIsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdTaWduVXBDdHJsJ1xuICAgIH0pO1xufSk7XG5cbmFwcC5jb250cm9sbGVyKCdTaWduVXBDdHJsJyxmdW5jdGlvbigkcm9vdFNjb3BlLCAkaHR0cCwgJHNjb3BlLCAkc3RhdGUsIEF1dGhTZXJ2aWNlLCAkaW9uaWNQb3B1cCl7XG4gICAgJHNjb3BlLmRhdGEgPSB7fTtcbiAgICAkc2NvcGUuZXJyb3IgPSBudWxsO1xuXG4gICAgJHNjb3BlLmxvZ2luID0gZnVuY3Rpb24oKXtcbiAgICAgICAgJHN0YXRlLmdvKCdsb2dpbicpO1xuICAgIH07XG5cbiAgICAkc2NvcGUuc2lnbnVwID0gZnVuY3Rpb24oKXtcbiAgICAgICAgQXV0aFNlcnZpY2VcbiAgICAgICAgICAgIC5zaWdudXAoJHNjb3BlLmRhdGEpXG4gICAgICAgICAgICAudGhlbihmdW5jdGlvbihhdXRoZW50aWNhdGVkKXtcbiAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdzaWdudXAsIHRhYi5jaGFsbGVuZ2UnKTtcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoJ0F1dGgnKTtcbiAgICAgICAgICAgICAgICAkc2NvcGUuc3RhdGVzLnB1c2goeyAvL1RPRE86IE5lZWQgdG8gYWRkIGEgcGFyZW50IGNvbnRyb2xsZXIgdG8gY29tbXVuaWNhdGVcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogJ0xvZ291dCcsXG4gICAgICAgICAgICAgICAgICAgIHJlZjogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIEF1dGhTZXJ2aWNlLmxvZ291dCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmRhdGEgPSB7fTtcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5zdGF0ZXMucG9wKCk7IC8vVE9ETzogRmluZCBhIGJldHRlciB3YXkgdG8gcmVtb3ZlIHRoZSBMb2dvdXQgbGluaywgaW5zdGVhZCBvZiBwb3BcbiAgICAgICAgICAgICAgICAgICAgICAgICRzdGF0ZS5nbygnc2lnbnVwJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoJ0F1dGgnKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICRzdGF0ZS5nbygnZXhlcmNpc20udmlldycpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5jYXRjaChmdW5jdGlvbihlcnIpe1xuICAgICAgICAgICAgICAgICRzY29wZS5lcnJvciA9ICdTaWdudXAgSW52YWxpZCc7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihKU09OLnN0cmluZ2lmeShlcnIpKVxuICAgICAgICAgICAgICAgIHZhciBhbGVydFBvcHVwID0gJGlvbmljUG9wdXAuYWxlcnQoe1xuICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ1NpZ251cCBmYWlsZWQhJyxcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGU6ICdQbGVhc2UgY2hlY2sgeW91ciBjcmVkZW50aWFscyEnXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICB9O1xuXG59KTtcblxuLy9UT0RPOiBGb3JtIFZhbGlkYXRpb25cbi8vVE9ETzogQ2xlYW51cCBjb21tZW50ZWQgY29kZSIsImFwcC5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIpe1xuXHQkc3RhdGVQcm92aWRlci5zdGF0ZSgnbG9naW4nLCB7XG5cdFx0dXJsIDogJy9sb2dpbicsXG5cdFx0dGVtcGxhdGVVcmwgOiAnZmVhdHVyZXMvbG9naW4vbG9naW4uaHRtbCcsXG5cdFx0Y29udHJvbGxlciA6ICdMb2dpbkN0cmwnXG5cdH0pO1xufSk7XG5cbmFwcC5jb250cm9sbGVyKCdMb2dpbkN0cmwnLCBmdW5jdGlvbigkcm9vdFNjb3BlLCAkc2NvcGUsICRpb25pY1BvcHVwLCAkc3RhdGUsIEF1dGhTZXJ2aWNlKXtcblx0JHNjb3BlLmRhdGEgPSB7fTtcblx0JHNjb3BlLmVycm9yID0gbnVsbDtcblxuICAgICRzY29wZS5zaWdudXAgPSBmdW5jdGlvbigpe1xuICAgICAgICAkc3RhdGUuZ28oJ3NpZ251cCcpO1xuICAgIH07XG5cblx0JHNjb3BlLmxvZ2luID0gZnVuY3Rpb24oKXtcblx0XHRBdXRoU2VydmljZVxuXHRcdFx0LmxvZ2luKCRzY29wZS5kYXRhKVxuXHRcdFx0LnRoZW4oZnVuY3Rpb24oYXV0aGVudGljYXRlZCl7IC8vVE9ETzphdXRoZW50aWNhdGVkIGlzIHdoYXQgaXMgcmV0dXJuZWRcblx0XHRcdFx0Ly9jb25zb2xlLmxvZygnbG9naW4sIHRhYi5jaGFsbGVuZ2Utc3VibWl0Jyk7XG5cdFx0XHRcdC8vJHNjb3BlLm1lbnUgPSB0cnVlO1xuXHRcdFx0XHQkcm9vdFNjb3BlLiRicm9hZGNhc3QoJ0F1dGgnKTtcblx0XHRcdFx0JHNjb3BlLnN0YXRlcy5wdXNoKHsgLy9UT0RPOiBOZWVkIHRvIGFkZCBhIHBhcmVudCBjb250cm9sbGVyIHRvIGNvbW11bmljYXRlXG5cdFx0XHRcdFx0bmFtZTogJ0xvZ291dCcsXG5cdFx0XHRcdFx0cmVmOiBmdW5jdGlvbigpe1xuXHRcdFx0XHRcdFx0QXV0aFNlcnZpY2UubG9nb3V0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZGF0YSA9IHt9O1xuXHRcdFx0XHRcdFx0JHNjb3BlLnN0YXRlcy5wb3AoKTsgLy9UT0RPOiBGaW5kIGEgYmV0dGVyIHdheSB0byByZW1vdmUgdGhlIExvZ291dCBsaW5rLCBpbnN0ZWFkIG9mIHBvcFxuXHRcdFx0XHRcdFx0JHN0YXRlLmdvKCdzaWdudXAnKTtcblx0XHRcdFx0XHRcdCRyb290U2NvcGUuJGJyb2FkY2FzdCgnQXV0aCcpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHRcdCRzdGF0ZS5nbygnZXhlcmNpc20udmlldycpO1xuXHRcdFx0XHQvL1RPRE86IFdlIGNhbiBzZXQgdGhlIHVzZXIgbmFtZSBoZXJlIGFzIHdlbGwuIFVzZWQgaW4gY29uanVuY3Rpb24gd2l0aCBhIG1haW4gY3RybFxuXHRcdFx0fSlcblx0XHRcdC5jYXRjaChmdW5jdGlvbihlcnIpe1xuXHRcdFx0XHQkc2NvcGUuZXJyb3IgPSAnTG9naW4gSW52YWxpZCc7XG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoSlNPTi5zdHJpbmdpZnkoZXJyKSlcblx0XHRcdFx0dmFyIGFsZXJ0UG9wdXAgPSAkaW9uaWNQb3B1cC5hbGVydCh7XG5cdFx0XHRcdFx0dGl0bGU6ICdMb2dpbiBmYWlsZWQhJyxcblx0XHRcdFx0XHR0ZW1wbGF0ZTogJ1BsZWFzZSBjaGVjayB5b3VyIGNyZWRlbnRpYWxzISdcblx0XHRcdFx0fSk7XG5cdFx0XHR9KTtcblx0fTtcbn0pO1xuXG5cbi8vVE9ETzogQ2xlYW51cCBjb21tZW50ZWQgY29kZVxuXG4iLCJhcHAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKXtcblx0JHN0YXRlUHJvdmlkZXIuc3RhdGUoJ3dlbGNvbWUnLCB7XG5cdFx0dXJsIDogJy93ZWxjb21lJyxcblx0XHR0ZW1wbGF0ZVVybCA6ICdmZWF0dXJlcy93ZWxjb21lL3dlbGNvbWUuaHRtbCcsXG5cdFx0Y29udHJvbGxlciA6ICdXZWxjb21lQ3RybCdcblx0fSk7XG59KTtcblxuYXBwLmNvbnRyb2xsZXIoJ1dlbGNvbWVDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCAkc3RhdGUsIEF1dGhTZXJ2aWNlLCAkcm9vdFNjb3BlKXtcblx0Ly9UT0RPOiBTcGxhc2ggcGFnZSB3aGlsZSB5b3UgbG9hZCByZXNvdXJjZXMgKHBvc3NpYmxlIGlkZWEpXG5cdC8vY29uc29sZS5sb2coJ1dlbGNvbWVDdHJsJyk7XG5cdCRzY29wZS5sb2dpbiA9IGZ1bmN0aW9uKCl7XG5cdFx0JHN0YXRlLmdvKCdsb2dpbicpO1xuXHR9O1xuXHQkc2NvcGUuc2lnbnVwID0gZnVuY3Rpb24oKXtcblx0XHQkc3RhdGUuZ28oJ3NpZ251cCcpO1xuXHR9O1xuXG5cdGlmIChBdXRoU2VydmljZS5pc0F1dGhlbnRpY2F0ZWQoKSkge1xuXHRcdCRyb290U2NvcGUuJGJyb2FkY2FzdCgnQXV0aCcpO1xuXHRcdCRzY29wZS5zdGF0ZXMucHVzaCh7IC8vVE9ETzogTmVlZCB0byBhZGQgYSBwYXJlbnQgY29udHJvbGxlciB0byBjb21tdW5pY2F0ZVxuXHRcdFx0bmFtZTogJ0xvZ291dCcsXG5cdFx0XHRyZWY6IGZ1bmN0aW9uKCl7XG5cdFx0XHRcdEF1dGhTZXJ2aWNlLmxvZ291dCgpO1xuXHRcdFx0XHQkc2NvcGUuZGF0YSA9IHt9O1xuXHRcdFx0XHQkc2NvcGUuc3RhdGVzLnBvcCgpOyAvL1RPRE86IEZpbmQgYSBiZXR0ZXIgd2F5IHRvIHJlbW92ZSB0aGUgTG9nb3V0IGxpbmssIGluc3RlYWQgb2YgcG9wXG5cdFx0XHRcdCRzdGF0ZS5nbygnc2lnbnVwJyk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0JHN0YXRlLmdvKCdleGVyY2lzbS52aWV3Jyk7XG5cdH0gZWxzZSB7XG5cdFx0Ly9UT0RPOiAkc3RhdGUuZ28oJ3NpZ251cCcpOyBSZW1vdmUgQmVsb3cgbGluZVxuXHRcdCRzdGF0ZS5nbygnZXhlcmNpc20udmlldycpO1xuXHR9XG59KTsiLCIvL3Rva2VuIGlzIHNlbnQgb24gZXZlcnkgaHR0cCByZXF1ZXN0XG5hcHAuZmFjdG9yeSgnQXV0aEludGVyY2VwdG9yJyxmdW5jdGlvbiBBdXRoSW50ZXJjZXB0b3IoQVVUSF9FVkVOVFMsJHJvb3RTY29wZSwkcSxBdXRoVG9rZW5GYWN0b3J5KXtcblxuICAgIHZhciBzdGF0dXNEaWN0ID0ge1xuICAgICAgICA0MDE6IEFVVEhfRVZFTlRTLm5vdEF1dGhlbnRpY2F0ZWQsXG4gICAgICAgIDQwMzogQVVUSF9FVkVOVFMubm90QXV0aG9yaXplZFxuICAgIH07XG5cbiAgICByZXR1cm4ge1xuICAgICAgICByZXF1ZXN0OiBhZGRUb2tlbixcbiAgICAgICAgcmVzcG9uc2VFcnJvcjogZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3Qoc3RhdHVzRGljdFtyZXNwb25zZS5zdGF0dXNdLCByZXNwb25zZSk7XG4gICAgICAgICAgICByZXR1cm4gJHEucmVqZWN0KHJlc3BvbnNlKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBmdW5jdGlvbiBhZGRUb2tlbihjb25maWcpe1xuICAgICAgICB2YXIgdG9rZW4gPSBBdXRoVG9rZW5GYWN0b3J5LmdldFRva2VuKCk7XG4gICAgICAgIC8vY29uc29sZS5sb2coJ2FkZFRva2VuJyx0b2tlbik7XG4gICAgICAgIGlmKHRva2VuKXtcbiAgICAgICAgICAgIGNvbmZpZy5oZWFkZXJzID0gY29uZmlnLmhlYWRlcnMgfHwge307XG4gICAgICAgICAgICBjb25maWcuaGVhZGVycy5BdXRob3JpemF0aW9uID0gJ0JlYXJlciAnICsgdG9rZW47XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNvbmZpZztcbiAgICB9XG59KTtcbi8vc2tpcHBlZCBBdXRoIEludGVyY2VwdG9ycyBnaXZlbiBUT0RPOiBZb3UgY291bGQgYXBwbHkgdGhlIGFwcHJvYWNoIGluXG4vL2h0dHA6Ly9kZXZkYWN0aWMuY29tL3VzZXItYXV0aC1hbmd1bGFyanMtaW9uaWMvXG5cbmFwcC5jb25maWcoZnVuY3Rpb24oJGh0dHBQcm92aWRlcil7XG4gICAgJGh0dHBQcm92aWRlci5pbnRlcmNlcHRvcnMucHVzaCgnQXV0aEludGVyY2VwdG9yJyk7XG59KTtcblxuYXBwLmNvbnN0YW50KCdBVVRIX0VWRU5UUycsIHtcbiAgICAgICAgbm90QXV0aGVudGljYXRlZDogJ2F1dGgtbm90LWF1dGhlbnRpY2F0ZWQnLFxuICAgICAgICBub3RBdXRob3JpemVkOiAnYXV0aC1ub3QtYXV0aG9yaXplZCdcbn0pO1xuXG5hcHAuY29uc3RhbnQoJ1VTRVJfUk9MRVMnLCB7XG4gICAgICAgIC8vYWRtaW46ICdhZG1pbl9yb2xlJyxcbiAgICAgICAgcHVibGljOiAncHVibGljX3JvbGUnXG59KTtcblxuYXBwLmZhY3RvcnkoJ0F1dGhUb2tlbkZhY3RvcnknLGZ1bmN0aW9uKCR3aW5kb3cpe1xuICAgIHZhciBzdG9yZSA9ICR3aW5kb3cubG9jYWxTdG9yYWdlO1xuICAgIHZhciBrZXkgPSAnYXV0aC10b2tlbic7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBnZXRUb2tlbjogZ2V0VG9rZW4sXG4gICAgICAgIHNldFRva2VuOiBzZXRUb2tlblxuICAgIH07XG5cbiAgICBmdW5jdGlvbiBnZXRUb2tlbigpe1xuICAgICAgICByZXR1cm4gc3RvcmUuZ2V0SXRlbShrZXkpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNldFRva2VuKHRva2VuKXtcbiAgICAgICAgaWYodG9rZW4pe1xuICAgICAgICAgICAgc3RvcmUuc2V0SXRlbShrZXksdG9rZW4pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc3RvcmUucmVtb3ZlSXRlbShrZXkpO1xuICAgICAgICB9XG4gICAgfVxufSk7XG5cbmFwcC5zZXJ2aWNlKCdBdXRoU2VydmljZScsZnVuY3Rpb24oJHEsJGh0dHAsVVNFUl9ST0xFUyxBdXRoVG9rZW5GYWN0b3J5LEFwaUVuZHBvaW50LCRyb290U2NvcGUpe1xuICAgIHZhciB1c2VybmFtZSA9ICcnO1xuICAgIHZhciBpc0F1dGhlbnRpY2F0ZWQgPSBmYWxzZTtcbiAgICB2YXIgYXV0aFRva2VuO1xuXG4gICAgZnVuY3Rpb24gbG9hZFVzZXJDcmVkZW50aWFscygpIHtcbiAgICAgICAgLy92YXIgdG9rZW4gPSB3aW5kb3cubG9jYWxTdG9yYWdlLmdldEl0ZW0oTE9DQUxfVE9LRU5fS0VZKTtcbiAgICAgICAgdmFyIHRva2VuID0gQXV0aFRva2VuRmFjdG9yeS5nZXRUb2tlbigpO1xuICAgICAgICAvL2NvbnNvbGUubG9nKHRva2VuKTtcbiAgICAgICAgaWYgKHRva2VuKSB7XG4gICAgICAgICAgICB1c2VDcmVkZW50aWFscyh0b2tlbik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzdG9yZVVzZXJDcmVkZW50aWFscyhkYXRhKSB7XG4gICAgICAgIEF1dGhUb2tlbkZhY3Rvcnkuc2V0VG9rZW4oZGF0YS50b2tlbik7XG4gICAgICAgIHVzZUNyZWRlbnRpYWxzKGRhdGEpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHVzZUNyZWRlbnRpYWxzKGRhdGEpIHtcbiAgICAgICAgLy9jb25zb2xlLmxvZygndXNlQ3JlZGVudGlhbHMgdG9rZW4nLGRhdGEpO1xuICAgICAgICB1c2VybmFtZSA9IGRhdGEudXNlcm5hbWU7XG4gICAgICAgIGlzQXV0aGVudGljYXRlZCA9IHRydWU7XG4gICAgICAgIGF1dGhUb2tlbiA9IGRhdGEudG9rZW47XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZGVzdHJveVVzZXJDcmVkZW50aWFscygpIHtcbiAgICAgICAgYXV0aFRva2VuID0gdW5kZWZpbmVkO1xuICAgICAgICB1c2VybmFtZSA9ICcnO1xuICAgICAgICBpc0F1dGhlbnRpY2F0ZWQgPSBmYWxzZTtcbiAgICAgICAgQXV0aFRva2VuRmFjdG9yeS5zZXRUb2tlbigpOyAvL2VtcHR5IGNsZWFycyB0aGUgdG9rZW5cbiAgICB9XG5cbiAgICB2YXIgbG9nb3V0ID0gZnVuY3Rpb24oKXtcbiAgICAgICAgZGVzdHJveVVzZXJDcmVkZW50aWFscygpO1xuXG4gICAgfTtcblxuICAgIC8vdmFyIGxvZ2luID0gZnVuY3Rpb24oKVxuICAgIHZhciBsb2dpbiA9IGZ1bmN0aW9uKHVzZXJkYXRhKXtcbiAgICAgICAgY29uc29sZS5sb2coJ2xvZ2luJyxKU09OLnN0cmluZ2lmeSh1c2VyZGF0YSkpO1xuICAgICAgICByZXR1cm4gJHEoZnVuY3Rpb24ocmVzb2x2ZSxyZWplY3Qpe1xuICAgICAgICAgICAgJGh0dHAucG9zdChBcGlFbmRwb2ludC51cmwrXCIvdXNlci9sb2dpblwiLCB1c2VyZGF0YSlcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgICAgICAgICAgICAgICAgIHN0b3JlVXNlckNyZWRlbnRpYWxzKHJlc3BvbnNlLmRhdGEpOyAvL3N0b3JlVXNlckNyZWRlbnRpYWxzXG4gICAgICAgICAgICAgICAgICAgIC8vaXNBdXRoZW50aWNhdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShyZXNwb25zZSk7IC8vVE9ETzogc2VudCB0byBhdXRoZW50aWNhdGVkXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICB2YXIgc2lnbnVwID0gZnVuY3Rpb24odXNlcmRhdGEpe1xuICAgICAgICBjb25zb2xlLmxvZygnc2lnbnVwJyxKU09OLnN0cmluZ2lmeSh1c2VyZGF0YSkpO1xuICAgICAgICByZXR1cm4gJHEoZnVuY3Rpb24ocmVzb2x2ZSxyZWplY3Qpe1xuICAgICAgICAgICAgJGh0dHAucG9zdChBcGlFbmRwb2ludC51cmwrXCIvdXNlci9zaWdudXBcIiwgdXNlcmRhdGEpXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgICAgICAgICAgICAgICBzdG9yZVVzZXJDcmVkZW50aWFscyhyZXNwb25zZS5kYXRhKTsgLy9zdG9yZVVzZXJDcmVkZW50aWFsc1xuICAgICAgICAgICAgICAgICAgICAvL2lzQXV0aGVudGljYXRlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUocmVzcG9uc2UpOyAvL1RPRE86IHNlbnQgdG8gYXV0aGVudGljYXRlZFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBsb2FkVXNlckNyZWRlbnRpYWxzKCk7XG5cbiAgICB2YXIgaXNBdXRob3JpemVkID0gZnVuY3Rpb24oYXV0aGVudGljYXRlZCkge1xuICAgICAgICBpZiAoIWFuZ3VsYXIuaXNBcnJheShhdXRoZW50aWNhdGVkKSkge1xuICAgICAgICAgICAgYXV0aGVudGljYXRlZCA9IFthdXRoZW50aWNhdGVkXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gKGlzQXV0aGVudGljYXRlZCAmJiBhdXRoZW50aWNhdGVkLmluZGV4T2YoVVNFUl9ST0xFUy5wdWJsaWMpICE9PSAtMSk7XG4gICAgfTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIGxvZ2luOiBsb2dpbixcbiAgICAgICAgc2lnbnVwOiBzaWdudXAsXG4gICAgICAgIGxvZ291dDogbG9nb3V0LFxuICAgICAgICBpc0F1dGhlbnRpY2F0ZWQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgLy9jb25zb2xlLmxvZygnQXV0aFNlcnZpY2UuaXNBdXRoZW50aWNhdGVkKCknKTtcbiAgICAgICAgICAgIHJldHVybiBpc0F1dGhlbnRpY2F0ZWQ7XG4gICAgICAgIH0sXG4gICAgICAgIHVzZXJuYW1lOiBmdW5jdGlvbigpe3JldHVybiB1c2VybmFtZTt9LFxuICAgICAgICAvL2dldExvZ2dlZEluVXNlcjogZ2V0TG9nZ2VkSW5Vc2VyLFxuICAgICAgICBpc0F1dGhvcml6ZWQ6IGlzQXV0aG9yaXplZFxuICAgIH1cblxufSk7XG5cbi8vVE9ETzogRGlkIG5vdCBjb21wbGV0ZSBtYWluIGN0cmwgJ0FwcEN0cmwgZm9yIGhhbmRsaW5nIGV2ZW50cydcbi8vIGFzIHBlciBodHRwOi8vZGV2ZGFjdGljLmNvbS91c2VyLWF1dGgtYW5ndWxhcmpzLWlvbmljLyIsImFuZ3VsYXIubW9kdWxlKCdpb25pYy51dGlscycsIFtdKVxuXG4uZmFjdG9yeSgnJGxvY2Fsc3RvcmFnZScsIFsnJHdpbmRvdycsIGZ1bmN0aW9uKCR3aW5kb3cpIHtcbiAgcmV0dXJuIHtcbiAgICBzZXQ6IGZ1bmN0aW9uKGtleSwgdmFsdWUpIHtcbiAgICAgICR3aW5kb3cubG9jYWxTdG9yYWdlW2tleV0gPSB2YWx1ZTtcbiAgICB9LFxuICAgIGdldDogZnVuY3Rpb24oa2V5LCBkZWZhdWx0VmFsdWUpIHtcbiAgICAgIHJldHVybiAkd2luZG93LmxvY2FsU3RvcmFnZVtrZXldIHx8IGRlZmF1bHRWYWx1ZTtcbiAgICB9LFxuICAgIHNldE9iamVjdDogZnVuY3Rpb24oa2V5LCB2YWx1ZSkge1xuICAgICAgJHdpbmRvdy5sb2NhbFN0b3JhZ2Vba2V5XSA9IEpTT04uc3RyaW5naWZ5KHZhbHVlKTtcbiAgICB9LFxuICAgIGdldE9iamVjdDogZnVuY3Rpb24oa2V5KSB7XG4gICAgICByZXR1cm4gSlNPTi5wYXJzZSgkd2luZG93LmxvY2FsU3RvcmFnZVtrZXldIHx8ICd7fScpO1xuICAgIH1cbiAgfTtcbn1dKTsiLCJhcHAuZmlsdGVyKCdhcHBlbmQnLCBmdW5jdGlvbigpe1xuXHRyZXR1cm4gZnVuY3Rpb24oaW5wdXQsIGFwcGVuZCl7XG5cdFx0cmV0dXJuIGFwcGVuZCArIGlucHV0O1xuXHR9O1xufSk7IiwiYXBwLmZpbHRlcignbmFtZWZvcm1hdCcsIGZ1bmN0aW9uKCl7XG5cdHJldHVybiBmdW5jdGlvbih0ZXh0KXtcblx0XHRyZXR1cm4gJ0V4ZXJjaXNtIC0gJyArIHRleHQuc3BsaXQoJy0nKS5tYXAoZnVuY3Rpb24oZWwpe1xuXHRcdFx0cmV0dXJuIGVsLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgZWwuc2xpY2UoMSk7XG5cdFx0fSkuam9pbignICcpO1xuXHR9O1xufSk7IiwiYXBwLmZpbHRlcignbWFya2VkJywgZnVuY3Rpb24oJHNjZSl7XG5cdC8vIG1hcmtlZC5zZXRPcHRpb25zKHtcblx0Ly8gXHRyZW5kZXJlcjogbmV3IG1hcmtlZC5SZW5kZXJlcigpLFxuXHQvLyBcdGdmbTogdHJ1ZSxcblx0Ly8gXHR0YWJsZXM6IHRydWUsXG5cdC8vIFx0YnJlYWtzOiB0cnVlLFxuXHQvLyBcdHBlZGFudGljOiBmYWxzZSxcblx0Ly8gXHRzYW5pdGl6ZTogdHJ1ZSxcblx0Ly8gXHRzbWFydExpc3RzOiB0cnVlLFxuXHQvLyBcdHNtYXJ0eXBhbnRzOiBmYWxzZVxuXHQvLyB9KTtcblx0cmV0dXJuIGZ1bmN0aW9uKHRleHQpe1xuXHRcdGlmKHRleHQpe1xuXHRcdFx0cmV0dXJuICRzY2UudHJ1c3RBc0h0bWwobWFya2VkKHRleHQpKTtcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHRyZXR1cm4gdW5kZWZpbmVkO1xuXHRcdH1cblx0fTtcbn0pOyIsImFwcC5kaXJlY3RpdmUoJ2NtZWRpdCcsIGZ1bmN0aW9uKCl7XG5cdHJldHVybiB7XG5cdFx0cmVzdHJpY3QgOiAnQScsXG5cdFx0c2NvcGU6IHtcblx0XHRcdG5nTW9kZWwgOiAnPScsXG5cdFx0XHR1cGRhdGVmdW5jOiAnPSdcblx0XHR9LFxuXHRcdGxpbmsgOiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cmlidXRlKXtcblx0XHRcdHZhciB1cGRhdGVUZXh0ID0gZnVuY3Rpb24oKXtcblx0XHRcdFx0dmFyIG5ld1ZhbHVlID0gbXlDb2RlTWlycm9yLmdldFZhbHVlKCk7XG5cdFx0XHRcdHNjb3BlLm5nTW9kZWwgPSBuZXdWYWx1ZTtcblx0XHRcdFx0aWYoc2NvcGUudXBkYXRlZnVuYykgc2NvcGUudXBkYXRlZnVuYyhuZXdWYWx1ZSk7XG5cdFx0XHRcdHNjb3BlLiRhcHBseSgpO1xuXHRcdFx0fTtcblx0XHRcdC8vaW5pdGlhbGl6ZSBDb2RlTWlycm9yXG5cdFx0XHR2YXIgbXlDb2RlTWlycm9yID0gQ29kZU1pcnJvci5mcm9tVGV4dEFyZWEoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoYXR0cmlidXRlLmlkKSwge1xuXHRcdFx0XHRsaW5lTnVtYmVycyA6IHRydWUsXG5cdFx0XHRcdG1vZGU6ICdqYXZhc2NyaXB0Jyxcblx0XHRcdFx0YXV0b2ZvY3VzIDogdHJ1ZSxcblx0XHRcdFx0dGhlbWUgOiAndHdpbGlnaHQnLFxuXHRcdFx0XHRsaW5lV3JhcHBpbmc6IHRydWVcblx0XHRcdH0pO1xuXHRcdFx0bXlDb2RlTWlycm9yLnNldFZhbHVlKHNjb3BlLm5nTW9kZWwpO1xuXG5cdFx0XHRteUNvZGVNaXJyb3Iub24oXCJjaGFuZ2VcIiwgZnVuY3Rpb24gKG15Q29kZU1pcnJvciwgY2hhbmdlT2JqKXtcblx0XHQgICAgXHR1cGRhdGVUZXh0KCk7XG5cdFx0ICAgIH0pO1xuXHRcdH1cblx0fTtcbn0pOyIsImFwcC5kaXJlY3RpdmUoJ2NvZGVrZXlib2FyZCcsIGZ1bmN0aW9uKCRjb21waWxlKXtcblx0cmV0dXJuIHtcblx0XHRyZXN0cmljdCA6ICdBJyxcblx0XHRzY29wZToge1xuXHRcdFx0bmdNb2RlbCA6ICc9JyAvL2xpbmtzIGFueSBuZ21vZGVsIG9uIHRoZSBlbGVtZW50XG5cdFx0fSxcblx0XHRsaW5rIDogZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHJpYnV0ZSl7XG5cdFx0XHRlbGVtZW50LiRzZXQoXCJjbGFzc1wiLCBcImJhci1zdGFibGVcIik7XG5cdFx0XHRcblx0XHR9XG5cdH07XG59KTsiLCJhcHAuZGlyZWN0aXZlKCdjbXJlYWQnLCBmdW5jdGlvbigpe1xuXHRyZXR1cm4ge1xuXHRcdHJlc3RyaWN0IDogJ0EnLFxuXHRcdHNjb3BlOiB7XG5cdFx0XHRuZ01vZGVsIDogJz0nXG5cdFx0fSxcblx0XHRsaW5rIDogZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHJpYnV0ZSl7XG5cdFx0XHQvL2luaXRpYWxpemUgQ29kZU1pcnJvclxuXHRcdFx0dmFyIG15Q29kZU1pcnJvciA9IENvZGVNaXJyb3IuZnJvbVRleHRBcmVhKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb21waWxlJyksIHtcblx0XHRcdFx0cmVhZE9ubHkgOiAnbm9jdXJzb3InLFxuXHRcdFx0XHRtb2RlOiAnamF2YXNjcmlwdCcsXG5cdFx0XHRcdGF1dG9mb2N1cyA6IHRydWUsXG5cdFx0XHRcdHRoZW1lIDogJ3R3aWxpZ2h0Jyxcblx0XHRcdFx0bGluZVdyYXBwaW5nOiB0cnVlXG5cdFx0XHR9KTtcblxuXHRcdFx0bXlDb2RlTWlycm9yLnNldFZhbHVlKHNjb3BlLm5nTW9kZWwpO1xuXHRcdH1cblx0fTtcbn0pOyIsImFwcC5kaXJlY3RpdmUoJ2phc21pbmUnLCBmdW5jdGlvbihKYXNtaW5lUmVwb3J0ZXIpe1xuXHRyZXR1cm4ge1xuXHRcdHJlc3RyaWN0IDogJ0UnLFxuXHRcdHRyYW5zY2x1ZGU6IHRydWUsXG5cdFx0c2NvcGUgOiB7XG5cdFx0XHR0ZXN0OiAnPScsXG5cdFx0XHRjb2RlOiAnPSdcblx0XHR9LFxuXHRcdHRlbXBsYXRlVXJsIDogJ2ZlYXR1cmVzL2NvbW1vbi9kaXJlY3RpdmVzL2phc21pbmUvamFzbWluZS5odG1sJyxcblx0XHRsaW5rIDogZnVuY3Rpb24gKHNjb3BlLCBlbGVtZW50LCBhdHRyaWJ1dGUpe1xuXHRcdFx0c2NvcGUuJHdhdGNoKCd0ZXN0JywgZnVuY3Rpb24oKXtcblx0XHRcdFx0d2luZG93Lmphc21pbmUgPSBudWxsO1xuXHRcdFx0XHRKYXNtaW5lUmVwb3J0ZXIuaW5pdGlhbGl6ZUphc21pbmUoKTtcblx0XHRcdFx0SmFzbWluZVJlcG9ydGVyLmFkZFJlcG9ydGVyKHNjb3BlKTtcblx0XHRcdH0pO1xuXG5cdFx0XHRzY29wZS4kd2F0Y2goJ2NvZGUnLCBmdW5jdGlvbigpe1xuXHRcdFx0XHR3aW5kb3cuamFzbWluZSA9IG51bGw7XG5cdFx0XHRcdEphc21pbmVSZXBvcnRlci5pbml0aWFsaXplSmFzbWluZSgpO1xuXHRcdFx0XHRKYXNtaW5lUmVwb3J0ZXIuYWRkUmVwb3J0ZXIoc2NvcGUpO1xuXHRcdFx0fSk7XG5cblx0XHRcdGZ1bmN0aW9uIGZsYXR0ZW5SZW1vdmVEdXBlcyhhcnIsIGtleUNoZWNrKXtcblx0XHRcdFx0dmFyIHRyYWNrZXIgPSBbXTtcblx0XHRcdFx0cmV0dXJuIHdpbmRvdy5fLmZsYXR0ZW4oYXJyKS5maWx0ZXIoZnVuY3Rpb24oZWwpe1xuXHRcdFx0XHRcdGlmKHRyYWNrZXIuaW5kZXhPZihlbFtrZXlDaGVja10pID09IC0xKXtcblx0XHRcdFx0XHRcdHRyYWNrZXIucHVzaChlbFtrZXlDaGVja10pO1xuXHRcdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cblx0XHRcdHNjb3BlLiR3YXRjaCgnc3VpdGVzJywgZnVuY3Rpb24oKXtcblx0XHRcdFx0Y29uc29sZS5sb2coJ3RoZXJlIGlzIGEgY2hhbmdlIGluIHRoZSBzdWl0ZXMnKTtcblx0XHRcdFx0aWYoc2NvcGUuc3VpdGVzKXtcblx0XHRcdFx0XHR2YXIgc3VpdGVzU3BlY3MgPSBzY29wZS5zdWl0ZXMubWFwKGZ1bmN0aW9uKGVsKXtcblx0XHRcdFx0XHRcdHJldHVybiBlbC5zcGVjcztcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRzY29wZS5zcGVjc092ZXJ2aWV3ID0gZmxhdHRlblJlbW92ZUR1cGVzKHN1aXRlc1NwZWNzLCBcImlkXCIpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXHRcdH1cblx0fTtcbn0pO1xuXG5hcHAuZmFjdG9yeSgnSmFzbWluZVJlcG9ydGVyJywgZnVuY3Rpb24oKXtcblx0ZnVuY3Rpb24gaW5pdGlhbGl6ZUphc21pbmUoKXtcblx0XHQvKlxuXHRcdENvcHlyaWdodCAoYykgMjAwOC0yMDE1IFBpdm90YWwgTGFic1xuXG5cdFx0UGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nXG5cdFx0YSBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG5cdFx0XCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG5cdFx0d2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuXHRcdGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0b1xuXHRcdHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0b1xuXHRcdHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcblxuXHRcdFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlXG5cdFx0aW5jbHVkZWQgaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG5cblx0XHRUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELFxuXHRcdEVYUFJFU1MgT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuXHRcdE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EXG5cdFx0Tk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRVxuXHRcdExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT05cblx0XHRPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT05cblx0XHRXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblx0XHQqL1xuXHRcdC8qKlxuXHRcdCBTdGFydGluZyB3aXRoIHZlcnNpb24gMi4wLCB0aGlzIGZpbGUgXCJib290c1wiIEphc21pbmUsIHBlcmZvcm1pbmcgYWxsIG9mIHRoZSBuZWNlc3NhcnkgaW5pdGlhbGl6YXRpb24gYmVmb3JlIGV4ZWN1dGluZyB0aGUgbG9hZGVkIGVudmlyb25tZW50IGFuZCBhbGwgb2YgYSBwcm9qZWN0J3Mgc3BlY3MuIFRoaXMgZmlsZSBzaG91bGQgYmUgbG9hZGVkIGFmdGVyIGBqYXNtaW5lLmpzYCBhbmQgYGphc21pbmVfaHRtbC5qc2AsIGJ1dCBiZWZvcmUgYW55IHByb2plY3Qgc291cmNlIGZpbGVzIG9yIHNwZWMgZmlsZXMgYXJlIGxvYWRlZC4gVGh1cyB0aGlzIGZpbGUgY2FuIGFsc28gYmUgdXNlZCB0byBjdXN0b21pemUgSmFzbWluZSBmb3IgYSBwcm9qZWN0LlxuXG5cdFx0IElmIGEgcHJvamVjdCBpcyB1c2luZyBKYXNtaW5lIHZpYSB0aGUgc3RhbmRhbG9uZSBkaXN0cmlidXRpb24sIHRoaXMgZmlsZSBjYW4gYmUgY3VzdG9taXplZCBkaXJlY3RseS4gSWYgYSBwcm9qZWN0IGlzIHVzaW5nIEphc21pbmUgdmlhIHRoZSBbUnVieSBnZW1dW2phc21pbmUtZ2VtXSwgdGhpcyBmaWxlIGNhbiBiZSBjb3BpZWQgaW50byB0aGUgc3VwcG9ydCBkaXJlY3RvcnkgdmlhIGBqYXNtaW5lIGNvcHlfYm9vdF9qc2AuIE90aGVyIGVudmlyb25tZW50cyAoZS5nLiwgUHl0aG9uKSB3aWxsIGhhdmUgZGlmZmVyZW50IG1lY2hhbmlzbXMuXG5cblx0XHQgVGhlIGxvY2F0aW9uIG9mIGBib290LmpzYCBjYW4gYmUgc3BlY2lmaWVkIGFuZC9vciBvdmVycmlkZGVuIGluIGBqYXNtaW5lLnltbGAuXG5cblx0XHQgW2phc21pbmUtZ2VtXTogaHR0cDovL2dpdGh1Yi5jb20vcGl2b3RhbC9qYXNtaW5lLWdlbVxuXHRcdCAqL1xuXG5cdFx0KGZ1bmN0aW9uKCkge1xuXHRcdCAgLyoqXG5cdFx0ICAgKiAjIyBSZXF1aXJlICZhbXA7IEluc3RhbnRpYXRlXG5cdFx0ICAgKlxuXHRcdCAgICogUmVxdWlyZSBKYXNtaW5lJ3MgY29yZSBmaWxlcy4gU3BlY2lmaWNhbGx5LCB0aGlzIHJlcXVpcmVzIGFuZCBhdHRhY2hlcyBhbGwgb2YgSmFzbWluZSdzIGNvZGUgdG8gdGhlIGBqYXNtaW5lYCByZWZlcmVuY2UuXG5cdFx0ICAgKi9cblx0XHQgIHdpbmRvdy5qYXNtaW5lID0gamFzbWluZVJlcXVpcmUuY29yZShqYXNtaW5lUmVxdWlyZSk7XG5cblx0XHQgIC8qKlxuXHRcdCAgICogU2luY2UgdGhpcyBpcyBiZWluZyBydW4gaW4gYSBicm93c2VyIGFuZCB0aGUgcmVzdWx0cyBzaG91bGQgcG9wdWxhdGUgdG8gYW4gSFRNTCBwYWdlLCByZXF1aXJlIHRoZSBIVE1MLXNwZWNpZmljIEphc21pbmUgY29kZSwgaW5qZWN0aW5nIHRoZSBzYW1lIHJlZmVyZW5jZS5cblx0XHQgICAqL1xuXHRcdCAgamFzbWluZVJlcXVpcmUuaHRtbChqYXNtaW5lKTtcblxuXHRcdCAgLyoqXG5cdFx0ICAgKiBDcmVhdGUgdGhlIEphc21pbmUgZW52aXJvbm1lbnQuIFRoaXMgaXMgdXNlZCB0byBydW4gYWxsIHNwZWNzIGluIGEgcHJvamVjdC5cblx0XHQgICAqL1xuXHRcdCAgdmFyIGVudiA9IGphc21pbmUuZ2V0RW52KCk7XG5cblx0XHQgIC8qKlxuXHRcdCAgICogIyMgVGhlIEdsb2JhbCBJbnRlcmZhY2Vcblx0XHQgICAqXG5cdFx0ICAgKiBCdWlsZCB1cCB0aGUgZnVuY3Rpb25zIHRoYXQgd2lsbCBiZSBleHBvc2VkIGFzIHRoZSBKYXNtaW5lIHB1YmxpYyBpbnRlcmZhY2UuIEEgcHJvamVjdCBjYW4gY3VzdG9taXplLCByZW5hbWUgb3IgYWxpYXMgYW55IG9mIHRoZXNlIGZ1bmN0aW9ucyBhcyBkZXNpcmVkLCBwcm92aWRlZCB0aGUgaW1wbGVtZW50YXRpb24gcmVtYWlucyB1bmNoYW5nZWQuXG5cdFx0ICAgKi9cblx0XHQgIHZhciBqYXNtaW5lSW50ZXJmYWNlID0gamFzbWluZVJlcXVpcmUuaW50ZXJmYWNlKGphc21pbmUsIGVudik7XG5cblx0XHQgIC8qKlxuXHRcdCAgICogQWRkIGFsbCBvZiB0aGUgSmFzbWluZSBnbG9iYWwvcHVibGljIGludGVyZmFjZSB0byB0aGUgZ2xvYmFsIHNjb3BlLCBzbyBhIHByb2plY3QgY2FuIHVzZSB0aGUgcHVibGljIGludGVyZmFjZSBkaXJlY3RseS4gRm9yIGV4YW1wbGUsIGNhbGxpbmcgYGRlc2NyaWJlYCBpbiBzcGVjcyBpbnN0ZWFkIG9mIGBqYXNtaW5lLmdldEVudigpLmRlc2NyaWJlYC5cblx0XHQgICAqL1xuXHRcdCAgZXh0ZW5kKHdpbmRvdywgamFzbWluZUludGVyZmFjZSk7XG5cblx0XHQgIC8qKlxuXHRcdCAgICogIyMgUnVubmVyIFBhcmFtZXRlcnNcblx0XHQgICAqXG5cdFx0ICAgKiBNb3JlIGJyb3dzZXIgc3BlY2lmaWMgY29kZSAtIHdyYXAgdGhlIHF1ZXJ5IHN0cmluZyBpbiBhbiBvYmplY3QgYW5kIHRvIGFsbG93IGZvciBnZXR0aW5nL3NldHRpbmcgcGFyYW1ldGVycyBmcm9tIHRoZSBydW5uZXIgdXNlciBpbnRlcmZhY2UuXG5cdFx0ICAgKi9cblxuXHRcdCAgdmFyIHF1ZXJ5U3RyaW5nID0gbmV3IGphc21pbmUuUXVlcnlTdHJpbmcoe1xuXHRcdCAgICBnZXRXaW5kb3dMb2NhdGlvbjogZnVuY3Rpb24oKSB7IHJldHVybiB3aW5kb3cubG9jYXRpb247IH1cblx0XHQgIH0pO1xuXG5cdFx0ICB2YXIgY2F0Y2hpbmdFeGNlcHRpb25zID0gcXVlcnlTdHJpbmcuZ2V0UGFyYW0oXCJjYXRjaFwiKTtcblx0XHQgIGVudi5jYXRjaEV4Y2VwdGlvbnModHlwZW9mIGNhdGNoaW5nRXhjZXB0aW9ucyA9PT0gXCJ1bmRlZmluZWRcIiA/IHRydWUgOiBjYXRjaGluZ0V4Y2VwdGlvbnMpO1xuXG5cdFx0ICB2YXIgdGhyb3dpbmdFeHBlY3RhdGlvbkZhaWx1cmVzID0gcXVlcnlTdHJpbmcuZ2V0UGFyYW0oXCJ0aHJvd0ZhaWx1cmVzXCIpO1xuXHRcdCAgZW52LnRocm93T25FeHBlY3RhdGlvbkZhaWx1cmUodGhyb3dpbmdFeHBlY3RhdGlvbkZhaWx1cmVzKTtcblxuXHRcdCAgLyoqXG5cdFx0ICAgKiBUaGUgYGpzQXBpUmVwb3J0ZXJgIGFsc28gcmVjZWl2ZXMgc3BlYyByZXN1bHRzLCBhbmQgaXMgdXNlZCBieSBhbnkgZW52aXJvbm1lbnQgdGhhdCBuZWVkcyB0byBleHRyYWN0IHRoZSByZXN1bHRzICBmcm9tIEphdmFTY3JpcHQuXG5cdFx0ICAgKi9cblx0XHQgIGVudi5hZGRSZXBvcnRlcihqYXNtaW5lSW50ZXJmYWNlLmpzQXBpUmVwb3J0ZXIpO1xuXG5cdFx0ICAvKipcblx0XHQgICAqIEZpbHRlciB3aGljaCBzcGVjcyB3aWxsIGJlIHJ1biBieSBtYXRjaGluZyB0aGUgc3RhcnQgb2YgdGhlIGZ1bGwgbmFtZSBhZ2FpbnN0IHRoZSBgc3BlY2AgcXVlcnkgcGFyYW0uXG5cdFx0ICAgKi9cblx0XHQgIHZhciBzcGVjRmlsdGVyID0gbmV3IGphc21pbmUuSHRtbFNwZWNGaWx0ZXIoe1xuXHRcdCAgICBmaWx0ZXJTdHJpbmc6IGZ1bmN0aW9uKCkgeyByZXR1cm4gcXVlcnlTdHJpbmcuZ2V0UGFyYW0oXCJzcGVjXCIpOyB9XG5cdFx0ICB9KTtcblxuXHRcdCAgZW52LnNwZWNGaWx0ZXIgPSBmdW5jdGlvbihzcGVjKSB7XG5cdFx0ICAgIHJldHVybiBzcGVjRmlsdGVyLm1hdGNoZXMoc3BlYy5nZXRGdWxsTmFtZSgpKTtcblx0XHQgIH07XG5cblx0XHQgIC8qKlxuXHRcdCAgICogU2V0dGluZyB1cCB0aW1pbmcgZnVuY3Rpb25zIHRvIGJlIGFibGUgdG8gYmUgb3ZlcnJpZGRlbi4gQ2VydGFpbiBicm93c2VycyAoU2FmYXJpLCBJRSA4LCBwaGFudG9tanMpIHJlcXVpcmUgdGhpcyBoYWNrLlxuXHRcdCAgICovXG5cdFx0ICB3aW5kb3cuc2V0VGltZW91dCA9IHdpbmRvdy5zZXRUaW1lb3V0O1xuXHRcdCAgd2luZG93LnNldEludGVydmFsID0gd2luZG93LnNldEludGVydmFsO1xuXHRcdCAgd2luZG93LmNsZWFyVGltZW91dCA9IHdpbmRvdy5jbGVhclRpbWVvdXQ7XG5cdFx0ICB3aW5kb3cuY2xlYXJJbnRlcnZhbCA9IHdpbmRvdy5jbGVhckludGVydmFsO1xuXG5cdFx0ICAvKipcblx0XHQgICAqICMjIEV4ZWN1dGlvblxuXHRcdCAgICpcblx0XHQgICAqIFJlcGxhY2UgdGhlIGJyb3dzZXIgd2luZG93J3MgYG9ubG9hZGAsIGVuc3VyZSBpdCdzIGNhbGxlZCwgYW5kIHRoZW4gcnVuIGFsbCBvZiB0aGUgbG9hZGVkIHNwZWNzLiBUaGlzIGluY2x1ZGVzIGluaXRpYWxpemluZyB0aGUgYEh0bWxSZXBvcnRlcmAgaW5zdGFuY2UgYW5kIHRoZW4gZXhlY3V0aW5nIHRoZSBsb2FkZWQgSmFzbWluZSBlbnZpcm9ubWVudC4gQWxsIG9mIHRoaXMgd2lsbCBoYXBwZW4gYWZ0ZXIgYWxsIG9mIHRoZSBzcGVjcyBhcmUgbG9hZGVkLlxuXHRcdCAgICovXG5cdFx0ICB2YXIgY3VycmVudFdpbmRvd09ubG9hZCA9IHdpbmRvdy5vbmxvYWQ7XG5cblx0XHQgIChmdW5jdGlvbigpIHtcblx0XHQgICAgaWYgKGN1cnJlbnRXaW5kb3dPbmxvYWQpIHtcblx0XHQgICAgICBjdXJyZW50V2luZG93T25sb2FkKCk7XG5cdFx0ICAgIH1cblx0XHQgICAgZW52LmV4ZWN1dGUoKTtcblx0XHQgIH0pKCk7XG5cblx0XHQgIC8qKlxuXHRcdCAgICogSGVscGVyIGZ1bmN0aW9uIGZvciByZWFkYWJpbGl0eSBhYm92ZS5cblx0XHQgICAqL1xuXHRcdCAgZnVuY3Rpb24gZXh0ZW5kKGRlc3RpbmF0aW9uLCBzb3VyY2UpIHtcblx0XHQgICAgZm9yICh2YXIgcHJvcGVydHkgaW4gc291cmNlKSBkZXN0aW5hdGlvbltwcm9wZXJ0eV0gPSBzb3VyY2VbcHJvcGVydHldO1xuXHRcdCAgICByZXR1cm4gZGVzdGluYXRpb247XG5cdFx0ICB9XG5cblx0XHR9KSgpO1xuXHR9XG5cblx0ZnVuY3Rpb24gYWRkUmVwb3J0ZXIoc2NvcGUpe1xuXHRcdHZhciBzdWl0ZXMgPSBbXTtcblx0XHR2YXIgY3VycmVudFN1aXRlID0ge307XG5cblx0XHRmdW5jdGlvbiBTdWl0ZShvYmope1xuXHRcdFx0dGhpcy5pZCA9IG9iai5pZDtcblx0XHRcdHRoaXMuZGVzY3JpcHRpb24gPSBvYmouZGVzY3JpcHRpb247XG5cdFx0XHR0aGlzLmZ1bGxOYW1lID0gb2JqLmZ1bGxOYW1lO1xuXHRcdFx0dGhpcy5mYWlsZWRFeHBlY3RhdGlvbnMgPSBvYmouZmFpbGVkRXhwZWN0YXRpb25zO1xuXHRcdFx0dGhpcy5zdGF0dXMgPSBvYmouZmluaXNoZWQ7XG5cdFx0XHR0aGlzLnNwZWNzID0gW107XG5cdFx0fVxuXG5cdFx0dmFyIG15UmVwb3J0ZXIgPSB7XG5cblx0XHRcdGphc21pbmVTdGFydGVkOiBmdW5jdGlvbihvcHRpb25zKXtcblx0XHRcdFx0Y29uc29sZS5sb2cob3B0aW9ucyk7XG5cdFx0XHRcdHN1aXRlcyA9IFtdO1xuXHRcdFx0XHRzY29wZS50b3RhbFNwZWNzID0gb3B0aW9ucy50b3RhbFNwZWNzRGVmaW5lZDtcblx0XHRcdH0sXG5cdFx0XHRzdWl0ZVN0YXJ0ZWQ6IGZ1bmN0aW9uKHN1aXRlKXtcblx0XHRcdFx0Y29uc29sZS5sb2coJ3RoaXMgaXMgdGhlIHN1aXRlIHN0YXJ0ZWQnKTtcblx0XHRcdFx0Y29uc29sZS5sb2coc3VpdGUpO1xuXHRcdFx0XHRzY29wZS5zdWl0ZVN0YXJ0ZWQgPSBzdWl0ZTtcblx0XHRcdFx0Y3VycmVudFN1aXRlID0gbmV3IFN1aXRlKHN1aXRlKTtcblx0XHRcdH0sXG5cdFx0XHRzcGVjU3RhcnRlZDogZnVuY3Rpb24oc3BlYyl7XG5cdFx0XHRcdGNvbnNvbGUubG9nKCd0aGlzIGlzIHRoZSBzcGVjIHN0YXJ0ZWQnKTtcblx0XHRcdFx0Y29uc29sZS5sb2coc3BlYyk7XG5cdFx0XHRcdHNjb3BlLnNwZWNTdGFydGVkID0gc3BlYztcblx0XHRcdH0sXG5cdFx0XHRzcGVjRG9uZTogZnVuY3Rpb24oc3BlYyl7XG5cdFx0XHRcdGNvbnNvbGUubG9nKCd0aGlzIGlzIHRoZSBzcGVjIGRvbmUnKTtcblx0XHRcdFx0Y29uc29sZS5sb2coc3BlYyk7XG5cdFx0XHRcdHNjb3BlLnNwZWNEb25lID0gc3BlYztcblx0XHRcdFx0Y3VycmVudFN1aXRlLnNwZWNzLnB1c2goc3BlYyk7XG5cdFx0XHR9LFxuXHRcdFx0c3VpdGVEb25lOiBmdW5jdGlvbihzdWl0ZSl7XG5cdFx0XHRcdGNvbnNvbGUubG9nKCd0aGlzIGlzIHRoZSBzdWl0ZSBkb25lJyk7XG5cdFx0XHRcdGNvbnNvbGUubG9nKHN1aXRlKTtcblx0XHRcdFx0c2NvcGUuc3VpdGVEb25lID0gc3VpdGU7XG5cdFx0XHRcdHN1aXRlcy5wdXNoKGN1cnJlbnRTdWl0ZSk7XG5cdFx0XHR9LFxuXHRcdFx0amFzbWluZURvbmU6IGZ1bmN0aW9uKCl7XG5cdFx0XHRcdGNvbnNvbGUubG9nKCdGaW5pc2hlZCBzdWl0ZScpO1xuXHRcdFx0XHRzY29wZS5zdWl0ZXMgPSBzdWl0ZXM7XG5cdFx0XHR9XG5cdFx0fTtcblxuXHRcdHdpbmRvdy5qYXNtaW5lLmdldEVudigpLmFkZFJlcG9ydGVyKG15UmVwb3J0ZXIpO1xuXHR9XG5cblx0cmV0dXJuIHtcblx0XHRpbml0aWFsaXplSmFzbWluZSA6IGluaXRpYWxpemVKYXNtaW5lLFxuXHRcdGFkZFJlcG9ydGVyOiBhZGRSZXBvcnRlclxuXHR9O1xufSk7IiwiYXBwLmRpcmVjdGl2ZSgnanNsb2FkJywgZnVuY3Rpb24oKXtcblx0ZnVuY3Rpb24gdXBkYXRlU2NyaXB0KGVsZW1lbnQsIHRleHQpe1xuXHRcdGVsZW1lbnQuZW1wdHkoKTtcblx0XHR2YXIgc2NyaXB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7XG5cdFx0c2NyaXB0LnR5cGUgPSAndGV4dC9qYXZhc2NyaXB0Jztcblx0XHRzY3JpcHQuaW5uZXJIVE1MID0gdGV4dDtcblx0XHRjb25zb2xlLmxvZyhzY3JpcHQpO1xuXHRcdGVsZW1lbnQuYXBwZW5kKHNjcmlwdCk7XG5cdH1cblx0cmV0dXJuIHtcblx0XHRyZXN0cmljdCA6ICdFJyxcblx0XHRzY29wZSA6IHtcblx0XHRcdHRleHQgOiAnPSdcblx0XHR9LFxuXHRcdHRlbXBsYXRlVXJsOiAnZmVhdHVyZXMvY29tbW9uL2RpcmVjdGl2ZXMvanMtbG9hZC9qcy1sb2FkLmh0bWwnLFxuXHRcdGxpbmsgOiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cmlidXRlcyl7XG5cdFx0XHRzY29wZS4kd2F0Y2goJ3RleHQnLCBmdW5jdGlvbih0ZXh0KXtcblx0XHRcdFx0dXBkYXRlU2NyaXB0KGVsZW1lbnQsIHRleHQpO1xuXHRcdFx0XHQvLyBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChzY29wZS5uYW1lKS5pbm5lckhUTUwgPSB0ZXh0O1xuXHRcdFx0fSk7XG5cdFx0fVxuXHR9O1xufSk7XG5cbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==