'use strict';

angular.module('indexApp')
  .controller('googleController', ['googleService', function (googleService) {
    console.log('googleController loaded');
    
    var vm = this;
    vm.clientName = null;
    
    googleService.then(function(googleResult) {
      console.log(googleResult);
      vm.clientName = googleResult.name;
    });
  }]);