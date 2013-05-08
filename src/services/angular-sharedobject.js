
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