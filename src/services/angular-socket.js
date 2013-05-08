
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
