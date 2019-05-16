
var express = require('express');
var router = express.Router();
var REQUEST = require('request');

var request = REQUEST.defaults( {
    strictSSL: false
});

var OPENWEATHERURL = "http://api.openweathermap.org/data/2.5/weather?appid=6b7b471967dd0851d0010cdecf28f829&units=metric";

var db2id = {
  "hostname": "dashdb-txn-sbox-yp-dal09-04.services.dal.bluemix.net",
  "password": "pc79w8tvh93vc2^1",
  "https_url": "https://dashdb-txn-sbox-yp-dal09-04.services.dal.bluemix.net",
  "port": 50000,
  "ssldsn": "DATABASE=BLUDB;HOSTNAME=dashdb-txn-sbox-yp-dal09-04.services.dal.bluemix.net;PORT=50001;PROTOCOL=TCPIP;UID=hsq59456;PWD=pc79w8tvh93vc2^1;Security=SSL;",
  "host": "dashdb-txn-sbox-yp-dal09-04.services.dal.bluemix.net",
  "jdbcurl": "jdbc:db2://dashdb-txn-sbox-yp-dal09-04.services.dal.bluemix.net:50000/BLUDB",
  "uri": "db2://hsq59456:pc79w8tvh93vc2%5E1@dashdb-txn-sbox-yp-dal09-04.services.dal.bluemix.net:50000/BLUDB",
  "db": "BLUDB",
  "dsn": "DATABASE=BLUDB;HOSTNAME=dashdb-txn-sbox-yp-dal09-04.services.dal.bluemix.net;PORT=50000;PROTOCOL=TCPIP;UID=hsq59456;PWD=pc79w8tvh93vc2^1;",
  "username": "hsq59456",
  "ssljdbcurl": "jdbc:db2://dashdb-txn-sbox-yp-dal09-04.services.dal.bluemix.net:50001/BLUDB:sslConnection=true;"
};
var host = db2id['https_url']+'/dbapi/v3';
var userinfo = {
	"userid": "hsq59456",
  	"password": "pc79w8tvh93vc2^1"
};
var service;
var access_token;
var jobid = 0;

exports.getWeather = function(req, res) {
	var zip = req.query.zip;
	if( (zip === null) || (typeof(zip) === 'undefined') ) {
		return res.status(400).send('zip missing');
	}

	var aurl = OPENWEATHERURL + '&q=' + zip + ',nz';

	request({
		method: 'GET',
        url: aurl,
  		json: true
    }, function(err, resp, body) {
    	if(err) {
    		res.status(400).send('Failed to get the data');
    		//console.error("Failed to send request to openweathermap.org", err);
    	} else {
    		if(body.cod === 200) {
    			var weath = "Conditions are " + body.weather[0].main + " and temperature is " + body.main.temp + ' C';
    			var response = {city: body.name, weather: weath, lat: body.coord.lat, lon: body.coord.lon};
    			return res.status(200).send(response);
    		} else {
                return res.status(400).send({msg:'Failed'});
            }
    	}
    });

};
router.get('/getWeather', exports.getWeather);


exports.getWeather2 = function(req, res) {
	var lat = req.query.lat;
	var lon = req.query.lon;
	if( (lat === null) || (typeof(lat) === 'undefined') ) {
		return res.status(400).send('lat missing');
	}
	if( (lon === null) || (typeof(lon) === 'undefined') ) {
		return res.status(400).send('lon missing');
	}

	var aurl = OPENWEATHERURL + '&lat=' + lat + '&lon=' + lon;

	request({
		method: 'GET',
        url: aurl,
  		json: true
    }, function(err, resp, body) {
    	if(err) {
    		res.status(400).send('Failed to get the data');
    		//console.error("Failed to send request to openweathermap.org", err);
    	} else {
    		if(body.cod === 200&&body.sys.country==="NZ") {
    			var weath = "Conditions are " + body.weather[0].main + " and temperature is " + body.main.temp + ' C';
    			var response = {city: body.name, weather: weath};
    			return res.status(200).send(response);
    		} else {
                return res.status(400).send({msg:'Failed'});
            }
    	}
    });

};
router.get('/getWeather2', exports.getWeather2);

exports.getAuth = function(req,res) {
	service = '/auth/tokens';
	request({
        url: host + service,
  		method: 'POST',
  		json: true,
    	body: userinfo
    }, function(err, resp, body) {
    	if(err) {
    		res.status(400).send('connect fail');
    	} else if (resp.statusCode === 200){
    		access_token = body.token;
    		return res.send({data: body.token});
    	}
    });   
};
router.get('/getAuth', exports.getAuth);

exports.getData = function(req, res) {
	var id = req.query.id;
	
	if( (id === null) || (typeof(id) === 'undefined') ) {
		return res.status(400).send('id missing');
	}
	
    
     var auth_header = {
     	"Authorization" : "Bearer" + access_token
     };
     var sql_command = {
     	"commands" : "select NAME from CITYDATA where ID = "+id,
     	"limit" : 1,
     	"separator" : ";",
     	"stop_on_error" : "yes"
     };
     
     service = "/sql_jobs";
  
    request({
        url: host + service,
        method: 'POST',
  		body: sql_command,
  		json: true,
  		headers: auth_header
    }, function(err, resp, body) {
    	if(err) {
    		return res.status(400).send('operate fail');
    	} else {
    		jobid = body.id;
    	}
    
    });


    
  	while(jobid!==0){
    request({
        url: host + service + "/" + jobid,
        method: 'GET',
        json: true,
  		headers: auth_header
    }, function(err, resp, body) {
    	if(err) {
    		res.status(400).send('operate fail');
    	} else {
    		console.error(body);
    		jobid = 0;
    		var response = {city: body.results.rows};
    			return res.status(200).send(response);
    	}
    });
}


    
    
    
};
router.get('/getData', exports.getData);


exports.router = router;


