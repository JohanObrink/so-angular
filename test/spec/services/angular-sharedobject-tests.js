
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

  describe('SharedObject', function() {

    

  });

});