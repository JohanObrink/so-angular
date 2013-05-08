/*! so-angular - v0.0.1 - 2013-05-08 */
(function() {

  'use strict';

  angular.module('soApp', ['sharedobject']);
})();

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
          $scope.covers = weave(songs, 36);
        }
      };

      SharedObject.attach($scope, 'library', 'Johan Öbrink');

    });
})();


(function() {

  'use strict';

  var SharedObject = function(socket, path, scope, property) {
    this.socket = socket;
    this.path = path;
    this.scope = scope;
    this.property = property;
    this.remotelyUpdated = false;

    this.getObject();
  };

  SharedObject.prototype.getObject = function() {
    var self = this;
    this.socket.emit('sharedobject-connect', this.path, true, angular.bind(this, this.onConnect));
  };

  SharedObject.prototype.onConnect = function(err, data) {
    this.remotelyUpdated = true;
    this.scope[this.property] = data[this.property];
    this.scope.$watch(this.property, angular.bind(this, this.onLocalChange), true);
    this.socket.on('sharedobject-update', angular.bind(this, this.onRemoteChange));
  };

  SharedObject.prototype.update = function(property, data) {
    this.remotelyUpdated = true;
    this.scope[property] = data[property];
  };

  SharedObject.prototype.onLocalChange = function(newVal, oldVal, scope) {
    if(!this.remotelyUpdated) {
      this.socket.emit('sharedobject-set', this.property, scope[this.property]);
    }
    this.remotelyUpdated = false;
  };

  SharedObject.prototype.onRemoteChange = function(message) {
    if(this.socket.id !== message.sender) {
      this.update(this.property, message.data);
    }
  };


  var SharedObjectStore = function(socket) {
    this.socket = socket;
    this.objects = {};
  };

  SharedObjectStore.prototype.attach = function(scope, property, path) {
    this.objects[path] = new SharedObject(this.socket, path, scope, property);
  };

  var factory = function(socket) {
    return new SharedObjectStore(socket);
  };

  angular
    .module('sharedobject', ['socket-io'])
    .factory('SharedObject', factory);

})();

(function() {

  'use strict';

  angular
    .module('socket-io', [])
    .factory('socket', function ($rootScope) {

      var socket = io.connect();

      var SocketService = function() {
        socket.on('connect', angular.bind(this, this.onConnect));
      };

      SocketService.prototype.onConnect = function() {
        this.id = socket.socket.sessionid;
      };

      SocketService.prototype.on = function(eventName, callback) {
        socket.on(eventName, function () {  
          var args = arguments;
          $rootScope.$apply(function () {
            callback.apply(socket, args);
          });
        });
      };

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
  
  var sumItems = function(tot, cur) {
    return ((tot instanceof Array) ? tot.length : tot) + cur.length;
  };

  var toWeightedList = function(list) {
    var items = list.slice();
    var len = items.length +1;
    var val = 1/len;
    return { items: items, t: 1, n: len, v: val };
  };

  var sortByVal = function(w1, w2) {
    return w1.v - w2.v;
  };

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

  angular
    .module('soApp')
    .factory('weave', function() { return weave; });

})();