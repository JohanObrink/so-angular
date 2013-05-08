
var lib = require('./musiclibrary')
  , SharedObjectStore = require('sharedobject/lib/sharedobjectstore').SharedObjectStore;


// sets up SharedObjects on top of socket.io
// when a new object is created, musiclibrary is called to fill the object
// with a fake library
exports.setup = function(io) {

  var sos = new SharedObjectStore(io);
  sos.on('create', function(so) {
    so.set(-1, 'library', lib.get(so.options.path), function() {
      
    });
  });

};