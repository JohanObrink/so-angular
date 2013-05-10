
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

  var merge = function(template, override) {
    for (var name in override) {
      if (name in template) {
        if (_.isObject(override[name]) && !_.isArray(override[name])) {
          template[name] = merge(template[name], override[name]);
        } else if (!_.isEqual(template[name], override[name])) {
          template[name] = override[name];
        }
      } else {
        template[name] = override[name];
      }
      if(template[name] === undefined) {
        delete template[name];
      }
    }
    return template;
  };

  // service registration for angular
  angular
    .module('sharedobject')
    .factory('diff', function() { return { difference: difference, merge: merge }; });

})();