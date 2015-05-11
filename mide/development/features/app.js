// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
var app = angular.module('mide', ['ionic', 'ui.ace'])

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
  //$urlRouterProvider.otherwise('/tab/chats');
  //$urlRouterProvider.otherwise('/signup'); // TODO: Richard testing this route
  //$urlRouterProvider.otherwise('/tab/challenge'); //TODO: Tony testing this route
    $urlRouterProvider.otherwise('welcome');
})
//
////TODO:Can you have more then one? .run

//app.run(function ($rootScope, AuthService, $state) {
//
//  var destinationStateRequiresAuth = function (state) {
//    console.log('destinationStateRequiresAuth','state',state,'state.data',state.data);
//    return state.data && state.data.authenticate;
//  };
//
//  // $stateChangeStart is an event fired
//  // whenever the process of changing a state begins.
//  $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
//
//    if (!destinationStateRequiresAuth(toState)) {
//      // The destination state does not require authentication
//      // Short circuit with return.
//      return;
//    }
//
//    if (AuthService.isAuthenticated()) {
//      // The user is authenticated.
//      // Short circuit with return.
//      return;
//    }
//
//    //if you have a token, grab the user details, otherwise continue to the login state
//
//    // Cancel navigating to new state.
//    event.preventDefault();
//    //TODO: Fix INFINITE LOOP - the user is coming back as null, so server not responding properly
//    //TODO: Testing Issue: Deleting Local Storage breaks the app, this is a developer issue
//    AuthService.getLoggedInUser()
//        .then(function (user) {
//        // If a user is retrieved, then renavigate to the destination
//        // (the second time, AuthService.isAuthenticated() will work)
//        // otherwise, if no user is logged in, go to "login" state.
//          console.log('user',user, 'toState',toState.name,'toParams',toParams);
//          if (user) {
//            $state.go(toState.name, toParams);
//          } else {
//            $state.go('login');
//          }
//        });
//        //, function(rejected){
//        //  console.log('rejected', rejected);
//        //  $state.go('login');
//        //});
//  });
//});

//.run(function ($rootScope, $state, AuthService, AUTH_EVENTS) {
//  $rootScope.$on('$stateChangeStart', function (event,next, nextParams, fromState) {
//
//    if ('data' in next && 'authenticate' in next.data) {
//      var authenticate = next.data.authenticate;
//      if (!AuthService.isAuthorized(authenticate)) {
//        event.preventDefault();
//        $state.go($state.current, {}, {reload: true});
//        $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
//      }
//    }
//
//    if (!AuthService.isAuthenticated()) {
//      if (next.name !== 'login') {
//        event.preventDefault();
//        $state.go('login');
//      }
//    }
//  });
//});

.run(function ($rootScope, $state, AuthService, AUTH_EVENTS) {

    var destinationStateRequiresAuth = function (state) {
        //console.log('cl - destinationStateRequiresAuth','state.data',state.data,'state.data.auth',state.data.authenticate);
        return state.data && state.data.authenticate;
    };

    //TODO: Need to make authentication more robust
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
        //else {
        //    $state.go('login');
        //}


        //if ('data' in toState && 'authenticate' in toState.data) {
        //    var authenticate = toState.data.authenticate;
        //    if (!AuthService.isAuthenciated) {
        //        event.preventDefault();
        //        $state.go($state.current, {}, {reload: true});
        //        $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
        //    } else if(Authserver.username) {
        //        $state.go(toState.name, toParams);
        //    }
        //}
        //if (!AuthService.isAuthenticated()) {
        //    if (toState.name !== 'login') {
        //        event.preventDefault();
        //        $state.go('login');
        //    }
        //} else {
        //    $state.go(toState.name,toParams);
        //}

        //if (AuthService.isAuthenticated()) {
        //    $state.go(toState.name, toParams);
        //} else {
        $state.go('login'); //if above fails, goto login
        //}
    });
})