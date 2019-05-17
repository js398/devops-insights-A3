
(function () {

  'use strict';

	var requireHelper = require('./requireHelper');
  var apiv1 = requireHelper.require('tests/coverage/instrumented/routes/apiv1');
  var assert = require('chai').assert;
  var sinon = require('sinon');


  // create mock request and response
  var reqMock = {};

  var resMock = {};
  resMock.status = function() {
    return this;
  };
  resMock.send = function() {
    return this;
  };
  resMock.end = function() {
    return this;
  };
  sinon.spy(resMock, "status");
  sinon.spy(resMock, "send");


  describe('Get Weather', function() {

    it('with without town name', function() {
      reqMock = {
        query: {

        }
      };

      apiv1.getWeather(reqMock, resMock);

      assert(resMock.status.lastCall.calledWith(400), 'Unexpected status code:' + resMock.status.lastCall.args);
    });

    it('with valid town name and error from request call', function() {
      reqMock = {
        query: {
          zip: 'Wellington'
        }
      };

      var request = function( obj, callback ){
        callback("error", null, null);
      };

      apiv1.__set__("request", request);

      apiv1.getWeather(reqMock, resMock);

      assert(resMock.status.lastCall.calledWith(400), 'Unexpected response:' + resMock.status.lastCall.args);
      assert(resMock.send.lastCall.calledWith('Failed to get the data'), 'Unexpected response:' + resMock.send.lastCall.args);
    });

    it('with incomplete town name', function() {
      reqMock = {
        query: {
          zip: 'Wellingt'
        }
      };

      var request = function( obj, callback ){
        callback(null, null, {});
      };

      apiv1.__set__("request", request);

      apiv1.getWeather(reqMock, resMock);

      assert(resMock.status.lastCall.calledWith(400), 'Unexpected response:' + resMock.status.lastCall.args);
      assert(resMock.send.lastCall.args[0].msg === 'Failed', 'Unexpected response:' + resMock.send.lastCall.args);
    });

    it('with valid town name', function() {
      reqMock = {
        query: {
          zip: 'Wellington'
        }
      };

      var body = {
        cod: 200,
        name: 'Wellington',
        weather: [
          {
            main: 'cold'
          }
        ],
        main: {
          temp: 78
        },
        coord: {
        	lon: 174.78,
        	lat: -41.29
        }
      };

      var request = function( obj, callback ){
        callback(null, null, body);
      };

      apiv1.__set__("request", request);

      apiv1.getWeather(reqMock, resMock);

      assert(resMock.status.lastCall.calledWith(200), 'Unexpected response:' + resMock.status.lastCall.args);
      assert(resMock.send.lastCall.args[0].city === 'Wellington', 'Unexpected response:' + resMock.send.lastCall.args[0].city);
      assert(resMock.send.lastCall.args[0].weather === 'Conditions are cold and temperature is 78 C', 'Unexpected response:' + resMock.send.lastCall.args[0].weather);
    });
  });

  
  describe('Get Weather 2', function() {

    it('with without lat data', function() {
      reqMock = {
        query: {
			lon: 174.78
        }
      };

      apiv1.getWeather2(reqMock, resMock);

      assert(resMock.status.lastCall.calledWith(400), 'Unexpected status code:' + resMock.status.lastCall.args);
    });
    
    it('with without lon data', function() {
      reqMock = {
        query: {
			lat: -41.29
        }
      };

      apiv1.getWeather2(reqMock, resMock);

      assert(resMock.status.lastCall.calledWith(400), 'Unexpected status code:' + resMock.status.lastCall.args);
    });

    it('with valid lat/lon data and error from request call', function() {
      reqMock = {
        query: {
          lat: -41.29,
          lon: 174.78
        }
      };

      var request = function( obj, callback ){
        callback("error", null, null);
      };

      apiv1.__set__("request", request);

      apiv1.getWeather2(reqMock, resMock);

      assert(resMock.status.lastCall.calledWith(400), 'Unexpected response:' + resMock.status.lastCall.args);
      assert(resMock.send.lastCall.calledWith('Failed to get the data'), 'Unexpected response:' + resMock.send.lastCall.args);
    });

    it('with incomplete lat/lon data', function() {
      reqMock = {
        query: {
          lat: 1,
          lon: 1
        }
      };

      var request = function( obj, callback ){
        callback(null, null, {});
      };

      apiv1.__set__("request", request);

      apiv1.getWeather2(reqMock, resMock);

      assert(resMock.status.lastCall.calledWith(400), 'Unexpected response:' + resMock.status.lastCall.args);
      assert(resMock.send.lastCall.args[0].msg === 'Failed', 'Unexpected response:' + resMock.send.lastCall.args);
    });

    it('with valid lat/lon data', function() {
      reqMock = {
        query: {
          lat: -41.29,
          lon: 174.78
        }
      };

      var body = {
        cod: 200,
        name: 'Wellington',
        weather: [
          {
            main: 'cold'
          }
        ],
        main: {
          temp: 78
        },
      	sys: {
      		country: 'NZ'
  		}     		
      };
      	

      var request = function( obj, callback ){
        callback(null, null, body);
      };

      apiv1.__set__("request", request);

      apiv1.getWeather2(reqMock, resMock);

      assert(resMock.status.lastCall.calledWith(200), 'Unexpected response:' + resMock.status.lastCall.args);
      assert(resMock.send.lastCall.args[0].city === 'Wellington', 'Unexpected response:' + resMock.send.lastCall.args[0].city);
      assert(resMock.send.lastCall.args[0].weather === 'Conditions are cold and temperature is 78 C', 'Unexpected response:' + resMock.send.lastCall.args[0].weather);
    });
  });
  
  describe('getAuth', function() {

    it('request for a Auth token', function() {
      reqMock = {
        query: {
        	
        }
      };

      var body = {
        data: 'eyJ0eXAiOiJKV1QiLCJhbGwS7viwFXPerXZJflTVxXQh96pa4c'   		
      };

      var request = function( obj, callback ){
        callback(null, null, body);
      };

      apiv1.__set__("request", request);

      apiv1.getAuth(reqMock, resMock);

      assert(resMock.status.lastCall.calledWith(200), 'Unexpected response:' + resMock.status.lastCall.args);
      assert(resMock.send.lastCall.args[0].data === 'eyJ0eXAiOiJKV1QiLCJhbGwS7viwFXPerXZJflTVxXQh96pa4c', 'Unexpected response:' + resMock.send.lastCall.args[0].city);
    });
  });
  
  describe('getData', function() {
  	
  	it('with without id data', function() {
      reqMock = {
        query: {

        }
      };

      apiv1.getData(reqMock, resMock);

      assert(resMock.status.lastCall.calledWith(400), 'Unexpected status code:' + resMock.status.lastCall.args);
    });

    it('with vaild id data', function() {
      reqMock = {
        query: {
        	id: 1
        }
      };

      var body = {
        data: 'eyJ0eXAiOiJKV1QiLCJhbGwS7viwFXPerXZJflTVxXQh96pa4c'   		
      };
      	

      var request = function( obj, callback ){
        callback(null, null, body);
      };

      apiv1.__set__("request", request);

      apiv1.getData(reqMock, resMock);

      assert(resMock.status.lastCall.calledWith(200), 'Unexpected response:' + resMock.status.lastCall.args);
    });
  });
  
  describe('updateData', function() {
  	
  	it('with without id data', function() {
      reqMock = {
        query: {
			name: 'auckland'
        }
      };

      apiv1.updateData(reqMock, resMock);

      assert(resMock.status.lastCall.calledWith(400), 'Unexpected status code:' + resMock.status.lastCall.args);
    });
    
    it('with without name data', function() {
      reqMock = {
        query: {
			id: 1
        }
      };

      apiv1.updateData(reqMock, resMock);

      assert(resMock.status.lastCall.calledWith(400), 'Unexpected status code:' + resMock.status.lastCall.args);
    });

    it('with vaild id/name data', function() {
      reqMock = {
        query: {
        	id: 1,
        	name: 'Auckland'
        }
      };

      var body = {
        id: 'eyJ0eXAiOiJKV1QiLCJhbGwS7viwFXPerXZJflTVxXQh96pa4c'   		
      };
      	

      var request = function( obj, callback ){
        callback(null, null, body);
      };

      apiv1.__set__("request", request);

      apiv1.updateData(reqMock, resMock);

      assert(resMock.status.lastCall.calledWith(200), 'Unexpected response:' + resMock.status.lastCall.args);
      assert(resMock.send.lastCall.args[0].id === 'eyJ0eXAiOiJKV1QiLCJhbGwS7viwFXPerXZJflTVxXQh96pa4c', 'Unexpected response:' + resMock.send.lastCall.args[0].city);
    });
  });
  
}());
