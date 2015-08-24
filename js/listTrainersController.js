'use strict';

angular.module('indexApp')
  .controller('listTrainersController', ['$scope', 'apigClientService', 'location',
                                         function ($scope, apigClientService, location) {
    var vm = this;
    vm.trainers = null;
    
    apigClientService.then(listTrainers);
    
    function listTrainers(apigClient) {
      console.log("apig Client");
      console.log(apigClient);
      var params = {
          location: location
        };
      
      var body = {
        };
      
      var additionalParams = {
          headers: {
            'Content-Type': 'application/json'
          }
        };
      
      apigClient.trainersGet(params, body, additionalParams)
        .then(processTrainersGetResult);
    }
    
    function processTrainersGetResult(result) {
      $scope.$apply(vm.trainers = result.data.trainers);
    }
  }]);