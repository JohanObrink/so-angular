
(function() {

  var SharedObject = function(socket, path) {
    this.socket = socket;
    this.path = path;
    this.data = {};
    this.objects = [];
    this.getObject();
  };

  SharedObject.prototype.getObject = function() {
    var self = this;
    this.socket.emit('getObject', this.path, true, function(err, data) {
      if(err) {
        //console.log('Error: ', err);
      } else {
        self.updateObjects(null, data);

        self.socket.on('sharedobject-update', function(data) {
          console.log('update', self.path, data);
          self.updateObjects(data);
        });
      }
    });
  };

  SharedObject.prototype.updateObjects = function(response) {
    this.objects.forEach(function(o) {
      if(response && response.data && response.data[o.prop]) {
        o.scope[o.prop] = response.data;
      }
    });
  };

  SharedObject.prototype.attach = function(scope, prop) {
    this.objects.push({ scope: scope, prop: prop });
    var self = this;
    var socket = this.socket;
    scope.$watch(prop, function(newVal, oldVal, scope) {
      console.log('watch', self.path);
      socket.emit('sharedobject-set', prop, scope[prop]);
    }, true);
  };



  var SharedObjectStore = function(socket) {
    this.socket = socket;
    this.objects = {};
  };

  SharedObjectStore.prototype.attach = function(scope, prop, path) {

    if(!this.objects[path]) {
      console.log('new so', path);
      this.objects[path] = new SharedObject(this.socket, path);
    }
    this.objects[path].attach(scope, prop);
  };

  var factory = function(socket) {
    return new SharedObjectStore(socket);
  };

  angular
    .module('sharedobject', ['socket-io'])
    .factory('SharedObject', factory);

})();