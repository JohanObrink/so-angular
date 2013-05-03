
describe('angular-sharedobject', function() {

  var sos, socket, scope;

  beforeEach(function() {
    module('sharedobject', function($provide) {
      socket = {
        listeners: {},
        on: function(event, listener) {
          this.listeners[event] = listener;
        },
        emit: function() {

        }
      };

      $provide.factory('socket', function() {
        return socket;
      });
    });

    inject(function($rootScope, SharedObject) {
      scope = $rootScope.$new();
      sos = SharedObject;
    });
  });

  it('sets up scope', function() {
    expect(scope).to.exist;
  });

  it('sets up SharedObjectStore', function() {
    expect(sos).to.exist;
    expect(sos.attach).to.be.a('function');
  });

  describe('SharedObjectStore', function() {
    
    it('creates an object and adds it to the path', function() {
      sos.attach(scope, 'library', '/path');
      expect(sos.objects).to.have.property('/path');
    });

    it('emits getObject once', function() {
      var mock = sinon.mock(socket).expects('emit').once().withArgs('getObject', '/path', true);
      sos.attach(scope, 'library', '/path');
      mock.verify();
    });

    it('sets getObject return value on scope', function() {
      var data = { foo: 'bar' };
      socket.emit = function(event, path, create, callback) {
        callback(null, data);
      };
      sos.attach(scope, 'library', '/path');
      expect(scope.library).to.equal(data);
    });
  });


  describe('SharedObject', function() {
      
    var so, scopeMock;

    beforeEach(function() {
      socket.emit = function(event, path, create, callback) {
        callback(null, {});
      };
      scopeMock = sinon.mock(scope).expects('$watch').once().withArgs('library');

      sos.attach(scope, 'library', '/path');
      so = sos.objects['/path'];
    });

    it('saves the socket, path, scope and property', function() {
      expect(so.socket).to.equal(socket);
      expect(so.path).to.equal('/path');
      expect(so.scope).to.equal(scope);
      expect(so.property).to.equal('library');
    });

    it('listens for sharedobject-update', function() {
      expect(so.socket.listeners).to.have.property('sharedobject-update');
    });

    it('updates scope on sharedobject-update', function() {
      var data = { foo: 'bar' };
      console.log(socket);
      socket.listeners['sharedobject-update'](data);
      expect(so.scope.library).to.equal(data);
    });

    it('watches for scope changes', function() {
      scopeMock.verify();
    });

  });

});


