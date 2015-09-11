'use strict';

angular.module('indexApp')
  .service('cognitoService', ['$q', 'cognitoIdentity', 'googleService', 'awsAccountId', 'cognitoIdentityPoolId',
                              function ($q, cognitoIdentity, googleService, awsAccountId, cognitoIdentityPoolId) {
    
    var cognitoResults = $q.defer();
    
    googleService.then(function(auth) {
      var googleToken = auth.idToken;
      
      var params = {
          IdentityPoolId: cognitoIdentityPoolId,
          AccountId: awsAccountId,
          Logins: {
            'accounts.google.com' : googleToken
          }
        };
      
      cognitoIdentity.getId(params, handleGetId);
      
      function handleGetId(err, data) {
        if (err) {
          console.log(err, err.stack);
          return;
        }
        
        var credsParams = {
            IdentityId: data.IdentityId,
            Logins: {
              'accounts.google.com' : googleToken
            }
        }
                        
        cognitoIdentity.getCredentialsForIdentity(credsParams, handleCredentialsForIdentity);
      };
      
      function handleCredentialsForIdentity(credErr, credData) {
        if (credErr) {
          console.log(credErr, credErr.stack);
          return;
        }
        
        console.log("COGNITO RESPONSE - creds");
        console.log(credData);
        
        cognitoResults.resolve(credData);
      };
    });
    
    return cognitoResults.promise;
  }]);