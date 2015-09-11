/*
 * Copyright 2010-2015 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * You may not use this file except in compliance with the License.
 * A copy of the License is located at
 *
 *  http://aws.amazon.com/apache2.0
 *
 * or in the "license" file accompanying this file. This file is distributed
 * on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */

var apigClientFactory = {};
apigClientFactory.newClient = function (config) {
    var apigClient = { };
    if(config === undefined) {
        config = {
            accessKey: '',
            secretKey: '',
            sessionToken: '',
            region: '',
            apiKey: undefined,
            defaultContentType: 'application/json',
            defaultAcceptType: 'application/json'
        };
    }
    if(config.accessKey === undefined) {
        config.accessKey = '';
    }
    if(config.secretKey === undefined) {
        config.secretKey = '';
    }
    if(config.apiKey === undefined) {
        config.apiKey = '';
    }
    if(config.sessionToken === undefined) {
        config.sessionToken = '';
    }
    if(config.region === undefined) {
        config.region = 'us-east-1';
    }
    //If defaultContentType is not defined then default to application/json
    if(config.defaultContentType === undefined) {
        config.defaultContentType = 'application/json';
    }
    //If defaultAcceptType is not defined then default to application/json
    if(config.defaultAcceptType === undefined) {
        config.defaultAcceptType = 'application/json';
    }

    
    var endpoint = 'https://q8qjkh0q08.execute-api.us-east-1.amazonaws.com/beta';
    //Remove trailing '/'
    if(endpoint.substr(-1) === '/') {
        endpoint = endpoint.substr(0, endpoint.length - 1);
    }
    var urlParts = endpoint.split('/');
    var tag = '/' + urlParts[urlParts.length - 1];
    endpoint = endpoint.substr(0, endpoint.length - tag.length);

    var sigV4ClientConfig = {
        accessKey: config.accessKey,
        secretKey: config.secretKey,
        sessionToken: config.sessionToken,
        serviceName: 'execute-api',
        region: config.region,
        endpoint: endpoint,
        defaultContentType: config.defaultContentType,
        defaultAcceptType: config.defaultAcceptType
    };

    var authType = 'NONE';
    if (sigV4ClientConfig.accessKey !== undefined && sigV4ClientConfig.accessKey !== '' && sigV4ClientConfig.secretKey !== undefined && sigV4ClientConfig.secretKey !== '') {
        authType = 'AWS_IAM';
    }

    var simpleHttpClientConfig = {
        endpoint: endpoint,
        defaultContentType: config.defaultContentType,
        defaultAcceptType: config.defaultAcceptType
    };

    var apiGatewayClient = apiGateway.core.apiGatewayClientFactory.newClient(simpleHttpClientConfig, sigV4ClientConfig);
    
    
    
    apigClient.trainersGet = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, ['location', 'body'], ['body']);
        
        var trainersGetRequest = {
            verb: 'get'.toUpperCase(),
            path: tag + uritemplate('/trainers').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, ['location', ]),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(trainersGetRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.trainersOptions = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);
        
        var trainersOptionsRequest = {
            verb: 'options'.toUpperCase(),
            path: tag + uritemplate('/trainers').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(trainersOptionsRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.trainersTrainerIdBookedslotsYearMonthDaySlotPost = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, ['slot', 'trainerId', 'clientId', 'day', 'year', 'month', 'location', 'body'], ['body']);
        
        var trainersTrainerIdBookedslotsYearMonthDaySlotPostRequest = {
            verb: 'post'.toUpperCase(),
            path: tag + uritemplate('/trainers/{trainerId}/bookedslots/{year}/{month}/{day}/{slot}').expand(apiGateway.core.utils.parseParametersToObject(params, ['slot', 'trainerId', 'day', 'year', 'month', ])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, ['clientId', 'location', ]),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(trainersTrainerIdBookedslotsYearMonthDaySlotPostRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.trainersTrainerIdBookedslotsYearMonthDaySlotOptions = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, ['day', 'year', 'month', 'slot', 'trainerId'], ['body']);
        
        var trainersTrainerIdBookedslotsYearMonthDaySlotOptionsRequest = {
            verb: 'options'.toUpperCase(),
            path: tag + uritemplate('/trainers/{trainerId}/bookedslots/{year}/{month}/{day}/{slot}').expand(apiGateway.core.utils.parseParametersToObject(params, ['day', 'year', 'month', 'slot', 'trainerId'])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(trainersTrainerIdBookedslotsYearMonthDaySlotOptionsRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.trainersTrainerIdFreeslotsGet = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, ['queryIntervalEnd', 'queryIntervalStart', 'location', 'trainerId', 'body'], ['body']);
        
        var trainersTrainerIdFreeslotsGetRequest = {
            verb: 'get'.toUpperCase(),
            path: tag + uritemplate('/trainers/{trainerId}/freeslots').expand(apiGateway.core.utils.parseParametersToObject(params, ['trainerId', ])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, ['queryIntervalEnd', 'queryIntervalStart', 'location', ]),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(trainersTrainerIdFreeslotsGetRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.trainersTrainerIdFreeslotsOptions = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, ['trainerId'], ['body']);
        
        var trainersTrainerIdFreeslotsOptionsRequest = {
            verb: 'options'.toUpperCase(),
            path: tag + uritemplate('/trainers/{trainerId}/freeslots').expand(apiGateway.core.utils.parseParametersToObject(params, ['trainerId'])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(trainersTrainerIdFreeslotsOptionsRequest, authType, additionalParams, config.apiKey);
    };
    

    return apigClient;
};
