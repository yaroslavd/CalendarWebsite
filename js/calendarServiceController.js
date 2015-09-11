'use strict';

angular.module('indexApp')
  .controller('calendarServiceController', ['$scope', 'apigClientService', 'location', 'intervalStartTime', 'intervalEndTime',
                                         function ($scope, apigClientService, location, intervalStartTime, intervalEndTime) {
    
    var vm = this;
    vm.trainers = null;
    $scope.selectedTrainer = null;
    vm.freeSlots = null;
    vm.selectedSlot = null;
    
    apigClientService.then(listTrainers);
    
    function listTrainers(apigClient) {
      var params = {
          location: location
        };
      
      var body = {
        };
      
      var additionalParams = {
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
          queryIntervalStart: intervalStartTime.format(),
          queryIntervalEnd: intervalEndTime.format()
        };
      
      var body = {
      };
      
      var additionalParams = {
        };
      
      apigClient.trainersTrainerIdFreeslotsGet(params, body, additionalParams)
        .then(vm.processTrainersTrainerIdFreeslotsGet);
    }
    
    vm.processTrainersTrainerIdFreeslotsGet = function(result) {
      console.log('free slots processed');
      console.log(result);
      
      vm.freeSlots = {};
      result.data.freeSlots.forEach(vm.processFreeSlot);
      ;
      $scope.$apply(console.log(vm.freeSlots));
    }
    
    vm.processFreeSlot = function(freeSlot) {
      var key = vm.freeSlotKey(freeSlot);
      if (vm.freeSlots[key] === undefined) {
        vm.freeSlots[key] = [];
      }
      vm.freeSlots[key].push(freeSlot);
    }
    
    vm.freeSlotKey = function(freeSlot) {
      var date = moment(freeSlot.year + "-" + freeSlot.month + "-" + freeSlot.day, "YYYY-MM-DD");
      return vm.renderDate(date);
    }
    
    vm.timeSlotRender = function(slot) {
      var slotStart = moment(slot.startHour + ":" + slot.startMinute, "HH:mm");
      var slotEnd = moment(slot.endHour + ":" + slot.endMinute, "HH:mm");
      
      return vm.renderTime(slotStart) + " - " + vm.renderTime(slotEnd);
    }
    
    vm.renderDate = function(moment) {
      return moment.format("dddd, MMMM Do, YYYY")
    }
    
    vm.renderTime = function(moment) {
      return moment.format("h:mma");
    }
    
    vm.bookSlot = function() {
      console.log('slot selected');
      console.log(vm.selectedSlot);
    }
    
    return vm;
  }]);