
var uluru = {lat: 0, lng: 0};
var map;
var marker1;
var marker2;
var marker3;
var marker4;
var marker5;
var infowindow;

var ConsoleModule = angular.module('ConsoleModule', ['ngRoute']);

ConsoleModule.config(['$routeProvider', '$locationProvider','$sceDelegateProvider', '$httpProvider',
    function ($routeProvider, $locationProvider, $sceDelegateProvider, $httpProvider) {
    $routeProvider.when('/', {
        templateUrl: '/partials/Byzip.html',
        controller: 'wcontroller',
        controllerAs: 'wcontroller'
    });
}]);

ConsoleModule.controller('wcontroller', ['$scope', '$http', '$routeParams', '$timeout', '$sce',
    function($scope, $http, $routeParams, $timeout, $sce) {

    $scope.somemessage = "Some weather";
    $scope.zip1City = "";
    $scope.zip1Weather = "";

    $scope.zip = function(which) {

        var data = "";
        if(which === 1) {
            data = $scope.zip1m;
        } else if(which === 2) {
            data = $scope.zip2m;
        } else if(which === 3) {
            data = $scope.zip3m;
        } else if(which === 4) {
            data = $scope.zip4m;
        } 
        
        if(data.length >= 4) {
            $http({
                method: "GET",
                url: '/api/v1/getWeather?zip=' + data
            }).then( function(response) {
                if(which === 1) {
                    $scope.zip1City = response.data.city;
                    $scope.zip1Weather = response.data.weather;
                    uluru = new google.maps.LatLng(response.data.lat, response.data.lon);
   					marker1.setPosition(uluru);
   					$http({
                method: "GET",
                url: '/api/v1/updateData?id=1&name=' + data
            });
                } else if(which === 2) {
                    $scope.zip2City = response.data.city;
                    $scope.zip2Weather = response.data.weather;
                    uluru = new google.maps.LatLng(response.data.lat, response.data.lon);
   					marker2.setPosition(uluru);
   					$http({
                method: "GET",
                url: '/api/v1/updateData?id=2&name=' + data
            });

                } else if(which === 3) {
                    $scope.zip3City = response.data.city;
                    $scope.zip3Weather = response.data.weather;
                    uluru = new google.maps.LatLng(response.data.lat, response.data.lon);
   					marker3.setPosition(uluru);
   					$http({
                method: "GET",
                url: '/api/v1/updateData?id=3&name=' + data
            });

                } else if(which === 4) {
                    $scope.zip4City = response.data.city;
                    $scope.zip4Weather = response.data.weather;
                    uluru = new google.maps.LatLng(response.data.lat, response.data.lon);
   					marker4.setPosition(uluru);
   					$http({
                method: "GET",
                url: '/api/v1/updateData?id=4&name=' + data
            });

                } 
            });
        } else {
            if(which === 1) {
                    $scope.zip1City = "";
                    $scope.zip1Weather = "";
                } else if(which === 2) {
                    $scope.zip2City = "";
                    $scope.zip2Weather = "";
                } else if(which === 3) {
                    $scope.zip3City = "";
                    $scope.zip3Weather = "";
                } else if(which === 4) {
                    $scope.zip4City = "";
                    $scope.zip4Weather = "";
                } 
        }
    };
    
    $scope.dosearch = function(which,data) {
            $http({
                method: "GET",
                url: '/api/v1/getWeather?zip=' + data
            }).then( function(response) {
                if(which === 1) {
                    $scope.zip1City = response.data.city;
                    $scope.zip1Weather = response.data.weather;
                    uluru = new google.maps.LatLng(response.data.lat, response.data.lon);
   					marker1.setPosition(uluru);
                } else if(which === 2) {
                    $scope.zip2City = response.data.city;
                    $scope.zip2Weather = response.data.weather;
                    uluru = new google.maps.LatLng(response.data.lat, response.data.lon);
   					marker2.setPosition(uluru);
                } else if(which === 3) {
                    $scope.zip3City = response.data.city;
                    $scope.zip3Weather = response.data.weather;
                    uluru = new google.maps.LatLng(response.data.lat, response.data.lon);
   					marker3.setPosition(uluru);
                } else if(which === 4) {
                    $scope.zip4City = response.data.city;
                    $scope.zip4Weather = response.data.weather;
                    uluru = new google.maps.LatLng(response.data.lat, response.data.lon);
   					marker4.setPosition(uluru);
                } 
            });
        
    };
    
}]);