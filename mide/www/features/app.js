// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
var app = angular.module('mide', ['ionic', 'ionic.utils', 'ngCordova'])

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
  //$urlRouterProvider.otherwise('/snippets/create'); // TODO: Richard testing this route
  $urlRouterProvider.otherwise('/welcome'); // TODO: Richard testing this route
  //$urlRouterProvider.otherwise('challenge.view'); //TODO: Tony testing this route
  // $urlRouterProvider.otherwise('welcome');

})
//

////run blocks: http://stackoverflow.com/questions/20663076/angularjs-app-run-documentation
//Use run method to register work which should be performed when the injector is done loading all modules.
//http://devdactic.com/user-auth-angularjs-ionic/

.run(function ($rootScope, $state, AuthService, AUTH_EVENTS, LocalStorage) {

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
        //{
        //  name : 'Account',
        //  ref : function(){return 'account';}
        //},
        {
          name : 'Challenges',
          ref: function(){return 'exercism.compile';}
        },
        {
            name : 'Friends',
            ref: function(){return 'friends';}
        },
        {
            name : 'Sandbox',
            ref : function(){return 'sandbox.code';}
        },
        //{
        //  name : 'Exercises',
        //  ref : function(){return 'exercises'; }
        //},
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


app.config(function($stateProvider, USER_ROLES){

  $stateProvider.state('friends', {
      cache: false, //to ensure the controller is loading each time
      url: '/friends',
      templateUrl: 'features/friends/friends.html',
      controller: 'FriendsCtrl',
      resolve: {
        friends: function(FriendsFactory) {
          return FriendsFactory.getFriends().then(function(response){
            //console.log('response.data friends',response.data.friends);
            return response.data.friends;
          });
        }
      }
    })
    .state('shared-gists', {
      cache: false, //to ensure the controller is loading each time
      url: '/chats/:id',
      templateUrl: 'features/friends/shared-gists.html',
      controller: 'SharedGistsCtrl'
    })
    .state('view-code', {
      cache: false, //to ensure the controller is loading each time
      url: '/chats/code/:id',
      templateUrl: 'features/friends/view-code.html',
      controller: 'ViewCodeCtrl'
    })
});

app.controller('FriendsCtrl', function($scope, FriendsFactory,friends, $state, GistFactory) {
  //console.log('hello world');
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
    $state.go('shared-gists',{id:id}, {inherit:false});
  }

});

app.controller('ViewCodeCtrl', function($state,$scope, $stateParams, FriendsFactory){


  //TODO:
  //var allGists = FriendsFactory.getGists();
  $scope.code = FriendsFactory.userGists[$stateParams.id];

  $scope.goBack = function(n){
    if(n===1){
      $state.go('shared-gists');
    } else {
      $state.go('friends');
    }
  }

});

app.controller('SharedGistsCtrl', function($scope, $stateParams, FriendsFactory,$ionicModal,$state) {
  //console.log('stateParams',$stateParams.id,'gists',FriendsFactory.getGists());
  //TODO: These are all gists, you need to filter based on the user before place on scope.
  $scope.gists = [];

  //$scope.code = '';

  var allGists = FriendsFactory.getGists() || [];

  $scope.goBack = function(){
    $state.go('friends');
  }

  $scope.showCode = function(gistIndex){
    console.log(gistIndex);
    $state.go('view-code',{id:gistIndex}, {inherit:false});
    //$state.go('view-code'); //TODO: which one was clicked, send param id, index of gist
    //console.log('showCode',code);
    //$scope.code = code;
    //$scope.openModal(code);
  };

  //TODO: Only show all Gists from specific user clicked on
  //TODO: Need to apply JSON parse

  allGists.forEach(function(gist){
    if(gist.user === $stateParams.id){
      FriendsFactory.userGists.push(gist.gist.files.fileName.content);
    }
  });
  $scope.gists = FriendsFactory.userGists;
  //$ionicModal.fromTemplateUrl('features/friends/code-modal.html', {
  //  scope: $scope,
  //  cache: false,
  //  animation: 'slide-in-up'
  //}).then(function(modal) {
  //  $scope.modal = modal;
  //});
  //$scope.openModal = function(code) {
  //  //console.log(code);
  //  $scope.modal.show();
  //};
  //$scope.closeModal = function() {
  //  $scope.modal.hide();
  //};
  ////Cleanup the modal when we're done with it!
  //$scope.$on('$destroy', function() {
  //  $scope.modal.remove();
  //});
  //// Execute action on hide modal
  //$scope.$on('modal.hidden', function() {
  //  // Execute action
  //});
  //// Execute action on remove modal
  //$scope.$on('modal.removed', function() {
  //  // Execute action
  //});
  ////$scope.gists = FriendsFactory.getGists();

});

//app.factory('Chats', function() {
//  // Might use a resource here that returns a JSON array
//
//  // Some fake testing data
//  var chats = [{
//    id: 0,
//    name: 'Ben Sparrow',
//    lastText: 'You on your way?',
//    face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
//  }, {
//    id: 1,
//    name: 'Max Lynx',
//    lastText: 'Hey, it\'s not me',
//    face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
//  },{
//    id: 2,
//    name: 'Adam Bradleyson',
//    lastText: 'I should buy a boat',
//    face: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg'
//  }, {
//    id: 3,
//    name: 'Perry Governor',
//    lastText: 'Look at my mukluks!',
//    face: 'https://pbs.twimg.com/profile_images/491995398135767040/ie2Z_V6e.jpeg'
//  }, {
//    id: 4,
//    name: 'Mike Harrington',
//    lastText: 'This is wicked good ice cream.',
//    face: 'https://pbs.twimg.com/profile_images/578237281384841216/R3ae1n61.png'
//  }];
//
//  return {
//    all: function() {
//      return chats;
//    },
//    remove: function(chat) {
//      chats.splice(chats.indexOf(chat), 1);
//    },
//    get: function(chatId) {
//      for (var i = 0; i < chats.length; i++) {
//        if (chats[i].id === parseInt(chatId)) {
//          return chats[i];
//        }
//      }
//      return null;
//    }
//  };
//});

app.factory('FriendsFactory',function($http,$q,ApiEndpoint){
  //get user to add and respond to user
  var userGists = [];
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
    setGists: setGists,
    userGists: userGists
  };

  //TODO: User is not logged in, so you cannot add a friend
});

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

	var authReq = !false; //TODO: Toggle for using authentication work flow - require backend wired up

	if (!authReq){
		$state.go('exercism.view'); //TODO: If Auth is not required, go directly here
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
								$state.go('friends');
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
			//$state.go('signup');
			//DO Nothing
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
app.service('LocalStorage',function($localstorage){
    //if(
    //console.log($cordovaNetwork.getNetwork());
    if($localstorage.get('auth-token')){
        //TODO: Test Network Connection on Device and Via Console Log

        var connection = !false;

        if(connection){
            //sync data
        } else {
            //load data from localStorage
            //you need to store to local storage at some point
            //so anytime you touch any of the localStorage data, be sure to write to it
        }
        //If Internet Connection

        //console.log($cordovaNetwork.getNetwork());
        //console.log(Connection.NONE);
    } else {
        //do nothing - welcome will handle un-auth users
    }
});

//Working Offline
//Sync Common Data on App Load if Possible (and store in LocalStorage) - Otherwise load from Local Storage
    //LocalStorage
        //Store Friends
        //Store Code Received (from Who)
        //Store Last Sync
//Sync Common Data Periodically as well (Not Sure How?!) Maybe on Certain HotSpots (clicking certain links) and TimeBased as wel

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImFib3V0L2Fib3V0LmpzIiwiYWNjb3VudC9hY2NvdW50LmpzIiwiZXhlcmNpc2UvZXhlcmNpc2UuanMiLCJleGVyY2lzZS1jb2RlL2V4ZXJjaXNlLWNvZGUuanMiLCJleGVyY2lzZS1jb21waWxlL2V4ZXJjaXNlLWNvbXBpbGUuanMiLCJleGVyY2lzZS10ZXN0L2V4ZXJjaXNlLXRlc3QuanMiLCJleGVyY2lzZS12aWV3L2V4ZXJjaXNlLXZpZXcuanMiLCJleGVyY2lzZS12aWV3LWVkaXQvZXhlcmNpc2Utdmlldy1lZGl0LmpzIiwiZXhlcmNpc2VzL2V4ZXJjaXNlcy5qcyIsImV4ZXJjaXNlcy1jcmVhdGUvZXhlcmNpc2VzLWNyZWF0ZS5qcyIsImV4ZXJjaXNtL2V4ZXJjaXNtLmpzIiwiZXhlcmNpc20tY29kZS9leGVyY2lzbS1jb2RlLmpzIiwiZXhlcmNpc20tY29tcGlsZS9leGVyY2lzbS1jb21waWxlLmpzIiwiZXhlcmNpc20tdGVzdC9leGVyY2lzbS10ZXN0LmpzIiwiZXhlcmNpc20tdmlldy9leGVyY2lzbS12aWV3LmpzIiwibG9naW4vbG9naW4uanMiLCJmcmllbmRzL2ZyaWVuZHMuanMiLCJzYW5kYm94L3NhbmRib3guanMiLCJzYW5kYm94LWNvZGUvc2FuZGJveC1jb2RlLmpzIiwic2FuZGJveC1jb21waWxlL3NhbmRib3gtY29tcGlsZS5qcyIsInNpZ251cC9zaWdudXAuanMiLCJzbmlwcGV0LWVkaXQvc25pcHBldC1lZGl0LmpzIiwic25pcHBldHMvc25pcHBldHMuanMiLCJzbmlwcGV0cy1jcmVhdGUvc25pcHBldHMtY3JlYXRlLmpzIiwid2VsY29tZS93ZWxjb21lLmpzIiwiY29tbW9uL0F1dGhlbnRpY2F0aW9uL2F1dGhlbnRpY2F0aW9uLmpzIiwiY29tbW9uL2ZhY3Rvcmllcy9LZXlib2FyZEZhY3RvcnkuanMiLCJjb21tb24vZmFjdG9yaWVzL2NvZGVTbmlwcGV0RmFjdG9yeS5qcyIsImNvbW1vbi9maWx0ZXJzL2FwcGVuZC5qcyIsImNvbW1vbi9maWx0ZXJzL2Jvb2wuanMiLCJjb21tb24vZmlsdGVycy9leGVyY2lzbS1mb3JtYXQtbmFtZS5qcyIsImNvbW1vbi9maWx0ZXJzL2xlbmd0aC5qcyIsImNvbW1vbi9maWx0ZXJzL21hcmtlZC5qcyIsImNvbW1vbi9sb2NhbFN0b3JhZ2UvbG9jYWxzdG9yYWdlLmpzIiwiY29tbW9uL21vZHVsZXMvaW9uaWMudXRpbHMuanMiLCJjb21tb24vZGlyZWN0aXZlcy9jb2Rla2V5Ym9hcmRiYXIvY29kZWtleWJvYXJkYmFyLmpzIiwiY29tbW9uL2RpcmVjdGl2ZXMvY29kZWtleWJvYXJkYmFyL3NuaXBwZXRidXR0b25zLmpzIiwiY29tbW9uL2RpcmVjdGl2ZXMvY29kZW1pcnJvci1lZGl0L2NvZGVtaXJyb3ItZWRpdC5qcyIsImNvbW1vbi9kaXJlY3RpdmVzL2NvZGVtaXJyb3ItcmVhZC9jb2RlbWlycm9yLXJlYWQuanMiLCJjb21tb24vZGlyZWN0aXZlcy9qYXNtaW5lL2phc21pbmUuanMiLCJjb21tb24vZGlyZWN0aXZlcy9qcy1sb2FkL2pzLWxvYWQuanMiLCJjb21tb24vZGlyZWN0aXZlcy9zaGFyZS9zaGFyZS5qcyIsImNvbW1vbi9mYWN0b3J5L2dpc3QvZ2lzdC5mYWN0b3J5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6S0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDekNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDekhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDL0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDekpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2SkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gSW9uaWMgU3RhcnRlciBBcHBcblxuLy8gYW5ndWxhci5tb2R1bGUgaXMgYSBnbG9iYWwgcGxhY2UgZm9yIGNyZWF0aW5nLCByZWdpc3RlcmluZyBhbmQgcmV0cmlldmluZyBBbmd1bGFyIG1vZHVsZXNcbi8vICdzdGFydGVyJyBpcyB0aGUgbmFtZSBvZiB0aGlzIGFuZ3VsYXIgbW9kdWxlIGV4YW1wbGUgKGFsc28gc2V0IGluIGEgPGJvZHk+IGF0dHJpYnV0ZSBpbiBpbmRleC5odG1sKVxuLy8gdGhlIDJuZCBwYXJhbWV0ZXIgaXMgYW4gYXJyYXkgb2YgJ3JlcXVpcmVzJ1xuLy8gJ3N0YXJ0ZXIuc2VydmljZXMnIGlzIGZvdW5kIGluIHNlcnZpY2VzLmpzXG4vLyAnc3RhcnRlci5jb250cm9sbGVycycgaXMgZm91bmQgaW4gY29udHJvbGxlcnMuanNcbnZhciBhcHAgPSBhbmd1bGFyLm1vZHVsZSgnbWlkZScsIFsnaW9uaWMnLCAnaW9uaWMudXRpbHMnLCAnbmdDb3Jkb3ZhJ10pXG5cbi5ydW4oZnVuY3Rpb24oJGlvbmljUGxhdGZvcm0pIHtcbiAgJGlvbmljUGxhdGZvcm0ucmVhZHkoZnVuY3Rpb24oKSB7XG4gICAgLy8gSGlkZSB0aGUgYWNjZXNzb3J5IGJhciBieSBkZWZhdWx0IChyZW1vdmUgdGhpcyB0byBzaG93IHRoZSBhY2Nlc3NvcnkgYmFyIGFib3ZlIHRoZSBrZXlib2FyZFxuICAgIC8vIGZvciBmb3JtIGlucHV0cylcbiAgICAvLyAkbG9jYXRpb25Qcm92aWRlci5odG1sNU1vZGUodHJ1ZSk7XG4gICAgaWYgKHdpbmRvdy5jb3Jkb3ZhICYmIHdpbmRvdy5jb3Jkb3ZhLnBsdWdpbnMgJiYgd2luZG93LmNvcmRvdmEucGx1Z2lucy5LZXlib2FyZCkge1xuXG4gICAgICBjb3Jkb3ZhLnBsdWdpbnMuS2V5Ym9hcmQuaGlkZUtleWJvYXJkQWNjZXNzb3J5QmFyKHRydWUpO1xuICAgICAgY29yZG92YS5wbHVnaW5zLktleWJvYXJkLmRpc2FibGVTY3JvbGwodHJ1ZSk7XG4gICAgfVxuICAgIGlmICh3aW5kb3cuU3RhdHVzQmFyKSB7XG4gICAgICAvLyBvcmcuYXBhY2hlLmNvcmRvdmEuc3RhdHVzYmFyIHJlcXVpcmVkXG4gICAgICBTdGF0dXNCYXIuc3R5bGVMaWdodENvbnRlbnQoKTtcbiAgICB9XG4gIH0pO1xufSlcblxuLy9UT0RPOlRoaXMgaXMgbmVlZGVkIHRvIHNldCB0byBhY2Nlc3MgdGhlIHByb3h5IHVybCB0aGF0IHdpbGwgdGhlbiBpbiB0aGUgaW9uaWMucHJvamVjdCBmaWxlIHJlZGlyZWN0IGl0IHRvIHRoZSBjb3JyZWN0IFVSTFxuLmNvbnN0YW50KCdBcGlFbmRwb2ludCcsIHtcbiAgdXJsIDogJ2h0dHA6Ly9sb2NhbGhvc3Q6OTAwMC9hcGknXG59KVxuXG4vL1RPRE86J2h0dHBzOi8vcHJvdGVjdGVkLXJlYWNoZXMtNTk0Ni5oZXJva3VhcHAuY29tL2FwaScgLSBEZXBsb3kgbGF0ZXN0IHNlcnZlciBiZWZvcmUgcmVwbGFjaW5nXG5cbi5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlcikge1xuICAvLyBJb25pYyB1c2VzIEFuZ3VsYXJVSSBSb3V0ZXIgd2hpY2ggdXNlcyB0aGUgY29uY2VwdCBvZiBzdGF0ZXNcbiAgLy8gTGVhcm4gbW9yZSBoZXJlOiBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci11aS91aS1yb3V0ZXJcbiAgLy8gU2V0IHVwIHRoZSB2YXJpb3VzIHN0YXRlcyB3aGljaCB0aGUgYXBwIGNhbiBiZSBpbi5cbiAgLy8gRWFjaCBzdGF0ZSdzIGNvbnRyb2xsZXIgY2FuIGJlIGZvdW5kIGluIGNvbnRyb2xsZXJzLmpzXG4gIC8vIGlmIG5vbmUgb2YgdGhlIGFib3ZlIHN0YXRlcyBhcmUgbWF0Y2hlZCwgdXNlIHRoaXMgYXMgdGhlIGZhbGxiYWNrXG4gIC8vICR1cmxSb3V0ZXJQcm92aWRlci5vdGhlcndpc2UoJy9jaGFsbGVuZ2UvdmlldycpOyAvL1RPRE86IEFsYmVydCB0ZXN0aW5nIHRoaXMgcm91dGVcbiAgLy8kdXJsUm91dGVyUHJvdmlkZXIub3RoZXJ3aXNlKCcvc25pcHBldHMvY3JlYXRlJyk7IC8vIFRPRE86IFJpY2hhcmQgdGVzdGluZyB0aGlzIHJvdXRlXG4gICR1cmxSb3V0ZXJQcm92aWRlci5vdGhlcndpc2UoJy93ZWxjb21lJyk7IC8vIFRPRE86IFJpY2hhcmQgdGVzdGluZyB0aGlzIHJvdXRlXG4gIC8vJHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZSgnY2hhbGxlbmdlLnZpZXcnKTsgLy9UT0RPOiBUb255IHRlc3RpbmcgdGhpcyByb3V0ZVxuICAvLyAkdXJsUm91dGVyUHJvdmlkZXIub3RoZXJ3aXNlKCd3ZWxjb21lJyk7XG5cbn0pXG4vL1xuXG4vLy8vcnVuIGJsb2NrczogaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8yMDY2MzA3Ni9hbmd1bGFyanMtYXBwLXJ1bi1kb2N1bWVudGF0aW9uXG4vL1VzZSBydW4gbWV0aG9kIHRvIHJlZ2lzdGVyIHdvcmsgd2hpY2ggc2hvdWxkIGJlIHBlcmZvcm1lZCB3aGVuIHRoZSBpbmplY3RvciBpcyBkb25lIGxvYWRpbmcgYWxsIG1vZHVsZXMuXG4vL2h0dHA6Ly9kZXZkYWN0aWMuY29tL3VzZXItYXV0aC1hbmd1bGFyanMtaW9uaWMvXG5cbi5ydW4oZnVuY3Rpb24gKCRyb290U2NvcGUsICRzdGF0ZSwgQXV0aFNlcnZpY2UsIEFVVEhfRVZFTlRTLCBMb2NhbFN0b3JhZ2UpIHtcblxuICAgIHZhciBkZXN0aW5hdGlvblN0YXRlUmVxdWlyZXNBdXRoID0gZnVuY3Rpb24gKHN0YXRlKSB7XG4gICAgICAgIC8vY29uc29sZS5sb2coJ2NsIC0gZGVzdGluYXRpb25TdGF0ZVJlcXVpcmVzQXV0aCcsJ3N0YXRlLmRhdGEnLHN0YXRlLmRhdGEsJ3N0YXRlLmRhdGEuYXV0aCcsc3RhdGUuZGF0YS5hdXRoZW50aWNhdGUpO1xuICAgICAgICByZXR1cm4gc3RhdGUuZGF0YSAmJiBzdGF0ZS5kYXRhLmF1dGhlbnRpY2F0ZTtcbiAgICB9O1xuICAgXG4gICAgLy9UT0RPOiBOZWVkIHRvIG1ha2UgYXV0aGVudGljYXRpb24gbW9yZSByb2J1c3QgYmVsb3cgZG9lcyBub3QgZm9sbG93IEZTRyAoZXQuIGFsLilcbiAgICAvL1RPRE86IEN1cnJlbnRseSBpdCBpcyBub3QgY2hlY2tpbmcgdGhlIGJhY2tlbmQgcm91dGUgcm91dGVyLmdldCgnL3Rva2VuJylcbiAgICAkcm9vdFNjb3BlLiRvbignJHN0YXRlQ2hhbmdlU3RhcnQnLCBmdW5jdGlvbiAoZXZlbnQsdG9TdGF0ZSwgdG9QYXJhbXMpIHtcblxuICAgICAgICAvL2NvbnNvbGUubG9nKCd1c2VyIEF1dGhlbnRpY2F0ZWQnLCBBdXRoU2VydmljZS5pc0F1dGhlbnRpY2F0ZWQoKSk7XG5cbiAgICAgICAgaWYgKCFkZXN0aW5hdGlvblN0YXRlUmVxdWlyZXNBdXRoKHRvU3RhdGUpKSB7XG4gICAgICAgICAgICAvLyBUaGUgZGVzdGluYXRpb24gc3RhdGUgZG9lcyBub3QgcmVxdWlyZSBhdXRoZW50aWNhdGlvblxuICAgICAgICAgICAgLy8gU2hvcnQgY2lyY3VpdCB3aXRoIHJldHVybi5cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChBdXRoU2VydmljZS5pc0F1dGhlbnRpY2F0ZWQoKSkge1xuICAgICAgICAgICAgLy8gVGhlIHVzZXIgaXMgYXV0aGVudGljYXRlZC5cbiAgICAgICAgICAgIC8vIFNob3J0IGNpcmN1aXQgd2l0aCByZXR1cm4uXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvL1RPRE86IE5vdCBzdXJlIGhvdyB0byBwcm9jZWVkIGhlcmVcbiAgICAgICAgJHN0YXRlLmdvKCdsb2dpbicpOyAvL2lmIGFib3ZlIGZhaWxzLCBnb3RvIGxvZ2luXG4gICAgfSk7XG4gIC8vICR1cmxSb3V0ZXJQcm92aWRlci5vdGhlcndpc2UoJy9zaWdudXAnKTsgLy8gVE9ETzogUmljaGFyZCB0ZXN0aW5nIHRoaXMgcm91dGVcbiAgLy8kdXJsUm91dGVyUHJvdmlkZXIub3RoZXJ3aXNlKCcvY2hhbGxlbmdlL3ZpZXcnKTsgLy9UT0RPOiBUb255IHRlc3RpbmcgdGhpcyByb3V0ZVxuXG59KTtcblxuYXBwLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlcil7XG4gICAkc3RhdGVQcm92aWRlci5zdGF0ZSgnbWFpbicsIHtcbiAgICAgICB0ZW1wbGF0ZVVybDogJ2ZlYXR1cmVzL2NvbW1vbi9tYWluL21haW4uaHRtbCcsXG4gICAgICAgY29udHJvbGxlcjogJ01lbnVDdHJsJ1xuICAgfSk7XG59KTtcblxuYXBwLmNvbnRyb2xsZXIoJ01haW5DdHJsJywgZnVuY3Rpb24oJHJvb3RTY29wZSwkc2NvcGUsICRpb25pY1NpZGVNZW51RGVsZWdhdGUsICRpb25pY1BvcHVwLCAkc3RhdGUsIEF1dGhTZXJ2aWNlLEFVVEhfRVZFTlRTKXtcbiAgICAkc2NvcGUudXNlcm5hbWUgPSBBdXRoU2VydmljZS51c2VybmFtZSgpO1xuICAgIC8vY29uc29sZS5sb2coQXV0aFNlcnZpY2UuaXNBdXRoZW50aWNhdGVkKCkpO1xuXG4gICAgJHNjb3BlLiRvbihBVVRIX0VWRU5UUy5ub3RBdXRob3JpemVkLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICB2YXIgYWxlcnRQb3B1cCA9ICRpb25pY1BvcHVwLmFsZXJ0KHtcbiAgICAgICAgICAgIHRpdGxlOiAnVW5hdXRob3JpemVkIScsXG4gICAgICAgICAgICB0ZW1wbGF0ZTogJ1lvdSBhcmUgbm90IGFsbG93ZWQgdG8gYWNjZXNzIHRoaXMgcmVzb3VyY2UuJ1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgICRzY29wZS4kb24oQVVUSF9FVkVOVFMubm90QXV0aGVudGljYXRlZCwgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgQXV0aFNlcnZpY2UubG9nb3V0KCk7XG4gICAgICAgIC8vJHN0YXRlLmdvKCdsb2dpbicpO1xuICAgICAgICB2YXIgYWxlcnRQb3B1cCA9ICRpb25pY1BvcHVwLmFsZXJ0KHtcbiAgICAgICAgICAgIHRpdGxlOiAnUGxlYXNlIFJldmlldycsXG4gICAgICAgICAgICB0ZW1wbGF0ZTogJydcbiAgICAgICAgfSk7XG4gICAgfSk7XG59KTtcblxuYXBwLmNvbnRyb2xsZXIoJ01lbnVDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCAkaW9uaWNTaWRlTWVudURlbGVnYXRlLCAkc3RhdGUsIEF1dGhTZXJ2aWNlLCAkcm9vdFNjb3BlKXtcblxuICAgICRzY29wZS5zdGF0ZXMgPSBbXG4gICAgICAgIC8ve1xuICAgICAgICAvLyAgbmFtZSA6ICdBY2NvdW50JyxcbiAgICAgICAgLy8gIHJlZiA6IGZ1bmN0aW9uKCl7cmV0dXJuICdhY2NvdW50Jzt9XG4gICAgICAgIC8vfSxcbiAgICAgICAge1xuICAgICAgICAgIG5hbWUgOiAnQ2hhbGxlbmdlcycsXG4gICAgICAgICAgcmVmOiBmdW5jdGlvbigpe3JldHVybiAnZXhlcmNpc20uY29tcGlsZSc7fVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBuYW1lIDogJ0ZyaWVuZHMnLFxuICAgICAgICAgICAgcmVmOiBmdW5jdGlvbigpe3JldHVybiAnZnJpZW5kcyc7fVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBuYW1lIDogJ1NhbmRib3gnLFxuICAgICAgICAgICAgcmVmIDogZnVuY3Rpb24oKXtyZXR1cm4gJ3NhbmRib3guY29kZSc7fVxuICAgICAgICB9LFxuICAgICAgICAvL3tcbiAgICAgICAgLy8gIG5hbWUgOiAnRXhlcmNpc2VzJyxcbiAgICAgICAgLy8gIHJlZiA6IGZ1bmN0aW9uKCl7cmV0dXJuICdleGVyY2lzZXMnOyB9XG4gICAgICAgIC8vfSxcbiAgICAgICAge1xuICAgICAgICAgIG5hbWUgOiAnTXkgU25pcHBldHMnLFxuICAgICAgICAgIHJlZiA6IGZ1bmN0aW9uICgpe3JldHVybiAnc25pcHBldHMnO31cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIG5hbWUgOiAnQWJvdXQnLFxuICAgICAgICAgIHJlZiA6IGZ1bmN0aW9uKCl7IHJldHVybiAnYWJvdXQnO31cbiAgICAgICAgfVxuICAgIF07XG5cbiAgICAkc2NvcGUudG9nZ2xlTWVudVNob3cgPSBmdW5jdGlvbigpe1xuICAgICAgICAvL2NvbnNvbGUubG9nKCdBdXRoU2VydmljZScsQXV0aFNlcnZpY2UuaXNBdXRoZW50aWNhdGVkKCkpXG4gICAgICAgIC8vY29uc29sZS5sb2coJ3RvZ2dsZU1lbnVTaG93JyxBdXRoU2VydmljZS5pc0F1dGhlbnRpY2F0ZWQoKSk7XG4gICAgICAgIC8vVE9ETzogcmV0dXJuIEF1dGhTZXJ2aWNlLmlzQXV0aGVudGljYXRlZCgpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9O1xuXG4gICAgJHJvb3RTY29wZS4kb24oJ0F1dGgnLGZ1bmN0aW9uKCl7XG4gICAgICAgLy9jb25zb2xlLmxvZygnYXV0aCcpO1xuICAgICAgICRzY29wZS50b2dnbGVNZW51U2hvdygpO1xuICAgIH0pO1xuXG4gICAgLy9jb25zb2xlLmxvZyhBdXRoU2VydmljZS5pc0F1dGhlbnRpY2F0ZWQoKSk7XG4gICAgLy9pZihBdXRoU2VydmljZS5pc0F1dGhlbnRpY2F0ZWQoKSl7XG4gICAgJHNjb3BlLmNsaWNrSXRlbSA9IGZ1bmN0aW9uKHN0YXRlUmVmKXtcbiAgICAgICAgJGlvbmljU2lkZU1lbnVEZWxlZ2F0ZS50b2dnbGVMZWZ0KCk7XG4gICAgICAgICRzdGF0ZS5nbyhzdGF0ZVJlZigpKTsgLy9SQjogVXBkYXRlZCB0byBoYXZlIHN0YXRlUmVmIGFzIGEgZnVuY3Rpb24gaW5zdGVhZC5cbiAgICB9O1xuXG4gICAgJHNjb3BlLnRvZ2dsZU1lbnUgPSBmdW5jdGlvbigpe1xuICAgICAgICAkaW9uaWNTaWRlTWVudURlbGVnYXRlLnRvZ2dsZUxlZnQoKTtcbiAgICB9O1xuICAgIC8vfVxufSk7IiwiYXBwLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlcil7XG5cdCRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdhYm91dCcsIHtcblx0XHR1cmw6ICcvYWJvdXQnLFxuXHRcdHRlbXBsYXRlVXJsOiAnZmVhdHVyZXMvYWJvdXQvYWJvdXQuaHRtbCdcblx0fSk7XG59KTsiLCJhcHAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyLCBVU0VSX1JPTEVTKXtcblx0Ly8gRWFjaCB0YWIgaGFzIGl0cyBvd24gbmF2IGhpc3Rvcnkgc3RhY2s6XG5cdCRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdhY2NvdW50Jywge1xuXHRcdHVybDogJy9hY2NvdW50Jyxcblx0ICAgIHRlbXBsYXRlVXJsOiAnZmVhdHVyZXMvYWNjb3VudC9hY2NvdW50Lmh0bWwnLFxuXHRcdGNvbnRyb2xsZXI6ICdBY2NvdW50Q3RybCdcblx0XHQvLyAsXG5cdFx0Ly8gZGF0YToge1xuXHRcdC8vIFx0YXV0aGVudGljYXRlOiBbVVNFUl9ST0xFUy5wdWJsaWNdXG5cdFx0Ly8gfVxuXHR9KTtcbn0pO1xuXG5hcHAuY29udHJvbGxlcignQWNjb3VudEN0cmwnLCBmdW5jdGlvbigkc2NvcGUpIHtcblx0JHNjb3BlLnNldHRpbmdzID0ge1xuXHRcdGVuYWJsZUZyaWVuZHM6IHRydWVcblx0fTtcbn0pOyIsImFwcC5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIpe1xuXHQkc3RhdGVQcm92aWRlci5zdGF0ZSgnZXhlcmNpc2UnLHtcblx0XHR1cmw6ICcvZXhlcmNpc2UvOnNsdWcnLFxuXHRcdGFic3RyYWN0OiB0cnVlLFxuXHRcdHRlbXBsYXRlVXJsIDogJ2ZlYXR1cmVzL2V4ZXJjaXNlL2V4ZXJjaXNlLmh0bWwnXG5cdH0pO1xufSk7XG5cbmFwcC5mYWN0b3J5KCdFeGVyY2lzZUZhY3RvcnknLCBmdW5jdGlvbigpe1xuXG59KTsiLCJhcHAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKXtcblx0JHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2V4ZXJjaXNlLmNvZGUnLCB7XG5cdFx0dXJsIDogJy9leGVyY2lzZS86c2x1Zy9jb2RlJyxcblx0XHR2aWV3cyA6IHtcblx0XHRcdCd0YWItY29kZScgOiB7XG5cdFx0XHRcdHRlbXBsYXRlVXJsIDogJ2ZlYXR1cmVzL2V4ZXJjaXNlLWNvZGUvZXhlcmNpc2UtY29kZS5odG1sJyxcblx0XHRcdFx0Y29udHJvbGxlcjogJ0V4ZXJjaXNlQ29kZUN0cmwnXG5cdFx0XHR9XG5cdFx0fVxuXHR9KTtcbn0pO1xuXG5hcHAuY29udHJvbGxlcignRXhlcmNpc2VDb2RlQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSl7XG59KTsiLCJhcHAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKXtcblx0JHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2V4ZXJjaXNlLmNvbXBpbGUnLCB7XG5cdFx0dXJsIDogJy9leGVyY2lzZS86c2x1Zy9jb21waWxlJyxcblx0XHR2aWV3cyA6IHtcblx0XHRcdCd0YWItY29tcGlsZScgOiB7XG5cdFx0XHRcdHRlbXBsYXRlVXJsIDogJ2ZlYXR1cmVzL2V4ZXJjaXNlLWNvbXBpbGUvZXhlcmNpc2UtY29tcGlsZS5odG1sJyxcblx0XHRcdFx0Y29udHJvbGxlcjogJ0V4ZXJjaXNlQ29tcGlsZUN0cmwnXG5cdFx0XHR9XG5cdFx0fVxuXHR9KTtcbn0pO1xuXG5hcHAuY29udHJvbGxlcignRXhlcmNpc2VDb21waWxlQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSl7XG5cbn0pOyIsImFwcC5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIpe1xuXHQkc3RhdGVQcm92aWRlci5zdGF0ZSgnZXhlcmNpc2UudGVzdCcsIHtcblx0XHR1cmwgOiAnL2V4ZXJjaXNlLzpzbHVnL3Rlc3QnLFxuXHRcdHZpZXdzIDoge1xuXHRcdFx0J3RhYi10ZXN0JyA6IHtcblx0XHRcdFx0dGVtcGxhdGVVcmwgOiAnZmVhdHVyZXMvZXhlcmNpc2UtdGVzdC9leGVyY2lzZS10ZXN0Lmh0bWwnLFxuXHRcdFx0XHRjb250cm9sbGVyOiAnRXhlcmNpc2VUZXN0Q3RybCdcblx0XHRcdH1cblx0XHR9XG5cdH0pO1xufSk7XG5cbmFwcC5jb250cm9sbGVyKCdFeGVyY2lzZVRlc3RDdHJsJywgZnVuY3Rpb24oJHNjb3BlKXtcblxufSk7IiwiYXBwLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlcil7XG5cdCRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdleGVyY2lzZS52aWV3Jywge1xuXHRcdHVybCA6ICcvZXhlcmNpc2UvOnNsdWcvdmlldycsXG5cdFx0dmlld3MgOiB7XG5cdFx0XHQndGFiLXZpZXcnIDoge1xuXHRcdFx0XHR0ZW1wbGF0ZVVybCA6ICdmZWF0dXJlcy9leGVyY2lzZS12aWV3L2V4ZXJjaXNlLXZpZXcuaHRtbCcsXG5cdFx0XHRcdGNvbnRyb2xsZXI6ICdFeGVyY2lzZVZpZXdDdHJsJ1xuXHRcdFx0fVxuXHRcdH1cblx0fSk7XG59KTtcblxuYXBwLmNvbnRyb2xsZXIoJ0V4ZXJjaXNlVmlld0N0cmwnLCBmdW5jdGlvbigkc2NvcGUpe1xuXG59KTsiLCJhcHAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKXtcblx0JHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2V4ZXJjaXNlLnZpZXctZWRpdCcsIHtcblx0XHR1cmwgOiAnL2V4ZXJjaXNlLzpzbHVnL3ZpZXcvZWRpdCcsXG5cdFx0dmlld3MgOiB7XG5cdFx0XHQndGFiLXZpZXcnIDoge1xuXHRcdFx0XHR0ZW1wbGF0ZVVybCA6ICdmZWF0dXJlcy9leGVyY2lzZS12aWV3LWVkaXQvZXhlcmNpc2Utdmlldy1lZGl0Lmh0bWwnLFxuXHRcdFx0XHRjb250cm9sbGVyOiAnRXhlcmNpc2VWaWV3RWRpdEN0cmwnXG5cdFx0XHR9XG5cdFx0fVxuXHR9KTtcbn0pO1xuXG5hcHAuY29udHJvbGxlcignRXhlcmNpc2VWaWV3RWRpdEN0cmwnLCBmdW5jdGlvbigkc2NvcGUpe1xuXG59KTsiLCJhcHAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKXtcblx0JHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2V4ZXJjaXNlcycsIHtcblx0XHR1cmwgOiAnL2V4ZXJjaXNlcycsXG5cdFx0dGVtcGxhdGVVcmwgOiAnZmVhdHVyZXMvZXhlcmNpc2VzL2V4ZXJjaXNlcy5odG1sJyxcblx0XHRjb250cm9sbGVyOiAnRXhlcmNpc2VzQ3RybCdcblx0fSk7XG59KTtcblxuYXBwLmNvbnRyb2xsZXIoJ0V4ZXJjaXNlc0N0cmwnLCBmdW5jdGlvbigkc2NvcGUsICRzdGF0ZSl7XG5cdCRzY29wZS5jcmVhdGUgPSBmdW5jdGlvbigpe1xuXHRcdCRzdGF0ZS5nbygnZXhlcmNpc2VzLWNyZWF0ZScpO1xuXHR9O1xufSk7XG5cbmFwcC5mYWN0b3J5KCdFeGVyY2lzZUZhY3RvcnknLCBmdW5jdGlvbigkbG9jYWxzdG9yYWdlKXtcblx0dmFyIGV4ZXJjaXNlcyA9ICRsb2NhbHN0b3JhZ2UuZ2V0T2JqZWN0KCdleGVyY2lzZXMnKTtcblx0aWYod2luZG93Ll8uaXNFbXB0eShleGVyY2lzZXMpKSBleGVyY2lzZXMgPSBbXTtcblxuXHRyZXR1cm4ge1xuXHRcdGdldEV4ZXJjaXNlcyA6IGZ1bmN0aW9uKCl7XG5cdFx0XHRyZXR1cm4gZXhlcmNpc2VzO1xuXHRcdH0sXG5cdFx0Y3JlYXRlRXhlcmNpc2UgOiBmdW5jdGlvbihleGVyY2lzZSl7XG5cdFx0XHRleGVyY2lzZXMucHVzaChleGVyY2lzZSk7XG5cdFx0XHQkbG9jYWxzdG9yYWdlLnNldE9iamVjdChleGVyY2lzZXMpO1xuXHRcdH0sXG5cdFx0Z2V0RXhlcmNpc2UgOiBmdW5jdGlvbihzbHVnKXtcblx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgZXhlcmNpc2VzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdGlmIChleGVyY2lzZXNbaV0uc2x1ZyA9PT0gc2x1ZykgcmV0dXJuIGV4ZXJjaXNlc1tpXTtcblx0XHRcdH1cblx0XHRcdHJldHVybiB7fTtcblx0XHR9LFxuXHRcdHVwZGF0ZUV4ZXJjaXNlIDogZnVuY3Rpb24oZXhlcmNpc2Upe1xuXHRcdFx0Zm9yKHZhciBpID0gMDsgaSA8IGV4ZXJjaXNlcy5sZW5ndGg7IGkrKyl7XG5cblx0XHRcdH1cblx0XHR9LFxuXHRcdGRlbGV0ZUV4ZXJjaXNlIDogZnVuY3Rpb24oKXtcblxuXHRcdH1cblx0fTtcbn0pOyIsImFwcC5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIpe1xuXHQkc3RhdGVQcm92aWRlci5zdGF0ZSgnZXhlcmNpc2VzLWNyZWF0ZScsIHtcblx0XHR1cmwgOiAnL2V4ZXJjaXNlcy9jcmVhdGUnLFxuXHRcdHRlbXBsYXRlVXJsIDogJ2ZlYXR1cmVzL2V4ZXJjaXNlcy1jcmVhdGUvZXhlcmNpc2VzLWNyZWF0ZS5odG1sJyxcblx0XHRjb250cm9sbGVyOiAnRXhlcmNpc2VzQ3JlYXRlQ3RybCdcblx0fSk7XG59KTtcblxuYXBwLmNvbnRyb2xsZXIoJ0V4ZXJjaXNlc0NyZWF0ZUN0cmwnLCBmdW5jdGlvbigkc2NvcGUpe1xuXG59KTsiLCJhcHAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKXtcblx0JHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2V4ZXJjaXNtJywge1xuXHRcdHRlbXBsYXRlVXJsIDogJ2ZlYXR1cmVzL2V4ZXJjaXNtL2V4ZXJjaXNtLmh0bWwnLFxuXHRcdGFic3RyYWN0IDogdHJ1ZSxcblx0XHRyZXNvbHZlIDoge1xuXHRcdFx0bWFya2Rvd24gOiBmdW5jdGlvbihBdmFpbGFibGVFeGVyY2lzZXMsIEV4ZXJjaXNtRmFjdG9yeSwgJHN0YXRlKXtcblxuXHRcdFx0XHRpZihFeGVyY2lzbUZhY3RvcnkuZ2V0VGVzdFNjcmlwdCgpLmxlbmd0aCA9PT0gMCkge1xuXHRcdFx0XHRcdHZhciBleGVyY2lzZSA9IEF2YWlsYWJsZUV4ZXJjaXNlcy5nZXRSYW5kb21FeGVyY2lzZSgpO1xuXHRcdFx0XHRcdEV4ZXJjaXNtRmFjdG9yeS5zZXROYW1lKGV4ZXJjaXNlLm5hbWUpO1xuXHRcdFx0XHRcdHJldHVybiBFeGVyY2lzbUZhY3RvcnkuZ2V0RXh0ZXJuYWxTY3JpcHQoZXhlcmNpc2UubGluaykudGhlbihmdW5jdGlvbihkYXRhKXtcblx0XHRcdFx0XHRcdHJldHVybiBFeGVyY2lzbUZhY3RvcnkuZ2V0RXh0ZXJuYWxNZChleGVyY2lzZS5tZExpbmspO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHR9XG5cdH0pO1xufSk7XG5cbmFwcC5mYWN0b3J5KCdFeGVyY2lzbUZhY3RvcnknLCBmdW5jdGlvbigkaHR0cCwgJHJvb3RTY29wZSl7XG5cdHZhciBuYW1lID0gJyc7XG5cdHZhciB0ZXN0ID0gJyc7XG5cdHZhciBjb2RlID0gJyc7XG5cdHZhciBtYXJrZG93biA9ICcnO1xuXG5cdHJldHVybiB7XG5cdFx0Z2V0RXh0ZXJuYWxTY3JpcHQgOiBmdW5jdGlvbihsaW5rKXtcblx0XHRcdHJldHVybiAkaHR0cC5nZXQobGluaykudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG5cdFx0XHRcdHRlc3QgPSByZXNwb25zZS5kYXRhO1xuXHRcdFx0XHRyZXR1cm4gcmVzcG9uc2UuZGF0YTtcblx0XHRcdH0pO1xuXHRcdH0sXG5cdFx0Z2V0RXh0ZXJuYWxNZCA6IGZ1bmN0aW9uKGxpbmspe1xuXHRcdFx0cmV0dXJuICRodHRwLmdldChsaW5rKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcblx0XHRcdFx0bWFya2Rvd24gPSByZXNwb25zZS5kYXRhO1xuXHRcdFx0XHRyZXR1cm4gcmVzcG9uc2UuZGF0YTtcblx0XHRcdH0pO1xuXHRcdH0sXG5cdFx0c2V0TmFtZSA6IGZ1bmN0aW9uKHNldE5hbWUpe1xuXHRcdFx0bmFtZSA9IHNldE5hbWU7XG5cdFx0fSxcblx0XHRzZXRUZXN0U2NyaXB0IDogZnVuY3Rpb24odGVzdCl7XG5cdFx0XHR0ZXN0ID0gdGVzdDtcblx0XHRcdCRyb290U2NvcGUuJGJyb2FkY2FzdCgndGVzdENoYW5nZScsIHRlc3QpO1xuXHRcdH0sXG5cdFx0c2V0Q29kZVNjcmlwdCA6IGZ1bmN0aW9uIChjb2RlKXtcblx0XHRcdGNvZGUgPSBjb2RlO1xuXHRcdFx0JHJvb3RTY29wZS4kYnJvYWRjYXN0KCdjb2RlQ2hhbmdlJywgY29kZSk7XG5cdFx0fSxcblx0XHRnZXRUZXN0U2NyaXB0IDogZnVuY3Rpb24oKXtcblx0XHRcdHJldHVybiB0ZXN0O1xuXHRcdH0sXG5cdFx0Z2V0Q29kZVNjcmlwdCA6IGZ1bmN0aW9uKCl7XG5cdFx0XHRyZXR1cm4gY29kZTtcblx0XHR9LFxuXHRcdGdldE1hcmtkb3duIDogZnVuY3Rpb24oKXtcblx0XHRcdHJldHVybiBtYXJrZG93bjtcblx0XHR9LFxuXHRcdGdldE5hbWUgOiBmdW5jdGlvbigpe1xuXHRcdFx0cmV0dXJuIG5hbWU7XG5cdFx0fVxuXHR9O1xufSk7XG5cbmFwcC5mYWN0b3J5KCdBdmFpbGFibGVFeGVyY2lzZXMnLCBmdW5jdGlvbigpe1xuXG5cdHZhciBsaWJyYXJ5ID0gW1xuXHRcdCdhY2N1bXVsYXRlJyxcblx0XHQnYWxsZXJnaWVzJyxcblx0XHQnYW5hZ3JhbScsXG5cdFx0J2F0YmFzaC1jaXBoZXInLFxuXHRcdCdiZWVyLXNvbmcnLFxuXHRcdCdiaW5hcnknLFxuXHRcdCdiaW5hcnktc2VhcmNoLXRyZWUnLFxuXHRcdCdib2InLFxuXHRcdCdicmFja2V0LXB1c2gnLFxuXHRcdCdjaXJjdWxhci1idWZmZXInLFxuXHRcdCdjbG9jaycsXG5cdFx0J2NyeXB0by1zcXVhcmUnLFxuXHRcdCdjdXN0b20tc2V0Jyxcblx0XHQnZGlmZmVyZW5jZS1vZi1zcXVhcmVzJyxcblx0XHQnZXRsJyxcblx0XHQnZm9vZC1jaGFpbicsXG5cdFx0J2dpZ2FzZWNvbmQnLFxuXHRcdCdncmFkZS1zY2hvb2wnLFxuXHRcdCdncmFpbnMnLFxuXHRcdCdoYW1taW5nJyxcblx0XHQnaGVsbG8td29ybGQnLFxuXHRcdCdoZXhhZGVjaW1hbCdcblx0XTtcblxuXHR2YXIgZ2VuZXJhdGVMaW5rID0gZnVuY3Rpb24obmFtZSl7XG5cdFx0cmV0dXJuICdleGVyY2lzbS9qYXZhc2NyaXB0LycgKyBuYW1lICsgJy8nICsgbmFtZSArICdfdGVzdC5zcGVjLmpzJztcblx0fTtcblxuXHR2YXIgZ2VuZXJhdGVNZExpbmsgPSBmdW5jdGlvbihuYW1lKXtcblx0XHRyZXR1cm4gJ2V4ZXJjaXNtL2phdmFzY3JpcHQvJyArIG5hbWUgKyAnLycgKyBuYW1lICsgJy5tZCc7XG5cdH07XG5cblx0dmFyIGdlbmVyYXRlUmFuZG9tID0gZnVuY3Rpb24oKXtcblx0XHR2YXIgcmFuZG9tID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogbGlicmFyeS5sZW5ndGgpO1xuXHRcdHJldHVybiBsaWJyYXJ5W3JhbmRvbV07XG5cdH07XG5cblx0cmV0dXJuIHtcblx0XHRnZXRTcGVjaWZpY0V4ZXJjaXNlIDogZnVuY3Rpb24obmFtZSl7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRsaW5rIDogZ2VuZXJhdGVMaW5rKG5hbWUpLFxuXHRcdFx0XHRtZExpbmsgOiBnZW5lcmF0ZU1kTGluayhuYW1lKVxuXHRcdFx0fTtcblx0XHR9LFxuXHRcdGdldFJhbmRvbUV4ZXJjaXNlIDogZnVuY3Rpb24oKXtcblx0XHRcdHZhciBuYW1lID0gZ2VuZXJhdGVSYW5kb20oKTtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdG5hbWUgOiBuYW1lLFxuXHRcdFx0XHRsaW5rIDogZ2VuZXJhdGVMaW5rKG5hbWUpLFxuXHRcdFx0XHRtZExpbmsgOiBnZW5lcmF0ZU1kTGluayhuYW1lKVxuXHRcdFx0fTtcblx0XHR9XG5cdH07XG59KTsiLCJhcHAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKXtcblx0JHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2V4ZXJjaXNtLmNvZGUnLCB7XG5cdFx0dXJsIDogJy9leGVyY2lzbS9jb2RlJyxcblx0XHR2aWV3cyA6IHtcblx0XHRcdCd0YWItY29kZScgOiB7XG5cdFx0XHRcdHRlbXBsYXRlVXJsIDogJ2ZlYXR1cmVzL2V4ZXJjaXNtLWNvZGUvZXhlcmNpc20tY29kZS5odG1sJyxcblx0XHRcdFx0Y29udHJvbGxlcjogJ0V4ZXJjaXNtQ29kZUN0cmwnXG5cdFx0XHR9XG5cdFx0fVxuXHR9KTtcbn0pO1xuXG5hcHAuY29udHJvbGxlcignRXhlcmNpc21Db2RlQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgRXhlcmNpc21GYWN0b3J5LCAkc3RhdGUsIEtleWJvYXJkRmFjdG9yeSl7XG5cdCRzY29wZS5uYW1lID0gRXhlcmNpc21GYWN0b3J5LmdldE5hbWUoKTtcblx0JHNjb3BlLmNvZGUgPSB7XG5cdFx0dGV4dCA6IG51bGxcblx0fTtcblxuXHQkc2NvcGUuY29kZS50ZXh0ID0gRXhlcmNpc21GYWN0b3J5LmdldENvZGVTY3JpcHQoKTtcblx0Ly9kb2Vzbid0IGRvIGFueXRoaW5nIHJpZ2h0IG5vdyAtIG1heWJlIHB1bGwgcHJldmlvdXNseSBzYXZlZCBjb2RlXG5cblx0Ly9wYXNzaW5nIHRoaXMgdXBkYXRlIGZ1bmN0aW9uIHNvIHRoYXQgb24gdGV4dCBjaGFuZ2UgaW4gdGhlIGRpcmVjdGl2ZSB0aGUgZmFjdG9yeSB3aWxsIGJlIGFsZXJ0ZWRcblx0JHNjb3BlLmNvbXBpbGUgPSBmdW5jdGlvbihjb2RlKXtcblx0XHRFeGVyY2lzbUZhY3Rvcnkuc2V0Q29kZVNjcmlwdChjb2RlKTtcblx0XHQkc3RhdGUuZ28oJ2V4ZXJjaXNtLmNvbXBpbGUnKTtcblx0fTtcblxuXHQkc2NvcGUuaW5zZXJ0RnVuYyA9IEtleWJvYXJkRmFjdG9yeS5tYWtlSW5zZXJ0RnVuYygkc2NvcGUpO1xuXG59KTsiLCJhcHAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKXtcblx0JHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2V4ZXJjaXNtLmNvbXBpbGUnLCB7XG5cdFx0dXJsIDogJy9leGVyY2lzbS9jb21waWxlJyxcblx0XHR2aWV3cyA6IHtcblx0XHRcdCd0YWItY29tcGlsZScgOiB7XG5cdFx0XHRcdHRlbXBsYXRlVXJsIDogJ2ZlYXR1cmVzL2V4ZXJjaXNtLWNvbXBpbGUvZXhlcmNpc20tY29tcGlsZS5odG1sJyxcblx0XHRcdFx0Y29udHJvbGxlcjogJ0V4ZXJjaXNtQ29tcGlsZUN0cmwnXG5cdFx0XHR9XG5cdFx0fSxcblx0XHRvbkVudGVyIDogZnVuY3Rpb24oKXtcblx0XHRcdGlmKHdpbmRvdy5qYXNtaW5lKSB3aW5kb3cuamFzbWluZS5nZXRFbnYoKS5leGVjdXRlKCk7XG5cdFx0fVxuXHR9KTtcbn0pO1xuXG5hcHAuY29udHJvbGxlcignRXhlcmNpc21Db21waWxlQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgRXhlcmNpc21GYWN0b3J5KXtcblx0JHNjb3BlLm5hbWUgPSBFeGVyY2lzbUZhY3RvcnkuZ2V0TmFtZSgpO1xuXHQkc2NvcGUuY29tcGlsaW5nID0ge1xuXHRcdHRlc3Q6IG51bGwsXG5cdFx0Y29kZSA6IG51bGxcblx0fTtcblx0JHNjb3BlLmNvbXBpbGluZy50ZXN0ID0gRXhlcmNpc21GYWN0b3J5LmdldFRlc3RTY3JpcHQoKTtcblx0JHNjb3BlLmNvbXBpbGluZy5jb2RlID0gRXhlcmNpc21GYWN0b3J5LmdldENvZGVTY3JpcHQoKTtcblxuXG5cdCRzY29wZS4kb24oJ3Rlc3RDaGFuZ2UnLCBmdW5jdGlvbihldmVudCwgZGF0YSl7XG5cdFx0JHNjb3BlLmNvbXBpbGluZy50ZXN0ID0gZGF0YTtcblx0fSk7XG5cblx0JHNjb3BlLiRvbignY29kZUNoYW5nZScsIGZ1bmN0aW9uKGV2ZW50LCBkYXRhKXtcblx0XHQkc2NvcGUuY29tcGlsaW5nLmNvZGUgPSBkYXRhO1xuXHR9KTtcbn0pOyIsImFwcC5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIpe1xuXHQkc3RhdGVQcm92aWRlci5zdGF0ZSgnZXhlcmNpc20udGVzdCcsIHtcblx0XHR1cmwgOiAnL2V4ZXJjaXNtL3Rlc3QnLFxuXHRcdHZpZXdzIDoge1xuXHRcdFx0J3RhYi10ZXN0JyA6IHtcblx0XHRcdFx0dGVtcGxhdGVVcmwgOiAnZmVhdHVyZXMvZXhlcmNpc20tdGVzdC9leGVyY2lzbS10ZXN0Lmh0bWwnLFxuXHRcdFx0XHRjb250cm9sbGVyIDogJ0V4ZXJjaXNtVGVzdEN0cmwnXG5cdFx0XHR9XG5cdFx0fVxuXHR9KTtcbn0pO1xuXG5hcHAuY29udHJvbGxlcignRXhlcmNpc21UZXN0Q3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgRXhlcmNpc21GYWN0b3J5KXtcblxuXHQkc2NvcGUubmFtZSA9IEV4ZXJjaXNtRmFjdG9yeS5nZXROYW1lKCk7XG5cblx0JHNjb3BlLnRlc3QgPSB7XG5cdFx0dGV4dDogbnVsbFxuXHR9O1xuXG5cdCRzY29wZS50ZXN0LnRleHQgPSBFeGVyY2lzbUZhY3RvcnkuZ2V0VGVzdFNjcmlwdCgpO1xuXG5cdCRzY29wZS4kd2F0Y2goJ3Rlc3QudGV4dCcsIGZ1bmN0aW9uKG5ld1ZhbHVlKXtcblx0XHRFeGVyY2lzbUZhY3Rvcnkuc2V0VGVzdFNjcmlwdChuZXdWYWx1ZSk7XG5cdH0pO1xufSk7IiwiYXBwLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlcil7XG5cdCRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdleGVyY2lzbS52aWV3Jywge1xuXHRcdHVybDogJy9leGVyY2lzbS92aWV3Jyxcblx0XHR2aWV3czoge1xuXHRcdFx0J3RhYi12aWV3JyA6IHtcblx0XHRcdFx0dGVtcGxhdGVVcmw6ICdmZWF0dXJlcy9leGVyY2lzbS12aWV3L2V4ZXJjaXNtLXZpZXcuaHRtbCcsXG5cdFx0XHRcdGNvbnRyb2xsZXI6ICdFeGVyY2lzbVZpZXdDdHJsJ1xuXHRcdFx0fVxuXHRcdH1cblx0fSk7XG59KTtcblxuYXBwLmNvbnRyb2xsZXIoJ0V4ZXJjaXNtVmlld0N0cmwnLCBmdW5jdGlvbigkc2NvcGUsIEV4ZXJjaXNtRmFjdG9yeSl7XG5cdCRzY29wZS5tYXJrZG93biA9IEV4ZXJjaXNtRmFjdG9yeS5nZXRNYXJrZG93bigpO1xuXHQkc2NvcGUubmFtZSA9IEV4ZXJjaXNtRmFjdG9yeS5nZXROYW1lKCk7XG59KTsiLCJhcHAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKXtcblx0JHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2xvZ2luJywge1xuXHRcdHVybCA6ICcvbG9naW4nLFxuXHRcdHRlbXBsYXRlVXJsIDogJ2ZlYXR1cmVzL2xvZ2luL2xvZ2luLmh0bWwnLFxuXHRcdGNvbnRyb2xsZXIgOiAnTG9naW5DdHJsJ1xuXHR9KTtcbn0pO1xuXG5hcHAuY29udHJvbGxlcignTG9naW5DdHJsJywgZnVuY3Rpb24oJHJvb3RTY29wZSwgJHNjb3BlLCAkaW9uaWNQb3B1cCwgJHN0YXRlLCBBdXRoU2VydmljZSl7XG5cdCRzY29wZS5kYXRhID0ge307XG5cdCRzY29wZS5lcnJvciA9IG51bGw7XG5cbiAgICAkc2NvcGUuc2lnbnVwID0gZnVuY3Rpb24oKXtcbiAgICAgICAgJHN0YXRlLmdvKCdzaWdudXAnKTtcbiAgICB9O1xuXG5cdCRzY29wZS5sb2dpbiA9IGZ1bmN0aW9uKCl7XG5cdFx0QXV0aFNlcnZpY2Vcblx0XHRcdC5sb2dpbigkc2NvcGUuZGF0YSlcblx0XHRcdC50aGVuKGZ1bmN0aW9uKGF1dGhlbnRpY2F0ZWQpeyAvL1RPRE86YXV0aGVudGljYXRlZCBpcyB3aGF0IGlzIHJldHVybmVkXG5cdFx0XHRcdC8vY29uc29sZS5sb2coJ2xvZ2luLCB0YWIuY2hhbGxlbmdlLXN1Ym1pdCcpO1xuXHRcdFx0XHQvLyRzY29wZS5tZW51ID0gdHJ1ZTtcblx0XHRcdFx0JHJvb3RTY29wZS4kYnJvYWRjYXN0KCdBdXRoJyk7XG5cdFx0XHRcdCRzY29wZS5zdGF0ZXMucHVzaCh7IC8vVE9ETzogTmVlZCB0byBhZGQgYSBwYXJlbnQgY29udHJvbGxlciB0byBjb21tdW5pY2F0ZVxuXHRcdFx0XHRcdG5hbWU6ICdMb2dvdXQnLFxuXHRcdFx0XHRcdHJlZjogZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRcdEF1dGhTZXJ2aWNlLmxvZ291dCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmRhdGEgPSB7fTtcblx0XHRcdFx0XHRcdCRzY29wZS5zdGF0ZXMucG9wKCk7IC8vVE9ETzogRmluZCBhIGJldHRlciB3YXkgdG8gcmVtb3ZlIHRoZSBMb2dvdXQgbGluaywgaW5zdGVhZCBvZiBwb3Bcblx0XHRcdFx0XHRcdCRzdGF0ZS5nbygnc2lnbnVwJyk7XG5cdFx0XHRcdFx0XHQkcm9vdFNjb3BlLiRicm9hZGNhc3QoJ0F1dGgnKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHQkc3RhdGUuZ28oJ2V4ZXJjaXNtLnZpZXcnKTtcblx0XHRcdFx0Ly9UT0RPOiBXZSBjYW4gc2V0IHRoZSB1c2VyIG5hbWUgaGVyZSBhcyB3ZWxsLiBVc2VkIGluIGNvbmp1bmN0aW9uIHdpdGggYSBtYWluIGN0cmxcblx0XHRcdH0pXG5cdFx0XHQuY2F0Y2goZnVuY3Rpb24oZXJyKXtcblx0XHRcdFx0JHNjb3BlLmVycm9yID0gJ0xvZ2luIEludmFsaWQnO1xuXHRcdFx0XHRjb25zb2xlLmVycm9yKEpTT04uc3RyaW5naWZ5KGVycikpXG5cdFx0XHRcdHZhciBhbGVydFBvcHVwID0gJGlvbmljUG9wdXAuYWxlcnQoe1xuXHRcdFx0XHRcdHRpdGxlOiAnTG9naW4gZmFpbGVkIScsXG5cdFx0XHRcdFx0dGVtcGxhdGU6ICdQbGVhc2UgY2hlY2sgeW91ciBjcmVkZW50aWFscyEnXG5cdFx0XHRcdH0pO1xuXHRcdFx0fSk7XG5cdH07XG59KTtcblxuXG4vL1RPRE86IENsZWFudXAgY29tbWVudGVkIGNvZGVcblxuIiwiYXBwLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlciwgVVNFUl9ST0xFUyl7XG5cbiAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2ZyaWVuZHMnLCB7XG4gICAgICBjYWNoZTogZmFsc2UsIC8vdG8gZW5zdXJlIHRoZSBjb250cm9sbGVyIGlzIGxvYWRpbmcgZWFjaCB0aW1lXG4gICAgICB1cmw6ICcvZnJpZW5kcycsXG4gICAgICB0ZW1wbGF0ZVVybDogJ2ZlYXR1cmVzL2ZyaWVuZHMvZnJpZW5kcy5odG1sJyxcbiAgICAgIGNvbnRyb2xsZXI6ICdGcmllbmRzQ3RybCcsXG4gICAgICByZXNvbHZlOiB7XG4gICAgICAgIGZyaWVuZHM6IGZ1bmN0aW9uKEZyaWVuZHNGYWN0b3J5KSB7XG4gICAgICAgICAgcmV0dXJuIEZyaWVuZHNGYWN0b3J5LmdldEZyaWVuZHMoKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ3Jlc3BvbnNlLmRhdGEgZnJpZW5kcycscmVzcG9uc2UuZGF0YS5mcmllbmRzKTtcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZS5kYXRhLmZyaWVuZHM7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KVxuICAgIC5zdGF0ZSgnc2hhcmVkLWdpc3RzJywge1xuICAgICAgY2FjaGU6IGZhbHNlLCAvL3RvIGVuc3VyZSB0aGUgY29udHJvbGxlciBpcyBsb2FkaW5nIGVhY2ggdGltZVxuICAgICAgdXJsOiAnL2NoYXRzLzppZCcsXG4gICAgICB0ZW1wbGF0ZVVybDogJ2ZlYXR1cmVzL2ZyaWVuZHMvc2hhcmVkLWdpc3RzLmh0bWwnLFxuICAgICAgY29udHJvbGxlcjogJ1NoYXJlZEdpc3RzQ3RybCdcbiAgICB9KVxuICAgIC5zdGF0ZSgndmlldy1jb2RlJywge1xuICAgICAgY2FjaGU6IGZhbHNlLCAvL3RvIGVuc3VyZSB0aGUgY29udHJvbGxlciBpcyBsb2FkaW5nIGVhY2ggdGltZVxuICAgICAgdXJsOiAnL2NoYXRzL2NvZGUvOmlkJyxcbiAgICAgIHRlbXBsYXRlVXJsOiAnZmVhdHVyZXMvZnJpZW5kcy92aWV3LWNvZGUuaHRtbCcsXG4gICAgICBjb250cm9sbGVyOiAnVmlld0NvZGVDdHJsJ1xuICAgIH0pXG59KTtcblxuYXBwLmNvbnRyb2xsZXIoJ0ZyaWVuZHNDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBGcmllbmRzRmFjdG9yeSxmcmllbmRzLCAkc3RhdGUsIEdpc3RGYWN0b3J5KSB7XG4gIC8vY29uc29sZS5sb2coJ2hlbGxvIHdvcmxkJyk7XG4gIC8vJHNjb3BlLmNoYXRzID0gQ2hhdHMuYWxsKCk7XG4gIC8vJHNjb3BlLnJlbW92ZSA9IGZ1bmN0aW9uKGNoYXQpIHtcbiAgLy8gIENoYXRzLnJlbW92ZShjaGF0KTtcbiAgLy99O1xuXG4gICRzY29wZS5kYXRhID0ge307XG4gICRzY29wZS5mcmllbmRzID0gZnJpZW5kcztcblxuICBjb25zb2xlLmxvZygnZnJpZW5kcycsZnJpZW5kcyk7XG4gIC8vVE9ETzogQWRkIGdldEZyaWVuZHMgcm91dGUgYXMgd2VsbCBhbmQgc2F2ZSB0byBsb2NhbFN0b3JhZ2VcbiAgLy9GcmllbmRzRmFjdG9yeS5nZXRGcmllbmRzKCkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG4gIC8vICBjb25zb2xlLmxvZygncmVzcG9uc2UuZGF0YSBmcmllbmRzJyxyZXNwb25zZS5kYXRhLmZyaWVuZHMpO1xuICAvLyAgJHNjb3BlLmZyaWVuZHMgPSByZXNwb25zZS5kYXRhLmZyaWVuZHM7XG4gIC8vfSk7XG5cbiAgJHNjb3BlLmFkZEZyaWVuZCA9IGZ1bmN0aW9uKCl7XG4gICAgY29uc29sZS5sb2coJ2FkZEZyaWVuZCBjbGlja2VkJyk7XG4gICAgRnJpZW5kc0ZhY3RvcnkuYWRkRnJpZW5kKCRzY29wZS5kYXRhLnVzZXJuYW1lKS50aGVuKGZyaWVuZEFkZGVkLCBmcmllbmROb3RBZGRlZCk7XG4gIH07XG5cbiAgZnJpZW5kQWRkZWQgPSBmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgY29uc29sZS5sb2coJ2ZyaWVuZEFkZGVkJyxyZXNwb25zZS5kYXRhLmZyaWVuZCk7XG4gICAgJHNjb3BlLmZyaWVuZHMucHVzaChyZXNwb25zZS5kYXRhLmZyaWVuZCk7XG4gIH07XG5cbiAgZnJpZW5kTm90QWRkZWQgPSBmdW5jdGlvbihlcnIpe1xuICAgIGNvbnNvbGUubG9nKGVycik7XG4gIH07XG5cbiAgR2lzdEZhY3RvcnkucXVldWVkR2lzdHMoKS50aGVuKGFkZFNoYXJlZEdpc3RzVG9TY29wZSk7XG5cbiAgZnVuY3Rpb24gYWRkU2hhcmVkR2lzdHNUb1Njb3BlKGdpc3RzKXtcbiAgICAvL2NvbnNvbGUubG9nKCdhZGRTaGFyZWRHaXN0c1RvU2NvcGUnLGdpc3RzLmRhdGEpO1xuICAgICRzY29wZS5naXN0cyA9IGdpc3RzLmRhdGE7XG4gICAgRnJpZW5kc0ZhY3Rvcnkuc2V0R2lzdHMoZ2lzdHMuZGF0YSk7XG4gIH1cblxuICAkc2NvcGUuc2hhcmVkQ29kZSA9IGZ1bmN0aW9uKGlkKXtcbiAgICAvL2NvbnNvbGUubG9nKGlkKTsgLy9pZCBvZiBmcmllbmQgZ2lzdCBzaGFyZWQgd2l0aFxuICAgICRzdGF0ZS5nbygnc2hhcmVkLWdpc3RzJyx7aWQ6aWR9LCB7aW5oZXJpdDpmYWxzZX0pO1xuICB9XG5cbn0pO1xuXG5hcHAuY29udHJvbGxlcignVmlld0NvZGVDdHJsJywgZnVuY3Rpb24oJHN0YXRlLCRzY29wZSwgJHN0YXRlUGFyYW1zLCBGcmllbmRzRmFjdG9yeSl7XG5cblxuICAvL1RPRE86XG4gIC8vdmFyIGFsbEdpc3RzID0gRnJpZW5kc0ZhY3RvcnkuZ2V0R2lzdHMoKTtcbiAgJHNjb3BlLmNvZGUgPSBGcmllbmRzRmFjdG9yeS51c2VyR2lzdHNbJHN0YXRlUGFyYW1zLmlkXTtcblxuICAkc2NvcGUuZ29CYWNrID0gZnVuY3Rpb24obil7XG4gICAgaWYobj09PTEpe1xuICAgICAgJHN0YXRlLmdvKCdzaGFyZWQtZ2lzdHMnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgJHN0YXRlLmdvKCdmcmllbmRzJyk7XG4gICAgfVxuICB9XG5cbn0pO1xuXG5hcHAuY29udHJvbGxlcignU2hhcmVkR2lzdHNDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCAkc3RhdGVQYXJhbXMsIEZyaWVuZHNGYWN0b3J5LCRpb25pY01vZGFsLCRzdGF0ZSkge1xuICAvL2NvbnNvbGUubG9nKCdzdGF0ZVBhcmFtcycsJHN0YXRlUGFyYW1zLmlkLCdnaXN0cycsRnJpZW5kc0ZhY3RvcnkuZ2V0R2lzdHMoKSk7XG4gIC8vVE9ETzogVGhlc2UgYXJlIGFsbCBnaXN0cywgeW91IG5lZWQgdG8gZmlsdGVyIGJhc2VkIG9uIHRoZSB1c2VyIGJlZm9yZSBwbGFjZSBvbiBzY29wZS5cbiAgJHNjb3BlLmdpc3RzID0gW107XG5cbiAgLy8kc2NvcGUuY29kZSA9ICcnO1xuXG4gIHZhciBhbGxHaXN0cyA9IEZyaWVuZHNGYWN0b3J5LmdldEdpc3RzKCkgfHwgW107XG5cbiAgJHNjb3BlLmdvQmFjayA9IGZ1bmN0aW9uKCl7XG4gICAgJHN0YXRlLmdvKCdmcmllbmRzJyk7XG4gIH1cblxuICAkc2NvcGUuc2hvd0NvZGUgPSBmdW5jdGlvbihnaXN0SW5kZXgpe1xuICAgIGNvbnNvbGUubG9nKGdpc3RJbmRleCk7XG4gICAgJHN0YXRlLmdvKCd2aWV3LWNvZGUnLHtpZDpnaXN0SW5kZXh9LCB7aW5oZXJpdDpmYWxzZX0pO1xuICAgIC8vJHN0YXRlLmdvKCd2aWV3LWNvZGUnKTsgLy9UT0RPOiB3aGljaCBvbmUgd2FzIGNsaWNrZWQsIHNlbmQgcGFyYW0gaWQsIGluZGV4IG9mIGdpc3RcbiAgICAvL2NvbnNvbGUubG9nKCdzaG93Q29kZScsY29kZSk7XG4gICAgLy8kc2NvcGUuY29kZSA9IGNvZGU7XG4gICAgLy8kc2NvcGUub3Blbk1vZGFsKGNvZGUpO1xuICB9O1xuXG4gIC8vVE9ETzogT25seSBzaG93IGFsbCBHaXN0cyBmcm9tIHNwZWNpZmljIHVzZXIgY2xpY2tlZCBvblxuICAvL1RPRE86IE5lZWQgdG8gYXBwbHkgSlNPTiBwYXJzZVxuXG4gIGFsbEdpc3RzLmZvckVhY2goZnVuY3Rpb24oZ2lzdCl7XG4gICAgaWYoZ2lzdC51c2VyID09PSAkc3RhdGVQYXJhbXMuaWQpe1xuICAgICAgRnJpZW5kc0ZhY3RvcnkudXNlckdpc3RzLnB1c2goZ2lzdC5naXN0LmZpbGVzLmZpbGVOYW1lLmNvbnRlbnQpO1xuICAgIH1cbiAgfSk7XG4gICRzY29wZS5naXN0cyA9IEZyaWVuZHNGYWN0b3J5LnVzZXJHaXN0cztcbiAgLy8kaW9uaWNNb2RhbC5mcm9tVGVtcGxhdGVVcmwoJ2ZlYXR1cmVzL2ZyaWVuZHMvY29kZS1tb2RhbC5odG1sJywge1xuICAvLyAgc2NvcGU6ICRzY29wZSxcbiAgLy8gIGNhY2hlOiBmYWxzZSxcbiAgLy8gIGFuaW1hdGlvbjogJ3NsaWRlLWluLXVwJ1xuICAvL30pLnRoZW4oZnVuY3Rpb24obW9kYWwpIHtcbiAgLy8gICRzY29wZS5tb2RhbCA9IG1vZGFsO1xuICAvL30pO1xuICAvLyRzY29wZS5vcGVuTW9kYWwgPSBmdW5jdGlvbihjb2RlKSB7XG4gIC8vICAvL2NvbnNvbGUubG9nKGNvZGUpO1xuICAvLyAgJHNjb3BlLm1vZGFsLnNob3coKTtcbiAgLy99O1xuICAvLyRzY29wZS5jbG9zZU1vZGFsID0gZnVuY3Rpb24oKSB7XG4gIC8vICAkc2NvcGUubW9kYWwuaGlkZSgpO1xuICAvL307XG4gIC8vLy9DbGVhbnVwIHRoZSBtb2RhbCB3aGVuIHdlJ3JlIGRvbmUgd2l0aCBpdCFcbiAgLy8kc2NvcGUuJG9uKCckZGVzdHJveScsIGZ1bmN0aW9uKCkge1xuICAvLyAgJHNjb3BlLm1vZGFsLnJlbW92ZSgpO1xuICAvL30pO1xuICAvLy8vIEV4ZWN1dGUgYWN0aW9uIG9uIGhpZGUgbW9kYWxcbiAgLy8kc2NvcGUuJG9uKCdtb2RhbC5oaWRkZW4nLCBmdW5jdGlvbigpIHtcbiAgLy8gIC8vIEV4ZWN1dGUgYWN0aW9uXG4gIC8vfSk7XG4gIC8vLy8gRXhlY3V0ZSBhY3Rpb24gb24gcmVtb3ZlIG1vZGFsXG4gIC8vJHNjb3BlLiRvbignbW9kYWwucmVtb3ZlZCcsIGZ1bmN0aW9uKCkge1xuICAvLyAgLy8gRXhlY3V0ZSBhY3Rpb25cbiAgLy99KTtcbiAgLy8vLyRzY29wZS5naXN0cyA9IEZyaWVuZHNGYWN0b3J5LmdldEdpc3RzKCk7XG5cbn0pO1xuXG4vL2FwcC5mYWN0b3J5KCdDaGF0cycsIGZ1bmN0aW9uKCkge1xuLy8gIC8vIE1pZ2h0IHVzZSBhIHJlc291cmNlIGhlcmUgdGhhdCByZXR1cm5zIGEgSlNPTiBhcnJheVxuLy9cbi8vICAvLyBTb21lIGZha2UgdGVzdGluZyBkYXRhXG4vLyAgdmFyIGNoYXRzID0gW3tcbi8vICAgIGlkOiAwLFxuLy8gICAgbmFtZTogJ0JlbiBTcGFycm93Jyxcbi8vICAgIGxhc3RUZXh0OiAnWW91IG9uIHlvdXIgd2F5PycsXG4vLyAgICBmYWNlOiAnaHR0cHM6Ly9wYnMudHdpbWcuY29tL3Byb2ZpbGVfaW1hZ2VzLzUxNDU0OTgxMTc2NTIxMTEzNi85U2dBdUhlWS5wbmcnXG4vLyAgfSwge1xuLy8gICAgaWQ6IDEsXG4vLyAgICBuYW1lOiAnTWF4IEx5bngnLFxuLy8gICAgbGFzdFRleHQ6ICdIZXksIGl0XFwncyBub3QgbWUnLFxuLy8gICAgZmFjZTogJ2h0dHBzOi8vYXZhdGFyczMuZ2l0aHVidXNlcmNvbnRlbnQuY29tL3UvMTEyMTQ/dj0zJnM9NDYwJ1xuLy8gIH0se1xuLy8gICAgaWQ6IDIsXG4vLyAgICBuYW1lOiAnQWRhbSBCcmFkbGV5c29uJyxcbi8vICAgIGxhc3RUZXh0OiAnSSBzaG91bGQgYnV5IGEgYm9hdCcsXG4vLyAgICBmYWNlOiAnaHR0cHM6Ly9wYnMudHdpbWcuY29tL3Byb2ZpbGVfaW1hZ2VzLzQ3OTA5MDc5NDA1ODM3OTI2NC84NFRLal9xYS5qcGVnJ1xuLy8gIH0sIHtcbi8vICAgIGlkOiAzLFxuLy8gICAgbmFtZTogJ1BlcnJ5IEdvdmVybm9yJyxcbi8vICAgIGxhc3RUZXh0OiAnTG9vayBhdCBteSBtdWtsdWtzIScsXG4vLyAgICBmYWNlOiAnaHR0cHM6Ly9wYnMudHdpbWcuY29tL3Byb2ZpbGVfaW1hZ2VzLzQ5MTk5NTM5ODEzNTc2NzA0MC9pZTJaX1Y2ZS5qcGVnJ1xuLy8gIH0sIHtcbi8vICAgIGlkOiA0LFxuLy8gICAgbmFtZTogJ01pa2UgSGFycmluZ3RvbicsXG4vLyAgICBsYXN0VGV4dDogJ1RoaXMgaXMgd2lja2VkIGdvb2QgaWNlIGNyZWFtLicsXG4vLyAgICBmYWNlOiAnaHR0cHM6Ly9wYnMudHdpbWcuY29tL3Byb2ZpbGVfaW1hZ2VzLzU3ODIzNzI4MTM4NDg0MTIxNi9SM2FlMW42MS5wbmcnXG4vLyAgfV07XG4vL1xuLy8gIHJldHVybiB7XG4vLyAgICBhbGw6IGZ1bmN0aW9uKCkge1xuLy8gICAgICByZXR1cm4gY2hhdHM7XG4vLyAgICB9LFxuLy8gICAgcmVtb3ZlOiBmdW5jdGlvbihjaGF0KSB7XG4vLyAgICAgIGNoYXRzLnNwbGljZShjaGF0cy5pbmRleE9mKGNoYXQpLCAxKTtcbi8vICAgIH0sXG4vLyAgICBnZXQ6IGZ1bmN0aW9uKGNoYXRJZCkge1xuLy8gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoYXRzLmxlbmd0aDsgaSsrKSB7XG4vLyAgICAgICAgaWYgKGNoYXRzW2ldLmlkID09PSBwYXJzZUludChjaGF0SWQpKSB7XG4vLyAgICAgICAgICByZXR1cm4gY2hhdHNbaV07XG4vLyAgICAgICAgfVxuLy8gICAgICB9XG4vLyAgICAgIHJldHVybiBudWxsO1xuLy8gICAgfVxuLy8gIH07XG4vL30pO1xuXG5hcHAuZmFjdG9yeSgnRnJpZW5kc0ZhY3RvcnknLGZ1bmN0aW9uKCRodHRwLCRxLEFwaUVuZHBvaW50KXtcbiAgLy9nZXQgdXNlciB0byBhZGQgYW5kIHJlc3BvbmQgdG8gdXNlclxuICB2YXIgdXNlckdpc3RzID0gW107XG4gIHZhciBhbGxHaXN0cyA9IFtdO1xuICB2YXIgYWRkRnJpZW5kID0gZnVuY3Rpb24oZnJpZW5kKXtcbiAgICAvL2NvbnNvbGUubG9nKGZyaWVuZCk7XG4gICAgcmV0dXJuICRodHRwLnBvc3QoQXBpRW5kcG9pbnQudXJsK1wiL3VzZXIvYWRkRnJpZW5kXCIse2ZyaWVuZDpmcmllbmR9KTtcbiAgfTtcblxuICB2YXIgZ2V0RnJpZW5kcyA9IGZ1bmN0aW9uKCl7XG4gICAgLy9jb25zb2xlLmxvZygnZ2V0RnJpZW5kcyBjYWxsZWQnKVxuICAgIHJldHVybiAkaHR0cC5nZXQoQXBpRW5kcG9pbnQudXJsICsgXCIvdXNlci9nZXRGcmllbmRzXCIpO1xuICB9O1xuXG5cbiAgLy9UT0RPOiBSZW1vdmUgR2lzdHMgZnJvbSBGcmllbmRzRmFjdG9yeSAtIHNob3VsZCBiZSBpbiBnaXN0IGZhY3RvcnkgYW5kIGxvYWRlZCBvbiBzdGFydFxuICAvL1RPRE86IFlvdSBuZWVkIHRvIHJlZmFjdG9yIGJlY2F1c2UgeW91IG1heSBlbmQgdXAgb24gYW55IHBhZ2Ugd2l0aG91dCBhbnkgZGF0YSBiZWNhdXNlIGl0IHdhcyBub3QgYXZhaWxhYmxlIGluIHRoZSBwcmV2aW91cyBwYWdlICh0aGUgcHJldmlvdXMgcGFnZSB3YXMgbm90IGxvYWRlZClcbiAgdmFyIHNldEdpc3RzID0gZnVuY3Rpb24oZ2lzdHMpe1xuICAgIC8vY29uc29sZS5sb2coJ3NldEdpc3RzJyk7XG4gICAgYWxsR2lzdHMgPSBnaXN0cztcbiAgfTtcblxuICB2YXIgZ2V0R2lzdHMgPSBmdW5jdGlvbigpe1xuICAgIGNvbnNvbGUubG9nKCdhbGxHaXN0cycsYWxsR2lzdHMpO1xuICAgIHJldHVybiBhbGxHaXN0cy5naXN0cztcbiAgfTtcblxuICByZXR1cm4ge1xuICAgIGFkZEZyaWVuZDogYWRkRnJpZW5kLFxuICAgIGdldEZyaWVuZHM6IGdldEZyaWVuZHMsXG4gICAgZ2V0R2lzdHM6IGdldEdpc3RzLFxuICAgIHNldEdpc3RzOiBzZXRHaXN0cyxcbiAgICB1c2VyR2lzdHM6IHVzZXJHaXN0c1xuICB9O1xuXG4gIC8vVE9ETzogVXNlciBpcyBub3QgbG9nZ2VkIGluLCBzbyB5b3UgY2Fubm90IGFkZCBhIGZyaWVuZFxufSk7XG4iLCJhcHAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKXtcblx0JHN0YXRlUHJvdmlkZXIuc3RhdGUoJ3NhbmRib3gnLCB7XG5cdFx0dGVtcGxhdGVVcmwgOiAnZmVhdHVyZXMvc2FuZGJveC9zYW5kYm94Lmh0bWwnLFxuXHRcdGFic3RyYWN0IDogdHJ1ZVxuXHR9KTtcbn0pO1xuXG5hcHAuZmFjdG9yeSgnU2FuZGJveEZhY3RvcnknLCBmdW5jdGlvbigkaHR0cCwgQXBpRW5kcG9pbnQsICRyb290U2NvcGUsICRzdGF0ZSl7XG5cblx0dmFyIHByb2JsZW0gPSAnJztcblx0dmFyIHN1Ym1pc3Npb24gPSAnJztcblxuXHR2YXIgcnVuSGlkZGVuID0gZnVuY3Rpb24oY29kZSkge1xuXHQgICAgdmFyIGluZGV4ZWREQiA9IG51bGw7XG5cdCAgICB2YXIgbG9jYXRpb24gPSBudWxsO1xuXHQgICAgdmFyIG5hdmlnYXRvciA9IG51bGw7XG5cdCAgICB2YXIgb25lcnJvciA9IG51bGw7XG5cdCAgICB2YXIgb25tZXNzYWdlID0gbnVsbDtcblx0ICAgIHZhciBwZXJmb3JtYW5jZSA9IG51bGw7XG5cdCAgICB2YXIgc2VsZiA9IG51bGw7XG5cdCAgICB2YXIgd2Via2l0SW5kZXhlZERCID0gbnVsbDtcblx0ICAgIHZhciBwb3N0TWVzc2FnZSA9IG51bGw7XG5cdCAgICB2YXIgY2xvc2UgPSBudWxsO1xuXHQgICAgdmFyIG9wZW5EYXRhYmFzZSA9IG51bGw7XG5cdCAgICB2YXIgb3BlbkRhdGFiYXNlU3luYyA9IG51bGw7XG5cdCAgICB2YXIgd2Via2l0UmVxdWVzdEZpbGVTeXN0ZW0gPSBudWxsO1xuXHQgICAgdmFyIHdlYmtpdFJlcXVlc3RGaWxlU3lzdGVtU3luYyA9IG51bGw7XG5cdCAgICB2YXIgd2Via2l0UmVzb2x2ZUxvY2FsRmlsZVN5c3RlbVN5bmNVUkwgPSBudWxsO1xuXHQgICAgdmFyIHdlYmtpdFJlc29sdmVMb2NhbEZpbGVTeXN0ZW1VUkwgPSBudWxsO1xuXHQgICAgdmFyIGFkZEV2ZW50TGlzdGVuZXIgPSBudWxsO1xuXHQgICAgdmFyIGRpc3BhdGNoRXZlbnQgPSBudWxsO1xuXHQgICAgdmFyIHJlbW92ZUV2ZW50TGlzdGVuZXIgPSBudWxsO1xuXHQgICAgdmFyIGR1bXAgPSBudWxsO1xuXHQgICAgdmFyIG9ub2ZmbGluZSA9IG51bGw7XG5cdCAgICB2YXIgb25vbmxpbmUgPSBudWxsO1xuXHQgICAgdmFyIGltcG9ydFNjcmlwdHMgPSBudWxsO1xuXHQgICAgdmFyIGNvbnNvbGUgPSBudWxsO1xuXHQgICAgdmFyIGFwcGxpY2F0aW9uID0gbnVsbDtcblxuXHQgICAgcmV0dXJuIGV2YWwoY29kZSk7XG5cdH07XG5cblx0Ly8gY29udmVydHMgdGhlIG91dHB1dCBpbnRvIGEgc3RyaW5nXG5cdHZhciBzdHJpbmdpZnkgPSBmdW5jdGlvbihvdXRwdXQpIHtcblx0ICAgIHZhciByZXN1bHQ7XG5cblx0ICAgIGlmICh0eXBlb2Ygb3V0cHV0ID09ICd1bmRlZmluZWQnKSB7XG5cdCAgICAgICAgcmVzdWx0ID0gJ3VuZGVmaW5lZCc7XG5cdCAgICB9IGVsc2UgaWYgKG91dHB1dCA9PT0gbnVsbCkge1xuXHQgICAgICAgIHJlc3VsdCA9ICdudWxsJztcblx0ICAgIH0gZWxzZSB7XG5cdCAgICAgICAgcmVzdWx0ID0gSlNPTi5zdHJpbmdpZnkob3V0cHV0KSB8fCBvdXRwdXQudG9TdHJpbmcoKTtcblx0ICAgIH1cblxuXHQgICAgcmV0dXJuIHJlc3VsdDtcblx0fTtcblxuXHR2YXIgcnVuID0gZnVuY3Rpb24oY29kZSkge1xuXHQgICAgdmFyIHJlc3VsdCA9IHtcblx0ICAgICAgICBpbnB1dDogY29kZSxcblx0ICAgICAgICBvdXRwdXQ6IG51bGwsXG5cdCAgICAgICAgZXJyb3I6IG51bGxcblx0ICAgIH07XG5cblx0ICAgIHRyeSB7XG5cdCAgICAgICAgcmVzdWx0Lm91dHB1dCA9IHN0cmluZ2lmeShydW5IaWRkZW4oY29kZSkpO1xuXHQgICAgfSBjYXRjaChlKSB7XG5cdCAgICAgICAgcmVzdWx0LmVycm9yID0gZS5tZXNzYWdlO1xuXHQgICAgfVxuXHQgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9O1xuXG5cblx0cmV0dXJuIHtcblx0XHRnZXRDaGFsbGVuZ2UgOiBmdW5jdGlvbihpZCl7XG5cdFx0XHRyZXR1cm4gJGh0dHAuZ2V0KEFwaUVuZHBvaW50LnVybCArICcvY2hhbGxlbmdlLycgKyBpZCkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG5cdFx0XHRcdHByb2JsZW0gPSByZXNwb25zZS5kYXRhO1xuXHRcdFx0XHRzdWJtaXNzaW9uID0gcHJvYmxlbS5zZXNzaW9uLnNldHVwIHx8ICcnO1xuXHRcdFx0XHQkcm9vdFNjb3BlLiRicm9hZGNhc3QoJ3Byb2JsZW1VcGRhdGVkJyk7XG5cdFx0XHRcdHJldHVybiByZXNwb25zZS5kYXRhO1xuXHRcdFx0fSk7XG5cdFx0fSxcblx0XHRzZXRTdWJtaXNzaW9uIDogZnVuY3Rpb24oY29kZSl7XG5cdFx0XHRzdWJtaXNzaW9uID0gY29kZTtcblx0XHRcdCRyb290U2NvcGUuJGJyb2FkY2FzdCgnc3VibWlzc2lvblVwZGF0ZWQnKTtcblx0XHR9LFxuXHRcdGNvbXBpbGVTdWJtaXNzaW9uOiBmdW5jdGlvbihjb2RlKXtcblx0XHRcdHJldHVybiBydW4oY29kZSk7XG5cdFx0fSxcblx0XHRnZXRTdWJtaXNzaW9uIDogZnVuY3Rpb24oKXtcblx0XHRcdHJldHVybiBzdWJtaXNzaW9uO1xuXHRcdH0sXG5cdFx0Z2V0UHJvYmxlbSA6IGZ1bmN0aW9uKCl7XG5cdFx0XHRyZXR1cm4gcHJvYmxlbTtcblx0XHR9XG5cdH07XG59KTsiLCJhcHAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKXtcblx0JHN0YXRlUHJvdmlkZXIuc3RhdGUoJ3NhbmRib3guY29kZScsIHtcblx0XHR1cmwgOiAnL3NhbmRib3gvY29kZScsXG5cdFx0dmlld3M6IHtcblx0XHRcdCd0YWItY29kZScgOiB7XG5cdFx0XHRcdHRlbXBsYXRlVXJsIDogJ2ZlYXR1cmVzL3NhbmRib3gtY29kZS9zYW5kYm94LWNvZGUuaHRtbCcsXG5cdFx0XHRcdGNvbnRyb2xsZXIgOiAnU2FuZGJveENvZGVDdHJsJ1xuXHRcdFx0fVxuXHRcdH1cblx0fSk7XG59KTtcblxuXG5hcHAuY29udHJvbGxlcignU2FuZGJveENvZGVDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCAkc3RhdGUsIFNhbmRib3hGYWN0b3J5LCBFeGVyY2lzbUZhY3RvcnksIEtleWJvYXJkRmFjdG9yeSl7XG5cdCRzY29wZS5jb2RlID0ge1xuXHRcdHRleHQgOiAnJ1xuXHR9O1xuXG5cdCRzY29wZS5idXR0b25zID0ge1xuXHRcdGNvbXBpbGUgOiAnQ29tcGlsZScsXG5cdFx0c2F2ZSA6ICdTYXZlJ1xuXHR9O1xuXG5cdCRzY29wZS5jb21waWxlID0gZnVuY3Rpb24oY29kZSl7XG5cdFx0U2FuZGJveEZhY3Rvcnkuc2V0U3VibWlzc2lvbihjb2RlKTtcblx0XHQkc3RhdGUuZ28oJ3NhbmRib3guY29tcGlsZScpO1xuXHR9O1xuXG5cdCRzY29wZS5zYXZlID0gZnVuY3Rpb24oY29kZSl7XG5cblx0fTtcblxuXHQkc2NvcGUuaW5zZXJ0RnVuYyA9IEtleWJvYXJkRmFjdG9yeS5tYWtlSW5zZXJ0RnVuYygkc2NvcGUpO1xuXG5cdC8vICRzY29wZS5zYXZlQ2hhbGxlbmdlID0gZnVuY3Rpb24oKXtcblx0Ly8gXHRjb25zb2xlLmxvZyhcInNhdmUgc2NvcGUudGV4dFwiLCAkc2NvcGUudGV4dCk7XG5cdC8vIFx0JGxvY2Fsc3RvcmFnZS5zZXQoXCJ0ZXN0aW5nXCIsICRzY29wZS50ZXh0KTtcblx0Ly8gfTtcblxuXHQvLyAkc2NvcGUuZ2V0U2F2ZWQgPSBmdW5jdGlvbigpe1xuXHQvLyBcdGNvbnNvbGUubG9nKFwic2F2ZSBzY29wZS50ZXh0XCIsICRzY29wZS50ZXh0KTtcblx0Ly8gXHRjb25zb2xlLmxvZyhcImVudGVyZWQgZ2V0c2F2ZWQgZnVuY1wiKTtcblx0Ly8gXHQkc2NvcGUudGV4dCA9ICRsb2NhbHN0b3JhZ2UuZ2V0KFwidGVzdGluZ1wiKTtcblx0Ly8gfTtcblxufSk7IiwiYXBwLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlcil7XG5cdCRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdzYW5kYm94LmNvbXBpbGUnLCB7XG5cdFx0dXJsIDogJy9zYW5kYm94L2NvbXBpbGUnLFxuXHRcdHZpZXdzIDoge1xuXHRcdFx0J3RhYi1jb21waWxlJyA6IHtcblx0XHRcdFx0dGVtcGxhdGVVcmwgOiAnZmVhdHVyZXMvc2FuZGJveC1jb21waWxlL3NhbmRib3gtY29tcGlsZS5odG1sJyxcblx0XHRcdFx0Y29udHJvbGxlcjogJ1NhbmRib3hDb21waWxlQ3RybCdcblx0XHRcdH1cblx0XHR9XG5cdH0pO1xufSk7XG5cbmFwcC5jb250cm9sbGVyKCdTYW5kYm94Q29tcGlsZUN0cmwnLCBmdW5jdGlvbigkc2NvcGUsIFNhbmRib3hGYWN0b3J5KXtcblx0JHNjb3BlLnF1ZXN0aW9uID0gU2FuZGJveEZhY3RvcnkuZ2V0U3VibWlzc2lvbigpO1xuXHR2YXIgcmVzdWx0cyA9IFNhbmRib3hGYWN0b3J5LmNvbXBpbGVTdWJtaXNzaW9uKCRzY29wZS5xdWVzdGlvbik7XG5cdCRzY29wZS5yZXN1bHRzID0gcmVzdWx0cztcblx0JHNjb3BlLm91dHB1dCA9IFNhbmRib3hGYWN0b3J5LmNvbXBpbGVTdWJtaXNzaW9uKCRzY29wZS5xdWVzdGlvbikub3V0cHV0O1xuXHQkc2NvcGUuZXJyb3IgPSBTYW5kYm94RmFjdG9yeS5jb21waWxlU3VibWlzc2lvbigkc2NvcGUucXVlc3Rpb24pLmVycm9yO1xuXG5cdCRzY29wZS4kb24oJ3N1Ym1pc3Npb25VcGRhdGVkJywgZnVuY3Rpb24oZSl7XG5cdFx0JHNjb3BlLnF1ZXN0aW9uID0gU2FuZGJveEZhY3RvcnkuZ2V0U3VibWlzc2lvbigpO1xuXHRcdHJlc3VsdHMgPSBTYW5kYm94RmFjdG9yeS5jb21waWxlU3VibWlzc2lvbigkc2NvcGUucXVlc3Rpb24pO1xuXHRcdCRzY29wZS5yZXN1bHRzID0gcmVzdWx0cztcblx0XHQkc2NvcGUub3V0cHV0ID0gU2FuZGJveEZhY3RvcnkuY29tcGlsZVN1Ym1pc3Npb24oJHNjb3BlLnF1ZXN0aW9uKS5vdXRwdXQ7XG5cdFx0JHNjb3BlLmVycm9yID0gU2FuZGJveEZhY3RvcnkuY29tcGlsZVN1Ym1pc3Npb24oJHNjb3BlLnF1ZXN0aW9uKS5lcnJvcjtcblx0fSk7XG59KTsiLCJhcHAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKXtcbiAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgnc2lnbnVwJyx7XG4gICAgICAgIHVybDpcIi9zaWdudXBcIixcbiAgICAgICAgdGVtcGxhdGVVcmw6IFwiZmVhdHVyZXMvc2lnbnVwL3NpZ251cC5odG1sXCIsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdTaWduVXBDdHJsJ1xuICAgIH0pO1xufSk7XG5cbmFwcC5jb250cm9sbGVyKCdTaWduVXBDdHJsJyxmdW5jdGlvbigkcm9vdFNjb3BlLCAkaHR0cCwgJHNjb3BlLCAkc3RhdGUsIEF1dGhTZXJ2aWNlLCAkaW9uaWNQb3B1cCl7XG4gICAgJHNjb3BlLmRhdGEgPSB7fTtcbiAgICAkc2NvcGUuZXJyb3IgPSBudWxsO1xuXG4gICAgJHNjb3BlLmxvZ2luID0gZnVuY3Rpb24oKXtcbiAgICAgICAgJHN0YXRlLmdvKCdsb2dpbicpO1xuICAgIH07XG5cbiAgICAkc2NvcGUuc2lnbnVwID0gZnVuY3Rpb24oKXtcbiAgICAgICAgQXV0aFNlcnZpY2VcbiAgICAgICAgICAgIC5zaWdudXAoJHNjb3BlLmRhdGEpXG4gICAgICAgICAgICAudGhlbihmdW5jdGlvbihhdXRoZW50aWNhdGVkKXtcbiAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdzaWdudXAsIHRhYi5jaGFsbGVuZ2UnKTtcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoJ0F1dGgnKTtcbiAgICAgICAgICAgICAgICAkc2NvcGUuc3RhdGVzLnB1c2goeyAvL1RPRE86IE5lZWQgdG8gYWRkIGEgcGFyZW50IGNvbnRyb2xsZXIgdG8gY29tbXVuaWNhdGVcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogJ0xvZ291dCcsXG4gICAgICAgICAgICAgICAgICAgIHJlZjogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIEF1dGhTZXJ2aWNlLmxvZ291dCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmRhdGEgPSB7fTtcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5zdGF0ZXMucG9wKCk7IC8vVE9ETzogRmluZCBhIGJldHRlciB3YXkgdG8gcmVtb3ZlIHRoZSBMb2dvdXQgbGluaywgaW5zdGVhZCBvZiBwb3BcbiAgICAgICAgICAgICAgICAgICAgICAgICRzdGF0ZS5nbygnc2lnbnVwJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoJ0F1dGgnKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICRzdGF0ZS5nbygnZXhlcmNpc20udmlldycpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5jYXRjaChmdW5jdGlvbihlcnIpe1xuICAgICAgICAgICAgICAgICRzY29wZS5lcnJvciA9ICdTaWdudXAgSW52YWxpZCc7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihKU09OLnN0cmluZ2lmeShlcnIpKVxuICAgICAgICAgICAgICAgIHZhciBhbGVydFBvcHVwID0gJGlvbmljUG9wdXAuYWxlcnQoe1xuICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ1NpZ251cCBmYWlsZWQhJyxcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGU6ICdQbGVhc2UgY2hlY2sgeW91ciBjcmVkZW50aWFscyEnXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICB9O1xuXG59KTtcblxuLy9UT0RPOiBGb3JtIFZhbGlkYXRpb25cbi8vVE9ETzogQ2xlYW51cCBjb21tZW50ZWQgY29kZSIsImFwcC5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIpe1xuXHQkc3RhdGVQcm92aWRlci5zdGF0ZSgnc25pcHBldCcsIHtcblx0XHRjYWNoZTogZmFsc2UsXG5cdFx0dXJsIDogJy9zbmlwcGV0LzppZCcsXG5cdFx0dGVtcGxhdGVVcmwgOiAnZmVhdHVyZXMvc25pcHBldC1lZGl0L3NuaXBwZXQtZWRpdC5odG1sJyxcblx0XHRjb250cm9sbGVyOiAnU25pcHBldEVkaXRDdHJsJ1xuXHR9KTtcbn0pO1xuXG5hcHAuY29udHJvbGxlcignU25pcHBldEVkaXRDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCAkc3RhdGUsICRzdGF0ZVBhcmFtcywgQ29kZVNuaXBwZXRGYWN0b3J5LCBLZXlib2FyZEZhY3Rvcnkpe1xuXHQkc2NvcGUuYnV0dG9ucyA9IHtcblx0XHRlZGl0IDogJ0VkaXQnLFxuXHRcdGNhbmNlbCA6ICdDYW5jZWwnLFxuXHRcdGRlbGV0ZSA6ICdEZWxldGUnXG5cdH07XG5cdCRzY29wZS5zbmlwcGV0ID0gQ29kZVNuaXBwZXRGYWN0b3J5LmdldFNuaXBwZXQoJHN0YXRlUGFyYW1zLmlkKTtcblxuXHQkc2NvcGUuaW5zZXJ0RnVuYyA9IEtleWJvYXJkRmFjdG9yeS5tYWtlSW5zZXJ0RnVuYygkc2NvcGUpO1xuXG5cdCRzY29wZS5lZGl0ID0gZnVuY3Rpb24oc25pcHBldCl7XG5cdFx0Q29kZVNuaXBwZXRGYWN0b3J5LmVkaXRTbmlwcGV0KCRzdGF0ZVBhcmFtcy5pZCwgc25pcHBldCk7XG5cdFx0JHN0YXRlLmdvKCdzbmlwcGV0cycpO1xuXHR9O1xuXG5cdCRzY29wZS5kZWxldGUgPSBmdW5jdGlvbigpe1xuXHRcdENvZGVTbmlwcGV0RmFjdG9yeS5kZWxldGVTbmlwcGV0KCRzdGF0ZVBhcmFtcy5pZCk7XG5cdFx0JHN0YXRlLmdvKCdzbmlwcGV0cycpO1xuXHR9O1xuXG5cdCRzY29wZS5jYW5jZWwgPSBmdW5jdGlvbigpe1xuXHRcdCRzdGF0ZS5nbygnc25pcHBldHMnKTtcblx0fTtcbn0pOyIsImFwcC5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIpe1xuXHQkc3RhdGVQcm92aWRlci5zdGF0ZSgnc25pcHBldHMnLCB7XG5cdFx0dXJsIDogJy9zbmlwcGV0cycsXG5cdFx0dGVtcGxhdGVVcmwgOiAnZmVhdHVyZXMvc25pcHBldHMvc25pcHBldHMuaHRtbCcsXG5cdFx0Y29udHJvbGxlciA6ICdTbmlwcGV0c0N0cmwnXG5cdH0pO1xufSk7XG5cbmFwcC5jb250cm9sbGVyKCdTbmlwcGV0c0N0cmwnLCBmdW5jdGlvbigkc2NvcGUsICRyb290U2NvcGUsICRzdGF0ZSwgQ29kZVNuaXBwZXRGYWN0b3J5KXtcblx0JHNjb3BlLnNuaXBwZXRzID0gQ29kZVNuaXBwZXRGYWN0b3J5LmdldEFsbFNuaXBwZXRzKCk7XG5cdCRzY29wZS5yZW1vdmUgPSBDb2RlU25pcHBldEZhY3RvcnkuZGVsZXRlU25pcHBldDtcblxuXHQkcm9vdFNjb3BlLiRvbignZm9vdGVyVXBkYXRlZCcsIGZ1bmN0aW9uKGV2ZW50KXtcblx0XHQkc2NvcGUuc25pcHBldHMgPSBDb2RlU25pcHBldEZhY3RvcnkuZ2V0QWxsU25pcHBldHMoKTtcblx0fSk7XG5cblx0JHNjb3BlLmNyZWF0ZSA9IGZ1bmN0aW9uKCl7XG5cdFx0JHN0YXRlLmdvKCdzbmlwcGV0cy1jcmVhdGUnKTtcblx0fTtcbn0pOyIsImFwcC5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIpe1xuXHQkc3RhdGVQcm92aWRlci5zdGF0ZSgnc25pcHBldHMtY3JlYXRlJywge1xuXHRcdHVybDogJy9zbmlwcGV0cy9jcmVhdGUnLFxuXHRcdHRlbXBsYXRlVXJsIDogJ2ZlYXR1cmVzL3NuaXBwZXRzLWNyZWF0ZS9zbmlwcGV0cy1jcmVhdGUuaHRtbCcsXG5cdFx0Y29udHJvbGxlcjogJ1NuaXBwZXRzQ3JlYXRlQ3RybCdcblx0fSk7XG59KTtcblxuYXBwLmNvbnRyb2xsZXIoJ1NuaXBwZXRzQ3JlYXRlQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgJHN0YXRlLCBLZXlib2FyZEZhY3RvcnksIENvZGVTbmlwcGV0RmFjdG9yeSl7XG5cdCRzY29wZS5zbmlwcGV0ID0ge1xuXHRcdGRpc3BsYXkgOiAnJyxcblx0XHRpbnNlcnRQYXJhbSA6ICcnXG5cdH07XG5cblx0JHNjb3BlLmluc2VydEZ1bmMgPSBLZXlib2FyZEZhY3RvcnkubWFrZUluc2VydEZ1bmMoJHNjb3BlKTtcblxuXHQkc2NvcGUuY3JlYXRlID0gZnVuY3Rpb24oc25pcHBldCl7XG5cdFx0Q29kZVNuaXBwZXRGYWN0b3J5LmFkZFNuaXBwZXQoc25pcHBldCk7XG5cdFx0JHN0YXRlLmdvKCdzbmlwcGV0cycpO1xuXHR9O1xufSk7IiwiYXBwLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlcil7XG5cdCRzdGF0ZVByb3ZpZGVyLnN0YXRlKCd3ZWxjb21lJywge1xuXHRcdHVybCA6ICcvd2VsY29tZScsXG5cdFx0dGVtcGxhdGVVcmwgOiAnZmVhdHVyZXMvd2VsY29tZS93ZWxjb21lLmh0bWwnLFxuXHRcdGNvbnRyb2xsZXIgOiAnV2VsY29tZUN0cmwnXG5cdH0pO1xufSk7XG5hcHAuY29udHJvbGxlcignV2VsY29tZUN0cmwnLCBmdW5jdGlvbigkc2NvcGUsICRzdGF0ZSwgQXV0aFNlcnZpY2UsICRyb290U2NvcGUsIEdpc3RGYWN0b3J5LCAkaW9uaWNQb3B1cCl7XG5cdC8vVE9ETzogU3BsYXNoIHBhZ2Ugd2hpbGUgeW91IGxvYWQgcmVzb3VyY2VzIChwb3NzaWJsZSBpZGVhKVxuXHQvL2NvbnNvbGUubG9nKCdXZWxjb21lQ3RybCcpO1xuXHQkc2NvcGUuYnV0dG9ucyA9IHtcblx0XHRsb2dpbiA6ICdsb2dpbicsXG5cdFx0c2lnbnVwIDogJ3NpZ251cCdcblx0fTtcblxuXHQvLyBpb25pYy5QbGF0Zm9ybS5yZWFkeShmdW5jdGlvbigpe1xuXHQvLyBcdGlvbmljLlBsYXRmb3JtLnNob3dTdGF0dXNCYXIoZmFsc2UpO1xuXHQvLyB9KTtcblxuXHQkc2NvcGUubG9naW4gPSBmdW5jdGlvbigpe1xuXHRcdCRzdGF0ZS5nbygnbG9naW4nKTtcblx0fTtcblx0JHNjb3BlLnNpZ251cCA9IGZ1bmN0aW9uKCl7XG5cdFx0JHN0YXRlLmdvKCdzaWdudXAnKTtcblx0fTtcblxuXHR2YXIgYXV0aFJlcSA9ICFmYWxzZTsgLy9UT0RPOiBUb2dnbGUgZm9yIHVzaW5nIGF1dGhlbnRpY2F0aW9uIHdvcmsgZmxvdyAtIHJlcXVpcmUgYmFja2VuZCB3aXJlZCB1cFxuXG5cdGlmICghYXV0aFJlcSl7XG5cdFx0JHN0YXRlLmdvKCdleGVyY2lzbS52aWV3Jyk7IC8vVE9ETzogSWYgQXV0aCBpcyBub3QgcmVxdWlyZWQsIGdvIGRpcmVjdGx5IGhlcmVcblx0fSBlbHNlIHtcblx0XHRpZiAoQXV0aFNlcnZpY2UuaXNBdXRoZW50aWNhdGVkKCkpIHtcblx0XHRcdCRyb290U2NvcGUuJGJyb2FkY2FzdCgnQXV0aCcpO1xuXHRcdFx0JHNjb3BlLnN0YXRlcy5wdXNoKHsgLy9UT0RPOiBOZWVkIHRvIGFkZCBhIHBhcmVudCBjb250cm9sbGVyIHRvIGNvbW11bmljYXRlXG5cdFx0XHRcdG5hbWU6ICdMb2dvdXQnLFxuXHRcdFx0XHRyZWY6IGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0QXV0aFNlcnZpY2UubG9nb3V0KCk7XG5cdFx0XHRcdFx0JHNjb3BlLmRhdGEgPSB7fTtcblx0XHRcdFx0XHQkc2NvcGUuc3RhdGVzLnBvcCgpOyAvL1RPRE86IEZpbmQgYSBiZXR0ZXIgd2F5IHRvIHJlbW92ZSB0aGUgTG9nb3V0IGxpbmssIGluc3RlYWQgb2YgcG9wXG5cdFx0XHRcdFx0JHN0YXRlLmdvKCdsb2dpbicpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXHRcdFx0Ly9wb3AtdXAgb3B0aW9ucywgdmlldyBzaGFyZWQgY29kZSBvclxuXHRcdFx0Ly9UT0RPOiBIYXBwZW4gb24gTG9naW4sIHJlY2lldmUgZ2lzdCBub3RpZmljYXRpb25cblx0XHRcdEdpc3RGYWN0b3J5LnF1ZXVlZEdpc3RzKCkudGhlbihnaXN0c1J4KTtcblxuXHRcdFx0ZnVuY3Rpb24gZ2lzdHNSeChyZXNwb25zZSl7XG5cdFx0XHRcdGNvbnNvbGUubG9nKHJlc3BvbnNlLmRhdGEuZ2lzdHMpO1xuXHRcdFx0XHRpZihyZXNwb25zZS5kYXRhLmdpc3RzLmxlbmd0aCAhPT0wKXtcblx0XHRcdFx0XHQvL2NvbnNvbGUubG9nKCdub3RpZnkgdXNlciBvZiBSeCBnaXN0cycpXG5cdFx0XHRcdFx0c2hvd0NvbmZpcm0gPSBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdHZhciBjb25maXJtUG9wdXAgPSAkaW9uaWNQb3B1cC5jb25maXJtKHtcblx0XHRcdFx0XHRcdFx0dGl0bGU6ICdZb3UgZ290IENvZGUhJyxcblx0XHRcdFx0XHRcdFx0dGVtcGxhdGU6ICdZb3VyIGZyaWVuZHMgc2hhcmVkIHNvbWUgY29kZSwgZG8geW91IHdhbnQgdG8gdGFrZSBhIGxvb2s/J1xuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHQvL1RPRE86IEN1c3RvbSBQb3BVcCBJbnN0ZWFkXG5cdFx0XHRcdFx0XHQvL1RPRE86IFlvdSBuZWVkIHRvIGFjY291bnQgZm9yIGxvZ2luICh0aGlzIG9ubHkgYWNjb3VudHMgZm9yIHVzZXIgbG9hZGluZyBhcHAsIGFscmVhZHkgbG9nZ2VkIGluKVxuXHRcdFx0XHRcdFx0Y29uZmlybVBvcHVwLnRoZW4oZnVuY3Rpb24ocmVzKSB7XG5cdFx0XHRcdFx0XHRcdGlmKHJlcykge1xuXHRcdFx0XHRcdFx0XHRcdC8vY29uc29sZS5sb2coJ1lvdSBhcmUgc3VyZScpO1xuXHRcdFx0XHRcdFx0XHRcdCRzdGF0ZS5nbygnZnJpZW5kcycpO1xuXHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdC8vY29uc29sZS5sb2coJ1lvdSBhcmUgbm90IHN1cmUnKTtcblx0XHRcdFx0XHRcdFx0XHQkc3RhdGUuZ28oJ2V4ZXJjaXNtLmNvbXBpbGUnKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0fTtcblxuXHRcdFx0XHRcdHNob3dDb25maXJtKCk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0JHN0YXRlLmdvKCdleGVyY2lzbS5jb21waWxlJyk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXG5cdFx0fSBlbHNlIHtcblx0XHRcdC8vVE9ETzogJHN0YXRlLmdvKCdzaWdudXAnKTsgUmVtb3ZlIEJlbG93IGxpbmVcblx0XHRcdC8vJHN0YXRlLmdvKCdzaWdudXAnKTtcblx0XHRcdC8vRE8gTm90aGluZ1xuXHRcdH1cblx0fVxufSk7IiwiLy90b2tlbiBpcyBzZW50IG9uIGV2ZXJ5IGh0dHAgcmVxdWVzdFxuYXBwLmZhY3RvcnkoJ0F1dGhJbnRlcmNlcHRvcicsZnVuY3Rpb24gQXV0aEludGVyY2VwdG9yKEFVVEhfRVZFTlRTLCRyb290U2NvcGUsJHEsQXV0aFRva2VuRmFjdG9yeSl7XG5cbiAgICB2YXIgc3RhdHVzRGljdCA9IHtcbiAgICAgICAgNDAxOiBBVVRIX0VWRU5UUy5ub3RBdXRoZW50aWNhdGVkLFxuICAgICAgICA0MDM6IEFVVEhfRVZFTlRTLm5vdEF1dGhvcml6ZWRcbiAgICB9O1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgcmVxdWVzdDogYWRkVG9rZW4sXG4gICAgICAgIHJlc3BvbnNlRXJyb3I6IGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KHN0YXR1c0RpY3RbcmVzcG9uc2Uuc3RhdHVzXSwgcmVzcG9uc2UpO1xuICAgICAgICAgICAgcmV0dXJuICRxLnJlamVjdChyZXNwb25zZSk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gYWRkVG9rZW4oY29uZmlnKXtcbiAgICAgICAgdmFyIHRva2VuID0gQXV0aFRva2VuRmFjdG9yeS5nZXRUb2tlbigpO1xuICAgICAgICAvL2NvbnNvbGUubG9nKCdhZGRUb2tlbicsdG9rZW4pO1xuICAgICAgICBpZih0b2tlbil7XG4gICAgICAgICAgICBjb25maWcuaGVhZGVycyA9IGNvbmZpZy5oZWFkZXJzIHx8IHt9O1xuICAgICAgICAgICAgY29uZmlnLmhlYWRlcnMuQXV0aG9yaXphdGlvbiA9ICdCZWFyZXIgJyArIHRva2VuO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjb25maWc7XG4gICAgfVxufSk7XG4vL3NraXBwZWQgQXV0aCBJbnRlcmNlcHRvcnMgZ2l2ZW4gVE9ETzogWW91IGNvdWxkIGFwcGx5IHRoZSBhcHByb2FjaCBpblxuLy9odHRwOi8vZGV2ZGFjdGljLmNvbS91c2VyLWF1dGgtYW5ndWxhcmpzLWlvbmljL1xuXG5hcHAuY29uZmlnKGZ1bmN0aW9uKCRodHRwUHJvdmlkZXIpe1xuICAgICRodHRwUHJvdmlkZXIuaW50ZXJjZXB0b3JzLnB1c2goJ0F1dGhJbnRlcmNlcHRvcicpO1xufSk7XG5cbmFwcC5jb25zdGFudCgnQVVUSF9FVkVOVFMnLCB7XG4gICAgICAgIG5vdEF1dGhlbnRpY2F0ZWQ6ICdhdXRoLW5vdC1hdXRoZW50aWNhdGVkJyxcbiAgICAgICAgbm90QXV0aG9yaXplZDogJ2F1dGgtbm90LWF1dGhvcml6ZWQnXG59KTtcblxuYXBwLmNvbnN0YW50KCdVU0VSX1JPTEVTJywge1xuICAgICAgICAvL2FkbWluOiAnYWRtaW5fcm9sZScsXG4gICAgICAgIHB1YmxpYzogJ3B1YmxpY19yb2xlJ1xufSk7XG5cbmFwcC5mYWN0b3J5KCdBdXRoVG9rZW5GYWN0b3J5JyxmdW5jdGlvbigkd2luZG93KXtcbiAgICB2YXIgc3RvcmUgPSAkd2luZG93LmxvY2FsU3RvcmFnZTtcbiAgICB2YXIga2V5ID0gJ2F1dGgtdG9rZW4nO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgZ2V0VG9rZW46IGdldFRva2VuLFxuICAgICAgICBzZXRUb2tlbjogc2V0VG9rZW5cbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gZ2V0VG9rZW4oKXtcbiAgICAgICAgcmV0dXJuIHN0b3JlLmdldEl0ZW0oa2V5KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzZXRUb2tlbih0b2tlbil7XG4gICAgICAgIGlmKHRva2VuKXtcbiAgICAgICAgICAgIHN0b3JlLnNldEl0ZW0oa2V5LHRva2VuKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHN0b3JlLnJlbW92ZUl0ZW0oa2V5KTtcbiAgICAgICAgfVxuICAgIH1cbn0pO1xuXG5hcHAuc2VydmljZSgnQXV0aFNlcnZpY2UnLGZ1bmN0aW9uKCRxLCRodHRwLFVTRVJfUk9MRVMsQXV0aFRva2VuRmFjdG9yeSxBcGlFbmRwb2ludCwkcm9vdFNjb3BlKXtcbiAgICB2YXIgdXNlcm5hbWUgPSAnJztcbiAgICB2YXIgaXNBdXRoZW50aWNhdGVkID0gZmFsc2U7XG4gICAgdmFyIGF1dGhUb2tlbjtcblxuICAgIGZ1bmN0aW9uIGxvYWRVc2VyQ3JlZGVudGlhbHMoKSB7XG4gICAgICAgIC8vdmFyIHRva2VuID0gd2luZG93LmxvY2FsU3RvcmFnZS5nZXRJdGVtKExPQ0FMX1RPS0VOX0tFWSk7XG4gICAgICAgIHZhciB0b2tlbiA9IEF1dGhUb2tlbkZhY3RvcnkuZ2V0VG9rZW4oKTtcbiAgICAgICAgLy9jb25zb2xlLmxvZyh0b2tlbik7XG4gICAgICAgIGlmICh0b2tlbikge1xuICAgICAgICAgICAgdXNlQ3JlZGVudGlhbHModG9rZW4pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc3RvcmVVc2VyQ3JlZGVudGlhbHMoZGF0YSkge1xuICAgICAgICBBdXRoVG9rZW5GYWN0b3J5LnNldFRva2VuKGRhdGEudG9rZW4pO1xuICAgICAgICB1c2VDcmVkZW50aWFscyhkYXRhKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB1c2VDcmVkZW50aWFscyhkYXRhKSB7XG4gICAgICAgIC8vY29uc29sZS5sb2coJ3VzZUNyZWRlbnRpYWxzIHRva2VuJyxkYXRhKTtcbiAgICAgICAgdXNlcm5hbWUgPSBkYXRhLnVzZXJuYW1lO1xuICAgICAgICBpc0F1dGhlbnRpY2F0ZWQgPSB0cnVlO1xuICAgICAgICBhdXRoVG9rZW4gPSBkYXRhLnRva2VuO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGRlc3Ryb3lVc2VyQ3JlZGVudGlhbHMoKSB7XG4gICAgICAgIGF1dGhUb2tlbiA9IHVuZGVmaW5lZDtcbiAgICAgICAgdXNlcm5hbWUgPSAnJztcbiAgICAgICAgaXNBdXRoZW50aWNhdGVkID0gZmFsc2U7XG4gICAgICAgIEF1dGhUb2tlbkZhY3Rvcnkuc2V0VG9rZW4oKTsgLy9lbXB0eSBjbGVhcnMgdGhlIHRva2VuXG4gICAgfVxuXG4gICAgdmFyIGxvZ291dCA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIGRlc3Ryb3lVc2VyQ3JlZGVudGlhbHMoKTtcblxuICAgIH07XG5cbiAgICAvL3ZhciBsb2dpbiA9IGZ1bmN0aW9uKClcbiAgICB2YXIgbG9naW4gPSBmdW5jdGlvbih1c2VyZGF0YSl7XG4gICAgICAgIGNvbnNvbGUubG9nKCdsb2dpbicsSlNPTi5zdHJpbmdpZnkodXNlcmRhdGEpKTtcbiAgICAgICAgcmV0dXJuICRxKGZ1bmN0aW9uKHJlc29sdmUscmVqZWN0KXtcbiAgICAgICAgICAgICRodHRwLnBvc3QoQXBpRW5kcG9pbnQudXJsK1wiL3VzZXIvbG9naW5cIiwgdXNlcmRhdGEpXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgICAgICAgICAgICAgICBzdG9yZVVzZXJDcmVkZW50aWFscyhyZXNwb25zZS5kYXRhKTsgLy9zdG9yZVVzZXJDcmVkZW50aWFsc1xuICAgICAgICAgICAgICAgICAgICAvL2lzQXV0aGVudGljYXRlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUocmVzcG9uc2UpOyAvL1RPRE86IHNlbnQgdG8gYXV0aGVudGljYXRlZFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgdmFyIHNpZ251cCA9IGZ1bmN0aW9uKHVzZXJkYXRhKXtcbiAgICAgICAgY29uc29sZS5sb2coJ3NpZ251cCcsSlNPTi5zdHJpbmdpZnkodXNlcmRhdGEpKTtcbiAgICAgICAgcmV0dXJuICRxKGZ1bmN0aW9uKHJlc29sdmUscmVqZWN0KXtcbiAgICAgICAgICAgICRodHRwLnBvc3QoQXBpRW5kcG9pbnQudXJsK1wiL3VzZXIvc2lnbnVwXCIsIHVzZXJkYXRhKVxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAgICAgICAgICAgICAgICAgc3RvcmVVc2VyQ3JlZGVudGlhbHMocmVzcG9uc2UuZGF0YSk7IC8vc3RvcmVVc2VyQ3JlZGVudGlhbHNcbiAgICAgICAgICAgICAgICAgICAgLy9pc0F1dGhlbnRpY2F0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHJlc3BvbnNlKTsgLy9UT0RPOiBzZW50IHRvIGF1dGhlbnRpY2F0ZWRcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgbG9hZFVzZXJDcmVkZW50aWFscygpO1xuXG4gICAgdmFyIGlzQXV0aG9yaXplZCA9IGZ1bmN0aW9uKGF1dGhlbnRpY2F0ZWQpIHtcbiAgICAgICAgaWYgKCFhbmd1bGFyLmlzQXJyYXkoYXV0aGVudGljYXRlZCkpIHtcbiAgICAgICAgICAgIGF1dGhlbnRpY2F0ZWQgPSBbYXV0aGVudGljYXRlZF07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIChpc0F1dGhlbnRpY2F0ZWQgJiYgYXV0aGVudGljYXRlZC5pbmRleE9mKFVTRVJfUk9MRVMucHVibGljKSAhPT0gLTEpO1xuICAgIH07XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBsb2dpbjogbG9naW4sXG4gICAgICAgIHNpZ251cDogc2lnbnVwLFxuICAgICAgICBsb2dvdXQ6IGxvZ291dCxcbiAgICAgICAgaXNBdXRoZW50aWNhdGVkOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ0F1dGhTZXJ2aWNlLmlzQXV0aGVudGljYXRlZCgpJyk7XG4gICAgICAgICAgICByZXR1cm4gaXNBdXRoZW50aWNhdGVkO1xuICAgICAgICB9LFxuICAgICAgICB1c2VybmFtZTogZnVuY3Rpb24oKXtyZXR1cm4gdXNlcm5hbWU7fSxcbiAgICAgICAgLy9nZXRMb2dnZWRJblVzZXI6IGdldExvZ2dlZEluVXNlcixcbiAgICAgICAgaXNBdXRob3JpemVkOiBpc0F1dGhvcml6ZWRcbiAgICB9XG5cbn0pO1xuXG4vL1RPRE86IERpZCBub3QgY29tcGxldGUgbWFpbiBjdHJsICdBcHBDdHJsIGZvciBoYW5kbGluZyBldmVudHMnXG4vLyBhcyBwZXIgaHR0cDovL2RldmRhY3RpYy5jb20vdXNlci1hdXRoLWFuZ3VsYXJqcy1pb25pYy8iLCJhcHAuZmFjdG9yeSgnS2V5Ym9hcmRGYWN0b3J5JywgZnVuY3Rpb24oKXtcblx0cmV0dXJuIHtcblx0XHRtYWtlSW5zZXJ0RnVuYyA6IGZ1bmN0aW9uKHNjb3BlKXtcblx0XHRcdHJldHVybiBmdW5jdGlvbiAodGV4dCl7XG5cdFx0XHRcdHNjb3BlLiRicm9hZGNhc3QoXCJpbnNlcnRcIiwgdGV4dCk7XG5cdFx0XHR9O1xuXHRcdH1cblx0fTtcbn0pOyIsImFwcC5mYWN0b3J5KCdDb2RlU25pcHBldEZhY3RvcnknLCBmdW5jdGlvbigkcm9vdFNjb3BlKXtcblx0XG5cdHZhciBjb2RlU25pcHBldHMgPSBbXG5cdFx0e1xuXHRcdFx0ZGlzcGxheTogXCJmblwiLFxuXHRcdFx0aW5zZXJ0UGFyYW06IFwiZnVuY3Rpb24oKXsgfVwiXG5cdFx0fSxcblx0XHR7XG5cdFx0XHRkaXNwbGF5OiBcImZvclwiLFxuXHRcdFx0aW5zZXJ0UGFyYW06IFwiZm9yKHZhciBpPSA7aTwgO2krKyl7IH1cIlxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0ZGlzcGxheTogXCJ3aGlsZVwiLFxuXHRcdFx0aW5zZXJ0UGFyYW06IFwid2hpbGUoICl7IH1cIlxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0ZGlzcGxheTogXCJkbyB3aGlsZVwiLFxuXHRcdFx0aW5zZXJ0UGFyYW06IFwiZG8geyB9IHdoaWxlKCApO1wiXG5cdFx0fSxcblx0XHR7XG5cdFx0XHRkaXNwbGF5OiBcImxvZ1wiLFxuXHRcdFx0aW5zZXJ0UGFyYW06IFwiY29uc29sZS5sb2coKTtcIlxuXHRcdH0sXG5cdF07XG5cblx0dmFyIGJyYWNrZXRzID0gW1xuXHRcdHtcblx0XHRcdGRpc3BsYXk6IFwiWyBdXCIsXG5cdFx0XHRpbnNlcnRQYXJhbTogXCJbXVwiXG5cdFx0fSxcblx0XHR7XG5cdFx0XHRkaXNwbGF5OiBcInsgfVwiLFxuXHRcdFx0aW5zZXJ0UGFyYW06IFwie31cIlxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0ZGlzcGxheTogXCIoIClcIixcblx0XHRcdGluc2VydFBhcmFtOiBcIigpXCJcblx0XHR9LFxuXHRcdHtcblx0XHRcdGRpc3BsYXk6IFwiLy9cIixcblx0XHRcdGluc2VydFBhcmFtOiBcIi8vXCJcblx0XHR9LFxuXHRcdHtcblx0XHRcdGRpc3BsYXk6IFwiLyogICovXCIsXG5cdFx0XHRpbnNlcnRQYXJhbTogXCIvKiAqL1wiXG5cdFx0fVxuXHRdO1xuXG5cdHZhciBjb21wYXJhdG9ycyA9IFtcblx0XHR7XG5cdFx0XHRkaXNwbGF5OiBcIiFcIixcblx0XHRcdGluc2VydFBhcmFtOiBcIiFcIlxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0ZGlzcGxheTogXCJAXCIsXG5cdFx0XHRpbnNlcnRQYXJhbTogXCJAXCJcblx0XHR9LFxuXHRcdHtcblx0XHRcdGRpc3BsYXk6IFwiI1wiLFxuXHRcdFx0aW5zZXJ0UGFyYW06IFwiI1wiXG5cdFx0fSxcblx0XHR7XG5cdFx0XHRkaXNwbGF5OiBcIiRcIixcblx0XHRcdGluc2VydFBhcmFtOiBcIiRcIlxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0ZGlzcGxheTogXCIlXCIsXG5cdFx0XHRpbnNlcnRQYXJhbTogXCIlXCJcblx0XHR9LFxuXHRcdHtcblx0XHRcdGRpc3BsYXk6IFwiPVwiLFxuXHRcdFx0aW5zZXJ0UGFyYW06IFwiPVwiXG5cdFx0fSxcblx0XHR7XG5cdFx0XHRkaXNwbGF5OiBcIjxcIixcblx0XHRcdGluc2VydFBhcmFtOiBcIjxcIlxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0ZGlzcGxheTogXCI+XCIsXG5cdFx0XHRpbnNlcnRQYXJhbTogXCI+XCJcblx0XHR9XG5cdF07XG5cblx0dmFyIGZvb3Rlck1lbnUgPSBbXG5cdFx0e1xuXHRcdFx0ZGlzcGxheTogXCJDdXN0b21cIixcblx0XHRcdGRhdGE6IGNvZGVTbmlwcGV0c1xuXHRcdH0sXG5cdFx0e1xuXHRcdFx0ZGlzcGxheTogXCJTcGVjaWFsXCIsXG5cdFx0XHRkYXRhOiBjb21wYXJhdG9yc1xuXHRcdH0sXG5cdFx0e1xuXHRcdFx0ZGlzcGxheTogXCJCcmFja2V0c1wiLFxuXHRcdFx0ZGF0YTogYnJhY2tldHNcblx0XHR9XG5cdF07XG5cblx0Ly8gdmFyIGdldEhvdGtleXMgPSBmdW5jdGlvbigpe1xuXHQvLyBcdHJldHVybiBmb290ZXJIb3RrZXlzO1xuXHQvLyB9O1xuXG5cdHJldHVybiBcdHtcblx0XHRnZXRGb290ZXJNZW51IDogZnVuY3Rpb24oKXtcblx0XHRcdHJldHVybiBmb290ZXJNZW51O1xuXHRcdH0sXG5cdFx0YWRkU25pcHBldCA6IGZ1bmN0aW9uKG9iail7XG5cdFx0XHRjb25zb2xlLmxvZyhvYmopO1xuXHRcdFx0Y29kZVNuaXBwZXRzLnB1c2gob2JqKTtcblx0XHRcdCRyb290U2NvcGUuJGJyb2FkY2FzdCgnZm9vdGVyVXBkYXRlZCcsIHRoaXMuZ2V0Rm9vdGVyTWVudSgpKTtcblx0XHR9LFxuXHRcdGRlbGV0ZVNuaXBwZXQgOiBmdW5jdGlvbihpZCl7XG5cdFx0XHRjb2RlU25pcHBldHMuc3BsaWNlKGlkLCAxKTtcblx0XHRcdCRyb290U2NvcGUuJGJyb2FkY2FzdCgnZm9vdGVyVXBkYXRlZCcsIHRoaXMuZ2V0Rm9vdGVyTWVudSgpKTtcblx0XHR9LFxuXHRcdGdldEFsbFNuaXBwZXRzIDogZnVuY3Rpb24oKXtcblx0XHRcdHJldHVybiBjb2RlU25pcHBldHMubWFwKGZ1bmN0aW9uKGVsLCBpbmRleCl7XG5cdFx0XHRcdGVsLmlkID0gaW5kZXg7XG5cdFx0XHRcdHJldHVybiBlbDtcblx0XHRcdH0pO1xuXHRcdH0sXG5cdFx0ZWRpdFNuaXBwZXQgOiBmdW5jdGlvbihpZCwgY2hhbmdlcyl7XG5cdFx0XHRmb3IodmFyIGtleSBpbiBjb2RlU25pcHBldHNbaWRdKXtcblx0XHRcdFx0Y29kZVNuaXBwZXRzW2lkXVtrZXldID0gY2hhbmdlc1trZXldO1xuXHRcdFx0fVxuXHRcdFx0JHJvb3RTY29wZS4kYnJvYWRjYXN0KCdmb290ZXJVcGRhdGVkJywgdGhpcy5nZXRGb290ZXJNZW51KCkpO1xuXHRcdH0sXG5cdFx0Z2V0U25pcHBldCA6IGZ1bmN0aW9uKGlkKXtcblx0XHRcdHJldHVybiBjb2RlU25pcHBldHNbaWRdO1xuXHRcdH0sXG5cdFx0Z2V0U29tZVNuaXBwZXRzIDogZnVuY3Rpb24odGV4dCl7XG5cdFx0XHRmdW5jdGlvbiByZXBsYWNlVFNOIChzdHIpe1xuXHRcdFx0XHRyZXR1cm4gc3RyLnJlcGxhY2UoJy8oXFxufFxcdHxcXHMpKy9nJywgJycpO1xuXHRcdFx0fVxuXG5cdFx0XHRmdW5jdGlvbiBjaGVja09iamVjdChjaGVjayl7XG5cdFx0XHRcdGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSl7XG5cdFx0XHRcdFx0dmFyIGFyZ3MgPSBbXS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsMCk7XG5cdFx0XHRcdFx0YXJncy5zaGlmdCgpO1xuXHRcdFx0XHRcdHJldHVybiBhcmdzLmZpbHRlcihmdW5jdGlvbihlbCl7XG5cdFx0XHRcdFx0XHRyZXR1cm4gcmVwbGFjZVRTTihlbCkgPT09IHJlcGxhY2VUU04oY2hlY2spO1xuXHRcdFx0XHRcdH0pLmxlbmd0aCA+IDA7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSB0aHJvdyBuZXcgRXJyb3IoJ1BsZWFzZSBjaGVjaycpO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gY29kZVNuaXBwZXRzLmZpbHRlcihmdW5jdGlvbihlbCl7XG5cdFx0XHRcdHJldHVybiBjaGVja09iamVjdCh0ZXh0LCBlbC5kaXNwbGF5LCBlbC5pbnNlcnRQYXJhbSk7XG5cdFx0XHR9KTtcblx0XHR9XG5cdH07XG59KTsiLCJhcHAuZmlsdGVyKCdhcHBlbmQnLCBmdW5jdGlvbigpe1xuXHRyZXR1cm4gZnVuY3Rpb24oaW5wdXQsIGFwcGVuZCl7XG5cdFx0cmV0dXJuIGFwcGVuZCArIGlucHV0O1xuXHR9O1xufSk7IiwiYXBwLmZpbHRlcignYm9vbCcsIGZ1bmN0aW9uKCl7XG5cdHJldHVybiBmdW5jdGlvbihpbnB1dCwgY29uZGl0aW9uLCBpZlRydWUsIGlmRmFsc2Upe1xuXHRcdGlmKGV2YWwoaW5wdXQgKyBjb25kaXRpb24pKXtcblx0XHRcdHJldHVybiBpZlRydWU7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldHVybiBpZkZhbHNlO1xuXHRcdH1cblx0fTtcbn0pOyIsImFwcC5maWx0ZXIoJ25hbWVmb3JtYXQnLCBmdW5jdGlvbigpe1xuXHRyZXR1cm4gZnVuY3Rpb24odGV4dCl7XG5cdFx0cmV0dXJuICdFeGVyY2lzbSAtICcgKyB0ZXh0LnNwbGl0KCctJykubWFwKGZ1bmN0aW9uKGVsKXtcblx0XHRcdHJldHVybiBlbC5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIGVsLnNsaWNlKDEpO1xuXHRcdH0pLmpvaW4oJyAnKTtcblx0fTtcbn0pOyIsImFwcC5maWx0ZXIoJ2xlbmd0aCcsIGZ1bmN0aW9uKCl7XG5cdHJldHVybiBmdW5jdGlvbihhcnJJbnB1dCl7XG5cdFx0dmFyIGNoZWNrQXJyID0gYXJySW5wdXQgfHwgW107XG5cdFx0cmV0dXJuIGNoZWNrQXJyLmxlbmd0aDtcblx0fTtcbn0pOyIsImFwcC5maWx0ZXIoJ21hcmtlZCcsIGZ1bmN0aW9uKCRzY2Upe1xuXHQvLyBtYXJrZWQuc2V0T3B0aW9ucyh7XG5cdC8vIFx0cmVuZGVyZXI6IG5ldyBtYXJrZWQuUmVuZGVyZXIoKSxcblx0Ly8gXHRnZm06IHRydWUsXG5cdC8vIFx0dGFibGVzOiB0cnVlLFxuXHQvLyBcdGJyZWFrczogdHJ1ZSxcblx0Ly8gXHRwZWRhbnRpYzogZmFsc2UsXG5cdC8vIFx0c2FuaXRpemU6IHRydWUsXG5cdC8vIFx0c21hcnRMaXN0czogdHJ1ZSxcblx0Ly8gXHRzbWFydHlwYW50czogZmFsc2Vcblx0Ly8gfSk7XG5cdHJldHVybiBmdW5jdGlvbih0ZXh0KXtcblx0XHRpZih0ZXh0KXtcblx0XHRcdHJldHVybiAkc2NlLnRydXN0QXNIdG1sKG1hcmtlZCh0ZXh0KSk7XG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdFx0cmV0dXJuIHVuZGVmaW5lZDtcblx0XHR9XG5cdH07XG59KTsiLCJhcHAuc2VydmljZSgnTG9jYWxTdG9yYWdlJyxmdW5jdGlvbigkbG9jYWxzdG9yYWdlKXtcbiAgICAvL2lmKFxuICAgIC8vY29uc29sZS5sb2coJGNvcmRvdmFOZXR3b3JrLmdldE5ldHdvcmsoKSk7XG4gICAgaWYoJGxvY2Fsc3RvcmFnZS5nZXQoJ2F1dGgtdG9rZW4nKSl7XG4gICAgICAgIC8vVE9ETzogVGVzdCBOZXR3b3JrIENvbm5lY3Rpb24gb24gRGV2aWNlIGFuZCBWaWEgQ29uc29sZSBMb2dcblxuICAgICAgICB2YXIgY29ubmVjdGlvbiA9ICFmYWxzZTtcblxuICAgICAgICBpZihjb25uZWN0aW9uKXtcbiAgICAgICAgICAgIC8vc3luYyBkYXRhXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvL2xvYWQgZGF0YSBmcm9tIGxvY2FsU3RvcmFnZVxuICAgICAgICAgICAgLy95b3UgbmVlZCB0byBzdG9yZSB0byBsb2NhbCBzdG9yYWdlIGF0IHNvbWUgcG9pbnRcbiAgICAgICAgICAgIC8vc28gYW55dGltZSB5b3UgdG91Y2ggYW55IG9mIHRoZSBsb2NhbFN0b3JhZ2UgZGF0YSwgYmUgc3VyZSB0byB3cml0ZSB0byBpdFxuICAgICAgICB9XG4gICAgICAgIC8vSWYgSW50ZXJuZXQgQ29ubmVjdGlvblxuXG4gICAgICAgIC8vY29uc29sZS5sb2coJGNvcmRvdmFOZXR3b3JrLmdldE5ldHdvcmsoKSk7XG4gICAgICAgIC8vY29uc29sZS5sb2coQ29ubmVjdGlvbi5OT05FKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICAvL2RvIG5vdGhpbmcgLSB3ZWxjb21lIHdpbGwgaGFuZGxlIHVuLWF1dGggdXNlcnNcbiAgICB9XG59KTtcblxuLy9Xb3JraW5nIE9mZmxpbmVcbi8vU3luYyBDb21tb24gRGF0YSBvbiBBcHAgTG9hZCBpZiBQb3NzaWJsZSAoYW5kIHN0b3JlIGluIExvY2FsU3RvcmFnZSkgLSBPdGhlcndpc2UgbG9hZCBmcm9tIExvY2FsIFN0b3JhZ2VcbiAgICAvL0xvY2FsU3RvcmFnZVxuICAgICAgICAvL1N0b3JlIEZyaWVuZHNcbiAgICAgICAgLy9TdG9yZSBDb2RlIFJlY2VpdmVkIChmcm9tIFdobylcbiAgICAgICAgLy9TdG9yZSBMYXN0IFN5bmNcbi8vU3luYyBDb21tb24gRGF0YSBQZXJpb2RpY2FsbHkgYXMgd2VsbCAoTm90IFN1cmUgSG93PyEpIE1heWJlIG9uIENlcnRhaW4gSG90U3BvdHMgKGNsaWNraW5nIGNlcnRhaW4gbGlua3MpIGFuZCBUaW1lQmFzZWQgYXMgd2VsXG4iLCJhbmd1bGFyLm1vZHVsZSgnaW9uaWMudXRpbHMnLCBbXSlcblxuLmZhY3RvcnkoJyRsb2NhbHN0b3JhZ2UnLCBbJyR3aW5kb3cnLCBmdW5jdGlvbigkd2luZG93KSB7XG4gIHJldHVybiB7XG4gICAgc2V0OiBmdW5jdGlvbihrZXksIHZhbHVlKSB7XG4gICAgICAkd2luZG93LmxvY2FsU3RvcmFnZVtrZXldID0gdmFsdWU7XG4gICAgfSxcbiAgICBnZXQ6IGZ1bmN0aW9uKGtleSwgZGVmYXVsdFZhbHVlKSB7XG4gICAgICByZXR1cm4gJHdpbmRvdy5sb2NhbFN0b3JhZ2Vba2V5XSB8fCBkZWZhdWx0VmFsdWU7XG4gICAgfSxcbiAgICBzZXRPYmplY3Q6IGZ1bmN0aW9uKGtleSwgdmFsdWUpIHtcbiAgICAgICR3aW5kb3cubG9jYWxTdG9yYWdlW2tleV0gPSBKU09OLnN0cmluZ2lmeSh2YWx1ZSk7XG4gICAgfSxcbiAgICBnZXRPYmplY3Q6IGZ1bmN0aW9uKGtleSkge1xuICAgICAgcmV0dXJuIEpTT04ucGFyc2UoJHdpbmRvdy5sb2NhbFN0b3JhZ2Vba2V5XSB8fCAne30nKTtcbiAgICB9XG4gIH07XG59XSk7IiwiYXBwLmRpcmVjdGl2ZSgnY29kZWtleWJvYXJkJywgZnVuY3Rpb24oQ29kZVNuaXBwZXRGYWN0b3J5LCAkY29tcGlsZSl7XG5cdHJldHVybiB7XG5cdFx0cmVzdHJpY3QgOiAnQScsXG5cdFx0bGluayA6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRyaWJ1dGUpe1xuXHRcdFx0dmFyIHZpc2libGUgPSBmYWxzZTtcblxuXHRcdFx0ZWxlbWVudC5hZGRDbGFzcyhcImJhci1zdGFibGVcIik7XG5cdFx0XHRlbGVtZW50LmFkZENsYXNzKCduZy1oaWRlJyk7XG5cblx0XHRcdGZ1bmN0aW9uIHRvZ2dsZUNsYXNzKCl7XG5cdFx0XHRcdGlmKHZpc2libGUpe1xuXHRcdFx0XHRcdGVsZW1lbnQucmVtb3ZlQ2xhc3MoJ25nLWhpZGUnKTtcblx0XHRcdFx0XHRlbGVtZW50LmFkZENsYXNzKCduZy1zaG93Jyk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0ZWxlbWVudC5yZW1vdmVDbGFzcygnbmctc2hvdycpO1xuXHRcdFx0XHRcdGVsZW1lbnQuYWRkQ2xhc3MoJ25nLWhpZGUnKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0c2NvcGUuYnRucyA9IENvZGVTbmlwcGV0RmFjdG9yeS5nZXRGb290ZXJNZW51KCk7XG5cblx0XHRcdHNjb3BlLiRvbignZm9vdGVyVXBkYXRlZCcsIGZ1bmN0aW9uKGV2ZW50LCBkYXRhKXtcblx0XHRcdFx0c2NvcGUuYnRucyA9IGRhdGE7XG5cdFx0XHR9KTtcblxuXHRcdFx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJuYXRpdmUua2V5Ym9hcmRzaG93XCIsIGZ1bmN0aW9uICgpe1xuXHRcdCAgICBcdHZpc2libGUgPSB0cnVlO1xuXHRcdCAgICBcdHRvZ2dsZUNsYXNzKCk7XG5cblx0XHQgICAgfSk7XG5cdFx0ICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibmF0aXZlLmtleWJvYXJkaGlkZVwiLCBmdW5jdGlvbiAoKXtcblx0XHQgICAgXHR2aXNpYmxlID0gZmFsc2U7XG5cdFx0ICAgIFx0dG9nZ2xlQ2xhc3MoKTtcblx0XHQgICAgfSk7XG5cdFx0fVxuXHR9O1xufSk7IiwiYXBwLmRpcmVjdGl2ZSgnc25pcHBldGJ1dHRvbnMnLCBmdW5jdGlvbigpe1xuXHRyZXR1cm4ge1xuXHRcdHJlc3RyaWN0IDogJ0UnLFxuXHRcdHJlcGxhY2U6dHJ1ZSxcblx0XHR0ZW1wbGF0ZVVybDpcImZlYXR1cmVzL2NvbW1vbi9kaXJlY3RpdmVzL2NvZGVrZXlib2FyZGJhci9zbmlwcGV0YnV0dG9ucy5odG1sXCIsXG5cdFx0bGluayA6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRyaWJ1dGUpe1xuXHRcdFx0c2NvcGUuc2hvd09wdGlvbnMgPSBmYWxzZTtcblx0XHRcdHNjb3BlLmJ0bkNsaWNrID0gZnVuY3Rpb24oZGF0YSl7XG5cdFx0XHRcdHNjb3BlLnNob3dPcHRpb25zID0gdHJ1ZTtcblx0XHRcdFx0c2NvcGUuaXRlbXMgPSBkYXRhO1xuXHRcdFx0fTtcblx0XHRcdHNjb3BlLml0ZW1DbGljayA9IGZ1bmN0aW9uKGluc2VydFBhcmFtKXtcblx0XHRcdFx0c2NvcGUuaW5zZXJ0RnVuYyhpbnNlcnRQYXJhbSk7XG5cdFx0XHR9O1xuXHRcdFx0c2NvcGUucmVzZXRNZW51ID0gZnVuY3Rpb24oKXtcblx0XHRcdFx0c2NvcGUuc2hvd09wdGlvbnMgPSBmYWxzZTtcblx0XHRcdH07XG5cdFx0fVxuXHR9O1xufSk7IiwiYXBwLmRpcmVjdGl2ZSgnY21lZGl0JywgZnVuY3Rpb24oKXtcblx0cmV0dXJuIHtcblx0XHRyZXN0cmljdCA6ICdBJyxcblx0XHRyZXF1aXJlOiAnbmdNb2RlbCcsXG5cdFx0bGluayA6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRyaWJ1dGUsIG5nTW9kZWxDdHJsKXtcblx0XHRcdC8vaW5pdGlhbGl6ZSBDb2RlTWlycm9yXG5cdFx0XHR2YXIgbXlDb2RlTWlycm9yO1xuXHRcdFx0bXlDb2RlTWlycm9yID0gQ29kZU1pcnJvci5mcm9tVGV4dEFyZWEoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoYXR0cmlidXRlLmlkKSwge1xuXHRcdFx0XHRsaW5lTnVtYmVycyA6IHRydWUsXG5cdFx0XHRcdG1vZGU6ICdqYXZhc2NyaXB0Jyxcblx0XHRcdFx0YXV0b2ZvY3VzIDogdHJ1ZSxcblx0XHRcdFx0dGhlbWUgOiAndHdpbGlnaHQnLFxuXHRcdFx0XHRsaW5lV3JhcHBpbmc6IHRydWUsXG5cdFx0XHRcdHNjcm9sbGJhclN0eWxlOiBcIm92ZXJsYXlcIlxuXHRcdFx0fSk7XG5cdFx0XHRuZ01vZGVsQ3RybC4kcmVuZGVyID0gZnVuY3Rpb24oKXtcblx0XHRcdFx0bXlDb2RlTWlycm9yLnNldFZhbHVlKG5nTW9kZWxDdHJsLiR2aWV3VmFsdWUgfHwgJycpO1xuXHRcdFx0fTtcblxuXHRcdFx0bXlDb2RlTWlycm9yLm9uKFwiY2hhbmdlXCIsIGZ1bmN0aW9uIChteUNvZGVNaXJyb3IsIGNoYW5nZU9iail7XG5cdFx0ICAgIFx0bmdNb2RlbEN0cmwuJHNldFZpZXdWYWx1ZShteUNvZGVNaXJyb3IuZ2V0VmFsdWUoKSk7XG5cdFx0ICAgIH0pO1xuXG5cdFx0ICAgIHNjb3BlLiRvbihcImluc2VydFwiLCBmdW5jdGlvbihldmVudCwgdGV4dCl7XG5cdFx0ICAgIFx0bXlDb2RlTWlycm9yLnJlcGxhY2VTZWxlY3Rpb24odGV4dCk7XG5cdFx0ICAgIH0pO1xuXHRcdH1cblx0fTtcbn0pOyIsImFwcC5kaXJlY3RpdmUoJ2NtcmVhZCcsIGZ1bmN0aW9uKCl7XG5cdHJldHVybiB7XG5cdFx0cmVzdHJpY3QgOiAnQScsXG5cdFx0cmVxdWlyZTogJ25nTW9kZWwnLFxuXHRcdGxpbmsgOiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cmlidXRlLCBuZ01vZGVsQ3RybCl7XG5cdFx0XHQvL2luaXRpYWxpemUgQ29kZU1pcnJvclxuXHRcdFx0dmFyIG15Q29kZU1pcnJvciA9IENvZGVNaXJyb3IuZnJvbVRleHRBcmVhKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGF0dHJpYnV0ZS5pZCksIHtcblx0XHRcdFx0cmVhZE9ubHkgOiAnbm9jdXJzb3InLFxuXHRcdFx0XHRtb2RlOiAnamF2YXNjcmlwdCcsXG5cdFx0XHRcdGF1dG9mb2N1cyA6IHRydWUsXG5cdFx0XHRcdHRoZW1lIDogJ3R3aWxpZ2h0Jyxcblx0XHRcdFx0bGluZVdyYXBwaW5nOiB0cnVlXG5cdFx0XHR9KTtcblxuXHRcdFx0bmdNb2RlbEN0cmwuJHJlbmRlciA9IGZ1bmN0aW9uKCl7XG5cdFx0XHRcdG15Q29kZU1pcnJvci5zZXRWYWx1ZShuZ01vZGVsQ3RybC4kdmlld1ZhbHVlIHx8ICcnKTtcblx0XHRcdH07XG5cdFx0fVxuXHR9O1xufSk7IiwiYXBwLmRpcmVjdGl2ZSgnamFzbWluZScsIGZ1bmN0aW9uKEphc21pbmVSZXBvcnRlcil7XG5cdHJldHVybiB7XG5cdFx0cmVzdHJpY3QgOiAnRScsXG5cdFx0dHJhbnNjbHVkZTogdHJ1ZSxcblx0XHRzY29wZSA6IHtcblx0XHRcdHRlc3Q6ICc9Jyxcblx0XHRcdGNvZGU6ICc9J1xuXHRcdH0sXG5cdFx0dGVtcGxhdGVVcmwgOiAnZmVhdHVyZXMvY29tbW9uL2RpcmVjdGl2ZXMvamFzbWluZS9qYXNtaW5lLmh0bWwnLFxuXHRcdGxpbmsgOiBmdW5jdGlvbiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJpYnV0ZSl7XG5cdFx0XHRzY29wZS4kd2F0Y2goJ3Rlc3QnLCBmdW5jdGlvbigpe1xuXHRcdFx0XHR3aW5kb3cuamFzbWluZSA9IG51bGw7XG5cdFx0XHRcdEphc21pbmVSZXBvcnRlci5pbml0aWFsaXplSmFzbWluZSgpO1xuXHRcdFx0XHRKYXNtaW5lUmVwb3J0ZXIuYWRkUmVwb3J0ZXIoc2NvcGUpO1xuXHRcdFx0fSk7XG5cblx0XHRcdHNjb3BlLiR3YXRjaCgnY29kZScsIGZ1bmN0aW9uKCl7XG5cdFx0XHRcdHdpbmRvdy5qYXNtaW5lID0gbnVsbDtcblx0XHRcdFx0SmFzbWluZVJlcG9ydGVyLmluaXRpYWxpemVKYXNtaW5lKCk7XG5cdFx0XHRcdEphc21pbmVSZXBvcnRlci5hZGRSZXBvcnRlcihzY29wZSk7XG5cdFx0XHR9KTtcblxuXHRcdFx0ZnVuY3Rpb24gZmxhdHRlblJlbW92ZUR1cGVzKGFyciwga2V5Q2hlY2spe1xuXHRcdFx0XHR2YXIgdHJhY2tlciA9IFtdO1xuXHRcdFx0XHRyZXR1cm4gd2luZG93Ll8uZmxhdHRlbihhcnIpLmZpbHRlcihmdW5jdGlvbihlbCl7XG5cdFx0XHRcdFx0aWYodHJhY2tlci5pbmRleE9mKGVsW2tleUNoZWNrXSkgPT0gLTEpe1xuXHRcdFx0XHRcdFx0dHJhY2tlci5wdXNoKGVsW2tleUNoZWNrXSk7XG5cdFx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblxuXHRcdFx0c2NvcGUuc3VtbWFyeVNob3dpbmcgPSB0cnVlO1xuXG5cdFx0XHRzY29wZS5zaG93U3VtbWFyeSA9IGZ1bmN0aW9uKCl7XG5cdFx0XHRcdGlmKCFzY29wZS5zdW1tYXJ5U2hvd2luZykgc2NvcGUuc3VtbWFyeVNob3dpbmcgPSAhc2NvcGUuc3VtbWFyeVNob3dpbmc7XG5cdFx0XHR9O1xuXHRcdFx0c2NvcGUuc2hvd0ZhaWx1cmVzID0gZnVuY3Rpb24oKXtcblx0XHRcdFx0aWYoc2NvcGUuc3VtbWFyeVNob3dpbmcpIHNjb3BlLnN1bW1hcnlTaG93aW5nID0gIXNjb3BlLnN1bW1hcnlTaG93aW5nO1xuXHRcdFx0fTtcblxuXG5cdFx0XHRzY29wZS4kd2F0Y2goJ3N1aXRlcycsIGZ1bmN0aW9uKCl7XG5cdFx0XHRcdGlmKHNjb3BlLnN1aXRlcyl7XG5cdFx0XHRcdFx0dmFyIHN1aXRlc1NwZWNzID0gc2NvcGUuc3VpdGVzLm1hcChmdW5jdGlvbihlbCl7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZWwuc3BlY3M7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0c2NvcGUuc3BlY3NPdmVydmlldyA9IGZsYXR0ZW5SZW1vdmVEdXBlcyhzdWl0ZXNTcGVjcywgXCJpZFwiKTtcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhzY29wZS5zcGVjc092ZXJ2aWV3KTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cblx0XHR9XG5cdH07XG59KTtcblxuYXBwLmZhY3RvcnkoJ0phc21pbmVSZXBvcnRlcicsIGZ1bmN0aW9uKCl7XG5cdGZ1bmN0aW9uIGluaXRpYWxpemVKYXNtaW5lKCl7XG5cdFx0Lypcblx0XHRDb3B5cmlnaHQgKGMpIDIwMDgtMjAxNSBQaXZvdGFsIExhYnNcblxuXHRcdFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZ1xuXHRcdGEgY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuXHRcdFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuXHRcdHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcblx0XHRkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG9cblx0XHRwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG9cblx0XHR0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG5cblx0XHRUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZVxuXHRcdGluY2x1ZGVkIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuXG5cdFx0VEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCxcblx0XHRFWFBSRVNTIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcblx0XHRNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORFxuXHRcdE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkVcblx0XHRMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OXG5cdFx0T0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OXG5cdFx0V0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cdFx0Ki9cblx0XHQvKipcblx0XHQgU3RhcnRpbmcgd2l0aCB2ZXJzaW9uIDIuMCwgdGhpcyBmaWxlIFwiYm9vdHNcIiBKYXNtaW5lLCBwZXJmb3JtaW5nIGFsbCBvZiB0aGUgbmVjZXNzYXJ5IGluaXRpYWxpemF0aW9uIGJlZm9yZSBleGVjdXRpbmcgdGhlIGxvYWRlZCBlbnZpcm9ubWVudCBhbmQgYWxsIG9mIGEgcHJvamVjdCdzIHNwZWNzLiBUaGlzIGZpbGUgc2hvdWxkIGJlIGxvYWRlZCBhZnRlciBgamFzbWluZS5qc2AgYW5kIGBqYXNtaW5lX2h0bWwuanNgLCBidXQgYmVmb3JlIGFueSBwcm9qZWN0IHNvdXJjZSBmaWxlcyBvciBzcGVjIGZpbGVzIGFyZSBsb2FkZWQuIFRodXMgdGhpcyBmaWxlIGNhbiBhbHNvIGJlIHVzZWQgdG8gY3VzdG9taXplIEphc21pbmUgZm9yIGEgcHJvamVjdC5cblxuXHRcdCBJZiBhIHByb2plY3QgaXMgdXNpbmcgSmFzbWluZSB2aWEgdGhlIHN0YW5kYWxvbmUgZGlzdHJpYnV0aW9uLCB0aGlzIGZpbGUgY2FuIGJlIGN1c3RvbWl6ZWQgZGlyZWN0bHkuIElmIGEgcHJvamVjdCBpcyB1c2luZyBKYXNtaW5lIHZpYSB0aGUgW1J1YnkgZ2VtXVtqYXNtaW5lLWdlbV0sIHRoaXMgZmlsZSBjYW4gYmUgY29waWVkIGludG8gdGhlIHN1cHBvcnQgZGlyZWN0b3J5IHZpYSBgamFzbWluZSBjb3B5X2Jvb3RfanNgLiBPdGhlciBlbnZpcm9ubWVudHMgKGUuZy4sIFB5dGhvbikgd2lsbCBoYXZlIGRpZmZlcmVudCBtZWNoYW5pc21zLlxuXG5cdFx0IFRoZSBsb2NhdGlvbiBvZiBgYm9vdC5qc2AgY2FuIGJlIHNwZWNpZmllZCBhbmQvb3Igb3ZlcnJpZGRlbiBpbiBgamFzbWluZS55bWxgLlxuXG5cdFx0IFtqYXNtaW5lLWdlbV06IGh0dHA6Ly9naXRodWIuY29tL3Bpdm90YWwvamFzbWluZS1nZW1cblx0XHQgKi9cblxuXHRcdChmdW5jdGlvbigpIHtcblx0XHQgIC8qKlxuXHRcdCAgICogIyMgUmVxdWlyZSAmYW1wOyBJbnN0YW50aWF0ZVxuXHRcdCAgICpcblx0XHQgICAqIFJlcXVpcmUgSmFzbWluZSdzIGNvcmUgZmlsZXMuIFNwZWNpZmljYWxseSwgdGhpcyByZXF1aXJlcyBhbmQgYXR0YWNoZXMgYWxsIG9mIEphc21pbmUncyBjb2RlIHRvIHRoZSBgamFzbWluZWAgcmVmZXJlbmNlLlxuXHRcdCAgICovXG5cdFx0ICB3aW5kb3cuamFzbWluZSA9IGphc21pbmVSZXF1aXJlLmNvcmUoamFzbWluZVJlcXVpcmUpO1xuXG5cdFx0ICAvKipcblx0XHQgICAqIFNpbmNlIHRoaXMgaXMgYmVpbmcgcnVuIGluIGEgYnJvd3NlciBhbmQgdGhlIHJlc3VsdHMgc2hvdWxkIHBvcHVsYXRlIHRvIGFuIEhUTUwgcGFnZSwgcmVxdWlyZSB0aGUgSFRNTC1zcGVjaWZpYyBKYXNtaW5lIGNvZGUsIGluamVjdGluZyB0aGUgc2FtZSByZWZlcmVuY2UuXG5cdFx0ICAgKi9cblx0XHQgIGphc21pbmVSZXF1aXJlLmh0bWwoamFzbWluZSk7XG5cblx0XHQgIC8qKlxuXHRcdCAgICogQ3JlYXRlIHRoZSBKYXNtaW5lIGVudmlyb25tZW50LiBUaGlzIGlzIHVzZWQgdG8gcnVuIGFsbCBzcGVjcyBpbiBhIHByb2plY3QuXG5cdFx0ICAgKi9cblx0XHQgIHZhciBlbnYgPSBqYXNtaW5lLmdldEVudigpO1xuXG5cdFx0ICAvKipcblx0XHQgICAqICMjIFRoZSBHbG9iYWwgSW50ZXJmYWNlXG5cdFx0ICAgKlxuXHRcdCAgICogQnVpbGQgdXAgdGhlIGZ1bmN0aW9ucyB0aGF0IHdpbGwgYmUgZXhwb3NlZCBhcyB0aGUgSmFzbWluZSBwdWJsaWMgaW50ZXJmYWNlLiBBIHByb2plY3QgY2FuIGN1c3RvbWl6ZSwgcmVuYW1lIG9yIGFsaWFzIGFueSBvZiB0aGVzZSBmdW5jdGlvbnMgYXMgZGVzaXJlZCwgcHJvdmlkZWQgdGhlIGltcGxlbWVudGF0aW9uIHJlbWFpbnMgdW5jaGFuZ2VkLlxuXHRcdCAgICovXG5cdFx0ICB2YXIgamFzbWluZUludGVyZmFjZSA9IGphc21pbmVSZXF1aXJlLmludGVyZmFjZShqYXNtaW5lLCBlbnYpO1xuXG5cdFx0ICAvKipcblx0XHQgICAqIEFkZCBhbGwgb2YgdGhlIEphc21pbmUgZ2xvYmFsL3B1YmxpYyBpbnRlcmZhY2UgdG8gdGhlIGdsb2JhbCBzY29wZSwgc28gYSBwcm9qZWN0IGNhbiB1c2UgdGhlIHB1YmxpYyBpbnRlcmZhY2UgZGlyZWN0bHkuIEZvciBleGFtcGxlLCBjYWxsaW5nIGBkZXNjcmliZWAgaW4gc3BlY3MgaW5zdGVhZCBvZiBgamFzbWluZS5nZXRFbnYoKS5kZXNjcmliZWAuXG5cdFx0ICAgKi9cblx0XHQgIGV4dGVuZCh3aW5kb3csIGphc21pbmVJbnRlcmZhY2UpO1xuXG5cdFx0ICAvKipcblx0XHQgICAqICMjIFJ1bm5lciBQYXJhbWV0ZXJzXG5cdFx0ICAgKlxuXHRcdCAgICogTW9yZSBicm93c2VyIHNwZWNpZmljIGNvZGUgLSB3cmFwIHRoZSBxdWVyeSBzdHJpbmcgaW4gYW4gb2JqZWN0IGFuZCB0byBhbGxvdyBmb3IgZ2V0dGluZy9zZXR0aW5nIHBhcmFtZXRlcnMgZnJvbSB0aGUgcnVubmVyIHVzZXIgaW50ZXJmYWNlLlxuXHRcdCAgICovXG5cblx0XHQgIHZhciBxdWVyeVN0cmluZyA9IG5ldyBqYXNtaW5lLlF1ZXJ5U3RyaW5nKHtcblx0XHQgICAgZ2V0V2luZG93TG9jYXRpb246IGZ1bmN0aW9uKCkgeyByZXR1cm4gd2luZG93LmxvY2F0aW9uOyB9XG5cdFx0ICB9KTtcblxuXHRcdCAgdmFyIGNhdGNoaW5nRXhjZXB0aW9ucyA9IHF1ZXJ5U3RyaW5nLmdldFBhcmFtKFwiY2F0Y2hcIik7XG5cdFx0ICBlbnYuY2F0Y2hFeGNlcHRpb25zKHR5cGVvZiBjYXRjaGluZ0V4Y2VwdGlvbnMgPT09IFwidW5kZWZpbmVkXCIgPyB0cnVlIDogY2F0Y2hpbmdFeGNlcHRpb25zKTtcblxuXHRcdCAgdmFyIHRocm93aW5nRXhwZWN0YXRpb25GYWlsdXJlcyA9IHF1ZXJ5U3RyaW5nLmdldFBhcmFtKFwidGhyb3dGYWlsdXJlc1wiKTtcblx0XHQgIGVudi50aHJvd09uRXhwZWN0YXRpb25GYWlsdXJlKHRocm93aW5nRXhwZWN0YXRpb25GYWlsdXJlcyk7XG5cblx0XHQgIC8qKlxuXHRcdCAgICogVGhlIGBqc0FwaVJlcG9ydGVyYCBhbHNvIHJlY2VpdmVzIHNwZWMgcmVzdWx0cywgYW5kIGlzIHVzZWQgYnkgYW55IGVudmlyb25tZW50IHRoYXQgbmVlZHMgdG8gZXh0cmFjdCB0aGUgcmVzdWx0cyAgZnJvbSBKYXZhU2NyaXB0LlxuXHRcdCAgICovXG5cdFx0ICBlbnYuYWRkUmVwb3J0ZXIoamFzbWluZUludGVyZmFjZS5qc0FwaVJlcG9ydGVyKTtcblxuXHRcdCAgLyoqXG5cdFx0ICAgKiBGaWx0ZXIgd2hpY2ggc3BlY3Mgd2lsbCBiZSBydW4gYnkgbWF0Y2hpbmcgdGhlIHN0YXJ0IG9mIHRoZSBmdWxsIG5hbWUgYWdhaW5zdCB0aGUgYHNwZWNgIHF1ZXJ5IHBhcmFtLlxuXHRcdCAgICovXG5cdFx0ICB2YXIgc3BlY0ZpbHRlciA9IG5ldyBqYXNtaW5lLkh0bWxTcGVjRmlsdGVyKHtcblx0XHQgICAgZmlsdGVyU3RyaW5nOiBmdW5jdGlvbigpIHsgcmV0dXJuIHF1ZXJ5U3RyaW5nLmdldFBhcmFtKFwic3BlY1wiKTsgfVxuXHRcdCAgfSk7XG5cblx0XHQgIGVudi5zcGVjRmlsdGVyID0gZnVuY3Rpb24oc3BlYykge1xuXHRcdCAgICByZXR1cm4gc3BlY0ZpbHRlci5tYXRjaGVzKHNwZWMuZ2V0RnVsbE5hbWUoKSk7XG5cdFx0ICB9O1xuXG5cdFx0ICAvKipcblx0XHQgICAqIFNldHRpbmcgdXAgdGltaW5nIGZ1bmN0aW9ucyB0byBiZSBhYmxlIHRvIGJlIG92ZXJyaWRkZW4uIENlcnRhaW4gYnJvd3NlcnMgKFNhZmFyaSwgSUUgOCwgcGhhbnRvbWpzKSByZXF1aXJlIHRoaXMgaGFjay5cblx0XHQgICAqL1xuXHRcdCAgd2luZG93LnNldFRpbWVvdXQgPSB3aW5kb3cuc2V0VGltZW91dDtcblx0XHQgIHdpbmRvdy5zZXRJbnRlcnZhbCA9IHdpbmRvdy5zZXRJbnRlcnZhbDtcblx0XHQgIHdpbmRvdy5jbGVhclRpbWVvdXQgPSB3aW5kb3cuY2xlYXJUaW1lb3V0O1xuXHRcdCAgd2luZG93LmNsZWFySW50ZXJ2YWwgPSB3aW5kb3cuY2xlYXJJbnRlcnZhbDtcblxuXHRcdCAgLyoqXG5cdFx0ICAgKiAjIyBFeGVjdXRpb25cblx0XHQgICAqXG5cdFx0ICAgKiBSZXBsYWNlIHRoZSBicm93c2VyIHdpbmRvdydzIGBvbmxvYWRgLCBlbnN1cmUgaXQncyBjYWxsZWQsIGFuZCB0aGVuIHJ1biBhbGwgb2YgdGhlIGxvYWRlZCBzcGVjcy4gVGhpcyBpbmNsdWRlcyBpbml0aWFsaXppbmcgdGhlIGBIdG1sUmVwb3J0ZXJgIGluc3RhbmNlIGFuZCB0aGVuIGV4ZWN1dGluZyB0aGUgbG9hZGVkIEphc21pbmUgZW52aXJvbm1lbnQuIEFsbCBvZiB0aGlzIHdpbGwgaGFwcGVuIGFmdGVyIGFsbCBvZiB0aGUgc3BlY3MgYXJlIGxvYWRlZC5cblx0XHQgICAqL1xuXHRcdCAgdmFyIGN1cnJlbnRXaW5kb3dPbmxvYWQgPSB3aW5kb3cub25sb2FkO1xuXG5cdFx0ICAoZnVuY3Rpb24oKSB7XG5cdFx0ICAgIGlmIChjdXJyZW50V2luZG93T25sb2FkKSB7XG5cdFx0ICAgICAgY3VycmVudFdpbmRvd09ubG9hZCgpO1xuXHRcdCAgICB9XG5cdFx0ICAgIGVudi5leGVjdXRlKCk7XG5cdFx0ICB9KSgpO1xuXG5cdFx0ICAvKipcblx0XHQgICAqIEhlbHBlciBmdW5jdGlvbiBmb3IgcmVhZGFiaWxpdHkgYWJvdmUuXG5cdFx0ICAgKi9cblx0XHQgIGZ1bmN0aW9uIGV4dGVuZChkZXN0aW5hdGlvbiwgc291cmNlKSB7XG5cdFx0ICAgIGZvciAodmFyIHByb3BlcnR5IGluIHNvdXJjZSkgZGVzdGluYXRpb25bcHJvcGVydHldID0gc291cmNlW3Byb3BlcnR5XTtcblx0XHQgICAgcmV0dXJuIGRlc3RpbmF0aW9uO1xuXHRcdCAgfVxuXG5cdFx0fSkoKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGFkZFJlcG9ydGVyKHNjb3BlKXtcblx0XHR2YXIgc3VpdGVzID0gW107XG5cdFx0dmFyIGN1cnJlbnRTdWl0ZSA9IHt9O1xuXG5cdFx0ZnVuY3Rpb24gU3VpdGUob2JqKXtcblx0XHRcdHRoaXMuaWQgPSBvYmouaWQ7XG5cdFx0XHR0aGlzLmRlc2NyaXB0aW9uID0gb2JqLmRlc2NyaXB0aW9uO1xuXHRcdFx0dGhpcy5mdWxsTmFtZSA9IG9iai5mdWxsTmFtZTtcblx0XHRcdHRoaXMuZmFpbGVkRXhwZWN0YXRpb25zID0gb2JqLmZhaWxlZEV4cGVjdGF0aW9ucztcblx0XHRcdHRoaXMuc3RhdHVzID0gb2JqLmZpbmlzaGVkO1xuXHRcdFx0dGhpcy5zcGVjcyA9IFtdO1xuXHRcdH1cblxuXHRcdHZhciBteVJlcG9ydGVyID0ge1xuXG5cdFx0XHRqYXNtaW5lU3RhcnRlZDogZnVuY3Rpb24ob3B0aW9ucyl7XG5cdFx0XHRcdHN1aXRlcyA9IFtdO1xuXHRcdFx0fSxcblx0XHRcdHN1aXRlU3RhcnRlZDogZnVuY3Rpb24oc3VpdGUpe1xuXHRcdFx0XHRjdXJyZW50U3VpdGUgPSBuZXcgU3VpdGUoc3VpdGUpO1xuXHRcdFx0fSxcblx0XHRcdHNwZWNTdGFydGVkOiBmdW5jdGlvbihzcGVjKXtcblx0XHRcdFx0c2NvcGUuc3BlY1N0YXJ0ZWQgPSBzcGVjO1xuXHRcdFx0fSxcblx0XHRcdHNwZWNEb25lOiBmdW5jdGlvbihzcGVjKXtcblx0XHRcdFx0Y3VycmVudFN1aXRlLnNwZWNzLnB1c2goc3BlYyk7XG5cdFx0XHR9LFxuXHRcdFx0c3VpdGVEb25lOiBmdW5jdGlvbihzdWl0ZSl7XG5cdFx0XHRcdHN1aXRlcy5wdXNoKGN1cnJlbnRTdWl0ZSk7XG5cdFx0XHR9LFxuXHRcdFx0amFzbWluZURvbmU6IGZ1bmN0aW9uKCl7XG5cdFx0XHRcdHNjb3BlLnN1aXRlcyA9IHN1aXRlcztcblx0XHRcdH1cblx0XHR9O1xuXG5cdFx0d2luZG93Lmphc21pbmUuZ2V0RW52KCkuYWRkUmVwb3J0ZXIobXlSZXBvcnRlcik7XG5cdH1cblxuXHRyZXR1cm4ge1xuXHRcdGluaXRpYWxpemVKYXNtaW5lIDogaW5pdGlhbGl6ZUphc21pbmUsXG5cdFx0YWRkUmVwb3J0ZXI6IGFkZFJlcG9ydGVyXG5cdH07XG59KTsiLCJhcHAuZGlyZWN0aXZlKCdqc2xvYWQnLCBmdW5jdGlvbigpe1xuXHRmdW5jdGlvbiB1cGRhdGVTY3JpcHQoZWxlbWVudCwgdGV4dCl7XG5cdFx0ZWxlbWVudC5lbXB0eSgpO1xuXHRcdHZhciBzY3JpcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcblx0XHRzY3JpcHQudHlwZSA9ICd0ZXh0L2phdmFzY3JpcHQnO1xuXHRcdHNjcmlwdC5pbm5lckhUTUwgPSB0ZXh0O1xuXHRcdGVsZW1lbnQuYXBwZW5kKHNjcmlwdCk7XG5cdH1cblx0cmV0dXJuIHtcblx0XHRyZXN0cmljdCA6ICdFJyxcblx0XHRzY29wZSA6IHtcblx0XHRcdHRleHQgOiAnPSdcblx0XHR9LFxuXHRcdGxpbmsgOiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cmlidXRlcyl7XG5cdFx0XHRzY29wZS4kd2F0Y2goJ3RleHQnLCBmdW5jdGlvbih0ZXh0KXtcblx0XHRcdFx0dXBkYXRlU2NyaXB0KGVsZW1lbnQsIHRleHQpO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHR9O1xufSk7XG5cbiIsImFwcC5kaXJlY3RpdmUoJ3NoYXJlJyxmdW5jdGlvbihHaXN0RmFjdG9yeSwgJGlvbmljUG9wb3ZlciwgRnJpZW5kc0ZhY3Rvcnkpe1xuICAgcmV0dXJuIHtcbiAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgIHRlbXBsYXRlVXJsOidmZWF0dXJlcy9jb21tb24vZGlyZWN0aXZlcy9zaGFyZS9zaGFyZS5odG1sJyxcbiAgICAgICBsaW5rOiBmdW5jdGlvbigkc2NvcGUsIGVsZW1lbnQsIGF0dHJpYnV0ZXMpe1xuICAgICAgICAgICAvLyAuZnJvbVRlbXBsYXRlVXJsKCkgbWV0aG9kXG5cbiAgICAgICAgICAgLy9UT0RPOiBDbGVhbnVwIEdpc3RGYWN0b3J5LnNoYXJlR2lzdChjb2RlLCRzY29wZS5kYXRhLmZyaWVuZHMpLnRoZW4oZ2lzdFNoYXJlZCk7XG5cbiAgICAgICAgICAgRnJpZW5kc0ZhY3RvcnkuZ2V0RnJpZW5kcygpLnRoZW4oYWRkRnJpZW5kcyk7XG4gICAgICAgICAgICRzY29wZS5kYXRhID0gW107XG4gICAgICAgICAgICRzY29wZS5pc0NoZWNrZWQgPSBbXTtcbiAgICAgICAgICAgZnVuY3Rpb24gYWRkRnJpZW5kcyhyZXNwb25zZSl7XG4gICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdhZGRGcmllbmRzJyxyZXNwb25zZS5kYXRhLmZyaWVuZHMpO1xuICAgICAgICAgICAgICAgJHNjb3BlLmRhdGEuZnJpZW5kcyA9IHJlc3BvbnNlLmRhdGEuZnJpZW5kcztcbiAgICAgICAgICAgfTtcblxuICAgICAgICAgICAvLyRzY29wZS4kd2F0Y2goJ2lzQ2hlY2tlZCcsZnVuY3Rpb24oKXtcbiAgICAgICAgICAgLy9cdGNvbnNvbGUubG9nKCRzY29wZS5pc0NoZWNrZWQpO1xuICAgICAgICAgICAvL30pO1xuICAgICAgICAgICAvL1RPRE86IENvbmZpcm0gdGhhdCB0aGlzIGlzIHdvcmtpbmcgaW4gYWxsIHNjZW5hcmlvc1xuICAgICAgICAgICAkc2NvcGUuc2VuZCA9IGZ1bmN0aW9uKGNvZGUpe1xuICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZygnIUA/IUAjJyxjb2RlKTtcbiAgICAgICAgICAgICAgIEdpc3RGYWN0b3J5LnNoYXJlR2lzdCgkc2NvcGUuY29kZSxPYmplY3Qua2V5cygkc2NvcGUuaXNDaGVja2VkKSkudGhlbihnaXN0U2hhcmVkKTtcbiAgICAgICAgICAgfTtcblxuICAgICAgICAgICAkaW9uaWNQb3BvdmVyLmZyb21UZW1wbGF0ZVVybCgnZmVhdHVyZXMvY29tbW9uL2RpcmVjdGl2ZXMvc2hhcmUvZnJpZW5kcy5odG1sJywge1xuICAgICAgICAgICAgICAgc2NvcGU6ICRzY29wZVxuICAgICAgICAgICB9KS50aGVuKGZ1bmN0aW9uKHBvcG92ZXIpIHtcbiAgICAgICAgICAgICAgICRzY29wZS5wb3BvdmVyID0gcG9wb3ZlcjtcbiAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgJHNjb3BlLm9wZW5Qb3BvdmVyID0gZnVuY3Rpb24oJGV2ZW50KSB7XG4gICAgICAgICAgICAgICAkc2NvcGUucG9wb3Zlci5zaG93KCRldmVudCk7XG4gICAgICAgICAgIH07XG4gICAgICAgICAgICRzY29wZS5jbG9zZVBvcG92ZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICRzY29wZS5wb3BvdmVyLmhpZGUoKTtcbiAgICAgICAgICAgfTtcbiAgICAgICAgICAgLy9DbGVhbnVwIHRoZSBwb3BvdmVyIHdoZW4gd2UncmUgZG9uZSB3aXRoIGl0IVxuICAgICAgICAgICAkc2NvcGUuJG9uKCckZGVzdHJveScsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgJHNjb3BlLnBvcG92ZXIucmVtb3ZlKCk7XG4gICAgICAgICAgIH0pO1xuICAgICAgICAgICAvLyBFeGVjdXRlIGFjdGlvbiBvbiBoaWRlIHBvcG92ZXJcbiAgICAgICAgICAgJHNjb3BlLiRvbigncG9wb3Zlci5oaWRkZW4nLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgIC8vIEV4ZWN1dGUgYWN0aW9uXG4gICAgICAgICAgIH0pO1xuICAgICAgICAgICAvLyBFeGVjdXRlIGFjdGlvbiBvbiByZW1vdmUgcG9wb3ZlclxuICAgICAgICAgICAkc2NvcGUuJG9uKCdwb3BvdmVyLnJlbW92ZWQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgIC8vIEV4ZWN1dGUgYWN0aW9uXG4gICAgICAgICAgIH0pO1xuICAgICAgICAgICAvL307XG4gICAgICAgICAgIGdpc3RTaGFyZWQgPSBmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgICAgICAgICAgICBjb25zb2xlLmxvZygnZ2lzdCBzaGFyZWQnLHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICRzY29wZS5jbG9zZVBvcG92ZXIoKTtcbiAgICAgICAgICAgfTtcbiAgICAgICB9XG4gICB9XG59KTtcbiIsImFwcC5mYWN0b3J5KCdHaXN0RmFjdG9yeScsZnVuY3Rpb24oJGh0dHAsJHEsQXBpRW5kcG9pbnQpe1xuXG4gICAgLy9UT0RPOiBoYW5kbGluZyBmb3IgbXVsdGlwbGUgZnJpZW5kcyAoYWZ0ZXIgdGVzdGluZyBvbmUgZnJpZW5kIHdvcmtzKVxuICAgIC8vVE9ETzogRnJpZW5kIGFuZCBjb2RlIG11c3QgYmUgcHJlc2VudFxuICAgIC8vVE9ETzogZnJpZW5kcyBpcyBhbiBhcnJheSBvZiBmcmllbmQgTW9uZ28gSURzXG5cbiAgICAvL1RPRE86IFNoYXJlIGRlc2NyaXB0aW9uIGFuZCBmaWxlbmFtZSBiYXNlZCBvbiBjaGFsbGVuZ2UgZm9yIGV4YW1wbGVcbiAgICAvL1RPRE86T3IgZ2l2ZSB0aGUgdXNlciBvcHRpb25zIG9mIHdoYXQgdG8gZmlsbCBpblxuICAgIGZ1bmN0aW9uIHNoYXJlR2lzdChjb2RlLGZyaWVuZHMsZGVzY3JpcHRpb24sZmlsZU5hbWUpe1xuICAgICAgICBjb25zb2xlLmxvZygnY29kZScsY29kZSk7XG4gICAgICAgIHJldHVybiAkaHR0cC5wb3N0KEFwaUVuZHBvaW50LnVybCArICcvZ2lzdHMvc2hhcmVHaXN0cycsXG4gICAgICAgICAgICB7Z2lzdCA6IHtcbiAgICAgICAgICAgICAgICBjb2RlOmNvZGV8fFwibm8gY29kZSBlbnRlcmVkXCIsXG4gICAgICAgICAgICAgICAgZnJpZW5kczpmcmllbmRzfHwgXCI1NTViNjIzZGZhOWE2NWE0M2U5ZWM2ZDZcIixcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjpkZXNjcmlwdGlvbiB8fCAnbm8gZGVzY3JpcHRpb24nLFxuICAgICAgICAgICAgICAgIGZpbGVOYW1lOmZpbGVOYW1lK1wiLmpzXCIgfHwgJ25vIGZpbGUgbmFtZSdcbiAgICAgICAgICAgIH19KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBxdWV1ZWRHaXN0cygpe1xuICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KEFwaUVuZHBvaW50LnVybCArICcvZ2lzdHMvZ2lzdHNRdWV1ZScpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNyZWF0ZWRHaXN0cygpe1xuICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KEFwaUVuZHBvaW50LnVybCArICcvZ2lzdHMvY3JlYXRlZEdpc3RzJylcbiAgICB9XG5cbiAgICByZXR1cm57XG4gICAgICAgIHNoYXJlR2lzdDogc2hhcmVHaXN0LFxuICAgICAgICBxdWV1ZWRHaXN0czogcXVldWVkR2lzdHMsIC8vcHVzaCBub3RpZmljYXRpb25zXG4gICAgICAgIGNyZWF0ZWRHaXN0czogY3JlYXRlZEdpc3RzXG4gICB9XG59KTsiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=