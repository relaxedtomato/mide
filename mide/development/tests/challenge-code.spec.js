console.log('Testing Challenge View');

describe('ChallengeCodeCtrl', function(){
    var $scope, controller;

    // load the controller's module
    beforeEach(function(){
        module('mide');

        inject(function($rootScope,$controller){
            $scope = $rootScope.$new();

            controller = $controller('ChallengeCodeCtrl',{$scope:$scope});
        });


    });

    xit('should have text editor', function(){
        //TODO: write a spec
    });

    xit('challenge should have description', function(){
        //TODO: test for description
    });

});