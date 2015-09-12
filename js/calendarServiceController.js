'use strict';

angular.module('indexApp')
  .controller('calendarServiceController', ['$scope', '$q', '$anchorScroll', '$location',
                                            'cognitoService', 'apigClientService', 'location', 'intervalStartTime', 'intervalEndTime',
                                         function ($scope, $q, $anchorScroll, $location,
                                             cognitoService, apigClientService, location, intervalStartTime, intervalEndTime) {
    
    var vm = this;
    
    vm.trainers = null;
    vm.freeSlots = null;
    vm.selectedSlot = null;
    
    vm.bookingSlot = false;
    vm.bookingSuccess = false;
    vm.bookingAttemptFinished = false;
    
    $scope.selectedTrainer = null;
    
    apigClientService.then(listTrainers);
    
    function listTrainers(apigClient) {
      var params = {
          location: location
      };
      
      var body = null;
      var additionalParams = {};
      
      apigClient.trainersGet(params, body, additionalParams)
        .then(vm.processTrainersGetResult);
    }
    
    vm.processTrainersGetResult = function(result) {
      $scope.$apply(vm.trainers = result.data.trainers);
    }
    
    vm.trainerSelected = function() {
      console.log("Trainer selected: " + $scope.selectedTrainer);
      vm.freeSlots = null;
      vm.bookingAttemptFinished = false;
      apigClientService.then(vm.listFreeSlots);
    }
    
    vm.listFreeSlots = function(apigClient) {
      console.log("Listing free slots for trainer: " + $scope.selectedTrainer);
      var params = {
          location: location,
          trainerId: $scope.selectedTrainer,
          queryIntervalStart: intervalStartTime.format(),
          queryIntervalEnd: intervalEndTime.format()
      };
      
      var body = null;
      var additionalParams = {};
      
      apigClient.trainersTrainerIdFreeslotsGet(params, body, additionalParams)
        .then(vm.processTrainersTrainerIdFreeslotsGet);
    }
    
    vm.processTrainersTrainerIdFreeslotsGet = function(result) {
      console.log('free slots processed');
      console.log(result);
      
      vm.freeSlots = {};
      result.data.freeSlots.forEach(vm.processFreeSlot);
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
      return moment.format("dddd, MMMM Do, YYYY");
    }
    
    vm.renderTime = function(moment) {
      return moment.format("h:mma");
    }
    
    vm.slotSelected = function() {
      vm.scrollToBookingButton();
    }
    
    vm.scrollToBookingButton = function() {
      $location.hash('bookButton');
      $anchorScroll();
    }
    
    vm.bookSlot = function() {
      console.log('slot selected');
      console.log(vm.selectedSlot);
      vm.bookingSlot = true;
      $q.all([cognitoService, apigClientService]).then(vm.processBookSlot);
    }
    
    vm.processBookSlot = function(values) {
      var cognitoResults = values[0];
      var apigClient = values[1];
      
      var toBook = JSON.parse(vm.selectedSlot);
      
      console.log('to book');
      console.log(toBook);
      
      var params = {
          location: location,
          trainerId: $scope.selectedTrainer,
          clientId: cognitoResults.IdentityId,
          year: toBook.year,
          month: toBook.month,
          day: toBook.day,
          slot: toBook.slotIndex
        };
      
      var body = null;
      var additionalParams = {};

      apigClient.trainersTrainerIdBookedslotsYearMonthDaySlotPost(params, body, additionalParams)
        .then(vm.bookedSuccessfully, vm.bookingFailed);
    }
    
    vm.bookedSuccessfully = function() {
      console.log('slot booked');
      $scope.$apply(vm.bookingSuccess = true);
      vm.bookingCompleted();
    }
    
    vm.bookingFailed = function() {
      console.log('booking failed');
      $scope.$apply(vm.bookingSuccess = false);
      vm.bookingCompleted();
    }
    
    vm.bookingCompleted = function() {
      $scope.$apply(vm.bookingSlot = false);
      $scope.$apply(vm.bookingAttemptFinished = true);
      $location.hash('bookingAttemptResult');
      $anchorScroll();
    }
    
    return vm;
  }]);