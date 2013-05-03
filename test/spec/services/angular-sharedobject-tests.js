
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
  });


  describe('SharedObject', function() {
      
    var so;

    beforeEach(function() {
      sos.attach(scope, 'library', '/path');
      so = sos.objects['/path'];
    });

    it('saves the socket and the path', function() {
      so.socket = socket;
      so.path = '/path';
    });

  });

});