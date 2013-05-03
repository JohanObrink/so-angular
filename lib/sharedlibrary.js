
var lib = require('./musiclibrary')
  , SharedObjectStore = require('sharedobject/lib/sharedobjectstore').SharedObjectStore;

exports.setup = function(io) {

  var sos = new SharedObjectStore(io);
  sos.on('create', function(so) {
    so.set(lib.get(so.options.path), function() {
      
    });
  });

};