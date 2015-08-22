'use strict';

angular.module('indexApp')
  .factory('googleService', ['$window', '$q', function ($window, $q) {
    console.log('googleService loaded');
    
    var googleLoginResults = $q.defer();
    
    function onSignIn(googleUser) {
      var profile = googleUser.getBasicProfile();

      var id_token = googleUser.getAuthResponse().id_token;
      
      googleLoginResults.resolve({
        name: profile.getName(),
        idToken: id_token
      });
    }
    
    $window.onSignIn = onSignIn;
    
    return googleLoginResults.promise;
  }]);