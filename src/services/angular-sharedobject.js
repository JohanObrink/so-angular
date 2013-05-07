
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