
(function() {

  'use strict';

  var timeout;

  // angular registration of controller
  angular
    .module('soApp')
    .controller('MusicLibraryCtrl', function($scope, SharedObject, weave) {

      $scope.library = {};
      $scope.covers = [];

      // executed when user clicks on a station
      $scope.selectStation = function(stationName) {
        $scope.stationName = stationName;
        $scope.updateWall();
      };

      // watcher for changes to the scopes library object
      // containing all stations with genres, priorities and songs
      $scope.$watch('library', function() {
        clearTimeout(timeout);
        timeout = setTimeout(function function_name (argument) {
          $scope.$apply($scope.updateWall);
        }, 150);
      }, true);

      // updateWall
      // called when library data or selected station is changed
      // builds a list of covers
      $scope.updateWall = function() {
        if(!$scope.stationName) {
          $scope.covers = [];
        } else {

          // select all genres from all stations in library
          var genres = $scope.library.stations[$scope.stationName].genres;

          // select all songs in all libraries as an array of arrays
          // each array will be set to a length corresponding to the priority
          // of the genre
          var songs = Object.keys(genres).map(function(k) { return genres[k].songs.slice(0, genres[k].priority); });
          
          // calls weave to mix the songs from the genres
          // the second argument specifies the max length of the returned array
          $scope.covers = weave(songs, 36);
        }
      };

      // attaches the library property of scope to a SharedObject with the
      // path (id) "Johan Öbrink"
      SharedObject.attach($scope, 'library', 'Johan Öbrink');

    });
})();
