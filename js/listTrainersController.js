'use strict';

angular.module('indexApp')
  .controller('listTrainersController', ['$scope', 'cognitoService', function ($scope, cognitoService) {
    var vm = this;
    
    cognitoService.then(setCredentials);
    
    function setCredentials(cognitoResults) {
      vm.credentials = cognitoResults;
    }
  }]);