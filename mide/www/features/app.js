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
  url : '/api'
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js

  // if none of the above states are matched, use this as the fallback
  //$urlRouterProvider.otherwise('/tab/chats');
  $urlRouterProvider.otherwise('/signup');
});
app.config(function($stateProvider){
	// Each tab has its own nav history stack:
	$stateProvider.state('tab.account', {
		url: '/account',
	    views: {
	    	'tab-account': {
	    		templateUrl: 'features/account/account.html',
				controller: 'AccountCtrl'
			}
	    }
	});
});

app.controller('AccountCtrl', function($scope) {
	$scope.settings = {
		enableFriends: true
	};
});
app.config(function($stateProvider){
	$stateProvider.state('tab.challenge', {
		url: '/challenge',
		views: {
			'challenge' : {
				templateUrl: 'features/challenge/challenge.html',
				controller: 'ChallengeCtrl'
			}
		},
		resolve : {
			challenge : function(ChallengeFactory, $state){
				return ChallengeFactory.getChallenge().catch(function(err){
					$state.go('tab.account');
				});
			}
		}
	});
});

app.controller('ChallengeCtrl', function($scope, ChallengeFactory, challenge){
	$scope.buttons = {
		submit : 'Submit',
		test : 'Test',
		dismiss : 'Dismiss'
	};

	$scope.challenge = challenge;

	$scope.submitChallenge = function(){
		ChallengeFactory.submitChallenge().then(function(response){
			console.log('this is the response data', response);
			return response.data;
		}).catch(function(err){
			console.error(JSON.stringify(err));
		});
	};

	$scope.testChallenge = function(){
		ChallengeFactory.testChallenge().then(function(response){
			console.log('this is the response data', response);
			return response.data;
		}).catch(function(err){
			console.error(JSON.stringify(err));
		});
	};

});

