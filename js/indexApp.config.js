'use strict';

angular.module('indexApp')
  .constant('cognitoIdentityPoolId', 'us-east-1:ecb64bed-90ea-46e1-a1a3-25cf1ed5647f')
  .constant('awsAccountId', '029421738421')
  .constant('awsRegion', 'us-east-1')
  .factory('cognitoIdentity', ['awsRegion', function(awsRegion) {
    return new AWS.CognitoIdentity({ region: awsRegion })
  }]);