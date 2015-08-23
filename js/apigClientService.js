'use strict';

angular.module('indexApp')
  .service('apigClientService', ['$q', 'apigClientFactory', 'apigApiKey', 'cognitoService', 'awsRegion',
                              function ($q, apigClientFactory, apigApiKey, cognitoService, awsRegion) {
    
    var apigClient = $q.defer();
    
    cognitoService.then(returnNewClient);
    
    function returnNewClient(cognitoResults) {
      var newClient = apigClientFactory.newClient({
        apiKey: apigApiKey,
        accessKey: cognitoResults.AccessKeyId,
        secretKey: cognitoResults.SecretKey,
        sessionToken: cognitoResults.SessionToken,
        region: awsRegion
      });
      
      apigClient.resolve(newClient);
    }
    
    return apigClient.promise;
  }]);