app.factory('ChallengeFactory', function($http, ApiEndpoint){
	return {
		getChallenge : function(){
			return $http.get(ApiEndpoint.url + '/challenge').then(function(response){
				return response.data;
			});
		},
		submitChallenge : function(){
			return $http.post(ApiEndpoint.url + '/challenge/submit').then(function(response){
				return response.data;
			});
		},
		testChallenge : function(){
			return $http.post(ApiEndpoint.url + '/challenge/test/').then(function(response){
				return response.data;
			});
		}
	};
});
app.config(function($stateProvider){

  $stateProvider.state('tab.chats', {
      url: '/chats',
      views: {
        'tab-chats': {
          templateUrl: 'features/chats/tab-chats.html',
          controller: 'ChatsCtrl'
        }
      }
    })
    .state('tab.chat-detail', {
      url: '/chats/:chatId',
      views: {
        'tab-chats': {
          templateUrl: 'features/chats/chat-detail.html',
          controller: 'ChatDetailCtrl'
        }
      }
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
  $stateProvider.state('login',{
      url:"/login",
      templateUrl: "features/login/login.html"
  });
});
app.config(function($stateProvider){
    $stateProvider.state('signup',{
        url:"/signup",
        templateUrl: "features/signup/signup.html",
        controller: 'SignUpCtrl'
    });
});

app.controller('SignUpCtrl',function($scope, SignUpFactory){
    $scope.data = {};

    $scope.signup = function(){
        SignUpFactory.postSignup($scope.data).then(function(response){
            console.log(JSON.stringify(response));
        }).catch(function(err){
            console.error(JSON.stringify(err));
        });
    };

});

app.factory('SignUpFactory',function($http, ApiEndpoint){
    return{
        postSignup: function(userdata){
            console.log(JSON.stringify(userdata));
            return $http.post(ApiEndpoint.url+"/user/signup", userdata)
            //TODO: Send correct url, send status 200 for now
        }
    }
});

//TODO: Form Validation

//NEXT: Sending data to the back-end and setting up routes
//Mongoose

app.config(function($stateProvider){

  	// setup an abstract state for the tabs directive
    $stateProvider.state('tab', {
	    url: "/tab",
	    abstract: true,
	    templateUrl: "features/common/tabs/tabs.html"
	});
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImFjY291bnQvYWNjb3VudC5qcyIsImNoYWxsZW5nZS9jaGFsbGVuZ2UuanMiLCJjaGF0cy9jaGF0cy5qcyIsImxvZ2luL2xvZ2luLmpzIiwic2lnbnVwL3NpZ251cC5qcyIsIndlbGNvbWUvd2VsY29tZS5qcyIsImNvbW1vbi90YWJzL3RhYnMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbENBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIElvbmljIFN0YXJ0ZXIgQXBwXG5cbi8vIGFuZ3VsYXIubW9kdWxlIGlzIGEgZ2xvYmFsIHBsYWNlIGZvciBjcmVhdGluZywgcmVnaXN0ZXJpbmcgYW5kIHJldHJpZXZpbmcgQW5ndWxhciBtb2R1bGVzXG4vLyAnc3RhcnRlcicgaXMgdGhlIG5hbWUgb2YgdGhpcyBhbmd1bGFyIG1vZHVsZSBleGFtcGxlIChhbHNvIHNldCBpbiBhIDxib2R5PiBhdHRyaWJ1dGUgaW4gaW5kZXguaHRtbClcbi8vIHRoZSAybmQgcGFyYW1ldGVyIGlzIGFuIGFycmF5IG9mICdyZXF1aXJlcydcbi8vICdzdGFydGVyLnNlcnZpY2VzJyBpcyBmb3VuZCBpbiBzZXJ2aWNlcy5qc1xuLy8gJ3N0YXJ0ZXIuY29udHJvbGxlcnMnIGlzIGZvdW5kIGluIGNvbnRyb2xsZXJzLmpzXG52YXIgYXBwID0gYW5ndWxhci5tb2R1bGUoJ21pZGUnLCBbJ2lvbmljJ10pXG5cbi5ydW4oZnVuY3Rpb24oJGlvbmljUGxhdGZvcm0pIHtcbiAgJGlvbmljUGxhdGZvcm0ucmVhZHkoZnVuY3Rpb24oKSB7XG4gICAgLy8gSGlkZSB0aGUgYWNjZXNzb3J5IGJhciBieSBkZWZhdWx0IChyZW1vdmUgdGhpcyB0byBzaG93IHRoZSBhY2Nlc3NvcnkgYmFyIGFib3ZlIHRoZSBrZXlib2FyZFxuICAgIC8vIGZvciBmb3JtIGlucHV0cylcbiAgICBpZiAod2luZG93LmNvcmRvdmEgJiYgd2luZG93LmNvcmRvdmEucGx1Z2lucyAmJiB3aW5kb3cuY29yZG92YS5wbHVnaW5zLktleWJvYXJkKSB7XG4gICAgICBjb3Jkb3ZhLnBsdWdpbnMuS2V5Ym9hcmQuaGlkZUtleWJvYXJkQWNjZXNzb3J5QmFyKHRydWUpO1xuICAgIH1cbiAgICBpZiAod2luZG93LlN0YXR1c0Jhcikge1xuICAgICAgLy8gb3JnLmFwYWNoZS5jb3Jkb3ZhLnN0YXR1c2JhciByZXF1aXJlZFxuICAgICAgU3RhdHVzQmFyLnN0eWxlTGlnaHRDb250ZW50KCk7XG4gICAgfVxuICB9KTtcbn0pXG5cbi8vVE9ETzpUaGlzIGlzIG5lZWRlZCB0byBzZXQgdG8gYWNjZXNzIHRoZSBwcm94eSB1cmwgdGhhdCB3aWxsIHRoZW4gaW4gdGhlIGlvbmljLnByb2plY3QgZmlsZSByZWRpcmVjdCBpdCB0byB0aGUgY29ycmVjdCBVUkxcbi5jb25zdGFudCgnQXBpRW5kcG9pbnQnLCB7XG4gIHVybCA6ICcvYXBpJ1xufSlcblxuLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyKSB7XG5cbiAgLy8gSW9uaWMgdXNlcyBBbmd1bGFyVUkgUm91dGVyIHdoaWNoIHVzZXMgdGhlIGNvbmNlcHQgb2Ygc3RhdGVzXG4gIC8vIExlYXJuIG1vcmUgaGVyZTogaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXItdWkvdWktcm91dGVyXG4gIC8vIFNldCB1cCB0aGUgdmFyaW91cyBzdGF0ZXMgd2hpY2ggdGhlIGFwcCBjYW4gYmUgaW4uXG4gIC8vIEVhY2ggc3RhdGUncyBjb250cm9sbGVyIGNhbiBiZSBmb3VuZCBpbiBjb250cm9sbGVycy5qc1xuXG4gIC8vIGlmIG5vbmUgb2YgdGhlIGFib3ZlIHN0YXRlcyBhcmUgbWF0Y2hlZCwgdXNlIHRoaXMgYXMgdGhlIGZhbGxiYWNrXG4gIC8vJHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZSgnL3RhYi9jaGF0cycpO1xuICAkdXJsUm91dGVyUHJvdmlkZXIub3RoZXJ3aXNlKCcvc2lnbnVwJyk7XG59KTsiLCJhcHAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKXtcblx0Ly8gRWFjaCB0YWIgaGFzIGl0cyBvd24gbmF2IGhpc3Rvcnkgc3RhY2s6XG5cdCRzdGF0ZVByb3ZpZGVyLnN0YXRlKCd0YWIuYWNjb3VudCcsIHtcblx0XHR1cmw6ICcvYWNjb3VudCcsXG5cdCAgICB2aWV3czoge1xuXHQgICAgXHQndGFiLWFjY291bnQnOiB7XG5cdCAgICBcdFx0dGVtcGxhdGVVcmw6ICdmZWF0dXJlcy9hY2NvdW50L2FjY291bnQuaHRtbCcsXG5cdFx0XHRcdGNvbnRyb2xsZXI6ICdBY2NvdW50Q3RybCdcblx0XHRcdH1cblx0ICAgIH1cblx0fSk7XG59KTtcblxuYXBwLmNvbnRyb2xsZXIoJ0FjY291bnRDdHJsJywgZnVuY3Rpb24oJHNjb3BlKSB7XG5cdCRzY29wZS5zZXR0aW5ncyA9IHtcblx0XHRlbmFibGVGcmllbmRzOiB0cnVlXG5cdH07XG59KTsiLCJhcHAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKXtcblx0JHN0YXRlUHJvdmlkZXIuc3RhdGUoJ3RhYi5jaGFsbGVuZ2UnLCB7XG5cdFx0dXJsOiAnL2NoYWxsZW5nZScsXG5cdFx0dmlld3M6IHtcblx0XHRcdCdjaGFsbGVuZ2UnIDoge1xuXHRcdFx0XHR0ZW1wbGF0ZVVybDogJ2ZlYXR1cmVzL2NoYWxsZW5nZS9jaGFsbGVuZ2UuaHRtbCcsXG5cdFx0XHRcdGNvbnRyb2xsZXI6ICdDaGFsbGVuZ2VDdHJsJ1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0cmVzb2x2ZSA6IHtcblx0XHRcdGNoYWxsZW5nZSA6IGZ1bmN0aW9uKENoYWxsZW5nZUZhY3RvcnksICRzdGF0ZSl7XG5cdFx0XHRcdHJldHVybiBDaGFsbGVuZ2VGYWN0b3J5LmdldENoYWxsZW5nZSgpLmNhdGNoKGZ1bmN0aW9uKGVycil7XG5cdFx0XHRcdFx0JHN0YXRlLmdvKCd0YWIuYWNjb3VudCcpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9XG5cdH0pO1xufSk7XG5cbmFwcC5jb250cm9sbGVyKCdDaGFsbGVuZ2VDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBDaGFsbGVuZ2VGYWN0b3J5LCBjaGFsbGVuZ2Upe1xuXHQkc2NvcGUuYnV0dG9ucyA9IHtcblx0XHRzdWJtaXQgOiAnU3VibWl0Jyxcblx0XHR0ZXN0IDogJ1Rlc3QnLFxuXHRcdGRpc21pc3MgOiAnRGlzbWlzcydcblx0fTtcblxuXHQkc2NvcGUuY2hhbGxlbmdlID0gY2hhbGxlbmdlO1xuXG5cdCRzY29wZS5zdWJtaXRDaGFsbGVuZ2UgPSBmdW5jdGlvbigpe1xuXHRcdENoYWxsZW5nZUZhY3Rvcnkuc3VibWl0Q2hhbGxlbmdlKCkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG5cdFx0XHRjb25zb2xlLmxvZygndGhpcyBpcyB0aGUgcmVzcG9uc2UgZGF0YScsIHJlc3BvbnNlKTtcblx0XHRcdHJldHVybiByZXNwb25zZS5kYXRhO1xuXHRcdH0pLmNhdGNoKGZ1bmN0aW9uKGVycil7XG5cdFx0XHRjb25zb2xlLmVycm9yKEpTT04uc3RyaW5naWZ5KGVycikpO1xuXHRcdH0pO1xuXHR9O1xuXG5cdCRzY29wZS50ZXN0Q2hhbGxlbmdlID0gZnVuY3Rpb24oKXtcblx0XHRDaGFsbGVuZ2VGYWN0b3J5LnRlc3RDaGFsbGVuZ2UoKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcblx0XHRcdGNvbnNvbGUubG9nKCd0aGlzIGlzIHRoZSByZXNwb25zZSBkYXRhJywgcmVzcG9uc2UpO1xuXHRcdFx0cmV0dXJuIHJlc3BvbnNlLmRhdGE7XG5cdFx0fSkuY2F0Y2goZnVuY3Rpb24oZXJyKXtcblx0XHRcdGNvbnNvbGUuZXJyb3IoSlNPTi5zdHJpbmdpZnkoZXJyKSk7XG5cdFx0fSk7XG5cdH07XG5cbn0pO1xuXG5hcHAuZmFjdG9yeSgnQ2hhbGxlbmdlRmFjdG9yeScsIGZ1bmN0aW9uKCRodHRwLCBBcGlFbmRwb2ludCl7XG5cdHJldHVybiB7XG5cdFx0Z2V0Q2hhbGxlbmdlIDogZnVuY3Rpb24oKXtcblx0XHRcdHJldHVybiAkaHR0cC5nZXQoQXBpRW5kcG9pbnQudXJsICsgJy9jaGFsbGVuZ2UnKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcblx0XHRcdFx0cmV0dXJuIHJlc3BvbnNlLmRhdGE7XG5cdFx0XHR9KTtcblx0XHR9LFxuXHRcdHN1Ym1pdENoYWxsZW5nZSA6IGZ1bmN0aW9uKCl7XG5cdFx0XHRyZXR1cm4gJGh0dHAucG9zdChBcGlFbmRwb2ludC51cmwgKyAnL2NoYWxsZW5nZS9zdWJtaXQnKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcblx0XHRcdFx0cmV0dXJuIHJlc3BvbnNlLmRhdGE7XG5cdFx0XHR9KTtcblx0XHR9LFxuXHRcdHRlc3RDaGFsbGVuZ2UgOiBmdW5jdGlvbigpe1xuXHRcdFx0cmV0dXJuICRodHRwLnBvc3QoQXBpRW5kcG9pbnQudXJsICsgJy9jaGFsbGVuZ2UvdGVzdC8nKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcblx0XHRcdFx0cmV0dXJuIHJlc3BvbnNlLmRhdGE7XG5cdFx0XHR9KTtcblx0XHR9XG5cdH07XG59KTsiLCJhcHAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKXtcblxuICAkc3RhdGVQcm92aWRlci5zdGF0ZSgndGFiLmNoYXRzJywge1xuICAgICAgdXJsOiAnL2NoYXRzJyxcbiAgICAgIHZpZXdzOiB7XG4gICAgICAgICd0YWItY2hhdHMnOiB7XG4gICAgICAgICAgdGVtcGxhdGVVcmw6ICdmZWF0dXJlcy9jaGF0cy90YWItY2hhdHMuaHRtbCcsXG4gICAgICAgICAgY29udHJvbGxlcjogJ0NoYXRzQ3RybCdcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pXG4gICAgLnN0YXRlKCd0YWIuY2hhdC1kZXRhaWwnLCB7XG4gICAgICB1cmw6ICcvY2hhdHMvOmNoYXRJZCcsXG4gICAgICB2aWV3czoge1xuICAgICAgICAndGFiLWNoYXRzJzoge1xuICAgICAgICAgIHRlbXBsYXRlVXJsOiAnZmVhdHVyZXMvY2hhdHMvY2hhdC1kZXRhaWwuaHRtbCcsXG4gICAgICAgICAgY29udHJvbGxlcjogJ0NoYXREZXRhaWxDdHJsJ1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG59KTtcblxuYXBwLmNvbnRyb2xsZXIoJ0NoYXRzQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgQ2hhdHMpIHtcbiAgJHNjb3BlLmNoYXRzID0gQ2hhdHMuYWxsKCk7XG4gICRzY29wZS5yZW1vdmUgPSBmdW5jdGlvbihjaGF0KSB7XG4gICAgQ2hhdHMucmVtb3ZlKGNoYXQpO1xuICB9O1xufSk7XG5cbmFwcC5jb250cm9sbGVyKCdDaGF0RGV0YWlsQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgJHN0YXRlUGFyYW1zLCBDaGF0cykge1xuICAkc2NvcGUuY2hhdCA9IENoYXRzLmdldCgkc3RhdGVQYXJhbXMuY2hhdElkKTtcbn0pO1xuXG5hcHAuZmFjdG9yeSgnQ2hhdHMnLCBmdW5jdGlvbigpIHtcbiAgLy8gTWlnaHQgdXNlIGEgcmVzb3VyY2UgaGVyZSB0aGF0IHJldHVybnMgYSBKU09OIGFycmF5XG5cbiAgLy8gU29tZSBmYWtlIHRlc3RpbmcgZGF0YVxuICB2YXIgY2hhdHMgPSBbe1xuICAgIGlkOiAwLFxuICAgIG5hbWU6ICdCZW4gU3BhcnJvdycsXG4gICAgbGFzdFRleHQ6ICdZb3Ugb24geW91ciB3YXk/JyxcbiAgICBmYWNlOiAnaHR0cHM6Ly9wYnMudHdpbWcuY29tL3Byb2ZpbGVfaW1hZ2VzLzUxNDU0OTgxMTc2NTIxMTEzNi85U2dBdUhlWS5wbmcnXG4gIH0sIHtcbiAgICBpZDogMSxcbiAgICBuYW1lOiAnTWF4IEx5bngnLFxuICAgIGxhc3RUZXh0OiAnSGV5LCBpdFxcJ3Mgbm90IG1lJyxcbiAgICBmYWNlOiAnaHR0cHM6Ly9hdmF0YXJzMy5naXRodWJ1c2VyY29udGVudC5jb20vdS8xMTIxND92PTMmcz00NjAnXG4gIH0se1xuICAgIGlkOiAyLFxuICAgIG5hbWU6ICdBZGFtIEJyYWRsZXlzb24nLFxuICAgIGxhc3RUZXh0OiAnSSBzaG91bGQgYnV5IGEgYm9hdCcsXG4gICAgZmFjZTogJ2h0dHBzOi8vcGJzLnR3aW1nLmNvbS9wcm9maWxlX2ltYWdlcy80NzkwOTA3OTQwNTgzNzkyNjQvODRUS2pfcWEuanBlZydcbiAgfSwge1xuICAgIGlkOiAzLFxuICAgIG5hbWU6ICdQZXJyeSBHb3Zlcm5vcicsXG4gICAgbGFzdFRleHQ6ICdMb29rIGF0IG15IG11a2x1a3MhJyxcbiAgICBmYWNlOiAnaHR0cHM6Ly9wYnMudHdpbWcuY29tL3Byb2ZpbGVfaW1hZ2VzLzQ5MTk5NTM5ODEzNTc2NzA0MC9pZTJaX1Y2ZS5qcGVnJ1xuICB9LCB7XG4gICAgaWQ6IDQsXG4gICAgbmFtZTogJ01pa2UgSGFycmluZ3RvbicsXG4gICAgbGFzdFRleHQ6ICdUaGlzIGlzIHdpY2tlZCBnb29kIGljZSBjcmVhbS4nLFxuICAgIGZhY2U6ICdodHRwczovL3Bicy50d2ltZy5jb20vcHJvZmlsZV9pbWFnZXMvNTc4MjM3MjgxMzg0ODQxMjE2L1IzYWUxbjYxLnBuZydcbiAgfV07XG5cbiAgcmV0dXJuIHtcbiAgICBhbGw6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGNoYXRzO1xuICAgIH0sXG4gICAgcmVtb3ZlOiBmdW5jdGlvbihjaGF0KSB7XG4gICAgICBjaGF0cy5zcGxpY2UoY2hhdHMuaW5kZXhPZihjaGF0KSwgMSk7XG4gICAgfSxcbiAgICBnZXQ6IGZ1bmN0aW9uKGNoYXRJZCkge1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaGF0cy5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoY2hhdHNbaV0uaWQgPT09IHBhcnNlSW50KGNoYXRJZCkpIHtcbiAgICAgICAgICByZXR1cm4gY2hhdHNbaV07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgfTtcbn0pO1xuIiwiYXBwLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlcil7XG4gICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdsb2dpbicse1xuICAgICAgdXJsOlwiL2xvZ2luXCIsXG4gICAgICB0ZW1wbGF0ZVVybDogXCJmZWF0dXJlcy9sb2dpbi9sb2dpbi5odG1sXCJcbiAgfSk7XG59KTsiLCJhcHAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKXtcbiAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgnc2lnbnVwJyx7XG4gICAgICAgIHVybDpcIi9zaWdudXBcIixcbiAgICAgICAgdGVtcGxhdGVVcmw6IFwiZmVhdHVyZXMvc2lnbnVwL3NpZ251cC5odG1sXCIsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdTaWduVXBDdHJsJ1xuICAgIH0pO1xufSk7XG5cbmFwcC5jb250cm9sbGVyKCdTaWduVXBDdHJsJyxmdW5jdGlvbigkc2NvcGUsIFNpZ25VcEZhY3Rvcnkpe1xuICAgICRzY29wZS5kYXRhID0ge307XG5cbiAgICAkc2NvcGUuc2lnbnVwID0gZnVuY3Rpb24oKXtcbiAgICAgICAgU2lnblVwRmFjdG9yeS5wb3N0U2lnbnVwKCRzY29wZS5kYXRhKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKEpTT04uc3RyaW5naWZ5KHJlc3BvbnNlKSk7XG4gICAgICAgIH0pLmNhdGNoKGZ1bmN0aW9uKGVycil7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKEpTT04uc3RyaW5naWZ5KGVycikpO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG59KTtcblxuYXBwLmZhY3RvcnkoJ1NpZ25VcEZhY3RvcnknLGZ1bmN0aW9uKCRodHRwLCBBcGlFbmRwb2ludCl7XG4gICAgcmV0dXJue1xuICAgICAgICBwb3N0U2lnbnVwOiBmdW5jdGlvbih1c2VyZGF0YSl7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhKU09OLnN0cmluZ2lmeSh1c2VyZGF0YSkpO1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoQXBpRW5kcG9pbnQudXJsK1wiL3VzZXIvc2lnbnVwXCIsIHVzZXJkYXRhKVxuICAgICAgICAgICAgLy9UT0RPOiBTZW5kIGNvcnJlY3QgdXJsLCBzZW5kIHN0YXR1cyAyMDAgZm9yIG5vd1xuICAgICAgICB9XG4gICAgfVxufSk7XG5cbi8vVE9ETzogRm9ybSBWYWxpZGF0aW9uXG5cbi8vTkVYVDogU2VuZGluZyBkYXRhIHRvIHRoZSBiYWNrLWVuZCBhbmQgc2V0dGluZyB1cCByb3V0ZXNcbi8vTW9uZ29vc2UiLCIiLCJhcHAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKXtcblxuICBcdC8vIHNldHVwIGFuIGFic3RyYWN0IHN0YXRlIGZvciB0aGUgdGFicyBkaXJlY3RpdmVcbiAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgndGFiJywge1xuXHQgICAgdXJsOiBcIi90YWJcIixcblx0ICAgIGFic3RyYWN0OiB0cnVlLFxuXHQgICAgdGVtcGxhdGVVcmw6IFwiZmVhdHVyZXMvY29tbW9uL3RhYnMvdGFicy5odG1sXCJcblx0fSk7XG59KTsiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=