'use strict';

angular.module('indexApp')
  // AWS config
  .constant('awsAccountId', '029421738421')
  .constant('awsRegion', 'us-east-1')
  .factory('awsConfig', ['awsRegion', 'cognitoIdentityPoolId', function(awsRegion, cognitoIdentityPoolId) {
    AWS.config.region = awsRegion;
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: cognitoIdentityPoolId
    });
    
    console.log('AWS setup configured');
    return null;
  }])
  
  // Cognito config
  .constant('cognitoIdentityPoolId', 'us-east-1:ecb64bed-90ea-46e1-a1a3-25cf1ed5647f')
  .factory('cognitoIdentity', ['awsRegion', function(awsRegion) {
    return new AWS.CognitoIdentity({ region: awsRegion })
  }])
  
  // CloudWatch config
  .constant('cloudwatchNamespace', 'CalendarWebsite')
  
  // APIG config
  .factory('apigClientFactory', ['$window', function($window) {
    return $window.apigClientFactory;
  }])
  .constant('apigApiKey', 'tLCRTZXBTZ3INmncaLDVX4DeLr2w6tgv9f12AAvG')
  
  // Mobile analytics config
  .constant('mobileAnalyticsAppId', '816ab89f0f0b4a30bca1ebe6f8cae9e7')
  .factory('mobileAnalyticsClient', ['awsConfig', 'mobileAnalyticsAppId', function(awsConfig, mobileAnalyticsAppId) {
    var options = {
        appId : mobileAnalyticsAppId
    };
    
    return new AMA.Manager(options);
  }])
  
  // Trainer APIs config
  .constant('location', 'Seattle')
  
  // time intervals for free slots
  .factory('intervalStartTime', [function() {
    return moment().add(1, "days").startOf("day");
  }])
  .factory('intervalEndTime', ['intervalStartTime', function(intervalStartTime) {
    return intervalStartTime.clone().add(28, "day").startOf("day");
  }])