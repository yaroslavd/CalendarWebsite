'use strict';

angular.module('indexApp')
  .controller('listTrainersController', ['$scope', 'apigClientService', 'location',
                                         function ($scope, apigClientService, location) {
    var vm = this;
    
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
        .then(function(result){
          vm.trainers = result.data.trainers;
        });
    }
  }]);