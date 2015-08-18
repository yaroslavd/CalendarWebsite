'use strict';

angular.module('indexApp', [ 'googleApi' ])
    .config(function(googleLoginProvider) {
      googleLoginProvider.configure({
        clientId : '187173892432-dnsafu5beq2j4qgggl8kf7serfca9umn.apps.googleusercontent.com',
        scopes : [ 'email' ]
      });
    })
  .controller('indexController', function($scope, googleLogin) {
    console.log('Controller loaded');

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
      gapi.client.load('plus', 'v1', apiClientLoaded);
    });
    
    function apiClientLoaded() {
      gapi.client.plus.people.get({
        userId : 'me'
      }).execute(handleResponse);
    }

    function handleResponse(resp) {
      console.log(resp);
      $scope.clientName = resp.displayName;
      $scope.$apply();
    }
  }
);