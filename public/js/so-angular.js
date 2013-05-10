/*! so-angular - v0.0.2 - 2013-05-10 */
(function() {

  'use strict';

  angular.module('soApp', ['sharedobject']);
})();

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


(function() {

  'use strict';

  // SharedObject
  // -------------
  // Handles client side communication with server side SharedObject
  var SharedObject = function(socket, path, scope, property) {
    this.socket = socket;
    this.path = path;
    this.scope = scope;
    this.property = property;
    this.remotelyUpdated = false;

    this.getObject();
  };

  // ## getObject
  // This is called once on startup and initiates retrieval the entire object from the server
  SharedObject.prototype.getObject = function() {
    var self = this;
    this.socket.emit('sharedobject-connect', this.path, true, angular.bind(this, this.onConnect));
  };

  // ## onConnect
  // The return call from getObject
  // At this stage, the client has the latest version of the shared object
  // Listeners are now added to handle server- and client side changes
  SharedObject.prototype.onConnect = function(err, data) {
    this.remotelyUpdated = true;
    this.scope[this.property] = data[this.property];
    this.scope.$watch(this.property, angular.bind(this, this.onLocalChange), true);
    this.socket.on('sharedobject-update', angular.bind(this, this.onRemoteChange));
  };

  // ## update
  // This applies new data from the server onto the sope object
  SharedObject.prototype.update = function(property, data) {
    this.remotelyUpdated = true;
    this.scope[property] = data[property];
  };

  // ## onLocalChange
  // This is called when the $watch on the local scope triggers
  // If the change was initiated locally, the change is propagated to the server
  SharedObject.prototype.onLocalChange = function(newVal, oldVal, scope) {
    if(!this.remotelyUpdated) {
      this.socket.emit('sharedobject-set', this.property, scope[this.property]);
    }
    this.remotelyUpdated = false;
  };

  // ## onRemoteChange
  // Handles changes propagated from the server
  // If the initiating user was _not_ this user, update is called to apply the changes
  SharedObject.prototype.onRemoteChange = function(message) {
    if(this.socket.id !== message.sender) {
      this.update(this.property, message.data);
    }
  };

  // SharedObjectStore
  // ------------------
  // Local list of activated SharedObjects
  var SharedObjectStore = function(socket) {
    this.socket = socket;
    this.objects = {};
  };

  // ## attach
  // Requests a SharedObject for a specific path (essentially SharedObject id)
  // If it exists, it is returned. Otherwise it is created and returned.
  SharedObjectStore.prototype.attach = function(scope, property, path) {
    this.objects[path] = new SharedObject(this.socket, path, scope, property);
  };

  // factory
  // factory function for service registration
  var factory = function(socket) {
    return new SharedObjectStore(socket);
  };

  // service registration for angular
  angular
    .module('sharedobject', ['socket-io'])
    .factory('SharedObject', factory);

})();

(function() {

  'use strict';

  // service registration for angular
  angular
    .module('socket-io', [])
    .factory('socket', function ($rootScope) {

      var socket = io.connect();

      // SocketService
      // --------------
      // socket.io wrapper for angular
      var SocketService = function() {
        socket.on('connect', angular.bind(this, this.onConnect));
      };

      // ## onConnect
      // Called when the socket is connected. Adds the socket session id to the wrapper
      SocketService.prototype.onConnect = function() {
        this.id = socket.socket.sessionid;
      };

      // ## on
      // function wrappper for socket.io on
      // catches events and applies them within $rootScope.$apply
      SocketService.prototype.on = function(eventName, callback) {
        socket.on(eventName, function () {  
          var args = arguments;
          $rootScope.$apply(function () {
            callback.apply(socket, args);
          });
        });
      };

      // ## emit
      // function wrappper for socket.io emit
      // emits events and calls callback within $rootScope.$apply
      SocketService.prototype.emit = function() {
        var args = Array.prototype.slice.call(arguments);
        var callback;
        if('function' === typeof args[args.length -1]) {
          callback = args.pop();
        }
        args.push(function () {
          var args = arguments;
          $rootScope.$apply(function () {
            if (callback) {
              callback.apply(socket, args);
            }
          });
        });

        socket.emit.apply(socket, args);
      };
      
      return new SocketService();
    });

})();


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

(function() {

  'use strict';
  
  // sumItems
  // returns the total sum of all items in all arrays
  var sumItems = function(tot, cur) {
    return ((tot instanceof Array) ? tot.length : tot) + cur.length;
  };

  // toWeighted list
  // constructs an object with information needed for weighted selection from array
  var toWeightedList = function(list) {
    var items = list.slice();
    var len = items.length +1;
    var val = 1/len;
    return { items: items, t: 1, n: len, v: val };
  };

  // sortByVal
  // returns sorting based on .v property
  var sortByVal = function(w1, w2) {
    return w1.v - w2.v;
  };

  // weave
  // takes an array of arrays of possibly different lengths and interweaves them evenly
  var weave = function(lists, total) {

    if(!total) {
      total = lists.reduce(sumItems);
    }
    var weighted = lists.map(toWeightedList);
    var result = [];

    for(var i=0; i<total; i++) {
      var cur = weighted.sort(sortByVal)[0];

      cur.t++;
      cur.v = cur.t/cur.n;
      result.push(cur.items.shift());
    }

    return result;
  };

  // register as an angular service
  angular
    .module('soApp')
    .factory('weave', function() { return weave; });

})();