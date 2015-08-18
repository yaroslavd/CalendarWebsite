'use strict';

angular.module('indexApp')
  .config(function(googleLoginProvider) {
    googleLoginProvider.configure({
      clientId : '187173892432-dnsafu5beq2j4qgggl8kf7serfca9umn.apps.googleusercontent.com',
      scopes : [ 'email' ]
    });
  });