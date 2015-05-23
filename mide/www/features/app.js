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
  url : 'http://localhost:9000/api'
})

//TODO:'https://protected-reaches-5946.herokuapp.com/api' - Deploy latest server before replacing

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
          name : 'Sandbox',
          ref : function(){return 'sandbox.code';}
        },
        {
          name : 'Chats',
          ref: function(){return 'chats';}
        },
        {
          name : 'Challenges',
          ref: function(){return 'exercism.compile';}
        },
        {
          name : 'Exercises',
          ref : function(){return 'exercises.view'; }
        },
        {
          name : 'My Snippets',
          ref : function (){return 'snippets';}
        },
        {
          name : 'About',
          ref : function(){ return 'about';}
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
app.config(function($stateProvider){
	$stateProvider.state('about', {
		url: '/about',
		templateUrl: 'features/about/about.html'
	});
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
app.config(function($stateProvider, USER_ROLES){

  $stateProvider.state('chats', {
      cache: false, //to ensure the controller is loading each time
      url: '/chats',
      templateUrl: 'features/chats/tab-chats.html',
      controller: 'ChatsCtrl',
      resolve: {
        friends: function(FriendsFactory) {
          return FriendsFactory.getFriends().then(function(response){
            //console.log('response.data friends',response.data.friends);
            return response.data.friends;
          });
        }
      }
    })
    .state('chat-details', {
      cache: false, //to ensure the controller is loading each time
      url: '/chats/:id',
      templateUrl: 'features/chats/chat-detail.html',
      controller: 'ChatDetailCtrl'
    });
});

app.controller('ChatsCtrl', function($scope, Chats, FriendsFactory,friends, $state, GistFactory) {
  console.log('hello world');
  //$scope.chats = Chats.all();
  //$scope.remove = function(chat) {
  //  Chats.remove(chat);
  //};

  $scope.data = {};
  $scope.friends = friends;

  console.log('friends',friends);
  //TODO: Add getFriends route as well and save to localStorage
  //FriendsFactory.getFriends().then(function(response){
  //  console.log('response.data friends',response.data.friends);
  //  $scope.friends = response.data.friends;
  //});

  $scope.addFriend = function(){
    console.log('addFriend clicked');
    FriendsFactory.addFriend($scope.data.username).then(friendAdded, friendNotAdded);
  };

  friendAdded = function(response){
    console.log('friendAdded',response.data.friend);
    $scope.friends.push(response.data.friend);
  };

  friendNotAdded = function(err){
    console.log(err);
  };

  GistFactory.queuedGists().then(addSharedGistsToScope);

  function addSharedGistsToScope(gists){
    //console.log('addSharedGistsToScope',gists.data);
    $scope.gists = gists.data;
    FriendsFactory.setGists(gists.data);
  }

  $scope.sharedCode = function(id){
    //console.log(id); //id of friend gist shared with
    $state.go('chat-details',{id:id}, {inherit:false});
  }

});

app.controller('ChatDetailCtrl', function($scope, $stateParams, FriendsFactory,$ionicModal) {
  console.log('stateParams',$stateParams.id,'gists',FriendsFactory.getGists());
  //$scope.chat = Chats.get($stateParams.chatId);
  //TODO: These are all gists, you need to filter based on the user before place on scope.
  $scope.gists = [];

  //$scope.code = '';

  var allGists = FriendsFactory.getGists() || [];

  $scope.showCode = function(code){
    console.log('showCode',code);
    $scope.code = code;
    $scope.openModal(code);
  };

  //TODO: Only show all Gists from specific user clicked on
  //TODO: Need to apply JSON parse

  allGists.forEach(function(gist){
    if(gist.user === $stateParams.id){
      $scope.gists.push(gist.gist.files.fileName.content);
    }
  });

  $ionicModal.fromTemplateUrl('features/chats/code-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });
  $scope.openModal = function(code) {
    //console.log(code);
    $scope.modal.show();
  };
  $scope.closeModal = function() {
    $scope.modal.hide();
  };
  //Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });
  // Execute action on hide modal
  $scope.$on('modal.hidden', function() {
    // Execute action
  });
  // Execute action on remove modal
  $scope.$on('modal.removed', function() {
    // Execute action
  });
  //$scope.gists = FriendsFactory.getGists();

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

app.factory('FriendsFactory',function($http,$q,ApiEndpoint){
  //get user to add and respond to user
  var allGists = [];
  var addFriend = function(friend){
    //console.log(friend);
    return $http.post(ApiEndpoint.url+"/user/addFriend",{friend:friend});
  };

  var getFriends = function(){
    //console.log('getFriends called')
    return $http.get(ApiEndpoint.url + "/user/getFriends");
  };


  //TODO: Remove Gists from FriendsFactory - should be in gist factory and loaded on start
  //TODO: You need to refactor because you may end up on any page without any data because it was not available in the previous page (the previous page was not loaded)
  var setGists = function(gists){
    //console.log('setGists');
    allGists = gists;
  };

  var getGists = function(){
    console.log('allGists',allGists);
    return allGists.gists;
  };

  return {
    addFriend: addFriend,
    getFriends: getFriends,
    getGists: getGists,
    setGists: setGists
  };

  //TODO: User is not logged in, so you cannot add a friend
});

app.config(function($stateProvider){
	$stateProvider.state('exercise',{
		url: '/exercise/:slug',
		abstract: true,
		templateUrl : 'features/exercise/exercise.html'
	});
});

app.factory('ExerciseFactory', function(){

});
app.config(function($stateProvider){
	$stateProvider.state('exercise.code', {
		url : '/exercise/:slug/code',
		views : {
			'tab-code' : {
				templateUrl : 'features/exercise-code/exercise-code.html',
				controller: 'ExerciseCodeCtrl'
			}
		}
	});
});

app.controller('ExerciseCodeCtrl', function($scope){
});
app.config(function($stateProvider){
	$stateProvider.state('exercise.compile', {
		url : '/exercise/:slug/compile',
		views : {
			'tab-compile' : {
				templateUrl : 'features/exercise-compile/exercise-compile.html',
				controller: 'ExerciseCompileCtrl'
			}
		}
	});
});

app.controller('ExerciseCompileCtrl', function($scope){

});
app.config(function($stateProvider){
	$stateProvider.state('exercise.test', {
		url : '/exercise/:slug/test',
		views : {
			'tab-test' : {
				templateUrl : 'features/exercise-test/exercise-test.html',
				controller: 'ExerciseTestCtrl'
			}
		}
	});
});

app.controller('ExerciseTestCtrl', function($scope){

});
app.config(function($stateProvider){
	$stateProvider.state('exercise.view', {
		url : '/exercise/:slug/view',
		views : {
			'tab-view' : {
				templateUrl : 'features/exercise-view/exercise-view.html',
				controller: 'ExerciseViewCtrl'
			}
		}
	});
});

app.controller('ExerciseViewCtrl', function($scope){

});
app.config(function($stateProvider){
	$stateProvider.state('exercise.view-edit', {
		url : '/exercise/:slug/view/edit',
		views : {
			'tab-view' : {
				templateUrl : 'features/exercise-view-edit/exercise-view-edit.html',
				controller: 'ExerciseViewEditCtrl'
			}
		}
	});
});

app.controller('ExerciseViewEditCtrl', function($scope){

});
app.config(function($stateProvider){
	$stateProvider.state('exercises', {
		url : '/exercises',
		templateUrl : 'features/exercises/exercises.html',
		controller: 'ExercisesCtrl'
	});
});

app.controller('ExercisesCtrl', function($scope, $state){
	$scope.create = function(){
		$state.go('exercises-create');
	};
});

app.factory('ExerciseFactory', function($localstorage){
	var exercises = $localstorage.getObject('exercises');
	if(window._.isEmpty(exercises)) exercises = [];

	return {
		getExercises : function(){
			return exercises;
		},
		createExercise : function(exercise){
			exercises.push(exercise);
			$localstorage.setObject(exercises);
		},
		getExercise : function(slug){
			for (var i = 0; i < exercises.length; i++) {
				if (exercises[i].slug === slug) return exercises[i];
			}
			return {};
		},
		updateExercise : function(exercise){
			for(var i = 0; i < exercises.length; i++){

			}
		},
		deleteExercise : function(){

		}
	};
});
app.config(function($stateProvider){
	$stateProvider.state('exercises-create', {
		url : '/exercises/create',
		templateUrl : 'features/exercises-create/exercises-create.html',
		controller: 'ExercisesCreateCtrl'
	});
});

app.controller('ExercisesCreateCtrl', function($scope){

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
			$rootScope.$broadcast('testChange', test);
		},
		setCodeScript : function (code){
			code = code;
			$rootScope.$broadcast('codeChange', code);
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

app.controller('ExercismCodeCtrl', function($scope, ExercismFactory, $state, KeyboardFactory){
	$scope.name = ExercismFactory.getName();
	$scope.code = {
		text : null
	};

	$scope.code.text = ExercismFactory.getCodeScript();
	//doesn't do anything right now - maybe pull previously saved code

	//passing this update function so that on text change in the directive the factory will be alerted
	$scope.compile = function(code){
		ExercismFactory.setCodeScript(code);
		$state.go('exercism.compile');
	};

	$scope.insertFunc = KeyboardFactory.makeInsertFunc($scope);

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
	$scope.compiling = {
		test: null,
		code : null
	};
	$scope.compiling.test = ExercismFactory.getTestScript();
	$scope.compiling.code = ExercismFactory.getCodeScript();


	$scope.$on('testChange', function(event, data){
		$scope.compiling.test = data;
	});

	$scope.$on('codeChange', function(event, data){
		$scope.compiling.code = data;
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

	$scope.test = {
		text: null
	};

	$scope.test.text = ExercismFactory.getTestScript();

	$scope.$watch('test.text', function(newValue){
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
	$stateProvider.state('sandbox', {
		templateUrl : 'features/sandbox/sandbox.html',
		abstract : true
	});
});

app.factory('SandboxFactory', function($http, ApiEndpoint, $rootScope, $state){

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
	$stateProvider.state('sandbox.code', {
		url : '/sandbox/code',
		views: {
			'tab-code' : {
				templateUrl : 'features/sandbox-code/sandbox-code.html',
				controller : 'SandboxCodeCtrl'
			}
		}
	});
});


app.controller('SandboxCodeCtrl', function($scope, $state, SandboxFactory, ExercismFactory, KeyboardFactory){
	$scope.code = {
		text : ''
	};

	$scope.buttons = {
		compile : 'Compile',
		save : 'Save'
	};

	$scope.compile = function(code){
		SandboxFactory.setSubmission(code);
		$state.go('sandbox.compile');
	};

	$scope.save = function(code){

	};

	$scope.insertFunc = KeyboardFactory.makeInsertFunc($scope);

	// $scope.saveChallenge = function(){
	// 	console.log("save scope.text", $scope.text);
	// 	$localstorage.set("testing", $scope.text);
	// };

	// $scope.getSaved = function(){
	// 	console.log("save scope.text", $scope.text);
	// 	console.log("entered getsaved func");
	// 	$scope.text = $localstorage.get("testing");
	// };

});
app.config(function($stateProvider){
	$stateProvider.state('sandbox.compile', {
		url : '/sandbox/compile',
		views : {
			'tab-compile' : {
				templateUrl : 'features/sandbox-compile/sandbox-compile.html',
				controller: 'SandboxCompileCtrl'
			}
		}
	});
});

app.controller('SandboxCompileCtrl', function($scope, SandboxFactory){
	$scope.question = SandboxFactory.getSubmission();
	var results = SandboxFactory.compileSubmission($scope.question);
	$scope.results = results;
	$scope.output = SandboxFactory.compileSubmission($scope.question).output;
	$scope.error = SandboxFactory.compileSubmission($scope.question).error;

	$scope.$on('submissionUpdated', function(e){
		$scope.question = SandboxFactory.getSubmission();
		results = SandboxFactory.compileSubmission($scope.question);
		$scope.results = results;
		$scope.output = SandboxFactory.compileSubmission($scope.question).output;
		$scope.error = SandboxFactory.compileSubmission($scope.question).error;
	});
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
	$stateProvider.state('snippet', {
		cache: false,
		url : '/snippet/:id',
		templateUrl : 'features/snippet-edit/snippet-edit.html',
		controller: 'SnippetEditCtrl'
	});
});

app.controller('SnippetEditCtrl', function($scope, $state, $stateParams, CodeSnippetFactory, KeyboardFactory){
	$scope.buttons = {
		edit : 'Edit',
		cancel : 'Cancel',
		delete : 'Delete'
	};
	$scope.snippet = CodeSnippetFactory.getSnippet($stateParams.id);

	$scope.insertFunc = KeyboardFactory.makeInsertFunc($scope);

	$scope.edit = function(snippet){
		CodeSnippetFactory.editSnippet($stateParams.id, snippet);
		$state.go('snippets');
	};

	$scope.delete = function(){
		CodeSnippetFactory.deleteSnippet($stateParams.id);
		$state.go('snippets');
	};

	$scope.cancel = function(){
		$state.go('snippets');
	};
});
app.config(function($stateProvider){
	$stateProvider.state('snippets', {
		url : '/snippets',
		templateUrl : 'features/snippets/snippets.html',
		controller : 'SnippetsCtrl'
	});
});

app.controller('SnippetsCtrl', function($scope, $rootScope, $state, CodeSnippetFactory){
	$scope.snippets = CodeSnippetFactory.getAllSnippets();
	$scope.remove = CodeSnippetFactory.deleteSnippet;

	$rootScope.$on('footerUpdated', function(event){
		$scope.snippets = CodeSnippetFactory.getAllSnippets();
	});

	$scope.create = function(){
		$state.go('snippets-create');
	};
});
app.config(function($stateProvider){
	$stateProvider.state('snippets-create', {
		url: '/snippets/create',
		templateUrl : 'features/snippets-create/snippets-create.html',
		controller: 'SnippetsCreateCtrl'
	});
});

app.controller('SnippetsCreateCtrl', function($scope, $state, KeyboardFactory, CodeSnippetFactory){
	$scope.snippet = {
		display : '',
		insertParam : ''
	};

	$scope.insertFunc = KeyboardFactory.makeInsertFunc($scope);

	$scope.create = function(snippet){
		CodeSnippetFactory.addSnippet(snippet);
		$state.go('snippets');
	};
});
app.config(function($stateProvider){
	$stateProvider.state('welcome', {
		url : '/welcome',
		templateUrl : 'features/welcome/welcome.html',
		controller : 'WelcomeCtrl'
	});
});
app.controller('WelcomeCtrl', function($scope, $state, AuthService, $rootScope, GistFactory, $ionicPopup){
	//TODO: Splash page while you load resources (possible idea)
	//console.log('WelcomeCtrl');
	$scope.buttons = {
		login : 'login',
		signup : 'signup'
	};

	// ionic.Platform.ready(function(){
	// 	ionic.Platform.showStatusBar(false);
	// });

	$scope.login = function(){
		$state.go('login');
	};
	$scope.signup = function(){
		$state.go('signup');
	};

	// if (AuthService.isAuthenticated()) {
	// 	$rootScope.$broadcast('Auth');
	// 	$scope.states.push({ //TODO: Need to add a parent controller to communicate
	// 		name: 'Logout',
	// 		ref: function(){
	// 			AuthService.logout();
	// 			$scope.data = {};
	// 			$scope.states.pop(); //TODO: Find a better way to remove the Logout link, instead of pop
	// 			$state.go('signup');
	// 		}
	// 	});
	// 	$state.go('exercism.view');
	// } else {
	// 	// TODO: $state.go('signup'); Remove Below line
	// 	// $state.go('exercism.view');
	// }
	var authReq = false; //TODO: Toggle for using authentication work flow - require backend wired up

	if (!authReq){
		$state.go('exercism.view');
	} else {
		if (AuthService.isAuthenticated()) {
			$rootScope.$broadcast('Auth');
			$scope.states.push({ //TODO: Need to add a parent controller to communicate
				name: 'Logout',
				ref: function(){
					AuthService.logout();
					$scope.data = {};
					$scope.states.pop(); //TODO: Find a better way to remove the Logout link, instead of pop
					$state.go('login');
				}
			});

			//pop-up options, view shared code or
			//TODO: Happen on Login, recieve gist notification
			GistFactory.queuedGists().then(gistsRx);

			function gistsRx(response){
				console.log(response.data.gists);
				if(response.data.gists.length !==0){
					//console.log('notify user of Rx gists')
					showConfirm = function() {
						var confirmPopup = $ionicPopup.confirm({
							title: 'You got Code!',
							template: 'Your friends shared some code, do you want to take a look?'
						});
						//TODO: Custom PopUp Instead
						//TODO: You need to account for login (this only accounts for user loading app, already logged in)
						confirmPopup.then(function(res) {
							if(res) {
								//console.log('You are sure');
								$state.go('chats');
							} else {
								//console.log('You are not sure');
								$state.go('exercism.compile');
							}
						});
					};

					showConfirm();
				} else {
					$state.go('exercism.compile');
				}
			}


		} else {
			//TODO: $state.go('signup'); Remove Below line
			$state.go('signup');
		}
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
app.factory('KeyboardFactory', function(){
	return {
		makeInsertFunc : function(scope){
			return function (text){
				scope.$broadcast("insert", text);
			};
		}
	};
});
app.factory('CodeSnippetFactory', function($rootScope){
	
	var codeSnippets = [
		{
			display: "fn",
			insertParam: "function(){ }"
		},
		{
			display: "for",
			insertParam: "for(var i= ;i< ;i++){ }"
		},
		{
			display: "while",
			insertParam: "while( ){ }"
		},
		{
			display: "do while",
			insertParam: "do { } while( );"
		},
		{
			display: "log",
			insertParam: "console.log();"
		},
	];

	var brackets = [
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
			display: "/*  */",
			insertParam: "/* */"
		}
	];

	var comparators = [
		{
			display: "!",
			insertParam: "!"
		},
		{
			display: "@",
			insertParam: "@"
		},
		{
			display: "#",
			insertParam: "#"
		},
		{
			display: "$",
			insertParam: "$"
		},
		{
			display: "%",
			insertParam: "%"
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
		}
	];

	var footerMenu = [
		{
			display: "Custom",
			data: codeSnippets
		},
		{
			display: "Special",
			data: comparators
		},
		{
			display: "Brackets",
			data: brackets
		}
	];

	// var getHotkeys = function(){
	// 	return footerHotkeys;
	// };

	return 	{
		getFooterMenu : function(){
			return footerMenu;
		},
		addSnippet : function(obj){
			console.log(obj);
			codeSnippets.push(obj);
			$rootScope.$broadcast('footerUpdated', this.getFooterMenu());
		},
		deleteSnippet : function(id){
			codeSnippets.splice(id, 1);
			$rootScope.$broadcast('footerUpdated', this.getFooterMenu());
		},
		getAllSnippets : function(){
			return codeSnippets.map(function(el, index){
				el.id = index;
				return el;
			});
		},
		editSnippet : function(id, changes){
			for(var key in codeSnippets[id]){
				codeSnippets[id][key] = changes[key];
			}
			$rootScope.$broadcast('footerUpdated', this.getFooterMenu());
		},
		getSnippet : function(id){
			return codeSnippets[id];
		},
		getSomeSnippets : function(text){
			function replaceTSN (str){
				return str.replace('/(\n|\t|\s)+/g', '');
			}

			function checkObject(check){
				if (arguments.length > 1){
					var args = [].prototype.slice.call(arguments,0);
					args.shift();
					return args.filter(function(el){
						return replaceTSN(el) === replaceTSN(check);
					}).length > 0;
				}
				else throw new Error('Please check');
			}

			return codeSnippets.filter(function(el){
				return checkObject(text, el.display, el.insertParam);
			});
		}
	};
});
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
app.service('LocalStorage',function(){})
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
app.directive('codekeyboard', function(CodeSnippetFactory, $compile){
	return {
		restrict : 'A',
		link : function(scope, element, attribute){
			var visible = false;

			element.addClass("bar-stable");
			element.addClass('ng-hide');

			function toggleClass(){
				if(visible){
					element.removeClass('ng-hide');
					element.addClass('ng-show');
				} else {
					element.removeClass('ng-show');
					element.addClass('ng-hide');
				}
			}
			scope.btns = CodeSnippetFactory.getFooterMenu();

			scope.$on('footerUpdated', function(event, data){
				scope.btns = data;
			});

			window.addEventListener("native.keyboardshow", function (){
		    	visible = true;
		    	toggleClass();

		    });
		    window.addEventListener("native.keyboardhide", function (){
		    	visible = false;
		    	toggleClass();
		    });
		}
	};
});
app.directive('snippetbuttons', function(){
	return {
		restrict : 'E',
		replace:true,
		templateUrl:"features/common/directives/codekeyboardbar/snippetbuttons.html",
		link : function(scope, element, attribute){
			scope.showOptions = false;
			scope.btnClick = function(data){
				scope.showOptions = true;
				scope.items = data;
			};
			scope.itemClick = function(insertParam){
				scope.insertFunc(insertParam);
			};
			scope.resetMenu = function(){
				scope.showOptions = false;
			};
		}
	};
});
app.directive('cmedit', function(){
	return {
		restrict : 'A',
		require: 'ngModel',
		link : function(scope, element, attribute, ngModelCtrl){
			//initialize CodeMirror
			var myCodeMirror;
			myCodeMirror = CodeMirror.fromTextArea(document.getElementById(attribute.id), {
				lineNumbers : true,
				mode: 'javascript',
				autofocus : true,
				theme : 'twilight',
				lineWrapping: true,
				scrollbarStyle: "overlay"
			});
			ngModelCtrl.$render = function(){
				myCodeMirror.setValue(ngModelCtrl.$viewValue || '');
			};

			myCodeMirror.on("change", function (myCodeMirror, changeObj){
		    	ngModelCtrl.$setViewValue(myCodeMirror.getValue());
		    });

		    scope.$on("insert", function(event, text){
		    	myCodeMirror.replaceSelection(text);
		    });
		}
	};
});
app.directive('cmread', function(){
	return {
		restrict : 'A',
		require: 'ngModel',
		link : function(scope, element, attribute, ngModelCtrl){
			//initialize CodeMirror
			var myCodeMirror = CodeMirror.fromTextArea(document.getElementById(attribute.id), {
				readOnly : 'nocursor',
				mode: 'javascript',
				autofocus : true,
				theme : 'twilight',
				lineWrapping: true
			});

			ngModelCtrl.$render = function(){
				myCodeMirror.setValue(ngModelCtrl.$viewValue || '');
			};
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
				suites = [];
			},
			suiteStarted: function(suite){
				currentSuite = new Suite(suite);
			},
			specStarted: function(spec){
				scope.specStarted = spec;
			},
			specDone: function(spec){
				currentSuite.specs.push(spec);
			},
			suiteDone: function(suite){
				suites.push(currentSuite);
			},
			jasmineDone: function(){
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
app.directive('share',function(GistFactory, $ionicPopover, FriendsFactory){
   return {
       restrict: 'E',
       templateUrl:'features/common/directives/share/share.html',
       link: function($scope, element, attributes){
           // .fromTemplateUrl() method

           //TODO: Cleanup GistFactory.shareGist(code,$scope.data.friends).then(gistShared);

           FriendsFactory.getFriends().then(addFriends);
           $scope.data = [];
           $scope.isChecked = [];
           function addFriends(response){
               //console.log('addFriends',response.data.friends);
               $scope.data.friends = response.data.friends;
           };

           //$scope.$watch('isChecked',function(){
           //	console.log($scope.isChecked);
           //});
           //TODO: Confirm that this is working in all scenarios
           $scope.send = function(code){
               //console.log('!@?!@#',code);
               GistFactory.shareGist($scope.code,Object.keys($scope.isChecked)).then(gistShared);
           };

           $ionicPopover.fromTemplateUrl('features/common/directives/share/friends.html', {
               scope: $scope
           }).then(function(popover) {
               $scope.popover = popover;
           });

           $scope.openPopover = function($event) {
               $scope.popover.show($event);
           };
           $scope.closePopover = function() {
               $scope.popover.hide();
           };
           //Cleanup the popover when we're done with it!
           $scope.$on('$destroy', function() {
               $scope.popover.remove();
           });
           // Execute action on hide popover
           $scope.$on('popover.hidden', function() {
               // Execute action
           });
           // Execute action on remove popover
           $scope.$on('popover.removed', function() {
               // Execute action
           });
           //};
           gistShared = function(response){
               console.log('gist shared',response);
               $scope.closePopover();
           };
       }
   }
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


app.factory('GistFactory',function($http,$q,ApiEndpoint){

    //TODO: handling for multiple friends (after testing one friend works)
    //TODO: Friend and code must be present
    //TODO: friends is an array of friend Mongo IDs

    //TODO: Share description and filename based on challenge for example
    //TODO:Or give the user options of what to fill in
    function shareGist(code,friends,description,fileName){
        console.log('code',code);
        return $http.post(ApiEndpoint.url + '/gists/shareGists',
            {gist : {
                code:code||"no code entered",
                friends:friends|| "555b623dfa9a65a43e9ec6d6",
                description:description || 'no description',
                fileName:fileName+".js" || 'no file name'
            }});
    }

    function queuedGists(){
        return $http.get(ApiEndpoint.url + '/gists/gistsQueue');
    }

    function createdGists(){
        return $http.get(ApiEndpoint.url + '/gists/createdGists')
    }

    return{
        shareGist: shareGist,
        queuedGists: queuedGists, //push notifications
        createdGists: createdGists
   }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImFib3V0L2Fib3V0LmpzIiwiYWNjb3VudC9hY2NvdW50LmpzIiwiY2hhdHMvY2hhdHMuanMiLCJleGVyY2lzZS9leGVyY2lzZS5qcyIsImV4ZXJjaXNlLWNvZGUvZXhlcmNpc2UtY29kZS5qcyIsImV4ZXJjaXNlLWNvbXBpbGUvZXhlcmNpc2UtY29tcGlsZS5qcyIsImV4ZXJjaXNlLXRlc3QvZXhlcmNpc2UtdGVzdC5qcyIsImV4ZXJjaXNlLXZpZXcvZXhlcmNpc2Utdmlldy5qcyIsImV4ZXJjaXNlLXZpZXctZWRpdC9leGVyY2lzZS12aWV3LWVkaXQuanMiLCJleGVyY2lzZXMvZXhlcmNpc2VzLmpzIiwiZXhlcmNpc2VzLWNyZWF0ZS9leGVyY2lzZXMtY3JlYXRlLmpzIiwiZXhlcmNpc20vZXhlcmNpc20uanMiLCJleGVyY2lzbS1jb2RlL2V4ZXJjaXNtLWNvZGUuanMiLCJleGVyY2lzbS1jb21waWxlL2V4ZXJjaXNtLWNvbXBpbGUuanMiLCJleGVyY2lzbS10ZXN0L2V4ZXJjaXNtLXRlc3QuanMiLCJleGVyY2lzbS12aWV3L2V4ZXJjaXNtLXZpZXcuanMiLCJsb2dpbi9sb2dpbi5qcyIsInNhbmRib3gvc2FuZGJveC5qcyIsInNhbmRib3gtY29kZS9zYW5kYm94LWNvZGUuanMiLCJzYW5kYm94LWNvbXBpbGUvc2FuZGJveC1jb21waWxlLmpzIiwic2lnbnVwL3NpZ251cC5qcyIsInNuaXBwZXQtZWRpdC9zbmlwcGV0LWVkaXQuanMiLCJzbmlwcGV0cy9zbmlwcGV0cy5qcyIsInNuaXBwZXRzLWNyZWF0ZS9zbmlwcGV0cy1jcmVhdGUuanMiLCJ3ZWxjb21lL3dlbGNvbWUuanMiLCJjb21tb24vQXV0aGVudGljYXRpb24vYXV0aGVudGljYXRpb24uanMiLCJjb21tb24vZmFjdG9yaWVzL0tleWJvYXJkRmFjdG9yeS5qcyIsImNvbW1vbi9mYWN0b3JpZXMvY29kZVNuaXBwZXRGYWN0b3J5LmpzIiwiY29tbW9uL2ZpbHRlcnMvYXBwZW5kLmpzIiwiY29tbW9uL2ZpbHRlcnMvYm9vbC5qcyIsImNvbW1vbi9maWx0ZXJzL2V4ZXJjaXNtLWZvcm1hdC1uYW1lLmpzIiwiY29tbW9uL2ZpbHRlcnMvbGVuZ3RoLmpzIiwiY29tbW9uL2ZpbHRlcnMvbWFya2VkLmpzIiwiY29tbW9uL2xvY2FsU3RvcmFnZS9sb2NhbHN0b3JhZ2UuanMiLCJjb21tb24vbW9kdWxlcy9pb25pYy51dGlscy5qcyIsImNvbW1vbi9kaXJlY3RpdmVzL2NvZGVrZXlib2FyZGJhci9jb2Rla2V5Ym9hcmRiYXIuanMiLCJjb21tb24vZGlyZWN0aXZlcy9jb2Rla2V5Ym9hcmRiYXIvc25pcHBldGJ1dHRvbnMuanMiLCJjb21tb24vZGlyZWN0aXZlcy9jb2RlbWlycm9yLWVkaXQvY29kZW1pcnJvci1lZGl0LmpzIiwiY29tbW9uL2RpcmVjdGl2ZXMvY29kZW1pcnJvci1yZWFkL2NvZGVtaXJyb3ItcmVhZC5qcyIsImNvbW1vbi9kaXJlY3RpdmVzL2phc21pbmUvamFzbWluZS5qcyIsImNvbW1vbi9kaXJlY3RpdmVzL3NoYXJlL3NoYXJlLmpzIiwiY29tbW9uL2RpcmVjdGl2ZXMvanMtbG9hZC9qcy1sb2FkLmpzIiwiY29tbW9uL2ZhY3RvcnkvZ2lzdC9naXN0LmZhY3RvcnkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQy9DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuQkE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcE9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIElvbmljIFN0YXJ0ZXIgQXBwXG5cbi8vIGFuZ3VsYXIubW9kdWxlIGlzIGEgZ2xvYmFsIHBsYWNlIGZvciBjcmVhdGluZywgcmVnaXN0ZXJpbmcgYW5kIHJldHJpZXZpbmcgQW5ndWxhciBtb2R1bGVzXG4vLyAnc3RhcnRlcicgaXMgdGhlIG5hbWUgb2YgdGhpcyBhbmd1bGFyIG1vZHVsZSBleGFtcGxlIChhbHNvIHNldCBpbiBhIDxib2R5PiBhdHRyaWJ1dGUgaW4gaW5kZXguaHRtbClcbi8vIHRoZSAybmQgcGFyYW1ldGVyIGlzIGFuIGFycmF5IG9mICdyZXF1aXJlcydcbi8vICdzdGFydGVyLnNlcnZpY2VzJyBpcyBmb3VuZCBpbiBzZXJ2aWNlcy5qc1xuLy8gJ3N0YXJ0ZXIuY29udHJvbGxlcnMnIGlzIGZvdW5kIGluIGNvbnRyb2xsZXJzLmpzXG52YXIgYXBwID0gYW5ndWxhci5tb2R1bGUoJ21pZGUnLCBbJ2lvbmljJywgJ2lvbmljLnV0aWxzJ10pXG5cbi5ydW4oZnVuY3Rpb24oJGlvbmljUGxhdGZvcm0pIHtcbiAgJGlvbmljUGxhdGZvcm0ucmVhZHkoZnVuY3Rpb24oKSB7XG4gICAgLy8gSGlkZSB0aGUgYWNjZXNzb3J5IGJhciBieSBkZWZhdWx0IChyZW1vdmUgdGhpcyB0byBzaG93IHRoZSBhY2Nlc3NvcnkgYmFyIGFib3ZlIHRoZSBrZXlib2FyZFxuICAgIC8vIGZvciBmb3JtIGlucHV0cylcbiAgICAvLyAkbG9jYXRpb25Qcm92aWRlci5odG1sNU1vZGUodHJ1ZSk7XG4gICAgaWYgKHdpbmRvdy5jb3Jkb3ZhICYmIHdpbmRvdy5jb3Jkb3ZhLnBsdWdpbnMgJiYgd2luZG93LmNvcmRvdmEucGx1Z2lucy5LZXlib2FyZCkge1xuXG4gICAgICBjb3Jkb3ZhLnBsdWdpbnMuS2V5Ym9hcmQuaGlkZUtleWJvYXJkQWNjZXNzb3J5QmFyKHRydWUpO1xuICAgICAgY29yZG92YS5wbHVnaW5zLktleWJvYXJkLmRpc2FibGVTY3JvbGwodHJ1ZSk7XG4gICAgfVxuICAgIGlmICh3aW5kb3cuU3RhdHVzQmFyKSB7XG4gICAgICAvLyBvcmcuYXBhY2hlLmNvcmRvdmEuc3RhdHVzYmFyIHJlcXVpcmVkXG4gICAgICBTdGF0dXNCYXIuc3R5bGVMaWdodENvbnRlbnQoKTtcbiAgICB9XG4gIH0pO1xufSlcblxuLy9UT0RPOlRoaXMgaXMgbmVlZGVkIHRvIHNldCB0byBhY2Nlc3MgdGhlIHByb3h5IHVybCB0aGF0IHdpbGwgdGhlbiBpbiB0aGUgaW9uaWMucHJvamVjdCBmaWxlIHJlZGlyZWN0IGl0IHRvIHRoZSBjb3JyZWN0IFVSTFxuLmNvbnN0YW50KCdBcGlFbmRwb2ludCcsIHtcbiAgdXJsIDogJ2h0dHA6Ly9sb2NhbGhvc3Q6OTAwMC9hcGknXG59KVxuXG4vL1RPRE86J2h0dHBzOi8vcHJvdGVjdGVkLXJlYWNoZXMtNTk0Ni5oZXJva3VhcHAuY29tL2FwaScgLSBEZXBsb3kgbGF0ZXN0IHNlcnZlciBiZWZvcmUgcmVwbGFjaW5nXG5cbi5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlcikge1xuICAvLyBJb25pYyB1c2VzIEFuZ3VsYXJVSSBSb3V0ZXIgd2hpY2ggdXNlcyB0aGUgY29uY2VwdCBvZiBzdGF0ZXNcbiAgLy8gTGVhcm4gbW9yZSBoZXJlOiBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci11aS91aS1yb3V0ZXJcbiAgLy8gU2V0IHVwIHRoZSB2YXJpb3VzIHN0YXRlcyB3aGljaCB0aGUgYXBwIGNhbiBiZSBpbi5cbiAgLy8gRWFjaCBzdGF0ZSdzIGNvbnRyb2xsZXIgY2FuIGJlIGZvdW5kIGluIGNvbnRyb2xsZXJzLmpzXG4gIC8vIGlmIG5vbmUgb2YgdGhlIGFib3ZlIHN0YXRlcyBhcmUgbWF0Y2hlZCwgdXNlIHRoaXMgYXMgdGhlIGZhbGxiYWNrXG4gIC8vICR1cmxSb3V0ZXJQcm92aWRlci5vdGhlcndpc2UoJy9jaGFsbGVuZ2UvdmlldycpOyAvL1RPRE86IEFsYmVydCB0ZXN0aW5nIHRoaXMgcm91dGVcblxuICAkdXJsUm91dGVyUHJvdmlkZXIub3RoZXJ3aXNlKCcvd2VsY29tZScpOyAvLyBUT0RPOiBSaWNoYXJkIHRlc3RpbmcgdGhpcyByb3V0ZVxuICAvLyR1cmxSb3V0ZXJQcm92aWRlci5vdGhlcndpc2UoJ2NoYWxsZW5nZS52aWV3Jyk7IC8vVE9ETzogVG9ueSB0ZXN0aW5nIHRoaXMgcm91dGVcbiAgLy8gJHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZSgnd2VsY29tZScpO1xuXG59KVxuLy9cblxuLy8vL3J1biBibG9ja3M6IGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMjA2NjMwNzYvYW5ndWxhcmpzLWFwcC1ydW4tZG9jdW1lbnRhdGlvblxuLy9Vc2UgcnVuIG1ldGhvZCB0byByZWdpc3RlciB3b3JrIHdoaWNoIHNob3VsZCBiZSBwZXJmb3JtZWQgd2hlbiB0aGUgaW5qZWN0b3IgaXMgZG9uZSBsb2FkaW5nIGFsbCBtb2R1bGVzLlxuLy9odHRwOi8vZGV2ZGFjdGljLmNvbS91c2VyLWF1dGgtYW5ndWxhcmpzLWlvbmljL1xuXG4ucnVuKGZ1bmN0aW9uICgkcm9vdFNjb3BlLCAkc3RhdGUsIEF1dGhTZXJ2aWNlLCBBVVRIX0VWRU5UUykge1xuXG4gICAgdmFyIGRlc3RpbmF0aW9uU3RhdGVSZXF1aXJlc0F1dGggPSBmdW5jdGlvbiAoc3RhdGUpIHtcbiAgICAgICAgLy9jb25zb2xlLmxvZygnY2wgLSBkZXN0aW5hdGlvblN0YXRlUmVxdWlyZXNBdXRoJywnc3RhdGUuZGF0YScsc3RhdGUuZGF0YSwnc3RhdGUuZGF0YS5hdXRoJyxzdGF0ZS5kYXRhLmF1dGhlbnRpY2F0ZSk7XG4gICAgICAgIHJldHVybiBzdGF0ZS5kYXRhICYmIHN0YXRlLmRhdGEuYXV0aGVudGljYXRlO1xuICAgIH07XG4gICBcbiAgICAvL1RPRE86IE5lZWQgdG8gbWFrZSBhdXRoZW50aWNhdGlvbiBtb3JlIHJvYnVzdCBiZWxvdyBkb2VzIG5vdCBmb2xsb3cgRlNHIChldC4gYWwuKVxuICAgIC8vVE9ETzogQ3VycmVudGx5IGl0IGlzIG5vdCBjaGVja2luZyB0aGUgYmFja2VuZCByb3V0ZSByb3V0ZXIuZ2V0KCcvdG9rZW4nKVxuICAgICRyb290U2NvcGUuJG9uKCckc3RhdGVDaGFuZ2VTdGFydCcsIGZ1bmN0aW9uIChldmVudCx0b1N0YXRlLCB0b1BhcmFtcykge1xuXG4gICAgICAgIC8vY29uc29sZS5sb2coJ3VzZXIgQXV0aGVudGljYXRlZCcsIEF1dGhTZXJ2aWNlLmlzQXV0aGVudGljYXRlZCgpKTtcblxuICAgICAgICBpZiAoIWRlc3RpbmF0aW9uU3RhdGVSZXF1aXJlc0F1dGgodG9TdGF0ZSkpIHtcbiAgICAgICAgICAgIC8vIFRoZSBkZXN0aW5hdGlvbiBzdGF0ZSBkb2VzIG5vdCByZXF1aXJlIGF1dGhlbnRpY2F0aW9uXG4gICAgICAgICAgICAvLyBTaG9ydCBjaXJjdWl0IHdpdGggcmV0dXJuLlxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKEF1dGhTZXJ2aWNlLmlzQXV0aGVudGljYXRlZCgpKSB7XG4gICAgICAgICAgICAvLyBUaGUgdXNlciBpcyBhdXRoZW50aWNhdGVkLlxuICAgICAgICAgICAgLy8gU2hvcnQgY2lyY3VpdCB3aXRoIHJldHVybi5cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vVE9ETzogTm90IHN1cmUgaG93IHRvIHByb2NlZWQgaGVyZVxuICAgICAgICAkc3RhdGUuZ28oJ2xvZ2luJyk7IC8vaWYgYWJvdmUgZmFpbHMsIGdvdG8gbG9naW5cbiAgICB9KTtcbiAgLy8gJHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZSgnL3NpZ251cCcpOyAvLyBUT0RPOiBSaWNoYXJkIHRlc3RpbmcgdGhpcyByb3V0ZVxuICAvLyR1cmxSb3V0ZXJQcm92aWRlci5vdGhlcndpc2UoJy9jaGFsbGVuZ2UvdmlldycpOyAvL1RPRE86IFRvbnkgdGVzdGluZyB0aGlzIHJvdXRlXG5cbn0pO1xuXG5hcHAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKXtcbiAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdtYWluJywge1xuICAgICAgIHRlbXBsYXRlVXJsOiAnZmVhdHVyZXMvY29tbW9uL21haW4vbWFpbi5odG1sJyxcbiAgICAgICBjb250cm9sbGVyOiAnTWVudUN0cmwnXG4gICB9KTtcbn0pO1xuXG5hcHAuY29udHJvbGxlcignTWFpbkN0cmwnLCBmdW5jdGlvbigkcm9vdFNjb3BlLCRzY29wZSwgJGlvbmljU2lkZU1lbnVEZWxlZ2F0ZSwgJGlvbmljUG9wdXAsICRzdGF0ZSwgQXV0aFNlcnZpY2UsQVVUSF9FVkVOVFMpe1xuICAgICRzY29wZS51c2VybmFtZSA9IEF1dGhTZXJ2aWNlLnVzZXJuYW1lKCk7XG4gICAgLy9jb25zb2xlLmxvZyhBdXRoU2VydmljZS5pc0F1dGhlbnRpY2F0ZWQoKSk7XG5cbiAgICAkc2NvcGUuJG9uKEFVVEhfRVZFTlRTLm5vdEF1dGhvcml6ZWQsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgIHZhciBhbGVydFBvcHVwID0gJGlvbmljUG9wdXAuYWxlcnQoe1xuICAgICAgICAgICAgdGl0bGU6ICdVbmF1dGhvcml6ZWQhJyxcbiAgICAgICAgICAgIHRlbXBsYXRlOiAnWW91IGFyZSBub3QgYWxsb3dlZCB0byBhY2Nlc3MgdGhpcyByZXNvdXJjZS4nXG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgJHNjb3BlLiRvbihBVVRIX0VWRU5UUy5ub3RBdXRoZW50aWNhdGVkLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICBBdXRoU2VydmljZS5sb2dvdXQoKTtcbiAgICAgICAgLy8kc3RhdGUuZ28oJ2xvZ2luJyk7XG4gICAgICAgIHZhciBhbGVydFBvcHVwID0gJGlvbmljUG9wdXAuYWxlcnQoe1xuICAgICAgICAgICAgdGl0bGU6ICdQbGVhc2UgUmV2aWV3JyxcbiAgICAgICAgICAgIHRlbXBsYXRlOiAnJ1xuICAgICAgICB9KTtcbiAgICB9KTtcbn0pO1xuXG5hcHAuY29udHJvbGxlcignTWVudUN0cmwnLCBmdW5jdGlvbigkc2NvcGUsICRpb25pY1NpZGVNZW51RGVsZWdhdGUsICRzdGF0ZSwgQXV0aFNlcnZpY2UsICRyb290U2NvcGUpe1xuXG4gICAgJHNjb3BlLnN0YXRlcyA9IFtcbiAgICAgICAge1xuICAgICAgICAgIG5hbWUgOiAnQWNjb3VudCcsXG4gICAgICAgICAgcmVmIDogZnVuY3Rpb24oKXtyZXR1cm4gJ2FjY291bnQnO31cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIG5hbWUgOiAnU2FuZGJveCcsXG4gICAgICAgICAgcmVmIDogZnVuY3Rpb24oKXtyZXR1cm4gJ3NhbmRib3guY29kZSc7fVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgbmFtZSA6ICdDaGF0cycsXG4gICAgICAgICAgcmVmOiBmdW5jdGlvbigpe3JldHVybiAnY2hhdHMnO31cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIG5hbWUgOiAnQ2hhbGxlbmdlcycsXG4gICAgICAgICAgcmVmOiBmdW5jdGlvbigpe3JldHVybiAnZXhlcmNpc20uY29tcGlsZSc7fVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgbmFtZSA6ICdFeGVyY2lzZXMnLFxuICAgICAgICAgIHJlZiA6IGZ1bmN0aW9uKCl7cmV0dXJuICdleGVyY2lzZXMudmlldyc7IH1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIG5hbWUgOiAnTXkgU25pcHBldHMnLFxuICAgICAgICAgIHJlZiA6IGZ1bmN0aW9uICgpe3JldHVybiAnc25pcHBldHMnO31cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIG5hbWUgOiAnQWJvdXQnLFxuICAgICAgICAgIHJlZiA6IGZ1bmN0aW9uKCl7IHJldHVybiAnYWJvdXQnO31cbiAgICAgICAgfVxuICAgIF07XG5cbiAgICAkc2NvcGUudG9nZ2xlTWVudVNob3cgPSBmdW5jdGlvbigpe1xuICAgICAgICAvL2NvbnNvbGUubG9nKCdBdXRoU2VydmljZScsQXV0aFNlcnZpY2UuaXNBdXRoZW50aWNhdGVkKCkpXG4gICAgICAgIC8vY29uc29sZS5sb2coJ3RvZ2dsZU1lbnVTaG93JyxBdXRoU2VydmljZS5pc0F1dGhlbnRpY2F0ZWQoKSk7XG4gICAgICAgIC8vVE9ETzogcmV0dXJuIEF1dGhTZXJ2aWNlLmlzQXV0aGVudGljYXRlZCgpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9O1xuXG4gICAgJHJvb3RTY29wZS4kb24oJ0F1dGgnLGZ1bmN0aW9uKCl7XG4gICAgICAgLy9jb25zb2xlLmxvZygnYXV0aCcpO1xuICAgICAgICRzY29wZS50b2dnbGVNZW51U2hvdygpO1xuICAgIH0pO1xuXG4gICAgLy9jb25zb2xlLmxvZyhBdXRoU2VydmljZS5pc0F1dGhlbnRpY2F0ZWQoKSk7XG4gICAgLy9pZihBdXRoU2VydmljZS5pc0F1dGhlbnRpY2F0ZWQoKSl7XG4gICAgJHNjb3BlLmNsaWNrSXRlbSA9IGZ1bmN0aW9uKHN0YXRlUmVmKXtcbiAgICAgICAgJGlvbmljU2lkZU1lbnVEZWxlZ2F0ZS50b2dnbGVMZWZ0KCk7XG4gICAgICAgICRzdGF0ZS5nbyhzdGF0ZVJlZigpKTsgLy9SQjogVXBkYXRlZCB0byBoYXZlIHN0YXRlUmVmIGFzIGEgZnVuY3Rpb24gaW5zdGVhZC5cbiAgICB9O1xuXG4gICAgJHNjb3BlLnRvZ2dsZU1lbnUgPSBmdW5jdGlvbigpe1xuICAgICAgICAkaW9uaWNTaWRlTWVudURlbGVnYXRlLnRvZ2dsZUxlZnQoKTtcbiAgICB9O1xuICAgIC8vfVxufSk7IiwiYXBwLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlcil7XG5cdCRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdhYm91dCcsIHtcblx0XHR1cmw6ICcvYWJvdXQnLFxuXHRcdHRlbXBsYXRlVXJsOiAnZmVhdHVyZXMvYWJvdXQvYWJvdXQuaHRtbCdcblx0fSk7XG59KTsiLCJhcHAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyLCBVU0VSX1JPTEVTKXtcblx0Ly8gRWFjaCB0YWIgaGFzIGl0cyBvd24gbmF2IGhpc3Rvcnkgc3RhY2s6XG5cdCRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdhY2NvdW50Jywge1xuXHRcdHVybDogJy9hY2NvdW50Jyxcblx0ICAgIHRlbXBsYXRlVXJsOiAnZmVhdHVyZXMvYWNjb3VudC9hY2NvdW50Lmh0bWwnLFxuXHRcdGNvbnRyb2xsZXI6ICdBY2NvdW50Q3RybCdcblx0XHQvLyAsXG5cdFx0Ly8gZGF0YToge1xuXHRcdC8vIFx0YXV0aGVudGljYXRlOiBbVVNFUl9ST0xFUy5wdWJsaWNdXG5cdFx0Ly8gfVxuXHR9KTtcbn0pO1xuXG5hcHAuY29udHJvbGxlcignQWNjb3VudEN0cmwnLCBmdW5jdGlvbigkc2NvcGUpIHtcblx0JHNjb3BlLnNldHRpbmdzID0ge1xuXHRcdGVuYWJsZUZyaWVuZHM6IHRydWVcblx0fTtcbn0pOyIsImFwcC5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIsIFVTRVJfUk9MRVMpe1xuXG4gICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdjaGF0cycsIHtcbiAgICAgIGNhY2hlOiBmYWxzZSwgLy90byBlbnN1cmUgdGhlIGNvbnRyb2xsZXIgaXMgbG9hZGluZyBlYWNoIHRpbWVcbiAgICAgIHVybDogJy9jaGF0cycsXG4gICAgICB0ZW1wbGF0ZVVybDogJ2ZlYXR1cmVzL2NoYXRzL3RhYi1jaGF0cy5odG1sJyxcbiAgICAgIGNvbnRyb2xsZXI6ICdDaGF0c0N0cmwnLFxuICAgICAgcmVzb2x2ZToge1xuICAgICAgICBmcmllbmRzOiBmdW5jdGlvbihGcmllbmRzRmFjdG9yeSkge1xuICAgICAgICAgIHJldHVybiBGcmllbmRzRmFjdG9yeS5nZXRGcmllbmRzKCkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdyZXNwb25zZS5kYXRhIGZyaWVuZHMnLHJlc3BvbnNlLmRhdGEuZnJpZW5kcyk7XG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UuZGF0YS5mcmllbmRzO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSlcbiAgICAuc3RhdGUoJ2NoYXQtZGV0YWlscycsIHtcbiAgICAgIGNhY2hlOiBmYWxzZSwgLy90byBlbnN1cmUgdGhlIGNvbnRyb2xsZXIgaXMgbG9hZGluZyBlYWNoIHRpbWVcbiAgICAgIHVybDogJy9jaGF0cy86aWQnLFxuICAgICAgdGVtcGxhdGVVcmw6ICdmZWF0dXJlcy9jaGF0cy9jaGF0LWRldGFpbC5odG1sJyxcbiAgICAgIGNvbnRyb2xsZXI6ICdDaGF0RGV0YWlsQ3RybCdcbiAgICB9KTtcbn0pO1xuXG5hcHAuY29udHJvbGxlcignQ2hhdHNDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBDaGF0cywgRnJpZW5kc0ZhY3RvcnksZnJpZW5kcywgJHN0YXRlLCBHaXN0RmFjdG9yeSkge1xuICBjb25zb2xlLmxvZygnaGVsbG8gd29ybGQnKTtcbiAgLy8kc2NvcGUuY2hhdHMgPSBDaGF0cy5hbGwoKTtcbiAgLy8kc2NvcGUucmVtb3ZlID0gZnVuY3Rpb24oY2hhdCkge1xuICAvLyAgQ2hhdHMucmVtb3ZlKGNoYXQpO1xuICAvL307XG5cbiAgJHNjb3BlLmRhdGEgPSB7fTtcbiAgJHNjb3BlLmZyaWVuZHMgPSBmcmllbmRzO1xuXG4gIGNvbnNvbGUubG9nKCdmcmllbmRzJyxmcmllbmRzKTtcbiAgLy9UT0RPOiBBZGQgZ2V0RnJpZW5kcyByb3V0ZSBhcyB3ZWxsIGFuZCBzYXZlIHRvIGxvY2FsU3RvcmFnZVxuICAvL0ZyaWVuZHNGYWN0b3J5LmdldEZyaWVuZHMoKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgLy8gIGNvbnNvbGUubG9nKCdyZXNwb25zZS5kYXRhIGZyaWVuZHMnLHJlc3BvbnNlLmRhdGEuZnJpZW5kcyk7XG4gIC8vICAkc2NvcGUuZnJpZW5kcyA9IHJlc3BvbnNlLmRhdGEuZnJpZW5kcztcbiAgLy99KTtcblxuICAkc2NvcGUuYWRkRnJpZW5kID0gZnVuY3Rpb24oKXtcbiAgICBjb25zb2xlLmxvZygnYWRkRnJpZW5kIGNsaWNrZWQnKTtcbiAgICBGcmllbmRzRmFjdG9yeS5hZGRGcmllbmQoJHNjb3BlLmRhdGEudXNlcm5hbWUpLnRoZW4oZnJpZW5kQWRkZWQsIGZyaWVuZE5vdEFkZGVkKTtcbiAgfTtcblxuICBmcmllbmRBZGRlZCA9IGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICBjb25zb2xlLmxvZygnZnJpZW5kQWRkZWQnLHJlc3BvbnNlLmRhdGEuZnJpZW5kKTtcbiAgICAkc2NvcGUuZnJpZW5kcy5wdXNoKHJlc3BvbnNlLmRhdGEuZnJpZW5kKTtcbiAgfTtcblxuICBmcmllbmROb3RBZGRlZCA9IGZ1bmN0aW9uKGVycil7XG4gICAgY29uc29sZS5sb2coZXJyKTtcbiAgfTtcblxuICBHaXN0RmFjdG9yeS5xdWV1ZWRHaXN0cygpLnRoZW4oYWRkU2hhcmVkR2lzdHNUb1Njb3BlKTtcblxuICBmdW5jdGlvbiBhZGRTaGFyZWRHaXN0c1RvU2NvcGUoZ2lzdHMpe1xuICAgIC8vY29uc29sZS5sb2coJ2FkZFNoYXJlZEdpc3RzVG9TY29wZScsZ2lzdHMuZGF0YSk7XG4gICAgJHNjb3BlLmdpc3RzID0gZ2lzdHMuZGF0YTtcbiAgICBGcmllbmRzRmFjdG9yeS5zZXRHaXN0cyhnaXN0cy5kYXRhKTtcbiAgfVxuXG4gICRzY29wZS5zaGFyZWRDb2RlID0gZnVuY3Rpb24oaWQpe1xuICAgIC8vY29uc29sZS5sb2coaWQpOyAvL2lkIG9mIGZyaWVuZCBnaXN0IHNoYXJlZCB3aXRoXG4gICAgJHN0YXRlLmdvKCdjaGF0LWRldGFpbHMnLHtpZDppZH0sIHtpbmhlcml0OmZhbHNlfSk7XG4gIH1cblxufSk7XG5cbmFwcC5jb250cm9sbGVyKCdDaGF0RGV0YWlsQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgJHN0YXRlUGFyYW1zLCBGcmllbmRzRmFjdG9yeSwkaW9uaWNNb2RhbCkge1xuICBjb25zb2xlLmxvZygnc3RhdGVQYXJhbXMnLCRzdGF0ZVBhcmFtcy5pZCwnZ2lzdHMnLEZyaWVuZHNGYWN0b3J5LmdldEdpc3RzKCkpO1xuICAvLyRzY29wZS5jaGF0ID0gQ2hhdHMuZ2V0KCRzdGF0ZVBhcmFtcy5jaGF0SWQpO1xuICAvL1RPRE86IFRoZXNlIGFyZSBhbGwgZ2lzdHMsIHlvdSBuZWVkIHRvIGZpbHRlciBiYXNlZCBvbiB0aGUgdXNlciBiZWZvcmUgcGxhY2Ugb24gc2NvcGUuXG4gICRzY29wZS5naXN0cyA9IFtdO1xuXG4gIC8vJHNjb3BlLmNvZGUgPSAnJztcblxuICB2YXIgYWxsR2lzdHMgPSBGcmllbmRzRmFjdG9yeS5nZXRHaXN0cygpIHx8IFtdO1xuXG4gICRzY29wZS5zaG93Q29kZSA9IGZ1bmN0aW9uKGNvZGUpe1xuICAgIGNvbnNvbGUubG9nKCdzaG93Q29kZScsY29kZSk7XG4gICAgJHNjb3BlLmNvZGUgPSBjb2RlO1xuICAgICRzY29wZS5vcGVuTW9kYWwoY29kZSk7XG4gIH07XG5cbiAgLy9UT0RPOiBPbmx5IHNob3cgYWxsIEdpc3RzIGZyb20gc3BlY2lmaWMgdXNlciBjbGlja2VkIG9uXG4gIC8vVE9ETzogTmVlZCB0byBhcHBseSBKU09OIHBhcnNlXG5cbiAgYWxsR2lzdHMuZm9yRWFjaChmdW5jdGlvbihnaXN0KXtcbiAgICBpZihnaXN0LnVzZXIgPT09ICRzdGF0ZVBhcmFtcy5pZCl7XG4gICAgICAkc2NvcGUuZ2lzdHMucHVzaChnaXN0Lmdpc3QuZmlsZXMuZmlsZU5hbWUuY29udGVudCk7XG4gICAgfVxuICB9KTtcblxuICAkaW9uaWNNb2RhbC5mcm9tVGVtcGxhdGVVcmwoJ2ZlYXR1cmVzL2NoYXRzL2NvZGUtbW9kYWwuaHRtbCcsIHtcbiAgICBzY29wZTogJHNjb3BlLFxuICAgIGFuaW1hdGlvbjogJ3NsaWRlLWluLXVwJ1xuICB9KS50aGVuKGZ1bmN0aW9uKG1vZGFsKSB7XG4gICAgJHNjb3BlLm1vZGFsID0gbW9kYWw7XG4gIH0pO1xuICAkc2NvcGUub3Blbk1vZGFsID0gZnVuY3Rpb24oY29kZSkge1xuICAgIC8vY29uc29sZS5sb2coY29kZSk7XG4gICAgJHNjb3BlLm1vZGFsLnNob3coKTtcbiAgfTtcbiAgJHNjb3BlLmNsb3NlTW9kYWwgPSBmdW5jdGlvbigpIHtcbiAgICAkc2NvcGUubW9kYWwuaGlkZSgpO1xuICB9O1xuICAvL0NsZWFudXAgdGhlIG1vZGFsIHdoZW4gd2UncmUgZG9uZSB3aXRoIGl0IVxuICAkc2NvcGUuJG9uKCckZGVzdHJveScsIGZ1bmN0aW9uKCkge1xuICAgICRzY29wZS5tb2RhbC5yZW1vdmUoKTtcbiAgfSk7XG4gIC8vIEV4ZWN1dGUgYWN0aW9uIG9uIGhpZGUgbW9kYWxcbiAgJHNjb3BlLiRvbignbW9kYWwuaGlkZGVuJywgZnVuY3Rpb24oKSB7XG4gICAgLy8gRXhlY3V0ZSBhY3Rpb25cbiAgfSk7XG4gIC8vIEV4ZWN1dGUgYWN0aW9uIG9uIHJlbW92ZSBtb2RhbFxuICAkc2NvcGUuJG9uKCdtb2RhbC5yZW1vdmVkJywgZnVuY3Rpb24oKSB7XG4gICAgLy8gRXhlY3V0ZSBhY3Rpb25cbiAgfSk7XG4gIC8vJHNjb3BlLmdpc3RzID0gRnJpZW5kc0ZhY3RvcnkuZ2V0R2lzdHMoKTtcblxufSk7XG5cbmFwcC5mYWN0b3J5KCdDaGF0cycsIGZ1bmN0aW9uKCkge1xuICAvLyBNaWdodCB1c2UgYSByZXNvdXJjZSBoZXJlIHRoYXQgcmV0dXJucyBhIEpTT04gYXJyYXlcblxuICAvLyBTb21lIGZha2UgdGVzdGluZyBkYXRhXG4gIHZhciBjaGF0cyA9IFt7XG4gICAgaWQ6IDAsXG4gICAgbmFtZTogJ0JlbiBTcGFycm93JyxcbiAgICBsYXN0VGV4dDogJ1lvdSBvbiB5b3VyIHdheT8nLFxuICAgIGZhY2U6ICdodHRwczovL3Bicy50d2ltZy5jb20vcHJvZmlsZV9pbWFnZXMvNTE0NTQ5ODExNzY1MjExMTM2LzlTZ0F1SGVZLnBuZydcbiAgfSwge1xuICAgIGlkOiAxLFxuICAgIG5hbWU6ICdNYXggTHlueCcsXG4gICAgbGFzdFRleHQ6ICdIZXksIGl0XFwncyBub3QgbWUnLFxuICAgIGZhY2U6ICdodHRwczovL2F2YXRhcnMzLmdpdGh1YnVzZXJjb250ZW50LmNvbS91LzExMjE0P3Y9MyZzPTQ2MCdcbiAgfSx7XG4gICAgaWQ6IDIsXG4gICAgbmFtZTogJ0FkYW0gQnJhZGxleXNvbicsXG4gICAgbGFzdFRleHQ6ICdJIHNob3VsZCBidXkgYSBib2F0JyxcbiAgICBmYWNlOiAnaHR0cHM6Ly9wYnMudHdpbWcuY29tL3Byb2ZpbGVfaW1hZ2VzLzQ3OTA5MDc5NDA1ODM3OTI2NC84NFRLal9xYS5qcGVnJ1xuICB9LCB7XG4gICAgaWQ6IDMsXG4gICAgbmFtZTogJ1BlcnJ5IEdvdmVybm9yJyxcbiAgICBsYXN0VGV4dDogJ0xvb2sgYXQgbXkgbXVrbHVrcyEnLFxuICAgIGZhY2U6ICdodHRwczovL3Bicy50d2ltZy5jb20vcHJvZmlsZV9pbWFnZXMvNDkxOTk1Mzk4MTM1NzY3MDQwL2llMlpfVjZlLmpwZWcnXG4gIH0sIHtcbiAgICBpZDogNCxcbiAgICBuYW1lOiAnTWlrZSBIYXJyaW5ndG9uJyxcbiAgICBsYXN0VGV4dDogJ1RoaXMgaXMgd2lja2VkIGdvb2QgaWNlIGNyZWFtLicsXG4gICAgZmFjZTogJ2h0dHBzOi8vcGJzLnR3aW1nLmNvbS9wcm9maWxlX2ltYWdlcy81NzgyMzcyODEzODQ4NDEyMTYvUjNhZTFuNjEucG5nJ1xuICB9XTtcblxuICByZXR1cm4ge1xuICAgIGFsbDogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gY2hhdHM7XG4gICAgfSxcbiAgICByZW1vdmU6IGZ1bmN0aW9uKGNoYXQpIHtcbiAgICAgIGNoYXRzLnNwbGljZShjaGF0cy5pbmRleE9mKGNoYXQpLCAxKTtcbiAgICB9LFxuICAgIGdldDogZnVuY3Rpb24oY2hhdElkKSB7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoYXRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChjaGF0c1tpXS5pZCA9PT0gcGFyc2VJbnQoY2hhdElkKSkge1xuICAgICAgICAgIHJldHVybiBjaGF0c1tpXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICB9O1xufSk7XG5cbmFwcC5mYWN0b3J5KCdGcmllbmRzRmFjdG9yeScsZnVuY3Rpb24oJGh0dHAsJHEsQXBpRW5kcG9pbnQpe1xuICAvL2dldCB1c2VyIHRvIGFkZCBhbmQgcmVzcG9uZCB0byB1c2VyXG4gIHZhciBhbGxHaXN0cyA9IFtdO1xuICB2YXIgYWRkRnJpZW5kID0gZnVuY3Rpb24oZnJpZW5kKXtcbiAgICAvL2NvbnNvbGUubG9nKGZyaWVuZCk7XG4gICAgcmV0dXJuICRodHRwLnBvc3QoQXBpRW5kcG9pbnQudXJsK1wiL3VzZXIvYWRkRnJpZW5kXCIse2ZyaWVuZDpmcmllbmR9KTtcbiAgfTtcblxuICB2YXIgZ2V0RnJpZW5kcyA9IGZ1bmN0aW9uKCl7XG4gICAgLy9jb25zb2xlLmxvZygnZ2V0RnJpZW5kcyBjYWxsZWQnKVxuICAgIHJldHVybiAkaHR0cC5nZXQoQXBpRW5kcG9pbnQudXJsICsgXCIvdXNlci9nZXRGcmllbmRzXCIpO1xuICB9O1xuXG5cbiAgLy9UT0RPOiBSZW1vdmUgR2lzdHMgZnJvbSBGcmllbmRzRmFjdG9yeSAtIHNob3VsZCBiZSBpbiBnaXN0IGZhY3RvcnkgYW5kIGxvYWRlZCBvbiBzdGFydFxuICAvL1RPRE86IFlvdSBuZWVkIHRvIHJlZmFjdG9yIGJlY2F1c2UgeW91IG1heSBlbmQgdXAgb24gYW55IHBhZ2Ugd2l0aG91dCBhbnkgZGF0YSBiZWNhdXNlIGl0IHdhcyBub3QgYXZhaWxhYmxlIGluIHRoZSBwcmV2aW91cyBwYWdlICh0aGUgcHJldmlvdXMgcGFnZSB3YXMgbm90IGxvYWRlZClcbiAgdmFyIHNldEdpc3RzID0gZnVuY3Rpb24oZ2lzdHMpe1xuICAgIC8vY29uc29sZS5sb2coJ3NldEdpc3RzJyk7XG4gICAgYWxsR2lzdHMgPSBnaXN0cztcbiAgfTtcblxuICB2YXIgZ2V0R2lzdHMgPSBmdW5jdGlvbigpe1xuICAgIGNvbnNvbGUubG9nKCdhbGxHaXN0cycsYWxsR2lzdHMpO1xuICAgIHJldHVybiBhbGxHaXN0cy5naXN0cztcbiAgfTtcblxuICByZXR1cm4ge1xuICAgIGFkZEZyaWVuZDogYWRkRnJpZW5kLFxuICAgIGdldEZyaWVuZHM6IGdldEZyaWVuZHMsXG4gICAgZ2V0R2lzdHM6IGdldEdpc3RzLFxuICAgIHNldEdpc3RzOiBzZXRHaXN0c1xuICB9O1xuXG4gIC8vVE9ETzogVXNlciBpcyBub3QgbG9nZ2VkIGluLCBzbyB5b3UgY2Fubm90IGFkZCBhIGZyaWVuZFxufSk7XG4iLCJhcHAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKXtcblx0JHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2V4ZXJjaXNlJyx7XG5cdFx0dXJsOiAnL2V4ZXJjaXNlLzpzbHVnJyxcblx0XHRhYnN0cmFjdDogdHJ1ZSxcblx0XHR0ZW1wbGF0ZVVybCA6ICdmZWF0dXJlcy9leGVyY2lzZS9leGVyY2lzZS5odG1sJ1xuXHR9KTtcbn0pO1xuXG5hcHAuZmFjdG9yeSgnRXhlcmNpc2VGYWN0b3J5JywgZnVuY3Rpb24oKXtcblxufSk7IiwiYXBwLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlcil7XG5cdCRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdleGVyY2lzZS5jb2RlJywge1xuXHRcdHVybCA6ICcvZXhlcmNpc2UvOnNsdWcvY29kZScsXG5cdFx0dmlld3MgOiB7XG5cdFx0XHQndGFiLWNvZGUnIDoge1xuXHRcdFx0XHR0ZW1wbGF0ZVVybCA6ICdmZWF0dXJlcy9leGVyY2lzZS1jb2RlL2V4ZXJjaXNlLWNvZGUuaHRtbCcsXG5cdFx0XHRcdGNvbnRyb2xsZXI6ICdFeGVyY2lzZUNvZGVDdHJsJ1xuXHRcdFx0fVxuXHRcdH1cblx0fSk7XG59KTtcblxuYXBwLmNvbnRyb2xsZXIoJ0V4ZXJjaXNlQ29kZUN0cmwnLCBmdW5jdGlvbigkc2NvcGUpe1xufSk7IiwiYXBwLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlcil7XG5cdCRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdleGVyY2lzZS5jb21waWxlJywge1xuXHRcdHVybCA6ICcvZXhlcmNpc2UvOnNsdWcvY29tcGlsZScsXG5cdFx0dmlld3MgOiB7XG5cdFx0XHQndGFiLWNvbXBpbGUnIDoge1xuXHRcdFx0XHR0ZW1wbGF0ZVVybCA6ICdmZWF0dXJlcy9leGVyY2lzZS1jb21waWxlL2V4ZXJjaXNlLWNvbXBpbGUuaHRtbCcsXG5cdFx0XHRcdGNvbnRyb2xsZXI6ICdFeGVyY2lzZUNvbXBpbGVDdHJsJ1xuXHRcdFx0fVxuXHRcdH1cblx0fSk7XG59KTtcblxuYXBwLmNvbnRyb2xsZXIoJ0V4ZXJjaXNlQ29tcGlsZUN0cmwnLCBmdW5jdGlvbigkc2NvcGUpe1xuXG59KTsiLCJhcHAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKXtcblx0JHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2V4ZXJjaXNlLnRlc3QnLCB7XG5cdFx0dXJsIDogJy9leGVyY2lzZS86c2x1Zy90ZXN0Jyxcblx0XHR2aWV3cyA6IHtcblx0XHRcdCd0YWItdGVzdCcgOiB7XG5cdFx0XHRcdHRlbXBsYXRlVXJsIDogJ2ZlYXR1cmVzL2V4ZXJjaXNlLXRlc3QvZXhlcmNpc2UtdGVzdC5odG1sJyxcblx0XHRcdFx0Y29udHJvbGxlcjogJ0V4ZXJjaXNlVGVzdEN0cmwnXG5cdFx0XHR9XG5cdFx0fVxuXHR9KTtcbn0pO1xuXG5hcHAuY29udHJvbGxlcignRXhlcmNpc2VUZXN0Q3RybCcsIGZ1bmN0aW9uKCRzY29wZSl7XG5cbn0pOyIsImFwcC5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIpe1xuXHQkc3RhdGVQcm92aWRlci5zdGF0ZSgnZXhlcmNpc2UudmlldycsIHtcblx0XHR1cmwgOiAnL2V4ZXJjaXNlLzpzbHVnL3ZpZXcnLFxuXHRcdHZpZXdzIDoge1xuXHRcdFx0J3RhYi12aWV3JyA6IHtcblx0XHRcdFx0dGVtcGxhdGVVcmwgOiAnZmVhdHVyZXMvZXhlcmNpc2Utdmlldy9leGVyY2lzZS12aWV3Lmh0bWwnLFxuXHRcdFx0XHRjb250cm9sbGVyOiAnRXhlcmNpc2VWaWV3Q3RybCdcblx0XHRcdH1cblx0XHR9XG5cdH0pO1xufSk7XG5cbmFwcC5jb250cm9sbGVyKCdFeGVyY2lzZVZpZXdDdHJsJywgZnVuY3Rpb24oJHNjb3BlKXtcblxufSk7IiwiYXBwLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlcil7XG5cdCRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdleGVyY2lzZS52aWV3LWVkaXQnLCB7XG5cdFx0dXJsIDogJy9leGVyY2lzZS86c2x1Zy92aWV3L2VkaXQnLFxuXHRcdHZpZXdzIDoge1xuXHRcdFx0J3RhYi12aWV3JyA6IHtcblx0XHRcdFx0dGVtcGxhdGVVcmwgOiAnZmVhdHVyZXMvZXhlcmNpc2Utdmlldy1lZGl0L2V4ZXJjaXNlLXZpZXctZWRpdC5odG1sJyxcblx0XHRcdFx0Y29udHJvbGxlcjogJ0V4ZXJjaXNlVmlld0VkaXRDdHJsJ1xuXHRcdFx0fVxuXHRcdH1cblx0fSk7XG59KTtcblxuYXBwLmNvbnRyb2xsZXIoJ0V4ZXJjaXNlVmlld0VkaXRDdHJsJywgZnVuY3Rpb24oJHNjb3BlKXtcblxufSk7IiwiYXBwLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlcil7XG5cdCRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdleGVyY2lzZXMnLCB7XG5cdFx0dXJsIDogJy9leGVyY2lzZXMnLFxuXHRcdHRlbXBsYXRlVXJsIDogJ2ZlYXR1cmVzL2V4ZXJjaXNlcy9leGVyY2lzZXMuaHRtbCcsXG5cdFx0Y29udHJvbGxlcjogJ0V4ZXJjaXNlc0N0cmwnXG5cdH0pO1xufSk7XG5cbmFwcC5jb250cm9sbGVyKCdFeGVyY2lzZXNDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCAkc3RhdGUpe1xuXHQkc2NvcGUuY3JlYXRlID0gZnVuY3Rpb24oKXtcblx0XHQkc3RhdGUuZ28oJ2V4ZXJjaXNlcy1jcmVhdGUnKTtcblx0fTtcbn0pO1xuXG5hcHAuZmFjdG9yeSgnRXhlcmNpc2VGYWN0b3J5JywgZnVuY3Rpb24oJGxvY2Fsc3RvcmFnZSl7XG5cdHZhciBleGVyY2lzZXMgPSAkbG9jYWxzdG9yYWdlLmdldE9iamVjdCgnZXhlcmNpc2VzJyk7XG5cdGlmKHdpbmRvdy5fLmlzRW1wdHkoZXhlcmNpc2VzKSkgZXhlcmNpc2VzID0gW107XG5cblx0cmV0dXJuIHtcblx0XHRnZXRFeGVyY2lzZXMgOiBmdW5jdGlvbigpe1xuXHRcdFx0cmV0dXJuIGV4ZXJjaXNlcztcblx0XHR9LFxuXHRcdGNyZWF0ZUV4ZXJjaXNlIDogZnVuY3Rpb24oZXhlcmNpc2Upe1xuXHRcdFx0ZXhlcmNpc2VzLnB1c2goZXhlcmNpc2UpO1xuXHRcdFx0JGxvY2Fsc3RvcmFnZS5zZXRPYmplY3QoZXhlcmNpc2VzKTtcblx0XHR9LFxuXHRcdGdldEV4ZXJjaXNlIDogZnVuY3Rpb24oc2x1Zyl7XG5cdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGV4ZXJjaXNlcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRpZiAoZXhlcmNpc2VzW2ldLnNsdWcgPT09IHNsdWcpIHJldHVybiBleGVyY2lzZXNbaV07XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4ge307XG5cdFx0fSxcblx0XHR1cGRhdGVFeGVyY2lzZSA6IGZ1bmN0aW9uKGV4ZXJjaXNlKXtcblx0XHRcdGZvcih2YXIgaSA9IDA7IGkgPCBleGVyY2lzZXMubGVuZ3RoOyBpKyspe1xuXG5cdFx0XHR9XG5cdFx0fSxcblx0XHRkZWxldGVFeGVyY2lzZSA6IGZ1bmN0aW9uKCl7XG5cblx0XHR9XG5cdH07XG59KTsiLCJhcHAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKXtcblx0JHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2V4ZXJjaXNlcy1jcmVhdGUnLCB7XG5cdFx0dXJsIDogJy9leGVyY2lzZXMvY3JlYXRlJyxcblx0XHR0ZW1wbGF0ZVVybCA6ICdmZWF0dXJlcy9leGVyY2lzZXMtY3JlYXRlL2V4ZXJjaXNlcy1jcmVhdGUuaHRtbCcsXG5cdFx0Y29udHJvbGxlcjogJ0V4ZXJjaXNlc0NyZWF0ZUN0cmwnXG5cdH0pO1xufSk7XG5cbmFwcC5jb250cm9sbGVyKCdFeGVyY2lzZXNDcmVhdGVDdHJsJywgZnVuY3Rpb24oJHNjb3BlKXtcblxufSk7IiwiYXBwLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlcil7XG5cdCRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdleGVyY2lzbScsIHtcblx0XHR0ZW1wbGF0ZVVybCA6ICdmZWF0dXJlcy9leGVyY2lzbS9leGVyY2lzbS5odG1sJyxcblx0XHRhYnN0cmFjdCA6IHRydWUsXG5cdFx0cmVzb2x2ZSA6IHtcblx0XHRcdG1hcmtkb3duIDogZnVuY3Rpb24oQXZhaWxhYmxlRXhlcmNpc2VzLCBFeGVyY2lzbUZhY3RvcnksICRzdGF0ZSl7XG5cblx0XHRcdFx0aWYoRXhlcmNpc21GYWN0b3J5LmdldFRlc3RTY3JpcHQoKS5sZW5ndGggPT09IDApIHtcblx0XHRcdFx0XHR2YXIgZXhlcmNpc2UgPSBBdmFpbGFibGVFeGVyY2lzZXMuZ2V0UmFuZG9tRXhlcmNpc2UoKTtcblx0XHRcdFx0XHRFeGVyY2lzbUZhY3Rvcnkuc2V0TmFtZShleGVyY2lzZS5uYW1lKTtcblx0XHRcdFx0XHRyZXR1cm4gRXhlcmNpc21GYWN0b3J5LmdldEV4dGVybmFsU2NyaXB0KGV4ZXJjaXNlLmxpbmspLnRoZW4oZnVuY3Rpb24oZGF0YSl7XG5cdFx0XHRcdFx0XHRyZXR1cm4gRXhlcmNpc21GYWN0b3J5LmdldEV4dGVybmFsTWQoZXhlcmNpc2UubWRMaW5rKTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0fVxuXHR9KTtcbn0pO1xuXG5hcHAuZmFjdG9yeSgnRXhlcmNpc21GYWN0b3J5JywgZnVuY3Rpb24oJGh0dHAsICRyb290U2NvcGUpe1xuXHR2YXIgbmFtZSA9ICcnO1xuXHR2YXIgdGVzdCA9ICcnO1xuXHR2YXIgY29kZSA9ICcnO1xuXHR2YXIgbWFya2Rvd24gPSAnJztcblxuXHRyZXR1cm4ge1xuXHRcdGdldEV4dGVybmFsU2NyaXB0IDogZnVuY3Rpb24obGluayl7XG5cdFx0XHRyZXR1cm4gJGh0dHAuZ2V0KGxpbmspLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuXHRcdFx0XHR0ZXN0ID0gcmVzcG9uc2UuZGF0YTtcblx0XHRcdFx0cmV0dXJuIHJlc3BvbnNlLmRhdGE7XG5cdFx0XHR9KTtcblx0XHR9LFxuXHRcdGdldEV4dGVybmFsTWQgOiBmdW5jdGlvbihsaW5rKXtcblx0XHRcdHJldHVybiAkaHR0cC5nZXQobGluaykudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG5cdFx0XHRcdG1hcmtkb3duID0gcmVzcG9uc2UuZGF0YTtcblx0XHRcdFx0cmV0dXJuIHJlc3BvbnNlLmRhdGE7XG5cdFx0XHR9KTtcblx0XHR9LFxuXHRcdHNldE5hbWUgOiBmdW5jdGlvbihzZXROYW1lKXtcblx0XHRcdG5hbWUgPSBzZXROYW1lO1xuXHRcdH0sXG5cdFx0c2V0VGVzdFNjcmlwdCA6IGZ1bmN0aW9uKHRlc3Qpe1xuXHRcdFx0dGVzdCA9IHRlc3Q7XG5cdFx0XHQkcm9vdFNjb3BlLiRicm9hZGNhc3QoJ3Rlc3RDaGFuZ2UnLCB0ZXN0KTtcblx0XHR9LFxuXHRcdHNldENvZGVTY3JpcHQgOiBmdW5jdGlvbiAoY29kZSl7XG5cdFx0XHRjb2RlID0gY29kZTtcblx0XHRcdCRyb290U2NvcGUuJGJyb2FkY2FzdCgnY29kZUNoYW5nZScsIGNvZGUpO1xuXHRcdH0sXG5cdFx0Z2V0VGVzdFNjcmlwdCA6IGZ1bmN0aW9uKCl7XG5cdFx0XHRyZXR1cm4gdGVzdDtcblx0XHR9LFxuXHRcdGdldENvZGVTY3JpcHQgOiBmdW5jdGlvbigpe1xuXHRcdFx0cmV0dXJuIGNvZGU7XG5cdFx0fSxcblx0XHRnZXRNYXJrZG93biA6IGZ1bmN0aW9uKCl7XG5cdFx0XHRyZXR1cm4gbWFya2Rvd247XG5cdFx0fSxcblx0XHRnZXROYW1lIDogZnVuY3Rpb24oKXtcblx0XHRcdHJldHVybiBuYW1lO1xuXHRcdH1cblx0fTtcbn0pO1xuXG5hcHAuZmFjdG9yeSgnQXZhaWxhYmxlRXhlcmNpc2VzJywgZnVuY3Rpb24oKXtcblxuXHR2YXIgbGlicmFyeSA9IFtcblx0XHQnYWNjdW11bGF0ZScsXG5cdFx0J2FsbGVyZ2llcycsXG5cdFx0J2FuYWdyYW0nLFxuXHRcdCdhdGJhc2gtY2lwaGVyJyxcblx0XHQnYmVlci1zb25nJyxcblx0XHQnYmluYXJ5Jyxcblx0XHQnYmluYXJ5LXNlYXJjaC10cmVlJyxcblx0XHQnYm9iJyxcblx0XHQnYnJhY2tldC1wdXNoJyxcblx0XHQnY2lyY3VsYXItYnVmZmVyJyxcblx0XHQnY2xvY2snLFxuXHRcdCdjcnlwdG8tc3F1YXJlJyxcblx0XHQnY3VzdG9tLXNldCcsXG5cdFx0J2RpZmZlcmVuY2Utb2Ytc3F1YXJlcycsXG5cdFx0J2V0bCcsXG5cdFx0J2Zvb2QtY2hhaW4nLFxuXHRcdCdnaWdhc2Vjb25kJyxcblx0XHQnZ3JhZGUtc2Nob29sJyxcblx0XHQnZ3JhaW5zJyxcblx0XHQnaGFtbWluZycsXG5cdFx0J2hlbGxvLXdvcmxkJyxcblx0XHQnaGV4YWRlY2ltYWwnXG5cdF07XG5cblx0dmFyIGdlbmVyYXRlTGluayA9IGZ1bmN0aW9uKG5hbWUpe1xuXHRcdHJldHVybiAnZXhlcmNpc20vamF2YXNjcmlwdC8nICsgbmFtZSArICcvJyArIG5hbWUgKyAnX3Rlc3Quc3BlYy5qcyc7XG5cdH07XG5cblx0dmFyIGdlbmVyYXRlTWRMaW5rID0gZnVuY3Rpb24obmFtZSl7XG5cdFx0cmV0dXJuICdleGVyY2lzbS9qYXZhc2NyaXB0LycgKyBuYW1lICsgJy8nICsgbmFtZSArICcubWQnO1xuXHR9O1xuXG5cdHZhciBnZW5lcmF0ZVJhbmRvbSA9IGZ1bmN0aW9uKCl7XG5cdFx0dmFyIHJhbmRvbSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGxpYnJhcnkubGVuZ3RoKTtcblx0XHRyZXR1cm4gbGlicmFyeVtyYW5kb21dO1xuXHR9O1xuXG5cdHJldHVybiB7XG5cdFx0Z2V0U3BlY2lmaWNFeGVyY2lzZSA6IGZ1bmN0aW9uKG5hbWUpe1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0bGluayA6IGdlbmVyYXRlTGluayhuYW1lKSxcblx0XHRcdFx0bWRMaW5rIDogZ2VuZXJhdGVNZExpbmsobmFtZSlcblx0XHRcdH07XG5cdFx0fSxcblx0XHRnZXRSYW5kb21FeGVyY2lzZSA6IGZ1bmN0aW9uKCl7XG5cdFx0XHR2YXIgbmFtZSA9IGdlbmVyYXRlUmFuZG9tKCk7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRuYW1lIDogbmFtZSxcblx0XHRcdFx0bGluayA6IGdlbmVyYXRlTGluayhuYW1lKSxcblx0XHRcdFx0bWRMaW5rIDogZ2VuZXJhdGVNZExpbmsobmFtZSlcblx0XHRcdH07XG5cdFx0fVxuXHR9O1xufSk7IiwiYXBwLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlcil7XG5cdCRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdleGVyY2lzbS5jb2RlJywge1xuXHRcdHVybCA6ICcvZXhlcmNpc20vY29kZScsXG5cdFx0dmlld3MgOiB7XG5cdFx0XHQndGFiLWNvZGUnIDoge1xuXHRcdFx0XHR0ZW1wbGF0ZVVybCA6ICdmZWF0dXJlcy9leGVyY2lzbS1jb2RlL2V4ZXJjaXNtLWNvZGUuaHRtbCcsXG5cdFx0XHRcdGNvbnRyb2xsZXI6ICdFeGVyY2lzbUNvZGVDdHJsJ1xuXHRcdFx0fVxuXHRcdH1cblx0fSk7XG59KTtcblxuYXBwLmNvbnRyb2xsZXIoJ0V4ZXJjaXNtQ29kZUN0cmwnLCBmdW5jdGlvbigkc2NvcGUsIEV4ZXJjaXNtRmFjdG9yeSwgJHN0YXRlLCBLZXlib2FyZEZhY3Rvcnkpe1xuXHQkc2NvcGUubmFtZSA9IEV4ZXJjaXNtRmFjdG9yeS5nZXROYW1lKCk7XG5cdCRzY29wZS5jb2RlID0ge1xuXHRcdHRleHQgOiBudWxsXG5cdH07XG5cblx0JHNjb3BlLmNvZGUudGV4dCA9IEV4ZXJjaXNtRmFjdG9yeS5nZXRDb2RlU2NyaXB0KCk7XG5cdC8vZG9lc24ndCBkbyBhbnl0aGluZyByaWdodCBub3cgLSBtYXliZSBwdWxsIHByZXZpb3VzbHkgc2F2ZWQgY29kZVxuXG5cdC8vcGFzc2luZyB0aGlzIHVwZGF0ZSBmdW5jdGlvbiBzbyB0aGF0IG9uIHRleHQgY2hhbmdlIGluIHRoZSBkaXJlY3RpdmUgdGhlIGZhY3Rvcnkgd2lsbCBiZSBhbGVydGVkXG5cdCRzY29wZS5jb21waWxlID0gZnVuY3Rpb24oY29kZSl7XG5cdFx0RXhlcmNpc21GYWN0b3J5LnNldENvZGVTY3JpcHQoY29kZSk7XG5cdFx0JHN0YXRlLmdvKCdleGVyY2lzbS5jb21waWxlJyk7XG5cdH07XG5cblx0JHNjb3BlLmluc2VydEZ1bmMgPSBLZXlib2FyZEZhY3RvcnkubWFrZUluc2VydEZ1bmMoJHNjb3BlKTtcblxufSk7IiwiYXBwLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlcil7XG5cdCRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdleGVyY2lzbS5jb21waWxlJywge1xuXHRcdHVybCA6ICcvZXhlcmNpc20vY29tcGlsZScsXG5cdFx0dmlld3MgOiB7XG5cdFx0XHQndGFiLWNvbXBpbGUnIDoge1xuXHRcdFx0XHR0ZW1wbGF0ZVVybCA6ICdmZWF0dXJlcy9leGVyY2lzbS1jb21waWxlL2V4ZXJjaXNtLWNvbXBpbGUuaHRtbCcsXG5cdFx0XHRcdGNvbnRyb2xsZXI6ICdFeGVyY2lzbUNvbXBpbGVDdHJsJ1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0b25FbnRlciA6IGZ1bmN0aW9uKCl7XG5cdFx0XHRpZih3aW5kb3cuamFzbWluZSkgd2luZG93Lmphc21pbmUuZ2V0RW52KCkuZXhlY3V0ZSgpO1xuXHRcdH1cblx0fSk7XG59KTtcblxuYXBwLmNvbnRyb2xsZXIoJ0V4ZXJjaXNtQ29tcGlsZUN0cmwnLCBmdW5jdGlvbigkc2NvcGUsIEV4ZXJjaXNtRmFjdG9yeSl7XG5cdCRzY29wZS5uYW1lID0gRXhlcmNpc21GYWN0b3J5LmdldE5hbWUoKTtcblx0JHNjb3BlLmNvbXBpbGluZyA9IHtcblx0XHR0ZXN0OiBudWxsLFxuXHRcdGNvZGUgOiBudWxsXG5cdH07XG5cdCRzY29wZS5jb21waWxpbmcudGVzdCA9IEV4ZXJjaXNtRmFjdG9yeS5nZXRUZXN0U2NyaXB0KCk7XG5cdCRzY29wZS5jb21waWxpbmcuY29kZSA9IEV4ZXJjaXNtRmFjdG9yeS5nZXRDb2RlU2NyaXB0KCk7XG5cblxuXHQkc2NvcGUuJG9uKCd0ZXN0Q2hhbmdlJywgZnVuY3Rpb24oZXZlbnQsIGRhdGEpe1xuXHRcdCRzY29wZS5jb21waWxpbmcudGVzdCA9IGRhdGE7XG5cdH0pO1xuXG5cdCRzY29wZS4kb24oJ2NvZGVDaGFuZ2UnLCBmdW5jdGlvbihldmVudCwgZGF0YSl7XG5cdFx0JHNjb3BlLmNvbXBpbGluZy5jb2RlID0gZGF0YTtcblx0fSk7XG59KTsiLCJhcHAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKXtcblx0JHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2V4ZXJjaXNtLnRlc3QnLCB7XG5cdFx0dXJsIDogJy9leGVyY2lzbS90ZXN0Jyxcblx0XHR2aWV3cyA6IHtcblx0XHRcdCd0YWItdGVzdCcgOiB7XG5cdFx0XHRcdHRlbXBsYXRlVXJsIDogJ2ZlYXR1cmVzL2V4ZXJjaXNtLXRlc3QvZXhlcmNpc20tdGVzdC5odG1sJyxcblx0XHRcdFx0Y29udHJvbGxlciA6ICdFeGVyY2lzbVRlc3RDdHJsJ1xuXHRcdFx0fVxuXHRcdH1cblx0fSk7XG59KTtcblxuYXBwLmNvbnRyb2xsZXIoJ0V4ZXJjaXNtVGVzdEN0cmwnLCBmdW5jdGlvbigkc2NvcGUsIEV4ZXJjaXNtRmFjdG9yeSl7XG5cblx0JHNjb3BlLm5hbWUgPSBFeGVyY2lzbUZhY3RvcnkuZ2V0TmFtZSgpO1xuXG5cdCRzY29wZS50ZXN0ID0ge1xuXHRcdHRleHQ6IG51bGxcblx0fTtcblxuXHQkc2NvcGUudGVzdC50ZXh0ID0gRXhlcmNpc21GYWN0b3J5LmdldFRlc3RTY3JpcHQoKTtcblxuXHQkc2NvcGUuJHdhdGNoKCd0ZXN0LnRleHQnLCBmdW5jdGlvbihuZXdWYWx1ZSl7XG5cdFx0RXhlcmNpc21GYWN0b3J5LnNldFRlc3RTY3JpcHQobmV3VmFsdWUpO1xuXHR9KTtcbn0pOyIsImFwcC5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIpe1xuXHQkc3RhdGVQcm92aWRlci5zdGF0ZSgnZXhlcmNpc20udmlldycsIHtcblx0XHR1cmw6ICcvZXhlcmNpc20vdmlldycsXG5cdFx0dmlld3M6IHtcblx0XHRcdCd0YWItdmlldycgOiB7XG5cdFx0XHRcdHRlbXBsYXRlVXJsOiAnZmVhdHVyZXMvZXhlcmNpc20tdmlldy9leGVyY2lzbS12aWV3Lmh0bWwnLFxuXHRcdFx0XHRjb250cm9sbGVyOiAnRXhlcmNpc21WaWV3Q3RybCdcblx0XHRcdH1cblx0XHR9XG5cdH0pO1xufSk7XG5cbmFwcC5jb250cm9sbGVyKCdFeGVyY2lzbVZpZXdDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBFeGVyY2lzbUZhY3Rvcnkpe1xuXHQkc2NvcGUubWFya2Rvd24gPSBFeGVyY2lzbUZhY3RvcnkuZ2V0TWFya2Rvd24oKTtcblx0JHNjb3BlLm5hbWUgPSBFeGVyY2lzbUZhY3RvcnkuZ2V0TmFtZSgpO1xufSk7IiwiYXBwLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlcil7XG5cdCRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdsb2dpbicsIHtcblx0XHR1cmwgOiAnL2xvZ2luJyxcblx0XHR0ZW1wbGF0ZVVybCA6ICdmZWF0dXJlcy9sb2dpbi9sb2dpbi5odG1sJyxcblx0XHRjb250cm9sbGVyIDogJ0xvZ2luQ3RybCdcblx0fSk7XG59KTtcblxuYXBwLmNvbnRyb2xsZXIoJ0xvZ2luQ3RybCcsIGZ1bmN0aW9uKCRyb290U2NvcGUsICRzY29wZSwgJGlvbmljUG9wdXAsICRzdGF0ZSwgQXV0aFNlcnZpY2Upe1xuXHQkc2NvcGUuZGF0YSA9IHt9O1xuXHQkc2NvcGUuZXJyb3IgPSBudWxsO1xuXG4gICAgJHNjb3BlLnNpZ251cCA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICRzdGF0ZS5nbygnc2lnbnVwJyk7XG4gICAgfTtcblxuXHQkc2NvcGUubG9naW4gPSBmdW5jdGlvbigpe1xuXHRcdEF1dGhTZXJ2aWNlXG5cdFx0XHQubG9naW4oJHNjb3BlLmRhdGEpXG5cdFx0XHQudGhlbihmdW5jdGlvbihhdXRoZW50aWNhdGVkKXsgLy9UT0RPOmF1dGhlbnRpY2F0ZWQgaXMgd2hhdCBpcyByZXR1cm5lZFxuXHRcdFx0XHQvL2NvbnNvbGUubG9nKCdsb2dpbiwgdGFiLmNoYWxsZW5nZS1zdWJtaXQnKTtcblx0XHRcdFx0Ly8kc2NvcGUubWVudSA9IHRydWU7XG5cdFx0XHRcdCRyb290U2NvcGUuJGJyb2FkY2FzdCgnQXV0aCcpO1xuXHRcdFx0XHQkc2NvcGUuc3RhdGVzLnB1c2goeyAvL1RPRE86IE5lZWQgdG8gYWRkIGEgcGFyZW50IGNvbnRyb2xsZXIgdG8gY29tbXVuaWNhdGVcblx0XHRcdFx0XHRuYW1lOiAnTG9nb3V0Jyxcblx0XHRcdFx0XHRyZWY6IGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0XHRBdXRoU2VydmljZS5sb2dvdXQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5kYXRhID0ge307XG5cdFx0XHRcdFx0XHQkc2NvcGUuc3RhdGVzLnBvcCgpOyAvL1RPRE86IEZpbmQgYSBiZXR0ZXIgd2F5IHRvIHJlbW92ZSB0aGUgTG9nb3V0IGxpbmssIGluc3RlYWQgb2YgcG9wXG5cdFx0XHRcdFx0XHQkc3RhdGUuZ28oJ3NpZ251cCcpO1xuXHRcdFx0XHRcdFx0JHJvb3RTY29wZS4kYnJvYWRjYXN0KCdBdXRoJyk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdFx0JHN0YXRlLmdvKCdleGVyY2lzbS52aWV3Jyk7XG5cdFx0XHRcdC8vVE9ETzogV2UgY2FuIHNldCB0aGUgdXNlciBuYW1lIGhlcmUgYXMgd2VsbC4gVXNlZCBpbiBjb25qdW5jdGlvbiB3aXRoIGEgbWFpbiBjdHJsXG5cdFx0XHR9KVxuXHRcdFx0LmNhdGNoKGZ1bmN0aW9uKGVycil7XG5cdFx0XHRcdCRzY29wZS5lcnJvciA9ICdMb2dpbiBJbnZhbGlkJztcblx0XHRcdFx0Y29uc29sZS5lcnJvcihKU09OLnN0cmluZ2lmeShlcnIpKVxuXHRcdFx0XHR2YXIgYWxlcnRQb3B1cCA9ICRpb25pY1BvcHVwLmFsZXJ0KHtcblx0XHRcdFx0XHR0aXRsZTogJ0xvZ2luIGZhaWxlZCEnLFxuXHRcdFx0XHRcdHRlbXBsYXRlOiAnUGxlYXNlIGNoZWNrIHlvdXIgY3JlZGVudGlhbHMhJ1xuXHRcdFx0XHR9KTtcblx0XHRcdH0pO1xuXHR9O1xufSk7XG5cblxuLy9UT0RPOiBDbGVhbnVwIGNvbW1lbnRlZCBjb2RlXG5cbiIsImFwcC5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIpe1xuXHQkc3RhdGVQcm92aWRlci5zdGF0ZSgnc2FuZGJveCcsIHtcblx0XHR0ZW1wbGF0ZVVybCA6ICdmZWF0dXJlcy9zYW5kYm94L3NhbmRib3guaHRtbCcsXG5cdFx0YWJzdHJhY3QgOiB0cnVlXG5cdH0pO1xufSk7XG5cbmFwcC5mYWN0b3J5KCdTYW5kYm94RmFjdG9yeScsIGZ1bmN0aW9uKCRodHRwLCBBcGlFbmRwb2ludCwgJHJvb3RTY29wZSwgJHN0YXRlKXtcblxuXHR2YXIgcHJvYmxlbSA9ICcnO1xuXHR2YXIgc3VibWlzc2lvbiA9ICcnO1xuXG5cdHZhciBydW5IaWRkZW4gPSBmdW5jdGlvbihjb2RlKSB7XG5cdCAgICB2YXIgaW5kZXhlZERCID0gbnVsbDtcblx0ICAgIHZhciBsb2NhdGlvbiA9IG51bGw7XG5cdCAgICB2YXIgbmF2aWdhdG9yID0gbnVsbDtcblx0ICAgIHZhciBvbmVycm9yID0gbnVsbDtcblx0ICAgIHZhciBvbm1lc3NhZ2UgPSBudWxsO1xuXHQgICAgdmFyIHBlcmZvcm1hbmNlID0gbnVsbDtcblx0ICAgIHZhciBzZWxmID0gbnVsbDtcblx0ICAgIHZhciB3ZWJraXRJbmRleGVkREIgPSBudWxsO1xuXHQgICAgdmFyIHBvc3RNZXNzYWdlID0gbnVsbDtcblx0ICAgIHZhciBjbG9zZSA9IG51bGw7XG5cdCAgICB2YXIgb3BlbkRhdGFiYXNlID0gbnVsbDtcblx0ICAgIHZhciBvcGVuRGF0YWJhc2VTeW5jID0gbnVsbDtcblx0ICAgIHZhciB3ZWJraXRSZXF1ZXN0RmlsZVN5c3RlbSA9IG51bGw7XG5cdCAgICB2YXIgd2Via2l0UmVxdWVzdEZpbGVTeXN0ZW1TeW5jID0gbnVsbDtcblx0ICAgIHZhciB3ZWJraXRSZXNvbHZlTG9jYWxGaWxlU3lzdGVtU3luY1VSTCA9IG51bGw7XG5cdCAgICB2YXIgd2Via2l0UmVzb2x2ZUxvY2FsRmlsZVN5c3RlbVVSTCA9IG51bGw7XG5cdCAgICB2YXIgYWRkRXZlbnRMaXN0ZW5lciA9IG51bGw7XG5cdCAgICB2YXIgZGlzcGF0Y2hFdmVudCA9IG51bGw7XG5cdCAgICB2YXIgcmVtb3ZlRXZlbnRMaXN0ZW5lciA9IG51bGw7XG5cdCAgICB2YXIgZHVtcCA9IG51bGw7XG5cdCAgICB2YXIgb25vZmZsaW5lID0gbnVsbDtcblx0ICAgIHZhciBvbm9ubGluZSA9IG51bGw7XG5cdCAgICB2YXIgaW1wb3J0U2NyaXB0cyA9IG51bGw7XG5cdCAgICB2YXIgY29uc29sZSA9IG51bGw7XG5cdCAgICB2YXIgYXBwbGljYXRpb24gPSBudWxsO1xuXG5cdCAgICByZXR1cm4gZXZhbChjb2RlKTtcblx0fTtcblxuXHQvLyBjb252ZXJ0cyB0aGUgb3V0cHV0IGludG8gYSBzdHJpbmdcblx0dmFyIHN0cmluZ2lmeSA9IGZ1bmN0aW9uKG91dHB1dCkge1xuXHQgICAgdmFyIHJlc3VsdDtcblxuXHQgICAgaWYgKHR5cGVvZiBvdXRwdXQgPT0gJ3VuZGVmaW5lZCcpIHtcblx0ICAgICAgICByZXN1bHQgPSAndW5kZWZpbmVkJztcblx0ICAgIH0gZWxzZSBpZiAob3V0cHV0ID09PSBudWxsKSB7XG5cdCAgICAgICAgcmVzdWx0ID0gJ251bGwnO1xuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgICByZXN1bHQgPSBKU09OLnN0cmluZ2lmeShvdXRwdXQpIHx8IG91dHB1dC50b1N0cmluZygpO1xuXHQgICAgfVxuXG5cdCAgICByZXR1cm4gcmVzdWx0O1xuXHR9O1xuXG5cdHZhciBydW4gPSBmdW5jdGlvbihjb2RlKSB7XG5cdCAgICB2YXIgcmVzdWx0ID0ge1xuXHQgICAgICAgIGlucHV0OiBjb2RlLFxuXHQgICAgICAgIG91dHB1dDogbnVsbCxcblx0ICAgICAgICBlcnJvcjogbnVsbFxuXHQgICAgfTtcblxuXHQgICAgdHJ5IHtcblx0ICAgICAgICByZXN1bHQub3V0cHV0ID0gc3RyaW5naWZ5KHJ1bkhpZGRlbihjb2RlKSk7XG5cdCAgICB9IGNhdGNoKGUpIHtcblx0ICAgICAgICByZXN1bHQuZXJyb3IgPSBlLm1lc3NhZ2U7XG5cdCAgICB9XG5cdCAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG5cblxuXHRyZXR1cm4ge1xuXHRcdGdldENoYWxsZW5nZSA6IGZ1bmN0aW9uKGlkKXtcblx0XHRcdHJldHVybiAkaHR0cC5nZXQoQXBpRW5kcG9pbnQudXJsICsgJy9jaGFsbGVuZ2UvJyArIGlkKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcblx0XHRcdFx0cHJvYmxlbSA9IHJlc3BvbnNlLmRhdGE7XG5cdFx0XHRcdHN1Ym1pc3Npb24gPSBwcm9ibGVtLnNlc3Npb24uc2V0dXAgfHwgJyc7XG5cdFx0XHRcdCRyb290U2NvcGUuJGJyb2FkY2FzdCgncHJvYmxlbVVwZGF0ZWQnKTtcblx0XHRcdFx0cmV0dXJuIHJlc3BvbnNlLmRhdGE7XG5cdFx0XHR9KTtcblx0XHR9LFxuXHRcdHNldFN1Ym1pc3Npb24gOiBmdW5jdGlvbihjb2RlKXtcblx0XHRcdHN1Ym1pc3Npb24gPSBjb2RlO1xuXHRcdFx0JHJvb3RTY29wZS4kYnJvYWRjYXN0KCdzdWJtaXNzaW9uVXBkYXRlZCcpO1xuXHRcdH0sXG5cdFx0Y29tcGlsZVN1Ym1pc3Npb246IGZ1bmN0aW9uKGNvZGUpe1xuXHRcdFx0cmV0dXJuIHJ1bihjb2RlKTtcblx0XHR9LFxuXHRcdGdldFN1Ym1pc3Npb24gOiBmdW5jdGlvbigpe1xuXHRcdFx0cmV0dXJuIHN1Ym1pc3Npb247XG5cdFx0fSxcblx0XHRnZXRQcm9ibGVtIDogZnVuY3Rpb24oKXtcblx0XHRcdHJldHVybiBwcm9ibGVtO1xuXHRcdH1cblx0fTtcbn0pOyIsImFwcC5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIpe1xuXHQkc3RhdGVQcm92aWRlci5zdGF0ZSgnc2FuZGJveC5jb2RlJywge1xuXHRcdHVybCA6ICcvc2FuZGJveC9jb2RlJyxcblx0XHR2aWV3czoge1xuXHRcdFx0J3RhYi1jb2RlJyA6IHtcblx0XHRcdFx0dGVtcGxhdGVVcmwgOiAnZmVhdHVyZXMvc2FuZGJveC1jb2RlL3NhbmRib3gtY29kZS5odG1sJyxcblx0XHRcdFx0Y29udHJvbGxlciA6ICdTYW5kYm94Q29kZUN0cmwnXG5cdFx0XHR9XG5cdFx0fVxuXHR9KTtcbn0pO1xuXG5cbmFwcC5jb250cm9sbGVyKCdTYW5kYm94Q29kZUN0cmwnLCBmdW5jdGlvbigkc2NvcGUsICRzdGF0ZSwgU2FuZGJveEZhY3RvcnksIEV4ZXJjaXNtRmFjdG9yeSwgS2V5Ym9hcmRGYWN0b3J5KXtcblx0JHNjb3BlLmNvZGUgPSB7XG5cdFx0dGV4dCA6ICcnXG5cdH07XG5cblx0JHNjb3BlLmJ1dHRvbnMgPSB7XG5cdFx0Y29tcGlsZSA6ICdDb21waWxlJyxcblx0XHRzYXZlIDogJ1NhdmUnXG5cdH07XG5cblx0JHNjb3BlLmNvbXBpbGUgPSBmdW5jdGlvbihjb2RlKXtcblx0XHRTYW5kYm94RmFjdG9yeS5zZXRTdWJtaXNzaW9uKGNvZGUpO1xuXHRcdCRzdGF0ZS5nbygnc2FuZGJveC5jb21waWxlJyk7XG5cdH07XG5cblx0JHNjb3BlLnNhdmUgPSBmdW5jdGlvbihjb2RlKXtcblxuXHR9O1xuXG5cdCRzY29wZS5pbnNlcnRGdW5jID0gS2V5Ym9hcmRGYWN0b3J5Lm1ha2VJbnNlcnRGdW5jKCRzY29wZSk7XG5cblx0Ly8gJHNjb3BlLnNhdmVDaGFsbGVuZ2UgPSBmdW5jdGlvbigpe1xuXHQvLyBcdGNvbnNvbGUubG9nKFwic2F2ZSBzY29wZS50ZXh0XCIsICRzY29wZS50ZXh0KTtcblx0Ly8gXHQkbG9jYWxzdG9yYWdlLnNldChcInRlc3RpbmdcIiwgJHNjb3BlLnRleHQpO1xuXHQvLyB9O1xuXG5cdC8vICRzY29wZS5nZXRTYXZlZCA9IGZ1bmN0aW9uKCl7XG5cdC8vIFx0Y29uc29sZS5sb2coXCJzYXZlIHNjb3BlLnRleHRcIiwgJHNjb3BlLnRleHQpO1xuXHQvLyBcdGNvbnNvbGUubG9nKFwiZW50ZXJlZCBnZXRzYXZlZCBmdW5jXCIpO1xuXHQvLyBcdCRzY29wZS50ZXh0ID0gJGxvY2Fsc3RvcmFnZS5nZXQoXCJ0ZXN0aW5nXCIpO1xuXHQvLyB9O1xuXG59KTsiLCJhcHAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKXtcblx0JHN0YXRlUHJvdmlkZXIuc3RhdGUoJ3NhbmRib3guY29tcGlsZScsIHtcblx0XHR1cmwgOiAnL3NhbmRib3gvY29tcGlsZScsXG5cdFx0dmlld3MgOiB7XG5cdFx0XHQndGFiLWNvbXBpbGUnIDoge1xuXHRcdFx0XHR0ZW1wbGF0ZVVybCA6ICdmZWF0dXJlcy9zYW5kYm94LWNvbXBpbGUvc2FuZGJveC1jb21waWxlLmh0bWwnLFxuXHRcdFx0XHRjb250cm9sbGVyOiAnU2FuZGJveENvbXBpbGVDdHJsJ1xuXHRcdFx0fVxuXHRcdH1cblx0fSk7XG59KTtcblxuYXBwLmNvbnRyb2xsZXIoJ1NhbmRib3hDb21waWxlQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgU2FuZGJveEZhY3Rvcnkpe1xuXHQkc2NvcGUucXVlc3Rpb24gPSBTYW5kYm94RmFjdG9yeS5nZXRTdWJtaXNzaW9uKCk7XG5cdHZhciByZXN1bHRzID0gU2FuZGJveEZhY3RvcnkuY29tcGlsZVN1Ym1pc3Npb24oJHNjb3BlLnF1ZXN0aW9uKTtcblx0JHNjb3BlLnJlc3VsdHMgPSByZXN1bHRzO1xuXHQkc2NvcGUub3V0cHV0ID0gU2FuZGJveEZhY3RvcnkuY29tcGlsZVN1Ym1pc3Npb24oJHNjb3BlLnF1ZXN0aW9uKS5vdXRwdXQ7XG5cdCRzY29wZS5lcnJvciA9IFNhbmRib3hGYWN0b3J5LmNvbXBpbGVTdWJtaXNzaW9uKCRzY29wZS5xdWVzdGlvbikuZXJyb3I7XG5cblx0JHNjb3BlLiRvbignc3VibWlzc2lvblVwZGF0ZWQnLCBmdW5jdGlvbihlKXtcblx0XHQkc2NvcGUucXVlc3Rpb24gPSBTYW5kYm94RmFjdG9yeS5nZXRTdWJtaXNzaW9uKCk7XG5cdFx0cmVzdWx0cyA9IFNhbmRib3hGYWN0b3J5LmNvbXBpbGVTdWJtaXNzaW9uKCRzY29wZS5xdWVzdGlvbik7XG5cdFx0JHNjb3BlLnJlc3VsdHMgPSByZXN1bHRzO1xuXHRcdCRzY29wZS5vdXRwdXQgPSBTYW5kYm94RmFjdG9yeS5jb21waWxlU3VibWlzc2lvbigkc2NvcGUucXVlc3Rpb24pLm91dHB1dDtcblx0XHQkc2NvcGUuZXJyb3IgPSBTYW5kYm94RmFjdG9yeS5jb21waWxlU3VibWlzc2lvbigkc2NvcGUucXVlc3Rpb24pLmVycm9yO1xuXHR9KTtcbn0pOyIsImFwcC5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIpe1xuICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdzaWdudXAnLHtcbiAgICAgICAgdXJsOlwiL3NpZ251cFwiLFxuICAgICAgICB0ZW1wbGF0ZVVybDogXCJmZWF0dXJlcy9zaWdudXAvc2lnbnVwLmh0bWxcIixcbiAgICAgICAgY29udHJvbGxlcjogJ1NpZ25VcEN0cmwnXG4gICAgfSk7XG59KTtcblxuYXBwLmNvbnRyb2xsZXIoJ1NpZ25VcEN0cmwnLGZ1bmN0aW9uKCRyb290U2NvcGUsICRodHRwLCAkc2NvcGUsICRzdGF0ZSwgQXV0aFNlcnZpY2UsICRpb25pY1BvcHVwKXtcbiAgICAkc2NvcGUuZGF0YSA9IHt9O1xuICAgICRzY29wZS5lcnJvciA9IG51bGw7XG5cbiAgICAkc2NvcGUubG9naW4gPSBmdW5jdGlvbigpe1xuICAgICAgICAkc3RhdGUuZ28oJ2xvZ2luJyk7XG4gICAgfTtcblxuICAgICRzY29wZS5zaWdudXAgPSBmdW5jdGlvbigpe1xuICAgICAgICBBdXRoU2VydmljZVxuICAgICAgICAgICAgLnNpZ251cCgkc2NvcGUuZGF0YSlcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKGF1dGhlbnRpY2F0ZWQpe1xuICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ3NpZ251cCwgdGFiLmNoYWxsZW5nZScpO1xuICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdCgnQXV0aCcpO1xuICAgICAgICAgICAgICAgICRzY29wZS5zdGF0ZXMucHVzaCh7IC8vVE9ETzogTmVlZCB0byBhZGQgYSBwYXJlbnQgY29udHJvbGxlciB0byBjb21tdW5pY2F0ZVxuICAgICAgICAgICAgICAgICAgICBuYW1lOiAnTG9nb3V0JyxcbiAgICAgICAgICAgICAgICAgICAgcmVmOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICAgICAgQXV0aFNlcnZpY2UubG9nb3V0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZGF0YSA9IHt9O1xuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnN0YXRlcy5wb3AoKTsgLy9UT0RPOiBGaW5kIGEgYmV0dGVyIHdheSB0byByZW1vdmUgdGhlIExvZ291dCBsaW5rLCBpbnN0ZWFkIG9mIHBvcFxuICAgICAgICAgICAgICAgICAgICAgICAgJHN0YXRlLmdvKCdzaWdudXAnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdCgnQXV0aCcpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgJHN0YXRlLmdvKCdleGVyY2lzbS52aWV3Jyk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmNhdGNoKGZ1bmN0aW9uKGVycil7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmVycm9yID0gJ1NpZ251cCBJbnZhbGlkJztcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKEpTT04uc3RyaW5naWZ5KGVycikpXG4gICAgICAgICAgICAgICAgdmFyIGFsZXJ0UG9wdXAgPSAkaW9uaWNQb3B1cC5hbGVydCh7XG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnU2lnbnVwIGZhaWxlZCEnLFxuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogJ1BsZWFzZSBjaGVjayB5b3VyIGNyZWRlbnRpYWxzISdcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgIH07XG5cbn0pO1xuXG4vL1RPRE86IEZvcm0gVmFsaWRhdGlvblxuLy9UT0RPOiBDbGVhbnVwIGNvbW1lbnRlZCBjb2RlIiwiYXBwLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlcil7XG5cdCRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdzbmlwcGV0Jywge1xuXHRcdGNhY2hlOiBmYWxzZSxcblx0XHR1cmwgOiAnL3NuaXBwZXQvOmlkJyxcblx0XHR0ZW1wbGF0ZVVybCA6ICdmZWF0dXJlcy9zbmlwcGV0LWVkaXQvc25pcHBldC1lZGl0Lmh0bWwnLFxuXHRcdGNvbnRyb2xsZXI6ICdTbmlwcGV0RWRpdEN0cmwnXG5cdH0pO1xufSk7XG5cbmFwcC5jb250cm9sbGVyKCdTbmlwcGV0RWRpdEN0cmwnLCBmdW5jdGlvbigkc2NvcGUsICRzdGF0ZSwgJHN0YXRlUGFyYW1zLCBDb2RlU25pcHBldEZhY3RvcnksIEtleWJvYXJkRmFjdG9yeSl7XG5cdCRzY29wZS5idXR0b25zID0ge1xuXHRcdGVkaXQgOiAnRWRpdCcsXG5cdFx0Y2FuY2VsIDogJ0NhbmNlbCcsXG5cdFx0ZGVsZXRlIDogJ0RlbGV0ZSdcblx0fTtcblx0JHNjb3BlLnNuaXBwZXQgPSBDb2RlU25pcHBldEZhY3RvcnkuZ2V0U25pcHBldCgkc3RhdGVQYXJhbXMuaWQpO1xuXG5cdCRzY29wZS5pbnNlcnRGdW5jID0gS2V5Ym9hcmRGYWN0b3J5Lm1ha2VJbnNlcnRGdW5jKCRzY29wZSk7XG5cblx0JHNjb3BlLmVkaXQgPSBmdW5jdGlvbihzbmlwcGV0KXtcblx0XHRDb2RlU25pcHBldEZhY3RvcnkuZWRpdFNuaXBwZXQoJHN0YXRlUGFyYW1zLmlkLCBzbmlwcGV0KTtcblx0XHQkc3RhdGUuZ28oJ3NuaXBwZXRzJyk7XG5cdH07XG5cblx0JHNjb3BlLmRlbGV0ZSA9IGZ1bmN0aW9uKCl7XG5cdFx0Q29kZVNuaXBwZXRGYWN0b3J5LmRlbGV0ZVNuaXBwZXQoJHN0YXRlUGFyYW1zLmlkKTtcblx0XHQkc3RhdGUuZ28oJ3NuaXBwZXRzJyk7XG5cdH07XG5cblx0JHNjb3BlLmNhbmNlbCA9IGZ1bmN0aW9uKCl7XG5cdFx0JHN0YXRlLmdvKCdzbmlwcGV0cycpO1xuXHR9O1xufSk7IiwiYXBwLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlcil7XG5cdCRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdzbmlwcGV0cycsIHtcblx0XHR1cmwgOiAnL3NuaXBwZXRzJyxcblx0XHR0ZW1wbGF0ZVVybCA6ICdmZWF0dXJlcy9zbmlwcGV0cy9zbmlwcGV0cy5odG1sJyxcblx0XHRjb250cm9sbGVyIDogJ1NuaXBwZXRzQ3RybCdcblx0fSk7XG59KTtcblxuYXBwLmNvbnRyb2xsZXIoJ1NuaXBwZXRzQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgJHJvb3RTY29wZSwgJHN0YXRlLCBDb2RlU25pcHBldEZhY3Rvcnkpe1xuXHQkc2NvcGUuc25pcHBldHMgPSBDb2RlU25pcHBldEZhY3RvcnkuZ2V0QWxsU25pcHBldHMoKTtcblx0JHNjb3BlLnJlbW92ZSA9IENvZGVTbmlwcGV0RmFjdG9yeS5kZWxldGVTbmlwcGV0O1xuXG5cdCRyb290U2NvcGUuJG9uKCdmb290ZXJVcGRhdGVkJywgZnVuY3Rpb24oZXZlbnQpe1xuXHRcdCRzY29wZS5zbmlwcGV0cyA9IENvZGVTbmlwcGV0RmFjdG9yeS5nZXRBbGxTbmlwcGV0cygpO1xuXHR9KTtcblxuXHQkc2NvcGUuY3JlYXRlID0gZnVuY3Rpb24oKXtcblx0XHQkc3RhdGUuZ28oJ3NuaXBwZXRzLWNyZWF0ZScpO1xuXHR9O1xufSk7IiwiYXBwLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlcil7XG5cdCRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdzbmlwcGV0cy1jcmVhdGUnLCB7XG5cdFx0dXJsOiAnL3NuaXBwZXRzL2NyZWF0ZScsXG5cdFx0dGVtcGxhdGVVcmwgOiAnZmVhdHVyZXMvc25pcHBldHMtY3JlYXRlL3NuaXBwZXRzLWNyZWF0ZS5odG1sJyxcblx0XHRjb250cm9sbGVyOiAnU25pcHBldHNDcmVhdGVDdHJsJ1xuXHR9KTtcbn0pO1xuXG5hcHAuY29udHJvbGxlcignU25pcHBldHNDcmVhdGVDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCAkc3RhdGUsIEtleWJvYXJkRmFjdG9yeSwgQ29kZVNuaXBwZXRGYWN0b3J5KXtcblx0JHNjb3BlLnNuaXBwZXQgPSB7XG5cdFx0ZGlzcGxheSA6ICcnLFxuXHRcdGluc2VydFBhcmFtIDogJydcblx0fTtcblxuXHQkc2NvcGUuaW5zZXJ0RnVuYyA9IEtleWJvYXJkRmFjdG9yeS5tYWtlSW5zZXJ0RnVuYygkc2NvcGUpO1xuXG5cdCRzY29wZS5jcmVhdGUgPSBmdW5jdGlvbihzbmlwcGV0KXtcblx0XHRDb2RlU25pcHBldEZhY3RvcnkuYWRkU25pcHBldChzbmlwcGV0KTtcblx0XHQkc3RhdGUuZ28oJ3NuaXBwZXRzJyk7XG5cdH07XG59KTsiLCJhcHAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKXtcblx0JHN0YXRlUHJvdmlkZXIuc3RhdGUoJ3dlbGNvbWUnLCB7XG5cdFx0dXJsIDogJy93ZWxjb21lJyxcblx0XHR0ZW1wbGF0ZVVybCA6ICdmZWF0dXJlcy93ZWxjb21lL3dlbGNvbWUuaHRtbCcsXG5cdFx0Y29udHJvbGxlciA6ICdXZWxjb21lQ3RybCdcblx0fSk7XG59KTtcbmFwcC5jb250cm9sbGVyKCdXZWxjb21lQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgJHN0YXRlLCBBdXRoU2VydmljZSwgJHJvb3RTY29wZSwgR2lzdEZhY3RvcnksICRpb25pY1BvcHVwKXtcblx0Ly9UT0RPOiBTcGxhc2ggcGFnZSB3aGlsZSB5b3UgbG9hZCByZXNvdXJjZXMgKHBvc3NpYmxlIGlkZWEpXG5cdC8vY29uc29sZS5sb2coJ1dlbGNvbWVDdHJsJyk7XG5cdCRzY29wZS5idXR0b25zID0ge1xuXHRcdGxvZ2luIDogJ2xvZ2luJyxcblx0XHRzaWdudXAgOiAnc2lnbnVwJ1xuXHR9O1xuXG5cdC8vIGlvbmljLlBsYXRmb3JtLnJlYWR5KGZ1bmN0aW9uKCl7XG5cdC8vIFx0aW9uaWMuUGxhdGZvcm0uc2hvd1N0YXR1c0JhcihmYWxzZSk7XG5cdC8vIH0pO1xuXG5cdCRzY29wZS5sb2dpbiA9IGZ1bmN0aW9uKCl7XG5cdFx0JHN0YXRlLmdvKCdsb2dpbicpO1xuXHR9O1xuXHQkc2NvcGUuc2lnbnVwID0gZnVuY3Rpb24oKXtcblx0XHQkc3RhdGUuZ28oJ3NpZ251cCcpO1xuXHR9O1xuXG5cdC8vIGlmIChBdXRoU2VydmljZS5pc0F1dGhlbnRpY2F0ZWQoKSkge1xuXHQvLyBcdCRyb290U2NvcGUuJGJyb2FkY2FzdCgnQXV0aCcpO1xuXHQvLyBcdCRzY29wZS5zdGF0ZXMucHVzaCh7IC8vVE9ETzogTmVlZCB0byBhZGQgYSBwYXJlbnQgY29udHJvbGxlciB0byBjb21tdW5pY2F0ZVxuXHQvLyBcdFx0bmFtZTogJ0xvZ291dCcsXG5cdC8vIFx0XHRyZWY6IGZ1bmN0aW9uKCl7XG5cdC8vIFx0XHRcdEF1dGhTZXJ2aWNlLmxvZ291dCgpO1xuXHQvLyBcdFx0XHQkc2NvcGUuZGF0YSA9IHt9O1xuXHQvLyBcdFx0XHQkc2NvcGUuc3RhdGVzLnBvcCgpOyAvL1RPRE86IEZpbmQgYSBiZXR0ZXIgd2F5IHRvIHJlbW92ZSB0aGUgTG9nb3V0IGxpbmssIGluc3RlYWQgb2YgcG9wXG5cdC8vIFx0XHRcdCRzdGF0ZS5nbygnc2lnbnVwJyk7XG5cdC8vIFx0XHR9XG5cdC8vIFx0fSk7XG5cdC8vIFx0JHN0YXRlLmdvKCdleGVyY2lzbS52aWV3Jyk7XG5cdC8vIH0gZWxzZSB7XG5cdC8vIFx0Ly8gVE9ETzogJHN0YXRlLmdvKCdzaWdudXAnKTsgUmVtb3ZlIEJlbG93IGxpbmVcblx0Ly8gXHQvLyAkc3RhdGUuZ28oJ2V4ZXJjaXNtLnZpZXcnKTtcblx0Ly8gfVxuXHR2YXIgYXV0aFJlcSA9IGZhbHNlOyAvL1RPRE86IFRvZ2dsZSBmb3IgdXNpbmcgYXV0aGVudGljYXRpb24gd29yayBmbG93IC0gcmVxdWlyZSBiYWNrZW5kIHdpcmVkIHVwXG5cblx0aWYgKCFhdXRoUmVxKXtcblx0XHQkc3RhdGUuZ28oJ2V4ZXJjaXNtLnZpZXcnKTtcblx0fSBlbHNlIHtcblx0XHRpZiAoQXV0aFNlcnZpY2UuaXNBdXRoZW50aWNhdGVkKCkpIHtcblx0XHRcdCRyb290U2NvcGUuJGJyb2FkY2FzdCgnQXV0aCcpO1xuXHRcdFx0JHNjb3BlLnN0YXRlcy5wdXNoKHsgLy9UT0RPOiBOZWVkIHRvIGFkZCBhIHBhcmVudCBjb250cm9sbGVyIHRvIGNvbW11bmljYXRlXG5cdFx0XHRcdG5hbWU6ICdMb2dvdXQnLFxuXHRcdFx0XHRyZWY6IGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0QXV0aFNlcnZpY2UubG9nb3V0KCk7XG5cdFx0XHRcdFx0JHNjb3BlLmRhdGEgPSB7fTtcblx0XHRcdFx0XHQkc2NvcGUuc3RhdGVzLnBvcCgpOyAvL1RPRE86IEZpbmQgYSBiZXR0ZXIgd2F5IHRvIHJlbW92ZSB0aGUgTG9nb3V0IGxpbmssIGluc3RlYWQgb2YgcG9wXG5cdFx0XHRcdFx0JHN0YXRlLmdvKCdsb2dpbicpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXHRcdFx0Ly9wb3AtdXAgb3B0aW9ucywgdmlldyBzaGFyZWQgY29kZSBvclxuXHRcdFx0Ly9UT0RPOiBIYXBwZW4gb24gTG9naW4sIHJlY2lldmUgZ2lzdCBub3RpZmljYXRpb25cblx0XHRcdEdpc3RGYWN0b3J5LnF1ZXVlZEdpc3RzKCkudGhlbihnaXN0c1J4KTtcblxuXHRcdFx0ZnVuY3Rpb24gZ2lzdHNSeChyZXNwb25zZSl7XG5cdFx0XHRcdGNvbnNvbGUubG9nKHJlc3BvbnNlLmRhdGEuZ2lzdHMpO1xuXHRcdFx0XHRpZihyZXNwb25zZS5kYXRhLmdpc3RzLmxlbmd0aCAhPT0wKXtcblx0XHRcdFx0XHQvL2NvbnNvbGUubG9nKCdub3RpZnkgdXNlciBvZiBSeCBnaXN0cycpXG5cdFx0XHRcdFx0c2hvd0NvbmZpcm0gPSBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdHZhciBjb25maXJtUG9wdXAgPSAkaW9uaWNQb3B1cC5jb25maXJtKHtcblx0XHRcdFx0XHRcdFx0dGl0bGU6ICdZb3UgZ290IENvZGUhJyxcblx0XHRcdFx0XHRcdFx0dGVtcGxhdGU6ICdZb3VyIGZyaWVuZHMgc2hhcmVkIHNvbWUgY29kZSwgZG8geW91IHdhbnQgdG8gdGFrZSBhIGxvb2s/J1xuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHQvL1RPRE86IEN1c3RvbSBQb3BVcCBJbnN0ZWFkXG5cdFx0XHRcdFx0XHQvL1RPRE86IFlvdSBuZWVkIHRvIGFjY291bnQgZm9yIGxvZ2luICh0aGlzIG9ubHkgYWNjb3VudHMgZm9yIHVzZXIgbG9hZGluZyBhcHAsIGFscmVhZHkgbG9nZ2VkIGluKVxuXHRcdFx0XHRcdFx0Y29uZmlybVBvcHVwLnRoZW4oZnVuY3Rpb24ocmVzKSB7XG5cdFx0XHRcdFx0XHRcdGlmKHJlcykge1xuXHRcdFx0XHRcdFx0XHRcdC8vY29uc29sZS5sb2coJ1lvdSBhcmUgc3VyZScpO1xuXHRcdFx0XHRcdFx0XHRcdCRzdGF0ZS5nbygnY2hhdHMnKTtcblx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHQvL2NvbnNvbGUubG9nKCdZb3UgYXJlIG5vdCBzdXJlJyk7XG5cdFx0XHRcdFx0XHRcdFx0JHN0YXRlLmdvKCdleGVyY2lzbS5jb21waWxlJyk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdH07XG5cblx0XHRcdFx0XHRzaG93Q29uZmlybSgpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdCRzdGF0ZS5nbygnZXhlcmNpc20uY29tcGlsZScpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblxuXHRcdH0gZWxzZSB7XG5cdFx0XHQvL1RPRE86ICRzdGF0ZS5nbygnc2lnbnVwJyk7IFJlbW92ZSBCZWxvdyBsaW5lXG5cdFx0XHQkc3RhdGUuZ28oJ3NpZ251cCcpO1xuXHRcdH1cblx0fVxufSk7IiwiLy90b2tlbiBpcyBzZW50IG9uIGV2ZXJ5IGh0dHAgcmVxdWVzdFxuYXBwLmZhY3RvcnkoJ0F1dGhJbnRlcmNlcHRvcicsZnVuY3Rpb24gQXV0aEludGVyY2VwdG9yKEFVVEhfRVZFTlRTLCRyb290U2NvcGUsJHEsQXV0aFRva2VuRmFjdG9yeSl7XG5cbiAgICB2YXIgc3RhdHVzRGljdCA9IHtcbiAgICAgICAgNDAxOiBBVVRIX0VWRU5UUy5ub3RBdXRoZW50aWNhdGVkLFxuICAgICAgICA0MDM6IEFVVEhfRVZFTlRTLm5vdEF1dGhvcml6ZWRcbiAgICB9O1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgcmVxdWVzdDogYWRkVG9rZW4sXG4gICAgICAgIHJlc3BvbnNlRXJyb3I6IGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KHN0YXR1c0RpY3RbcmVzcG9uc2Uuc3RhdHVzXSwgcmVzcG9uc2UpO1xuICAgICAgICAgICAgcmV0dXJuICRxLnJlamVjdChyZXNwb25zZSk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gYWRkVG9rZW4oY29uZmlnKXtcbiAgICAgICAgdmFyIHRva2VuID0gQXV0aFRva2VuRmFjdG9yeS5nZXRUb2tlbigpO1xuICAgICAgICAvL2NvbnNvbGUubG9nKCdhZGRUb2tlbicsdG9rZW4pO1xuICAgICAgICBpZih0b2tlbil7XG4gICAgICAgICAgICBjb25maWcuaGVhZGVycyA9IGNvbmZpZy5oZWFkZXJzIHx8IHt9O1xuICAgICAgICAgICAgY29uZmlnLmhlYWRlcnMuQXV0aG9yaXphdGlvbiA9ICdCZWFyZXIgJyArIHRva2VuO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjb25maWc7XG4gICAgfVxufSk7XG4vL3NraXBwZWQgQXV0aCBJbnRlcmNlcHRvcnMgZ2l2ZW4gVE9ETzogWW91IGNvdWxkIGFwcGx5IHRoZSBhcHByb2FjaCBpblxuLy9odHRwOi8vZGV2ZGFjdGljLmNvbS91c2VyLWF1dGgtYW5ndWxhcmpzLWlvbmljL1xuXG5hcHAuY29uZmlnKGZ1bmN0aW9uKCRodHRwUHJvdmlkZXIpe1xuICAgICRodHRwUHJvdmlkZXIuaW50ZXJjZXB0b3JzLnB1c2goJ0F1dGhJbnRlcmNlcHRvcicpO1xufSk7XG5cbmFwcC5jb25zdGFudCgnQVVUSF9FVkVOVFMnLCB7XG4gICAgICAgIG5vdEF1dGhlbnRpY2F0ZWQ6ICdhdXRoLW5vdC1hdXRoZW50aWNhdGVkJyxcbiAgICAgICAgbm90QXV0aG9yaXplZDogJ2F1dGgtbm90LWF1dGhvcml6ZWQnXG59KTtcblxuYXBwLmNvbnN0YW50KCdVU0VSX1JPTEVTJywge1xuICAgICAgICAvL2FkbWluOiAnYWRtaW5fcm9sZScsXG4gICAgICAgIHB1YmxpYzogJ3B1YmxpY19yb2xlJ1xufSk7XG5cbmFwcC5mYWN0b3J5KCdBdXRoVG9rZW5GYWN0b3J5JyxmdW5jdGlvbigkd2luZG93KXtcbiAgICB2YXIgc3RvcmUgPSAkd2luZG93LmxvY2FsU3RvcmFnZTtcbiAgICB2YXIga2V5ID0gJ2F1dGgtdG9rZW4nO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgZ2V0VG9rZW46IGdldFRva2VuLFxuICAgICAgICBzZXRUb2tlbjogc2V0VG9rZW5cbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gZ2V0VG9rZW4oKXtcbiAgICAgICAgcmV0dXJuIHN0b3JlLmdldEl0ZW0oa2V5KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzZXRUb2tlbih0b2tlbil7XG4gICAgICAgIGlmKHRva2VuKXtcbiAgICAgICAgICAgIHN0b3JlLnNldEl0ZW0oa2V5LHRva2VuKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHN0b3JlLnJlbW92ZUl0ZW0oa2V5KTtcbiAgICAgICAgfVxuICAgIH1cbn0pO1xuXG5hcHAuc2VydmljZSgnQXV0aFNlcnZpY2UnLGZ1bmN0aW9uKCRxLCRodHRwLFVTRVJfUk9MRVMsQXV0aFRva2VuRmFjdG9yeSxBcGlFbmRwb2ludCwkcm9vdFNjb3BlKXtcbiAgICB2YXIgdXNlcm5hbWUgPSAnJztcbiAgICB2YXIgaXNBdXRoZW50aWNhdGVkID0gZmFsc2U7XG4gICAgdmFyIGF1dGhUb2tlbjtcblxuICAgIGZ1bmN0aW9uIGxvYWRVc2VyQ3JlZGVudGlhbHMoKSB7XG4gICAgICAgIC8vdmFyIHRva2VuID0gd2luZG93LmxvY2FsU3RvcmFnZS5nZXRJdGVtKExPQ0FMX1RPS0VOX0tFWSk7XG4gICAgICAgIHZhciB0b2tlbiA9IEF1dGhUb2tlbkZhY3RvcnkuZ2V0VG9rZW4oKTtcbiAgICAgICAgLy9jb25zb2xlLmxvZyh0b2tlbik7XG4gICAgICAgIGlmICh0b2tlbikge1xuICAgICAgICAgICAgdXNlQ3JlZGVudGlhbHModG9rZW4pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc3RvcmVVc2VyQ3JlZGVudGlhbHMoZGF0YSkge1xuICAgICAgICBBdXRoVG9rZW5GYWN0b3J5LnNldFRva2VuKGRhdGEudG9rZW4pO1xuICAgICAgICB1c2VDcmVkZW50aWFscyhkYXRhKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB1c2VDcmVkZW50aWFscyhkYXRhKSB7XG4gICAgICAgIC8vY29uc29sZS5sb2coJ3VzZUNyZWRlbnRpYWxzIHRva2VuJyxkYXRhKTtcbiAgICAgICAgdXNlcm5hbWUgPSBkYXRhLnVzZXJuYW1lO1xuICAgICAgICBpc0F1dGhlbnRpY2F0ZWQgPSB0cnVlO1xuICAgICAgICBhdXRoVG9rZW4gPSBkYXRhLnRva2VuO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGRlc3Ryb3lVc2VyQ3JlZGVudGlhbHMoKSB7XG4gICAgICAgIGF1dGhUb2tlbiA9IHVuZGVmaW5lZDtcbiAgICAgICAgdXNlcm5hbWUgPSAnJztcbiAgICAgICAgaXNBdXRoZW50aWNhdGVkID0gZmFsc2U7XG4gICAgICAgIEF1dGhUb2tlbkZhY3Rvcnkuc2V0VG9rZW4oKTsgLy9lbXB0eSBjbGVhcnMgdGhlIHRva2VuXG4gICAgfVxuXG4gICAgdmFyIGxvZ291dCA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIGRlc3Ryb3lVc2VyQ3JlZGVudGlhbHMoKTtcblxuICAgIH07XG5cbiAgICAvL3ZhciBsb2dpbiA9IGZ1bmN0aW9uKClcbiAgICB2YXIgbG9naW4gPSBmdW5jdGlvbih1c2VyZGF0YSl7XG4gICAgICAgIGNvbnNvbGUubG9nKCdsb2dpbicsSlNPTi5zdHJpbmdpZnkodXNlcmRhdGEpKTtcbiAgICAgICAgcmV0dXJuICRxKGZ1bmN0aW9uKHJlc29sdmUscmVqZWN0KXtcbiAgICAgICAgICAgICRodHRwLnBvc3QoQXBpRW5kcG9pbnQudXJsK1wiL3VzZXIvbG9naW5cIiwgdXNlcmRhdGEpXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgICAgICAgICAgICAgICBzdG9yZVVzZXJDcmVkZW50aWFscyhyZXNwb25zZS5kYXRhKTsgLy9zdG9yZVVzZXJDcmVkZW50aWFsc1xuICAgICAgICAgICAgICAgICAgICAvL2lzQXV0aGVudGljYXRlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUocmVzcG9uc2UpOyAvL1RPRE86IHNlbnQgdG8gYXV0aGVudGljYXRlZFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgdmFyIHNpZ251cCA9IGZ1bmN0aW9uKHVzZXJkYXRhKXtcbiAgICAgICAgY29uc29sZS5sb2coJ3NpZ251cCcsSlNPTi5zdHJpbmdpZnkodXNlcmRhdGEpKTtcbiAgICAgICAgcmV0dXJuICRxKGZ1bmN0aW9uKHJlc29sdmUscmVqZWN0KXtcbiAgICAgICAgICAgICRodHRwLnBvc3QoQXBpRW5kcG9pbnQudXJsK1wiL3VzZXIvc2lnbnVwXCIsIHVzZXJkYXRhKVxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAgICAgICAgICAgICAgICAgc3RvcmVVc2VyQ3JlZGVudGlhbHMocmVzcG9uc2UuZGF0YSk7IC8vc3RvcmVVc2VyQ3JlZGVudGlhbHNcbiAgICAgICAgICAgICAgICAgICAgLy9pc0F1dGhlbnRpY2F0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHJlc3BvbnNlKTsgLy9UT0RPOiBzZW50IHRvIGF1dGhlbnRpY2F0ZWRcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgbG9hZFVzZXJDcmVkZW50aWFscygpO1xuXG4gICAgdmFyIGlzQXV0aG9yaXplZCA9IGZ1bmN0aW9uKGF1dGhlbnRpY2F0ZWQpIHtcbiAgICAgICAgaWYgKCFhbmd1bGFyLmlzQXJyYXkoYXV0aGVudGljYXRlZCkpIHtcbiAgICAgICAgICAgIGF1dGhlbnRpY2F0ZWQgPSBbYXV0aGVudGljYXRlZF07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIChpc0F1dGhlbnRpY2F0ZWQgJiYgYXV0aGVudGljYXRlZC5pbmRleE9mKFVTRVJfUk9MRVMucHVibGljKSAhPT0gLTEpO1xuICAgIH07XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBsb2dpbjogbG9naW4sXG4gICAgICAgIHNpZ251cDogc2lnbnVwLFxuICAgICAgICBsb2dvdXQ6IGxvZ291dCxcbiAgICAgICAgaXNBdXRoZW50aWNhdGVkOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ0F1dGhTZXJ2aWNlLmlzQXV0aGVudGljYXRlZCgpJyk7XG4gICAgICAgICAgICByZXR1cm4gaXNBdXRoZW50aWNhdGVkO1xuICAgICAgICB9LFxuICAgICAgICB1c2VybmFtZTogZnVuY3Rpb24oKXtyZXR1cm4gdXNlcm5hbWU7fSxcbiAgICAgICAgLy9nZXRMb2dnZWRJblVzZXI6IGdldExvZ2dlZEluVXNlcixcbiAgICAgICAgaXNBdXRob3JpemVkOiBpc0F1dGhvcml6ZWRcbiAgICB9XG5cbn0pO1xuXG4vL1RPRE86IERpZCBub3QgY29tcGxldGUgbWFpbiBjdHJsICdBcHBDdHJsIGZvciBoYW5kbGluZyBldmVudHMnXG4vLyBhcyBwZXIgaHR0cDovL2RldmRhY3RpYy5jb20vdXNlci1hdXRoLWFuZ3VsYXJqcy1pb25pYy8iLCJhcHAuZmFjdG9yeSgnS2V5Ym9hcmRGYWN0b3J5JywgZnVuY3Rpb24oKXtcblx0cmV0dXJuIHtcblx0XHRtYWtlSW5zZXJ0RnVuYyA6IGZ1bmN0aW9uKHNjb3BlKXtcblx0XHRcdHJldHVybiBmdW5jdGlvbiAodGV4dCl7XG5cdFx0XHRcdHNjb3BlLiRicm9hZGNhc3QoXCJpbnNlcnRcIiwgdGV4dCk7XG5cdFx0XHR9O1xuXHRcdH1cblx0fTtcbn0pOyIsImFwcC5mYWN0b3J5KCdDb2RlU25pcHBldEZhY3RvcnknLCBmdW5jdGlvbigkcm9vdFNjb3BlKXtcblx0XG5cdHZhciBjb2RlU25pcHBldHMgPSBbXG5cdFx0e1xuXHRcdFx0ZGlzcGxheTogXCJmblwiLFxuXHRcdFx0aW5zZXJ0UGFyYW06IFwiZnVuY3Rpb24oKXsgfVwiXG5cdFx0fSxcblx0XHR7XG5cdFx0XHRkaXNwbGF5OiBcImZvclwiLFxuXHRcdFx0aW5zZXJ0UGFyYW06IFwiZm9yKHZhciBpPSA7aTwgO2krKyl7IH1cIlxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0ZGlzcGxheTogXCJ3aGlsZVwiLFxuXHRcdFx0aW5zZXJ0UGFyYW06IFwid2hpbGUoICl7IH1cIlxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0ZGlzcGxheTogXCJkbyB3aGlsZVwiLFxuXHRcdFx0aW5zZXJ0UGFyYW06IFwiZG8geyB9IHdoaWxlKCApO1wiXG5cdFx0fSxcblx0XHR7XG5cdFx0XHRkaXNwbGF5OiBcImxvZ1wiLFxuXHRcdFx0aW5zZXJ0UGFyYW06IFwiY29uc29sZS5sb2coKTtcIlxuXHRcdH0sXG5cdF07XG5cblx0dmFyIGJyYWNrZXRzID0gW1xuXHRcdHtcblx0XHRcdGRpc3BsYXk6IFwiWyBdXCIsXG5cdFx0XHRpbnNlcnRQYXJhbTogXCJbXVwiXG5cdFx0fSxcblx0XHR7XG5cdFx0XHRkaXNwbGF5OiBcInsgfVwiLFxuXHRcdFx0aW5zZXJ0UGFyYW06IFwie31cIlxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0ZGlzcGxheTogXCIoIClcIixcblx0XHRcdGluc2VydFBhcmFtOiBcIigpXCJcblx0XHR9LFxuXHRcdHtcblx0XHRcdGRpc3BsYXk6IFwiLy9cIixcblx0XHRcdGluc2VydFBhcmFtOiBcIi8vXCJcblx0XHR9LFxuXHRcdHtcblx0XHRcdGRpc3BsYXk6IFwiLyogICovXCIsXG5cdFx0XHRpbnNlcnRQYXJhbTogXCIvKiAqL1wiXG5cdFx0fVxuXHRdO1xuXG5cdHZhciBjb21wYXJhdG9ycyA9IFtcblx0XHR7XG5cdFx0XHRkaXNwbGF5OiBcIiFcIixcblx0XHRcdGluc2VydFBhcmFtOiBcIiFcIlxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0ZGlzcGxheTogXCJAXCIsXG5cdFx0XHRpbnNlcnRQYXJhbTogXCJAXCJcblx0XHR9LFxuXHRcdHtcblx0XHRcdGRpc3BsYXk6IFwiI1wiLFxuXHRcdFx0aW5zZXJ0UGFyYW06IFwiI1wiXG5cdFx0fSxcblx0XHR7XG5cdFx0XHRkaXNwbGF5OiBcIiRcIixcblx0XHRcdGluc2VydFBhcmFtOiBcIiRcIlxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0ZGlzcGxheTogXCIlXCIsXG5cdFx0XHRpbnNlcnRQYXJhbTogXCIlXCJcblx0XHR9LFxuXHRcdHtcblx0XHRcdGRpc3BsYXk6IFwiPVwiLFxuXHRcdFx0aW5zZXJ0UGFyYW06IFwiPVwiXG5cdFx0fSxcblx0XHR7XG5cdFx0XHRkaXNwbGF5OiBcIjxcIixcblx0XHRcdGluc2VydFBhcmFtOiBcIjxcIlxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0ZGlzcGxheTogXCI+XCIsXG5cdFx0XHRpbnNlcnRQYXJhbTogXCI+XCJcblx0XHR9XG5cdF07XG5cblx0dmFyIGZvb3Rlck1lbnUgPSBbXG5cdFx0e1xuXHRcdFx0ZGlzcGxheTogXCJDdXN0b21cIixcblx0XHRcdGRhdGE6IGNvZGVTbmlwcGV0c1xuXHRcdH0sXG5cdFx0e1xuXHRcdFx0ZGlzcGxheTogXCJTcGVjaWFsXCIsXG5cdFx0XHRkYXRhOiBjb21wYXJhdG9yc1xuXHRcdH0sXG5cdFx0e1xuXHRcdFx0ZGlzcGxheTogXCJCcmFja2V0c1wiLFxuXHRcdFx0ZGF0YTogYnJhY2tldHNcblx0XHR9XG5cdF07XG5cblx0Ly8gdmFyIGdldEhvdGtleXMgPSBmdW5jdGlvbigpe1xuXHQvLyBcdHJldHVybiBmb290ZXJIb3RrZXlzO1xuXHQvLyB9O1xuXG5cdHJldHVybiBcdHtcblx0XHRnZXRGb290ZXJNZW51IDogZnVuY3Rpb24oKXtcblx0XHRcdHJldHVybiBmb290ZXJNZW51O1xuXHRcdH0sXG5cdFx0YWRkU25pcHBldCA6IGZ1bmN0aW9uKG9iail7XG5cdFx0XHRjb25zb2xlLmxvZyhvYmopO1xuXHRcdFx0Y29kZVNuaXBwZXRzLnB1c2gob2JqKTtcblx0XHRcdCRyb290U2NvcGUuJGJyb2FkY2FzdCgnZm9vdGVyVXBkYXRlZCcsIHRoaXMuZ2V0Rm9vdGVyTWVudSgpKTtcblx0XHR9LFxuXHRcdGRlbGV0ZVNuaXBwZXQgOiBmdW5jdGlvbihpZCl7XG5cdFx0XHRjb2RlU25pcHBldHMuc3BsaWNlKGlkLCAxKTtcblx0XHRcdCRyb290U2NvcGUuJGJyb2FkY2FzdCgnZm9vdGVyVXBkYXRlZCcsIHRoaXMuZ2V0Rm9vdGVyTWVudSgpKTtcblx0XHR9LFxuXHRcdGdldEFsbFNuaXBwZXRzIDogZnVuY3Rpb24oKXtcblx0XHRcdHJldHVybiBjb2RlU25pcHBldHMubWFwKGZ1bmN0aW9uKGVsLCBpbmRleCl7XG5cdFx0XHRcdGVsLmlkID0gaW5kZXg7XG5cdFx0XHRcdHJldHVybiBlbDtcblx0XHRcdH0pO1xuXHRcdH0sXG5cdFx0ZWRpdFNuaXBwZXQgOiBmdW5jdGlvbihpZCwgY2hhbmdlcyl7XG5cdFx0XHRmb3IodmFyIGtleSBpbiBjb2RlU25pcHBldHNbaWRdKXtcblx0XHRcdFx0Y29kZVNuaXBwZXRzW2lkXVtrZXldID0gY2hhbmdlc1trZXldO1xuXHRcdFx0fVxuXHRcdFx0JHJvb3RTY29wZS4kYnJvYWRjYXN0KCdmb290ZXJVcGRhdGVkJywgdGhpcy5nZXRGb290ZXJNZW51KCkpO1xuXHRcdH0sXG5cdFx0Z2V0U25pcHBldCA6IGZ1bmN0aW9uKGlkKXtcblx0XHRcdHJldHVybiBjb2RlU25pcHBldHNbaWRdO1xuXHRcdH0sXG5cdFx0Z2V0U29tZVNuaXBwZXRzIDogZnVuY3Rpb24odGV4dCl7XG5cdFx0XHRmdW5jdGlvbiByZXBsYWNlVFNOIChzdHIpe1xuXHRcdFx0XHRyZXR1cm4gc3RyLnJlcGxhY2UoJy8oXFxufFxcdHxcXHMpKy9nJywgJycpO1xuXHRcdFx0fVxuXG5cdFx0XHRmdW5jdGlvbiBjaGVja09iamVjdChjaGVjayl7XG5cdFx0XHRcdGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSl7XG5cdFx0XHRcdFx0dmFyIGFyZ3MgPSBbXS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsMCk7XG5cdFx0XHRcdFx0YXJncy5zaGlmdCgpO1xuXHRcdFx0XHRcdHJldHVybiBhcmdzLmZpbHRlcihmdW5jdGlvbihlbCl7XG5cdFx0XHRcdFx0XHRyZXR1cm4gcmVwbGFjZVRTTihlbCkgPT09IHJlcGxhY2VUU04oY2hlY2spO1xuXHRcdFx0XHRcdH0pLmxlbmd0aCA+IDA7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSB0aHJvdyBuZXcgRXJyb3IoJ1BsZWFzZSBjaGVjaycpO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gY29kZVNuaXBwZXRzLmZpbHRlcihmdW5jdGlvbihlbCl7XG5cdFx0XHRcdHJldHVybiBjaGVja09iamVjdCh0ZXh0LCBlbC5kaXNwbGF5LCBlbC5pbnNlcnRQYXJhbSk7XG5cdFx0XHR9KTtcblx0XHR9XG5cdH07XG59KTsiLCJhcHAuZmlsdGVyKCdhcHBlbmQnLCBmdW5jdGlvbigpe1xuXHRyZXR1cm4gZnVuY3Rpb24oaW5wdXQsIGFwcGVuZCl7XG5cdFx0cmV0dXJuIGFwcGVuZCArIGlucHV0O1xuXHR9O1xufSk7IiwiYXBwLmZpbHRlcignYm9vbCcsIGZ1bmN0aW9uKCl7XG5cdHJldHVybiBmdW5jdGlvbihpbnB1dCwgY29uZGl0aW9uLCBpZlRydWUsIGlmRmFsc2Upe1xuXHRcdGlmKGV2YWwoaW5wdXQgKyBjb25kaXRpb24pKXtcblx0XHRcdHJldHVybiBpZlRydWU7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldHVybiBpZkZhbHNlO1xuXHRcdH1cblx0fTtcbn0pOyIsImFwcC5maWx0ZXIoJ25hbWVmb3JtYXQnLCBmdW5jdGlvbigpe1xuXHRyZXR1cm4gZnVuY3Rpb24odGV4dCl7XG5cdFx0cmV0dXJuICdFeGVyY2lzbSAtICcgKyB0ZXh0LnNwbGl0KCctJykubWFwKGZ1bmN0aW9uKGVsKXtcblx0XHRcdHJldHVybiBlbC5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIGVsLnNsaWNlKDEpO1xuXHRcdH0pLmpvaW4oJyAnKTtcblx0fTtcbn0pOyIsImFwcC5maWx0ZXIoJ2xlbmd0aCcsIGZ1bmN0aW9uKCl7XG5cdHJldHVybiBmdW5jdGlvbihhcnJJbnB1dCl7XG5cdFx0dmFyIGNoZWNrQXJyID0gYXJySW5wdXQgfHwgW107XG5cdFx0cmV0dXJuIGNoZWNrQXJyLmxlbmd0aDtcblx0fTtcbn0pOyIsImFwcC5maWx0ZXIoJ21hcmtlZCcsIGZ1bmN0aW9uKCRzY2Upe1xuXHQvLyBtYXJrZWQuc2V0T3B0aW9ucyh7XG5cdC8vIFx0cmVuZGVyZXI6IG5ldyBtYXJrZWQuUmVuZGVyZXIoKSxcblx0Ly8gXHRnZm06IHRydWUsXG5cdC8vIFx0dGFibGVzOiB0cnVlLFxuXHQvLyBcdGJyZWFrczogdHJ1ZSxcblx0Ly8gXHRwZWRhbnRpYzogZmFsc2UsXG5cdC8vIFx0c2FuaXRpemU6IHRydWUsXG5cdC8vIFx0c21hcnRMaXN0czogdHJ1ZSxcblx0Ly8gXHRzbWFydHlwYW50czogZmFsc2Vcblx0Ly8gfSk7XG5cdHJldHVybiBmdW5jdGlvbih0ZXh0KXtcblx0XHRpZih0ZXh0KXtcblx0XHRcdHJldHVybiAkc2NlLnRydXN0QXNIdG1sKG1hcmtlZCh0ZXh0KSk7XG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdFx0cmV0dXJuIHVuZGVmaW5lZDtcblx0XHR9XG5cdH07XG59KTsiLCJhcHAuc2VydmljZSgnTG9jYWxTdG9yYWdlJyxmdW5jdGlvbigpe30pIiwiYW5ndWxhci5tb2R1bGUoJ2lvbmljLnV0aWxzJywgW10pXG5cbi5mYWN0b3J5KCckbG9jYWxzdG9yYWdlJywgWyckd2luZG93JywgZnVuY3Rpb24oJHdpbmRvdykge1xuICByZXR1cm4ge1xuICAgIHNldDogZnVuY3Rpb24oa2V5LCB2YWx1ZSkge1xuICAgICAgJHdpbmRvdy5sb2NhbFN0b3JhZ2Vba2V5XSA9IHZhbHVlO1xuICAgIH0sXG4gICAgZ2V0OiBmdW5jdGlvbihrZXksIGRlZmF1bHRWYWx1ZSkge1xuICAgICAgcmV0dXJuICR3aW5kb3cubG9jYWxTdG9yYWdlW2tleV0gfHwgZGVmYXVsdFZhbHVlO1xuICAgIH0sXG4gICAgc2V0T2JqZWN0OiBmdW5jdGlvbihrZXksIHZhbHVlKSB7XG4gICAgICAkd2luZG93LmxvY2FsU3RvcmFnZVtrZXldID0gSlNPTi5zdHJpbmdpZnkodmFsdWUpO1xuICAgIH0sXG4gICAgZ2V0T2JqZWN0OiBmdW5jdGlvbihrZXkpIHtcbiAgICAgIHJldHVybiBKU09OLnBhcnNlKCR3aW5kb3cubG9jYWxTdG9yYWdlW2tleV0gfHwgJ3t9Jyk7XG4gICAgfVxuICB9O1xufV0pOyIsImFwcC5kaXJlY3RpdmUoJ2NvZGVrZXlib2FyZCcsIGZ1bmN0aW9uKENvZGVTbmlwcGV0RmFjdG9yeSwgJGNvbXBpbGUpe1xuXHRyZXR1cm4ge1xuXHRcdHJlc3RyaWN0IDogJ0EnLFxuXHRcdGxpbmsgOiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cmlidXRlKXtcblx0XHRcdHZhciB2aXNpYmxlID0gZmFsc2U7XG5cblx0XHRcdGVsZW1lbnQuYWRkQ2xhc3MoXCJiYXItc3RhYmxlXCIpO1xuXHRcdFx0ZWxlbWVudC5hZGRDbGFzcygnbmctaGlkZScpO1xuXG5cdFx0XHRmdW5jdGlvbiB0b2dnbGVDbGFzcygpe1xuXHRcdFx0XHRpZih2aXNpYmxlKXtcblx0XHRcdFx0XHRlbGVtZW50LnJlbW92ZUNsYXNzKCduZy1oaWRlJyk7XG5cdFx0XHRcdFx0ZWxlbWVudC5hZGRDbGFzcygnbmctc2hvdycpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGVsZW1lbnQucmVtb3ZlQ2xhc3MoJ25nLXNob3cnKTtcblx0XHRcdFx0XHRlbGVtZW50LmFkZENsYXNzKCduZy1oaWRlJyk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHNjb3BlLmJ0bnMgPSBDb2RlU25pcHBldEZhY3RvcnkuZ2V0Rm9vdGVyTWVudSgpO1xuXG5cdFx0XHRzY29wZS4kb24oJ2Zvb3RlclVwZGF0ZWQnLCBmdW5jdGlvbihldmVudCwgZGF0YSl7XG5cdFx0XHRcdHNjb3BlLmJ0bnMgPSBkYXRhO1xuXHRcdFx0fSk7XG5cblx0XHRcdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibmF0aXZlLmtleWJvYXJkc2hvd1wiLCBmdW5jdGlvbiAoKXtcblx0XHQgICAgXHR2aXNpYmxlID0gdHJ1ZTtcblx0XHQgICAgXHR0b2dnbGVDbGFzcygpO1xuXG5cdFx0ICAgIH0pO1xuXHRcdCAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIm5hdGl2ZS5rZXlib2FyZGhpZGVcIiwgZnVuY3Rpb24gKCl7XG5cdFx0ICAgIFx0dmlzaWJsZSA9IGZhbHNlO1xuXHRcdCAgICBcdHRvZ2dsZUNsYXNzKCk7XG5cdFx0ICAgIH0pO1xuXHRcdH1cblx0fTtcbn0pOyIsImFwcC5kaXJlY3RpdmUoJ3NuaXBwZXRidXR0b25zJywgZnVuY3Rpb24oKXtcblx0cmV0dXJuIHtcblx0XHRyZXN0cmljdCA6ICdFJyxcblx0XHRyZXBsYWNlOnRydWUsXG5cdFx0dGVtcGxhdGVVcmw6XCJmZWF0dXJlcy9jb21tb24vZGlyZWN0aXZlcy9jb2Rla2V5Ym9hcmRiYXIvc25pcHBldGJ1dHRvbnMuaHRtbFwiLFxuXHRcdGxpbmsgOiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cmlidXRlKXtcblx0XHRcdHNjb3BlLnNob3dPcHRpb25zID0gZmFsc2U7XG5cdFx0XHRzY29wZS5idG5DbGljayA9IGZ1bmN0aW9uKGRhdGEpe1xuXHRcdFx0XHRzY29wZS5zaG93T3B0aW9ucyA9IHRydWU7XG5cdFx0XHRcdHNjb3BlLml0ZW1zID0gZGF0YTtcblx0XHRcdH07XG5cdFx0XHRzY29wZS5pdGVtQ2xpY2sgPSBmdW5jdGlvbihpbnNlcnRQYXJhbSl7XG5cdFx0XHRcdHNjb3BlLmluc2VydEZ1bmMoaW5zZXJ0UGFyYW0pO1xuXHRcdFx0fTtcblx0XHRcdHNjb3BlLnJlc2V0TWVudSA9IGZ1bmN0aW9uKCl7XG5cdFx0XHRcdHNjb3BlLnNob3dPcHRpb25zID0gZmFsc2U7XG5cdFx0XHR9O1xuXHRcdH1cblx0fTtcbn0pOyIsImFwcC5kaXJlY3RpdmUoJ2NtZWRpdCcsIGZ1bmN0aW9uKCl7XG5cdHJldHVybiB7XG5cdFx0cmVzdHJpY3QgOiAnQScsXG5cdFx0cmVxdWlyZTogJ25nTW9kZWwnLFxuXHRcdGxpbmsgOiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cmlidXRlLCBuZ01vZGVsQ3RybCl7XG5cdFx0XHQvL2luaXRpYWxpemUgQ29kZU1pcnJvclxuXHRcdFx0dmFyIG15Q29kZU1pcnJvcjtcblx0XHRcdG15Q29kZU1pcnJvciA9IENvZGVNaXJyb3IuZnJvbVRleHRBcmVhKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGF0dHJpYnV0ZS5pZCksIHtcblx0XHRcdFx0bGluZU51bWJlcnMgOiB0cnVlLFxuXHRcdFx0XHRtb2RlOiAnamF2YXNjcmlwdCcsXG5cdFx0XHRcdGF1dG9mb2N1cyA6IHRydWUsXG5cdFx0XHRcdHRoZW1lIDogJ3R3aWxpZ2h0Jyxcblx0XHRcdFx0bGluZVdyYXBwaW5nOiB0cnVlLFxuXHRcdFx0XHRzY3JvbGxiYXJTdHlsZTogXCJvdmVybGF5XCJcblx0XHRcdH0pO1xuXHRcdFx0bmdNb2RlbEN0cmwuJHJlbmRlciA9IGZ1bmN0aW9uKCl7XG5cdFx0XHRcdG15Q29kZU1pcnJvci5zZXRWYWx1ZShuZ01vZGVsQ3RybC4kdmlld1ZhbHVlIHx8ICcnKTtcblx0XHRcdH07XG5cblx0XHRcdG15Q29kZU1pcnJvci5vbihcImNoYW5nZVwiLCBmdW5jdGlvbiAobXlDb2RlTWlycm9yLCBjaGFuZ2VPYmope1xuXHRcdCAgICBcdG5nTW9kZWxDdHJsLiRzZXRWaWV3VmFsdWUobXlDb2RlTWlycm9yLmdldFZhbHVlKCkpO1xuXHRcdCAgICB9KTtcblxuXHRcdCAgICBzY29wZS4kb24oXCJpbnNlcnRcIiwgZnVuY3Rpb24oZXZlbnQsIHRleHQpe1xuXHRcdCAgICBcdG15Q29kZU1pcnJvci5yZXBsYWNlU2VsZWN0aW9uKHRleHQpO1xuXHRcdCAgICB9KTtcblx0XHR9XG5cdH07XG59KTsiLCJhcHAuZGlyZWN0aXZlKCdjbXJlYWQnLCBmdW5jdGlvbigpe1xuXHRyZXR1cm4ge1xuXHRcdHJlc3RyaWN0IDogJ0EnLFxuXHRcdHJlcXVpcmU6ICduZ01vZGVsJyxcblx0XHRsaW5rIDogZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHJpYnV0ZSwgbmdNb2RlbEN0cmwpe1xuXHRcdFx0Ly9pbml0aWFsaXplIENvZGVNaXJyb3Jcblx0XHRcdHZhciBteUNvZGVNaXJyb3IgPSBDb2RlTWlycm9yLmZyb21UZXh0QXJlYShkb2N1bWVudC5nZXRFbGVtZW50QnlJZChhdHRyaWJ1dGUuaWQpLCB7XG5cdFx0XHRcdHJlYWRPbmx5IDogJ25vY3Vyc29yJyxcblx0XHRcdFx0bW9kZTogJ2phdmFzY3JpcHQnLFxuXHRcdFx0XHRhdXRvZm9jdXMgOiB0cnVlLFxuXHRcdFx0XHR0aGVtZSA6ICd0d2lsaWdodCcsXG5cdFx0XHRcdGxpbmVXcmFwcGluZzogdHJ1ZVxuXHRcdFx0fSk7XG5cblx0XHRcdG5nTW9kZWxDdHJsLiRyZW5kZXIgPSBmdW5jdGlvbigpe1xuXHRcdFx0XHRteUNvZGVNaXJyb3Iuc2V0VmFsdWUobmdNb2RlbEN0cmwuJHZpZXdWYWx1ZSB8fCAnJyk7XG5cdFx0XHR9O1xuXHRcdH1cblx0fTtcbn0pOyIsImFwcC5kaXJlY3RpdmUoJ2phc21pbmUnLCBmdW5jdGlvbihKYXNtaW5lUmVwb3J0ZXIpe1xuXHRyZXR1cm4ge1xuXHRcdHJlc3RyaWN0IDogJ0UnLFxuXHRcdHRyYW5zY2x1ZGU6IHRydWUsXG5cdFx0c2NvcGUgOiB7XG5cdFx0XHR0ZXN0OiAnPScsXG5cdFx0XHRjb2RlOiAnPSdcblx0XHR9LFxuXHRcdHRlbXBsYXRlVXJsIDogJ2ZlYXR1cmVzL2NvbW1vbi9kaXJlY3RpdmVzL2phc21pbmUvamFzbWluZS5odG1sJyxcblx0XHRsaW5rIDogZnVuY3Rpb24gKHNjb3BlLCBlbGVtZW50LCBhdHRyaWJ1dGUpe1xuXHRcdFx0c2NvcGUuJHdhdGNoKCd0ZXN0JywgZnVuY3Rpb24oKXtcblx0XHRcdFx0d2luZG93Lmphc21pbmUgPSBudWxsO1xuXHRcdFx0XHRKYXNtaW5lUmVwb3J0ZXIuaW5pdGlhbGl6ZUphc21pbmUoKTtcblx0XHRcdFx0SmFzbWluZVJlcG9ydGVyLmFkZFJlcG9ydGVyKHNjb3BlKTtcblx0XHRcdH0pO1xuXG5cdFx0XHRzY29wZS4kd2F0Y2goJ2NvZGUnLCBmdW5jdGlvbigpe1xuXHRcdFx0XHR3aW5kb3cuamFzbWluZSA9IG51bGw7XG5cdFx0XHRcdEphc21pbmVSZXBvcnRlci5pbml0aWFsaXplSmFzbWluZSgpO1xuXHRcdFx0XHRKYXNtaW5lUmVwb3J0ZXIuYWRkUmVwb3J0ZXIoc2NvcGUpO1xuXHRcdFx0fSk7XG5cblx0XHRcdGZ1bmN0aW9uIGZsYXR0ZW5SZW1vdmVEdXBlcyhhcnIsIGtleUNoZWNrKXtcblx0XHRcdFx0dmFyIHRyYWNrZXIgPSBbXTtcblx0XHRcdFx0cmV0dXJuIHdpbmRvdy5fLmZsYXR0ZW4oYXJyKS5maWx0ZXIoZnVuY3Rpb24oZWwpe1xuXHRcdFx0XHRcdGlmKHRyYWNrZXIuaW5kZXhPZihlbFtrZXlDaGVja10pID09IC0xKXtcblx0XHRcdFx0XHRcdHRyYWNrZXIucHVzaChlbFtrZXlDaGVja10pO1xuXHRcdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cblx0XHRcdHNjb3BlLnN1bW1hcnlTaG93aW5nID0gdHJ1ZTtcblxuXHRcdFx0c2NvcGUuc2hvd1N1bW1hcnkgPSBmdW5jdGlvbigpe1xuXHRcdFx0XHRpZighc2NvcGUuc3VtbWFyeVNob3dpbmcpIHNjb3BlLnN1bW1hcnlTaG93aW5nID0gIXNjb3BlLnN1bW1hcnlTaG93aW5nO1xuXHRcdFx0fTtcblx0XHRcdHNjb3BlLnNob3dGYWlsdXJlcyA9IGZ1bmN0aW9uKCl7XG5cdFx0XHRcdGlmKHNjb3BlLnN1bW1hcnlTaG93aW5nKSBzY29wZS5zdW1tYXJ5U2hvd2luZyA9ICFzY29wZS5zdW1tYXJ5U2hvd2luZztcblx0XHRcdH07XG5cblxuXHRcdFx0c2NvcGUuJHdhdGNoKCdzdWl0ZXMnLCBmdW5jdGlvbigpe1xuXHRcdFx0XHRpZihzY29wZS5zdWl0ZXMpe1xuXHRcdFx0XHRcdHZhciBzdWl0ZXNTcGVjcyA9IHNjb3BlLnN1aXRlcy5tYXAoZnVuY3Rpb24oZWwpe1xuXHRcdFx0XHRcdFx0cmV0dXJuIGVsLnNwZWNzO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdHNjb3BlLnNwZWNzT3ZlcnZpZXcgPSBmbGF0dGVuUmVtb3ZlRHVwZXMoc3VpdGVzU3BlY3MsIFwiaWRcIik7XG5cdFx0XHRcdFx0Y29uc29sZS5sb2coc2NvcGUuc3BlY3NPdmVydmlldyk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXG5cdFx0fVxuXHR9O1xufSk7XG5cbmFwcC5mYWN0b3J5KCdKYXNtaW5lUmVwb3J0ZXInLCBmdW5jdGlvbigpe1xuXHRmdW5jdGlvbiBpbml0aWFsaXplSmFzbWluZSgpe1xuXHRcdC8qXG5cdFx0Q29weXJpZ2h0IChjKSAyMDA4LTIwMTUgUGl2b3RhbCBMYWJzXG5cblx0XHRQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmdcblx0XHRhIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcblx0XHRcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcblx0XHR3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG5cdFx0ZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvXG5cdFx0cGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvXG5cdFx0dGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuXG5cdFx0VGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmVcblx0XHRpbmNsdWRlZCBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cblxuXHRcdFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsXG5cdFx0RVhQUkVTUyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG5cdFx0TUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkRcblx0XHROT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFXG5cdFx0TElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTlxuXHRcdE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTlxuXHRcdFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXHRcdCovXG5cdFx0LyoqXG5cdFx0IFN0YXJ0aW5nIHdpdGggdmVyc2lvbiAyLjAsIHRoaXMgZmlsZSBcImJvb3RzXCIgSmFzbWluZSwgcGVyZm9ybWluZyBhbGwgb2YgdGhlIG5lY2Vzc2FyeSBpbml0aWFsaXphdGlvbiBiZWZvcmUgZXhlY3V0aW5nIHRoZSBsb2FkZWQgZW52aXJvbm1lbnQgYW5kIGFsbCBvZiBhIHByb2plY3QncyBzcGVjcy4gVGhpcyBmaWxlIHNob3VsZCBiZSBsb2FkZWQgYWZ0ZXIgYGphc21pbmUuanNgIGFuZCBgamFzbWluZV9odG1sLmpzYCwgYnV0IGJlZm9yZSBhbnkgcHJvamVjdCBzb3VyY2UgZmlsZXMgb3Igc3BlYyBmaWxlcyBhcmUgbG9hZGVkLiBUaHVzIHRoaXMgZmlsZSBjYW4gYWxzbyBiZSB1c2VkIHRvIGN1c3RvbWl6ZSBKYXNtaW5lIGZvciBhIHByb2plY3QuXG5cblx0XHQgSWYgYSBwcm9qZWN0IGlzIHVzaW5nIEphc21pbmUgdmlhIHRoZSBzdGFuZGFsb25lIGRpc3RyaWJ1dGlvbiwgdGhpcyBmaWxlIGNhbiBiZSBjdXN0b21pemVkIGRpcmVjdGx5LiBJZiBhIHByb2plY3QgaXMgdXNpbmcgSmFzbWluZSB2aWEgdGhlIFtSdWJ5IGdlbV1bamFzbWluZS1nZW1dLCB0aGlzIGZpbGUgY2FuIGJlIGNvcGllZCBpbnRvIHRoZSBzdXBwb3J0IGRpcmVjdG9yeSB2aWEgYGphc21pbmUgY29weV9ib290X2pzYC4gT3RoZXIgZW52aXJvbm1lbnRzIChlLmcuLCBQeXRob24pIHdpbGwgaGF2ZSBkaWZmZXJlbnQgbWVjaGFuaXNtcy5cblxuXHRcdCBUaGUgbG9jYXRpb24gb2YgYGJvb3QuanNgIGNhbiBiZSBzcGVjaWZpZWQgYW5kL29yIG92ZXJyaWRkZW4gaW4gYGphc21pbmUueW1sYC5cblxuXHRcdCBbamFzbWluZS1nZW1dOiBodHRwOi8vZ2l0aHViLmNvbS9waXZvdGFsL2phc21pbmUtZ2VtXG5cdFx0ICovXG5cblx0XHQoZnVuY3Rpb24oKSB7XG5cdFx0ICAvKipcblx0XHQgICAqICMjIFJlcXVpcmUgJmFtcDsgSW5zdGFudGlhdGVcblx0XHQgICAqXG5cdFx0ICAgKiBSZXF1aXJlIEphc21pbmUncyBjb3JlIGZpbGVzLiBTcGVjaWZpY2FsbHksIHRoaXMgcmVxdWlyZXMgYW5kIGF0dGFjaGVzIGFsbCBvZiBKYXNtaW5lJ3MgY29kZSB0byB0aGUgYGphc21pbmVgIHJlZmVyZW5jZS5cblx0XHQgICAqL1xuXHRcdCAgd2luZG93Lmphc21pbmUgPSBqYXNtaW5lUmVxdWlyZS5jb3JlKGphc21pbmVSZXF1aXJlKTtcblxuXHRcdCAgLyoqXG5cdFx0ICAgKiBTaW5jZSB0aGlzIGlzIGJlaW5nIHJ1biBpbiBhIGJyb3dzZXIgYW5kIHRoZSByZXN1bHRzIHNob3VsZCBwb3B1bGF0ZSB0byBhbiBIVE1MIHBhZ2UsIHJlcXVpcmUgdGhlIEhUTUwtc3BlY2lmaWMgSmFzbWluZSBjb2RlLCBpbmplY3RpbmcgdGhlIHNhbWUgcmVmZXJlbmNlLlxuXHRcdCAgICovXG5cdFx0ICBqYXNtaW5lUmVxdWlyZS5odG1sKGphc21pbmUpO1xuXG5cdFx0ICAvKipcblx0XHQgICAqIENyZWF0ZSB0aGUgSmFzbWluZSBlbnZpcm9ubWVudC4gVGhpcyBpcyB1c2VkIHRvIHJ1biBhbGwgc3BlY3MgaW4gYSBwcm9qZWN0LlxuXHRcdCAgICovXG5cdFx0ICB2YXIgZW52ID0gamFzbWluZS5nZXRFbnYoKTtcblxuXHRcdCAgLyoqXG5cdFx0ICAgKiAjIyBUaGUgR2xvYmFsIEludGVyZmFjZVxuXHRcdCAgICpcblx0XHQgICAqIEJ1aWxkIHVwIHRoZSBmdW5jdGlvbnMgdGhhdCB3aWxsIGJlIGV4cG9zZWQgYXMgdGhlIEphc21pbmUgcHVibGljIGludGVyZmFjZS4gQSBwcm9qZWN0IGNhbiBjdXN0b21pemUsIHJlbmFtZSBvciBhbGlhcyBhbnkgb2YgdGhlc2UgZnVuY3Rpb25zIGFzIGRlc2lyZWQsIHByb3ZpZGVkIHRoZSBpbXBsZW1lbnRhdGlvbiByZW1haW5zIHVuY2hhbmdlZC5cblx0XHQgICAqL1xuXHRcdCAgdmFyIGphc21pbmVJbnRlcmZhY2UgPSBqYXNtaW5lUmVxdWlyZS5pbnRlcmZhY2UoamFzbWluZSwgZW52KTtcblxuXHRcdCAgLyoqXG5cdFx0ICAgKiBBZGQgYWxsIG9mIHRoZSBKYXNtaW5lIGdsb2JhbC9wdWJsaWMgaW50ZXJmYWNlIHRvIHRoZSBnbG9iYWwgc2NvcGUsIHNvIGEgcHJvamVjdCBjYW4gdXNlIHRoZSBwdWJsaWMgaW50ZXJmYWNlIGRpcmVjdGx5LiBGb3IgZXhhbXBsZSwgY2FsbGluZyBgZGVzY3JpYmVgIGluIHNwZWNzIGluc3RlYWQgb2YgYGphc21pbmUuZ2V0RW52KCkuZGVzY3JpYmVgLlxuXHRcdCAgICovXG5cdFx0ICBleHRlbmQod2luZG93LCBqYXNtaW5lSW50ZXJmYWNlKTtcblxuXHRcdCAgLyoqXG5cdFx0ICAgKiAjIyBSdW5uZXIgUGFyYW1ldGVyc1xuXHRcdCAgICpcblx0XHQgICAqIE1vcmUgYnJvd3NlciBzcGVjaWZpYyBjb2RlIC0gd3JhcCB0aGUgcXVlcnkgc3RyaW5nIGluIGFuIG9iamVjdCBhbmQgdG8gYWxsb3cgZm9yIGdldHRpbmcvc2V0dGluZyBwYXJhbWV0ZXJzIGZyb20gdGhlIHJ1bm5lciB1c2VyIGludGVyZmFjZS5cblx0XHQgICAqL1xuXG5cdFx0ICB2YXIgcXVlcnlTdHJpbmcgPSBuZXcgamFzbWluZS5RdWVyeVN0cmluZyh7XG5cdFx0ICAgIGdldFdpbmRvd0xvY2F0aW9uOiBmdW5jdGlvbigpIHsgcmV0dXJuIHdpbmRvdy5sb2NhdGlvbjsgfVxuXHRcdCAgfSk7XG5cblx0XHQgIHZhciBjYXRjaGluZ0V4Y2VwdGlvbnMgPSBxdWVyeVN0cmluZy5nZXRQYXJhbShcImNhdGNoXCIpO1xuXHRcdCAgZW52LmNhdGNoRXhjZXB0aW9ucyh0eXBlb2YgY2F0Y2hpbmdFeGNlcHRpb25zID09PSBcInVuZGVmaW5lZFwiID8gdHJ1ZSA6IGNhdGNoaW5nRXhjZXB0aW9ucyk7XG5cblx0XHQgIHZhciB0aHJvd2luZ0V4cGVjdGF0aW9uRmFpbHVyZXMgPSBxdWVyeVN0cmluZy5nZXRQYXJhbShcInRocm93RmFpbHVyZXNcIik7XG5cdFx0ICBlbnYudGhyb3dPbkV4cGVjdGF0aW9uRmFpbHVyZSh0aHJvd2luZ0V4cGVjdGF0aW9uRmFpbHVyZXMpO1xuXG5cdFx0ICAvKipcblx0XHQgICAqIFRoZSBganNBcGlSZXBvcnRlcmAgYWxzbyByZWNlaXZlcyBzcGVjIHJlc3VsdHMsIGFuZCBpcyB1c2VkIGJ5IGFueSBlbnZpcm9ubWVudCB0aGF0IG5lZWRzIHRvIGV4dHJhY3QgdGhlIHJlc3VsdHMgIGZyb20gSmF2YVNjcmlwdC5cblx0XHQgICAqL1xuXHRcdCAgZW52LmFkZFJlcG9ydGVyKGphc21pbmVJbnRlcmZhY2UuanNBcGlSZXBvcnRlcik7XG5cblx0XHQgIC8qKlxuXHRcdCAgICogRmlsdGVyIHdoaWNoIHNwZWNzIHdpbGwgYmUgcnVuIGJ5IG1hdGNoaW5nIHRoZSBzdGFydCBvZiB0aGUgZnVsbCBuYW1lIGFnYWluc3QgdGhlIGBzcGVjYCBxdWVyeSBwYXJhbS5cblx0XHQgICAqL1xuXHRcdCAgdmFyIHNwZWNGaWx0ZXIgPSBuZXcgamFzbWluZS5IdG1sU3BlY0ZpbHRlcih7XG5cdFx0ICAgIGZpbHRlclN0cmluZzogZnVuY3Rpb24oKSB7IHJldHVybiBxdWVyeVN0cmluZy5nZXRQYXJhbShcInNwZWNcIik7IH1cblx0XHQgIH0pO1xuXG5cdFx0ICBlbnYuc3BlY0ZpbHRlciA9IGZ1bmN0aW9uKHNwZWMpIHtcblx0XHQgICAgcmV0dXJuIHNwZWNGaWx0ZXIubWF0Y2hlcyhzcGVjLmdldEZ1bGxOYW1lKCkpO1xuXHRcdCAgfTtcblxuXHRcdCAgLyoqXG5cdFx0ICAgKiBTZXR0aW5nIHVwIHRpbWluZyBmdW5jdGlvbnMgdG8gYmUgYWJsZSB0byBiZSBvdmVycmlkZGVuLiBDZXJ0YWluIGJyb3dzZXJzIChTYWZhcmksIElFIDgsIHBoYW50b21qcykgcmVxdWlyZSB0aGlzIGhhY2suXG5cdFx0ICAgKi9cblx0XHQgIHdpbmRvdy5zZXRUaW1lb3V0ID0gd2luZG93LnNldFRpbWVvdXQ7XG5cdFx0ICB3aW5kb3cuc2V0SW50ZXJ2YWwgPSB3aW5kb3cuc2V0SW50ZXJ2YWw7XG5cdFx0ICB3aW5kb3cuY2xlYXJUaW1lb3V0ID0gd2luZG93LmNsZWFyVGltZW91dDtcblx0XHQgIHdpbmRvdy5jbGVhckludGVydmFsID0gd2luZG93LmNsZWFySW50ZXJ2YWw7XG5cblx0XHQgIC8qKlxuXHRcdCAgICogIyMgRXhlY3V0aW9uXG5cdFx0ICAgKlxuXHRcdCAgICogUmVwbGFjZSB0aGUgYnJvd3NlciB3aW5kb3cncyBgb25sb2FkYCwgZW5zdXJlIGl0J3MgY2FsbGVkLCBhbmQgdGhlbiBydW4gYWxsIG9mIHRoZSBsb2FkZWQgc3BlY3MuIFRoaXMgaW5jbHVkZXMgaW5pdGlhbGl6aW5nIHRoZSBgSHRtbFJlcG9ydGVyYCBpbnN0YW5jZSBhbmQgdGhlbiBleGVjdXRpbmcgdGhlIGxvYWRlZCBKYXNtaW5lIGVudmlyb25tZW50LiBBbGwgb2YgdGhpcyB3aWxsIGhhcHBlbiBhZnRlciBhbGwgb2YgdGhlIHNwZWNzIGFyZSBsb2FkZWQuXG5cdFx0ICAgKi9cblx0XHQgIHZhciBjdXJyZW50V2luZG93T25sb2FkID0gd2luZG93Lm9ubG9hZDtcblxuXHRcdCAgKGZ1bmN0aW9uKCkge1xuXHRcdCAgICBpZiAoY3VycmVudFdpbmRvd09ubG9hZCkge1xuXHRcdCAgICAgIGN1cnJlbnRXaW5kb3dPbmxvYWQoKTtcblx0XHQgICAgfVxuXHRcdCAgICBlbnYuZXhlY3V0ZSgpO1xuXHRcdCAgfSkoKTtcblxuXHRcdCAgLyoqXG5cdFx0ICAgKiBIZWxwZXIgZnVuY3Rpb24gZm9yIHJlYWRhYmlsaXR5IGFib3ZlLlxuXHRcdCAgICovXG5cdFx0ICBmdW5jdGlvbiBleHRlbmQoZGVzdGluYXRpb24sIHNvdXJjZSkge1xuXHRcdCAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiBzb3VyY2UpIGRlc3RpbmF0aW9uW3Byb3BlcnR5XSA9IHNvdXJjZVtwcm9wZXJ0eV07XG5cdFx0ICAgIHJldHVybiBkZXN0aW5hdGlvbjtcblx0XHQgIH1cblxuXHRcdH0pKCk7XG5cdH1cblxuXHRmdW5jdGlvbiBhZGRSZXBvcnRlcihzY29wZSl7XG5cdFx0dmFyIHN1aXRlcyA9IFtdO1xuXHRcdHZhciBjdXJyZW50U3VpdGUgPSB7fTtcblxuXHRcdGZ1bmN0aW9uIFN1aXRlKG9iail7XG5cdFx0XHR0aGlzLmlkID0gb2JqLmlkO1xuXHRcdFx0dGhpcy5kZXNjcmlwdGlvbiA9IG9iai5kZXNjcmlwdGlvbjtcblx0XHRcdHRoaXMuZnVsbE5hbWUgPSBvYmouZnVsbE5hbWU7XG5cdFx0XHR0aGlzLmZhaWxlZEV4cGVjdGF0aW9ucyA9IG9iai5mYWlsZWRFeHBlY3RhdGlvbnM7XG5cdFx0XHR0aGlzLnN0YXR1cyA9IG9iai5maW5pc2hlZDtcblx0XHRcdHRoaXMuc3BlY3MgPSBbXTtcblx0XHR9XG5cblx0XHR2YXIgbXlSZXBvcnRlciA9IHtcblxuXHRcdFx0amFzbWluZVN0YXJ0ZWQ6IGZ1bmN0aW9uKG9wdGlvbnMpe1xuXHRcdFx0XHRzdWl0ZXMgPSBbXTtcblx0XHRcdH0sXG5cdFx0XHRzdWl0ZVN0YXJ0ZWQ6IGZ1bmN0aW9uKHN1aXRlKXtcblx0XHRcdFx0Y3VycmVudFN1aXRlID0gbmV3IFN1aXRlKHN1aXRlKTtcblx0XHRcdH0sXG5cdFx0XHRzcGVjU3RhcnRlZDogZnVuY3Rpb24oc3BlYyl7XG5cdFx0XHRcdHNjb3BlLnNwZWNTdGFydGVkID0gc3BlYztcblx0XHRcdH0sXG5cdFx0XHRzcGVjRG9uZTogZnVuY3Rpb24oc3BlYyl7XG5cdFx0XHRcdGN1cnJlbnRTdWl0ZS5zcGVjcy5wdXNoKHNwZWMpO1xuXHRcdFx0fSxcblx0XHRcdHN1aXRlRG9uZTogZnVuY3Rpb24oc3VpdGUpe1xuXHRcdFx0XHRzdWl0ZXMucHVzaChjdXJyZW50U3VpdGUpO1xuXHRcdFx0fSxcblx0XHRcdGphc21pbmVEb25lOiBmdW5jdGlvbigpe1xuXHRcdFx0XHRzY29wZS5zdWl0ZXMgPSBzdWl0ZXM7XG5cdFx0XHR9XG5cdFx0fTtcblxuXHRcdHdpbmRvdy5qYXNtaW5lLmdldEVudigpLmFkZFJlcG9ydGVyKG15UmVwb3J0ZXIpO1xuXHR9XG5cblx0cmV0dXJuIHtcblx0XHRpbml0aWFsaXplSmFzbWluZSA6IGluaXRpYWxpemVKYXNtaW5lLFxuXHRcdGFkZFJlcG9ydGVyOiBhZGRSZXBvcnRlclxuXHR9O1xufSk7IiwiYXBwLmRpcmVjdGl2ZSgnc2hhcmUnLGZ1bmN0aW9uKEdpc3RGYWN0b3J5LCAkaW9uaWNQb3BvdmVyLCBGcmllbmRzRmFjdG9yeSl7XG4gICByZXR1cm4ge1xuICAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICAgdGVtcGxhdGVVcmw6J2ZlYXR1cmVzL2NvbW1vbi9kaXJlY3RpdmVzL3NoYXJlL3NoYXJlLmh0bWwnLFxuICAgICAgIGxpbms6IGZ1bmN0aW9uKCRzY29wZSwgZWxlbWVudCwgYXR0cmlidXRlcyl7XG4gICAgICAgICAgIC8vIC5mcm9tVGVtcGxhdGVVcmwoKSBtZXRob2RcblxuICAgICAgICAgICAvL1RPRE86IENsZWFudXAgR2lzdEZhY3Rvcnkuc2hhcmVHaXN0KGNvZGUsJHNjb3BlLmRhdGEuZnJpZW5kcykudGhlbihnaXN0U2hhcmVkKTtcblxuICAgICAgICAgICBGcmllbmRzRmFjdG9yeS5nZXRGcmllbmRzKCkudGhlbihhZGRGcmllbmRzKTtcbiAgICAgICAgICAgJHNjb3BlLmRhdGEgPSBbXTtcbiAgICAgICAgICAgJHNjb3BlLmlzQ2hlY2tlZCA9IFtdO1xuICAgICAgICAgICBmdW5jdGlvbiBhZGRGcmllbmRzKHJlc3BvbnNlKXtcbiAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ2FkZEZyaWVuZHMnLHJlc3BvbnNlLmRhdGEuZnJpZW5kcyk7XG4gICAgICAgICAgICAgICAkc2NvcGUuZGF0YS5mcmllbmRzID0gcmVzcG9uc2UuZGF0YS5mcmllbmRzO1xuICAgICAgICAgICB9O1xuXG4gICAgICAgICAgIC8vJHNjb3BlLiR3YXRjaCgnaXNDaGVja2VkJyxmdW5jdGlvbigpe1xuICAgICAgICAgICAvL1x0Y29uc29sZS5sb2coJHNjb3BlLmlzQ2hlY2tlZCk7XG4gICAgICAgICAgIC8vfSk7XG4gICAgICAgICAgIC8vVE9ETzogQ29uZmlybSB0aGF0IHRoaXMgaXMgd29ya2luZyBpbiBhbGwgc2NlbmFyaW9zXG4gICAgICAgICAgICRzY29wZS5zZW5kID0gZnVuY3Rpb24oY29kZSl7XG4gICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKCchQD8hQCMnLGNvZGUpO1xuICAgICAgICAgICAgICAgR2lzdEZhY3Rvcnkuc2hhcmVHaXN0KCRzY29wZS5jb2RlLE9iamVjdC5rZXlzKCRzY29wZS5pc0NoZWNrZWQpKS50aGVuKGdpc3RTaGFyZWQpO1xuICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICRpb25pY1BvcG92ZXIuZnJvbVRlbXBsYXRlVXJsKCdmZWF0dXJlcy9jb21tb24vZGlyZWN0aXZlcy9zaGFyZS9mcmllbmRzLmh0bWwnLCB7XG4gICAgICAgICAgICAgICBzY29wZTogJHNjb3BlXG4gICAgICAgICAgIH0pLnRoZW4oZnVuY3Rpb24ocG9wb3Zlcikge1xuICAgICAgICAgICAgICAgJHNjb3BlLnBvcG92ZXIgPSBwb3BvdmVyO1xuICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAkc2NvcGUub3BlblBvcG92ZXIgPSBmdW5jdGlvbigkZXZlbnQpIHtcbiAgICAgICAgICAgICAgICRzY29wZS5wb3BvdmVyLnNob3coJGV2ZW50KTtcbiAgICAgICAgICAgfTtcbiAgICAgICAgICAgJHNjb3BlLmNsb3NlUG9wb3ZlciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgJHNjb3BlLnBvcG92ZXIuaGlkZSgpO1xuICAgICAgICAgICB9O1xuICAgICAgICAgICAvL0NsZWFudXAgdGhlIHBvcG92ZXIgd2hlbiB3ZSdyZSBkb25lIHdpdGggaXQhXG4gICAgICAgICAgICRzY29wZS4kb24oJyRkZXN0cm95JywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAkc2NvcGUucG9wb3Zlci5yZW1vdmUoKTtcbiAgICAgICAgICAgfSk7XG4gICAgICAgICAgIC8vIEV4ZWN1dGUgYWN0aW9uIG9uIGhpZGUgcG9wb3ZlclxuICAgICAgICAgICAkc2NvcGUuJG9uKCdwb3BvdmVyLmhpZGRlbicsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgLy8gRXhlY3V0ZSBhY3Rpb25cbiAgICAgICAgICAgfSk7XG4gICAgICAgICAgIC8vIEV4ZWN1dGUgYWN0aW9uIG9uIHJlbW92ZSBwb3BvdmVyXG4gICAgICAgICAgICRzY29wZS4kb24oJ3BvcG92ZXIucmVtb3ZlZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgLy8gRXhlY3V0ZSBhY3Rpb25cbiAgICAgICAgICAgfSk7XG4gICAgICAgICAgIC8vfTtcbiAgICAgICAgICAgZ2lzdFNoYXJlZCA9IGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdnaXN0IHNoYXJlZCcscmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgJHNjb3BlLmNsb3NlUG9wb3ZlcigpO1xuICAgICAgICAgICB9O1xuICAgICAgIH1cbiAgIH1cbn0pO1xuIiwiYXBwLmRpcmVjdGl2ZSgnanNsb2FkJywgZnVuY3Rpb24oKXtcblx0ZnVuY3Rpb24gdXBkYXRlU2NyaXB0KGVsZW1lbnQsIHRleHQpe1xuXHRcdGVsZW1lbnQuZW1wdHkoKTtcblx0XHR2YXIgc2NyaXB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7XG5cdFx0c2NyaXB0LnR5cGUgPSAndGV4dC9qYXZhc2NyaXB0Jztcblx0XHRzY3JpcHQuaW5uZXJIVE1MID0gdGV4dDtcblx0XHRlbGVtZW50LmFwcGVuZChzY3JpcHQpO1xuXHR9XG5cdHJldHVybiB7XG5cdFx0cmVzdHJpY3QgOiAnRScsXG5cdFx0c2NvcGUgOiB7XG5cdFx0XHR0ZXh0IDogJz0nXG5cdFx0fSxcblx0XHRsaW5rIDogZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHJpYnV0ZXMpe1xuXHRcdFx0c2NvcGUuJHdhdGNoKCd0ZXh0JywgZnVuY3Rpb24odGV4dCl7XG5cdFx0XHRcdHVwZGF0ZVNjcmlwdChlbGVtZW50LCB0ZXh0KTtcblx0XHRcdH0pO1xuXHRcdH1cblx0fTtcbn0pO1xuXG4iLCJhcHAuZmFjdG9yeSgnR2lzdEZhY3RvcnknLGZ1bmN0aW9uKCRodHRwLCRxLEFwaUVuZHBvaW50KXtcblxuICAgIC8vVE9ETzogaGFuZGxpbmcgZm9yIG11bHRpcGxlIGZyaWVuZHMgKGFmdGVyIHRlc3Rpbmcgb25lIGZyaWVuZCB3b3JrcylcbiAgICAvL1RPRE86IEZyaWVuZCBhbmQgY29kZSBtdXN0IGJlIHByZXNlbnRcbiAgICAvL1RPRE86IGZyaWVuZHMgaXMgYW4gYXJyYXkgb2YgZnJpZW5kIE1vbmdvIElEc1xuXG4gICAgLy9UT0RPOiBTaGFyZSBkZXNjcmlwdGlvbiBhbmQgZmlsZW5hbWUgYmFzZWQgb24gY2hhbGxlbmdlIGZvciBleGFtcGxlXG4gICAgLy9UT0RPOk9yIGdpdmUgdGhlIHVzZXIgb3B0aW9ucyBvZiB3aGF0IHRvIGZpbGwgaW5cbiAgICBmdW5jdGlvbiBzaGFyZUdpc3QoY29kZSxmcmllbmRzLGRlc2NyaXB0aW9uLGZpbGVOYW1lKXtcbiAgICAgICAgY29uc29sZS5sb2coJ2NvZGUnLGNvZGUpO1xuICAgICAgICByZXR1cm4gJGh0dHAucG9zdChBcGlFbmRwb2ludC51cmwgKyAnL2dpc3RzL3NoYXJlR2lzdHMnLFxuICAgICAgICAgICAge2dpc3QgOiB7XG4gICAgICAgICAgICAgICAgY29kZTpjb2RlfHxcIm5vIGNvZGUgZW50ZXJlZFwiLFxuICAgICAgICAgICAgICAgIGZyaWVuZHM6ZnJpZW5kc3x8IFwiNTU1YjYyM2RmYTlhNjVhNDNlOWVjNmQ2XCIsXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246ZGVzY3JpcHRpb24gfHwgJ25vIGRlc2NyaXB0aW9uJyxcbiAgICAgICAgICAgICAgICBmaWxlTmFtZTpmaWxlTmFtZStcIi5qc1wiIHx8ICdubyBmaWxlIG5hbWUnXG4gICAgICAgICAgICB9fSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcXVldWVkR2lzdHMoKXtcbiAgICAgICAgcmV0dXJuICRodHRwLmdldChBcGlFbmRwb2ludC51cmwgKyAnL2dpc3RzL2dpc3RzUXVldWUnKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjcmVhdGVkR2lzdHMoKXtcbiAgICAgICAgcmV0dXJuICRodHRwLmdldChBcGlFbmRwb2ludC51cmwgKyAnL2dpc3RzL2NyZWF0ZWRHaXN0cycpXG4gICAgfVxuXG4gICAgcmV0dXJue1xuICAgICAgICBzaGFyZUdpc3Q6IHNoYXJlR2lzdCxcbiAgICAgICAgcXVldWVkR2lzdHM6IHF1ZXVlZEdpc3RzLCAvL3B1c2ggbm90aWZpY2F0aW9uc1xuICAgICAgICBjcmVhdGVkR2lzdHM6IGNyZWF0ZWRHaXN0c1xuICAgfVxufSk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9