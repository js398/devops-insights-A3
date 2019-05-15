
(function () {

    'use strict';

    var apiv1 = require('../../routes/apiv1');
    var assert = require('chai').assert;
    var REQUEST = require('request');

    var request = REQUEST.defaults( {
        strictSSL: false
    });

    var appUrl = process.env.APP_URL;

    describe('Get Weather(town name)', function() {

    	it('with valid town name', function(done) {
        if(!appUrl) {
            assert.fail("Environment variable APP_URL is not defined");
            return done();
        }
        request({
      		method: 'GET',
              url: appUrl + '/api/v1/getWeather?zip=Wellington'
          }, function(err, resp, body) {
          	if(err) {
          		assert.fail('Failed to get the response');
          	} else {
              assert.equal(resp.statusCode, 200);
              var pbody = JSON.parse(body);
              assert((pbody.city === 'Wellington'), "City name does not match");
              done();
            }
        });
    	});

      it('without town name', function(done) {
        if(!appUrl) {
            assert.fail("Environment variable APP_URL is not defined");
            return done();
        }
        request({
      		method: 'GET',
              url: appUrl + '/api/v1/getWeather'
          }, /* @callback */ function(err, resp, body) {
          	if(err) {
          		assert.fail('Failed to get the response');
          	} else {
              assert.equal(resp.statusCode, 400);
              done();
            }
        });
    	});

      it('with another valid town name', function(done) {
        if(!appUrl) {
            assert.fail("Environment variable APP_URL is not defined");
            return done();
        }
        request({
      		method: 'GET',
              url: appUrl + '/api/v1/getWeather?zip=Auckland'
          }, function(err, resp, body) {
          	if(err) {
          		assert.fail('Failed to get the response');
          	} else {
              assert.equal(resp.statusCode, 200);
              var pbody = JSON.parse(body);
              assert(pbody.city === 'Auckland', "City name does not match");
              done();
            }
        });
    	});
    });
    
    describe('Get Weather2(town lat/lon)', function() {

    	it('with valid town lat/lon', function(done) {
        if(!appUrl) {
            assert.fail("Environment variable APP_URL is not defined");
            return done();
        }
        request({
      		method: 'GET',
              url: appUrl + '/api/v1/getWeather2?lat=-41.29&lon=174.78'
          }, function(err, resp, body) {
          	if(err) {
          		assert.fail('Failed to get the response');
          	} else {
              assert.equal(resp.statusCode, 200);
              var pbody = JSON.parse(body);
              assert((pbody.city === 'Wellington'), "City name does not match");
              done();
            }
        });
    	});

      it('without lat/lon', function(done) {
        if(!appUrl) {
            assert.fail("Environment variable APP_URL is not defined");
            return done();
        }
        request({
      		method: 'GET',
              url: appUrl + '/api/v1/getWeather2'
          }, /* @callback */ function(err, resp, body) {
          	if(err) {
          		assert.fail('Failed to get the response');
          	} else {
              assert.equal(resp.statusCode, 400);
              done();
            }
        });
    	});

      it('with another valid lat/lon', function(done) {
        if(!appUrl) {
            assert.fail("Environment variable APP_URL is not defined");
            return done();
        }
        request({
      		method: 'GET',
              url: appUrl + '/api/v1/getWeather2?lat=-36.851510998549045&lon=174.76789486308246'
          }, function(err, resp, body) {
          	if(err) {
          		assert.fail('Failed to get the response');
          	} else {
              assert.equal(resp.statusCode, 200);
              var pbody = JSON.parse(body);
              assert(pbody.city === 'Auckland', "City name does not match");
              done();
            }
        });
    	});
    });
})();
