
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
