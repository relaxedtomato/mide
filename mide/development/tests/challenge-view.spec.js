console.log('Testing Challenge View');

describe('ChallengeViewCtrl', function(){
    var $scope, controller;

    // load the controller's module
    beforeEach(function(){
        module('mide');

        inject(function($rootScope,$controller){
            $scope = $rootScope.$new();

            controller = $controller('ChallengeViewCtrl',{$scope:$scope});
        });


    });

    it('should have a challenge object defined', function(){
        expect($scope).to.exist;
        expect($scope.challenge.length).to.be.above(0);
        console.log("$scope.challenge.length", $scope.challenge.length);
    });

    xit('challenge should have description', function(){
        //TODO: test for description
    });

    xit('challenge should have test specs', function(){
        //TODO: test for existence of test specs
    });

});