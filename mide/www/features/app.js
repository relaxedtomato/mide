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

<<<<<<< HEAD
	var authReq = !false; //TODO: Toggle for using authentication work flow - require backend wired up
=======
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
>>>>>>> development

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImFib3V0L2Fib3V0LmpzIiwiYWNjb3VudC9hY2NvdW50LmpzIiwiZXhlcmNpc2UvZXhlcmNpc2UuanMiLCJleGVyY2lzZS1jb2RlL2V4ZXJjaXNlLWNvZGUuanMiLCJleGVyY2lzZS1jb21waWxlL2V4ZXJjaXNlLWNvbXBpbGUuanMiLCJleGVyY2lzZS10ZXN0L2V4ZXJjaXNlLXRlc3QuanMiLCJleGVyY2lzZS12aWV3L2V4ZXJjaXNlLXZpZXcuanMiLCJleGVyY2lzZS12aWV3LWVkaXQvZXhlcmNpc2Utdmlldy1lZGl0LmpzIiwiZXhlcmNpc2VzL2V4ZXJjaXNlcy5qcyIsImV4ZXJjaXNlcy1jcmVhdGUvZXhlcmNpc2VzLWNyZWF0ZS5qcyIsImV4ZXJjaXNtL2V4ZXJjaXNtLmpzIiwiZXhlcmNpc20tY29kZS9leGVyY2lzbS1jb2RlLmpzIiwiZXhlcmNpc20tY29tcGlsZS9leGVyY2lzbS1jb21waWxlLmpzIiwiZXhlcmNpc20tdGVzdC9leGVyY2lzbS10ZXN0LmpzIiwiZXhlcmNpc20tdmlldy9leGVyY2lzbS12aWV3LmpzIiwiZnJpZW5kcy9mcmllbmRzLmpzIiwibG9naW4vbG9naW4uanMiLCJzYW5kYm94L3NhbmRib3guanMiLCJzYW5kYm94LWNvZGUvc2FuZGJveC1jb2RlLmpzIiwic2FuZGJveC1jb21waWxlL3NhbmRib3gtY29tcGlsZS5qcyIsInNpZ251cC9zaWdudXAuanMiLCJzbmlwcGV0LWVkaXQvc25pcHBldC1lZGl0LmpzIiwic25pcHBldHMvc25pcHBldHMuanMiLCJzbmlwcGV0cy1jcmVhdGUvc25pcHBldHMtY3JlYXRlLmpzIiwid2VsY29tZS93ZWxjb21lLmpzIiwiY29tbW9uL0F1dGhlbnRpY2F0aW9uL2F1dGhlbnRpY2F0aW9uLmpzIiwiY29tbW9uL2ZhY3Rvcmllcy9LZXlib2FyZEZhY3RvcnkuanMiLCJjb21tb24vZmFjdG9yaWVzL2NvZGVTbmlwcGV0RmFjdG9yeS5qcyIsImNvbW1vbi9maWx0ZXJzL2FwcGVuZC5qcyIsImNvbW1vbi9maWx0ZXJzL2Jvb2wuanMiLCJjb21tb24vZmlsdGVycy9leGVyY2lzbS1mb3JtYXQtbmFtZS5qcyIsImNvbW1vbi9maWx0ZXJzL2xlbmd0aC5qcyIsImNvbW1vbi9maWx0ZXJzL21hcmtlZC5qcyIsImNvbW1vbi9sb2NhbFN0b3JhZ2UvbG9jYWxzdG9yYWdlLmpzIiwiY29tbW9uL21vZHVsZXMvaW9uaWMudXRpbHMuanMiLCJjb21tb24vZGlyZWN0aXZlcy9jb2RlbWlycm9yLWVkaXQvY29kZW1pcnJvci1lZGl0LmpzIiwiY29tbW9uL2RpcmVjdGl2ZXMvY29kZWtleWJvYXJkYmFyL2NvZGVrZXlib2FyZGJhci5qcyIsImNvbW1vbi9kaXJlY3RpdmVzL2NvZGVrZXlib2FyZGJhci9zbmlwcGV0YnV0dG9ucy5qcyIsImNvbW1vbi9kaXJlY3RpdmVzL2NvZGVtaXJyb3ItcmVhZC9jb2RlbWlycm9yLXJlYWQuanMiLCJjb21tb24vZGlyZWN0aXZlcy9qYXNtaW5lL2phc21pbmUuanMiLCJjb21tb24vZGlyZWN0aXZlcy9qcy1sb2FkL2pzLWxvYWQuanMiLCJjb21tb24vZGlyZWN0aXZlcy9zaGFyZS9zaGFyZS5qcyIsImNvbW1vbi9mYWN0b3J5L2dpc3QvZ2lzdC5mYWN0b3J5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6S0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDekNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDekhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaFBBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDL0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6SkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBJb25pYyBTdGFydGVyIEFwcFxuXG4vLyBhbmd1bGFyLm1vZHVsZSBpcyBhIGdsb2JhbCBwbGFjZSBmb3IgY3JlYXRpbmcsIHJlZ2lzdGVyaW5nIGFuZCByZXRyaWV2aW5nIEFuZ3VsYXIgbW9kdWxlc1xuLy8gJ3N0YXJ0ZXInIGlzIHRoZSBuYW1lIG9mIHRoaXMgYW5ndWxhciBtb2R1bGUgZXhhbXBsZSAoYWxzbyBzZXQgaW4gYSA8Ym9keT4gYXR0cmlidXRlIGluIGluZGV4Lmh0bWwpXG4vLyB0aGUgMm5kIHBhcmFtZXRlciBpcyBhbiBhcnJheSBvZiAncmVxdWlyZXMnXG4vLyAnc3RhcnRlci5zZXJ2aWNlcycgaXMgZm91bmQgaW4gc2VydmljZXMuanNcbi8vICdzdGFydGVyLmNvbnRyb2xsZXJzJyBpcyBmb3VuZCBpbiBjb250cm9sbGVycy5qc1xudmFyIGFwcCA9IGFuZ3VsYXIubW9kdWxlKCdtaWRlJywgWydpb25pYycsICdpb25pYy51dGlscycsICduZ0NvcmRvdmEnXSlcblxuLnJ1bihmdW5jdGlvbigkaW9uaWNQbGF0Zm9ybSkge1xuICAkaW9uaWNQbGF0Zm9ybS5yZWFkeShmdW5jdGlvbigpIHtcbiAgICAvLyBIaWRlIHRoZSBhY2Nlc3NvcnkgYmFyIGJ5IGRlZmF1bHQgKHJlbW92ZSB0aGlzIHRvIHNob3cgdGhlIGFjY2Vzc29yeSBiYXIgYWJvdmUgdGhlIGtleWJvYXJkXG4gICAgLy8gZm9yIGZvcm0gaW5wdXRzKVxuICAgIC8vICRsb2NhdGlvblByb3ZpZGVyLmh0bWw1TW9kZSh0cnVlKTtcbiAgICBpZiAod2luZG93LmNvcmRvdmEgJiYgd2luZG93LmNvcmRvdmEucGx1Z2lucyAmJiB3aW5kb3cuY29yZG92YS5wbHVnaW5zLktleWJvYXJkKSB7XG5cbiAgICAgIGNvcmRvdmEucGx1Z2lucy5LZXlib2FyZC5oaWRlS2V5Ym9hcmRBY2Nlc3NvcnlCYXIodHJ1ZSk7XG4gICAgICBjb3Jkb3ZhLnBsdWdpbnMuS2V5Ym9hcmQuZGlzYWJsZVNjcm9sbCh0cnVlKTtcbiAgICB9XG4gICAgaWYgKHdpbmRvdy5TdGF0dXNCYXIpIHtcbiAgICAgIC8vIG9yZy5hcGFjaGUuY29yZG92YS5zdGF0dXNiYXIgcmVxdWlyZWRcbiAgICAgIFN0YXR1c0Jhci5zdHlsZUxpZ2h0Q29udGVudCgpO1xuICAgIH1cbiAgfSk7XG59KVxuXG4vL1RPRE86VGhpcyBpcyBuZWVkZWQgdG8gc2V0IHRvIGFjY2VzcyB0aGUgcHJveHkgdXJsIHRoYXQgd2lsbCB0aGVuIGluIHRoZSBpb25pYy5wcm9qZWN0IGZpbGUgcmVkaXJlY3QgaXQgdG8gdGhlIGNvcnJlY3QgVVJMXG4uY29uc3RhbnQoJ0FwaUVuZHBvaW50Jywge1xuICB1cmwgOiAnaHR0cDovL2xvY2FsaG9zdDo5MDAwL2FwaSdcbn0pXG5cbi8vVE9ETzonaHR0cHM6Ly9wcm90ZWN0ZWQtcmVhY2hlcy01OTQ2Lmhlcm9rdWFwcC5jb20vYXBpJyAtIERlcGxveSBsYXRlc3Qgc2VydmVyIGJlZm9yZSByZXBsYWNpbmdcblxuLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyKSB7XG4gIC8vIElvbmljIHVzZXMgQW5ndWxhclVJIFJvdXRlciB3aGljaCB1c2VzIHRoZSBjb25jZXB0IG9mIHN0YXRlc1xuICAvLyBMZWFybiBtb3JlIGhlcmU6IGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyLXVpL3VpLXJvdXRlclxuICAvLyBTZXQgdXAgdGhlIHZhcmlvdXMgc3RhdGVzIHdoaWNoIHRoZSBhcHAgY2FuIGJlIGluLlxuICAvLyBFYWNoIHN0YXRlJ3MgY29udHJvbGxlciBjYW4gYmUgZm91bmQgaW4gY29udHJvbGxlcnMuanNcbiAgLy8gaWYgbm9uZSBvZiB0aGUgYWJvdmUgc3RhdGVzIGFyZSBtYXRjaGVkLCB1c2UgdGhpcyBhcyB0aGUgZmFsbGJhY2tcbiAgLy8gJHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZSgnL2NoYWxsZW5nZS92aWV3Jyk7IC8vVE9ETzogQWxiZXJ0IHRlc3RpbmcgdGhpcyByb3V0ZVxuICAvLyR1cmxSb3V0ZXJQcm92aWRlci5vdGhlcndpc2UoJy9zbmlwcGV0cy9jcmVhdGUnKTsgLy8gVE9ETzogUmljaGFyZCB0ZXN0aW5nIHRoaXMgcm91dGVcbiAgJHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZSgnL3dlbGNvbWUnKTsgLy8gVE9ETzogUmljaGFyZCB0ZXN0aW5nIHRoaXMgcm91dGVcbiAgLy8kdXJsUm91dGVyUHJvdmlkZXIub3RoZXJ3aXNlKCdjaGFsbGVuZ2UudmlldycpOyAvL1RPRE86IFRvbnkgdGVzdGluZyB0aGlzIHJvdXRlXG4gIC8vICR1cmxSb3V0ZXJQcm92aWRlci5vdGhlcndpc2UoJ3dlbGNvbWUnKTtcblxufSlcbi8vXG5cbi8vLy9ydW4gYmxvY2tzOiBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzIwNjYzMDc2L2FuZ3VsYXJqcy1hcHAtcnVuLWRvY3VtZW50YXRpb25cbi8vVXNlIHJ1biBtZXRob2QgdG8gcmVnaXN0ZXIgd29yayB3aGljaCBzaG91bGQgYmUgcGVyZm9ybWVkIHdoZW4gdGhlIGluamVjdG9yIGlzIGRvbmUgbG9hZGluZyBhbGwgbW9kdWxlcy5cbi8vaHR0cDovL2RldmRhY3RpYy5jb20vdXNlci1hdXRoLWFuZ3VsYXJqcy1pb25pYy9cblxuLnJ1bihmdW5jdGlvbiAoJHJvb3RTY29wZSwgJHN0YXRlLCBBdXRoU2VydmljZSwgQVVUSF9FVkVOVFMsIExvY2FsU3RvcmFnZSkge1xuXG4gICAgdmFyIGRlc3RpbmF0aW9uU3RhdGVSZXF1aXJlc0F1dGggPSBmdW5jdGlvbiAoc3RhdGUpIHtcbiAgICAgICAgLy9jb25zb2xlLmxvZygnY2wgLSBkZXN0aW5hdGlvblN0YXRlUmVxdWlyZXNBdXRoJywnc3RhdGUuZGF0YScsc3RhdGUuZGF0YSwnc3RhdGUuZGF0YS5hdXRoJyxzdGF0ZS5kYXRhLmF1dGhlbnRpY2F0ZSk7XG4gICAgICAgIHJldHVybiBzdGF0ZS5kYXRhICYmIHN0YXRlLmRhdGEuYXV0aGVudGljYXRlO1xuICAgIH07XG4gICBcbiAgICAvL1RPRE86IE5lZWQgdG8gbWFrZSBhdXRoZW50aWNhdGlvbiBtb3JlIHJvYnVzdCBiZWxvdyBkb2VzIG5vdCBmb2xsb3cgRlNHIChldC4gYWwuKVxuICAgIC8vVE9ETzogQ3VycmVudGx5IGl0IGlzIG5vdCBjaGVja2luZyB0aGUgYmFja2VuZCByb3V0ZSByb3V0ZXIuZ2V0KCcvdG9rZW4nKVxuICAgICRyb290U2NvcGUuJG9uKCckc3RhdGVDaGFuZ2VTdGFydCcsIGZ1bmN0aW9uIChldmVudCx0b1N0YXRlLCB0b1BhcmFtcykge1xuXG4gICAgICAgIC8vY29uc29sZS5sb2coJ3VzZXIgQXV0aGVudGljYXRlZCcsIEF1dGhTZXJ2aWNlLmlzQXV0aGVudGljYXRlZCgpKTtcblxuICAgICAgICBpZiAoIWRlc3RpbmF0aW9uU3RhdGVSZXF1aXJlc0F1dGgodG9TdGF0ZSkpIHtcbiAgICAgICAgICAgIC8vIFRoZSBkZXN0aW5hdGlvbiBzdGF0ZSBkb2VzIG5vdCByZXF1aXJlIGF1dGhlbnRpY2F0aW9uXG4gICAgICAgICAgICAvLyBTaG9ydCBjaXJjdWl0IHdpdGggcmV0dXJuLlxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKEF1dGhTZXJ2aWNlLmlzQXV0aGVudGljYXRlZCgpKSB7XG4gICAgICAgICAgICAvLyBUaGUgdXNlciBpcyBhdXRoZW50aWNhdGVkLlxuICAgICAgICAgICAgLy8gU2hvcnQgY2lyY3VpdCB3aXRoIHJldHVybi5cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vVE9ETzogTm90IHN1cmUgaG93IHRvIHByb2NlZWQgaGVyZVxuICAgICAgICAkc3RhdGUuZ28oJ2xvZ2luJyk7IC8vaWYgYWJvdmUgZmFpbHMsIGdvdG8gbG9naW5cbiAgICB9KTtcbiAgLy8gJHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZSgnL3NpZ251cCcpOyAvLyBUT0RPOiBSaWNoYXJkIHRlc3RpbmcgdGhpcyByb3V0ZVxuICAvLyR1cmxSb3V0ZXJQcm92aWRlci5vdGhlcndpc2UoJy9jaGFsbGVuZ2UvdmlldycpOyAvL1RPRE86IFRvbnkgdGVzdGluZyB0aGlzIHJvdXRlXG5cbn0pO1xuXG5hcHAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKXtcbiAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdtYWluJywge1xuICAgICAgIHRlbXBsYXRlVXJsOiAnZmVhdHVyZXMvY29tbW9uL21haW4vbWFpbi5odG1sJyxcbiAgICAgICBjb250cm9sbGVyOiAnTWVudUN0cmwnXG4gICB9KTtcbn0pO1xuXG5hcHAuY29udHJvbGxlcignTWFpbkN0cmwnLCBmdW5jdGlvbigkcm9vdFNjb3BlLCRzY29wZSwgJGlvbmljU2lkZU1lbnVEZWxlZ2F0ZSwgJGlvbmljUG9wdXAsICRzdGF0ZSwgQXV0aFNlcnZpY2UsQVVUSF9FVkVOVFMpe1xuICAgICRzY29wZS51c2VybmFtZSA9IEF1dGhTZXJ2aWNlLnVzZXJuYW1lKCk7XG4gICAgLy9jb25zb2xlLmxvZyhBdXRoU2VydmljZS5pc0F1dGhlbnRpY2F0ZWQoKSk7XG5cbiAgICAkc2NvcGUuJG9uKEFVVEhfRVZFTlRTLm5vdEF1dGhvcml6ZWQsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgIHZhciBhbGVydFBvcHVwID0gJGlvbmljUG9wdXAuYWxlcnQoe1xuICAgICAgICAgICAgdGl0bGU6ICdVbmF1dGhvcml6ZWQhJyxcbiAgICAgICAgICAgIHRlbXBsYXRlOiAnWW91IGFyZSBub3QgYWxsb3dlZCB0byBhY2Nlc3MgdGhpcyByZXNvdXJjZS4nXG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgJHNjb3BlLiRvbihBVVRIX0VWRU5UUy5ub3RBdXRoZW50aWNhdGVkLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICBBdXRoU2VydmljZS5sb2dvdXQoKTtcbiAgICAgICAgLy8kc3RhdGUuZ28oJ2xvZ2luJyk7XG4gICAgICAgIHZhciBhbGVydFBvcHVwID0gJGlvbmljUG9wdXAuYWxlcnQoe1xuICAgICAgICAgICAgdGl0bGU6ICdQbGVhc2UgUmV2aWV3JyxcbiAgICAgICAgICAgIHRlbXBsYXRlOiAnJ1xuICAgICAgICB9KTtcbiAgICB9KTtcbn0pO1xuXG5hcHAuY29udHJvbGxlcignTWVudUN0cmwnLCBmdW5jdGlvbigkc2NvcGUsICRpb25pY1NpZGVNZW51RGVsZWdhdGUsICRzdGF0ZSwgQXV0aFNlcnZpY2UsICRyb290U2NvcGUpe1xuXG4gICAgJHNjb3BlLnN0YXRlcyA9IFtcbiAgICAgICAgLy97XG4gICAgICAgIC8vICBuYW1lIDogJ0FjY291bnQnLFxuICAgICAgICAvLyAgcmVmIDogZnVuY3Rpb24oKXtyZXR1cm4gJ2FjY291bnQnO31cbiAgICAgICAgLy99LFxuICAgICAgICB7XG4gICAgICAgICAgbmFtZSA6ICdDaGFsbGVuZ2VzJyxcbiAgICAgICAgICByZWY6IGZ1bmN0aW9uKCl7cmV0dXJuICdleGVyY2lzbS5jb21waWxlJzt9XG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIG5hbWUgOiAnRnJpZW5kcycsXG4gICAgICAgICAgICByZWY6IGZ1bmN0aW9uKCl7cmV0dXJuICdmcmllbmRzJzt9XG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIG5hbWUgOiAnU2FuZGJveCcsXG4gICAgICAgICAgICByZWYgOiBmdW5jdGlvbigpe3JldHVybiAnc2FuZGJveC5jb2RlJzt9XG4gICAgICAgIH0sXG4gICAgICAgIC8ve1xuICAgICAgICAvLyAgbmFtZSA6ICdFeGVyY2lzZXMnLFxuICAgICAgICAvLyAgcmVmIDogZnVuY3Rpb24oKXtyZXR1cm4gJ2V4ZXJjaXNlcyc7IH1cbiAgICAgICAgLy99LFxuICAgICAgICB7XG4gICAgICAgICAgbmFtZSA6ICdNeSBTbmlwcGV0cycsXG4gICAgICAgICAgcmVmIDogZnVuY3Rpb24gKCl7cmV0dXJuICdzbmlwcGV0cyc7fVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgbmFtZSA6ICdBYm91dCcsXG4gICAgICAgICAgcmVmIDogZnVuY3Rpb24oKXsgcmV0dXJuICdhYm91dCc7fVxuICAgICAgICB9XG4gICAgXTtcblxuICAgICRzY29wZS50b2dnbGVNZW51U2hvdyA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIC8vY29uc29sZS5sb2coJ0F1dGhTZXJ2aWNlJyxBdXRoU2VydmljZS5pc0F1dGhlbnRpY2F0ZWQoKSlcbiAgICAgICAgLy9jb25zb2xlLmxvZygndG9nZ2xlTWVudVNob3cnLEF1dGhTZXJ2aWNlLmlzQXV0aGVudGljYXRlZCgpKTtcbiAgICAgICAgLy9UT0RPOiByZXR1cm4gQXV0aFNlcnZpY2UuaXNBdXRoZW50aWNhdGVkKCk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH07XG5cbiAgICAkcm9vdFNjb3BlLiRvbignQXV0aCcsZnVuY3Rpb24oKXtcbiAgICAgICAvL2NvbnNvbGUubG9nKCdhdXRoJyk7XG4gICAgICAgJHNjb3BlLnRvZ2dsZU1lbnVTaG93KCk7XG4gICAgfSk7XG5cbiAgICAvL2NvbnNvbGUubG9nKEF1dGhTZXJ2aWNlLmlzQXV0aGVudGljYXRlZCgpKTtcbiAgICAvL2lmKEF1dGhTZXJ2aWNlLmlzQXV0aGVudGljYXRlZCgpKXtcbiAgICAkc2NvcGUuY2xpY2tJdGVtID0gZnVuY3Rpb24oc3RhdGVSZWYpe1xuICAgICAgICAkaW9uaWNTaWRlTWVudURlbGVnYXRlLnRvZ2dsZUxlZnQoKTtcbiAgICAgICAgJHN0YXRlLmdvKHN0YXRlUmVmKCkpOyAvL1JCOiBVcGRhdGVkIHRvIGhhdmUgc3RhdGVSZWYgYXMgYSBmdW5jdGlvbiBpbnN0ZWFkLlxuICAgIH07XG5cbiAgICAkc2NvcGUudG9nZ2xlTWVudSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICRpb25pY1NpZGVNZW51RGVsZWdhdGUudG9nZ2xlTGVmdCgpO1xuICAgIH07XG4gICAgLy99XG59KTsiLCJhcHAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKXtcblx0JHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2Fib3V0Jywge1xuXHRcdHVybDogJy9hYm91dCcsXG5cdFx0dGVtcGxhdGVVcmw6ICdmZWF0dXJlcy9hYm91dC9hYm91dC5odG1sJ1xuXHR9KTtcbn0pOyIsImFwcC5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIsIFVTRVJfUk9MRVMpe1xuXHQvLyBFYWNoIHRhYiBoYXMgaXRzIG93biBuYXYgaGlzdG9yeSBzdGFjazpcblx0JHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2FjY291bnQnLCB7XG5cdFx0dXJsOiAnL2FjY291bnQnLFxuXHQgICAgdGVtcGxhdGVVcmw6ICdmZWF0dXJlcy9hY2NvdW50L2FjY291bnQuaHRtbCcsXG5cdFx0Y29udHJvbGxlcjogJ0FjY291bnRDdHJsJ1xuXHRcdC8vICxcblx0XHQvLyBkYXRhOiB7XG5cdFx0Ly8gXHRhdXRoZW50aWNhdGU6IFtVU0VSX1JPTEVTLnB1YmxpY11cblx0XHQvLyB9XG5cdH0pO1xufSk7XG5cbmFwcC5jb250cm9sbGVyKCdBY2NvdW50Q3RybCcsIGZ1bmN0aW9uKCRzY29wZSkge1xuXHQkc2NvcGUuc2V0dGluZ3MgPSB7XG5cdFx0ZW5hYmxlRnJpZW5kczogdHJ1ZVxuXHR9O1xufSk7IiwiYXBwLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlcil7XG5cdCRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdleGVyY2lzZScse1xuXHRcdHVybDogJy9leGVyY2lzZS86c2x1ZycsXG5cdFx0YWJzdHJhY3Q6IHRydWUsXG5cdFx0dGVtcGxhdGVVcmwgOiAnZmVhdHVyZXMvZXhlcmNpc2UvZXhlcmNpc2UuaHRtbCdcblx0fSk7XG59KTtcblxuYXBwLmZhY3RvcnkoJ0V4ZXJjaXNlRmFjdG9yeScsIGZ1bmN0aW9uKCl7XG5cbn0pOyIsImFwcC5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIpe1xuXHQkc3RhdGVQcm92aWRlci5zdGF0ZSgnZXhlcmNpc2UuY29kZScsIHtcblx0XHR1cmwgOiAnL2V4ZXJjaXNlLzpzbHVnL2NvZGUnLFxuXHRcdHZpZXdzIDoge1xuXHRcdFx0J3RhYi1jb2RlJyA6IHtcblx0XHRcdFx0dGVtcGxhdGVVcmwgOiAnZmVhdHVyZXMvZXhlcmNpc2UtY29kZS9leGVyY2lzZS1jb2RlLmh0bWwnLFxuXHRcdFx0XHRjb250cm9sbGVyOiAnRXhlcmNpc2VDb2RlQ3RybCdcblx0XHRcdH1cblx0XHR9XG5cdH0pO1xufSk7XG5cbmFwcC5jb250cm9sbGVyKCdFeGVyY2lzZUNvZGVDdHJsJywgZnVuY3Rpb24oJHNjb3BlKXtcbn0pOyIsImFwcC5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIpe1xuXHQkc3RhdGVQcm92aWRlci5zdGF0ZSgnZXhlcmNpc2UuY29tcGlsZScsIHtcblx0XHR1cmwgOiAnL2V4ZXJjaXNlLzpzbHVnL2NvbXBpbGUnLFxuXHRcdHZpZXdzIDoge1xuXHRcdFx0J3RhYi1jb21waWxlJyA6IHtcblx0XHRcdFx0dGVtcGxhdGVVcmwgOiAnZmVhdHVyZXMvZXhlcmNpc2UtY29tcGlsZS9leGVyY2lzZS1jb21waWxlLmh0bWwnLFxuXHRcdFx0XHRjb250cm9sbGVyOiAnRXhlcmNpc2VDb21waWxlQ3RybCdcblx0XHRcdH1cblx0XHR9XG5cdH0pO1xufSk7XG5cbmFwcC5jb250cm9sbGVyKCdFeGVyY2lzZUNvbXBpbGVDdHJsJywgZnVuY3Rpb24oJHNjb3BlKXtcblxufSk7IiwiYXBwLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlcil7XG5cdCRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdleGVyY2lzZS50ZXN0Jywge1xuXHRcdHVybCA6ICcvZXhlcmNpc2UvOnNsdWcvdGVzdCcsXG5cdFx0dmlld3MgOiB7XG5cdFx0XHQndGFiLXRlc3QnIDoge1xuXHRcdFx0XHR0ZW1wbGF0ZVVybCA6ICdmZWF0dXJlcy9leGVyY2lzZS10ZXN0L2V4ZXJjaXNlLXRlc3QuaHRtbCcsXG5cdFx0XHRcdGNvbnRyb2xsZXI6ICdFeGVyY2lzZVRlc3RDdHJsJ1xuXHRcdFx0fVxuXHRcdH1cblx0fSk7XG59KTtcblxuYXBwLmNvbnRyb2xsZXIoJ0V4ZXJjaXNlVGVzdEN0cmwnLCBmdW5jdGlvbigkc2NvcGUpe1xuXG59KTsiLCJhcHAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKXtcblx0JHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2V4ZXJjaXNlLnZpZXcnLCB7XG5cdFx0dXJsIDogJy9leGVyY2lzZS86c2x1Zy92aWV3Jyxcblx0XHR2aWV3cyA6IHtcblx0XHRcdCd0YWItdmlldycgOiB7XG5cdFx0XHRcdHRlbXBsYXRlVXJsIDogJ2ZlYXR1cmVzL2V4ZXJjaXNlLXZpZXcvZXhlcmNpc2Utdmlldy5odG1sJyxcblx0XHRcdFx0Y29udHJvbGxlcjogJ0V4ZXJjaXNlVmlld0N0cmwnXG5cdFx0XHR9XG5cdFx0fVxuXHR9KTtcbn0pO1xuXG5hcHAuY29udHJvbGxlcignRXhlcmNpc2VWaWV3Q3RybCcsIGZ1bmN0aW9uKCRzY29wZSl7XG5cbn0pOyIsImFwcC5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIpe1xuXHQkc3RhdGVQcm92aWRlci5zdGF0ZSgnZXhlcmNpc2Uudmlldy1lZGl0Jywge1xuXHRcdHVybCA6ICcvZXhlcmNpc2UvOnNsdWcvdmlldy9lZGl0Jyxcblx0XHR2aWV3cyA6IHtcblx0XHRcdCd0YWItdmlldycgOiB7XG5cdFx0XHRcdHRlbXBsYXRlVXJsIDogJ2ZlYXR1cmVzL2V4ZXJjaXNlLXZpZXctZWRpdC9leGVyY2lzZS12aWV3LWVkaXQuaHRtbCcsXG5cdFx0XHRcdGNvbnRyb2xsZXI6ICdFeGVyY2lzZVZpZXdFZGl0Q3RybCdcblx0XHRcdH1cblx0XHR9XG5cdH0pO1xufSk7XG5cbmFwcC5jb250cm9sbGVyKCdFeGVyY2lzZVZpZXdFZGl0Q3RybCcsIGZ1bmN0aW9uKCRzY29wZSl7XG5cbn0pOyIsImFwcC5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIpe1xuXHQkc3RhdGVQcm92aWRlci5zdGF0ZSgnZXhlcmNpc2VzJywge1xuXHRcdHVybCA6ICcvZXhlcmNpc2VzJyxcblx0XHR0ZW1wbGF0ZVVybCA6ICdmZWF0dXJlcy9leGVyY2lzZXMvZXhlcmNpc2VzLmh0bWwnLFxuXHRcdGNvbnRyb2xsZXI6ICdFeGVyY2lzZXNDdHJsJ1xuXHR9KTtcbn0pO1xuXG5hcHAuY29udHJvbGxlcignRXhlcmNpc2VzQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgJHN0YXRlKXtcblx0JHNjb3BlLmNyZWF0ZSA9IGZ1bmN0aW9uKCl7XG5cdFx0JHN0YXRlLmdvKCdleGVyY2lzZXMtY3JlYXRlJyk7XG5cdH07XG59KTtcblxuYXBwLmZhY3RvcnkoJ0V4ZXJjaXNlRmFjdG9yeScsIGZ1bmN0aW9uKCRsb2NhbHN0b3JhZ2Upe1xuXHR2YXIgZXhlcmNpc2VzID0gJGxvY2Fsc3RvcmFnZS5nZXRPYmplY3QoJ2V4ZXJjaXNlcycpO1xuXHRpZih3aW5kb3cuXy5pc0VtcHR5KGV4ZXJjaXNlcykpIGV4ZXJjaXNlcyA9IFtdO1xuXG5cdHJldHVybiB7XG5cdFx0Z2V0RXhlcmNpc2VzIDogZnVuY3Rpb24oKXtcblx0XHRcdHJldHVybiBleGVyY2lzZXM7XG5cdFx0fSxcblx0XHRjcmVhdGVFeGVyY2lzZSA6IGZ1bmN0aW9uKGV4ZXJjaXNlKXtcblx0XHRcdGV4ZXJjaXNlcy5wdXNoKGV4ZXJjaXNlKTtcblx0XHRcdCRsb2NhbHN0b3JhZ2Uuc2V0T2JqZWN0KGV4ZXJjaXNlcyk7XG5cdFx0fSxcblx0XHRnZXRFeGVyY2lzZSA6IGZ1bmN0aW9uKHNsdWcpe1xuXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBleGVyY2lzZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0aWYgKGV4ZXJjaXNlc1tpXS5zbHVnID09PSBzbHVnKSByZXR1cm4gZXhlcmNpc2VzW2ldO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHt9O1xuXHRcdH0sXG5cdFx0dXBkYXRlRXhlcmNpc2UgOiBmdW5jdGlvbihleGVyY2lzZSl7XG5cdFx0XHRmb3IodmFyIGkgPSAwOyBpIDwgZXhlcmNpc2VzLmxlbmd0aDsgaSsrKXtcblxuXHRcdFx0fVxuXHRcdH0sXG5cdFx0ZGVsZXRlRXhlcmNpc2UgOiBmdW5jdGlvbigpe1xuXG5cdFx0fVxuXHR9O1xufSk7IiwiYXBwLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlcil7XG5cdCRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdleGVyY2lzZXMtY3JlYXRlJywge1xuXHRcdHVybCA6ICcvZXhlcmNpc2VzL2NyZWF0ZScsXG5cdFx0dGVtcGxhdGVVcmwgOiAnZmVhdHVyZXMvZXhlcmNpc2VzLWNyZWF0ZS9leGVyY2lzZXMtY3JlYXRlLmh0bWwnLFxuXHRcdGNvbnRyb2xsZXI6ICdFeGVyY2lzZXNDcmVhdGVDdHJsJ1xuXHR9KTtcbn0pO1xuXG5hcHAuY29udHJvbGxlcignRXhlcmNpc2VzQ3JlYXRlQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSl7XG5cbn0pOyIsImFwcC5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIpe1xuXHQkc3RhdGVQcm92aWRlci5zdGF0ZSgnZXhlcmNpc20nLCB7XG5cdFx0dGVtcGxhdGVVcmwgOiAnZmVhdHVyZXMvZXhlcmNpc20vZXhlcmNpc20uaHRtbCcsXG5cdFx0YWJzdHJhY3QgOiB0cnVlLFxuXHRcdHJlc29sdmUgOiB7XG5cdFx0XHRtYXJrZG93biA6IGZ1bmN0aW9uKEF2YWlsYWJsZUV4ZXJjaXNlcywgRXhlcmNpc21GYWN0b3J5LCAkc3RhdGUpe1xuXG5cdFx0XHRcdGlmKEV4ZXJjaXNtRmFjdG9yeS5nZXRUZXN0U2NyaXB0KCkubGVuZ3RoID09PSAwKSB7XG5cdFx0XHRcdFx0dmFyIGV4ZXJjaXNlID0gQXZhaWxhYmxlRXhlcmNpc2VzLmdldFJhbmRvbUV4ZXJjaXNlKCk7XG5cdFx0XHRcdFx0RXhlcmNpc21GYWN0b3J5LnNldE5hbWUoZXhlcmNpc2UubmFtZSk7XG5cdFx0XHRcdFx0cmV0dXJuIEV4ZXJjaXNtRmFjdG9yeS5nZXRFeHRlcm5hbFNjcmlwdChleGVyY2lzZS5saW5rKS50aGVuKGZ1bmN0aW9uKGRhdGEpe1xuXHRcdFx0XHRcdFx0cmV0dXJuIEV4ZXJjaXNtRmFjdG9yeS5nZXRFeHRlcm5hbE1kKGV4ZXJjaXNlLm1kTGluayk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdH1cblx0fSk7XG59KTtcblxuYXBwLmZhY3RvcnkoJ0V4ZXJjaXNtRmFjdG9yeScsIGZ1bmN0aW9uKCRodHRwLCAkcm9vdFNjb3BlKXtcblx0dmFyIG5hbWUgPSAnJztcblx0dmFyIHRlc3QgPSAnJztcblx0dmFyIGNvZGUgPSAnJztcblx0dmFyIG1hcmtkb3duID0gJyc7XG5cblx0cmV0dXJuIHtcblx0XHRnZXRFeHRlcm5hbFNjcmlwdCA6IGZ1bmN0aW9uKGxpbmspe1xuXHRcdFx0cmV0dXJuICRodHRwLmdldChsaW5rKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcblx0XHRcdFx0dGVzdCA9IHJlc3BvbnNlLmRhdGE7XG5cdFx0XHRcdHJldHVybiByZXNwb25zZS5kYXRhO1xuXHRcdFx0fSk7XG5cdFx0fSxcblx0XHRnZXRFeHRlcm5hbE1kIDogZnVuY3Rpb24obGluayl7XG5cdFx0XHRyZXR1cm4gJGh0dHAuZ2V0KGxpbmspLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuXHRcdFx0XHRtYXJrZG93biA9IHJlc3BvbnNlLmRhdGE7XG5cdFx0XHRcdHJldHVybiByZXNwb25zZS5kYXRhO1xuXHRcdFx0fSk7XG5cdFx0fSxcblx0XHRzZXROYW1lIDogZnVuY3Rpb24oc2V0TmFtZSl7XG5cdFx0XHRuYW1lID0gc2V0TmFtZTtcblx0XHR9LFxuXHRcdHNldFRlc3RTY3JpcHQgOiBmdW5jdGlvbih0ZXN0KXtcblx0XHRcdHRlc3QgPSB0ZXN0O1xuXHRcdFx0JHJvb3RTY29wZS4kYnJvYWRjYXN0KCd0ZXN0Q2hhbmdlJywgdGVzdCk7XG5cdFx0fSxcblx0XHRzZXRDb2RlU2NyaXB0IDogZnVuY3Rpb24gKGNvZGUpe1xuXHRcdFx0Y29kZSA9IGNvZGU7XG5cdFx0XHQkcm9vdFNjb3BlLiRicm9hZGNhc3QoJ2NvZGVDaGFuZ2UnLCBjb2RlKTtcblx0XHR9LFxuXHRcdGdldFRlc3RTY3JpcHQgOiBmdW5jdGlvbigpe1xuXHRcdFx0cmV0dXJuIHRlc3Q7XG5cdFx0fSxcblx0XHRnZXRDb2RlU2NyaXB0IDogZnVuY3Rpb24oKXtcblx0XHRcdHJldHVybiBjb2RlO1xuXHRcdH0sXG5cdFx0Z2V0TWFya2Rvd24gOiBmdW5jdGlvbigpe1xuXHRcdFx0cmV0dXJuIG1hcmtkb3duO1xuXHRcdH0sXG5cdFx0Z2V0TmFtZSA6IGZ1bmN0aW9uKCl7XG5cdFx0XHRyZXR1cm4gbmFtZTtcblx0XHR9XG5cdH07XG59KTtcblxuYXBwLmZhY3RvcnkoJ0F2YWlsYWJsZUV4ZXJjaXNlcycsIGZ1bmN0aW9uKCl7XG5cblx0dmFyIGxpYnJhcnkgPSBbXG5cdFx0J2FjY3VtdWxhdGUnLFxuXHRcdCdhbGxlcmdpZXMnLFxuXHRcdCdhbmFncmFtJyxcblx0XHQnYXRiYXNoLWNpcGhlcicsXG5cdFx0J2JlZXItc29uZycsXG5cdFx0J2JpbmFyeScsXG5cdFx0J2JpbmFyeS1zZWFyY2gtdHJlZScsXG5cdFx0J2JvYicsXG5cdFx0J2JyYWNrZXQtcHVzaCcsXG5cdFx0J2NpcmN1bGFyLWJ1ZmZlcicsXG5cdFx0J2Nsb2NrJyxcblx0XHQnY3J5cHRvLXNxdWFyZScsXG5cdFx0J2N1c3RvbS1zZXQnLFxuXHRcdCdkaWZmZXJlbmNlLW9mLXNxdWFyZXMnLFxuXHRcdCdldGwnLFxuXHRcdCdmb29kLWNoYWluJyxcblx0XHQnZ2lnYXNlY29uZCcsXG5cdFx0J2dyYWRlLXNjaG9vbCcsXG5cdFx0J2dyYWlucycsXG5cdFx0J2hhbW1pbmcnLFxuXHRcdCdoZWxsby13b3JsZCcsXG5cdFx0J2hleGFkZWNpbWFsJ1xuXHRdO1xuXG5cdHZhciBnZW5lcmF0ZUxpbmsgPSBmdW5jdGlvbihuYW1lKXtcblx0XHRyZXR1cm4gJ2V4ZXJjaXNtL2phdmFzY3JpcHQvJyArIG5hbWUgKyAnLycgKyBuYW1lICsgJ190ZXN0LnNwZWMuanMnO1xuXHR9O1xuXG5cdHZhciBnZW5lcmF0ZU1kTGluayA9IGZ1bmN0aW9uKG5hbWUpe1xuXHRcdHJldHVybiAnZXhlcmNpc20vamF2YXNjcmlwdC8nICsgbmFtZSArICcvJyArIG5hbWUgKyAnLm1kJztcblx0fTtcblxuXHR2YXIgZ2VuZXJhdGVSYW5kb20gPSBmdW5jdGlvbigpe1xuXHRcdHZhciByYW5kb20gPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBsaWJyYXJ5Lmxlbmd0aCk7XG5cdFx0cmV0dXJuIGxpYnJhcnlbcmFuZG9tXTtcblx0fTtcblxuXHRyZXR1cm4ge1xuXHRcdGdldFNwZWNpZmljRXhlcmNpc2UgOiBmdW5jdGlvbihuYW1lKXtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdGxpbmsgOiBnZW5lcmF0ZUxpbmsobmFtZSksXG5cdFx0XHRcdG1kTGluayA6IGdlbmVyYXRlTWRMaW5rKG5hbWUpXG5cdFx0XHR9O1xuXHRcdH0sXG5cdFx0Z2V0UmFuZG9tRXhlcmNpc2UgOiBmdW5jdGlvbigpe1xuXHRcdFx0dmFyIG5hbWUgPSBnZW5lcmF0ZVJhbmRvbSgpO1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0bmFtZSA6IG5hbWUsXG5cdFx0XHRcdGxpbmsgOiBnZW5lcmF0ZUxpbmsobmFtZSksXG5cdFx0XHRcdG1kTGluayA6IGdlbmVyYXRlTWRMaW5rKG5hbWUpXG5cdFx0XHR9O1xuXHRcdH1cblx0fTtcbn0pOyIsImFwcC5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIpe1xuXHQkc3RhdGVQcm92aWRlci5zdGF0ZSgnZXhlcmNpc20uY29kZScsIHtcblx0XHR1cmwgOiAnL2V4ZXJjaXNtL2NvZGUnLFxuXHRcdHZpZXdzIDoge1xuXHRcdFx0J3RhYi1jb2RlJyA6IHtcblx0XHRcdFx0dGVtcGxhdGVVcmwgOiAnZmVhdHVyZXMvZXhlcmNpc20tY29kZS9leGVyY2lzbS1jb2RlLmh0bWwnLFxuXHRcdFx0XHRjb250cm9sbGVyOiAnRXhlcmNpc21Db2RlQ3RybCdcblx0XHRcdH1cblx0XHR9XG5cdH0pO1xufSk7XG5cbmFwcC5jb250cm9sbGVyKCdFeGVyY2lzbUNvZGVDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBFeGVyY2lzbUZhY3RvcnksICRzdGF0ZSwgS2V5Ym9hcmRGYWN0b3J5KXtcblx0JHNjb3BlLm5hbWUgPSBFeGVyY2lzbUZhY3RvcnkuZ2V0TmFtZSgpO1xuXHQkc2NvcGUuY29kZSA9IHtcblx0XHR0ZXh0IDogbnVsbFxuXHR9O1xuXG5cdCRzY29wZS5jb2RlLnRleHQgPSBFeGVyY2lzbUZhY3RvcnkuZ2V0Q29kZVNjcmlwdCgpO1xuXHQvL2RvZXNuJ3QgZG8gYW55dGhpbmcgcmlnaHQgbm93IC0gbWF5YmUgcHVsbCBwcmV2aW91c2x5IHNhdmVkIGNvZGVcblxuXHQvL3Bhc3NpbmcgdGhpcyB1cGRhdGUgZnVuY3Rpb24gc28gdGhhdCBvbiB0ZXh0IGNoYW5nZSBpbiB0aGUgZGlyZWN0aXZlIHRoZSBmYWN0b3J5IHdpbGwgYmUgYWxlcnRlZFxuXHQkc2NvcGUuY29tcGlsZSA9IGZ1bmN0aW9uKGNvZGUpe1xuXHRcdEV4ZXJjaXNtRmFjdG9yeS5zZXRDb2RlU2NyaXB0KGNvZGUpO1xuXHRcdCRzdGF0ZS5nbygnZXhlcmNpc20uY29tcGlsZScpO1xuXHR9O1xuXG5cdCRzY29wZS5pbnNlcnRGdW5jID0gS2V5Ym9hcmRGYWN0b3J5Lm1ha2VJbnNlcnRGdW5jKCRzY29wZSk7XG5cbn0pOyIsImFwcC5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIpe1xuXHQkc3RhdGVQcm92aWRlci5zdGF0ZSgnZXhlcmNpc20uY29tcGlsZScsIHtcblx0XHR1cmwgOiAnL2V4ZXJjaXNtL2NvbXBpbGUnLFxuXHRcdHZpZXdzIDoge1xuXHRcdFx0J3RhYi1jb21waWxlJyA6IHtcblx0XHRcdFx0dGVtcGxhdGVVcmwgOiAnZmVhdHVyZXMvZXhlcmNpc20tY29tcGlsZS9leGVyY2lzbS1jb21waWxlLmh0bWwnLFxuXHRcdFx0XHRjb250cm9sbGVyOiAnRXhlcmNpc21Db21waWxlQ3RybCdcblx0XHRcdH1cblx0XHR9LFxuXHRcdG9uRW50ZXIgOiBmdW5jdGlvbigpe1xuXHRcdFx0aWYod2luZG93Lmphc21pbmUpIHdpbmRvdy5qYXNtaW5lLmdldEVudigpLmV4ZWN1dGUoKTtcblx0XHR9XG5cdH0pO1xufSk7XG5cbmFwcC5jb250cm9sbGVyKCdFeGVyY2lzbUNvbXBpbGVDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBFeGVyY2lzbUZhY3Rvcnkpe1xuXHQkc2NvcGUubmFtZSA9IEV4ZXJjaXNtRmFjdG9yeS5nZXROYW1lKCk7XG5cdCRzY29wZS5jb21waWxpbmcgPSB7XG5cdFx0dGVzdDogbnVsbCxcblx0XHRjb2RlIDogbnVsbFxuXHR9O1xuXHQkc2NvcGUuY29tcGlsaW5nLnRlc3QgPSBFeGVyY2lzbUZhY3RvcnkuZ2V0VGVzdFNjcmlwdCgpO1xuXHQkc2NvcGUuY29tcGlsaW5nLmNvZGUgPSBFeGVyY2lzbUZhY3RvcnkuZ2V0Q29kZVNjcmlwdCgpO1xuXG5cblx0JHNjb3BlLiRvbigndGVzdENoYW5nZScsIGZ1bmN0aW9uKGV2ZW50LCBkYXRhKXtcblx0XHQkc2NvcGUuY29tcGlsaW5nLnRlc3QgPSBkYXRhO1xuXHR9KTtcblxuXHQkc2NvcGUuJG9uKCdjb2RlQ2hhbmdlJywgZnVuY3Rpb24oZXZlbnQsIGRhdGEpe1xuXHRcdCRzY29wZS5jb21waWxpbmcuY29kZSA9IGRhdGE7XG5cdH0pO1xufSk7IiwiYXBwLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlcil7XG5cdCRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdleGVyY2lzbS50ZXN0Jywge1xuXHRcdHVybCA6ICcvZXhlcmNpc20vdGVzdCcsXG5cdFx0dmlld3MgOiB7XG5cdFx0XHQndGFiLXRlc3QnIDoge1xuXHRcdFx0XHR0ZW1wbGF0ZVVybCA6ICdmZWF0dXJlcy9leGVyY2lzbS10ZXN0L2V4ZXJjaXNtLXRlc3QuaHRtbCcsXG5cdFx0XHRcdGNvbnRyb2xsZXIgOiAnRXhlcmNpc21UZXN0Q3RybCdcblx0XHRcdH1cblx0XHR9XG5cdH0pO1xufSk7XG5cbmFwcC5jb250cm9sbGVyKCdFeGVyY2lzbVRlc3RDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBFeGVyY2lzbUZhY3Rvcnkpe1xuXG5cdCRzY29wZS5uYW1lID0gRXhlcmNpc21GYWN0b3J5LmdldE5hbWUoKTtcblxuXHQkc2NvcGUudGVzdCA9IHtcblx0XHR0ZXh0OiBudWxsXG5cdH07XG5cblx0JHNjb3BlLnRlc3QudGV4dCA9IEV4ZXJjaXNtRmFjdG9yeS5nZXRUZXN0U2NyaXB0KCk7XG5cblx0JHNjb3BlLiR3YXRjaCgndGVzdC50ZXh0JywgZnVuY3Rpb24obmV3VmFsdWUpe1xuXHRcdEV4ZXJjaXNtRmFjdG9yeS5zZXRUZXN0U2NyaXB0KG5ld1ZhbHVlKTtcblx0fSk7XG59KTsiLCJhcHAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKXtcblx0JHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2V4ZXJjaXNtLnZpZXcnLCB7XG5cdFx0dXJsOiAnL2V4ZXJjaXNtL3ZpZXcnLFxuXHRcdHZpZXdzOiB7XG5cdFx0XHQndGFiLXZpZXcnIDoge1xuXHRcdFx0XHR0ZW1wbGF0ZVVybDogJ2ZlYXR1cmVzL2V4ZXJjaXNtLXZpZXcvZXhlcmNpc20tdmlldy5odG1sJyxcblx0XHRcdFx0Y29udHJvbGxlcjogJ0V4ZXJjaXNtVmlld0N0cmwnXG5cdFx0XHR9XG5cdFx0fVxuXHR9KTtcbn0pO1xuXG5hcHAuY29udHJvbGxlcignRXhlcmNpc21WaWV3Q3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgRXhlcmNpc21GYWN0b3J5KXtcblx0JHNjb3BlLm1hcmtkb3duID0gRXhlcmNpc21GYWN0b3J5LmdldE1hcmtkb3duKCk7XG5cdCRzY29wZS5uYW1lID0gRXhlcmNpc21GYWN0b3J5LmdldE5hbWUoKTtcbn0pOyIsImFwcC5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIsIFVTRVJfUk9MRVMpe1xuXG4gICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdmcmllbmRzJywge1xuICAgICAgY2FjaGU6IGZhbHNlLCAvL3RvIGVuc3VyZSB0aGUgY29udHJvbGxlciBpcyBsb2FkaW5nIGVhY2ggdGltZVxuICAgICAgdXJsOiAnL2ZyaWVuZHMnLFxuICAgICAgdGVtcGxhdGVVcmw6ICdmZWF0dXJlcy9mcmllbmRzL2ZyaWVuZHMuaHRtbCcsXG4gICAgICBjb250cm9sbGVyOiAnRnJpZW5kc0N0cmwnLFxuICAgICAgcmVzb2x2ZToge1xuICAgICAgICBmcmllbmRzOiBmdW5jdGlvbihGcmllbmRzRmFjdG9yeSkge1xuICAgICAgICAgIHJldHVybiBGcmllbmRzRmFjdG9yeS5nZXRGcmllbmRzKCkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdyZXNwb25zZS5kYXRhIGZyaWVuZHMnLHJlc3BvbnNlLmRhdGEuZnJpZW5kcyk7XG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UuZGF0YS5mcmllbmRzO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSlcbiAgICAuc3RhdGUoJ3NoYXJlZC1naXN0cycsIHtcbiAgICAgIGNhY2hlOiBmYWxzZSwgLy90byBlbnN1cmUgdGhlIGNvbnRyb2xsZXIgaXMgbG9hZGluZyBlYWNoIHRpbWVcbiAgICAgIHVybDogJy9jaGF0cy86aWQnLFxuICAgICAgdGVtcGxhdGVVcmw6ICdmZWF0dXJlcy9mcmllbmRzL3NoYXJlZC1naXN0cy5odG1sJyxcbiAgICAgIGNvbnRyb2xsZXI6ICdTaGFyZWRHaXN0c0N0cmwnXG4gICAgfSlcbiAgICAuc3RhdGUoJ3ZpZXctY29kZScsIHtcbiAgICAgIGNhY2hlOiBmYWxzZSwgLy90byBlbnN1cmUgdGhlIGNvbnRyb2xsZXIgaXMgbG9hZGluZyBlYWNoIHRpbWVcbiAgICAgIHVybDogJy9jaGF0cy9jb2RlLzppZCcsXG4gICAgICB0ZW1wbGF0ZVVybDogJ2ZlYXR1cmVzL2ZyaWVuZHMvdmlldy1jb2RlLmh0bWwnLFxuICAgICAgY29udHJvbGxlcjogJ1ZpZXdDb2RlQ3RybCdcbiAgICB9KVxufSk7XG5cbmFwcC5jb250cm9sbGVyKCdGcmllbmRzQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgRnJpZW5kc0ZhY3RvcnksZnJpZW5kcywgJHN0YXRlLCBHaXN0RmFjdG9yeSkge1xuICAvL2NvbnNvbGUubG9nKCdoZWxsbyB3b3JsZCcpO1xuICAvLyRzY29wZS5jaGF0cyA9IENoYXRzLmFsbCgpO1xuICAvLyRzY29wZS5yZW1vdmUgPSBmdW5jdGlvbihjaGF0KSB7XG4gIC8vICBDaGF0cy5yZW1vdmUoY2hhdCk7XG4gIC8vfTtcblxuICAkc2NvcGUuZGF0YSA9IHt9O1xuICAkc2NvcGUuZnJpZW5kcyA9IGZyaWVuZHM7XG5cbiAgY29uc29sZS5sb2coJ2ZyaWVuZHMnLGZyaWVuZHMpO1xuICAvL1RPRE86IEFkZCBnZXRGcmllbmRzIHJvdXRlIGFzIHdlbGwgYW5kIHNhdmUgdG8gbG9jYWxTdG9yYWdlXG4gIC8vRnJpZW5kc0ZhY3RvcnkuZ2V0RnJpZW5kcygpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAvLyAgY29uc29sZS5sb2coJ3Jlc3BvbnNlLmRhdGEgZnJpZW5kcycscmVzcG9uc2UuZGF0YS5mcmllbmRzKTtcbiAgLy8gICRzY29wZS5mcmllbmRzID0gcmVzcG9uc2UuZGF0YS5mcmllbmRzO1xuICAvL30pO1xuXG4gICRzY29wZS5hZGRGcmllbmQgPSBmdW5jdGlvbigpe1xuICAgIGNvbnNvbGUubG9nKCdhZGRGcmllbmQgY2xpY2tlZCcpO1xuICAgIEZyaWVuZHNGYWN0b3J5LmFkZEZyaWVuZCgkc2NvcGUuZGF0YS51c2VybmFtZSkudGhlbihmcmllbmRBZGRlZCwgZnJpZW5kTm90QWRkZWQpO1xuICB9O1xuXG4gIGZyaWVuZEFkZGVkID0gZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgIGNvbnNvbGUubG9nKCdmcmllbmRBZGRlZCcscmVzcG9uc2UuZGF0YS5mcmllbmQpO1xuICAgICRzY29wZS5mcmllbmRzLnB1c2gocmVzcG9uc2UuZGF0YS5mcmllbmQpO1xuICB9O1xuXG4gIGZyaWVuZE5vdEFkZGVkID0gZnVuY3Rpb24oZXJyKXtcbiAgICBjb25zb2xlLmxvZyhlcnIpO1xuICB9O1xuXG4gIEdpc3RGYWN0b3J5LnF1ZXVlZEdpc3RzKCkudGhlbihhZGRTaGFyZWRHaXN0c1RvU2NvcGUpO1xuXG4gIGZ1bmN0aW9uIGFkZFNoYXJlZEdpc3RzVG9TY29wZShnaXN0cyl7XG4gICAgLy9jb25zb2xlLmxvZygnYWRkU2hhcmVkR2lzdHNUb1Njb3BlJyxnaXN0cy5kYXRhKTtcbiAgICAkc2NvcGUuZ2lzdHMgPSBnaXN0cy5kYXRhO1xuICAgIEZyaWVuZHNGYWN0b3J5LnNldEdpc3RzKGdpc3RzLmRhdGEpO1xuICB9XG5cbiAgJHNjb3BlLnNoYXJlZENvZGUgPSBmdW5jdGlvbihpZCl7XG4gICAgLy9jb25zb2xlLmxvZyhpZCk7IC8vaWQgb2YgZnJpZW5kIGdpc3Qgc2hhcmVkIHdpdGhcbiAgICAkc3RhdGUuZ28oJ3NoYXJlZC1naXN0cycse2lkOmlkfSwge2luaGVyaXQ6ZmFsc2V9KTtcbiAgfVxuXG59KTtcblxuYXBwLmNvbnRyb2xsZXIoJ1ZpZXdDb2RlQ3RybCcsIGZ1bmN0aW9uKCRzdGF0ZSwkc2NvcGUsICRzdGF0ZVBhcmFtcywgRnJpZW5kc0ZhY3Rvcnkpe1xuXG5cbiAgLy9UT0RPOlxuICAvL3ZhciBhbGxHaXN0cyA9IEZyaWVuZHNGYWN0b3J5LmdldEdpc3RzKCk7XG4gICRzY29wZS5jb2RlID0gRnJpZW5kc0ZhY3RvcnkudXNlckdpc3RzWyRzdGF0ZVBhcmFtcy5pZF07XG5cbiAgJHNjb3BlLmdvQmFjayA9IGZ1bmN0aW9uKG4pe1xuICAgIGlmKG49PT0xKXtcbiAgICAgICRzdGF0ZS5nbygnc2hhcmVkLWdpc3RzJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgICRzdGF0ZS5nbygnZnJpZW5kcycpO1xuICAgIH1cbiAgfVxuXG59KTtcblxuYXBwLmNvbnRyb2xsZXIoJ1NoYXJlZEdpc3RzQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgJHN0YXRlUGFyYW1zLCBGcmllbmRzRmFjdG9yeSwkaW9uaWNNb2RhbCwkc3RhdGUpIHtcbiAgLy9jb25zb2xlLmxvZygnc3RhdGVQYXJhbXMnLCRzdGF0ZVBhcmFtcy5pZCwnZ2lzdHMnLEZyaWVuZHNGYWN0b3J5LmdldEdpc3RzKCkpO1xuICAvL1RPRE86IFRoZXNlIGFyZSBhbGwgZ2lzdHMsIHlvdSBuZWVkIHRvIGZpbHRlciBiYXNlZCBvbiB0aGUgdXNlciBiZWZvcmUgcGxhY2Ugb24gc2NvcGUuXG4gICRzY29wZS5naXN0cyA9IFtdO1xuXG4gIC8vJHNjb3BlLmNvZGUgPSAnJztcblxuICB2YXIgYWxsR2lzdHMgPSBGcmllbmRzRmFjdG9yeS5nZXRHaXN0cygpIHx8IFtdO1xuXG4gICRzY29wZS5nb0JhY2sgPSBmdW5jdGlvbigpe1xuICAgICRzdGF0ZS5nbygnZnJpZW5kcycpO1xuICB9XG5cbiAgJHNjb3BlLnNob3dDb2RlID0gZnVuY3Rpb24oZ2lzdEluZGV4KXtcbiAgICBjb25zb2xlLmxvZyhnaXN0SW5kZXgpO1xuICAgICRzdGF0ZS5nbygndmlldy1jb2RlJyx7aWQ6Z2lzdEluZGV4fSwge2luaGVyaXQ6ZmFsc2V9KTtcbiAgICAvLyRzdGF0ZS5nbygndmlldy1jb2RlJyk7IC8vVE9ETzogd2hpY2ggb25lIHdhcyBjbGlja2VkLCBzZW5kIHBhcmFtIGlkLCBpbmRleCBvZiBnaXN0XG4gICAgLy9jb25zb2xlLmxvZygnc2hvd0NvZGUnLGNvZGUpO1xuICAgIC8vJHNjb3BlLmNvZGUgPSBjb2RlO1xuICAgIC8vJHNjb3BlLm9wZW5Nb2RhbChjb2RlKTtcbiAgfTtcblxuICAvL1RPRE86IE9ubHkgc2hvdyBhbGwgR2lzdHMgZnJvbSBzcGVjaWZpYyB1c2VyIGNsaWNrZWQgb25cbiAgLy9UT0RPOiBOZWVkIHRvIGFwcGx5IEpTT04gcGFyc2VcblxuICBhbGxHaXN0cy5mb3JFYWNoKGZ1bmN0aW9uKGdpc3Qpe1xuICAgIGlmKGdpc3QudXNlciA9PT0gJHN0YXRlUGFyYW1zLmlkKXtcbiAgICAgIEZyaWVuZHNGYWN0b3J5LnVzZXJHaXN0cy5wdXNoKGdpc3QuZ2lzdC5maWxlcy5maWxlTmFtZS5jb250ZW50KTtcbiAgICB9XG4gIH0pO1xuICAkc2NvcGUuZ2lzdHMgPSBGcmllbmRzRmFjdG9yeS51c2VyR2lzdHM7XG4gIC8vJGlvbmljTW9kYWwuZnJvbVRlbXBsYXRlVXJsKCdmZWF0dXJlcy9mcmllbmRzL2NvZGUtbW9kYWwuaHRtbCcsIHtcbiAgLy8gIHNjb3BlOiAkc2NvcGUsXG4gIC8vICBjYWNoZTogZmFsc2UsXG4gIC8vICBhbmltYXRpb246ICdzbGlkZS1pbi11cCdcbiAgLy99KS50aGVuKGZ1bmN0aW9uKG1vZGFsKSB7XG4gIC8vICAkc2NvcGUubW9kYWwgPSBtb2RhbDtcbiAgLy99KTtcbiAgLy8kc2NvcGUub3Blbk1vZGFsID0gZnVuY3Rpb24oY29kZSkge1xuICAvLyAgLy9jb25zb2xlLmxvZyhjb2RlKTtcbiAgLy8gICRzY29wZS5tb2RhbC5zaG93KCk7XG4gIC8vfTtcbiAgLy8kc2NvcGUuY2xvc2VNb2RhbCA9IGZ1bmN0aW9uKCkge1xuICAvLyAgJHNjb3BlLm1vZGFsLmhpZGUoKTtcbiAgLy99O1xuICAvLy8vQ2xlYW51cCB0aGUgbW9kYWwgd2hlbiB3ZSdyZSBkb25lIHdpdGggaXQhXG4gIC8vJHNjb3BlLiRvbignJGRlc3Ryb3knLCBmdW5jdGlvbigpIHtcbiAgLy8gICRzY29wZS5tb2RhbC5yZW1vdmUoKTtcbiAgLy99KTtcbiAgLy8vLyBFeGVjdXRlIGFjdGlvbiBvbiBoaWRlIG1vZGFsXG4gIC8vJHNjb3BlLiRvbignbW9kYWwuaGlkZGVuJywgZnVuY3Rpb24oKSB7XG4gIC8vICAvLyBFeGVjdXRlIGFjdGlvblxuICAvL30pO1xuICAvLy8vIEV4ZWN1dGUgYWN0aW9uIG9uIHJlbW92ZSBtb2RhbFxuICAvLyRzY29wZS4kb24oJ21vZGFsLnJlbW92ZWQnLCBmdW5jdGlvbigpIHtcbiAgLy8gIC8vIEV4ZWN1dGUgYWN0aW9uXG4gIC8vfSk7XG4gIC8vLy8kc2NvcGUuZ2lzdHMgPSBGcmllbmRzRmFjdG9yeS5nZXRHaXN0cygpO1xuXG59KTtcblxuLy9hcHAuZmFjdG9yeSgnQ2hhdHMnLCBmdW5jdGlvbigpIHtcbi8vICAvLyBNaWdodCB1c2UgYSByZXNvdXJjZSBoZXJlIHRoYXQgcmV0dXJucyBhIEpTT04gYXJyYXlcbi8vXG4vLyAgLy8gU29tZSBmYWtlIHRlc3RpbmcgZGF0YVxuLy8gIHZhciBjaGF0cyA9IFt7XG4vLyAgICBpZDogMCxcbi8vICAgIG5hbWU6ICdCZW4gU3BhcnJvdycsXG4vLyAgICBsYXN0VGV4dDogJ1lvdSBvbiB5b3VyIHdheT8nLFxuLy8gICAgZmFjZTogJ2h0dHBzOi8vcGJzLnR3aW1nLmNvbS9wcm9maWxlX2ltYWdlcy81MTQ1NDk4MTE3NjUyMTExMzYvOVNnQXVIZVkucG5nJ1xuLy8gIH0sIHtcbi8vICAgIGlkOiAxLFxuLy8gICAgbmFtZTogJ01heCBMeW54Jyxcbi8vICAgIGxhc3RUZXh0OiAnSGV5LCBpdFxcJ3Mgbm90IG1lJyxcbi8vICAgIGZhY2U6ICdodHRwczovL2F2YXRhcnMzLmdpdGh1YnVzZXJjb250ZW50LmNvbS91LzExMjE0P3Y9MyZzPTQ2MCdcbi8vICB9LHtcbi8vICAgIGlkOiAyLFxuLy8gICAgbmFtZTogJ0FkYW0gQnJhZGxleXNvbicsXG4vLyAgICBsYXN0VGV4dDogJ0kgc2hvdWxkIGJ1eSBhIGJvYXQnLFxuLy8gICAgZmFjZTogJ2h0dHBzOi8vcGJzLnR3aW1nLmNvbS9wcm9maWxlX2ltYWdlcy80NzkwOTA3OTQwNTgzNzkyNjQvODRUS2pfcWEuanBlZydcbi8vICB9LCB7XG4vLyAgICBpZDogMyxcbi8vICAgIG5hbWU6ICdQZXJyeSBHb3Zlcm5vcicsXG4vLyAgICBsYXN0VGV4dDogJ0xvb2sgYXQgbXkgbXVrbHVrcyEnLFxuLy8gICAgZmFjZTogJ2h0dHBzOi8vcGJzLnR3aW1nLmNvbS9wcm9maWxlX2ltYWdlcy80OTE5OTUzOTgxMzU3NjcwNDAvaWUyWl9WNmUuanBlZydcbi8vICB9LCB7XG4vLyAgICBpZDogNCxcbi8vICAgIG5hbWU6ICdNaWtlIEhhcnJpbmd0b24nLFxuLy8gICAgbGFzdFRleHQ6ICdUaGlzIGlzIHdpY2tlZCBnb29kIGljZSBjcmVhbS4nLFxuLy8gICAgZmFjZTogJ2h0dHBzOi8vcGJzLnR3aW1nLmNvbS9wcm9maWxlX2ltYWdlcy81NzgyMzcyODEzODQ4NDEyMTYvUjNhZTFuNjEucG5nJ1xuLy8gIH1dO1xuLy9cbi8vICByZXR1cm4ge1xuLy8gICAgYWxsOiBmdW5jdGlvbigpIHtcbi8vICAgICAgcmV0dXJuIGNoYXRzO1xuLy8gICAgfSxcbi8vICAgIHJlbW92ZTogZnVuY3Rpb24oY2hhdCkge1xuLy8gICAgICBjaGF0cy5zcGxpY2UoY2hhdHMuaW5kZXhPZihjaGF0KSwgMSk7XG4vLyAgICB9LFxuLy8gICAgZ2V0OiBmdW5jdGlvbihjaGF0SWQpIHtcbi8vICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaGF0cy5sZW5ndGg7IGkrKykge1xuLy8gICAgICAgIGlmIChjaGF0c1tpXS5pZCA9PT0gcGFyc2VJbnQoY2hhdElkKSkge1xuLy8gICAgICAgICAgcmV0dXJuIGNoYXRzW2ldO1xuLy8gICAgICAgIH1cbi8vICAgICAgfVxuLy8gICAgICByZXR1cm4gbnVsbDtcbi8vICAgIH1cbi8vICB9O1xuLy99KTtcblxuYXBwLmZhY3RvcnkoJ0ZyaWVuZHNGYWN0b3J5JyxmdW5jdGlvbigkaHR0cCwkcSxBcGlFbmRwb2ludCl7XG4gIC8vZ2V0IHVzZXIgdG8gYWRkIGFuZCByZXNwb25kIHRvIHVzZXJcbiAgdmFyIHVzZXJHaXN0cyA9IFtdO1xuICB2YXIgYWxsR2lzdHMgPSBbXTtcbiAgdmFyIGFkZEZyaWVuZCA9IGZ1bmN0aW9uKGZyaWVuZCl7XG4gICAgLy9jb25zb2xlLmxvZyhmcmllbmQpO1xuICAgIHJldHVybiAkaHR0cC5wb3N0KEFwaUVuZHBvaW50LnVybCtcIi91c2VyL2FkZEZyaWVuZFwiLHtmcmllbmQ6ZnJpZW5kfSk7XG4gIH07XG5cbiAgdmFyIGdldEZyaWVuZHMgPSBmdW5jdGlvbigpe1xuICAgIC8vY29uc29sZS5sb2coJ2dldEZyaWVuZHMgY2FsbGVkJylcbiAgICByZXR1cm4gJGh0dHAuZ2V0KEFwaUVuZHBvaW50LnVybCArIFwiL3VzZXIvZ2V0RnJpZW5kc1wiKTtcbiAgfTtcblxuXG4gIC8vVE9ETzogUmVtb3ZlIEdpc3RzIGZyb20gRnJpZW5kc0ZhY3RvcnkgLSBzaG91bGQgYmUgaW4gZ2lzdCBmYWN0b3J5IGFuZCBsb2FkZWQgb24gc3RhcnRcbiAgLy9UT0RPOiBZb3UgbmVlZCB0byByZWZhY3RvciBiZWNhdXNlIHlvdSBtYXkgZW5kIHVwIG9uIGFueSBwYWdlIHdpdGhvdXQgYW55IGRhdGEgYmVjYXVzZSBpdCB3YXMgbm90IGF2YWlsYWJsZSBpbiB0aGUgcHJldmlvdXMgcGFnZSAodGhlIHByZXZpb3VzIHBhZ2Ugd2FzIG5vdCBsb2FkZWQpXG4gIHZhciBzZXRHaXN0cyA9IGZ1bmN0aW9uKGdpc3RzKXtcbiAgICAvL2NvbnNvbGUubG9nKCdzZXRHaXN0cycpO1xuICAgIGFsbEdpc3RzID0gZ2lzdHM7XG4gIH07XG5cbiAgdmFyIGdldEdpc3RzID0gZnVuY3Rpb24oKXtcbiAgICBjb25zb2xlLmxvZygnYWxsR2lzdHMnLGFsbEdpc3RzKTtcbiAgICByZXR1cm4gYWxsR2lzdHMuZ2lzdHM7XG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICBhZGRGcmllbmQ6IGFkZEZyaWVuZCxcbiAgICBnZXRGcmllbmRzOiBnZXRGcmllbmRzLFxuICAgIGdldEdpc3RzOiBnZXRHaXN0cyxcbiAgICBzZXRHaXN0czogc2V0R2lzdHMsXG4gICAgdXNlckdpc3RzOiB1c2VyR2lzdHNcbiAgfTtcblxuICAvL1RPRE86IFVzZXIgaXMgbm90IGxvZ2dlZCBpbiwgc28geW91IGNhbm5vdCBhZGQgYSBmcmllbmRcbn0pO1xuIiwiYXBwLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlcil7XG5cdCRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdsb2dpbicsIHtcblx0XHR1cmwgOiAnL2xvZ2luJyxcblx0XHR0ZW1wbGF0ZVVybCA6ICdmZWF0dXJlcy9sb2dpbi9sb2dpbi5odG1sJyxcblx0XHRjb250cm9sbGVyIDogJ0xvZ2luQ3RybCdcblx0fSk7XG59KTtcblxuYXBwLmNvbnRyb2xsZXIoJ0xvZ2luQ3RybCcsIGZ1bmN0aW9uKCRyb290U2NvcGUsICRzY29wZSwgJGlvbmljUG9wdXAsICRzdGF0ZSwgQXV0aFNlcnZpY2Upe1xuXHQkc2NvcGUuZGF0YSA9IHt9O1xuXHQkc2NvcGUuZXJyb3IgPSBudWxsO1xuXG4gICAgJHNjb3BlLnNpZ251cCA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICRzdGF0ZS5nbygnc2lnbnVwJyk7XG4gICAgfTtcblxuXHQkc2NvcGUubG9naW4gPSBmdW5jdGlvbigpe1xuXHRcdEF1dGhTZXJ2aWNlXG5cdFx0XHQubG9naW4oJHNjb3BlLmRhdGEpXG5cdFx0XHQudGhlbihmdW5jdGlvbihhdXRoZW50aWNhdGVkKXsgLy9UT0RPOmF1dGhlbnRpY2F0ZWQgaXMgd2hhdCBpcyByZXR1cm5lZFxuXHRcdFx0XHQvL2NvbnNvbGUubG9nKCdsb2dpbiwgdGFiLmNoYWxsZW5nZS1zdWJtaXQnKTtcblx0XHRcdFx0Ly8kc2NvcGUubWVudSA9IHRydWU7XG5cdFx0XHRcdCRyb290U2NvcGUuJGJyb2FkY2FzdCgnQXV0aCcpO1xuXHRcdFx0XHQkc2NvcGUuc3RhdGVzLnB1c2goeyAvL1RPRE86IE5lZWQgdG8gYWRkIGEgcGFyZW50IGNvbnRyb2xsZXIgdG8gY29tbXVuaWNhdGVcblx0XHRcdFx0XHRuYW1lOiAnTG9nb3V0Jyxcblx0XHRcdFx0XHRyZWY6IGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0XHRBdXRoU2VydmljZS5sb2dvdXQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5kYXRhID0ge307XG5cdFx0XHRcdFx0XHQkc2NvcGUuc3RhdGVzLnBvcCgpOyAvL1RPRE86IEZpbmQgYSBiZXR0ZXIgd2F5IHRvIHJlbW92ZSB0aGUgTG9nb3V0IGxpbmssIGluc3RlYWQgb2YgcG9wXG5cdFx0XHRcdFx0XHQkc3RhdGUuZ28oJ3NpZ251cCcpO1xuXHRcdFx0XHRcdFx0JHJvb3RTY29wZS4kYnJvYWRjYXN0KCdBdXRoJyk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdFx0JHN0YXRlLmdvKCdleGVyY2lzbS52aWV3Jyk7XG5cdFx0XHRcdC8vVE9ETzogV2UgY2FuIHNldCB0aGUgdXNlciBuYW1lIGhlcmUgYXMgd2VsbC4gVXNlZCBpbiBjb25qdW5jdGlvbiB3aXRoIGEgbWFpbiBjdHJsXG5cdFx0XHR9KVxuXHRcdFx0LmNhdGNoKGZ1bmN0aW9uKGVycil7XG5cdFx0XHRcdCRzY29wZS5lcnJvciA9ICdMb2dpbiBJbnZhbGlkJztcblx0XHRcdFx0Y29uc29sZS5lcnJvcihKU09OLnN0cmluZ2lmeShlcnIpKVxuXHRcdFx0XHR2YXIgYWxlcnRQb3B1cCA9ICRpb25pY1BvcHVwLmFsZXJ0KHtcblx0XHRcdFx0XHR0aXRsZTogJ0xvZ2luIGZhaWxlZCEnLFxuXHRcdFx0XHRcdHRlbXBsYXRlOiAnUGxlYXNlIGNoZWNrIHlvdXIgY3JlZGVudGlhbHMhJ1xuXHRcdFx0XHR9KTtcblx0XHRcdH0pO1xuXHR9O1xufSk7XG5cblxuLy9UT0RPOiBDbGVhbnVwIGNvbW1lbnRlZCBjb2RlXG5cbiIsImFwcC5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIpe1xuXHQkc3RhdGVQcm92aWRlci5zdGF0ZSgnc2FuZGJveCcsIHtcblx0XHR0ZW1wbGF0ZVVybCA6ICdmZWF0dXJlcy9zYW5kYm94L3NhbmRib3guaHRtbCcsXG5cdFx0YWJzdHJhY3QgOiB0cnVlXG5cdH0pO1xufSk7XG5cbmFwcC5mYWN0b3J5KCdTYW5kYm94RmFjdG9yeScsIGZ1bmN0aW9uKCRodHRwLCBBcGlFbmRwb2ludCwgJHJvb3RTY29wZSwgJHN0YXRlKXtcblxuXHR2YXIgcHJvYmxlbSA9ICcnO1xuXHR2YXIgc3VibWlzc2lvbiA9ICcnO1xuXG5cdHZhciBydW5IaWRkZW4gPSBmdW5jdGlvbihjb2RlKSB7XG5cdCAgICB2YXIgaW5kZXhlZERCID0gbnVsbDtcblx0ICAgIHZhciBsb2NhdGlvbiA9IG51bGw7XG5cdCAgICB2YXIgbmF2aWdhdG9yID0gbnVsbDtcblx0ICAgIHZhciBvbmVycm9yID0gbnVsbDtcblx0ICAgIHZhciBvbm1lc3NhZ2UgPSBudWxsO1xuXHQgICAgdmFyIHBlcmZvcm1hbmNlID0gbnVsbDtcblx0ICAgIHZhciBzZWxmID0gbnVsbDtcblx0ICAgIHZhciB3ZWJraXRJbmRleGVkREIgPSBudWxsO1xuXHQgICAgdmFyIHBvc3RNZXNzYWdlID0gbnVsbDtcblx0ICAgIHZhciBjbG9zZSA9IG51bGw7XG5cdCAgICB2YXIgb3BlbkRhdGFiYXNlID0gbnVsbDtcblx0ICAgIHZhciBvcGVuRGF0YWJhc2VTeW5jID0gbnVsbDtcblx0ICAgIHZhciB3ZWJraXRSZXF1ZXN0RmlsZVN5c3RlbSA9IG51bGw7XG5cdCAgICB2YXIgd2Via2l0UmVxdWVzdEZpbGVTeXN0ZW1TeW5jID0gbnVsbDtcblx0ICAgIHZhciB3ZWJraXRSZXNvbHZlTG9jYWxGaWxlU3lzdGVtU3luY1VSTCA9IG51bGw7XG5cdCAgICB2YXIgd2Via2l0UmVzb2x2ZUxvY2FsRmlsZVN5c3RlbVVSTCA9IG51bGw7XG5cdCAgICB2YXIgYWRkRXZlbnRMaXN0ZW5lciA9IG51bGw7XG5cdCAgICB2YXIgZGlzcGF0Y2hFdmVudCA9IG51bGw7XG5cdCAgICB2YXIgcmVtb3ZlRXZlbnRMaXN0ZW5lciA9IG51bGw7XG5cdCAgICB2YXIgZHVtcCA9IG51bGw7XG5cdCAgICB2YXIgb25vZmZsaW5lID0gbnVsbDtcblx0ICAgIHZhciBvbm9ubGluZSA9IG51bGw7XG5cdCAgICB2YXIgaW1wb3J0U2NyaXB0cyA9IG51bGw7XG5cdCAgICB2YXIgY29uc29sZSA9IG51bGw7XG5cdCAgICB2YXIgYXBwbGljYXRpb24gPSBudWxsO1xuXG5cdCAgICByZXR1cm4gZXZhbChjb2RlKTtcblx0fTtcblxuXHQvLyBjb252ZXJ0cyB0aGUgb3V0cHV0IGludG8gYSBzdHJpbmdcblx0dmFyIHN0cmluZ2lmeSA9IGZ1bmN0aW9uKG91dHB1dCkge1xuXHQgICAgdmFyIHJlc3VsdDtcblxuXHQgICAgaWYgKHR5cGVvZiBvdXRwdXQgPT0gJ3VuZGVmaW5lZCcpIHtcblx0ICAgICAgICByZXN1bHQgPSAndW5kZWZpbmVkJztcblx0ICAgIH0gZWxzZSBpZiAob3V0cHV0ID09PSBudWxsKSB7XG5cdCAgICAgICAgcmVzdWx0ID0gJ251bGwnO1xuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgICByZXN1bHQgPSBKU09OLnN0cmluZ2lmeShvdXRwdXQpIHx8IG91dHB1dC50b1N0cmluZygpO1xuXHQgICAgfVxuXG5cdCAgICByZXR1cm4gcmVzdWx0O1xuXHR9O1xuXG5cdHZhciBydW4gPSBmdW5jdGlvbihjb2RlKSB7XG5cdCAgICB2YXIgcmVzdWx0ID0ge1xuXHQgICAgICAgIGlucHV0OiBjb2RlLFxuXHQgICAgICAgIG91dHB1dDogbnVsbCxcblx0ICAgICAgICBlcnJvcjogbnVsbFxuXHQgICAgfTtcblxuXHQgICAgdHJ5IHtcblx0ICAgICAgICByZXN1bHQub3V0cHV0ID0gc3RyaW5naWZ5KHJ1bkhpZGRlbihjb2RlKSk7XG5cdCAgICB9IGNhdGNoKGUpIHtcblx0ICAgICAgICByZXN1bHQuZXJyb3IgPSBlLm1lc3NhZ2U7XG5cdCAgICB9XG5cdCAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG5cblxuXHRyZXR1cm4ge1xuXHRcdGdldENoYWxsZW5nZSA6IGZ1bmN0aW9uKGlkKXtcblx0XHRcdHJldHVybiAkaHR0cC5nZXQoQXBpRW5kcG9pbnQudXJsICsgJy9jaGFsbGVuZ2UvJyArIGlkKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcblx0XHRcdFx0cHJvYmxlbSA9IHJlc3BvbnNlLmRhdGE7XG5cdFx0XHRcdHN1Ym1pc3Npb24gPSBwcm9ibGVtLnNlc3Npb24uc2V0dXAgfHwgJyc7XG5cdFx0XHRcdCRyb290U2NvcGUuJGJyb2FkY2FzdCgncHJvYmxlbVVwZGF0ZWQnKTtcblx0XHRcdFx0cmV0dXJuIHJlc3BvbnNlLmRhdGE7XG5cdFx0XHR9KTtcblx0XHR9LFxuXHRcdHNldFN1Ym1pc3Npb24gOiBmdW5jdGlvbihjb2RlKXtcblx0XHRcdHN1Ym1pc3Npb24gPSBjb2RlO1xuXHRcdFx0JHJvb3RTY29wZS4kYnJvYWRjYXN0KCdzdWJtaXNzaW9uVXBkYXRlZCcpO1xuXHRcdH0sXG5cdFx0Y29tcGlsZVN1Ym1pc3Npb246IGZ1bmN0aW9uKGNvZGUpe1xuXHRcdFx0cmV0dXJuIHJ1bihjb2RlKTtcblx0XHR9LFxuXHRcdGdldFN1Ym1pc3Npb24gOiBmdW5jdGlvbigpe1xuXHRcdFx0cmV0dXJuIHN1Ym1pc3Npb247XG5cdFx0fSxcblx0XHRnZXRQcm9ibGVtIDogZnVuY3Rpb24oKXtcblx0XHRcdHJldHVybiBwcm9ibGVtO1xuXHRcdH1cblx0fTtcbn0pOyIsImFwcC5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIpe1xuXHQkc3RhdGVQcm92aWRlci5zdGF0ZSgnc2FuZGJveC5jb2RlJywge1xuXHRcdHVybCA6ICcvc2FuZGJveC9jb2RlJyxcblx0XHR2aWV3czoge1xuXHRcdFx0J3RhYi1jb2RlJyA6IHtcblx0XHRcdFx0dGVtcGxhdGVVcmwgOiAnZmVhdHVyZXMvc2FuZGJveC1jb2RlL3NhbmRib3gtY29kZS5odG1sJyxcblx0XHRcdFx0Y29udHJvbGxlciA6ICdTYW5kYm94Q29kZUN0cmwnXG5cdFx0XHR9XG5cdFx0fVxuXHR9KTtcbn0pO1xuXG5cbmFwcC5jb250cm9sbGVyKCdTYW5kYm94Q29kZUN0cmwnLCBmdW5jdGlvbigkc2NvcGUsICRzdGF0ZSwgU2FuZGJveEZhY3RvcnksIEV4ZXJjaXNtRmFjdG9yeSwgS2V5Ym9hcmRGYWN0b3J5KXtcblx0JHNjb3BlLmNvZGUgPSB7XG5cdFx0dGV4dCA6ICcnXG5cdH07XG5cblx0JHNjb3BlLmJ1dHRvbnMgPSB7XG5cdFx0Y29tcGlsZSA6ICdDb21waWxlJyxcblx0XHRzYXZlIDogJ1NhdmUnXG5cdH07XG5cblx0JHNjb3BlLmNvbXBpbGUgPSBmdW5jdGlvbihjb2RlKXtcblx0XHRTYW5kYm94RmFjdG9yeS5zZXRTdWJtaXNzaW9uKGNvZGUpO1xuXHRcdCRzdGF0ZS5nbygnc2FuZGJveC5jb21waWxlJyk7XG5cdH07XG5cblx0JHNjb3BlLnNhdmUgPSBmdW5jdGlvbihjb2RlKXtcblxuXHR9O1xuXG5cdCRzY29wZS5pbnNlcnRGdW5jID0gS2V5Ym9hcmRGYWN0b3J5Lm1ha2VJbnNlcnRGdW5jKCRzY29wZSk7XG5cblx0Ly8gJHNjb3BlLnNhdmVDaGFsbGVuZ2UgPSBmdW5jdGlvbigpe1xuXHQvLyBcdGNvbnNvbGUubG9nKFwic2F2ZSBzY29wZS50ZXh0XCIsICRzY29wZS50ZXh0KTtcblx0Ly8gXHQkbG9jYWxzdG9yYWdlLnNldChcInRlc3RpbmdcIiwgJHNjb3BlLnRleHQpO1xuXHQvLyB9O1xuXG5cdC8vICRzY29wZS5nZXRTYXZlZCA9IGZ1bmN0aW9uKCl7XG5cdC8vIFx0Y29uc29sZS5sb2coXCJzYXZlIHNjb3BlLnRleHRcIiwgJHNjb3BlLnRleHQpO1xuXHQvLyBcdGNvbnNvbGUubG9nKFwiZW50ZXJlZCBnZXRzYXZlZCBmdW5jXCIpO1xuXHQvLyBcdCRzY29wZS50ZXh0ID0gJGxvY2Fsc3RvcmFnZS5nZXQoXCJ0ZXN0aW5nXCIpO1xuXHQvLyB9O1xuXG59KTsiLCJhcHAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKXtcblx0JHN0YXRlUHJvdmlkZXIuc3RhdGUoJ3NhbmRib3guY29tcGlsZScsIHtcblx0XHR1cmwgOiAnL3NhbmRib3gvY29tcGlsZScsXG5cdFx0dmlld3MgOiB7XG5cdFx0XHQndGFiLWNvbXBpbGUnIDoge1xuXHRcdFx0XHR0ZW1wbGF0ZVVybCA6ICdmZWF0dXJlcy9zYW5kYm94LWNvbXBpbGUvc2FuZGJveC1jb21waWxlLmh0bWwnLFxuXHRcdFx0XHRjb250cm9sbGVyOiAnU2FuZGJveENvbXBpbGVDdHJsJ1xuXHRcdFx0fVxuXHRcdH1cblx0fSk7XG59KTtcblxuYXBwLmNvbnRyb2xsZXIoJ1NhbmRib3hDb21waWxlQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgU2FuZGJveEZhY3Rvcnkpe1xuXHQkc2NvcGUucXVlc3Rpb24gPSBTYW5kYm94RmFjdG9yeS5nZXRTdWJtaXNzaW9uKCk7XG5cdHZhciByZXN1bHRzID0gU2FuZGJveEZhY3RvcnkuY29tcGlsZVN1Ym1pc3Npb24oJHNjb3BlLnF1ZXN0aW9uKTtcblx0JHNjb3BlLnJlc3VsdHMgPSByZXN1bHRzO1xuXHQkc2NvcGUub3V0cHV0ID0gU2FuZGJveEZhY3RvcnkuY29tcGlsZVN1Ym1pc3Npb24oJHNjb3BlLnF1ZXN0aW9uKS5vdXRwdXQ7XG5cdCRzY29wZS5lcnJvciA9IFNhbmRib3hGYWN0b3J5LmNvbXBpbGVTdWJtaXNzaW9uKCRzY29wZS5xdWVzdGlvbikuZXJyb3I7XG5cblx0JHNjb3BlLiRvbignc3VibWlzc2lvblVwZGF0ZWQnLCBmdW5jdGlvbihlKXtcblx0XHQkc2NvcGUucXVlc3Rpb24gPSBTYW5kYm94RmFjdG9yeS5nZXRTdWJtaXNzaW9uKCk7XG5cdFx0cmVzdWx0cyA9IFNhbmRib3hGYWN0b3J5LmNvbXBpbGVTdWJtaXNzaW9uKCRzY29wZS5xdWVzdGlvbik7XG5cdFx0JHNjb3BlLnJlc3VsdHMgPSByZXN1bHRzO1xuXHRcdCRzY29wZS5vdXRwdXQgPSBTYW5kYm94RmFjdG9yeS5jb21waWxlU3VibWlzc2lvbigkc2NvcGUucXVlc3Rpb24pLm91dHB1dDtcblx0XHQkc2NvcGUuZXJyb3IgPSBTYW5kYm94RmFjdG9yeS5jb21waWxlU3VibWlzc2lvbigkc2NvcGUucXVlc3Rpb24pLmVycm9yO1xuXHR9KTtcbn0pOyIsImFwcC5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIpe1xuICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdzaWdudXAnLHtcbiAgICAgICAgdXJsOlwiL3NpZ251cFwiLFxuICAgICAgICB0ZW1wbGF0ZVVybDogXCJmZWF0dXJlcy9zaWdudXAvc2lnbnVwLmh0bWxcIixcbiAgICAgICAgY29udHJvbGxlcjogJ1NpZ25VcEN0cmwnXG4gICAgfSk7XG59KTtcblxuYXBwLmNvbnRyb2xsZXIoJ1NpZ25VcEN0cmwnLGZ1bmN0aW9uKCRyb290U2NvcGUsICRodHRwLCAkc2NvcGUsICRzdGF0ZSwgQXV0aFNlcnZpY2UsICRpb25pY1BvcHVwKXtcbiAgICAkc2NvcGUuZGF0YSA9IHt9O1xuICAgICRzY29wZS5lcnJvciA9IG51bGw7XG5cbiAgICAkc2NvcGUubG9naW4gPSBmdW5jdGlvbigpe1xuICAgICAgICAkc3RhdGUuZ28oJ2xvZ2luJyk7XG4gICAgfTtcblxuICAgICRzY29wZS5zaWdudXAgPSBmdW5jdGlvbigpe1xuICAgICAgICBBdXRoU2VydmljZVxuICAgICAgICAgICAgLnNpZ251cCgkc2NvcGUuZGF0YSlcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKGF1dGhlbnRpY2F0ZWQpe1xuICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ3NpZ251cCwgdGFiLmNoYWxsZW5nZScpO1xuICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdCgnQXV0aCcpO1xuICAgICAgICAgICAgICAgICRzY29wZS5zdGF0ZXMucHVzaCh7IC8vVE9ETzogTmVlZCB0byBhZGQgYSBwYXJlbnQgY29udHJvbGxlciB0byBjb21tdW5pY2F0ZVxuICAgICAgICAgICAgICAgICAgICBuYW1lOiAnTG9nb3V0JyxcbiAgICAgICAgICAgICAgICAgICAgcmVmOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICAgICAgQXV0aFNlcnZpY2UubG9nb3V0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZGF0YSA9IHt9O1xuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnN0YXRlcy5wb3AoKTsgLy9UT0RPOiBGaW5kIGEgYmV0dGVyIHdheSB0byByZW1vdmUgdGhlIExvZ291dCBsaW5rLCBpbnN0ZWFkIG9mIHBvcFxuICAgICAgICAgICAgICAgICAgICAgICAgJHN0YXRlLmdvKCdzaWdudXAnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdCgnQXV0aCcpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgJHN0YXRlLmdvKCdleGVyY2lzbS52aWV3Jyk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmNhdGNoKGZ1bmN0aW9uKGVycil7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmVycm9yID0gJ1NpZ251cCBJbnZhbGlkJztcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKEpTT04uc3RyaW5naWZ5KGVycikpXG4gICAgICAgICAgICAgICAgdmFyIGFsZXJ0UG9wdXAgPSAkaW9uaWNQb3B1cC5hbGVydCh7XG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnU2lnbnVwIGZhaWxlZCEnLFxuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogJ1BsZWFzZSBjaGVjayB5b3VyIGNyZWRlbnRpYWxzISdcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgIH07XG5cbn0pO1xuXG4vL1RPRE86IEZvcm0gVmFsaWRhdGlvblxuLy9UT0RPOiBDbGVhbnVwIGNvbW1lbnRlZCBjb2RlIiwiYXBwLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlcil7XG5cdCRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdzbmlwcGV0Jywge1xuXHRcdGNhY2hlOiBmYWxzZSxcblx0XHR1cmwgOiAnL3NuaXBwZXQvOmlkJyxcblx0XHR0ZW1wbGF0ZVVybCA6ICdmZWF0dXJlcy9zbmlwcGV0LWVkaXQvc25pcHBldC1lZGl0Lmh0bWwnLFxuXHRcdGNvbnRyb2xsZXI6ICdTbmlwcGV0RWRpdEN0cmwnXG5cdH0pO1xufSk7XG5cbmFwcC5jb250cm9sbGVyKCdTbmlwcGV0RWRpdEN0cmwnLCBmdW5jdGlvbigkc2NvcGUsICRzdGF0ZSwgJHN0YXRlUGFyYW1zLCBDb2RlU25pcHBldEZhY3RvcnksIEtleWJvYXJkRmFjdG9yeSl7XG5cdCRzY29wZS5idXR0b25zID0ge1xuXHRcdGVkaXQgOiAnRWRpdCcsXG5cdFx0Y2FuY2VsIDogJ0NhbmNlbCcsXG5cdFx0ZGVsZXRlIDogJ0RlbGV0ZSdcblx0fTtcblx0JHNjb3BlLnNuaXBwZXQgPSBDb2RlU25pcHBldEZhY3RvcnkuZ2V0U25pcHBldCgkc3RhdGVQYXJhbXMuaWQpO1xuXG5cdCRzY29wZS5pbnNlcnRGdW5jID0gS2V5Ym9hcmRGYWN0b3J5Lm1ha2VJbnNlcnRGdW5jKCRzY29wZSk7XG5cblx0JHNjb3BlLmVkaXQgPSBmdW5jdGlvbihzbmlwcGV0KXtcblx0XHRDb2RlU25pcHBldEZhY3RvcnkuZWRpdFNuaXBwZXQoJHN0YXRlUGFyYW1zLmlkLCBzbmlwcGV0KTtcblx0XHQkc3RhdGUuZ28oJ3NuaXBwZXRzJyk7XG5cdH07XG5cblx0JHNjb3BlLmRlbGV0ZSA9IGZ1bmN0aW9uKCl7XG5cdFx0Q29kZVNuaXBwZXRGYWN0b3J5LmRlbGV0ZVNuaXBwZXQoJHN0YXRlUGFyYW1zLmlkKTtcblx0XHQkc3RhdGUuZ28oJ3NuaXBwZXRzJyk7XG5cdH07XG5cblx0JHNjb3BlLmNhbmNlbCA9IGZ1bmN0aW9uKCl7XG5cdFx0JHN0YXRlLmdvKCdzbmlwcGV0cycpO1xuXHR9O1xufSk7IiwiYXBwLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlcil7XG5cdCRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdzbmlwcGV0cycsIHtcblx0XHR1cmwgOiAnL3NuaXBwZXRzJyxcblx0XHR0ZW1wbGF0ZVVybCA6ICdmZWF0dXJlcy9zbmlwcGV0cy9zbmlwcGV0cy5odG1sJyxcblx0XHRjb250cm9sbGVyIDogJ1NuaXBwZXRzQ3RybCdcblx0fSk7XG59KTtcblxuYXBwLmNvbnRyb2xsZXIoJ1NuaXBwZXRzQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgJHJvb3RTY29wZSwgJHN0YXRlLCBDb2RlU25pcHBldEZhY3Rvcnkpe1xuXHQkc2NvcGUuc25pcHBldHMgPSBDb2RlU25pcHBldEZhY3RvcnkuZ2V0QWxsU25pcHBldHMoKTtcblx0JHNjb3BlLnJlbW92ZSA9IENvZGVTbmlwcGV0RmFjdG9yeS5kZWxldGVTbmlwcGV0O1xuXG5cdCRyb290U2NvcGUuJG9uKCdmb290ZXJVcGRhdGVkJywgZnVuY3Rpb24oZXZlbnQpe1xuXHRcdCRzY29wZS5zbmlwcGV0cyA9IENvZGVTbmlwcGV0RmFjdG9yeS5nZXRBbGxTbmlwcGV0cygpO1xuXHR9KTtcblxuXHQkc2NvcGUuY3JlYXRlID0gZnVuY3Rpb24oKXtcblx0XHQkc3RhdGUuZ28oJ3NuaXBwZXRzLWNyZWF0ZScpO1xuXHR9O1xufSk7IiwiYXBwLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlcil7XG5cdCRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdzbmlwcGV0cy1jcmVhdGUnLCB7XG5cdFx0dXJsOiAnL3NuaXBwZXRzL2NyZWF0ZScsXG5cdFx0dGVtcGxhdGVVcmwgOiAnZmVhdHVyZXMvc25pcHBldHMtY3JlYXRlL3NuaXBwZXRzLWNyZWF0ZS5odG1sJyxcblx0XHRjb250cm9sbGVyOiAnU25pcHBldHNDcmVhdGVDdHJsJ1xuXHR9KTtcbn0pO1xuXG5hcHAuY29udHJvbGxlcignU25pcHBldHNDcmVhdGVDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCAkc3RhdGUsIEtleWJvYXJkRmFjdG9yeSwgQ29kZVNuaXBwZXRGYWN0b3J5KXtcblx0JHNjb3BlLnNuaXBwZXQgPSB7XG5cdFx0ZGlzcGxheSA6ICcnLFxuXHRcdGluc2VydFBhcmFtIDogJydcblx0fTtcblxuXHQkc2NvcGUuaW5zZXJ0RnVuYyA9IEtleWJvYXJkRmFjdG9yeS5tYWtlSW5zZXJ0RnVuYygkc2NvcGUpO1xuXG5cdCRzY29wZS5jcmVhdGUgPSBmdW5jdGlvbihzbmlwcGV0KXtcblx0XHRDb2RlU25pcHBldEZhY3RvcnkuYWRkU25pcHBldChzbmlwcGV0KTtcblx0XHQkc3RhdGUuZ28oJ3NuaXBwZXRzJyk7XG5cdH07XG59KTsiLCJhcHAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKXtcblx0JHN0YXRlUHJvdmlkZXIuc3RhdGUoJ3dlbGNvbWUnLCB7XG5cdFx0dXJsIDogJy93ZWxjb21lJyxcblx0XHR0ZW1wbGF0ZVVybCA6ICdmZWF0dXJlcy93ZWxjb21lL3dlbGNvbWUuaHRtbCcsXG5cdFx0Y29udHJvbGxlciA6ICdXZWxjb21lQ3RybCdcblx0fSk7XG59KTtcbmFwcC5jb250cm9sbGVyKCdXZWxjb21lQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgJHN0YXRlLCBBdXRoU2VydmljZSwgJHJvb3RTY29wZSwgR2lzdEZhY3RvcnksICRpb25pY1BvcHVwKXtcblx0Ly9UT0RPOiBTcGxhc2ggcGFnZSB3aGlsZSB5b3UgbG9hZCByZXNvdXJjZXMgKHBvc3NpYmxlIGlkZWEpXG5cdC8vY29uc29sZS5sb2coJ1dlbGNvbWVDdHJsJyk7XG5cdCRzY29wZS5idXR0b25zID0ge1xuXHRcdGxvZ2luIDogJ2xvZ2luJyxcblx0XHRzaWdudXAgOiAnc2lnbnVwJ1xuXHR9O1xuXG5cdC8vIGlvbmljLlBsYXRmb3JtLnJlYWR5KGZ1bmN0aW9uKCl7XG5cdC8vIFx0aW9uaWMuUGxhdGZvcm0uc2hvd1N0YXR1c0JhcihmYWxzZSk7XG5cdC8vIH0pO1xuXG5cdCRzY29wZS5sb2dpbiA9IGZ1bmN0aW9uKCl7XG5cdFx0JHN0YXRlLmdvKCdsb2dpbicpO1xuXHR9O1xuXHQkc2NvcGUuc2lnbnVwID0gZnVuY3Rpb24oKXtcblx0XHQkc3RhdGUuZ28oJ3NpZ251cCcpO1xuXHR9O1xuXG48PDw8PDw8IEhFQURcblx0dmFyIGF1dGhSZXEgPSAhZmFsc2U7IC8vVE9ETzogVG9nZ2xlIGZvciB1c2luZyBhdXRoZW50aWNhdGlvbiB3b3JrIGZsb3cgLSByZXF1aXJlIGJhY2tlbmQgd2lyZWQgdXBcbj09PT09PT1cblx0Ly8gaWYgKEF1dGhTZXJ2aWNlLmlzQXV0aGVudGljYXRlZCgpKSB7XG5cdC8vIFx0JHJvb3RTY29wZS4kYnJvYWRjYXN0KCdBdXRoJyk7XG5cdC8vIFx0JHNjb3BlLnN0YXRlcy5wdXNoKHsgLy9UT0RPOiBOZWVkIHRvIGFkZCBhIHBhcmVudCBjb250cm9sbGVyIHRvIGNvbW11bmljYXRlXG5cdC8vIFx0XHRuYW1lOiAnTG9nb3V0Jyxcblx0Ly8gXHRcdHJlZjogZnVuY3Rpb24oKXtcblx0Ly8gXHRcdFx0QXV0aFNlcnZpY2UubG9nb3V0KCk7XG5cdC8vIFx0XHRcdCRzY29wZS5kYXRhID0ge307XG5cdC8vIFx0XHRcdCRzY29wZS5zdGF0ZXMucG9wKCk7IC8vVE9ETzogRmluZCBhIGJldHRlciB3YXkgdG8gcmVtb3ZlIHRoZSBMb2dvdXQgbGluaywgaW5zdGVhZCBvZiBwb3Bcblx0Ly8gXHRcdFx0JHN0YXRlLmdvKCdzaWdudXAnKTtcblx0Ly8gXHRcdH1cblx0Ly8gXHR9KTtcblx0Ly8gXHQkc3RhdGUuZ28oJ2V4ZXJjaXNtLnZpZXcnKTtcblx0Ly8gfSBlbHNlIHtcblx0Ly8gXHQvLyBUT0RPOiAkc3RhdGUuZ28oJ3NpZ251cCcpOyBSZW1vdmUgQmVsb3cgbGluZVxuXHQvLyBcdC8vICRzdGF0ZS5nbygnZXhlcmNpc20udmlldycpO1xuXHQvLyB9XG5cdHZhciBhdXRoUmVxID0gZmFsc2U7IC8vVE9ETzogVG9nZ2xlIGZvciB1c2luZyBhdXRoZW50aWNhdGlvbiB3b3JrIGZsb3cgLSByZXF1aXJlIGJhY2tlbmQgd2lyZWQgdXBcbj4+Pj4+Pj4gZGV2ZWxvcG1lbnRcblxuXHRpZiAoIWF1dGhSZXEpe1xuXHRcdCRzdGF0ZS5nbygnZXhlcmNpc20udmlldycpO1xuXHR9IGVsc2Uge1xuXHRcdGlmIChBdXRoU2VydmljZS5pc0F1dGhlbnRpY2F0ZWQoKSkge1xuXHRcdFx0JHJvb3RTY29wZS4kYnJvYWRjYXN0KCdBdXRoJyk7XG5cdFx0XHQkc2NvcGUuc3RhdGVzLnB1c2goeyAvL1RPRE86IE5lZWQgdG8gYWRkIGEgcGFyZW50IGNvbnRyb2xsZXIgdG8gY29tbXVuaWNhdGVcblx0XHRcdFx0bmFtZTogJ0xvZ291dCcsXG5cdFx0XHRcdHJlZjogZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRBdXRoU2VydmljZS5sb2dvdXQoKTtcblx0XHRcdFx0XHQkc2NvcGUuZGF0YSA9IHt9O1xuXHRcdFx0XHRcdCRzY29wZS5zdGF0ZXMucG9wKCk7IC8vVE9ETzogRmluZCBhIGJldHRlciB3YXkgdG8gcmVtb3ZlIHRoZSBMb2dvdXQgbGluaywgaW5zdGVhZCBvZiBwb3Bcblx0XHRcdFx0XHQkc3RhdGUuZ28oJ2xvZ2luJyk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXG5cdFx0XHQvL3BvcC11cCBvcHRpb25zLCB2aWV3IHNoYXJlZCBjb2RlIG9yXG5cdFx0XHQvL1RPRE86IEhhcHBlbiBvbiBMb2dpbiwgcmVjaWV2ZSBnaXN0IG5vdGlmaWNhdGlvblxuXHRcdFx0R2lzdEZhY3RvcnkucXVldWVkR2lzdHMoKS50aGVuKGdpc3RzUngpO1xuXG5cdFx0XHRmdW5jdGlvbiBnaXN0c1J4KHJlc3BvbnNlKXtcblx0XHRcdFx0Y29uc29sZS5sb2cocmVzcG9uc2UuZGF0YS5naXN0cyk7XG5cdFx0XHRcdGlmKHJlc3BvbnNlLmRhdGEuZ2lzdHMubGVuZ3RoICE9PTApe1xuXHRcdFx0XHRcdC8vY29uc29sZS5sb2coJ25vdGlmeSB1c2VyIG9mIFJ4IGdpc3RzJylcblx0XHRcdFx0XHRzaG93Q29uZmlybSA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0dmFyIGNvbmZpcm1Qb3B1cCA9ICRpb25pY1BvcHVwLmNvbmZpcm0oe1xuXHRcdFx0XHRcdFx0XHR0aXRsZTogJ1lvdSBnb3QgQ29kZSEnLFxuXHRcdFx0XHRcdFx0XHR0ZW1wbGF0ZTogJ1lvdXIgZnJpZW5kcyBzaGFyZWQgc29tZSBjb2RlLCBkbyB5b3Ugd2FudCB0byB0YWtlIGEgbG9vaz8nXG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdC8vVE9ETzogQ3VzdG9tIFBvcFVwIEluc3RlYWRcblx0XHRcdFx0XHRcdC8vVE9ETzogWW91IG5lZWQgdG8gYWNjb3VudCBmb3IgbG9naW4gKHRoaXMgb25seSBhY2NvdW50cyBmb3IgdXNlciBsb2FkaW5nIGFwcCwgYWxyZWFkeSBsb2dnZWQgaW4pXG5cdFx0XHRcdFx0XHRjb25maXJtUG9wdXAudGhlbihmdW5jdGlvbihyZXMpIHtcblx0XHRcdFx0XHRcdFx0aWYocmVzKSB7XG5cdFx0XHRcdFx0XHRcdFx0Ly9jb25zb2xlLmxvZygnWW91IGFyZSBzdXJlJyk7XG5cdFx0XHRcdFx0XHRcdFx0JHN0YXRlLmdvKCdmcmllbmRzJyk7XG5cdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0Ly9jb25zb2xlLmxvZygnWW91IGFyZSBub3Qgc3VyZScpO1xuXHRcdFx0XHRcdFx0XHRcdCRzdGF0ZS5nbygnZXhlcmNpc20uY29tcGlsZScpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR9O1xuXG5cdFx0XHRcdFx0c2hvd0NvbmZpcm0oKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQkc3RhdGUuZ28oJ2V4ZXJjaXNtLmNvbXBpbGUnKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cblx0XHR9IGVsc2Uge1xuXHRcdFx0Ly9UT0RPOiAkc3RhdGUuZ28oJ3NpZ251cCcpOyBSZW1vdmUgQmVsb3cgbGluZVxuXHRcdFx0JHN0YXRlLmdvKCdzaWdudXAnKTtcblx0XHR9XG5cdH1cbn0pOyIsIi8vdG9rZW4gaXMgc2VudCBvbiBldmVyeSBodHRwIHJlcXVlc3RcbmFwcC5mYWN0b3J5KCdBdXRoSW50ZXJjZXB0b3InLGZ1bmN0aW9uIEF1dGhJbnRlcmNlcHRvcihBVVRIX0VWRU5UUywkcm9vdFNjb3BlLCRxLEF1dGhUb2tlbkZhY3Rvcnkpe1xuXG4gICAgdmFyIHN0YXR1c0RpY3QgPSB7XG4gICAgICAgIDQwMTogQVVUSF9FVkVOVFMubm90QXV0aGVudGljYXRlZCxcbiAgICAgICAgNDAzOiBBVVRIX0VWRU5UUy5ub3RBdXRob3JpemVkXG4gICAgfTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIHJlcXVlc3Q6IGFkZFRva2VuLFxuICAgICAgICByZXNwb25zZUVycm9yOiBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdChzdGF0dXNEaWN0W3Jlc3BvbnNlLnN0YXR1c10sIHJlc3BvbnNlKTtcbiAgICAgICAgICAgIHJldHVybiAkcS5yZWplY3QocmVzcG9uc2UpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIGFkZFRva2VuKGNvbmZpZyl7XG4gICAgICAgIHZhciB0b2tlbiA9IEF1dGhUb2tlbkZhY3RvcnkuZ2V0VG9rZW4oKTtcbiAgICAgICAgLy9jb25zb2xlLmxvZygnYWRkVG9rZW4nLHRva2VuKTtcbiAgICAgICAgaWYodG9rZW4pe1xuICAgICAgICAgICAgY29uZmlnLmhlYWRlcnMgPSBjb25maWcuaGVhZGVycyB8fCB7fTtcbiAgICAgICAgICAgIGNvbmZpZy5oZWFkZXJzLkF1dGhvcml6YXRpb24gPSAnQmVhcmVyICcgKyB0b2tlbjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY29uZmlnO1xuICAgIH1cbn0pO1xuLy9za2lwcGVkIEF1dGggSW50ZXJjZXB0b3JzIGdpdmVuIFRPRE86IFlvdSBjb3VsZCBhcHBseSB0aGUgYXBwcm9hY2ggaW5cbi8vaHR0cDovL2RldmRhY3RpYy5jb20vdXNlci1hdXRoLWFuZ3VsYXJqcy1pb25pYy9cblxuYXBwLmNvbmZpZyhmdW5jdGlvbigkaHR0cFByb3ZpZGVyKXtcbiAgICAkaHR0cFByb3ZpZGVyLmludGVyY2VwdG9ycy5wdXNoKCdBdXRoSW50ZXJjZXB0b3InKTtcbn0pO1xuXG5hcHAuY29uc3RhbnQoJ0FVVEhfRVZFTlRTJywge1xuICAgICAgICBub3RBdXRoZW50aWNhdGVkOiAnYXV0aC1ub3QtYXV0aGVudGljYXRlZCcsXG4gICAgICAgIG5vdEF1dGhvcml6ZWQ6ICdhdXRoLW5vdC1hdXRob3JpemVkJ1xufSk7XG5cbmFwcC5jb25zdGFudCgnVVNFUl9ST0xFUycsIHtcbiAgICAgICAgLy9hZG1pbjogJ2FkbWluX3JvbGUnLFxuICAgICAgICBwdWJsaWM6ICdwdWJsaWNfcm9sZSdcbn0pO1xuXG5hcHAuZmFjdG9yeSgnQXV0aFRva2VuRmFjdG9yeScsZnVuY3Rpb24oJHdpbmRvdyl7XG4gICAgdmFyIHN0b3JlID0gJHdpbmRvdy5sb2NhbFN0b3JhZ2U7XG4gICAgdmFyIGtleSA9ICdhdXRoLXRva2VuJztcblxuICAgIHJldHVybiB7XG4gICAgICAgIGdldFRva2VuOiBnZXRUb2tlbixcbiAgICAgICAgc2V0VG9rZW46IHNldFRva2VuXG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIGdldFRva2VuKCl7XG4gICAgICAgIHJldHVybiBzdG9yZS5nZXRJdGVtKGtleSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2V0VG9rZW4odG9rZW4pe1xuICAgICAgICBpZih0b2tlbil7XG4gICAgICAgICAgICBzdG9yZS5zZXRJdGVtKGtleSx0b2tlbik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzdG9yZS5yZW1vdmVJdGVtKGtleSk7XG4gICAgICAgIH1cbiAgICB9XG59KTtcblxuYXBwLnNlcnZpY2UoJ0F1dGhTZXJ2aWNlJyxmdW5jdGlvbigkcSwkaHR0cCxVU0VSX1JPTEVTLEF1dGhUb2tlbkZhY3RvcnksQXBpRW5kcG9pbnQsJHJvb3RTY29wZSl7XG4gICAgdmFyIHVzZXJuYW1lID0gJyc7XG4gICAgdmFyIGlzQXV0aGVudGljYXRlZCA9IGZhbHNlO1xuICAgIHZhciBhdXRoVG9rZW47XG5cbiAgICBmdW5jdGlvbiBsb2FkVXNlckNyZWRlbnRpYWxzKCkge1xuICAgICAgICAvL3ZhciB0b2tlbiA9IHdpbmRvdy5sb2NhbFN0b3JhZ2UuZ2V0SXRlbShMT0NBTF9UT0tFTl9LRVkpO1xuICAgICAgICB2YXIgdG9rZW4gPSBBdXRoVG9rZW5GYWN0b3J5LmdldFRva2VuKCk7XG4gICAgICAgIC8vY29uc29sZS5sb2codG9rZW4pO1xuICAgICAgICBpZiAodG9rZW4pIHtcbiAgICAgICAgICAgIHVzZUNyZWRlbnRpYWxzKHRva2VuKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHN0b3JlVXNlckNyZWRlbnRpYWxzKGRhdGEpIHtcbiAgICAgICAgQXV0aFRva2VuRmFjdG9yeS5zZXRUb2tlbihkYXRhLnRva2VuKTtcbiAgICAgICAgdXNlQ3JlZGVudGlhbHMoZGF0YSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdXNlQ3JlZGVudGlhbHMoZGF0YSkge1xuICAgICAgICAvL2NvbnNvbGUubG9nKCd1c2VDcmVkZW50aWFscyB0b2tlbicsZGF0YSk7XG4gICAgICAgIHVzZXJuYW1lID0gZGF0YS51c2VybmFtZTtcbiAgICAgICAgaXNBdXRoZW50aWNhdGVkID0gdHJ1ZTtcbiAgICAgICAgYXV0aFRva2VuID0gZGF0YS50b2tlbjtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBkZXN0cm95VXNlckNyZWRlbnRpYWxzKCkge1xuICAgICAgICBhdXRoVG9rZW4gPSB1bmRlZmluZWQ7XG4gICAgICAgIHVzZXJuYW1lID0gJyc7XG4gICAgICAgIGlzQXV0aGVudGljYXRlZCA9IGZhbHNlO1xuICAgICAgICBBdXRoVG9rZW5GYWN0b3J5LnNldFRva2VuKCk7IC8vZW1wdHkgY2xlYXJzIHRoZSB0b2tlblxuICAgIH1cblxuICAgIHZhciBsb2dvdXQgPSBmdW5jdGlvbigpe1xuICAgICAgICBkZXN0cm95VXNlckNyZWRlbnRpYWxzKCk7XG5cbiAgICB9O1xuXG4gICAgLy92YXIgbG9naW4gPSBmdW5jdGlvbigpXG4gICAgdmFyIGxvZ2luID0gZnVuY3Rpb24odXNlcmRhdGEpe1xuICAgICAgICBjb25zb2xlLmxvZygnbG9naW4nLEpTT04uc3RyaW5naWZ5KHVzZXJkYXRhKSk7XG4gICAgICAgIHJldHVybiAkcShmdW5jdGlvbihyZXNvbHZlLHJlamVjdCl7XG4gICAgICAgICAgICAkaHR0cC5wb3N0KEFwaUVuZHBvaW50LnVybCtcIi91c2VyL2xvZ2luXCIsIHVzZXJkYXRhKVxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAgICAgICAgICAgICAgICAgc3RvcmVVc2VyQ3JlZGVudGlhbHMocmVzcG9uc2UuZGF0YSk7IC8vc3RvcmVVc2VyQ3JlZGVudGlhbHNcbiAgICAgICAgICAgICAgICAgICAgLy9pc0F1dGhlbnRpY2F0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHJlc3BvbnNlKTsgLy9UT0RPOiBzZW50IHRvIGF1dGhlbnRpY2F0ZWRcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIHZhciBzaWdudXAgPSBmdW5jdGlvbih1c2VyZGF0YSl7XG4gICAgICAgIGNvbnNvbGUubG9nKCdzaWdudXAnLEpTT04uc3RyaW5naWZ5KHVzZXJkYXRhKSk7XG4gICAgICAgIHJldHVybiAkcShmdW5jdGlvbihyZXNvbHZlLHJlamVjdCl7XG4gICAgICAgICAgICAkaHR0cC5wb3N0KEFwaUVuZHBvaW50LnVybCtcIi91c2VyL3NpZ251cFwiLCB1c2VyZGF0YSlcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgICAgICAgICAgICAgICAgIHN0b3JlVXNlckNyZWRlbnRpYWxzKHJlc3BvbnNlLmRhdGEpOyAvL3N0b3JlVXNlckNyZWRlbnRpYWxzXG4gICAgICAgICAgICAgICAgICAgIC8vaXNBdXRoZW50aWNhdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShyZXNwb25zZSk7IC8vVE9ETzogc2VudCB0byBhdXRoZW50aWNhdGVkXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGxvYWRVc2VyQ3JlZGVudGlhbHMoKTtcblxuICAgIHZhciBpc0F1dGhvcml6ZWQgPSBmdW5jdGlvbihhdXRoZW50aWNhdGVkKSB7XG4gICAgICAgIGlmICghYW5ndWxhci5pc0FycmF5KGF1dGhlbnRpY2F0ZWQpKSB7XG4gICAgICAgICAgICBhdXRoZW50aWNhdGVkID0gW2F1dGhlbnRpY2F0ZWRdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAoaXNBdXRoZW50aWNhdGVkICYmIGF1dGhlbnRpY2F0ZWQuaW5kZXhPZihVU0VSX1JPTEVTLnB1YmxpYykgIT09IC0xKTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgbG9naW46IGxvZ2luLFxuICAgICAgICBzaWdudXA6IHNpZ251cCxcbiAgICAgICAgbG9nb3V0OiBsb2dvdXQsXG4gICAgICAgIGlzQXV0aGVudGljYXRlZDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdBdXRoU2VydmljZS5pc0F1dGhlbnRpY2F0ZWQoKScpO1xuICAgICAgICAgICAgcmV0dXJuIGlzQXV0aGVudGljYXRlZDtcbiAgICAgICAgfSxcbiAgICAgICAgdXNlcm5hbWU6IGZ1bmN0aW9uKCl7cmV0dXJuIHVzZXJuYW1lO30sXG4gICAgICAgIC8vZ2V0TG9nZ2VkSW5Vc2VyOiBnZXRMb2dnZWRJblVzZXIsXG4gICAgICAgIGlzQXV0aG9yaXplZDogaXNBdXRob3JpemVkXG4gICAgfVxuXG59KTtcblxuLy9UT0RPOiBEaWQgbm90IGNvbXBsZXRlIG1haW4gY3RybCAnQXBwQ3RybCBmb3IgaGFuZGxpbmcgZXZlbnRzJ1xuLy8gYXMgcGVyIGh0dHA6Ly9kZXZkYWN0aWMuY29tL3VzZXItYXV0aC1hbmd1bGFyanMtaW9uaWMvIiwiYXBwLmZhY3RvcnkoJ0tleWJvYXJkRmFjdG9yeScsIGZ1bmN0aW9uKCl7XG5cdHJldHVybiB7XG5cdFx0bWFrZUluc2VydEZ1bmMgOiBmdW5jdGlvbihzY29wZSl7XG5cdFx0XHRyZXR1cm4gZnVuY3Rpb24gKHRleHQpe1xuXHRcdFx0XHRzY29wZS4kYnJvYWRjYXN0KFwiaW5zZXJ0XCIsIHRleHQpO1xuXHRcdFx0fTtcblx0XHR9XG5cdH07XG59KTsiLCJhcHAuZmFjdG9yeSgnQ29kZVNuaXBwZXRGYWN0b3J5JywgZnVuY3Rpb24oJHJvb3RTY29wZSl7XG5cdFxuXHR2YXIgY29kZVNuaXBwZXRzID0gW1xuXHRcdHtcblx0XHRcdGRpc3BsYXk6IFwiZm5cIixcblx0XHRcdGluc2VydFBhcmFtOiBcImZ1bmN0aW9uKCl7IH1cIlxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0ZGlzcGxheTogXCJmb3JcIixcblx0XHRcdGluc2VydFBhcmFtOiBcImZvcih2YXIgaT0gO2k8IDtpKyspeyB9XCJcblx0XHR9LFxuXHRcdHtcblx0XHRcdGRpc3BsYXk6IFwid2hpbGVcIixcblx0XHRcdGluc2VydFBhcmFtOiBcIndoaWxlKCApeyB9XCJcblx0XHR9LFxuXHRcdHtcblx0XHRcdGRpc3BsYXk6IFwiZG8gd2hpbGVcIixcblx0XHRcdGluc2VydFBhcmFtOiBcImRvIHsgfSB3aGlsZSggKTtcIlxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0ZGlzcGxheTogXCJsb2dcIixcblx0XHRcdGluc2VydFBhcmFtOiBcImNvbnNvbGUubG9nKCk7XCJcblx0XHR9LFxuXHRdO1xuXG5cdHZhciBicmFja2V0cyA9IFtcblx0XHR7XG5cdFx0XHRkaXNwbGF5OiBcIlsgXVwiLFxuXHRcdFx0aW5zZXJ0UGFyYW06IFwiW11cIlxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0ZGlzcGxheTogXCJ7IH1cIixcblx0XHRcdGluc2VydFBhcmFtOiBcInt9XCJcblx0XHR9LFxuXHRcdHtcblx0XHRcdGRpc3BsYXk6IFwiKCApXCIsXG5cdFx0XHRpbnNlcnRQYXJhbTogXCIoKVwiXG5cdFx0fSxcblx0XHR7XG5cdFx0XHRkaXNwbGF5OiBcIi8vXCIsXG5cdFx0XHRpbnNlcnRQYXJhbTogXCIvL1wiXG5cdFx0fSxcblx0XHR7XG5cdFx0XHRkaXNwbGF5OiBcIi8qICAqL1wiLFxuXHRcdFx0aW5zZXJ0UGFyYW06IFwiLyogKi9cIlxuXHRcdH1cblx0XTtcblxuXHR2YXIgY29tcGFyYXRvcnMgPSBbXG5cdFx0e1xuXHRcdFx0ZGlzcGxheTogXCIhXCIsXG5cdFx0XHRpbnNlcnRQYXJhbTogXCIhXCJcblx0XHR9LFxuXHRcdHtcblx0XHRcdGRpc3BsYXk6IFwiQFwiLFxuXHRcdFx0aW5zZXJ0UGFyYW06IFwiQFwiXG5cdFx0fSxcblx0XHR7XG5cdFx0XHRkaXNwbGF5OiBcIiNcIixcblx0XHRcdGluc2VydFBhcmFtOiBcIiNcIlxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0ZGlzcGxheTogXCIkXCIsXG5cdFx0XHRpbnNlcnRQYXJhbTogXCIkXCJcblx0XHR9LFxuXHRcdHtcblx0XHRcdGRpc3BsYXk6IFwiJVwiLFxuXHRcdFx0aW5zZXJ0UGFyYW06IFwiJVwiXG5cdFx0fSxcblx0XHR7XG5cdFx0XHRkaXNwbGF5OiBcIj1cIixcblx0XHRcdGluc2VydFBhcmFtOiBcIj1cIlxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0ZGlzcGxheTogXCI8XCIsXG5cdFx0XHRpbnNlcnRQYXJhbTogXCI8XCJcblx0XHR9LFxuXHRcdHtcblx0XHRcdGRpc3BsYXk6IFwiPlwiLFxuXHRcdFx0aW5zZXJ0UGFyYW06IFwiPlwiXG5cdFx0fVxuXHRdO1xuXG5cdHZhciBmb290ZXJNZW51ID0gW1xuXHRcdHtcblx0XHRcdGRpc3BsYXk6IFwiQ3VzdG9tXCIsXG5cdFx0XHRkYXRhOiBjb2RlU25pcHBldHNcblx0XHR9LFxuXHRcdHtcblx0XHRcdGRpc3BsYXk6IFwiU3BlY2lhbFwiLFxuXHRcdFx0ZGF0YTogY29tcGFyYXRvcnNcblx0XHR9LFxuXHRcdHtcblx0XHRcdGRpc3BsYXk6IFwiQnJhY2tldHNcIixcblx0XHRcdGRhdGE6IGJyYWNrZXRzXG5cdFx0fVxuXHRdO1xuXG5cdC8vIHZhciBnZXRIb3RrZXlzID0gZnVuY3Rpb24oKXtcblx0Ly8gXHRyZXR1cm4gZm9vdGVySG90a2V5cztcblx0Ly8gfTtcblxuXHRyZXR1cm4gXHR7XG5cdFx0Z2V0Rm9vdGVyTWVudSA6IGZ1bmN0aW9uKCl7XG5cdFx0XHRyZXR1cm4gZm9vdGVyTWVudTtcblx0XHR9LFxuXHRcdGFkZFNuaXBwZXQgOiBmdW5jdGlvbihvYmope1xuXHRcdFx0Y29uc29sZS5sb2cob2JqKTtcblx0XHRcdGNvZGVTbmlwcGV0cy5wdXNoKG9iaik7XG5cdFx0XHQkcm9vdFNjb3BlLiRicm9hZGNhc3QoJ2Zvb3RlclVwZGF0ZWQnLCB0aGlzLmdldEZvb3Rlck1lbnUoKSk7XG5cdFx0fSxcblx0XHRkZWxldGVTbmlwcGV0IDogZnVuY3Rpb24oaWQpe1xuXHRcdFx0Y29kZVNuaXBwZXRzLnNwbGljZShpZCwgMSk7XG5cdFx0XHQkcm9vdFNjb3BlLiRicm9hZGNhc3QoJ2Zvb3RlclVwZGF0ZWQnLCB0aGlzLmdldEZvb3Rlck1lbnUoKSk7XG5cdFx0fSxcblx0XHRnZXRBbGxTbmlwcGV0cyA6IGZ1bmN0aW9uKCl7XG5cdFx0XHRyZXR1cm4gY29kZVNuaXBwZXRzLm1hcChmdW5jdGlvbihlbCwgaW5kZXgpe1xuXHRcdFx0XHRlbC5pZCA9IGluZGV4O1xuXHRcdFx0XHRyZXR1cm4gZWw7XG5cdFx0XHR9KTtcblx0XHR9LFxuXHRcdGVkaXRTbmlwcGV0IDogZnVuY3Rpb24oaWQsIGNoYW5nZXMpe1xuXHRcdFx0Zm9yKHZhciBrZXkgaW4gY29kZVNuaXBwZXRzW2lkXSl7XG5cdFx0XHRcdGNvZGVTbmlwcGV0c1tpZF1ba2V5XSA9IGNoYW5nZXNba2V5XTtcblx0XHRcdH1cblx0XHRcdCRyb290U2NvcGUuJGJyb2FkY2FzdCgnZm9vdGVyVXBkYXRlZCcsIHRoaXMuZ2V0Rm9vdGVyTWVudSgpKTtcblx0XHR9LFxuXHRcdGdldFNuaXBwZXQgOiBmdW5jdGlvbihpZCl7XG5cdFx0XHRyZXR1cm4gY29kZVNuaXBwZXRzW2lkXTtcblx0XHR9LFxuXHRcdGdldFNvbWVTbmlwcGV0cyA6IGZ1bmN0aW9uKHRleHQpe1xuXHRcdFx0ZnVuY3Rpb24gcmVwbGFjZVRTTiAoc3RyKXtcblx0XHRcdFx0cmV0dXJuIHN0ci5yZXBsYWNlKCcvKFxcbnxcXHR8XFxzKSsvZycsICcnKTtcblx0XHRcdH1cblxuXHRcdFx0ZnVuY3Rpb24gY2hlY2tPYmplY3QoY2hlY2spe1xuXHRcdFx0XHRpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpe1xuXHRcdFx0XHRcdHZhciBhcmdzID0gW10ucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLDApO1xuXHRcdFx0XHRcdGFyZ3Muc2hpZnQoKTtcblx0XHRcdFx0XHRyZXR1cm4gYXJncy5maWx0ZXIoZnVuY3Rpb24oZWwpe1xuXHRcdFx0XHRcdFx0cmV0dXJuIHJlcGxhY2VUU04oZWwpID09PSByZXBsYWNlVFNOKGNoZWNrKTtcblx0XHRcdFx0XHR9KS5sZW5ndGggPiAwO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2UgdGhyb3cgbmV3IEVycm9yKCdQbGVhc2UgY2hlY2snKTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIGNvZGVTbmlwcGV0cy5maWx0ZXIoZnVuY3Rpb24oZWwpe1xuXHRcdFx0XHRyZXR1cm4gY2hlY2tPYmplY3QodGV4dCwgZWwuZGlzcGxheSwgZWwuaW5zZXJ0UGFyYW0pO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHR9O1xufSk7IiwiYXBwLmZpbHRlcignYXBwZW5kJywgZnVuY3Rpb24oKXtcblx0cmV0dXJuIGZ1bmN0aW9uKGlucHV0LCBhcHBlbmQpe1xuXHRcdHJldHVybiBhcHBlbmQgKyBpbnB1dDtcblx0fTtcbn0pOyIsImFwcC5maWx0ZXIoJ2Jvb2wnLCBmdW5jdGlvbigpe1xuXHRyZXR1cm4gZnVuY3Rpb24oaW5wdXQsIGNvbmRpdGlvbiwgaWZUcnVlLCBpZkZhbHNlKXtcblx0XHRpZihldmFsKGlucHV0ICsgY29uZGl0aW9uKSl7XG5cdFx0XHRyZXR1cm4gaWZUcnVlO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm4gaWZGYWxzZTtcblx0XHR9XG5cdH07XG59KTsiLCJhcHAuZmlsdGVyKCduYW1lZm9ybWF0JywgZnVuY3Rpb24oKXtcblx0cmV0dXJuIGZ1bmN0aW9uKHRleHQpe1xuXHRcdHJldHVybiAnRXhlcmNpc20gLSAnICsgdGV4dC5zcGxpdCgnLScpLm1hcChmdW5jdGlvbihlbCl7XG5cdFx0XHRyZXR1cm4gZWwuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBlbC5zbGljZSgxKTtcblx0XHR9KS5qb2luKCcgJyk7XG5cdH07XG59KTsiLCJhcHAuZmlsdGVyKCdsZW5ndGgnLCBmdW5jdGlvbigpe1xuXHRyZXR1cm4gZnVuY3Rpb24oYXJySW5wdXQpe1xuXHRcdHZhciBjaGVja0FyciA9IGFycklucHV0IHx8IFtdO1xuXHRcdHJldHVybiBjaGVja0Fyci5sZW5ndGg7XG5cdH07XG59KTsiLCJhcHAuZmlsdGVyKCdtYXJrZWQnLCBmdW5jdGlvbigkc2NlKXtcblx0Ly8gbWFya2VkLnNldE9wdGlvbnMoe1xuXHQvLyBcdHJlbmRlcmVyOiBuZXcgbWFya2VkLlJlbmRlcmVyKCksXG5cdC8vIFx0Z2ZtOiB0cnVlLFxuXHQvLyBcdHRhYmxlczogdHJ1ZSxcblx0Ly8gXHRicmVha3M6IHRydWUsXG5cdC8vIFx0cGVkYW50aWM6IGZhbHNlLFxuXHQvLyBcdHNhbml0aXplOiB0cnVlLFxuXHQvLyBcdHNtYXJ0TGlzdHM6IHRydWUsXG5cdC8vIFx0c21hcnR5cGFudHM6IGZhbHNlXG5cdC8vIH0pO1xuXHRyZXR1cm4gZnVuY3Rpb24odGV4dCl7XG5cdFx0aWYodGV4dCl7XG5cdFx0XHRyZXR1cm4gJHNjZS50cnVzdEFzSHRtbChtYXJrZWQodGV4dCkpO1xuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdHJldHVybiB1bmRlZmluZWQ7XG5cdFx0fVxuXHR9O1xufSk7IiwiYXBwLnNlcnZpY2UoJ0xvY2FsU3RvcmFnZScsZnVuY3Rpb24oJGxvY2Fsc3RvcmFnZSl7XG4gICAgLy9pZihcbiAgICAvL2NvbnNvbGUubG9nKCRjb3Jkb3ZhTmV0d29yay5nZXROZXR3b3JrKCkpO1xuICAgIGlmKCRsb2NhbHN0b3JhZ2UuZ2V0KCdhdXRoLXRva2VuJykpe1xuICAgICAgICAvL1RPRE86IFRlc3QgTmV0d29yayBDb25uZWN0aW9uIG9uIERldmljZSBhbmQgVmlhIENvbnNvbGUgTG9nXG5cbiAgICAgICAgdmFyIGNvbm5lY3Rpb24gPSAhZmFsc2U7XG5cbiAgICAgICAgaWYoY29ubmVjdGlvbil7XG4gICAgICAgICAgICAvL3N5bmMgZGF0YVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy9sb2FkIGRhdGEgZnJvbSBsb2NhbFN0b3JhZ2VcbiAgICAgICAgICAgIC8veW91IG5lZWQgdG8gc3RvcmUgdG8gbG9jYWwgc3RvcmFnZSBhdCBzb21lIHBvaW50XG4gICAgICAgICAgICAvL3NvIGFueXRpbWUgeW91IHRvdWNoIGFueSBvZiB0aGUgbG9jYWxTdG9yYWdlIGRhdGEsIGJlIHN1cmUgdG8gd3JpdGUgdG8gaXRcbiAgICAgICAgfVxuICAgICAgICAvL0lmIEludGVybmV0IENvbm5lY3Rpb25cblxuICAgICAgICAvL2NvbnNvbGUubG9nKCRjb3Jkb3ZhTmV0d29yay5nZXROZXR3b3JrKCkpO1xuICAgICAgICAvL2NvbnNvbGUubG9nKENvbm5lY3Rpb24uTk9ORSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgLy9kbyBub3RoaW5nIC0gd2VsY29tZSB3aWxsIGhhbmRsZSB1bi1hdXRoIHVzZXJzXG4gICAgfVxufSk7XG5cbi8vV29ya2luZyBPZmZsaW5lXG4vL1N5bmMgQ29tbW9uIERhdGEgb24gQXBwIExvYWQgaWYgUG9zc2libGUgKGFuZCBzdG9yZSBpbiBMb2NhbFN0b3JhZ2UpIC0gT3RoZXJ3aXNlIGxvYWQgZnJvbSBMb2NhbCBTdG9yYWdlXG4gICAgLy9Mb2NhbFN0b3JhZ2VcbiAgICAgICAgLy9TdG9yZSBGcmllbmRzXG4gICAgICAgIC8vU3RvcmUgQ29kZSBSZWNlaXZlZCAoZnJvbSBXaG8pXG4gICAgICAgIC8vU3RvcmUgTGFzdCBTeW5jXG4vL1N5bmMgQ29tbW9uIERhdGEgUGVyaW9kaWNhbGx5IGFzIHdlbGwgKE5vdCBTdXJlIEhvdz8hKSBNYXliZSBvbiBDZXJ0YWluIEhvdFNwb3RzIChjbGlja2luZyBjZXJ0YWluIGxpbmtzKSBhbmQgVGltZUJhc2VkIGFzIHdlbFxuIiwiYW5ndWxhci5tb2R1bGUoJ2lvbmljLnV0aWxzJywgW10pXG5cbi5mYWN0b3J5KCckbG9jYWxzdG9yYWdlJywgWyckd2luZG93JywgZnVuY3Rpb24oJHdpbmRvdykge1xuICByZXR1cm4ge1xuICAgIHNldDogZnVuY3Rpb24oa2V5LCB2YWx1ZSkge1xuICAgICAgJHdpbmRvdy5sb2NhbFN0b3JhZ2Vba2V5XSA9IHZhbHVlO1xuICAgIH0sXG4gICAgZ2V0OiBmdW5jdGlvbihrZXksIGRlZmF1bHRWYWx1ZSkge1xuICAgICAgcmV0dXJuICR3aW5kb3cubG9jYWxTdG9yYWdlW2tleV0gfHwgZGVmYXVsdFZhbHVlO1xuICAgIH0sXG4gICAgc2V0T2JqZWN0OiBmdW5jdGlvbihrZXksIHZhbHVlKSB7XG4gICAgICAkd2luZG93LmxvY2FsU3RvcmFnZVtrZXldID0gSlNPTi5zdHJpbmdpZnkodmFsdWUpO1xuICAgIH0sXG4gICAgZ2V0T2JqZWN0OiBmdW5jdGlvbihrZXkpIHtcbiAgICAgIHJldHVybiBKU09OLnBhcnNlKCR3aW5kb3cubG9jYWxTdG9yYWdlW2tleV0gfHwgJ3t9Jyk7XG4gICAgfVxuICB9O1xufV0pOyIsImFwcC5kaXJlY3RpdmUoJ2NtZWRpdCcsIGZ1bmN0aW9uKCl7XG5cdHJldHVybiB7XG5cdFx0cmVzdHJpY3QgOiAnQScsXG5cdFx0cmVxdWlyZTogJ25nTW9kZWwnLFxuXHRcdGxpbmsgOiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cmlidXRlLCBuZ01vZGVsQ3RybCl7XG5cdFx0XHQvL2luaXRpYWxpemUgQ29kZU1pcnJvclxuXHRcdFx0dmFyIG15Q29kZU1pcnJvcjtcblx0XHRcdG15Q29kZU1pcnJvciA9IENvZGVNaXJyb3IuZnJvbVRleHRBcmVhKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGF0dHJpYnV0ZS5pZCksIHtcblx0XHRcdFx0bGluZU51bWJlcnMgOiB0cnVlLFxuXHRcdFx0XHRtb2RlOiAnamF2YXNjcmlwdCcsXG5cdFx0XHRcdGF1dG9mb2N1cyA6IHRydWUsXG5cdFx0XHRcdHRoZW1lIDogJ3R3aWxpZ2h0Jyxcblx0XHRcdFx0bGluZVdyYXBwaW5nOiB0cnVlLFxuXHRcdFx0XHRzY3JvbGxiYXJTdHlsZTogXCJvdmVybGF5XCJcblx0XHRcdH0pO1xuXHRcdFx0bmdNb2RlbEN0cmwuJHJlbmRlciA9IGZ1bmN0aW9uKCl7XG5cdFx0XHRcdG15Q29kZU1pcnJvci5zZXRWYWx1ZShuZ01vZGVsQ3RybC4kdmlld1ZhbHVlIHx8ICcnKTtcblx0XHRcdH07XG5cblx0XHRcdG15Q29kZU1pcnJvci5vbihcImNoYW5nZVwiLCBmdW5jdGlvbiAobXlDb2RlTWlycm9yLCBjaGFuZ2VPYmope1xuXHRcdCAgICBcdG5nTW9kZWxDdHJsLiRzZXRWaWV3VmFsdWUobXlDb2RlTWlycm9yLmdldFZhbHVlKCkpO1xuXHRcdCAgICB9KTtcblxuXHRcdCAgICBzY29wZS4kb24oXCJpbnNlcnRcIiwgZnVuY3Rpb24oZXZlbnQsIHRleHQpe1xuXHRcdCAgICBcdG15Q29kZU1pcnJvci5yZXBsYWNlU2VsZWN0aW9uKHRleHQpO1xuXHRcdCAgICB9KTtcblx0XHR9XG5cdH07XG59KTsiLCJhcHAuZGlyZWN0aXZlKCdjb2Rla2V5Ym9hcmQnLCBmdW5jdGlvbihDb2RlU25pcHBldEZhY3RvcnksICRjb21waWxlKXtcblx0cmV0dXJuIHtcblx0XHRyZXN0cmljdCA6ICdBJyxcblx0XHRsaW5rIDogZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHJpYnV0ZSl7XG5cdFx0XHR2YXIgdmlzaWJsZSA9IGZhbHNlO1xuXG5cdFx0XHRlbGVtZW50LmFkZENsYXNzKFwiYmFyLXN0YWJsZVwiKTtcblx0XHRcdGVsZW1lbnQuYWRkQ2xhc3MoJ25nLWhpZGUnKTtcblxuXHRcdFx0ZnVuY3Rpb24gdG9nZ2xlQ2xhc3MoKXtcblx0XHRcdFx0aWYodmlzaWJsZSl7XG5cdFx0XHRcdFx0ZWxlbWVudC5yZW1vdmVDbGFzcygnbmctaGlkZScpO1xuXHRcdFx0XHRcdGVsZW1lbnQuYWRkQ2xhc3MoJ25nLXNob3cnKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRlbGVtZW50LnJlbW92ZUNsYXNzKCduZy1zaG93Jyk7XG5cdFx0XHRcdFx0ZWxlbWVudC5hZGRDbGFzcygnbmctaGlkZScpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRzY29wZS5idG5zID0gQ29kZVNuaXBwZXRGYWN0b3J5LmdldEZvb3Rlck1lbnUoKTtcblxuXHRcdFx0c2NvcGUuJG9uKCdmb290ZXJVcGRhdGVkJywgZnVuY3Rpb24oZXZlbnQsIGRhdGEpe1xuXHRcdFx0XHRzY29wZS5idG5zID0gZGF0YTtcblx0XHRcdH0pO1xuXG5cdFx0XHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIm5hdGl2ZS5rZXlib2FyZHNob3dcIiwgZnVuY3Rpb24gKCl7XG5cdFx0ICAgIFx0dmlzaWJsZSA9IHRydWU7XG5cdFx0ICAgIFx0dG9nZ2xlQ2xhc3MoKTtcblxuXHRcdCAgICB9KTtcblx0XHQgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJuYXRpdmUua2V5Ym9hcmRoaWRlXCIsIGZ1bmN0aW9uICgpe1xuXHRcdCAgICBcdHZpc2libGUgPSBmYWxzZTtcblx0XHQgICAgXHR0b2dnbGVDbGFzcygpO1xuXHRcdCAgICB9KTtcblx0XHR9XG5cdH07XG59KTsiLCJhcHAuZGlyZWN0aXZlKCdzbmlwcGV0YnV0dG9ucycsIGZ1bmN0aW9uKCl7XG5cdHJldHVybiB7XG5cdFx0cmVzdHJpY3QgOiAnRScsXG5cdFx0cmVwbGFjZTp0cnVlLFxuXHRcdHRlbXBsYXRlVXJsOlwiZmVhdHVyZXMvY29tbW9uL2RpcmVjdGl2ZXMvY29kZWtleWJvYXJkYmFyL3NuaXBwZXRidXR0b25zLmh0bWxcIixcblx0XHRsaW5rIDogZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHJpYnV0ZSl7XG5cdFx0XHRzY29wZS5zaG93T3B0aW9ucyA9IGZhbHNlO1xuXHRcdFx0c2NvcGUuYnRuQ2xpY2sgPSBmdW5jdGlvbihkYXRhKXtcblx0XHRcdFx0c2NvcGUuc2hvd09wdGlvbnMgPSB0cnVlO1xuXHRcdFx0XHRzY29wZS5pdGVtcyA9IGRhdGE7XG5cdFx0XHR9O1xuXHRcdFx0c2NvcGUuaXRlbUNsaWNrID0gZnVuY3Rpb24oaW5zZXJ0UGFyYW0pe1xuXHRcdFx0XHRzY29wZS5pbnNlcnRGdW5jKGluc2VydFBhcmFtKTtcblx0XHRcdH07XG5cdFx0XHRzY29wZS5yZXNldE1lbnUgPSBmdW5jdGlvbigpe1xuXHRcdFx0XHRzY29wZS5zaG93T3B0aW9ucyA9IGZhbHNlO1xuXHRcdFx0fTtcblx0XHR9XG5cdH07XG59KTsiLCJhcHAuZGlyZWN0aXZlKCdjbXJlYWQnLCBmdW5jdGlvbigpe1xuXHRyZXR1cm4ge1xuXHRcdHJlc3RyaWN0IDogJ0EnLFxuXHRcdHJlcXVpcmU6ICduZ01vZGVsJyxcblx0XHRsaW5rIDogZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHJpYnV0ZSwgbmdNb2RlbEN0cmwpe1xuXHRcdFx0Ly9pbml0aWFsaXplIENvZGVNaXJyb3Jcblx0XHRcdHZhciBteUNvZGVNaXJyb3IgPSBDb2RlTWlycm9yLmZyb21UZXh0QXJlYShkb2N1bWVudC5nZXRFbGVtZW50QnlJZChhdHRyaWJ1dGUuaWQpLCB7XG5cdFx0XHRcdHJlYWRPbmx5IDogJ25vY3Vyc29yJyxcblx0XHRcdFx0bW9kZTogJ2phdmFzY3JpcHQnLFxuXHRcdFx0XHRhdXRvZm9jdXMgOiB0cnVlLFxuXHRcdFx0XHR0aGVtZSA6ICd0d2lsaWdodCcsXG5cdFx0XHRcdGxpbmVXcmFwcGluZzogdHJ1ZVxuXHRcdFx0fSk7XG5cblx0XHRcdG5nTW9kZWxDdHJsLiRyZW5kZXIgPSBmdW5jdGlvbigpe1xuXHRcdFx0XHRteUNvZGVNaXJyb3Iuc2V0VmFsdWUobmdNb2RlbEN0cmwuJHZpZXdWYWx1ZSB8fCAnJyk7XG5cdFx0XHR9O1xuXHRcdH1cblx0fTtcbn0pOyIsImFwcC5kaXJlY3RpdmUoJ2phc21pbmUnLCBmdW5jdGlvbihKYXNtaW5lUmVwb3J0ZXIpe1xuXHRyZXR1cm4ge1xuXHRcdHJlc3RyaWN0IDogJ0UnLFxuXHRcdHRyYW5zY2x1ZGU6IHRydWUsXG5cdFx0c2NvcGUgOiB7XG5cdFx0XHR0ZXN0OiAnPScsXG5cdFx0XHRjb2RlOiAnPSdcblx0XHR9LFxuXHRcdHRlbXBsYXRlVXJsIDogJ2ZlYXR1cmVzL2NvbW1vbi9kaXJlY3RpdmVzL2phc21pbmUvamFzbWluZS5odG1sJyxcblx0XHRsaW5rIDogZnVuY3Rpb24gKHNjb3BlLCBlbGVtZW50LCBhdHRyaWJ1dGUpe1xuXHRcdFx0c2NvcGUuJHdhdGNoKCd0ZXN0JywgZnVuY3Rpb24oKXtcblx0XHRcdFx0d2luZG93Lmphc21pbmUgPSBudWxsO1xuXHRcdFx0XHRKYXNtaW5lUmVwb3J0ZXIuaW5pdGlhbGl6ZUphc21pbmUoKTtcblx0XHRcdFx0SmFzbWluZVJlcG9ydGVyLmFkZFJlcG9ydGVyKHNjb3BlKTtcblx0XHRcdH0pO1xuXG5cdFx0XHRzY29wZS4kd2F0Y2goJ2NvZGUnLCBmdW5jdGlvbigpe1xuXHRcdFx0XHR3aW5kb3cuamFzbWluZSA9IG51bGw7XG5cdFx0XHRcdEphc21pbmVSZXBvcnRlci5pbml0aWFsaXplSmFzbWluZSgpO1xuXHRcdFx0XHRKYXNtaW5lUmVwb3J0ZXIuYWRkUmVwb3J0ZXIoc2NvcGUpO1xuXHRcdFx0fSk7XG5cblx0XHRcdGZ1bmN0aW9uIGZsYXR0ZW5SZW1vdmVEdXBlcyhhcnIsIGtleUNoZWNrKXtcblx0XHRcdFx0dmFyIHRyYWNrZXIgPSBbXTtcblx0XHRcdFx0cmV0dXJuIHdpbmRvdy5fLmZsYXR0ZW4oYXJyKS5maWx0ZXIoZnVuY3Rpb24oZWwpe1xuXHRcdFx0XHRcdGlmKHRyYWNrZXIuaW5kZXhPZihlbFtrZXlDaGVja10pID09IC0xKXtcblx0XHRcdFx0XHRcdHRyYWNrZXIucHVzaChlbFtrZXlDaGVja10pO1xuXHRcdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cblx0XHRcdHNjb3BlLnN1bW1hcnlTaG93aW5nID0gdHJ1ZTtcblxuXHRcdFx0c2NvcGUuc2hvd1N1bW1hcnkgPSBmdW5jdGlvbigpe1xuXHRcdFx0XHRpZighc2NvcGUuc3VtbWFyeVNob3dpbmcpIHNjb3BlLnN1bW1hcnlTaG93aW5nID0gIXNjb3BlLnN1bW1hcnlTaG93aW5nO1xuXHRcdFx0fTtcblx0XHRcdHNjb3BlLnNob3dGYWlsdXJlcyA9IGZ1bmN0aW9uKCl7XG5cdFx0XHRcdGlmKHNjb3BlLnN1bW1hcnlTaG93aW5nKSBzY29wZS5zdW1tYXJ5U2hvd2luZyA9ICFzY29wZS5zdW1tYXJ5U2hvd2luZztcblx0XHRcdH07XG5cblxuXHRcdFx0c2NvcGUuJHdhdGNoKCdzdWl0ZXMnLCBmdW5jdGlvbigpe1xuXHRcdFx0XHRpZihzY29wZS5zdWl0ZXMpe1xuXHRcdFx0XHRcdHZhciBzdWl0ZXNTcGVjcyA9IHNjb3BlLnN1aXRlcy5tYXAoZnVuY3Rpb24oZWwpe1xuXHRcdFx0XHRcdFx0cmV0dXJuIGVsLnNwZWNzO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdHNjb3BlLnNwZWNzT3ZlcnZpZXcgPSBmbGF0dGVuUmVtb3ZlRHVwZXMoc3VpdGVzU3BlY3MsIFwiaWRcIik7XG5cdFx0XHRcdFx0Y29uc29sZS5sb2coc2NvcGUuc3BlY3NPdmVydmlldyk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXG5cdFx0fVxuXHR9O1xufSk7XG5cbmFwcC5mYWN0b3J5KCdKYXNtaW5lUmVwb3J0ZXInLCBmdW5jdGlvbigpe1xuXHRmdW5jdGlvbiBpbml0aWFsaXplSmFzbWluZSgpe1xuXHRcdC8qXG5cdFx0Q29weXJpZ2h0IChjKSAyMDA4LTIwMTUgUGl2b3RhbCBMYWJzXG5cblx0XHRQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmdcblx0XHRhIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcblx0XHRcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcblx0XHR3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG5cdFx0ZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvXG5cdFx0cGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvXG5cdFx0dGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuXG5cdFx0VGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmVcblx0XHRpbmNsdWRlZCBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cblxuXHRcdFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsXG5cdFx0RVhQUkVTUyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG5cdFx0TUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkRcblx0XHROT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFXG5cdFx0TElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTlxuXHRcdE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTlxuXHRcdFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXHRcdCovXG5cdFx0LyoqXG5cdFx0IFN0YXJ0aW5nIHdpdGggdmVyc2lvbiAyLjAsIHRoaXMgZmlsZSBcImJvb3RzXCIgSmFzbWluZSwgcGVyZm9ybWluZyBhbGwgb2YgdGhlIG5lY2Vzc2FyeSBpbml0aWFsaXphdGlvbiBiZWZvcmUgZXhlY3V0aW5nIHRoZSBsb2FkZWQgZW52aXJvbm1lbnQgYW5kIGFsbCBvZiBhIHByb2plY3QncyBzcGVjcy4gVGhpcyBmaWxlIHNob3VsZCBiZSBsb2FkZWQgYWZ0ZXIgYGphc21pbmUuanNgIGFuZCBgamFzbWluZV9odG1sLmpzYCwgYnV0IGJlZm9yZSBhbnkgcHJvamVjdCBzb3VyY2UgZmlsZXMgb3Igc3BlYyBmaWxlcyBhcmUgbG9hZGVkLiBUaHVzIHRoaXMgZmlsZSBjYW4gYWxzbyBiZSB1c2VkIHRvIGN1c3RvbWl6ZSBKYXNtaW5lIGZvciBhIHByb2plY3QuXG5cblx0XHQgSWYgYSBwcm9qZWN0IGlzIHVzaW5nIEphc21pbmUgdmlhIHRoZSBzdGFuZGFsb25lIGRpc3RyaWJ1dGlvbiwgdGhpcyBmaWxlIGNhbiBiZSBjdXN0b21pemVkIGRpcmVjdGx5LiBJZiBhIHByb2plY3QgaXMgdXNpbmcgSmFzbWluZSB2aWEgdGhlIFtSdWJ5IGdlbV1bamFzbWluZS1nZW1dLCB0aGlzIGZpbGUgY2FuIGJlIGNvcGllZCBpbnRvIHRoZSBzdXBwb3J0IGRpcmVjdG9yeSB2aWEgYGphc21pbmUgY29weV9ib290X2pzYC4gT3RoZXIgZW52aXJvbm1lbnRzIChlLmcuLCBQeXRob24pIHdpbGwgaGF2ZSBkaWZmZXJlbnQgbWVjaGFuaXNtcy5cblxuXHRcdCBUaGUgbG9jYXRpb24gb2YgYGJvb3QuanNgIGNhbiBiZSBzcGVjaWZpZWQgYW5kL29yIG92ZXJyaWRkZW4gaW4gYGphc21pbmUueW1sYC5cblxuXHRcdCBbamFzbWluZS1nZW1dOiBodHRwOi8vZ2l0aHViLmNvbS9waXZvdGFsL2phc21pbmUtZ2VtXG5cdFx0ICovXG5cblx0XHQoZnVuY3Rpb24oKSB7XG5cdFx0ICAvKipcblx0XHQgICAqICMjIFJlcXVpcmUgJmFtcDsgSW5zdGFudGlhdGVcblx0XHQgICAqXG5cdFx0ICAgKiBSZXF1aXJlIEphc21pbmUncyBjb3JlIGZpbGVzLiBTcGVjaWZpY2FsbHksIHRoaXMgcmVxdWlyZXMgYW5kIGF0dGFjaGVzIGFsbCBvZiBKYXNtaW5lJ3MgY29kZSB0byB0aGUgYGphc21pbmVgIHJlZmVyZW5jZS5cblx0XHQgICAqL1xuXHRcdCAgd2luZG93Lmphc21pbmUgPSBqYXNtaW5lUmVxdWlyZS5jb3JlKGphc21pbmVSZXF1aXJlKTtcblxuXHRcdCAgLyoqXG5cdFx0ICAgKiBTaW5jZSB0aGlzIGlzIGJlaW5nIHJ1biBpbiBhIGJyb3dzZXIgYW5kIHRoZSByZXN1bHRzIHNob3VsZCBwb3B1bGF0ZSB0byBhbiBIVE1MIHBhZ2UsIHJlcXVpcmUgdGhlIEhUTUwtc3BlY2lmaWMgSmFzbWluZSBjb2RlLCBpbmplY3RpbmcgdGhlIHNhbWUgcmVmZXJlbmNlLlxuXHRcdCAgICovXG5cdFx0ICBqYXNtaW5lUmVxdWlyZS5odG1sKGphc21pbmUpO1xuXG5cdFx0ICAvKipcblx0XHQgICAqIENyZWF0ZSB0aGUgSmFzbWluZSBlbnZpcm9ubWVudC4gVGhpcyBpcyB1c2VkIHRvIHJ1biBhbGwgc3BlY3MgaW4gYSBwcm9qZWN0LlxuXHRcdCAgICovXG5cdFx0ICB2YXIgZW52ID0gamFzbWluZS5nZXRFbnYoKTtcblxuXHRcdCAgLyoqXG5cdFx0ICAgKiAjIyBUaGUgR2xvYmFsIEludGVyZmFjZVxuXHRcdCAgICpcblx0XHQgICAqIEJ1aWxkIHVwIHRoZSBmdW5jdGlvbnMgdGhhdCB3aWxsIGJlIGV4cG9zZWQgYXMgdGhlIEphc21pbmUgcHVibGljIGludGVyZmFjZS4gQSBwcm9qZWN0IGNhbiBjdXN0b21pemUsIHJlbmFtZSBvciBhbGlhcyBhbnkgb2YgdGhlc2UgZnVuY3Rpb25zIGFzIGRlc2lyZWQsIHByb3ZpZGVkIHRoZSBpbXBsZW1lbnRhdGlvbiByZW1haW5zIHVuY2hhbmdlZC5cblx0XHQgICAqL1xuXHRcdCAgdmFyIGphc21pbmVJbnRlcmZhY2UgPSBqYXNtaW5lUmVxdWlyZS5pbnRlcmZhY2UoamFzbWluZSwgZW52KTtcblxuXHRcdCAgLyoqXG5cdFx0ICAgKiBBZGQgYWxsIG9mIHRoZSBKYXNtaW5lIGdsb2JhbC9wdWJsaWMgaW50ZXJmYWNlIHRvIHRoZSBnbG9iYWwgc2NvcGUsIHNvIGEgcHJvamVjdCBjYW4gdXNlIHRoZSBwdWJsaWMgaW50ZXJmYWNlIGRpcmVjdGx5LiBGb3IgZXhhbXBsZSwgY2FsbGluZyBgZGVzY3JpYmVgIGluIHNwZWNzIGluc3RlYWQgb2YgYGphc21pbmUuZ2V0RW52KCkuZGVzY3JpYmVgLlxuXHRcdCAgICovXG5cdFx0ICBleHRlbmQod2luZG93LCBqYXNtaW5lSW50ZXJmYWNlKTtcblxuXHRcdCAgLyoqXG5cdFx0ICAgKiAjIyBSdW5uZXIgUGFyYW1ldGVyc1xuXHRcdCAgICpcblx0XHQgICAqIE1vcmUgYnJvd3NlciBzcGVjaWZpYyBjb2RlIC0gd3JhcCB0aGUgcXVlcnkgc3RyaW5nIGluIGFuIG9iamVjdCBhbmQgdG8gYWxsb3cgZm9yIGdldHRpbmcvc2V0dGluZyBwYXJhbWV0ZXJzIGZyb20gdGhlIHJ1bm5lciB1c2VyIGludGVyZmFjZS5cblx0XHQgICAqL1xuXG5cdFx0ICB2YXIgcXVlcnlTdHJpbmcgPSBuZXcgamFzbWluZS5RdWVyeVN0cmluZyh7XG5cdFx0ICAgIGdldFdpbmRvd0xvY2F0aW9uOiBmdW5jdGlvbigpIHsgcmV0dXJuIHdpbmRvdy5sb2NhdGlvbjsgfVxuXHRcdCAgfSk7XG5cblx0XHQgIHZhciBjYXRjaGluZ0V4Y2VwdGlvbnMgPSBxdWVyeVN0cmluZy5nZXRQYXJhbShcImNhdGNoXCIpO1xuXHRcdCAgZW52LmNhdGNoRXhjZXB0aW9ucyh0eXBlb2YgY2F0Y2hpbmdFeGNlcHRpb25zID09PSBcInVuZGVmaW5lZFwiID8gdHJ1ZSA6IGNhdGNoaW5nRXhjZXB0aW9ucyk7XG5cblx0XHQgIHZhciB0aHJvd2luZ0V4cGVjdGF0aW9uRmFpbHVyZXMgPSBxdWVyeVN0cmluZy5nZXRQYXJhbShcInRocm93RmFpbHVyZXNcIik7XG5cdFx0ICBlbnYudGhyb3dPbkV4cGVjdGF0aW9uRmFpbHVyZSh0aHJvd2luZ0V4cGVjdGF0aW9uRmFpbHVyZXMpO1xuXG5cdFx0ICAvKipcblx0XHQgICAqIFRoZSBganNBcGlSZXBvcnRlcmAgYWxzbyByZWNlaXZlcyBzcGVjIHJlc3VsdHMsIGFuZCBpcyB1c2VkIGJ5IGFueSBlbnZpcm9ubWVudCB0aGF0IG5lZWRzIHRvIGV4dHJhY3QgdGhlIHJlc3VsdHMgIGZyb20gSmF2YVNjcmlwdC5cblx0XHQgICAqL1xuXHRcdCAgZW52LmFkZFJlcG9ydGVyKGphc21pbmVJbnRlcmZhY2UuanNBcGlSZXBvcnRlcik7XG5cblx0XHQgIC8qKlxuXHRcdCAgICogRmlsdGVyIHdoaWNoIHNwZWNzIHdpbGwgYmUgcnVuIGJ5IG1hdGNoaW5nIHRoZSBzdGFydCBvZiB0aGUgZnVsbCBuYW1lIGFnYWluc3QgdGhlIGBzcGVjYCBxdWVyeSBwYXJhbS5cblx0XHQgICAqL1xuXHRcdCAgdmFyIHNwZWNGaWx0ZXIgPSBuZXcgamFzbWluZS5IdG1sU3BlY0ZpbHRlcih7XG5cdFx0ICAgIGZpbHRlclN0cmluZzogZnVuY3Rpb24oKSB7IHJldHVybiBxdWVyeVN0cmluZy5nZXRQYXJhbShcInNwZWNcIik7IH1cblx0XHQgIH0pO1xuXG5cdFx0ICBlbnYuc3BlY0ZpbHRlciA9IGZ1bmN0aW9uKHNwZWMpIHtcblx0XHQgICAgcmV0dXJuIHNwZWNGaWx0ZXIubWF0Y2hlcyhzcGVjLmdldEZ1bGxOYW1lKCkpO1xuXHRcdCAgfTtcblxuXHRcdCAgLyoqXG5cdFx0ICAgKiBTZXR0aW5nIHVwIHRpbWluZyBmdW5jdGlvbnMgdG8gYmUgYWJsZSB0byBiZSBvdmVycmlkZGVuLiBDZXJ0YWluIGJyb3dzZXJzIChTYWZhcmksIElFIDgsIHBoYW50b21qcykgcmVxdWlyZSB0aGlzIGhhY2suXG5cdFx0ICAgKi9cblx0XHQgIHdpbmRvdy5zZXRUaW1lb3V0ID0gd2luZG93LnNldFRpbWVvdXQ7XG5cdFx0ICB3aW5kb3cuc2V0SW50ZXJ2YWwgPSB3aW5kb3cuc2V0SW50ZXJ2YWw7XG5cdFx0ICB3aW5kb3cuY2xlYXJUaW1lb3V0ID0gd2luZG93LmNsZWFyVGltZW91dDtcblx0XHQgIHdpbmRvdy5jbGVhckludGVydmFsID0gd2luZG93LmNsZWFySW50ZXJ2YWw7XG5cblx0XHQgIC8qKlxuXHRcdCAgICogIyMgRXhlY3V0aW9uXG5cdFx0ICAgKlxuXHRcdCAgICogUmVwbGFjZSB0aGUgYnJvd3NlciB3aW5kb3cncyBgb25sb2FkYCwgZW5zdXJlIGl0J3MgY2FsbGVkLCBhbmQgdGhlbiBydW4gYWxsIG9mIHRoZSBsb2FkZWQgc3BlY3MuIFRoaXMgaW5jbHVkZXMgaW5pdGlhbGl6aW5nIHRoZSBgSHRtbFJlcG9ydGVyYCBpbnN0YW5jZSBhbmQgdGhlbiBleGVjdXRpbmcgdGhlIGxvYWRlZCBKYXNtaW5lIGVudmlyb25tZW50LiBBbGwgb2YgdGhpcyB3aWxsIGhhcHBlbiBhZnRlciBhbGwgb2YgdGhlIHNwZWNzIGFyZSBsb2FkZWQuXG5cdFx0ICAgKi9cblx0XHQgIHZhciBjdXJyZW50V2luZG93T25sb2FkID0gd2luZG93Lm9ubG9hZDtcblxuXHRcdCAgKGZ1bmN0aW9uKCkge1xuXHRcdCAgICBpZiAoY3VycmVudFdpbmRvd09ubG9hZCkge1xuXHRcdCAgICAgIGN1cnJlbnRXaW5kb3dPbmxvYWQoKTtcblx0XHQgICAgfVxuXHRcdCAgICBlbnYuZXhlY3V0ZSgpO1xuXHRcdCAgfSkoKTtcblxuXHRcdCAgLyoqXG5cdFx0ICAgKiBIZWxwZXIgZnVuY3Rpb24gZm9yIHJlYWRhYmlsaXR5IGFib3ZlLlxuXHRcdCAgICovXG5cdFx0ICBmdW5jdGlvbiBleHRlbmQoZGVzdGluYXRpb24sIHNvdXJjZSkge1xuXHRcdCAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiBzb3VyY2UpIGRlc3RpbmF0aW9uW3Byb3BlcnR5XSA9IHNvdXJjZVtwcm9wZXJ0eV07XG5cdFx0ICAgIHJldHVybiBkZXN0aW5hdGlvbjtcblx0XHQgIH1cblxuXHRcdH0pKCk7XG5cdH1cblxuXHRmdW5jdGlvbiBhZGRSZXBvcnRlcihzY29wZSl7XG5cdFx0dmFyIHN1aXRlcyA9IFtdO1xuXHRcdHZhciBjdXJyZW50U3VpdGUgPSB7fTtcblxuXHRcdGZ1bmN0aW9uIFN1aXRlKG9iail7XG5cdFx0XHR0aGlzLmlkID0gb2JqLmlkO1xuXHRcdFx0dGhpcy5kZXNjcmlwdGlvbiA9IG9iai5kZXNjcmlwdGlvbjtcblx0XHRcdHRoaXMuZnVsbE5hbWUgPSBvYmouZnVsbE5hbWU7XG5cdFx0XHR0aGlzLmZhaWxlZEV4cGVjdGF0aW9ucyA9IG9iai5mYWlsZWRFeHBlY3RhdGlvbnM7XG5cdFx0XHR0aGlzLnN0YXR1cyA9IG9iai5maW5pc2hlZDtcblx0XHRcdHRoaXMuc3BlY3MgPSBbXTtcblx0XHR9XG5cblx0XHR2YXIgbXlSZXBvcnRlciA9IHtcblxuXHRcdFx0amFzbWluZVN0YXJ0ZWQ6IGZ1bmN0aW9uKG9wdGlvbnMpe1xuXHRcdFx0XHRzdWl0ZXMgPSBbXTtcblx0XHRcdH0sXG5cdFx0XHRzdWl0ZVN0YXJ0ZWQ6IGZ1bmN0aW9uKHN1aXRlKXtcblx0XHRcdFx0Y3VycmVudFN1aXRlID0gbmV3IFN1aXRlKHN1aXRlKTtcblx0XHRcdH0sXG5cdFx0XHRzcGVjU3RhcnRlZDogZnVuY3Rpb24oc3BlYyl7XG5cdFx0XHRcdHNjb3BlLnNwZWNTdGFydGVkID0gc3BlYztcblx0XHRcdH0sXG5cdFx0XHRzcGVjRG9uZTogZnVuY3Rpb24oc3BlYyl7XG5cdFx0XHRcdGN1cnJlbnRTdWl0ZS5zcGVjcy5wdXNoKHNwZWMpO1xuXHRcdFx0fSxcblx0XHRcdHN1aXRlRG9uZTogZnVuY3Rpb24oc3VpdGUpe1xuXHRcdFx0XHRzdWl0ZXMucHVzaChjdXJyZW50U3VpdGUpO1xuXHRcdFx0fSxcblx0XHRcdGphc21pbmVEb25lOiBmdW5jdGlvbigpe1xuXHRcdFx0XHRzY29wZS5zdWl0ZXMgPSBzdWl0ZXM7XG5cdFx0XHR9XG5cdFx0fTtcblxuXHRcdHdpbmRvdy5qYXNtaW5lLmdldEVudigpLmFkZFJlcG9ydGVyKG15UmVwb3J0ZXIpO1xuXHR9XG5cblx0cmV0dXJuIHtcblx0XHRpbml0aWFsaXplSmFzbWluZSA6IGluaXRpYWxpemVKYXNtaW5lLFxuXHRcdGFkZFJlcG9ydGVyOiBhZGRSZXBvcnRlclxuXHR9O1xufSk7IiwiYXBwLmRpcmVjdGl2ZSgnanNsb2FkJywgZnVuY3Rpb24oKXtcblx0ZnVuY3Rpb24gdXBkYXRlU2NyaXB0KGVsZW1lbnQsIHRleHQpe1xuXHRcdGVsZW1lbnQuZW1wdHkoKTtcblx0XHR2YXIgc2NyaXB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7XG5cdFx0c2NyaXB0LnR5cGUgPSAndGV4dC9qYXZhc2NyaXB0Jztcblx0XHRzY3JpcHQuaW5uZXJIVE1MID0gdGV4dDtcblx0XHRlbGVtZW50LmFwcGVuZChzY3JpcHQpO1xuXHR9XG5cdHJldHVybiB7XG5cdFx0cmVzdHJpY3QgOiAnRScsXG5cdFx0c2NvcGUgOiB7XG5cdFx0XHR0ZXh0IDogJz0nXG5cdFx0fSxcblx0XHRsaW5rIDogZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHJpYnV0ZXMpe1xuXHRcdFx0c2NvcGUuJHdhdGNoKCd0ZXh0JywgZnVuY3Rpb24odGV4dCl7XG5cdFx0XHRcdHVwZGF0ZVNjcmlwdChlbGVtZW50LCB0ZXh0KTtcblx0XHRcdH0pO1xuXHRcdH1cblx0fTtcbn0pO1xuXG4iLCJhcHAuZGlyZWN0aXZlKCdzaGFyZScsZnVuY3Rpb24oR2lzdEZhY3RvcnksICRpb25pY1BvcG92ZXIsIEZyaWVuZHNGYWN0b3J5KXtcbiAgIHJldHVybiB7XG4gICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICB0ZW1wbGF0ZVVybDonZmVhdHVyZXMvY29tbW9uL2RpcmVjdGl2ZXMvc2hhcmUvc2hhcmUuaHRtbCcsXG4gICAgICAgbGluazogZnVuY3Rpb24oJHNjb3BlLCBlbGVtZW50LCBhdHRyaWJ1dGVzKXtcbiAgICAgICAgICAgLy8gLmZyb21UZW1wbGF0ZVVybCgpIG1ldGhvZFxuXG4gICAgICAgICAgIC8vVE9ETzogQ2xlYW51cCBHaXN0RmFjdG9yeS5zaGFyZUdpc3QoY29kZSwkc2NvcGUuZGF0YS5mcmllbmRzKS50aGVuKGdpc3RTaGFyZWQpO1xuXG4gICAgICAgICAgIEZyaWVuZHNGYWN0b3J5LmdldEZyaWVuZHMoKS50aGVuKGFkZEZyaWVuZHMpO1xuICAgICAgICAgICAkc2NvcGUuZGF0YSA9IFtdO1xuICAgICAgICAgICAkc2NvcGUuaXNDaGVja2VkID0gW107XG4gICAgICAgICAgIGZ1bmN0aW9uIGFkZEZyaWVuZHMocmVzcG9uc2Upe1xuICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZygnYWRkRnJpZW5kcycscmVzcG9uc2UuZGF0YS5mcmllbmRzKTtcbiAgICAgICAgICAgICAgICRzY29wZS5kYXRhLmZyaWVuZHMgPSByZXNwb25zZS5kYXRhLmZyaWVuZHM7XG4gICAgICAgICAgIH07XG5cbiAgICAgICAgICAgLy8kc2NvcGUuJHdhdGNoKCdpc0NoZWNrZWQnLGZ1bmN0aW9uKCl7XG4gICAgICAgICAgIC8vXHRjb25zb2xlLmxvZygkc2NvcGUuaXNDaGVja2VkKTtcbiAgICAgICAgICAgLy99KTtcbiAgICAgICAgICAgLy9UT0RPOiBDb25maXJtIHRoYXQgdGhpcyBpcyB3b3JraW5nIGluIGFsbCBzY2VuYXJpb3NcbiAgICAgICAgICAgJHNjb3BlLnNlbmQgPSBmdW5jdGlvbihjb2RlKXtcbiAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coJyFAPyFAIycsY29kZSk7XG4gICAgICAgICAgICAgICBHaXN0RmFjdG9yeS5zaGFyZUdpc3QoJHNjb3BlLmNvZGUsT2JqZWN0LmtleXMoJHNjb3BlLmlzQ2hlY2tlZCkpLnRoZW4oZ2lzdFNoYXJlZCk7XG4gICAgICAgICAgIH07XG5cbiAgICAgICAgICAgJGlvbmljUG9wb3Zlci5mcm9tVGVtcGxhdGVVcmwoJ2ZlYXR1cmVzL2NvbW1vbi9kaXJlY3RpdmVzL3NoYXJlL2ZyaWVuZHMuaHRtbCcsIHtcbiAgICAgICAgICAgICAgIHNjb3BlOiAkc2NvcGVcbiAgICAgICAgICAgfSkudGhlbihmdW5jdGlvbihwb3BvdmVyKSB7XG4gICAgICAgICAgICAgICAkc2NvcGUucG9wb3ZlciA9IHBvcG92ZXI7XG4gICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICRzY29wZS5vcGVuUG9wb3ZlciA9IGZ1bmN0aW9uKCRldmVudCkge1xuICAgICAgICAgICAgICAgJHNjb3BlLnBvcG92ZXIuc2hvdygkZXZlbnQpO1xuICAgICAgICAgICB9O1xuICAgICAgICAgICAkc2NvcGUuY2xvc2VQb3BvdmVyID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAkc2NvcGUucG9wb3Zlci5oaWRlKCk7XG4gICAgICAgICAgIH07XG4gICAgICAgICAgIC8vQ2xlYW51cCB0aGUgcG9wb3ZlciB3aGVuIHdlJ3JlIGRvbmUgd2l0aCBpdCFcbiAgICAgICAgICAgJHNjb3BlLiRvbignJGRlc3Ryb3knLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICRzY29wZS5wb3BvdmVyLnJlbW92ZSgpO1xuICAgICAgICAgICB9KTtcbiAgICAgICAgICAgLy8gRXhlY3V0ZSBhY3Rpb24gb24gaGlkZSBwb3BvdmVyXG4gICAgICAgICAgICRzY29wZS4kb24oJ3BvcG92ZXIuaGlkZGVuJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAvLyBFeGVjdXRlIGFjdGlvblxuICAgICAgICAgICB9KTtcbiAgICAgICAgICAgLy8gRXhlY3V0ZSBhY3Rpb24gb24gcmVtb3ZlIHBvcG92ZXJcbiAgICAgICAgICAgJHNjb3BlLiRvbigncG9wb3Zlci5yZW1vdmVkJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAvLyBFeGVjdXRlIGFjdGlvblxuICAgICAgICAgICB9KTtcbiAgICAgICAgICAgLy99O1xuICAgICAgICAgICBnaXN0U2hhcmVkID0gZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2dpc3Qgc2hhcmVkJyxyZXNwb25zZSk7XG4gICAgICAgICAgICAgICAkc2NvcGUuY2xvc2VQb3BvdmVyKCk7XG4gICAgICAgICAgIH07XG4gICAgICAgfVxuICAgfVxufSk7XG4iLCJhcHAuZmFjdG9yeSgnR2lzdEZhY3RvcnknLGZ1bmN0aW9uKCRodHRwLCRxLEFwaUVuZHBvaW50KXtcblxuICAgIC8vVE9ETzogaGFuZGxpbmcgZm9yIG11bHRpcGxlIGZyaWVuZHMgKGFmdGVyIHRlc3Rpbmcgb25lIGZyaWVuZCB3b3JrcylcbiAgICAvL1RPRE86IEZyaWVuZCBhbmQgY29kZSBtdXN0IGJlIHByZXNlbnRcbiAgICAvL1RPRE86IGZyaWVuZHMgaXMgYW4gYXJyYXkgb2YgZnJpZW5kIE1vbmdvIElEc1xuXG4gICAgLy9UT0RPOiBTaGFyZSBkZXNjcmlwdGlvbiBhbmQgZmlsZW5hbWUgYmFzZWQgb24gY2hhbGxlbmdlIGZvciBleGFtcGxlXG4gICAgLy9UT0RPOk9yIGdpdmUgdGhlIHVzZXIgb3B0aW9ucyBvZiB3aGF0IHRvIGZpbGwgaW5cbiAgICBmdW5jdGlvbiBzaGFyZUdpc3QoY29kZSxmcmllbmRzLGRlc2NyaXB0aW9uLGZpbGVOYW1lKXtcbiAgICAgICAgY29uc29sZS5sb2coJ2NvZGUnLGNvZGUpO1xuICAgICAgICByZXR1cm4gJGh0dHAucG9zdChBcGlFbmRwb2ludC51cmwgKyAnL2dpc3RzL3NoYXJlR2lzdHMnLFxuICAgICAgICAgICAge2dpc3QgOiB7XG4gICAgICAgICAgICAgICAgY29kZTpjb2RlfHxcIm5vIGNvZGUgZW50ZXJlZFwiLFxuICAgICAgICAgICAgICAgIGZyaWVuZHM6ZnJpZW5kc3x8IFwiNTU1YjYyM2RmYTlhNjVhNDNlOWVjNmQ2XCIsXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246ZGVzY3JpcHRpb24gfHwgJ25vIGRlc2NyaXB0aW9uJyxcbiAgICAgICAgICAgICAgICBmaWxlTmFtZTpmaWxlTmFtZStcIi5qc1wiIHx8ICdubyBmaWxlIG5hbWUnXG4gICAgICAgICAgICB9fSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcXVldWVkR2lzdHMoKXtcbiAgICAgICAgcmV0dXJuICRodHRwLmdldChBcGlFbmRwb2ludC51cmwgKyAnL2dpc3RzL2dpc3RzUXVldWUnKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjcmVhdGVkR2lzdHMoKXtcbiAgICAgICAgcmV0dXJuICRodHRwLmdldChBcGlFbmRwb2ludC51cmwgKyAnL2dpc3RzL2NyZWF0ZWRHaXN0cycpXG4gICAgfVxuXG4gICAgcmV0dXJue1xuICAgICAgICBzaGFyZUdpc3Q6IHNoYXJlR2lzdCxcbiAgICAgICAgcXVldWVkR2lzdHM6IHF1ZXVlZEdpc3RzLCAvL3B1c2ggbm90aWZpY2F0aW9uc1xuICAgICAgICBjcmVhdGVkR2lzdHM6IGNyZWF0ZWRHaXN0c1xuICAgfVxufSk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9