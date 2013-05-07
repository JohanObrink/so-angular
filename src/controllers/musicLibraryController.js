
(function() {

  'use strict';

  var timeout;

  angular
    .module('soApp')
    .controller('MusicLibraryCtrl', function($scope, SharedObject, weave) {

      $scope.library = {};
      $scope.covers = [];

      $scope.selectStation = function(stationName) {
        $scope.stationName = stationName;
        $scope.updateWall();
      };

      $scope.$watch('library', function() {
        clearTimeout(timeout);
        timeout = setTimeout(function function_name (argument) {
          $scope.$apply($scope.updateWall);
        }, 150);
      }, true);

      $scope.updateWall = function() {
        if(!$scope.stationName) {
          $scope.covers = [];
        } else {
          var genres = $scope.library.stations[$scope.stationName].genres;
          var songs = Object.keys(genres).map(function(k) { return genres[k].songs.slice(0, genres[k].priority); });
          $scope.covers = weave(songs, 6*6);
        }
      };

      SharedObject.attach($scope, 'library', 'Johan Öbrink');

    });
})();
