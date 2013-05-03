
(function() {

  'use strict';

  angular
    .module('soApp')
    .controller('MusicLibraryCtrl', function($scope, SharedObject) {

      $scope.library = {};
      SharedObject.attach($scope, 'library', 'Johan Öbrink');

      setTimeout(function() {
        console.log($scope);
      }, 2000);

    });
})();
