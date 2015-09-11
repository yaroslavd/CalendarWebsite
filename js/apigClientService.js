'use strict';

angular.module('indexApp')
  .service('apigClientService', ['$q', 'apigClientFactory', 'apigApiKey', 'cognitoService', 'awsRegion',
                              function ($q, apigClientFactory, apigApiKey, cognitoService, awsRegion) {
    
    var apigClient = $q.defer();
    
    cognitoService.then(returnNewClient);
    
    function returnNewClient(cognitoResults) {
      var newClient = apigClientFactory.newClient({
        apiKey: apigApiKey,
        accessKey: cognitoResults.Credentials.AccessKeyId,
        secretKey: cognitoResults.Credentials.SecretKey,
        sessionToken: cognitoResults.Credentials.SessionToken,
        region: awsRegion
      });
      
      apigClient.resolve(newClient);
    }
    
    return apigClient.promise;
  }]);
