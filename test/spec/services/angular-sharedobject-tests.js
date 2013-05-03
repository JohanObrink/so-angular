
describe('angular-sharedobject', function() {

  var sos, socket;

  beforeEach(function() {
    module('sharedobject', function($provide) {
      socket = {
        on: function() {},
        emit: function() {}
      };

      $provide.factory('socket', function() {
        return socket;
      });
    });

    inject(function(SharedObject) {
      sos = SharedObject;
    });
  });

  it('works', function() {
    expect(sos).to.exist;
    expect(sos.attach).to.be.a('function');
  });

});