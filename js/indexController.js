angular.module('indexApp', [ 'directive.g+signin' ]).controller(
    'indexController',
    function($scope) {
      console.log('Controller loaded');

      $scope.$on('event:google-plus-signin-success',
          function(event, authResult) {
            gapi.client.load('plus', 'v1', apiClientLoaded)
          });

      function apiClientLoaded() {
        gapi.client.plus.people.get({
          userId : 'me'
        }).execute(handleResponse);
      }

      function handleResponse(resp) {
        console.log(resp);
      }
    });