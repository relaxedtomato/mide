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
