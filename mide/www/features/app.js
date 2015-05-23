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
        // {
        //   name : 'Create Challenges',
        //   ref : function(){return 'exercises'; }
        // }
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
		// 'accumulate',
		// 'allergies',
		// 'anagram',
		// 'atbash-cipher',
		// 'beer-song',
		// 'binary',
		// 'binary-search-tree',
		// 'bob',
		// 'bracket-push',
		// 'circular-buffer',
		// 'clock',
		// 'crypto-square',
		// 'custom-set',
		// 'difference-of-squares',
		// 'etl',
		// 'food-chain',
		// 'gigasecond',
		// 'grade-school',
		// 'grains',
		// 'hamming',
		'hello-world'
		// 'hexadecimal'
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
		// $state.go('exercism.compile');
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

	var special = [
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
		},
		{
			display: ";",
			insertParam: ";"
		}
	];

	var demoButtons = [
		{
			display: "Demo1",
			insertParam: "<"
		},
		{
			display: "Demo2",
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
			data: special
		},
		{
			display: "Brackets",
			data: brackets
		}
		// {
		// 	display: "Demo",
		// 	data: demoButtons
		// }
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
			scope.demo1 = function() {
				var text = "var HelloWorld = function() {};\nHelloWorld.prototype.hello = function(name){name=name||'world';\nreturn 'Hello, ' + name + '!';};";
				scope.insertFunc(text);
			};
			scope.demo2 = function() {
				var text = "function haha() {return \"hehe\"};\n\nhaha();";
				scope.insertFunc(text);
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
				theme : 'monokai',
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
		    	document.getElementById(attribute.id).focus();
		    });

		    myCodeMirror.on("blur", function (){
		    	console.log("blur detected");
		    	// document.getElementById(attribute.id).focus();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImFib3V0L2Fib3V0LmpzIiwiYWNjb3VudC9hY2NvdW50LmpzIiwiY2hhdHMvY2hhdHMuanMiLCJleGVyY2lzZS9leGVyY2lzZS5qcyIsImV4ZXJjaXNlLWNvZGUvZXhlcmNpc2UtY29kZS5qcyIsImV4ZXJjaXNlLWNvbXBpbGUvZXhlcmNpc2UtY29tcGlsZS5qcyIsImV4ZXJjaXNlLXRlc3QvZXhlcmNpc2UtdGVzdC5qcyIsImV4ZXJjaXNlLXZpZXcvZXhlcmNpc2Utdmlldy5qcyIsImV4ZXJjaXNlLXZpZXctZWRpdC9leGVyY2lzZS12aWV3LWVkaXQuanMiLCJleGVyY2lzZXMvZXhlcmNpc2VzLmpzIiwiZXhlcmNpc2VzLWNyZWF0ZS9leGVyY2lzZXMtY3JlYXRlLmpzIiwiZXhlcmNpc20vZXhlcmNpc20uanMiLCJleGVyY2lzbS1jb2RlL2V4ZXJjaXNtLWNvZGUuanMiLCJleGVyY2lzbS1jb21waWxlL2V4ZXJjaXNtLWNvbXBpbGUuanMiLCJleGVyY2lzbS10ZXN0L2V4ZXJjaXNtLXRlc3QuanMiLCJleGVyY2lzbS12aWV3L2V4ZXJjaXNtLXZpZXcuanMiLCJsb2dpbi9sb2dpbi5qcyIsInNhbmRib3gvc2FuZGJveC5qcyIsInNhbmRib3gtY29kZS9zYW5kYm94LWNvZGUuanMiLCJzYW5kYm94LWNvbXBpbGUvc2FuZGJveC1jb21waWxlLmpzIiwic2lnbnVwL3NpZ251cC5qcyIsInNuaXBwZXQtZWRpdC9zbmlwcGV0LWVkaXQuanMiLCJzbmlwcGV0cy9zbmlwcGV0cy5qcyIsInNuaXBwZXRzLWNyZWF0ZS9zbmlwcGV0cy1jcmVhdGUuanMiLCJ3ZWxjb21lL3dlbGNvbWUuanMiLCJjb21tb24vQXV0aGVudGljYXRpb24vYXV0aGVudGljYXRpb24uanMiLCJjb21tb24vZmFjdG9yaWVzL0tleWJvYXJkRmFjdG9yeS5qcyIsImNvbW1vbi9mYWN0b3JpZXMvY29kZVNuaXBwZXRGYWN0b3J5LmpzIiwiY29tbW9uL2ZpbHRlcnMvYXBwZW5kLmpzIiwiY29tbW9uL2ZpbHRlcnMvYm9vbC5qcyIsImNvbW1vbi9maWx0ZXJzL2V4ZXJjaXNtLWZvcm1hdC1uYW1lLmpzIiwiY29tbW9uL2ZpbHRlcnMvbGVuZ3RoLmpzIiwiY29tbW9uL2ZpbHRlcnMvbWFya2VkLmpzIiwiY29tbW9uL2xvY2FsU3RvcmFnZS9sb2NhbHN0b3JhZ2UuanMiLCJjb21tb24vbW9kdWxlcy9pb25pYy51dGlscy5qcyIsImNvbW1vbi9kaXJlY3RpdmVzL2NvZGVrZXlib2FyZGJhci9jb2Rla2V5Ym9hcmRiYXIuanMiLCJjb21tb24vZGlyZWN0aXZlcy9jb2Rla2V5Ym9hcmRiYXIvc25pcHBldGJ1dHRvbnMuanMiLCJjb21tb24vZGlyZWN0aXZlcy9jb2RlbWlycm9yLWVkaXQvY29kZW1pcnJvci1lZGl0LmpzIiwiY29tbW9uL2RpcmVjdGl2ZXMvY29kZW1pcnJvci1yZWFkL2NvZGVtaXJyb3ItcmVhZC5qcyIsImNvbW1vbi9kaXJlY3RpdmVzL2phc21pbmUvamFzbWluZS5qcyIsImNvbW1vbi9kaXJlY3RpdmVzL2pzLWxvYWQvanMtbG9hZC5qcyIsImNvbW1vbi9kaXJlY3RpdmVzL3NoYXJlL3NoYXJlLmpzIiwiY29tbW9uL2ZhY3RvcnkvZ2lzdC9naXN0LmZhY3RvcnkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQy9DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25CQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gSW9uaWMgU3RhcnRlciBBcHBcblxuLy8gYW5ndWxhci5tb2R1bGUgaXMgYSBnbG9iYWwgcGxhY2UgZm9yIGNyZWF0aW5nLCByZWdpc3RlcmluZyBhbmQgcmV0cmlldmluZyBBbmd1bGFyIG1vZHVsZXNcbi8vICdzdGFydGVyJyBpcyB0aGUgbmFtZSBvZiB0aGlzIGFuZ3VsYXIgbW9kdWxlIGV4YW1wbGUgKGFsc28gc2V0IGluIGEgPGJvZHk+IGF0dHJpYnV0ZSBpbiBpbmRleC5odG1sKVxuLy8gdGhlIDJuZCBwYXJhbWV0ZXIgaXMgYW4gYXJyYXkgb2YgJ3JlcXVpcmVzJ1xuLy8gJ3N0YXJ0ZXIuc2VydmljZXMnIGlzIGZvdW5kIGluIHNlcnZpY2VzLmpzXG4vLyAnc3RhcnRlci5jb250cm9sbGVycycgaXMgZm91bmQgaW4gY29udHJvbGxlcnMuanNcbnZhciBhcHAgPSBhbmd1bGFyLm1vZHVsZSgnbWlkZScsIFsnaW9uaWMnLCAnaW9uaWMudXRpbHMnXSlcblxuLnJ1bihmdW5jdGlvbigkaW9uaWNQbGF0Zm9ybSkge1xuICAkaW9uaWNQbGF0Zm9ybS5yZWFkeShmdW5jdGlvbigpIHtcbiAgICAvLyBIaWRlIHRoZSBhY2Nlc3NvcnkgYmFyIGJ5IGRlZmF1bHQgKHJlbW92ZSB0aGlzIHRvIHNob3cgdGhlIGFjY2Vzc29yeSBiYXIgYWJvdmUgdGhlIGtleWJvYXJkXG4gICAgLy8gZm9yIGZvcm0gaW5wdXRzKVxuICAgIC8vICRsb2NhdGlvblByb3ZpZGVyLmh0bWw1TW9kZSh0cnVlKTtcbiAgICBpZiAod2luZG93LmNvcmRvdmEgJiYgd2luZG93LmNvcmRvdmEucGx1Z2lucyAmJiB3aW5kb3cuY29yZG92YS5wbHVnaW5zLktleWJvYXJkKSB7XG4gICAgICBjb3Jkb3ZhLnBsdWdpbnMuS2V5Ym9hcmQuaGlkZUtleWJvYXJkQWNjZXNzb3J5QmFyKHRydWUpO1xuICAgICAgY29yZG92YS5wbHVnaW5zLktleWJvYXJkLmRpc2FibGVTY3JvbGwodHJ1ZSk7XG4gICAgfVxuICAgIGlmICh3aW5kb3cuU3RhdHVzQmFyKSB7XG4gICAgICAvLyBvcmcuYXBhY2hlLmNvcmRvdmEuc3RhdHVzYmFyIHJlcXVpcmVkXG4gICAgICBTdGF0dXNCYXIuc3R5bGVMaWdodENvbnRlbnQoKTtcbiAgICB9XG4gIH0pO1xufSlcblxuLy9UT0RPOlRoaXMgaXMgbmVlZGVkIHRvIHNldCB0byBhY2Nlc3MgdGhlIHByb3h5IHVybCB0aGF0IHdpbGwgdGhlbiBpbiB0aGUgaW9uaWMucHJvamVjdCBmaWxlIHJlZGlyZWN0IGl0IHRvIHRoZSBjb3JyZWN0IFVSTFxuLmNvbnN0YW50KCdBcGlFbmRwb2ludCcsIHtcbiAgdXJsIDogJ2h0dHA6Ly9sb2NhbGhvc3Q6OTAwMC9hcGknXG59KVxuXG4vL1RPRE86J2h0dHBzOi8vcHJvdGVjdGVkLXJlYWNoZXMtNTk0Ni5oZXJva3VhcHAuY29tL2FwaScgLSBEZXBsb3kgbGF0ZXN0IHNlcnZlciBiZWZvcmUgcmVwbGFjaW5nXG5cbi5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlcikge1xuICAvLyBJb25pYyB1c2VzIEFuZ3VsYXJVSSBSb3V0ZXIgd2hpY2ggdXNlcyB0aGUgY29uY2VwdCBvZiBzdGF0ZXNcbiAgLy8gTGVhcm4gbW9yZSBoZXJlOiBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci11aS91aS1yb3V0ZXJcbiAgLy8gU2V0IHVwIHRoZSB2YXJpb3VzIHN0YXRlcyB3aGljaCB0aGUgYXBwIGNhbiBiZSBpbi5cbiAgLy8gRWFjaCBzdGF0ZSdzIGNvbnRyb2xsZXIgY2FuIGJlIGZvdW5kIGluIGNvbnRyb2xsZXJzLmpzXG4gIC8vIGlmIG5vbmUgb2YgdGhlIGFib3ZlIHN0YXRlcyBhcmUgbWF0Y2hlZCwgdXNlIHRoaXMgYXMgdGhlIGZhbGxiYWNrXG4gIC8vICR1cmxSb3V0ZXJQcm92aWRlci5vdGhlcndpc2UoJy9jaGFsbGVuZ2UvdmlldycpOyAvL1RPRE86IEFsYmVydCB0ZXN0aW5nIHRoaXMgcm91dGVcblxuICAkdXJsUm91dGVyUHJvdmlkZXIub3RoZXJ3aXNlKCcvd2VsY29tZScpOyAvLyBUT0RPOiBSaWNoYXJkIHRlc3RpbmcgdGhpcyByb3V0ZVxuICAvLyR1cmxSb3V0ZXJQcm92aWRlci5vdGhlcndpc2UoJ2NoYWxsZW5nZS52aWV3Jyk7IC8vVE9ETzogVG9ueSB0ZXN0aW5nIHRoaXMgcm91dGVcbiAgLy8gJHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZSgnd2VsY29tZScpO1xuXG59KVxuLy9cblxuLy8vL3J1biBibG9ja3M6IGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMjA2NjMwNzYvYW5ndWxhcmpzLWFwcC1ydW4tZG9jdW1lbnRhdGlvblxuLy9Vc2UgcnVuIG1ldGhvZCB0byByZWdpc3RlciB3b3JrIHdoaWNoIHNob3VsZCBiZSBwZXJmb3JtZWQgd2hlbiB0aGUgaW5qZWN0b3IgaXMgZG9uZSBsb2FkaW5nIGFsbCBtb2R1bGVzLlxuLy9odHRwOi8vZGV2ZGFjdGljLmNvbS91c2VyLWF1dGgtYW5ndWxhcmpzLWlvbmljL1xuXG4ucnVuKGZ1bmN0aW9uICgkcm9vdFNjb3BlLCAkc3RhdGUsIEF1dGhTZXJ2aWNlLCBBVVRIX0VWRU5UUykge1xuXG4gICAgdmFyIGRlc3RpbmF0aW9uU3RhdGVSZXF1aXJlc0F1dGggPSBmdW5jdGlvbiAoc3RhdGUpIHtcbiAgICAgICAgLy9jb25zb2xlLmxvZygnY2wgLSBkZXN0aW5hdGlvblN0YXRlUmVxdWlyZXNBdXRoJywnc3RhdGUuZGF0YScsc3RhdGUuZGF0YSwnc3RhdGUuZGF0YS5hdXRoJyxzdGF0ZS5kYXRhLmF1dGhlbnRpY2F0ZSk7XG4gICAgICAgIHJldHVybiBzdGF0ZS5kYXRhICYmIHN0YXRlLmRhdGEuYXV0aGVudGljYXRlO1xuICAgIH07XG4gICBcbiAgICAvL1RPRE86IE5lZWQgdG8gbWFrZSBhdXRoZW50aWNhdGlvbiBtb3JlIHJvYnVzdCBiZWxvdyBkb2VzIG5vdCBmb2xsb3cgRlNHIChldC4gYWwuKVxuICAgIC8vVE9ETzogQ3VycmVudGx5IGl0IGlzIG5vdCBjaGVja2luZyB0aGUgYmFja2VuZCByb3V0ZSByb3V0ZXIuZ2V0KCcvdG9rZW4nKVxuICAgICRyb290U2NvcGUuJG9uKCckc3RhdGVDaGFuZ2VTdGFydCcsIGZ1bmN0aW9uIChldmVudCx0b1N0YXRlLCB0b1BhcmFtcykge1xuXG4gICAgICAgIC8vY29uc29sZS5sb2coJ3VzZXIgQXV0aGVudGljYXRlZCcsIEF1dGhTZXJ2aWNlLmlzQXV0aGVudGljYXRlZCgpKTtcblxuICAgICAgICBpZiAoIWRlc3RpbmF0aW9uU3RhdGVSZXF1aXJlc0F1dGgodG9TdGF0ZSkpIHtcbiAgICAgICAgICAgIC8vIFRoZSBkZXN0aW5hdGlvbiBzdGF0ZSBkb2VzIG5vdCByZXF1aXJlIGF1dGhlbnRpY2F0aW9uXG4gICAgICAgICAgICAvLyBTaG9ydCBjaXJjdWl0IHdpdGggcmV0dXJuLlxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKEF1dGhTZXJ2aWNlLmlzQXV0aGVudGljYXRlZCgpKSB7XG4gICAgICAgICAgICAvLyBUaGUgdXNlciBpcyBhdXRoZW50aWNhdGVkLlxuICAgICAgICAgICAgLy8gU2hvcnQgY2lyY3VpdCB3aXRoIHJldHVybi5cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vVE9ETzogTm90IHN1cmUgaG93IHRvIHByb2NlZWQgaGVyZVxuICAgICAgICAkc3RhdGUuZ28oJ2xvZ2luJyk7IC8vaWYgYWJvdmUgZmFpbHMsIGdvdG8gbG9naW5cbiAgICB9KTtcbiAgLy8gJHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZSgnL3NpZ251cCcpOyAvLyBUT0RPOiBSaWNoYXJkIHRlc3RpbmcgdGhpcyByb3V0ZVxuICAvLyR1cmxSb3V0ZXJQcm92aWRlci5vdGhlcndpc2UoJy9jaGFsbGVuZ2UvdmlldycpOyAvL1RPRE86IFRvbnkgdGVzdGluZyB0aGlzIHJvdXRlXG5cbn0pO1xuXG5hcHAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKXtcbiAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdtYWluJywge1xuICAgICAgIHRlbXBsYXRlVXJsOiAnZmVhdHVyZXMvY29tbW9uL21haW4vbWFpbi5odG1sJyxcbiAgICAgICBjb250cm9sbGVyOiAnTWVudUN0cmwnXG4gICB9KTtcbn0pO1xuXG5hcHAuY29udHJvbGxlcignTWFpbkN0cmwnLCBmdW5jdGlvbigkcm9vdFNjb3BlLCRzY29wZSwgJGlvbmljU2lkZU1lbnVEZWxlZ2F0ZSwgJGlvbmljUG9wdXAsICRzdGF0ZSwgQXV0aFNlcnZpY2UsQVVUSF9FVkVOVFMpe1xuICAgICRzY29wZS51c2VybmFtZSA9IEF1dGhTZXJ2aWNlLnVzZXJuYW1lKCk7XG4gICAgLy9jb25zb2xlLmxvZyhBdXRoU2VydmljZS5pc0F1dGhlbnRpY2F0ZWQoKSk7XG5cbiAgICAkc2NvcGUuJG9uKEFVVEhfRVZFTlRTLm5vdEF1dGhvcml6ZWQsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgIHZhciBhbGVydFBvcHVwID0gJGlvbmljUG9wdXAuYWxlcnQoe1xuICAgICAgICAgICAgdGl0bGU6ICdVbmF1dGhvcml6ZWQhJyxcbiAgICAgICAgICAgIHRlbXBsYXRlOiAnWW91IGFyZSBub3QgYWxsb3dlZCB0byBhY2Nlc3MgdGhpcyByZXNvdXJjZS4nXG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgJHNjb3BlLiRvbihBVVRIX0VWRU5UUy5ub3RBdXRoZW50aWNhdGVkLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICBBdXRoU2VydmljZS5sb2dvdXQoKTtcbiAgICAgICAgLy8kc3RhdGUuZ28oJ2xvZ2luJyk7XG4gICAgICAgIHZhciBhbGVydFBvcHVwID0gJGlvbmljUG9wdXAuYWxlcnQoe1xuICAgICAgICAgICAgdGl0bGU6ICdQbGVhc2UgUmV2aWV3JyxcbiAgICAgICAgICAgIHRlbXBsYXRlOiAnJ1xuICAgICAgICB9KTtcbiAgICB9KTtcbn0pO1xuXG5hcHAuY29udHJvbGxlcignTWVudUN0cmwnLCBmdW5jdGlvbigkc2NvcGUsICRpb25pY1NpZGVNZW51RGVsZWdhdGUsICRzdGF0ZSwgQXV0aFNlcnZpY2UsICRyb290U2NvcGUpe1xuXG4gICAgJHNjb3BlLnN0YXRlcyA9IFtcbiAgICAgICAge1xuICAgICAgICAgIG5hbWUgOiAnQWNjb3VudCcsXG4gICAgICAgICAgcmVmIDogZnVuY3Rpb24oKXtyZXR1cm4gJ2FjY291bnQnO31cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIG5hbWUgOiAnU2FuZGJveCcsXG4gICAgICAgICAgcmVmIDogZnVuY3Rpb24oKXtyZXR1cm4gJ3NhbmRib3guY29kZSc7fVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgbmFtZSA6ICdDaGF0cycsXG4gICAgICAgICAgcmVmOiBmdW5jdGlvbigpe3JldHVybiAnY2hhdHMnO31cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIG5hbWUgOiAnQ2hhbGxlbmdlcycsXG4gICAgICAgICAgcmVmOiBmdW5jdGlvbigpe3JldHVybiAnZXhlcmNpc20uY29tcGlsZSc7fVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgbmFtZSA6ICdFeGVyY2lzZXMnLFxuICAgICAgICAgIHJlZiA6IGZ1bmN0aW9uKCl7cmV0dXJuICdleGVyY2lzZXMudmlldyc7IH1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIG5hbWUgOiAnTXkgU25pcHBldHMnLFxuICAgICAgICAgIHJlZiA6IGZ1bmN0aW9uICgpe3JldHVybiAnc25pcHBldHMnO31cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIG5hbWUgOiAnQWJvdXQnLFxuICAgICAgICAgIHJlZiA6IGZ1bmN0aW9uKCl7IHJldHVybiAnYWJvdXQnO31cbiAgICAgICAgfVxuICAgICAgICAvLyB7XG4gICAgICAgIC8vICAgbmFtZSA6ICdDcmVhdGUgQ2hhbGxlbmdlcycsXG4gICAgICAgIC8vICAgcmVmIDogZnVuY3Rpb24oKXtyZXR1cm4gJ2V4ZXJjaXNlcyc7IH1cbiAgICAgICAgLy8gfVxuICAgIF07XG5cbiAgICAkc2NvcGUudG9nZ2xlTWVudVNob3cgPSBmdW5jdGlvbigpe1xuICAgICAgICAvL2NvbnNvbGUubG9nKCdBdXRoU2VydmljZScsQXV0aFNlcnZpY2UuaXNBdXRoZW50aWNhdGVkKCkpXG4gICAgICAgIC8vY29uc29sZS5sb2coJ3RvZ2dsZU1lbnVTaG93JyxBdXRoU2VydmljZS5pc0F1dGhlbnRpY2F0ZWQoKSk7XG4gICAgICAgIC8vVE9ETzogcmV0dXJuIEF1dGhTZXJ2aWNlLmlzQXV0aGVudGljYXRlZCgpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9O1xuXG4gICAgJHJvb3RTY29wZS4kb24oJ0F1dGgnLGZ1bmN0aW9uKCl7XG4gICAgICAgLy9jb25zb2xlLmxvZygnYXV0aCcpO1xuICAgICAgICRzY29wZS50b2dnbGVNZW51U2hvdygpO1xuICAgIH0pO1xuXG4gICAgLy9jb25zb2xlLmxvZyhBdXRoU2VydmljZS5pc0F1dGhlbnRpY2F0ZWQoKSk7XG4gICAgLy9pZihBdXRoU2VydmljZS5pc0F1dGhlbnRpY2F0ZWQoKSl7XG4gICAgJHNjb3BlLmNsaWNrSXRlbSA9IGZ1bmN0aW9uKHN0YXRlUmVmKXtcbiAgICAgICAgJGlvbmljU2lkZU1lbnVEZWxlZ2F0ZS50b2dnbGVMZWZ0KCk7XG4gICAgICAgICRzdGF0ZS5nbyhzdGF0ZVJlZigpKTsgLy9SQjogVXBkYXRlZCB0byBoYXZlIHN0YXRlUmVmIGFzIGEgZnVuY3Rpb24gaW5zdGVhZC5cbiAgICB9O1xuXG4gICAgJHNjb3BlLnRvZ2dsZU1lbnUgPSBmdW5jdGlvbigpe1xuICAgICAgICAkaW9uaWNTaWRlTWVudURlbGVnYXRlLnRvZ2dsZUxlZnQoKTtcbiAgICB9O1xuICAgIC8vfVxufSk7IiwiYXBwLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlcil7XG5cdCRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdhYm91dCcsIHtcblx0XHR1cmw6ICcvYWJvdXQnLFxuXHRcdHRlbXBsYXRlVXJsOiAnZmVhdHVyZXMvYWJvdXQvYWJvdXQuaHRtbCdcblx0fSk7XG59KTsiLCJhcHAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyLCBVU0VSX1JPTEVTKXtcblx0Ly8gRWFjaCB0YWIgaGFzIGl0cyBvd24gbmF2IGhpc3Rvcnkgc3RhY2s6XG5cdCRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdhY2NvdW50Jywge1xuXHRcdHVybDogJy9hY2NvdW50Jyxcblx0ICAgIHRlbXBsYXRlVXJsOiAnZmVhdHVyZXMvYWNjb3VudC9hY2NvdW50Lmh0bWwnLFxuXHRcdGNvbnRyb2xsZXI6ICdBY2NvdW50Q3RybCdcblx0XHQvLyAsXG5cdFx0Ly8gZGF0YToge1xuXHRcdC8vIFx0YXV0aGVudGljYXRlOiBbVVNFUl9ST0xFUy5wdWJsaWNdXG5cdFx0Ly8gfVxuXHR9KTtcbn0pO1xuXG5hcHAuY29udHJvbGxlcignQWNjb3VudEN0cmwnLCBmdW5jdGlvbigkc2NvcGUpIHtcblx0JHNjb3BlLnNldHRpbmdzID0ge1xuXHRcdGVuYWJsZUZyaWVuZHM6IHRydWVcblx0fTtcbn0pOyIsImFwcC5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIsIFVTRVJfUk9MRVMpe1xuXG4gICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdjaGF0cycsIHtcbiAgICAgIGNhY2hlOiBmYWxzZSwgLy90byBlbnN1cmUgdGhlIGNvbnRyb2xsZXIgaXMgbG9hZGluZyBlYWNoIHRpbWVcbiAgICAgIHVybDogJy9jaGF0cycsXG4gICAgICB0ZW1wbGF0ZVVybDogJ2ZlYXR1cmVzL2NoYXRzL3RhYi1jaGF0cy5odG1sJyxcbiAgICAgIGNvbnRyb2xsZXI6ICdDaGF0c0N0cmwnLFxuICAgICAgcmVzb2x2ZToge1xuICAgICAgICBmcmllbmRzOiBmdW5jdGlvbihGcmllbmRzRmFjdG9yeSkge1xuICAgICAgICAgIHJldHVybiBGcmllbmRzRmFjdG9yeS5nZXRGcmllbmRzKCkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdyZXNwb25zZS5kYXRhIGZyaWVuZHMnLHJlc3BvbnNlLmRhdGEuZnJpZW5kcyk7XG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UuZGF0YS5mcmllbmRzO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSlcbiAgICAuc3RhdGUoJ2NoYXQtZGV0YWlscycsIHtcbiAgICAgIGNhY2hlOiBmYWxzZSwgLy90byBlbnN1cmUgdGhlIGNvbnRyb2xsZXIgaXMgbG9hZGluZyBlYWNoIHRpbWVcbiAgICAgIHVybDogJy9jaGF0cy86aWQnLFxuICAgICAgdGVtcGxhdGVVcmw6ICdmZWF0dXJlcy9jaGF0cy9jaGF0LWRldGFpbC5odG1sJyxcbiAgICAgIGNvbnRyb2xsZXI6ICdDaGF0RGV0YWlsQ3RybCdcbiAgICB9KTtcbn0pO1xuXG5hcHAuY29udHJvbGxlcignQ2hhdHNDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBDaGF0cywgRnJpZW5kc0ZhY3RvcnksZnJpZW5kcywgJHN0YXRlLCBHaXN0RmFjdG9yeSkge1xuICBjb25zb2xlLmxvZygnaGVsbG8gd29ybGQnKTtcbiAgLy8kc2NvcGUuY2hhdHMgPSBDaGF0cy5hbGwoKTtcbiAgLy8kc2NvcGUucmVtb3ZlID0gZnVuY3Rpb24oY2hhdCkge1xuICAvLyAgQ2hhdHMucmVtb3ZlKGNoYXQpO1xuICAvL307XG5cbiAgJHNjb3BlLmRhdGEgPSB7fTtcbiAgJHNjb3BlLmZyaWVuZHMgPSBmcmllbmRzO1xuXG4gIGNvbnNvbGUubG9nKCdmcmllbmRzJyxmcmllbmRzKTtcbiAgLy9UT0RPOiBBZGQgZ2V0RnJpZW5kcyByb3V0ZSBhcyB3ZWxsIGFuZCBzYXZlIHRvIGxvY2FsU3RvcmFnZVxuICAvL0ZyaWVuZHNGYWN0b3J5LmdldEZyaWVuZHMoKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgLy8gIGNvbnNvbGUubG9nKCdyZXNwb25zZS5kYXRhIGZyaWVuZHMnLHJlc3BvbnNlLmRhdGEuZnJpZW5kcyk7XG4gIC8vICAkc2NvcGUuZnJpZW5kcyA9IHJlc3BvbnNlLmRhdGEuZnJpZW5kcztcbiAgLy99KTtcblxuICAkc2NvcGUuYWRkRnJpZW5kID0gZnVuY3Rpb24oKXtcbiAgICBjb25zb2xlLmxvZygnYWRkRnJpZW5kIGNsaWNrZWQnKTtcbiAgICBGcmllbmRzRmFjdG9yeS5hZGRGcmllbmQoJHNjb3BlLmRhdGEudXNlcm5hbWUpLnRoZW4oZnJpZW5kQWRkZWQsIGZyaWVuZE5vdEFkZGVkKTtcbiAgfTtcblxuICBmcmllbmRBZGRlZCA9IGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICBjb25zb2xlLmxvZygnZnJpZW5kQWRkZWQnLHJlc3BvbnNlLmRhdGEuZnJpZW5kKTtcbiAgICAkc2NvcGUuZnJpZW5kcy5wdXNoKHJlc3BvbnNlLmRhdGEuZnJpZW5kKTtcbiAgfTtcblxuICBmcmllbmROb3RBZGRlZCA9IGZ1bmN0aW9uKGVycil7XG4gICAgY29uc29sZS5sb2coZXJyKTtcbiAgfTtcblxuICBHaXN0RmFjdG9yeS5xdWV1ZWRHaXN0cygpLnRoZW4oYWRkU2hhcmVkR2lzdHNUb1Njb3BlKTtcblxuICBmdW5jdGlvbiBhZGRTaGFyZWRHaXN0c1RvU2NvcGUoZ2lzdHMpe1xuICAgIC8vY29uc29sZS5sb2coJ2FkZFNoYXJlZEdpc3RzVG9TY29wZScsZ2lzdHMuZGF0YSk7XG4gICAgJHNjb3BlLmdpc3RzID0gZ2lzdHMuZGF0YTtcbiAgICBGcmllbmRzRmFjdG9yeS5zZXRHaXN0cyhnaXN0cy5kYXRhKTtcbiAgfVxuXG4gICRzY29wZS5zaGFyZWRDb2RlID0gZnVuY3Rpb24oaWQpe1xuICAgIC8vY29uc29sZS5sb2coaWQpOyAvL2lkIG9mIGZyaWVuZCBnaXN0IHNoYXJlZCB3aXRoXG4gICAgJHN0YXRlLmdvKCdjaGF0LWRldGFpbHMnLHtpZDppZH0sIHtpbmhlcml0OmZhbHNlfSk7XG4gIH1cblxufSk7XG5cbmFwcC5jb250cm9sbGVyKCdDaGF0RGV0YWlsQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgJHN0YXRlUGFyYW1zLCBGcmllbmRzRmFjdG9yeSwkaW9uaWNNb2RhbCkge1xuICBjb25zb2xlLmxvZygnc3RhdGVQYXJhbXMnLCRzdGF0ZVBhcmFtcy5pZCwnZ2lzdHMnLEZyaWVuZHNGYWN0b3J5LmdldEdpc3RzKCkpO1xuICAvLyRzY29wZS5jaGF0ID0gQ2hhdHMuZ2V0KCRzdGF0ZVBhcmFtcy5jaGF0SWQpO1xuICAvL1RPRE86IFRoZXNlIGFyZSBhbGwgZ2lzdHMsIHlvdSBuZWVkIHRvIGZpbHRlciBiYXNlZCBvbiB0aGUgdXNlciBiZWZvcmUgcGxhY2Ugb24gc2NvcGUuXG4gICRzY29wZS5naXN0cyA9IFtdO1xuXG4gIC8vJHNjb3BlLmNvZGUgPSAnJztcblxuICB2YXIgYWxsR2lzdHMgPSBGcmllbmRzRmFjdG9yeS5nZXRHaXN0cygpIHx8IFtdO1xuXG4gICRzY29wZS5zaG93Q29kZSA9IGZ1bmN0aW9uKGNvZGUpe1xuICAgIGNvbnNvbGUubG9nKCdzaG93Q29kZScsY29kZSk7XG4gICAgJHNjb3BlLmNvZGUgPSBjb2RlO1xuICAgICRzY29wZS5vcGVuTW9kYWwoY29kZSk7XG4gIH07XG5cbiAgLy9UT0RPOiBPbmx5IHNob3cgYWxsIEdpc3RzIGZyb20gc3BlY2lmaWMgdXNlciBjbGlja2VkIG9uXG4gIC8vVE9ETzogTmVlZCB0byBhcHBseSBKU09OIHBhcnNlXG5cbiAgYWxsR2lzdHMuZm9yRWFjaChmdW5jdGlvbihnaXN0KXtcbiAgICBpZihnaXN0LnVzZXIgPT09ICRzdGF0ZVBhcmFtcy5pZCl7XG4gICAgICAkc2NvcGUuZ2lzdHMucHVzaChnaXN0Lmdpc3QuZmlsZXMuZmlsZU5hbWUuY29udGVudCk7XG4gICAgfVxuICB9KTtcblxuICAkaW9uaWNNb2RhbC5mcm9tVGVtcGxhdGVVcmwoJ2ZlYXR1cmVzL2NoYXRzL2NvZGUtbW9kYWwuaHRtbCcsIHtcbiAgICBzY29wZTogJHNjb3BlLFxuICAgIGFuaW1hdGlvbjogJ3NsaWRlLWluLXVwJ1xuICB9KS50aGVuKGZ1bmN0aW9uKG1vZGFsKSB7XG4gICAgJHNjb3BlLm1vZGFsID0gbW9kYWw7XG4gIH0pO1xuICAkc2NvcGUub3Blbk1vZGFsID0gZnVuY3Rpb24oY29kZSkge1xuICAgIC8vY29uc29sZS5sb2coY29kZSk7XG4gICAgJHNjb3BlLm1vZGFsLnNob3coKTtcbiAgfTtcbiAgJHNjb3BlLmNsb3NlTW9kYWwgPSBmdW5jdGlvbigpIHtcbiAgICAkc2NvcGUubW9kYWwuaGlkZSgpO1xuICB9O1xuICAvL0NsZWFudXAgdGhlIG1vZGFsIHdoZW4gd2UncmUgZG9uZSB3aXRoIGl0IVxuICAkc2NvcGUuJG9uKCckZGVzdHJveScsIGZ1bmN0aW9uKCkge1xuICAgICRzY29wZS5tb2RhbC5yZW1vdmUoKTtcbiAgfSk7XG4gIC8vIEV4ZWN1dGUgYWN0aW9uIG9uIGhpZGUgbW9kYWxcbiAgJHNjb3BlLiRvbignbW9kYWwuaGlkZGVuJywgZnVuY3Rpb24oKSB7XG4gICAgLy8gRXhlY3V0ZSBhY3Rpb25cbiAgfSk7XG4gIC8vIEV4ZWN1dGUgYWN0aW9uIG9uIHJlbW92ZSBtb2RhbFxuICAkc2NvcGUuJG9uKCdtb2RhbC5yZW1vdmVkJywgZnVuY3Rpb24oKSB7XG4gICAgLy8gRXhlY3V0ZSBhY3Rpb25cbiAgfSk7XG4gIC8vJHNjb3BlLmdpc3RzID0gRnJpZW5kc0ZhY3RvcnkuZ2V0R2lzdHMoKTtcblxufSk7XG5cbmFwcC5mYWN0b3J5KCdDaGF0cycsIGZ1bmN0aW9uKCkge1xuICAvLyBNaWdodCB1c2UgYSByZXNvdXJjZSBoZXJlIHRoYXQgcmV0dXJucyBhIEpTT04gYXJyYXlcblxuICAvLyBTb21lIGZha2UgdGVzdGluZyBkYXRhXG4gIHZhciBjaGF0cyA9IFt7XG4gICAgaWQ6IDAsXG4gICAgbmFtZTogJ0JlbiBTcGFycm93JyxcbiAgICBsYXN0VGV4dDogJ1lvdSBvbiB5b3VyIHdheT8nLFxuICAgIGZhY2U6ICdodHRwczovL3Bicy50d2ltZy5jb20vcHJvZmlsZV9pbWFnZXMvNTE0NTQ5ODExNzY1MjExMTM2LzlTZ0F1SGVZLnBuZydcbiAgfSwge1xuICAgIGlkOiAxLFxuICAgIG5hbWU6ICdNYXggTHlueCcsXG4gICAgbGFzdFRleHQ6ICdIZXksIGl0XFwncyBub3QgbWUnLFxuICAgIGZhY2U6ICdodHRwczovL2F2YXRhcnMzLmdpdGh1YnVzZXJjb250ZW50LmNvbS91LzExMjE0P3Y9MyZzPTQ2MCdcbiAgfSx7XG4gICAgaWQ6IDIsXG4gICAgbmFtZTogJ0FkYW0gQnJhZGxleXNvbicsXG4gICAgbGFzdFRleHQ6ICdJIHNob3VsZCBidXkgYSBib2F0JyxcbiAgICBmYWNlOiAnaHR0cHM6Ly9wYnMudHdpbWcuY29tL3Byb2ZpbGVfaW1hZ2VzLzQ3OTA5MDc5NDA1ODM3OTI2NC84NFRLal9xYS5qcGVnJ1xuICB9LCB7XG4gICAgaWQ6IDMsXG4gICAgbmFtZTogJ1BlcnJ5IEdvdmVybm9yJyxcbiAgICBsYXN0VGV4dDogJ0xvb2sgYXQgbXkgbXVrbHVrcyEnLFxuICAgIGZhY2U6ICdodHRwczovL3Bicy50d2ltZy5jb20vcHJvZmlsZV9pbWFnZXMvNDkxOTk1Mzk4MTM1NzY3MDQwL2llMlpfVjZlLmpwZWcnXG4gIH0sIHtcbiAgICBpZDogNCxcbiAgICBuYW1lOiAnTWlrZSBIYXJyaW5ndG9uJyxcbiAgICBsYXN0VGV4dDogJ1RoaXMgaXMgd2lja2VkIGdvb2QgaWNlIGNyZWFtLicsXG4gICAgZmFjZTogJ2h0dHBzOi8vcGJzLnR3aW1nLmNvbS9wcm9maWxlX2ltYWdlcy81NzgyMzcyODEzODQ4NDEyMTYvUjNhZTFuNjEucG5nJ1xuICB9XTtcblxuICByZXR1cm4ge1xuICAgIGFsbDogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gY2hhdHM7XG4gICAgfSxcbiAgICByZW1vdmU6IGZ1bmN0aW9uKGNoYXQpIHtcbiAgICAgIGNoYXRzLnNwbGljZShjaGF0cy5pbmRleE9mKGNoYXQpLCAxKTtcbiAgICB9LFxuICAgIGdldDogZnVuY3Rpb24oY2hhdElkKSB7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoYXRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChjaGF0c1tpXS5pZCA9PT0gcGFyc2VJbnQoY2hhdElkKSkge1xuICAgICAgICAgIHJldHVybiBjaGF0c1tpXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICB9O1xufSk7XG5cbmFwcC5mYWN0b3J5KCdGcmllbmRzRmFjdG9yeScsZnVuY3Rpb24oJGh0dHAsJHEsQXBpRW5kcG9pbnQpe1xuICAvL2dldCB1c2VyIHRvIGFkZCBhbmQgcmVzcG9uZCB0byB1c2VyXG4gIHZhciBhbGxHaXN0cyA9IFtdO1xuICB2YXIgYWRkRnJpZW5kID0gZnVuY3Rpb24oZnJpZW5kKXtcbiAgICAvL2NvbnNvbGUubG9nKGZyaWVuZCk7XG4gICAgcmV0dXJuICRodHRwLnBvc3QoQXBpRW5kcG9pbnQudXJsK1wiL3VzZXIvYWRkRnJpZW5kXCIse2ZyaWVuZDpmcmllbmR9KTtcbiAgfTtcblxuICB2YXIgZ2V0RnJpZW5kcyA9IGZ1bmN0aW9uKCl7XG4gICAgLy9jb25zb2xlLmxvZygnZ2V0RnJpZW5kcyBjYWxsZWQnKVxuICAgIHJldHVybiAkaHR0cC5nZXQoQXBpRW5kcG9pbnQudXJsICsgXCIvdXNlci9nZXRGcmllbmRzXCIpO1xuICB9O1xuXG5cbiAgLy9UT0RPOiBSZW1vdmUgR2lzdHMgZnJvbSBGcmllbmRzRmFjdG9yeSAtIHNob3VsZCBiZSBpbiBnaXN0IGZhY3RvcnkgYW5kIGxvYWRlZCBvbiBzdGFydFxuICAvL1RPRE86IFlvdSBuZWVkIHRvIHJlZmFjdG9yIGJlY2F1c2UgeW91IG1heSBlbmQgdXAgb24gYW55IHBhZ2Ugd2l0aG91dCBhbnkgZGF0YSBiZWNhdXNlIGl0IHdhcyBub3QgYXZhaWxhYmxlIGluIHRoZSBwcmV2aW91cyBwYWdlICh0aGUgcHJldmlvdXMgcGFnZSB3YXMgbm90IGxvYWRlZClcbiAgdmFyIHNldEdpc3RzID0gZnVuY3Rpb24oZ2lzdHMpe1xuICAgIC8vY29uc29sZS5sb2coJ3NldEdpc3RzJyk7XG4gICAgYWxsR2lzdHMgPSBnaXN0cztcbiAgfTtcblxuICB2YXIgZ2V0R2lzdHMgPSBmdW5jdGlvbigpe1xuICAgIGNvbnNvbGUubG9nKCdhbGxHaXN0cycsYWxsR2lzdHMpO1xuICAgIHJldHVybiBhbGxHaXN0cy5naXN0cztcbiAgfTtcblxuICByZXR1cm4ge1xuICAgIGFkZEZyaWVuZDogYWRkRnJpZW5kLFxuICAgIGdldEZyaWVuZHM6IGdldEZyaWVuZHMsXG4gICAgZ2V0R2lzdHM6IGdldEdpc3RzLFxuICAgIHNldEdpc3RzOiBzZXRHaXN0c1xuICB9O1xuXG4gIC8vVE9ETzogVXNlciBpcyBub3QgbG9nZ2VkIGluLCBzbyB5b3UgY2Fubm90IGFkZCBhIGZyaWVuZFxufSk7XG4iLCJhcHAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKXtcblx0JHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2V4ZXJjaXNlJyx7XG5cdFx0dXJsOiAnL2V4ZXJjaXNlLzpzbHVnJyxcblx0XHRhYnN0cmFjdDogdHJ1ZSxcblx0XHR0ZW1wbGF0ZVVybCA6ICdmZWF0dXJlcy9leGVyY2lzZS9leGVyY2lzZS5odG1sJ1xuXHR9KTtcbn0pO1xuXG5hcHAuZmFjdG9yeSgnRXhlcmNpc2VGYWN0b3J5JywgZnVuY3Rpb24oKXtcblxufSk7IiwiYXBwLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlcil7XG5cdCRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdleGVyY2lzZS5jb2RlJywge1xuXHRcdHVybCA6ICcvZXhlcmNpc2UvOnNsdWcvY29kZScsXG5cdFx0dmlld3MgOiB7XG5cdFx0XHQndGFiLWNvZGUnIDoge1xuXHRcdFx0XHR0ZW1wbGF0ZVVybCA6ICdmZWF0dXJlcy9leGVyY2lzZS1jb2RlL2V4ZXJjaXNlLWNvZGUuaHRtbCcsXG5cdFx0XHRcdGNvbnRyb2xsZXI6ICdFeGVyY2lzZUNvZGVDdHJsJ1xuXHRcdFx0fVxuXHRcdH1cblx0fSk7XG59KTtcblxuYXBwLmNvbnRyb2xsZXIoJ0V4ZXJjaXNlQ29kZUN0cmwnLCBmdW5jdGlvbigkc2NvcGUpe1xufSk7IiwiYXBwLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlcil7XG5cdCRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdleGVyY2lzZS5jb21waWxlJywge1xuXHRcdHVybCA6ICcvZXhlcmNpc2UvOnNsdWcvY29tcGlsZScsXG5cdFx0dmlld3MgOiB7XG5cdFx0XHQndGFiLWNvbXBpbGUnIDoge1xuXHRcdFx0XHR0ZW1wbGF0ZVVybCA6ICdmZWF0dXJlcy9leGVyY2lzZS1jb21waWxlL2V4ZXJjaXNlLWNvbXBpbGUuaHRtbCcsXG5cdFx0XHRcdGNvbnRyb2xsZXI6ICdFeGVyY2lzZUNvbXBpbGVDdHJsJ1xuXHRcdFx0fVxuXHRcdH1cblx0fSk7XG59KTtcblxuYXBwLmNvbnRyb2xsZXIoJ0V4ZXJjaXNlQ29tcGlsZUN0cmwnLCBmdW5jdGlvbigkc2NvcGUpe1xuXG59KTsiLCJhcHAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKXtcblx0JHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2V4ZXJjaXNlLnRlc3QnLCB7XG5cdFx0dXJsIDogJy9leGVyY2lzZS86c2x1Zy90ZXN0Jyxcblx0XHR2aWV3cyA6IHtcblx0XHRcdCd0YWItdGVzdCcgOiB7XG5cdFx0XHRcdHRlbXBsYXRlVXJsIDogJ2ZlYXR1cmVzL2V4ZXJjaXNlLXRlc3QvZXhlcmNpc2UtdGVzdC5odG1sJyxcblx0XHRcdFx0Y29udHJvbGxlcjogJ0V4ZXJjaXNlVGVzdEN0cmwnXG5cdFx0XHR9XG5cdFx0fVxuXHR9KTtcbn0pO1xuXG5hcHAuY29udHJvbGxlcignRXhlcmNpc2VUZXN0Q3RybCcsIGZ1bmN0aW9uKCRzY29wZSl7XG5cbn0pOyIsImFwcC5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIpe1xuXHQkc3RhdGVQcm92aWRlci5zdGF0ZSgnZXhlcmNpc2UudmlldycsIHtcblx0XHR1cmwgOiAnL2V4ZXJjaXNlLzpzbHVnL3ZpZXcnLFxuXHRcdHZpZXdzIDoge1xuXHRcdFx0J3RhYi12aWV3JyA6IHtcblx0XHRcdFx0dGVtcGxhdGVVcmwgOiAnZmVhdHVyZXMvZXhlcmNpc2Utdmlldy9leGVyY2lzZS12aWV3Lmh0bWwnLFxuXHRcdFx0XHRjb250cm9sbGVyOiAnRXhlcmNpc2VWaWV3Q3RybCdcblx0XHRcdH1cblx0XHR9XG5cdH0pO1xufSk7XG5cbmFwcC5jb250cm9sbGVyKCdFeGVyY2lzZVZpZXdDdHJsJywgZnVuY3Rpb24oJHNjb3BlKXtcblxufSk7IiwiYXBwLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlcil7XG5cdCRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdleGVyY2lzZS52aWV3LWVkaXQnLCB7XG5cdFx0dXJsIDogJy9leGVyY2lzZS86c2x1Zy92aWV3L2VkaXQnLFxuXHRcdHZpZXdzIDoge1xuXHRcdFx0J3RhYi12aWV3JyA6IHtcblx0XHRcdFx0dGVtcGxhdGVVcmwgOiAnZmVhdHVyZXMvZXhlcmNpc2Utdmlldy1lZGl0L2V4ZXJjaXNlLXZpZXctZWRpdC5odG1sJyxcblx0XHRcdFx0Y29udHJvbGxlcjogJ0V4ZXJjaXNlVmlld0VkaXRDdHJsJ1xuXHRcdFx0fVxuXHRcdH1cblx0fSk7XG59KTtcblxuYXBwLmNvbnRyb2xsZXIoJ0V4ZXJjaXNlVmlld0VkaXRDdHJsJywgZnVuY3Rpb24oJHNjb3BlKXtcblxufSk7IiwiYXBwLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlcil7XG5cdCRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdleGVyY2lzZXMnLCB7XG5cdFx0dXJsIDogJy9leGVyY2lzZXMnLFxuXHRcdHRlbXBsYXRlVXJsIDogJ2ZlYXR1cmVzL2V4ZXJjaXNlcy9leGVyY2lzZXMuaHRtbCcsXG5cdFx0Y29udHJvbGxlcjogJ0V4ZXJjaXNlc0N0cmwnXG5cdH0pO1xufSk7XG5cbmFwcC5jb250cm9sbGVyKCdFeGVyY2lzZXNDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCAkc3RhdGUpe1xuXHQkc2NvcGUuY3JlYXRlID0gZnVuY3Rpb24oKXtcblx0XHQkc3RhdGUuZ28oJ2V4ZXJjaXNlcy1jcmVhdGUnKTtcblx0fTtcbn0pO1xuXG5hcHAuZmFjdG9yeSgnRXhlcmNpc2VGYWN0b3J5JywgZnVuY3Rpb24oJGxvY2Fsc3RvcmFnZSl7XG5cdHZhciBleGVyY2lzZXMgPSAkbG9jYWxzdG9yYWdlLmdldE9iamVjdCgnZXhlcmNpc2VzJyk7XG5cdGlmKHdpbmRvdy5fLmlzRW1wdHkoZXhlcmNpc2VzKSkgZXhlcmNpc2VzID0gW107XG5cblx0cmV0dXJuIHtcblx0XHRnZXRFeGVyY2lzZXMgOiBmdW5jdGlvbigpe1xuXHRcdFx0cmV0dXJuIGV4ZXJjaXNlcztcblx0XHR9LFxuXHRcdGNyZWF0ZUV4ZXJjaXNlIDogZnVuY3Rpb24oZXhlcmNpc2Upe1xuXHRcdFx0ZXhlcmNpc2VzLnB1c2goZXhlcmNpc2UpO1xuXHRcdFx0JGxvY2Fsc3RvcmFnZS5zZXRPYmplY3QoZXhlcmNpc2VzKTtcblx0XHR9LFxuXHRcdGdldEV4ZXJjaXNlIDogZnVuY3Rpb24oc2x1Zyl7XG5cdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGV4ZXJjaXNlcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRpZiAoZXhlcmNpc2VzW2ldLnNsdWcgPT09IHNsdWcpIHJldHVybiBleGVyY2lzZXNbaV07XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4ge307XG5cdFx0fSxcblx0XHR1cGRhdGVFeGVyY2lzZSA6IGZ1bmN0aW9uKGV4ZXJjaXNlKXtcblx0XHRcdGZvcih2YXIgaSA9IDA7IGkgPCBleGVyY2lzZXMubGVuZ3RoOyBpKyspe1xuXG5cdFx0XHR9XG5cdFx0fSxcblx0XHRkZWxldGVFeGVyY2lzZSA6IGZ1bmN0aW9uKCl7XG5cblx0XHR9XG5cdH07XG59KTsiLCJhcHAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKXtcblx0JHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2V4ZXJjaXNlcy1jcmVhdGUnLCB7XG5cdFx0dXJsIDogJy9leGVyY2lzZXMvY3JlYXRlJyxcblx0XHR0ZW1wbGF0ZVVybCA6ICdmZWF0dXJlcy9leGVyY2lzZXMtY3JlYXRlL2V4ZXJjaXNlcy1jcmVhdGUuaHRtbCcsXG5cdFx0Y29udHJvbGxlcjogJ0V4ZXJjaXNlc0NyZWF0ZUN0cmwnXG5cdH0pO1xufSk7XG5cbmFwcC5jb250cm9sbGVyKCdFeGVyY2lzZXNDcmVhdGVDdHJsJywgZnVuY3Rpb24oJHNjb3BlKXtcblxufSk7IiwiYXBwLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlcil7XG5cdCRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdleGVyY2lzbScsIHtcblx0XHR0ZW1wbGF0ZVVybCA6ICdmZWF0dXJlcy9leGVyY2lzbS9leGVyY2lzbS5odG1sJyxcblx0XHRhYnN0cmFjdCA6IHRydWUsXG5cdFx0cmVzb2x2ZSA6IHtcblx0XHRcdG1hcmtkb3duIDogZnVuY3Rpb24oQXZhaWxhYmxlRXhlcmNpc2VzLCBFeGVyY2lzbUZhY3RvcnksICRzdGF0ZSl7XG5cblx0XHRcdFx0aWYoRXhlcmNpc21GYWN0b3J5LmdldFRlc3RTY3JpcHQoKS5sZW5ndGggPT09IDApIHtcblx0XHRcdFx0XHR2YXIgZXhlcmNpc2UgPSBBdmFpbGFibGVFeGVyY2lzZXMuZ2V0UmFuZG9tRXhlcmNpc2UoKTtcblx0XHRcdFx0XHRFeGVyY2lzbUZhY3Rvcnkuc2V0TmFtZShleGVyY2lzZS5uYW1lKTtcblx0XHRcdFx0XHRyZXR1cm4gRXhlcmNpc21GYWN0b3J5LmdldEV4dGVybmFsU2NyaXB0KGV4ZXJjaXNlLmxpbmspLnRoZW4oZnVuY3Rpb24oZGF0YSl7XG5cdFx0XHRcdFx0XHRyZXR1cm4gRXhlcmNpc21GYWN0b3J5LmdldEV4dGVybmFsTWQoZXhlcmNpc2UubWRMaW5rKTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0fVxuXHR9KTtcbn0pO1xuXG5hcHAuZmFjdG9yeSgnRXhlcmNpc21GYWN0b3J5JywgZnVuY3Rpb24oJGh0dHAsICRyb290U2NvcGUpe1xuXHR2YXIgbmFtZSA9ICcnO1xuXHR2YXIgdGVzdCA9ICcnO1xuXHR2YXIgY29kZSA9ICcnO1xuXHR2YXIgbWFya2Rvd24gPSAnJztcblxuXHRyZXR1cm4ge1xuXHRcdGdldEV4dGVybmFsU2NyaXB0IDogZnVuY3Rpb24obGluayl7XG5cdFx0XHRyZXR1cm4gJGh0dHAuZ2V0KGxpbmspLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuXHRcdFx0XHR0ZXN0ID0gcmVzcG9uc2UuZGF0YTtcblx0XHRcdFx0cmV0dXJuIHJlc3BvbnNlLmRhdGE7XG5cdFx0XHR9KTtcblx0XHR9LFxuXHRcdGdldEV4dGVybmFsTWQgOiBmdW5jdGlvbihsaW5rKXtcblx0XHRcdHJldHVybiAkaHR0cC5nZXQobGluaykudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG5cdFx0XHRcdG1hcmtkb3duID0gcmVzcG9uc2UuZGF0YTtcblx0XHRcdFx0cmV0dXJuIHJlc3BvbnNlLmRhdGE7XG5cdFx0XHR9KTtcblx0XHR9LFxuXHRcdHNldE5hbWUgOiBmdW5jdGlvbihzZXROYW1lKXtcblx0XHRcdG5hbWUgPSBzZXROYW1lO1xuXHRcdH0sXG5cdFx0c2V0VGVzdFNjcmlwdCA6IGZ1bmN0aW9uKHRlc3Qpe1xuXHRcdFx0dGVzdCA9IHRlc3Q7XG5cdFx0XHQkcm9vdFNjb3BlLiRicm9hZGNhc3QoJ3Rlc3RDaGFuZ2UnLCB0ZXN0KTtcblx0XHR9LFxuXHRcdHNldENvZGVTY3JpcHQgOiBmdW5jdGlvbiAoY29kZSl7XG5cdFx0XHRjb2RlID0gY29kZTtcblx0XHRcdCRyb290U2NvcGUuJGJyb2FkY2FzdCgnY29kZUNoYW5nZScsIGNvZGUpO1xuXHRcdH0sXG5cdFx0Z2V0VGVzdFNjcmlwdCA6IGZ1bmN0aW9uKCl7XG5cdFx0XHRyZXR1cm4gdGVzdDtcblx0XHR9LFxuXHRcdGdldENvZGVTY3JpcHQgOiBmdW5jdGlvbigpe1xuXHRcdFx0cmV0dXJuIGNvZGU7XG5cdFx0fSxcblx0XHRnZXRNYXJrZG93biA6IGZ1bmN0aW9uKCl7XG5cdFx0XHRyZXR1cm4gbWFya2Rvd247XG5cdFx0fSxcblx0XHRnZXROYW1lIDogZnVuY3Rpb24oKXtcblx0XHRcdHJldHVybiBuYW1lO1xuXHRcdH1cblx0fTtcbn0pO1xuXG5hcHAuZmFjdG9yeSgnQXZhaWxhYmxlRXhlcmNpc2VzJywgZnVuY3Rpb24oKXtcblxuXHR2YXIgbGlicmFyeSA9IFtcblx0XHQvLyAnYWNjdW11bGF0ZScsXG5cdFx0Ly8gJ2FsbGVyZ2llcycsXG5cdFx0Ly8gJ2FuYWdyYW0nLFxuXHRcdC8vICdhdGJhc2gtY2lwaGVyJyxcblx0XHQvLyAnYmVlci1zb25nJyxcblx0XHQvLyAnYmluYXJ5Jyxcblx0XHQvLyAnYmluYXJ5LXNlYXJjaC10cmVlJyxcblx0XHQvLyAnYm9iJyxcblx0XHQvLyAnYnJhY2tldC1wdXNoJyxcblx0XHQvLyAnY2lyY3VsYXItYnVmZmVyJyxcblx0XHQvLyAnY2xvY2snLFxuXHRcdC8vICdjcnlwdG8tc3F1YXJlJyxcblx0XHQvLyAnY3VzdG9tLXNldCcsXG5cdFx0Ly8gJ2RpZmZlcmVuY2Utb2Ytc3F1YXJlcycsXG5cdFx0Ly8gJ2V0bCcsXG5cdFx0Ly8gJ2Zvb2QtY2hhaW4nLFxuXHRcdC8vICdnaWdhc2Vjb25kJyxcblx0XHQvLyAnZ3JhZGUtc2Nob29sJyxcblx0XHQvLyAnZ3JhaW5zJyxcblx0XHQvLyAnaGFtbWluZycsXG5cdFx0J2hlbGxvLXdvcmxkJ1xuXHRcdC8vICdoZXhhZGVjaW1hbCdcblx0XTtcblxuXHR2YXIgZ2VuZXJhdGVMaW5rID0gZnVuY3Rpb24obmFtZSl7XG5cdFx0cmV0dXJuICdleGVyY2lzbS9qYXZhc2NyaXB0LycgKyBuYW1lICsgJy8nICsgbmFtZSArICdfdGVzdC5zcGVjLmpzJztcblx0fTtcblxuXHR2YXIgZ2VuZXJhdGVNZExpbmsgPSBmdW5jdGlvbihuYW1lKXtcblx0XHRyZXR1cm4gJ2V4ZXJjaXNtL2phdmFzY3JpcHQvJyArIG5hbWUgKyAnLycgKyBuYW1lICsgJy5tZCc7XG5cdH07XG5cblx0dmFyIGdlbmVyYXRlUmFuZG9tID0gZnVuY3Rpb24oKXtcblx0XHR2YXIgcmFuZG9tID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogbGlicmFyeS5sZW5ndGgpO1xuXHRcdHJldHVybiBsaWJyYXJ5W3JhbmRvbV07XG5cdH07XG5cblx0cmV0dXJuIHtcblx0XHRnZXRTcGVjaWZpY0V4ZXJjaXNlIDogZnVuY3Rpb24obmFtZSl7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRsaW5rIDogZ2VuZXJhdGVMaW5rKG5hbWUpLFxuXHRcdFx0XHRtZExpbmsgOiBnZW5lcmF0ZU1kTGluayhuYW1lKVxuXHRcdFx0fTtcblx0XHR9LFxuXHRcdGdldFJhbmRvbUV4ZXJjaXNlIDogZnVuY3Rpb24oKXtcblx0XHRcdHZhciBuYW1lID0gZ2VuZXJhdGVSYW5kb20oKTtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdG5hbWUgOiBuYW1lLFxuXHRcdFx0XHRsaW5rIDogZ2VuZXJhdGVMaW5rKG5hbWUpLFxuXHRcdFx0XHRtZExpbmsgOiBnZW5lcmF0ZU1kTGluayhuYW1lKVxuXHRcdFx0fTtcblx0XHR9XG5cdH07XG59KTsiLCJhcHAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKXtcblx0JHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2V4ZXJjaXNtLmNvZGUnLCB7XG5cdFx0dXJsIDogJy9leGVyY2lzbS9jb2RlJyxcblx0XHR2aWV3cyA6IHtcblx0XHRcdCd0YWItY29kZScgOiB7XG5cdFx0XHRcdHRlbXBsYXRlVXJsIDogJ2ZlYXR1cmVzL2V4ZXJjaXNtLWNvZGUvZXhlcmNpc20tY29kZS5odG1sJyxcblx0XHRcdFx0Y29udHJvbGxlcjogJ0V4ZXJjaXNtQ29kZUN0cmwnXG5cdFx0XHR9XG5cdFx0fVxuXHR9KTtcbn0pO1xuXG5hcHAuY29udHJvbGxlcignRXhlcmNpc21Db2RlQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgRXhlcmNpc21GYWN0b3J5LCAkc3RhdGUsIEtleWJvYXJkRmFjdG9yeSl7XG5cdCRzY29wZS5uYW1lID0gRXhlcmNpc21GYWN0b3J5LmdldE5hbWUoKTtcblx0JHNjb3BlLmNvZGUgPSB7XG5cdFx0dGV4dCA6IG51bGxcblx0fTtcblxuXHQkc2NvcGUuY29kZS50ZXh0ID0gRXhlcmNpc21GYWN0b3J5LmdldENvZGVTY3JpcHQoKTtcblx0Ly9kb2Vzbid0IGRvIGFueXRoaW5nIHJpZ2h0IG5vdyAtIG1heWJlIHB1bGwgcHJldmlvdXNseSBzYXZlZCBjb2RlXG5cblx0Ly9wYXNzaW5nIHRoaXMgdXBkYXRlIGZ1bmN0aW9uIHNvIHRoYXQgb24gdGV4dCBjaGFuZ2UgaW4gdGhlIGRpcmVjdGl2ZSB0aGUgZmFjdG9yeSB3aWxsIGJlIGFsZXJ0ZWRcblx0JHNjb3BlLmNvbXBpbGUgPSBmdW5jdGlvbihjb2RlKXtcblx0XHRFeGVyY2lzbUZhY3Rvcnkuc2V0Q29kZVNjcmlwdChjb2RlKTtcblx0XHQvLyAkc3RhdGUuZ28oJ2V4ZXJjaXNtLmNvbXBpbGUnKTtcblx0fTtcblxuXHQkc2NvcGUuaW5zZXJ0RnVuYyA9IEtleWJvYXJkRmFjdG9yeS5tYWtlSW5zZXJ0RnVuYygkc2NvcGUpO1xuXG59KTsiLCJhcHAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKXtcblx0JHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2V4ZXJjaXNtLmNvbXBpbGUnLCB7XG5cdFx0dXJsIDogJy9leGVyY2lzbS9jb21waWxlJyxcblx0XHR2aWV3cyA6IHtcblx0XHRcdCd0YWItY29tcGlsZScgOiB7XG5cdFx0XHRcdHRlbXBsYXRlVXJsIDogJ2ZlYXR1cmVzL2V4ZXJjaXNtLWNvbXBpbGUvZXhlcmNpc20tY29tcGlsZS5odG1sJyxcblx0XHRcdFx0Y29udHJvbGxlcjogJ0V4ZXJjaXNtQ29tcGlsZUN0cmwnXG5cdFx0XHR9XG5cdFx0fSxcblx0XHRvbkVudGVyIDogZnVuY3Rpb24oKXtcblx0XHRcdGlmKHdpbmRvdy5qYXNtaW5lKSB3aW5kb3cuamFzbWluZS5nZXRFbnYoKS5leGVjdXRlKCk7XG5cdFx0fVxuXHR9KTtcbn0pO1xuXG5hcHAuY29udHJvbGxlcignRXhlcmNpc21Db21waWxlQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgRXhlcmNpc21GYWN0b3J5KXtcblx0JHNjb3BlLm5hbWUgPSBFeGVyY2lzbUZhY3RvcnkuZ2V0TmFtZSgpO1xuXHQkc2NvcGUuY29tcGlsaW5nID0ge1xuXHRcdHRlc3Q6IG51bGwsXG5cdFx0Y29kZSA6IG51bGxcblx0fTtcblx0JHNjb3BlLmNvbXBpbGluZy50ZXN0ID0gRXhlcmNpc21GYWN0b3J5LmdldFRlc3RTY3JpcHQoKTtcblx0JHNjb3BlLmNvbXBpbGluZy5jb2RlID0gRXhlcmNpc21GYWN0b3J5LmdldENvZGVTY3JpcHQoKTtcblxuXG5cdCRzY29wZS4kb24oJ3Rlc3RDaGFuZ2UnLCBmdW5jdGlvbihldmVudCwgZGF0YSl7XG5cdFx0JHNjb3BlLmNvbXBpbGluZy50ZXN0ID0gZGF0YTtcblx0fSk7XG5cblx0JHNjb3BlLiRvbignY29kZUNoYW5nZScsIGZ1bmN0aW9uKGV2ZW50LCBkYXRhKXtcblx0XHQkc2NvcGUuY29tcGlsaW5nLmNvZGUgPSBkYXRhO1xuXHR9KTtcbn0pOyIsImFwcC5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIpe1xuXHQkc3RhdGVQcm92aWRlci5zdGF0ZSgnZXhlcmNpc20udGVzdCcsIHtcblx0XHR1cmwgOiAnL2V4ZXJjaXNtL3Rlc3QnLFxuXHRcdHZpZXdzIDoge1xuXHRcdFx0J3RhYi10ZXN0JyA6IHtcblx0XHRcdFx0dGVtcGxhdGVVcmwgOiAnZmVhdHVyZXMvZXhlcmNpc20tdGVzdC9leGVyY2lzbS10ZXN0Lmh0bWwnLFxuXHRcdFx0XHRjb250cm9sbGVyIDogJ0V4ZXJjaXNtVGVzdEN0cmwnXG5cdFx0XHR9XG5cdFx0fVxuXHR9KTtcbn0pO1xuXG5hcHAuY29udHJvbGxlcignRXhlcmNpc21UZXN0Q3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgRXhlcmNpc21GYWN0b3J5KXtcblxuXHQkc2NvcGUubmFtZSA9IEV4ZXJjaXNtRmFjdG9yeS5nZXROYW1lKCk7XG5cblx0JHNjb3BlLnRlc3QgPSB7XG5cdFx0dGV4dDogbnVsbFxuXHR9O1xuXG5cdCRzY29wZS50ZXN0LnRleHQgPSBFeGVyY2lzbUZhY3RvcnkuZ2V0VGVzdFNjcmlwdCgpO1xuXG5cdCRzY29wZS4kd2F0Y2goJ3Rlc3QudGV4dCcsIGZ1bmN0aW9uKG5ld1ZhbHVlKXtcblx0XHRFeGVyY2lzbUZhY3Rvcnkuc2V0VGVzdFNjcmlwdChuZXdWYWx1ZSk7XG5cdH0pO1xufSk7IiwiYXBwLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlcil7XG5cdCRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdleGVyY2lzbS52aWV3Jywge1xuXHRcdHVybDogJy9leGVyY2lzbS92aWV3Jyxcblx0XHR2aWV3czoge1xuXHRcdFx0J3RhYi12aWV3JyA6IHtcblx0XHRcdFx0dGVtcGxhdGVVcmw6ICdmZWF0dXJlcy9leGVyY2lzbS12aWV3L2V4ZXJjaXNtLXZpZXcuaHRtbCcsXG5cdFx0XHRcdGNvbnRyb2xsZXI6ICdFeGVyY2lzbVZpZXdDdHJsJ1xuXHRcdFx0fVxuXHRcdH1cblx0fSk7XG59KTtcblxuYXBwLmNvbnRyb2xsZXIoJ0V4ZXJjaXNtVmlld0N0cmwnLCBmdW5jdGlvbigkc2NvcGUsIEV4ZXJjaXNtRmFjdG9yeSl7XG5cdCRzY29wZS5tYXJrZG93biA9IEV4ZXJjaXNtRmFjdG9yeS5nZXRNYXJrZG93bigpO1xuXHQkc2NvcGUubmFtZSA9IEV4ZXJjaXNtRmFjdG9yeS5nZXROYW1lKCk7XG59KTsiLCJhcHAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKXtcblx0JHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2xvZ2luJywge1xuXHRcdHVybCA6ICcvbG9naW4nLFxuXHRcdHRlbXBsYXRlVXJsIDogJ2ZlYXR1cmVzL2xvZ2luL2xvZ2luLmh0bWwnLFxuXHRcdGNvbnRyb2xsZXIgOiAnTG9naW5DdHJsJ1xuXHR9KTtcbn0pO1xuXG5hcHAuY29udHJvbGxlcignTG9naW5DdHJsJywgZnVuY3Rpb24oJHJvb3RTY29wZSwgJHNjb3BlLCAkaW9uaWNQb3B1cCwgJHN0YXRlLCBBdXRoU2VydmljZSl7XG5cdCRzY29wZS5kYXRhID0ge307XG5cdCRzY29wZS5lcnJvciA9IG51bGw7XG5cbiAgICAkc2NvcGUuc2lnbnVwID0gZnVuY3Rpb24oKXtcbiAgICAgICAgJHN0YXRlLmdvKCdzaWdudXAnKTtcbiAgICB9O1xuXG5cdCRzY29wZS5sb2dpbiA9IGZ1bmN0aW9uKCl7XG5cdFx0QXV0aFNlcnZpY2Vcblx0XHRcdC5sb2dpbigkc2NvcGUuZGF0YSlcblx0XHRcdC50aGVuKGZ1bmN0aW9uKGF1dGhlbnRpY2F0ZWQpeyAvL1RPRE86YXV0aGVudGljYXRlZCBpcyB3aGF0IGlzIHJldHVybmVkXG5cdFx0XHRcdC8vY29uc29sZS5sb2coJ2xvZ2luLCB0YWIuY2hhbGxlbmdlLXN1Ym1pdCcpO1xuXHRcdFx0XHQvLyRzY29wZS5tZW51ID0gdHJ1ZTtcblx0XHRcdFx0JHJvb3RTY29wZS4kYnJvYWRjYXN0KCdBdXRoJyk7XG5cdFx0XHRcdCRzY29wZS5zdGF0ZXMucHVzaCh7IC8vVE9ETzogTmVlZCB0byBhZGQgYSBwYXJlbnQgY29udHJvbGxlciB0byBjb21tdW5pY2F0ZVxuXHRcdFx0XHRcdG5hbWU6ICdMb2dvdXQnLFxuXHRcdFx0XHRcdHJlZjogZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRcdEF1dGhTZXJ2aWNlLmxvZ291dCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmRhdGEgPSB7fTtcblx0XHRcdFx0XHRcdCRzY29wZS5zdGF0ZXMucG9wKCk7IC8vVE9ETzogRmluZCBhIGJldHRlciB3YXkgdG8gcmVtb3ZlIHRoZSBMb2dvdXQgbGluaywgaW5zdGVhZCBvZiBwb3Bcblx0XHRcdFx0XHRcdCRzdGF0ZS5nbygnc2lnbnVwJyk7XG5cdFx0XHRcdFx0XHQkcm9vdFNjb3BlLiRicm9hZGNhc3QoJ0F1dGgnKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHQkc3RhdGUuZ28oJ2V4ZXJjaXNtLnZpZXcnKTtcblx0XHRcdFx0Ly9UT0RPOiBXZSBjYW4gc2V0IHRoZSB1c2VyIG5hbWUgaGVyZSBhcyB3ZWxsLiBVc2VkIGluIGNvbmp1bmN0aW9uIHdpdGggYSBtYWluIGN0cmxcblx0XHRcdH0pXG5cdFx0XHQuY2F0Y2goZnVuY3Rpb24oZXJyKXtcblx0XHRcdFx0JHNjb3BlLmVycm9yID0gJ0xvZ2luIEludmFsaWQnO1xuXHRcdFx0XHRjb25zb2xlLmVycm9yKEpTT04uc3RyaW5naWZ5KGVycikpXG5cdFx0XHRcdHZhciBhbGVydFBvcHVwID0gJGlvbmljUG9wdXAuYWxlcnQoe1xuXHRcdFx0XHRcdHRpdGxlOiAnTG9naW4gZmFpbGVkIScsXG5cdFx0XHRcdFx0dGVtcGxhdGU6ICdQbGVhc2UgY2hlY2sgeW91ciBjcmVkZW50aWFscyEnXG5cdFx0XHRcdH0pO1xuXHRcdFx0fSk7XG5cdH07XG59KTtcblxuXG4vL1RPRE86IENsZWFudXAgY29tbWVudGVkIGNvZGVcblxuIiwiYXBwLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlcil7XG5cdCRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdzYW5kYm94Jywge1xuXHRcdHRlbXBsYXRlVXJsIDogJ2ZlYXR1cmVzL3NhbmRib3gvc2FuZGJveC5odG1sJyxcblx0XHRhYnN0cmFjdCA6IHRydWVcblx0fSk7XG59KTtcblxuYXBwLmZhY3RvcnkoJ1NhbmRib3hGYWN0b3J5JywgZnVuY3Rpb24oJGh0dHAsIEFwaUVuZHBvaW50LCAkcm9vdFNjb3BlLCAkc3RhdGUpe1xuXG5cdHZhciBwcm9ibGVtID0gJyc7XG5cdHZhciBzdWJtaXNzaW9uID0gJyc7XG5cblx0dmFyIHJ1bkhpZGRlbiA9IGZ1bmN0aW9uKGNvZGUpIHtcblx0ICAgIHZhciBpbmRleGVkREIgPSBudWxsO1xuXHQgICAgdmFyIGxvY2F0aW9uID0gbnVsbDtcblx0ICAgIHZhciBuYXZpZ2F0b3IgPSBudWxsO1xuXHQgICAgdmFyIG9uZXJyb3IgPSBudWxsO1xuXHQgICAgdmFyIG9ubWVzc2FnZSA9IG51bGw7XG5cdCAgICB2YXIgcGVyZm9ybWFuY2UgPSBudWxsO1xuXHQgICAgdmFyIHNlbGYgPSBudWxsO1xuXHQgICAgdmFyIHdlYmtpdEluZGV4ZWREQiA9IG51bGw7XG5cdCAgICB2YXIgcG9zdE1lc3NhZ2UgPSBudWxsO1xuXHQgICAgdmFyIGNsb3NlID0gbnVsbDtcblx0ICAgIHZhciBvcGVuRGF0YWJhc2UgPSBudWxsO1xuXHQgICAgdmFyIG9wZW5EYXRhYmFzZVN5bmMgPSBudWxsO1xuXHQgICAgdmFyIHdlYmtpdFJlcXVlc3RGaWxlU3lzdGVtID0gbnVsbDtcblx0ICAgIHZhciB3ZWJraXRSZXF1ZXN0RmlsZVN5c3RlbVN5bmMgPSBudWxsO1xuXHQgICAgdmFyIHdlYmtpdFJlc29sdmVMb2NhbEZpbGVTeXN0ZW1TeW5jVVJMID0gbnVsbDtcblx0ICAgIHZhciB3ZWJraXRSZXNvbHZlTG9jYWxGaWxlU3lzdGVtVVJMID0gbnVsbDtcblx0ICAgIHZhciBhZGRFdmVudExpc3RlbmVyID0gbnVsbDtcblx0ICAgIHZhciBkaXNwYXRjaEV2ZW50ID0gbnVsbDtcblx0ICAgIHZhciByZW1vdmVFdmVudExpc3RlbmVyID0gbnVsbDtcblx0ICAgIHZhciBkdW1wID0gbnVsbDtcblx0ICAgIHZhciBvbm9mZmxpbmUgPSBudWxsO1xuXHQgICAgdmFyIG9ub25saW5lID0gbnVsbDtcblx0ICAgIHZhciBpbXBvcnRTY3JpcHRzID0gbnVsbDtcblx0ICAgIHZhciBjb25zb2xlID0gbnVsbDtcblx0ICAgIHZhciBhcHBsaWNhdGlvbiA9IG51bGw7XG5cblx0ICAgIHJldHVybiBldmFsKGNvZGUpO1xuXHR9O1xuXG5cdC8vIGNvbnZlcnRzIHRoZSBvdXRwdXQgaW50byBhIHN0cmluZ1xuXHR2YXIgc3RyaW5naWZ5ID0gZnVuY3Rpb24ob3V0cHV0KSB7XG5cdCAgICB2YXIgcmVzdWx0O1xuXG5cdCAgICBpZiAodHlwZW9mIG91dHB1dCA9PSAndW5kZWZpbmVkJykge1xuXHQgICAgICAgIHJlc3VsdCA9ICd1bmRlZmluZWQnO1xuXHQgICAgfSBlbHNlIGlmIChvdXRwdXQgPT09IG51bGwpIHtcblx0ICAgICAgICByZXN1bHQgPSAnbnVsbCc7XG5cdCAgICB9IGVsc2Uge1xuXHQgICAgICAgIHJlc3VsdCA9IEpTT04uc3RyaW5naWZ5KG91dHB1dCkgfHwgb3V0cHV0LnRvU3RyaW5nKCk7XG5cdCAgICB9XG5cblx0ICAgIHJldHVybiByZXN1bHQ7XG5cdH07XG5cblx0dmFyIHJ1biA9IGZ1bmN0aW9uKGNvZGUpIHtcblx0ICAgIHZhciByZXN1bHQgPSB7XG5cdCAgICAgICAgaW5wdXQ6IGNvZGUsXG5cdCAgICAgICAgb3V0cHV0OiBudWxsLFxuXHQgICAgICAgIGVycm9yOiBudWxsXG5cdCAgICB9O1xuXG5cdCAgICB0cnkge1xuXHQgICAgICAgIHJlc3VsdC5vdXRwdXQgPSBzdHJpbmdpZnkocnVuSGlkZGVuKGNvZGUpKTtcblx0ICAgIH0gY2F0Y2goZSkge1xuXHQgICAgICAgIHJlc3VsdC5lcnJvciA9IGUubWVzc2FnZTtcblx0ICAgIH1cblx0ICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcblxuXG5cdHJldHVybiB7XG5cdFx0Z2V0Q2hhbGxlbmdlIDogZnVuY3Rpb24oaWQpe1xuXHRcdFx0cmV0dXJuICRodHRwLmdldChBcGlFbmRwb2ludC51cmwgKyAnL2NoYWxsZW5nZS8nICsgaWQpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuXHRcdFx0XHRwcm9ibGVtID0gcmVzcG9uc2UuZGF0YTtcblx0XHRcdFx0c3VibWlzc2lvbiA9IHByb2JsZW0uc2Vzc2lvbi5zZXR1cCB8fCAnJztcblx0XHRcdFx0JHJvb3RTY29wZS4kYnJvYWRjYXN0KCdwcm9ibGVtVXBkYXRlZCcpO1xuXHRcdFx0XHRyZXR1cm4gcmVzcG9uc2UuZGF0YTtcblx0XHRcdH0pO1xuXHRcdH0sXG5cdFx0c2V0U3VibWlzc2lvbiA6IGZ1bmN0aW9uKGNvZGUpe1xuXHRcdFx0c3VibWlzc2lvbiA9IGNvZGU7XG5cdFx0XHQkcm9vdFNjb3BlLiRicm9hZGNhc3QoJ3N1Ym1pc3Npb25VcGRhdGVkJyk7XG5cdFx0fSxcblx0XHRjb21waWxlU3VibWlzc2lvbjogZnVuY3Rpb24oY29kZSl7XG5cdFx0XHRyZXR1cm4gcnVuKGNvZGUpO1xuXHRcdH0sXG5cdFx0Z2V0U3VibWlzc2lvbiA6IGZ1bmN0aW9uKCl7XG5cdFx0XHRyZXR1cm4gc3VibWlzc2lvbjtcblx0XHR9LFxuXHRcdGdldFByb2JsZW0gOiBmdW5jdGlvbigpe1xuXHRcdFx0cmV0dXJuIHByb2JsZW07XG5cdFx0fVxuXHR9O1xufSk7IiwiYXBwLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlcil7XG5cdCRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdzYW5kYm94LmNvZGUnLCB7XG5cdFx0dXJsIDogJy9zYW5kYm94L2NvZGUnLFxuXHRcdHZpZXdzOiB7XG5cdFx0XHQndGFiLWNvZGUnIDoge1xuXHRcdFx0XHR0ZW1wbGF0ZVVybCA6ICdmZWF0dXJlcy9zYW5kYm94LWNvZGUvc2FuZGJveC1jb2RlLmh0bWwnLFxuXHRcdFx0XHRjb250cm9sbGVyIDogJ1NhbmRib3hDb2RlQ3RybCdcblx0XHRcdH1cblx0XHR9XG5cdH0pO1xufSk7XG5cblxuYXBwLmNvbnRyb2xsZXIoJ1NhbmRib3hDb2RlQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgJHN0YXRlLCBTYW5kYm94RmFjdG9yeSwgRXhlcmNpc21GYWN0b3J5LCBLZXlib2FyZEZhY3Rvcnkpe1xuXHQkc2NvcGUuY29kZSA9IHtcblx0XHR0ZXh0IDogJydcblx0fTtcblxuXHQkc2NvcGUuYnV0dG9ucyA9IHtcblx0XHRjb21waWxlIDogJ0NvbXBpbGUnLFxuXHRcdHNhdmUgOiAnU2F2ZSdcblx0fTtcblxuXHQkc2NvcGUuY29tcGlsZSA9IGZ1bmN0aW9uKGNvZGUpe1xuXHRcdFNhbmRib3hGYWN0b3J5LnNldFN1Ym1pc3Npb24oY29kZSk7XG5cdFx0JHN0YXRlLmdvKCdzYW5kYm94LmNvbXBpbGUnKTtcblx0fTtcblxuXHQkc2NvcGUuc2F2ZSA9IGZ1bmN0aW9uKGNvZGUpe1xuXG5cdH07XG5cblx0JHNjb3BlLmluc2VydEZ1bmMgPSBLZXlib2FyZEZhY3RvcnkubWFrZUluc2VydEZ1bmMoJHNjb3BlKTtcblxuXHQvLyAkc2NvcGUuc2F2ZUNoYWxsZW5nZSA9IGZ1bmN0aW9uKCl7XG5cdC8vIFx0Y29uc29sZS5sb2coXCJzYXZlIHNjb3BlLnRleHRcIiwgJHNjb3BlLnRleHQpO1xuXHQvLyBcdCRsb2NhbHN0b3JhZ2Uuc2V0KFwidGVzdGluZ1wiLCAkc2NvcGUudGV4dCk7XG5cdC8vIH07XG5cblx0Ly8gJHNjb3BlLmdldFNhdmVkID0gZnVuY3Rpb24oKXtcblx0Ly8gXHRjb25zb2xlLmxvZyhcInNhdmUgc2NvcGUudGV4dFwiLCAkc2NvcGUudGV4dCk7XG5cdC8vIFx0Y29uc29sZS5sb2coXCJlbnRlcmVkIGdldHNhdmVkIGZ1bmNcIik7XG5cdC8vIFx0JHNjb3BlLnRleHQgPSAkbG9jYWxzdG9yYWdlLmdldChcInRlc3RpbmdcIik7XG5cdC8vIH07XG5cbn0pOyIsImFwcC5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIpe1xuXHQkc3RhdGVQcm92aWRlci5zdGF0ZSgnc2FuZGJveC5jb21waWxlJywge1xuXHRcdHVybCA6ICcvc2FuZGJveC9jb21waWxlJyxcblx0XHR2aWV3cyA6IHtcblx0XHRcdCd0YWItY29tcGlsZScgOiB7XG5cdFx0XHRcdHRlbXBsYXRlVXJsIDogJ2ZlYXR1cmVzL3NhbmRib3gtY29tcGlsZS9zYW5kYm94LWNvbXBpbGUuaHRtbCcsXG5cdFx0XHRcdGNvbnRyb2xsZXI6ICdTYW5kYm94Q29tcGlsZUN0cmwnXG5cdFx0XHR9XG5cdFx0fVxuXHR9KTtcbn0pO1xuXG5hcHAuY29udHJvbGxlcignU2FuZGJveENvbXBpbGVDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBTYW5kYm94RmFjdG9yeSl7XG5cdCRzY29wZS5xdWVzdGlvbiA9IFNhbmRib3hGYWN0b3J5LmdldFN1Ym1pc3Npb24oKTtcblx0dmFyIHJlc3VsdHMgPSBTYW5kYm94RmFjdG9yeS5jb21waWxlU3VibWlzc2lvbigkc2NvcGUucXVlc3Rpb24pO1xuXHQkc2NvcGUucmVzdWx0cyA9IHJlc3VsdHM7XG5cdCRzY29wZS5vdXRwdXQgPSBTYW5kYm94RmFjdG9yeS5jb21waWxlU3VibWlzc2lvbigkc2NvcGUucXVlc3Rpb24pLm91dHB1dDtcblx0JHNjb3BlLmVycm9yID0gU2FuZGJveEZhY3RvcnkuY29tcGlsZVN1Ym1pc3Npb24oJHNjb3BlLnF1ZXN0aW9uKS5lcnJvcjtcblxuXHQkc2NvcGUuJG9uKCdzdWJtaXNzaW9uVXBkYXRlZCcsIGZ1bmN0aW9uKGUpe1xuXHRcdCRzY29wZS5xdWVzdGlvbiA9IFNhbmRib3hGYWN0b3J5LmdldFN1Ym1pc3Npb24oKTtcblx0XHRyZXN1bHRzID0gU2FuZGJveEZhY3RvcnkuY29tcGlsZVN1Ym1pc3Npb24oJHNjb3BlLnF1ZXN0aW9uKTtcblx0XHQkc2NvcGUucmVzdWx0cyA9IHJlc3VsdHM7XG5cdFx0JHNjb3BlLm91dHB1dCA9IFNhbmRib3hGYWN0b3J5LmNvbXBpbGVTdWJtaXNzaW9uKCRzY29wZS5xdWVzdGlvbikub3V0cHV0O1xuXHRcdCRzY29wZS5lcnJvciA9IFNhbmRib3hGYWN0b3J5LmNvbXBpbGVTdWJtaXNzaW9uKCRzY29wZS5xdWVzdGlvbikuZXJyb3I7XG5cdH0pO1xufSk7IiwiYXBwLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlcil7XG4gICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ3NpZ251cCcse1xuICAgICAgICB1cmw6XCIvc2lnbnVwXCIsXG4gICAgICAgIHRlbXBsYXRlVXJsOiBcImZlYXR1cmVzL3NpZ251cC9zaWdudXAuaHRtbFwiLFxuICAgICAgICBjb250cm9sbGVyOiAnU2lnblVwQ3RybCdcbiAgICB9KTtcbn0pO1xuXG5hcHAuY29udHJvbGxlcignU2lnblVwQ3RybCcsZnVuY3Rpb24oJHJvb3RTY29wZSwgJGh0dHAsICRzY29wZSwgJHN0YXRlLCBBdXRoU2VydmljZSwgJGlvbmljUG9wdXApe1xuICAgICRzY29wZS5kYXRhID0ge307XG4gICAgJHNjb3BlLmVycm9yID0gbnVsbDtcblxuICAgICRzY29wZS5sb2dpbiA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICRzdGF0ZS5nbygnbG9naW4nKTtcbiAgICB9O1xuXG4gICAgJHNjb3BlLnNpZ251cCA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIEF1dGhTZXJ2aWNlXG4gICAgICAgICAgICAuc2lnbnVwKCRzY29wZS5kYXRhKVxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oYXV0aGVudGljYXRlZCl7XG4gICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZygnc2lnbnVwLCB0YWIuY2hhbGxlbmdlJyk7XG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KCdBdXRoJyk7XG4gICAgICAgICAgICAgICAgJHNjb3BlLnN0YXRlcy5wdXNoKHsgLy9UT0RPOiBOZWVkIHRvIGFkZCBhIHBhcmVudCBjb250cm9sbGVyIHRvIGNvbW11bmljYXRlXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6ICdMb2dvdXQnLFxuICAgICAgICAgICAgICAgICAgICByZWY6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgICAgICBBdXRoU2VydmljZS5sb2dvdXQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5kYXRhID0ge307XG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuc3RhdGVzLnBvcCgpOyAvL1RPRE86IEZpbmQgYSBiZXR0ZXIgd2F5IHRvIHJlbW92ZSB0aGUgTG9nb3V0IGxpbmssIGluc3RlYWQgb2YgcG9wXG4gICAgICAgICAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ3NpZ251cCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KCdBdXRoJyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ2V4ZXJjaXNtLnZpZXcnKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuY2F0Y2goZnVuY3Rpb24oZXJyKXtcbiAgICAgICAgICAgICAgICAkc2NvcGUuZXJyb3IgPSAnU2lnbnVwIEludmFsaWQnO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoSlNPTi5zdHJpbmdpZnkoZXJyKSlcbiAgICAgICAgICAgICAgICB2YXIgYWxlcnRQb3B1cCA9ICRpb25pY1BvcHVwLmFsZXJ0KHtcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdTaWdudXAgZmFpbGVkIScsXG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlOiAnUGxlYXNlIGNoZWNrIHlvdXIgY3JlZGVudGlhbHMhJ1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgfTtcblxufSk7XG5cbi8vVE9ETzogRm9ybSBWYWxpZGF0aW9uXG4vL1RPRE86IENsZWFudXAgY29tbWVudGVkIGNvZGUiLCJhcHAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKXtcblx0JHN0YXRlUHJvdmlkZXIuc3RhdGUoJ3NuaXBwZXQnLCB7XG5cdFx0Y2FjaGU6IGZhbHNlLFxuXHRcdHVybCA6ICcvc25pcHBldC86aWQnLFxuXHRcdHRlbXBsYXRlVXJsIDogJ2ZlYXR1cmVzL3NuaXBwZXQtZWRpdC9zbmlwcGV0LWVkaXQuaHRtbCcsXG5cdFx0Y29udHJvbGxlcjogJ1NuaXBwZXRFZGl0Q3RybCdcblx0fSk7XG59KTtcblxuYXBwLmNvbnRyb2xsZXIoJ1NuaXBwZXRFZGl0Q3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgJHN0YXRlLCAkc3RhdGVQYXJhbXMsIENvZGVTbmlwcGV0RmFjdG9yeSwgS2V5Ym9hcmRGYWN0b3J5KXtcblx0JHNjb3BlLmJ1dHRvbnMgPSB7XG5cdFx0ZWRpdCA6ICdFZGl0Jyxcblx0XHRjYW5jZWwgOiAnQ2FuY2VsJyxcblx0XHRkZWxldGUgOiAnRGVsZXRlJ1xuXHR9O1xuXHQkc2NvcGUuc25pcHBldCA9IENvZGVTbmlwcGV0RmFjdG9yeS5nZXRTbmlwcGV0KCRzdGF0ZVBhcmFtcy5pZCk7XG5cblx0JHNjb3BlLmluc2VydEZ1bmMgPSBLZXlib2FyZEZhY3RvcnkubWFrZUluc2VydEZ1bmMoJHNjb3BlKTtcblxuXHQkc2NvcGUuZWRpdCA9IGZ1bmN0aW9uKHNuaXBwZXQpe1xuXHRcdENvZGVTbmlwcGV0RmFjdG9yeS5lZGl0U25pcHBldCgkc3RhdGVQYXJhbXMuaWQsIHNuaXBwZXQpO1xuXHRcdCRzdGF0ZS5nbygnc25pcHBldHMnKTtcblx0fTtcblxuXHQkc2NvcGUuZGVsZXRlID0gZnVuY3Rpb24oKXtcblx0XHRDb2RlU25pcHBldEZhY3RvcnkuZGVsZXRlU25pcHBldCgkc3RhdGVQYXJhbXMuaWQpO1xuXHRcdCRzdGF0ZS5nbygnc25pcHBldHMnKTtcblx0fTtcblxuXHQkc2NvcGUuY2FuY2VsID0gZnVuY3Rpb24oKXtcblx0XHQkc3RhdGUuZ28oJ3NuaXBwZXRzJyk7XG5cdH07XG59KTsiLCJhcHAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKXtcblx0JHN0YXRlUHJvdmlkZXIuc3RhdGUoJ3NuaXBwZXRzJywge1xuXHRcdHVybCA6ICcvc25pcHBldHMnLFxuXHRcdHRlbXBsYXRlVXJsIDogJ2ZlYXR1cmVzL3NuaXBwZXRzL3NuaXBwZXRzLmh0bWwnLFxuXHRcdGNvbnRyb2xsZXIgOiAnU25pcHBldHNDdHJsJ1xuXHR9KTtcbn0pO1xuXG5hcHAuY29udHJvbGxlcignU25pcHBldHNDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCAkcm9vdFNjb3BlLCAkc3RhdGUsIENvZGVTbmlwcGV0RmFjdG9yeSl7XG5cdCRzY29wZS5zbmlwcGV0cyA9IENvZGVTbmlwcGV0RmFjdG9yeS5nZXRBbGxTbmlwcGV0cygpO1xuXHQkc2NvcGUucmVtb3ZlID0gQ29kZVNuaXBwZXRGYWN0b3J5LmRlbGV0ZVNuaXBwZXQ7XG5cblx0JHJvb3RTY29wZS4kb24oJ2Zvb3RlclVwZGF0ZWQnLCBmdW5jdGlvbihldmVudCl7XG5cdFx0JHNjb3BlLnNuaXBwZXRzID0gQ29kZVNuaXBwZXRGYWN0b3J5LmdldEFsbFNuaXBwZXRzKCk7XG5cdH0pO1xuXG5cdCRzY29wZS5jcmVhdGUgPSBmdW5jdGlvbigpe1xuXHRcdCRzdGF0ZS5nbygnc25pcHBldHMtY3JlYXRlJyk7XG5cdH07XG59KTsiLCJhcHAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKXtcblx0JHN0YXRlUHJvdmlkZXIuc3RhdGUoJ3NuaXBwZXRzLWNyZWF0ZScsIHtcblx0XHR1cmw6ICcvc25pcHBldHMvY3JlYXRlJyxcblx0XHR0ZW1wbGF0ZVVybCA6ICdmZWF0dXJlcy9zbmlwcGV0cy1jcmVhdGUvc25pcHBldHMtY3JlYXRlLmh0bWwnLFxuXHRcdGNvbnRyb2xsZXI6ICdTbmlwcGV0c0NyZWF0ZUN0cmwnXG5cdH0pO1xufSk7XG5cbmFwcC5jb250cm9sbGVyKCdTbmlwcGV0c0NyZWF0ZUN0cmwnLCBmdW5jdGlvbigkc2NvcGUsICRzdGF0ZSwgS2V5Ym9hcmRGYWN0b3J5LCBDb2RlU25pcHBldEZhY3Rvcnkpe1xuXHQkc2NvcGUuc25pcHBldCA9IHtcblx0XHRkaXNwbGF5IDogJycsXG5cdFx0aW5zZXJ0UGFyYW0gOiAnJ1xuXHR9O1xuXG5cdCRzY29wZS5pbnNlcnRGdW5jID0gS2V5Ym9hcmRGYWN0b3J5Lm1ha2VJbnNlcnRGdW5jKCRzY29wZSk7XG5cblx0JHNjb3BlLmNyZWF0ZSA9IGZ1bmN0aW9uKHNuaXBwZXQpe1xuXHRcdENvZGVTbmlwcGV0RmFjdG9yeS5hZGRTbmlwcGV0KHNuaXBwZXQpO1xuXHRcdCRzdGF0ZS5nbygnc25pcHBldHMnKTtcblx0fTtcbn0pOyIsImFwcC5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIpe1xuXHQkc3RhdGVQcm92aWRlci5zdGF0ZSgnd2VsY29tZScsIHtcblx0XHR1cmwgOiAnL3dlbGNvbWUnLFxuXHRcdHRlbXBsYXRlVXJsIDogJ2ZlYXR1cmVzL3dlbGNvbWUvd2VsY29tZS5odG1sJyxcblx0XHRjb250cm9sbGVyIDogJ1dlbGNvbWVDdHJsJ1xuXHR9KTtcbn0pO1xuYXBwLmNvbnRyb2xsZXIoJ1dlbGNvbWVDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCAkc3RhdGUsIEF1dGhTZXJ2aWNlLCAkcm9vdFNjb3BlLCBHaXN0RmFjdG9yeSwgJGlvbmljUG9wdXApe1xuXHQvL1RPRE86IFNwbGFzaCBwYWdlIHdoaWxlIHlvdSBsb2FkIHJlc291cmNlcyAocG9zc2libGUgaWRlYSlcblx0Ly9jb25zb2xlLmxvZygnV2VsY29tZUN0cmwnKTtcblx0JHNjb3BlLmJ1dHRvbnMgPSB7XG5cdFx0bG9naW4gOiAnbG9naW4nLFxuXHRcdHNpZ251cCA6ICdzaWdudXAnXG5cdH07XG5cblx0Ly8gaW9uaWMuUGxhdGZvcm0ucmVhZHkoZnVuY3Rpb24oKXtcblx0Ly8gXHRpb25pYy5QbGF0Zm9ybS5zaG93U3RhdHVzQmFyKGZhbHNlKTtcblx0Ly8gfSk7XG5cblx0JHNjb3BlLmxvZ2luID0gZnVuY3Rpb24oKXtcblx0XHQkc3RhdGUuZ28oJ2xvZ2luJyk7XG5cdH07XG5cdCRzY29wZS5zaWdudXAgPSBmdW5jdGlvbigpe1xuXHRcdCRzdGF0ZS5nbygnc2lnbnVwJyk7XG5cdH07XG5cblx0Ly8gaWYgKEF1dGhTZXJ2aWNlLmlzQXV0aGVudGljYXRlZCgpKSB7XG5cdC8vIFx0JHJvb3RTY29wZS4kYnJvYWRjYXN0KCdBdXRoJyk7XG5cdC8vIFx0JHNjb3BlLnN0YXRlcy5wdXNoKHsgLy9UT0RPOiBOZWVkIHRvIGFkZCBhIHBhcmVudCBjb250cm9sbGVyIHRvIGNvbW11bmljYXRlXG5cdC8vIFx0XHRuYW1lOiAnTG9nb3V0Jyxcblx0Ly8gXHRcdHJlZjogZnVuY3Rpb24oKXtcblx0Ly8gXHRcdFx0QXV0aFNlcnZpY2UubG9nb3V0KCk7XG5cdC8vIFx0XHRcdCRzY29wZS5kYXRhID0ge307XG5cdC8vIFx0XHRcdCRzY29wZS5zdGF0ZXMucG9wKCk7IC8vVE9ETzogRmluZCBhIGJldHRlciB3YXkgdG8gcmVtb3ZlIHRoZSBMb2dvdXQgbGluaywgaW5zdGVhZCBvZiBwb3Bcblx0Ly8gXHRcdFx0JHN0YXRlLmdvKCdzaWdudXAnKTtcblx0Ly8gXHRcdH1cblx0Ly8gXHR9KTtcblx0Ly8gXHQkc3RhdGUuZ28oJ2V4ZXJjaXNtLnZpZXcnKTtcblx0Ly8gfSBlbHNlIHtcblx0Ly8gXHQvLyBUT0RPOiAkc3RhdGUuZ28oJ3NpZ251cCcpOyBSZW1vdmUgQmVsb3cgbGluZVxuXHQvLyBcdC8vICRzdGF0ZS5nbygnZXhlcmNpc20udmlldycpO1xuXHQvLyB9XG5cdHZhciBhdXRoUmVxID0gZmFsc2U7IC8vVE9ETzogVG9nZ2xlIGZvciB1c2luZyBhdXRoZW50aWNhdGlvbiB3b3JrIGZsb3cgLSByZXF1aXJlIGJhY2tlbmQgd2lyZWQgdXBcblxuXHRpZiAoIWF1dGhSZXEpe1xuXHRcdCRzdGF0ZS5nbygnZXhlcmNpc20udmlldycpO1xuXHR9IGVsc2Uge1xuXHRcdGlmIChBdXRoU2VydmljZS5pc0F1dGhlbnRpY2F0ZWQoKSkge1xuXHRcdFx0JHJvb3RTY29wZS4kYnJvYWRjYXN0KCdBdXRoJyk7XG5cdFx0XHQkc2NvcGUuc3RhdGVzLnB1c2goeyAvL1RPRE86IE5lZWQgdG8gYWRkIGEgcGFyZW50IGNvbnRyb2xsZXIgdG8gY29tbXVuaWNhdGVcblx0XHRcdFx0bmFtZTogJ0xvZ291dCcsXG5cdFx0XHRcdHJlZjogZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRBdXRoU2VydmljZS5sb2dvdXQoKTtcblx0XHRcdFx0XHQkc2NvcGUuZGF0YSA9IHt9O1xuXHRcdFx0XHRcdCRzY29wZS5zdGF0ZXMucG9wKCk7IC8vVE9ETzogRmluZCBhIGJldHRlciB3YXkgdG8gcmVtb3ZlIHRoZSBMb2dvdXQgbGluaywgaW5zdGVhZCBvZiBwb3Bcblx0XHRcdFx0XHQkc3RhdGUuZ28oJ2xvZ2luJyk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXG5cdFx0XHQvL3BvcC11cCBvcHRpb25zLCB2aWV3IHNoYXJlZCBjb2RlIG9yXG5cdFx0XHQvL1RPRE86IEhhcHBlbiBvbiBMb2dpbiwgcmVjaWV2ZSBnaXN0IG5vdGlmaWNhdGlvblxuXHRcdFx0R2lzdEZhY3RvcnkucXVldWVkR2lzdHMoKS50aGVuKGdpc3RzUngpO1xuXG5cdFx0XHRmdW5jdGlvbiBnaXN0c1J4KHJlc3BvbnNlKXtcblx0XHRcdFx0Y29uc29sZS5sb2cocmVzcG9uc2UuZGF0YS5naXN0cyk7XG5cdFx0XHRcdGlmKHJlc3BvbnNlLmRhdGEuZ2lzdHMubGVuZ3RoICE9PTApe1xuXHRcdFx0XHRcdC8vY29uc29sZS5sb2coJ25vdGlmeSB1c2VyIG9mIFJ4IGdpc3RzJylcblx0XHRcdFx0XHRzaG93Q29uZmlybSA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0dmFyIGNvbmZpcm1Qb3B1cCA9ICRpb25pY1BvcHVwLmNvbmZpcm0oe1xuXHRcdFx0XHRcdFx0XHR0aXRsZTogJ1lvdSBnb3QgQ29kZSEnLFxuXHRcdFx0XHRcdFx0XHR0ZW1wbGF0ZTogJ1lvdXIgZnJpZW5kcyBzaGFyZWQgc29tZSBjb2RlLCBkbyB5b3Ugd2FudCB0byB0YWtlIGEgbG9vaz8nXG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdC8vVE9ETzogQ3VzdG9tIFBvcFVwIEluc3RlYWRcblx0XHRcdFx0XHRcdC8vVE9ETzogWW91IG5lZWQgdG8gYWNjb3VudCBmb3IgbG9naW4gKHRoaXMgb25seSBhY2NvdW50cyBmb3IgdXNlciBsb2FkaW5nIGFwcCwgYWxyZWFkeSBsb2dnZWQgaW4pXG5cdFx0XHRcdFx0XHRjb25maXJtUG9wdXAudGhlbihmdW5jdGlvbihyZXMpIHtcblx0XHRcdFx0XHRcdFx0aWYocmVzKSB7XG5cdFx0XHRcdFx0XHRcdFx0Ly9jb25zb2xlLmxvZygnWW91IGFyZSBzdXJlJyk7XG5cdFx0XHRcdFx0XHRcdFx0JHN0YXRlLmdvKCdjaGF0cycpO1xuXHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdC8vY29uc29sZS5sb2coJ1lvdSBhcmUgbm90IHN1cmUnKTtcblx0XHRcdFx0XHRcdFx0XHQkc3RhdGUuZ28oJ2V4ZXJjaXNtLmNvbXBpbGUnKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0fTtcblxuXHRcdFx0XHRcdHNob3dDb25maXJtKCk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0JHN0YXRlLmdvKCdleGVyY2lzbS5jb21waWxlJyk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXG5cdFx0fSBlbHNlIHtcblx0XHRcdC8vVE9ETzogJHN0YXRlLmdvKCdzaWdudXAnKTsgUmVtb3ZlIEJlbG93IGxpbmVcblx0XHRcdCRzdGF0ZS5nbygnc2lnbnVwJyk7XG5cdFx0fVxuXHR9XG59KTsiLCIvL3Rva2VuIGlzIHNlbnQgb24gZXZlcnkgaHR0cCByZXF1ZXN0XG5hcHAuZmFjdG9yeSgnQXV0aEludGVyY2VwdG9yJyxmdW5jdGlvbiBBdXRoSW50ZXJjZXB0b3IoQVVUSF9FVkVOVFMsJHJvb3RTY29wZSwkcSxBdXRoVG9rZW5GYWN0b3J5KXtcblxuICAgIHZhciBzdGF0dXNEaWN0ID0ge1xuICAgICAgICA0MDE6IEFVVEhfRVZFTlRTLm5vdEF1dGhlbnRpY2F0ZWQsXG4gICAgICAgIDQwMzogQVVUSF9FVkVOVFMubm90QXV0aG9yaXplZFxuICAgIH07XG5cbiAgICByZXR1cm4ge1xuICAgICAgICByZXF1ZXN0OiBhZGRUb2tlbixcbiAgICAgICAgcmVzcG9uc2VFcnJvcjogZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3Qoc3RhdHVzRGljdFtyZXNwb25zZS5zdGF0dXNdLCByZXNwb25zZSk7XG4gICAgICAgICAgICByZXR1cm4gJHEucmVqZWN0KHJlc3BvbnNlKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBmdW5jdGlvbiBhZGRUb2tlbihjb25maWcpe1xuICAgICAgICB2YXIgdG9rZW4gPSBBdXRoVG9rZW5GYWN0b3J5LmdldFRva2VuKCk7XG4gICAgICAgIC8vY29uc29sZS5sb2coJ2FkZFRva2VuJyx0b2tlbik7XG4gICAgICAgIGlmKHRva2VuKXtcbiAgICAgICAgICAgIGNvbmZpZy5oZWFkZXJzID0gY29uZmlnLmhlYWRlcnMgfHwge307XG4gICAgICAgICAgICBjb25maWcuaGVhZGVycy5BdXRob3JpemF0aW9uID0gJ0JlYXJlciAnICsgdG9rZW47XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNvbmZpZztcbiAgICB9XG59KTtcbi8vc2tpcHBlZCBBdXRoIEludGVyY2VwdG9ycyBnaXZlbiBUT0RPOiBZb3UgY291bGQgYXBwbHkgdGhlIGFwcHJvYWNoIGluXG4vL2h0dHA6Ly9kZXZkYWN0aWMuY29tL3VzZXItYXV0aC1hbmd1bGFyanMtaW9uaWMvXG5cbmFwcC5jb25maWcoZnVuY3Rpb24oJGh0dHBQcm92aWRlcil7XG4gICAgJGh0dHBQcm92aWRlci5pbnRlcmNlcHRvcnMucHVzaCgnQXV0aEludGVyY2VwdG9yJyk7XG59KTtcblxuYXBwLmNvbnN0YW50KCdBVVRIX0VWRU5UUycsIHtcbiAgICAgICAgbm90QXV0aGVudGljYXRlZDogJ2F1dGgtbm90LWF1dGhlbnRpY2F0ZWQnLFxuICAgICAgICBub3RBdXRob3JpemVkOiAnYXV0aC1ub3QtYXV0aG9yaXplZCdcbn0pO1xuXG5hcHAuY29uc3RhbnQoJ1VTRVJfUk9MRVMnLCB7XG4gICAgICAgIC8vYWRtaW46ICdhZG1pbl9yb2xlJyxcbiAgICAgICAgcHVibGljOiAncHVibGljX3JvbGUnXG59KTtcblxuYXBwLmZhY3RvcnkoJ0F1dGhUb2tlbkZhY3RvcnknLGZ1bmN0aW9uKCR3aW5kb3cpe1xuICAgIHZhciBzdG9yZSA9ICR3aW5kb3cubG9jYWxTdG9yYWdlO1xuICAgIHZhciBrZXkgPSAnYXV0aC10b2tlbic7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBnZXRUb2tlbjogZ2V0VG9rZW4sXG4gICAgICAgIHNldFRva2VuOiBzZXRUb2tlblxuICAgIH07XG5cbiAgICBmdW5jdGlvbiBnZXRUb2tlbigpe1xuICAgICAgICByZXR1cm4gc3RvcmUuZ2V0SXRlbShrZXkpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNldFRva2VuKHRva2VuKXtcbiAgICAgICAgaWYodG9rZW4pe1xuICAgICAgICAgICAgc3RvcmUuc2V0SXRlbShrZXksdG9rZW4pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc3RvcmUucmVtb3ZlSXRlbShrZXkpO1xuICAgICAgICB9XG4gICAgfVxufSk7XG5cbmFwcC5zZXJ2aWNlKCdBdXRoU2VydmljZScsZnVuY3Rpb24oJHEsJGh0dHAsVVNFUl9ST0xFUyxBdXRoVG9rZW5GYWN0b3J5LEFwaUVuZHBvaW50LCRyb290U2NvcGUpe1xuICAgIHZhciB1c2VybmFtZSA9ICcnO1xuICAgIHZhciBpc0F1dGhlbnRpY2F0ZWQgPSBmYWxzZTtcbiAgICB2YXIgYXV0aFRva2VuO1xuXG4gICAgZnVuY3Rpb24gbG9hZFVzZXJDcmVkZW50aWFscygpIHtcbiAgICAgICAgLy92YXIgdG9rZW4gPSB3aW5kb3cubG9jYWxTdG9yYWdlLmdldEl0ZW0oTE9DQUxfVE9LRU5fS0VZKTtcbiAgICAgICAgdmFyIHRva2VuID0gQXV0aFRva2VuRmFjdG9yeS5nZXRUb2tlbigpO1xuICAgICAgICAvL2NvbnNvbGUubG9nKHRva2VuKTtcbiAgICAgICAgaWYgKHRva2VuKSB7XG4gICAgICAgICAgICB1c2VDcmVkZW50aWFscyh0b2tlbik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzdG9yZVVzZXJDcmVkZW50aWFscyhkYXRhKSB7XG4gICAgICAgIEF1dGhUb2tlbkZhY3Rvcnkuc2V0VG9rZW4oZGF0YS50b2tlbik7XG4gICAgICAgIHVzZUNyZWRlbnRpYWxzKGRhdGEpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHVzZUNyZWRlbnRpYWxzKGRhdGEpIHtcbiAgICAgICAgLy9jb25zb2xlLmxvZygndXNlQ3JlZGVudGlhbHMgdG9rZW4nLGRhdGEpO1xuICAgICAgICB1c2VybmFtZSA9IGRhdGEudXNlcm5hbWU7XG4gICAgICAgIGlzQXV0aGVudGljYXRlZCA9IHRydWU7XG4gICAgICAgIGF1dGhUb2tlbiA9IGRhdGEudG9rZW47XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZGVzdHJveVVzZXJDcmVkZW50aWFscygpIHtcbiAgICAgICAgYXV0aFRva2VuID0gdW5kZWZpbmVkO1xuICAgICAgICB1c2VybmFtZSA9ICcnO1xuICAgICAgICBpc0F1dGhlbnRpY2F0ZWQgPSBmYWxzZTtcbiAgICAgICAgQXV0aFRva2VuRmFjdG9yeS5zZXRUb2tlbigpOyAvL2VtcHR5IGNsZWFycyB0aGUgdG9rZW5cbiAgICB9XG5cbiAgICB2YXIgbG9nb3V0ID0gZnVuY3Rpb24oKXtcbiAgICAgICAgZGVzdHJveVVzZXJDcmVkZW50aWFscygpO1xuXG4gICAgfTtcblxuICAgIC8vdmFyIGxvZ2luID0gZnVuY3Rpb24oKVxuICAgIHZhciBsb2dpbiA9IGZ1bmN0aW9uKHVzZXJkYXRhKXtcbiAgICAgICAgY29uc29sZS5sb2coJ2xvZ2luJyxKU09OLnN0cmluZ2lmeSh1c2VyZGF0YSkpO1xuICAgICAgICByZXR1cm4gJHEoZnVuY3Rpb24ocmVzb2x2ZSxyZWplY3Qpe1xuICAgICAgICAgICAgJGh0dHAucG9zdChBcGlFbmRwb2ludC51cmwrXCIvdXNlci9sb2dpblwiLCB1c2VyZGF0YSlcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgICAgICAgICAgICAgICAgIHN0b3JlVXNlckNyZWRlbnRpYWxzKHJlc3BvbnNlLmRhdGEpOyAvL3N0b3JlVXNlckNyZWRlbnRpYWxzXG4gICAgICAgICAgICAgICAgICAgIC8vaXNBdXRoZW50aWNhdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShyZXNwb25zZSk7IC8vVE9ETzogc2VudCB0byBhdXRoZW50aWNhdGVkXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICB2YXIgc2lnbnVwID0gZnVuY3Rpb24odXNlcmRhdGEpe1xuICAgICAgICBjb25zb2xlLmxvZygnc2lnbnVwJyxKU09OLnN0cmluZ2lmeSh1c2VyZGF0YSkpO1xuICAgICAgICByZXR1cm4gJHEoZnVuY3Rpb24ocmVzb2x2ZSxyZWplY3Qpe1xuICAgICAgICAgICAgJGh0dHAucG9zdChBcGlFbmRwb2ludC51cmwrXCIvdXNlci9zaWdudXBcIiwgdXNlcmRhdGEpXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgICAgICAgICAgICAgICBzdG9yZVVzZXJDcmVkZW50aWFscyhyZXNwb25zZS5kYXRhKTsgLy9zdG9yZVVzZXJDcmVkZW50aWFsc1xuICAgICAgICAgICAgICAgICAgICAvL2lzQXV0aGVudGljYXRlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUocmVzcG9uc2UpOyAvL1RPRE86IHNlbnQgdG8gYXV0aGVudGljYXRlZFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBsb2FkVXNlckNyZWRlbnRpYWxzKCk7XG5cbiAgICB2YXIgaXNBdXRob3JpemVkID0gZnVuY3Rpb24oYXV0aGVudGljYXRlZCkge1xuICAgICAgICBpZiAoIWFuZ3VsYXIuaXNBcnJheShhdXRoZW50aWNhdGVkKSkge1xuICAgICAgICAgICAgYXV0aGVudGljYXRlZCA9IFthdXRoZW50aWNhdGVkXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gKGlzQXV0aGVudGljYXRlZCAmJiBhdXRoZW50aWNhdGVkLmluZGV4T2YoVVNFUl9ST0xFUy5wdWJsaWMpICE9PSAtMSk7XG4gICAgfTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIGxvZ2luOiBsb2dpbixcbiAgICAgICAgc2lnbnVwOiBzaWdudXAsXG4gICAgICAgIGxvZ291dDogbG9nb3V0LFxuICAgICAgICBpc0F1dGhlbnRpY2F0ZWQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgLy9jb25zb2xlLmxvZygnQXV0aFNlcnZpY2UuaXNBdXRoZW50aWNhdGVkKCknKTtcbiAgICAgICAgICAgIHJldHVybiBpc0F1dGhlbnRpY2F0ZWQ7XG4gICAgICAgIH0sXG4gICAgICAgIHVzZXJuYW1lOiBmdW5jdGlvbigpe3JldHVybiB1c2VybmFtZTt9LFxuICAgICAgICAvL2dldExvZ2dlZEluVXNlcjogZ2V0TG9nZ2VkSW5Vc2VyLFxuICAgICAgICBpc0F1dGhvcml6ZWQ6IGlzQXV0aG9yaXplZFxuICAgIH1cblxufSk7XG5cbi8vVE9ETzogRGlkIG5vdCBjb21wbGV0ZSBtYWluIGN0cmwgJ0FwcEN0cmwgZm9yIGhhbmRsaW5nIGV2ZW50cydcbi8vIGFzIHBlciBodHRwOi8vZGV2ZGFjdGljLmNvbS91c2VyLWF1dGgtYW5ndWxhcmpzLWlvbmljLyIsImFwcC5mYWN0b3J5KCdLZXlib2FyZEZhY3RvcnknLCBmdW5jdGlvbigpe1xuXHRyZXR1cm4ge1xuXHRcdG1ha2VJbnNlcnRGdW5jIDogZnVuY3Rpb24oc2NvcGUpe1xuXHRcdFx0cmV0dXJuIGZ1bmN0aW9uICh0ZXh0KXtcblx0XHRcdFx0c2NvcGUuJGJyb2FkY2FzdChcImluc2VydFwiLCB0ZXh0KTtcblx0XHRcdH07XG5cdFx0fVxuXHR9O1xufSk7IiwiYXBwLmZhY3RvcnkoJ0NvZGVTbmlwcGV0RmFjdG9yeScsIGZ1bmN0aW9uKCRyb290U2NvcGUpe1xuXHRcblx0dmFyIGNvZGVTbmlwcGV0cyA9IFtcblx0XHR7XG5cdFx0XHRkaXNwbGF5OiBcImZuXCIsXG5cdFx0XHRpbnNlcnRQYXJhbTogXCJmdW5jdGlvbigpeyB9XCJcblx0XHR9LFxuXHRcdHtcblx0XHRcdGRpc3BsYXk6IFwiZm9yXCIsXG5cdFx0XHRpbnNlcnRQYXJhbTogXCJmb3IodmFyIGk9IDtpPCA7aSsrKXsgfVwiXG5cdFx0fSxcblx0XHR7XG5cdFx0XHRkaXNwbGF5OiBcIndoaWxlXCIsXG5cdFx0XHRpbnNlcnRQYXJhbTogXCJ3aGlsZSggKXsgfVwiXG5cdFx0fSxcblx0XHR7XG5cdFx0XHRkaXNwbGF5OiBcImRvIHdoaWxlXCIsXG5cdFx0XHRpbnNlcnRQYXJhbTogXCJkbyB7IH0gd2hpbGUoICk7XCJcblx0XHR9LFxuXHRcdHtcblx0XHRcdGRpc3BsYXk6IFwibG9nXCIsXG5cdFx0XHRpbnNlcnRQYXJhbTogXCJjb25zb2xlLmxvZygpO1wiXG5cdFx0fSxcblx0XTtcblxuXHR2YXIgYnJhY2tldHMgPSBbXG5cdFx0e1xuXHRcdFx0ZGlzcGxheTogXCJbIF1cIixcblx0XHRcdGluc2VydFBhcmFtOiBcIltdXCJcblx0XHR9LFxuXHRcdHtcblx0XHRcdGRpc3BsYXk6IFwieyB9XCIsXG5cdFx0XHRpbnNlcnRQYXJhbTogXCJ7fVwiXG5cdFx0fSxcblx0XHR7XG5cdFx0XHRkaXNwbGF5OiBcIiggKVwiLFxuXHRcdFx0aW5zZXJ0UGFyYW06IFwiKClcIlxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0ZGlzcGxheTogXCIvL1wiLFxuXHRcdFx0aW5zZXJ0UGFyYW06IFwiLy9cIlxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0ZGlzcGxheTogXCIvKiAgKi9cIixcblx0XHRcdGluc2VydFBhcmFtOiBcIi8qICovXCJcblx0XHR9XG5cdF07XG5cblx0dmFyIHNwZWNpYWwgPSBbXG5cdFx0e1xuXHRcdFx0ZGlzcGxheTogXCIhXCIsXG5cdFx0XHRpbnNlcnRQYXJhbTogXCIhXCJcblx0XHR9LFxuXHRcdHtcblx0XHRcdGRpc3BsYXk6IFwiQFwiLFxuXHRcdFx0aW5zZXJ0UGFyYW06IFwiQFwiXG5cdFx0fSxcblx0XHR7XG5cdFx0XHRkaXNwbGF5OiBcIiNcIixcblx0XHRcdGluc2VydFBhcmFtOiBcIiNcIlxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0ZGlzcGxheTogXCIkXCIsXG5cdFx0XHRpbnNlcnRQYXJhbTogXCIkXCJcblx0XHR9LFxuXHRcdHtcblx0XHRcdGRpc3BsYXk6IFwiJVwiLFxuXHRcdFx0aW5zZXJ0UGFyYW06IFwiJVwiXG5cdFx0fSxcblx0XHR7XG5cdFx0XHRkaXNwbGF5OiBcIj1cIixcblx0XHRcdGluc2VydFBhcmFtOiBcIj1cIlxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0ZGlzcGxheTogXCI8XCIsXG5cdFx0XHRpbnNlcnRQYXJhbTogXCI8XCJcblx0XHR9LFxuXHRcdHtcblx0XHRcdGRpc3BsYXk6IFwiPlwiLFxuXHRcdFx0aW5zZXJ0UGFyYW06IFwiPlwiXG5cdFx0fSxcblx0XHR7XG5cdFx0XHRkaXNwbGF5OiBcIjtcIixcblx0XHRcdGluc2VydFBhcmFtOiBcIjtcIlxuXHRcdH1cblx0XTtcblxuXHR2YXIgZGVtb0J1dHRvbnMgPSBbXG5cdFx0e1xuXHRcdFx0ZGlzcGxheTogXCJEZW1vMVwiLFxuXHRcdFx0aW5zZXJ0UGFyYW06IFwiPFwiXG5cdFx0fSxcblx0XHR7XG5cdFx0XHRkaXNwbGF5OiBcIkRlbW8yXCIsXG5cdFx0XHRpbnNlcnRQYXJhbTogXCI+XCJcblx0XHR9XG5cdF07XG5cblx0dmFyIGZvb3Rlck1lbnUgPSBbXG5cdFx0e1xuXHRcdFx0ZGlzcGxheTogXCJDdXN0b21cIixcblx0XHRcdGRhdGE6IGNvZGVTbmlwcGV0c1xuXHRcdH0sXG5cdFx0e1xuXHRcdFx0ZGlzcGxheTogXCJTcGVjaWFsXCIsXG5cdFx0XHRkYXRhOiBzcGVjaWFsXG5cdFx0fSxcblx0XHR7XG5cdFx0XHRkaXNwbGF5OiBcIkJyYWNrZXRzXCIsXG5cdFx0XHRkYXRhOiBicmFja2V0c1xuXHRcdH1cblx0XHQvLyB7XG5cdFx0Ly8gXHRkaXNwbGF5OiBcIkRlbW9cIixcblx0XHQvLyBcdGRhdGE6IGRlbW9CdXR0b25zXG5cdFx0Ly8gfVxuXHRdO1xuXG5cdC8vIHZhciBnZXRIb3RrZXlzID0gZnVuY3Rpb24oKXtcblx0Ly8gXHRyZXR1cm4gZm9vdGVySG90a2V5cztcblx0Ly8gfTtcblxuXHRyZXR1cm4gXHR7XG5cdFx0Z2V0Rm9vdGVyTWVudSA6IGZ1bmN0aW9uKCl7XG5cdFx0XHRyZXR1cm4gZm9vdGVyTWVudTtcblx0XHR9LFxuXHRcdGFkZFNuaXBwZXQgOiBmdW5jdGlvbihvYmope1xuXHRcdFx0Y29uc29sZS5sb2cob2JqKTtcblx0XHRcdGNvZGVTbmlwcGV0cy5wdXNoKG9iaik7XG5cdFx0XHQkcm9vdFNjb3BlLiRicm9hZGNhc3QoJ2Zvb3RlclVwZGF0ZWQnLCB0aGlzLmdldEZvb3Rlck1lbnUoKSk7XG5cdFx0fSxcblx0XHRkZWxldGVTbmlwcGV0IDogZnVuY3Rpb24oaWQpe1xuXHRcdFx0Y29kZVNuaXBwZXRzLnNwbGljZShpZCwgMSk7XG5cdFx0XHQkcm9vdFNjb3BlLiRicm9hZGNhc3QoJ2Zvb3RlclVwZGF0ZWQnLCB0aGlzLmdldEZvb3Rlck1lbnUoKSk7XG5cdFx0fSxcblx0XHRnZXRBbGxTbmlwcGV0cyA6IGZ1bmN0aW9uKCl7XG5cdFx0XHRyZXR1cm4gY29kZVNuaXBwZXRzLm1hcChmdW5jdGlvbihlbCwgaW5kZXgpe1xuXHRcdFx0XHRlbC5pZCA9IGluZGV4O1xuXHRcdFx0XHRyZXR1cm4gZWw7XG5cdFx0XHR9KTtcblx0XHR9LFxuXHRcdGVkaXRTbmlwcGV0IDogZnVuY3Rpb24oaWQsIGNoYW5nZXMpe1xuXHRcdFx0Zm9yKHZhciBrZXkgaW4gY29kZVNuaXBwZXRzW2lkXSl7XG5cdFx0XHRcdGNvZGVTbmlwcGV0c1tpZF1ba2V5XSA9IGNoYW5nZXNba2V5XTtcblx0XHRcdH1cblx0XHRcdCRyb290U2NvcGUuJGJyb2FkY2FzdCgnZm9vdGVyVXBkYXRlZCcsIHRoaXMuZ2V0Rm9vdGVyTWVudSgpKTtcblx0XHR9LFxuXHRcdGdldFNuaXBwZXQgOiBmdW5jdGlvbihpZCl7XG5cdFx0XHRyZXR1cm4gY29kZVNuaXBwZXRzW2lkXTtcblx0XHR9LFxuXHRcdGdldFNvbWVTbmlwcGV0cyA6IGZ1bmN0aW9uKHRleHQpe1xuXHRcdFx0ZnVuY3Rpb24gcmVwbGFjZVRTTiAoc3RyKXtcblx0XHRcdFx0cmV0dXJuIHN0ci5yZXBsYWNlKCcvKFxcbnxcXHR8XFxzKSsvZycsICcnKTtcblx0XHRcdH1cblxuXHRcdFx0ZnVuY3Rpb24gY2hlY2tPYmplY3QoY2hlY2spe1xuXHRcdFx0XHRpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpe1xuXHRcdFx0XHRcdHZhciBhcmdzID0gW10ucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLDApO1xuXHRcdFx0XHRcdGFyZ3Muc2hpZnQoKTtcblx0XHRcdFx0XHRyZXR1cm4gYXJncy5maWx0ZXIoZnVuY3Rpb24oZWwpe1xuXHRcdFx0XHRcdFx0cmV0dXJuIHJlcGxhY2VUU04oZWwpID09PSByZXBsYWNlVFNOKGNoZWNrKTtcblx0XHRcdFx0XHR9KS5sZW5ndGggPiAwO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2UgdGhyb3cgbmV3IEVycm9yKCdQbGVhc2UgY2hlY2snKTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIGNvZGVTbmlwcGV0cy5maWx0ZXIoZnVuY3Rpb24oZWwpe1xuXHRcdFx0XHRyZXR1cm4gY2hlY2tPYmplY3QodGV4dCwgZWwuZGlzcGxheSwgZWwuaW5zZXJ0UGFyYW0pO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHR9O1xufSk7IiwiYXBwLmZpbHRlcignYXBwZW5kJywgZnVuY3Rpb24oKXtcblx0cmV0dXJuIGZ1bmN0aW9uKGlucHV0LCBhcHBlbmQpe1xuXHRcdHJldHVybiBhcHBlbmQgKyBpbnB1dDtcblx0fTtcbn0pOyIsImFwcC5maWx0ZXIoJ2Jvb2wnLCBmdW5jdGlvbigpe1xuXHRyZXR1cm4gZnVuY3Rpb24oaW5wdXQsIGNvbmRpdGlvbiwgaWZUcnVlLCBpZkZhbHNlKXtcblx0XHRpZihldmFsKGlucHV0ICsgY29uZGl0aW9uKSl7XG5cdFx0XHRyZXR1cm4gaWZUcnVlO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm4gaWZGYWxzZTtcblx0XHR9XG5cdH07XG59KTsiLCJhcHAuZmlsdGVyKCduYW1lZm9ybWF0JywgZnVuY3Rpb24oKXtcblx0cmV0dXJuIGZ1bmN0aW9uKHRleHQpe1xuXHRcdHJldHVybiAnRXhlcmNpc20gLSAnICsgdGV4dC5zcGxpdCgnLScpLm1hcChmdW5jdGlvbihlbCl7XG5cdFx0XHRyZXR1cm4gZWwuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBlbC5zbGljZSgxKTtcblx0XHR9KS5qb2luKCcgJyk7XG5cdH07XG59KTsiLCJhcHAuZmlsdGVyKCdsZW5ndGgnLCBmdW5jdGlvbigpe1xuXHRyZXR1cm4gZnVuY3Rpb24oYXJySW5wdXQpe1xuXHRcdHZhciBjaGVja0FyciA9IGFycklucHV0IHx8IFtdO1xuXHRcdHJldHVybiBjaGVja0Fyci5sZW5ndGg7XG5cdH07XG59KTsiLCJhcHAuZmlsdGVyKCdtYXJrZWQnLCBmdW5jdGlvbigkc2NlKXtcblx0Ly8gbWFya2VkLnNldE9wdGlvbnMoe1xuXHQvLyBcdHJlbmRlcmVyOiBuZXcgbWFya2VkLlJlbmRlcmVyKCksXG5cdC8vIFx0Z2ZtOiB0cnVlLFxuXHQvLyBcdHRhYmxlczogdHJ1ZSxcblx0Ly8gXHRicmVha3M6IHRydWUsXG5cdC8vIFx0cGVkYW50aWM6IGZhbHNlLFxuXHQvLyBcdHNhbml0aXplOiB0cnVlLFxuXHQvLyBcdHNtYXJ0TGlzdHM6IHRydWUsXG5cdC8vIFx0c21hcnR5cGFudHM6IGZhbHNlXG5cdC8vIH0pO1xuXHRyZXR1cm4gZnVuY3Rpb24odGV4dCl7XG5cdFx0aWYodGV4dCl7XG5cdFx0XHRyZXR1cm4gJHNjZS50cnVzdEFzSHRtbChtYXJrZWQodGV4dCkpO1xuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdHJldHVybiB1bmRlZmluZWQ7XG5cdFx0fVxuXHR9O1xufSk7IiwiYXBwLnNlcnZpY2UoJ0xvY2FsU3RvcmFnZScsZnVuY3Rpb24oKXt9KSIsImFuZ3VsYXIubW9kdWxlKCdpb25pYy51dGlscycsIFtdKVxuXG4uZmFjdG9yeSgnJGxvY2Fsc3RvcmFnZScsIFsnJHdpbmRvdycsIGZ1bmN0aW9uKCR3aW5kb3cpIHtcbiAgcmV0dXJuIHtcbiAgICBzZXQ6IGZ1bmN0aW9uKGtleSwgdmFsdWUpIHtcbiAgICAgICR3aW5kb3cubG9jYWxTdG9yYWdlW2tleV0gPSB2YWx1ZTtcbiAgICB9LFxuICAgIGdldDogZnVuY3Rpb24oa2V5LCBkZWZhdWx0VmFsdWUpIHtcbiAgICAgIHJldHVybiAkd2luZG93LmxvY2FsU3RvcmFnZVtrZXldIHx8IGRlZmF1bHRWYWx1ZTtcbiAgICB9LFxuICAgIHNldE9iamVjdDogZnVuY3Rpb24oa2V5LCB2YWx1ZSkge1xuICAgICAgJHdpbmRvdy5sb2NhbFN0b3JhZ2Vba2V5XSA9IEpTT04uc3RyaW5naWZ5KHZhbHVlKTtcbiAgICB9LFxuICAgIGdldE9iamVjdDogZnVuY3Rpb24oa2V5KSB7XG4gICAgICByZXR1cm4gSlNPTi5wYXJzZSgkd2luZG93LmxvY2FsU3RvcmFnZVtrZXldIHx8ICd7fScpO1xuICAgIH1cbiAgfTtcbn1dKTsiLCJhcHAuZGlyZWN0aXZlKCdjb2Rla2V5Ym9hcmQnLCBmdW5jdGlvbihDb2RlU25pcHBldEZhY3RvcnksICRjb21waWxlKXtcblx0cmV0dXJuIHtcblx0XHRyZXN0cmljdCA6ICdBJyxcblx0XHRsaW5rIDogZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHJpYnV0ZSl7XG5cdFx0XHR2YXIgdmlzaWJsZSA9IGZhbHNlO1xuXG5cdFx0XHRlbGVtZW50LmFkZENsYXNzKFwiYmFyLXN0YWJsZVwiKTtcblx0XHRcdGVsZW1lbnQuYWRkQ2xhc3MoJ25nLWhpZGUnKTtcblxuXHRcdFx0ZnVuY3Rpb24gdG9nZ2xlQ2xhc3MoKXtcblx0XHRcdFx0aWYodmlzaWJsZSl7XG5cdFx0XHRcdFx0ZWxlbWVudC5yZW1vdmVDbGFzcygnbmctaGlkZScpO1xuXHRcdFx0XHRcdGVsZW1lbnQuYWRkQ2xhc3MoJ25nLXNob3cnKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRlbGVtZW50LnJlbW92ZUNsYXNzKCduZy1zaG93Jyk7XG5cdFx0XHRcdFx0ZWxlbWVudC5hZGRDbGFzcygnbmctaGlkZScpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRzY29wZS5idG5zID0gQ29kZVNuaXBwZXRGYWN0b3J5LmdldEZvb3Rlck1lbnUoKTtcblxuXHRcdFx0c2NvcGUuJG9uKCdmb290ZXJVcGRhdGVkJywgZnVuY3Rpb24oZXZlbnQsIGRhdGEpe1xuXHRcdFx0XHRzY29wZS5idG5zID0gZGF0YTtcblx0XHRcdH0pO1xuXG5cdFx0XHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIm5hdGl2ZS5rZXlib2FyZHNob3dcIiwgZnVuY3Rpb24gKCl7XG5cdFx0ICAgIFx0dmlzaWJsZSA9IHRydWU7XG5cdFx0ICAgIFx0dG9nZ2xlQ2xhc3MoKTtcblxuXHRcdCAgICB9KTtcblx0XHQgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJuYXRpdmUua2V5Ym9hcmRoaWRlXCIsIGZ1bmN0aW9uICgpe1xuXHRcdCAgICBcdHZpc2libGUgPSBmYWxzZTtcblx0XHQgICAgXHR0b2dnbGVDbGFzcygpO1xuXHRcdCAgICB9KTtcblx0XHR9XG5cdH07XG59KTsiLCJhcHAuZGlyZWN0aXZlKCdzbmlwcGV0YnV0dG9ucycsIGZ1bmN0aW9uKCl7XG5cdHJldHVybiB7XG5cdFx0cmVzdHJpY3QgOiAnRScsXG5cdFx0cmVwbGFjZTp0cnVlLFxuXHRcdHRlbXBsYXRlVXJsOlwiZmVhdHVyZXMvY29tbW9uL2RpcmVjdGl2ZXMvY29kZWtleWJvYXJkYmFyL3NuaXBwZXRidXR0b25zLmh0bWxcIixcblx0XHRsaW5rIDogZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHJpYnV0ZSl7XG5cdFx0XHRzY29wZS5zaG93T3B0aW9ucyA9IGZhbHNlO1xuXHRcdFx0c2NvcGUuYnRuQ2xpY2sgPSBmdW5jdGlvbihkYXRhKXtcblx0XHRcdFx0c2NvcGUuc2hvd09wdGlvbnMgPSB0cnVlO1xuXHRcdFx0XHRzY29wZS5pdGVtcyA9IGRhdGE7XG5cdFx0XHR9O1xuXHRcdFx0c2NvcGUuaXRlbUNsaWNrID0gZnVuY3Rpb24oaW5zZXJ0UGFyYW0pe1xuXHRcdFx0XHRzY29wZS5pbnNlcnRGdW5jKGluc2VydFBhcmFtKTtcblx0XHRcdH07XG5cdFx0XHRzY29wZS5yZXNldE1lbnUgPSBmdW5jdGlvbigpe1xuXHRcdFx0XHRzY29wZS5zaG93T3B0aW9ucyA9IGZhbHNlO1xuXHRcdFx0fTtcblx0XHRcdHNjb3BlLmRlbW8xID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHZhciB0ZXh0ID0gXCJ2YXIgSGVsbG9Xb3JsZCA9IGZ1bmN0aW9uKCkge307XFxuSGVsbG9Xb3JsZC5wcm90b3R5cGUuaGVsbG8gPSBmdW5jdGlvbihuYW1lKXtuYW1lPW5hbWV8fCd3b3JsZCc7XFxucmV0dXJuICdIZWxsbywgJyArIG5hbWUgKyAnISc7fTtcIjtcblx0XHRcdFx0c2NvcGUuaW5zZXJ0RnVuYyh0ZXh0KTtcblx0XHRcdH07XG5cdFx0XHRzY29wZS5kZW1vMiA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHR2YXIgdGV4dCA9IFwiZnVuY3Rpb24gaGFoYSgpIHtyZXR1cm4gXFxcImhlaGVcXFwifTtcXG5cXG5oYWhhKCk7XCI7XG5cdFx0XHRcdHNjb3BlLmluc2VydEZ1bmModGV4dCk7XG5cdFx0XHR9O1xuXG5cdFx0fVxuXHR9O1xufSk7IiwiYXBwLmRpcmVjdGl2ZSgnY21lZGl0JywgZnVuY3Rpb24oKXtcblx0cmV0dXJuIHtcblx0XHRyZXN0cmljdCA6ICdBJyxcblx0XHRyZXF1aXJlOiAnbmdNb2RlbCcsXG5cdFx0bGluayA6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRyaWJ1dGUsIG5nTW9kZWxDdHJsKXtcblx0XHRcdC8vaW5pdGlhbGl6ZSBDb2RlTWlycm9yXG5cdFx0XHR2YXIgbXlDb2RlTWlycm9yO1xuXHRcdFx0bXlDb2RlTWlycm9yID0gQ29kZU1pcnJvci5mcm9tVGV4dEFyZWEoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoYXR0cmlidXRlLmlkKSwge1xuXHRcdFx0XHRsaW5lTnVtYmVycyA6IHRydWUsXG5cdFx0XHRcdG1vZGU6ICdqYXZhc2NyaXB0Jyxcblx0XHRcdFx0YXV0b2ZvY3VzIDogdHJ1ZSxcblx0XHRcdFx0dGhlbWUgOiAnbW9ub2thaScsXG5cdFx0XHRcdGxpbmVXcmFwcGluZzogdHJ1ZSxcblx0XHRcdFx0c2Nyb2xsYmFyU3R5bGU6IFwib3ZlcmxheVwiXG5cdFx0XHR9KTtcblx0XHRcdG5nTW9kZWxDdHJsLiRyZW5kZXIgPSBmdW5jdGlvbigpe1xuXHRcdFx0XHRteUNvZGVNaXJyb3Iuc2V0VmFsdWUobmdNb2RlbEN0cmwuJHZpZXdWYWx1ZSB8fCAnJyk7XG5cdFx0XHR9O1xuXG5cdFx0XHRteUNvZGVNaXJyb3Iub24oXCJjaGFuZ2VcIiwgZnVuY3Rpb24gKG15Q29kZU1pcnJvciwgY2hhbmdlT2JqKXtcblx0XHQgICAgXHRuZ01vZGVsQ3RybC4kc2V0Vmlld1ZhbHVlKG15Q29kZU1pcnJvci5nZXRWYWx1ZSgpKTtcblx0XHQgICAgfSk7XG5cblx0XHQgICAgc2NvcGUuJG9uKFwiaW5zZXJ0XCIsIGZ1bmN0aW9uKGV2ZW50LCB0ZXh0KXtcblx0XHQgICAgXHRteUNvZGVNaXJyb3IucmVwbGFjZVNlbGVjdGlvbih0ZXh0KTtcblx0XHQgICAgXHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZChhdHRyaWJ1dGUuaWQpLmZvY3VzKCk7XG5cdFx0ICAgIH0pO1xuXG5cdFx0ICAgIG15Q29kZU1pcnJvci5vbihcImJsdXJcIiwgZnVuY3Rpb24gKCl7XG5cdFx0ICAgIFx0Y29uc29sZS5sb2coXCJibHVyIGRldGVjdGVkXCIpO1xuXHRcdCAgICBcdC8vIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGF0dHJpYnV0ZS5pZCkuZm9jdXMoKTtcblx0XHQgICAgfSk7XG5cdFx0fVxuXHR9O1xufSk7IiwiYXBwLmRpcmVjdGl2ZSgnY21yZWFkJywgZnVuY3Rpb24oKXtcblx0cmV0dXJuIHtcblx0XHRyZXN0cmljdCA6ICdBJyxcblx0XHRyZXF1aXJlOiAnbmdNb2RlbCcsXG5cdFx0bGluayA6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRyaWJ1dGUsIG5nTW9kZWxDdHJsKXtcblx0XHRcdC8vaW5pdGlhbGl6ZSBDb2RlTWlycm9yXG5cdFx0XHR2YXIgbXlDb2RlTWlycm9yID0gQ29kZU1pcnJvci5mcm9tVGV4dEFyZWEoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoYXR0cmlidXRlLmlkKSwge1xuXHRcdFx0XHRyZWFkT25seSA6ICdub2N1cnNvcicsXG5cdFx0XHRcdG1vZGU6ICdqYXZhc2NyaXB0Jyxcblx0XHRcdFx0YXV0b2ZvY3VzIDogdHJ1ZSxcblx0XHRcdFx0dGhlbWUgOiAndHdpbGlnaHQnLFxuXHRcdFx0XHRsaW5lV3JhcHBpbmc6IHRydWVcblx0XHRcdH0pO1xuXG5cdFx0XHRuZ01vZGVsQ3RybC4kcmVuZGVyID0gZnVuY3Rpb24oKXtcblx0XHRcdFx0bXlDb2RlTWlycm9yLnNldFZhbHVlKG5nTW9kZWxDdHJsLiR2aWV3VmFsdWUgfHwgJycpO1xuXHRcdFx0fTtcblx0XHR9XG5cdH07XG59KTsiLCJhcHAuZGlyZWN0aXZlKCdqYXNtaW5lJywgZnVuY3Rpb24oSmFzbWluZVJlcG9ydGVyKXtcblx0cmV0dXJuIHtcblx0XHRyZXN0cmljdCA6ICdFJyxcblx0XHR0cmFuc2NsdWRlOiB0cnVlLFxuXHRcdHNjb3BlIDoge1xuXHRcdFx0dGVzdDogJz0nLFxuXHRcdFx0Y29kZTogJz0nXG5cdFx0fSxcblx0XHR0ZW1wbGF0ZVVybCA6ICdmZWF0dXJlcy9jb21tb24vZGlyZWN0aXZlcy9qYXNtaW5lL2phc21pbmUuaHRtbCcsXG5cdFx0bGluayA6IGZ1bmN0aW9uIChzY29wZSwgZWxlbWVudCwgYXR0cmlidXRlKXtcblx0XHRcdHNjb3BlLiR3YXRjaCgndGVzdCcsIGZ1bmN0aW9uKCl7XG5cdFx0XHRcdHdpbmRvdy5qYXNtaW5lID0gbnVsbDtcblx0XHRcdFx0SmFzbWluZVJlcG9ydGVyLmluaXRpYWxpemVKYXNtaW5lKCk7XG5cdFx0XHRcdEphc21pbmVSZXBvcnRlci5hZGRSZXBvcnRlcihzY29wZSk7XG5cdFx0XHR9KTtcblxuXHRcdFx0c2NvcGUuJHdhdGNoKCdjb2RlJywgZnVuY3Rpb24oKXtcblx0XHRcdFx0d2luZG93Lmphc21pbmUgPSBudWxsO1xuXHRcdFx0XHRKYXNtaW5lUmVwb3J0ZXIuaW5pdGlhbGl6ZUphc21pbmUoKTtcblx0XHRcdFx0SmFzbWluZVJlcG9ydGVyLmFkZFJlcG9ydGVyKHNjb3BlKTtcblx0XHRcdH0pO1xuXG5cdFx0XHRmdW5jdGlvbiBmbGF0dGVuUmVtb3ZlRHVwZXMoYXJyLCBrZXlDaGVjayl7XG5cdFx0XHRcdHZhciB0cmFja2VyID0gW107XG5cdFx0XHRcdHJldHVybiB3aW5kb3cuXy5mbGF0dGVuKGFycikuZmlsdGVyKGZ1bmN0aW9uKGVsKXtcblx0XHRcdFx0XHRpZih0cmFja2VyLmluZGV4T2YoZWxba2V5Q2hlY2tdKSA9PSAtMSl7XG5cdFx0XHRcdFx0XHR0cmFja2VyLnB1c2goZWxba2V5Q2hlY2tdKTtcblx0XHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXG5cdFx0XHRzY29wZS5zdW1tYXJ5U2hvd2luZyA9IHRydWU7XG5cblx0XHRcdHNjb3BlLnNob3dTdW1tYXJ5ID0gZnVuY3Rpb24oKXtcblx0XHRcdFx0aWYoIXNjb3BlLnN1bW1hcnlTaG93aW5nKSBzY29wZS5zdW1tYXJ5U2hvd2luZyA9ICFzY29wZS5zdW1tYXJ5U2hvd2luZztcblx0XHRcdH07XG5cdFx0XHRzY29wZS5zaG93RmFpbHVyZXMgPSBmdW5jdGlvbigpe1xuXHRcdFx0XHRpZihzY29wZS5zdW1tYXJ5U2hvd2luZykgc2NvcGUuc3VtbWFyeVNob3dpbmcgPSAhc2NvcGUuc3VtbWFyeVNob3dpbmc7XG5cdFx0XHR9O1xuXG5cblx0XHRcdHNjb3BlLiR3YXRjaCgnc3VpdGVzJywgZnVuY3Rpb24oKXtcblx0XHRcdFx0aWYoc2NvcGUuc3VpdGVzKXtcblx0XHRcdFx0XHR2YXIgc3VpdGVzU3BlY3MgPSBzY29wZS5zdWl0ZXMubWFwKGZ1bmN0aW9uKGVsKXtcblx0XHRcdFx0XHRcdHJldHVybiBlbC5zcGVjcztcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRzY29wZS5zcGVjc092ZXJ2aWV3ID0gZmxhdHRlblJlbW92ZUR1cGVzKHN1aXRlc1NwZWNzLCBcImlkXCIpO1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nKHNjb3BlLnNwZWNzT3ZlcnZpZXcpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXHRcdH1cblx0fTtcbn0pO1xuXG5hcHAuZmFjdG9yeSgnSmFzbWluZVJlcG9ydGVyJywgZnVuY3Rpb24oKXtcblx0ZnVuY3Rpb24gaW5pdGlhbGl6ZUphc21pbmUoKXtcblx0XHQvKlxuXHRcdENvcHlyaWdodCAoYykgMjAwOC0yMDE1IFBpdm90YWwgTGFic1xuXG5cdFx0UGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nXG5cdFx0YSBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG5cdFx0XCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG5cdFx0d2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuXHRcdGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0b1xuXHRcdHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0b1xuXHRcdHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcblxuXHRcdFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlXG5cdFx0aW5jbHVkZWQgaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG5cblx0XHRUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELFxuXHRcdEVYUFJFU1MgT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuXHRcdE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EXG5cdFx0Tk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRVxuXHRcdExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT05cblx0XHRPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT05cblx0XHRXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblx0XHQqL1xuXHRcdC8qKlxuXHRcdCBTdGFydGluZyB3aXRoIHZlcnNpb24gMi4wLCB0aGlzIGZpbGUgXCJib290c1wiIEphc21pbmUsIHBlcmZvcm1pbmcgYWxsIG9mIHRoZSBuZWNlc3NhcnkgaW5pdGlhbGl6YXRpb24gYmVmb3JlIGV4ZWN1dGluZyB0aGUgbG9hZGVkIGVudmlyb25tZW50IGFuZCBhbGwgb2YgYSBwcm9qZWN0J3Mgc3BlY3MuIFRoaXMgZmlsZSBzaG91bGQgYmUgbG9hZGVkIGFmdGVyIGBqYXNtaW5lLmpzYCBhbmQgYGphc21pbmVfaHRtbC5qc2AsIGJ1dCBiZWZvcmUgYW55IHByb2plY3Qgc291cmNlIGZpbGVzIG9yIHNwZWMgZmlsZXMgYXJlIGxvYWRlZC4gVGh1cyB0aGlzIGZpbGUgY2FuIGFsc28gYmUgdXNlZCB0byBjdXN0b21pemUgSmFzbWluZSBmb3IgYSBwcm9qZWN0LlxuXG5cdFx0IElmIGEgcHJvamVjdCBpcyB1c2luZyBKYXNtaW5lIHZpYSB0aGUgc3RhbmRhbG9uZSBkaXN0cmlidXRpb24sIHRoaXMgZmlsZSBjYW4gYmUgY3VzdG9taXplZCBkaXJlY3RseS4gSWYgYSBwcm9qZWN0IGlzIHVzaW5nIEphc21pbmUgdmlhIHRoZSBbUnVieSBnZW1dW2phc21pbmUtZ2VtXSwgdGhpcyBmaWxlIGNhbiBiZSBjb3BpZWQgaW50byB0aGUgc3VwcG9ydCBkaXJlY3RvcnkgdmlhIGBqYXNtaW5lIGNvcHlfYm9vdF9qc2AuIE90aGVyIGVudmlyb25tZW50cyAoZS5nLiwgUHl0aG9uKSB3aWxsIGhhdmUgZGlmZmVyZW50IG1lY2hhbmlzbXMuXG5cblx0XHQgVGhlIGxvY2F0aW9uIG9mIGBib290LmpzYCBjYW4gYmUgc3BlY2lmaWVkIGFuZC9vciBvdmVycmlkZGVuIGluIGBqYXNtaW5lLnltbGAuXG5cblx0XHQgW2phc21pbmUtZ2VtXTogaHR0cDovL2dpdGh1Yi5jb20vcGl2b3RhbC9qYXNtaW5lLWdlbVxuXHRcdCAqL1xuXG5cdFx0KGZ1bmN0aW9uKCkge1xuXHRcdCAgLyoqXG5cdFx0ICAgKiAjIyBSZXF1aXJlICZhbXA7IEluc3RhbnRpYXRlXG5cdFx0ICAgKlxuXHRcdCAgICogUmVxdWlyZSBKYXNtaW5lJ3MgY29yZSBmaWxlcy4gU3BlY2lmaWNhbGx5LCB0aGlzIHJlcXVpcmVzIGFuZCBhdHRhY2hlcyBhbGwgb2YgSmFzbWluZSdzIGNvZGUgdG8gdGhlIGBqYXNtaW5lYCByZWZlcmVuY2UuXG5cdFx0ICAgKi9cblx0XHQgIHdpbmRvdy5qYXNtaW5lID0gamFzbWluZVJlcXVpcmUuY29yZShqYXNtaW5lUmVxdWlyZSk7XG5cblx0XHQgIC8qKlxuXHRcdCAgICogU2luY2UgdGhpcyBpcyBiZWluZyBydW4gaW4gYSBicm93c2VyIGFuZCB0aGUgcmVzdWx0cyBzaG91bGQgcG9wdWxhdGUgdG8gYW4gSFRNTCBwYWdlLCByZXF1aXJlIHRoZSBIVE1MLXNwZWNpZmljIEphc21pbmUgY29kZSwgaW5qZWN0aW5nIHRoZSBzYW1lIHJlZmVyZW5jZS5cblx0XHQgICAqL1xuXHRcdCAgamFzbWluZVJlcXVpcmUuaHRtbChqYXNtaW5lKTtcblxuXHRcdCAgLyoqXG5cdFx0ICAgKiBDcmVhdGUgdGhlIEphc21pbmUgZW52aXJvbm1lbnQuIFRoaXMgaXMgdXNlZCB0byBydW4gYWxsIHNwZWNzIGluIGEgcHJvamVjdC5cblx0XHQgICAqL1xuXHRcdCAgdmFyIGVudiA9IGphc21pbmUuZ2V0RW52KCk7XG5cblx0XHQgIC8qKlxuXHRcdCAgICogIyMgVGhlIEdsb2JhbCBJbnRlcmZhY2Vcblx0XHQgICAqXG5cdFx0ICAgKiBCdWlsZCB1cCB0aGUgZnVuY3Rpb25zIHRoYXQgd2lsbCBiZSBleHBvc2VkIGFzIHRoZSBKYXNtaW5lIHB1YmxpYyBpbnRlcmZhY2UuIEEgcHJvamVjdCBjYW4gY3VzdG9taXplLCByZW5hbWUgb3IgYWxpYXMgYW55IG9mIHRoZXNlIGZ1bmN0aW9ucyBhcyBkZXNpcmVkLCBwcm92aWRlZCB0aGUgaW1wbGVtZW50YXRpb24gcmVtYWlucyB1bmNoYW5nZWQuXG5cdFx0ICAgKi9cblx0XHQgIHZhciBqYXNtaW5lSW50ZXJmYWNlID0gamFzbWluZVJlcXVpcmUuaW50ZXJmYWNlKGphc21pbmUsIGVudik7XG5cblx0XHQgIC8qKlxuXHRcdCAgICogQWRkIGFsbCBvZiB0aGUgSmFzbWluZSBnbG9iYWwvcHVibGljIGludGVyZmFjZSB0byB0aGUgZ2xvYmFsIHNjb3BlLCBzbyBhIHByb2plY3QgY2FuIHVzZSB0aGUgcHVibGljIGludGVyZmFjZSBkaXJlY3RseS4gRm9yIGV4YW1wbGUsIGNhbGxpbmcgYGRlc2NyaWJlYCBpbiBzcGVjcyBpbnN0ZWFkIG9mIGBqYXNtaW5lLmdldEVudigpLmRlc2NyaWJlYC5cblx0XHQgICAqL1xuXHRcdCAgZXh0ZW5kKHdpbmRvdywgamFzbWluZUludGVyZmFjZSk7XG5cblx0XHQgIC8qKlxuXHRcdCAgICogIyMgUnVubmVyIFBhcmFtZXRlcnNcblx0XHQgICAqXG5cdFx0ICAgKiBNb3JlIGJyb3dzZXIgc3BlY2lmaWMgY29kZSAtIHdyYXAgdGhlIHF1ZXJ5IHN0cmluZyBpbiBhbiBvYmplY3QgYW5kIHRvIGFsbG93IGZvciBnZXR0aW5nL3NldHRpbmcgcGFyYW1ldGVycyBmcm9tIHRoZSBydW5uZXIgdXNlciBpbnRlcmZhY2UuXG5cdFx0ICAgKi9cblxuXHRcdCAgdmFyIHF1ZXJ5U3RyaW5nID0gbmV3IGphc21pbmUuUXVlcnlTdHJpbmcoe1xuXHRcdCAgICBnZXRXaW5kb3dMb2NhdGlvbjogZnVuY3Rpb24oKSB7IHJldHVybiB3aW5kb3cubG9jYXRpb247IH1cblx0XHQgIH0pO1xuXG5cdFx0ICB2YXIgY2F0Y2hpbmdFeGNlcHRpb25zID0gcXVlcnlTdHJpbmcuZ2V0UGFyYW0oXCJjYXRjaFwiKTtcblx0XHQgIGVudi5jYXRjaEV4Y2VwdGlvbnModHlwZW9mIGNhdGNoaW5nRXhjZXB0aW9ucyA9PT0gXCJ1bmRlZmluZWRcIiA/IHRydWUgOiBjYXRjaGluZ0V4Y2VwdGlvbnMpO1xuXG5cdFx0ICB2YXIgdGhyb3dpbmdFeHBlY3RhdGlvbkZhaWx1cmVzID0gcXVlcnlTdHJpbmcuZ2V0UGFyYW0oXCJ0aHJvd0ZhaWx1cmVzXCIpO1xuXHRcdCAgZW52LnRocm93T25FeHBlY3RhdGlvbkZhaWx1cmUodGhyb3dpbmdFeHBlY3RhdGlvbkZhaWx1cmVzKTtcblxuXHRcdCAgLyoqXG5cdFx0ICAgKiBUaGUgYGpzQXBpUmVwb3J0ZXJgIGFsc28gcmVjZWl2ZXMgc3BlYyByZXN1bHRzLCBhbmQgaXMgdXNlZCBieSBhbnkgZW52aXJvbm1lbnQgdGhhdCBuZWVkcyB0byBleHRyYWN0IHRoZSByZXN1bHRzICBmcm9tIEphdmFTY3JpcHQuXG5cdFx0ICAgKi9cblx0XHQgIGVudi5hZGRSZXBvcnRlcihqYXNtaW5lSW50ZXJmYWNlLmpzQXBpUmVwb3J0ZXIpO1xuXG5cdFx0ICAvKipcblx0XHQgICAqIEZpbHRlciB3aGljaCBzcGVjcyB3aWxsIGJlIHJ1biBieSBtYXRjaGluZyB0aGUgc3RhcnQgb2YgdGhlIGZ1bGwgbmFtZSBhZ2FpbnN0IHRoZSBgc3BlY2AgcXVlcnkgcGFyYW0uXG5cdFx0ICAgKi9cblx0XHQgIHZhciBzcGVjRmlsdGVyID0gbmV3IGphc21pbmUuSHRtbFNwZWNGaWx0ZXIoe1xuXHRcdCAgICBmaWx0ZXJTdHJpbmc6IGZ1bmN0aW9uKCkgeyByZXR1cm4gcXVlcnlTdHJpbmcuZ2V0UGFyYW0oXCJzcGVjXCIpOyB9XG5cdFx0ICB9KTtcblxuXHRcdCAgZW52LnNwZWNGaWx0ZXIgPSBmdW5jdGlvbihzcGVjKSB7XG5cdFx0ICAgIHJldHVybiBzcGVjRmlsdGVyLm1hdGNoZXMoc3BlYy5nZXRGdWxsTmFtZSgpKTtcblx0XHQgIH07XG5cblx0XHQgIC8qKlxuXHRcdCAgICogU2V0dGluZyB1cCB0aW1pbmcgZnVuY3Rpb25zIHRvIGJlIGFibGUgdG8gYmUgb3ZlcnJpZGRlbi4gQ2VydGFpbiBicm93c2VycyAoU2FmYXJpLCBJRSA4LCBwaGFudG9tanMpIHJlcXVpcmUgdGhpcyBoYWNrLlxuXHRcdCAgICovXG5cdFx0ICB3aW5kb3cuc2V0VGltZW91dCA9IHdpbmRvdy5zZXRUaW1lb3V0O1xuXHRcdCAgd2luZG93LnNldEludGVydmFsID0gd2luZG93LnNldEludGVydmFsO1xuXHRcdCAgd2luZG93LmNsZWFyVGltZW91dCA9IHdpbmRvdy5jbGVhclRpbWVvdXQ7XG5cdFx0ICB3aW5kb3cuY2xlYXJJbnRlcnZhbCA9IHdpbmRvdy5jbGVhckludGVydmFsO1xuXG5cdFx0ICAvKipcblx0XHQgICAqICMjIEV4ZWN1dGlvblxuXHRcdCAgICpcblx0XHQgICAqIFJlcGxhY2UgdGhlIGJyb3dzZXIgd2luZG93J3MgYG9ubG9hZGAsIGVuc3VyZSBpdCdzIGNhbGxlZCwgYW5kIHRoZW4gcnVuIGFsbCBvZiB0aGUgbG9hZGVkIHNwZWNzLiBUaGlzIGluY2x1ZGVzIGluaXRpYWxpemluZyB0aGUgYEh0bWxSZXBvcnRlcmAgaW5zdGFuY2UgYW5kIHRoZW4gZXhlY3V0aW5nIHRoZSBsb2FkZWQgSmFzbWluZSBlbnZpcm9ubWVudC4gQWxsIG9mIHRoaXMgd2lsbCBoYXBwZW4gYWZ0ZXIgYWxsIG9mIHRoZSBzcGVjcyBhcmUgbG9hZGVkLlxuXHRcdCAgICovXG5cdFx0ICB2YXIgY3VycmVudFdpbmRvd09ubG9hZCA9IHdpbmRvdy5vbmxvYWQ7XG5cblx0XHQgIChmdW5jdGlvbigpIHtcblx0XHQgICAgaWYgKGN1cnJlbnRXaW5kb3dPbmxvYWQpIHtcblx0XHQgICAgICBjdXJyZW50V2luZG93T25sb2FkKCk7XG5cdFx0ICAgIH1cblx0XHQgICAgZW52LmV4ZWN1dGUoKTtcblx0XHQgIH0pKCk7XG5cblx0XHQgIC8qKlxuXHRcdCAgICogSGVscGVyIGZ1bmN0aW9uIGZvciByZWFkYWJpbGl0eSBhYm92ZS5cblx0XHQgICAqL1xuXHRcdCAgZnVuY3Rpb24gZXh0ZW5kKGRlc3RpbmF0aW9uLCBzb3VyY2UpIHtcblx0XHQgICAgZm9yICh2YXIgcHJvcGVydHkgaW4gc291cmNlKSBkZXN0aW5hdGlvbltwcm9wZXJ0eV0gPSBzb3VyY2VbcHJvcGVydHldO1xuXHRcdCAgICByZXR1cm4gZGVzdGluYXRpb247XG5cdFx0ICB9XG5cblx0XHR9KSgpO1xuXHR9XG5cblx0ZnVuY3Rpb24gYWRkUmVwb3J0ZXIoc2NvcGUpe1xuXHRcdHZhciBzdWl0ZXMgPSBbXTtcblx0XHR2YXIgY3VycmVudFN1aXRlID0ge307XG5cblx0XHRmdW5jdGlvbiBTdWl0ZShvYmope1xuXHRcdFx0dGhpcy5pZCA9IG9iai5pZDtcblx0XHRcdHRoaXMuZGVzY3JpcHRpb24gPSBvYmouZGVzY3JpcHRpb247XG5cdFx0XHR0aGlzLmZ1bGxOYW1lID0gb2JqLmZ1bGxOYW1lO1xuXHRcdFx0dGhpcy5mYWlsZWRFeHBlY3RhdGlvbnMgPSBvYmouZmFpbGVkRXhwZWN0YXRpb25zO1xuXHRcdFx0dGhpcy5zdGF0dXMgPSBvYmouZmluaXNoZWQ7XG5cdFx0XHR0aGlzLnNwZWNzID0gW107XG5cdFx0fVxuXG5cdFx0dmFyIG15UmVwb3J0ZXIgPSB7XG5cblx0XHRcdGphc21pbmVTdGFydGVkOiBmdW5jdGlvbihvcHRpb25zKXtcblx0XHRcdFx0c3VpdGVzID0gW107XG5cdFx0XHR9LFxuXHRcdFx0c3VpdGVTdGFydGVkOiBmdW5jdGlvbihzdWl0ZSl7XG5cdFx0XHRcdGN1cnJlbnRTdWl0ZSA9IG5ldyBTdWl0ZShzdWl0ZSk7XG5cdFx0XHR9LFxuXHRcdFx0c3BlY1N0YXJ0ZWQ6IGZ1bmN0aW9uKHNwZWMpe1xuXHRcdFx0XHRzY29wZS5zcGVjU3RhcnRlZCA9IHNwZWM7XG5cdFx0XHR9LFxuXHRcdFx0c3BlY0RvbmU6IGZ1bmN0aW9uKHNwZWMpe1xuXHRcdFx0XHRjdXJyZW50U3VpdGUuc3BlY3MucHVzaChzcGVjKTtcblx0XHRcdH0sXG5cdFx0XHRzdWl0ZURvbmU6IGZ1bmN0aW9uKHN1aXRlKXtcblx0XHRcdFx0c3VpdGVzLnB1c2goY3VycmVudFN1aXRlKTtcblx0XHRcdH0sXG5cdFx0XHRqYXNtaW5lRG9uZTogZnVuY3Rpb24oKXtcblx0XHRcdFx0c2NvcGUuc3VpdGVzID0gc3VpdGVzO1xuXHRcdFx0fVxuXHRcdH07XG5cblx0XHR3aW5kb3cuamFzbWluZS5nZXRFbnYoKS5hZGRSZXBvcnRlcihteVJlcG9ydGVyKTtcblx0fVxuXG5cdHJldHVybiB7XG5cdFx0aW5pdGlhbGl6ZUphc21pbmUgOiBpbml0aWFsaXplSmFzbWluZSxcblx0XHRhZGRSZXBvcnRlcjogYWRkUmVwb3J0ZXJcblx0fTtcbn0pOyIsImFwcC5kaXJlY3RpdmUoJ2pzbG9hZCcsIGZ1bmN0aW9uKCl7XG5cdGZ1bmN0aW9uIHVwZGF0ZVNjcmlwdChlbGVtZW50LCB0ZXh0KXtcblx0XHRlbGVtZW50LmVtcHR5KCk7XG5cdFx0dmFyIHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xuXHRcdHNjcmlwdC50eXBlID0gJ3RleHQvamF2YXNjcmlwdCc7XG5cdFx0c2NyaXB0LmlubmVySFRNTCA9IHRleHQ7XG5cdFx0ZWxlbWVudC5hcHBlbmQoc2NyaXB0KTtcblx0fVxuXHRyZXR1cm4ge1xuXHRcdHJlc3RyaWN0IDogJ0UnLFxuXHRcdHNjb3BlIDoge1xuXHRcdFx0dGV4dCA6ICc9J1xuXHRcdH0sXG5cdFx0bGluayA6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRyaWJ1dGVzKXtcblx0XHRcdHNjb3BlLiR3YXRjaCgndGV4dCcsIGZ1bmN0aW9uKHRleHQpe1xuXHRcdFx0XHR1cGRhdGVTY3JpcHQoZWxlbWVudCwgdGV4dCk7XG5cdFx0XHR9KTtcblx0XHR9XG5cdH07XG59KTtcblxuIiwiYXBwLmRpcmVjdGl2ZSgnc2hhcmUnLGZ1bmN0aW9uKEdpc3RGYWN0b3J5LCAkaW9uaWNQb3BvdmVyLCBGcmllbmRzRmFjdG9yeSl7XG4gICByZXR1cm4ge1xuICAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICAgdGVtcGxhdGVVcmw6J2ZlYXR1cmVzL2NvbW1vbi9kaXJlY3RpdmVzL3NoYXJlL3NoYXJlLmh0bWwnLFxuICAgICAgIGxpbms6IGZ1bmN0aW9uKCRzY29wZSwgZWxlbWVudCwgYXR0cmlidXRlcyl7XG4gICAgICAgICAgIC8vIC5mcm9tVGVtcGxhdGVVcmwoKSBtZXRob2RcblxuICAgICAgICAgICAvL1RPRE86IENsZWFudXAgR2lzdEZhY3Rvcnkuc2hhcmVHaXN0KGNvZGUsJHNjb3BlLmRhdGEuZnJpZW5kcykudGhlbihnaXN0U2hhcmVkKTtcblxuICAgICAgICAgICBGcmllbmRzRmFjdG9yeS5nZXRGcmllbmRzKCkudGhlbihhZGRGcmllbmRzKTtcbiAgICAgICAgICAgJHNjb3BlLmRhdGEgPSBbXTtcbiAgICAgICAgICAgJHNjb3BlLmlzQ2hlY2tlZCA9IFtdO1xuICAgICAgICAgICBmdW5jdGlvbiBhZGRGcmllbmRzKHJlc3BvbnNlKXtcbiAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ2FkZEZyaWVuZHMnLHJlc3BvbnNlLmRhdGEuZnJpZW5kcyk7XG4gICAgICAgICAgICAgICAkc2NvcGUuZGF0YS5mcmllbmRzID0gcmVzcG9uc2UuZGF0YS5mcmllbmRzO1xuICAgICAgICAgICB9O1xuXG4gICAgICAgICAgIC8vJHNjb3BlLiR3YXRjaCgnaXNDaGVja2VkJyxmdW5jdGlvbigpe1xuICAgICAgICAgICAvL1x0Y29uc29sZS5sb2coJHNjb3BlLmlzQ2hlY2tlZCk7XG4gICAgICAgICAgIC8vfSk7XG4gICAgICAgICAgIC8vVE9ETzogQ29uZmlybSB0aGF0IHRoaXMgaXMgd29ya2luZyBpbiBhbGwgc2NlbmFyaW9zXG4gICAgICAgICAgICRzY29wZS5zZW5kID0gZnVuY3Rpb24oY29kZSl7XG4gICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKCchQD8hQCMnLGNvZGUpO1xuICAgICAgICAgICAgICAgR2lzdEZhY3Rvcnkuc2hhcmVHaXN0KCRzY29wZS5jb2RlLE9iamVjdC5rZXlzKCRzY29wZS5pc0NoZWNrZWQpKS50aGVuKGdpc3RTaGFyZWQpO1xuICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICRpb25pY1BvcG92ZXIuZnJvbVRlbXBsYXRlVXJsKCdmZWF0dXJlcy9jb21tb24vZGlyZWN0aXZlcy9zaGFyZS9mcmllbmRzLmh0bWwnLCB7XG4gICAgICAgICAgICAgICBzY29wZTogJHNjb3BlXG4gICAgICAgICAgIH0pLnRoZW4oZnVuY3Rpb24ocG9wb3Zlcikge1xuICAgICAgICAgICAgICAgJHNjb3BlLnBvcG92ZXIgPSBwb3BvdmVyO1xuICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAkc2NvcGUub3BlblBvcG92ZXIgPSBmdW5jdGlvbigkZXZlbnQpIHtcbiAgICAgICAgICAgICAgICRzY29wZS5wb3BvdmVyLnNob3coJGV2ZW50KTtcbiAgICAgICAgICAgfTtcbiAgICAgICAgICAgJHNjb3BlLmNsb3NlUG9wb3ZlciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgJHNjb3BlLnBvcG92ZXIuaGlkZSgpO1xuICAgICAgICAgICB9O1xuICAgICAgICAgICAvL0NsZWFudXAgdGhlIHBvcG92ZXIgd2hlbiB3ZSdyZSBkb25lIHdpdGggaXQhXG4gICAgICAgICAgICRzY29wZS4kb24oJyRkZXN0cm95JywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAkc2NvcGUucG9wb3Zlci5yZW1vdmUoKTtcbiAgICAgICAgICAgfSk7XG4gICAgICAgICAgIC8vIEV4ZWN1dGUgYWN0aW9uIG9uIGhpZGUgcG9wb3ZlclxuICAgICAgICAgICAkc2NvcGUuJG9uKCdwb3BvdmVyLmhpZGRlbicsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgLy8gRXhlY3V0ZSBhY3Rpb25cbiAgICAgICAgICAgfSk7XG4gICAgICAgICAgIC8vIEV4ZWN1dGUgYWN0aW9uIG9uIHJlbW92ZSBwb3BvdmVyXG4gICAgICAgICAgICRzY29wZS4kb24oJ3BvcG92ZXIucmVtb3ZlZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgLy8gRXhlY3V0ZSBhY3Rpb25cbiAgICAgICAgICAgfSk7XG4gICAgICAgICAgIC8vfTtcbiAgICAgICAgICAgZ2lzdFNoYXJlZCA9IGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdnaXN0IHNoYXJlZCcscmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgJHNjb3BlLmNsb3NlUG9wb3ZlcigpO1xuICAgICAgICAgICB9O1xuICAgICAgIH1cbiAgIH1cbn0pO1xuIiwiYXBwLmZhY3RvcnkoJ0dpc3RGYWN0b3J5JyxmdW5jdGlvbigkaHR0cCwkcSxBcGlFbmRwb2ludCl7XG5cbiAgICAvL1RPRE86IGhhbmRsaW5nIGZvciBtdWx0aXBsZSBmcmllbmRzIChhZnRlciB0ZXN0aW5nIG9uZSBmcmllbmQgd29ya3MpXG4gICAgLy9UT0RPOiBGcmllbmQgYW5kIGNvZGUgbXVzdCBiZSBwcmVzZW50XG4gICAgLy9UT0RPOiBmcmllbmRzIGlzIGFuIGFycmF5IG9mIGZyaWVuZCBNb25nbyBJRHNcblxuICAgIC8vVE9ETzogU2hhcmUgZGVzY3JpcHRpb24gYW5kIGZpbGVuYW1lIGJhc2VkIG9uIGNoYWxsZW5nZSBmb3IgZXhhbXBsZVxuICAgIC8vVE9ETzpPciBnaXZlIHRoZSB1c2VyIG9wdGlvbnMgb2Ygd2hhdCB0byBmaWxsIGluXG4gICAgZnVuY3Rpb24gc2hhcmVHaXN0KGNvZGUsZnJpZW5kcyxkZXNjcmlwdGlvbixmaWxlTmFtZSl7XG4gICAgICAgIGNvbnNvbGUubG9nKCdjb2RlJyxjb2RlKTtcbiAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoQXBpRW5kcG9pbnQudXJsICsgJy9naXN0cy9zaGFyZUdpc3RzJyxcbiAgICAgICAgICAgIHtnaXN0IDoge1xuICAgICAgICAgICAgICAgIGNvZGU6Y29kZXx8XCJubyBjb2RlIGVudGVyZWRcIixcbiAgICAgICAgICAgICAgICBmcmllbmRzOmZyaWVuZHN8fCBcIjU1NWI2MjNkZmE5YTY1YTQzZTllYzZkNlwiLFxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOmRlc2NyaXB0aW9uIHx8ICdubyBkZXNjcmlwdGlvbicsXG4gICAgICAgICAgICAgICAgZmlsZU5hbWU6ZmlsZU5hbWUrXCIuanNcIiB8fCAnbm8gZmlsZSBuYW1lJ1xuICAgICAgICAgICAgfX0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHF1ZXVlZEdpc3RzKCl7XG4gICAgICAgIHJldHVybiAkaHR0cC5nZXQoQXBpRW5kcG9pbnQudXJsICsgJy9naXN0cy9naXN0c1F1ZXVlJyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY3JlYXRlZEdpc3RzKCl7XG4gICAgICAgIHJldHVybiAkaHR0cC5nZXQoQXBpRW5kcG9pbnQudXJsICsgJy9naXN0cy9jcmVhdGVkR2lzdHMnKVxuICAgIH1cblxuICAgIHJldHVybntcbiAgICAgICAgc2hhcmVHaXN0OiBzaGFyZUdpc3QsXG4gICAgICAgIHF1ZXVlZEdpc3RzOiBxdWV1ZWRHaXN0cywgLy9wdXNoIG5vdGlmaWNhdGlvbnNcbiAgICAgICAgY3JlYXRlZEdpc3RzOiBjcmVhdGVkR2lzdHNcbiAgIH1cbn0pOyJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==