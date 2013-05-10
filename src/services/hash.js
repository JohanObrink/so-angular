
(function() {

  'use strict';

  // service registration for angular
  angular
    .module('sharedobject')
    .factory('hash', function() {
      return function(obj) {
        var str = ('string' === typeof(obj)) ? obj : angular.toJson(obj);
        var hash = 0;
        if (str.length === 0) { return hash; }
        for (var i = 0; i < str.length; i++) {
            var character = str.charCodeAt(i);
            hash = ((hash<<5)-hash)+character;
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash;
      };
    });

})();