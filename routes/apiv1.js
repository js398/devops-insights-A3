
var express = require('express');
var router = express.Router();
var REQUEST = require('request');
var ibmdb = require('ibm_db');

var request = REQUEST.defaults( {
    strictSSL: false
});

var OPENWEATHERURL = "http://api.openweathermap.org/data/2.5/weather?appid=6b7b471967dd0851d0010cdecf28f829&units=metric";

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



exports.getData = function(req, res) {
	var col = req.query.col;
	var item = req.query.item;
	var value = req.query.value;
	
	if( (col === null) || (typeof(col) === 'undefined') ) {
		return res.status(400).send('col missing');
	}
	if( (item === null) || (typeof(item) === 'undefined') ) {
		return res.status(400).send('item missing');
	}
	if( (value === null) || (typeof(value) === 'undefined') ) {
		return res.status(400).send('value missing');
	}
	
	ibmdb.open("DATABASE=HSQ59456;HOSTNAME=dashdb-txn-sbox-yp-dal09-04.services.dal.bluemix.net;UID=hsq59456;PWD=pc79w8tvh93vc2^1;PORT=50000;PROTOCOL=TCPIP",

  function(err,conn) {

     if (err) {
     	res.status(400).send('db erroe: '+ err);
     	return console.log(err);
 	}
 
    conn.query('select '+ col+' as string from CITYDATA where '+item+'='+value,

      function (err, rows) {

        if (err) {
        	return res.status(400).send({msg:'Failed'});
    	}
        else

         {
         	var data;
                //loop through the rows from the resultset
                for (var i=0; i<rows.length; i++)
                {
                      data += rows[i].STRING.trim();
                }
             var response = {value: data};
             return res.status(200).send(response);
         }

         conn.close(function () {

        console.log('done');

        });

      });

 });


};
router.get('/getData', exports.getData);


exports.router = router;
