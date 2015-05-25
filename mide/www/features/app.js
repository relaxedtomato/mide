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

  $urlRouterProvider.otherwise('/welcome');
})

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
        $state.go('welcome'); //if above fails, goto welcome
    });

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
//<<<<<<< HEAD
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
//=======
        // {
        //   name : 'Exercises',
        //   ref : function(){return 'exercises.view'; }
        // },
//>>>>>>> development
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
    //$scope.authReq = false;
    var authReq = !false;
    $scope.toggleMenuShow = function(){
        //console.log('AuthService',AuthService.isAuthenticated())
        //console.log('toggleMenuShow',AuthService.isAuthenticated());
        if(authReq){
            return AuthService.isAuthenticated();
        } else {
            return true;
        }
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
	var code = '\n\n\n\n\n\n\n\n\n\n\n\n\n';
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

app.controller('ExercismTestCtrl', function($scope, ExercismFactory, KeyboardFactory){

	$scope.name = ExercismFactory.getName();

	$scope.test = {
		text: null
	};

	$scope.test.text = ExercismFactory.getTestScript();

	$scope.$watch('test.text', function(newValue){
		ExercismFactory.setTestScript(newValue);
	});

	$scope.insertFunc = KeyboardFactory.makeInsertFunc($scope);
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
				console.log('login successful',authenticated);
				//$scope.menu = true;
				$rootScope.$broadcast('Auth');
				$scope.states.push({ //TODO: Need to add a parent controller to communicate
					name: 'Logout',
					ref: function(){
						AuthService.logout();
                        $scope.data = {};
						$scope.states.pop(); //TODO: Find a better way to remove the Logout link, instead of pop
						$state.go('welcome');
						$rootScope.$broadcast('Auth');
					}
				});
				$state.go('exercism.compile');
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
      url: '/chats/:userId',
      templateUrl: 'features/friends/shared-gists.html',
      controller: 'SharedGistsCtrl'
    })
    .state('view-code', {
      cache: false, //to ensure the controller is loading each time
      url: '/chats/code/:userId/:gistIndex',
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

  $scope.sharedCode = function(userId){
    //console.log(id); //id of friend gist shared with
    $state.go('shared-gists',{userId:userId}, {inherit:false});
  }

});

app.controller('ViewCodeCtrl', function($state,$scope, $stateParams, FriendsFactory){
  //TODO:
  //var allGists = FriendsFactory.getGists();
  $scope.code = FriendsFactory.userGists[$stateParams.gistIndex];

  $scope.goBack = function(n){
    if(n===1){
      $state.go('shared-gists',{userId:$stateParams.userId});
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
    $state.go('view-code',{userId:$stateParams.userId,gistIndex:gistIndex}, {inherit:false});
    //$state.go('view-code'); //TODO: which one was clicked, send param id, index of gist
    //console.log('showCode',code);
    //$scope.code = code;
    //$scope.openModal(code);
  };

  //TODO: Only show all Gists from specific user clicked on
  //TODO: Need to apply JSON parse

  allGists.forEach(function(gist){
    FriendsFactory.userGists = []; //set to empty
    if(gist.user === $stateParams.userId){
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
		text : '\n\n\n\n\n\n\n\n\n\n\n\n\n'
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
                        $state.go('welcome');
                        $rootScope.$broadcast('Auth');
                    }
                });
                $state.go('exercism.compile');
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

//<<<<<<< HEAD
	if (!authReq){
		$state.go('exercism.view'); //TODO: If Auth is not required, go directly here
	} else {
		if (AuthService.isAuthenticated()) {
			$rootScope.$broadcast('Auth');
			$scope.states.push({ //TODO: Need to add a parent controller to communicate
				name: 'Logout',
				ref: function () {
					AuthService.logout();
					$scope.data = {};
					$scope.states.pop(); //TODO: Find a better way to remove the Logout link, instead of pop
					$state.go('login');
				}
			});
//=======
			// if (!authReq){
			// 	$state.go('exercism.view');
			// } else {
			// 	if (AuthService.isAuthenticated()) {
			// 		$rootScope.$broadcast('Auth');
			// 		$scope.states.push({ //TODO: Need to add a parent controller to communicate
			// 			name: 'Logout',
			// 			ref: function(){
			// 				AuthService.logout();
			// 				$scope.data = {};
			// 				$scope.states.pop(); //TODO: Find a better way to remove the Logout link, instead of pop
			// 				$state.go('login');
			// 			}
			// 		});
//>>>>>>> development

			// 		//pop-up options, view shared code or
			// 		//TODO: Happen on Login, recieve gist notification
			// 		GistFactory.queuedGists().then(gistsRx);

//<<<<<<< HEAD
			function gistsRx(response) {
				console.log(response.data.gists);
				if (response.data.gists.length !== 0) {
					//console.log('notify user of Rx gists')
					showConfirm = function () {
						var confirmPopup = $ionicPopup.confirm({
							title: 'You got Code!',
							template: 'Your friends shared some code, do you want to take a look?'
						});
						//TODO: Custom PopUp Instead
						//TODO: You need to account for login (this only accounts for user loading app, already logged in)
						confirmPopup.then(function (res) {
							if (res) {
								//console.log('You are sure');
								$state.go('friends');
							} else {
								//console.log('You are not sure');
								$state.go('exercism.compile');
							}
						});
					};
//=======
					// 		function gistsRx(response){
					// 			console.log(response.data.gists);
					// 			if(response.data.gists.length !==0){
					// 				//console.log('notify user of Rx gists')
					// 				showConfirm = function() {
					// 					var confirmPopup = $ionicPopup.confirm({
					// 						title: 'You got Code!',
					// 						template: 'Your friends shared some code, do you want to take a look?'
					// 					});
					// 					//TODO: Custom PopUp Instead
					// 					//TODO: You need to account for login (this only accounts for user loading app, already logged in)
					// 					confirmPopup.then(function(res) {
					// 						if(res) {
					// 							//console.log('You are sure');
					// 							$state.go('chats');
					// 						} else {
					// 							//console.log('You are not sure');
					// 							$state.go('exercism.compile');
					// 						}
					// 					});
					// 				};
//>>>>>>> development

					// 				showConfirm();
					// 			} else {
					// 				$state.go('exercism.compile');
					// 			}
					// 		}


//<<<<<<< HEAD
				} else {
					//TODO: $state.go('signup'); Remove Below line
					//$state.go('signup');
					//DO
				}
			}
		}
	}
//=======
//	// 	} else {
//	// 		//TODO: $state.go('signup'); Remove Below line
//	// 		$state.go('signup');
//	// 	}
//	// }
//>>>>>>> development
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

app.service('AuthService',function($q,$http,USER_ROLES,AuthTokenFactory,ApiEndpoint,$rootScope,FriendsFactory){
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
        FriendsFactory.allGists = [];
        //TODO: Central way to destroy local data saved
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
app.factory('GistFactory',function($http,$q,ApiEndpoint){

    //TODO: handling for multiple friends (after testing one friend works)
    //TODO: Friend and code must be present
    //TODO: friends is an array of friend Mongo IDs

    //TODO: Share description and filename based on challenge for example
    //TODO:Or give the user options of what to fill in

    //TODO: On-Click Grab the latest code
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
app.filter('prepend', function(){
	return function(input, prepend){
		return prepend + input;
	};
});
app.filter('truncate', function(){
	return function(input, length){
		if(input.length > length) return input.substr(0, length) + '...';
		else return input;
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
				// theme : 'monokai',
				//theme : 'twilight',
				lineWrapping: true,
				inputStyle: 'contenteditable'
			});
			ngModelCtrl.$render = function(){
				myCodeMirror.setValue(ngModelCtrl.$viewValue || '');
			};

			myCodeMirror.on("change", function (myCodeMirror, changeObj){
		    	ngModelCtrl.$setViewValue(myCodeMirror.getValue());
		    	myCodeMirror.focus();
		    });

		    scope.$on("insert", function(event, text){
		    	myCodeMirror.replaceSelection(text);
		    	myCodeMirror.focus();
		    });

		    myCodeMirror.on("blur", function (){
		    	console.log("blur detected");
		    	myCodeMirror.focus();
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
				//theme : 'twilight',
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
           // console.log($scope.)

           //TODO: Cleanup GistFactory.shareGist(code,$scope.data.friends).then(gistShared);

           FriendsFactory.getFriends().then(addFriends);
           $scope.data = [];
           $scope.isChecked = [];
           function addFriends(response){
               //console.log('addFriends',response.data.friends);
               $scope.data.friends = response.data.friends;
           };

           var codeToSend = null;
           //$scope.$watch('isChecked',function(){
           //	console.log($scope.isChecked);
           //});
           //TODO: Confirm that this is working in all scenarios
           $scope.send = function(code){
               console.log('!@?!@#',code.text);
               GistFactory.shareGist(code.text,Object.keys($scope.isChecked)).then(gistShared);
           };

           $ionicPopover.fromTemplateUrl('features/common/directives/share/friends.html', {
               scope: $scope
           }).then(function(popover) {
               $scope.popover = popover;
           });

           $scope.openPopover = function($event) {
               //console.log('openPopover',code);
               //codeToSend = code;
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImFib3V0L2Fib3V0LmpzIiwiYWNjb3VudC9hY2NvdW50LmpzIiwiZXhlcmNpc2UvZXhlcmNpc2UuanMiLCJleGVyY2lzZS1jb2RlL2V4ZXJjaXNlLWNvZGUuanMiLCJleGVyY2lzZS1jb21waWxlL2V4ZXJjaXNlLWNvbXBpbGUuanMiLCJleGVyY2lzZS10ZXN0L2V4ZXJjaXNlLXRlc3QuanMiLCJleGVyY2lzZS12aWV3L2V4ZXJjaXNlLXZpZXcuanMiLCJleGVyY2lzZS12aWV3LWVkaXQvZXhlcmNpc2Utdmlldy1lZGl0LmpzIiwiZXhlcmNpc2VzL2V4ZXJjaXNlcy5qcyIsImV4ZXJjaXNlcy1jcmVhdGUvZXhlcmNpc2VzLWNyZWF0ZS5qcyIsImV4ZXJjaXNtL2V4ZXJjaXNtLmpzIiwiZXhlcmNpc20tY29kZS9leGVyY2lzbS1jb2RlLmpzIiwiZXhlcmNpc20tY29tcGlsZS9leGVyY2lzbS1jb21waWxlLmpzIiwiZXhlcmNpc20tdGVzdC9leGVyY2lzbS10ZXN0LmpzIiwiZXhlcmNpc20tdmlldy9leGVyY2lzbS12aWV3LmpzIiwibG9naW4vbG9naW4uanMiLCJmcmllbmRzL2ZyaWVuZHMuanMiLCJzYW5kYm94L3NhbmRib3guanMiLCJzYW5kYm94LWNvZGUvc2FuZGJveC1jb2RlLmpzIiwic2FuZGJveC1jb21waWxlL3NhbmRib3gtY29tcGlsZS5qcyIsInNpZ251cC9zaWdudXAuanMiLCJzbmlwcGV0LWVkaXQvc25pcHBldC1lZGl0LmpzIiwic25pcHBldHMvc25pcHBldHMuanMiLCJzbmlwcGV0cy1jcmVhdGUvc25pcHBldHMtY3JlYXRlLmpzIiwid2VsY29tZS93ZWxjb21lLmpzIiwiY29tbW9uL0F1dGhlbnRpY2F0aW9uL2F1dGhlbnRpY2F0aW9uLmpzIiwiY29tbW9uL2ZhY3Rvcmllcy9HaXN0RmFjdG9yeS5qcyIsImNvbW1vbi9mYWN0b3JpZXMvS2V5Ym9hcmRGYWN0b3J5LmpzIiwiY29tbW9uL2ZhY3Rvcmllcy9jb2RlU25pcHBldEZhY3RvcnkuanMiLCJjb21tb24vZmlsdGVycy9ib29sLmpzIiwiY29tbW9uL2ZpbHRlcnMvZXhlcmNpc20tZm9ybWF0LW5hbWUuanMiLCJjb21tb24vZmlsdGVycy9sZW5ndGguanMiLCJjb21tb24vZmlsdGVycy9tYXJrZWQuanMiLCJjb21tb24vZmlsdGVycy9wcmVwZW5kLmpzIiwiY29tbW9uL2ZpbHRlcnMvdHJ1bmNhdGUuanMiLCJjb21tb24vbG9jYWxTdG9yYWdlL2xvY2Fsc3RvcmFnZS5qcyIsImNvbW1vbi9tb2R1bGVzL2lvbmljLnV0aWxzLmpzIiwiY29tbW9uL2RpcmVjdGl2ZXMvY29kZW1pcnJvci1lZGl0L2NvZGVtaXJyb3ItZWRpdC5qcyIsImNvbW1vbi9kaXJlY3RpdmVzL2NvZGVrZXlib2FyZGJhci9jb2Rla2V5Ym9hcmRiYXIuanMiLCJjb21tb24vZGlyZWN0aXZlcy9jb2Rla2V5Ym9hcmRiYXIvc25pcHBldGJ1dHRvbnMuanMiLCJjb21tb24vZGlyZWN0aXZlcy9jb2RlbWlycm9yLXJlYWQvY29kZW1pcnJvci1yZWFkLmpzIiwiY29tbW9uL2RpcmVjdGl2ZXMvamFzbWluZS9qYXNtaW5lLmpzIiwiY29tbW9uL2RpcmVjdGl2ZXMvanMtbG9hZC9qcy1sb2FkLmpzIiwiY29tbW9uL2RpcmVjdGl2ZXMvc2hhcmUvc2hhcmUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaExBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMvT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQy9DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMUpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcE9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBJb25pYyBTdGFydGVyIEFwcFxuXG4vLyBhbmd1bGFyLm1vZHVsZSBpcyBhIGdsb2JhbCBwbGFjZSBmb3IgY3JlYXRpbmcsIHJlZ2lzdGVyaW5nIGFuZCByZXRyaWV2aW5nIEFuZ3VsYXIgbW9kdWxlc1xuLy8gJ3N0YXJ0ZXInIGlzIHRoZSBuYW1lIG9mIHRoaXMgYW5ndWxhciBtb2R1bGUgZXhhbXBsZSAoYWxzbyBzZXQgaW4gYSA8Ym9keT4gYXR0cmlidXRlIGluIGluZGV4Lmh0bWwpXG4vLyB0aGUgMm5kIHBhcmFtZXRlciBpcyBhbiBhcnJheSBvZiAncmVxdWlyZXMnXG4vLyAnc3RhcnRlci5zZXJ2aWNlcycgaXMgZm91bmQgaW4gc2VydmljZXMuanNcbi8vICdzdGFydGVyLmNvbnRyb2xsZXJzJyBpcyBmb3VuZCBpbiBjb250cm9sbGVycy5qc1xudmFyIGFwcCA9IGFuZ3VsYXIubW9kdWxlKCdtaWRlJywgWydpb25pYycsICdpb25pYy51dGlscycsICduZ0NvcmRvdmEnXSlcblxuLnJ1bihmdW5jdGlvbigkaW9uaWNQbGF0Zm9ybSkge1xuICAkaW9uaWNQbGF0Zm9ybS5yZWFkeShmdW5jdGlvbigpIHtcbiAgICAvLyBIaWRlIHRoZSBhY2Nlc3NvcnkgYmFyIGJ5IGRlZmF1bHQgKHJlbW92ZSB0aGlzIHRvIHNob3cgdGhlIGFjY2Vzc29yeSBiYXIgYWJvdmUgdGhlIGtleWJvYXJkXG4gICAgLy8gZm9yIGZvcm0gaW5wdXRzKVxuICAgIC8vICRsb2NhdGlvblByb3ZpZGVyLmh0bWw1TW9kZSh0cnVlKTtcbiAgICBpZiAod2luZG93LmNvcmRvdmEgJiYgd2luZG93LmNvcmRvdmEucGx1Z2lucyAmJiB3aW5kb3cuY29yZG92YS5wbHVnaW5zLktleWJvYXJkKSB7XG4gICAgICBjb3Jkb3ZhLnBsdWdpbnMuS2V5Ym9hcmQuaGlkZUtleWJvYXJkQWNjZXNzb3J5QmFyKHRydWUpO1xuICAgICAgY29yZG92YS5wbHVnaW5zLktleWJvYXJkLmRpc2FibGVTY3JvbGwodHJ1ZSk7XG4gICAgfVxuICAgIGlmICh3aW5kb3cuU3RhdHVzQmFyKSB7XG4gICAgICAvLyBvcmcuYXBhY2hlLmNvcmRvdmEuc3RhdHVzYmFyIHJlcXVpcmVkXG4gICAgICBTdGF0dXNCYXIuc3R5bGVMaWdodENvbnRlbnQoKTtcbiAgICB9XG4gIH0pO1xufSlcblxuLy9UT0RPOlRoaXMgaXMgbmVlZGVkIHRvIHNldCB0byBhY2Nlc3MgdGhlIHByb3h5IHVybCB0aGF0IHdpbGwgdGhlbiBpbiB0aGUgaW9uaWMucHJvamVjdCBmaWxlIHJlZGlyZWN0IGl0IHRvIHRoZSBjb3JyZWN0IFVSTFxuLmNvbnN0YW50KCdBcGlFbmRwb2ludCcsIHtcbiAgdXJsIDogJ2h0dHA6Ly9sb2NhbGhvc3Q6OTAwMC9hcGknXG59KVxuXG4vL1RPRE86J2h0dHBzOi8vcHJvdGVjdGVkLXJlYWNoZXMtNTk0Ni5oZXJva3VhcHAuY29tL2FwaScgLSBEZXBsb3kgbGF0ZXN0IHNlcnZlciBiZWZvcmUgcmVwbGFjaW5nXG5cbi5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlcikge1xuICAvLyBJb25pYyB1c2VzIEFuZ3VsYXJVSSBSb3V0ZXIgd2hpY2ggdXNlcyB0aGUgY29uY2VwdCBvZiBzdGF0ZXNcbiAgLy8gTGVhcm4gbW9yZSBoZXJlOiBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci11aS91aS1yb3V0ZXJcbiAgLy8gU2V0IHVwIHRoZSB2YXJpb3VzIHN0YXRlcyB3aGljaCB0aGUgYXBwIGNhbiBiZSBpbi5cbiAgLy8gRWFjaCBzdGF0ZSdzIGNvbnRyb2xsZXIgY2FuIGJlIGZvdW5kIGluIGNvbnRyb2xsZXJzLmpzXG4gIC8vIGlmIG5vbmUgb2YgdGhlIGFib3ZlIHN0YXRlcyBhcmUgbWF0Y2hlZCwgdXNlIHRoaXMgYXMgdGhlIGZhbGxiYWNrXG5cbiAgJHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZSgnL3dlbGNvbWUnKTtcbn0pXG5cbi8vLy9ydW4gYmxvY2tzOiBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzIwNjYzMDc2L2FuZ3VsYXJqcy1hcHAtcnVuLWRvY3VtZW50YXRpb25cbi8vVXNlIHJ1biBtZXRob2QgdG8gcmVnaXN0ZXIgd29yayB3aGljaCBzaG91bGQgYmUgcGVyZm9ybWVkIHdoZW4gdGhlIGluamVjdG9yIGlzIGRvbmUgbG9hZGluZyBhbGwgbW9kdWxlcy5cbi8vaHR0cDovL2RldmRhY3RpYy5jb20vdXNlci1hdXRoLWFuZ3VsYXJqcy1pb25pYy9cblxuLnJ1bihmdW5jdGlvbiAoJHJvb3RTY29wZSwgJHN0YXRlLCBBdXRoU2VydmljZSwgQVVUSF9FVkVOVFMsIExvY2FsU3RvcmFnZSkge1xuXG4gICAgdmFyIGRlc3RpbmF0aW9uU3RhdGVSZXF1aXJlc0F1dGggPSBmdW5jdGlvbiAoc3RhdGUpIHtcbiAgICAgICAgLy9jb25zb2xlLmxvZygnY2wgLSBkZXN0aW5hdGlvblN0YXRlUmVxdWlyZXNBdXRoJywnc3RhdGUuZGF0YScsc3RhdGUuZGF0YSwnc3RhdGUuZGF0YS5hdXRoJyxzdGF0ZS5kYXRhLmF1dGhlbnRpY2F0ZSk7XG4gICAgICAgIHJldHVybiBzdGF0ZS5kYXRhICYmIHN0YXRlLmRhdGEuYXV0aGVudGljYXRlO1xuICAgIH07XG4gICBcbiAgICAvL1RPRE86IE5lZWQgdG8gbWFrZSBhdXRoZW50aWNhdGlvbiBtb3JlIHJvYnVzdCBiZWxvdyBkb2VzIG5vdCBmb2xsb3cgRlNHIChldC4gYWwuKVxuICAgIC8vVE9ETzogQ3VycmVudGx5IGl0IGlzIG5vdCBjaGVja2luZyB0aGUgYmFja2VuZCByb3V0ZSByb3V0ZXIuZ2V0KCcvdG9rZW4nKVxuICAgICRyb290U2NvcGUuJG9uKCckc3RhdGVDaGFuZ2VTdGFydCcsIGZ1bmN0aW9uIChldmVudCx0b1N0YXRlLCB0b1BhcmFtcykge1xuXG4gICAgICAgIC8vY29uc29sZS5sb2coJ3VzZXIgQXV0aGVudGljYXRlZCcsIEF1dGhTZXJ2aWNlLmlzQXV0aGVudGljYXRlZCgpKTtcblxuICAgICAgICBpZiAoIWRlc3RpbmF0aW9uU3RhdGVSZXF1aXJlc0F1dGgodG9TdGF0ZSkpIHtcbiAgICAgICAgICAgIC8vIFRoZSBkZXN0aW5hdGlvbiBzdGF0ZSBkb2VzIG5vdCByZXF1aXJlIGF1dGhlbnRpY2F0aW9uXG4gICAgICAgICAgICAvLyBTaG9ydCBjaXJjdWl0IHdpdGggcmV0dXJuLlxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKEF1dGhTZXJ2aWNlLmlzQXV0aGVudGljYXRlZCgpKSB7XG4gICAgICAgICAgICAvLyBUaGUgdXNlciBpcyBhdXRoZW50aWNhdGVkLlxuICAgICAgICAgICAgLy8gU2hvcnQgY2lyY3VpdCB3aXRoIHJldHVybi5cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vVE9ETzogTm90IHN1cmUgaG93IHRvIHByb2NlZWQgaGVyZVxuICAgICAgICAkc3RhdGUuZ28oJ3dlbGNvbWUnKTsgLy9pZiBhYm92ZSBmYWlscywgZ290byB3ZWxjb21lXG4gICAgfSk7XG5cbn0pO1xuXG5hcHAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKXtcbiAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdtYWluJywge1xuICAgICAgIHRlbXBsYXRlVXJsOiAnZmVhdHVyZXMvY29tbW9uL21haW4vbWFpbi5odG1sJyxcbiAgICAgICBjb250cm9sbGVyOiAnTWVudUN0cmwnXG4gICB9KTtcbn0pO1xuXG5hcHAuY29udHJvbGxlcignTWFpbkN0cmwnLCBmdW5jdGlvbigkcm9vdFNjb3BlLCRzY29wZSwgJGlvbmljU2lkZU1lbnVEZWxlZ2F0ZSwgJGlvbmljUG9wdXAsICRzdGF0ZSwgQXV0aFNlcnZpY2UsQVVUSF9FVkVOVFMpe1xuICAgICRzY29wZS51c2VybmFtZSA9IEF1dGhTZXJ2aWNlLnVzZXJuYW1lKCk7XG4gICAgLy9jb25zb2xlLmxvZyhBdXRoU2VydmljZS5pc0F1dGhlbnRpY2F0ZWQoKSk7XG5cbiAgICAkc2NvcGUuJG9uKEFVVEhfRVZFTlRTLm5vdEF1dGhvcml6ZWQsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgIHZhciBhbGVydFBvcHVwID0gJGlvbmljUG9wdXAuYWxlcnQoe1xuICAgICAgICAgICAgdGl0bGU6ICdVbmF1dGhvcml6ZWQhJyxcbiAgICAgICAgICAgIHRlbXBsYXRlOiAnWW91IGFyZSBub3QgYWxsb3dlZCB0byBhY2Nlc3MgdGhpcyByZXNvdXJjZS4nXG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgJHNjb3BlLiRvbihBVVRIX0VWRU5UUy5ub3RBdXRoZW50aWNhdGVkLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICBBdXRoU2VydmljZS5sb2dvdXQoKTtcbiAgICAgICAgLy8kc3RhdGUuZ28oJ2xvZ2luJyk7XG4gICAgICAgIHZhciBhbGVydFBvcHVwID0gJGlvbmljUG9wdXAuYWxlcnQoe1xuICAgICAgICAgICAgdGl0bGU6ICdQbGVhc2UgUmV2aWV3JyxcbiAgICAgICAgICAgIHRlbXBsYXRlOiAnJ1xuICAgICAgICB9KTtcbiAgICB9KTtcbn0pO1xuXG5hcHAuY29udHJvbGxlcignTWVudUN0cmwnLCBmdW5jdGlvbigkc2NvcGUsICRpb25pY1NpZGVNZW51RGVsZWdhdGUsICRzdGF0ZSwgQXV0aFNlcnZpY2UsICRyb290U2NvcGUpe1xuXG4gICAgJHNjb3BlLnN0YXRlcyA9IFtcbiAgICAgICAgLy97XG4gICAgICAgIC8vICBuYW1lIDogJ0FjY291bnQnLFxuICAgICAgICAvLyAgcmVmIDogZnVuY3Rpb24oKXtyZXR1cm4gJ2FjY291bnQnO31cbiAgICAgICAgLy99LFxuICAgICAgICB7XG4gICAgICAgICAgbmFtZSA6ICdDaGFsbGVuZ2VzJyxcbiAgICAgICAgICByZWY6IGZ1bmN0aW9uKCl7cmV0dXJuICdleGVyY2lzbS5jb21waWxlJzt9XG4gICAgICAgIH0sXG4vLzw8PDw8PDwgSEVBRFxuICAgICAgICB7XG4gICAgICAgICAgICBuYW1lIDogJ0ZyaWVuZHMnLFxuICAgICAgICAgICAgcmVmOiBmdW5jdGlvbigpe3JldHVybiAnZnJpZW5kcyc7fVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBuYW1lIDogJ1NhbmRib3gnLFxuICAgICAgICAgICAgcmVmIDogZnVuY3Rpb24oKXtyZXR1cm4gJ3NhbmRib3guY29kZSc7fVxuICAgICAgICB9LFxuICAgICAgICAvL3tcbiAgICAgICAgLy8gIG5hbWUgOiAnRXhlcmNpc2VzJyxcbiAgICAgICAgLy8gIHJlZiA6IGZ1bmN0aW9uKCl7cmV0dXJuICdleGVyY2lzZXMnOyB9XG4gICAgICAgIC8vfSxcbi8vPT09PT09PVxuICAgICAgICAvLyB7XG4gICAgICAgIC8vICAgbmFtZSA6ICdFeGVyY2lzZXMnLFxuICAgICAgICAvLyAgIHJlZiA6IGZ1bmN0aW9uKCl7cmV0dXJuICdleGVyY2lzZXMudmlldyc7IH1cbiAgICAgICAgLy8gfSxcbi8vPj4+Pj4+PiBkZXZlbG9wbWVudFxuICAgICAgICB7XG4gICAgICAgICAgbmFtZSA6ICdNeSBTbmlwcGV0cycsXG4gICAgICAgICAgcmVmIDogZnVuY3Rpb24gKCl7cmV0dXJuICdzbmlwcGV0cyc7fVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgbmFtZSA6ICdBYm91dCcsXG4gICAgICAgICAgcmVmIDogZnVuY3Rpb24oKXsgcmV0dXJuICdhYm91dCc7fVxuICAgICAgICB9XG4gICAgICAgIC8vIHtcbiAgICAgICAgLy8gICBuYW1lIDogJ0NyZWF0ZSBDaGFsbGVuZ2VzJyxcbiAgICAgICAgLy8gICByZWYgOiBmdW5jdGlvbigpe3JldHVybiAnZXhlcmNpc2VzJzsgfVxuICAgICAgICAvLyB9XG4gICAgXTtcbiAgICAvLyRzY29wZS5hdXRoUmVxID0gZmFsc2U7XG4gICAgdmFyIGF1dGhSZXEgPSAhZmFsc2U7XG4gICAgJHNjb3BlLnRvZ2dsZU1lbnVTaG93ID0gZnVuY3Rpb24oKXtcbiAgICAgICAgLy9jb25zb2xlLmxvZygnQXV0aFNlcnZpY2UnLEF1dGhTZXJ2aWNlLmlzQXV0aGVudGljYXRlZCgpKVxuICAgICAgICAvL2NvbnNvbGUubG9nKCd0b2dnbGVNZW51U2hvdycsQXV0aFNlcnZpY2UuaXNBdXRoZW50aWNhdGVkKCkpO1xuICAgICAgICBpZihhdXRoUmVxKXtcbiAgICAgICAgICAgIHJldHVybiBBdXRoU2VydmljZS5pc0F1dGhlbnRpY2F0ZWQoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgICRyb290U2NvcGUuJG9uKCdBdXRoJyxmdW5jdGlvbigpe1xuICAgICAgIC8vY29uc29sZS5sb2coJ2F1dGgnKTtcbiAgICAgICAkc2NvcGUudG9nZ2xlTWVudVNob3coKTtcbiAgICB9KTtcblxuICAgIC8vY29uc29sZS5sb2coQXV0aFNlcnZpY2UuaXNBdXRoZW50aWNhdGVkKCkpO1xuICAgIC8vaWYoQXV0aFNlcnZpY2UuaXNBdXRoZW50aWNhdGVkKCkpe1xuICAgICRzY29wZS5jbGlja0l0ZW0gPSBmdW5jdGlvbihzdGF0ZVJlZil7XG4gICAgICAgICRpb25pY1NpZGVNZW51RGVsZWdhdGUudG9nZ2xlTGVmdCgpO1xuICAgICAgICAkc3RhdGUuZ28oc3RhdGVSZWYoKSk7IC8vUkI6IFVwZGF0ZWQgdG8gaGF2ZSBzdGF0ZVJlZiBhcyBhIGZ1bmN0aW9uIGluc3RlYWQuXG4gICAgfTtcblxuICAgICRzY29wZS50b2dnbGVNZW51ID0gZnVuY3Rpb24oKXtcbiAgICAgICAgJGlvbmljU2lkZU1lbnVEZWxlZ2F0ZS50b2dnbGVMZWZ0KCk7XG4gICAgfTtcbiAgICAvL31cbn0pOyIsImFwcC5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIpe1xuXHQkc3RhdGVQcm92aWRlci5zdGF0ZSgnYWJvdXQnLCB7XG5cdFx0dXJsOiAnL2Fib3V0Jyxcblx0XHR0ZW1wbGF0ZVVybDogJ2ZlYXR1cmVzL2Fib3V0L2Fib3V0Lmh0bWwnXG5cdH0pO1xufSk7IiwiYXBwLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlciwgVVNFUl9ST0xFUyl7XG5cdC8vIEVhY2ggdGFiIGhhcyBpdHMgb3duIG5hdiBoaXN0b3J5IHN0YWNrOlxuXHQkc3RhdGVQcm92aWRlci5zdGF0ZSgnYWNjb3VudCcsIHtcblx0XHR1cmw6ICcvYWNjb3VudCcsXG5cdCAgICB0ZW1wbGF0ZVVybDogJ2ZlYXR1cmVzL2FjY291bnQvYWNjb3VudC5odG1sJyxcblx0XHRjb250cm9sbGVyOiAnQWNjb3VudEN0cmwnXG5cdFx0Ly8gLFxuXHRcdC8vIGRhdGE6IHtcblx0XHQvLyBcdGF1dGhlbnRpY2F0ZTogW1VTRVJfUk9MRVMucHVibGljXVxuXHRcdC8vIH1cblx0fSk7XG59KTtcblxuYXBwLmNvbnRyb2xsZXIoJ0FjY291bnRDdHJsJywgZnVuY3Rpb24oJHNjb3BlKSB7XG5cdCRzY29wZS5zZXR0aW5ncyA9IHtcblx0XHRlbmFibGVGcmllbmRzOiB0cnVlXG5cdH07XG59KTsiLCJhcHAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKXtcblx0JHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2V4ZXJjaXNlJyx7XG5cdFx0dXJsOiAnL2V4ZXJjaXNlLzpzbHVnJyxcblx0XHRhYnN0cmFjdDogdHJ1ZSxcblx0XHR0ZW1wbGF0ZVVybCA6ICdmZWF0dXJlcy9leGVyY2lzZS9leGVyY2lzZS5odG1sJ1xuXHR9KTtcbn0pO1xuXG5hcHAuZmFjdG9yeSgnRXhlcmNpc2VGYWN0b3J5JywgZnVuY3Rpb24oKXtcblxufSk7IiwiYXBwLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlcil7XG5cdCRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdleGVyY2lzZS5jb2RlJywge1xuXHRcdHVybCA6ICcvZXhlcmNpc2UvOnNsdWcvY29kZScsXG5cdFx0dmlld3MgOiB7XG5cdFx0XHQndGFiLWNvZGUnIDoge1xuXHRcdFx0XHR0ZW1wbGF0ZVVybCA6ICdmZWF0dXJlcy9leGVyY2lzZS1jb2RlL2V4ZXJjaXNlLWNvZGUuaHRtbCcsXG5cdFx0XHRcdGNvbnRyb2xsZXI6ICdFeGVyY2lzZUNvZGVDdHJsJ1xuXHRcdFx0fVxuXHRcdH1cblx0fSk7XG59KTtcblxuYXBwLmNvbnRyb2xsZXIoJ0V4ZXJjaXNlQ29kZUN0cmwnLCBmdW5jdGlvbigkc2NvcGUpe1xufSk7IiwiYXBwLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlcil7XG5cdCRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdleGVyY2lzZS5jb21waWxlJywge1xuXHRcdHVybCA6ICcvZXhlcmNpc2UvOnNsdWcvY29tcGlsZScsXG5cdFx0dmlld3MgOiB7XG5cdFx0XHQndGFiLWNvbXBpbGUnIDoge1xuXHRcdFx0XHR0ZW1wbGF0ZVVybCA6ICdmZWF0dXJlcy9leGVyY2lzZS1jb21waWxlL2V4ZXJjaXNlLWNvbXBpbGUuaHRtbCcsXG5cdFx0XHRcdGNvbnRyb2xsZXI6ICdFeGVyY2lzZUNvbXBpbGVDdHJsJ1xuXHRcdFx0fVxuXHRcdH1cblx0fSk7XG59KTtcblxuYXBwLmNvbnRyb2xsZXIoJ0V4ZXJjaXNlQ29tcGlsZUN0cmwnLCBmdW5jdGlvbigkc2NvcGUpe1xuXG59KTsiLCJhcHAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKXtcblx0JHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2V4ZXJjaXNlLnRlc3QnLCB7XG5cdFx0dXJsIDogJy9leGVyY2lzZS86c2x1Zy90ZXN0Jyxcblx0XHR2aWV3cyA6IHtcblx0XHRcdCd0YWItdGVzdCcgOiB7XG5cdFx0XHRcdHRlbXBsYXRlVXJsIDogJ2ZlYXR1cmVzL2V4ZXJjaXNlLXRlc3QvZXhlcmNpc2UtdGVzdC5odG1sJyxcblx0XHRcdFx0Y29udHJvbGxlcjogJ0V4ZXJjaXNlVGVzdEN0cmwnXG5cdFx0XHR9XG5cdFx0fVxuXHR9KTtcbn0pO1xuXG5hcHAuY29udHJvbGxlcignRXhlcmNpc2VUZXN0Q3RybCcsIGZ1bmN0aW9uKCRzY29wZSl7XG5cbn0pOyIsImFwcC5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIpe1xuXHQkc3RhdGVQcm92aWRlci5zdGF0ZSgnZXhlcmNpc2UudmlldycsIHtcblx0XHR1cmwgOiAnL2V4ZXJjaXNlLzpzbHVnL3ZpZXcnLFxuXHRcdHZpZXdzIDoge1xuXHRcdFx0J3RhYi12aWV3JyA6IHtcblx0XHRcdFx0dGVtcGxhdGVVcmwgOiAnZmVhdHVyZXMvZXhlcmNpc2Utdmlldy9leGVyY2lzZS12aWV3Lmh0bWwnLFxuXHRcdFx0XHRjb250cm9sbGVyOiAnRXhlcmNpc2VWaWV3Q3RybCdcblx0XHRcdH1cblx0XHR9XG5cdH0pO1xufSk7XG5cbmFwcC5jb250cm9sbGVyKCdFeGVyY2lzZVZpZXdDdHJsJywgZnVuY3Rpb24oJHNjb3BlKXtcblxufSk7IiwiYXBwLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlcil7XG5cdCRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdleGVyY2lzZS52aWV3LWVkaXQnLCB7XG5cdFx0dXJsIDogJy9leGVyY2lzZS86c2x1Zy92aWV3L2VkaXQnLFxuXHRcdHZpZXdzIDoge1xuXHRcdFx0J3RhYi12aWV3JyA6IHtcblx0XHRcdFx0dGVtcGxhdGVVcmwgOiAnZmVhdHVyZXMvZXhlcmNpc2Utdmlldy1lZGl0L2V4ZXJjaXNlLXZpZXctZWRpdC5odG1sJyxcblx0XHRcdFx0Y29udHJvbGxlcjogJ0V4ZXJjaXNlVmlld0VkaXRDdHJsJ1xuXHRcdFx0fVxuXHRcdH1cblx0fSk7XG59KTtcblxuYXBwLmNvbnRyb2xsZXIoJ0V4ZXJjaXNlVmlld0VkaXRDdHJsJywgZnVuY3Rpb24oJHNjb3BlKXtcblxufSk7IiwiYXBwLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlcil7XG5cdCRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdleGVyY2lzZXMnLCB7XG5cdFx0dXJsIDogJy9leGVyY2lzZXMnLFxuXHRcdHRlbXBsYXRlVXJsIDogJ2ZlYXR1cmVzL2V4ZXJjaXNlcy9leGVyY2lzZXMuaHRtbCcsXG5cdFx0Y29udHJvbGxlcjogJ0V4ZXJjaXNlc0N0cmwnXG5cdH0pO1xufSk7XG5cbmFwcC5jb250cm9sbGVyKCdFeGVyY2lzZXNDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCAkc3RhdGUpe1xuXHQkc2NvcGUuY3JlYXRlID0gZnVuY3Rpb24oKXtcblx0XHQkc3RhdGUuZ28oJ2V4ZXJjaXNlcy1jcmVhdGUnKTtcblx0fTtcbn0pO1xuXG5hcHAuZmFjdG9yeSgnRXhlcmNpc2VGYWN0b3J5JywgZnVuY3Rpb24oJGxvY2Fsc3RvcmFnZSl7XG5cdHZhciBleGVyY2lzZXMgPSAkbG9jYWxzdG9yYWdlLmdldE9iamVjdCgnZXhlcmNpc2VzJyk7XG5cdGlmKHdpbmRvdy5fLmlzRW1wdHkoZXhlcmNpc2VzKSkgZXhlcmNpc2VzID0gW107XG5cblx0cmV0dXJuIHtcblx0XHRnZXRFeGVyY2lzZXMgOiBmdW5jdGlvbigpe1xuXHRcdFx0cmV0dXJuIGV4ZXJjaXNlcztcblx0XHR9LFxuXHRcdGNyZWF0ZUV4ZXJjaXNlIDogZnVuY3Rpb24oZXhlcmNpc2Upe1xuXHRcdFx0ZXhlcmNpc2VzLnB1c2goZXhlcmNpc2UpO1xuXHRcdFx0JGxvY2Fsc3RvcmFnZS5zZXRPYmplY3QoZXhlcmNpc2VzKTtcblx0XHR9LFxuXHRcdGdldEV4ZXJjaXNlIDogZnVuY3Rpb24oc2x1Zyl7XG5cdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGV4ZXJjaXNlcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRpZiAoZXhlcmNpc2VzW2ldLnNsdWcgPT09IHNsdWcpIHJldHVybiBleGVyY2lzZXNbaV07XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4ge307XG5cdFx0fSxcblx0XHR1cGRhdGVFeGVyY2lzZSA6IGZ1bmN0aW9uKGV4ZXJjaXNlKXtcblx0XHRcdGZvcih2YXIgaSA9IDA7IGkgPCBleGVyY2lzZXMubGVuZ3RoOyBpKyspe1xuXG5cdFx0XHR9XG5cdFx0fSxcblx0XHRkZWxldGVFeGVyY2lzZSA6IGZ1bmN0aW9uKCl7XG5cblx0XHR9XG5cdH07XG59KTsiLCJhcHAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKXtcblx0JHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2V4ZXJjaXNlcy1jcmVhdGUnLCB7XG5cdFx0dXJsIDogJy9leGVyY2lzZXMvY3JlYXRlJyxcblx0XHR0ZW1wbGF0ZVVybCA6ICdmZWF0dXJlcy9leGVyY2lzZXMtY3JlYXRlL2V4ZXJjaXNlcy1jcmVhdGUuaHRtbCcsXG5cdFx0Y29udHJvbGxlcjogJ0V4ZXJjaXNlc0NyZWF0ZUN0cmwnXG5cdH0pO1xufSk7XG5cbmFwcC5jb250cm9sbGVyKCdFeGVyY2lzZXNDcmVhdGVDdHJsJywgZnVuY3Rpb24oJHNjb3BlKXtcblxufSk7IiwiYXBwLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlcil7XG5cdCRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdleGVyY2lzbScsIHtcblx0XHR0ZW1wbGF0ZVVybCA6ICdmZWF0dXJlcy9leGVyY2lzbS9leGVyY2lzbS5odG1sJyxcblx0XHRhYnN0cmFjdCA6IHRydWUsXG5cdFx0cmVzb2x2ZSA6IHtcblx0XHRcdG1hcmtkb3duIDogZnVuY3Rpb24oQXZhaWxhYmxlRXhlcmNpc2VzLCBFeGVyY2lzbUZhY3RvcnksICRzdGF0ZSl7XG5cblx0XHRcdFx0aWYoRXhlcmNpc21GYWN0b3J5LmdldFRlc3RTY3JpcHQoKS5sZW5ndGggPT09IDApIHtcblx0XHRcdFx0XHR2YXIgZXhlcmNpc2UgPSBBdmFpbGFibGVFeGVyY2lzZXMuZ2V0UmFuZG9tRXhlcmNpc2UoKTtcblx0XHRcdFx0XHRFeGVyY2lzbUZhY3Rvcnkuc2V0TmFtZShleGVyY2lzZS5uYW1lKTtcblx0XHRcdFx0XHRyZXR1cm4gRXhlcmNpc21GYWN0b3J5LmdldEV4dGVybmFsU2NyaXB0KGV4ZXJjaXNlLmxpbmspLnRoZW4oZnVuY3Rpb24oZGF0YSl7XG5cdFx0XHRcdFx0XHRyZXR1cm4gRXhlcmNpc21GYWN0b3J5LmdldEV4dGVybmFsTWQoZXhlcmNpc2UubWRMaW5rKTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0fVxuXHR9KTtcbn0pO1xuXG5hcHAuZmFjdG9yeSgnRXhlcmNpc21GYWN0b3J5JywgZnVuY3Rpb24oJGh0dHAsICRyb290U2NvcGUpe1xuXHR2YXIgbmFtZSA9ICcnO1xuXHR2YXIgdGVzdCA9ICcnO1xuXHR2YXIgY29kZSA9ICdcXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG4nO1xuXHR2YXIgbWFya2Rvd24gPSAnJztcblxuXHRyZXR1cm4ge1xuXHRcdGdldEV4dGVybmFsU2NyaXB0IDogZnVuY3Rpb24obGluayl7XG5cdFx0XHRyZXR1cm4gJGh0dHAuZ2V0KGxpbmspLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuXHRcdFx0XHR0ZXN0ID0gcmVzcG9uc2UuZGF0YTtcblx0XHRcdFx0cmV0dXJuIHJlc3BvbnNlLmRhdGE7XG5cdFx0XHR9KTtcblx0XHR9LFxuXHRcdGdldEV4dGVybmFsTWQgOiBmdW5jdGlvbihsaW5rKXtcblx0XHRcdHJldHVybiAkaHR0cC5nZXQobGluaykudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG5cdFx0XHRcdG1hcmtkb3duID0gcmVzcG9uc2UuZGF0YTtcblx0XHRcdFx0cmV0dXJuIHJlc3BvbnNlLmRhdGE7XG5cdFx0XHR9KTtcblx0XHR9LFxuXHRcdHNldE5hbWUgOiBmdW5jdGlvbihzZXROYW1lKXtcblx0XHRcdG5hbWUgPSBzZXROYW1lO1xuXHRcdH0sXG5cdFx0c2V0VGVzdFNjcmlwdCA6IGZ1bmN0aW9uKHRlc3Qpe1xuXHRcdFx0dGVzdCA9IHRlc3Q7XG5cdFx0XHQkcm9vdFNjb3BlLiRicm9hZGNhc3QoJ3Rlc3RDaGFuZ2UnLCB0ZXN0KTtcblx0XHR9LFxuXHRcdHNldENvZGVTY3JpcHQgOiBmdW5jdGlvbiAoY29kZSl7XG5cdFx0XHRjb2RlID0gY29kZTtcblx0XHRcdCRyb290U2NvcGUuJGJyb2FkY2FzdCgnY29kZUNoYW5nZScsIGNvZGUpO1xuXHRcdH0sXG5cdFx0Z2V0VGVzdFNjcmlwdCA6IGZ1bmN0aW9uKCl7XG5cdFx0XHRyZXR1cm4gdGVzdDtcblx0XHR9LFxuXHRcdGdldENvZGVTY3JpcHQgOiBmdW5jdGlvbigpe1xuXHRcdFx0cmV0dXJuIGNvZGU7XG5cdFx0fSxcblx0XHRnZXRNYXJrZG93biA6IGZ1bmN0aW9uKCl7XG5cdFx0XHRyZXR1cm4gbWFya2Rvd247XG5cdFx0fSxcblx0XHRnZXROYW1lIDogZnVuY3Rpb24oKXtcblx0XHRcdHJldHVybiBuYW1lO1xuXHRcdH1cblx0fTtcbn0pO1xuXG5hcHAuZmFjdG9yeSgnQXZhaWxhYmxlRXhlcmNpc2VzJywgZnVuY3Rpb24oKXtcblxuXHR2YXIgbGlicmFyeSA9IFtcblx0XHQvLyAnYWNjdW11bGF0ZScsXG5cdFx0Ly8gJ2FsbGVyZ2llcycsXG5cdFx0Ly8gJ2FuYWdyYW0nLFxuXHRcdC8vICdhdGJhc2gtY2lwaGVyJyxcblx0XHQvLyAnYmVlci1zb25nJyxcblx0XHQvLyAnYmluYXJ5Jyxcblx0XHQvLyAnYmluYXJ5LXNlYXJjaC10cmVlJyxcblx0XHQvLyAnYm9iJyxcblx0XHQvLyAnYnJhY2tldC1wdXNoJyxcblx0XHQvLyAnY2lyY3VsYXItYnVmZmVyJyxcblx0XHQvLyAnY2xvY2snLFxuXHRcdC8vICdjcnlwdG8tc3F1YXJlJyxcblx0XHQvLyAnY3VzdG9tLXNldCcsXG5cdFx0Ly8gJ2RpZmZlcmVuY2Utb2Ytc3F1YXJlcycsXG5cdFx0Ly8gJ2V0bCcsXG5cdFx0Ly8gJ2Zvb2QtY2hhaW4nLFxuXHRcdC8vICdnaWdhc2Vjb25kJyxcblx0XHQvLyAnZ3JhZGUtc2Nob29sJyxcblx0XHQvLyAnZ3JhaW5zJyxcblx0XHQvLyAnaGFtbWluZycsXG5cdFx0J2hlbGxvLXdvcmxkJ1xuXHRcdC8vICdoZXhhZGVjaW1hbCdcblx0XTtcblxuXHR2YXIgZ2VuZXJhdGVMaW5rID0gZnVuY3Rpb24obmFtZSl7XG5cdFx0cmV0dXJuICdleGVyY2lzbS9qYXZhc2NyaXB0LycgKyBuYW1lICsgJy8nICsgbmFtZSArICdfdGVzdC5zcGVjLmpzJztcblx0fTtcblxuXHR2YXIgZ2VuZXJhdGVNZExpbmsgPSBmdW5jdGlvbihuYW1lKXtcblx0XHRyZXR1cm4gJ2V4ZXJjaXNtL2phdmFzY3JpcHQvJyArIG5hbWUgKyAnLycgKyBuYW1lICsgJy5tZCc7XG5cdH07XG5cblx0dmFyIGdlbmVyYXRlUmFuZG9tID0gZnVuY3Rpb24oKXtcblx0XHR2YXIgcmFuZG9tID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogbGlicmFyeS5sZW5ndGgpO1xuXHRcdHJldHVybiBsaWJyYXJ5W3JhbmRvbV07XG5cdH07XG5cblx0cmV0dXJuIHtcblx0XHRnZXRTcGVjaWZpY0V4ZXJjaXNlIDogZnVuY3Rpb24obmFtZSl7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRsaW5rIDogZ2VuZXJhdGVMaW5rKG5hbWUpLFxuXHRcdFx0XHRtZExpbmsgOiBnZW5lcmF0ZU1kTGluayhuYW1lKVxuXHRcdFx0fTtcblx0XHR9LFxuXHRcdGdldFJhbmRvbUV4ZXJjaXNlIDogZnVuY3Rpb24oKXtcblx0XHRcdHZhciBuYW1lID0gZ2VuZXJhdGVSYW5kb20oKTtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdG5hbWUgOiBuYW1lLFxuXHRcdFx0XHRsaW5rIDogZ2VuZXJhdGVMaW5rKG5hbWUpLFxuXHRcdFx0XHRtZExpbmsgOiBnZW5lcmF0ZU1kTGluayhuYW1lKVxuXHRcdFx0fTtcblx0XHR9XG5cdH07XG59KTsiLCJhcHAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKXtcblx0JHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2V4ZXJjaXNtLmNvZGUnLCB7XG5cdFx0dXJsIDogJy9leGVyY2lzbS9jb2RlJyxcblx0XHR2aWV3cyA6IHtcblx0XHRcdCd0YWItY29kZScgOiB7XG5cdFx0XHRcdHRlbXBsYXRlVXJsIDogJ2ZlYXR1cmVzL2V4ZXJjaXNtLWNvZGUvZXhlcmNpc20tY29kZS5odG1sJyxcblx0XHRcdFx0Y29udHJvbGxlcjogJ0V4ZXJjaXNtQ29kZUN0cmwnXG5cdFx0XHR9XG5cdFx0fVxuXHR9KTtcbn0pO1xuXG5hcHAuY29udHJvbGxlcignRXhlcmNpc21Db2RlQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgRXhlcmNpc21GYWN0b3J5LCAkc3RhdGUsIEtleWJvYXJkRmFjdG9yeSl7XG5cdCRzY29wZS5uYW1lID0gRXhlcmNpc21GYWN0b3J5LmdldE5hbWUoKTtcblx0JHNjb3BlLmNvZGUgPSB7XG5cdFx0dGV4dCA6IG51bGxcblx0fTtcblxuXHQkc2NvcGUuY29kZS50ZXh0ID0gRXhlcmNpc21GYWN0b3J5LmdldENvZGVTY3JpcHQoKTtcblx0Ly9kb2Vzbid0IGRvIGFueXRoaW5nIHJpZ2h0IG5vdyAtIG1heWJlIHB1bGwgcHJldmlvdXNseSBzYXZlZCBjb2RlXG5cblx0Ly9wYXNzaW5nIHRoaXMgdXBkYXRlIGZ1bmN0aW9uIHNvIHRoYXQgb24gdGV4dCBjaGFuZ2UgaW4gdGhlIGRpcmVjdGl2ZSB0aGUgZmFjdG9yeSB3aWxsIGJlIGFsZXJ0ZWRcblx0JHNjb3BlLmNvbXBpbGUgPSBmdW5jdGlvbihjb2RlKXtcblx0XHRFeGVyY2lzbUZhY3Rvcnkuc2V0Q29kZVNjcmlwdChjb2RlKTtcblx0XHQvLyAkc3RhdGUuZ28oJ2V4ZXJjaXNtLmNvbXBpbGUnKTtcblx0fTtcblxuXHQkc2NvcGUuaW5zZXJ0RnVuYyA9IEtleWJvYXJkRmFjdG9yeS5tYWtlSW5zZXJ0RnVuYygkc2NvcGUpO1xufSk7IiwiYXBwLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlcil7XG5cdCRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdleGVyY2lzbS5jb21waWxlJywge1xuXHRcdHVybCA6ICcvZXhlcmNpc20vY29tcGlsZScsXG5cdFx0dmlld3MgOiB7XG5cdFx0XHQndGFiLWNvbXBpbGUnIDoge1xuXHRcdFx0XHR0ZW1wbGF0ZVVybCA6ICdmZWF0dXJlcy9leGVyY2lzbS1jb21waWxlL2V4ZXJjaXNtLWNvbXBpbGUuaHRtbCcsXG5cdFx0XHRcdGNvbnRyb2xsZXI6ICdFeGVyY2lzbUNvbXBpbGVDdHJsJ1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0b25FbnRlciA6IGZ1bmN0aW9uKCl7XG5cdFx0XHRpZih3aW5kb3cuamFzbWluZSkgd2luZG93Lmphc21pbmUuZ2V0RW52KCkuZXhlY3V0ZSgpO1xuXHRcdH1cblx0fSk7XG59KTtcblxuYXBwLmNvbnRyb2xsZXIoJ0V4ZXJjaXNtQ29tcGlsZUN0cmwnLCBmdW5jdGlvbigkc2NvcGUsIEV4ZXJjaXNtRmFjdG9yeSl7XG5cdCRzY29wZS5uYW1lID0gRXhlcmNpc21GYWN0b3J5LmdldE5hbWUoKTtcblx0JHNjb3BlLmNvbXBpbGluZyA9IHtcblx0XHR0ZXN0OiBudWxsLFxuXHRcdGNvZGUgOiBudWxsXG5cdH07XG5cdCRzY29wZS5jb21waWxpbmcudGVzdCA9IEV4ZXJjaXNtRmFjdG9yeS5nZXRUZXN0U2NyaXB0KCk7XG5cdCRzY29wZS5jb21waWxpbmcuY29kZSA9IEV4ZXJjaXNtRmFjdG9yeS5nZXRDb2RlU2NyaXB0KCk7XG5cblxuXHQkc2NvcGUuJG9uKCd0ZXN0Q2hhbmdlJywgZnVuY3Rpb24oZXZlbnQsIGRhdGEpe1xuXHRcdCRzY29wZS5jb21waWxpbmcudGVzdCA9IGRhdGE7XG5cdH0pO1xuXG5cdCRzY29wZS4kb24oJ2NvZGVDaGFuZ2UnLCBmdW5jdGlvbihldmVudCwgZGF0YSl7XG5cdFx0JHNjb3BlLmNvbXBpbGluZy5jb2RlID0gZGF0YTtcblx0fSk7XG59KTsiLCJhcHAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKXtcblx0JHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2V4ZXJjaXNtLnRlc3QnLCB7XG5cdFx0dXJsIDogJy9leGVyY2lzbS90ZXN0Jyxcblx0XHR2aWV3cyA6IHtcblx0XHRcdCd0YWItdGVzdCcgOiB7XG5cdFx0XHRcdHRlbXBsYXRlVXJsIDogJ2ZlYXR1cmVzL2V4ZXJjaXNtLXRlc3QvZXhlcmNpc20tdGVzdC5odG1sJyxcblx0XHRcdFx0Y29udHJvbGxlciA6ICdFeGVyY2lzbVRlc3RDdHJsJ1xuXHRcdFx0fVxuXHRcdH1cblx0fSk7XG59KTtcblxuYXBwLmNvbnRyb2xsZXIoJ0V4ZXJjaXNtVGVzdEN0cmwnLCBmdW5jdGlvbigkc2NvcGUsIEV4ZXJjaXNtRmFjdG9yeSwgS2V5Ym9hcmRGYWN0b3J5KXtcblxuXHQkc2NvcGUubmFtZSA9IEV4ZXJjaXNtRmFjdG9yeS5nZXROYW1lKCk7XG5cblx0JHNjb3BlLnRlc3QgPSB7XG5cdFx0dGV4dDogbnVsbFxuXHR9O1xuXG5cdCRzY29wZS50ZXN0LnRleHQgPSBFeGVyY2lzbUZhY3RvcnkuZ2V0VGVzdFNjcmlwdCgpO1xuXG5cdCRzY29wZS4kd2F0Y2goJ3Rlc3QudGV4dCcsIGZ1bmN0aW9uKG5ld1ZhbHVlKXtcblx0XHRFeGVyY2lzbUZhY3Rvcnkuc2V0VGVzdFNjcmlwdChuZXdWYWx1ZSk7XG5cdH0pO1xuXG5cdCRzY29wZS5pbnNlcnRGdW5jID0gS2V5Ym9hcmRGYWN0b3J5Lm1ha2VJbnNlcnRGdW5jKCRzY29wZSk7XG59KTsiLCJhcHAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKXtcblx0JHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2V4ZXJjaXNtLnZpZXcnLCB7XG5cdFx0dXJsOiAnL2V4ZXJjaXNtL3ZpZXcnLFxuXHRcdHZpZXdzOiB7XG5cdFx0XHQndGFiLXZpZXcnIDoge1xuXHRcdFx0XHR0ZW1wbGF0ZVVybDogJ2ZlYXR1cmVzL2V4ZXJjaXNtLXZpZXcvZXhlcmNpc20tdmlldy5odG1sJyxcblx0XHRcdFx0Y29udHJvbGxlcjogJ0V4ZXJjaXNtVmlld0N0cmwnXG5cdFx0XHR9XG5cdFx0fVxuXHR9KTtcbn0pO1xuXG5hcHAuY29udHJvbGxlcignRXhlcmNpc21WaWV3Q3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgRXhlcmNpc21GYWN0b3J5KXtcblx0JHNjb3BlLm1hcmtkb3duID0gRXhlcmNpc21GYWN0b3J5LmdldE1hcmtkb3duKCk7XG5cdCRzY29wZS5uYW1lID0gRXhlcmNpc21GYWN0b3J5LmdldE5hbWUoKTtcbn0pOyIsImFwcC5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIpe1xuXHQkc3RhdGVQcm92aWRlci5zdGF0ZSgnbG9naW4nLCB7XG5cdFx0dXJsIDogJy9sb2dpbicsXG5cdFx0dGVtcGxhdGVVcmwgOiAnZmVhdHVyZXMvbG9naW4vbG9naW4uaHRtbCcsXG5cdFx0Y29udHJvbGxlciA6ICdMb2dpbkN0cmwnXG5cdH0pO1xufSk7XG5cbmFwcC5jb250cm9sbGVyKCdMb2dpbkN0cmwnLCBmdW5jdGlvbigkcm9vdFNjb3BlLCAkc2NvcGUsICRpb25pY1BvcHVwLCAkc3RhdGUsIEF1dGhTZXJ2aWNlKXtcblx0JHNjb3BlLmRhdGEgPSB7fTtcblx0JHNjb3BlLmVycm9yID0gbnVsbDtcblxuICAgICRzY29wZS5zaWdudXAgPSBmdW5jdGlvbigpe1xuICAgICAgICAkc3RhdGUuZ28oJ3NpZ251cCcpO1xuICAgIH07XG5cblx0JHNjb3BlLmxvZ2luID0gZnVuY3Rpb24oKXtcblx0XHRBdXRoU2VydmljZVxuXHRcdFx0LmxvZ2luKCRzY29wZS5kYXRhKVxuXHRcdFx0LnRoZW4oZnVuY3Rpb24oYXV0aGVudGljYXRlZCl7IC8vVE9ETzphdXRoZW50aWNhdGVkIGlzIHdoYXQgaXMgcmV0dXJuZWRcblx0XHRcdFx0Y29uc29sZS5sb2coJ2xvZ2luIHN1Y2Nlc3NmdWwnLGF1dGhlbnRpY2F0ZWQpO1xuXHRcdFx0XHQvLyRzY29wZS5tZW51ID0gdHJ1ZTtcblx0XHRcdFx0JHJvb3RTY29wZS4kYnJvYWRjYXN0KCdBdXRoJyk7XG5cdFx0XHRcdCRzY29wZS5zdGF0ZXMucHVzaCh7IC8vVE9ETzogTmVlZCB0byBhZGQgYSBwYXJlbnQgY29udHJvbGxlciB0byBjb21tdW5pY2F0ZVxuXHRcdFx0XHRcdG5hbWU6ICdMb2dvdXQnLFxuXHRcdFx0XHRcdHJlZjogZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRcdEF1dGhTZXJ2aWNlLmxvZ291dCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmRhdGEgPSB7fTtcblx0XHRcdFx0XHRcdCRzY29wZS5zdGF0ZXMucG9wKCk7IC8vVE9ETzogRmluZCBhIGJldHRlciB3YXkgdG8gcmVtb3ZlIHRoZSBMb2dvdXQgbGluaywgaW5zdGVhZCBvZiBwb3Bcblx0XHRcdFx0XHRcdCRzdGF0ZS5nbygnd2VsY29tZScpO1xuXHRcdFx0XHRcdFx0JHJvb3RTY29wZS4kYnJvYWRjYXN0KCdBdXRoJyk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdFx0JHN0YXRlLmdvKCdleGVyY2lzbS5jb21waWxlJyk7XG5cdFx0XHRcdC8vVE9ETzogV2UgY2FuIHNldCB0aGUgdXNlciBuYW1lIGhlcmUgYXMgd2VsbC4gVXNlZCBpbiBjb25qdW5jdGlvbiB3aXRoIGEgbWFpbiBjdHJsXG5cdFx0XHR9KVxuXHRcdFx0LmNhdGNoKGZ1bmN0aW9uKGVycil7XG5cdFx0XHRcdCRzY29wZS5lcnJvciA9ICdMb2dpbiBJbnZhbGlkJztcblx0XHRcdFx0Y29uc29sZS5lcnJvcihKU09OLnN0cmluZ2lmeShlcnIpKVxuXHRcdFx0XHR2YXIgYWxlcnRQb3B1cCA9ICRpb25pY1BvcHVwLmFsZXJ0KHtcblx0XHRcdFx0XHR0aXRsZTogJ0xvZ2luIGZhaWxlZCEnLFxuXHRcdFx0XHRcdHRlbXBsYXRlOiAnUGxlYXNlIGNoZWNrIHlvdXIgY3JlZGVudGlhbHMhJ1xuXHRcdFx0XHR9KTtcblx0XHRcdH0pO1xuXHR9O1xufSk7XG5cblxuLy9UT0RPOiBDbGVhbnVwIGNvbW1lbnRlZCBjb2RlXG5cbiIsImFwcC5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIsIFVTRVJfUk9MRVMpe1xuXG4gICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdmcmllbmRzJywge1xuICAgICAgY2FjaGU6IGZhbHNlLCAvL3RvIGVuc3VyZSB0aGUgY29udHJvbGxlciBpcyBsb2FkaW5nIGVhY2ggdGltZVxuICAgICAgdXJsOiAnL2ZyaWVuZHMnLFxuICAgICAgdGVtcGxhdGVVcmw6ICdmZWF0dXJlcy9mcmllbmRzL2ZyaWVuZHMuaHRtbCcsXG4gICAgICBjb250cm9sbGVyOiAnRnJpZW5kc0N0cmwnLFxuICAgICAgcmVzb2x2ZToge1xuICAgICAgICBmcmllbmRzOiBmdW5jdGlvbihGcmllbmRzRmFjdG9yeSkge1xuICAgICAgICAgIHJldHVybiBGcmllbmRzRmFjdG9yeS5nZXRGcmllbmRzKCkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdyZXNwb25zZS5kYXRhIGZyaWVuZHMnLHJlc3BvbnNlLmRhdGEuZnJpZW5kcyk7XG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UuZGF0YS5mcmllbmRzO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSlcbiAgICAuc3RhdGUoJ3NoYXJlZC1naXN0cycsIHtcbiAgICAgIGNhY2hlOiBmYWxzZSwgLy90byBlbnN1cmUgdGhlIGNvbnRyb2xsZXIgaXMgbG9hZGluZyBlYWNoIHRpbWVcbiAgICAgIHVybDogJy9jaGF0cy86dXNlcklkJyxcbiAgICAgIHRlbXBsYXRlVXJsOiAnZmVhdHVyZXMvZnJpZW5kcy9zaGFyZWQtZ2lzdHMuaHRtbCcsXG4gICAgICBjb250cm9sbGVyOiAnU2hhcmVkR2lzdHNDdHJsJ1xuICAgIH0pXG4gICAgLnN0YXRlKCd2aWV3LWNvZGUnLCB7XG4gICAgICBjYWNoZTogZmFsc2UsIC8vdG8gZW5zdXJlIHRoZSBjb250cm9sbGVyIGlzIGxvYWRpbmcgZWFjaCB0aW1lXG4gICAgICB1cmw6ICcvY2hhdHMvY29kZS86dXNlcklkLzpnaXN0SW5kZXgnLFxuICAgICAgdGVtcGxhdGVVcmw6ICdmZWF0dXJlcy9mcmllbmRzL3ZpZXctY29kZS5odG1sJyxcbiAgICAgIGNvbnRyb2xsZXI6ICdWaWV3Q29kZUN0cmwnXG4gICAgfSlcbn0pO1xuXG5hcHAuY29udHJvbGxlcignRnJpZW5kc0N0cmwnLCBmdW5jdGlvbigkc2NvcGUsIEZyaWVuZHNGYWN0b3J5LGZyaWVuZHMsICRzdGF0ZSwgR2lzdEZhY3RvcnkpIHtcbiAgLy9jb25zb2xlLmxvZygnaGVsbG8gd29ybGQnKTtcbiAgLy8kc2NvcGUuY2hhdHMgPSBDaGF0cy5hbGwoKTtcbiAgLy8kc2NvcGUucmVtb3ZlID0gZnVuY3Rpb24oY2hhdCkge1xuICAvLyAgQ2hhdHMucmVtb3ZlKGNoYXQpO1xuICAvL307XG5cbiAgJHNjb3BlLmRhdGEgPSB7fTtcbiAgJHNjb3BlLmZyaWVuZHMgPSBmcmllbmRzO1xuXG4gIGNvbnNvbGUubG9nKCdmcmllbmRzJyxmcmllbmRzKTtcbiAgLy9UT0RPOiBBZGQgZ2V0RnJpZW5kcyByb3V0ZSBhcyB3ZWxsIGFuZCBzYXZlIHRvIGxvY2FsU3RvcmFnZVxuICAvL0ZyaWVuZHNGYWN0b3J5LmdldEZyaWVuZHMoKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgLy8gIGNvbnNvbGUubG9nKCdyZXNwb25zZS5kYXRhIGZyaWVuZHMnLHJlc3BvbnNlLmRhdGEuZnJpZW5kcyk7XG4gIC8vICAkc2NvcGUuZnJpZW5kcyA9IHJlc3BvbnNlLmRhdGEuZnJpZW5kcztcbiAgLy99KTtcblxuICAkc2NvcGUuYWRkRnJpZW5kID0gZnVuY3Rpb24oKXtcbiAgICBjb25zb2xlLmxvZygnYWRkRnJpZW5kIGNsaWNrZWQnKTtcbiAgICBGcmllbmRzRmFjdG9yeS5hZGRGcmllbmQoJHNjb3BlLmRhdGEudXNlcm5hbWUpLnRoZW4oZnJpZW5kQWRkZWQsIGZyaWVuZE5vdEFkZGVkKTtcbiAgfTtcblxuICBmcmllbmRBZGRlZCA9IGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICBjb25zb2xlLmxvZygnZnJpZW5kQWRkZWQnLHJlc3BvbnNlLmRhdGEuZnJpZW5kKTtcbiAgICAkc2NvcGUuZnJpZW5kcy5wdXNoKHJlc3BvbnNlLmRhdGEuZnJpZW5kKTtcbiAgfTtcblxuICBmcmllbmROb3RBZGRlZCA9IGZ1bmN0aW9uKGVycil7XG4gICAgY29uc29sZS5sb2coZXJyKTtcbiAgfTtcblxuICBHaXN0RmFjdG9yeS5xdWV1ZWRHaXN0cygpLnRoZW4oYWRkU2hhcmVkR2lzdHNUb1Njb3BlKTtcblxuICBmdW5jdGlvbiBhZGRTaGFyZWRHaXN0c1RvU2NvcGUoZ2lzdHMpe1xuICAgIC8vY29uc29sZS5sb2coJ2FkZFNoYXJlZEdpc3RzVG9TY29wZScsZ2lzdHMuZGF0YSk7XG4gICAgJHNjb3BlLmdpc3RzID0gZ2lzdHMuZGF0YTtcbiAgICBGcmllbmRzRmFjdG9yeS5zZXRHaXN0cyhnaXN0cy5kYXRhKTtcbiAgfVxuXG4gICRzY29wZS5zaGFyZWRDb2RlID0gZnVuY3Rpb24odXNlcklkKXtcbiAgICAvL2NvbnNvbGUubG9nKGlkKTsgLy9pZCBvZiBmcmllbmQgZ2lzdCBzaGFyZWQgd2l0aFxuICAgICRzdGF0ZS5nbygnc2hhcmVkLWdpc3RzJyx7dXNlcklkOnVzZXJJZH0sIHtpbmhlcml0OmZhbHNlfSk7XG4gIH1cblxufSk7XG5cbmFwcC5jb250cm9sbGVyKCdWaWV3Q29kZUN0cmwnLCBmdW5jdGlvbigkc3RhdGUsJHNjb3BlLCAkc3RhdGVQYXJhbXMsIEZyaWVuZHNGYWN0b3J5KXtcbiAgLy9UT0RPOlxuICAvL3ZhciBhbGxHaXN0cyA9IEZyaWVuZHNGYWN0b3J5LmdldEdpc3RzKCk7XG4gICRzY29wZS5jb2RlID0gRnJpZW5kc0ZhY3RvcnkudXNlckdpc3RzWyRzdGF0ZVBhcmFtcy5naXN0SW5kZXhdO1xuXG4gICRzY29wZS5nb0JhY2sgPSBmdW5jdGlvbihuKXtcbiAgICBpZihuPT09MSl7XG4gICAgICAkc3RhdGUuZ28oJ3NoYXJlZC1naXN0cycse3VzZXJJZDokc3RhdGVQYXJhbXMudXNlcklkfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICRzdGF0ZS5nbygnZnJpZW5kcycpO1xuICAgIH1cbiAgfVxuXG59KTtcblxuYXBwLmNvbnRyb2xsZXIoJ1NoYXJlZEdpc3RzQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgJHN0YXRlUGFyYW1zLCBGcmllbmRzRmFjdG9yeSwkaW9uaWNNb2RhbCwkc3RhdGUpIHtcbiAgLy9jb25zb2xlLmxvZygnc3RhdGVQYXJhbXMnLCRzdGF0ZVBhcmFtcy5pZCwnZ2lzdHMnLEZyaWVuZHNGYWN0b3J5LmdldEdpc3RzKCkpO1xuICAvL1RPRE86IFRoZXNlIGFyZSBhbGwgZ2lzdHMsIHlvdSBuZWVkIHRvIGZpbHRlciBiYXNlZCBvbiB0aGUgdXNlciBiZWZvcmUgcGxhY2Ugb24gc2NvcGUuXG4gICRzY29wZS5naXN0cyA9IFtdO1xuXG4gIC8vJHNjb3BlLmNvZGUgPSAnJztcblxuICB2YXIgYWxsR2lzdHMgPSBGcmllbmRzRmFjdG9yeS5nZXRHaXN0cygpIHx8IFtdO1xuXG4gICRzY29wZS5nb0JhY2sgPSBmdW5jdGlvbigpe1xuICAgICRzdGF0ZS5nbygnZnJpZW5kcycpO1xuICB9XG5cbiAgJHNjb3BlLnNob3dDb2RlID0gZnVuY3Rpb24oZ2lzdEluZGV4KXtcbiAgICBjb25zb2xlLmxvZyhnaXN0SW5kZXgpO1xuICAgICRzdGF0ZS5nbygndmlldy1jb2RlJyx7dXNlcklkOiRzdGF0ZVBhcmFtcy51c2VySWQsZ2lzdEluZGV4Omdpc3RJbmRleH0sIHtpbmhlcml0OmZhbHNlfSk7XG4gICAgLy8kc3RhdGUuZ28oJ3ZpZXctY29kZScpOyAvL1RPRE86IHdoaWNoIG9uZSB3YXMgY2xpY2tlZCwgc2VuZCBwYXJhbSBpZCwgaW5kZXggb2YgZ2lzdFxuICAgIC8vY29uc29sZS5sb2coJ3Nob3dDb2RlJyxjb2RlKTtcbiAgICAvLyRzY29wZS5jb2RlID0gY29kZTtcbiAgICAvLyRzY29wZS5vcGVuTW9kYWwoY29kZSk7XG4gIH07XG5cbiAgLy9UT0RPOiBPbmx5IHNob3cgYWxsIEdpc3RzIGZyb20gc3BlY2lmaWMgdXNlciBjbGlja2VkIG9uXG4gIC8vVE9ETzogTmVlZCB0byBhcHBseSBKU09OIHBhcnNlXG5cbiAgYWxsR2lzdHMuZm9yRWFjaChmdW5jdGlvbihnaXN0KXtcbiAgICBGcmllbmRzRmFjdG9yeS51c2VyR2lzdHMgPSBbXTsgLy9zZXQgdG8gZW1wdHlcbiAgICBpZihnaXN0LnVzZXIgPT09ICRzdGF0ZVBhcmFtcy51c2VySWQpe1xuICAgICAgRnJpZW5kc0ZhY3RvcnkudXNlckdpc3RzLnB1c2goZ2lzdC5naXN0LmZpbGVzLmZpbGVOYW1lLmNvbnRlbnQpO1xuICAgIH1cbiAgfSk7XG4gICRzY29wZS5naXN0cyA9IEZyaWVuZHNGYWN0b3J5LnVzZXJHaXN0cztcbiAgLy8kaW9uaWNNb2RhbC5mcm9tVGVtcGxhdGVVcmwoJ2ZlYXR1cmVzL2ZyaWVuZHMvY29kZS1tb2RhbC5odG1sJywge1xuICAvLyAgc2NvcGU6ICRzY29wZSxcbiAgLy8gIGNhY2hlOiBmYWxzZSxcbiAgLy8gIGFuaW1hdGlvbjogJ3NsaWRlLWluLXVwJ1xuICAvL30pLnRoZW4oZnVuY3Rpb24obW9kYWwpIHtcbiAgLy8gICRzY29wZS5tb2RhbCA9IG1vZGFsO1xuICAvL30pO1xuICAvLyRzY29wZS5vcGVuTW9kYWwgPSBmdW5jdGlvbihjb2RlKSB7XG4gIC8vICAvL2NvbnNvbGUubG9nKGNvZGUpO1xuICAvLyAgJHNjb3BlLm1vZGFsLnNob3coKTtcbiAgLy99O1xuICAvLyRzY29wZS5jbG9zZU1vZGFsID0gZnVuY3Rpb24oKSB7XG4gIC8vICAkc2NvcGUubW9kYWwuaGlkZSgpO1xuICAvL307XG4gIC8vLy9DbGVhbnVwIHRoZSBtb2RhbCB3aGVuIHdlJ3JlIGRvbmUgd2l0aCBpdCFcbiAgLy8kc2NvcGUuJG9uKCckZGVzdHJveScsIGZ1bmN0aW9uKCkge1xuICAvLyAgJHNjb3BlLm1vZGFsLnJlbW92ZSgpO1xuICAvL30pO1xuICAvLy8vIEV4ZWN1dGUgYWN0aW9uIG9uIGhpZGUgbW9kYWxcbiAgLy8kc2NvcGUuJG9uKCdtb2RhbC5oaWRkZW4nLCBmdW5jdGlvbigpIHtcbiAgLy8gIC8vIEV4ZWN1dGUgYWN0aW9uXG4gIC8vfSk7XG4gIC8vLy8gRXhlY3V0ZSBhY3Rpb24gb24gcmVtb3ZlIG1vZGFsXG4gIC8vJHNjb3BlLiRvbignbW9kYWwucmVtb3ZlZCcsIGZ1bmN0aW9uKCkge1xuICAvLyAgLy8gRXhlY3V0ZSBhY3Rpb25cbiAgLy99KTtcbiAgLy8vLyRzY29wZS5naXN0cyA9IEZyaWVuZHNGYWN0b3J5LmdldEdpc3RzKCk7XG5cbn0pO1xuXG4vL2FwcC5mYWN0b3J5KCdDaGF0cycsIGZ1bmN0aW9uKCkge1xuLy8gIC8vIE1pZ2h0IHVzZSBhIHJlc291cmNlIGhlcmUgdGhhdCByZXR1cm5zIGEgSlNPTiBhcnJheVxuLy9cbi8vICAvLyBTb21lIGZha2UgdGVzdGluZyBkYXRhXG4vLyAgdmFyIGNoYXRzID0gW3tcbi8vICAgIGlkOiAwLFxuLy8gICAgbmFtZTogJ0JlbiBTcGFycm93Jyxcbi8vICAgIGxhc3RUZXh0OiAnWW91IG9uIHlvdXIgd2F5PycsXG4vLyAgICBmYWNlOiAnaHR0cHM6Ly9wYnMudHdpbWcuY29tL3Byb2ZpbGVfaW1hZ2VzLzUxNDU0OTgxMTc2NTIxMTEzNi85U2dBdUhlWS5wbmcnXG4vLyAgfSwge1xuLy8gICAgaWQ6IDEsXG4vLyAgICBuYW1lOiAnTWF4IEx5bngnLFxuLy8gICAgbGFzdFRleHQ6ICdIZXksIGl0XFwncyBub3QgbWUnLFxuLy8gICAgZmFjZTogJ2h0dHBzOi8vYXZhdGFyczMuZ2l0aHVidXNlcmNvbnRlbnQuY29tL3UvMTEyMTQ/dj0zJnM9NDYwJ1xuLy8gIH0se1xuLy8gICAgaWQ6IDIsXG4vLyAgICBuYW1lOiAnQWRhbSBCcmFkbGV5c29uJyxcbi8vICAgIGxhc3RUZXh0OiAnSSBzaG91bGQgYnV5IGEgYm9hdCcsXG4vLyAgICBmYWNlOiAnaHR0cHM6Ly9wYnMudHdpbWcuY29tL3Byb2ZpbGVfaW1hZ2VzLzQ3OTA5MDc5NDA1ODM3OTI2NC84NFRLal9xYS5qcGVnJ1xuLy8gIH0sIHtcbi8vICAgIGlkOiAzLFxuLy8gICAgbmFtZTogJ1BlcnJ5IEdvdmVybm9yJyxcbi8vICAgIGxhc3RUZXh0OiAnTG9vayBhdCBteSBtdWtsdWtzIScsXG4vLyAgICBmYWNlOiAnaHR0cHM6Ly9wYnMudHdpbWcuY29tL3Byb2ZpbGVfaW1hZ2VzLzQ5MTk5NTM5ODEzNTc2NzA0MC9pZTJaX1Y2ZS5qcGVnJ1xuLy8gIH0sIHtcbi8vICAgIGlkOiA0LFxuLy8gICAgbmFtZTogJ01pa2UgSGFycmluZ3RvbicsXG4vLyAgICBsYXN0VGV4dDogJ1RoaXMgaXMgd2lja2VkIGdvb2QgaWNlIGNyZWFtLicsXG4vLyAgICBmYWNlOiAnaHR0cHM6Ly9wYnMudHdpbWcuY29tL3Byb2ZpbGVfaW1hZ2VzLzU3ODIzNzI4MTM4NDg0MTIxNi9SM2FlMW42MS5wbmcnXG4vLyAgfV07XG4vL1xuLy8gIHJldHVybiB7XG4vLyAgICBhbGw6IGZ1bmN0aW9uKCkge1xuLy8gICAgICByZXR1cm4gY2hhdHM7XG4vLyAgICB9LFxuLy8gICAgcmVtb3ZlOiBmdW5jdGlvbihjaGF0KSB7XG4vLyAgICAgIGNoYXRzLnNwbGljZShjaGF0cy5pbmRleE9mKGNoYXQpLCAxKTtcbi8vICAgIH0sXG4vLyAgICBnZXQ6IGZ1bmN0aW9uKGNoYXRJZCkge1xuLy8gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoYXRzLmxlbmd0aDsgaSsrKSB7XG4vLyAgICAgICAgaWYgKGNoYXRzW2ldLmlkID09PSBwYXJzZUludChjaGF0SWQpKSB7XG4vLyAgICAgICAgICByZXR1cm4gY2hhdHNbaV07XG4vLyAgICAgICAgfVxuLy8gICAgICB9XG4vLyAgICAgIHJldHVybiBudWxsO1xuLy8gICAgfVxuLy8gIH07XG4vL30pO1xuXG5hcHAuZmFjdG9yeSgnRnJpZW5kc0ZhY3RvcnknLGZ1bmN0aW9uKCRodHRwLCRxLEFwaUVuZHBvaW50KXtcbiAgLy9nZXQgdXNlciB0byBhZGQgYW5kIHJlc3BvbmQgdG8gdXNlclxuICB2YXIgdXNlckdpc3RzID0gW107XG4gIHZhciBhbGxHaXN0cyA9IFtdO1xuICB2YXIgYWRkRnJpZW5kID0gZnVuY3Rpb24oZnJpZW5kKXtcbiAgICAvL2NvbnNvbGUubG9nKGZyaWVuZCk7XG4gICAgcmV0dXJuICRodHRwLnBvc3QoQXBpRW5kcG9pbnQudXJsK1wiL3VzZXIvYWRkRnJpZW5kXCIse2ZyaWVuZDpmcmllbmR9KTtcbiAgfTtcblxuICB2YXIgZ2V0RnJpZW5kcyA9IGZ1bmN0aW9uKCl7XG4gICAgLy9jb25zb2xlLmxvZygnZ2V0RnJpZW5kcyBjYWxsZWQnKVxuICAgIHJldHVybiAkaHR0cC5nZXQoQXBpRW5kcG9pbnQudXJsICsgXCIvdXNlci9nZXRGcmllbmRzXCIpO1xuICB9O1xuXG5cbiAgLy9UT0RPOiBSZW1vdmUgR2lzdHMgZnJvbSBGcmllbmRzRmFjdG9yeSAtIHNob3VsZCBiZSBpbiBnaXN0IGZhY3RvcnkgYW5kIGxvYWRlZCBvbiBzdGFydFxuICAvL1RPRE86IFlvdSBuZWVkIHRvIHJlZmFjdG9yIGJlY2F1c2UgeW91IG1heSBlbmQgdXAgb24gYW55IHBhZ2Ugd2l0aG91dCBhbnkgZGF0YSBiZWNhdXNlIGl0IHdhcyBub3QgYXZhaWxhYmxlIGluIHRoZSBwcmV2aW91cyBwYWdlICh0aGUgcHJldmlvdXMgcGFnZSB3YXMgbm90IGxvYWRlZClcbiAgdmFyIHNldEdpc3RzID0gZnVuY3Rpb24oZ2lzdHMpe1xuICAgIC8vY29uc29sZS5sb2coJ3NldEdpc3RzJyk7XG4gICAgYWxsR2lzdHMgPSBnaXN0cztcbiAgfTtcblxuICB2YXIgZ2V0R2lzdHMgPSBmdW5jdGlvbigpe1xuICAgIGNvbnNvbGUubG9nKCdhbGxHaXN0cycsYWxsR2lzdHMpO1xuICAgIHJldHVybiBhbGxHaXN0cy5naXN0cztcbiAgfTtcblxuICByZXR1cm4ge1xuICAgIGFkZEZyaWVuZDogYWRkRnJpZW5kLFxuICAgIGdldEZyaWVuZHM6IGdldEZyaWVuZHMsXG4gICAgZ2V0R2lzdHM6IGdldEdpc3RzLFxuICAgIHNldEdpc3RzOiBzZXRHaXN0cyxcbiAgICB1c2VyR2lzdHM6IHVzZXJHaXN0c1xuICB9O1xuXG4gIC8vVE9ETzogVXNlciBpcyBub3QgbG9nZ2VkIGluLCBzbyB5b3UgY2Fubm90IGFkZCBhIGZyaWVuZFxufSk7XG4iLCJhcHAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKXtcblx0JHN0YXRlUHJvdmlkZXIuc3RhdGUoJ3NhbmRib3gnLCB7XG5cdFx0dGVtcGxhdGVVcmwgOiAnZmVhdHVyZXMvc2FuZGJveC9zYW5kYm94Lmh0bWwnLFxuXHRcdGFic3RyYWN0IDogdHJ1ZVxuXHR9KTtcbn0pO1xuXG5hcHAuZmFjdG9yeSgnU2FuZGJveEZhY3RvcnknLCBmdW5jdGlvbigkaHR0cCwgQXBpRW5kcG9pbnQsICRyb290U2NvcGUsICRzdGF0ZSl7XG5cblx0dmFyIHByb2JsZW0gPSAnJztcblx0dmFyIHN1Ym1pc3Npb24gPSAnJztcblxuXHR2YXIgcnVuSGlkZGVuID0gZnVuY3Rpb24oY29kZSkge1xuXHQgICAgdmFyIGluZGV4ZWREQiA9IG51bGw7XG5cdCAgICB2YXIgbG9jYXRpb24gPSBudWxsO1xuXHQgICAgdmFyIG5hdmlnYXRvciA9IG51bGw7XG5cdCAgICB2YXIgb25lcnJvciA9IG51bGw7XG5cdCAgICB2YXIgb25tZXNzYWdlID0gbnVsbDtcblx0ICAgIHZhciBwZXJmb3JtYW5jZSA9IG51bGw7XG5cdCAgICB2YXIgc2VsZiA9IG51bGw7XG5cdCAgICB2YXIgd2Via2l0SW5kZXhlZERCID0gbnVsbDtcblx0ICAgIHZhciBwb3N0TWVzc2FnZSA9IG51bGw7XG5cdCAgICB2YXIgY2xvc2UgPSBudWxsO1xuXHQgICAgdmFyIG9wZW5EYXRhYmFzZSA9IG51bGw7XG5cdCAgICB2YXIgb3BlbkRhdGFiYXNlU3luYyA9IG51bGw7XG5cdCAgICB2YXIgd2Via2l0UmVxdWVzdEZpbGVTeXN0ZW0gPSBudWxsO1xuXHQgICAgdmFyIHdlYmtpdFJlcXVlc3RGaWxlU3lzdGVtU3luYyA9IG51bGw7XG5cdCAgICB2YXIgd2Via2l0UmVzb2x2ZUxvY2FsRmlsZVN5c3RlbVN5bmNVUkwgPSBudWxsO1xuXHQgICAgdmFyIHdlYmtpdFJlc29sdmVMb2NhbEZpbGVTeXN0ZW1VUkwgPSBudWxsO1xuXHQgICAgdmFyIGFkZEV2ZW50TGlzdGVuZXIgPSBudWxsO1xuXHQgICAgdmFyIGRpc3BhdGNoRXZlbnQgPSBudWxsO1xuXHQgICAgdmFyIHJlbW92ZUV2ZW50TGlzdGVuZXIgPSBudWxsO1xuXHQgICAgdmFyIGR1bXAgPSBudWxsO1xuXHQgICAgdmFyIG9ub2ZmbGluZSA9IG51bGw7XG5cdCAgICB2YXIgb25vbmxpbmUgPSBudWxsO1xuXHQgICAgdmFyIGltcG9ydFNjcmlwdHMgPSBudWxsO1xuXHQgICAgdmFyIGNvbnNvbGUgPSBudWxsO1xuXHQgICAgdmFyIGFwcGxpY2F0aW9uID0gbnVsbDtcblxuXHQgICAgcmV0dXJuIGV2YWwoY29kZSk7XG5cdH07XG5cblx0Ly8gY29udmVydHMgdGhlIG91dHB1dCBpbnRvIGEgc3RyaW5nXG5cdHZhciBzdHJpbmdpZnkgPSBmdW5jdGlvbihvdXRwdXQpIHtcblx0ICAgIHZhciByZXN1bHQ7XG5cblx0ICAgIGlmICh0eXBlb2Ygb3V0cHV0ID09ICd1bmRlZmluZWQnKSB7XG5cdCAgICAgICAgcmVzdWx0ID0gJ3VuZGVmaW5lZCc7XG5cdCAgICB9IGVsc2UgaWYgKG91dHB1dCA9PT0gbnVsbCkge1xuXHQgICAgICAgIHJlc3VsdCA9ICdudWxsJztcblx0ICAgIH0gZWxzZSB7XG5cdCAgICAgICAgcmVzdWx0ID0gSlNPTi5zdHJpbmdpZnkob3V0cHV0KSB8fCBvdXRwdXQudG9TdHJpbmcoKTtcblx0ICAgIH1cblxuXHQgICAgcmV0dXJuIHJlc3VsdDtcblx0fTtcblxuXHR2YXIgcnVuID0gZnVuY3Rpb24oY29kZSkge1xuXHQgICAgdmFyIHJlc3VsdCA9IHtcblx0ICAgICAgICBpbnB1dDogY29kZSxcblx0ICAgICAgICBvdXRwdXQ6IG51bGwsXG5cdCAgICAgICAgZXJyb3I6IG51bGxcblx0ICAgIH07XG5cblx0ICAgIHRyeSB7XG5cdCAgICAgICAgcmVzdWx0Lm91dHB1dCA9IHN0cmluZ2lmeShydW5IaWRkZW4oY29kZSkpO1xuXHQgICAgfSBjYXRjaChlKSB7XG5cdCAgICAgICAgcmVzdWx0LmVycm9yID0gZS5tZXNzYWdlO1xuXHQgICAgfVxuXHQgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9O1xuXG5cblx0cmV0dXJuIHtcblx0XHRnZXRDaGFsbGVuZ2UgOiBmdW5jdGlvbihpZCl7XG5cdFx0XHRyZXR1cm4gJGh0dHAuZ2V0KEFwaUVuZHBvaW50LnVybCArICcvY2hhbGxlbmdlLycgKyBpZCkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG5cdFx0XHRcdHByb2JsZW0gPSByZXNwb25zZS5kYXRhO1xuXHRcdFx0XHRzdWJtaXNzaW9uID0gcHJvYmxlbS5zZXNzaW9uLnNldHVwIHx8ICcnO1xuXHRcdFx0XHQkcm9vdFNjb3BlLiRicm9hZGNhc3QoJ3Byb2JsZW1VcGRhdGVkJyk7XG5cdFx0XHRcdHJldHVybiByZXNwb25zZS5kYXRhO1xuXHRcdFx0fSk7XG5cdFx0fSxcblx0XHRzZXRTdWJtaXNzaW9uIDogZnVuY3Rpb24oY29kZSl7XG5cdFx0XHRzdWJtaXNzaW9uID0gY29kZTtcblx0XHRcdCRyb290U2NvcGUuJGJyb2FkY2FzdCgnc3VibWlzc2lvblVwZGF0ZWQnKTtcblx0XHR9LFxuXHRcdGNvbXBpbGVTdWJtaXNzaW9uOiBmdW5jdGlvbihjb2RlKXtcblx0XHRcdHJldHVybiBydW4oY29kZSk7XG5cdFx0fSxcblx0XHRnZXRTdWJtaXNzaW9uIDogZnVuY3Rpb24oKXtcblx0XHRcdHJldHVybiBzdWJtaXNzaW9uO1xuXHRcdH0sXG5cdFx0Z2V0UHJvYmxlbSA6IGZ1bmN0aW9uKCl7XG5cdFx0XHRyZXR1cm4gcHJvYmxlbTtcblx0XHR9XG5cdH07XG59KTsiLCJhcHAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKXtcblx0JHN0YXRlUHJvdmlkZXIuc3RhdGUoJ3NhbmRib3guY29kZScsIHtcblx0XHR1cmwgOiAnL3NhbmRib3gvY29kZScsXG5cdFx0dmlld3M6IHtcblx0XHRcdCd0YWItY29kZScgOiB7XG5cdFx0XHRcdHRlbXBsYXRlVXJsIDogJ2ZlYXR1cmVzL3NhbmRib3gtY29kZS9zYW5kYm94LWNvZGUuaHRtbCcsXG5cdFx0XHRcdGNvbnRyb2xsZXIgOiAnU2FuZGJveENvZGVDdHJsJ1xuXHRcdFx0fVxuXHRcdH1cblx0fSk7XG59KTtcblxuXG5hcHAuY29udHJvbGxlcignU2FuZGJveENvZGVDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCAkc3RhdGUsIFNhbmRib3hGYWN0b3J5LCBFeGVyY2lzbUZhY3RvcnksIEtleWJvYXJkRmFjdG9yeSl7XG5cdCRzY29wZS5jb2RlID0ge1xuXHRcdHRleHQgOiAnXFxuXFxuXFxuXFxuXFxuXFxuXFxuXFxuXFxuXFxuXFxuXFxuXFxuJ1xuXHR9O1xuXG5cdCRzY29wZS5idXR0b25zID0ge1xuXHRcdGNvbXBpbGUgOiAnQ29tcGlsZScsXG5cdFx0c2F2ZSA6ICdTYXZlJ1xuXHR9O1xuXG5cdCRzY29wZS5jb21waWxlID0gZnVuY3Rpb24oY29kZSl7XG5cdFx0U2FuZGJveEZhY3Rvcnkuc2V0U3VibWlzc2lvbihjb2RlKTtcblx0XHQkc3RhdGUuZ28oJ3NhbmRib3guY29tcGlsZScpO1xuXHR9O1xuXG5cdCRzY29wZS5zYXZlID0gZnVuY3Rpb24oY29kZSl7XG5cblx0fTtcblxuXHQkc2NvcGUuaW5zZXJ0RnVuYyA9IEtleWJvYXJkRmFjdG9yeS5tYWtlSW5zZXJ0RnVuYygkc2NvcGUpO1xuXG5cdC8vICRzY29wZS5zYXZlQ2hhbGxlbmdlID0gZnVuY3Rpb24oKXtcblx0Ly8gXHRjb25zb2xlLmxvZyhcInNhdmUgc2NvcGUudGV4dFwiLCAkc2NvcGUudGV4dCk7XG5cdC8vIFx0JGxvY2Fsc3RvcmFnZS5zZXQoXCJ0ZXN0aW5nXCIsICRzY29wZS50ZXh0KTtcblx0Ly8gfTtcblxuXHQvLyAkc2NvcGUuZ2V0U2F2ZWQgPSBmdW5jdGlvbigpe1xuXHQvLyBcdGNvbnNvbGUubG9nKFwic2F2ZSBzY29wZS50ZXh0XCIsICRzY29wZS50ZXh0KTtcblx0Ly8gXHRjb25zb2xlLmxvZyhcImVudGVyZWQgZ2V0c2F2ZWQgZnVuY1wiKTtcblx0Ly8gXHQkc2NvcGUudGV4dCA9ICRsb2NhbHN0b3JhZ2UuZ2V0KFwidGVzdGluZ1wiKTtcblx0Ly8gfTtcblxufSk7IiwiYXBwLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlcil7XG5cdCRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdzYW5kYm94LmNvbXBpbGUnLCB7XG5cdFx0dXJsIDogJy9zYW5kYm94L2NvbXBpbGUnLFxuXHRcdHZpZXdzIDoge1xuXHRcdFx0J3RhYi1jb21waWxlJyA6IHtcblx0XHRcdFx0dGVtcGxhdGVVcmwgOiAnZmVhdHVyZXMvc2FuZGJveC1jb21waWxlL3NhbmRib3gtY29tcGlsZS5odG1sJyxcblx0XHRcdFx0Y29udHJvbGxlcjogJ1NhbmRib3hDb21waWxlQ3RybCdcblx0XHRcdH1cblx0XHR9XG5cdH0pO1xufSk7XG5cbmFwcC5jb250cm9sbGVyKCdTYW5kYm94Q29tcGlsZUN0cmwnLCBmdW5jdGlvbigkc2NvcGUsIFNhbmRib3hGYWN0b3J5KXtcblx0JHNjb3BlLnF1ZXN0aW9uID0gU2FuZGJveEZhY3RvcnkuZ2V0U3VibWlzc2lvbigpO1xuXHR2YXIgcmVzdWx0cyA9IFNhbmRib3hGYWN0b3J5LmNvbXBpbGVTdWJtaXNzaW9uKCRzY29wZS5xdWVzdGlvbik7XG5cdCRzY29wZS5yZXN1bHRzID0gcmVzdWx0cztcblx0JHNjb3BlLm91dHB1dCA9IFNhbmRib3hGYWN0b3J5LmNvbXBpbGVTdWJtaXNzaW9uKCRzY29wZS5xdWVzdGlvbikub3V0cHV0O1xuXHQkc2NvcGUuZXJyb3IgPSBTYW5kYm94RmFjdG9yeS5jb21waWxlU3VibWlzc2lvbigkc2NvcGUucXVlc3Rpb24pLmVycm9yO1xuXG5cdCRzY29wZS4kb24oJ3N1Ym1pc3Npb25VcGRhdGVkJywgZnVuY3Rpb24oZSl7XG5cdFx0JHNjb3BlLnF1ZXN0aW9uID0gU2FuZGJveEZhY3RvcnkuZ2V0U3VibWlzc2lvbigpO1xuXHRcdHJlc3VsdHMgPSBTYW5kYm94RmFjdG9yeS5jb21waWxlU3VibWlzc2lvbigkc2NvcGUucXVlc3Rpb24pO1xuXHRcdCRzY29wZS5yZXN1bHRzID0gcmVzdWx0cztcblx0XHQkc2NvcGUub3V0cHV0ID0gU2FuZGJveEZhY3RvcnkuY29tcGlsZVN1Ym1pc3Npb24oJHNjb3BlLnF1ZXN0aW9uKS5vdXRwdXQ7XG5cdFx0JHNjb3BlLmVycm9yID0gU2FuZGJveEZhY3RvcnkuY29tcGlsZVN1Ym1pc3Npb24oJHNjb3BlLnF1ZXN0aW9uKS5lcnJvcjtcblx0fSk7XG59KTsiLCJhcHAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKXtcbiAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgnc2lnbnVwJyx7XG4gICAgICAgIHVybDpcIi9zaWdudXBcIixcbiAgICAgICAgdGVtcGxhdGVVcmw6IFwiZmVhdHVyZXMvc2lnbnVwL3NpZ251cC5odG1sXCIsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdTaWduVXBDdHJsJ1xuICAgIH0pO1xufSk7XG5cbmFwcC5jb250cm9sbGVyKCdTaWduVXBDdHJsJyxmdW5jdGlvbigkcm9vdFNjb3BlLCAkaHR0cCwgJHNjb3BlLCAkc3RhdGUsIEF1dGhTZXJ2aWNlLCAkaW9uaWNQb3B1cCl7XG4gICAgJHNjb3BlLmRhdGEgPSB7fTtcbiAgICAkc2NvcGUuZXJyb3IgPSBudWxsO1xuXG4gICAgJHNjb3BlLmxvZ2luID0gZnVuY3Rpb24oKXtcbiAgICAgICAgJHN0YXRlLmdvKCdsb2dpbicpO1xuICAgIH07XG5cbiAgICAkc2NvcGUuc2lnbnVwID0gZnVuY3Rpb24oKXtcbiAgICAgICAgQXV0aFNlcnZpY2VcbiAgICAgICAgICAgIC5zaWdudXAoJHNjb3BlLmRhdGEpXG4gICAgICAgICAgICAudGhlbihmdW5jdGlvbihhdXRoZW50aWNhdGVkKXtcbiAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdzaWdudXAsIHRhYi5jaGFsbGVuZ2UnKTtcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoJ0F1dGgnKTtcbiAgICAgICAgICAgICAgICAkc2NvcGUuc3RhdGVzLnB1c2goeyAvL1RPRE86IE5lZWQgdG8gYWRkIGEgcGFyZW50IGNvbnRyb2xsZXIgdG8gY29tbXVuaWNhdGVcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogJ0xvZ291dCcsXG4gICAgICAgICAgICAgICAgICAgIHJlZjogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIEF1dGhTZXJ2aWNlLmxvZ291dCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmRhdGEgPSB7fTtcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5zdGF0ZXMucG9wKCk7IC8vVE9ETzogRmluZCBhIGJldHRlciB3YXkgdG8gcmVtb3ZlIHRoZSBMb2dvdXQgbGluaywgaW5zdGVhZCBvZiBwb3BcbiAgICAgICAgICAgICAgICAgICAgICAgICRzdGF0ZS5nbygnd2VsY29tZScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KCdBdXRoJyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ2V4ZXJjaXNtLmNvbXBpbGUnKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuY2F0Y2goZnVuY3Rpb24oZXJyKXtcbiAgICAgICAgICAgICAgICAkc2NvcGUuZXJyb3IgPSAnU2lnbnVwIEludmFsaWQnO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoSlNPTi5zdHJpbmdpZnkoZXJyKSlcbiAgICAgICAgICAgICAgICB2YXIgYWxlcnRQb3B1cCA9ICRpb25pY1BvcHVwLmFsZXJ0KHtcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdTaWdudXAgZmFpbGVkIScsXG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlOiAnUGxlYXNlIGNoZWNrIHlvdXIgY3JlZGVudGlhbHMhJ1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgfTtcblxufSk7XG5cbi8vVE9ETzogRm9ybSBWYWxpZGF0aW9uXG4vL1RPRE86IENsZWFudXAgY29tbWVudGVkIGNvZGUiLCJhcHAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKXtcblx0JHN0YXRlUHJvdmlkZXIuc3RhdGUoJ3NuaXBwZXQnLCB7XG5cdFx0Y2FjaGU6IGZhbHNlLFxuXHRcdHVybCA6ICcvc25pcHBldC86aWQnLFxuXHRcdHRlbXBsYXRlVXJsIDogJ2ZlYXR1cmVzL3NuaXBwZXQtZWRpdC9zbmlwcGV0LWVkaXQuaHRtbCcsXG5cdFx0Y29udHJvbGxlcjogJ1NuaXBwZXRFZGl0Q3RybCdcblx0fSk7XG59KTtcblxuYXBwLmNvbnRyb2xsZXIoJ1NuaXBwZXRFZGl0Q3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgJHN0YXRlLCAkc3RhdGVQYXJhbXMsIENvZGVTbmlwcGV0RmFjdG9yeSwgS2V5Ym9hcmRGYWN0b3J5KXtcblx0JHNjb3BlLmJ1dHRvbnMgPSB7XG5cdFx0ZWRpdCA6ICdFZGl0Jyxcblx0XHRjYW5jZWwgOiAnQ2FuY2VsJyxcblx0XHRkZWxldGUgOiAnRGVsZXRlJ1xuXHR9O1xuXHQkc2NvcGUuc25pcHBldCA9IENvZGVTbmlwcGV0RmFjdG9yeS5nZXRTbmlwcGV0KCRzdGF0ZVBhcmFtcy5pZCk7XG5cblx0JHNjb3BlLmluc2VydEZ1bmMgPSBLZXlib2FyZEZhY3RvcnkubWFrZUluc2VydEZ1bmMoJHNjb3BlKTtcblxuXHQkc2NvcGUuZWRpdCA9IGZ1bmN0aW9uKHNuaXBwZXQpe1xuXHRcdENvZGVTbmlwcGV0RmFjdG9yeS5lZGl0U25pcHBldCgkc3RhdGVQYXJhbXMuaWQsIHNuaXBwZXQpO1xuXHRcdCRzdGF0ZS5nbygnc25pcHBldHMnKTtcblx0fTtcblxuXHQkc2NvcGUuZGVsZXRlID0gZnVuY3Rpb24oKXtcblx0XHRDb2RlU25pcHBldEZhY3RvcnkuZGVsZXRlU25pcHBldCgkc3RhdGVQYXJhbXMuaWQpO1xuXHRcdCRzdGF0ZS5nbygnc25pcHBldHMnKTtcblx0fTtcblxuXHQkc2NvcGUuY2FuY2VsID0gZnVuY3Rpb24oKXtcblx0XHQkc3RhdGUuZ28oJ3NuaXBwZXRzJyk7XG5cdH07XG59KTsiLCJhcHAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKXtcblx0JHN0YXRlUHJvdmlkZXIuc3RhdGUoJ3NuaXBwZXRzJywge1xuXHRcdHVybCA6ICcvc25pcHBldHMnLFxuXHRcdHRlbXBsYXRlVXJsIDogJ2ZlYXR1cmVzL3NuaXBwZXRzL3NuaXBwZXRzLmh0bWwnLFxuXHRcdGNvbnRyb2xsZXIgOiAnU25pcHBldHNDdHJsJ1xuXHR9KTtcbn0pO1xuXG5hcHAuY29udHJvbGxlcignU25pcHBldHNDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCAkcm9vdFNjb3BlLCAkc3RhdGUsIENvZGVTbmlwcGV0RmFjdG9yeSl7XG5cdCRzY29wZS5zbmlwcGV0cyA9IENvZGVTbmlwcGV0RmFjdG9yeS5nZXRBbGxTbmlwcGV0cygpO1xuXHQkc2NvcGUucmVtb3ZlID0gQ29kZVNuaXBwZXRGYWN0b3J5LmRlbGV0ZVNuaXBwZXQ7XG5cblx0JHJvb3RTY29wZS4kb24oJ2Zvb3RlclVwZGF0ZWQnLCBmdW5jdGlvbihldmVudCl7XG5cdFx0JHNjb3BlLnNuaXBwZXRzID0gQ29kZVNuaXBwZXRGYWN0b3J5LmdldEFsbFNuaXBwZXRzKCk7XG5cdH0pO1xuXG5cdCRzY29wZS5jcmVhdGUgPSBmdW5jdGlvbigpe1xuXHRcdCRzdGF0ZS5nbygnc25pcHBldHMtY3JlYXRlJyk7XG5cdH07XG59KTsiLCJhcHAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKXtcblx0JHN0YXRlUHJvdmlkZXIuc3RhdGUoJ3NuaXBwZXRzLWNyZWF0ZScsIHtcblx0XHR1cmw6ICcvc25pcHBldHMvY3JlYXRlJyxcblx0XHR0ZW1wbGF0ZVVybCA6ICdmZWF0dXJlcy9zbmlwcGV0cy1jcmVhdGUvc25pcHBldHMtY3JlYXRlLmh0bWwnLFxuXHRcdGNvbnRyb2xsZXI6ICdTbmlwcGV0c0NyZWF0ZUN0cmwnXG5cdH0pO1xufSk7XG5cbmFwcC5jb250cm9sbGVyKCdTbmlwcGV0c0NyZWF0ZUN0cmwnLCBmdW5jdGlvbigkc2NvcGUsICRzdGF0ZSwgS2V5Ym9hcmRGYWN0b3J5LCBDb2RlU25pcHBldEZhY3Rvcnkpe1xuXHQkc2NvcGUuc25pcHBldCA9IHtcblx0XHRkaXNwbGF5IDogJycsXG5cdFx0aW5zZXJ0UGFyYW0gOiAnJ1xuXHR9O1xuXG5cdCRzY29wZS5pbnNlcnRGdW5jID0gS2V5Ym9hcmRGYWN0b3J5Lm1ha2VJbnNlcnRGdW5jKCRzY29wZSk7XG5cblx0JHNjb3BlLmNyZWF0ZSA9IGZ1bmN0aW9uKHNuaXBwZXQpe1xuXHRcdENvZGVTbmlwcGV0RmFjdG9yeS5hZGRTbmlwcGV0KHNuaXBwZXQpO1xuXHRcdCRzdGF0ZS5nbygnc25pcHBldHMnKTtcblx0fTtcbn0pOyIsImFwcC5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIpe1xuXHQkc3RhdGVQcm92aWRlci5zdGF0ZSgnd2VsY29tZScsIHtcblx0XHR1cmwgOiAnL3dlbGNvbWUnLFxuXHRcdHRlbXBsYXRlVXJsIDogJ2ZlYXR1cmVzL3dlbGNvbWUvd2VsY29tZS5odG1sJyxcblx0XHRjb250cm9sbGVyIDogJ1dlbGNvbWVDdHJsJ1xuXHR9KTtcbn0pO1xuYXBwLmNvbnRyb2xsZXIoJ1dlbGNvbWVDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCAkc3RhdGUsIEF1dGhTZXJ2aWNlLCAkcm9vdFNjb3BlLCBHaXN0RmFjdG9yeSwgJGlvbmljUG9wdXApe1xuXHQvL1RPRE86IFNwbGFzaCBwYWdlIHdoaWxlIHlvdSBsb2FkIHJlc291cmNlcyAocG9zc2libGUgaWRlYSlcblx0Ly9jb25zb2xlLmxvZygnV2VsY29tZUN0cmwnKTtcblx0JHNjb3BlLmJ1dHRvbnMgPSB7XG5cdFx0bG9naW4gOiAnbG9naW4nLFxuXHRcdHNpZ251cCA6ICdzaWdudXAnXG5cdH07XG5cblx0Ly8gaW9uaWMuUGxhdGZvcm0ucmVhZHkoZnVuY3Rpb24oKXtcblx0Ly8gXHRpb25pYy5QbGF0Zm9ybS5zaG93U3RhdHVzQmFyKGZhbHNlKTtcblx0Ly8gfSk7XG5cblx0JHNjb3BlLmxvZ2luID0gZnVuY3Rpb24oKXtcblx0XHQkc3RhdGUuZ28oJ2xvZ2luJyk7XG5cdH07XG5cdCRzY29wZS5zaWdudXAgPSBmdW5jdGlvbigpe1xuXHRcdCRzdGF0ZS5nbygnc2lnbnVwJyk7XG5cdH07XG5cblx0dmFyIGF1dGhSZXEgPSAhZmFsc2U7IC8vVE9ETzogVG9nZ2xlIGZvciB1c2luZyBhdXRoZW50aWNhdGlvbiB3b3JrIGZsb3cgLSByZXF1aXJlIGJhY2tlbmQgd2lyZWQgdXBcblxuLy88PDw8PDw8IEhFQURcblx0aWYgKCFhdXRoUmVxKXtcblx0XHQkc3RhdGUuZ28oJ2V4ZXJjaXNtLnZpZXcnKTsgLy9UT0RPOiBJZiBBdXRoIGlzIG5vdCByZXF1aXJlZCwgZ28gZGlyZWN0bHkgaGVyZVxuXHR9IGVsc2Uge1xuXHRcdGlmIChBdXRoU2VydmljZS5pc0F1dGhlbnRpY2F0ZWQoKSkge1xuXHRcdFx0JHJvb3RTY29wZS4kYnJvYWRjYXN0KCdBdXRoJyk7XG5cdFx0XHQkc2NvcGUuc3RhdGVzLnB1c2goeyAvL1RPRE86IE5lZWQgdG8gYWRkIGEgcGFyZW50IGNvbnRyb2xsZXIgdG8gY29tbXVuaWNhdGVcblx0XHRcdFx0bmFtZTogJ0xvZ291dCcsXG5cdFx0XHRcdHJlZjogZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdEF1dGhTZXJ2aWNlLmxvZ291dCgpO1xuXHRcdFx0XHRcdCRzY29wZS5kYXRhID0ge307XG5cdFx0XHRcdFx0JHNjb3BlLnN0YXRlcy5wb3AoKTsgLy9UT0RPOiBGaW5kIGEgYmV0dGVyIHdheSB0byByZW1vdmUgdGhlIExvZ291dCBsaW5rLCBpbnN0ZWFkIG9mIHBvcFxuXHRcdFx0XHRcdCRzdGF0ZS5nbygnbG9naW4nKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG4vLz09PT09PT1cblx0XHRcdC8vIGlmICghYXV0aFJlcSl7XG5cdFx0XHQvLyBcdCRzdGF0ZS5nbygnZXhlcmNpc20udmlldycpO1xuXHRcdFx0Ly8gfSBlbHNlIHtcblx0XHRcdC8vIFx0aWYgKEF1dGhTZXJ2aWNlLmlzQXV0aGVudGljYXRlZCgpKSB7XG5cdFx0XHQvLyBcdFx0JHJvb3RTY29wZS4kYnJvYWRjYXN0KCdBdXRoJyk7XG5cdFx0XHQvLyBcdFx0JHNjb3BlLnN0YXRlcy5wdXNoKHsgLy9UT0RPOiBOZWVkIHRvIGFkZCBhIHBhcmVudCBjb250cm9sbGVyIHRvIGNvbW11bmljYXRlXG5cdFx0XHQvLyBcdFx0XHRuYW1lOiAnTG9nb3V0Jyxcblx0XHRcdC8vIFx0XHRcdHJlZjogZnVuY3Rpb24oKXtcblx0XHRcdC8vIFx0XHRcdFx0QXV0aFNlcnZpY2UubG9nb3V0KCk7XG5cdFx0XHQvLyBcdFx0XHRcdCRzY29wZS5kYXRhID0ge307XG5cdFx0XHQvLyBcdFx0XHRcdCRzY29wZS5zdGF0ZXMucG9wKCk7IC8vVE9ETzogRmluZCBhIGJldHRlciB3YXkgdG8gcmVtb3ZlIHRoZSBMb2dvdXQgbGluaywgaW5zdGVhZCBvZiBwb3Bcblx0XHRcdC8vIFx0XHRcdFx0JHN0YXRlLmdvKCdsb2dpbicpO1xuXHRcdFx0Ly8gXHRcdFx0fVxuXHRcdFx0Ly8gXHRcdH0pO1xuLy8+Pj4+Pj4+IGRldmVsb3BtZW50XG5cblx0XHRcdC8vIFx0XHQvL3BvcC11cCBvcHRpb25zLCB2aWV3IHNoYXJlZCBjb2RlIG9yXG5cdFx0XHQvLyBcdFx0Ly9UT0RPOiBIYXBwZW4gb24gTG9naW4sIHJlY2lldmUgZ2lzdCBub3RpZmljYXRpb25cblx0XHRcdC8vIFx0XHRHaXN0RmFjdG9yeS5xdWV1ZWRHaXN0cygpLnRoZW4oZ2lzdHNSeCk7XG5cbi8vPDw8PDw8PCBIRUFEXG5cdFx0XHRmdW5jdGlvbiBnaXN0c1J4KHJlc3BvbnNlKSB7XG5cdFx0XHRcdGNvbnNvbGUubG9nKHJlc3BvbnNlLmRhdGEuZ2lzdHMpO1xuXHRcdFx0XHRpZiAocmVzcG9uc2UuZGF0YS5naXN0cy5sZW5ndGggIT09IDApIHtcblx0XHRcdFx0XHQvL2NvbnNvbGUubG9nKCdub3RpZnkgdXNlciBvZiBSeCBnaXN0cycpXG5cdFx0XHRcdFx0c2hvd0NvbmZpcm0gPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHR2YXIgY29uZmlybVBvcHVwID0gJGlvbmljUG9wdXAuY29uZmlybSh7XG5cdFx0XHRcdFx0XHRcdHRpdGxlOiAnWW91IGdvdCBDb2RlIScsXG5cdFx0XHRcdFx0XHRcdHRlbXBsYXRlOiAnWW91ciBmcmllbmRzIHNoYXJlZCBzb21lIGNvZGUsIGRvIHlvdSB3YW50IHRvIHRha2UgYSBsb29rPydcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0Ly9UT0RPOiBDdXN0b20gUG9wVXAgSW5zdGVhZFxuXHRcdFx0XHRcdFx0Ly9UT0RPOiBZb3UgbmVlZCB0byBhY2NvdW50IGZvciBsb2dpbiAodGhpcyBvbmx5IGFjY291bnRzIGZvciB1c2VyIGxvYWRpbmcgYXBwLCBhbHJlYWR5IGxvZ2dlZCBpbilcblx0XHRcdFx0XHRcdGNvbmZpcm1Qb3B1cC50aGVuKGZ1bmN0aW9uIChyZXMpIHtcblx0XHRcdFx0XHRcdFx0aWYgKHJlcykge1xuXHRcdFx0XHRcdFx0XHRcdC8vY29uc29sZS5sb2coJ1lvdSBhcmUgc3VyZScpO1xuXHRcdFx0XHRcdFx0XHRcdCRzdGF0ZS5nbygnZnJpZW5kcycpO1xuXHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdC8vY29uc29sZS5sb2coJ1lvdSBhcmUgbm90IHN1cmUnKTtcblx0XHRcdFx0XHRcdFx0XHQkc3RhdGUuZ28oJ2V4ZXJjaXNtLmNvbXBpbGUnKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0fTtcbi8vPT09PT09PVxuXHRcdFx0XHRcdC8vIFx0XHRmdW5jdGlvbiBnaXN0c1J4KHJlc3BvbnNlKXtcblx0XHRcdFx0XHQvLyBcdFx0XHRjb25zb2xlLmxvZyhyZXNwb25zZS5kYXRhLmdpc3RzKTtcblx0XHRcdFx0XHQvLyBcdFx0XHRpZihyZXNwb25zZS5kYXRhLmdpc3RzLmxlbmd0aCAhPT0wKXtcblx0XHRcdFx0XHQvLyBcdFx0XHRcdC8vY29uc29sZS5sb2coJ25vdGlmeSB1c2VyIG9mIFJ4IGdpc3RzJylcblx0XHRcdFx0XHQvLyBcdFx0XHRcdHNob3dDb25maXJtID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0Ly8gXHRcdFx0XHRcdHZhciBjb25maXJtUG9wdXAgPSAkaW9uaWNQb3B1cC5jb25maXJtKHtcblx0XHRcdFx0XHQvLyBcdFx0XHRcdFx0XHR0aXRsZTogJ1lvdSBnb3QgQ29kZSEnLFxuXHRcdFx0XHRcdC8vIFx0XHRcdFx0XHRcdHRlbXBsYXRlOiAnWW91ciBmcmllbmRzIHNoYXJlZCBzb21lIGNvZGUsIGRvIHlvdSB3YW50IHRvIHRha2UgYSBsb29rPydcblx0XHRcdFx0XHQvLyBcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0Ly8gXHRcdFx0XHRcdC8vVE9ETzogQ3VzdG9tIFBvcFVwIEluc3RlYWRcblx0XHRcdFx0XHQvLyBcdFx0XHRcdFx0Ly9UT0RPOiBZb3UgbmVlZCB0byBhY2NvdW50IGZvciBsb2dpbiAodGhpcyBvbmx5IGFjY291bnRzIGZvciB1c2VyIGxvYWRpbmcgYXBwLCBhbHJlYWR5IGxvZ2dlZCBpbilcblx0XHRcdFx0XHQvLyBcdFx0XHRcdFx0Y29uZmlybVBvcHVwLnRoZW4oZnVuY3Rpb24ocmVzKSB7XG5cdFx0XHRcdFx0Ly8gXHRcdFx0XHRcdFx0aWYocmVzKSB7XG5cdFx0XHRcdFx0Ly8gXHRcdFx0XHRcdFx0XHQvL2NvbnNvbGUubG9nKCdZb3UgYXJlIHN1cmUnKTtcblx0XHRcdFx0XHQvLyBcdFx0XHRcdFx0XHRcdCRzdGF0ZS5nbygnY2hhdHMnKTtcblx0XHRcdFx0XHQvLyBcdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdC8vIFx0XHRcdFx0XHRcdFx0Ly9jb25zb2xlLmxvZygnWW91IGFyZSBub3Qgc3VyZScpO1xuXHRcdFx0XHRcdC8vIFx0XHRcdFx0XHRcdFx0JHN0YXRlLmdvKCdleGVyY2lzbS5jb21waWxlJyk7XG5cdFx0XHRcdFx0Ly8gXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdC8vIFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHQvLyBcdFx0XHRcdH07XG4vLz4+Pj4+Pj4gZGV2ZWxvcG1lbnRcblxuXHRcdFx0XHRcdC8vIFx0XHRcdFx0c2hvd0NvbmZpcm0oKTtcblx0XHRcdFx0XHQvLyBcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdC8vIFx0XHRcdFx0JHN0YXRlLmdvKCdleGVyY2lzbS5jb21waWxlJyk7XG5cdFx0XHRcdFx0Ly8gXHRcdFx0fVxuXHRcdFx0XHRcdC8vIFx0XHR9XG5cblxuLy88PDw8PDw8IEhFQURcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQvL1RPRE86ICRzdGF0ZS5nbygnc2lnbnVwJyk7IFJlbW92ZSBCZWxvdyBsaW5lXG5cdFx0XHRcdFx0Ly8kc3RhdGUuZ28oJ3NpZ251cCcpO1xuXHRcdFx0XHRcdC8vRE9cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuLy89PT09PT09XG4vL1x0Ly8gXHR9IGVsc2Uge1xuLy9cdC8vIFx0XHQvL1RPRE86ICRzdGF0ZS5nbygnc2lnbnVwJyk7IFJlbW92ZSBCZWxvdyBsaW5lXG4vL1x0Ly8gXHRcdCRzdGF0ZS5nbygnc2lnbnVwJyk7XG4vL1x0Ly8gXHR9XG4vL1x0Ly8gfVxuLy8+Pj4+Pj4+IGRldmVsb3BtZW50XG59KTsiLCIvL3Rva2VuIGlzIHNlbnQgb24gZXZlcnkgaHR0cCByZXF1ZXN0XG5hcHAuZmFjdG9yeSgnQXV0aEludGVyY2VwdG9yJyxmdW5jdGlvbiBBdXRoSW50ZXJjZXB0b3IoQVVUSF9FVkVOVFMsJHJvb3RTY29wZSwkcSxBdXRoVG9rZW5GYWN0b3J5KXtcblxuICAgIHZhciBzdGF0dXNEaWN0ID0ge1xuICAgICAgICA0MDE6IEFVVEhfRVZFTlRTLm5vdEF1dGhlbnRpY2F0ZWQsXG4gICAgICAgIDQwMzogQVVUSF9FVkVOVFMubm90QXV0aG9yaXplZFxuICAgIH07XG5cbiAgICByZXR1cm4ge1xuICAgICAgICByZXF1ZXN0OiBhZGRUb2tlbixcbiAgICAgICAgcmVzcG9uc2VFcnJvcjogZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3Qoc3RhdHVzRGljdFtyZXNwb25zZS5zdGF0dXNdLCByZXNwb25zZSk7XG4gICAgICAgICAgICByZXR1cm4gJHEucmVqZWN0KHJlc3BvbnNlKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBmdW5jdGlvbiBhZGRUb2tlbihjb25maWcpe1xuICAgICAgICB2YXIgdG9rZW4gPSBBdXRoVG9rZW5GYWN0b3J5LmdldFRva2VuKCk7XG4gICAgICAgIC8vY29uc29sZS5sb2coJ2FkZFRva2VuJyx0b2tlbik7XG4gICAgICAgIGlmKHRva2VuKXtcbiAgICAgICAgICAgIGNvbmZpZy5oZWFkZXJzID0gY29uZmlnLmhlYWRlcnMgfHwge307XG4gICAgICAgICAgICBjb25maWcuaGVhZGVycy5BdXRob3JpemF0aW9uID0gJ0JlYXJlciAnICsgdG9rZW47XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNvbmZpZztcbiAgICB9XG59KTtcbi8vc2tpcHBlZCBBdXRoIEludGVyY2VwdG9ycyBnaXZlbiBUT0RPOiBZb3UgY291bGQgYXBwbHkgdGhlIGFwcHJvYWNoIGluXG4vL2h0dHA6Ly9kZXZkYWN0aWMuY29tL3VzZXItYXV0aC1hbmd1bGFyanMtaW9uaWMvXG5cbmFwcC5jb25maWcoZnVuY3Rpb24oJGh0dHBQcm92aWRlcil7XG4gICAgJGh0dHBQcm92aWRlci5pbnRlcmNlcHRvcnMucHVzaCgnQXV0aEludGVyY2VwdG9yJyk7XG59KTtcblxuYXBwLmNvbnN0YW50KCdBVVRIX0VWRU5UUycsIHtcbiAgICAgICAgbm90QXV0aGVudGljYXRlZDogJ2F1dGgtbm90LWF1dGhlbnRpY2F0ZWQnLFxuICAgICAgICBub3RBdXRob3JpemVkOiAnYXV0aC1ub3QtYXV0aG9yaXplZCdcbn0pO1xuXG5hcHAuY29uc3RhbnQoJ1VTRVJfUk9MRVMnLCB7XG4gICAgICAgIC8vYWRtaW46ICdhZG1pbl9yb2xlJyxcbiAgICAgICAgcHVibGljOiAncHVibGljX3JvbGUnXG59KTtcblxuYXBwLmZhY3RvcnkoJ0F1dGhUb2tlbkZhY3RvcnknLGZ1bmN0aW9uKCR3aW5kb3cpe1xuICAgIHZhciBzdG9yZSA9ICR3aW5kb3cubG9jYWxTdG9yYWdlO1xuICAgIHZhciBrZXkgPSAnYXV0aC10b2tlbic7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBnZXRUb2tlbjogZ2V0VG9rZW4sXG4gICAgICAgIHNldFRva2VuOiBzZXRUb2tlblxuICAgIH07XG5cbiAgICBmdW5jdGlvbiBnZXRUb2tlbigpe1xuICAgICAgICByZXR1cm4gc3RvcmUuZ2V0SXRlbShrZXkpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNldFRva2VuKHRva2VuKXtcbiAgICAgICAgaWYodG9rZW4pe1xuICAgICAgICAgICAgc3RvcmUuc2V0SXRlbShrZXksdG9rZW4pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc3RvcmUucmVtb3ZlSXRlbShrZXkpO1xuICAgICAgICB9XG4gICAgfVxufSk7XG5cbmFwcC5zZXJ2aWNlKCdBdXRoU2VydmljZScsZnVuY3Rpb24oJHEsJGh0dHAsVVNFUl9ST0xFUyxBdXRoVG9rZW5GYWN0b3J5LEFwaUVuZHBvaW50LCRyb290U2NvcGUsRnJpZW5kc0ZhY3Rvcnkpe1xuICAgIHZhciB1c2VybmFtZSA9ICcnO1xuICAgIHZhciBpc0F1dGhlbnRpY2F0ZWQgPSBmYWxzZTtcbiAgICB2YXIgYXV0aFRva2VuO1xuXG4gICAgZnVuY3Rpb24gbG9hZFVzZXJDcmVkZW50aWFscygpIHtcbiAgICAgICAgLy92YXIgdG9rZW4gPSB3aW5kb3cubG9jYWxTdG9yYWdlLmdldEl0ZW0oTE9DQUxfVE9LRU5fS0VZKTtcbiAgICAgICAgdmFyIHRva2VuID0gQXV0aFRva2VuRmFjdG9yeS5nZXRUb2tlbigpO1xuICAgICAgICAvL2NvbnNvbGUubG9nKHRva2VuKTtcbiAgICAgICAgaWYgKHRva2VuKSB7XG4gICAgICAgICAgICB1c2VDcmVkZW50aWFscyh0b2tlbik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzdG9yZVVzZXJDcmVkZW50aWFscyhkYXRhKSB7XG4gICAgICAgIEF1dGhUb2tlbkZhY3Rvcnkuc2V0VG9rZW4oZGF0YS50b2tlbik7XG4gICAgICAgIHVzZUNyZWRlbnRpYWxzKGRhdGEpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHVzZUNyZWRlbnRpYWxzKGRhdGEpIHtcbiAgICAgICAgLy9jb25zb2xlLmxvZygndXNlQ3JlZGVudGlhbHMgdG9rZW4nLGRhdGEpO1xuICAgICAgICB1c2VybmFtZSA9IGRhdGEudXNlcm5hbWU7XG4gICAgICAgIGlzQXV0aGVudGljYXRlZCA9IHRydWU7XG4gICAgICAgIGF1dGhUb2tlbiA9IGRhdGEudG9rZW47XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZGVzdHJveVVzZXJDcmVkZW50aWFscygpIHtcbiAgICAgICAgYXV0aFRva2VuID0gdW5kZWZpbmVkO1xuICAgICAgICB1c2VybmFtZSA9ICcnO1xuICAgICAgICBpc0F1dGhlbnRpY2F0ZWQgPSBmYWxzZTtcbiAgICAgICAgQXV0aFRva2VuRmFjdG9yeS5zZXRUb2tlbigpOyAvL2VtcHR5IGNsZWFycyB0aGUgdG9rZW5cbiAgICB9XG5cbiAgICB2YXIgbG9nb3V0ID0gZnVuY3Rpb24oKXtcbiAgICAgICAgZGVzdHJveVVzZXJDcmVkZW50aWFscygpO1xuICAgICAgICBGcmllbmRzRmFjdG9yeS5hbGxHaXN0cyA9IFtdO1xuICAgICAgICAvL1RPRE86IENlbnRyYWwgd2F5IHRvIGRlc3Ryb3kgbG9jYWwgZGF0YSBzYXZlZFxuICAgIH07XG5cbiAgICAvL3ZhciBsb2dpbiA9IGZ1bmN0aW9uKClcbiAgICB2YXIgbG9naW4gPSBmdW5jdGlvbih1c2VyZGF0YSl7XG4gICAgICAgIGNvbnNvbGUubG9nKCdsb2dpbicsSlNPTi5zdHJpbmdpZnkodXNlcmRhdGEpKTtcbiAgICAgICAgcmV0dXJuICRxKGZ1bmN0aW9uKHJlc29sdmUscmVqZWN0KXtcbiAgICAgICAgICAgICRodHRwLnBvc3QoQXBpRW5kcG9pbnQudXJsK1wiL3VzZXIvbG9naW5cIiwgdXNlcmRhdGEpXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgICAgICAgICAgICAgICBzdG9yZVVzZXJDcmVkZW50aWFscyhyZXNwb25zZS5kYXRhKTsgLy9zdG9yZVVzZXJDcmVkZW50aWFsc1xuICAgICAgICAgICAgICAgICAgICAvL2lzQXV0aGVudGljYXRlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUocmVzcG9uc2UpOyAvL1RPRE86IHNlbnQgdG8gYXV0aGVudGljYXRlZFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgdmFyIHNpZ251cCA9IGZ1bmN0aW9uKHVzZXJkYXRhKXtcbiAgICAgICAgY29uc29sZS5sb2coJ3NpZ251cCcsSlNPTi5zdHJpbmdpZnkodXNlcmRhdGEpKTtcbiAgICAgICAgcmV0dXJuICRxKGZ1bmN0aW9uKHJlc29sdmUscmVqZWN0KXtcbiAgICAgICAgICAgICRodHRwLnBvc3QoQXBpRW5kcG9pbnQudXJsK1wiL3VzZXIvc2lnbnVwXCIsIHVzZXJkYXRhKVxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAgICAgICAgICAgICAgICAgc3RvcmVVc2VyQ3JlZGVudGlhbHMocmVzcG9uc2UuZGF0YSk7IC8vc3RvcmVVc2VyQ3JlZGVudGlhbHNcbiAgICAgICAgICAgICAgICAgICAgLy9pc0F1dGhlbnRpY2F0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHJlc3BvbnNlKTsgLy9UT0RPOiBzZW50IHRvIGF1dGhlbnRpY2F0ZWRcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgbG9hZFVzZXJDcmVkZW50aWFscygpO1xuXG4gICAgdmFyIGlzQXV0aG9yaXplZCA9IGZ1bmN0aW9uKGF1dGhlbnRpY2F0ZWQpIHtcbiAgICAgICAgaWYgKCFhbmd1bGFyLmlzQXJyYXkoYXV0aGVudGljYXRlZCkpIHtcbiAgICAgICAgICAgIGF1dGhlbnRpY2F0ZWQgPSBbYXV0aGVudGljYXRlZF07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIChpc0F1dGhlbnRpY2F0ZWQgJiYgYXV0aGVudGljYXRlZC5pbmRleE9mKFVTRVJfUk9MRVMucHVibGljKSAhPT0gLTEpO1xuICAgIH07XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBsb2dpbjogbG9naW4sXG4gICAgICAgIHNpZ251cDogc2lnbnVwLFxuICAgICAgICBsb2dvdXQ6IGxvZ291dCxcbiAgICAgICAgaXNBdXRoZW50aWNhdGVkOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ0F1dGhTZXJ2aWNlLmlzQXV0aGVudGljYXRlZCgpJyk7XG4gICAgICAgICAgICByZXR1cm4gaXNBdXRoZW50aWNhdGVkO1xuICAgICAgICB9LFxuICAgICAgICB1c2VybmFtZTogZnVuY3Rpb24oKXtyZXR1cm4gdXNlcm5hbWU7fSxcbiAgICAgICAgLy9nZXRMb2dnZWRJblVzZXI6IGdldExvZ2dlZEluVXNlcixcbiAgICAgICAgaXNBdXRob3JpemVkOiBpc0F1dGhvcml6ZWRcbiAgICB9XG5cbn0pO1xuXG4vL1RPRE86IERpZCBub3QgY29tcGxldGUgbWFpbiBjdHJsICdBcHBDdHJsIGZvciBoYW5kbGluZyBldmVudHMnXG4vLyBhcyBwZXIgaHR0cDovL2RldmRhY3RpYy5jb20vdXNlci1hdXRoLWFuZ3VsYXJqcy1pb25pYy8iLCJhcHAuZmFjdG9yeSgnR2lzdEZhY3RvcnknLGZ1bmN0aW9uKCRodHRwLCRxLEFwaUVuZHBvaW50KXtcblxuICAgIC8vVE9ETzogaGFuZGxpbmcgZm9yIG11bHRpcGxlIGZyaWVuZHMgKGFmdGVyIHRlc3Rpbmcgb25lIGZyaWVuZCB3b3JrcylcbiAgICAvL1RPRE86IEZyaWVuZCBhbmQgY29kZSBtdXN0IGJlIHByZXNlbnRcbiAgICAvL1RPRE86IGZyaWVuZHMgaXMgYW4gYXJyYXkgb2YgZnJpZW5kIE1vbmdvIElEc1xuXG4gICAgLy9UT0RPOiBTaGFyZSBkZXNjcmlwdGlvbiBhbmQgZmlsZW5hbWUgYmFzZWQgb24gY2hhbGxlbmdlIGZvciBleGFtcGxlXG4gICAgLy9UT0RPOk9yIGdpdmUgdGhlIHVzZXIgb3B0aW9ucyBvZiB3aGF0IHRvIGZpbGwgaW5cblxuICAgIC8vVE9ETzogT24tQ2xpY2sgR3JhYiB0aGUgbGF0ZXN0IGNvZGVcbiAgICBmdW5jdGlvbiBzaGFyZUdpc3QoY29kZSxmcmllbmRzLGRlc2NyaXB0aW9uLGZpbGVOYW1lKXtcbiAgICAgICAgY29uc29sZS5sb2coJ2NvZGUnLGNvZGUpO1xuICAgICAgICByZXR1cm4gJGh0dHAucG9zdChBcGlFbmRwb2ludC51cmwgKyAnL2dpc3RzL3NoYXJlR2lzdHMnLFxuICAgICAgICAgICAge2dpc3QgOiB7XG4gICAgICAgICAgICAgICAgY29kZTpjb2RlfHxcIm5vIGNvZGUgZW50ZXJlZFwiLFxuICAgICAgICAgICAgICAgIGZyaWVuZHM6ZnJpZW5kc3x8IFwiNTU1YjYyM2RmYTlhNjVhNDNlOWVjNmQ2XCIsXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246ZGVzY3JpcHRpb24gfHwgJ25vIGRlc2NyaXB0aW9uJyxcbiAgICAgICAgICAgICAgICBmaWxlTmFtZTpmaWxlTmFtZStcIi5qc1wiIHx8ICdubyBmaWxlIG5hbWUnXG4gICAgICAgICAgICB9fSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcXVldWVkR2lzdHMoKXtcbiAgICAgICAgcmV0dXJuICRodHRwLmdldChBcGlFbmRwb2ludC51cmwgKyAnL2dpc3RzL2dpc3RzUXVldWUnKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjcmVhdGVkR2lzdHMoKXtcbiAgICAgICAgcmV0dXJuICRodHRwLmdldChBcGlFbmRwb2ludC51cmwgKyAnL2dpc3RzL2NyZWF0ZWRHaXN0cycpXG4gICAgfVxuXG4gICAgcmV0dXJue1xuICAgICAgICBzaGFyZUdpc3Q6IHNoYXJlR2lzdCxcbiAgICAgICAgcXVldWVkR2lzdHM6IHF1ZXVlZEdpc3RzLCAvL3B1c2ggbm90aWZpY2F0aW9uc1xuICAgICAgICBjcmVhdGVkR2lzdHM6IGNyZWF0ZWRHaXN0c1xuICAgfVxufSk7IiwiYXBwLmZhY3RvcnkoJ0tleWJvYXJkRmFjdG9yeScsIGZ1bmN0aW9uKCl7XG5cdHJldHVybiB7XG5cdFx0bWFrZUluc2VydEZ1bmMgOiBmdW5jdGlvbihzY29wZSl7XG5cdFx0XHRyZXR1cm4gZnVuY3Rpb24gKHRleHQpe1xuXHRcdFx0XHRzY29wZS4kYnJvYWRjYXN0KFwiaW5zZXJ0XCIsIHRleHQpO1xuXHRcdFx0fTtcblx0XHR9XG5cdH07XG59KTsiLCJhcHAuZmFjdG9yeSgnQ29kZVNuaXBwZXRGYWN0b3J5JywgZnVuY3Rpb24oJHJvb3RTY29wZSl7XG5cdFxuXHR2YXIgY29kZVNuaXBwZXRzID0gW1xuXHRcdHtcblx0XHRcdGRpc3BsYXk6IFwiZm5cIixcblx0XHRcdGluc2VydFBhcmFtOiBcImZ1bmN0aW9uKCl7IH1cIlxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0ZGlzcGxheTogXCJmb3JcIixcblx0XHRcdGluc2VydFBhcmFtOiBcImZvcih2YXIgaT0gO2k8IDtpKyspeyB9XCJcblx0XHR9LFxuXHRcdHtcblx0XHRcdGRpc3BsYXk6IFwid2hpbGVcIixcblx0XHRcdGluc2VydFBhcmFtOiBcIndoaWxlKCApeyB9XCJcblx0XHR9LFxuXHRcdHtcblx0XHRcdGRpc3BsYXk6IFwiZG8gd2hpbGVcIixcblx0XHRcdGluc2VydFBhcmFtOiBcImRvIHsgfSB3aGlsZSggKTtcIlxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0ZGlzcGxheTogXCJsb2dcIixcblx0XHRcdGluc2VydFBhcmFtOiBcImNvbnNvbGUubG9nKCk7XCJcblx0XHR9LFxuXHRdO1xuXG5cdHZhciBicmFja2V0cyA9IFtcblx0XHR7XG5cdFx0XHRkaXNwbGF5OiBcIlsgXVwiLFxuXHRcdFx0aW5zZXJ0UGFyYW06IFwiW11cIlxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0ZGlzcGxheTogXCJ7IH1cIixcblx0XHRcdGluc2VydFBhcmFtOiBcInt9XCJcblx0XHR9LFxuXHRcdHtcblx0XHRcdGRpc3BsYXk6IFwiKCApXCIsXG5cdFx0XHRpbnNlcnRQYXJhbTogXCIoKVwiXG5cdFx0fSxcblx0XHR7XG5cdFx0XHRkaXNwbGF5OiBcIi8vXCIsXG5cdFx0XHRpbnNlcnRQYXJhbTogXCIvL1wiXG5cdFx0fSxcblx0XHR7XG5cdFx0XHRkaXNwbGF5OiBcIi8qICAqL1wiLFxuXHRcdFx0aW5zZXJ0UGFyYW06IFwiLyogKi9cIlxuXHRcdH1cblx0XTtcblxuXHR2YXIgc3BlY2lhbCA9IFtcblx0XHR7XG5cdFx0XHRkaXNwbGF5OiBcIiFcIixcblx0XHRcdGluc2VydFBhcmFtOiBcIiFcIlxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0ZGlzcGxheTogXCJAXCIsXG5cdFx0XHRpbnNlcnRQYXJhbTogXCJAXCJcblx0XHR9LFxuXHRcdHtcblx0XHRcdGRpc3BsYXk6IFwiI1wiLFxuXHRcdFx0aW5zZXJ0UGFyYW06IFwiI1wiXG5cdFx0fSxcblx0XHR7XG5cdFx0XHRkaXNwbGF5OiBcIiRcIixcblx0XHRcdGluc2VydFBhcmFtOiBcIiRcIlxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0ZGlzcGxheTogXCIlXCIsXG5cdFx0XHRpbnNlcnRQYXJhbTogXCIlXCJcblx0XHR9LFxuXHRcdHtcblx0XHRcdGRpc3BsYXk6IFwiPVwiLFxuXHRcdFx0aW5zZXJ0UGFyYW06IFwiPVwiXG5cdFx0fSxcblx0XHR7XG5cdFx0XHRkaXNwbGF5OiBcIjxcIixcblx0XHRcdGluc2VydFBhcmFtOiBcIjxcIlxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0ZGlzcGxheTogXCI+XCIsXG5cdFx0XHRpbnNlcnRQYXJhbTogXCI+XCJcblx0XHR9LFxuXHRcdHtcblx0XHRcdGRpc3BsYXk6IFwiO1wiLFxuXHRcdFx0aW5zZXJ0UGFyYW06IFwiO1wiXG5cdFx0fVxuXHRdO1xuXG5cdHZhciBkZW1vQnV0dG9ucyA9IFtcblx0XHR7XG5cdFx0XHRkaXNwbGF5OiBcIkRlbW8xXCIsXG5cdFx0XHRpbnNlcnRQYXJhbTogXCI8XCJcblx0XHR9LFxuXHRcdHtcblx0XHRcdGRpc3BsYXk6IFwiRGVtbzJcIixcblx0XHRcdGluc2VydFBhcmFtOiBcIj5cIlxuXHRcdH1cblx0XTtcblxuXHR2YXIgZm9vdGVyTWVudSA9IFtcblx0XHR7XG5cdFx0XHRkaXNwbGF5OiBcIkN1c3RvbVwiLFxuXHRcdFx0ZGF0YTogY29kZVNuaXBwZXRzXG5cdFx0fSxcblx0XHR7XG5cdFx0XHRkaXNwbGF5OiBcIlNwZWNpYWxcIixcblx0XHRcdGRhdGE6IHNwZWNpYWxcblx0XHR9LFxuXHRcdHtcblx0XHRcdGRpc3BsYXk6IFwiQnJhY2tldHNcIixcblx0XHRcdGRhdGE6IGJyYWNrZXRzXG5cdFx0fVxuXHRcdC8vIHtcblx0XHQvLyBcdGRpc3BsYXk6IFwiRGVtb1wiLFxuXHRcdC8vIFx0ZGF0YTogZGVtb0J1dHRvbnNcblx0XHQvLyB9XG5cdF07XG5cblx0Ly8gdmFyIGdldEhvdGtleXMgPSBmdW5jdGlvbigpe1xuXHQvLyBcdHJldHVybiBmb290ZXJIb3RrZXlzO1xuXHQvLyB9O1xuXG5cdHJldHVybiBcdHtcblx0XHRnZXRGb290ZXJNZW51IDogZnVuY3Rpb24oKXtcblx0XHRcdHJldHVybiBmb290ZXJNZW51O1xuXHRcdH0sXG5cdFx0YWRkU25pcHBldCA6IGZ1bmN0aW9uKG9iail7XG5cdFx0XHRjb25zb2xlLmxvZyhvYmopO1xuXHRcdFx0Y29kZVNuaXBwZXRzLnB1c2gob2JqKTtcblx0XHRcdCRyb290U2NvcGUuJGJyb2FkY2FzdCgnZm9vdGVyVXBkYXRlZCcsIHRoaXMuZ2V0Rm9vdGVyTWVudSgpKTtcblx0XHR9LFxuXHRcdGRlbGV0ZVNuaXBwZXQgOiBmdW5jdGlvbihpZCl7XG5cdFx0XHRjb2RlU25pcHBldHMuc3BsaWNlKGlkLCAxKTtcblx0XHRcdCRyb290U2NvcGUuJGJyb2FkY2FzdCgnZm9vdGVyVXBkYXRlZCcsIHRoaXMuZ2V0Rm9vdGVyTWVudSgpKTtcblx0XHR9LFxuXHRcdGdldEFsbFNuaXBwZXRzIDogZnVuY3Rpb24oKXtcblx0XHRcdHJldHVybiBjb2RlU25pcHBldHMubWFwKGZ1bmN0aW9uKGVsLCBpbmRleCl7XG5cdFx0XHRcdGVsLmlkID0gaW5kZXg7XG5cdFx0XHRcdHJldHVybiBlbDtcblx0XHRcdH0pO1xuXHRcdH0sXG5cdFx0ZWRpdFNuaXBwZXQgOiBmdW5jdGlvbihpZCwgY2hhbmdlcyl7XG5cdFx0XHRmb3IodmFyIGtleSBpbiBjb2RlU25pcHBldHNbaWRdKXtcblx0XHRcdFx0Y29kZVNuaXBwZXRzW2lkXVtrZXldID0gY2hhbmdlc1trZXldO1xuXHRcdFx0fVxuXHRcdFx0JHJvb3RTY29wZS4kYnJvYWRjYXN0KCdmb290ZXJVcGRhdGVkJywgdGhpcy5nZXRGb290ZXJNZW51KCkpO1xuXHRcdH0sXG5cdFx0Z2V0U25pcHBldCA6IGZ1bmN0aW9uKGlkKXtcblx0XHRcdHJldHVybiBjb2RlU25pcHBldHNbaWRdO1xuXHRcdH0sXG5cdFx0Z2V0U29tZVNuaXBwZXRzIDogZnVuY3Rpb24odGV4dCl7XG5cdFx0XHRmdW5jdGlvbiByZXBsYWNlVFNOIChzdHIpe1xuXHRcdFx0XHRyZXR1cm4gc3RyLnJlcGxhY2UoJy8oXFxufFxcdHxcXHMpKy9nJywgJycpO1xuXHRcdFx0fVxuXG5cdFx0XHRmdW5jdGlvbiBjaGVja09iamVjdChjaGVjayl7XG5cdFx0XHRcdGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSl7XG5cdFx0XHRcdFx0dmFyIGFyZ3MgPSBbXS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsMCk7XG5cdFx0XHRcdFx0YXJncy5zaGlmdCgpO1xuXHRcdFx0XHRcdHJldHVybiBhcmdzLmZpbHRlcihmdW5jdGlvbihlbCl7XG5cdFx0XHRcdFx0XHRyZXR1cm4gcmVwbGFjZVRTTihlbCkgPT09IHJlcGxhY2VUU04oY2hlY2spO1xuXHRcdFx0XHRcdH0pLmxlbmd0aCA+IDA7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSB0aHJvdyBuZXcgRXJyb3IoJ1BsZWFzZSBjaGVjaycpO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gY29kZVNuaXBwZXRzLmZpbHRlcihmdW5jdGlvbihlbCl7XG5cdFx0XHRcdHJldHVybiBjaGVja09iamVjdCh0ZXh0LCBlbC5kaXNwbGF5LCBlbC5pbnNlcnRQYXJhbSk7XG5cdFx0XHR9KTtcblx0XHR9XG5cdH07XG59KTsiLCJhcHAuZmlsdGVyKCdib29sJywgZnVuY3Rpb24oKXtcblx0cmV0dXJuIGZ1bmN0aW9uKGlucHV0LCBjb25kaXRpb24sIGlmVHJ1ZSwgaWZGYWxzZSl7XG5cdFx0aWYoZXZhbChpbnB1dCArIGNvbmRpdGlvbikpe1xuXHRcdFx0cmV0dXJuIGlmVHJ1ZTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmV0dXJuIGlmRmFsc2U7XG5cdFx0fVxuXHR9O1xufSk7IiwiYXBwLmZpbHRlcignbmFtZWZvcm1hdCcsIGZ1bmN0aW9uKCl7XG5cdHJldHVybiBmdW5jdGlvbih0ZXh0KXtcblx0XHRyZXR1cm4gJ0V4ZXJjaXNtIC0gJyArIHRleHQuc3BsaXQoJy0nKS5tYXAoZnVuY3Rpb24oZWwpe1xuXHRcdFx0cmV0dXJuIGVsLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgZWwuc2xpY2UoMSk7XG5cdFx0fSkuam9pbignICcpO1xuXHR9O1xufSk7IiwiYXBwLmZpbHRlcignbGVuZ3RoJywgZnVuY3Rpb24oKXtcblx0cmV0dXJuIGZ1bmN0aW9uKGFycklucHV0KXtcblx0XHR2YXIgY2hlY2tBcnIgPSBhcnJJbnB1dCB8fCBbXTtcblx0XHRyZXR1cm4gY2hlY2tBcnIubGVuZ3RoO1xuXHR9O1xufSk7IiwiYXBwLmZpbHRlcignbWFya2VkJywgZnVuY3Rpb24oJHNjZSl7XG5cdC8vIG1hcmtlZC5zZXRPcHRpb25zKHtcblx0Ly8gXHRyZW5kZXJlcjogbmV3IG1hcmtlZC5SZW5kZXJlcigpLFxuXHQvLyBcdGdmbTogdHJ1ZSxcblx0Ly8gXHR0YWJsZXM6IHRydWUsXG5cdC8vIFx0YnJlYWtzOiB0cnVlLFxuXHQvLyBcdHBlZGFudGljOiBmYWxzZSxcblx0Ly8gXHRzYW5pdGl6ZTogdHJ1ZSxcblx0Ly8gXHRzbWFydExpc3RzOiB0cnVlLFxuXHQvLyBcdHNtYXJ0eXBhbnRzOiBmYWxzZVxuXHQvLyB9KTtcblx0cmV0dXJuIGZ1bmN0aW9uKHRleHQpe1xuXHRcdGlmKHRleHQpe1xuXHRcdFx0cmV0dXJuICRzY2UudHJ1c3RBc0h0bWwobWFya2VkKHRleHQpKTtcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHRyZXR1cm4gdW5kZWZpbmVkO1xuXHRcdH1cblx0fTtcbn0pOyIsImFwcC5maWx0ZXIoJ3ByZXBlbmQnLCBmdW5jdGlvbigpe1xuXHRyZXR1cm4gZnVuY3Rpb24oaW5wdXQsIHByZXBlbmQpe1xuXHRcdHJldHVybiBwcmVwZW5kICsgaW5wdXQ7XG5cdH07XG59KTsiLCJhcHAuZmlsdGVyKCd0cnVuY2F0ZScsIGZ1bmN0aW9uKCl7XG5cdHJldHVybiBmdW5jdGlvbihpbnB1dCwgbGVuZ3RoKXtcblx0XHRpZihpbnB1dC5sZW5ndGggPiBsZW5ndGgpIHJldHVybiBpbnB1dC5zdWJzdHIoMCwgbGVuZ3RoKSArICcuLi4nO1xuXHRcdGVsc2UgcmV0dXJuIGlucHV0O1xuXHR9O1xufSk7IiwiYXBwLnNlcnZpY2UoJ0xvY2FsU3RvcmFnZScsZnVuY3Rpb24oJGxvY2Fsc3RvcmFnZSl7XG4gICAgLy9pZihcbiAgICAvL2NvbnNvbGUubG9nKCRjb3Jkb3ZhTmV0d29yay5nZXROZXR3b3JrKCkpO1xuICAgIGlmKCRsb2NhbHN0b3JhZ2UuZ2V0KCdhdXRoLXRva2VuJykpe1xuICAgICAgICAvL1RPRE86IFRlc3QgTmV0d29yayBDb25uZWN0aW9uIG9uIERldmljZSBhbmQgVmlhIENvbnNvbGUgTG9nXG5cbiAgICAgICAgdmFyIGNvbm5lY3Rpb24gPSAhZmFsc2U7XG5cbiAgICAgICAgaWYoY29ubmVjdGlvbil7XG4gICAgICAgICAgICAvL3N5bmMgZGF0YVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy9sb2FkIGRhdGEgZnJvbSBsb2NhbFN0b3JhZ2VcbiAgICAgICAgICAgIC8veW91IG5lZWQgdG8gc3RvcmUgdG8gbG9jYWwgc3RvcmFnZSBhdCBzb21lIHBvaW50XG4gICAgICAgICAgICAvL3NvIGFueXRpbWUgeW91IHRvdWNoIGFueSBvZiB0aGUgbG9jYWxTdG9yYWdlIGRhdGEsIGJlIHN1cmUgdG8gd3JpdGUgdG8gaXRcbiAgICAgICAgfVxuICAgICAgICAvL0lmIEludGVybmV0IENvbm5lY3Rpb25cblxuICAgICAgICAvL2NvbnNvbGUubG9nKCRjb3Jkb3ZhTmV0d29yay5nZXROZXR3b3JrKCkpO1xuICAgICAgICAvL2NvbnNvbGUubG9nKENvbm5lY3Rpb24uTk9ORSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgLy9kbyBub3RoaW5nIC0gd2VsY29tZSB3aWxsIGhhbmRsZSB1bi1hdXRoIHVzZXJzXG4gICAgfVxufSk7XG5cbi8vV29ya2luZyBPZmZsaW5lXG4vL1N5bmMgQ29tbW9uIERhdGEgb24gQXBwIExvYWQgaWYgUG9zc2libGUgKGFuZCBzdG9yZSBpbiBMb2NhbFN0b3JhZ2UpIC0gT3RoZXJ3aXNlIGxvYWQgZnJvbSBMb2NhbCBTdG9yYWdlXG4gICAgLy9Mb2NhbFN0b3JhZ2VcbiAgICAgICAgLy9TdG9yZSBGcmllbmRzXG4gICAgICAgIC8vU3RvcmUgQ29kZSBSZWNlaXZlZCAoZnJvbSBXaG8pXG4gICAgICAgIC8vU3RvcmUgTGFzdCBTeW5jXG4vL1N5bmMgQ29tbW9uIERhdGEgUGVyaW9kaWNhbGx5IGFzIHdlbGwgKE5vdCBTdXJlIEhvdz8hKSBNYXliZSBvbiBDZXJ0YWluIEhvdFNwb3RzIChjbGlja2luZyBjZXJ0YWluIGxpbmtzKSBhbmQgVGltZUJhc2VkIGFzIHdlbFxuIiwiYW5ndWxhci5tb2R1bGUoJ2lvbmljLnV0aWxzJywgW10pXG5cbi5mYWN0b3J5KCckbG9jYWxzdG9yYWdlJywgWyckd2luZG93JywgZnVuY3Rpb24oJHdpbmRvdykge1xuICByZXR1cm4ge1xuICAgIHNldDogZnVuY3Rpb24oa2V5LCB2YWx1ZSkge1xuICAgICAgJHdpbmRvdy5sb2NhbFN0b3JhZ2Vba2V5XSA9IHZhbHVlO1xuICAgIH0sXG4gICAgZ2V0OiBmdW5jdGlvbihrZXksIGRlZmF1bHRWYWx1ZSkge1xuICAgICAgcmV0dXJuICR3aW5kb3cubG9jYWxTdG9yYWdlW2tleV0gfHwgZGVmYXVsdFZhbHVlO1xuICAgIH0sXG4gICAgc2V0T2JqZWN0OiBmdW5jdGlvbihrZXksIHZhbHVlKSB7XG4gICAgICAkd2luZG93LmxvY2FsU3RvcmFnZVtrZXldID0gSlNPTi5zdHJpbmdpZnkodmFsdWUpO1xuICAgIH0sXG4gICAgZ2V0T2JqZWN0OiBmdW5jdGlvbihrZXkpIHtcbiAgICAgIHJldHVybiBKU09OLnBhcnNlKCR3aW5kb3cubG9jYWxTdG9yYWdlW2tleV0gfHwgJ3t9Jyk7XG4gICAgfVxuICB9O1xufV0pOyIsImFwcC5kaXJlY3RpdmUoJ2NtZWRpdCcsIGZ1bmN0aW9uKCl7XG5cdHJldHVybiB7XG5cdFx0cmVzdHJpY3QgOiAnQScsXG5cdFx0cmVxdWlyZTogJ25nTW9kZWwnLFxuXHRcdGxpbmsgOiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cmlidXRlLCBuZ01vZGVsQ3RybCl7XG5cdFx0XHQvL2luaXRpYWxpemUgQ29kZU1pcnJvclxuXHRcdFx0dmFyIG15Q29kZU1pcnJvcjtcblx0XHRcdG15Q29kZU1pcnJvciA9IENvZGVNaXJyb3IuZnJvbVRleHRBcmVhKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGF0dHJpYnV0ZS5pZCksIHtcblx0XHRcdFx0bGluZU51bWJlcnMgOiB0cnVlLFxuXHRcdFx0XHRtb2RlOiAnamF2YXNjcmlwdCcsXG5cdFx0XHRcdGF1dG9mb2N1cyA6IHRydWUsXG5cdFx0XHRcdC8vIHRoZW1lIDogJ21vbm9rYWknLFxuXHRcdFx0XHQvL3RoZW1lIDogJ3R3aWxpZ2h0Jyxcblx0XHRcdFx0bGluZVdyYXBwaW5nOiB0cnVlLFxuXHRcdFx0XHRpbnB1dFN0eWxlOiAnY29udGVudGVkaXRhYmxlJ1xuXHRcdFx0fSk7XG5cdFx0XHRuZ01vZGVsQ3RybC4kcmVuZGVyID0gZnVuY3Rpb24oKXtcblx0XHRcdFx0bXlDb2RlTWlycm9yLnNldFZhbHVlKG5nTW9kZWxDdHJsLiR2aWV3VmFsdWUgfHwgJycpO1xuXHRcdFx0fTtcblxuXHRcdFx0bXlDb2RlTWlycm9yLm9uKFwiY2hhbmdlXCIsIGZ1bmN0aW9uIChteUNvZGVNaXJyb3IsIGNoYW5nZU9iail7XG5cdFx0ICAgIFx0bmdNb2RlbEN0cmwuJHNldFZpZXdWYWx1ZShteUNvZGVNaXJyb3IuZ2V0VmFsdWUoKSk7XG5cdFx0ICAgIFx0bXlDb2RlTWlycm9yLmZvY3VzKCk7XG5cdFx0ICAgIH0pO1xuXG5cdFx0ICAgIHNjb3BlLiRvbihcImluc2VydFwiLCBmdW5jdGlvbihldmVudCwgdGV4dCl7XG5cdFx0ICAgIFx0bXlDb2RlTWlycm9yLnJlcGxhY2VTZWxlY3Rpb24odGV4dCk7XG5cdFx0ICAgIFx0bXlDb2RlTWlycm9yLmZvY3VzKCk7XG5cdFx0ICAgIH0pO1xuXG5cdFx0ICAgIG15Q29kZU1pcnJvci5vbihcImJsdXJcIiwgZnVuY3Rpb24gKCl7XG5cdFx0ICAgIFx0Y29uc29sZS5sb2coXCJibHVyIGRldGVjdGVkXCIpO1xuXHRcdCAgICBcdG15Q29kZU1pcnJvci5mb2N1cygpO1xuXHRcdCAgICB9KTtcblxuXHRcdH1cblx0fTtcbn0pOyIsImFwcC5kaXJlY3RpdmUoJ2NvZGVrZXlib2FyZCcsIGZ1bmN0aW9uKENvZGVTbmlwcGV0RmFjdG9yeSwgJGNvbXBpbGUpe1xuXHRyZXR1cm4ge1xuXHRcdHJlc3RyaWN0IDogJ0EnLFxuXHRcdGxpbmsgOiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cmlidXRlKXtcblx0XHRcdHZhciB2aXNpYmxlID0gZmFsc2U7XG5cblx0XHRcdGVsZW1lbnQuYWRkQ2xhc3MoXCJiYXItc3RhYmxlXCIpO1xuXHRcdFx0ZWxlbWVudC5hZGRDbGFzcygnbmctaGlkZScpO1xuXG5cdFx0XHRmdW5jdGlvbiB0b2dnbGVDbGFzcygpe1xuXHRcdFx0XHRpZih2aXNpYmxlKXtcblx0XHRcdFx0XHRlbGVtZW50LnJlbW92ZUNsYXNzKCduZy1oaWRlJyk7XG5cdFx0XHRcdFx0ZWxlbWVudC5hZGRDbGFzcygnbmctc2hvdycpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGVsZW1lbnQucmVtb3ZlQ2xhc3MoJ25nLXNob3cnKTtcblx0XHRcdFx0XHRlbGVtZW50LmFkZENsYXNzKCduZy1oaWRlJyk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHNjb3BlLmJ0bnMgPSBDb2RlU25pcHBldEZhY3RvcnkuZ2V0Rm9vdGVyTWVudSgpO1xuXG5cdFx0XHRzY29wZS4kb24oJ2Zvb3RlclVwZGF0ZWQnLCBmdW5jdGlvbihldmVudCwgZGF0YSl7XG5cdFx0XHRcdHNjb3BlLmJ0bnMgPSBkYXRhO1xuXHRcdFx0fSk7XG5cblx0XHRcdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibmF0aXZlLmtleWJvYXJkc2hvd1wiLCBmdW5jdGlvbiAoKXtcblx0XHQgICAgXHR2aXNpYmxlID0gdHJ1ZTtcblx0XHQgICAgXHR0b2dnbGVDbGFzcygpO1xuXG5cdFx0ICAgIH0pO1xuXHRcdCAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIm5hdGl2ZS5rZXlib2FyZGhpZGVcIiwgZnVuY3Rpb24gKCl7XG5cdFx0ICAgIFx0dmlzaWJsZSA9IGZhbHNlO1xuXHRcdCAgICBcdHRvZ2dsZUNsYXNzKCk7XG5cdFx0ICAgIH0pO1xuXHRcdH1cblx0fTtcbn0pOyIsImFwcC5kaXJlY3RpdmUoJ3NuaXBwZXRidXR0b25zJywgZnVuY3Rpb24oKXtcblx0cmV0dXJuIHtcblx0XHRyZXN0cmljdCA6ICdFJyxcblx0XHRyZXBsYWNlOnRydWUsXG5cdFx0dGVtcGxhdGVVcmw6XCJmZWF0dXJlcy9jb21tb24vZGlyZWN0aXZlcy9jb2Rla2V5Ym9hcmRiYXIvc25pcHBldGJ1dHRvbnMuaHRtbFwiLFxuXHRcdGxpbmsgOiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cmlidXRlKXtcblx0XHRcdHNjb3BlLnNob3dPcHRpb25zID0gZmFsc2U7XG5cdFx0XHRzY29wZS5idG5DbGljayA9IGZ1bmN0aW9uKGRhdGEpe1xuXHRcdFx0XHRzY29wZS5zaG93T3B0aW9ucyA9IHRydWU7XG5cdFx0XHRcdHNjb3BlLml0ZW1zID0gZGF0YTtcblx0XHRcdH07XG5cdFx0XHRzY29wZS5pdGVtQ2xpY2sgPSBmdW5jdGlvbihpbnNlcnRQYXJhbSl7XG5cdFx0XHRcdHNjb3BlLmluc2VydEZ1bmMoaW5zZXJ0UGFyYW0pO1xuXHRcdFx0fTtcblx0XHRcdHNjb3BlLnJlc2V0TWVudSA9IGZ1bmN0aW9uKCl7XG5cdFx0XHRcdHNjb3BlLnNob3dPcHRpb25zID0gZmFsc2U7XG5cdFx0XHR9O1xuXHRcdFx0c2NvcGUuZGVtbzEgPSBmdW5jdGlvbigpIHtcblx0XHRcdFx0dmFyIHRleHQgPSBcInZhciBIZWxsb1dvcmxkID0gZnVuY3Rpb24oKSB7fTtcXG5IZWxsb1dvcmxkLnByb3RvdHlwZS5oZWxsbyA9IGZ1bmN0aW9uKG5hbWUpe25hbWU9bmFtZXx8J3dvcmxkJztcXG5yZXR1cm4gJ0hlbGxvLCAnICsgbmFtZSArICchJzt9O1wiO1xuXHRcdFx0XHRzY29wZS5pbnNlcnRGdW5jKHRleHQpO1xuXHRcdFx0fTtcblx0XHRcdHNjb3BlLmRlbW8yID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHZhciB0ZXh0ID0gXCJmdW5jdGlvbiBoYWhhKCkge3JldHVybiBcXFwiaGVoZVxcXCJ9O1xcblxcbmhhaGEoKTtcIjtcblx0XHRcdFx0c2NvcGUuaW5zZXJ0RnVuYyh0ZXh0KTtcblx0XHRcdH07XG5cblx0XHR9XG5cdH07XG59KTsiLCJhcHAuZGlyZWN0aXZlKCdjbXJlYWQnLCBmdW5jdGlvbigpe1xuXHRyZXR1cm4ge1xuXHRcdHJlc3RyaWN0IDogJ0EnLFxuXHRcdHJlcXVpcmU6ICduZ01vZGVsJyxcblx0XHRsaW5rIDogZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHJpYnV0ZSwgbmdNb2RlbEN0cmwpe1xuXHRcdFx0Ly9pbml0aWFsaXplIENvZGVNaXJyb3Jcblx0XHRcdHZhciBteUNvZGVNaXJyb3IgPSBDb2RlTWlycm9yLmZyb21UZXh0QXJlYShkb2N1bWVudC5nZXRFbGVtZW50QnlJZChhdHRyaWJ1dGUuaWQpLCB7XG5cdFx0XHRcdHJlYWRPbmx5IDogJ25vY3Vyc29yJyxcblx0XHRcdFx0bW9kZTogJ2phdmFzY3JpcHQnLFxuXHRcdFx0XHRhdXRvZm9jdXMgOiB0cnVlLFxuXHRcdFx0XHQvL3RoZW1lIDogJ3R3aWxpZ2h0Jyxcblx0XHRcdFx0bGluZVdyYXBwaW5nOiB0cnVlXG5cdFx0XHR9KTtcblxuXHRcdFx0bmdNb2RlbEN0cmwuJHJlbmRlciA9IGZ1bmN0aW9uKCl7XG5cdFx0XHRcdG15Q29kZU1pcnJvci5zZXRWYWx1ZShuZ01vZGVsQ3RybC4kdmlld1ZhbHVlIHx8ICcnKTtcblx0XHRcdH07XG5cdFx0fVxuXHR9O1xufSk7IiwiYXBwLmRpcmVjdGl2ZSgnamFzbWluZScsIGZ1bmN0aW9uKEphc21pbmVSZXBvcnRlcil7XG5cdHJldHVybiB7XG5cdFx0cmVzdHJpY3QgOiAnRScsXG5cdFx0dHJhbnNjbHVkZTogdHJ1ZSxcblx0XHRzY29wZSA6IHtcblx0XHRcdHRlc3Q6ICc9Jyxcblx0XHRcdGNvZGU6ICc9J1xuXHRcdH0sXG5cdFx0dGVtcGxhdGVVcmwgOiAnZmVhdHVyZXMvY29tbW9uL2RpcmVjdGl2ZXMvamFzbWluZS9qYXNtaW5lLmh0bWwnLFxuXHRcdGxpbmsgOiBmdW5jdGlvbiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJpYnV0ZSl7XG5cdFx0XHRzY29wZS4kd2F0Y2goJ3Rlc3QnLCBmdW5jdGlvbigpe1xuXHRcdFx0XHR3aW5kb3cuamFzbWluZSA9IG51bGw7XG5cdFx0XHRcdEphc21pbmVSZXBvcnRlci5pbml0aWFsaXplSmFzbWluZSgpO1xuXHRcdFx0XHRKYXNtaW5lUmVwb3J0ZXIuYWRkUmVwb3J0ZXIoc2NvcGUpO1xuXHRcdFx0fSk7XG5cblx0XHRcdHNjb3BlLiR3YXRjaCgnY29kZScsIGZ1bmN0aW9uKCl7XG5cdFx0XHRcdHdpbmRvdy5qYXNtaW5lID0gbnVsbDtcblx0XHRcdFx0SmFzbWluZVJlcG9ydGVyLmluaXRpYWxpemVKYXNtaW5lKCk7XG5cdFx0XHRcdEphc21pbmVSZXBvcnRlci5hZGRSZXBvcnRlcihzY29wZSk7XG5cdFx0XHR9KTtcblxuXHRcdFx0ZnVuY3Rpb24gZmxhdHRlblJlbW92ZUR1cGVzKGFyciwga2V5Q2hlY2spe1xuXHRcdFx0XHR2YXIgdHJhY2tlciA9IFtdO1xuXHRcdFx0XHRyZXR1cm4gd2luZG93Ll8uZmxhdHRlbihhcnIpLmZpbHRlcihmdW5jdGlvbihlbCl7XG5cdFx0XHRcdFx0aWYodHJhY2tlci5pbmRleE9mKGVsW2tleUNoZWNrXSkgPT0gLTEpe1xuXHRcdFx0XHRcdFx0dHJhY2tlci5wdXNoKGVsW2tleUNoZWNrXSk7XG5cdFx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblxuXHRcdFx0c2NvcGUuc3VtbWFyeVNob3dpbmcgPSB0cnVlO1xuXG5cdFx0XHRzY29wZS5zaG93U3VtbWFyeSA9IGZ1bmN0aW9uKCl7XG5cdFx0XHRcdGlmKCFzY29wZS5zdW1tYXJ5U2hvd2luZykgc2NvcGUuc3VtbWFyeVNob3dpbmcgPSAhc2NvcGUuc3VtbWFyeVNob3dpbmc7XG5cdFx0XHR9O1xuXHRcdFx0c2NvcGUuc2hvd0ZhaWx1cmVzID0gZnVuY3Rpb24oKXtcblx0XHRcdFx0aWYoc2NvcGUuc3VtbWFyeVNob3dpbmcpIHNjb3BlLnN1bW1hcnlTaG93aW5nID0gIXNjb3BlLnN1bW1hcnlTaG93aW5nO1xuXHRcdFx0fTtcblxuXG5cdFx0XHRzY29wZS4kd2F0Y2goJ3N1aXRlcycsIGZ1bmN0aW9uKCl7XG5cdFx0XHRcdGlmKHNjb3BlLnN1aXRlcyl7XG5cdFx0XHRcdFx0dmFyIHN1aXRlc1NwZWNzID0gc2NvcGUuc3VpdGVzLm1hcChmdW5jdGlvbihlbCl7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZWwuc3BlY3M7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0c2NvcGUuc3BlY3NPdmVydmlldyA9IGZsYXR0ZW5SZW1vdmVEdXBlcyhzdWl0ZXNTcGVjcywgXCJpZFwiKTtcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhzY29wZS5zcGVjc092ZXJ2aWV3KTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cblx0XHR9XG5cdH07XG59KTtcblxuYXBwLmZhY3RvcnkoJ0phc21pbmVSZXBvcnRlcicsIGZ1bmN0aW9uKCl7XG5cdGZ1bmN0aW9uIGluaXRpYWxpemVKYXNtaW5lKCl7XG5cdFx0Lypcblx0XHRDb3B5cmlnaHQgKGMpIDIwMDgtMjAxNSBQaXZvdGFsIExhYnNcblxuXHRcdFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZ1xuXHRcdGEgY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuXHRcdFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuXHRcdHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcblx0XHRkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG9cblx0XHRwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG9cblx0XHR0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG5cblx0XHRUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZVxuXHRcdGluY2x1ZGVkIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuXG5cdFx0VEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCxcblx0XHRFWFBSRVNTIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcblx0XHRNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORFxuXHRcdE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkVcblx0XHRMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OXG5cdFx0T0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OXG5cdFx0V0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cdFx0Ki9cblx0XHQvKipcblx0XHQgU3RhcnRpbmcgd2l0aCB2ZXJzaW9uIDIuMCwgdGhpcyBmaWxlIFwiYm9vdHNcIiBKYXNtaW5lLCBwZXJmb3JtaW5nIGFsbCBvZiB0aGUgbmVjZXNzYXJ5IGluaXRpYWxpemF0aW9uIGJlZm9yZSBleGVjdXRpbmcgdGhlIGxvYWRlZCBlbnZpcm9ubWVudCBhbmQgYWxsIG9mIGEgcHJvamVjdCdzIHNwZWNzLiBUaGlzIGZpbGUgc2hvdWxkIGJlIGxvYWRlZCBhZnRlciBgamFzbWluZS5qc2AgYW5kIGBqYXNtaW5lX2h0bWwuanNgLCBidXQgYmVmb3JlIGFueSBwcm9qZWN0IHNvdXJjZSBmaWxlcyBvciBzcGVjIGZpbGVzIGFyZSBsb2FkZWQuIFRodXMgdGhpcyBmaWxlIGNhbiBhbHNvIGJlIHVzZWQgdG8gY3VzdG9taXplIEphc21pbmUgZm9yIGEgcHJvamVjdC5cblxuXHRcdCBJZiBhIHByb2plY3QgaXMgdXNpbmcgSmFzbWluZSB2aWEgdGhlIHN0YW5kYWxvbmUgZGlzdHJpYnV0aW9uLCB0aGlzIGZpbGUgY2FuIGJlIGN1c3RvbWl6ZWQgZGlyZWN0bHkuIElmIGEgcHJvamVjdCBpcyB1c2luZyBKYXNtaW5lIHZpYSB0aGUgW1J1YnkgZ2VtXVtqYXNtaW5lLWdlbV0sIHRoaXMgZmlsZSBjYW4gYmUgY29waWVkIGludG8gdGhlIHN1cHBvcnQgZGlyZWN0b3J5IHZpYSBgamFzbWluZSBjb3B5X2Jvb3RfanNgLiBPdGhlciBlbnZpcm9ubWVudHMgKGUuZy4sIFB5dGhvbikgd2lsbCBoYXZlIGRpZmZlcmVudCBtZWNoYW5pc21zLlxuXG5cdFx0IFRoZSBsb2NhdGlvbiBvZiBgYm9vdC5qc2AgY2FuIGJlIHNwZWNpZmllZCBhbmQvb3Igb3ZlcnJpZGRlbiBpbiBgamFzbWluZS55bWxgLlxuXG5cdFx0IFtqYXNtaW5lLWdlbV06IGh0dHA6Ly9naXRodWIuY29tL3Bpdm90YWwvamFzbWluZS1nZW1cblx0XHQgKi9cblxuXHRcdChmdW5jdGlvbigpIHtcblx0XHQgIC8qKlxuXHRcdCAgICogIyMgUmVxdWlyZSAmYW1wOyBJbnN0YW50aWF0ZVxuXHRcdCAgICpcblx0XHQgICAqIFJlcXVpcmUgSmFzbWluZSdzIGNvcmUgZmlsZXMuIFNwZWNpZmljYWxseSwgdGhpcyByZXF1aXJlcyBhbmQgYXR0YWNoZXMgYWxsIG9mIEphc21pbmUncyBjb2RlIHRvIHRoZSBgamFzbWluZWAgcmVmZXJlbmNlLlxuXHRcdCAgICovXG5cdFx0ICB3aW5kb3cuamFzbWluZSA9IGphc21pbmVSZXF1aXJlLmNvcmUoamFzbWluZVJlcXVpcmUpO1xuXG5cdFx0ICAvKipcblx0XHQgICAqIFNpbmNlIHRoaXMgaXMgYmVpbmcgcnVuIGluIGEgYnJvd3NlciBhbmQgdGhlIHJlc3VsdHMgc2hvdWxkIHBvcHVsYXRlIHRvIGFuIEhUTUwgcGFnZSwgcmVxdWlyZSB0aGUgSFRNTC1zcGVjaWZpYyBKYXNtaW5lIGNvZGUsIGluamVjdGluZyB0aGUgc2FtZSByZWZlcmVuY2UuXG5cdFx0ICAgKi9cblx0XHQgIGphc21pbmVSZXF1aXJlLmh0bWwoamFzbWluZSk7XG5cblx0XHQgIC8qKlxuXHRcdCAgICogQ3JlYXRlIHRoZSBKYXNtaW5lIGVudmlyb25tZW50LiBUaGlzIGlzIHVzZWQgdG8gcnVuIGFsbCBzcGVjcyBpbiBhIHByb2plY3QuXG5cdFx0ICAgKi9cblx0XHQgIHZhciBlbnYgPSBqYXNtaW5lLmdldEVudigpO1xuXG5cdFx0ICAvKipcblx0XHQgICAqICMjIFRoZSBHbG9iYWwgSW50ZXJmYWNlXG5cdFx0ICAgKlxuXHRcdCAgICogQnVpbGQgdXAgdGhlIGZ1bmN0aW9ucyB0aGF0IHdpbGwgYmUgZXhwb3NlZCBhcyB0aGUgSmFzbWluZSBwdWJsaWMgaW50ZXJmYWNlLiBBIHByb2plY3QgY2FuIGN1c3RvbWl6ZSwgcmVuYW1lIG9yIGFsaWFzIGFueSBvZiB0aGVzZSBmdW5jdGlvbnMgYXMgZGVzaXJlZCwgcHJvdmlkZWQgdGhlIGltcGxlbWVudGF0aW9uIHJlbWFpbnMgdW5jaGFuZ2VkLlxuXHRcdCAgICovXG5cdFx0ICB2YXIgamFzbWluZUludGVyZmFjZSA9IGphc21pbmVSZXF1aXJlLmludGVyZmFjZShqYXNtaW5lLCBlbnYpO1xuXG5cdFx0ICAvKipcblx0XHQgICAqIEFkZCBhbGwgb2YgdGhlIEphc21pbmUgZ2xvYmFsL3B1YmxpYyBpbnRlcmZhY2UgdG8gdGhlIGdsb2JhbCBzY29wZSwgc28gYSBwcm9qZWN0IGNhbiB1c2UgdGhlIHB1YmxpYyBpbnRlcmZhY2UgZGlyZWN0bHkuIEZvciBleGFtcGxlLCBjYWxsaW5nIGBkZXNjcmliZWAgaW4gc3BlY3MgaW5zdGVhZCBvZiBgamFzbWluZS5nZXRFbnYoKS5kZXNjcmliZWAuXG5cdFx0ICAgKi9cblx0XHQgIGV4dGVuZCh3aW5kb3csIGphc21pbmVJbnRlcmZhY2UpO1xuXG5cdFx0ICAvKipcblx0XHQgICAqICMjIFJ1bm5lciBQYXJhbWV0ZXJzXG5cdFx0ICAgKlxuXHRcdCAgICogTW9yZSBicm93c2VyIHNwZWNpZmljIGNvZGUgLSB3cmFwIHRoZSBxdWVyeSBzdHJpbmcgaW4gYW4gb2JqZWN0IGFuZCB0byBhbGxvdyBmb3IgZ2V0dGluZy9zZXR0aW5nIHBhcmFtZXRlcnMgZnJvbSB0aGUgcnVubmVyIHVzZXIgaW50ZXJmYWNlLlxuXHRcdCAgICovXG5cblx0XHQgIHZhciBxdWVyeVN0cmluZyA9IG5ldyBqYXNtaW5lLlF1ZXJ5U3RyaW5nKHtcblx0XHQgICAgZ2V0V2luZG93TG9jYXRpb246IGZ1bmN0aW9uKCkgeyByZXR1cm4gd2luZG93LmxvY2F0aW9uOyB9XG5cdFx0ICB9KTtcblxuXHRcdCAgdmFyIGNhdGNoaW5nRXhjZXB0aW9ucyA9IHF1ZXJ5U3RyaW5nLmdldFBhcmFtKFwiY2F0Y2hcIik7XG5cdFx0ICBlbnYuY2F0Y2hFeGNlcHRpb25zKHR5cGVvZiBjYXRjaGluZ0V4Y2VwdGlvbnMgPT09IFwidW5kZWZpbmVkXCIgPyB0cnVlIDogY2F0Y2hpbmdFeGNlcHRpb25zKTtcblxuXHRcdCAgdmFyIHRocm93aW5nRXhwZWN0YXRpb25GYWlsdXJlcyA9IHF1ZXJ5U3RyaW5nLmdldFBhcmFtKFwidGhyb3dGYWlsdXJlc1wiKTtcblx0XHQgIGVudi50aHJvd09uRXhwZWN0YXRpb25GYWlsdXJlKHRocm93aW5nRXhwZWN0YXRpb25GYWlsdXJlcyk7XG5cblx0XHQgIC8qKlxuXHRcdCAgICogVGhlIGBqc0FwaVJlcG9ydGVyYCBhbHNvIHJlY2VpdmVzIHNwZWMgcmVzdWx0cywgYW5kIGlzIHVzZWQgYnkgYW55IGVudmlyb25tZW50IHRoYXQgbmVlZHMgdG8gZXh0cmFjdCB0aGUgcmVzdWx0cyAgZnJvbSBKYXZhU2NyaXB0LlxuXHRcdCAgICovXG5cdFx0ICBlbnYuYWRkUmVwb3J0ZXIoamFzbWluZUludGVyZmFjZS5qc0FwaVJlcG9ydGVyKTtcblxuXHRcdCAgLyoqXG5cdFx0ICAgKiBGaWx0ZXIgd2hpY2ggc3BlY3Mgd2lsbCBiZSBydW4gYnkgbWF0Y2hpbmcgdGhlIHN0YXJ0IG9mIHRoZSBmdWxsIG5hbWUgYWdhaW5zdCB0aGUgYHNwZWNgIHF1ZXJ5IHBhcmFtLlxuXHRcdCAgICovXG5cdFx0ICB2YXIgc3BlY0ZpbHRlciA9IG5ldyBqYXNtaW5lLkh0bWxTcGVjRmlsdGVyKHtcblx0XHQgICAgZmlsdGVyU3RyaW5nOiBmdW5jdGlvbigpIHsgcmV0dXJuIHF1ZXJ5U3RyaW5nLmdldFBhcmFtKFwic3BlY1wiKTsgfVxuXHRcdCAgfSk7XG5cblx0XHQgIGVudi5zcGVjRmlsdGVyID0gZnVuY3Rpb24oc3BlYykge1xuXHRcdCAgICByZXR1cm4gc3BlY0ZpbHRlci5tYXRjaGVzKHNwZWMuZ2V0RnVsbE5hbWUoKSk7XG5cdFx0ICB9O1xuXG5cdFx0ICAvKipcblx0XHQgICAqIFNldHRpbmcgdXAgdGltaW5nIGZ1bmN0aW9ucyB0byBiZSBhYmxlIHRvIGJlIG92ZXJyaWRkZW4uIENlcnRhaW4gYnJvd3NlcnMgKFNhZmFyaSwgSUUgOCwgcGhhbnRvbWpzKSByZXF1aXJlIHRoaXMgaGFjay5cblx0XHQgICAqL1xuXHRcdCAgd2luZG93LnNldFRpbWVvdXQgPSB3aW5kb3cuc2V0VGltZW91dDtcblx0XHQgIHdpbmRvdy5zZXRJbnRlcnZhbCA9IHdpbmRvdy5zZXRJbnRlcnZhbDtcblx0XHQgIHdpbmRvdy5jbGVhclRpbWVvdXQgPSB3aW5kb3cuY2xlYXJUaW1lb3V0O1xuXHRcdCAgd2luZG93LmNsZWFySW50ZXJ2YWwgPSB3aW5kb3cuY2xlYXJJbnRlcnZhbDtcblxuXHRcdCAgLyoqXG5cdFx0ICAgKiAjIyBFeGVjdXRpb25cblx0XHQgICAqXG5cdFx0ICAgKiBSZXBsYWNlIHRoZSBicm93c2VyIHdpbmRvdydzIGBvbmxvYWRgLCBlbnN1cmUgaXQncyBjYWxsZWQsIGFuZCB0aGVuIHJ1biBhbGwgb2YgdGhlIGxvYWRlZCBzcGVjcy4gVGhpcyBpbmNsdWRlcyBpbml0aWFsaXppbmcgdGhlIGBIdG1sUmVwb3J0ZXJgIGluc3RhbmNlIGFuZCB0aGVuIGV4ZWN1dGluZyB0aGUgbG9hZGVkIEphc21pbmUgZW52aXJvbm1lbnQuIEFsbCBvZiB0aGlzIHdpbGwgaGFwcGVuIGFmdGVyIGFsbCBvZiB0aGUgc3BlY3MgYXJlIGxvYWRlZC5cblx0XHQgICAqL1xuXHRcdCAgdmFyIGN1cnJlbnRXaW5kb3dPbmxvYWQgPSB3aW5kb3cub25sb2FkO1xuXG5cdFx0ICAoZnVuY3Rpb24oKSB7XG5cdFx0ICAgIGlmIChjdXJyZW50V2luZG93T25sb2FkKSB7XG5cdFx0ICAgICAgY3VycmVudFdpbmRvd09ubG9hZCgpO1xuXHRcdCAgICB9XG5cdFx0ICAgIGVudi5leGVjdXRlKCk7XG5cdFx0ICB9KSgpO1xuXG5cdFx0ICAvKipcblx0XHQgICAqIEhlbHBlciBmdW5jdGlvbiBmb3IgcmVhZGFiaWxpdHkgYWJvdmUuXG5cdFx0ICAgKi9cblx0XHQgIGZ1bmN0aW9uIGV4dGVuZChkZXN0aW5hdGlvbiwgc291cmNlKSB7XG5cdFx0ICAgIGZvciAodmFyIHByb3BlcnR5IGluIHNvdXJjZSkgZGVzdGluYXRpb25bcHJvcGVydHldID0gc291cmNlW3Byb3BlcnR5XTtcblx0XHQgICAgcmV0dXJuIGRlc3RpbmF0aW9uO1xuXHRcdCAgfVxuXG5cdFx0fSkoKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGFkZFJlcG9ydGVyKHNjb3BlKXtcblx0XHR2YXIgc3VpdGVzID0gW107XG5cdFx0dmFyIGN1cnJlbnRTdWl0ZSA9IHt9O1xuXG5cdFx0ZnVuY3Rpb24gU3VpdGUob2JqKXtcblx0XHRcdHRoaXMuaWQgPSBvYmouaWQ7XG5cdFx0XHR0aGlzLmRlc2NyaXB0aW9uID0gb2JqLmRlc2NyaXB0aW9uO1xuXHRcdFx0dGhpcy5mdWxsTmFtZSA9IG9iai5mdWxsTmFtZTtcblx0XHRcdHRoaXMuZmFpbGVkRXhwZWN0YXRpb25zID0gb2JqLmZhaWxlZEV4cGVjdGF0aW9ucztcblx0XHRcdHRoaXMuc3RhdHVzID0gb2JqLmZpbmlzaGVkO1xuXHRcdFx0dGhpcy5zcGVjcyA9IFtdO1xuXHRcdH1cblxuXHRcdHZhciBteVJlcG9ydGVyID0ge1xuXG5cdFx0XHRqYXNtaW5lU3RhcnRlZDogZnVuY3Rpb24ob3B0aW9ucyl7XG5cdFx0XHRcdHN1aXRlcyA9IFtdO1xuXHRcdFx0fSxcblx0XHRcdHN1aXRlU3RhcnRlZDogZnVuY3Rpb24oc3VpdGUpe1xuXHRcdFx0XHRjdXJyZW50U3VpdGUgPSBuZXcgU3VpdGUoc3VpdGUpO1xuXHRcdFx0fSxcblx0XHRcdHNwZWNTdGFydGVkOiBmdW5jdGlvbihzcGVjKXtcblx0XHRcdFx0c2NvcGUuc3BlY1N0YXJ0ZWQgPSBzcGVjO1xuXHRcdFx0fSxcblx0XHRcdHNwZWNEb25lOiBmdW5jdGlvbihzcGVjKXtcblx0XHRcdFx0Y3VycmVudFN1aXRlLnNwZWNzLnB1c2goc3BlYyk7XG5cdFx0XHR9LFxuXHRcdFx0c3VpdGVEb25lOiBmdW5jdGlvbihzdWl0ZSl7XG5cdFx0XHRcdHN1aXRlcy5wdXNoKGN1cnJlbnRTdWl0ZSk7XG5cdFx0XHR9LFxuXHRcdFx0amFzbWluZURvbmU6IGZ1bmN0aW9uKCl7XG5cdFx0XHRcdHNjb3BlLnN1aXRlcyA9IHN1aXRlcztcblx0XHRcdH1cblx0XHR9O1xuXG5cdFx0d2luZG93Lmphc21pbmUuZ2V0RW52KCkuYWRkUmVwb3J0ZXIobXlSZXBvcnRlcik7XG5cdH1cblxuXHRyZXR1cm4ge1xuXHRcdGluaXRpYWxpemVKYXNtaW5lIDogaW5pdGlhbGl6ZUphc21pbmUsXG5cdFx0YWRkUmVwb3J0ZXI6IGFkZFJlcG9ydGVyXG5cdH07XG59KTsiLCJhcHAuZGlyZWN0aXZlKCdqc2xvYWQnLCBmdW5jdGlvbigpe1xuXHRmdW5jdGlvbiB1cGRhdGVTY3JpcHQoZWxlbWVudCwgdGV4dCl7XG5cdFx0ZWxlbWVudC5lbXB0eSgpO1xuXHRcdHZhciBzY3JpcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcblx0XHRzY3JpcHQudHlwZSA9ICd0ZXh0L2phdmFzY3JpcHQnO1xuXHRcdHNjcmlwdC5pbm5lckhUTUwgPSB0ZXh0O1xuXHRcdGVsZW1lbnQuYXBwZW5kKHNjcmlwdCk7XG5cdH1cblx0cmV0dXJuIHtcblx0XHRyZXN0cmljdCA6ICdFJyxcblx0XHRzY29wZSA6IHtcblx0XHRcdHRleHQgOiAnPSdcblx0XHR9LFxuXHRcdGxpbmsgOiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cmlidXRlcyl7XG5cdFx0XHRzY29wZS4kd2F0Y2goJ3RleHQnLCBmdW5jdGlvbih0ZXh0KXtcblx0XHRcdFx0dXBkYXRlU2NyaXB0KGVsZW1lbnQsIHRleHQpO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHR9O1xufSk7XG5cbiIsImFwcC5kaXJlY3RpdmUoJ3NoYXJlJyxmdW5jdGlvbihHaXN0RmFjdG9yeSwgJGlvbmljUG9wb3ZlciwgRnJpZW5kc0ZhY3Rvcnkpe1xuICAgcmV0dXJuIHtcbiAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgIHRlbXBsYXRlVXJsOidmZWF0dXJlcy9jb21tb24vZGlyZWN0aXZlcy9zaGFyZS9zaGFyZS5odG1sJyxcbiAgICAgICBsaW5rOiBmdW5jdGlvbigkc2NvcGUsIGVsZW1lbnQsIGF0dHJpYnV0ZXMpe1xuICAgICAgICAgICAvLyAuZnJvbVRlbXBsYXRlVXJsKCkgbWV0aG9kXG4gICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCRzY29wZS4pXG5cbiAgICAgICAgICAgLy9UT0RPOiBDbGVhbnVwIEdpc3RGYWN0b3J5LnNoYXJlR2lzdChjb2RlLCRzY29wZS5kYXRhLmZyaWVuZHMpLnRoZW4oZ2lzdFNoYXJlZCk7XG5cbiAgICAgICAgICAgRnJpZW5kc0ZhY3RvcnkuZ2V0RnJpZW5kcygpLnRoZW4oYWRkRnJpZW5kcyk7XG4gICAgICAgICAgICRzY29wZS5kYXRhID0gW107XG4gICAgICAgICAgICRzY29wZS5pc0NoZWNrZWQgPSBbXTtcbiAgICAgICAgICAgZnVuY3Rpb24gYWRkRnJpZW5kcyhyZXNwb25zZSl7XG4gICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdhZGRGcmllbmRzJyxyZXNwb25zZS5kYXRhLmZyaWVuZHMpO1xuICAgICAgICAgICAgICAgJHNjb3BlLmRhdGEuZnJpZW5kcyA9IHJlc3BvbnNlLmRhdGEuZnJpZW5kcztcbiAgICAgICAgICAgfTtcblxuICAgICAgICAgICB2YXIgY29kZVRvU2VuZCA9IG51bGw7XG4gICAgICAgICAgIC8vJHNjb3BlLiR3YXRjaCgnaXNDaGVja2VkJyxmdW5jdGlvbigpe1xuICAgICAgICAgICAvL1x0Y29uc29sZS5sb2coJHNjb3BlLmlzQ2hlY2tlZCk7XG4gICAgICAgICAgIC8vfSk7XG4gICAgICAgICAgIC8vVE9ETzogQ29uZmlybSB0aGF0IHRoaXMgaXMgd29ya2luZyBpbiBhbGwgc2NlbmFyaW9zXG4gICAgICAgICAgICRzY29wZS5zZW5kID0gZnVuY3Rpb24oY29kZSl7XG4gICAgICAgICAgICAgICBjb25zb2xlLmxvZygnIUA/IUAjJyxjb2RlLnRleHQpO1xuICAgICAgICAgICAgICAgR2lzdEZhY3Rvcnkuc2hhcmVHaXN0KGNvZGUudGV4dCxPYmplY3Qua2V5cygkc2NvcGUuaXNDaGVja2VkKSkudGhlbihnaXN0U2hhcmVkKTtcbiAgICAgICAgICAgfTtcblxuICAgICAgICAgICAkaW9uaWNQb3BvdmVyLmZyb21UZW1wbGF0ZVVybCgnZmVhdHVyZXMvY29tbW9uL2RpcmVjdGl2ZXMvc2hhcmUvZnJpZW5kcy5odG1sJywge1xuICAgICAgICAgICAgICAgc2NvcGU6ICRzY29wZVxuICAgICAgICAgICB9KS50aGVuKGZ1bmN0aW9uKHBvcG92ZXIpIHtcbiAgICAgICAgICAgICAgICRzY29wZS5wb3BvdmVyID0gcG9wb3ZlcjtcbiAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgJHNjb3BlLm9wZW5Qb3BvdmVyID0gZnVuY3Rpb24oJGV2ZW50KSB7XG4gICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdvcGVuUG9wb3ZlcicsY29kZSk7XG4gICAgICAgICAgICAgICAvL2NvZGVUb1NlbmQgPSBjb2RlO1xuICAgICAgICAgICAgICAgJHNjb3BlLnBvcG92ZXIuc2hvdygkZXZlbnQpO1xuICAgICAgICAgICB9O1xuICAgICAgICAgICAkc2NvcGUuY2xvc2VQb3BvdmVyID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAkc2NvcGUucG9wb3Zlci5oaWRlKCk7XG4gICAgICAgICAgIH07XG4gICAgICAgICAgIC8vQ2xlYW51cCB0aGUgcG9wb3ZlciB3aGVuIHdlJ3JlIGRvbmUgd2l0aCBpdCFcbiAgICAgICAgICAgJHNjb3BlLiRvbignJGRlc3Ryb3knLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICRzY29wZS5wb3BvdmVyLnJlbW92ZSgpO1xuICAgICAgICAgICB9KTtcbiAgICAgICAgICAgLy8gRXhlY3V0ZSBhY3Rpb24gb24gaGlkZSBwb3BvdmVyXG4gICAgICAgICAgICRzY29wZS4kb24oJ3BvcG92ZXIuaGlkZGVuJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAvLyBFeGVjdXRlIGFjdGlvblxuICAgICAgICAgICB9KTtcbiAgICAgICAgICAgLy8gRXhlY3V0ZSBhY3Rpb24gb24gcmVtb3ZlIHBvcG92ZXJcbiAgICAgICAgICAgJHNjb3BlLiRvbigncG9wb3Zlci5yZW1vdmVkJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAvLyBFeGVjdXRlIGFjdGlvblxuICAgICAgICAgICB9KTtcbiAgICAgICAgICAgLy99O1xuICAgICAgICAgICBnaXN0U2hhcmVkID0gZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2dpc3Qgc2hhcmVkJyxyZXNwb25zZSk7XG4gICAgICAgICAgICAgICAkc2NvcGUuY2xvc2VQb3BvdmVyKCk7XG4gICAgICAgICAgIH07XG4gICAgICAgfVxuICAgfVxufSk7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=