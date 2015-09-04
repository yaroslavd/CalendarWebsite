'use strict';

angular.module('indexApp')
  .controller('calendarServiceController', ['$scope', 'apigClientService', 'location',
                                         function ($scope, apigClientService, location) {
    var vm = this;
    vm.trainers = null;
    $scope.selectedTrainer = null;
    
    apigClientService.then(listTrainers);
    
    function listTrainers(apigClient) {
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
        .then(vm.processTrainersGetResult);
    }
    
    vm.processTrainersGetResult = function(result) {
      $scope.$apply(vm.trainers = result.data.trainers);
    }
    
    vm.trainerSelected = function() {
      console.log("Trainer selected: " + $scope.selectedTrainer);
      apigClientService.then(listFreeSlots);
    }
    
    function listFreeSlots(apigClient) {
      console.log("Listing free slots for trainer: " + $scope.selectedTrainer);
      var params = {
          location: location,
          trainerId: $scope.selectedTrainer,
          queryIntervalStart: "2015-09-01T16:00:00Z",
          queryIntervalEnd: "2015-10-01T18:00:00Z"
        };
      
      var body = {
      };
      
      var additionalParams = {
          headers: {
            'Content-Type': 'application/json'
          }
        };
      
      apigClient.trainersTrainerIdFreeslotsGet(params, body, additionalParams)
        .then(vm.processTrainersTrainerIdFreeslotsGet);
    }
    
    vm.processTrainersTrainerIdFreeslotsGet = function(result) {
      console.log('free slots processed');
      console.log(result);
    }
    
    return vm;
  }]);