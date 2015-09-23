'use strict';

angular.module('indexApp')
  .service('cloudWatchClientService', ['$q', 'cognitoService', 'awsRegion',
                              function ($q, cognitoService, awsRegion) {
    
    var cloudWatchClient = $q.defer();
    
    cognitoService.then(returnNewClient);
    
    function returnNewClient(cognitoResults) {
      var creds = new AWS.Credentials({
        accessKeyId: cognitoResults.Credentials.AccessKeyId,
        secretAccessKey: cognitoResults.Credentials.SecretKey,
        sessionToken: cognitoResults.Credentials.SessionToken
      });
      
      var newClient = new AWS.CloudWatch({
        region: awsRegion,
        credentials: creds
      });
      
      cloudWatchClient.resolve(newClient);
    }
    
    return cloudWatchClient.promise;
  }]);
