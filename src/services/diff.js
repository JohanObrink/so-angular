
(function() {

  'use strict';

  var difference = function(template, override) {
    var ret = {};
    for (var name in template) {
      if (name in override) {
        if (_.isObject(override[name]) && !_.isArray(override[name])) {
          var diff = difference(template[name], override[name]);
          if (!_.isEmpty(diff)) {
            ret[name] = diff;
          }
        } else if (!_.isEqual(template[name], override[name])) {
          ret[name] = override[name];
        }
      } else {
        ret[name] = undefined;
      }
    }
    for(name in override) {
      if(!(name in template)) {
        ret[name] = override[name];
      }
    }
    return ret;
  };

  // service registration for angular
  angular
    .module('sharedobject')
    .factory('diff', function() { return { difference: difference }; });

})();