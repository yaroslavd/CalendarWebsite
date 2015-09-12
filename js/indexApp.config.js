'use strict';

angular.module('indexApp')
  // AWS config
  .constant('cognitoIdentityPoolId', 'us-east-1:ecb64bed-90ea-46e1-a1a3-25cf1ed5647f')
  .constant('awsAccountId', '029421738421')
  .constant('awsRegion', 'us-east-1')
  .factory('cognitoIdentity', ['awsRegion', function(awsRegion) {
    return new AWS.CognitoIdentity({ region: awsRegion })
  }])
  
  // APIG Config
  .factory('apigClientFactory', ['$window', function($window) {
    return $window.apigClientFactory;
  }])
  .constant('apigApiKey', 'tLCRTZXBTZ3INmncaLDVX4DeLr2w6tgv9f12AAvG')
  
  // Trainer APIs config
  .constant('location', 'Seattle')
  
  // time intervals for free slots
  .factory('intervalStartTime', [function() {
    return moment().add(1, "days").startOf("day");
  }])
  .factory('intervalEndTime', ['intervalStartTime', function(intervalStartTime) {
    return intervalStartTime.clone().add(28, "day").startOf("day");
  }])