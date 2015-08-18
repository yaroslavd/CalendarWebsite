'use strict';

angular.module('indexApp')
  .controller('googleController', ['$scope', 'googleLogin', 'googlePlus', function ($scope, googleLogin, googlePlus) {
    var vm = this;
    
    console.log('controllerLoaded');
    vm.login = function () {
        googleLogin.login()
          .then(function() {
            console.log("login success");
          }, function() {
            console.error("failed login");
          });
    };
    
    $scope.$on("google:authenticated", function(auth) {
      vm.loggedIntoGoogle = true;
    });
    
    $scope.$on("googlePlus:loaded", function apiClientLoaded() {
      googlePlus.getCurrentUser().then(function(user) {
        vm.clientName = user.name.givenName;
      });
    });
  }]);