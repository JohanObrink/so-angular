
(function() {

  var SharedObject = function(socket, path, scope, property) {
    this.socket = socket;
    this.path = path;
    this.scope = scope;
    this.property = property;

    this.getObject();
  };

  SharedObject.prototype.getObject = function() {
    var self = this;
    this.socket.emit('getObject', this.path, true, function(err, data) {
      if(err) {
        //console.log('Error: ', err);
      } else {
        self.scope[self.property] = data;

        self.scope.$watch(self.property, function(newVal, oldVal, scope) {
          socket.emit('sharedobject-set', prop, scope[prop]);
        }, true);

        self.socket.on('sharedobject-update', function(data) {
          self.scope[self.property] = data;
        });
      }
    });
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