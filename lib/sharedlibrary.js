
var lib = require('./musiclibrary')
  , SharedObjectStore = require('sharedobject/lib/sharedobjectstore').SharedObjectStore;

exports.setup = function(io) {

  var sos = new SharedObjectStore(io);
  sos.on('create', function(so) {
    so.set(-1, 'library', lib.get(so.options.path), function() {
      
    });
  });

};