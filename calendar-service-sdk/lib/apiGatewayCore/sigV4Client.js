var apiGateway = apiGateway || {};
apiGateway.core = apiGateway.core || {};

apiGateway.core.sigV4ClientFactory = {};
apiGateway.core.sigV4ClientFactory.newClient = function (config) {
    var AWS_SHA_256 = 'AWS4-HMAC-SHA256';
    var AWS4_REQUEST = 'aws4_request';
    var AWS4 = 'AWS4';
    var DATE_FORMAT = 'YYYYMMDD';
    var TIME_FORMAT = 'HHmmss';
    var X_AMZ_DATE = 'x-amz-date';
    var X_AMZ_SECURITY_TOKEN = 'x-amz-security-token';
    var HOST = 'host';
    var AUTHORIZATION = 'Authorization';

    function hash(value) {
        return CryptoJS.SHA256(value);
    }

    function hexEncode(value) {
        return value.toString(CryptoJS.enc.Hex);
    }

    function hmac(secret, value) {
        return CryptoJS.HmacSHA256(value, secret, {asBytes: true});
    }

    function buildCanonicalRequest(method, path, queryParams, headers, payload) {
        return method + '\n' +
            buildCanonicalUri(path) + '\n' +
            buildCanonicalQueryString(queryParams) + '\n' +
            buildCanonicalHeaders(headers) + '\n' +
            buildCanonicalSignedHeaders(headers) + '\n' +
            hexEncode(hash(''));
    }

    function hashCanonicalRequest(request) {
        return hexEncode(hash(request));
    }

    function buildCanonicalUri(uri) {
        return encodeURI(uri);
    }

    function buildCanonicalQueryString(queryParams) {
        if (Object.keys(queryParams).length < 1) {
            return '';
        }

        var sortedQueryParams = [];
        for (var property in queryParams) {
            if (queryParams.hasOwnProperty(property)) {
                sortedQueryParams.push(property);
            }
        }
        sortedQueryParams.sort();

        var canonicalQueryString = '';
        for (var i = 0; i < sortedQueryParams.length; i++) {
            canonicalQueryString += sortedQueryParams[i] + '=' + encodeURIComponent(queryParams[sortedQueryParams[i]]) + '&';
        }
        return canonicalQueryString.substr(0, canonicalQueryString.length - 1);
    }

    function buildCanonicalHeaders(headers) {
        var canonicalHeaders = '';
        var sortedKeys = [];
        for (var property in headers) {
            if (headers.hasOwnProperty(property)) {
                sortedKeys.push(property);
            }
        }
        sortedKeys.sort();

        for (var i = 0; i < sortedKeys.length; i++) {
            canonicalHeaders += sortedKeys[i].toLowerCase() + ':' + headers[sortedKeys[i]] + '\n';
        }
        return canonicalHeaders;
    }

    function buildCanonicalSignedHeaders(headers) {
        var sortedKeys = [];
        for (var property in headers) {
            if (headers.hasOwnProperty(property)) {
                sortedKeys.push(property.toLowerCase());
            }
        }
        sortedKeys.sort();

        return sortedKeys.join(';');
    }

    function buildStringToSign(date, credentialScope, hashedCanonicalRequest) {
        return AWS_SHA_256 + '\n' +
            buildXAmzDate(date) + '\n' +
            credentialScope + '\n' +
            hashedCanonicalRequest;
    }

    function buildCredentialScope(date, region, service) {
        return date.format(DATE_FORMAT) + '/' + region + '/' + service + '/' + AWS4_REQUEST
    }

    function calculateSigningKey(secretKey, date, region, service) {
        return hmac(hmac(hmac(hmac(AWS4 + secretKey, date.format(DATE_FORMAT)), region), service), AWS4_REQUEST);
    }

    function calculateSignature(key, stringToSign) {
        return hexEncode(hmac(key, stringToSign));
    }

    function buildXAmzDate(date) {
        return date.format(DATE_FORMAT) + 'T' + date.format(TIME_FORMAT) + 'Z';
    }

    function buildAuthorizationHeader(accessKey, credentialScope, headers, signature) {
        return AWS_SHA_256 + ' Credential=' + accessKey + '/' + credentialScope + ', SignedHeaders=' + buildCanonicalSignedHeaders(headers) + ', Signature=' + signature;
    }

    var awsSigV4Client = { };
    if(config.accessKey === undefined || config.secretKey === undefined) {
        return awsSigV4Client;
    }
    awsSigV4Client.accessKey = apiGateway.core.utils.assertDefined(config.accessKey, 'accessKey');
    awsSigV4Client.secretKey = apiGateway.core.utils.assertDefined(config.secretKey, 'secretKey');
    awsSigV4Client.sessionToken = config.sessionToken;
    awsSigV4Client.serviceName = apiGateway.core.utils.assertDefined(config.serviceName, 'serviceName');
    awsSigV4Client.region = apiGateway.core.utils.assertDefined(config.region, 'region');
    awsSigV4Client.endpoint = apiGateway.core.utils.assertDefined(config.endpoint, 'endpoint');
    
    console.log('sigV4');

    awsSigV4Client.makeRequest = function (request) {
        console.log('sigv4makeRequest');
        var verb = apiGateway.core.utils.assertDefined(request.verb, 'verb');
        var path = apiGateway.core.utils.assertDefined(request.path, 'path');
        var queryParams = apiGateway.core.utils.copy(request.queryParams);
        if (queryParams === undefined) {
            queryParams = {};
        }
        var headers = apiGateway.core.utils.copy(request.headers);
        if (headers === undefined) {
            headers = {};
        }
        var body = apiGateway.core.utils.copy(request.body);
        if (body === undefined) {
            body = '';
        }  else if (body != null && body != ""){
            body = JSON.stringify(body);
        }
        
        console.log('body: ' + body);

        var date = moment.utc();
        headers[X_AMZ_DATE] = buildXAmzDate(date);
        var parser = document.createElement('a');
        parser.href = awsSigV4Client.endpoint;
        headers[HOST] = parser.host;

        var canonicalRequest = buildCanonicalRequest(verb, path, queryParams, headers, body);
        var hashedCanonicalRequest = hashCanonicalRequest(canonicalRequest);
        console.log('canonical request:\n' + canonicalRequest);
        var credentialScope = buildCredentialScope(date, awsSigV4Client.region, awsSigV4Client.serviceName);
        var stringToSign = buildStringToSign(date, credentialScope, hashedCanonicalRequest);
        var signingKey = calculateSigningKey(awsSigV4Client.secretKey, date, awsSigV4Client.region, awsSigV4Client.serviceName);
        var signature = calculateSignature(signingKey, stringToSign);
        headers[AUTHORIZATION] = buildAuthorizationHeader(awsSigV4Client.accessKey, credentialScope, headers, signature);
        if(awsSigV4Client.sessionToken !== undefined && awsSigV4Client.sessionToken !== '') {
            headers[X_AMZ_SECURITY_TOKEN] = awsSigV4Client.sessionToken;
        }
        delete headers[HOST];

        var url = config.endpoint + path;
        var queryString = buildCanonicalQueryString(queryParams);
        if (queryString != '') {
            url += '?' + queryString;
        }
        var signedRequest = {
            method: verb,
            url: url,
            headers: headers,
            data: body
        };
        return axios(signedRequest);
    };

    return awsSigV4Client;
};