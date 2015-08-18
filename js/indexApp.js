'use strict';

angular.module('indexApp', [ 'googleApi' ])
    .config(function(googleLoginProvider) {
      googleLoginProvider.configure({
        clientId : '187173892432-dnsafu5beq2j4qgggl8kf7serfca9umn.apps.googleusercontent.com',
        scopes : [ 'email' ]
      });
    })
  .controller('googleController', ['$scope', 'googleLogin', 'googlePlus', function ($scope, googleLogin, googlePlus) {
    $scope.login = function () {
        googleLogin.login()
          .then(function() {
            console.log("login success");
          }, function() {
            console.error("failed login");
          });
    };
    
    $scope.$on("google:authenticated", function(auth) {
      $scope.loggedIntoGoogle = true;
    });
    
    $scope.$on("googlePlus:loaded", function apiClientLoaded() {
      googlePlus.getCurrentUser().then(function(user) {
        $scope.clientName = user.name.givenName;
      });
    });
  }]);