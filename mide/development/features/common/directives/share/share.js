app.directive('share',function(){
   return {
       restrict: 'A',
       scope : {
           code : '='
       },
       template: '<button class='button button-balanced' ng-click='share(code)'> SHARE  </button>',
       link: function(scope, element, attributes){

       }
   }
});