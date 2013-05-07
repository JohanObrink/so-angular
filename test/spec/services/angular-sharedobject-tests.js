
describe('angular-sharedobject', function() {

  var sos, socket, rootScope, scope;

  beforeEach(function() {
    module('sharedobject', function($provide) {
      socket = {
        id: 1337,
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
      rootScope = $rootScope;
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

    it('emits sharedobject-connect once', function() {
      var mock = sinon.mock(socket).expects('emit').once().withArgs('sharedobject-connect', '/path', true);
      sos.attach(scope, 'library', '/path');
      mock.verify();
    });

    it('sets getObject return value on scope', function() {
      var data = { library: { foo: 'bar' } };
      socket.emit = function(event, path, create, callback) {
        callback(null, data);
      };
      sos.attach(scope, 'library', '/path');
      expect(scope.library).to.equal(data.library);
    });
  });


  describe('SharedObject', function() {
      
    var so;

    beforeEach(function() {
      socket.emit = function(event, path, create, callback) {
        callback(null, {});
      };
      sos.attach(scope, 'library', '/path');
      so = sos.objects['/path'];
      scope.$digest();
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

    it('calls update on sharedobject-update from different socket', function() {
      var message = { sender: 42, data: { library: { foo: 'bar' }}};
      var mock = sinon.mock(so).expects('update').once().withArgs('library', message.data);
      socket.listeners['sharedobject-update'](message);
      mock.verify();
    });

    it('does not call update on sharedobject-update from own socket', function() {
      var message = { sender: 1337, data: { library: { foo: 'bar' }}};
      var mock = sinon.mock(so).expects('update').never();
      socket.listeners['sharedobject-update'](message);
      mock.verify();
    });

    it('updates scope on sharedobject-update', function() {
      var message = { sender: 42, data: { library: { foo: 'bar' }}};
      socket.listeners['sharedobject-update'](message);
      expect(so.scope.library).to.eql(message.data.library);
    });

    describe('scope.$watch', function() {

      it('watches for scope changes', function() {
        var scopeMock = sinon.mock(scope).expects('$watch').once().withArgs('library');
        sos.attach(scope, 'library', '/path');
        scopeMock.verify();
      });

      it('emits a sharedobject-set when scope changes', function(done) {
        socket.emit = function(event, property, value) {
          expect(event).to.equal('sharedobject-set');
          expect(property).to.equal('library');
          expect(value).to.eql({foo: 'bar'});
          done();
        };
        scope.library = { foo: 'bar' };
        scope.$digest();
      });
    });

  });

});


